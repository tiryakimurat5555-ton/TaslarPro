// KT/ui/screens/MainScreen.kt karşılığı: oyun içi kabuk (üst durum çubuğu, alt sekme çubuğu, sekme müzikleri,
// seviye atlama / davet mektubu pencereleri, gün geçişi örtüsü, bildirim çubuğu).
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import * as kt from '../../kt.js';
import { R } from '../../R.js';
import { SoundManager } from '../../audio/SoundManager.js';
import { Screen, Column, Row, Box, Surface, Spacer, T, IconBtn, Tabs, Spinner, SnackHost, showSnack, announce, useFlow, Gorsel, GorselRozet } from '../kit.js';
import { bolgeGorseli, nitelikGorseli } from '../gorsel-esleme.js';
import { AmberGold, AmberGoldDark, DarkBg, DarkBorder, DarkSurface, TextGold, TextLight, HealthGreen, FamePurple, Typography, alpha, color } from '../theme.js';
import { InventoryScreen } from './InventoryScreen.js';
import { HomeScreen } from './HomeScreen.js';
import { ArenaScreen } from './ArenaScreen.js';
import { RegionScreen } from './RegionScreen.js';
import { QuestScreen } from './QuestScreen.js';
import { LevelUpDialog } from './LevelUpDialog.js';
import { InvitationLetterDialog } from './InvitationLetterDialog.js';

export const NavigationTab = kt.defineEnum('NavigationTab', {
  INVENTORY: { title: 'Çanta', icon: 'Shield', gorsel: 'canta' },
  HOME: { title: 'Ev', icon: 'Home', gorsel: 'ev' },
  ARENA: { title: 'Arena', icon: 'SportsKabaddi', gorsel: 'arena' },
  REGION: { title: 'Bölge', icon: 'Explore', gorsel: 'pusula' },
  QUESTS: { title: 'Görevler', icon: 'Assignment', gorsel: 'tomar' },
});

const GUN_GECISI_ETIKETI = 'Yeni güne geçiliyor. Gece çöküyor ve şafak söküyor, lütfen bekleyiniz.';

