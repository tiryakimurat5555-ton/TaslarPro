// KT/ui/screens/StoryIntroScreen.kt karşılığı: 6 sayfalık önsöz (prolog). Metinler aynen.
// VoiceOver: her sayfa değişiminde odak yeni sayfanın başlığına taşınır (sayfanın çevrildiği anlaşılsın).
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, AccessibilityInfo, findNodeHandle, Platform } from 'react-native';
import { Data } from '../../kt.js';
import { R } from '../../R.js';
import { SoundManager } from '../../audio/SoundManager.js';
import { Screen, Column, Row, Box, Surface, Card, Spacer, T, Btn, OutlinedBtn, TextBtn, Divider, Scroll, announce } from '../kit.js';
import { AmberGold, AmberGoldDark, DarkBg, DarkBorder, DarkSurface, DarkSurfaceCard, TextGold, TextLight, TextMuted, HealthRed, Color, Typography, alpha } from '../theme.js';

export class StoryPage extends Data {
  static T = 'StoryPage';
  static defaults() {
    return { chapterRoman: undefined, title: undefined, subtitle: undefined, paragraphs: undefined, quote: null };
  }
}
Data.register(StoryPage);

export const PROLOGUE_PAGES = [
  new StoryPage({
    chapterRoman: 'I',
    title: 'Portakal Çiçekleri ve Güney Güneşi',
    subtitle: 'Sıcak topraklar, köklü bir sülale ve tasasız bir haylazlık...',
    paragraphs: [
      'Güney eyaletlerinin kızgın güneşi altında, zeytin ağaçları ve mis kokulu portakal bahçeleri arasında büyüdün. Doğduğun andan beri etrafındaki herkes senin geleceğini fısıldayıp durdu. Zira ailen, güney şehirlerinin köklü ve kabadayı gladyatör geleneklerine sımsıkı bağlıydı; hatta sülalenin uzak kollarından gelen bazı amcaların ve teyzelerin kadim ateş tılsımlarıyla, gizemli mühürlerle uğraştığı söylenirdi.',
      'Gelgelelim sen ne sert kalkanların arkasına sığınacak kadar ağırbaşlıydın, ne de parşömenler başında mum eritecek kadar sabırlı. Kanın sıcaktı; insanlarla hemen kaynaşıverir, herkesle laflar, aklına eseni pat diye söyleyiverirdin. Patavatsızlığın ve yerinde duramayan haylazlığın, sülalenin o asık suratlı dövüş ustalarını çıldırtmaya yetip de artıyordu bile.',
    ],
    quote: '"Dövüşmek mi? Hayat limon şerbeti içip güneşte uzanmak varken neden birinin kafasına tokmak savurayım ki?"',
  }),
  new StoryPage({
    chapterRoman: 'II',
    title: 'Dövüş Okuluna Heves ve Sakarlıklar',
    subtitle: 'Tahta kılıçlar, dağılan dikkat ve bitmeyen kahkahalar...',
    paragraphs: [
      "Fakat bir gün kentin o heybetli Dövüş Akademisi'nin önünden geçerken, açık kapıdan yükselen çelik şakırtıları ve çırakların naraları içinde tuhaf, açıklayamadığın bir kıvılcım çaktı. 'Acaba ben de ailem gibi bir silahşör olabilir miyim?' hevesiyle kapıdan adımını attın.",
      'Lakin akademi hayatı tam bir felaketler silsilesi oldu. Sabahın köründe yapılan katı duruş talimleri, saatlerce kalkan arkasında heykel gibi bekleme cezaları senin kıpır kıpır doğana tamamen tersti. Hocaların en ciddi anlarında patavatsızca araya girip espri patlatıyor, tahta kılıçları savururken dengeni kaybedip eğitmenlerin ayağına yuvarlanıyordun. Odaklanma eksikliğin yüzünden düşe kalka bir şeyler öğrenmeye çalışsan da, akademinin katı disiplini seni her gün biraz daha boğuyordu.',
    ],
    quote: '"Ustam valla kılıcı bilerek fırlatmadım elinizdeki çorba tasına! Sadece savurma açısını fazla geniş tutmuşum..."',
  }),
  new StoryPage({
    chapterRoman: 'III',
    title: 'Büyük Skandal ve Sürgün Fermanı',
    subtitle: 'Bir gece yarısı kaçamağı, devrilen bir zırh ve kapanan kapılar...',
    paragraphs: [
      "Ve nihayet o meşhur talihsiz gece patlak verdi. Arkadaşlarına hava atmak ve akademinin o boğucu havasını dağıtmak için, yasaklı Baş Muhafız Kulesi'ne gizlice tırmanmaya kalktın. Amacın ustaların özel baharatlı kiler şarabından birkaç yudum aşırmaktı.",
      'Lakin karanlıkta ayağın bir kargıya takıldı; koca bir vitrin dolusu tören zırhı takır tukur merdivenlerden aşağı yuvarlandı, devasa alarm çanı gece yarısı tüm kenti ayağa kaldırdı! Sabah kurulan divanda baş eğitmenin öfkesi kılıcından daha keskindi. Ailenin de artık sabrı tükenmişti. Karar kesindi: Bu iflah olmaz patavatsız derhal akademiden atılacak ve güney topraklarının sınırları dışına sürülecekti.',
    ],
    quote: '"Kapı yüzüme öyle bir sertlikle kapandı ki, surların tozu üzerime yağdı. Cebimde beş para yoktu ama içimde tuhaf bir hürriyet hissi vardı."',
  }),
  new StoryPage({
    chapterRoman: 'IV',
    title: 'Sokaklar, Boş Cepler ve Tuzak',
    subtitle: 'Yolların tozu, han bulaşıkları ve sinsice yaklaşan zincirler...',
    paragraphs: [
      'Kuzeyin soğuk rüzgarlarına doğru aç biilaç geçen aylar... Kimi zaman hanların arka avlusunda bir tas arpa çorbasına döküntü bulaşık yıkadın, kimi zaman samanlıklarda titreyerek sabahladın. O içindeki sıcaklığı, insanlarla konuşma arzusunu hiç kaybetmedin; sokakta kime denk gelsen derdini dinledin, neşeni korumaya çalıştın.',
      "Fakat dünyanın acımasızlığı senin saflığını affetmedi. Bir akşamüstü köhne bir handa, 'Kuzey kervanına neşeli bir muhafız arıyoruz, bol et ve altın var' diyen süslü bir tüccara inandın. İçtiğin şarapta acı bir kekrelik vardı... Gözlerini açtığında boynunda soğuk, paslı bir tasma; bileklerinde ise birbirine perçinlenmiş ağır köle zincirleri vardı.",
    ],
    quote: '"Güvenmek benim hatamdı belki. Ama o tüccarın yüzünü hafızama öyle bir kazıdım ki, bir gün o zincirleri onun boynuna dolayacağım."',
  }),
  new StoryPage({
    chapterRoman: 'V',
    title: "Kırlangıç Kasabası'nın Nemli Çukuru",
    subtitle: 'Demir kafesli bir araba, bataklık kokusu ve zindanın soğuk taşı...',
    paragraphs: [
      'Haftalarca süren o sarsıntılı, karanlık yolculuğun sonunda kafes kapağı tekmeyle açıldı. Burnuna çarpan ilk şey; çürümüş sazlıkların, bayat yağmurun ve sidikle karışık bataklık çamurunun iğrenç kokusuydu. Burası sınır boyunun en izbe, kanunsuz sığınağıydı: Kırlangıç Kasabası.',
      'Muhafızlar seni taş merdivenlerden aşağı, arenanın zindan çukuruna fırlattı. Ağır demir parmaklıklar yüzüne kapandı. Çukur arenanın kumları hemen yukarıdaydı; her gün yukarıdan gelen kılıç şakırtıları, vahşi tezahüratlar ve kumlara dökülen kanın fısıltısı hücrenin tavanından damlıyordu. Artık bir mahkûmdun; ya kumların üzerinde parçalanacaktın ya da bir mucize yaratacaktın.',
    ],
    quote: '"Nemli taşa sırtımı yasladığımda anladım: Buradan çıkmanın tek bir yolu vardı. Kaçmak değil... Kumların üzerindeki herkesi dize getirmek."',
  }),
  new StoryPage({
    chapterRoman: 'VI',
    title: 'Külden Doğan Savaşçı Ateşi',
    subtitle: 'Gözlerdeki eski tebessüm, bu kez çelik bir iradeyle bileniyor...',
    paragraphs: [
      'Parmaklıkların ardından yukarı baktığında, çukur arenanın kanlı kumlarını ve orayı titreten gladyatörleri gördün. O güneyin sıcakkanlı, patavatsız ve neşeli çocuğu hala kalbinde bir yerlerde nefes alıyordu; insanlara düşman değildin. Fakat artık içindeki o dağınık heves, yerini kor gibi yanan bir azme bırakmıştı.',
      "Burada şakaya yer yoktu. Düşe kalka salladığın tahta kılıçların yerini artık gerçek çelik alacaktı. Demirci Zaven'in ocağından çıkan demiri kuşanacak, Simyacı Elora'nın merhemiyle yaralarını saracak ve bu çukurun şampiyonlarını tek tek dize getireceksin. Özgürlüğünü kimse sana altın tepside vermeyecek; onu kılıcının ucuyla söke söke alacaksın!",
    ],
    quote: '"Benim adım henüz bu kumların dilinde yok. Ama yemin olsun, Kırlangıç Kasabası adımı haykırana kadar o kılıç kınına girmeyecek!"',
  }),
];

