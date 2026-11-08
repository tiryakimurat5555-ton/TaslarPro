import * as kt from '../../kt.js';
import { CombatEvent, SkillType, TargetBodyPart } from '../model.js';

// Not: domain/model.js'te de (EquipmentCategories.kt) WeaponCategory adlı başka bir enum var; JSON kayıt
// defterinde çakışmasın diye bu motor enum'unun kayıt adı 'TextTemplateEngine.WeaponCategory'.
export const WeaponCategory = kt.defineEnum('TextTemplateEngine.WeaponCategory', {
  BLUDGEON: {},
  PIERCE: {},
  SLASH: {},
  HEAVY_FALCHION: {},
  CHAIN_MACE: {},
  CROSSBOW: {},
  AXE: {},
});

export const CombatTacticalPosition = kt.defineEnum('CombatTacticalPosition', {
  NEUTRAL: {},
  ADVANTAGE: {},
  DESPERATION: {},
});

export const CombatStance = kt.defineEnum('CombatStance', {
  BALANCED: { title: 'Dengeli', narrativePrefix: 'soğukkanlı adımlarla dengesini koruyarak' },
  AGGRESSIVE: { title: 'Topyekün Saldırı', narrativePrefix: 'gözü dönmüş bir hiddetle gardını hiçe sayarak' },
  DEFENSIVE: { title: 'Gard Almış', narrativePrefix: 'arkasına çekilip siperinin ardına saklanarak' },
  OPPORTUNISTIC: { title: 'Zayıf Nokta Arayışı', narrativePrefix: 'hasmının gardındaki açığı sinsice kollayarak' },
});

