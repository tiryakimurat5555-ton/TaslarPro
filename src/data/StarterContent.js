import * as kt from '../kt.js';
import { Data } from '../kt.js';
import {
  AccessoryCategory,
  Adventure,
  ArmorCategory,
  ConsumableItem,
  CraftingRecipe,
  Enemy,
  EnemyWeakness,
  Equipment,
  EquipmentSlot,
  EquipmentSpecialTrait,
  FighterPersonality,
  Gem,
  GemTier,
  GemType,
  GladiatorSkill,
  HomeRoom,
  ItemRarity,
  ItemType,
  Npc,
  NpcRole,
  PersonalityArchetype,
  Quest,
  QuestType,
  Region,
  RoomTierInfo,
  RoomType,
  RumorCategory,
  SkillType,
  Stats,
  TavernTale,
  UsableCategory,
  WeaponCategory,
} from '../domain/model.js';
import { AestheticAtelierEquipmentData } from './AestheticAtelierEquipmentData.js';
import { PehlivanOintmentsData } from './PehlivanOintmentsData.js';
import { TashisarAlchemistConsumablesData } from './TashisarAlchemistConsumablesData.js';
import { TashisarArmorerEquipmentData } from './TashisarArmorerEquipmentData.js';
import { TashisarBlacksmithSpearsAndDaggersData } from './TashisarBlacksmithSpearsAndDaggersData.js';
import { TashisarBlacksmithWeaponsData } from './TashisarBlacksmithWeaponsData.js';
import { TashisarBowyerEquipmentData } from './TashisarBowyerEquipmentData.js';
import { TashisarLeatherworkerEquipmentData } from './TashisarLeatherworkerEquipmentData.js';
import { TashisarRingAndSealData } from './TashisarRingAndSealData.js';
import { TashisarTailorEquipmentData } from './TashisarTailorEquipmentData.js';
import { TashisarWandMakerStavesData } from './TashisarWandMakerStavesData.js';

// Initial starting primitive equipment pieces (1-3 damage, worn rags)
const crackedClub = new Equipment({
    id: 'eq_cracked_club',
    name: 'Çatlak Meşe Yontusu',
    slot: EquipmentSlot.WEAPON,
    rarity: ItemRarity.ILKEL,
    stats: new Stats({damage: 2, speed: 1}),
    requiredLevel: 1,
    valueInGold: 6,
    description: 'Kırlangıç Kasabası\'nın odun yığınından koparılmış, çatlak ve kıymıklı kaba bir sopa. (1-3 hasar verir).',
    weaponType: 'gürz',
    weaponCategory: WeaponCategory.MACE
})

const clothWrap = new Equipment({
    id: 'eq_cloth_wrap',
    name: 'Eski Bez Sargı',
    slot: EquipmentSlot.HEAD,
    rarity: ItemRarity.ILKEL,
    stats: new Stats({armor: 1}),
    requiredLevel: 1,
    valueInGold: 4,
    description: 'Kafayı tozdan ve terden korumak için sarılmış eski bir kumaş parçası.',
    armorCategory: ArmorCategory.MISC_HEADGEAR
})

const rottenVest = new Equipment({
    id: 'eq_rotten_vest',
    name: 'Çürük Keten Yelek',
    slot: EquipmentSlot.CHEST,
    rarity: ItemRarity.ILKEL,
    stats: new Stats({armor: 1}),
    requiredLevel: 1,
    valueInGold: 6,
    description: 'Rutubetten lifleri dökülen, neredeyse koruma sağlamayan çürük yelek.',
    armorCategory: ArmorCategory.LIGHT_ARMOR
})

const frayedGloves = new Equipment({
    id: 'eq_frayed_gloves',
    name: 'Kaba İp Sargılı Eldiven',
    slot: EquipmentSlot.GLOVES,
    rarity: ItemRarity.ILKEL,
    stats: new Stats({armor: 1, speed: 1}),
    requiredLevel: 1,
    valueInGold: 5,
    description: 'Parmak uçları açıkta bırakan, silah kavramasını kolaylaştıran kaba eldiven.',
    armorCategory: ArmorCategory.GLOVES
})

const raggedPants = new Equipment({
    id: 'eq_ragged_pants',
    name: 'Yırtık Paçavra Altlık',
    slot: EquipmentSlot.PANTS,
    rarity: ItemRarity.ILKEL,
    stats: new Stats({armor: 1}),
    requiredLevel: 1,
    valueInGold: 4,
    description: 'Bacakları sarmalayan yamalı paçavra kumaş.',
    armorCategory: ArmorCategory.PANTS
})

const wornSandals = new Equipment({
    id: 'eq_worn_sandals',
    name: 'Bağcıksız Yıpranmış Çarık',
    slot: EquipmentSlot.BOOTS,
    rarity: ItemRarity.ILKEL,
    stats: new Stats({dodgeChancePercent: 2}),
    requiredLevel: 1,
    valueInGold: 5,
    description: 'Tabanı delinmek üzere olan, kumların üstünde kayganlaşmış eski çarık.',
    armorCategory: ArmorCategory.BOOTS
})

const woodenBuckler = new Equipment({
    id: 'eq_wooden_buckler',
    name: 'Çatlak Meşe Siperlik',
    slot: EquipmentSlot.SHIELD,
    rarity: ItemRarity.ILKEL,
    stats: new Stats({armor: 1, blockChancePercent: 4}),
    requiredLevel: 1,
    valueInGold: 8,
    description: 'Sol kola bağlanan, darbeleri saptırmaya yarayan küçük tahta tokaç kalkan.',
    accessoryCategory: AccessoryCategory.SHIELD
})

const boneAmulet = new Equipment({
    id: 'eq_bone_amulet',
    name: 'Karga Kemiği Tılsım',
    slot: EquipmentSlot.TALISMAN,
    rarity: ItemRarity.SIRADAN,
    stats: new Stats({critChancePercent: 2}),
    requiredLevel: 1,
    valueInGold: 18,
    description: 'Kırlangıç çatılarında öten kara kargaların kemiğinden oyulmuş uğursuz koruyucu tılsım.',
    accessoryCategory: AccessoryCategory.TALISMAN
})

const brassRing = new Equipment({
    id: 'eq_brass_ring',
    name: 'Eski Pirinç Halka',
    slot: EquipmentSlot.RING,
    rarity: ItemRarity.SIRADAN,
    stats: new Stats({blockChancePercent: 2}),
    requiredLevel: 1,
    valueInGold: 18,
    description: 'Parmağa bol gelen, üzeri silinmiş pirinç yüzük.',
    accessoryCategory: AccessoryCategory.RING
})

// Consumables & Usables
const healingSalve = new ConsumableItem({
    id: 'con_salve',
    name: 'Pelin Otu Merhemi',
    type: ItemType.POTION,
    usableCategory: UsableCategory.POTION,
    healAmount: 25,
    valueInGold: 12,
    description: 'Kırlangıç deresinden toplanan acı pelin otuyla ezilmiş, kanamayı durduran kaba merhem.',
    count: 2
})

const mountainHerb = new ConsumableItem({
    id: 'con_mountain_herb',
    name: 'Kırlangıç Dağ Otu',
    type: ItemType.HERB,
    usableCategory: UsableCategory.HERB,
    healAmount: 15,
    valueInGold: 6,
    description: 'Kayalıklarda yetişen acı yapraklı şifalı ot. Çiğnendiğinde yaraların kanamasını durdurur.',
    count: 1
})

const ancientScroll = new ConsumableItem({
    id: 'con_ancient_scroll',
    name: 'Mühürlü Dövüşçü Tomarı',
    type: ItemType.SCROLL,
    usableCategory: UsableCategory.SCROLL,
    healAmount: 0,
    valueInGold: 25,
    description: 'Kadim gladyatörlerin dövüş duruşlarını ve karşı vuruş tekniklerini anlatan parşömen yazıt.',
})

const SEALED_SCROLL_DRAGON = new ConsumableItem({
    id: 'item_sealed_scroll_dragon',
    name: 'Mühürlü Kadim Tomar: Kızıl Ejder',
    type: ItemType.SCROLL,
    usableCategory: UsableCategory.SCROLL,
    valueInGold: 45,
    description: 'Kırmızı balmumuyla mühürlenmiş, Doğu ideogramlarıyla bezeli eski bir papirüs. Kasabadaki Doğu Bilgesi Jin-Zhen bu gizemi çözebilir.',
    count: 1
})

const SEALED_SCROLL_CRANE = new ConsumableItem({
    id: 'item_sealed_scroll_crane',
    name: 'Mühürlü Kadim Tomar: Ak Turna',
    type: ItemType.SCROLL,
    usableCategory: UsableCategory.SCROLL,
    valueInGold: 45,
    description: 'Beyaz balmumu ve tüy motifiyle mühürlenmiş ipek parşömen. Rüzgar gibi süzülme teknikleri içerdiği düşünülüyor.',
    count: 1
})

const SEALED_SCROLL_STORM = new ConsumableItem({
    id: 'item_sealed_scroll_storm',
    name: 'Mühürlü Kadim Tomar: Fırtına Rüzgarı',
    type: ItemType.SCROLL,
    usableCategory: UsableCategory.SCROLL,
    valueInGold: 45,
    description: 'Yeşil rünik iple sarılmış, fırtına kesilerini anlatan doğu yazıtı. Bilge Jin-Zhen\'in deşifre etmesi gerekir.',
    count: 1
})

const SEALED_SCROLL_NIGHT = new ConsumableItem({
    id: 'item_sealed_scroll_night',
    name: 'Mühürlü Kadim Tomar: Gece Gölgesi',
    type: ItemType.SCROLL,
    usableCategory: UsableCategory.SCROLL,
    valueInGold: 45,
    description: 'Kömür karası mühürlü kadife kılıfında gizemli bir el yazması. Doğu suikastçılarının adım tekniklerini barındırıyor.',
    count: 1
})

const SEALED_SCROLL_TIGER = new ConsumableItem({
    id: 'item_sealed_scroll_tiger',
    name: 'Mühürlü Kadim Tomar: Yırtıcı Kaplan',
    type: ItemType.SCROLL,
    usableCategory: UsableCategory.SCROLL,
    valueInGold: 45,
    description: 'Pençe izleriyle damgalanmış sert papirüs. Vahşi doğu savaşçılarının yırtıcı vuruş sanatı gizli.',
    count: 1
})

const SEALED_SCROLL_MOUNTAIN = new ConsumableItem({
    id: 'item_sealed_scroll_mountain',
    name: 'Mühürlü Kadim Tomar: Ağır Dağ',
    type: ItemType.SCROLL,
    usableCategory: UsableCategory.SCROLL,
    valueInGold: 45,
    description: 'Kaya tozuyla sıvanmış kil mühürlü ağır tomar. Bedeni dağ gibi sarsılmaz kılma sırlarını taşır.',
    count: 1
})

function getAllSealedScrolls() {
    return [
        SEALED_SCROLL_DRAGON,
        SEALED_SCROLL_CRANE,
        SEALED_SCROLL_STORM,
        SEALED_SCROLL_NIGHT,
        SEALED_SCROLL_TIGER,
        SEALED_SCROLL_MOUNTAIN
    ];
}

function getScrollSkillMapping(scrollId) {
    switch (scrollId) {
        case 'item_sealed_scroll_dragon':
            return 'skill_east_dragon'
        case 'item_sealed_scroll_crane':
            return 'skill_east_crane'
        case 'item_sealed_scroll_storm':
            return 'skill_east_storm'
        case 'item_sealed_scroll_night':
            return 'skill_east_night'
        case 'item_sealed_scroll_tiger':
            return 'skill_east_tiger'
        case 'item_sealed_scroll_mountain':
            return 'skill_east_mountain'
        default:
            return null
    }
}

function getSealedScrollById(scrollId) {
    return kt.firstOrNull(getAllSealedScrolls(), (it) => it.id === scrollId);
}

export class DecipherLore extends Data {
    static T = 'DecipherLore';
    static defaults() {
        return { ritualTitle: undefined, ritualNarrative: undefined, techniqueLore: undefined, battlePhilosophy: undefined };
    }
}
Data.register(DecipherLore);

function getDecipherLore(skillId) {
    switch (skillId) {
        case 'skill_east_dragon':
            return new DecipherLore({
            ritualTitle: 'Kızıl Ejder Balmumu & Doğu Kor Ritüeli',
            ritualNarrative: 'Bilge Jin-Zhen, mangaldaki beyaz közlerin üzerine Doğu\'dan getirdiği kurutulmuş tarçın kabuklarını ve ejder reçinesini serpti. Odayı saran keskin, baharatlı duman eşliğinde parşömenin kızıl balmumu mührünü gümüş bir spatulayla dikkatlice sıyırdı. Parşömen çıtırtıyla açıldığında içindeki kırmızı mürekkepli ejderha motifi adeta kor bir ateş gibi parıldadı.',
            techniqueLore: 'Bu teknik, Doğu Hanlığı\'nın ateş mabetlerinde bin yıldır saklanan \'Ejder Nefesi\' öğretisidir. Savaşçı hamle yaptıkça ciğerlerine ateş gibi hava çeker; her üçüncü vuruşta silahın ucuna yoğunlaşan akkor ısı, hasmın kalkanını veya çelik zırhını tereyağı gibi keser.',
            battlePhilosophy: '"Alev önündeki demiri tanımaz; sadece yakar ve eritir. Arenada kalkanına güvenen kibirli şampiyonların gardı bu teknikle küle dönecektir!"'
        })
        case 'skill_east_crane':
            return new DecipherLore({
            ritualTitle: 'Ak Turna Tütsüsü & Rüzgar Akışı Ritüeli',
            ritualNarrative: 'Jin-Zhen, yeşim taşından oyulmuş bir tütsülükte turna tüyü ve göl nilüferi yapraklarını tütsüledi. Havaya yükselen duman sarmallar çizerken beyaz balmumu mührünü yavaşça eritti. İpek parşömen, bir turnanın göğe kanat açışı gibi pürüzsüzce masaya serildi.',
            techniqueLore: 'Göklerin zarif hükümdarı Ak Turna\'nın süzülüşünden ilham alan kadim bir kaçınma sanatıdır. Canın azaldığında veya hasım ölümcül bir güçle üzerine atıldığında reflekslerin uyanır; rüzgara kapılan bir kuş gibi hasmın vuruş çizgisinden sıyrılır ve savunmasız böğrüne karşı açık yakalarsın.',
            battlePhilosophy: '"Sert meşe fırtınada çatırdar, esnek sazlık ise fırtınanın önünde eğilip hasmını arkadan vurur. Zafer kaba kuvvetle değil, vuruş çizgisini boşa düşüren zarafetle kazanılır."'
        })
        case 'skill_east_storm':
            return new DecipherLore({
            ritualTitle: 'Yeşil Rünik İp Çözümü & Dağ Adaçayı Ritüeli',
            ritualNarrative: 'Jin-Zhen, yeşil rünik ipleri parmaklarıyla çözerken dudaklarından eski bir Doğu ezgisi döküldü. Masadaki pirinç kasede yanan kurutulmuş dağ adaçayı çıtırdadı ve odadaki kandil alevleri sanki görünmez bir tayfunla titredi.',
            techniqueLore: 'Göçebe Rüzgar Keşişleri\'nin Fırtına Kesisi sanatıdır. Tek bir kılıç vuruşu havada üç ayrı kesici rüzgar burgacı doğurur. Hasım ana darbeyi savuşturduğunu sansa bile, peşinden gelen görünmez tayfun kesileri etinde durdurulamaz kanayan yaralar açar.',
            battlePhilosophy: '"Fırtınanın tek bir damlası değil, peş peşe inen sağanağı yıkar. Bir darbe vurursun, peşinden üç yara kanar!"'
        })
        case 'skill_east_night':
            return new DecipherLore({
            ritualTitle: 'Kömür Karası Mühür & Sessizlik Ritüeli',
            ritualNarrative: 'Jin-Zhen odadaki kandilleri birer birer söndürdü; geriye yalnızca kömür mangalının donuk karaltısı kaldı. Kömür karası mührü elleriyle kırarken etraf sanki zifiri bir gecenin sükunetine büründü.',
            techniqueLore: 'İmparatorluk gölge muhafızlarının en gizli öğretisidir. Hasım gözünü kırptığı o saliselik karanlıkta, dövüşçü ışığın kırıldığı kör noktaya süzülür. Rakip karşısındaki boşluğa bakarken sen çoktan arkasına geçmiş, en korumasız eklemine öldürücü darbeyi indirmiş olursun.',
            battlePhilosophy: '"Gölge ses çıkarmaz, gölge acımaz. Hasmın seni gördüğü son an, kılıcının onun ensesine değdiği andır."'
        })
        case 'skill_east_tiger':
            return new DecipherLore({
            ritualTitle: 'Kırmızı Pençe Damgası & Vahşi İçgüdü Ritüeli',
            ritualNarrative: 'Pençe izleriyle mühürlenmiş sert kil damga çatlayıp ayrıldığında Jin-Zhen\'in elleri ürpertiyle titredi. Parşömenin kıvrımlarından kadim bambu ormanlarının, çiğ av etinin ve vahşi kanın kokusu yayıldı.',
            techniqueLore: 'İnsan aklıyla değil, yırtıcı hayvanın saf katliam refleksiyle dövüşme disiplinidir. Dövüşçünün kanı kaynadığında ve gücü yerindeyken içindeki kaplan uyanır; darbeleri rakibin zırhının altındaki eti lime lime eder ve durdurulamaz bir kan fışkırmasına yol açar.',
            battlePhilosophy: '"Arenanın kumu kurbanların kanına doymak ister. Merhameti unut, pençeni sapla ve hasmın boynundaki nabız durana dek durma!"'
        })
        case 'skill_east_mountain':
            return new DecipherLore({
            ritualTitle: 'Kaya Tozu Sıvalı Kil Tablet & Yer Sarsılmazlığı Ritüeli',
            ritualNarrative: 'Jin-Zhen, kaya tozu ve kurutulmuş çam reçinesiyle sıvanmış ağır kil tableti pirinç tokmakla kırdı. Odaya derin bir nemli toprak ve granit kokusu doldu; adeta yerin metrelerce altındaki kadim kayaların ağırlığı hissedildi.',
            techniqueLore: 'Doğu Hanlığı generallerinin meydan savaşlarında tek başlarına orduları karşıladığı sarsılmaz duruş öğretisidir. Ağır bir darbe indiğinde dövüşçü geri adım atmaz; ayaklarını toprağa kilitler ve gövdesini yekpare bir taşa dönüştürür. Darbe yarı yarıya emilir ve sersemleme etkisi anında bozulur.',
            battlePhilosophy: '"Rüzgar dağa çarptığında dağı deviremez, sadece tozunu alır. Arenada seni ne bir gürz devirebilir ne de bir boğanın toynağı!"'
        })
        default:
            return new DecipherLore({
            ritualTitle: 'Kadim Yazıt Deşifre Ritüeli',
            ritualNarrative: 'Jin-Zhen tütsü dumanında parşömenin mührünü eritti ve antik yazıtları sesli tercüme etti.',
            techniqueLore: 'Kadim zamanların dövüş ustalarından kalma gizli bir muharebe tekniği.',
            battlePhilosophy: '"Bilenmiş bir zihin, en keskin kılıçtan daha ölümcüldür."'
        })
    }
}

