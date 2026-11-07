import * as kt from '../kt.js';
import { ArmorCategory, Equipment, EquipmentSlot, EquipmentSpecialTrait, ItemRarity, Stats } from '../domain/model.js';



/**
 * Zarafet Atölyesi (Mirza Nizar) için Silahsız Estetik Dövüş Teçhizatı Kataloğu.
 *
 * 5 Kategori x 50 Eşya = Toplam 250 Özel Parça:
 * 1. Başlık & Kafa Bandı (50 Adet - EquipmentSlot.HEAD)
 * 2. Üst Kıyafet & Yelek (50 Adet - EquipmentSlot.CHEST)
 * 3. Pantolon & Etek (50 Adet - EquipmentSlot.PANTS)
 * 4. Ayakkabı & Çizme (50 Adet - EquipmentSlot.BOOTS)
 * 5. Eldiven & Bileklik (50 Adet - EquipmentSlot.GLOVES)
 *
 * Temalar:
 * - Korsan & Çapulcu (Corsair)
 * - Fiyakalı & Sosyetik Saray İşi (Royal Aristocrat)
 * - Pespaye & Sokak Kabadayısı (Street Brawler)
 * - Egzotik Güney Krallıkları & Çöl İpeği (Southern Oasis)
 *
 * Tüm eşyalarda isAestheticUnarmed = true işaretlidir.
 */

