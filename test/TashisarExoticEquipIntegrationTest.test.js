// Kotlin kaynağı: test/TashisarExoticEquipIntegrationTest.kt
import { test, expect } from 'bun:test';
import { TashisarBlacksmithSpearsAndDaggersData } from '../src/data/TashisarBlacksmithSpearsAndDaggersData.js';
import { TashisarBlacksmithWeaponsData } from '../src/data/TashisarBlacksmithWeaponsData.js';
import { TashisarGladiatorsData } from '../src/data/TashisarGladiatorsData.js';
import { TashisarWandMakerStavesData } from '../src/data/TashisarWandMakerStavesData.js';
import { CombatEngine } from '../src/domain/engine/CombatEngine.js';
import { CombatStance, TextTemplateEngine } from '../src/domain/engine/TextTemplateEngine.js';
import { CombatEvent, EquipmentSlot, Player, Stats, TargetBodyPart } from '../src/domain/model.js';
import * as kt from '../src/kt.js';

test('testAllExoticEquipmentsCountAndSlotValidity', () => {
  const weapons = TashisarBlacksmithWeaponsData.createExoticWeapons();
  const spears = TashisarBlacksmithSpearsAndDaggersData.createSpears();
  const daggers = TashisarBlacksmithSpearsAndDaggersData.createDaggers();
  const staves = TashisarWandMakerStavesData.createAllWandEquipment();

  expect(weapons.length).toBe(250);
  expect(spears.length).toBe(50);
  expect(daggers.length).toBe(50);
  expect(staves.length).toBe(100);

  const total450 = [...weapons, ...spears, ...daggers, ...staves];
  expect(total450.length).toBe(450);

  total450.forEach((item) => {
    expect(item.requiredLevel >= 20 && item.requiredLevel <= 39).toBe(true); // Item must have a valid level between 20 and 39
    expect(item.valueInGold >= 500 && item.valueInGold <= 12000).toBe(true); // Item must have a positive gold value
    expect(item.specialTrait != null).toBe(true); // Item must have specialTrait
    expect(item.maxSockets >= 1).toBe(true); // Item must have at least 1 socket
  });
});

test('testEnemyEquipUpdatesTotalStatsAndTraitsAccurately', () => {
  const baseEnemy = kt.first(TashisarGladiatorsData.createTashisarEnemies(), (it) => it.name === 'Voladmir');
  const kaderKiran = kt.first(TashisarBlacksmithWeaponsData.createExoticWeapons(), (it) => it.id === 'eq_tash_sword_39');
  const surIKebir = kt.first(TashisarBlacksmithWeaponsData.createExoticWeapons(), (it) => it.id === 'eq_tash_shield_39');

  const equippedEnemy = baseEnemy.equip(kaderKiran).equip(surIKebir);

  expect(equippedEnemy.weaponName).toBe(kaderKiran.name);
  expect(kt.eq(equippedEnemy.equippedWeaponItem, kaderKiran)).toBe(true);
  expect(kt.eq(equippedEnemy.equippedShieldItem, surIKebir)).toBe(true);

  const expectedDamage = baseEnemy.stats.damage + kaderKiran.stats.damage + surIKebir.stats.damage;
  const expectedArmor = baseEnemy.stats.armor + kaderKiran.stats.armor + surIKebir.stats.armor;
  const expectedMaxHealth = baseEnemy.stats.maxHealth + kaderKiran.stats.maxHealth + surIKebir.stats.maxHealth;

  expect(equippedEnemy.totalStats.damage).toBe(expectedDamage);
  expect(equippedEnemy.totalStats.armor).toBe(expectedArmor);
  expect(equippedEnemy.totalStats.maxHealth).toBe(expectedMaxHealth);

  // Traits check
  expect(equippedEnemy.specialTraits.length).toBe(2);
  expect(equippedEnemy.specialTraits.some((it) => it.id === kaderKiran.specialTrait?.id)).toBe(true);
  expect(equippedEnemy.specialTraits.some((it) => it.id === surIKebir.specialTrait?.id)).toBe(true);
});

