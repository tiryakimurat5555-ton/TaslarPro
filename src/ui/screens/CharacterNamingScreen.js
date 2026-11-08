// KT/ui/screens/CharacterNamingScreen.kt karşılığı: Karakter Adı Belirleme Ekranı (Prologue sonrası & Ana Oyun öncesi).
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import * as kt from '../../kt.js';
import { SoundManager } from '../../audio/SoundManager.js';
import { Screen, Column, Row, Box, Surface, Card, Spacer, T, Btn, Chip, Field, Scroll } from '../kit.js';
import { AmberGold, AmberGoldDark, DarkBg, DarkBorder, DarkSurface, DarkSurfaceCard, TextGold, TextLight, TextMuted, HealthGreen, alpha } from '../theme.js';

const suggestions = ['Alaz', 'Bora', 'Demir', 'Poyraz', 'Gölge', 'Kuzgun', 'Tarkan', 'Volkan'];

export function CharacterNamingScreen({ currentName, onConfirmName, modifier }) {
  const [enteredName, setEnteredName] = useState(currentName !== 'Sürgün Silahşör' ? currentName || '' : '');

  const submit = () => {
    Keyboard.dismiss();
    const kirpik = enteredName.trim();
    const finalName = kirpik.length === 0 ? 'Sürgün Silahşör' : kirpik;
    SoundManager.playLetterSound();
    onConfirmName(finalName);
  };

  const oneriCipi = (sug) => {
    const secili = enteredName === sug;
    return (
      <Chip
        key={sug}
        selected={secili}
        onPress={() => {
          setEnteredName(sug);
          SoundManager.playPageTurnSound(false);
        }}
        selectedColor={AmberGold}
        color={DarkSurfaceCard}
        style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 4, minHeight: 40 }}
      >
        <T size={11} weight="bold" color={secili ? DarkBg : TextLight} align="center">
          {sug}
        </T>
      </Chip>
    );
  };

  return (
    <Screen bg={DarkBg} style={modifier}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Scroll pad={20} contentStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Spacer h={20} />

          {/* Üst İkon & Başlık Alanı */}
          <Surface hidden radius={16} color={alpha(AmberGoldDark, 0.2)} borderColor={AmberGold} borderWidth={2} align="center" justify="center" style={{ width: 76, height: 76 }}>
            
          </Surface>

          <Spacer h={18} />

          <T heading size={24} weight="black" color={AmberGold} letterSpacing={2} align="center">
            DİYARIN SAVAŞÇISI
          </T>
          <T size={14} weight="medium" color={TextLight} align="center">
            Kumlara Kazınacak Adını Belirle
          </T>

          <Spacer h={22} />

          {/* Parşömen Temalı Arka Plan Hikayesi */}
          <Card color={DarkSurface} radius={12} borderColor={DarkBorder} borderWidth={1.5} style={{ alignSelf: 'stretch' }}>
            <Column pad={16}>
              <T size={15} weight="bold" color={TextGold}>
                Sürgünün Yeni Kimliği
              </T>
              <Spacer h={8} />
              <T size={13} color={TextLight} lineHeight={19}>
                Güneyden sürülüp Kırlangıç Kasabası'nın nemli zindan çukuruna atıldın. Burada ne eski sülalelerin hükmü var ne de kaybettiğin altınların... Arenanın kızgın kumlarında tellalların haykıracağı, demircinin kılıcına nakşedeceği ve rakiplerinin korkuyla anacağı adın nedir?
              </T>
            </Column>
          </Card>

          <Spacer h={24} />

          {/* İsim Yazma Alanı */}
          <Column style={{ alignSelf: 'stretch' }} gap={4}>
            <T size={12} color={AmberGold} hidden>
              Savaşçı Adın
            </T>
            <Field
              value={enteredName}
              onChange={(it) => {
                if (it.length <= 22) setEnteredName(it);
              }}
              label={`Savaşçı adı giriş kutusu. Şu anki değer: ${enteredName.length === 0 ? 'Boş bırakılırsa Sürgün Silahşör' : enteredName}`}
              placeholder="Örn: Alaz, Bora, Demir..."
              maxLength={22}
              autoCapitalize="words"
              onSubmit={submit}
              style={{ color: '#FFFFFF', borderColor: enteredName.length > 0 ? AmberGold : DarkBorder }}
            />
          </Column>

          <Row justify="between" style={{ alignSelf: 'stretch', paddingTop: 4, paddingRight: 4 }}>
            <T size={11} color={kt.isBlank(enteredName) ? TextMuted : HealthGreen} style={{ flex: 1 }}>
              {kt.isBlank(enteredName) ? "Boş bırakılırsa 'Sürgün Silahşör' kullanılır" : 'Bu isimle anılacaksın'}
            </T>
            <T size={11} color={TextMuted} label={`${enteredName.length} / 22 karakter`}>
              {`${enteredName.length}/22`}
            </T>
          </Row>

          <Spacer h={18} />

          {/* Hızlı İsim Önerileri */}
          <T heading size={12} weight="semibold" color={TextLight} style={{ alignSelf: 'flex-start' }}>
            Hızlı İsim Önerileri
          </T>
          <Spacer h={8} />

          <Row gap={6} style={{ alignSelf: 'stretch' }}>
            {kt.take(suggestions, 4).map(oneriCipi)}
          </Row>
          <Spacer h={6} />
          <Row gap={6} style={{ alignSelf: 'stretch' }}>
            {kt.drop(suggestions, 4).map(oneriCipi)}
          </Row>

          <Spacer h={30} />

          {/* Onay & Başla Butonu */}
          <Btn
            label="Kaydet ve arenaya adım at butonu. Savaşçı adını kaydeder ve oyunu başlatır."
            onPress={submit}
            color={AmberGold}
            contentColor={DarkBg}
            radius={12}
            style={{ alignSelf: 'stretch', minHeight: 52 }}
          >
            <T size={15} weight="bold" color={DarkBg} align="center">
              Bu Adla Kumları Titret (Oyuna Başla)
            </T>
          </Btn>

          <Spacer h={24} />
        </Scroll>
      </KeyboardAvoidingView>
    </Screen>
  );
}
