import * as kt from '../../kt.js';

export const ArenaTrapType = kt.defineEnum('ArenaTrapType', {
  SPIKE_WALL: { title: 'Kazıklı Ahşap Bariyer', icon: '🪵' },
  HANGING_CAGE: { title: 'Asılı Demir Kafes', icon: '⛓️' },
  FIRE_BRAZIER: { title: 'Köz & Alev Çanağı', icon: '🔥' },
  CHAIN_RING: { title: 'Zincirli Duvar Halkası', icon: '⛓️' },
  GRAVEL_PIT: { title: 'Kızıl Çakıl Hendegi', icon: '🪨' },
});

export const BeastCombatNarratives = {
  // === 1. GİRİŞ ANLATIMLARI ===
  generateSingleBeastIntro(fighterName, beastName, outfitDesc) {
    const intros = [
      `🥩 Arenanın paslı demir kapısı gıcırdayarak yukarı çekildi! Kafesten fırlayan ${beastName} kızıl kumları hırsla tırnaklayıp ciğer delen bir kükremeyle arenayı inletti. Karşısında tek bir çeliği dahi olmayan ${fighterName}, üzerindeki ${outfitDesc} ve elindeki pelerin kumaşıyla bir matador gibi tek başına bekliyor! Vahşet sarhoşu kalabalık demir parmaklıkları döverek kükrüyor!`,
      `🥩 Kum pistin ortasında kükürt ve kan kokusu yükseldi! ${beastName} köpüklü çenesi ve alev saçan gözleriyle ${fighterName}'ye kilitlendi. ${fighterName} vücudunu yana çevirip bir boğa güreşçisi edasıyla ağırlığını parmak uçlarına verdi; binlerce kaba seyirci kalkanlarını sıraya vurarak tempo tutuyor!`,
      `🥩 Tellal demir kafesin tepesine çıkıp haykırdı: 'Gözlerinizi açın ey kana susamışlar! Çelik yok, zırh yok; sadece et, pençe ve çıplak bilekler var!' ${beastName} başını öne eğip ölümcül hücumuna başladı; ${fighterName} saniyeleri sayıyor!`,
      `🥩 Taş Hisar'ın alt kat zindanlarından salınan ${beastName} açlıktan gözü dönmüş halde tozu dumana kattı. ${fighterName} üzerinde ${outfitDesc} ile son derece sakin; bir matadorun ölüm karşısındaki soğukkanlılığıyla kumaşını rüzgara açtı!`
    ];
    return kt.random(intros);
  },

  generateBeastPackIntro(fighterName, packName, outfitDesc) {
    const intros = [
      `🐺 Arenanın dört köşesindeki gizli yer altı kapakları zincirlerle havaya kalktı! ${packName} hırlayarak ve dişlerini şaklatarak kumların üzerine fırladı. Aç yırtıcılar ${fighterName}'nin etrafını yarım ay şeklinde sarmaya başladı; tribünlerdeki muhafızlar kadeh kaldırıp bahis tutuşuyor!`,
      `🐺 Kum pistte bir değil, organize bir avcı grubu var! ${packName} alçaktan sürünerek ${fighterName}'nin kaçış yollarını tıkadı. Lider yaratık önden dikkat dağıtırken kanat avcıları bacak tendonlarını kolluyor. ${fighterName} sırtını duvara vermemek için tetikte!`,
      `🐺 'Parçala! Kemiklerini öğüt!' naraları arasında ${packName} eşgüdümlü bir sürü taktiğiyle ${fighterName}'ye doğru adım adım daralan bir çember kurdu. ${fighterName} çıplak yumruklarını sıkarak sürünün gözlerinin içine baktı!`,
      `🐺 Yırtıcıların sivri pençeleri kızıl kumları deşerken ${packName} tek bir vücut gibi hırladı. ${fighterName} üzerindeki ${outfitDesc} ile çevrelenmiş durumda; ya birini diğerine çarpıştıracak ya da parçalanacak!`
    ];
    return kt.random(intros);
  },

  // === 2. 1v1 MATADOR MANEVRALARI (HIZ / ÇEVİKLİK KONTROLÜ) ===
  generateMatadorManeuver(fighterName, beastName, isSuccess, speed) {
    if (isSuccess) {
      const list = [
        `🚩 ${beastName} deli gibi öne atıldı! ${fighterName} üzerindeki yelek kumaşını son salisede savurup mükemmel bir matador adımıyla yana kaydı; boynuzlar boşluğu delip geçerken canavarın sırtı toza bulandı! (Çeviklik Üstünlüğü: ${speed} Hız)`,
        `🚩 ${beastName} ölümcül bir pençe dalışıyla havaya sıçradı! ${fighterName} tek dizinin üstünde yay gibi bükülerek altından kaydı; savrulan kumaş canavarın gözlerini örterken yaratık kumlara saplandı!`,
        `🚩 ${beastName} tüm cüssesiyle toslamak üzere yaklaştığında ${fighterName} bir boğa güreşçisi gibi ayak uçlarında dönerek eksen değiştirdi; canavarın burnu ancak havayı yalayabildi!`,
        `🚩 ${fighterName} matador adımıyla kumaşını sağa savurup gövdesini sola çekti; şaşıran ${beastName} fren yapamayıp hızla boşluğa savruldu!`,
        `🚩 ${beastName} hiddetle kükreyip atıldı ancak ${fighterName} akrobatik bir turna taklasıyla canavarın üstünden aştı ve sırtına sert bir ayak tabanı vuruşu indirdi!`
      ];
      return kt.random(list);
    } else {
      const list = [
        `⚠️ ${fighterName} kumaşıyla matador sıyrılışı denedi ancak ${beastName} ani bir kafa darbesiyle dönüşü kesti! Boynuzun/pençenin tersi ${fighterName}'nin kaburgalarını sıyırarak dengesini bozdu! (Yetersiz Hız: ${speed})`,
        `⚠️ ${beastName} düz koşmak yerine son anda yana pençe attı! ${fighterName} sıyrılamayarak kumların üzerinde sendeledi!`,
        `⚠️ Matador manevrası için kumda yaylanan ${fighterName} çakıllara basıp kaydı; ${beastName}'nin göğüs darbesi nefesini tıkadı!`
      ];
      return kt.random(list);
    }
  },

  // === 3. GÜÇ / BİLEK ÇARPIŞMASI: BOYNUZ, ÇENE VE KUYRUK YAKALAMA (GÜÇ KONTROLÜ) ===
  generateBeastPowerClash(fighterName, beastName, isSuccess, strength, damage) {
    if (isSuccess) {
      const list = [
        `💥 ${fighterName} hücum eden ${beastName}'nin iki boynuzundan/çenesinden çıplak elleriyle yapıştı! Bacaklarını kumlara gömüp devasa bir kuvvetle boynunu büktü ve yaratığı sırtüstü yere çaldı! (-${damage} Can, Güç Başarısı: ${strength})`,
        `💥 ${beastName} üzerine atlarken ${fighterName} hayvanı havada boğazından yakaladı! Pazularındaki damarlar fırlarken canavarı başının üstünden aşırıp sertçe kumlara çarptı! (-${damage} Can)`,
        `💥 Yaratık yanından geçerken ${fighterName} ani bir refleksle ${beastName}'nin kuyruğunu iki eliyle sımsıkı yakaladı! Kendi ekseninde fırıldak gibi dönerek canavarı ahşap arena duvarına fırlattı! (-${damage} Can)`,
        `💥 ${fighterName} yaratığın açılan çenesine iki eliyle asıldı; mengene gibi kenetlenen dişleri iki yana ayırarak diz kapağıyla kafasına acımasız bir darbe indirdi! (-${damage} Can)`,
        `💥 ${beastName}'nin hamlesini göğsünde karşılayan ${fighterName}, hayvanın ön ayaklarını yerden kesip baş aşağı kum zeminine çaktı! (-${damage} Can)`
      ];
      return kt.random(list);
    } else {
      const list = [
        `⚠️ ${fighterName} ${beastName}'nin boynuzunu/kuyruğunu yakalamaya çalıştı fakat canavarın tonluk ivmesi kollarını geriye savurdu! Tutuşu kaçıran savaşçı kumlara yuvarlandı! (Yetersiz Güç: ${strength})`,
        `⚠️ Canavarı kuyruğundan savurma girişimi başarısız oldu; ${beastName}'nin ani kuyruk kırbacı ${fighterName}'nin omzunu delip geçti!`,
        `⚠️ ${fighterName} hayvanın çenesini tutmaya çalışırken pençe darbesiyle geriye püskürtüldü; hamle boşa çıktı!`
      ];
      return kt.random(list);
    }
  },

  // === 4. SIRTA BİNME & ÇIPLAK ELLE BOĞAZ KİLİDİ (SUBMISSION) ===
  generateBeastVaultAndChoke(fighterName, beastName, damage) {
    const list = [
      `🤼 ${fighterName} bir matador gibi sıçrayıp ${beastName}'nin kıllı sırtına bindi! Bacaklarını karnına mengene gibi kenetlerken çıplak kollarını canavarın boğazına kilitledi; soluk borusu kilitlenen yaratık çılgınca zıplıyor! (-${damage} Can)`,
      `🤼 Sırtına kenetlenen ${fighterName} ağırlığını canavarın boyun omuruna verdi; ters kafakol kilidiyle yaratığın başını arkaya doğru bükerek bilincini zorladı! (-${damage} Can)`,
      `🤼 ${beastName} debelenerek ${fighterName}'yi sırtından atmaya çalıştı ancak savaşçı boyun kürkünü bırakmadı; şakağına indirdiği sert yumruklarla canavarı sersemletti! (-${damage} Can)`,
      `🤼 Çıplak kol kilidini koparamayan ${beastName} nefessiz kalarak ön dizlerinin üzerine çöktü; seyirciler bu boğuşmayı ayağa fırlayarak izliyor! (-${damage} Can)`
    ];
    return kt.random(list);
  },

  // === 5. SÜRÜ SALDIRISI VE İKİ CANAVARI ÇARPIŞTIRMA (PACK DYNAMICS) ===
  generatePackCollision(fighterName, packName, isSuccess, strength, damage) {
    if (isSuccess) {
      const list = [
        `🌪️ ${fighterName} üzerine atlayan ilk yırtıcıyı havada boğazından yakaladı! Olağanüstü bir adele gücüyle savurduğu hayvanı, tam arkasından koşan diğer yaratığın kafasına fırlattı! İki canavar kemik çatırtısıyla çarpışıp kumlara devrildi! (-${damage} Can, Çift Yaratık Çarpışması!)`,
        `🌪️ İki yaratık aynı anda iki koldan fırladı! ${fighterName} eğilip birinin kuyruğunu, diğerinin gırtlağını kavrayarak ikisini birden havada tokuşturdu; sersemleyen avcılar birbirinin üstüne yığıldı! (-${damage} Can)`,
        `🌪️ ${fighterName} saldıran kurdun birini tutup arkadan gelen liderin önüne kalkan gibi fırlattı; kendi sürüsünün hayvanına çarpan yaratıklar hırlayarak kumlara savruldu! (-${damage} Can)`,
        `🌪️ ${fighterName} iki yırtıcının kafa kafaya çarpışmasını sağlayarak bir taşla iki kuş vurdu; arenanın tozu dumana katıldı! (-${damage} Can)`
      ];
      return kt.random(list);
    } else {
      const list = [
        `⚠️ ${fighterName} saldıran yaratığı diğerine savurmak istedi ancak iki avcının eşzamanlı ağırlığı kollarını kilitledi; pençeler göğsünü sıyırdı! (Kuvvet Yetmedi: ${strength})`,
        '⚠️ Yaratıklardan birini yakaladıysa da diğeri yandan bacağına diş geçirdi; çarpıştırma girişimi yarım kaldı!',
        `⚠️ Sürünün çevikliği ${fighterName}'nin tutuşunu boşa düşürdü; iki canavar da boşluktan sıyrılarak arkasına geçti!`
      ];
      return kt.random(list);
    }
  },

  generateBeastMeatShield(fighterName, packName, damage) {
    const list = [
      `🛡️ ${fighterName} yakaladığı bir sırtlanı boynundan tutup kendine canlı kalkan yaptı! Sürünün atlayan diğer üyesi sivri dişlerini kendi sürü arkadaşının böğrüne geçirdi! Kargaşadan faydalanan ${fighterName} ikisini birden tekmeleyip yere serdi! (-${damage} Can)`,
      `🛡️ Lider yaratık ölümcül bir atlayış yaptı ancak ${fighterName} sersemleyen küçük yaratığı havaya kaldırıp araya soktu; darbeyi yiyen yaratık acıyla inlerken sürü içinde panik başladı! (-${damage} Can)`,
      `🛡️ ${fighterName} bir yırtıcıyı kucaklayıp diğerinin dişlerinin önüne siper etti; kendi kanlarını akıtan canavarlar birbirine hırlamaya başladı! (-${damage} Can)`
    ];
    return kt.random(list);
  },

  // === 6. ARENA TUZAKLARI VE ÇEVRE UNSURLARI (KURNAZLIK & TUZAK KONTROLÜ) ===
  generateArenaTrapTrigger(fighterName, beastName, trapType, isSuccess, cunning, damage) {
    if (trapType === ArenaTrapType.SPIKE_WALL) {
      if (isSuccess) {
        return `🪵 ${fighterName} sırtını son anda kazıklı ahşap bariyerin önünden çekti! Gözü dönmüş ${beastName} son hızla sivri kazıklara tosladı; göğsü delinen yaratık acı bir böğürtüyle kumlara çakıldı! (-${damage} Can, Tuzak: Kazıklı Bariyer)`;
      } else {
        return `⚠️ ${fighterName} canavarı kazıklara yönlendirmeye çalıştı ancak ${beastName} son anda kazıkları fark edip yana kıvrıldı; tuzak boşa gitti!`;
      }
    } else if (trapType === ArenaTrapType.HANGING_CAGE) {
      if (isSuccess) {
        return `⛓️ ${fighterName} duvardaki mandalı çıplak tekmeyle kırdı! Tavanda asılı ağır demir kafes büyük bir gürültüyle ${beastName}'nin üzerine indi; kafesin demirleri altında ezilen yaratık kımıldayamaz oldu! (-${damage} Can, Tuzak: Düşen Kafes)`;
      } else {
        return `⚠️ ${fighterName} kafes mandalına vurdu ancak zincir paslandığı için zamanında düşmedi; yaratık boşluktan kaçtı!`;
      }
    } else if (trapType === ArenaTrapType.FIRE_BRAZIER) {
      if (isSuccess) {
        return `🔥 ${fighterName} arenanın pirinç köz çanağına sert bir döner tekme attı! Kor alevler ve kızgın küller ${beastName}'nin yüzüne saçıldı; gözleri ve burnu yanan canavar acıyla uluyarak kumlarda yuvarlandı! (-${damage} Can, Tuzak: Alev Çanağı)`;
      } else {
        return `⚠️ ${fighterName} köz çanağını devirmek istedi ancak alev rüzgarı kendi görüşünü kapattı; yaratık dumanın arkasından fırladı!`;
      }
    } else if (trapType === ArenaTrapType.CHAIN_RING) {
      if (isSuccess) {
        return `⛓️ ${fighterName} duvardaki ağır köle zincirini kapıp ${beastName}'nin boynuna doladı! Zinciri taşa çakılı halkaya kilitleyerek yaratığın manevra alanını sıfıra indirdi! (-${damage} Can, Tuzak: Zincir Kilidi)`;
      } else {
        return '⚠️ Zincir yaratığın kaygan boynundan kayıp kumlara düştü; kilit hamlesi tutmadı!';
      }
    } else if (trapType === ArenaTrapType.GRAVEL_PIT) {
      if (isSuccess) {
        return `🪨 ${fighterName} yaratığı kızıl çakıl hendegine doğru cezbetti! Ayakları hendekte kayan ${beastName} dengesini kaybetti; tepeden üzerine indirilen ağır taş vuruşlarıyla sersemledi! (-${damage} Can, Tuzak: Çakıl Hendegi)`;
      } else {
        return `⚠️ ${beastName} hendegi tek bir sıçrayışla aşarak ${fighterName}'nin arkasına düştü!`;
      }
    }
    return null;
  },

  // === 7. YARATIK KARŞI SALDIRISI (PENÇE, DIŞ VE EZİCİ DARBELER) ===
  generateBeastStrike(beastName, fighterName, damage) {
    const strikes = [
      `🩸 ${beastName} jilet gibi keskin pençesini savurarak ${fighterName}'nin omzuna derin bir darbe indirdi; kumaş parçaları yırtılarak kumlara uçuştu! (-${damage} Can)`,
      `🩸 ${beastName} koca çenesiyle ${fighterName}'nin kolunu yakalayıp timsah gibi silkindi; kemikleri çatırdatan baskı nefesleri kesti! (-${damage} Can)`,
      `🩸 ${beastName} arka ayakları üzerinde doğrulup tüm cüssesiyle ${fighterName}'nin göğsüne abandı; savaşçı sırtüstü kumların ortasına savruldu! (-${damage} Can)`,
      `🩸 Canavarın kuyruk kırbacı ve boynuz sıyırışı ${fighterName}'nin bacaklarını yerden kesti; kalkan toz bulutu görüşü kapattı! (-${damage} Can)`,
      `🩸 ${beastName} ani bir sıçrayışla ${fighterName}'nin boğazını hedef aldı; savaşçı kolunu siper ederek kendini son anda ölümcül ısırmadan kurtardı! (-${damage} Can)`
    ];
    return kt.random(strikes);
  },

  // === 8. VAHŞET TELLALI VE SEYİRCİ ÇILGINLIĞI ===
  generateBloodlustAnnouncer(fighterName, beastName) {
    const commentaries = [
      "📢 Vahşet Hakemi parmaklıkların üzerine çıkıp meşaleyi havaya kaldırdı: 'Görün ey Taş Hisar! Burada ipek kumaşlar yok, nezaket yok! Canavarın kanı ile savaşçının teri birbirine karışıyor! Kumu kızıla boyamayan buradan canlı çıkamaz!'",
      "📢 Kafes Tellalı gürledi: 'Aslanlar, kurtlar ve çıplak bilekli bir gladyatör! Parçala onu! Boynunu kır ve başını tribünlere fırlat!'",
      "📢 Anlatıcı seyircileri kışkırttı: 'İşte arenanın vahşi kanunu! Dişe diş, pençeye yumruk! Hayatta kalan hakiki canavar kim, hep birlikte izliyoruz!'",
      `📢 Vahşet Tellalı ellerini iki yana açtı: 'Bağırın ey ahali! ${fighterName} çıplak elleriyle canavarın boynuna bindi! Ya boynuz kırılacak ya da avcı yem olacak!'`
    ];
    return kt.random(commentaries);
  },

  generateBloodlustCrowd() {
    const list = [
      "👥 Demir parmaklıkları tekmeleyen yüzlerce muhafız ve kumarbaz 'ÖLDÜR! PARÇALA!' naralarıyla arenayı inletti; kumların üzerine boş şarap şişeleri ve bakır sikkeler saçıldı!",
      '👥 Tribünlerdeki kaba kalabalık vahşetin kokusuyla ayağa fırladı; kan kokan hava seyircileri adeta hipnoz etti!',
      '👥 Garnizon askerleri kalkanlarını ritmik olarak surlara vurarak cehennemi bir cenk gürültüsü kopardı; dövüşçüye destek naraları göğe yükseldi!'
    ];
    return kt.random(list);
  },

  // === 9. ZAFER VE SON SAHNE (BOYUN EĞDİRME & İNFAZ) ===
  generateVictory(winner, loser, isSingleBeast) {
    if (isSingleBeast) {
      const log = `🏁 ${winner} devasa canavar ${loser}'ın kafasını iki eliyle kumlara çiviledi ve çıplak elleriyle boynunu kırarak hareketsiz bıraktı! Yere serilen canavarın son nefesi kumları havalandırırken, ${winner} yaratığın göğsüne ayağını koyarak kükredi! Vahşet sarhoşu arena alkış tufanıyla sarsıldı!`;
      const reason = `${loser} çıplak ellerle boyun eğdirilerek etkisiz hale getirildi (Canavar Fethi).`;
      return [log, reason];
    } else {
      const log = `🏁 ${winner} ${loser} içindeki alfa yaratığı acımasızca yere serip arenanın kazıklı duvarına çaktı! Liderlerinin çöküşünü gören diğer yırtıcılar kuyruklarını bacaklarının arasına kıstırarak parmaklıkların altındaki karanlık kafeslere kaçıştı! Arena hakemi zaferi ilan etti!`;
      const reason = `${loser} sürüsü liderin düşüşüyle dağıtıldı (Sürü Bozgunu).`;
      return [log, reason];
    }
  },
};

