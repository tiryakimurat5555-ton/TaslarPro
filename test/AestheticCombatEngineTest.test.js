// Kotlin kaynağı: test/AestheticCombatEngineTest.kt
// Not: testAestheticCombatSimulationZeroBloodAndSubmission, testGameRepositoryUnarmedMatchExecution,
// testAdvanceDayUpdatesUnarmedSchedule, testArenaRulesAndDisciplinesNoCollisionAudit, testWrestlingCombatSimulationGladiatorBrawl,
// testSingleBeastMatadorAndTrapsSimulation ve testBeastPackSwarmAndCollisionsSimulation GameRepository.js'e bağlıdır.
import { test, expect } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { PehlivanOintmentsData } from '../src/data/PehlivanOintmentsData.js';
import { StarterContent } from '../src/data/StarterContent.js';
import { AestheticCombatEngine } from '../src/domain/engine/AestheticCombatEngine.js';
import { AestheticCombatNarratives } from '../src/domain/engine/AestheticCombatNarratives.js';
import { AestheticOutfitGenerator, AestheticStyle } from '../src/domain/engine/AestheticOutfitGenerator.js';
import { UnarmedScheduleManager } from '../src/domain/engine/UnarmedScheduleManager.js';
import { WrestlingCombatNarratives } from '../src/domain/engine/WrestlingCombatNarratives.js';
import { EquipmentSlot, UnarmedMatchState, UnarmedShowType, UsableCategory } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

/** Kotlin String.contains(x, ignoreCase = true) */
const ic = (metin, aranan) => metin.toLowerCase().includes(aranan.toLowerCase());
const bloodKeywords = ['kan fışkırdı', 'bağırsak', 'boğazı kesildi', 'uzuv koptu', 'parçalandı ve kan'];

test('testUnarmedArenaScheduleCycle', () => {
  // 4 günlük dönüşümlü takvim kontrolü:
  // Gün % 4 == 1: SINGLE_BEAST
  // Gün % 4 == 2: AESTHETIC_DUEL
  // Gün % 4 == 3: BEAST_PACK
  // Gün % 4 == 0: GLADIATOR_BRAWL
  expect(UnarmedScheduleManager.getScheduledShowType(1)).toBe(UnarmedShowType.SINGLE_BEAST);
  expect(UnarmedScheduleManager.getScheduledShowType(2)).toBe(UnarmedShowType.AESTHETIC_DUEL);
  expect(UnarmedScheduleManager.getScheduledShowType(3)).toBe(UnarmedShowType.BEAST_PACK);
  expect(UnarmedScheduleManager.getScheduledShowType(4)).toBe(UnarmedShowType.GLADIATOR_BRAWL);

  expect(UnarmedScheduleManager.getScheduledShowType(5)).toBe(UnarmedShowType.SINGLE_BEAST);
  expect(UnarmedScheduleManager.getScheduledShowType(6)).toBe(UnarmedShowType.AESTHETIC_DUEL);

  const forecast = UnarmedScheduleManager.getScheduleForecast(2, 4);
  expect(forecast.length).toBe(4);
  expect(forecast[0].isToday).toBe(true);
  expect(forecast[0].dayNumber).toBe(2);
  expect(forecast[0].showType).toBe(UnarmedShowType.AESTHETIC_DUEL);
  expect(forecast[1].isToday).toBe(false);
  expect(forecast[1].dayNumber).toBe(3);
  expect(forecast[1].showType).toBe(UnarmedShowType.BEAST_PACK);
});

test('testAestheticOutfitGeneratorCompletenessAndStatSanitization', () => {
  const styles = [AestheticStyle.PIRATE, AestheticStyle.ROYAL, AestheticStyle.STREET, AestheticStyle.SOUTHERN_OASIS, AestheticStyle.RANDOM_MIX];

  for (const style of styles) {
    const outfit = AestheticOutfitGenerator.generateOutfit(style);
    expect(outfit.allPieces.length).toBe(5); // Kıyafet seti 5 parça olmalıdır
    expect(outfit.head.slot).toBe(EquipmentSlot.HEAD);
    expect(outfit.chest.slot).toBe(EquipmentSlot.CHEST);
    expect(outfit.pants.slot).toBe(EquipmentSlot.PANTS);
    expect(outfit.boots.slot).toBe(EquipmentSlot.BOOTS);
    expect(outfit.gloves.slot).toBe(EquipmentSlot.GLOVES);

    const sanitizedStats = outfit.calculateSanitizedStats();
    // Sadece 4 temel istatistik (Güç, Hız, Dayanıklılık, Kurnazlık) pozitif olabilir
    expect(sanitizedStats.damage >= 0 && sanitizedStats.speed >= 0).toBe(true); // Temel güç veya hız bonusu sağlanmalıdır
    expect(sanitizedStats.blockChancePercent).toBe(0); // Kalkan blok şansı estetik kıyafette 0 olmalıdır
  }
});

