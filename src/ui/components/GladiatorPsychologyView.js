// KT/ui/components/GladiatorPsychologyView.kt
/**
 * Gladyatörün ve karakterin 7 temel psikolojik eğilim barını ve karar zekasını görselleştiren kart.
 */
import React from 'react';
import { View } from 'react-native';
import { Column, Gorsel, GorselRozet, Row, Spacer, Surface, T } from '../kit.js';
import * as kt from '../../kt.js';
import { AmberGold, AmberGoldDark, AmberGoldLight, DarkBg, DarkBorder, DarkSurfaceCard, TextGold, TextLight, TextMuted, alpha, color } from '../theme.js';

export function GladiatorPsychologyCard({ psychology, style }) {
  const kaos = kt.coerceIn(kt.idiv(psychology.wildInstinct, 4), 5, 25);
  const ittifak = psychology.evaluateAllianceOffer(50).title;
  const sandik = psychology.evaluateLootDilemma(true, 50).title;
  const kriz = psychology.evaluateCrisisResponse(50).title;
  return (
    <Column gap={10} style={[{ alignSelf: 'stretch' }, style]}>
      {/* Üst Özet: Mizaç Rozeti & Baskın Karakterler */}
      <Surface
        radius={8}
        color={color(0xff1e1a16)}
        borderColor={alpha(AmberGold, 0.5)}
        borderWidth={1}
        style={{ alignSelf: 'stretch' }}
        label={`Zihin ve Psikolojik Mizaç: ${psychology.behavioralBadge}. Kaos Payı: yüzde ${kaos}`}
      >
        <Row justify="between" style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
          <GorselRozet ad="ucuncu-goz" boyut={38} renk={AmberGoldLight} />
          <Spacer w={10} />
          <Column style={{ flex: 1 }}>
            <T size={11} weight="bold" color={AmberGoldLight}>
              Zihin & Psikolojik Mizaç
            </T>
            <T size={13} weight="extrabold" color={TextGold}>
              {psychology.behavioralBadge}
            </T>
          </Column>
          <Surface radius={4} color={DarkBg} borderColor={alpha(AmberGoldDark, 0.4)} borderWidth={1}>
            <T size={10} weight="semibold" color={color(0xffffb74d)} style={{ paddingHorizontal: 6, paddingVertical: 3 }}>
              {`Kaos Payı: %${kaos}`}
            </T>
          </Surface>
        </Row>
      </Surface>

      {/* 7 Temel Karakteristik Seviye Barı */}
      <Surface radius={8} color={DarkSurfaceCard} borderColor={DarkBorder} borderWidth={1} style={{ alignSelf: 'stretch' }}>
        <Column pad={10} gap={8}>
          <PsychologyStatBar title="Sadakat & Dostluk" value={psychology.loyalty} icon="kalkan" barColor={color(0xff2ecc71)} description={getLoyaltySummary(psychology.loyalty)} />
          <PsychologyStatBar title="İhanet & Kalleşlik Riski" value={psychology.treachery} icon="hancer" barColor={color(0xffe74c3c)} description={getTreacherySummary(psychology.treachery)} />
          <PsychologyStatBar title="Çıkar & Bencillik" value={psychology.pragmatism} icon="para-kesesi" barColor={color(0xfff1c40f)} description={getPragmatismSummary(psychology.pragmatism)} />
          <PsychologyStatBar title="Hırs & İhtiras" value={psychology.ambition} icon="simsek" barColor={color(0xffab47bc)} description={getAmbitionSummary(psychology.ambition)} />
          <PsychologyStatBar title="Onur & Gurur" value={psychology.pride} icon="defne" barColor={color(0xff42a5f5)} description={getPrideSummary(psychology.pride)} />
          <PsychologyStatBar title="Boşvermişlik & Kayıtsızlık" value={psychology.apathy} icon="uykulu" barColor={color(0xff90a4ae)} description={getApathySummary(psychology.apathy)} />
          <PsychologyStatBar title="Vahşi İçgüdü (Kaotik Dürtü)" value={psychology.wildInstinct} icon="ayak-izi" barColor={color(0xffff7043)} description={getInstinctSummary(psychology.wildInstinct)} />
        </Column>
      </Surface>

      {/* Alt Kart: Labirent Karar Eğilimleri Özeti */}
      <Surface radius={8} color={color(0xff171513)} borderColor={alpha(AmberGoldDark, 0.4)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
        <Column pad={10} gap={4}>
          <Row gap={6}>
            <Gorsel ad="labirent" boyut={16} renk={AmberGold} />
            <T size={11} weight="bold" color={AmberGold} heading>
              Labirent & Saha Karar Eğilimi
            </T>
          </Row>
          <Row gap={6} align="start">
            <Gorsel ad="el-sikisma" boyut={14} renk={AmberGoldLight} />
            <T size={10} color={TextLight} style={{ flex: 1 }}>{`• İttifak Tutumu: ${ittifak}`}</T>
          </Row>
          <Row gap={6} align="start">
            <Gorsel ad="sandik" boyut={14} renk={AmberGoldLight} />
            <T size={10} color={TextLight} style={{ flex: 1 }}>{`• Sandık Açıldığında: ${sandik}`}</T>
          </Row>
          <Row gap={6} align="start">
            <Gorsel ad="can-arti" boyut={14} renk={AmberGoldLight} />
            <T size={10} color={TextLight} style={{ flex: 1 }}>{`• Müttefik Canı Düşünce: ${kriz}`}</T>
          </Row>
        </Column>
      </Surface>
    </Column>
  );
}

function PsychologyStatBar({ title, value, icon, barColor, description }) {
  const clampedValue = kt.coerceIn(value, 0, 100);
  const fraction = kt.coerceIn(clampedValue / 100, 0.03, 1);
  return (
    <Column style={{ alignSelf: 'stretch' }} label={`${title}: yüzde ${clampedValue}. ${description}`}>
      <Row justify="between">
        <Row gap={4}>
          <Gorsel ad={icon} boyut={16} renk={barColor} />
          <T size={11} weight="semibold" color={TextLight}>
            {title}
          </T>
        </Row>
        <T size={11} weight="bold" color={barColor}>
          {`%${clampedValue}`}
        </T>
      </Row>
      <Spacer h={3} />
      {/* İlerleme Çubuğu */}
      <View style={{ alignSelf: 'stretch', height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: color(0xff100f0d) }}>
        <View style={{ width: `${fraction * 100}%`, height: '100%', borderRadius: 3, backgroundColor: barColor }} />
      </View>
      <Spacer h={2} />
      <T size={9} color={TextMuted} italic lineHeight={12}>
        {description}
      </T>
    </Column>
  );
}

function getLoyaltySummary(v) {
  if (v >= 80) return 'Yoldaşını canı pahasına savunur, ihanetten nefret eder.';
  if (v >= 50) return 'İttifaka saygılıdır; tehlike büyüse de hemen satmaz.';
  if (v >= 30) return 'Gevşek sadakat; zora düşerse ilk fırsatta bağı koparır.';
  return 'Sadakat tanımaz; herkes onun için harcanabilir bir piyondur.';
}

function getTreacherySummary(v) {
  if (v >= 75) return 'Tehlikeli fırsatçı! Avantaj gördüğü an sırtından hançerler.';
  if (v >= 50) return 'Kendi çıkarı zora girdiğinde kalleşlik yapabilir.';
  if (v >= 25) return 'Düşük ihanet riski; mecbur kalmadıkça arkadan vurmaz.';
  return 'Asla kalleşlik yapmaz; arkadan vurmayı onursuzluk sayar.';
}

function getPragmatismSummary(v) {
  if (v >= 80) return 'Soğuk hesapçı. Kararlarını kâr-zarar hesabıyla alır.';
  if (v >= 50) return 'Dengeli; kârlı iş birliklerine ve uzlaşmaya açıktır.';
  return 'Çıkardan ziyade onur, hırs ya da dürtülerle hareket eder.';
}

function getAmbitionSummary(v) {
  if (v >= 85) return 'Gözü dönmüş bir şampiyonluk ve zafer açlığı taşır.';
  if (v >= 50) return 'Kazanmak ve yükselmek ister, ancak körü körüne risk almaz.';
  return 'Mütevazı; zirve tutkusu ya da güç açlığı düşüktür.';
}

function getPrideSummary(v) {
  if (v >= 85) return 'Kibir ve onur abidesi! Aşağılanmaya asla tahammülü yoktur.';
  if (v >= 50) return 'Öz saygısı yüksektir, mertçe ve dürüst dövüşü tercih eder.';
  return 'Onur umurunda değildir; kazanmak için her hileye başvurabilir.';
}

function getApathySummary(v) {
  if (v >= 80) return 'Tam bir vurdumduymaz; hayatı, ölümü ve parayı umursamaz.';
  if (v >= 50) return 'Ağırkanlı ve sakin; paniklemez, olayları akışına bırakır.';
  return 'Aşırı duyarlı, gergin ve her kıpırtıya anında tepki verir.';
}

function getInstinctSummary(v) {
  if (v >= 80) return 'Yabani dürtülerle hareket eder; mantık dinlemez, kaotiktir.';
  if (v >= 50) return 'Tehlike anında içgüdülerine kulak verir.';
  return 'Disiplinli, soğukkanlı ve planlı hareket eder.';
}
