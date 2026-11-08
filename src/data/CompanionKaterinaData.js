import * as kt from '../kt.js';
import { CompanionChoice, CompanionCulmination, CompanionData, CompanionKademe, CompanionRound } from '../domain/model.js';

export const CompanionKaterinaData = {
  createKaterinaData() {
    return new CompanionData({
      id: 'fighter_katerina',
      name: 'Katerina',
      title: 'Buzul Muhafızı',
      avatarIcon: '',
      salonTier: 2,
      salonName: 'Yeşim & İpek Mabedi',
      geographicOrigin: 'Uzak Kuzey Buzulları & Yüksek Ayaz Sancağı',
      appearanceSnippet: 'Buz mavisi ipek kaftanının altından fildişi beyazlığındaki zarif omuzları ve asil boynu görünür. Ağır donuk kalkanını ve safir işlemeli mızrağını şöminenin yanındaki sehpaya dayamış; açık gümüş sarısı saçları omuzlarına dökülürken, bir kraliçe kadar mesafeli ama derinliklerinde yakıcı bir merak barındıran safir mavisi gözleriyle seni süzer.',
      kademeler: [
        CompanionKaterinaData.createKademe1(),
        CompanionKaterinaData.createKademe2(),
        CompanionKaterinaData.createKademe3(),
        CompanionKaterinaData.createKademe4(),
        CompanionKaterinaData.createKademe5()
      ],
      culmination: new CompanionCulmination({
        title: 'Buzul Muhafızının Yakıcı Vuslatı',
        prelude: "Dışarıda Taş Hisar'ın dondurucu gece rüzgarı surları döverken, Yeşim Mabedi'nin kalın kürklerle döşeli geniş sedirinde şöminenin alevleri fildişi teni kızıla boyuyordu. Katerina, buz mavisi kaftanını omuzlarından kaydırdığında, kuzeyin gururlu kraliçesi ilk defa tüm unvanlarını ve zırhlarını bir kenara bırakmış, safir gözlerinde eriyen bir lavın sıcaklığıyla sana bakıyordu.",
        passionNarrative: [
          "Katerina'nın serin ve pürüzsüz teni, parmaklarının her temasında alev almış bir çelik gibi titriyor, ardından derin bir teslimiyetle eriyordu. Uzun boylu, mızrak talimleriyle biçimlenmiş asil vücudu kollarının arasında kıvrılırken, dudaklarından dökülen boğuk nefesler şöminenin çıtırtısına karışıyordu: 'Kuzeyin buzulları kalbimi bir zindan gibi sarmıştı... Ama senin dokunuşun o buzları eriten tek yangın oldu silahşör...'",
          "Ellerini senin ensene ve sırtına kenetlediğinde, kalkan tutan güçlü ama narin parmakları etine gömüldü. Başını geriye atarak gümüş sarısı saçlarını kürk yastıklara savurduğunda, gerdanının kusursuz kavisini öpücüklerinle ateşe verdin. Katerina'nın safir gözleri arzu ve hazzın buğusuyla yarı kapalıydı; dudakları her birleşmede adını fısıldıyor, 'Daha sıkı sarıl bana... Kuzeyin kışı içimden tamamen silinsin...' diye inliyordu.",
          "Kürklerin üzerinde yükselen ritim, donmuş bozkırların en görkemli tipi fırtınasını aratmayacak bir tutkuya dönüştü. İki savaşçının gurur ve arzuyla kenetlenen bedenleri, ne soyluluk ne de sürgün tanıyan kadim bir dille birbirine aktı. Katerina'nın uzun bacakları sırtını sararken, göğsü göğsüne hızla çarpıyor, boğazından kopan asil ama dizginlenemez haz çığlığı odanın yeşim sütunlarında yankılanıyordu.",
          "Nefes nefese, kalpleri tek bir zırhın ardında atıyormuşçasına birbirlerine sokulmuş halde kürklerin arasına yığıldılar. Katerina'nın yüzündeki o aşılmaz, soğuk mağrurluk tamamen silinmiş; yerini huzur dolu, derin ve aşık bir dinginliğe bırakmıştı. Başını senin omzuna yasladı; terli saçlarını şefkatle okşarken parmakları göğsündeki mızrak izini usulca takip ediyordu."
        ],
        morningAfterNarrative: 'Şafak Taş Hisar\'ın karlı mazgallarını kızıla boyarken Katerina kollarında uyanmıştı. Safir gözleriyle sana hayranlıkla baktı; üzerindeki beyaz tilki kürkünü göğsüne çekerken gururlu dudaklarında sıcacık bir tebessüm belirdi:\n\n"Kuzey topraklarında doğdum, buzullar arasında büyüdüm silahşör... Fakat ilk kez bu gece bir erkeğin yanında gerçekten ısındığımı ve tamamlandığımı hissettim. Mızrağım ve kalbim artık sadece sana aittir."',
        buffRewardTitle: 'Buzulun Kalbi & Aşılmaz Savunma',
        buffRewardDescription: 'Katerina ile yaşanan unutulmaz vuslat ruhunu ve bedenini çelikleştirdi: 5 maç boyunca +%15 Bloklama Şansı, +8 Zırh ve +60 Maksimum Can!',
        futureBasePledge: 'Katerina safir işlemeli mızrağını iki eliyle göğsüne bastırıp diz çöktü: "Kendi sancağını dikip kaleni kurduğun gün, Taş Hisar\'ın kapılarını ardımda bırakıp senin surlarına geleceğim. Senin kalkan duvarın, senin kalenin en sadık muhafızı olacağıma kuzeyin kadim buzları üzerine and içerim!"'
      })
    });
  },

  // =========================================================================
  // KADEME 1: Kuzeyin Soğukluğu & Asil Tanışma
  // =========================================================================
  createKademe1() {
    return new CompanionKademe({
      kademeLevel: 1,
      kademeTitle: 'Kuzeyin Soğukluğu & Asil Tanışma',
      introAmbiance: "Yeşim Mabedi'nin yüksek tavanlı salonunda ardıç ağacı ve kar suyu tütsüsü tütüyor. Katerina pencerenin kenarında dimdik ayakta durmuş, uzak dağların karlı zirvelerini izliyor. Seni fark ettiğinde yavaşça dönüyor; duruşunda bir muhafız komutanının disiplini ve asil kanın getirdiği mesafe var.",
      rounds: [
        new CompanionRound({
          roundNumber: 1,
          roundTitle: 'Ayaz Bakışlar',
          roundPrompt: "Katerina safir mavisi gözlerini sana dikti. Sesi bir buz sarkıtı kadar berrak ve netti: 'Yeşim Mabedi'ne 5.000 altın döküp huzuruma çıkacak kadar cüretkar bir savaşçısın. Fakat beni bu hisarın sıradan zevk düşkünü kadınlarıyla karıştırma. Buraya neden geldin silahşör?'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k1_r1_c1',
              choiceSummary: 'Kuzeyin aşılmaz surunun ardındaki kalbi görmek için geldim de.',
              playerSpeechText: 'Arenadaki kalkanın aşılmaz bir dağ gibi Katerina. Ama ben o çeliğin ardında yaşayan kadını tanımaya geldim.',
              narrativeResponse: "Katerina kaşlarını hafifçe kaldırır. Bakışlarındaki soğuk zırh hafifçe çatlar: 'Çeliğin ardındaki kadın mı? Çoğu adam mızrağımın ucundan başka bir şey görmeye cesaret edemez. Sözlerin iddialı.'",
              attitudeBadge: 'Asil Merak'
            }),
            new CompanionChoice({
              id: 'katerina_k1_r1_c2',
              choiceSummary: 'Dengi olan bir savaşçıyla kadeh kaldırmak için geldim de.',
              playerSpeechText: 'Bu hisarda kaba kuvvet çok ama onur ve zarafet az. Karşımda gerçek bir savaşçı görmek istedim.',
              narrativeResponse: "Dudaklarında belli belirsiz bir tebessüm kıvrılır: 'Onur... Taş Hisar'da bu kelimeyi duymayalı çok olmuştu. Belki de bu gece vaktimi boşa harcamayacağım.'",
              attitudeBadge: 'Savaşçı Onuru'
            }),
            new CompanionChoice({
              id: 'katerina_k1_r1_c3',
              choiceSummary: 'Gözlerinin soğukluğundaki yangını hissettim de.',
              playerSpeechText: 'O safir mavisi gözlerde sadece buz yok Katerina... Derinlerde bir yangın bekliyor.',
              narrativeResponse: "Gözlerini kısıp sana bir adım yaklaşır: 'Ateşle oynamak parmaklarını yakar silahşör. Kuzeyin ayazı seni dondurmadan önce dikkatli konuş.'",
              attitudeBadge: 'Tehlikeli Kıvılcım'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 2,
          roundTitle: 'Buzul Kalkanı',
          roundPrompt: "Katerina şöminenin yanındaki sehpada duran kalkanına dokundu: 'Bu kalkan kuzeyin granit kayalarından ve soğuk çeliğinden dövüldü. Yüzlerce mızrak ve ok darbesi aldı ama tek bir çatlak bile vermedi. Kalbim de tıpkı bu kalkan gibidir. Onu delebileceğini mi sanıyorsun?'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k1_r2_c1',
              choiceSummary: 'Kalkanlar kırmak için değil, korunmak için taşınır de.',
              playerSpeechText: 'Kalkanını parçalamak istemiyorum Katerina. İzin ver o kalkanı indirdiğinde yanında ben durayım.',
              narrativeResponse: "Kalkanı tutan parmakları gevşer. Bir anlığına bakışları yumuşar: 'Kalkanı indirmek... Bir muhafız için bu savunmasız kalmaktır. Ama sesindeki samimiyet tuhaf bir güven veriyor.'",
              attitudeBadge: 'Şefkatli Bilgelik'
            }),
            new CompanionChoice({
              id: 'katerina_k1_r2_c2',
              choiceSummary: 'En sert buz bile sabırlı bir ısıyla erir de.',
              playerSpeechText: 'Kılıçla vurmayacağım. Ama sabrım ve kararlılığımla o buzul duvarlarını eriteceğim.',
              narrativeResponse: "Kafasını yana eğer, safir gözleri parıldar: 'Sabır büyük bir erdemdir. Bakalım sözlerinin arkasında durabilecek misin.'",
              attitudeBadge: 'Eriyen Buz'
            }),
            new CompanionChoice({
              id: 'katerina_k1_r2_c3',
              choiceSummary: 'Benim kılıcım hisarın en sert zırhlarını yardı de.',
              playerSpeechText: 'Arenada beni izlemedin mi? Henüz önümde durabilen bir kalkan görmedim.',
              narrativeResponse: "Hafifçe alaycı bir tavırla güler: 'Kaba kuvvet arenada işe yarar silahşör. Ama bu salonda kasların değil, ruhunun büyüklüğü yarışır.'",
              attitudeBadge: 'Asil Eleştiri'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 3,
          roundTitle: 'Kuzey Şarabı',
          roundPrompt: "Katerina masadaki gümüş karafı alıp iki kadehe ardıç kokulu sert kuzey şarabı doldurdu: 'Bu şarap sıradan nar şırasına benzemez. Boğazı yakar, zihni berraklaştırır. Kuzeyliler kadehi sadece mert savaşçılarla kaldırır. Al bakalım.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k1_r3_c1',
              choiceSummary: 'Kadehi kaldırıp kuzeyin onurlu savaşçılarına iç.',
              playerSpeechText: "Kuzeyin karlı zirvelerine ve sürgünde bile başı dik duran Katerina'nın şerefine.",
              narrativeResponse: "Kadehini kadehinle tokuşturur. Çınlayan gümüş sesi odada yankılanır: 'Sürgünde bile başı dik... Beni anlayan birini bulmak şaşırtıcı. Şerefe.'",
              attitudeBadge: 'Asil Kadeh'
            }),
            new CompanionChoice({
              id: 'katerina_k1_r3_c2',
              choiceSummary: 'Kadehi tek yudumda bitirip gözünü bile kırpma.',
              playerSpeechText: 'Kuzeyin şarabı sertmiş, ama benim irademden daha sert değil.',
              narrativeResponse: "Yüzündeki soğukkanlılığı hayranlıkla süzer: 'Güçlü bir ciğer ve sağlam bir mide. Bir garnizon askerinden fazlasısın.'",
              attitudeBadge: 'Çelik İrade'
            }),
            new CompanionChoice({
              id: 'katerina_k1_r3_c3',
              choiceSummary: 'Kadehi dudaklarına götürürken eline hafifçe dokun.',
              playerSpeechText: 'Bu kadehi seninle paylaşmak en büyük ganimet.',
              narrativeResponse: "Parmaklarının temasıyla Katerina'nın elinde hafif bir ürperti geçer ama elini çekmez: 'Cüretkarsın silahşör... Çok cüretkar.'",
              attitudeBadge: 'Gizli Titreyiş'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 4,
          roundTitle: 'Sürgünün Ağırlığı',
          roundPrompt: "Katerina pencereye doğru bir adım attı, omuzlarındaki ipek kaftan hafifçe kıpırdadı: 'Yüksek Ayaz klanının baş muhafızıydım. Başkentteki lordların entrikaları yüzünden klanım dağıldı, ben de bu güney hisarına savruldum. Burada arenada dövüşmek benim için bir eğlence değil, onurumu ayakta tutma savaşıdır.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k1_r4_c1',
              choiceSummary: 'Onurunu geri kazanmanda sana yoldaş olacağımı söyle.',
              playerSpeechText: 'Ben de sürgün edildim Katerina. Nereden geldiğini ve ne hissettiğini çok iyi biliyorum. Yalnız değilsin.',
              narrativeResponse: "Yavaşça sana döner; gözlerinde ilk defa derin bir keder ve hemen ardından doğan bir bağ ışıltısı vardır: 'Demek sen de... Kader bizi aynı çukura fırlatmış. Belki de bu bir tesadüf değildir.'",
              attitudeBadge: 'Ortak Sürgün'
            }),
            new CompanionChoice({
              id: 'katerina_k1_r4_c2',
              choiceSummary: 'Lordların entrikaları senin değerini düşüremez de.',
              playerSpeechText: 'Taht odalarında entrika çeviren fareler senin gibi bir savaşçının çizmelerini temizlemeye bile layık değil.',
              narrativeResponse: "Gururla başını kaldırır: 'Aynen öyle! Bunu kimseden duymamıştım. Yüreğin temiz silahşör.'",
              attitudeBadge: 'Gururlu Yükseliş'
            }),
            new CompanionChoice({
              id: 'katerina_k1_r4_c3',
              choiceSummary: 'Bir gün kendi sancaklarını dikeceğiz de.',
              playerSpeechText: 'Bu hisarda kalıcı değiliz. Kendi kalemi kurduğumda, klanının sancağını en yüksek burca birlikte dikeceğiz.',
              narrativeResponse: "Nefesi kesilir, safir gözleri umutla parıldar: 'Kendi sancağımız... Bu hayal beni bile heyecanlandırıyor.'",
              attitudeBadge: 'Geleceğin Sancağı'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 5,
          roundTitle: 'Gecenin Vedası',
          roundPrompt: "Gece sona ermek üzereydi. Şöminenin közleri sönmeye yüz tutmuştu. Katerina mızrağını eline aldı, dimdik bir asker selamı verir gibi durdu ama gözlerindeki sıcaklık gizlenemiyordu: 'İlk karşılaşmamız sona erdi silahşör. Beklentilerimin çok üzerinde bir adam çıktın. Bir dahaki sefere daha hazırlıklı geleceğim.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k1_r5_c1',
              choiceSummary: 'Eğilip elinin tersini asilce öp.',
              playerSpeechText: 'Huzurunuzda olmak bir onurdu leydim Katerina. Gelecek ziyaretimi sabırsızlıkla bekleyeceğim.',
              narrativeResponse: "Parmaklarını dudaklarının arasında hafifçe tutar, yüzü hafifçe kızarır: 'Leydim mi... Bu unvanı unutmuştum. Hoşça kal silahşör.'",
              attitudeBadge: 'Asil Hürmet'
            }),
            new CompanionChoice({
              id: 'katerina_k1_r5_c2',
              choiceSummary: 'Bir dahaki sefere kalkanını tamamen indirteceğim de.',
              playerSpeechText: 'Bir sonraki gelişimde aramızda hiçbir soğukluk kalmayacak. Kendini hazırla.',
              narrativeResponse: "Mızrağının arkasını yere vurur: 'Bunu görmek isterim... Başarabilirsen seni ödüllendiririm.'",
              attitudeBadge: 'Meydan Okuma'
            }),
            new CompanionChoice({
              id: 'katerina_k1_r5_c3',
              choiceSummary: 'Kendine dikkat etmesini söyle.',
              playerSpeechText: 'Garnizondaki kaba muhafızlara dikkat et. Seni yeniden görmeyi dört gözle bekliyorum.',
              narrativeResponse: "Hafifçe gülümser: 'Benim mızrağım onlara fazla gelir merak etme. Kendine iyi bak.'",
              attitudeBadge: 'Şefkatli Veda'
            })
          ]
        })
      ],
      conclusionFarewell: "Katerina asil adımlarla Yeşim Mabedi'nin iç odalarına çekilir. Odada ardıç kokusu ve onun mağrur varlığının izi kalır. İlk kademe tamamlanmış, kuzeyin aşılmaz buzul kalkanında ilk sıcak çatlak oluşmuştur."
    });
  },

  // =========================================================================
  // KADEME 2: Buzul Duvarlarının Çatlaması & Yalnızlık
  // =========================================================================
  createKademe2() {
    return new CompanionKademe({
      kademeLevel: 2,
      kademeTitle: 'Buzul Duvarlarının Çatlaması & Yalnızlık',
      introAmbiance: 'İkinci gelişinde Katerina seni kapıda karşılar. Bu kez mızrağını kınında bırakmış, ağır kalkanını sedirin arkasına saklamıştır. Üzerindeki buz mavisi ipek kaftan daha dökümlü ve rahattır; saçlarını gümüş bir tokayla toplamış, yüzünün zarafetini tamamen ortaya çıkarmıştır.',
      rounds: [
        new CompanionRound({
          roundNumber: 1,
          roundTitle: 'Kapıda Karşılama',
          roundPrompt: "Katerina kapıyı ardınızdan örterken sana gülümsedi: 'Geldin... Bu hisarda sözünü tutan pek az erkek gördüm. Arenadaki son zaferini duydum, kılıcın gün geçtikçe daha da keskinleşiyor. Dinlenmeye ihtiyacın var gibi görünüyor.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k2_r1_c1',
              choiceSummary: 'Senin yanında olmak tüm yorgunluğumu alıyor de.',
              playerSpeechText: 'Arenanın tozu ve kanı umurumda değil Katerina. Senin varlığın bana en büyük şifa.',
              narrativeResponse: "Katerina'nın safir gözlerinde sıcacık bir ışıltı parlar: 'Bir savaşçının yaralarını sarabilmek... Bunu uzun zamandır kimse için hissetmemiştim. Gel, otur.'",
              attitudeBadge: 'Sıcak Karşılama'
            }),
            new CompanionChoice({
              id: 'katerina_k2_r1_c2',
              choiceSummary: 'Kuzeyin güzel muhafızını özledim de.',
              playerSpeechText: 'Dinlenmek bahane... Ben sadece seni görmek, o asil sesini duymak için geldim.',
              narrativeResponse: "Yanakları pembeleşir, gözlerini kaçırır: 'Beni utandırmak için özel bir çaban var sanırım... Ama yalan söylemeyeceğim, seni bekliyordum.'",
              attitudeBadge: 'Mahcup İtiraf'
            }),
            new CompanionChoice({
              id: 'katerina_k2_r1_c3',
              choiceSummary: 'Kalkanını arkaya sakladığını fark ettim de.',
              playerSpeechText: 'Kalkanın bu gece sedirin arkasında duruyor. Bana karşı savunmanı gevşetmeye başladın mı yoksa?',
              narrativeResponse: "Hafifçe kıkırdar: 'Sadece... Bu odada düşman olmadığını anladım diyelim. Fazla şımarma hemen.'",
              attitudeBadge: 'İnen Kalkan'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 2,
          roundTitle: 'Kuzey Masalları',
          roundPrompt: "Katerina şöminenin yanındaki yumuşak kürk sedire oturdu, yanındaki boşluğu işaret etti: 'Bizim dağlarımızda efsaneler anlatılır... Kuzey kutbunda birleşen iki yıldızın asla ayrılamayacağı söylenir. Çocukken bunun sadece masal olduğunu düşünürdüm. Sen kadere inanır mısın?'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k2_r2_c1',
              choiceSummary: 'Kader bizi bu hisarda buluşturduysa bir sebebi var de.',
              playerSpeechText: "İki sürgün savaşçının Taş Hisar'ın bu köşkünde yan yana oturması tesadüf olamaz. Biz birbirimiz için buradayız.",
              narrativeResponse: "Elini sedirin üzerindeki elinin yanına koyar: 'Belki de haklısın... Hayatım boyunca mantığımla yaşadım. Ama senin yanındayken kalbimin sesini duymak istiyorum.'",
              attitudeBadge: 'Kadere İnanç'
            }),
            new CompanionChoice({
              id: 'katerina_k2_r2_c2',
              choiceSummary: 'Kaderi kendi kılıcımızla biz yazarız de.',
              playerSpeechText: 'Yıldızlar ne derse desin, ben kendi yolumu kendim çizerim. Ve o yolda seninle yürümek istiyorum.',
              narrativeResponse: "Gözleri gururla parıldar: 'İşte tam bir kuzey savaşçısı gibi konuştun! Güçlü ve boyun eğmez. Bu tavrına hayranım.'",
              attitudeBadge: 'Boyun Eğmez'
            }),
            new CompanionChoice({
              id: 'katerina_k2_r2_c3',
              choiceSummary: 'O masalları senin sesinden dinlemek büyüleyici de.',
              playerSpeechText: 'Masal olsun ya da gerçek... Sen anlatırken zaman duruyor Katerina.',
              narrativeResponse: "Başını hafifçe omzuna doğru eğer: 'Senin yanındayken anlatacak çok şeyim olduğunu hissediyorum.'",
              attitudeBadge: 'Büyülü Sohbet'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 3,
          roundTitle: 'Tokanın Çözülüşü',
          roundPrompt: "Katerina başındaki gümüş tokayı çıkardı. Açık gümüş sarısı saçları ipek bir şelale gibi omuzlarına, köprücük kemiklerine ve göğsüne döküldü: 'Bunu sadece odamda yalnızken yaparım... Askerlerimin önünde daima saçlarım sımsıkı bağlı olmalıydı. Şimdi kendimi hafiflemiş hissediyorum.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k2_r3_c1',
              choiceSummary: 'Saçlarının bir tutamını parmaklarına dola ve kokla.',
              playerSpeechText: 'Saçların ay ışığı gibi parıldıyor... Dağ çamı ve taze kar kokuyor.',
              narrativeResponse: "Gözlerini yumar, derin bir nefes alır: 'Dokunuşun o kadar huzurlu ki... İçimdeki bütün kasvet dağılıp gidiyor.'",
              attitudeBadge: 'Gümüş Işık'
            }),
            new CompanionChoice({
              id: 'katerina_k2_r3_c2',
              choiceSummary: 'Bu güzelliği saklamak zorunda kaldığın için üzüldüm de.',
              playerSpeechText: 'Yıllarca bir asker gibi yaşamak zorunda kalmışsın. Ama bu gece sadece kendi için yaşayan güzel bir kadınsın.',
              narrativeResponse: "Gözleri nemlenir: 'Bunu bana ilk defa biri söylüyor... Hep komutan Katerina oldum. Kadın Katerina'yı kimse merak etmedi. Sen hariç.'",
              attitudeBadge: 'Derin Anlayış'
            }),
            new CompanionChoice({
              id: 'katerina_k2_r3_c3',
              choiceSummary: 'Gözlerinin içine bakarak tebessüm et.',
              playerSpeechText: 'Senin her halin bir kraliçeye layık.',
              narrativeResponse: "Gülümseyerek elini senin göğsüne koyar: 'Ve sen de bir kral gibi davranıyorsun bana.'",
              attitudeBadge: 'Asil Bakış'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 4,
          roundTitle: 'Elin Sıcaklığı',
          roundPrompt: "Katerina'nın eli senin göğsündeki zırh perçinlerinin üzerinde durdu. Yavaşça elini gömleğinin aralığından içeri soktu, tenine doğrudan temas etti: 'Tenin çok sıcak... Kuzeyin soğuğundan sonra bu sıcaklık içime işliyor. Kalbinin bu kadar güçlü çarptığını hissetmek ürpertici derecede güzel.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k2_r4_c1',
              choiceSummary: 'Elini onun elinin üzerine koyup kalbine bastır.',
              playerSpeechText: 'Bu kalp sadece senin için bu kadar hızlı çarpıyor Katerina.',
              narrativeResponse: "Nefesi hızlanır, parmaklarını göğsüne daha da bastırır: 'Bunu hissetmek... Bana yalnız olmadığımı hatırlatıyor.'",
              attitudeBadge: 'Yanan Kalp'
            }),
            new CompanionChoice({
              id: 'katerina_k2_r4_c2',
              choiceSummary: 'Sen de elini onun beline koyup kendine çek.',
              playerSpeechText: 'Benim sıcaklığım senin de olsun. Artık üşümeyeceksin.',
              narrativeResponse: "Bedenini sana doğru bırakır, kucağına yaslanır: 'Senin kollarındayken kış fırtınaları bile bana dokunamaz.'",
              attitudeBadge: 'Sıcak Kucak'
            }),
            new CompanionChoice({
              id: 'katerina_k2_r4_c3',
              choiceSummary: 'Şaka yollu kalbimin ritmini bozuyorsun de.',
              playerSpeechText: 'Böyle dokunmaya devam edersen arenada değil, senin kollarında can vereceğim güzelim.',
              narrativeResponse: "Cilveli bir kahkaha atar: 'Koca bir silahşör benim küçük bir dokunuşumla mı yenilecek? Çok zayıfsın sevgilim.'",
              attitudeBadge: 'Cilveli Şaka'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 5,
          roundTitle: 'İkinci Perdenin Vedası',
          roundPrompt: "Gece sona ererken Katerina sedirden doğruldu. Saçlarını toplamadı, serbest bıraktı. Kapıya kadar sana eşlik etti: 'Bu gece bana çok şey verdin silahşör... Kalbimdeki buzul surlar her dokunuşunda biraz daha eriyor. Bir sonraki gelişimizi iple çekeceğim.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k2_r5_c1',
              choiceSummary: 'Yanağına sıcak bir öpücük kondur.',
              playerSpeechText: 'Çok yakında yeniden geleceğim Katerina. O buzları tamamen eriteceğiz.',
              narrativeResponse: "Yanağındaki öpücüğün bıraktığı sıcaklıkla gözlerini yumar: 'Sabırsızlıkla bekleyeceğim... Acele et.'",
              attitudeBadge: 'Sıcak Buse'
            }),
            new CompanionChoice({
              id: 'katerina_k2_r5_c2',
              choiceSummary: 'Söz veriyorum, seni yalnız bırakmayacağım de.',
              playerSpeechText: "Taş Hisar'ın soğuk gecelerinde aklım hep burada, senin yanında olacak.",
              narrativeResponse: "Elini tutup sıkar: 'Ve benim aklım da senin kılıcında olacak. Zaferle dön bana.'",
              attitudeBadge: 'Sadakat Sözü'
            }),
            new CompanionChoice({
              id: 'katerina_k2_r5_c3',
              choiceSummary: 'Asil bir baş eğişiyle veda et.',
              playerSpeechText: 'İyi geceler kuzeyin asil kraliçesi.',
              narrativeResponse: "Zarifçe eğilir: 'İyi geceler benim cesur silahşörüm.'",
              attitudeBadge: 'Asil Veda'
            })
          ]
        })
      ],
      conclusionFarewell: 'Katerina kapıda el sallayarak sana veda eder. Saçları serbest kalmış, gözlerindeki soğuk zırh yerini derin bir muhabbet ve arzuya bırakmıştır. İkinci kademe tamamlanmış, aranızdaki yakınlık aşka dönüşmeye başlamıştır.'
    });
  },

  // =========================================================================
  // KADEME 3: Eriyen Ayaz & Şömine Başında Yakınlaşma
  // =========================================================================
  createKademe3() {
    return new CompanionKademe({
      kademeLevel: 3,
      kademeTitle: 'Eriyen Ayaz & Şömine Başında Yakınlaşma',
      introAmbiance: "Üçüncü ziyarette Yeşim Mabedi'nin şöminesi gürül gürül yanıyor; odaya çam çırası ve bal mumu kokusu yayılmış. Katerina kürklerin üzerine serilmiş, üzerinde omuzlarını ve sırtını tamamen açıkta bırakan buz mavisi saten bir elbise var. Tavırlarında artık hiçbir çekingenlik kalmamış; gözlerinde davetkar bir alev dans ediyor.",
      rounds: [
        new CompanionRound({
          roundNumber: 1,
          roundTitle: 'Alevin Işığında',
          roundPrompt: "Katerina kürklerin üzerinde doğruldu, omuzlarındaki saten kumaş hafifçe kaydı: 'Şöminenin alevleri beni ısıtmaya yetmiyor silahşör... Senin sıcaklığına ihtiyacım var. Yanıma uzanmaz mısın?'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k3_r1_c1',
              choiceSummary: 'Hiç tereddüt etmeden yanına uzan ve ona sarıl.',
              playerSpeechText: 'Senin yanından başka bir yerde olmak istemezdim Katerina.',
              narrativeResponse: "Kollarına sığınır, başını göğsüne yaslayarak derin bir iç çeker: 'İşte... Şimdi içimdeki son ayaz da eriyor.'",
              attitudeBadge: 'Tutkulu Sığınış'
            }),
            new CompanionChoice({
              id: 'katerina_k3_r1_c2',
              choiceSummary: 'Bu gece bir tanrıça kadar güzelsin de.',
              playerSpeechText: 'Alevlerin ışığı fildişi tenine vururken nefes kesici görünüyorsun.',
              narrativeResponse: "Gözlerini gözlerine kenetler, parmaklarıyla dudaklarına dokunur: 'Sadece senin için böyle süslendim silahşör... Beğenmene sevindim.'",
              attitudeBadge: 'Tanrıça Zarafeti'
            }),
            new CompanionChoice({
              id: 'katerina_k3_r1_c3',
              choiceSummary: 'Kollarını sımsıkı etrafına dola.',
              playerSpeechText: 'Seni öyle bir saracağım ki, soğuk kelimesini tamamen unutacaksın.',
              narrativeResponse: "Kollarında erir gibi gevşer: 'Unuttum bile... Senin yanındayken dünya sadece ateşten ibaret.'",
              attitudeBadge: 'Yakıcı Kalkan'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 2,
          roundTitle: 'İlk Dudak Teması',
          roundPrompt: "Şöminenin alevleri iki silüetinizi duvara tek bir gölge olarak yansıtıyordu. Katerina yüzünü yüzüne yaklaştırdı, dudakları dudaklarına sadece birkaç parmak mesafedeydi: 'Hayatım boyunca hiçbir erkeğin bu kadar yakınıma gelmesine izin vermedim... Ama şimdi... Seni öpmemek için kendimle savaşıyorum.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k3_r2_c1',
              choiceSummary: 'Savaşmayı bırak ve dudaklarını dudaklarına bastır.',
              playerSpeechText: 'Bu savaşı kaybet Katerina... Ve aşkı kazan.',
              narrativeResponse: "Dudaklarınız birleştiğinde Katerina'nın boğazından tatlı, boğuk bir inilti kopar. Öpüşü ilk başta serin ama saniyeler içinde yakıcı bir lav nehrine dönüşür; parmaklarını saçlarına dolar.",
              attitudeBadge: 'Tutkulu Birleşme'
            }),
            new CompanionChoice({
              id: 'katerina_k3_r2_c2',
              choiceSummary: 'Nazikçe çenesini kaldırıp dudaklarının tadına bak.',
              playerSpeechText: 'İzin ver o savaşı ikimiz de kaybedelim.',
              narrativeResponse: 'Nefesi kesilir, dudaklarını açarak seni içine çeker; vücudu kollarında baştan aşağı titrer.',
              attitudeBadge: 'Büyülü Öpücük'
            }),
            new CompanionChoice({
              id: 'katerina_k3_r2_c3',
              choiceSummary: 'Kulağına fısılda: Artık sadece benimsin.',
              playerSpeechText: 'Sen artık benim kaderimsin güzelim.',
              narrativeResponse: "Dudaklarını öperken fısıldar: 'Evet... Sadece senin...' ",
              attitudeBadge: 'Mühürlü Aşk'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 3,
          roundTitle: 'Satene Dokunuş',
          roundPrompt: "Öpüşmenin hararetiyle Katerina'nın üzerindeki saten elbisenin omuz askıları çözüldü; fildişi göğüs kıvrımları ve biçimli omuzları tamamen açığa çıktı: 'Dokun bana silahşör... Sadece kılıç tutan ellerinle değil, bir aşık gibi dokun.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k3_r3_c1',
              choiceSummary: 'Ellerini omuzlarında ve sırtında gezdir.',
              playerSpeechText: 'Tenin mermerden oyulmuş bir sanat eseri gibi...',
              narrativeResponse: "Başını geriye atarak nefes alır; ellerin sırtındaki kas kıvrımlarında dolaşırken hazla inler: 'Ah... Ellerinin ateşi içimi yakıyor...'",
              attitudeBadge: 'Yakıcı Dokunuş'
            }),
            new CompanionChoice({
              id: 'katerina_k3_r3_c2',
              choiceSummary: 'Boynundan göğsüne doğru öpücükler kondur.',
              playerSpeechText: 'Her zerren benim için kutsal Katerina.',
              narrativeResponse: "Tırnaklarını omuzlarına geçirir: 'Daha... Durma ne olursun...'",
              attitudeBadge: 'Şehvet Dalgası'
            }),
            new CompanionChoice({
              id: 'katerina_k3_r3_c3',
              choiceSummary: 'Beline sarılarak onu kürklerin üzerine yatır.',
              playerSpeechText: 'Bu gece sadece tutkumuz konuşacak.',
              narrativeResponse: "Seni kendine doğru çeker, bacaklarını bacaklarına dolar: 'Beni tamamen ele geçir.'",
              attitudeBadge: 'Çılgın Arzu'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 4,
          roundTitle: 'Kuzeyin Çözülüşü',
          roundPrompt: "Nefes nefese birbirinize sokulmuşken Katerina fısıldadı: 'Kuzeyde bize duyguların bir zayıflık olduğu öğretilirdi. Ama senin kollarındayken kendimi hayatımda hiç olmadığım kadar güçlü hissediyorum. Bu hissi benden hiç alma.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k3_r4_c1',
              choiceSummary: 'Bu his ebediyen sürecek Katerina de.',
              playerSpeechText: 'Aşk bir zayıflık değil, en büyük zırhtır güzelim. Biz birlikte yenilmez olacağız.',
              narrativeResponse: "Gözlerinden bir damla yaş süzülür, dudaklarını öper: 'Yenilmez olacağız... Seninle birlikte.'",
              attitudeBadge: 'Aşkın Zırhı'
            }),
            new CompanionChoice({
              id: 'katerina_k3_r4_c2',
              choiceSummary: 'Senin her damla yaşın için dünyayı fethederim de.',
              playerSpeechText: 'Gözlerindeki o yaşları sadece mutluluktan akıtacağım.',
              narrativeResponse: "Yüzünü göğsüne gömer: 'Bana dünyayı verme... Sadece kendini ver, yeter.'",
              attitudeBadge: 'Saf Teslimiyet'
            }),
            new CompanionChoice({
              id: 'katerina_k3_r4_c3',
              choiceSummary: 'Saçlarını okşayarak ona güç ver.',
              playerSpeechText: 'Ben daima senin yanındayım.',
              narrativeResponse: "Huzurla kollarında nefeslenir: 'Biliyorum sevgilim... Kalbim bunu biliyor.'",
              attitudeBadge: 'Sonsuz Güven'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 5,
          roundTitle: 'Üçüncü Perdenin Sonu',
          roundPrompt: "Gece sona ererken Katerina güçlükle üzerindeki saten elbiseyi düzeltti. Yanakları pembeleşmiş, gözleri tutkunun ateşiyle parıldıyordu: 'Neredeyse... Neredeyse bu gece her şeyimi sana teslim ediyordum. Ama bir sonraki sefere hiçbir engel kalmayacak. Bana söz ver, beni çok bekletmeyeceksin.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k3_r5_c1',
              choiceSummary: 'En kısa zamanda döneceğime yemin ederim de.',
              playerSpeechText: 'Kuzeyin kraliçesini bekletmeye cesaretim yok. İlk fırsatta buradayım.',
              narrativeResponse: "Dudaklarına son bir sıcak öpücük bırakır: 'Dönüşünü her saniye bekleyeceğim cüretkar savaşçı.'",
              attitudeBadge: 'Sabırsız Veda'
            }),
            new CompanionChoice({
              id: 'katerina_k3_r5_c2',
              choiceSummary: 'Bir dahaki sefere tamamen birleşeceğiz de.',
              playerSpeechText: 'Gelecek gelişimde aramızda ne bir kumaş ne de bir sınır kalacak.',
              narrativeResponse: "Gözleri parlar: 'Ben de tam olarak bunu arzuluyorum...' ",
              attitudeBadge: 'Vuslat Çağrısı'
            }),
            new CompanionChoice({
              id: 'katerina_k3_r5_c3',
              choiceSummary: 'Elinin üzerini öperek ayrıl.',
              playerSpeechText: 'Rüyalarımda seni göreceğim Katerina.',
              narrativeResponse: "Gülümser: 'Ve ben de rüyalarımda senin kollarında olacağım.'",
              attitudeBadge: 'Romantik Veda'
            })
          ]
        })
      ],
      conclusionFarewell: 'Katerina kapıda durup sana son bir kez bakar. Üçüncü kademe geride kalmış, aranızdaki fiziksel ve ruhsal çekim doruk noktasına bir adım daha yaklaşmıştır.'
    });
  },

  // =========================================================================
  // KADEME 4: Zırhın Çözülüşü & Sıcak Dokunuşlar
  // =========================================================================
  createKademe4() {
    return new CompanionKademe({
      kademeLevel: 4,
      kademeTitle: 'Zırhın Çözülüşü & Sıcak Dokunuşlar',
      introAmbiance: "Dördüncü ziyarette Yeşim Mabedi'nin kapısı ardınızdan kilitlenir. Katerina üzerinde sadece şeffaf beyaz bir ipek şal ile seni beklemektedir. Odanın her köşesi lavanta yağları ve tütsülerle bezenmiştir. Gözlerinde artık bir komutanın değil, baştan aşağı aşka teslim olmuş bir kadının cüretkar arzusu vardır.",
      rounds: [
        new CompanionRound({
          roundNumber: 1,
          roundTitle: 'Kilitli Kapı & Mutlak Teslimiyet',
          roundPrompt: "Katerina anahtarı şöminenin üzerindeki mermer kaideye koydu ve sana döndü: 'Bu gece bu odaya hiçbir emir, hiçbir ferman giremez silahşör. Bu gece burada sadece seni arzulayan Katerina var. Beni fethedecek misin?'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k4_r1_c1',
              choiceSummary: 'Seni fethetmeye değil, sana teslim olmaya geldim de.',
              playerSpeechText: 'Ben senin kalbinde bir fetih değil, ebedi bir yuva arıyorum Katerina.',
              narrativeResponse: "Gözleri buğulanır, kollarını boynuna dolar: 'O yuva artık sadece senindir... Al beni.'",
              attitudeBadge: 'Ebedi Yuva'
            }),
            new CompanionChoice({
              id: 'katerina_k4_r1_c2',
              choiceSummary: 'Kuzeyin kraliçesini kollarımın arasına almaya geldim de.',
              playerSpeechText: 'Bu gece bu hisarın en görkemli zaferini yaşayacağız.',
              narrativeResponse: "Bedenini sana yaslar: 'Bu zafer ikimizin olacak sevgilim...'",
              attitudeBadge: 'Zafer Tutkusu'
            }),
            new CompanionChoice({
              id: 'katerina_k4_r1_c3',
              choiceSummary: 'Onu kucağına alıp kürklerin üzerine taşı.',
              playerSpeechText: 'Sözlerin beni ateşe veriyor. Yatağa gidelim.',
              narrativeResponse: "Boynuna sarılıp başını göğsüne gömer: 'Beni istediğin yere götür...' ",
              attitudeBadge: 'Tutkulu Taşıma'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 2,
          roundTitle: 'Son Örtülerin Düşüşü',
          roundPrompt: 'Sedirin üzerine uzandığınızda Katerina ellerini göğsüne koydu ve senin zırh parçalarını, gömleğini tek tek çıkardı. Ardından kendi omzundaki beyaz ipek şalı çözdü. Kusursuz fildişi bedeni, uzun biçimli bacakları ve narin göğüsleri tüm ihtişamıyla karşındaydı.',
          choices: [
            new CompanionChoice({
              id: 'katerina_k4_r2_c1',
              choiceSummary: 'Nefesin kesilerek onu övgülere boğ.',
              playerSpeechText: 'Katerina... Hayatımda gördüğüm en kusursuz varlıksın.',
              narrativeResponse: "Yanakları kızarır ama cesurca gözlerinin içine bakar: 'Bu beden sadece senin dokunuşlarınla anlam kazanıyor silahşör...'",
              attitudeBadge: 'Kusursuz Ten'
            }),
            new CompanionChoice({
              id: 'katerina_k4_r2_c2',
              choiceSummary: 'Ellerini kalçasında ve belinde gezdir.',
              playerSpeechText: 'Tenin ipekten bile daha pürüzsüz.',
              narrativeResponse: "Nefesi hızlanır, vücudu parmaklarının altında dalgalanır: 'Ah... Dokunuşların beni yakıyor...'",
              attitudeBadge: 'Tensel Alev'
            }),
            new CompanionChoice({
              id: 'katerina_k4_r2_c3',
              choiceSummary: 'Eğilip göğsünün ortasındaki narin çukuru öp.',
              playerSpeechText: 'Her zerren benim cennetim.',
              narrativeResponse: "Başını geriye atarak hazla inler: 'Daha... Daha fazla öp beni...'",
              attitudeBadge: 'Tutkulu Buse'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 3,
          roundTitle: 'Ebedi İttifak Yemini',
          roundPrompt: "Tenleriniz çıplak kürklerin üzerinde birbirine kenetlenmişken Katerina fısıldadı: 'Kuzeyin buzulları altında verilen sözler ölümsüzdür. Ben bu gece sana kalbimi, kılıcımı ve bedenimi adıyorum. Bir gün kendi kaleni kurduğunda, senin yanında savaşacağıma and içerim. Sen de bana aynı sözü verir misin?'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k4_r3_c1',
              choiceSummary: 'Kanım ve canım üzerine yemin ederim de.',
              playerSpeechText: 'Kuracağım kalenin baş muhafızı ve kalbimin ebedi kraliçesi sen olacaksın Katerina. Andım olsun.',
              narrativeResponse: "Dudaklarına sımsıkı yapışır, gözlerinden mutluluk yaşları süzülür: 'Bu yeminin ardından ölüm bile beni senden ayıramaz.'",
              attitudeBadge: 'Ebedi Yemin'
            }),
            new CompanionChoice({
              id: 'katerina_k4_r3_c2',
              choiceSummary: 'Bizim ittifakımız krallıkları bile dize getirecek de.',
              playerSpeechText: 'Sen ve ben... Birlikte bu diyara diz çöktüreceğiz.',
              narrativeResponse: "Gururla gülümser: 'Ve senin yanında kalkan olmak benim en büyük şerefim olacak.'",
              attitudeBadge: 'Hükümdar Aşkı'
            }),
            new CompanionChoice({
              id: 'katerina_k4_r3_c3',
              choiceSummary: 'Sözünü dudaklarında mühürle.',
              playerSpeechText: 'Bu andı öpücüklerimizle mühürleyelim.',
              narrativeResponse: 'Kollarını sırtına dolar ve nefesini nefesine katarak seni öper.',
              attitudeBadge: 'Mühürlü Dudaklar'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 4,
          roundTitle: 'Vuslatın Eşiğinde',
          roundPrompt: "İki savaşçı gibi çıplak, terli ve birbirine kenetlenmiş halde nefesleniyordunuz. Katerina elini senin yüzünde gezdirdi: 'Son adım kaldı sevgilim... Bir sonraki buluşmamızda köşkün doruk noktasına çıkacağız. Ruhlarımızın ve bedenlerimizin tamamen tek bir alev olduğu o geceye hazır mısın?'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k4_r4_c1',
              choiceSummary: 'O gece için sabırsızlıkla yanıp tutuşuyorum de.',
              playerSpeechText: 'O gece hayatımızın en unutulmaz gecesi olacak Katerina.',
              narrativeResponse: "Gözleri şehvet ve aşkla buğulanır: 'Ben de o gece için saniyeleri sayacağım.'",
              attitudeBadge: 'Büyük Hazırlık'
            }),
            new CompanionChoice({
              id: 'katerina_k4_r4_c2',
              choiceSummary: 'Seninle her şeye hazırım güzelim.',
              playerSpeechText: 'Seninle sonsuzluğa yürümek benim tek arzum.',
              narrativeResponse: "Göğsüne sokulur: 'Ve ben de daima senin kollarında olacağım.'",
              attitudeBadge: 'Sonsuz Güven'
            }),
            new CompanionChoice({
              id: 'katerina_k4_r4_c3',
              choiceSummary: 'Alnından öperek ona huzur ver.',
              playerSpeechText: 'O gece ikimiz için de bir bayram olacak.',
              narrativeResponse: "Huzurla gözlerini kapar: 'Kutsal ve ebedi bir bayram...'",
              attitudeBadge: 'Kutsal Vuslat'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 5,
          roundTitle: 'Dördüncü Perdenin Kapanışı',
          roundPrompt: "Şafak sökerken Katerina güçlükle kürklerin arasından doğruldu. İpek kaftanını üzerine alırken sana derin, aşık bir bakış fırlattı: 'Zirve bizi bekliyor silahşör... Bir dahaki sefere köşkün en kutsal vuslatını yaşayacağız. Beni sakın bekletme.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k4_r5_c1',
              choiceSummary: 'Çok yakında geleceğime söz veriyorum de.',
              playerSpeechText: 'Altınları hazırlayıp en kısa sürede geleceğim. Zirve bizim olacak.',
              narrativeResponse: "Dudaklarına sıcak bir öpücük bırakır: 'Dönüşünü sabırsızlıkla bekleyeceğim sevgilim.'",
              attitudeBadge: 'Zirveye Doğru'
            }),
            new CompanionChoice({
              id: 'katerina_k4_r5_c2',
              choiceSummary: 'Arenada senin adını haykırarak dövüşeceğim de.',
              playerSpeechText: 'Zaferlerim senin şerefine olacak Katerina.',
              narrativeResponse: "Gülümser: 'Ve ben de tribünlerde gururla seni izleyeceğim.'",
              attitudeBadge: 'Şampiyonun Aşkı'
            }),
            new CompanionChoice({
              id: 'katerina_k4_r5_c3',
              choiceSummary: 'Elini tutup kalbine bastır.',
              playerSpeechText: 'Kalbim daima seninle.',
              narrativeResponse: "Elini öpüp odadan süzülür: 'Ve benimki de seninle...'",
              attitudeBadge: 'Ayrılık Öncesi'
            })
          ]
        })
      ],
      conclusionFarewell: "Katerina odadan ayrılırken bıraktığı asil aşk ve vuslat vaadi Yeşim Mabedi'ni ısıtır. Dördüncü kademe tamamlanmış, artık son durak olan Büyük Vuslat'ın (5. Kademe) kapısı ardına kadar açılmıştır."
    });
  },

  // =========================================================================
  // KADEME 5: Kutup Alevinde Büyük Vuslat & Sonsuz Bağ
  // =========================================================================
  createKademe5() {
    return new CompanionKademe({
      kademeLevel: 5,
      kademeTitle: 'Kutup Alevinde Büyük Vuslat & Sonsuz Bağ',
      introAmbiance: "Yeşim Mabedi'nin en mahrem odası saf beyaz tilki kürkleri, kuzey ardıç tütsüleri ve dev şömine alevleriyle donatılmıştır. Katerina üzerinde hiçbir giysi olmadan, sadece şeffaf buz mavisi tül bir şal ile seni beklemektedir. Yüzü tamamen açıktır; safir mavisi gözlerinde hayatında ilk kez gördüğün engelsiz, saf ve yakıcı bir aşk yangını parıldamaktadır.",
      rounds: [
        new CompanionRound({
          roundNumber: 1,
          roundTitle: 'Ebedi Eşik',
          roundPrompt: "Katerina kürklerin üzerinden kalkıp çıplak ayaklarıyla sana doğru yürüdü. Elleri titreyerek kollarını boynuna doladı: 'Geldin... Bütün engelleri aştın ve bana geldin silahşör. Bu gece artık hiçbir kelimeye, hiçbir kurala gerek yok. Ben tamamen seninim.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k5_r1_c1',
              choiceSummary: 'Ve ben de tamamen seninim Katerina de.',
              playerSpeechText: 'Bedenim, ruhum ve kılıcım... Hepsi bu gece senin ayaklarının altına serildi leydim.',
              narrativeResponse: "Gözlerinden süzülen bir damla yaşı senin yanağına sürer: 'Bunu duymak için bütün hayatım boyunca buzullar arasında beklemişim meğer...'",
              attitudeBadge: 'Ebedi Birleşme'
            }),
            new CompanionChoice({
              id: 'katerina_k5_r1_c2',
              choiceSummary: 'Onu kollarının arasına alıp ayaklarını yerden kes.',
              playerSpeechText: 'Bu gece zaman duracak Katerina. Sadece biz varız.',
              narrativeResponse: "Bacaklarını beline dolayıp boynuna sarılır: 'Durmasın zaman... Birlikte eriyelim bu yangında.'",
              attitudeBadge: 'Alevlerin Dansı'
            }),
            new CompanionChoice({
              id: 'katerina_k5_r1_c3',
              choiceSummary: 'Dudaklarına derin, yakıcı bir öpücük kondur.',
              playerSpeechText: 'Sözler tükendi sevgilim...',
              narrativeResponse: 'Dudaklarınız birleştiğinde tüm oda bir alev topuna döner gibi olur; nefesler birbirine karışır.',
              attitudeBadge: 'Tutkunun Zirvesi'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 2,
          roundTitle: 'Tenin Ritmi',
          roundPrompt: "Kürk yatağın yumuşaklığına uzandığınızda Katerina'nın asil bedeni kollarında dalgalandı. Parmakların teninde dolaşırken nefesi hızlandı: 'Bana öyle dokunuyorsun ki... İçimdeki bütün o soğuk muhafız ölüyor, geriye sadece sana aşık çıplak bir kadın kalıyor.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k5_r2_c1',
              choiceSummary: 'O kadını ömrümün sonuna kadar seveceğim de.',
              playerSpeechText: 'O kadın benim dünyamın en değerli hazinesi.',
              narrativeResponse: "Tırnaklarını sırtına batırarak seni kendine daha da çeker: 'Al beni... Hiçbir parçamı bırakma.'",
              attitudeBadge: 'Sonsuz Bağ'
            }),
            new CompanionChoice({
              id: 'katerina_k5_r2_c2',
              choiceSummary: 'Boynundan başlayarak göğsüne doğru öpücükler yağdır.',
              playerSpeechText: 'Teninin her santimini fethedeceğim.',
              narrativeResponse: "Başını geriye atarak haz dolu bir inilti koyverir: 'Evet... Her yerim senin olsun...'",
              attitudeBadge: 'Yakıcı Haz'
            }),
            new CompanionChoice({
              id: 'katerina_k5_r2_c3',
              choiceSummary: 'Gözlerinin içine bakarak aşkını fısılda.',
              playerSpeechText: 'Seni seviyorum Katerina. Buzulundan ve yangınından daha çok.',
              narrativeResponse: "Gözleri yaşarır, dudaklarını öper: 'Ben de seni seviyorum... Hayatımda ilk kez bir erkeğe kalbimi veriyorum.'",
              attitudeBadge: 'İlk İtiraf'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 3,
          roundTitle: 'Kutup Fırtınasının Yangını',
          roundPrompt: "Tenlerin birbirine sürtünüşü, nefeslerin ritmi ve odadaki şöminenin alevleri tek bir kasırgaya dönüştü. Katerina seni sımsıkı sardı: 'Daha sert sarıl bana... Bedenlerimiz tek bir et, tek bir kemik olana kadar sarıl!'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k5_r3_c1',
              choiceSummary: 'Onu kollarında sımsıkı ezerek öp.',
              playerSpeechText: 'Bize ölüm bile ayıramayacak güzelim.',
              narrativeResponse: 'Bütün gücüyle sana karşılık verir; vücudu kollarında elektrik çarpmış gibi titrer.',
              attitudeBadge: 'Fırtınanın Kalbi'
            }),
            new CompanionChoice({
              id: 'katerina_k5_r3_c2',
              choiceSummary: 'Ritmik ve derin darbelerle aranızdaki ateşi körükle.',
              playerSpeechText: 'Bu gece ikimiz de doruklara çıkacağız.',
              narrativeResponse: "Boğazından kesik kesik haz çığlıkları dökülür; tırnakları sırtında izler bırakır: 'Daha... Daha fazla...'",
              attitudeBadge: 'Doruk Ateşi'
            }),
            new CompanionChoice({
              id: 'katerina_k5_r3_c3',
              choiceSummary: 'Terli alnını alnına daya ve nefesini içine çek.',
              playerSpeechText: 'Nefesimiz bir oldu Katerina...',
              narrativeResponse: "Gözlerini gözlerine kenetler: 'Ruhumuz da bir oldu sevgilim...'",
              attitudeBadge: 'Ruhsal Kenetlenme'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 4,
          roundTitle: 'Doruk Noktası',
          roundPrompt: "Odanın sıcaklığı dayanılmaz bir seviyeye ulaşmıştı. Katerina uzun bacaklarını sırtına kenetledi, safir gözleri şehvet ve aşkın buğusuyla parıldayarak haykırdı: 'Geliyor... Buzullar yıkılıyor silahşör! Benimle birlikte gel!'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k5_r4_c1',
              choiceSummary: 'Onunla birlikte doruk noktasına ulaş.',
              playerSpeechText: 'Seninleyim Katerina! Sonsuza kadar!',
              narrativeResponse: "Bedenleriniz aynı saniyede sarsıcı bir titremeyle kenetlendi; Yeşim Mabedi'nin duvarlarında yankılanan haz çığlığıyla birlikte vuslat tamamlandı.",
              attitudeBadge: 'Büyük Patlama'
            }),
            new CompanionChoice({
              id: 'katerina_k5_r4_c2',
              choiceSummary: 'Dudaklarını dudaklarına gömerek haykırışını içine çek.',
              playerSpeechText: 'Her şeyim senindir!',
              narrativeResponse: 'Dudaklarınız kenetli halde iki beden tek bir kalp gibi çarparak kürklerin arasına yığıldı.',
              attitudeBadge: 'Kenetli Zafer'
            }),
            new CompanionChoice({
              id: 'katerina_k5_r4_c3',
              choiceSummary: 'Onu kollarında sarıp sarmalayarak doruğu yaşa.',
              playerSpeechText: 'Biz kazandık sevgilim...',
              narrativeResponse: "Katerina'nın bedeni kollarında gevşedi, yüzünde mest olmuş muzaffer bir tebessüm belirdi.",
              attitudeBadge: 'Ebedi Zafer'
            })
          ]
        }),
        new CompanionRound({
          roundNumber: 5,
          roundTitle: 'Büyük Vuslatın Mührü',
          roundPrompt: "Nefes nefese birbirinize sarılmış halde yatarken Katerina başını göğsüne koydu. Sessizce atan kalbini dinledi ve fısıldadı: 'Artık hiçbir şey eskisi gibi olmayacak... Ben senin kadınınım. Ve sen benim efendim, sevgilim ve kaderimsin.'",
          choices: [
            new CompanionChoice({
              id: 'katerina_k5_r5_c1',
              choiceSummary: 'Alnına şefkatle bir buse kondur.',
              playerSpeechText: 'Bu gece kurulan bağ ebedidir Katerina. Seni asla bırakmayacağım.',
              narrativeResponse: "Huzurla gözlerini kapar ve göğsüne sokulur: 'Biliyorum... Artık güvendeyim.'",
              attitudeBadge: 'Sonsuz Huzur'
            }),
            new CompanionChoice({
              id: 'katerina_k5_r5_c2',
              choiceSummary: 'Saçlarını okşayarak geleceğinizi planla.',
              playerSpeechText: 'Kuracağım kalede en büyük sancak senin olacak.',
              narrativeResponse: "Gülümser: 'Sancak değil, senin yatağın neresiyse benim sığınağım orasıdır.'",
              attitudeBadge: 'Kale İttifakı'
            }),
            new CompanionChoice({
              id: 'katerina_k5_r5_c3',
              choiceSummary: 'Sımsıkı sarılarak uykuya dal.',
              playerSpeechText: 'Uyu güzelim... Şafak bize yeni bir hayat getirecek.',
              narrativeResponse: 'Derin ve huzurlu bir nefes alarak kollarında uykuya dalar.',
              attitudeBadge: 'Ebedi Gece'
            })
          ]
        })
      ],
      conclusionFarewell: 'Buzul Muhafızı Katerina ile yaşanan büyük vuslat tamamlandı. Aranızdaki bağ artık ZİRVE noktasına ulaştı. Katerina ömrünün sonuna kadar senin yoldaşın ve sevgilin oldu.'
    });
  },
};

