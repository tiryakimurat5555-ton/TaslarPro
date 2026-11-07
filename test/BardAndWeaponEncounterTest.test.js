// Kotlin kaynağı: test/BardAndWeaponEncounterTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';
import { StarterContent } from '../src/data/StarterContent.js';
import { CombatStance, TextTemplateEngine } from '../src/domain/engine/TextTemplateEngine.js';
import { CombatEvent, TargetBodyPart } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

let repository;

beforeEach(() => {
  SaveManager.useMemoryStorage();
  repository = new GameRepository();
});

test('testBardSongsPoolHasExpandedQuatrainsAndEpicBallads', () => {
  const quatrains = StarterContent.createBardSongs();
  const epicBallads = StarterContent.createEpicBardSongs();

  // 1. En az 19 adet 4'lük (4 eski + 15 yeni)
  expect(quatrains.length >= 19).toBe(true); // En az 19 dörtlük bulunmalı

  // 2. Tam 20 adet 8'lik destan
  expect(epicBallads.length).toBe(20); // 20 adet destansı sekizlik bulunmalı

  // 3. Her sekizliğin en az 8 dizesi olmalı
  epicBallads.forEach((ballad, index) => {
    const lines = kt
      .lines(ballad.split('🎶').join('').split('"').join(''))
      .filter((it) => it.trim().length > 0);
    // Destan ${index} en az 8 dize içermeli
    expect(lines.length >= 8).toBe(true);
  });
});

test('testBardTippingMechanicsNormalAndEpic', () => {
  const initialGold = repository.player.value.gold;
  const initialFame = repository.player.value.globalFame;

  // Normal bahşiş (1 Altın)
  const shortSong = repository.listenBardSong(false);
  expect(shortSong.length > 0).toBe(true);
  expect(repository.player.value.gold).toBe(initialGold - 1);
  expect(repository.player.value.globalFame).toBe(initialFame);
  expect(repository.currentBardSong.value).toBe(shortSong);

  // Destansı bahşiş (5 Altın)
  const epicSong = repository.listenBardSong(true);
  expect(epicSong.length > 0).toBe(true);
  expect(repository.player.value.gold).toBe(initialGold - 6);
  expect(repository.player.value.globalFame).toBe(initialFame + 1);
  expect(repository.currentBardSong.value).toBe(epicSong);
});

test('testNewlyAddedWeaponsProduceDistinctiveCombatNarratives', () => {
  const ic = (s, x) => s.toLowerCase().includes(x.toLowerCase());
  // 1. Kanatlı Teber
  const teberLog = TextTemplateEngine.generateDetailedLog('Sürgün', 'Morvath', 'Kara Çelik Kanatlı Teber', CombatEvent.CRITICAL, TargetBodyPart.CHEST, 22, 100, CombatStance.AGGRESSIVE);
  console.log(`TEBER LOG:\n${teberLog}\n`);
  expect(teberLog.includes('teber') || teberLog.includes('Teber') || teberLog.includes('kanat')).toBe(true);

  // 2. Kompozit Boynuz Yay
  const bowLog = TextTemplateEngine.generateDetailedLog('Sürgün', 'Khorvash', 'Kompozit Boynuz Yay', CombatEvent.HIT, TargetBodyPart.HEAD, 15, 60, CombatStance.OPPORTUNISTIC);
  console.log(`BOW LOG:\n${bowLog}\n`);
  expect(bowLog.includes('yay') || bowLog.includes('Yay') || bowLog.includes('ok') || bowLog.includes('Ok') || bowLog.includes('temren')).toBe(true);

  // 3. Dikenli Şafak Yıldızı
  const morningstarLog = TextTemplateEngine.generateDetailedLog(
    'Sürgün',
    'Gezgin Gladyatör',
    'Dikenli Çelik Şafak Yıldızı',
    CombatEvent.CRITICAL,
    TargetBodyPart.HEAD,
    18,
    80,
    CombatStance.BALANCED,
  );
  expect(ic(morningstarLog, 'yıldız') || ic(morningstarLog, 'dikenli') || ic(morningstarLog, 'gürz')).toBe(true);

  // 4. Çift Taraflı Savaş Baltası
  const battleAxeLog = TextTemplateEngine.generateDetailedLog('Sürgün', 'Thyra', 'Çift Taraflı Savaş Baltası', CombatEvent.CRITICAL, TargetBodyPart.SHOULDER, 20, 90, CombatStance.AGGRESSIVE);
  console.log(`BATTLE AXE LOG:\n${battleAxeLog}\n`);
  expect(battleAxeLog.includes('balta') || battleAxeLog.includes('Balta') || battleAxeLog.includes('nacak')).toBe(true);
});
