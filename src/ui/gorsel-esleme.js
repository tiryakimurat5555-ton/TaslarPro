// Oyun nesnelerinden simge adı seçen işlevler (src/ui/gorseller.js adları). Görseller VoiceOver'dan gizlidir;
// bu işlevler yalnız görünüşü belirler, oyun mantığına dokunmaz.
import {
  AccessoryCategory,
  ArenaDiscipline,
  ArmorCategory,
  CharacterCategory,
  ChestType,
  EquipmentSlot,
  GemType,
  HazardCategory,
  ItemType,
  LabyrinthBiomeType,
  LabyrinthTactic,
  NpcRole,
  PersonalityArchetype,
  PuzzleType,
  QuestType,
  RoomType,
  RumorCategory,
  SkillType,
  TrainingType,
  UnarmedShowType,
  UsableCategory,
  WeaponCategory,
} from '../domain/model.js';

function ad(e) {
  return e == null ? '' : typeof e === 'string' ? e : e.name;
}
function kucuk(s) {
  return String(s || '').toLocaleLowerCase('tr-TR');
}

// ---------------------------------------------------------------------------
// Eşyalar
// ---------------------------------------------------------------------------
const SILAH = { SWORD: 'kilic', SPEAR: 'mizrak', DAGGER: 'hancer', MACE: 'gurz', BOW: 'yay', STAFF: 'asa', AXE: 'balta' };
const ZIRH = {
  LIGHT_ARMOR: 'hafif-zirh',
  HEAVY_ARMOR: 'agir-zirh',
  ROBE: 'cubbe',
  HELMET: 'migfer',
  ASSASSIN_HOOD: 'baslik',
  MISC_HEADGEAR: 'sarik',
  GLOVES: 'eldiven',
  PANTS: 'pantolon',
  BOOTS: 'cizme',
};
const AKSESUAR = { SHIELD: 'kalkan', ARROW: 'ok-demeti', TOME: 'buyu-kitabi', RING: 'yuzuk', TALISMAN: 'tilsim' };
const YUVA = {
  HEAD: 'migfer',
  CHEST: 'agir-zirh',
  GLOVES: 'eldiven',
  PANTS: 'pantolon',
  BOOTS: 'cizme',
  WEAPON: 'kilic',
  SHIELD: 'kalkan',
  TALISMAN: 'tilsim',
  RING: 'yuzuk',
};

/** Kuşanılan yuvanın simgesi (EquipmentSlot). */
export function yuvaGorseli(slot) {
  return YUVA[ad(slot)] || 'canta';
}

/** Ekipmanın simgesi: silah türü, zırh türü, aksesuar ya da yuvaya göre. */
export function esyaGorseli(eq) {
  if (!eq) return 'canta';
  if (eq.weaponCategory) {
    const t = kucuk(eq.weaponType);
    if (ad(eq.weaponCategory) === 'BOW' && (t.includes('arbalet') || t.includes('tatar'))) return 'arbalet';
    if (ad(eq.weaponCategory) === 'SPEAR' && (t.includes('kargı') || t.includes('cirit'))) return 'kargi';
    if (ad(eq.weaponCategory) === 'MACE' && (t.includes('çekiç') || t.includes('tokmak'))) return 'cekic';
    if (ad(eq.weaponCategory) === 'DAGGER' && (t.includes('kama') || t.includes('pala'))) return 'egri-bicak';
    return SILAH[ad(eq.weaponCategory)] || 'kilic';
  }
  if (eq.accessoryCategory) return AKSESUAR[ad(eq.accessoryCategory)] || 'tilsim';
  if (eq.armorCategory) return ZIRH[ad(eq.armorCategory)] || yuvaGorseli(eq.slot);
  const t = kucuk(eq.weaponType);
  if (t.includes('ok')) return 'ok-demeti';
  if (t.includes('kitap') || t.includes('tomar')) return 'buyu-kitabi';
  if (t.includes('kırbaç')) return 'kirbac';
  return yuvaGorseli(eq.slot);
}

/** Tüketilebilir eşyanın simgesi (ConsumableItem). */
export function sarfGorseli(item) {
  if (!item) return 'iksir';
  const k = ad(item.usableCategory);
  if (k === 'POTION') return kucuk(item.name).includes('zehir') ? 'zehir' : 'iksir';
  if (k === 'HERB') return 'sifali-ot';
  if (k === 'SCROLL') return 'tomar';
  if (k === 'OINTMENT') return 'merhem';
  if (k === 'PEHLIVAN_OIL') return 'merhem';
  const t = ad(item.type);
  if (t === 'HERB' || t === 'EXTRACT') return 'sifali-ot';
  if (t === 'OINTMENT') return 'merhem';
  if (t === 'SCROLL') return 'bagli-tomar';
  if (t === 'MATERIAL') return 'hammadde';
  return 'iksir';
}

