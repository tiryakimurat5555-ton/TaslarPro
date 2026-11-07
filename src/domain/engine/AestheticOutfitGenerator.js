// AestheticOutfitGenerator.kt'den taşındı (birebir).
import * as kt from '../../kt.js';
import { AestheticAtelierEquipmentData } from '../../data/AestheticAtelierEquipmentData.js';
import { EquipmentSlot, Stats } from '../model.js';

export const AestheticStyle = kt.defineEnum('AestheticStyle', {
  PIRATE: { title: 'Korsan & Denizci', keyword: 'korsan' },
  ROYAL: { title: 'Kraliyet & Saray', keyword: 'kraliyet' },
  STREET: { title: 'Sokak & Meydan', keyword: 'sokak' },
  SOUTHERN_OASIS: { title: 'Güney Vahası & Çöl İpeği', keyword: 'vaha' },
  RANDOM_MIX: { title: 'Karma Zarafet', keyword: '' },
});

export class AestheticOutfit extends kt.Data {
  static T = 'AestheticOutfit';
  static defaults() {
    return {
      style: undefined,
      head: undefined,
      chest: undefined,
      pants: undefined,
      boots: undefined,
      gloves: undefined,
    };
  }

  get allPieces() {
    return [this.head, this.chest, this.pants, this.boots, this.gloves];
  }

  /**
   * Sadece 4 temel istatistiğin (Güç, Hız, Dayanıklılık, Kurnazlık) toplamını hesaplar.
   * Can çalma, kanama ve kara büyü etkileri silahsız estetik modda tamamen sıfırlanır.
   */
  calculateSanitizedStats() {
    let bonusDamage = 0; // Güç
    let bonusSpeed = 0; // Hız
    let bonusArmor = 0; // Dayanıklılık
    let bonusCrit = 0; // Kurnazlık
    let bonusDodge = 0; // Çeviklik / Kaçınma

    this.allPieces.forEach((piece) => {
      bonusDamage += piece.stats.damage;
      bonusSpeed += piece.stats.speed;
      bonusArmor += piece.stats.armor;
      bonusCrit += piece.stats.critChancePercent;
      bonusDodge += piece.stats.dodgeChancePercent;
    });

    return new Stats({
      damage: bonusDamage,
      speed: bonusSpeed,
      armor: bonusArmor,
      critChancePercent: bonusCrit,
      dodgeChancePercent: bonusDodge,
      blockChancePercent: 0,
      maxHealth: bonusArmor * 5,
    });
  }

  summaryDescription() {
    return `${this.head.name}, ${this.chest.name}, ${this.pants.name}, ${this.boots.name} ve ${this.gloves.name}`;
  }
}
kt.Data.register(AestheticOutfit);

// by lazy alanlar
let _allEquipment = null;
const allEquipment = () => _allEquipment ?? (_allEquipment = AestheticAtelierEquipmentData.getAllAestheticEquipment());
let _heads = null;
const heads = () => _heads ?? (_heads = allEquipment().filter((it) => it.slot === EquipmentSlot.HEAD));
let _tops = null;
const tops = () => _tops ?? (_tops = allEquipment().filter((it) => it.slot === EquipmentSlot.CHEST));
let _bottoms = null;
const bottoms = () => _bottoms ?? (_bottoms = allEquipment().filter((it) => it.slot === EquipmentSlot.PANTS));
let _footwear = null;
const footwear = () => _footwear ?? (_footwear = allEquipment().filter((it) => it.slot === EquipmentSlot.BOOTS));
let _glovesList = null;
const glovesList = () => _glovesList ?? (_glovesList = allEquipment().filter((it) => it.slot === EquipmentSlot.GLOVES));

export const AestheticOutfitGenerator = {
  /**
   * İstenilen tarza (Korsan, Kraliyet, Sokak, Vaha veya Karma) göre rastgele eksiksiz bir kıyafet seti üretir.
   */
  generateOutfit(preferredStyle = AestheticStyle.RANDOM_MIX) {
    const selectedStyle =
      preferredStyle === AestheticStyle.RANDOM_MIX
        ? kt.random([AestheticStyle.PIRATE, AestheticStyle.ROYAL, AestheticStyle.STREET, AestheticStyle.SOUTHERN_OASIS])
        : preferredStyle;

    const kw = selectedStyle.keyword;

    const headPiece = kt.randomOrNull(heads().filter((it) => it.id.includes(kw))) ?? kt.random(heads());
    const chestPiece = kt.randomOrNull(tops().filter((it) => it.id.includes(kw))) ?? kt.random(tops());
    const pantsPiece = kt.randomOrNull(bottoms().filter((it) => it.id.includes(kw))) ?? kt.random(bottoms());
    const bootsPiece = kt.randomOrNull(footwear().filter((it) => it.id.includes(kw))) ?? kt.random(footwear());
    const glovesPiece = kt.randomOrNull(glovesList().filter((it) => it.id.includes(kw))) ?? kt.random(glovesList());

    return new AestheticOutfit({
      style: selectedStyle,
      head: headPiece,
      chest: chestPiece,
      pants: pantsPiece,
      boots: bootsPiece,
      gloves: glovesPiece,
    });
  },
};
