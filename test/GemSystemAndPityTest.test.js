// Kotlin kaynağı: test/GemSystemAndPityTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';
import { Equipment, EquipmentSlot, Gem, GemCraftingRules, GemType, ItemRarity, Stats } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

let repository;

beforeEach(() => {
  SaveManager.useMemoryStorage();
  repository = new GameRepository();
});

test('testGemScalingAndPureStats', () => {
  // 1. Zümrüt (Can Taşı) - Her seviyede yaklaşık +%90 geometrik artış
  const zumrut1 = Gem.create(GemType.ZUMRUT, 1);
  const zumrut2 = Gem.create(GemType.ZUMRUT, 2);
  const zumrut3 = Gem.create(GemType.ZUMRUT, 3);
  const zumrut4 = Gem.create(GemType.ZUMRUT, 4);
  const zumrut7 = Gem.create(GemType.ZUMRUT, 7);

  expect(zumrut1.stats.maxHealth).toBe(15); // Sv. 1 Zümrüt Can
  expect(zumrut2.stats.maxHealth).toBe(29); // Sv. 2 Zümrüt Can (~15 * 1.90)
  expect(zumrut3.stats.maxHealth).toBe(54); // Sv. 3 Zümrüt Can (~28 * 1.90)
  expect(zumrut4.stats.maxHealth).toBe(103); // Sv. 4 Zümrüt Can
  expect(zumrut7.stats.maxHealth).toBe(706); // Sv. 7 Zümrüt Can

  // 2. Yakut (Hasar Taşı)
  const yakut1 = Gem.create(GemType.YAKUT, 1);
  const yakut2 = Gem.create(GemType.YAKUT, 2);
  const yakut3 = Gem.create(GemType.YAKUT, 3);
  const yakut4 = Gem.create(GemType.YAKUT, 4);

  expect(yakut1.stats.damage).toBe(3); // Sv. 1 Yakut Hasar
  expect(yakut2.stats.damage).toBe(6); // Sv. 2 Yakut Hasar
  expect(yakut3.stats.damage).toBe(11); // Sv. 3 Yakut Hasar
  expect(yakut4.stats.damage).toBe(21); // Sv. 4 Yakut Hasar

  // 3. Safir (Zırh Taşı)
  const safir1 = Gem.create(GemType.SAFIR, 1);
  const safir2 = Gem.create(GemType.SAFIR, 2);
  const safir3 = Gem.create(GemType.SAFIR, 3);

  expect(safir1.stats.armor).toBe(2); // Sv. 1 Safir Zırh
  expect(safir2.stats.armor).toBe(4); // Sv. 2 Safir Zırh
  expect(safir3.stats.armor).toBe(7); // Sv. 3 Safir Zırh

  // 4. Saf istatistik kontrolü: Büyülü fantezi proc'ları (dondurma, yakma vb.) bulunmamalı
  expect(zumrut1.effectSummary.includes('dondurur')).toBe(false); // Taş efektinde donma büyüsü olmamalı
  expect(yakut1.effectSummary.includes('yakma')).toBe(false); // Taş efektinde yakma büyüsü olmamalı
});

test('testCombineGemShards', () => {
  // Altın yetersizken sentez engellenmeli
  repository.setPlayerForTesting(
    repository.player.value.copy({
      gold: 5,
      hasGarrisonPass: true,
      gemShards: { [GemType.YAKUT]: 3 },
    }),
  );
  const [failRes, failMsg] = repository.combineGemShards(GemType.YAKUT);
  expect(failRes).toBe(false); // Yetersiz altınla sentez başarısız olmalı
  expect(failMsg.includes('Altın')).toBe(true);

  // Yeterli altın ile sentez
  const updated = repository.player.value.copy({
    gold: 100,
    hasGarrisonPass: true,
    gemShards: { [GemType.YAKUT]: 3 },
  });
  repository.setPlayerForTesting(updated);

  // Shard sayısını kontrol et
  expect(repository.player.value.getShardCount(GemType.YAKUT)).toBe(3);

  const [success, msg] = repository.combineGemShards(GemType.YAKUT);
  expect(success).toBe(true);
  expect(msg.includes('SENTEZ BAŞARILI')).toBe(true);

  const afterP = repository.player.value;
  expect(afterP.getShardCount(GemType.YAKUT)).toBe(0); // 3 kırık tüketildi, 0 kalmalı
  expect(kt.count(afterP.gemsInventory, (it) => it.type === GemType.YAKUT && it.level === 1)).toBe(1); // 1 adet Sv. 1 Yakut çantaya eklendi
  expect(afterP.gold).toBe(85); // 15 altın zanaat ücreti kesildi (100 - 15 = 85)
});

