// Kotlin kaynağı: test/GladiatorGrandTournamentSimulationTest.kt
import { test, expect } from 'bun:test';
import { TashisarGladiatorsData } from '../src/data/TashisarGladiatorsData.js';
import { CombatEngine } from '../src/domain/engine/CombatEngine.js';
import { CombatStance, DamageSeverity, TextTemplateEngine } from '../src/domain/engine/TextTemplateEngine.js';
import { CombatEvent, TargetBodyPart } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

test('testAllGladiatorsGrandTournamentSimulation', () => {
  const allGladiators = TashisarGladiatorsData.createTashisarEnemies();

  // 1. Doğrulama: 40 Gladyatör (15 kadın, 25 erkek)
  expect(allGladiators.length).toBe(40); // Toplam 40 gladyatör bulunmalıdır

  // Her bir gladyatörün en az 4 yeteneği ve özel silahı olmalı
  for (const g of allGladiators) {
    expect(g.skills.length).toBe(4); // `${g.name} 4 yeteneğe sahip olmalı`
    expect(kt.isNotBlank(g.weaponName)).toBe(true); // `${g.name} silah adına sahip olmalı`
  }

  // 2. Her gladyatörün EN AZ 6 kez 1v1 dövüşeceği eşleşme havuzu oluşturma
  const matchParticipationCount = {};
  allGladiators.forEach((it) => {
    matchParticipationCount[it.id] = 0;
  });

  const matches = [];
  const targetMatchesPerFighter = 6;

  // 6 tur boyunca her gladyatör için döngüsel eşleşme
  for (let roundIndex = 1; roundIndex <= targetMatchesPerFighter; roundIndex++) {
    const shuffled = kt.shuffled(allGladiators);
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      const f1 = shuffled[i];
      const f2 = shuffled[i + 1];
      matches.push([f1, f2]);
      matchParticipationCount[f1.id] = (matchParticipationCount[f1.id] ?? 0) + 1;
      matchParticipationCount[f2.id] = (matchParticipationCount[f2.id] ?? 0) + 1;
    }
    // Tek kalan gladyatör için rastgele başka bir rakiple eşleştirme
    if (shuffled.length % 2 !== 0) {
      const last = kt.last(shuffled);
      const partner = kt.random(kt.minus(allGladiators, last));
      matches.push([last, partner]);
      matchParticipationCount[last.id] = (matchParticipationCount[last.id] ?? 0) + 1;
      matchParticipationCount[partner.id] = (matchParticipationCount[partner.id] ?? 0) + 1;
    }
  }

  // Her gladyatörün en az 6 maça çıktığını doğrula
  for (const [fighterId, count] of Object.entries(matchParticipationCount)) {
    expect(count >= targetMatchesPerFighter).toBe(true); // `Gladyatör ${fighterId} en az ... maça çıkmalı`
  }

  console.log('=================================================================');
  console.log('🏟️ BÜYÜK TAŞ HİSAR GLADYATÖR TURNUVASI BAŞLIYOR!');
  console.log(`Toplam Gladyatör Sayısı : ${allGladiators.length}`);
  console.log(`Planlanan Toplam 1v1 Maç : ${matches.length}`);
  console.log(`Her Dövüşçü İçin En Az Maç: ${targetMatchesPerFighter}`);
  console.log('=================================================================');

  const allNarratives = [];
  const skillTriggerCount = {};
  let totalRounds = 0;
  let totalHits = 0;
  let totalCrits = 0;
  let totalDodges = 0;
  let totalBlocks = 0;
  let totalDraws = 0;

  const winLeaderboard = {};
  allGladiators.forEach((it) => {
    winLeaderboard[it.name] = 0;
  });

  const sampleInterestingLogs = [];

  matches.forEach((match, index) => {
    const [f1, f2] = match;
    const result = CombatEngine.simulateDetailedNpcBattle(f1, f2, f1.name, 0);

    totalRounds += kt.lastOrNull(result.logs)?.round ?? 0;
    if (result.isDraw) {
      totalDraws++;
    } else if (result.winnerName != null) {
      winLeaderboard[result.winnerName] = (winLeaderboard[result.winnerName] ?? 0) + 1;
    }

    for (const log of result.logs) {
      const text = log.narrativeText;
      allNarratives.push(text);

      switch (log.event) {
        case CombatEvent.HIT: totalHits++; break;
        case CombatEvent.CRITICAL: totalCrits++; break;
        case CombatEvent.DODGED: totalDodges++; break;
        case CombatEvent.BLOCKED: totalBlocks++; break;
        default: break;
      }

      // Yetenek kullanımı tespit etme (İsabet, Blok, Sıyrılma ve Nihai Vuruşlar)
      const matchingSkill = kt.firstOrNull([...f1.skills, ...f2.skills], (skill) =>
        text.toLowerCase().includes(skill.name.toLowerCase())
      );
      if (matchingSkill != null) {
        skillTriggerCount[matchingSkill.name] = (skillTriggerCount[matchingSkill.name] ?? 0) + 1;

        if (sampleInterestingLogs.length < 12) {
          sampleInterestingLogs.push(`[Maç #${index + 1} - ${f1.name} vs ${f2.name} | R${log.round}]\n${text}`);
        }
      }
    }
  });

  // 3. Metin Tekrarsızlık Analizi (Entropy & Uniqueness Check)
  const uniqueNarratives = new Set(allNarratives);
  const uniquenessRate = (uniqueNarratives.size / allNarratives.length) * 100.0;
  const skillSum = kt.sum(Object.values(skillTriggerCount));

  console.log('\n--- SİMÜLASYON İSTATİSTİKLERİ ---');
  console.log(`Tamamlanan 1v1 Maç Sayısı       : ${matches.length}`);
  console.log(`Oynanan Toplam Raunt             : ${totalRounds}`);
  console.log(`Üretilen Toplam Anlatı Satırı    : ${allNarratives.length}`);
  console.log(`Benzersiz Anlatı Satırı Sayısı   : ${uniqueNarratives.size}`);
  console.log(kt.format('Metin Tekrarsızlık Oranı         : %%%.2f', uniquenessRate));
  console.log(`Toplam İsabet                    : ${totalHits}`);
  console.log(`Toplam Kritik Vuruş              : ${totalCrits}`);
  console.log(`Toplam Sıyrılma (Dodge)          : ${totalDodges}`);
  console.log(`Toplam Bloklama (Block)          : ${totalBlocks}`);
  console.log(`Berabere Biten Maçlar            : ${totalDraws}`);
  console.log(`Tetiklenen Gladyatör Yeteneği   : ${skillSum} kez`);

  console.log('\n--- ÖRNEK ROMAN TADINDA DÖVÜŞ LOGLARI ---');
  kt.take(sampleInterestingLogs, 6).forEach((sample, idx) => {
    console.log(`\n[Örnek ${idx + 1}]:\n${sample}`);
  });

  console.log('\n--- EN ÇOK KAZANAN İLK 5 GLADYATÖR ---');
  kt.take(kt.sortedByDescending(Object.entries(winLeaderboard), (it) => it[1]), 5).forEach((entry, rank) => {
    console.log(`${rank + 1}. ${entry[0]}: ${entry[1]} Galibiyet`);
  });

  // Doğrulamalar:
  expect(matches.length >= 110).toBe(true); // En az 110 maç yapılmış olmalı
  expect(Object.keys(skillTriggerCount).length > 0).toBe(true); // Yetenekler dövüşlerde aktif olarak tetiklenmeli
  expect(skillSum > 100).toBe(true); // Toplam tetiklenen yetenek sayısı 100'ün üzerinde olmalı
  expect(uniquenessRate >= 95.0).toBe(true); // Metin tekrarsızlık oranı en az %95 olmalıdır
});

