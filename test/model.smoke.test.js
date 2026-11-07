import { test, expect } from 'bun:test';
import * as kt from '../src/kt.js';
import {
  Player,
  Stats,
  Equipment,
  EquipmentSlot,
  ItemRarity,
  ArmorCategory,
  AccessoryCategory,
  Gem,
  GemType,
  GemTier,
  GemCraftingRules,
  ConsumableItem,
  ItemType,
  UsableCategory,
  Enemy,
  FighterPersonality,
  FighterPsychology,
  PersonalityArchetype,
  AllianceDecision,
  LootAction,
  CrisisAction,
  ArenaDiscipline,
  ChestType,
  StorageChest,
  DuoMatchState,
  LabyrinthMatchState,
  UnarmedMatchState,
  StarterSkills,
  ActiveBuffEffect,
  DayState,
  TrainerStatus,
  FighterStanding,
  Adventure,
  calculatePlayerTitle,
  calculatePlayerTitleForRegion,
} from '../src/domain/model.js';

test('varsayılan Player ve hesaplanan alanlar', () => {
  const p = new Player();
  expect(p.name).toBe('Sürgün Silahşör');
  expect(p.level).toBe(1);
  expect(p.maxExp).toBe(110);
  expect(kt.eq(p.totalStats, new Stats({ maxHealth: 100, damage: 10, armor: 2, speed: 10, dodgeChancePercent: 5, critChancePercent: 5, blockChancePercent: 5 }))).toBe(true);
  expect(p.currentRegionFame).toBe(0);
  expect(p.currentRegionTitle).toBe('Bilinmeyen Sürgün');
  expect(p.getUnlockedRegionIds()).toEqual(['kirlangic']);
  expect(p.isCharacterEncountered('npc_vorn')).toBe(true);
  expect(Object.keys(p.equipped)).toEqual(EquipmentSlot.values().map((e) => e.name));
  expect(p.trainerStatus.nextMilestone).toBe(10);

  const p12 = p.copy({ level: 12, hasGarrisonPass: true });
  expect(p12.maxExp).toBe(2000 + 2 * 500 + 4 * 150);
  expect(p12.getFameForRegion('tashisar')).toBe(10);
  expect(p12.getUnlockedRegionIds()).toEqual(['kirlangic', 'tashisar']);
  expect(p12.totalStats.damage).toBe(10 + 11 * 3);
});

test('Player toJson/fromJson gidiş-dönüş', () => {
  const kilic = new Equipment({
    id: 'k1',
    name: 'Kılıç',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.USTAISI,
    stats: new Stats({ damage: 7 }),
    description: 'd',
    unlockedSockets: 1,
    sockets: [Gem.create(GemType.YAKUT, 2)],
  });
  const p = new Player({
    equipped: kt.mapPlus(new Player().equipped, EquipmentSlot.WEAPON, kilic),
    gemShards: { [GemType.OPAL]: 4 },
    gemUpgradePity: { 3: 7 },
    builtChests: [new StorageChest({ slotIndex: 0, type: ChestType.IRON_CHEST })],
    activeBuffs: [new ActiveBuffEffect({ id: 'b', name: 'n', icon: 'i', description: 'd', bonusDamage: 2 })],
    activeMoraleBuff: 'x',
  });
  const geri = kt.fromJson(kt.toJson(p));
  expect(geri).toBeInstanceOf(Player);
  expect(kt.eq(geri, p)).toBe(true);
  expect(geri.equipped.WEAPON).toBeInstanceOf(Equipment);
  expect(geri.equipped.WEAPON.slot).toBe(EquipmentSlot.WEAPON);
  expect(geri.isEquipped(kilic)).toBe(true);
  expect(geri.getShardCount(GemType.OPAL)).toBe(4);
  expect(geri.getPityForLevel(3)).toBe(7);
  expect(geri.getChestForType(ChestType.IRON_CHEST).upgradeCostGold).toBe(75);
  // 10 + 7 + yakut(2) 6 + buff 2
  expect(geri.totalStats.damage).toBe(25);
  expect(geri.totalStats.maxHealth).toBe(110);
  expect(geri.totalStats.critChancePercent).toBe(10);
});

