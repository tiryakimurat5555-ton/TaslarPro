// model.js — KT/domain/model/*.kt dosyalarının tek dosyalık JavaScript karşılığı.
// Kotlin'deki sınıf, alan, işlev adları ve tüm metinler aynen korunmuştur.
// Sıralama önemli: girdileri başka bir enum/sınıfa başvuran enum ve sabitler, başvurduklarından sonra gelir.
import * as kt from '../kt.js';
import { Data } from '../kt.js';

// ===========================================================================
// Stats.kt
// ===========================================================================
export class Stats extends Data {
  static T = 'Stats';
  static defaults() {
    return {
      maxHealth: 0,
      damage: 0,
      armor: 0,
      speed: 0, // Determines attack order and tick frequency
      dodgeChancePercent: 0, // Chance to completely avoid a blow (0-50%)
      critChancePercent: 0, // Chance for 1.75x - 2.5x critical strike
      blockChancePercent: 0, // Chance to reduce incoming damage by 60%
    };
  }

  /** operator fun plus */
  plus(other) {
    return new Stats({
      maxHealth: this.maxHealth + other.maxHealth,
      damage: this.damage + other.damage,
      armor: this.armor + other.armor,
      speed: this.speed + other.speed,
      dodgeChancePercent: kt.coerceIn(this.dodgeChancePercent + other.dodgeChancePercent, 0, 60),
      critChancePercent: kt.coerceIn(this.critChancePercent + other.critChancePercent, 0, 75),
      blockChancePercent: kt.coerceIn(this.blockChancePercent + other.blockChancePercent, 0, 65),
    });
  }

  /** Equipment.kt: fun Stats.toStatSummary() */
  toStatSummary() {
    const list = [];
    if (this.damage > 0) list.push(`+${this.damage} Hasar`);
    if (this.armor > 0) list.push(`+${this.armor} Zırh`);
    if (this.maxHealth > 0) list.push(`+${this.maxHealth} Can`);
    if (this.speed > 0) list.push(`+${this.speed} Hız`);
    if (this.speed < 0) list.push(`${this.speed} Hız`);
    if (this.dodgeChancePercent > 0) list.push(`+%${this.dodgeChancePercent} Sıyrılma`);
    if (this.critChancePercent > 0) list.push(`+%${this.critChancePercent} Kritik`);
    if (this.blockChancePercent > 0) list.push(`+%${this.blockChancePercent} Blok`);
    return list.length === 0 ? 'Temel Nitelik' : list.join(' • ');
  }
}
Data.register(Stats);

// ===========================================================================
// Equipment.kt
// ===========================================================================
export const EquipmentSlot = kt.defineEnum('EquipmentSlot', {
  HEAD: { displayName: 'Başlık / Miğfer', icon: '' },
  CHEST: { displayName: 'Gövdelik / Zırh / Cübbe', icon: '' },
  GLOVES: { displayName: 'Eldiven', icon: '' },
  PANTS: { displayName: 'Pantolon & Tozluk', icon: '' },
  BOOTS: { displayName: 'Ayakkabı & Çizme', icon: '' },
  WEAPON: { displayName: 'Silah', icon: '' },
  SHIELD: { displayName: 'Kalkan / İkincil El', icon: '' },
  TALISMAN: { displayName: 'Tılsım & Mühür', icon: '' },
  RING: { displayName: 'Yüzük', icon: '' },
});
// Geriye dönük uyumluluk alias'ları (companion object)
EquipmentSlot.HELMET = EquipmentSlot.HEAD;
EquipmentSlot.AMULET = EquipmentSlot.TALISMAN;

export const ItemRarity = kt.defineEnum('ItemRarity', {
  ILKEL: { displayName: 'İlkel', colorHex: 0xff8a7f75 },
  SIRADAN: { displayName: 'Sıradan', colorHex: 0xffe0dacb },
  USTAISI: { displayName: 'Usta İşi', colorHex: 0xff3498db },
  NADIDE: { displayName: 'Nadide', colorHex: 0xff9b59b6 },
  KADIM: { displayName: 'Kadim', colorHex: 0xfff39c12 },
});

export class EquipmentSpecialTrait extends Data {
  static T = 'EquipmentSpecialTrait';
  static defaults() {
    return { id: undefined, name: undefined, description: undefined, icon: '' };
  }
}
Data.register(EquipmentSpecialTrait);

export class Equipment extends Data {
  static T = 'Equipment';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      slot: undefined,
      rarity: ItemRarity.ILKEL,
      stats: undefined,
      requiredLevel: 1,
      valueInGold: 10,
      description: undefined,
      weaponType: 'silah',
      weaponCategory: null,
      armorCategory: null,
      accessoryCategory: null,
      specialTrait: null,
      maxSockets: 0,
      unlockedSockets: 0,
      sockets: [],
      isAestheticUnarmed: false,
    };
  }

  get totalStats() {
    let combined = this.stats;
    this.sockets.forEach((gem) => {
      combined = combined.plus(gem.stats);
    });
    return combined;
  }

  get effectiveMaxSockets() {
    if (this.maxSockets > 0) return this.maxSockets;
    switch (this.rarity) {
      case ItemRarity.ILKEL:
      case ItemRarity.SIRADAN:
        return 1;
      case ItemRarity.USTAISI:
        return 2;
      case ItemRarity.NADIDE:
      case ItemRarity.KADIM:
        return 3;
    }
    return 1;
  }

  get freeSockets() {
    return Math.max(0, this.unlockedSockets - this.sockets.length);
  }
  get lockedSockets() {
    return Math.max(0, this.effectiveMaxSockets - this.unlockedSockets);
  }
  get canUnlockMoreSockets() {
    return this.unlockedSockets < this.effectiveMaxSockets;
  }
  get hasSockets() {
    return this.effectiveMaxSockets > 0;
  }
  get lifestealPercent() {
    return kt.sumOf(this.sockets, (it) => it.lifestealPercent);
  }
  get armorPenetrationPercent() {
    return kt.sumOf(this.sockets, (it) => it.armorPenetrationPercent);
  }
  get stunChancePercent() {
    return kt.sumOf(this.sockets, (it) => it.stunChancePercent);
  }

  get categoryDisplayName() {
    if (this.weaponCategory != null) return this.weaponCategory.displayName;
    if (this.armorCategory != null) return this.armorCategory.displayName;
    if (this.accessoryCategory != null) return this.accessoryCategory.displayName;
    if (this.slot === EquipmentSlot.WEAPON) return 'Silah';
    if (this.slot === EquipmentSlot.SHIELD) return 'Kalkan';
    return this.slot.displayName;
  }

  get categoryIcon() {
    if (this.weaponCategory != null) return this.weaponCategory.icon;
    if (this.armorCategory != null) return this.armorCategory.icon;
    if (this.accessoryCategory != null) return this.accessoryCategory.icon;
    return this.slot.icon;
  }

  get isWeapon() {
    return this.slot === EquipmentSlot.WEAPON;
  }
  get isArmor() {
    return [EquipmentSlot.HEAD, EquipmentSlot.CHEST, EquipmentSlot.GLOVES, EquipmentSlot.PANTS, EquipmentSlot.BOOTS].includes(this.slot);
  }
  get isShield() {
    return this.slot === EquipmentSlot.SHIELD && this.accessoryCategory !== AccessoryCategory.ARROW && this.accessoryCategory !== AccessoryCategory.TOME;
  }
  get isArrow() {
    return this.accessoryCategory === AccessoryCategory.ARROW || this.weaponType === 'ok';
  }
  get isTome() {
    return this.accessoryCategory === AccessoryCategory.TOME || this.weaponType === 'tomar' || this.weaponType === 'büyü kitabı';
  }
  get isAccessory() {
    return [EquipmentSlot.RING, EquipmentSlot.TALISMAN, EquipmentSlot.SHIELD].includes(this.slot);
  }
  get sellPrice() {
    return Math.max(1, kt.toInt(this.valueInGold * 0.5));
  }
}
Data.register(Equipment);

// ===========================================================================
// EquipmentCategories.kt
// ===========================================================================
/**
 * 7 Temel Silah Kategorisi
 */
export const WeaponCategory = kt.defineEnum('WeaponCategory', {
  SWORD: {
    displayName: 'Kılıç',
    icon: '',
    description: 'Dengeli kesiş ve savurma darbeleri. Hem atak hem savunmada istikrarlıdır.',
    combatStyle: 'Dengeli & Çevik',
  },
  SPEAR: {
    displayName: 'Mızrak & Kargı',
    icon: '',
    description: 'Uzak menzilden delici hamleler. Düşmanı yaklaştırmadan zırh aralıklarına saplanır.',
    combatStyle: 'Mesafe & Zırh Delme',
  },
  DAGGER: {
    displayName: 'Hançer & Kama',
    icon: '',
    description: 'Kısa, seri ve beklenmedik darbeler. Yüksek hız ve kritik hasar avantajı sunar.',
    combatStyle: 'Hız & Kritik Vuruş',
  },
  MACE: {
    displayName: 'Gürz & Topuz',
    icon: '',
    description: 'Ağır küt darbeler. Kemik kırar, düşmanı sersemletir ve ağır zırhı ezer.',
    combatStyle: 'Ezici Güç & Sersemletme',
  },
  BOW: {
    displayName: 'Yay & Arbalet',
    icon: '',
    description: 'Menzilli yay veya mekanik arbalet. Rüzgar ve mesafe hesabı ile uzaktan avlar.',
    combatStyle: 'Menzil & Keskin Nişan',
  },
  STAFF: {
    displayName: 'Asa & Değnek',
    icon: '',
    description: 'Kadim oymalarla işlenmiş odun veya taş asa. Manevi odak ve savunma direnci verir.',
    combatStyle: 'Odak & Manevi Direnç',
  },
  AXE: {
    displayName: 'Balta & Nacak',
    icon: '',
    description: 'Vahşi ve ağır savuruşlar. Zırh parçalar, derin yarıklar açar.',
    combatStyle: 'Yıkıcı Darbe & Parçalama',
  },
});

/**
 * Zırh ve Kıyafet Kategorileri
 */
export const ArmorCategory = kt.defineEnum('ArmorCategory', {
  // Gövde Zırhları
  LIGHT_ARMOR: {
    displayName: 'Hafif Zırh',
    icon: '',
    slot: EquipmentSlot.CHEST,
    description: 'İşlenmiş deri, keten ve esnek avcı yelekleri. Hareketi kısıtlamaz, sıyrılma şansı verir.',
  },
  HEAVY_ARMOR: {
    displayName: 'Ağır Zırh',
    icon: '',
    slot: EquipmentSlot.CHEST,
    description: 'Dövme demir göğüslük, çelik plaka ve perçinli zincir zırh. Azami darbe emilimi ve can sağlar.',
  },
  ROBE: {
    displayName: 'Cübbe & Kaftan',
    icon: '',
    slot: EquipmentSlot.CHEST,
    description: 'Kadim kumaşlardan dokunmuş cübbe ve bilge kaftanı. Manevi direnç ve hafiflik sunar.',
  },

  // Başlıklar
  HELMET: {
    displayName: 'Miğfer',
    icon: '',
    slot: EquipmentSlot.HEAD,
    description: 'Burunluklu demir miğfer, gladyatör kaskı veya çelik başlık. Kafa darbelerine karşı üstün koruma.',
  },
  ASSASSIN_HOOD: {
    displayName: 'Kumaş Başlık & Peçe',
    icon: '',
    slot: EquipmentSlot.HEAD,
    description: 'Koyu kapüşon, deri maske veya ipek peçe. Kimliği gizler, çevikliği ve kritik isabeti artırır.',
  },
  MISC_HEADGEAR: {
    displayName: 'Çeşitli Başlık',
    icon: '',
    slot: EquipmentSlot.HEAD,
    description: 'Kumaş sargı, kürk kalpak, avcı şapkası veya madeni taç.',
  },

  // El
  GLOVES: {
    displayName: 'Eldiven',
    icon: '',
    slot: EquipmentSlot.GLOVES,
    description: 'Deri eldiven, perçinli gladyatör elceği veya zırhlı kolluk. Kavramayı güçlendirir ve elleri korur.',
  },

  // Bacak
  PANTS: {
    displayName: 'Pantolon & Tozluk',
    icon: '',
    slot: EquipmentSlot.PANTS,
    description: 'Kaba keten pantolon, deri dizlik veya halkalı bacak zırhı.',
  },

  // Ayak
  BOOTS: {
    displayName: 'Ayakkabı & Çizme',
    icon: '',
    slot: EquipmentSlot.BOOTS,
    description: 'Deri sandalet, bağcıklı çizme veya çelik mahmuzlu avcı botu. Çevik adımlar ve denge sağlar.',
  },
});

/**
 * Aksesuar & İkincil Ekipman Kategorileri
 */
export const AccessoryCategory = kt.defineEnum('AccessoryCategory', {
  SHIELD: {
    displayName: 'Kalkan',
    icon: '',
    slot: EquipmentSlot.SHIELD,
    description: 'Tahta parmaklık kalkan, çelik kalkan veya kule kalkanı. Sol elde taşınarak blok şansı ve savunma sağlar.',
  },
  ARROW: {
    displayName: 'Ok & Cephane',
    icon: '',
    slot: EquipmentSlot.SHIELD,
    description: 'Menzilli yay ve arbaletler için özel temrenli oklar, sadaklar ve çelik cıvalar. İkincil elde taşınır.',
  },
  TOME: {
    displayName: 'Büyü Kitabı & Kadim Tomar',
    icon: '',
    slot: EquipmentSlot.SHIELD,
    description: 'Mistik asalarla birlikte ikincil elde (sol el) taşınan kadim büyü kitapları, efsunlu tomarlar ve rünik yazıtlar.',
  },
  RING: {
    displayName: 'Yüzük',
    icon: '',
    slot: EquipmentSlot.RING,
    description: 'Mühürlü bronz yüzük, gümüş halka veya değerli taşlı takı.',
  },
  TALISMAN: {
    displayName: 'Tılsım & Mühür',
    icon: '',
    slot: EquipmentSlot.TALISMAN,
    description: 'Kemik muska, hanedan mührü, mühürlü taş, kadim kolye veya koruma tılsımı.',
  },
});

/**
 * Tüketilebilir Eşyalar ve Malzeme Kategorileri
 */
export const UsableCategory = kt.defineEnum('UsableCategory', {
  POTION: {
    displayName: 'İksir',
    icon: '',
    description: 'Şişelenmiş şifa iksirleri, enerji tentürleri ve simya karışımları.',
  },
  HERB: {
    displayName: 'Şifalı Bitki',
    icon: '',
    description: 'Dağ kekikleri, kurutulmuş kökler, yara otları ve şifalı lapalar.',
  },
  SCROLL: {
    displayName: 'Tomar & Ferman',
    icon: '',
    description: 'Kadim parşömenler, mühürlü fermanlar, gizemli teknikler ve büyü yazıtları.',
  },
  OINTMENT: {
    displayName: 'Merhem & Yağ',
    icon: '',
    description: 'Silaha ve vücuda sürülen zehirli yağlar, koruyucu merhemler ve savaş lapaları.',
  },
  PEHLIVAN_OIL: {
    displayName: 'Er Meydanı Yağı & Merhem',
    icon: '',
    description: 'Güreşçilerin ve pehlivanların er meydanına çıkmadan önce adelelerine sürdükleri geleneksel yağlar ve ovuşlar.',
  },
});

