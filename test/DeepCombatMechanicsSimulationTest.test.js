// Kotlin kaynağı: test/DeepCombatMechanicsSimulationTest.kt
import { test, expect } from 'bun:test';
import { StarterContent } from '../src/data/StarterContent.js';
import { TashisarGladiatorsData } from '../src/data/TashisarGladiatorsData.js';
import { CombatEngine } from '../src/domain/engine/CombatEngine.js';
import { Equipment, EquipmentSlot, EquipmentSpecialTrait, Player, SkillType, Stats } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

/** Kotlin String.contains(x, ignoreCase = true) */
const ic = (metin, aranan) => metin.toLowerCase().includes(aranan.toLowerCase());
/** EquipmentSpecialTrait(id, name, description) konumsal */
const trait = (id, name, description) => new EquipmentSpecialTrait({ id, name, description });
const firstEnemy = () => kt.first(StarterContent.createInitialEnemies());

test('testReflectionTraitDmgRetaliation', () => {
  const mirrorStaff = new Equipment({
    id: 'staff_mirror_test',
    name: 'Aynalı Yankı Asası',
    slot: EquipmentSlot.WEAPON,
    stats: new Stats({ damage: 5, maxHealth: 100 }),
    description: 'Aynalı yansıtıcı asa.',
    specialTrait: trait('trait_staff_mirror', 'Ayna Yansıması', "Düşmanın vurduğu hasarın %25'ini aynen yansıtır."),
  });

  const player = new Player({
    name: 'Ayna Büyücüsü',
    level: 10,
    baseStats: new Stats({ maxHealth: 200, damage: 1, armor: 0, speed: 1 }),
    currentHealth: 200,
    equipped: { [EquipmentSlot.WEAPON]: mirrorStaff },
  });

  const enemy = firstEnemy().copy({
    name: 'Kaba Vurucu',
    stats: new Stats({ maxHealth: 120, damage: 35, armor: 0, speed: 20 }),
    weaponName: 'Büyük Balta',
  });

  const result = CombatEngine.simulateBattle(player, enemy);
  expect(result).not.toBeNull();

  const reflectionLogs = result.logs.filter((it) => it.narrativeText.includes('Yansıtma Hasarı') || it.narrativeText.includes('AYNA YANSIMASI'));
  expect(reflectionLogs.length > 0).toBe(true); // Reflected damage logs must be recorded when defender has reflection trait
});

test('testRegenerationTraitRoundStartHeal', () => {
  const regenRobe = new Equipment({
    id: 'robe_sea_wind_test',
    name: 'Deniz Rüzgarı Cübbesi',
    slot: EquipmentSlot.CHEST,
    stats: new Stats({ maxHealth: 100 }),
    description: 'Şifalı rüzgar cübbesi.',
    specialTrait: trait('trait_robe_sea_wind', 'Deniz Rüzgarı Canlılığı', 'Her tur başında can yeniler.'),
  });

  const player = new Player({
    name: 'Şifa Savaşçısı',
    level: 10,
    baseStats: new Stats({ maxHealth: 200, damage: 15, armor: 10, speed: 10 }),
    currentHealth: 50, // Starts injured
    equipped: { [EquipmentSlot.CHEST]: regenRobe },
  });

  const enemy = firstEnemy().copy({
    stats: new Stats({ maxHealth: 50, damage: 1, armor: 0, speed: 1 }),
  });

  const result = CombatEngine.simulateBattle(player, enemy);
  expect(result).not.toBeNull();

  const regenLogs = result.logs.filter((it) => it.narrativeText.includes('YAŞAM CANLILIĞI'));
  expect(regenLogs.length > 0).toBe(true); // Regeneration logs must trigger on round start for wounded fighter with regen trait
});

test('testBarrierTraitDamageMitigation', () => {
  const barrierStaff = new Equipment({
    id: 'staff_tsunami_test',
    name: 'Tsunami Asası',
    slot: EquipmentSlot.WEAPON,
    stats: new Stats({ damage: 5, maxHealth: 150 }),
    description: 'Bariyerli asa.',
    specialTrait: trait('trait_staff_tsunami', 'Koruyucu Tsunami Bariyeri', 'Gelen hasarı %22 oranında sönümler.'),
  });

  const player = new Player({
    name: 'Bariyerli Muhafız',
    level: 10,
    baseStats: new Stats({ maxHealth: 150, damage: 20, armor: 2, speed: 1 }),
    currentHealth: 150,
    equipped: { [EquipmentSlot.WEAPON]: barrierStaff },
  });

  const enemy = firstEnemy().copy({
    name: 'Test Saldırganı',
    stats: new Stats({ maxHealth: 100, damage: 30, armor: 0, speed: 25 }),
    weaponName: 'Savaş Gürzü',
  });

  const result = CombatEngine.simulateBattle(player, enemy);
  expect(result).not.toBeNull();

  const barrierLogs = result.logs.filter(
    (it) => it.narrativeText.includes('KORUYUCU TSUNAMI BARIYERI') || (it.narrativeText.includes('Hasar') && it.narrativeText.includes('sönüm'))
  );
  expect(barrierLogs.length > 0).toBe(true); // Barrier mitigation logs must appear when defender has barrier trait
});

