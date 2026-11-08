import { Equipment, EquipmentSlot, EquipmentSpecialTrait, ItemRarity, Stats, WeaponCategory } from '../domain/model.js';
import { TashisarBlacksmithEquipmentData } from './TashisarBlacksmithEquipmentData.js';
import { TashisarBlacksmithAxesAndMacesData } from './TashisarBlacksmithAxesAndMacesData.js';
import { TashisarBlacksmithSpearsAndDaggersData } from './TashisarBlacksmithSpearsAndDaggersData.js';

/**
 * 2. Bölüm (Taş Hisar) Demircisi ve Silah Ustası Torvald için Ekipman Verileri.
 * 5 Ana Kategori:
 * - 50 Kılıç (Swords)
 * - 50 Balta (Axes)
 * - 50 Gürz (Maces)
 * - 50 Kalkan (Shields)
 * - 50 Miğfer (Helmets)
 * Toplam 250 Adet Egzotik Ekipman.
 * (Mızraklar ve Hançerler ayrı uzman ustalar olan Valerius ve Corvus'a bağlanmıştır).
 */
export const TashisarBlacksmithWeaponsData = {

  createSwords() {
    return TashisarBlacksmithEquipmentData.createSwords();
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

  createShields() {
    return TashisarBlacksmithEquipmentData.createShields();
  },

  createHelmets() {
    return TashisarBlacksmithEquipmentData.createHelmets();
  },

  createAllBlacksmithEquipment() {
    return TashisarBlacksmithEquipmentData.createAllBlacksmithEquipment();
  },

  createExoticWeapons() {
    return TashisarBlacksmithEquipmentData.createAllBlacksmithEquipment();
  },
  /**
   * Geriye dönük uyumluluk için mızrak ve baltalar (13 Mızrak + 12 Balta = 25 Adet)
   */
  createLegacySpearsAndAxes() {
    return [
        new Equipment({
            id: 'eq_tash_spear_20',
            name: 'Burç Nöbetçisi Delici Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 27, speed: 2, armor: 2}),
            requiredLevel: 20,
            valueInGold: 620,
            description: 'Taş Hisar surlarında nöbet tutan askerlerin delici uzun kargısı. Mesafeyi lehine kullanır.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sp_1',
                name: 'Menzil Kilidi',
                description: 'Uzun sapı sayesinde hasmı yaklaşamadan karşılar; +12 zırh delme avantajı sunar.',
                icon: ''
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_spear_21',
            name: 'Kuzey Süvari Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 29, critChancePercent: 7, speed: 3}),
            requiredLevel: 21,
            valueInGold: 780,
            description: 'Hücum esnasında delip geçmek üzere sivriltilmiş üçgen temrenli hafif süvari kargısı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sp_2',
                name: 'Hücum Temreni',
                description: 'Üçgen çelik temren tek bir delici noktaya odaklanır; kritik vuruş hasarını artırır.',
                icon: ''
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_spear_23',
            name: 'Çatal Uçlu Hisar Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 32, armor: 3, blockChancePercent: 5}),
            requiredLevel: 23,
            valueInGold: 1150,
            description: 'Baltalı ve arkası kancalı dövüş teberi. Hem biçer, hem saplar, hem de hasmın kalkanını aşağı çeker.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sp_3',
                name: 'Kanca Hamlesi',
                description: 'Teberin arkasındaki çelik kanca hasmın kalkanını aşağı çeker ve gardını bozar.',
                icon: ''
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_spear_24',
            name: 'Yabandomuzu Çatal Mızrağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 34, speed: 3, maxHealth: 30}),
            requiredLevel: 24,
            valueInGold: 1320,
            description: 'Gövdeye fazla batıp takılmayı önleyen yan kanatlı avcı mızrağı. Dövüşçüye sağlam denge kazandırır.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sp_4',
                name: 'Durdurucu Kanat',
                description: 'Gövdeye derin girmeyi önleyen çelik kanatlar dövüşçüye sağlam duruş ve geri tepme direnci verir.',
                icon: ''
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_spear_25',
            name: 'Kum Fırtınası Üç Dişli Zıpkını',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 37, speed: 6, critChancePercent: 10}),
            requiredLevel: 25,
            valueInGold: 1800,
            description: 'Arenaların ünlü gladyatör silahı; üç çelik dişiyle hasmın silahını ve etini burkarak yakalar.',
            weaponType: 'zıpkın',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sp_5',
                name: 'Girdap Vuruşu',
                description: 'Üç dişli ucuyla hasmın etini kavrayıp burkar; hızlı adımlarla +%6 sıyrılma kazandırır.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_spear_27',
            name: 'Rünik Demirci Ustası Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 41, armor: 4, critChancePercent: 11}),
            requiredLevel: 27,
            valueInGold: 2450,
            description: 'Torvald\'ın ocakta kor haline getirdiği ve rünlerle damgaladığı sert mızrak. Ucu kor gibi parlar.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sp_6',
                name: 'Kızgın Temren',
                description: 'Kızgın kömür ocaklarında büyülenmiş çelik uç; temas ettiğinde yaraları dağlayıp ek hasar verir.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_spear_28',
            name: 'Uçurum Avcısı Çengelli Mızrağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 43, speed: 4, critChancePercent: 13}),
            requiredLevel: 28,
            valueInGold: 2850,
            description: 'Uçurumlarda yaşayan yırtıcı kanatlıları avlamak için dövülmüş, ters tırnaklı delici mızrak.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sp_7',
                name: 'Uçurum Kilidi',
                description: 'Ters tırnaklı ucuyla etten çekilirken derin yarıklar açar; rakibin hızını düşürür.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_spear_30',
            name: 'Ejder Pulu Kaplı Savaş Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 47, armor: 6, maxHealth: 60, critChancePercent: 12}),
            requiredLevel: 30,
            valueInGold: 4000,
            description: 'Sapı kalın ejderha pullarıyla sarılmış, çatlamaz ve esnemez dişbudak ağacından yapılmış dev kargı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sp_8',
                name: 'Ejder Delmesi',
                description: 'Ejderha pullarıyla sarılmış sağlam dişbudak sapı darbeyi katlar; %25 zırh delme sağlar.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_spear_32',
            name: 'Şafak Muhafızı Kanatlı Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 51, speed: 5, blockChancePercent: 8, armor: 5}),
            requiredLevel: 32,
            valueInGold: 4950,
            description: 'Kanat şeklindeki iki geniş çelik bıçağıyla zırhları kağıt gibi kesen, şafak muhafızlarının görkemli teberi.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sp_9',
                name: 'Kanat Kasırgası',
                description: 'Geniş iki kanatlı teber ağzı savrulduğunda hasmın gardını parçalar ve savuşturulamaz bir darbe indirir.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_spear_34',
            name: 'Derin Deniz Zıpkını \'Triton\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 56, speed: 8, critChancePercent: 16, dodgeChancePercent: 7}),
            requiredLevel: 34,
            valueInGold: 6300,
            description: 'Okyanus derinliklerinden çıkarılan mercan tozuyla bilenmiş, deniz fırtınasının gücünü taşıyan efsanevi zıpkın.',
            weaponType: 'zıpkın',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sp_10',
                name: 'Tuzlu Yara',
                description: 'Okyanus tuzu ve mercan tozuyla işlenmiş üç çatallı zıpkın; her vuruşta rakibin direncini kırar.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_spear_36',
            name: 'Gök Kubbe Delen Yıldırım Kargısı \'Astra\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 61, speed: 7, critChancePercent: 18, maxHealth: 80}),
            requiredLevel: 36,
            valueInGold: 7700,
            description: 'Dağ zirvesindeki fırtınanın ortasında yıldırımla tavlanmış, ucu kıvılcımlarla titreyen kutsal kargı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sp_11',
                name: 'Şimşek Temreni',
                description: 'Zirvelerde fırtınanın ortasında dövülen kargı; vuruşlarda havayı yırtan parlak bir şimşek hasarı çakar.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_spear_38',
            name: 'Ejderha Avcısı Devasa Kargı \'Gorgon\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 67, armor: 8, critChancePercent: 20, maxHealth: 100}),
            requiredLevel: 38,
            valueInGold: 9000,
            description: 'Yüzyıllar önce dev kanatlı canavarları gökten indirmek için dövülmüş, masif çelik gövdeli dev kargı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sp_12',
                name: 'Taşlaştıran Uç',
                description: 'Eski çağların dev canavarlarını yere seren devasa mızrak; rakibi sersemletip zırhını dağıtır.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_spear_39',
            name: 'Kadim Hükümdarlar Teberi \'Mihver\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 72, speed: 9, critChancePercent: 22, armor: 10, maxHealth: 110}),
            requiredLevel: 39,
            valueInGold: 10000,
            description: 'Diyarın dengesini sağlayan kadim hükümdarların taşıdığı nihai teber. Zırhları teneke gibi ikiye böler.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_sp_13',
                name: 'Mihver Parçalaması',
                description: 'Diyarın eksenini tutan kutsal teber; zırhı tamamen yok sayarak doğrudan ruha ve kemiğe işler.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),

        // =========================================================================
        // 4. BALTALAR (12 ADET) - Seviye 20 - 39
        // =========================================================================
        new Equipment({
            id: 'eq_tash_axe_20',
            name: 'Madenci Keski Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 28, armor: 2, critChancePercent: 6}),
            requiredLevel: 20,
            valueInGold: 580,
            description: 'Taş ocaklarındaki granit blokları yarmak için kullanılan, küt sırtlı ve zırh delen sağlam nacak.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ax_1',
                name: 'Kaya Kırıcı',
                description: 'Granit madenlerini yaran küt ağırlık; rakip zırhında çatlaklar oluşturur.',
                icon: ''
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_axe_21',
            name: 'Orman Akıncısı Çift Ağızlı Nacağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 30, speed: 2, critChancePercent: 8}),
            requiredLevel: 21,
            valueInGold: 750,
            description: 'Sık ormanlarda pusu kuran akıncıların seri ve acımasız savuruşlar için bilediği hafif çift ağızlı nacak.',
            weaponType: 'nacak',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ax_2',
                name: 'Seri Nacak Darbesi',
                description: 'Hafif ve dengeli çift ağız; art arda seri savuruşlar yapmayı kolaylaştırır.',
                icon: ''
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_axe_23',
            name: 'Ağır Çelik Yarma Satırı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 34, critChancePercent: 9, maxHealth: 30}),
            requiredLevel: 23,
            valueInGold: 1180,
            description: 'Kalın sırtı ve geniş çelik ağzıyla zırh plakalarını yamultup kemikleri sarsan mezbaha tipi ağır satır.',
            weaponType: 'satır',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ax_3',
                name: 'Kemik Çatlatan Satır',
                description: 'Kalın sırtı ve geniş çelik ağzıyla zırh levhalarını eğip kemikleri sarsar.',
                icon: ''
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_axe_24',
            name: 'Garnizon Kuşatma Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 36, armor: 3, speed: -1}),
            requiredLevel: 24,
            valueInGold: 1380,
            description: 'Kuşatmalarda kapı sürgülerini ve kalkan siperlerini parçalamak için dökülmüş masif savaş baltası.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ax_4',
                name: 'Siper Parçalayan',
                description: 'Kale kapılarını ve kalkanları kırmak için yapılmış balta; bloklanan darbelerde rakibe yüksek şok verir.',
                icon: ''
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_axe_26',
            name: 'Kurt Başlı Vahşi Savaş Nacağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 40, critChancePercent: 12, speed: 3}),
            requiredLevel: 26,
            valueInGold: 1900,
            description: 'Dağ klanlarının kurt totemiyle kutsadığı, açtığı derin yarıklarla hasmı kan kaybına uğratan vahşi nacak.',
            weaponType: 'nacak',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ax_5',
                name: 'Vahşi Isırık',
                description: 'Kurt klanlarının kanlı simgesi; kritik vuruşlarda rakipte durdurulamaz kanama başlatır.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_axe_28',
            name: 'Kükürt Ocağı Dövme Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 44, critChancePercent: 13, maxHealth: 50}),
            requiredLevel: 28,
            valueInGold: 2650,
            description: 'Kükürt madenlerinin aleviyle dövülmüş kara demir balta. Temas ettiği yere kızıl köz kıvılcımları saçar.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ax_6',
                name: 'Kükürt Kıvılcımı',
                description: 'Kükürt madenlerinin aleviyle sertleştirilmiş balta; temas anında yakıcı duman ve alev saçar.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_axe_30',
            name: 'Çifte Hilal Barbar Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 49, critChancePercent: 15, speed: 2}),
            requiredLevel: 30,
            valueInGold: 4100,
            description: 'Kuzey bozkırlarının barbar reislerinin taşıdığı dev hilal baltalar. Savrulurken rüzgar gibi homurdar.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ax_7',
                name: 'Fırtına Biçişi',
                description: 'İki hilal şeklindeki geniş ağızlar havayı uğultuyla yarar; kritik hasarı %25 artırır.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_axe_31',
            name: 'Demir Ağaç Saplı Dev Balyoz-Balta',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 52, armor: 5, maxHealth: 70, speed: -1}),
            requiredLevel: 31,
            valueInGold: 4500,
            description: 'Bir tarafı zırh ezen balyoz, diğer tarafı kemik biçen geniş balta olan heybetli melez savaş aleti.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ax_8',
                name: 'Dev Ezici',
                description: 'Bir yüzü ezici çekiç, diğer yüzü jilet gibi balta; hem zırhı ezer hem eti yarar.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_axe_33',
            name: 'Kuzey Tipi Kasap Satırı \'Valravn\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 57, critChancePercent: 17, speed: 4}),
            requiredLevel: 33,
            valueInGold: 5700,
            description: 'Kuzgun efsanelerinde adı geçen kadim çelikten yontulmuş satır. Hasmın gücünü emip dövüşçünün yaralarını sarar.',
            weaponType: 'satır',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ax_9',
                name: 'Kuzgun Hırsı',
                description: 'Eski kuzey masallarındaki kemik yiyen kuzgunların adını taşır; verilen hasarın %12\'sini cana çevirir.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_axe_35',
            name: 'Yeraltı Hükümdarı Kara Balta \'Hades\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 62, critChancePercent: 19, maxHealth: 90, armor: 6}),
            requiredLevel: 35,
            valueInGold: 7300,
            description: 'Zifiri karanlık yer altı mağaralarında antik rünlerle kutsanan, düşmanın ruhunu sıkan kara çelik balta.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ax_10',
                name: 'Ölüm Çağrısı',
                description: 'Zifiri karanlık madenlerden çıkarılan kara çelik; rakibin ruhunu sıkarak her tur canını tüketir.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_axe_37',
            name: 'Buz Devleri Klan Baltası \'Ymir\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 68, critChancePercent: 21, maxHealth: 110, armor: 7}),
            requiredLevel: 37,
            valueInGold: 8700,
            description: 'Kuzeyin ebedi buzullarıyla kaynaşmış antik çelik balta. Değdiği yeri dondurup buz gibi çatlatır.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ax_11',
                name: 'Buzul Kırılması',
                description: 'Donmuş dağların zirvesindeki ebedi buzullardan yontulmuş balta; darbe anında rakibi dondurup yavaşlatır.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_axe_39',
            name: 'Dünya Yaran Titan Baltası \'Kozmos\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 75, critChancePercent: 24, maxHealth: 130, armor: 9, speed: 4}),
            requiredLevel: 39,
            valueInGold: 10000,
            description: 'Titanların dağları ve yer kabuğunu yardığı efsanevi nihai savaş baltası. Karşısında hiçbir zırh dayanamaz.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ax_12',
                name: 'Yerküre Yarığı',
                description: 'Titanların dağları ikiye böldüğü efsanevi silah; saf yıkım gücüyle en kalın ejderha zırhlarını bile ikiye ayırır.',
                icon: ''
            }),
            maxSockets: 3,
            unlockedSockets: 3
        })
    ];
  },

};