// ===========================================================================
// Item.kt
// ===========================================================================
export const ItemType = kt.defineEnum('ItemType', {
  POTION: { displayName: 'İksir' }, // Can doldurur veya güçlendirir
  HERB: { displayName: 'Şifalı Bitki' }, // Şifalı ot, kurutulmuş kök, şifa çayı
  OINTMENT: { displayName: 'Merhem & Savaş Yağı' }, // Silaha sürülen zehir, alev yağı veya zırh lapası
  SCROLL: { displayName: 'Tomar & Ferman' }, // Kadim ferman, büyü yazıtı
  EXTRACT: { displayName: 'Bitki Özü' }, // Simya özü
  MATERIAL: { displayName: 'Hammadde' }, // Zanaat veya görev materyali
});

/**
 * İksirler veya merhemler kullanıldığında oyuncuya eklenen geçici savaş takviyesi (Buff)
 */
export class ActiveBuffEffect extends Data {
  static T = 'ActiveBuffEffect';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      icon: undefined,
      description: undefined,
      bonusDamage: 0,
      bonusArmor: 0,
      bonusSpeed: 0,
      bonusCritChance: 0,
      bonusBlockChance: 0,
      bonusDodgeChance: 0,
      poisonDamagePerHit: 0,
      poisonChancePercent: 0,
      fireDamagePerHit: 0,
      fireChancePercent: 0,
      frostDamagePerHit: 0,
      frostChancePercent: 0,
      lifestealPercent: 0,
      damageMitigationPercent: 0,
      remainingBattles: 1,
    };
  }
}
Data.register(ActiveBuffEffect);

/** ConsumableItem.usableCategory varsayılanı type'a bağlıdır (Kotlin varsayılan ifadesi). */
function usableCategoryForType(type) {
  switch (type) {
    case ItemType.HERB:
      return UsableCategory.HERB;
    case ItemType.SCROLL:
      return UsableCategory.SCROLL;
    case ItemType.OINTMENT:
      return UsableCategory.OINTMENT;
    default:
      return UsableCategory.POTION;
  }
}

export class ConsumableItem extends Data {
  static T = 'ConsumableItem';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      type: undefined,
      usableCategory: undefined, // varsayılan: type'a göre (constructor'da hesaplanır)
      healAmount: 0,
      valueInGold: 5,
      description: undefined,
      count: 1,
      buffEffect: null,
      requiredLevel: 1,
    };
  }
  constructor(args) {
    super(args);
    if (args == null || args.usableCategory == null) this.usableCategory = usableCategoryForType(this.type);
  }

  get categoryDisplayName() {
    return this.usableCategory.displayName;
  }

  get categoryIcon() {
    return this.usableCategory.icon;
  }
}
Data.register(ConsumableItem);

// ===========================================================================
// Gem.kt
// ===========================================================================
export const GemType = kt.defineEnum('GemType', {
  YAKUT: { displayName: 'Yakut', icon: '', primaryStatDescription: '+Hasar & Saldırı Gücü' },
  SAFIR: { displayName: 'Safir', icon: '', primaryStatDescription: '+Zırh & Korunma' },
  ZUMRUT: { displayName: 'Zümrüt', icon: '', primaryStatDescription: '+Maksimum Can & Hayat' },
  TOPAZ: { displayName: 'Topaz', icon: '', primaryStatDescription: '+Hız & Çeviklik' },
  AMETIST: { displayName: 'Ametist', icon: '', primaryStatDescription: '+Kritik Vuruş Şansı' },
  OPAL: { displayName: 'Opal', icon: '', primaryStatDescription: '+Zırh Delme (% Delme)' },
  OBSIDYEN: { displayName: 'Obsidyen', icon: '', primaryStatDescription: '+Sersemletme Şansı' },
  AKIK: { displayName: 'Kırmızı Akik', icon: '', primaryStatDescription: '+Can Çalma (% Lifesteal)' },
  KUVARS: { displayName: 'Dumanlı Kuvars', icon: '', primaryStatDescription: '+Savuşturma & Sıyrılma' },
  AYTASI: { displayName: 'Mistik Aytaşı', icon: '', primaryStatDescription: '+Maks Can & Zırh' },
  KEHRIBAR: { displayName: 'Kadim Kehribar', icon: '', primaryStatDescription: '+Maks Can & Hasar' },
  YESIM: { displayName: 'Gök Yeşimi', icon: '', primaryStatDescription: '+Yüksek Can Dirayeti' },
  MALAKIT: { displayName: 'Derin Malakit', icon: '', primaryStatDescription: '+Zırh & Kalkan Blok' },
  PIRIT: { displayName: 'Pirit', icon: '', primaryStatDescription: '+Dengeli Hasar' },
  LAPIS: { displayName: 'Lapis Lazuli', icon: '', primaryStatDescription: '+Hasar & Hız' },
  AKVAMARIN: { displayName: 'Akvamarin', icon: '', primaryStatDescription: '+Maks Can & Hız' },
  GRANAT: { displayName: 'Granat (Lal)', icon: '', primaryStatDescription: '+Hasar & Kritik Vuruş' },
  TURMALIN: { displayName: 'Turmalin', icon: '', primaryStatDescription: '+Bütüncül Nitelik (Can/Hasar/Zırh/Hız)' },
});
/** companion object: fromNameOrNull (büyük/küçük harf duyarsız) */
GemType.fromNameOrNull = (name) => GemType.values().find((it) => it.name.toLowerCase() === String(name).toLowerCase()) ?? null;

export const GemTier = kt.defineEnum('GemTier', {
  RAW: { tierNumber: 1, prefix: 'Yontulmamış' },
  POLISHED: { tierNumber: 2, prefix: 'Parlak' },
  FLAWLESS: { tierNumber: 3, prefix: 'Kusursuz' },
});

export const GemCraftingRules = {
  SHARDS_PER_GEM: 3,
  GEMS_PER_UPGRADE: 3,
  PITY_BONUS_PER_FAILURE: 7, // Her başarısızlıkta +%7 telafi bonusu birikir
  MAX_GEM_LEVEL: 10,

  // Net Altın Tarifesi:
  SHARD_SYNTHESIS_COST_GOLD: 15, // 3 Kırık -> 1 Taş yapma işçilik ücreti
  GEM_SOCKET_COST_GOLD: 25, // Taşı eşyaya mıhlama işçiliği
  GEM_REMOVE_COST_GOLD: 20, // Taşı kırmadan sökme işçiliği

  getSocketDrillCost(currentUnlockedSockets) {
    return 50 * (currentUnlockedSockets + 1);
  },
  getUpgradeCostGold(currentLevel) {
    return currentLevel * 30;
  },

  /**
   * Hedef seviyeye göre temel başarı oranı (%)
   * Seviye 1 -> 2: %100
   * Seviye 2 -> 3: %85
   * Seviye 3 -> 4: %70
   * Seviye 4 -> 5: %55
   * Seviye 5 -> 6: %40
   * Seviye 6 -> 7: %25
   * Seviye 7 -> 8: %15
   * Seviye 8 -> 9: %10
   * Seviye 9 -> 10: %5
   */
  getBaseSuccessRate(targetLevel) {
    switch (targetLevel) {
      case 2:
        return 100;
      case 3:
        return 85;
      case 4:
        return 70;
      case 5:
        return 55;
      case 6:
        return 40;
      case 7:
        return 25;
      case 8:
        return 15;
      case 9:
        return 10;
      case 10:
        return 5;
      default:
        return 5;
    }
  },

  /**
   * Başarısızlık telafisi (pity) eklenmiş nihai başarı şansı
   */
  getEffectiveSuccessRate(targetLevel, currentPity) {
    const base = GemCraftingRules.getBaseSuccessRate(targetLevel);
    return kt.coerceIn(base + currentPity, base, 100);
  },
};

export class Gem extends Data {
  static T = 'Gem';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      type: undefined,
      level: 1, // 1..10
      tier: GemTier.RAW,
      stats: new Stats(),
      lifestealPercent: 0,
      armorPenetrationPercent: 0,
      stunChancePercent: 0,
      description: '',
      valueInGold: 20,
    };
  }

  get displayName() {
    return `${this.type.displayName} (Sv. ${this.level})`;
  }

  get effectSummary() {
    const parts = [];
    const statSummary = this.stats.toStatSummary();
    if (statSummary !== 'Temel Nitelik') parts.push(statSummary);
    if (this.lifestealPercent > 0) parts.push(`+%${this.lifestealPercent} Can Çalma`);
    if (this.armorPenetrationPercent > 0) parts.push(`+%${this.armorPenetrationPercent} Zırh Delme`);
    if (this.stunChancePercent > 0) parts.push(`+%${this.stunChancePercent} Sersemletme`);
    return parts.length === 0 ? this.type.primaryStatDescription : parts.join(' • ');
  }

  // --- companion object ---
  /**
   * Seviye başına yaklaşık +%90 geometrik artış formülü (1.90^(level - 1))
   * Seviye 1: base
   * Seviye 2: round(base * 1.90)  (ör. 15 -> 28)
   * Seviye 3: round(base * 3.61)  (ör. 15 -> 54)
   * Seviye 4: round(base * 6.86)  (ör. 15 -> 103)
   * Seviye 7: round(base * 47.05) (ör. 15 -> 705)
   */
  static scaleStat(base, level, multiplier = 1.9) {
    if (base <= 0) return 0;
    if (level <= 1) return base;
    const factor = Math.pow(multiplier, level - 1);
    return Math.round(base * factor);
  }

  static scalePercent(base, level, maxCap) {
    if (base <= 0) return 0;
    if (level <= 1) return base;
    // Yüzdelik değerler için kademeli ve dengeli büyüme
    const scaled = Gem.scaleStat(base, level, 1.45);
    return kt.coerceAtMost(scaled, maxCap);
  }

  static create(type, level = 1) {
    const scaleStat = Gem.scaleStat;
    const scalePercent = Gem.scalePercent;
    const lvl = kt.coerceIn(level, 1, GemCraftingRules.MAX_GEM_LEVEL);
    const baseGold = 25 * lvl * lvl;
    let stats = new Stats();
    let lifesteal = 0;
    let armorPen = 0;
    let stunChance = 0;

    switch (type) {
      case GemType.YAKUT: {
        const dmg = scaleStat(3, lvl);
        stats = new Stats({ damage: dmg });
        break;
      }
      case GemType.SAFIR: {
        const arm = scaleStat(2, lvl);
        stats = new Stats({ armor: arm });
        break;
      }
      case GemType.ZUMRUT: {
        const hp = scaleStat(15, lvl);
        stats = new Stats({ maxHealth: hp });
        break;
      }
      case GemType.TOPAZ: {
        const spd = kt.coerceAtMost(1 + kt.toInt(lvl * 1.4), 16);
        stats = new Stats({ speed: spd });
        break;
      }
      case GemType.AMETIST: {
        const crit = scalePercent(2, lvl, 50);
        stats = new Stats({ critChancePercent: crit });
        break;
      }
      case GemType.OPAL: {
        armorPen = scalePercent(3, lvl, 75);
        break;
      }
      case GemType.OBSIDYEN: {
        stunChance = scalePercent(1, lvl, 30);
        break;
      }
      case GemType.AKIK: {
        lifesteal = scalePercent(2, lvl, 45);
        break;
      }
      case GemType.KUVARS: {
        const dodge = scalePercent(2, lvl, 35);
        stats = new Stats({ dodgeChancePercent: dodge });
        break;
      }
      case GemType.AYTASI: {
        const hp = scaleStat(10, lvl);
        const arm = scaleStat(1, lvl);
        stats = new Stats({ maxHealth: hp, armor: arm });
        break;
      }
      case GemType.KEHRIBAR: {
        const hp = scaleStat(8, lvl);
        const dmg = scaleStat(2, lvl);
        stats = new Stats({ maxHealth: hp, damage: dmg });
        break;
      }
      case GemType.YESIM: {
        const hp = scaleStat(20, lvl);
        stats = new Stats({ maxHealth: hp });
        break;
      }
      case GemType.MALAKIT: {
        const arm = scaleStat(1, lvl);
        const blk = scalePercent(2, lvl, 40);
        stats = new Stats({ armor: arm, blockChancePercent: blk });
        break;
      }
      case GemType.PIRIT: {
        const dmg = scaleStat(2, lvl);
        stats = new Stats({ damage: dmg });
        break;
      }
      case GemType.LAPIS: {
        const dmg = scaleStat(2, lvl);
        const spd = kt.coerceAtMost(1 + kt.idiv(lvl, 2), 10);
        stats = new Stats({ damage: dmg, speed: spd });
        break;
      }
      case GemType.AKVAMARIN: {
        const hp = scaleStat(8, lvl);
        const spd = kt.coerceAtMost(1 + kt.idiv(lvl, 2), 10);
        stats = new Stats({ maxHealth: hp, speed: spd });
        break;
      }
      case GemType.GRANAT: {
        const dmg = scaleStat(2, lvl);
        const crit = scalePercent(1, lvl, 35);
        stats = new Stats({ damage: dmg, critChancePercent: crit });
        break;
      }
      case GemType.TURMALIN: {
        const hp = scaleStat(5, lvl);
        const dmg = scaleStat(1, lvl);
        const arm = scaleStat(1, lvl);
        const spd = kt.coerceAtMost(1 + kt.idiv(lvl, 3), 8);
        stats = new Stats({ maxHealth: hp, damage: dmg, armor: arm, speed: spd });
        break;
      }
    }

    const tier = lvl >= 7 ? GemTier.FLAWLESS : lvl >= 4 ? GemTier.POLISHED : GemTier.RAW;

    return new Gem({
      id: `gem_${type.name.toLowerCase()}_lvl${lvl}`,
      name: `${type.displayName} (Sv. ${lvl})`,
      type: type,
      level: lvl,
      tier: tier,
      stats: stats,
      lifestealPercent: lifesteal,
      armorPenetrationPercent: armorPen,
      stunChancePercent: stunChance,
      description: `Usta Kael'in tezgahında işlenmiş ${type.displayName}. Seviye ${lvl} cevher gücü barındırır.`,
      valueInGold: baseGold,
    });
  }
}
Data.register(Gem);

// ===========================================================================
// Adventure.kt
// ===========================================================================
/**
 * Efsanevi Canavar Avları ve Tehlikeli Keşif Seferleri
 */
