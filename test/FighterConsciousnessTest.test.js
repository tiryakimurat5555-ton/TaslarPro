// Kotlin kaynağı: test/FighterConsciousnessTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';
import { PersonalityArchetype } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

let repository;

beforeEach(() => {
  SaveManager.useMemoryStorage();
  repository = new GameRepository();
});

test('cannot advance day without fighting or placing spectator bet', () => {
  const initialDay = repository.dayState.value.currentDay;
  expect(repository.dayState.value.isDailyArenaObligationMet).toBe(false); // Başlangıçta arena şartı sağlanmamış olmalı

  const resultMsg = repository.advanceDay(0);
  expect(resultMsg.includes('Arenaya uğramadan')).toBe(true); // Uyarı mesajı içermeli
  expect(repository.dayState.value.currentDay).toBe(initialDay); // Gün artmamalı
});

test('placing spectator bet fulfills daily arena obligation', () => {
  const fixture = repository.leagueState.value.currentFixture;
  const npcMatch = kt.firstOrNull(fixture, (it) => !it.isPlayerMatch);
  expect(npcMatch).not.toBeNull(); // NPC maçı bulunmalı

  const initialGold = repository.player.value.gold;
  const [success] = repository.placeSpectatorBet(npcMatch, npcMatch.fighter1Name, 10);

  expect(success).toBe(true);
  expect(repository.dayState.value.isDailySpectatorBetPlaced).toBe(true);
  expect(repository.dayState.value.isDailyArenaObligationMet).toBe(true);
  expect(repository.player.value.gold).toBe(initialGold - 10);
});

test('advance day after spectator bet resolves and evolves npc fighters', () => {
  const initialDay = repository.dayState.value.currentDay;
  const fixture = repository.leagueState.value.currentFixture;
  const npcMatch = kt.first(fixture, (it) => !it.isPlayerMatch);

  // Seyirci bahsi yatır
  repository.placeSpectatorBet(npcMatch, npcMatch.fighter1Name, 10);

  const initialEnemies = kt.associate(repository.enemies.value, (it) => [it.id, it.stats]);

  // Gün atla
  const narrative = repository.advanceDay(0);

  expect(repository.dayState.value.currentDay).toBe(initialDay + 1); // Gün 1 artmış olmalı
  expect(repository.dayState.value.isArenaMatchDoneToday).toBe(false); // Yeni günde arena maçı sıfırlanmalı
  expect(repository.dayState.value.isDailySpectatorBetPlaced).toBe(false); // Yeni günde seyirci bahsi sıfırlanmalı

  // Dövüşçülerin günlükleri ve evrimleri kontrol edilir
  const evolvedEnemies = repository.enemies.value;
  expect(evolvedEnemies.length).toBe(11);

  for (const enemy of evolvedEnemies) {
    expect(enemy.personality).not.toBeNull();
    expect(enemy.personality.latestDiary.length > 0).toBe(true); // Günlüğü güncellenmiş olmalı
  }
});

test('all 11 initial enemies have distinct personalities assigned', () => {
  const enemies = repository.enemies.value;
  expect(enemies.length).toBe(11);

  const archetypes = kt.distinct(enemies.map((it) => it.personality.archetype));
  expect(archetypes.length >= 4).toBe(true); // Çeşitli kişilik arketipleri bulunmalı
  expect(archetypes.includes(PersonalityArchetype.HIRSLI)).toBe(true); // Hırslı arketipi bulunmalı
  expect(archetypes.includes(PersonalityArchetype.TEMBEL)).toBe(true); // Tembel arketipi bulunmalı
  expect(archetypes.includes(PersonalityArchetype.VAHSI)).toBe(true); // Vahşi arketipi bulunmalı
  expect(archetypes.includes(PersonalityArchetype.KURNAZ)).toBe(true); // Kurnaz arketipi bulunmalı
});
