// Kotlin kaynağı: test/DuoCombatMechanicsSimulationTest.kt
// Not: testSimulateDozensOf2v2Battles GameRepository.js'e bağlıdır.
import { test, expect } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { TashisarGladiatorsData } from '../src/data/TashisarGladiatorsData.js';
import { DuoCombatEngine } from '../src/domain/engine/DuoCombatEngine.js';
import { DuoCombatNarratives } from '../src/domain/engine/DuoCombatNarratives.js';
import {
  DuoDiscordType,
  DuoMatchState,
  DuoSynergyType,
  DuoTeam,
  GladiatorSkill,
  PersonalityArchetype,
  SkillType,
  Stats,
} from '../src/domain/model.js';
import * as kt from '../src/kt.js';

/** GladiatorSkill(id, name, icon, type, tier, cooldownTurns, description, combatEffect) konumsal */
const gs = (id, name, icon, type, tier, cooldownTurns, description, combatEffect) =>
  new GladiatorSkill({ id, name, icon, type, tier, cooldownTurns, description, combatEffect });

test('testSynergyEvaluation', () => {
  const tank = new DuoCombatEngine.DuoFighterState({
    id: 'f_tank',
    name: 'Demir Muhafız',
    title: 'Ağır Zırh',
    isPlayer: false,
    team: DuoTeam.TEAM_BLUE,
    maxHp: 400,
    currentHp: 400,
    stats: new Stats({ maxHealth: 400, damage: 22, armor: 26, speed: 10, blockChancePercent: 25 }),
    weaponName: 'Kule Kalkanı & Mızrak',
    weaponType: 'kalkan',
    archetype: PersonalityArchetype.GURURLU,
    skills: [gs('sk_def', 'Kalkan Duvarı', '', SkillType.DEFENSE, 1, 3, 'Savunma', '+5 Zırh')],
  });

  const striker = new DuoCombatEngine.DuoFighterState({
    id: 'f_striker',
    name: 'Gölge Bıçak',
    title: 'Suikastçı',
    isPlayer: false,
    team: DuoTeam.TEAM_BLUE,
    maxHp: 220,
    currentHp: 220,
    stats: new Stats({ maxHealth: 220, damage: 38, armor: 10, speed: 20, critChancePercent: 22, dodgeChancePercent: 18 }),
    weaponName: 'Çift Ejder Dişi',
    weaponType: 'hançer',
    archetype: PersonalityArchetype.KURNAZ,
    skills: [],
  });

  const [synergy, discord] = DuoCombatEngine.evaluateTeamDynamics(tank, striker, kt.first(DuoMatchState.defaultConditions));
  expect(synergy).toBe(DuoSynergyType.TANK_AND_STRIKER); // Tank + Striker ikilisi TANK_AND_STRIKER sinerjisi üretmelidir
  expect(discord).toBe(DuoDiscordType.SPEED_GAP); // Hız farkı (20 vs 10) SPEED_GAP sürtüşmesi üretmelidir
});

test('testTwinShadowsSynergy', () => {
  const speedster1 = new DuoCombatEngine.DuoFighterState({
    id: 's1', name: 'Rüzgar', title: 'Hızlı', isPlayer: false, team: DuoTeam.TEAM_RED,
    maxHp: 240, currentHp: 240, stats: new Stats({ damage: 28, armor: 12, speed: 19, dodgeChancePercent: 20 }),
    weaponName: 'Hafif Kılıç', weaponType: 'kılıç', archetype: PersonalityArchetype.KURNAZ, skills: [],
  });
  const speedster2 = new DuoCombatEngine.DuoFighterState({
    id: 's2', name: 'Şimşek', title: 'Çevik', isPlayer: false, team: DuoTeam.TEAM_RED,
    maxHp: 230, currentHp: 230, stats: new Stats({ damage: 26, armor: 10, speed: 18, dodgeChancePercent: 18 }),
    weaponName: 'İkiz Hançer', weaponType: 'hançer', archetype: PersonalityArchetype.KURNAZ, skills: [],
  });

  const [synergy] = DuoCombatEngine.evaluateTeamDynamics(speedster1, speedster2, kt.first(DuoMatchState.defaultConditions));
  expect(synergy).toBe(DuoSynergyType.TWIN_SHADOWS); // İki çevik dövüşçü TWIN_SHADOWS sinerjisi oluşturmalıdır
});