test('testBleedTraitInflictsDoTTicks', () => {
  const bleedAxe = new Equipment({
    id: 'axe_bleed_test',
    name: 'Vahşi Isırık Baltası',
    slot: EquipmentSlot.WEAPON,
    stats: new Stats({ damage: 25, maxHealth: 100 }),
    description: 'Kanatan balta.',
    specialTrait: trait('trait_tash_ax_5', 'Ağır Kanama', 'Düşmanda derin yaralar açarak kanama başlatır.'),
  });

  const player = new Player({
    name: 'Kelle Avcısı',
    level: 10,
    baseStats: new Stats({ maxHealth: 300, damage: 3, armor: 10, speed: 25 }),
    currentHealth: 300,
    equipped: { [EquipmentSlot.WEAPON]: bleedAxe },
  });

  const enemy = firstEnemy().copy({
    name: 'Zırhlı Boğa',
    stats: new Stats({ maxHealth: 400, damage: 4, armor: 2, speed: 5 }),
    weaponName: 'Ağır Balyoz',
  });

  let foundBleed = false;
  let foundTick = false;
  for (let i = 0; i < 10; i++) {
    const result = CombatEngine.simulateBattle(player, enemy);
    if (result.logs.some((it) => ic(it.narrativeText, 'KANAMA'))) {
      foundBleed = true;
    }
    if (result.logs.some((it) => ic(it.narrativeText, 'KAN KAYBI'))) {
      foundTick = true;
    }
    if (foundBleed && foundTick) break;
  }

  expect(foundBleed).toBe(true); // Bleed proc should be inflicted during combat
  expect(foundTick).toBe(true); // Bleed DoT tick damage should trigger on subsequent rounds
});

test('testResurrectionTraitPhoenixRevive', () => {
  const phoenixArmor = new Equipment({
    id: 'phoenix_armor_test',
    name: 'Anka Muhafız Zırhı',
    slot: EquipmentSlot.CHEST,
    stats: new Stats({ maxHealth: 80, armor: 5 }),
    description: 'Kadim anka zırhı.',
    specialTrait: trait('trait_tash_ha_50', 'Kadim Anka Dirilişi', 'Ölümcül darbe aldığında ölümden dirilir.'),
  });

  const player = new Player({
    name: 'Ölümsüz Lejyoner',
    level: 5,
    baseStats: new Stats({ maxHealth: 80, damage: 15, armor: 0, speed: 1 }),
    currentHealth: 80,
    equipped: { [EquipmentSlot.CHEST]: phoenixArmor },
  });

  const enemy = firstEnemy().copy({
    name: 'Cellat Başı',
    stats: new Stats({ maxHealth: 150, damage: 95, armor: 2, speed: 30 }),
    weaponName: 'Devasa Pala',
  });

  const result = CombatEngine.simulateBattle(player, enemy);
  expect(result).not.toBeNull();

  const reviveLogs = result.logs.filter((it) => it.narrativeText.includes('KADİM DİRİLİŞ'));
  expect(reviveLogs.length > 0).toBe(true); // Player should trigger Kadim Diriliş (Phoenix Revive) when HP hits 0
});

test('testGladiatorSignatureSkillsIntegration', () => {
  const gladiators = TashisarGladiatorsData.createTashisarEnemies();
  expect(gladiators.length > 0).toBe(true); // Gladiators must not be empty

  const kanamaGladiator = kt.firstOrNull(gladiators, (g) =>
    g.skills.some((s) => ic(s.name, 'Kanama') || ic(s.description, 'kanama') || ic(s.combatEffect, 'kanama'))
  );
  expect(kanamaGladiator).not.toBeNull(); // Should find gladiator with Kanama skill

  const afallatGladiator = kt.firstOrNull(gladiators, (g) =>
    g.skills.some((s) => ic(s.name, 'Afallat') || ic(s.description, 'sersem') || ic(s.combatEffect, 'sersem'))
  );
  expect(afallatGladiator).not.toBeNull(); // Should find gladiator with Afallat / Sersemlet skill

  const player = new Player({
    name: 'Test Gladyatör',
    level: 10,
    baseStats: new Stats({ maxHealth: 250, damage: 25, armor: 8, speed: 15 }),
    currentHealth: 250,
  });

  const result = CombatEngine.simulateBattle(player, kanamaGladiator);
  expect(result).not.toBeNull();
  expect(result.logs.length > 0).toBe(true); // Combat against gladiator must generate logs
});

