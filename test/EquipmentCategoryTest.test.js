// Kotlin kaynağı: test/EquipmentCategoryTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';
import { StarterContent } from '../src/data/StarterContent.js';
import { AccessoryCategory, ArmorCategory, EquipmentSlot, UsableCategory, WeaponCategory } from '../src/domain/model.js';

beforeEach(() => {
  SaveManager.useMemoryStorage();
});

test('testAllSevenWeaponCategoriesExistWithDetails', () => {
  const categories = WeaponCategory.values();
  expect(categories.length).toBe(7);

  const expected = [WeaponCategory.SWORD, WeaponCategory.SPEAR, WeaponCategory.DAGGER, WeaponCategory.MACE, WeaponCategory.BOW, WeaponCategory.STAFF, WeaponCategory.AXE];
  expect(expected.every((e) => categories.includes(e))).toBe(true);

  for (const cat of categories) {
    expect(cat.displayName != null).toBe(true);
    expect(cat.icon != null).toBe(true);
    expect(cat.description != null).toBe(true);
    expect(cat.combatStyle != null).toBe(true);
  }
});

test('testArmorAndClothingCategories', () => {
  const armorCategories = ArmorCategory.values();
  expect(armorCategories.includes(ArmorCategory.LIGHT_ARMOR)).toBe(true);
  expect(armorCategories.includes(ArmorCategory.HEAVY_ARMOR)).toBe(true);
  expect(armorCategories.includes(ArmorCategory.ROBE)).toBe(true);
  expect(armorCategories.includes(ArmorCategory.HELMET)).toBe(true);
  expect(armorCategories.includes(ArmorCategory.ASSASSIN_HOOD)).toBe(true);
  expect(armorCategories.includes(ArmorCategory.MISC_HEADGEAR)).toBe(true);
  expect(armorCategories.includes(ArmorCategory.GLOVES)).toBe(true);
  expect(armorCategories.includes(ArmorCategory.PANTS)).toBe(true);
  expect(armorCategories.includes(ArmorCategory.BOOTS)).toBe(true);

  expect(ArmorCategory.LIGHT_ARMOR.slot).toBe(EquipmentSlot.CHEST);
  expect(ArmorCategory.HEAVY_ARMOR.slot).toBe(EquipmentSlot.CHEST);
  expect(ArmorCategory.ROBE.slot).toBe(EquipmentSlot.CHEST);
  expect(ArmorCategory.HELMET.slot).toBe(EquipmentSlot.HEAD);
  expect(ArmorCategory.ASSASSIN_HOOD.slot).toBe(EquipmentSlot.HEAD);
  expect(ArmorCategory.GLOVES.slot).toBe(EquipmentSlot.GLOVES);
  expect(ArmorCategory.PANTS.slot).toBe(EquipmentSlot.PANTS);
  expect(ArmorCategory.BOOTS.slot).toBe(EquipmentSlot.BOOTS);
});

test('testAccessoryAndShieldCategories', () => {
  const accessories = AccessoryCategory.values();
  expect(accessories.includes(AccessoryCategory.SHIELD)).toBe(true);
  expect(accessories.includes(AccessoryCategory.RING)).toBe(true);
  expect(accessories.includes(AccessoryCategory.TALISMAN)).toBe(true);

  expect(AccessoryCategory.SHIELD.slot).toBe(EquipmentSlot.SHIELD);
  expect(AccessoryCategory.RING.slot).toBe(EquipmentSlot.RING);
  expect(AccessoryCategory.TALISMAN.slot).toBe(EquipmentSlot.TALISMAN);
});

test('testUsableAndConsumableCategories', () => {
  const usables = UsableCategory.values();
  expect(usables.includes(UsableCategory.POTION)).toBe(true);
  expect(usables.includes(UsableCategory.HERB)).toBe(true);
  expect(usables.includes(UsableCategory.SCROLL)).toBe(true);
});

test('testNineEquipmentSlotsAndBackwardCompatibility', () => {
  const slots = EquipmentSlot.values();
  expect(slots.length).toBe(9);

  // Backward compatibility check
  expect(EquipmentSlot.HELMET).toBe(EquipmentSlot.HEAD);
  expect(EquipmentSlot.AMULET).toBe(EquipmentSlot.TALISMAN);
});

test('testInitialPlayerEquippedSlotsAndStats', () => {
  const repository = new GameRepository();
  const player = repository.player.value;

  expect(player.equipped[EquipmentSlot.HEAD] != null).toBe(true); // Headpiece should be equipped
  expect(player.equipped[EquipmentSlot.CHEST] != null).toBe(true); // Chest armor should be equipped
  expect(player.equipped[EquipmentSlot.GLOVES] != null).toBe(true); // Gloves should be equipped
  expect(player.equipped[EquipmentSlot.PANTS] != null).toBe(true); // Pants should be equipped
  expect(player.equipped[EquipmentSlot.BOOTS] != null).toBe(true); // Boots should be equipped
  expect(player.equipped[EquipmentSlot.WEAPON] != null).toBe(true); // Weapon should be equipped
  expect(player.equipped[EquipmentSlot.SHIELD] != null).toBe(true); // Shield should be equipped

  // Verify weapon category
  const weapon = player.equipped[EquipmentSlot.WEAPON];
  expect(weapon.weaponCategory).toBe(WeaponCategory.MACE);

  // Verify total stats includes shield and gloves bonuses
  const stats = player.totalStats;
  expect(stats.damage > 0).toBe(true); // Damage should be > 0
  expect(stats.armor >= 3).toBe(true); // Armor should reflect chest, head, gloves, shield
  expect(stats.blockChancePercent >= 4).toBe(true); // Block chance should include shield
});

test('testEquipAndUnequipAcrossNineSlots', () => {
  const repository = new GameRepository();

  // Equip bone talisman
  const talisman = StarterContent.boneAmulet;
  expect(repository.equipItem(talisman)).toBe(true);
  expect(repository.player.value.equipped[EquipmentSlot.TALISMAN]?.id).toBe(talisman.id);

  // Equip brass ring
  const ring = StarterContent.brassRing;
  expect(repository.equipItem(ring)).toBe(true);
  expect(repository.player.value.equipped[EquipmentSlot.RING]?.id).toBe(ring.id);

  // Unequip weapon
  expect(repository.unequipItem(EquipmentSlot.WEAPON)).toBe(true);
  expect(repository.player.value.equipped[EquipmentSlot.WEAPON] ?? null).toBeNull();

  // Unequip shield
  expect(repository.unequipItem(EquipmentSlot.SHIELD)).toBe(true);
  expect(repository.player.value.equipped[EquipmentSlot.SHIELD] ?? null).toBeNull();
});

test('testStarterConsumablesIncludeHerbAndScroll', () => {
  const repository = new GameRepository();
  const consumables = repository.player.value.consumables;

  const hasPotion = consumables.some((it) => it.usableCategory === UsableCategory.POTION);
  const hasHerb = consumables.some((it) => it.usableCategory === UsableCategory.HERB);
  const hasScroll = consumables.some((it) => it.usableCategory === UsableCategory.SCROLL);

  expect(hasPotion).toBe(true); // Player should have starter potion
  expect(hasHerb).toBe(true); // Player should have starter herb
  expect(hasScroll).toBe(true); // Player should have starter scroll
});
