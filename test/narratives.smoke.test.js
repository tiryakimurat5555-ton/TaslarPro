// Anlatı / şablon motorları ve karakter-eşlik verileri için duman testi.
// Kotlin'de bu dosyaların özel testi yok; burada her ana işlevin hata vermeden boş olmayan metin döndürdüğü denetlenir.
import { test, expect } from 'bun:test';
import * as kt from '../src/kt.js';
import {
  CombatEvent,
  TargetBodyPart,
  SkillType,
  GladiatorSkill,
  EquipmentSpecialTrait,
  Player,
  DuoMatchState,
  DuoSynergyType,
  DuoDiscordType,
  CharacterProfile,
  CompanionData,
} from '../src/domain/model.js';
import {
  TextTemplateEngine,
  WeaponCategory,
  CombatStance,
  CombatTacticalPosition,
  DamageSeverity,
  DrawSituation,
} from '../src/domain/engine/TextTemplateEngine.js';
import { DuoCombatNarratives } from '../src/domain/engine/DuoCombatNarratives.js';
import { AestheticCombatNarratives } from '../src/domain/engine/AestheticCombatNarratives.js';
import { BeastCombatNarratives, ArenaTrapType } from '../src/domain/engine/BeastCombatNarratives.js';
import { WrestlingCombatNarratives } from '../src/domain/engine/WrestlingCombatNarratives.js';
import { CharacterRegistryData } from '../src/data/CharacterRegistryData.js';
import { TashisarGladiatorsData } from '../src/data/TashisarGladiatorsData.js';
import { CompanionLyraData } from '../src/data/CompanionLyraData.js';
import { CompanionKaterinaData } from '../src/data/CompanionKaterinaData.js';
import { CompanionPavilionData } from '../src/data/CompanionPavilionData.js';

const TEKRAR = 25; // rastgele seçimlerin farklı dallarını da dolaşmak için

function metinMi(x) {
  expect(typeof x).toBe('string');
  expect(x.length).toBeGreaterThan(0);
  expect(x.includes('undefined')).toBe(false);
  expect(x.includes('[object Object]')).toBe(false);
}

const skill = new GladiatorSkill({
  id: 'skill_morvath_1',
  name: 'Kargı Fırtınası',
  icon: '🔱',
  type: SkillType.ATTACK,
  tier: 1,
  cooldownTurns: 2,
  description: 'Kargısıyla üç hızlı dürtüş yapar.',
  combatEffect: '+30 Hasar',
});

const SILAHLAR = [
  'Kader Kıran', 'Kozmos Baltası', 'Titan Delen', 'Sur-ı Kebir', 'Thanatos Asası', 'Lav Akıntısı Asası',
  'Çivili Ahşap Tokmak', 'Üç Ağızlı Çatal Kargı', 'Gladius', 'Ağır Ters Kasap Palası', 'Dikenli Pranga & Zincir Topuz',
  'Mekanik Kundaklı Arbalet', 'Çift Ağızlı Çelik Nacak', 'Hilal Çelik Tırpan', 'Zincirli Çift Ağır Orak', 'Ahşap Kılıç',
];
const ADLAR = ['Morvath', 'Thyra', 'Ghorak', 'Kaelen', 'Bregash', 'Xylar', 'Khorvash', 'Sarkoth', 'Baelor', 'Voladmir', 'Silahşör'];

test('TextTemplateEngine: detectCategory ve calculateSeverity', () => {
  expect(TextTemplateEngine.detectCategory('Dikenli Pranga')).toBe(WeaponCategory.CHAIN_MACE);
  expect(TextTemplateEngine.detectCategory('Çivili Tokmak')).toBe(WeaponCategory.BLUDGEON);
  expect(TextTemplateEngine.detectCategory('Gladius')).toBe(WeaponCategory.SLASH);
  expect(TextTemplateEngine.calculateSeverity(3, false, 100)).toBe(DamageSeverity.GLANCING);
  expect(TextTemplateEngine.calculateSeverity(20, true, 100)).toBe(DamageSeverity.DEVASTATING);
  expect(TextTemplateEngine.calculateSeverity(30, false, 100)).toBe(DamageSeverity.HEAVY);
  expect(TextTemplateEngine.DamageSeverity).toBe(DamageSeverity);
});