test('testMassCombatSimulation100BattlesWithRandomTraitsAndSkills', () => {
  const gladiators = TashisarGladiatorsData.createTashisarEnemies();
  const random = kt.makeRandom(42);

  const sampleTraits = [
    trait('trait_staff_mirror', 'Ayna Yansıması', 'Hasarı yansıtır'),
    trait('trait_robe_sea_wind', 'Deniz Rüzgarı', 'Tur başı can yeniler'),
    trait('trait_staff_tsunami', 'Tsunami Bariyeri', 'Hasarı sönümler'),
    trait('trait_tash_ax_5', 'Derin Kanama', 'Kanama açar'),
    trait('trait_tash_ha_50', 'Kadim Diriliş', 'Ölümden diriltir'),
    trait('trait_tash_ha_21', 'Statik Şok Zırhı', 'Geri teper ve çarpar'),
  ];

  let totalRounds = 0;
  let playerWins = 0;
  let enemyWins = 0;
  let draws = 0;

  for (let i = 1; i <= 100; i++) {
    const assignedTrait = sampleTraits[random.nextInt(sampleTraits.length)];
    const playerWeapon = new Equipment({
      id: `weapon_sim_${i}`,
      name: `Test Silahı ${i}`,
      slot: EquipmentSlot.WEAPON,
      stats: new Stats({ damage: 18 + random.nextInt(15), maxHealth: 120 + random.nextInt(60) }),
      description: 'Simülasyon test silahı',
      specialTrait: assignedTrait,
    });

    const player = new Player({
      name: `Arena Şampiyonu ${i}`,
      level: 10,
      baseStats: new Stats({ maxHealth: 150 + random.nextInt(50), damage: 18 + random.nextInt(10), armor: random.nextInt(8), speed: 10 + random.nextInt(15) }),
      currentHealth: 150,
      equipped: { [EquipmentSlot.WEAPON]: playerWeapon },
    });

    const enemyBase = gladiators[random.nextInt(gladiators.length)];
    const enemyWeapon = new Equipment({
      id: `enemy_weapon_${i}`,
      name: `Düşman Silahı ${i}`,
      slot: EquipmentSlot.WEAPON,
      stats: new Stats({ damage: 5 }),
      description: 'Düşman silahı',
      specialTrait: sampleTraits[random.nextInt(sampleTraits.length)],
    });
    const enemy = enemyBase.equip(enemyWeapon);

    const result = CombatEngine.simulateBattle(player, enemy);
    expect(result).not.toBeNull(); // `Battle ${i} result should not be null`
    expect(result.logs.length > 0).toBe(true); // `Battle ${i} must have combat logs`
    expect(result.finalPlayerHp >= 0).toBe(true); // `Battle ${i} final Player HP cannot be negative`

    totalRounds += result.totalRounds;
    if (result.isPlayerWinner) playerWins++;
    else if (result.isDraw) draws++;
    else enemyWins++;
  }

  console.log(`100 Battles complete: Player Wins: ${playerWins}, Enemy Wins: ${enemyWins}, Draws: ${draws}, Avg Rounds: ${totalRounds / 100.0}`);
  expect(playerWins + draws > 0).toBe(true); // At least some player wins or draws should occur
});

test('testSpectatorDetailedNpcBattleWithTraits', () => {
  const gladiators = TashisarGladiatorsData.createTashisarEnemies();
  const w1 = new Equipment({
    id: 'w1',
    name: 'Tsunami Asası',
    slot: EquipmentSlot.WEAPON,
    stats: new Stats({ damage: 5 }),
    description: 'Bariyerli',
    specialTrait: trait('trait_staff_tsunami', 'Tsunami Bariyeri', 'Sönümler'),
  });
  const w2 = new Equipment({
    id: 'w2',
    name: 'Ayna Asası',
    slot: EquipmentSlot.WEAPON,
    stats: new Stats({ damage: 5 }),
    description: 'Yansıtıcı',
    specialTrait: trait('trait_staff_mirror', 'Ayna Yansıması', 'Yansıtır'),
  });

  const f1 = gladiators[0].equip(w1);
  const f2 = gladiators[1].equip(w2);

  const result = CombatEngine.simulateDetailedNpcBattle(f1, f2, f1.name, 100);
  expect(result).not.toBeNull();
  expect(result.logs.length > 0).toBe(true);
});

