import {
  GladiatorEchoType,
  HazardCategory,
  LabyrinthAtmosphereEvent,
  LabyrinthBiomeType,
  LabyrinthGladiatorEcho,
  LabyrinthHabitatSynergy,
  LabyrinthHazard,
  LabyrinthPuzzle,
  PuzzleType,
} from '../domain/model.js';



/**
 * Labirent için zengin ekosistem, tehlike, bulmaca, ekipman sinerjisi,
 * ortam ambiyansı ve diğer gladyatörlerin arka plan yankı kütüphanesi.
 */

// =========================================================================
// 🧱 1. TEHLİKELER & TUZAKLAR KÜTÜPHANESİ (HER BİYOM İÇİN ZENGİN HAVUZ)
// =========================================================================

function getAllHazards() {
    return [
        // === KADİM SU SARNICI TEHLİKELERİ ===
        new LabyrinthHazard({
            id: 'hz_sarnic_flooded_gate',
            name: 'Taşan Su Bendi & Girdap Çukuru',
            category: HazardCategory.SUBMERGED_WATER,
            description: 'Paslı su bendi aniden boşalarak dehlizi buz gibi çamurlu suyla doldurur.',
            triggerNarrative: 'Karanlık su kanalı aniden köpürdü! Açılan bent kapağından fışkıran basınçlı akıntı ayaklarını yerden kesti!',
            avoidNarrative: 'Akıntının sesini önceden fark edip duvardaki demir boruya tutundun ve boğucu dalgayı üstünden aşırdın.',
            failureNarrative: 'Buz gibi su akıntısı seni taş duvara çaldı; ciğerlerin yosunlu suyla doldu ve soluğun kesildi!',
            damageAmount: 22,
            agilityThreshold: 13,
            strengthThreshold: 14,
            armorMitigationPercent: 10,
            primaryBiome: LabyrinthBiomeType.KADIM_SARNIC
        }),
        new LabyrinthHazard({
            id: 'hz_sarnic_mossy_abyss',
            name: 'Yosunlu Kaygan Çıkıntı',
            category: HazardCategory.CHASM_FALL,
            description: 'Yüzyıllık balçıkla sıvanmış, bastıkça kayan dar bir su bend kenarı.',
            triggerNarrative: 'Ayak bastığın yosunlu granit taş bir sabun gibi kaydı! Aşağıdaki sivri taş bentlere doğru sendeledin!',
            avoidNarrative: 'Ağırlık merkezini çevikçe geriye çekip kılıcının kabzasını duvardaki yarığa saplayarak dengeni sağladın.',
            failureNarrative: 'Kaygan taştan kayıp dizini sivri bent demirlerine çarptın; etin parçalandı ve bileğin burkuldu!',
            damageAmount: 18,
            agilityThreshold: 14,
            strengthThreshold: 11,
            armorMitigationPercent: 25,
            primaryBiome: LabyrinthBiomeType.KADIM_SARNIC
        }),
        new LabyrinthHazard({
            id: 'hz_sarnic_swamp_leeches',
            name: 'Zehirli Bataklık Sülük Yuvası',
            category: HazardCategory.POISON_ACID,
            description: 'Durgun suların dibinde saklanan, eti uyuşturup kan emen devasa sülükler.',
            triggerNarrative: 'Bileklerine kadar suya girdiğin anda soğuk, yapışkan dokunaçlar çizmelerinin ek yerlerinden etine yapıştı!',
            avoidNarrative: 'Hızlıca meşaleyi suya yaklaştırıp cildini yakan sülükleri alevle dağlayarak üzerlerinden sıyrıldın.',
            failureNarrative: 'Sülüklerin zehirli salgısı bacaklarını uyuşturdu; kan kaybından gözlerin karardı!',
            damageAmount: 20,
            agilityThreshold: 12,
            strengthThreshold: 12,
            armorMitigationPercent: 15,
            primaryBiome: LabyrinthBiomeType.KADIM_SARNIC
        }),

        // === VOLKANİK KÖR KÜKÜRT FIRINLARI ===
        new LabyrinthHazard({
            id: 'hz_volkan_magma_vent',
            name: 'Kızgın Magma Buhar Bacası',
            category: HazardCategory.FIRE_HEAT,
            description: 'Zemindeki çatlaklardan aniden göğe yükselen kızgın kükürt buharı.',
            triggerNarrative: 'Zemin altından gelen gürültülü bir fokurdama! Granit yarıklardan fışkıran basınçlı kızgın buhar önünü kesti!',
            avoidNarrative: 'Pelerinini burnuna sarıp sağ taraftaki soğuk kaya çıkıntısına yuvarlanarak buhar sütunundan kaçtın.',
            failureNarrative: 'Kızgın kükürt buharı yüzünü ve göğsünü yaladı; derinde ağır kabarcıklar açıldı ve ciğerlerin yandı!',
            damageAmount: 26,
            agilityThreshold: 13,
            strengthThreshold: 12,
            armorMitigationPercent: 15,
            primaryBiome: LabyrinthBiomeType.VOLKANIK_KORLUK
        }),
        new LabyrinthHazard({
            id: 'hz_volkan_sulfur_grate',
            name: 'Kükürtlü Ateş Izgarası',
            category: HazardCategory.FIRE_HEAT,
            description: 'Üzerine basıldığında alttaki kızgın kömürlerin harladığı dövme demir ızgara.',
            triggerNarrative: 'Bastığın metal ızgara aniden kor kırmızıya döndü! Aşağıdaki lav çukurundan alev dilleri yükseldi!',
            avoidNarrative: 'Adımını hiç bekletmeden tek bir yaylanışla ızgaranın sağlam kenarına sıçrayarak alevlerin arasından uçtun.',
            failureNarrative: 'Tabanların kor gibi kızarmış ızgaraya yapıştı; dumanlar yükselirken dayanılmaz bir acı vücudunu sardı!',
            damageAmount: 24,
            agilityThreshold: 14,
            strengthThreshold: 11,
            armorMitigationPercent: 20,
            primaryBiome: LabyrinthBiomeType.VOLKANIK_KORLUK
        }),

        // === ÇÜRÜMÜŞ BATAKLIK & ZEHİRLİ SARMAŞIKLAR ===
        new LabyrinthHazard({
            id: 'hz_sarmasik_strangler_roots',
            name: 'Et Boğan Dikenli Sarmaşıklar',
            category: HazardCategory.CRUSHING,
            description: 'Canlı gibi kıvrılan, kemik kıran kalın dikenli sarmaşık düğümleri.',
            triggerNarrative: 'Kuru yaprakların altından fırlayan kalın siyah sarmaşıklar bileklerine dolanıp seni tavana doğru çekti!',
            avoidNarrative: 'Kemerindeki keskini yıldırım hızıyla çekip sarmaşığın ana düğümünü tek darbede keserek kurtuldun.',
            failureNarrative: 'Dikenli kökler göğsünü ve kollarını sıktı; dikenler derine batıp zehirli özsuyunu damarlarına akıttı!',
            damageAmount: 23,
            agilityThreshold: 12,
            strengthThreshold: 15,
            armorMitigationPercent: 25,
            primaryBiome: LabyrinthBiomeType.CURUK_SARMASIK
        }),
        new LabyrinthHazard({
            id: 'hz_sarmasik_spore_cloud',
            name: 'Mor Mantar Zehir Sporu',
            category: HazardCategory.POISON_ACID,
            description: 'Tavandaki dev mor mantarlardan süzülen soluk kesici zehirli spor bulutu.',
            triggerNarrative: 'Patlayan dev bir mantar kesesinden mor renkli ağır bir toz bulutu odayı kapladı!',
            avoidNarrative: 'Nefesini tutup hızla rüzgar alan dar menfeze doğru atılarak spor bulutunun dağılmasını bekledin.',
            failureNarrative: 'Zehirli mantar tozunu soludun; boğazın düğümlendi, gözlerin yaşardı ve kasların felç gibi uyuştu!',
            damageAmount: 21,
            agilityThreshold: 13,
            strengthThreshold: 11,
            armorMitigationPercent: 10,
            primaryBiome: LabyrinthBiomeType.CURUK_SARMASIK
        }),
        new LabyrinthHazard({
            id: 'hz_sarmasik_acid_pool',
            name: 'Köpüren Asit Bataklığı',
            category: HazardCategory.POISON_ACID,
            description: 'Zırhı ve eti saniyeler içinde eriten yeşil asit birikintisi.',
            triggerNarrative: 'Yolunu kapatan köpüklü balçık birikintisinden et kokusu yükseliyor; zemin yeşil asitle kaynıyor!',
            avoidNarrative: 'Duvardaki kuru kökleri basamak yaparak asit havuzunun üzerinden akrobatik bir sıçrayışla geçtin.',
            failureNarrative: 'Asit çamuru çizmenize ve zırhınıza sıçradı; metali eritip etinizi kızgın demir gibi dağladı!',
            damageAmount: 25,
            agilityThreshold: 14,
            strengthThreshold: 12,
            armorMitigationPercent: 15,
            primaryBiome: LabyrinthBiomeType.CURUK_SARMASIK
        }),

        // === DİPSİZ UÇURUM & ASMA KÖPRÜLER ===
        new LabyrinthHazard({
            id: 'hz_yarik_rickety_bridge',
            name: 'Çürük Halatlı Asma Köprü',
            category: HazardCategory.CHASM_FALL,
            description: 'Derin yarığın üzerinde rüzgarla salınan, tahtaları çürümüş kadim köprü.',
            triggerNarrative: 'Köprünün ortasına vardığında çürümüş kenevir halatlardan biri gürültüyle koptu! Köprü yana yattı!',
            avoidNarrative: 'Köprünün sağlam kalan ana halatına iki elle yapışıp kendini ileriye fırlatarak sağlam kayaya ulaştın.',
            failureNarrative: 'Kırılan tahtalardan boşluğa doğru kaydın; son anda kayaya çarparak tutundun ama kaburgaların ezildi!',
            damageAmount: 27,
            agilityThreshold: 15,
            strengthThreshold: 13,
            armorMitigationPercent: 15,
            primaryBiome: LabyrinthBiomeType.DIPSIZ_YARIK
        }),
        new LabyrinthHazard({
            id: 'hz_yarik_wind_chasm',
            name: 'Yeraltı Fırtına Cereyanı',
            category: HazardCategory.CHASM_FALL,
            description: 'Uçurumun dibinden yukarı doğru fışkıran hortum benzeri fırtına rüzgarı.',
            triggerNarrative: 'Karanlık yarıktan yukarı uğuldayarak fırlayan şiddetli bir hava cereyanı dengeni bozdu!',
            avoidNarrative: 'Yere kapanıp ağırlığını granit zemine verdin; rüzgarın geçmesini bekleyerek savrulmaktan kurtuldun.',
            failureNarrative: 'Hava girdabı seni savurup sivri kireçtaşı sütununa vurdu; kan revan içinde kaldın!',
            damageAmount: 22,
            agilityThreshold: 14,
            strengthThreshold: 14,
            armorMitigationPercent: 20,
            primaryBiome: LabyrinthBiomeType.DIPSIZ_YARIK
        }),

        // === ÇARKLI MEKANİZMA & EZİCİ BLOKLAR ===
        new LabyrinthHazard({
            id: 'hz_carkli_crushing_slab',
            name: 'İnen Ezici Granit Blok',
            category: HazardCategory.CRUSHING,
            description: 'Tavandaki mekanizmadan aniden yere inen tonlarca ağırlıkta yontma granit.',
            triggerNarrative: 'Tavandan gelen madeni bir kilit sesi! Devasa bir granit blok gürültüyle üzerine doğru çöktü!',
            avoidNarrative: 'Darbeyi saliseler önce sezip ileriye doğru kayarak bloğun arkandaki zemini un ufak etmesini izledin.',
            failureNarrative: 'Granit blok omzunu ve sırtını sıyırdı; kemiklerin çatırdadı ve toz duman içinde yere kapaklandın!',
            damageAmount: 30,
            agilityThreshold: 15,
            strengthThreshold: 15,
            armorMitigationPercent: 35,
            primaryBiome: LabyrinthBiomeType.CARKLI_MEKANIZMA
        }),
        new LabyrinthHazard({
            id: 'hz_carkli_spinning_scythes',
            name: 'Dönen Çift Tırpan Koridoru',
            category: HazardCategory.MECHANICAL_BLADE,
            description: 'Duvarlardaki yatay kanallardan fır dönerek çıkan bronz kesici tırpanlar.',
            triggerNarrative: 'Duvarlardan çıkan dişli sesiyle birlikte ustura keskinliğinde iki dev tırpan koridoru süpürmeye başladı!',
            avoidNarrative: 'Tırpanın geçiş ritmini hesaplayıp tam zamanında eğilerek başının üzerinden vınlayarak geçmesine izin verdin.',
            failureNarrative: 'Dönen tırpan göğüs zırhını biçti; derin bir çelik kesiğiyle sarsıldın!',
            damageAmount: 28,
            agilityThreshold: 14,
            strengthThreshold: 12,
            armorMitigationPercent: 30,
            primaryBiome: LabyrinthBiomeType.CARKLI_MEKANIZMA
        }),
        new LabyrinthHazard({
            id: 'hz_carkli_dart_wall',
            name: 'Basınçlı Çelik Temren Yuvaları',
            category: HazardCategory.MECHANICAL_BLADE,
            description: 'Gizli basınç teline dokunulduğunda duvardan fırlayan onlarca çelik iğne.',
            triggerNarrative: 'Ayağın görünmez bir kenevir tele takıldı! Karşı duvardaki yüzlerce delikten çelik oklar fırladı!',
            avoidNarrative: 'Kalkanını anında öne çekip arkasına kapandın; fırlayan oklar kalkanından sekerek yere döküldü.',
            failureNarrative: 'Ok sağanağı bacağına ve omzuna saplandı; çelik temrenler etini parçaladı!',
            damageAmount: 22,
            agilityThreshold: 13,
            strengthThreshold: 11,
            armorMitigationPercent: 40,
            primaryBiome: LabyrinthBiomeType.CARKLI_MEKANIZMA
        }),

        // === KUTSAL RÜNİK KRİPTA & LAHİT DEHLİZLERİ ===
        new LabyrinthHazard({
            id: 'hz_kripta_phantom_curse',
            name: 'Gölge Laneti Çemberi',
            category: HazardCategory.POISON_ACID,
            description: 'Lahit kaidesine çizilmiş, ruhu sıkan ve görüşü körelten kadim rün halkası.',
            triggerNarrative: 'Bastığın mermer plaka mavi rünlerle parladı! Ruhunu donduran karanlık bir ürperti zihnini işgal etti!',
            avoidNarrative: 'Gözlerini kısıp iradeni topladın; rün çemberinin dışına sıçrayarak büyülü sisi arkanda bıraktın.',
            failureNarrative: 'Lanetli enerji göğsüne bir kurşun ağırlığı gibi çöktü; damarlarındaki kan dondu ve dizlerinin bağı çözüldü!',
            damageAmount: 24,
            agilityThreshold: 12,
            strengthThreshold: 14,
            armorMitigationPercent: 10,
            primaryBiome: LabyrinthBiomeType.KUTSAL_KRIPTA
        }),
        new LabyrinthHazard({
            id: 'hz_kripta_illusion_floor',
            name: 'Yanılsamalı Mermer Boşluk',
            category: HazardCategory.CHASM_FALL,
            description: 'Sağlam taş gibi görünen ama içi boş bir kuyuya açılan rünik illüzyon örtüsü.',
            triggerNarrative: 'Yere bastığın mermer döşeme bir serap gibi dağıldı! Altındaki sivri demir kazıklı kuyuya doğru düştün!',
            avoidNarrative: 'Düşerken duvardaki lahit rölyefine parmaklarını geçirip kendini yukarıya çekerek kuyunun üstünden aştın.',
            failureNarrative: 'Boşluğa düşüp sivri kazıkların kenarına çarptın; vücudunda derin yırtıklar açıldı!',
            damageAmount: 26,
            agilityThreshold: 14,
            strengthThreshold: 13,
            armorMitigationPercent: 25,
            primaryBiome: LabyrinthBiomeType.KUTSAL_KRIPTA
        })
    ]
}

