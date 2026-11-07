import * as kt from '../kt.js';
import { CharacterCategory, CharacterProfile, Enemy, FighterPersonality, GladiatorSkill, PersonalityArchetype, SkillType, Stats } from '../domain/model.js';

export const TashisarGladiatorsData = {
  // 15 KADIN DÖVÜŞÇÜ & 25 ERKEK DÖVÜŞÇÜ (TOPLAM 40 TAŞ HİSAR ARENA GLADYATÖRÜ)
  createTashisarEnemies() {
    return [
      // === 15 KADIN GLADYATÖR ===
      new Enemy({
        id: 'fighter_aresula',
        name: 'Aresula',
        title: 'Fırtına Dansçısı',
        level: 12,
        stats: new Stats({ maxHealth: 280, damage: 34, armor: 16, speed: 19, dodgeChancePercent: 22, critChancePercent: 18 }),
        weaponName: 'Çift Hilal Rüzgar Bıçağı',
        weaponType: 'bıçak',
        description: 'Dağ zirvelerinden gelen sert rüzgarları adımlarına uyduran, havada dönerek çifte hilaliyle hasmının boynunu hedefleyen zarif ama ölümcül savaşçı.',
        rewardGold: 75,
        rewardExp: 140,
        rewardFame: 4,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.KURNAZ,
          bio: 'Hasmının hamlelerini rüzgar gibi savuşturup en savunmasız anda sırtından vurur.',
          gold: 110,
          latestDiary: 'Taş Hisar terzisinde rüzgar direncini azaltan hafif ipek kuşak diktirdi.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_aresula_1',
            name: 'Hilal Fırtınası',
            icon: '🌪️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'İki hilal bıçağıyla dairesel hızla dönerek göğüse çifte darbe indirir.',
            combatEffect: '+%35 Hasar ve kanama'
          }),
          new GladiatorSkill({
            id: 'skill_aresula_2',
            name: 'Rüzgar Adımı',
            icon: '💨',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Gelen darbenin menzilinden rüzgar gibi sıyrılarak hasarı sıfırlar.',
            combatEffect: '%40 Kaçınma ve +3 Hız'
          }),
          new GladiatorSkill({
            id: 'skill_aresula_3',
            name: 'Kör Eden Toz',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Avucundaki dağ kumunu rakibin gözüne savurur.',
            combatEffect: 'Rakip 1 tur ıskalar'
          }),
          new GladiatorSkill({
            id: 'skill_aresula_4',
            name: 'Girdap Vuruşu',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Havaya sıçrayıp yere inerken iki bıçağıyla rakibin zırhını yarar.',
            combatEffect: '+%75 Kritik Hasar & Zırh Delme'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_katerina',
        name: 'Katerina',
        title: 'Buzul Muhafızı',
        level: 15,
        stats: new Stats({ maxHealth: 370, damage: 38, armor: 28, speed: 12, blockChancePercent: 24 }),
        weaponName: 'Donuk Çelik Mızrak & Kalkan',
        weaponType: 'mızrak',
        description: 'Kuzey buzullarının sert taşlarından oyulmuş kalkanı ve buz mavisi mızrağıyla Taş Hisar arenasında aşılmaz bir sur gibi dikilen soğukkanlı dövüşçü.',
        rewardGold: 95,
        rewardExp: 180,
        rewardFame: 5,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GURURLU,
          bio: 'Asla geri adım atmaz. Kalkanının arkasında soğukkanlılıkla rakibin yorulmasını bekler.',
          gold: 135,
          latestDiary: "Demirci Torvald'a mızrağının ucuna mavi safir tozu perçinletti."
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_katerina_1',
            name: 'Donuk Dürtüş',
            icon: '❄️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Buz soğukluğundaki mızrağını rakibin diz kapağına saplar.',
            combatEffect: '+25 Hasar ve -4 Rakip Hızı'
          }),
          new GladiatorSkill({
            id: 'skill_katerina_2',
            name: 'Buzul Kalkanı',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Ağır kalkanını yere saplayarak gelen darbeyi tamamen emer.',
            combatEffect: '%65 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_katerina_3',
            name: 'Donduran Nefes',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmın kalkan tutan elini dondurarak savunmasını düşürür.',
            combatEffect: 'Rakibin Zırhı -%30'
          }),
          new GladiatorSkill({
            id: 'skill_katerina_4',
            name: 'Kutup Hükmü',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Mızrağını iki elle göğse geçirip kalkanıyla ezer.',
            combatEffect: '+80 Buzul Hasarı ve Sersemletme'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_xayah',
        name: 'Xayah',
        title: 'Kuzgun Pençesi',
        level: 13,
        stats: new Stats({ maxHealth: 295, damage: 37, armor: 17, speed: 18, critChancePercent: 22 }),
        weaponName: 'Keskin Tüy Bıçakları',
        weaponType: 'bıçak',
        description: 'Kuzgun tüyleriyle kaplı deri zırhı ve avucundan fırlattığı jilet keskinliğindeki hançerleriyle arenanın gölgelerinden ölüm saçan çevik gladyatör.',
        rewardGold: 80,
        rewardExp: 150,
        rewardFame: 4,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.KURNAZ,
          bio: 'Yakın dövüşten nefret eder; hasmını uzaktan hançer yağmuruyla delik deşik edip kan kaybından yere serer.',
          gold: 125,
          latestDiary: "Fırtına Sığınağı Hanı'nda kuytuda oturup hançerlerinin ağzını biledi."
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_xayah_1',
            name: 'Tüy Yağmuru',
            icon: '🪶',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Aynı anda üç tüy hançerini hasmın gövdesine fırlatır.',
            combatEffect: '+30 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_xayah_2',
            name: 'Gölge Sıyrılışı',
            icon: '💨',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Darbe anında arkaya ters perende atarak menzilden çıkar.',
            combatEffect: '%35 Sıyrılma'
          }),
          new GladiatorSkill({
            id: 'skill_xayah_3',
            name: 'Pençe Kapanı',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Yere serptiği çelik iğnelerle rakibin ayaklarını kanatır.',
            combatEffect: '2 Tur boyu Kanama'
          }),
          new GladiatorSkill({
            id: 'skill_xayah_4',
            name: 'Ölümcül Tüy Çekişi',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Saplanan tüm hançerleri rünik iple geri çekerek etleri parçalar.',
            combatEffect: '+%90 Yıkıcı Kritik Hasar'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_valeria',
        name: 'Valeria',
        title: 'Demir Bakire',
        level: 18,
        stats: new Stats({ maxHealth: 440, damage: 46, armor: 32, speed: 11, blockChancePercent: 20 }),
        weaponName: 'Ağır Çift Elli Şövalye Kılıcı',
        weaponType: 'büyük kılıç',
        description: 'Başkent ordusunun en ağır zırhlı lefter birliğinden firar etmiş, devasa çift elli kılıcını tek hamlede savuran korkusuz kadın şövalye.',
        rewardGold: 120,
        rewardExp: 220,
        rewardFame: 6,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.HIRSLI,
          bio: 'Onurunu geri kazanmak için arenanın en güçlülerini tek tek devirmeye ant içti.',
          gold: 180,
          latestDiary: 'Garnizon talim sahasında kütükleri ikiye biçerek sabah idmanını tamamladı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_valeria_1',
            name: 'Yaran Darbe',
            icon: '⚔️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Ağır kılıcını tepeden indirerek zırhı ezer.',
            combatEffect: '+40 Hasar & Zırh Parçalama'
          }),
          new GladiatorSkill({
            id: 'skill_valeria_2',
            name: 'Demir Duruş',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Plakalarını kenetleyip darbeyi omuz başıyla karşılar.',
            combatEffect: '%50 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_valeria_3',
            name: 'Cesur Meydan Okuma',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Kılıcını kalkanına vurarak hasmı paniğe sürükler.',
            combatEffect: 'Rakibin Hasarı -%25'
          }),
          new GladiatorSkill({
            id: 'skill_valeria_4',
            name: 'Cellat Hükmü',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Dönerek tam güçle kılıcını savurur, hasmı yere yapıştırır.',
            combatEffect: '+100 Ezici Hasar'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_seraphina',
        name: 'Seraphina',
        title: 'Köz Okçusu',
        level: 14,
        stats: new Stats({ maxHealth: 310, damage: 41, armor: 18, speed: 17, critChancePercent: 25 }),
        weaponName: 'Köz İşlemeli Bileşik Yay',
        weaponType: 'yay',
        description: 'Taş ocaklarındaki lav damarlarından çıkarılan kızıl taşlarla süslenmiş yayıyla alevli oklar atan çöl göçmeni usta nişancı.',
        rewardGold: 85,
        rewardExp: 160,
        rewardFame: 4,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.VAHSI,
          bio: 'Ateşin arındırıcı gücüne inanır; hasmını diri diri yakarak kumları kızıla boyar.',
          gold: 115,
          latestDiary: 'Ok uçlarını zift ve kükürt yağına batırıp kurutmaya bıraktı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_seraphina_1',
            name: 'Alevli Ok',
            icon: '🔥',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Kızıl korla yanan bir oku hasmın omzuna çakar.',
            combatEffect: '+35 Hasar & 2 Tur Yanma'
          }),
          new GladiatorSkill({
            id: 'skill_seraphina_2',
            name: 'Duman Perdesi',
            icon: '💨',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Ayaklarının dibine duman bombası atıp hedeften kaybolur.',
            combatEffect: '%45 Kaçınma'
          }),
          new GladiatorSkill({
            id: 'skill_seraphina_3',
            name: 'Köz Tuzağı',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Kumun altına alevli kor döşeyerek hasmın hareketini kısıtlar.',
            combatEffect: 'Rakip -5 Hız'
          }),
          new GladiatorSkill({
            id: 'skill_seraphina_4',
            name: 'Kızıl Yaylım',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Havaya aynı anda 3 köz oku ateşleyip hasmın üstüne yağdırır.',
            combatEffect: '+85 Alan Ateş Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_lyra',
        name: 'Lyra',
        title: 'Gölge Dansçısı',
        level: 11,
        stats: new Stats({ maxHealth: 265, damage: 32, armor: 14, speed: 20, dodgeChancePercent: 24 }),
        weaponName: 'Çift Engerek Hançeri',
        weaponType: 'hançer',
        description: 'Göz açıp kapayıncaya kadar yer değiştiren, zırh ek yerlerine iğne deliği kadar dar aralıklardan hançer batıran suikastçı.',
        rewardGold: 70,
        rewardExp: 130,
        rewardFame: 3,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.KURNAZ,
          bio: 'Gölgeler onun evi. Rakibini yorana kadar sadece dans eder, sonra tek hamlede bitirir.',
          gold: 95,
          latestDiary: 'Hanın tavan kirişlerinde saatlerce baş aşağı asılı kalarak denge çalıştı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_lyra_1',
            name: 'Engerek Isırığı',
            icon: '🐍',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Hasmın boyun boşluğuna hızlı iki hançer saplar.',
            combatEffect: '+28 Hasar & Zehir'
          }),
          new GladiatorSkill({
            id: 'skill_lyra_2',
            name: 'Gölge Adımı',
            icon: '🌑',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Saniyeler içinde rakibin arkasına geçer.',
            combatEffect: '%50 Sıyrılma'
          }),
          new GladiatorSkill({
            id: 'skill_lyra_3',
            name: 'Sinir Felci',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Bilek tendonuna hafif bir çentik atarak silahını düşürmesini sağlar.',
            combatEffect: 'Rakip Hasarı -%30'
          }),
          new GladiatorSkill({
            id: 'skill_lyra_4',
            name: 'Ölümcül Dönüş',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Rakibin etrafında fırıl fırıl dönerek 4 hançer darbesi indirir.',
            combatEffect: '+%85 Kritik Hasar'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_morgana',
        name: 'Morgana',
        title: 'Kadim Cadı',
        level: 17,
        stats: new Stats({ maxHealth: 390, damage: 45, armor: 22, speed: 13, critChancePercent: 20 }),
        weaponName: 'Rünlü Kemik Asa & Hançer',
        weaponType: 'asa',
        description: 'Bataklık ve dağ mağaralarının yasaklı büyülerini çeliğe fısıldayan, asasının ucuyla düşmanın can özünü emen esrarengiz kadın gladyatör.',
        rewardGold: 115,
        rewardExp: 210,
        rewardFame: 5,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GIZEMLI,
          bio: 'Arenayı bir kurban sunağı olarak görür. Dökülen her damla kan onun rünlerini parlatır.',
          gold: 160,
          latestDiary: "Mücevherci Boris'ten aldığı ametist taşını asasının tepesine mühürledi."
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_morgana_1',
            name: 'Ruh Sömürüsü',
            icon: '🔮',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Asasından çıkan mor şimşekle hasmın canını çeker.',
            combatEffect: '+38 Hasar ve +15 Can Yenileme'
          }),
          new GladiatorSkill({
            id: 'skill_morgana_2',
            name: 'Kemik Duvarı',
            icon: '🦴',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Yerden kemik parçaları yükselterek saldırıyı engeller.',
            combatEffect: '%40 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_morgana_3',
            name: 'Kabus Fısıltısı',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Rakibin aklını karıştırarak kendi silahından korkmasını sağlar.',
            combatEffect: 'Rakip 1 tur afallar'
          }),
          new GladiatorSkill({
            id: 'skill_morgana_4',
            name: 'Karanlık Çöküş',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Tüm arenayı saran mor sisle hasmı havaya kaldırıp yere çalar.',
            combatEffect: '+95 Büyüsel Hasar'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_astrid',
        name: 'Astrid',
        title: 'Kuzey Kurdu',
        level: 16,
        stats: new Stats({ maxHealth: 410, damage: 44, armor: 25, speed: 14, critChancePercent: 19 }),
        weaponName: 'Dişli Kurt Baltası',
        weaponType: 'balta',
        description: 'Boynunda kurt dişleri dizili kolyeleri, yüzünde mavi savaş boyalarıyla kuzey dağlarının vahşi gücünü arenaya taşıyan kadın akıncı.',
        rewardGold: 105,
        rewardExp: 195,
        rewardFame: 5,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.VAHSI,
          bio: 'Yaralandıkça daha da hiddetlenir; kurt ulumasıyla hasmının yüreğine korku salar.',
          gold: 145,
          latestDiary: 'Baltasının sapını taze kurt derisiyle sarıp bileğini güçlendirdi.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_astrid_1',
            name: 'Kurt Isırığı',
            icon: '🐺',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Baltasının kancasıyla hasmın zırhını takıp çeker.',
            combatEffect: '+38 Hasar & Zırh Parçalama'
          }),
          new GladiatorSkill({
            id: 'skill_astrid_2',
            name: 'Savaş Çığlığı',
            icon: '📢',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Göğsünü yumruklayarak acıyı hissetmez hale gelir.',
            combatEffect: '3 Tur +8 Zırh'
          }),
          new GladiatorSkill({
            id: 'skill_astrid_3',
            name: 'Avcının Hırçınlığı',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Rakibin açık yarasını koklayıp sonraki hamleye odaklanır.',
            combatEffect: '+%25 Kritik Şansı'
          }),
          new GladiatorSkill({
            id: 'skill_astrid_4',
            name: 'Kuzey Fırtınası',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Baltasını çılgınca 3 kez savurup hasmı parçalar.',
            combatEffect: '+90 Vahşi Baltalama Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_helena',
        name: 'Helena',
        title: 'Çelik Mızrak',
        level: 13,
        stats: new Stats({ maxHealth: 320, damage: 35, armor: 24, speed: 15, blockChancePercent: 18 }),
        weaponName: 'Garnizon Kargısı & Çelik Kalkan',
        weaponType: 'kargı',
        description: 'Taş Hisar sınır muhafızlarının nizamını mükemmel uygulayan, uzun mızrağıyla hasmını asla yanına yaklaştırmayan disiplinli asker.',
        rewardGold: 80,
        rewardExp: 150,
        rewardFame: 4,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GURURLU,
          bio: 'Dövüşü bir kumar değil, askeri bir geometri oyunu olarak görür.',
          gold: 120,
          latestDiary: "Zırhçı Ulfric'te kargısının denge ağırlığını yeniden ayarlattı."
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_helena_1',
            name: 'Kargı İtişi',
            icon: '🗡️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Menzil avantajıyla hasmın göğsüne sert kargı indirir.',
            combatEffect: '+32 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_helena_2',
            name: 'Menzil Kilidi',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Kalkanını öne sürerek hasmın yaklaşmasını imkansız kılar.',
            combatEffect: '%40 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_helena_3',
            name: 'Tendon Delme',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Kargının ucuyla ayak bileğine batırır.',
            combatEffect: 'Rakibin Hızı -4'
          }),
          new GladiatorSkill({
            id: 'skill_helena_4',
            name: 'Şaşmaz Saplama',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Tüm vücut ağırlığıyla kargıyı kalbe doğru yöneltir.',
            combatEffect: '+%80 Zırh Delici Hasar'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_nyx',
        name: 'Nyx',
        title: 'Gece Celladı',
        level: 19,
        stats: new Stats({ maxHealth: 430, damage: 48, armor: 26, speed: 16, critChancePercent: 26 }),
        weaponName: 'Hilal Çelik Tırpan',
        weaponType: 'tırpan',
        description: 'Yüzünü siyah tülle örten, devasa hilal tırpanıyla arenanın zeminini kıvılcımlarla kazıyarak yürüyen ölümcül infazcı.',
        rewardGold: 130,
        rewardExp: 240,
        rewardFame: 6,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GIZEMLI,
          bio: 'Konuşmaz, tehdit etmez; sadece tırpanını savurur ve başları ayırır.',
          gold: 190,
          latestDiary: 'Gece yarısı arenanın ortasında tek başına tırpanıyla gölge idmanı yaptı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_nyx_1',
            name: 'Biçici Hilal',
            icon: '🌙',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Tırpanı geniş bir kavisle hasmın beline savurur.',
            combatEffect: '+45 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_nyx_2',
            name: 'Gece Peçesi',
            icon: '🖤',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Karanlık bir sis bulutuna dönüşüp darbeyi boşa çıkarır.',
            combatEffect: '%50 Sıyrılma'
          }),
          new GladiatorSkill({
            id: 'skill_nyx_3',
            name: 'Ruh Bağı',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmın canını kendi tırpanına bağlar.',
            combatEffect: 'Hasar verdikçe Can Çalma'
          }),
          new GladiatorSkill({
            id: 'skill_nyx_4',
            name: 'İnfaz Tırpanı',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Tırpanı hasmın boynuna geçirip tek hamlede çeker.',
            combatEffect: '+110 İnfaz Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_rowan',
        name: 'Rowan',
        title: 'Kızıl Baltalı',
        level: 12,
        stats: new Stats({ maxHealth: 300, damage: 36, armor: 19, speed: 13, critChancePercent: 16 }),
        weaponName: 'İki Başlı Kızıl Orman Baltası',
        weaponType: 'balta',
        description: 'Kızıl saçları omuzlarına dökülen, iki başlı ağır baltasını tek eliyle fırıldak gibi çeviren dağ köylüsü savaşçı kadın.',
        rewardGold: 75,
        rewardExp: 140,
        rewardFame: 4,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.VAHSI,
          bio: 'Baltasının kanla yıkanmadığı hiçbir günü yaşanmış saymaz.',
          gold: 105,
          latestDiary: 'Taş ocaklarında balyoz sallayan esirlerle bilek güreşi yapıp kazandı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_rowan_1',
            name: 'Kızıl Çentik',
            icon: '🪓',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Baltanın sivri ucunu hasmın omzuna indirir.',
            combatEffect: '+34 Hasar & Kanama'
          }),
          new GladiatorSkill({
            id: 'skill_rowan_2',
            name: 'Kemik Siper',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Baltasının geniş sapını göğsüne siper eder.',
            combatEffect: '%35 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_rowan_3',
            name: 'Öfke Narası',
            icon: '😡',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Vahşi bir nara atarak sonraki darbelerini hiddetlendirir.',
            combatEffect: '+8 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_rowan_4',
            name: 'Kızıl Kıyım',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Baltanın iki başıyla peş peşe acımasız vuruşlar yapar.',
            combatEffect: '+85 Yıkıcı Hasar'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_selene',
        name: 'Selene',
        title: 'Ay Muhafızı',
        level: 16,
        stats: new Stats({ maxHealth: 380, damage: 42, armor: 27, speed: 15, blockChancePercent: 22 }),
        weaponName: 'Gümüş Hilal Kılıcı & Ayna Kalkan',
        weaponType: 'kılıç',
        description: "Dolunay ışığında sertleştiği söylenen gümüş kılıcı ve ışığı hasmın gözüne yansıtan cilalı kalkanıyla Taş Hisar'ın en zarif şövalyesi.",
        rewardGold: 105,
        rewardExp: 195,
        rewardFame: 5,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GURURLU,
          bio: 'Ay tanrıçasına adanmış dövüş yeminiyle kirlenmemiş saf kılıç tekniğini savunur.',
          gold: 150,
          latestDiary: 'Gümüş kılıcını ay ışığında kaynak suyunda temizleyip biledi.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_selene_1',
            name: 'Hilal Kesisi',
            icon: '⚔️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Gümüş kılıcıyla hasmın göğsüne hilal çizer.',
            combatEffect: '+38 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_selene_2',
            name: 'Ayna Yansıması',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Cilalı kalkanıyla gelen darbeyi savurup hasmı kör eder.',
            combatEffect: '%45 Hasar Engelleme'
          }),
          new GladiatorSkill({
            id: 'skill_selene_3',
            name: 'Ay Halesi',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Etrafında gümüş bir ışık halkası yayarak savunmasını artırır.',
            combatEffect: '+10 Zırh'
          }),
          new GladiatorSkill({
            id: 'skill_selene_4',
            name: 'Dolunay Gazabı',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Göğe kılıcını kaldırıp ışık hızıyla yere indirir.',
            combatEffect: '+95 Gümüş Hasar & Sersemletme'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_yvaine',
        name: 'Yvaine',
        title: 'Şafak Kılıcı',
        level: 14,
        stats: new Stats({ maxHealth: 315, damage: 39, armor: 20, speed: 18, critChancePercent: 24 }),
        weaponName: 'İnce Çelik Saray Rapieri',
        weaponType: 'rapier',
        description: 'Saray düellolarında hilekar bir dükü öldürdüğü için sürgüne gönderilen, şafak sisi kadar zarif ve hızlı kılıç kullanan asil kadın.',
        rewardGold: 85,
        rewardExp: 160,
        rewardFame: 4,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.HIRSLI,
          bio: 'Saraydan atılmış olsa da kılıcının asaletinden asla ödün vermez.',
          gold: 130,
          latestDiary: "Terzi Leyla'ya asil işlemeli ipek eldivenler sipariş etti."
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_yvaine_1',
            name: 'Şafak İğnesi',
            icon: '🗡️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Rapierin ucuyla hasmın boğazına yıldırım gibi batırır.',
            combatEffect: '+36 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_yvaine_2',
            name: 'Zarif Yan Adım',
            icon: '💨',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Tek ayak üzerinde dönerek kaba vuruşun altından geçer.',
            combatEffect: '%40 Kaçınma'
          }),
          new GladiatorSkill({
            id: 'skill_yvaine_3',
            name: 'Kılıç Çelmesi',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmın kılıcını hafif bir bilek hareketiyle yana fırlatır.',
            combatEffect: 'Rakibin Silahı Kilitlenir'
          }),
          new GladiatorSkill({
            id: 'skill_yvaine_4',
            name: 'Kusursuz Düello',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Art arda 5 ölümcül batışla hasmın göğsünü delik deşik eder.',
            combatEffect: '+%90 Kritik Hasar'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_freya',
        name: 'Freya',
        title: 'Hisar Şampiyonu',
        level: 20,
        stats: new Stats({ maxHealth: 480, damage: 52, armor: 34, speed: 15, critChancePercent: 20, blockChancePercent: 25 }),
        weaponName: 'Altın Kakmalı Garnizon Teberi',
        weaponType: 'teber',
        description: "Taş Hisar Garnizonu'nun kulelerinde adı yankılanan, hem mızrak hem balta özellikli dev teberiyle namağlup kadın gladyatör şampiyonu.",
        rewardGold: 160,
        rewardExp: 300,
        rewardFame: 8,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GURURLU,
          bio: 'Taş Hisar kumlarında yenilgi yüzü görmedi; tahtını korumak için canını vermeye hazır.',
          gold: 250,
          latestDiary: 'Hisarın surlarında askerlerin alkışları arasında şampiyonluk kadehini kaldırdı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_freya_1',
            name: 'Şampiyon Teberi',
            icon: '⚔️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Ağır teberini iki elle havada savurup zırhı yarar.',
            combatEffect: '+48 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_freya_2',
            name: 'Sarsılmaz Hisar',
            icon: '🏰',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Teberinin sapını yere vurup bir savunma bariyeri oluşturur.',
            combatEffect: '%55 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_freya_3',
            name: 'Komutan Emri',
            icon: '👑',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Arenadaki taraftarları coşturup moral gücünü tazeler.',
            combatEffect: '+15 Can & +5 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_freya_4',
            name: 'Taş Hisar Gazabı',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Teberin baltasıyla ezer, ardından ucuyla delip geçer.',
            combatEffect: '+120 Ezici Şampiyon Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_vespera',
        name: 'Vespera',
        title: 'Zehirli İğne',
        level: 15,
        stats: new Stats({ maxHealth: 330, damage: 40, armor: 20, speed: 19, critChancePercent: 23 }),
        weaponName: 'Engerek Ağulu İnce Şiş',
        weaponType: 'şiş',
        description: 'Maden ocaklarındaki zehirli akreplerin özünü damıtıp şişinin ucuna süren, tek bir batışıyla hasmın kaslarını kaskatı kesen tehlikeli suikastçı.',
        rewardGold: 95,
        rewardExp: 175,
        rewardFame: 5,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.KURNAZ,
          bio: 'Dövüşü uzatmaz; zehrin damarlarda dolaşmasını bir köşeden keyifle izler.',
          gold: 140,
          latestDiary: "Ayaz Şifa Çayırları'ndan toplattığı zehirli baldıran köklerini kaynattı."
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_vespera_1',
            name: 'Zehirli Batış',
            icon: '💉',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'İnce şişini hasmın bacağına saplar.',
            combatEffect: '+32 Hasar & 3 Tur Ağır Zehir'
          }),
          new GladiatorSkill({
            id: 'skill_vespera_2',
            name: 'Sıvışma',
            icon: '💨',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Kumun üzerine attığı sis bombasıyla geriye zıplar.',
            combatEffect: '%45 Sıyrılma'
          }),
          new GladiatorSkill({
            id: 'skill_vespera_3',
            name: 'Uyuşturan Dokunuş',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmın kılıç tutan eline zehirli iğne fırlatır.',
            combatEffect: 'Rakibin Hasarı -%35'
          }),
          new GladiatorSkill({
            id: 'skill_vespera_4',
            name: 'Ölümcül Toksin',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Tüm zehir tüpünü şişe boşaltıp doğrudan kalbe batırır.',
            combatEffect: '+85 Zehir Hasarı & Felç'
          })
        ]
      }),
      // === 24 ERKEK GLADYATÖR ===
      new Enemy({
        id: 'fighter_voladmir',
        name: 'Voladmir',
        title: 'Kan Lordu',
        level: 21,
        stats: new Stats({ maxHealth: 510, damage: 55, armor: 32, speed: 16, critChancePercent: 25 }),
        weaponName: 'Kızıl Yakut Kakmalı Kan Kılıcı',
        weaponType: 'kılıç',
        description: 'Karanlık bir soylu hanedanın son varisi. Düşmanlarının kanıyla beslendiğine inanılan kadim kızıl çeliğiyle arenada dehşet saçan acımasız efendi.',
        rewardGold: 180,
        rewardExp: 320,
        rewardFame: 9,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.HIRSLI,
          bio: 'Kendi kanını da hasmının kanını da silahına kurban eder; dövüş uzadıkça çılgına döner.',
          gold: 280,
          latestDiary: "Mücevherci Boris'e kılıcının kabzasına iri bir kan yakutu kakması için altın döktü."
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_voladmir_1',
            name: 'Kan Süzüşü',
            icon: '🩸',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Kızıl kılıcıyla hasmın tenini yarıp kanını kendine çeker.',
            combatEffect: '+48 Hasar & +20 Can Çalma'
          }),
          new GladiatorSkill({
            id: 'skill_voladmir_2',
            name: 'Kızıl Kalkan',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Etrafında dönen kan pıhtılarından kalkan örer.',
            combatEffect: '%50 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_voladmir_3',
            name: 'Kan Arzusu',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmın kan kokusunu içine çekip saldırı gücünü katlar.',
            combatEffect: '3 Tur +12 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_voladmir_4',
            name: 'Kan Hükmü',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Hasmın tüm damarlarını sıkıştıran kan ritüeliyle kalbini patlatırcasına vurur.',
            combatEffect: '+130 Ezici Kritik Kan Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_draven',
        name: 'Draven',
        title: 'İki Baltalı Cellat',
        level: 17,
        stats: new Stats({ maxHealth: 420, damage: 47, armor: 24, speed: 15, critChancePercent: 24 }),
        weaponName: 'Dönen Çift Kasap Baltası',
        weaponType: 'balta',
        description: 'Havaya fırlattığı devasa baltaları dönerek yakalayan, arenayı tiyatro sahnesine çeviren gösterişli ve gaddar bir cellat.',
        rewardGold: 115,
        rewardExp: 210,
        rewardFame: 5,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.VAHSI,
          bio: 'Seyircilerin alkışları olmadan dövüşemez. Her kafayı kopardığında seyircilere selam durur.',
          gold: 170,
          latestDiary: 'Kasap baltalarını gres yağıyla parlatıp saç teliyle keskinliğini denedi.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_draven_1',
            name: 'Dönen Balta',
            icon: '🪓',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Baltasını fırıldak gibi savurup göğse saplar.',
            combatEffect: '+42 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_draven_2',
            name: 'Baltalı Savuşturma',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'İki baltasının gövdesini çapraz kenetleyip kılıcı durdurur.',
            combatEffect: '%40 Hasar Engelleme'
          }),
          new GladiatorSkill({
            id: 'skill_draven_3',
            name: 'Seyirci Coşkusu',
            icon: '👏',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Arenanın tezahüratıyla coşup hız kazanır.',
            combatEffect: '+4 Hız ve +%15 Kritik'
          }),
          new GladiatorSkill({
            id: 'skill_draven_4',
            name: 'Ölümcül Giyotin',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'İki baltayı aynı anda boynun iki yanından geçirerek biçer.',
            combatEffect: '+105 Cellat Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_balthazar',
        name: 'Balthazar',
        title: 'Taş Zırhlı Dev',
        level: 19,
        stats: new Stats({ maxHealth: 520, damage: 49, armor: 38, speed: 9, blockChancePercent: 26 }),
        weaponName: 'Granit Yıkım Balyozu',
        weaponType: 'balyoz',
        description: 'Dağ taş ocaklarında yetişmiş, vücuduna kalın granit plakalar zincirlenmiş, adımlarıyla arenanın zeminini sarsan dev bir kaba kuvvet abidesi.',
        rewardGold: 135,
        rewardExp: 250,
        rewardFame: 6,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GURURLU,
          bio: 'Acıyı hissetmez. Balyozunun tek vuruşuyla zırhları hurdaya, kemikleri toza çevirir.',
          gold: 160,
          latestDiary: 'Taş ocağından getirdiği 100 kiloluk mermer bloğu tek eliyle kaldırıp fırlattı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_balthazar_1',
            name: 'Granit Darbe',
            icon: '🔨',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Balyozunu tepeden indirip hasmın kalkanını ezer.',
            combatEffect: '+45 Ezici Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_balthazar_2',
            name: 'Taş Deri',
            icon: '🗿',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Vücudunu taşlaştırarak gelen kesikleri hiçe sayar.',
            combatEffect: '%60 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_balthazar_3',
            name: 'Deprem Vuruşu',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Balyozu yere vurup şok dalgasıyla hasmın dengesini bozar.',
            combatEffect: 'Rakip Sersemler'
          }),
          new GladiatorSkill({
            id: 'skill_balthazar_4',
            name: 'Kıyamet Çöküşü',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Tüm gücüyle balyozu hasmın tepesine indirir.',
            combatEffect: '+115 Devasa Yıkım Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_kaelen_garrison',
        name: 'Kaelen',
        title: 'Fırtına Süvarisi',
        level: 14,
        stats: new Stats({ maxHealth: 340, damage: 39, armor: 22, speed: 17, dodgeChancePercent: 18 }),
        weaponName: 'Şimşek Uçlu Bozkır Kargısı',
        weaponType: 'kargı',
        description: 'At sırtında büyümiş, yayalara karşı bile süvari hızı ve ivmesiyle saldıran, kargısının ucunu yıldırım gibi hasmına sokan fırtına savaşçısı.',
        rewardGold: 85,
        rewardExp: 160,
        rewardFame: 4,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.HIRSLI,
          bio: 'Hız her şeydir. Duran hedefin ölmeye mahkum olduğuna inanır.',
          gold: 125,
          latestDiary: 'Garnizon ahırlarında atların nallarını kontrol edip kargı talimi yaptı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_kaelen_1',
            name: 'Süvari Hamlesi',
            icon: '🏇',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Koşarak hız alıp kargıyı hasmın göğsüne saplar.',
            combatEffect: '+36 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_kaelen_2',
            name: 'Rüzgar Manevrası',
            icon: '💨',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Gelen darbeden hızla yana kayarak sıyrılır.',
            combatEffect: '%40 Kaçınma'
          }),
          new GladiatorSkill({
            id: 'skill_kaelen_3',
            name: 'Kalkan Ezmesi',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Kargının sapıyla hasmın kalkanına vurup kolunu uyuşturur.',
            combatEffect: 'Rakip Zırhı -%25'
          }),
          new GladiatorSkill({
            id: 'skill_kaelen_4',
            name: 'Fırtına Akını',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Yıldırım gibi ileri atılıp hasmı delip arkasına geçer.',
            combatEffect: '+%85 Kritik Kargı Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_lucian',
        name: 'Lucian',
        title: 'Işık Silahşoru',
        level: 16,
        stats: new Stats({ maxHealth: 360, damage: 43, armor: 23, speed: 18, critChancePercent: 22 }),
        weaponName: 'Çift Çelik Arbalet & Kama',
        weaponType: 'arbalet',
        description: 'Ellerindeki iki hafif arbaletle durmaksızın çelik oklar püskürten, yakınına gelenleri ise belindeki kama ile karşılayan soğukkanlı tetikçi.',
        rewardGold: 100,
        rewardExp: 190,
        rewardFame: 5,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.KURNAZ,
          bio: 'Her kurşunun bir hedefi vardır. Boşa atılan ok onun için utançtır.',
          gold: 155,
          latestDiary: "Demirci Torvald'dan özel yay çeliği satın alıp tetik mekanizmasını yağladı."
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_lucian_1',
            name: 'Çifte Ok',
            icon: '🏹',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'İki arbaletle aynı anda iki çelik ok fırlatır.',
            combatEffect: '+40 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_lucian_2',
            name: 'Geriye Takla',
            icon: '🤸',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Darbe anında arkaya takla atarak mesafeyi korur.',
            combatEffect: '%45 Kaçınma'
          }),
          new GladiatorSkill({
            id: 'skill_lucian_3',
            name: 'Göz Delici',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmın kaskının vizör deliğine nişan alır.',
            combatEffect: 'Rakip %50 Iskalama'
          }),
          new GladiatorSkill({
            id: 'skill_lucian_4',
            name: 'Işık Yaylımı',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Dönerken 6 oku birden yaylım ateşiyle hasmın üzerine boşaltır.',
            combatEffect: '+95 Delici Yaylım Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_rorik',
        name: 'Rorik',
        title: 'Yıkım Çekici',
        level: 15,
        stats: new Stats({ maxHealth: 400, damage: 42, armor: 29, speed: 11, blockChancePercent: 20 }),
        weaponName: 'Çivili Demirci Balyozu',
        weaponType: 'balyoz',
        description: 'Yıllarca garnizon ocağında örs dövmüş dev cüsseli usta. Elindeki çivili balyozu hasmın zırhını sac gibi bükmek için kullanır.',
        rewardGold: 95,
        rewardExp: 180,
        rewardFame: 5,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.HIRSLI,
          bio: 'Çeliği büken insanı da büker. Onun için her zırh dövülecek bir demir parçasıdır.',
          gold: 140,
          latestDiary: 'Ocakta kızdırdığı çivileri balyozunun başına perçinledi.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_rorik_1',
            name: 'Örs Darbesi',
            icon: '🔨',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Balyozu yatay savurarak kaburgaları ezer.',
            combatEffect: '+38 Hasar & Zırh Kırma'
          }),
          new GladiatorSkill({
            id: 'skill_rorik_2',
            name: 'Demirci Göğsü',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Kalın deri önlüğü ve kaslarıyla darbeyi karşılar.',
            combatEffect: '%40 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_rorik_3',
            name: 'Körük Harlaması',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Derin bir nefes alıp kaslarını şişirir.',
            combatEffect: '+6 Hasar ve +6 Zırh'
          }),
          new GladiatorSkill({
            id: 'skill_rorik_4',
            name: 'Kıvılcım Fırtınası',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Balyozu yere vurup kıvılcımlarla hasmı ezer.',
            combatEffect: '+90 Ezici Hasar'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_malakor',
        name: 'Malakor',
        title: 'Gölge Büyücüsü',
        level: 18,
        stats: new Stats({ maxHealth: 380, damage: 49, armor: 21, speed: 14, critChancePercent: 23 }),
        weaponName: 'Obsidyen Hançer & Kara Rünler',
        weaponType: 'büyülü hançer',
        description: 'Başkent akademisinden kara büyü uğraşları yüzünden atılan, obsidyen hançeriyle havaya çizdiği rünlerle hasmın zihnini felç eden sinsi savaşçı.',
        rewardGold: 120,
        rewardExp: 230,
        rewardFame: 6,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GIZEMLI,
          bio: 'Fiziksel güç sadece kaba et parçasıdır. Gerçek güç zihni yönetmektir.',
          gold: 175,
          latestDiary: "Ayaz Şifa Çayırı'ndan topladığı zehirli mantarlarla kara mürekkep yaptı."
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_malakor_1',
            name: 'Gölge Hançeri',
            icon: '🗡️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Obsidyen hançeriyle karanlık alev fırlatır.',
            combatEffect: '+44 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_malakor_2',
            name: 'Karanlık Zırh',
            icon: '🌑',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Vücudunu kara dumanla sararak vuruşları yutar.',
            combatEffect: '%45 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_malakor_3',
            name: 'Kabus Bağı',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmın korkularını canlandırıp hamle yapmasını engeller.',
            combatEffect: 'Rakip 1 Tur Kilitlenir'
          }),
          new GladiatorSkill({
            id: 'skill_malakor_4',
            name: 'Kara Girdap',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Yerden kara dokunaçlar yükseltip hasmı yere yapıştırır.',
            combatEffect: '+105 Kara Büyü Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_viktor',
        name: 'Viktor',
        title: 'Mekanik Yumruk',
        level: 13,
        stats: new Stats({ maxHealth: 350, damage: 37, armor: 26, speed: 13, blockChancePercent: 19 }),
        weaponName: 'Dişli Çarklı Çelik Muşta & Bıçak',
        weaponType: 'muşta',
        description: 'Garnizon zanaatkarlarının özel yay mekanizmalarıyla güçlendirdiği çelik muştasıyla vurduğu yerde kemik bırakmayan mekanik meraklısı gladyatör.',
        rewardGold: 80,
        rewardExp: 150,
        rewardFame: 4,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.KURNAZ,
          bio: 'Her mekanik vuruşun yay gerilimi matematikseldir; darbesi bir mancınık gibidir.',
          gold: 130,
          latestDiary: 'Muştasının içindeki yayları makine yağıyla yağlayıp gerginliğini artırdı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_viktor_1',
            name: 'Yaylı Yumruk',
            icon: '🥊',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Muştasındaki yayın boşalmasıyla suratına balyoz gibi çakar.',
            combatEffect: '+35 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_viktor_2',
            name: 'Çelik Kol Siperi',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Mekanik kol zırhıyla gelen kılıcı kilitler.',
            combatEffect: '%40 Hasar Engelleme'
          }),
          new GladiatorSkill({
            id: 'skill_viktor_3',
            name: 'Duman Fırlatıcı',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Bileğindeki borudan sıcak buhar püskürtür.',
            combatEffect: 'Rakip -4 Hız'
          }),
          new GladiatorSkill({
            id: 'skill_viktor_4',
            name: 'Hidrolik Ezme',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Tüm mekanizmayı aynı anda patlatarak hasmı geriye uçurur.',
            combatEffect: '+%85 Kritik Hasar'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_darius',
        name: 'Darius',
        title: 'Savaş Beyi',
        level: 22,
        stats: new Stats({ maxHealth: 540, damage: 58, armor: 36, speed: 14, critChancePercent: 24, blockChancePercent: 22 }),
        weaponName: 'Ağır İki Başlı Kumandan Teberi',
        weaponType: 'teber',
        description: 'Orduların ön saflarında yüzlerce savaşı yönetmiş firari bir lefter generali. Teberinin her darbesi savaş alanının acımasız disiplinini yansıtır.',
        rewardGold: 190,
        rewardExp: 340,
        rewardFame: 9,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GURURLU,
          bio: 'Garnizondaki herkes ona hürmet eder. Dövüş meydanında zayıflara asla merhamet göstermez.',
          gold: 310,
          latestDiary: 'Garnizon komutanlığına meydan okuyan bir mektup yazıp duvara astı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_darius_1',
            name: 'Biçen Teber',
            icon: '🪓',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Teberin geniş ağzıyla hasmın göğsünü ikiye ayırırcasına vurur.',
            combatEffect: '+50 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_darius_2',
            name: 'Savaş Duruşu',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Ağır omuzluklarını öne çıkararak darbeleri püskürtür.',
            combatEffect: '%50 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_darius_3',
            name: 'Komutan Kükremesi',
            icon: '📢',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Gök gürültüsü gibi kükreyerek hasmın moralini sıfırlar.',
            combatEffect: 'Rakip Hasarı -%30'
          }),
          new GladiatorSkill({
            id: 'skill_darius_4',
            name: 'Kıyaslanamaz Gazap',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Havaya sıçrayıp teberi hasmın omzundan aşağı ikiye böler.',
            combatEffect: '+135 Ezici Savaş Beyi Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_garek',
        name: 'Garek',
        title: 'Ayı Pençesi',
        level: 12,
        stats: new Stats({ maxHealth: 360, damage: 35, armor: 20, speed: 10, critChancePercent: 15 }),
        weaponName: 'Çivili Demir Ayı Pençeleri',
        weaponType: 'pençe',
        description: 'Vücudunu dağ ayısı postuyla sarmış, ellerine taktığı çivili pençelerle rakibini boğuşarak yere serip parçalayan vahşi gladyatör.',
        rewardGold: 75,
        rewardExp: 140,
        rewardFame: 4,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.VAHSI,
          bio: 'Konuşmayı unutmuştur; sadece hırlar ve hasmının boğazına sarılır.',
          gold: 90,
          latestDiary: 'Handaki koca fıçıyı tek başına kafasına dikip çiğ et yedi.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_garek_1',
            name: 'Ayı Tırmığı',
            icon: '🐾',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'İki pençesiyle hasmın yüzünü ve göğsünü tırmalar.',
            combatEffect: '+32 Hasar & Kanama'
          }),
          new GladiatorSkill({
            id: 'skill_garek_2',
            name: 'Kalın Post',
            icon: '🐻',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Ayı postunu gerip darbeleri yumuşatır.',
            combatEffect: '%40 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_garek_3',
            name: 'Ayı Kucaklaması',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmı kollarıyla sarıp kaburgalarını sıkar.',
            combatEffect: 'Rakip 1 Tur Hareketsiz'
          }),
          new GladiatorSkill({
            id: 'skill_garek_4',
            name: 'Vahşi Parçalama',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Hasmı yere serip pençeleriyle acımasızca delik deşik eder.',
            combatEffect: '+80 Vahşi Pençe Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_soren',
        name: 'Soren',
        title: 'Rüzgar Kılıcı',
        level: 13,
        stats: new Stats({ maxHealth: 305, damage: 37, armor: 18, speed: 19, dodgeChancePercent: 22 }),
        weaponName: 'Eğri Bozkır Kılıcı',
        weaponType: 'kılıç',
        description: 'Bozkırın fırtınalarında eğitim görmüş, kılıcını kınından bir rüzgar ıslığı gibi çıkarıp hasmını fark ettirmeden kesen çevik kılıç ustası.',
        rewardGold: 80,
        rewardExp: 150,
        rewardFame: 4,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.HIRSLI,
          bio: 'Kılıcının rüzgar sesi kesildiğinde hasmı çoktan yere düşmüştür.',
          gold: 115,
          latestDiary: 'Kumların üzerinde çıplak ayakla saatlerce sıyrılma adımları çalıştı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_soren_1',
            name: 'Rüzgar Kesisi',
            icon: '🌪️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Yatay kavisle hasmın beline doğru ani kılıç savurur.',
            combatEffect: '+34 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_soren_2',
            name: 'Bozkır Sıyrılışı',
            icon: '💨',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Rüzgar gibi dönerek darbeden sıyrılır.',
            combatEffect: '%45 Sıyrılma'
          }),
          new GladiatorSkill({
            id: 'skill_soren_3',
            name: 'Kum Savurma',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Kılıcının ucuyla yerdeki kumu hasmın yüzüne savurur.',
            combatEffect: 'Rakip Iskalama Şansı +%40'
          }),
          new GladiatorSkill({
            id: 'skill_soren_4',
            name: 'Fırtına Dansı',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Gözle takip edilemeyen hızda 3 darbeyle hasmı biçer.',
            combatEffect: '+%85 Rüzgar Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_theron',
        name: 'Theron',
        title: 'Alev Teberi',
        level: 17,
        stats: new Stats({ maxHealth: 430, damage: 46, armor: 28, speed: 13, critChancePercent: 20 }),
        weaponName: 'Kızıl Köz Dövmesi Ağır Mızrak',
        weaponType: 'mızrak',
        description: "Kızıl dağların lav yataklarında dövülmüş, vurduğu yerde yanık izleri bırakan mızrağıyla Taş Hisar'ın en hiddetli dövüşçülerinden biri.",
        rewardGold: 110,
        rewardExp: 210,
        rewardFame: 5,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.VAHSI,
          bio: 'Öfkesini alevlerle besler; her yarasından ateş fışkırır gibi dövüşür.',
          gold: 165,
          latestDiary: 'Mızrağının ucunu harlı kömür ateşinde akkor olana kadar bekletti.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_theron_1',
            name: 'Alevli Saplama',
            icon: '🔥',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Kızgın mızrak ucunu hasmın zırhına geçirir.',
            combatEffect: '+42 Hasar & Yanma'
          }),
          new GladiatorSkill({
            id: 'skill_theron_2',
            name: 'Köz Bariyeri',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Mızrağını döndürerek alevden bir kalkan oluşturur.',
            combatEffect: '%40 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_theron_3',
            name: 'Kül Dumanı',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmın ciğerlerine sıcak kül üfler.',
            combatEffect: 'Rakip -4 Hız ve -6 Zırh'
          }),
          new GladiatorSkill({
            id: 'skill_theron_4',
            name: 'Lav Patlaması',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Mızrağını iki elle yere vurup hasmın ayakları altında kor patlatır.',
            combatEffect: '+100 Ateş Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_cassian',
        name: 'Cassian',
        title: 'Sessiz Hançer',
        level: 14,
        stats: new Stats({ maxHealth: 320, damage: 41, armor: 19, speed: 18, critChancePercent: 25 }),
        weaponName: 'Gölge Çeliği Hançerler',
        weaponType: 'hançer',
        description: 'Başkent sokaklarının en karanlık köşelerinden kaçmış, ayak sesi çıkarmadan rakibin arkasına sızıp tek vuruşta işini bitiren soğuk suikastçı.',
        rewardGold: 90,
        rewardExp: 170,
        rewardFame: 4,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.KURNAZ,
          bio: 'Konuşmayı sevmez. Hasmı onu fark ettiğinde hançer çoktan böbreğine saplanmıştır.',
          gold: 135,
          latestDiary: 'Çizmelerinin tabanına keçe diktirip adımlarını tamamen sessizleştirdi.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_cassian_1',
            name: 'Sırttan Bıçaklama',
            icon: '🗡️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Hasmın arkasına dolanıp böbrek boşluğuna saplar.',
            combatEffect: '+38 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_cassian_2',
            name: 'Duman Adımı',
            icon: '💨',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Koyu bir duman bulutuyla görüşü kesip geri çekilir.',
            combatEffect: '%45 Sıyrılma'
          }),
          new GladiatorSkill({
            id: 'skill_cassian_3',
            name: 'Aşil Kesisi',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmın aşil tendonuna çentik atar.',
            combatEffect: 'Rakibin Hızı -6'
          }),
          new GladiatorSkill({
            id: 'skill_cassian_4',
            name: 'Gölge İnfazı',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'İki hançeri birden hasmın şah damarına sokar.',
            combatEffect: '+%100 Kritik İnfaz Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_brandon',
        name: 'Brandon',
        title: 'Çelik Siper',
        level: 16,
        stats: new Stats({ maxHealth: 440, damage: 38, armor: 33, speed: 10, blockChancePercent: 28 }),
        weaponName: 'Devasa Kule Kalkanı & Kısa Kılıç',
        weaponType: 'kalkan',
        description: 'Boyu kadar büyük ağır kule kalkanının arkasına sığınan, hiçbir mızrağın ve kılıcın deviremediği aşılmaz garnizon suru.',
        rewardGold: 100,
        rewardExp: 190,
        rewardFame: 5,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GURURLU,
          bio: 'Dövüşte en iyi saldırının kusursuz bir savunma olduğuna tüm kalbiyle inanır.',
          gold: 145,
          latestDiary: "Demirci Torvald'a kule kalkanının köşelerine çelik perçinler çaktırdı."
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_brandon_1',
            name: 'Kalkan Tokadı',
            icon: '🛡️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Kule kalkanının düz yüzüyle hasmın çenesine çarpar.',
            combatEffect: '+34 Hasar & Sersemletme'
          }),
          new GladiatorSkill({
            id: 'skill_brandon_2',
            name: 'Aşılmaz Duvar',
            icon: '🧱',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Kalkanı toprağa çakıp tamamen arkasına büzülür.',
            combatEffect: '%65 Hasar Engelleme'
          }),
          new GladiatorSkill({
            id: 'skill_brandon_3',
            name: 'Kalkan İtişi',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmı kalkanıyla geriye itip dengesini bozar.',
            combatEffect: 'Rakip 1 Tur Hamle Yapamaz'
          }),
          new GladiatorSkill({
            id: 'skill_brandon_4',
            name: 'Demir Hisar Çöküşü',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Kalkanının ağırlığıyla hasmın üzerine kapaklanıp ezer.',
            combatEffect: '+90 Ezici Zırh Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_orin',
        name: 'Orin',
        title: 'Sürgün Lejyoner',
        level: 11,
        stats: new Stats({ maxHealth: 310, damage: 33, armor: 23, speed: 14, blockChancePercent: 16 }),
        weaponName: 'Bronz Kakmalı Gladyus & Yuvarlak Kalkan',
        weaponType: 'kılıç',
        description: 'Eski imparatorluk lejyonlarının sıkı askeri disiplinini uygulayan, her hamlesini bir tabur nizamıyla planlayan tecrübeli asker.',
        rewardGold: 70,
        rewardExp: 130,
        rewardFame: 3,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GURURLU,
          bio: 'Lejyon dağılmış olsa da kuralları kalbinde yaşatır. Düzensiz dövüşen barbarlardan tiksinir.',
          gold: 100,
          latestDiary: 'Gladyusunun namlusunu zımpara taşıyla ayna gibi parlatıp kılıfına soktu.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_orin_1',
            name: 'Lejyon Dürtüşü',
            icon: '🗡️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Kalkan arkasından gladyus ile gövdeye düz hamle yapar.',
            combatEffect: '+30 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_orin_2',
            name: 'Bronz Siper',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Yuvarlak kalkanıyla hasmın kılıcını yana sektirir.',
            combatEffect: '%35 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_orin_3',
            name: 'Disiplinli Adım',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Nizam adımıyla mesafeyi kendi lehine kilitler.',
            combatEffect: '+5 Zırh ve +3 Hız'
          }),
          new GladiatorSkill({
            id: 'skill_orin_4',
            name: 'İmparatorluk Hükmü',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Kalkanla gözü kapatıp gladyusu doğrudan kalbe sokar.',
            combatEffect: '+75 Temiz Lejyoner Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_zephyr',
        name: 'Zephyr',
        title: 'Yıldırım Oku',
        level: 15,
        stats: new Stats({ maxHealth: 330, damage: 42, armor: 19, speed: 20, critChancePercent: 26 }),
        weaponName: 'Kompozit Dağ Yayı & Kısa Kılıç',
        weaponType: 'yay',
        description: 'Dağ keçisi boynuzundan yapılmış gergin yayıyla rüzgarın esişini hesaplayıp hasmının göz bebeğine ok diken kusursuz keskin nişancı.',
        rewardGold: 95,
        rewardExp: 180,
        rewardFame: 5,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.KURNAZ,
          bio: 'Menziline giren kimse kurtulamaz. Dövüşü 10 adım öteden bitirmeyi sever.',
          gold: 150,
          latestDiary: "Keten Vadisi'nden aldığı sağlam ipliklerle yayının kirişini yeniledi."
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_zephyr_1',
            name: 'Yıldırım Oku',
            icon: '⚡',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Şimşek hızıyla fırlattığı ok hasmın zırhını deler.',
            combatEffect: '+38 Delici Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_zephyr_2',
            name: 'Rüzgar Çemberi',
            icon: '💨',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmın hamlesinden hafifçe yana bükülerek kaçar.',
            combatEffect: '%45 Sıyrılma'
          }),
          new GladiatorSkill({
            id: 'skill_zephyr_3',
            name: 'Kiriş Gerilimi',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Sonraki oku için yay kirişini azami gerer.',
            combatEffect: '+%30 Kritik Şansı'
          }),
          new GladiatorSkill({
            id: 'skill_zephyr_4',
            name: 'Gözbebeği Vuruşu',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Doğrudan kaskın göz aralığına ölümcül bir ok saplar.',
            combatEffect: '+%100 Kusursuz Nişan Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_alistair',
        name: 'Alistair',
        title: 'Granit Muhafız',
        level: 18,
        stats: new Stats({ maxHealth: 460, damage: 45, armor: 35, speed: 11, blockChancePercent: 24 }),
        weaponName: 'Ağır Granit Topuz & Çelik Kalkan',
        weaponType: 'topuz',
        description: 'Kuzey hisarının kapı muhafızlığından gladyatörlüğe geçmiş, granit topuzuyla zırhları hurdaya çeviren, darbe aldıkça hiddetlenen ağır siklet dövüşçü.',
        rewardGold: 120,
        rewardExp: 225,
        rewardFame: 6,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.HIRSLI,
          bio: 'Hisar yıkılır ama Alistair yıkılmaz. Vücudu yaralarla dolu bir kaya kütlesidir.',
          gold: 170,
          latestDiary: "Demirci Torvald'a topuzunun ağırlık merkezini kurşunla doldurttu."
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_alistair_1',
            name: 'Topuz Ezmesi',
            icon: '🔨',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Granit topuzunu hasmın omzuna indirip köprücük kemiğini çatlatır.',
            combatEffect: '+42 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_alistair_2',
            name: 'Kaya Duruşu',
            icon: '🗿',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Topuzunu ve kalkanını kilitleyip sarsılmaz hale gelir.',
            combatEffect: '%50 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_alistair_3',
            name: 'Ağır Tehdit',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Topuzunu yere vurarak hasmı çekingen dövüşmeye zorlar.',
            combatEffect: 'Rakip -%25 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_alistair_4',
            name: 'Kaya Kırıcı',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Topuzu tüm gücüyle savurarak kalkanı ve göğsü ezer.',
            combatEffect: '+105 Granit Yıkım Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_cedric',
        name: 'Cedric',
        title: 'Asil Düellocu',
        level: 12,
        stats: new Stats({ maxHealth: 290, damage: 36, armor: 17, speed: 18, critChancePercent: 22 }),
        weaponName: 'Safir Kakmalı Şık Rapier',
        weaponType: 'rapier',
        description: 'İpek yeleği, yakut düğmeleri ve şık duruşuyla arenaya çıkıp hasmını dans eder gibi dize getiren soylu bir kılıç ustası.',
        rewardGold: 75,
        rewardExp: 140,
        rewardFame: 4,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.TEMBEL,
          bio: 'Dövüşü ter dökmeden bitirmeyi sever. Akşam hanın en pahalı şarabını yudumlar.',
          gold: 160,
          latestDiary: "Fırtına Sığınağı Hanı'nda ozanlara altın dağıtıp kendi adına şiirler söyletti."
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_cedric_1',
            name: 'Asil Dürtüş',
            icon: '🤺',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Zarif bir selamın ardından rapieri göğse saplar.',
            combatEffect: '+34 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_cedric_2',
            name: 'Kibirli Sıyrılış',
            icon: '🎩',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmın kaba vuruşuna gülümseyerek kenara adım atar.',
            combatEffect: '%40 Kaçınma'
          }),
          new GladiatorSkill({
            id: 'skill_cedric_3',
            name: 'Alaycı Selam',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Rakibiyle alay ederek kontrolünü kaybettirir.',
            combatEffect: 'Rakip 1 Tur Yanlış Hamle Yapar'
          }),
          new GladiatorSkill({
            id: 'skill_cedric_4',
            name: 'Mükemmel Hamle',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Kusursuz bir düello vuruşuyla kalbin hemen yanını deşer.',
            combatEffect: '+%90 Kritik Rapier Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_damian',
        name: 'Damian',
        title: 'Kemik Kırıcı',
        level: 16,
        stats: new Stats({ maxHealth: 430, damage: 44, armor: 27, speed: 12, blockChancePercent: 18 }),
        weaponName: 'Ağır Çivili Demir Gürz',
        weaponType: 'gürz',
        description: 'Zindan gardiyanlığından atılmış, elindeki çivili gürzüyle hasmının diz kapaklarını ve dirseklerini hedef alan gaddar bir dövüşçü.',
        rewardGold: 105,
        rewardExp: 200,
        rewardFame: 5,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.VAHSI,
          bio: 'Kemik çatlama sesini duymadan arenadan ayrılmaz.',
          gold: 130,
          latestDiary: 'Gürzünün çivilerini bileğitaşında jilet gibi biledi.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_damian_1',
            name: 'Diz Kırıcı',
            icon: '🔨',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Gürzü hasmın diz kapağına savurur.',
            combatEffect: '+40 Hasar & Hız Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_damian_2',
            name: 'Zırhlı Omuz',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Demir omuzluğunu öne çıkararak kılıcı kırar.',
            combatEffect: '%38 Hasar Engelleme'
          }),
          new GladiatorSkill({
            id: 'skill_damian_3',
            name: 'Korku Salma',
            icon: '😱',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Gürzünü yere vurup vahşi bir kahkaha atar.',
            combatEffect: 'Rakip -4 Zırh'
          }),
          new GladiatorSkill({
            id: 'skill_damian_4',
            name: 'Kemik Dağıtıcı',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Gürzünü tepeden göğüs kafesine tüm gücüyle indirir.',
            combatEffect: '+100 Kemik Ezici Hasar'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_tiberius',
        name: 'Tiberius',
        title: 'Garnizon Başbuğu',
        level: 23,
        stats: new Stats({ maxHealth: 570, damage: 60, armor: 37, speed: 15, critChancePercent: 22, blockChancePercent: 25 }),
        weaponName: 'Altın İşlemeli Kadim Garnizon Kılıcı & Şeref Kalkanı',
        weaponType: 'kılıç',
        description: "Taş Hisar'ın eski ordu komutanı. Rüşvete ve saray entrikalarına boyun eğmediği için rütbeleri sökülüp arenaya atılmış, diyarın en tecrübeli kılıç ustası.",
        rewardGold: 210,
        rewardExp: 380,
        rewardFame: 10,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GURURLU,
          bio: 'Onuru rütbelerden üstündür. Arenada bile gerçek bir kumandanın asaletiyle dövüşür.',
          gold: 350,
          latestDiary: 'Genç gladyatörlere kılıç duruşu ve siper nizamı dersleri verdi.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_tiberius_1',
            name: 'Kumandan Kesisi',
            icon: '⚔️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Kusursuz askeri açıyla hasmın göğsüne ölümcül bir kılıç çeker.',
            combatEffect: '+52 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_tiberius_2',
            name: 'Şeref Siperi',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Şeref kalkanıyla gelen darbeyi havaya sektirir.',
            combatEffect: '%55 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_tiberius_3',
            name: 'Taktiksel Zaaf',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmın dövüş tarzındaki tek açığı anında fark eder.',
            combatEffect: '+%30 Kritik Şansı'
          }),
          new GladiatorSkill({
            id: 'skill_tiberius_4',
            name: 'Garnizon Şerefi',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Kılıç ve kalkan kombinasyonuyla hasmı darmadağın eden fırtına gibi hamleler.',
            combatEffect: '+140 Yüce Kumandan Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_gideon',
        name: 'Gideon',
        title: 'Şafak Gözcüsü',
        level: 15,
        stats: new Stats({ maxHealth: 380, damage: 41, armor: 28, speed: 14, blockChancePercent: 22 }),
        weaponName: 'Güneş Çeliği Geniş Kılıç & Kalkan',
        weaponType: 'kılıç',
        description: 'Doğu dağlarının güneş tapınaklarında yetişmiş, kılıcının üzerine kutsal dualar kazınmış inançlı bir şafak savaşçısı.',
        rewardGold: 95,
        rewardExp: 180,
        rewardFame: 5,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GURURLU,
          bio: 'Işığın karanlığı yeneceğine inanır; arenadaki zalim gladyatörleri arındırmak için dövüşür.',
          gold: 135,
          latestDiary: 'Güneş doğarken kumların üzerine oturup kılıcını kutsadı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_gideon_1',
            name: 'Şafak Vuruşu',
            icon: '☀️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Kılıcından yayılan ışıkla hasmın göğsünü yarar.',
            combatEffect: '+38 Işık Hasarı'
          }),
          new GladiatorSkill({
            id: 'skill_gideon_2',
            name: 'Kutsal Siper',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Kalkanının rünleriyle gelen darbeyi emer.',
            combatEffect: '%45 Hasar Engelleme'
          }),
          new GladiatorSkill({
            id: 'skill_gideon_3',
            name: 'Arındırıcı Işık',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Işık parıltısıyla hasmı afallatır.',
            combatEffect: 'Rakip 1 Tur Kör Olur'
          }),
          new GladiatorSkill({
            id: 'skill_gideon_4',
            name: 'Güneşin Gazabı',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Kılıcını göğe kaldırıp güneş aleviyle hasmın üzerine iner.',
            combatEffect: '+95 Kutsal Hasar'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_malakai',
        name: 'Malakai',
        title: 'Lanetli Gladyatör',
        level: 20,
        stats: new Stats({ maxHealth: 490, damage: 53, armor: 30, speed: 15, critChancePercent: 25 }),
        weaponName: 'Çentikli Kara Demir Balta',
        weaponType: 'balta',
        description: "Yıllarca Taş Hisar'ın en dip zindanında prangalı tutulmuş, aklını yitirmiş ve acı çektirmekten başka hiçbir şey düşünmeyen vahşi bir ölüm makinesi.",
        rewardGold: 150,
        rewardExp: 280,
        rewardFame: 8,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.VAHSI,
          bio: 'Prangaların pası etine işlemiştir. Arenada kimseyi sağ bırakmamaya yeminlidir.',
          gold: 190,
          latestDiary: 'Zindan duvarlarına baltasıyla öldürdüğü rakiplerin çentiklerini kazıdı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_malakai_1',
            name: 'Lanetli Kesik',
            icon: '🪓',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Çentikli baltasıyla hasmın etini lime lime eder.',
            combatEffect: '+46 Hasar & Ağır Kanama'
          }),
          new GladiatorSkill({
            id: 'skill_malakai_2',
            name: 'Pranga Direnci',
            icon: '⛓️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Acıya karşı duyarsızlaşarak darbeleri hissetmez.',
            combatEffect: '%50 Hasar Azaltma'
          }),
          new GladiatorSkill({
            id: 'skill_malakai_3',
            name: 'Deli Kahkaha',
            icon: '🤪',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Korkunç bir kahkaha atarak rakibin cesaretini kırar.',
            combatEffect: 'Rakip -%25 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_malakai_4',
            name: 'Katliam Öfkesi',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Baltasını durmaksızın hasmın göğsüne saplar.',
            combatEffect: '+120 Vahşi Katliam Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_roland',
        name: 'Roland',
        title: 'Kırılmaz Kalkan',
        level: 19,
        stats: new Stats({ maxHealth: 470, damage: 44, armor: 36, speed: 12, blockChancePercent: 30 }),
        weaponName: 'Ejderha Pullu Ağır Kalkan & Süvari Kılıcı',
        weaponType: 'kalkan',
        description: 'Diyar savaşlarında yüzlerce mızrağın karşısında tek başına durmuş, kalkanında kırılmamış tek bir pul bile kalmamış kıdemli gazi.',
        rewardGold: 130,
        rewardExp: 240,
        rewardFame: 6,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GURURLU,
          bio: 'Kalkanı onun namusudur. Kalkanı düşmeden hiçbir düşman onu deviremez.',
          gold: 180,
          latestDiary: 'Kalkanının pullarını tek tek inceleyip zayıf halkaları perçinledi.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_roland_1',
            name: 'Pul Çarpması',
            icon: '🛡️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Ağır kalkanının sivri alt ucunu hasmın ayağına çarpar.',
            combatEffect: '+38 Hasar'
          }),
          new GladiatorSkill({
            id: 'skill_roland_2',
            name: 'Kırılmaz Kubbe',
            icon: '🧱',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Kalkanının arkasına siper alıp her türlü darbeyi savuşturur.',
            combatEffect: '%60 Hasar Engelleme'
          }),
          new GladiatorSkill({
            id: 'skill_roland_3',
            name: 'Gazi Bakışı',
            icon: '👁️',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Hasmın acemi hamlesini sezerek boşa çıkarır.',
            combatEffect: '+%20 Blok Şansı'
          }),
          new GladiatorSkill({
            id: 'skill_roland_4',
            name: 'Ejderha Savunması',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Kalkanıyla hasmı ezip ardından kılıcıyla son darbeyi indirir.',
            combatEffect: '+105 Ezici Gazi Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_fenris',
        name: 'Fenris',
        title: 'Çöl Sırtlanı',
        level: 14,
        stats: new Stats({ maxHealth: 340, damage: 39, armor: 21, speed: 17, critChancePercent: 21 }),
        weaponName: 'Tırtıklı Kervan Palası & Kemik Çakısı',
        weaponType: 'pala',
        description: 'Kervan yollarını pusuya düşüren, kan kokusu aldığında sırtlan gibi hırlayarak rakibinin zayıf anını kollayan acımasız çöl haydutu.',
        rewardGold: 85,
        rewardExp: 160,
        rewardFame: 4,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.KURNAZ,
          bio: 'Asla dürüst dövüşmez. Hasmın ayağı tökezlediği an boğazına sarılır.',
          gold: 140,
          latestDiary: 'Handaki sarhoş bir tüccarın cüzdanını aşırdı.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_fenris_1',
            name: 'Tırtıklı Kesik',
            icon: '🗡️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Palasının tırtıklı ağzıyla eti koparır.',
            combatEffect: '+36 Hasar & Kanama'
          }),
          new GladiatorSkill({
            id: 'skill_fenris_2',
            name: 'Kum Sıyrılışı',
            icon: '💨',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Kuma yuvarlanarak darbeden kaçar.',
            combatEffect: '%40 Sıyrılma'
          }),
          new GladiatorSkill({
            id: 'skill_fenris_3',
            name: 'Sırtlan Isırığı',
            icon: '🐺',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Gizlice çıkardığı kemik çakısıyla hasmın bacağını deşer.',
            combatEffect: 'Rakip -4 Hız'
          }),
          new GladiatorSkill({
            id: 'skill_fenris_4',
            name: 'Kuduz Saldırı',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'Kendini kaybederek palasıyla hasmın üzerine çullanır.',
            combatEffect: '+%85 Vahşi Haydut Hasarı'
          })
        ]
      }),
      new Enemy({
        id: 'fighter_baelor',
        name: 'Baelor',
        title: 'Demir Maskeli Cellat',
        level: 18,
        stats: new Stats({ maxHealth: 445, damage: 46, armor: 27, speed: 15, dodgeChancePercent: 14, critChancePercent: 21 }),
        weaponName: 'Zincirli Çift Ağır Orak',
        weaponType: 'orak',
        description: 'Yüzünde dökme demirden perçinli bir cellat maskesi taşıyan, ellerine doladığı zincirli çifte ağır oraklarıyla ölüm çemberi oluşturan acımasız ve sessiz bir savaş makinesi.',
        rewardGold: 125,
        rewardExp: 230,
        rewardFame: 6,
        personality: new FighterPersonality({
          archetype: PersonalityArchetype.GIZEMLI,
          bio: 'Asla tek kelime etmez. Yüzündeki maskenin ardında ne bir merhamet ne de insani bir ifade vardır.',
          gold: 180,
          latestDiary: 'Zincirli oraklarının çelik halkalarını kızgın kor üzerinde tekrar tavlayıp perçinledi.'
        }),
        skills: [
          new GladiatorSkill({
            id: 'skill_baelor_1',
            name: 'Zincirli Orak Savuruşu',
            icon: '⛓️',
            type: SkillType.ATTACK,
            tier: 1,
            cooldownTurns: 2,
            description: 'Zincirli oraklarını havada fırıldak gibi çevirip hasmın böğrüne saplar.',
            combatEffect: '+44 Hasar & Kanama'
          }),
          new GladiatorSkill({
            id: 'skill_baelor_2',
            name: 'Demir Siper Döngüsü',
            icon: '🛡️',
            type: SkillType.DEFENSE,
            tier: 1,
            cooldownTurns: 3,
            description: 'Zincirleri ve orakları etrafında hızla döndürerek gelen darbeleri havada parçalar.',
            combatEffect: '%45 Hasar Engelleme'
          }),
          new GladiatorSkill({
            id: 'skill_baelor_3',
            name: 'Tendon Kancası',
            icon: '🎯',
            type: SkillType.TACTICAL,
            tier: 1,
            cooldownTurns: 3,
            description: 'Orağın çengeliyle hasmın diz arkasındaki tendonu kavrayıp yere çalar.',
            combatEffect: 'Rakip 1 Tur Hamle Yapamaz ve -4 Hız'
          }),
          new GladiatorSkill({
            id: 'skill_baelor_4',
            name: 'Cellat Kıskacı',
            icon: '💥',
            type: SkillType.ULTIMATE,
            tier: 1,
            cooldownTurns: 4,
            description: 'İki orağı hasmın boynuna makas gibi geçirip tüm gücüyle asılır.',
            combatEffect: '+115 Boğaz Biçen Cellat Hasarı'
          })
        ]
      })
    ].map(it => it.copy({ regionId: 'tashisar' }));
  },

  createTashisarCharacterProfiles() {
    return TashisarGladiatorsData.createTashisarEnemies().map(enemy => new CharacterProfile({
      id: enemy.id,
      name: enemy.name,
      title: enemy.title,
      category: CharacterCategory.GLADIATOR,
      avatarIcon: (() => {
        if (enemy.weaponType === 'bıçak' || enemy.weaponType === 'hançer' || enemy.weaponType === 'şiş' || enemy.weaponType === 'orak') {
          return '🗡️';
        } else if (enemy.weaponType === 'yay' || enemy.weaponType === 'arbalet') {
          return '🏹';
        } else if (enemy.weaponType === 'balta') {
          return '🪓';
        } else if (enemy.weaponType === 'balyoz' || enemy.weaponType === 'topuz' || enemy.weaponType === 'gürz') {
          return '🔨';
        } else if (enemy.weaponType === 'mızrak' || enemy.weaponType === 'kargı' || enemy.weaponType === 'teber') {
          return '🔱';
        } else if (enemy.weaponType === 'kalkan') {
          return '🛡️';
        } else {
          return '⚔️';
        }
      })(),
      roleOrWeapon: `${enemy.weaponName} (Seviye ${enemy.level})`,
      appearance: (() => {
        if (enemy.id === 'fighter_aresula') {
          return '1.75 boyunda, ince fakat çelik gibi gergin kaslara sahip. Kum sarısı örgülü saçları, yüzünde rüzgar desenli kabile dövmeleri var. Üzerinde hafif deri zırh ve belinde iki hilal bıçağı parıldıyor.';
        } else if (enemy.id === 'fighter_katerina') {
          return '1.80 boyunda, dik duruşlu ve heybetli. Donuk gri gözleri ve omuzlarına dökülen platin beyazı saçları var. Gövdesini kaplayan buz mavisi çelik plakalar ve devasa bir kalkan taşır.';
        } else if (enemy.id === 'fighter_xayah') {
          return '1.68 boyunda, çevik ve esnek. Simsiyah kuzgun tüylerinden örülmüş bir pelerin taşır. Bakışları avını süzen bir yırtıcı kuş kadar keskindir. Parmak aralarında gizli jilet hançerler tutar.';
        } else if (enemy.id === 'fighter_valeria') {
          return '1.85 boyunda, geniş omuzlu ve heybetli bir kadın şövalye. Yüzünün sağ tarafında eski bir kılıç çentiği izi vardır. Üzerindeki ağır çelik zırh baştan aşağı perçinlidir; devasa çift elli kılıcını tek hamlede kaldırır.';
        } else if (enemy.id === 'fighter_seraphina') {
          return '1.72 boyunda, bronz tenli ve ateş kızılı saçlı. Gözlerinde dağ lavlarının parıltısı okunur. Omuzunda kızıl köz taşlarıyla kakılmış bir yay ve sırtında alevli ok sadakları taşır.';
        } else if (enemy.id === 'fighter_lyra') {
          return '1.65 boyunda, gölgeler kadar sessiz ve zayıf yapılı. Simsiyah keten kıyafetleri vücudunu sıkıca sarar. Adımları kum üzerinde tek bir iz bile bırakmaz; hançerlerinin ucu yeşilimsi zehirle parlar.';
        } else if (enemy.id === 'fighter_morgana') {
          return '1.70 boyunda, derin mor gözleri ve yere kadar uzanan siyah cübbesiyle ürkütücü bir güzelliğe sahip. Boynunda karga kafatası dizili kolyeler ve elinde rünlerle oyulmuş bir kemik asa taşır.';
        } else if (enemy.id === 'fighter_astrid') {
          return '1.78 boyunda, vahşi ve kaslı. Yüzüne çekilmiş mavi savaş boyaları ve boynundaki kurt kürkleri ona bir dağ canavarı havası verir. İki başlı kurt baltasını elinden hiç düşürmez.';
        } else if (enemy.id === 'fighter_helena') {
          return '1.76 boyunda, askeri nizamla dimdik duran kusursuz bir asker. Saçları sıkı bir topuz yapılmış, üniforması üzerinde garnizon armaları taşır. Kargısı kendi boyundan bir karış uzundur.';
        } else if (enemy.id === 'fighter_nyx') {
          return '1.82 boyunda, zayıf ve tekinsiz bir siluet. Yüzü tamamen siyah ipek bir peçeyle örtülüdür. Elinde taşıdığı hilal tırpanın boyu iki metreyi aşar ve zeminde derin izler bırakır.';
        } else if (enemy.id === 'fighter_rowan') {
          return '1.73 boyunda, kızıl yele gibi saçları ve çilli sert bir yüzü vardır. Omuzlarındaki ayı kürkü ve kollarındaki demir bilekliklerle iki başlı baltasını fırıldak gibi çevirir.';
        } else if (enemy.id === 'fighter_selene') {
          return '1.77 boyunda, zarif ve asil duruşlu. Üzerindeki gümüş plakalar ay ışığını yansıtır. Cilalı ayna kalkanı ve hilal kılıcıyla bir heykeltıraşın elinden çıkmış gibidir.';
        } else if (enemy.id === 'fighter_yvaine') {
          return '1.71 boyunda, saray terbiyesi almış ince yapılı ve zarif. İpek eldivenli ellerinde tuttuğu safir kakmalı rapierin ucu titremeksizin hasmın gözüne kilitlenir.';
        } else if (enemy.id === 'fighter_freya') {
          return "1.86 boyunda, Taş Hisar'ın en heybetli kadın şampiyonu. Altın işlemeli çelik göğüslüğü ve başında dalgalanan şampiyonluk sorgucu vardır. Devasa teberini tek eliyle yere vurarak selam verir.";
        } else if (enemy.id === 'fighter_vespera') {
          return '1.67 boyunda, kurnaz ve sinsi bakışlı. Belindeki deri kuşakta onlarca küçük cam zehir tüpü asılıdır. İnce şişinin ucundan yeşil akrep zehri damlar.';
        } else if (enemy.id === 'fighter_voladmir') {
          return '1.88 boyunda, solgun beyaz tenli, kömür karası saçlı ve aristokrat yapılı. Üzerindeki kadife kızıl pelerin kan rengindedir. Gözleri kurbanına baktığında hipnotize edici bir soğukluk yayar.';
        } else if (enemy.id === 'fighter_draven') {
          return '1.82 boyunda, gösterişli bıyıkları, sırıtkan yüzü ve kaslı gövdesiyle bir gladyatör şovmeni. İki elinde tuttuğu kasap baltalarını sürekli havada döndürür.';
        } else if (enemy.id === 'fighter_balthazar') {
          return '2.05 boyunda, adeta yürüyen bir kaya kütlesi. Geniş göğsü kalın granit plakalarla zırhlanmıştır. Yere bastığında kumlar titrer; devasa balyozunu sırtında bir tüy gibi taşır.';
        } else if (enemy.id === 'fighter_kaelen_garrison') {
          return '1.80 boyunda, fırtına gibi hızlı ve atik. Rüzgar geçirmez hafif süvari zırhı ve şimşek desenli uzun kargısıyla daima tetiktedir.';
        } else if (enemy.id === 'fighter_lucian') {
          return '1.79 boyunda, deri ceketli ve iki elinde arbalet tutan keskin nişancı. Gözlerinde soğuk bir hesapçılık vardır; her adımını milimetrik hesaplar.';
        } else if (enemy.id === 'fighter_rorik') {
          return '1.92 boyunda, demirci kömürünün isiyle kararmış devasa kollara sahip. Göğsündeki kalın deri önlük ve çivili ağır balyozuyla bir yürüyen ocak gibidir.';
        } else if (enemy.id === 'fighter_malakor') {
          return '1.84 boyunda, siyah cübbeli ve göz çukurları morarmış karanlık bir münzevi. Parmaklarında kara rün dövmeleri ve elinde obsidyen bir hançer taşır.';
        } else if (enemy.id === 'fighter_viktor') {
          return '1.77 boyunda, sol kolu tamamen çelik dişliler ve yaylarla kaplı mekanik bir mucit. Muşta darbeleri piston gibi patlar.';
        } else if (enemy.id === 'fighter_darius') {
          return '1.95 boyunda, ak düşmüş saçları, sert çene yapısı ve heybetli kumandan zırhıyla gerçek bir savaş beyi. Devasa teberini tek hamlede savurur.';
        } else if (enemy.id === 'fighter_garek') {
          return '1.90 boyunda, vahşi ve kambur duruşlu. Sırtında tam bir ayı postu asılıdır; ellerindeki çivili pençeleri yere sürterek yürür.';
        } else if (enemy.id === 'fighter_soren') {
          return '1.76 boyunda, bozkır esintisi gibi çevik ve sessiz. Eğri kılıcının kabzasını iki eliyle tutarak hasmının nefesini dinler.';
        } else if (enemy.id === 'fighter_theron') {
          return '1.86 boyunda, kızıl sakallı ve kollarında köz yanığı dövmeleri olan sert bir asker. Mızrağının ucundan kızıl kıvılcımlar saçılır.';
        } else if (enemy.id === 'fighter_cassian') {
          return '1.74 boyunda, gölgelerin içine karışan zayıf yapılı bir suikastçı. Gözleri dışında tüm yüzü siyah bezle sarılıdır.';
        } else if (enemy.id === 'fighter_brandon') {
          return '1.87 boyunda, devasa kule kalkanının arkasında neredeyse tamamen kaybolan aşılmaz bir hisar muhafızı.';
        } else if (enemy.id === 'fighter_orin') {
          return '1.81 boyunda, bronz kasklı ve kırmızı pelerinli disiplinli bir lejyon eri. Gladyusunu kusursuz bir dik açıyla tutar.';
        } else if (enemy.id === 'fighter_zephyr') {
          return '1.78 boyunda, rüzgar gibi hafif dağ kıyafetleri ve kartal tüyü işlemeli yayıyla avını süzen bir nişancı.';
        } else if (enemy.id === 'fighter_alistair') {
          return '1.89 boyunda, geniş omuzlu ve granit topuzuyla zırhları ezen ağır siklet muhafız.';
        } else if (enemy.id === 'fighter_cedric') {
          return '1.75 boyunda, safir kakmalı rapieri ve ipek mendiliyle arenada bile asaletinden ödün vermeyen züppe düellocu.';
        } else if (enemy.id === 'fighter_damian') {
          return '1.93 boyunda, çivili gürzünü yere vura vura yürüyen, dişleri dökülmüş acımasız bir kemik kırıcı.';
        } else if (enemy.id === 'fighter_tiberius') {
          return "1.90 boyunda, altın işlemeli garnizon zırhı ve asil kılıcıyla Taş Hisar'ın yaşayan efsanesi. Saçları kırlaşmış fakat bakışları kartal gibidir.";
        } else if (enemy.id === 'fighter_gideon') {
          return '1.83 boyunda, güneş sembollü kalkanı ve ışıldayan kılıcıyla pes etmeyen inançlı bir şafak savaşçısı.';
        } else if (enemy.id === 'fighter_malakai') {
          return '1.94 boyunda, boynunda kırık prangalar sarkan, gözleri kandan kızarmış zincirsiz bir canavar.';
        } else if (enemy.id === 'fighter_roland') {
          return '1.85 boyunda, ejderha pullu ağır kalkanıyla onlarca savaştan sağ çıkmış yıkılmaz bir gazi.';
        } else if (enemy.id === 'fighter_fenris') {
          return '1.76 boyunda, sırtlan postuna bürünmüş, tırtıklı palasıyla sinsi sinsi süzülen çöl haydutu.';
        } else if (enemy.id === 'fighter_baelor') {
          return '1.88 boyunda, omuzları demir prangalarla sarılı, yüzünde tek bir deliği bile olmayan buz gibi soğuk çelik bir cellat maskesi taşır. İki elinde zincirlerle bağlı ağır hilal oraklarını sürekli şakırdatarak döndürür.';
        } else {
          return "Taş Hisar Garnizonu'nun çetin kumlarında dövüşen deneyimli gladyatör.";
        }
      })(),
      backgroundLore: (() => {
        if (enemy.id === 'fighter_aresula') {
          return "Aresula, dağ geçitlerinde rüzgarla yarışan göçebe bir kabilenin kızıydı. Başkent kervanları kabilesinin otlaklarını işgal edip ailesini tutsak edince, fidye altınını kazanmak için Taş Hisar arenasına adım attı.\n\nİki elinde tuttuğu hilal bıçaklarını bir fırtına gibi savurur. Arenadaki rakipleri onun dönüş hızını takip edemeden boyunlarında soğuk çeliğin temasını hisseder.\n\nTaş Hisar'ın kumlarında kısa sürede büyük bir şöhret kazandı; kazandığı her kuruşu kabilesinin esaret zincirlerini kırmak için biriktiriyor.";
        } else if (enemy.id === 'fighter_katerina') {
          return "Katerina, kuzey fiyortlarının dondurucu sınır kalelerinde büyüdü. Çelik ve buz onun hem beşiği hem de zırhı oldu. Sınır birliğindeki kumandanının ihaneti sonucu birliği pusuya düşürülünce tek başına hayatta kaldı.\n\nİntikam yeminiyle Taş Hisar'a gelen Katerina, kalkanını bir buzul duvarı gibi kullanarak arenanın en vahşi canavarlarını bile dize getirdi. Soğukkanlılığı rakiplerinin en büyük kabusudur.\n\nHiçbir darbe onu sarsamaz; mızrağının ucundaki soğuk çelik, ihanet eden kumandanının kalbine saplanacağı günü bekliyor.";
        } else if (enemy.id === 'fighter_xayah') {
          return "Xayah, Taş Hisar'ın yüksek hisar surlarının gölgesindeki çatılarda büyümüş bir sokak yetimiydi. Kuşların tüy döküşünden esinlenerek geliştirdiği jilet keskinliğindeki fırlatma hançerleriyle nam saldı.\n\nYeraltı loncalarının infazcısı olarak çalıştıktan sonra, kendi kaderini kendi elleriyle çizmek için arenanın kumlarına indi. Seyirciler onun gölgelerden çıkıp tek bir sıçrayışla rakibi biçişini nefeslerini tutarak izler.\n\nParaya ya da unvana değer vermez; tek istediği arenadaki tüm efendilerin tepesine basarak gökyüzüne uçmaktır.";
        } else if (enemy.id === 'fighter_valeria') {
          return 'Valeria, bir zamanlar başkentin en seçkin lefter birliğinde görev yapan soylu bir kadın subaydı. Saraydaki bir darbe girişiminde haksız yere suçlanınca ailesinin kılıcını kuşanıp sınıra kaçtı.\n\nTaş Hisar arenasında çift elli devasa kılıcını savururken kaybettiği unvanının ve onurunun peşindedir. Arenadaki paralı askerlerin kaba kuvveti onun disiplinli savaş taktikleri karşısında yetersiz kalır.\n\nHer zaferinde kılıcını göğe kaldırarak adalet gününün geleceğini haykırır.';
        } else if (enemy.id === 'fighter_seraphina') {
          return "Seraphina, lav yataklarının ve kızıl çöllerin kızıdır. Çöl aşiretlerinin kadim köz okçuluğu geleneğini Taş Hisar'a taşıyan tek savaşçıdır.\n\nKöz taşlarıyla ovulmuş okları hedefine çarptığında patlayan alevler, arenanın kumlarını kızıla boyar. Rakiplerine asla yaklaşmaz; mesafeyi koruyup uzaktan avlar.\n\nTaş Hisar'ın soğuk ve yağmurlu havasına inat, içindeki çöl ateşini her dövüşte arenaya püskürtür.";
        } else if (enemy.id === 'fighter_lyra') {
          return "Lyra, diyarın en tehlikeli suikast loncasında eğitilmiş fakat bir çocuğu öldürmeyi reddettiği için loncası tarafından ölüme mahkum edilmiş bir kaçaktır.\n\nHayatta kalmanın tek yolunun Taş Hisar'ın korunaklı arenasında dövüşmek olduğunu gördü. İnce engerek hançerleriyle yaptığı darbeler adeta bir ölüm dansıdır.\n\nHasmının kanını dökmeden önce gözlerinin içine bakar ve fısıldar: 'Gölgeler her zaman kazanır.'";
        } else if (enemy.id === 'fighter_morgana') {
          return 'Morgana, yasaklı kara rünleri çeliğin üzerine kazıyan eski bir tapınak büyücüsüdür. Diyarın şifacıları onun yöntemlerini lanetleyince kendini kanlı arenalarda buldu.\n\nAsasından çıkan karanlık enerji rakiplerinin ruhunu ve canını emer. Arenadaki diğer gladyatörler onunla eşleşmekten dehşetle korkar.\n\nOnun için Taş Hisar arenası bir spor alanı değil, kadim bir kan ritüeli sahasıdır.';
        } else if (enemy.id === 'fighter_astrid') {
          return 'Astrid, kuzey dağlarındaki bir kurt sürüsü tarafından büyütüldüğüne inanılan vahşi bir akıncıdır. Medeniyetin kurallarını bilmez, çeliğin sadece öldürmek için var olduğuna inanır.\n\nBaltasının kancasıyla düşman kalkanlarını paramparça ederken attığı kurt uluması arenadaki binlerce seyirciyi ayağa kaldırır.\n\nYaralandığında acı hissetmez; dökülen kendi kanı bile onun hiddetini katbekat artırır.';
        } else if (enemy.id === 'fighter_helena') {
          return "Helena, babası Taş Hisar'ın kıdemli bir garnizon çavuşu olan, kışlalarda mızrak talimleriyle büyüyen bir asker kızıdır.\n\nBabasının bir sınır çatışmasında şehit düşmesi üzerine onun kargısını eline alarak arenaya çıktı. Askeri nizamı ve kusursuz savunma mesafesiyle rakiplerine nefes aldırmaz.\n\nArenadaki amacı Taş Hisar garnizonunun en yüksek rütbeli şampiyonu olmaktır.";
        } else if (enemy.id === 'fighter_nyx') {
          return "Nyx hakkında hiç kimse bir şey bilmez; nereden geldiği, yüzünün nasıl olduğu bir sırdır. Yalnızca gece dövüşlerinde ortaya çıkar ve devasa tırpanıyla rakiplerini tek hamlede biçer.\n\nArenanın loş ışıklarında tırpanının savruluşu bir hilal gibi parıldar. Yenilen hasımların son gördüğü şey onun siyah tülü altındaki parıldayan gözleridir.\n\nTaş Hisar'ın en karanlık efsanelerinden biridir.";
        } else if (enemy.id === 'fighter_rowan') {
          return 'Rowan, çam ormanlarında odunculuk yaparak devasa ağaçları deviren kuvvetli bir dağ kadınıydı. Haydutların köyünü yakması üzerine eline iki başlı orman baltasını alıp katillerin peşine düştü.\n\nİntikamını aldıktan sonra dövüşün getirdiği vahşi heyecandan kopamadı ve Taş Hisar arenasına yazıldı. Baltasını bir perende gibi çevirerek rakiplerinin kemiklerini un ufak eder.\n\nHer zaferden sonra bir kupa dolusu arpa birasını kafasına dikip kahkahalar atar.';
        } else if (enemy.id === 'fighter_selene') {
          return 'Selene, ay ışığında kutsanmış gümüş kılıcıyla diyardaki kötülükleri temizlemeye ant içmiş münzevi bir şövalyedir.\n\nArenaya girme sebebi para değil; arenadaki tiranları ve zalim efendileri halkın gözü önünde dize getirmektir. Cilalı ayna kalkanı güneş ışığını veya meşaleleri hasmın gözüne yansıtarak kör eder.\n\nAsaleti ve adaletiyle Taş Hisar halkının sevgilisi haline gelmiştir.';
        } else if (enemy.id === 'fighter_yvaine') {
          return "Yvaine, asil bir dükün kızıydı; saray entrikaları yüzünden babası zindana atılınca ailesinin onurunu kurtarmak için kılıcını çekti.\n\nRapier kullanmaktaki ustalığı bir cerrahın neşteri kadar kusursuzdur. Kaba kuvvet kullanan iri yarı gladyatörlerin hamlelerini zarif bir adımla boşa çıkarıp tek noktadan deler geçer.\n\nTaş Hisar'ın çamurlu kumlarını bir saray salonu gibi adımlar.";
        } else if (enemy.id === 'fighter_freya') {
          return "Freya, Taş Hisar Garnizonu'nun yetiştirdiği en büyük kadın şampiyondur. Teberini kullanmaktaki ustalığı ve stratejik zekasıyla ardı ardına 30 maçtan namağlup çıkmıştır.\n\nGarnizon komutanları bile ona saygı duyar. Arenadaki kumların her karışını ezbere bilir ve hasmını istediği köşeye sürükleyip kıstırır.\n\nTahtını korumak için diyarın dört bir yanından gelen meydan okuyanları beklemektedir.";
        } else if (enemy.id === 'fighter_vespera') {
          return 'Vespera, maden ocaklarındaki zehirli akrepler ve yılanlarla haşır neşir büyüyen bir simyacının kızıdır. Zehirlerin hangi damarı kaç saniyede durduracağını ezbere bilir.\n\nİnce şişinin ucuyla yaptığı ufacık bir çizik bile rakibin kaslarını kaskatı kesmeye yeter. Arenadaki dövüşçüler onunla eşleştiğinde zırhlarının her aralığını bezle tıkamaya çalışır.\n\nSoğukkanlı ve acımasızdır; zaferini hasmının zehirle kıvranışını izleyerek kutlar.';
        } else if (enemy.id === 'fighter_voladmir') {
          return "Voladmir, yüzyıllar önce çökmüş bir dağ hanedanının son soyudur. Ailesinin kan büyüsü ritüellerini çeliğin üzerine aktarmıştır. Kızıl kılıcı hasmın etini kestiğinde kılıçtaki yakutlar parıldar.\n\nTaş Hisar'a gelme amacı garnizonu gizlice ele geçirmek ve eski krallığını yeniden kurmaktır. Arenada döktüğü her damla kan onun gücünü ve nüfuzunu artırır.\n\nKibirli, asil ve son derece ölümcül bir kılıç ustasıdır.";
        } else if (enemy.id === 'fighter_draven') {
          return 'Draven, başkentin sokak gösterilerinden zindanlarına, oradan da arenalarına kadar yükselmiş bir cellattır. Dövüşü sadece kazanmak için değil, seyircileri çılgına çevirmek için yapar.\n\nHavaya fırlattığı iki baltayı dönerek yakalaması ve hasmının boynunu aynı anda biçmesi onun imza hareketidir. Arenadaki taraftarlar onun adını koro halinde haykırır.\n\nKibrine dokunan herkesi baltalarının ucunda can verirken görmek ister.';
        } else if (enemy.id === 'fighter_balthazar') {
          return 'Balthazar, Taş Hisar ocaklarında kayaları kıran bir köleydi. Bir gün maden çöktüğünde 20 tonluk mermer bloğu tek başına sırtlayarak arkadaşlarını kurtarınca komutanlar onun gücünü fark etti.\n\nVücuduna granit taşlar zincirlendi ve eline devasa bir yıkım balyozu verildi. Arenada yürürken attığı her adım yer sarsıntısı yaratır.\n\nZırhı delemezsiniz, onu deviremezsiniz; o yaşayan bir dağdır.';
        } else if (enemy.id === 'fighter_kaelen_garrison') {
          return 'Kaelen, bozkırın rüzgarlı vadilerinden kopup gelmiş bir süvari ustasıdır. Atı olmadan arenaya çıktığında bile süvari hızını bacaklarında taşır.\n\nUzun kargısıyla yaptığı yıldırım hamleleri hasmın kalkanını delip arkasındaki göğsü parçalar. Arenanın kumlarını bir koşu pisti gibi kullanır.\n\nÖzgürlüğünü geri kazanıp bozkırın sonsuz ufuklarına dönmek için dövüşür.';
        } else if (enemy.id === 'fighter_lucian') {
          return 'Lucian, bir zamanlar sınır devriyelerinde keskin nişancı olarak görev yapan soğukkanlı bir silahşordur. Çift arbaletiyle göz açıp kapayıncaya kadar yaylım ateşi açar.\n\nYakın dövüşe giren rakiplerine karşı belindeki çelik kamayı bir şimşek hızıyla çeker. Her hamlesi matematiksel bir hassasiyettedir.\n\nArenadaki kumlar üzerinde asla gereksiz tek bir adım bile atmaz.';
        } else if (enemy.id === 'fighter_rorik') {
          return 'Rorik, Taş Hisar garnizonunun baş demircisinin çırağıydı. Yıllarca ocakta örs döverek kazandığı çelik gibi kaslarını arenada denemek istedi.\n\nBalyozunun başına çaktığı sivri çiviler zırhları bir kağıt gibi deler geçer. Darbe aldığında gülümser; çünkü örsün ateşi ona acıyı unutturmuştur.\n\nOnun için her gladyatör şekil verilmesi gereken ham bir demir parçasıdır.';
        } else if (enemy.id === 'fighter_malakor') {
          return "Malakor, kara rünlerin ve gölge büyülerinin efendisidir. Başkentin akademisinden kovulduğundan beri Taş Hisar'ın yeraltı mahzenlerinde gizlenir.\n\nObsidyen hançeriyle havaya çizdiği kara mühürler hasmın zihnini bulandırır ve kollarını felç eder. Arenada dövüşürken etrafını kara bir sis kaplar.\n\nFiziksel güçten nefret eder; zayıf bedenlerin karanlık zeka karşısında ezilişini izler.";
        } else if (enemy.id === 'fighter_viktor') {
          return 'Viktor, mekanik aletlere ve yay sistemlerine takıntılı bir zanaatkardır. Kendi tasarladığı yaylı çelik muştası darbe anında hidrolik bir güçle patlar.\n\nArenadaki rakipleri onun sıradan bir yumruk attığını sanırken, patlayan yayın etkisiyle kaburgaları kırılır. Sürekli yeni dövüş icatları peşindedir.\n\nArenanın kumlarını bir deney sahası olarak görür.';
        } else if (enemy.id === 'fighter_darius') {
          return 'Darius, sınır birliklerinde generallik yapmış efsanevi bir savaş beyidir. Hükümetin yolsuzluklarına karşı çıktığı için unvanları elinden alınıp arenaya sürülmüştür.\n\nİki başlı devasa teberiyle yüzlerce askere karşı tek başına durmuş bir gazidir. Arenadaki amatör gladyatörler onun karşısına çıktığında gerçek bir savaşın ne olduğunu anlarlar.\n\nGözlerindeki gurur ve tecrübe hiçbir yenilgiyle silinemez.';
        } else if (enemy.id === 'fighter_garek') {
          return 'Garek, karlı zirvelerde bir bozayı postuna bürünerek yaşayan ilkel bir dağ adamıdır. Taş Hisar kervanlarına saldırdığı için yakalanıp arenaya atılmıştır.\n\nEllerindeki çivili pençeleriyle hasmının üzerine atılıp boğuşur. Kurallardan anlamaz; hakemlerin düdükleri bile onun hiddetini durduramaz.\n\nYalnızca çiğ et ve kan kokusu onu sakinleştirir.';
        } else if (enemy.id === 'fighter_soren') {
          return 'Soren, bozkırın eğri kılıç ekolünden gelen son ustalardandır. Kılıcını kınından çıkarışı o kadar hızlıdır ki gözle takip edilemez.\n\nKumların üzerinde rüzgar gibi süzülür, hasmın darbesi inmeden çoktan arkasına geçmiş olur. Dövüşü bir sanat gibi icra eder.\n\nTaş Hisar arenasında kılıcının zarafetine hayran binlerce hayranı vardır.';
        } else if (enemy.id === 'fighter_theron') {
          return 'Theron, lav yataklarının kızıl çeliğini taşıyan hiddetli bir lejyonerdir. Mızrağının ucundaki akkor demir hasmın zırhını eritircesine dağlar.\n\nÖfkesini kontrol edemez; dövüş başladığı an gözleri kızıla bürünür. Arenanın zemininde onun adımlarının ardından dumanlar yükselir.\n\nKızıl dağların intikam ateşiyle yanıp tutuşur.';
        } else if (enemy.id === 'fighter_cassian') {
          return 'Cassian, başkentin gölge loncalarından kaçmış en tehlikeli hançer ustasıdır. Hasmın arkasına sızmakta ve aşil tendonunu kesmekte rakipsizdir.\n\nTek bir kelime konuşmaz; yüzündeki siyah maskenin ardında sadece soğuk ölüm parıldar. Zehirli hançerleri tek bir batışta kalbi durdurur.\n\nTaş Hisar zindanlarından özgürlüğünü satın almak için dövüşür.';
        } else if (enemy.id === 'fighter_brandon') {
          return 'Brandon, Taş Hisar garnizonunun kapılarını 15 yıl boyunca korumuş sarsılmaz bir kale muhafızıdır. Boyu kadar kule kalkanının arkasında bir sur gibi dikilir.\n\nHiçbir darbe onu geriye itemez. Kalkanının kenarıyla hasmın çenesini kırıp kısa kılıcıyla işini bitirir.\n\nDisiplin ve sabır onun en büyük silahıdır.';
        } else if (enemy.id === 'fighter_orin') {
          return 'Orin, antik imparatorluk lejyonlarının sıkı nizamını kanında taşıyan sürgün bir askerdir. Gladyusu ve yuvarlak bronz kalkanıyla bir tabur gibi dövüşür.\n\nArenadaki düzensiz gladyatörlerin vahşi saldırılarını nizam adımlarıyla savuşturup tam zamanında göğse saplar.\n\nİmparatorluğun kayıp şerefini kumlar üzerinde yeniden inşa eder.';
        } else if (enemy.id === 'fighter_zephyr') {
          return 'Zephyr, dağ zirvelerinden gelen keskin gözlü bir kartal avcısıdır. Yayıyla fırlattığı çelik oklar havanın direncini yırtarak doğrudan zırh boşluklarına girer.\n\nHasmının yaklaşmasına asla izin vermez; çevik adımlarla geriye kaçarak yayını gerer.\n\nArenadaki tüm dövüşçüler onun yay kirişinin gerilme sesinden ürperir.';
        } else if (enemy.id === 'fighter_alistair') {
          return "Alistair, kuzey garnizonunun kapı bekçisidir. Ağır granit topuzuyla zırhları teneke gibi ezer. Vücudu aldığı darbelerle çelikleşmiştir.\n\nAcı hissetmez; topuzunu savurduğunda çıkan rüzgar bile hasmın dengesini bozar.\n\nTaş Hisar'ın en güvenilir ve en yıkıcı dövüşçülerinden biridir.";
        } else if (enemy.id === 'fighter_cedric') {
          return "Cedric, saray düellolarında onlarca asilzadeyi utanç içinde yere seren kibirli bir kılıç ustasıdır. Sürgüne gönderildiği Taş Hisar'da bile ipek yeleğiyle arenaya çıkar.\n\nRapierinin ucuyla hasmının kılıcını çelip tek noktadan can alıcı vuruşu yapar. Seyircilere reverans yaparak selam durmayı ihmal etmez.\n\nOnun için dövüş bir sanat, kaba gladyatörler ise birer tuvaldir.";
        } else if (enemy.id === 'fighter_damian') {
          return "Damian, zindan gardiyanıyken tutuklulara uyguladığı gaddarlıklar yüzünden arenaya köle olarak atılmıştır. Çivili gürzünü vahşice sallayarak kemik kırar.\n\nHasmının acı çığlıkları onun en büyük zevkidir. Dövüş bittiğinde bile gürzünü kurbanının üzerinde vurmaya devam etmek ister.\n\nTaş Hisar'ın en nefret edilen ama en korkulan simalarındandır.";
        } else if (enemy.id === 'fighter_tiberius') {
          return "Tiberius, Taş Hisar Garnizonu'nun eski başbuğudur. Onlarca sınır seferinde zafer kazanmış, binlerce askere kumandanlık etmiştir. Saray entrikalarına kurban gidip unvanları alınınca arenaya inmiştir.\n\nAltın işlemeli kılıcı ve şeref kalkanıyla arenadaki dövüşçülere savaş sanatının doruk noktasını gösterir. Onunla dövüşmek her gladyatör için bir onurdur.\n\nTaş Hisar kumlarının tartışmasız en büyük yaşayan efsanesidir.";
        } else if (enemy.id === 'fighter_gideon') {
          return 'Gideon, doğu dağlarının şafak tapınaklarında yetişmiş inançlı bir şövalyedir. Kılıcını kötülükle savaşmak için çekmiştir.\n\nGüneş ışığını kalkanında toplayıp hasmın gözünü kör eder, ardından kılıcıyla adalet dağıtır. Arenadaki karanlık ruhları arındırmaya ant içmiştir.\n\nAsla hileye başvurmaz; mertliğiyle herkesin saygısını kazanır.';
        } else if (enemy.id === 'fighter_malakai') {
          return "Malakai, Taş Hisar'ın en derin hücrelerinde zincirlenmiş, deliliğin sınırlarında yaşayan lanetli bir devdir. Boynundaki kırık prangaların şıngırtısı arenaya girdiğinde yankılanır.\n\nBaltası çentiklerle doludur; her çentik öldürdüğü bir celladın anısıdır. Acı çektikçe gücü katlanır.\n\nOnunla dövüşenler bir insanla değil, zincirlerinden boşanmış bir felaketle karşılaşır.";
        } else if (enemy.id === 'fighter_roland') {
          return "Roland, ejderha pullu ağır kalkanıyla diyarın gördüğü en sağlam savunma gazisidir. Yıllar süren savaşlarda üzerine yağan yüzlerce oka ve tebere rağmen dimdik ayakta kalmıştır.\n\nKalkanının arkasında bekleyip rakibin en büyük hatasını yaptığı an süvari kılıcını saplar.\n\nHiçbir fırtına Roland'ın kalkanını deviremez.";
        } else if (enemy.id === 'fighter_fenris') {
          return "Fenris, tuz çöllerinin kervan yollarını haraca bağlamış acımasız bir hayduttur. Tırtıklı palasıyla vurduğu etleri koparır.\n\nSırtlanlar gibi kurnazdır; hasmın gözüne toz atar, bacak arasına çelme takar ve yaralı hayvan gibi üstüne çullanır.\n\nTaş Hisar'ın kumlarında hayatta kalmanın kural tanımaz bir temsilcisidir.";
        } else if (enemy.id === 'fighter_baelor') {
          return 'Baelor, başkentin en karanlık zindanlarında kimliği gizlenen bir kraliyet celladıydı. İnfaz emrini yerine getirirken tek bir söz söylemez, maskesini asla çıkarmazdı. Ancak tahtın varisi olan bir masumu infaz etmeyi reddedince elleri zincirlenerek Taş Hisar arenasına sürüldü.\n\nYüzündeki demir maskenin kilidi dövülerek kapatılmıştır; maskesini yalnızca tüm arenayı dize getireceği gün çıkarabileceğine inanılır. İki elindeki zincirli ağır orakları havada fırıldak gibi çevirerek ölüm saçan bir çember örer.\n\nArenadaki gladyatörler onun zincir sesini duyduklarında adeta donakalır; merhameti olmayan, acıyı hissetmeyen bir adalet infazcısıdır.';
        } else {
          return "Taş Hisar Garnizonu'nun çetin kumlarında dövüşen deneyimli gladyatör.";
        }
      })(),
      isGladiator: true,
      enemyId: enemy.id,
      locationOrDuty: 'Taş Hisar Garnizon Arenası',
      skills: enemy.skills,
      regionId: 'tashisar'
    }));
  },
};