test('testExecutionTraitBonusDamage', () => {
  const execTome = new Equipment({
    id: 'exec_tome_test',
    name: 'Ecel Fermanı',
    slot: EquipmentSlot.WEAPON,
    stats: new Stats({ damage: 20, maxHealth: 100 }),
    description: 'İnfaz büyüsü.',
    specialTrait: trait('trait_tash_tome_35', 'Ecel Fermanı', 'Düşmanın canı %30 altına indiğinde hasarı %25 artırarak son nefesini tüketir.'),
  });

  const player = new Player({
    name: 'İnfazcı Büyücü',
    level: 10,
    baseStats: new Stats({ maxHealth: 200, damage: 20, armor: 10, speed: 20 }),
    currentHealth: 200,
    equipped: { [EquipmentSlot.WEAPON]: execTome },
  });

  // Enemy starts with low HP (< 30%)
  const enemy = firstEnemy().copy({
    stats: new Stats({ maxHealth: 200, damage: 2, armor: 0, speed: 1 }),
  });

  const result = CombatEngine.simulateBattle(player, enemy);
  expect(result).not.toBeNull();

  const execLogs = result.logs.filter((it) => ic(it.narrativeText, 'İnfaz Hasarı') || ic(it.narrativeText, 'ECEL FERMANI'));
  expect(execLogs.length > 0).toBe(true); // Execution bonus damage should trigger when enemy is below 30% HP
});

test('testInherentArmorPenetrationTrait', () => {
  const spear = new Equipment({
    id: 'spear_pen_test',
    name: 'Gaga Mızrağı',
    slot: EquipmentSlot.WEAPON,
    stats: new Stats({ damage: 25, maxHealth: 100 }),
    description: 'Zırh delen mızrak.',
    specialTrait: trait('trait_tash_mc_20', 'Gaga Vuruşu', 'Zırh delme gücünü katlar.'),
  });

  const player = new Player({
    name: 'Zırh Delici',
    level: 10,
    baseStats: new Stats({ maxHealth: 200, damage: 25, armor: 10, speed: 20 }),
    currentHealth: 200,
    equipped: { [EquipmentSlot.WEAPON]: spear },
  });

  const enemy = firstEnemy().copy({
    stats: new Stats({ maxHealth: 150, damage: 5, armor: 25, speed: 5 }),
  });

  const result = CombatEngine.simulateBattle(player, enemy);
  expect(result).not.toBeNull();

  const penLogs = result.logs.filter((it) => ic(it.narrativeText, 'Zırh Delme'));
  expect(penLogs.length > 0).toBe(true); // Armor penetration trait should log and pierce armor
});

test('testCritAmplifierTrait', () => {
  const spear = new Equipment({
    id: 'crit_spear_test',
    name: 'Hücum Temreni Kargısı',
    slot: EquipmentSlot.WEAPON,
    stats: new Stats({ damage: 30, critChancePercent: 80, maxHealth: 100 }),
    description: 'Kritik artıran.',
    specialTrait: trait('trait_tash_sp_2', 'Hücum Temreni', 'Kritik vuruş hasarını artırır.'),
  });

  const player = new Player({
    name: 'Kritikçi Süvari',
    level: 10,
    baseStats: new Stats({ maxHealth: 200, damage: 30, critChancePercent: 80, speed: 20 }),
    currentHealth: 200,
    equipped: { [EquipmentSlot.WEAPON]: spear },
  });

  const enemy = firstEnemy().copy({
    stats: new Stats({ maxHealth: 200, damage: 5, armor: 2, speed: 5 }),
  });

  const result = CombatEngine.simulateBattle(player, enemy);
  expect(result).not.toBeNull();

  const critLogs = result.logs.filter((it) => ic(it.narrativeText, 'HÜCUM TEMRENI') || ic(it.narrativeText, 'yıkıcı şiddeti katlandı'));
  expect(critLogs.length > 0).toBe(true); // Crit amplifier trait should amplify critical damage
});

