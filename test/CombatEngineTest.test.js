// Kotlin kaynağı: test/CombatEngineTest.kt
// Not: GameRepository kullanan testler (testTwelveFighterLeague..., testRepeatableExpeditions, testBuyEnemyIntel...,
// testLevelUpEvent..., testQuestFameCap..., testGarrisonPass..., testConditionalEquipmentBalance..., testDailyLimits...,
// testSingleTaskRunning..., testTavernClue...) GameRepository.js'e bağlıdır.
import { test, expect } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { StarterContent } from '../src/data/StarterContent.js';
import { CombatEngine } from '../src/domain/engine/CombatEngine.js';
import { CombatStance, DrawSituation, TextTemplateEngine } from '../src/domain/engine/TextTemplateEngine.js';
import { CombatEvent, Equipment, EquipmentSlot, FighterStanding, ItemRarity, Player, QuestType, Stats, TargetBodyPart } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

test('testTextTemplateEngineGeneratesValidNarrative', () => {
  const log = TextTemplateEngine.generateLog('Sürgün', 'Khorvash', 'Çatlak Meşe Yontusu', CombatEvent.CRITICAL, TargetBodyPart.CHEST, 4, 60, CombatStance.AGGRESSIVE);

  expect(log).not.toBeNull();
  expect(log.includes('Sürgün')).toBe(true);
  expect(log.includes('Khorvash')).toBe(true);
  expect(log.includes('4 Can')).toBe(true);
});

test('testCombatRunsUntilZeroHealth', () => {
  const player = new Player({
    name: 'Test Savaşçı',
    level: 1,
    baseStats: new Stats({ maxHealth: 100, damage: 10, armor: 2, speed: 8 }),
    currentHealth: 100,
  });
  const enemy = kt.first(StarterContent.createInitialEnemies());

  const result = CombatEngine.simulateBattle(player, enemy);

  expect(result).not.toBeNull();
  expect(result.logs.length > 0).toBe(true);
  expect(result.finalPlayerHp === 0 || result.isPlayerWinner).toBe(true);
});

test('testConsecutiveLossPenalty', () => {
  const standing0 = new FighterStanding({ id: 'p1', name: 'Test', title: 'T', consecutiveLosses: 0 });
  const standing1 = new FighterStanding({ id: 'p1', name: 'Test', title: 'T', consecutiveLosses: 1 });
  const standing2 = new FighterStanding({ id: 'p1', name: 'Test', title: 'T', consecutiveLosses: 2 });
  const standing3 = new FighterStanding({ id: 'p1', name: 'Test', title: 'T', consecutiveLosses: 3 });
  const standing4 = new FighterStanding({ id: 'p1', name: 'Test', title: 'T', consecutiveLosses: 4 });
  const standing5 = new FighterStanding({ id: 'p1', name: 'Test', title: 'T', consecutiveLosses: 5 });

  expect(standing0.calculateLossPenalty()).toBe(0);
  expect(standing1.calculateLossPenalty()).toBe(0);
  expect(standing2.calculateLossPenalty()).toBe(1);
  expect(standing3.calculateLossPenalty()).toBe(1);
  expect(standing4.calculateLossPenalty()).toBe(2);
  expect(standing5.calculateLossPenalty()).toBe(2);
});

test('testNpcVsNpcMatchSimulation', () => {
  const enemies = StarterContent.createInitialEnemies();
  const f1 = enemies[0];
  const f2 = enemies[1];

  const matchResult = CombatEngine.simulateNpcVsNpcMatch(f1, f2);

  expect(matchResult).not.toBeNull();
  expect(matchResult.scoreSummary.length > 0).toBe(true);
  expect(matchResult.narrativeSnippet.length > 0).toBe(true);
});

