// Kotlin kaynağı: test/CompanionPavilionTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { CompanionPavilionData } from '../src/data/CompanionPavilionData.js';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';

beforeEach(() => {
  SaveManager.useMemoryStorage();
});

test('testCompanionDataIntegrity', () => {
  const companions = CompanionPavilionData.getAllCompanions();
  expect(companions.length).toBe(2);

  const aresula = CompanionPavilionData.getCompanionById('fighter_aresula');
  expect(aresula).not.toBeNull();
  expect(aresula.name).toBe('Aresula');
  expect(aresula.salonTier).toBe(1);
  expect(aresula.kademeler.length).toBe(5);
  expect(aresula.culmination.passionNarrative.length >= 4).toBe(true);
  expect(aresula.culmination.futureBasePledge.length === 0).toBe(false);

  const althea = CompanionPavilionData.getCompanionById('npc_althea');
  expect(althea).not.toBeNull();
  expect(althea.name).toBe('Kızıl Muhafız Althea');
  expect(althea.salonTier).toBe(2);
  expect(althea.kademeler.length).toBe(5);
  expect(althea.culmination.passionNarrative.length >= 4).toBe(true);
  expect(althea.culmination.futureBasePledge.length === 0).toBe(false);

  // Her kademede 5 tur ve her turda 3 seçenek (toplam 15 seçenek/ziyaret) kontrol edilir
  for (const kademe of aresula.kademeler) {
    expect(kademe.rounds.length).toBe(5); // Aresula her kademede 5 tur barındırmalı
    for (const round of kademe.rounds) {
      expect(round.choices.length).toBe(3); // Her turda 3 seçenek bulunmalı
      for (const choice of round.choices) {
        expect(choice.playerSpeechText.length > 15).toBe(true);
        expect(choice.narrativeResponse.length > 30).toBe(true);
      }
    }
  }

  for (const kademe of althea.kademeler) {
    expect(kademe.rounds.length).toBe(5); // Althea her kademede 5 tur barındırmalı
    for (const round of kademe.rounds) {
      expect(round.choices.length).toBe(3); // Her turda 3 seçenek bulunmalı
      for (const choice of round.choices) {
        expect(choice.playerSpeechText.length > 15).toBe(true);
        expect(choice.narrativeResponse.length > 30).toBe(true);
      }
    }
  }
});

test('testEnterCompanionSalonGoldRequirements', () => {
  const repo = new GameRepository();
  // Başlangıçta oyuncunun altını yetersizdir (50 altın)
  const [compFail, msgFail] = repo.enterCompanionSalon(1);
  expect(compFail).toBeNull();
  expect(msgFail.includes('Altın gerekli')).toBe(true);

  // Altın verelim
  repo.addGold(10000);

  // 1. Salon (Kehribar - 2.500 Altın)
  const [aresula, msgSuccess1] = repo.enterCompanionSalon(1);
  expect(aresula).not.toBeNull();
  expect(aresula.id).toBe('fighter_aresula');
  expect(msgSuccess1.includes('2500 Altın')).toBe(true);

  // 2. Salon (Yeşim - 5.000 Altın)
  const [althea, msgSuccess2] = repo.enterCompanionSalon(2);
  expect(althea).not.toBeNull();
  expect(althea.id).toBe('npc_althea');
  expect(msgSuccess2.includes('5000 Altın')).toBe(true);
});

test('testCompleteCompanionEncounterBondAndBuff', () => {
  const repo = new GameRepository();
  const althea = CompanionPavilionData.getCompanionById('npc_althea');

  repo.completeCompanionEncounter(althea.id, 5, althea.culmination.buffRewardTitle, althea.culmination.buffRewardDescription);

  const player = repo.player.value;
  expect(player.companionBondLevels[althea.id]).toBe(5);
  expect(player.activeMoraleBuff).not.toBeNull();
  expect(player.activeMoraleBuff.includes('Kızıl Muhafızın İncisi')).toBe(true);
});

test('testPerVisitStageProgressionAndMaxBondRepeat', () => {
  const repo = new GameRepository();
  repo.addGold(50000);

  // 1. Ziyaret: Başlangıçta bağ 0'dır, Kademe 1 oynanır ve bağ 1 olur
  repo.advanceCompanionStage('fighter_aresula', 1, 'Kademe 1', 'Buff 1');
  expect(repo.player.value.companionBondLevels['fighter_aresula']).toBe(1);

  // 2. Ziyaret: Bağ 2'ye yükselir
  repo.advanceCompanionStage('fighter_aresula', 2, 'Kademe 2', 'Buff 2');
  expect(repo.player.value.companionBondLevels['fighter_aresula']).toBe(2);

  // 3. Ziyaret: Bağ 3'e yükselir
  repo.advanceCompanionStage('fighter_aresula', 3, 'Kademe 3', 'Buff 3');
  expect(repo.player.value.companionBondLevels['fighter_aresula']).toBe(3);

  // 4. Ziyaret: Bağ 4'e yükselir
  repo.advanceCompanionStage('fighter_aresula', 4, 'Kademe 4', 'Buff 4');
  expect(repo.player.value.companionBondLevels['fighter_aresula']).toBe(4);

  // 5. Ziyaret: Kademe 5 tamamlanır, bağ 5 (ZİRVE) olur ve vuslat yaşanır
  const aresula = CompanionPavilionData.getCompanionById('fighter_aresula');
  repo.completeCompanionEncounter(aresula.id, 5, aresula.culmination.buffRewardTitle, aresula.culmination.buffRewardDescription);
  expect(repo.player.value.companionBondLevels['fighter_aresula']).toBe(5);

  // 6. ve Sonraki Ziyaretler: Bağ 5 olduğu için salona tekrar girildiğinde karşılama mesajı ve zirve vuslat durumu doğrulanır
  const [compAgain, msgAgain] = repo.enterCompanionSalon(1);
  expect(compAgain).not.toBeNull();
  expect(msgAgain.includes('derin bir aşk ve arzuyla')).toBe(true);
});
