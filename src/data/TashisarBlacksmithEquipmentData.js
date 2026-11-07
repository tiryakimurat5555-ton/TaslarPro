import { AccessoryCategory, ArmorCategory, Equipment, EquipmentSlot, EquipmentSpecialTrait, ItemRarity, Stats, WeaponCategory } from '../domain/model.js';
import { TashisarBlacksmithAxesAndMacesData } from './TashisarBlacksmithAxesAndMacesData.js';
import { TashisarBlacksmithSpearsAndDaggersData } from './TashisarBlacksmithSpearsAndDaggersData.js';

/**
 * 2. Bölüm (Taş Hisar) Demircisi Silahçı Torvald için 150 Adet Egzotik Ekipman:
 * - 50 Adet Kılıç (WeaponCategory.SWORD)
 * - 50 Adet Kalkan (AccessoryCategory.SHIELD)
 * - 50 Adet Miğfer (ArmorCategory.HELMET)
 * Seviyeler: 20 - 39 Arası
 * Fiyatlar: 500 - 12.000 Altın Arası
 * Her ekipmanda özgün ve egzotik özel nitelikler (specialTrait) ve taş soketleri bulunmaktadır.
 */
export const TashisarBlacksmithEquipmentData = {

  createSwords() {
    return [
        new Equipment({
            id: 'eq_tash_sword_20',
            name: 'Kuzey Garnizonu Geniş Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 26, speed: 3, critChancePercent: 8, maxHealth: 25}),
            requiredLevel: 20,
            valueInGold: 650,
            description: 'Taş Hisar kıdemli piyadeleri için dövülmüş, dengeli ve çift kan oluklu sağlam çelik kılıç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_1',
                name: 'Çift Yivli Çelik',
                description: 'Kılıcın çift kan oluğu hasmın savunmasını sarsar; kritik vuruş şansını +%8 artırır.',
                icon: '🗡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_21',
            name: 'Sınır Muhafızı Ağır Palası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 28, armor: 3, blockChancePercent: 6}),
            requiredLevel: 21,
            valueInGold: 800,
            description: 'Dağ yollarındaki pusularda kullanılan, geniş namlusuyla darbeleri karşılayan ağır kavisli pala.',
            weaponType: 'pala',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_2',
                name: 'Pala Ağırlığı',
                description: 'Geniş namlu blok yapmayı kolaylaştırır ve karşı saldırılarda +5 ezici hasar ekler.',
                icon: '⚔️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_22',
            name: 'Fırtına Sırtı Süvari Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 30, speed: 5, dodgeChancePercent: 7}),
            requiredLevel: 22,
            valueInGold: 1000,
            description: 'Sarp kayalıklarda devriye gezen süvarilerin esnek, rüzgar gibi vınlayan hafif çelik kılıcı.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_3',
                name: 'Rüzgar Savuruşu',
                description: 'Hızlı atılımlarda rüzgar gibi hızlanır; sıyrılma şansını +%7 yükseltir.',
                icon: '💨'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_24',
            name: 'Kızıl Nehir Biley Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 33, critChancePercent: 10, maxHealth: 30}),
            requiredLevel: 24,
            valueInGold: 1350,
            description: 'Kızıl nehrin demir çökeltili sularında tavlanmış, açtığı yaraları derinleştiren ölümcül kesici kılıç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_4',
                name: 'Kanayan Çelik',
                description: 'Bilenmiş namlu temas ettiği yaraları açar; her vuruşta rakipte sızlayan kanama bırakır.',
                icon: '🩸'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_25',
            name: 'Obsidyen Kakmalı Gece Palası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 36, critChancePercent: 12, speed: 4}),
            requiredLevel: 25,
            valueInGold: 1750,
            description: 'Volkanik obsidyen parçalarının çelik namluya lazer gibi kakılmasıyla yapılmış, jilet keskinliğinde gece silahı.',
            weaponType: 'pala',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_5',
                name: 'Volkan Camı Keskinliği',
                description: 'Volkanik obsidyen keskinliği rakip zırhının %20\'sini hiçe sayarak eti yarar.',
                icon: '🌋'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_27',
            name: 'Safir Yaldızlı Şövalye Meçi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 39, armor: 5, blockChancePercent: 8, speed: 3}),
            requiredLevel: 27,
            valueInGold: 2300,
            description: 'Kraliyet muhafız şövalyelerinin taşıdığı, safir işlemeli kabzasıyla büyüleyici bir asalet ve sağlamlık sunan meç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_6',
                name: 'Soğukkanlı Düello',
                description: 'Asil şövalye disiplini dövüşçünün savunmasını pekiştirir ve karşı hamleleri güçlendirir.',
                icon: '💎'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_29',
            name: 'Kızıl Lal Taşı Hançer-Kılıç',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 43, critChancePercent: 14, speed: 6}),
            requiredLevel: 29,
            valueInGold: 3100,
            description: 'Uzak doğu diyarlarından gelen lal taşı cevheriyle dövülmüş melez kılıç. Hasmın kanından güç çeker.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_7',
                name: 'Kızıl Damar Çekişi',
                description: 'Kabzadaki lal taşı hasmın kanından beslenir; verilen hasarın %10\'unu can olarak sağaltır.',
                icon: '🩸'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_30',
            name: 'Zümrüt Zehir Akıtan Kıvrık Şemşir',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 46, speed: 5, critChancePercent: 15}),
            requiredLevel: 30,
            valueInGold: 3900,
            description: 'Gövdesinde zehir kanalları bulunan kıvrık kavisli çöl şemşiri. Hasmın etine zümrüt rengi engerek zehri zerk eder.',
            weaponType: 'şemşir',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_8',
                name: 'Engerek Salgısı',
                description: 'Şemşirin oluğundan sızan zümrüt zehri her vuruşta rakibin etini yakar ve yavaşlatır.',
                icon: '🐍'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_32',
            name: 'Güneş Işıltılı Şafak Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 50, maxHealth: 60, armor: 6}),
            requiredLevel: 32,
            valueInGold: 4800,
            description: 'Dağ zirvesindeki ilk şafak ışığında kutsanan altın kakmalı kılıç. Arenada düşmanın gözlerini alarak dengesini bozar.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_9',
                name: 'Kör Edici Şafak',
                description: 'Güneş ışığını yansıtan çelik rakibin gözlerini kamaştırarak ilk hamlesini boşa düşürür.',
                icon: '☀️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_33',
            name: 'Gölge Çeliği Biçici Spatha',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 53, speed: 7, critChancePercent: 16, dodgeChancePercent: 9}),
            requiredLevel: 33,
            valueInGold: 5400,
            description: 'Yeraltı katakomplarında bulunan kadim gölge cevherinden yapılmış, ışığı emen mat siyah imparatorluk spathası.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_10',
                name: 'Hayalet Kesişi',
                description: 'Gölge madeninden dövülmüş namlu havayı sessizce yarar; rakip zırhının yarısını yok sayar.',
                icon: '👤'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_35',
            name: 'Kadim İmparatorluk Tören Kılıcı \'Aurelius\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 58, maxHealth: 90, armor: 8, speed: 4, critChancePercent: 18}),
            requiredLevel: 35,
            valueInGold: 7200,
            description: 'Eski imparator Aurelius\'un şeref muhafızlarına armağan ettiği, üstünde krallık mühürleri kazılı efsanevi çift elli kılıç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_11',
                name: 'Hükümdar Otoritesi',
                description: 'İmparatorluk lejyonlarının şanını taşır; kritik vuruşlarda arenayı titreten sarsıcı bir ek darbe indirir.',
                icon: '👑'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_sword_37',
            name: 'Yıldız Cevheri Kavisli Scimitar \'Süreyya\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 63, speed: 9, critChancePercent: 20, dodgeChancePercent: 12}),
            requiredLevel: 37,
            valueInGold: 8500,
            description: 'Kayan yıldızların kraterinden toplanan gümüşi kozmik tozlarla yoğrulmuş, gece göğü gibi pırıldayan efsanevi scimitar.',
            weaponType: 'scimitar',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_12',
                name: 'Kozmik Parıltı',
                description: 'Gökyüzünün yıldız tozlarıyla tavlanmış pala; saldırılarda +15 kozmik ışık hasarı verir.',
                icon: '✨'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_sword_39',
            name: 'Ebedi Sürgün Şampiyonu Kılıcı \'Kader Kıran\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 70, maxHealth: 120, armor: 10, speed: 8, critChancePercent: 22}),
            requiredLevel: 39,
            valueInGold: 10000,
            description: 'Torvald\'ın hayatı boyunca dövdüğü en yüce şaheser. Kaderin zincirlerini parçalayan, diyara hükmedecek silahşorun kılıcı.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_13',
                name: 'Kaderin Mührü',
                description: 'Diyarın kaderini mühürleyen efsanevi başyapıt; can %30 altındayken hasarı %35 katlar ve zırhları un ufak eder.',
                icon: '⚜️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_01',
            name: 'Buzul Muhafızı Çengelli Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 25, speed: 2, armor: 2, blockChancePercent: 5}),
            requiredLevel: 20,
            valueInGold: 580,
            description: 'Kuzey geçitlerinde devriye gezen muhafızların kılıç kilitleyen çengelli demir kılıcı.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_1',
                name: 'Buzul Çengeli',
                description: 'Çengelli sırt hasmın kılıcını kilitler, karşı saldırı fırsatı verir.',
                icon: '❄️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_02',
            name: 'Taş Ocağı Usta Gladyusu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 27, speed: 4, critChancePercent: 7}),
            requiredLevel: 20,
            valueInGold: 670,
            description: 'Taş blokları yontulan ocakların çeliğinden dövülmüş, dar alan dövüşü için kusursuz kısa gladyus.',
            weaponType: 'gladyus',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_2',
                name: 'Granit Biley',
                description: 'Kısa ve ölümcül gövde dar alanlarda süratli vuruşlar sağlar.',
                icon: '⛏️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_03',
            name: 'Vadi Akıncısı Çift Ağızlı Palası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 29, speed: 3, critChancePercent: 8}),
            requiredLevel: 21,
            valueInGold: 750,
            description: 'Vadideki kervan yollarını koruyan süvarilerin iki tarafı da bilenmiş sert palası.',
            weaponType: 'pala',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_3',
                name: 'Çift Kenar Darbesi',
                description: 'İki yönlü biley savuruşlarda ardışık kesikler açar.',
                icon: '⚔️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_04',
            name: 'Kar Fırtınası Yarma Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 28, maxHealth: 25, armor: 3}),
            requiredLevel: 21,
            valueInGold: 820,
            description: 'Ağır tipi koşullarında donmayan çelikten yapılmış, kalkanları yarmak için ağırlık merkezi önde dövülen kılıç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_4',
                name: 'Ayaz Savunması',
                description: 'Soğuk dağ çeliği darbeleri karşılarken dayanıklılık sunar.',
                icon: '🌨️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_05',
            name: 'Hisar Kapısı Muhafız Bastardı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 31, armor: 4, maxHealth: 30}),
            requiredLevel: 22,
            valueInGold: 950,
            description: 'Kapı muhafızlarının tek ya da çift elle savurduğu, geniş balçaklı ağır çelik bastard kılıç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_5',
                name: 'Bastard Dengesi',
                description: 'Tek ya da çift elle tutulabilen ağır balçak savunmayı güçlendirir.',
                icon: '🛡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_06',
            name: 'Bozkır Kartalı Süvari Meçi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 30, speed: 5, critChancePercent: 9}),
            requiredLevel: 22,
            valueInGold: 1050,
            description: 'Rüzgarda ıslık çalan ince namlusuyla kartal süzülüşünü andıran çevik hücum meçi.',
            weaponType: 'meç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_6',
                name: 'Kartal Pençesi',
                description: 'Hızlı hücum hamlelerinde rakibin zırh boşluklarını bularak delip geçer.',
                icon: '🦅'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_07',
            name: 'Granit Kesici Ağır Spatha',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 32, maxHealth: 35, blockChancePercent: 6}),
            requiredLevel: 23,
            valueInGold: 1150,
            description: 'Granit madenlerinde çalışan köleleri denetleyen yüzbaşıların ezici darbeli lejyoner spathası.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_7',
                name: 'Taş Kıran Namlu',
                description: 'Ağır ucu zırhlı hedefleri sarsarak dengelerini alt üst eder.',
                icon: '🪨'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_08',
            name: 'Tunç Namlulu Çöl Şemşiri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 33, speed: 4, critChancePercent: 9}),
            requiredLevel: 23,
            valueInGold: 1250,
            description: 'Güneye inen kervanların getirdiği tunç alaşımlı, havayı ıslıkla yaran zarif kıvrık şemşir.',
            weaponType: 'şemşir',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_8',
                name: 'Samyeli Kavisliği',
                description: 'Kıvrık namlu savruldukça hız kazanarak hasmı şaşırtır.',
                icon: '🌪️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_09',
            name: 'Ayaz Isırığı Geniş Enli Pala',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 34, speed: 3, critChancePercent: 10}),
            requiredLevel: 24,
            valueInGold: 1400,
            description: 'Derin dağ yarıklarında donmuş çelikten yapılmış, vurduğu yerde buz gibi sızlayan yaralar açan pala.',
            weaponType: 'pala',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_9',
                name: 'Keskin Buz Dişi',
                description: 'Geniş ağzı derin yarıklar açarak hasmın kan kaybetmesini hızlandırır.',
                icon: '🧊'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_10',
            name: 'Dağ Aslanı Dişi Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 35, speed: 4, maxHealth: 30}),
            requiredLevel: 24,
            valueInGold: 1500,
            description: 'Kabzasında dağ aslanının çene kemiği oyulmuş, vahşi pençe darbelerini andıran saldırgan kılıç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_10',
                name: 'Yırtıcı Kavis',
                description: 'Aslan pençesini andıran kavis hasmın dengesini bozar.',
                icon: '🦁'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_11',
            name: 'Akik Kakmalı Lejyoner Gladyusu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 36, armor: 5, speed: 3, critChancePercent: 10}),
            requiredLevel: 25,
            valueInGold: 1680,
            description: 'Nizamlı lejyon birliklerinin subayları için kızıl akik taşlarıyla süslenmiş sağlam piyade gladyusu.',
            weaponType: 'gladyus',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_11',
                name: 'Lejyon Disiplini',
                description: 'Nizamlı vuruşlarla her darbede dengeli ve sağlam hasar indirir.',
                icon: '🔴'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_12',
            name: 'Sisli Geçit Kavisli Palası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 37, dodgeChancePercent: 8, speed: 5}),
            requiredLevel: 25,
            valueInGold: 1820,
            description: 'Sisli boğazlarda pusu kuran dağ gerillalarının taşıdığı, ani dönüşlere elverişli esnek pala.',
            weaponType: 'pala',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_12',
                name: 'Sis Gölgeleri',
                description: 'Puslu vadilerde gizlenen savaşçının görünmez atılımını sağlar.',
                icon: '🌫️'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_13',
            name: 'Sönmüş Yanardağ Bazalt Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 38, maxHealth: 40, armor: 4}),
            requiredLevel: 26,
            valueInGold: 1980,
            description: 'Eski kraterlerin soğumuş lav taşından ve sertleştirilmiş çelikten üretilen ağır savaş kılıcı.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_13',
                name: 'Bazalt Yoğunluğu',
                description: 'Ağır volkanik kaya alaşımı savruldukça yıkıcı kütle gücü üretir.',
                icon: '🌋'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_14',
            name: 'Şimşek Damarlı Düello Meçi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 38, speed: 6, critChancePercent: 12}),
            requiredLevel: 26,
            valueInGold: 2150,
            description: 'Gök gürültülü fırtınada yıldırım düşen çelik çubuktan dövülmüş, titreşen elektrikli meç.',
            weaponType: 'meç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_14',
                name: 'Yıldırım Atılımı',
                description: 'Kusursuz delme süratiyle rakip tepki veremeden eti yarar.',
                icon: '⚡'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_15',
            name: 'Kuzey Yıldızı Saf Çelik Spathası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 40, armor: 5, speed: 4}),
            requiredLevel: 27,
            valueInGold: 2350,
            description: 'Gümüş rengi parıldayan saf demir filizlerinden dövülmüş, dengesi kusursuz süvari spathası.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_15',
                name: 'Kutup Kılavuzu',
                description: 'Kuzey çeliğinin berraklığı savaşçının konsantrasyonunu ve zırhını pekiştirir.',
                icon: '⭐'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_16',
            name: 'Zümrüt Kakmalı Akıncı Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 41, critChancePercent: 13, speed: 5}),
            requiredLevel: 27,
            valueInGold: 2500,
            description: 'Kabzasında zümrüt gözler parıldayan, hızlı akınlarda hasmın gözünü kamaştıran süslü kılıç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_16',
                name: 'Zümrüt Parıltısı',
                description: 'Darbeler hasmın gözünü alır, savunma direncini sarsar.',
                icon: '❇️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_17',
            name: 'Gök Gürültüsü Yarık Bıçağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 42, maxHealth: 45, blockChancePercent: 7}),
            requiredLevel: 28,
            valueInGold: 2750,
            description: 'Namlusundaki hava delikleri savrulurken gök gürlemesine benzer yankılar çıkaran ağır kılıç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_17',
                name: 'Gök Yankısı',
                description: 'Metal metale vurduğunda çıkan gürleme hasmı afallatır.',
                icon: '🌩️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_18',
            name: 'Ejder Pulu Süslemeli Bastard',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 43, armor: 6, critChancePercent: 12}),
            requiredLevel: 28,
            valueInGold: 2950,
            description: 'Kabzasına sert ejder pulları sarılmış, elden kaymayan ve sarsıntıları emen usta kılıcı.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_18',
                name: 'Ejder Pulu Dayanımı',
                description: 'Kabzada ejder derisi kaplama terlemeyi önler, vuruşları pekiştirir.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_19',
            name: 'Dağ Ruhu Ayaz Falçatası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 44, speed: 6, critChancePercent: 14}),
            requiredLevel: 29,
            valueInGold: 3200,
            description: 'İç bükey eğrisiyle kalkan arkasındaki boyunları avlayan kadim dağ falçatası.',
            weaponType: 'falçata',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_19',
                name: 'Ayaz Oyması',
                description: 'Kavisli iç ağız hasmın zırh eklemlerini kavrayarak biçer.',
                icon: '🏔️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_20',
            name: 'Alacakaranlık Çeliği Uzun Kılıç',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 45, maxHealth: 50, dodgeChancePercent: 7}),
            requiredLevel: 29,
            valueInGold: 3450,
            description: 'Gölge madenlerinin yüzey tortularından yapılmış, ışık yansıtmayan mat ve sinsi uzun kılıç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_20',
                name: 'Alacakaranlık Örtüsü',
                description: 'Işığı büken koyu gri namlu saldırı açısını gizler.',
                icon: '🌒'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_21',
            name: 'Kor Ateş Şemşiri \'Semender\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 47, speed: 5, critChancePercent: 15}),
            requiredLevel: 30,
            valueInGold: 3800,
            description: 'Demircinin kor ateşinde yedi gün bekletilip kızgın yağda soğutulmuş, alev desenli kavisli şemşir.',
            weaponType: 'şemşir',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_21',
                name: 'Semender Közü',
                description: 'Kılıcın kızgın ucu etle buluştuğunda dağlayıcı kor yanıklar açar.',
                icon: '🦎'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_22',
            name: 'Sarp Kaya Muhafızı Ağır Meçi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 48, armor: 7, maxHealth: 55}),
            requiredLevel: 30,
            valueInGold: 4100,
            description: 'Granit kalelerin kıdemli şövalyelerine mahsus, hem delen hem de kalkan gibi darbeleri karşılayan meç.',
            weaponType: 'meç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_22',
                name: 'Kaya Muhkemliği',
                description: 'Usta düellocunun dengeli duruşu hasarı yumuşatır.',
                icon: '🗿'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_23',
            name: 'Zehirli Akrep İğnesi Falçata',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 49, speed: 7, critChancePercent: 15}),
            requiredLevel: 31,
            valueInGold: 4450,
            description: 'Ucu ölümcül bir çengel gibi kıvrılmış, zırhların eklem yerlerine nüfuz eden zehirli falçata.',
            weaponType: 'falçata',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_23',
                name: 'Akrep İğnesi Kavisliği',
                description: 'Kavisli ucu kalkanın arkasına dolanarak sırtı hedefler.',
                icon: '🦂'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_24',
            name: 'Kristal Namlulu Buzul Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 50, critChancePercent: 16, armor: 5}),
            requiredLevel: 31,
            valueInGold: 4750,
            description: 'Dağ buzullarının altından çıkarılan şeffaf kaya kristaliyle güçlendirilmiş pırıl pırıl kılıç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_24',
                name: 'Şeffaf Keskinlik',
                description: 'Dağ kristalinden bilenmiş namlu keskinliğini asla yitirmez.',
                icon: '🔮'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_25',
            name: 'Kudretli Şövalye Başbuğ Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 51, maxHealth: 65, armor: 7, blockChancePercent: 8}),
            requiredLevel: 32,
            valueInGold: 5100,
            description: 'Ordu komutanlarının sancak altında taşıdığı, altın kakmalı ağır kabzalı lider kılıcı.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_25',
                name: 'Başbuğ Fermanı',
                description: 'Dövüş meydanında asalet rüzgarı estirerek savunmayı perçinler.',
                icon: '🎖️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_26',
            name: 'Rün Kazınmış Obsidyen Gladyus',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 52, critChancePercent: 16, speed: 5}),
            requiredLevel: 32,
            valueInGold: 5400,
            description: 'Obsidyen yüzeyine kadim korunma rünleri oyulmuş, jilet inceliğinde darbeler indiren gladyus.',
            weaponType: 'gladyus',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_26',
                name: 'Kadim Rün Yırttığı',
                description: 'Obsidyen üzerine işlenen rünler zırh direncini eritir.',
                icon: '🪓'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_27',
            name: 'Girdap Yaran Çift Başlı Pala',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 55, speed: 7, critChancePercent: 17}),
            requiredLevel: 34,
            valueInGold: 6100,
            description: 'İki yönlü hilal eğrisiyle dönerek saldıran savaşçılara rüzgar fırtınası gibi güç katan efsanevi pala.',
            weaponType: 'pala',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_27',
                name: 'Girdap Burgacı',
                description: 'Havadaki savrulma burgacı gelen kılıçları yana iter.',
                icon: '🌀'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_28',
            name: 'Güneş Tutulması Koyu Çelik Kılıç',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 56, armor: 8, maxHealth: 70}),
            requiredLevel: 34,
            valueInGold: 6500,
            description: 'Tam güneş tutulması sırasında tavlanan koyu bronz çelikten yapılmış, mistik bir ağırlığa sahip kılıç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_28',
                name: 'Tutulma Karartısı',
                description: 'Güneşin saklandığı anda dövülen namlu karanlık kudret saçar.',
                icon: '🌑'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_29',
            name: 'Sonsuz Şafak Altın Spathası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 59, speed: 6, critChancePercent: 18, maxHealth: 80}),
            requiredLevel: 35,
            valueInGold: 7300,
            description: 'Güneş tapınağının rahipleri tarafından altın tozuyla vaftiz edilmiş, ışık saçan usta kılıcı.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_29',
                name: 'Altın Şafak',
                description: 'Güneş ışığını çeliğe hapseden kutsal metal; her darbede şevk verir.',
                icon: '🌅'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_30',
            name: 'Hayalet Süvari Ruh Biçici Meç',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 60, speed: 8, dodgeChancePercent: 10}),
            requiredLevel: 35,
            valueInGold: 7600,
            description: 'Terk edilmiş dağ hisarlarında dolaşan hayalet şövalyelerin mezarlarından çıkarılan tekinsiz meç.',
            weaponType: 'meç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_30',
                name: 'Ruhani Biçiş',
                description: 'Gölge süvarilerinin meçi et yerine hasmın iradesini keser.',
                icon: '👻'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_31',
            name: 'Kızıl Ay Yakarış Palası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 61, critChancePercent: 19, maxHealth: 85}),
            requiredLevel: 36,
            valueInGold: 7950,
            description: 'Kızıl dolunayın ışığında bilenmiş, havadaki nemi bile buharlaştıran ölümcül kavisli pala.',
            weaponType: 'pala',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_31',
                name: 'Ayın Kan Çekimi',
                description: 'Kızıl ay gecelerinde bilenmiş pala yaralardan güç toplar.',
                icon: '🌙'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_32',
            name: 'Titanyum Alaşımlı Garnizon Katili',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 62, armor: 9, blockChancePercent: 9}),
            requiredLevel: 36,
            valueInGold: 8300,
            description: 'Dağın en derin madenlerinden çıkarılan titanyum filiziyle dövülmüş, asla kırılmayan dev savaş kılıcı.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_32',
                name: 'Titanyum Sertliği',
                description: 'Ezilmez alaşım karşı silahların çeliğini zedeler.',
                icon: '⚙️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_33',
            name: 'Yedi İklim Hükümdar Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 64, maxHealth: 100, armor: 9, speed: 5}),
            requiredLevel: 37,
            valueInGold: 8750,
            description: 'Yedi kadim krallığın elçilerinin getirdiği madenlerin tek bir potada eritilmesiyle dövülmüş şaheser.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_33',
                name: 'İklimler Hükmü',
                description: 'Yedi farklı diyarın cevherinden yoğrulmuş krallık kılıcı.',
                icon: '🗺️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_34',
            name: 'Samanyolu Işıltılı Şemşir',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 65, speed: 9, critChancePercent: 20}),
            requiredLevel: 37,
            valueInGold: 9150,
            description: 'Göktaşlarının içindeki elmas tozlarıyla parlatılmış, savruldukça arkasında yıldız izi bırakan şemşir.',
            weaponType: 'şemşir',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_34',
                name: 'Yıldız Şeridi',
                description: 'Samanyolu\'nun puslu parıltısıyla ardışık kesikler açar.',
                icon: '🌌'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_35',
            name: 'Kıyamet Habercisi Alev Kılıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 67, critChancePercent: 21, speed: 7}),
            requiredLevel: 38,
            valueInGold: 9600,
            description: 'Yerkürenin magmasında dövülmüş, namlusu asla soğumayan ve temasta ateşe veren kadim kılıç.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_35',
                name: 'Kıyamet Közü',
                description: 'Yeraltı magma fırınında dövülmüş alevli namlu yaraları yakar.',
                icon: '🔥'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_36',
            name: 'Kadim Başbuğ Tören Meçi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 68, armor: 10, maxHealth: 110, blockChancePercent: 10}),
            requiredLevel: 38,
            valueInGold: 10100,
            description: 'İlk hisar komutanının mezarından çıkarılan, çeliği zamanın yıpratmasına meydan okuyan efsanevi meç.',
            weaponType: 'meç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_36',
                name: 'Ebedi Nizam',
                description: 'Savaş meydanında asla bükülmeyen efsanevi tören çeliği.',
                icon: '🛡️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_sword_ext_37',
            name: 'Tanrılar Katı Yıldız Çeliği Spathası \'Gök Yaran\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 72, speed: 9, critChancePercent: 23, maxHealth: 130, armor: 10}),
            requiredLevel: 39,
            valueInGold: 11500,
            description: 'Efsanelere göre göğü ikiye bölen şimşeklerin donmuş çeliğinden yontulmuş, zırhları kağıt gibi kesen nihai spatha.',
            weaponType: 'kılıç',
            weaponCategory: WeaponCategory.SWORD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sw_ext_37',
                name: 'Gök Yarığı',
                description: 'Gökyüzünü ikiye yaran ilahi kılıç; kritik vuruşta hasmın savunmasını paramparça eder.',
                icon: '⚡'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        })
    ];
  },

  createShields() {
    return [
        new Equipment({
            id: 'eq_tash_shield_20',
            name: 'Taş Hisar Perçinli Yuvarlak Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 14, blockChancePercent: 15, maxHealth: 30}),
            requiredLevel: 20,
            valueInGold: 520,
            description: 'Kalın dağ meşesinin dövme demir çemberle sarıldığı, hisar garnizonunun klasik ve güvenilir piyade kalkanı.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_1',
                name: 'Sert Meşe Direnci',
                description: 'Kalın dağ meşesi ve perçinli çember; gelen hafif saldırıların sarsıntısını tamamen yutar.',
                icon: '🛡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_21',
            name: 'Nöbetçi Çelik Damla Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 16, blockChancePercent: 16, maxHealth: 40}),
            requiredLevel: 21,
            valueInGold: 720,
            description: 'Gövdeyi ve bacakları örten damla biçimli nizam kalkanı. Ok ve mızrak saplamalarını ustalıkla kaydırır.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_2',
                name: 'Siper Kavisliği',
                description: 'Aşağıya doğru daralan damla formu bacaklara inen kılıç hamlelerini güvenle saptırır.',
                icon: '💧'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_23',
            name: 'Granit Kaplama Kule Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 19, blockChancePercent: 18, maxHealth: 55, speed: -1}),
            requiredLevel: 23,
            valueInGold: 1100,
            description: 'Yüzeyine ince granit taş plakalar perçinlenmiş dev kule kalkan. Arkasına saklanan savaşçıyı adeta bir sura çevirir.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_3',
                name: 'Granit Surları',
                description: 'Dağ taşlarıyla kaplanmış dev siper; blok yapıldığında alınan hasarı %45 oranında keser.',
                icon: '🧱'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_24',
            name: 'Dikenli Bronz Garnizon Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 18, blockChancePercent: 17, damage: 6}),
            requiredLevel: 24,
            valueInGold: 1280,
            description: 'Merkezinde masif bir bronz mahmuz barındıran saldırgan kalkan. Savunma anında hasmın burnunu kırar.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_4',
                name: 'Çivili Karşı Hamle',
                description: 'Kalkanın merkezindeki pirinç diken hasmın göğsüne sertçe vurarak karşı hasar verir.',
                icon: '🪡'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_26',
            name: 'Karakol Şelale Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 22, blockChancePercent: 20, maxHealth: 70}),
            requiredLevel: 26,
            valueInGold: 1950,
            description: 'Buzul şelalelerinin altındaki dip çökeltilerinde tavlanmış, dalgalı çelik yüzeyiyle darbeleri yanlara sektiren nadide kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_5',
                name: 'Akıntı Yutumu',
                description: 'Dağ sularında tavlanmış dalgalı yüzey darbeleri yanlara akıtarak hasmın dengesini bozar.',
                icon: '🌊'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_28',
            name: 'Dövme Çelik Ejder Dişi Siperi',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 25, blockChancePercent: 22, maxHealth: 85, damage: 8}),
            requiredLevel: 28,
            valueInGold: 2700,
            description: 'Kenarlarına çelikten dökülmüş ejderha dişleri dizilmiş heybetli kalkan. Rakibin kılıcını kıskaca alır.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_6',
                name: 'Dişli Siper',
                description: 'Kenarlarındaki ejderha dişleri hasmın silahını yakalayıp savurmasını engeller.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_29',
            name: 'Gök Taşı Perçinli Ağır Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 28, blockChancePercent: 24, maxHealth: 100}),
            requiredLevel: 29,
            valueInGold: 3250,
            description: 'Kraterden çıkarılan kadim göktaşı perçinleriyle donatılmış, kinetik darbeleri kızıl kor kıvılcımlarla yutan kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_7',
                name: 'Krater Yankısı',
                description: 'Göktaşı perçinleri ağır darbeleri emip kızıl bir şok dalgasıyla hasma geri püskürtür.',
                icon: '☄️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_31',
            name: 'Kemik Oymalı Kadim Klan Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 31, blockChancePercent: 26, maxHealth: 120, dodgeChancePercent: 5}),
            requiredLevel: 31,
            valueInGold: 4300,
            description: 'Dağ klanlarının mamut kaburgalarından oyup rünlerle bezediği kutsal siper. Manevi dayanıklılık ve can verir.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_8',
                name: 'Atalar Muhafazası',
                description: 'Bozkır şamanlarının kutsadığı mamut kemiği siper; dövüşçüye yüksek can ve manevi koruma bahşeder.',
                icon: '🦴'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_33',
            name: 'Alev Geçirmez Magma Siperi',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 35, blockChancePercent: 28, maxHealth: 140}),
            requiredLevel: 33,
            valueInGold: 5500,
            description: 'Volkanın magma damarları üzerinde dövülmüş, kor ateşi dahi yutabilen efsanevi siyah-kızıl plaka kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_9',
                name: 'Ateş Kabuğu',
                description: 'Volkanik lav damarlarıyla dövülmüş kalkan; kritik vuruşların sarsıntısını ve yakıcı hasarları söndürür.',
                icon: '🔥'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_35',
            name: 'Aegis Yıldız Kabuğu Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 40, blockChancePercent: 30, maxHealth: 170, damage: 10}),
            requiredLevel: 35,
            valueInGold: 7100,
            description: 'Kozmik cevherlerle parıldayan ayna yüzeyli kutsal kalkan. Gelen darbeleri doğrudan saldırgana geri yansıtır.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_10',
                name: 'Kusursuz Yansıtma',
                description: 'Kozmik alaşımlı ayna yüzey; bloklandığında gelen darbenin %30\'unu doğrudan hasmın göğsüne yansıtır.',
                icon: '🌌'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_shield_37',
            name: 'Kadim Leviathan Kaburga Siperi',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 45, blockChancePercent: 33, maxHealth: 200}),
            requiredLevel: 37,
            valueInGold: 8600,
            description: 'Derin denizlerin efsanevi Leviathan\'ının taşlaşmış kaburgasından oyulmuş dev kalkan. Taşıyıcısını yenilmez bir kayaya çevirir.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_11',
                name: 'Derinlik Zırhı',
                description: 'Uçsuz bucaksız okyanus canavarının kemiklerinden yontulmuş dev kalkan; dövüşçüyü yıkılmaz bir kaleye çevirir.',
                icon: '🐋'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_shield_39',
            name: 'Diyarın Sönmeyen Kor Kalkanı \'Sur-ı Kebir\'',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 52, blockChancePercent: 36, maxHealth: 250, damage: 14}),
            requiredLevel: 39,
            valueInGold: 9900,
            description: 'Diyarın başkentini yüzyıllardır koruyan demir kapıların öz çeliğinden dövülmüş efsanevi nihai siper.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_12',
                name: 'Yıkılmaz Başkent Surları',
                description: 'Efsanevi kale kapılarının demirinden dövülmüş nihai kalkan; hasarın yarısını emer ve kırılmaz bir koruma sağlar.',
                icon: '🏰'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_01',
            name: 'Dağ Keçisi Boynuzlu Buckler',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 13, blockChancePercent: 14, speed: 2}),
            requiredLevel: 20,
            valueInGold: 500,
            description: 'Kenarlarına dağ keçisi boynuzları perçinlenmiş, çevik savuşturmalara uygun hafif ve sağlam küçük kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_1',
                name: 'Boynuzlu Savuşturma',
                description: 'Boynuzlu kavis hasmın kılıcını yana sektirip hız kazandırır.',
                icon: '🐐'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_02',
            name: 'Çift Katmanlı Ceviz Piyade Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 15, blockChancePercent: 15, maxHealth: 35}),
            requiredLevel: 20,
            valueInGold: 590,
            description: 'Sert dağ cevizinden çift kat preslenmiş, demir kuşaklı dayanıklı garnizon piyade kalkanı.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_2',
                name: 'Ceviz Dayanımı',
                description: 'Ağır ahşap gövde ok darbelerini ve mızrak itmelerini yutar.',
                icon: '🪵'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_03',
            name: 'Sınır Gözcüsü Çelik Siperliği',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 16, blockChancePercent: 16, maxHealth: 42}),
            requiredLevel: 21,
            valueInGold: 680,
            description: 'Gözcü kulelerindeki nöbetçilerin kılıç darbelerine karşı kollarını saran üçgen çelik siperlik.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_3',
                name: 'Üçgen Açı',
                description: 'Üçgen formu gelen doğrudan kılıç darbelerini kaydırıp savuşturur.',
                icon: '📐'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_04',
            name: 'Ayaz Çeliği Oval Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 17, blockChancePercent: 16, maxHealth: 45}),
            requiredLevel: 21,
            valueInGold: 780,
            description: 'Kuzeyin soğuk çeliğinden dövülmüş oval biçimli, göğsü ve omuzları kusursuz örten nizam kalkanı.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_4',
                name: 'Soğuk Tavlı Plaka',
                description: 'Buz gibi çelik yüzey darbelerde bükülmeden direnç gösterir.',
                icon: '❄️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_05',
            name: 'Garnizon Süvari Küçük Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 17, blockChancePercent: 17, speed: 2}),
            requiredLevel: 22,
            valueInGold: 890,
            description: 'At üzerinde kılıç savuran süvarilerin sol kola bağladığı, hareket kabiliyetini kısıtlamayan çelik kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_5',
                name: 'Süvari Esnekliği',
                description: 'Kola oturan kavis savuruş hızını kesmeden koruma sağlar.',
                icon: '🏇'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_06',
            name: 'Dövme Demir Geçit Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 18, blockChancePercent: 17, maxHealth: 50}),
            requiredLevel: 22,
            valueInGold: 980,
            description: 'Hisarın dar geçitlerinde omuz omuza duran muhafızların kilitlenen nizam kalkanı.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_6',
                name: 'Kenetlenen Çeper',
                description: 'Yan yana durulduğunda geçit vermeyen bir demir duvar örer.',
                icon: '🔗'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_07',
            name: 'Madenci Ağır Siperliği',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 19, blockChancePercent: 18, maxHealth: 58}),
            requiredLevel: 23,
            valueInGold: 1120,
            description: 'Kaya çökmesine karşı maden ustalarının kullandığı, kalın demir destekli devasa siper.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_7',
                name: 'Kaya Muhafazası',
                description: 'Yukarıdan inen ezici darbeleri göğse ulaşmadan sönümler.',
                icon: '⛏️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_08',
            name: 'Nehir Muhafızı Balık Pulu Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 19, blockChancePercent: 18, dodgeChancePercent: 5}),
            requiredLevel: 23,
            valueInGold: 1200,
            description: 'Çelik pulların balık derisi gibi üst üste dizilmesiyle yapılmış, mızrakları kaydıran hafif kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_8',
                name: 'Puslu Pul Kayması',
                description: 'Üst üste binen pullar delici uçları kaydırarak etkisizleştirir.',
                icon: '🐟'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_09',
            name: 'Rüzgar Yaran Çelik Damla Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 20, blockChancePercent: 18, speed: 1, maxHealth: 60}),
            requiredLevel: 24,
            valueInGold: 1320,
            description: 'Hızlı atılımlarda rüzgar direncini azaltan aerodinamik damla kalkan. Süvari hücumlarına dayanır.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_9',
                name: 'Rüzgar Damlası',
                description: 'Aerodinamik kavis savrulma hızını artırırken bacakları korur.',
                icon: '💧'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_10',
            name: 'Kızıl Kaya Çivili Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 20, blockChancePercent: 18, damage: 7}),
            requiredLevel: 24,
            valueInGold: 1420,
            description: 'Kızıl taş ocaklarından çıkarılan sert kaya mahmuzuyla donatılmış, blok yaparken karşı saldırı vuran kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_10',
                name: 'Kızıl Mahmuz',
                description: 'Kalkan vuruşunda hasmın çenesine inen sert mahmuz hasar verir.',
                icon: '🔴'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_11',
            name: 'Bronz Aslan Başlı Tören Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 21, blockChancePercent: 19, maxHealth: 68, damage: 6}),
            requiredLevel: 25,
            valueInGold: 1650,
            description: 'Merkezinde kabartma bronz bir aslan başı bulunan, heybetiyle düşmana korku salan şövalye kalkanı.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_11',
                name: 'Aslan Kükremesi',
                description: 'Bronz aslan kabartması blok anında sarsıcı bir metal çınlaması yapar.',
                icon: '🦁'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_12',
            name: 'Kar Siperi Ağır Pavis',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 22, blockChancePercent: 20, maxHealth: 75, speed: -1}),
            requiredLevel: 25,
            valueInGold: 1800,
            description: 'Kuşatmalarda yere saplanarak arkasına okçuları alan, kalın çelik destekli ağır pavis kalkanı.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_12',
                name: 'Saplanan Pavis',
                description: 'Zemine saplanan siper düşmanın tüm menzilli ve yakın hücumunu durdurur.',
                icon: '🏔️'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_13',
            name: 'Çift Kanatlı Çelik Siper',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 23, blockChancePercent: 20, maxHealth: 78}),
            requiredLevel: 26,
            valueInGold: 2050,
            description: 'İki yana doğru açılan kanat formundaki çelik plakalarıyla vücudu saran ergonomik savunma kalkanı.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_13',
                name: 'Kanat Koruması',
                description: 'Yanlara genişleyen kavis arkadan ve yandan gelen hamleleri engeller.',
                icon: '🪽'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_14',
            name: 'Volkanik Bazalt Levha Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 24, blockChancePercent: 21, maxHealth: 82}),
            requiredLevel: 26,
            valueInGold: 2250,
            description: 'Volkanik bazalt levhalarının demir iskelete perçinlenmesiyle üretilmiş ateşe ve darbeye bağışık kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_14',
                name: 'Lav Kalkanı',
                description: 'Volkanik tabaka kızgın alevleri ve balta darbelerini yutar.',
                icon: '🌋'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_15',
            name: 'Safir Göbekli Şövalye Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 25, blockChancePercent: 21, maxHealth: 88, damage: 7}),
            requiredLevel: 27,
            valueInGold: 2450,
            description: 'Kraliyet muhafızlarının safir taşlarla bezeli, hem asil hem de kırılmaz göbekli çelik kalkanı.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_15',
                name: 'Safir Odak',
                description: 'Ortadaki safir darbenin enerjisini emerek savaşçının dengesini korur.',
                icon: '💎'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_16',
            name: 'Hisar Kapısı Masif Meşe Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 26, blockChancePercent: 22, maxHealth: 92}),
            requiredLevel: 27,
            valueInGold: 2600,
            description: 'Yüz yıllık hisar kapılarının masif meşesinden yontulup çelik şeritlerle sarılmış tarihi kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_16',
                name: 'Kadim Kapı Ahşabı',
                description: 'Yüzyıllık meşe lifleri kılıç kesiklerine karşı adeta demir gibi direnir.',
                icon: '🚪'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_17',
            name: 'Zümrüt Yılan Kabuğu Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 27, blockChancePercent: 23, dodgeChancePercent: 6}),
            requiredLevel: 28,
            valueInGold: 2850,
            description: 'Yeşil yılan pulları gibi katmanlanmış hafif alaşımıyla savuşturmaları kolaylaştıran zarif kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_17',
                name: 'Yılan Kıvraklığı',
                description: 'Darbeler kalkanın yüzeyinde kayarak dövüşçünün sıyrılmasını kolaylaştırır.',
                icon: '🐍'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_18',
            name: 'Dağ Kurdu Oymalı Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 27, blockChancePercent: 23, maxHealth: 95, damage: 8}),
            requiredLevel: 28,
            valueInGold: 3050,
            description: 'Bozkır kurtlarının dişleriyle çevrelenmiş, savunmadan anında saldırıya geçebilen yırtıcı kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_18',
                name: 'Kurt Isırığı',
                description: 'Blok anında kurt dişleri hasmın silahını kapıp karşı darbe indirir.',
                icon: '🐺'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_19',
            name: 'Kızıl Akik İşlemeli Damla Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 29, blockChancePercent: 24, maxHealth: 105}),
            requiredLevel: 29,
            valueInGold: 3400,
            description: 'Kızıl akik madenleriyle süslenmiş, kan dolaşımını canlandırarak savaşçıya kuvvet veren damla kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_19',
                name: 'Akik Nabzı',
                description: 'Kızıl cevher savaşçının direncini pekiştirerek yorgunluğu öteler.',
                icon: '🩸'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_20',
            name: 'Kuşatma Yaran Ağır Pavese',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 30, blockChancePercent: 25, maxHealth: 110, speed: -1}),
            requiredLevel: 29,
            valueInGold: 3600,
            description: 'Kuşatma merdivenlerine tırmanan lejyonerlerin başlarını koruyan kalın dövme demir siper.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_20',
                name: 'Siper Başlığı',
                description: 'Yukarıdan atılan kızgın zift ve taşlara karşı tam koruma sağlar.',
                icon: '🛡️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_21',
            name: 'Şafak Parıltılı Güneş Siperi',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 31, blockChancePercent: 25, maxHealth: 115}),
            requiredLevel: 30,
            valueInGold: 4000,
            description: 'Güneş ışığını ayna gibi yansıtan parlatılmış çelik yüzeyiyle düşmanın gözünü alan kutsal siper.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_21',
                name: 'Ayna Parıltısı',
                description: 'Blok yapıldığında hasmın gözünü alarak takip eden hamlesini boşa düşürür.',
                icon: '☀️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_22',
            name: 'Obsidyen Aynalı Savunma Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 32, blockChancePercent: 26, damage: 9}),
            requiredLevel: 30,
            valueInGold: 4250,
            description: 'Merkezinde jilet keskinliğinde obsidyen ayna taşıyan, büyü ve kılıç darbelerini yutan karanlık kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_22',
                name: 'Kara Ayna Emimi',
                description: 'Gelen büyülü ve fiziksel hasarın bir kısmını karanlık aynaya hapseder.',
                icon: '🪞'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_23',
            name: 'Fırtına Rünü Oyulmuş Çelik Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 33, blockChancePercent: 26, maxHealth: 125}),
            requiredLevel: 31,
            valueInGold: 4600,
            description: 'Kadim fırtına rünleriyle mühürlenmiş, her darbede gök gürlemesini andıran titreşimler yayan kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_23',
                name: 'Fırtına Rezonansı',
                description: 'Bloklanan darbeler kalkanın yüzeyinde dağılıp elektrikli bir şok üretir.',
                icon: '⚡'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_24',
            name: 'Akrep Kabuğu Zırh Siperi',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 34, blockChancePercent: 27, maxHealth: 130}),
            requiredLevel: 31,
            valueInGold: 4900,
            description: 'Dev çöl akrebinin taşlaşmış sırt kabuğundan yontulmuş, zırh delen oklara geçit vermeyen siper.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_24',
                name: 'Akrep Kitini',
                description: 'Kırılmaz kitin tabakası delici mızrak uçlarını dahi parçalar.',
                icon: '🦂'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_25',
            name: 'Çöl Başbuğu Altın Levha Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 35, blockChancePercent: 27, maxHealth: 135}),
            requiredLevel: 32,
            valueInGold: 5250,
            description: 'Kum fırtınalarına göğüs geren kum hanlarının altın yaldızlı, kalın çelikten mamul heybetli kalkanı.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_25',
                name: 'Han Sancağı Koruması',
                description: 'Heybetli altın çelik kalkan taşıyıcısına sarsılmaz bir metanet verir.',
                icon: '👑'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_26',
            name: 'Titanyum Kenarlı Darbe Emici',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 36, blockChancePercent: 28, maxHealth: 145}),
            requiredLevel: 32,
            valueInGold: 5600,
            description: 'Kenarları titanyum çemberle güçlendirilmiş, balta ve gürz vuruşlarının kinetik enerjisini sıfırlayan kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_26',
                name: 'Kinetik Sönümleme',
                description: 'Titanyum çerçeve en ağır gürz vuruşlarının darbe dalgasını yutar.',
                icon: '⚙️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_27',
            name: 'Kraliyet Lejyoneri Kule Siperi',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 38, blockChancePercent: 29, maxHealth: 155}),
            requiredLevel: 34,
            valueInGold: 6300,
            description: 'İmparatorluk muhafız alaylarının taşıdığı, omuzdan topuğa kadar kesintisiz çelikten oluşan kule kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_27',
                name: 'Kule Muhkemliği',
                description: 'Tam vücut koruması sağlayarak kritik vuruşların zararını yarıya indirir.',
                icon: '🏰'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_28',
            name: 'Ay Işığı Gümüşi Damla Kalkan',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 39, blockChancePercent: 29, dodgeChancePercent: 8}),
            requiredLevel: 34,
            valueInGold: 6700,
            description: 'Gümüş cevheriyle kaplanmış ay biçimli kavisli siper. Gece dövüşlerinde hayalet gibi süzülmeyi sağlar.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_28',
                name: 'Gümüş Yakamoz',
                description: 'Ay ışığını toplayan pürüzsüz gümüş yüzey darbeleri yanlara akıtır.',
                icon: '🌙'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_29',
            name: 'Ruh Koruyucu Kadim Mezar Siperi',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 41, blockChancePercent: 30, maxHealth: 175}),
            requiredLevel: 35,
            valueInGold: 7400,
            description: 'Kadim kralların lahit kapaklarından esinlenilerek dövülen, taşıyıcısına ebedi dirayet veren siper.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_29',
                name: 'Lahit Zırhı',
                description: 'Kadim lahit taşları gibi kırılmaz; alınan ölümcül darbeleri göğüste eritir.',
                icon: '⚰️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_30',
            name: 'Gök Gürültüsü Bronz Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 42, blockChancePercent: 31, damage: 11}),
            requiredLevel: 35,
            valueInGold: 7750,
            description: 'Dövme bronz göbeğinde yıldırımların gücünü saklayan, blok anında gök gürlemesiyle hasma çarpan kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_30',
                name: 'Bronz Çarpışması',
                description: 'Blok anında hasmın silahına sert bir şok dalgası fırlatır.',
                icon: '🌩️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_31',
            name: 'Kızıl Ejder Kalp Kabuğu Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 43, blockChancePercent: 32, maxHealth: 185}),
            requiredLevel: 36,
            valueInGold: 8100,
            description: 'Eski çağlarda avlanan kızıl ejderhanın göğüs kemiğinden oyulmuş, ısı ve darbeye bağışık efsanevi siper.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_31',
                name: 'Ejder Kalbi Siperi',
                description: 'Ejder kemiği ateş ve ezici darbeleri emerek dövüşçünün canını tazeler.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_32',
            name: 'Çelik Girdap Kavisli Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 44, blockChancePercent: 32, speed: 3}),
            requiredLevel: 36,
            valueInGold: 8450,
            description: 'Yüzeyinde spiral biçimli yivler açılmış, gelen kılıçları burgaç gibi çevirip yönünü saptıran kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_32',
                name: 'Spiral Girdap',
                description: 'Gelen tüm savuruşları spiral kanallarla dışarı doğru savurur.',
                icon: '🌪️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_33',
            name: 'Yıldız Işıltılı Gece Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 46, blockChancePercent: 33, maxHealth: 210}),
            requiredLevel: 37,
            valueInGold: 8900,
            description: 'Kozmik meteorit tozlarıyla yoğrulmuş gece göğü renginde plaka kalkan. Darbelerde yıldız kıvılcımları saçar.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_33',
                name: 'Gece Göğü Kalkanı',
                description: 'Kozmik karanlık yüzey darbeleri absorbe ederek dövüşçüyü korur.',
                icon: '🌌'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_34',
            name: 'Kuzey Şampiyonu Dev Savaş Pavesi',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 47, blockChancePercent: 34, maxHealth: 220, speed: -1}),
            requiredLevel: 37,
            valueInGold: 9300,
            description: 'Buzul arenalarının şampiyon gladyatörleri için dövülmüş, arkasında tüm bir birliği saklayabilecek dev pavese.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_34',
                name: 'Şampiyon Duvarı',
                description: 'Arenanın en sert kılıç ve balta yağmurlarını dahi bir sur gibi durdurur.',
                icon: '🛡️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_35',
            name: 'Titan Omurgası Efsanevi Siper',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 49, blockChancePercent: 35, maxHealth: 235, damage: 12}),
            requiredLevel: 38,
            valueInGold: 9750,
            description: 'Dağları sırtında taşıyan titanların omurgasından ilham alan, her darbede sağlamlaşan çelik siper.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_35',
                name: 'Titan Omurgası',
                description: 'Her blokta kalkanın perçinleri daha da sıkılaşarak zırh değerini artırır.',
                icon: '🗿'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_36',
            name: 'Sonsuz Barikat Demir Kule Kalkanı',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 50, blockChancePercent: 35, maxHealth: 245}),
            requiredLevel: 38,
            valueInGold: 10200,
            description: 'Taş Hisar\'ın en eski sur kapılarının demirinden oyulmuş, kuşatma koçbaşlarını dahi durduran kule kalkanı.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_36',
                name: 'Sonsuz Barikat',
                description: 'Gelen darbelerin kinetik enerjisini tamamen sıfırlayan yıkılmaz bir barikat.',
                icon: '🧱'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_37',
            name: 'Tanrıların Aynası Kozmik Siper \'Olimpos\'',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 53, blockChancePercent: 37, maxHealth: 260, damage: 15}),
            requiredLevel: 39,
            valueInGold: 11200,
            description: 'Gök kubbenin aynasından dökülmüş, evrenin enerjisini toplayan ve düşman darbelerini tanrısal bir güçle püskürten kalkan.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_37',
                name: 'İlahi Yansıma',
                description: 'Blok anında hasmın saldırı gücünü doğrudan göğsüne geri çarpar.',
                icon: '🪞'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_shield_ext_38',
            name: 'Yıkılmaz Hisar Baş Siperi \'Burç-ı Azam\'',
            slot: EquipmentSlot.SHIELD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 55, blockChancePercent: 38, maxHealth: 280, damage: 16}),
            requiredLevel: 39,
            valueInGold: 11800,
            description: 'Taş Hisar\'ın en yüksek burcunun temeline konan efsanevi demir kalkan. Taş, çelik ve ateş ona boyun eğer.',
            weaponType: 'kalkan',
            accessoryCategory: AccessoryCategory.SHIELD,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sh_ext_38',
                name: 'Azam Burcu',
                description: 'Tüm diyarın en sağlam kalkanı; sahibini mutlak bir hisara çevirir.',
                icon: '🏯'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        })
    ];
  },

  createHelmets() {
    return [
        new Equipment({
            id: 'eq_tash_helm_20_1',
            name: 'Taş Hisar Piyade Çelik Miğferi',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 12, maxHealth: 25}),
            requiredLevel: 20,
            valueInGold: 520,
            description: 'Garnizon piyadeleri için dövülmüş, kafatası kubbesi perçinli sağlam çelik miğfer.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_1',
                name: 'Kubbe Direnci',
                description: 'Perçinli kubbe tepeden inen kılıç darbelerini yanlara kaydırır.',
                icon: '🪖'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_20_2',
            name: 'Nöbetçi Yanaklıklı Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 13, maxHealth: 28, blockChancePercent: 4}),
            requiredLevel: 20,
            valueInGold: 600,
            description: 'Geniş demir yanaklıklarıyla çene ve boynu koruyan nizam miğferi.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_2',
                name: 'Yanak Koruması',
                description: 'Demir plakalar çeneye inen yan darbeleri güvenle engeller.',
                icon: '🛡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_20_3',
            name: 'Dağ Devriyesi Burunluklu Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 12, speed: 2, critChancePercent: 5}),
            requiredLevel: 20,
            valueInGold: 640,
            description: 'Sivri burunluğuyla yüzü korurken geniş göz aralığıyla çevre kontrolü sağlayan devriye kaskı.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_3',
                name: 'Gözcü Görüşü',
                description: 'Geniş vizör açıklığı düşman hareketlerini erkenden sezdirir.',
                icon: '👁️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_21_1',
            name: 'Garnizon Demir Sallet',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 14, maxHealth: 32}),
            requiredLevel: 21,
            valueInGold: 720,
            description: 'Enseyi boydan boya örten kuyruklu yapısıyla ok darbelerine karşı siper olan klasik sallet miğferi.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_4',
                name: 'Ense Siperliği',
                description: 'Kavisli kuyruk arkadan gelen ok ve mızrak temaslarını sektirir.',
                icon: '🪖'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_21_2',
            name: 'Sınır Akıncısı Süvari Miğferi',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 14, speed: 3, dodgeChancePercent: 5}),
            requiredLevel: 21,
            valueInGold: 790,
            description: 'Rüzgar direncini kesen aerodinamik çelik tepeliğiyle at sırtında hücum eden akıncıların miğferi.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_5',
                name: 'Akıncı Rüzgarı',
                description: 'Hafifletilmiş dövme çelik başı ağırlaştırmadan korur.',
                icon: '💨'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_21_3',
            name: 'Çift Boynuzlu Dövme Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 15, damage: 4, maxHealth: 30}),
            requiredLevel: 21,
            valueInGold: 850,
            description: 'Alnında demir dağ keçisi boynuzları yükselen, kafa kafaya vuruşmalarda hasmı sersemleten miğfer.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_6',
                name: 'Koç Başı Vuruşu',
                description: 'Alındaki boynuzlar yakın dövüşte kafa vuruşlarına ezici güç katar.',
                icon: '🐏'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_22_1',
            name: 'Çelik Barbuta Siperliği',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 16, maxHealth: 38}),
            requiredLevel: 22,
            valueInGold: 950,
            description: 'Yunan tarzı T-biçimli dar göz aralığıyla yüzü neredeyse tamamen örten asil çelik barbuta.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_7',
                name: 'Dar Vizör Güvenliği',
                description: 'T biçimli açıklık kılıç uçlarının göze girmesini bütünüyle önler.',
                icon: '🛡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_22_2',
            name: 'Hisar Kapısı Ağır Bascinet',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 17, maxHealth: 42, blockChancePercent: 5}),
            requiredLevel: 22,
            valueInGold: 1020,
            description: 'Sivri konik tepesiyle balta savuruşlarını kaydıran, zincir gerdanlıklı sağlam bascinet.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_8',
                name: 'Konik Kubbe',
                description: 'Sivri tepe dik inen balta darbelerinin kuvvetini yanlara boşaltır.',
                icon: '🪖'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_22_3',
            name: 'Kartal Kanadı Süslemeli Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 16, critChancePercent: 7, speed: 2}),
            requiredLevel: 22,
            valueInGold: 1100,
            description: 'Şakaklarında bronz kartal kanatları açılan, süvari komutanlarına yakışır ihtişamlı miğfer.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_9',
                name: 'Kartal Süzülüşü',
                description: 'Kanatlı tasarım savaşçının maneviyatını ve hücum şevkini yükseltir.',
                icon: '🦅'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_23_1',
            name: 'Maden Ocağı Perçinli Miğferi',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 18, maxHealth: 48}),
            requiredLevel: 23,
            valueInGold: 1180,
            description: 'Kaya kırıcıların kullandığı, iki kat kalınlaştırılmış demir şeritlerle sarılı sarsılmaz madenci kaskı.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_10',
                name: 'Masif Katman',
                description: 'Çift kat çelik şerit kafaya inen gürz darbelerinin sarsıntısını emer.',
                icon: '⛏️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_23_2',
            name: 'Nehir Muhafızı Çelik Çan Başlık',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 18, speed: 3, maxHealth: 45}),
            requiredLevel: 23,
            valueInGold: 1260,
            description: 'Geniş çelik siperliğiyle omuzlara inen darbeleri karşılayan çan formunda garnizon miğferi.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_11',
                name: 'Çan Koruması',
                description: 'Geniş kenarlıklar boyun ve omuz köklerini kılıç kesiklerinden korur.',
                icon: '🔔'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_23_3',
            name: 'Granit Kaplı Yarma Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 19, maxHealth: 52, blockChancePercent: 5}),
            requiredLevel: 23,
            valueInGold: 1340,
            description: 'Çelik kubbesi granit pul tabakasıyla kaplanmış, sur gediklerinde dövüşen öncülerin miğferi.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_12',
                name: 'Taş Ten',
                description: 'Granit pullar kesici kılıç ağızlarını körelterek hasarı azaltır.',
                icon: '🪨'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_24_1',
            name: 'Kar Fırtınası Siperlikli Sallet',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 20, maxHealth: 58}),
            requiredLevel: 24,
            valueInGold: 1420,
            description: 'Hareketli vizörüyle yüzü dondurucu ayazdan ve ok yağmurundan koruyan nizam sallet\'i.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_13',
                name: 'Menteşeli Siper',
                description: 'Aşağı indirilen menteşeli vizör kafayı tam bir çelik kaleye dönüştürür.',
                icon: '❄️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_24_2',
            name: 'Dikenli Bronz Gladyatör Miğferi',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 20, damage: 6, critChancePercent: 7}),
            requiredLevel: 24,
            valueInGold: 1510,
            description: 'Tepesinde pirinç dikenler yükselen, arena dövüşlerinde hasmı korkutan saldırgan miğfer.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_14',
                name: 'Dikenli Taç',
                description: 'Yakın boğuşmalarda hasmın yüzüne batan dikenler kanama açar.',
                icon: '🦔'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_24_3',
            name: 'Ayaz Geçit Çelik Kask',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 21, maxHealth: 60, speed: 2}),
            requiredLevel: 24,
            valueInGold: 1600,
            description: 'Geçit bekçilerinin karlı rüzgarlarda taktığı, içi kürk astarlı sağlam dövme demir kask.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_15',
                name: 'Kürk Yalıtımı',
                description: 'Sıcak tutan iç astar savaşçının reflekslerini donmaktan korur.',
                icon: '🏔️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_25_1',
            name: 'Lejyoner Tüy Sorguçlu Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 22, maxHealth: 65, critChancePercent: 8}),
            requiredLevel: 25,
            valueInGold: 1750,
            description: 'Tepesinde kızıl at kılından sorguç dalgalanan, lejyon yüzbaşılarının asil savaş miğferi.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_16',
                name: 'Yüzbaşı Heybeti',
                description: 'Kızıl sorguç savaş meydanında yoldaşlara cesaret, hasma korku verir.',
                icon: '🪶'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_25_2',
            name: 'Obsidyen Yanaklıklı Gece Miğferi',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 23, speed: 4, critChancePercent: 9}),
            requiredLevel: 25,
            valueInGold: 1880,
            description: 'Yanaklıkları siyah volkanik camla kaplanmış, gece operasyonlarında ışık yansıtmayan sinsi miğfer.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_17',
                name: 'Gölge Maskesi',
                description: 'Mat yüzeyi sayesinde karanlıkta hedeflenmeyi neredeyse imkansız kılar.',
                icon: '🌑'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_25_3',
            name: 'Kurt Başı Bronz Kask',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 23, damage: 7, maxHealth: 65}),
            requiredLevel: 25,
            valueInGold: 1990,
            description: 'Bir bozkır kurdunun kafasını andıran çeneli bronz vizörüyle arenayı titreten vahşi kask.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_18',
                name: 'Bozkır Uluması',
                description: 'Kurt çenesi vizörü kapandığında dövüşçüye yırtıcı bir cesaret aşılar.',
                icon: '🐺'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_26_1',
            name: 'Çift Kanatlı Şövalye Bascinet\'i',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 24, maxHealth: 72, blockChancePercent: 6}),
            requiredLevel: 26,
            valueInGold: 2150,
            description: 'Şakaklarından çelik kanatlar uzanan, köpek burnu vizörlü asil şövalye bascinet\'i.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_19',
                name: 'Köpek Burnu Vizör',
                description: 'İleriye doğru uzanan konik vizör gelen darbeleri doğrudan uzağa iter.',
                icon: '🪽'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_26_2',
            name: 'Volkan Külü Demir Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 25, maxHealth: 75, blockChancePercent: 6}),
            requiredLevel: 26,
            valueInGold: 2280,
            description: 'Volkanik küllerle soğutulmuş sertleştirilmiş demir plakalardan oluşan koyu renkli muhkem başlık.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_20',
                name: 'Kül Zırhı',
                description: 'Volkan külüyle sertleşen moleküller kesici çeliğe karşı yüksek direnç gösterir.',
                icon: '🌋'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_26_3',
            name: 'Şimşek Siperlikli Ağır Kask',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 25, speed: 4, critChancePercent: 10}),
            requiredLevel: 26,
            valueInGold: 2420,
            description: 'Vizör aralığı şimşek zikzakları şeklinde kesilmiş, elektrik mavisi çelikten mamul özel kask.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_21',
                name: 'Yıldırım Odağı',
                description: 'Zikzak vizör görüş açısını korurken göze inen darbeleri tamamen durdurur.',
                icon: '⚡'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_helm_27_1',
            name: 'Safir Kakmalı Asil Miğferi',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 26, maxHealth: 82, blockChancePercent: 7}),
            requiredLevel: 27,
            valueInGold: 2580,
            description: 'Alnında parlak bir kraliyet safiri yuvalanmış, şövalye yeminini simgeleyen parlak plaka miğfer.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_22',
                name: 'Mavi Safir Kalkanı',
                description: 'Safir cevheri zihni sakin tutarak panik anlarında soğukkanlılık sağlar.',
                icon: '💎'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_27_2',
            name: 'Hisar Muhafızı Kapalı Armet',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 27, maxHealth: 85}),
            requiredLevel: 27,
            valueInGold: 2720,
            description: 'Mafsallı çene plakalarıyla başı tamamen saran, en ağır çekiç darbelerine banamısın demeyen armet.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_23',
                name: 'Mafsallı Kilit',
                description: 'Çene ve ense kilitlenerek boynun geriye kırılmasını önler.',
                icon: '🔒'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_27_3',
            name: 'Dağ Kurdu Çelik Miğferi',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 27, damage: 8, critChancePercent: 11}),
            requiredLevel: 27,
            valueInGold: 2890,
            description: 'Kurt kulakları şeklinde çelik siperlikleri olan, avcılık ve gladyatörlükte nam salmış savaş başlığı.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_24',
                name: 'Kurt Kulakları',
                description: 'Çevredeki en hafif kılıç çekme seslerini dahi savaşçıya duyurur.',
                icon: '👂'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_28_1',
            name: 'Ejder Ağzı Ağır Çelik Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 28, maxHealth: 92, damage: 8}),
            requiredLevel: 28,
            valueInGold: 3050,
            description: 'Vizörü açılan bir ejderha ağzı gibi dişli tasarlanmış, korkutucu ve masif savaş miğferi.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_25',
                name: 'Ejderha Nefesi',
                description: 'Vizörden çıkan sıcak soluk hasmın yüzüne vurarak onu ürpertir.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_28_2',
            name: 'Tunç Gerdanlıklı Burç Miğferi',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 29, maxHealth: 96, blockChancePercent: 8}),
            requiredLevel: 28,
            valueInGold: 3250,
            description: 'Geniş tunç gerdanlığıyla omuz zırhına kenetlenen, boyun kopmalarını imkansız kılan hisar başlığı.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_26',
                name: 'Tunç Gerdanlık',
                description: 'Göğüs zırhıyla kenetlenen tunç boğazlık boynu kılıç hamlelerinden korur.',
                icon: '🛡️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_29_1',
            name: 'Kızıl Akik Gözlü Savaş Kaskı',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 30, maxHealth: 105, critChancePercent: 12}),
            requiredLevel: 29,
            valueInGold: 3500,
            description: 'Göz aralığında kızıl akik lensler yerleştirilmiş, kan kırmızısı bir bakışla düşmanı tartan kask.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_27',
                name: 'Akik Bakışı',
                description: 'Kızıl lensler düşmanın zayıf zırh çatlaklarını netleştirir.',
                icon: '🔴'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_29_2',
            name: 'Kuşatma Yaran Ağır Sallet',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 31, maxHealth: 110, blockChancePercent: 8}),
            requiredLevel: 29,
            valueInGold: 3750,
            description: 'Kale surlarına merdiven dayayan öncü birliklerin taktığı, kurşun dökümüne dayanıklı kalın sallet.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_28',
                name: 'Kuşatma Mukavemeti',
                description: 'Tepeden inen gülle ve taş parçalarını sıyırıp atan kalın alınlık.',
                icon: '🧱'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_30_1',
            name: 'Güneş Taçlı Altın Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 32, maxHealth: 118, damage: 9}),
            requiredLevel: 30,
            valueInGold: 4100,
            description: 'Tepesinde güneş ışınlarını andıran altın dişler yükselen, garnizonun en üst komuta miğferi.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_29',
                name: 'Güneş Halosu',
                description: 'Altın yansıma savaş meydanında başı parıldatarak morali en üstte tutar.',
                icon: '☀️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_30_2',
            name: 'Şafak Muhafızı Plaka Armet',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 33, maxHealth: 125, blockChancePercent: 8}),
            requiredLevel: 30,
            valueInGold: 4400,
            description: 'Şafak alacakaranlığında nöbet tutan kıdemli şövalyelerin çift kat kilitli ağır armet miğferi.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_30',
                name: 'Şafak Kilidi',
                description: 'Çift kilitli menteşeler en sert gürz vuruşunda dahi yerinden oynamaz.',
                icon: '🌅'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_31_1',
            name: 'Zümrüt Gözlü Engerek Miğferi',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 34, speed: 6, critChancePercent: 14}),
            requiredLevel: 31,
            valueInGold: 4750,
            description: 'Şakaklarına zümrüt yılan figürleri kakılmış, sinsi ve çevik gladyatörlerin tercih ettiği hafif çelik başlık.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_31',
                name: 'Engerek Refleksi',
                description: 'Hafif başlık kafa hareketlerini serbest bırakarak ani kaçış sağlar.',
                icon: '🐍'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_31_2',
            name: 'Buzul Rünlü Demir Bascinet',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 35, maxHealth: 135, blockChancePercent: 9}),
            requiredLevel: 31,
            valueInGold: 5100,
            description: 'Alnına eski dilde buzul rünleri kazınmış, beyni ve zihni serin tutarak yorulmayı engelleyen miğfer.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_32',
                name: 'Buzul Rünü',
                description: 'Soğuk rün enerjisi baş ağrısını ve sersemliği anında geçirir.',
                icon: '🧊'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_32_1',
            name: 'Başbuğ Kartal Sorguçlu Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 36, maxHealth: 145, damage: 10, critChancePercent: 13}),
            requiredLevel: 32,
            valueInGold: 5500,
            description: 'Dağ şahinlerinin kanat tüyleriyle bezenmiş, kabile başbuğlarının taşıdığı görkemli çelik miğfer.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_33',
                name: 'Başbuğ Kartalı',
                description: 'Başbuğ heybeti dövüşçünün kritik vuruş gücünü zirveye taşır.',
                icon: '🦅'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_32_2',
            name: 'Titanyum Plakalı Kuşatma Kaskı',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 37, maxHealth: 155, blockChancePercent: 10}),
            requiredLevel: 32,
            valueInGold: 5900,
            description: 'Alnına titanyum plaka perçinlenmiş, koçbaşı darbelerine kafa tutabilen deneysel hisar kaskı.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_34',
                name: 'Titanyum Alınlık',
                description: 'Titanyum alınlık doğrudan gelen çekiç vuruşlarını geri teptirir.',
                icon: '⚙️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_33_1',
            name: 'Gölge Madeni Vizörlü Armet',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 39, speed: 7, critChancePercent: 15, dodgeChancePercent: 7}),
            requiredLevel: 33,
            valueInGold: 6400,
            description: 'Yeraltı katakomplarındaki gölge madeninden yapılmış, kullanıcının yüzünü karanlık bir boşluğa çeviren kadim armet.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_35',
                name: 'Gölge Vizörü',
                description: 'Karanlık vizör hasmın göz temasını keserek hamle tahminini bozar.',
                icon: '👤'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_33_2',
            name: 'Magma Damarlı Kor Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 40, maxHealth: 165, damage: 11}),
            requiredLevel: 33,
            valueInGold: 6800,
            description: 'Volkan lavlarının üzerinde dövülmüş, yarıklarından kızıl kor alevler tüten efsanevi miğfer.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_36',
                name: 'Magma Nefesi',
                description: 'Miğferin havalandırma deliklerinden tüten kor sıcaklık hasmı geri püskürtür.',
                icon: '🔥'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_34_1',
            name: 'Ay Işığı Gümüş Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 41, maxHealth: 175, speed: 5, dodgeChancePercent: 8}),
            requiredLevel: 34,
            valueInGold: 7200,
            description: 'Gümüş cevheriyle yoğrulmuş, gece göğünün dolunay ışığını toplayıp parıldayan asil başlık.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_37',
                name: 'Gümüş Hale',
                description: 'Gümüş kaplama zırh büyülerini ve zihinsel sarsıntıları savuşturur.',
                icon: '🌙'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_34_2',
            name: 'Kraliyet Lejyoneri Kapalı Kask',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 42, maxHealth: 185, blockChancePercent: 11}),
            requiredLevel: 34,
            valueInGold: 7650,
            description: 'İmparatorun en seçkin saray muhafızları için dövülmüş, tek parça döküm çelikten kapalı kask.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_38',
                name: 'Saray Muhafazası',
                description: 'Eksiz döküm yapısı hiçbir eklem zayıflığı barındırmaz.',
                icon: '👑'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_helm_35_1',
            name: 'İmparatorluk Altın Kartal Miğferi \'Aurelius\'',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 44, maxHealth: 200, damage: 12, critChancePercent: 16}),
            requiredLevel: 35,
            valueInGold: 8100,
            description: 'İmparator Aurelius\'un kendi elleriyle başkomutanına taktığı, altın kartal heykelli efsanevi başyapıt.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_39',
                name: 'İmparatorluk Tacı',
                description: 'Kafaya takıldığında savaş meydanındaki tüm orduya cesaret ve kudret pompalar.',
                icon: '🦅'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_helm_35_2',
            name: 'Kozmik Kabuk Yıldız Miğferi',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 45, maxHealth: 210, speed: 6}),
            requiredLevel: 35,
            valueInGold: 8500,
            description: 'Düşen göktaşının sert kabuğundan oyulmuş, kafayı kozmik bir zırhla çevreleyen pırıl pırıl miğfer.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_40',
                name: 'Kozmik Zırh',
                description: 'Göktaşı kabuğu darbelerin fiziksel gücünü soğurup zararsız hale getirir.',
                icon: '🌌'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_helm_36_1',
            name: 'Kızıl Ejderha Miğferi \'Fafnir\'',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 46, maxHealth: 220, damage: 13, critChancePercent: 17}),
            requiredLevel: 36,
            valueInGold: 8950,
            description: 'Kadim ejderha Fafnir\'in kafatasından esinlenerek dövülmüş, göz deliklerinden duman tüten heybetli miğfer.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_41',
                name: 'Fafnir Gazabı',
                description: 'Göz yuvalarındaki kızıl kor parlaklık hasmın kalbine dehşet salar.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_helm_36_2',
            name: 'Titanyum Vizörlü Şampiyon Başlığı',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 47, maxHealth: 230, blockChancePercent: 12}),
            requiredLevel: 36,
            valueInGold: 9400,
            description: 'Titanyumdan preslenmiş kurşun geçirmez vizörüyle arenanın en kanlı maçlarını yöneten şampiyon başlığı.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_42',
                name: 'Kırılmaz Vizör',
                description: 'Doğrudan göze veya yüze inen hiçbir kılıç darbesi vizörü delemez.',
                icon: '🛡️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_helm_37_1',
            name: 'Kadim Başbuğ Boynuzlu Miğferi',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 49, maxHealth: 245, damage: 14}),
            requiredLevel: 37,
            valueInGold: 9850,
            description: 'Bozkır hanlarının bin yıldır korunan kutsal miğferi; dev bizon boynuzlarıyla göğü deler.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_43',
                name: 'Han Heybeti',
                description: 'Bizon boynuzları ve ağır çelik kubbe sahibini arenada bir dev gibi gösterir.',
                icon: '🦬'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_helm_37_2',
            name: 'Kuzey Hükümdarı Taçlı Armet',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 50, maxHealth: 255, blockChancePercent: 13}),
            requiredLevel: 37,
            valueInGold: 10300,
            description: 'Kuzeyin ebedi karlar altındaki krallığının hükümdarlarına mahsus, üstünde çelik bir taç yükselen armet.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_44',
                name: 'Kuzey Tacı',
                description: 'Asil çelik taç dövüşçünün savunma reflekslerini doruk noktasına taşır.',
                icon: '👑'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_helm_38_1',
            name: 'Titan Alnı Efsanevi Miğfer',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 52, maxHealth: 270, damage: 15}),
            requiredLevel: 38,
            valueInGold: 10750,
            description: 'Dağları omuzlayan antik titanların heykellerindeki alınlık formunda dökülmüş sarsılmaz başlık.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_45',
                name: 'Titan Sertliği',
                description: 'Kafaya inen balyoz vuruşlarını bile bir çakıl taşı gibi sektirir.',
                icon: '🗿'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_helm_38_2',
            name: 'Kıyamet Habercisi Kor Armet',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 53, maxHealth: 280, critChancePercent: 18}),
            requiredLevel: 38,
            valueInGold: 11200,
            description: 'Yeraltının ateş nehirlerinde dövülen, vizöründen cehennem alevleri fışkıran nihai savaş zırhı parçası.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_46',
                name: 'Cehennem Közü',
                description: 'Miğferin vizöründen sızan kor sıcaklık hasmın zırhını yakarak yumuşatır.',
                icon: '🔥'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_helm_39_1',
            name: 'Diyarın Şampiyonu Ebedi Taç-Miğfer \'Taç-ı Kebir\'',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 56, maxHealth: 300, damage: 16, critChancePercent: 20, blockChancePercent: 15}),
            requiredLevel: 39,
            valueInGold: 11800,
            description: 'Taş Hisar\'ın kurucusu büyük komutanın taktığı, çelik ve altından örülü efsanevi nihai taç-miğfer. Diyara hükmedenin başını korur.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_47',
                name: 'Kebir Hükmü',
                description: 'Tüm darbeleri asaletle göğüsler; can %30 altına indiğinde savunmayı ikiye katlar.',
                icon: '👑'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_helm_39_2',
            name: 'Tanrılar Katı Yıldız Başlığı \'Astra\'',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 57, maxHealth: 310, speed: 8, critChancePercent: 22, dodgeChancePercent: 12}),
            requiredLevel: 39,
            valueInGold: 12000,
            description: 'Gök kubbenin en parlak yıldızının kraterinden dökülmüş, evrenin bilgisini ve direncini taşıyan ilahi miğfer.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_48',
                name: 'Astra Işıltısı',
                description: 'Kozmik parıltı düşmanın vuruş açısını bozar, dövüşçüye mutlak bir zihin berraklığı verir.',
                icon: '✨'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_helm_37_3',
            name: 'Yıldız Tozu Kakmalı Şövalye Miğferi',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 48, speed: 6, critChancePercent: 16, maxHealth: 240}),
            requiredLevel: 37,
            valueInGold: 9900,
            description: 'Gece göğünün gümüşi yıldız tozlarıyla parlatılmış, süvari şövalyelerine yakışır muhteşem miğfer.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_49',
                name: 'Yıldız Tozu Yansıması',
                description: 'Yıldız tozu yüzeyi hasmın gözlerini kamaştırarak savuşturmayı kolaylaştırır.',
                icon: '⭐'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_helm_38_3',
            name: 'Sonsuz Gece Vizörlü Çelik Kask',
            slot: EquipmentSlot.HEAD,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 51, maxHealth: 265, dodgeChancePercent: 10, speed: 6}),
            requiredLevel: 38,
            valueInGold: 10900,
            description: 'Karanlık diyarın cevherleriyle dövülmüş, ışığı tamamen emerek gece savaşlarında mutlak üstünlük sağlayan kask.',
            armorCategory: ArmorCategory.HELMET,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_hl_50',
                name: 'Sonsuz Gece',
                description: 'Zifiri karanlık zırh kullanıcının kafasını hedef almayı imkansız kılar.',
                icon: '🌒'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        })
    ];
  },

  createAxes() {
    return TashisarBlacksmithAxesAndMacesData.createAxes();
  },

  createMaces() {
    return TashisarBlacksmithAxesAndMacesData.createMaces();
  },

  createSpears() {
    return TashisarBlacksmithSpearsAndDaggersData.createSpears();
  },

  createDaggers() {
    return TashisarBlacksmithSpearsAndDaggersData.createDaggers();
  },

  createAllBlacksmithEquipment() {
    return [...TashisarBlacksmithEquipmentData.createSwords(), ...TashisarBlacksmithEquipmentData.createAxes(), ...TashisarBlacksmithEquipmentData.createMaces(), ...TashisarBlacksmithEquipmentData.createShields(), ...TashisarBlacksmithEquipmentData.createHelmets()];
  },

};
