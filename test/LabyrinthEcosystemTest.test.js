// Kotlin kaynağı: test/LabyrinthEcosystemTest.kt
import { test, expect } from 'bun:test';
import { LabyrinthEcosystemLibrary } from '../src/data/LabyrinthEcosystemLibrary.js';
import { TashisarGladiatorsData } from '../src/data/TashisarGladiatorsData.js';
import { LabyrinthGenerator } from '../src/domain/engine/LabyrinthGenerator.js';
import { FighterPsychology, GladiatorEchoType, LabyrinthBiomeType, PersonalityArchetype } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

test('testHazardsLibraryIntegrity', () => {
  const hazards = LabyrinthEcosystemLibrary.getAllHazards();
  expect(hazards.length >= 10).toBe(true); // En az 10 farklı tehlike olmalı

  // Biyom dağılımı kontrolü
  const biomesWithHazards = kt.distinct(hazards.map((it) => it.primaryBiome));
  expect(biomesWithHazards.includes(LabyrinthBiomeType.KADIM_SARNIC)).toBe(true);
  expect(biomesWithHazards.includes(LabyrinthBiomeType.VOLKANIK_KORLUK)).toBe(true);
  expect(biomesWithHazards.includes(LabyrinthBiomeType.CURUK_SARMASIK)).toBe(true);
  expect(biomesWithHazards.includes(LabyrinthBiomeType.DIPSIZ_YARIK)).toBe(true);
  expect(biomesWithHazards.includes(LabyrinthBiomeType.CARKLI_MEKANIZMA)).toBe(true);
  expect(biomesWithHazards.includes(LabyrinthBiomeType.KUTSAL_KRIPTA)).toBe(true);

  hazards.forEach((hazard) => {
    expect(hazard.damageAmount >= 10 && hazard.damageAmount <= 40).toBe(true);
    expect(hazard.name.length > 0).toBe(true);
    expect(hazard.triggerNarrative.length > 0).toBe(true);
    expect(hazard.avoidNarrative.length > 0).toBe(true);
    expect(hazard.failureNarrative.length > 0).toBe(true);
  });
});

test('testPuzzlesLibraryIntegrity', () => {
  const puzzles = LabyrinthEcosystemLibrary.getAllPuzzles();
  expect(puzzles.length >= 5).toBe(true); // En az 5 farklı bulmaca olmalı

  puzzles.forEach((puzzle) => {
    expect(puzzle.title.length > 0).toBe(true);
    expect(puzzle.description.length > 0).toBe(true);
    expect(puzzle.clueText.length > 0).toBe(true);
    expect(puzzle.solvedNarrative.length > 0).toBe(true);
    expect(puzzle.failNarrative.length > 0).toBe(true);
    expect(puzzle.rewardGold > 0).toBe(true);
  });
});

test('testHabitatSynergies', () => {
  const synergies = LabyrinthEcosystemLibrary.getAllHabitatSynergies();
  expect(synergies.length > 0).toBe(true);

  const heavyArmorSynergy = kt.firstOrNull(synergies, (it) => it.requiredEquipmentTypeOrStat === 'heavy_armor' && it.isPositive);
  expect(heavyArmorSynergy).not.toBeNull();
  expect(heavyArmorSynergy?.targetBiome).toBe(LabyrinthBiomeType.CARKLI_MEKANIZMA);

  const lightClothSynergy = kt.firstOrNull(synergies, (it) => it.requiredEquipmentTypeOrStat === 'light_cloth' && it.isPositive);
  expect(lightClothSynergy).not.toBeNull();
  expect(lightClothSynergy?.targetBiome).toBe(LabyrinthBiomeType.DIPSIZ_YARIK);
});

test('testAtmosphericEvents', () => {
  LabyrinthBiomeType.values().forEach((biome) => {
    const events = LabyrinthEcosystemLibrary.getAtmosphericEvents(biome);
    expect(events.length >= 2).toBe(true); // Her biyomda en az 2 ortam olayı olmalı
    events.forEach((it) => {
      expect(it.soundText.length > 0).toBe(true);
      expect(it.sensoryDetail.length > 0).toBe(true);
    });
  });
});

test('testGladiatorEchoGenerationWithPsychology', () => {
  // Cunning gladiator (high treachery)
  const cunningPsych = FighterPsychology.fromArchetype(PersonalityArchetype.KURNAZ);
  const betrayalEcho = LabyrinthEcosystemLibrary.generateDistantEcho('Vaelen', 'Orn', cunningPsych, LabyrinthBiomeType.CARKLI_MEKANIZMA);
  expect(betrayalEcho.echoType).toBe(GladiatorEchoType.BETRAYAL);
  expect(betrayalEcho.narrative.includes('Vaelen')).toBe(true);
  expect(betrayalEcho.narrative.includes('Orn')).toBe(true);

  // Proud gladiator (high pride)
  const proudPsych = FighterPsychology.fromArchetype(PersonalityArchetype.GURURLU);
  const allianceEcho = LabyrinthEcosystemLibrary.generateDistantEcho('Morvath', 'Katerina', proudPsych, LabyrinthBiomeType.KUTSAL_KRIPTA);
  expect(allianceEcho.echoType).toBe(GladiatorEchoType.ALLIANCE);
  expect(allianceEcho.narrative.includes('Morvath')).toBe(true);
  expect(allianceEcho.narrative.includes('Katerina')).toBe(true);
});

test('testProceduralLabyrinthGeneration', () => {
  const enemies = kt.take(TashisarGladiatorsData.createTashisarEnemies(), 6);
  const run = LabyrinthGenerator.generateRun(LabyrinthBiomeType.VOLKANIK_KORLUK, 10, enemies, 6, 12345);

  expect(run.biome).toBe(LabyrinthBiomeType.VOLKANIK_KORLUK);
  expect(run.chambers.length).toBe(6);
  expect(run.activeHazards.length > 0).toBe(true);
  expect(run.activeHazards.length <= 3).toBe(true); // Sadece seçilen az sayıda tehlike aktif olmalı!
  expect(kt.last(run.chambers).isExitChamber).toBe(true);
  expect(run.recentDistantEchoes.length > 0).toBe(true);
});
