// Kotlin kaynağı: test/LabyrinthGameplayTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';
import { LabyrinthBiomeType } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

let repository;

beforeEach(() => {
  SaveManager.useMemoryStorage();
  repository = new GameRepository();
  // Oyuncuya test için yeterli altın verelim
  const player = repository.player.value;
  const updated = player.copy({ gold: 200, currentHealth: 100 });
  // Kotlin'de yansıma ile özel _player alanı
  repository._player.value = updated;
});

test('testStartLabyrinthRunDeductsGoldAndInitializesChambers', () => {
  const initialGold = repository.player.value.gold;
  const success = repository.startLabyrinthRun(LabyrinthBiomeType.CARKLI_MEKANIZMA);
  expect(success).toBe(true);

  const run = repository.activeLabyrinthRun.value;
  expect(run).not.toBeNull();
  expect(run?.biome).toBe(LabyrinthBiomeType.CARKLI_MEKANIZMA);
  expect(repository.player.value.gold).toBe(initialGold - 35);
  expect(run?.currentChamberIndex).toBe(0);
  expect((run?.chambers?.length ?? 0) >= 5).toBe(true);
});

test('testHazardResolutionMechanics', () => {
  repository.startLabyrinthRun(LabyrinthBiomeType.CARKLI_MEKANIZMA);
  const initialHp = repository.player.value.currentHealth;

  // Test Agility
  const [success, narrative] = repository.resolveCurrentHazard('AGILITY');
  expect(narrative.length > 0).toBe(true);
  const hp = repository.player.value.currentHealth;
  expect(hp >= 1 && hp <= initialHp).toBe(true);
});

test('testPuzzleSolvingGivesRewards', () => {
  repository.startLabyrinthRun(LabyrinthBiomeType.KUTSAL_KRIPTA);
  const initialGold = repository.player.value.gold;

  const [solved, narrative] = repository.solveCurrentPuzzle(0);
  expect(narrative.length > 0).toBe(true);
  if (solved) {
    expect(repository.player.value.gold > initialGold).toBe(true);
  }
});

test('testChestOpeningAndGladiatorInteractions', () => {
  repository.startLabyrinthRun(LabyrinthBiomeType.VOLKANIK_KORLUK);

  // İttifak etkileşimi
  const [title, narrative] = repository.interactChamberGladiator('ALLIANCE');
  expect(narrative.length > 0).toBe(true);

  // Sandık açma
  const [gold, chestNarrative] = repository.openChamberChest();
  expect(chestNarrative.length > 0).toBe(true);
});

test('testChamberProgressionUntilVictory', () => {
  repository.startLabyrinthRun(LabyrinthBiomeType.KADIM_SARNIC);
  const totalChambers = repository.activeLabyrinthRun.value?.chambers?.length ?? 6;

  for (let i = 0; i < totalChambers - 1; i++) {
    const advanced = repository.advanceLabyrinthChamber();
    expect(advanced).toBe(true);
  }

  // Son odada ilerleyince çıkış kapısından zaferle çıkmalı!
  const lastAdvance = repository.advanceLabyrinthChamber();
  expect(lastAdvance).toBe(false); // Oturum bittiği için false döner
  expect(repository.activeLabyrinthRun.value).toBeNull();
  expect(repository.labyrinthMessage.value?.includes('TEBRİKLER') === true).toBe(true);
});

test('testAbandonLabyrinthRun', () => {
  repository.startLabyrinthRun(LabyrinthBiomeType.DIPSIZ_YARIK);
  expect(repository.activeLabyrinthRun.value).not.toBeNull();

  repository.abandonLabyrinthRun();
  expect(repository.activeLabyrinthRun.value).toBeNull();
  expect(repository.labyrinthMessage.value?.includes('ayrılarak') === true).toBe(true);
});

test('testLabyrinthCombatExecution', () => {
  repository.startLabyrinthRun(LabyrinthBiomeType.CURUK_SARMASIK);
  const enemy = kt.first(repository.getFullGladiatorPool());

  const initialGold = repository.player.value.gold;
  const result = repository.executeLabyrinthCombat(enemy);

  expect(result).not.toBeNull();
  expect(result.logs.length > 0).toBe(true);
  expect(result.totalRounds >= 1).toBe(true);
  if (result.isPlayerWinner) {
    expect(repository.player.value.gold >= initialGold).toBe(true);
    expect(repository.player.value.currentHealth > 0).toBe(true);
  } else {
    expect(repository.player.value.currentHealth).toBe(15);
    expect(repository.activeLabyrinthRun.value).toBeNull();
  }
});
