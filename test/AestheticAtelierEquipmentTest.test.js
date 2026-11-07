// Kotlin kaynağı: test/AestheticAtelierEquipmentTest.kt
import { test, expect } from 'bun:test';
import { AestheticAtelierEquipmentData } from '../src/data/AestheticAtelierEquipmentData.js';
import { StarterContent } from '../src/data/StarterContent.js';
import { EquipmentSlot, NpcRole, UnarmedShowType } from '../src/domain/model.js';

// CharacterRegistryData başka bir ajanın dosyası; yalnız onu gerektiren testte yüklenir.
const characterRegistryData = async () => (await import('../src/data/CharacterRegistryData.js')).CharacterRegistryData;

test('testAestheticAtelierEquipmentCounts', () => {
  const headwear = AestheticAtelierEquipmentData.createAestheticHeadwear();
  const tops = AestheticAtelierEquipmentData.createAestheticTops();
  const bottoms = AestheticAtelierEquipmentData.createAestheticBottoms();
  const footwear = AestheticAtelierEquipmentData.createAestheticFootwear();
  const gloves = AestheticAtelierEquipmentData.createAestheticGlovesAndBracers();
  const all = AestheticAtelierEquipmentData.getAllAestheticEquipment();

  expect(headwear.length).toBe(50); // 50 adet Başlık/Şapka olmalıdır
  expect(tops.length).toBe(50); // 50 adet Üst Kıyafet olmalıdır
  expect(bottoms.length).toBe(50); // 50 adet Pantolon/Etek olmalıdır
  expect(footwear.length).toBe(50); // 50 adet Ayakkabı/Çizme olmalıdır
  expect(gloves.length).toBe(50); // 50 adet Eldiven/Bileklik olmalıdır
  expect(all.length).toBe(250); // Toplamda 250 adet estetik teçhizat olmalıdır

  // Slot kontrolleri
  expect(headwear.every((it) => it.slot === EquipmentSlot.HEAD)).toBe(true); // Tüm başlıklar HEAD slotunda olmalıdır
  expect(tops.every((it) => it.slot === EquipmentSlot.CHEST)).toBe(true); // Tüm üstlükler CHEST slotunda olmalıdır
  expect(bottoms.every((it) => it.slot === EquipmentSlot.PANTS)).toBe(true); // Tüm altlıklar PANTS slotunda olmalıdır
  expect(footwear.every((it) => it.slot === EquipmentSlot.BOOTS)).toBe(true); // Tüm pabuçlar BOOTS slotunda olmalıdır
  expect(gloves.every((it) => it.slot === EquipmentSlot.GLOVES)).toBe(true); // Tüm eldivenler GLOVES slotunda olmalıdır

  // isAestheticUnarmed bayrak kontrolü
  expect(all.every((it) => it.isAestheticUnarmed)).toBe(true); // Tüm eşyalarda isAestheticUnarmed == true olmalıdır

  // Benzersiz ID kontrolü
  const uniqueIds = new Set(all.map((it) => it.id));
  expect(uniqueIds.size).toBe(250); // Tüm 250 eşyanın ID'si benzersiz olmalıdır
});

test('testMirzaNizarCharacterProfile', async () => {
  const CharacterRegistryData = await characterRegistryData();
  const profiles = CharacterRegistryData.getAllProfiles();
  const nizar = profiles.find((it) => it.id === 'npc_mirza_nizar') ?? null;

  expect(nizar).not.toBeNull(); // Mirza Nizar karakter profili kayıtlı olmalıdır
  expect(nizar?.name).toBe('Mirza Nizar');
  expect(nizar?.backgroundLore?.includes('Güney Krallıkları') === true).toBe(true); // Güney Krallıkları menşei lore metninde yer almalıdır
  expect(nizar?.backgroundLore?.includes('Estetik ve Silahsız Dövüş') === true).toBe(true); // Silahsız/estetik dövüş felsefesi belirtilmelidir
  expect(nizar.isGladiator).toBe(false); // Nizar gladyatör olmamalıdır
});

test('testMirzaNizarInMarketplaces', () => {
  const region1 = StarterContent.createInitialRegion();
  const region2 = StarterContent.createRegion2();

  const nizarInR1 = region1.npcs.find((it) => it.role === NpcRole.AESTHETIC_ATELIER) ?? null;
  const nizarInR2 = region2.npcs.find((it) => it.role === NpcRole.AESTHETIC_ATELIER) ?? null;

  expect(nizarInR1).toBeNull(); // Mirza Nizar 1. Bölge pazarında OLMAMALIDIR (yalnızca 2. Bölge Taş Hisar'da açık olmalıdır)
  expect(nizarInR2).not.toBeNull(); // Mirza Nizar 2. Bölge pazarında olmalıdır

  expect(nizarInR2?.equipmentForSale?.length).toBe(250); // Mirza Nizar 2. bölge dükkanında 250 adet teçhizat satışta olmalıdır
});

test('testAestheticDuelShowType', () => {
  const duelType = UnarmedShowType.AESTHETIC_DUEL;
  expect(duelType).not.toBeNull();
  expect(duelType).toBeDefined();
  expect(duelType.title).toBe('Zarafet & Estetik Düellosu');
});