test('testDamageSeverityNarrativeScaling', () => {
  // 1. Düşük hasar (1-3 HP) - Glancing (Sıyrık) seviyesi doğrulaması
  const lowSeverity = TextTemplateEngine.calculateSeverity(2, false, 100);
  expect(lowSeverity).toBe(DamageSeverity.GLANCING);

  // 2. Yüksek hasar (40+ HP) - Devastating (Yıkıcı) seviyesi doğrulaması
  const highSeverity = TextTemplateEngine.calculateSeverity(45, true, 100);
  expect(highSeverity).toBe(DamageSeverity.DEVASTATING);

  // 3. 1 Hasarlık vuruş logu üretimi ve metin kontrolü (kemik kırma gibi ağır abartılı metinler içermemeli)
  const lowDmgLog = TextTemplateEngine.generateDetailedLog('Alperen', 'Baelor', 'Gezgin Kılıcı', CombatEvent.HIT, TargetBodyPart.HEAD, 1, 100, CombatStance.BALANCED);
  expect(lowDmgLog.includes('kemik parçalayan')).toBe(false); // 1 hasarlık vuruş kemik kırma veya parçalama içermemeli
  expect(lowDmgLog.includes('kemikleri inletti')).toBe(false); // 1 hasarlık vuruş kemik kırma içermemeli
  expect(lowDmgLog.includes('(-1 Can)')).toBe(true); // Log hasar miktarını içermeli (-1 Can)

  // 4. Baelor ("Demir Maskeli Cellat") mevcudiyeti ve özellikleri
  const allGladiators = TashisarGladiatorsData.createTashisarEnemies();
  const baelor = kt.firstOrNull(allGladiators, (it) => it.id === 'fighter_baelor');
  expect(baelor).not.toBeNull(); // Baelor gladyatör havuzunda bulunmalıdır
  expect(baelor?.name).toBe('Baelor');
  expect(baelor?.title).toBe('Demir Maskeli Cellat');
  expect(baelor?.weaponName).toBe('Zincirli Çift Ağır Orak');
  expect(baelor?.skills?.length).toBe(4);
});
