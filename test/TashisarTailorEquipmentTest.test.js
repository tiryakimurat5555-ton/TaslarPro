// Kotlin kaynağı: test/TashisarTailorEquipmentTest.kt
import { test, expect } from 'bun:test';
import { TashisarTailorEquipmentData } from '../src/data/TashisarTailorEquipmentData.js';
import { ArmorCategory, EquipmentSlot, ItemRarity, NpcRole, Player } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

// StarterContent başka bir ajanın dosyası; yalnız onu gerektiren testte yüklenir.
const starterContent = async () => (await import('../src/data/StarterContent.js')).StarterContent;

test('testLightArmorsCountAndIntegrity', () => {
  const lightArmors = TashisarTailorEquipmentData.createExoticLightArmors();
  expect(lightArmors.length).toBe(50); // Tam olarak 50 adet hafif zırh bulunmalıdır

  lightArmors.forEach((armor) => {
    expect(armor.slot).toBe(EquipmentSlot.CHEST); // Tüm hafif zırhlar CHEST yuvasında olmalıdır
    expect(armor.armorCategory).toBe(ArmorCategory.LIGHT_ARMOR); // Kategori LIGHT_ARMOR olmalıdır
    expect(armor.requiredLevel >= 20 && armor.requiredLevel <= 39).toBe(true); // Seviye 20 ile 39 arasında olmalıdır
    expect(armor.valueInGold >= 500 && armor.valueInGold <= 12000).toBe(true); // Fiyat 500 ile 12.000 altın arasında olmalıdır
    expect(armor.specialTrait).not.toBeNull(); // Her zırhın özel niteliği olmalıdır
    expect(armor.maxSockets >= 1).toBe(true); // Her zırh en az 1 sokete sahip olmalıdır
    expect(armor.unlockedSockets >= 1).toBe(true); // Her zırhın açık soketi olmalıdır
    expect([ItemRarity.USTAISI, ItemRarity.NADIDE, ItemRarity.KADIM].includes(armor.rarity)).toBe(true); // Enderlik Usta İşi, Nadide veya Kadim olmalıdır
  });
});

test('testRobesCountAndIntegrity', () => {
  const robes = TashisarTailorEquipmentData.createExoticRobes();
  expect(robes.length).toBe(50); // Tam olarak 50 adet cübbe & kaftan bulunmalıdır

  robes.forEach((robe) => {
    expect(robe.slot).toBe(EquipmentSlot.CHEST); // Tüm cübbeler CHEST yuvasında olmalıdır
    expect(robe.armorCategory).toBe(ArmorCategory.ROBE); // Kategori ROBE olmalıdır
    expect(robe.requiredLevel >= 20 && robe.requiredLevel <= 39).toBe(true); // Seviye 20 ile 39 arasında olmalıdır
    expect(robe.valueInGold >= 500 && robe.valueInGold <= 12000).toBe(true); // Fiyat 500 ile 12.000 altın arasında olmalıdır
    expect(robe.specialTrait).not.toBeNull(); // Her cübbenin özel niteliği olmalıdır
    expect(robe.maxSockets >= 1).toBe(true); // Her cübbe en az 1 sokete sahip olmalıdır
    expect(robe.unlockedSockets >= 1).toBe(true); // Her cübbenin açık soketi olmalıdır
    expect([ItemRarity.USTAISI, ItemRarity.NADIDE, ItemRarity.KADIM].includes(robe.rarity)).toBe(true); // Enderlik Usta İşi, Nadide veya Kadim olmalıdır
  });
});