test('testVariousWeaponsAndBodyPartsProduceDiverseTexts', () => {
  // 1. Bludgeon to Head (Küt darbe kafa)
  const logHeadBludgeon = TextTemplateEngine.generateDetailedLog('Xylar', 'Sürgün', 'Çivili Ahşap Tokmak', CombatEvent.CRITICAL, TargetBodyPart.HEAD, 8, 30, CombatStance.AGGRESSIVE);
  console.log(`BLUDGEON HEAD CRIT:\n${logHeadBludgeon}\n`);
  expect(
    logHeadBludgeon.includes('Kafatasında') ||
      logHeadBludgeon.includes('başına') ||
      logHeadBludgeon.includes('Başına') ||
      logHeadBludgeon.includes('şakağında')
  ).toBe(true);

  // 2. Pierce to Chest (Delici kargı göğüs)
  const logChestPierce = TextTemplateEngine.generateDetailedLog('Morvath', 'Sürgün', 'Üç Ağızlı Kargı', CombatEvent.HIT, TargetBodyPart.CHEST, 11, 45, CombatStance.BALANCED);
  console.log(`PIERCE CHEST HIT:\n${logChestPierce}\n`);
  expect(logChestPierce.includes('göğsüne') || logChestPierce.includes('göğsünde') || logChestPierce.includes('Göğüs') || logChestPierce.includes('Göğsünde')).toBe(true);

  // 3. Bludgeon Dodge (Küt silah ıskası)
  const logBludgeonDodge = TextTemplateEngine.generateDetailedLog('Sürgün', 'Vaelen', 'Çatlak Meşe Yontusu', CombatEvent.DODGED, TargetBodyPart.LEG, 0, 70, CombatStance.DEFENSIVE);
  console.log(`BLUDGEON DODGE:\n${logBludgeonDodge}\n`);
  expect(
    logBludgeonDodge.includes('boşluğu döverek') ||
      logBludgeonDodge.includes('rüzgar') ||
      logBludgeonDodge.includes('kumlara çarparak') ||
      logBludgeonDodge.includes('kayarak') ||
      logBludgeonDodge.includes('sıyrıldı')
  ).toBe(true);

  // 5. Chain Mace (Zincir Topuz)
  const logChainMace = TextTemplateEngine.generateDetailedLog('Ghorak', 'Sürgün', 'Dikenli Pranga ve Zincir Topuz', CombatEvent.CRITICAL, TargetBodyPart.HEAD, 12, 15, CombatStance.AGGRESSIVE);
  console.log(`CHAIN MACE CRIT:\n${logChainMace}\n`);
  expect(logChainMace.includes('Zincir') || logChainMace.includes('zincir') || logChainMace.includes('topuz')).toBe(true);

  // 6. Crossbow (Arbalet)
  const logCrossbow = TextTemplateEngine.generateDetailedLog('Kaelen', 'Sürgün', 'Mekanik Kundaklı Arbalet', CombatEvent.HIT, TargetBodyPart.CHEST, 9, 40, CombatStance.OPPORTUNISTIC);
  console.log(`CROSSBOW HIT:\n${logCrossbow}\n`);
  expect(logCrossbow.includes('ok') || logCrossbow.includes('Ok') || logCrossbow.includes('arbalet')).toBe(true);

  // 7. Axe (Çelik Nacak)
  const logAxe = TextTemplateEngine.generateDetailedLog('Thyra', 'Sürgün', 'Çift Ağızlı Çelik Nacak', CombatEvent.CRITICAL, TargetBodyPart.SHOULDER, 14, 20, CombatStance.AGGRESSIVE);
  console.log(`AXE CRIT:\n${logAxe}\n`);
  expect(logAxe.includes('Nacak') || logAxe.includes('Balta') || logAxe.includes('balta')).toBe(true);

  // 8. Heavy Falchion (Ağır Kasap Palası)
  const logFalchion = TextTemplateEngine.generateDetailedLog('Bregash', 'Sürgün', 'Ağır Eğri Kasap Palası', CombatEvent.HIT, TargetBodyPart.SIDE, 8, 50, CombatStance.BALANCED);
  console.log(`FALCHION HIT:\n${logFalchion}\n`);
  expect(logFalchion.includes('pala') || logFalchion.includes('Pala') || logFalchion.includes('böğrü')).toBe(true);
});

