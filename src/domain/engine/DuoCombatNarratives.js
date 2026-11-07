import * as kt from '../../kt.js';
import { DuoDiscordType, SkillType } from '../model.js';

export const DuoCombatNarratives = {
  // =========================================================================
  // DİNAMİK ANLATIM ÜRETİCİ METOTLARI
  // =========================================================================
  generateOpening(player, ally, enemy1, enemy2, condition) {
    const templates = [
      `🏟️ [KURA DÖVÜŞÜ BAŞLADI!] Kum çukuruna iki koldan inen savaşçılar; Mavi Köşede ${player.name} ve yoldaşı ${ally.name} sırt sırta verirken, Kırmızı Köşede ${enemy1.name} ile ${enemy2.name} ölümcül bir bakışla silahlarını kavradı! Zemin: ${condition.name} (${condition.focusStatName}).`,
      `🏟️ [ARENA BORAZANLARI YANKILANDI!] Taş Hisar tribünlerinin uğultusu arasında dört savaşçı meydana adımlarını attı. ${player.name} ve ${ally.name} çapraz savunma hattı kurarken, ${enemy1.name} ile ${enemy2.name} kumları ezen adımlarla hücuma geçti!`,
      `🏟️ [İKİLİ İTTİFAK MEYDANI!] Çarkın dönüşü kaderi belirledi! ${player.name} yanındaki ${ally.name} ile göz göze gelip başını salladı. Karşıda ise ${enemy1.name} ve ${enemy2.name} kan kokusu almış kurtlar gibi iki kanattan yaklaşmakta!`,
      `🏟️ [DEMİR VE KAN İTTİFAKI!] Kum çukuruna kilitlenen demir kapılar kapandı. ${player.name} ve ${ally.name} meydanın merkezini tutarken, ${enemy1.name} ve ${enemy2.name} zırhlarını şakırdatarak çifte hücum düzenine geçti! Meydan kuralı: ${condition.description}`
    ];
    return kt.random(templates);
  },

  generateAllyIntercept(interceptorName, targetName, attackerName, damageAbsorbed, isShield, triggerCount = 1) {
    return isShield
      ? (
        triggerCount === 1
          ? kt.random([
          `🛡️ [MÜTTEFİK SİPERİ!] ${attackerName} tam ${targetName}'ın savunmasız böğrüne darbe indirecekken ${interceptorName} yıldırım gibi araya girdi! Ağır kalkanını yere mıhlayarak vuruşu zırhında soğurdu (${damageAbsorbed} Hasar absorbe edildi)!`,
          `🛡️ [FEDAKARCA ATILIŞ!] ${targetName} sendelediği anda ${interceptorName} öne fırladı; ${attackerName}'ın ölümcül namlusunu kalkanının göbeğiyle saptırarak yoldaşını mutlak bir darbeden kurtardı!`,
          `🛡️ [AŞILMAZ KALKAN DUVARI!] ${interceptorName} 'Arkama geç!' diye haykırarak kalkanını gerdi; ${attackerName}'ın savurduğu keskin çelik kalkanın üzerinde kıvılcımlar saçarak geri tepti (${damageAbsorbed} Hasar soğuruldu)!`
        ])
          :
        triggerCount === 2
          ? kt.random([
          `🛡️ [İKİNCİ SİPER: SARSILMAZ SADAKAT!] ${interceptorName}, kalkanında beliren çatlaklara aldırmadan ikinci kez ${attackerName} ile yoldaşının arasına daldı! 'Burayı geçemezsin!' narasıyla darbeyi bir kez daha göğüsledi (${damageAbsorbed} Hasar soğuruldu)!`,
          `🛡️ [YİNELENEN FEDAKARLIK!] ${attackerName}'ın ${targetName}'ı hedef alan ardışık hamlesi, yine ${interceptorName}'ın inatçı çelik kalkanına çarparak boşa düştü!`
        ])
          :
        kt.random([
          `🛡️ [ZİRVE SİPER: CAN PAHASINA SUR!] Kan ter içindeki ${interceptorName}, paramparça olmuş kalkanını son bir iradeyle havaya kaldırıp üçüncü kez darbenin önüne atıldı! Arenadaki kalabalık bu insanüstü yoldaşlık bağı karşısında ayağa fırladı (${damageAbsorbed} Hasar soğuruldu)!`,
          `🛡️ [ÖLÜMÜNE YOLDAŞLIK!] Kalkanından saçılan madeni parçalara rağmen ${interceptorName} ${targetName}'ın önüne adeta etten ve çelikten bir kale ördü!`
        ])
      )
      : (
        triggerCount === 1
          ? kt.random([
          `🛡️ [GÖVDE SİPERİ!] ${interceptorName}, ${attackerName}'ın ${targetName}'a inen vuruşunun önüne tereddüt etmeden atıldı! Darbeyi zırhlı omzuyla göğüsleyerek yoldaşına nefes aldırdı (${damageAbsorbed} Hasar soğuruldu)!`,
          `🛡️ [NAMLU SAPTIRMA!] ${attackerName}'ın silahı tam hedefe ulaşacakken ${interceptorName} kılıcının kabzasıyla vuruş çizgisini yukarı saptırdı ve yoldaşını ölümcül yaradan kurtardı!`,
          `🛡️ [CAN PAHASINA ATILMA!] ${targetName}'ın tökezlediğini gören ${interceptorName} araya girerek vuruşun hızını kesti; çelik çeliğe çarptı, taş zemin sarsıldı!`
        ])
          :
        triggerCount === 2
          ? kt.random([
          `🛡️ [İKİNCİ GÖVDE SİPERİ!] Önceki darbenin omzunda bıraktığı sızıya aldırmayan ${interceptorName}, bir kez daha ${targetName}'ın önüne atılarak ${attackerName}'ın vuruşunu zırh plakalarında eritti!`,
          `🛡️ [AMANSIZ KORUMA!] ${interceptorName} yoldaşını geriye çekip kendi gövdesini siper etti; kanayan yarasına rağmen gardını bir an bile düşürmedi!`
        ])
          :
        kt.random([
          `🛡️ [SON DİRENİŞ SİPERİ!] Tükenmenin eşiğindeki ${interceptorName}, ${targetName}'ı kurtarmak için son nefesini harcarcasına kendini namlunun önüne fırlattı! Arenada yankılanan çarpışma sesi tribünleri buz kesti!`
        ])
      );
  },

  generatePincerDoubleTeam(attacker1, attacker2, target, bonusDamage, triggerCount = 1) {
    if (triggerCount === 1) {
      return kt.random([
        `⚔️ [ÇAPRAZ KISKAÇ!] ${attacker1} hasmın dikkatini önden sahte bir hamleyle çekerken, ${attacker2} kör noktadan sessizce süzülüp omuriliğe ölümcül bir darbe vurdu (+${bonusDamage} Çifte Baskı Hasarı)!`,
        `⚔️ [İKİ ATEŞ ARASINDA!] Kumda sırt sırta veren iki yoldaş, ${target}'ı iki cepheden kuşattı. ${attacker1} gardı ezerken ${attacker2} boşta kalan kaburgaya amansızca yüklendi!`,
        `⚔️ [SENKRONİZE ÇİFTE HAMLE!] ${attacker1}'in sağ kanattan savurduğu saldırıdan kaçmaya çalışan ${target}, tam sol kanatta pusuya yatan ${attacker2}'nin namlusuna çarptı (+${bonusDamage} Hasar)!`,
        `⚔️ [İKİLİ BASKI VE YARMA!] ${attacker1} hasmın kalkanını yere mıhladığı saniyede ${attacker2} havaya sıçrayıp boş kalan boyun boşluğunu yardı!`,
        `⚔️ [KUSURSUZ FLANK!] İki savaşçı tek bir vücut gibi hareket etti; ${attacker1}'in vuruşunun hemen ardından ${attacker2}'nin ardışık kesisi indi, ${target} neye uğradığını şaşırdı!`
      ]);
    } else if (triggerCount === 2) {
      return kt.random([
        `⚔️ [YİNELENEN KISKAÇ KILIDI!] ${attacker1} ve ${attacker2} aynı amansız taktiği ikinci kez sahneye koydu! İlk hücumun sersemliğini atlatamayan ${target}, kaçış açısı bulamayıp iki taraftan sıkıştırılan bir mengene gibi aralarında ezildi (+${bonusDamage} Çifte Baskı Hasarı)!`,
        `⚔️ [İKİNCİ DALGA ÇAPRAZ ATEŞ!] Ritimleri bir kat daha hızlanan iki yoldaş, ${target}'ın etrafındaki çemberi daha da daralttı; ${attacker1} sol böğrü parçalarken ${attacker2} sırt zırhını çatlattı!`,
        `⚔️ [KAÇIŞI OLMAYAN MENGENE!] ${target} geriye adım atmak istedi ancak ${attacker2} arkasını çoktan kesmişti; ${attacker1}'in ittiği gövdeyi ${attacker2} havada karşıladı!`
      ]);
    } else {
      return kt.random([
        `⚔️ [ÖLÜMCÜL KISKAÇ KAPAN!] İttifakın koordinasyonu tam bir kıyıma dönüştü! ${attacker1} ve ${attacker2}, nefesi tükenen ${target}'ın etrafında üçüncü kez bir ölüm girdabı ördü; kaçacak tek bir santim kum dahi bırakmadılar (+${bonusDamage} Çifte Baskı Hasarı)!`,
        `⚔️ [ZİRVE ÇİFTE İNFAZ HAMLESİ!] Seyircilerin çılgınca haykırışları arasında iki savaşçı aynı anda hedefe daldı; ${target} iki yönden gelen çeliğin arasında çaresizce diz çöktü!`
      ]);
    }
  },

  generateSynergyCombo(synergyType, initiator, executor, target, extraDamage, triggerCount = 1, skill = null) {
    const skillName = skill?.name ?? synergyType.title;
    // 1. Eylem Cümlesi (Trigger Count'a göre evrilir)
    const actionPhrase = (
      triggerCount === 1 ? DuoCombatNarratives.synergyActionsFirstTime(triggerCount) :
      triggerCount === 2 ? DuoCombatNarratives.synergyActionsRepeated(triggerCount) :
      DuoCombatNarratives.synergyActionsClimax(triggerCount)
    );
    // 2. Enerji / Fiziksel Efekt
    const energyIndex = (triggerCount * 3 + kt.Random.nextInt(DuoCombatNarratives.energyDischargePool.length)) % DuoCombatNarratives.energyDischargePool.length;
    const energyPhrase = DuoCombatNarratives.energyDischargePool[energyIndex];
    // 3. Seyirci / Anlatıcı / Atmosfer
    const atmosphereIndex = (triggerCount * 5 + kt.Random.nextInt(DuoCombatNarratives.atmosphereReactionPool.length)) % DuoCombatNarratives.atmosphereReactionPool.length;
    const atmospherePhrase = DuoCombatNarratives.atmosphereReactionPool[atmosphereIndex];
    // 4. Hedefin Sarsılışı
    const targetImpactIndex = (triggerCount * 2 + kt.Random.nextInt(DuoCombatNarratives.targetConsequencePool.length)) % DuoCombatNarratives.targetConsequencePool.length;
    const targetImpactPhrase = DuoCombatNarratives.targetConsequencePool[targetImpactIndex];
    // Başlık etiketi
    const headerTag = (
      triggerCount === 1 ? `🔥 [${synergyType.title} İTTİFAKI]` :
      triggerCount === 2 ? `⚡ [TEKRARLANAN FIRTINA: ${synergyType.title}]` :
      `💥 [ZİRVE SENFONİ: ${synergyType.title}]`
    );
    return `${headerTag} ${initiator}, ${executor} ile ${actionPhrase} '${skillName}' tekniğini ateşleyerek ${target}'ın üzerine atıldı; ${energyPhrase}, ${atmospherePhrase} (${target} ${targetImpactPhrase}, +${extraDamage} Uyum Hasarı)!`;
  },

  synergyActionsFirstTime(index) {
    return DuoCombatNarratives.actionPhrasesInitial[(index + kt.Random.nextInt(DuoCombatNarratives.actionPhrasesInitial.length)) % DuoCombatNarratives.actionPhrasesInitial.length];
  },

  synergyActionsRepeated(index) {
    return DuoCombatNarratives.actionPhrasesRepeated[(index + kt.Random.nextInt(DuoCombatNarratives.actionPhrasesRepeated.length)) % DuoCombatNarratives.actionPhrasesRepeated.length];
  },

  synergyActionsClimax(index) {
    return DuoCombatNarratives.actionPhrasesClimax[(index + kt.Random.nextInt(DuoCombatNarratives.actionPhrasesClimax.length)) % DuoCombatNarratives.actionPhrasesClimax.length];
  },

  generateSkillExecutionNarrative(attacker, defender, weapon, skill, damage, isCrit, defenderHpLeft, defenderMaxHp, triggerCount = 1) {
    const critText = isCrit
      ? 've zırhı parçalayan YIKICI bir kritik darbe indirdi'
      : 've savuşturulamaz sertlikte bir darbe indirdi';
    const critTag = isCrit ? '💥 [KRİTİK YETENEK]' : `${skill.icon} [YETENEK: ${skill.name}]`;
    const executionPhrase = (
      skill.type === SkillType.ATTACK
        ? (
        triggerCount === 1
          ? kt.random([
          `${attacker} tüm vücut ağırlığını ${weapon} namlusuna yükleyip '${skill.name}' hamlesiyle öne fırladı`,
          `${attacker} gözü dönmüş bir savaş narasıyla ${defender}'ın gardını delmek üzere '${skill.name}' tekniğini savurdu`,
          `${attacker} kumları ezen adımlarla hız alıp '${skill.name}' kudretini serbest bıraktı`
        ])
          :
        triggerCount === 2
          ? kt.random([
          `${attacker} aynı ölümcül ritmi hız kesmeden sürdürerek '${skill.name}' darbesini ikinci kez indirdi`,
          `${attacker} ilk vuruşun ivmesini kaybetmeden ${weapon} ile '${skill.name}' hamlesini bu kez daha vahşi bir açıyla tekrarladı`
        ])
          :
        kt.random([
          `${attacker} artık hasmın direncini tamamen kırmak üzere '${skill.name}' tekniğini zirve bir gazapla üçüncü kez hayata geçirdi`,
          `${attacker} durdurulamaz bir kasırgaya dönüşerek '${skill.name}' darbesiyle arenayı inletti`
        ])
      )
        :
      skill.type === SkillType.TACTICAL
        ? (
        triggerCount === 1
          ? kt.random([
          `${attacker} zemin seviyesinden akrobatik bir kavis çizerek '${skill.name}' ile hasmın kör noktasına aktı`,
          `${attacker} ${defender}'ın göz kırpma anındaki boşluğu affetmeyip '${skill.name}' tekniğiyle açık aradı`
        ])
          :
        kt.random([
          `${attacker} aynı çevik manevrayı bir kez daha tekrarlayıp '${skill.name}' ile hasmın dengesini altüst etti`,
          `${attacker} adeta bir gölge gibi süzülerek '${skill.name}' hamlesiyle ${defender}'ı savunmasız bıraktı`
        ])
      )
        :
      skill.type === SkillType.DEFENSE
        ? kt.random([
        `${attacker} toprağa kök salmış kadim bir kaya gibi duruşunu sabitleyip '${skill.name}' zırhını kuşandı`,
        `${attacker} gelen baskıyı zırhında ve ruhunda sönümlemek üzere '${skill.name}' iradesini devreye soktu`
      ])
        :
      skill.type === SkillType.ULTIMATE
        ? kt.random([
        `${attacker} tüm varlığını ve nefesini tek bir noktaya odaklayarak '${skill.name}' nihai tekniğini arenanın göbeğinde patlattı!`
      ])
        :
      null
    );
    const crowdVibe = DuoCombatNarratives.atmosphereReactionPool[kt.Random.nextInt(DuoCombatNarratives.atmosphereReactionPool.length)];
    return `${critTag} ${executionPhrase}; ${critText}! ${crowdVibe} (${damage} Hasar, Kalan Can: ${defenderHpLeft}/${defenderMaxHp})`;
  },

  generateDiscordIncident(discordType, fighter1, fighter2, affectedFighter) {
    if (discordType === DuoDiscordType.RECKLESS_BERSERK) {
      return kt.random([
        `⚠️ [KABZA ÇARPIŞMASI!] ${fighter1} ve ${fighter2} aynı hedefe kör bir öfkeyle atılınca geniş savrulan silahlarının sapları birbirine çarptı! Çıkan kıvılcımlarla ikisi de tökezleyip açık verdi!`,
        `⚠️ [KONTROLSÜZ SAVRULMA!] ${fighter1}'in gözü dönmüş şekilde savurduğu dev silah neredeyse yoldaşı ${fighter2}'nin boynunu biçecekti! ${fighter2} geri kaçmak zorunda kalınca hücum hattı bozuldu!`,
        '⚠️ [VAHŞET KARGAŞASI!] İki savaşçı da hasmın üzerine aynı anda atılınca omuz omuza çarpıştılar; silahların savrulma açısı kapandı ve fırsat kaçtı!'
      ]);
    } else if (discordType === DuoDiscordType.SPEED_GAP) {
      return kt.random([
        `⚠️ [KOPUK TEMPO!] ${fighter1} aşırı çevik adımlarla ileri fırladı ancak ağır zırhlı yoldaşı ${fighter2} geride kaldı! ${fighter1} iki rakibin ortasında tek başına kısılıp zor anlar yaşadı!`,
        `⚠️ [RİTİM UYUŞMAZLIĞI!] ${fighter1}'in başlattığı hızlı hücuma ${fighter2} yetişemedi; saflar arasında açılan boşluğu gören rakipler araya sızdı!`,
        `⚠️ [YALNIZ KALAN ÖNCÜ!] ${fighter1} çok hızlı daldığı için arkasındaki korumayı kaybetti; yoldaşı nefes nefese yetişmeye çalışırken ${fighter1} çifte baskı altında kaldı!`
      ]);
    } else if (discordType === DuoDiscordType.GREEDY_RIVALRY) {
      return kt.random([
        `⚠️ [ŞAN HIRSI REKABETİ!] Hem ${fighter1} hem de ${fighter2} son vuruşu kendi namına yazma hırsıyla aynı anda atıldı; birbirlerinin vuruş çizgisini kapatıp rakibe kolay bir kaçış sundular!`,
        `⚠️ [KİBİR SÜRTÜŞMESİ!] ${fighter1} 'Bu av benim!' dercesine yoldaşının önüne geçti; ${fighter2} hamlesini yarıda kesmek zorunda kalınca ikisi de açık hedef haline geldi!`,
        '⚠️ [HEDEF KARGAŞASI!] İki kibirli dövüşçü aynı noktayı vurmak için çekişince kılıçları birbirine dolandı ve gardları düştü!'
      ]);
    } else if (discordType === DuoDiscordType.CROWDED_CHAOS) {
      return kt.random([
        `⚠️ [DAR ALAN MANEVRA KISITI!] Meydanın kısıtlı alanında ${fighter1}'in geniş kılıç savuruşu ${fighter2}'nin hareket kabiliyetini sıfırladı; ikisi de darbeyi tamamlayamadı!`,
        '⚠️ [KUMDA TÖKEZLEME!] Dar geçitte birbirinin ayağına basan iki yoldaş kısa bir an sendeleyerek savunma dengesini yitirdi!'
      ]);
    } else if (discordType === DuoDiscordType.NONE) {
      return '';
    }
    return null;
  },

  generateTeammateFallen(fallenName, survivorName, opponentsRemaining) {
    const templates = [
      `💀 [YOLDAŞ YERE YIĞILDI!] ${fallenName} aldığı ağır darbelerin ardından kumun üzerine kanlar içinde serildi ve bilincini kaybetti! ${survivorName} artık ${opponentsRemaining} rakibe karşı kum çukurunda TEK BAŞINA!`,
      `💀 [İTTİFAK KIRILDI!] ${fallenName}'ın kalkanı elinden düştü, gözleri kararıp yere çöktü. ${survivorName} yoldaşının baygın bedenine bir an bakıp dişlerini sıktı; çember onun üzerine daralıyor!`,
      `💀 [KAYIP VE ÖFKE!] ${fallenName} devrilirken arenadan uğultulu bir çığlık yükseldi. Sayıca azalan ${survivorName}, kan çanağına dönen gözleriyle etrafını saran ${opponentsRemaining} avcıya meydan okuyor!`,
      `💀 [SON NEFESE KADAR TEK!] ${fallenName} kumların üzerine boylu boyunca uzandı. ${survivorName} derin bir nefes alarak sırtını arenanın taş duvarına yasladı: Artık merhamet yok, sadece hayatta kalma savaşı!`,
      `💀 [YOLDAŞIN DÜŞÜŞÜ!] ${fallenName}'ın bilinci kapandı. Hasmın iki savaşçısı zafer naralarıyla ${survivorName}'ın üzerine doğru adımlarını hızlandırdı!`
    ];
    return kt.random(templates);
  },

  generateLastStandTurn(survivorName, opponent1, opponent2) {
    const templates = [
      `🔥 [1'E 2 KANLI DİRENİŞ!] Sayıca dezavantajda olan ${survivorName}, hem ${opponent1} hem de ${opponent2}'den gelen çifte darbeleri insanüstü bir refleks ve adrenalinle savuşturmaya çalışıyor!`,
      `🔥 [KÖŞEYE KISILMIŞ ASLAN!] ${opponent1} önden baskı kurarken ${opponent2} arkadan boşluk arıyor; ${survivorName} can havliyle vahşi bir döner kesi savurarak ikisini de bir adım geri püskürttü!`,
      `🔥 [NEFES NEFESE DÜELLO!] Dört bir yandan inen çelik sesleri arasında tek başına kalan ${survivorName}, her darbede kumları sıçratarak sonuna kadar direniyor!`,
      `🔥 [ÇEMBERDE MÜCADELE!] İki kurt tek bir avın etrafında dönerken ${survivorName} gardını bir an bile düşürmeden iki cepheye birden kılıç sallıyor!`,
      `🔥 [YALNIZ SAVAŞÇININ GAZABI!] Yoldaşının intikamı için gözü dönen ${survivorName}, iki rakibin arasına dalıp çifte savunma kalkanı oluşturdu!`
    ];
    return kt.random(templates);
  },

  generateConditionEffect(condition, beneficiary, victim) {
    if (condition.id === 'loose_sand') {
      return kt.random([
        `⚡ [GEVŞEK KUM ETKİSİ!] Batak kum zemininde hafif adımlı ${beneficiary} su gibi kayarak hız avantajı sağlarken, ağır zırhlılar kuma saplanıp yavaşladı!`,
        `⚡ [KUMDA ÇEVİKLİK!] ${beneficiary} kumun akışını adımlarına uydurarak çevik bir sıyrılış gerçekleştirdi; zemin hantal rakipleri yoruyor!`
      ]);
    } else if (condition.id === 'narrow_pass') {
      return kt.random([
        `🛡️ [DAR BOĞAZ DİRENCİ!] Granit blokların daralttığı geçitte ${beneficiary} kalkanını duvara dayayarak hasarı minimuma indirdi; kaçış alanı yok, saf zırh konuşuyor!`,
        `🛡️ [AŞILMAZ GEÇİT!] Dar alanda geniş savuruşlar taşa çarparken ${beneficiary} dik duruşuyla geçidi kapattı!`
      ]);
    } else if (condition.id === 'wind_tempest') {
      return kt.random([
        `🌪️ [KUZEY FIRTINASI MENFEZİ!] Sur menfezinden esen dondurucu rüzgar ${beneficiary}'nin yetenek odaklanmasını körükledi; yeteneklerin bekleme süresi hızlanıyor!`,
        `🌪️ [GÖZ YAKAN TİPİ!] Soğuk rüzgar gözleri yakarken içgüdüleriyle dövüşen ${beneficiary} sanatsal bir hamle sergiledi!`
      ]);
    } else if (condition.id === 'blood_pit') {
      return kt.random([
        `🩸 [KIZIL ÇAMUR VAHŞETİ!] Ayakların kaydığı kanlı çamurda ${beneficiary} vahşi bir hırsla kritik vuruş gücünü artırdı; darbeler kemik çatlatıyor!`,
        '🩸 [KAN ÇUKURU KONDİSYONU!] Zemindeki kan kokusu arenadaki vahşeti körükledi, savrulan darbeler daha derin yaralar açıyor!'
      ]);
    } else {
      return '';
    }
  },

  generateVictory(player, ally, condition) {
    const templates = [
      `🏆 [2v2 İTTİFAK ZAFERİ!] Taş Hisar arenasında kum tozu yatışırken ayakta kalanlar ${player.name} ve yoldaşı ${ally.name} oldu! Tribünler iki gladyatörün kusursuz uyumunu alkışlarla kutluyor!`,
      `🏆 [MEYDAN BİZİMDİR!] İki rakip de kumların üzerine serildi. ${player.name} ve ${ally.name} silahlarını havaya kaldırarak zafer naraları attı! Zemin kuralı: ${condition.name} aşıldı!`,
      `🏆 [KUSURSUZ İTTİFAK ZAFERİ!] Ne dar zemin ne de çifte tehdit onları durdurabildi. ${player.name} ile ${ally.name} sırt sırta vererek arenanın çarkını lehlerine çevirdi!`,
      `🏆 [KANLI KUMDA MUTLAK ZAFER!] Son rakip de nakavt oldu. Tellallar bağırıyor: 'Mavi Köşe galip geldi! ${player.name} ve ${ally.name} kura arenasını fethetti!'`
    ];
    return kt.random(templates);
  },

  generateDefeat(player, ally, enemy1, enemy2) {
    const templates = [
      `☠️ [2v2 İTTİFAK MAĞLUBİYETİ!] ${player.name} ve yoldaşı ${ally.name}, ${enemy1.name} ile ${enemy2.name}'nin amansız baskısı altında daha fazla dayanamayarak yere yığıldı.`,
      '☠️ [KUMDA HÜZÜN!] İki yoldaş da son nefeslerine kadar omuz omuza direndi ancak Kırmızı Köşenin çifte hücumu maçı bitirdi.',
      '☠️ [İTTİFAK DAĞILDI!] Koordinasyon eksikliği ve rakiplerin sert vuruşları Mavi Köşenin direncini kırdı. Hekimler sedyelerle kum çukuruna koşuyor.',
      `☠️ [ÇARPININ TERS YÜZÜ!] ${enemy1.name} ve ${enemy2.name} arenanın ortasında zafer naraları atarken ${player.name} ve ${ally.name} kumların üzerinde yenilgiyle tanıştı.`
    ];
    return kt.random(templates);
  },
};
// =========================================================================
// MODÜLER KELİME VE ANLATIM HAVUZLARI
// =========================================================================
// 1. İkili Eylem & Hücum Başlatma Kalıpları
DuoCombatNarratives.actionPhrasesInitial = [
  'kusursuz bir zamanlamayla sırt sırta verip',
  'aralarındaki kadim bağı konuşturup tek bir vücut gibi',
  'çapraz açılardan koordineli bir hücum başlatarak',
  'kumları havalandıran fırtına gibi bir ivmeyle',
  'adımlarını ritmik bir ölüm dansına dönüştürerek',
  'hasmın kaçış koridorlarını iki koldan kilitleyerek',
  'birlikte hız alıp arenanın merkezini yararak',
  'birbirlerinin adımlarını tamamlayan kusursuz bir senkronla'
];
DuoCombatNarratives.actionPhrasesRepeated = [
  'aynı ölümcül ahenkle ikinci kez sahne alıp',
  'öfkesi katlanan iki yoldaş hız kesmeden tekrar hücuma kalkıp',
  'hasmın toparlanmasına fırsat vermeden ardışık ikinci dalgayı başlatıp',
  'bu kez daha sert ve amansız bir öfkeyle tekrar kenetlenip',
  'kum çukurundaki baskıyı bir kat daha artırarak yeniden',
  'taktiksel üstünlüğü koruyup aynı ölümcül kombinasyonu tekrar ateşleyerek',
  'hasmın gardını ikinci kez zorlamak üzere yeniden iki koldan atılarak'
];
DuoCombatNarratives.actionPhrasesClimax = [
  'artık bir ölüm senfonisine dönüşen bu kombinasyonla üçüncü kez',
  'rakibin direncini kökten kırmak üzere tüm güçleriyle yeniden',
  'kum çukurunu inleten kaçınılmaz bir gazap dalgasıyla bir kez daha',
  'arenanın tozunu göğe savuran zirve bir uyumla',
  'hasma nefes dahi aldırmayan acımasız bir kuşatma temposuyla',
  'son ve ezici darbeyi indirmek amacıyla insanüstü bir hırsla birleşip'
];
// 2. Enerji, Şok Dalgası, Element ve Madeni Çarpışma Havuzu
DuoCombatNarratives.energyDischargePool = [
  'ortaya muazzam bir kinetik şok dalgası çıkarırken',
  'silahlardan fışkıran kor kıvılcımlar arenanın taş duvarlarını aydınlatırken',
  'havayı yırtan tiz bir çelik ıslığı ve yakıcı bir enerji dalgası yayılırken',
  'kum tanelerini alev alev tutuşturan kızıl bir aura etrafa saçılırken',
  'zemini beşik gibi sallayan ezici bir basınç dalgası patlak verirken',
  'havada asılı kalan toz bulutunu ikiye yaran dondurucu bir rezonans eserken',
  'etraftaki meşalelerin alevlerini savuracak denli şiddetli bir patlama sesiyle',
  'adeta gök gürültüsünü andıran madeni bir uğultu tüm sahayı inletirken',
  'kas ve çeliğin mutlak sentezinden doğan yıkıcı bir fırtına koparken',
  'çarpışmanın şiddetiyle zemin taşları yerinden oynayıp etrafa parçalar fırlarken'
];
// 3. Seyirci, Tellal, Kumandan ve Arena Atmosferi Havuzu
DuoCombatNarratives.atmosphereReactionPool = [
  'tribünlerdeki izleyiciler kamaşan gözlerini sakınarak geriye çekildi!',
  'arena tellalı şaşkınlıkla nefesini tutup basamaklardan aşağı naralar attı!',
  'on binlerce seyirci adeta tek bir nefesle ayağa fırlayıp dehşet içinde çığlık attı!',
  'locadaki soylular hayretle şarap kadehlerini ellerinden düşürdü!',
  'kum çukurunu çevreleyen muhafızlar mızraklarını kalkanlarına vurarak bu ihtişamı selamladı!',
  'arena kumandanı soluğunu tutarak bu akıl almaz manevrayı büyülenmiş gibi izledi!',
  "tribünlerden kopan uğultu Taş Hisar'ın surlarını aşacak bir gürültüye dönüştü!",
  "anlatıcının deyimiyle 'kum çukuru bugün hakiki bir gladyatör gazabına şahitlik ediyor' feryatları yankılandı!",
  'toz ve kan kokusu birbirine karışırken tüm arena büyülenmişçesine sessizliğe gömülüp ardından kükredi!',
  'kum çukurundaki çığırtkanlar heyecandan bayraklarını düşürdü!'
];
// 4. Hedefin Darbeyi Alışı, Sarsılması ve Zırh Hasarı Havuzu
DuoCombatNarratives.targetConsequencePool = [
  'aldığı çifte darbeyle geriye doğru savrulup sendeledi',
  'savunma kalkanı çatırdadı ve kaburgalarına inen baskıyla nefesi kesildi',
  'iki ateş arasında kalarak neye uğradığını şaşırdı ve acı bir feryatla diz çöktü',
  'dengesi tamamen çöktü; zırh plakaları yarılarak kumlara parçalar saçıldı',
  'can havliyle gardını toplamaya çalışsa da darbenin ivmesiyle sendeleyerek kan tükürdü',
  'bu kombine hücum karşısında zırhı yetersiz kaldı ve derin yaralar açıldı',
  'darbenin kinetik şiddetiyle metrelerce sürüklenip kumların üzerinde savruldu',
  'tüm savunma hattı yarıldı ve göğsüne inen baskıyla gözleri karardı'
];

