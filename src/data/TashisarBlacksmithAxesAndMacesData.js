import { Equipment, EquipmentSlot, EquipmentSpecialTrait, ItemRarity, Stats, WeaponCategory } from '../domain/model.js';

/**
 * 2. Bölüm (Taş Hisar) Demircisi Silahçı Torvald için 50 Adet Balta ve 50 Adet Gürz (Toplam 100 Yeni Silah).
 * Seviyeler: 20 - 39 Arası
 * Fiyatlar: 500 - 12.000 Altın Arası
 * Her silahta özgün özel nitelikler (specialTrait) ve taş soketleri bulunmaktadır.
 */
export const TashisarBlacksmithAxesAndMacesData = {

  createAxes() {
    return [
        new Equipment({
            id: 'eq_tash_waraxe_01',
            name: 'Garnizon Oduncu Nacağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 24, critChancePercent: 6, armor: 2, maxHealth: 20, speed: 2}),
            requiredLevel: 20,
            valueInGold: 520,
            description: 'Sert dağ gürgeni saplı, yakın dövüşte zırh kenetlerini ayırmak için dövülmüş hafif nacak.',
            weaponType: 'nacak',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_01',
                name: 'Gürgen Vuruşu',
                description: 'Hızlı savuruşlarla hasmın dengesini bozar.',
                icon: '🪓'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_waraxe_02',
            name: 'Dağlı Madenci Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 24, critChancePercent: 6, armor: 2, maxHealth: 20, speed: 2}),
            requiredLevel: 20,
            valueInGold: 580,
            description: 'Kaya çatlatmakta kullanılan tek ağızlı ağır nacak; düşmanın miğferini kolayca çatlatır.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_02',
                name: 'Kaya Yaran',
                description: 'Darbe anında zırhın üst katmanını ezer.',
                icon: '⛏️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_waraxe_03',
            name: 'Bozkır Süvari Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 28, critChancePercent: 6, armor: 2, maxHealth: 28, speed: 2}),
            requiredLevel: 21,
            valueInGold: 650,
            description: 'At sırtından aşağı savurmak için eğimli dövülmüş, rüzgar gibi ıslık çalan süvari baltası.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_03',
                name: 'Süvari Hamlesi',
                description: 'Hızlı hücumla kritik hasar potansiyelini katlar.',
                icon: '🐎'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_waraxe_04',
            name: 'Çentikli Kurt Dişi Nacağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 28, critChancePercent: 6, armor: 2, maxHealth: 28, speed: 2}),
            requiredLevel: 21,
            valueInGold: 720,
            description: 'Namlusu testere dişli, vurduğu yerde derin yırtıklar açan vahşi nacak.',
            weaponType: 'nacak',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_04',
                name: 'Kurt Isırığı',
                description: 'Kritik darbelerde kanatıcı yırtık oluşturur.',
                icon: '🐺'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_waraxe_05',
            name: 'Taş Hisar Öncü Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 32, critChancePercent: 7, armor: 3, maxHealth: 36, speed: 2}),
            requiredLevel: 22,
            valueInGold: 800,
            description: 'Garnizon öncü birliklerinin kalkan duvarlarını yarmak için kullandığı geniş ağızlı balta.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_05',
                name: 'Kalkan Kıran',
                description: 'Düşmanın blok direncini düşürür.',
                icon: '🛡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_waraxe_06',
            name: 'Dövme Karbon Çelik Nacak',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 32, critChancePercent: 7, armor: 3, maxHealth: 36, speed: 2}),
            requiredLevel: 22,
            valueInGold: 880,
            description: 'Kömür ocağında çifte su verilmiş, körelmek bilmeyen jilet keskinliğinde nacak.',
            weaponType: 'nacak',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_06',
                name: 'Çifte Su Verme',
                description: 'Keskin ağzıyla zırhı aşan net hasar uygular.',
                icon: '🗡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_waraxe_07',
            name: 'Yaban Domuzu Vahşi Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 36, critChancePercent: 8, armor: 3, maxHealth: 44, speed: 2}),
            requiredLevel: 23,
            valueInGold: 960,
            description: 'Ağır hilal ağızlı, kontrolsüz savuruşlarda bile yıkıcı kemik kıran kuvvet uygulayan silah.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_07',
                name: 'Yaban Tosu',
                description: 'Gövdeye inen vuruşlarda sarsıcı etki yapar.',
                icon: '🐗'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_waraxe_08',
            name: 'Kızıl Sancak Savaş Nacağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 36, critChancePercent: 8, armor: 3, maxHealth: 44, speed: 2}),
            requiredLevel: 23,
            valueInGold: 1050,
            description: 'Hisarın kırmızı tuğlu muhafızlarının kemerinde taşıdığı dengeli ve çevik savaş baltası.',
            weaponType: 'nacak',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_08',
                name: 'Kızıl Savuruş',
                description: 'Seri vuruşlarla peş peşe hasar yığar.',
                icon: '🚩'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_waraxe_09',
            name: 'Kuzey Çamur Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 40, critChancePercent: 9, armor: 4, maxHealth: 52, speed: 2}),
            requiredLevel: 24,
            valueInGold: 1150,
            description: 'Bataklık ve dağ geçitlerinin çamurlu şartlarında paslanmayan tunç perçinli balta.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_09',
                name: 'Çamur Batığı',
                description: 'Ağır gövdesiyle savruldukça hasmı yorar.',
                icon: '🪵'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_waraxe_10',
            name: 'Geniş Ağızlı İnfaz Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 40, critChancePercent: 9, armor: 4, maxHealth: 52, speed: 2}),
            requiredLevel: 24,
            valueInGold: 1250,
            description: 'Garnizon zindanlarının ağır infaz baltası; tek darbede zırh ve kemik ayırır.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_10',
                name: 'Hüküm Kesisi',
                description: 'Yaralı düşmana karşı hasarı artırır.',
                icon: '⚖️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_waraxe_11',
            name: 'Fırtına Oluğu Dağ Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 40, critChancePercent: 9, armor: 4, maxHealth: 52, speed: 2}),
            requiredLevel: 24,
            valueInGold: 1360,
            description: 'Namlusundaki hava olukları sayesinde savrulurken havayı yaran hızlı dağ nacağı.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_11',
                name: 'Fırtına Islığı',
                description: 'Savuruş hızını artırır ve atak kaçırma riskini azaltır.',
                icon: '💨'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_waraxe_12',
            name: 'Çift Başlı Gedik Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 40, critChancePercent: 9, armor: 4, maxHealth: 52, speed: 2}),
            requiredLevel: 24,
            valueInGold: 1480,
            description: 'Dar sur kapılarında iki yana savurarak yol açmak için dövülmüş çift ağızlı çelik canavar.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_12',
                name: 'Gedik Yaran',
                description: 'İki yönlü savuruşla hasmı köşeye sıkıştırır.',
                icon: '🪓'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_waraxe_13',
            name: 'Kaya Yarıcı Granit Balta',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 45, critChancePercent: 10, armor: 5, maxHealth: 60, speed: 2}),
            requiredLevel: 25,
            valueInGold: 1620,
            description: 'Ağzına granit tozu ve çelik alaşım katılmış, sarsılmaz dayanıklılıkta ağır silah.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_13',
                name: 'Granit Şoku',
                description: 'Her darbede hasmın duruşunu sarsar.',
                icon: '🪨'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_14',
            name: 'Kızıl Ejder Pulu Nacak',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 45, critChancePercent: 10, armor: 5, maxHealth: 60, speed: 2}),
            requiredLevel: 25,
            valueInGold: 1750,
            description: 'Kızıl pullarla kaplı kabzası dövüşçünün eline yapışır, savuruşlarda alev kıvılcımları saçar.',
            weaponType: 'nacak',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_14',
                name: 'Köz Kıvılcımı',
                description: 'Vuruşlarda ek alev hasarı ekler.',
                icon: '🔥'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_15',
            name: 'Ayaz Dağı Çift Ağızlı Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 49, critChancePercent: 10, armor: 5, maxHealth: 68, speed: 2}),
            requiredLevel: 26,
            valueInGold: 1900,
            description: 'Donmuş kuzey göllerinin soğuk suyuyla tavlanmış, buz gibi kesen çift başlı teber.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_15',
                name: 'Buzul Kesiği',
                description: 'Düşmanın saldırı hızını yavaşlatır.',
                icon: '❄️'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_16',
            name: 'Yırtıcı Akbaba Pençesi Balta',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 49, critChancePercent: 10, armor: 5, maxHealth: 68, speed: 2}),
            requiredLevel: 26,
            valueInGold: 2050,
            description: 'Geriye kıvrık kancalı namlusu düşmanın kalkanını indirip boynuna uzanır.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_16',
                name: 'Akbaba Pençesi',
                description: 'Kalkan arkasındaki hedeflere hasar iletir.',
                icon: '🦅'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_17',
            name: 'Hisar Burcu Ağır Barrikad Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 53, critChancePercent: 11, armor: 6, maxHealth: 76, speed: 2}),
            requiredLevel: 27,
            valueInGold: 2200,
            description: 'Sur kapılarını ve koçbaşlarını parçalamak için kullanılan devasa muhafız baltası.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_17',
                name: 'Barikat Ezici',
                description: 'Yüksek zırhlı hedeflerin zırhını yarar.',
                icon: '🏰'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_18',
            name: 'Gölge Kurt Nacağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 53, critChancePercent: 11, armor: 6, maxHealth: 76, speed: 2}),
            requiredLevel: 27,
            valueInGold: 2350,
            description: 'Mat siyah çelikten dövülmüş, karanlıkta parlamadan gırtlak biçen suikastçı baltası.',
            weaponType: 'nacak',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_18',
                name: 'Gölge Sinsisi',
                description: 'Kritik vuruş şansını önemli ölçüde yükseltir.',
                icon: '🌑'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_19',
            name: 'Volkanik Çatlak Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 57, critChancePercent: 12, armor: 6, maxHealth: 84, speed: 3}),
            requiredLevel: 28,
            valueInGold: 2500,
            description: 'İçindeki lav damarları kızıl kızıl parlayan volkanik döküm savaş baltası.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_19',
                name: 'Lav Çatlağı',
                description: 'Vurulan noktada yanıcı çatlaklar açar.',
                icon: '🌋'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_20',
            name: 'Lejyon Komutanı Çift Başlısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 57, critChancePercent: 12, armor: 6, maxHealth: 84, speed: 3}),
            requiredLevel: 28,
            valueInGold: 2680,
            description: 'Altın kakmalı ve aslan kabartmalı, lejyona zafer getiren usta işi çift başlı balta.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_20',
                name: 'Lejyon Narası',
                description: 'Dövüşçünün özgüvenini ve darbe gücünü artırır.',
                icon: '🦁'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_21',
            name: 'Yıldırım Çeliği Dağ Nacağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 57, critChancePercent: 12, armor: 6, maxHealth: 84, speed: 3}),
            requiredLevel: 28,
            valueInGold: 2850,
            description: 'Fırtınalı dağlarda düşen yıldırımların manyetizmasını taşıyan elektrikli nacak.',
            weaponType: 'nacak',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_21',
                name: 'Statik Ark',
                description: 'Darbe anında elektrik akımı yayar.',
                icon: '⚡'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_22',
            name: 'Obsidyen Dişli Vahşi Balta',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 61, critChancePercent: 13, armor: 7, maxHealth: 92, speed: 3}),
            requiredLevel: 29,
            valueInGold: 3050,
            description: 'Namlusuna jilet gibi keskin volkan camı parçaları perçinlenmiş korkunç balta.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_22',
                name: 'Obsidyen Yırtığı',
                description: 'Hasımdan durdurulamaz kan sızdırır.',
                icon: '🖤'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_23',
            name: 'Engerek Zehri Savaş Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 61, critChancePercent: 13, armor: 7, maxHealth: 92, speed: 3}),
            requiredLevel: 29,
            valueInGold: 3250,
            description: 'Kabzasında zehir kesesi barındıran, darbe anında oluklardan zehir sızdıran çelik.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_23',
                name: 'Engerek Salgısı',
                description: 'Düşmanın kanına yavaşlatıcı zehir akıtır.',
                icon: '🧪'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_24',
            name: 'Cehennem Dökümü Kıvılcım Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 61, critChancePercent: 13, armor: 7, maxHealth: 92, speed: 3}),
            requiredLevel: 29,
            valueInGold: 3450,
            description: 'Taş Hisar ocaklarının en derin fırınında dövülmüş, sürekli kor gibi parıldayan nacak.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_24',
                name: 'Cehennem Parıltısı',
                description: 'Zırhı delip geçen erimiş ısı hasarı.',
                icon: '🔥'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_25',
            name: 'Büyük Bozkır Hanı Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 61, critChancePercent: 13, armor: 7, maxHealth: 92, speed: 3}),
            requiredLevel: 29,
            valueInGold: 3600,
            description: 'Bozkırın fatihleri için işlenmiş, at nalı büyüklüğünde çift hilalli dev savaş aleti.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_25',
                name: 'Bozkır Fırtınası',
                description: 'Geniş savuruş açısıyla hasmın kaçışını engeller.',
                icon: '🌪️'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_26',
            name: 'Kızıl Ay Gözcüsü Nacağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 61, critChancePercent: 13, armor: 7, maxHealth: 92, speed: 3}),
            requiredLevel: 29,
            valueInGold: 3750,
            description: 'Kanlı ay gecesinde dövülen ve sadece kan kokusuna doymak isteyen büyülü nacak.',
            weaponType: 'nacak',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_26',
                name: 'Kanlı Hilal',
                description: 'Verilen hasarın bir kısmını can olarak çeker.',
                icon: '🩸'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_27',
            name: 'Kıyamet Oluğu Dağ Yarıcı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 66, critChancePercent: 14, armor: 8, maxHealth: 100, speed: 3}),
            requiredLevel: 30,
            valueInGold: 4000,
            description: 'İki elle kavranabilecek kadar uzun saplı, tek hamlede kayayı ikiye bölen dağ baltası.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_27',
                name: 'Kaya Yarığı',
                description: 'Düşmanı yere serecek sarsıcı güç uygular.',
                icon: '🪨'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_28',
            name: 'Kuzey Fırtınası Baş Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 66, critChancePercent: 14, armor: 8, maxHealth: 100, speed: 3}),
            requiredLevel: 30,
            valueInGold: 4300,
            description: 'Göz gözü görmeyen boranlarda parlayan beyaz çelikten dev savaş teberi.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_28',
                name: 'Boran Öfkesi',
                description: 'Soğuk şokuyla hasmın kaslarını kasıp dondurur.',
                icon: '🌨️'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_29',
            name: 'Karanlık Zindan İşkence Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 70, critChancePercent: 14, armor: 8, maxHealth: 108, speed: 3}),
            requiredLevel: 31,
            valueInGold: 4600,
            description: 'Yüz yıllık zindan mahzenlerinde bekletilmiş, kemik kıran acı dolu devasa pala-balta.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_29',
                name: 'Kemik Sızısı',
                description: 'Kritik vuruşlarda savunmayı sıfıra indirir.',
                icon: '☠️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_30',
            name: 'Şimşek Tanrısının Çift Başlısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 70, critChancePercent: 14, armor: 8, maxHealth: 108, speed: 3}),
            requiredLevel: 31,
            valueInGold: 4900,
            description: 'Gökyüzünden inen şimşeklerin gövdesine hapsolduğu dev mavi çelik canavar.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_30',
                name: 'Yıldırım Yarığı',
                description: 'Düşmanı afallatan yüksek voltaj patlaması.',
                icon: '⚡'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_31',
            name: 'Kızıl Ejderha Dişi Ulu Balta',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 74, critChancePercent: 15, armor: 9, maxHealth: 116, speed: 3}),
            requiredLevel: 32,
            valueInGold: 5200,
            description: 'Ejderha çenesinden sökülmüş kemikle sertleştirilmiş alev püskürten ulu balta.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_31',
                name: 'Ejderha Gazabı',
                description: 'Zırhı tamamen kül eden yakıcı vuruş.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_32',
            name: 'Güneş Tutulması Kara Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 74, critChancePercent: 15, armor: 9, maxHealth: 116, speed: 3}),
            requiredLevel: 32,
            valueInGold: 5500,
            description: 'Güneşin karardığı anda dökülen, ışığı yutan ve hasmın gözünü kör eden siyah namlu.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_32',
                name: 'Karanlık Biçim',
                description: 'Hedefin isabet yeteneğini ve görüşünü köreltir.',
                icon: '🌑'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_33',
            name: 'Kan Banyosu Gladyatör Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 78, critChancePercent: 16, armor: 9, maxHealth: 124, speed: 3}),
            requiredLevel: 33,
            valueInGold: 5800,
            description: 'Büyük arenanın kumlarında yüzlerce gladyatörün canını almış kana susamış balta.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_33',
                name: 'Arenanın Şehveti',
                description: 'Vurulan her darbede saldırı gücü katlanır.',
                icon: '🩸'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_34',
            name: 'Titan Kemikli Ulu Savaş Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 78, critChancePercent: 16, armor: 9, maxHealth: 124, speed: 3}),
            requiredLevel: 33,
            valueInGold: 6100,
            description: 'Eski çağların devlerinin uyluk kemiğinden oyulmuş sapı olan inanılmaz ağırlıkta balta.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_34',
                name: 'Titan Kudreti',
                description: 'Fiziksel hasarı devasa oranda patlatır.',
                icon: '🗿'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_35',
            name: 'Mutlak Sıfır Kristal Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 82, critChancePercent: 17, armor: 10, maxHealth: 132, speed: 3}),
            requiredLevel: 34,
            valueInGold: 6400,
            description: 'Saf buzul kristallerinden yontulmuş, değdiği yeri saniyesinde donduran efsunlu alet.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_35',
                name: 'Kristal Donması',
                description: 'Düşmanın zırhını kırılgan bir buza çevirir.',
                icon: '🧊'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_36',
            name: 'Araf Kıvılcımı Baş Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 82, critChancePercent: 17, armor: 10, maxHealth: 132, speed: 3}),
            requiredLevel: 34,
            valueInGold: 6700,
            description: 'Araf ateşinde yanan ruhların çığlıklarıyla yankılanan çift başlı korkunç silah.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_36',
                name: 'Ruh Yakan',
                description: 'Zırhı yok sayan içten yanmalı ruh hasarı.',
                icon: '🔥'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_37',
            name: 'Gök Gürültüsü Kral Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 87, critChancePercent: 18, armor: 11, maxHealth: 140, speed: 3}),
            requiredLevel: 35,
            valueInGold: 7000,
            description: 'Gök gürültüsünü andıran savuruş sesiyle düşmanın dizlerini titreten kraliyet silahı.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_37',
                name: 'Gök Sarsıntısı',
                description: 'Hasma ağır sersemletici şok indirir.',
                icon: '🌩️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_38',
            name: 'Kara Büyücü Kellesi Uçuran',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 87, critChancePercent: 18, armor: 11, maxHealth: 140, speed: 3}),
            requiredLevel: 35,
            valueInGold: 7300,
            description: 'Büyü kalkanlarını jilet gibi kesip parçalayan anti-büyü rünleriyle donatılmış balta.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_38',
                name: 'Büyü Kıran',
                description: 'Mistik kalkanları ve büyü zırhlarını parçalar.',
                icon: '🔮'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_39',
            name: 'Girdap Fırtınası Çift Başlısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 87, critChancePercent: 18, armor: 11, maxHealth: 140, speed: 3}),
            requiredLevel: 35,
            valueInGold: 7600,
            description: 'Döndürüldükçe etrafında küçük bir kasırga oluşturan rüzgar odaklı devasa teber.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_39',
                name: 'Hava Hortumu',
                description: 'Düşmanı savurup gardını tamamen düşürür.',
                icon: '🌪️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_40',
            name: 'Taş Hisar Muhafız Generali Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 87, critChancePercent: 18, armor: 11, maxHealth: 140, speed: 3}),
            requiredLevel: 35,
            valueInGold: 7900,
            description: 'Garnizon ordularının başkomutanına mahsus, üzerinde hisar surları işlenmiş heybetli balta.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_40',
                name: 'Garnizon Hükmü',
                description: 'Dövüşçünün hem zırhını hem saldırı gücünü besler.',
                icon: '🏰'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_waraxe_41',
            name: 'Kıyamet Mahşeri Ulu Yarıcısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 91, critChancePercent: 18, armor: 11, maxHealth: 148, speed: 4}),
            requiredLevel: 36,
            valueInGold: 8300,
            description: 'Yerin altındaki lav nehirlerinin merkezinde dövülmüş, dünyayı çatlatabilecek kudrette balta.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_41',
                name: 'Mahşer Çatlağı',
                description: 'Yüksek hasar ve zırh eritme.',
                icon: '🌋'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_waraxe_42',
            name: 'Sonsuz Buzul Ebedi Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 91, critChancePercent: 18, armor: 11, maxHealth: 148, speed: 4}),
            requiredLevel: 36,
            valueInGold: 8700,
            description: 'Kuzeyin yaratılıştan beri erimeyen buzunu taşıyan, temas ettiği her şeyi donduran başbalta.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_42',
                name: 'Mutlak Ayaz',
                description: 'Düşmanın kan akışını dondurup felç eder.',
                icon: '❄️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_waraxe_43',
            name: 'Yıldırım Tanrısının Gazap Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 95, critChancePercent: 19, armor: 12, maxHealth: 156, speed: 4}),
            requiredLevel: 37,
            valueInGold: 9200,
            description: 'Gök kubbeye uzanan yıldırımları namlusuna hapseden, her vuruşta yer gök inleten ilahi teber.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_43',
                name: 'Gök Gazabı',
                description: 'Hedefe ardışık yıldırım patlamaları indirir.',
                icon: '⚡'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_waraxe_44',
            name: 'Ejderhaların Efendisi Kızıl Kıyım',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 95, critChancePercent: 19, armor: 12, maxHealth: 156, speed: 4}),
            requiredLevel: 37,
            valueInGold: 9700,
            description: 'Kadim ejderha kralının göğüs kemiğinden ve kızıl alevinden dövülmüş yıkım aleti.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_44',
                name: 'Kızıl Kıyım',
                description: 'Arenayı alev fırtınasına çeviren katliam darbesi.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_waraxe_45',
            name: 'Ölüm Meleğinin Ruh Tırpanı Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 99, critChancePercent: 20, armor: 12, maxHealth: 164, speed: 4}),
            requiredLevel: 38,
            valueInGold: 10200,
            description: 'Ölümün soğuk nefesini taşıyan, ruhları gövdeden çekip alan kadim kara balta.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_45',
                name: 'Ruh Biçici',
                description: 'Can çalma ve hasmın dirençlerini yok etme.',
                icon: '☠️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_waraxe_46',
            name: 'Kozmik Yıldız Kıran Baş Çift Başlısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 99, critChancePercent: 20, armor: 12, maxHealth: 164, speed: 4}),
            requiredLevel: 38,
            valueInGold: 10700,
            description: 'Yıldızların çekirdeğindeki yoğun maddeden dövülmüş, inanılmaz kütle çekimli devasa silah.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_46',
                name: 'Yıldız Çöküşü',
                description: 'Hasmı yere mıhlayan akıl almaz darbe gücü.',
                icon: '✨'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_waraxe_47',
            name: 'Zaman Yırtan Boyut Baltası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 103, critChancePercent: 21, armor: 13, maxHealth: 172, speed: 4}),
            requiredLevel: 39,
            valueInGold: 11200,
            description: 'Uzay-zaman dokusunu kesebilen jilet inceliğinde boyutsal ağızlı esrarengiz eser.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_47',
                name: 'Boyut Kesiği',
                description: 'Zamanı bükerek kaçınılmaz kritik vuruş indirir.',
                icon: '⏳'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_waraxe_48',
            name: 'Yaratılışın İlk Kıvılcımı Ulu Balta',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 103, critChancePercent: 21, armor: 13, maxHealth: 172, speed: 4}),
            requiredLevel: 39,
            valueInGold: 11500,
            description: 'Diyarın ilk ateşinden kalan cevherle parıldayan, dokunduğu zırhı anında buharlaştıran başeser.',
            weaponType: 'balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_48',
                name: 'İlk Kıvılcım',
                description: 'Tüm savunmaları sıfırlayan mutlak yakış.',
                icon: '☀️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_waraxe_49',
            name: 'Mahşer Süvarisinin Kıyım Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 103, critChancePercent: 21, armor: 13, maxHealth: 172, speed: 4}),
            requiredLevel: 39,
            valueInGold: 11800,
            description: 'Dört atlıdan kızıl atlının savaşı başlatan teberi; durdurulamaz bir vahşet bahşeder.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_49',
                name: 'Kızıl Mahşer',
                description: 'Vurulan her kritik darbede canı ve hasarı katlar.',
                icon: '🩸'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_waraxe_50',
            name: 'Taş Hisar Fatihinin \'Hükümdar Baltası\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 103, critChancePercent: 21, armor: 13, maxHealth: 172, speed: 4}),
            requiredLevel: 39,
            valueInGold: 12000,
            description: 'Taş Hisar\'ın temellerine kazınmış kadim efsaneyi temsil eden diyarın en görkemli çift başlı baltası.',
            weaponType: 'çift başlı balta',
            weaponCategory: WeaponCategory.AXE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_axe_50',
                name: 'Fatihin İradesi',
                description: 'Dövüşçüyü arenada mağlup edilemez bir savaş makinesine dönüştürür.',
                icon: '👑'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        })
    ];
  },

  createMaces() {
    return [
        new Equipment({
            id: 'eq_tash_mace_01',
            name: 'Garnizon Nöbetçi Topuzu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 26, armor: 4, maxHealth: 35, blockChancePercent: 4, critChancePercent: 4}),
            requiredLevel: 20,
            valueInGold: 500,
            description: 'Döküm demir başlıklı, yakın boğuşmalarda hasmın kalkan kolunu ezmek için ideal hafif topuz.',
            weaponType: 'topuz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_01',
                name: 'Kemik Çatlatan',
                description: 'Darbe anında hasmın saldırı gücünü bir miktar kırar.',
                icon: '🔨'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_mace_02',
            name: 'Taş Hisar Çivili Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 26, armor: 4, maxHealth: 35, blockChancePercent: 4, critChancePercent: 4}),
            requiredLevel: 20,
            valueInGold: 560,
            description: 'Flanşlı gövdesine çelik çiviler çakılmış, zırhlı kasklara göçüren ağır garnizon gürzü.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_02',
                name: 'Çivili Başlık',
                description: 'Kaskın içine basınç uygulayarak sarsıntı yapar.',
                icon: '🪨'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_mace_03',
            name: 'Dövme Çelik Sabah Yıldızı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 30, armor: 4, maxHealth: 44, blockChancePercent: 4, critChancePercent: 4}),
            requiredLevel: 21,
            valueInGold: 640,
            description: 'Zincirli olmasa da sivri piramit uçlarıyla zırh plakalarını delen sağlam sabah yıldızı.',
            weaponType: 'sabah yıldızı',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_03',
                name: 'Yıldız Temreni',
                description: 'Zırhın dayanıklılığını aşındırır.',
                icon: '⭐'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_mace_04',
            name: 'Demirci Çırağının Balyozu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 30, armor: 4, maxHealth: 44, blockChancePercent: 4, critChancePercent: 4}),
            requiredLevel: 21,
            valueInGold: 710,
            description: 'Ağır örs çekicinden uyarlanmış, küt darbesiyle göğüs kafesini çökerten acımasız silah.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_04',
                name: 'Örs Vuruşu',
                description: 'Hasmın göğüs zırhını içeri göçürür.',
                icon: '⚒️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_mace_05',
            name: 'Bakır Kaplama Hisar Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 34, armor: 5, maxHealth: 53, blockChancePercent: 5, critChancePercent: 5}),
            requiredLevel: 22,
            valueInGold: 790,
            description: 'Paslanmaz bakır alaşımlı flanşlara sahip, dengeli savrulan garnizon piyade gürzü.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_05',
                name: 'Bakır Ağırlığı',
                description: 'Kalkan bloklarını daha kolay kırar.',
                icon: '🛡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_mace_06',
            name: 'Dağlı Madenci Tokmağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 34, armor: 5, maxHealth: 53, blockChancePercent: 5, critChancePercent: 5}),
            requiredLevel: 22,
            valueInGold: 870,
            description: 'Kaya oymacılarının ağır tokmağından devşirilmiş, sarsıcı darbe momentumu sağlayan topuz.',
            weaponType: 'topuz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_06',
                name: 'Kaya Tokmağı',
                description: 'Vuruşlarda hasmı sendeletir.',
                icon: '⛰️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_mace_07',
            name: 'Bronz Flanşlı Savaş Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 39, armor: 6, maxHealth: 62, blockChancePercent: 5, critChancePercent: 5}),
            requiredLevel: 23,
            valueInGold: 950,
            description: 'Altı kanatlı bronz flanşlarıyla düşmanın zırh plakalarına kenetlenip büken savaş aleti.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_07',
                name: 'Kanatlı Çentik',
                description: 'Hasmın savunma dengesini altüst eder.',
                icon: '⚔️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_mace_08',
            name: 'Kuzey Süvari Topuzu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 39, armor: 6, maxHealth: 62, blockChancePercent: 5, critChancePercent: 5}),
            requiredLevel: 23,
            valueInGold: 1040,
            description: 'At üstünden savrulduğunda aşağıdakinin boynunu kıran uzun saplı dengeli süvari topuzu.',
            weaponType: 'topuz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_08',
                name: 'Süvari İndirmesi',
                description: 'Hızlı darbelerde ezici momentum ekler.',
                icon: '🐎'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_mace_09',
            name: 'Kurşun Dolgulu Baş Balyozu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 43, armor: 7, maxHealth: 71, blockChancePercent: 6, critChancePercent: 6}),
            requiredLevel: 24,
            valueInGold: 1140,
            description: 'İçine eritilmiş kurşun akıtılmış demir kafa; savrulunca durdurulamaz bir kinetik enerji yayar.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_09',
                name: 'Kurşun Ağırlığı',
                description: 'Zırhları çökerten yüksek ham hasar.',
                icon: '🧱'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_mace_10',
            name: 'Garnizon Gardiyan Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 43, armor: 7, maxHealth: 71, blockChancePercent: 6, critChancePercent: 6}),
            requiredLevel: 24,
            valueInGold: 1240,
            description: 'Zindan gardiyanlarının isyan bastırmak için kullandığı sarsıcı ve sersemletici gürz.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_10',
                name: 'Hücre Disiplini',
                description: 'Hasmı sersemleterek karşılık vermesini engeller.',
                icon: '🗝️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_mace_11',
            name: 'Kızıl Çelik Çivili Topuz',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 43, armor: 7, maxHealth: 71, blockChancePercent: 6, critChancePercent: 6}),
            requiredLevel: 24,
            valueInGold: 1350,
            description: 'Kırmızı kömür ateşinde dövülmüş, sivri çelik konileriyle zırh aralıklarına batan topuz.',
            weaponType: 'topuz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_11',
                name: 'Kızıl Koniler',
                description: 'Zırh aralıklarına saplanarak ek hasar verir.',
                icon: '🔴'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_mace_12',
            name: 'Hisar Burcu Ağır Çekici',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 43, armor: 7, maxHealth: 71, blockChancePercent: 6, critChancePercent: 6}),
            requiredLevel: 24,
            valueInGold: 1460,
            description: 'Sur tamiratında kullanılan dev çekicin savaşa uyarlanmış hali; kalkanları tuzla buz eder.',
            weaponType: 'çekiç',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_12',
                name: 'Sarsılmaz Vuruş',
                description: 'Düşmanın blok şansını kırar.',
                icon: '🔨'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_mace_13',
            name: 'Granit Başlıklı Yıkım Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 48, armor: 8, maxHealth: 80, blockChancePercent: 7, critChancePercent: 6}),
            requiredLevel: 25,
            valueInGold: 1600,
            description: 'Taş ocaklarından çıkarılan saf granit blokla perçinlenmiş, duvar yıkan heybetli gürz.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_13',
                name: 'Granit Tokmağı',
                description: 'Her vuruşta toprağı sarsan ezici darbe.',
                icon: '🪨'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_14',
            name: 'Ayaz Çeliği Sabah Yıldızı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 48, armor: 8, maxHealth: 80, blockChancePercent: 7, critChancePercent: 6}),
            requiredLevel: 25,
            valueInGold: 1740,
            description: 'Kuzeyin ayazında bekletilmiş, vurduğu uzvu dondurup uyuşturan çivili sabah yıldızı.',
            weaponType: 'sabah yıldızı',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_14',
                name: 'Dondurucu Yıldız',
                description: 'Hasmın kolunu uyuşturarak atak hızını düşürür.',
                icon: '❄️'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_15',
            name: 'Volkanik Çekiç \'Körük\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 52, armor: 9, maxHealth: 89, blockChancePercent: 7, critChancePercent: 7}),
            requiredLevel: 26,
            valueInGold: 1880,
            description: 'Ateş körüklerinin harında ısıtılmış, vurduğunda kıvılcımlar saçan savaş çekici.',
            weaponType: 'çekiç',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_15',
                name: 'Körük Harı',
                description: 'Ezici darbeye ek alev hasarı katar.',
                icon: '🔥'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_16',
            name: 'Çift Başlı Gedik Balyozu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 52, armor: 9, maxHealth: 89, blockChancePercent: 7, critChancePercent: 7}),
            requiredLevel: 26,
            valueInGold: 2020,
            description: 'Hisar kapılarını kırmak için kullanılan çift demir bloklu devasa balyoz.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_16',
                name: 'Gedik Açan',
                description: 'Kalkan ve zırhı aynı anda ezer.',
                icon: '🚪'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_17',
            name: 'Kızıl Muhafız Subay Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 56, armor: 10, maxHealth: 98, blockChancePercent: 8, critChancePercent: 7}),
            requiredLevel: 27,
            valueInGold: 2180,
            description: 'Hisarın seçkin subayları için pirinç kaplamayla süslenmiş, hem zarif hem ölümcül gürz.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_17',
                name: 'Subay Fermanı',
                description: 'Dövüşçüye yüksek moral ve atak sağlar.',
                icon: '⚜️'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_18',
            name: 'Kara Demir Ezici Topuz',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 56, armor: 10, maxHealth: 98, blockChancePercent: 8, critChancePercent: 7}),
            requiredLevel: 27,
            valueInGold: 2320,
            description: 'Cüruf madenlerinden çıkarılan kara demirle dökülmüş, pas tutmaz ve ağır bir küt silah.',
            weaponType: 'topuz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_18',
                name: 'Kara Ezici',
                description: 'Hasmın göğüs kafesine derin basınç yapar.',
                icon: '🖤'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_19',
            name: 'Şimşek Flanşlı Savaş Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 61, armor: 11, maxHealth: 107, blockChancePercent: 8, critChancePercent: 8}),
            requiredLevel: 28,
            valueInGold: 2480,
            description: 'Namlusundaki kanatlara fırtına rünleri kazınmış, vurduğunda şimşek çıtırtısı çıkaran gürz.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_19',
                name: 'Statik Şok',
                description: 'Darbe anında hasmı afallatır.',
                icon: '⚡'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_20',
            name: 'Akbaba Gagası Delici Çekiç',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 61, armor: 11, maxHealth: 107, blockChancePercent: 8, critChancePercent: 8}),
            requiredLevel: 28,
            valueInGold: 2650,
            description: 'Arkasındaki sivri gagayla kalkanları delip önden ezen çift taraflı savaş aleti.',
            weaponType: 'çekiç',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_20',
                name: 'Gaga Vuruşu',
                description: 'Zırh delme gücünü katlar.',
                icon: '🦅'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_21',
            name: 'Obsidyen Kaplama Korkunç Balyoz',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 61, armor: 11, maxHealth: 107, blockChancePercent: 8, critChancePercent: 8}),
            requiredLevel: 28,
            valueInGold: 2820,
            description: 'Namlusuna volkanik cam zırh giydirilmiş, değdiği metalde derin çatlaklar açan balyoz.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_21',
                name: 'Obsidyen Şoku',
                description: 'Kırıcı etkiyle zırhı ufalar.',
                icon: '🖤'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_22',
            name: 'Ejderha Nefesi Kor Topuzu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 65, armor: 12, maxHealth: 116, blockChancePercent: 9, critChancePercent: 8}),
            requiredLevel: 29,
            valueInGold: 3000,
            description: 'Ağzından duman tüten ejderha kafası şeklinde dökülmüş, kor sıcaklığında ağır topuz.',
            weaponType: 'topuz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_22',
                name: 'Ejderha Nefesi',
                description: 'Hasmın zırhını ısıtıp yumuşatır.',
                icon: '🐉'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_23',
            name: 'Kutsal Yargıç Demir Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 65, armor: 12, maxHealth: 116, blockChancePercent: 9, critChancePercent: 8}),
            requiredLevel: 29,
            valueInGold: 3200,
            description: 'Adaleti temsil eden terazi motifleriyle süslü, suçluların boynunu vuran kutsal gürz.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_23',
                name: 'Yargıç Tokmağı',
                description: 'Kritik vuruşlarda ilahi hasar patlatır.',
                icon: '⚖️'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_24',
            name: 'Yaban Boğası Boynuzlu Balyoz',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 65, armor: 12, maxHealth: 116, blockChancePercent: 9, critChancePercent: 8}),
            requiredLevel: 29,
            valueInGold: 3400,
            description: 'İki yanından boynuz şeklinde çelik mahmuzlar çıkan korkunç darbe silahı.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_24',
                name: 'Boğa Tosu',
                description: 'Düşmanı geriye püskürten muazzam momentum.',
                icon: '🐂'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_25',
            name: 'Zümrüt Damarlı Şifa Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 65, armor: 12, maxHealth: 116, blockChancePercent: 9, critChancePercent: 8}),
            requiredLevel: 29,
            valueInGold: 3550,
            description: 'Toprağın hayat damarlarından sızan zümrütle süslü; vurdukça dövüşçünün bedenini yeniler.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_25',
                name: 'Hayat Damarı',
                description: 'Can çalma ve direnç takviyesi.',
                icon: '💚'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_26',
            name: 'Hisar Komutanı Altın Flanşlısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 65, armor: 12, maxHealth: 116, blockChancePercent: 9, critChancePercent: 8}),
            requiredLevel: 29,
            valueInGold: 3700,
            description: 'Garnizon komutanına takdim edilen, çeliği altın yaldızla güçlendirilmiş başgürz.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_26',
                name: 'Komutanın Zaferi',
                description: 'Saldırı ve zırhı dengeli yükseltir.',
                icon: '🏆'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_27',
            name: 'Dağ Devinin Balyozu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 70, armor: 13, maxHealth: 125, blockChancePercent: 10, critChancePercent: 9}),
            requiredLevel: 30,
            valueInGold: 3950,
            description: 'Sarp zirvelerde yaşayan devlerin tokmağından ilham alan, iki elle kavranan dev silah.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_27',
                name: 'Dev Tokmağı',
                description: 'Akıl almaz ezici kuvvet.',
                icon: '🗿'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_28',
            name: 'Buzul Çağı Çivili Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 70, armor: 13, maxHealth: 125, blockChancePercent: 10, critChancePercent: 9}),
            requiredLevel: 30,
            valueInGold: 4250,
            description: 'Ebedi karlar altında kalmış, çivileri dondurucu buz sarkıtlarına dönüşen kadim gürz.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_28',
                name: 'Ayaz İğneleri',
                description: 'Hedefin kaslarını dondurup felç eder.',
                icon: '🧊'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_29',
            name: 'Cehennem Ocağı Balyozu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 74, armor: 13, maxHealth: 134, blockChancePercent: 10, critChancePercent: 9}),
            requiredLevel: 31,
            valueInGold: 4550,
            description: 'Yeraltı cehenneminin kükürtlü alevlerinde dövülmüş devasa demir kütle.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_29',
                name: 'Kükürt Dumanı',
                description: 'Zırhı eriten cehennem darbesi.',
                icon: '🔥'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_30',
            name: 'Gök Yaratan Yıldırım Topuzu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 74, armor: 13, maxHealth: 134, blockChancePercent: 10, critChancePercent: 9}),
            requiredLevel: 31,
            valueInGold: 4850,
            description: 'Bulutlardan güç çeken, vuruş anında sağır edici bir gök gürültüsü koparan topuz.',
            weaponType: 'topuz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_30',
                name: 'Gök Çökmesi',
                description: 'Sağır edici sersemletme etkisi.',
                icon: '🌩️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_31',
            name: 'Karanlık Zindan İşkence Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 78, armor: 14, maxHealth: 143, blockChancePercent: 11, critChancePercent: 10}),
            requiredLevel: 32,
            valueInGold: 5150,
            description: 'Ağır kurşun başlığıyla en kalın şövalye zırhlarını bile tenekeye çeviren acımasız gürz.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_31',
                name: 'Zırh Parçalayan',
                description: 'Düşmanın tüm zırh bonuslarını yok sayar.',
                icon: '☠️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_32',
            name: 'Kutsal Şafak Sabah Yıldızı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 78, armor: 14, maxHealth: 143, blockChancePercent: 11, critChancePercent: 10}),
            requiredLevel: 32,
            valueInGold: 5450,
            description: 'Güneşin ilk ışıklarıyla kutsanmış altın çivili sabah yıldızı. Karanlığı yarıp aydınlatır.',
            weaponType: 'sabah yıldızı',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_32',
                name: 'Şafak Işıltısı',
                description: 'Nur saçarak hedefin gözünü kör eder.',
                icon: '☀️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_33',
            name: 'Titan Yumruğu Çift Başlısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 83, armor: 15, maxHealth: 152, blockChancePercent: 11, critChancePercent: 10}),
            requiredLevel: 33,
            valueInGold: 5750,
            description: 'Titanların yumruğunu andıran devasa çift demir kafalı kıyamet çekici.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_33',
                name: 'Titan Yumruğu',
                description: 'Kemik ve kalkan dinlemeyen ham güç.',
                icon: '👊'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_34',
            name: 'Kızıl Ejder Çenesi Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 83, armor: 15, maxHealth: 152, blockChancePercent: 11, critChancePercent: 10}),
            requiredLevel: 33,
            valueInGold: 6050,
            description: 'Ejderhanın kırılmaz çene kemiklerinden dökülen alevli başlık.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_34',
                name: 'Ejderha Isırığı',
                description: 'Vurulan noktayı küle çeviren alev patlaması.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_35',
            name: 'Mutlak Sıfır Dondurucu Balyoz',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 87, armor: 16, maxHealth: 161, blockChancePercent: 12, critChancePercent: 11}),
            requiredLevel: 34,
            valueInGold: 6350,
            description: 'Değdiği an demiri dondurup kırılgan cam haline getiren mutlak soğuk silahı.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_35',
                name: 'Kırılgan Zırh',
                description: 'Düşmanın zırh direncini paramparça eder.',
                icon: '❄️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_36',
            name: 'Araf Zincirli Ruh Ezici',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 87, armor: 16, maxHealth: 161, blockChancePercent: 12, critChancePercent: 11}),
            requiredLevel: 34,
            valueInGold: 6650,
            description: 'Araf mahkumlarının zincirleriyle sarılmış, vurduğu ruhu inleten mistik topuz.',
            weaponType: 'topuz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_36',
                name: 'Ruh Kıran',
                description: 'Fiziksel zırhı aşan doğrudan can hasarı.',
                icon: '⛓️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_37',
            name: 'Fırtına Kralı Gök Çekici',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 92, armor: 17, maxHealth: 170, blockChancePercent: 13, critChancePercent: 11}),
            requiredLevel: 35,
            valueInGold: 6950,
            description: 'Fırtına tanrılarının tapınaklarından inen kutsal ve sarsılmaz savaş çekici.',
            weaponType: 'çekiç',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_37',
                name: 'Fırtına Tokadı',
                description: 'Hasmı yere seren yıldırım dalgası.',
                icon: '⚡'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_38',
            name: 'Taş Hisar Başmimarı Balyozu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 92, armor: 17, maxHealth: 170, blockChancePercent: 13, critChancePercent: 11}),
            requiredLevel: 35,
            valueInGold: 7250,
            description: 'Hisarın bin yıllık surlarını tartan ve tahkim eden resmi usta balyozu.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_38',
                name: 'Sarsılmaz Tahkimat',
                description: 'Dövüşçüye yüksek zırh ve blok gücü katar.',
                icon: '🏛️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_39',
            name: 'Kozmik Çöküş Sabah Yıldızı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 92, armor: 17, maxHealth: 170, blockChancePercent: 13, critChancePercent: 11}),
            requiredLevel: 35,
            valueInGold: 7550,
            description: 'Yıldızların kara deliğe dönüşürken yaydığı gravitasyonel çekimi taşıyan esrarengiz silah.',
            weaponType: 'sabah yıldızı',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_39',
                name: 'Yerçekimi Çöküşü',
                description: 'Hasmı kendine çekip dengesini yok eder.',
                icon: '🕳️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_40',
            name: 'Kanlı Kupa Gladyatör Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 92, armor: 17, maxHealth: 170, blockChancePercent: 13, critChancePercent: 11}),
            requiredLevel: 35,
            valueInGold: 7850,
            description: 'Arenanın en kanlı sezonunu namağlup bitiren şampiyonun kana bulanmış gürzü.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_40',
                name: 'Şampiyon Tokmağı',
                description: 'Vurdukça can çeker ve saldırıyı katlar.',
                icon: '🩸'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_mace_41',
            name: 'Kıyamet Mahşeri Yıkım Balyozu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 96, armor: 18, maxHealth: 179, blockChancePercent: 13, critChancePercent: 12}),
            requiredLevel: 36,
            valueInGold: 8250,
            description: 'Dünyanın son gününü haber veren boruların çeliğinden dökülmüş dev balyoz.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_41',
                name: 'Kıyamet Vuruşu',
                description: 'Muazzam hasar ve zırh erimesi.',
                icon: '🌋'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_mace_42',
            name: 'Sonsuz Kar Dağı Ebedi Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 96, armor: 18, maxHealth: 179, blockChancePercent: 13, critChancePercent: 12}),
            requiredLevel: 36,
            valueInGold: 8650,
            description: 'Asla erimeyen kadim dağların çekirdeğindeki buz cevheriyle dövülmüş başgürz.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_42',
                name: 'Ebedi Ayaz',
                description: 'Hasmın kanını dondurup hareketini sıfırlar.',
                icon: '🏔️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_mace_43',
            name: 'Yıldırım Tanrısının Gök Balyozu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 100, armor: 19, maxHealth: 188, blockChancePercent: 14, critChancePercent: 12}),
            requiredLevel: 37,
            valueInGold: 9150,
            description: 'Yedi kat göğün çekicini taşıyan, yere vurulduğunda şimşekler fışkırtan ulu balyoz.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_43',
                name: 'Göklerin Hükmü',
                description: 'Arenada şimşek fırtınası patlatır.',
                icon: '⚡'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_mace_44',
            name: 'Güneş Çekirdeği İlahi Sabah Yıldızı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 100, armor: 19, maxHealth: 188, blockChancePercent: 14, critChancePercent: 12}),
            requiredLevel: 37,
            valueInGold: 9650,
            description: 'Güneş plazmasının yoğunlaştırılmış haliyle parıldayan kutsal sabah yıldızı.',
            weaponType: 'sabah yıldızı',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_44',
                name: 'Güneş Plazması',
                description: 'Zırhı sıvılaştıran kavurucu darbe.',
                icon: '☀️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_mace_45',
            name: 'Ruhlar Denizi \'Thanatos\' Balyozu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 105, armor: 20, maxHealth: 197, blockChancePercent: 14, critChancePercent: 13}),
            requiredLevel: 38,
            valueInGold: 10150,
            description: 'Ölüler diyarının kapısını bekleyen titanların elinden alınmış kara balyoz.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_45',
                name: 'Ruh Göçüren',
                description: 'Hasmın canını ve nefesini çeker.',
                icon: '☠️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_mace_46',
            name: 'Kozmik Tekillik Baş Gürzü',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 105, armor: 20, maxHealth: 197, blockChancePercent: 14, critChancePercent: 13}),
            requiredLevel: 38,
            valueInGold: 10650,
            description: 'Maddenin en yoğun ve en ağır halini sol elin uzantısı kılan akıl almaz silah.',
            weaponType: 'gürz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_46',
                name: 'Tekillik Ezmesi',
                description: 'Fizik yasalarını aşan ezici kuvvet.',
                icon: '🌌'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_mace_47',
            name: 'Zaman Büken Kadim Çekiç',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 109, armor: 21, maxHealth: 206, blockChancePercent: 15, critChancePercent: 13}),
            requiredLevel: 39,
            valueInGold: 11150,
            description: 'Darbe anında hasmın zaman akışını donduran ve dövüşçüye serbest vuruş veren kutsal çekiç.',
            weaponType: 'çekiç',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_47',
                name: 'Zaman Mührü',
                description: 'Hasmı zaman boşluğunda dondurur.',
                icon: '⏳'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_mace_48',
            name: 'Alfa & Omega Kıyamet Topuzu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 109, armor: 21, maxHealth: 206, blockChancePercent: 15, critChancePercent: 13}),
            requiredLevel: 39,
            valueInGold: 11450,
            description: 'Yaratılışın ilk maddesi ve kıyametin son külünden harmanlanmış başeser.',
            weaponType: 'topuz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_48',
                name: 'Alfa & Omega',
                description: 'Arenada mutlak üstünlük ve sarsılmaz direnç.',
                icon: '👑'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_mace_49',
            name: 'Mahşer Süvarisinin Ağır Tokmağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 109, armor: 21, maxHealth: 206, blockChancePercent: 15, critChancePercent: 13}),
            requiredLevel: 39,
            valueInGold: 11750,
            description: 'Mahşerin kara süvarisine mahsus, zırhları ve kaleleri dümdüz eden balyoz.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_49',
                name: 'Kara Mahşer',
                description: 'Düşmanı un ufak eden devasa yıkım.',
                icon: '☄️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_mace_50',
            name: 'Taş Hisar Hükümdarının \'Kraliyet Balyozu\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 109, armor: 21, maxHealth: 206, blockChancePercent: 15, critChancePercent: 13}),
            requiredLevel: 39,
            valueInGold: 12000,
            description: 'Taş Hisar\'ın taht odasında korunan, kraliyet hanedanının en kudretli savaş aleti.',
            weaponType: 'balyoz',
            weaponCategory: WeaponCategory.MACE,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_mc_50',
                name: 'Hanedan Hükmü',
                description: 'Tüm nitelikleri zirveye çıkaran nihai silah.',
                icon: '🏰'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        })
    ];
  },

};
