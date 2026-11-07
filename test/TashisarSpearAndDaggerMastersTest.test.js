import { test, expect } from 'bun:test';
import * as kt from '../src/kt.js';
import { StarterContent } from '../src/data/StarterContent.js';
import { TashisarBlacksmithSpearsAndDaggersData } from '../src/data/TashisarBlacksmithSpearsAndDaggersData.js';
import { EquipmentSlot, NpcRole, WeaponCategory } from '../src/domain/model.js';

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

test('testSpearMasterValeriusEquipmentAndShop', () => {
  const spears = TashisarBlacksmithSpearsAndDaggersData.createSpears();

  // 1. Toplam 50 mızrak olmalıdır
  expect(spears.length).toBe(50); // Mızrak ustasında tam 50 adet mızrak & kargı olmalıdır

  // 2. ID'ler benzersiz olmalıdır
  const ids = new Set(spears.map((it) => it.id));
  expect(ids.size).toBe(50);

  // 3. Özel nitelikler benzersiz ve dolu olmalıdır
  const traitIds = new Set(kt.mapNotNull(spears, (it) => it.specialTrait?.id));
  expect(traitIds.size).toBe(50);

  // 4. Detaylı eşya doğrulaması
  spears.forEach((eq) => {
    expect(eq.slot).toBe(EquipmentSlot.WEAPON); // Mızrak slotu WEAPON olmalıdır
    expect(eq.weaponCategory).toBe(WeaponCategory.SPEAR); // Mızrak kategorisi SPEAR olmalıdır
    ortakDogrula(eq);
  });

  // 5. Taş Hisar'da Kargıcı Valerius (SPEAR_MASTER) NPC doğrulaması
  const region2 = StarterContent.createRegion2();
  const valerius = kt.firstOrNull(region2.npcs, (it) => it.role === NpcRole.SPEAR_MASTER);
  expect(valerius).not.toBeNull(); // Taş Hisar'da SPEAR_MASTER bulunmalıdır
  expect(valerius.id).toBe('npc_valerius');
  expect(valerius.name).toBe('Kargıcı Valerius');
  expect(valerius.equipmentForSale.length).toBe(50);

  // 6. Mağaza sekmeleri filtreleme doğrulaması
  const spearOnly = valerius.equipmentForSale.filter((it) => ['mızrak', 'zıpkın', 'üç dişli'].includes(it.weaponType));
  const lanceOnly = valerius.equipmentForSale.filter((it) => ['kargı', 'teber'].includes(it.weaponType));
  expect(spearOnly.length).toBe(21);
  expect(lanceOnly.length).toBe(29);
  expect(spearOnly.length + lanceOnly.length).toBe(50);
});

test('testDaggerMasterCorvusEquipmentAndShop', () => {
  const daggers = TashisarBlacksmithSpearsAndDaggersData.createDaggers();

  // 1. Toplam 50 hançer olmalıdır
  expect(daggers.length).toBe(50); // Hançer ustasında tam 50 adet hançer & kama olmalıdır

  // 2. ID'ler benzersiz olmalıdır
  const ids = new Set(daggers.map((it) => it.id));
  expect(ids.size).toBe(50);

  // 3. Özel nitelikler benzersiz ve dolu olmalıdır
  const traitIds = new Set(kt.mapNotNull(daggers, (it) => it.specialTrait?.id));
  expect(traitIds.size).toBe(50);

  // 4. Detaylı eşya doğrulaması
  daggers.forEach((eq) => {
    expect(eq.slot).toBe(EquipmentSlot.WEAPON); // Hançer slotu WEAPON olmalıdır
    expect(eq.weaponCategory).toBe(WeaponCategory.DAGGER); // Hançer kategorisi DAGGER olmalıdır
    ortakDogrula(eq);
  });

  // 5. Taş Hisar'da Gölge Silahçısı Corvus (DAGGER_MASTER) NPC doğrulaması
  const region2 = StarterContent.createRegion2();
  const corvus = kt.firstOrNull(region2.npcs, (it) => it.role === NpcRole.DAGGER_MASTER);
  expect(corvus).not.toBeNull(); // Taş Hisar'da DAGGER_MASTER bulunmalıdır
  expect(corvus.id).toBe('npc_corvus');
  expect(corvus.name).toBe('Gölge Silahçısı Corvus');
  expect(corvus.equipmentForSale.length).toBe(50);

  // 6. Mağaza sekmeleri filtreleme doğrulaması
  const daggerOnly = corvus.equipmentForSale.filter((it) => ['hançer', 'çift bıçak', 'sustalı'].includes(it.weaponType));
  const kamaOnly = corvus.equipmentForSale.filter((it) => ['kama', 'stiletto', 'pala bıçak'].includes(it.weaponType));
  expect(daggerOnly.length).toBe(30);
  expect(kamaOnly.length).toBe(20);
  expect(daggerOnly.length + kamaOnly.length).toBe(50);
});