test('TextTemplateEngine: generateDetailedLog / generateLog tüm olay, bölge, duruş ve silahlarla', () => {
  for (const event of CombatEvent.values()) {
    for (const bodyPart of TargetBodyPart.values()) {
      for (const weapon of SILAHLAR) {
        for (const stance of CombatStance.values()) {
          for (const pos of CombatTacticalPosition.values()) {
            const att = kt.random(ADLAR);
            const def = kt.random(ADLAR);
            metinMi(TextTemplateEngine.generateDetailedLog(att, def, weapon, event, bodyPart, kt.randomIn(1, 60), 40, stance, pos));
          }
        }
        metinMi(TextTemplateEngine.generateLog('Silahşör', 'Morvath', weapon, event, bodyPart, 12, 50));
      }
    }
  }
});

test('TextTemplateEngine: aşırı yüklenmiş getBodyPartImpact iki biçimde de çalışır', () => {
  for (const bp of TargetBodyPart.values()) {
    for (const cat of WeaponCategory.values()) {
      metinMi(TextTemplateEngine.getBodyPartImpact(bp, cat, DamageSeverity.GLANCING));
      metinMi(TextTemplateEngine.getBodyPartImpact(bp, cat, DamageSeverity.HEAVY));
      metinMi(TextTemplateEngine.getBodyPartImpact(bp, cat, true));
      metinMi(TextTemplateEngine.getBodyPartImpact(bp, cat, false));
    }
  }
});

test('TextTemplateEngine: beraberlik, yetenek, yansıtma ve özel anlatılar', () => {
  for (let i = 0; i < TEKRAR; i++) {
    for (const sit of DrawSituation.values()) {
      metinMi(TextTemplateEngine.generateDrawNarrative(kt.random(ADLAR), kt.random(SILAHLAR), kt.random(ADLAR), kt.random(SILAHLAR), sit));
    }
    metinMi(TextTemplateEngine.generateDrawNarrative('Silahşör', 'Gladius', 'Rakip', 'Tokmak'));
    metinMi(TextTemplateEngine.generateWolfRageNarrative(12));
    metinMi(TextTemplateEngine.generateMeteorBurnNarrative(9));
    for (const type of SkillType.values()) {
      const sk = skill.copy({ type });
      for (const event of [CombatEvent.HIT, CombatEvent.CRITICAL]) {
        metinMi(
          TextTemplateEngine.generateSkillHitNarrative(
            kt.random(ADLAR), kt.random(ADLAR), sk, event, kt.randomIn(1, 60), kt.random(TargetBodyPart.values()),
            kt.random(CombatStance.values()), kt.random(CombatTacticalPosition.values()), kt.random(SILAHLAR),
          ),
        );
      }
      metinMi(TextTemplateEngine.generateSkillHitNarrative('Silahşör', 'Thyra', sk, CombatEvent.HIT, 10, TargetBodyPart.ARM));
    }
    metinMi(TextTemplateEngine.generateSkillDodgeNarrative(kt.random(ADLAR), kt.random(ADLAR), skill, 'Gladius'));
    metinMi(TextTemplateEngine.generateSkillBlockNarrative(kt.random(ADLAR), kt.random(ADLAR), skill, 'Gladius'));
    for (const ad of ['Ayna Kalkanı', 'Statik Şok', 'Kemik Dikeni', 'Tsunami Rünü', 'Azam Surları', 'Gizemli Mühür']) {
      const trait = new EquipmentSpecialTrait({ id: 't', name: ad, description: 'd' });
      metinMi(TextTemplateEngine.generateReflectionNarrative('Silahşör', 'Rakip', trait, 7, 'Gladius', true));
      metinMi(TextTemplateEngine.generateReflectionNarrative('Silahşör', 'Rakip', trait, 7, 'Gladius', false));
    }
  }
});