test('testSlowDebuffTrait', () => {
  const axe = new Equipment({
    id: 'slow_axe_test',
    name: 'Buzul Baltası',
    slot: EquipmentSlot.WEAPON,
    stats: new Stats({ damage: 15, maxHealth: 100 }),
    description: 'Yavaşlatan buzul.',
    specialTrait: trait('trait_tash_ax_11', 'Buzul Kırılması', 'Darbe anında rakibi dondurup yavaşlatır.'),
  });

  const player = new Player({
    name: 'Kuzey Muhafızı',
    level: 10,
    baseStats: new Stats({ maxHealth: 200, damage: 15, speed: 20 }),
    currentHealth: 200,
    equipped: { [EquipmentSlot.WEAPON]: axe },
  });

  const enemy = firstEnemy().copy({
    stats: new Stats({ maxHealth: 150, damage: 5, speed: 10 }),
  });

  const result = CombatEngine.simulateBattle(player, enemy);
  expect(result).not.toBeNull();

  const slowLogs = result.logs.filter((it) => ic(it.narrativeText, 'yavaşlattı'));
  expect(slowLogs.length > 0).toBe(true); // Slow / chill debuff should trigger and be logged
});

test('testDynamicLifestealFromWeaponTrait', () => {
  const dagger = new Equipment({
    id: 'test_vampiric_dagger',
    name: 'Kuzgun Hırsı Bıçağı',
    slot: EquipmentSlot.WEAPON,
    stats: new Stats({ damage: 30, maxHealth: 100 }),
    description: 'Hasmın kanından güç çeken bıçak.',
    specialTrait: trait('trait_custom_vamp_01', 'Kuzgun Hırsı', 'Verilen hasarın bir kısmını can olarak çalar ve kullanıcıyı sağaltır.'),
  });

  const player = new Player({
    name: 'Gölge Hırsızı',
    level: 10,
    baseStats: new Stats({ maxHealth: 200, damage: 30, speed: 20 }),
    currentHealth: 80, // Injured to see heal
    equipped: { [EquipmentSlot.WEAPON]: dagger },
  });

  const enemy = firstEnemy().copy({
    stats: new Stats({ maxHealth: 200, damage: 1, speed: 5 }),
  });

  const result = CombatEngine.simulateBattle(player, enemy);
  expect(result).not.toBeNull();

  const lifestealLogs = result.logs.filter((it) => ic(it.narrativeText, 'KUZGUN HIRSI') && ic(it.narrativeText, 'Can'));
  expect(lifestealLogs.length > 0).toBe(true); // Dynamic lifesteal from weapon description should trigger and heal
});

test('testLastStandDefenseTrait', () => {
  const chest = new Equipment({
    id: 'test_last_stand_armor',
    name: 'Azam Sur Zırhı',
    slot: EquipmentSlot.CHEST,
    stats: new Stats({ armor: 10, maxHealth: 100 }),
    description: 'Ağır sur zırhı.',
    specialTrait: trait('trait_tash_ha_24', 'Azam Surları', 'Yıkılmaz sur çeliği; can %30 altındayken gelen tüm hasarı %40 keser.'),
  });

  const player = new Player({
    name: 'Sur Şövalyesi',
    level: 10,
    baseStats: new Stats({ maxHealth: 200, damage: 10, armor: 10, speed: 1 }),
    currentHealth: 40, // Can <= 30% to activate Last Stand
    equipped: { [EquipmentSlot.CHEST]: chest },
  });

  const enemy = firstEnemy().copy({
    stats: new Stats({ maxHealth: 150, damage: 30, armor: 5, speed: 20 }),
  });

  const result = CombatEngine.simulateBattle(player, enemy);
  expect(result).not.toBeNull();

  const lastStandLogs = result.logs.filter((it) => ic(it.narrativeText, 'AZAM SURLARI'));
  expect(lastStandLogs.length > 0).toBe(true); // Last stand defense should trigger when defender HP <= 35%
});

const skillEmoji = (it) =>
  it.narrativeText.includes('⚔️') || it.narrativeText.includes('🛡️') || it.narrativeText.includes('🎯') || it.narrativeText.includes('💥');