test('testBulkOperations', () => {
  let initialEq = kt.firstOrNull(repository.player.value.inventory);
  if (initialEq == null) {
    const starterWeapon = new Equipment({
      id: 'test_eq_bulk',
      name: 'Test Palası',
      slot: EquipmentSlot.WEAPON,
      rarity: ItemRarity.KADIM, // Max 3 sockets
      stats: new Stats({ damage: 5 }),
      description: 'Test palası',
      unlockedSockets: 0,
    });
    repository.setPlayerForTesting(repository.player.value.copy({ inventory: [starterWeapon] }));
    initialEq = starterWeapon;
  }

  repository.setPlayerForTesting(
    repository.player.value.copy({
      gold: 1000,
      hasGarrisonPass: true,
      inventory: [initialEq.copy({ unlockedSockets: 0, rarity: ItemRarity.KADIM })],
      gemShards: {
        [GemType.YAKUT]: 6,
        [GemType.SAFIR]: 3,
        [GemType.ZUMRUT]: 2, // Yetersiz (2 adet)
      },
    }),
  );

  // 1. Toplu Kırık Sentezleme (combineAllGemShards)
  // 6 Yakut kırığı -> 2 Yakut taşı (30 altın)
  // 3 Safir kırığı -> 1 Safir taşı (15 altın)
  // Toplam 3 işlem = 45 altın kesilmeli
  const [bulkSuccess, bulkMsg] = repository.combineAllGemShards();
  expect(bulkSuccess).toBe(true); // Toplu sentez başarılı olmalı
  expect(bulkMsg.includes('3 adet')).toBe(true); // 3 adet cevher dövülmeli
  const pAfterBulk = repository.player.value;
  expect(pAfterBulk.gold).toBe(955); // 1000 - 45
  expect(pAfterBulk.getShardCount(GemType.YAKUT)).toBe(0);
  expect(pAfterBulk.getShardCount(GemType.SAFIR)).toBe(0);
  expect(pAfterBulk.getShardCount(GemType.ZUMRUT)).toBe(2); // 2 kırık kaldı
  expect(kt.count(pAfterBulk.gemsInventory, (it) => it.type === GemType.YAKUT && it.level === 1)).toBe(2);
  expect(kt.count(pAfterBulk.gemsInventory, (it) => it.type === GemType.SAFIR && it.level === 1)).toBe(1);

  // 2. Toplu Yuva Açma (unlockAllSocketsForEquipment)
  // EPIC eşya: max 3 yuva. 0'dan 3'e açılacak: 50 + 100 + 150 = 300g
  const eqId = kt.first(repository.player.value.inventory).id;
  const [drillSuccess, drillMsg] = repository.unlockAllSocketsForEquipment(eqId);
  expect(drillSuccess).toBe(true);
  const pAfterDrill = repository.player.value;
  const drilledEq = kt.firstOrNull(pAfterDrill.inventory, (it) => it.id === eqId);
  expect(drilledEq.unlockedSockets).toBe(3);
  expect(pAfterDrill.gold).toBe(655); // 955 - 300

  // 3. Mıhlama Ücreti (25g) ve Sökme Ücreti (20g)
  const yakutGem = kt.first(pAfterDrill.gemsInventory, (it) => it.type === GemType.YAKUT);
  const [socketSuccess] = repository.insertGemIntoEquipment(eqId, yakutGem.id);
  expect(socketSuccess).toBe(true);
  const pAfterSocket = repository.player.value;
  expect(pAfterSocket.gold).toBe(630); // 655 - 25
  const socketedEq = kt.firstOrNull(pAfterSocket.inventory, (it) => it.id === eqId);
  expect(socketedEq.sockets.length).toBe(1);

  const [removeSuccess] = repository.removeGemFromEquipment(eqId, 0);
  expect(removeSuccess).toBe(true);
  const pAfterRemove = repository.player.value;
  expect(pAfterRemove.gold).toBe(610); // 630 - 20
  const removedEq = kt.firstOrNull(pAfterRemove.inventory, (it) => it.id === eqId);
  expect(removedEq.sockets.length).toBe(0);
});