export class Adventure extends Data {
  static T = 'Adventure';
  static defaults() {
    return {
      id: undefined,
      title: undefined,
      description: undefined,
      targetName: undefined,
      icon: undefined,
      durationSeconds: 35,
      elapsedSeconds: 0,
      isRunning: false,
      isFinished: false,
      isClaimed: false,
      requiredLevel: 2,
      requiredMinHpPercent: 40,
      requiredMinArmor: 0,
      requiredMinDamage: 0,
      requiredSupplyGold: 0,
      requiredSupplyItemName: null,
      baseSuccessChancePercent: 45,
      rewardGold: undefined,
      rewardExp: undefined,
      rewardMaterialId: undefined,
      rewardMaterialName: undefined,
      rewardMaterialIcon: undefined,
      rewardMaterialCount: 1,
      failureDamage: 20,
      failureNarrative: undefined,
    };
  }

  /**
   * Oyuncunun donanım gücü (Hasar, Zırh, Seviye) ile dinamik başarı oranını hesaplar.
   * Güçlü ekipmanlar başarı şansını ciddi biçimde yükseltir (%30 - %85 aralığı).
   */
  calculateSuccessChance(player) {
    const gearPower = player.totalStats.damage * 2 + player.totalStats.armor * 3 + player.level * 4;
    return kt.coerceIn(this.baseSuccessChancePercent + kt.idiv(gearPower, 2), 28, 85);
  }

  get progressPercent() {
    return this.durationSeconds > 0 ? kt.coerceIn(Math.fround(this.elapsedSeconds / this.durationSeconds), 0, 1) : 0;
  }
}
Data.register(Adventure);

/**
 * Koşullu ve Özel Nitelikli Efsanevi Eşyaların Üretim Reçetesi
 */
export class CraftingRecipe extends Data {
  static T = 'CraftingRecipe';
  static defaults() {
    return {
      id: undefined,
      resultItem: undefined,
      requiredMaterialId: undefined,
      requiredMaterialName: undefined,
      requiredMaterialIcon: undefined,
      requiredMaterialCount: 1,
      requiredGold: 30,
      description: undefined,
    };
  }
}
Data.register(CraftingRecipe);

// ===========================================================================
// ArenaDiscipline.kt
// ===========================================================================
/**
 * Arena Dövüş Disiplinleri ve Sekme Modelleri.
 * 1v1 Düello, 2v2 Kura, Silahsız Gösteri, Labirent 3v3, Bahis, Lig ve Günlük sekmeleri.
 */
export const ArenaDiscipline = kt.defineEnum('ArenaDiscipline', {
  SOLO_1V1: {
    tabIndex: 0,
    title: '1v1 Düello & Lig',
    shortTitle: '1v1',
    icon: '',
    badge: 'Lig Maçı',
    description: 'Geleneksel birebir arena kum çukuru ve garnizon puanlı lig karşılaşması.',
  },
  DUO_2V2: {
    tabIndex: 1,
    title: "2v2 İttifak Kur'ası",
    shortTitle: '2v2',
    icon: '',
    badge: 'Çark & Kura',
    description: 'Çarkın dönüşüyle rastgele bir yoldaş ve iki rakip gladyatörün eşleştiği, değişken zemin kurallı ikili ittifak arenası.',
  },
  UNARMED_SHOW: {
    tabIndex: 2,
    title: 'Silahsız Gösteri (Pankration)',
    shortTitle: 'Silahsız',
    icon: '',
    badge: 'Er Meydanı',
    description: 'Silah ve zırhların yasak olduğu; tekil canavarlara, yaratık sürülerini veya pehlivanlara karşı saf kas, çeviklik ve teknik gösterisi.',
  },
  LABYRINTH_3V3: {
    tabIndex: 3,
    title: 'Labirent (3v3 Katakomp)',
    shortTitle: 'Labirent',
    icon: '',
    badge: 'Taktik & Tuzak',
    description: 'Dehlizlerdeki dinamik tuzakların, dar koridorların ve 3 kişilik kura takımlarının katakomp hayatta kalma mücadelesi.',
  },
  BETTING: {
    tabIndex: 4,
    title: 'Tribün Bahisleri',
    shortTitle: 'Bahis',
    icon: '',
    badge: 'Tribün',
    description: 'Günün diğer gladyatör maçlarını canlı izleyip altın yatırarak kazanç elde etme alanı.',
  },
  LEAGUE_STANDINGS: {
    tabIndex: 5,
    title: 'Lig Puan Durumu',
    shortTitle: 'Lig',
    icon: '',
    badge: 'Puan Tablosu',
    description: 'Gladyatörlerin puan, galibiyet, mağlubiyet ve averaj tablosu.',
  },
  ARENA_LOGS: {
    tabIndex: 6,
    title: 'Arena Günlükleri',
    shortTitle: 'Günlük',
    icon: '',
    badge: 'Havadis',
    description: 'Arenadaki son dövüşler, tellal duyuruları ve gladyatör hareketleri.',
  },
});
/** companion object: fromIndex */
ArenaDiscipline.fromIndex = (index) => ArenaDiscipline.entries.find((it) => it.tabIndex === index) ?? ArenaDiscipline.SOLO_1V1;

// === 2v2 İttifak Modeli ve Zemin/Meydan Koşulu ===
export class BattlefieldCondition extends Data {
  static T = 'BattlefieldCondition';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      icon: undefined,
      focusStatName: undefined,
      description: undefined,
      tacticalHint: undefined,
    };
  }
}
Data.register(BattlefieldCondition);

export class DuoMatchState extends Data {
  static T = 'DuoMatchState';
  static defaults() {
    return {
      ally: null,
      enemy1: null,
      enemy2: null,
      condition: DuoMatchState.defaultConditions[0],
      isLotterySpinning: false,
      lotteryDrawn: false,
      entryFee: 15,
      rewardGold: 60,
      rewardExp: 90,
      rewardFame: 3,
    };
  }

  // companion object
  static defaultConditions = [
    new BattlefieldCondition({
      id: 'loose_sand',
      name: 'Gevşek Çöl Kumu',
      icon: '',
      focusStatName: 'Çeviklik ve Hız',
      description: 'Zemin derin ve batak kumla kaplı. Ağır zırhlı dövüşçüler batarken çevik ve hafif olanlar sıyrılarak çifte hamle vurur. Saf güç burada yavaş kalır!',
      tacticalHint: 'Hızı yüksek partnerler burada iki kat etkili olur.',
    }),
    new BattlefieldCondition({
      id: 'narrow_pass',
      name: 'Dar Taş Boğaz',
      icon: '',
      focusStatName: 'Dayanıklılık ve Kalkan',
      description: 'Meydan iki dev granit blokla daraltılmış. Manevra şansı yok; sadece sağlam kalkan, yüksek zırh ve canı olanlar ayakta kalır.',
      tacticalHint: 'Ağır zırhlı ve kalkanlı müttefikler hasarı göğüsler.',
    }),
    new BattlefieldCondition({
      id: 'wind_tempest',
      name: 'Kuzey Fırtınası Menfezi',
      icon: '',
      focusStatName: 'Taktik ve Dövüş Sanatları',
      description: 'Sur menfezinden esen dondurucu rüzgar gözleri yakıyor. Dövüş yeteneklerinin bekleme süresi hızlanır, sanatı güçlü olan üstün gelir.',
      tacticalHint: 'Güçlü yetenekleri olan gladyatörler maçı erkenden bitirir.',
    }),
    new BattlefieldCondition({
      id: 'blood_pit',
      name: 'Kızıl Çamur Çukuru',
      icon: '',
      focusStatName: 'Kondisyon ve Vahşet',
      description: 'Ayakların kaydığı kanlı çamurda kılıç tutmak bile hüner ister. Kritik vuruş şansı yükselir ve darbeler kemik çatlatır.',
      tacticalHint: 'Kritik hasarı yüksek savaşçılar ölümcül darbeler indirir.',
    }),
  ];
}
Data.register(DuoMatchState);

// === Silahsız Gösteri (Pankration) Modeli ===
export const UnarmedShowType = kt.defineEnum('UnarmedShowType', {
  SINGLE_BEAST: { title: 'Vahşi Canavar Boğuşması', icon: '', categoryName: 'Tekil Canavar' },
  BEAST_PACK: { title: 'Aç Kurt/Sırtlan Sürüsü', icon: '', categoryName: 'Yaratık Grubu' },
  GLADIATOR_BRAWL: { title: 'Garnizon Pehlivan Güreşi', icon: '', categoryName: 'Bilek Güreşi / İnsan' },
  AESTHETIC_DUEL: { title: 'Zarafet & Estetik Düellosu', icon: '', categoryName: 'Estetik / İnsan' },
});

export class UnarmedOpponent extends Data {
  static T = 'UnarmedOpponent';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      title: undefined,
      icon: undefined,
      showType: undefined,
      health: undefined,
      rawStrength: undefined,
      agility: undefined,
      endurance: undefined,
      description: undefined,
      combatStyle: undefined,
    };
  }
}
Data.register(UnarmedOpponent);

export class UnarmedMatchState extends Data {
  static T = 'UnarmedMatchState';
  static defaults() {
    return {
      selectedShowType: UnarmedShowType.SINGLE_BEAST,
      currentOpponent: null,
      showDrawn: false,
      entryFee: 10,
      rewardGold: 45,
      rewardExp: 75,
      rewardFame: 2,
    };
  }

  // companion object
  static sampleOpponents = [
    new UnarmedOpponent({
      id: 'unarmed_hyena',
      name: 'Yaralı Çöl Sırtlanı',
      title: 'Kemik Kıran Yırtıcı',
      icon: '',
      showType: UnarmedShowType.SINGLE_BEAST,
      health: 220,
      rawStrength: 24,
      agility: 20,
      endurance: 18,
      description: 'Arenanın demir kafesinden salınan, açlıktan gözü dönmüş ve güçlü çenesiyle kemik öğütebilen vahşi yırtıcı.',
      combatStyle: 'Çene kilitleri ve ani sıçramalar',
    }),
    new UnarmedOpponent({
      id: 'unarmed_bull',
      name: 'Kuduz Bozkır Boğası',
      title: 'Demir Boynuzlu Canavar',
      icon: '',
      showType: UnarmedShowType.SINGLE_BEAST,
      health: 290,
      rawStrength: 30,
      agility: 18,
      endurance: 24,
      description: 'Matador tarzı silahsız boğuşma için salınan, jilet gibi sivriltilmiş kalın boynuzlarıyla önüne çıkanı deşen iki tonluk azgın bozkır boğası.',
      combatStyle: 'Ölümcül toslama, boynuz savuruşu ve kumlara ezme',
    }),
    new UnarmedOpponent({
      id: 'unarmed_pack_2',
      name: '2 Kuduz Çöl Sırtlanı',
      title: 'İkili Çene Tuzağı',
      icon: '',
      showType: UnarmedShowType.BEAST_PACK,
      health: 230,
      rawStrength: 22,
      agility: 24,
      endurance: 16,
      description: 'Biri önden dikkat dağıtırken diğeri arkadan saldıran eşgüdümlü iki kuduz çöl sırtlanı.',
      combatStyle: 'Çapraz ısırma ve bacak tendonuna kilit',
    }),
    new UnarmedOpponent({
      id: 'unarmed_pack',
      name: '3 Aç Bozkır Tazısı',
      title: 'Sürü Avcıları',
      icon: '',
      showType: UnarmedShowType.BEAST_PACK,
      health: 260,
      rawStrength: 20,
      agility: 26,
      endurance: 16,
      description: 'Üç koldan saldıran, dövüşçünün etrafını sarıp bacaklarını hedef alan çevik ve koordineli av köpekleri.',
      combatStyle: 'Çevrelenme, dikkat dağıtma ve bilek koparma',
    }),
    new UnarmedOpponent({
      id: 'unarmed_pack_4',
      name: '4 Yırtıcı Dağ Kurdu',
      title: 'Dörtlü Kuşatma Sürüsü',
      icon: '',
      showType: UnarmedShowType.BEAST_PACK,
      health: 300,
      rawStrength: 22,
      agility: 28,
      endurance: 18,
      description: 'Arenanın dört köşesinden aynı anda fırlayan, alfa kurdun havlamalarıyla organize saldıran dört iri dağ kurdu.',
      combatStyle: 'Dört koldan koordineli atlayış, eti parçalama ve canlı kalkan baskısı',
    }),

    new UnarmedOpponent({
      id: 'unarmed_brawler',
      name: 'Demir Bilek Torok',
      title: 'Garnizon Baş Pehlivanı',
      icon: '',
      showType: UnarmedShowType.GLADIATOR_BRAWL,
      health: 320,
      rawStrength: 32,
      agility: 14,
      endurance: 28,
      description: 'Zırhsız, göğsü ayı postu gibi kıllı, iki metrelik devasa gövdesiyle rakiplerini havaya kaldırıp yere çalan eski bir maden işçisi.',
      combatStyle: 'Bel kündesi, kaburga sıkan ayı sarmalı ve kafa darbeleri',
    }),
    new UnarmedOpponent({
      id: 'unarmed_aesthetic_duelist',
      name: 'Saten Düellocu Leander',
      title: 'Gül Bahçesi Şampiyonu',
      icon: '',
      showType: UnarmedShowType.AESTHETIC_DUEL,
      health: 250,
      rawStrength: 20,
      agility: 28,
      endurance: 22,
      description: "Üzerinde Mirza Nizar'ın diktiği safir işlemeli ipek yelek ve saten şalvar taşıyan, kan dökmeden zarafetle rakibini pes ettiren güney ekolü bir saray düellocusu.",
      combatStyle: 'Turna sıyrılışı, kumaş yırtıcı eklem kilidi ve zarif çelme',
    }),
  ];
}
Data.register(UnarmedMatchState);

// === Labirent (3v3 Katakomp) Modeli ===
export class LabyrinthTrapCondition extends Data {
  static T = 'LabyrinthTrapCondition';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      icon: undefined,
      trapType: undefined,
      dangerLevel: undefined,
      testStat: undefined,
      description: undefined,
      floorEffect: undefined,
    };
  }
}
Data.register(LabyrinthTrapCondition);

export const LabyrinthTactic = kt.defineEnum('LabyrinthTactic', {
  BALANCED: { title: 'Dengeli Formasyon', icon: '', bonusDesc: 'Tüm takım eşit savunma ve hücum dengesini korur.' },
  VANGUARD_RUSH: { title: 'Öncü Tank Yarma', icon: '', bonusDesc: 'Öndeki güçlü savaşçı hasarı çeker, arkadakiler güvenle vurur.' },
  FLANK_AMBUSH: { title: 'Karanlıkta Çevik Pusu', icon: '', bonusDesc: 'Çevikliği yüksek dövüşçüler sütun arkasından ilk vuruş kritik şansı yakalar.' },
  TRAP_BAIT: { title: 'Tuzak Tuzağı', icon: '', bonusDesc: 'Düşmanları dehlizdeki zehirli oklara doğru geri çekerek tuzağa düşürür.' },
});

export class LabyrinthMatchState extends Data {
  static T = 'LabyrinthMatchState';
  static defaults() {
    return {
      floorNumber: 1,
      activeTrap: LabyrinthMatchState.defaultTraps[0],
      allies: [], // Siz hariç 2 müttefik
      opponents: [], // 3 rakip
      selectedTactic: LabyrinthTactic.BALANCED,
      matchDrawn: false,
      entryFee: 20,
      rewardGold: 85,
      rewardExp: 130,
      rewardFame: 4,
    };
  }