export function StoryIntroScreen({ onFinishStory, modifier }) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = PROLOGUE_PAGES[currentPageIndex];
  const scrollRef = useRef(null);
  const baslikRef = useRef(null);
  const sonSayfa = currentPageIndex === PROLOGUE_PAGES.length - 1;

  // Ekran açılışında hikaye müziğini başlat ve açılış sayfa sesini çal
  useEffect(() => {
    SoundManager.playBgm(R.raw.hikayegiris, true);
    SoundManager.playPageTurnSound(true);
  }, []);

  // Sayfa her değiştiğinde scroll'u başa sar; VoiceOver odağını yeni sayfanın başlığına taşı
  useEffect(() => {
    try {
      if (scrollRef.current) scrollRef.current.scrollTo({ y: 0, animated: false });
    } catch (e) {}
    const sayfa = PROLOGUE_PAGES[currentPageIndex];
    const duyuru = `Sayfa ${currentPageIndex + 1} / ${PROLOGUE_PAGES.length}. Bölüm ${sayfa.chapterRoman}: ${sayfa.title}`;
    const zaman = setTimeout(() => {
      let odaklandi = false;
      try {
        const dugum = baslikRef.current ? findNodeHandle(baslikRef.current) : null;
        if (dugum && AccessibilityInfo.setAccessibilityFocus) {
          AccessibilityInfo.setAccessibilityFocus(dugum);
          odaklandi = Platform.OS === 'ios' || Platform.OS === 'android';
        }
      } catch (e) {}
      if (!odaklandi) announce(duyuru);
    }, 450);
    return () => clearTimeout(zaman);
  }, [currentPageIndex]);

  const nextPage = () => {
    if (currentPageIndex < PROLOGUE_PAGES.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      SoundManager.playPageTurnSound(false);
    } else {
      SoundManager.stopBgm();
      onFinishStory();
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      SoundManager.playPageTurnSound(false);
    }
  };

  const skipStory = () => {
    SoundManager.stopBgm();
    onFinishStory();
  };

  const baslikEtiketi = `Sayfa ${currentPageIndex + 1} / ${PROLOGUE_PAGES.length}. Bölüm ${currentPage.chapterRoman}: ${currentPage.title}. ${currentPage.subtitle}`;

  return (
    <Screen bg={DarkBg} style={modifier}>
      <Column fill pad={16}>
        {/* Üst Bar: Başlık, Sayfa Sayacı ve Hikayeyi Geç Butonu */}
        <Row justify="between" style={{ alignSelf: 'stretch' }}>
          <Column>
            <T size={11} weight="bold" color={AmberGold} letterSpacing={1.5}>
              KADERİN BAŞLANGICI
            </T>
            <T size={13} weight="semibold" color={TextGold}>
              {`Sayfa ${currentPageIndex + 1} / ${PROLOGUE_PAGES.length}`}
            </T>
          </Column>

          <TextBtn label="Hikayeyi doğrudan geç ve oyuna başla" onPress={skipStory}>
            <T size={12} weight="bold" color={TextMuted}>
              Hikayeyi Geç
            </T>
          </TextBtn>
        </Row>

        <Spacer h={10} />

        {/* Sayfa İlerleme Çizgisi (dekoratif; sayfa sayacı yukarıda okunur) */}
        <Row gap={6} hidden style={{ alignSelf: 'stretch', paddingVertical: 4 }}>
          {PROLOGUE_PAGES.map((_, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                backgroundColor: index === currentPageIndex ? AmberGold : index < currentPageIndex ? AmberGoldDark : DarkSurfaceCard,
              }}
            />
          ))}
        </Row>

        <Spacer h={12} />

        {/* Ana Hikaye Parşömen Kartı */}
        <Card color={DarkSurface} radius={12} borderColor={AmberGoldDark} borderWidth={1.5} style={{ flex: 1, alignSelf: 'stretch' }}>
          <Scroll ref={scrollRef} gap={14} pad={20}>
            {/* Bölüm Numarası ve Başlığı (VoiceOver odağı sayfa değişince buraya gelir) */}
            <View ref={baslikRef} accessible accessibilityRole="header" accessibilityLabel={baslikEtiketi}>
              <T size={12} weight="bold" color={AmberGold} letterSpacing={2}>
                {`BÖLÜM ${currentPage.chapterRoman}`}
              </T>
              <Spacer h={4} />
              <T style={Typography.titleLarge} weight="bold" color={TextGold}>
                {currentPage.title}
              </T>
              <Spacer h={2} />
              <T size={12} color={TextMuted} italic>
                {currentPage.subtitle}
              </T>
            </View>

            <Divider color={alpha(AmberGoldDark, 0.4)} thickness={1} />

            {/* Paragraflar */}
            {currentPage.paragraphs.map((paragraph, i) => (
              <T key={i} style={Typography.bodyLarge} color={alpha(TextLight, 0.92)} lineHeight={23} size={14}>
                {paragraph}
              </T>
            ))}

            {/* Vurgulu Karakter Alıntısı (Eğer varsa) */}
            {currentPage.quote != null ? (
              <>
                <Spacer h={6} />
                <Surface radius={8} color={DarkSurfaceCard} borderColor={alpha(AmberGold, 0.5)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
                  <T size={13} weight="medium" italic color={TextGold} lineHeight={20} style={{ padding: 14 }}>
                    {currentPage.quote}
                  </T>
                </Surface>
              </>
            ) : null}
          </Scroll>
        </Card>

        <Spacer h={14} />

        {/* Alt Butonlar (Geri / Sayfayı Çevir / Oyuna Başla) */}
        <Row gap={10} style={{ alignSelf: 'stretch' }}>
          {currentPageIndex > 0 ? (
            <OutlinedBtn label="Önceki sayfaya dön" onPress={prevPage} borderColor={DarkBorder} contentColor={TextLight} radius={8} style={{ flex: 0.8, height: 46 }}>
              <T weight="semibold" size={13} color={TextLight}>
                ← Önceki
              </T>
            </OutlinedBtn>
          ) : null}

          <Btn
            label={sonSayfa ? 'Kırlangıç Arenasına Adım At ve oyunu başlat' : 'Sonraki sayfaya geç'}
            onPress={nextPage}
            color={sonSayfa ? HealthRed : AmberGold}
            contentColor={sonSayfa ? Color.White : DarkBg}
            radius={8}
            style={{ flex: currentPageIndex > 0 ? 1.2 : 1, height: 46 }}
          >
            <T weight="bold" size={14} color={sonSayfa ? Color.White : DarkBg} align="center">
              {sonSayfa ? 'Kırlangıç Arenasına Adım At' : 'Sayfayı Çevir →'}
            </T>
          </Btn>
        </Row>
      </Column>
    </Screen>
  );
}