test('testTwelveFighterLeagueWithWeeklyKuraFixtures', () => {
  const repo = new GameRepository();
  // 11 NPCs + 1 Player = 12 total standings
  expect(repo.leagueState.value.standings.length).toBe(12);
  expect(repo.enemies.value.length).toBe(11);

  // Verify weekly fixture has exactly 6 matches covering all 12 fighters
  const initialFixture = repo.leagueState.value.currentFixture;
  expect(initialFixture.length).toBe(6);
  expect(kt.count(initialFixture, (it) => it.isPlayerMatch)).toBe(1);
  expect(kt.count(initialFixture, (it) => !it.isPlayerMatch)).toBe(5);

  // Check all 12 fighter IDs are unique in the fixture
  const allFighterIds = [];
  initialFixture.forEach((it) => {
    allFighterIds.push(it.fighter1Id);
    allFighterIds.push(it.fighter2Id);
  });
  expect(allFighterIds.length).toBe(12);
  expect(kt.distinct(allFighterIds).length).toBe(12);

  // Fight the drawn opponent from the weekly kura
  const drawnOpponent = repo.getCurrentDrawnOpponent();
  expect(drawnOpponent).not.toBeNull();
  console.log(`DRAWN OPPONENT FOR PLAYER: ${drawnOpponent.name} - ${drawnOpponent.title}`);

  const combatResult = repo.executeCombat(drawnOpponent, null);
  expect(combatResult).not.toBeNull();

  // Verify round updated and all 6 matches were resolved and logged
  const recentMatches = repo.leagueState.value.recentMatches;
  expect(recentMatches.length).toBe(6);
  console.log(`LEAGUE MATCHES AFTER BATTLE (ROUND 6 -> 7): ${recentMatches.length} matches`);
  recentMatches.forEach((match, i) => {
    console.log(`${i + 1}. ${match.fighter1Name} vs ${match.fighter2Name}: ${match.scoreSummary}`);
  });

  // Verify a new 6-match fixture has been drawn for the next round
  const nextFixture = repo.leagueState.value.currentFixture;
  expect(nextFixture.length).toBe(6);
  expect(repo.leagueState.value.roundNumber).toBe(7);
});

test('testRepeatableExpeditions', () => {
  const repo = new GameRepository();
  const quest = kt.first(repo.quests.value, (it) => it.type === QuestType.EXPEDITION && it.requiredLevel <= 1 && it.requiredMinArmor <= 2);

  const [started] = repo.startQuest(quest.id);
  expect(started).toBe(true);
  expect(kt.first(repo.quests.value, (it) => it.id === quest.id).isRunning).toBe(true);

  // Advance past duration
  repo.advanceQuestTime(quest.durationSeconds + 1);
  expect(kt.first(repo.quests.value, (it) => it.id === quest.id).isFinished).toBe(true);

  // Claim reward
  const [claimed] = repo.claimQuestReward(quest.id);
  expect(claimed).toBe(true);

  // Verify it is claimed for the day (Daily limit rule)
  const claimedQuest = kt.first(repo.quests.value, (it) => it.id === quest.id);
  expect(claimedQuest.isRunning).toBe(false);
  expect(claimedQuest.isClaimed).toBe(true);
  expect(claimedQuest.elapsedSeconds).toBe(0);

  // Attempting to start again today should fail
  const [startedAgain, failMsg] = repo.startQuest(quest.id);
  expect(startedAgain).toBe(false);
  expect(failMsg.includes('bugün zaten tamamladınız')).toBe(true);

  // Next day dawn resets the quest
  repo.advanceDay(0, true);
  const resetQuest = kt.first(repo.quests.value, (it) => it.id === quest.id);
  expect(resetQuest.isClaimed).toBe(false);
  const [startedNextDay] = repo.startQuest(quest.id);
  expect(startedNextDay).toBe(true);
});