  // companion object
  static defaultTraps = [
    new LabyrinthTrapCondition({
      id: 'poison_darts',
      name: 'Zehirli Duvar Mazgalları',
      icon: '',
      trapType: 'Mekanik Basınç Plakası',
      dangerLevel: 'Yüksek',
      testStat: 'Çeviklik',
      description: 'Koridorun taş zeminine gizlenmiş basınç plakaları. Üzerine basıldığında duvardan yeşil zehirli iğneler fışkırır.',
      floorEffect: 'Çevikliği düşük olanlar her tur zehir hasarı alır.',
    }),
    new LabyrinthTrapCondition({
      id: 'rising_water',
      name: 'Yükselen Sarnıç Suyu',
      icon: '',
      trapType: 'Çevresel Tehdit',
      dangerLevel: 'Orta',
      testStat: 'Dayanıklılık',
      description: 'Surların tahliye vanası açılmış; bel hizasına kadar buz gibi su doluyor. Kılıç savurmak ağırlaşır, yorgunluk katlanır.',
      floorEffect: 'Hızlar %30 düşer, dayanıklılığı yüksek olanlar direnç gösterir.',
    }),
    new LabyrinthTrapCondition({
      id: 'falling_rubble',
      name: 'Çöken Antik Kemer',
      icon: '',
      trapType: 'Yapısal Çöküş',
      dangerLevel: 'Kritik',
      testStat: 'Farkındalık / Hız',
      description: 'Her gürültülü darbede tavandan keskin kireçtaşı blokları düşüyor. Dikkatsiz savaşçılar ezilme tehlikesiyle karşı karşıya.',
      floorEffect: 'Rastgele turlarda ağır darbe riski (%25 kaçınma şansı).',
    }),
  ];
}
Data.register(LabyrinthMatchState);

// ===========================================================================
// CharacterProfile.kt
// ===========================================================================
export const CharacterCategory = kt.defineEnum('CharacterCategory', {
  GLADIATOR: { title: 'Arena Gladyatörü', icon: '' },
  TOWN_FOLK: { title: 'Kasaba Sakini', icon: '' },
  GARRISON: { title: 'Garnizon Şahsiyeti', icon: '' },
});

export class CharacterProfile extends Data {
  static T = 'CharacterProfile';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      title: undefined,
      category: undefined,
      avatarIcon: undefined,
      roleOrWeapon: undefined,
      appearance: undefined,
      backgroundLore: undefined,
      isGladiator: false,
      enemyId: null,
      locationOrDuty: null,
      skills: [],
      regionId: 'kirlangic',
      defaultPsychology: null,
    };
  }
}
Data.register(CharacterProfile);

export class LiveCharacterProfile extends Data {
  static T = 'LiveCharacterProfile';
  static defaults() {
    return {
      profile: undefined,
      isUnlocked: undefined,
      liveEnemy: null,
      weakness: null,
      isWeaknessKnown: false,
    };
  }

  get effectivePsychology() {
    return this.liveEnemy?.personality?.psychology ?? this.profile.defaultPsychology;
  }
}
Data.register(LiveCharacterProfile);

// ===========================================================================
// Combat.kt
// ===========================================================================
export const CombatEvent = kt.defineEnum('CombatEvent', {
  HIT: {},
  CRITICAL: {},
  BLOCKED: {},
  DODGED: {},
  DEFEAT: {},
  DRAW: {},
});

export const TargetBodyPart = kt.defineEnum('TargetBodyPart', {
  HEAD: { turkishName: 'başı', locativeSuffix: 'başında', dativeSuffix: 'başına' },
  CHEST: { turkishName: 'göğsü', locativeSuffix: 'göğsünde', dativeSuffix: 'göğsüne' },
  SHOULDER: { turkishName: 'omzu', locativeSuffix: 'omzunda', dativeSuffix: 'omzuna' },
  ARM: { turkishName: 'kolu', locativeSuffix: 'kolunda', dativeSuffix: 'koluna' },
  LEG: { turkishName: 'bacağı', locativeSuffix: 'bacağında', dativeSuffix: 'bacağına' },
  SIDE: { turkishName: 'böğrü', locativeSuffix: 'böğründe', dativeSuffix: 'böğrüne' },
});

export class CombatLog extends Data {
  static T = 'CombatLog';
  static defaults() {
    return {
      round: undefined,
      narrativeText: undefined,
      attackerName: undefined,
      defenderName: undefined,
      event: undefined,
      damage: undefined,
      defenderHpLeft: undefined,
      defenderMaxHp: undefined,
      isPlayerAttacker: undefined,
    };
  }
}
Data.register(CombatLog);

export class HandicapBet extends Data {
  static T = 'HandicapBet';
  static defaults() {
    return { id: undefined, title: undefined, description: undefined, multiplier: undefined, betAmount: 0 };
  }
}
Data.register(HandicapBet);

export class CombatResult extends Data {
  static T = 'CombatResult';
  static defaults() {
    return {
      isPlayerWinner: undefined,
      isDraw: false,
      totalRounds: undefined,
      totalPlayerDamage: undefined,
      totalEnemyDamage: undefined,
      finalPlayerHp: undefined,
      logs: undefined,
      earnedGold: undefined,
      earnedExp: undefined,
      earnedFame: undefined,
      droppedItem: null,
      betWon: false,
      betEarnings: 0,
    };
  }
}
Data.register(CombatResult);

export class SpectatorCombatResult extends Data {
  static T = 'SpectatorCombatResult';
  static defaults() {
    return {
      fighter1: undefined,
      fighter2: undefined,
      selectedFighterName: undefined,
      betAmount: undefined,
      winnerName: undefined, // String? (zorunlu, null olabilir)
      isDraw: undefined,
      logs: undefined,
      betWon: undefined,
      betWinnings: undefined,
    };
  }
}
Data.register(SpectatorCombatResult);

// ===========================================================================
// CompanionBond.kt
// ===========================================================================
/**
 * Kızıl Kadife Köşkü & Gizli Divan diyalog seçim seçeneği.
 */
export class CompanionChoice extends Data {
  static T = 'CompanionChoice';
  static defaults() {
    return {
      id: undefined,
      choiceSummary: undefined,
      playerSpeechText: undefined,
      narrativeResponse: undefined,
      attitudeBadge: undefined,
    };
  }
}
Data.register(CompanionChoice);

/**
 * Bir kademe (ziyaret) içerisindeki 5 ardışık konuşma turundan biri.
 */
export class CompanionRound extends Data {
  static T = 'CompanionRound';
  static defaults() {
    return {
      roundNumber: undefined, // 1..5
      roundTitle: undefined,
      roundPrompt: undefined,
      choices: undefined, // 3 seçenek
    };
  }
}
Data.register(CompanionRound);

/**
 * Bir ziyaretin tüm aşamalarını barındıran Kademe verisi (Toplam 5 Tur x 3 Seçenek = 15 Seçenek).
 */
export class CompanionKademe extends Data {
  static T = 'CompanionKademe';
  static defaults() {
    return {
      kademeLevel: undefined, // 1..5
      kademeTitle: undefined,
      introAmbiance: undefined,
      rounds: undefined,
      conclusionFarewell: undefined,
    };
  }
}
Data.register(CompanionKademe);

/**
 * 5. Kademeye (veya zirve bağa) ulaşıldığında gerçekleşen edebi vuslat sahnesi.
 */
export class CompanionCulmination extends Data {
  static T = 'CompanionCulmination';
  static defaults() {
    return {
      title: undefined,
      prelude: undefined,
      passionNarrative: undefined,
      morningAfterNarrative: undefined,
      buffRewardTitle: undefined,
      buffRewardDescription: undefined,
      futureBasePledge: undefined,
    };
  }
}
Data.register(CompanionCulmination);

/**
 * Bir karakterin köşk içerisindeki tüm kademeleri, turları ve vuslat verileri.
 */
export class CompanionData extends Data {
  static T = 'CompanionData';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      title: undefined,
      avatarIcon: undefined,
      salonTier: undefined, // 1: Kehribar (2500 Altın), 2: Yeşim (5000 Altın)
      salonName: undefined,
      geographicOrigin: undefined,
      appearanceSnippet: undefined,
      kademeler: undefined,
      culmination: undefined,
    };
  }
}
Data.register(CompanionData);

/**
 * Aktif olarak süren köşk buluşması oturumu.
 */
export class ActiveCompanionSession extends Data {
  static T = 'ActiveCompanionSession';
  static defaults() {
    return {
      companion: undefined,
      kademeLevel: 1, // 1..5
      currentRoundIndex: 0, // 0..4 (Her kademedeki 5 konuşma turu)
      selectedChoice: null,
      isShowingChoiceResponse: false,
      isKademeCompleted: false,
      isCulminationReached: false,
      isRepeatCulmination: false,
    };
  }
}
Data.register(ActiveCompanionSession);

// ===========================================================================
// DayState.kt
// ===========================================================================
export class SpectatorBet extends Data {
  static T = 'SpectatorBet';
  static defaults() {
    return {
      matchId: undefined,
      fighter1Name: undefined,
      fighter2Name: undefined,
      selectedFighterName: undefined,
      betAmount: undefined,
      potentialMultiplier: 2.0,
      isResolved: false,
    };
  }

  get potentialReturn() {
    return kt.toInt(this.betAmount * this.potentialMultiplier);
  }
}
Data.register(SpectatorBet);

export class DayState extends Data {
  static T = 'DayState';
  static defaults() {
    return {
      currentDay: 1,
      isArenaMatchDoneToday: false,
      isDailySpectatorBetPlaced: false,
      activeSpectatorBet: null,
      dailyDiceGamesPlayed: 0,
      maxDiceGamesPerDay: 5,
      isDailyTrainingDone: false,
      dailyMealsEaten: 0,
      maxMealsPerDay: 3,
      dailyEavesdropsDone: 0,
      maxEavesdropsPerDay: 3,
      lastDawnNarrative: null,
    };
  }

  /**
   * Gün atlayabilmek için oyuncunun o gün ya arenada kendi maçına çıkmış olması,
   * ya da arenadaki başka bir maça seyirci bahsi yatırmış olması zorunludur.
   */
  get isDailyArenaObligationMet() {
    return this.isArenaMatchDoneToday || this.isDailySpectatorBetPlaced;
  }

  get canFightArenaToday() {
    return !this.isArenaMatchDoneToday;
  }

  get canPlayDiceToday() {
    return this.dailyDiceGamesPlayed < this.maxDiceGamesPerDay;
  }

  get canEavesdropToday() {
    return this.dailyEavesdropsDone < this.maxEavesdropsPerDay;
  }

  get remainingEavesdrops() {
    return kt.coerceAtLeast(this.maxEavesdropsPerDay - this.dailyEavesdropsDone, 0);
  }

  get canTrainToday() {
    return !this.isDailyTrainingDone;
  }

  get canEatMealToday() {
    return this.dailyMealsEaten < this.maxMealsPerDay;
  }
}
Data.register(DayState);

// ===========================================================================
// DuoCombat.kt
// ===========================================================================
export const DuoTeam = kt.defineEnum('DuoTeam', {
  TEAM_BLUE: {}, // Oyuncu ve Yoldaşı (Mavi Köşe)
  TEAM_RED: {}, // Rakip İttifak Gladyatörleri (Kırmızı Köşe)
});

/**
 * 2v2 Savaşında iki yoldaş arasındaki taktiksel ve niteliksel uyum türü.
 */
export const DuoSynergyType = kt.defineEnum('DuoSynergyType', {
  TANK_AND_STRIKER: {
    title: 'Kalkan & Çekiç Dengesi',
    icon: '',
    description: 'Biri darbeleri göğüsleyip dikkati çekerken diğeri açılan gedikten ölümcül infaz darbeleri indirir.',
  },
  TWIN_SHADOWS: {
    title: 'Çifte Gölge Kıskacı',
    icon: '',
    description: 'İki çevik avcı aynı anda iki kanattan süzülerek hasmın kör noktalarını çapraz ateşe alır.',
  },
  SPELL_AND_STEEL: {
    title: 'Büyü & Çelik Rezonansı',
    icon: '',
    description: 'Arkadan gelen elementel baskı ve menzilli destek, ön saftaki savaşçının yolunu açar.',
  },
  IRON_PHALANX: {
    title: 'Aşılmaz İkiz Sur',
    icon: '',
    description: 'İki ağır zırhlı omuz omuza vererek dar alanda aşılmaz bir savunma barikatı kurar.',
  },
  TACTICAL_DISRUPTOR: {
    title: 'Taktiksel Zaaf Avcıları',
    icon: '',
    description: 'Biri hasmı sersemletip dengesini bozarken diğeri kanayan yaraya acımasızca yüklenir.',
  },
  BALANCED_COHESION: {
    title: 'Dengeli Muharebe İttifakı',
    icon: '',
    description: 'Nitelikleri birbirini dengeleyen, disiplinli ve senkronize bir takım çalışması.',
  },
});

/**
 * 2v2 Savaşında dövüşçülerin kişilik, mizaç ve hız uyumsuzluğundan kaynaklanan sürtüşmeler.
 */
export const DuoDiscordType = kt.defineEnum('DuoDiscordType', {
  RECKLESS_BERSERK: {
    title: 'Vahşet Kargaşası & Kabza Çarpışması',
    icon: '',
    penaltyDescription: 'İki gözü dönmüş savaşçı aynı anda savrulunca silahlarının kabzaları birbirine çarpar ve hamle ıskalanır.',
  },
  SPEED_GAP: {
    title: 'Kopuk Muharebe Ritimleri',
    icon: '',
    penaltyDescription: 'Çevik dövüşçü tek başına ileri fırlayıp 2 hedefin ortasında kalırken ağır müttefiki geride yetişemez.',
  },
  GREEDY_RIVALRY: {
    title: 'Şan Hırsı & Hedef Rekabeti',
    icon: '',
    penaltyDescription: 'İki kibirli savaşçı son vuruşu yapma hırsıyla birbirinin önünü kesip savunma gardını düşürür.',
  },
  CROWDED_CHAOS: {
    title: 'Dar Alan Manevra Kısıtı',
    icon: '',
    penaltyDescription: 'Meydanın darlığında geniş silah savuruşları yoldaşın hareket alanını kısıtlar.',
  },
  NONE: {
    title: 'Kusursuz Koordinasyon',
    icon: '',
    penaltyDescription: 'Sürtüşme yok.',
  },
});

/**
 * 2v2 İttifak dövüşünün nihai neticesi ve istatistikleri.
 */
export class DuoCombatResult extends Data {
  static T = 'DuoCombatResult';
  static defaults() {
    return {
      isPlayerWinner: undefined,
      isDraw: false,
      totalRounds: undefined,
      player: undefined,
      ally: undefined,
      enemy1: undefined,
      enemy2: undefined,
      condition: undefined,
      finalPlayerHp: undefined,
      finalAllyHp: undefined,
      finalEnemy1Hp: undefined,
      finalEnemy2Hp: undefined,
      totalTeamDamage: undefined,
      totalOpponentDamage: undefined,
      logs: undefined,
      earnedGold: undefined,
      earnedExp: undefined,
      earnedFame: undefined,
      synergyHighlights: [],
      discordIncidents: [],
    };
  }
}
Data.register(DuoCombatResult);