test('testGemUpgradePityAndRates', () => {
  // Temel oranlar
  expect(GemCraftingRules.getBaseSuccessRate(2)).toBe(100); // 1 -> 2
  expect(GemCraftingRules.getBaseSuccessRate(3)).toBe(85); // 2 -> 3
  expect(GemCraftingRules.getBaseSuccessRate(4)).toBe(70); // 3 -> 4
  expect(GemCraftingRules.getBaseSuccessRate(6)).toBe(40); // 5 -> 6
  expect(GemCraftingRules.getBaseSuccessRate(7)).toBe(25); // 6 -> 7

  // Pity hesaplaması
  const targetLvl = 6;
  const baseRate = GemCraftingRules.getBaseSuccessRate(targetLvl); // 40
  const withPity = GemCraftingRules.getEffectiveSuccessRate(targetLvl, 14); // 40 + 14 = 54
  expect(withPity).toBe(54);

  // 100 üstüne taşmama garantisi
  expect(GemCraftingRules.getEffectiveSuccessRate(targetLvl, 80)).toBe(100);

  // Oyuncuya 3 adet Sv. 1 taş verip Sv. 2'ye yükseltme (Sv. 2 temel şansı %100'dür)
  repository.setPlayerForTesting(
    repository.player.value.copy({
      gold: 500,
      hasGarrisonPass: true,
      gemsInventory: [Gem.create(GemType.SAFIR, 1), Gem.create(GemType.SAFIR, 1), Gem.create(GemType.SAFIR, 1)],
    }),
  );

  const [success, message] = repository.upgradeGemLevel(GemType.SAFIR, 1);
  expect(success).toBe(true); // Sv. 1 -> Sv. 2 %100 başarıyla sonuçlanmalı
  expect(message.includes('BAŞARILI')).toBe(true);
  const afterP = repository.player.value;
  expect(kt.count(afterP.gemsInventory, (it) => it.type === GemType.SAFIR && it.level === 2)).toBe(1); // 1 adet Sv. 2 Safir oluşmalı
  expect(afterP.gold).toBe(470); // Sv. 1 yükseltme bedeli 30 altındır (500 - 30 = 470)
});

test('testChapter1GladiatorsDoNotUseGems', () => {
  // 1. Bölümde (hasGarrisonPass = false)
  repository.setPlayerForTesting(
    repository.player.value.copy({
      hasGarrisonPass: false,
      gemShards: { [GemType.YAKUT]: 3 },
      gold: 500,
    }),
  );
  expect(repository.canTravelToRegion2).toBe(false); // 1. Bölümde oyuncu 2. bölgeye seyahat edemez

  // 1. Bölümde oyuncu taş zanaatı yapamaz (kilitlidir)
  const [combineSuccess, combineMsg] = repository.combineGemShards(GemType.YAKUT);
  expect(combineSuccess).toBe(false); // 1. Bölümde taş sentezi kilitli olmalı
  expect(combineMsg.includes('kilitli')).toBe(true);

  // Günlük simülasyon işletildiğinde 1. Bölüm gladyatörleri (Kırlangıç 11 gladyatör) ASLA taş toplamaz
  for (let day = 1; day <= 3; day++) {
    repository.evolveNpcFightersDaily();
  }

  const kirlangicGladiators = repository.enemies.value;
  expect(kirlangicGladiators.length).toBe(11); // Kırlangıç Kasabası 11 gladyatör içermeli
  expect(kirlangicGladiators.every((it) => it.socketedGems.length === 0 && kt.isEmpty(it.shards))).toBe(true); // 1. Bölüm gladyatörleri hiçbir zaman taş soketleyemez veya kırık toplayamaz

  // 1. Bölüm devam ederken Taş Hisar gladyatörleri de henüz aktifleşmemiştir (taş toplamaz)
  const tashisarGladiators = repository.tashisarEnemies.value;
  expect(tashisarGladiators.length).toBe(40); // Taş Hisar 40 gladyatör içermeli
  expect(tashisarGladiators.every((it) => it.socketedGems.length === 0 && kt.isEmpty(it.shards))).toBe(true); // 1. Bölüm devam ederken Taş Hisar gladyatörleri henüz evrilmemelidir
});

test('testTashisarGladiatorsEvolveAndUseGems', () => {
  // 2. Bölüm açıldığında (hasGarrisonPass = true)
  repository.setPlayerForTesting(repository.player.value.copy({ hasGarrisonPass: true }));
  const initialTashisar = repository.tashisarEnemies.value;
  expect(initialTashisar.length === 40).toBe(true); // Taş Hisar gladyatörleri yüklenmiş olmalı (40 dövüşçü)

  // Simülasyon günleri boyunca madenlerden hasat edip arena ödülleriyle altın biriktirerek taş yaparlar
  for (let day = 1; day <= 4; day++) {
    repository.evolveNpcFightersDaily();
  }

  const evolvedTashisar = repository.tashisarEnemies.value;
  // Gladyatörler gün geçtikçe madenlerden kırık toplayıp altınları yettikçe taş üretmeli
  const hasShardsOrGems = evolvedTashisar.some((it) => kt.isNotEmpty(it.shards) || it.socketedGems.length > 0);
  expect(hasShardsOrGems).toBe(true); // Gladyatörler madenlerden kırık toplamış veya taş mıhlamış olmalı

  // Taş Hisar günlük kayıtlarının da üretildiğini doğrula
  const diaries = repository.evolveNpcFightersDaily();
  const tashisarDiaries = diaries.filter((it) => it.startsWith('[Taş Hisar]'));
  expect(tashisarDiaries.length > 0).toBe(true); // Taş Hisar gladyatör günlükleri üretilmeli
});