// =========================================================================
// 🧩 2. BULMACALAR & ETKİLEŞİMLİ MEKANİZMALAR KÜTÜPHANESİ
// =========================================================================

function getAllPuzzles() {
    return [
        new LabyrinthPuzzle({
            id: 'pz_gears_synchronization',
            title: 'Üç Dişli Çark Senkronizasyonu',
            type: PuzzleType.GEAR_LEVER,
            description: 'Kapıyı kilitleyen üç bronz dişli çark farklı hızlarda dönüyor. Doğru sıra ile kilit mandallarını indirmelisin.',
            clueText: 'Duvardaki kabartmada: \'Önce büyük çarkın ağırlığı durdurulur, sonra hızlı olan kilitlenir.\' yazıyor.',
            solvedNarrative: 'Mandalları doğru sırayla kilitledin! Dişliler senkronize oldu ve ağır demir kapı gıcırdayarak açıldı.',
            failNarrative: 'Yanlış mandalı indirdin! Çarklar ters dönerek mekanizmayı kilitledi ve geriye doğru tepti!',
            rewardGold: 50,
            rewardFame: 3,
            primaryBiome: LabyrinthBiomeType.CARKLI_MEKANIZMA
        }),
        new LabyrinthPuzzle({
            id: 'pz_weight_pressure_scale',
            title: 'Çift Kefeli Taş Kaide Dengesi',
            type: PuzzleType.WEIGHT_PRESSURE,
            description: 'Zemindeki hidrolik kapı iki ayrı kaideye tam eşit ağırlık konmasını gerektiriyor.',
            clueText: 'Kaidenin üzerinde: \'Kan döken zırhın ağırlığı, kılıcın adaletiyle eşitlenmelidir.\' yazısı kazınmış.',
            solvedNarrative: 'Granit taş blokları ve ekipmanlarını doğru kaidelere yerleştirerek teraziyi kusursuz dengeledin. Geçit açıldı!',
            failNarrative: 'Ağırlık dengesini kuramadın; kaide aşağı çöktü ve duvardan zehirli oklar fışkırdı!',
            rewardGold: 45,
            rewardFame: 2,
            primaryBiome: LabyrinthBiomeType.CARKLI_MEKANIZMA
        }),
        new LabyrinthPuzzle({
            id: 'pz_light_prism_refraction',
            title: 'Kadim Bronz Ayna Işıltısı',
            type: PuzzleType.LIGHT_REFRACTION,
            description: 'Tavandaki tek ışık huzmesini üç cilalı bronz aynayla kapının üzerindeki rünik kristale odaklamalısın.',
            clueText: 'Aynaların kaidesinde rüzgar yönlerini simgeleyen ok işaretleri var.',
            solvedNarrative: 'Aynaları doğru açıyla çevirdin! Işık demeti kapının kalbindeki safir taşa çarptı ve mühür çözüldü.',
            failNarrative: 'Işık yanlış açıya yansıdı; kristal aşırı ısınıp patladı ve etrafa şarapnel gibi kıvılcımlar saçtı!',
            rewardGold: 60,
            rewardFame: 4,
            primaryBiome: LabyrinthBiomeType.KUTSAL_KRIPTA
        }),
        new LabyrinthPuzzle({
            id: 'pz_water_sluice_valves',
            title: 'Su Kanalları Yönlendirme Vanaları',
            type: PuzzleType.WATER_VALVE,
            description: 'Odayı dolduran suyu tahliye etmek için üç su vanasını su debisine göre çevirmelisin.',
            clueText: 'Paslı pirinç levhada: \'Durgun suyu önce boşalt, köpüren akıntıyı en son kes.\' yazılı.',
            solvedNarrative: 'Vanaları doğru sırayla çevirdin; su kanalları açıldı ve diz boyu su dehlizden tahliye oldu.',
            failNarrative: 'Yanlış vanayı açtın; yüksek basınçlı su vanayı yerinden fırlatarak göğsüne çarptı!',
            rewardGold: 40,
            rewardFame: 2,
            primaryBiome: LabyrinthBiomeType.KADIM_SARNIC
        }),
        new LabyrinthPuzzle({
            id: 'pz_secret_brick_latch',
            title: 'Yanılsamalı Duvar & Gizli Mandal',
            type: PuzzleType.SECRET_LATCH,
            description: 'Tuğlaların arasında gizlenmiş sahte bir kabartma ve arkasındaki açma kolu.',
            clueText: 'Duvardaki örümcek ağlarının az olduğu tuğla grubu hafifçe içeri çökmüş görünüyor.',
            solvedNarrative: 'Gizli tuğlayı fark edip içeri bastın; duvar yana kayarak zengin bir gizli sandık odasını açtı!',
            failNarrative: 'Tuğlayı yanlış ittin; duvarın arkasındaki gizli delikten zehirli gaz fısıldadı!',
            rewardGold: 55,
            rewardFame: 3,
            primaryBiome: LabyrinthBiomeType.DIPSIZ_YARIK
        }),
        new LabyrinthPuzzle({
            id: 'pz_sacred_constellation_runes',
            title: 'Kadim Takımyıldız Rün Sıralaması',
            type: PuzzleType.RUNE_MATCHING,
            description: 'Lahit kapısındaki dört rünü diyarın mevsim sırasına göre dizmelisin.',
            clueText: 'Lahit kaidesinde: \'Kuzeyin ayazından doğan güneş, güneyin kızıl çöllerinde batar.\' yazıyor.',
            solvedNarrative: 'Rünleri mevsim sırasına göre yerleştirdin; lahitin kadim mührü kırıldı ve geçit açıldı!',
            failNarrative: 'Rün dizilimi bozuldu; lahitin içinden dondurucu bir mezar rüzgarı eserek seni savurdu!',
            rewardGold: 70,
            rewardFame: 4,
            primaryBiome: LabyrinthBiomeType.KUTSAL_KRIPTA
        })
    ]
}