export const DamageSeverity = kt.defineEnum('DamageSeverity', {
  GLANCING: {},
  MODERATE: {},
  HEAVY: {},
  DEVASTATING: {},
});
export const TextTemplateEngine = {
  detectCategory(weapon) {
    const lower = weapon.toLowerCase();
    if (lower.includes('zincir') || lower.includes('pranga') || lower.includes('kırbaç')) {
      return WeaponCategory.CHAIN_MACE;
    } else if (lower.includes('arbalet') || lower.includes('kundak') || lower.includes('ok') || lower.includes('yay')) {
      return WeaponCategory.CROSSBOW;
    } else if (lower.includes('balta') || lower.includes('nacak') || lower.includes('satır')) {
      return WeaponCategory.AXE;
    } else if (lower.includes('pala') || lower.includes('teber') || lower.includes('tırpan')) {
      return WeaponCategory.HEAVY_FALCHION;
    } else if (lower.includes('sopa') || lower.includes('tokmak') || lower.includes('gürz') || lower.includes('çomak') || lower.includes('yumruk') || lower.includes('yontu') || lower.includes('balyoz') || lower.includes('çekiç') || lower.includes('topuz')) {
      return WeaponCategory.BLUDGEON;
    } else if (lower.includes('kargı') || lower.includes('mızrak') || lower.includes('hançer') || lower.includes('kama') || lower.includes('kanca') || lower.includes('olta') || lower.includes('iğne') || lower.includes('temren') || lower.includes('zıpkın') || lower.includes('rapier') || lower.includes('şiş') || lower.includes('bıçak') || lower.includes('asa')) {
      return WeaponCategory.PIERCE;
    } else {
      return WeaponCategory.SLASH;
    }
  },
  DamageSeverity,

  calculateSeverity(damage, isCrit, defenderMaxHp = 100) {
    if (isCrit && damage >= 18) {
      return DamageSeverity.DEVASTATING;
    }
    const hpRatio = defenderMaxHp > 0 ? damage / defenderMaxHp : 0.1;
    if (damage <= 5 || hpRatio <= 0.04) {
      return DamageSeverity.GLANCING;
    } else if (damage <= 18 || hpRatio <= 0.16) {
      return DamageSeverity.MODERATE;
    } else if (damage <= 38 || hpRatio <= 0.32) {
      return DamageSeverity.HEAVY;
    } else {
      return DamageSeverity.DEVASTATING;
    }
  },

  getGlancingImpact(bodyPart, category) {
    if (bodyPart === TargetBodyPart.HEAD) {
      if (category === WeaponCategory.BLUDGEON) {
        return kt.random([
          'Darbe miğferin siperliğine teğet geçip hafif bir çınlamayla sekti; hasım hafifçe kaşını çattı.',
          'Küt vuruş alnı ancak sıyırdı, ufak bir bereyle kaldı.',
          'Yanağa hafifçe çarpan darbe hasmın dengesini sarsamadı.',
          'Başlığı yalayan kaba tahta ancak toz kaldırdı, hasım gözünü bile kırpmadı.'
        ]);
      } else if (category === WeaponCategory.PIERCE) {
        return kt.random([
          'Sivri uç elmacık kemiğini hafifçe sıyırıp incecik bir çizik bıraktı.',
          'Delici hamle miğferin köşesinden sekerek kumlara bir damla kan düşürdü.',
          'Kulağın kenarını teğet geçen temren hafif bir sızıyla atlatıldı.',
          'Uç yanağı ancak çizdi, hasım başını hafifçe yana yatırıp gardını korudu.'
        ]);
      } else if (category === WeaponCategory.SLASH) {
        return kt.random([
          'Keskin ağız şakağı yüzeysel olarak sıyırıp geçti, ufak bir çizik bıraktı.',
          'Kılıcın ucu alnı teğet geçti; deride ancak ince bir kılcal kanama belirdi.',
          'Hamle yanağı yalayarak hafif bir sıyrıkla kumlara indi.',
          'Kılıç darbesi miğfer bağcığını sıyırdı, başı incitmedi.'
        ]);
      } else if (category === WeaponCategory.HEAVY_FALCHION) {
        return kt.random([
          'Palanın yassı yüzü yanağı hafifçe sıyırdı, hasım sendelemeden gardını korudu.',
          'Ağır çelik miğferin kenarından kayıp gitti, ufak bir temas oldu.',
          'Palanın rüzgarı yüzünü yaladı, darbe ancak yüzeysel bir çizik açabildi.',
          'Ağır namlu başlığı sıyırıp sekti, hasmı yerinden oynatamadı.'
        ]);
      } else if (category === WeaponCategory.CHAIN_MACE) {
        return kt.random([
          'Zincirin ucu miğferin siperliğine çarpıp sekti, hasmı pek etkilemedi.',
          'Demir başlık şakağı hafifçe sıyırdı, ufak bir çizikle kaldı.',
          'Dikenli halkalar yanağı teğet geçti, hafif bir sızı bıraktı.'
        ]);
      } else if (category === WeaponCategory.CROSSBOW) {
        return kt.random([
          'Ok miğferin tepesini sıyırıp havaya uçtu, deride hafif bir çizik bıraktı.',
          'Temren yanağı teğet geçerek ince bir çizikle kumlara saplandı.',
          'Menzilli atış şakağı yalayarak hafif bir kan damlası bıraktı.'
        ]);
      } else if (category === WeaponCategory.AXE) {
        return kt.random([
          'Baltanın ucu miğferi sıyırıp kıvılcım çıkardı, başı sarsmaya yetmedi.',
          'Nacağın köşesi yanağı hafifçe çizerek geçti.',
          'Balta ağzı şakağı teğet geçip ufak bir sıyrıkla kaldı.'
        ]);
      }
      return null;
    } else if (bodyPart === TargetBodyPart.CHEST) {
      if (category === WeaponCategory.BLUDGEON) {
        return kt.random([
          'Vuruş kalın göğüs zırhına çarpıp tok bir sesle sönümlendi; hasım sadece tozunu silkeledi.',
          'Küt darbe zırh plakasından kayarak göğsü pek sarsmadı.',
          'Darbenin neredeyse tamamı zırhın dolgusunda kayboldu, ufak bir temasla kaldı.',
          'Göğüs kafesine değen darbe hasmın dengesini bozamadı.'
        ]);
      } else if (category === WeaponCategory.PIERCE) {
        return kt.random([
          'Sivri uç göğüs zırhının perçinlerine takılıp kaydı; deriye ancak iğne ucu kadar temas etti.',
          'Delici hamle zırh halkalarını geçemedi, hafif bir çizikle durdu.',
          'Göğse değen uç yalnızca deri yeleği delip hafifçe battı.',
          'Zırhın örgüsünden seken temren göğüste yüzeysel bir sızı bıraktı.'
        ]);
      } else if (category === WeaponCategory.SLASH) {
        return kt.random([
          'Kılıç darbesi göğüs zırhının üzerinden kayarak ufak bir çizik bıraktı.',
          'Göğsü sıyıran kesik zırhı aşamadı, kuma sadece bir kıvılcım düştü.',
          'Hamle zırhın yüzeyini hafifçe çizerek etkisizce savuşturuldu.',
          'Kılıcın ucu göğüs kemiğini sıyırdı, hasmın nefesini bile kesmedi.'
        ]);
      } else if (category === WeaponCategory.HEAVY_FALCHION) {
        return kt.random([
          'Palanın ucu göğüs plakasına çarparak hafifçe sekti, hasım yerinden bile kıpırdamadı.',
          'Ağır pala göğsü teğet geçti, zırhta yüzeysel bir sıyrık bıraktı.',
          'Göğse inen vuruş zırhın kavisli yapısından kayarak gücünü yitirdi.'
        ]);
      } else if (category === WeaponCategory.CHAIN_MACE) {
        return kt.random([
          'Zincir göğüs zırhına çarparak şıngırdadı, hasmın nefesini bile kesmedi.',
          'Dikenli topuz göğsü teğet geçip zırhı hafifçe çizdi.',
          'Göğse vuran zincir gücünü zırhın kalın halkalarında kaybetti.'
        ]);
      } else if (category === WeaponCategory.CROSSBOW) {
        return kt.random([
          'Ok göğüs zırhından sekerek kumlara düştü, yalnızca hafif bir batma hissettirdi.',
          'Temren göğüs plakasını delemeyip hafif bir çizikle kaldı.',
          'Ok zırhın eğimine çarpıp yön değiştirdi, hasmı pek rahatsız etmedi.'
        ]);
      } else if (category === WeaponCategory.AXE) {
        return kt.random([
          'Baltanın ağzı göğüs zırhını ısıramadan yana kaydı, hafif bir kıvılcım çıkardı.',
          'Nacak göğüs plakasına yüzeysel temas edip sekti.',
          'Baltanın küt kısmı göğse hafifçe dokunup etkisini yitirdi.'
        ]);
      }
      return null;
    } else if (bodyPart === TargetBodyPart.SHOULDER) {
      return kt.random([
        'Darbe omuz zırhının köşesini sıyırıp hafif bir çizikle geçti.',
        'Omuzluğuna çarpan hamle hafif bir çınlamayla sönümlendi.',
        'Omzuna teğet geçen darbe kuşamın perçinini hafifçe çizdi.'
      ]);
    } else if (bodyPart === TargetBodyPart.ARM) {
      return kt.random([
        'Darbe kol zırhının köşesini sıyırıp hafif bir çizikle geçti.',
        'Bileğe teğet geçen vuruş silahı düşürmeye yetmedi, ufak bir sızı bıraktı.',
        'Kol korumalığına çarpan hamle hafif bir çınlamayla sönümlendi.',
        'Ön kolu sıyıran uç yalnızca deri kuşamı yırttı, deride hafif bir çizik kaldı.'
      ]);
    } else if (bodyPart === TargetBodyPart.LEG) {
      return kt.random([
        'Darbe tozluğu sıyırıp kuma çarptı, hasmın adımlarını yavaşlatmadı.',
        'Dize hafifçe temas eden vuruş bacağı bükmeye yetmedi, ufak bir sızıyla kaldı.',
        'Baldırı teğet geçen hamle deride yüzeysel bir çizik açabildi.',
        'Ayak bileğini yalayarak geçen darbe hasmın dengesini bozamadı.'
      ]);
    } else if (bodyPart === TargetBodyPart.SIDE) {
      return kt.random([
        'Kuşağın kalın kumaşına çarpan darbe yan bölgeyi hafifçe sıyırdı.',
        'Böğrü teğet geçen vuruş zırhın kenarından kayıp gitti.',
        'Böğür boşluğunu sıyıran hamle hasmı pek sarsmadı, yüzeysel kaldı.'
      ]);
    }
    return null;
  },

  getHeavyImpact(bodyPart, category) {
    if (bodyPart === TargetBodyPart.HEAD) {
      return kt.random([
        'Kafatasında yankılanan ağır darbe bilincini sarstı, şakağından kan süzüldü!',
        'Çenesine inen sert darbe hasmı sendeleterek bir dizinin üzerine düşürdü!',
        'Miğferi yamultan şiddetli vuruş gözlerinin önünü kararttı!',
        'Başına inen balyoz gibi darbeyle dengesi altüst oldu, ağzından kan sızdı!'
      ]);
    } else if (bodyPart === TargetBodyPart.CHEST) {
      return kt.random([
        'Göğüs zırhını ezip kaburgaları sızlatan ağır darbeyle nefesi kesildi!',
        'Ciğerlerini ezercesine inen sert vuruş hasmı iki adım geriye savurdu!',
        'Göğüs kafesinde yankılanan tok darbe arenanın tozunu havalandırdı!',
        'Zırh levhasını yamultan sert darbeyle göğsünden acı dolu bir hırıltı koptu!'
      ]);
    } else if (bodyPart === TargetBodyPart.SHOULDER) {
      return kt.random([
        'Omuz kemiğini sarsan ağır vuruşla kalkanı neredeyse elinden fırlıyordu!',
        'Omuzluğuna inen ağır balyoz gibi temasla omzundan tok bir çıtırtı duyuldu!',
        'Omzunu ezen sert darbe kolunun düşmesine ve dengesinin bozulmasına yol açtı!'
      ]);
    } else if (bodyPart === TargetBodyPart.ARM) {
      return kt.random([
        'Pazusunu boydan boya yaran darbe kolunu uyuşturup silah tutuşunu sarstı!',
        'Kol kaslarını ezen sert temas kolunu aşağı düşürdü!',
        'Bileğine ve ön koluna inen acımasız temas silahını gevşetti!'
      ]);
    } else if (bodyPart === TargetBodyPart.LEG) {
      return kt.random([
        'Diz kapağını çökerten sert darbeyle hasım kumlara kapaklandı!',
        'Bacağında derin bir yara açan vuruş adımlarını sendeledi!',
        'Baldırını ezen şiddetli darbeyle acı içinde topalladı!'
      ]);
    } else if (bodyPart === TargetBodyPart.SIDE) {
      return kt.random([
        'Böğrünü ezen darbe kaburgalarını sızlatıp ciğerinden boğuk bir inilti kopardı!',
        'Karın zırhını yarıp geçen vuruşla hasım acı içinde iki büklüm oldu!',
        'Gövdesine inen ağır temasla dengesini kaybedip geriye yalpaladı!'
      ]);
    }
    return null;
  },

  // Kotlin aşırı yüklemesi: getBodyPartImpact(bodyPart, category, severity: DamageSeverity)
  // ve getBodyPartImpact(bodyPart, category, isCrit: Boolean). Üçüncü argümanın türüne göre seçilir.
  getBodyPartImpact(bodyPart, category, severityOrIsCrit) {
    if (typeof severityOrIsCrit === 'boolean') {
      return TextTemplateEngine.getBodyPartImpact__2(bodyPart, category, severityOrIsCrit);
    }
    return TextTemplateEngine.getBodyPartImpact__1(bodyPart, category, severityOrIsCrit);
  },

  getBodyPartImpact__1(bodyPart, category, severity) {
    if (severity === DamageSeverity.GLANCING) {
      return TextTemplateEngine.getGlancingImpact(bodyPart, category);
    } else if (severity === DamageSeverity.HEAVY) {
      return TextTemplateEngine.getHeavyImpact(bodyPart, category);
    } else if (severity === DamageSeverity.DEVASTATING) {
      return TextTemplateEngine.getBodyPartImpactBase(bodyPart, category, true);
    } else if (severity === DamageSeverity.MODERATE) {
      return TextTemplateEngine.getBodyPartImpactBase(bodyPart, category, false);
    }
    return null;
  },

  getBodyPartImpact__2(bodyPart, category, isCrit) {
    return TextTemplateEngine.getBodyPartImpact(bodyPart, category, isCrit ? DamageSeverity.DEVASTATING : DamageSeverity.MODERATE);
  },

  // Body-part specific impact details tailored for ALL weapon categories with MULTIPLE rich variations
  getBodyPartImpactBase(bodyPart, category, isCrit) {
    if (bodyPart === TargetBodyPart.HEAD) {
      if (category === WeaponCategory.BLUDGEON) {
        if (isCrit) {
          return kt.random([
            'Kafatasında yankılanan kemik çatlağıyla gözleri karardı, kulaklarından kan süzüldü!',
            'Küt darbe şakağında patladı; bilinci anında sıfırlanıp sendeledi, dişleri birbirine vurdu!',
            'Başına inen tok darbe miğferini yamultup kafatasını sarstı; kumların üzerine dizleri titreyerek çöktü!'
          ]);
        } else {
          return kt.random([
            'Başına inen küt darbeyle sersemleyip sendeledi.',
            'Çeneyi sıyıran darbe kafasını yana savurdu, ağzından kanlı tükürük saçıldı.',
            'Alnına çarpan ağırlık gözlerinin önünde şimşekler çaktırdı.'
          ]);
        }
      } else if (category === WeaponCategory.PIERCE) {
        if (isCrit) {
          return kt.random([
            'Uç doğrudan şakağına saplandı, arenanın kumları kırmızıya kesti!',
            'Sivri temren elmacık kemiğini delip geçti; acı dolu vahşi bir feryat kopardı!',
            'Saplanan sivri uç kıkırdak ve kemiği parçalayarak göz çukurunun hemen yanına gömüldü!'
          ]);
        } else {
          return kt.random([
            'Alnında derin bir delik açıldı, kan gözlerini kör etti.',
            'Yüzünü sıyıran sivri uç yanağında derin bir kan yarığı bıraktı.',
            'Kulağının dibinden geçen delici hamle etini yırtarak kan sızdırdı.'
          ]);
        }
      } else if (category === WeaponCategory.SLASH) {
        if (isCrit) {
          return kt.random([
            'Kesik alnından çenesine kadar indi, acı dolu bir feryat kopardı!',
            'Çeliğin keskin ağzı şakağını boydan boya yardı; kızıl kan görüşünü tamamen kapattı!',
            'Yüzünü biçen kavisli kesik deriyi kemiğe kadar ayırdı, seyirciler dehşetle bağırdı!'
          ]);
        } else {
          return kt.random([
            'Yüzünü sıyıran hamle etini yarıp geçti.',
            'Alnında ince fakat yakıcı bir kan şeridi belirdi.',
            'Yanağından süzülen taze kan çenesinden kumlara damladı.'
          ]);
        }
      } else if (category === WeaponCategory.HEAVY_FALCHION) {
        if (isCrit) {
          return kt.random([
            'Ağır palanın sırtı ve keskin ağzı kafatasını yarıp geçti, kan fışkırdı!',
            'Palanın devasa ağırlığı başına balyoz gibi indi; miğfer bağları kopup savruldu!',
            'Geniş çelik yüz kafasına öyle bir oturdu ki kulak zarları patlarcasına çınladı!'
          ]);
        } else {
          return kt.random([
            'Palanın tok yüzü başına inerek miğferini yamulttu.',
            'Ağır kesik saç diplerini sıyırıp alnında derin bir iz bıraktı.',
            'Savrulan palanın rüzgarı bile dengesini bozdu, başına sıyıran darbeyle sarsıldı.'
          ]);
        }
      } else if (category === WeaponCategory.CHAIN_MACE) {
        if (isCrit) {
          return kt.random([
            'Zincirin savurduğu dikenli gülle başını bir mengene gibi ezdi!',
            'Kalkanı aşan zincir boynuna dolanıp dikenli başlığıyla çenesini un ufak etti!',
            'Havada ıslık çalan demir gülle kafatasında patladı; gözleri yuvalarından fırlayacak gibi oldu!'
          ]);
        } else {
          return kt.random([
            'Kalkanı aşan zincirli topuz alnına sertçe çarptı.',
            'Zincirin ucu şakağını sıyırıp derisini morarttı.',
            'Dikenli başlık başını teğet geçip kulağını kanattı.'
          ]);
        }
      } else if (category === WeaponCategory.CROSSBOW) {
        if (isCrit) {
          return kt.random([
            'Çelik temrenli ok doğrudan şakağına çakıldı, bilincini sıfırladı!',
            'Kirişin tok sesiyle fırlayan ok alnındaki korumalığı delip kemiğe saplandı!',
            'Mekanik yaydan çıkan ok kafatasını sıyırırken miğferini ikiye ayırdı!'
          ]);
        } else {
          return kt.random([
            'Ok alnını yalayarak derin bir oluk açtı.',
            'Hızla geçen ok yanağını delip geçti.',
            'Çelik temren kulağının hemen dibinden geçip deriyi yırttı.'
          ]);
        }
      } else if (category === WeaponCategory.AXE) {
        if (isCrit) {
          return kt.random([
            'Nacağın çelik ağzı kafatasını boydan boya yardı!',
            'Baltanın ağır başı miğferi teneke gibi ezip kemiğe gömüldü!',
            'Acımasızca inen nacak başını yana savurup boyun omurlarını çıtlattı!'
          ]);
        } else {
          return kt.random([
            'Baltanın küt sırtı başına inip dengesini altüst etti.',
            'Nacak alnındaki deriyi sıyırarak kan akıttı.',
            'Baltanın ucu çenesini sıyırdı, sendelemesine yol açtı.'
          ]);
        }
      }
      return null;
    } else if (bodyPart === TargetBodyPart.CHEST) {
      if (category === WeaponCategory.BLUDGEON) {
        if (isCrit) {
          return kt.random([
            'Göğüs kafesine inen darbe kaburgalarını çatırdattı, ciğerlerindeki bütün nefes boşaldı!',
            'Küt gürz göğüs zırhını içe doğru göçürdü; ağzından kanlı bir soluk fırladı!',
            'Ağır darbe göğsünün tam ortasında patladı, kalbi bir anlığına durur gibi oldu!'
          ]);
        } else {
          return kt.random([
            'Göğsündeki zırhı ezerek nefesini kesti.',
            'Göğüs kafesine inen vuruş soluğunu tıkadı.',
            'Göğsüne çarpan kaba ağırlıkla geriye doğru iki adım sendeledi.'
          ]);
        }
      } else if (category === WeaponCategory.PIERCE) {
        if (isCrit) {
          return kt.random([
            'Zırhın halkalarını delip doğrudan göğsüne gömüldü, ağzından kan köpükleri geldi!',
            'Delici uç kaburgaların arasından ciğer boşluğuna kadar battı; nefesi hırıltıya dönüştü!',
            'Kargı göğüs kemiğini çıtırdatarak derine saplandı; çekildiğinde arkasından kan fışkırdı!'
          ]);
        } else {
          return kt.random([
            'Göğüs zırhını sıyırıp ete saplandı.',
            'Göğsünde sızlayan kanlı bir delik açıldı.',
            'Sivri uç kumaşı ve deriyi delerek göğsünde kırmızı bir leke bıraktı.'
          ]);
        }
      } else if (category === WeaponCategory.SLASH) {
        if (isCrit) {
          return kt.random([
            'Göğsünü boydan boya yaran kesik kumaşları ve deriyi biçip geçti!',
            'Kılıcın namlusu göğüs kafesini çaprazlama yardı; dökülen kan zırhın eteklerini boyadı!',
            'Derin ve yakıcı kesik göğüs kaslarını ikiye ayırdı; hasmı acıyla iki büklüm oldu!'
          ]);
        } else {
          return kt.random([
            'Göğsünde uzun ve kanlı bir hat açtı.',
            'Göğüs korumalığını yırtıp deride derin bir çizik bıraktı.',
            'Kılıcın ucu göğsünden bir tutam kumaş ve kan kopardı.'
          ]);
        }
      } else if (category === WeaponCategory.HEAVY_FALCHION) {
        if (isCrit) {
          return kt.random([
            'Ağır pala göğüs kafesine derinlemesine oturdu; kan kızgın kumlara boşaldı!',
            'Palanın geniş ağzı göğüs zırhını teneke gibi yardı ve etin derinliklerine işledi!',
            'Aşağıdan yukarıya savrulan pala göğsünde devasa bir oyuk açarak nefesini tüketti!'
          ]);
        } else {
          return kt.random([
            'Göğsüne inen ağır kesik zırhı parçaladı.',
            'Palanın ağırlığı göğsünde morartıcı ve kanlı bir darbe bıraktı.',
            'Göğsünü sıyıran geniş ağız gövdesini sarsmaya yetti.'
          ]);
        }
      } else if (category === WeaponCategory.CHAIN_MACE) {
        if (isCrit) {
          return kt.random([
            'Dikenli topuz göğsüne çarptığı anda kaburgalarını içeri göçürdü!',
            'Zincir göğsüne dolandı ve dikenli gülle göğüs kafesini ezdi; kemik çıtırtısı tribünlerden duyuldu!',
            'Savrulan gülle göğsündeki zırh perçinlerini patlatarak ciğerlerini ezdi!'
          ]);
        } else {
          return kt.random([
            'Zincirli darbe göğsündeki nefesi tüketti.',
            'Topuzun dikenleri göğsündeki kumaşı parçalayıp etini deldi.',
            'Göğsüne çarpan zincir nefes almasını güçleştirdi.'
          ]);
        }
      } else if (category === WeaponCategory.CROSSBOW) {
        if (isCrit) {
          return kt.random([
            'Kirişten fırlayan çelik ok göğüs zırhını delip kalbinin milim yanına saplandı!',
            'Arbalet oku zırh levhasını delip göğüs kafesine saplandı; acıyla inledi!',
            'Çelik temren göğsün tam ortasına çakıldı, arkasından kan damlacıkları fışkırdı!'
          ]);
        } else {
          return kt.random([
            'Arbalet oku göğsüne saplanıp zırhta asılı kaldı.',
            'Ok göğüs zırhını sıyırıp kumaşı parçaladı.',
            'Göğsüne çarpan ok derin bir sıyrık bırakarak sekti.'
          ]);
        }
      } else if (category === WeaponCategory.AXE) {
        if (isCrit) {
          return kt.random([
            'Çift ağızlı balta göğüs zırhını teneke gibi ikiye ayırıp kemiğe dayandı!',
            'Nacağın sivri ucu göğüs kemiğine saplandı; hasmını geriye doğru savurdu!',
            'Baltanın amansız vuruşu göğsündeki koruyucuyu parçalayıp etini biçti!'
          ]);
        } else {
          return kt.random([
            'Nacak göğsündeki koruyucuyu parçaladı.',
            'Balta göğsüne inip derin bir çentik açtı.',
            'Baltanın küt sırtı göğüs kafesine vurup nefesini tıkadı.'
          ]);
        }
      }
      return null;
    } else if (bodyPart === TargetBodyPart.SHOULDER) {
      if (category === WeaponCategory.BLUDGEON) {
        if (isCrit) {
          return kt.random([
            'Omuz kemiğini un ufak etti; kolu gevşeyip yana düştü!',
            'Omzuna inen küt tokmak köprücük kemiğini çatlattı; kolu uyuştu!',
            'Ağır darbe omuz eklemini yerinden oynattı, silahı tutmakta zorlandı!'
          ]);
        } else {
          return kt.random([
            'Omzuna çarpan ağırlık dengesini altüst etti.',
            'Omuz başına çarpan darbeyle kolu sızladı.',
            'Omzuna inen tokmak gardını aşağı düşürdü.'
          ]);
        }
      } else if (category === WeaponCategory.PIERCE) {
        if (isCrit) {
          return kt.random([
            'Omuz ekleminin tam merkezini delip arkaya çıktı!',
            'Sivri uç omuz küreğine saplandı; kolundaki tendonları zedeledi!',
            'Kargı omzuna saplanıp kemiğe çarparak durdu, kan fışkırdı!'
          ]);
        } else {
          return kt.random([
            'Omzundaki kas dokusunu yırttı.',
            'Omzunu sıyıran uç kumaşı delip kan akıttı.',
            'Omuz başından ince bir kan hattı sızdı.'
          ]);
        }
      } else if (category === WeaponCategory.SLASH) {
        if (isCrit) {
          return kt.random([
            'Omuz başındaki eti koparırcasına biçti!',
            'Kılıç omuzdan göğse doğru derin bir kan yarığı açtı!',
            'Omuz bağlarını sıyıran keskin hamle kolunu neredeyse işlevsiz kıldı!'
          ]);
        } else {
          return kt.random([
            'Omuz korumalığını parçaladı.',
            'Omzunda yakıcı bir kesik bıraktı.',
            'Kılıcın ucu omzundaki deriyi sıyırdı.'
          ]);
        }
      } else if (category === WeaponCategory.HEAVY_FALCHION) {
        if (isCrit) {
          return kt.random([
            'Palanın şiddeti omuz başını gövdeden ayıracak gibi yarıp indi!',
            'Ağır palanın darbesiyle köprücük kemiği ezildi, kumlara diz çöktü!',
            'Omuz eklemine oturan ağır kesik kolunu yana düşürdü!'
          ]);
        } else {
          return kt.random([
            'Omzuna binen kesici ağırlıkla diz çöktü.',
            'Pala omzundaki zırhı ezip deriyi yardı.',
            'Omzuna çarpan pala dengesini bozmaya yetti.'
          ]);
        }
      } else if (category === WeaponCategory.CHAIN_MACE) {
        if (isCrit) {
          return kt.random([
            'Zincir omzuna dolanarak dikenli başlığıyla eklemi ezdi!',
            'Omuz başına sarılan zincirli topuz kemiği kırdı; feryat kopardı!',
            'Dikenli gülle omzunda patlayarak zırh levhasını kopardı!'
          ]);
        } else {
          return kt.random([
            'Omzunu sıyıran zincir topuz etini ezdi.',
            'Zincir omzuna çarpıp acı veren bir sıyrık bıraktı.',
            'Omuz korumalığı zincirin darbesiyle yamuldu.'
          ]);
        }
      } else if (category === WeaponCategory.CROSSBOW) {
        if (isCrit) {
          return kt.random([
            'Ok omuz küreğine saplanıp kolunu kilitledi!',
            'Çelik temren omzunu boydan boya delip arkasından çıktı!',
            'Omuz eklemine saplanan ok silah tutuşunu imkansızlaştırdı!'
          ]);
        } else {
          return kt.random([
            'Omuz başını delip geçti.',
            'Ok omzundaki kumaşı delerek sıyırdı.',
            'Omzuna isabet eden ok etine sığ bir delik açtı.'
          ]);
        }
      } else if (category === WeaponCategory.AXE) {
        if (isCrit) {
          return kt.random([
            'Nacak omuz eklemini kökünden çatlattı!',
            'Baltanın ağır ağzı köprücük kemiğini yarıp omzu kilitledi!',
            'Omuz başını biçen nacak kolundaki kuvveti sıfırladı!'
          ]);
        } else {
          return kt.random([
            'Balta omzuna sertçe inip yaraladı.',
            'Nacağın ucu omzundaki deriyi yırttı.',
            'Omzuna çarpan balta sırtı kolunu uyuşturdu.'
          ]);
        }
      }
      return null;
    } else if (bodyPart === TargetBodyPart.ARM) {
      if (category === WeaponCategory.BLUDGEON) {
        if (isCrit) {
          return kt.random([
            'Koluna inen darbe kemiği kırdı, silahını tutan eli uyuştu!',
            'Ön koluna inen küt ağırlık kemiği çatlattı; parmakları gevşedi!',
            'Dirseğine çarpan tokmak eklemi ters çevirecek gibi sarstı!'
          ]);
        } else {
          return kt.random([
            'Koluna sertçe çarparak gardını düşürdü.',
            'Pazusuna çarpan ağırlıkla kolu sarsıldı.',
            'Bileğine inen vuruş silahını kavramasını zorlaştırdı.'
          ]);
        }
      } else if (category === WeaponCategory.PIERCE) {
        if (isCrit) {
          return kt.random([
            'Bileğiyle dirseği arasını delip geçti, parmakları çözüldü!',
            'Sivri uç kolundaki ana kas demetini yardı; kan fışkırdı!',
            'Kargı kolunu delip geçtiğinde silahını kumlara düşürmesine ramak kaldı!'
          ]);
        } else {
          return kt.random([
            'Kolunda sızlayan bir oyuk açtı.',
            'Pazusunda ince bir sıyrık bıraktı.',
            'Kolunu teğet geçen uç deriyi kanattı.'
          ]);
        }
      } else if (category === WeaponCategory.SLASH) {
        if (isCrit) {
          return kt.random([
            'Tendonları sıyıran derin kesikle kolu kana bulandı!',
            'Ön kolunu boydan boya yaran kılıç parmaklarının gücünü tüketti!',
            'Dirsek eklemini biçen kavisli darbe kolunu uyuşturdu!'
          ]);
        } else {
          return kt.random([
            'Pazusunda ince bir sıyrık bıraktı.',
            'Kolundaki korumalığı kesip deride iz bıraktı.',
            'Bileğini sıyıran çelik hafifçe kanattı.'
          ]);
        }
      } else if (category === WeaponCategory.HEAVY_FALCHION) {
        if (isCrit) {
          return kt.random([
            'Palanın geniş ağzı kolundaki kasları parçaladı!',
            'Ağır pala kolunu kemiğe kadar yardı, silah tutan eli titredi!',
            'Koluna inen devasa kavis deriyi ve eti biçip attı!'
          ]);
        } else {
          return kt.random([
            'Koluna inen ağır darbe kılıç tutuşunu bozdu.',
            'Pala kolundaki deriyi morartıp yardı.',
            'Ön koluna çarpan pala ağırlığıyla sendeletti.'
          ]);
        }
      } else if (category === WeaponCategory.CHAIN_MACE) {
        if (isCrit) {
          return kt.random([
            'Zincir silah tutan bileğine dolandı, topuzun darbesiyle parmakları kırıldı!',
            'Koluna sarılan zincir derisini soyup topuzun darbesiyle kemiği çatlattı!',
            'Zincirli topuz dirseğinde patladı; silahını güçlükle tutabildi!'
          ]);
        } else {
          return kt.random([
            'Koluna çarpan zincir silahını düşürmesine ramak bıraktı.',
            'Zincir kolunu kamçılayarak morluklar açtı.',
            'Dikenli topuz ön kolunu sıyırarak kanattı.'
          ]);
        }
      } else if (category === WeaponCategory.CROSSBOW) {
        if (isCrit) {
          return kt.random([
            'Çelik temren ön kolunu delip geçti, silahını düşürdü!',
            'Bileğinin hemen üstüne saplanan ok parmaklarını kilitledi!',
            'Pazusunu delen arbalet oku kolunu arkaya doğru savurdu!'
          ]);
        } else {
          return kt.random([
            'Pazusuna saplanan ok hareketini kısıtladı.',
            'Ok kolunu sıyırıp geçti.',
            'Bileğindeki sargıyı delen ok hafif bir kanama başlattı.'
          ]);
        }
      } else if (category === WeaponCategory.AXE) {
        if (isCrit) {
          return kt.random([
            'Balta kolundaki eti kemiğe kadar soydu!',
            'Nacağın çelik ağzı ön kolunu parçalayarak silahını düşürttü!',
            'Dirseğine inen balta darbesi kemikte çatlak oluşturdu!'
          ]);
        } else {
          return kt.random([
            'Nacak koluna çarparak gardını kırdı.',
            'Balta pazusunu sıyırıp kumaşı yırttı.',
            'Koluna çarpan balta sapı dengesini sarstı.'
          ]);
        }
      }
      return null;
    } else if (bodyPart === TargetBodyPart.LEG) {
      if (category === WeaponCategory.BLUDGEON) {
        if (isCrit) {
          return kt.random([
            'Diz kapağına çarpan darbe bacağını kırdı; yere diz çöktürdü!',
            'Kaval kemiğine inen tokmak kemiği çatlattı, acıyla feryat etti!',
            'Baldırına inen küt vuruşla bacağı boşaldı, kumların üzerine çöktü!'
          ]);
        } else {
          return kt.random([
            'Kaval kemiğine inen vuruşla sendeleyip sendeledi.',
            'Dizine çarpan ağırlık adım atmasını güçleştirdi.',
            'Baldırına vuran darbeyle topallamaya başladı.'
          ]);
        }
      } else if (category === WeaponCategory.PIERCE) {
        if (isCrit) {
          return kt.random([
            'Baldırına saplanan sivri uç bacağını kilitledi, kumların üzerine çöktü!',
            'Uyluk kemiğini sıyıran delici kargı eti boydan boya deldi!',
            'Diz eklemini delen sivri uç bacağını taşımaz hale getirdi!'
          ]);
        } else {
          return kt.random([
            'Bacağında derin bir delik açıldı.',
            'Kaval kemiğini sıyıran uç kumaşı kanla ıslattı.',
            'Baldırında sızlayan bir yara açıldı.'
          ]);
        }
      } else if (category === WeaponCategory.SLASH) {
        if (isCrit) {
          return kt.random([
            'Uyluk kemiği boyunca eti yardı, bacağı taşımaz oldu!',
            'Kılıç baldır kasını ikiye ayırdı; adım atamayacak hale geldi!',
            'Diz arkasındaki tendonları sıyıran kesikle dizlerinin bağı çözüldü!'
          ]);
        } else {
          return kt.random([
            'Bacağını sıyırıp geçti, adımını sakatladı.',
            'Baldırında ince bir kan yarığı açıldı.',
            'Kaval kemiğinde sıyrık bıraktı.'
          ]);
        }
      } else if (category === WeaponCategory.HEAVY_FALCHION) {
        if (isCrit) {
          return kt.random([
            'Pala bacağındaki kirişleri biçti, dengesini tamamen yitirdi!',
            'Uyluğa inen ağır pala etin derinlerine gömüldü; kan kumlara saçıldı!',
            'Palanın şiddetli kesiği bacağını kıracak gibi sarstı!'
          ]);
        } else {
          return kt.random([
            'Bacağına inen ağır yara adımını topallattı.',
            'Pala bacağındaki deriyi biçip geçti.',
            'Kaval kemiğine inen ağırlıkla sendeletti.'
          ]);
        }
      } else if (category === WeaponCategory.CHAIN_MACE) {
        if (isCrit) {
          return kt.random([
            'Zincir ayak bileğine dolandı, savrulan topuz kaval kemiğini kırdı!',
            'Bacağına sarılan dikenli zincir etini parçalayıp yere devirdi!',
            'Diz kapağında patlayan dikenli gülle acı dolu bir çığlık kopardı!'
          ]);
        } else {
          return kt.random([
            'Bacağını sıyıran dikenli gülle sendeletti.',
            'Zincir bacağına çarpıp derisini morarttı.',
            'Ayak bileğini sıyıran topuz dengesini bozdu.'
          ]);
        }
      } else if (category === WeaponCategory.CROSSBOW) {
        if (isCrit) {
          return kt.random([
            'Ok doğrudan diz eklemine saplandı, acı feryadıyla kumlara kapaklandı!',
            'Arbalet oku uyluk kemiğine saplanıp bacağını felç etti!',
            'Baldırını delen çelik temrenli ok yere çökmesine sebep oldu!'
          ]);
        } else {
          return kt.random([
            'Baldırına giren ok adımını sakatladı.',
            'Ok bacağını sıyırıp kumlara saplandı.',
            'Kaval kemiğini sıyıran ok kan sızdırdı.'
          ]);
        }
      } else if (category === WeaponCategory.AXE) {
        if (isCrit) {
          return kt.random([
            'Nacak uyluk kemiğine küt bir darbeyle saplandı!',
            'Baltanın keskin ağzı baldır kasını biçip yere kapaklattı!',
            'Diz kapağına inen nacak bacağını işlevsiz kıldı!'
          ]);
        } else {
          return kt.random([
            'Balta bacağındaki kumaşları yırtıp eti yardı.',
            'Nacak bacağına inip derin bir sıyrık açtı.',
            'Kaval kemiğine çarpan balta sırtı sendeletti.'
          ]);
        }
      }
      return null;
    } else if (bodyPart === TargetBodyPart.SIDE) {
      if (category === WeaponCategory.BLUDGEON) {
        if (isCrit) {
          return kt.random([
            'Böğrüne inen ezici darbe kaburgalarını kırdı, iki büklüm oldu!',
            'Yan tarafına çarpan tokmak nefesini tümden kesti, kumların üzerine devrildi!',
            'Kaburga kemiklerini çatırdatan küt vuruşla yana savruldu!'
          ]);
        } else {
          return kt.random([
            'Yan tarafına vuran darbeyle yana savruldu.',
            'Böğrüne çarpan ağırlık soluğunu daralttı.',
            'Kaburgalarına inen vuruşla acıyla inledi.'
          ]);
        }
      } else if (category === WeaponCategory.PIERCE) {
        if (isCrit) {
          return kt.random([
            'Doğrudan böğrüne saplanıp ciğer boşluğuna kadar ilerledi!',
            'Sivri uç kaburgaların arasından böğrüne gömüldü; ağzından kan boşaldı!',
            'Yan tarafını deşen kargı derin bir yara açtı; hasmı yere kapaklandı!'
          ]);
        } else {
          return kt.random([
            'Böğrünü delip kan sızdırdı.',
            'Yan tarafında sızlayan bir oyuk açtı.',
            'Kaburga derisini sıyıran uç kumaşı parçaladı.'
          ]);
        }
      } else if (category === WeaponCategory.SLASH) {
        if (isCrit) {
          return kt.random([
            'Karnının yan tarafını et parçalayarak biçti!',
            'Kılıç böğrünü boydan boya yardı; dökülen kan kumaşı kızıla boyadı!',
            'Kaburgalar boyunca inen keskin hat acı dolu bir feryat kopardı!'
          ]);
        } else {
          return kt.random([
            'Yan tarafında yakıcı bir kesik bıraktı.',
            'Böğrünü sıyıran çelik deriyi hafifçe kanattı.',
            'Karnının yanından süzülen taze kan kemerine aktı.'
          ]);
        }
      } else if (category === WeaponCategory.HEAVY_FALCHION) {
        if (isCrit) {
          return kt.random([
            'Eğri pala böğrünü boydan boya biçip derin bir oyuk açtı!',
            'Palanın geniş yüzü kaburgalarına balyoz gibi inip eti yardı!',
            'Böğrüne oturan devasa pala vuruşu nefesini ebediyen kesecek gibi indi!'
          ]);
        } else {
          return kt.random([
            'Yan tarafına inen pala acıyla kıvrandırdı.',
            'Palanın sırtı kaburgalarını ezdi.',
            'Böğrünü sıyıran pala kumaşı ve deriyi parçaladı.'
          ]);
        }
      } else if (category === WeaponCategory.CHAIN_MACE) {
        if (isCrit) {
          return kt.random([
            'Dikenli topuz böğrüne dolanarak kaburga kemiklerini çatlattı!',
            'Böğrüne sarılan zincir etini parçaladı, topuzun çarpmasıyla iki büklüm oldu!',
            'Kaburga kafesinde patlayan zincirli darbe kan kusmasına yol açtı!'
          ]);
        } else {
          return kt.random([
            'Yan tarafına vuran zincir nefesini kesti.',
            'Dikenli gülle böğrünü sıyırarak kanattı.',
            'Kaburgalarına çarpan zincir acıyla inletti.'
          ]);
        }
      } else if (category === WeaponCategory.CROSSBOW) {
        if (isCrit) {
          return kt.random([
            'Ok böğründeki zayıf boşluğa gömüldü, kan ağzına kadar geldi!',
            'Zırhın birleştiği böğür oyuğuna saplanan arbalet oku nefesini tıkadı!',
            'Çelik temren kaburgaların arasından içeri battı!'
          ]);
        } else {
          return kt.random([
            'Böğrünü sıyıran ok derin bir sıyrık açtı.',
            'Ok yan tarafındaki kumaşı delip geçti.',
            'Böğrüne çarpan ok sekerken deriyi çizdi.'
          ]);
        }
      } else if (category === WeaponCategory.AXE) {
        if (isCrit) {
          return kt.random([
            'Nacağın sivri ucu böğrüne saplanıp eti kopardı!',
            'Balta yan tarafındaki zırhı parçalayıp kaburga kemiğine dayandı!',
            'Böğrüne inen balta darbesiyle acı içinde kumlara çöktü!'
          ]);
        } else {
          return kt.random([
            'Balta yan tarafındaki korumayı parçaladı.',
            'Nacak böğründe kanlı bir çentik bıraktı.',
            'Kaburgalarına çarpan balta dengesini sarstı.'
          ]);
        }
      }
      return null;
    }
    return null;
  },

  // Miss and Dodge descriptions customized by all weapon types
  getDodgeNarrative(attacker, defender, weapon, category) {
    if (category === WeaponCategory.BLUDGEON) {
      return kt.random([
        `${attacker} elindeki ${weapon} silahını savurdu, fakat ${defender} son anda eğilince ağır silah boşluğu döverek ${attacker}'ın dengesini bozdu!`,
        `${attacker}'ın savurduğu ${weapon} kafasının milim üzerinden rüzgar estirerek geçti; ${defender} geriye sıçrayıp gardını aldı.`,
        `Ağır ${weapon} kumlara çarparak tozu dumana kattı; ${defender} çevik bir adımla yana kaçmayı başardı.`,
        `${defender} kumların üzerinde kayarak ${weapon} darbesinin altından ustalıkla sıyrıldı!`
      ]);
    } else if (category === WeaponCategory.PIERCE) {
      return kt.random([
        `${attacker} öne atılarak ${weapon} ile saplama hamlesi yaptı; fakat ${defender} vücudunu yana kıvırarak sivri ucun boşa kaymasını sağladı!`,
        `${weapon} kumları delip geçti! ${defender} rakibinin gözlerini okuyup saldırı çizgisinden sıyrıldı.`,
        `${attacker}'ın seri delici vuruşu yalnızca ${defender}'ın giysisini yalayarak havayı yardı.`,
        `${defender} nefesini tutup milimetrik bir geri adımla ${weapon} ucundan kurtuldu!`
      ]);
    } else if (category === WeaponCategory.SLASH) {
      return kt.random([
        `${attacker} geniş bir kavisle ${weapon} savurdu; ${defender} geri adım atarak çeliğin vınlamasını havada bıraktı!`,
        `${defender} eğilerek ${weapon} hamlesinin altından aktı ve avantajlı bir pozisyona geçti.`,
        `${attacker}'ın kesme girişimi ${defender}'ın çevikliği karşısında yalnızca toz kaldırdı.`,
        `Kavis çizen ${weapon} havayı yardı; ${defender} bir gölge gibi yana süzüldü!`
      ]);
    } else if (category === WeaponCategory.HEAVY_FALCHION) {
      return kt.random([
        `${attacker} ağır ${weapon} silahını olanca gücüyle savurdu; ancak ${defender} geriye sıçrayınca palanın ağırlığı ${attacker}'ı öne doğru çekti!`,
        `${weapon} havayı homurtuyla yardı; ${defender} son anda yana kayarak devasa kesikten kurtuldu.`,
        `Palanın indiği yerde kumlar yarıldı; ${defender} çoktan başka bir pozisyona geçmişti bile!`,
        `${defender} palanın kör noktasına adım atarak ölümcül kavisin menzilinden çıktı!`
      ]);
    } else if (category === WeaponCategory.CHAIN_MACE) {
      return kt.random([
        `${attacker}'ın savurduğu zincirli ${weapon} havada şakladı, fakat ${defender} başını eğince dikenli gülle boşa savrulup zincir kumlara dolandı!`,
        `Islık çalan zincir ${defender}'ın kulağının dibinden geçti; hamle savuşturanın refleksleri seyircileri coşturdu.`,
        `${weapon} kavis çizip boşa düştü, ${attacker} zinciri geri toplamak için telaşla geri çekildi.`,
        `${defender} geriye takla atarak savrulan dikenli topuzun yörüngesinden kaçtı!`
      ]);
    } else if (category === WeaponCategory.CROSSBOW) {
      return kt.random([
        `${attacker} arbaletin tetiğine bastı; fakat ${defender} yayın çıt sesini duyduğu anda yana atılarak okun boşluğa uçmasını sağladı!`,
        `Kirişten fırlayan çelik temrenli ok ${defender}'ın omzunu sıyırıp arenanın tahta çitlerine saplandı!`,
        `${attacker}'ın arbalet atışı ıslık çalarak hedefi ıskaladı ve kumlara gömüldü.`,
        `${defender} refleksle yere eğilerek vızıldayan yayın menzilinden sıyrıldı!`
      ]);
    } else if (category === WeaponCategory.AXE) {
      return kt.random([
        `${attacker} nacağı iki eliyle savurdu; ${defender} son anda eğilince balta havayı acımasızca yarıp boşa çıktı!`,
        `Nacağın sivri ucu kumlara saplanıp kaldı; ${attacker} silahını kurtarmaya çalışırken açık verdi.`,
        `${defender} balta savuruşunun menzilinden ustalıkla geri çekildi.`,
        `Baltanın şiddetli savruluşu ${defender}'ın cübbesini havalandırdı fakat ete değmedi!`
      ]);
    }
    return null;
  },

  // Block descriptions customized by weapon with multiple variations
  getBlockNarrative(attacker, defender, weapon, category) {
    if (category === WeaponCategory.BLUDGEON) {
      return kt.random([
        `${attacker}'ın ${weapon} ile indirdiği ezici darbe, ${defender}'ın gardına çarparak kemik titreten bir gürültü kopardı! Hasarın çoğu sönümlendi.`,
        `${defender} siperini sımsıkı tuttu; ${weapon} siperin kalın meşesine çarpıp sekti!`,
        `Ezici vuruş ${defender}'ın kalkanında patladı; kollar titredi fakat siper kırılmadı!`
      ]);
    } else if (category === WeaponCategory.PIERCE) {
      return kt.random([
        `${attacker}'ın ${weapon} saplaması, ${defender}'ın siperine takılıp yana kaydı! Sivri uç ete ulaşamadı.`,
        `${defender} kalkanının açısını ayarlayarak ${weapon} ucunu ustalıkla saptırdı!`,
        `Delici hamle ${defender}'ın metal takviyeli siperine toslayıp kıvılcım çıkardı!`
      ]);
    } else if (category === WeaponCategory.SLASH) {
      return kt.random([
        `${attacker}'ın savurduğu ${weapon}, ${defender}'ın savunmasına çarparak parlak kıvılcımlar saçtı!`,
        `${defender} silahının tersiyle ${weapon} darbesini karşıladı; çeliğin çeliğe çarpma sesi arenayı doldurdu!`,
        `${weapon} kalkanın kenarına çarparak havaya sekti; ${defender} dengesini korudu.`
      ]);
    } else if (category === WeaponCategory.HEAVY_FALCHION) {
      return kt.random([
        `${attacker}'ın ağır palası ${defender}'ın gardına küt bir ağırlıkla bindi; kalkan ezildi fakat darbe durduruldu!`,
        `Palanın devasa kesiği ${defender}'ın siperine çarptı; kollar uyuştu fakat gard düşmedi!`,
        `${defender} iki eliyle kalkanına dayanarak palanın yıkıcı darbesini karşıladı!`
      ]);
    } else if (category === WeaponCategory.CHAIN_MACE) {
      return kt.random([
        `${attacker}'ın zincirli topuzu ${defender}'ın siperine çarptı; zincir siperin ucundan sarılmak istese de hasar hafifletildi!`,
        `Dikenli gülle kalkana çarpıp kavis aldı; ${defender} siperini geri çekerek zincirin dolanmasını engelledi!`,
        'Zincirli darbe siperde derin ezikler bıraktı fakat gövdeye ulaşamadı!'
      ]);
    } else if (category === WeaponCategory.CROSSBOW) {
      return kt.random([
        `Arbaletten fırlayan ok ${defender}'ın kalkanına saplanıp tahtayı çatlattı; içeriye geçemedi!`,
        `${defender} siperini yüzüne siper etti; çelik ok kalkana saplanıp asılı kaldı!`,
        'Vızıldayan ok kalkanın demir perçinine çarparak kumlara sekti!'
      ]);
    } else if (category === WeaponCategory.AXE) {
      return kt.random([
        `Nacağın çelik ağzı ${defender}'ın gardına saplandı; siper hasar gördü fakat vuruş engellendi!`,
        `Balta ${defender}'ın kalkanını yardı fakat ete ulaşamadan durduruldu!`,
        `${defender} nacağın iniş açısını saptırarak darbeyi boşa çıkardı!`
      ]);
    }
    return null;
  },

  getDefeatNarrative(attacker, defender, weapon) {
    return kt.random([
      `${defender} aldığı bu son darbeyle artık ayakta duramadı. Dizlerinin bağı çözüldü ve yüzükoyun kumların üzerine yığıldı! ${attacker} kan ve ter içinde zaferini ilan etti!`,
      `${defender}'ın elleri çözüldü, silahı parmaklarının arasından kumlara düştü. Gözleri karararak sırtüstü devrildi! Arenada ${attacker}'ın adı haykırılıyor!`,
      `Son vuruşun ardından ${defender} bir an dengede kalmaya çalıştı, ardından diz çöküp kumlara kapaklandı. Hakem tellalı koşarak ${attacker}'ın elini havaya kaldırdı!`,
      `${defender}'ın nefesi tükendi; son bir gayretle doğrulmak istese de takati kalmadı ve bilinci kapandı. ${attacker} alkışlar arasında kılıcını kınına soktu!`,
      `Kızgın kumlar ${defender}'ın düşüşüyle havalandı. Dövüş sona erdi; ${attacker} alnındaki teri silerek şampiyon edasıyla seyircileri selamladı!`
    ]);
  },

  getSpecialWeaponOrFighterEncounter(attacker, defender, weapon, bodyPart, event, damage) {
    const wLower = weapon.toLowerCase();
    const isCrit = event === CombatEvent.CRITICAL;
    // 1. Yeni Eklenen ve Özel Silahların Özgün Savaş Tasvirleri
    // Efsanevi Kılıç: Kader Kıran
    if (wLower.includes('kader') && !wLower.includes('ayna')) {
      let flavor;
      if (attacker.includes('Voladmir')) {
        flavor = `Voladmir kibirli bir kahkahayla Kader Kıran'ı iki eliyle savurdu; altın kakmalı kabzası parıldarken kılıcın efsanevi ağzı ${defender}'ın zırhını jilet gibi ikiye böldü!`;
      } else if (attacker.includes('Baelor')) {
        flavor = `Baelor demir maskesinin altından tek kelime fısıldamaksızın Kader Kıran'ı indirdi; garnizon efsanesi kılıç ${defender}'ın ${bodyPart.dativeSuffix} cellat sessizliğiyle saplandı!`;
      } else if (attacker.includes('Thyra')) {
        flavor = `Thyra dağ kurdu narasıyla havaya sıçrayıp Kader Kıran'ın iki ağızlı namlusunu ${defender}'ın siperine çaktı!`;
      } else if (attacker.includes('Morvath')) {
        flavor = `Morvath şampiyon adımlarıyla Kader Kıran'ı kalkanın üzerinden aşırıp ${defender}'ın gövdesine efsanevi bir darbe vurdu!`;
      } else {
        flavor = `${attacker} iki elle kavradığı Kader Kıran'ın ağırlığını hücumuna kattı; garnizon efsanesi kılıcın çeliği ${defender}'ın siperini tuzla buz etti!`;
      }
      if (event === CombatEvent.CRITICAL) {
        return `${flavor} Ölümcül kesiş arenayı kana buladı! (-${damage} Can)`;
      } else if (event === CombatEvent.HIT) {
        return `${flavor} Kılıcın runik ağzı zırhı yarıp etine işledi. (-${damage} Can)`;
      } else if (event === CombatEvent.BLOCKED) {
        return `${defender} var gücüyle siperini kaldırdı; Kader Kıran'ın efsanevi darbesi kalkana çarparak derin bir yarık açtı fakat tam delip geçemedi!`;
      } else if (event === CombatEvent.DODGED) {
        return `Kader Kıran'ın devasa savruluşu havayı uğultuyla yardı; ${defender} son anda geriye kayarak kılıcın menzilinden sıyrıldı!`;
      } else {
        return null;
      }
    // Efsanevi Balta: Kozmos
    } else if (wLower.includes('kozmos')) {
      let flavor;
      if (attacker.includes('Thyra')) {
        flavor = `Thyra vahşi bir kükremeyle Kozmos baltasını başının üzerinde fırıl fırıl çevirip ${defender}'ın üzerine meteor gibi indirdi!`;
      } else if (attacker.includes('Draven')) {
        flavor = `Draven gözünü kan bürümüş halde Kozmos baltasını savurdu; devasa çift ağızlı balta ${defender}'ın ${bodyPart.dativeSuffix} balyoz gibi indi!`;
      } else if (attacker.includes('Ghorak')) {
        flavor = `Ghorak kürek mahkumu kaslarıyla Kozmos baltasını savurdu; devasa çift ağızlı balta ${defender}'ın ${bodyPart.dativeSuffix} balyoz gibi indi!`;
      } else if (attacker.includes('Baelor')) {
        flavor = 'Baelor iki eliyle kavradığı Kozmos baltasını sessiz bir hiddetle indirdi; arenadaki kumlar basınç dalgasıyla havaya saçıldı!';
      } else {
        flavor = `${attacker} iki elle kavradığı Kozmos baltasını devasa bir kavisle indirdi; balta ağzından çıkan basınç dalgası ${defender}'ın gövdesini sarstı!`;
      }
      if (event === CombatEvent.CRITICAL) {
        return `${flavor} Efsanevi balta zırh levhasını kağıt gibi yırtıp kemiğe dayandı! (-${damage} Can)`;
      } else if (event === CombatEvent.HIT) {
        return `${flavor} Kozmos'un ağır ağzı ${defender}'ın dengesini altüst edip geriye savurdu. (-${damage} Can)`;
      } else if (event === CombatEvent.BLOCKED) {
        return `Kozmos'un devasa balta ağzı doğrudan kalkana indi; siperin demir takviyeleri çatladı ve ${defender} dizlerinin üstüne çöktü!`;
      } else if (event === CombatEvent.DODGED) {
        return `Kozmos kumlara gömüldü; ${defender} son anda yana sıçrayarak ezilmekten kurtuldu!`;
      } else {
        return null;
      }
    // Efsanevi Mızrak / Balyoz: Titan Delen & Titan Balyoz-Baltası
    } else if (wLower.includes('titan')) {
      let flavor;
      if (attacker.includes('Morvath')) {
        flavor = `Morvath üç adımlık ivmeyle Titan Delen'i öne sürdü; şampiyonun zırh delici saplaması ${defender}'ın göğüs levhasına gömüldü!`;
      } else if (attacker.includes('Katerina')) {
        flavor = `Katerina buzul kalkanının ardında soğukkanlılıkla Titan Delen'i uzattı; mızrağın masif çeliği ${defender}'ın siperini aştı!`;
      } else if (attacker.includes('Gideon') || attacker.includes('Balthazar')) {
        flavor = `${attacker} titan kemiğiyle dövülmüş masif silahını kükreyerek ${defender}'ın üzerine çaktı!`;
      } else {
        flavor = `${attacker} Titan Delen'in masif temreniyle doğrudan ${defender}'ın merkezine atıldı; zırh perçinlerini un ufak eden delici bir vuruş indirdi!`;
      }
      if (event === CombatEvent.CRITICAL) {
        return `${flavor} Masif uç göğüs kafesini çökertip etin derinliklerine işledi! (-${damage} Can)`;
      } else if (event === CombatEvent.HIT) {
        return `${flavor} Silahın delici gücü zırhı sıyırıp derin bir kanama başlattı. (-${damage} Can)`;
      } else if (event === CombatEvent.BLOCKED) {
        return 'Silahın sivri temreni kalkana saplanıp kaldı; kıvılcımlar arenaya saçıldı!';
      } else if (event === CombatEvent.DODGED) {
        return `${defender} yana kayarak gövdesini sıyıran masif delici uçtan milim farkla kurtuldu!`;
      } else {
        return null;
      }
    // Efsanevi Kalkan: Sur-ı Kebir (Taş Hisar Yıkılmazı)
    } else if (wLower.includes('sur') && (wLower.includes('kebir') || wLower.includes('kebır'))) {
      if (event === CombatEvent.BLOCKED) {
        return `${defender} iki elle Sur-ı Kebir kalkanının arkasına kapandı; Taş Hisar'ın yıkılmaz kalkanı darbeyi granit bir dağ gibi karşıladı, zerre kıpırdamadı!`;
      } else if (event === CombatEvent.CRITICAL || event === CombatEvent.HIT) {
        return `${attacker} Sur-ı Kebir'in devasa masif gövdesiyle ${defender}'ın üzerine koçbaşı gibi yüklendi; kalkanın çelik göbeği ${defender}'ın kaburgalarını inletti! (-${damage} Can)`;
      } else {
        return null;
      }
    // Efsanevi Kadim Asa: Thanatos (Ruh Biçen)
    } else if (wLower.includes('thanatos')) {
      let flavor;
      if (attacker.includes('Morgana')) {
        flavor = `Morgana'nın mor gözleri parıldadı; Thanatos'un kuzguni taşından yayılan ölüm dalgası ${defender}'ın ruhunu kıskaca aldı!`;
      } else if (attacker.includes('Selene')) {
        flavor = `Selene karanlık bir ay ilahisi mırıldanarak Thanatos'u yere vurdu; asanın eterik tırpanı ${defender}'ın bedenini sardı!`;
      } else if (attacker.includes('Nyx')) {
        flavor = `Nyx gece gölgelerini Thanatos'un ucuna toplayıp ${defender}'ın en hassas aralığına fırlattı!`;
      } else {
        flavor = `${attacker} Thanatos'un ruh emici kristalini tetikledi; eterik karanlık dalgası ${defender}'ın zırhını aşarak doğrudan can enerjisine çarptı!`;
      }
      if (event === CombatEvent.CRITICAL) {
        return `${flavor} Ruh biçen kadim asa kemikleri donduran bir ölüm feryadıyla patladı! (-${damage} Can)`;
      } else if (event === CombatEvent.HIT) {
        return `${flavor} Karanlık enerji ${defender}'ın damarlarını dondurarak canını emdi. (-${damage} Can)`;
      } else if (event === CombatEvent.BLOCKED) {
        return `${defender} kalkanını siper etti; Thanatos'tan saçılan karanlık duman kalkandan sekerek kumları kararttı!`;
      } else if (event === CombatEvent.DODGED) {
        return `Thanatos'un ölümcül ışını havayı cızırdatarak ${defender}'ın başının üstünden geçti!`;
      } else {
        return null;
      }
    // Efsanevi Kutsal Asa: Astraea (Adalet ve Işık)
    } else if (wLower.includes('astraea')) {
      let flavor;
      if (attacker.includes('Cassian') || attacker.includes('Lucian') || attacker.includes('Valerius')) {
        flavor = `${attacker} Astraea'yı göğe kaldırdı; asanın ucundaki kutsal ışık halesi ${defender}'ı kör ederek üzerine adalet şimşeği gibi indi!`;
      } else {
        flavor = `Astraea'nın ak altın gövdesinden yayılan göz alıcı şafak ışığı ${defender}'ın gözlerini kamaştırıp göğsünde patladı!`;
      }
      if (event === CombatEvent.CRITICAL) {
        return `${flavor} Kutsal ışık patlaması zırh levhalarını eritip ${defender}'ı kumlara diz çöktürdü! (-${damage} Can)`;
      } else if (event === CombatEvent.HIT) {
        return `${flavor} Parlayan şafak ışığı ${defender}'ın siperini delip tenini dağladı. (-${damage} Can)`;
      } else if (event === CombatEvent.BLOCKED) {
        return `Astraea'nın ışık hüzmesi ${defender}'ın siperine çarptı; göz alıcı bir şavk arenayı aydınlattı!`;
      } else if (event === CombatEvent.DODGED) {
        return `${defender} hızla gözlerini kaçırıp yere yuvarlanarak ışık huzmesinden sıyrıldı!`;
      } else {
        return null;
      }
    // Efsanevi Kozmik Asa: Aetherion
    } else if (wLower.includes('aetherion')) {
      if (event === CombatEvent.CRITICAL) {
        return `${attacker} Aetherion'un çift sarmal yıldız kristalini çevirdi; arenada kozmik bir yerçekimi girdabı açıldı ve ${defender}'ın zırhını un ufak ederek kumlara çarptı! (-${damage} Can)`;
      } else if (event === CombatEvent.HIT) {
        return `Aetherion'dan yayılan kozmik enerji dalgası ${defender}'ın etrafındaki havayı bükerek göğsüne sert bir darbe vurdu. (-${damage} Can)`;
      } else if (event === CombatEvent.BLOCKED) {
        return `Kozmik halka ${defender}'ın siperine çarptı; kalkan havada titreşerek uyuştu!`;
      } else if (event === CombatEvent.DODGED) {
        return `${defender} uzay-zaman dalgalanmasının merkezinden yana sıçrayarak kozmik çekimden kurtuldu!`;
      } else {
        return null;
      }
    // Volkanik, Lav, Magma, Kor Silah ve Asaları
    } else if (wLower.includes('volkanik') || wLower.includes('lav ') || wLower.includes('magma') || wLower.includes('kükürtlü') || (wLower.includes('kor') && (wLower.includes('asa') || wLower.includes('balta')))) {
      let flavor;
      if (attacker.includes('Ignis')) {
        flavor = `Ignis kükreyen bir alev çemberi eşliğinde ${weapon} silahını savurdu; kızıl korlar ${defender}'ın zırhını tavladı!`;
      } else {
        flavor = `${attacker} ${weapon} silahından fışkıran magma ve kor alevlerle ${defender}'ın üzerine atıldı!`;
      }
      if (event === CombatEvent.CRITICAL) {
        return `${flavor} Kızgın lavlar zırhı eritti ve ${bodyPart.dativeSuffix} derin yanıklar bıraktı! (-${damage} Can)`;
      } else if (event === CombatEvent.HIT) {
        return `${flavor} Alev dilleri ${defender}'ın zırh aralıklarını yalayarak etini dağladı. (-${damage} Can)`;
      } else if (event === CombatEvent.BLOCKED) {
        return 'Kızgın korlar kalkana çarptı; siperin derisi ve tahtası alev aldı!';
      } else if (event === CombatEvent.DODGED) {
        return `${defender} geriye zıplayarak yerdeki kızgın lav çukurundan ve alev fırtınasından kaçtı!`;
      } else {
        return null;
      }
    // Yıldırım, Şimşek, Fırtına, Plazma Silah ve Asaları
    } else if (wLower.includes('fırtına') || wLower.includes('şimşek') || wLower.includes('yıldırım') || wLower.includes('statik') || wLower.includes('plazma')) {
      let flavor;
      if (attacker.includes('Zephyros') || attacker.includes('Zephyra')) {
        flavor = `${attacker} fırtına rüzgarları eşliğinde ${weapon} silahını çevirdi; mavi elektrik arkları havada çatırdadı!`;
      } else {
        flavor = `${attacker} ${weapon} silahını savururken çakan şimşekler arenanın kumlarını aydınlattı!`;
      }
      if (event === CombatEvent.CRITICAL) {
        return `${flavor} Yüksek voltajlı göksel ark ${defender}'ın demir zırhını iletken yaparak kalbini sıkıştırdı! (-${damage} Can)`;
      } else if (event === CombatEvent.HIT) {
        return `${flavor} Çatırdayan statik kıvılcımlar ${defender}'ın sinirlerini uyuşturup kaslarını seğirtti. (-${damage} Can)`;
      } else if (event === CombatEvent.BLOCKED) {
        return 'Yıldırım arkı kalkana çarptı; demir kollar elektrik akımıyla titredi!';
      } else if (event === CombatEvent.DODGED) {
        return `Şimşek çakması ${defender}'ın hemen yanındaki ahşap korkulukları tutuşturdu; kıl payı kurtuldu!`;
      } else {
        return null;
      }
    // Buzul, Ayaz, Mutlak Sıfır, Donmuş Silah ve Asaları
    } else if (wLower.includes('buzul') || wLower.includes('ayaz') || wLower.includes('mutlak sıfır') || wLower.includes('donmuş')) {
      let flavor;
      if (attacker.includes('Katerina')) {
        flavor = `Katerina buz mavisi bakışlarıyla ${weapon} silahını yöneltti; kutup ayazı ${defender}'ın ciğerlerini yaktı!`;
      } else {
        flavor = `${attacker} ${weapon} silahındaki buzul kristallerini tetikleyerek dondurucu bir rüzgar saldı!`;
      }
      if (event === CombatEvent.CRITICAL) {
        return `${flavor} Hasmın kanını donduran mutlak soğuk ${bodyPart.dativeSuffix} buzdan çatlaklar açtı! (-${damage} Can)`;
      } else if (event === CombatEvent.HIT) {
        return `${flavor} Ayaz rünleri ${defender}'ın eklemlerini dondurarak hareketlerini ağırlaştırdı. (-${damage} Can)`;
      } else if (event === CombatEvent.BLOCKED) {
        return 'Buzul darbesi kalkana çarptığı an siperin yüzeyi buz tuttu!';
      } else if (event === CombatEvent.DODGED) {
        return `${defender} geriye çekilerek buzdan fışkıran sivri sarkıtların menzilinden sıyrıldı!`;
      } else {
        return null;
      }
    // Engerek, Akrep, Zehir Silah ve Asaları
    } else if (wLower.includes('engerek') || wLower.includes('akrep') || (wLower.includes('zehir') && (wLower.includes('asa') || wLower.includes('gladius')))) {
      if (event === CombatEvent.CRITICAL) {
        return `${attacker} ${weapon} ile ${defender}'ın zırh aralığına kobra gibi sokuldu; zümrüt yeşili zehir doğrudan damarlarına enjekte oldu! (-${damage} Can)`;
      } else if (event === CombatEvent.HIT) {
        return `${weapon} silahından damlayan toksin ${defender}'ın yarasını yakıp kavurdu. (-${damage} Can)`;
      } else if (event === CombatEvent.BLOCKED) {
        return 'Zehirli damlalar kalkana sıçrayarak metali aşındırdı!';
      } else if (event === CombatEvent.DODGED) {
        return `${defender} yana kayarak zehirli iğnenin menzilinden kurtuldu!`;
      } else {
        return null;
      }
    // Süpernova, Tekillik, Yıldız Çeliği, Şafak Kılıcı
    } else if (wLower.includes('süpernova') || wLower.includes('tekillik') || wLower.includes('yıldız çeliği') || wLower.includes('şafak kılıcı')) {
      if (event === CombatEvent.CRITICAL) {
        return `${attacker} ${weapon} silahındaki göktaşı özünü serbest bıraktı; süpernova parlaklığındaki patlama ${defender}'ın savunmasını kül etti! (-${damage} Can)`;
      } else if (event === CombatEvent.HIT) {
        return `${weapon} silahının göksel titreşimi ${defender}'ın zırhını ezip iç hasar verdi. (-${damage} Can)`;
      } else if (event === CombatEvent.BLOCKED) {
        return `Göksel ışık kalkanda patladı; ${defender} gözlerini kapamak zorunda kaldı!`;
      } else if (event === CombatEvent.DODGED) {
        return `${defender} son anda kendini yere atarak yerçekimi patlamasından sıyrıldı!`;
      } else {
        return null;
      }
    // Teber / Kanatlı Teber
    } else if (wLower.includes('teber')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `${attacker} iki eliyle kavradığı kanatlı teberi havada ıslıkla döndürdü; geniş çelik kanat ${defender}'ın zırhını jilet gibi biçerken arka kancası ${defender}'ın ${bodyPart.dativeSuffix} takılıp etini kopardı! (-${damage} Can)`,
          `${attacker} uzun saplı teberiyle mesafe tanımaksızın öne atıldı; kanatlı teberin delici ucu ${defender}'ın ${bodyPart.dativeSuffix} saplandı ve geriye çekerken zırh levhasını yerinden söktü! (-${damage} Can)`,
          `Kanatlı teberin ağır balta ağzı ${defender}'ın siperini aşarak ${bodyPart.dativeSuffix} balyoz gibi indi; çeliğin çatırtısıyla kumlar kızıla boyandı! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `${attacker} uzun menzilli teber hamlesiyle ${defender}'ın ${bodyPart.dativeSuffix} vurdu; geniş kanat zırhı sıyırıp etine işledi. (-${damage} Can)`,
          `Teberin kavisli kanadı savrulurken ${defender}'ın gardını yana itti ve arka sivrisiyle ${bodyPart.dativeSuffix} çentik açtı. (-${damage} Can)`,
          `${attacker} teberin uzun sapını kaldıraç gibi kullanarak ${defender}'ın ${bodyPart.dativeSuffix} sert bir kesiş indirdi. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `${defender} kalkanını iki eliyle siper etti; teberin devasa kanat darbesi kalkana çarparak derin bir yarık bıraktı fakat gövdeye geçemedi!`;
      } else if (event === CombatEvent.DODGED) {
        return `Teberin uzun sapı geniş bir kavis çizerek havayı yardı; ${defender} son anda eğilerek kancanın altından sıyrıldı!`;
      } else {
        return null;
      }
    // Kompozit Boynuz Yay / Refleks Yay
    } else if (wLower.includes('boynuz yay') || wLower.includes('kompozit yay') || wLower.includes('refleks yay')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `Kompozit boynuz yayın gergin kirişi kulak tırmalayan bir sesle boşaldı; ıslık çalan çelik temrenli ok ${defender}'ın zırhını kağıt gibi delip ${bodyPart.dativeSuffix} gömüldü! (-${damage} Can)`,
          `${attacker} boynuz yayın kollarını son haddine kadar gerdi; fırlayan ok havayı ikiye bölerek doğrudan ${defender}'ın ${bodyPart.dativeSuffix} saplandı, arkasından kan fışkırdı! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Boynuz yaydan fırlayan sert temrenli ok ${defender}'ın ${bodyPart.dativeSuffix} saplanarak acı bir hırıltı kopardı. (-${damage} Can)`,
          `${attacker} hızlı bir refleksle kirişi tetikledi; vızıldayan ok ${defender}'ın zırhını sıyırıp etini yardı. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `${defender} siperini kaldırdı; boynuz yaydan çıkan ok kalkanın demir perçinine çarpıp kumlara sekti!`;
      } else if (event === CombatEvent.DODGED) {
        return `Vızıldayan ok ${defender}'ın şakağının milim yanından geçip ahşap parmaklıklara saplandı!`;
      } else {
        return null;
      }
    // Dikenli Çelik Şafak Yıldızı
    } else if (wLower.includes('şafak yıldızı') || (wLower.includes('dikenli') && wLower.includes('gürz'))) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `Şafak yıldızının masif çelik dikenleri ${defender}'ın ${bodyPart.dativeSuffix} balyoz gibi indi; zırh içe göçerken çiviler kemiğe kadar işledi! (-${damage} Can)`,
          `${attacker} ağır dikenli gürzü başının üstünde çevirip indirdi; kafatası ve zırhı inleten kemik çatlağı tribünleri ayağa kaldırdı! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Şafak yıldızının sivri çivileri ${defender}'ın ${bodyPart.dativeSuffix} çarpıp zırhını ezdi ve derin yaralar bıraktı. (-${damage} Can)`,
          `Ağır dikenli gürz ${defender}'ın gardını ezip geçti, çivili gövdesiyle etini morarttı. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return 'Şafak yıldızının çivileri kalkana çarptığı an tahtayı kıymık kıymık parçaladı; kollar uyuştu!';
      } else if (event === CombatEvent.DODGED) {
        return `Ağır dikenli topuz kumlara gömüldü; ${defender} son anda yana sıçrayarak ezilmekten kurtuldu!`;
      } else {
        return null;
      }
    // Çift Taraflı Savaş Baltası
    } else if (wLower.includes('savaş baltası') || (wLower.includes('çift') && wLower.includes('balta'))) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `Çift taraflı savaş baltasının devasa ağzı havayı yararak indi; ${defender}'ın göğüs ve omuz zırhını ikiye ayırırcasına ${bodyPart.dativeSuffix} dayandı! (-${damage} Can)`,
          `${attacker} iki ağızlı baltayı vahşi bir ivmeyle savurdu; çeliğin ağırlığı ${defender}'ı kumlara diz çöktürecek kadar derin bir yarık açtı! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Savaş baltasının geniş ağzı ${defender}'ın zırh perçinlerini kopararak etine derin bir çentik vurdu. (-${damage} Can)`,
          `Ağır çift ağızlı balta darbesi ${defender}'ın dengesini altüst edip geriye sendeletti. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `Ağır balta kalkanın kenarına saplandı; ${defender} var gücüyle kalkanını iterek baltayı kurtardı!`;
      } else {
        return null;
      }
    // Ağır Siperli Şövalye Kargısı
    } else if (wLower.includes('şövalye kargısı') || (wLower.includes('siperli') && wLower.includes('kargı'))) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `Şövalye kargısının masif çelik ucu ${defender}'ın zırh levhasını teneke gibi delip ${bodyPart.dativeSuffix} saplandı! Bütün gövde ağırlığıyla itilen kargı kemiğe dayandı! (-${damage} Can)`,
          `Çelik el siperliğinin ardına kapanan ${attacker}, kargıyı delici bir hücumla ${defender}'ın ${bodyPart.dativeSuffix} çaktı! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Kargının sert çelik temreni ${defender}'ın zırh halkalarını delerek ${bodyPart.dativeSuffix} kanlı bir delik açtı. (-${damage} Can)`,
          `Uzun kargı saplaması ${defender}'ı mesafe dışından yakalayıp geriye itti. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `Kargının sivri ucu ${defender}'ın siperine çarpıp kıvılcımlar saçarak yana kaydı!`;
      } else {
        return null;
      }
    // Gölge Kıvrımlı Zehir Kaması
    } else if (wLower.includes('zehir kaması') || wLower.includes('gölge kaması')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `Gölge kamasının çift oluğundan sızan engerek zehri ${defender}'ın en hassas eklem aralığına gömüldü; zehrin yakıcı aleviyle feryat kopardı! (-${damage} Can)`,
          `Kıvrımlı zehir kaması zırhın altından kobra gibi sokuldu; etten çekilirken geride moraran ve yanan derin bir delik bıraktı! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Zehir kamasının ucu ${defender}'ın tenini çizdi; uyuşturucu yeşil sıvı deride yakıcı bir sızı bıraktı. (-${damage} Can)`,
          `Süratle saplanan gölge kaması ${defender}'ın zırh bağlarını kesip kan akıttı. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `Kamanın kavisli burnu ${defender}'ın kolçağına çarpıp deriye ulaşamadan sekti!`;
      } else {
        return null;
      }
    // Dikenli Ağır Demir Kalkan
    } else if (wLower.includes('dikenli kalkan') || wLower.includes('dikenli demir kalkan')) {
      if (event === CombatEvent.CRITICAL) {
        return `Dikenli kalkanın ortasındaki sivri çelik göbek ${defender}'ın şakağında ve burnunda patladı; kemik çıtırtısıyla kumlara savruldu! (-${damage} Can)`;
      } else if (event === CombatEvent.HIT) {
        return `Ağır kalkanın demir dikeni ${defender}'ın göğsüne sertçe vurup nefesini tıkadı. (-${damage} Can)`;
      } else {
        return null;
      }
    // Kızıl Yakut Kakmalı Kan Kılıcı (Voladmir)
    } else if (wLower.includes('kan kılıcı') || (wLower.includes('yakut') && wLower.includes('kılıç'))) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `${attacker} kabzasındaki kızıl yakutun parıltısıyla kan kılıcını iki elle savurdu; çeliğin çentikli ağzı ${defender}'ın zırhını yararak oluk gibi kan akıttı! (-${damage} Can)`,
          `Kan kılıcının sivri ucu ${defender}'ın göğüs levhasını çatlatıp ${bodyPart.dativeSuffix} saplandı; kılıç çekilirken kumlara kızıl bir çizgi çekildi! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Kan kılıcının buz gibi çeliği ${defender}'ın ${bodyPart.dativeSuffix} temas edip etini yardı. (-${damage} Can)`,
          `${attacker} kılıcın yakutlu kabzasını çevirerek ${defender}'ın gardını boşa düşürdü ve böğrüne sert bir kesiş indirdi. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `Kan kılıcı ${defender}'ın siperine çarptı; çelikten çıkan tiz kıvılcımlar havada sönüştü!`;
      } else if (event === CombatEvent.DODGED) {
        return `${defender} geriye ters adım atarak kan kılıcının ölümcül kavisinden milim farkla sıyrıldı!`;
      } else {
        return null;
      }
    // Çift Hilal Rüzgar Bıçağı (Aresula)
    } else if (wLower.includes('hilal') && (wLower.includes('bıçak') || wLower.includes('rüzgar'))) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `${attacker} havada dönerek iki hilal bıçağını makas gibi birleştirdi; ${defender}'ın boyun ve omuz aralığını biçerek kan fışkırttı! (-${damage} Can)`,
          `Rüzgar bıçaklarının kavisli çeliği ${defender}'ın gardının arkasına süzülüp ${bodyPart.dativeSuffix} çift dikiş attı! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Hilal bıçaklarından biri ${defender}'ın zırh bağını kesip tenine acı dolu bir yarık açtı. (-${damage} Can)`,
          `${attacker} fırtına gibi yaklaşarak hilal bıçağıyla ${defender}'ın kolunu ve göğsünü sıyırdı. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `İki hilal bıçağı ${defender}'ın demir kolçağında durduruldu; metalik çınlama arenayı inletti!`;
      } else if (event === CombatEvent.DODGED) {
        return `${defender} başını eğerek döne döne gelen hilal bıçaklarının altından rüzgar gibi kaydı!`;
      } else {
        return null;
      }
    // Granit Yıkım Balyozu (Balthazar, Gideon, Rorik)
    } else if (wLower.includes('balyoz') || wLower.includes('çekiç')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `${attacker} iki eliyle kaldırdığı devasa balyozu ${defender}'ın ${bodyPart.dativeSuffix} balyoz gibi indirdi; zırh levhası paramparça olup kemikler çatırdayarak kumlara gömüldü! (-${damage} Can)`,
          `Granit balyozun masif kafası ${defender}'ın gövdesinde patladı; darbenin şiddetiyle ${defender} üç metre geriye savruldu! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Ağır balyoz darbesi ${defender}'ın zırhını içe doğru göçertti, ciğerlerinden acı bir nefes kopardı. (-${damage} Can)`,
          `Balyozun tok kafası ${defender}'ın ${bodyPart.dativeSuffix} sertçe çarparak dengesini altüst etti. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `Balyoz doğrudan kalkana indi; kalkanın tahtaları çatladı ve ${defender} dizlerinin üzerine çökmek zorunda kaldı!`;
      } else if (event === CombatEvent.DODGED) {
        return `Balyozun indiği yerdeki kum havuzu krater gibi patladı; ${defender} son anda yana sıçrayarak ezilmekten kurtuldu!`;
      } else {
        return null;
      }
    // İnce Çelik Saray Rapieri / Şiş (Yvaine, Alistair, Vespera)
    } else if (wLower.includes('rapier') || wLower.includes('şiş')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `Rapierin iğne ucu ${defender}'ın zırh plakalarının tam birleşim noktasına sokuldu; çelik içeride derin bir yol açarak organları tehdit etti! (-${damage} Can)`,
          `${attacker} zarif bir adımla öne fırlayıp rapierini ${defender}'ın ${bodyPart.dativeSuffix} şimşek gibi sapladı; kan fıskiyesi fışkırdı! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Esnek çelik rapier ${defender}'ın gardını delip geçti ve teninde derin bir kan deliği bıraktı. (-${damage} Can)`,
          `Hızlı bir dürtüşle rapierin sivri ucu ${defender}'ın zırh aralığını buldu. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `${defender} kılıcının kabza siperiyle rapierin ucunu yakalayıp yana savurdu!`;
      } else if (event === CombatEvent.DODGED) {
        return `İnce rapier havayı vınlayarak deldi; ${defender} gövdesini hafifçe çevirerek ucun boşluğu delmesini sağladı!`;
      } else {
        return null;
      }
    // Hilal Çelik Tırpan (Nyx)
    } else if (wLower.includes('tırpan')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `Çelik tırpanın hilal ağzı ${defender}'ın boyun hizasından dolandı; arkaya doğru çekilen tırpan zırhı ve eti biçerek ölüm saçtı! (-${damage} Can)`,
          `${attacker} tırpanı geniş bir kavisle yer seviyesinden savurdu; ${defender}'ın diz arkasındaki tendonları biçti! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Tırpanın sivri burnu ${defender}'ın böğrüne takılarak derisini yardı. (-${damage} Can)`,
          `Geniş hilal tırpan ${defender}'ın omuz zırhını sıyırarak kan akıttı. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `Tırpanın kavisli sapı ${defender}'ın kalkanına takıldı; iki dövüşçü bir an burun buruna kaldı!`;
      } else if (event === CombatEvent.DODGED) {
        return `${defender} havaya sıçrayarak ayaklarının altından süpüren tırpan ağzından kurtuldu!`;
      } else {
        return null;
      }
    // Keskin Tüy Bıçakları (Xayah)
    } else if (wLower.includes('tüy') && wLower.includes('bıçak')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `${attacker} avucundan üç tüy bıçağını aynı anda fırlattı; jilet keskinliğindeki bıçaklar ${defender}'ın zırhını delerek ${bodyPart.dativeSuffix} gömüldü! (-${damage} Can)`,
          `Havada ıslık çalan çelik tüy hançerleri ${defender}'ın en savunmasız anında şakağını ve boynunu biçti! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Fırlatılan çelik tüy bıçağı ${defender}'ın etine saplanıp derin bir kanama başlattı. (-${damage} Can)`,
          `Çevik bir savuruşla gelen tüy bıçağı ${defender}'ın zırhını yardı. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `Tüy bıçakları ${defender}'ın siperine saplanıp kaldı; kalkan çelik tüylerle doldu!`;
      } else if (event === CombatEvent.DODGED) {
        return `${defender} hızla yana yuvarlanarak gölge gibi uçan tüy bıçaklarının menzilinden çıktı!`;
      } else {
        return null;
      }
    // Zincirli Çift Ağır Orak (Baelor - Demir Maskeli Cellat)
    } else if (wLower.includes('orak')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `${attacker} zincirli ağır orağı havada ıslıkla çevirip fırlattı; hilal biçimli kanca ${defender}'ın zırhını yararak ${bodyPart.dativeSuffix} derinlemesine kilitlendi! (-${damage} Can)`,
          `Orağın ölümcül kavisli sivrisi ${defender}'ın siperini aşıp ${bodyPart.dativeSuffix} saplandı; zincirin gerilmesiyle etini koparan vahşi bir çentik açıldı! (-${damage} Can)`,
          `${attacker} iki orağını çapraz biçimde savurarak cellat kıskaçları gibi ${defender}'ın ${bodyPart.dativeSuffix} geçirdi; kan fışkırırken arenada kemik sesi yankılandı! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Zincirli orağın kavisli ağzı ${defender}'ın ${bodyPart.dativeSuffix} takılarak derin bir çizik açtı. (-${damage} Can)`,
          `${attacker} orağın zincirini kırbaç gibi şaklatıp ${defender}'ın gardını çekti ve böğrüne orağın sivrisini vurdu. (-${damage} Can)`,
          `Ağır orağın sivri çeliği ${defender}'ın zırh perçinlerini sıyırarak kan akıttı. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `Orağın hilal ağzı ${defender}'ın siperine kenetlendi; ${defender} kalkanını hızla burkarak orağı boşa savurdu!`;
      } else if (event === CombatEvent.DODGED) {
        return `${defender} hızla eğilerek başının hemen üzerinden vızıldayarak geçen zincirli orağın menzilinden sıyrıldı!`;
      } else {
        return null;
      }
    // 2. Bölüm (Taş Hisar) Egzotik Kılıç ve Palaları (Sınır Muhafızı, Fırtına Sırtı, Çift Yivli vb.)
    } else if (wLower.includes('sınır muhafızı') || wLower.includes('fırtına sırtı') || wLower.includes('çift yivli') || wLower.includes('şafak yırtan') || wLower.includes('falşiyon') || wLower.includes('kavisli pala')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `${attacker} çift kan oluklu ${weapon} namlusunu havada çınlatıp ${defender}'ın siper aralığına jilet gibi soktu; et ve çelik ayrılırken derin bir oluk açıldı! (-${damage} Can)`,
          `${attacker} kavisli palasının tüm kesme açısını kullanarak ${defender}'ın ${bodyPart.dativeSuffix} yıldırım gibi kavis çizdi; zırh perçinleri kopup et kızıla boyandı! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `${weapon} kavisli namlusuyla ${defender}'ın zırhını sıyırıp etine derin bir çentik bıraktı. (-${damage} Can)`,
          `${attacker} hızlı bir kılıç dönüşüyle ${defender}'ın ${bodyPart.dativeSuffix} sert ve akıcı bir kesiş indirdi. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `${defender} kavisli palanın ağırlığını kalkanıyla yana saptırdı; çeliğin çınlaması arenayı inletti!`;
      } else if (event === CombatEvent.DODGED) {
        return `${defender} geriye eğilerek kavisli palanın vınlayan ağzından saç teli payıyla sıyrıldı!`;
      } else {
        return null;
      }
    // 2. Bölüm (Taş Hisar) Taş Kırıcı Tokmak, Statik Boğa Gürzü & Kemik Ezici Cüce Çekici
    } else if (wLower.includes('taş kırıcı') || wLower.includes('statik boğa') || wLower.includes('kemik ezici') || wLower.includes('cüce çekici') || wLower.includes('kurşun başlı') || wLower.includes('bozdoğan')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `${attacker} iki elle kavradığı ${weapon} silahını göğe kaldırıp ${defender}'ın ${bodyPart.dativeSuffix} meteor gibi indirdi; zırh içe göçerken taş ocaklarını inleten bir kemik çatırtısı koptu! (-${damage} Can)`,
          `${weapon} silahının masif çivili başlığı ${defender}'ın dengesini ve göğüs kafesini paramparça etti; arenanın tozu şok dalgasıyla savruldu! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `${weapon} tok bir çekiç sesiyle ${defender}'ın ${bodyPart.dativeSuffix} inip kaslarını ezdi. (-${damage} Can)`,
          `Ağır kurşun başlı darbe ${defender}'ın gardını sarsarak ciğerlerinden boğuk bir nefes kopardı. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `${weapon} doğrudan kalkana indi; kalkanın meşe takviyesi çatladı ve ${defender} dizini yere çarptı!`;
      } else if (event === CombatEvent.DODGED) {
        return `Ağır çekiç kumlara gömüldü; ${defender} son anda yana yuvarlanarak un ufak olmaktan kurtuldu!`;
      } else {
        return null;
      }
    // 2. Bölüm (Taş Hisar) Dağ Yaran, Kan Emici & Kızıl Kor Baltaları
    } else if (wLower.includes('dağ yaran') || wLower.includes('kan emici') || wLower.includes('kızıl kor') || wLower.includes('kuzey teberi') || wLower.includes('yarma baltası') || wLower.includes('kafatası baltası')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `${attacker} ${weapon} baltasını vahşi bir kükremeyle indirdi; geniş balta ağzı ${defender}'ın göğüs levhasını ve kaburgalarını ikiye ayırırcasına yarıp kemiğe dayandı! (-${damage} Can)`,
          `Kan emici çentikleriyle parıldayan ${weapon}, ${defender}'ın ${bodyPart.dativeSuffix} saplandı; geriye çekilirken zırhı ve eti koparan korkunç bir yara açtı! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `${weapon} baltasının ağır ağzı ${defender}'ın zırhını sıyırıp etine derin bir kesik attı. (-${damage} Can)`,
          `Balta darbesi ${defender}'ın dengesini bozarak geriye doğru sendeletti. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `Balta kalkanın çelik kenarına kenetlendi; ${defender} var gücüyle ittirip ağzı siperden söktü!`;
      } else if (event === CombatEvent.DODGED) {
        return `Geniş balta savruluşu havayı uğuldatırken ${defender} eğilip darbenin altından aktı!`;
      } else {
        return null;
      }
    // 2. Bölüm (Taş Hisar) Burç Nöbetçisi & Bozkır Süvari Delici Kargıları
    } else if (wLower.includes('burç nöbetçisi') || wLower.includes('bozkır süvari') || wLower.includes('zümrüt başlı') || wLower.includes('ejder kemiği') || wLower.includes('engerek kargısı') || wLower.includes('delici kargı')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `${attacker} üç adımlık hızla ${weapon} kargısını öne sürdü; dört köşeli çelik temren ${defender}'ın zırhını teneke gibi delip ${bodyPart.dativeSuffix} saplandı! Gövdeye gömülen mızrak nefesini kesti! (-${damage} Can)`,
          `${weapon} kargısının masif temreni ${defender}'ın en kalın zırh plakasını delip geçti; arkadan fışkıran kan kumlara saçıldı! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Delici kargı saplaması ${defender}'ın zırh aralığını bularak kanlı bir delik açtı. (-${damage} Can)`,
          `${attacker} mesafeyi koruyarak ${weapon} ile ${defender}'ın ${bodyPart.dativeSuffix} sert bir dürtüş yaptı. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return 'Kargının sivri ucu kalkandan sekerek yana kaydı; kıvılcımlar havaya uçuştu!';
      } else if (event === CombatEvent.DODGED) {
        return `${defender} yana adım atarak göğsünü teğet geçen mızrak temreninden ustaca kurtuldu!`;
      } else {
        return null;
      }
    // 2. Bölüm (Taş Hisar) Akrep Hançeri, Saray Stiletosu & Sis Rünlü Kamalar
    } else if (wLower.includes('akrep hançeri') || wLower.includes('saray stiletosu') || wLower.includes('sis rünlü') || wLower.includes('boğaz kesen') || wLower.includes('çift dişli') || wLower.includes('kıvrımlı kama')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `${attacker} gölge gibi süzülüp ${weapon} hançerini ${defender}'ın boyun ve köprücük kemiği aralığına sessizce soktu; zehirli oluktan sızan kan arenayı kızıla boyadı! (-${damage} Can)`,
          `${weapon} kaması zırhın en dar eklemine kobra hızıyla saplandı; içeride burkulan çelik dayanılmaz bir acı feryadı kopardı! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Hançerin sivri burnu ${defender}'ın tenini çizerek sızlayan bir oyuk bıraktı. (-${damage} Can)`,
          `${attacker} yıldırım gibi iki hamle yaparak ${weapon} ile ${defender}'ın böğrünü yardı. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `Hançerin ucu ${defender}'ın çelik kolçağına çarpıp deriye ulaşamadan sekti!`;
      } else if (event === CombatEvent.DODGED) {
        return `${defender} geriye esneyerek hançerin zehirli ucunun boşluğu çizmesini sağladı!`;
      } else {
        return null;
      }
    // 2. Bölüm (Taş Hisar) Mekanik Arbaletler, Rüzgar Oku & Sadak Donanımları
    } else if (wLower.includes('taş hisar arbaleti') || wLower.includes('rüzgar oku') || wLower.includes('mancınık yayı') || wLower.includes('tatar yayı')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `Arbaletin çelik tetiği düştü; ıslık çalan ağır cıva oku ${defender}'ın zırhını delik deşik edip ${bodyPart.dativeSuffix} gömüldü! (-${damage} Can)`,
          `Mekanik kundaktan fırlayan delme gücü yüksek ok ${defender}'ı iki metre geriye savurarak kumlara çiviledi! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `Vızıldayan ok ${defender}'ın zırhını yarıp etine saplandı. (-${damage} Can)`,
          `${attacker} seri bir kundak kuruşuyla ${defender}'ın ${bodyPart.dativeSuffix} çelik temreni oturttu. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return 'Ağır ok kalkanın demir göbeğine saplanıp titredi; içeriye geçemedi!';
      } else if (event === CombatEvent.DODGED) {
        return `Vızıldayan cıva oku ${defender}'ın kulağının dibinden geçip ahşap korkulukları parçaladı!`;
      } else {
        return null;
      }
    // 2. Bölüm (Taş Hisar) Büyülü & Elementel Asalar (Lav, Ayaz, Fırtına, Tsunami, Kristal)
    } else if (wLower.includes('lav akıntısı') || wLower.includes('kutup ayazı') || wLower.includes('fırtına asası') || wLower.includes('tsunami') || wLower.includes('zümrüt yaşam') || wLower.includes('kristal küre') || wLower.includes('odak')) {
      if (event === CombatEvent.CRITICAL) {
        return kt.random([
          `${attacker} ${weapon} asasını yere çarparak elementel girdabı serbest bıraktı; patlayan büyü dalgası ${defender}'ın zırhını kavurarak kumlara serdi! (-${damage} Can)`,
          `${weapon} ucundaki kristal göz alıcı bir şavkla parıldadı; serbest kalan saf güç ${defender}'ın göğsünde patlayarak havaya savurdu! (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.HIT) {
        return kt.random([
          `${weapon} asasından yayılan büyü enerjisi ${defender}'ın zırhını aşıp etini yaktı. (-${damage} Can)`,
          `Kristalden saçılan eterik şok ${defender}'ın reflekslerini ve dengesini sarstı. (-${damage} Can)`
        ]);
      } else if (event === CombatEvent.BLOCKED) {
        return `Büyü patlaması ${defender}'ın kalkanındaki rünik korumaya çarpıp dağıldı!`;
      } else if (event === CombatEvent.DODGED) {
        return `${defender} yana yuvarlanarak kumlarda krater açan büyü huzmesinden sıyrıldı!`;
      } else {
        return null;
      }
    // 2. Bölüm (Taş Hisar) Savunma Zırh ve Siper Donanımları (Azam Surları, Ayna Kalkanı, Dikenli Zırh vb.)
    } else if (wLower.includes('azam surları') || wLower.includes('ayna yüzeyli') || wLower.includes('statik zırh') || wLower.includes('deniz rüzgarı')) {
      if (event === CombatEvent.BLOCKED) {
        return kt.random([
          '[AZAM SURLARI!] Darbe granit bloklar gibi sağlam siperde yankılandı; çelik darbe taşa çarpan cam gibi dağıldı!',
          '[AYNA SİPERİ!] Kalkanın parlak yüzeyi darbenin açısını bükerek kıvılcımları saldırganın yüzüne fırlattı!',
          '[STATİK DİRENÇ!] Darbe temas ettiği an zırhtan mavi arklar saçıldı; saldırganın kolları sarsıntıyla titredi!'
        ]);
      } else if (event === CombatEvent.CRITICAL || event === CombatEvent.HIT) {
        return `${attacker} ${weapon} siperinin masif çelik göbeğiyle ${defender}'ın göğsüne sertçe yüklendi! (-${damage} Can)`;
      } else {
        return null;
      }
    }
    // 2. Dövüşçü Karakter Eşleşmeleri ve Özgün Diyalog/Vuruş Anları
    if (event === CombatEvent.CRITICAL || event === CombatEvent.HIT) {
      // Baelor Clashes
      if (defender.includes('Baelor') && isCrit) {
        return `${attacker}, demir maskeli celladın ağır orak savuruşundaki anlık gecikmeyi yakalayıp Baelor'un zincir zırhına sarsıcı bir darbe indirdi! (-${damage} Can)`;
      } else if (attacker.includes('Baelor') && isCrit) {
        return `Baelor demir maskesinin ardındaki soğuk sessizliğiyle zincirli oraklarını şaklattı; ${defender}'ın ${bodyPart.dativeSuffix} inen cellat darbesiyle arenanın kumu kana bulandı! (-${damage} Can)`;
      // Morvath Clashes
      } else if (defender.includes('Morvath') && isCrit) {
        return `${attacker} soğukkanlılıkla Morvath'ın üç ağızlı kargısının gard aralığına girdi ve şampiyonun zırh levhasına ölümcül bir darbe indirdi! Şampiyon sendeleyerek kumda diz çöktü! (-${damage} Can)`;
      } else if (attacker.includes('Morvath') && isCrit) {
        return `Morvath kibirli bir bakışla üç ağızlı kargısını kalkanın üzerinden aşırıp ${defender}'ın ${bodyPart.dativeSuffix} sapladı! Tribünler şampiyonun adını haykırdı! (-${damage} Can)`;
      // Thyra Clashes
      } else if (defender.includes('Thyra') && isCrit) {
        return `${attacker}, Thyra'nın vahşi çelik nacak savuruşundaki açığı yakalayarak dağ klanı savaşçısının böğrüne acımasız bir darbe vurdu! (-${damage} Can)`;
      } else if (attacker.includes('Thyra') && isCrit) {
        return `Thyra dağ klanı narasıyla havaya sıçradı; çift ağızlı çelik nacağını ve baltasını kemik parçalayan bir hiddetle ${defender}'ın ${bodyPart.dativeSuffix} indirdi! (-${damage} Can)`;
      // Ghorak Clashes
      } else if (defender.includes('Ghorak') && isCrit) {
        return `${attacker}, Ghorak'ın savurduğu ağır prangalı zincirli topuzun altından kayıp eski kürek mahkumunun göğüs perçinlerini parçaladı! (-${damage} Can)`;
      } else if (attacker.includes('Ghorak') && isCrit) {
        return `Ghorak dikenli demir gülleyi ve prangalı zincirli topuzunu başının üstünde vınlatıp ${defender}'ın ${bodyPart.dativeSuffix} çarptı; pranganın ve zincirin çınlaması arenayı sarstı! (-${damage} Can)`;
      // Kaelen Clashes
      } else if (defender.includes('Kaelen')) {
        return `${attacker}, Kaelen'in mekanik arbalet yay gerilimi arasındaki o tek saniyelik boşlukta kör nişancının üzerine atılarak ${weapon} ile çelik ok yağmurunu yardı! (-${damage} Can)`;
      // Bregash Clashes
      } else if (defender.includes('Bregash')) {
        return `${attacker}, Bregash'ın alttan yukarıya kalkan ağır ters palasını ustaca saptırıp mezbaha gladyatörünün açıkta kalan kaburgasını ve böğrünü yardı! (-${damage} Can)`;
      // Xylar Clashes
      } else if (defender.includes('Xylar')) {
        return `${attacker}'ın savurduğu ${weapon} darbesi Xylar'ın demir perçinli çenesinde patladı; sokak devinin sırıtışı kanla kesildi! (-${damage} Can)`;
      // Khorvash Clashes
      } else if (defender.includes('Khorvash')) {
        return `${attacker} kumdaki adımlarını hafifleterek kör Khorvash'ın oltasının iğnesinden sıyrıldı ve ${weapon} ile gövdesine yüklendi! (-${damage} Can)`;
      // Sarkoth Clashes
      } else if (defender.includes('Sarkoth')) {
        return `${attacker}, Sarkoth'un kumdan fırlayan sinsi hamlesini boşa çıkarıp akrep savaşçısının zırh aralığına sert bir vuruş indirdi! (-${damage} Can)`;
      }
    }
    return null;
  },

  generateReflectionNarrative(attacker, defender, trait, damage, weapon, isPlayerAttacker) {
    const tLower = trait.name.toLowerCase();
    if (tLower.includes('ayna') || tLower.includes('yankı')) {
      return kt.random([
        `[${trait.name.toUpperCase()}!] ${defender}'ın aynalı yüzeyi darbenin kinetik şokunu soğurup kör edici bir ışık prizmasıyla ${attacker}'a geri patlattı! (-${damage} Yansıtma Hasarı)`,
        `[${trait.name.toUpperCase()}!] ${attacker}'ın hücumu pürüzsüz ayna çeliğinde kırıldı; yansıyan güç aynı şiddetle göğsüne geri çarptı! (-${damage} Yansıtma Hasarı)`
      ]);
    } else if (tLower.includes('statik') || tLower.includes('şok') || tLower.includes('yıldırım')) {
      return kt.random([
        `[${trait.name.toUpperCase()}!] Darbenin temasıyla ${defender}'ın zırhındaki statik rünler alevlendi; çatırdayan mavi yıldırımlar ${attacker}'ın ellerini ve kollarını kavurarak geri çarptı! (-${damage} Yansıtma Hasarı)`,
        `[${trait.name.toUpperCase()}!] ${defender}'ın plaka zırhı yüksek voltajlı bir ark salarak ${attacker}'ın sinirlerini uyuşturdu ve darbeyi sahibine iade etti! (-${damage} Yansıtma Hasarı)`
      ]);
    } else if (tLower.includes('diken') || tLower.includes('kemik') || tLower.includes('çivi')) {
      return kt.random([
        `[${trait.name.toUpperCase()}!] ${attacker} hücum ederken ${defender}'ın zırhındaki keskin çelik dikenlere çarptı; kanlı çiviler saldırganın etine saplanarak geri tepti! (-${damage} Yansıtma Hasarı)`,
        `[${trait.name.toUpperCase()}!] Zırhtan dışarı taşan çelik sivrilikler darbeyi emmeyip ${attacker}'ın uzuvlarına batarak etini yırttı! (-${damage} Yansıtma Hasarı)`
      ]);
    } else if (tLower.includes('tsunami') || tLower.includes('su') || tLower.includes('dalga')) {
      return kt.random([
        `[${trait.name.toUpperCase()}!] ${defender}'ın etrafındaki su bariyeri darbeyi emip oluşan tazyikli basınç dalgasıyla ${attacker}'ı geriye savurdu! (-${damage} Yansıtma Hasarı)`,
        `[${trait.name.toUpperCase()}!] Tsunami rünü patlayarak savrulan darbeyi bir girdap gibi yuttu ve geri tepmeyle ${attacker}'ın dengesini dağıttı! (-${damage} Yansıtma Hasarı)`
      ]);
    } else if (tLower.includes('azam') || tLower.includes('sur')) {
      return kt.random([
        `[${trait.name.toUpperCase()}!] ${attacker}'ın silahı yıkılmaz sur çeliğine çarptığı an oluşan granit sarsıntı kollarına geri tepti, bilek bağlarını zorladı! (-${damage} Yansıtma Hasarı)`,
        `[${trait.name.toUpperCase()}!] Taş Hisar surlarının kadim alaşımı darbeyi bir kale gibi göğüsleyip kinetik basıncı saldırganın göğsüne vurdu! (-${damage} Yansıtma Hasarı)`
      ]);
    } else {
      if (isPlayerAttacker) {
        return `[${trait.name.toUpperCase()}!] Hasmın özel donanımı darbenin bir kısmını sana geri yansıttı (-${damage} Yansıtma Hasarı)!`;
      } else {
        return `[${trait.name.toUpperCase()}!] Donanımındaki koruma mühürleri darbeyi saldırgana geri tepti (-${damage} Yansıtma Hasarı)!`;
      }
    }
  },

  generateDetailedLog(attacker, defender, weapon, event, bodyPart, damage, defenderHpLeft, stance, tacticalPosition = CombatTacticalPosition.NEUTRAL) {
    const category = TextTemplateEngine.detectCategory(weapon);
    let positionPrefix;
    if (tacticalPosition === CombatTacticalPosition.ADVANTAGE) {
      positionPrefix = kt.random([
        `Rakibinin sendeleyip açık verdiğini gören ${attacker}, üstünlüğü ele alarak`,
        `${defender}'ın gardındaki açığı şimşek gibi fark eden ${attacker}, fırsatı affetmeyerek`,
        `Hasmının dengesini yitirdiğini sezen ${attacker}, acımasız bir atılımla`
      ]);
    } else if (tacticalPosition === CombatTacticalPosition.DESPERATION) {
      positionPrefix = kt.random([
        `Köşeye sıkışan ve can havliyle saldıran ${attacker},`,
        `Son nefesini verircesine gözü kararan ${attacker}, var gücüyle`,
        `Yaralarının acısıyla kükreyen ${attacker}, ölüm kalım hamlesiyle`
      ]);
    } else if (tacticalPosition === CombatTacticalPosition.NEUTRAL) {
      if (stance === CombatStance.AGGRESSIVE) {
        positionPrefix = kt.random([
          `${attacker} gözü dönmüş bir hiddetle gardını hiçe sayarak`,
          `${attacker} kükreyerek öne doğru atıldı ve`,
          `${attacker} acımasız bir hücum hırsıyla`
        ]);
      } else if (stance === CombatStance.DEFENSIVE) {
        positionPrefix = kt.random([
          `${attacker} arkasına çekilip siperinin ardına saklanarak`,
          `${attacker} soğukkanlı adımlarla gardını korurken`,
          `${attacker} savunma siperinin ardından fırsat kollayarak`
        ]);
      } else if (stance === CombatStance.OPPORTUNISTIC) {
        positionPrefix = kt.random([
          `${attacker} hasmının gardındaki açığı sinsice kollayarak`,
          `${attacker} avını bekleyen bir yırtıcı gibi süzülüp`,
          `${attacker} rakibin zayıf noktasını yakalamak için adım atarak`
        ]);
      } else if (stance === CombatStance.BALANCED) {
        positionPrefix = kt.random([
          `${attacker} dengeli ve temkinli adımlarla`,
          `${attacker} soğukkanlılığını bozmadan`,
          `${attacker} arenanın tozunu yararak`
        ]);
      }
    }
    const isCrit = event === CombatEvent.CRITICAL;
    const defenderMaxHpEstimate = kt.coerceAtLeast((defenderHpLeft + damage), 100);
    const severity = TextTemplateEngine.calculateSeverity(damage, isCrit, defenderMaxHpEstimate);
    const specialEncounter = TextTemplateEngine.getSpecialWeaponOrFighterEncounter(attacker, defender, weapon, bodyPart, event, damage);
    const useSpecial = specialEncounter != null && (kt.Random.nextInt(100) < 85);
    let logText;
    if (useSpecial) {
      logText = specialEncounter;
    } else {
      if (event === CombatEvent.CRITICAL) {
        const impact = TextTemplateEngine.getBodyPartImpact(bodyPart, category, severity);
        const strikeVerb = kt.random([
          `silahını ölümcül bir hırsla ${defender}'ın ${bodyPart.dativeSuffix} savurdu!`,
          `silahını kemik parçalayan bir ivmeyle ${defender}'ın ${bodyPart.dativeSuffix} indirdi!`,
          `silahıyla arenayı inleten vahşi bir darbeyle ${defender}'ın ${bodyPart.dativeSuffix} çaktı!`
        ]);
        logText = `${positionPrefix} ${weapon} ${strikeVerb} ${impact} (-${damage} Can)`;
      } else if (event === CombatEvent.HIT) {
        const impact = TextTemplateEngine.getBodyPartImpact(bodyPart, category, severity);
        let strikeVerb;
        if (severity === DamageSeverity.GLANCING) {
          strikeVerb = kt.random([
            `silahının ucuyla ${defender}'ın ${bodyPart.dativeSuffix} teğet bir hamle yaptı.`,
            `yüzeysel bir hamleyle ${defender}'ın ${bodyPart.dativeSuffix} dokundu.`,
            `hızlı ama sıyırıcı bir temasla ${defender}'ın ${bodyPart.dativeSuffix} vurdu.`
          ]);
        } else if (severity === DamageSeverity.MODERATE) {
          strikeVerb = kt.random([
            `ile ${defender}'ın ${bodyPart.dativeSuffix} vurdu.`,
            `silahını ${defender}'ın ${bodyPart.dativeSuffix} sertçe oturttu.`,
            `ile ${defender}'ın ${bodyPart.dativeSuffix} tok bir temas sağladı.`
          ]);
        } else if (severity === DamageSeverity.HEAVY || severity === DamageSeverity.DEVASTATING) {
          strikeVerb = kt.random([
            `ile ${defender}'ın ${bodyPart.dativeSuffix} ağır ve sarsıcı bir darbe indirdi!`,
            `silahını olanca kuvvetiyle ${defender}'ın ${bodyPart.dativeSuffix} vurdu!`,
            `ile ${defender}'ın ${bodyPart.dativeSuffix} zırhı zorlayan amansız bir vuruş yaptı!`
          ]);
        }
        logText = `${positionPrefix} ${weapon} ${strikeVerb} ${impact} (-${damage} Can)`;
      } else if (event === CombatEvent.DODGED) {
        logText = TextTemplateEngine.getDodgeNarrative(attacker, defender, weapon, category);
      } else if (event === CombatEvent.BLOCKED) {
        const blockBase = TextTemplateEngine.getBlockNarrative(attacker, defender, weapon, category);
        let blockFlavor;
        if (damage <= 3) {
          blockFlavor = 'Darbe neredeyse tamamen siperde eridi; hasım hafifçe geriye sendeledi.';
        } else if (damage <= 12) {
          blockFlavor = 'Kalkan darbeyi yumuşattı fakat kol kasları sarsıntıyla sızladı.';
        } else {
          blockFlavor = 'Siper kırılmadı fakat darbenin şiddeti kemiklere kadar işledi!';
        }
        logText = `${blockBase} ${blockFlavor} (-${damage} Can)`;
      } else if (event === CombatEvent.DEFEAT) {
        logText = TextTemplateEngine.getDefeatNarrative(attacker, defender, weapon);
      } else if (event === CombatEvent.DRAW) {
        logText = TextTemplateEngine.generateDrawNarrative(attacker, weapon, defender, 'Silahı', DrawSituation.DOUBLE_KNOCKOUT);
      }
    }
    // Atmosfer eklemesi: %35 şansla tribün, tellal veya duyusal atmosfer eklenir
    const appendAtmosphere = kt.Random.nextInt(100) < 35 && event !== CombatEvent.DEFEAT && event !== CombatEvent.DRAW;
    if (appendAtmosphere) {
      let flavor;
      const __konu = kt.Random.nextInt(3);
      if (__konu === 0) {
        flavor = kt.random(TextTemplateEngine.crowdAtmospheres);
      } else if (__konu === 1) {
        flavor = kt.random(TextTemplateEngine.announcerPhrases);
      } else {
        flavor = kt.random(TextTemplateEngine.sensoryAtmospheres);
      }
      return `${logText}\n${flavor}`;
    } else {
      return logText;
    }
  },

  generateDrawNarrative(fighter1Name, fighter1Weapon, fighter2Name, fighter2Weapon, situation = DrawSituation.DOUBLE_KNOCKOUT) {
    const cat1 = TextTemplateEngine.detectCategory(fighter1Weapon);
    const cat2 = TextTemplateEngine.detectCategory(fighter2Weapon);
    // 1. Dövüşçü kişiliklerine özel edebi çifte nakavt tasvirleri
    let fighterSpecific;
    if (fighter1Name.includes('Morvath') || fighter2Name.includes('Morvath')) {
      const other = fighter1Name.includes('Morvath') ? fighter2Name : fighter1Name;
      fighterSpecific = `Morvath'ın Üç Ağızlı Kargısı ${other}'ın zırhını deşerken, ${other} can havliyle son vuruşunu Morvath'ın miğferine indirdi! Kırlangıç Kasabası'nın namağlup şampiyonu ile hasmı aynı saniyede yere serildi; çifte nakavtla kumlar kızıla boyandı!`;
    } else if (fighter1Name.includes('Thyra') || fighter2Name.includes('Thyra')) {
      const other = fighter1Name.includes('Thyra') ? fighter2Name : fighter1Name;
      fighterSpecific = `Thyra'nın vahşi çelik nacağıyla ${other}'ın silahı aynı anda kaburgalara indi! Dağ klanlarının vahşi savaşçısı ve hasmı acı dolu bir feryatla birbirlerinin kollarında kumlara yığıldı!`;
    } else if (fighter1Name.includes('Ghorak') || fighter2Name.includes('Ghorak')) {
      const other = fighter1Name.includes('Ghorak') ? fighter2Name : fighter1Name;
      fighterSpecific = `Ghorak'ın pranga zinciri ${other}'ın boynuna sarılıp yere çekerken, ${other}'ın son hamlesi Ghorak'ın göğsünü ezdi; ağır dikenli gülle iki bedeni birden kumların üzerine mıhladı!`;
    } else if (fighter1Name.includes('Bregash') || fighter2Name.includes('Bregash')) {
      const other = fighter1Name.includes('Bregash') ? fighter2Name : fighter1Name;
      fighterSpecific = `Bregash ters palasıyla aşağıdan yukarıya kemik deşen bir kavis çizerken, ${other}'ın ağır vuruşu Bregash'ın şakağında patladı! Mezbaha gladyatörü ve hasmı toz bulutunun içinde kendinden geçti!`;
    } else if (fighter1Name.includes('Kaelen') || fighter2Name.includes('Kaelen')) {
      const other = fighter1Name.includes('Kaelen') ? fighter2Name : fighter1Name;
      fighterSpecific = `Kaelen göz bağının altından dinlediği sese son çelik okunu çakarken, ${other}'ın yaklaşan darbesi arbaletini parçalayıp göğsünü ezdi; iki gladyatör de kumların üzerinde soluksuz kaldı!`;
    } else if (fighter1Name.includes('Xylar') || fighter2Name.includes('Xylar')) {
      const other = fighter1Name.includes('Xylar') ? fighter2Name : fighter1Name;
      fighterSpecific = `Xylar demir dişlerini gıcırdatarak tokmakla vurdu, ${other}'ın darbesiyle aynı anda kafatasları çarpıştı; iki dev cüsse birden yeri titreterek kumların üzerine kapaklandı!`;
    } else if (fighter1Name.includes('Vaelen') || fighter2Name.includes('Vaelen')) {
      const other = fighter1Name.includes('Vaelen') ? fighter2Name : fighter1Name;
      fighterSpecific = `Vaelen gölge kancasını ${other}'ın boğazına takarken, ${other}'ın son can havli tekmesi Vaelen'i yere çaldı; kancanın ucu kumlara saplandı, iki savaşçı da ayağa kalkamadı!`;
    } else if (fighter1Name.includes('Orn') || fighter2Name.includes('Orn')) {
      const other = fighter1Name.includes('Orn') ? fighter2Name : fighter1Name;
      fighterSpecific = `Orn'un çengelli zıpkını ${other}'ın etine kilitlenirken, ${other}'ın savurduğu silah Orn'un omzunu parçaladı; sazlık avcısı ve rakibi birbirine kenetlenmiş vaziyette bilincini kaybetti!`;
    } else if (fighter1Name.includes('Sarkoth') || fighter2Name.includes('Sarkoth')) {
      const other = fighter1Name.includes('Sarkoth') ? fighter2Name : fighter1Name;
      fighterSpecific = `Sarkoth'un çift kemik kaması ${other}'ın böğrüne saplanırken, ${other}'ın karşı hamlesi Sarkoth'u sırtüstü devirdi; çöl akrebi ve hasmı aynı anda kumları tırnaklayarak kendinden geçti!`;
    } else if (fighter1Name.includes("Zal'Mora") || fighter2Name.includes("Zal'Mora")) {
      const other = fighter1Name.includes("Zal'Mora") ? fighter2Name : fighter1Name;
      fighterSpecific = `Zal'Mora boynuz hançeriyle saldırırken ${other}'ın silahı göğsüne oturdu; arenanın küllerini çiğneyen vahşi savaşçı ve hasmı son nefeslerinde çifte nakavta sürüklendi!`;
    } else if (fighter1Name.includes('Khorvash') || fighter2Name.includes('Khorvash')) {
      const other = fighter1Name.includes('Khorvash') ? fighter2Name : fighter1Name;
      fighterSpecific = `Khorvash kör iğneli oltasını ${other}'a dolarken ${other}'ın son darbesiyle sendeledi; tuz çöllerinin kör dövüşçüsü ve hasmı yan yana kumların üzerine devrildi!`;
    } else {
      fighterSpecific = null;
    }
    if (fighterSpecific != null && kt.Random.nextBoolean()) {
      return `${fighterSpecific}\nSunucu Tellal bağırıyor: 'İki canavar da kumlara serildi! Hakem kararı: BERABERLİK!'`;
    }
    // 2. Silah eşleşmelerine ve dövüş durumuna göre zengin edebi tasvirler
    let situationalText;
    if (situation === DrawSituation.WEAPON_LOCK) {
      situationalText = `${fighter1Name}'ın ${fighter1Weapon} silahı ile ${fighter2Name}'in ${fighter2Weapon} silahı çılgınca birbirine kenetlendi! Çeliğin ve tahtanın parçalandığı kargaşada iki dövüşçü de dermanı tükenerek dizlerinin üstüne çöktü. Hakemler araya girerek maçı BERABERLİKLE noktaladı!`;
    } else if (situation === DrawSituation.MUTUAL_EXHAUSTION) {
      situationalText = `Rauntlar boyunca süren kanlı boğuşmanın ardından ne ${fighter1Name} ne de ${fighter2Name} silahını kaldıracak takati bulabildi. Zırhları paramparça, solukları kesilmiş iki gladyatör de arenanın tahta parmaklıklarına yığılıp kaldı!`;
    } else if (situation === DrawSituation.DOUBLE_KNOCKOUT) {
      if (cat1 === WeaponCategory.BLUDGEON && cat2 === WeaponCategory.BLUDGEON) {
        situationalText = `${fighter1Name}'ın savurduğu ${fighter1Weapon} ile ${fighter2Name}'in ${fighter2Weapon} darbesi aynı salisede birbirlerinin kafasına indi! Kemik çatlamasıyla sarsılan arenada iki gladyatör de geriye doğru savrulup kumlara yığıldı! İkisi de kalkamadı!`;
      } else if (cat1 === WeaponCategory.CHAIN_MACE || cat2 === WeaponCategory.CHAIN_MACE) {
        situationalText = `Zincirler ve çelikler havada birbirine dolandı! ${fighter1Name} ve ${fighter2Name} ölümcül bir şiddetle birbirlerinin zırhını parçalayıp aynı anda yere çakıldı; kızgın kumlar iki gladyatörün de kanıyla sulandı!`;
      } else if (cat1 === WeaponCategory.CROSSBOW || cat2 === WeaponCategory.CROSSBOW) {
        situationalText = 'Arbaletin çelik oku hedefin göğsüne saplandığı anda, karşı tarafın son can havli darbesi nişancının üzerine bindi! İki dövüşçü de kumların ortasında hareketsiz kaldı!';
      } else if (cat1 === WeaponCategory.AXE || cat2 === WeaponCategory.AXE) {
        situationalText = `Nacak ve çelik birbirine kenetlenip iki savaşçının da zırhını yarıp geçti! Kemiklere dayanan ölümcül darbelerle ${fighter1Name} ve ${fighter2Name} aynı anda kumlara diz çöktü!`;
      } else if (cat1 === WeaponCategory.HEAVY_FALCHION || cat2 === WeaponCategory.HEAVY_FALCHION) {
        situationalText = 'Ağır palanın devasa kesiği ile karşı darbe aynı anda şakaklarda patladı! Çifte nakavtın şiddetiyle arenada nefesler tutuldu; iki cüsse birden kumlara devrildi!';
      } else if (cat1 === WeaponCategory.PIERCE && cat2 === WeaponCategory.PIERCE) {
        situationalText = `${fighter1Name} ${fighter1Weapon} saplamasıyla öne atılırken, ${fighter2Name} de can havliyle ${fighter2Weapon} silahını hasmının göğsüne daldırdı! Karşılıklı saplanan uçların ardından iki dövüşçü de nefes nefese kumlara kapaklandı!`;
      } else {
        situationalText = `${fighter1Name} ve ${fighter2Name} son nefesleriyle aynı anda hamle yaptı! Silahların eşzamanlı vuruşuyla iki gladyatör de kumların üzerine yüzükoyun kapaklandı. Kırlangıç Kasabası arenası tarihi bir çifte nakavta tanıklık etti!`;
      }
    }
    const announcerFlavor = kt.random([
      "Sunucu Tellal şaşkınlıkla trompeti çaldırıyor: 'İki canavar da aynı anda kumlara serildi! Hakem kararı: BERABERLİK!'",
      "Sunucu Tellal: 'Böylesi bir çifte nakavt Kırlangıç Kasabası tarihinde görülmedi! İki tarafa da 1'er lig puanı!'",
      'Tribünler donakaldı; ardından arenanın gördüğü en vahşi çifte nakavt için ayağa fırlayarak tezahürat yaptı!'
    ]);
    return `${situationalText}\n${announcerFlavor}`;
  },

  generateWolfRageNarrative(lifestealAmount) {
    return kt.random([
      `[AK AYAZ ÖFKESİ!] Kan kokusu burnuna doldukça içindeki aç kurt uyandı; aldığın yaralara aldırmadan öne atılıp hasmının canını emdin (+${lifestealAmount} Can)!`,
      `[AK AYAZ ÖFKESİ!] Ağır darbeler altında sendelemek yerine dişlerini sıktın! Kuzey ayazının vahşi hırıltısıyla savurduğun darbe rakibin etini biçti (+${lifestealAmount} Can)!`,
      `[AK AYAZ ÖFKESİ!] Gözlerin kurdun gözleri gibi kızıla çaldı; göğsündeki ayaz postu gerildi ve her vuruşun rakibin gücünü çalarak seni ayakta tuttu (+${lifestealAmount} Can)!`,
      `[AK AYAZ ÖFKESİ!] Ölümün soğuk nefesini hissettiğin anda bedenin vahşi bir refleksle kudurarak rakibin üzerine çullandı (+${lifestealAmount} Can)!`
    ]);
  },

  generateMeteorBurnNarrative(bonusDamage) {
    return kt.random([
      `[GÖKTAŞI HARI!] Palanın kabzasındaki kızıl filiz akkor gibi parladı; savrulan kıvılcımlar hasmın zırhını eritip etine yapıştı (+${bonusDamage} Alev Hasarı)!`,
      `[GÖKTAŞI HARI!] Namludan çıkan kükürtlü alev dalgası rakibin siperini kavurarak gardını düşürdü (+${bonusDamage} Alev Hasarı)!`,
      `[GÖKTAŞI HARI!] Gökyüzünden düşen krater taşının harı kılıcın ucunda çatırdadı; korlaşan çelik rakibin zırhını delip geçti (+${bonusDamage} Alev Hasarı)!`,
      `[GÖKTAŞI HARI!] Palanın kestiği yerden sızan kızıl alevler rakibin etini dağlayarak acı dolu bir feryat kopardı (+${bonusDamage} Alev Hasarı)!`
    ]);
  },

  generateSkillHitNarrative(attacker, defender, skill, event, damage, bodyPart, stance = CombatStance.BALANCED, tacticalPosition = CombatTacticalPosition.NEUTRAL, weapon = '') {
    const isCrit = event === CombatEvent.CRITICAL;
    const critBonusText = isCrit ? 've zırhı parçalayan YIKICI bir kritik darbe indirdi!' : 've savuşturulamaz bir darbe indirdi!';
    let positionContext;
    if (tacticalPosition === CombatTacticalPosition.ADVANTAGE) {
      positionContext = kt.random([
        'Hasmının sendelediği ve gardının çöktüğü o ölümcül saniyede,',
        `${defender}'ın dengesini yitirip savunmasız kaldığını gören ${attacker}, acımasız bir üstünlükle`,
        `Meydandaki üstünlüğü tamamen ele geçiren ${attacker}, rakibin açığını affetmeyerek`
      ]);
    } else if (tacticalPosition === CombatTacticalPosition.DESPERATION) {
      positionContext = kt.random([
        `Can havliyle köşeye sıkışan ve kumlara kan damlayan ${attacker}, son bir dirayetle`,
        `Ölümün soğuk nefesini ensesinde hisseden ${attacker}, tüm varlığını ortaya koyup`,
        `Kaybetmenin eşiğinde gözü kararan ${attacker}, son bir intikam darbesiyle`
      ]);
    } else if (tacticalPosition === CombatTacticalPosition.NEUTRAL) {
      if (stance === CombatStance.AGGRESSIVE) {
        positionContext = kt.random([
          `${attacker} gözü dönmüş bir hiddetle hücuma kalkıp`,
          `${attacker} arenadaki tozu dumana katan bir vahşetle`,
          `${attacker} gardını hiçe sayan yırtıcı bir atılımla`
        ]);
      } else if (stance === CombatStance.DEFENSIVE) {
        positionContext = kt.random([
          `${attacker} siperinin ardından cerrahi bir zamanlamayla sıyrılarak`,
          `${attacker} çelik gibi sağlam duruşunu bozmadan karşı hamleye geçip`,
          `${attacker} soğukkanlı adımlarla rakibin boşluğunu yakalayarak`
        ]);
      } else if (stance === CombatStance.OPPORTUNISTIC) {
        positionContext = kt.random([
          `${attacker} ${defender}'ın gardındaki en zayıf çatlağı sinsice kollayarak`,
          `${attacker} avını bekleyen bir çöl yırtıcısı gibi aniden fırlayıp`,
          `${attacker} hasmının göz bebeklerindeki tereddüdü fırsat bilerek`
        ]);
      } else if (stance === CombatStance.BALANCED) {
        positionContext = kt.random([
          `${attacker} dengeli ve temkinli adımlarla öne sürülüp`,
          `${attacker} arenanın merkezinde kusursuz bir ritim yakalayarak`,
          `${attacker} soğukkanlılığını koruyarak`
        ]);
      }
    }
    let customFighterFlavor;
    if (skill.id.startsWith('skill_morvath') || attacker.includes('Morvath')) {
      customFighterFlavor = kt.random([
        `Üç dilli çatal kargı kumlarda ıslık çalarak uzandı; şampiyonun eski süvari disiplini ${defender}'ın kaçış yollarını kilitledi!`,
        "Morvath'ın kargısı mesafeyi bir anda yuttu; Kırlangıç'ın namağlup şampiyonu hasmını adım adım biçmeye ant içmişti!",
        'Isırgan Otu unvanının hakkını veren Morvath, kargısının çatalıyla rakibin zırh bağlantılarını kesti!'
      ]);
    } else if (skill.id.startsWith('skill_thyra') || attacker.includes('Thyra')) {
      customFighterFlavor = kt.random([
        "Thyra'nın dağ kurdu klan narası arenanın taş surlarında yankılandı; çift ağızlı nacak havayı ikiye bölerek indi!",
        'Kuzeyin sarp dağlarından gelen vahşi bir öfkeyle haykıran Thyra, çelik baltasıyla arenanın zemin taşlarını çatlattı!',
        'Totem dövmeleri kan ter içinde parıldayan Thyra, kabile gazabıyla doğrudan kemiğe saldırdı!'
      ]);
    } else if (skill.id.startsWith('skill_ghorak') || attacker.includes('Ghorak')) {
      customFighterFlavor = kt.random([
        `Ghorak'ın bileğindeki 15 kiloluk pranga zinciri gaddar bir şakırtıyla savruldu; dikenli gülle ${defender}'ın siperini aştı!`,
        'Yirmi yıllık kürek mahkumu kaslarıyla zinciri savuran Ghorak, acıya zerre aldırmadan gülleyi çaktı!',
        'Paslı demir gülle havadaki tozu yararak bir kasırga gibi kumlara indi!'
      ]);
    } else if (skill.id.startsWith('skill_bregash') || attacker.includes('Bregash')) {
      customFighterFlavor = kt.random([
        'Bregash mezbaha palasını dipten yukarıya ters bir kavisle savurdu; et ve tendon deşen kasap tekniği dehşet saçtı!',
        `Ters pala aşağıdan yukarıya kavis çizerek ${defender}'ın böğrüne daldı; kurumuş kan lekeli önlük rüzgarda savruldu!`,
        'Bregash kısık bir kıkırdamayla palasını ters çevirip bir boğayı parçalar gibi yüklendi!'
      ]);
    } else if (skill.id.startsWith('skill_kaelen') || attacker.includes('Kaelen')) {
      customFighterFlavor = kt.random([
        'Kaelen göz bağının altından nefes seslerini dinledi; mekanik kundağın çarkı tıkırdadı ve çelik temren fırladı!',
        'Rüzgarın yönünü derisinde hisseden kör arbaletçi, milimetrik bir sezgiyle tetiğe bastı!',
        'Kundaktan çıkan ok vızıltısı kumlarda yankılandı; Kaelen hedefini gözüyle değil kulağıyla vurdu!'
      ]);
    } else if (skill.id.startsWith('skill_khorvash') || attacker.includes('Khorvash')) {
      customFighterFlavor = kt.random([
        `Khorvash ayak tabanlarıyla kumun titreşimini dinledi; kör iğneli kancası gölgeleri yararak ${defender}'a ulaştı!`,
        'Tuz çölünün kehanetini fısıldayan kör savaşçı, savurduğu oltayla hasmın etine kilitlendi!',
        'Tuz tozları kumlara saçılırken Khorvash sezgileriyle hedefini buldu!'
      ]);
    } else if (skill.id.startsWith('skill_zalmora') || attacker.includes("Zal'Mora")) {
      customFighterFlavor = kt.random([
        "Zal'Mora ağzındaki kor külü yere tükürüp bilenmiş boynuz hançeriyle gözü dönmüş bir hırsla atıldı!",
        'Yaralarını külle dağlayan vahşi köle, acıyı bir yakıt gibi kullanarak boynuz hançerini sapladı!',
        "Kül kokusu arenayı sararken Zal'Mora'nın boynuz ucu eti yırttı!"
      ]);
    } else if (skill.id.startsWith('skill_xylar') || attacker.includes('Xylar')) {
      customFighterFlavor = kt.random([
        'Xylar demir perçinli dişlerini gösterip sırıttı; çivili meşe tokmağını tüm gövde ağırlığıyla savurdu!',
        'Demir Diş lakaplı sokak gladyatörü, kaba kuvvetiyle tokmak darbesini göğse geçirdi!',
        'Çivili kütük haşin bir gıcırtıyla savrulurken Xylar keyifle kükredi!'
      ]);
    } else if (skill.id.startsWith('skill_vaelen') || attacker.includes('Vaelen')) {
      customFighterFlavor = kt.random([
        'Vaelen gölgelerin arasından akbaba gibi süzüldü; kavisli kancasını en hassas eklem noktasına taktı!',
        'Arenanın kurnaz bahisçisi Vaelen, tek bir ölümcül açık kollayıp kancasını savurdu!',
        'Akbaba kanadı gibi açılan pelerin savrulurken kancanın çentiği eti yakaladı!'
      ]);
    } else if (skill.id.startsWith('skill_orn') || attacker.includes('Orn')) {
      customFighterFlavor = kt.random([
        'Orn bataklık sazlıklarında kayan bir yılan gibi kumlarda süzüldü; çengelli avcı zıpkınını fırlattı!',
        'Bataklık zehriyle kaplı zıpkın ucu zırhı aşarken Orn sinsi bir tebessümle ipi gerdi!',
        'Sazlık avcısı, çengeli rakibin bacağına geçirip dengesini altüst etti!'
      ]);
    } else if (skill.id.startsWith('skill_sarkoth') || attacker.includes('Sarkoth')) {
      customFighterFlavor = kt.random([
        'Sarkoth kum fırtınası kaldırarak gözden kayboldu ve çift zehirli kamasını böğre sapladı!',
        'Çöl akrebi gibi sinsi ve sessiz sokulan Sarkoth, kemik kamalarıyla et deşti!',
        'Koyu sarı akrep zehri açılan yarıklara işlerken Sarkoth geriye doğru sıçradı!'
      ]);
    } else if (skill.id.startsWith('skill_player') || attacker.includes('Sürgün') || attacker.includes('Silahşör')) {
      customFighterFlavor = kt.random([
        `${attacker} sürgün günlerinden kalma tüm disiplinini ve dövüş içgüdülerini bu hamleye döktü!`,
        `${attacker} arenanın tozlu kumlarında kusursuz bir silahşör dengesi sergileyerek hücuma kalktı!`,
        `${attacker} hasmının her hareketini çözümleyerek diyarın kaderini değiştirecek bir sanat icra etti!`
      ]);
    } else {
      customFighterFlavor = null;
    }
    let skillPrefix;
    if (skill.type === SkillType.ATTACK) {
      skillPrefix = kt.random([
        `[${attacker}: ${skill.name.toUpperCase()}!] ${positionContext} öne atıldı; ${skill.description}`,
        `[${attacker}: ${skill.name.toUpperCase()}!] ${positionContext} ölümcül bir ivmeyle atıldı; ${skill.description}`,
        `[${attacker}: ${skill.name.toUpperCase()}!] ${positionContext} ${defender}'ın gardını delerek ${skill.name} hamlesini indirdi!`
      ]);
    } else if (skill.type === SkillType.DEFENSE) {
      skillPrefix = kt.random([
        `[${attacker}: ${skill.name.toUpperCase()}!] ${positionContext} geri adım atmak yerine karşı saldırıya geçti; ${skill.description}`,
        `[${attacker}: ${skill.name.toUpperCase()}!] ${positionContext} sağlam bir duruş sergileyip ${skill.description}`,
        `[${attacker}: ${skill.name.toUpperCase()}!] ${positionContext} çelik gibi sertleşip ${skill.name} ile hasmının dengesini sarstı!`
      ]);
    } else if (skill.type === SkillType.TACTICAL) {
      skillPrefix = kt.random([
        `[${attacker}: ${skill.name.toUpperCase()}!] ${positionContext} kumları yarıp göz açıp kapayıncaya dek ${skill.description}`,
        `[${attacker}: ${skill.name.toUpperCase()}!] ${positionContext} kör noktaya süzüldü; ${skill.description}`,
        `[${attacker}: ${skill.name.toUpperCase()}!] ${positionContext} taktiksel bir üstünlük kurarak ${skill.description}`
      ]);
    } else if (skill.type === SkillType.ULTIMATE) {
      skillPrefix = kt.random([
        `[NİHAİ SANAT: ${skill.name.toUpperCase()}!] ${positionContext} tüm varlığını bu vuruşa koydu; ${skill.description} Arenadaki toz bulutu ikiye ayrıldı!`,
        `[NİHAİ SANAT: ${skill.name.toUpperCase()}!] Arenayı titreten bir haykırışla ${positionContext} hasmının tepesine kabus gibi çöktü; ${skill.description}`,
        `[NİHAİ SANAT: ${skill.name.toUpperCase()}!] Seyircilerin nefesi kesildi; ${positionContext} ölümcül ${skill.name} sanatıyla kumlarda fırtına kopardı! ${skill.description}`
      ]);
    }
    const severity = TextTemplateEngine.calculateSeverity(damage, isCrit, 100);
    let effectText;
    if (severity === DamageSeverity.GLANCING) {
      effectText = `[${skill.combatEffect}] ${defender}'ın ${bodyPart.dativeSuffix} gelen darbe zırhı sıyırıp hafifçe sarstı. (-${damage} Can)`;
    } else if (severity === DamageSeverity.MODERATE) {
      effectText = `[${skill.combatEffect}] ${defender}'ın ${bodyPart.dativeSuffix} oturan darbe nefesini kesti! (-${damage} Can)`;
    } else if (severity === DamageSeverity.HEAVY) {
      effectText = `[${skill.combatEffect}] ${defender}'ın ${bodyPart.dativeSuffix} inen sert vuruş kaslarını ve kemiklerini sarstı! (-${damage} Can)`;
    } else if (severity === DamageSeverity.DEVASTATING) {
      effectText = `[${skill.combatEffect}] ${defender}'ın ${bodyPart.dativeSuffix} patlayan darbe kemikleri inletti, arenayı kana buladı! (-${damage} Can)`;
    }
    const customLine = customFighterFlavor != null ? `\n${customFighterFlavor}` : '';
    let flavor;
    if (kt.Random.nextInt(100) < 40) {
      flavor = '\n' + kt.random(([...TextTemplateEngine.crowdAtmospheres, ...TextTemplateEngine.announcerPhrases]));
    } else {
      flavor = '';
    }
    return `${skillPrefix} ${critBonusText}${customLine}\n${effectText}${flavor}`;
  },

  generateSkillDodgeNarrative(attacker, defender, skill, weapon) {
    let specificDodge;
    if (defender.includes('Khorvash')) {
      specificDodge = `Khorvash kör gözlerine rağmen kumdaki titreşimleri adımlarına uydurdu; bir derviş gibi dönerek ${skill.name} hamlesinin altından kaydı!`;
    } else if (defender.includes('Thyra')) {
      specificDodge = `Thyra vahşi bir kurt sıçrayışıyla geriye takla attı; ${skill.name} kumlara gömülürken gözlerindeki vahşet parıldadı!`;
    } else if (defender.includes('Morvath')) {
      specificDodge = `Morvath kargısının arkasına yaslanarak şampiyon adımlarıyla yana kaydı; ${skill.name} havayı biçmekten öteye gidemedi!`;
    } else if (defender.includes('Kaelen')) {
      specificDodge = `Kaelen kundağın sesini duyar duymaz kumlara yapıştı; ${skill.name} başlığının tüyünü sıyırıp boşa çıktı!`;
    } else if (defender.includes('Ghorak')) {
      specificDodge = `Ghorak zincirlerini çekip vücudunu geriye savurdu; ${skill.name} gülleye çarpıp kumlara sekti!`;
    } else {
      specificDodge = null;
    }
    return specificDodge ?? kt.random([
      `[${attacker}: ${skill.name.toUpperCase()} BOŞA ÇIKTI!] ${attacker} ${skill.name} hamlesiyle atıldı, fakat ${defender} bir derviş gibi dönerek sıyrıldı ve ${weapon} yalnızca havayı biçti!`,
      `[${attacker}: ${skill.name.toUpperCase()} ISKALANDI!] ${attacker}'ın büyük bir hırsla başlattığı ${skill.name} sanatı, ${defender}'ın olağanüstü refleksleri sayesinde kumlara gömüldü!`,
      `[${attacker}: ${skill.name.toUpperCase()} SAVUŞTURULDU!] ${defender} ${attacker}'ın ${skill.name} hazırlığını saniyeler öncesinden sezdi; son anda yana kayarak boşluğu kumlara bıraktı!`
    ]);
  },

  generateSkillBlockNarrative(attacker, defender, skill, weapon) {
    let specificBlock;
    if (defender.includes('Morvath')) {
      specificBlock = `Morvath üç ağızlı kargısını iki elle yatay kilitledi; ${skill.name} darbesi kargının sert çeliğinde patlayıp yana savruldu!`;
    } else if (defender.includes('Ghorak')) {
      specificBlock = 'Ghorak kalın pranga halkalarını kaldırıp darbeyi zincirlerin arasına sıkıştırdı; kıvılcımlar havaya saçıldı fakat çizik bile almadı!';
    } else if (defender.includes('Xylar')) {
      specificBlock = 'Xylar çivili meşe tokmağını kalkan gibi kaldırıp darbeyi göğüsledi; demir dişlerini göstererek sırıttı!';
    } else if (defender.includes('Bregash')) {
      specificBlock = `Bregash meşin kasap önlüğünü ve palasının geniş sırtını siper yaptı; ${skill.name} vuruşu tok bir sesle sönümlendi!`;
    } else {
      specificBlock = null;
    }
    return specificBlock ?? kt.random([
      `[${attacker}: ${skill.name.toUpperCase()} BLOKLANDI!] ${attacker} ${skill.name} ile kükreyerek yüklendi; ancak ${defender} kalkanını iki elle çakıp çeliğin patlamasını göğüsledi!`,
      `[${attacker}: ${skill.name.toUpperCase()} SİPERDEN DÖNDÜ!] ${skill.name} vuruşu ${defender}'ın ağır siperinde kıvılcımlarla yankılandı; kollar sarsıldı fakat siper delinmedi!`,
      `[${attacker}: ${skill.name.toUpperCase()} DURDURULDU!] ${attacker}'ın ölümcül ${skill.name} saldırısı ${defender}'ın kusursuz blok açısıyla sönümlendi!`
    ]);
  },

  generateLog(attacker, defender, weapon, event, bodyPart, damage, defenderHpLeft, stance = CombatStance.BALANCED) {
    return TextTemplateEngine.generateDetailedLog(attacker, defender, weapon, event, bodyPart, damage, defenderHpLeft, stance);
  },
};
TextTemplateEngine.crowdAtmospheres = [
  'Tribünlerden kan kokusu almış kurtlar gibi vahşi uğultular yükseliyor!',
  "Seyirciler ahşap parmaklıkları tekmeliyor: 'Yere ser onu! Acıma!'",
  'Kırlangıç Kasabası ve Taş Hisar halkı heyecandan ayaklandı, gözlerini kumdan ayıramıyorlar!',
  'Tribünlerin çığlıkları arenanın kızgın tozuna karışıyor; havada gerilim elle tutulacak gibi!',
  'Kasaba tüccarları parmaklıkların dibinde ellerindeki altın keselerini şıngırdatarak bağırıyor!',
  'Kumlara sıçrayan taze kan kokusu kalabalığın vahşi iştahını kabarttı!',
  'Çatılardaki kara kargalar arenanın üzerindeki toz bulutuna bakarak gaklıyor!',
  'Hancı ve aşçılar ellerindeki bezleri sallayarak kendi favori dövüşçülerine tezahürat yapıyor!',
  'Tribündeki demirciler iki savaşçının çelik kalitesini ve dövüş tekniğini hararetle tartışıyor!',
  'Kızgın güneş tepede yakıyor; arenanın tozu gladyatörlerin terli tenine yapışıyor!',
  'Taş Hisar garnizon nöbetçileri kılıçlarını kalkanlarına ritmik biçimde vurarak arenayı inletiyor!',
  'Locadaki asilzadeler şarap kadehlerini unutup parmaklıkların kenarına yığıldı!',
  'Seyirciler bir anlığına nefesini tuttu; arenada yalnızca çeliğin sürtünme sesi duyuluyor!',
  'Bahis tellalları kalabalığın arasında ter içinde koşuşturup oranları haykırıyor!',
  'Genç çıraklar heyecandan parmaklıkların üzerine tırmanıp bağırmaya başladı!',
  "Toz bulutunun ardından gelen metal çarpışması tribünlerden devasa bir 'Oooo!' kopardı!",
  'İki dövüşçünün çarpışmasıyla arenanın kumları havaya savrulurken seyirciler coşkuyla kükredi!',
  "'Bitir işini! Merhamet yok!' çığlıkları sur duvarlarından yankılanıyor!",
  'Kalabalık ayağa fırladı; iki tarafın destekçileri tribünlerde birbirine yumruk sallıyor!',
  'Kadife cübbeli hami tüccar, dövüşçüsü darbe alınca dişlerini sıkarak küfretti!',
  'Arenanın kum havuzuna bir sessizlik çöktü; ardından gök gürültüsü gibi bir alkış patladı!',
  'Seyircilerden biri arenaya bakır sikke fırlatarak vahşetin devam etmesini istedi!',
  'Ahşap tribün tahtaları yüzlerce insanın ayağını aynı anda vurmasıyla beşik gibi sallanıyor!',
  'Yaşlı bir eski gladyatör parmaklıklara yaslanıp dövüşçülerin ayak hareketlerini takdirle süzdü!',
  'Arenadaki gerilim o kadar yoğun ki havada uçan kum taneleri bile ateşe kesmiş gibi!'
];
TextTemplateEngine.announcerPhrases = [
  "Sunucu Tellal bağırıyor: 'Kumlar kızarıyor, işte arenaların gerçek vahşeti!'",
  "Sunucu Tellal: 'Bu darbenin yankısı Taş Hisar surlarından duyuldu! Nefesler tutuldu!'",
  "Sunucu Tellal: 'Gözlerinizi kırpmayın ey ahali! Biri bu kumların üstünde kalacak!'",
  "Sunucu Tellal borusunu üflüyor: 'İşte gerçek bir gladyatör hamlesi! Kan kumlara aktı!'",
  "Sunucu Tellal: 'Bahis oranları altüst oluyor baylar, kumlarda fırtına kopuyor!'",
  "Sunucu Tellal: 'Kimse bu vuruşun ağırlığını inkar edemez! Şampiyonlar çarpışıyor!'",
  "Sunucu Tellal: 'Diyarın kaderi bu kumların üzerinde çelikle yazılıyor!'",
  "Sunucu Tellal haykırıyor: 'Usta işi bir manevra! İki gladyatör de eceline meydan okuyor!'",
  "Sunucu Tellal: 'Bu vuruş demir zırhı bile kağıt gibi deler geçer! Devam edin!'",
  "Sunucu Tellal borazanına asılıyor: 'Halk kandan fazlasını istiyor, sanat istiyor!'",
  "Sunucu Tellal: 'Diz çöken kalkamaz! Gardınızı düşürmeyin!'",
  "Sunucu Tellal parmaklıkların tepesinden nida atıyor: 'İşte Diyarın en sert gladyatörleri!'",
  "Sunucu Tellal: 'Kumlar kanla sulanmadıkça bu meydandan çıkış yok!'",
  "Sunucu Tellal seyircilere dönüyor: 'Gördünüz mü o hamleyi? Kılıç havada ikiye bölündü sandım!'",
  "Sunucu Tellal: 'Rakipler nefes nefese, ama gözlerindeki avcı ateşi sönmedi!'",
  "Sunucu Tellal tellal borusunu çaldı: 'Dövüşün en kızgın dakikaları! Geri adım atan kaybeder!'",
  "Sunucu Tellal: 'Garnizonun taşları böyle bir hırsı nadir görmüştür!'",
  "Sunucu Tellal bağırıyor: 'Kader çarkı dönüyor, bir taraf tükenişin eşiğinde!'",
  "Sunucu Tellal: 'Ayakta kalan tarihe adını kazıyacak, düşen ise kumlara karışacak!'",
  "Sunucu Tellal feryat ediyor: 'Böyle bir çeviklik, böyle bir çelik savuruşu görülmedi!'"
];
TextTemplateEngine.sensoryAtmospheres = [
  'İki dövüşçünün nefes nefese solukları arenanın uğultusuna karışıyor.',
  'Çeliğin çeliğe sürttüğü an fırlayan kıvılcımlar havada sönüyor.',
  'Kumlardan kalkan kızıl toz bulutu görüşü zorlaştırıyor, iki savaşçı da avcı gibi birbirini süzüyor.',
  'Ter dövüşçülerin gözlerine akıyor; tek bir göz kırpışı bile ölümcül olabilir.',
  'Kumlara damlayan kan damlaları sıcak toprakta anında kuruyup koyu lekelere dönüşüyor.',
  'Ağır adımların altında ezilen kumlar çıtırdıyor, iki taraf da bir sonraki hamleyi hesaplıyor.',
  'Meşalelerden yükselen reçine ve is kokusu, arenanın demir ve ter kokusuna karışıyor.',
  'Kas gerilmeleri ve eklemlerin çıtırtısı iki adım öteden duyulacak kadar net.',
  'Rüzgar sur menfezlerinden ıslıkla esip gladyatörlerin cübbelerini savuruyor.',
  'İki savaşçının gözlerindeki ölümcül odaklanma, etraftaki tüm gürültüyü sessizliğe gömüyor.',
  'Kalkanlardan kopan meşe kıymıkları havada uçuşup kumlara saçılıyor.',
  'Zırh perçinlerinin birbirine çarpma sesi metalik bir ritim tutturmuş gibi.',
  'Her iki dövüşçünün de ciğerleri körük gibi inip kalkıyor; yorgunluk iradeyle bastırılıyor.',
  'Havada keskin bir demir ve ozon kokusu asılı kaldı.',
  'Ayakların kaydığı zemin dengenin her an yitirilebileceğini hatırlatıyor.',
  'Kılıcın kabzasına yapışan kanlı avuç içi kaymayı engellemek için daha da sıkılıyor.',
  'Toz perdesinin arasından parlayan çeliğin soğuk ışıltısı tehditkar bir kobra gibi görünüyor.',
  'Hasmının hırıltılı nefesini yüzünde hisseden savaşçı soğukkanlılığını korumaya çalışıyor.',
  'Darbenin oluşturduğu şok dalgası arenanın taş duvarlarında eko yapıyor.',
  'Gladyatörlerin etrafında dönen gölgeler batan güneşin altında kızıla çalıyor.'
];

export const DrawSituation = kt.defineEnum('DrawSituation', {
  DOUBLE_KNOCKOUT: {},
  WEAPON_LOCK: {},
  MUTUAL_EXHAUSTION: {},
});

