// Kotlin kaynağı: test/HomeProgressionTest.kt
import { test, expect, beforeEach } from 'bun:test';
import { GameRepository } from '../src/data/GameRepository.js';
import { SaveManager } from '../src/data/SaveManager.js';
import { RoomType } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

let repository;

beforeEach(() => {
  SaveManager.useMemoryStorage();
  repository = new GameRepository();
});

test('testInitialCellStateAndRoomNames', () => {
  const player = repository.player.value;
  expect(player.residenceTitle).toBe('Rutubetli Gladyatör Hücresi');
  expect(player.isHouseUnlocked).toBe(false);

  const rooms = repository.rooms.value;
  expect(rooms.length).toBe(5);

  const restRoom = kt.first(rooms, (it) => it.type === RoomType.REST_ROOM);
  expect(restRoom.name).toBe('Kuru Saman Köşesi');
  expect(restRoom.level).toBe(1);

  const trainRoom = kt.first(rooms, (it) => it.type === RoomType.TRAINING_GROUND);
  expect(trainRoom.name).toBe('Yırtık Kum Çuvalı');
  expect(trainRoom.level).toBe(1);

  const treasuryRoom = kt.first(rooms, (it) => it.type === RoomType.TREASURY);
  expect(treasuryRoom.name).toBe('Taş Zemin Oyuğu');

  const infirmary = kt.first(rooms, (it) => it.type === RoomType.INFIRMARY);
  expect(infirmary.name).toBe('Kurutulmuş Isırgan Bağı');

  const trophyRoom = kt.first(rooms, (it) => it.type === RoomType.TROPHY_HALL);
  expect(trophyRoom.name).toBe('Çentikli Kemik Rafı');
});

test('testRoomUpgradeRequirementsAndPrerequisites', () => {
  // Altın ve seviye yetersizken yükseltme başarısız olmalı
  const trainRoom = kt.first(repository.rooms.value, (it) => it.type === RoomType.TRAINING_GROUND);
  const [canUpgrade, reqError] = repository.checkRoomUpgradeRequirements(trainRoom);
  expect(canUpgrade).toBe(false); // 1. Seviye oyuncu henüz Seviye 2 talimgahı yapamamalı
  expect(reqError).not.toBeNull();

  // Oyuncuya seviye ve altın verelim
  const upgradedPlayer = repository.player.value.copy({ level: 2, gold: 200, globalFame: 15 });
  // Test için dolaylı olarak gold ve level şartlarını sağlayarak upgradeRoom çağırıyoruz
  const initialPlayer = repository.player.value;
  const [failResult] = repository.upgradeRoom('room_training');
  expect(failResult).toBe(false);
});

test('testCellUpgradeLimitAndHouseTransformation', () => {
  // 1. Oyuncuyu hazırlayalım
  const cur = repository.player.value;
  // Tüm başlangıç odalarını 2. kademeye yükseltelim
  const updatedRooms = repository.rooms.value.map((it) => it.copy({ level: 2 }));
  const testPlayer = cur.copy({
    level: 4,
    globalFame: 35,
    gold: 700,
    isHouseUnlocked: false,
  });

  // Repository durumunu test için zenginleştirelim (Kotlin'de yansıma ile özel alanlar)
  repository._rooms.value = updatedRooms;
  repository._player.value = testPlayer;

  // Hücre kısıtı kontrolü: Hücredeyken Kademe 2'den 3'e yükseltme engellenmeli
  const restRoom = kt.first(repository.rooms.value, (it) => it.type === RoomType.REST_ROOM);
  const [canUpgradeTo3InCell, cellLimitMsg] = repository.checkRoomUpgradeRequirements(restRoom);
  expect(canUpgradeTo3InCell).toBe(false); // Hücredeyken kademe 3 yapılamamalı
  expect(cellLimitMsg.includes('Hücrenin sınırlarına ulaştın')).toBe(true);

  // Dönüşüm şartları kontrolü
  const status = repository.getHouseTransformationStatus();
  expect(status.canTransform).toBe(true); // Tüm şartlar sağlandı, dönüşüm mümkün olmalı
  expect(status.requirements.length).toBe(4);
  expect(status.requirements.every((it) => it.isMet)).toBe(true);

  // Dönüşümü gerçekleştir
  const [transSuccess, transMsg] = repository.transformToHouse();
  expect(transSuccess).toBe(true);
  expect(transMsg.includes('BÜYÜK DÖNÜŞÜM')).toBe(true);

  const finalPlayer = repository.player.value;
  expect(finalPlayer.isHouseUnlocked).toBe(true); // Ev kilidi açılmış olmalı
  expect(finalPlayer.residenceTitle).toBe('Kırlangıç Kasabası Avlulu Taş Evi');
  expect(finalPlayer.gold).toBe(200); // 700 - 500

  // Yeni odaların kilidi açıldı mı? (Toplam 9 oda olmalı: 5 başlangıç + 4 müstakil ev odası)
  const finalRooms = repository.rooms.value;
  expect(finalRooms.length).toBe(9);
  expect(kt.firstOrNull(finalRooms, (it) => it.type === RoomType.LIBRARY_STUDY)).not.toBeNull();
  expect(kt.firstOrNull(finalRooms, (it) => it.type === RoomType.ARMORY_WORKSHOP)).not.toBeNull();
  expect(kt.firstOrNull(finalRooms, (it) => it.type === RoomType.GARDEN_CELLAR)).not.toBeNull();
  expect(kt.firstOrNull(finalRooms, (it) => it.type === RoomType.STORAGE_VAULT)).not.toBeNull();

  // Silahhane pasif bonusunun oyuncu toplam özelliklerine yansıması
  const baseDamage = finalPlayer.baseStats.damage + (finalPlayer.level - 1) * 3;
  expect(finalPlayer.totalStats.damage >= baseDamage + 3).toBe(true); // Silahhane seviye 1 bonusu (+3 Hasar) oyuncuya eklenmeli
});
