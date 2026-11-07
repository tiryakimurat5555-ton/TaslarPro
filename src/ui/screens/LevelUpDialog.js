// KT/ui/screens/LevelUpDialog.kt
import React, { useEffect } from 'react';
import { AlertDialog, Btn, Column, Row, Spacer, Surface, T, announce } from '../kit.js';
import { AmberGold, AmberGoldDark, DarkBg, DarkBorder, DarkSurface, DarkSurfaceCard, ExpBlue, HealthGreen, TextGold, TextLight, TextMuted, alpha } from '../theme.js';

export function LevelUpDialog({ event, onDismiss }) {
  const talkBackDescription =
    `Tebrikler! Seviye atladın ve seviye ${event.newLevel} oldun. ` +
    `Artı ${event.healthGained} Maksimum Can, artı ${event.damageGained} Saldırı Hasarı, ` +
    `artı ${event.armorGained} Zırh, artı ${event.speedGained} Hız kazandın. ` +
    `Yeni maksimum canın ${event.newMaxHealth}. Devam etmek için Tamam düğmesine basınız.`;

  // Pencere açılınca VoiceOver özeti hemen okusun.
  useEffect(() => {
    announce(talkBackDescription);
  }, [talkBackDescription]);

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
          style={{ alignSelf: 'stretch', flex: 1, minHeight: 44 }}
          label="Tamam, seviye atlama penceresini kapat ve maceraya devam et"
        >
          <T weight="bold" size={14} color={DarkBg}>
            Tamam (Maceraya Devam Et)
          </T>
        </Btn>
      }
      title={
        <Column align="center" style={{ alignSelf: 'stretch' }}>
          <T heading weight="extrabold" size={20} color={TextGold}>
            🎉 SEVİYE ATLADIN! 🎉
          </T>
          <Spacer h={4} />
          <Surface radius={6} color={alpha(AmberGoldDark, 0.25)} borderColor={AmberGold} borderWidth={1}>
            <T weight="bold" size={13} color={AmberGold} style={{ paddingHorizontal: 10, paddingVertical: 3 }}>
              {`Seviye ${event.oldLevel} ➔ Seviye ${event.newLevel}`}
            </T>
          </Surface>
        </Column>
      }
      text={
        <Column gap={8} style={{ alignSelf: 'stretch' }} label={talkBackDescription}>
          <T size={13} color={TextLight} lineHeight={18}>
            Diyardaki amansız mücadelen meyvesini verdi. Vücudun çelikleşti, reflekslerin keskinleşti:
          </T>
          <Spacer h={4} />
          <Surface radius={8} color={DarkSurfaceCard} borderColor={DarkBorder} borderWidth={1} style={{ alignSelf: 'stretch' }}>
            <Column pad={12} gap={6}>
              <StatBonusRow icon="❤️" label="Maksimum Can" bonus={`+${event.healthGained}`} extra={`(Yeni: ${event.newMaxHealth})`} color={HealthGreen} />
              <StatBonusRow icon="⚔️" label="Saldırı Hasarı" bonus={`+${event.damageGained}`} extra="" color={AmberGold} />
              <StatBonusRow icon="🛡️" label="Zırh & Koruma" bonus={`+${event.armorGained}`} extra="" color={ExpBlue} />
              <StatBonusRow icon="⚡" label="Hız & Çeviklik" bonus={`+${event.speedGained}`} extra="" color={TextGold} />
            </Column>
          </Surface>
          <Spacer h={4} />
          <Surface radius={6} color={DarkBg} style={{ alignSelf: 'stretch' }}>
            <Row pad={8} justify="between">
              <T size={11} color={TextMuted}>
                📖 Sonraki Seviye:
              </T>
              <T size={11} weight="bold" color={ExpBlue}>
                {`${event.nextLevelExp} EXP gerekli`}
              </T>
            </Row>
          </Surface>
        </Column>
      }
    />
  );
}

function StatBonusRow({ icon, label, bonus, extra, color }) {
  return (
    <Row justify="between" style={{ alignSelf: 'stretch' }}>
      <Row>
        <T size={14} hidden>
          {icon}
        </T>
        <Spacer w={6} />
        <T size={12} color={TextLight} weight="medium">
          {label}
        </T>
      </Row>
      <Row>
        <T size={12} weight="bold" color={color}>
          {bonus}
        </T>
        {extra.length > 0 ? (
          <>
            <Spacer w={4} />
            <T size={11} color={TextMuted}>
              {extra}
            </T>
          </>
        ) : null}
      </Row>
    </Row>
  );
}
