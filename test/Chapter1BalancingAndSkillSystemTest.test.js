// Kotlin kaynağı: test/Chapter1BalancingAndSkillSystemTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';
import { StarterContent } from '../src/data/StarterContent.js';
import { CombatEngine } from '../src/domain/engine/CombatEngine.js';
import { NpcRole, Player, StarterSkills, Stats } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

beforeEach(() => {
  SaveManager.useMemoryStorage();
});

test('testChapter1QuestsProgressTextAndRichNarratives', () => {
  const allQuests = StarterContent.createAllQuests();
  const chapter1Quests = allQuests.filter((it) => it.completionNarratives.length > 0);
  expect(chapter1Quests.length).toBe(30);

  chapter1Quests.forEach((quest) => {
    expect(quest.progressText).not.toBeNull(); // Quest should have progressText
    expect(kt.isBlank(quest.progressText)).toBe(false); // progress text should not be empty
    // Verify none of the non-caravan quests use the old generic text
    if (!quest.id.includes('caravan') && !quest.title.toLowerCase().includes('kervan')) {
      expect(quest.progressText.includes('kervanı koruyor')).toBe(false); // should not have generic caravan text
    }
    expect(quest.completionNarratives.length >= 6).toBe(true); // must have at least 6 rich completion narratives
  });

  // Test the 6 ancient discovery quests
  const scrollQuests = chapter1Quests.filter((it) => it.rewardScrollId != null);
  expect(scrollQuests.length).toBe(6);
  scrollQuests.forEach((q) => {
    expect(q.scrollDropChancePercent > 0).toBe(true); // Scroll quest drop chance must be > 0
    const scrollItem = kt.firstOrNull(StarterContent.getAllSealedScrolls(), (it) => it.id === q.rewardScrollId);
    expect(scrollItem).not.toBeNull(); // Reward scroll must exist in getAllSealedScrolls()
  });
});

test('testSealedScrollsDefinitionsAndNpcScholar', () => {
  const allScrolls = StarterContent.getAllSealedScrolls();
  expect(allScrolls.length).toBe(6);

  // Verify scholar Jin-Zhen in Kırlangıç Kasabası
  const kirlangic = StarterContent.createInitialRegion();
  const scholar = kt.firstOrNull(kirlangic.npcs, (it) => it.role === NpcRole.SCHOLAR);
  expect(scholar).not.toBeNull(); // Kırlangıç Kasabası should have an ancient scholar NPC
  expect(scholar.id).toBe('npc_scholar_jin_zhen');
  expect(scholar.name.includes('Jin-Zhen')).toBe(true); // Scholar name must be Jin-Zhen

  // Check each scroll maps to a valid SkillOrb
  allScrolls.forEach((scroll) => {
    const orbId = StarterContent.getScrollSkillMapping(scroll.id);
    expect(orbId).not.toBeNull(); // Scroll must map to an orb ID
    const orb = StarterSkills.getSkillById(orbId);
    expect(orb).not.toBeNull(); // Skill orb must exist in StarterSkills
    expect(orb.name.length > 0).toBe(true); // Orb should be an Eastern archetype skill
  });
});

test('testDecipherSealedScrollInRepository', () => {
  const repo = new GameRepository();
  const scrollItem = kt.first(StarterContent.getAllSealedScrolls());
  const mappedOrbId = StarterContent.getScrollSkillMapping(scrollItem.id);

  // Initially player has no skills and no scrolls
  const initialPlayer = repo.player.value.copy({
    consumables: [],
    unlockedSkillIds: [],
    equippedSkillIds: [],
  });
  repo.setPlayerForTesting(initialPlayer);

  expect(kt.none(repo.player.value.consumables, (it) => it.id === scrollItem.id)).toBe(true);
  expect(repo.player.value.unlockedSkillIds.includes(mappedOrbId)).toBe(false);

  // Give player the scroll
  repo.setPlayerForTesting(repo.player.value.copy({ consumables: [scrollItem] }));
  expect(repo.player.value.consumables.some((it) => it.id === scrollItem.id)).toBe(true);

  // Decipher the scroll
  const [success, message] = repo.decipherSealedScroll(scrollItem.id);
  expect(success).toBe(true); // Deciphering should succeed

  // Verify scroll is consumed from consumables
  expect(repo.player.value.consumables.some((it) => it.id === scrollItem.id)).toBe(false); // Scroll item should be removed after deciphering

  // Verify skill orb is added to player unlocked skills
  expect(repo.player.value.unlockedSkillIds.includes(mappedOrbId)).toBe(true); // Deciphered skill orb must be in player's unlockedSkillIds
});