export class DuoFighterLiveHp extends Data {
  static T = 'DuoFighterLiveHp';
  static defaults() {
    return {
      playerHp: undefined,
      playerMaxHp: undefined,
      allyHp: undefined,
      allyMaxHp: undefined,
      enemy1Hp: undefined,
      enemy1MaxHp: undefined,
      enemy2Hp: undefined,
      enemy2MaxHp: undefined,
    };
  }
}
Data.register(DuoFighterLiveHp);

// ===========================================================================
// FighterPersonality.kt
// ===========================================================================
/**
 * Arenadaki yapay zekalı gladyatörlerin bilinç ve yaşam tarzı arketipleri.
 */
export const PersonalityArchetype = kt.defineEnum('PersonalityArchetype', {
  HIRSLI: {
    title: 'Hırslı & Disiplinli',
    icon: '',
    description: 'Kazandığı tüm altını demircide silah dövdürmeye, çelik perçinlere ve kum torbası talimlerine harcar. Nitelikleri düzenli artar.',
  },
  TEMBEL: {
    title: 'Tembel & Keyifçi',
    icon: '',
    description: "Kazandığı parayı Kırlangıç Hanı'nda kumara ve fıçılara döker. Bazen kumarda zengin olur veya şanslı muska bulur; bazen de ertesi gün arenaya baş ağrısıyla (Mahmur) çıkar.",
  },
  VAHSI: {
    title: 'Vahşi & Acımasız',
    icon: '',
    description: 'Savunmayı ve zırhı zayıflık sayar. Bütün enerjisini silahlarını jilet gibi bilemeye ve acımasız kanatıcı vuruşlara adar.',
  },
  KURNAZ: {
    title: 'Kurnaz & Fırsatçı',
    icon: '',
    description: 'Arenadaki maçlara gizlice bahis oynar, zehirli ot karışımları satın alır ve hasmını yorup sıyrılma taktikleri geliştirir.',
  },
  GURURLU: {
    title: 'Onurlu Şövalye',
    icon: '',
    description: 'Kalkanını usta zırhçılara perçinletir, ağır zırhını parlatır ve savunma disiplinini mükemmelleştirir. Hileye asla başvurmaz.',
  },
  GIZEMLI: {
    title: 'Mistik Münzevi',
    icon: '',
    description: 'Tuz çölü kehanetleri, karga kemiği muskaları ve kadim mühürlerle dövüşür. Sezgileriyle rakiplerinin hamlelerini boşa çıkarır.',
  },
});

/**
 * Bir gladyatörün dinamik bilinci, mali durumu, geçici sağlık/moral durumu ve günlük kayıtları.
 */
export class FighterPersonality extends Data {
  static T = 'FighterPersonality';
  static defaults() {
    return {
      archetype: undefined,
      bio: undefined,
      gold: 20,
      currentCondition: null,
      latestDiary: 'Arenanın kumu üzerinde yeni rakiplerini süzüyor.',
      diaryHistory: [],
      psychology: undefined, // varsayılan: FighterPsychology.fromArchetype(archetype) (constructor'da)
    };
  }
  constructor(args) {
    super(args);
    if ((args == null || args.psychology == null) && this.archetype != null) {
      this.psychology = FighterPsychology.fromArchetype(this.archetype);
    }
  }
}
Data.register(FighterPersonality);

// ===========================================================================
// FighterPsychology.kt
// ===========================================================================
// Kotlin Float aritmetiği (Int * 0.4f, toplama/çıkarma) — eşik karşılaştırmaları aynı çıksın diye 32 bit yuvarlama.
const F = Math.fround;
const fmul = (i, c) => F(i * F(c));

/**
 * Bir gladyatörün veya karakterin psikolojik, duygusal ve ahlaki eğilim matrisi.
 * Tüm değerler 0..100 arasında normalize edilmiştir.
 */
export class FighterPsychology extends Data {
  static T = 'FighterPsychology';
  static defaults() {
    return {
      loyalty: 50, // 0-100: Sadakat & Müttefike Bağlılık
      treachery: 20, // 0-100: İhanet & Arkadan Vurma Riski
      pragmatism: 60, // 0-100: Çıkar & Bencillik / Faydacılık
      ambition: 70, // 0-100: Hırs & İhtiras (Zirve arzusu)
      pride: 50, // 0-100: Onur & Gurur (Kalleşliği kendine yedirememe)
      apathy: 20, // 0-100: Boşvermişlik & Kayıtsızlık (Umursamazlık)
      wildInstinct: 30, // 0-100: Vahşi İçgüdü / Kaotik Fevrilik (Dürtüsel karar)
    };
  }

  /**
   * Baskın olan ilk 2 psikolojik özelliği ve kısa tanımını döner.
   */
  get dominantTraits() {
    const list = [
      new PsychologyTraitSummary({ name: 'Sadakat & Dostluk', value: this.loyalty, icon: '', description: getLoyaltyDesc(this.loyalty) }),
      new PsychologyTraitSummary({ name: 'İhanet Riski', value: this.treachery, icon: '', description: getTreacheryDesc(this.treachery) }),
      new PsychologyTraitSummary({ name: 'Çıkar & Bencillik', value: this.pragmatism, icon: '', description: getPragmatismDesc(this.pragmatism) }),
      new PsychologyTraitSummary({ name: 'Hırs & İhtiras', value: this.ambition, icon: '', description: getAmbitionDesc(this.ambition) }),
      new PsychologyTraitSummary({ name: 'Onur & Gurur', value: this.pride, icon: '', description: getPrideDesc(this.pride) }),
      new PsychologyTraitSummary({ name: 'Boşvermişlik', value: this.apathy, icon: '', description: getApathyDesc(this.apathy) }),
      new PsychologyTraitSummary({ name: 'Vahşi İçgüdü', value: this.wildInstinct, icon: '', description: getInstinctDesc(this.wildInstinct) }),
    ];
    return kt.take(kt.sortedByDescending(list, (it) => it.value), 2);
  }

  /**
   * Karakterin genel mizaç rozeti.
   */
  get behavioralBadge() {
    if (this.wildInstinct >= 80) return 'Kaotik & İçgüdüsel';
    if (this.treachery >= 70) return 'Tehlikeli Fırsatçı';
    if (this.pride >= 80 && this.treachery <= 25) return 'Onurlu Savaşçı';
    if (this.loyalty >= 75) return 'Sadık Yoldaş';
    if (this.apathy >= 75) return 'Duyarsız & Kayıtsız';
    if (this.pragmatism >= 75) return 'Soğuk Hesapçı';
    if (this.ambition >= 80) return 'İhtiraslı Yırtıcı';
    return 'Dengeli Mizaç';
  }

  // ==============================================================
  // KARAR MEKANİZMALARI (YÜZDELİK HESAP + İÇGÜDÜSEL KAOS ZARI)
  // ==============================================================

  /**
   * Labirentte veya arenada ittifak teklifi geldiğinde verilen tepki.
   */
  evaluateAllianceOffer(chaosRoll = kt.Random.nextInt(100)) {
    // %15 İçgüdüsel Sapma (Wildcard roll): Mantığı hiçe sayıp kafasına göre takılma
    if (chaosRoll < kt.coerceIn(kt.idiv(this.wildInstinct, 4), 5, 25)) {
      return chaosRoll % 2 === 0 ? AllianceDecision.CHAOTIC_ACCEPT : AllianceDecision.CHAOTIC_REFUSE;
    }

    // Normal psikolojik hesap:
    // Gurur + Sadakat + Pragmatizm ittifaka meyillidir; aşırı İhanet veya Boşvermişlik reddeder/saldırır
    const acceptanceScore = F(F(F(fmul(this.loyalty, 0.4) + fmul(this.pragmatism, 0.35)) + fmul(this.pride, 0.25)) - fmul(this.apathy, 0.3));
    if (acceptanceScore >= 60) return AllianceDecision.HONORABLE_ALLIANCE;
    if (acceptanceScore >= 35 && this.treachery >= 50) return AllianceDecision.SUSPICIOUS_ALLIANCE_WITH_BACKSTAB_INTENT;
    if (acceptanceScore >= 35) return AllianceDecision.PRAGMATIC_TEMPORARY_TRUCE;
    if (this.apathy >= 70) return AllianceDecision.INDIFFERENT_IGNORE;
    return AllianceDecision.HOSTILE_REFUSAL;
  }

  /**
   * Kilitli veya değerli bir sandık/ganimet bulunduğunda verilecek tepki.
   */
  evaluateLootDilemma(isAllyPresent, chaosRoll = kt.Random.nextInt(100)) {
    if (!isAllyPresent) return LootAction.OPEN_AND_TAKE;

    // İçgüdüsel sapma zarı
    if (chaosRoll < kt.coerceIn(kt.idiv(this.wildInstinct, 4), 5, 20)) {
      return LootAction.CHAOTIC_FIGHT_FOR_ALL;
    }

    const greedScore = F(
      F(F(F(fmul(this.ambition, 0.5) + fmul(this.pragmatism, 0.35)) + fmul(this.treachery, 0.35)) - fmul(this.loyalty, 0.4)) - fmul(this.pride, 0.3),
    );
    if (greedScore >= 65 && this.treachery >= 60) return LootAction.BETRAY_AND_STRIKE;
    if (greedScore >= 45) return LootAction.DEMAND_LION_SHARE;
    if (this.loyalty >= 60 || this.pride >= 65) return LootAction.FAIR_SHARE;
    if (this.apathy >= 70) return LootAction.LEAVE_LOOT_TO_ALLY;
    return LootAction.COMPETITIVE_SPLIT;
  }

  /**
   * Müttefikin canı %25'in altına düştüğünde (ölüm eşiği) verilecek tepki.
   */
  evaluateCrisisResponse(chaosRoll = kt.Random.nextInt(100)) {
    // İçgüdüsel sapma
    if (chaosRoll < kt.coerceIn(kt.idiv(this.wildInstinct, 4), 5, 20)) {
      return chaosRoll % 2 === 0 ? CrisisAction.BERSERK_RESCUE : CrisisAction.PANIC_FLEE;
    }

    const braveryAndBond = F(F(F(fmul(this.loyalty, 0.6) + fmul(this.pride, 0.4)) - fmul(this.apathy, 0.3)) - fmul(this.treachery, 0.3));
    if (braveryAndBond >= 60) return CrisisAction.SHIELD_AND_DEFEND_ALLY;
    if (this.treachery >= 70 && this.pragmatism >= 60) return CrisisAction.SACRIFICE_ALLY_AND_FLEE;
    if (this.pragmatism >= 55) return CrisisAction.TACTICAL_RETREAT;
    if (this.apathy >= 75) return CrisisAction.COLD_INDIFFERENCE;
    return CrisisAction.LAST_STAND_FIGHT;
  }

  // --- companion object ---
  /**
   * Karakteristik arketipe göre varsayılan zihinsel profil oluşturucu.
   */
  static fromArchetype(archetype) {
    switch (archetype) {
      case PersonalityArchetype.HIRSLI:
        return new FighterPsychology({ loyalty: 45, treachery: 35, pragmatism: 80, ambition: 95, pride: 70, apathy: 5, wildInstinct: 40 });
      case PersonalityArchetype.TEMBEL:
        return new FighterPsychology({ loyalty: 55, treachery: 15, pragmatism: 40, ambition: 15, pride: 30, apathy: 90, wildInstinct: 35 });
      case PersonalityArchetype.VAHSI:
        return new FighterPsychology({ loyalty: 35, treachery: 30, pragmatism: 40, ambition: 85, pride: 45, apathy: 10, wildInstinct: 95 });
      case PersonalityArchetype.KURNAZ:
        return new FighterPsychology({ loyalty: 20, treachery: 80, pragmatism: 90, ambition: 80, pride: 25, apathy: 20, wildInstinct: 45 });
      case PersonalityArchetype.GURURLU:
        return new FighterPsychology({ loyalty: 85, treachery: 10, pragmatism: 35, ambition: 70, pride: 95, apathy: 15, wildInstinct: 20 });
      case PersonalityArchetype.GIZEMLI:
        return new FighterPsychology({ loyalty: 60, treachery: 20, pragmatism: 50, ambition: 40, pride: 60, apathy: 65, wildInstinct: 50 });
    }
    throw new Error('Bilinmeyen arketip: ' + archetype);
  }
}
Data.register(FighterPsychology);

// FighterPsychology companion private işlevleri
function getLoyaltyDesc(v) {
  if (v >= 80) return 'Canı pahasına yoldaşını savunur, ihanetten nefret eder.';
  if (v >= 50) return 'İttifaka saygı duyar, şartlar zorlaşmadıkça satmaz.';
  if (v >= 30) return 'Gevşek sadakat; zora düştüğü an bağları koparır.';
  return 'Sadakat kavramı yoktur; herkes harcanabilir bir piyondur.';
}

function getTreacheryDesc(v) {
  if (v >= 75) return 'Tehlikeli fırsatçı! Avantaj gördüğü an sırtından hançerler.';
  if (v >= 50) return 'Kendi çıkarı tehlikeye girdiğinde kalleşlik yapabilir.';
  if (v >= 25) return 'Düşük ihanet riski; mecbur kalmadıkça arkadan vurmaz.';
  return 'Asla kalleşlik yapmaz; arkadan vurmayı onursuzluk sayar.';
}

function getPragmatismDesc(v) {
  if (v >= 80) return 'Soğuk hesapçı. Kararlarını duyguyla değil kâr/zararla alır.';
  if (v >= 50) return 'Dengeli; kârlı iş birliklerine açıktır.';
  return 'Çıkardan ziyade duygu, gurur veya dürtülerle hareket eder.';
}

function getAmbitionDesc(v) {
  if (v >= 85) return 'Gözü dönmüş bir şampiyonluk ve liderlik hırsı taşır.';
  if (v >= 50) return 'Gelişmek ve kazanmak ister ama gözü tamamen kör değildir.';
  return 'Mütevazı; zirve tutkusu ya da güç açlığı yoktur.';
}

function getPrideDesc(v) {
  if (v >= 85) return 'Kibir ve onur abidesi! Aşağılanmaya asla tahammülü yoktur.';
  if (v >= 50) return 'Öz saygısı yüksektir, mertçe dövüşü tercih eder.';
  return 'Onur umurunda değildir; kazanmak için çamura yatmaktan çekinmez.';
}

function getApathyDesc(v) {
  if (v >= 80) return 'Tam bir vurdumduymaz; hayatı ve ölümü umursamaz.';
  if (v >= 50) return 'Ağırkanlı ve sakin; olaylara kolay kolay paniklemez.';
  return 'Aşırı duyarlı, gergin ve her kıpırtıya tepki veren tetikte mizaç.';
}