// =========================================================================
// ⚔️ 3. EKİPMAN & HABİTAT SİNERJİLERİ (AVANTAJ VE DEZAVANTAJLAR)
// =========================================================================

function getAllHabitatSynergies() {
    return [
        new LabyrinthHabitatSynergy({
            id: 'syn_heavy_armor_crushing',
            name: 'Ağır Zırh Ezilme Direnci',
            targetBiome: LabyrinthBiomeType.CARKLI_MEKANIZMA,
            requiredEquipmentTypeOrStat: 'heavy_armor',
            isPositive: true,
            description: 'Dövme levha zırhlar ezici granit blokların ve tırpanların darbe etkisini kırar.',
            bonusDamageOrDefensePercent: 25,
            narrativeEffect: 'Ağır çelik plakaların ezici bloğun darbesini göğüsledi; kemiklerin kırılmaktan kurtuldu!'
        }),
        new LabyrinthHabitatSynergy({
            id: 'syn_heavy_armor_bridge_penalty',
            name: 'Ağır Zırh Köprü Yükü',
            targetBiome: LabyrinthBiomeType.DIPSIZ_YARIK,
            requiredEquipmentTypeOrStat: 'heavy_armor',
            isPositive: false,
            description: 'Ağır çelik zırh sallantılı tahta köprülerin çökme riskini artırır ve hızı düşürür.',
            bonusDamageOrDefensePercent: 20,
            narrativeEffect: 'Zırhının devasa ağırlığı çürük tahtaları çatırdattı; adımların yavaşladı ve köprü yana yattı!'
        }),
        new LabyrinthHabitatSynergy({
            id: 'syn_light_cloth_chasm_agility',
            name: 'Hafif Kumaş Uçurum Çevikliği',
            targetBiome: LabyrinthBiomeType.DIPSIZ_YARIK,
            requiredEquipmentTypeOrStat: 'light_cloth',
            isPositive: true,
            description: 'Keten ve ipek giysiler rüzgara karşı hafiflik sağlar, asma köprülerde dengeyi korur.',
            bonusDamageOrDefensePercent: 20,
            narrativeEffect: 'Hafif adımların köprü tahtalarına yük bindirmedi; bir tüy gibi süzülerek yarığı aştın!'
        }),
        new LabyrinthHabitatSynergy({
            id: 'syn_light_cloth_fire_vulnerability',
            name: 'Hafif Kumaş Tutuşma Tehlikesi',
            targetBiome: LabyrinthBiomeType.VOLKANIK_KORLUK,
            requiredEquipmentTypeOrStat: 'light_cloth',
            isPositive: false,
            description: 'Keten kumaşlar kızgın kükürt kıvılcımlarında hızla tutuşabilir.',
            bonusDamageOrDefensePercent: 25,
            narrativeEffect: 'Kızgın kıvılcımlar kumaş giysini tutuşturdu! Alevleri söndürmek için yuvarlanmak zorunda kaldın!'
        }),
        new LabyrinthHabitatSynergy({
            id: 'syn_shield_dart_deflection',
            name: 'Kalkan Ok ve Tırpan Sönümlemesi',
            targetBiome: LabyrinthBiomeType.CARKLI_MEKANIZMA,
            requiredEquipmentTypeOrStat: 'shield',
            isPositive: true,
            description: 'Geniş bir kalkan duvardan fırlayan okları ve dönen tırpanları tamamen engeller.',
            bonusDamageOrDefensePercent: 35,
            narrativeEffect: 'Kalkanını siper ederek ilerledin; fırlayan tüm oklar kalkanının yüzeyinde un ufak oldu!'
        }),
        new LabyrinthHabitatSynergy({
            id: 'syn_torch_crypt_perception',
            name: 'Meşale & Kristal Aydınlatması',
            targetBiome: LabyrinthBiomeType.KUTSAL_KRIPTA,
            requiredEquipmentTypeOrStat: 'torch',
            isPositive: true,
            description: 'Parlak meşale ışığı gölge illüzyonlarını dağıtır ve gizli tuzakları açığa çıkarır.',
            bonusDamageOrDefensePercent: 30,
            narrativeEffect: 'Meşalenin parlak alevi yerdeki sahte mermer illüzyonunu açığa çıkardı; tuzağa basmaktan kurtuldun!'
        })
    ]
}