function getRoomTierInfo(type, level, isHouse = false) {
    switch (type) {
        case RoomType.REST_ROOM:
                switch (level) {
                case 1:
                    return new RoomTierInfo({
                    name: 'Kuru Saman Köşesi',
                    description: 'Zindanın nemli taş zeminine serilmiş bir avuç saman yığını. Gece boyu sırtın sızlasa da tek sığınağın.',
                    nextUpgradeDescription: 'Çuval Bezli Palet Sedir (Kaba ahşap ve kuru saman dolgusu).',
                    bonusSummary: 'Dövüş sonrası dinlenme iyileşmesi: +%10'
                })
                case 2:
                    return new RoomTierInfo({
                    name: 'Çuval Bezli Palet Sedir',
                    description: 'Taş zeminden birkaç parmak yüksekte, kaba çuvallarla desteklenmiş derme çatma ahşap bir sedir. En azından rutubetten koruyor.',
                    nextUpgradeDescription: isHouse ? 'Meşe İskeletli Karyola ve Yün Yorgan.' : 'Eve Dönüşüm Şartı: Meşe Karyola için bağımsız ev gerekir.',
                    bonusSummary: 'Dövüş sonrası dinlenme iyileşmesi: +%20'
                })
                case 3:
                    return new RoomTierInfo({
                    name: 'Meşe İskeletli Karyola',
                    description: 'Sağlam meşe ayaklar üzerine serilmiş temiz koyun yünü şilte. Kemiklerindeki sızıyı dindirip dinlendirir.',
                    nextUpgradeDescription: 'Garnizon Subayı Pirinç Karyolası ve Kuştüyü Yastık.',
                    bonusSummary: 'Dövüş sonrası dinlenme iyileşmesi: +%30, Günlük +5 Can'
                })
                case 4:
                    return new RoomTierInfo({
                    name: 'Garnizon Subayı Pirinç Karyolası',
                    description: 'Gıcırdamayan pirinç döküm karyola ve kalın kadife örtü. Gece deliksiz bir uyku çekmeni sağlar.',
                    nextUpgradeDescription: 'Şampiyonun Kuştüyü Sığınağı ve İpek Perdeler.',
                    bonusSummary: 'Dövüş sonrası dinlenme iyileşmesi: +%40, Günlük +10 Can'
                })
                default:
                    return new RoomTierInfo({
                    name: 'Şampiyonun Kuştüyü Sığınağı',
                    description: 'Diyarın en kaliteli kaz tüyüyle doldurulmuş, sedir kokulu lüks bir dinlenme köşesi.',
                    nextUpgradeDescription: 'Maksimum konfor seviyesine ulaşıldı.',
                    bonusSummary: 'Dövüş sonrası dinlenme iyileşmesi: +%50, Günlük +15 Can'
                })
                }
        case RoomType.TRAINING_GROUND:
                switch (level) {
                case 1:
                    return new RoomTierInfo({
                    name: 'Yırtık Kum Çuvalı',
                    description: 'Tavandaki paslı demire asılı eski bir jüt çuval. İçindeki kaba kum darbelerinle dökülüyor.',
                    nextUpgradeDescription: 'Yontulmuş Ahşap Talim Mankeni.',
                    bonusSummary: 'Dövüşlerden kazanılan EXP: +%10'
                })
                case 2:
                    return new RoomTierInfo({
                    name: 'Yontulmuş Ahşap Talim Mankeni',
                    description: 'Sert meşe kütüğünden kabaca yontulmuş insan silüeti. Göğsündeki çentikler vuruş isabetini artırır.',
                    nextUpgradeDescription: isHouse ? 'Demir Ağırlıklı Avlu Parkuru.' : 'Eve Dönüşüm Şartı: Avlu parkuru için bağımsız ev gerekir.',
                    bonusSummary: 'Dövüşlerden kazanılan EXP: +%20, Günlük İdman +%10 EXP'
                })
                case 3:
                    return new RoomTierInfo({
                    name: 'Demir Ağırlıklı Avlu Parkuru',
                    description: 'Metal plakalar ve prangalarla ağırlaştırılmış, geri savrulan yaylı talim gövdesi. Reflekslerini biler.',
                    nextUpgradeDescription: 'Gladyatör Ustası Çelik Çarkı.',
                    bonusSummary: 'Dövüşlerden kazanılan EXP: +%30, Günlük İdman +%20 EXP'
                })
                case 4:
                    return new RoomTierInfo({
                    name: 'Gladyatör Ustası Çelik Çarkı',
                    description: 'Dönen ahşap kollar ve mekanik siperlerle donatılmış, rakibin kontra vuruşlarını simüle eden profesyonel idman çarkı.',
                    nextUpgradeDescription: 'Şampiyonlar Arenası Parkuru.',
                    bonusSummary: 'Dövüşlerden kazanılan EXP: +%40, Günlük İdman +%35 EXP'
                })
                default:
                    return new RoomTierInfo({
                    name: 'Şampiyonlar Arenası Parkuru',
                    description: 'Her silah türü ve zırh boşluğu için özel yapılmış hedefler, ağırlık istasyonları ve kumlu talim pisti.',
                    nextUpgradeDescription: 'Maksimum idman seviyesine ulaşıldı.',
                    bonusSummary: 'Dövüşlerden kazanılan EXP: +%50, Günlük İdman +%50 EXP'
                })
                }
        case RoomType.TREASURY:
                switch (level) {
                case 1:
                    return new RoomTierInfo({
                    name: 'Taş Zemin Oyuğu',
                    description: 'Duvarın dibindeki gevşek bir taşın arkasına oyulmuş gizli delik. Birkaç bakır sikke ancak sığıyor.',
                    nextUpgradeDescription: 'Paslı Demir Tokmaklı Kutu.',
                    bonusSummary: 'Dövüş başına ek hami bahşişi: +3 Altın'
                })
                case 2:
                    return new RoomTierInfo({
                    name: 'Paslı Demir Tokmaklı Kutu',
                    description: 'Dövme demirden kaba bir sandık ve basit bir asma kilit. Paraların artık farelerin ulaşamayacağı yerde.',
                    nextUpgradeDescription: isHouse ? 'Zemin Altı Tuğla Gizli Zula.' : 'Eve Dönüşüm Şartı: Tuğla zula için bağımsız ev gerekir.',
                    bonusSummary: 'Dövüş başına ek hami bahşişi: +6 Altın'
                })
                case 3:
                    return new RoomTierInfo({
                    name: 'Zemin Altı Tuğla Gizli Zula',
                    description: 'Odanın döşeme taşları altına inşa edilmiş, iki kademeli kilit mekanizmasına sahip gizli kasa.',
                    nextUpgradeDescription: 'Tüccar Loncası Çelik Sandığı.',
                    bonusSummary: 'Dövüş başına ek hami bahşişi: +10 Altın, Günlük Faiz: +2 Altın'
                })
                case 4:
                    return new RoomTierInfo({
                    name: 'Tüccar Loncası Çelik Sandığı',
                    description: 'Ağır döküm çelikten imal edilmiş, yangına ve maymuncuğa dayanıklı lonca sandığı.',
                    nextUpgradeDescription: 'Yeraltı Zırhlı Kasa Mahzeni.',
                    bonusSummary: 'Dövüş başına ek hami bahşişi: +15 Altın, Günlük Faiz: +5 Altın'
                })
                default:
                    return new RoomTierInfo({
                    name: 'Yeraltı Zırhlı Kasa Mahzeni',
                    description: 'Sürgülü çelik kapısı ve kadife bölmeleriyle küçük bir serveti muhafaza eden zırhlı hazine mahzeni.',
                    nextUpgradeDescription: 'Maksimum kasa kapasitesine ulaşıldı.',
                    bonusSummary: 'Dövüş başına ek hami bahşişi: +20 Altın, Günlük Faiz: +10 Altın'
                })
                }
        case RoomType.INFIRMARY:
                switch (level) {
                case 1:
                    return new RoomTierInfo({
                    name: 'Kurutulmuş Isırgan Bağı',
                    description: 'Tavanda ipe asılmış dağ kekiği ve ısırgan otları. Kaynar suya atıldığında sızıyı biraz hafifletir.',
                    nextUpgradeDescription: 'Kil Merhem Çömlekleri & Temiz Sargı Bezi.',
                    bonusSummary: 'İksir ve yemek iyileştirme gücü: +%10'
                })
                case 2:
                    return new RoomTierInfo({
                    name: 'Kil Merhem Çömlekleri & Sargı Bezi',
                    description: 'Koyun iç yağı ve yabani köklerden yapılmış merhemler ile sirkeyle dezenfekte edilmiş temiz bezler.',
                    nextUpgradeDescription: isHouse ? 'Demir Havan & Damıtma İmbikleri.' : 'Eve Dönüşüm Şartı: Damıtma laboratuvarı için ev gerekir.',
                    bonusSummary: 'İksir ve yemek iyileştirme gücü: +%20'
                })
                case 3:
                    return new RoomTierInfo({
                    name: 'Demir Havan & Damıtma İmbikleri',
                    description: 'Bakır borulu damıtma kazanı ve ağır demir havan. Şifalı otların özünü çıkararak kuvvetli tonikler hazırlar.',
                    nextUpgradeDescription: 'Simyacı Tezgâhı & Özüt Mahzeni.',
                    bonusSummary: 'İksir gücü: +%30, Dövüş başı Can: +10'
                })
                case 4:
                    return new RoomTierInfo({
                    name: 'Simyacı Tezgâhı & Özüt Mahzeni',
                    description: 'Cam tüpler, kristalize tuzlar ve kaynayan şifalı iksir kazanları. Ağır darbeleri hızla kapatır.',
                    nextUpgradeDescription: 'Efsunlu Simya Ocağı.',
                    bonusSummary: 'İksir gücü: +%40, Dövüş başı Can: +20'
                })
                default:
                    return new RoomTierInfo({
                    name: 'Efsunlu Simya Ocağı',
                    description: 'Kadim diyar reçeteleriyle hazırlanan efsanevi merhemler ve şifa iksirlerinin kaynadığı kusursuz laboratuvar.',
                    nextUpgradeDescription: 'Maksimum şifa gücüne ulaşıldı.',
                    bonusSummary: 'İksir gücü: +%50, Dövüş başı Can: +30'
                })
                }
        case RoomType.TROPHY_HALL:
                switch (level) {
                case 1:
                    return new RoomTierInfo({
                    name: 'Çentikli Kemik Rafı',
                    description: 'İlk yendiğin kabadayının kırık dişini ve çatlak kemiğini koyduğun tahta raf.',
                    nextUpgradeDescription: 'Kırık Miğferler & Paslı Prangalar.',
                    bonusSummary: 'Kazanılan şöhret puanları: +%10'
                })
                case 2:
                    return new RoomTierInfo({
                    name: 'Kırık Miğferler & Paslı Prangalar',
                    description: 'Alt ettiğin rakiplerin ezik miğferleri ve parçalanmış prangaları duvara çivilenmiş vaziyette.',
                    nextUpgradeDescription: isHouse ? 'Şömine Üstü Kılıç Askısı & Sancaklar.' : 'Eve Dönüşüm Şartı: Kupa salonu için bağımsız ev gerekir.',
                    bonusSummary: 'Kazanılan şöhret puanları: +%20'
                })
                case 3:
                    return new RoomTierInfo({
                    name: 'Şömine Üstü Kılıç Askısı & Sancaklar',
                    description: 'Görkemli bir taş şöminenin üzerine asılı, zafer kazandığın turnuvaların kanlı sancakları ve kırık kılıçları.',
                    nextUpgradeDescription: 'Bronz Heykelli Şeref Köşesi.',
                    bonusSummary: 'Kazanılan şöhret puanları: +%30, Sözleşmelerden +1 Şöhret şansı'
                })
                case 4:
                    return new RoomTierInfo({
                    name: 'Bronz Heykelli Şeref Köşesi',
                    description: 'Kırlangıç Kasabası demircisinin senin siluetinde döktüğü bronz dövüşçü büstü ve altın kaplama kupa tabakları.',
                    nextUpgradeDescription: 'Kırlangıç Efsanesi Zafer Tapınağı.',
                    bonusSummary: 'Kazanılan şöhret puanları: +%40, Sözleşmelerden +1 Şöhret'
                })
                default:
                    return new RoomTierInfo({
                    name: 'Kırlangıç Efsanesi Zafer Tapınağı',
                    description: 'Diyarın dört bir yanından gelen hediyeler, efsanevi zırh levhaları ve kasaba halkının adını andığı altın kitabeler.',
                    nextUpgradeDescription: 'Maksimum şan seviyesine ulaşıldı.',
                    bonusSummary: 'Kazanılan şöhret puanları: +%50, Tüm ödüllerden +2 Şöhret'
                })
                }
        case RoomType.LIBRARY_STUDY:
                switch (level) {
                case 1:
                    return new RoomTierInfo({
                    name: 'Tozlu Parşömen Masası',
                    description: 'Kasaba haritası, kervan güzergahları ve rakiplerin geçmiş dövüş notlarının serildiği çalışma masası.',
                    nextUpgradeDescription: 'Diyar Tarihi & Taktik Kütüphanesi.',
                    bonusSummary: 'Sözleşmelerden altın: +%15, Açık bulma şansı: +%25'
                })
                case 2:
                    return new RoomTierInfo({
                    name: 'Diyar Tarihi & Taktik Kütüphanesi',
                    description: 'Eski ustaların dövüş risaleleri ve kadim yaratık anatomisi kitaplarıyla dolu meşe raflar.',
                    nextUpgradeDescription: 'Mühürlü Fermanlar & İstihbarat Arşivi.',
                    bonusSummary: 'Sözleşmelerden altın: +%25, Açık bulma şansı: +%40'
                })
                default:
                    return new RoomTierInfo({
                    name: 'Mühürlü Fermanlar & Arşiv',
                    description: 'Tüm kasabanın ve garnizonun sırlarını barındıran gizli istihbarat harita odası.',
                    nextUpgradeDescription: 'Maksimum ilim seviyesine ulaşıldı.',
                    bonusSummary: 'Sözleşmelerden altın: +%35, Açık bulma şansı: +%60'
                })
                }
        case RoomType.ARMORY_WORKSHOP:
                switch (level) {
                case 1:
                    return new RoomTierInfo({
                    name: 'Su Çarklı Biley Taşı',
                    description: 'Silahlarının ağzını tıraş bıçağı gibi keskinleştiren ve zırh perçinlerini sıkan çalışma tezgahı.',
                    nextUpgradeDescription: 'Ağır Çekiç & Örs Tezgâhı.',
                    bonusSummary: 'Kalıcı Güç: +3 Taban Hasar, +1 Zırh'
                })
                case 2:
                    return new RoomTierInfo({
                    name: 'Ağır Çekiç & Örs Tezgâhı',
                    description: 'Kendi ekipmanının ağırlık dengesini ayarlayabileceğin ocak ve örs.',
                    nextUpgradeDescription: 'Usta Silahşör Donatım Odası.',
                    bonusSummary: 'Kalıcı Güç: +6 Taban Hasar, +3 Zırh, +%2 Kritik'
                })
                default:
                    return new RoomTierInfo({
                    name: 'Usta Silahşör Donatım Odası',
                    description: 'Kusursuz dengelenmiş kılıç askıları, zırh sehpaları ve özel yağlama takımları.',
                    nextUpgradeDescription: 'Maksimum silahhane seviyesine ulaşıldı.',
                    bonusSummary: 'Kalıcı Güç: +10 Taban Hasar, +5 Zırh, +%5 Kritik'
                })
                }
        case RoomType.GARDEN_CELLAR:
                switch (level) {
                case 1:
                    return new RoomTierInfo({
                    name: 'Güneş Alan Avlu Bostanı',
                    description: 'Evin korunaklı avlusunda yetişen taze adaçayı, nane ve kantaron fideleri.',
                    nextUpgradeDescription: 'Derin Taş Mahzen & Şarap Fıçıları.',
                    bonusSummary: 'Her şafakta +1 Şifa Otu, Gece dinlenmesinde tam sağlık'
                })
                case 2:
                    return new RoomTierInfo({
                    name: 'Derin Taş Mahzen & Fıçılar',
                    description: 'Yerin altında serin kalan taş mahzen; dayanıklılık artıran arpa suyu ve şifa merhemleri saklar.',
                    nextUpgradeDescription: 'Bereketli Sera & İksir Bağı.',
                    bonusSummary: 'Her şafakta +2 Şifa Otu, Dövüş başı +15 Geçici Can'
                })
                default:
                    return new RoomTierInfo({
                    name: 'Bereketli Sera & İksir Bağı',
                    description: 'Egzotik çöl çiçekleri ve dağ köklerinin yetiştirildiği camlı avlu serası.',
                    nextUpgradeDescription: 'Maksimum mahzen seviyesine ulaşıldı.',
                    bonusSummary: 'Her şafakta +3 Şifa Otu, Kalıcı +20 Azami Can'
                })
                }
        case RoomType.STORAGE_VAULT:
                switch (level) {
                case 1:
                    return new RoomTierInfo({
                    name: 'Kutu Odası & Sandık Mahzeni',
                    description: 'Ganimet, maden, taş ve kumaş stoklarını muhafaza eden 4 bölmeli güvenli kasa mahzeni.',
                    nextUpgradeDescription: 'Takviyeli Çelik Kasa Mahzeni.',
                    bonusSummary: '4 Sandık Alanı, Hasat malzemelerini otomatik toplama ve depolama'
                })
                case 2:
                    return new RoomTierInfo({
                    name: 'Takviyeli Çelik Kasa Mahzeni',
                    description: 'Ağır kilitli sürgülü kapılar ve yangına dirençli taş sandık yuvaları.',
                    nextUpgradeDescription: 'Kraliyet Düzeyi Sığınak & Kasa.',
                    bonusSummary: 'Sandık kapasitelerine +%50 ek hacim'
                })
                default:
                    return new RoomTierInfo({
                    name: 'Kraliyet Düzeyi Sığınak & Kasa',
                    description: 'Diyarın en kıymetli hazinelerini ve devasa malzeme yığınlarını koruyan sarsılmaz mahzen.',
                    nextUpgradeDescription: 'Maksimum mahzen seviyesine ulaşıldı.',
                    bonusSummary: 'Sandık kapasitelerine +%100 ek hacim'
                })
                }
    }
}

// Initial Rooms for Base/Home
function createInitialRooms() {
    const restInfo = getRoomTierInfo(RoomType.REST_ROOM, 1)
    const trainInfo = getRoomTierInfo(RoomType.TRAINING_GROUND, 1)
    const treasInfo = getRoomTierInfo(RoomType.TREASURY, 1)
    const infInfo = getRoomTierInfo(RoomType.INFIRMARY, 1)
    const trophInfo = getRoomTierInfo(RoomType.TROPHY_HALL, 1)

    return [
        new HomeRoom({
            id: 'room_rest',
            type: RoomType.REST_ROOM,
            level: 1,
            maxLevel: 5,
            name: restInfo.name,
            currentDescription: restInfo.description,
            nextUpgradeDescription: restInfo.nextUpgradeDescription,
            upgradeCostGold: 40,
            bonusSummary: restInfo.bonusSummary,
            requiredPlayerLevel: 1,
            requiredFame: 0
        }),
        new HomeRoom({
            id: 'room_training',
            type: RoomType.TRAINING_GROUND,
            level: 1,
            maxLevel: 5,
            name: trainInfo.name,
            currentDescription: trainInfo.description,
            nextUpgradeDescription: trainInfo.nextUpgradeDescription,
            upgradeCostGold: 50,
            bonusSummary: trainInfo.bonusSummary,
            requiredPlayerLevel: 2,
            requiredFame: 0,
            requiredOtherRoomId: 'room_rest',
            requiredOtherRoomName: 'İstirahatgah',
            requiredOtherRoomLevel: 1
        }),
        new HomeRoom({
            id: 'room_treasury',
            type: RoomType.TREASURY,
            level: 1,
            maxLevel: 5,
            name: treasInfo.name,
            currentDescription: treasInfo.description,
            nextUpgradeDescription: treasInfo.nextUpgradeDescription,
            upgradeCostGold: 60,
            bonusSummary: treasInfo.bonusSummary,
            requiredPlayerLevel: 2,
            requiredFame: 10,
            requiredOtherRoomId: 'room_rest',
            requiredOtherRoomName: 'İstirahatgah',
            requiredOtherRoomLevel: 1
        }),
        new HomeRoom({
            id: 'room_infirmary',
            type: RoomType.INFIRMARY,
            level: 1,
            maxLevel: 5,
            name: infInfo.name,
            currentDescription: infInfo.description,
            nextUpgradeDescription: infInfo.nextUpgradeDescription,
            upgradeCostGold: 50,
            bonusSummary: infInfo.bonusSummary,
            requiredPlayerLevel: 2,
            requiredFame: 0
        }),
        new HomeRoom({
            id: 'room_trophy',
            type: RoomType.TROPHY_HALL,
            level: 1,
            maxLevel: 5,
            name: trophInfo.name,
            currentDescription: trophInfo.description,
            nextUpgradeDescription: trophInfo.nextUpgradeDescription,
            upgradeCostGold: 70,
            bonusSummary: trophInfo.bonusSummary,
            requiredPlayerLevel: 2,
            requiredFame: 15,
            requiredOtherRoomId: 'room_training',
            requiredOtherRoomName: 'Talimgah',
            requiredOtherRoomLevel: 1
        })
    ]
}

function createHouseExclusiveRooms() {
    const libInfo = getRoomTierInfo(RoomType.LIBRARY_STUDY, 1, true)
    const armInfo = getRoomTierInfo(RoomType.ARMORY_WORKSHOP, 1, true)
    const garInfo = getRoomTierInfo(RoomType.GARDEN_CELLAR, 1, true)
    const vaultInfo = getRoomTierInfo(RoomType.STORAGE_VAULT, 1, true)

    return [
        new HomeRoom({
            id: 'room_library',
            type: RoomType.LIBRARY_STUDY,
            level: 1,
            maxLevel: 3,
            name: libInfo.name,
            currentDescription: libInfo.description,
            nextUpgradeDescription: libInfo.nextUpgradeDescription,
            upgradeCostGold: 70,
            bonusSummary: libInfo.bonusSummary,
            requiredPlayerLevel: 4,
            requiredFame: 30,
            isUnlocked: true,
            isHouseOnly: true
        }),
        new HomeRoom({
            id: 'room_armory',
            type: RoomType.ARMORY_WORKSHOP,
            level: 1,
            maxLevel: 3,
            name: armInfo.name,
            currentDescription: armInfo.description,
            nextUpgradeDescription: armInfo.nextUpgradeDescription,
            upgradeCostGold: 90,
            bonusSummary: armInfo.bonusSummary,
            requiredPlayerLevel: 4,
            requiredFame: 30,
            isUnlocked: true,
            isHouseOnly: true
        }),
        new HomeRoom({
            id: 'room_garden',
            type: RoomType.GARDEN_CELLAR,
            level: 1,
            maxLevel: 3,
            name: garInfo.name,
            currentDescription: garInfo.description,
            nextUpgradeDescription: garInfo.nextUpgradeDescription,
            upgradeCostGold: 60,
            bonusSummary: garInfo.bonusSummary,
            requiredPlayerLevel: 4,
            requiredFame: 30,
            isUnlocked: true,
            isHouseOnly: true
        }),
        new HomeRoom({
            id: 'room_vault',
            type: RoomType.STORAGE_VAULT,
            level: 1,
            maxLevel: 3,
            name: vaultInfo.name,
            currentDescription: vaultInfo.description,
            nextUpgradeDescription: vaultInfo.nextUpgradeDescription,
            upgradeCostGold: 80,
            bonusSummary: vaultInfo.bonusSummary,
            requiredPlayerLevel: 4,
            requiredFame: 30,
            isUnlocked: true,
            isHouseOnly: true
        })
    ]
}