function getInstinctDesc(v) {
  if (v >= 80) return 'Yabani dürtülerle hareket eder; mantık dinlemez, kaotiktir.';
  if (v >= 50) return 'Tehlike anında içgüdülerine kulak verir.';
  return 'Disiplinli, soğukkanlı ve planlı dövüşür.';
}

export class PsychologyTraitSummary extends Data {
  static T = 'PsychologyTraitSummary';
  static defaults() {
    return { name: undefined, value: undefined, icon: undefined, description: undefined };
  }
}
Data.register(PsychologyTraitSummary);

export const AllianceDecision = kt.defineEnum('AllianceDecision', {
  HONORABLE_ALLIANCE: {
    title: 'Onurlu İttifak',
    narrative: "Kılıcını kınına soktu ve gözlerini dikerek elini uzattı: 'Bu zindandan ancak sırt sırta vererek çıkabiliriz yoldaş!'",
  },
  PRAGMATIC_TEMPORARY_TRUCE: {
    title: 'Çıkar Amaçlı Ateşkes',
    narrative: "Soğuk bir süzüşün ardından başını salladı: 'Sana güvenmiyorum ama şimdilik birbirimizi öldürmemek iki tarafın da işine gelir.'",
  },
  SUSPICIOUS_ALLIANCE_WITH_BACKSTAB_INTENT: {
    title: 'Sinsi Yanaşma',
    narrative: "Dudaklarında sahte bir tebessüm belirdi: 'Elbette dostum, birlikte yürüyelim...' (Gözleri gizlice sırtındaki zayıf noktayı süzüyor).",
  },
  INDIFFERENT_IGNORE: {
    title: 'Umursamaz Kayıtsızlık',
    narrative: "Esneyerek arkasını döndü ve kılıcını bile çekmeden mırıldandı: 'Yolumdan çekil, kiminle savaştığın zerre umurumda değil.'",
  },
  HOSTILE_REFUSAL: {
    title: 'Düşmanca Reddediş',
    narrative: "Kılıcını öfkeyle çekti: 'Buradan sadece birimiz sağ çıkacak, boş lakırdıyı kes!'",
  },
  CHAOTIC_ACCEPT: {
    title: 'İçgüdüsel Kabul',
    narrative: "Bir an boş gözlerle baktıktan sonra aniden kahkaha attı ve yanına geçti: 'Hah! Bakalım kader bizi nereye sürükleyecek!'",
  },
  CHAOTIC_REFUSE: {
    title: 'Fevri Saldırı',
    narrative: 'Hiçbir mantık gözetmeksizin aniden vahşi bir çığlık atarak üzerine atıldı!',
  },
});

export const LootAction = kt.defineEnum('LootAction', {
  OPEN_AND_TAKE: { title: 'Tek Başına Al', narrative: 'Sandığı açtı ve ganimeti doğrudan heybesine attı.' },
  FAIR_SHARE: { title: 'Adil Paylaşım', narrative: "Ganimeti yere serdi ve adilce bölüştü: 'Yoldaşlık payı haktır, buyur payını al.'" },
  COMPETITIVE_SPLIT: { title: 'Pazarlıkla Bölüşüm', narrative: 'Ganimet üzerinde kısa bir pazarlık yapıp paylaştılar.' },
  DEMAND_LION_SHARE: {
    title: 'Aslan Payı Dayatması',
    narrative: "Göğsünü kabartıp sandığın önüne dikildi: 'Bu dövüşün yükünü ben çektim, aslan payı benimdir!'",
  },
  BETRAY_AND_STRIKE: {
    title: 'Sırtından Hançerleme',
    narrative: "Ganimet parıltısı gözünü bürüdü! Arkası dönük müttefikine ölümcül bir darbe indirdi: 'Bunu paylaşmaya hiç niyetim yok!'",
  },
  LEAVE_LOOT_TO_ALLY: { title: 'Ganimeti Bırakma', narrative: "Omuz silkerek uzaklaştı: 'İncik boncukla işim olmaz, hepsi senin olsun.'" },
  CHAOTIC_FIGHT_FOR_ALL: { title: 'Kaotik Hırgür', narrative: 'Ganimeti kapmak için aniden hırlayarak müttefikinin üzerine atıldı!' },
});

export const CrisisAction = kt.defineEnum('CrisisAction', {
  SHIELD_AND_DEFEND_ALLY: {
    title: 'Müttefike Siper Olma',
    narrative: "Yaralı yoldaşının önüne kalkan gibi atıldı: 'Arkamda kal! Henüz son sözümüzü söylemedik!'",
  },
  LAST_STAND_FIGHT: { title: 'Sonuna Kadar Direniş', narrative: 'Sırtını duvara verip dişlerini sıktı; son nefesine kadar vuruşmaya devam etti.' },
  TACTICAL_RETREAT: {
    title: 'Taktiksel Geri Çekilme',
    narrative: "Müttefikinin koluna asıldı: 'Burada ölmenin alemi yok, geri çekilip toparlanmalıyız!'",
  },
  COLD_INDIFFERENCE: {
    title: 'Kayıtsızca İzleme',
    narrative: 'Yere yığılan müttefikine soğuk gözlerle baktı; ne yardım etti ne de kılını kıpırdattı.',
  },
  SACRIFICE_ALLY_AND_FLEE: {
    title: 'Müttefiki Yem Edip Kaçma',
    narrative: 'Dostunun düşüşünü fırsat bildi! Canavarlar yaralı bedenle meşgul olurken karanlık dehlizlere doğru sıvıştı.',
  },
  BERSERK_RESCUE: {
    title: 'Gözü Dönmüş Kurtarma',
    narrative: 'Dostunun kanını görünce vahşi bir çığlıkla aklını yitirdi ve düşmanların üzerine bir kasırga gibi çullandı!',
  },
  PANIC_FLEE: {
    title: 'Panik Halinde Kaçış',
    narrative: 'Korku aklını başından aldı; silahını bile düşürerek çığlıklar içinde gerisin geri kaçtı.',
  },
});

// ===========================================================================
// Enemy.kt
// ===========================================================================
export class Enemy extends Data {
  static T = 'Enemy';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      title: undefined,
      level: undefined,
      stats: undefined,
      weaponName: undefined,
      weaponType: 'kılıç',
      description: undefined,
      rewardGold: undefined,
      rewardExp: undefined,
      rewardFame: undefined,
      lootDrop: null,
      personality: undefined, // varsayılan: FighterPersonality(archetype = HIRSLI, bio = description) (constructor'da)
      skills: [],
      socketedGems: [],
      shards: {},
      equippedWeaponItem: null,
      equippedShieldItem: null,
      regionId: 'kirlangic',
    };
  }
  constructor(args) {
    super(args);
    if (args == null || args.personality == null) {
      this.personality = new FighterPersonality({ archetype: PersonalityArchetype.HIRSLI, bio: this.description });
    }
  }

  get totalStats() {
    let combined = this.stats;
    if (this.equippedWeaponItem != null) combined = combined.plus(this.equippedWeaponItem.totalStats);
    if (this.equippedShieldItem != null) combined = combined.plus(this.equippedShieldItem.totalStats);
    return combined;
  }

  get specialTraits() {
    return kt.filterNotNull([this.equippedWeaponItem?.specialTrait, this.equippedShieldItem?.specialTrait]);
  }

  get lifestealPercent() {
    return (this.equippedWeaponItem?.lifestealPercent ?? 0) + (this.equippedShieldItem?.lifestealPercent ?? 0);
  }

  get armorPenPercent() {
    return (this.equippedWeaponItem?.armorPenetrationPercent ?? 0) + (this.equippedShieldItem?.armorPenetrationPercent ?? 0);
  }

  get stunChancePercent() {
    return (this.equippedWeaponItem?.stunChancePercent ?? 0) + (this.equippedShieldItem?.stunChancePercent ?? 0);
  }

  equip(item) {
    if (item.slot === EquipmentSlot.SHIELD) {
      return this.copy({ equippedShieldItem: item });
    }
    return this.copy({
      equippedWeaponItem: item,
      weaponName: item.name,
      weaponType: item.weaponType,
    });
  }
}
Data.register(Enemy);

export class FighterDossier extends Data {
  static T = 'FighterDossier';
  static defaults() {
    return { enemy: undefined, weakness: undefined, isWeaknessKnown: undefined };
  }
}
Data.register(FighterDossier);

// ===========================================================================
// EnemyWeakness.kt
// ===========================================================================
export class EnemyWeakness extends Data {
  static T = 'EnemyWeakness';
  static defaults() {
    return {
      enemyId: undefined,
      enemyName: undefined,
      flawTitle: undefined,
      hintDescription: undefined,
      combatExploitPhrase: undefined,
      intelCostGold: 30,
      exploitChancePercent: 35, // %35 ihtimalle hamlelerde açığı yakalar
      bonusDamagePercent: 40, // %40 ek hasar sağlar
    };
  }
}
Data.register(EnemyWeakness);

// ===========================================================================
// GladiatorSkill.kt
// ===========================================================================
export const SkillType = kt.defineEnum('SkillType', {
  ATTACK: { displayName: 'Taarruz', icon: '' },
  DEFENSE: { displayName: 'Savunma', icon: '' },
  TACTICAL: { displayName: 'Taktik & Kurnazlık', icon: '' },
  ULTIMATE: { displayName: 'Nihai Vuruş', icon: '' },
});

export class GladiatorSkill extends Data {
  static T = 'GladiatorSkill';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      icon: undefined,
      type: undefined,
      tier: 1,
      cooldownTurns: 3,
      description: undefined,
      combatEffect: undefined,
    };
  }
}
Data.register(GladiatorSkill);

// ===========================================================================
// Home.kt
// ===========================================================================
export const RoomType = kt.defineEnum('RoomType', {
  REST_ROOM: { title: 'İstirahatgah (Yatak Odası)', icon: '' },
  TRAINING_GROUND: { title: 'Talimgah (İdman Meydanı)', icon: '' },
  TREASURY: { title: 'Hazine Odası & Kasa', icon: '' },
  INFIRMARY: { title: 'Şifahane & Simya Mahzeni', icon: '' },
  TROPHY_HALL: { title: 'Kupa ve Nam Salonu', icon: '' },
  LIBRARY_STUDY: { title: 'Kadim Harita & Kütüphane', icon: '' },
  ARMORY_WORKSHOP: { title: 'Biley Taşı & Silahhane', icon: '' },
  GARDEN_CELLAR: { title: 'Şifalı Ot Bahçesi & Mahzen', icon: '' },
  STORAGE_VAULT: { title: 'Depo Mahzeni & Sandık Odası', icon: '' },
});

export class RoomTierInfo extends Data {
  static T = 'RoomTierInfo';
  static defaults() {
    return { name: undefined, description: undefined, nextUpgradeDescription: undefined, bonusSummary: undefined };
  }
}
Data.register(RoomTierInfo);

export class HomeRoom extends Data {
  static T = 'HomeRoom';
  static defaults() {
    return {
      id: undefined,
      type: undefined,
      level: 1,
      maxLevel: 10,
      name: undefined,
      currentDescription: undefined,
      nextUpgradeDescription: undefined,
      upgradeCostGold: undefined,
      bonusSummary: undefined,
      requiredPlayerLevel: 1,
      requiredFame: 0,
      requiredOtherRoomId: null,
      requiredOtherRoomName: null,
      requiredOtherRoomLevel: 0,
      isUnlocked: true,
      isHouseOnly: false,
    };
  }
}
Data.register(HomeRoom);

// ===========================================================================
// LabyrinthModels.kt
// ===========================================================================
/**
 * Labirentin temel biyom ve ekosistem türleri.
 */
export const LabyrinthBiomeType = kt.defineEnum('LabyrinthBiomeType', {
  KADIM_SARNIC: {
    title: 'Kadim Su Sarnıcı',
    icon: '',
    shortDescription: 'Yosunlu su kanalları, boğucu derinlikler ve paslı su bentleri.',
    dominantHazardType: 'Boğulma, Kaygan Zemin, Su Canavarları',
    visualAtmosphere: 'Yeşilimsi fosforlu su yansımaları, tavandan düşen ağır damlalar ve küf kokusu.',
  },
  VOLKANIK_KORLUK: {
    title: 'Volkanik Kükürt Fırınları',
    icon: '',
    shortDescription: 'Kızgın lav bacaları, kükürt dumanları ve kor ateşi ızgaraları.',
    dominantHazardType: 'Kızgın Alev, Yakıcı Duman, Sıcaklık Bunalımı',
    visualAtmosphere: 'Karanlığı yaran kırmızı lav yarıkları, titreşen sıcak hava dalgası ve geniz yakan kül.',
  },
  CURUK_SARMASIK: {
    title: 'Çürümüş Bataklık & Zehirli Sarmaşıklar',
    icon: '',
    shortDescription: 'Zehirli mantar sporları, eti dağlayan sarmaşıklar ve asit çukurları.',
    dominantHazardType: 'Zehirli Gaz, Asit Eritmesi, Kök Prangaları',
    visualAtmosphere: 'Mor parıldayan mantar küfleri, çamurlaşmış zemin ve ağır organik çürüme kokusu.',
  },
  DIPSIZ_YARIK: {
    title: 'Dipsiz Uçurum & Asma Köprüler',
    icon: '',
    shortDescription: 'Kör karanlığa inen derin uçurumlar, sallanan tahta köprüler ve fırtına rüzgarları.',
    dominantHazardType: 'Düşme Riski, Çöken Taşlar, Denge Kaybı',
    visualAtmosphere: 'Aşağıdan esen dondurucu yeraltı cereyanı, gıcırdayan halatlar ve sonsuz bir boşluk.',
  },
  CARKLI_MEKANIZMA: {
    title: 'Çarklı Dişliler & Ezici Granit Bloklar',
    icon: '',
    shortDescription: 'Pirinç dişliler, inip kalkan tonluk taş bloklar ve dönen dev tırpanlar.',
    dominantHazardType: 'Ezilme, Kesilme, Basınç Tuzakları',
    visualAtmosphere: 'Ağır taş ve bronz sürtünme sesleri, yağ kokusu ve duvarlardan fırlayan mekanizmalar.',
  },
  KUTSAL_KRIPTA: {
    title: 'Kadim Rünik Kripta & Lahit Dehlizleri',
    icon: '',
    shortDescription: 'Gölge oyunları, illüzyonlu taş duvarlar ve rünik ışık prizmaları.',
    dominantHazardType: 'Zihinsel Sersemlik, Gizli Çiviler, Kadim Lanet',
    visualAtmosphere: 'Göz kırpan kadim rün yazıları, fısıldayan gölgeler ve soğuk mermer sessizliği.',
  },
});

/**
 * Labirentteki tehlike / engel kategorisi.
 */
export const HazardCategory = kt.defineEnum('HazardCategory', {
  CRUSHING: { title: 'Ezici & Darbeli', icon: '' },
  POISON_ACID: { title: 'Zehir & Asit', icon: '' },
  FIRE_HEAT: { title: 'Alev & Kükürt', icon: '' },
  CHASM_FALL: { title: 'Uçurum & Düşme', icon: '' },
  MECHANICAL_BLADE: { title: 'Mekanik & Bıçak', icon: '' },
  SUBMERGED_WATER: { title: 'Su & Balçık', icon: '' },
});

