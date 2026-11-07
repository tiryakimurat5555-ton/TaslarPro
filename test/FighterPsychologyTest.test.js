// Kotlin kaynağı: test/FighterPsychologyTest.kt
import { test, expect } from 'bun:test';
import { CharacterRegistryData } from '../src/data/CharacterRegistryData.js';
import { StarterContent } from '../src/data/StarterContent.js';
import { TashisarGladiatorsData } from '../src/data/TashisarGladiatorsData.js';
import { AllianceDecision, CrisisAction, FighterPsychology, LootAction, PersonalityArchetype } from '../src/domain/model.js';

const in0to100 = (v) => v >= 0 && v <= 100;

test('testArchetypePsychologyGeneration', () => {
  const proud = FighterPsychology.fromArchetype(PersonalityArchetype.GURURLU);
  expect(proud.pride).toBe(95);
  expect(proud.loyalty).toBe(85);
  expect(proud.treachery <= 15).toBe(true);
  expect(proud.behavioralBadge).toBe('👑 Onurlu Savaşçı');

  const cunning = FighterPsychology.fromArchetype(PersonalityArchetype.KURNAZ);
  expect(cunning.treachery >= 75).toBe(true);
  expect(cunning.pragmatism >= 85).toBe(true);
  expect(cunning.loyalty <= 25).toBe(true);
  expect(cunning.behavioralBadge).toBe('🗡️ Tehlikeli Fırsatçı');

  const wild = FighterPsychology.fromArchetype(PersonalityArchetype.VAHSI);
  expect(wild.wildInstinct).toBe(95);
  expect(wild.behavioralBadge).toBe('🐾 Kaotik & İçgüdüsel');

  const lazy = FighterPsychology.fromArchetype(PersonalityArchetype.TEMBEL);
  expect(lazy.apathy).toBe(90);
  expect(lazy.behavioralBadge).toBe('💤 Duyarsız & Kayıtsız');

  const ambitious = FighterPsychology.fromArchetype(PersonalityArchetype.HIRSLI);
  expect(ambitious.ambition).toBe(95);
  expect(ambitious.pragmatism >= 75).toBe(true);
});

test('testDominantTraitsSummary', () => {
  const proud = FighterPsychology.fromArchetype(PersonalityArchetype.GURURLU);
  const dominant = proud.dominantTraits;
  expect(dominant.length).toBe(2);
  expect(dominant[0].name).toBe('Onur & Gurur');
  expect(dominant[0].value).toBe(95);
  expect(dominant[1].name).toBe('Sadakat & Dostluk');
  expect(dominant[1].value).toBe(85);
});

test('testAllianceDecisionDeterminismAndChaos', () => {
  const proud = FighterPsychology.fromArchetype(PersonalityArchetype.GURURLU);
  // With normal roll (e.g. 50, avoiding chaos threshold), proud accepts honorable alliance
  const decision = proud.evaluateAllianceOffer(50);
  expect(decision).toBe(AllianceDecision.HONORABLE_ALLIANCE);

  const cunning = FighterPsychology.fromArchetype(PersonalityArchetype.KURNAZ);
  const cunningDecision = cunning.evaluateAllianceOffer(50);
  expect(cunningDecision).toBe(AllianceDecision.SUSPICIOUS_ALLIANCE_WITH_BACKSTAB_INTENT);

  // Wildcard / Chaos roll (roll < chaos threshold)
  const chaosAccept = proud.evaluateAllianceOffer(2); // even roll -> CHAOTIC_ACCEPT
  expect(chaosAccept).toBe(AllianceDecision.CHAOTIC_ACCEPT);

  const chaosRefuse = proud.evaluateAllianceOffer(3); // odd roll -> CHAOTIC_REFUSE
  expect(chaosRefuse).toBe(AllianceDecision.CHAOTIC_REFUSE);
});

test('testLootDilemmaDecisions', () => {
  const proud = FighterPsychology.fromArchetype(PersonalityArchetype.GURURLU);
  const proudLoot = proud.evaluateLootDilemma(true, 50);
  expect(proudLoot).toBe(LootAction.FAIR_SHARE);

  const cunning = FighterPsychology.fromArchetype(PersonalityArchetype.KURNAZ);
  const cunningLoot = cunning.evaluateLootDilemma(true, 50);
  expect(cunningLoot).toBe(LootAction.BETRAY_AND_STRIKE);

  const lazy = FighterPsychology.fromArchetype(PersonalityArchetype.TEMBEL);
  const lazyLoot = lazy.evaluateLootDilemma(true, 50);
  expect(lazyLoot).toBe(LootAction.LEAVE_LOOT_TO_ALLY);
});

test('testCrisisResponseDecisions', () => {
  const proud = FighterPsychology.fromArchetype(PersonalityArchetype.GURURLU);
  const proudCrisis = proud.evaluateCrisisResponse(50);
  expect(proudCrisis).toBe(CrisisAction.SHIELD_AND_DEFEND_ALLY);

  const cunning = FighterPsychology.fromArchetype(PersonalityArchetype.KURNAZ);
  const cunningCrisis = cunning.evaluateCrisisResponse(50);
  expect(cunningCrisis).toBe(CrisisAction.SACRIFICE_ALLY_AND_FLEE);

  const wild = FighterPsychology.fromArchetype(PersonalityArchetype.VAHSI);
  const wildChaos = wild.evaluateCrisisResponse(2);
  expect(wildChaos).toBe(CrisisAction.BERSERK_RESCUE);
});

test('testUniversalCoverageForRegion1AndRegion2Gladiators', () => {
  // Region 1 (StarterContent)
  const region1Enemies = StarterContent.createInitialEnemies();
  expect(region1Enemies.length > 0).toBe(true);
  region1Enemies.forEach((enemy) => {
    expect(enemy.personality).not.toBeNull(); // `${enemy.name} should have personality`
    expect(enemy.personality.psychology).not.toBeNull(); // `${enemy.name} should have psychology`
    expect(in0to100(enemy.personality.psychology.loyalty)).toBe(true);
    expect(in0to100(enemy.personality.psychology.treachery)).toBe(true);
    expect(in0to100(enemy.personality.psychology.pragmatism)).toBe(true);
    expect(in0to100(enemy.personality.psychology.ambition)).toBe(true);
    expect(in0to100(enemy.personality.psychology.pride)).toBe(true);
    expect(in0to100(enemy.personality.psychology.apathy)).toBe(true);
    expect(in0to100(enemy.personality.psychology.wildInstinct)).toBe(true);
  });

  // Region 2 (TashisarGladiatorsData)
  const region2Enemies = TashisarGladiatorsData.createTashisarEnemies();
  expect(region2Enemies.length).toBe(40);
  region2Enemies.forEach((enemy) => {
    expect(enemy.personality).not.toBeNull();
    expect(enemy.personality.psychology).not.toBeNull();
    expect(in0to100(enemy.personality.psychology.loyalty)).toBe(true);
    expect(in0to100(enemy.personality.psychology.treachery)).toBe(true);
  });

  // CharacterRegistry Profiles
  const allProfiles = CharacterRegistryData.getAllProfiles();
  expect(allProfiles.length >= 50).toBe(true);
});
