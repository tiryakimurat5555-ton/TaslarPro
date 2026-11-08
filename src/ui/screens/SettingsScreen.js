// KT/ui/screens/SettingsScreen.kt karşılığı: ses ve müzik ayarları.
import React, { useState } from 'react';
import * as kt from '../../kt.js';
import { R } from '../../R.js';
import { SoundManager } from '../../audio/SoundManager.js';
import { Screen, Column, Row, Surface, Card, Spacer, T, Btn, OutlinedBtn, IconBtn, Toggle, Slider, Scroll, Gorsel } from '../kit.js';
import { AmberGold, DarkBg, DarkBorder, DarkSurface, DarkSurfaceCard, TextGold, TextLight, TextMuted, alpha } from '../theme.js';

/** (v * 100).toInt() — kayan nokta hatası 28,999.. gibi değer vermesin */
function yuzde(v) {
  return kt.toInt(v * 100 + 1e-6);
}

export function SettingsScreen({ onNavigateBack, modifier }) {
  const [bgmVol, setBgmVol] = useState(SoundManager.bgmVolume);
  const [sfxVol, setSfxVol] = useState(SoundManager.sfxVolume);
  const [bgmEnabled, setBgmEnabled] = useState(SoundManager.isBgmEnabled);
  const [sfxEnabled, setSfxEnabled] = useState(SoundManager.isSfxEnabled);
  const [crowdVol, setCrowdVol] = useState(SoundManager.crowdVolume);
  const [crowdEnabled, setCrowdEnabled] = useState(SoundManager.isCrowdEnabled);

  return (
    <Screen bg={DarkBg} style={modifier}>
      {/* Üst çubuk (TopAppBar) */}
      <Row color={DarkSurface} gap={8} style={{ alignSelf: 'stretch', paddingHorizontal: 8, paddingVertical: 6, minHeight: 56 }}>
        <IconBtn label="Geri dön, ana menüye döner" onPress={onNavigateBack}>
          <Gorsel ad="patika" boyut={22} renk={AmberGold} />
        </IconBtn>
        <Gorsel ad="ayarlar" boyut={22} renk={AmberGold} />
        <T heading color={TextGold} weight="bold" size={20}>
          Oyun Ayarları
        </T>
      </Row>

      <Scroll pad={16} gap={18}>
        {/* MÜZİK AYARLARI */}
        <Card color={DarkSurface} radius={12} borderColor={DarkBorder} borderWidth={1} style={{ alignSelf: 'stretch' }}>
          <Column pad={16}>
            <Row justify="between" style={{ alignSelf: 'stretch' }}>
              <Row gap={8}>
                <Gorsel ad="lir" boyut={24} renk={AmberGold} />
                <T heading size={16} weight="bold" color={TextGold}>
                  Arka Plan Müziği
                </T>
              </Row>
              <Toggle
                value={bgmEnabled}
                onChange={(checked) => {
                  setBgmEnabled(checked);
                  SoundManager.setBgmEnabled(checked);
                }}
                label={bgmEnabled ? 'Arka plan müziği açık, kapatmak için dokunun' : 'Arka plan müziği kapalı, açmak için dokunun'}
              />
            </Row>

            <Spacer h={12} />

            <T size={13} color={TextLight} hidden>
              {`Müzik Ses Seviyesi: %${yuzde(bgmVol)}`}
            </T>

            <Slider
              value={bgmVol}
              onChange={(newVal) => {
                setBgmVol(newVal);
                SoundManager.setBgmVolume(newVal);
              }}
              min={0}
              max={1}
              step={0.05}
              disabled={!bgmEnabled}
              color={AmberGold}
              label="Müzik ses seviyesi"
              valueText={`yüzde ${yuzde(bgmVol)}`}
              style={{ marginTop: 6 }}
            />
          </Column>
        </Card>

        {/* SES EFEKTLERİ AYARLARI */}
        <Card color={DarkSurface} radius={12} borderColor={DarkBorder} borderWidth={1} style={{ alignSelf: 'stretch' }}>
          <Column pad={16}>
            <Row justify="between" style={{ alignSelf: 'stretch' }}>
              <Row gap={8}>
                <Gorsel ad="boru" boyut={24} renk={AmberGold} />
                <T heading size={16} weight="bold" color={TextGold}>
                  Ses Efektleri (SFX)
                </T>
              </Row>
              <Toggle
                value={sfxEnabled}
                onChange={(checked) => {
                  setSfxEnabled(checked);
                  SoundManager.setSfxEnabled(checked);
                }}
                label={sfxEnabled ? 'Ses efektleri açık, kapatmak için dokunun' : 'Ses efektleri kapalı, açmak için dokunun'}
              />
            </Row>

            <Spacer h={12} />

            <T size={13} color={TextLight} hidden>
              {`Efekt Ses Seviyesi: %${yuzde(sfxVol)}`}
            </T>

            <Slider
              value={sfxVol}
              onChange={(newVal) => {
                setSfxVol(newVal);
                SoundManager.setSfxVolume(newVal);
              }}
              min={0}
              max={1}
              step={0.05}
              disabled={!sfxEnabled}
              color={AmberGold}
              label="Efekt ses seviyesi"
              valueText={`yüzde ${yuzde(sfxVol)}`}
              style={{ marginTop: 6 }}
            />

            <Spacer h={8} />

            <OutlinedBtn onPress={() => SoundManager.playSfx(R.raw.dovusbasla)} disabled={!sfxEnabled} radius={8} style={{ alignSelf: 'stretch' }} gorsel="kilic-carpisma" gorselRenk={sfxEnabled ? AmberGold : alpha(AmberGold, 0.4)}>
              <T color={sfxEnabled ? AmberGold : alpha(AmberGold, 0.4)}>Efekt Sesini Test Et</T>
            </OutlinedBtn>
          </Column>
        </Card>

        {/* ARENA SEYİRCİ SESİ (8 Kasım) */}
        <Card color={DarkSurface} radius={12} borderColor={DarkBorder} borderWidth={1} style={{ alignSelf: 'stretch' }}>
          <Column pad={16}>
            <Row justify="between" style={{ alignSelf: 'stretch' }}>
              <Row gap={8} style={{ flexShrink: 1 }}>
                <Gorsel ad="arena" boyut={24} renk={AmberGold} />
                <T heading size={16} weight="bold" color={TextGold} style={{ flexShrink: 1 }}>
                  Arena Seyirci Sesi
                </T>
              </Row>
              <Toggle
                value={crowdEnabled}
                onChange={(checked) => {
                  setCrowdEnabled(checked);
                  SoundManager.setCrowdEnabled(checked);
                }}
                label={crowdEnabled ? 'Arena seyirci sesi açık, kapatmak için dokunun' : 'Arena seyirci sesi kapalı, açmak için dokunun'}
              />
            </Row>

            <Spacer h={6} />
            <T size={12} color={TextLight} lineHeight={17}>
              Arenadaki dövüş boyunca tribünlerin uğultusu. Hamle efektleri çalarken kendiliğinden kısılır.
            </T>

            <Slider
              value={crowdVol}
              onChange={(newVal) => {
                setCrowdVol(newVal);
                SoundManager.setCrowdVolume(newVal);
              }}
              min={0}
              max={1}
              step={0.05}
              disabled={!crowdEnabled}
              color={AmberGold}
              label="Seyirci ses seviyesi"
              valueText={`yüzde ${yuzde(crowdVol)}`}
              style={{ marginTop: 10 }}
            />
          </Column>
        </Card>

        {/* ERİŞİLEBİLİRLİK & BİLGİ KARTI */}
        <Card color={DarkSurfaceCard} radius={12} borderColor={DarkBorder} borderWidth={1} style={{ alignSelf: 'stretch' }}>
          <Column pad={16}>
            <Row gap={8}>
              <Gorsel ad="bilgi" boyut={20} renk={AmberGold} />
              <T heading weight="bold" size={14} color={TextGold} style={{ flexShrink: 1 }}>
                Ses & Erişilebilirlik Hakkında
              </T>
            </Row>
            <Spacer h={6} />
            <T size={12} color={alpha(TextLight, 0.85)} lineHeight={18}>
              Oyun içi müzikler ve ses efektleri VoiceOver ve TalkBack ekran okuyucularıyla tam uyumludur. Dövüş naraları, dükkan kapıları, zar ve ödül sesleri görsel öğelere ek olarak anlık işitsel geri bildirim sağlar.
            </T>
          </Column>
        </Card>

        <Spacer h={12} />

        <Btn onPress={onNavigateBack} color={AmberGold} contentColor={DarkBg} radius={10} style={{ alignSelf: 'stretch', minHeight: 46 }} gorsel="patika" gorselRenk={DarkBg} textSize={15}>
          <T weight="bold" size={15} color={DarkBg}>
            Ayarları Kaydet ve Geri Dön
          </T>
        </Btn>

        {/* Simge lisansı (CC BY 3.0 atıf zorunluluğu) */}
        <Row gap={8} align="start" style={{ alignSelf: 'stretch', paddingHorizontal: 4 }}>
          <Gorsel ad="tuy-kalem" boyut={16} renk={TextMuted} style={{ marginTop: 1 }} />
          <T size={11} color={TextMuted} lineHeight={16} style={{ flex: 1 }}>
            Simgeler: game-icons.net, CC BY 3.0 lisansıyla. Çizerler: Lorc, Delapouite, Skoll, Sbed, Carl Olsen, Caro Asercion, Cathelineau, Darkzaitzev, Faithtoken, Lucasms, Sparker, Willdabeast, Zeromancer.
          </T>
        </Row>
      </Scroll>
    </Screen>
  );
}