/**
 * Labirent tehlikesi (Tuzak, doğal engel veya mekanik tehlike).
 */
export class LabyrinthHazard extends Data {
  static T = 'LabyrinthHazard';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      category: undefined,
      description: undefined,
      triggerNarrative: undefined,
      avoidNarrative: undefined,
      failureNarrative: undefined,
      damageAmount: undefined,
      agilityThreshold: 12,
      strengthThreshold: 12,
      armorMitigationPercent: 20,
      primaryBiome: undefined,
    };
  }
}
Data.register(LabyrinthHazard);

/**
 * Labirent bulmaca türü.
 */
export const PuzzleType = kt.defineEnum('PuzzleType', {
  GEAR_LEVER: { title: 'Dişli & Kol Mekanizması', icon: '' },
  WEIGHT_PRESSURE: { title: 'Ağırlık & Basınç Kaidesi', icon: '' },
  LIGHT_REFRACTION: { title: 'Işık & Ayna Odaklama', icon: '' },
  SECRET_LATCH: { title: 'Gizli Mandal & Yanılsama Duvarı', icon: '' },
  WATER_VALVE: { title: 'Su Vanası & Bent Açma', icon: '' },
  RUNE_MATCHING: { title: 'Rün Sıralama & Kutsal Semboller', icon: '' },
});

/**
 * Labirent içindeki etkileşimli bulmaca / mekanizma.
 */
export class LabyrinthPuzzle extends Data {
  static T = 'LabyrinthPuzzle';
  static defaults() {
    return {
      id: undefined,
      title: undefined,
      type: undefined,
      description: undefined,
      clueText: undefined,
      solvedNarrative: undefined,
      failNarrative: undefined,
      rewardGold: 40,
      rewardFame: 2,
      primaryBiome: undefined,
    };
  }
}
Data.register(LabyrinthPuzzle);

/**
 * Ekipman veya stat türünün belirli labirent ekosisteminde sağladığı avantaj / dezavantaj.
 */
export class LabyrinthHabitatSynergy extends Data {
  static T = 'LabyrinthHabitatSynergy';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      targetBiome: undefined,
      requiredEquipmentTypeOrStat: undefined, // "heavy_armor", "light_cloth", "torch", "shield", "high_speed", "high_strength"
      isPositive: undefined,
      description: undefined,
      bonusDamageOrDefensePercent: 15,
      narrativeEffect: undefined,
    };
  }
}
Data.register(LabyrinthHabitatSynergy);

/**
 * Koridorlarda ve odalarda rastgele duyulan ortam sesleri & hisler.
 */
export class LabyrinthAtmosphereEvent extends Data {
  static T = 'LabyrinthAtmosphereEvent';
  static defaults() {
    return { id: undefined, soundText: undefined, sensoryDetail: undefined, biome: undefined };
  }
}
Data.register(LabyrinthAtmosphereEvent);

/**
 * Arka planda diğer gladyatörlerin başına gelen olayların oyuncuya bildirim yankısı.
 */
export const GladiatorEchoType = kt.defineEnum('GladiatorEchoType', {
  BETRAYAL: { icon: '', title: 'Kalleşlik & İhanet' },
  ALLIANCE: { icon: '', title: 'Geçici İttifak' },
  TRAP_TRIGGER: { icon: '', title: 'Tuzak Kazası' },
  LOOT_FIGHT: { icon: '', title: 'Hazine Kapışması' },
  BEAST_ENCOUNTER: { icon: '', title: 'Canavar Savaşı' },
  DEATH_ELIMINATION: { icon: '', title: 'Elenme & Ölüm' },
});

export class LabyrinthGladiatorEcho extends Data {
  static T = 'LabyrinthGladiatorEcho';
  static defaults() {
    return {
      id: undefined,
      echoType: undefined,
      primaryGladiatorName: undefined,
      secondaryGladiatorName: null,
      narrative: undefined,
      biome: undefined,
    };
  }
}
Data.register(LabyrinthGladiatorEcho);

/**
 * Labirent odalarında bulunan hazine sandıklarının kademesi.
 */
export const LabyrinthChestRarity = kt.defineEnum('LabyrinthChestRarity', {
  SIRADAN: { title: 'Eski Tahta Sandık', icon: '', minGold: 25, maxGold: 50 },
  NADIR: { title: 'Demir Kilitli Sandık', icon: '', minGold: 55, maxGold: 95 },
  EFSANEVI: { title: 'Kadim Rünik Hazine Sandığı', icon: '', minGold: 110, maxGold: 220 },
});

/**
 * Labirentin tek bir odası.
 */
export class LabyrinthChamber extends Data {
  static T = 'LabyrinthChamber';
  static defaults() {
    return {
      chamberIndex: undefined,
      title: undefined,
      description: undefined,
      hazard: null,
      puzzle: null,
      enemyId: null,
      chestReward: null,
      isExitChamber: false,
      isCleared: false,
    };
  }
}
Data.register(LabyrinthChamber);

/**
 * Belirli bir koşu için prosedürel olarak oluşturulan aktif Labirent konfigürasyonu.
 * (Kotlin'de currentChamberIndex `var`, recentDistantEchoes MutableList — doğrudan değiştirilebilir.)
 */
export class ActiveLabyrinthRun extends Data {
  static T = 'ActiveLabyrinthRun';
  static defaults() {
    return {
      runId: undefined,
      biome: undefined,
      themeTitle: undefined,
      introductoryNarrative: undefined,
      activeHazards: undefined,
      activePuzzles: undefined,
      activeSynergies: undefined,
      participatingGladiatorIds: undefined,
      chambers: undefined,
      currentChamberIndex: 0,
      recentDistantEchoes: [],
    };
  }
}
Data.register(ActiveLabyrinthRun);

// ===========================================================================
// League.kt
// ===========================================================================
export class FighterStanding extends Data {
  static T = 'FighterStanding';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      title: undefined,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
      consecutiveLosses: 0,
      isPlayer: false,
    };
  }

  // Calculates consecutive loss penalty points to deduct
  // 1st loss: 0, 2nd & 3rd consecutive: -1, 4th+ consecutive: -2
  calculateLossPenalty() {
    if (this.consecutiveLosses <= 1) return 0;
    if (this.consecutiveLosses >= 2 && this.consecutiveLosses <= 3) return 1;
    return 2;
  }
}
Data.register(FighterStanding);

export class LeagueFixtureMatch extends Data {
  static T = 'LeagueFixtureMatch';
  static defaults() {
    return {
      fighter1Id: undefined,
      fighter1Name: undefined,
      fighter2Id: undefined,
      fighter2Name: undefined,
      isPlayerMatch: false,
      isCompleted: false,
      resultSummary: null,
    };
  }
}
Data.register(LeagueFixtureMatch);

export class LeagueMatchResult extends Data {
  static T = 'LeagueMatchResult';
  static defaults() {
    return {
      fighter1Name: undefined,
      fighter2Name: undefined,
      winnerName: undefined, // null if draw
      scoreSummary: undefined,
      narrativeSnippet: undefined,
    };
  }
}
Data.register(LeagueMatchResult);

export class LeagueState extends Data {
  static T = 'LeagueState';
  static defaults() {
    return {
      seasonName: 'Kırlangıç Kasabası Gladyatör Ligi',
      roundNumber: 1,
      standings: [],
      currentFixture: [],
      recentMatches: [],
    };
  }
}
Data.register(LeagueState);

// ===========================================================================
// Quest.kt
// ===========================================================================
export const QuestType = kt.defineEnum('QuestType', {
  EXPEDITION: { title: 'Sefer & Muhafızlık Sözleşmesi' },
  MONSTER_HUNT: { title: 'Canavar Avı & Tedarik Sözleşmesi' },
});

export class Quest extends Data {
  static T = 'Quest';
  static defaults() {
    return {
      id: undefined,
      title: undefined,
      description: undefined,
      type: undefined,
      durationSeconds: 30, // For quick testing & engaging gameplay
      elapsedSeconds: 0,
      isRunning: false,
      isClaimed: false,
      rewardGold: undefined,
      rewardExp: undefined,
      rewardFame: 0,
      huntEnemy: null,
      rewardItem: null,
      successChancePercent: 100, // %100 varsayılan garanti, gözetleme gibi riskli işlerde yüzdeli
      failureNarrative: null,
      requiredLevel: 1,
      requiredMinArmor: 0,
      requiredMinDamage: 0,
      requiredMinHpPercent: 0,
      requiredSupplyGold: 0,
      requiredSupplyItemName: null,
      isRumorQuest: false,
      chainId: null,
      chainStep: 1,
      maxChainSteps: 1,
      nextStageQuestId: null,
      regionId: 'kirlangic',
      progressText: null,
      completionNarratives: [],
      scrollDropChancePercent: 0,
      rewardScrollId: null,
    };
  }

  get isFinished() {
    return this.elapsedSeconds >= this.durationSeconds;
  }
}
Data.register(Quest);

// ===========================================================================
// Region.kt
// ===========================================================================
export const NpcRole = kt.defineEnum('NpcRole', {
  BLACKSMITH: { title: 'Silahçı' },
  ARMORER: { title: 'Zırhçı' },
  TAILOR: { title: 'Terzi' },
  BOWYER: { title: 'Menzilli Silahçı & Okçu' },
  WAND_MAKER: { title: 'Asacı & Kadim Büyücü' },
  JEWELER: { title: 'Mücevheratçı & Rün Ustası' },
  ALCHEMIST: { title: 'İksirci & Simyacı' },
  COURTESAN: { title: 'Kızıl Kadife Köşkü & Gizli Divan' },
  TRAINER: { title: 'Muhafız Eğitmeni' },
  TRAINING_GROUNDS: { title: 'Büyük Talim Meydanı' },
  INFO_BROKER: { title: 'Tellal & Gözcü' },
  RING_MAKER: { title: 'Yüzükçü & Mühürdar' },
  LEATHERWORKER: { title: 'Saraç & Kösele Ustası' },
  SPEAR_MASTER: { title: 'Mızrak & Kargı Ustası' },
  DAGGER_MASTER: { title: 'Hançer & Gölge Silahçısı' },
  SCHOLAR: { title: 'Bilge Mütercim & Antik Dil Uzmanı' },
  AESTHETIC_ATELIER: { title: 'Zarafet Atölyesi & Güney Terzisi' },
});

export class Npc extends Data {
  static T = 'Npc';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      role: undefined,
      title: undefined,
      greeting: undefined,
      loreSnippet: undefined,
      equipmentForSale: [],
      consumablesForSale: [],
    };
  }
}
Data.register(Npc);

export class Region extends Data {
  static T = 'Region';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      recommendedLevel: undefined,
      description: undefined,
      localFame: 0,
      maxLocalFame: 100,
      npcs: [],
      isUnlocked: true,
    };
  }
}
Data.register(Region);

// ===========================================================================
// SkillOrb.kt
// ===========================================================================
export class SkillOrb extends Data {
  static T = 'SkillOrb';
  static defaults() {
    return {
      id: undefined,
      name: undefined,
      icon: undefined,
      description: undefined,
      triggerConditionText: undefined,
      effectSummary: undefined,
      level: 1,
      requiredSessions: 10,
      isUnlocked: false,
    };
  }
}
Data.register(SkillOrb);

const IRON_WILL = new SkillOrb({
  id: 'skill_iron_will',
  name: 'Demir İrade',
  icon: '',
  description: 'Ölümün eşiğinde zihni dinginleştirip kasları çelik gibi germe tekniği.',
  triggerConditionText: 'Can %40 altına indiğinde otomatik tetiklenir',
  effectSummary: '2 hamle boyunca alınan hasarı %30 kırar ve +6 geçici Zırh sağlar',
  requiredSessions: 10,
});

const CRUSHING_IMPACT = new SkillOrb({
  id: 'skill_crushing_impact',
  name: 'Ezici Balyoz',
  icon: '',
  description: 'Rakibin en savunmasız anında tüm vücut ağırlığını tek noktaya odaklama sanatı.',
  triggerConditionText: 'Her 4 saldırı hamlesinde bir kesin tetiklenir',
  effectSummary: 'Zırhı hiçe sayan +10 saf darbe vurur ve rakibin sıradaki hamlesini boşa düşürür',
  requiredSessions: 20,
});

const COUNTER_FLURRY = new SkillOrb({
  id: 'skill_counter_flurry',
  name: 'Akrobatik Karşı Vuruş',
  icon: '',
  description: 'Düşman silahından sıyrılırken açılan boşluğa tereddütsüz saplanan yıldırım darbesi.',
  triggerConditionText: 'Düşman saldırısından başarıyla sıyrıldığında (Dodge) tetiklenir',
  effectSummary: 'Sıfır gecikmeyle anında bedava +%50 hasarlı karşı hücum savurur',
  requiredSessions: 30,
});

// --- DOĞU DİYARLARI KADİM TOMAR YETENEKLERİ (MÜTERCİM JİN-ZHEN) ---
const EAST_DRAGON = new SkillOrb({
  id: 'skill_east_dragon',
  name: 'Ejder Nefesi Hamlesi',
  icon: '',
  description: 'Doğu tapınaklarından kalma kadim odaklanma; silahın ucunu kor gibi ısıtıp rakibin zırh gardını eritir.',
  triggerConditionText: 'Saldırı hamlelerinde her 3 vuruşta bir tetiklenir',
  effectSummary: '+%40 Ağır Hasar vurur ve rakibin zırh gardını kırarak savunmasız bırakır',
  requiredSessions: 0,
});

const EAST_CRANE = new SkillOrb({
  id: 'skill_east_crane',
  name: 'Turna Zarafeti',
  icon: '',
  description: 'Rüzgarın akışına uyarak rakibin vuruş çizgisinden tüy gibi süzülme ve anında açık kollama sanatı.',
  triggerConditionText: 'Düşman hücum ettiğinde veya can %50 altına indiğinde tetiklenir',
  effectSummary: 'Düşman saldırısından kaçınma şansını +%20 artırır ve anında karşı açık yakalar',
  requiredSessions: 0,
});

const EAST_STORM = new SkillOrb({
  id: 'skill_east_storm',
  name: 'Fırtına Kesisi',
  icon: '',
  description: 'Göz açıp kapayıncaya dek art arda indirilen seri ve kesici rüzgar darbeleri.',
  triggerConditionText: 'Saldırı hamlelerinde %35 ihtimalle tetiklenir',
  effectSummary: '+%30 Seri darbe hasarı ve rakipte 3 tur süren kan kaybı (Bleed) açar',
  requiredSessions: 0,
});

const EAST_NIGHT = new SkillOrb({
  id: 'skill_east_night',
  name: 'Gölge Adımı',
  icon: '',
  description: 'Rakibin göz kırpma anında gölgelere karışarak kör noktasına sızma ve arkadan vurma sanatı.',
  triggerConditionText: 'Her 4 turda bir veya rakip sersemlediğinde tetiklenir',
  effectSummary: 'Garanti Kritik Vuruş (+%50 Hasar) sağlar ve rakibi 1 tur afallatır',
  requiredSessions: 0,
});

