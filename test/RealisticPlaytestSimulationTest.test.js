// Kotlin kaynağı: test/RealisticPlaytestSimulationTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';
import { CombatEngine } from '../src/domain/engine/CombatEngine.js';
import { QuestType, RumorCategory, Stats, calculatePlayerTitle } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

let repository;

beforeEach(() => {
  SaveManager.useMemoryStorage();
  repository = new GameRepository();
});

test('runComprehensiveRealisticPlaytest30Days', () => {
  console.log('================================================================================');
  console.log('GERÇEK OYUN TESTİ & SİMÜLASYON BAŞLATILIYOR (30 GÜNLÜK GELİŞİM VE DÖNGÜ TESTİ)');
  console.log('================================================================================');

  const totalDays = 30;
  let totalPlayerCombats = 0;
  let playerWins = 0;
  let playerLosses = 0;
  let playerDraws = 0;
  let totalSpectatorBets = 0;
  let spectatorBetsWon = 0;

  const allCombatLogs = [];
  const strikeActionPhrases = [];
  const impactPhrases = [];
  const roundDurations = [];

  const playerGoldHistory = [];
  const playerHpHistory = [];
  const playerLevelHistory = [];
  const playerFameHistory = [];
  let totalExploitTriggers = 0;
  let totalQuestsCompleted = 0;
  let totalQuestsFailed = 0;
  let totalMealsEaten = 0;
  let totalIntelPurchased = 0;
  let totalTavernWhispersListened = 0;

  // Simulate 30 Days of realistic gameplay
  for (let day = 1; day <= totalDays; day++) {
    const playerBefore = repository.player.value;
    playerGoldHistory.push(playerBefore.gold);
    playerHpHistory.push(playerBefore.currentHealth);
    playerLevelHistory.push(playerBefore.level);
    playerFameHistory.push(playerBefore.globalFame);

    // 1. Günlük İdman yap
    repository.dailyTraining();

    // 2. Handan Yararlanma: Can eksikse yemek ye (+15 veya +35 Can)
    if (repository.player.value.currentHealth < repository.player.value.totalStats.maxHealth - 15) {
      if (repository.player.value.gold >= 12 && repository.dayState.value.canEatMealToday) {
        repository.orderTavernMeal(12, 35, 'Dağ Tavşanı');
        totalMealsEaten++;
      } else if (repository.player.value.gold >= 5 && repository.dayState.value.canEatMealToday) {
        repository.orderTavernMeal(5, 15, 'İsli Çorba');
        totalMealsEaten++;
      }
    }

    // 3. Masalara Kulak Kabartma (Han Dedikodusu Dinle - Bedava Açık Şansı)
    repository.listenRandomTavernTale(RumorCategory.ARENA_GOSSIP);
    totalTavernWhispersListened++;

    // 4. Günlük Görev / Sefer Sözleşmesi Yap
    const availableQuests = repository.quests.value.filter((it) => !it.isClaimed);
    if (availableQuests.length > 0) {
      const chosenQuest =
        day % 3 === 0
          ? (kt.firstOrNull(availableQuests, (it) => it.id === 'quest_arena_scout') ?? kt.first(availableQuests))
          : (kt.randomOrNull(availableQuests.filter((it) => it.type === QuestType.EXPEDITION)) ?? kt.first(availableQuests));
      const [questStarted] = repository.startQuest(chosenQuest.id);
      if (questStarted) {
        repository.advanceQuestTime(chosenQuest.durationSeconds + 1);
        const [questSuccess] = repository.claimQuestReward(chosenQuest.id);
        if (questSuccess) {
          totalQuestsCompleted++;
        } else {
          totalQuestsFailed++;
        }
      }
    }

    // 4b. Efsanevi Av Seferi (Seviye 2+)
    const availableAdventures = repository.adventures.value.filter((it) => !it.isClaimed);
    if (availableAdventures.length > 0 && repository.player.value.level >= 2) {
      const chosenAdv = kt.random(availableAdventures);
      const [advStarted] = repository.startAdventure(chosenAdv.id);
      if (advStarted) {
        repository.advanceQuestTime(chosenAdv.durationSeconds + 1);
        repository.claimAdventureReward(chosenAdv.id);
      }
    }

    // 5. Rakip Analizi & Muhbirden Bilgi Satın Alma
    const drawnEnemy = repository.getCurrentDrawnOpponent() ?? kt.first(repository.enemies.value);
    if (!repository.player.value.knownWeaknessIds.includes(drawnEnemy.id) && repository.player.value.gold >= 40) {
      const [bought] = repository.buyEnemyIntel(drawnEnemy.id);
      if (bought) {
        totalIntelPurchased++;
      }
    }

    // 6. Karar Mekanizması: Can %30'un altındaysa seyirci bahsi yap, değilse arenaya çık
    const isCriticalHp = repository.player.value.currentHealth < repository.player.value.totalStats.maxHealth * 0.3;

    if (isCriticalHp && repository.player.value.gold >= 10) {
      // Seyirci Bahsi Oyna (5 NPC maçından birine)
      const fixtureMatches = repository.leagueState.value.currentFixture.filter((it) => !it.isPlayerMatch);
      if (fixtureMatches.length > 0) {
        const match = kt.first(fixtureMatches);
        const [success] = repository.placeSpectatorBet(match, match.fighter1Name, 10);
        if (success) {
          totalSpectatorBets++;
        }
      }
    }

    // Eğer seyirci bahsi oynanmadıysa dövüşe çık
    if (!repository.dayState.value.isDailySpectatorBetPlaced) {
      const combatResult = repository.executeCombat(drawnEnemy);
      totalPlayerCombats++;
      roundDurations.push(combatResult.totalRounds);

      if (combatResult.isDraw) {
        playerDraws++;
      } else if (combatResult.isPlayerWinner) {
        playerWins++;
      } else {
        playerLosses++;
      }

      // Dövüş loglarını topla & açık istismarlarını say
      for (const log of combatResult.logs) {
        allCombatLogs.push(log.narrativeText);
        if (log.narrativeText.includes('AÇIK İSTİSMARI')) {
          totalExploitTriggers++;
        }
        const sentences = log.narrativeText.split('\n').filter((it) => kt.isNotBlank(it));
        if (sentences.length > 0) {
          strikeActionPhrases.push(kt.first(sentences));
        }
        if (sentences.length > 1) {
          impactPhrases.push(sentences[1]);
        }
      }
    }

    // 7. Günlük Alışveriş / Teçhizat & Oda Geliştirme (Yeterli altın varsa)
    const currentGold = repository.player.value.gold;
    const affordableRoom = kt.firstOrNull(repository.rooms.value, (it) => it.upgradeCostGold <= currentGold);
    if (affordableRoom != null && currentGold > 100) {
      repository.upgradeRoom(affordableRoom.id);
    }

    // 8. Günü İlerlet (Şafak Sökümü)
    const dawnNarrative = repository.advanceDay(0);
    if (dawnNarrative.includes('Seyirci Bahsi Tuttu')) {
      spectatorBetsWon++;
    }
  }

  // ================================================================================
  // SİMÜLASYON RAPORU & İSTATİSTİK ANALİZİ
  // ================================================================================
  console.log('\n--- 1. OYUNCU GELİŞİMİ VE EKONOMİ ---');
  const finalPlayer = repository.player.value;
  console.log(`Başlangıç Seviyesi: 1  -->  30. Gün Seviyesi: ${finalPlayer.level}`);
  console.log(`Başlangıç Canı: 100  -->  30. Gün Sağlığı: ${finalPlayer.currentHealth}/${finalPlayer.totalStats.maxHealth}`);
  console.log(
    `Son Nitelikler: Hasar=${finalPlayer.totalStats.damage}, Zırh=${finalPlayer.totalStats.armor}, Hız=${finalPlayer.totalStats.speed}, Kritik=%${finalPlayer.totalStats.critChancePercent}`,
  );
  console.log(`30. Gün Sonundaki Altın: ${finalPlayer.gold}`);
  console.log(`30. Gün Sonundaki Şöhret: ${finalPlayer.globalFame} (Unvan: ${finalPlayer.title})`);
  console.log(
    `Altın Seyri (İlk 10, 20, 30. gün): Day 1=${playerGoldHistory[0]}, Day 10=${playerGoldHistory[9]}, Day 20=${playerGoldHistory[19]}, Day 30=${finalPlayer.gold}`,
  );

  console.log('\n--- 2. DÖVÜŞ VE MAÇ İSTATİSTİKLERİ ---');
  console.log(`Toplam Oyuncu Dövüşü: ${totalPlayerCombats}`);
  console.log(`Galibiyet: ${playerWins} (${totalPlayerCombats > 0 ? kt.idiv(playerWins * 100, totalPlayerCombats) : 0}%)`);
  console.log(`Mağlubiyet: ${playerLosses}`);
  console.log(`Beraberlik: ${playerDraws}`);
  console.log(`Toplam Oynanan Seyirci Bahsi: ${totalSpectatorBets} (Kazanılan: ${spectatorBetsWon})`);
  const avgRounds = roundDurations.length > 0 ? kt.average(roundDurations) : 0.0;
  const maxRounds = roundDurations.length > 0 ? kt.maxOrNull(roundDurations) : 0;
  const minRounds = roundDurations.length > 0 ? kt.minOrNull(roundDurations) : 0;
  console.log(`Ortalama Dövüş Raunt Süresi: ${kt.format('%.2f', avgRounds)} raunt (En Kısa: ${minRounds}, En Uzun: ${maxRounds})`);

  console.log('\n--- 3. DÖVÜŞ METİNLERİ VE TEKRAR ANALİZİ ---');
  console.log(`Toplam Üretilen Dövüş Hamlesi Cümlesi: ${allCombatLogs.length}`);
  const uniqueFullLogs = new Set(allCombatLogs).size;
  const uniqueStrikePhrases = new Set(strikeActionPhrases).size;
  const uniqueImpactPhrases = new Set(impactPhrases).size;
  console.log(
    `Özgün Tam Log Sayısı: ${uniqueFullLogs} / ${allCombatLogs.length} (%${allCombatLogs.length > 0 ? kt.idiv(uniqueFullLogs * 100, allCombatLogs.length) : 100} özgünlük)`,
  );
  console.log(`Özgün Hamle/Eylem Cümlesi: ${uniqueStrikePhrases}`);
  console.log(`Özgün Vuruş/Bölge Etkisi Cümlesi: ${uniqueImpactPhrases}`);

  // En çok tekrar eden vuruş bölge cümleleri
  const sayac = new Map();
  for (const p of impactPhrases) sayac.set(p, (sayac.get(p) ?? 0) + 1);
  const impactFrequencies = kt.sortedByDescending(Array.from(sayac.entries()), (it) => it[1]);
  console.log('\nEn Sık Karşılaşılan Vuruş Bölge Cümleleri (Top 5):');
  kt.take(impactFrequencies, 5).forEach(([phrase, count], i) => {
    console.log(`  ${i + 1}. [${count} kez] ${phrase}`);
  });

  console.log('\n--- 4. YAPAY ZEKA (NPC) EVRİMİ VE İSTATİSTİK DENGESİ ---');
  const enemies = repository.enemies.value;
  console.log('30 Gün Sonunda 11 Dövüşçünün Durumu:');
  enemies.forEach((enemy) => {
    console.log(
      `  • ${enemy.name} (${enemy.personality.archetype.icon} ${enemy.personality.archetype.title}): ` +
        `Altın: ${enemy.personality.gold}, Can: ${enemy.stats.maxHealth}, Hasar: ${enemy.stats.damage}, Zırh: ${enemy.stats.armor}, Durum: '${enemy.personality.currentCondition}'`,
    );
  });

  console.log('\n--- 5. LİG TABLOSU VE SIRALAMA (30. GÜN) ---');
  const standings = repository.leagueState.value.standings;
  console.log(`Hafta (Raunt): ${repository.leagueState.value.roundNumber}`);
  standings.forEach((s, rank) => {
    console.log(`  #${rank + 1} ${s.name} [${s.title}] - O: ${s.matchesPlayed} | G: ${s.wins} | B: ${s.draws} | M: ${s.losses} | Puan: ${s.points}`);
  });

  console.log('\n--- 6. TAKTİKSEL İSTİHBARAT, HAN & AÇIK İSTİSMARI ---');
  console.log(`Satın Alınan Rakip Açığı: ${totalIntelPurchased}`);
  console.log(`Dinlenen Han Fısıltısı: ${totalTavernWhispersListened}`);
  console.log(`Çözülen Toplam Zaafiyet: ${finalPlayer.knownWeaknessIds.length} / 11 (${finalPlayer.knownWeaknessIds.join(', ')})`);
  console.log(`Dövüşlerde Gerçekleşen Açık İstismarı Sayısı: ${totalExploitTriggers} kez`);
  console.log(`Tamamlanan Sefer Görevleri: ${totalQuestsCompleted} (Başarısız Olan: ${totalQuestsFailed})`);
  console.log(`Tüketilen Han Sıcak Yemeği: ${totalMealsEaten} tas`);

  console.log('\n--- 7. SEVİYE & ŞÖHRET GELİŞİM EĞRİSİ ---');
  console.log('Seviye İlerlemesi (Günlük):');
  const levelMilestones = new Map();
  playerLevelHistory.forEach((lvl, dayIndex) => {
    if (!levelMilestones.has(lvl)) {
      levelMilestones.set(lvl, dayIndex + 1);
    }
  });
  levelMilestones.forEach((day, lvl) => {
    console.log(`  • Seviye ${lvl} -> ${day}. günde ulaşıldı`);
  });
  console.log(
    `Şöhret İlerlemesi: Başlangıç=0, Gün 10=${playerFameHistory[9]}, Gün 20=${playerFameHistory[19]}, Gün 30=${finalPlayer.globalFame} (Unvan: ${finalPlayer.title})`,
  );

  console.log('================================================================================');
  expect(repository.dayState.value.currentDay >= 25).toBe(true); // En az 25 gün başarıyla tamamlanmalı
  expect(finalPlayer.globalFame >= 45).toBe(true); // 30 gün sonunda oyuncu şöhreti ilerlemeli (en az 45 olmalı)
  expect(repository.region.value.localFame).toBe(finalPlayer.globalFame); // Bölge şöhreti oyuncu şöhreti ile senkron olmalı
  expect(finalPlayer.title).toBe(calculatePlayerTitle(finalPlayer.globalFame, finalPlayer.hasGarrisonPass)); // Unvan şöhret eğrisiyle tam uyuşmalı
});