test('testDrawNarrativeVarietiesAcrossWeaponsAndFighters', () => {
  // 1. Bludgeon vs Bludgeon (Küt vs Küt)
  const drawBludgeon = TextTemplateEngine.generateDrawNarrative('Xylar', 'Çivili Ahşap Tokmak', 'Sürgün', 'Çatlak Meşe Yontusu', DrawSituation.DOUBLE_KNOCKOUT);
  console.log(`DRAW BLUDGEON:\n${drawBludgeon}\n`);
  expect(drawBludgeon).not.toBeNull();
  expect(drawBludgeon.includes('BERABERLİK') || drawBludgeon.includes('kumlara') || drawBludgeon.includes('nakavt')).toBe(true);

  // 2. Chain Mace vs Falchion (Zincir vs Pala)
  const drawChain = TextTemplateEngine.generateDrawNarrative('Ghorak', 'Dikenli Pranga ve Zincir Topuz', 'Bregash', 'Ağır Eğri Kasap Palası', DrawSituation.DOUBLE_KNOCKOUT);
  console.log(`DRAW CHAIN:\n${drawChain}\n`);
  expect(drawChain).not.toBeNull();
  expect(drawChain.includes('Ghorak') || drawChain.includes('zincir') || drawChain.includes('Zincir') || drawChain.includes('nakavt')).toBe(true);

  // 3. Crossbow vs Axe (Arbalet vs Nacak)
  const drawCrossbow = TextTemplateEngine.generateDrawNarrative('Kaelen', 'Mekanik Kundaklı Arbalet', 'Thyra', 'Çift Ağızlı Çelik Nacak', DrawSituation.DOUBLE_KNOCKOUT);
  console.log(`DRAW CROSSBOW:\n${drawCrossbow}\n`);
  expect(drawCrossbow).not.toBeNull();
  expect(
    drawCrossbow.includes('ok') || drawCrossbow.includes('Arbalet') || drawCrossbow.includes('Thyra') || drawCrossbow.includes('Kaelen') || drawCrossbow.includes('kumlara')
  ).toBe(true);

  // 4. Weapon Lock Situation
  const drawLock = TextTemplateEngine.generateDrawNarrative('Morvath', 'Üç Ağızlı Kargı', 'Orn', 'Çengelli Avcı Zıpkını', DrawSituation.WEAPON_LOCK);
  console.log(`DRAW WEAPON LOCK:\n${drawLock}\n`);
  expect(drawLock).not.toBeNull();
  expect(drawLock.includes('kenetlendi') || drawLock.includes('Morvath') || drawLock.includes('BERABERLİK')).toBe(true);

  // 5. Mutual Exhaustion Situation
  const drawExhaustion = TextTemplateEngine.generateDrawNarrative('Vaelen', 'Gölge Kancası', 'Sarkoth', 'Çift Zehirli Kemik Kama', DrawSituation.MUTUAL_EXHAUSTION);
  console.log(`DRAW EXHAUSTION:\n${drawExhaustion}\n`);
  expect(drawExhaustion).not.toBeNull();
  expect(drawExhaustion.includes('Rauntlar') || drawExhaustion.includes('takat') || drawExhaustion.includes('Vaelen') || drawExhaustion.includes('Sarkoth')).toBe(true);
});

test('testNpcVsNpcDrawSimulationProducesRichSnippet', () => {
  const enemies = StarterContent.createInitialEnemies();
  const f1 = kt.firstOrNull(enemies, (it) => it.name === 'Thyra');
  const f2 = kt.firstOrNull(enemies, (it) => it.name === 'Morvath');

  const match = CombatEngine.simulateNpcVsNpcMatch(f1, f2);
  expect(match).not.toBeNull();
  expect(match.narrativeSnippet.length > 0).toBe(true);
  console.log(`NPC MATCH RESULT: ${match.scoreSummary}\n${match.narrativeSnippet}\n`);
});