test('Stats.plus ve toStatSummary', () => {
  const a = new Stats({ damage: 3, dodgeChancePercent: 50, critChancePercent: 70, blockChancePercent: 60 });
  const b = new Stats({ damage: 4, speed: -2, dodgeChancePercent: 20, critChancePercent: 20, blockChancePercent: 20 });
  const c = a.plus(b);
  expect(c.damage).toBe(7);
  expect(c.dodgeChancePercent).toBe(60);
  expect(c.critChancePercent).toBe(75);
  expect(c.blockChancePercent).toBe(65);
  expect(new Stats({ damage: 5, speed: -1 }).toStatSummary()).toBe('+5 Hasar • -1 Hız');
  expect(new Stats().toStatSummary()).toBe('Temel Nitelik');
});

test('enumlar', () => {
  expect(EquipmentSlot.HELMET).toBe(EquipmentSlot.HEAD);
  expect(EquipmentSlot.AMULET).toBe(EquipmentSlot.TALISMAN);
  expect(ArmorCategory.HELMET.slot).toBe(EquipmentSlot.HEAD);
  expect(AccessoryCategory.TOME.slot).toBe(EquipmentSlot.SHIELD);
  expect(ItemRarity.KADIM.colorHex).toBe(0xfff39c12);
  expect(ArenaDiscipline.fromIndex(3)).toBe(ArenaDiscipline.LABYRINTH_3V3);
  expect(ArenaDiscipline.fromIndex(99)).toBe(ArenaDiscipline.SOLO_1V1);
  expect(ChestType.fromId('chest_wood')).toBe(ChestType.WOOD_CHEST);
  expect(ChestType.fromId('yok')).toBe(null);
  expect(GemType.fromNameOrNull('yakut')).toBe(GemType.YAKUT);
  expect(GemType.values().length).toBe(18);
  expect(kt.fromJson(kt.toJson({ e: GemTier.POLISHED })).e).toBe(GemTier.POLISHED);
});

test('Gem.create ve GemCraftingRules', () => {
  const g = Gem.create(GemType.ZUMRUT, 4);
  expect(g.stats.maxHealth).toBe(103);
  expect(g.tier).toBe(GemTier.POLISHED);
  expect(g.id).toBe('gem_zumrut_lvl4');
  expect(g.valueInGold).toBe(400);
  expect(Gem.create(GemType.ZUMRUT, 7).stats.maxHealth).toBe(705);
  expect(Gem.create(GemType.LAPIS, 5).stats.speed).toBe(3);
  expect(Gem.create(GemType.TOPAZ, 3).stats.speed).toBe(5);
  expect(g.displayName).toBe('🟢 Zümrüt (Sv. 4)');
  expect(GemCraftingRules.getEffectiveSuccessRate(3, 20)).toBe(100);
  expect(GemCraftingRules.getEffectiveSuccessRate(9, 7)).toBe(17);
});

test('varsayılanı başka alana bağlı alanlar', () => {
  expect(new ConsumableItem({ id: 'a', name: 'n', type: ItemType.HERB, description: 'd' }).usableCategory).toBe(UsableCategory.HERB);
  expect(new ConsumableItem({ id: 'a', name: 'n', type: ItemType.EXTRACT, description: 'd' }).categoryIcon).toBe('🧪');
  expect(new ConsumableItem({ id: 'a', name: 'n', type: ItemType.HERB, usableCategory: UsableCategory.PEHLIVAN_OIL, description: 'd' }).usableCategory).toBe(UsableCategory.PEHLIVAN_OIL);
  const e = new Enemy({ id: 'e', name: 'n', title: 't', level: 1, stats: new Stats({ damage: 1 }), weaponName: 'w', description: 'biyo', rewardGold: 1, rewardExp: 1, rewardFame: 1 });
  expect(e.personality.archetype).toBe(PersonalityArchetype.HIRSLI);
  expect(e.personality.bio).toBe('biyo');
  expect(e.personality.psychology.ambition).toBe(95);
  expect(kt.eq(kt.fromJson(kt.toJson(e)), e)).toBe(true);
  const fp = new FighterPersonality({ archetype: PersonalityArchetype.TEMBEL, bio: 'x' });
  expect(fp.psychology.apathy).toBe(90);
});

