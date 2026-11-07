import * as kt from '../../kt.js';

export const AestheticCombatNarratives = {
  // === GİRİŞ ANLATIMLARI ===
  generateIntro(fighterA, fighterB, outfitDescA, outfitDescB) {
    const intros = [
      `✨ Hakem gonku vurduğunda kumların üzerine çelik zırhlar değil, zarafet süzüldü. ${fighterA} üzerindeki ${outfitDescA} ile rüzgarda dalgalanırken, karşısındaki ${fighterB} ${outfitDescB} ile podyumda dans edercesine adımlarını açtı.`,
      `✨ Soylular locasından dökülen alkışlar arasında ${fighterA} ve ${fighterB} karşı karşıya geldi. ${fighterA} ${outfitDescA} içinde nefes kesen bir duruş sergilerken, ${fighterB} ${outfitDescB} kuşamıyla gerilen kaslarını gizlemeye bile gerek duymadı.`,
      `✨ Kum pistte kan kokusu değil, yasemin ve vaha yağları tütüyordu. ${fighterA} üzerindeki ${outfitDescA} ile zarifçe yaylandı. Rakibi ${fighterB} ise ${outfitDescB} ile gözlerini dikmiş, ilk hamle için nefesini tutuyordu.`,
      `✨ Taş Hisar'ın aristokrat seyircileri yerlerinden doğruldu. ${fighterA} (${outfitDescA}) ile ${fighterB} (${outfitDescB}) arasındaki silahsız estetik düelloda ilk selamlaşma reveransla yapıldı.`
    ];
    return kt.random(intros);
  },

  // === KAÇINMA / AKROBASİ / SIYRILMA ===
  generateDodge(dodger, attacker) {
    const dodges = [
      `💫 ${attacker} ani bir hamleyle atıldı ancak ${dodger} havada geriye doğru yay gibi bükülerek takla attı; ipek kumaşı rüzgarla hışırdayarak kumların üzerine kedi sessizliğinde indi!`,
      `💫 ${attacker}'ın uzanan parmakları hedefini bulamadı. ${dodger} kuğu gibi yana süzülüp kumaşının dökümünü savurarak rakibinin boşluğuna kaydı.`,
      `💫 ${dodger} tek dizinin üstünde kayarak gelen açık el darbesinin altından tereyağından kıl çekercesine sıyrıldı; savrulan saçları rakibin yüzünü yalayarak geçti.`,
      `💫 ${attacker} hızla arayı kapatmaya çalıştı ancak ${dodger} zarif bir turna sıçrayışıyla havaya yükselip rakibinin omzunun üzerinden aşıverdi!`,
      `💫 ${dodger} vücudunu kusursuz bir kavisle geriye yatırarak tekmeyi milimle savuşturdu; kumaşın gerilme hışırtısı arenada yankılandı.`
    ];
    return kt.random(dodges);
  },

  // === YAKAYA YAPIŞMA / SARILMA / KLİNÇ ===
  generateClinch(initiator, defender) {
    const clinches = [
      `🤼 ${initiator} aniden öne atılarak ${defender}'ın saten yakasına iki eliyle sımsıkı yapıştı! İki dövüşçünün göğüsleri birbirine çarptı, ter damlaları kumaşa işlerken nefes nefese bir güç savaşı başladı.`,
      `🤼 ${initiator} rakibinin beline sarılarak onu kendine kilitledi; kumaşların sürtünme sesi ve gerilen dikişlerin çıtırtısı tribünleri ayağa kaldırdı!`,
      `🤼 ${initiator}, ${defender}'ın hamlesini yakalayıp kolunun altından girdi; vücut vücuda kenetlendiklerinde omuz başları birbirine çarparak nefesleri kesti.`,
      `🤼 ${defender}'ın savrulan fırfırlı kumaşını yakalayan ${initiator} sertçe kendine çekti; burun buruna geldiklerinde gözlerindeki meydan okuma alev alev parıldadı!`
    ];
    return kt.random(clinches);
  },

  // === DARBE / AÇIK EL / VURUŞ ===
  generateStrike(attacker, defender, damage) {
    const strikes = [
      `💥 ${attacker} avuç içiyle ${defender}'ın göğüs kafesine odaklı ve sert bir vuruş indirdi! Darbe nefesini keserken ${defender} geriye doğru sendeledi. (-${damage} Can)`,
      `💥 ${attacker} döner tekme savurarak ${defender}'ın kaburgalarını hedef aldı; darbenin gücüyle saten kumaş içeri doğru ezildi! (-${damage} Can)`,
      `💥 ${attacker} rakibinin dengesini bozup açık elinin tabanıyla çenesinin altına estetik bir vuruş oturttu; ${defender} birkaç adım sendeledi. (-${damage} Can)`,
      `💥 ${attacker}'ın ardı ardına indirdiği iki çevik dirsek hamlesi ${defender}'ın gardını delerek omuz başlarını sarstı! (-${damage} Can)`,
      `💥 ${attacker} parmak uçlarıyla rakibin denge sinir merkezine kusursuz bir baskı vuruşu yaptı; ${defender}'ın dizlerinin bağı çözüldü. (-${damage} Can)`
    ];
    return kt.random(strikes);
  },

  // === KRİTİK VURUŞ / YERE ÇALMA / ÇELME ===
  generateCriticalTakedown(attacker, defender, damage) {
    const takedowns = [
      `⚡ ${attacker} rakibin kumaşını kavrayıp kalçasını altına soktu ve ${defender}'ı muazzam bir kavisle havaya kaldırıp sırtüstü kumların üzerine çaldı! (-${damage} Can)`,
      `⚡ ${attacker} ani bir bacak süpürmesiyle ${defender}'ın ayaklarını yerden kesti; dövüşçü havada fırıldak gibi dönerek sertçe yere çarptı! (-${damage} Can)`,
      `⚡ ${attacker} rakibin kolunu arkaya kıvırarak gövdesini kilitledi ve vücut ağırlığını kullanarak onu kum pistin merkezine estetik bir yayla fırlattı! (-${damage} Can)`,
      `⚡ ${attacker}'ın kusursuz çelmesiyle dengesini yitiren ${defender} zemine yapışırken kumaşının iplikleri patlayarak havaya uçuştu! (-${damage} Can)`
    ];
    return kt.random(takedowns);
  },

  // === EKLEM KİLİDİ / PES ETTİRME GİRİŞİMİ ===
  generateSubmissionAttempt(attacker, defender) {
    const attempts = [
      `🔒 ${attacker} yerdeki ${defender}'ın kolunu yakalayıp göğsünün arasına aldı; ters eklem kilidi (armbar) uygulayarak dirseği bükmeye başladı! ${defender} acıyla dişlerini sıktı.`,
      `🔒 ${attacker} rakibinin arkasına geçerek boynuna kusursuz bir boğma kilidi uyguladı; kan dökmeden, sadece nefes borusunu baskılayarak bilinci zorluyor!`,
      `🔒 ${attacker} rakibin omzunu kendi bacaklarının arasına kıstırarak kıpırdayamaz hale getirdi; ${defender} çaresizce çıkış yolu arıyor!`,
      `🔒 ${attacker}, ${defender}'ın bileğini arkaya kıvırıp tendonları gerdi; kemik kırmadan uygulanan bu zarif kilit rakibin canını fena yakıyor!`
    ];
    return kt.random(attempts);
  },

  // === KIYAFET YIRTILMASI / AŞINMASI (DEFORMASYON) ===
  generateClothingTear(fighter, stage, outfitPiece) {
    if (stage === 1) {
      const list = [
        `🧵 Sert sürtünmeyle ${fighter} üzerindeki ${outfitPiece} parçasının dikişleri patladı; kopan sedef düğmeler kumların üzerine saçıldı!`,
        `🧵 ${fighter}'ın ${outfitPiece} kenarı boydan boya yırtılarak kumaş şeritleri rüzgarda uçuşmaya başladı.`,
        `🧵 Hamlenin şiddetiyle ${fighter}'ın ${outfitPiece} kumaşında derin bir yırtık açıldı; teni kumaşın arasından parıldadı.`
      ];
      return kt.random(list);
    } else if (stage === 2) {
      const list = [
        `🪡 Şiddetli boğuşmada ${fighter}'ın belindeki kuşak tamamen çözülüp savruldu; ${outfitPiece} iki yana ayrılarak terden ışıldayan kaslı göğüs ve sırtı gözler önüne serdi!`,
        `🪡 ${fighter} üzerindeki ${outfitPiece} neredeyse ortadan ikiye ayrıldı; ter damlaları çıplak omuzlarından aşağı süzülürken seyirciler coşkuyla bağırdı!`,
        `🪡 Yakaya asılan el ${outfitPiece} kumaşını boydan boya parçaladı; dövüşçünün gövdesi kumaş sargıların arasından tüm estetiğiyle açığa çıktı!`
      ];
      return kt.random(list);
    } else {
      const list = [
        `✨ ${fighter}'ın üzerindeki ${outfitPiece} artık sadece birkaç yırtık saten şeritten ibaret! Vücudu ter, kum ve kas estetiğiyle kaplanmış halde nefes nefese direniyor!`,
        `✨ ${outfitPiece} paramparça dökülürken ${fighter} çıplak göğsü, yırtık paçaları ve dimdik duruşuyla zarafetin doruk noktasını sergiliyor!`,
        `✨ Kumaşın tamamen parçalanmasıyla ${fighter}'ın tüm hatları ve gergin adeleleri açığa çıktı; dövüş adeta heykelsi bir zarafet tablosuna dönüştü!`
      ];
      return kt.random(list);
    }
  },

  // === ANLATICI / TELLAL VE BAŞ HAKEM YORUMLARI (ESTETİK & ÇIPLAKLIK FELSEFESİ) ===
  generateAnnouncerCommentary(fighterA, fighterB, stage) {
    const commentaries = [
      "📢 Arenanın Baş Tellalı ve Zarafet Hakemi fildişi asasını kumlara vurup gür sesiyle haykırdı: 'Sakin olun ey Taş Hisar soyluları ve hanımefendileri! Karşınızda gördüğünüz bu manzara alelade bir yatak odası oyunu yahut ucuz bir şehvet sergisi değildir! Bu, kumaşın ve zırhın sahteliğinden sıyrılmış kadın ve erkek teninin, gerilen adelelerinin, terinin ve zarafetinin ta kendisidir! Hakiki dövüş sanatına hürmet edin!'",
      "📢 Anlatıcının yankılanan sesi locaları doldurdu: 'Gözlerinizi dört açın! Burada bayağı bir çıplaklık yok; iki gladyatörün ten tene kenetlenerek ortaya koyduğu ilahi bir beden heykeli ve estetiğin doruk noktası var!'",
      "📢 Baş Hakem kumlara adım atarak locadaki fısıltıları bastırdı: 'Yırtılan ipeklere bakıp şehvete kapılmayın! Gördüğünüz şey çelikten ve kandan arınmış iki asil bedenin diliyle icra edilen kusursuz bir zarafet düellosudur!'",
      "📢 Tellalın şiirsel sesi arenada yankılandı: 'Bu bir yatak gösterisi değil, estetik ve fiziksel sınırların nefes kesen dansıdır! Tenin asaleti ve adelelerin kıvrımı kumların üzerinde yaşayan bir mermer heykele dönüşüyor!'",
      `📢 Arenanın Baş Tellalı ellerini iki yana açtı: 'Soylu seyircilerimiz! ${fighterA} ve ${fighterB}'nin kuşamları parçalanırken geriye kalan saf sanattır; kadın ile erkeğin, güç ile zarafetin birbirine meydan okuyuşudur! Alkışlayın bu görkemli estetiği!'`
    ];
    return kt.random(commentaries);
  },

  // === İZLEYİCİ / TRİBÜN VE SOYLU LOCASI TEPKİLERİ ===
  generateSpectatorReaction(stage) {
    if (stage === 1) {
      const list = [
        '👥 Soylular locasında ipek yelpazeler hızla sallanmaya başladı; hanımefendiler hayranlıkla fısıldaşırken beyler şarap kadehlerini masaya bırakıp pürdikkat kum pistine kilitlendi.',
        '👥 Tribünlerdeki fısıltılar aniden kesildi; kopan sedef düğmelerin ardından görünen omuzlar seyircilerin merakını bir kat daha alevlendirdi.'
      ];
      return kt.random(list);
    } else if (stage === 2) {
      const list = [
        "👥 Çözülen kuşaklar ve yırtılan yeleklerin ardından açığa çıkan terli göğüsler karşısında tribünlerden derin bir 'Ooooh!' uğultusu yükseldi; bazı soylular gözlerini kırpmaktan çekinerek localarında öne eğildi!",
        '👥 Locadaki saraylılar büyülü bir sessizliğe gömüldü; ter damlalarının çıplak ten üzerinden süzülüşü arenadaki tüm kaba kavgaları unutturdu, fısıltılar yerini hayranlık dolu iç çekişlere bıraktı.',
        '👥 Genç asilzadeler ve hanımefendiler yelpazelerinin arkasından parıldayan gözlerle sahneyi izlerken, arenada kan kokusu yerine estetiğin büyüsü hüküm sürüyordu.'
      ];
      return kt.random(list);
    } else {
      const list = [
        '👥 Tüm arena adeta büyülenmişçesine donakaldı! Seyirciler nefes almayı bile unuttu; kumaşlardan sıyrılmış heykelsi bedenlerin yakın temas mücadelesi karşısında hanımefendiler ellerini dudaklarına götürürken, beyler altın sikkelerini kumların üzerine saçtı!',
        "👥 Seyirciler çılgınca ayağa fırladı! Tribünler alkış tufanıyla inlerken, 'Yaşasın saf zarafet, yaşasın tenin sanatı!' naraları hisarın surlarında yankılandı.",
        '👥 Locadaki aristokratlar şarap kadehlerini birbirine tokuşturup ayakta alkışladı; dövüş adeta antik bir saray tablosuna dönüşmüştü!'
      ];
      return kt.random(list);
    }
  },

  // === MAÇ SONU: KANSIZ NAKAVT & PES ETME (SUBMISSION) ===
  generateVictory(winner, loser, isSubmission) {
    if (isSubmission) {
      const log = `🏁 ${loser} daha fazla eklem baskısına dayanamadı! Boştaki eliyle kum piste üç kez hızla vurarak 'PES!' dedi. Hakem derhal araya girerek kilidi çözdürdü.`;
      const reason = `${loser} kilit altında pes etti (Teslimiyet).`;
      return [log, reason];
    } else {
      const log = `🏁 ${loser} nefessiz kalarak dizlerinin üzerine çöktü ve saygıyla başını eğdi. Bedeninde tek bir damla kan dökülmedi ancak takati tamamen bitti. Hakem ${winner}'ın elini havaya kaldırdı!`;
      const reason = `${loser} nefes nefese diz çökerek yenilgiyi kabul etti (Zarafet Nakavtı).`;
      return [log, reason];
    }
  },
};

