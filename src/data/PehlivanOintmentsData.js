import { ActiveBuffEffect, ConsumableItem, ItemType, UsableCategory } from '../domain/model.js';



/**
 * Er Meydanı & Pehlivan Güreşleri için Özel Hazırlık Yağları, Merhemleri ve İksirleri.
 * Taş Hisar ve Garnizon Tabibinde (Simyager / Şifacı) dönüşümlü ve özel sekmede satılır.
 * Kanama, zehir ve kara büyü içermez; sadece 4 temel istatistiği (Güç, Dayanıklılık, Hız, Kurnazlık)
 * ve er meydanı kondisyonunu destekler.
 */

const allOintments = [
    // 1. Hakiki Sızma Zeytinyağı
    new ConsumableItem({
        id: 'oil_pehlivan_zeytin',
        name: 'Er Meydanı Sızma Zeytinyağı',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 20,
        valueInGold: 25,
        description: 'Taş değirmende soğuk sıkım yapılmış has zeytinyağı. Kıspete ve omuzlara sürüldüğünde rakibin el ense ve boyunduruk kavramasını kayganlaştırır.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_zeytin',
            name: 'Zeytinyağı Kayganlığı',
            icon: '🏺',
            description: 'Er meydanında tutuşları kaydırır (+5 Dayanıklılık, +3 Kaçınma).',
            bonusArmor: 5,
            bonusDodgeChance: 3,
            remainingBattles: 2
        }),
        requiredLevel: 1
    }),

    // 2. Kafur ve Çam Katranı Ovuşu
    new ConsumableItem({
        id: 'oil_pehlivan_kafur',
        name: 'Kafur & Çam Katranı Ovuşu',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 25,
        valueInGold: 32,
        description: 'Toros çamlarından toplanan kara katran ve yakıcı kafur özü. Soğuk adeleleri anında ısıtarak ilk hamlede patlayıcı güç sağlar.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_kafur',
            name: 'Kafur Sıcaklığı',
            icon: '🔥',
            description: 'Adeleleri ısıtır (+6 Güç, +3 Hız).',
            bonusDamage: 6,
            bonusSpeed: 3,
            remainingBattles: 2
        }),
        requiredLevel: 1
    }),

    // 3. Kafkas Boğa İliği Macunu
    new ConsumableItem({
        id: 'oil_pehlivan_boga_iligi',
        name: 'Kafkas Boğa İliği Macunu',
        type: ItemType.POTION,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 45,
        valueInGold: 45,
        description: 'Tandır ateşinde kaynatılan ilik ve bal şerbeti. Göğüs kafesine kemik gibi direnç verir, rakibin ayı sarmallarına karşı gövdeyi kalkan yapar.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_boga_iligi',
            name: 'Boğa Mukavemeti',
            icon: '🐂',
            description: 'Kaburga direncini artırır (+8 Güç, +4 Dayanıklılık).',
            bonusDamage: 8,
            bonusArmor: 4,
            remainingBattles: 2
        }),
        requiredLevel: 2
    }),

    // 4. Dağ Keçisi Sinir Merhemi
    new ConsumableItem({
        id: 'oil_pehlivan_dag_kecisi',
        name: 'Dağ Keçisi Sinir Merhemi',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 20,
        valueInGold: 35,
        description: 'Uçurumlarda seken keçilerin toynak yağı ve sinir otuyla harmanlanmış şifa lapası. Diz kapağı ve ayak bileği bağlarını çelik gibi esnek kılar.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_dag_kecisi',
            name: 'Çevik Paça',
            icon: '🐐',
            description: 'Dalış ve tırpan savuşturmasını kolaylaştırır (+6 Hız, +4 Kaçınma).',
            bonusSpeed: 6,
            bonusDodgeChance: 4,
            remainingBattles: 2
        }),
        requiredLevel: 2
    }),

    // 5. Nefes Açıcı Nane & Okaliptüs Yağı
    new ConsumableItem({
        id: 'oil_pehlivan_nane_okaliptus',
        name: 'Nefes Açıcı Nane & Çam Yağı',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 30,
        valueInGold: 28,
        description: 'Göğse ve burun deliklerine sürülen keskin kokulu yağ. Ciğerleri sonuna kadar açarak uzun süren boğuşmalarda nefes tıkanmasını engeller.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_nane',
            name: 'Geniş Ciğer',
            icon: '🌬️',
            description: 'Nefes kapasitesini yükseltir (+6 Dayanıklılık).',
            bonusArmor: 6,
            remainingBattles: 2
        }),
        requiredLevel: 1
    }),

    // 6. Susam & Keten Yağı Karışımı
    new ConsumableItem({
        id: 'oil_pehlivan_susam_keten',
        name: 'Keten & Susam Yağı Özütü',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 25,
        valueInGold: 30,
        description: 'Pehlivanın boynuna ve kollarına yedirilen yoğun yağ. Rakibin kravat kilitlerinden kıvrılarak sıyrılmayı sağlar.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_susam',
            name: 'Kravat Sıyrılışı',
            icon: '💧',
            description: 'Kilitlerden kurtulma esnekliği (+5 Hız, +3 Kaçınma).',
            bonusSpeed: 5,
            bonusDodgeChance: 3,
            remainingBattles: 2
        }),
        requiredLevel: 1
    }),

    // 7. Kurt Kökü ve Çakmak Taşı Tozu
    new ConsumableItem({
        id: 'oil_pehlivan_kurt_koku',
        name: 'Kurt Kökü & Kükürt Lapası',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 15,
        valueInGold: 40,
        description: 'Avcıların kurt pençesinden esinlenerek hazırladığı keskin ovuş. Pehlivanın reflekslerini biler, ani paça dalışlarında zamanlamayı kusursuzlaştırır.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_kurt',
            name: 'Kurt Dalışı',
            icon: '🐺',
            description: 'Kurnazlık ve kritik kündeyi tetikler (+6 Kritik, +4 Hız).',
            bonusCritChance: 6,
            bonusSpeed: 4,
            remainingBattles: 2
        }),
        requiredLevel: 2
    }),

    // 8. Yakıcı Biberiye & Dağ Kekiği Ovuşu
    new ConsumableItem({
        id: 'oil_pehlivan_biberiye',
        name: 'Yakıcı Biberiye Merhemi',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 20,
        valueInGold: 34,
        description: 'Kan dolaşımını fırtına gibi hızlandırır. Boyun omurlarına sürüldüğünde sert el ense tokatlarının sarsıntısını emer.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_biberiye',
            name: 'Sert Boyun',
            icon: '🌶️',
            description: 'El enseye karşı boyun mukavemeti (+5 Dayanıklılık, +4 Güç).',
            bonusArmor: 5,
            bonusDamage: 4,
            remainingBattles: 2
        }),
        requiredLevel: 2
    }),

    // 9. Kadim Çörek Otu Tentürü
    new ConsumableItem({
        id: 'oil_pehlivan_corek_otu',
        name: 'Kadim Çörek Otu Tentürü',
        type: ItemType.POTION,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 50,
        valueInGold: 38,
        description: 'Eski pehlivanların güreşten önce içtiği kadim şifa şurubu. Bedendeki yorgunluğu ve kas kramplarını kökünden temizler.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_corek_otu',
            name: 'Dinç Beden',
            icon: '🌱',
            description: 'Genel kondisyon ve sağlık yenilenmesi (+4 Dayanıklılık).',
            bonusArmor: 4,
            remainingBattles: 3
        }),
        requiredLevel: 1
    }),

    // 10. Pehlivan Balmumu & Çam Sakızı Lapası
    new ConsumableItem({
        id: 'oil_pehlivan_balmumu_sakiz',
        name: 'Balmumu & Çam Sakızı Lapası',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 15,
        valueInGold: 42,
        description: 'Parmak uçlarına ve avuç içlerine ovularak sürülen yapışkan lapa. Rakibin yağlı kıspet kasnağını mengene gibi kavramayı sağlar.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_sakiz',
            name: 'Kaya Kavrayışı',
            icon: '🌲',
            description: 'Kasnak ve paça tutuşunda üstün kavrama (+7 Güç, +4 Kritik).',
            bonusDamage: 7,
            bonusCritChance: 4,
            remainingBattles: 2
        }),
        requiredLevel: 3
    }),

    // 11. Demir Otu Özütü
    new ConsumableItem({
        id: 'oil_pehlivan_demir_otu',
        name: 'Demir Otu Özütü',
        type: ItemType.POTION,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 35,
        valueInGold: 48,
        description: 'Maden kayalıklarında yetişen demir otunun damıtılmış özü. Kemikleri ve eklemleri güçlendirerek kündeden kumlara çarpış şiddetini hafifletir.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_demir_otu',
            name: 'Çelik İskelet',
            icon: '🛡️',
            description: 'Yere çarpma hasarını emer (+8 Dayanıklılık).',
            bonusArmor: 8,
            remainingBattles: 2
        }),
        requiredLevel: 3
    }),

    // 12. Acı Zencefil & Bal Şerbeti
    new ConsumableItem({
        id: 'oil_pehlivan_zencefil_sirke',
        name: 'Acı Zencefil & Bal Şerbeti',
        type: ItemType.POTION,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 40,
        valueInGold: 36,
        description: 'Kafurla demlenmiş zencefil şerbeti. Midedeki ağırlığı alır, bel kündesi öncesi vücuda kıvrak ve patlayıcı bir itme gücü pompalar.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_zencefil',
            name: 'Künde Ateşi',
            icon: '🍯',
            description: 'Bel kuvveti ve çevik yaylanma (+6 Güç, +4 Hız).',
            bonusDamage: 6,
            bonusSpeed: 4,
            remainingBattles: 2
        }),
        requiredLevel: 2
    }),

    // 13. Saray Parfümü Lavanta & Gül Yağı
    new ConsumableItem({
        id: 'oil_pehlivan_lavanta_gul',
        name: 'Gül & Lavanta Pehlivan Yağı',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 25,
        valueInGold: 50,
        description: 'Saray erkanının ve soylu hanımların izlediği gösterilerde kullanılan mis kokulu güreş yağı. Zarafeti ve odaklanmayı artırır.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_lavanta',
            name: 'Asil Odak',
            icon: '🌹',
            description: 'Zihni sakinleştirir, hamleleri netleştirir (+5 Hız, +5 Dayanıklılık).',
            bonusSpeed: 5,
            bonusArmor: 5,
            remainingBattles: 2
        }),
        requiredLevel: 3
    }),

    // 14. Göksu Kaya Tuzu & Sirke Ovuşu
    new ConsumableItem({
        id: 'oil_pehlivan_kaya_tuzu',
        name: 'Göksu Kaya Tuzu & Sirke Ovuşu',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 30,
        valueInGold: 30,
        description: 'Tuzlu sirke karışımıyla yapılan sert adele ovuşu. Kaslardaki ödemi dağıtır, kafa kafaya tokuşmalarda sersemliği derhal geçirir.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_tuz',
            name: 'Ayık Duyu',
            icon: '🧂',
            description: 'Sersemliğe karşı direnç (+4 Dayanıklılık, +4 Kaçınma).',
            bonusArmor: 4,
            bonusDodgeChance: 4,
            remainingBattles: 2
        }),
        requiredLevel: 1
    }),

    // 15. Yabani Orkide Kökü & Sahlep Macunu
    new ConsumableItem({
        id: 'oil_pehlivan_orkide_sahlep',
        name: 'Yabani Orkide Kökü Macunu',
        type: ItemType.POTION,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 60,
        valueInGold: 55,
        description: 'Torosların yüksek yaylalarından sökülen çatal köklü orkidelerle ezilmiş yoğun macun. Er meydanında 20 raunt soluksuz güreşebilecek dipçik gibi bir dayanıklılık sunar.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_orkide',
            name: 'Tükenmez Soluk',
            icon: '🌸',
            description: 'Uzun boğuşma dayanıklılığı (+7 Dayanıklılık, +3 Güç).',
            bonusArmor: 7,
            bonusDamage: 3,
            remainingBattles: 3
        }),
        requiredLevel: 3
    }),

    // 16. Antik Defne Yaprağı Yağı
    new ConsumableItem({
        id: 'oil_pehlivan_defne',
        name: 'Antik Defne Yaprağı Yağı',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 25,
        valueInGold: 44,
        description: 'Eski gladyatör arenalarından kalma zafer simgesi defnelerin yağı. Şakaklara sürüldüğünde zihni keskinleştirip rakibin hileli ayak oyunlarını önceden sezdirir.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_defne',
            name: 'Zafer Sezgisi',
            icon: '🌿',
            description: 'Karşı hamle zamanlaması (+6 Kritik, +4 Kaçınma).',
            bonusCritChance: 6,
            bonusDodgeChance: 4,
            remainingBattles: 2
        }),
        requiredLevel: 2
    }),

    // 17. Hırçın Ardıç Katranı Merhemi
    new ConsumableItem({
        id: 'oil_pehlivan_ardic_katrani',
        name: 'Hırçın Ardıç Katranı Merhemi',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 20,
        valueInGold: 46,
        description: 'Kaya çatlaklarında büyüyen kara ardıç ağacının reçinesi. Sırta ve pazulara sürüldüğünde kaburgaları mengeneye alan ayı sarmallarında ezici bir baskı sağlar.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_ardic',
            name: 'Ayı Mengensi',
            icon: '🪵',
            description: 'Kaburga mengenesinde ezici baskı (+8 Güç).',
            bonusDamage: 8,
            remainingBattles: 2
        }),
        requiredLevel: 3
    }),

    // 18. Yaban Arısı Sütü & Propolis
    new ConsumableItem({
        id: 'oil_pehlivan_ari_sutu',
        name: 'Yaban Arısı Sütü & Propolis',
        type: ItemType.POTION,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 65,
        valueInGold: 60,
        description: 'Orman kovanlarından sağılan saf arı sütü. Bedenin yıpranmış tüm dokularını anında onarır ve adele liflerini çelik halat gibi gerginleştirir.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_ari_sutu',
            name: 'Çelik Lifler',
            icon: '🐝',
            description: 'Yüksek can yenileme ve kas gerginliği (+5 Güç, +5 Dayanıklılık).',
            bonusDamage: 5,
            bonusArmor: 5,
            remainingBattles: 3
        }),
        requiredLevel: 3
    }),

    // 19. Garnizon Hardal Yakısı
    new ConsumableItem({
        id: 'oil_pehlivan_hardal_yakisi',
        name: 'Garnizon Hardal Yakısı',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 20,
        valueInGold: 38,
        description: 'Bele sarılan sıcak hardal ve keten bezi. Bel omurlarını sararak ters paça ve bel kündesi savururken pehlivanın belinin kırılmasını engeller.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_hardal',
            name: 'Zırhlı Bel',
            icon: '🩹',
            description: 'Bel omurga koruması ve savurma gücü (+6 Dayanıklılık, +5 Güç).',
            bonusArmor: 6,
            bonusDamage: 5,
            remainingBattles: 2
        }),
        requiredLevel: 2
    }),

    // 20. Sarı Kehribar Yağ Damlası
    new ConsumableItem({
        id: 'oil_pehlivan_kehribar',
        name: 'Sarı Kehribar Yağ Damlası',
        type: ItemType.OINTMENT,
        usableCategory: UsableCategory.PEHLIVAN_OIL,
        healAmount: 30,
        valueInGold: 75,
        description: 'Eski başpehlivanların sır gibi sakladığı, cazgırın dualarıyla yoğrulmuş kehribar yağı. Er meydanına altın bir parıltı saçar ve tüm istatistiklere efsanevi bir uyum kazandırır.',
        count: 1,
        buffEffect: new ActiveBuffEffect({
            id: 'buff_pehlivan_kehribar',
            name: 'Başpehlivanın Bereketi',
            icon: '👑',
            description: 'Er meydanı şampiyonluğu aurası (+6 Güç, +6 Dayanıklılık, +5 Hız, +5 Kritik).',
            bonusDamage: 6,
            bonusArmor: 6,
            bonusSpeed: 5,
            bonusCritChance: 5,
            remainingBattles: 3
        }),
        requiredLevel: 4
    })
]

/**
 * Günün veya dönemin şartına göre simyagerde dönüşümlü (rotasyonlu) gösterilecek yağları döndürür.
 */
function getRotatingOintments(day, count = 6) {
    if (allOintments.length === 0) return [];
    const startIndex = (day * 3) % allOintments.length;
    const result = [];
    for (let i = 0; i < count; i++) {
        const idx = (startIndex + i) % allOintments.length;
        result.push(allOintments[idx]);
    }
    return result;
}

export const PehlivanOintmentsData = {
  allOintments,
  getRotatingOintments,
};