// 5 Unique NPC League Fighters (Pek bilinmeyen, garip gurup isimler ve lakaplar)
function createInitialEnemies() {
    return [
        new Enemy({
            id: 'fighter_khorvash',
            name: 'Khorvash',
            title: 'Tuz Gözlü',
            level: 1,
            stats: new Stats({maxHealth: 85, damage: 9, armor: 3, speed: 9, dodgeChancePercent: 8}),
            weaponName: 'Kör İğneli Balık Oltası',
            weaponType: 'olta',
            description: 'Tuz çöllerinden sürülmüş, kataraktlı gözleriyle ancak gölgeleri seçebilen fakat kulaklarıyla hamle yapan garip bir savaşçı.',
            rewardGold: 16,
            rewardExp: 25,
            rewardFame: 1,
            personality: new FighterPersonality({
                archetype: PersonalityArchetype.GIZEMLI,
                bio: 'Tuz çölü kehanetlerine inanır. Gözleri görmez ama kumdaki titreşimleri sezer.',
                gold: 22,
                latestDiary: 'Tuz çölünden getirdiği koku keselerini koklayıp arenanın rüzgarını dinledi.'
            }),
            skills: [
                new GladiatorSkill({id: 'skill_khorvash_1', name: 'Tuz İğnesi Saplaması', icon: '🪡', type: SkillType.ATTACK, tier: 1, cooldownTurns: 2, description: 'Kör iğneli kancayı hasmın boğazına doğru savurur.', combatEffect: '+%25 Hasar ve derin kesik'}),
                new GladiatorSkill({id: 'skill_khorvash_2', name: 'Tuz Çölü Sezgisi', icon: '👂', type: SkillType.DEFENSE, tier: 1, cooldownTurns: 3, description: 'Gözleri görmese de kumdaki titreşimleri dinleyerek darbenin altından kayar.', combatEffect: '%35 Kaçınma ve +2 Hız'}),
                new GladiatorSkill({id: 'skill_khorvash_3', name: 'Kör Eden Tuz Dumanı', icon: '🧂', type: SkillType.TACTICAL, tier: 1, cooldownTurns: 3, description: 'Avucundaki yakıcı çöl tuzunu rakibin gözüne savurur.', combatEffect: 'Rakip 1 tur ıskalar'}),
                new GladiatorSkill({id: 'skill_khorvash_4', name: 'Tuz Çölü Kıskacı', icon: '☠️', type: SkillType.ULTIMATE, tier: 1, cooldownTurns: 4, description: 'Oltayı rakibin boynuna dolayarak kumlara çalar ve acımasızca çeker.', combatEffect: '+%60 Hasar ve Kanama'})
            ]
        }),
        new Enemy({
            id: 'fighter_zalmora',
            name: 'Zal\'Mora',
            title: 'Kül Kemiren',
            level: 2,
            stats: new Stats({maxHealth: 105, damage: 12, armor: 5, speed: 8, critChancePercent: 10}),
            weaponName: 'Bilenmiş Boynuz Hançer',
            weaponType: 'boynuz',
            description: 'Yenilgiye uğradığı her dövüşten sonra arenanın küllerini çiğneyen, acıya karşı bağışıklık kazanmış vahşi bir köle.',
            rewardGold: 24,
            rewardExp: 40,
            rewardFame: 1,
            lootDrop: new Equipment({
                id: 'eq_drop_horn_dagger',
                name: 'Bilenmiş Boynuz Hançer',
                slot: EquipmentSlot.WEAPON,
                rarity: ItemRarity.SIRADAN,
                stats: new Stats({damage: 9, critChancePercent: 8}),
                requiredLevel: 2,
                valueInGold: 25,
                description: 'Zal\'Mora\'nın elinden düşen, ucu zehir gibi sivriltilmiş dağ keçisi boynuzu.',
                weaponType: 'boynuz'
            }),
            personality: new FighterPersonality({
                archetype: PersonalityArchetype.VAHSI,
                bio: 'Yaralarını külle dağlayan, acıya doymayan vahşi gladyatör.',
                gold: 28,
                latestDiary: 'Boynuz hançerinin ucunu kumtaşına sürterek kanatıcı dişler açtı.'
            }),
            skills: [
                new GladiatorSkill({id: 'skill_zalmora_1', name: 'Kül Dağlayan Boynuz', icon: '🪓', type: SkillType.ATTACK, tier: 1, cooldownTurns: 2, description: 'Bilenmiş boynuz hançeriyle rakibin böğrüne vahşi bir darbe indirir.', combatEffect: '+%30 Hasar ve kanama'}),
                new GladiatorSkill({id: 'skill_zalmora_2', name: 'Acı Tanımaz Dirayet', icon: '🩸', type: SkillType.DEFENSE, tier: 1, cooldownTurns: 3, description: 'Acıyı gülerek karşılar, kaslarını sıkıp darbenin etkisini kırar.', combatEffect: '%45 Hasar Azaltma'}),
                new GladiatorSkill({id: 'skill_zalmora_3', name: 'Köz Tükürüşü', icon: '🔥', type: SkillType.TACTICAL, tier: 1, cooldownTurns: 3, description: 'Ağzında gevelediği kor külleri hasmın yüzüne püskürtür.', combatEffect: 'Rakibin Zırhı -%25'}),
                new GladiatorSkill({id: 'skill_zalmora_4', name: 'Kudurmuş Köle Gazabı', icon: '💥', type: SkillType.ULTIMATE, tier: 1, cooldownTurns: 4, description: 'Vahşi bir böğürtüyle öne atılıp boynuz hançeriyle rakibi art arda deşer.', combatEffect: '+%70 Hasar ve Zırh Delme'})
            ]
        }),
        new Enemy({
            id: 'fighter_xylar',
            name: 'Xylar',
            title: 'Demir Diş',
            level: 3,
            stats: new Stats({maxHealth: 135, damage: 15, armor: 7, speed: 7, blockChancePercent: 12}),
            weaponName: 'Çivili Ahşap Tokmak',
            weaponType: 'tokmak',
            description: 'Dövüşlerde dökülen dişlerinin yerine demir perçinler çaktırmış, acıyı gülümseyerek karşılayan iri cüsseli sokak gladyatörü.',
            rewardGold: 38,
            rewardExp: 60,
            rewardFame: 2,
            personality: new FighterPersonality({
                archetype: PersonalityArchetype.TEMBEL,
                bio: 'Dövüş bittiği gibi soluğu handa alır; kazandığı altınları zarlara ve arpa birasına gömer.',
                gold: 24,
                latestDiary: 'Dün gece handa barbut oynayıp kazandığıyla fıçı dibini gördü; sabah arenaya esneyerek geldi.'
            }),
            skills: [
                new GladiatorSkill({id: 'skill_xylar_1', name: 'Çivili Kütük İndirişi', icon: '🔨', type: SkillType.ATTACK, tier: 1, cooldownTurns: 2, description: 'Ağır çivili tokmağı havaya kaldırıp rakibin omzuna indirir.', combatEffect: '+%30 Hasar ve sarsıntı'}),
                new GladiatorSkill({id: 'skill_xylar_2', name: 'Demir Çene Tebessümü', icon: '😁', type: SkillType.DEFENSE, tier: 1, cooldownTurns: 3, description: 'Demir perçinli dişlerini göstererek darbeyi göğüsler.', combatEffect: '%50 Hasar Azaltma ve +5 Zırh'}),
                new GladiatorSkill({id: 'skill_xylar_3', name: 'Perçinli Kafa Darbesi', icon: '💥', type: SkillType.TACTICAL, tier: 1, cooldownTurns: 3, description: 'Yakın mesafeden demir perçinli alnını rakibin burnuna çakar.', combatEffect: 'Rakibi Sersemletir'}),
                new GladiatorSkill({id: 'skill_xylar_4', name: 'Kemik Kıran Tokmak Ezmesi', icon: '⚡', type: SkillType.ULTIMATE, tier: 1, cooldownTurns: 4, description: 'Tüm vücut ağırlığıyla tokmağı göğüs kafesine geçirip kumlara serer.', combatEffect: '+%65 Hasar ve Zırh Kırma'})
            ]
        }),
        new Enemy({
            id: 'fighter_vaelen',
            name: 'Vaelen',
            title: 'Kör Akbaba',
            level: 4,
            stats: new Stats({maxHealth: 155, damage: 19, armor: 8, speed: 10, critChancePercent: 12, dodgeChancePercent: 8}),
            weaponName: 'Gölge Kancası',
            weaponType: 'kanca',
            description: 'Dövüş boyunca rakibinin etrafında dönüp yorulmasını bekleyen, tek bir açıkta kancasını boğaza takan soğukkanlı bir taktikçi.',
            rewardGold: 55,
            rewardExp: 85,
            rewardFame: 2,
            personality: new FighterPersonality({
                archetype: PersonalityArchetype.KURNAZ,
                bio: 'Karanlık pazarlıklara ve bahis hilelerine meraklı sinsi taktikçi.',
                gold: 48,
                latestDiary: 'Arenadaki kura maçlarına gizlice bahis yatırıp 20 altın vurdu.'
            }),
            skills: [
                new GladiatorSkill({id: 'skill_vaelen_1', name: 'Gölge Kancası Çentmesi', icon: '🪝', type: SkillType.ATTACK, tier: 1, cooldownTurns: 2, description: 'Kavisli kancasını rakibin zırh bağlantılarına takıp etini deşer.', combatEffect: '+%25 Hasar ve kanama'}),
                new GladiatorSkill({id: 'skill_vaelen_2', name: 'Akbaba Kanadı Sıyrılışı', icon: '💨', type: SkillType.DEFENSE, tier: 1, cooldownTurns: 3, description: 'Pelerinin arkasına gizlenerek rakibin hamlesini boşa düşürür.', combatEffect: '%40 Kaçınma'}),
                new GladiatorSkill({id: 'skill_vaelen_3', name: 'Kiriş Kesen Çelme', icon: '🎯', type: SkillType.TACTICAL, tier: 1, cooldownTurns: 3, description: 'Kancayı rakibin diz kapağı arkasına takıp yere kapaklatır.', combatEffect: 'Rakibin Hızı -4 ve Gard Kırma'}),
                new GladiatorSkill({id: 'skill_vaelen_4', name: 'Akbaba Pençesi İnfazı', icon: '☠️', type: SkillType.ULTIMATE, tier: 1, cooldownTurns: 4, description: 'Soğukkanlılıkla rakibin açık verdiği ana odaklanıp şah damarına kanca saplar.', combatEffect: '+%80 Kritik Hasar'})
            ]
        }),
        new Enemy({
            id: 'fighter_morvath',
            name: 'Morvath',
            title: 'Isırgan Otu (Lig Lideri)',
            level: 5,
            stats: new Stats({maxHealth: 210, damage: 25, armor: 12, speed: 10, blockChancePercent: 15, critChancePercent: 10}),
            weaponName: 'Üç Ağızlı Kargı',
            weaponType: 'kargı',
            description: 'Kırlangıç Kasabası arenasında 14 haftadır liderliği bırakmayan kurnaz şampiyon. Rakibini mesafede tutup yavaş yavaş kanatarak bitirir.',
            rewardGold: 95,
            rewardExp: 150,
            rewardFame: 3,
            lootDrop: new Equipment({
                id: 'eq_drop_morvath_spear',
                name: 'Üç Ağızlı Kargı',
                slot: EquipmentSlot.WEAPON,
                rarity: ItemRarity.USTAISI,
                stats: new Stats({damage: 18, speed: 2, blockChancePercent: 6}),
                requiredLevel: 4,
                valueInGold: 95,
                description: 'Morvath\'ın kasaba arenasını inleten üç başlı çatal kargısı.',
                weaponType: 'kargı'
            }),
            personality: new FighterPersonality({
                archetype: PersonalityArchetype.GURURLU,
                bio: '14 haftadır unvanını koruyan disiplinli lig şampiyonu.',
                gold: 85,
                latestDiary: 'Üç ağızlı kargısının sapını balmumuyla parlattı ve şampiyonluk unvanını koruma yemini etti.'
            }),
            skills: [
                new GladiatorSkill({id: 'skill_morvath_1', name: 'Çatal Kargı Dürtüşü', icon: '🔱', type: SkillType.ATTACK, tier: 1, cooldownTurns: 2, description: 'Üç dilli kargıyı iki elle öne sürerek zırhı yarar.', combatEffect: '+%35 Hasar ve Zırh Delme'}),
                new GladiatorSkill({id: 'skill_morvath_2', name: 'Süvari Nizamı Siperi', icon: '🛡️', type: SkillType.DEFENSE, tier: 1, cooldownTurns: 3, description: 'Kargıyı yatay tutarak gelen saldırıyı kusursuzca yana saptırır.', combatEffect: '%55 Blok ve Karşı Duruş'}),
                new GladiatorSkill({id: 'skill_morvath_3', name: 'Isırgan Otu Tuzağı', icon: '🕸️', type: SkillType.TACTICAL, tier: 1, cooldownTurns: 3, description: 'Kargının çatalı arasına rakibin silahını kıstırıp burkarak dengesini bozar.', combatEffect: 'Rakibin Saldırısı -%30 ve Sersemletme'}),
                new GladiatorSkill({id: 'skill_morvath_4', name: 'Kırlangıç Şampiyonu Hükmü', icon: '👑', type: SkillType.ULTIMATE, tier: 1, cooldownTurns: 4, description: 'On dört haftalık namağlup şampiyonluk kudretiyle kargıyı göğse mıhlar.', combatEffect: '+%85 Hasar ve Ağır Kanama'})
            ]
        }),
        new Enemy({
            id: 'fighter_bregash',
            name: 'Bregash',
            title: 'Ters Pala',
            level: 3,
            stats: new Stats({maxHealth: 130, damage: 16, armor: 6, speed: 8, critChancePercent: 12}),
            weaponName: 'Ağır Eğri Kasap Palası',
            weaponType: 'pala',
            description: 'Sazlık mezbahalarından arenaya sürülmüş, palasını ters tutup aşağıdan yukarıya doğru kemik deşen acımasız bir gladyatör.',
            rewardGold: 36,
            rewardExp: 55,
            rewardFame: 1,
            personality: new FighterPersonality({
                archetype: PersonalityArchetype.VAHSI,
                bio: 'Mezbaha alışkanlıklarını arenaya taşıyan kan dökücü kaba kuvvet.',
                gold: 32,
                latestDiary: 'Kasap palasını domuz yağıyla ovup kurbanının eklemlerini hedefleme talimi yaptı.'
            }),
            skills: [
                new GladiatorSkill({id: 'skill_bregash_1', name: 'Ters Kasap Kesişi', icon: '🗡️', type: SkillType.ATTACK, tier: 1, cooldownTurns: 2, description: 'Palasını aşağıdan yukarıya ters savurarak kaburgaları biçer.', combatEffect: '+%30 Hasar ve kanama'}),
                new GladiatorSkill({id: 'skill_bregash_2', name: 'Meşin Önlük Siperi', icon: '🛡️', type: SkillType.DEFENSE, tier: 1, cooldownTurns: 3, description: 'Kurumuş kanla sertleşmiş kalın kasap önlüğünü siper yapar.', combatEffect: '%40 Hasar Azaltma'}),
                new GladiatorSkill({id: 'skill_bregash_3', name: 'Kiriş Biçen Hamle', icon: '🦵', type: SkillType.TACTICAL, tier: 1, cooldownTurns: 3, description: 'Ters pala ucuyla rakibin aşil tendonunu hedef alır.', combatEffect: 'Rakibin Kaçınması Sıfırlanır ve Hız -5'}),
                new GladiatorSkill({id: 'skill_bregash_4', name: 'Mezbaha Kıyımı', icon: '🩸', type: SkillType.ULTIMATE, tier: 1, cooldownTurns: 4, description: 'Gözü dönmüş bir vahşetle palayı art arda savurarak rakibi karkas gibi doğrar.', combatEffect: '+%75 Hasar ve İnfaz'})
            ]
        }),
        new Enemy({
            id: 'fighter_kaelen',
            name: 'Kaelen',
            title: 'Kör Arbaletçi',
            level: 3,
            stats: new Stats({maxHealth: 120, damage: 16, armor: 5, speed: 12, critChancePercent: 14}),
            weaponName: 'Mekanik Kundaklı Arbalet',
            weaponType: 'arbalet',
            description: 'Göz bağının altından yalnızca sesleri dinleyen, yayın çıt sesiyle hasmının göğsüne çelik ok çakan ölümcül nişancı.',
            rewardGold: 42,
            rewardExp: 60,
            rewardFame: 2,
            personality: new FighterPersonality({
                archetype: PersonalityArchetype.HIRSLI,
                bio: 'Kundağının mekanik parçalarını geliştirmek için kazancını demirci tezgahlarına akıtır.',
                gold: 40,
                latestDiary: 'Mekanik kundak yayının dişlilerini demircide yağlatıp çelik gerginliğini artırdı.'
            }),
            skills: [
                new GladiatorSkill({id: 'skill_kaelen_1', name: 'Çelik Temren Cıvası', icon: '🏹', type: SkillType.ATTACK, tier: 1, cooldownTurns: 2, description: 'Kör gözlerine rağmen kulağıyla hedef alıp ağır oku fırlatır.', combatEffect: '+%35 Hasar ve Zırh Delme'}),
                new GladiatorSkill({id: 'skill_kaelen_2', name: 'Yankı Refleksi', icon: '💨', type: SkillType.DEFENSE, tier: 1, cooldownTurns: 3, description: 'Havayı yaran kılıç ıslığını duyduğu anda yana takla atar.', combatEffect: '%45 Kaçınma'}),
                new GladiatorSkill({id: 'skill_kaelen_3', name: 'Kundak Dumanı Bombası', icon: '💨', type: SkillType.TACTICAL, tier: 1, cooldownTurns: 3, description: 'Ayağının dibine duman kapsülü kırarak rakibin görüşünü tamamen kapatır.', combatEffect: 'Rakip 1 tur ıska geçer'}),
                new GladiatorSkill({id: 'skill_kaelen_4', name: 'Kör Nokta Salvosu', icon: '🎯', type: SkillType.ULTIMATE, tier: 1, cooldownTurns: 4, description: 'Mekanik mandalı çekerek üç çelik oku peş peşe hedefin göğsüne boşaltır.', combatEffect: '+%80 Hasar ve Çoklu İsabet'})
            ]
        }),
        new Enemy({
            id: 'fighter_ghorak',
            name: 'Ghorak',
            title: 'Zincirli Hortlak',
            level: 4,
            stats: new Stats({maxHealth: 165, damage: 20, armor: 10, speed: 7, blockChancePercent: 16}),
            weaponName: 'Dikenli Pranga ve Zincir Topuz',
            weaponType: 'zincir',
            description: 'Bileğindeki ağır prangaya kaynaklanmış dikenli demir gülleyi savurarak dövüşen, kalkanların arkasından kavis çizen eski bir kürek mahkumu.',
            rewardGold: 60,
            rewardExp: 90,
            rewardFame: 2,
            personality: new FighterPersonality({
                archetype: PersonalityArchetype.GURURLU,
                bio: 'Eski kürek mahkumu; prangalarını zırhının bir parçası olarak benimsemiş çelik savunucu.',
                gold: 50,
                latestDiary: 'Prangasının halkalarını sağlam çelikle lehimletip göğüs zırhını perçinledi.'
            }),
            skills: [
                new GladiatorSkill({id: 'skill_ghorak_1', name: 'Zincir Kırbaçlaması', icon: '⛓️', type: SkillType.ATTACK, tier: 1, cooldownTurns: 2, description: 'Dikenli gülleyi kalkanın üzerinden kavisle rakibin arkasına çarpar.', combatEffect: '+%30 Hasar ve Kalkan Aşma'}),
                new GladiatorSkill({id: 'skill_ghorak_2', name: 'Demir Pranga Bağı', icon: '🛡️', type: SkillType.DEFENSE, tier: 1, cooldownTurns: 3, description: 'Bileğindeki kalın halkaları kaldırıp gelen kılıcı zincirde kilitler.', combatEffect: '%60 Hasar Azaltma'}),
                new GladiatorSkill({id: 'skill_ghorak_3', name: 'Bilek Dolanması', icon: '🎯', type: SkillType.TACTICAL, tier: 1, cooldownTurns: 3, description: 'Zinciri hasmın ayak bileklerine dolayıp kumlara kapaklatır.', combatEffect: 'Rakip Yere Serilir (-4 Hız, Açık Verir)'}),
                new GladiatorSkill({id: 'skill_ghorak_4', name: 'Forsa İntikamı Gazabı', icon: '💥', type: SkillType.ULTIMATE, tier: 1, cooldownTurns: 4, description: '15 kiloluk gülle zincirini kükreyerek savurur ve kafatasına çarpar.', combatEffect: '+%85 Ezici Hasar ve Sersemletme'})
            ]
        }),
        new Enemy({
            id: 'fighter_thyra',
            name: 'Thyra',
            title: 'Kemik Yaran',
            level: 5,
            stats: new Stats({maxHealth: 180, damage: 23, armor: 10, speed: 9, critChancePercent: 14}),
            weaponName: 'Çift Ağızlı Çelik Nacak',
            weaponType: 'nacak',
            description: 'Dağ klanlarından sürgün edilmiş vahşi bir savaşçı; nacağıyla rakibin zırh perçinlerini parçalayıp doğrudan kemiğe saldırır.',
            rewardGold: 85,
            rewardExp: 130,
            rewardFame: 3,
            personality: new FighterPersonality({
                archetype: PersonalityArchetype.HIRSLI,
                bio: 'Dağ klanının en güçlüsü olmak için her dövüş sonrası şınav ve ağırlık çeken disiplin abidesi.',
                gold: 58,
                latestDiary: 'Dağ klanı geleneklerine göre nacağını bileme taşına yatırıp kütük yardı.'
            }),
            skills: [
                new GladiatorSkill({id: 'skill_thyra_1', name: 'Çift Ağızlı Balta Yırtışı', icon: '🪓', type: SkillType.ATTACK, tier: 1, cooldownTurns: 2, description: 'Nacağını iki elle kavrayıp zırh perçinlerini parçalar.', combatEffect: '+%35 Hasar ve Zırh Yarma'}),
                new GladiatorSkill({id: 'skill_thyra_2', name: 'Kuzey Kurdu Postu', icon: '🐺', type: SkillType.DEFENSE, tier: 1, cooldownTurns: 3, description: 'Omuzlarındaki kutup kurdu postuna bürünerek darbenin şokunu emer.', combatEffect: '%45 Hasar Azaltma'}),
                new GladiatorSkill({id: 'skill_thyra_3', name: 'Dağ Klanı Narası', icon: '📢', type: SkillType.TACTICAL, tier: 1, cooldownTurns: 3, description: 'Yırtıcı bir kurt çığlığı atarak hasmın yüreğine korku salar.', combatEffect: 'Rakibin Zırhı ve Saldırısı -%20'}),
                new GladiatorSkill({id: 'skill_thyra_4', name: 'Kutup Çığı Yıkımı', icon: '❄️', type: SkillType.ULTIMATE, tier: 1, cooldownTurns: 4, description: 'Havaya sıçrayarak nacağını tüm gücüyle yere çakar, kumu ve kemikleri yarar.', combatEffect: '+%90 Yıkıcı Kritik Hasar'})
            ]
        }),
        new Enemy({
            id: 'fighter_orn',
            name: 'Orn',
            title: 'Balçık Yılanı',
            level: 4,
            stats: new Stats({maxHealth: 145, damage: 18, armor: 7, speed: 12, dodgeChancePercent: 12}),
            weaponName: 'Çengelli Avcı Zıpkını',
            weaponType: 'zıpkın',
            description: 'Bataklıklardan gelen sinsi bir dövüşçü; zıpkınının çengeliyle rakibin zırhına ve etine takılıp dengesini bozar.',
            rewardGold: 52,
            rewardExp: 80,
            rewardFame: 2,
            personality: new FighterPersonality({
                archetype: PersonalityArchetype.KURNAZ,
                bio: 'Bataklık sazlıklarında avlanarak yetişmiş; tuzaklar ve zehirli çengellerle dövüşen fırsatçı.',
                gold: 38,
                latestDiary: 'Zıpkınının çengeline sazlık bataklığından topladığı uyuşturucu reçineyi sürdü.'
            }),
            skills: [
                new GladiatorSkill({id: 'skill_orn_1', name: 'Zıpkın Saplaması', icon: '🔱', type: SkillType.ATTACK, tier: 1, cooldownTurns: 2, description: 'Çengelli zıpkını rakibin bacağına saplar.', combatEffect: '+%25 Hasar ve kanama'}),
                new GladiatorSkill({id: 'skill_orn_2', name: 'Balçık Kayışı', icon: '🐍', type: SkillType.DEFENSE, tier: 1, cooldownTurns: 3, description: 'Bataklık yılanı gibi kumlarda kayarak darbeden sıyrılır.', combatEffect: '%40 Kaçınma'}),
                new GladiatorSkill({id: 'skill_orn_3', name: 'Uyuşturan Bataklık Reçinesi', icon: '🧪', type: SkillType.TACTICAL, tier: 1, cooldownTurns: 3, description: 'Zıpkından sızan zehirle hasmın eklemlerini kilitler.', combatEffect: 'Rakibin Hızı -5 ve Gard Kırma'}),
                new GladiatorSkill({id: 'skill_orn_4', name: 'Bataklık Çengeli Boğması', icon: '☠️', type: SkillType.ULTIMATE, tier: 1, cooldownTurns: 4, description: 'Çengeli göğse geçirip ipiyle rakibin boynunu sarar ve kumlara gömer.', combatEffect: '+%75 Hasar ve Boğma'})
            ]
        }),
        new Enemy({
            id: 'fighter_sarkoth',
            name: 'Sarkoth',
            title: 'Kum Akrebi',
            level: 4,
            stats: new Stats({maxHealth: 150, damage: 19, armor: 7, speed: 11, critChancePercent: 14, dodgeChancePercent: 8}),
            weaponName: 'Çift Zehirli Kemik Kama',
            weaponType: 'kama',
            description: 'Kumların altında pusu kurup zehir sürülmüş kamalarıyla rakibin eklemlerini hedef alan çöl gladyatörü.',
            rewardGold: 55,
            rewardExp: 85,
            rewardFame: 2,
            personality: new FighterPersonality({
                archetype: PersonalityArchetype.KURNAZ,
                bio: 'Çöl kumlarında iz bırakmadan süzülen, zehir ve sıyrılma ustası akrep savaşçısı.',
                gold: 48,
                latestDiary: 'Çift kamasının kınını akrep yağıyla ovup sıyrılma adımlarını prova etti.'
            }),
            skills: [
                new GladiatorSkill({id: 'skill_sarkoth_1', name: 'Çift Kama Kıskacı', icon: '🗡️', type: SkillType.ATTACK, tier: 1, cooldownTurns: 2, description: 'İki kemik kamasını rakibin böğrüne aynı anda saplar.', combatEffect: '+%30 Hasar ve Çifte Delme'}),
                new GladiatorSkill({id: 'skill_sarkoth_2', name: 'Kum Altı Pususu', icon: '🦂', type: SkillType.DEFENSE, tier: 1, cooldownTurns: 3, description: 'Kum fırtınası kaldırarak gözden kaybolur.', combatEffect: '%50 Kaçınma'}),
                new GladiatorSkill({id: 'skill_sarkoth_3', name: 'Akrep Zehri Salgısı', icon: '🧪', type: SkillType.TACTICAL, tier: 1, cooldownTurns: 3, description: 'Kamalardaki koyu sarı akrep zehrini açık yaraya akıtır.', combatEffect: '3 Tur Boyunca Ağır Zehir DoT'}),
                new GladiatorSkill({id: 'skill_sarkoth_4', name: 'Ölümcül Akrep Kıskacı', icon: '💥', type: SkillType.ULTIMATE, tier: 1, cooldownTurns: 4, description: 'İki kamayı makas gibi açıp hasmın şah damarına kilitler.', combatEffect: '+%85 Kritik Hasar ve İnfaz'})
            ]
        })
    ]
}