/** Hammadde (craftingMaterials anahtarı ya da adı) için simge. */
export function hammaddeGorseli(adOrId) {
  const s = kucuk(adOrId);
  if (s.includes('deri') || s.includes('post') || s.includes('kösele')) return 'hafif-zirh';
  if (s.includes('kumaş') || s.includes('ip') || s.includes('ipek') || s.includes('kenevir')) return 'igne';
  if (s.includes('odun') || s.includes('kereste') || s.includes('kütük')) return 'tahta-sandik';
  if (s.includes('ot') || s.includes('bitki') || s.includes('çiçek') || s.includes('kök')) return 'sifali-ot';
  if (s.includes('kristal') || s.includes('taş') || s.includes('mücevher')) return 'kristal';
  if (s.includes('diş') || s.includes('kemik') || s.includes('pençe') || s.includes('boynuz')) return 'kafatasi';
  return 'hammadde';
}

/** Nadirlik rengi (Kotlin ItemRarity.colorHex) — rozet kenarları için. */
export function nadirlikRengi(rarity) {
  if (!rarity || rarity.colorHex == null) return '#8A7F75';
  const n = Number(rarity.colorHex);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `rgb(${r},${g},${b})`;
}

// ---------------------------------------------------------------------------
// Mücevherler
// ---------------------------------------------------------------------------
const TAS_RENGI = {
  YAKUT: '#E0434F',
  SAFIR: '#3E7BE0',
  ZUMRUT: '#2FBF71',
  TOPAZ: '#F2B33D',
  AMETIST: '#9B5DE5',
  OPAL: '#B9E6E0',
  OBSIDYEN: '#6B6B7A',
  AKIK: '#C2412D',
  KUVARS: '#A89F91',
  AYTASI: '#C9D6F2',
  KEHRIBAR: '#E39B2B',
  YESIM: '#5FBF9F',
  MALAKIT: '#1F8A5B',
  PIRIT: '#C8B35A',
  LAPIS: '#2E4FA8',
  AKVAMARIN: '#5CC8E0',
  GRANAT: '#9E1B32',
  TURMALIN: '#E05C9B',
};
const TAS_SEKLI = { YAKUT: 'yakut', ZUMRUT: 'zumrut', GRANAT: 'yakut', AKIK: 'yakut', LAPIS: 'elmas', SAFIR: 'elmas', OPAL: 'elmas' };
export function tasRengi(gemType) {
  return TAS_RENGI[ad(gemType)] || '#C9933E';
}
export function tasGorseli(gemType) {
  return TAS_SEKLI[ad(gemType)] || 'kristal';
}

// ---------------------------------------------------------------------------
// Kişiler ve yerler
// ---------------------------------------------------------------------------
const NPC = {
  BLACKSMITH: 'ors',
  ARMORER: 'agir-zirh',
  TAILOR: 'igne',
  BOWYER: 'yay',
  WAND_MAKER: 'asa',
  JEWELER: 'elmas',
  ALCHEMIST: 'sise',
  COURTESAN: 'dudak',
  TRAINER: 'eskrimci',
  TRAINING_GROUNDS: 'hedef-kuklasi',
  INFO_BROKER: 'casus',
  RING_MAKER: 'yuzuk-kutusu',
  LEATHERWORKER: 'hafif-zirh',
  SPEAR_MASTER: 'mizrak',
  DAGGER_MASTER: 'hancerler',
  SCHOLAR: 'divit',
  AESTHETIC_ATELIER: 'roma-togasi',
};
/** NPC (Npc) simgesi: rolüne göre; şifacı/simyacı vb. ada göre. */
export function npcGorseli(npc) {
  if (!npc) return 'kisi';
  const r = NPC[ad(npc.role)];
  if (r) return r;
  const s = kucuk(npc.name) + ' ' + kucuk(npc.title);
  if (s.includes('şifa') || s.includes('aktar')) return 'sifali-ot';
  if (s.includes('demirci')) return 'ors';
  if (s.includes('mütercim') || s.includes('bilge')) return 'divit';
  return 'kisi';
}

const ODA = {
  REST_ROOM: 'yatak',
  TRAINING_GROUND: 'hedef-kuklasi',
  TREASURY: 'sikkeler',
  INFIRMARY: 'ilac',
  TROPHY_HALL: 'kupa',
  LIBRARY_STUDY: 'kitaplik',
  ARMORY_WORKSHOP: 'ors',
  GARDEN_CELLAR: 'saksi',
  STORAGE_VAULT: 'sandik',
};
export function odaGorseli(roomType) {
  return ODA[ad(roomType)] || 'ev';
}