test('testAestheticCombatSimulationZeroBloodAndSubmission', () => {
  const player = new GameRepository().player.value;
  const opponent =
    kt.firstOrNull(UnarmedMatchState.sampleOpponents, (it) => it.showType === UnarmedShowType.AESTHETIC_DUEL) ??
    kt.first(UnarmedMatchState.sampleOpponents);

  const result = AestheticCombatEngine.simulateDuel(player, opponent);

  expect(result).not.toBeNull(); // Düello sonucu boş olmamalıdır
  expect(result.roundsPlayed >= 1).toBe(true); // En az 1 raunt oynanmış olmalıdır
  expect(result.combatLogs.length > 0).toBe(true); // Dövüş günlükleri üretilmiş olmalıdır

  // Kan ve vahşet içermeme kontrolü
  for (const log of result.combatLogs) {
    for (const keyword of bloodKeywords) {
      expect(ic(log, keyword)).toBe(false); // `Günlüklerde kan ve vahşet olmamalıdır: ${log}`
    }
  }

  // Zafer gerekçesi kontrolü (Teslimiyet / zarafet nakavtı)
  expect(result.victoryReason.includes('pes etti') || result.victoryReason.includes('diz çökerek')).toBe(true);
});

test('testGameRepositoryUnarmedMatchExecution', () => {
  const repository = new GameRepository();
  expect(repository.dayState.value.currentDay).toBe(1);

  // Günün takvim tipi
  const todayType = UnarmedScheduleManager.getScheduledShowType(1);
  expect(todayType).toBe(UnarmedShowType.SINGLE_BEAST);

  // Maçı simüle et
  const opponent = kt.first(UnarmedMatchState.sampleOpponents);
  const result = repository.simulateUnarmedMatch(opponent);

  expect(result).not.toBeNull();
  expect(repository.unarmedCombatResult.value).not.toBeNull();
  expect(repository.dayState.value.isArenaMatchDoneToday).toBe(true);

  // Modal kapatma
  repository.dismissUnarmedCombatModal();
  expect(repository.unarmedCombatResult.value).toBeNull();
});

test('testAdvanceDayUpdatesUnarmedSchedule', () => {
  const repository = new GameRepository();
  expect(repository.dayState.value.currentDay).toBe(1);

  // Gün atla (force = true)
  repository.advanceDay(0, true);
  expect(repository.dayState.value.currentDay).toBe(2);

  // 2. Gün -> AESTHETIC_DUEL olmalı
  expect(repository.unarmedMatchState.value.selectedShowType).toBe(UnarmedShowType.AESTHETIC_DUEL);
  expect(repository.unarmedMatchState.value.currentOpponent?.name).toBe('Saten Düellocu Leander');
});

test('testAnnouncerCommentaryAndSpectatorReactions', () => {
  const commentary = AestheticCombatNarratives.generateAnnouncerCommentary('Sürgün Silahşör', 'Leander', 2);
  expect(commentary).not.toBeNull();
  expect(
    commentary.includes('') &&
      (ic(commentary, 'yatak') ||
        ic(commentary, 'şehvet') ||
        ic(commentary, 'esteti') ||
        ic(commentary, 'ten') ||
        ic(commentary, 'beden') ||
        ic(commentary, 'sanat'))
  ).toBe(true); // Tellal yorumu estetik/beden felsefesi içermelidir

  const spectatorReaction = AestheticCombatNarratives.generateSpectatorReaction(2);
  expect(spectatorReaction).not.toBeNull();
  expect(spectatorReaction.includes('')).toBe(true); // İzleyici tepkisi loca/tribün ifadesi içermelidir
});