// =========================================================================
// 🔊 4. ORTAM SESLERİ & DUYUSAL AMBİYANS KÜTÜPHANESİ
// =========================================================================

function getAtmosphericEvents(biome) {
    switch (biome) {
        case LabyrinthBiomeType.KADIM_SARNIC:
            return [
            new LabyrinthAtmosphereEvent({id: 'atm_s1', soundText: 'Uzak kanallardan gelen boğuk su şırıltısı ve paslı demir bent gıcırtısı...', sensoryDetail: 'Hava rutubetli ve ağır; duvarlardan soğuk damlalar süzülüyor.', biome: biome}),
            new LabyrinthAtmosphereEvent({id: 'atm_s2', soundText: 'Derin dehlizlerden bir su canavarının kuyruk şapırtısı yankılandı...', sensoryDetail: 'Suyun yüzeyinde halkalar oluşuyor; diplerde bir şey hareket ediyor.', biome: biome}),
            new LabyrinthAtmosphereEvent({id: 'atm_s3', soundText: 'Tavandan kopan yosunlu bir kireçtaşı parçası suya \'löp\' diye düştü...', sensoryDetail: 'Yeşilimsi fosforlu algler karanlıkta titrek bir ışık saçıyor.', biome: biome})
        ]
        case LabyrinthBiomeType.VOLKANIK_KORLUK:
            return [
            new LabyrinthAtmosphereEvent({id: 'atm_v1', soundText: 'Zemin altından gelen gürültülü bir magma kaynaması ve geniz yakan kükürt dumanı...', sensoryDetail: 'Hava o kadar sıcak ki göz kapakların kuruyor.', biome: biome}),
            new LabyrinthAtmosphereEvent({id: 'atm_v2', soundText: 'Uzak bir maden fırınından gelen ağır örs vuruşunu andıran ritmik gümlemeler...', sensoryDetail: 'Karanlığı kızıl lav damarları aydınlatıyor.', biome: biome}),
            new LabyrinthAtmosphereEvent({id: 'atm_v3', soundText: 'Bir kükürt bacasının tıslamasıyla koridor sıcak bir kül bulutuyla doldu...', sensoryDetail: 'Kül taneleri zırhının üzerine kar gibi yağıyor.', biome: biome})
        ]
        case LabyrinthBiomeType.CURUK_SARMASIK:
            return [
            new LabyrinthAtmosphereEvent({id: 'atm_m1', soundText: 'Sarmaşıkların arasından gelen ıslak bir fısıltı ve köklerin kasılma sesi...', sensoryDetail: 'Mor mantarların yaydığı sporlar havada parıldıyor.', biome: biome}),
            new LabyrinthAtmosphereEvent({id: 'atm_m2', soundText: 'Bir asit birikintisinin \'fısss\' diye kaynayarak taşı erittiği duyuldu...', sensoryDetail: 'Geniz yakan çürük organik madde kokusu mideni bulandırıyor.', biome: biome}),
            new LabyrinthAtmosphereEvent({id: 'atm_m3', soundText: 'Karanlık sazlıkların arasından sürünen devasa bir bataklık kırkayağının tıkırtısı...', sensoryDetail: 'Yerdeki çamur adımlarını ağırlaştırıyor.', biome: biome})
        ]
        case LabyrinthBiomeType.DIPSIZ_YARIK:
            return [
            new LabyrinthAtmosphereEvent({id: 'atm_y1', soundText: 'Dipsiz uçurumun dibinden yukarı uğuldayarak fırlayan dondurucu bir rüzgar cereyanı...', sensoryDetail: 'Aşağısı zifiri karanlık; atılan taşın sesi bile geri gelmiyor.', biome: biome}),
            new LabyrinthAtmosphereEvent({id: 'atm_y2', soundText: 'Asma köprünün çürük tahtalarının rüzgarla birlikte inlemesi...', sensoryDetail: 'Halatların gerilim sesi kulaklarında çınlıyor.', biome: biome}),
            new LabyrinthAtmosphereEvent({id: 'atm_y3', soundText: 'Yarık kenarından yuvarlanan taşların yankısı dakikalarca kesilmedi...', sensoryDetail: 'Adım atarken boşluğun çekim gücünü hissediyorsun.', biome: biome})
        ]
        case LabyrinthBiomeType.CARKLI_MEKANIZMA:
            return [
            new LabyrinthAtmosphereEvent({id: 'atm_c1', soundText: 'Duvarların içinden gelen devasa pirinç dişlilerin ritmik \'tık-tık-tık\' mekanik sesi...', sensoryDetail: 'Taş ve maden sürtünmesinden çıkan yağ kokusu havayı sarmış.', biome: biome}),
            new LabyrinthAtmosphereEvent({id: 'atm_c2', soundText: 'Uzak bir koridorda tonluk bir granit bloğun \'GÜÜÜM\' diye yere inme sarsıntısı...', sensoryDetail: 'Ayaklarının altındaki zemin hafifçe titriyor.', biome: biome}),
            new LabyrinthAtmosphereEvent({id: 'atm_c3', soundText: 'Dönen bir çelik tırpanın taşa sürtünerek çıkardığı kulak tırmalayıcı kıvılcım sesi...', sensoryDetail: 'Mekanizmaların arasında her an fırlayacak bir yay gerilimi var.', biome: biome})
        ]
        case LabyrinthBiomeType.KUTSAL_KRIPTA:
            return [
            new LabyrinthAtmosphereEvent({id: 'atm_k1', soundText: 'Mermer lahitlerin arasından esen fısıltılı bir mezar rüzgarı...', sensoryDetail: 'Kadim rün yazıları mavi bir nabız gibi hafifçe parıldıyor.', biome: biome}),
            new LabyrinthAtmosphereEvent({id: 'atm_k2', soundText: 'Uzak bir lahit kapağının mermer zeminde gıcırdayarak açılma sesi...', sensoryDetail: 'Gölge oyunları duvarlarda tanıdık yüzler çiziyor.', biome: biome}),
            new LabyrinthAtmosphereEvent({id: 'atm_k3', soundText: 'Soğuk mermer sessizliğini bozan tek bir damlanın metalik tınısı...', sensoryDetail: 'Zaman bu dehlizde durmuş gibi hissettiriyor.', biome: biome})
        ]
    }
}