test('FighterPsychology kararları', () => {
  const g = FighterPsychology.fromArchetype(PersonalityArchetype.GURURLU);
  expect(g.behavioralBadge).toBe('👑 Onurlu Savaşçı');
  expect(g.dominantTraits.map((t) => t.value)).toEqual([95, 85]);
  expect(g.evaluateAllianceOffer(99)).toBe(AllianceDecision.HONORABLE_ALLIANCE);
  expect(g.evaluateAllianceOffer(0)).toBe(AllianceDecision.CHAOTIC_ACCEPT);
  expect(g.evaluateLootDilemma(false)).toBe(LootAction.OPEN_AND_TAKE);
  expect(g.evaluateLootDilemma(true, 99)).toBe(LootAction.FAIR_SHARE);
  expect(g.evaluateCrisisResponse(99)).toBe(CrisisAction.SHIELD_AND_DEFEND_ALLY);
  const k = FighterPsychology.fromArchetype(PersonalityArchetype.KURNAZ);
  expect(k.evaluateLootDilemma(true, 99)).toBe(LootAction.DEMAND_LION_SHARE);
  expect(k.evaluateCrisisResponse(99)).toBe(CrisisAction.SACRIFICE_ALLY_AND_FLEE);
  expect(Object.values(AllianceDecision).length).toBeGreaterThan(0);
  expect(AllianceDecision.values()).toContain(g.evaluateAllianceOffer());
});

test('diğer modeller', () => {
  expect(new DuoMatchState().condition.id).toBe('loose_sand');
  expect(new LabyrinthMatchState().activeTrap.id).toBe('poison_darts');
  expect(UnarmedMatchState.sampleOpponents.length).toBe(7);
  expect(StarterSkills.ALL_SKILLS.length).toBe(9);
  expect(StarterSkills.getSkillById('skill_east_tiger').name).toBe('Kaplan Pençesi');
  expect(new DayState().remainingEavesdrops).toBe(3);
  expect(new TrainerStatus({ enduranceCount: 12 }).nextMilestone).toBe(20);
  expect(new FighterStanding({ id: 'a', name: 'b', title: 'c', consecutiveLosses: 3 }).calculateLossPenalty()).toBe(1);
  expect(calculatePlayerTitle(45)).toBe('Alkış Alan Gladyatör');
  expect(calculatePlayerTitleForRegion('tashisar', 55)).toBe('Fırtına Silahşörü');
  const adv = new Adventure({ id: 'a', title: 't', description: 'd', targetName: 'x', icon: 'i', elapsedSeconds: 7, rewardGold: 1, rewardExp: 1, rewardMaterialId: 'm', rewardMaterialName: 'm', rewardMaterialIcon: 'm', failureNarrative: 'f' });
  // gearPower = 10*2 + 2*3 + 1*4 = 30 -> 45 + 15 = 60
  expect(adv.calculateSuccessChance(new Player())).toBe(60);
  expect(adv.progressPercent).toBeCloseTo(0.2, 5);
  const eq = new Equipment({ id: 'x', name: 'x', slot: EquipmentSlot.SHIELD, stats: new Stats(), description: 'd', valueInGold: 3 });
  expect(eq.sellPrice).toBe(1);
  expect(eq.isShield).toBe(true);
  expect(eq.effectiveMaxSockets).toBe(1);
  expect(eq.categoryDisplayName).toBe('Kalkan');
});