test('DuoCombatNarratives: tüm üreticiler', () => {
  const enemies = TashisarGladiatorsData.createTashisarEnemies();
  const player = new Player({ name: 'Silahşör' });
  for (let i = 0; i < TEKRAR; i++) {
    const [ally, e1, e2] = kt.shuffled(enemies);
    for (const condition of DuoMatchState.defaultConditions) {
      metinMi(DuoCombatNarratives.generateOpening(player, ally, e1, e2, condition));
      metinMi(DuoCombatNarratives.generateConditionEffect(condition, ally.name, e1.name));
      metinMi(DuoCombatNarratives.generateVictory(player, ally, condition));
    }
    for (const tc of [1, 2, 3, 7]) {
      metinMi(DuoCombatNarratives.generateAllyIntercept(ally.name, player.name, e1.name, 15, true, tc));
      metinMi(DuoCombatNarratives.generateAllyIntercept(ally.name, player.name, e1.name, 15, false, tc));
      metinMi(DuoCombatNarratives.generatePincerDoubleTeam(player.name, ally.name, e1.name, 20, tc));
      for (const st of DuoSynergyType.values()) {
        metinMi(DuoCombatNarratives.generateSynergyCombo(st, player.name, ally.name, e1.name, 25, tc));
        metinMi(DuoCombatNarratives.generateSynergyCombo(st, player.name, ally.name, e1.name, 25, tc, skill));
      }
      for (const type of SkillType.values()) {
        metinMi(DuoCombatNarratives.generateSkillExecutionNarrative(ally.name, e2.name, ally.weaponName, skill.copy({ type }), 30, tc % 2 === 0, 50, 300, tc));
      }
    }
    for (const dt of DuoDiscordType.values()) {
      const t = DuoCombatNarratives.generateDiscordIncident(dt, player.name, ally.name, ally.name);
      expect(typeof t).toBe('string');
      if (dt !== DuoDiscordType.NONE) metinMi(t);
    }
    metinMi(DuoCombatNarratives.generateTeammateFallen(ally.name, player.name, 2));
    metinMi(DuoCombatNarratives.generateLastStandTurn(player.name, e1.name, e2.name));
    metinMi(DuoCombatNarratives.generateDefeat(player, ally, e1, e2));
  }
});

test('AestheticCombatNarratives: tüm üreticiler', () => {
  for (let i = 0; i < TEKRAR; i++) {
    metinMi(AestheticCombatNarratives.generateIntro('Aresula', 'Silahşör', 'ipek kaftanı', 'keten yeleği'));
    metinMi(AestheticCombatNarratives.generateDodge('Aresula', 'Silahşör'));
    metinMi(AestheticCombatNarratives.generateClinch('Aresula', 'Silahşör'));
    metinMi(AestheticCombatNarratives.generateStrike('Aresula', 'Silahşör', 12));
    metinMi(AestheticCombatNarratives.generateCriticalTakedown('Aresula', 'Silahşör', 25));
    metinMi(AestheticCombatNarratives.generateSubmissionAttempt('Aresula', 'Silahşör'));
    for (const stage of [1, 2, 3]) {
      metinMi(AestheticCombatNarratives.generateClothingTear('Aresula', stage, 'ipek kaftan'));
      metinMi(AestheticCombatNarratives.generateAnnouncerCommentary('Aresula', 'Silahşör', stage));
      metinMi(AestheticCombatNarratives.generateSpectatorReaction(stage));
    }
    for (const sub of [true, false]) {
      const [log, reason] = AestheticCombatNarratives.generateVictory('Aresula', 'Silahşör', sub);
      metinMi(log);
      metinMi(reason);
    }
  }
});

test('BeastCombatNarratives: tüm üreticiler', () => {
  for (let i = 0; i < TEKRAR; i++) {
    metinMi(BeastCombatNarratives.generateSingleBeastIntro('Silahşör', 'Kum Boğası', 'deri yelek'));
    metinMi(BeastCombatNarratives.generateBeastPackIntro('Silahşör', 'Sırtlan Sürüsü', 'deri yelek'));
    for (const ok of [true, false]) {
      metinMi(BeastCombatNarratives.generateMatadorManeuver('Silahşör', 'Kum Boğası', ok, 14));
      metinMi(BeastCombatNarratives.generateBeastPowerClash('Silahşör', 'Kum Boğası', ok, 16, 20));
      metinMi(BeastCombatNarratives.generatePackCollision('Silahşör', 'Sırtlan Sürüsü', ok, 16, 20));
      for (const trap of ArenaTrapType.values()) {
        metinMi(BeastCombatNarratives.generateArenaTrapTrigger('Silahşör', 'Kum Boğası', trap, ok, 12, 30));
      }
      const [log, reason] = BeastCombatNarratives.generateVictory('Silahşör', 'Kum Boğası', ok);
      metinMi(log);
      metinMi(reason);
    }
    metinMi(BeastCombatNarratives.generateBeastVaultAndChoke('Silahşör', 'Kum Boğası', 18));
    metinMi(BeastCombatNarratives.generateBeastMeatShield('Silahşör', 'Sırtlan Sürüsü', 18));
    metinMi(BeastCombatNarratives.generateBeastStrike('Kum Boğası', 'Silahşör', 22));
    metinMi(BeastCombatNarratives.generateBloodlustAnnouncer('Silahşör', 'Kum Boğası'));
    metinMi(BeastCombatNarratives.generateBloodlustCrowd());
  }
});