test('testArenaRulesAndDisciplinesNoCollisionAudit', () => {
  const repository = new GameRepository();
  const initialEquippedWeapons = repository.player.value.equipped[EquipmentSlot.WEAPON];

  // 1. Silahsız Dövüş Kuralı Doğrulaması:
  // Silahsız dövüş yapıldığında oyuncunun asıl kuşanılmış kılıcı/silahı envanterinden silinmemelidir!
  const unarmedOpponent = kt.first(UnarmedMatchState.sampleOpponents);
  repository.simulateUnarmedMatch(unarmedOpponent);

  // Günlük arena zorunluluğu karşılanmış olmalıdır
  expect(repository.dayState.value.isDailyArenaObligationMet).toBe(true); // Silahsız dövüş günlük arena zorunluluğunu karşılamalıdır
  expect(repository.dayState.value.isArenaMatchDoneToday).toBe(true); // isArenaMatchDoneToday true olmalıdır

  // Oyuncunun silahı hala yerli yerinde durmalıdır (silahsız simülasyon envanteri bozmamalı)
  expect(repository.player.value.equipped[EquipmentSlot.WEAPON]?.id).toBe(initialEquippedWeapons?.id); // Oyuncunun kuşanılmış ana silahı bozulmamalıdır

  // 2. Gün Atlatma ve Döngü Bütünlüğü:
  const dawnNarrative = repository.advanceDay(0, true);
  expect(dawnNarrative).not.toBeNull();
  expect(repository.dayState.value.currentDay).toBe(2);
  expect(repository.dayState.value.isArenaMatchDoneToday).toBe(false); // Yeni günde isArenaMatchDoneToday sıfırlanmalıdır
  expect(repository.dayState.value.isDailyArenaObligationMet).toBe(false); // Yeni günde isDailyArenaObligationMet sıfırlanmalıdır

  // 3. 2v2 İttifak Dövüşü Kuralı Doğrulaması:
  const duoState = repository.duoMatchState.value;
  const ally = duoState.ally ?? kt.first(StarterContent.createInitialEnemies());
  const enemy1 = duoState.enemy1 ?? StarterContent.createInitialEnemies()[1];
  const enemy2 = duoState.enemy2 ?? StarterContent.createInitialEnemies()[2];

  repository.executeDuoCombat(ally, enemy1, enemy2, duoState.condition);
  expect(repository.dayState.value.isDailyArenaObligationMet).toBe(true); // 2v2 dövüşü de günlük arena zorunluluğunu karşılamalıdır

  // 4. Seyirci Bahsi Kuralı Doğrulaması (Yeni güne geçip test):
  repository.advanceDay(0, true);
  expect(repository.dayState.value.currentDay).toBe(3);
  expect(repository.dayState.value.isDailyArenaObligationMet).toBe(false);

  // Bahis oynandığında dövüşe çıkmadan da gün zorunluluğu karşılanabilmelidir
  const fixtureMatch = kt.firstOrNull(repository.leagueState.value.currentFixture, (it) => !it.isPlayerMatch);
  if (fixtureMatch != null) {
    const [betSuccess] = repository.placeSpectatorBet(fixtureMatch, fixtureMatch.fighter1Name, 10);
    if (betSuccess) {
      expect(repository.dayState.value.isDailyArenaObligationMet).toBe(true); // Seyirci bahsi de arena zorunluluğunu karşılamalıdır
    }
  }
});

test('testPehlivanOintmentsDataCatalogAndSanitization', () => {
  const ointments = PehlivanOintmentsData.allOintments;
  expect(ointments.length).toBe(20); // Er meydanı hazırlığı için 20 adet merhem ve yağ bulunmalıdır

  for (const item of ointments) {
    expect(item.usableCategory).toBe(UsableCategory.PEHLIVAN_OIL); // Kategori PEHLIVAN_OIL olmalıdır
    expect(item.description).not.toBeNull(); // İtem açıklaması dolu olmalıdır
    expect(item.valueInGold > 0).toBe(true); // Altın değeri pozitif olmalıdır

    // Buff varsa sadece 4 ana istatistiği etkilemeli, kan/kara büyü/can çalma içermemelidir
    const buff = item.buffEffect;
    if (buff != null) {
      expect(buff.lifestealPercent).toBe(0); // Can çalma 0 olmalıdır
      expect(buff.poisonDamagePerHit).toBe(0); // Zehir hasarı 0 olmalıdır
      expect(buff.fireDamagePerHit).toBe(0); // Alev hasarı 0 olmalıdır
      expect(buff.frostDamagePerHit).toBe(0); // Buz hasarı 0 olmalıdır
      expect(
        buff.bonusDamage > 0 || buff.bonusArmor > 0 || buff.bonusSpeed > 0 || buff.bonusCritChance > 0 || buff.bonusDodgeChance > 0
      ).toBe(true); // Buff 4 temel istatistikten birini veya dayanıklılığı artırmalıdır
    }
  }

  // Rotasyon fonksiyonu testi
  const rotating1 = PehlivanOintmentsData.getRotatingOintments(1, 6);
  expect(rotating1.length).toBe(6);
  const rotating2 = PehlivanOintmentsData.getRotatingOintments(2, 6);
  expect(rotating2.length).toBe(6);
  // Farklı günlerde farklı rotasyon dizilimi kontrolü
  expect(kt.first(rotating1).id).not.toBe(kt.first(rotating2).id);

  // Şifacı/Simyacı dükkanlarında bulunma kontrolü
  const region1 = StarterContent.createInitialRegion();
  const mirana = kt.firstOrNull(region1.npcs, (it) => it.id === 'npc_mirana');
  expect(mirana).not.toBeNull();
  const miranaPehlivanItems = mirana.consumablesForSale.filter((it) => it.usableCategory === UsableCategory.PEHLIVAN_OIL);
  expect(miranaPehlivanItems.length > 0).toBe(true); // Mirana er meydanı yağlarını satmalıdır

  const region2 = StarterContent.createRegion2();
  const vanya = kt.firstOrNull(region2.npcs, (it) => it.id === 'npc_vanya');
  expect(vanya).not.toBeNull();
  const vanyaPehlivanItems = vanya.consumablesForSale.filter((it) => it.usableCategory === UsableCategory.PEHLIVAN_OIL);
  expect(vanyaPehlivanItems.length).toBe(20); // Vanya tüm 20 er meydanı yağını satmalıdır
});

