import { Equipment, EquipmentSlot, EquipmentSpecialTrait, ItemRarity, Stats, WeaponCategory } from '../domain/model.js';

/**
 * 2. Bölüm (Taş Hisar) Demircisi Silahçı Torvald için 50 Adet Mızrak ve 50 Adet Hançer (Toplam 100 Yeni Silah).
 * Seviyeler: 20 - 39 Arası
 * Fiyatlar: 500 - 12.000 Altın Arası
 * Her silahta özgün özel nitelikler (specialTrait) ve taş soketleri bulunmaktadır.
 */
export const TashisarBlacksmithSpearsAndDaggersData = {

  createSpears() {
    return [
        new Equipment({
            id: 'eq_tash_warspear_01',
            name: 'Garnizon Nöbetçi Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 25, speed: 2, critChancePercent: 7, armor: 2, maxHealth: 20}),
            requiredLevel: 20,
            valueInGold: 520,
            description: 'Taş Hisar surlarında devriye gezen muhafızların delici uzun kargısı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_01',
                name: 'Menzil Kilidi',
                description: 'Hasmı yaklaşamadan uzaktan karşılar.',
                icon: '🔱'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_warspear_02',
            name: 'Dağ Yolu Süvari Mızrağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 25, speed: 2, critChancePercent: 7, armor: 2, maxHealth: 20}),
            requiredLevel: 20,
            valueInGold: 580,
            description: 'Hafif dişbudak ağacından saplı, hücum anında derin delen sivri mızrak.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_02',
                name: 'Hücum Temreni',
                description: 'Hücum anında delici darbe gücünü artırır.',
                icon: '🐎'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_warspear_03',
            name: 'Kancalı Sur Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 29, speed: 2, critChancePercent: 7, armor: 2, maxHealth: 26}),
            requiredLevel: 21,
            valueInGold: 650,
            description: 'Baltalı ve kancalı ucuyla hem kesen hem düşmanın kalkanını aşağı çeken teber.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_03',
                name: 'Kalkan Çengeli',
                description: 'Hasmın kalkanını aşağı çekerek gardını bozar.',
                icon: '🪓'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_warspear_04',
            name: 'Yabandomuzu Çatal Mızrağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 29, speed: 2, critChancePercent: 7, armor: 2, maxHealth: 26}),
            requiredLevel: 21,
            valueInGold: 720,
            description: 'Gövdeye fazla saplanmayı önleyen yan kanatlı dengeli avcı mızrağı.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_04',
                name: 'Durdurucu Kanat',
                description: 'Geri tepme sarsıntısını sönümleyerek denge sağlar.',
                icon: '🐗'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_warspear_05',
            name: 'Kum Fırtınası Zıpkını',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 33, speed: 2, critChancePercent: 8, armor: 3, maxHealth: 32}),
            requiredLevel: 22,
            valueInGold: 800,
            description: 'Uç kısımları tırtıklı, kum korsanlarının hafif ve seri savurduğu zıpkın.',
            weaponType: 'zıpkın',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_05',
                name: 'Tırtıklı Temren',
                description: 'Hızlı delici vuruşlarla peş peşe hasar verir.',
                icon: '⚡'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_warspear_06',
            name: 'Üç Dişli Balıkçı Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 33, speed: 2, critChancePercent: 8, armor: 3, maxHealth: 32}),
            requiredLevel: 22,
            valueInGold: 880,
            description: 'Rıhtım muhafızlarının deniz yaratıklarına karşı kullandığı üç çelik uçlu kargı.',
            weaponType: 'üç dişli',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_06',
                name: 'Üçlü Kıstırma',
                description: 'Düşmanın hamlelerini üç noktadan kilitler.',
                icon: '🔱'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_warspear_07',
            name: 'Bozkır Süvari Gönderi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 37, speed: 3, critChancePercent: 9, armor: 3, maxHealth: 38}),
            requiredLevel: 23,
            valueInGold: 970,
            description: 'Rüzgara karşı esneyebilen dayanıklı kargı; zırh plakalarının arasını arar.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_07',
                name: 'Rüzgar Gönderi',
                description: 'Delici vuruşlarda zırh aralıklarına sızar.',
                icon: '💨'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_warspear_08',
            name: 'Kızıl Tuğlu Piyade Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 37, speed: 3, critChancePercent: 9, armor: 3, maxHealth: 38}),
            requiredLevel: 23,
            valueInGold: 1060,
            description: 'Kızıl lezyonun ön saflarında kalkan duvarlarının ardından uzanan mızrak.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_08',
                name: 'Safer İntizamı',
                description: 'Saldırı hızını ve isabet oranını artırır.',
                icon: '🚩'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_warspear_09',
            name: 'Geniş Namlulu Savaş Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 42, speed: 3, critChancePercent: 9, armor: 4, maxHealth: 44}),
            requiredLevel: 24,
            valueInGold: 1160,
            description: 'Geniş baltasıyla hem biçen hem arkasındaki sivri çiviyle delen teber.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_09',
                name: 'Çifte Tehdit',
                description: 'Hem kesici hem delici hasar uygular.',
                icon: '⚔️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_warspear_10',
            name: 'Ayaz Çeliği Nöbetçi Mızrağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 42, speed: 3, critChancePercent: 9, armor: 4, maxHealth: 44}),
            requiredLevel: 24,
            valueInGold: 1260,
            description: 'Kuzey rüzgarlarının dondurduğu çelik uçlu, temas ettiği eti donduran mızrak.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_10',
                name: 'Ayaz Sisi',
                description: 'Darbe anında hasmın hareketini yavaşlatır.',
                icon: '❄️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_warspear_11',
            name: 'Obsidyen Temrenli Dağ Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 42, speed: 3, critChancePercent: 9, armor: 4, maxHealth: 44}),
            requiredLevel: 24,
            valueInGold: 1370,
            description: 'Siyah volkan camından sivriltilmiş delici ucuyla çeliği yaran kargı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_11',
                name: 'Cam Temren',
                description: 'Zırhı parçalayan keskin saplama.',
                icon: '🖤'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_warspear_12',
            name: 'Fırtına Oluğu Gedik Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 42, speed: 3, critChancePercent: 9, armor: 4, maxHealth: 44}),
            requiredLevel: 24,
            valueInGold: 1490,
            description: 'Sur gediklerinde dar alanda düşman süvarisini durduran ağır teber.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_12',
                name: 'Gedik Diken',
                description: 'Gelen hücumları durdurup hasarı geri yansıtır.',
                icon: '🏰'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_warspear_13',
            name: 'Granit Zırh Delici Mızrak',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 46, speed: 4, critChancePercent: 10, armor: 4, maxHealth: 50}),
            requiredLevel: 25,
            valueInGold: 1620,
            description: 'Ucu elmas taşlama ile sivriltilmiş, plaka zırhları tek hamlede delen mızrak.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_13',
                name: 'Zırh Delen',
                description: 'Zırh korumasını büyük oranda delip geçer.',
                icon: '💎'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_14',
            name: 'Kızıl Ejder Pulu Kargı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 46, speed: 4, critChancePercent: 10, armor: 4, maxHealth: 50}),
            requiredLevel: 25,
            valueInGold: 1760,
            description: 'Ejderha pullarıyla sarılı gövdesi alev sıcaklığı yayan savaşkargısı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_14',
                name: 'Köz Batışı',
                description: 'Saplandığı noktada içten yanmalı hasar bırakır.',
                icon: '🔥'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_15',
            name: 'Kuzey Fırtınası Üç Dişlisi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 50, speed: 4, critChancePercent: 11, armor: 5, maxHealth: 56}),
            requiredLevel: 26,
            valueInGold: 1910,
            description: 'Donmuş kuzey denizlerinin suyuyla tavlanmış, üç yönden buz saçan mızrak.',
            weaponType: 'üç dişli',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_15',
                name: 'Buz Çatalı',
                description: 'Düşmanın gardını dondurarak bloke etmesini engeller.',
                icon: '🧊'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_16',
            name: 'Yırtıcı Şahin Gagası Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 50, speed: 4, critChancePercent: 11, armor: 5, maxHealth: 56}),
            requiredLevel: 26,
            valueInGold: 2060,
            description: 'Kıvrık gagasıyla miğferleri delip kalkanları parçalayan teber.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_16',
                name: 'Şahin Hamlesi',
                description: 'Kritik vuruş şansını önemli ölçüde artırır.',
                icon: '🦅'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_17',
            name: 'Lejyon Süvari Baş Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 55, speed: 4, critChancePercent: 11, armor: 5, maxHealth: 62}),
            requiredLevel: 27,
            valueInGold: 2220,
            description: 'Lejyon şövalyelerinin sancak taşıdığı, altın kakmalı ağır hücum kargısı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_17',
                name: 'Şövalye Darbesi',
                description: 'Hücum gücünü ve savunma dayanıklılığını besler.',
                icon: '🛡️'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_18',
            name: 'Gölge Yılanı Zehir Zıpkını',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 55, speed: 4, critChancePercent: 11, armor: 5, maxHealth: 62}),
            requiredLevel: 27,
            valueInGold: 2380,
            description: 'Zehir kanallarıyla donatılmış, saplandığı an kana kara zehir akıtan zıpkın.',
            weaponType: 'zıpkın',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_18',
                name: 'Kara Zehir',
                description: 'Hasmın canını zamanla tüketen toksin.',
                icon: '🧪'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_19',
            name: 'Yıldırım Çeliği Dağ Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 59, speed: 5, critChancePercent: 12, armor: 6, maxHealth: 68}),
            requiredLevel: 28,
            valueInGold: 2550,
            description: 'Fırtına tepelerindeki yıldırımlarla dövülmüş, ark yapan elektrikli mızrak.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_19',
                name: 'Şimşek Oku',
                description: 'Darbe anında elektrik akımı sıçratır.',
                icon: '⚡'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_20',
            name: 'Büyük Bozkır Kaplanı Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 59, speed: 5, critChancePercent: 12, armor: 6, maxHealth: 68}),
            requiredLevel: 28,
            valueInGold: 2720,
            description: 'Bozkır hanlarının korumalarına mahsus, çevik ve vahşi çift yönlü teber.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_20',
                name: 'Kaplan Pençesi',
                description: 'Seri vuruşlarla peş peşe kritik hasar indirir.',
                icon: '🐅'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_21',
            name: 'Volkanik Çatlak Mızrağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 59, speed: 5, critChancePercent: 12, armor: 6, maxHealth: 68}),
            requiredLevel: 28,
            valueInGold: 2900,
            description: 'Namlusundaki lav kanalları kızıl parlayan, zırhları eriten mızrak.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_21',
                name: 'Lav Damlası',
                description: 'Vurulan hedefi erimiş lavla kavurur.',
                icon: '🌋'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_22',
            name: 'Titan İliği Ulu Kargı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 63, speed: 5, critChancePercent: 13, armor: 6, maxHealth: 74}),
            requiredLevel: 29,
            valueInGold: 3100,
            description: 'Eski devlerin kemik iliğinden işlenmiş esnek ama kırılmaz ulu kargı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_22',
                name: 'Titan Menzili',
                description: 'Uzak mesafeden inanılmaz delici kuvvet uygular.',
                icon: '🗿'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_23',
            name: 'Ay Tutulması Gece Mızrağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 63, speed: 5, critChancePercent: 13, armor: 6, maxHealth: 74}),
            requiredLevel: 29,
            valueInGold: 3300,
            description: 'Işığı yansıtmaksızın karanlıkta görünmez olan suikastçı mızrağı.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_23',
                name: 'Görünmez Saplama',
                description: 'Düşmanın sıyrılma şansını tamamen yok eder.',
                icon: '🌑'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_24',
            name: 'Cehennem Dökümü Baş Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 63, speed: 5, critChancePercent: 13, armor: 6, maxHealth: 74}),
            requiredLevel: 29,
            valueInGold: 3500,
            description: 'Yeraltı körüklerinde kızdırılmış, temas ettiği çeliği büken ağır teber.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_24',
                name: 'Cehennem Kancası',
                description: 'Kalkan bloklarını eriterek zırhı aşar.',
                icon: '🔥'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_25',
            name: 'Hisar Muhafız Komutanı Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 63, speed: 5, critChancePercent: 13, armor: 6, maxHealth: 74}),
            requiredLevel: 29,
            valueInGold: 3650,
            description: 'Garnizon komutanına takdim edilen, surların sarsılmazlığını taşıyan kargı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_25',
                name: 'Hisar İradesi',
                description: 'Dövüşçüye yüksek zırh ve hasar kazandırır.',
                icon: '🏰'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_26',
            name: 'Kızıl Sülük Kan Mızrağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 63, speed: 5, critChancePercent: 13, armor: 6, maxHealth: 74}),
            requiredLevel: 29,
            valueInGold: 3800,
            description: 'Saplandıkça hasmın kanını emen ve sahibine aktaran efsunlu kargı.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_26',
                name: 'Kan Bağı',
                description: 'Verilen delici hasarın bir kısmını cana dönüştürür.',
                icon: '🩸'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_27',
            name: 'Gök Kubbe Yıldız Zıpkını',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 68, speed: 6, critChancePercent: 14, armor: 7, maxHealth: 80}),
            requiredLevel: 30,
            valueInGold: 4050,
            description: 'Kozmik meteoritlerden dövülmüş, yıldız ışığıyla parıldayan delici zıpkın.',
            weaponType: 'zıpkın',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_27',
                name: 'Yıldız İğnesi',
                description: 'Zırhı tamamen yok sayan saf delici hasar.',
                icon: '✨'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_28',
            name: 'Sonsuz Kar Fırtınası Baş Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 68, speed: 6, critChancePercent: 14, armor: 7, maxHealth: 80}),
            requiredLevel: 30,
            valueInGold: 4350,
            description: 'Kuzeyin ebedi karlarında dokunmuş, savruldukça boran koparan teber.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_28',
                name: 'Buzul Fırtınası',
                description: 'Hasmın saldırı hızını ve hareketini dondurur.',
                icon: '🌨️'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_29',
            name: 'Karanlık Zindan Hortlak Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 72, speed: 6, critChancePercent: 14, armor: 7, maxHealth: 86}),
            requiredLevel: 31,
            valueInGold: 4650,
            description: 'Zindan diplerinde yitip giden ruhların çığlıklarını taşıyan kara mızrak.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_29',
                name: 'Ruh Delici',
                description: 'Doğrudan hasmın iç direncini yıkar.',
                icon: '☠️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_30',
            name: 'Şimşek Tanrısının Üç Dişlisi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 72, speed: 6, critChancePercent: 14, armor: 7, maxHealth: 86}),
            requiredLevel: 31,
            valueInGold: 4950,
            description: 'Gök tanrısının elindeki üçlü şimşeği andıran ilahi kargı.',
            weaponType: 'üç dişli',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_30',
                name: 'Gök Çatalı',
                description: 'Üç noktadan hedefe yıldırım indirir.',
                icon: '🌩️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_31',
            name: 'Kızıl Ejderha Dili Savaş Mızrağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 76, speed: 6, critChancePercent: 15, armor: 8, maxHealth: 92}),
            requiredLevel: 32,
            valueInGold: 5250,
            description: 'Ejderha alevinin merkezinde tavlanmış, dokunduğu zırhı eriten mızrak.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_31',
                name: 'Alev Dili',
                description: 'Kavurucu alevle zırh katmanlarını yok eder.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_32',
            name: 'Zaman Eğen Boyut Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 76, speed: 6, critChancePercent: 15, armor: 8, maxHealth: 92}),
            requiredLevel: 32,
            valueInGold: 5550,
            description: 'Uzayı ve mesafeyi bükerek hasmın göz açıp kapayıncaya kadar yanına ulaşan teber.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_32',
                name: 'Boyut Atlama',
                description: 'Mesafe tanımaksızın ani kritik vuruş uygular.',
                icon: '⏳'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_33',
            name: 'Gladyatör Fatihi Ulu Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 80, speed: 7, critChancePercent: 16, armor: 8, maxHealth: 98}),
            requiredLevel: 33,
            valueInGold: 5850,
            description: 'Taş Hisar arenasında onlarca canavarı yere sermiş kanlı zafer kargısı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_33',
                name: 'Arenanın Hükmü',
                description: 'Can %30 altındayken hasarı %30 katlar.',
                icon: '🏆'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_34',
            name: 'Titan Mızrağı \'Gökdelen\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 80, speed: 7, critChancePercent: 16, armor: 8, maxHealth: 98}),
            requiredLevel: 33,
            valueInGold: 6150,
            description: 'Göğe uzanan kuleler gibi devasa boyutta, sarsılmaz çelik delici mızrak.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_34',
                name: 'Gökdelen Saplaması',
                description: 'Ağır hedefleri tek darbede yere serer.',
                icon: '🏛️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_35',
            name: 'Mutlak Sıfır Dondurucu Zıpkın',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 85, speed: 7, critChancePercent: 16, armor: 9, maxHealth: 104}),
            requiredLevel: 34,
            valueInGold: 6450,
            description: 'Dokunduğu vücut ısısını mutlak sıfıra indiren kristal uçlu zıpkın.',
            weaponType: 'zıpkın',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_35',
                name: 'Mutlak Donma',
                description: 'Düşmanın tepki verme hızını sıfıra yaklaştırır.',
                icon: '🧊'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_36',
            name: 'Araf Harı Cehennem Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 85, speed: 7, critChancePercent: 16, armor: 9, maxHealth: 104}),
            requiredLevel: 34,
            valueInGold: 6750,
            description: 'Araf\'ın sönmez ateşinde yanmış, ruhları dağlayan kutsal kargı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_36',
                name: 'Araf Közü',
                description: 'Fiziksel savunmaları aşan içsel hasar.',
                icon: '🔥'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_37',
            name: 'Fırtına Kralı Gök Gönderi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 89, speed: 8, critChancePercent: 17, armor: 9, maxHealth: 110}),
            requiredLevel: 35,
            valueInGold: 7050,
            description: 'Fırtına rüzgarlarıyla dönen sivri temreniyle delinemez zırh tanımayan silah.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_37',
                name: 'Kasırga Burgusu',
                description: 'Burgu gibi dönerek zırhı delip geçer.',
                icon: '🌪️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_38',
            name: 'Kara Büyü Bozan Rünik Teber',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 89, speed: 8, critChancePercent: 17, armor: 9, maxHealth: 110}),
            requiredLevel: 35,
            valueInGold: 7350,
            description: 'Büyüsel zırhları ve kalkanları anında parçalayan anti-büyü rünlü teber.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_38',
                name: 'Büyü Yırtığı',
                description: 'Mistik korumaları un ufak eder.',
                icon: '🔮'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_39',
            name: 'Girdap Ejderhası Üç Dişlisi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 89, speed: 8, critChancePercent: 17, armor: 9, maxHealth: 110}),
            requiredLevel: 35,
            valueInGold: 7650,
            description: 'Deniz fırtınalarını kucaklayan, düşmanı girdap gibi içine çeken mızrak.',
            weaponType: 'üç dişli',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_39',
                name: 'Girdap Çekimi',
                description: 'Hasmı savurarak sıyrılma şansını sıfırlar.',
                icon: '🌊'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_40',
            name: 'Taş Hisar Generali Altın Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 89, speed: 8, critChancePercent: 17, armor: 9, maxHealth: 110}),
            requiredLevel: 35,
            valueInGold: 7950,
            description: 'Garnizon başkomutanının resmi hücum kargısı; önünde hiçbir ordu duramaz.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_40',
                name: 'Muzaffer Gönder',
                description: 'Tüm dövüş niteliklerini belirgin şekilde besler.',
                icon: '👑'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_warspear_41',
            name: 'Kıyamet Mahşeri Ulu Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 93, speed: 8, critChancePercent: 18, armor: 10, maxHealth: 116}),
            requiredLevel: 36,
            valueInGold: 8300,
            description: 'Yerin altındaki lav nehirlerinin merkezinde sivriltilmiş ilahi mızrak.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_41',
                name: 'Mahşer Deleni',
                description: 'Zırhı sıvılaştıran muazzam delici güç.',
                icon: '🌋'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_warspear_42',
            name: 'Sonsuz Buzul Ebedi Mızrağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 93, speed: 8, critChancePercent: 18, armor: 10, maxHealth: 116}),
            requiredLevel: 36,
            valueInGold: 8700,
            description: 'Kuzeyin ebedi kristalinden yontulmuş, değdiği yeri donduran başmızrak.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_42',
                name: 'Ebedi Kırağı',
                description: 'Düşmanın kan akışını durdurup dondurur.',
                icon: '🏔️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_warspear_43',
            name: 'Yıldırım Tanrısının Gök Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 98, speed: 8, critChancePercent: 18, armor: 10, maxHealth: 122}),
            requiredLevel: 37,
            valueInGold: 9200,
            description: 'Gökyüzünün en sert şimşeğini namlusuna hapseden, yeri göğü inleten teber.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_43',
                name: 'Gök Gazabı',
                description: 'Darbe anında zincirleme yıldırım patlatır.',
                icon: '⚡'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_warspear_44',
            name: 'Ejderhaların Şahı Kızıl Mızrak',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 98, speed: 8, critChancePercent: 18, armor: 10, maxHealth: 122}),
            requiredLevel: 37,
            valueInGold: 9700,
            description: 'Ejderha kralının göğüs kemiğinden sivriltilmiş mutlak alev mızrağı.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_44',
                name: 'Kızıl İğne',
                description: 'Arenayı kavuran alev dalgaları fışkırtır.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_warspear_45',
            name: 'Ölüm Meleğinin Ruh Delen Kargısı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 102, speed: 9, critChancePercent: 19, armor: 11, maxHealth: 128}),
            requiredLevel: 38,
            valueInGold: 10200,
            description: 'Ölümün soğuk nefesini taşıyan, ruhu bedenden ayıran kara kargı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_45',
                name: 'Ecel İğnesi',
                description: 'Can çalma ve hasmın tüm savunmalarını yıkma.',
                icon: '☠️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_warspear_46',
            name: 'Kozmik Tekillik Baş Zıpkını',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 102, speed: 9, critChancePercent: 19, armor: 11, maxHealth: 128}),
            requiredLevel: 38,
            valueInGold: 10700,
            description: 'Yıldızların kütle çekimini taşıyan, deldiği noktayı içine çeken zıpkın.',
            weaponType: 'zıpkın',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_46',
                name: 'Tekillik İtişi',
                description: 'Düşmanın gardını ve zırhını çökerterek ezer.',
                icon: '🌌'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_warspear_47',
            name: 'Zaman Delen Boyutsal Mızrak',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 106, speed: 9, critChancePercent: 20, armor: 11, maxHealth: 134}),
            requiredLevel: 39,
            valueInGold: 11200,
            description: 'Uzay-zaman sürekliliğini delen, hamlesi kaçınılmaz olan ilahi mızrak.',
            weaponType: 'mızrak',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_47',
                name: 'Kader Saplaması',
                description: 'Kaçınılmaz ve zırh tanımaz kritik vuruş.',
                icon: '⏳'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_warspear_48',
            name: 'Yaratılışın İlk Işığı Ulu Kargı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 106, speed: 9, critChancePercent: 20, armor: 11, maxHealth: 134}),
            requiredLevel: 39,
            valueInGold: 11500,
            description: 'Diyarın ilk şafağından kalan saf ışık cevheriyle dövülmüş başeser.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_48',
                name: 'İlk Şafak',
                description: 'Tüm karanlık güçleri ve zırhları dağıtır.',
                icon: '☀️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_warspear_49',
            name: 'Mahşer Süvarisinin Kıyım Teberi',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 106, speed: 9, critChancePercent: 20, armor: 11, maxHealth: 134}),
            requiredLevel: 39,
            valueInGold: 11800,
            description: 'Mahşerin kızıl atlısının kargısı; arenada kan nehirleri akıtır.',
            weaponType: 'teber',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_49',
                name: 'Kızıl Süvari',
                description: 'Vurulan her kritik darbede hasarı ikiye katlar.',
                icon: '🩸'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_warspear_50',
            name: 'Taş Hisar Hükümdarının \'Kraliyet Kargısı\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 106, speed: 9, critChancePercent: 20, armor: 11, maxHealth: 134}),
            requiredLevel: 39,
            valueInGold: 12000,
            description: 'Taş Hisar hanedanının en kıymetli egemenlik simgesi ulu kargı.',
            weaponType: 'kargı',
            weaponCategory: WeaponCategory.SPEAR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_spn_50',
                name: 'Kraliyet Gönderi',
                description: 'Arenada mutlak üstünlük ve zafer sağlar.',
                icon: '🏰'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        })
    ];
  },

  createDaggers() {
    return [
        new Equipment({
            id: 'eq_tash_dagger_01',
            name: 'Garnizon Nöbetçi Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 22, speed: 4, critChancePercent: 10, dodgeChancePercent: 4}),
            requiredLevel: 20,
            valueInGold: 500,
            description: 'Çizme içine gizlenebilen, yakın boğuşmalarda zırh aralıklarına saplanan çevik kama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_01',
                name: 'Çizme Hamlesi',
                description: 'Ani ve seri saplamalarla kritik isabet şansını artırır.',
                icon: '🔪'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_dagger_02',
            name: 'Sokak Hırsızının Stilettosu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 22, speed: 4, critChancePercent: 10, dodgeChancePercent: 4}),
            requiredLevel: 20,
            valueInGold: 560,
            description: 'İğne gibi sivri üçgen temreniyle en kalın derileri bile sessizce delen stiletto.',
            weaponType: 'stiletto',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_02',
                name: 'İğne Temren',
                description: 'Zırhın koruyucu katmanlarını delip geçer.',
                icon: '🗡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_dagger_03',
            name: 'Bozkır Süvari Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 26, speed: 4, critChancePercent: 11, dodgeChancePercent: 4}),
            requiredLevel: 21,
            valueInGold: 630,
            description: 'At üstünde acil durumlarda ip kesmek veya gırtlak biçmek için kullanılan hafif hançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_03',
                name: 'Süvari Sürati',
                description: 'Saldırı hızını belirgin şekilde yükseltir.',
                icon: '🐎'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_dagger_04',
            name: 'Çentikli Engerek Bıçağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 26, speed: 4, critChancePercent: 11, dodgeChancePercent: 4}),
            requiredLevel: 21,
            valueInGold: 700,
            description: 'Namlusu zikzaklı çentiklerle dolu, çıkarılırken derin yarıklar açan kalleş bıçak.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_04',
                name: 'Engerek Çentiği',
                description: 'Kritik vuruşlarda kanama bırakır.',
                icon: '🐍'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_dagger_05',
            name: 'Taş Hisar Gölge Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 30, speed: 5, critChancePercent: 12, dodgeChancePercent: 5}),
            requiredLevel: 22,
            valueInGold: 780,
            description: 'Mat siyah çelikten dövülmüş, meşale ışığını yansıtmayan sessiz garnizon kaması.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_05',
                name: 'Gölge Sinsisi',
                description: 'Düşmanın görüşünü şaşırtıp sıyrılma şansı verir.',
                icon: '🌑'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_dagger_06',
            name: 'Çift Taraflı Suikast Bıçağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 30, speed: 5, critChancePercent: 12, dodgeChancePercent: 5}),
            requiredLevel: 22,
            valueInGold: 860,
            description: 'Her iki tarafı da ustura keskinliğinde, el çabukluğuyla savrulan dengeli hançer.',
            weaponType: 'çift bıçak',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_06',
                name: 'Çifte Kesik',
                description: 'Seri saldırılarla hasarı katlar.',
                icon: '⚔️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_dagger_07',
            name: 'Kuzey Çakalı Pençe Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 34, speed: 5, critChancePercent: 13, dodgeChancePercent: 5}),
            requiredLevel: 23,
            valueInGold: 950,
            description: 'Kıvrık namlusu bir çakal pençesini andıran, boyun damarlarını hedefleyen hançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_07',
                name: 'Çakal Pençesi',
                description: 'Kritik vuruş hasarını artırır.',
                icon: '🐺'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_dagger_08',
            name: 'Kızıl Zehir Dökümlü Kama',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 34, speed: 5, critChancePercent: 13, dodgeChancePercent: 5}),
            requiredLevel: 23,
            valueInGold: 1040,
            description: 'Demirci ocağında zehirli maden sularıyla sertleştirilmiş yakıcı kama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_08',
                name: 'Kızıl Zehir',
                description: 'Hedefin kanına zehirli yanma aşılar.',
                icon: '🩸'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_dagger_09',
            name: 'Hisar Zindanı Sustalı Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 38, speed: 6, critChancePercent: 14, dodgeChancePercent: 6}),
            requiredLevel: 24,
            valueInGold: 1140,
            description: 'Gizli yay mekanizmasıyla anında fırlayan, gard almamış hasmı avlayan bıçak.',
            weaponType: 'sustalı',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_09',
                name: 'Yaylı Fırlama',
                description: 'Dövüşün ilk hamlelerinde yüksek hız sağlar.',
                icon: '⚡'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_dagger_10',
            name: 'Gözcü Çavuşu Palası',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 38, speed: 6, critChancePercent: 14, dodgeChancePercent: 6}),
            requiredLevel: 24,
            valueInGold: 1240,
            description: 'Geniş namlulu ağır hançer; hem keser hem de kılıç darbelerini saptırır.',
            weaponType: 'pala bıçak',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_10',
                name: 'Pala Saptırması',
                description: 'Yakın darbeleri saptırarak sıyrılma verir.',
                icon: '🛡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_dagger_11',
            name: 'Ayaz Çeliği Buzul Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 38, speed: 6, critChancePercent: 14, dodgeChancePercent: 6}),
            requiredLevel: 24,
            valueInGold: 1350,
            description: 'Kuzeyin dondurucu soğuğunda bilenen, değdiği deriyi uyuşturan kama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_11',
                name: 'Ayaz Uyuşması',
                description: 'Düşmanın karşı saldırı hızını yavaşlatır.',
                icon: '❄️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_dagger_12',
            name: 'Obsidyen Ağızlı İpek Hançer',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({damage: 38, speed: 6, critChancePercent: 14, dodgeChancePercent: 6}),
            requiredLevel: 24,
            valueInGold: 1470,
            description: 'Obsidyen keskinliğiyle ipek gibi pürüzsüz kesen, ses çıkarmayan başhançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_12',
                name: 'İpek Kesiği',
                description: 'Hasımdan durdurulamaz kan fışkırtır.',
                icon: '🖤'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_dagger_13',
            name: 'Kaya Delen Granit Kama',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 42, speed: 7, critChancePercent: 15, dodgeChancePercent: 6}),
            requiredLevel: 25,
            valueInGold: 1600,
            description: 'Elmas tozuyla bilenmiş granit kesicili, plaka zırh eklemlerine giren kama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_13',
                name: 'Kaya Yarığı',
                description: 'Düşmanın zırhını kırarak hasar verir.',
                icon: '🪨'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_14',
            name: 'Kızıl Ejder Pulu Hançer',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 42, speed: 7, critChancePercent: 15, dodgeChancePercent: 6}),
            requiredLevel: 25,
            valueInGold: 1740,
            description: 'Ejderha pulu kabzası terletmeyen, alevli saplamalar indiren suikast hançeri.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_14',
                name: 'Ejderha Sıcağı',
                description: 'Kritik darbelerde alev patlaması yapar.',
                icon: '🔥'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_15',
            name: 'Kutup Ayazı Buz Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 46, speed: 7, critChancePercent: 16, dodgeChancePercent: 7}),
            requiredLevel: 26,
            valueInGold: 1890,
            description: 'Asla erimeyen buzdan yapılmış gibi soğuk, hasmın kanını donduran stiletto.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_15',
                name: 'Buz İğnesi',
                description: 'Düşmanın atak reflekslerini dondurur.',
                icon: '🧊'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_16',
            name: 'Akbaba Gagası Suikast Bıçağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 46, speed: 7, critChancePercent: 16, dodgeChancePercent: 7}),
            requiredLevel: 26,
            valueInGold: 2040,
            description: 'Hasmın kalkan tutan elini hedef alan, geriye kıvrık kancalı pala-bıçak.',
            weaponType: 'çift bıçak',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_16',
                name: 'Kanca Saplama',
                description: 'Kalkan arkasındaki hedeflere hasar iletir.',
                icon: '🦅'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_17',
            name: 'Lejyon Casusu Gizli Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 50, speed: 8, critChancePercent: 17, dodgeChancePercent: 7}),
            requiredLevel: 27,
            valueInGold: 2200,
            description: 'Sınır ötelerine sızan casusların pelerin altında taşıdığı ölümcül kama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_17',
                name: 'Casusluk Mührü',
                description: 'Kritik şansını ve sıyrılma kabiliyetini besler.',
                icon: '🗝️'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_18',
            name: 'Kara Engerek Çift Bıçağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 50, speed: 8, critChancePercent: 17, dodgeChancePercent: 7}),
            requiredLevel: 27,
            valueInGold: 2360,
            description: 'İki elde birden fırtına gibi dönen, çifte zehir damlatan efsunlu bıçaklar.',
            weaponType: 'çift bıçak',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_18',
                name: 'Çifte Zehir',
                description: 'Hasıma peş peşe zehirli darbeler indirir.',
                icon: '🐍'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_19',
            name: 'Yıldırım Çeliği Seri Hançer',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 54, speed: 8, critChancePercent: 18, dodgeChancePercent: 8}),
            requiredLevel: 28,
            valueInGold: 2520,
            description: 'Savrulurken statik elektrik kıvılcımları saçan inanılmaz hafif hançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_19',
                name: 'Yıldırım Hamlesi',
                description: 'Saldırı hızını tavan yaptırır.',
                icon: '⚡'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_20',
            name: 'Bozkır Kurdu Dişli Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 54, speed: 8, critChancePercent: 18, dodgeChancePercent: 8}),
            requiredLevel: 28,
            valueInGold: 2700,
            description: 'Kurt dişi perçinli kemik kabza; avın boğazına kenetlenip bırakmaz.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_20',
                name: 'Boğaz Keneti',
                description: 'Kritik vuruş hasarını katlar.',
                icon: '🐺'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_21',
            name: 'Volkanik Çatlak Bıçağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 54, speed: 8, critChancePercent: 18, dodgeChancePercent: 8}),
            requiredLevel: 28,
            valueInGold: 2880,
            description: 'Lav kanalları parıldayan, saplandığı yerde et kavuran volkanik bıçak.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_21',
                name: 'Lav Püskürmesi',
                description: 'Zırhı eriten içten yanmalı hasar.',
                icon: '🌋'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_22',
            name: 'Titan Kemikli Suikast Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 58, speed: 9, critChancePercent: 19, dodgeChancePercent: 8}),
            requiredLevel: 29,
            valueInGold: 3080,
            description: 'Kadim titan kemiğinden yontulmuş kırılmaz gövdeli dev kama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_22',
                name: 'Titan Kırışı',
                description: 'Fiziksel hasarı devasa oranda artırır.',
                icon: '🗿'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_23',
            name: 'Ay Tutulması Gölge Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 58, speed: 9, critChancePercent: 19, dodgeChancePercent: 8}),
            requiredLevel: 29,
            valueInGold: 3280,
            description: 'Zifiri karanlıkta parlamayan, gölgeler arasından fırlayan hançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_23',
                name: 'Zifiri Saplama',
                description: 'Hasmın savunma reflekslerini köreltir.',
                icon: '🌑'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_24',
            name: 'Cehennem Kıvılcımı Stilettosu',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 58, speed: 9, critChancePercent: 19, dodgeChancePercent: 8}),
            requiredLevel: 29,
            valueInGold: 3480,
            description: 'Araf ateşinde bekletilmiş, çeliği kükürtle parlayan iğne stiletto.',
            weaponType: 'stiletto',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_24',
                name: 'Araf İğnesi',
                description: 'Zırhı tamamen yok sayan saf delici vuruş.',
                icon: '🔥'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_25',
            name: 'Büyük Han\'ın Gizli Bıçağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 58, speed: 9, critChancePercent: 19, dodgeChancePercent: 8}),
            requiredLevel: 29,
            valueInGold: 3620,
            description: 'Bozkır hanlarının çizmelerinde sakladığı paha biçilmez fildişi kama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_25',
                name: 'Han Hamlesi',
                description: 'Dövüşçünün kritik ve hızını zirveye taşır.',
                icon: '👑'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_26',
            name: 'Kızıl Sülük Vampir Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 58, speed: 9, critChancePercent: 19, dodgeChancePercent: 8}),
            requiredLevel: 29,
            valueInGold: 3760,
            description: 'Saplandıkça hasmın hayat enerjisini sahibine aktaran kara büyü hançeri.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_26',
                name: 'Kan Sömürüsü',
                description: 'Vurulan her kritik darbede can çeker.',
                icon: '🩸'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_27',
            name: 'Gök Kubbe Yıldız Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 62, speed: 10, critChancePercent: 20, dodgeChancePercent: 9}),
            requiredLevel: 30,
            valueInGold: 4000,
            description: 'Kozmik taşlardan dökülmüş, savruldukça arkasında yıldız tozu bırakan hançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_27',
                name: 'Yıldız Tozu',
                description: 'Kritik isabeti ve atak hızını uçurur.',
                icon: '✨'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_28',
            name: 'Sonsuz Kar Fırtınası Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 62, speed: 10, critChancePercent: 20, dodgeChancePercent: 9}),
            requiredLevel: 30,
            valueInGold: 4300,
            description: 'Kuzey dağlarının zirvesindeki ebedi soğukla mühürlenmiş buzul kaması.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_28',
                name: 'Ayaz Kesisi',
                description: 'Hasmın kaslarını kasıp dondurur.',
                icon: '🌨️'
            }),
            maxSockets: 2,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_29',
            name: 'Karanlık Zindan İşkence Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 66, speed: 10, critChancePercent: 21, dodgeChancePercent: 9}),
            requiredLevel: 31,
            valueInGold: 4600,
            description: 'Yüz yıllık zindanlarda kana doymuş, kemik aralayan acımasız stiletto.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_29',
                name: 'Kemik Sızlatıcı',
                description: 'Düşmanın direncini sıfıra indirir.',
                icon: '☠️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_30',
            name: 'Şimşek Tanrısının Çift Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 66, speed: 10, critChancePercent: 21, dodgeChancePercent: 9}),
            requiredLevel: 31,
            valueInGold: 4900,
            description: 'Gökyüzünün şimşeklerini iki elde toplayan fırtına bıçakları.',
            weaponType: 'çift bıçak',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_30',
                name: 'Şimşek Dansı',
                description: 'Ardışık elektrik darbeleriyle düşmanı sersemletir.',
                icon: '🌩️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_31',
            name: 'Kızıl Ejderha Dişi Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 70, speed: 11, critChancePercent: 22, dodgeChancePercent: 10}),
            requiredLevel: 32,
            valueInGold: 5200,
            description: 'Ejderha azı dişinden oyulmuş, değdiği yeri küle çeviren alevli bıçak.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_31',
                name: 'Ejderha Isırığı',
                description: 'Kavurucu zırh eritici hasar uygular.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_32',
            name: 'Zaman Büken Boyut Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 70, speed: 11, critChancePercent: 22, dodgeChancePercent: 10}),
            requiredLevel: 32,
            valueInGold: 5500,
            description: 'Zamanı bükerek hasmın arkasında aniden belirmeyi sağlayan mistik kama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_32',
                name: 'Gölge Adımı',
                description: 'Sıyrılma şansını ve ani kritik atağı artırır.',
                icon: '⏳'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_33',
            name: 'Gladyatör Katili Arenası Bıçağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 74, speed: 11, critChancePercent: 23, dodgeChancePercent: 10}),
            requiredLevel: 33,
            valueInGold: 5800,
            description: 'Taş Hisar arenasında onlarca şampiyonun gırtlağını kesmiş meşhur hançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_33',
                name: 'Arenanın Şehveti',
                description: 'Düşman canı azaldıkça hasarı katlanır.',
                icon: '🩸'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_34',
            name: 'Titan Yumruğu Çift Bıçağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 74, speed: 11, critChancePercent: 23, dodgeChancePercent: 10}),
            requiredLevel: 33,
            valueInGold: 6100,
            description: 'Titanların gücünü iki bıçak savuruşuna yükleyen inanılmaz kuvvetli hançerler.',
            weaponType: 'çift bıçak',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_34',
                name: 'Titan Dansı',
                description: 'Hançer olmasına rağmen ağır hasar indirir.',
                icon: '👊'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_35',
            name: 'Mutlak Sıfır Kristal Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 78, speed: 12, critChancePercent: 24, dodgeChancePercent: 11}),
            requiredLevel: 34,
            valueInGold: 6400,
            description: 'Saf buzul cevherinden yontulmuş, değdiği kanı kristalleştiren kama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_35',
                name: 'Kristal Donuş',
                description: 'Düşmanın hareketini felç eder.',
                icon: '🧊'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_36',
            name: 'Araf Kıvılcımı Baş Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 78, speed: 12, critChancePercent: 24, dodgeChancePercent: 11}),
            requiredLevel: 34,
            valueInGold: 6700,
            description: 'Araf\'ta yanan ruhların öfkesini taşıyan, ruh dağlayan kutsal hançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_36',
                name: 'Ruh Yakan',
                description: 'Zırhı tamamen aşan doğrudan can hasarı.',
                icon: '🔥'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_37',
            name: 'Fırtına Kralı Kasırga Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 82, speed: 13, critChancePercent: 25, dodgeChancePercent: 11}),
            requiredLevel: 35,
            valueInGold: 7000,
            description: 'Rüzgarı bir hançer gibi bileyen, gözle görülemeyen hızda savrulan kama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_37',
                name: 'Kasırga Hızı',
                description: 'Atak hızını tavan yaptırır ve darbe ıskalatmaz.',
                icon: '🌪️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_38',
            name: 'Kara Büyücü Gırtlağı Kesen',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 82, speed: 13, critChancePercent: 25, dodgeChancePercent: 11}),
            requiredLevel: 35,
            valueInGold: 7300,
            description: 'Mistik kalkanları ve büyü zırhlarını jilet gibi yaran anti-büyü hançeri.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_38',
                name: 'Büyü Delici',
                description: 'Büyücülerin manevi kalkanlarını parçalar.',
                icon: '🔮'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_39',
            name: 'Girdap Fırtınası Çift Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 82, speed: 13, critChancePercent: 25, dodgeChancePercent: 11}),
            requiredLevel: 35,
            valueInGold: 7600,
            description: 'İki elde savruldukça hortum gibi dönen ölümcül ikiz bıçaklar.',
            weaponType: 'çift bıçak',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_39',
                name: 'Hortum Dansı',
                description: 'Düşmanın dengesini tamamen yok eder.',
                icon: '🌀'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_40',
            name: 'Taş Hisar Başcasusu Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({damage: 82, speed: 13, critChancePercent: 25, dodgeChancePercent: 11}),
            requiredLevel: 35,
            valueInGold: 7900,
            description: 'Hisarın en kıdemli suikastçısına mahsus, altın işlemeli kusursuz hançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_40',
                name: 'Garnizon Suikasti',
                description: 'Kritik şansını ve saldırı gücünü zirveye taşır.',
                icon: '👑'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_dagger_41',
            name: 'Kıyamet Mahşeri Kara Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 86, speed: 13, critChancePercent: 26, dodgeChancePercent: 12}),
            requiredLevel: 36,
            valueInGold: 8250,
            description: 'Yerin altındaki magma nehirlerinde sertleştirilmiş, dokunduğu zırhı eriten kama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_41',
                name: 'Mahşer Kıvılcımı',
                description: 'Muazzam hasar ve zırh eritme.',
                icon: '🌋'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_dagger_42',
            name: 'Sonsuz Buzul Ebedi Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 86, speed: 13, critChancePercent: 26, dodgeChancePercent: 12}),
            requiredLevel: 36,
            valueInGold: 8650,
            description: 'Kuzeyin ebedi buzundan yontulmuş, hasmın kalbini donduran başhançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_42',
                name: 'Ebedi Ayaz',
                description: 'Düşmanın kan akışını anında dondurur.',
                icon: '🏔️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_dagger_43',
            name: 'Yıldırım Tanrısının Gök Bıçağı',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 90, speed: 14, critChancePercent: 27, dodgeChancePercent: 12}),
            requiredLevel: 37,
            valueInGold: 9150,
            description: 'Gökyüzünün ilk yıldırımından dövülmüş, ışık hızında savrulan ilahi hançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_43',
                name: 'Işık Hızı',
                description: 'Hasmı göz açıp kapayıncaya kadar biçer.',
                icon: '⚡'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_dagger_44',
            name: 'Ejderhaların Efendisi Kızıl Kama',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 90, speed: 14, critChancePercent: 27, dodgeChancePercent: 12}),
            requiredLevel: 37,
            valueInGold: 9650,
            description: 'Kadim ejderha kralının pençesinden işlenmiş, alev püskürten başkama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_44',
                name: 'Ejderha Pençesi',
                description: 'Arenayı alev fırtınasına çeviren kritik darbe.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_dagger_45',
            name: 'Ölüm Meleğinin Ruh Tırpanı Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 94, speed: 14, critChancePercent: 28, dodgeChancePercent: 13}),
            requiredLevel: 38,
            valueInGold: 10150,
            description: 'Ölümün soğuk dokunuşunu taşıyan, ruhları gövdeden çekip alan kara hançer.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_45',
                name: 'Ruh Tırpanı',
                description: 'Can çalma ve mutlak zırh delme.',
                icon: '☠️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_dagger_46',
            name: 'Kozmik Tekillik Çift Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 94, speed: 14, critChancePercent: 28, dodgeChancePercent: 13}),
            requiredLevel: 38,
            valueInGold: 10650,
            description: 'Yıldızların çekirdeğindeki yoğun maddeden dövülmüş ikiz boyut bıçakları.',
            weaponType: 'çift bıçak',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_46',
                name: 'Tekillik Dansı',
                description: 'Fizik yasalarını aşan akıl almaz hız ve hasar.',
                icon: '🌌'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_dagger_47',
            name: 'Zaman Yırtan Boyutsal Kama',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 98, speed: 15, critChancePercent: 29, dodgeChancePercent: 13}),
            requiredLevel: 39,
            valueInGold: 11150,
            description: 'Uzay-zaman sürekliliğini jilet gibi kesen, kaçınılmaz kadim kama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_47',
                name: 'Zaman Yırtığı',
                description: 'Kaçınılmaz ve engellenemez kritik infaz.',
                icon: '⏳'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_dagger_48',
            name: 'Yaratılışın İlk Kıvılcımı Hançeri',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 98, speed: 15, critChancePercent: 29, dodgeChancePercent: 13}),
            requiredLevel: 39,
            valueInGold: 11450,
            description: 'Diyarın ilk ateşinden kalan cevherle parıldayan, dokunduğu zırhı buharlaştıran başeser.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_48',
                name: 'İlk Kıvılcım',
                description: 'Tüm savunmaları sıfırlayan mutlak yakış.',
                icon: '☀️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_dagger_49',
            name: 'Mahşer Süvarisinin Gizli Kaması',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 98, speed: 15, critChancePercent: 29, dodgeChancePercent: 13}),
            requiredLevel: 39,
            valueInGold: 11750,
            description: 'Mahşerin kara süvarisine mahsus, girdiği vücuttan canı söküp alan kama.',
            weaponType: 'kama',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_49',
                name: 'Kara Mahşer',
                description: 'Vurulan her kritik darbede hasarı ikiye katlar.',
                icon: '☄️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_dagger_50',
            name: 'Taş Hisar Hükümdarının \'Kraliyet Hançeri\'',
            slot: EquipmentSlot.WEAPON,
            rarity: ItemRarity.KADIM,
            stats: new Stats({damage: 98, speed: 15, critChancePercent: 29, dodgeChancePercent: 13}),
            requiredLevel: 39,
            valueInGold: 12000,
            description: 'Taş Hisar\'ın taht odasında korunan, kraliyet hanedanının en sinsi ve kudretli hançeri.',
            weaponType: 'hançer',
            weaponCategory: WeaponCategory.DAGGER,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_dg_50',
                name: 'Kraliyet Gölgesi',
                description: 'Arenada mutlak üstünlük ve kusursuz infaz gücü.',
                icon: '🏰'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        })
    ];
  },

};
