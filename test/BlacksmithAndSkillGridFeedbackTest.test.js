// Kotlin kaynağı: test/BlacksmithAndSkillGridFeedbackTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';
import { StarterContent } from '../src/data/StarterContent.js';
import { EquipmentSlot, NpcRole, StarterSkills, WeaponCategory } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

let repository;

beforeEach(() => {
  SaveManager.useMemoryStorage();
  repository = new GameRepository();
});

test('testRegion1BlacksmithShopCategorySeparation', () => {
  const region1 = repository.region.value;
  const vorn = kt.firstOrNull(region1.npcs, (it) => it.role === NpcRole.BLACKSMITH);
  expect(vorn).not.toBeNull(); // Demirci Vorn bulunmalıdır
  expect(vorn.id).toBe('npc_vorn');

  // Demirci Vorn'un kılıç kategorisi sadece kılıçları döndürmeli, asla eldiven veya pantolon içermemeli
  const swords = vorn.equipmentForSale.filter((it) => it.weaponCategory === WeaponCategory.SWORD || it.weaponType === 'kılıç');
  expect(swords.length > 0).toBe(true); // Kılıç kategorisinde ürün olmalıdır
  for (const item of swords) {
    expect(item.slot).toBe(EquipmentSlot.WEAPON); // Kılıç slotu WEAPON olmalıdır
    expect(item.slot).not.toBe(EquipmentSlot.GLOVES); // Kılıç kategorisinde eldiven bulunamaz
    expect(item.slot).not.toBe(EquipmentSlot.PANTS); // Kılıç kategorisinde pantolon bulunamaz
  }

  // Balta ve teber kategorisi
  const axes = vorn.equipmentForSale.filter((it) => it.weaponCategory === WeaponCategory.AXE || ['balta', 'teber'].includes(it.weaponType));
  expect(axes.length > 0).toBe(true); // Balta kategorisinde ürün olmalıdır
  for (const item of axes) {
    expect(item.slot).toBe(EquipmentSlot.WEAPON); // Balta slotu WEAPON olmalıdır
    expect(item.slot).not.toBe(EquipmentSlot.PANTS); // Balta kategorisinde pantolon bulunamaz
  }

  // Gürz kategorisi
  const maces = vorn.equipmentForSale.filter((it) => it.weaponCategory === WeaponCategory.MACE || ['gürz', 'topuz'].includes(it.weaponType));
  expect(maces.length > 0).toBe(true); // Gürz kategorisinde ürün olmalıdır

  // Diğer silahlar (Hançer, Mızrak, Yay)
  const otherWeapons = vorn.equipmentForSale.filter(
    (it) =>
      [WeaponCategory.DAGGER, WeaponCategory.SPEAR, WeaponCategory.BOW].includes(it.weaponCategory) || ['hançer', 'mızrak', 'kargı', 'yay'].includes(it.weaponType),
  );
  expect(otherWeapons.length > 0).toBe(true); // Diğer silahlar kategorisinde hançer, mızrak veya yay olmalıdır

  // Kalkan kategorisi
  const shields = vorn.equipmentForSale.filter((it) => it.slot === EquipmentSlot.SHIELD);
  expect(shields.length > 0).toBe(true); // Kalkan kategorisinde ürün olmalıdır

  // Giysi / Aksesuar kategorisi (Kolçak, Tozluk, Çizme)
  const clothes = vorn.equipmentForSale.filter((it) => [EquipmentSlot.GLOVES, EquipmentSlot.PANTS, EquipmentSlot.BOOTS].includes(it.slot));
  expect(clothes.length > 0).toBe(true); // Kolçak/Tozluk/Çizme kategorisinde ürünler olmalıdır
});

test('testAllSealedScrollsHaveRichDecipherLore', () => {
  const scrollIds = ['skill_east_dragon', 'skill_east_crane', 'skill_east_storm', 'skill_east_night', 'skill_east_tiger', 'skill_east_mountain'];

  for (const skillId of scrollIds) {
    const lore = StarterContent.getDecipherLore(skillId);
    expect(lore).not.toBeNull();
    expect(kt.isNotBlank(lore.ritualTitle)).toBe(true); // Ritüel başlığı zengin olmalıdır
    expect(lore.ritualNarrative.length > 80).toBe(true); // Ritüel anlatısı en az bir paragraf olmalıdır
    expect(lore.techniqueLore.length > 50).toBe(true); // Savaş sanatı anlatısı detaylı olmalıdır
    expect(kt.isNotBlank(lore.battlePhilosophy)).toBe(true); // Felsefe sözü bulunmalıdır
  }
});

test('testCompletedQuestsFilterCleansDailyBoard', () => {
  const player = repository.player.value;
  const allQuests = repository.quests.value;
  expect(allQuests.length > 0).toBe(true); // Başlangıçta görevler bulunmalıdır

  // Hiçbiri tamamlanmamışken tüm görevler aktiftir
  const activeInitial = allQuests.filter((it) => !it.isClaimed && !player.completedQuestIds.includes(it.id));
  expect(activeInitial.length).toBe(allQuests.length);

  // Bir görevi tamamlayıp ödülünü aldığımızda aktif listeden düşmelidir
  const firstQuest = kt.first(allQuests);
  const updatedCompletedIds = kt.setPlus(player.completedQuestIds, firstQuest.id);
  const activeAfterOne = allQuests.filter((it) => !it.isClaimed && !updatedCompletedIds.includes(it.id));
  expect(activeAfterOne.length).toBe(allQuests.length - 1);
  expect(activeAfterOne.some((it) => it.id === firstQuest.id)).toBe(false); // Tamamlanan görev aktif panoda yer almamalıdır

  // Günün tüm görevleri tamamlandığında pano tertemiz (boş) kalmalıdır
  const allCompletedIds = kt.distinct(allQuests.map((it) => it.id));
  const activeWhenAllDone = allQuests.filter((it) => !it.isClaimed && !allCompletedIds.includes(it.id));
  expect(activeWhenAllDone.length === 0).toBe(true); // Tüm görevler yapıldığında pano tamamen boş olmalıdır
});

test('testSkillsGridStructureAndChunking', () => {
  const allSkills = StarterSkills.ALL_SKILLS;
  expect(allSkills.length >= 9).toBe(true); // Yetenek listesi boş olmamalıdır

  // 3 kolonlu ızgara chunking doğrulaması
  const chunked = kt.chunked(allSkills, 3);
  expect(chunked.length).toBe(kt.idiv(allSkills.length + 2, 3));
  for (const row of chunked) {
    expect(row.length >= 1 && row.length <= 3).toBe(true); // Her satırda en fazla 3 yetenek olmalıdır
  }
});