test('testClothHeadgearCountAndIntegrity', () => {
  const headgear = TashisarTailorEquipmentData.createExoticClothHeadgear();
  expect(headgear.length).toBe(50); // Tam olarak 50 adet kumaş başlık & peçe bulunmalıdır

  headgear.forEach((hood) => {
    expect(hood.slot).toBe(EquipmentSlot.HEAD); // Tüm başlıklar HEAD yuvasında olmalıdır
    expect(hood.armorCategory).toBe(ArmorCategory.ASSASSIN_HOOD); // Kategori ASSASSIN_HOOD olmalıdır
    expect(hood.requiredLevel >= 20 && hood.requiredLevel <= 39).toBe(true); // Seviye 20 ile 39 arasında olmalıdır
    expect(hood.valueInGold >= 500 && hood.valueInGold <= 12000).toBe(true); // Fiyat 500 ile 12.000 altın arasında olmalıdır
    expect(hood.specialTrait).not.toBeNull(); // Her başlığın özel niteliği olmalıdır
    expect(hood.maxSockets >= 1).toBe(true); // Her başlık en az 1 sokete sahip olmalıdır
    expect(hood.unlockedSockets >= 1).toBe(true); // Her başlığın açık soketi olmalıdır
    expect([ItemRarity.USTAISI, ItemRarity.NADIDE, ItemRarity.KADIM].includes(hood.rarity)).toBe(true); // Enderlik Usta İşi, Nadide veya Kadim olmalıdır
  });
});

test('testUniqueIdsAcrossAllTailorItems', () => {
  const allItems = TashisarTailorEquipmentData.createAllTailorEquipment();
  expect(allItems.length).toBe(150); // Toplam 150 adet terzi ekipmanı olmalıdır

  const uniqueIds = new Set(allItems.map((it) => it.id));
  expect(uniqueIds.size).toBe(150); // Tüm terzi ekipmanlarının ID'leri benzersiz olmalıdır

  const uniqueTraits = new Set(kt.mapNotNull(allItems, (it) => it.specialTrait?.id));
  expect(uniqueTraits.size).toBe(150); // Tüm terzi ekipmanlarının nitelik ID'leri benzersiz olmalıdır
});

test('testRegion2TailorLeylaRegistration', async () => {
  const StarterContent = await starterContent();
  const region2 = StarterContent.createRegion2();
  const leyla = kt.firstOrNull(region2.npcs, (it) => it.id === 'npc_tailor');

  expect(leyla).not.toBeNull(); // Taş Hisar'da Terzi Leyla bulunmalıdır
  expect(leyla.role).toBe(NpcRole.TAILOR); // Leyla'nın rolü TAILOR olmalıdır
  expect(leyla.equipmentForSale.length).toBe(150); // Leyla 150 adet ekipman satmalıdır (50 hafif zırh + 50 cübbe + 50 başlık)

  const lightArmors = leyla.equipmentForSale.filter((it) => it.armorCategory === ArmorCategory.LIGHT_ARMOR);
  const robes = leyla.equipmentForSale.filter((it) => it.armorCategory === ArmorCategory.ROBE);
  const hoods = leyla.equipmentForSale.filter((it) => it.armorCategory === ArmorCategory.ASSASSIN_HOOD);

  expect(lightArmors.length).toBe(50); // Dükkanda 50 adet hafif zırh bulunmalıdır
  expect(robes.length).toBe(50); // Dükkanda 50 adet cübbe bulunmalıdır
  expect(hoods.length).toBe(50); // Dükkanda 50 adet kumaş başlık bulunmalıdır
});

test('testPlayerEquippingTailorGearBoostsStatsCorrectly', () => {
  const initialPlayer = new Player({ level: 25 });
  const initialStats = initialPlayer.totalStats;

  const lightArmor = kt.first(TashisarTailorEquipmentData.createExoticLightArmors(), (it) => it.id === 'eq_tash_light_20a');
  const hood = kt.first(TashisarTailorEquipmentData.createExoticClothHeadgear(), (it) => it.id === 'eq_tash_hood_20a');

  const equippedPlayer = initialPlayer.copy({
    equipped: { ...initialPlayer.equipped, [EquipmentSlot.CHEST]: lightArmor, [EquipmentSlot.HEAD]: hood },
  });

  const newStats = equippedPlayer.totalStats;
  // Zırh kuşanıldığında armor artmalıdır
  expect(newStats.armor).toBe(initialStats.armor + lightArmor.stats.armor + hood.stats.armor);
  // Zırh kuşanıldığında speed artmalıdır
  expect(newStats.speed).toBe(initialStats.speed + lightArmor.stats.speed + hood.stats.speed);
  // Zırh kuşanıldığında sıyrılma artmalıdır
  expect(newStats.dodgeChancePercent).toBe(initialStats.dodgeChancePercent + lightArmor.stats.dodgeChancePercent + hood.stats.dodgeChancePercent);
});
