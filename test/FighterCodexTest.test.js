// Kotlin kaynağı: test/FighterCodexTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';
import * as kt from '../src/kt.js';

beforeEach(() => {
  SaveManager.useMemoryStorage();
});

test('testInitialCodexIsEmpty', () => {
  const repository = new GameRepository();
  const dossiers = repository.getEncounteredEnemyDossiers();
  expect(dossiers.length === 0).toBe(true); // Yeni başlayan oyuncunun kütüğü başlangıçta boş olmalıdır
});

test('testCombatRegistersEnemyToCodex', () => {
  const repository = new GameRepository();
  const enemy = kt.first(repository.enemies.value);

  // Before combat
  expect(repository.player.value.encounteredEnemyIds.includes(enemy.id)).toBe(false);
  expect(repository.getEncounteredEnemyDossiers().length === 0).toBe(true);

  // Execute combat
  repository.executeCombat(enemy);

  // After combat
  expect(repository.player.value.encounteredEnemyIds.includes(enemy.id)).toBe(true); // Dövüşülen rakip encounteredEnemyIds içinde yer almalı
  const dossiers = repository.getEncounteredEnemyDossiers();
  expect(dossiers.length).toBe(1);
  expect(kt.first(dossiers).enemy.id).toBe(enemy.id);
  expect(kt.first(dossiers).isWeaknessKnown).toBe(false); // Kusuru bilinmeyen düşmanın isWeaknessKnown değeri false olmalı
  expect(kt.first(dossiers).enemy.personality.bio).not.toBeNull(); // Düşmanın arka plan biyografisi olmalı
  expect(kt.first(dossiers).enemy.personality.bio).not.toBeUndefined();
});

test('testBuyingIntelRegistersEnemyAndWeaknessToCodex', () => {
  const repository = new GameRepository();

  // Başlangıç altını 25 olduğu için 20 altın rüşvet ile test ediyoruz
  const [success, msg] = repository.buyRandomEnemyIntel(20);
  expect(success).toBe(true);
  expect(msg.includes('Muhbir')).toBe(true);

  const dossiers = repository.getEncounteredEnemyDossiers();
  expect(dossiers.length).toBe(1); // Satın alınan istihbarat kütüğe 1 savaşçı kaydetmeli

  const dossier = kt.first(dossiers);
  expect(dossier.isWeaknessKnown).toBe(true); // Açığı satın alınan dövüşçünün zaafiyeti çözülmüş olmalı
  expect(dossier.weakness).not.toBeNull();
  expect(dossier.weakness.flawTitle.length > 0).toBe(true);
});

test('testCodexOnlyShowsEncounteredFighters', () => {
  const repository = new GameRepository();
  const allEnemies = repository.enemies.value;
  expect(allEnemies.length > 1).toBe(true); // Arenada birden fazla düşman bulunmalı

  const firstEnemy = allEnemies[0];
  repository.executeCombat(firstEnemy);

  const dossiers = repository.getEncounteredEnemyDossiers();
  expect(dossiers.length).toBe(1);
  expect(dossiers[0].enemy.id).toBe(firstEnemy.id);

  // Diğer karşılaşılmayan düşmanlar kütükte yer almamalı
  const unencounteredIds = kt.drop(allEnemies, 1).map((it) => it.id);
  for (const id of unencounteredIds) {
    expect(dossiers.some((it) => it.enemy.id === id)).toBe(false); // Karşılaşılmayan düşman kütükte olmamalı
  }
});

test('testChapter1GladiatorCountAndLeagueSize', () => {
  const repository = new GameRepository();
  const chapter1Enemies = repository.enemies.value;

  // Bölüm 1'deki benzersiz düşman gladyatör sayısı tam 11 olmalıdır
  expect(chapter1Enemies.length).toBe(11);

  // Tüm Bölüm 1 gladyatörleri 'kirlangic' bölgesine ait olmalıdır
  expect(chapter1Enemies.every((it) => it.regionId === 'kirlangic')).toBe(true);

  // Lig tablosunda oyuncu ile birlikte tam 12 katılımcı olmalıdır
  const leagueParticipants = repository.leagueState.value.standings;
  expect(leagueParticipants.length).toBe(12);
});

test('testRegionalCodexAndProfileFiltering', () => {
  const repository = new GameRepository();
  const player = repository.player.value;

  // Başlangıçta oyuncu Kırlangıç Kasabasındadır ve Garnizon geçiş belgesi yoktur
  expect(player.currentRegionId).toBe('kirlangic');
  expect(player.hasGarrisonPass).toBe(false);
  expect(player.getUnlockedRegionIds()).toEqual(['kirlangic']);

  // 1. Bölümdeyken karakter sicili yalnızca Kırlangıç karakterlerini (11 gladyatör + 6 ahali = 17) döndürmelidir
  const initialProfiles = repository.getAllCharacterProfilesWithLiveState();
  expect(initialProfiles.length).toBe(17);
  expect(initialProfiles.every((it) => it.profile.regionId === 'kirlangic')).toBe(true);
  expect(initialProfiles.some((it) => it.profile.regionId === 'tashisar')).toBe(false);

  // Garnizon geçiş izni verildiğinde Taş Hisar da açılmalıdır
  repository.setPlayerForTesting(repository.player.value.copy({ hasGarrisonPass: true }));
  const unlockedRegions = repository.player.value.getUnlockedRegionIds();
  expect(unlockedRegions.includes('kirlangic')).toBe(true);
  expect(unlockedRegions.includes('tashisar')).toBe(true);

  // Taş Hisar açıldığında profil listesi Kırlangıç + Taş Hisar karakterlerini içermelidir
  const expandedProfiles = repository.getAllCharacterProfilesWithLiveState();
  expect(expandedProfiles.length).toBe(65); // 17 Kırlangıç (11+6) + 48 Taş Hisar (40+8 Mirza Nizar dahil) = 65
  expect(expandedProfiles.some((it) => it.profile.regionId === 'kirlangic')).toBe(true);
  expect(expandedProfiles.some((it) => it.profile.regionId === 'tashisar')).toBe(true);
});