// Initial Region: Kırlangıç Kasabası
function createInitialRegion() {
    const blacksmithItems = [
        new Equipment({
            id: 'eq_shop_guard_sword',
            name: 'Bilenmiş Muhafız Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({damage: 9, critChancePercent: 4}),
            requiredLevel: 2,
            valueInGold: 45,
            description: 'Kasaba muhafızlarının kemerinde parıldayan, dengeli dövülmüş çelik kılıç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD
        }),
        new Equipment({
            id: 'eq_shop_cleaver_axe',
            name: 'Geniş Ağızlı Nacak',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({damage: 10, critChancePercent: 5}),
            requiredLevel: 2,
            valueInGold: 44,
            description: 'Tek vuruşta kalın derileri ve kalkan kenarlarını yaran ağır balta.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE
        }),
        new Equipment({
            id: 'eq_shop_spiked_mace',
            name: 'Çivili Demir Gürz',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({damage: 11, speed: -1}),
            requiredLevel: 2,
            valueInGold: 42,
            description: 'Ağır demir topuz; zırhlı rakiplerin kemiklerini çatırdatır.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE
        }),
        new Equipment({
            id: 'eq_shop_twin_daggers',
            name: 'Çift Avcı Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({damage: 7, speed: 3, critChancePercent: 8}),
            requiredLevel: 2,
            valueInGold: 40,
            description: 'Süratli ve seri sokulmalar için dövülmüş kısa çift hançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER
        }),
        new Equipment({
            id: 'eq_shop_iron_spear',
            name: 'Demir Temrenli Mızrak',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({damage: 8, speed: 2}),
            requiredLevel: 2,
            valueInGold: 38,
            description: 'Ucu ocakta sertleştirilmiş kasaba mızrağı. Uzaktan delici hamleler yapar.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR
        }),
        new Equipment({
            id: 'eq_shop_studded_vest',
            name: 'Çivili Deri Yelek',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({armor: 4, maxHealth: 15, dodgeChancePercent: 2}),
            requiredLevel: 2,
            valueInGold: 40,
            description: 'Üzerine demir çiviler perçinlenmiş hafif avcı derisi.',
            armorCategory: ArmorCategory.LIGHT_ARMOR
        }),
        new Equipment({
            id: 'eq_shop_iron_plate',
            name: 'Dövme Demir Göğüslük',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({armor: 7, maxHealth: 30, speed: -1}),
            requiredLevel: 3,
            valueInGold: 60,
            description: 'Kalın dövülmüş demir plaka zırh. Göğsü ölümcül darbelerden korur.',
            armorCategory: ArmorCategory.HEAVY_ARMOR
        }),
        new Equipment({
            id: 'eq_shop_iron_helmet',
            name: 'Burunluklu Demir Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({armor: 3, maxHealth: 10}),
            requiredLevel: 2,
            valueInGold: 32,
            description: 'Göz ve burun hizasını koruyan sağlam gladyatör kaskı.',
            armorCategory: ArmorCategory.HELMET
        }),
        new Equipment({
            id: 'eq_shop_riveted_gloves',
            name: 'Perçinli Gladyatör Eldiveni',
            slot: EquipmentSlot.GLOVES,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({armor: 2, speed: 1}),
            requiredLevel: 2,
            valueInGold: 24,
            description: 'Bilekleri ve parmak eklemlerini koruyan perçinli deri eldiven.',
            armorCategory: ArmorCategory.GLOVES
        }),
        new Equipment({
            id: 'eq_shop_oak_shield',
            name: 'Meşe Kaplı Demir Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({armor: 3, blockChancePercent: 8}),
            requiredLevel: 2,
            valueInGold: 38,
            description: 'Sol kolda taşınarak savrulan darbeleri çınlatarak saptıran kalkan.',
            accessoryCategory: AccessoryCategory.SHIELD
        }),
        new Equipment({
            id: 'eq_shop_war_axe',
            name: 'Çift Taraflı Savaş Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({damage: 14, critChancePercent: 8}),
            requiredLevel: 3,
            valueInGold: 75,
            description: 'Ağır çift ağızlı demir balta. Kalın zırhları ve kalkanları parçalar.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE
        }),
        new Equipment({
            id: 'eq_shop_master_sword',
            name: 'Usta İşi Çelik Kılıç',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 17, critChancePercent: 6, speed: 1}),
            requiredLevel: 4,
            valueInGold: 110,
            description: 'Su verilmiş katı çelikten dövülmüş, kusursuz dengelenmiş gladyatör kılıcı.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD
        }),
        new Equipment({
            id: 'eq_shop_knight_lance',
            name: 'Ağır Siperli Şövalye Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 18, blockChancePercent: 6}),
            requiredLevel: 4,
            valueInGold: 120,
            description: 'Uzak mesafeden hasmın zırhını deşen, sapında çelik el siperi bulunan kargı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR
        }),
        new Equipment({
            id: 'eq_shop_shadow_dagger',
            name: 'Gölge Kıvrımlı Zehir Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({damage: 12, speed: 3, critChancePercent: 12}),
            requiredLevel: 3,
            valueInGold: 85,
            description: 'Eğri namlulu, seri sokulmalar için ideal zehir oluklu hançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER
        }),
        new Equipment({
            id: 'eq_shop_spiked_morningstar',
            name: 'Dikenli Çelik Şafak Yıldızı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({damage: 16, critChancePercent: 6, blockChancePercent: 4}),
            requiredLevel: 4,
            valueInGold: 95,
            description: 'Dikenli ağır çelik gürz başı; kemik kırar ve sersemletir.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE
        }),
        new Equipment({
            id: 'eq_shop_composite_bow',
            name: 'Kompozit Boynuz Yay',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({damage: 13, speed: 3, critChancePercent: 8}),
            requiredLevel: 3,
            valueInGold: 70,
            description: 'Boynuz ve sinir katmanlarıyla güçlendirilmiş, gerilimi yüksek refleks yay.',
            weaponType: 'yay',
            weaponCategory: WeaponCategory.BOW
        }),
        new Equipment({
            id: 'eq_shop_heavy_halberd',
            name: 'Kara Çelik Kanatlı Teber',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 22, critChancePercent: 8, speed: -1}),
            requiredLevel: 5,
            valueInGold: 160,
            description: 'Geniş balta ağzı ve arka kancasıyla zırh söken devasa savaş teberi.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.AXE
        }),
        new Equipment({
            id: 'eq_shop_scale_vest',
            name: 'Pullu Çelik Avcı Yeleği',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({armor: 6, maxHealth: 20, dodgeChancePercent: 3}),
            requiredLevel: 3,
            valueInGold: 65,
            description: 'Deri yelek üzerine üst üste binen çelik pullar perçinlenmiş hafif zırh.',
            armorCategory: ArmorCategory.LIGHT_ARMOR
        }),
        new Equipment({
            id: 'eq_shop_champion_plate',
            name: 'Takviyeli Şampiyon Zırhı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 10, maxHealth: 45, speed: -1}),
            requiredLevel: 4,
            valueInGold: 130,
            description: 'Arena şampiyonları için özel dövülmüş kalın göğüs plakası ve omuzluklar.',
            armorCategory: ArmorCategory.HEAVY_ARMOR
        }),
        new Equipment({
            id: 'eq_shop_horned_helm',
            name: 'Boynuzlu Gladyatör Miğferi',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({armor: 5, maxHealth: 18, blockChancePercent: 3}),
            requiredLevel: 3,
            valueInGold: 55,
            description: 'Yüzü koruyan ızgaralı siperlik ve tepesinde iki yana kıvrık demir boynuzlar.',
            armorCategory: ArmorCategory.HELMET
        }),
        new Equipment({
            id: 'eq_shop_steel_bracers',
            name: 'Çelik Siperlikli Kolçak',
            slot: EquipmentSlot.GLOVES,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({armor: 4, speed: 1}),
            requiredLevel: 3,
            valueInGold: 45,
            description: 'Ön kolu boydan boya koruyan sağlam çelik lamelli kolçaklar.',
            armorCategory: ArmorCategory.GLOVES
        }),
        new Equipment({
            id: 'eq_shop_riveted_pants',
            name: 'Perçinli Deri Tozluk',
            slot: EquipmentSlot.PANTS,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({armor: 3, speed: 1}),
            requiredLevel: 2,
            valueInGold: 30,
            description: 'Uylukları ve dizleri darbelerden koruyan perçinli sert deri pantolon.',
            armorCategory: ArmorCategory.PANTS
        }),
        new Equipment({
            id: 'eq_shop_plated_greaves',
            name: 'Plakalı Gladyatör Dizliği',
            slot: EquipmentSlot.PANTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 5, maxHealth: 20}),
            requiredLevel: 4,
            valueInGold: 70,
            description: 'Bacakları ölümcül alt vuruşlardan koruyan çelik bacak zırhı.',
            armorCategory: ArmorCategory.PANTS
        }),
        new Equipment({
            id: 'eq_shop_steel_boots',
            name: 'Çelik Burunlu Ağır Çizmeler',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.SIRADAN,
            stats: new Stats({armor: 3, maxHealth: 15}),
            requiredLevel: 3,
            valueInGold: 40,
            description: 'Kumda sağlam basmayı sağlayan çelik tabanlı ağır çizmeler.',
            armorCategory: ArmorCategory.BOOTS
        }),
        new Equipment({
            id: 'eq_shop_spiked_shield',
            name: 'Dikenli Ağır Demir Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 6, blockChancePercent: 14, damage: 2}),
            requiredLevel: 4,
            valueInGold: 80,
            description: 'Ortasında sivri çelik göbek bulunan, darbeleri saptırırken karşı hasar veren kalkan.',
            accessoryCategory: AccessoryCategory.SHIELD
        })
    ]

    const alchemistItems = [...[
        healingSalve.copy({count: 1}),
        mountainHerb.copy({count: 1}),
        ancientScroll.copy({count: 1}),
        new ConsumableItem({
            id: 'con_mountain_dew',
            name: 'Yabani Dağ Kökü',
            type: ItemType.EXTRACT,
            usableCategory: UsableCategory.HERB,
            healAmount: 50,
            valueInGold: 25,
            description: 'Çiğnendiğinde yaraları uyuşturan ve canı tazeleyen acı dağ kökü.',
            count: 1
        })
    ], ...PehlivanOintmentsData.allOintments]


    const npcs = [
        new Npc({
            id: 'npc_vorn',
            name: 'Demirci Vorn',
            role: NpcRole.BLACKSMITH,
            title: 'Körük Ustası',
            greeting: 'Kırlangıç\'a hoş geldin yabancı. Çürük odun parçasıyla arenaya çıkarsan Morvath seni parça pinçik eder. Gel sana adamakıllı bir çelik bakalım.',
            loreSnippet: 'Vorn sürgün edildiğinden beri Kırlangıç\'ın derme çatma demirci ocağını işletiyor.',
            equipmentForSale: blacksmithItems
        }),
        new Npc({
            id: 'npc_mirana',
            name: 'Şifacı Mirana',
            role: NpcRole.ALCHEMIST,
            title: 'Kırlangıç Aktarı',
            greeting: 'Kırlangıç çayının kıyısında yetişen pelin otu kemik kırıklarına iyi gelir. Yaralarını göster savaşçı.',
            loreSnippet: 'Mirana kasabadaki tek hekimdir; arenadan sedyeyle çıkanları hayata bağlar.',
            consumablesForSale: alchemistItems
        }),
        new Npc({
            id: 'npc_scholar_jin_zhen',
            name: 'Bilge Mütercim Jin-Zhen',
            role: NpcRole.SCHOLAR,
            title: 'Doğu Hanlığı Yazıt Uzmanı',
            greeting: 'Selam olsun sana gezgin. Doğu\'nun kadim dövüş sırları bu bataklığın çamuruna gömülü. Görevlerde bulduğun \'Mühürlü Kadim Tomarlar\'ı bana getir; senin için tercüme edip efsanevi yetenek kürelerine dönüştüreyim.',
            loreSnippet: 'Doğu Hanlığı saray kütüphanesinden sürgün edilen Jin-Zhen, ömrünü antik parşömenlerin dilini çözmeye adamıştır.'
        })
    ]

    return new Region({
        id: 'region_kirlangic',
        name: '1. Bölge: Kırlangıç Kasabası',
        recommendedLevel: 1,
        description: 'Sazlıkların ve akarsuların arasına sıkışmış, ahşap çitlerle çevrili sert bir sınır kasabası. Kasabanın tam ortasındaki çukur arena, diyarın en kanlı amatör gladyatör ligine ev sahipliği yapıyor.',
        localFame: 0,
        maxLocalFame: 100,
        npcs: npcs,
        isUnlocked: true
    })
}

// --- BÖLGE 2: TAŞ HİSAR GARNİZONU İÇERİĞİ ---

function createAllStarterGems() {
    return [
        new Gem({
            id: 'gem_raw_ruby',
            name: 'Yontulmamış Yakut',
            type: GemType.YAKUT,
            tier: GemTier.RAW,
            stats: new Stats({damage: 3}),
            description: 'Kor kırmızısı ham taş. Silaha veya zırha kakıldığında vuruş gücünü artırır.',
            valueInGold: 45
        }),
        new Gem({
            id: 'gem_raw_sapphire',
            name: 'Yontulmamış Safir',
            type: GemType.SAFIR,
            tier: GemTier.RAW,
            stats: new Stats({armor: 3}),
            description: 'Buz mavisi derin kristal. Darbe anında savunma direncini pekiştirir.',
            valueInGold: 45
        }),
        new Gem({
            id: 'gem_raw_emerald',
            name: 'Yontulmamış Zümrüt',
            type: GemType.ZUMRUT,
            tier: GemTier.RAW,
            stats: new Stats({maxHealth: 25}),
            description: 'Yaşam özü taşıyan yeşil mücevher. Taşıyıcısının can rezervini besler.',
            valueInGold: 45
        }),
        new Gem({
            id: 'gem_raw_topaz',
            name: 'Yontulmamış Topaz',
            type: GemType.TOPAZ,
            tier: GemTier.RAW,
            stats: new Stats({speed: 2, critChancePercent: 3}),
            description: 'Güneş sarısı kıvrak cevher. Refleksleri ve kritik vuruş sezgisini biler.',
            valueInGold: 50
        }),
        new Gem({
            id: 'gem_raw_amethyst',
            name: 'Yontulmamış Ametist',
            type: GemType.AMETIST,
            tier: GemTier.RAW,
            lifestealPercent: 6,
            description: 'Mor kadife damarlı sihirli taş. Vurulan her darbede rakibin can özünü emer (%6 Can Çalma).',
            valueInGold: 70
        }),
        new Gem({
            id: 'gem_raw_opal',
            name: 'Yontulmamış Opal',
            type: GemType.OPAL,
            tier: GemTier.RAW,
            armorPenetrationPercent: 12,
            description: 'Gökkuşağı ışıltılı beyaz taş. Rakip zırhının çatlaklarını bulup deler (%12 Zırh Delme).',
            valueInGold: 70
        }),
        new Gem({
            id: 'gem_raw_obsidian',
            name: 'Yontulmamış Obsidyen',
            type: GemType.OBSIDYEN,
            tier: GemTier.RAW,
            stunChancePercent: 8,
            description: 'Lav kraterinden çıkarılmış kapkara volkan camı. Sert darbelerde rakibi afallatır (%8 Sersemletme).',
            valueInGold: 80
        })
    ]
}

function createRegion2Weapons() {
    return TashisarBlacksmithWeaponsData.createExoticWeapons()
}

function createRegion2ArmorerEquipment() {
    return TashisarArmorerEquipmentData.createAllArmorerEquipment()
}

function createRegion2TailorEquipment() {
    return TashisarTailorEquipmentData.createAllTailorEquipment()
}

function createRegion2BowyerEquipment() {
    return TashisarBowyerEquipmentData.createAllBowyerEquipment()
}

function createRegion2WandEquipment() {
    return TashisarWandMakerStavesData.createAllWandEquipment()
}

function createRegion2RingAndSealEquipment() {
    return TashisarRingAndSealData.createExoticRingsAndSeals()
}

function createRegion2LeatherworkerEquipment() {
    return TashisarLeatherworkerEquipmentData.createAllLeatherworkerEquipment()
}

function createRegion2Spears() {
    return TashisarBlacksmithSpearsAndDaggersData.createSpears()
}

function createRegion2Daggers() {
    return TashisarBlacksmithSpearsAndDaggersData.createDaggers()
}

function createRegion2AlchemistConsumables() {
    return [...TashisarAlchemistConsumablesData.createAllAlchemistConsumables(), ...PehlivanOintmentsData.allOintments];
}


function createRegion2() {
    const weaponItems = createRegion2Weapons()
    const armorItems = createRegion2ArmorerEquipment()
    const tailorItems = createRegion2TailorEquipment()
    const bowyerItems = createRegion2BowyerEquipment()
    const wandItems = createRegion2WandEquipment()
    const ringAndSealItems = createRegion2RingAndSealEquipment()
    const leatherworkerItems = createRegion2LeatherworkerEquipment()
    const spearItems = createRegion2Spears()
    const daggerItems = createRegion2Daggers()
    const alchemistItems = createRegion2AlchemistConsumables()

    const npcs = [
        new Npc({
            id: 'npc_torvald',
            name: 'Demirci & Silahçı Torvald',
            role: NpcRole.BLACKSMITH,
            title: 'Garnizon Baş Demircisi',
            greeting: 'Kılıç, balta, gürz, kalkan ya da miğfer... Burada dövülen çelik doğrudan düşmanın kalbine işler ve seni korur evlat. Bir donanım seç de hünerini görelim.',
            loreSnippet: 'Torvald yirmi yıldır sınır garnizonunun piyadelerine kılıç, balta, kemik kıran gürzler, kalkan ve ağır miğferler döven emektar bir demircidir.',
            equipmentForSale: weaponItems
        }),
        new Npc({
            id: 'npc_valerius',
            name: 'Kargıcı Valerius',
            role: NpcRole.SPEAR_MASTER,
            title: 'Garnizon Baş Kargıcısı',
            greeting: 'Hasmı yanına yaklaştırmadan göğsünü deşen bir kargı, arenadaki en asil silahtır. Taş Hisar burçlarının ve süvarilerinin 50 kadim mızrak ve kargısı emrine amade yabancı!',
            loreSnippet: 'Valerius, gençliğinde imparatorluk süvari alaylarında ön saflarda kargıcılık yapmış, emekliliğinde ise rüzgarı ve zırhı yaran en dengeli delici mızrakları ve ağır teberleri işleyen emektar bir ustadır.',
            equipmentForSale: spearItems
        }),
        new Npc({
            id: 'npc_corvus',
            name: 'Gölge Silahçısı Corvus',
            role: NpcRole.DAGGER_MASTER,
            title: 'Rıhtım Dehlizleri Bıçakçısı',
            greeting: 'Ağır kılıçlar hantal savaşçılar içindir; ölüm ise sessiz, çevik ve tek bir hançer saplaması kadar ani olmalıdır. Engerek zehriyle bilenmiş 50 ölümcül hançer ve kama emrine amade.',
            loreSnippet: 'Corvus, Taş Hisar\'ın sisli rıhtım dehlizlerinde tezgah açmış, suikastçıların, lonca casuslarının ve çevik gladyatörlerin vazgeçilmezi olan zehirli, kanatıcı ve ustura keskinliğindeki hançerleri döken gizemli bir ustadır.',
            equipmentForSale: daggerItems
        }),
        new Npc({
            id: 'npc_armorer',
            name: 'Zırhçı Ulfric',
            role: NpcRole.ARMORER,
            title: 'Garnizon Baş Zırhçısı',
            greeting: 'Ağır plaka zırhlar ve sarsılmaz savaş çizmeleri olmadan bu dağın fırtınasında ve kanlı arenada hayatta kalamazsın. Çelik tenin, sağlam adımların olsun!',
            loreSnippet: 'Ulfric taş ocaklarından çıkan demirle dev cuirass\'lar, perçinli göğüslükler ve çivili dağ çizmeleri döker.',
            equipmentForSale: armorItems
        }),
        new Npc({
            id: 'npc_tailor',
            name: 'Terzi Leyla',
            role: NpcRole.TAILOR,
            title: 'Hafif Zırh & Kumaş Ustası',
            greeting: 'Ağır çelik taşımak istemeyen çevik savaşçılar ve büyücüler için ipek, deri ve ketenden esnek zırhlar dikerim. Hafiflik candır.',
            loreSnippet: 'Leyla deniz kıyısındaki keten vadisinden topladığı liflerle rüzgara meydan okuyan hafif kıyafetler tasarlar.',
            equipmentForSale: tailorItems
        }),
        new Npc({
            id: 'npc_bowyer',
            name: 'Okçu Boris',
            role: NpcRole.BOWYER,
            title: 'Menzilli Silahçı & Arbaletçi',
            greeting: 'Düşman daha sana yaklaşamadan göğsüne oku saplamak en büyük sanattır. Tekli keskin yaylar, çift ve üçlü salvo atan arbaletler ile kalkan yerine takabileceğin özel temrenli cephaneler tezgahımda hazır!',
            loreSnippet: 'Boris hisar burçlarının baş nişancısı olup tekli, ikiz ve üçlü atış yapan gerilimli kompozit yaylar ile ikincil elde taşınan 50 farklı özel ok cephanesi üretir.',
            equipmentForSale: bowyerItems
        }),
        new Npc({
            id: 'npc_vesper',
            name: 'Asacı Vesper',
            role: NpcRole.WAND_MAKER,
            title: 'Kadim Büyücü & Asa İşçisi',
            greeting: 'Kaba kuvvet bir yere kadar... Sağ eline aldığın bir asanın gücünü sol elindeki kadim büyü kitabı veya mühürlü tomarla tamamlamadıkça gerçek bir büyücü sayılmazsın. Asalar ve ikincil el büyü kitapları tezgahımda hazır!',
            loreSnippet: 'Vesper dağdaki volkanik çatlaklardan asalar yontar, ejderha derisi ve efsunlu parşömenlerle ikincil elde taşınan 50 farklı kadim büyü kitabı ve tomar yazar.',
            equipmentForSale: wandItems
        }),
        new Npc({
            id: 'npc_ringmaker',
            name: 'Yüzükçü Orestes',
            role: NpcRole.RING_MAKER,
            title: 'Kadim Yüzük & Mühür Zanaatkarı',
            greeting: 'Parmağına taktığın bir yüzük canına can katar, göğsüne mühürlediğin bir tılsım ise kaderin akışını değiştirir. Taş Hisar\'ın en kudretli yüzük ve kadim mühürleri burada yabancı.',
            loreSnippet: 'Orestes, hisarın kadim mahzenlerinden ve volkanik kaya damarlarından çıkardığı efsunlu metalleri işleyerek savaşçıların kaderini bağlayan yüzükler ve koruyucu mühürler döker.',
            equipmentForSale: ringAndSealItems
        }),
        new Npc({
            id: 'npc_leatherworker',
            name: 'Saraç Garrick',
            role: NpcRole.LEATHERWORKER,
            title: 'Saraç & Zırhlı Kösele Ustası',
            greeting: 'Gladyatörün bileği çelik kadar sert, adımı da fırtına kadar sağlam olmalı. Dağ bizonu derisi, dövme çelik plakalar ve çivili köselelerle diktiğim zırhlı kolluklar ve bacak zırhları arenada canını kurtarır.',
            loreSnippet: 'Garrick, hisarın alt sokaklarındaki tabakhanesinde dağ bizonlarının derilerini ve çelik plakaları harmanlayarak savaşçıların eklemlerini koruyan en dayanıklı kollukları ve bacak zırhlarını işler.',
            equipmentForSale: leatherworkerItems
        }),
        new Npc({
            id: 'npc_kael',
            name: 'Taş Ustası Kael',
            role: NpcRole.JEWELER,
            title: 'Mücevheratçı & Rün Ustası',
            greeting: 'Getir teçhizatını yabancı! Boş kare yuvalarını açayım, topladığın 3 kırık parçayı tam taşa dönüştüreyim veya taşlarını birleştirip 10. seviyeye kadar güçlendireyim.',
            loreSnippet: 'Kael cevherlerin damarlarını dinleyerek eşyalara yuva açan ve taşları sentezleyen usta bir rün işçisidir.'
        }),
        new Npc({
            id: 'npc_vanya',
            name: 'Simyacı Vanya',
            role: NpcRole.ALCHEMIST,
            title: 'Garnizon Tabibi & Baş Simyager',
            greeting: 'Kaya çatlaklarından sızan kükürt, ayaz çiçekleri ve dağ mineralleriyle damıttığım iksirler, zehir ve alev saçan savaş merhemleri ve şifalı dağ otları... Bir savaşçı bedeni sağlam olmadan bu hisarın dondurucu rüzgarında ayakta kalamaz. Ne arıyorsun?',
            loreSnippet: 'Vanya garnizonun baş hekimi olup; anlık sağaltıcı iksirler, silahlara ve zırhlara sürülen savaş merhemleri ve direnç artıran şifalı otlar hazırlar.',
            consumablesForSale: alchemistItems
        }),
        new Npc({
            id: 'npc_lysandra',
            name: 'Madam Lysandra',
            role: NpcRole.COURTESAN,
            title: 'Kızıl Kadife Köşkü Sahibesi',
            greeting: 'Diyarımızın dondurucu ayazından ve kan kokan savaşlarından kaçıp kadife divanımıza mı sığındın yiğidim? İpek yastıklar, kehribar kadehler ve gizli mabedimiz Taş Hisar\'ın en seçkin simalarını ağırlar.',
            loreSnippet: 'Kızıl Kadife Köşkü; hisarın en kudretli savaşçılarının, asil kumandanlarının ve egzotik dilberlerinin bir araya gelip dertleştiği, sırlar paylaştığı ve unutulmaz tutkular yaşadığı lüks bir sığınaktır.'
        }),
        new Npc({
            id: 'npc_althea',
            name: 'Kızıl Muhafız Althea',
            role: NpcRole.TRAINER,
            title: 'Muhafız Baş Eğitmeni',
            greeting: 'Burası acemilerin şımarıklık yapacağı bir bataklık arenası değil! Kırmızı çizmelerimin önünde diz çökmeden önce kılıç tutmayı gerçekten öğrenmek istiyorsan ter dökeceksin.',
            loreSnippet: 'Kırmızı deriden çizmeleri, mini etek zırhı ve açık kollu mağrur duruşuyla Taş Hisar\'ın en efsanevi kadın dövüş ustası.'
        }),
        new Npc({
            id: 'npc_training_grounds',
            name: 'Büyük Talim Meydanı',
            role: NpcRole.TRAINING_GROUNDS,
            title: 'Hisar Talimgahı & İdman Alanı',
            greeting: 'Kuklalar, kum torbaları ve büyü odak hedefleriyle donatılmış devasa talim alanı. Burada hem çelik savurabilir hem de zihnini büyüye odaklayabilirsin.',
            loreSnippet: 'Garnizon askerlerinin gün boyu kılıç tokuşturduğu ve büyücülerin odaklandığı geniş talim avlusu.'
        }),
        new Npc({
            id: 'npc_mirza_nizar',
            name: 'Mirza Nizar',
            role: NpcRole.AESTHETIC_ATELIER,
            title: 'Güney Zarafet Ustası',
            greeting: 'Hisarın deniz meltemi ipeklerimizi havalandırırken zarafet bir kat daha parıldıyor! Çelik zırhları bir kenara bırak canım, tenin nefes alsın. Silahsız ve estetik gösteriler için aradığın tüm parçalar burada...',
            loreSnippet: 'Taş Hisar\'ın seçkin soylularına ve estetik dövüş meraklılarına hizmet veren Mirza Nizar\'ın lüks atölye şubesi.',
            equipmentForSale: AestheticAtelierEquipmentData.getAllAestheticEquipment()
        })
    ]

    return new Region({
        id: 'region_tashisar',
        name: '2. Bölge: Taş Hisar Garnizon Çarşısı',
        recommendedLevel: 6,
        description: 'Sürekli dinmeyen yağmurların yıkadığı, deniz boyunca uzanan devasa rıhtım ve sur bağlantılarına sahip, kendi kendine yetebilen muazzam bir sınır kalesi. Başkent ile vahşi kıyıların tam kavşağında yer alır; zırhlı muhafızları, çetin esnafları ve kuleleriyle fırtınaya meydan okur.',
        localFame: 10,
        maxLocalFame: 100,
        npcs: npcs,
        isUnlocked: true
    })
}

