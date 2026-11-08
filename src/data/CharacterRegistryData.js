import * as kt from '../kt.js';
import { CharacterCategory, CharacterProfile } from '../domain/model.js';
import { TashisarGladiatorsData } from './TashisarGladiatorsData.js';

export const CharacterRegistryData = {
  getAllProfiles() {
    return [...[
      // ==========================================
      // ARENA GLADYATÖRLERİ (11 SAVAŞÇI)
      // ==========================================
      new CharacterProfile({
        id: 'fighter_morvath',
        name: 'Morvath',
        title: 'Isırgan Otu • Lig Şampiyonu',
        category: CharacterCategory.GLADIATOR,
        avatarIcon: '',
        roleOrWeapon: 'Üç Ağızlı Çatal Kargı',
        appearance: 'İki metreye yaklaşan heybetli boyu, kurşun grisi dağınık saçları ve rakibini bir böcek gibi süzen soğuk kehribar rengi gözleri vardır. Sol omzundan başlayıp göğsüne doğru uzanan derin bir süvari mızrağı izi taşır. Gövdesinde dövme çelikten perçinlenmiş koyu lacivert garnizon levha zırhı bulunur. Elinde hiç bırakmadığı, orta ekleminde kurşun ağırlık gizli üç dilli çatal kargısıyla arenanın kumlarında bir heykel gibi dikilir.',
        backgroundLore: "Morvath, bir zamanlar başkentin en seçkin mızraklı süvari alayında kıdemli teğmen rütbesiyle görev yapıyordu. Ancak saray entrikaları ve rüşvetçi bir kumandanın emirlerine karşı çıkması, askeri mahkemede rütbelerinin sökülmesine ve sınır boyunun en karanlık köşesi olan Kırlangıç Kasabası'na sürülmesine yol açtı.\n\nSürgün kafilesinden çamura itildiğinde etrafındaki sokak dövüşçülerine ve çapulculara tiksintiyle bakmıştı. Lakin çukur arenasında döktüğü ilk kandan sonra, binlerce boğazdan yükselen vahşi kükremenin saray salonlarındaki riyakar iltifatlardan çok daha sarhoş edici olduğunu anladı. On dört haftadır Kırlangıç liginin zirvesinde, namağlup bir hükümdar gibi oturmaktadır.\n\nDövüş tarzı buz gibi bir disiplin ve mesafeye dayanır; hasmını kargısının menziliyle çaresiz bırakıp adım adım kanatarak bitirmeyi sever. Ne var ki eski süvari yarasının bıraktığı doku hasarı, kargıyı savurduktan sonraki toparlanma anlarında sağ kaburga altında saniyelik bir kör nokta yaratır.",
        isGladiator: true,
        enemyId: 'fighter_morvath',
        locationOrDuty: 'Kırlangıç Çukur Arenası (1. Sıra)'
      }),
      new CharacterProfile({
        id: 'fighter_thyra',
        name: 'Thyra',
        title: 'Kemik Yaran',
        category: CharacterCategory.GLADIATOR,
        avatarIcon: '',
        roleOrWeapon: 'Çift Ağızlı Çelik Nacak',
        appearance: 'Güneşte parıldayan örgülü kızıl saçları, rüzgar yanığı sert çehresi ve şahin gibi odaklanan yırtıcı yeşil gözleri vardır. Omuzlarında dondurucu kuzey dağlarından kalma bir kutup kurdu postu asılıdır; çıplak kollarında ise kabile geleneklerine göre kemik iğnelerle kazınmış kan kırmızısı totem dövmeleri dikkat çeker. İki elinde tuttuğu, keskinliği bir ustura kadar bilenmiş çift ağızlı nacağı adeta bedeninin bir uzantısı gibidir.',
        backgroundLore: "Kuzeyin sarp doruklarında fırtınalarla boğuşan Kar Kurdu kabilesinin en cüretkar savaşçısıydı. Klanlar arasındaki kanlı bir yayla savaşında kabilesi dağıtılıp ailesi katledilince, yaralı halde güneye sığınmış fakat sınır tüccarlarının kurduğu tuzağa düşerek köle zincirine vurulmuştur.\n\nKırlangıç Kasabası'na getirildiği ilk gün hücresinin parmaklıklarını dişleriyle sökmeye çalışmış, arenaya çıkarıldığı ilk karşılaşmada ise rakibinin demir kalkanını iki darbede ortadan ikiye bölmüştür. Thyra için arena alkış toplanacak bir tiyatro değil, atalarının ruhuna her gün sunulan kanlı ve kutsal bir intikam meydanıdır.\n\nHer şafakta kasaba uyanmadan önce ağır granit blokları kaldırarak güç depolar ve nacağını bileme taşına yatırır. Hamleleri bir çığ gibi yıkıcıdır; lakin hücum anında gözünü bürüyen kör öfke, arkasına çevikçe dolanan usta bir silahşöre karşı sırtını korumasız bırakır.",
        isGladiator: true,
        enemyId: 'fighter_thyra',
        locationOrDuty: 'Kırlangıç Çukur Arenası (Ön Sıralar)'
      }),
      new CharacterProfile({
        id: 'fighter_ghorak',
        name: 'Ghorak',
        title: 'Zincirli Hortlak',
        category: CharacterCategory.GLADIATOR,
        avatarIcon: '',
        roleOrWeapon: 'Dikenli Pranga & Zincir Topuz',
        appearance: 'Güneş görmemiş forsa zindanlarından kalma kül rengi solgun teni, nasır bağlamış devasa omuzları ve ifadesiz, donuk gri gözleriyle yürüyen bir kadavrayı andırır. Sağ bileğinde, etine kaynamış kalın bir pranga halkası ve bu halkadan sarkan on beş kiloluk dikenli demir gülle zinciri bulunur. Göğsünde sayısız kırbaç yarası ve paslı çelik perçinler vardır.',
        backgroundLore: 'Kraliyet kadırgalarının rutubetli ambarlarında yirmi kış boyunca kırbaç altında kürek çekmiş eski bir kürek mahkumudur. Hizmet ettiği savaş gemisi fırtınalı bir gecede kayalıklara bindirip parçalandığında, dipteki forsalardan yalnızca Ghorak zincirlerini koparıp sahile sürünmeyi başarmıştır.\n\nBileğindeki prangayı bir utanç değil, kendisine acıyı unutturan bir silah olarak benimsemiştir. Kasaba demircisine uzattığı zincirin ucuna ağır, dikenli bir gülle kaynattırarak arenaya adım atmış; ona gülen ilk dövüşçünün miğferini tek savuruşta un ufak etmiştir.\n\nGhorak acıya neredeyse tamamen duyarsızdır; vücuduna inen kılıç darbelerini bir sıyrık gibi karşılar. Ancak savurduğu gülleyi geri çekebilmek için vücudunun tüm ağırlığını tek bacağına bindirmesi, boşa çıkan vuruşlardan sonra toparlanmasını güçleştirir.',
        isGladiator: true,
        enemyId: 'fighter_ghorak',
        locationOrDuty: 'Kırlangıç Çukur Arenası'
      }),
      new CharacterProfile({
        id: 'fighter_bregash',
        name: 'Bregash',
        title: 'Ters Pala',
        category: CharacterCategory.GLADIATOR,
        avatarIcon: '',
        roleOrWeapon: 'Ağır Ters Kasap Palası',
        appearance: 'Kaba saba yüz hatları, sol gözünü boydan boya kapatan beyaz bir körlük lekesi ve dişlerinin arasında gevelediği pis kokulu bataklık tütünüyle ürkütücü bir simadır. Üzerinde kurumuş kan lekeleriyle sertleşmiş kalın bir kasap önlüğü ve parmakları kesik meşin eldivenler taşır. Elindeki kavisli ağır palayı kılıç ustalarının aksine ters tutar; keskin ağız daima yukarı bakar.',
        backgroundLore: "Kırlangıç'ın sazlık bataklıklarında kurulan kaçak mezbahalarda yüzlerce boğayı ve domuz karkasını parçalayarak büyümüştür. Bir kumar gecesi tartıştığı iki kasap kalfasını tek bir satır hamlesiyle yere serince kasaba muhafızlarınca zincirlenmiş, ölüm cezasından ancak arenanın kumlarında dövüşmeyi kabul ederek kurtulmuştur.\n\nBregash için arenadaki bir insan vücudu ile mezbahadaki bir öküz karkası arasında hiçbir fark yoktur. İnsan anatomisini kasaplık tecrübesiyle ezbere bilir; palasını dipten yukarıya ters bir kavisle savurarak rakibin diz ardı kirişlerini ve zırh bağlantılarını biçer.\n\nVahşidir, kan gördükçe kıkırdayan dengesiz bir mizaca sahiptir. Ancak ters pala stili yukarıdan inen sert mızrak saplamalarına ve yüksek kalkan bloklarına karşı yetersiz kalır.",
        isGladiator: true,
        enemyId: 'fighter_bregash',
        locationOrDuty: 'Kırlangıç Çukur Arenası'
      }),
      new CharacterProfile({
        id: 'fighter_kaelen',
        name: 'Kaelen',
        title: 'Kör Arbaletçi',
        category: CharacterCategory.GLADIATOR,
        avatarIcon: '',
        roleOrWeapon: 'Mekanik Kundaklı Arbalet',
        appearance: 'Gözlerinin üzerinde kösele meşinden dikilmiş simsiyah bir bağ taşır. İnce yapılı, esnek gövdesi ve kedi gibi sessiz adımları vardır. Sırtında pirinç dişlilerle donatılmış özel bir kundak yayı, kemerinde ise dengelenmiş çelik temren okları bulunur. Başı daima hafifçe yana eğiktir; rüzgarın, ayak seslerinin ve kılıç kınından çıkan madeni tınıların en ufağını bile süzer.',
        backgroundLore: 'Kraliyet korularında kaçak geyik avlayan efsanevi bir orman avcısıyken yakalanmış, ceza olarak gözlerine sönmemiş kireç sürülerek kör edilmiştir. Zifiri karanlığa gömüldüğünde ölmek yerine, aylar boyunca sessizliği dinleyerek işitme duyusunu doğaüstü bir seviyeye taşımıştır.\n\nDemirci tezgâhlarında kendi elleriyle pirinç dişlili özel bir mekanik kundak yayı monte etmiş, telin gerilim sesini bir müzik aleti gibi akort etmiştir. Arenada kumların üzerindeki hışırtıyı dinleyerek gözleri bağlı halde hasmının kalp hizasına milimetrik oklar gönderir.\n\nSoğukkanlı, sessiz ve hesapçıdır. Hasmıyla arasında en az yirmi adım mesafe olduğu sürece ölümcüldür; ancak kalkan arkasında kapanıp aradaki mesafeyi yıldırım hızıyla kapatan dövüşçülere karşı kundak yayını kuracak zaman bulamaz.',
        isGladiator: true,
        enemyId: 'fighter_kaelen',
        locationOrDuty: 'Kırlangıç Çukur Arenası'
      }),
      new CharacterProfile({
        id: 'fighter_xylar',
        name: 'Xylar',
        title: 'Demir Diş',
        category: CharacterCategory.GLADIATOR,
        avatarIcon: '',
        roleOrWeapon: 'Çivili Ahşap Tokmak',
        appearance: 'Fıçı gibi geniş bir gövde, kat kat olmuş kalın boyun kasları ve sokak dövüşlerinde dökülen dişlerinin yerine çenesine çaktırdığı dövme demir perçinlerle donatılmış şeytani bir sırıtışa sahiptir. Üzerinde ayı postu yelek, elinde ise kalın meşe kütüğüne dövme çiviler çakılarak yapılmış devasa bir sokak tokmağı vardır.',
        backgroundLore: "Kasaba limanındaki yük ambarlarında tahıl ve tuz çuvalları taşıyarak gücünü kazanmış, meyhane önlerindeki kaçak yumruk dövüşlerinde yenilmezlik unvanı alarak çukur arenasına geçmiştir. Dövüşlerde kırılan ön dişlerinin yerine kasaba demircisine demir çiviler perçinletmesiyle kasabada bir şehir efsanesine dönüşmüştür.\n\nArenayı bir meslek, hatta altın kazanıp sarhoş olacağı bir panayır gibi görür. Dövüş bittiği gibi soluğu İsli Kandil Hanı'nda alır, kazandığı tüm keseyi barbut zarlarına ve ekşi arpa biralarına saçar. Sabahları arenaya esneyerek ve mahmurlukla çıksa da indirdiği tek bir tokmak darbesi boğa kafatası kıracak kudrettedir.\n\nHantal ve tembeldir. Savunmasını tamamen kalın etine ve tokmak bloğuna güvenir; seri adımlarla etrafında fır dönen ve soluğunu tüketen kıvrak dövüşçüler karşısında çabuk yorulur.",
        isGladiator: true,
        enemyId: 'fighter_xylar',
        locationOrDuty: 'Kırlangıç Çukur Arenası'
      }),
      new CharacterProfile({
        id: 'fighter_vaelen',
        name: 'Vaelen',
        title: 'Kör Akbaba',
        category: CharacterCategory.GLADIATOR,
        avatarIcon: '',
        roleOrWeapon: 'Gölge Kancası & Çengeller',
        appearance: 'İnce uzun, akbabayı andıran kamburca bir duruşu, kukuletasının altından parlayan sinsi fare gözleri ve kuru kemikli parmakları vardır. Belinde iki ucu çengelli sivri kancalar asılıdır. Ayaklarına sazlık çamurunda kaymayan yumuşak tabanlı deriler sarar; kumun üzerinde adeta ağırlıksız bir hayalet gibi süzülür.',
        backgroundLore: 'Sınır kasabasının köhne arka sokaklarında hırsızlar loncasının en kurnaz yankesicisi ve zehir kuryesi olarak nam salmıştı. Kasaba yargıcının konağını soymaya kalkıştığında suçüstü yakalanmış, asılmaktan kurtulmak için arenada dövüşmeyi kabul etmiştir.\n\nArenaya çıktığında tribünlerin dövüş naralarına ve sabırsız ıslıklarına zerre kadar kulak asmaz. Rakibinin etrafında geniş çemberler çizerek saatlerce dönüp onu yorar, sinirlerini bozar ve hasmı bir anlık öfkeyle bocaladığı saniyede gölge kancasını boğazına takar.\n\nKaranlık bahis simsarlarıyla gizli ilişkileri olan sinsi bir fırsatçıdır. Cesareti düşüktür; eğer karşısındaki savaşçı onun oyununa gelmeyip hiç duraksamadan sert bir taarruzla üzerine yürürse panikler ve dengesini kaybeder.',
        isGladiator: true,
        enemyId: 'fighter_vaelen',
        locationOrDuty: 'Kırlangıç Çukur Arenası'
      }),
      new CharacterProfile({
        id: 'fighter_khorvash',
        name: 'Khorvash',
        title: 'Tuz Gözlü',
        category: CharacterCategory.GLADIATOR,
        avatarIcon: '',
        roleOrWeapon: 'Kör İğneli Balık Oltası & Çengeller',
        appearance: "Güneydoğudaki sonsuz Tuz Çölü'nden gelmiş, kavruk tenli ve kuruluktan çatlamış dudaklı yaşlıca bir savaşçıdır. Gözleri katarakt benzeri süt beyazı bir perdeyle örtülüdür ve neredeyse hiç görmez. Üzerinde tuzlu bez paçavraları, elinde ise ucu sivriltilmiş kalın kurşun iğneli ağır bir balık oltası taşır.",
        backgroundLore: "Tuz Çölü'nün kurak kanyonlarında yaşayan göçebe bir derviş kabilesinin son üyesidir. Çöl fırtınalarının tuzu gözlerini köreltmiş, fakat ona kumların altındaki en ufak böcek kıpırtısını ve rüzgarın taşıdığı nemi hissetme kabiliyeti kazandırmıştır.\n\nKırlangıç Kasabası'na nasıl geldiğini kimse bilmez; bir sabah köle pazarının kenarında bağdaş kurmuş otururken bulunmuş ve arenaya sürülmüştür. Kumun üzerindeki titreşimleri çıplak ayak tabanlarıyla süzer. Oltasını savurarak hasmının kılıç kabzalarını veya bileklerini yakalayıp savurur.\n\nArenada tek kelime konuşmaz, acı feryatları çıkarmaz. Ne var ki ani, yüksek gürültülü ve yeri sarsan tokmak darbeleri kumdaki titreşim haritasını allak bullak ederek onun sezgilerini köreltir.",
        isGladiator: true,
        enemyId: 'fighter_khorvash',
        locationOrDuty: 'Kırlangıç Çukur Arenası'
      }),
      new CharacterProfile({
        id: 'fighter_zalmora',
        name: "Zal'Mora",
        title: 'Kül Kemiren',
        category: CharacterCategory.GLADIATOR,
        avatarIcon: '',
        roleOrWeapon: 'Bilenmiş Boynuz Hançer',
        appearance: 'Gövdesi eski alev yanıklarının bıraktığı büzüşmüş deri lekeleriyle kaplı, göz bebekleri sarımtırak ve sürekli titreyen çılgın bakışlı bir vahşidir. Ağzının kenarlarından gri odun külü sızar. Elinde sarp dağ keçilerinin boynuzundan yontulup jilet gibi sivriltilmiş eğri bir kemik hançer taşır.',
        backgroundLore: 'Gençliğinde çalıştığı bir maden ocağındaki grizu patlamasında yer altında günlerce mahsur kalmış, yanıkların ve açlığın getirdiği hezeyanla maden küllerini yiyerek hayatta kalmıştır. Felaketten kurtulduğunda aklının melekelerini yitirmiş, acıyı bir ızdırap değil ilahi bir zevk olarak görmeye başlamıştır.\n\nHer dövüşten önce arenanın ortasındaki kurban ateşinin küllerini avuçlayıp ağzına atar, aldığı derin kılıç yaralarını ise ocak külüyle dağlayarak kanı durdurur. Hançerinin boynuz sivrisi en kalın zırhların eklem yerlerine yılan gibi sokulur.\n\nPervasız, korkusuz ve vahşidir. Taktik bilmez; rakibinin kılıcını etiyle durdurup karşılığında boynuz hançerini saplamaktan çekinmez. Ancak bu kontrolsüz saldırı hırsı, sağlam bir kalkan duvarı ve mesafeli kargılar karşısında onu açık bir hedef haline getirir.',
        isGladiator: true,
        enemyId: 'fighter_zalmora',
        locationOrDuty: 'Kırlangıç Çukur Arenası'
      }),
      new CharacterProfile({
        id: 'fighter_orn',
        name: 'Orn',
        title: 'Balçık Yılanı',
        category: CharacterCategory.GLADIATOR,
        avatarIcon: '',
        roleOrWeapon: 'Çengelli Avcı Zıpkını',
        appearance: 'Bataklık yosunu renginde çamurla sıvanmış esnek timsah derisi zırhı, ıslak sazlık kokan gövdesi ve çamurlu göz kapaklarıyla bataklığın içinden fırlamış bir canavara benzer. Elinde üç çengelli, sapı sazlık kargısından yapılmış hafif ve ölümcül bir balçık zıpkını tutar.',
        backgroundLore: "Kırlangıç Kasabası'nı çevreleyen balçık sazlıklarında dev nehir yılanları ve bataklık timsahları avlayarak hayatta kalmış bir kaçaktır. Sazlıkların arasında günlerce kıpırdamadan pusuya yatma alışkanlığını arenanın kumlarına taşımıştır.\n\nArenada adımları kaygan ve sessizdir. Zıpkınının çengellerini rakibin zırh askılarına veya bacaklarına takıp hızla geri çekerek hasmını sırtüstü kuma düşürür ve ardından göğsüne saplar.\n\nKıvrak ve kurnazdır. Ne var ki sazlık bataklığın kaygan zeminine alışık kasları, arenanın kuru ve derin kumunda uzun süren karşılaşmalarda çabuk tutulur; köşeye sıkıştırıldığında direnci kırılır.",
        isGladiator: true,
        enemyId: 'fighter_orn',
        locationOrDuty: 'Kırlangıç Çukur Arenası'
      }),
      new CharacterProfile({
        id: 'fighter_sarkoth',
        name: 'Sarkoth',
        title: 'Kum Akrebi',
        category: CharacterCategory.GLADIATOR,
        avatarIcon: '',
        roleOrWeapon: 'Kıvrık Zehir Palası & Akrep Kaması',
        appearance: 'Kafasına sardığı kızıl çöl sarığı, yüzünün yarısını örten toz peçesi ve parmaklarına taktığı bronz akrep halkalarıyla egzotik ve tehlikeli bir intiba bırakır. Silahlarının kıvrımlarında kurumuş akrep zehrinin bıraktığı yeşilimsi yağlı bir tabaka parıldar.',
        backgroundLore: "Kızıl Kum Çölü'nün göçebe kabilelerinden sürgün edilmiş bir zehir ustasıdır. Çocukluğundan itibaren küçük dozlarda akrep zehri içerek diyardaki pek çok ölümcül zehre karşı vücudunda tam bir bağışıklık geliştirmiştir.\n\nArenadaki silahlarının ucuna sürdüğü kurutulmuş çöl akrebi özütü, hasmına açtığı en ufak sıyrıkta bile kana karışarak rakibin reflekslerini felç eder, kaslarını uyuşturur ve son darbeyi indirmesini kolaylaştırır.\n\nSinsi ve son derece hesapçıdır. Ancak zehrinin damarlarda yayılması vakit alır; dövüşün henüz ilk saniyelerinde ezici bir darbeyle üzerine çullanan ağır zırhlı rakiplere karşı planları suya düşer.",
        isGladiator: true,
        enemyId: 'fighter_sarkoth',
        locationOrDuty: 'Kırlangıç Çukur Arenası'
      }),
      // ==========================================
      // KIRLANGIÇ KASABASI SAKİNLERİ & ŞAHSİYETLERİ
      // ==========================================
      new CharacterProfile({
        id: 'npc_vorn',
        name: 'Demirci Vorn',
        title: 'Körük Ustası • Kasaba Demircisi',
        category: CharacterCategory.TOWN_FOLK,
        avatarIcon: '',
        roleOrWeapon: 'Ağır Örs Çekici & Ocak Maşası',
        appearance: 'Geniş omuzları kömür karasıyla sıvanmış, grileşmiş sakalları ve kor gibi parlayan dikkatli gözleri olan bir ustadır. Göğsünde meşin bir demirci önlüğü, sağ kolunda ise onlarca yıldır kızgın demir dövmekten çatlamış çelik gibi nasırlar taşır. Tezgâhının başında durduğunda örsüyle konuşur gibidir.',
        backgroundLore: "Vorn, gençliğinde başkentin en prestijli ordu silahhanelerinde baş kalfa olarak çalışıyordu. Sınır birliklerine gönderilen yüzlerce kılıçta kasti alaşım hilesi yapıldığını ve askerlerin hayatının rüşvet karşılığı satıldığını fark edip lonca başkanına kafa tutunca, iftiraya uğrayarak Kırlangıç'a sürgün edildi.\n\nBataklığın çürütücü havasına ve pas kokusuna inat, Kırlangıç Kasabası'nın merkezinde kurduğu ocakta diyarın en sağlam çeliklerini döver. Arenaya adım atan köleler ve sürgünler onun kapısından geçmeden kumlarda tek bir gün bile hayatta kalamaz.\n\nSert mizaçlı, boş konuşmaktan nefret eden fakat çeliğe ve dürüstlüğe sonsuz saygı duyan bir ustadır. Parasını ödese bile silahına saygı göstermeyen bir dövüşçüye çöp bile satmaz.",
        isGladiator: false,
        locationOrDuty: 'Kırlangıç Kasaba Çarşısı • Demirci Ocağı'
      }),
      new CharacterProfile({
        id: 'npc_mirana',
        name: 'Şifacı Mirana',
        title: 'Kırlangıç Aktarı • Kasaba Hekimi',
        category: CharacterCategory.TOWN_FOLK,
        avatarIcon: '',
        roleOrWeapon: 'Şifa Merhemleri & Damıtma İmbikleri',
        appearance: 'Yeşil kadife kukuletasının altından sarkan kumral saçları, merhamet ve bilgelik dolu ela gözleri vardır. Boynunda kurutulmuş dağ pelini ve dağ kekiği keseleri asılıdır. Parmak uçları yabani kökleri ezmekten hafifçe sararmıştır; etrafına daima nane ve çam reçinesi kokusu yayar.',
        backgroundLore: "Kadim Vadi Şifacıları Loncası'nda yetişmiş, genç yaşta şifalı bitkilerin sırrını çözmek için yollara düşmüştür. Kırlangıç Kasabası'ndan geçerken kasabanın bataklık humması ve dizanteri salgınıyla kırıldığını görünce gitmekten vazgeçmiş, hayatını buradaki gariplere adamıştır.\n\nKasabanın tek hekimidir. Arenanın kumlarından kan revan içinde sedyelerle taşınan gladyatörleri dağ kökleri, ayaz iksirleri ve pelin lapalarıyla ölümün eşiğinden döndürür. Arenadaki dövüşleri barbarca bir vahşet olarak görse de can taşıyan hiçbir canlıya sırtını dönmez.\n\nSakin, sabırlı ve dinleyicidir. Kasabanın en azılı haydutları bile Mirana'nın kulübesine girdiğinde başını eğer ve sesini alçaltır.",
        isGladiator: false,
        locationOrDuty: 'Kırlangıç Kasaba Çarşısı • Şifahane'
      }),
      new CharacterProfile({
        id: 'npc_althea',
        name: 'Kızıl Muhafız Althea',
        title: 'Talim Ustası • Emekli Yüzbaşı',
        category: CharacterCategory.TOWN_FOLK,
        avatarIcon: '',
        roleOrWeapon: 'Çift Süvari Kılıcı & Lejyon Taktiği',
        appearance: 'Dimdik bir askeri duruş, sol elmacık kemiğinde eski bir kılıç sıyrığı ve çelik grisi disiplinli bakışları olan kıdemli bir kadın komutandır. Sırtındaki solgun kırmızı subay pelerini kraliyet ordusundaki geçmişini hatırlatır. Kemerinde kusursuz dengelenmiş iki kılıç kını asılıdır.',
        backgroundLore: "Kraliyet Muhafız Alayı'nda yüzbaşı rütbesine yükselen ender kadın subaylardandı. Sınır garnizonunda emrindeki müfrezenin siyasilerin ihmali yüzünden pusuya düşürülüp yok edilmesini gururuna yediremeyerek istifa etmiş, kılıcın ve onurun gerçek anlamını aramak için sınır boyuna yerleşmiştir.\n\nKırlangıç'ın tozlu talim alanında sokak serserilerine ve köle gladyatörlere nizami lejyon dövüşünü, vücut ağırlık merkezini kullanmayı ve rakibin zırh açıklarını okumayı öğretir. Onun kırbacından ve tahta kılıcından geçen dövüşçüler kumda bir adım öne geçer.\n\nTavizsiz, disiplinli ve adildir. Kibirli ve şöhret sarhoşu dövüşçüleri aşağılamaktan çekinmez, ancak öğrenmeye ve ter dökmeye hazır bir savaşçıya canı pahasına rehberlik eder.",
        isGladiator: false,
        locationOrDuty: 'Kırlangıç Kasabası • Özel Dövüş Talimhanesi'
      }),
      new CharacterProfile({
        id: 'npc_brann',
        name: 'Tellak Brann',
        title: 'Sıcak Taş Tellakı',
        category: CharacterCategory.TOWN_FOLK,
        avatarIcon: '',
        roleOrWeapon: 'Kese Bezi & Şifalı Hamam Suyu',
        appearance: 'Belinde pamuklu çizgili bir peştamal, omzuna atılmış kaba lifli kese bezi, buharlı hamam sıcağından hafifçe pembeleşmiş cildi ve daima babacan gülen yuvarlak bir çehresi vardır. Elleri onlarca yıllık sıcak taş ovmaktan adeta mermer kadar pürüzsüzleşmiştir.',
        backgroundLore: "İsli Kandil Hanı'nın alt katındaki doğal kükürtlü sıcak kaynağın üzerine kurulu tarihi kubbeli hamamın kırk yıllık tellakıdır. Kırlangıç'a yolu düşen kervancılardan, paralı askerlerden ve kumda kemikleri kırılmış gladyatörlerden dokunmadığı sırt kalmamıştır.\n\nSıcak göbek taşında savaşçıların tutulmuş eklemlerini açıp yaralarını kükürtlü buharla arındırırken, kasabadaki en gizli fısıltıları, arena dedikodularını ve sınır boyu söylentilerini ilk elden dinler.\n\nGeveze, neşeli ve kasabanın en zararsız görünen simasıdır. Ancak kese attığı adamların kas reflekslerinden kimin korktuğunu, kimin yaralı olduğunu bir bakışta anlar.",
        isGladiator: false,
        locationOrDuty: 'İsli Kandil Hanı • Kubbeli Hamam'
      }),
      new CharacterProfile({
        id: 'npc_miras',
        name: 'Ozan Miras',
        title: 'Mirasın Sesi • Kasaba Ozanı',
        category: CharacterCategory.TOWN_FOLK,
        avatarIcon: '',
        roleOrWeapon: '7 Telli Sedir Lavtası & Destanlar',
        appearance: 'Eski işlemeli kadife yeleği, göğsüne yasladığı sedir ağacından oyulma yedi telli lavtası, geriye taranmış dalgalı gümüş saçları ve hülyalı bakan yorgun mavi gözleri vardır. Parmakları tellere dokunduğunda hanın gürültülü masaları anında susar.',
        backgroundLore: "Gençliğinde başkent saraylarında düklerin ve düşeslerin huzurunda serenatlar söyleyen ünlü bir saray şairiydi. Sarayın riyakar salonlarında gücün ve yalanın kokusundan bıkınca sazını sırtlayıp diyarın tozlu yollarına düşmüş, adsız sürgünlerin hikayesini yazmak için Kırlangıç'a gelmiştir.\n\nİsli Kandil Hanı'nın şömine başında her akşam şarabını yudumlayarak kumda can veren gladyatörlerin, bataklık canavarlarının ve kadim efsanelerin destanlarını söyler. Onun dizelerine konu olan bir savaşçının adı kasabada dalga dalga yayılır ve şöhret kazanır.\n\nMelankolik, bilge ve kelimeleri kılıç kadar ustalıkla kullanan bir ozandır. Bir altına kısa bir dörtlük söylerken, beş altına diyarın kaderini değiştiren destanları haykırır.",
        isGladiator: false,
        locationOrDuty: 'İsli Kandil Hanı • Şömine Başı'
      }),
      new CharacterProfile({
        id: 'npc_informant',
        name: 'Gölgeli Muhbir',
        title: 'Köşedeki Fısıltı',
        category: CharacterCategory.TOWN_FOLK,
        avatarIcon: '',
        roleOrWeapon: 'Gizli İstihbarat & Fısıltılar',
        appearance: 'Başına geçirdiği derin gri kukuletası yüzünü tamamen karanlığa gömer; yalnızca sivri çenesi ve gölgelerin arasından kehribar rengi parıldayan tek bir gözü seçilir. Üzerinde yıpranmış paçavralar taşır, duvara yaslandığında adeta hanın taş duvarlarıyla birleşir.',
        backgroundLore: "Kimse gerçek adını, nereden geldiğini ya da kime hizmet ettiğini bilmez. Yıllardır İsli Kandil Hanı'nın en karanlık köşesinde kımıldamadan oturur ve masalardan yükselen en önemsiz fısıltıyı bile hafızasına kilitler.\n\nArenadaki gladyatörlerin sakladığı eski yaraları, bahis şebekelerinin şikelerini ve savaşçıların dövüş alışkanlıklarını altın karşılığında fısıldar. Diyarda paranın açamayacağı hiçbir sırrın olmadığına inanır.\n\nSoğuk, esrarengiz ve tekinsizdir. Onunla pazarlık yapanlar her zaman arkalarına bakarak handan ayrılır.",
        isGladiator: false,
        locationOrDuty: 'İsli Kandil Hanı • Kuytu Köşe Masası'
      }),
      // ==========================================
      // TAŞ HİSAR GARNİZONU ŞAHSİYETLERİ (BÖLGE 2)
      // ==========================================
      new CharacterProfile({
        id: 'npc_torvald',
        name: 'Silahçı Torvald',
        title: 'Garnizon Silah Ustası',
        category: CharacterCategory.GARRISON,
        avatarIcon: '',
        roleOrWeapon: 'Ağır Garnizon Kılıçları & Baltalar',
        appearance: 'Deniz fırtınalarıyla çatlamış tunç rengi cildi, örgülü kır bıyıkları ve granit gibi sağlam göğsüyle hisarın en kıdemli askeridir. Sırtında dövme çelik halkalardan örülü garnizon zırhı taşır.',
        backgroundLore: "Yirmi yıldır Taş Hisar'ın deniz döven kayalıklarında garnizon piyadelerine yakın dövüş silahları döven emektar bir demircidir. Dağ madenlerinden çıkan kaliteli çeliği fırtına suyuyla tavlamasıyla ünlüdür.\n\nSadece gerçek disipline ve lejyon ruhuna sahip savaşçılara saygı duyar. Kasaba çukurunun sokak kavgalarını küçümser, nizami çeliğin kudretini över.",
        isGladiator: false,
        locationOrDuty: 'Taş Hisar Garnizon Çarşısı • Silahhane',
        regionId: 'tashisar'
      }),
      new CharacterProfile({
        id: 'npc_armorer',
        name: 'Zırhçı Ulfric',
        title: 'Garnizon Baş Zırhçısı',
        category: CharacterCategory.GARRISON,
        avatarIcon: '',
        roleOrWeapon: 'Plaka Zırhlar & Kule Kalkanlar',
        appearance: 'Dev cüsseli, elleri çelik kıvırmaktan kalınlaşmış, gözlerinde dağ soğuğu taşıyan ağırbaşlı bir zırh ustasıdır. Yanında daima ağır bir perçin çekici taşır.',
        backgroundLore: "Hisarın sarp surlarını koruyan lejyonerlerin kule kalkanlarını ve perçinli göğüslüklerini o döker. Fırtınada kayalardan düşen taşlara ve ağır arbalet oklarına karşı dayanıklı zırhlar tasarlar.\n\n'Çelik tenin olmalı, yoksa bu kayalıklarda mezarın bile bulunmaz' sözü hisarda bir atasözü haline gelmiştir.",
        isGladiator: false,
        locationOrDuty: 'Taş Hisar Garnizon Çarşısı • Zırh Ocağı',
        regionId: 'tashisar'
      }),
      new CharacterProfile({
        id: 'npc_tailor',
        name: 'Terzi Leyla',
        title: 'Hafif Zırh & Kumaş Ustası',
        category: CharacterCategory.GARRISON,
        avatarIcon: '',
        roleOrWeapon: 'Keten & Deri Çevik Zırhlar',
        appearance: 'Zarif, dikkatli ve kıvrak hareketli; boynunda ipek ölçü şeritleri, kemerinde kemik iğneler ve parmaklarında sağlam gümüş yüksükler taşıyan yetenekli bir ustadır.',
        backgroundLore: "Kıyı şeridindeki Keten Vadisi'nden topladığı dayanıklı lifleri işleyerek rüzgara meydan okuyan, sessiz hareket sağlayan hafif deri ve kumaş zırhlar diker.\n\nAğır zırhların hantallığına inanmaz; çevikliğin ve hızın en büyük kalkan olduğunu savunur.",
        isGladiator: false,
        locationOrDuty: 'Taş Hisar Garnizon Çarşısı • Terzihane',
        regionId: 'tashisar'
      }),
      new CharacterProfile({
        id: 'npc_bowyer',
        name: 'Okçu Boris',
        title: 'Menzilli Silahçı & Arbaletçi',
        category: CharacterCategory.GARRISON,
        avatarIcon: '',
        roleOrWeapon: 'Kompozit Boynuz Yaylar & Kuşatma Arbaletleri',
        appearance: 'Gözleri kartal gibi keskin, sırtı yay germekten adalelenmiş, deri nişancı eldivenleri ve tüy süslemeli garnizon yeleği taşıyan tecrübeli bir nişancıdır.',
        backgroundLore: 'Hisar burçlarının eski baş nişancısıdır. Fırtınalı havalarda denizin üzerindeki gemilerin yelken direklerini vuran efsanevi atışlarıyla bilinir.\n\nUzak mesafeden düşmanı avlamanın kaba kuvvetten çok daha asil bir sanat olduğunu savunur.',
        isGladiator: false,
        locationOrDuty: 'Taş Hisar Garnizon Çarşısı • Okçu Tezgâhı',
        regionId: 'tashisar'
      }),
      new CharacterProfile({
        id: 'npc_vesper',
        name: 'Asacı Vesper',
        title: 'Kadim Büyücü & Asa İşçisi',
        category: CharacterCategory.GARRISON,
        avatarIcon: '',
        roleOrWeapon: 'Mistik Odaklar & Rünik Asalar',
        appearance: 'Gece mavisi cübbesi, yıldırım çarpmış ak saçları ve parmaklarında rünik akik yüzükler taşıyan yaşlı, bilge ve derin bakışlı bir büyü ustasıdır.',
        backgroundLore: 'Dağlardaki antik rün çatlaklarından ve kadim korulukların meşe ağaçlarından büyü odakları ve asalar yontar. Maddenin içine gizlenmiş manevi enerjiyi yönlendirme sanatını öğretir.\n\nKaba kılıç darbelerinin bir gün tükeneceğini, hakiki gücün kadim rünlerde saklı olduğunu söyler.',
        isGladiator: false,
        locationOrDuty: 'Taş Hisar Garnizon Çarşısı • Büyü Atölyesi',
        regionId: 'tashisar'
      }),
      new CharacterProfile({
        id: 'npc_kael',
        name: 'Taş Ustası Kael',
        title: 'Mücevheratçı & Rün Ustası',
        category: CharacterCategory.GARRISON,
        avatarIcon: '',
        roleOrWeapon: 'Yuva Delme & Mücevher Kakma',
        appearance: 'Gözünde pirinç büyüteç merceği, ellerinde ince kuyumcu keskileri ve kadife önlüğünde minik elmas tozları parıldayan titiz bir zanaatkardır.',
        backgroundLore: 'Diyarın derin maden ocaklarından çıkan ham yakutları, safirleri ve ametistleri yontarak silahlara ve zırhlara efsunlu yuvalar açar.\n\nTaşların içindeki gizli potansiyeli ortaya çıkarmak onun için bir zanaat değil, kutsal bir geometri sanatıdır.',
        isGladiator: false,
        locationOrDuty: 'Taş Hisar Garnizon Çarşısı • Mücevher Atölyesi',
        regionId: 'tashisar'
      }),
      new CharacterProfile({
        id: 'npc_leatherworker',
        name: 'Saraç Garrick',
        title: 'Saraç & Zırhlı Kösele Ustası',
        category: CharacterCategory.GARRISON,
        avatarIcon: '',
        roleOrWeapon: 'Zırhlı Kolluklar, Gladyatör Bileklikleri & Bacak Zırhları',
        appearance: 'Nasırlı güçlü kolları, kalın deri saraç önlüğü, belinde asılı çelik perçin zımbaları ve keskin kösele bıçaklarıyla dağ gibi duran tecrübeli bir deri ustasıdır.',
        backgroundLore: "Bozdağ'ın yabani dağ bizonlarının derilerini tuzlayıp tabaklar, dövme çelik plakalar ve bronz tokalarla harmanlayarak savaşçıların can damarı olan bileklerini ve bacaklarını korur.\n\n'Bir gladyatörün bileği çelik kadar sert, adımı da fırtına kadar sarsılmaz olmalı' der.",
        isGladiator: false,
        locationOrDuty: 'Taş Hisar Garnizon Çarşısı • Saraç & Kösele Tezgâhı',
        regionId: 'tashisar'
      }),
      new CharacterProfile({
        id: 'npc_mirza_nizar',
        name: 'Mirza Nizar',
        title: 'Güney Zarafet Ustası • İpek ve Beden Terzisi',
        category: CharacterCategory.TOWN_FOLK,
        avatarIcon: '',
        roleOrWeapon: 'Zarafet İpekleri, Dövüş Korseleri & Estetik Sargılar',
        appearance: 'Güneşin kavurduğu güney çöllerinden kalma buğday tenli, ince bıyıklı, sürmeli ela gözleri ve dalgalı simsiyah saçlarıyla büyüleyici bir şıklığa sahiptir. Üzerinde nar çiçeği renginde ipek bir kaftan, boynunda vaha gülleriyle tütsülenmiş şifon bir atkı ve parmaklarında ince gümüş dikiş yüksükleri taşır. Hareketleri bir saray dansçısı kadar zarif ve ölçülüdür.',
        backgroundLore: "Uzak Güney Krallıkları'nın (Berrak Körfez ve Zümrüt Vaha) saraylarında hanedan soylularına ve kraliyet dansçılarına terzilik yapmış bir zarafet üstadıdır. Kuzeyin kanlı, kaba ve paslı demir kokan arena kültürüne tepki olarak bu diyara gelmiştir.\n\nNizar'a göre hakiki dövüş; et parçalayan kaba baltalarla değil, nefes kesen bir beden dili, yırtılan keten kumaşlar, terden parıldayan kaslar ve akrobatik zarafetle icra edilmelidir. Çukur arenasında kan görmekten içi bayılan soyluları ve kasaba ahalisini kendi özel 'Estetik ve Silahsız Dövüş' salonuna çekmektedir.\n\nSıcakkanlı, konuşması iltifatlarla dolu fakat estetik konusunda tavizsizdir. Dükkânına kılıç, gürz, kalkan ya da büyü asasıyla girmeye kalkanı kapıdan kovar: 'Burada kaba kuvvete yer yok canım; sadece tenin ve ruhun zarafeti konuşur!' der.",
        isGladiator: false,
        locationOrDuty: 'Taş Hisar Garnizon Çarşısı • Zarafet Atölyesi',
        regionId: 'tashisar'
      })
    ], ...TashisarGladiatorsData.createTashisarCharacterProfiles()];
  },
};

