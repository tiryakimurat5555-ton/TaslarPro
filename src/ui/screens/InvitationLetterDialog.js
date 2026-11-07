// KT/ui/screens/InvitationLetterDialog.kt
import React, { useEffect } from 'react';
import { AlertDialog, Btn, Column, Divider, Spacer, Surface, T, announce } from '../kit.js';
import { AmberGold, AmberGoldDark, AmberGoldLight, DarkBg, DarkSurface, DarkSurfaceCard, TextGold, TextLight, TextMuted, Typography, alpha } from '../theme.js';

export function InvitationLetterDialog({ onDismiss }) {
  const letterTalkBackDescription =
    'Resmi Başkent Fermanı Bildirimi! ' +
    "Kırlangıç Kasabası'ndaki sürgünlüğün resmen bitti. " +
    'Taş Hisar Garnizonu Kumandanı Lord Vaelin tarafından onaylanmış geçiş fermanını aldın. ' +
    "Artık Taş Hisar Garnizonu'na seyahat edebilir ve Diyar Haritası'ndan inceleyebilirsin. " +
    'Kapatmak için Fermanı Kabul Et butonuna basınız.';

  // Kotlin'de bütün pencere bu açıklamayla tek parçaydı. Burada açılışta duyurulur; mektup metni ve düğme
  // ayrıca gezilebilir kalır (düğme erişilemez olmasın diye).
  useEffect(() => {
    announce(letterTalkBackDescription);
  }, []);

  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      confirm={
        <Btn
          onPress={onDismiss}
          color={AmberGold}
          contentColor={DarkBg}
          radius={8}
          style={{ alignSelf: 'stretch', flex: 1, minHeight: 46 }}
          label="Fermanı koynuna yerleştir ve kabul et"
        >
          <T weight="bold" size={13} color={DarkBg} align="center">
            📜 Fermanı Kabul Et ve Maceraya Devam Et
          </T>
        </Btn>
      }
      title={
        <Column align="center" style={{ alignSelf: 'stretch' }} label={letterTalkBackDescription} heading>
          <T style={Typography.titleMedium} weight="black" color={AmberGold} letterSpacing={1.5}>
            📜 RESMİ GEÇİŞ FERMANI
          </T>
          <Spacer h={2} />
          <T size={12} color={TextMuted} italic>
            Başkent Garnizon Kumandanlığı Mührü
          </T>
        </Column>
      }
      text={
        <Column gap={10} style={{ alignSelf: 'stretch' }}>
          <Surface color={DarkSurfaceCard} radius={8} borderColor={AmberGoldDark} borderWidth={1}>
            <Column pad={14} gap={8}>
              <T size={13} color={TextLight} lineHeight={19}>
                Kırlangıç Kasabası'nın kanlı çukurundaki zaferlerin ve çetin rakipler karşısındaki sarsılmaz iraden, Taş Hisar Garnizonu Kumandanlığı'nın dikkatini çekti!
              </T>
              <Divider color={alpha(AmberGoldDark, 0.5)} thickness={1} />
              <T size={12} color={TextGold} italic lineHeight={18}>
                {"\"Ey güneyin sürgün evladı;\n\nKırlangıç'ın bataklık çukurunda döktüğün ter ve aldığın her yara, seni bu topraklara köle değil, gerçek bir silahşör yaptı. Kasabanın sınırları senin için artık dar geliyor.\n\nBu fermanla birlikte sürgünlüğün resmi olarak kaldırılmış; Taş Hisar Garnizonu'na (Bölge 2) giriş hakkın ve fırtınalı kıyı surlarına giden kervan geçiş iznin tasdik edilmiştir.\n\nLord Kumandan Vaelin\""}
              </T>
              <Divider color={alpha(AmberGoldDark, 0.5)} thickness={1} />
              <T size={12} color={AmberGoldLight} weight="medium">
                💡 İpucu: Artık Bölge ekranındaki '🗺️ Diyar Haritası' sekmesinden Taş Hisar Garnizonu'nu ve mekanlarını dinleyip inceleyebilirsin.
              </T>
            </Column>
          </Surface>
        </Column>
      }
    />
  );
}