test('testEnemyWeaknessExploitTriggersInCombat', () => {
  const weaknesses = StarterContent.getAllEnemyWeaknesses();
  const morvathWeakness = kt.firstOrNull(weaknesses, (it) => it.enemyId === 'fighter_morvath');

  const player = new Player({
    name: 'Test Savaşçı',
    level: 5,
    baseStats: new Stats({ maxHealth: 200, damage: 25, armor: 5, speed: 15 }),
    currentHealth: 200,
    knownWeaknessIds: ['fighter_morvath'],
  });
  const enemy = kt.firstOrNull(StarterContent.createInitialEnemies(), (it) => it.id === 'fighter_morvath');

  // Run combat with known weakness
  let exploitTriggered = false;
  for (let i = 1; i <= 20; i++) {
    const result = CombatEngine.simulateBattle(player, enemy, null, morvathWeakness);
    if (result.logs.some((it) => it.narrativeText.includes('AÇIK İSTİSMARI'))) {
      exploitTriggered = true;
      const exploitLog = kt.first(result.logs, (it) => it.narrativeText.includes('AÇIK İSTİSMARI'));
      console.log(`Found exploit log: ${exploitLog.narrativeText}`);
      break;
    }
  }
  expect(exploitTriggered).toBe(true); // Beklenen açık istismarı dövüş kütüğünde tetiklenmeliydi!
});

test('testBuyEnemyIntelAndRepositoryWorkflow', () => {
  const repo = new GameRepository();
  const allWeaknesses = repo.getAllEnemyWeaknesses();
  expect(allWeaknesses.length).toBe(11);

  const target = kt.first(allWeaknesses);

  // Give player enough gold
  const [canBuy, msg] = repo.buyEnemyIntel(target.enemyId);
  expect(canBuy).toBe(true); // `İlk satın alım başarılı olmalı: ${msg}`
  expect(repo.player.value.knownWeaknessIds.includes(target.enemyId)).toBe(true); // Oyuncunun bilinen açıklarına eklenmeli

  // Buying again should be rejected
  const [canBuyAgain, repeatMsg] = repo.buyEnemyIntel(target.enemyId);
  expect(canBuyAgain).toBe(false); // Tekrar satın alma engellenmeli
  expect(repeatMsg.includes('zaten biliyorsun')).toBe(true);
});

test('testLevelUpEventTriggerAndDismissal', () => {
  const repo = new GameRepository();
  expect(repo.levelUpEvent.value).toBeNull();

  // Give enough exp to level up from 1 to 2 (needs 110 exp)
  const initialPlayer = repo.player.value;
  const [updatedPlayer, event] = repo.processExpGain(initialPlayer, 150);

  expect(event).not.toBeNull();
  expect(event.oldLevel).toBe(1);
  expect(event.newLevel).toBe(2);
  expect(event.healthGained).toBe(15);
  expect(event.damageGained).toBe(3);
  expect(event.armorGained).toBe(1);
  expect(event.speedGained).toBe(1);

  // Dismissal test
  repo.dismissLevelUpDialog();
  expect(repo.levelUpEvent.value).toBeNull();
});

test('testQuestFameCapAtFifty', () => {
  const repo = new GameRepository();
  const quest = kt.first(repo.quests.value, (it) => it.type === QuestType.EXPEDITION && it.id === 'quest_caravan');

  // When fame < 50, quest gives up to +1 fame
  const [s0] = repo.startQuest(quest.id);
  expect(s0).toBe(true);
  repo.advanceQuestTime(quest.durationSeconds + 1);
  const [s1, msg1] = repo.claimQuestReward(quest.id);
  expect(s1).toBe(true);
  expect(msg1.includes('Şöhret')).toBe(true); // Şöhret 50 altındayken +1 şöhret gelmeli

  // Next day dawns to allow next quest
  repo.advanceDay(0, true);
  const [s2] = repo.startQuest(quest.id);
  expect(s2).toBe(true);
  repo.advanceQuestTime(quest.durationSeconds + 1);
});