test('testFameProgressionAndTitleSync', () => {
  const repo = new GameRepository();
  expect(repo.player.value.globalFame).toBe(0);
  expect(repo.player.value.title).toBe('Bilinmeyen Sürgün');
  expect(repo.region.value.localFame).toBe(0);

  // 1. Ozan Destanı Dinleme (+1 Şöhret)
  const initialGold = repo.player.value.gold;
  repo.listenBardSong(true);
  expect(repo.player.value.globalFame).toBe(1);
  expect(repo.region.value.localFame).toBe(1);
  expect(repo.player.value.gold).toBe(initialGold - 5);

  // 2. Sefer / Görev Şöhreti
  const testQuests = repo.quests.value;
  const fameQuest = kt.firstOrNull(testQuests, (it) => it.rewardFame >= 1) ?? kt.first(testQuests);
  repo.startQuest(fameQuest.id);
  repo.advanceQuestTime(fameQuest.durationSeconds + 1);
  const [questSuccess] = repo.claimQuestReward(fameQuest.id);
  expect(questSuccess).toBe(true);
  expect(repo.player.value.globalFame > 1).toBe(true); // Görev sonrası şöhret artmalı
  expect(repo.region.value.localFame).toBe(repo.player.value.globalFame);

  // 3. Efsanevi Av Seferi (+2 Şöhret)
  const testAdventures = repo.adventures.value;
  const adv = kt.first(testAdventures);
  const fameBeforeAdv = repo.player.value.globalFame;
  repo.startAdventure(adv.id);
  repo.advanceQuestTime(adv.durationSeconds + 1);
  repo.claimAdventureReward(adv.id);
  // Eğer başarılı olduysa +2 şöhret almış olmalı
  if (kt.firstOrNull(repo.adventures.value, (it) => it.id === adv.id)?.isClaimed === true) {
    expect(repo.player.value.globalFame).toBe(fameBeforeAdv + 2);
    expect(repo.region.value.localFame).toBe(repo.player.value.globalFame);
  }

  // 4. Arena Galibiyet Şöhreti (enemy.rewardFame doğrulaması)
  const enemyThyra = kt.firstOrNull(repo.enemies.value, (it) => it.name === 'Thyra' || it.id.includes('thyra'));
  expect(enemyThyra.rewardFame).toBe(3);
  const combatResult = CombatEngine.simulateBattle(
    repo.player.value.copy({
      baseStats: new Stats({ maxHealth: 500, damage: 100, armor: 50, speed: 50 }),
      currentHealth: 500,
    }),
    enemyThyra,
  );
  expect(combatResult.isPlayerWinner).toBe(true); // Güçlü oyuncu Thyra'yı yenmeli
  expect(combatResult.earnedFame >= 3).toBe(true); // Thyra'ya karşı kazanılan şöhret en az rewardFame (3) kadar olmalı

  // 5. Unvan Geçişlerinin Doğrulanması (Title Curve Test)
  expect(calculatePlayerTitle(0)).toBe('Bilinmeyen Sürgün');
  expect(calculatePlayerTitle(9)).toBe('Bilinmeyen Sürgün');
  expect(calculatePlayerTitle(10)).toBe('Fısıltısı Duyulan');
  expect(calculatePlayerTitle(20)).toBe('Kumların Yabancısı');
  expect(calculatePlayerTitle(30)).toBe('Kasaba Dövüşçüsü');
  expect(calculatePlayerTitle(40)).toBe('Alkış Alan Gladyatör');
  expect(calculatePlayerTitle(50)).toBe('Korkulan Silahşör');
  expect(calculatePlayerTitle(60)).toBe('Kırlangıç Ustası');
  expect(calculatePlayerTitle(70)).toBe('Kasaba Şampiyonu');
  expect(calculatePlayerTitle(80)).toBe('Diyarın Sesi');
  expect(calculatePlayerTitle(90)).toBe('Kırlangıç Efsanesi');
  expect(calculatePlayerTitle(100)).toBe('Kırlangıç Kasabası Fatihi');
  expect(calculatePlayerTitle(50, true)).toBe('Kırlangıç Kasabası Fatihi');
});