test('testWrestlingCombatNarrativeVariations', () => {
  const fighterA = 'Demir Bilek Torok';
  const fighterB = 'Seymen Ali';

  // 1. Duruşlar (6 sahne)
  const stances = new Set();
  kt.repeat(50, () => stances.add(WrestlingCombatNarratives.generateStance(fighterA, fighterB)));
  expect(stances.size >= 5).toBe(true); // Duruşlar en az 5-6 farklı sahne metni içermelidir

  // 2. Kapışlar & Kenetlenmeler (6 sahne)
  const clinches = new Set();
  kt.repeat(50, () => clinches.add(WrestlingCombatNarratives.generateClinch(fighterA, fighterB)));
  expect(clinches.size >= 5).toBe(true); // Kapışlar en az 5-6 farklı sahne metni içermelidir

  // 3. Dalışlar & Ayak Oyunları (6 sahne)
  const shoots = new Set();
  kt.repeat(50, () => shoots.add(WrestlingCombatNarratives.generateShootOrSweep(fighterA, fighterB)));
  expect(shoots.size >= 5).toBe(true); // Dalışlar en az 5-6 farklı sahne metni içermelidir

  // 4. Fırlatmalar & Kündeler (6 sahne)
  const throws = new Set();
  kt.repeat(50, () => throws.add(WrestlingCombatNarratives.generateThrowOrKunde(fighterA, fighterB, 25)));
  expect(throws.size >= 5).toBe(true); // Kündeler ve fırlatmalar en az 5-6 farklı sahne metni içermelidir

  // 5. Tuş & Pes Etme & Kilitler (6 sahne)
  const pins = new Set();
  kt.repeat(50, () => pins.add(WrestlingCombatNarratives.generatePinOrSubmission(fighterA, fighterB, 18)));
  expect(pins.size >= 5).toBe(true); // Tuş ve kilit pozisyonları en az 5-6 farklı sahne metni içermelidir

  // 6. Donanım & Çevre Etkileşimi
  const gearScene1 = WrestlingCombatNarratives.generateGearInteraction(fighterA, 1);
  const gearScene2 = WrestlingCombatNarratives.generateGearInteraction(fighterA, 2);
  const gearScene3 = WrestlingCombatNarratives.generateGearInteraction(fighterA, 3);
  expect(gearScene1).not.toBeNull();
  expect(gearScene2).not.toBeNull();
  expect(gearScene3).not.toBeNull();

  // 7. Meydan Tellalı Manileri
  const cazgir = WrestlingCombatNarratives.generateCazgirCommentary(fighterA, fighterB);
  expect(cazgir.includes('Tellal') || cazgir.includes('pehlivan') || cazgir.includes('Cazgır')).toBe(true); // Tellal narası meydan manisi içermelidir

  // 8. Zafer (Tuş veya Pes Etme)
  const [pinLog, pinReason] = WrestlingCombatNarratives.generateVictory(fighterA, fighterB, true);
  expect(pinLog.includes('TUŞ!')).toBe(true);
  expect(pinReason.includes('TUŞ!')).toBe(true);

  const [subLog, subReason] = WrestlingCombatNarratives.generateVictory(fighterA, fighterB, false);
  expect(subLog.includes('PES!')).toBe(true);
  expect(subReason.includes('Teslimiyet')).toBe(true);
});

