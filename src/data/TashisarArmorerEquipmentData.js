import { ArmorCategory, Equipment, EquipmentSlot, EquipmentSpecialTrait, ItemRarity, Stats } from '../domain/model.js';

/**
 * 2. Bölüm (Taş Hisar) Zırhçısı Ulfric için 100 Adet Egzotik Ekipman:
 * - 50 Adet Ağır Plaka Zırh (ArmorCategory.HEAVY_ARMOR)
 * - 50 Adet Savaş Çizmesi & Ayakkabı (ArmorCategory.BOOTS)
 * Seviyeler: 20 - 39 Arası
 * Fiyatlar: 500 - 12.000 Altın Arası
 * Her ekipmanda özgün ve egzotik özel nitelikler (specialTrait) ve taş soketleri bulunmaktadır.
 */
export const TashisarArmorerEquipmentData = {

  createHeavyArmors() {
    return [
        new Equipment({
            id: 'eq_tash_harmor_01',
            name: 'Taş Hisar Perçinli Göğüslüğü',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 16, maxHealth: 45}),
            requiredLevel: 20,
            valueInGold: 550,
            description: 'Garnizon piyadeleri için dövülmüş, göğsü ve kaburgaları saran kalın perçinli çelik göğüslük.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_01',
                name: 'Perçinli Siper',
                description: 'Dövme çelik plakalar kılıç darbelerinin göğse batmasını önler.',
                icon: '🛡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_02',
            name: 'Nöbetçi Çelik Hauberk\'i',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 17, maxHealth: 50, blockChancePercent: 4}),
            requiredLevel: 20,
            valueInGold: 620,
            description: 'Sık dokunmuş çelik halkalardan örülmüş, üzerine demir plakalar perçinlenmiş ağır garnizon zırhı.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_02',
                name: 'Halkalı Örgü',
                description: 'Sık çelik halkalar delici hançer ve ok uçlarını dağıtır.',
                icon: '⛓️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_03',
            name: 'Dağ Devriyesi Plaka Yeleği',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 18, maxHealth: 55, speed: 1}),
            requiredLevel: 20,
            valueInGold: 700,
            description: 'Sarp kayalıklarda nöbet tutan devriyelerin hareket kabiliyetini koruyan mafsallı plaka yelek.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_03',
                name: 'Mafsallı Gövde',
                description: 'Esnek eklemler ağır çeliğe rağmen rahat nefes almayı sağlar.',
                icon: '🥋'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_04',
            name: 'Sınır Muhafızı Ağır Cuirass\'ı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 19, maxHealth: 60}),
            requiredLevel: 21,
            valueInGold: 780,
            description: 'Dağ yollarındaki pusularda balta ve gürz darbelerini karşılamak için çift kat dövülmüş cuirass.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_04',
                name: 'Çift Kat Plaka',
                description: 'Geniş göğüs bombesi dik darbeleri yanlara sektirir.',
                icon: '🛡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_05',
            name: 'Buzul Geçidi Dövme Zırhı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 20, maxHealth: 65, blockChancePercent: 5}),
            requiredLevel: 21,
            valueInGold: 860,
            description: 'Ayaz rüzgarlarında donmayan özel alaşımlı çelikten mamul, sırtı ve karnı tam kapatan zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_05',
                name: 'Ayaz Sertliği',
                description: 'Soğuk hava çeliği daha da pekiştirerek darbe direncini artırır.',
                icon: '❄️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_06',
            name: 'Granit Ocakçı Demir Gövdelik',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 21, maxHealth: 70}),
            requiredLevel: 21,
            valueInGold: 950,
            description: 'Taş ocaklarında kaya kırıcıların kullandığı, düşen taş bloklarına dayanıklı masif göğüslük.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_06',
                name: 'Kaya Kırıcı Göğüs',
                description: 'Yukarıdan inen ağır balyoz darbelerinin sarsıntısını emer.',
                icon: '⛏️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_07',
            name: 'Hisar Burç Muhafızı Plakası',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 22, maxHealth: 75, blockChancePercent: 5}),
            requiredLevel: 22,
            valueInGold: 1050,
            description: 'Surların tepesinde rüzgara ve oklara karşı koyan nizam askerlerinin ağır dövme demir plakası.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_07',
                name: 'Burç Siperi',
                description: 'Ağır göğüs kalkanı gibi durarak hasmın hücum hızını keser.',
                icon: '🏰'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_08',
            name: 'Kuzey Süvari Ağır Zırhı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 23, maxHealth: 80, speed: 2}),
            requiredLevel: 22,
            valueInGold: 1150,
            description: 'At sırtında hücuma kalkan kıdemli süvariler için tasarlanmış, omuzluklu ağır çelik zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_08',
                name: 'Süvari Zırhı',
                description: 'Geniş omuzluklar kılıç inmelerine karşı boyun kökünü korur.',
                icon: '🏇'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_09',
            name: 'Dikenli Bronz Garnizon Plakası',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 23, maxHealth: 80, damage: 4}),
            requiredLevel: 22,
            valueInGold: 1250,
            description: 'Omuz başlarında bronz koruyucu dikenler barındıran, yakın temasta hasmı hırpalayan zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_09',
                name: 'Omuz Dikenleri',
                description: 'Güreş ve yakın temas hamlelerinde hasmın omzuna batar.',
                icon: '🦔'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_10',
            name: 'Nehir Muhafızı Çelik Pul Zırhı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 24, maxHealth: 88}),
            requiredLevel: 23,
            valueInGold: 1350,
            description: 'Çelik pulların birbirine perçinlenmesiyle yapılan, su sıçramalarına ve paslanmaya dayanıklı zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_10',
                name: 'Çelik Pul Dizilimi',
                description: 'Balık pulu gibi binen çelik katmanlar kılıç kesiklerini kaydırır.',
                icon: '🐟'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_11',
            name: 'Granit Kaplama Ağır Göğüslük',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 25, maxHealth: 95, blockChancePercent: 6}),
            requiredLevel: 23,
            valueInGold: 1480,
            description: 'Çelik iskelet üzerine granit taş plakalar tutturulmuş, taş gibi sert garnizon göğüslüğü.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_11',
                name: 'Granit Zırh Katı',
                description: 'Granit plakalar delici silahların sivri uçlarını kırarak durdurur.',
                icon: '🪨'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_12',
            name: 'Dağ Fırtınası Plaka Cuirass\'ı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 26, maxHealth: 100, speed: 1}),
            requiredLevel: 23,
            valueInGold: 1600,
            description: 'Kuvvetli dağ rüzgarlarına karşı koyan, aerodinamik çelik hatlara sahip dayanıklı cuirass.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_12',
                name: 'Fırtına Hattı',
                description: 'Rüzgar kanalları sayesinde dövüşçünün nefes alışını ferahlatır.',
                icon: '💨'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_13',
            name: 'Kuşatma Öncüsü Masif Zırhı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 27, maxHealth: 110, blockChancePercent: 6}),
            requiredLevel: 24,
            valueInGold: 1750,
            description: 'Koçbaşı taşıyan veya merdiven tırmanan öncülerin giydiği, kalın dökme demir plaka.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_13',
                name: 'Öncü Çeliği',
                description: 'Doğrudan göğse çarpan gülle parçalarını delinmeden göğüsler.',
                icon: '🧱'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_14',
            name: 'Dövme Demir Kartal Göğüslüğü',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 28, maxHealth: 115, critChancePercent: 5}),
            requiredLevel: 24,
            valueInGold: 1900,
            description: 'Göğsünde kabartma bir kartal amblemi bulunan, komutan muhafızlarına layık sağlam zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_14',
                name: 'Kartal Amblemi',
                description: 'Kartal motifi savaşçıya yüksek moral ve saldırgan vuruş gücü katar.',
                icon: '🦅'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_15',
            name: 'Ayaz Dişi Ağır Hauberk',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 29, maxHealth: 120}),
            requiredLevel: 24,
            valueInGold: 2050,
            description: 'Kuzeyin buz kristalleriyle sertleştirilmiş halkalardan örülmüş, delinmez ağır hauberk.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_15',
                name: 'Buz Kristali Sertliği',
                description: 'Buzul alaşımlı halkalar kılıç uçlarına karşı kırılmaz bir ağ oluşturur.',
                icon: '❄️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_16',
            name: 'Lejyoner Subay Plaka Zırhı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 30, maxHealth: 130, blockChancePercent: 7}),
            requiredLevel: 25,
            valueInGold: 2250,
            description: 'Nizamlı lejyon birliklerinin yüzbaşıları için bronz kenarlıklarla süslenmiş parlak çelik zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_16',
                name: 'Yüzbaşı Nizamı',
                description: 'Nizamlı duruş savaşçının aldığı darbelerin etkisini %15 azaltır.',
                icon: '🎖️'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_17',
            name: 'Obsidyen Kakmalı Ağır Göğüslük',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 31, maxHealth: 135, speed: 2}),
            requiredLevel: 25,
            valueInGold: 2450,
            description: 'Plakalarının arasına volkanik obsidyen şeritler yerleştirilmiş, ışık geçirmeyen karanlık zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_17',
                name: 'Kara Cam Kırılmazlığı',
                description: 'Obsidyen şeritler büyü ve kılıç darbelerinin temasını saptırır.',
                icon: '🌋'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_18',
            name: 'Bozkır Kurdu Masif Zırhı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 32, maxHealth: 140, damage: 6}),
            requiredLevel: 25,
            valueInGold: 2650,
            description: 'Omuzluklarında kurt başı kabartmaları yükselen, vahşi ve kudretli gladyatör zırhı.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_18',
                name: 'Kurt Pençesi Gücü',
                description: 'Vahşi kurt tasarımı savaşçıya yakın dövüşte ekstra darbe gücü verir.',
                icon: '🐺'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_19',
            name: 'Volkan Külü Çelik Cuirass',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 33, maxHealth: 150, blockChancePercent: 7}),
            requiredLevel: 26,
            valueInGold: 2850,
            description: 'Volkanik küllerin demir ergiyikle karıştırılmasıyla dökülen, yüksek ısıya ve darbeye dayanıklı cuirass.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_19',
                name: 'Kül Alaşımı',
                description: 'Isıya dayanıklı katman yanıcı hasarları söndürür ve göğsü korur.',
                icon: '🔥'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_20',
            name: 'Çift Kanatlı Şövalye Plakası',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 34, maxHealth: 155, speed: 3}),
            requiredLevel: 26,
            valueInGold: 3100,
            description: 'Sırtında çelikten stilize kanat plakaları uzanan, asil şövalyelerin taşıdığı muazzam zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_20',
                name: 'Kanat Desteği',
                description: 'Sırt kanatları ani darbe aldığında arkaya savrulmayı önler.',
                icon: '🪽'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_21',
            name: 'Şimşek Damarlı Ağır Zırh',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 35, maxHealth: 160, critChancePercent: 7}),
            requiredLevel: 26,
            valueInGold: 3350,
            description: 'Gök gürültülü fırtınada dövülmüş, mavi çelik yivlerinden elektrik kıvılcımları geçen zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_21',
                name: 'Statik Yük',
                description: 'Göğse inen kılıç darbeleri hasma hafif bir statik elektrik şoku iletir.',
                icon: '⚡'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_harmor_22',
            name: 'Safir Kakmalı Şövalye Zırhı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 36, maxHealth: 170, blockChancePercent: 8}),
            requiredLevel: 27,
            valueInGold: 3650,
            description: 'Göğüs kafesinde devasa bir safir yuvası barındıran, kraliyet muhafız alayının tören zırhı.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_22',
                name: 'Safir Kalkan',
                description: 'Kraliyet safiri darbe anında koruyucu bir enerji kalkanı yayar.',
                icon: '💎'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_23',
            name: 'Hisar Başmuhafızı Kapalı Plakası',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 37, maxHealth: 180}),
            requiredLevel: 27,
            valueInGold: 3950,
            description: 'Kolluk ve bacak zırhlarıyla kusursuz kilitlenen, tek bir aralık bırakmayan tam kapalı plaka.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_23',
                name: 'Aralıksız Kilit',
                description: 'Hiçbir hançer ucu bu kapalı zırhın eklem yerlerine sızamaz.',
                icon: '🔒'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_24',
            name: 'Dağ Aslanı Göğüs Plakası',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 38, maxHealth: 185, damage: 7}),
            requiredLevel: 27,
            valueInGold: 4250,
            description: 'Dağ aslanlarının sağlam kaburgalarından esinlenilmiş, darbeleri göğüste ezen yırtıcı zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_24',
                name: 'Aslan Göğsü',
                description: 'Geniş göğüs kafesi alanı darbeleri eşit dağıtarak nefesi korur.',
                icon: '🦁'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_25',
            name: 'Ejder Pulu Ağır Gövdelik',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 39, maxHealth: 195, blockChancePercent: 8}),
            requiredLevel: 28,
            valueInGold: 4600,
            description: 'Hakiki ejderha pullarının kalın çelik zırh üstüne perçinlenmesiyle üretilmiş efsanevi gövdelik.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_25',
                name: 'Ejder Derisi Katmanı',
                description: 'Ejderha pulları hem kesici hem de delici hücumları kırar.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_26',
            name: 'Tunç Gerdanlıklı Ağır Cuirass',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 40, maxHealth: 205}),
            requiredLevel: 28,
            valueInGold: 4950,
            description: 'Boynu ve boğazı kalın tunç halkalarla saran, kılıç giyotinlerini dahi durduran cuirass.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_26',
                name: 'Tunç Gerdan Muhafazası',
                description: 'Boğaza inen doğrudan kılıç saplamalarını tamamen önler.',
                icon: '🛡️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_27',
            name: 'Kızıl Akik Zırh Plakası',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 41, maxHealth: 215, damage: 8}),
            requiredLevel: 29,
            valueInGold: 5350,
            description: 'Kızıl akik cevherleriyle bezenmiş, savaşçının kan dolaşımını hızlandırıp canını tazeleyen zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_27',
                name: 'Akik Nabzı',
                description: 'Zırhın iç enerjisi yaralanmalarda kan kaybını yavaşlatır.',
                icon: '🔴'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_28',
            name: 'Kuşatma Yaran Ağır Garnizon Zırhı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 42, maxHealth: 225, blockChancePercent: 9}),
            requiredLevel: 29,
            valueInGold: 5750,
            description: 'Ağır kuşatmalarda kale kapılarını tutan seçkin piyadelerin giydiği, balyoz işlemez zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_28',
                name: 'Yıkılmaz Garnizon',
                description: 'En ağır ezici darbelerde dahi plaka göçmeden direncini korur.',
                icon: '🏰'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_29',
            name: 'Şafak Haleli Altın Göğüslük',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 44, maxHealth: 240, damage: 9}),
            requiredLevel: 30,
            valueInGold: 6200,
            description: 'Güneş tapınağının altın sırmalarıyla işlenmiş, gün ışığında göz kamaştıran muazzam şövalye zırhı.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_29',
                name: 'Güneş Halosu',
                description: 'Altın parıltı düşmanın gözünü alarak ilk darbesini zayıflatır.',
                icon: '☀️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_30',
            name: 'Gölge Madeni Ağır Plakası',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 45, maxHealth: 250, speed: 4}),
            requiredLevel: 30,
            valueInGold: 6700,
            description: 'Işığı tamamen emen mat katakomp madeninden yapılmış, tekinsiz ve sarsılmaz ağır zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_30',
                name: 'Gölge Emimi',
                description: 'Darbelerin sesini ve enerjisini emerek karanlıkta savaş üstünlüğü verir.',
                icon: '👤'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_31',
            name: 'Zümrüt Kakmalı Engerek Zırhı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 46, maxHealth: 260, critChancePercent: 9}),
            requiredLevel: 31,
            valueInGold: 7200,
            description: 'Zümrüt taşlarıyla donatılmış, esnek çelik eklemleriyle ani karşı saldırılara imkan veren zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_31',
                name: 'Engerek Esnekliği',
                description: 'Ağır zırh olmasına rağmen dövüşçünün ani kıvrılmalarına izin verir.',
                icon: '🐍'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_32',
            name: 'Buzul Rünlü Demir Cuirass',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 47, maxHealth: 270, blockChancePercent: 9}),
            requiredLevel: 31,
            valueInGold: 7700,
            description: 'Üzerine kadim dağ rünleri oyulmuş, taşıyıcısının bedenini donmuş buz gibi katılaştıran cuirass.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_32',
                name: 'Donmuş Rün Zırhı',
                description: 'Rünler göğse çarpan kılıçların keskinliğini anında dondurur.',
                icon: '🧊'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_33',
            name: 'Başbuğ Kartal Plaka Zırhı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 48, maxHealth: 285, damage: 10, critChancePercent: 9}),
            requiredLevel: 32,
            valueInGold: 8250,
            description: 'Dağ kabilelerinin ulu hanları için altın kartal motifleriyle dökülmüş, liderlik timsali ağır zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_33',
                name: 'Han Heybeti',
                description: 'Meydandaki heybetiyle düşmanın cesaretini kırıp hasarını düşürür.',
                icon: '🦅'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_34',
            name: 'Titanyum Levhalı Kuşatma Göğüslüğü',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 50, maxHealth: 300, blockChancePercent: 10}),
            requiredLevel: 32,
            valueInGold: 8800,
            description: 'En sert titanyum alaşımından imal edilen, hiçbir mekanik arbaletin delemeyeceği zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_34',
                name: 'Titanyum Kalkan',
                description: 'Titanyum alaşım en ağır arbalet oklarını dahi sekerek geri iter.',
                icon: '⚙️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_35',
            name: 'Magma Damarlı Ağır Kor Zırhı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 52, maxHealth: 320, damage: 11}),
            requiredLevel: 33,
            valueInGold: 9400,
            description: 'Yerkürenin lav çatlaklarında tavlanan, yarıklarından kızıl kor alevler parıldayan efsanevi zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_35',
                name: 'Magma Damarı',
                description: 'Göğse dokunan kılıçları akkor sıcaklıkla dağlayıp hasar verir.',
                icon: '🔥'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_36',
            name: 'Gök Gürültüsü Masif Plakası',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 53, maxHealth: 330, blockChancePercent: 11}),
            requiredLevel: 33,
            valueInGold: 10000,
            description: 'Yıldırımların dövdüğü bronz çeliğinden mamul, her darbede gök gürültüsü titreşimi yayan plaka.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_36',
                name: 'Gök Şoku',
                description: 'Darbe emildiğinde çıkan titreşim hasmın ellerini uyuşturur.',
                icon: '🌩️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_37',
            name: 'Ay Işığı Gümüş Cuirass',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 55, maxHealth: 345, speed: 5, dodgeChancePercent: 6}),
            requiredLevel: 34,
            valueInGold: 10600,
            description: 'Gümüş madenleriyle arıtılmış, ay ışığını toplayıp taşıyıcısına hafiflik ve dayanıklılık sunan zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_37',
                name: 'Gümüş Yakamoz',
                description: 'Ağır plaka olmasına rağmen dövüşçüye gümüş gibi akıcı bir hız verir.',
                icon: '🌙'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_38',
            name: 'Kraliyet Lejyoneri Şeref Zırhı',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 56, maxHealth: 360, blockChancePercent: 12}),
            requiredLevel: 34,
            valueInGold: 11200,
            description: 'İmparatorun en kıdemli baş şövalyelerine takdim ettiği, altından mühürlü kadim nizam zırhı.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_38',
                name: 'İmparatorluk Şerefi',
                description: 'Savaş meydanında dövüşçünün pes etmesini engelleyen sarsılmaz dirayet.',
                icon: '👑'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_harmor_39',
            name: 'İmparatorluk Altın Kartal Zırhı \'Aurelius\'',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 58, maxHealth: 380, damage: 13, critChancePercent: 11}),
            requiredLevel: 35,
            valueInGold: 11800,
            description: 'Eski imparator Aurelius\'un şahsi zırh ustasının döktüğü, tüm vücudu saran efsanevi altın plaka.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_39',
                name: 'Aurelius Görkemi',
                description: 'İmparatorun iradesiyle her vuruşta dövüşçünün zırhını daha da sıkılaştırır.',
                icon: '🦅'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_harmor_40',
            name: 'Kozmik Kabuk Yıldız Göğüslüğü',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 60, maxHealth: 400, blockChancePercent: 12}),
            requiredLevel: 35,
            valueInGold: 12000,
            description: 'Düşen dev göktaşının kraterinden çıkarılan kozmik cevherle dövülmüş, yıldız gibi parıldayan zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_40',
                name: 'Kozmik Kabuk',
                description: 'Gelen fiziksel darbeleri kozmik bir manyetik alanla emer.',
                icon: '🌌'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_harmor_41',
            name: 'Kızıl Ejderha Zırhı \'Fafnir\'',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 61, maxHealth: 420, damage: 14, critChancePercent: 12}),
            requiredLevel: 36,
            valueInGold: 12000,
            description: 'Fafnir\'in göğüs zırhı pullarından dövülmüş, alev ve çeliğin birleştiği yenilmez gövdelik.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_41',
                name: 'Fafnir Alevi',
                description: 'Kritik darbeler aldığında alev dalgası yayarak saldırganı yakar.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_harmor_42',
            name: 'Titanyum Şampiyon Plakası',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 62, maxHealth: 435, blockChancePercent: 13}),
            requiredLevel: 36,
            valueInGold: 12000,
            description: 'Arenanın yüz yıllık şampiyonlarının anısına dökülen, hiçbir silahın çizemediği titanyum zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_42',
                name: 'Kırılmaz Şampiyon',
                description: 'Arenadaki tüm kılıç yağmurunu bir granit kayası gibi karşılar.',
                icon: '🛡️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_harmor_43',
            name: 'Kadim Başbuğ Zırhı \'Oğuz\'',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 64, maxHealth: 450, damage: 15}),
            requiredLevel: 37,
            valueInGold: 12000,
            description: 'Bozkırın ebedi hükümdarlarının giydiği, demir ve bronz perçinli kutsal başbuğ zırhı.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_43',
                name: 'Başbuğ Koruması',
                description: 'Ataların ruhu dövüşçünün göğsünü korur, ölümcül darbeleri bertaraf eder.',
                icon: '🦬'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_harmor_44',
            name: 'Kuzey Hükümdarı Taçlı Cuirass',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 65, maxHealth: 465, blockChancePercent: 14}),
            requiredLevel: 37,
            valueInGold: 12000,
            description: 'Kuzey krallarının tahtında dövülen, kar fırtınalarının gücünü hapseden devasa plaka.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_44',
                name: 'Kuzey Hükmü',
                description: 'Buz gibi sağlam çelik gövdeyi tam bir sur duvarına çevirir.',
                icon: '👑'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_harmor_45',
            name: 'Titan Göğsü Efsanevi Zırh',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 67, maxHealth: 485, damage: 16}),
            requiredLevel: 38,
            valueInGold: 12000,
            description: 'Dağları sırtlayan antik titanların heykellerinden dökülen, taşlaşmış çelik göğüslük.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_45',
                name: 'Titan Dirayeti',
                description: 'Gelen en ağır balyoz darbelerinde bile dövüşçüyü yerinden kıpırdatmaz.',
                icon: '🗿'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_harmor_46',
            name: 'Kıyamet Habercisi Kor Cuirass',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 68, maxHealth: 500, critChancePercent: 14}),
            requiredLevel: 38,
            valueInGold: 12000,
            description: 'Yeraltı fırınlarında dövülmüş, kor ateşi hiçbir zaman sönmeyen kıyamet zırhı.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_46',
                name: 'Cehennem Zırhı',
                description: 'Gelen saldırıların gücünü kor ateşe dönüştürerek hasmın silahını eritir.',
                icon: '🔥'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_harmor_47',
            name: 'Sonsuz Gece Karartı Plakası',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 69, maxHealth: 515, speed: 6, dodgeChancePercent: 8}),
            requiredLevel: 38,
            valueInGold: 12000,
            description: 'Evrenin karanlık maddesinden süzülen, ışığın içine gömüldüğü efsanevi koyu plaka zırh.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_47',
                name: 'Sonsuz Karanlık',
                description: 'Karanlık örtü hasmın hedef alma netliğini yok ederek vuruşlarını saptırır.',
                icon: '🌒'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_harmor_48',
            name: 'Diyarın Yıkılmaz Zırhı \'Sur-ı Azam\'',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 72, maxHealth: 550, blockChancePercent: 16, damage: 18}),
            requiredLevel: 39,
            valueInGold: 12000,
            description: 'Taş Hisar\'ın temellerindeki dev kapıların öz çeliğinden dövülmüş, diyarın en sağlam nihai ağır zırhı.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_48',
                name: 'Azam Surları',
                description: 'Yıkılmaz sur çeliği; can %30 altındayken gelen tüm hasarı %40 keser.',
                icon: '🏰'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_harmor_49',
            name: 'Tanrılar Katı Yıldız Zırhı \'Astra Plaka\'',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 74, maxHealth: 570, speed: 8, critChancePercent: 16, dodgeChancePercent: 10}),
            requiredLevel: 39,
            valueInGold: 12000,
            description: 'Gök kubbenin yıldız tozuyla dökülmüş, evrenin zırhını taşıyıcısına giydiren ilahi başyapıt.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_49',
                name: 'Astra Görkemi',
                description: 'Kozmik parıltı tüm darbeleri havada sönümleyerek bedene ulaşmasını engeller.',
                icon: '✨'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_harmor_50',
            name: 'Ebedi Sürgün Başbuğ Cuirass\'ı \'Kader Zırhı\'',
            slot: EquipmentSlot.CHEST,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 76, maxHealth: 600, damage: 20, blockChancePercent: 18, critChancePercent: 18}),
            requiredLevel: 39,
            valueInGold: 12000,
            description: 'Ulfric\'in hayatı boyunca dövdüğü en yüce başyapıt. Diyarın kaderini omuzlarında taşıyan nihai savaşçının zırhı.',
            armorCategory: ArmorCategory.HEAVY_ARMOR,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_ha_50',
                name: 'Kaderin Zırhı',
                description: 'Diyara hükmedecek savaşçının kader zırhı; ölümcül darbeleri hiçe sayıp canı yeniler.',
                icon: '⚜️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        })
    ];
  },

  createBoots() {
    return [
        new Equipment({
            id: 'eq_tash_boot_01',
            name: 'Taş Hisar Kramponlu Piyade Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 10, speed: 3, maxHealth: 25}),
            requiredLevel: 20,
            valueInGold: 520,
            description: 'Buzlu dağ patikalarında kaymayan demir kramponlarla donatılmış garnizon piyade çizmesi.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_01',
                name: 'Krampon Tutuşu',
                description: 'Sert kayalarda ve buzda kaymayı tamamen engelleyip sağlam basış sağlar.',
                icon: '🥾'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_02',
            name: 'Dağ Devriyesi Kalın Deri Botu',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 9, speed: 4, dodgeChancePercent: 5}),
            requiredLevel: 20,
            valueInGold: 580,
            description: 'İki kat dağ keçisi derisinden dikilmiş, çevik adımlara izin veren esnek devriye botu.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_02',
                name: 'Çevik Keçi Adımı',
                description: 'Kayalık patikalarda sıçramayı ve çevik dönüşleri kolaylaştırır.',
                icon: '🐐'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_03',
            name: 'Nöbetçi Çelik Burunlu Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 11, maxHealth: 30, blockChancePercent: 3}),
            requiredLevel: 20,
            valueInGold: 650,
            description: 'Burun ve aşil tendonu çelik plakalarla korunan, süvari tekmelerine dirençli nizam çizmesi.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_03',
                name: 'Çelik Burun',
                description: 'Parmak uçlarına ve kaval kemiğine inen tekmeleri engeller.',
                icon: '🛡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_04',
            name: 'Sınır Muhafızı Ağır Mahmuzlu Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 11, speed: 4, damage: 3}),
            requiredLevel: 21,
            valueInGold: 720,
            description: 'Topuklarında dövme demir mahmuzlar bulunan, atı şaha kaldıran ve tekmelerde delen çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_04',
                name: 'Demir Mahmuz',
                description: 'Yakın boğuşmalarda vurulan tekmelere delici hasar katar.',
                icon: '👢'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_05',
            name: 'Ayaz Geçidi Kürk Astarlı Botu',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 12, maxHealth: 35, speed: 3}),
            requiredLevel: 21,
            valueInGold: 800,
            description: 'Ayı kürkü astarıyla dondurucu soğukta ayakları sıcak tutan, refleksleri koruyan kışlık bot.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_05',
                name: 'Kış Sıcağı',
                description: 'Ayak parmaklarının donmasını önleyerek adım hızını korur.',
                icon: '❄️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_06',
            name: 'Granit Ocakçı Çivili Tabanlığı',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 13, maxHealth: 40}),
            requiredLevel: 21,
            valueInGold: 890,
            description: 'Tabanına kalın madenci çivileri çakılmış, taş ocağı engebelerinde sarsılmaz denge sunan bot.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_06',
                name: 'Çivili Taban',
                description: 'Engebeli zeminde asla sendeletmeyen sağlam bir zemin tutuşu.',
                icon: '⛏️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_07',
            name: 'Hisar Kapısı Plaka Tozluklu Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 14, maxHealth: 45, blockChancePercent: 4}),
            requiredLevel: 22,
            valueInGold: 980,
            description: 'Diz altına kadar uzanan dövme demir tozluklarıyla bacak ve ayak bileğini saran ağır çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_07',
                name: 'Demir Tozluk',
                description: 'Kaval kemiğine inen kılıç darbelerini tamamen absorbe eder.',
                icon: '🛡️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_08',
            name: 'Kuzey Süvari Çevik Botu',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 12, speed: 5, dodgeChancePercent: 6}),
            requiredLevel: 22,
            valueInGold: 1080,
            description: 'Üzengiye mükemmel oturan pürüzsüz deri yüzeyiyle at sırtında rüzgar gibi esen süvari botu.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_08',
                name: 'Üzengi Dengesi',
                description: 'Hızlı hücumlarda dengede kalmayı ve anında manevra yapmayı sağlar.',
                icon: '🏇'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_09',
            name: 'Dikenli Bronz Savaş Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 13, damage: 4, speed: 3}),
            requiredLevel: 22,
            valueInGold: 1180,
            description: 'Kaval kemiği üzerinde bronz mahmuzlar taşıyan, tekmeyle düşmanı sendeleterek yıkan çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_09',
                name: 'Bronz Mahmuz Darbesi',
                description: 'Savurulan tekmeler hasmın diz kapağını kırarak dengesini bozar.',
                icon: '🦔'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_10',
            name: 'Nehir Muhafızı Su Geçirmez Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 14, speed: 4, maxHealth: 50}),
            requiredLevel: 23,
            valueInGold: 1280,
            description: 'Balık yağıyla terbiye edilmiş kalın derisiyle nehir yataklarında asla ıslanmayan çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_10',
                name: 'Yağlı Deri Yalıtımı',
                description: 'Sulu ve çamurlu zeminlerde ağırlaşmadan süratli koşmayı sağlar.',
                icon: '🐟'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_11',
            name: 'Granit Levhalı Ağır Savaş Botu',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 15, maxHealth: 55, blockChancePercent: 4}),
            requiredLevel: 23,
            valueInGold: 1390,
            description: 'Bileklerine granit levhalar bağlanmış, kılıç kesiklerine geçit vermeyen masif savaş botu.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_11',
                name: 'Granit Bileklik',
                description: 'Aşil tendonu ve ayak bileğini hedef alan kılıçları kırar.',
                icon: '🪨'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_12',
            name: 'Fırtına Sırtı Hızlı Adım Botu',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 13, speed: 6, dodgeChancePercent: 7}),
            requiredLevel: 23,
            valueInGold: 1500,
            description: 'Hafifletilmiş çelik tabanlığıyla kayalık sırtlarda rüzgar gibi sıçramayı sağlayan avcı botu.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_12',
                name: 'Rüzgar Adımı',
                description: 'Hızlı yön değiştirmelerde yer çekimini hafifletir.',
                icon: '💨'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_13',
            name: 'Kuşatma Öncüsü Masif Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 16, maxHealth: 60, blockChancePercent: 5}),
            requiredLevel: 24,
            valueInGold: 1650,
            description: 'Merdiven tırmanırken kancaları basamaklara kenetlenen ağır dövme demir kuşatma çizmesi.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_13',
                name: 'Kenetlenen Taban',
                description: 'Zemine kenetlenerek geriye itilme ve düşmeleri önler.',
                icon: '🧱'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_14',
            name: 'Dövme Kartal Pençeli Çizme',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 15, speed: 5, critChancePercent: 6}),
            requiredLevel: 24,
            valueInGold: 1780,
            description: 'Taban kenarlarında kartal pençesini andıran kavisli çelik çıkıntılar bulunan saldırgan çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_14',
                name: 'Pençe Basışı',
                description: 'Ani atılımlarda patlayıcı hız üreterek kritik vuruşu destekler.',
                icon: '🦅'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_15',
            name: 'Ayaz Çeliği Plaka Greave\'i',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.USTAISI,
            stats: new Stats({armor: 17, maxHealth: 65}),
            requiredLevel: 24,
            valueInGold: 1920,
            description: 'Diz kapağından topuğa kadar kesintisiz soğuk çelik plakalarla korunan ağır nizam greave\'i.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_15',
                name: 'Kırılmaz Greave',
                description: 'Düşük seviyeli kılıç ve balta vuruşlarını çeliğinde eritir.',
                icon: '❄️'
            }),
            maxSockets: 2,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_16',
            name: 'Lejyoner Subay Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 18, speed: 5, maxHealth: 70}),
            requiredLevel: 25,
            valueInGold: 2100,
            description: 'Kızıl deri üzerine bronz tokalarla bağlanan, lejyon yüzbaşılarının asil yürüyüş çizmesi.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_16',
                name: 'Lejyon Adımı',
                description: 'Uzun yürüyüşlerde ve dövüşte ayak yorgunluğunu sıfırlar.',
                icon: '🎖️'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_17',
            name: 'Obsidyen Tabanlı Gece Botu',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 17, speed: 6, dodgeChancePercent: 8}),
            requiredLevel: 25,
            valueInGold: 2300,
            description: 'Tabanında sessiz adımlar sağlayan obsidyen kauçuk alaşımı taşıyan, ses çıkarmayan gece botu.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_17',
                name: 'Sessiz Adım',
                description: 'Zemine temas ederken çıkan sesi yutarak sıyrılmayı kolaylaştırır.',
                icon: '🌑'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_18',
            name: 'Bozkır Kurdu Yırtıcı Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 18, speed: 5, damage: 5}),
            requiredLevel: 25,
            valueInGold: 2500,
            description: 'Kurt derisiyle kaplanmış, burnundaki çelik mahmuzla tekmelerde hasmı yaralayan vahşi çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_18',
                name: 'Kurt Hamlesi',
                description: 'Hızlı ileri atılımlarda dövüşçüye yırtıcı bir ivme kazandırır.',
                icon: '🐺'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_19',
            name: 'Volkan Bazaltı Savaş Botu',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 19, maxHealth: 80, blockChancePercent: 5}),
            requiredLevel: 26,
            valueInGold: 2700,
            description: 'Volkanik lav kayalarının tozuyla tavlanmış, kızgın küllere bassanız dahi yanmayan ağır bot.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_19',
                name: 'Lav Tabanı',
                description: 'Kızgın zeminlerde ve alevli arenalarda ayakları tam korur.',
                icon: '🌋'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_20',
            name: 'Çift Kanatlı Şövalye Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 19, speed: 6, dodgeChancePercent: 8}),
            requiredLevel: 26,
            valueInGold: 2950,
            description: 'Bileklerinde gümüş kanat motifleri uzanan, dövüşçüye adeta havada süzülüyormuş hissi veren çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_20',
                name: 'Kanatlı Süzülüş',
                description: 'Düşman darbelerinden yana sıyrılmayı olağanüstü kolaylaştırır.',
                icon: '🪽'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_21',
            name: 'Şimşek Damarlı Sürat Botu',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 18, speed: 7, critChancePercent: 7}),
            requiredLevel: 26,
            valueInGold: 3200,
            description: 'Tabanında elektrik damarları dolaşan, her adımda hız rekorları kıran fırtına botu.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_21',
                name: 'Yıldırım İvmesi',
                description: 'İlk hamlede şimşek hızıyla hasmın üzerine atılmayı sağlar.',
                icon: '⚡'
            }),
            maxSockets: 3,
            unlockedSockets: 1
        }),
        new Equipment({
            id: 'eq_tash_boot_22',
            name: 'Safir Kakmalı Şövalye Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 20, speed: 5, maxHealth: 90}),
            requiredLevel: 27,
            valueInGold: 3450,
            description: 'Tokalarında parlak kraliyet safirleri parıldayan, asil duruşuyla zarafet ve güç saçan çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_22',
                name: 'Safir Metaneti',
                description: 'Dövüş meydanında bacakların titremesini ve paniklemesini önler.',
                icon: '💎'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_23',
            name: 'Hisar Başmuhafızı Çelik Greave\'i',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 22, maxHealth: 95, blockChancePercent: 6}),
            requiredLevel: 27,
            valueInGold: 3750,
            description: 'Diz eklemini mekanik menteşelerle kilitleyen, balta darbelerine karşı aşılmaz ağır çelik greave.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_23',
                name: 'Mekanik Menteşe',
                description: 'Diz kapağını ve eklemleri kırılmaktan koruyan çelik kafes.',
                icon: '🔒'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_24',
            name: 'Dağ Aslanı Pençeli Çizme',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 20, speed: 6, damage: 6}),
            requiredLevel: 27,
            valueInGold: 4050,
            description: 'Dağ aslanı derisinden mamul, yaylanan tabanıyla yüksekten atlayışlarda darbeyi yutan çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_24',
                name: 'Yaylanan Adım',
                description: 'Düşüş ve sıçramalarda şoku emerek savaşa hız kesmeden devam ettirir.',
                icon: '🦁'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_25',
            name: 'Ejder Pulu Kaplı Ağır Çizme',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 22, maxHealth: 105, blockChancePercent: 6}),
            requiredLevel: 28,
            valueInGold: 4400,
            description: 'Hakiki ejderha pullarıyla zırhlandırılmış, kesilmez ve yanmaz efsanevi çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_25',
                name: 'Ejder Pulu Zırhı',
                description: 'Kaval kemiğine inen en sert kılıç savuruşlarını bile sıyırır.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_26',
            name: 'Tunç Mahmuzlu Ağır Süvari Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 23, speed: 6, damage: 6}),
            requiredLevel: 28,
            valueInGold: 4750,
            description: 'Ağır süvari alaylarının kalkan delen devasa tunç mahmuzlarıyla donatılmış heybetli çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_26',
                name: 'Tunç Mahmuz Şoku',
                description: 'Savrulan tekmeyle hasmın bacağını sakatlayarak hızını keser.',
                icon: '👢'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_27',
            name: 'Kızıl Akik Kakmalı Savaş Botu',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 23, speed: 6, maxHealth: 115}),
            requiredLevel: 29,
            valueInGold: 5100,
            description: 'Bileklerinde kızıl akik cevherleri yer alan, ayaklara dinçlik ve durmaksızın koşma gücü veren bot.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_27',
                name: 'Akik Dirayeti',
                description: 'Yorgunluk hissini silerek dövüşün son anına kadar yüksek tempo sağlar.',
                icon: '🔴'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_28',
            name: 'Kuşatma Yaran Masif Çelik Çizme',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 25, maxHealth: 125, blockChancePercent: 7}),
            requiredLevel: 29,
            valueInGold: 5500,
            description: 'Dökme çelik taban ve burunluğuyla kale kapılarını kırmaya yardımcı olan ağır piyade çizmesi.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_28',
                name: 'Koçbaşı Tekmesi',
                description: 'Doğrudan vurulan tekmeler kalkanları geriye doğru savurur.',
                icon: '🏰'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_29',
            name: 'Şafak Işıltılı Altın Mahmuzlu Çizme',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 25, speed: 7, critChancePercent: 8}),
            requiredLevel: 30,
            valueInGold: 5950,
            description: 'Güneşin doğuşuyla parıldayan altın mahmuzlu, arenada gözleri büyüleyen şampiyon çizmesi.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_29',
                name: 'Güneş Mahmuzu',
                description: 'Hızlı adım atarken bıraktığı altın ışıltı hasmın gözünü alır.',
                icon: '☀️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_30',
            name: 'Gölge Madeni Sinsi Adım Botu',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 24, speed: 8, dodgeChancePercent: 10}),
            requiredLevel: 30,
            valueInGold: 6400,
            description: 'Karanlığı adımlayan katakomp madeninden mamul, ayak izi dahi bırakmayan kadim gölge botu.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_30',
                name: 'İzsiz Adım',
                description: 'Dövüş meydanında rakibin arkasına hayalet gibi süzülmeyi sağlar.',
                icon: '👤'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_31',
            name: 'Zümrüt Gözlü Engerek Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 26, speed: 7, critChancePercent: 9}),
            requiredLevel: 31,
            valueInGold: 6900,
            description: 'Yılan pulları gibi esnek dokunmuş çelikten yapılan, zehir gibi süratli dönüşler sağlayan çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_31',
                name: 'Yılan Çevikliği',
                description: 'Düşmanın hamlelerinin altından kıvrılarak sıyrılma fırsatı tanır.',
                icon: '🐍'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_32',
            name: 'Buzul Rünlü Demir Çizme',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 27, maxHealth: 140, blockChancePercent: 7}),
            requiredLevel: 31,
            valueInGold: 7400,
            description: 'Rünlerle kutsanmış çelik tabanıyla buzul üstünde dahi koşarken sarsılmaz bir denge kuran çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_32',
                name: 'Buz Rünü Dengesi',
                description: 'Kaygan zeminlerde dövüşürken savrulmaları tamamen engeller.',
                icon: '🧊'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_33',
            name: 'Başbuğ Kartal Mahmuzlu Çizme',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 28, speed: 7, damage: 8, critChancePercent: 9}),
            requiredLevel: 32,
            valueInGold: 7950,
            description: 'Ulu dağ hanlarının törenlerinde giydiği, şahin kanadı desenli altın kaplama süvari çizmesi.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_33',
                name: 'Başbuğ İvmesi',
                description: 'Hücuma kalkıldığında savaşçıya patlayıcı bir darbe hızı katar.',
                icon: '🦅'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_34',
            name: 'Titanyum Tabanlı Zırhlı Bot',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.NADIDE,
            stats: new Stats({armor: 29, maxHealth: 155, blockChancePercent: 8}),
            requiredLevel: 32,
            valueInGold: 8500,
            description: 'Titanyum plakalarla desteklenmiş tabanıyla en keskin tuzak dikenlerini bile ezen ağır bot.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_34',
                name: 'Ezilmez Titanyum',
                description: 'Zemindeki kesici ve delici tuzakların hasarını sıfıra indirir.',
                icon: '⚙️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_35',
            name: 'Magma Damarlı Ağır Kor Botu',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 30, speed: 7, damage: 9}),
            requiredLevel: 33,
            valueInGold: 9100,
            description: 'Volkanik alevlerle dövülmüş, her adımında yere kızgın kor kıvılcımları saçan efsanevi bot.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_35',
                name: 'Kor Adım',
                description: 'Yakın temasta atılan tekmeler hasmın bacağını kızgın demir gibi dağlar.',
                icon: '🔥'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_36',
            name: 'Gök Gürültüsü Çelik Greave\'i',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 31, maxHealth: 170, blockChancePercent: 8}),
            requiredLevel: 33,
            valueInGold: 9700,
            description: 'Yıldırım düşen kayaların çeliğinden dövülmüş, sarsıcı adımlarıyla yeri titreten efsanevi greave.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_36',
                name: 'Gök Titreşimi',
                description: 'Ağır yere basış anında zeminden hafif bir sarsıntı dalgası yayar.',
                icon: '🌩️'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_37',
            name: 'Ay Işığı Gümüşi Savaş Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 32, speed: 8, dodgeChancePercent: 10}),
            requiredLevel: 34,
            valueInGold: 10300,
            description: 'Gümüş tozlarıyla yıkanmış pürüzsüz yüzeyiyle gece savaşlarında rüzgar gibi süzülen çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_37',
                name: 'Gümüş Adımlar',
                description: 'Kullanıcının manevra hızını iki katına çıkararak saldırılardan kaçırır.',
                icon: '🌙'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_38',
            name: 'Kraliyet Muhafızı Ağır Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 33, maxHealth: 185, blockChancePercent: 9}),
            requiredLevel: 34,
            valueInGold: 10900,
            description: 'Saray muhafız alaylarının şampiyon şövalyelerine mahsus, yekpare dökme çelik ağır çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_38',
                name: 'Saray Nöbeti',
                description: 'Saatlerce süren kanlı düellolarda bacakları taze ve yorulmaz tutar.',
                icon: '👑'
            }),
            maxSockets: 3,
            unlockedSockets: 2
        }),
        new Equipment({
            id: 'eq_tash_boot_39',
            name: 'İmparatorluk Altın Kartal Çizmesi \'Aurelius\'',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 35, speed: 8, damage: 10, critChancePercent: 11}),
            requiredLevel: 35,
            valueInGold: 11500,
            description: 'İmparator Aurelius\'un kendi mührünü taşıyan, altın kartal mahmuzlu eşsiz komutan çizmesi.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_39',
                name: 'Aurelius Adımı',
                description: 'Her adımda ordunun sancağını ileri taşıyan şanlı ve sarsılmaz hücum gücü.',
                icon: '🦅'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_boot_40',
            name: 'Kozmik Kabuk Yıldız Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 36, maxHealth: 205, speed: 7}),
            requiredLevel: 35,
            valueInGold: 11800,
            description: 'Göktaşının dış kabuğundan yontulan kozmik zırhla donatılmış, yerçekimine meydan okuyan çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_40',
                name: 'Kozmik Yerçekimi',
                description: 'Dövüşçünün adımlarını hafifleterek havada kalma ve sıçrama süresini artırır.',
                icon: '🌌'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_boot_41',
            name: 'Kızıl Ejderha Mahmuzlu Çizme \'Fafnir\'',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 37, speed: 8, damage: 11, critChancePercent: 12}),
            requiredLevel: 36,
            valueInGold: 12000,
            description: 'Fafnir\'in tırnak kemiklerinden yontulmuş mahmuzlarıyla donatılmış, delip geçen ejderha çizmesi.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_41',
                name: 'Fafnir Pençesi',
                description: 'Tekmelerde açtığı derin yarıklar hasmın hızla kan kaybetmesine yol açar.',
                icon: '🐉'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_boot_42',
            name: 'Titanyum Şampiyon Greave\'i',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 38, maxHealth: 225, blockChancePercent: 10}),
            requiredLevel: 36,
            valueInGold: 12000,
            description: 'Titanyum alaşımlı masif greave; bacaklara inen tüm balta savuruşlarını kıvılcımlarla savuşturur.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_42',
                name: 'Kırılmaz Bacak Zırhı',
                description: 'Kaval kemiğini ve aşil tendonunu her türlü kılıç darbesine karşı zırhlar.',
                icon: '🛡️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_boot_43',
            name: 'Kadim Başbuğ Savaş Çizmesi \'Oğuz\'',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 40, maxHealth: 245, damage: 12}),
            requiredLevel: 37,
            valueInGold: 12000,
            description: 'Bozkırın kurucusu büyük kağanın çizmesinden esinlenerek dövülen, demir perçinli ata yadigarı.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_43',
                name: 'Kağan Adımı',
                description: 'Toprağa basıldığında sarsılmaz bir kök salar; asla düşürülmez.',
                icon: '🦬'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_boot_44',
            name: 'Kuzey Hükümdarı Taçlı Çizmesi',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 41, maxHealth: 260, speed: 8}),
            requiredLevel: 37,
            valueInGold: 12000,
            description: 'Buzul krallarının taç motifleriyle bezeli, karlar üzerinde uçarcasına adımlayan asil çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_44',
                name: 'Ayaz Krallığı',
                description: 'Buz ve karlı arenalarda adımları mükemmel bir süratle yönlendirir.',
                icon: '👑'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_boot_45',
            name: 'Titan Ayaklığı Efsanevi Çizme',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 43, maxHealth: 280, damage: 13}),
            requiredLevel: 38,
            valueInGold: 12000,
            description: 'Yeryüzünü sarsan antik titanların ayak izlerinden esinlenen, yeri göğü inleten ağır savaş botu.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_45',
                name: 'Titan Basışı',
                description: 'Yere vurulduğunda hasmın sendelemesine yol açan ezici basış gücü.',
                icon: '🗿'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_boot_46',
            name: 'Kıyamet Habercisi Kor Çizme',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 44, speed: 9, critChancePercent: 14}),
            requiredLevel: 38,
            valueInGold: 12000,
            description: 'Yeraltının magma nehirlerinde sertleştirilmiş, ayakları kızgın kömür gibi alev saçan çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_46',
                name: 'Cehennem Adımı',
                description: 'Hızlı atılımlarda ardında alevli bir iz bırakarak hasmı yakar.',
                icon: '🔥'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_boot_47',
            name: 'Sonsuz Gece Sinsi Greave\'i',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 45, maxHealth: 300, dodgeChancePercent: 11, speed: 8}),
            requiredLevel: 38,
            valueInGold: 12000,
            description: 'Karanlık maddenin dokunmasıyla oluşturulan, adım atarken hiçbir sürtünme üretmeyen efsanevi çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_47',
                name: 'Karanlık Kayışı',
                description: 'Zeminde sürtünmesiz kayarak en beklenmedik açılardan vuruş yapmayı sağlar.',
                icon: '🌒'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_boot_48',
            name: 'Diyarın Yıkılmaz Çizmesi \'Sur-ı Kadem\'',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 47, maxHealth: 320, blockChancePercent: 12, damage: 14}),
            requiredLevel: 39,
            valueInGold: 12000,
            description: 'Taş Hisar\'ın temellerindeki granit blokların sağlamlığını taşıyan, geri adım atmayan nihai savaş çizmesi.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_48',
                name: 'Kadem Surları',
                description: 'Dövüşçü yere bastığında bir sur kulesi gibi sabitlenir; sarsıntıları yutar.',
                icon: '🏰'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_boot_49',
            name: 'Tanrılar Katı Yıldız Çizmesi \'Astra Botu\'',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 48, speed: 10, critChancePercent: 16, dodgeChancePercent: 12, maxHealth: 340}),
            requiredLevel: 39,
            valueInGold: 12000,
            description: 'Kozmik yıldızların parıltısıyla dövülmüş, kullanıcısına ışık hızında atılma kudreti veren ilahi çizme.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_49',
                name: 'Astra Sürati',
                description: 'Işık hızıyla adım atarak hasmın gözünü kamaştırır ve darbelerden sıyırır.',
                icon: '✨'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        }),
        new Equipment({
            id: 'eq_tash_boot_50',
            name: 'Ebedi Sürgün Şampiyonu Çizmesi \'Kader Adımı\'',
            slot: EquipmentSlot.BOOTS,
            rarity: ItemRarity.KADIM,
            stats: new Stats({armor: 50, maxHealth: 360, speed: 10, damage: 16, blockChancePercent: 14, critChancePercent: 16}),
            requiredLevel: 39,
            valueInGold: 12000,
            description: 'Ulfric\'in dövdüğü en yüce şaheser çizme. Diyarın kaderine doğru yürüyen başkomutanın adımları için yaratıldı.',
            armorCategory: ArmorCategory.BOOTS,
            specialTrait: new EquipmentSpecialTrait({
                id: 'trait_tash_bt_50',
                name: 'Kaderin Adımı',
                description: 'Diyara hükmeden adımlar; savaş ne kadar çetin olursa olsun dövüşçüyü dimdik ayakta tutar.',
                icon: '⚜️'
            }),
            maxSockets: 3,
            unlockedSockets: 3
        })
    ];
  },

  createAllArmorerEquipment() {
    return [...TashisarArmorerEquipmentData.createHeavyArmors(), ...TashisarArmorerEquipmentData.createBoots()];
  },

};
