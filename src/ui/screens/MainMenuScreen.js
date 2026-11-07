// KT/ui/screens/MainMenuScreen.kt karşılığı: ana menü (arka plan görseli, oyun adı, Yeni Oyun / Devam Et / Ayarlar).
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { R } from '../../R.js';
import { SoundManager } from '../../audio/SoundManager.js';
import { Box, Column, Row, Spacer, T, Btn, OutlinedBtn, Ikon, Img, Gradient, AlertDialog } from '../kit.js';
import { AmberGold, AmberGoldDark, AmberGoldLight, DarkBg, DarkSurface, TextGold, TextLight, TextMuted, HealthGreen, HealthRed, Color, alpha, color } from '../theme.js';

// Kotlin'deki altın-kırmızı gradyan fırçası metne uygulanamadığı için: altın yazı + koyu bordo gölge
const BASLIK_RENGI = color(0xffd4af37);
const BASLIK_GOLGESI = { textShadowColor: color(0xff8b0000), textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 3 };

export function MainMenuScreen({ viewModel, onStartNewGame, onContinueGame, onOpenSettings, modifier }) {
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
  const [hasSave, setHasSave] = useState(() => {
    try {
      return viewModel.hasSaveFile() === true;
    } catch (e) {
      return false;
    }
  });

  // Kayıt denetimi eşzamansız olabilir (AsyncStorage); sonucu bekle
  useEffect(() => {
    let iptal = false;
    Promise.resolve()
      .then(() => viewModel.hasSaveFile())
      .then((v) => {
        if (!iptal) setHasSave(!!v);
      })
      .catch(() => {});
    return () => {
      iptal = true;
    };
  }, [viewModel]);

  // Ana Menü Müziği
  useEffect(() => {
    SoundManager.playBgm(R.raw.anamuzik, true);
  }, []);

  const yeniOyun = () => {
    if (hasSave) {
      setShowOverwriteDialog(true);
    } else {
      Promise.resolve(viewModel.startNewGame(false)).then(() => onStartNewGame());
    }
  };

  const devamEt = () => {
    Promise.resolve(viewModel.loadGame()).then((ok) => {
      if (ok) onContinueGame();
    });
  };

  return (
    <Box fill color={DarkBg} style={modifier}>
      {/* Arka Plan Görseli (Dikey Karanlık Gladyatör Sanatı) */}
      <Img source={R.drawable.main_menu_bg} resizeMode="cover" style={StyleSheet.absoluteFill} />

      {/* Karartma ve Renk Geçiş Katmanı (Yazı ve Butonların Okunabilirliği İçin) */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Gradient colors={[color(0xe60d0b0e), color(0x99171216), color(0xcc0d0b0e), color(0xfa080608)]} style={StyleSheet.absoluteFill} />
      </View>

      {/* Menü İçerik Alanı */}
      <SafeAreaView style={{ flex: 1 }}>
        <Column fill align="center" justify="between" style={{ paddingHorizontal: 24, paddingVertical: 20 }}>
          {/* 1. ÜST KISIM: OYUN ADI */}
          <Column heading align="center" label="Oyun Başlığı: Silahşör, Diyarın Kaderi" style={{ alignSelf: 'stretch', paddingTop: 28 }}>
            <T size={38} weight="black" letterSpacing={4} align="center" color={BASLIK_RENGI} style={BASLIK_GOLGESI}>
              SİLAHŞÖR
            </T>
            <Spacer h={4} />
            <T size={20} weight="bold" letterSpacing={3} align="center" color={BASLIK_RENGI} style={BASLIK_GOLGESI}>
              DİYARIN KADERİ
            </T>
            <Spacer h={8} />
            <T size={12} weight="medium" letterSpacing={1} color={alpha(AmberGoldLight, 0.85)} align="center">
              Gladyatör Arenası & Hayatta Kalma Serüveni
            </T>
          </Column>

          {/* 2. ORTA/ALT KISIM: MENÜ BUTONLARI */}
          <Column gap={14} align="center" style={{ alignSelf: 'stretch' }}>
            {/* YENİ OYUN BUTONU */}
            <Btn label="Yeni Oyun Başlat" onPress={yeniOyun} color={AmberGold} contentColor={DarkBg} radius={12} style={{ alignSelf: 'stretch', height: 52 }}>
              <Ikon name="PlayArrow" size={24} color={DarkBg} />
              <T size={16} weight="bold" letterSpacing={1} color={DarkBg}>
                YENİ OYUN
              </T>
            </Btn>

            {/* DEVAM ET BUTONU (Sadece Kayıt Varsa Görünür) */}
            {hasSave ? (
              <Btn label="Kayıtlı oyuna devam et" onPress={devamEt} color={HealthGreen} contentColor={Color.White} radius={12} style={{ alignSelf: 'stretch', height: 52 }}>
                <Ikon name="Refresh" size={22} color={Color.White} />
                <T size={15} weight="bold" letterSpacing={1} color={Color.White}>
                  DEVAM ET (Kayıttan Yükle)
                </T>
              </Btn>
            ) : null}

            {/* AYARLAR BUTONU */}
            <OutlinedBtn label="Ses ve Oyun Ayarları" onPress={onOpenSettings} borderColor={AmberGoldDark} borderWidth={1.5} contentColor={TextGold} radius={12} style={{ alignSelf: 'stretch', height: 50 }}>
              <Ikon name="Settings" size={20} color={AmberGold} />
              <T size={14} weight="semibold" letterSpacing={1} color={TextGold}>
                AYARLAR (SES & MÜZİK)
              </T>
            </OutlinedBtn>

            <Spacer h={6} />

            {/* ALT BİLGİ VE SÜRÜM */}
            <T size={11} color={TextMuted} align="center">
              v2.0 • Görme Engelli & Ekran Okuyucu Dostu Yapım
            </T>
          </Column>
        </Column>
      </SafeAreaView>

      {/* KAYITLI OYUN VARKEN YENİ OYUN UYARI MODALI */}
      {showOverwriteDialog ? (
        <AlertDialog
          onDismiss={() => setShowOverwriteDialog(false)}
          containerColor={DarkSurface}
          title={
            <T heading color={TextGold} weight="bold" size={18}>
              ⚠️ Kayıtlı Oyun Bulunuyor
            </T>
          }
          text={
            <T color={TextLight} size={14} lineHeight={20}>
              {'Daha önceden kaydedilmiş bir ilerlemeniz bulunmaktadır.\n\nYeni bir oyuna başlarsanız mevcut kayıtlı karakteriniz ve gün ilerlemeniz tamamen silinecektir. Devam etmek istiyor musunuz?'}
            </T>
          }
          confirm={
            <Btn
              color={HealthRed}
              contentColor={Color.White}
              onPress={() => {
                setShowOverwriteDialog(false);
                Promise.resolve(viewModel.startNewGame(true)).then(() => onStartNewGame());
              }}
            >
              <T weight="bold" color={Color.White}>
                Evet, Sil ve Başlat
              </T>
            </Btn>
          }
          dismiss={
            <OutlinedBtn onPress={() => setShowOverwriteDialog(false)}>
              <T color={TextGold}>Vazgeç</T>
            </OutlinedBtn>
          }
          style={{ borderRadius: 14 }}
        />
      ) : null}
    </Box>
  );
}
