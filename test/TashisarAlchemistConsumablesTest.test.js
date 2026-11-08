// Kotlin kaynağı: test/TashisarAlchemistConsumablesTest.kt
import { test, expect } from 'bun:test';
import { StarterContent } from '../src/data/StarterContent.js';
import { TashisarAlchemistConsumablesData } from '../src/data/TashisarAlchemistConsumablesData.js';
import { CombatEngine } from '../src/domain/engine/CombatEngine.js';
import { ActiveBuffEffect, Enemy, ItemType, NpcRole, Player, Stats, UsableCategory } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

const icerirBuyukKucukHarfsiz = (metin, aranan) => metin.toLowerCase().includes(aranan.toLowerCase());

test('testTashisarAlchemistConsumablesDataComplete150Items', () => {
  const potions = TashisarAlchemistConsumablesData.createPotions();
  const ointments = TashisarAlchemistConsumablesData.createOintments();
  const herbs = TashisarAlchemistConsumablesData.createHerbs();
  const allConsumables = TashisarAlchemistConsumablesData.createAllAlchemistConsumables();

  // 1. Sayı Doğrulaması (50 İksir, 50 Merhem, 50 Şifalı Ot = 150 Tüketim Eşyası)
  expect(potions.length).toBe(50); // Simyacıda tam 50 adet iksir ve tentür olmalıdır
  expect(ointments.length).toBe(50); // Simyacıda tam 50 adet savaş merhemi ve silah yağı olmalıdır
  expect(herbs.length).toBe(50); // Simyacıda tam 50 adet şifalı ot ve kök olmalıdır
  expect(allConsumables.length).toBe(150); // Toplamda tam 150 adet simyacı eşyası olmalıdır

  // 2. Benzersiz ID Doğrulaması
  const allIds = new Set(allConsumables.map((it) => it.id));
  expect(allIds.size).toBe(150); // 150 tüketim eşyasının tüm ID'leri benzersiz olmalıdır

  // 3. İksirler (POTION) Doğrulaması
  potions.forEach((pot) => {
    expect(pot.usableCategory).toBe(UsableCategory.POTION);
    expect(pot.type).toBe(ItemType.POTION);
    expect(pot.requiredLevel >= 20 && pot.requiredLevel <= 39).toBe(true);
    expect(pot.valueInGold > 0).toBe(true);
    expect(kt.isNotBlank(pot.name)).toBe(true);
    expect(kt.isNotBlank(pot.description)).toBe(true);
    expect(pot.healAmount > 0 || pot.buffEffect != null).toBe(true);
  });

  // 4. Savaş Merhemleri & Silah Yağları (OINTMENT) Doğrulaması
  ointments.forEach((oint) => {
    expect(oint.usableCategory).toBe(UsableCategory.OINTMENT);
    expect(oint.type).toBe(ItemType.OINTMENT);
    expect(oint.requiredLevel >= 20 && oint.requiredLevel <= 39).toBe(true);
    expect(oint.valueInGold > 0).toBe(true);
    expect(kt.isNotBlank(oint.name)).toBe(true);
    expect(kt.isNotBlank(oint.description)).toBe(true);
    expect(oint.buffEffect).not.toBeNull(); // Tüm merhemlerin aktif bir buff etkisi olmalıdır
    const buff = oint.buffEffect;
    const hasProcOrStat =
      buff.poisonChancePercent > 0 || buff.fireChancePercent > 0 ||
      buff.frostChancePercent > 0 || buff.lifestealPercent > 0 ||
      buff.damageMitigationPercent > 0 || buff.bonusDamage > 0 || buff.bonusArmor > 0;
    expect(hasProcOrStat).toBe(true); // `Merhem buff'ının en az bir etkisi (proc veya stat) bulunmalıdır: ${oint.name}`
  });

  // 5. Şifalı Bitkiler & Kökler (HERB) Doğrulaması
  herbs.forEach((herb) => {
    expect(herb.usableCategory).toBe(UsableCategory.HERB);
    expect(herb.type).toBe(ItemType.HERB);
    expect(herb.requiredLevel >= 20 && herb.requiredLevel <= 39).toBe(true);
    expect(herb.valueInGold > 0).toBe(true);
    expect(herb.healAmount > 0).toBe(true);
    expect(kt.isNotBlank(herb.name)).toBe(true);
    expect(kt.isNotBlank(herb.description)).toBe(true);
  });

  // 6. Buff ID Benzersizliği
  const buffIds = kt.mapNotNull(allConsumables, (it) => it.buffEffect?.id);
  const uniqueBuffIds = new Set(buffIds);
  expect(uniqueBuffIds.size).toBe(buffIds.length); // Tüm buff ID'leri benzersiz olmalıdır
});