export function MainScreen({ gameViewModel, onReturnToMainMenu = () => {} }) {
  const [currentTab, setCurrentTab] = useState(NavigationTab.INVENTORY);
  const player = useFlow(gameViewModel.player);
  const dayState = useFlow(gameViewModel.dayState);
  const uiMessage = useFlow(gameViewModel.uiMessage);
  const levelUpEvent = useFlow(gameViewModel.levelUpEvent);
  const isFighting = useFlow(gameViewModel.isFighting);
  const combatResult = useFlow(gameViewModel.combatResult);
  const isSpectating = useFlow(gameViewModel.isSpectating);
  const spectatorResult = useFlow(gameViewModel.spectatorResult);
  const isCombatActive = isFighting || combatResult != null || isSpectating || spectatorResult != null;
  const isDayTransitioning = useFlow(gameViewModel.isDayTransitioning);
  const invitationLetterEvent = useFlow(gameViewModel.invitationLetterEvent);

  // Sekmeler ve Durumlara Göre Arka Plan Müziği (BGM)
  useEffect(() => {
    if (isCombatActive) {
      // Dövüş müziği dövüş başlatıldığında çalınır ve dövüş ekranı kapanana kadar döngüsel devam eder
      return;
    }
    switch (currentTab) {
      case NavigationTab.ARENA:
        SoundManager.playBgm(R.raw.arena, true);
        break;
      case NavigationTab.REGION:
        SoundManager.playBgm(R.raw.bolge, true);
        break;
      case NavigationTab.QUESTS:
        SoundManager.playBgm(R.raw.gorevler, true);
        break;
      case NavigationTab.INVENTORY:
        SoundManager.playBgm(R.raw.envanter, true);
        break;
      case NavigationTab.HOME:
        SoundManager.playBgm(R.raw.ev, true);
        break;
    }
  }, [currentTab, isCombatActive]);

  // Bildirim çubuğu (Snackbar): showSnack VoiceOver'a da okutur
  useEffect(() => {
    if (uiMessage != null) showSnack(uiMessage);
  }, [uiMessage]);

  // Gün geçişi örtüsü açılınca VoiceOver'a söyle
  useEffect(() => {
    if (isDayTransitioning) announce(GUN_GECISI_ETIKETI);
  }, [isDayTransitioning]);

  const regionPrefix = player.currentRegionId === 'tashisar' ? 'Taş Hisar' : 'Kırlangıç';
  const sekmeler = NavigationTab.values();
  const seciliSira = currentTab.ordinal;

  let icerik = null;
  switch (currentTab) {
    case NavigationTab.INVENTORY:
      icerik = <InventoryScreen viewModel={gameViewModel} />;
      break;
    case NavigationTab.HOME:
      icerik = <HomeScreen viewModel={gameViewModel} />;
      break;
    case NavigationTab.ARENA:
      icerik = <ArenaScreen viewModel={gameViewModel} />;
      break;
    case NavigationTab.REGION:
      icerik = <RegionScreen viewModel={gameViewModel} />;
      break;
    case NavigationTab.QUESTS:
      icerik = <QuestScreen viewModel={gameViewModel} onNavigateToArena={() => setCurrentTab(NavigationTab.ARENA)} />;
      break;
  }

  // Gün geçişi sırasında altındaki her şey VoiceOver'dan gizlenir (örtü kilitler)
  const altGizli = !!isDayTransitioning;

  return (
    <Screen bg={DarkBg}>
      <Column fill hidden={altGizli}>
        {/* Üst çubuk */}
        <Surface color={DarkSurface} style={{ borderBottomWidth: 0.5, borderBottomColor: DarkBorder, paddingHorizontal: 16, paddingVertical: 8 }}>
          <Row justify="between" style={{ alignSelf: 'stretch' }}>
            <Row gap={8}>
              <IconBtn label="Ana Menüye Dön" onPress={onReturnToMainMenu}>
                <Gorsel ad="menu" boyut={22} renk={AmberGold} />
              </IconBtn>
              <Gorsel ad="capraz-kilic" boyut={20} renk={AmberGold} />
              <T heading style={Typography.titleMedium} color={TextGold} weight="bold">
                Silahşör
              </T>
            </Row>
            <Row gap={6}>
              <Surface radius={6} color={DarkBg} borderColor={AmberGold} borderWidth={1} style={{ paddingHorizontal: 6, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Gorsel ad={nitelikGorseli('gun')} boyut={14} renk={AmberGold} />
                <T size={11} weight="bold" color={AmberGold}>
                  {`${dayState.currentDay}. Gün`}
                </T>
              </Surface>
              <Surface radius={6} color={alpha(AmberGoldDark, 0.25)} borderColor={AmberGold} borderWidth={1} style={{ paddingHorizontal: 6, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Gorsel ad={nitelikGorseli('seviye')} boyut={14} renk={TextGold} />
                <T size={11} weight="bold" color={TextGold}>
                  {`Sv. ${player.level}`}
                </T>
              </Surface>
            </Row>
          </Row>

          <Spacer h={6} />

          {/* Üst Durum Çubuğu: Can, Altın, Şöhret (her yerde görünür) */}
          <Row justify="between" wrap gap={6} style={{ alignSelf: 'stretch' }}>
            <Row gap={4}>
              <Gorsel ad={nitelikGorseli('can')} boyut={16} renk={HealthGreen} />
              <T size={12} weight="semibold" color={HealthGreen}>
                {`${player.currentHealth}/${player.totalStats.maxHealth} Can`}
              </T>
            </Row>
            <Row gap={4}>
              <Gorsel ad={nitelikGorseli('altin')} boyut={16} renk={AmberGold} />
              <T size={12} weight="semibold" color={AmberGold}>
                {`${player.gold} Altın`}
              </T>
            </Row>
            <Row gap={4} style={{ flexShrink: 1 }}>
              <Gorsel ad={bolgeGorseli(player.currentRegionId)} boyut={16} renk={FamePurple} />
              <T size={12} weight="semibold" color={FamePurple} style={{ flexShrink: 1 }}>
                {`${regionPrefix}: ${player.currentRegionFame}/100 (${player.currentRegionTitle})`}
              </T>
            </Row>
          </Row>
        </Surface>

        {/* İçerik */}
        <Box fill>{icerik}</Box>

        {/* Alt sekme çubuğu (NavigationBar) */}
        <Tabs
          titles={sekmeler.map((tab) => ({ baslik: tab.title, gorsel: tab.gorsel }))}
          selected={seciliSira}
          onSelect={(i) => setCurrentTab(sekmeler[i])}
          color={DarkSurface}
          style={{ borderTopWidth: 0.5, borderTopColor: DarkBorder }}
        />
      </Column>

      <SnackHost bottom={84} />

      {levelUpEvent != null ? <LevelUpDialog event={levelUpEvent} onDismiss={() => gameViewModel.dismissLevelUpDialog()} /> : null}

      {invitationLetterEvent ? <InvitationLetterDialog onDismiss={() => gameViewModel.dismissInvitationLetter()} /> : null}

      {/* Gün Geçişi Ekran Karartması & Atmosferik Bekleme (gungecir sesi süresince kilitler) */}
      {isDayTransitioning ? (
        <Box
          modal
          label={GUN_GECISI_ETIKETI}
          align="center"
          justify="center"
          style={[StyleSheet.absoluteFill, { backgroundColor: color(0xf0080608) }]}
        >
          <Column align="center" gap={16} pad={32}>
            <GorselRozet ad="kamp-atesi" boyut={72} renk={AmberGold} />
            <Spinner color={AmberGold} size={48} />
            <T size={20} weight="bold" color={TextGold}>
              Gece Çöküyor...
            </T>
            <T size={14} color={TextLight} align="center">
              Dinleniyor, yaralarını sarıyor ve yeni günün şafağını bekliyorsun...
            </T>
          </Column>
        </Box>
      ) : null}
    </Screen>
  );
}