test('testRecklessBerserkDiscord', () => {
  const berserk1 = new DuoCombatEngine.DuoFighterState({
    id: 'b1', name: 'Kan Çekici', title: 'Öfkeli', isPlayer: false, team: DuoTeam.TEAM_RED,
    maxHp: 320, currentHp: 320, stats: new Stats({ damage: 42, armor: 12, speed: 14 }),
    weaponName: 'Çift Başlı Balta', weaponType: 'balta', archetype: PersonalityArchetype.VAHSI, skills: [],
  });
  const berserk2 = new DuoCombatEngine.DuoFighterState({
    id: 'b2', name: 'Kasap', title: 'Vahşi', isPlayer: false, team: DuoTeam.TEAM_RED,
    maxHp: 310, currentHp: 310, stats: new Stats({ damage: 40, armor: 14, speed: 13 }),
    weaponName: 'Ağır Gürz', weaponType: 'gürz', archetype: PersonalityArchetype.VAHSI, skills: [],
  });

  const [, discord] = DuoCombatEngine.evaluateTeamDynamics(berserk1, berserk2, kt.first(DuoMatchState.defaultConditions));
  expect(discord).toBe(DuoDiscordType.RECKLESS_BERSERK); // İki öfkeli vahşi savaşçı RECKLESS_BERSERK sürtüşmesi yaşamalıdır
});

test('testGladiatorGearUpgradeSimulation', () => {
  const baseGladiator = kt.first(TashisarGladiatorsData.createTashisarEnemies());
  const upgradedTier2 = DuoCombatEngine.simulateGladiatorWithUpgradedGear(baseGladiator, 2);

  expect(upgradedTier2.stats.maxHealth > baseGladiator.stats.maxHealth).toBe(true);
  expect(upgradedTier2.stats.damage > baseGladiator.stats.damage).toBe(true);
  expect(upgradedTier2.stats.armor > baseGladiator.stats.armor).toBe(true);
  expect(upgradedTier2.lifestealPercent > 0).toBe(true);
  expect(upgradedTier2.title.includes('Kuvanmış Sv.2')).toBe(true);
});

test('testSimulateDozensOf2v2Battles', () => {
  const repository = new GameRepository();
  const player = repository.player.value;
  const tashisarEnemies = TashisarGladiatorsData.createTashisarEnemies();
  const starterEnemies = repository.enemies.value;

  let blueWins = 0;
  let redWins = 0;
  let totalInterceptsObserved = 0;
  let totalPincersObserved = 0;
  let totalCombosObserved = 0;
  let totalDiscordsObserved = 0;
  let totalFallenTeammatesObserved = 0;

  const conditions = DuoMatchState.defaultConditions;

  // 30 adet farklı 2v2 karşılaşması simüle et
  for (let i = 1; i <= 30; i++) {
    const shuffled = kt.shuffled([...starterEnemies, ...tashisarEnemies]);
    const ally = shuffled[0];
    const enemy1 = shuffled[1];
    const enemy2 = shuffled[2];
    const condition = conditions[(i - 1) % conditions.length];

    const result = DuoCombatEngine.simulateDuoBattle(player, ally, enemy1, enemy2, condition, i % 2 === 0, i % 3 === 0 ? 2 : 1);

    expect(result).not.toBeNull(); // DuoCombatResult boş olamaz
    expect(result.totalRounds > 1).toBe(true); // Tur sayısı 1'den büyük olmalıdır
    expect(result.logs.length > 0).toBe(true); // Savaş logları boş olmamalıdır

    if (result.isPlayerWinner) blueWins++;
    else redWins++;

    // Log içeriklerini analiz et
    for (const log of result.logs) {
      const t = log.narrativeText;
      if (t.includes('MÜTTEFİK SİPERİ') || t.includes('FEDAKARCA ATILIŞ') || t.includes('GÖVDE SİPERİ')) {
        totalInterceptsObserved++;
      }
      if (t.includes('ÇAPRAZ KISKAÇ') || t.includes('İKİ ATEŞ ARASINDA') || t.includes('SENKRONİZE ÇİFTE HAMLE')) {
        totalPincersObserved++;
      }
      if (t.includes('İTTİFAKI') || t.includes('SİNERJİ') || t.includes('REZONANSI')) {
        totalCombosObserved++;
      }
      if (t.includes('KABZA ÇARPIŞMASI') || t.includes('KOPUK TEMPO') || t.includes('ŞAN HIRSI REKABETİ')) {
        totalDiscordsObserved++;
      }
      if (t.includes('YOLDAŞ YERE YIĞILDI') || t.includes('İTTİFAK KIRILDI')) {
        totalFallenTeammatesObserved++;
      }
    }

    expect(result.finalPlayerHp >= 0).toBe(true); // Can değerleri negatif olamaz
    expect(result.finalAllyHp >= 0).toBe(true);
    expect(result.finalEnemy1Hp >= 0).toBe(true);
    expect(result.finalEnemy2Hp >= 0).toBe(true);
  }

  console.log('=== 2v2 SİMÜLASYON TEST RAPORU (30 Maç) ===');
  console.log(`Mavi Köşe Galibiyeti: ${blueWins}`);
  console.log(`Kırmızı Köşe Galibiyeti: ${redWins}`);
  console.log(`Gözlemlenen Müttefik Siperleri: ${totalInterceptsObserved}`);
  console.log(`Gözlemlenen 2'ye 1 Kıskaca Alma: ${totalPincersObserved}`);
  console.log(`Gözlemlenen Yetenek Harman/Kombosu: ${totalCombosObserved}`);
  console.log(`Gözlemlenen Uyumsuzluk/Sürtüşme: ${totalDiscordsObserved}`);
  console.log(`Gözlemlenen Yoldaş Düşüş Bildirimi: ${totalFallenTeammatesObserved}`);

  expect(totalInterceptsObserved > 0).toBe(true); // Simülasyonlarda en az 1 müttefik siperi gözlemlenmelidir
  expect(totalPincersObserved > 0).toBe(true); // Simülasyonlarda en az 1 çifte kıskaca alma gözlemlenmelidir
  expect(totalFallenTeammatesObserved > 0).toBe(true); // Simülasyonlarda en az 1 yoldaş düşüşü bildirilmelidir
});

