// Kotlin kaynağı: test/TashisarLeatherworkerEquipmentTest.kt
import { test, expect } from 'bun:test';
import { TashisarLeatherworkerEquipmentData } from '../src/data/TashisarLeatherworkerEquipmentData.js';
import { ArmorCategory, EquipmentSlot, NpcRole } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

// StarterContent ve CharacterRegistryData başka ajanların dosyaları; yalnız onları gerektiren testlerde yüklenir.
const starterContent = async () => (await import('../src/data/StarterContent.js')).StarterContent;
const characterRegistryData = async () => (await import('../src/data/CharacterRegistryData.js')).CharacterRegistryData;

test('testGlovesCountAndProperties', () => {
  const gloves = TashisarLeatherworkerEquipmentData.createGloves();
  expect(gloves.length).toBe(50); // Tam olarak 50 bileklik ve kolluk olmalı

  gloves.forEach((glove) => {
    expect(glove.slot).toBe(EquipmentSlot.GLOVES);
    expect(glove.armorCategory).toBe(ArmorCategory.GLOVES);
    expect(glove.weaponType).toBe('eldiven');
    expect(glove.requiredLevel >= 20 && glove.requiredLevel <= 39).toBe(true); // Seviye 20 ile 39 arasında olmalı
    expect(glove.valueInGold >= 500 && glove.valueInGold <= 12000).toBe(true); // Fiyat 500 ile 12000 altın arasında olmalı
    expect(glove.maxSockets >= 1 && glove.maxSockets <= 3).toBe(true); // En az 1 taş yuvası olmalı
    expect(glove.specialTrait).not.toBeNull(); // Özel nitelik boş olamaz
    expect(kt.isNotBlank(glove.specialTrait.id)).toBe(true); // Özel nitelik ID'si boş olamaz
  });
});

test('testPantsCountAndProperties', () => {
  const pants = TashisarLeatherworkerEquipmentData.createPants();
  expect(pants.length).toBe(50); // Tam olarak 50 bacak zırhı ve pantolon olmalı

  pants.forEach((pant) => {
    expect(pant.slot).toBe(EquipmentSlot.PANTS);
    expect(pant.armorCategory).toBe(ArmorCategory.PANTS);
    expect(pant.weaponType).toBe('pantolon');
    expect(pant.requiredLevel >= 20 && pant.requiredLevel <= 39).toBe(true); // Seviye 20 ile 39 arasında olmalı
    expect(pant.valueInGold >= 500 && pant.valueInGold <= 12000).toBe(true); // Fiyat 500 ile 12000 altın arasında olmalı
    expect(pant.maxSockets >= 1 && pant.maxSockets <= 3).toBe(true); // En az 1 taş yuvası olmalı
    expect(pant.specialTrait).not.toBeNull(); // Özel nitelik boş olamaz
    expect(kt.isNotBlank(pant.specialTrait.id)).toBe(true); // Özel nitelik ID'si boş olamaz
  });
});

test('testAllIdsAndTraitsAreUnique', () => {
  const allItems = TashisarLeatherworkerEquipmentData.createAllLeatherworkerEquipment();
  expect(allItems.length).toBe(100);

  const itemIds = new Set(allItems.map((it) => it.id));
  expect(itemIds.size).toBe(100); // Tüm 100 eşya ID'si benzersiz olmalı

  const traitIds = new Set(allItems.map((it) => it.specialTrait.id));
  expect(traitIds.size).toBe(100); // Tüm 100 nitelik ID'si benzersiz olmalı
});

test('testStarterContentLeatherworkerNpcIntegration', async () => {
  const StarterContent = await starterContent();
  const region2 = StarterContent.createRegion2();
  const leatherworker = kt.firstOrNull(region2.npcs, (it) => it.role === NpcRole.LEATHERWORKER);
  expect(leatherworker).not.toBeNull(); // Saraç Garrick NPC bulunmalı
  expect(leatherworker.name).toBe('Saraç Garrick');
  expect(leatherworker.equipmentForSale.length).toBe(100);

  const glovesCount = kt.count(leatherworker.equipmentForSale, (it) => it.slot === EquipmentSlot.GLOVES);
  const pantsCount = kt.count(leatherworker.equipmentForSale, (it) => it.slot === EquipmentSlot.PANTS);
  expect(glovesCount).toBe(50);
  expect(pantsCount).toBe(50);
});

test('testCharacterRegistryHasGarrickProfile', async () => {
  const CharacterRegistryData = await characterRegistryData();
  const allProfiles = CharacterRegistryData.getAllProfiles();
  const garrickProfile = kt.firstOrNull(allProfiles, (it) => it.id === 'npc_leatherworker');
  expect(garrickProfile).not.toBeNull(); // Saraç Garrick profili CharacterRegistryData'da bulunmalı
  expect(garrickProfile.name).toBe('Saraç Garrick');
});