// =========================================================================
// 1. BAŞLIK, ŞAPKA & KAFA BANDI (50 ADET)
// =========================================================================
function createAestheticHeadwear() {
    const list = []

    // Sokak & Pespaye (12 Adet)
    const streetNames = [
        ['Yıpranmış Keten Alın Bağı', 'Sokak dövüşlerinde terin göze inmesini engelleyen kaba keten bant.'],
        ['Yamalı Çapulcu Fesi', 'Kenarları yırtık, dikiş yerleri kaba iple tutturulmuş kül rengi sokak fesi.'],
        ['Tiftiklenmiş Boksör Sargısı', 'Kafaya sarılan, darbe şokunu hafifçe dağıtan yıpranmış pamuk sargı.'],
        ['Kömürcü Çırağı Bandanası', 'İs ve kömür tozuyla kararmış, yırtık pırtık hafif alın bezi.'],
        ['Bataklık Kabadayısı Bandı', 'Sert düğümlü, arkadan sarkan iki ucuyla hasma meydan okuyan kırmızı bez.'],
        ['Eski Meyhane Keçesi', 'Göz hizasını hafifçe gölgeleyen, delik deşik olmuş kaba keçe parça.'],
        ['Düğümlü İp Alınlık', 'Kaba kınap iplerinin örülmesiyle yapılmış, başı sıkan sert sokak bandı.'],
        ['Kaçak Forse Başlığı', 'Zindan kaçkınlarının kafalarını örtmek için paçavralardan diktiği kukuleta.'],
        ['Çamurlu İpek Kırpıntısı', 'Bir zamanlar soyluya ait olan ama çöplükten toplanıp yıkanmış ipek şerit.'],
        ['Dikenli Keten Sargı', 'Alın kısmına koruyucu kuru diken tohumları sıkıştırılmış hırçın sargı.'],
        ['Yırtık Han Bandanası', 'Meyhane kavgalarında kanla lekelenmiş, kabadayıların gururla taktığı bandana.'],
        ['Serseri Şakak Bandı', 'Şakak damarlarını sıkıştırarak odaklanmayı artıran dar deri şerit.']
    ]
    streetNames.forEach(([name, desc], i) => {
        const lvl = 1 + (i * 2)
        const gold = 25 + (i * 15)
        list.push(
            new Equipment({
                id: `eq_aes_head_street_${i + 1}`,
                name: name,
                slot: EquipmentSlot.HEAD,
                rarity: i > 8 ? ItemRarity.USTAISI : ItemRarity.SIRADAN,
                stats: new Stats({armor: 2 + (kt.idiv(i, 3)), speed: 2 + (kt.idiv(i, 4)), critChancePercent: 2 + (kt.idiv(i, 4))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.MISC_HEADGEAR,
                specialTrait: new EquipmentSpecialTrait({id: `trait_head_str_${i}`, name: 'Sokak Refleksi', description: 'Yakın temasta çevikliği artırır.', icon: '🥊'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Korsan & Çapulcu (13 Adet)
    const pirateNames = [
        ['Korsan Kaptan Trikornu', 'Üç köşeli, altın yaldız işlemeli ve tuzlu deniz rüzgarıyla sertleşmiş fiyakalı şapka.'],
        ['Kızıl Sakal İpek Bandanası', 'Kadırga güvertelerinde rüzgarla dalgalanan kan kırmızısı ipek kafa bandı.'],
        ['Tüylü Çapulcu Beresi', 'Kenarına martı tüyü iliştirilmiş, serseri korsanların gözdesi eğik bere.'],
        ['Tuzlu Denizci Sargısı', 'Deniz suyuyla kurutulmuş, güneşte parıldayan kalın keten baş bağı.'],
        ['Kancalı Korsan Fuları', 'Boyundan kafaya dolanan, gümüş kuru kafa tokalı korsan fuları.'],
        ['Mercan Kayalığı Şapkası', 'Kenarlarına ufak deniz kabukları dizilmiş gösterişli yağmacı şapkası.'],
        ['Barut Kokulu Kukuleta', 'Top atışlarının dumanını solumuş, yıpranmış kösele korsan kukuletası.'],
        ['Korsan Lordu Bandı', 'Güney denizlerinin korsan beylerine mahsus altın sikkelerle süslü alın bandı.'],
        ['Fırtına Güvertesi Türbanı', 'Fırtınalarda saçların savrulmasını önleyen sıkı düğümlü lacivert kumaş.'],
        ['Ters Yüz Edilmiş Süvari Şapkası', 'Yağmalanan bir kraliyet kalyonundan çalınmış, kenarı kıvrık kadife şapka.'],
        ['Karayip Dalgası Bandanası', 'Üzerine dalga motifleri el işiyle nakşedilmiş denizci bandanası.'],
        ['Korsan Düellocu Kasketi', 'Gözleri siper eden, güvertede yumruk yumruğa dövüş için dengelenmiş kasket.'],
        ['Yağmacı Kaptanın Kırmızı Fesi', 'Altın püsküllü, güney limanlarında nam salmış kaptan fesi.']
    ]
    pirateNames.forEach(([name, desc], i) => {
        const lvl = 4 + (i * 2)
        const gold = 80 + (i * 35)
        list.push(
            new Equipment({
                id: `eq_aes_head_pirate_${i + 1}`,
                name: name,
                slot: EquipmentSlot.HEAD,
                rarity: i > 9 ? ItemRarity.NADIDE : ItemRarity.USTAISI,
                stats: new Stats({armor: 3 + (kt.idiv(i, 3)), speed: 3 + (kt.idiv(i, 3)), dodgeChancePercent: 3 + (kt.idiv(i, 4)), damage: 2 + (kt.idiv(i, 4))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.MISC_HEADGEAR,
                specialTrait: new EquipmentSpecialTrait({id: `trait_head_pir_${i}`, name: 'Güverte Çalımı', description: 'Rakibin hamlesini boşa çıkarmayı kolaylaştırır.', icon: '🏴‍☠️'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Fiyakalı / Sosyetik Kraliyet (13 Adet)
    const royalNames = [
        ['Tavuskuşu Tüylü Barok Şapka', 'Geniş kenarlı, saf zümrüt yeşili tavuskuşu telekleriyle süslü aristokrat şapkası.'],
        ['Altın Varaklı Saray Tiarası', 'Alna oturan, narin altın sarmaşık dallarından örülü kraliyet alınlığı.'],
        ['Dantelli Kadife Maskara Şapkası', 'Yüzü yarı saydam siyah Fransız danteliyle gölgeleyen büyüleyici şapka.'],
        ['Safir Damlalı Gümüş Taç', 'Kafayı hafifçe saran, ortasında damla safir parıldayan asilzade tacı.'],
        ['Saten Düello Beresi', 'Saray salonlarında onur düellolarına çıkan şövalyelerin taktığı fiyakalı saten bere.'],
        ['Balo Salonu İpek Bandı', 'İncilerle bezenmiş, terlemeyi önleyen kokulu güney ipeği kafa bandı.'],
        ['Düşes Zarafeti Kukuletası', 'Bordo kadifeden dikilmiş, içi vizon kürküyle astarlı lüks başlık.'],
        ['Prens Muhafızı Miğferciği', 'Tamamen süs amaçlı, hafif altın kaplama cilalı salon başlığı.'],
        ['Pırlantalı Saç Ağcığı', 'Saçları tek bir teli dahi dağılmayacak şekilde toplayan elmas işlemeli file.'],
        ['Yaldızlı Maskaralık Kepi', 'Saray karnavallarında dövüş gösterisi yapan şampiyonların parlak kepi.'],
        ['Kardinal Kırmızısı Baş Bağı', 'Soyluların kanını temsil eden parlak lal kırmızısı ipek kafa bağı.'],
        ['Güneş Tanrıçası Çelengi', 'Altın yapraklardan yapılmış, başa takıldığında bir hale gibi parıldayan çelenk.'],
        ['Monark Zarafeti Trikornu', 'Kraliyet düklerinin özel siparişiyle dikilen samur kürklü muazzam şapka.']
    ]
    royalNames.forEach(([name, desc], i) => {
        const lvl = 8 + (i * 2)
        const gold = 300 + (i * 120)
        list.push(
            new Equipment({
                id: `eq_aes_head_royal_${i + 1}`,
                name: name,
                slot: EquipmentSlot.HEAD,
                rarity: i > 8 ? ItemRarity.KADIM : ItemRarity.NADIDE,
                stats: new Stats({armor: 5 + (kt.idiv(i, 3)), speed: 4 + (kt.idiv(i, 3)), dodgeChancePercent: 4 + (kt.idiv(i, 3)), maxHealth: 30 + (i * 10)}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.MISC_HEADGEAR,
                specialTrait: new EquipmentSpecialTrait({id: `trait_head_roy_${i}`, name: 'Asil Bakış', description: 'Hasmın gardındaki açıkların daha çabuk fark edilmesini sağlar.', icon: '👑'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Egzotik Güney & Çöl İpeği (12 Adet)
    const southernNames = [
        ['Zümrüt Vaha Şifon Türbanı', 'Çöl güneşinin kavurucu sıcağını kırıp serinlik veren tül gibi hafif türban.'],
        ['Yakut Broşlu Çöl Fesi', 'Ortasında ateş kırmızısı bir yakut taşıyan, güney pazarının en gözde fesi.'],
        ['Güneş Dansçısı Kafa Bandı', 'Rüzgarda şıkırdayan minik altın pullarla süslenmiş oryantal baş bandı.'],
        ['Kobra Pulu Sarılıklı Taç', 'Kurutulmuş kobra derisiyle sarılmış, mistik güney çölü kafa halkası.'],
        ['Kum Fırtınası Peçeli Türban', 'Gözler hariç tüm çehreyi ipekle örten, gizemli çöl dövüşçüsü başlığı.'],
        ['Mürver Çiçeği İpek Çatkısı', 'Güney bahçelerinin kokulu yağlarıyla tütsülenmiş lavanta rengi ipek çatkı.'],
        ['Altın Hilal Saç Tokası', 'Alnın tam ortasına inen minik altın hilal süslü esnek deri kordon.'],
        ['Gölge Şeyhi Başlığı', 'Gece serinliğinde çölde dövüşen gölge muhafızlarının zifiri karanlık örtüsü.'],
        ['Nilüfer Yaprağı Bandanası', 'Vaha göletlerindeki nilüfer desenleriyle dokunmuş su geçirmez ipek bez.'],
        ['Akrep İğnesi Alınlığı', 'Alın kemiğini darbelerden korumak için sertleştirilmiş bronz akrep arması.'],
        ['Güneş Tanrısı Tül Sarığı', 'On iki arşın uzunluğunda, baştan omuzlara dökülen şeffaf altın sarısı tül.'],
        ['Berrak Körfez İncili Bandı', 'Güney denizlerinden çıkarılan doğal incilerle örülmüş zarafet tacı.']
    ]
    southernNames.forEach(([name, desc], i) => {
        const lvl = 6 + (i * 2)
        const gold = 180 + (i * 70)
        list.push(
            new Equipment({
                id: `eq_aes_head_south_${i + 1}`,
                name: name,
                slot: EquipmentSlot.HEAD,
                rarity: i > 7 ? ItemRarity.NADIDE : ItemRarity.USTAISI,
                stats: new Stats({armor: 4 + (kt.idiv(i, 3)), speed: 5 + (kt.idiv(i, 3)), dodgeChancePercent: 5 + (kt.idiv(i, 3)), critChancePercent: 3 + (kt.idiv(i, 4))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.MISC_HEADGEAR,
                specialTrait: new EquipmentSpecialTrait({id: `trait_head_sth_${i}`, name: 'Çöl Serabı', description: 'Adımları rüzgar gibi hafifleterek darbelerden sıyırır.', icon: '☀️'}),
                isAestheticUnarmed: true
            })
        )
    });

    return list;
}

// =========================================================================
// 2. ÜST KIYAFET, GÖMLEK, YELEK & KORSE (50 ADET)
// =========================================================================
function createAestheticTops() {
    const list = []

    // Sokak & Pespaye (12 Adet)
    const streetTops = [
        ['Çift Askılı Yırtık Keten Atlet', 'Göğsü açık bırakan, terin kolayca uçmasını sağlayan salaş sokak atleti.'],
        ['Göğsü Açık Yamalı Dövüş Yeleği', 'Yakası yırtılmış, çıplak göğsü ve pazu kaslarını sergileyen ham deri yelek.'],
        ['Kaba İp Sarmalı Göğüslük', 'Kaburgaları korumak için kalın kendir ipleriyle gövdeye dolanmış kaba sargı.'],
        ['Bataklık Güreşçisi Kuşağı', 'Yalnızca omuzdan bele çapraz inen, gövdenin geri kalanını tamamen çıplak bırakan meşin bant.'],
        ['Yırtmaçlı Ham Keten Tunik', 'Kenarları kasıtlı olarak yırtılmış, hareket özgürlüğü sunan gri kumaş.'],
        ['Sokak Kabadayısı Yeleği', 'Önü iliklenmeyen, kalın kot kıvamında yıpranmış çuha kumaşından dikilme yelek.'],
        ['Tuzlu Terli Kasap Önlüğü Parçası', 'Yarım boyda kesilmiş, göğüs kafesini sürtünmelerden koruyan sert bez.'],
        ['Zincirli Deri Göğüs Bağı', 'Meme uçlarının altından geçen ve sırtı açıkta bırakan çivili dar deri kemer.'],
        ['Yamalı Dokuma Güreş Fanilası', 'Çekildiğinde yırtılmayacak şekilde kaba iple güçlendirilmiş çıplak kollu fanila.'],
        ['Liman Hamalı Göğüs Sargısı', 'Ağır yük taşımaktan nasırlaşmış omuzları saran elastik kaba kumaş şeritler.'],
        ['Serseri Çapraz Gövde Kemeri', 'Çıplak ten üzerinde parıldayan pirinç perçinli sokak kemeri.'],
        ['Düğümlü Boğuşma Yeleği', 'Rakibin tuttuğu an yırtılması için özel teğellenmiş, kurtulmayı kolaylaştıran yelek.']
    ]
    streetTops.forEach(([name, desc], i) => {
        const lvl = 1 + (i * 2)
        const gold = 30 + (i * 18)
        list.push(
            new Equipment({
                id: `eq_aes_top_street_${i + 1}`,
                name: name,
                slot: EquipmentSlot.CHEST,
                rarity: i > 8 ? ItemRarity.USTAISI : ItemRarity.SIRADAN,
                stats: new Stats({armor: 3 + (kt.idiv(i, 3)), damage: 3 + (kt.idiv(i, 3)), speed: 2 + (kt.idiv(i, 4)), maxHealth: 20 + (i * 5)}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.LIGHT_ARMOR,
                specialTrait: new EquipmentSpecialTrait({id: `trait_top_str_${i}`, name: 'Çıplak Ten Dayanıklılığı', description: 'Kenetlenmelerde sürtünmeyi avantaja çevirir.', icon: '🥋'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Korsan & Çapulcu (13 Adet)
    const pirateTops = [
        ['Bağcıklı Açık Göğüs Korsan Gömleği', 'Keten ipleri gevşetildiğinde göğsü tamamen sergileyen dökümlü beyaz kalyoncu gömleği.'],
        ['Kızıl Kadife Yağmacı Yeleği', 'Altın düğmeleri sökülmüş, kılıçsız boğuşmalarda fiyaka katan parlak kırmızı yelek.'],
        ['Sert Meşin Korsan Korsesi', 'Bel omurunu sımsıkı saran, nefes kontrolünü ve estetik dik duruşu artıran deri korse.'],
        ['Yırtmaçlı İpek Güverte Tuniki', 'Tuzlu fırtınalarda dalgalanan, göğüs kaslarını saran ince şeffaf ipek tunik.'],
        ['Deri Askılı Çıplak Omuzluk', 'Tek omzu örten, diğer omzu ve kolu tamamen çıplak bırakan asimetrik korsan zırhı.'],
        ['Korsan Kraliçesi Bağcıklı Büstiyeri', 'Göğüs kafesini destekleyen, esnek balenli ve işlemeli siyah saten büstiyer.'],
        ['Deniz Haydutu Göğüs Zırhçığı', 'Kaba dikişli fıçı derisinden dikilmiş, göbek kısmını açıkta bırakan kısa yelek.'],
        ['Barut Dumanı Kaftanı', 'Kolları yırtılarak koparılmış, sırtında korsan arması işlemeli salaş kaftan.'],
        ['Mercan Kırmızısı Açık Yelek', 'İçine hiçbir şey giyilmeden ten üzerine geçirilen, yaldızlı kenarlı fiyakalı parça.'],
        ['Süvari Kaptanı Düello Ceketi', 'Kolları dirseğe kadar sıvalı, dar kesim lacivert kraliyet korsanı ceketi.'],
        ['Altın Tokalı Deri Göğüs Bağı', 'Göğüs adalelerini vurgulayan, çapraz kayışlı lüks korsan donanımı.'],
        ['Güverte Cambazı Keten Askılığı', 'Halatlardan sallanırken sırtı terletmeyen son derece hafif keten üstlük.'],
        ['Fırtına Süvarisi Dövüş Yeleği', 'Balina derisiyle takviye edilmiş, su tutmayan esnek ve parlak koyu yelek.']
    ]
    pirateTops.forEach(([name, desc], i) => {
        const lvl = 4 + (i * 2)
        const gold = 90 + (i * 45)
        list.push(
            new Equipment({
                id: `eq_aes_top_pirate_${i + 1}`,
                name: name,
                slot: EquipmentSlot.CHEST,
                rarity: i > 9 ? ItemRarity.NADIDE : ItemRarity.USTAISI,
                stats: new Stats({armor: 5 + (kt.idiv(i, 3)), damage: 4 + (kt.idiv(i, 3)), speed: 4 + (kt.idiv(i, 3)), dodgeChancePercent: 3 + (kt.idiv(i, 4))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.LIGHT_ARMOR,
                specialTrait: new EquipmentSpecialTrait({id: `trait_top_pir_${i}`, name: 'Korsan Çalımı', description: 'Yakın temasta esneklik sağlayarak darbelerin şiddetini kırar.', icon: '⚓'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Fiyakalı / Sosyetik Kraliyet (13 Adet)
    const royalTops = [
        ['Altın Sırmalı Gece Mavisi Kadife Yelek', 'Düklerin özel davetlerde giydiği, kenarları altın varaklı muhteşem kadife yelek.'],
        ['İpek Dantelli Saray Düellocu Gömleği', 'Yakası kat kat dantellerle süslü, teni okşayan bembeyaz safir düğmeli gömlek.'],
        ['Zümrüt Kakmalı Asilzade Korsesi', 'İnce beli kum saati gibi sıkan, üzerine zümrüt taşlar işlenmiş büyüleyici korse.'],
        ['Saten Balon Kollu Saray Üstlüğü', 'Kolları geniş ve dökümlü, göğsü sımsıkı saran fildişi rengi aristokrat giysisi.'],
        ['Şampiyon Şövalye Göğüs Kaftanı', 'Kraliyet armalarıyla dokunmuş, içi ipek astarlı gösterişli kısa kaftan.'],
        ['Bordo Kadife Açık Göğüslük', 'Göğüs dekoltesi altın zincirlerle tutturulmuş, aristokrat düellolarının vazgeçilmezi.'],
        ['Pırlanta İşlemeli Saten Büstiyer', 'Işık altında binbir kıvılcım saçan, kadın dövüşçülerin asil tercihi lüks büstiyer.'],
        ['Gümüş İşlemeli Şeref Ceketi', 'Kolları sökülebilen, yalnızca beden kısmıyla dövüşe imkan veren kraliyet ceketi.'],
        ['Saray Nedimesi İpek Korseleti', 'Zarif kurdelelerle sırttan bağlanan, nefes aldırmayan estetik şaheser.'],
        ['Monark Zarafeti Çift Yeleği', 'Biri saten diğeri kadife iki katmandan oluşan, vuruşları yastıklayan kraliyet yeleği.'],
        ['Altın Varaklı Gövde Kuşağı', 'Göğüs altından kasıklara kadar sarılan, kasları heykel gibi belirginleştiren kuşak.'],
        ['Lal Taşı Düğmeli Balina Kemikli Korse', 'Darbe anında esnemeyen, rakibin kenetlenme tutuşunu imkansız kılan korse.'],
        ['İmparatoriçe Gecesi İpek Tuniki', 'Rüzgarda tül gibi uçuşan, teni gizemli bir şekilde örten asil zarafet parçası.']
    ]
    royalTops.forEach(([name, desc], i) => {
        const lvl = 8 + (i * 2)
        const gold = 350 + (i * 140)
        list.push(
            new Equipment({
                id: `eq_aes_top_royal_${i + 1}`,
                name: name,
                slot: EquipmentSlot.CHEST,
                rarity: i > 8 ? ItemRarity.KADIM : ItemRarity.NADIDE,
                stats: new Stats({armor: 8 + (kt.idiv(i, 3)), damage: 5 + (kt.idiv(i, 3)), speed: 5 + (kt.idiv(i, 3)), maxHealth: 50 + (i * 15)}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.LIGHT_ARMOR,
                specialTrait: new EquipmentSpecialTrait({id: `trait_top_roy_${i}`, name: 'Kraliyet Heybeti', description: 'Yakın boğuşmada rakibin moralini bozar.', icon: '💎'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Egzotik Güney & Çöl İpeği (12 Adet)
    const southernTops = [
        ['Vaha Melikesi Şeffaf Tül Üstlüğü', 'Yalnızca göğüs uçlarını altın motiflerle kapatan, tül gibi uçuşan vaha üstlüğü.'],
        ['Yakut Düğmeli Açık Çöl Kaftanı', 'Göğsü boydan boya açık bırakan, güneş ışığında yakutları parıldayan çöl ipeği.'],
        ['Güneş Dansçısı Altın Pullu Büstiyer', 'Dövüş esnasında her hamlede çıngırak gibi ses veren altın pullu egzotik parça.'],
        ['Kobra Gerdanlığı ve İpek Göğüslük', 'Boyundan göğse inen kobra derisi şeritlerle teni saran vahşi güney büstiyeri.'],
        ['Çöl Fırtınası Sarmal İpeği', 'On arşın ipeğin gövdeye sımsıkı sarılmasıyla oluşan, yırtıldıkça yenisi açılan giysi.'],
        ['Mürver Ağacı Reçinesi Yeleği', 'Esnek güney ağaçlarının kabuk liflerinden dokunmuş ter kokutmayan harika yelek.'],
        ['Kızıl Vaha İpek Yelekçiği', 'Kısa kesim, göbek ve sırtı tamamen açıkta bırakan ipek dövüş yeleği.'],
        ['Gölge Kervanı Deri Büstiyeri', 'Çöl kertenkelesi derisinden dikilmiş, tutuşu kaydıran pürüzsüz yüzeyli üstlük.'],
        ['Güneş Şeyhi Altın İplikli Cübbeciği', 'Kolları kesilmiş, çıplak göğsü rüzgarla buluşturan altın sırmalı çöl üstlüğü.'],
        ['Nilüfer Çiçeği Göğüs Sargısı', 'Su perilerini andıran desenlerle bezeli, suya ve tere dayanıklı yeşil ipek.'],
        ['Akrep Yuvası Deri Zırhçığı', 'Önü çapraz bağcıklı, sırt adalelerini tamamen açıkta bırakan hırçın güney giysisi.'],
        ['Körfez İncisi İpek Kaşkorse', 'Doğal incilerle kenarları işlenmiş, nefes kesen zarafette güney şaheseri.']
    ]
    southernTops.forEach(([name, desc], i) => {
        const lvl = 6 + (i * 2)
        const gold = 200 + (i * 80)
        list.push(
            new Equipment({
                id: `eq_aes_top_south_${i + 1}`,
                name: name,
                slot: EquipmentSlot.CHEST,
                rarity: i > 7 ? ItemRarity.NADIDE : ItemRarity.USTAISI,
                stats: new Stats({armor: 6 + (kt.idiv(i, 3)), damage: 4 + (kt.idiv(i, 3)), speed: 6 + (kt.idiv(i, 3)), dodgeChancePercent: 5 + (kt.idiv(i, 3))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.LIGHT_ARMOR,
                specialTrait: new EquipmentSpecialTrait({id: `trait_top_sth_${i}`, name: 'Güneşin Dokunuşu', description: 'Çevik sıyrılışlarda hasmın gözünü kamaştırır.', icon: '🌟'}),
                isAestheticUnarmed: true
            })
        )
    });

    return list;
}

// =========================================================================
// 3. PANTOLON, ŞALVAR & KISA / UZUN ETEKLER (50 ADET)
// =========================================================================
function createAestheticBottoms() {
    const list = []

    // Sokak & Pespaye (12 Adet)
    const streetBottoms = [
        ['Yırtmaçlı Ham Keten Dövüş Şalvarı', 'Diz altı serbest, adımları ve tekmeleri asla kısıtlamayan salaş sokak şalvarı.'],
        ['Dizleri Yamalı Meşin Pantolon', 'Kumlara sürtünmekten dizleri erimiş, kat kat deriyle yamalanmış kaba pantolon.'],
        ['Sokak Kabadayısı Kısa Peştamalı', 'Belden sıkıca düğümlenmiş, bacakların çevikliğini sergileyen çizgili peştamal.'],
        ['Bataklık Güreşçisi Külot-Şortu', 'Çamurda ve kumda tutuşu imkansız kılan dar kesim ham deri dövüş şortu.'],
        ['Çuha Kumaşından Salaş Pantolon', 'Paçaları iplerle bileğe bağlanmış, kabadayı adımlarına uygun esnek altlık.'],
        ['Kaba Kendir Dokuma Etekçik', 'Gladyatörlerin bacak hareketini serbest bırakan katlı kaba keten dövüş eteği.'],
        ['Yırtık Pırtık Liman Şortu', 'Gülle gibi tekmeler savururken rüzgar gibi esneyen hafif paçavra altlık.'],
        ['Zincir Kemerli Sokak Pantolonu', 'Beline paslı bir forsa zinciri dolanmış, kalçayı sıkan dayanıklı alt giysi.'],
        ['Kömür Tozlu Güreş Şalvarı', 'Karanlık sokak dövüşlerinde tozu içine çeken koyu renkli esnek kumaş.'],
        ['Düğümlü İp Peştamal', 'Yalnızca ön ve arka kısmı örten, yanları tamamen açıkta bırakan cüretkar güreş örtüsü.'],
        ['Serseri Paça Pantolonu', 'Bacak arkası kirişlerini korumak için kalınlaştırılmış ham pamuk pantolon.'],
        ['Yalınayak Dövüşçü Tozluğu', 'Kaval kemiğini hafif darbelerden koruyan kaba sargılı bacak altlığı.']
    ]
    streetBottoms.forEach(([name, desc], i) => {
        const lvl = 1 + (i * 2)
        const gold = 28 + (i * 16)
        list.push(
            new Equipment({
                id: `eq_aes_bot_street_${i + 1}`,
                name: name,
                slot: EquipmentSlot.PANTS,
                rarity: i > 8 ? ItemRarity.USTAISI : ItemRarity.SIRADAN,
                stats: new Stats({armor: 2 + (kt.idiv(i, 3)), speed: 3 + (kt.idiv(i, 3)), dodgeChancePercent: 2 + (kt.idiv(i, 4))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.PANTS,
                specialTrait: new EquipmentSpecialTrait({id: `trait_bot_str_${i}`, name: 'Sokak Çelmesi', description: 'Bacak çelmeleri ve süpürmelerde dengeyi korur.', icon: '🦵'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Korsan & Çapulcu (13 Adet)
    const pirateBottoms = [
        ['Geniş Paçalı Korsan Şalvarı', 'Gemi güvertesinde dengeli basmayı sağlayan, rüzgarla şişen dökümlü çizgili şalvar.'],
        ['Korsan Kaptanı Dar Deri Pantolonu', 'Bacak kaslarını sımsıkı saran, diz kapağı perçinli koyu kahve esnek deri.'],
        ['Derin Yırtmaçlı Yağmacı Eteği', 'Her iki yanından bel hizasına kadar yırtmaçlı, yüksek tekmeler için tasarlanmış etek.'],
        ['Tuzlu Suyla Sertleşmiş Güverte Pantolonu', 'Diz darbelerini absorbe eden, kayganlaştırılmış sağlam kumaş.'],
        ['Kızıl İpek Korsan Etek-Şortu', 'Hem şort rahatlığı hem etek zarafeti sunan çift katmanlı korsan altlığı.'],
        ['Gümüş Tokalı Süvari Şalvarı', 'Kalyon baskınlarında ganimetten kapılmış, kemeri tokalarla bezeli şık şalvar.'],
        ['Mercan Adaları Kısa Dövüş Eteği', 'Etek ucuna deniz kabukları ve pirinç pullar işlenmiş gösterişli dövüş eteği.'],
        ['Barut Fıçısı Kösele Pantolonu', 'Kalça ve basen bölgesini koruyan esnek tabaklanmış süvari derisi.'],
        ['Korsan Kraliçesi Deri Eteği', 'Önü kısa arkası uzun, estetik dövüş hareketlerinde savrulan asimetrik etek.'],
        ['Fırtına Süvarisi İpek Şalvarı', 'Çivit mavisi ipekten dikilmiş, güverte cambazlarının gözdesi hafif parça.'],
        ['Püsküllü Çapulcu Pantolonu', 'Yan dikişlerinden deri püsküller sarkan fiyakalı denizci altlığı.'],
        ['Korsan Düellocu Külotu', 'Diz boyunda biten, bacak sargılarıyla kusursuz uyum sağlayan korsan pantolonu.'],
        ['Yağmacı Lordun Brokar Şalvarı', 'Altın sırma işlemeli, güney korsan beylerinin zarafet timsali.']
    ]
    pirateBottoms.forEach(([name, desc], i) => {
        const lvl = 4 + (i * 2)
        const gold = 85 + (i * 40)
        list.push(
            new Equipment({
                id: `eq_aes_bot_pirate_${i + 1}`,
                name: name,
                slot: EquipmentSlot.PANTS,
                rarity: i > 9 ? ItemRarity.NADIDE : ItemRarity.USTAISI,
                stats: new Stats({armor: 4 + (kt.idiv(i, 3)), speed: 4 + (kt.idiv(i, 3)), dodgeChancePercent: 4 + (kt.idiv(i, 3))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.PANTS,
                specialTrait: new EquipmentSpecialTrait({id: `trait_bot_pir_${i}`, name: 'Dalga Salınımı', description: 'Zeminde kaymadan ani yön değiştirmeyi sağlar.', icon: '🌊'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Fiyakalı / Sosyetik Kraliyet (13 Adet)
    const royalBottoms = [
        ['Kat Kat Dantelli İpek Dövüş Eteği', 'Döner tekmelerde bir çiçek gibi açılan, saray gösterilerinin yıldızı katlı etek.'],
        ['Altın Sırmalı Kadife Saray Pantolonu', 'Kraliyet süvarilerinin zarafetini taşıyan, dizleri altın işlemeli bordo pantolon.'],
        ['Balo Salonu Saten Şalvarı', 'Adım attıkça hışırdayan, saf gümüş düğmelerle paçası toplanan fildişi şalvar.'],
        ['Düşes Zarafeti Yırtmaçlı Uzun Etek', 'Sağ bacağı tamamen açıkta bırakan derin yırtmaçlı gece mavisi ipek etek.'],
        ['Prens Muhafızı Dar Düello Pantolonu', 'Bacak hatlarını mükemmel sergileyen, elastik saray kumaşından pantolon.'],
        ['Lal Taşı İşlemeli Kadife Etekçik', 'Kemerinde yakut ve lal taşları dizili, dövüşe ihtişam katan mini dövüş eteği.'],
        ['Saray Şampiyonu Brokar Pantolonu', 'Altın ipliklerle dövüş destanları nakşedilmiş ağırbaşlı asilzade altlığı.'],
        ['Safir Damlalı Saten Dövüş Eteği', 'Uçuşan tüllerinin ucunda küçük safir boncuklar sallanan zarif etek.'],
        ['Kraliyet Balerin Pantolonu', 'Denge hareketlerinde sıfır sürtünme sağlayan son derece esnek ipek tayt.'],
        ['Monark Zarafeti Bordo Şalvarı', 'Sarayın en usta terzilerince dikilmiş, samur biyeli gösterişli şalvar.'],
        ['Asilzade Kısa Peştamalı', 'Belinde altın toka taşıyan, saf ipekten dokunma saray güreş peştamalı.'],
        ['Pırlanta Şeritli Dantel Etek', 'Işık altında parıldayan, seyircilerin nefesini kesen lüks gösteri eteği.'],
        ['İmparatorluk Seremonisi Pantolonu', 'Yalnızca şampiyon gladyatörlere layık görülen paha biçilmez saray giysisi.']
    ]
    royalBottoms.forEach(([name, desc], i) => {
        const lvl = 8 + (i * 2)
        const gold = 320 + (i * 130)
        list.push(
            new Equipment({
                id: `eq_aes_bot_royal_${i + 1}`,
                name: name,
                slot: EquipmentSlot.PANTS,
                rarity: i > 8 ? ItemRarity.KADIM : ItemRarity.NADIDE,
                stats: new Stats({armor: 6 + (kt.idiv(i, 3)), speed: 5 + (kt.idiv(i, 3)), dodgeChancePercent: 5 + (kt.idiv(i, 3)), maxHealth: 40 + (i * 10)}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.PANTS,
                specialTrait: new EquipmentSpecialTrait({id: `trait_bot_roy_${i}`, name: 'Saray Süzülüşü', description: 'Zarif adımlarla rakibin vuruş açısından sıyrılmayı sağlar.', icon: '✨'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Egzotik Güney & Çöl İpeği (12 Adet)
    const southernBottoms = [
        ['Uçuşan Harem Şalvarı', 'Bilekleri altın halkalarla sıkılmış, rüzgar gibi esnek ve şeffaf güney şalvarı.'],
        ['Çöl Dansçısı Yırtmaçlı İpek Eteği', 'Belinde altın sikkeler sallanan, her tekmeyle etrafa şıkırtı saçan etek.'],
        ['Vaha Melikesi Çift Kat Tül Etek', 'Ten rengini hafifçe hissettiren, iki katmanlı pembe çöl şifonu.'],
        ['Kobra Dansı Deri Şalvarı', 'Kobra pulu desenli esnek güney kumaşından dikilmiş yırtıcı altlık.'],
        ['Güneş Tanrısı İpek Peştamalı', 'Kumlu çöl zemininde güreş tutan şampiyonların parlak sarı peştamalı.'],
        ['Mürver Ağacı Keten Şalvarı', 'Hafifliğiyle adeta yokmuş hissi veren, terletmeyen serin çöl pantolonu.'],
        ['Zümrüt Körfezi Dövüş Eteği', 'Deniz yeşili ipekten dikilmiş, diz üstünde biten çevik güney eteği.'],
        ['Gölge Kervanı İpek Pantolonu', 'Gece serinliğinde bacak kaslarını sıcak tutan koyu renkli güney giysisi.'],
        ['Nilüfer Desenli Harem Etek-Şortu', 'Vaha bahçelerindeki nilüferlerle bezeli cüretkar ve zarif parça.'],
        ['Akrep Kumu Dövüş Şalvarı', 'Paçaları kum kaçırmayan özel katlamalı, sert esintilere dayanıklı şalvar.'],
        ['Altın Parıltılı Çöl Eteği', 'Güneş vurduğunda altın tozu gibi ışıldayan muazzam çöl şaheseri.'],
        ['Körfez İncisi İpek Dövüş Şalvarı', 'Doğal incilerle paçaları süslenmiş, güney krallarının gözdesi alt giysi.']
    ]
    southernBottoms.forEach(([name, desc], i) => {
        const lvl = 6 + (i * 2)
        const gold = 190 + (i * 75)
        list.push(
            new Equipment({
                id: `eq_aes_bot_south_${i + 1}`,
                name: name,
                slot: EquipmentSlot.PANTS,
                rarity: i > 7 ? ItemRarity.NADIDE : ItemRarity.USTAISI,
                stats: new Stats({armor: 5 + (kt.idiv(i, 3)), speed: 6 + (kt.idiv(i, 3)), dodgeChancePercent: 5 + (kt.idiv(i, 3)), critChancePercent: 2 + (kt.idiv(i, 4))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.PANTS,
                specialTrait: new EquipmentSpecialTrait({id: `trait_bot_sth_${i}`, name: 'Çöl Rüzgarı', description: 'Bacakların havada dönerek yaptığı darbeleri hızlandırır.', icon: '🌪️'}),
                isAestheticUnarmed: true
            })
        )
    });

    return list;
}

// =========================================================================
// 4. AYAKKABI, ÇİZME & DÖVÜŞ PABUÇLARI (50 ADET)
// =========================================================================
function createAestheticFootwear() {
    const list = []

    // Sokak & Pespaye (12 Adet)
    const streetShoes = [
        ['Tabanı Delik Keten Çarık', 'Zemini doğrudan hissettiren, kumda kaymayı engelleyen kaba sokak çarığı.'],
        ['Kaba İp Sarmalı Ayak Sargısı', 'Bileği burkulmalardan koruyan, ayak parmaklarını açık bırakan kınap sargı.'],
        ['Yamalı Deri Dövüş Pabuçları', 'Eski kösele parçalarının kaba telle tutturulmasıyla yapılmış sokak pabucu.'],
        ['Bataklık Yalınayak Tozluğu', 'Yalnızca topuk ve bileği saran, tabanı çıplak bırakan güreş tozluğu.'],
        ['Liman Hamalı Tahta Takunyası', 'Islak zeminlerde denge sağlayan, sert tekme darbelerine güç katan takunya.'],
        ['Serseri Kabadayı Çarığı', 'Burnu hafifçe kıvrık, kaba dikişli sağlam sokak çarığı.'],
        ['Kendir Örgülü Ayak Bağı', 'Parmak aralarından geçerek tabana yapışan basit ama etkili sürtünme bağı.'],
        ['Çamurlu Boksör Patikleri', 'Kum çukurunda onlarca dövüş görmüş, aşınmış yumuşak deri patik.'],
        ['Paslı Zımbalı Ayak Köselesi', 'Tabanında kum tutucu minik zımbalar olan kaçak dövüşçü pabucu.'],
        ['Yırtık Keçe Çorap-Patik', 'Kışın kumun soğuğunu kesen, yumuşak adımlar sunan keçe patik.'],
        ['Düğümlü Halat Sandaleti', 'Kadırga halatlarının liflerinden örülmüş aşınmaz sokak sandaleti.'],
        ['Çıplak Ayak Bilek Sargısı', 'Tekmelerde bilek dönmesini engelleyen sıkı pamuklu bilek manşeti.']
    ]
    streetShoes.forEach(([name, desc], i) => {
        const lvl = 1 + (i * 2)
        const gold = 20 + (i * 12)
        list.push(
            new Equipment({
                id: `eq_aes_foot_street_${i + 1}`,
                name: name,
                slot: EquipmentSlot.BOOTS,
                rarity: i > 8 ? ItemRarity.USTAISI : ItemRarity.SIRADAN,
                stats: new Stats({armor: 1 + (kt.idiv(i, 4)), speed: 2 + (kt.idiv(i, 3)), dodgeChancePercent: 3 + (kt.idiv(i, 4))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.BOOTS,
                specialTrait: new EquipmentSpecialTrait({id: `trait_foot_str_${i}`, name: 'Kum Tutuşu', description: 'Zeminde kaymayı önleyerek dengeyi sabitler.', icon: '🦶'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Korsan & Çapulcu (13 Adet)
    const pirateShoes = [
        ['Geniş Yakalı Korsan Süvari Çizmesi', 'Üst kısmı diz altına kıvrılan, yumuşak geyik derisinden fiyakalı korsan çizmesi.'],
        ['Püsküllü Yağmacı Botları', 'Bağcıklarından pirinç süsler sarkan, güvertede çevik adımlar sağlayan bot.'],
        ['Tuzlu Su Kösele Sandaleti', 'Deniz suyuna dayanıklı, kaygan güvertede mükemmel tutuş sunan sandalet.'],
        ['Pirinç Tokalı Güverte Pabuçları', 'Üzerinde parlak korsan tokaları bulunan, yumuşak tabanlı dövüş pabucu.'],
        ['Kızıl Deri Korsan Çizmesi', 'Kan kırmızısı boyayla renklendirilmiş, fiyakalı düellocu çizmesi.'],
        ['Mercan Kayalığı Dövüş Botu', 'Tabanı kayalık zeminlerde bile mükemmel kavrayan özel desenli çizme.'],
        ['Fırtına Süvarisi İnce Çizmesi', 'Su çekmeyen, bacağı eldiven gibi saran esnek denizci çizmesi.'],
        ['Korsan Kraliçesi Bağcıklı Çizmeleri', 'Diz kapağına kadar ince bağcıklarla sarılan, estetik ve ölümcül çizme.'],
        ['Barut Kokulu Kısa Botlar', 'Bileği tam saran, hızlı tekmelerde bilek burkulmasını önleyen bot.'],
        ['Kalyon Kaptanı Yaldızlı Çizmesi', 'Kenarları altın yaldız işlemeli, salon düellolarına da uygun korsan çizmesi.'],
        ['Karayip Dalgası Deri Sandaleti', 'Parmakları açıkta bırakan, akrobatik sıçrayışlara uygun hafif sandalet.'],
        ['Yağmacı Lordun Süet Çizmesi', 'İçi kürk astarlı, yumuşak adımlarla yaklaşmayı sağlayan süet çizme.'],
        ['Gümüş Mahmuzlu Korsan Çizmesi', 'Mahmuzu köreltilmiş, estetik şıkırtısıyla hasmın dikkatini dağıtan çizme.']
    ]
    pirateShoes.forEach(([name, desc], i) => {
        const lvl = 4 + (i * 2)
        const gold = 75 + (i * 30)
        list.push(
            new Equipment({
                id: `eq_aes_foot_pirate_${i + 1}`,
                name: name,
                slot: EquipmentSlot.BOOTS,
                rarity: i > 9 ? ItemRarity.NADIDE : ItemRarity.USTAISI,
                stats: new Stats({armor: 3 + (kt.idiv(i, 3)), speed: 4 + (kt.idiv(i, 3)), dodgeChancePercent: 4 + (kt.idiv(i, 3))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.BOOTS,
                specialTrait: new EquipmentSpecialTrait({id: `trait_foot_pir_${i}`, name: 'Güverte Çevikliği', description: 'Sıçrayış ve kaçınma hızını artırır.', icon: '⛵'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Fiyakalı / Sosyetik Kraliyet (13 Adet)
    const royalShoes = [
        ['İpek Çoraplı Saten Dans Pabuçları', 'Balo salonlarında dövüş gösterisi yapan asilzadelerin tüy kadar hafif pabuçları.'],
        ['Altın Tokalı Bordo Kadife Çizme', 'Kraliyet süvarilerine layık, yumuşak kadifeden dikilmiş göz alıcı çizme.'],
        ['Düşes Zarafeti Dantel Bağcıklı Bot', 'İncecik ipek bağcıklarla bileğe oturan, kusursuz estetik çizgili bot.'],
        ['Safir Kakmalı Süet Salon Pabucu', 'Burnunda safir taş parıldayan, narin tekmelerde zarafet katan pabuç.'],
        ['Prens Muhafızı Parlak Deri Çizmesi', 'Ayna gibi parlatılmış, tekme darbelerinde bilek esnekliği sunan saray çizmesi.'],
        ['Balerin Zarafeti İpek Dövüş Patiği', 'Ayak parmak uçlarında dönerek manevra yapmaya imkan veren özel patik.'],
        ['Zümrüt Yeşili Kadife Süvari Çizmesi', 'Kenarları altın sırmalarla çevrili, soyluların özel siparişi şık çizme.'],
        ['Kraliyet Şampiyonu Altın Çizmesi', 'Altın yaprak kaplama deriden yapılmış, arenayı aydınlatan gösterişli çizme.'],
        ['Pırlanta İşlemeli Saten Sandalet', 'Bileğe dolanan saten kurdeleleri minik elmaslarla süslü aristokrat sandaleti.'],
        ['Monark Zarafeti Bordo Dans Botu', 'Adım attıkça zemin taşlarında sessizce süzülen kusursuz saray botu.'],
        ['Asilzade Kürklü Kışlık Dövüş Çizmesi', 'Samur kürküyle kenarları kaplı, konfor ve şıklığın zirvesi çizme.'],
        ['Güneş Haleli İpek Pabuç', 'Tabanı gümüş ipliklerle desteklenmiş, hafiflikte sınır tanımayan salon pabucu.'],
        ['İmparatoriçe Adımı Kristal Sandalet', 'Doğal kuvars taşlarıyla süslenmiş, dövüşe estetik büyü katan şaheser.']
    ]
    royalShoes.forEach(([name, desc], i) => {
        const lvl = 8 + (i * 2)
        const gold = 280 + (i * 110)
        list.push(
            new Equipment({
                id: `eq_aes_foot_royal_${i + 1}`,
                name: name,
                slot: EquipmentSlot.BOOTS,
                rarity: i > 8 ? ItemRarity.KADIM : ItemRarity.NADIDE,
                stats: new Stats({armor: 4 + (kt.idiv(i, 3)), speed: 5 + (kt.idiv(i, 3)), dodgeChancePercent: 5 + (kt.idiv(i, 3)), maxHealth: 30 + (i * 8)}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.BOOTS,
                specialTrait: new EquipmentSpecialTrait({id: `trait_foot_roy_${i}`, name: 'Sessiz Adımlar', description: 'Rakibin ayak seslerini duymasını engeller.', icon: '🩰'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Egzotik Güney & Çöl İpeği (12 Adet)
    const southernShoes = [
        ['Deve Derisi Zarif Çöl Sandaleti', 'Kızgın kumlara basarken ayak tabanını serin tutan dayanıklı deve derisi sandalet.'],
        ['Altın Halhallı İpek Dans Sandaleti', 'Bileğinde minik altın çıngıraklar taşıyan, her adımda müzik yaratan güney sandaleti.'],
        ['Vaha Ceylanı Deri Patikleri', 'Ceylan derisinin benzersiz esnekliğiyle dikilmiş, ayağı ikinci bir ten gibi saran patik.'],
        ['Kobra Pulu Çöl Çizmesi', 'Bilekten dize kadar kobra derisiyle sarılan, kaymayı önleyen vahşi çizme.'],
        ['Kum Dansçısı Parmak Arası İpeği', 'Yalnızca ipek kurdelelerle ayağa bağlanan, sıfır ağırlıklı güney örtüsü.'],
        ['Mürver Ağacı Tabanlı Sandalet', 'Hafif ağaç tabanıyla zeminden gelen darbeleri yastıklayan çöl sandaleti.'],
        ['Yakut Tokalı Şafak Çizmesi', 'Güneş doğarken kumların rengine bürünen, yakut tokalı güney süet çizmesi.'],
        ['Gölge Kervanı Sessiz Çöl Botu', 'Çöl gecelerinde kumları fısıltı gibi ezen süngerimsi tabanlı bot.'],
        ['Nilüfer Çiçeği İpek Çarığı', 'Açık yeşil ipekten dikilmiş, vaha saraylarının gözdesi zarif çarık.'],
        ['Akrep İğnesi Süet Sandaleti', 'Burun kısmı sertleştirilmiş, tekme isabetlerinde ekstra sertlik sağlayan sandalet.'],
        ['Altın Varaklı Çöl Dans Pabucu', 'Güneş tanrısına adanan dövüş ayinlerinde giyilen parlak altın rengi pabuç.'],
        ['Körfez İncisi İpek Bileklikli Patik', 'Bileğine doğal inciler dizilmiş, güney saraylarının en narin dövüş patiği.']
    ]
    southernShoes.forEach(([name, desc], i) => {
        const lvl = 6 + (i * 2)
        const gold = 160 + (i * 65)
        list.push(
            new Equipment({
                id: `eq_aes_foot_south_${i + 1}`,
                name: name,
                slot: EquipmentSlot.BOOTS,
                rarity: i > 7 ? ItemRarity.NADIDE : ItemRarity.USTAISI,
                stats: new Stats({armor: 3 + (kt.idiv(i, 3)), speed: 6 + (kt.idiv(i, 3)), dodgeChancePercent: 5 + (kt.idiv(i, 3)), critChancePercent: 2 + (kt.idiv(i, 4))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.BOOTS,
                specialTrait: new EquipmentSpecialTrait({id: `trait_foot_sth_${i}`, name: 'Kum Dansı', description: 'Kumda batmadan akıcı adımlarla süzülmeyi sağlar.', icon: '👡'}),
                isAestheticUnarmed: true
            })
        )
    });

    return list;
}

// =========================================================================
// 5. ELDİVEN, BİLEKLİK, MANŞET & DÖVÜŞ SARGILARI (50 ADET)
// =========================================================================
function createAestheticGlovesAndBracers() {
    const list = []

    // Sokak & Pespaye (12 Adet)
    const streetGloves = [
        ['Ham Keten Dövüş Sargısı', 'Bileği ve el tarak kemiklerini sımsıkı saran, yumruk sertliğini artıran temel sargı.'],
        ['Parmaksız Aşınmış Deri Eldiven', 'Parmak uçlarını açıkta bırakarak kavrama ve eklem kilidi sağlayan sokak eldiveni.'],
        ['Reçineli İp Bileklik', 'Kaba iplerin reçineyle sertleştirilmesiyle yapılmış, bloklarda kolu koruyan bileklik.'],
        ['Bataklık Kabadayısı Boğum Sargısı', 'Parmak boğumlarına ekstra kumaş katı bindirilmiş sert sokak sargısı.'],
        ['Demir Tozlu Ham Pamuk Sargı', 'Pamuk lifleri arasına ince demir tozu yedirilmiş ezici yumruk sargısı.'],
        ['Serseri Bilek Kayışı', 'Bilek eklemini sabit tutarak şiddetli darbelerde burkulmayı önleyen kösele kayış.'],
        ['Yamalı Çapulcu Elceği', 'Avuç içini sürtünmeden koruyan, parmakları serbest bırakan deri parça.'],
        ['Dikenli Kınap Bilekliği', 'Kola sarılan, blok esnasında rakibin kolunu tırmalayan kaba kınap ipi.'],
        ['Kömürcü Çırağı Yumruk Bezi', 'İs kokulu, darbe aldıkça sertleşen kömür tozlu bez sargı.'],
        ['Zincirli Meşin Manşet', 'Bileğinde iki sıra hafif zincir taşıyan gösterişli kabadayı manşeti.'],
        ['Liman Dövüşçüsü Avuç İçi Sargısı', 'Tutuş ve çekiş hareketlerinde rakibin kumaşını sımsıkı kavrayan sargı.'],
        ['Çift Düğümlü Bilek Bağı', 'Hızlı yumruk kombinasyonlarında bileğin titreşimini sönümleyen sıkı bağ.']
    ]
    streetGloves.forEach(([name, desc], i) => {
        const lvl = 1 + (i * 2)
        const gold = 22 + (i * 14)
        list.push(
            new Equipment({
                id: `eq_aes_glove_street_${i + 1}`,
                name: name,
                slot: EquipmentSlot.GLOVES,
                rarity: i > 8 ? ItemRarity.USTAISI : ItemRarity.SIRADAN,
                stats: new Stats({damage: 3 + (kt.idiv(i, 3)), armor: 1 + (kt.idiv(i, 4)), critChancePercent: 2 + (kt.idiv(i, 4))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.GLOVES,
                specialTrait: new EquipmentSpecialTrait({id: `trait_glv_str_${i}`, name: 'Sert Yumruk', description: 'Çıplak el darbelerinin kemik kırma gücünü artırır.', icon: '🥊'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Korsan & Çapulcu (13 Adet)
    const pirateGloves = [
        ['Pirinç Tokalı Korsan Manşeti', 'Bileği boydan boya saran, üzerinde parıldayan korsan tokaları bulunan deri manşet.'],
        ['Parmaksız Süvari Deri Eldiveni', 'Yumuşak ceylan derisinden dikilmiş, kavramayı ve yumruğu güçlendiren eldiven.'],
        ['Kızıl İpek Bilek Fuları', 'Bileğe dolanan, rüzgarda uçuşarak yumrukların yönünü kamufle eden fular.'],
        ['Tuzlu Su Kösele Elceği', 'Tuzla sertleştirilmiş, blok darbelerini çelik gibi karşılayan kösele elcek.'],
        ['Mercan İşlemeli Korsan Eldiveni', 'Bilek kısmında minik mercan taşları kakılı, fiyakalı denizci eldiveni.'],
        ['Barut Dumanı Yumruk Sargısı', 'Koyu kül rengi ketenden dokunmuş, süratli vuruşlara uygun sargı.'],
        ['Korsan Kraliçesi Dantelli Deri Eldiveni', 'Deri avuç içi ve dantelli bilek kısmıyla zarafet ile sertliği buluşturan eldiven.'],
        ['Fırtına Süvarisi İnce Manşeti', 'Bileği sıkıca kavrayarak ani ters el vuruşlarında esneklik sağlayan manşet.'],
        ['Kalyon Kaptanı Yaldızlı Bilekliği', 'Altın düğmeli, beyaz kumaştan dikilmiş lüks korsan bilekliği.'],
        ['Yağmacı Lordun Süet Dövüş Eldiveni', 'İnce süet yapısıyla rakibin elbisesini yırtacak denli güçlü tutuş veren eldiven.'],
        ['Karayip Dalgası İpek Sargısı', 'Deniz mavisi saf ipekten dokunmuş, sürtünmesiz yumruk sargısı.'],
        ['Püsküllü Çapulcu Bilekliği', 'Bilekten deri püsküller sarkan, hamleleri görsel olarak zenginleştiren bileklik.'],
        ['Gümüş Kancalı Korsan Manşeti', 'Kanca tokasıyla kilitlenen, dövüşte asla açılmayan ağır deri manşet.']
    ]
    pirateGloves.forEach(([name, desc], i) => {
        const lvl = 4 + (i * 2)
        const gold = 80 + (i * 32)
        list.push(
            new Equipment({
                id: `eq_aes_glove_pirate_${i + 1}`,
                name: name,
                slot: EquipmentSlot.GLOVES,
                rarity: i > 9 ? ItemRarity.NADIDE : ItemRarity.USTAISI,
                stats: new Stats({damage: 4 + (kt.idiv(i, 3)), armor: 2 + (kt.idiv(i, 4)), speed: 3 + (kt.idiv(i, 3)), critChancePercent: 3 + (kt.idiv(i, 4))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.GLOVES,
                specialTrait: new EquipmentSpecialTrait({id: `trait_glv_pir_${i}`, name: 'Demir Pençe', description: 'Rakibin kıyafetini yırtarak tutuş gücü sağlar.', icon: '🦅'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Fiyakalı / Sosyetik Kraliyet (13 Adet)
    const royalGloves = [
        ['Zümrüt Kakmalı Dantel Düello Eldiveni', 'Dirseğe kadar uzanan beyaz danteli ve bileğindeki zümrütle büyüleyen eldiven.'],
        ['Altın Sırmalı Kadife Balo Manşeti', 'Saray soylularının el temaslı güreş gösterilerinde taktığı altın yaldızlı manşet.'],
        ['Düşes Zarafeti Parmaksız Saten Eldiven', 'Parmakları açık bırakan, sırtında damla inciler parıldayan lüks eldiven.'],
        ['Safir Damlalı Gümüş Bilek Kelepçesi', 'Bileği bir bilezik gibi saran ama dövüşte kemikleri zırh gibi koruyan safir takı.'],
        ['Prens Muhafızı Beyaz Süet Eldiveni', 'Tek bir leke dahi barındırmayan, saray şeref düellolarının resmi eldiveni.'],
        ['Balerin Zarafeti İpek Bilek Bağı', 'Bileğe sarılan kat kat pembe ipek şeritler; narin vuruşlara estetik katar.'],
        ['Bordo Kadife Altın Düğmeli Manşet', 'Kraliyet süvarilerinin zarafet simgesi olan altın işlemeli lüks manşet.'],
        ['Kraliyet Şampiyonu Altın Eldiveni', 'Altın varaklı ince deriden yapılmış, yumruk atarken ışık saçan başyapıt.'],
        ['Pırlanta Şeritli Dantel Manşet', 'Işık altında kıvılcımlar saçan, kadın dövüşçülerin asil tercihi zarafet manşeti.'],
        ['Monark Zarafeti Samur Kürklü Bileklik', 'Bilek kısmında yumuşacık samur kürkü bulunan gösterişli kraliyet parçası.'],
        ['Asilzade İpek Sargı Seti', 'Kokulu güney yağlarıyla yıkanmış, teni asla tahriş etmeyen safir renkli ipek sargı.'],
        ['Lal Taşı İşlemeli Süet Eldiven', 'Boğumlarında kırmızı yakutlar parıldayan büyüleyici gösteri eldiveni.'],
        ['İmparatoriçe Kudreti Kristal Manşet', 'Saf kristal parçacıklarıyla süslenmiş, paha biçilmez saray hazinesi.']
    ]
    royalGloves.forEach(([name, desc], i) => {
        const lvl = 8 + (i * 2)
        const gold = 300 + (i * 120)
        list.push(
            new Equipment({
                id: `eq_aes_glove_royal_${i + 1}`,
                name: name,
                slot: EquipmentSlot.GLOVES,
                rarity: i > 8 ? ItemRarity.KADIM : ItemRarity.NADIDE,
                stats: new Stats({damage: 5 + (kt.idiv(i, 3)), armor: 3 + (kt.idiv(i, 4)), speed: 4 + (kt.idiv(i, 3)), critChancePercent: 4 + (kt.idiv(i, 3))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.GLOVES,
                specialTrait: new EquipmentSpecialTrait({id: `trait_glv_roy_${i}`, name: 'Asil Dokunuş', description: 'Hassas eklem noktalarına yapılan vuruşların etkisini artırır.', icon: '✨'}),
                isAestheticUnarmed: true
            })
        )
    });

    // Egzotik Güney & Çöl İpeği (12 Adet)
    const southernGloves = [
        ['Yılan Derisi Sarmal Bileklik', 'Bileğe dolanan canlı bir yılanı andıran, kaygan ve esnek güney bilekliği.'],
        ['Altın Pullu Çöl Dansçısı Sargısı', 'Her yumrukta ve el hareketinde şıkırdayan altın pullu oryantal sargı.'],
        ['Vaha Melikesi Şeffaf Tül Eldiveni', 'Parmakları ve kolları dirseğe kadar saran, tül gibi incecik güney eldiveni.'],
        ['Kobra Dişi Kemik Bileklik', 'Bilek eklemini sertleştiren cilalı kobra kemiklerinden örülü mistik takı.'],
        ['Kum Dansçısı İpek Parmak Sargısı', 'Yalnızca parmak eklemlerini saran, kavrama kuvvetini iki katına çıkaran ipek.'],
        ['Mürver Reçinesi Dövüş Sargısı', 'Reçineyle sertleştirilmiş yeşil ipek; vuruşlarda kemikleri sarsmaz.'],
        ['Yakut Gözlü Altın Kobra Manşeti', 'Gözlerinde yakut parıldayan kobra başlı altın kaplama dövüş manşeti.'],
        ['Gölge Kervanı Parmaksız Çöl Eldiveni', 'Gece dövüşlerinde soğuyan parmakları sıcak tutan ince deve tiftiği.'],
        ['Nilüfer Çiçeği İpek Bilekliği', 'Bileğe bağlanan açık yeşil ipek kurdele; terlemeyi önler ve zarafet katar.'],
        ['Akrep Kıskaçlı Deri Manşet', 'Avuç içini kavrayarak rakibin yakasını sımsıkı tutmayı sağlayan hırçın manşet.'],
        ['Altın Varaklı Güneş Dansçısı Sargısı', 'Güneş tanrısı ayinlerinde kullanılan, parıltısıyla rakibin gözünü alan sargı.'],
        ['Körfez İncisi İpek Dövüş Eldiveni', 'Doğal incilerle süslenmiş, yumuşak temaslarda bile derin basınç kuran şaheser.']
    ]
    southernGloves.forEach(([name, desc], i) => {
        const lvl = 6 + (i * 2)
        const gold = 170 + (i * 70)
        list.push(
            new Equipment({
                id: `eq_aes_glove_south_${i + 1}`,
                name: name,
                slot: EquipmentSlot.GLOVES,
                rarity: i > 7 ? ItemRarity.NADIDE : ItemRarity.USTAISI,
                stats: new Stats({damage: 5 + (kt.idiv(i, 3)), armor: 2 + (kt.idiv(i, 4)), speed: 5 + (kt.idiv(i, 3)), critChancePercent: 3 + (kt.idiv(i, 4))}),
                requiredLevel: lvl,
                valueInGold: gold,
                description: desc,
                armorCategory: ArmorCategory.GLOVES,
                specialTrait: new EquipmentSpecialTrait({id: `trait_glv_sth_${i}`, name: 'Yılan Kıvraklığı', description: 'Kilit ve kavrama hamlelerinde rakibin gardını aşar.', icon: '🐍'}),
                isAestheticUnarmed: true
            })
        )
    });

    return list;
}

/**
 * Zarafet Atölyesi'nin tüm 250 parçasını birleştiren ana katalog.
 */
function getAllAestheticEquipment() {
    return [
        ...createAestheticHeadwear(),
        ...createAestheticTops(),
        ...createAestheticBottoms(),
        ...createAestheticFootwear(),
        ...createAestheticGlovesAndBracers(),
    ];
}

export const AestheticAtelierEquipmentData = {
  createAestheticHeadwear,
  createAestheticTops,
  createAestheticBottoms,
  createAestheticFootwear,
  createAestheticGlovesAndBracers,
  getAllAestheticEquipment,
};
