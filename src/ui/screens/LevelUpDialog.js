// KT/ui/screens/LevelUpDialog.kt
import React, { useEffect } from 'react';
import { AlertDialog, Btn, Column, Gorsel, GorselRozet, Row, Spacer, Surface, T, announce } from '../kit.js';
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
          gorsel="patika"
        >
          <T weight="bold" size={14} color={DarkBg}>
            Tamam (Maceraya Devam Et)
          </T>
        </Btn>
      }
      title={
        <Column align="center" style={{ alignSelf: 'stretch' }}>
          <GorselRozet ad="seviye" boyut={56} renk={TextGold} kenar={AmberGold} zemin={alpha(AmberGoldDark, 0.3)} />
          <Spacer h={8} />
          <T heading weight="extrabold" size={20} color={TextGold}>
            SEVİYE ATLADIN!
          </T>
          <Spacer h={4} />
          <Surface radius={6} color={alpha(AmberGoldDark, 0.25)} borderColor={AmberGold} borderWidth={1}>
            <Row gap={6} style={{ paddingHorizontal: 10, paddingVertical: 3 }}>
              <Gorsel ad="yukselt" boyut={16} renk={AmberGold} />
              <T weight="bold" size={13} color={AmberGold}>
                {`Seviye ${event.oldLevel} ➔ Seviye ${event.newLevel}`}
              </T>
            </Row>
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
              <StatBonusRow icon="can" label="Maksimum Can" bonus={`+${event.healthGained}`} extra={`(Yeni: ${event.newMaxHealth})`} color={HealthGreen} />
              <StatBonusRow icon="kilic" label="Saldırı Hasarı" bonus={`+${event.damageGained}`} extra="" color={AmberGold} />
              <StatBonusRow icon="kalkan" label="Zırh & Koruma" bonus={`+${event.armorGained}`} extra="" color={ExpBlue} />
              <StatBonusRow icon="hiz" label="Hız & Çeviklik" bonus={`+${event.speedGained}`} extra="" color={TextGold} />
            </Column>
          </Surface>
          <Spacer h={4} />
          <Surface radius={6} color={DarkBg} style={{ alignSelf: 'stretch' }}>
            <Row pad={8} justify="between">
              <Row gap={6}>
                <Gorsel ad="yildiz-madalya" boyut={16} renk={ExpBlue} />
                <T size={11} color={TextMuted}>
                  Sonraki Seviye:
                </T>
              </Row>
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
        <Gorsel ad={icon} boyut={20} renk={color} />
        <Spacer w={8} />
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