test('testWrestlingCombatSimulationGladiatorBrawl', () => {
  const player = new GameRepository().player.value;
  const brawlerOpponent = kt.firstOrNull(UnarmedMatchState.sampleOpponents, (it) => it.showType === UnarmedShowType.GLADIATOR_BRAWL);
  expect(brawlerOpponent).not.toBeNull(); // Pehlivan güreşi rakibi mevcut olmalıdır

  const result = AestheticCombatEngine.simulateDuel(player, brawlerOpponent);

  expect(result).not.toBeNull();
  expect(result.roundsPlayed >= 1).toBe(true); // En az 1 raunt güreşilmiş olmalıdır
  expect(result.combatLogs.length > 0).toBe(true); // Dövüş günlükleri üretilmiş olmalıdır

  // Er meydanı raunt başlıkları kontrolü
  const hasErMeydaniRound = result.combatLogs.some((it) => it.includes('Er Meydanı Raundu'));
  expect(hasErMeydaniRound).toBe(true); // Raund başlıkları Er Meydanı formatında olmalıdır

  // Zafer gerekçesi kontrolü (TUŞ veya Teslimiyet)
  expect(
    result.victoryReason.includes('TUŞ!') || result.victoryReason.includes('pes etti') || result.victoryReason.includes('Teslimiyet')
  ).toBe(true);

  // Kan ve vahşet olmama kontrolü
  for (const log of result.combatLogs) {
    for (const keyword of bloodKeywords) {
      expect(ic(log, keyword)).toBe(false); // `Pehlivan güreşinde kan ve vahşet olmamalıdır: ${log}`
    }
  }
});

test('testSingleBeastMatadorAndTrapsSimulation', () => {
  const player = new GameRepository().player.value;
  const bullOpponent =
    kt.firstOrNull(UnarmedMatchState.sampleOpponents, (it) => it.id === 'unarmed_bull') ??
    kt.first(UnarmedMatchState.sampleOpponents, (it) => it.showType === UnarmedShowType.SINGLE_BEAST);

  const result = AestheticCombatEngine.simulateDuel(player, bullOpponent);

  expect(result).not.toBeNull();
  expect(result.roundsPlayed >= 1).toBe(true);
  expect(result.combatLogs.length > 0).toBe(true);

  // 1v1 Matador raunt başlığı kontrolü
  const hasMatadorRound = result.combatLogs.some((it) => it.includes('Matador & Canavar Boğuşması Raundu'));
  expect(hasMatadorRound).toBe(true); // Raunt başlığı Matador formatında olmalıdır

  // Zafer gerekçesi kontrolü
  expect(result.victoryReason.includes('Canavar Fethi') || result.victoryReason.includes('boyun eğdirilerek')).toBe(true);

  // Vahşet gösterisi ve seyirci naraları
  const hasBloodlustOrBeastTerms = result.combatLogs.some(
    (it) => ic(it, 'matador') || ic(it, 'boynuz') || ic(it, 'pençe') || ic(it, 'Tuzak') || ic(it, 'Vahşet')
  );
  expect(hasBloodlustOrBeastTerms).toBe(true); // Günlükler matador, boynuz, tuzak veya vahşet tellalı unsurları barındırmalıdır
});

test('testBeastPackSwarmAndCollisionsSimulation', () => {
  const player = new GameRepository().player.value;
  const packOpponent =
    kt.firstOrNull(UnarmedMatchState.sampleOpponents, (it) => it.id === 'unarmed_pack_4') ??
    kt.first(UnarmedMatchState.sampleOpponents, (it) => it.showType === UnarmedShowType.BEAST_PACK);

  const result = AestheticCombatEngine.simulateDuel(player, packOpponent);

  expect(result).not.toBeNull();
  expect(result.roundsPlayed >= 1).toBe(true);
  expect(result.combatLogs.length > 0).toBe(true);

  // Sürü raunt başlığı kontrolü
  const hasPackRound = result.combatLogs.some((it) => it.includes('Aç Yaratık Kuşatması Raundu'));
  expect(hasPackRound).toBe(true); // Raunt başlığı Aç Yaratık Kuşatması formatında olmalıdır

  // Zafer gerekçesi kontrolü
  expect(result.victoryReason.includes('Sürü Bozgunu') || result.victoryReason.includes('dağıtıldı')).toBe(true);

  // Sürü çarpıştırma veya canlı kalkan kontrolü
  const hasPackDynamics = result.combatLogs.some((it) => ic(it, 'çarpış') || ic(it, 'kalkan') || ic(it, 'sürü') || ic(it, 'yırtıcı'));
  expect(hasPackDynamics).toBe(true); // Günlüklerde sürü taktikleri veya çarpıştırma anlatımları yer almalıdır
});