test('testChapter1FightersEquippedAndSkillsCombatSimulation', () => {
  // 1. Bölüm Karakterleri Yükleniyor
  const chapter1Fighters = StarterContent.createInitialEnemies();
  expect(chapter1Fighters.length).toBe(11); // Bölüm 1'de tam 11 gladyatör olmalıdır

  // Her bir gladyatörün 4 yeteneği olmalı (Taarruz, Savunma, Taktik, Nihai)
  for (const fighter of chapter1Fighters) {
    expect(fighter.skills.length).toBe(4);
    expect(fighter.skills.some((it) => it.type === SkillType.ATTACK)).toBe(true);
    expect(fighter.skills.some((it) => it.type === SkillType.DEFENSE)).toBe(true);
    expect(fighter.skills.some((it) => it.type === SkillType.TACTICAL)).toBe(true);
    expect(fighter.skills.some((it) => it.type === SkillType.ULTIMATE)).toBe(true);
  }

  // Oyuncu Karakterimiz - Chapter 1 Ekipmanlarıyla Donatılmış
  const playerWeapon = new Equipment({
    id: 'wp_ch1_kaderkiran',
    name: 'Kader Kıran',
    slot: EquipmentSlot.WEAPON,
    stats: new Stats({ damage: 18, critChancePercent: 12 }),
    description: 'Garnizon efsanesi çift ağızlı kılıç.',
    specialTrait: trait('trait_kader_kiran', 'Kader Parçalayıcı', 'Rakibin gardını ezer.'),
  });
  const playerArmor = new Equipment({
    id: 'ar_ch1_legion',
    name: 'Garnizon Lejyoner Zırhı',
    slot: EquipmentSlot.CHEST,
    stats: new Stats({ armor: 6, maxHealth: 70 }),
    description: 'Perçinli kalın lejyoner zırhı.',
  });

  const player = new Player({
    name: 'Sürgün Silahşör',
    level: 3,
    baseStats: new Stats({ maxHealth: 130, damage: 14, armor: 5, speed: 10, critChancePercent: 8, dodgeChancePercent: 8 }),
    currentHealth: 130,
    equipped: {
      [EquipmentSlot.WEAPON]: playerWeapon,
      [EquipmentSlot.CHEST]: playerArmor,
    },
  });

  console.log('=================================================================');
  console.log('       BÖLÜM 1 GLADYATÖRLERİ & OYUNCU SAVAŞ SİMÜLASYONU          ');
  console.log('=================================================================');

  let totalSkillTriggersFound = 0;
  let totalTacticalPositionsFound = 0;

  // 1. Oyuncu vs 11 Bölüm 1 Gladyatörü
  for (const fighter of chapter1Fighters) {
    const result = CombatEngine.simulateBattle(player, fighter);
    expect(result).not.toBeNull();
    expect(result.totalRounds >= 1).toBe(true); // Dövüş en az 1 tur sürmelidir

    const skillLogs = result.logs.filter(skillEmoji);
    if (skillLogs.length > 0) {
      totalSkillTriggersFound += skillLogs.length;
    }

    const tacticalLogs = result.logs.filter(
      (it) =>
        ic(it.narrativeText, 'ÜSTÜNLÜK') ||
        ic(it.narrativeText, 'CAN HAVLİ') ||
        ic(it.narrativeText, 'AVANTAJ') ||
        ic(it.narrativeText, 'savunmasız') ||
        ic(it.narrativeText, 'kıstırdı')
    );
    if (tacticalLogs.length > 0) {
      totalTacticalPositionsFound += tacticalLogs.length;
    }

    const outcomeText = result.isPlayerWinner ? 'Oyuncu Kazandı' : result.isDraw ? 'Beraberlik' : `${fighter.name} Kazandı`;
    console.log(`--- [${player.name} VS ${fighter.name} (${fighter.title})] ---`);
    console.log(`Sonuç: ${outcomeText}, Tur Sayısı: ${result.totalRounds}`);
    console.log('Örnek Metin Anlatımı (İlk 2 Log):');
    kt.take(result.logs, 2).forEach((it) => console.log(` > ${it.narrativeText}`));
    if (skillLogs.length > 0) {
      console.log('Yetenek Tetiklenmesi:');
      console.log(` > ${kt.first(skillLogs).narrativeText}`);
    }
    console.log();
  }

  // 2. Bölüm 1 Gladyatörlerinin Birbirleriyle Karşılaşmaları (PvE Gladyatör Düelloları)
  const gladiatorClashes = [
    [chapter1Fighters[0], chapter1Fighters[1]], // Khorvash vs Zal'Mora
    [chapter1Fighters[4], chapter1Fighters[8]], // Morvath vs Thyra
    [chapter1Fighters[5], chapter1Fighters[7]], // Bregash vs Ghorak
    [chapter1Fighters[6], chapter1Fighters[10]], // Kaelen vs Sarkoth
  ];

  for (const [f1, f2] of gladiatorClashes) {
    const duelResult = CombatEngine.simulateDetailedNpcBattle(f1, f2, f1.name, 0);
    expect(duelResult).not.toBeNull();
    expect(duelResult.logs.length > 0).toBe(true); // Gladyatör düellosu log üretmeli

    const duelRounds = kt.maxOfOrNull(duelResult.logs, (it) => it.round) ?? 1;
    console.log(`=== [DÜELLO: ${f1.name} VS ${f2.name}] ===`);
    console.log(`Kazanan: ${duelResult.winnerName ?? 'Beraberlik'}, Tur: ${duelRounds}`);
    const duelSkills = duelResult.logs.filter(skillEmoji);
    if (duelSkills.length > 0) {
      totalSkillTriggersFound += duelSkills.length;
      console.log(`Düello Yetenek Metni: \n > ${kt.first(duelSkills).narrativeText}`);
    }
    console.log();
  }

  expect(totalSkillTriggersFound > 0).toBe(true); // Simülasyon boyunca yetenek anlatımları tetiklenmiş olmalıdır
  console.log(`Simülasyon başarıyla tamamlandı. Toplam yetenek tetiklenmesi: ${totalSkillTriggersFound}, Taktiksel pozisyon metinleri: ${totalTacticalPositionsFound}`);
});