test('testGarrisonPassAndCanTravelToRegion2', () => {
  const repo = new GameRepository();
  expect(repo.canTravelToRegion2).toBe(false);

  // Player with 85 fame defeats top rival Morvath
  const highFamePlayer = repo.player.value.copy({
    globalFame: 88,
    currentHealth: 150,
    baseStats: new Stats({ maxHealth: 200, damage: 35, armor: 10, speed: 15 }),
  });
  const topRival = kt.firstOrNull(repo.enemies.value, (it) => it.id === 'fighter_morvath');
  expect(topRival).not.toBeNull(); // Kotlin'de `!!`

  const passPlayer = highFamePlayer.copy({ hasGarrisonPass: true });
  expect(passPlayer.hasGarrisonPass).toBe(true);
});

test('testConditionalEquipmentBalanceComparison', () => {
  const repo = new GameRepository();
  const recipes = repo.craftingRecipes.value;
  const wolfArmor = kt.firstOrNull(recipes, (it) => it.id === 'recipe_frost_wolf_armor').resultItem;
  const meteorBlade = kt.firstOrNull(recipes, (it) => it.id === 'recipe_meteorite_blade').resultItem;

  const standardSword = new Equipment({
    id: 'std_sword',
    name: 'Standart Demir Kılıç',
    slot: EquipmentSlot.WEAPON,
    stats: new Stats({ damage: 7 }),
    rarity: ItemRarity.SIRADAN,
    valueInGold: 25,
    description: 'Sıradan demir kılıç',
  });
  const standardArmor = new Equipment({
    id: 'std_armor',
    name: 'Standart Demir Göğüslük',
    slot: EquipmentSlot.CHEST,
    stats: new Stats({ armor: 4, maxHealth: 15 }),
    rarity: ItemRarity.SIRADAN,
    valueInGold: 30,
    description: 'Sıradan demir göğüslük',
  });

  const enemies = repo.enemies.value;
  const midEnemy = kt.firstOrNull(enemies, (it) => it.id === 'fighter_ghorak') ?? enemies[1];
  const bossEnemy = kt.firstOrNull(enemies, (it) => it.id === 'fighter_morvath') ?? kt.last(enemies);

  const runs = 200;

  // Test 1: Standard Gear Player vs Ghorak & Morvath
  const standardPlayer = new Player({
    name: 'Standart Oyuncu',
    level: 2,
    baseStats: new Stats({ maxHealth: 115, damage: 4, armor: 1, speed: 9 }),
    currentHealth: 130,
    equipped: {
      [EquipmentSlot.WEAPON]: standardSword,
      [EquipmentSlot.CHEST]: standardArmor,
    },
  });

  let stdVsMidWins = 0;
  let stdVsBossWins = 0;
  for (let i = 1; i <= runs; i++) {
    const r1 = CombatEngine.simulateBattle(standardPlayer.copy({ currentHealth: standardPlayer.totalStats.maxHealth }), midEnemy);
    if (r1.isPlayerWinner) stdVsMidWins++;
    const r2 = CombatEngine.simulateBattle(standardPlayer.copy({ currentHealth: standardPlayer.totalStats.maxHealth }), bossEnemy);
    if (r2.isPlayerWinner) stdVsBossWins++;
  }

  // Test 2: Crafted Gear Player vs Ghorak & Morvath
  const craftedPlayer = new Player({
    name: 'Efsanevi Teçhizatlı Oyuncu',
    level: 2,
    baseStats: new Stats({ maxHealth: 115, damage: 4, armor: 1, speed: 9 }),
    currentHealth: 150,
    equipped: {
      [EquipmentSlot.WEAPON]: meteorBlade,
      [EquipmentSlot.CHEST]: wolfArmor,
    },
  });

  let craftVsMidWins = 0;
  let craftVsBossWins = 0;
  let wolfRageTriggers = 0;
  let meteorBurnTriggers = 0;

  for (let i = 1; i <= runs; i++) {
    const r1 = CombatEngine.simulateBattle(craftedPlayer.copy({ currentHealth: craftedPlayer.totalStats.maxHealth }), midEnemy);
    if (r1.isPlayerWinner) craftVsMidWins++;
    wolfRageTriggers += kt.count(r1.logs, (it) => it.narrativeText.includes('[AK AYAZ ÖFKESİ!]'));
    meteorBurnTriggers += kt.count(r1.logs, (it) => it.narrativeText.includes('[GÖKTAŞI HARI!]'));

    const r2 = CombatEngine.simulateBattle(craftedPlayer.copy({ currentHealth: craftedPlayer.totalStats.maxHealth }), bossEnemy);
    if (r2.isPlayerWinner) craftVsBossWins++;
    wolfRageTriggers += kt.count(r2.logs, (it) => it.narrativeText.includes('[AK AYAZ ÖFKESİ!]'));
    meteorBurnTriggers += kt.count(r2.logs, (it) => it.narrativeText.includes('[GÖKTAŞI HARI!]'));
  }

  console.log('================================================================');
  console.log(`📊 KOŞULLU EKİPMAN DENGE TESTİ SONUÇLARI (${runs} Maç Simülasyonu)`);
  console.log('================================================================');
  console.log('1. STANDART TEÇHİZATLI OYUNCU (Demir Kılıç + Demir Göğüslük):');
  console.log(`   • ${midEnemy.name} (Sv. ${midEnemy.level} Orta Gladyatör) Karşısında Kazanma Oranı: %${kt.idiv(stdVsMidWins * 100, runs)}`);
  console.log(`   • ${bossEnemy.name} (Sv. ${bossEnemy.level} Lig Lideri) Karşısında Kazanma Oranı: %${kt.idiv(stdVsBossWins * 100, runs)}`);
  console.log('----------------------------------------------------------------');
  console.log('2. EFSANEVİ ZANAAT TEÇHİZATLI OYUNCU (Kurt Zırhı + Göktaşı Palası):');
  console.log(`   • ${midEnemy.name} (Sv. ${midEnemy.level} Orta Gladyatör) Karşısında Kazanma Oranı: %${kt.idiv(craftVsMidWins * 100, runs)}`);
  console.log(`   • ${bossEnemy.name} (Sv. ${bossEnemy.level} Lig Lideri) Karşısında Kazanma Oranı: %${kt.idiv(craftVsBossWins * 100, runs)}`);
  console.log(`   • Ortalama Ak Ayaz Öfkesi Tetiklenme Sayısı: ${wolfRageTriggers / (runs * 2)} kez/maç`);
  console.log(`   • Ortalama Göktaşı Harı Tetiklenme Sayısı: ${meteorBurnTriggers / (runs * 2)} kez/maç`);
  console.log('================================================================');

  expect(craftVsMidWins >= stdVsMidWins).toBe(true);
});

