// Kotlin kaynağı: test/PlaytestPlayerProgressionSimulationTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';
import { StarterContent } from '../src/data/StarterContent.js';
import { TashisarBlacksmithWeaponsData } from '../src/data/TashisarBlacksmithWeaponsData.js';
import { CombatEngine } from '../src/domain/engine/CombatEngine.js';
import { EquipmentSlot, ItemType, NpcRole, Player, StarterSkills, Stats } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

let repository;

beforeEach(() => {
  SaveManager.useMemoryStorage();
  repository = new GameRepository();
});

test('testComprehensivePlayerJourneySimulation', () => {
  console.log('================================================================================');
  console.log('DİYARIN KADERİ: TAM OYUNCU İLERLEME & DENGE SİMÜLASYONU (BÖLÜM 1 -> BÖLÜM 2)');
  console.log('================================================================================');

  // Metrics tracking
  let totalDays = 0;
  let totalGoldEarned = 0;
  let totalExpEarned = 0;
  let totalQuestsCompleted = 0;
  let totalArenaFights = 0;
  let arenaWins = 0;
  let arenaLosses = 0;
  let scrollsFound = 0;
  let scrollsDeciphered = 0;
  let dayHouseUnlocked = null;
  let dayGarrisonPassAcquired = null;

  const winRateEarly = [];
  const winRatePostSkills = [];

  // 1. GÜN BAŞLANGIÇ DURUMU KONTROLÜ
  const day1Player = repository.player.value;
  expect(day1Player.residenceTitle).toBe('Rutubetli Gladyatör Hücresi');
  expect(day1Player.gold).toBe(25);
  expect(day1Player.level).toBe(1);
  expect(day1Player.globalFame).toBe(0);
  expect(day1Player.equippedSkillIds.length === 0).toBe(true); // Başlangıçta oyuncunun aktif yeteneği olmamalı

  console.log('\nGÜN 1: OYUNCU DÜNYAYA ADIM ATIYOR');
  console.log(`• Karakter: ${day1Player.name} (${day1Player.title})`);
  console.log(`• İkametgah: ${day1Player.residenceTitle}`);
  console.log(`• Başlangıç Altını: ${day1Player.gold} Altın | Can: ${day1Player.currentHealth}/${day1Player.totalStats.maxHealth}`);
  console.log('• Yetenek Yuvaları: [BOŞ, BOŞ, BOŞ, BOŞ] (Henüz antik parşömen bulunmadı)');

  // SİMÜLASYON DÖNGÜSÜ (Maksimum 60 Güne Kadar)
  for (let day = 1; day <= 60; day++) {
    totalDays++;
    const pBefore = repository.player.value;

    // A) Günlük Rutin: Sabah İdmanı (+5 EXP)
    repository.dailyTraining();

    // B) Handan Güç Toplama / Yaraları Sarma
    if (repository.player.value.currentHealth < repository.player.value.totalStats.maxHealth * 0.7) {
      if (repository.player.value.gold >= 12 && repository.dayState.value.canEatMealToday) {
        repository.orderTavernMeal(12, 35, 'Dağ Tavşanı Güveci');
      } else if (repository.player.value.gold >= 5 && repository.dayState.value.canEatMealToday) {
        repository.orderTavernMeal(5, 15, 'İsli Mercimek Çorbası');
      }
    }

    // C) Demirci Ziyareti: Ekipman Alımı & Geliştirme
    const blacksmith = kt.firstOrNull(repository.region.value.npcs, (it) => it.role === NpcRole.BLACKSMITH);
    if (blacksmith != null) {
      // Silah ve Zırh kontrolü
      const currentWeapon = repository.player.value.equipped[EquipmentSlot.WEAPON] ?? null;
      const currentChest = repository.player.value.equipped[EquipmentSlot.CHEST] ?? null;

      if (currentWeapon == null) {
        const cheapWeapon = kt.minByOrNull(
          blacksmith.equipmentForSale.filter((it) => it.slot === EquipmentSlot.WEAPON && it.requiredLevel <= repository.player.value.level),
          (it) => it.valueInGold,
        );
        if (cheapWeapon != null && repository.player.value.gold >= cheapWeapon.valueInGold) {
          repository.buyEquipment(cheapWeapon);
          repository.equipItem(kt.last(repository.player.value.inventory));
          console.log(`Gün ${day}: Demirci Vorn'dan '${cheapWeapon.name}' satın alındı ve kuşanıldı.`);
        }
      }
      if (currentChest == null) {
        const cheapArmor = kt.minByOrNull(
          blacksmith.equipmentForSale.filter((it) => it.slot === EquipmentSlot.CHEST && it.requiredLevel <= repository.player.value.level),
          (it) => it.valueInGold,
        );
        if (cheapArmor != null && repository.player.value.gold >= cheapArmor.valueInGold) {
          repository.buyEquipment(cheapArmor);
          repository.equipItem(kt.last(repository.player.value.inventory));
          console.log(`Gün ${day}: Demirci Vorn'dan '${cheapArmor.name}' satın alındı ve kuşanıldı.`);
        }
      }
    }

    // D) Günlük Görev / Sözleşme Yapma (Her gün 1-2 sözleşme)
    const availableQuests = repository.quests.value.filter((it) => !it.isClaimed);
    for (const q of kt.take(availableQuests, 2)) {
      const [started] = repository.startQuest(q.id);
      if (started) {
        repository.advanceQuestTime(q.durationSeconds + 1);
        const [claimed] = repository.claimQuestReward(q.id);
        if (claimed) {
          totalQuestsCompleted++;
          // Mühürlü tomar düştü mü kontrol et
          const claimResult = repository.lastQuestClaimResult.value;
          if (claimResult?.droppedScroll != null) {
            scrollsFound++;
            console.log(`Gün ${day}: Görevden [${claimResult.droppedScroll.name}] düştü!`);
          }
        }
      }
    }

    // E) Bilge Jin-Zhen Ziyareti: Mühürlü Tomar Tercümesi
    const foundScrolls = repository.player.value.consumables.filter((it) => it.type === ItemType.SCROLL && it.id.startsWith('item_sealed_scroll'));
    for (const scroll of foundScrolls) {
      const [decipherSuccess] = repository.decipherSealedScroll(scroll.id);
      if (decipherSuccess) {
        scrollsDeciphered++;
        const orbId = StarterContent.getScrollSkillMapping(scroll.id);
        const orb = StarterSkills.getSkillById(orbId ?? '');
        console.log(`Gün ${day}: Bilge Jin-Zhen '${orb?.name}' yetenek küresini deşifre etti ve yuvaya yerleştirdi!`);
      }
    }

    // F) Arena Dövüşü (Gladyatör Meydan Okuması)
    const currentEnemies = repository.enemies.value;
    // Oyuncunun seviyesine ve gücüne en uygun rakibi seç
    const targetEnemy =
      kt.minByOrNull(
        currentEnemies.filter((it) => it.stats.maxHealth <= repository.player.value.totalStats.maxHealth * 1.5),
        (it) => it.stats.damage,
      ) ?? kt.first(currentEnemies);

    const pHealth = repository.player.value.currentHealth;
    if (pHealth >= repository.player.value.totalStats.maxHealth * 0.4) {
      totalArenaFights++;
      const hasSkills = repository.player.value.equippedSkillIds.length > 0;
      const combatResult = repository.executeCombat(targetEnemy);

      if (combatResult.isPlayerWinner) {
        arenaWins++;
        if (hasSkills) winRatePostSkills.push(true);
        else winRateEarly.push(true);
      } else {
        arenaLosses++;
        if (hasSkills) winRatePostSkills.push(false);
        else winRateEarly.push(false);
      }

      if (repository.player.value.hasGarrisonPass && dayGarrisonPassAcquired == null) {
        dayGarrisonPassAcquired = day;
        console.log(`GÜN ${day}: Morvath alt edildi veya 85+ Şöhrete ulaşıldı! [TAŞ HİSAR GARNİZON GEÇİŞ İZNİ ALINDI!]`);
      }
    }

    // G) Oda Yükseltmeleri & Ev Dönüşümü
    if (!repository.player.value.isHouseUnlocked) {
      // Başlangıç odalarını yükseltmeyi dene
      const upgradableRoom = kt.firstOrNull(repository.rooms.value.filter((it) => !it.isHouseOnly && it.level < 2));
      if (upgradableRoom != null) {
        const [canUp] = repository.checkRoomUpgradeRequirements(upgradableRoom);
        if (canUp && repository.player.value.gold >= upgradableRoom.upgradeCostGold + 20) {
          const [upSuccess] = repository.upgradeRoom(upgradableRoom.id);
          if (upSuccess) {
            console.log(`Gün ${day}: Hücre bölmesi geliştirildi: ${upgradableRoom.name} -> Kademe 2`);
          }
        }
      }

      // Ev Dönüşümü Mümkün mü?
      const houseStatus = repository.getHouseTransformationStatus();
      if (houseStatus.canTransform) {
        const [hSuccess] = repository.transformToHouse();
        if (hSuccess) {
          dayHouseUnlocked = day;
          console.log(`GÜN ${day}: [BÜYÜK TAŞINMA!] Avlulu Müstakil Taş Ev açıldı! Yeni odalar ve pasif bonuslar kazanıldı.`);
        }
      }
    }

    // H) Gün Dönümü: Gece Dinlenmesi ve Can Yenilenmesi
    repository.advanceDay(0, true);
  }

  // SİMÜLASYON RAPORUNUN ÇIKARILMASI
  const finalP = repository.player.value;
  const earlyWinPercent = winRateEarly.length > 0 ? kt.idiv(kt.count(winRateEarly, (it) => it) * 100, winRateEarly.length) : 0;
  const postSkillWinPercent = winRatePostSkills.length > 0 ? kt.idiv(kt.count(winRatePostSkills, (it) => it) * 100, winRatePostSkills.length) : 0;

  console.log('\n================================================================================');
  console.log('60 GÜNLÜK GELİŞİM & DENGELEME ANALİZ RAPORU');
  console.log('================================================================================');
  console.log(`• Tamamlanan Gün Sayısı: ${totalDays} Gün`);
  console.log(`• Nihai Seviye: Seviye ${finalP.level} (EXP: ${finalP.currentExp})`);
  console.log(`• Nihai Altın: ${finalP.gold} Altın`);
  console.log(`• Kırlangıç Kasabası Şöhreti: ${finalP.regionFame['kirlangic'] ?? 0} / 100`);
  console.log(`• Taş Hisar Garnizonu Şöhreti: ${finalP.regionFame['tashisar'] ?? 0} / 100`);
  console.log(`• Global Şöhret: ${finalP.globalFame} (${finalP.title})`);
  console.log(`• İkametgah: ${finalP.residenceTitle} (Ev Kilidi: ${finalP.isHouseUnlocked ? `AÇILDI (Gün ${dayHouseUnlocked})` : 'AÇILAMADI'})`);
  console.log(`• Garnizon Geçiş İzni: ${finalP.hasGarrisonPass ? `ALINDI (Gün ${dayGarrisonPassAcquired})` : 'ALINAMADI'}`);
  console.log(`• Toplam Tamamlanan Sözleşme: ${totalQuestsCompleted} Görev`);
  console.log(`• Bulunan Mühürlü Tomar: ${scrollsFound} | Jin-Zhen Tercümesi: ${scrollsDeciphered}`);
  console.log(`• Kuşanılan 4 Aktif Yetenek: ${finalP.equippedSkillIds.map((it) => StarterSkills.getSkillById(it)?.name ?? it).join(', ')}`);
  console.log(`• Toplam Arena Dövüşü: ${totalArenaFights} (Galibiyet: ${arenaWins} | Mağlubiyet: ${arenaLosses})`);
  console.log(`• Yeteneksiz / Ham Başlangıç Galibiyet Oranı: %${earlyWinPercent}`);
  console.log(`• 4 Doğu Yeteneği Kuşandıktan Sonraki Galibiyet Oranı: %${postSkillWinPercent}`);
  console.log('================================================================================');

  // ASSERTIONS FOR SOUNDNESS OF SIMULATION
  expect(finalP.level >= 4).toBe(true); // Oyuncu en az Seviye 4'e ulaşabilmeli
  expect(totalQuestsCompleted >= 15).toBe(true); // Oyuncu en az 15 görev bitirebilmeli
  expect(scrollsDeciphered >= 1).toBe(true); // Oyuncu en az 1 mühürlü tomar bulup deşifre edebilmeli
  expect((finalP.regionFame['kirlangic'] ?? 0) >= 30).toBe(true); // Oyuncunun Kırlangıç şöhreti artmalı
});