// Master List of All Quests (Base Contracts + Multi-Stage Rumor Chains + Deep Conditional Quests)
function createAllQuests() {
    return [
        // --- 6 Standart Kasaba Sözleşmesi ---
        new Quest({
            id: 'quest_caravan',
            title: 'Sazlık Kervanı Koruması',
            description: 'Kırlangıç Kasabası\'ndan çıkan tuz kervanına bataklık yolunda eşlik et.',
            type: QuestType.EXPEDITION,
            durationSeconds: 20,
            rewardGold: 25,
            rewardExp: 30,
            rewardFame: 1,
            requiredMinArmor: 2,
            scrollDropChancePercent: 25,
            progressText: '🛡️ Tozlu bataklık patikasında tuz kervanının yanında kılıç elde tetikte ilerliyorsun...',
            completionNarratives: [
                'Kervan dar boğazdan geçerken çalıların arasına pusu kurmuş iki çapulcunun yay gerdiğini fark ettin. Kılıcını çekip tekerleklerin önünü kestiğin anda haydutlar kaçıştı; tüccarlar sana minnettar kaldı.',
                'Bataklık suyunun yükseldiği çamurlu köprü geçişinde dingili kırılan tuz arabasını omzunla kaldırıp kurtardın. Kervan başı minnetle keseni doldurdu.',
                'Sis bastığında öndeki öküzler bataklığa yöneldi; tam zamanında koşup dizginlere asıldın ve kervanın balçığa gömülmesini önledin.',
                'Akşam alacasında kervanın mola yerinde nöbet tuttun; sazlıklardan yaklaşan vahşi bataklık tazılarını meşale ve kılıçla uzaklaştırdın.',
                'Yol boyu kervan muhafızlarıyla nöbetleşe kılıç bilediniz; kasaba kapılarına tek bir tuz çuvalı eksilmeden güvenle varıldı.',
                'Çamurlu patikada kuma saplanan tüccar arabasını kurtarırken sazlıkların arasında eski bir kervan kalıntısına denk geldin.',
                'Kervan yolculuğunun sonunda tüccar loncası temsilcisi seni tebrik ederek fazladan bahşiş uzattı.'
            ]
        }),
        new Quest({
            id: 'quest_fish_patrol',
            title: 'İskele Devriyesi',
            description: 'Gece vakti Kırlangıç iskelesine sızan su korsanlarını püskürt.',
            type: QuestType.EXPEDITION,
            durationSeconds: 35,
            rewardGold: 45,
            rewardExp: 50,
            rewardFame: 2,
            requiredMinHpPercent: 30,
            scrollDropChancePercent: 30,
            progressText: '⚓ İskele boyunda gece ayazında pusudaki su korsanlarını kolluyorsun...',
            completionNarratives: [
                'Gece yarısı ahşap iskelenin altına yanaşan zifiri bir kayığı fark ettin; sessizce yaklaşıp palanı güverteye çaldığında korsanlar suya atlayıp kaçtı.',
                'Balıkçı ağlarının arkasına gizlenmiş hançerli bir yağmacıyla göğüs göğüse çarpıştın; bir tekmeyle onu buz gibi göle fırlattın.',
                'İskele fenerinin kırıldığını görüp meşaleni yaktın; ışığı gören korsan çetesi hazırlıksız yakalanıp sazlıklara dağıldı.',
                'Korsanların bağladığı kaçak kargo sandıklarını ele geçirdin; iskele reisi güvenliği sağladığın için sana altınla teşekkür etti.',
                'Sabaha karşı iskele kazıklarına tırmanan iki hırsızı kalkan darbesiyle püskürttün; balıkçılar sabaha güvenle uyandı.',
                'İskelenin en uç noktasında pusuya yattın; nehir sisi arasında fısıldaşan çete liderini kılıç kabzasıyla bayılttın.',
                'Devriye boyunca korsanların tek bir kayığa bile yanaşmasına izin vermedin; iskele amiri adını kasaba panosuna övgüyle yazdırdı.'
            ]
        }),
        new Quest({
            id: 'quest_blacksmith_ore',
            title: 'Tuz Çölü Cevher Tedariği',
            description: 'Kasaba demircisi Zaven için eski tuz çölü mağaralarından kaliteli demir filizi topla ve getir. Kazma ve fener için 5 altın teçhizat masrafı gerekir.',
            type: QuestType.EXPEDITION,
            durationSeconds: 25,
            rewardGold: 35,
            rewardExp: 40,
            rewardFame: 1,
            requiredSupplyGold: 5,
            scrollDropChancePercent: 25,
            progressText: '⛏️ Tuz çölü mağaralarında fener ışığında kazmayla demir ve tuz filizi çıkarıyorsun...',
            completionNarratives: [
                'Karanlık tuz mağarasının derinliklerinde tavan çökme tehlikesine rağmen kazmanı taşa vurdun ve pırıl pırıl parlayan damara ulaştın.',
                'Yeraltındaki dar bir yarıktan sızan kükürt dumanlarına göğüs gererek en kaliteli kızıl demir yumrularını heybene doldurdun.',
                'Mağara girişinde kazma seslerine üşüşen kaya akreplerini kılıcının tersiyle ezip maden damarını güvenceye aldın.',
                'Tuz kristallerinin arasına sıkışmış eski madenci kemikleri ve yanında paslanmaz bir filiz damarı buldun; demirciye tam istenen cevheri getirdin.',
                'Kazmanın ucu taşa çarptığında mağara yankılandı; çatlayan kaya bloğundan dökülen saf demir tozları demircinin ocağını şenlendirdi.',
                'Yükün ağırlığıyla tuz çölünün kavurucu sıcağında gerisingeri kasabaya yürüdün; Zaven cevherin kalitesini görünce yüzü güldü.',
                'Derin bir mağara kovuğunda maden ararken eski çağlardan kalma işlemeli taş oyuklara rastladın ve cevher torbanı tepeleme doldurdun.'
            ]
        }),
        new Quest({
            id: 'quest_herbalist_search',
            title: 'Pelin Otu ve Yılan Kökü Hasadı',
            description: 'Şifacı kadın için bataklığın zehirli sazlıklarına gir, gladyatör merhemi yapılacak ender kökleri topla. Zehirli buharlara dayanmak için dinç bir bünye (%35+ Can) gerekir.',
            type: QuestType.EXPEDITION,
            durationSeconds: 30,
            rewardGold: 40,
            rewardExp: 45,
            rewardFame: 1,
            requiredMinHpPercent: 35,
            scrollDropChancePercent: 25,
            progressText: '🌿 Zehirli sazlıkların balçığına batarak acı pelin otu ve kökleri topluyorsun...',
            completionNarratives: [
                'Dizlerine kadar balçığa batarak sazlıkların en karanlık kuytusundaki mor çiçekli yılan köklerini kökünden söktün.',
                'Zehirli bataklık buharları genzini yakarken ağzını ıslak bezle kapatıp şifacının aradığı taze pelin otu demetlerini topladın.',
                'Bir sazlık kütüğünün altında çöreklenmiş engerek yılanını kılıcın ucuyla uzaklaştırıp altındaki nadide kökleri aldın.',
                'Suların çekildiği bataklık adacığında güneş gören taze filizleri titizlikle kesip deri torbana yerleştirdin.',
                'Bataklık suyunun yaralarına değdiği yerler sızlasa da dişini sıktın; Mirana\'nın gladyatörleri iyileştirecek merhemleri için bolca ot topladın.',
                'Sazlıkların ortasındaki kurumuş bir söğüt kovuğunda şifalı likenler ve kökler keşfettin.',
                'Kasabaya döndüğünde şifacı Mirana otların tazeliğini koklayıp memnuniyetle ödülünü ve şifalı karışımlarını verdi.'
            ]
        }),
        new Quest({
            id: 'quest_bandit_ambush',
            title: 'Kargı Boğazı Eşkıya Baskını',
            description: 'Tüccar arabalarını boğazda sıkıştıran çapulcuları dağıt, kasabanın ana ticaret yolunu güvenceye al. Ciddi çatışma için en az Seviye 2 ve 6 Hasar gücü gerekir.',
            type: QuestType.EXPEDITION,
            durationSeconds: 40,
            rewardGold: 60,
            rewardExp: 70,
            rewardFame: 2,
            requiredLevel: 2,
            requiredMinDamage: 6,
            requiredMinHpPercent: 45,
            scrollDropChancePercent: 35,
            progressText: '⚔️ Kargı Boğazı kayalıklarında kılıcın kınında hazır, eşkıya artıklarını dağıtıyorsun...',
            completionNarratives: [
                'Boğazın tepesindeki kayalıklardan üzerinize kaya yuvarlamaya çalışan iki haydudu tırmanıp kılıçtan geçirdin; çete panikle dağıldı.',
                'Yolu kesen devrilmiş kütüğün ardında pusuya yatan eşkıya reisini sert bir omuz darbesiyle yere serdin.',
                'Çapulcuların kargı hücumunu kalkanınla karşılayıp aralarına daldın; savurduğun darbeler boğazı temizledi.',
                'Tüccar arabasını köşeye sıkıştırmış üç hırsızı kılıç narasıyla geri püskürttün; yolun güvenliği yeniden sağlandı.',
                'Eşkıyaların mağara sığınağını basıp çaldıkları malları kurtardın; tüccarlar kasaba muhafızlarına kahramanlığını anlattı.',
                'Çarpışma sırasında koluna sıyrık alsan da tek bir eşkıyanın bile kaçmasına izin vermedin.',
                'Kargı Boğazı\'ndan geçen kervanlar artık korkusuzca ilerliyor; kasaba kethüdası adını şerefle andı.'
            ]
        }),
        new Quest({
            id: 'quest_arena_scout',
            title: 'Gizli Talimhane Gözetlemesi',
            description: 'Akşam alacasında han arkasındaki gizli talimhaneye sız; rakip gladyatörlerin sakladığı vuruş tekniklerini gözetle. Gözcü rüşveti için 10 altın gerekir. (Riskli Görev: Başarılı olursa rakip açığı öğrenilir!)',
            type: QuestType.EXPEDITION,
            durationSeconds: 45,
            rewardGold: 75,
            rewardExp: 80,
            rewardFame: 3,
            requiredLevel: 2,
            requiredSupplyGold: 10,
            successChancePercent: 70,
            failureNarrative: '⚠️ Nöbetçilere yakalandın! Tahta çatılardan sazlıklara atlarken dizini burktun ve arkana bakmadan kaçmak zorunda kaldın. İstihbarat elde edilemedi!',
            scrollDropChancePercent: 35,
            progressText: '🔍 Çatı kirişlerinde nefesini tutup gizli talimhanedeki gladyatörlerin gard hareketlerini inceliyorsun...',
            completionNarratives: [
                'Kirişlerin gölgesine gizlenerek rakip şampiyonun sol adımı atarken gardını düşürdüğünü saniye saniye not aldın.',
                'Kum torbasına vuran gladyatörün ağır savuruş sonrası dengesini kaybettiği anı tespit ettin; bu açık arenada hayat kurtaracak.',
                'Nöbetçi fenerini çevirdiği anda tahta paravanın ardına sindin; dövüşçülerin gizli ayak oyunlarını ezberledin.',
                'Talim alanındaki dövüş ustasının öğrencisine fısıldadığı karşı teknikleri duyup zihnine kazıdın.',
                'Karanlıkta tek bir tahta bile gıcırdamadan talimhaneden süzüldün; elinde rakibin tüm sırları var.',
                'Rakip dövüşçünün eski diz yarasını korumak için sağa ağırlık verdiğini gözlemledin.',
                'Gözetleme kusursuz geçti; arenada karşına çıkacak dövüşçünün her hamlesini önceden tahmin edebileceksin.'
            ]
        }),
        new Quest({
            id: 'quest_clay_quarry',
            title: 'Kiremit Ocağı Baskını',
            description: 'Kasabanın kiremit ve çamur ocaklarına inen yaban domuzlarını dağıt, işçilerin ocaklara dönmesini sağla.',
            type: QuestType.EXPEDITION,
            durationSeconds: 25,
            rewardGold: 35,
            rewardExp: 35,
            rewardFame: 1,
            requiredMinDamage: 4,
            scrollDropChancePercent: 25,
            progressText: '🐗 Kiremit ocağındaki çamur çukurlarında yaban domuzlarını kovalayıp işçileri koruyorsun...',
            completionNarratives: [
                'Çamur çukurlarını eşeleyen azılı yaban domuzunu kalkanınla durdurup mızrak darbesiyle ormana kaçırdın.',
                'İşçilerin fırınlarını basan domuz sürüsünü meşale ve gürültüyle çamur bentlerinden uzaklaştırdın.',
                'Kiremit kalıplarını kıran iri bir azılıyı kılıcının tersiyle sersemlettin; ocak ustası sevinçle işe koyuldu.',
                'Balçık havuzunda bata çıka domuzların peşine düştün ve ocak yolunu tamamen temizledin.',
                'Kiremit ocağının etrafına ahşap kazıklar çakarak sürünün tekrar çukurlara girmesini engelledin.',
                'İşçiler korkudan sığındıkları fırın çatılarından inip seni alkışladı; ocak üretimi aksamadan devam etti.',
                'Domuzları ocaktan sürdükten sonra çamur havuzunun dibinde kurumuş eski bir seramik kap buldun.'
            ]
        }),
        new Quest({
            id: 'quest_grain_silo',
            title: 'Tahıl Ambarı Nöbeti',
            description: 'Aç kurgun sürülerinin ve kemirgenlerin ambarlara girmesini engelle, erzak depolarını koru.',
            type: QuestType.EXPEDITION,
            durationSeconds: 25,
            rewardGold: 30,
            rewardExp: 30,
            rewardFame: 1,
            requiredMinArmor: 2,
            scrollDropChancePercent: 20,
            progressText: '🌾 Tahıl ambarının çatısında ve kapısında erzak çuvallarını koruyorsun...',
            completionNarratives: [
                'Gece karanlığında ambarın ahşap havalandırmasından içeri sızmaya çalışan hırsızları kıskıvrak yakaladın.',
                'Tahıl çuvallarını kemiren yaban sıçanı yuvalarını meşale dumanıyla ambardan dışarı püskürttün.',
                'Şiddetli rüzgarda ambarın gevşeyen çatı kiremitlerini emniyete alıp un çuvallarının ıslanmasını önledin.',
                'Ambar arkasındaki erzak arabalarına göz diken serserileri kılıcını kınından çıkararak kaçırdın.',
                'Sabaha kadar buğday silolarının çevresinde volta atıp nöbet tuttun; tek bir arpa tanesi bile ziyan olmadı.',
                'Ambar görevlisi sayım yaptığında erzakların tam olduğunu görünce sana ekstra buğday ekmeği ve altın verdi.',
                'Eski tahta kirişlerin altında ambar inşaatından kalma mühürlü bir kasa oyuğu fark ettin.'
            ]
        }),
        new Quest({
            id: 'quest_watermill_repair',
            title: 'Su Değirmeni Bendi Temizliği',
            description: 'Sazlık çayının getirdiği balçık ve kütükleri değirmen çarkından temizle, un üretimini kurtar.',
            type: QuestType.EXPEDITION,
            durationSeconds: 30,
            rewardGold: 40,
            rewardExp: 45,
            rewardFame: 1,
            requiredMinHpPercent: 30,
            scrollDropChancePercent: 25,
            progressText: '⚙️ Su değirmeninin dev çarkına dolanan balçık ve kütükleri soğuk suda söküp temizliyorsun...',
            completionNarratives: [
                'Buz gibi değirmen bendine girip çarka dolanmış devasa söğüt kütüğünü baltayla parçalayarak çıkardın.',
                'Su bendini tıkayan taş ve balçık yığınını kürekle açtığında değirmen çarkı gıcırdayarak yeniden dönmeye başladı.',
                'Hızlı akıntıda dengeni kaybetmeden çark kanatlarına sıkışmış çürük tahtaları tek tek ayıkladın.',
                'Bent kapaklarını tıkayan dalları temizlerken su altında sıkışmış eski bir balıkçı sepeti kurtardın.',
                'Değirmenci usta çarkın hızla dönmesini ve un teknelerinin dolmasını izlerken sırtını sıvazladı.',
                'Akıntının getirdiği çamurların arasında nehrin derinliklerinden sürüklenmiş bir parşömen kovanı çarptı.',
                'Islak elbiselerini değirmenin sıcak fırınında kuruturken vaat edilen altınları heybene koydun.'
            ]
        }),
        new Quest({
            id: 'quest_bridge_toll',
            title: 'Kırık Köprü Geçit Güvenliği',
            description: 'Tüccarlardan haraç kesmeye çalışan nehir serserilerini köprü başından kov.',
            type: QuestType.EXPEDITION,
            durationSeconds: 35,
            rewardGold: 50,
            rewardExp: 55,
            rewardFame: 1,
            requiredMinArmor: 3,
            requiredMinDamage: 5,
            scrollDropChancePercent: 30,
            progressText: '🌉 Kırık taş köprünün başında nöbet tutup haraç kesen nehir serserilerini püskürtüyorsun...',
            completionNarratives: [
                'Köprü girişine barikat kurup geçenlerden zorla para isteyen üç serseriyi kılıcının kabzasıyla dağıttın.',
                'Köprünün kırık kemerinden nehre doğru hamle yapan korsan başını kalkan darbesiyle suya yuvarladın.',
                'Tüccar arabasını rehin alan çapulcularla müzakere etmeyip doğrudan hücum ettin ve köprüyü açtın.',
                'Köprünün ahşap korkuluklarına gizlenmiş tuzak iplerini keserek arabaların güvenle geçmesini sağladın.',
                'Geçit güvenliğini sağladıktan sonra köprüden geçen her tüccar sana şükranla selam durdu.',
                'Serserilerin kaçarken köprü ayağındaki oyukta unuttuğu haraç torbasını bulup kasabaya teslim ettin.',
                'Köprü başında gün batımına kadar nöbet tuttun; kasabanın batı bağlantısı yeniden güvende.'
            ]
        }),
        new Quest({
            id: 'quest_swamp_lanterns',
            title: 'Bataklık Fenerleri İkmali',
            description: 'Sis bastığında kervanların yoldan çıkmaması için sazlık direklerindeki yağ fenerlerini yak.',
            type: QuestType.EXPEDITION,
            durationSeconds: 20,
            rewardGold: 28,
            rewardExp: 32,
            rewardFame: 1,
            scrollDropChancePercent: 20,
            progressText: '🔥 Sazlık direklerine tırmanarak sis fenerlerini balık yağıyla doldurup ateşliyorsun...',
            completionNarratives: [
                'Bataklık sisinin koyulaştığı alacakaranlıkta direklere tırmanıp her bir feneri parlak alevle tutuşturdun.',
                'Yağı tükenmiş fener haznesini balık yağıyla doldurup çakmaktaşıyla çaktın; fener sarı bir ışık hüzmesi saçtı.',
                'Fener direğinin dibinde pusuya yatan dev sazlık yengecini kılıcınla savuşturup ışığı yaktın.',
                'Sis içinde yolunu kaybetmiş yaşlı bir postacıyı yaktığın fenerin ışığıyla ana yola yönlendirdin.',
                'Rüzgarın söndürdüğü son feneri de siper olarak harladın; bataklık yolu fener zinciriyle parıldadı.',
                'Fener direklerinden birinin oyuğunda eski gezginlerin bıraktığı küçük bir hatıra kesesi buldun.',
                'Kervancılar uzaktan fenerlerin yandığını görünce düdük çalarak teşekkür ettiler.'
            ]
        }),
        new Quest({
            id: 'quest_timber_escort',
            title: 'Kereste Salı Muhafızlığı',
            description: 'Dağdan nehir boyunca kasaba marangozuna akıtılan kereste sallarını nehir korsanlarına karşı kolla.',
            type: QuestType.EXPEDITION,
            durationSeconds: 35,
            rewardGold: 48,
            rewardExp: 52,
            rewardFame: 1,
            requiredMinDamage: 6,
            scrollDropChancePercent: 30,
            progressText: '🪓 Dağdan akıtılan ağır kütük ve kereste sallarına nehir boyu muhafızlık ediyorsun...',
            completionNarratives: [
                'Hızlı akıntıda kayalara çarpmak üzere olan baş kütüğü uzun sırıkla yönlendirip salı parçalanmaktan son anda kurtardın.',
                'Kıyıdaki sazlıklardan sallara atlamaya çalışan iki nehir korsanını palanın tersiyle suya düşürdün; marangoz çırakları arkandan alkış tuttu.',
                'Akıntının durgunlaştığı sığlıkta sıkışan keresteleri çamurlu suya girerek kollarınla tek tek çözdün ve akışı sağladın.',
                'Nehir boyundaki sarp virajda salın halatları gerilip koptu; hızla ileri atılıp yedek halatı kıyıdaki yaşlı çınara dolayarak yükü sabitledin.',
                'Kerestelerin marangoz iskelesine yanaşmasıyla kasaba ustası odunların sağlamlığını görünce eline sıcak bir çorba ve vaat edilen altınları verdi.',
                'Kereste kütüklerinin arasına sıkışmış eski bir sazlık sandığı fark ettin; içinden çamura bulanmış antik bir parşömen kılıfı çıktı!',
                'Gün batımında nehir sisi inerken son salı da kıyıya bağladın; yorgunluktan kolların sızlasa da kasabanın inşaat keresteleri sağ salim ulaştı.'
            ]
        }),
        new Quest({
            id: 'quest_arena_sand_cart',
            title: 'Kızıl Kum Arabası Sevkiyatı',
            description: 'Arena çukurunun kan gölüne dönen zeminini tazelemek için kırmızı çöl kumunu çukura taşı.',
            type: QuestType.EXPEDITION,
            durationSeconds: 25,
            rewardGold: 32,
            rewardExp: 36,
            rewardFame: 1,
            scrollDropChancePercent: 20,
            progressText: '🏜️ Arena çukurunun kanlı zeminine dökülecek kızıl çöl kumunu el arabasıyla taşıyorsun...',
            completionNarratives: [
                'Kızıl çöl tepelerinden küreklediğin taze kumu arabaya doldurup kasaba arenasına kan kokusunu bastırmak için serptin.',
                'Kum arabasının tekerleği çamura battığında kas gücünle tek başına arabayı kaldırıp arenanın kapısına ulaştırdın.',
                'Arena zeminindeki kurumuş kan lekelerini kalın kızıl kum tabakasıyla örttün; dövüş alanı sıradaki gladyatörlere hazırlandı.',
                'Kum ocağında kuma gömülmüş zehirli akrepleri kılıcınla temizleyip işçilerin güvenle kum kazmasını sağladın.',
                'Lanista kumun kalitesini kontrol edip başıyla onayladı: \'Bu kum dövüşçülerin ayaklarını kaydırmaz.\'',
                'Kızıl kum yığınının içinde eski bir gladyatörün düşürdüğü pirinç sikkeyi buldun.',
                'Arenanın taze kumu akşam güneşinde parıldarken seyirciler yerlerini almaya başladı.'
            ]
        }),
        new Quest({
            id: 'quest_tanner_hide',
            title: 'Tabakhane Koku Devriyesi',
            description: 'Kasaba dışındaki tabakhanelere leş için üşüşen sırtlanları ve çakalları kılıç zoruyla püskürt.',
            type: QuestType.EXPEDITION,
            durationSeconds: 30,
            rewardGold: 44,
            rewardExp: 48,
            rewardFame: 1,
            requiredMinDamage: 5,
            requiredMinHpPercent: 35,
            scrollDropChancePercent: 25,
            progressText: '🐺 Tabakhanelerin dericilik havuzlarına dadanan leş çakallarını kılıçla kovalıyorsun...',
            completionNarratives: [
                'Deri kurutma askılarına yaklaşan iki aç sırtlanı kılıcının şakırtısıyla tabakhanenin sınırından ormana sürdün.',
                'Tabak havuzunun kokusuna gelen yaban çakallarını kalkanını birbirine vurarak çıkardığın sesle korkutup kaçırdın.',
                'Kıymetli manda derilerini parçalamaya çalışan azılı bir sırtlanı tek bir hamleyle yere serdin.',
                'Tabakhanenin arka çitlerindeki yırtıkları onarıp vahşi hayvanların içeri sızmasını önledin.',
                'Saraç ustası derilerinin kurtulduğunu görünce sana sağlam bir deri kemer parçası ve altın verdi.',
                'Çakalların inine kadar iz sürüp tabakhane çevresini tamamen tekinsiz yaratıklardan temizledin.',
                'Ağır kokuya rağmen nöbetini terk etmedin; tabakhane loncası sana teşekkür etti.'
            ]
        }),
        new Quest({
            id: 'quest_ferry_guard',
            title: 'Bulanık Nehir Salcısı',
            description: 'Köylüleri ve tüccarları karşı kıyıya geçiren yaşlı salcının yanında durup güvenliği sağla.',
            type: QuestType.EXPEDITION,
            durationSeconds: 25,
            rewardGold: 36,
            rewardExp: 40,
            rewardFame: 1,
            scrollDropChancePercent: 20,
            progressText: '🚣 Nehir salında yolcuların ve tüccarların güvenliğini kılıç omzunda sağlıyorsun...',
            completionNarratives: [
                'Sal karşı kıyıya geçerken sudan tırmanmaya yeltenen nehir korsanını sırık darbesiyle akıntıya savurdun.',
                'Hızlı akıntıda salın dengesini bozan dev nehir balığını kargıyla uzaklaştırıp yolcuları sakinleştirdin.',
                'Yaşlı salcının elinden kayan çekme halatını havada yakalayıp salı güvenle iskeleye yanaştırdın.',
                'Salda panik çıkaran sarhoş bir haydutu kılıç kabzasıyla etkisiz hale getirip yolcuların rahat nefes almasını sağladın.',
                'Karşı kıyıya varıldığında kadınlar ve tüccarlar sana dua edip bahşiş uzattı.',
                'Salın altındaki yosunları temizlerken nehir yatağına sıkışmış eski bir bakır sandık gördün.',
                'Günün son seferinde gün batımının kızıllaştırdığı nehirde salı bağlayıp ücretini aldın.'
            ]
        }),
        new Quest({
            id: 'quest_drunken_brawl',
            title: 'Han Kapısı Asayişi',
            description: 'Arenadaki bahislerini kaybedip hana saldıran öfkeli gladyatör artıklarını kapıdan uzaklaştır.',
            type: QuestType.EXPEDITION,
            durationSeconds: 30,
            rewardGold: 46,
            rewardExp: 50,
            rewardFame: 2,
            requiredMinArmor: 4,
            scrollDropChancePercent: 30,
            progressText: '🍻 Han kapısında sarhoş gladyatörlerin taşkınlıklarını sert yumruklarla yatıştırıyorsun...',
            completionNarratives: [
                'Han kapısını kırmaya çalışan iri yarı bir gladyatör artığını sert bir kafa darbesiyle basamaklardan aşağı yuvarladın.',
                'Kırık testiyle hancıya saldıran sarhoş dövüşçünün bileğini büküp silahını elinden aldın.',
                'Hanın önünde toplanan öfkeli kalabalığa kılıcını toprağa saplayarak gözdağı verdin; grup yavaşça dağıldı.',
                'İçerideki müşterilerin canını korumak için kapı eşiğinde kale gibi durdun; tek bir taşkın içeri giremedi.',
                'Hancı minnetle sana en iyi şarabından ikram edip cömert bir altın kesesi uzattı.',
                'Kavgada yere düşen bir gladyatörün kemerinden fırlayan mühürlü bir Doğu parşömeni dikkatini çekti.',
                'Gece yarısı hanın önü sessizliğe büründü; kasaba sakinleri huzurla uyudu.'
            ]
        }),
        new Quest({
            id: 'quest_blacksmith_bellows',
            title: 'Körük Taşıma & Maden Kömürü',
            description: 'Demirci Vorn\'un ocağı için bataklık turbası ve kömür çuvallarını fırına ulaştır.',
            type: QuestType.EXPEDITION,
            durationSeconds: 20,
            rewardGold: 30,
            rewardExp: 34,
            rewardFame: 1,
            scrollDropChancePercent: 20,
            progressText: '🔥 Demirci ocağı için kömür ve ağır körükleri sırtlayıp atölyeye taşıyorsun...',
            completionNarratives: [
                'Ağır kömür çuvallarını sırtlayıp demirci ocağının alev alev yanan fırınına zamanında yetiştirdin.',
                'Bataklık turbasının kokusuna alışarak fırının korunu iki katına çıkaracak en kuru kömürleri seçtin.',
                'Demirci Vorn körüğü çalıştırmaya başladığında fırından fışkıran kıvılcımlar ocağı aydınlattı.',
                'Taşıma sırasında çuvalı çalmaya kalkan sokak çocuklarını sert bir bakışla uzaklaştırdın.',
                'Vorn\'un kızgın demiri dövmesi için gerekli ısıyı sağladın; usta sana minnettarlıkla altınını verdi.',
                'Kömür deposunun dibinde eski bir cüruf tabakasının altına gizlenmiş bir madenci muskası buldun.',
                'Ocağın sıcaklığında ter döktükten sonra dışarıdaki serin havada derin bir nefes aldın.'
            ]
        }),
        new Quest({
            id: 'quest_lost_cattle',
            title: 'Sazlıkta Kayıp Sığır Arayışı',
            description: 'Bataklığın batak kumlarına doğru kaçan kasaba kasabının tosununu iz sürerek bul ve getir.',
            type: QuestType.EXPEDITION,
            durationSeconds: 30,
            rewardGold: 42,
            rewardExp: 46,
            rewardFame: 1,
            requiredMinHpPercent: 30,
            scrollDropChancePercent: 25,
            progressText: '🐂 Sazlık balçıklarında kayıp sığırın derin toynak izlerini sürüyorsun...',
            completionNarratives: [
                'Batak kumuna göğsüne kadar batmış huysuz tosunu boynuzlarına halat bağlayarak çekip çıkardın.',
                'Sazlıkların arasında tosunu çevrelemiş kurt sürüsünü kılıcını savurarak kaçırdın.',
                'İzleri takip ederken kurumuş dere yatağında otlayan sığırı bulup ipinden sakince kasabaya yönlendirdin.',
                'Bataklığın derinliklerinde kaybolan hayvanı böğürtü sesini dinleyerek sislerin arasından buldun.',
                'Kasap tosunun tek bir sıyrık almadan döndüğünü görünce gözleri parladı ve sana bol et ile altın verdi.',
                'Sığırı ararken sazlık adacığında eski bir kervan sandığına denk geldin.',
                'Kasabaya tosunun ardında girdiğinde mahalleli seni tezahüratla karşıladı.'
            ]
        }),
        new Quest({
            id: 'quest_reed_cutters',
            title: 'Hasır Örücüleri Koruması',
            description: 'Evlerin damlarını örmek için derin sazlıklara giren hasırcıları bataklık yılanlarından koru.',
            type: QuestType.EXPEDITION,
            durationSeconds: 25,
            rewardGold: 34,
            rewardExp: 38,
            rewardFame: 1,
            scrollDropChancePercent: 20,
            progressText: '🌾 Derin sazlıklarda hasır biçen köylüleri bataklık tehlikelerine karşı koruyorsun...',
            completionNarratives: [
                'Hasır biçen yaşlı bir köylüye arkadan yaklaşan iri su yılanını palanın ucuyla ikiye böldün.',
                'Sazlıkların içinde kuluçkaya yatmış dev bataklık leyleğinin köylüleri gagalamasını kalkanınla engelledin.',
                'Köylülerin biçtiği taze hasır destelerini arabalara yüklemelerine yardım ederek işi hızlandırdın.',
                'Bataklık gazının sızdığı tehlikeli bölgeyi fark edip hasırcıları güvenli adacığa yönlendirdin.',
                'Hasır örücüleri evlerine kucak dolusu hasırla dönerken seni kasabanın en güvenilir koruyucusu ilan ettiler.',
                'Sazların dibinde çamura yarı gömülü antik bir bronz ayna buldun.',
                'Gün boyu köylülerin başında nöbet bekledin; tek bir köylünün bile canı yanmadı.'
            ]
        }),
        new Quest({
            id: 'quest_watchtower_signal',
            title: 'Gözetleme Kulesi Meşalesi',
            description: 'Kasabanın güney tepesindeki ahşap kuleye çık, yaklaşan yabancı kervanları bildiren işaret ateşini yak.',
            type: QuestType.EXPEDITION,
            durationSeconds: 30,
            rewardGold: 42,
            rewardExp: 44,
            rewardFame: 1,
            scrollDropChancePercent: 25,
            progressText: '🔥 Rüzgarlı gözetleme kulesinde ufku gözleyip işaret meşalesini harlıyorsun...',
            completionNarratives: [
                'Kuleye tırmanıp fırtınalı rüzgara karşı kuru meşe odunlarını çakmaktaşıyla tutuşturdun; işaret ateşi göğe yükseldi.',
                'Ufukta toz kaldıran bilinmeyen bir süvari birliğini erkenden fark edip işaret dumanıyla kasabaya haber verdin.',
                'Kulenin çürüyen merdiven basamağını tamir edip nöbetçilerin kuleye güvenle çıkmasını sağladın.',
                'Gece karanlığında yanan kule meşalesi sayesinde uzaktaki dost kervan bataklığa düşmeden kasaba kapısını buldu.',
                'Kule komutanı gözlerinin keskinliğini övdü ve nöbet defterine adını şerefle yazdı.',
                'Kulenin kirişinde eski bir muhafızın gizlediği antika bir kılıç kını buldun.',
                'Sabahın ilk ışıklarına kadar kulede nöbet tuttun; kasaba senin sayende güvende uyudu.'
            ]
        }),
        new Quest({
            id: 'quest_apothecary_leeches',
            title: 'Sülük Havuzu Hasadı',
            description: 'Şifacı Mirana\'nın yaralı savaşçıları kanatmak için kullandığı tıbbi sülükleri bataklık gölünden topla.',
            type: QuestType.EXPEDITION,
            durationSeconds: 20,
            rewardGold: 30,
            rewardExp: 32,
            rewardFame: 1,
            requiredMinHpPercent: 25,
            scrollDropChancePercent: 20,
            progressText: '🩸 Balçıklı gölette şifacının cerrahi işlemleri için tıbbi sülükleri topluyorsun...',
            completionNarratives: [
                'Bacaklarına yapışan iri tıbbi sülükleri tuzla ayıklayıp Mirana\'nın killi çömleklerine doldurdun.',
                'Sülük havuzunun durgun suyunda dikkatle bekleyerek en dolgun ve canlı sülükleri seçtin.',
                'Bataklık göletinde yuvalanmış dikenli su kaplumbağalarını kılıcınla uzaklaştırıp hasadı tamamladın.',
                'Çömlekleri tepeleme doldurup suların dökülmemesi için bez kapakları sıkıca bağladın.',
                'Mirana sülüklerin kalitesini görünce arenada yaralanan dövüşçülerin kanını temizlemek için derhal işe koyuldu.',
                'Göletin dibinde balçığa saplanmış antik bir seramik ilaç şişesi buldun.',
                'Zorlu ve nahoş bir işi başarıyla bitirip kasabaya alnının akıyla döndün.'
            ]
        }),
        new Quest({
            id: 'quest_bounty_thief',
            title: 'Pazar Yeri Yankesicisi',
            description: 'Seyyar tüccarların heybelerinden altın çalan çevik hırsızı dar sokaklarda kıstır.',
            type: QuestType.EXPEDITION,
            durationSeconds: 30,
            rewardGold: 50,
            rewardExp: 55,
            rewardFame: 2,
            requiredLevel: 2,
            requiredMinDamage: 6,
            scrollDropChancePercent: 30,
            progressText: '🏃 Pazar yeri çatılarında ve dar sokaklarda çevik yankesicinin peşinden koşuyorsun...',
            completionNarratives: [
                'Kiremit çatıların üzerinden atlayan hırsızı dar bir çıkmaz sokakta kalkan darbesiyle kıstırıp yere serdin.',
                'Seyyar tezgahları devirerek kaçmaya çalışan yankesicinin önüne atlayıp çaldığı altın kesesini elinden aldın.',
                'Hırsızın gizlendiği samanlığı kuşatarak kaçış yolunu kestin ve onu kasaba muhafızlarına teslim ettin.',
                'Tüccarların heybelerini tek tek sahiplerine dağıttığında pazar esnafı seni alkışlarla karşıladı.',
                'Yankesicinin cebinden çıkan çalıntı bir Doğu hançeri adaletin yerini bulduğunu gösterdi.',
                'Pazar çerçibaşısı adını onurlandırarak dükkanındaki en kaliteli erzaklardan hediye etti.',
                'Hırsızın yakalanmasıyla pazar yerindeki güven yeniden sağlandı.'
            ]
        }),
        new Quest({
            id: 'quest_granary_patrol',
            title: 'Eski Siper Hendekleri Keşfi',
            description: 'Kasaba çitlerinin dışındaki terkedilmiş savunma hendeklerinde pusu kuran çapulcuları yokla.',
            type: QuestType.EXPEDITION,
            durationSeconds: 35,
            rewardGold: 54,
            rewardExp: 60,
            rewardFame: 1,
            requiredMinArmor: 4,
            scrollDropChancePercent: 30,
            progressText: '🛡️ Kasaba hendeklerindeki çamurlu siperlerde pusu noktalarını kolaçan ediyorsun...',
            completionNarratives: [
                'Eski siper hendeklerine sığınmış dört çapulcunun kamp ateşini basıp hepsini teslim aldın.',
                'Çamurlu hendekteki tahta kazıkların arasına yerleştirilmiş gizli yay tuzaklarını kılıcınla imha ettin.',
                'Hendekten kasaba çitlerine tünel kazmaya çalışan haydutları gürz darbesiyle tünelden dışarı püskürttün.',
                'Siper boyunca devriye atarak kasabanın savunma hattındaki zafiyetleri tespit edip güçlendirdin.',
                'Muhafız yüzbaşısı hendeklerin temizlendiğini öğrenince sana resmi garnizon teşekkürü sundu.',
                'Hendek çamurlarının arasına gömülmüş eski bir askeri mühür buldun.',
                'Kasaba çitlerinin dışı artık temiz ve güvenli; gece nöbetçileri rahat bir nefes aldı.'
            ]
        }),
        new Quest({
            id: 'quest_salt_merchant',
            title: 'Tuz Tüccarı Pazarlığı',
            description: 'Kasabaya tuz getiren çöl tacirinin arabasına eşlik et, haraç kesen yerel milisleri bastır.',
            type: QuestType.EXPEDITION,
            durationSeconds: 35,
            rewardGold: 58,
            rewardExp: 64,
            rewardFame: 1,
            requiredMinDamage: 6,
            scrollDropChancePercent: 30,
            progressText: '💰 Çöl tuzcusunun ağır arabasının yanında haraççıları bastırarak ilerliyorsun...',
            completionNarratives: [
                'Tuz arabasının önünü kesip haksız haraç isteyen yozlaşmış milis çavuşunu kılıç kabzanla geri püskürttün.',
                'Tuz çuvallarının ıslanmaması için deri tenteleri fırtınada sağlamlaştırıp kervanı kasabaya soktun.',
                'Tüccarın altınlarını gasp etmeye kalkan iki haydutu arabanın dingili dibinde etkisiz hale getirdin.',
                'Pazarlık masasında tüccarın yanında dimdik durarak kasaba kasabına adil fiyattan tuz satılmasını sağladın.',
                'Çöl taciri minnettarlıkla sana saf beyaz kaya tuzu kalıbı ve altın kesesi verdi.',
                'Tuz çuvallarının arasında Doğu kervanlarından kalma mühürlü bir parşömen kılıfı fark ettin.',
                'Tuz ticaretinin tamamlanmasıyla kasabanın kışlık erzak salamurası güvenceye alındı.'
            ]
        }),
        new Quest({
            id: 'quest_sunken_shrine',
            title: 'Sazlık Mabedi Kazısı',
            description: 'Bataklığın ortasındaki antik tapınak kalıntılarını su çekildiğinde kaz; Doğu Hanlığı\'ndan kalma \'Kızıl Ejder\' tomarını gün ışığına çıkar.',
            type: QuestType.EXPEDITION,
            durationSeconds: 35,
            rewardGold: 65,
            rewardExp: 75,
            rewardFame: 2,
            requiredLevel: 1,
            requiredMinHpPercent: 30,
            rewardScrollId: 'item_sealed_scroll_dragon',
            scrollDropChancePercent: 100,
            progressText: '🐉 Sazlık mabedinin su altındaki mermer basamaklarını temizleyip mühürlü sandığı arıyorsun...',
            completionNarratives: [
                'Suların çekildiği tapınak sunağının altındaki taş bloğu manivela ile kaldırdın; kırmızı balmumuyla mühürlenmiş kızıl ejder ideogramlı tomar parıldadı!',
                'Bataklık sarmaşıklarının sardığı sunak oyuğunda ejderha oymalı bronz bir tüp buldun; mühürlü papirüs bozulmadan duruyordu.',
                'Tapınak kalıntılarını koruyan iki yabani bataklık kertenkelesini kılıcınla savuşturup kutsal sandığa ulaştın.',
                'Mermer sütunun çatlağına gizlenmiş su geçirmez balmumu sandığını gün ışığına çıkardın.',
                'Kızıl Ejder mührünü eline aldığında teninde hafif bir sıcaklık hissettin; Bilge Jin-Zhen bunu kesinlikle görmeli!',
                'Tapınak zeminindeki kadim doğu hiyerogliflerini inceleyerek gizli bölmeyi açtın ve tomarı heybene yerleştirdin.',
                'Kazı tamamlandığında tapınak suları yeniden yükseldi; kadim sırrı tam zamanında kurtardın.'
            ]
        }),
        new Quest({
            id: 'quest_silk_caravan_wreck',
            title: 'Doğu Kervanı Enkazı',
            description: 'Yıllar önce tuz çölü kenarında batmış bir doğu ipek kervanının kuma gömülü sandıklarını çıkar. \'Ak Turna\' mührünü kurtar.',
            type: QuestType.EXPEDITION,
            durationSeconds: 35,
            rewardGold: 60,
            rewardExp: 70,
            rewardFame: 2,
            requiredLevel: 1,
            requiredMinArmor: 2,
            rewardScrollId: 'item_sealed_scroll_crane',
            scrollDropChancePercent: 100,
            progressText: '🕊️ Tuz çölünün fırtınayla açığa çıkardığı deve iskeletleri ve batık sandıkları kazıyorsun...',
            completionNarratives: [
                'Kum fırtınasının ortaya çıkardığı kervan arabasının ahşap gövdesini kazıp ipek kılıflı \'Ak Turna\' tomarına ulaştın!',
                'Kuma gömülü çürümüş sandığın demir kilitlerini kırarak beyaz balmumu mühürlü ipek tomarı kurtardın.',
                'Kum yılanlarının yuvalandığı deve iskeletinin yanında pirinç bir doğu silindiri parıldadı.',
                'Tuz katmanlarının koruduğu enkazdan çıkan eşsiz parşömen hiç nem almamıştı; turna figürü adeta uçacak gibiydi.',
                'Kervan enkazındaki diğer kırık eşyaları ayıklayıp mühürlü yazıtı emniyetle heybene sardın.',
                'Ak Turna tomarını tuttuğunda rüzgarın fısıltısını duyar gibi oldun; Jin-Zhen\'in bunu çözmesi için sabırsızlanıyorsun.',
                'Çöl rüzgarı yeniden kum tepelerini savururken kutsal emaneti başarıyla kasabaya taşıdın.'
            ]
        }),
        new Quest({
            id: 'quest_hermit_cave',
            title: 'Bataklık Münzevisinin İni',
            description: 'Kayalık kanyondaki münzevi bir doğu ustasının terk edilmiş mağarasını araştır. \'Fırtına Rüzgarı\' mührünü bul.',
            type: QuestType.EXPEDITION,
            durationSeconds: 40,
            rewardGold: 70,
            rewardExp: 80,
            rewardFame: 2,
            requiredLevel: 2,
            requiredMinDamage: 5,
            rewardScrollId: 'item_sealed_scroll_storm',
            scrollDropChancePercent: 100,
            progressText: '🌪️ Uçurum kenarındaki rüzgarlı münzevi mağarasında kadim fırtına yazıtlarını arıyorsun...',
            completionNarratives: [
                'Mağaranın içindeki taş sedirin altında yeşil rünlerle örülü \'Fırtına Rüzgarı\' mühürlü parşömen kılıfını buldun!',
                'Münzevinin meditasyon yaptığı kaya kovuğunda rüzgarın uğultusuyla titreyen yeşil mühürlü tomarı çıkardın.',
                'Mağara girişini kapatan kuru çalıları temizleyip duvara kazınmış seri kılıç darbeleri krokisini ve tomarı aldın.',
                'Eski bir tütsülüğün külleri arasına saklanmış kilitli papirüsü zarar vermeden çözdün.',
                'Fırtına Kesisi sırlarını barındıran bu tomar, dövüşlerinde seri rüzgar darbeleri savurmanı sağlayacak!',
                'Mağaradaki serin rüzgar cildini yalarken bilge ustaya saygıyla eğilip emaneti aldın.',
                'Kanyondan kasabaya inerken elindeki tomarın hafifliği adımlarına bile hız kattı.'
            ]
        }),
        new Quest({
            id: 'quest_smuggler_cache',
            title: 'Su Korsanları Gizli Zulası',
            description: 'Sazlık adasındaki korsan ini bas; doğu kütüphanelerinden çalınmış \'Gece Gölgesi\' tomarını ele geçir.',
            type: QuestType.EXPEDITION,
            durationSeconds: 40,
            rewardGold: 75,
            rewardExp: 85,
            rewardFame: 2,
            requiredLevel: 2,
            requiredMinDamage: 6,
            requiredMinHpPercent: 40,
            rewardScrollId: 'item_sealed_scroll_night',
            scrollDropChancePercent: 100,
            progressText: '🌑 Korsanların sazlık adasındaki gizli zulasına sızıp kilitli sandıkları açıyorsun...',
            completionNarratives: [
                'Korsanların zula sandığının çift tabanını hançerle kanırtarak kömür karası mühürlü \'Gece Gölgesi\' tomarını ele geçirdin!',
                'Nöbetçi korsanları uyurken atlatıp kilitli kadife kılıf içindeki gölge adımı el yazmasını aldın.',
                'Sazlık mağarasında meşale aydınlatmasında siyah balmumunu fark ettin; suikastçıların kadim adımları burada gizli!',
                'Korsan reisinin masasında ganimet olarak bekleyen mühürlü Doğu parşömenini kimseye fark ettirmeden çantana koydun.',
                'Tomarın üzerindeki gölge mührü karanlıkta bile esrarengiz bir parıltı yayıyordu.',
                'Korsan ininden hızla uzaklaşıp kayığınla sislerin arasına karıştın.',
                'Kasabaya döndüğünde bu yazıtın seni arenada arkadan vurulmaktan koruyacağını anladın.'
            ]
        }),
        new Quest({
            id: 'quest_ancient_barrow',
            title: 'Kadim Höyük Mezar Keşfi',
            description: 'Bataklığın doğu sınırındaki taş höyükte yatan kadim savaşçının mezar odasını aç. \'Yırtıcı Kaplan\' mührünü çıkar.',
            type: QuestType.EXPEDITION,
            durationSeconds: 45,
            rewardGold: 80,
            rewardExp: 90,
            rewardFame: 3,
            requiredLevel: 2,
            requiredMinArmor: 4,
            requiredMinDamage: 6,
            rewardScrollId: 'item_sealed_scroll_tiger',
            scrollDropChancePercent: 100,
            progressText: '🐅 Kadim taş höyüğün mezar kapısını aralayıp pençe mühürlü papirüsü arıyorsun...',
            completionNarratives: [
                'Ağır mezar taşını araladığında zırhlı iskeletin göğsünde sımsıkı tuttuğu pençe damgalı \'Yırtıcı Kaplan\' tomarını saygıyla aldın!',
                'Höyüğün taş lahdinden sızan soğuk havada kaplan pençesi motifli bronz tüpü gün yüzüne çıkardın.',
                'Mezar odasındaki tuzak plakalarına basmadan duvar nişindeki sert papirüsü emniyetle aldın.',
                'Kaplan Pençesi mührü elinde vahşi bir nabız gibi atıyordu; düşmanın etini parçalayacak teknikler burada gizli!',
                'Kadim gladyatörün anısına kılıcını selamlayarak höyüğün taş kapısını arkandan kapattın.',
                'Höyükten çıktığında bataklık kuşlarının bile ürktüğünü hissettin; içinde vahşi bir güç uyandı.',
                'Jin-Zhen\'e götüreceğin bu parşömen, dövüşlerinde derin kanama yaraları açacak bir yeteneğe dönüşecek.'
            ]
        }),
        new Quest({
            id: 'quest_monastery_ruins',
            title: 'Terk Edilmiş Manastır Kitaplığı',
            description: 'Bataklık tepesindeki yıkık manastırın kilerindeki taş kasayı kır; bedeni dağ gibi kılan \'Ağır Dağ\' tomarını kurtar.',
            type: QuestType.EXPEDITION,
            durationSeconds: 45,
            rewardGold: 85,
            rewardExp: 95,
            rewardFame: 3,
            requiredLevel: 2,
            requiredMinArmor: 4,
            requiredMinHpPercent: 40,
            rewardScrollId: 'item_sealed_scroll_mountain',
            scrollDropChancePercent: 100,
            progressText: '🏔️ Yıkık manastırın taş kilerinde kil mühürlü dev tomarı arıyorsun...',
            completionNarratives: [
                'Manastır kilerindeki çökmüş taş tonozun altındaki kil mühürlü ağır \'Ağır Dağ\' tomarını kollarınla çekip çıkardın!',
                'Kaya tozuyla sıvanmış asırlık parşömeni temizlediğinde dağ gibi sarsılmaz beden mukavemeti formüllerini gördün.',
                'Yıkık şapeldeki taş sunağın gizli kapağını kırarak kil muhafazayı aldın; ağırlığı adeta saf kaya gibiydi.',
                'Ağır Dağ mührü elindeyken darbelerin sana zarar veremeyeceği bir güven hissi damarlarına yayıldı.',
                'Manastır harabelerinden kasabaya yürürken attığın her adım toprağa daha sağlam bastı.',
                'Kil mührü Jin-Zhen\'e götürdüğünde bilge gözleri heyecanla parlayacak!',
                'Emaneti sağ salim çantana koydun; arenadaki ağır darbelere karşı en sağlam kalkanın bu olacak.'
            ]
        }),

        // --- 3 Aşamalı Derin Han Söylentisi Görev Zinciri: Bataklık Fısıltıları & Kaçakçı Ağı ---
        new Quest({
            id: 'quest_swamp_1',
            title: 'Bataklık Fısıltıları I: Şüpheli Kervancı',
            description: 'İsli Kandil\'de konuşulan fısıltılara göre gece yarısı sazlıkta teftişten kaçan karanlık bir kervancı var. Çeltik havuzlarında iz sür.',
            type: QuestType.EXPEDITION,
            durationSeconds: 25,
            rewardGold: 45,
            rewardExp: 50,
            rewardFame: 1,
            isRumorQuest: true,
            chainId: 'chain_swamp',
            chainStep: 1,
            maxChainSteps: 3,
            nextStageQuestId: 'quest_swamp_2',
            requiredMinHpPercent: 30
        }),
        new Quest({
            id: 'quest_swamp_2',
            title: 'Bataklık Fısıltıları II: Sazlıktaki Gece Baskını',
            description: 'İlk aşamada ele geçirdiğin şifreli kervan haritası sazlıktaki saklı bir iskeleyi işaret ediyor. Nöbetçilere pusu kur.',
            type: QuestType.EXPEDITION,
            durationSeconds: 35,
            rewardGold: 70,
            rewardExp: 80,
            rewardFame: 2,
            isRumorQuest: true,
            chainId: 'chain_swamp',
            chainStep: 2,
            maxChainSteps: 3,
            nextStageQuestId: 'quest_swamp_3',
            requiredLevel: 2,
            requiredMinArmor: 5,
            requiredMinHpPercent: 40
        }),
        new Quest({
            id: 'quest_swamp_3',
            title: 'Bataklık Fısıltıları III: Zehir Tacirinin İni',
            description: 'Kaçakçı şebekesinin kasaba altındaki gizli mahzenine baskın düzenle. Çetebaşı ve muhafızları dize getirerek kasabayı zehirden temizle!',
            type: QuestType.EXPEDITION,
            durationSeconds: 45,
            rewardGold: 120,
            rewardExp: 140,
            rewardFame: 3,
            isRumorQuest: true,
            chainId: 'chain_swamp',
            chainStep: 3,
            maxChainSteps: 3,
            nextStageQuestId: null,
            requiredLevel: 3,
            requiredMinDamage: 7,
            requiredMinArmor: 6,
            requiredSupplyGold: 15,
            requiredMinHpPercent: 50
        }),

        // --- Koşullu Tekil Derin Han Söylentisi Görevleri ---
        new Quest({
            id: 'quest_haunted_mine',
            title: 'Eski Tuz Madenindeki Hortlak İddiası',
            description: 'Handa çobanın fısıldadığı terkedilmiş tuz kuyularına in. Zehirli gazlara ve dehlizlerdeki karanlığa dayanmak için çantanda şifa iksiri olmalıdır.',
            type: QuestType.EXPEDITION,
            durationSeconds: 35,
            rewardGold: 65,
            rewardExp: 75,
            rewardFame: 2,
            isRumorQuest: true,
            requiredMinDamage: 6,
            requiredMinHpPercent: 40,
            requiredSupplyItemName: 'Pelin Otu Merhemi'
        }),
        new Quest({
            id: 'quest_debt_collection',
            title: 'Kaçak Kumarcının İzini Bul',
            description: 'Hancı Beric\'e yüklü miktarda barbut borcu takıp sazlıklara kaçan hilekar zarcıyı kıstır ve kasaba namına borcu tahsil et.',
            type: QuestType.EXPEDITION,
            durationSeconds: 30,
            rewardGold: 55,
            rewardExp: 60,
            rewardFame: 1,
            isRumorQuest: true,
            requiredMinArmor: 4,
            requiredLevel: 2
        }),

        // --- 2. BÖLGE: TAŞ HİSAR GARNİZONU GÖREVLERİ ---
        new Quest({
            id: 'quest_quarry_patrol',
            title: 'Granit Taş Ocağı Nöbeti',
            description: 'Taş Hisar\'ın devasa surlarını onarmak için taş kesilen ocakları dağ haydutlarına karşı koru.',
            type: QuestType.EXPEDITION,
            durationSeconds: 30,
            rewardGold: 65,
            rewardExp: 80,
            rewardFame: 1,
            requiredLevel: 5,
            requiredMinArmor: 6
        }),
        new Quest({
            id: 'quest_frost_pass',
            title: 'Buzul Geçidi Kervan Muhafızlığı',
            description: 'Dondurucu rüzgarların estiği kuzey sarp yolundan hisara erzak getiren ağır kervana eşlik et.',
            type: QuestType.EXPEDITION,
            durationSeconds: 40,
            rewardGold: 95,
            rewardExp: 110,
            rewardFame: 1,
            requiredLevel: 6,
            requiredMinArmor: 8,
            requiredMinHpPercent: 40
        }),
        new Quest({
            id: 'quest_trainer_trial',
            title: 'Kızıl Muhafız Althea\'nın Sınavı',
            description: 'Kızıl Muhafız Althea\'nın özel dövüş talimhanesine kabul edilmek için sarp Fırtına Zirvesi\'nden \'Kızıl Şahin Tüyü\' getir ve rüştünü ispatla!',
            type: QuestType.EXPEDITION,
            durationSeconds: 45,
            rewardGold: 120,
            rewardExp: 150,
            rewardFame: 2,
            requiredLevel: 6,
            requiredMinDamage: 12,
            requiredMinArmor: 7,
            requiredMinHpPercent: 50
        }),
        new Quest({
            id: 'quest_obsidian_smugglers',
            title: 'Obsidyen Kaçakçıları Baskını',
            description: 'Hisar altındaki volkanik galerilerden ham büyü taşları çalan gizli bir şebekeyi mağaralarda kıstır.',
            type: QuestType.EXPEDITION,
            durationSeconds: 45,
            rewardGold: 110,
            rewardExp: 130,
            rewardFame: 1,
            requiredLevel: 7,
            requiredMinDamage: 14,
            regionId: 'tashisar'
        }),
        new Quest({
            id: 'quest_r2_bastion_watch',
            title: 'Burç Nöbeti ve Fırtına Gözcülüğü',
            description: 'Denizden hisara sızmaya çalışan kaçakçı teknelerini ve fırtına korsanlarını gözetle.',
            type: QuestType.EXPEDITION,
            durationSeconds: 35,
            rewardGold: 90,
            rewardExp: 110,
            rewardFame: 2,
            requiredLevel: 5,
            regionId: 'tashisar'
        }),
        new Quest({
            id: 'quest_r2_supply_escort',
            title: 'Garnizon Çelik Sevkiyatı Koruması',
            description: 'Başkent yolundan gelen zırh ve silah çeliği kervanına dağ geçitlerinde refakat et.',
            type: QuestType.EXPEDITION,
            durationSeconds: 40,
            rewardGold: 105,
            rewardExp: 120,
            rewardFame: 2,
            requiredLevel: 6,
            regionId: 'tashisar'
        }),
        new Quest({
            id: 'quest_r2_sea_caves',
            title: 'Deniz Gelgit Mağaraları Temizliği',
            description: 'Sarp surların altındaki gelgit mağaralarına yuvalanan amfibi yağmacıları ve deniz kurtlarını temizle.',
            type: QuestType.EXPEDITION,
            durationSeconds: 45,
            rewardGold: 125,
            rewardExp: 140,
            rewardFame: 2,
            requiredLevel: 6,
            regionId: 'tashisar'
        }),
        new Quest({
            id: 'quest_r2_alchemist_frost_herbs',
            title: 'Ayaz Çiçeği ve Kükürt Hasadı',
            description: 'Simyacı Vanya\'nın kuvvetli iksirleri için dondurucu zirvelerden yabani ayaz çiçekleri topla.',
            type: QuestType.EXPEDITION,
            durationSeconds: 30,
            rewardGold: 85,
            rewardExp: 95,
            rewardFame: 1,
            requiredLevel: 5,
            regionId: 'tashisar'
        })
    ]
}

