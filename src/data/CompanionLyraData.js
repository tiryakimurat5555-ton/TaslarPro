import * as kt from '../kt.js';
import { CompanionChoice, CompanionCulmination, CompanionData, CompanionKademe, CompanionRound } from '../domain/model.js';

export const CompanionLyraData = {
  createLyraData() {
    return new CompanionData({
      id: 'fighter_lyra',
      name: 'Lyra',
      title: 'Gölge Dansçısı',
      avatarIcon: '🗡️',
      salonTier: 1,
      salonName: 'Kehribar & Baharat Meclisi',
      geographicOrigin: 'Taş Hisar Alt Dehlizleri & Gece Loncası',
      appearanceSnippet: 'Kömür karası ipek peçesinin ardında parıldayan zümrüt yeşili gözleri, sedirin üzerine kıvrılmış bir kedi gibi esnek ve tehlikeli bedeniyle seni karşılar. Boynundaki gümüş çıngıraklar her nefesinde fısıltıyla çınlar; parmakları arasında çift engerek hançerini oyuncak gibi döndürürken yüzünde gizemli bir tebessüm dans eder.',
      kademeler: [
        CompanionLyraData.createKademe1(),
        CompanionLyraData.createKademe2(),
        CompanionLyraData.createKademe3(),
        CompanionLyraData.createKademe4(),
        CompanionLyraData.createKademe5()
      ],
      culmination: new CompanionCulmination({
        title: 'Gölge Dansçısının Gece Mabedi & Vuslatı',
        prelude: 'Loş kandil alevleri, odanın siyah kadife perdelerine ve ipek şiltelerine titrek gölgeler düşürüyordu. Hançerlerini yere bırakan Lyra, ilk defa siyah tül peçesini tamamen çözüp yere bıraktı. Yüzü ay ışığının süt beyazı aydınlığında bir tanrıça heykeli gibi belirdi; zümrüt gözleri hiçbir gizleme ihtiyacı duymadan saf bir arzu ve teslimiyetle parlıyordu.',
        passionNarrative: [
          "Lyra'nın ince ve esnek bedeni, kollarının arasına bir gölge gibi kaydı; ancak bu kez bir darbe indirmek için değil, teninin yakıcı hararetini göğsüne bastırmak içindi. Parmakların onun sırtındaki narin kıvrımlarda ve bel çukurunda dolaşırken, Lyra dudaklarını boynuna gömdü. Ağzından dökülen boğuk fısıltılar ve kesik nefesler, odanın sessizliğini titretti: 'Gölgelerden kaçmayı hiç istemedim... Ama senin ışığında kaybolmak, bildiğim tüm karanlıklardan daha tatlı bir zehir...'",
          'İpek geceliğinin son bağları da çözülüp yere düştüğünde, ay ışığı onun narin omuzlarını, esnek karın kaslarını ve suikastçı adımlarıyla bilenmiş biçimli bacaklarını aydınlattı. Lyra ellerini ensene dolayıp seni yastıklara çektiğinde dudaklarınız sabırsız, aç ve tutkulu bir yangınla birleşti. Her öpüşü, dudaklarındaki hafif karanfil tadıyla seni baş döndürücü bir sarhoşluğa sürüklüyordu; tırnakları sırtına hafifçe battığında haz dolu bir inilti koyverdi.',
          "Tenlerin birbirine kenetlendiği o ritmik dans, arenanın ölümcül dövüşlerinden çok daha yüksek bir hararetle alevlendi. Lyra'nın esnek gövdesi dokunuşların altında dalgalanıyor, göğsü hızla inip kalkarken saçları yastıklara seriliyordu. Gözlerini bir an olsun gözlerinden ayırmıyordu; içindeki tüm yalnızlık, yıllardır biriktirdiği sokak korkuları ve soğuk dehliz kabusları aranızdaki bu yakıcı yangında küle dönüyordu. Seni kendine daha sıkı bastırarak doruğa ulaştığında, boğazından kopan tatlı haykırış odanın kadife duvarlarında yankılandı.",
          "Sıcak çarşafların arasında birbirine kenetlenmiş iki gölge gibi öylece kaldılar. Lyra'nın terli şakakları göğsüne yaslanmıştı; hızlı atan kalbi senin kalp atışlarına karışıyordu. Parmaklarını göğsündeki yara izlerinde gezdirdi ve hayatında ilk kez savunmasız, huzurlu ve içten bir gülümsemeyle sana baktı."
        ],
        morningAfterNarrative: 'Sabahın ilk sisli ışıkları odaya dolduğunda Lyra kollarında huzurla mırıldanıyordu. Peçesiz yüzüyle doğrulup uzun siyah saçlarını geriye savurdu. Gülümseyerek yanağına sıcak bir buse kondurdu:\n\n"Hayatım boyunca insanların gözlerinden ve hançerlerinden saklandım silahşör... Fakat senin kollarında olmak, bana ilk kez çıplak kalmanın korku değil, sonsuz bir güç olduğunu hissettirdi. Artık nereye gitsen gölgen değil, seninle yürüyen nefesin olacağım."',
        buffRewardTitle: '🌑 Gecenin Gölgesi & Çevik Tutku',
        buffRewardDescription: 'Lyra ile yaşanan derin vuslat bedenini ve reflekslerini görünmez bir hızla donattı: 5 maç boyunca +%14 Kaçınma, +%12 Kritik Hasar ve +50 Can!',
        futureBasePledge: 'Lyra engerek hançerini avucuna bastırıp göğsüne dokundu: "Bir gün kendi kaleni veya karargahını kurduğunda, senin en sadık gözcün ve görünmez hançerin olacağım. Düşmanların adını fısıldamadan önce benim zehrimle yüzleşecek. Seni asla yalnız bırakmayacağıma kanım üzerine and içerim!"'
      })
    });
  },

  // =========================================================================
  // KADEME 1: Gölgeler Arasında Tanışma & Hançerlerin Dansı
  // =========================================================================
  createKademe1() {
    return new CompanionKademe({
      kademeLevel: 1,
      kademeTitle: 'Gölgeler Arasında Tanışma & Hançerlerin Dansı',
      introAmbiance: 'Karanfil ve afyon tütsüsü kokan loş odada, Lyra sedirin üzerine tünemiş, parmakları arasında bir hançeri hafifçe döndürüyor. Seni süzen zümrüt gözlerinde hem bir sokak kedisinin merakı hem de ölümcül bir suikastçının soğuk kuşkusu var.',
      rounds: [
        new CompanionRound({
          roundNumber: 1,
          roundTitle: 'Hançerin Gölgesi',
          roundPrompt: "Lyra hançerini parmaklarının üzerinde durdurup sana doğru eğildi: 'Taş Hisar'ın çamurlu sokaklarından kurtulup bu kadife odaya kadar geldin silahşör... Bir gölgeye 2.500 altın dökmek için fazla mı zenginsin, yoksa gecenin karanlığında kaybolmaktan mı korkuyorsun?'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k1_r1_c1',
              choiceSummary: 'Paranın değil, o hançerlerin ardındaki kadının peşindeyim de.',
              playerSpeechText: 'Altın gelir geçer Lyra. Ama bu hisarın gölgelerinde fısıltıyla anılan bir dansçının yüzündeki peçeyi merak etmek her altına değer.',
              narrativeResponse: "Lyra ince kaşlarını hafifçe kaldırır. Hançerin çeliğini dudağına yaklaştırıp fısıldar: 'Merak tehlikeli bir huydur silahşör... Bazı perdeler aralandığında arkasından çiçek değil, engerek yılanı çıkar. Ama cesaretini sevdim.'",
              attitudeBadge: '🗡️ Tehlikeli Merak'
            }),
            new CompanionChoice({
              id: 'lyra_k1_r1_c2',
              choiceSummary: 'Karanlıktan korkmam, kılıcım karanlığı da keser de.',
              playerSpeechText: 'Karanlıktan korksaydım arenanın kumlarına adım atmazdım. Ben buraya laf dalaşına değil, dengimi tanımaya geldim.',
              narrativeResponse: "Hafifçe kıkırdar. Sedirden aşağı doğru esnek bir hareketle kayarak yanına bir adım yaklaşır: 'Dengi mi? Hisarda bana denk olduğunu iddia eden çok muhafız oldu. Çoğunun çizmeleri hala alt dehlizlerdeki farelere yem oluyor. Bakalım sen ne kadar dayanacaksın.'",
              attitudeBadge: '⚔️ Meydan Okuma'
            }),
            new CompanionChoice({
              id: 'lyra_k1_r1_c3',
              choiceSummary: 'Sadece biraz huzur ve yalnızlıktan kurtulmak istedim de.',
              playerSpeechText: 'Garnizonun kaba naralarından ve kan kokusundan uzaklaşmak istedim. Belki gölgelerin içinde bir nebze sükunet vardır.',
              narrativeResponse: "Gözlerindeki keskin alay bir anlığına yumuşar. Başını yana eğip seni inceler: 'Sükunet mi? Bir suikastçının odasında sükunet aramak... Fazlasıyla tuhaf bir adamsın sen. Ama belki de bu gece kan dökmemek bana da iyi gelir.'",
              attitudeBadge: '🖤 Samimi İtiraf'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 2,
          roundTitle: 'Engerek Zehri',
          roundPrompt: "Lyra masadaki kadehe nar şarabı doldurup sana uzattı. Kadehin kenarına parmağını sürerken gülümsedi: 'İç bakalım... İçinde engerek zehri olmadığını garanti edemem. Güveniyor musun bana?'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k1_r2_c1',
              choiceSummary: 'Kadehi gözlerinin içine bakarak tek dikişte bitir.',
              playerSpeechText: 'Senin gibi güzel bir kadının elinden zehir içmek bile bu hisarın ekşi birasından daha tatlıdır.',
              narrativeResponse: "Kadehi boğazına dikmeni hayret ve gizli bir hayranlıkla izler. Yanakları tülün altından hafifçe kızarır: 'Deli bir adamsın... Ya gerçekten zehirleseydim? Ama gözünü bile kırpmadın. Bunu aklımda tutacağım.'",
              attitudeBadge: '🔥 Gözü Kara'
            }),
            new CompanionChoice({
              id: 'lyra_k1_r2_c2',
              choiceSummary: 'Kadehi al ama önce onun içmesini iste.',
              playerSpeechText: 'Güven kazanılan bir şeydir güzelim. Önce sen bir yudum al, sonra ben kadehi kurutayım.',
              narrativeResponse: "Gözlerini kısıp cilveli bir kahkaha atar. Kadehi dudaklarına götürüp küçük bir yudum alır, ardından kadehi tekrar sana uzatır: 'Kurnazsın... Bir sokak faresi kadar tedbirlisin. Bu hisarda hayatta kalmayı hak ediyorsun.'",
              attitudeBadge: '♟️ Tedbirli Avcı'
            }),
            new CompanionChoice({
              id: 'lyra_k1_r2_c3',
              choiceSummary: 'Kadehi kenara bırakıp elini tutmaya çalış.',
              playerSpeechText: 'Şaraba gerek yok. Seni zehirle değil, sözlerinle tartmak istiyorum.',
              narrativeResponse: "Elini uzattığında hançeriyle parmaklarının arasına hafifçe vurur ama canını yakmaz: 'Acele etme silahşör. Bir engerekle dans ederken elini nereye koyduğunu bilmen gerekir. Yoksa ısırılırsın.'",
              attitudeBadge: '🐍 Cilveli Mesafe'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 3,
          roundTitle: 'Çıngırakların Sesi',
          roundPrompt: "Lyra ayağa kalkar, ayak bileklerindeki gümüş çıngıraklar her adımında ritmik bir fısıltı çıkarır: 'Bu çıngırakları neden taktığımı biliyor musun? Bir gölge dansçısı kurbanına yaklaşırken ses çıkarmaz... Ben bunları avıma bir şans vermek için takarım.'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k1_r3_c1',
              choiceSummary: 'Ben av değilim, avcıyım de.',
              playerSpeechText: 'Beni kurbanlarınla karıştırma Lyra. O çıngırakların sesi benim için tehdit değil, müziğin kendisi.',
              narrativeResponse: "Etrafında bir tüy gibi döner, ipek kumaşının ucu ceketine sürtünür: 'Kibirli bir avcı... Ne kadar yükseğe çıkarsan, kumlara o kadar sert düşersin. Ama sesini sevdim.'",
              attitudeBadge: '🏹 Avcı İradesi'
            }),
            new CompanionChoice({
              id: 'lyra_k1_r3_c2',
              choiceSummary: 'Bana bir dans borçlusun öyleyse de.',
              playerSpeechText: "Madem çıngırakların çalıyor, bana Taş Hisar'ın alt sokaklarında öğrendiğin o dansı göster.",
              narrativeResponse: "Gözleri muzipçe parıldar. Kandilin önünde yavaşça salınarak kollarını kaldırır; hareketleri o kadar akıcıdır ki gölgesi duvarda dalgalanan bir dumana benzer: 'Herkes bu dansı göremez silahşör. Şanslısın.'",
              attitudeBadge: '💃 Büyüleyici Dans'
            }),
            new CompanionChoice({
              id: 'lyra_k1_r3_c3',
              choiceSummary: 'Çıngırakların ardındaki yalnızlığı duyabiliyorum de.',
              playerSpeechText: 'O çıngıraklar avına şans vermek için değil Lyra... Kimsenin seni duymadığı karanlık dehlizlerde kendi sesini duymak için takılmış.',
              narrativeResponse: "Adımları birden donakalır. Sırtı sana dönük halde bir an nefesini tutar. Yavaşça başını çevirir; gözlerindeki savunma kalkanı bir anlığına delinmiştir: 'Sen... İnsanların içini okumakta fazla küstahsın.'",
              attitudeBadge: '👁️ Ruhun Aynası'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 4,
          roundTitle: 'Yara İzleri',
          roundPrompt: "Lyra sedirin ucuna oturur, bileğindeki deri sargıyı gevşettiğinde sol kolundaki ince, derin kılıç çizikleri belirir: 'Taş Hisar'ın altındaki dehlizler arenadan daha merhametsizdir. Orada kural yoktur. Hiç ölümün soğuk nefesini ensende hissettin mi?'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k1_r4_c1',
              choiceSummary: 'Kendi yaralarını göster ve anını paylaş.',
              playerSpeechText: "Şu göğsümdeki çentik Morvath'ın kargısından kaldı. Ölümle her gün aynı sofraya oturuyoruz Lyra. Birbirimize yabancı değiliz.",
              narrativeResponse: "Uzun tırnaklı parmaklarıyla göğsündeki ize hafifçe dokunur. Dokunuşu buz gibi ama ürpertici derecede şefkatlidir: 'Demek sen de benim gibi hayatta kalmak için etinden parça verdin... Bu bizi biraz daha yakınlaştırır.'",
              attitudeBadge: '🛡️ Ortak Acı'
            }),
            new CompanionChoice({
              id: 'lyra_k1_r4_c2',
              choiceSummary: 'Artık o karanlıkta yalnız değilsin de.',
              playerSpeechText: 'Geçmişin ne kadar karanlık olursa olsun, bundan sonra arkana baktığında beni görebilirsin.',
              narrativeResponse: "Gözlerini devirip alaycı bir tavır takınır ama sesindeki titreklik onu ele verir: 'Hemen koruyucu melek rolüne soyunma silahşör... Yine de... Uzun zamandır kimse arkamı kollamayı teklif etmemişti.'",
              attitudeBadge: '🖤 Koruyucu Kanat'
            }),
            new CompanionChoice({
              id: 'lyra_k1_r4_c3',
              choiceSummary: 'Yaralar savaşçıyı çirkinleştirmez, parlatır de.',
              playerSpeechText: 'O izler senin zayıflığın değil Lyra, ne kadar inatçı ve canlı olduğunun kanıtı.',
              narrativeResponse: "Dudaklarında buruk bir tebessüm belirir. Bileğindeki sargıyı tekrar sarar: 'Şairane sözler... Ama kabul etmeliyim, kulağa kaba asker küfürlerinden çok daha iyi geliyor.'",
              attitudeBadge: '✨ Zarif Övgü'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 5,
          roundTitle: 'Gecenin Vedası',
          roundPrompt: "Kandilin yağı tükenmeye yüz tutmuş, oda koyu bir kızıllığa bürünmüştür. Lyra ayağa kalkar, hançerlerini tekrar kınına sokar: 'Gecenin ilk perdesi kapandı silahşör. İlk karşılaşmamız için fena değildin. Bir dahaki sefere daha fazlasını isteyeceğim.'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k1_r5_c1',
              choiceSummary: 'Elini öperek veda et.',
              playerSpeechText: 'Bir dahaki sefere kadar o gölgelerin arasından bana göz kulak ol Lyra.',
              narrativeResponse: "Elini dudaklarına götürdüğünde parmaklarının arasından bir titreme geçer. Gözleri parıldar: 'Gölgeler her zaman izler silahşör... Özellikle de ilgimi çekenleri.'",
              attitudeBadge: '🌹 Asil Veda'
            }),
            new CompanionChoice({
              id: 'lyra_k1_r5_c2',
              choiceSummary: 'Bir dahaki sefere peçeni indireceğim de.',
              playerSpeechText: 'Gelecek gelişimde o tülün ardındaki gerçek yüzünü göreceğim. Kendini hazırla.',
              narrativeResponse: "Geriye doğru çekilerek kapı aralığında erir gibi durur: 'O peçeyi indirmek kolay değildir... Ama denerken ölmezsen, belki ödülünü alırsın.'",
              attitudeBadge: '😏 Meydan Okuma'
            }),
            new CompanionChoice({
              id: 'lyra_k1_r5_c3',
              choiceSummary: 'Kendine dikkat etmesini fısılda.',
              playerSpeechText: 'Taş Hisar tehlikeli bir yer. Dikkatli ol, bir sonraki ziyaretime kadar hayatta kal.',
              narrativeResponse: "Sıcak bir nefesle kulağına fısıldar: 'Ben gölgeyim sevgilim... Asıl dünya benden korksun. Şimdilik hoşça kal.'",
              attitudeBadge: '🖤 Şefkatli Veda'
            })
          ]
        })
      ],
      conclusionFarewell: 'Lyra parmak uçlarında kapıya süzülür, gümüş çıngırakların hafif sesi koridorda yankılanıp kaybolur. Odanın içinde karanfil tütsüsü ve onun teninin kokusu asılı kalır. İlk bağ kurulmuş, aranızdaki buzlar kırılmıştır.'
    });
  },

  // =========================================================================
  // KADEME 2: Peçenin Ardındaki Sırlar & Yaralı Geçmiş
  // =========================================================================
  createKademe2() {
    return new CompanionKademe({
      kademeLevel: 2,
      kademeTitle: 'Peçenin Ardındaki Sırlar & Yaralı Geçmiş',
      introAmbiance: 'İkinci gelişinde Lyra seni bekletmez. Bu kez saçlarını omzuna dökmüş, ipek yeleğinin bağlarını gevşetmiştir. Masada iki kadeh ve taze incirler vardır. Tavırlarında ilk günkü hırçın kuşkudan ziyade, gizli bir davet ve tatlı bir merak hissedilmektedir.',
      rounds: [
        new CompanionRound({
          roundNumber: 1,
          roundTitle: 'Yeniden Karşılaşma',
          roundPrompt: "Lyra seni görünce gülümsedi: 'Seni yeniden görmek güzel silahşör. Arenada dövüştüğün maçı duydum... Hızlıydın, ama benim kadar çevik değil. Buraya yaralarını sarmaya mı geldin?'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k2_r1_c1',
              choiceSummary: 'Yaralarımı sadece senin dokunuşun sarabilir de.',
              playerSpeechText: 'Dövüş kolaydı Lyra. Beni asıl yoran şey, seni bir daha ne zaman göreceğimi düşünmekti.',
              narrativeResponse: "Lyra kadehi sana uzatırken gözlerini süzer: 'Diline şerbet mi sürdün sen? Ama hoşuma gitmediğini söylersem yalan olur. Gel, otur yanıma.'",
              attitudeBadge: '🔥 Cilveli İltifat'
            }),
            new CompanionChoice({
              id: 'lyra_k2_r1_c2',
              choiceSummary: 'Beni arenada izlediğini bilmiyordum de.',
              playerSpeechText: 'Demek tribünlerde gözlerin üzerimdeydi? Bir suikastçının dikkatini çekmek gurur verici.',
              narrativeResponse: "Omuz silker: 'Gölgelerden izliyordum. Hasmının kılıcından nasıl sıyrıldığını gördüm. Fena değildin... Birkaç adım daha öğrenirsen belki benimle yarışabilirsin.'",
              attitudeBadge: '🎯 Gizli Takip'
            }),
            new CompanionChoice({
              id: 'lyra_k2_r1_c3',
              choiceSummary: 'İncirlerden birini alıp ona ikram et.',
              playerSpeechText: 'Önce biraz tatlı yiyelim. Bu gece kavga etmek değil, senin sesini dinlemek istiyorum.',
              narrativeResponse: "Uzattığın inciri parmaklarının arasından dudaklarıyla alır. Dudakları parmak uçlarına hafifçe değer: 'Tadı güzelmiş... Ama senin sesin de fena gelmiyor kulağıma.'",
              attitudeBadge: '🍇 Tatlı Yakınlık'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 2,
          roundTitle: 'Loncanın Prangaları',
          roundPrompt: "Lyra kadehinden derin bir yudum aldı: 'Ben küçük bir çocukken Gece Loncası beni sokaktan aldı. Bana sessizce yürümeyi, zehir damlatmayı ve asla kimseye bağlanmamayı öğrettiler. 'Bir gölgenin kalbi olmaz' derlerdi. Sence haklılar mı?'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k2_r2_c1',
              choiceSummary: 'Yanıldıklarını, senin kocaman bir kalbin olduğunu söyle.',
              playerSpeechText: 'Sana yalan söylemişler Lyra. Kalbi olmayan biri bu kadar tutkuyla dans edemez ve gözlerinde bu yangını taşıyamaz.',
              narrativeResponse: "Gözleri nemlenir gibi olur, hızla başını çevirir: 'Bunu bana ilk söyleyen sensin. Lonca ustaları duysa beni acemilikle suçlardı... Ama senin inanman içimi ısıtıyor.'",
              attitudeBadge: '🖤 Kalpten İnanç'
            }),
            new CompanionChoice({
              id: 'lyra_k2_r2_c2',
              choiceSummary: 'Loncalar zayıf insanları köleleştirmek için kural uydurur de.',
              playerSpeechText: 'Onlar seni bir alet olarak kullanmak istedi. Ama sen bir alet değilsin, kendi kaderini çizebilecek kadar güçlüsün.',
              narrativeResponse: "Yumruklarını sıkar: 'Haklısın. Taş Hisar'ın altına gömülüp başkalarının intikamı için ölmek istemiyorum. Kendi hayatımı yaşamak istiyorum.'",
              attitudeBadge: '⚡ Özgürlük Ateşi'
            }),
            new CompanionChoice({
              id: 'lyra_k2_r2_c3',
              choiceSummary: 'Kalpsiz bir gölge bile ateşe yaklaşınca erir de.',
              playerSpeechText: 'Kalbin taştan bile olsa, bu gece burada benim ateşimle eriyeceksin.',
              narrativeResponse: "Hafifçe titreyerek güler: 'Tehlikeli sözler... Ama o ateşin beni yakmasından korkmuyorum silahşör.'",
              attitudeBadge: '🔥 Yakıcı Sözler'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 3,
          roundTitle: 'Peçenin Yarısı',
          roundPrompt: "Lyra elini tül peçesine götürdü. Yavaşça peçenin bir tarafını çözdü; dudakları, biçimli çenesi ve yanağındaki küçük tatlı ben tamamen açığa çıktı: 'Sana yüzümün yarısını gösteriyorum silahşör... Bu hisarda bu kadarına bile şahit olan pek az adam hayatta kaldı.'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k2_r3_c1',
              choiceSummary: 'Dudaklarının güzelliğini öv.',
              playerSpeechText: 'Düşündüğümden de güzelsin Lyra. O dudakları saklamak bu diyara yapılmış en büyük haksızlık.',
              narrativeResponse: "Dudakları hafifçe aralanır, mahcup ama gururlu bir gülümseme yayılır: 'Beni şımartıyorsun... Ama sözlerin kalbime işliyor.'",
              attitudeBadge: '💋 Büyüleyici Güzellik'
            }),
            new CompanionChoice({
              id: 'lyra_k2_r3_c2',
              choiceSummary: 'Parmak uçlarınla yanağındaki bene dokun.',
              playerSpeechText: 'Şu küçük bene dokunmak, hisarın tüm ganimetlerinden daha kıymetli.',
              narrativeResponse: "Parmaklarını geri çekmez; aksine yanağını avucuna doğru hafifçe yaslar: 'Elin çok sıcak... Sokakların soğuğundan sonra bu sıcaklık o kadar yabancı ki...'",
              attitudeBadge: '🌸 Şefkatli Dokunuş'
            }),
            new CompanionChoice({
              id: 'lyra_k2_r3_c3',
              choiceSummary: 'Geri kalanını ne zaman göreceğim diye sor.',
              playerSpeechText: 'Diğer yarısını ne zaman göreceğim? Beni böyle merakta bırakmaya devam mı edeceksin?',
              narrativeResponse: "Gözlerini kırpar: 'Sabırlı ol... En lezzetli meyveler en zor dallarda yetişir. Hak ettiğinde tamamını göreceksin.'",
              attitudeBadge: '⏳ Tatlı Sabır'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 4,
          roundTitle: 'Gece Fısıltısı',
          roundPrompt: "Lyra sedire biraz daha sokuldu, omzu senin koluna yaslandı: 'Bazen geceleri uyuyamam. Alt dehlizlerdeki damlayan suların sesi kafamın içinde yankılanır. Beni kollarının arasına alıp biraz sarılır mısın? Sadece... Sessizce.'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k2_r4_c1',
              choiceSummary: 'Kollarını sımsıkı etrafına dola ve saçlarını kokla.',
              playerSpeechText: 'Buradayım Lyra. Hiçbir su sesi, hiçbir karanlık anı sana dokunamaz artık.',
              narrativeResponse: "Başını göğsüne yaslar, derin bir nefes alır: 'Kokun... Demir, deri ve temiz rüzgar kokuyorsun. Kendimi güvende hissetmeyeli yıllar olmuştu.'",
              attitudeBadge: '🛡️ Güvenli Liman'
            }),
            new CompanionChoice({
              id: 'lyra_k2_r4_c2',
              choiceSummary: 'Ona fısıltıyla ninni gibi bir şarkı mırıldan.',
              playerSpeechText: 'Sana bozkırın rüzgarlarından bir melodi mırıldanayım, gözlerini kapat.',
              narrativeResponse: "Kirpikleri yavaşça titrer, göğsüne iyice sokulur: 'Sesin o kadar huzurlu ki... İçimdeki o yırtıcı kedi bile uykuya dalmak istiyor.'",
              attitudeBadge: '🎶 Huzurlu Ezgi'
            }),
            new CompanionChoice({
              id: 'lyra_k2_r4_c3',
              choiceSummary: 'Boynuna hafif bir öpücük kondur.',
              playerSpeechText: 'Kollarım her zaman senin sığınağın olacak.',
              narrativeResponse: "Öpücüğün değdiği yer alev alır gibi ürperir; boynunu geriye doğru bükerek hafifçe inler: 'Çok tehlikelisin silahşör... Kalbimi çalmak üzeresin.'",
              attitudeBadge: '🔥 Sıcak Temas'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 5,
          roundTitle: 'Gece Sonu Sözü',
          roundPrompt: "Vakit gece yarısını geçmişti. Lyra istemeye istemeye kollarından sıyrıldı, peçesini tekrar yüzüne çekti ama bu kez gözleri bambaşka bakıyordu: 'Gitmeliydim çoktan... Ama buradan ayrılmak artık zor geliyor. Beni unutmayacaksın değil mi?'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k2_r5_c1',
              choiceSummary: 'Seni unutmak nefes almayı unutmak gibi olur de.',
              playerSpeechText: 'Bir gölge dansçısı kalbime hançerini sapladı Lyra. Seni nasıl unutabilirim?',
              narrativeResponse: "Gözleri mutlulukla parıldar: 'Öyleyse o hançeri çıkarmaya çalışma sevgilim. Çok yakında yeniden geleceksin biliyorum.'",
              attitudeBadge: '💖 Ebedi Hatıra'
            }),
            new CompanionChoice({
              id: 'lyra_k2_r5_c2',
              choiceSummary: 'Bir sonraki buluşmada seni daha da yakınımda tutacağım de.',
              playerSpeechText: 'Bir sonraki sefere sadece sarılmakla kalmayacağız. Hazır ol.',
              narrativeResponse: "Yüzü peçenin ardından kızarır, cilveli bir fısıltıyla yanıt verir: 'Bunu dört gözle bekleyeceğim cüretkar savaşçı.'",
              attitudeBadge: '😏 Arzu Sözü'
            }),
            new CompanionChoice({
              id: 'lyra_k2_r5_c3',
              choiceSummary: 'Avucuna küçük bir altın hatıra bırak.',
              playerSpeechText: 'Bu madalyon sende kalsın. Birbirimizi daima hatırlayalım.',
              narrativeResponse: "Madalyonu göğsüne bastırır: 'Bunu kalbimin üzerinde saklayacağım. Şimdilik iyi geceler.'",
              attitudeBadge: '🪙 Hatıra Bağı'
            })
          ]
        })
      ],
      conclusionFarewell: 'Lyra gecenin karanlığına karışırken arkasında bıraktığı sıcaklık ve sözler odada yankılanır. İkinci kademe tamamlanmış, aranızdaki bağ güçlü bir arzu ve güvenle mühürlenmiştir.'
    });
  },

  // =========================================================================
  // KADEME 3: Tehlikeli Yakınlaşma & Gece Fısıltıları
  // =========================================================================
  createKademe3() {
    return new CompanionKademe({
      kademeLevel: 3,
      kademeTitle: 'Tehlikeli Yakınlaşma & Gece Fısıltıları',
      introAmbiance: 'Üçüncü ziyarette oda sadece kandillerle değil, zemine serilmiş gül yapraklarıyla ve sedire çekilmiş koyu mor ipeklerle donatılmıştır. Lyra üzerinde sadece ince siyah bir tül gecelikle sedirde uzanmaktadır; hançerleri uzakta sehpada durmaktadır.',
      rounds: [
        new CompanionRound({
          roundNumber: 1,
          roundTitle: 'Silahsız Bir Gölge',
          roundPrompt: "Lyra hançerlerinin durduğu sehpaya işaret etti: 'Görüyor musun? Bu gece silahlarımı uzağa koydum. Bir suikastçı için silahsız kalmak ölüme davetiye çıkarmaktır... Ama senin yanında kendimi savunmaya ihtiyacım yok.'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k3_r1_c1',
              choiceSummary: 'En büyük silahın senin bu karşı konulmaz caziben de.',
              playerSpeechText: 'Çeliğe ihtiyacın yok Lyra. Bir bakışınla hisarın en kudretli şövalyelerini dize getirebilirsin.',
              narrativeResponse: "Dudaklarını ısırarak sana doğru uzanır: 'Bütün şövalyeler umurumda değil... Ben sadece tek bir savaşçıyı dize getirmek istiyorum. O da sensin.'",
              attitudeBadge: '🔥 Yakıcı İtiraf'
            }),
            new CompanionChoice({
              id: 'lyra_k3_r1_c2',
              choiceSummary: 'Ben buradayken seni dünyadaki her şeyden korurum de.',
              playerSpeechText: 'Silahsız olabilirsin, çünkü senin kalkanın ve kılıcın bundan böyle benim.',
              narrativeResponse: "Gözleri buğulanır, elini uzatıp parmaklarını yakalar: 'Bunu duymak o kadar güzel ki... Yıllarca sadece kendime güvenerek yaşadım. Şimdi sana sığınmak beni büyülüyor.'",
              attitudeBadge: '🛡️ Mutlak Koruma'
            }),
            new CompanionChoice({
              id: 'lyra_k3_r1_c3',
              choiceSummary: 'Yavaşça yanına uzanıp elini beline koy.',
              playerSpeechText: 'Bu gece sadece sen ve ben varız. Hiçbir tehlike bu odaya sızamaz.',
              narrativeResponse: "Vücudu dokunuşunla hafifçe gerilir, ardından bir kedi gibi kucağına doğru sokulur: 'Teni tenime değdiğinde tüm dünya sessizleşiyor.'",
              attitudeBadge: '🌸 Büyülü Temas'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 2,
          roundTitle: 'Peçenin Tamamen İnişi',
          roundPrompt: 'Lyra iki eliyle peçesinin ipek kurdelelerini tuttu ve yavaşça çözdü. Kumaş kayıp sedire düştü. Yüzü tamamen karşındaydı: biçimli dolgun dudakları, kalkık burnu, zümrüt yeşili iri gözleri ve pürüzsüz teniyle nefes kesici bir kadın duruyordu önünde.',
          choices: [
            new CompanionChoice({
              id: 'lyra_k3_r2_c1',
              choiceSummary: 'Nefesini tutarak ona hayranlıkla bak.',
              playerSpeechText: 'Tanrılar şahidim olsun... Hayatımda gördüğüm en büyüleyici kadınsın Lyra.',
              narrativeResponse: "Yanakları al al olur, utanarak kirpiklerini indirir: 'Gerçekten... Gerçekten beğendin mi? Yıllardır bu yüzü gölgelerin ardına sakladım... İlk kez bir erkeğin önünde böylesine açığım.'",
              attitudeBadge: '👑 Kusursuz Güzellik'
            }),
            new CompanionChoice({
              id: 'lyra_k3_r2_c2',
              choiceSummary: 'Parmak uçlarınla yüzünün hatlarını çiz.',
              playerSpeechText: 'Bu yüzü saklamak günah sayılırdı. Şimdi seni hafızamın en derin yerine kazıyorum.',
              narrativeResponse: "Gözlerini kapatıp dokunuşunun tadını çıkarır: 'Parmakların o kadar nazik ki... Sanki bir suikastçıya değil, narin bir çiçeğe dokunuyorsun.'",
              attitudeBadge: '✨ Dokunuşun Büyüsü'
            }),
            new CompanionChoice({
              id: 'lyra_k3_r2_c3',
              choiceSummary: 'Eğilip dudaklarına hafif bir buse kondur.',
              playerSpeechText: 'Bu dudaklar için canımı bile verebilirdim.',
              narrativeResponse: "Buse değdiğinde nefesi kesilir, ardından kollarını ensene sarıp öpücüğü daha da derinleştirir: 'Canını değil, bu gece kalbini ver bana...'",
              attitudeBadge: '💋 İlk Dudak Teması'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 3,
          roundTitle: 'Tenin Sıcaklığı',
          roundPrompt: "Lyra üzerindeki ince tülün omuz askılarını hafifçe aşağı indirdi; köprücük kemikleri ve pürüzsüz omuzları odanın kandil ışığında parıldadı: 'Bana dokun silahşör... Ellerinin sıcaklığını tüm bedenimde hissetmek istiyorum.'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k3_r3_c1',
              choiceSummary: 'Omuzlarını okşayıp boynuna öpücükler kondur.',
              playerSpeechText: 'Tenin ipekten bile daha yumuşak Lyra...',
              narrativeResponse: "Başını geriye atar, gerdanını tamamen sana açar; ağzından boğuk bir inilti dökülür: 'Ah... Dokunuşların içimdeki ateşi körüklüyor...'",
              attitudeBadge: '🔥 Tutkulu Dokunuş'
            }),
            new CompanionChoice({
              id: 'lyra_k3_r3_c2',
              choiceSummary: 'Beline sarılarak onu kucağına çek.',
              playerSpeechText: 'Seni bu gece bir an olsun bırakmayacağım.',
              narrativeResponse: "Bacaklarını beline dolayıp göğsünü göğsüne bastırır; kalbinin deli gibi çarptığını hissedebilirsin: 'Bırakma... Hiç bırakma beni.'",
              attitudeBadge: '🌪️ Sarmalayan Arzu'
            }),
            new CompanionChoice({
              id: 'lyra_k3_r3_c3',
              choiceSummary: 'Gözlerinin içine bakarak aşk sözleri fısılda.',
              playerSpeechText: 'Sen benim gecemin tek yıldızısın Lyra.',
              narrativeResponse: "Zümrüt gözleri yaşarır: 'Bana hiç kimse böyle bakmadı... Sen benim sadece tenimi değil, ruhumu da fethettin.'",
              attitudeBadge: '💖 Ruhsal Bağ'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 4,
          roundTitle: 'Korkuların Erimesi',
          roundPrompt: "Nefes nefese birbirinize sokulmuşken Lyra fısıldadı: 'Eğer bir gün bu hisardan gidersen... Beni burada, bu karanlık dehlizlerde bırakıp gitmenden çok korkuyorum. Bana söz ver... Beni terk etmeyeceksin.'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k3_r4_c1',
              choiceSummary: 'Gittiğim her yere seni de götüreceğime and içerim de.',
              playerSpeechText: 'Kendi karargahımı, kendi kalemi kurduğum gün yanımdaki kadın sen olacaksın Lyra. Andım olsun.',
              narrativeResponse: "Sımsıkı sarılır, yüzünü boynuna gömerek ağlar gibi fısıldar: 'Bu sözün için dünyayı karşıma alırım... Senin için her şeyi yaparım.'",
              attitudeBadge: '⚔️ Ebedi Sadakat'
            }),
            new CompanionChoice({
              id: 'lyra_k3_r4_c2',
              choiceSummary: 'Biz birbirimize bağlandık, kaderimiz bir de.',
              playerSpeechText: 'Biz aynı hamurdan yoğrulduk. Seni bu bataklıkta bırakmam imkansız.',
              narrativeResponse: "Elini kalbine koyar: 'Kaderimiz bir... Bunu artık iliklerime kadar hissediyorum.'",
              attitudeBadge: '✨ Kader Birliği'
            }),
            new CompanionChoice({
              id: 'lyra_k3_r4_c3',
              choiceSummary: 'Korkularını öpücüklerle dindir.',
              playerSpeechText: 'Korkma güzelim. Bu kollar seni daima sarıp sarmalayacak.',
              narrativeResponse: "Dudaklarına uzanır, öpüşleriniz arasında huzurla nefes alır: 'Senin yanındayken hiçbir şeyden korkmuyorum artık.'",
              attitudeBadge: '🌸 Şefkat Sarmalı'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 5,
          roundTitle: 'Gecenin Sonu & Beklenti',
          roundPrompt: "Gece sona ererken Lyra güçlükle üzerindeki tülü düzeltti. Gözlerinde derin bir tutku ve ayrılmanın hüznü vardı: 'Bu gece neredeyse kendimi tamamen sana teslim ediyordum... Ama bir dahaki sefere hiçbir sınır kalmayacak. Bana söz ver, çok bekletmeyeceksin.'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k3_r5_c1',
              choiceSummary: 'En kısa zamanda döneceğime söz veriyorum de.',
              playerSpeechText: 'İlk fırsatta kapını çalacağım Lyra. Hazır ol.',
              narrativeResponse: "Parmak uçlarında yükselip dudaklarını öper: 'Her an seni bekliyor olacağım sevgilim.'",
              attitudeBadge: '🔥 Sabırsız Bekleyiş'
            }),
            new CompanionChoice({
              id: 'lyra_k3_r5_c2',
              choiceSummary: 'Bir dahaki sefere sınırları tamamen yıkacağız de.',
              playerSpeechText: 'Gelecek gelişimde aramızda hiçbir örtü, hiçbir perde kalmayacak.',
              narrativeResponse: "Yüzü kızarır ama cesurca gözlerinin içine bakar: 'Ben de tam olarak bunu istiyorum...' ",
              attitudeBadge: '😏 Vuslat Andı'
            }),
            new CompanionChoice({
              id: 'lyra_k3_r5_c3',
              choiceSummary: 'Saçlarını okşayıp ona güç ver.',
              playerSpeechText: 'Dinlen güzelim. Gece bizim olacak.',
              narrativeResponse: "Gülümseyerek kapıdan süzülür: 'Rüyalarımda bile seni göreceğim.'",
              attitudeBadge: '🌹 Sıcak Veda'
            })
          ]
        })
      ],
      conclusionFarewell: 'Lyra kapıdan çıkarken son bir kez dönüp sana bakar. Üçüncü kademe geride kalmış, aranızdaki tensel ve duygusal bağ zirveye bir adım daha yaklaşmıştır.'
    });
  },

  // =========================================================================
  // KADEME 4: Soyunan Gölgeler & Kalbin Teslimiyeti
  // =========================================================================
  createKademe4() {
    return new CompanionKademe({
      kademeLevel: 4,
      kademeTitle: 'Soyunan Gölgeler & Kalbin Teslimiyeti',
      introAmbiance: 'Dördüncü ziyarette oda sıcak bir buhur ve yasemin yağı kokusuyla dolmuştur. Lyra kapıyı ardınızdan kilitler. Üzerinde sadece transparan siyah ipek bir şal vardır; peçesi yoktur. Gözlerinde ne bir kuşku ne bir korku kalmıştır; yalnızca aşktan ve arzudan yanan bir kadının kararlılığı parlamaktadır.',
      rounds: [
        new CompanionRound({
          roundNumber: 1,
          roundTitle: 'Kilitli Kapılar',
          roundPrompt: "Lyra anahtarı masaya bıraktı ve arkasını kapıya yasladı: 'Bu gece Madam Lysandra dahil hiç kimse bu kapıyı açamaz. Bu gece burada sadece iki yabancı değil, birbirine ait iki ruh var. Hazır mısın silahşör?'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k4_r1_c1',
              choiceSummary: 'Sana tüm varlığımla hazırım Lyra de.',
              playerSpeechText: 'Bu kapının ardında dünya yıkılsa umurumda değil. Ben sadece seni istiyorum.',
              narrativeResponse: "Yavaşça sana doğru yürür, kalça kıvrımları ipek şalın altından büyüleyici bir ahenkle dalgalanır: 'O zaman gel ve beni al...'",
              attitudeBadge: '🔥 Mutlak Kararlılık'
            }),
            new CompanionChoice({
              id: 'lyra_k4_r1_c2',
              choiceSummary: 'Yavaşça yanına gidip onu kapıya doğru yasla.',
              playerSpeechText: 'Beni bu kapının ardında hapsettiğin için teşekkür ederim güzelim.',
              narrativeResponse: "Göğsü hızla inip kalkar, kollarını omzuna sarar: 'Sen benim mahkumum değil, benim kurtarıcımsın.'",
              attitudeBadge: '🏹 Tutkulu Kuşatma'
            }),
            new CompanionChoice({
              id: 'lyra_k4_r1_c3',
              choiceSummary: 'Gözlerine bakarak onu kucağına al.',
              playerSpeechText: 'Sözlerin kalbimi ateşe veriyor. Yatağa gidelim.',
              narrativeResponse: "Onu kucağına aldığında hafifçe kıkırdar, başını boynuna gömer: 'Beni istediğin yere götür, nereye gidersen orası benim cennetim.'",
              attitudeBadge: '🌸 Büyüleyici Teslimiyet'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 2,
          roundTitle: 'İpeklerin Çözülüşü',
          roundPrompt: "Sedire oturduğunuzda Lyra ellerini göğsüne koydu ve senin gömleğinin düğmelerini tek tek çözmeye başladı: 'Senin bu kaslı, yaralı göğsünü her gördüğümde içimde bir fırtına kopuyor. Şimdi sıra bende...'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k4_r2_c1',
              choiceSummary: 'Sen de onun omzundaki şalı yavaşça sıyır.',
              playerSpeechText: 'İzin ver o ipekler aramızdan çekilsin Lyra...',
              narrativeResponse: "Şal omuzlarından kayıp yere düşer. Çıplak göğsü, narin bel kıvrımları ve pürüzsüz teni tamamen açığa çıkar; nefesi kesilerek sana sokulur: 'Bütün varlığım senin...'",
              attitudeBadge: '💋 Çıplak Hakikat'
            }),
            new CompanionChoice({
              id: 'lyra_k4_r2_c2',
              choiceSummary: 'Ellerini ellerinin üzerine koyup onu yönlendir.',
              playerSpeechText: 'Her dokunuşun beni deli ediyor güzelim.',
              narrativeResponse: "Parmaklarını göğsünün üzerinde gezdirirken titrer: 'Ben de delirmek üzereyim... Bu hararet beni kül edecek.'",
              attitudeBadge: '🔥 Karşılıklı Arzu'
            }),
            new CompanionChoice({
              id: 'lyra_k4_r2_c3',
              choiceSummary: 'Eğilip göğsünün ortasındaki çukuru öp.',
              playerSpeechText: 'Teninin kokusu dünyanın en nadide çiçeğinden bile güzel.',
              narrativeResponse: "Başını geriye atar, tırnaklarını kollarına batırır: 'Ah... Daha fazla bekletme beni...'",
              attitudeBadge: '🌹 Tensel Coşku'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 3,
          roundTitle: 'Yasak Aşkın Yemini',
          roundPrompt: "Tenleriniz birbirine yapışmışken Lyra fısıldadı: 'Gece Loncası aşık olan bir suikastçıyı ölü kabul eder. Ben bu gece onların gözünde ölüyorum silahşör... Ama senin kollarında yeniden doğuyorum. Beni daima böyle sevecek misin?'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k4_r3_c1',
              choiceSummary: 'Seni son nefesime kadar seveceğime and içerim de.',
              playerSpeechText: 'Senin için dünyayı yakarım Lyra. Hiçbir lonca, hiçbir kural seni benden koparamaz.',
              narrativeResponse: "Gözlerinden mutluluk yaşları süzülür, dudaklarını öper: 'Artık hiçbir şeyden korkmuyorum. Senin sevgin benim tek zırhım.'",
              attitudeBadge: '⚔️ Sarsılmaz Ant'
            }),
            new CompanionChoice({
              id: 'lyra_k4_r3_c2',
              choiceSummary: 'Sen benim gecemin kraliçesisin de.',
              playerSpeechText: 'Sen sıradan bir suikastçı değilsin, kalbimin hükümdarısın.',
              narrativeResponse: "Gülümseyerek seni yatağa çeker: 'O halde kraliçene layık bir kral gibi davran bana...'",
              attitudeBadge: '👑 Asil Aşk'
            }),
            new CompanionChoice({
              id: 'lyra_k4_r3_c3',
              choiceSummary: 'Dudaklarına sımsıkı yapışarak konuşmasına izin verme.',
              playerSpeechText: 'Sözlerin bittiği yerdeyiz güzelim...',
              narrativeResponse: 'Öpüşünle nefesi kesilir, tüm vücudu kollarında titreyerek gevşer ve teslim olur.',
              attitudeBadge: '💋 Tutkulu Susturuş'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 4,
          roundTitle: 'Eşiğin Kıyısında',
          roundPrompt: "Çarşafların üzerinde birbirine kenetlenmiş iki çıplak beden gibi soluk soluğa uzanıyordunuz. Lyra elini yüzünde gezdirdi: 'Bir adım kaldı... Bir sonraki buluşmamızda, artık geri dönüşü olmayan o büyük vuslata ereceğiz. Ruhlarımızın tamamen birleştiği o ana hazır mısın?'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k4_r4_c1',
              choiceSummary: 'O an için sabırsızlanıyorum de.',
              playerSpeechText: 'O gün geldiğinde hayatımızın en unutulmaz gecesini yaşayacağız Lyra.',
              narrativeResponse: "Gözleri arzuyla buğulanır: 'Ben de o gece için yanıp tutuşuyorum sevgilim.'",
              attitudeBadge: '🔥 Büyük Beklenti'
            }),
            new CompanionChoice({
              id: 'lyra_k4_r4_c2',
              choiceSummary: 'Seninle her ana, her adıma hazırım de.',
              playerSpeechText: 'Seninle sonsuzluğa yürümeye hazırım güzelim.',
              narrativeResponse: "Göğsüne sokulur, kalbinin sesini dinler: 'Sen benim her şeyimsin.'",
              attitudeBadge: '💖 Sonsuz Teslimiyet'
            }),
            new CompanionChoice({
              id: 'lyra_k4_r4_c3',
              choiceSummary: 'Alnından öperek ona huzur ver.',
              playerSpeechText: 'O gece ikimiz için de kutsal olacak.',
              narrativeResponse: "Huzurla gözlerini yumar: 'Kutsal ve unutulmaz...'",
              attitudeBadge: '🌸 Kutsal Temas'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 5,
          roundTitle: 'Dördüncü Perdenin Kapanışı',
          roundPrompt: "Şafak sökmek üzereydi. Lyra güçlükle yataktan kalkıp ipek şalına sarındı. Kapıyı açmadan önce dönüp sana derin, aşk dolu bir tebessümle baktı: 'Son adım kaldı silahşör... Bir dahaki sefere köşkün zirvesinde, sonsuz bir bağla birleşeceğiz.'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k4_r5_c1',
              choiceSummary: 'Çok bekletmeyeceğim sevgilim de.',
              playerSpeechText: 'Altınları hazırlayıp en kısa sürede geleceğim. Zirve bizim olacak.',
              narrativeResponse: "Dudaklarına sıcak bir öpücük bırakır: 'Seni bekliyor olacağım sevgilim.'",
              attitudeBadge: '👑 Zirveye Doğru'
            }),
            new CompanionChoice({
              id: 'lyra_k4_r5_c2',
              choiceSummary: 'Gözlerini bir an olsun aklımdan çıkarmayacağım de.',
              playerSpeechText: 'Bu geceki bakışların arenada bana güç verecek.',
              narrativeResponse: "Göz kırpar: 'Benim için kazan silahşör... Dönüşünü sabırsızlıkla bekleyeceğim.'",
              attitudeBadge: '⚔️ Arenanın İlhamı'
            }),
            new CompanionChoice({
              id: 'lyra_k4_r5_c3',
              choiceSummary: 'Elini tutup kalbine bastır.',
              playerSpeechText: 'Kalbim daima seninle atacak.',
              narrativeResponse: "Elini öpüp odadan süzülür: 'Ve benimki de seninle...'",
              attitudeBadge: '💖 Mühürlü Kalp'
            })
          ]
        })
      ],
      conclusionFarewell: "Lyra odadan ayrılırken bıraktığı derin aşk ve vuslat vaadi odayı doldurur. Dördüncü kademe tamamlanmış, artık son durak olan Büyük Vuslat'ın (5. Kademe) kapısı aralanmıştır."
    });
  },

  // =========================================================================
  // KADEME 5: Karanlığın İçinde Büyük Vuslat & Sonsuz Bağ
  // =========================================================================
  createKademe5() {
    return new CompanionKademe({
      kademeLevel: 5,
      kademeTitle: 'Karanlığın İçinde Büyük Vuslat & Sonsuz Bağ',
      introAmbiance: 'Köşkün en mahrem odası kırmızı mumlar, gül yaprakları ve amber tütsüleriyle donatılmıştır. Lyra üzerinde hiçbir örtü olmadan, sadece şeffaf siyah bir dantelle seni beklemektedir. Yüzü tamamen açıktır; gözlerinde hayatında ilk kez gördüğün saf, engelsiz ve yakıcı bir aşk ateşi vardır.',
      rounds: [
        new CompanionRound({
          roundNumber: 1,
          roundTitle: 'Ebedi Eşik',
          roundPrompt: "Lyra sedirden kalkıp çıplak ayaklarıyla sana doğru yürüdü. Elleri titreyerek kollarını boynuna doladı: 'Geldin... Bütün engelleri aştın ve bana geldin silahşör. Bu gece artık hiçbir kelimeye, hiçbir saklambaça gerek yok. Ben tamamen seninim.'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k5_r1_c1',
              choiceSummary: 'Ve ben de tamamen seninim Lyra de.',
              playerSpeechText: 'Bedenim, ruhum ve kılıcım... Hepsi bu gece senin ayaklarının altına serildi güzelim.',
              narrativeResponse: "Gözlerinden süzülen bir damla yaşı senin yanağına sürer: 'Bunu duymak için bütün hayatım boyunca karanlıkta beklemişim meğer...'",
              attitudeBadge: '👑 Ebedi Birleşme'
            }),
            new CompanionChoice({
              id: 'lyra_k5_r1_c2',
              choiceSummary: 'Onu kollarının arasına alıp ayaklarını yerden kes.',
              playerSpeechText: 'Bu gece zaman duracak Lyra. Sadece biz varız.',
              narrativeResponse: "Bacaklarını beline dolayıp boynuna sarılır: 'Durmasın zaman... Birlikte yanalım bu yangında.'",
              attitudeBadge: '🔥 Alevlerin Dansı'
            }),
            new CompanionChoice({
              id: 'lyra_k5_r1_c3',
              choiceSummary: 'Dudaklarına derin, yakıcı bir öpücük kondur.',
              playerSpeechText: 'Sözler tükendi sevgilim...',
              narrativeResponse: 'Dudaklarınız birleştiğinde tüm oda bir alev topuna döner gibi olur; nefesler birbirine karışır.',
              attitudeBadge: '💋 Tutkunun Zirvesi'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 2,
          roundTitle: 'Tenin Ritmi',
          roundPrompt: "Yatağın ipek çarşaflarına uzandığınızda Lyra'nın narin bedeni kollarında dalgalandı. Parmakların teninde dolaşırken nefesi hızlandı: 'Bana öyle dokunuyorsun ki... İçimdeki bütün suikastçı ölüyor, geriye sadece sana aşık çıplak bir kadın kalıyor.'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k5_r2_c1',
              choiceSummary: 'O kadını ömrümün sonuna kadar seveceğim de.',
              playerSpeechText: 'O kadın benim dünyamın en değerli hazinesi.',
              narrativeResponse: "Tırnaklarını sırtına batırarak seni kendine daha da çeker: 'Al beni... Hiçbir parçamı bırakma.'",
              attitudeBadge: '💖 Sonsuz Bağ'
            }),
            new CompanionChoice({
              id: 'lyra_k5_r2_c2',
              choiceSummary: 'Boynundan başlayarak göğsüne doğru öpücükler yağdır.',
              playerSpeechText: 'Teninin her santimini fethedeceğim.',
              narrativeResponse: "Başını geriye atarak haz dolu bir inilti koyverir: 'Evet... Her yerim senin olsun...'",
              attitudeBadge: '🔥 Yakıcı Haz'
            }),
            new CompanionChoice({
              id: 'lyra_k5_r2_c3',
              choiceSummary: 'Gözlerinin içine bakarak aşkını fısılda.',
              playerSpeechText: 'Seni seviyorum Lyra. Gölgelerinden ve ışığından daha çok.',
              narrativeResponse: "Gözleri yaşarır, dudaklarını öper: 'Ben de seni seviyorum... Hayatımda ilk kez birine bunu söylüyorum.'",
              attitudeBadge: '🌸 İlk İtiraf'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 3,
          roundTitle: 'Yangının Büyüyüşü',
          roundPrompt: "Tenlerin birbirine sürtünüşü, nefeslerin ritmi ve odadaki şöminenin alevleri tek bir kasırgaya dönüştü. Lyra seni sımsıkı sardı: 'Daha sert sarıl bana... Bedenlerimiz tek bir et, tek bir kemik olana kadar sarıl!'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k5_r3_c1',
              choiceSummary: 'Onu kollarında sımsıkı ezerek öp.',
              playerSpeechText: 'Bize ölüm bile ayıramayacak güzelim.',
              narrativeResponse: 'Bütün gücüyle sana karşılık verir; vücudu kollarında elektrik çarpmış gibi titrer.',
              attitudeBadge: '🌪️ Kasırganın Kalbi'
            }),
            new CompanionChoice({
              id: 'lyra_k5_r3_c2',
              choiceSummary: 'Ritmik ve derin darbelerle aranızdaki ateşi körükle.',
              playerSpeechText: 'Bu gece ikimiz de doruklara çıkacağız.',
              narrativeResponse: "Boğazından kesik kesik haz çığlıkları dökülür; tırnakları sırtında izler bırakır: 'Daha... Daha fazla...'",
              attitudeBadge: '🔥 Doruk Ateşi'
            }),
            new CompanionChoice({
              id: 'lyra_k5_r3_c3',
              choiceSummary: 'Terli alnını alnına daya ve nefesini içine çek.',
              playerSpeechText: 'Nefesimiz bir oldu Lyra...',
              narrativeResponse: "Gözlerini gözlerine kenetler: 'Ruhumuz da bir oldu sevgilim...'",
              attitudeBadge: '✨ Ruhsal Kenetlenme'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 4,
          roundTitle: 'Doruk Noktası',
          roundPrompt: "Odanın sıcaklığı dayanılmaz bir seviyeye ulaşmıştı. Lyra bacaklarını sırtına kenetledi, gözleri şehvet ve aşkın buğusuyla parıldayarak haykırdı: 'Geliyor... Fırtına kopuyor silahşör! Benimle birlikte gel!'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k5_r4_c1',
              choiceSummary: 'Onunla birlikte doruk noktasına ulaş.',
              playerSpeechText: 'Seninleyim Lyra! Sonsuza kadar!',
              narrativeResponse: 'Bedenleriniz aynı saniyede sarsıcı bir titremeyle kenetlendi; odanın duvarlarında yankılanan haz çığlığıyla birlikte vuslat tamamlandı.',
              attitudeBadge: '💥 Büyük Patlama'
            }),
            new CompanionChoice({
              id: 'lyra_k5_r4_c2',
              choiceSummary: 'Dudaklarını dudaklarına gömerek haykırışını içine çek.',
              playerSpeechText: 'Her şeyim senindir!',
              narrativeResponse: 'Dudaklarınız kenetli halde iki beden tek bir kalp gibi çarparak çarşafların arasına yığıldı.',
              attitudeBadge: '💋 Kenetli Zafer'
            }),
            new CompanionChoice({
              id: 'lyra_k5_r4_c3',
              choiceSummary: 'Onu kollarında sarıp sarmalayarak doruğu yaşa.',
              playerSpeechText: 'Biz kazandık sevgilim...',
              narrativeResponse: "Lyra'nın bedeni kollarında gevşedi, yüzünde mest olmuş muzaffer bir tebessüm belirdi.",
              attitudeBadge: '👑 Ebedi Zafer'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 5,
          roundTitle: 'Büyük Vuslatın Mührü',
          roundPrompt: "Nefes nefese birbirinize sarılmış halde yatarken Lyra başını göğsüne koydu. Sessizce atan kalbini dinledi ve fısıldadı: 'Artık hiçbir şey eskisi gibi olmayacak... Ben senin kadınınım. Ve sen benim efendim, sevgilim ve kaderimsin.'",
          choices: [
            new CompanionChoice({
              id: 'lyra_k5_r5_c1',
              choiceSummary: 'Alnına şefkatle bir buse kondur.',
              playerSpeechText: 'Bu gece kurulan bağ ebedidir Lyra. Seni asla bırakmayacağım.',
              narrativeResponse: "Huzurla gözlerini kapar ve göğsüne sokulur: 'Biliyorum... Artık evimdeyim.'",
              attitudeBadge: '🌹 Sonsuz Huzur'
            }),
            new CompanionChoice({
              id: 'lyra_k5_r5_c2',
              choiceSummary: 'Saçlarını okşayarak geleceğinizi planla.',
              playerSpeechText: 'Kuracağım kalede en yüksek kule senin olacak.',
              narrativeResponse: "Gülümser: 'Kule değil, senin yatağın neresiyse benim yerim orasıdır.'",
              attitudeBadge: '🏰 Kale İttifakı'
            }),
            new CompanionChoice({
              id: 'lyra_k5_r5_c3',
              choiceSummary: 'Sımsıkı sarılarak uykuya dal.',
              playerSpeechText: 'Uyu güzelim... Şafak bize yeni bir hayat getirecek.',
              narrativeResponse: 'Derin ve huzurlu bir nefes alarak kollarında uykuya dalar.',
              attitudeBadge: '🌙 Ebedi Gece'
            })
          ]
        })
      ],
      conclusionFarewell: 'Gölge Dansçısı Lyra ile yaşanan büyük vuslat tamamlandı. Aranızdaki bağ artık ZİRVE noktasına ulaştı. Lyra ömrünün sonuna kadar senin yoldaşın ve sevgilin oldu.'
    });
  },
};