// =========================================================================
// 📢 5. DİĞER GLADYATÖRLERİN ARKA PLAN YANKILARI (CANLI BİLDİRİMLER)
// =========================================================================

function generateDistantEcho(
    fighterA,
    fighterB,
    gladiatorPsychology,
    biome
) {
    // Psikolojik eğilime göre arka plan olayı üret
    if (gladiatorPsychology.treachery >= 70 && fighterB != null) {
            return new LabyrinthGladiatorEcho({
                id: `echo_betray_${Date.now()}`,
                echoType: GladiatorEchoType.BETRAYAL,
                primaryGladiatorName: fighterA,
                secondaryGladiatorName: fighterB,
                narrative: `Dehlizin derinliklerinden madeni bir çığlık koptu! ${fighterA}, müttefiki ${fighterB}'yi tuzağın önüne iterek ganimeti kaptı!`,
                biome: biome
            })
        // Yüksek sadakat / gurur -> İttifak yankısı
    } else if (gladiatorPsychology.pride >= 80 && fighterB != null) {
            return new LabyrinthGladiatorEcho({
                id: `echo_alliance_${Date.now()}`,
                echoType: GladiatorEchoType.ALLIANCE,
                primaryGladiatorName: fighterA,
                secondaryGladiatorName: fighterB,
                narrative: `Uzak bir kemer altından kalkan çarpışması duyuldu: ${fighterA} ve ${fighterB} sırt sırta vererek canavarlara karşı hat kurdu!`,
                biome: biome
            })
        // Yüksek vahşet / içgüdü -> Canavar kapışması
    } else if (gladiatorPsychology.wildInstinct >= 75) {
            return new LabyrinthGladiatorEcho({
                id: `echo_beast_${Date.now()}`,
                echoType: GladiatorEchoType.BEAST_ENCOUNTER,
                primaryGladiatorName: fighterA,
                secondaryGladiatorName: null,
                narrative: `Koridorlarda vahşi bir kükreme patladı! ${fighterA}, gözünü bürüyen kan hırsıyla dehliz canavarının boynuna atıldı!`,
                biome: biome
            })
        // Hırs -> Hazine kapışması
    } else if (gladiatorPsychology.ambition >= 75 && fighterB != null) {
            return new LabyrinthGladiatorEcho({
                id: `echo_loot_${Date.now()}`,
                echoType: GladiatorEchoType.LOOT_FIGHT,
                primaryGladiatorName: fighterA,
                secondaryGladiatorName: fighterB,
                narrative: `Bir sandık odasından küfürler ve kılıç şakırtısı yükseldi; ${fighterA} ve ${fighterB} altın sandığı paylaşamayıp kılıç çekti!`,
                biome: biome
            })
        // Boşvermişlik / kaza -> Tuzak kazası
    } else {
            return new LabyrinthGladiatorEcho({
                id: `echo_trap_${Date.now()}`,
                echoType: GladiatorEchoType.TRAP_TRIGGER,
                primaryGladiatorName: fighterA,
                secondaryGladiatorName: null,
                narrative: `Taş blokların gürültüsü labirenti sarstı... ${fighterA} bir zemin tuzağını tetikleyip kıl payı kurtuldu!`,
                biome: biome
            })
    }
}

export const LabyrinthEcosystemLibrary = {
  getAllHazards,
  getAllPuzzles,
  getAllHabitatSynergies,
  getAtmosphericEvents,
  generateDistantEcho,
};