// Initial Daily Quests (Günde 2-3 Tane: Kervan Koruması + 2 Rastgele Standart Görev)
function createInitialQuests() {
    const baseQuests = createAllQuests().filter((it) => !it.isRumorQuest);
    const caravan = kt.first(baseQuests, (it) => it.id === 'quest_caravan');
    const others = kt.take(kt.shuffled(baseQuests.filter((it) => it.id !== 'quest_caravan' && !it.id.startsWith('quest_quarry') && !it.id.startsWith('quest_frost') && !it.id.startsWith('quest_trainer') && !it.id.startsWith('quest_obsidian'))), 2);
    return [caravan, ...others];
}

export const MAT_WHITE_WOLF_PELT = 'mat_white_wolf_pelt'
export const MAT_METEORITE_ORE = 'mat_meteorite_ore'
export const MAT_TROLL_HIDE = 'mat_troll_hide'
export const MAT_OBSIDIAN_CORE = 'mat_obsidian_core'

// Tehlikeli Maceralar & Efsanevi Avlar
function createInitialAdventures() {
    return [
        new Adventure({
            id: 'adv_white_wolf_hunt',
            title: 'Kuzey Sırtları: Ak Ayaz Kurdu Avı',
            description: 'Kırlangıç Kasabası\'nın kuzeyindeki donmuş kayalıklarda sürüden ayrılmış efsanevi bir Ak Ayaz Kurdu kol geziyor. Kalın gümüşi postu ve hançer boyundaki dişleriyle avcıları paramparça ediyor. Donanım gücün ne kadar yüksekse kurdu alt etme şansın o kadar artar.',
            targetName: 'Efsanevi Ak Ayaz Kurdu',
            icon: '🐺',
            durationSeconds: 35,
            requiredLevel: 2,
            requiredMinHpPercent: 50,
            requiredMinArmor: 4,
            requiredSupplyItemName: 'Şifa Merhemi veya Dağ Otu',
            baseSuccessChancePercent: 45,
            rewardGold: 50,
            rewardExp: 65,
            rewardMaterialId: MAT_WHITE_WOLF_PELT,
            rewardMaterialName: 'Ak Ayaz Kurdu Postu & Dişi',
            rewardMaterialIcon: '🐺',
            failureDamage: 22,
            failureNarrative: '⚠️ Ak Ayaz Kurdu karların arasından pusu kurup pençesini göğsüne indirdi! Ayazın keskin soğuğunda güçlükle geri çekilebildin (-22 Can).'
        }),
        new Adventure({
            id: 'adv_meteorite_crater',
            title: 'Kükürt Krateri: Göktaşı Filizi Keşfi',
            description: 'Bölgenin lav çatlaklarıyla yarılmış kükürt vadisinde, asırlar önce gökten düşmüş bir göktaşı krateri yatıyor. Zehirli buharlar ve çete pusuları arasından kızıl kor damarlarını kazarak kadim göktaşı çeliği çıkartmalısın.',
            targetName: 'Kadim Lav Krateri',
            icon: '☄️',
            durationSeconds: 35,
            requiredLevel: 2,
            requiredMinHpPercent: 50,
            requiredMinDamage: 7,
            requiredSupplyGold: 15,
            baseSuccessChancePercent: 50,
            rewardGold: 45,
            rewardExp: 60,
            rewardMaterialId: MAT_METEORITE_ORE,
            rewardMaterialName: 'Kızıl Göktaşı Çelik Filizi',
            rewardMaterialIcon: '☄️',
            failureDamage: 18,
            failureNarrative: '⚠️ Zehirli kükürt buharı genzini yaktı ve maden çatlağında çapulcuların taşlı pususuna yakalandın! Elin boş dönmek zorunda kaldın (-18 Can).'
        }),
        // --- 2. BÖLGE MACERALARI ---
        new Adventure({
            id: 'adv_mountain_troll',
            title: 'Granit Zirveleri: Dağ Trolü Avı',
            description: 'Taş Hisar dağlarının zirvesinde sığınan, kayaları ufak çakıl gibi fırlatan devasa bir dağ trolü. Kalın derisi zırh dövücüler için paha biçilmezdir.',
            targetName: 'Yarı Kör Dağ Trolü',
            icon: '🧌',
            durationSeconds: 45,
            requiredLevel: 6,
            requiredMinHpPercent: 50,
            requiredMinArmor: 8,
            requiredMinDamage: 12,
            baseSuccessChancePercent: 40,
            rewardGold: 110,
            rewardExp: 140,
            rewardMaterialId: MAT_TROLL_HIDE,
            rewardMaterialName: 'Taşlaşmış Trol Derisi',
            rewardMaterialIcon: '🧌',
            failureDamage: 35,
            failureNarrative: '⚠️ Dağ trolünün kaya savuruşu zırhını çatlattı! Kayalıklardan yuvarlanarak canını zor kurtardın (-35 Can).'
        }),
        new Adventure({
            id: 'adv_obsidian_depths',
            title: 'Hisar Dehlizleri: Obsidyen Damarı Kazısı',
            description: 'Taş Hisar\'ın temellerindeki sönmüş yanardağ çatlaklarında kapkara obsidyen kristalleri parıldıyor. Gaz sızıntıları ve yer altı akrepleri arasında kazı yap.',
            targetName: 'Lav Dehlizleri',
            icon: '⛏️',
            durationSeconds: 40,
            requiredLevel: 6,
            requiredMinHpPercent: 45,
            requiredMinDamage: 10,
            requiredSupplyGold: 25,
            baseSuccessChancePercent: 45,
            rewardGold: 95,
            rewardExp: 125,
            rewardMaterialId: MAT_OBSIDIAN_CORE,
            rewardMaterialName: 'Saf Obsidyen Cevher Özü',
            rewardMaterialIcon: '💎',
            failureDamage: 28,
            failureNarrative: '⚠️ Dehlizde tavan çöktü ve zehirli kükürt dumanı soludun (-28 Can).'
        })
    ]
}