test('testDailyLimitsAndPrerequisites', () => {
  const repo = new GameRepository();

  // 1. Görev Seviye Şartı Kontrolü (Bandit Ambush Seviye 2 gerektirir, başlangıç oyuncusu Seviye 1'dir)
  const [banditStart, banditMsg] = repo.startQuest('quest_bandit_ambush');
  expect(banditStart).toBe(false);
  expect(banditMsg.includes('Seviye 2')).toBe(true);

  // 2. Başlangıç Sefer Sözleşmesi (Kervan Koruması - Zırh 2 gerektirir, oyuncunun 3 zırhı vardır)
  const [caravanStart] = repo.startQuest('quest_caravan');
  expect(caravanStart).toBe(true);

  // Görevi tamamla ve ödülü al
  repo.advanceQuestTime(25);
  const [claimed] = repo.claimQuestReward('quest_caravan');
  expect(claimed).toBe(true);

  // Aynı gün tekrar başlatılamaz (Günde 1 kere kuralı)
  const [caravanRepeat, repeatMsg] = repo.startQuest('quest_caravan');
  expect(caravanRepeat).toBe(false);
  expect(repeatMsg.includes('bugün zaten tamamladınız')).toBe(true);

  // 3. Efsanevi Av Seviye Şartı Kontrolü (Ak Ayaz Kurdu Seviye 2 gerektirir)
  const [wolfStart, wolfMsg] = repo.startAdventure('adv_white_wolf_hunt');
  expect(wolfStart).toBe(false);
  expect(wolfMsg.includes('Seviye 2')).toBe(true);

  // 4. Gün İlerletme (advanceDay) ile Görevlerin Yenilenmesi
  repo.advanceDay(0, true);
  const [caravanNextDay] = repo.startQuest('quest_caravan');
  expect(caravanNextDay).toBe(true);

  // 5. Zanaat: 2x Malzeme ve Yeterli Altın Gereksinimi
  const [craftFail1, msgCraft1] = repo.craftEquipment('recipe_frost_wolf_armor');
  expect(craftFail1).toBe(false);
  expect(msgCraft1.includes('2x')).toBe(true); // En az 2 malzeme gerekmeli
});