test('testFourActiveSkillSlotsEquipUnequipAndToggle', () => {
  const repo = new GameRepository();
  const skill1 = StarterSkills.EAST_DRAGON.id;
  const skill2 = StarterSkills.EAST_CRANE.id;
  const skill3 = StarterSkills.EAST_STORM.id;
  const skill4 = StarterSkills.EAST_NIGHT.id;
  const skill5 = StarterSkills.EAST_TIGER.id;

  // Unlock 5 skills and start with empty equipped
  repo.setPlayerForTesting(
    repo.player.value.copy({
      unlockedSkillIds: [skill1, skill2, skill3, skill4, skill5],
      equippedSkillIds: [],
    }),
  );

  expect(repo.player.value.equippedSkillIds.length).toBe(0);

  // Equip into specific slots
  repo.equipSkillToSlot(skill1, 0);
  repo.equipSkillToSlot(skill2, 1);
  repo.equipSkillToSlot(skill3, 2);
  repo.equipSkillToSlot(skill4, 3);

  expect(repo.player.value.equippedSkillIds).toEqual([skill1, skill2, skill3, skill4]);

  // Unequip slot 1 (skill2)
  repo.unequipSkillFromSlot(1);
  expect(repo.player.value.equippedSkillIds).toEqual([skill1, skill3, skill4]);

  // Toggle equip skill5 into the available empty slot
  repo.toggleEquipSkill(skill5);
  expect(repo.player.value.equippedSkillIds).toEqual([skill1, skill3, skill4, skill5]);

  // Toggle equip skill1 again -> should unequip it
  repo.toggleEquipSkill(skill1);
  expect(repo.player.value.equippedSkillIds).toEqual([skill3, skill4, skill5]);

  // Max 4 limit verification
  repo.toggleEquipSkill(skill1);
  expect(repo.player.value.equippedSkillIds.length).toBe(4);

  // Attempting to toggle a 5th skill when 4 are full should return false and not exceed 4
  const result = repo.toggleEquipSkill(skill2);
  expect(result[0]).toBe(false); // Toggling 5th skill when 4 are full must fail
  expect(repo.player.value.equippedSkillIds.length).toBe(4);
});

test('testCombatEngineOnlyTriggersActiveSlottedSkills', () => {
  const playerWithoutSkills = new Player({
    name: 'Test Savaşçı',
    level: 1,
    baseStats: new Stats({ maxHealth: 1000, damage: 15, armor: 5, speed: 10 }),
    currentHealth: 1000,
    unlockedSkillIds: [StarterSkills.EAST_DRAGON.id, StarterSkills.EAST_CRANE.id],
    equippedSkillIds: [], // NO SLOTTED SKILLS
  });

  const enemy = kt.first(StarterContent.createInitialEnemies()).copy({
    stats: new Stats({ maxHealth: 1000, damage: 10, armor: 2, speed: 8 }),
  });

  // Battle with 0 equipped skills
  const resultNoSkills = CombatEngine.simulateBattle(playerWithoutSkills, enemy);
  const dragonSkillName = StarterSkills.EAST_DRAGON.name;
  const craneSkillName = StarterSkills.EAST_CRANE.name;

  // Check logs to ensure no player skills ever triggered
  const playerSkillLogs = resultNoSkills.logs.filter((it) => it.narrativeText.includes(dragonSkillName) || it.narrativeText.includes(craneSkillName));
  expect(playerSkillLogs.length === 0).toBe(true); // Player with 0 slotted skills must never trigger any skills

  // Now test with ONLY EAST_DRAGON slotted
  const playerWithDragonOnly = playerWithoutSkills.copy({
    equippedSkillIds: [StarterSkills.EAST_DRAGON.id],
  });

  // Run multiple battles to ensure statistical certainty of unequipped skill NEVER firing
  let craneEverTriggered = false;
  let dragonEverTriggered = false;

  for (let i = 1; i <= 15; i++) {
    const res = CombatEngine.simulateBattle(playerWithDragonOnly, enemy);
    res.logs.forEach((log) => {
      if (log.narrativeText.includes(craneSkillName)) {
        craneEverTriggered = true;
      }
      if (log.narrativeText.includes(dragonSkillName)) {
        dragonEverTriggered = true;
      }
    });
  }

  // EAST_CRANE is unlocked but NOT slotted, so it must NEVER trigger
  expect(craneEverTriggered).toBe(false); // Unequipped skill EAST_CRANE must NEVER trigger in combat
  // EAST_DRAGON is slotted, so it should trigger
  expect(dragonEverTriggered).toBe(true); // Equipped skill EAST_DRAGON should have triggered across 15 matches
});