const SANDIK = {
  JEWELRY_CHEST: 'yuzuk-kutusu',
  STONE_CHEST: 'hammadde',
  IRON_CHEST: 'kilitli-sandik',
  CLOTH_CHEST: 'igne',
  WOOD_CHEST: 'tahta-sandik',
  HERB_CHEST: 'sifali-ot',
};
export function sandikGorseli(chestType) {
  return SANDIK[ad(chestType)] || 'sandik';
}

const EGITIM = { ENDURANCE: 'su-damlasi', STRENGTH: 'agirlik', AGILITY: 'kosu' };
export function egitimGorseli(trainingType) {
  return EGITIM[ad(trainingType)] || 'hedef-kuklasi';
}

// ---------------------------------------------------------------------------
// Arena ve labirent
// ---------------------------------------------------------------------------
const ARENA = {
  SOLO_1V1: 'duello',
  DUO_2V2: 'capraz-kilic',
  UNARMED_SHOW: 'yumruk',
  LABYRINTH_3V3: 'labirent',
  BETTING: 'sikkeler',
  LEAGUE_STANDINGS: 'kursu',
  ARENA_LOGS: 'tomar',
};
export function arenaGorseli(discipline) {
  return ARENA[ad(discipline)] || 'arena';
}

const GOSTERI = { SINGLE_BEAST: 'aslan', BEAST_PACK: 'kurt', GLADIATOR_BRAWL: 'yumruk', AESTHETIC_DUEL: 'roma-togasi' };
export function gosteriGorseli(showType) {
  return GOSTERI[ad(showType)] || 'yumruk';
}

const TAKTIK = { BALANCED: 'kalkan', VANGUARD_RUSH: 'kalkan-darbe', FLANK_AMBUSH: 'casus', TRAP_BAIT: 'kurt-kapani' };
export function taktikGorseli(tactic) {
  return TAKTIK[ad(tactic)] || 'kalkan';
}

const BIYOM = {
  KADIM_SARNIC: 'selale',
  VOLKANIK_KORLUK: 'alev',
  CURUK_SARMASIK: 'dikenli-sarmasik',
  DIPSIZ_YARIK: 'kopru',
  CARKLI_MEKANIZMA: 'disliler',
  KUTSAL_KRIPTA: 'tabut',
};
export function biyomGorseli(biome) {
  return BIYOM[ad(biome)] || 'labirent';
}

const TEHLIKE = {
  CRUSHING: 'tas-tablet',
  POISON_ACID: 'asit',
  FIRE_HEAT: 'ates-kasesi',
  CHASM_FALL: 'dusme',
  MECHANICAL_BLADE: 'testere',
  SUBMERGED_WATER: 'bogulma',
};
export function tehlikeGorseli(category) {
  return TEHLIKE[ad(category)] || 'kurt-kapani';
}

const BULMACA = {
  GEAR_LEVER: 'dislicekic',
  WEIGHT_PRESSURE: 'agirlik',
  LIGHT_REFRACTION: 'gunes-isini',
  SECRET_LATCH: 'gizli-kapi',
  WATER_VALVE: 'su-damlasi',
  RUNE_MATCHING: 'run-tasi',
};
export function bulmacaGorseli(type) {
  return BULMACA[ad(type)] || 'anahtar';
}

/** Canavar/rakip adı ya da başlığından hayvan simgesi (silahsız gösteri, labirent canavarları). */
export function canavarGorseli(metin) {
  const s = kucuk(metin);
  if (s.includes('kurt')) return 'kurt';
  if (s.includes('sırtlan')) return 'sirtlan';
  if (s.includes('ayı')) return 'ayi';
  if (s.includes('aslan') || s.includes('kaplan') || s.includes('pars') || s.includes('panter')) return 'aslan';
  if (s.includes('domuz')) return 'yaban-domuzu';
  if (s.includes('yılan') || s.includes('engerek')) return 'yilan';
  if (s.includes('akrep')) return 'akrep';
  if (s.includes('örümcek')) return 'orumcek';
  if (s.includes('ejder') || s.includes('kertenkele') || s.includes('timsah')) return 'ejder';
  if (s.includes('kuzgun') || s.includes('kartal') || s.includes('akbaba')) return 'kuzgun';
  return null;
}

// ---------------------------------------------------------------------------
// Karakterler, görevler, yetenekler, han
// ---------------------------------------------------------------------------
const MIZAC = { HIRSLI: 'kas', TEMBEL: 'uykulu', VAHSI: 'kurt', KURNAZ: 'casus', GURURLU: 'sparta-migferi', GIZEMLI: 'ucuncu-goz' };
export function mizacGorseli(archetype) {
  return MIZAC[ad(archetype)] || 'kisi';
}