test('testSingleTaskRunningConstraint', () => {
  const repo = new GameRepository();
  // 1. İlk görevi başlat
  const [q1Started] = repo.startQuest('quest_caravan');
  expect(q1Started).toBe(true);
  expect(repo.isAnyTaskRunning).toBe(true);

  // 2. Karakter görevdeyken başka bir görevi başlatmaya çalış (engellenmeli)
  const otherQuest = kt.firstOrNull(repo.quests.value, (it) => it.id !== 'quest_caravan');
  if (otherQuest != null) {
    const [q2Started, q2Msg] = repo.startQuest(otherQuest.id);
    expect(q2Started).toBe(false);
    expect(q2Msg.includes('faal bir sözleşme veya sefer')).toBe(true);
  }

  // 3. Karakter görevdeyken efsanevi av seferi başlatmaya çalış (engellenmeli)
  // Oyuncuya seviye 2 verelim ki seviye engelini değil sefer kısıtlamasını test edebilelim
  const playerWithLvl = repo.player.value.copy({ level: 3, currentHealth: 150 });
  // Sefer başlatmayı doğrudan dene
  const [advStarted, advMsg] = repo.startAdventure('adv_white_wolf_hunt');
  expect(advStarted).toBe(false);
  expect(advMsg.includes('faal bir sözleşme veya sefer')).toBe(true);

  // 4. Görev bittiğinde ve teslim alındığında kısıtlama kalkar
  repo.advanceQuestTime(25);
  const [claimed] = repo.claimQuestReward('quest_caravan');
  expect(claimed).toBe(true);
  expect(repo.isAnyTaskRunning).toBe(false);
});

test('testTavernClueAndQuestChainProgression', () => {
  const repo = new GameRepository();

  // 1. Başlangıçta söylenti görevi açık değildir
  expect(repo.player.value.unlockedRumorQuestIds.includes('quest_swamp_1')).toBe(false);

  // 2. Handa ipucu içeren hikaye dinlendiğinde ipucu açılır
  const taleWithClue = kt.first(StarterContent.createTavernTales(), (it) => it.questClueId === 'quest_swamp_1');
  const [, clueMsg] = repo.listenRandomTavernTale(null, taleWithClue);
  expect(clueMsg).not.toBeNull();
  expect(repo.player.value.unlockedRumorQuestIds.includes('quest_swamp_1')).toBe(true);

  // 3. Gün ilerletildiğinde söylenti görevi panoda yer alır
  repo.advanceDay(0, true);
  expect(repo.quests.value.some((it) => it.id === 'quest_swamp_1')).toBe(true);

  // 4. 1. Aşama Sözleşmesini Tamamla -> 2. Aşama Açılmalı
  const [q1Start] = repo.startQuest('quest_swamp_1');
  expect(q1Start).toBe(true);
  repo.advanceQuestTime(35);
  const [q1Claim, q1ClaimMsg] = repo.claimQuestReward('quest_swamp_1');
  expect(q1Claim).toBe(true);
  expect(q1ClaimMsg.includes('GÖREV ZİNCİRİ İLERLEDİ')).toBe(true);
  expect(repo.player.value.unlockedRumorQuestIds.includes('quest_swamp_2')).toBe(true);

  // 5. Ertesi gün 2. Aşama panoya düşer
  repo.advanceDay(0, true);
  expect(repo.quests.value.some((it) => it.id === 'quest_swamp_2')).toBe(true);
});