test('testAlchemistVanyaShopInRegion2', () => {
  const region2 = StarterContent.createRegion2();
  const vanya = kt.firstOrNull(region2.npcs, (it) => it.role === NpcRole.ALCHEMIST);

  expect(vanya).not.toBeNull(); // Taş Hisar'da Simyacı Vanya bulunmalıdır
  expect(vanya.id).toBe('npc_vanya');
  expect(vanya.name).toBe('Simyacı Vanya');
  expect(vanya.title).toBe('Garnizon Tabibi & Baş Simyager');
  expect(vanya.consumablesForSale.length).toBe(170); // 150 Taş Hisar tüketim eşyası ve 20 Er Meydanı yağı

  const potions = vanya.consumablesForSale.filter((it) => it.usableCategory === UsableCategory.POTION);
  const ointments = vanya.consumablesForSale.filter((it) => it.usableCategory === UsableCategory.OINTMENT);
  const herbs = vanya.consumablesForSale.filter((it) => it.usableCategory === UsableCategory.HERB);
  const pehlivanOils = vanya.consumablesForSale.filter((it) => it.usableCategory === UsableCategory.PEHLIVAN_OIL);

  expect(potions.length).toBe(50);
  expect(ointments.length).toBe(50);
  expect(herbs.length).toBe(50);
  expect(pehlivanOils.length).toBe(20);
});

test('testActiveBuffStatIntegrationWithPlayer', () => {
  const basePlayer = new Player({
    name: 'Test Savaşçısı',
    baseStats: new Stats({ damage: 20, armor: 10, speed: 15, maxHealth: 200, critChancePercent: 10 }),
    currentHealth: 200,
  });

  expect(basePlayer.totalStats.damage).toBe(20);
  expect(basePlayer.totalStats.armor).toBe(10);
  expect(basePlayer.totalStats.speed).toBe(15);
  expect(basePlayer.totalStats.critChancePercent).toBe(10);

  // Bir iksir buff'ı eklenince totalStats otomatik artmalı
  const kudretBuff = new ActiveBuffEffect({
    id: 'buff_test_kudret',
    name: 'Kudret Özü',
    icon: '',
    description: '+10 Hasar, +5 Zırh, +4 Hız, +%6 Kritik',
    bonusDamage: 10,
    bonusArmor: 5,
    bonusSpeed: 4,
    bonusCritChance: 6,
    remainingBattles: 1,
  });

  const buffedPlayer = basePlayer.copy({ activeBuffs: [kudretBuff] });

  expect(buffedPlayer.totalStats.damage).toBe(30);
  expect(buffedPlayer.totalStats.armor).toBe(15);
  expect(buffedPlayer.totalStats.speed).toBe(19);
  expect(buffedPlayer.totalStats.critChancePercent).toBe(16);
});

test('testCombatEngineWithOffensiveAndDefensiveBuffs', () => {
  const player = new Player({
    name: 'Simyacı Savaşçı',
    level: 25,
    baseStats: new Stats({ damage: 35, armor: 20, speed: 25, maxHealth: 350, critChancePercent: 15 }),
    currentHealth: 350,
    activeBuffs: [
      new ActiveBuffEffect({
        id: 'buff_combat_test_oil',
        name: 'Zehirli Kara Merhem',
        icon: '',
        description: 'Zehir ve koruma',
        poisonChancePercent: 100, // Her vuruşta kesin zehir testi
        poisonDamagePerHit: 15,
        damageMitigationPercent: 25, // %25 gelen hasar indirimi
        lifestealPercent: 20, // %20 can çalma
        remainingBattles: 1,
      }),
    ],
  });

  const enemy = new Enemy({
    id: 'test_goblin',
    name: 'Garnizon Casusu',
    title: 'Casus',
    level: 20,
    stats: new Stats({ damage: 20, armor: 5, speed: 10, maxHealth: 200 }),
    weaponName: 'Paslı Kama',
    description: 'Garnizon casusu',
    rewardGold: 30,
    rewardExp: 40,
    rewardFame: 1,
  });

  const result = CombatEngine.simulateBattle(player, enemy);

  expect(result.totalRounds > 0).toBe(true); // Savaş tamamlanmalıdır
  // Zehir tetiklenmesi veya darbe loglarında merhem notu yer almalıdır
  const narrativeJoined = result.logs.map((it) => it.narrativeText).join('\n');
  const hasBuffEffectInLog =
    icerirBuyukKucukHarfsiz(narrativeJoined, 'zehir') ||
    icerirBuyukKucukHarfsiz(narrativeJoined, 'merhem') ||
    icerirBuyukKucukHarfsiz(narrativeJoined, 'vampirik');
  expect(hasBuffEffectInLog).toBe(true); // Loglarda Zehir ya da Merhem bildirimi yer almalıdır
});

test('testBuffDurationDecayLogic', () => {
  const initialBuffs = [
    new ActiveBuffEffect({ id: 'buff_1', name: 'Geçici Yağ', icon: '', description: '1 dövüş', remainingBattles: 1 }),
    new ActiveBuffEffect({ id: 'buff_2', name: 'Uzun Süreli Tentür', icon: '', description: '2 dövüş', remainingBattles: 2 }),
  ];

  // 1. Dövüş sonrası:
  const afterCombat1 = initialBuffs
    .map((it) => it.copy({ remainingBattles: it.remainingBattles - 1 }))
    .filter((it) => it.remainingBattles > 0);

  expect(afterCombat1.length).toBe(1); // 1 dövüşlük buff sona ermeli, 2 dövüşlük buff 1'e düşüp kalmalı
  expect(afterCombat1[0].id).toBe('buff_2');
  expect(afterCombat1[0].remainingBattles).toBe(1);

  // 2. Dövüş sonrası:
  const afterCombat2 = afterCombat1
    .map((it) => it.copy({ remainingBattles: it.remainingBattles - 1 }))
    .filter((it) => it.remainingBattles > 0);

  expect(afterCombat2.length === 0).toBe(true); // Tüm bufflar tükenmiş olmalıdır
});