test('testSynergyComboModularVarietyAndEvolution', () => {
  const skill = gs('sk_fire', 'Ateş Fırtınası', '', SkillType.ATTACK, 1, 3, 'Alev patlaması', '+%40 Hasar');

  const trigger1 = DuoCombatNarratives.generateSynergyCombo(DuoSynergyType.TANK_AND_STRIKER, 'Ghorak', 'Gölge Bıçak', 'Morvath', 25, 1, skill);
  const trigger2 = DuoCombatNarratives.generateSynergyCombo(DuoSynergyType.TANK_AND_STRIKER, 'Ghorak', 'Gölge Bıçak', 'Morvath', 25, 2, skill);
  const trigger3 = DuoCombatNarratives.generateSynergyCombo(DuoSynergyType.TANK_AND_STRIKER, 'Ghorak', 'Gölge Bıçak', 'Morvath', 25, 3, skill);

  console.log(`--- 1. Tetiklenme: ${trigger1}`);
  console.log(`--- 2. Tetiklenme: ${trigger2}`);
  console.log(`--- 3. Tetiklenme: ${trigger3}`);

  expect(trigger1).not.toBe(trigger2); // 1. ve 2. tetiklenme metinleri birbirinden farklı olmalıdır
  expect(trigger2).not.toBe(trigger3); // 2. ve 3. tetiklenme metinleri birbirinden farklı olmalıdır

  expect(trigger1.includes('İTTİFAKI')).toBe(true); // 1. tetiklenme temel ittifak başlığını içermelidir
  expect(trigger2.includes('TEKRARLANAN FIRTINA')).toBe(true); // 2. tetiklenme tekrarlanan fırtına başlığını içermelidir
  expect(trigger3.includes('ZİRVE SENFONİ')).toBe(true); // 3. tetiklenme zirve senfoni başlığını içermelidir

  expect(trigger1.includes('Ateş Fırtınası')).toBe(true); // Yetenek adı metinde yer almalıdır
  expect(trigger1.includes('Morvath')).toBe(true); // Hedef adı metinde yer almalıdır
  expect(trigger1.includes('25 Uyum Hasarı')).toBe(true); // Hasar bilgisi metinde yer almalıdır
});

test('testPincerAndInterceptRepetitionEvolution', () => {
  // Pincer
  const pincer1 = DuoCombatNarratives.generatePincerDoubleTeam('A', 'B', 'C', 15, 1);
  const pincer2 = DuoCombatNarratives.generatePincerDoubleTeam('A', 'B', 'C', 15, 2);
  const pincer3 = DuoCombatNarratives.generatePincerDoubleTeam('A', 'B', 'C', 15, 3);

  expect(pincer1).not.toBe(pincer2); // Pincer 1 ve 2 farklı olmalıdır
  expect(pincer2).not.toBe(pincer3); // Pincer 2 ve 3 farklı olmalıdır

  // Intercept
  const intercept1 = DuoCombatNarratives.generateAllyIntercept('A', 'B', 'C', 20, true, 1);
  const intercept2 = DuoCombatNarratives.generateAllyIntercept('A', 'B', 'C', 20, true, 2);
  const intercept3 = DuoCombatNarratives.generateAllyIntercept('A', 'B', 'C', 20, true, 3);

  expect(intercept1).not.toBe(intercept2); // Intercept 1 ve 2 farklı olmalıdır
  expect(intercept2).not.toBe(intercept3); // Intercept 2 ve 3 farklı olmalıdır
});

test('testSingleSkillExecutionVariety', () => {
  const skill = gs('sk_crush', 'Ezici Balyoz', '', SkillType.ATTACK, 1, 3, 'Ezici vuruş', '+%35 Hasar');
  const narrative1 = DuoCombatNarratives.generateSkillExecutionNarrative('Morvath', 'Oyuncu', 'Kargı', skill, 45, true, 120, 200, 1);
  const narrative2 = DuoCombatNarratives.generateSkillExecutionNarrative('Morvath', 'Oyuncu', 'Kargı', skill, 45, true, 75, 200, 2);

  expect(narrative1).not.toBeNull();
  expect(narrative2).not.toBeNull();
  expect(narrative1.includes('Ezici Balyoz')).toBe(true);
  expect(narrative1.includes('Morvath')).toBe(true);
  expect(narrative1.includes('45 Hasar')).toBe(true);
});
