import { test, expect } from 'bun:test';
import * as kt from '../src/kt.js';
import { StarterContent } from '../src/data/StarterContent.js';
import { TashisarArmorerEquipmentData } from '../src/data/TashisarArmorerEquipmentData.js';
import { ArmorCategory, EquipmentSlot, NpcRole } from '../src/domain/model.js';

test('testTashisarArmorerEquipment100CompleteVerification', () => {
  const heavyArmors = TashisarArmorerEquipmentData.createHeavyArmors();
  const boots = TashisarArmorerEquipmentData.createBoots();
  const allEquipment = TashisarArmorerEquipmentData.createAllArmorerEquipment();

  // 1. Kategori adetleri tam 50'şer olmalıdır
  expect(heavyArmors.length).toBe(50); // Zırhçıda tam 50 adet Ağır Zırh olmalıdır
  expect(boots.length).toBe(50); // Zırhçıda tam 50 adet Savaş Çizmesi & Ayakkabı olmalıdır
  expect(allEquipment.length).toBe(100); // Zırhçıda toplam 100 adet ekipman olmalıdır

  // 2. Tüm 100 ekipmanın ID'si kesinlikle benzersiz olmalıdır
  const allIds = new Set(allEquipment.map((it) => it.id));
  expect(allIds.size).toBe(100);

  // 3. Tüm özel nitelik (specialTrait) ID'leri benzersiz olmalıdır
  const traitIds = new Set(kt.mapNotNull(allEquipment, (it) => it.specialTrait?.id));
  expect(traitIds.size).toBe(100);

  // 4. Ağır Zırhlar doğrulama
  heavyArmors.forEach((eq) => {
    expect(eq.slot).toBe(EquipmentSlot.CHEST); // Ağır zırh slotu CHEST olmalıdır
    expect(eq.armorCategory).toBe(ArmorCategory.HEAVY_ARMOR); // Ağır zırh kategorisi HEAVY_ARMOR olmalıdır
    expect(eq.requiredLevel >= 20 && eq.requiredLevel <= 39).toBe(true); // Ağır zırh seviyesi 20-39 arasında olmalıdır
    expect(eq.valueInGold >= 500 && eq.valueInGold <= 12000).toBe(true); // Ağır zırh fiyatı 500-12000 arasında olmalıdır
    expect(eq.specialTrait).not.toBeNull(); // Ağır zırhın özel niteliği olmalıdır
    expect(eq.specialTrait).not.toBeUndefined();
    expect(kt.isNotBlank(eq.specialTrait.name)).toBe(true); // Özel nitelik adı dolu olmalıdır
    expect(kt.isNotBlank(eq.specialTrait.description)).toBe(true); // Özel nitelik açıklaması dolu olmalıdır
    expect(kt.isNotBlank(eq.specialTrait.icon)).toBe(true); // Özel nitelik ikonu dolu olmalıdır
    expect(eq.maxSockets >= 1 && eq.maxSockets <= 3).toBe(true); // Ağır zırh soket sayısı 1-3 olmalıdır
    expect(eq.unlockedSockets >= 1).toBe(true); // Ağır zırh açık soket sayısı >= 1 olmalıdır
  });

  // 5. Çizmeler ve Ayakkabılar doğrulama
  boots.forEach((eq) => {
    expect(eq.slot).toBe(EquipmentSlot.BOOTS); // Çizme slotu BOOTS olmalıdır
    expect(eq.armorCategory).toBe(ArmorCategory.BOOTS); // Çizme kategorisi BOOTS olmalıdır
    expect(eq.requiredLevel >= 20 && eq.requiredLevel <= 39).toBe(true); // Çizme seviyesi 20-39 arasında olmalıdır
    expect(eq.valueInGold >= 500 && eq.valueInGold <= 12000).toBe(true); // Çizme fiyatı 500-12000 arasında olmalıdır
    expect(eq.specialTrait).not.toBeNull(); // Çizmenin özel niteliği olmalıdır
    expect(eq.specialTrait).not.toBeUndefined();
    expect(kt.isNotBlank(eq.specialTrait.name)).toBe(true); // Özel nitelik adı dolu olmalıdır
    expect(kt.isNotBlank(eq.specialTrait.description)).toBe(true); // Özel nitelik açıklaması dolu olmalıdır
    expect(kt.isNotBlank(eq.specialTrait.icon)).toBe(true); // Özel nitelik ikonu dolu olmalıdır
    expect(eq.maxSockets >= 1 && eq.maxSockets <= 3).toBe(true); // Çizme soket sayısı 1-3 olmalıdır
    expect(eq.unlockedSockets >= 1).toBe(true); // Çizme açık soket sayısı >= 1 olmalıdır
  });

  // 6. StarterContent ve Zırhçı Ulfric Mağaza Kontrolü
  const region2 = StarterContent.createRegion2();
  const armorer = kt.firstOrNull(region2.npcs, (it) => it.role === NpcRole.ARMORER);
  expect(armorer).not.toBeNull(); // Taş Hisar'da ARMORER (Zırhçı Ulfric) bulunmalıdır
  expect(armorer.equipmentForSale.length).toBe(100); // Ulfric'in mağazasında tam 100 ekipman bulunmalıdır

  // 7. Mağaza kategori filtreleme doğrulaması
  const shopHeavyArmors = armorer.equipmentForSale.filter((it) => it.armorCategory === ArmorCategory.HEAVY_ARMOR);
  const shopBoots = armorer.equipmentForSale.filter((it) => it.armorCategory === ArmorCategory.BOOTS || it.slot === EquipmentSlot.BOOTS);

  expect(shopHeavyArmors.length).toBe(50); // Mağazada tam 50 ağır zırh filtrelenebilmelidir
  expect(shopBoots.length).toBe(50); // Mağazada tam 50 çizme & ayakkabı filtrelenebilmelidir
});
