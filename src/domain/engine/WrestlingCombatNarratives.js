import * as kt from '../../kt.js';

export const WrestlingCombatNarratives = {
  // === 0. ER MEYDANI GİRİŞ ANLATIMLARI ===
  generateIntro(fighterA, fighterB) {
    const intros = [
      `🤼 Cazgırın gür sesiyle er meydanına çağrılan iki pehlivan, kızıl kumların üzerine adım attı. ${fighterA} ve ${fighterB}, ibriklerden dökülen sızma zeytinyağıyla baştan aşağı yağlandı; gerilen deri kıspetlerin ve parıldayan yağlı gövdelerin sürtünmesiyle davullar gümbürdemeye başladı!`,
      `🤼 Zurna tiz bir cenk havası çalarken, ${fighterA} ve ${fighterB} peşrev çekerek meydanın dört bir köşesini selamladı. Kollarını iki yana açıp yaylanarak birbirlerinin omuzlarına sertçe vurdular; er meydanının tozu havaya kalktı!`,
      `🤼 Hakem heyeti ve garnizon komutanı yerlerini aldı. ${fighterA} yağlı pazularını gererek kumlara basarken, karşısındaki ${fighterB} kıspetinin paça bağlarını son kez sıktı; koca er meydanında sadece nefesler ve adelelerin gıcırtısı duyuluyor!`,
      `🤼 Cazgır meydana çıkıp ellerini göğe açtı: 'İki yiğit çıkmış er meydanına, biri ak başlı kartal, biri kara kaya!' ${fighterA} ile ${fighterB} alın alına gelip gözlerini birbirine dikti; güreş başladı!`
    ];
    return kt.random(intros);
  },

  // === 1. DURUŞLAR & TARTIŞMALAR (STANCES & GRIP CONTESTS) - 6 SAHNE ===
  generateStance(fighterA, fighterB) {
    const scenes = [
      // Sahne 1: El Ense Çekme
      `✋ ${fighterA} aniden ileri atılarak ${fighterB}'nin yağlı ensesine şaklayan bir el ense tokadı indirdi! Boyun kasları yay gibi gerilen ${fighterB} sarsılsa da dengesini bozmadan ayaklarını kumlara daha da sağlam bastı.`,
      // Sahne 2: Kasnak Tutma
      `🥋 ${fighterA} parmaklarını ${fighterB}'nin deri kıspetinin sert kasnağına (bel kuşağına) geçirdi; iki pehlivan birbirini tartan iki boğa gibi dönerek zayıf bir an kollamaya başladı.`,
      // Sahne 3: Pehlivan Çömelmesi & Paça Kollama
      `👀 ${fighterA} dizlerini kırıp ağırlık merkezini yere yaklaştırdı; tek elini rakibin omzuna koyarken diğer eliyle ${fighterB}'nin kıspet paçasına ani bir dalış fırsatı kolladı.`,
      // Sahne 4: Baş Başa Tokuşma & İtişme
      '💥 İki pehlivan kafalarını sertçe birbirinin alnına dayayarak göğüs göğüse yüklendi! Şakaklardan süzülen zeytinyağı ve ter damlaları kızıl kumlara damlarken nefes nefese bir güç imtihanı yaşandı.',
      // Sahne 5: Peşrev Yaylanması & Omuz Vuruşu
      `🦅 ${fighterA} kollarını iki yana savurup yaylanarak ${fighterB}'nin omuz başına sert bir çarpışma darbesi vurdu; iki dev cüsseli beden çarpıştığında çıkan ses tribünleri coşturdu!`,
      // Sahne 6: Sınır Çizgisi Takibi & Ayak Sürtme
      `👣 ${fighterA} çıplak ayak tabanlarını er meydanının kumlarına sürterek toz kaldırdı; ${fighterB}'yi ahşap sınır direklerine doğru sürmek için santim santim alan daralttı.`
    ];
    return kt.random(scenes);
  },

  // === 2. KAPIŞLAR & KENETLENMELER (CLINCHES & COLLAR LOCKS) - 6 SAHNE ===
  generateClinch(initiator, defender) {
    const scenes = [
      // Sahne 1: Çift Boyunduruk Bağlama
      `🔒 ${initiator} iki kalın kolunu birden ${defender}'ın kalın boynuna mengene gibi kenetleyip kafasını göğsüne doğru bastırdı! Yağlı tenlerin birbirine kayması boyunduruğu tutmayı zorlaştırsa da adeleler kopacak gibi gerildi.`,
      // Sahne 2: Kravat Kilidi & Ense Ezme
      `🥋 ${initiator} tek kolunu ${defender}'ın boğazının altından geçirip kravat kilidine aldı; dirseğini yukarı kaldırarak rakibinin soluğunu kilitlerken diğer eliyle sırtını kumlara doğru eğdi!`,
      // Sahne 3: Göğüs Göğüse Sürtünme & Ter Yağ Aynası
      `💦 İki yağlı gövde tam merkezde birbirine kenetlendi! ${initiator} ve ${defender}'ın kaburga kemikleri birbirine pres yaparcasına gıcırdarken, adelelerin sürtünmesinden çıkan ses ve buhar arenadaki herkesi büyüledi.`,
      // Sahne 4: Bel Kuşağına Çift El Kenetlenme
      `🪢 ${initiator}, ${defender}'ın kıspetinin kalın manda derisi kuşağına iki eliyle asıldı; rakibin ayaklarını yerden kesmek için tüm kalça kuvvetiyle kendini geriye doğru gerdi!`,
      // Sahne 5: Çapraz Kol Kilidi & Omurga Baskısı
      `💪 ${initiator}, ${defender}'ın sağ kolunu kıvırıp kürek kemiğinin arkasına sıkıştırdı; yağlı derinin üzerinden kaydırmamak için çenesini rakibin omzuna dayayıp tüm ağırlığını verdi!`,
      // Sahne 6: Kafa Kafaya Pres & Alından Kayan Ter
      `😤 ${initiator} alnını ${defender}'ın şakağına dayayıp tüm cüssesiyle öne bastırdı; iki güreşçinin yüzleri burun buruna gelirken nefesleri birbirinin göğsünü dağladı!`
    ];
    return kt.random(scenes);
  },

  // === 3. DALIŞLAR & AYAK OYUNLARI (SHOOTS & SWEEPS) - 6 SAHNE ===
  generateShootOrSweep(attacker, defender) {
    const scenes = [
      // Sahne 1: Çift Paça Dalışı
      `🌪️ ${attacker} kedi gibi ani bir refleksle eğilip kumlara diz koydu ve ${defender}'ın iki kıspet paçasını birden iki koluyla kucaklayarak şimşek gibi içeri daldı!`,
      // Sahne 2: Tek Paça Dalışı
      `⚡ ${attacker} rakibin sağ bacağını diz arkasından yakalayıp tek hamlede omuzlayarak havaya dikti; tek ayak üzerinde dengesini yitiren ${defender} sendelemeye başladı!`,
      // Sahne 3: Dış Tırpan Takma
      `🌾 ${attacker} sol ayağını kavisle savurup ${defender}'ın destek ayağının dışına müthiş bir tırpan taktı; aynı anda göğsünden iterek rakibin dengesini altüst etti!`,
      // Sahne 4: İç Kazık Atma
      `🤼 ${attacker} elini ${defender}'ın kıspetinin paçasından içeri sokup diz kapağının üstünden yakaladı; geleneksel iç kazık hamlesiyle rakibin bacağını yukarı asıldı!`,
      // Sahne 5: Ters Paça Kapma & Kündeye Hazırlık
      `🔄 ${attacker} çevikçe ${defender}'ın arkasına dolandı, çapraz paçasının dikişinden sımsıkı kavrayarak rakibi kündeye kaldırmak için altına girdi!`,
      // Sahne 6: Yan Süpürme & Kumlara Sürükleme
      `🍂 ${attacker} ayak tabanıyla ${defender}'ın ayak bileğini içeri doğru süpürdü; dengesini kaybeden dev cüsse er meydanının kumlarına doğru kaykıldı!`
    ];
    return kt.random(scenes);
  },

  // === 4. FIRLATMALAR & KÜNDELER (THROWS, SLAMS & IMPACT) - 6 SAHNE ===
  generateThrowOrKunde(attacker, defender, damage) {
    const scenes = [
      // Sahne 1: Bel Kündesi
      `💥 ${attacker} iki elini ${defender}'ın belinde kavuşturup kalçasını altına soktu; havaya fırlattığı rakibini yarım tur döndürerek sırtüstü kumlara çarptı! Er meydanı sarsıldı! (-${damage} Can)`,
      // Sahne 2: Şark Kündesi / Suplex
      `⚡ ${attacker} rakibin arkasından kilitlenip yay gibi geriye büküldü; ${defender}'ı kendi başının üzerinden aşırıp iki omzunu kumlara gömecek şekilde yere çaldı! (-${damage} Can)`,
      // Sahne 3: Boyunduruktan Kalça Savurması
      `🌪️ Boyunduruğu bırakmayan ${attacker}, vücudunu 180 derece döndürüp kalçasını kaldıraç yaptı; ${defender} havada fırıldak gibi dönerek sertçe toprağa yapıştı! (-${damage} Can)`,
      // Sahne 4: Yan Künde
      `☄️ ${attacker} rakibin tek kolunu ve paçasını aynı anda sıkarak yana doğru devasa bir yay çizdi; ${defender} havada savrularak ahşap direklerin dibine sert bir iniş yaptı! (-${damage} Can)`,
      // Sahne 5: Ayı Sarmalı ile Kumlara Gömme
      `🐻 ${attacker} kollarını ${defender}'ın kaburgalarına kenetleyip iki metrelik devi göğsüne kaldırdı, ardından iki adım koşarak sırtüstü kumların ortasına vurdu! (-${damage} Can)`,
      // Sahne 6: Paça Kündesi & Ters Çalma
      `🌪️ Paçadan yakalanan bacağı havaya diken ${attacker}, omzunun tersiyle ${defender}'ı havada takla attırarak sırtüstü kumlara kilitledi! (-${damage} Can)`
    ];
    return kt.random(scenes);
  },

  // === 5. TUŞ & PES ETME & KİLİTLER (SUBMISSIONS & PINS) - 6 SAHNE ===
  generatePinOrSubmission(attacker, defender, damage) {
    const scenes = [
      // Sahne 1: İki Omuz Yapıştırma Baskısı (Tuş Girişimi)
      `📌 ${attacker} kumlara serilen ${defender}'ın göğsünün üzerine tüm ağırlığıyla çöktü; iki omzunu birden toprağa yapıştırmak için kollarını çapraz bastırıyor! (-${damage} Can)`,
      // Sahne 2: Kaburga Mengenesi (Bearhug / Rib Compressor)
      `🗜️ ${attacker} bacaklarını ve kollarını ${defender}'ın göğüs kafesine mengene gibi doladı; nefes almasını imkansız kılan bu acımasız pres rakibin tüm direncini eritiyor! (-${damage} Can)`,
      // Sahne 3: Çift Kol Kıspet Kilidi
      `🥋 ${attacker}, ${defender}'ın kollarını kendi kıspet paçalarının altına sıkıştırıp kıpırdayamaz hale getirdi; çaresiz kalan güreşçi kurtulmak için başını kumlara vuruyor! (-${damage} Can)`,
      // Sahne 4: Kafakol Kilidiyle Zemin Presi
      `🔒 ${attacker} rakibin kafasını koltuğunun altına alıp kumlara çiviledi; kan dökmeden, tamamen boyun ve omuz baskısıyla pes ettirme sınırına getirdi! (-${damage} Can)`,
      // Sahne 5: Sırtı Kumlara Gömen Ağırlık
      `🏋️ ${attacker} tüm kas kütlesiyle ${defender}'ın sırtını kumlara mıhladı; hakem diz çöküp iki omzun yere değip değmediğini kontrol etmek için yaklaştı! (-${damage} Can)`,
      // Sahne 6: Takati Bitiren Boğuşma Sarmalı
      `⏳ Dakikalar süren nefes kesici güç mücadelesinde ${attacker} rakibinin üstünde kaya gibi kaldı; ${defender}'ın kolları gevşemeye, nefesi kesilmeye başladı! (-${damage} Can)`
    ];
    return kt.random(scenes);
  },

  // === 6. KIYAFET / KISPET / DONANIM & ÇEVRE ETKİLEŞİMİ - 6 SAHNE ===
  generateGearInteraction(fighter, stage) {
    if (stage === 1) {
      const list = [
        `🥋 Şiddetli asılmayla ${fighter}'ın kıspet paçasındaki keten bağ çözüldü; paça serbest kalarak bacağına dolandı!`,
        `🥋 ${fighter}'ın deri kıspetinin kasnak dikişleri gıcırdadı; yağlı derinin gerilme sesi tüm ön sıralardan duyuldu.`,
        `🥋 Hamlenin hızıyla ${fighter}'ın bileğindeki keten sargı çözülüp kumların üzerine savruldu.`
      ];
      return kt.random(list);
    } else if (stage === 2) {
      const list = [
        `💦 Kıspete sürülen zeytinyağı ve oluk oluk akan ter, ${fighter}'ın tüm gövdesini aynaya çevirdi; rakibin elleri tuttuğu yerden kayıp boşluğa düşüyor!`,
        `🪵 ${fighter} geriye savrulduğunda er meydanının kalın ahşap sınır kazığına sırtını sertçe çarptı; direk yerinden oynadı!`,
        `🌾 ${fighter}'ın göğsü ve sırtı kızıl er meydanı kumlarıyla tamamen kaplandı; ter ve kum adelelerin kıvrımlarını devasa bir kaya heykeline dönüştürdü!`
      ];
      return kt.random(list);
    } else {
      const list = [
        `🤼 ${fighter}'ın kıspetinin deri askıları zorlanmaktan koptu; sadece bel kuşağıyla tutunan pehlivan, çıplak göğsü ve kumlara bulanmış adeleleriyle son nefesine kadar güreşiyor!`,
        `🌪️ Dövüşün şiddetinden meydanın kum torbaları patladı; ${fighter} toz ve kum fırtınasının ortasında dev bir gladyatör gibi dikildi!`,
        `👑 ${fighter}'ın tüm bedeni ter, yağ ve kum zırhına büründü; tribünlerdeki binlerce kişi bu destansı pehlivan cüssesini ayakta alkışlıyor!`
      ];
      return kt.random(list);
    }
  },

  // === 7. MEYDAN TELLALININ (CAZGIRIN) COŞKULU MANİLERİ VE MEYDAN NİDALARI ===
  generateCazgirCommentary(fighterA, fighterB) {
    const commentaries = [
      `📢 Meydan Tellalı er meydanının ortasına fırlayıp ipek mendilini sallayarak gürledi: 'Kadim dağların devleridir güreşin piri! Er meydanında bellidir yiğidin eri! ${fighterA} alttan dalar künde arar, ${fighterB} üstten bastırır paça sarar! Vur pençeyi, göster gücünü, şan olsun bu meydana!'`,
      "📢 Meydan Tellalı ellerini göğe kaldırıp narayı patlattı: 'Sallandıkça sarsılan dağlar gibidir boyları! Burası kanlı cellat meydanı değil, dev cüsseli pehlivanların kıspet kuşanıp bilek büktüğü şeref meydanıdır! Güreşin ey aslanlar, meydan yiğit görsün!'",
      "📢 Meydan Tellalı davulculara işaret ederek ritmi hızlandırdı: 'Hey gidi hey! Biri taş döver biri demir büker! Ne hile var ne kalleşlik; saf bilek, hakiki yürek var bu meydanda!'",
      `📢 Er Meydanı Tellalı gür sesiyle haykırdı: 'Gözlerinizi açın ey ahali! ${fighterA} ile ${fighterB}'nin sırtı yere gelmez derlerdi, bakın iki boğa gibi nasıl birbirinin nefesini tartıyorlar!'`,
      "📢 Tellal seyircileri coşturdu: 'Altında kaldım diye erinme, üstüne çıktım diye sevinme! Pehlivan dediğin kündeyi vurur, tuş eden şampiyon olur!'"
    ];
    return kt.random(commentaries);
  },

  // === 8. İZLEYİCİ & TRİBÜN TEPKİLERİ ===
  generateSpectatorReaction(stage) {
    if (stage === 1) {
      const list = [
        "👥 Er meydanını saran yüzlerce güreşsever parmaklarını korkuluklara dayadı; davulun 'güm-güm' ritmine el çırparak tempo tutmaya başladılar.",
        '👥 Garnizon askerleri kılıçlarının kınlarını ahşap sıralara vurarak gürültülü bir cenk tezahüratı başlattı.'
      ];
      return kt.random(list);
    } else if (stage === 2) {
      const list = [
        "👥 Bel kündesine kalkan dev cüsseleri gören seyirciler bir anda ayağa fırladı! 'Vur kündeyi! Savur kumlara!' naraları gökyüzünü yardı.",
        '👥 Ahşap tribünler binlerce kişinin aynı anda zıplamasıyla beşik gibi sallandı; zeytinyağı kokusu ve toz bulutu nefesleri kesti.'
      ];
      return kt.random(list);
    } else {
      const list = [
        "👥 Bütün arena tek bir ağızdan haykırdı: 'TUŞ! TUŞ GELİYOR!' İki omzun kumlara yaklaştığını gören hakemler dizlerinin üstüne kaydı!",
        '👥 Tribünlerden er meydanının kumlarına gümüş ve bakır sikkeler yağmaya başladı; böyle bir güç savaşı yıllardır görülmemişti!'
      ];
      return kt.random(list);
    }
  },

  // === 9. MAÇ SONU: TUŞ VEYA PES ETME (VICTORY / PIN) ===
  generateVictory(winner, loser, isPin) {
    if (isPin) {
      const log = `🏁 HAKEM DİZ ÇÖKÜP ELİNİ KUMLARA ÜÇ KEZ VURDU VE HAYKIRDI: 'TUŞ! TUŞ! TUŞ!' ${winner}, ${loser}'ın iki omzunu birden kızıl kumlara çiviledi! Davullar ve zurnalar zafer havasına geçti; ${winner} Er Meydanı'nın Başpehlivanı ilan edildi!`;
      const reason = `${loser} iki omzu kumlara yapışarak mağlup oldu (TUŞ!).`;
      return [log, reason];
    } else {
      const log = `🏁 ${loser} kaburga mengenesinin ve nefessiz bırakan boyunduruğun altında daha fazla dayanamadı; elini kumlara hızlıca vurarak 'PES!' dedi. ${winner} rakibini derhal ayağa kaldırıp elini sıktı ve meydanın kadim töresiyle selamladı.`;
      const reason = `${loser} kilit altında pes etti (Teslimiyet).`;
      return [log, reason];
    }
  },
};