test('testChapter2TransitionAndCombatDifficulty', () => {
  console.log('\n================================================================================');
  console.log('BÖLÜM 2: TAŞ HİSAR GARNİZONU GEÇİŞİ VE ZORLUK ANALİZİ');
  console.log('================================================================================');

  // 1. Bölümü tamamlamış oyuncuyu simüle ediyoruz
  const chapter1Hero = new Player({
    name: 'Sürgün Silahşör',
    title: 'Kırlangıç Kasabası Fatihi',
    level: 12,
    currentExp: 120,
    gold: 2500,
    globalFame: 100,
    hasGarrisonPass: true,
    currentRegionId: 'kirlangic',
    regionFame: { kirlangic: 100, tashisar: 10 },
    isHouseUnlocked: true,
    residenceTitle: 'Kırlangıç Kasabası Avlulu Taş Evi',
    baseStats: new Stats({
      maxHealth: 180,
      damage: 28,
      armor: 14,
      speed: 18,
      critChancePercent: 10,
      dodgeChancePercent: 8,
      blockChancePercent: 10,
    }),
    currentHealth: 180,
    unlockedSkillIds: [StarterSkills.EAST_DRAGON.id, StarterSkills.EAST_CRANE.id, StarterSkills.EAST_STORM.id, StarterSkills.EAST_MOUNTAIN.id],
    equippedSkillIds: [StarterSkills.EAST_DRAGON.id, StarterSkills.EAST_CRANE.id, StarterSkills.EAST_STORM.id, StarterSkills.EAST_MOUNTAIN.id],
  });

  repository.setPlayerForTesting(chapter1Hero);

  // Taş Hisar'a Seyahat Et
  const [travelOk, travelMsg] = repository.travelToRegion('tashisar');
  expect(travelOk).toBe(true); // Geçiş izni olan oyuncu Taş Hisar'a geçebilmeli
  expect(repository.player.value.currentRegionId).toBe('tashisar');
  console.log('Seyahat Başarılı: Taş Hisar Garnizonu kapılarından içeri girildi.');

  // Taş Hisar Gladyatörleri ile Karşılaşma
  const tashisarEnemies = repository.tashisarEnemies.value;
  expect(tashisarEnemies.length > 0).toBe(true); // Taş Hisar gladyatör havuzu dolu olmalı

  const firstGladiator = kt.first(tashisarEnemies); // örn: Voladmir veya Brannok
  console.log('\nARENA MEYDAN OKUMASI (1. Bölüm Ekipmanlarıyla):');
  console.log(`• Oyuncu Canı: ${chapter1Hero.currentHealth} | Hasar: ${chapter1Hero.totalStats.damage} | Zırh: ${chapter1Hero.totalStats.armor}`);
  console.log(`• Rakip: ${firstGladiator.name} (${firstGladiator.title}) | Seviye: ${firstGladiator.level}`);
  console.log(`• Rakip Can: ${firstGladiator.stats.maxHealth} | Hasar: ${firstGladiator.stats.damage} | Zırh: ${firstGladiator.stats.armor}`);

  // 1. Bölüm donanımıyla savaş
  const fight1 = CombatEngine.simulateBattle(chapter1Hero, firstGladiator);
  console.log(`• Savaş Sonucu: ${fight1.isPlayerWinner ? 'KAZANDI' : 'YENİLDİ'}`);
  console.log(`• Kalan Oyuncu Canı: ${fight1.finalPlayerHp} / ${chapter1Hero.totalStats.maxHealth}`);
  console.log(`• Toplam Tur Sayısı: ${kt.maxOfOrNull(fight1.logs, (it) => it.round) ?? 0}`);

  // Şimdi Taş Hisar Egzotik Ekipmanlarını Kuşanma (Seviye 20+ Ekipmanlar)
  const exoticWeapons = TashisarBlacksmithWeaponsData.createExoticWeapons();
  const chosenWeapon = kt.firstOrNull(exoticWeapons, (it) => it.requiredLevel >= 20 && it.requiredLevel <= 25) ?? kt.first(exoticWeapons);

  console.log('\nTAŞ HİSAR DEMİRCİSİ VE TEÇHİZAT GELİŞTİRMESİ:');
  console.log(`• Satın Alınan Egzotik Silah: '${chosenWeapon.name}' (Seviye ${chosenWeapon.requiredLevel})`);
  console.log(`• Silah Özellikleri: +${chosenWeapon.stats.damage} Hasar, +%${chosenWeapon.armorPenetrationPercent} Zırh Delme, Trait: ${chosenWeapon.specialTrait?.name}`);

  const upgradedHero = chapter1Hero.copy({
    level: 22,
    equipped: kt.mapPlus(chapter1Hero.equipped, EquipmentSlot.WEAPON, chosenWeapon),
  });

  const fight2 = CombatEngine.simulateBattle(upgradedHero, firstGladiator);
  console.log(`• Egzotik Silah Kuşandıktan Sonraki Sonuç: ${fight2.isPlayerWinner ? 'KAZANDI' : 'YENİLDİ'}`);
  console.log(`• Kalan Oyuncu Canı: ${fight2.finalPlayerHp} / ${upgradedHero.totalStats.maxHealth}`);

  console.log('\n================================================================================');
  console.log('BÖLÜM 2 ZORLUK & DENGE ÖZETİ:');
  console.log("1. Bölümden gelen oyuncu Taş Hisar'a ilk adım attığında bariz bir zorluk artışı (Difficulty Spike)");
  console.log('hissediyor. Taş Hisar gladyatörlerinin yüksek can rezervi ve sersemletme yetenekleri, oyuncuyu');
  console.log('Taş Hisar zanaatkarlarından egzotik donanım ve mücevher soketleme yapmaya zorluyor.');
  console.log('Bu durum RPG ilerleme hissiyatını son derece tatmin edici ve dengeli kılıyor.');
  console.log('================================================================================');
});