test('testPlayerAndEnemyCombatEngineWithExoticWeapons', () => {
  const baseEnemy = kt.first(TashisarGladiatorsData.createTashisarEnemies(), (it) => it.name === 'Draven');
  const kozmosBicen = kt.first(TashisarBlacksmithWeaponsData.createLegacySpearsAndAxes(), (it) => it.id === 'eq_tash_axe_39');
  const enemyWithExotic = baseEnemy.equip(kozmosBicen);

  const aetherion = kt.last(TashisarWandMakerStavesData.createExoticStaves());
  const player = new Player({
    name: 'Sürgün Silahşör',
    level: 30,
    baseStats: new Stats({ maxHealth: 400, damage: 40, armor: 20, speed: 25 }),
    equipped: { [EquipmentSlot.WEAPON]: aetherion },
  });

  const result = CombatEngine.simulateBattle(player, enemyWithExotic);

  expect(result).not.toBeNull();
  expect(result.logs.length > 0).toBe(true); // Combat must generate logs
  expect(result.totalPlayerDamage > 0 || result.totalEnemyDamage > 0).toBe(true); // Fighters must deal damage with high-level weapons

  // Check if logs mention weapon or fighter names
  const allLogsText = result.logs.map((it) => it.narrativeText).join('\n');
  expect(kt.isNotBlank(allLogsText)).toBe(true); // Narratives must include combat interactions
});

test('testHarmonizedNarrativesMarryCharacterWithExoticWeapon', () => {
  const on = (fn) => kt.rangeTo(1, 10).map(fn);
  const voladmirLogs = on(() =>
    TextTemplateEngine.generateDetailedLog(
      'Voladmir',
      'Sürgün Silahşör',
      "Ebedi Sürgün Şampiyonu Kılıcı 'Kader Kıran'",
      CombatEvent.CRITICAL,
      TargetBodyPart.CHEST,
      55,
      120,
      CombatStance.BALANCED,
    ),
  );
  expect(voladmirLogs.some((it) => it.includes("Voladmir kibirli bir kahkahayla Kader Kıran'ı"))).toBe(true); // Voladmir's aristocratic pride must be preserved with Kader Kıran

  const dravenLogs = on(() =>
    TextTemplateEngine.generateDetailedLog('Draven', 'Voladmir', "Dünya Yaran Titan Baltası 'Kozmos'", CombatEvent.CRITICAL, TargetBodyPart.HEAD, 60, 100, CombatStance.BALANCED),
  );
  expect(dravenLogs.some((it) => it.includes('Draven gözünü kan bürümüş halde Kozmos baltasını'))).toBe(true); // Draven's rage must be preserved with Kozmos

  const baelorLogs = on(() =>
    TextTemplateEngine.generateDetailedLog('Baelor', 'Ghorak', 'Kader Kıran (Garnizon Efsanesi)', CombatEvent.CRITICAL, TargetBodyPart.CHEST, 50, 80, CombatStance.BALANCED),
  );
  expect(baelorLogs.some((it) => it.includes('Baelor demir maskesinin altından tek kelime fısıldamaksızın'))).toBe(true); // Baelor's masked silence must be preserved with Kader Kıran

  const morganaLogs = on(() =>
    TextTemplateEngine.generateDetailedLog(
      'Morgana',
      'Sürgün Silahşör',
      'Thanatos (Ruh Biçen Kadim Asa)',
      CombatEvent.CRITICAL,
      TargetBodyPart.CHEST,
      48,
      90,
      CombatStance.BALANCED,
    ),
  );
  expect(morganaLogs.some((it) => it.includes("Morgana'nın mor gözleri parıldadı; Thanatos'un kuzguni taşından"))).toBe(true); // Morgana's dark sorcery must be preserved with Thanatos

  const surIKebirLogs = on(() =>
    TextTemplateEngine.generateDetailedLog(
      'Sürgün Silahşör',
      'Katerina',
      "Diyarın Sönmeyen Kor Kalkanı 'Sur-ı Kebir'",
      CombatEvent.BLOCKED,
      TargetBodyPart.CHEST,
      12,
      250,
      CombatStance.BALANCED,
    ),
  );
  expect(surIKebirLogs.some((it) => it.includes('Sur-ı Kebir kalkanının arkasına kapandı'))).toBe(true); // Sur-ı Kebir block must be granite-like
});

test('testNpcVsNpcMatchesUtilizeExoticEquipmentStats', () => {
  const f1 = kt.first(TashisarGladiatorsData.createTashisarEnemies(), (it) => it.name === 'Draven');
  const f2 = kt.first(TashisarGladiatorsData.createTashisarEnemies(), (it) => it.name === 'Voladmir');

  const kozmosBicen = kt.first(TashisarBlacksmithWeaponsData.createLegacySpearsAndAxes(), (it) => it.id === 'eq_tash_axe_39');
  const equippedF1 = f1.equip(kozmosBicen);

  const matchResult = CombatEngine.simulateNpcVsNpcMatch(equippedF1, f2);
  expect(matchResult).not.toBeNull();
  expect(matchResult.scoreSummary != null).toBe(true);
  expect(kt.isNotBlank(matchResult.narrativeSnippet)).toBe(true);
});
