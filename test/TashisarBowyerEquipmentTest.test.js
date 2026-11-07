// Kotlin kaynağı: test/TashisarBowyerEquipmentTest.kt
import { test, expect } from 'bun:test';
import { TashisarBowyerEquipmentData } from '../src/data/TashisarBowyerEquipmentData.js';
import { AccessoryCategory, EquipmentSlot, NpcRole, WeaponCategory } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

// StarterContent ve GameRepository başka ajanların dosyaları; yalnız onları gerektiren testlerde yüklenir.
const starterContent = async () => (await import('../src/data/StarterContent.js')).StarterContent;
const gameRepository = async () => (await import('../src/data/GameRepository.js')).GameRepository;

test('testBowsCountAndProperties', () => {
  const bows = TashisarBowyerEquipmentData.createBows();
  expect(bows.length).toBe(50); // Tam olarak 50 yay ve arbalet olmalı

  bows.forEach((bow) => {
    expect(bow.slot).toBe(EquipmentSlot.WEAPON);
    expect(bow.weaponCategory).toBe(WeaponCategory.BOW);
    expect(bow.weaponType).toBe('yay');
    expect(bow.requiredLevel >= 20 && bow.requiredLevel <= 39).toBe(true); // Seviye 20 ile 39 arasında olmalı
    expect(bow.valueInGold >= 600 && bow.valueInGold <= 12000).toBe(true); // Fiyat 600 ile 12000 altın arasında olmalı
    expect(bow.maxSockets >= 1 && bow.maxSockets <= 3).toBe(true); // En az 1 taş yuvası olmalı
    expect(bow.specialTrait).not.toBeNull(); // Özel nitelik boş olamaz
    expect(kt.isNotBlank(bow.specialTrait.id)).toBe(true); // Özel nitelik ID'si boş olamaz
  });
});

test('testArrowsCountAndProperties', () => {
  const arrows = TashisarBowyerEquipmentData.createArrows();
  expect(arrows.length).toBe(50); // Tam olarak 50 ok ve cephane olmalı

  arrows.forEach((arrow) => {
    expect(arrow.slot).toBe(EquipmentSlot.SHIELD);
    expect(arrow.accessoryCategory).toBe(AccessoryCategory.ARROW);
    expect(arrow.weaponType).toBe('ok');
    expect(arrow.requiredLevel >= 20 && arrow.requiredLevel <= 39).toBe(true); // Seviye 20 ile 39 arasında olmalı
    expect(arrow.valueInGold >= 50 && arrow.valueInGold <= 1800).toBe(true); // Cephane makul fiyatta olmalı (50-1800)
    expect(arrow.maxSockets >= 1 && arrow.maxSockets <= 2).toBe(true); // En az 1 taş yuvası olmalı
    expect(arrow.specialTrait).not.toBeNull(); // Özel nitelik boş olamaz
    expect(kt.isNotBlank(arrow.specialTrait.id)).toBe(true); // Özel nitelik ID'si boş olamaz
  });
});

test('testAllIdsAndTraitsAreUnique', () => {
  const allItems = TashisarBowyerEquipmentData.createAllBowyerEquipment();
  expect(allItems.length).toBe(100);

  const itemIds = new Set(allItems.map((it) => it.id));
  expect(itemIds.size).toBe(100); // Tüm 100 eşya ID'si benzersiz olmalı

  const traitIds = new Set(allItems.map((it) => it.specialTrait.id));
  expect(traitIds.size).toBe(100); // Tüm 100 nitelik ID'si benzersiz olmalı
});

test('testStarterContentBowyerNpcIntegration', async () => {
  const StarterContent = await starterContent();
  const region2 = StarterContent.createRegion2();
  const bowyer = kt.firstOrNull(region2.npcs, (it) => it.role === NpcRole.BOWYER);
  expect(bowyer).not.toBeNull(); // Okçu Boris NPC bulunmalı
  expect(bowyer.equipmentForSale.length).toBe(100);

  const bowsCount = kt.count(bowyer.equipmentForSale, (it) => it.weaponCategory === WeaponCategory.BOW || it.weaponType === 'yay');
  const arrowsCount = kt.count(bowyer.equipmentForSale, (it) => it.accessoryCategory === AccessoryCategory.ARROW || it.weaponType === 'ok');
  expect(bowsCount).toBe(50);
  expect(arrowsCount).toBe(50);
});

test('testDualHandBowAndArrowAutoSwitching', async () => {
  const StarterContent = await starterContent();
  const GameRepository = await gameRepository();
  const repository = new GameRepository();
  const bows = TashisarBowyerEquipmentData.createBows();
  const arrows = TashisarBowyerEquipmentData.createArrows();

  const testBow = kt.first(bows);
  const testArrow = kt.first(arrows);
  const testShield = StarterContent.woodenBuckler;
  const testSword = StarterContent.crackedClub;

  // 1. Oyuncunun eline kılıç ve kalkan tak
  repository.equipItem(testSword);
  repository.equipItem(testShield);
  expect(repository.player.value.equipped[EquipmentSlot.SHIELD]?.id).toBe(testShield.id);

  // 2. Oyuncunun çantasına yay ve ok ekle
  repository.addItemToInventory(testBow);
  repository.addItemToInventory(testArrow);

  // 3. Eline yayı kuşan!
  repository.equipItem(testBow);

  // Ana elde yay kuşanılmış olmalı
  expect(repository.player.value.equipped[EquipmentSlot.WEAPON]?.id).toBe(testBow.id);
  // İkincil elde kalkan yerine çantadaki ok kuşanılmış olmalı
  expect(repository.player.value.equipped[EquipmentSlot.SHIELD]?.id).toBe(testArrow.id);
  // Kalkan çantaya geri dönmüş olmalı
  expect(repository.player.value.inventory.some((it) => it.id === testShield.id)).toBe(true);

  // 4. Şimdi tekrar kılıç kuşan!
  repository.equipItem(testSword);
  // Kılıç takıldığında ikincil eldeki ok çantaya alınmalı ve kalkan otomatik kuşanılmalı
  expect(repository.player.value.equipped[EquipmentSlot.WEAPON]?.id).toBe(testSword.id); // Ana elde kılıç kuşanılmış olmalı
  expect(repository.player.value.equipped[EquipmentSlot.SHIELD]?.id).toBe(testShield.id); // İkincil elde kalkan kuşanılmış olmalı
  expect(repository.player.value.inventory.some((it) => it.id === testArrow.id)).toBe(true); // Ok çantaya geri dönmüş olmalı
});