// Koşullu ve Çift Özellikli Efsanevi Eşyaların Zanaat Reçeteleri
function createCraftingRecipes() {
    const wolfArmor = new Equipment({
        id: 'eq_craft_frost_wolf_armor',
        name: 'Akdiş Ayaz Postu Zırhı',
        slot: EquipmentSlot.CHEST,
        rarity: ItemRarity.NADIDE,
        stats: new Stats({damage: 1, armor: 5, maxHealth: 50, blockChancePercent: 5, dodgeChancePercent: 3}),
        requiredLevel: 2,
        valueInGold: 130,
        description: 'Kuzey dağlarının vahşi Ak Ayaz Kurdu\'nun gümüşi postundan ve dişlerinden işlenmiş kadim zırh. Soğuğu savurur ve taşıyıcısına vahşi bir avcı öfkesi bahşeder.',
        armorCategory: ArmorCategory.HEAVY_ARMOR,
        specialTrait: new EquipmentSpecialTrait({
            id: 'kurt_ofkesi',
            name: 'Ak Ayaz Öfkesi',
            description: 'Can %40\'ın altına indiğinde +%20 saldırı hasarı ve her vuruşta %12 can çalma tetiklenir!',
            icon: '🐺'
        })
    })

    const meteoriteBlade = new Equipment({
        id: 'eq_craft_meteorite_blade',
        name: 'Göktaşı Dövme Alev Palası',
        slot: EquipmentSlot.WEAPON,
        rarity: ItemRarity.NADIDE,
        stats: new Stats({damage: 9, critChancePercent: 6, speed: 1}),
        requiredLevel: 2,
        valueInGold: 145,
        description: 'Kükürt Krateri\'ne düşen kadim göktaşı cevherinin ocakta kızıl korla dövülmesiyle yapılan ağır pala. Havayı yararken arkasında sönmeyen bir kıvılcım izi bırakır.',
        weaponType: 'pala',
        weaponCategory: WeaponCategory.SWORD,
        specialTrait: new EquipmentSpecialTrait({
            id: 'yakici_darbe',
            name: 'Göktaşı Harı',
            description: 'Saldırılarda %28 şansla rakibin zırhını eriten +5 ek kor alev hasarı verir!',
            icon: '🔥'
        })
    })

    return [
        new CraftingRecipe({
            id: 'recipe_frost_wolf_armor',
            resultItem: wolfArmor,
            requiredMaterialId: MAT_WHITE_WOLF_PELT,
            requiredMaterialName: 'Ak Ayaz Kurdu Postu & Dişi',
            requiredMaterialIcon: '🐺',
            requiredMaterialCount: 2,
            requiredGold: 45,
            description: 'Demirci ocağında kurt postunu çelik halkalarla perçinleyerek efsanevi zırhı ortaya çıkar.'
        }),
        new CraftingRecipe({
            id: 'recipe_meteorite_blade',
            resultItem: meteoriteBlade,
            requiredMaterialId: MAT_METEORITE_ORE,
            requiredMaterialName: 'Kızıl Göktaşı Çelik Filizi',
            requiredMaterialIcon: '☄️',
            requiredMaterialCount: 2,
            requiredGold: 50,
            description: 'Göktaşı filizini körükte eritip soğuk suyla sulayarak alevli kesici palayı döv.'
        })
    ]
}

// 11 Unique Enemy Flaws & Weaknesses (Açık ve Zayıf Nokta İstihbaratı)
function getAllEnemyWeaknesses() {
    return [
        new EnemyWeakness({
            enemyId: 'fighter_khorvash',
            enemyName: 'Khorvash',
            flawTitle: 'Ses Yanıltması & Tuz Körlüğü',
            hintDescription: 'Gözleri görmez; kuma sahte ayak sürtüp ses yanıltması yaparsan kargısını ters yöne savurur.',
            combatExploitPhrase: 'Kuma sürtülen ayak sesine aldanıp oltasını ters yöne savurduğu an açığını acımasızca cezalandırdın!',
            intelCostGold: 25,
            exploitChancePercent: 35,
            bonusDamagePercent: 40
        }),
        new EnemyWeakness({
            enemyId: 'fighter_zalmora',
            enemyName: 'Zal\'Mora',
            flawTitle: 'Kısa Menzil & Vahşi Atılış',
            hintDescription: 'Boynuz hançerinin menzili çok kısadır; bir adım geri çekilip atılışının boşluğuna vurursan gardı çöker.',
            combatExploitPhrase: 'Hırçınca öne fırlarken mesafeyi kestiremedi; boşa çıkan hamlesinin ardından böğrüne darbeyi gömdün!',
            intelCostGold: 25,
            exploitChancePercent: 35,
            bonusDamagePercent: 40
        }),
        new EnemyWeakness({
            enemyId: 'fighter_xylar',
            enemyName: 'Xylar',
            flawTitle: 'Sarhoş Adım & Sol Topuk Dengesizliği',
            hintDescription: 'Ağır tokmağı savurduktan sonra ağırlığını sol topuğuna verir; bacağına vurursan kumlara kapaklanır.',
            combatExploitPhrase: 'Ağır tokmak kumlara çarptığında sol bacağındaki dengesizliğe yüklenip koca cüssesini devirdin!',
            intelCostGold: 25,
            exploitChancePercent: 35,
            bonusDamagePercent: 40
        }),
        new EnemyWeakness({
            enemyId: 'fighter_vaelen',
            enemyName: 'Vaelen',
            flawTitle: 'Kanca Geri Çekiş Gecikmesi',
            hintDescription: 'Gölge kancasını fırlattıktan sonra zinciri toplayana kadar gövdesi 2 saniye savunmasız kalır.',
            combatExploitPhrase: 'Kancası boşa savrulduğunda zinciri çekmeye fırsat bulamadan göğsündeki savunmasız boşluğu yardın!',
            intelCostGold: 30,
            exploitChancePercent: 35,
            bonusDamagePercent: 40
        }),
        new EnemyWeakness({
            enemyId: 'fighter_morvath',
            enemyName: 'Morvath',
            flawTitle: 'Kargı İvme Açığı',
            hintDescription: 'Üç ağızlı kargısındaki kurşun ağırlık savrulduktan sonra durdurulamaz; sağına kayıp boşluğunu yakala.',
            combatExploitPhrase: 'Ağır kargı savrulup boşa çıktığında Morvath\'ın sağ yanındaki korumasız zırh aralığını deştin!',
            intelCostGold: 40,
            exploitChancePercent: 35,
            bonusDamagePercent: 45
        }),
        new EnemyWeakness({
            enemyId: 'fighter_bregash',
            enemyName: 'Bregash',
            flawTitle: 'Ters Pala Dirsek Zaafı',
            hintDescription: 'Aşağıdan yukarı kemik deşerken dirseği dışarıda kalır; karşı hamleyle eklemini hedef al.',
            combatExploitPhrase: 'Palayı ters çevirdiği salisede dirsek eklemindeki zayıf noktaya çeliği kilitledin!',
            intelCostGold: 30,
            exploitChancePercent: 35,
            bonusDamagePercent: 40
        }),
        new EnemyWeakness({
            enemyId: 'fighter_kaelen',
            enemyName: 'Kaelen',
            flawTitle: 'Kiriş Kurma Sesi & Kör Nokta',
            hintDescription: 'Arbaletini doldururken çarkın sesini dinler; fısıltıyla yön değiştirip nişanını şaşırt.',
            combatExploitPhrase: 'Arbaletin kurma dişlileri dönerken sesini gizleyip kör noktasından ölümcül darbeyi vurdun!',
            intelCostGold: 30,
            exploitChancePercent: 35,
            bonusDamagePercent: 40
        }),
        new EnemyWeakness({
            enemyId: 'fighter_ghorak',
            enemyName: 'Ghorak',
            flawTitle: 'Ağır Zincir Toplama Açığı',
            hintDescription: 'Pranga topuzunu savurduktan sonra zinciri toplamak için iki adım geri çekilmek zorundadır.',
            combatExploitPhrase: 'Dikenli demir gülle kumlara çarptığında zinciri çekmeye fırsat bulamadan zırhına yüklendin!',
            intelCostGold: 35,
            exploitChancePercent: 35,
            bonusDamagePercent: 40
        }),
        new EnemyWeakness({
            enemyId: 'fighter_thyra',
            enemyName: 'Thyra',
            flawTitle: 'İki El Balta Hücum Boşluğu',
            hintDescription: 'Baltayı iki eliyle kaldırdığında göğüs kafesi tamamen siperden mahrum kalır; tam o an göğsüne gir.',
            combatExploitPhrase: 'Baltasını iki eliyle havaya kaldırdığı an gardı çöktü; göğsüne en derin vuruşunu indirdin!',
            intelCostGold: 40,
            exploitChancePercent: 35,
            bonusDamagePercent: 45
        }),
        new EnemyWeakness({
            enemyId: 'fighter_orn',
            enemyName: 'Orn',
            flawTitle: 'Zıpkın İpi Düğümü',
            hintDescription: 'Zıpkınını attıktan sonra sol kolundaki kalkan ipine takılır; kalkanını kaldıramaz.',
            combatExploitPhrase: 'Zıpkının ipi koluna dolandığı anda kalkanını kaldıramadı; çengelli tuzağını başına yıktın!',
            intelCostGold: 30,
            exploitChancePercent: 35,
            bonusDamagePercent: 40
        }),
        new EnemyWeakness({
            enemyId: 'fighter_sarkoth',
            enemyName: 'Sarkoth',
            flawTitle: 'Akrep Kaması Bileme Kibri',
            hintDescription: 'Kamalarını birbirine sürttüğü an ritmini kaybeder; ayak bileğini kilitle.',
            combatExploitPhrase: 'Kamalarını kibre kapılıp birbirine şaklattığı anda hızını kesip bacağına kilitlendin!',
            intelCostGold: 30,
            exploitChancePercent: 35,
            bonusDamagePercent: 40
        })
    ]
}