test('WrestlingCombatNarratives: tüm üreticiler', () => {
  const W = WrestlingCombatNarratives;
  const adlar = Object.keys(W).filter((k) => typeof W[k] === 'function');
  expect(adlar.length).toBeGreaterThan(5);
  for (let i = 0; i < TEKRAR; i++) {
    for (const ad of adlar) {
      // Parametreler: dizeler, sayılar ve mantıksallar; işlev uzunluğuna göre makul değerler
      const kaynak = W[ad].toString();
      const params = kaynak.slice(kaynak.indexOf('(') + 1, kaynak.indexOf(')')).split(',').map((x) => x.trim().split('=')[0].trim()).filter(Boolean);
      const args = params.map((p) => {
        if (/^(is|has)[A-Z]/.test(p)) return kt.Random.nextBoolean();
        if (/damage|stage|strength|speed|count|stamina|grip|power|level|amount|round|cunning|turn/i.test(p)) return kt.randomIn(1, 3);
        return 'Pehlivan ' + p;
      });
      const r = W[ad](...args);
      if (Array.isArray(r)) r.forEach(metinMi);
      else metinMi(r);
    }
  }
});

test('CharacterRegistryData + TashisarGladiatorsData', () => {
  const enemies = TashisarGladiatorsData.createTashisarEnemies();
  expect(enemies.length).toBe(40);
  for (const e of enemies) {
    expect(e.regionId).toBe('tashisar');
    expect(e.skills.length).toBe(4);
    metinMi(e.name);
  }
  const profiles = CharacterRegistryData.getAllProfiles();
  expect(profiles.length).toBe(25 + 40);
  for (const p of profiles) {
    expect(p instanceof CharacterProfile).toBe(true);
    metinMi(p.appearance);
    metinMi(p.backgroundLore);
    metinMi(p.avatarIcon);
  }
  const aresula = profiles.find((p) => p.id === 'fighter_aresula');
  expect(aresula.roleOrWeapon).toBe('Çift Hilal Rüzgar Bıçağı (Seviye 12)');
  expect(aresula.avatarIcon).toBe('🗡️');
  expect(aresula.regionId).toBe('tashisar');
  expect(profiles.find((p) => p.id === 'fighter_morvath').regionId).toBe('kirlangic');
});

test('Eşlikçi (Companion) verileri', () => {
  const hepsi = [CompanionLyraData.createLyraData(), CompanionKaterinaData.createKaterinaData(), ...CompanionPavilionData.getAllCompanions()];
  expect(hepsi.map((c) => c.id)).toEqual(['fighter_lyra', 'fighter_katerina', 'fighter_aresula', 'fighter_althea']);
  for (const c of hepsi) {
    expect(c instanceof CompanionData).toBe(true);
    expect(c.kademeler.length).toBe(5);
    c.kademeler.forEach((k, i) => {
      expect(k.kademeLevel).toBe(i + 1);
      expect(k.rounds.length).toBe(5);
      for (const r of k.rounds) {
        expect(r.choices.length).toBe(3);
        for (const ch of r.choices) {
          metinMi(ch.id);
          metinMi(ch.narrativeResponse);
        }
      }
    });
    expect(c.culmination.passionNarrative.length).toBeGreaterThan(0);
  }
  expect(CompanionPavilionData.getCompanionById('fighter_althea').name).toBeTruthy();
  expect(CompanionPavilionData.getCompanionById('yok')).toBe(null);
  expect(CompanionPavilionData.getAllCompanions()[0].kademeler[2].rounds[0].choices[0].id).toBe('aresula_3_1_1');
});
