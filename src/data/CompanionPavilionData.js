import * as kt from '../kt.js';
import { CompanionChoice, CompanionCulmination, CompanionData, CompanionKademe, CompanionRound } from '../domain/model.js';

export const CompanionPavilionData = {
  getAllCompanions() {
    return [CompanionPavilionData.createAresulaData(), CompanionPavilionData.createAltheaData()];
  },

  getCompanionById(id) {
    return kt.firstOrNull(CompanionPavilionData.getAllCompanions(), it => it.id === id);
  },

  // =========================================================================
  // 1. ARESULA — "FIRTINA DANÇISI" (Kehribar & Baharat Meclisi - 2.500 Altın)
  // =========================================================================
  createAresulaData() {
    return new CompanionData({
      id: 'fighter_aresula',
      name: 'Aresula',
      title: 'Fırtına Dansçısı',
      avatarIcon: '',
      salonTier: 1,
      salonName: 'Kehribar & Baharat Meclisi',
      geographicOrigin: 'Güney Fırtına Boğazı & Kızıl Kanyonlar',
      appearanceSnippet: 'İnce altın pullarla işlenmiş koyu amber rengi tül şalının altından kanyon güneşinde kavrulmuş pürüzsüz teni görünür. Çift hilal bıçaklarını sedirin kenarındaki sehpaya bırakmış; kehribar rengi gözlerinde vahşi, hafif alaycı ama davetkar bir ışıltı dans etmektedir.',
      kademeler: [
        CompanionPavilionData.createAresulaKademe(1, 'Tanışma & Kanyon Rüzgarları'),
        CompanionPavilionData.createAresulaKademe(2, 'Bozkırın Yaraları & Güven'),
        CompanionPavilionData.createAresulaKademe(3, 'Tensel Ateş & İlk Dokunuşlar'),
        CompanionPavilionData.createAresulaKademe(4, 'Fırtınanın Teslimiyeti & Kuşaklar'),
        CompanionPavilionData.createAresulaKademe(5, 'Büyük Vuslat & Sonsuz Bağ')
      ],
      culmination: new CompanionCulmination({
        title: 'Fırtına Dansçısının Vuslat Mabedi',
        prelude: 'Kehribar kandilin loş ışığı, kadife yatağın ipek çarşaflarına uzanmış iki bedenin üzerinde altın rengi dalgalar çiziyordu. Dışarıdaki soğuk Taş Hisar gecesi tamamen silinmiş; odadaki hava yasemin, baharatlı şarap ve tenlerin yaydığı yakıcı hararetle dolmuştu.',
        passionNarrative: [
          "Aresula'nın bronz teni, parmaklarının her dokunuşunda bir yay kirişi gibi geriliyor, ardından derin ve tatlı bir teslimiyetle eriyordu. Kanyonlarda kabile danslarıyla şekillenmiş kıvrımlı vücudu, kollarının arasında kıvranırken dudaklarından boğuk, kesik kesik iniltiler dökülüyordu. Sırtındaki kasların her hareketi, omuzlarından aşağı süzülen ter damlalarıyla parıldıyor; göğsü hızlanan nefesleriyle göğsüne çarpıyordu.",
          "Ellerini senin omuzlarına ve ensene kenetlediğinde, tırnaklarının bıraktığı tatlı sızı aranızdaki arzuyu daha da körükledi. Başını geriye atarak saçlarını yastıklara savurduğunda, gerdanının kusursuz kavisini öpücüklerinle ateşe verdin. Aresula'nın kehribar gözleri şehvetin ve hazzın buğusuyla yarı kapalıydı; dudakları her birleşmede adını fısıldıyor, 'Daha... Daha sert sarıl bana... Fırtınayı içimde dindir...' diye yalvarıyordu.",
          "Yatakta yükselen ritim, güney kanyonlarının en vahşi kasırgasını aratmayacak bir tutku fırtınasına dönüştü. Tenlerin birbirine çarpışından çıkan ses, şöminenin çıtırtısına ve Aresula'nın boğazından kopan haz dolu haykırışlara karıştı. İki beden tek bir alev topu gibi birbirine kenetlenmiş; ne zamanın ne de mekanın sınırları kalmıştı. Aresula bacaklarını sırtına dolayıp seni kendine daha da çektiğinde, gecenin doruk noktası bedenlerinizi sarsan elektrikli bir titremeyle patlak verdi.",
          "Nefes nefese, kalpleri tek bir göğüste atıyormuşçasına birbirlerine sokulmuş halde çarşafların arasına yığıldılar. Aresula'nın yüzünde daha önce hiç görülmemiş bir dinginlik, dudaklarında ise mest olmuş muzaffer bir tebessüm vardı. Başını senin göğsüne yasladı; terli saçlarını şefkatle okşarken parmakları kalbinin üzerinde dairesel çizgiler çiziyordu."
        ],
        morningAfterNarrative: 'Şafak sökerken Taş Hisar\'ın karlı zirvelerinden süzülen ilk soluk ışıklar kadife perdelerin arasından sızdı. Aresula kollarında uyanmış, kehribar gözleriyle sana hayranlıkla bakıyordu. Doğrulup üzerindeki çarşafı göğsüne çekerken gülümsedi:\n\n"Hayatımda ilk defa şafağın sökmesini istemedim silahşör... Bu gece bana kanyonlarımdan bile daha büyük bir özgürlük verdin. Bedenim hala dokunuşlarınla yanıyor."',
        buffRewardTitle: 'Fırtınanın İradesi & Bozkır Tutkusu',
        buffRewardDescription: 'Aresula ile yaşanan unutulmaz vuslat ruhunu ve bedenini çelikleştirdi: 5 maç boyunca +%12 Hız, +%10 Kritik Vuruş Şansı ve +50 Maksimum Can!',
        futureBasePledge: 'Aresula senin boynuna sarılarak son bir söz verdi: "Bir gün bu hisarın surlarından öteye geçip kendi sancağını diktiğinde, ilk çağıracağın kişi ben olacağım. Senin garnizonunun en sadık fırtınası, senin yatağının ise ebedi dansçısı olacağıma and içerim!"'
      })
    });
  },

  createAresulaKademe(level, subtitle) {
    const rounds = [
      new CompanionRound({
        roundNumber: 1,
        roundTitle: '1. Tur: Kehribar Kadehler & İlk Süzüş',
        roundPrompt: 'Aresula sedirde bağdaş kurmuş, nar şarabı kadehini parmakları arasında çeviriyor. Seni baştan ayağa süzerek dudak büker: "Taş Hisar\'ın dondurucu avlusunda çelik savuran o ünlü silahşör nihayet sıcağı aramaya karar vermiş... Ne arıyorsun bu odada yabancı?"',
        choices: [
          new CompanionChoice({
            id: `aresula_${level}_1_1`,
            choiceSummary: 'Zarafetine ve dansçı duruşuna iltifat et',
            playerSpeechText: '"Arenadaki fırtınanın bu kadife içinde böylesine büyüleyici bir zarafete bürüneceğini tahmin etmemiştim. Gözlerin odayı şömineden daha çok ısıtıyor."',
            narrativeResponse: 'Aresula hafifçe kıkırdar; boynundaki ince altın zincirler göğsünün iniş kalkışıyla şıngırdar. "Uysallaşmadım silahşör, sadece dinleniyorum... Ama sözlerin kanyonun ballı incirleri gibi tatlı geldi. Kadehini uzat bakalım."',
            attitudeBadge: 'Zarafet & İlgi'
          }),
          new CompanionChoice({
            id: `aresula_${level}_1_2`,
            choiceSummary: 'Doğrudan ve cüretkar bir arzuyla karşılık ver',
            playerSpeechText: '"Şarabı her handa bulurum Aresula. Ben adımlarıyla rüzgarı bölen kadının gözlerindeki ateşi yakından görmeye geldim."',
            narrativeResponse: 'Kehribar gözlerinde vahşi bir kıvılcım çakar. Kadehini masaya bırakıp sana doğru eğilir: "Ateşe doğru yürümeyi seviyorsun demek... Dikkat et, bu odadaki rüzgar arenadakinden daha hızlı nefesini kesmesin."',
            attitudeBadge: 'Cüret & Ateş'
          }),
          new CompanionChoice({
            id: `aresula_${level}_1_3`,
            choiceSummary: 'Savaşçı saygısıyla kanyon kabilelerini sor',
            playerSpeechText: '"O hilal bıçaklarını savururken adımların adeta toprakla dans ediyor gibiydi. O adımları güneyde kimden öğrendin?"',
            narrativeResponse: 'Yüzündeki alaycı hava yerini hürmetli bir ciddiyete bırakır. "Rüzgar Yontanlar kabilesinden... Biz fırtınaya karşı eğilmemek için yere böyle basarız. Bir erkeğin kanda yalnızca ölüm değil ritim görmesi nadirdir."',
            attitudeBadge: 'Saygı & Derinlik'
          })
        ]
      }),
      new CompanionRound({
        roundNumber: 2,
        roundTitle: '2. Tur: Kızıl Kanyonlar & Bozkırın Hatırası',
        roundPrompt: 'Kadehinden bir yudum daha alır; gözleri şöminenin korlarına dalar: "Bazen geceleri bu hisarın kulelerine çıkıp güneye bakıyorum. Kanyonlarda rüzgar özgür eserdi; buradaki insanlar ise taşlar kadar soğuk ve hesapçı... Sen hiç yorulmadın mı bu kan denizinden?"',
        choices: [
          new CompanionChoice({
            id: `aresula_${level}_2_1`,
            choiceSummary: 'Şefkatle elini tut ve dert ortağı ol',
            playerSpeechText: '"Yorulmaz olur muyum Aresula... Bu diyarda herkes kılıcımızın gücünü konuşur ama sırtımızdaki yaraları kimse sormaz. Bu gece yalnız değilsin."',
            narrativeResponse: 'Elini sıcak elinin üzerine koyduğunda parmakları hafifçe titrer ama çekmez; aksine parmaklarını parmaklarına kenetler. "Ellerin hem sert hem şefkatli... Uzun zamandır kimse bana sadece \'Aresula\' olarak dokunmamıştı."',
            attitudeBadge: 'Şefkat & Derin Bağ'
          }),
          new CompanionChoice({
            id: `aresula_${level}_2_2`,
            choiceSummary: 'Özgürlüğe olan tutkusunu ve savaşçı iradesini öv',
            playerSpeechText: '"Kanyon rüzgarını bu taş surlar hapsedemez. Arenada döktüğün her damla kan seni bir gün oraya hükümdar yapacak güçtür."',
            narrativeResponse: 'Başını gururla dikleştirir; kehribar gözleri alev alır. Bir eli senin göğüs zırhının kenarına dokunur: "Haklısın... Kurban değilim ben! Sen benim içimdeki ateşi nasıl bu kadar iyi okuyorsun silahşör?"',
            attitudeBadge: 'İrade & Tutku'
          }),
          new CompanionChoice({
            id: `aresula_${level}_2_3`,
            choiceSummary: 'Muzip bir tebessümle ortamı neşelendir',
            playerSpeechText: '"Kanyonları bilmem ama bu gece o meşhur kanyon dansının adımlarını bu odada görmeden gitmeye niyetim yok."',
            narrativeResponse: 'Cilveli bir kahkaha atarak şalını omzundan kaydırır. "Demek dans istiyorsun? Ama uyarayım; bu dans sedirde kadehlerle yapılmaz, nefes nefese ten tene yapılır..."',
            attitudeBadge: 'Cilve & Dans'
          })
        ]
      }),
      new CompanionRound({
        roundNumber: 3,
        roundTitle: '3. Tur: Çelik Soğukluğu & Tenin Harareti',
        roundPrompt: 'Masadaki hilal bıçaklarından birini parmaklarında çevirir, bıçağın tersini hafifçe kendi boynuna ve köprücük kemiğine değdirir: "Bıçaklarım dondurucudur silahşör... Ama altındaki ten yanıyor. Sence çelik mi daha tehlikeli, yoksa arzu mu?"',
        choices: [
          new CompanionChoice({
            id: `aresula_${level}_3_1`,
            choiceSummary: 'Bıçağı nazikçe elinden alıp saçlarını okşa',
            playerSpeechText: '"Bırak çeliği masaya Aresula. Bu gece teninin sıcaklığına silahların soğukluğu karışmasın."',
            narrativeResponse: 'Bıçağı elinden alıp masaya bıraktığında derin bir nefes vererek gözlerini yumar. Boşta kalan elini yanağına koyduğunda kedi gibi sokulur: "Ne zamandır bu sıcaklığı arıyordum bir bilsen... Parmakların ruhuma değiyor."',
            attitudeBadge: 'Tensel Şefkat'
          }),
          new CompanionChoice({
            id: `aresula_${level}_3_2`,
            choiceSummary: 'Bileğini kavrayıp kendine çekerek meydan oku',
            playerSpeechText: '"O çeliğin keskinliği, dudaklarının ateşi yanında sönük kalır fırtına kızı."',
            narrativeResponse: 'Bileğini kavrayıp kendine çektiğinde dengesini kaybedip göğsüne yaslanır. Göğüsleriniz çarpışır; kehribar gözleri zaferle parlar: "Vahşi seviyorsun demek... Beni yakalayabilen tek erkek sensin."',
            attitudeBadge: 'Vahşi Tutku'
          }),
          new CompanionChoice({
            id: `aresula_${level}_3_3`,
            choiceSummary: 'Kadehi dudaklarına uzatarak tensel gerilimi tırmandır',
            playerSpeechText: '"Önce dudaklarındaki şarabı tadacağım, sonra ruhundaki fırtınayı..."',
            narrativeResponse: "Kadehten bir yudum alırken nar rengi bir damla çenesine süzülür. Başparmağınla o damlayı silip kendi dudaklarına götürdüğünde Aresula'nın tüm bedeni arzu dolu bir titremeyle sarsılır.",
            attitudeBadge: 'Şehvetli Oyun'
          })
        ]
      }),
      new CompanionRound({
        roundNumber: 4,
        roundTitle: '4. Tur: Gardını İndiren Fırtına & İtiraflar',
        roundPrompt: 'Artık kucağında oturmaktadır. İpek geceliğinin sırmalı kuşağı gevşemiş, pürüzsüz boynu ve kıvrımlı hatları loş ışıkta parıldamaktadır. Nefesi dudaklarına çarpar: "Taş Hisar\'da kimseye eğilmeyen ben... Bu gece kollarında eriyorum. Söyle bana, bu sadece bir gecelik heves mi?"',
        choices: [
          new CompanionChoice({
            id: `aresula_${level}_4_1`,
            choiceSummary: 'Kuşağını çözüp onu sımsıkı sararak dudaklarına yapış',
            playerSpeechText: '"Bu sadece bir gece değil Aresula. Bu gece fırtınayla alevin birleştiği andır."',
            narrativeResponse: 'Kuşağını tek bir çekişle çözdüğünde boğuk bir iniltiyle dudaklarına kenetlenir. Kolları sırtına dolanır, tırnakları tenine batar: "Seninim... Bırakma beni..."',
            attitudeBadge: 'Mutlak Teslimiyet'
          }),
          new CompanionChoice({
            id: `aresula_${level}_4_2`,
            choiceSummary: 'Geleceğin üs yoldaşlığını gözlerine bakarak mühürle',
            playerSpeechText: '"Yarın nerede olursak olalım bu gece birbirimize aitiz. Ve kendi sancağımı açtığım gün en önde sen koşacaksın."',
            narrativeResponse: 'Gözlerinde nemli bir bağlılık parıldar. Alnını alnına yaslar: "Sancağının en sadık kılıcı olacağım silahşör. Ama bu gece... Bu gece sadece sen ve ben varız."',
            attitudeBadge: 'Sadakat & Sonsuz Aşk'
          }),
          new CompanionChoice({
            id: `aresula_${level}_4_3`,
            choiceSummary: 'Onu kucağına alarak kadife yatağa taşı',
            playerSpeechText: '"Konuşma zamanı bitti dansçı... Fırtınayı yatağın kadifelerinde dindireceğiz."',
            narrativeResponse: 'Onu kucağına aldığında başını boynuna gömer; sıcak öpücükleri tenini yakar. Yatağa uzandığınızda saçları beyaz çarşaflara serilir; bacaklarını hafifçe aralayarak seni kendine çeker.',
            attitudeBadge: 'Edebi Şehvet'
          })
        ]
      }),
      new CompanionRound({
        roundNumber: 5,
        roundTitle: '5. Tur: Geceyi Mühürleme & Vuslat Eşiği',
        roundPrompt: 'Mumların son alevi kadife perdelerde dans ediyor. İki bedenin nefesleri tek bir fırtınaya dönüşmüş, şöminenin kızıl korları tenlerinize vuruyor. Aresula gözlerinin ta içine bakıyor: "Fırtınanın koynuna girmeye gerçekten hazır mısın silahşör?"',
        choices: [
          new CompanionChoice({
            id: `aresula_${level}_5_1`,
            choiceSummary: 'Tutkuyu doruğa çıkar ve geceyi mühürle',
            playerSpeechText: '"Kendimi fırtınanın kollarına bırakıyorum Aresula. Bu gece Taş Hisar bizim aşkımızla yansın!"',
            narrativeResponse: 'Aresula seni kollarının arasına çeker; dudakları dudaklarında kaybolurken gecenin en derin fırtınası başlar...',
            attitudeBadge: 'Büyük Vuslat'
          }),
          new CompanionChoice({
            id: `aresula_${level}_5_2`,
            choiceSummary: 'Alnını öperek derin bir aşk yemini et',
            playerSpeechText: '"Ruhun da tenin de bana emanet fırtına kızı. Bu gece seninleyim."',
            narrativeResponse: 'Yüzünde tarifsiz bir huzur ve tatlı bir tebessüm belirir. Kollarını sımsıkı boynuna sarar ve fısıldar: "Beni tamamla..."',
            attitudeBadge: 'Aşk & Teslimiyet'
          }),
          new CompanionChoice({
            id: `aresula_${level}_5_3`,
            choiceSummary: 'Bedenini sımsıkı kavrayarak dizginleri tamamen al',
            playerSpeechText: '"Bu gece fırtınanın efendisi benim dansçı..."',
            narrativeResponse: 'Aresula şehvet dolu bir iniltiyle başını geriye atar; kalçalarını sana bastırarak seni tamamen içine çeker.',
            attitudeBadge: 'Hüküm & Arzu'
          })
        ]
      })
    ];
    return new CompanionKademe({
      kademeLevel: level,
      kademeTitle: `Kademe ${level}: ${subtitle}`,
      introAmbiance: "Kehribar & Baharat Meclisi'nin kadife perdeleri aralanır. Şömine çıtırdamakta, nar şarabı kokusu odayı sarmaktadır. Aresula seni karşılar.",
      rounds: rounds,
      conclusionFarewell: 'Gecenin son kadehi boşaldığında Aresula sedirden usulca doğrulur. Dağınık lülelerini geriye atıp üzerindeki tül şalı omzuna çeker. Gözlerinde derin bir minnet ve arzuyla gülümser:\n\n"Bu gece Taş Hisar\'ın soğuğunu bana tamamen unutturdun silahşör... Tenimdeki sıcaklığın yarınki arenada adımlarıma güç katacak. Bir sonraki kadehimizi şimdiden sabırsızlıkla bekleyeceğim."'
    });
  },

  // =========================================================================
  // 2. KIZIL MUHAFIZ ALTHEA (Yeşim & İpek Mabedi - 5.000 Altın)
  // =========================================================================
  createAltheaData() {
    return new CompanionData({
      id: 'npc_althea',
      name: 'Kızıl Muhafız Althea',
      title: 'Muhafız Baş Eğitmeni & Sürgün Kumandan',
      avatarIcon: '',
      salonTier: 2,
      salonName: 'Yeşim & İpek Mabedi',
      geographicOrigin: 'Başkent Kraliyet Muhafız Alayı & Taş Hisar',
      appearanceSnippet: 'Odanın ortasındaki buğulu lavanta jakuzisinin kenarında, üzerinde yalnızca sırtı açık kan kırmızısı ipek bir kaftanla oturmaktadır. Dövüş meydanlarında herkesin diz çöktüğü kırmızı süvari çizmeleri kenara bırakılmış; altın sarısı saçları çıplak omuzlarına dökülmektedir. Mağrur çehresinde bir kumandanın otoritesi ve bastırılmış bir kadının alev alev yanan arzusu bir aradadır.',
      kademeler: [
        CompanionPavilionData.createAltheaKademe(1, 'Yeşim Aynalar & Mağrur Kumandan'),
        CompanionPavilionData.createAltheaKademe(2, 'Başkent Sürgünü & Kırık Kalpler'),
        CompanionPavilionData.createAltheaKademe(3, 'Lavanta Jakuzisi & Tensel Yakınlaşma'),
        CompanionPavilionData.createAltheaKademe(4, 'Bir Kumandanın Gururu Arzuya Yenilirken'),
        CompanionPavilionData.createAltheaKademe(5, 'Büyük Vuslat & Asil Yemin')
      ],
      culmination: new CompanionCulmination({
        title: 'Kızıl Muhafızın Gizli Mabedi & Asil Vuslat',
        prelude: "Yeşim & İpek Mabedi'nin altın varaklı kraliyet yatağında, Taş Hisar'ın en korkulan savaş ustası ve sürgün kumandanı Kızıl Muhafız Althea, tüm unvanlarını ve zırhını bir kenara bırakmış, saf bir arzu ve teslimiyetle çarşafların üzerinde parıldıyordu.",
        passionNarrative: [
          "Althea'nın kusursuz altın sarısı saçları ipek yastıklara bir hale gibi dağılmıştı. Yıllarca süvari talimleriyle bilenmiş güçlü ama bir o kadar kadınsı ve kıvrımlı vücudu, her dokunuşunda derin, kesik kesik iniltilerle kavis alıyordu. Başkentin saray salonlarında kimseye eğilmeyen o mağrur başı, şimdi kollarının arasında geriye düşmüş; boynundaki damarlar hızla atan kalbinin ritmiyle zonkluyordu.",
          "Elleri çılgınca sırtına dolandı; tırnaklarını omuzlarının kaslarına geçirirken dudakları kulağına ateşli fısıltılar döküyordu: 'Beni... Beni hiç kimse böyle hissettirmedi silahşör... İçimdeki ateşi görüyorsun değil mi? Yak beni... Bir kumandanı değil, senin kadının olan Althea'yı yak!' Dudakları dudaklarına kenetlendiğinde, öpüşleri bir kılıç çarpışması kadar sert ama bal kadar tatlı bir sarhoşluğa büründü.",
          "Yatakta yükselen ritim, sarayın sahte valslerini hiçe sayan fırtınalı bir savaş dansına dönüştü. Tenlerin birbirine değmesinden yayılan sıcaklık lavanta havuzunun buharını bile bastırıyor; Althea'nın kalçasını kavrayan parmaklarının izi beyaz teninde kırmızı güller gibi açıyordu. Her hamlede Althea'nın boğazından kopan zevk dolu çığlıklar yeşim aplikli duvarlarda yankılandı; bedeni kollarında yay gibi geriliyor, ardından derin bir haz titremesiyle göğsüne yığılıyordu.",
          'Gecenin doruk noktası yaklaştığında Althea tırnaklarını sırtına daha da derin batırdı; bacaklarını beline sımsıkı kenetleyerek seni kendine çekti. İki bedenin aynı anda infilak ettiği o nihai anda, Althea adını bir zafer narası gibi haykırdı ve kendini kollarının arasına bıraktı. Göğsü göğsüne yapışmış halde, ter damlaları birbirine karışırken dakikalarca nefeslerini düzene sokmaya çalıştılar.'
        ],
        morningAfterNarrative: 'Şafak söktüğünde Taş Hisar\'ın borazan sesleri uzaklardan yankılandı. Althea yatakta doğrulmuş, çıplak sırtındaki sarı saçlarını geriye atarak sana gurur ve aşk dolu gözlerle bakıyordu. Dudaklarında muzaffer bir tebessümle eğilip seni alnından öptü:\n\n"Bugün talim meydanına çıktığımda askerler gözlerime bakmaktan korkacak... Çünkü gözlerimde senin zaferinin ateşi yanıyor olacak silahşör. Bu geceyi ömrümün sonuna dek unutmayacağım."',
        buffRewardTitle: 'Kızıl Muhafızın İncisi & Sürgün Zaferi',
        buffRewardDescription: 'Althea ile yaşanan asil vuslat iradeni çelikten bir sura dönüştürdü: 5 maç boyunca +15 Zırh, +%15 Hasar ve +%20 Maksimum Can!',
        futureBasePledge: 'Althea boynundaki süvari mührünü çıkarıp avucuna bıraktı: "Kendi kaleni ve üssünü kurduğun gün bu mührü havaya kaldır. Nerede olursam olayım, en seçkin kılıçlarımla senin garnizonunun başına geçeceğim. Sen benim hem efendim hem de kalbimin tek sahibisin!"'
      })
    });
  },

  createAltheaKademe(level, subtitle) {
    const rounds = [
      new CompanionRound({
        roundNumber: 1,
        roundTitle: '1. Tur: Yeşim Aynalar & Mağrur Kumandan',
        roundPrompt: 'Althea kan kırmızısı kaftanıyla geniş divanda oturuyor. Elindeki altın varaklı kadehi hafifçe kaldırıp seni süzer: "Demek Yeşim Mabedi\'nin mührünü kıracak kadar altın döktün silahşör... Burası talim meydanı değil. Zırhın olmadan kim olduğunu göstermeye hazır mısın?"',
        choices: [
          new CompanionChoice({
            id: `althea_${level}_1_1`,
            choiceSummary: 'Askeri şanına ve asaletine boyun eğmeden saygı göster',
            playerSpeechText: '"Karşında bir acemi yok kumandanım. Talim meydanındaki disiplinine ne kadar saygı duyuyorsam, bu mabetteki zarafetine de o kadar hayranım."',
            narrativeResponse: 'Althea\'nın mavi gözlerinde gizli bir hoşnutluk parıldar. "Karşımda eğilmeyen erkekleri severim silahşör... Çoğu erkek kılıcımdan korkup gözlerime bakamaz. Ama senin duruşun granit kadar sağlam."',
            attitudeBadge: 'Asalet & Saygı'
          }),
          new CompanionChoice({
            id: `althea_${level}_1_2`,
            choiceSummary: 'Zırhın arkasındaki kadını doğrudan ve cüretle hedef al',
            playerSpeechText: '"Zırhım olmadan ben bir erkeğim Althea. Ve karşımda Taş Hisar\'ı yakıp kül edebilecek güzellikte bir kadın görüyorum."',
            narrativeResponse: 'Althea donakalır; göğsü hızla iner kalkar. Divandan ayağa kalkıp sana doğru iki adım atar: "Ateşle oynuyorsun... Bana unvansız hitap edebilen son adam başkomutandı. Bakalım cesaretin gecenin sonuna kadar sürecek mi?"',
            attitudeBadge: 'Cüret & İrade'
          }),
          new CompanionChoice({
            id: `althea_${level}_1_3`,
            choiceSummary: 'Başkent sürgününü ve garnizonun dedikodularını sor',
            playerSpeechText: '"Başkent Muhafız Alayı\'nın en parlak subayının bu dondurucu sınıra sürülmesinin ardındaki gerçek hikayeyi merak ediyorum."',
            narrativeResponse: 'Bakışları uzaklara dalar; sesinde gururlu bir kırgınlık sızlar: "Saraydaki yaşlı düklerden biri beni yatağına almak istedi, ben de kılıcımı boğazına dayadım... Pişman değilim. Ama seninle konuşmak ruhuma iyi geldi."',
            attitudeBadge: 'Sırdaşlık & Güven'
          })
        ]
      }),
      new CompanionRound({
        roundNumber: 2,
        roundTitle: '2. Tur: Zırhın Çatlaması & Omuzdaki Kılıç İzi',
        roundPrompt: 'Kaftanı omuzlarından hafifçe kaymış; sol omzundan köprücük kemiğine inen eski kılıç yarasını parmaklarıyla gösterir: "Bu iz kuzey teberinin darbesiydi... Canımı yakan o çelik değil, arkamdan kuyu kazanların sahte tebessümleriydi. O günden beri kimsenin bana yaklaşmasına izin vermedim... Ta ki sen gelene dek."',
        choices: [
          new CompanionChoice({
            id: `althea_${level}_2_1`,
            choiceSummary: 'Yara izini şefkatle parmaklarınla okşa',
            playerSpeechText: '"Bir savaşçının yaraları onun madalyasıdır Althea. Ama bu gece savunma yapmana gerek yok. Kılıcını da kalbini de bana emanet edebilirsin."',
            narrativeResponse: 'Parmakların yara izine değdiğinde elektrik çarpmış gibi titrer. Gözlerini kapatıp derin bir iç çeker: "Bana böyle dokunma silahşör... Yoksa bir daha asla zırhımı giyememekten korkuyorum."',
            attitudeBadge: 'Derin Şefkat'
          }),
          new CompanionChoice({
            id: `althea_${level}_2_2`,
            choiceSummary: "Onun gücünü ve Taş Hisar'daki mutlak hakimiyetini öv",
            playerSpeechText: '"Seni sürgün edenler bir ceza verdiklerini sandılar; oysa Taş Hisar\'a bir kraliçe armağan ettiler."',
            narrativeResponse: 'Başını gururla dikleştirir; mavi gözlerinde muzaffer bir parıltı çakar. Bir eli dizine kayar: "Bir kraliçenin bile yanında bileğini bükemese de kalbini fethedebilecek bir erkeğe ihtiyacı vardır..."',
            attitudeBadge: 'Hüküm & İhtiras'
          }),
          new CompanionChoice({
            id: `althea_${level}_2_3`,
            choiceSummary: 'Kırmızı çizmelerini göstererek muzip bir meydan okuma yap',
            playerSpeechText: '"Herkes o meşhur kırmızı çizmelerinden korkuyor Althea. Ama şu an karşımda yalnızca şarabını yudumlarken eli titreyen güzel bir kadın var."',
            narrativeResponse: 'Melodik bir kahkaha atarak seni göğsünden sedire bastırır: "O çizmeler acemiler içindir... Ama seni dize getirmek için çizmelere ihtiyacım yok. Kalbimin nasıl çarptığını duyuyor musun?"',
            attitudeBadge: 'Cilveli Meydan Okuma'
          })
        ]
      }),
      new CompanionRound({
        roundNumber: 3,
        roundTitle: '3. Tur: Lavanta Jakuzisi & Buharlı Yakınlaşma',
        roundPrompt: 'Sıcak lavanta havuzundan yükselen buhar odayı sarhoş edici bir kokuyla dolduruyor. Althea kaftanını mindere bırakmış, teninden buğular yükselerek sana elini uzatır: "Suyun sıcaklığı bile aramızdaki gerilimin yanında serin kalıyor silahşör... Benimle suya girer misin?"',
        choices: [
          new CompanionChoice({
            id: `althea_${level}_3_1`,
            choiceSummary: 'Elini tutup onunla birlikte suya adım at',
            playerSpeechText: '"Senin olduğun her ateşe seve seve adım atarım kumandanım."',
            narrativeResponse: 'Sıcak sular bedenlerinizi sararken Althea kollarını boynuna dolar. Tenlerinizin birbirine sürtünüşü dayanılmaz bir haz dalgası yaratır: "Suyun içinde bile beni alev alev yakıyorsun..."',
            attitudeBadge: 'Jakuzi & Tensellik'
          }),
          new CompanionChoice({
            id: `althea_${level}_3_2`,
            choiceSummary: 'Onu kollarından yakalayıp sudan önce dudaklarını öp',
            playerSpeechText: '"Önce dudaklarındaki ateşi söndüreceğim Althea..."',
            narrativeResponse: "Tek bir güçlü hamleyle onu kendine çekip dudaklarına kenetlendiğinde Althea'nın ağzından boğuk bir inilti dökülür; tırnakları sırtına kenetlenir.",
            attitudeBadge: 'Ateşli Öpücük'
          }),
          new CompanionChoice({
            id: `althea_${level}_3_3`,
            choiceSummary: 'Dizginleri ona vererek arzusunu emretmesini söyle',
            playerSpeechText: '"Sen bir kumandansın. Bu gece ne istediğini sen emret."',
            narrativeResponse: 'Dudaklarında zafer dolu bir tebessümle seni sedire yatırıp üzerine çıkar: "İlk emrim: Bu gece kollarımda tek bir an bile uyumayacaksın!"',
            attitudeBadge: 'Baskın Şehvet'
          })
        ]
      }),
      new CompanionRound({
        roundNumber: 4,
        roundTitle: '4. Tur: Kraliyet Yatağı & Bir Kumandanın İtirafı',
        roundPrompt: 'Yeşim Mabedi\'nin geniş kraliyet yatağına geçmişsinizdir. Sarı saçları yastıklara dağılmış, gözleri arzuyla buğulanmıştır: "Buraya gelen hiçbir erkek beni bu yatakta göremezdi silahşör... Onlar sadece unvanımı görürdü. Sen ise ruhumu soydun. Şimdi tenimi de al."',
        choices: [
          new CompanionChoice({
            id: `althea_${level}_4_1`,
            choiceSummary: 'Yatağa uzanıp onu kollarının altına çek',
            playerSpeechText: '"Bu gece kralların bile tadamadığı bir zaferi tadacağız Althea..."',
            narrativeResponse: 'Kollarını boynuna dolayıp bacaklarını beline sarar: "Al beni... Beni son damlama kadar tüket silahşör!"',
            attitudeBadge: 'Mutlak Zafer'
          }),
          new CompanionChoice({
            id: `althea_${level}_4_2`,
            choiceSummary: 'Geleceğin Baş Kumandanı olması için yemin ettir',
            playerSpeechText: '"Taş Hisar senin değerini bilemedi. Kendi kalemizi kurduğumuzda ordularımın başında sen duracaksın."',
            narrativeResponse: 'Gözlerinde gurur dolu yaşlar parlar: "Kılıcım da canım da sana sunduğum kadınlığım da senindir... Sancağının altında ölüme bile sevinçle koşarım!"',
            attitudeBadge: 'Ebedi Bağlılık'
          }),
          new CompanionChoice({
            id: `althea_${level}_4_3`,
            choiceSummary: 'Ona yavaşça ve derin bir şefkatle yaklaş',
            playerSpeechText: '"Acelemiz yok kumandanım. Sabaha kadar her zerreni ezberleyeceğim."',
            narrativeResponse: 'Şakaklarından ve boynundan öperek indiğinde Althea kendinden geçer: "Daha fazla bekleme... İçimdeki ateşi söndür!"',
            attitudeBadge: 'Edebi Şefkat'
          })
        ]
      }),
      new CompanionRound({
        roundNumber: 5,
        roundTitle: '5. Tur: Geceyi Mühürleme & Asil Vuslat Eşiği',
        roundPrompt: 'Yeşim apliklerin loş ışığı tenlerinizde parıldıyor. Althea iki eliyle yüzünü kavrar, nefesi nefesine karışır: "Taş Hisar\'ın en mağrur kadını bu gece senin kollarında diz çöküyor... Beni sevecek misin silahşör?"',
        choices: [
          new CompanionChoice({
            id: `althea_${level}_5_1`,
            choiceSummary: 'Efsanevi vuslatı başlat ve geceyi mühürle',
            playerSpeechText: '"Taş Hisar\'ın en mağrur kalbi bu gece benim kollarımda atıyor Althea..."',
            narrativeResponse: 'Althea seni kollarının arasına çeker; dudakları dudaklarında kaybolurken asil bir kumandanın en tutkulu gecesi başlar...',
            attitudeBadge: 'Büyük Vuslat'
          }),
          new CompanionChoice({
            id: `althea_${level}_5_2`,
            choiceSummary: 'Alnını öpüp onu sımsıkı sararak teslim ol',
            playerSpeechText: '"Sen benim hem kumandanım hem de kadınımsın Althea."',
            narrativeResponse: 'Gözlerinden süzülen bir damla yaşı göğsüne gömer; iki beden tek bir alev topu haline gelir...',
            attitudeBadge: 'Derin Aşk'
          }),
          new CompanionChoice({
            id: `althea_${level}_5_3`,
            choiceSummary: 'Tavizsiz bir tutkuyla bedenini kendine çek',
            playerSpeechText: '"Bu gece ikimiz de teslim oluyoruz Althea..."',
            narrativeResponse: 'Şehvet dolu bir iniltiyle bacaklarını beline kenetler ve aranızdaki tüm engelleri yıkar.',
            attitudeBadge: 'Mutlak Tutku'
          })
        ]
      })
    ];
    return new CompanionKademe({
      kademeLevel: level,
      kademeTitle: `Kademe ${level}: ${subtitle}`,
      introAmbiance: "Yeşim & İpek Mabedi'nin ağır kapısı kapanır. Misk tütsüleri ve lavanta buharı odayı kaplamıştır. Althea seni karşılar.",
      rounds: rounds,
      conclusionFarewell: 'Gecenin sonu geldiğinde Althea divandan usulca doğrulur. Kan kırmızısı kaftanını omuzlarına alırken altın sarısı saçlarını geriye savurur. Yüzünde bir kumandanın mağrur duruşu, dudaklarında ise mest olmuş sıcak bir tebessüm vardır:\n\n"Bu gece Taş Hisar\'ın buzları aramızda tamamen eridi silahşör... Yarın talim meydanına çıktığımda askerlerime sert bakacağım ama aklımda senin sözlerin olacak. Bir sonraki kadehimizi sabırsızlıkla bekliyorum."'
    });
  },
};