test('testChapter2ExoticEquipmentCombatAndNarrativeSimulation', () => {
  console.log('=================================================================');
  console.log('   2. BÖLÜM (TAŞ HİSAR) EGZOTİK EKİPMANLAR METİN SAVAŞ SİMÜLASYONU');
  console.log('=================================================================');

  // 1. Oyuncu Karakteri (Yetenekleri henüz açılmamış - Saf ekipman ve temel savaş yetisi)
  const player = new Player({
    name: 'Sürgün Silahşör',
    level: 20,
    baseStats: new Stats({ maxHealth: 260, damage: 22, armor: 8, speed: 14, critChancePercent: 10, dodgeChancePercent: 8 }),
    currentHealth: 260,
    unlockedSkillIds: [], // Yetenekler henuz acilmadi, erken denge
  });

  // 2. Bölüm Farklı Ekipman Setleri (Pala, Tokmak, Balta, Kargı, Arbalet, Büyülü Asa, Yansıtıcı Zırh)
  const chapter2Weapons = [
    new Equipment({
      id: 'eq_sim_pala',
      name: 'Sınır Muhafızı Ağır Palası',
      slot: EquipmentSlot.WEAPON,
      stats: new Stats({ damage: 32, blockChancePercent: 8 }),
      description: 'Geniş namlusuyla darbeleri karşılayan ağır kavisli pala.',
      specialTrait: trait('trait_sw_pala', 'Pala Ağırlığı', 'Blok ve ezici hasar'),
    }),
    new Equipment({
      id: 'eq_sim_tokmak',
      name: 'Granit Taş Kırıcı Tokmak',
      slot: EquipmentSlot.WEAPON,
      stats: new Stats({ damage: 36, armor: 4 }),
      description: 'Masif granit başlıklı cüce çekiç-tokmağı.',
      specialTrait: trait('trait_mc_granite', 'Granit Çatlatıcı', 'Zırhı ezer ve sarsar'),
    }),
    new Equipment({
      id: 'eq_sim_balta',
      name: 'Dağ Yaran Çift Ağızlı Nacak',
      slot: EquipmentSlot.WEAPON,
      stats: new Stats({ damage: 38, critChancePercent: 15 }),
      description: 'Dağ klanlarının iki ağızlı devasa yarma baltası.',
      specialTrait: trait('trait_ax_split', 'Dağ Yaran', 'Derin et yarığı ve kanama'),
    }),
    new Equipment({
      id: 'eq_sim_kargi',
      name: 'Burç Nöbetçisi Delici Kargısı',
      slot: EquipmentSlot.WEAPON,
      stats: new Stats({ damage: 33, speed: 4 }),
      description: 'Surlarda kullanılan dört köşeli delici uzun kargı.',
      specialTrait: trait('trait_sp_lance', 'Burç Delici', 'Zırhı delip geçen saplama'),
    }),
    new Equipment({
      id: 'eq_sim_arbalet',
      name: 'Taş Hisar Arbaleti',
      slot: EquipmentSlot.WEAPON,
      stats: new Stats({ damage: 35, critChancePercent: 14 }),
      description: 'Mekanik çelik kilitli yüksek gerilimli kundak.',
      specialTrait: trait('trait_bw_crossbow', 'Kundak Gerilimi', 'Ağır cıva oku fırlatır'),
    }),
    new Equipment({
      id: 'eq_sim_asa',
      name: 'Lav Akıntısı Asası',
      slot: EquipmentSlot.WEAPON,
      stats: new Stats({ damage: 34, maxHealth: 40 }),
      description: 'Akkor volkanik magma kristali taşıyan kadim asa.',
      specialTrait: trait('trait_st_lava', 'Lav Akıntısı', 'Kızgın korlar saçar'),
    }),
  ];

  // Taş Hisar Savunma ve Yansıtıcı Donanımları
  const mirrorShield = new Equipment({
    id: 'eq_sim_mirror_shield',
    name: 'Ayna Yüzeyli Refleks Kalkanı',
    slot: EquipmentSlot.SHIELD,
    stats: new Stats({ armor: 10, blockChancePercent: 15 }),
    description: 'Gelen hasarı prizmatik ışıkla yansıtan ayna yüzeyli siper.',
    specialTrait: trait('trait_sh_mirror', 'Ayna Yansıması', "Hasarın %25'ini geri yansıtır"),
  });

  const bastionArmor = new Equipment({
    id: 'eq_sim_bastion',
    name: 'Azam Surları Plaka Zırhı',
    slot: EquipmentSlot.CHEST,
    stats: new Stats({ armor: 16, maxHealth: 120 }),
    description: 'Taş Hisar sur çeliğinden dövülmüş granit levha zırh.',
    specialTrait: trait('trait_tash_ha_24', 'Azam Surları', 'Kinetik sarsıntıyı geri teper'),
  });

  // Taş Hisar Gladyatörlerinden Düşman
  const gladiators = TashisarGladiatorsData.createTashisarEnemies();
  const enemy = kt.firstOrNull(gladiators, (it) => it.name.includes('Baelor')) ?? kt.first(gladiators);

  let uniqueNarrativesFound = 0;
  let reflectionTriggersFound = 0;

  for (const weapon of chapter2Weapons) {
    const equippedPlayer = player.copy({
      equipped: {
        [EquipmentSlot.WEAPON]: weapon,
        [EquipmentSlot.SHIELD]: mirrorShield,
        [EquipmentSlot.CHEST]: bastionArmor,
      },
    });

    const result = CombatEngine.simulateBattle(equippedPlayer, enemy);
    expect(result).not.toBeNull();
    expect(result.logs.length > 0).toBe(true);

    // Egzotik silaha ve ekipmana özel anlatım kontrolü
    const weaponNarrativeLogs = result.logs.filter((log) => {
      const text = log.narrativeText;
      return (
        ic(text, 'namlu') ||
        ic(text, 'pala') ||
        ic(text, 'çekiç') ||
        ic(text, 'tokmak') ||
        ic(text, 'balta') ||
        ic(text, 'kargı') ||
        ic(text, 'arbalet') ||
        ic(text, 'kundak') ||
        ic(text, 'magma') ||
        ic(text, 'kor') ||
        ic(text, 'asa') ||
        ic(text, 'siper')
      );
    });
    if (weaponNarrativeLogs.length > 0) {
      uniqueNarrativesFound += weaponNarrativeLogs.length;
    }

    const reflectionLogs = result.logs.filter(
      (it) => ic(it.narrativeText, 'AYNA YANSIMASI') || ic(it.narrativeText, 'Yansıtma Hasarı') || ic(it.narrativeText, 'AZAM SURLARI')
    );
    if (reflectionLogs.length > 0) {
      reflectionTriggersFound += reflectionLogs.length;
    }

    console.log(`--- [2. BÖLÜM EKİPMAN TESTİ: ${weapon.name} & ${mirrorShield.name}] ---`);
    console.log(`Dövüş Süresi: ${result.totalRounds} Tur | Kazanan: ${result.isPlayerWinner ? 'Oyuncu' : enemy.name}`);
    console.log('Örnek Vuruş Metni:');
    const sampleHit = kt.firstOrNull(result.logs, (it) => it.damage > 0 && it.isPlayerAttacker) ?? kt.first(result.logs);
    console.log(` > ${sampleHit.narrativeText}`);

    if (reflectionLogs.length > 0) {
      console.log('Örnek Karşı Hasar / Yansıtma Metni:');
      console.log(` > ${kt.first(reflectionLogs).narrativeText}`);
    }
    console.log();
  }

  expect(uniqueNarrativesFound > 0).toBe(true); // 2. Bölüm egzotik ekipmanlarına özel anlatımlar üretilmiş olmalıdır
  console.log(`2. Bölüm ekipman simülasyonu başarıyla tamamlandı. Toplam ekipman vuruş tasviri: ${uniqueNarrativesFound}, Yansıtma/Misilleme: ${reflectionTriggersFound}`);
});
