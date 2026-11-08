// Kotlin kaynağı: test/TashisarWandMakerStavesTest.kt
import { test, expect } from 'bun:test';
import { TashisarSpellTomeData } from '../src/data/TashisarSpellTomeData.js';
import { TashisarWandMakerStavesData } from '../src/data/TashisarWandMakerStavesData.js';
import { AccessoryCategory, EquipmentSlot, NpcRole, Player, WeaponCategory } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

// StarterContent ve GameRepository başka ajanların dosyaları; yalnız onları gerektiren yerde yüklenir.
const starterContent = async () => (await import('../src/data/StarterContent.js')).StarterContent;
const gameRepository = async () => (await import('../src/data/GameRepository.js')).GameRepository;

test('testTashisarWandMakerStavesAndTomesCompleteVerification', async () => {
  const staves = TashisarWandMakerStavesData.createExoticStaves();
  const tomes = TashisarSpellTomeData.createSpellTomes();
  const allWandEquipment = TashisarWandMakerStavesData.createAllWandEquipment();

  // 1. Toplam tam 50 adet asa ve 50 adet büyü kitabı / tomar olmalıdır
  expect(staves.length).toBe(50); // Asacı Vesper'ın dükkanında tam 50 adet asa olmalıdır
  expect(tomes.length).toBe(50); // Asacı Vesper'ın dükkanında tam 50 adet büyü kitabı ve tomar olmalıdır
  expect(allWandEquipment.length).toBe(100); // Toplam büyü ekipmanı tam 100 adet olmalıdır

  // 2. Tüm ID'ler benzersiz olmalıdır
  const allIds = new Set(allWandEquipment.map((it) => it.id));
  expect(allIds.size).toBe(100); // Tüm 100 büyü eşyasının ID'si benzersiz olmalıdır

  // 3. Asaların Kontrolü
  for (const staff of staves) {
    expect(staff.slot).toBe(EquipmentSlot.WEAPON); // ${staff.name} bir silah slotunda olmalıdır
    expect(staff.weaponCategory).toBe(WeaponCategory.STAFF); // ${staff.name} STAFF kategorisinde olmalıdır
    expect(staff.requiredLevel >= 20 && staff.requiredLevel <= 39).toBe(true); // ${staff.name} seviyesi 20..39 arasında olmalıdır
    expect(staff.valueInGold >= 600 && staff.valueInGold <= 12000).toBe(true); // ${staff.name} fiyatı 600..12000 altın arasında olmalıdır
    expect(staff.specialTrait).not.toBeNull(); // ${staff.name} için specialTrait tanımlı olmalıdır
    expect(kt.isNotBlank(staff.specialTrait.name)).toBe(true); // Özellik adı dolu olmalıdır
  }

  // 4. Büyü Kitapları & Tomarların Kontrolü
  for (const tome of tomes) {
    expect(tome.slot).toBe(EquipmentSlot.SHIELD); // ${tome.name} ikincil el (SHIELD) slotunda olmalıdır
    expect(tome.accessoryCategory).toBe(AccessoryCategory.TOME); // ${tome.name} TOME aksesuar kategorisinde olmalıdır
    expect(tome.isTome).toBe(true); // ${tome.name} isTome özelliği true olmalıdır
    expect(tome.isShield).toBe(false); // ${tome.name} kalkan (isShield) sayılmamalıdır
    expect(tome.isArrow).toBe(false); // ${tome.name} ok (isArrow) sayılmamalıdır
    expect(tome.requiredLevel >= 20 && tome.requiredLevel <= 39).toBe(true); // ${tome.name} seviyesi 20..39 arasında olmalıdır
    expect(tome.valueInGold >= 500 && tome.valueInGold <= 12000).toBe(true); // ${tome.name} fiyatı 500..12000 altın arasında olmalıdır
    expect(tome.specialTrait).not.toBeNull(); // ${tome.name} için specialTrait tanımlı olmalıdır
    expect(kt.isNotBlank(tome.specialTrait.name)).toBe(true); // Özellik adı dolu olmalıdır
    expect(kt.isNotBlank(tome.specialTrait.description)).toBe(true); // Özellik açıklaması dolu olmalıdır
    // (Emojiler 8 Kasım'da kaldırıldı; ikon alanı artık boş.)
    expect(tome.maxSockets >= 2 && tome.maxSockets <= 3).toBe(true); // ${tome.name} 2 veya 3 sokete sahip olmalıdır
    expect(tome.unlockedSockets >= 1).toBe(true); // ${tome.name} en az 1 açık sokete sahip olmalıdır
  }

  // 5. Asacı Vesper'ın dükkan entegrasyonu (createRegion2)
  const StarterContent = await starterContent();
  const region2 = StarterContent.createRegion2();
  const wandMakerNpc = kt.firstOrNull(region2.npcs, (it) => it.role === NpcRole.WAND_MAKER);
  expect(wandMakerNpc).not.toBeNull(); // Taş Hisar'da Asacı Vesper (WAND_MAKER) bulunmalıdır
  expect(wandMakerNpc?.equipmentForSale?.length).toBe(100); // Asacı Vesper tam 100 eşyayı satışa sunmalıdır (50 Asa + 50 Büyü Kitabı)
  expect(wandMakerNpc?.greeting?.includes('büyü kitabı') === true).toBe(true); // Vesper'ın selamı büyü kitaplarını anmalıdır
});

test('testStaffAndTomeDualHandAutoSwitch', async () => {
  const GameRepository = await gameRepository();
  const staves = TashisarWandMakerStavesData.createExoticStaves();
  const tomes = TashisarSpellTomeData.createSpellTomes();
  const testStaff = kt.first(staves);
  const testTome = kt.first(tomes);

  const repository = new GameRepository();
  const initialPlayer = new Player();
  repository.setPlayerForTesting(initialPlayer);

  // 1. Oyuncunun çantasına Asa ve Büyü Kitabı ekle
  const pWithGear = initialPlayer.copy({
    inventory: [testStaff, testTome],
  });
  repository.setPlayerForTesting(pWithGear);

  // 2. Asayı kuşan -> Çantada tome varsa otomatik olarak ikincil ele kuşanmalı!
  repository.equipItem(testStaff);
  let updatedPlayer = repository.player.value;

  expect(updatedPlayer.equipped[EquipmentSlot.WEAPON]?.id).toBe(testStaff.id); // Ana elde asa kuşanılmış olmalıdır
  expect(updatedPlayer.equipped[EquipmentSlot.SHIELD]?.id).toBe(testTome.id); // İkincil elde otomatik olarak büyü kitabı kuşanılmış olmalıdır

  // 3. Tekrar temizleyip test et: Doğrudan büyü kitabı kuşanılırsa ikincil ele yerleşmeli
  repository.setPlayerForTesting(initialPlayer.copy({ inventory: [testTome] }));
  repository.equipItem(testTome);
  updatedPlayer = repository.player.value;
  expect(updatedPlayer.equipped[EquipmentSlot.SHIELD]?.id).toBe(testTome.id); // İkincil elde büyü kitabı kuşanılmış olmalıdır
});