// 16+ Rich Tavern Tales & Rumors
function createTavernTales() {
    return [
        new TavernTale({
            id: 'tale_trouble_mill',
            speakerName: 'Değirmenci Hamdi',
            speakerTitle: 'Un Tozuna Bulanmış İhtiyar',
            category: RumorCategory.TOWN_TROUBLE,
            title: 'Çarkın Dişine Takılanlar',
            narrative: 'Gece çark yine durdu evlat! Gittim baktım, sazlıktan sürüklenen bir kırık kalkan perçini sıkışmış. Kasabanın derdi bitmez; yukarıda arenada birbirlerini doğrarlar, aşağıda bendi temizlemek bize kalır. Bir çuval arpa ununu ziyan ettik!'
        }),
        new TavernTale({
            id: 'tale_trouble_cook',
            speakerName: 'Aşçıbaşı Nuriye',
            speakerTitle: 'Kazan Başındaki Teyze',
            category: RumorCategory.TOWN_TROUBLE,
            title: 'Tuzsuz Çorbanın İsyanı',
            narrative: 'Tuz kervanı yine sazlıkta çamura saplanmış! Üç gündür çorbaya bir tutam kaya tuzu atamıyorum. Akşam gladyatör takımı hana doluşunca \'Bu ne biçim su!\' diye tahta masaları yumrukladılar. Sazlık tarafındaki o şüpheli kervan rotasına biri baksa iyi olur!',
            questClueId: 'quest_swamp_1',
            clueDiscoveryText: '🔍 Gizli İpucu: Aşçıbaşının fısıldadığı şüpheli kervan rotası yarınki görev panosuna eklendi!'
        }),
        new TavernTale({
            id: 'tale_trouble_apprentice',
            speakerName: 'Kunduracı Çırağı Celo',
            speakerTitle: 'Dikiş İğnesiyle Yaralı Genç',
            category: RumorCategory.TOWN_TROUBLE,
            title: 'Arenaya Heves Edenin Sonu',
            narrative: 'Ustama inat arenaya çıkacaktım ben de! Tahta mankene iki tekme savurdum, akşamına ustam meşin kayışla sırtımı terbiye etti: \'Sen çarık dikeceksin kerata, Morvath\'ın kargısına yem mi olacaksın!\' Haklıymış be ağam, kumlar kan kokuyor...'
        }),
        new TavernTale({
            id: 'tale_trouble_goat',
            speakerName: 'Çoban Rüstem',
            speakerTitle: 'Sazlık Otlatıcısı',
            category: RumorCategory.TOWN_TROUBLE,
            title: 'Sazlıkta Parlayan Gözler',
            narrative: 'Benim alaca keçi bataklık tarafındaki eski tuz madeni kuyularına kaçtı dün akşamüstü. Peşinden vardım dehlizlerin ağzına, suyun içinden bana bakan sarı gözler gördüm! O kuyulara sağlam bir kılıç ve şifa merhemi olmadan kimse inmesin...',
            questClueId: 'quest_haunted_mine',
            clueDiscoveryText: '🔍 Gizli İpucu: Çobanın ürktüğü terk edilmiş tuz madeni keşfi panoya işlendi!'
        }),
        new TavernTale({
            id: 'tale_gossip_gambler',
            speakerName: 'Zar Atıcı Sarı Cavidan',
            speakerTitle: 'Barbut Masasının Müdavimi',
            category: RumorCategory.ARENA_GOSSIP,
            title: 'Kaçak Zarcının Peşindekiler',
            narrative: 'Geçen gece Hancı Beric\'in masasını deviren zarcı Çolak Neco\'yu gördün mü? Hancının 80 altınını cebe indirip bataklık değirmenine doğru topukladı. Beric arkasından hanın baltasını fırlattı da kıl payı kaçtı herif. Onu kıstıranın cebi altın dolarmış!',
            questClueId: 'quest_debt_collection',
            clueDiscoveryText: '🔍 Gizli İpucu: Hancının kaçak kumarcısını arama sözleşmesi panoya işlendi!'
        }),
        new TavernTale({
            id: 'tale_gossip_morvath',
            speakerName: 'Eski Bahisçi Kel Sami',
            speakerTitle: 'Dişsiz Kumarbaz',
            category: RumorCategory.ARENA_GOSSIP,
            title: 'Morvath\'ın Kargısındaki Sır',
            narrative: 'Morvath\'ı 14 haftadır kimse deviremiyor sanıyorsun değil mi? Bak kulağını ver: Kargısının orta ekleminde kurşun ağırlık gizlidir. Savururken kolu değil, o ağırlığın savrulma ivmesi vurur. Sağına yatırıp kargıyı boşluğa düşürürsen dengesi anında biter!'
        }),
        new TavernTale({
            id: 'tale_gossip_ghorak',
            speakerName: 'Küreklik Kaçkını Toros',
            speakerTitle: 'Dövmeli Mahkum',
            category: RumorCategory.ARENA_GOSSIP,
            title: 'Pranganın Gerçek Hikayesi',
            narrative: 'Ghorak\'ın bileğindeki o dikenli prangayı gardiyanlar takmadı ona. Kürek gemisi batarken zindancıbaşının kafasını o prangayla ezdi, zinciri koparmadan bileğine kaynaklattı. Adamın derisi demirle birleşmiş, acı hissetmiyor artık.'
        }),
        new TavernTale({
            id: 'tale_gossip_kaelen',
            speakerName: 'Avcı Kalfası Berke',
            speakerTitle: 'Kırık Yaylı Nişancı',
            category: RumorCategory.ARENA_GOSSIP,
            title: 'Göz Bağı Aldatmacası',
            narrative: 'Arbaletçi Kaelen kördür doğru, ama kulakları kedi gibidir. Dövüşürken arenadaki bayrakların sesini dinler, rüzgarın hızını tartar. Onun karşısında sessizce kayarsan havaya ok sıkar; ama ağır zırhın perçinleri şıngırdarsa doğrudan kalbine çakar oku!'
        }),
        new TavernTale({
            id: 'tale_gossip_thyra',
            speakerName: 'Kuzeyli Dağ Gezgini',
            speakerTitle: 'Kürk Yelekli Sürgün',
            category: RumorCategory.ARENA_GOSSIP,
            title: 'Klan Reisinin Çadırı',
            narrative: 'Thyra kendi kabilesinden sürüldü çünkü klan reisi kız kardeşini bir tuz tüccarına satmak istedi. Thyra bir gece reisin çadır direğini o nacağıyla ikiye biçti, reisi de çıplak ayak dağdan aşağı kovaladı. O balta sadece zırh değil, haysiyet yarmak için dövülmüştür.'
        }),
        new TavernTale({
            id: 'tale_gossip_sarkoth',
            speakerName: 'Güneyli Baharatçı',
            speakerTitle: 'İpek Kuşaklı Tüccar',
            category: RumorCategory.ARENA_GOSSIP,
            title: 'Kemik Kamanın Sarı Zehri',
            narrative: 'Sarkoth\'un kamalarına dikkat et yabancı. Çölün kızıl akreplerinin zehrini yılan yağıyla kaynatıp o kemiğe emdirmiş. Tek bir sıyrık bile alsan bacağın yarım gün uyuşur, adımlarını kütük gibi hissedersin.'
        }),
        new TavernTale({
            id: 'tale_lore_star',
            speakerName: 'Kör Ozan Miras',
            speakerTitle: 'Diyar Anlatıcısı',
            category: RumorCategory.WORLD_LORE,
            title: 'Gökten İnen Kızıl Cevher',
            narrative: 'Üç asır evvel bu sazlıklara gökten kızıl bir yıldız düştü. Toprak haftalarca kaynadı. O göktaşının parçalarından dövülen ilk yedi kılıç, \'Diyarın Kaderi\'ni elinde tutan yedi silahşöre verildi. Şimdi o silahların çoğu kumların altında uyuyor...'
        }),
        new TavernTale({
            id: 'tale_lore_sunken_city',
            speakerName: 'Antikacı İshak',
            speakerTitle: 'Eski Sikke Koleksiyoncusu',
            category: RumorCategory.WORLD_LORE,
            title: 'Bataklığın Altındaki Mermer Sütunlar',
            narrative: 'Kırlangıç Kasabası\'nın çamuruna bakıp burayı sefil sanma. Sazlığın üç kulaç altında bembeyaz mermerden tapınaklar yatar. Şimdiki arena çukuru bile aslında o kadim amfitiyatronun çökmüş kubbesidir!'
        }),
        new TavernTale({
            id: 'tale_lore_prophecy',
            speakerName: 'Sürgün Keşiş Aldous',
            speakerTitle: 'Yırtık Cübbeli Meczup',
            category: RumorCategory.WORLD_LORE,
            title: 'Sürgünlerin Döndüğü Gece',
            narrative: 'Diyarın dört bir yanına sürülmüş olanlar bir gün toplanacak evlat. Kırlangıç Kasabası\'nın çukurunda adını kana bulayan o tek bir silahşör, derebeylerin demir tahtlarını sarsacak fırtınanın kıvılcımı olacak.'
        }),
        new TavernTale({
            id: 'tale_wanderer_desert',
            speakerName: 'Tuz Kervancısı Beşir',
            speakerTitle: 'Güneş Yanığı Deveci',
            category: RumorCategory.WANDERER_TALE,
            title: 'Kızıl Çölün Serap Devleri',
            narrative: 'Tuz düzlüklerinde üç gün susuz kaldık mı kum tepeleri yürümeye başlar. Bir keresinde kumlardan yükselen devasa bir kılıç kabzası gördüm; tepe kadar büyüktü! Yaklaştıkça rüzgar tozu savurdu, sadece bir seraptı... Yoksa öyle miydi?'
        }),
        new TavernTale({
            id: 'tale_wanderer_ghost_ship',
            speakerName: 'Bataklık Balıkçısı Cebrail',
            speakerTitle: 'Ağ Örücüsü',
            category: RumorCategory.WANDERER_TALE,
            title: 'Feneri Sönük Kalyon',
            narrative: 'Sis bastığında iskelenin açığından siyah yelkenli bir kalyon kayıp geçer bazen. Ne kürek sesi gelir ne rüzgar çeker. Güvertesinde zırhları paslı, hareketsiz nöbetçiler durur. Kırlangıç çayı denize kavuşana dek onları kimse durduramaz.'
        }),
        new TavernTale({
            id: 'tale_wanderer_iron_mines',
            speakerName: 'Maden İşçisi Demirci Halil',
            speakerTitle: 'İs Lekeli Kazmacı',
            category: RumorCategory.WANDERER_TALE,
            title: 'Kara Dağların İniltisi',
            narrative: 'Kuzeydeki derin galerilerde kazma sallarken dağın içinden derin bir inilti yankılanır. Ustalar \'kara damar nefes alıyor\' der. Demir perçinler sıcaktan erir gibi olur. O madenden çıkan çelikle yapılan silahların can aldığı söylenir.'
        }),
        new TavernTale({
            id: 'tale_trouble_ale',
            speakerName: 'Hancı Çırağı Mahmut',
            speakerTitle: 'Bulaşık Bezi Omuzunda Delikanlı',
            category: RumorCategory.TOWN_TROUBLE,
            title: 'Fıçının Dibindeki Fare',
            narrative: 'Geçen hafta arpa şarabı fıçısını boşaltırken dibinden taşlaşmış bir fare iskeleti çıktı! Hancı \'Kimseye söyleme, lezzet veren mayası odur\' dedi. Yeminle o günden beri hanın suyundan başka bir şey içemiyorum ağam!'
        }),
        new TavernTale({
            id: 'tale_trouble_blacksmith_curse',
            speakerName: 'Demirci Kalfası Dursun',
            speakerTitle: 'Kömür Karası Çırak',
            category: RumorCategory.TOWN_TROUBLE,
            title: 'Örsün Soğuduğu Gece',
            narrative: 'Ustam Vorn dün gece ocağı körüklerken alevler birden yeşile döndü! Ocağın içinden bir çığlık koptu sanki. Çıkan demir o kadar sertleşti ki çekiç vurdukça kıvılcımlar tavanı yaktı. Vorn \'Eski göktaşının damarı uyandı\' deyip sabaha kadar dua etti.'
        }),
        new TavernTale({
            id: 'tale_trouble_dock_fog',
            speakerName: 'Gemi Halatçısı Tahir',
            speakerTitle: 'Romatizmalı İskele Emektarı',
            category: RumorCategory.TOWN_TROUBLE,
            title: 'Sazlıktaki Yeşil Fener',
            narrative: 'Sis bastığında iskele sazlığının en derin yerinde yeşil bir ışık yanıp söner. Ne gaz yağına benzer ne çıraya. O ışığa doğru kürek çeken balıkçıların sandalları ertesi gün kıyıya boş vurur; tahtalarında derin tırnak izleriyle...'
        }),
        new TavernTale({
            id: 'tale_gossip_training_secret',
            speakerName: 'Emekli Gladyatör Demirbilek',
            speakerTitle: 'Kırık Dizli Usta',
            category: RumorCategory.ARENA_GOSSIP,
            title: 'Bilek Kemiklerinin Sırrı',
            narrative: 'Arenada hayatta kalmak istiyorsan sadece kılıç sallamak yetmez evlat. Dövüşçü dediğin her şafakta parmaklarını tuzlu kuma sokup yumruklarını taşa vurmalı. Kemik sertleşmezse Morvath\'ın kargısı vurduğunda kolların dal gibi kırılır!'
        }),
        new TavernTale({
            id: 'tale_gossip_alchemist_brew',
            speakerName: 'Gizemli Aktar Çırağı',
            speakerTitle: 'Ot Torbalı Gezgin',
            category: RumorCategory.ARENA_GOSSIP,
            title: 'Dövüş Öncesi Acı Kök',
            narrative: 'Ghorak ve Thyra arenaya çıkmadan önce hanın arkasında Mirana\'nın hazırladığı acı pelin suyundan dikerler kafaya. O su kanı kaynatır, ilk beş darbede yara alsan bile acıyı hissettirmez. Gözleri kan çanağı gibi dönen dövüşçüden korkacaksın!'
        }),
        new TavernTale({
            id: 'tale_gossip_spectator_fraud',
            speakerName: 'Kurnaz Tellal Şerif',
            speakerTitle: 'Pelerinli Bahisçi',
            category: RumorCategory.ARENA_GOSSIP,
            title: 'Çifte Mühürlü Bahis Masası',
            narrative: 'Arenada bazen oranlar birden tepe taklak olur. Bakarsın favori dövüşçüye 1\'e 4 verirler. Sebebi ne bilmek ister misin? Hilekar tellallar dövüşçünün kalkan bağını önceden jiletle çentik atıp zayıflatır. Kumda kan dökülürken servet el değiştirir!'
        }),
        new TavernTale({
            id: 'tale_lore_ancient_gate',
            speakerName: 'Sürgün Kütüphaneci Melchior',
            speakerTitle: 'Tozlu Parşömen Taşıyıcısı',
            category: RumorCategory.WORLD_LORE,
            title: 'Taş Hisar\'ın Devasa Kapıları',
            narrative: 'Kuzeydeki Taş Hisar Garnizonu\'nun demir kapılarını insan eli yapmadı evlat. Üç bin yıl önce dağ devleri o kapıları tek parça granitten oyup yerleştirdi. Söylentiye göre kapı kilitlerinin şifresi kadim bir silahşörün kılıç kabzasına kazınmıştır.'
        }),
        new TavernTale({
            id: 'tale_lore_first_champion',
            speakerName: 'Eski Kum Bekçisi Seyfi',
            speakerTitle: 'Körükçü İhtiyar',
            category: RumorCategory.WORLD_LORE,
            title: 'Kumların İlk Kanı',
            narrative: 'Kırlangıç çukurunda ilk dövüş yüz elli yıl önce yapıldı. İki sürgün kardeş tek bir somun ekmek için tahta sopalarla kapıştı. Kazanan kardeş ağlayarak ekmeği yedi, sonra da o çukura kılıcını saplayıp ant içti. O günden beri bu çukur zayıfları asla affetmez.'
        }),
        new TavernTale({
            id: 'tale_wanderer_mountain_pass',
            speakerName: 'Kürk Avcısı Rasim',
            speakerTitle: 'Donuk Parmaklı Dağlı',
            category: RumorCategory.WANDERER_TALE,
            title: 'Ayaz Geçidinin Kurt Çığlığı',
            narrative: 'Taş Hisar yolundaki dik boğazda fırtına koptuğunda kayalar ulumaya başlar. Kervanlar yük hayvanlarını birbirine bağlar yoksa rüzgar katırları uçurumdan aşağı çöp gibi savurur. O boğazı geçebilen savaşçının yüreği artık hiçbir kılıçtan korkmaz.'
        }),
        new TavernTale({
            id: 'tale_wanderer_swamp_witch',
            speakerName: 'Balçık Toplayıcısı Gaffar',
            speakerTitle: 'Ayakları Çamurlu Gariban',
            category: RumorCategory.WANDERER_TALE,
            title: 'Sazlıktaki Kemiğe Çalan Kadın',
            narrative: 'Derin bataklıkta sisin içinde tek başına yaşayan bir şifacı kadın fısıldanır. Yaralı gladyatörlerin kanlı bezlerini toplayıp kazanında kaynatırmış. O kazandan çıkan kara merhem ölüm döşeğindekini bile ayağa kaldırırmış ama karşılığında bir yıllık ömrünü alırmış!'
        })
    ]
}

function createBardSongs() {
    return [
        '🎶 "Kırlangıç çayı bulanık akar,\nKumların üstüne yiğitler bakar...\nKılıçlar kınından sıyrıldığı an,\nNe derebey kalır, ne tahtı yıkar!"',
        '🎶 "Sürgün geldin çamurlu sazlığa,\nBoyun eğmedin ne aç ne azlığa...\nBileğinde demir, göğsünde inat,\nAdını kazıdın bu yalnızlığa!"',
        '🎶 "Kör arbalet çalar ince sazını,\nÖlüm siler her gladyatör yasını...\nKızıl kumlar şahittir kavgamıza,\nToprak içer yiğidin kan tasını!"',
        '🎶 "Bataklığın ardında saklı diyar,\nZırhı deler, kemiğe işler ayar...\nBir gün diner bu çukurun feryadı,\nKaderini yazan silahşör uyar!"',
        '🎶 "Demirci körüğü alev saçar,\nKorkak olanlar bu kumdan kaçar...\nÇelik çeliğe çarptığı anda,\nYaradan bile gök kapısını açar!"',
        '🎶 "Tuz çölünün rüzgarı sert eser,\nKör Khorvash hasmını sessizce keser...\nKulak ver kumdaki her kıpırtıya,\nEcel gelince nefesini keser!"',
        '🎶 "Zal\'Mora çiğner ocak külünü,\nTanımaz bu diyarın bülbülünü...\nBoynuz hançeri kana doymazsa,\nToprağa gömer kendi gülünü!"',
        '🎶 "Demir Diş Xylar handa sarhoştur,\nDünya dedikleri bir kuru hoştur...\nKumda tokmakla kemik kırsa da,\nCebinde kalan üç beş kuruştur!"',
        '🎶 "Gölge Akbaba pusuda bekler,\nHer zaferine bir yenisini ekler...\nKancası boğaza dolandığı an,\nTükenir dualar, biter dilekler!"',
        '🎶 "Morvath dikilmiş ligin başına,\nAcımaz kimsenin gözün yaşına...\nÜç ağızlı kargı kalktığı anda,\nAdın kazınır mezar taşına!"',
        '🎶 "Bregash ters tutar paslı palayı,\nBaşına sarar binbir belayı...\nSazlık mezbaha kan kokar her gün,\nOna sorarlar bu dar sılayı!"',
        '🎶 "Prangalı Ghorak zindandan gelir,\nDemir gülleler kalkanı delir...\nBoynunda bukağı, kolunda zincir,\nYalnızca kaba kuvveti bilir!"',
        '🎶 "Dağ klanından sürgün bir gelin,\nThyra nacağıyla bükülmez elin...\nKemik yararken çığlığı yankır,\nÖnünde duramaz ne dağ ne selin!"',
        '🎶 "Sarkoth pusuda bir kum akrebi,\nSinsi kamayla biçer edebi...\nZehirli çelik kana karışır,\nBilinmez bu sonsuz kinin sebebi!"',
        '🎶 "Han masasında şarap dökülür,\nYiğidin sırtı karda bükülür...\nZarlar dönerken gecenin körü,\nYürekten nice sırlar sökülür!"',
        '🎶 "Vorn\'un ocağı harlayıp yanar,\nKırılan kılıç ustayı anar...\nSu verilmemiş ham demir ise,\nİlk vuruşta ortadan kırılıp donar!"',
        '🎶 "Simyacı kaynatır acı otları,\nTitrermiş mecliste tüm kontları...\nBir yudum iksir cana can katar,\nYeniden yazdırır bu hudutları!"',
        '🎶 "Taş Hisar ufukta kara bir kale,\nDüşürmez yiğidi dilden dille...\nMuhafız Althea elinde kırbaç,\nBoyun eğdirir her türlü leşe!"',
        '🎶 "Gözleri görmez Ozan Miras\'ın,\nYüreğinde saklı bin yıllık yasın...\nSen dövüş evlat, kumlarda diren,\nDestanın sazımda ebedi kalsın!"'
    ]
}

// 20 Destansı 8'lik Kahramanlık Şarkıları (Sekizlik Destanlar)
function createEpicBardSongs() {
    return [
        // 1. Destan: Güney Sürgününün İntikamı
        '🎶 "Güney bağlarından koptun da geldin,\nKaderin ördüğü çemberi deldin...\nAkademi sürgünü bir deli çocuk,\nBu çamurlu çukurda haddini bildin!\n\nŞimdi kumlar yanar senin adınla,\nÇelik su içer her feryadınla...\nKırılsa da kılıcın, bükülmez boynun,\nŞafak söküyor bu son andınla!"',

        // 2. Destan: Morvath ve On Dört Haftalık Taht
        '🎶 "On dört hafta oldu Morvath tahtında,\nNe bir leke gördü kendi bahtında...\nÜç ağızlı kargı havada döner,\nNice kelleler düştü altından!\n\nAma her fırtınanın bir sonu vardır,\nKibrin sardığı yer daracık dardır...\nBir gün çıkagelir adsız bir nefer,\nO koca şampiyona dünyayı yıkar!"',

        // 3. Destan: Sazlık Cadısı ve Kara İksir
        '🎶 "Bataklık sisinde tek bir kulübe,\nYolu düşen döner sanki garibe...\nKazanında kaynar kurbağa zehri,\nŞifa verir amma benzer harabe!\n\nBir yudum içenler canını bulur,\nLakin ömründen bir koca yıl vurur...\nKaderini kılıcına bağlayan yiğit,\nO cadının önünde sessizce durur!"',

        // 4. Destan: Kırlangıç Kasabası'nın Kanlı Kumu
        '🎶 "Kırlangıç çayının suyu kan akar,\nTribünde beyler zevkine bakar...\nKöleler, mahkumlar, sürgün olanlar,\nKızgın kum üstünde canını yakar!\n\nTellalın borusu gökleri yarar,\nHerkes bu arenada şöhret arar...\nBiri yere düşer, biri dikilir,\nAkşama yalnız bir kadeh şarap sarar!"',

        // 5. Destan: Dağ Klanlarının Nacak Çığlığı
        '🎶 "Yüksek kayalıktan sürgün bir ana,\nThyra doymadı döktüğü kana...\nÇift ağızlı nacak indiği zaman,\nAcımaz ne ata ne can kardaşa!\n\nKurtlar ulurmuş dağın ardında,\nÖfkesi dinmez kendi yurdunda...\nKemik yaran çelik havaya kalksa,\nEcel diz çöker onun katında!"',

        // 6. Destan: Taş Hisar Muhafızı Althea
        '🎶 "Taş Hisar surları göğe uzanır,\nGranit taşları terle sulanır...\nKızıl Muhafız Althea meydanda,\nHer gladyatörü çırak sanır!\n\nKırbacı şaklar, kalkanı vurur,\nTalim etmeyen karşında kurur...\nÜç yetenek topu göğsünde parlar,\nOnunla çalışan dev gibi durur!"',

        // 7. Destan: Kadife Sığınağın Tütsülü Odaları
        '🎶 "Taş Hisar\'ın dibinde gizli bir konak,\nKadife perdeler, sıcak bir yatak...\nMadame Lysandra gülümser sana,\nLavanta suyuyla yarayı yıka!\n\nTütsüler tüterken dinlenir kemik,\nNe darbe kalır ne de bir çentik...\nSabaha çıkınca o kapılardan,\nGöğsünde fırtına, kolunda çelik!"',

        // 8. Destan: Çöl Rüzgarı ve Kör Khorvash
        '🎶 "Gözleri görmeyen o kör ihtiyar,\nTuz çöllerinden yadigâr rüzgar...\nKumun titreşimi kulağına gelir,\nHasmını görmeden canını alır!\n\nOltanın iğnesi havada döner,\nYıldızlar sönerken ömürler söner...\nKhorvash güler usulca der ki:\n\'Karanlık içinde her ışık söner!\'"',

        // 9. Destan: Demirci Vorn'un Kadim Çeliği
        '🎶 "Gece gündüz vurur çekiç örsüne,\nKader yazılır tersi düzüne...\nKözün alevinden doğar teberler,\nVorn bakmaz kimsenin boyun büküşüne!\n\nSu verir çeliğe yedi pınardan,\nKurtarır yiğidi ölümcül yardan...\nKuşan o kılıcı, zırhını takın,\nŞampiyonluk doğar bu kızıl kordan!"',

        // 10. Destan: Pranganın Ağırlığı
        '🎶 "Kürek mahkumuydu küf zindanında,\nÖlüm kol gezerdi her bir anında...\nGhorak kırdı o prangayı bir gün,\nDemir gülle kaldı hemen yanında!\n\nŞimdi savurur o ağır bağı,\nEzilip geçer hasmın dimağı...\nZincir dolanırsa bir kez boynuna,\nKabrini kazar arenanın toprağı!"',

        // 11. Destan: Zarların Laneti ve Han Gecesi
        '🎶 "Gece yarısı çöker Kırlangıç Hanı,\nMasada yitirir sarhoşlar canı...\nFıçı dibi görmüş körpe çıraklar,\nZarlar yuvarlar döker fermanı!\n\nKimi altın sayar kimi dertlenir,\nKiminin zırhı borca rehinir...\nOzan çalar sazı usul bir dille:\n\'Bu hana giren ecelden dirilir!\'"',

        // 12. Destan: Kör Nişancı Kaelen'in Kirişi
        '🎶 "Gözünde kara bez, elinde yay var,\nAdımların sesini nefeste duyar...\nMekanik kundak çıt ettiği an,\nZırhını delerek kalbine koyar!\n\nKaçışın yoktur o kara oktan,\nNasibini alırsın ecelden, yoktan...\nArenanın tozu sustuğu vakit,\nKaelen gülümser ezelden çoktan!"',

        // 13. Destan: Yedi Taşın Gizemi
        '🎶 "Yakut ateş saçar, safir korurmuş,\nZümrüt can verirken canı bulurmuş...\nAmetist çalarken hasmın kanını,\nObsidyen vurup aklı durdururmuş!\n\nOpal deler geçer en ağır zırhı,\nTopaz süratle savurur hırsı...\nYedi taşı yuvasına kakarsan,\nÖnünde diz çöker diyarın kırkı!"',

        // 14. Destan: Sazlık Mezbaha Palası
        '🎶 "Sazlık mezbahadan sürgün bir kasap,\nBregash kimseden sormaz bir hesap...\nTers tutar palayı aşağı bakar,\nEti kemikten ayırır bin bir azap!\n\nGözünde merhamet arama boşa,\nAlışkın kan dökmeye dağa ve taşa...\nArenaya çıkıp palayı çekse,\nAcımaz ne krala ne de bir başa!"',

        // 15. Destan: Kum Akrebi Sarkoth'un Zehri
        '🎶 "Çöl kumunun altında yatar pusuya,\nBenzer zehri en acı suya...\nSarkoth çeker iki kemik kamayı,\nHasmı dalar sonsuz bir uykuya!\n\nSıyrılır hamleden rüzgar misali,\nGörülmedi onun gibisinin hali...\nKıvrımlı çeliğin battığı yerde,\nKalmaz dövüşçünün derman mecali!"',

        // 16. Destan: Çifte Nakavtın Sessizliği
        '🎶 "İki dev vuruştu şafak vaktinde,\nİnat vardı ikisinin de ahtında...\nBiri kargı vurdu, biri balyozu,\nİkisi de devrildi kumun tahtında!\n\nTribünler sustu, tellal bağırdı,\nHakemler arenaya doktor çağırdı...\nNe mağlup kaldı ne de bir galip,\nKader ikisine de toprağı kardı!"',

        // 17. Destan: Kadim Şampiyonların Hayaleti
        '🎶 "Kırlangıç çukurunda yüz yıllık iz var,\nToprağın altında nice yiğit yatar...\nİlk şampiyonun kırık kılıcı,\nEski surların dibinde batar!\n\nGece çöktüğünde kumlardan sesler,\nKılıç şakırtısı, soluk nefesler...\nOzan Miras dinler o fısıltıyı,\nDestan olur dilden dile hevesler!"',

        // 18. Destan: Kanatlı Teberin Dansı
        '🎶 "Uzun saplı teber döner havada,\nNe zırh dayanır ne kalkan ovada...\nKanatlı ucuyla biçer safları,\nKurt gibi avlanır kuytu yuvada!\n\nKancası takılır rakip boynuna,\nÇeker hasmını kara koynuna...\nTeber kuşanmış bir deli yiğit,\nSon verir bu kanlı dünya oyununa!"',

        // 19. Destan: Şafak Yıldızının Gazabı
        '🎶 "Dikenli çelik gürz iner semadan,\nHaber getirir kara beladan...\nŞafak yıldızı çarptığı zaman,\nFeryat yükselir cümle odadan!\n\nMiğferler bükülür, kemikler çatlar,\nYıkılır atlar, dağılır hatlar...\nKaba kuvvetin hükümdarlığı,\nBu demir tokmakla cana can katar!"',

        // 20. Destan: Silahşörün Yolu ve Diyarın Kaderi
        '🎶 "Sürgün geldin ama başın eğilmez,\nBu diyarda senin dengin bilinmez...\nKılıcın hakkıyla aldın her canı,\nKumda yazılan adın silinmez!\n\nKırlangıç Kasabası sana dar gelir,\nTaş Hisar ufukta yolu gösterir...\nYürü bre evlat, arkana bakma,\nDiyarın kaderi senin elindedir!"'
    ]
}

export const StarterContent = {
  crackedClub,
  clothWrap,
  rottenVest,
  frayedGloves,
  raggedPants,
  wornSandals,
  woodenBuckler,
  boneAmulet,
  brassRing,
  healingSalve,
  mountainHerb,
  ancientScroll,
  SEALED_SCROLL_DRAGON,
  SEALED_SCROLL_CRANE,
  SEALED_SCROLL_STORM,
  SEALED_SCROLL_NIGHT,
  SEALED_SCROLL_TIGER,
  SEALED_SCROLL_MOUNTAIN,
  getAllSealedScrolls,
  getScrollSkillMapping,
  getSealedScrollById,
  DecipherLore,
  getDecipherLore,
  getRoomTierInfo,
  createInitialRooms,
  createHouseExclusiveRooms,
  createInitialEnemies,
  createInitialRegion,
  createAllStarterGems,
  createRegion2Weapons,
  createRegion2ArmorerEquipment,
  createRegion2TailorEquipment,
  createRegion2BowyerEquipment,
  createRegion2WandEquipment,
  createRegion2RingAndSealEquipment,
  createRegion2LeatherworkerEquipment,
  createRegion2Spears,
  createRegion2Daggers,
  createRegion2AlchemistConsumables,
  createRegion2,
  createAllQuests,
  createInitialQuests,
  MAT_WHITE_WOLF_PELT,
  MAT_METEORITE_ORE,
  MAT_TROLL_HIDE,
  MAT_OBSIDIAN_CORE,
  createInitialAdventures,
  createCraftingRecipes,
  getAllEnemyWeaknesses,
  createTavernTales,
  createBardSongs,
  createEpicBardSongs,
};
