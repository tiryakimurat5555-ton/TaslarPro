// Kotlin kaynağı: test/TashisarRingAndSealTest.kt
import { test, expect } from 'bun:test';
import { TashisarRingAndSealData } from '../src/data/TashisarRingAndSealData.js';
import { AccessoryCategory, EquipmentSlot, ItemRarity, NpcRole, Player } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

// StarterContent başka bir ajanın dosyası; yalnız onu gerektiren testte yüklenir.
const starterContent = async () => (await import('../src/data/StarterContent.js')).StarterContent;

test('testRingsCountAndIntegrity', () => {
  const rings = TashisarRingAndSealData.createExoticRings();
  expect(rings.length).toBe(50); // Tam olarak 50 adet yüzük bulunmalıdır

  rings.forEach((ring) => {
    expect(ring.slot).toBe(EquipmentSlot.RING); // Tüm yüzükler RING yuvasında olmalıdır
    expect(ring.accessoryCategory).toBe(AccessoryCategory.RING); // Tüm yüzüklerin kategorisi RING olmalıdır
    expect(ring.requiredLevel >= 20 && ring.requiredLevel <= 39).toBe(true); // Seviye 20 ile 39 arasında olmalıdır
    expect(ring.valueInGold >= 500 && ring.valueInGold <= 12000).toBe(true); // Fiyat 500 ile 12.000 altın arasında olmalıdır
    expect(ring.specialTrait).not.toBeNull(); // Her yüzüğün özel bir niteliği (specialTrait) olmalıdır
    expect(ring.maxSockets >= 1).toBe(true); // Her yüzük en az 1 sokete sahip olmalıdır
    expect(ring.unlockedSockets >= 1).toBe(true); // Her yüzüğün açık soketi olmalıdır
    expect([ItemRarity.USTAISI, ItemRarity.NADIDE, ItemRarity.KADIM].includes(ring.rarity)).toBe(true); // Enderlik Usta İşi, Nadide veya Kadim olmalıdır
  });
});

test('testSealsCountAndIntegrity', () => {
  const seals = TashisarRingAndSealData.createExoticSeals();
  expect(seals.length).toBe(50); // Tam olarak 50 adet mühür & tılsım bulunmalıdır

  seals.forEach((seal) => {
    expect(seal.slot).toBe(EquipmentSlot.TALISMAN); // Tüm mühürler TALISMAN yuvasında olmalıdır
    expect(seal.accessoryCategory).toBe(AccessoryCategory.TALISMAN); // Tüm mühürlerin kategorisi TALISMAN olmalıdır
    expect(seal.requiredLevel >= 20 && seal.requiredLevel <= 39).toBe(true); // Seviye 20 ile 39 arasında olmalıdır
    expect(seal.valueInGold >= 500 && seal.valueInGold <= 12000).toBe(true); // Fiyat 500 ile 12.000 altın arasında olmalıdır
    expect(seal.specialTrait).not.toBeNull(); // Her mührün özel bir niteliği (specialTrait) olmalıdır
    expect(seal.maxSockets >= 1).toBe(true); // Her mühür en az 1 sokete sahip olmalıdır
    expect(seal.unlockedSockets >= 1).toBe(true); // Her mührün açık soketi olmalıdır
    expect([ItemRarity.USTAISI, ItemRarity.NADIDE, ItemRarity.KADIM].includes(seal.rarity)).toBe(true); // Enderlik Usta İşi, Nadide veya Kadim olmalıdır
  });
});

test('testUniqueIdsAcrossAllAccessories', () => {
  const allAccessories = TashisarRingAndSealData.createExoticRingsAndSeals();
  expect(allAccessories.length).toBe(100); // Toplam 100 adet takı olmalıdır

  const uniqueIds = new Set(allAccessories.map((it) => it.id));
  expect(uniqueIds.size).toBe(100); // Tüm takıların ID'leri benzersiz olmalıdır

  const uniqueTraits = new Set(kt.mapNotNull(allAccessories, (it) => it.specialTrait?.id));
  expect(uniqueTraits.size).toBe(100); // Tüm takıların nitelik ID'leri benzersiz olmalıdır
});

test('testRegion2OrestesRingmakerRegistration', async () => {
  const StarterContent = await starterContent();
  const region2 = StarterContent.createRegion2();
  const orestes = kt.firstOrNull(region2.npcs, (it) => it.id === 'npc_ringmaker');

  expect(orestes).not.toBeNull(); // Taş Hisar'da Yüzükçü & Mühürdar Orestes bulunmalıdır
  expect(orestes.role).toBe(NpcRole.RING_MAKER); // Orestes'in rolü RING_MAKER olmalıdır
  expect(orestes.equipmentForSale.length).toBe(100); // Orestes 100 adet takı satmalıdır (50 yüzük + 50 mühür)

  const ringsForSale = orestes.equipmentForSale.filter((it) => it.slot === EquipmentSlot.RING);
  const sealsForSale = orestes.equipmentForSale.filter((it) => it.slot === EquipmentSlot.TALISMAN);

  expect(ringsForSale.length).toBe(50); // Dükkanda 50 adet yüzük sergilenmelidir
  expect(sealsForSale.length).toBe(50); // Dükkanda 50 adet mühür sergilenmelidir
});

test('testPlayerEquippingRingAndSealBoostsStatsCorrectly', () => {
  const initialPlayer = new Player({ level: 25 });
  const initialStats = initialPlayer.totalStats;

  const ring = kt.first(TashisarRingAndSealData.createExoticRings(), (it) => it.id === 'eq_tash_ring_20a');
  const seal = kt.first(TashisarRingAndSealData.createExoticSeals(), (it) => it.id === 'eq_tash_seal_20a');

  const equippedPlayer = initialPlayer.copy({
    equipped: { ...initialPlayer.equipped, [EquipmentSlot.RING]: ring, [EquipmentSlot.TALISMAN]: seal },
  });

  const newStats = equippedPlayer.totalStats;
  // Yüzük ve mühür kuşanıldığında hasar artmalıdır
  expect(newStats.damage).toBe(initialStats.damage + ring.stats.damage + seal.stats.damage);
  // Yüzük ve mühür kuşanıldığında zırh artmalıdır
  expect(newStats.armor).toBe(initialStats.armor + ring.stats.armor + seal.stats.armor);
  // Yüzük ve mühür kuşanıldığında maksimum can artmalıdır
  expect(newStats.maxHealth).toBe(initialStats.maxHealth + ring.stats.maxHealth + seal.stats.maxHealth);
  // Yüzük kuşanıldığında kritik şansı artmalıdır
  expect(newStats.critChancePercent).toBe(initialStats.critChancePercent + ring.stats.critChancePercent);
});