const KATEGORI = { GLADIATOR: 'sparta-migferi', TOWN_FOLK: 'kisi', GARRISON: 'kale' };
/** Karakter sicili için: kategori ya da mizaca göre. */
export function karakterGorseli(profil) {
  if (!profil) return 'kisi';
  const p = profil.profile || profil;
  const n = kucuk(p.name);
  if (n.includes('lyra') || n.includes('katerina') || n.includes('althea') || n.includes('elora') || n.includes('mirana') || n.includes('thyra')) return 'elf-kadin';
  return KATEGORI[ad(p.category)] || 'kisi';
}

const GOREV = { EXPEDITION: 'patika', MONSTER_HUNT: 'kurt' };
/** Görev (Quest) simgesi: türü ve başlığındaki anahtar sözcüklere göre. */
export function gorevGorseli(quest) {
  if (!quest) return 'tomar';
  const t = kucuk(quest.title);
  if (t.includes('kervan')) return 'heybe';
  if (t.includes('köprü')) return 'tas-kopru';
  if (t.includes('cevher') || t.includes('maden') || t.includes('tuz')) return 'kazma';
  if (t.includes('sığır') || t.includes('ağıl')) return 'ayak-izi';
  if (t.includes('iskele') || t.includes('nehir')) return 'fener';
  if (t.includes('kule') || t.includes('nöbet') || t.includes('gözetleme')) return 'gozlemci';
  if (t.includes('değirmen')) return 'disli';
  if (t.includes('kereste') || t.includes('kütük')) return 'balta';
  if (t.includes('eşkıya') || t.includes('baskın')) return 'capraz-kilic';
  if (t.includes('fener') || t.includes('meşale')) return 'alev';
  if (t.includes('münzevi') || t.includes('in')) return 'kamp-atesi';
  const c = canavarGorseli(quest.title) || canavarGorseli(quest.huntEnemy && quest.huntEnemy.name);
  if (c) return c;
  return GOREV[ad(quest.type)] || 'tomar';
}

/** Macera (Adventure) simgesi: hedef canavara göre. */
export function maceraGorseli(adv) {
  if (!adv) return 'kurt';
  return canavarGorseli(adv.targetName) || canavarGorseli(adv.title) || 'kafatasi';
}

const YETENEK = { ATTACK: 'kilic-cekme', DEFENSE: 'kalkan-yansit', TACTICAL: 'casus', ULTIMATE: 'simsek' };
export function yetenekGorseli(skillType) {
  return YETENEK[ad(skillType)] || 'buyu-girdap';
}

const SOYLENTI = { WORLD_LORE: 'acik-kitap', TOWN_TROUBLE: 'koy', ARENA_GOSSIP: 'arena', WANDERER_TALE: 'patika' };
export function soylentiGorseli(category) {
  return SOYLENTI[ad(category)] || 'fisilti';
}

/** Nitelik simgeleri: hasar, zirh, can, hiz, siyrilma, kritik, blok, tecrube, altin, sohret, gun, seviye. */
const NITELIK = {
  hasar: 'kilic',
  zirh: 'kalkan',
  can: 'can',
  hiz: 'hiz',
  siyrilma: 'kosu',
  kritik: 'simsek',
  blok: 'kalkan-darbe',
  tecrube: 'yildiz-madalya',
  altin: 'sikke',
  sohret: 'defne',
  gun: 'gunes-saati',
  seviye: 'seviye',
  sure: 'kum-saati',
  delme: 'mizrak',
  sersemletme: 'uclu-simsek',
  can_calma: 'damla',
};
export function nitelikGorseli(anahtar) {
  return NITELIK[anahtar] || 'yildiz-madalya';
}

/** Bölge kimliği (kirlangic / tashisar) simgesi. */
export function bolgeGorseli(id) {
  return id === 'tashisar' ? 'kale' : 'koy';
}

// Kullanılmayan içe aktarma uyarısı olmasın diye (enum adları yukarıda dize olarak eşleniyor).
void [
  AccessoryCategory,
  ArenaDiscipline,
  ArmorCategory,
  CharacterCategory,
  ChestType,
  EquipmentSlot,
  GemType,
  HazardCategory,
  ItemType,
  LabyrinthBiomeType,
  LabyrinthTactic,
  NpcRole,
  PersonalityArchetype,
  PuzzleType,
  QuestType,
  RoomType,
  RumorCategory,
  SkillType,
  TrainingType,
  UnarmedShowType,
  UsableCategory,
  WeaponCategory,
];
