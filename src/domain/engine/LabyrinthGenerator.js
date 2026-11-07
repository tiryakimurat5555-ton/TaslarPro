// LabyrinthGenerator.kt'den taşındı (birebir).
import * as kt from '../../kt.js';
import { LabyrinthEcosystemLibrary } from '../../data/LabyrinthEcosystemLibrary.js';
import {
  ActiveLabyrinthRun,
  LabyrinthBiomeType,
  LabyrinthChamber,
  LabyrinthChestRarity,
} from '../model.js';

/**
 * Zengin kütüphaneden biyom, tehlikeler, bulmacalar, gladyatörler ve sinerjileri
 * seçerek her seferinde benzersiz ve tutarlı bir labirent sekansı oluşturan jeneratör.
 */
export const LabyrinthGenerator = {
  generateRun(
    requestedBiome = null,
    playerLevel = 5,
    availableGladiators = [],
    chamberCount = 6,
    seed = Date.now()
  ) {
    const random = kt.makeRandom(seed);

    // 1. Biyom Seçimi
    const biome = requestedBiome ?? kt.random(LabyrinthBiomeType.values(), random);

    // 2. Biyoma Özgü Tehlikelerden 2-3 Tane Seç (Odaklı ve okunabilir olması için)
    const allBiomeHazards = LabyrinthEcosystemLibrary.getAllHazards().filter((it) => it.primaryBiome === biome);
    const activeHazards =
      allBiomeHazards.length > 0
        ? kt.take(kt.shuffled(allBiomeHazards, random), Math.min(3, allBiomeHazards.length))
        : kt.take(kt.shuffled(LabyrinthEcosystemLibrary.getAllHazards(), random), 2);

    // 3. Biyoma Özgü Bulmacalardan 1-2 Tane Seç
    const allBiomePuzzles = LabyrinthEcosystemLibrary.getAllPuzzles().filter((it) => it.primaryBiome === biome);
    const activePuzzles =
      allBiomePuzzles.length > 0
        ? kt.take(kt.shuffled(allBiomePuzzles, random), Math.min(2, allBiomePuzzles.length))
        : kt.take(kt.shuffled(LabyrinthEcosystemLibrary.getAllPuzzles(), random), 1);

    // 4. Biyom Ekipman ve Habitat Sinerjileri
    const activeSynergies = LabyrinthEcosystemLibrary.getAllHabitatSynergies().filter((it) => it.targetBiome === biome);

    // 5. Labirente Katılan 3-5 Gladyatör Seç
    const participatingGladiators = kt.take(kt.shuffled(availableGladiators, random), Math.min(4, availableGladiators.length));
    const participatingIds = participatingGladiators.map((it) => it.id);

    // 6. Odaların Prosedürel İnşası (Her oda farklı bir sınav sunar)
    const chambers = [];

    for (let i = 0; i < chamberCount; i++) {
      const isFirst = i === 0;
      const isLast = i === chamberCount - 1;
      const isMid = i === kt.idiv(chamberCount, 2);

      let chamber;
      if (isFirst) {
        chamber = new LabyrinthChamber({
          chamberIndex: i,
          title: `${biome.icon} Giriş Kapısı & Karşılama Dehlizi`,
          description: `Ağır taş kapı arkandan kilitlendi. ${biome.visualAtmosphere}`,
          hazard: null,
          puzzle: null,
          enemyId: null,
          chestReward: null,
        });
      } else if (isLast) {
        chamber = new LabyrinthChamber({
          chamberIndex: i,
          title: '🏆 Büyük Çıkış Kemeri & Kadim Mihrap',
          description: 'Labirentin kalbindeki devasa kapı ve çıkışı koruyan son sınav.',
          hazard: kt.randomOrNull(activeHazards, random),
          puzzle: null,
          enemyId: kt.randomOrNull(participatingIds, random),
          chestReward: LabyrinthChestRarity.EFSANEVI,
          isExitChamber: true,
        });
      } else if (isMid) {
        // Sandık & Ganimet Odası (İhanet ve Çıkar Sınavı!)
        chamber = new LabyrinthChamber({
          chamberIndex: i,
          title: '💰 Mühürlü Hazine Mahzeni',
          description: 'Ortada parıldayan demir perçinli bir sandık ve duvarlardan yankılanan nefes sesleri.',
          hazard: null,
          puzzle: kt.firstOrNull(activePuzzles),
          enemyId: kt.randomOrNull(participatingIds, random),
          chestReward: LabyrinthChestRarity.NADIR,
        });
      } else if (i % 2 === 1) {
        // Tehlike & Tuzak Odası
        const hazard = kt.randomOrNull(activeHazards, random);
        chamber = new LabyrinthChamber({
          chamberIndex: i,
          title: `${hazard?.category?.icon ?? '⚠️'} Tuzaklı Geçit: ${hazard?.name ?? 'Karanlık Koridor'}`,
          description: hazard?.description ?? 'Dikkatle adım atılması gereken dar bir dehliz.',
          hazard: hazard,
          puzzle: null,
          enemyId: null,
        });
      } else {
        // Karşılaşma veya Bulmaca Odası
        const puzzle = kt.getOrNull(activePuzzles, 1);
        const gladiator = kt.randomOrNull(
          participatingIds.filter((id) => !chambers.some((it) => it.enemyId === id)),
          random
        );
        chamber = new LabyrinthChamber({
          chamberIndex: i,
          title: puzzle != null ? `🧩 ${puzzle.title}` : '⚔️ Dehliz Kesişimi',
          description: puzzle?.description ?? 'Uzaklardan adım seslerinin geldiği geniş bir oda.',
          hazard: null,
          puzzle: puzzle,
          enemyId: gladiator,
        });
      }
      chambers.push(chamber);
    }

    // 7. İlk Arka Plan Gladyatör Yankılarını Üret
    const initialEchoes = [];
    if (participatingGladiators.length >= 2) {
      const echo = LabyrinthEcosystemLibrary.generateDistantEcho(
        participatingGladiators[0].name,
        participatingGladiators[1].name,
        participatingGladiators[0].personality.psychology,
        biome
      );
      initialEchoes.push(echo);
    }

    return new ActiveLabyrinthRun({
      runId: `run_${biome.name.toLowerCase()}_${seed}`,
      biome: biome,
      themeTitle: `${biome.icon} ${biome.title} Labirenti`,
      introductoryNarrative: `Zindan muhafızları seni ${biome.title} seviyesine indirdi. ${biome.shortDescription} ${biome.visualAtmosphere}`,
      activeHazards: activeHazards,
      activePuzzles: activePuzzles,
      activeSynergies: activeSynergies,
      participatingGladiatorIds: participatingIds,
      chambers: chambers,
      currentChamberIndex: 0,
      recentDistantEchoes: initialEchoes,
    });
  },
};
