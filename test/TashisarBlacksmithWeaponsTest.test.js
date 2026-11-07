import { test, expect } from 'bun:test';
import * as kt from '../src/kt.js';
import { StarterContent } from '../src/data/StarterContent.js';
import { TashisarBlacksmithEquipmentData } from '../src/data/TashisarBlacksmithEquipmentData.js';
import { TashisarBlacksmithWeaponsData } from '../src/data/TashisarBlacksmithWeaponsData.js';
import { AccessoryCategory, ArmorCategory, EquipmentSlot, NpcRole, WeaponCategory } from '../src/domain/model.js';

function ortakDogrula(eq) {
  expect(eq.requiredLevel >= 20 && eq.requiredLevel <= 39).toBe(true); // seviyesi 20-39 arasında olmalıdır
  expect(eq.valueInGold >= 500 && eq.valueInGold <= 12000).toBe(true); // fiyatı 500-12000 arasında olmalıdır
  expect(eq.specialTrait).not.toBeNull(); // özel niteliği olmalıdır
  expect(eq.specialTrait).not.toBeUndefined();
  expect(kt.isNotBlank(eq.specialTrait.name)).toBe(true); // nitelik adı dolu olmalıdır
  expect(kt.isNotBlank(eq.specialTrait.description)).toBe(true); // nitelik açıklaması dolu olmalıdır
  expect(kt.isNotBlank(eq.specialTrait.icon)).toBe(true); // nitelik ikonu dolu olmalıdır
  expect(eq.maxSockets >= 1 && eq.maxSockets <= 3).toBe(true); // soket sayısı 1-3 olmalıdır
  expect(eq.unlockedSockets >= 1).toBe(true); // açık soket sayısı >= 1 olmalıdır
}

test('testTashisarBlacksmithEquipment250CompleteVerification', () => {
  const swords = TashisarBlacksmithEquipmentData.createSwords();
  const axes = TashisarBlacksmithEquipmentData.createAxes();
  const maces = TashisarBlacksmithEquipmentData.createMaces();
  const shields = TashisarBlacksmithEquipmentData.createShields();
  const helmets = TashisarBlacksmithEquipmentData.createHelmets();
  const allEquipment = TashisarBlacksmithEquipmentData.createAllBlacksmithEquipment();

  // 1. Kategori adetleri tam olarak 50'şer olmalıdır
  expect(swords.length).toBe(50); // Demircide tam 50 adet Kılıç olmalıdır
  expect(axes.length).toBe(50); // Demircide tam 50 adet Balta olmalıdır
  expect(maces.length).toBe(50); // Demircide tam 50 adet Gürz olmalıdır
  expect(shields.length).toBe(50); // Demircide tam 50 adet Kalkan olmalıdır
  expect(helmets.length).toBe(50); // Demircide tam 50 adet Miğfer olmalıdır
  expect(allEquipment.length).toBe(250); // Demircide toplam 250 adet ekipman olmalıdır

  // 2. Tüm 250 ekipmanın ID'si kesinlikle benzersiz olmalıdır
  const allIds = new Set(allEquipment.map((it) => it.id));
  expect(allIds.size).toBe(250);

  // 3. Tüm özel nitelik (specialTrait) ID'leri benzersiz olmalıdır
  const traitIds = new Set(kt.mapNotNull(allEquipment, (it) => it.specialTrait?.id));
  expect(traitIds.size).toBe(250);

  // 4. Kılıçlar doğrulama
  swords.forEach((eq) => {
    expect(eq.slot).toBe(EquipmentSlot.WEAPON); // Kılıç slotu WEAPON olmalıdır
    expect(eq.weaponCategory).toBe(WeaponCategory.SWORD); // Kılıç kategorisi SWORD olmalıdır
    ortakDogrula(eq);
  });

  // 5. Baltalar doğrulama
  axes.forEach((eq) => {
    expect(eq.slot).toBe(EquipmentSlot.WEAPON); // Balta slotu WEAPON olmalıdır
    expect(eq.weaponCategory).toBe(WeaponCategory.AXE); // Balta kategorisi AXE olmalıdır
    ortakDogrula(eq);
  });

  // 6. Gürzler doğrulama
  maces.forEach((eq) => {
    expect(eq.slot).toBe(EquipmentSlot.WEAPON); // Gürz slotu WEAPON olmalıdır
    expect(eq.weaponCategory).toBe(WeaponCategory.MACE); // Gürz kategorisi MACE olmalıdır
    ortakDogrula(eq);
  });

  // 7. Kalkanlar doğrulama
  shields.forEach((eq) => {
    expect(eq.slot).toBe(EquipmentSlot.SHIELD); // Kalkan slotu SHIELD olmalıdır
    expect(eq.accessoryCategory).toBe(AccessoryCategory.SHIELD); // Kalkan aksesuar kategorisi SHIELD olmalıdır
    ortakDogrula(eq);
  });

  // 8. Miğferler doğrulama
  helmets.forEach((eq) => {
    expect(eq.slot).toBe(EquipmentSlot.HEAD); // Miğfer slotu HEAD olmalıdır
    expect(eq.armorCategory).toBe(ArmorCategory.HELMET); // Miğfer zırh kategorisi HELMET olmalıdır
    ortakDogrula(eq);
  });

  // 9. StarterContent ve Demirci (Torvald) Mağaza Kontrolü
  const region2 = StarterContent.createRegion2();
  const blacksmith = kt.firstOrNull(region2.npcs, (it) => it.role === NpcRole.BLACKSMITH);
  expect(blacksmith).not.toBeNull(); // Taş Hisar'da BLACKSMITH bulunmalıdır
  expect(blacksmith.equipmentForSale.length).toBe(250); // Torvald'ın mağazasında 250 ekipman bulunmalıdır

  // 10. Mağaza kategori filtreleme doğrulaması
  const shopSwords = blacksmith.equipmentForSale.filter((it) => it.weaponCategory === WeaponCategory.SWORD);
  const shopAxes = blacksmith.equipmentForSale.filter((it) => it.weaponCategory === WeaponCategory.AXE);
  const shopMaces = blacksmith.equipmentForSale.filter((it) => it.weaponCategory === WeaponCategory.MACE);
  const shopShields = blacksmith.equipmentForSale.filter((it) => it.slot === EquipmentSlot.SHIELD || it.accessoryCategory === AccessoryCategory.SHIELD);
  const shopHelmets = blacksmith.equipmentForSale.filter((it) => it.armorCategory === ArmorCategory.HELMET || it.slot === EquipmentSlot.HEAD);

  expect(shopSwords.length).toBe(50); // Mağazada tam 50 kılıç filtrelenebilmelidir
  expect(shopAxes.length).toBe(50); // Mağazada tam 50 balta filtrelenebilmelidir
  expect(shopMaces.length).toBe(50); // Mağazada tam 50 gürz filtrelenebilmelidir
  expect(shopShields.length).toBe(50); // Mağazada tam 50 kalkan filtrelenebilmelidir
  expect(shopHelmets.length).toBe(50); // Mağazada tam 50 miğfer filtrelenebilmelidir

  // 11. Legacy mızrak ve baltalar da korunmuş olmalıdır
  const legacyWeapons = TashisarBlacksmithWeaponsData.createLegacySpearsAndAxes();
  expect(legacyWeapons.length).toBe(25); // Legacy mızrak ve balta sayısı 25 olmalıdır
  expect(legacyWeapons.some((it) => it.id === 'eq_tash_axe_39')).toBe(true);
  expect(legacyWeapons.some((it) => it.id === 'eq_tash_spear_20')).toBe(true);
});
