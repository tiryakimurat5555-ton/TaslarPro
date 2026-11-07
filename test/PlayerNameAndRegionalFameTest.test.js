// Kotlin kaynağı: test/PlayerNameAndRegionalFameTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';
import { calculatePlayerTitleForRegion } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

let repository;

beforeEach(() => {
  SaveManager.useMemoryStorage();
  repository = new GameRepository();
});

test('testSetPlayerNameUpdatesPlayerAndLeague', () => {
  // Varsayılan isim
  expect(repository.player.value.name).toBe('Sürgün Silahşör');

  // Yeni isim belirleme
  const chosenName = 'Kuzgun Alaz';
  repository.setPlayerName(chosenName);

  // 1. Oyuncu ismi güncellendi mi?
  expect(repository.player.value.name).toBe(chosenName);

  // 2. Lig sıralamasında oyuncunun adı güncellendi mi?
  const playerStanding = kt.firstOrNull(repository.leagueState.value.standings, (it) => it.isPlayer);
  expect(playerStanding).not.toBeNull(); // Ligde oyuncu bulunmalı
  expect(playerStanding.name).toBe(chosenName); // Ligdeki oyuncu adı güncellenmeli

  // 3. Fikstürdeki oyuncu maçında ad güncellendi mi?
  const playerMatch = kt.firstOrNull(repository.leagueState.value.currentFixture, (it) => it.isPlayerMatch);
  expect(playerMatch).not.toBeNull(); // Fikstürde oyuncu maçı bulunmalı
  expect(playerMatch.fighter1Name).toBe(chosenName); // Fikstürde oyuncu adı güncellenmeli
});

test('testSetEmptyPlayerNameFallsBackToDefault', () => {
  repository.setPlayerName('   ');
  expect(repository.player.value.name).toBe('Sürgün Silahşör'); // Boş girildiğinde varsayılan ada dönmeli
});

test('testKirlangicAndTashisarTitlesAreDifferent', () => {
  // 0 Şöhret
  const kirlangicTitle0 = calculatePlayerTitleForRegion('kirlangic', 0);
  const tashisarTitle0 = calculatePlayerTitleForRegion('tashisar', 0);
  expect(kirlangicTitle0).toBe('Bilinmeyen Sürgün');
  expect(tashisarTitle0).toBe('Garnizon Yabancısı');
  expect(kirlangicTitle0).not.toBe(tashisarTitle0);

  // 10 Şöhret (Taş Hisar başlangıç düzeyi)
  const kirlangicTitle10 = calculatePlayerTitleForRegion('kirlangic', 10);
  const tashisarTitle10 = calculatePlayerTitleForRegion('tashisar', 10);
  expect(kirlangicTitle10).toBe('Fısıltısı Duyulan');
  expect(tashisarTitle10).toBe('Kasabadan Gelen Sürgün');

  // 50 Şöhret
  const kirlangicTitle50 = calculatePlayerTitleForRegion('kirlangic', 50);
  const tashisarTitle50 = calculatePlayerTitleForRegion('tashisar', 50);
  expect(kirlangicTitle50).toBe('Korkulan Silahşör');
  expect(tashisarTitle50).toBe('Fırtına Silahşörü');

  // 100 Şöhret
  const kirlangicTitle100 = calculatePlayerTitleForRegion('kirlangic', 100);
  const tashisarTitle100 = calculatePlayerTitleForRegion('tashisar', 100);
  expect(kirlangicTitle100).toBe('Kırlangıç Kasabası Fatihi');
  expect(tashisarTitle100).toBe('Garnizon Hükümdarı');
});

test('testTashisarStartsAt10FameWhenGarrisonPassUnlocked', () => {
  const player = repository.player.value;

  // Başlangıçta Kırlangıç'ta şöhret 0, Taş Hisar 0
  expect(player.getFameForRegion('kirlangic')).toBe(0);
  expect(player.getFameForRegion('tashisar')).toBe(0);

  // Kırlangıç tamamlandığında (hasGarrisonPass = true)
  const unlockedPlayer = player.copy({ hasGarrisonPass: true });
  expect(unlockedPlayer.getFameForRegion('tashisar')).toBe(10); // Kırlangıç bittiğinde Taş Hisar taban şöhreti 10 olmalıdır
  expect(unlockedPlayer.getTitleForRegion('tashisar')).toBe('Kasabadan Gelen Sürgün');
});