const EAST_TIGER = new SkillOrb({
  id: 'skill_east_tiger',
  name: 'Kaplan Pençesi',
  icon: '',
  description: 'Vahşi bir içgüdüyle düşmanın etini parçalayan amansız ve vahşi doğu pençe savuruşu.',
  triggerConditionText: 'Can %60 üzerindeyken yapılan saldırılarda %40 ihtimalle tetiklenir',
  effectSummary: '+%35 Yırtıcı Hasar vurur ve rakibin yaralarından derin kan fışkırtır',
  requiredSessions: 0,
});

const EAST_MOUNTAIN = new SkillOrb({
  id: 'skill_east_mountain',
  name: 'Kadim Dağ Duruşu',
  icon: '',
  description: 'Köklerini toprağın derinliklerine salmış bir ulu dağ gibi sarsılmaz beden mukavemeti.',
  triggerConditionText: 'Ağır bir darbe alındığında otomatik tetiklenir',
  effectSummary: 'Gelen darbeyi yarıya indirir, +8 Geçici Zırh sağlar ve sersemletmeyi bozar',
  requiredSessions: 0,
});

export const StarterSkills = {
  IRON_WILL,
  CRUSHING_IMPACT,
  COUNTER_FLURRY,
  EAST_DRAGON,
  EAST_CRANE,
  EAST_STORM,
  EAST_NIGHT,
  EAST_TIGER,
  EAST_MOUNTAIN,

  ALL_SKILLS: [IRON_WILL, CRUSHING_IMPACT, COUNTER_FLURRY, EAST_DRAGON, EAST_CRANE, EAST_STORM, EAST_NIGHT, EAST_TIGER, EAST_MOUNTAIN],

  getSkillById(id) {
    return kt.firstOrNull(StarterSkills.ALL_SKILLS, (it) => it.id === id);
  },
};

// ===========================================================================
// SpecialTrainer.kt
// ===========================================================================
export const TrainingType = kt.defineEnum('TrainingType', {
  ENDURANCE: {
    title: 'Fırtına Geçidi Su Taşıma (Dayanıklılık)',
    icon: '',
    description: 'Sarp kayalıklarda sırtında dolu küplerle koşu. Ciğerlerini ve bacak kaslarını çelikleştirir.',
    costGold: 15,
    costHp: 10,
  },
  STRENGTH: {
    title: 'Granit Kaya İtme & Kas Koordinasyonu (Kuvvet)',
    icon: '',
    description: 'Ağır granit blokları zincirlerle çekme ve itme. Omuz ve sırt adelelerini patlatır.',
    costGold: 20,
    costHp: 15,
  },
  AGILITY: {
    title: 'Çelik Çember & Refleks Talimi (Çeviklik)',
    icon: '',
    description: 'Dönen sivri uçlu halkalar arasında darbe almadan sıyrılma ve ayak oyunu koordinasyonu.',
    costGold: 25,
    costHp: 20,
  },
});

export class TrainerStatus extends Data {
  static T = 'TrainerStatus';
  static defaults() {
    return {
      name: 'Kızıl Muhafız Althea',
      title: 'Garnizon Baş Eğitmeni & Savaş Ustası',
      description:
        "Kırmızı deriden yüksek çizmeleri, perçinli mini etek zırhı ve açıkta bıraktığı kaslı beli, boynu ve kollarıyla Taş Hisar'ın en mağrur dövüş ustası. Gözlerinde küçümseyici ama yeteneği takdir eden bir parıltı var.",
      isUnlocked: false,
      enduranceCount: 0,
      strengthCount: 0,
      agilityCount: 0,
    };
  }

  get totalSessions() {
    return this.enduranceCount + this.strengthCount + this.agilityCount;
  }
  get nextMilestone() {
    const t = this.totalSessions;
    if (t < 10) return 10;
    if (t < 20) return 20;
    if (t < 30) return 30;
    return 30;
  }
}
Data.register(TrainerStatus);

// ===========================================================================
// StorageChest.kt
// ===========================================================================
export const ChestType = kt.defineEnum('ChestType', {
  JEWELRY_CHEST: { id: 'chest_jewelry', displayName: 'Mücevher Sandığı', icon: '', description: 'Ekipman taşları ve cevher parçaları saklamak için kadife sandık.', resourceKey: 'gem' },
  STONE_CHEST: { id: 'chest_stone', displayName: 'Taş Sandığı', icon: '', description: 'Yontulmuş ve ham inşaat taşları deposu.', resourceKey: 'stone' },
  IRON_CHEST: { id: 'chest_iron', displayName: 'Demir Sandığı', icon: '', description: 'Demir cevheri, külçeler ve maden yatakları.', resourceKey: 'iron' },
  CLOTH_CHEST: { id: 'chest_cloth', displayName: 'Kumaş & İp Sandığı', icon: '', description: 'Keten, ipek ve halat stokları.', resourceKey: 'cloth' },
  WOOD_CHEST: { id: 'chest_wood', displayName: 'Odun Sandığı', icon: '', description: 'Meşe, gürgen ve sert keresteler.', resourceKey: 'wood' },
  HERB_CHEST: { id: 'chest_herb', displayName: 'Şifalı Bitki Sandığı', icon: '', description: 'Kurutulmuş otlar, kökler ve simya malzemeleri.', resourceKey: 'herb' },
});
/** companion object: fromId */
ChestType.fromId = (id) => ChestType.values().find((it) => it.id === id) ?? null;

export class StorageChest extends Data {
  static T = 'StorageChest';
  static defaults() {
    return {
      slotIndex: undefined, // 0..3 (4 alan)
      type: undefined,
      level: 1,
      capacity: 50, // Her seviye +50 kapasite
    };
  }

  get upgradeCostGold() {
    return this.level * 75;
  }
}
Data.register(StorageChest);

export class HarvestResult extends Data {
  static T = 'HarvestResult';
  static defaults() {
    return {
      success: undefined,
      narrative: undefined,
      resourceName: null,
      resourceIcon: '',
      amount: 0,
      isShard: false,
      shardType: null,
    };
  }
}
Data.register(HarvestResult);

// ===========================================================================
// Tavern.kt
// ===========================================================================
export const RumorCategory = kt.defineEnum('RumorCategory', {
  WORLD_LORE: { displayName: 'Diyar Efsaneleri', badgeIcon: '' },
  TOWN_TROUBLE: { displayName: 'Kasabalının Dertleri', badgeIcon: '' },
  ARENA_GOSSIP: { displayName: 'Arena Fısıltıları', badgeIcon: '' },
  WANDERER_TALE: { displayName: 'Gezgin & Kervan Hikayeleri', badgeIcon: '' },
});

export class TavernTale extends Data {
  static T = 'TavernTale';
  static defaults() {
    return {
      id: undefined,
      speakerName: undefined,
      speakerTitle: undefined,
      category: undefined,
      title: undefined,
      narrative: undefined,
      questClueId: null,
      clueDiscoveryText: null,
    };
  }
}
Data.register(TavernTale);

export class DiceGameResult extends Data {
  static T = 'DiceGameResult';
  static defaults() {
    return {
      playerRoll1: undefined,
      playerRoll2: undefined,
      opponentRoll1: undefined,
      opponentRoll2: undefined,
      playerWon: undefined,
      isTie: undefined,
      betAmount: undefined,
      netEarnings: undefined,
      narrativeOutcome: undefined,
    };
  }
}
Data.register(DiceGameResult);

// ===========================================================================
// Player.kt
// ===========================================================================
export class Player extends Data {
  static T = 'Player';
  static defaults() {
    return {
      name: 'Sürgün Silahşör',
      title: 'Acemi Gladyatör',
      level: 1,
      currentExp: 0,
      gold: 50,
      globalFame: 0,
      baseStats: new Stats({
        maxHealth: 100,
        damage: 10,
        armor: 2,
        speed: 10,
        dodgeChancePercent: 5,
        critChancePercent: 5,
        blockChancePercent: 5,
      }),
      currentHealth: 100,
      equipped: {
        [EquipmentSlot.HEAD]: null,
        [EquipmentSlot.CHEST]: null,
        [EquipmentSlot.GLOVES]: null,
        [EquipmentSlot.PANTS]: null,
        [EquipmentSlot.BOOTS]: null,
        [EquipmentSlot.WEAPON]: null,
        [EquipmentSlot.SHIELD]: null,
        [EquipmentSlot.TALISMAN]: null,
        [EquipmentSlot.RING]: null,
      },
      inventory: [],
      consumables: [],
      craftingMaterials: {},
      residenceTitle: 'Rutubetli Gladyatör Hücresi',
      isHouseUnlocked: false,
      knownWeaknessIds: [], // Set<String>
      encounteredEnemyIds: [], // Set<String>
      encounteredCharacterIds: ['npc_vorn', 'npc_mirana'], // Set<String>
      unlockedRumorQuestIds: [], // Set<String>
      completedQuestIds: [], // Set<String>
      hasGarrisonPass: false,
      currentRegionId: 'kirlangic',
      regionFame: { kirlangic: 0, tashisar: 0 },
      unlockedSkillIds: [], // Set<String>
      equippedSkillIds: [],
      gemsInventory: [],
      gemShards: {}, // Map<GemType, Int> (anahtar: enum adı)
      gemUpgradePity: {}, // Map<Int, Int>
      unlockedChestSlots: 2,
      builtChests: [],
      trainerStatus: new TrainerStatus(),
      activeMoraleBuff: null,
      homeBonusStats: new Stats(),
      activeBuffs: [],
      companionBondLevels: {},
    };
  }

  isCharacterEncountered(id) {
    return (
      this.encounteredCharacterIds.includes(id) ||
      this.encounteredEnemyIds.includes(id) ||
      this.knownWeaknessIds.includes(id) ||
      this.knownWeaknessIds.includes(`weak_${id}`)
    );
  }

  /** Set<String> → dizi */
  getUnlockedRegionIds() {
    const set = ['kirlangic'];
    if (this.hasGarrisonPass || this.currentRegionId === 'tashisar' || (this.regionFame['tashisar'] ?? 0) > 0) {
      set.push('tashisar');
    }
    return set;
  }

  getPityForLevel(targetLevel) {
    return this.gemUpgradePity[targetLevel] ?? 0;
  }
  getMaterialCount(materialId) {
    return this.craftingMaterials[materialId] ?? 0;
  }
  getShardCount(type) {
    return this.gemShards[type] ?? 0;
  }
  getChestForType(type) {
    return kt.firstOrNull(this.builtChests, (it) => it.type === type);
  }

  getFameForRegion(regionId) {
    const stored = this.regionFame[regionId] ?? 0;
    if (regionId === 'tashisar' && this.hasGarrisonPass) {
      return Math.max(10, stored);
    }
    return stored;
  }

  getTitleForRegion(regionId) {
    return calculatePlayerTitleForRegion(regionId, this.getFameForRegion(regionId), this.hasGarrisonPass);
  }

  get currentRegionFame() {
    return this.getFameForRegion(this.currentRegionId);
  }

  get currentRegionTitle() {
    return this.getTitleForRegion(this.currentRegionId);
  }

  get maxExp() {
    if (this.level <= 10) {
      return this.level * 100 + this.level * this.level * 10;
    }
    // Seviye 10 sonrası dikleşen tecrübe puanı eğrisi
    const over = this.level - 10;
    return 2000 + over * 500 + over * over * 150;
  }

  get totalStats() {
    let combined = this.baseStats
      .plus(
        new Stats({
          maxHealth: (this.level - 1) * 15,
          damage: (this.level - 1) * 3,
          armor: (this.level - 1) * 1,
          speed: (this.level - 1) * 1,
        }),
      )
      .plus(this.homeBonusStats);
    kt.filterNotNull(Object.values(this.equipped)).forEach((item) => {
      combined = combined.plus(item.totalStats);
    });
    // Aktif moral takviyesi (Kadife Sığınak)
    if (this.activeMoraleBuff != null) {
      combined = combined.plus(new Stats({ maxHealth: 10, critChancePercent: 5 }));
    }
    // Aktif iksir ve merhem takviyeleri
    this.activeBuffs.forEach((buff) => {
      combined = combined.plus(
        new Stats({
          damage: buff.bonusDamage,
          armor: buff.bonusArmor,
          speed: buff.bonusSpeed,
          critChancePercent: buff.bonusCritChance,
          blockChancePercent: buff.bonusBlockChance,
          dodgeChancePercent: buff.bonusDodgeChance,
        }),
      );
    });
    return combined;
  }

  isEquipped(equipment) {
    const e = this.equipped[equipment.slot];
    return (e != null ? e.id : null) === equipment.id;
  }
}
Data.register(Player);

export class LevelUpEvent extends Data {
  static T = 'LevelUpEvent';
  static defaults() {
    return {
      oldLevel: undefined,
      newLevel: undefined,
      healthGained: 15,
      damageGained: 3,
      armorGained: 1,
      speedGained: 1,
      newMaxHealth: undefined,
      nextLevelExp: undefined,
    };
  }
}
Data.register(LevelUpEvent);

export function calculatePlayerTitleForRegion(regionId, fame, hasGarrisonPass = false) {
  const clampedFame = kt.coerceIn(fame, 0, 100);
  if (regionId === 'tashisar') {
    if (clampedFame >= 100) return 'Garnizon Hükümdarı';
    if (clampedFame >= 90) return 'Taş Hisar Efsanesi';
    if (clampedFame >= 80) return 'Kızıl Sancak Şampiyonu';
    if (clampedFame >= 70) return 'Büyük Arena Boğası';
    if (clampedFame >= 60) return 'Garnizon Gözdesi';
    if (clampedFame >= 50) return 'Fırtına Silahşörü';
    if (clampedFame >= 40) return 'Kıdemli Lejyoner';
    if (clampedFame >= 30) return 'Garnizon Dövüşçüsü';
    if (clampedFame >= 20) return 'Taş Hisar Çaylağı';
    if (clampedFame >= 10) return 'Kasabadan Gelen Sürgün';
    return 'Garnizon Yabancısı';
  }
  if (hasGarrisonPass || clampedFame >= 100) {
    return 'Kırlangıç Kasabası Fatihi';
  }
  switch (kt.idiv(clampedFame, 10)) {
    case 0:
      return 'Bilinmeyen Sürgün';
    case 1:
      return 'Fısıltısı Duyulan';
    case 2:
      return 'Kumların Yabancısı';
    case 3:
      return 'Kasaba Dövüşçüsü';
    case 4:
      return 'Alkış Alan Gladyatör';
    case 5:
      return 'Korkulan Silahşör';
    case 6:
      return 'Kırlangıç Ustası';
    case 7:
      return 'Kasaba Şampiyonu';
    case 8:
      return 'Diyarın Sesi';
    default:
      return 'Kırlangıç Efsanesi';
  }
}

export function calculatePlayerTitle(fame, hasGarrisonPass = false) {
  return calculatePlayerTitleForRegion('kirlangic', fame, hasGarrisonPass);
}
