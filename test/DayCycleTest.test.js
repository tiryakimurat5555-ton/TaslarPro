// Kotlin kaynağı: test/DayCycleTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';
import * as kt from '../src/kt.js';

beforeEach(() => {
  SaveManager.useMemoryStorage();
});

test('testInitialDayStateIsDayOne', () => {
  const repository = new GameRepository();
  const state = repository.dayState.value;

  expect(state.currentDay).toBe(1);
  expect(state.canFightArenaToday).toBe(true);
  expect(state.canPlayDiceToday).toBe(true);
  expect(state.canTrainToday).toBe(true);
  expect(state.canEatMealToday).toBe(true);
  expect(state.dailyDiceGamesPlayed).toBe(0);
  expect(state.dailyMealsEaten).toBe(0);
});

test('testDailyArenaMatchMarksMatchDoneToday', () => {
  const repository = new GameRepository();
  const enemy = kt.first(repository.enemies.value);

  expect(repository.dayState.value.canFightArenaToday).toBe(true);

  repository.executeCombat(enemy);

  expect(repository.dayState.value.isArenaMatchDoneToday).toBe(true);
  expect(repository.dayState.value.canFightArenaToday).toBe(false);
});

test('testAdvanceDayIncrementsDayAndResetsDailyLimits', () => {
  const repository = new GameRepository();
  const enemy = kt.first(repository.enemies.value);

  repository.executeCombat(enemy);
  repository.dailyTraining();

  expect(repository.dayState.value.isArenaMatchDoneToday).toBe(true);
  expect(repository.dayState.value.isDailyTrainingDone).toBe(true);

  const dawnNarrative = repository.advanceDay(0);

  const newState = repository.dayState.value;
  expect(newState.currentDay).toBe(2);
  expect(newState.isArenaMatchDoneToday).toBe(false);
  expect(newState.canFightArenaToday).toBe(true);
  expect(newState.isDailyTrainingDone).toBe(false);
  expect(newState.canTrainToday).toBe(true);
  expect(newState.dailyDiceGamesPlayed).toBe(0);
  expect(newState.dailyMealsEaten).toBe(0);

  expect(dawnNarrative).not.toBeNull();
  expect(dawnNarrative.includes('2. Gün Doğdu!')).toBe(true);
});

test('testDailyTrainingGrantsExpOnlyOncePerDay', () => {
  const repository = new GameRepository();
  const initialExp = repository.player.value.currentExp;

  const [firstSuccess, firstMsg] = repository.dailyTraining();
  expect(firstSuccess).toBe(true);
  expect(repository.player.value.currentExp > initialExp).toBe(true);
  expect(firstMsg.includes("Talimgah'ta")).toBe(true);

  const [secondSuccess, secondMsg] = repository.dailyTraining();
  expect(secondSuccess).toBe(false);
  expect(secondMsg.includes('zaten tamamladın')).toBe(true);
});

test('testTavernDiceAndMealsEnforceDailyLimits', () => {
  const repository = new GameRepository();

  // 5 dice games limit (bet 1 gold so initial 25 gold is plenty)
  for (let i = 1; i <= 5; i++) {
    const res = repository.playDiceGame(1);
    expect(res).not.toBeNull();
  }
  const sixthGame = repository.playDiceGame(1);
  expect(sixthGame).toBeNull(); // 6th dice game on same day should be rejected

  // 3 meals limit (0 gold so it tests the daily limit directly)
  for (let i = 1; i <= 3; i++) {
    const res = repository.orderTavernMeal(0, 10, 'Çorba');
    expect(res).toBe(true);
  }
  const fourthMeal = repository.orderTavernMeal(0, 10, 'Çorba');
  expect(fourthMeal).toBe(false); // 4th meal on same day should be rejected
});

test('testAdvanceDayHealsAndCollectsTreasuryIncome', () => {
  const repository = new GameRepository();
  // Execute combat to fulfill daily arena obligation
  repository.executeCombat(kt.first(repository.enemies.value));

  repository.advanceDay(0);

  // Player day advanced
  expect(repository.dayState.value.currentDay).toBe(2);
});

test('testTavernEavesdroppingLimitAndDailyReset', () => {
  const repository = new GameRepository();
  expect(repository.dayState.value.dailyEavesdropsDone).toBe(0);
  expect(repository.dayState.value.maxEavesdropsPerDay).toBe(3);
  expect(repository.dayState.value.canEavesdropToday).toBe(true);

  // 1st eavesdrop
  const [firstTale] = repository.listenRandomTavernTale();
  expect(firstTale).not.toBeNull();
  expect(repository.dayState.value.dailyEavesdropsDone).toBe(1);
  expect(repository.dayState.value.remainingEavesdrops).toBe(2);
  expect(repository.dayState.value.canEavesdropToday).toBe(true);

  // 2nd eavesdrop
  const [secondTale] = repository.listenRandomTavernTale();
  expect(secondTale).not.toBeNull();
  expect(repository.dayState.value.dailyEavesdropsDone).toBe(2);
  expect(repository.dayState.value.remainingEavesdrops).toBe(1);
  expect(repository.dayState.value.canEavesdropToday).toBe(true);

  // 3rd eavesdrop
  const [thirdTale] = repository.listenRandomTavernTale();
  expect(thirdTale).not.toBeNull();
  expect(repository.dayState.value.dailyEavesdropsDone).toBe(3);
  expect(repository.dayState.value.remainingEavesdrops).toBe(0);
  expect(repository.dayState.value.canEavesdropToday).toBe(false);

  // 4th eavesdrop should be rejected
  const [fourthTale, warningMsg] = repository.listenRandomTavernTale();
  expect(fourthTale).toBeNull(); // 4th eavesdrop should be blocked by daily limit
  expect(warningMsg).not.toBeNull();
  expect(warningMsg.includes('Bugünkü dinleme hakkın doldu')).toBe(true);
  expect(repository.dayState.value.dailyEavesdropsDone).toBe(3);

  // Advance day
  repository.executeCombat(kt.first(repository.enemies.value));
  repository.advanceDay(0);

  // New day should reset eavesdropping rights
  expect(repository.dayState.value.currentDay).toBe(2);
  expect(repository.dayState.value.dailyEavesdropsDone).toBe(0);
  expect(repository.dayState.value.remainingEavesdrops).toBe(3);
  expect(repository.dayState.value.canEavesdropToday).toBe(true);

  const [nextDayTale] = repository.listenRandomTavernTale();
  expect(nextDayTale).not.toBeNull();
  expect(repository.dayState.value.dailyEavesdropsDone).toBe(1);
});
