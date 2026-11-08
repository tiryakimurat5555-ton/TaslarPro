// KT/ui/screens/ArenaScreen.kt
// Arena: 1v1 kura ligi, 2v2 ittifak, silahsız gösteri, labirent girişi, seyirci bahisleri, lig, günlükler
// ve hamle hamle canlı savaş anlatımları.
//
// VoiceOver: her yeni hamle (CombatLogBubble) eklendiğinde sırayla duyurulur (useCombatLogAnnouncer),
// anlatım sonradan baştan sona gezilebilir, can durumu kartları tek parça okunur, sonuç kartları açılınca duyurulur.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Box, Btn, Card, Chip, Column, Gorsel, GorselRozet, OutlinedBtn, Progress, Row, Scroll, Spacer, Surface, T, Tabs, announce, useFlow } from '../kit.js';
import { arenaGorseli, bolgeGorseli, canavarGorseli, esyaGorseli, gosteriGorseli, mizacGorseli, nadirlikRengi, taktikGorseli, tasRengi, yetenekGorseli } from '../gorsel-esleme.js';
import {
  AmberGold,
  AmberGoldDark,
  Color,
  DarkBg,
  DarkBorder,
  DarkSurface,
  DarkSurfaceCard,
  ExpBlue,
  FamePurple,
  HealthGreen,
  HealthRed,
  TextGold,
  TextLight,
  TextMuted,
  Typography,
  alpha,
  color,
} from '../theme.js';
import * as kt from '../../kt.js';
import { ArenaDiscipline, CombatEvent, HandicapBet, LabyrinthTactic, UnarmedShowType } from '../../domain/model.js';
import { UnarmedScheduleManager } from '../../domain/engine/UnarmedScheduleManager.js';
import { LabyrinthScreen } from './LabyrinthScreen.js';

// ---------------------------------------------------------------------------
// Yardımcılar
// ---------------------------------------------------------------------------
function oran(a, b) {
  if (!(b > 0)) return 0;
  return kt.coerceIn(a / b, 0, 1);
}
function kumeIcerir(k, x) {
  if (!k) return false;
  if (Array.isArray(k)) return k.includes(x);
  if (typeof k.has === 'function') return k.has(x);
  return false;
}
function kumeBoyu(k) {
  if (!k) return 0;
  if (Array.isArray(k)) return k.length;
  if (typeof k.size === 'number') return k.size;
  return 0;
}
/** Boş olmayan parçaları VoiceOver için cümle cümle birleştirir. */
function ozet(...parcalar) {
  return parcalar.filter((x) => x != null && String(x).trim() !== '').join('. ');
}

const MaviAcik = color(0xff64b5f6);
const Mavi = color(0xff4a90e2);

// ---------------------------------------------------------------------------
// Görseller (hepsi VoiceOver'dan gizli; anlamı yanındaki metin ya da kartın etiketi taşır)
// ---------------------------------------------------------------------------
/** Simge + metin satırı. Metin T'si aynen korunur; simge yalnız göz için. */
function IkonluMetin({ gorsel, gorselRenk, boyut = 16, gap = 5, children, style, align = 'center' }) {
  return (
    <Row gap={gap} align={align} style={style}>
      <Gorsel ad={gorsel} boyut={boyut} renk={gorselRenk} />
      {children}
    </Row>
  );
}

/** Hamle olayının simgesi ve rengi (CombatEvent). */
function hamleGorseli(ev) {
  if (ev === CombatEvent.CRITICAL) return 'simsek';
  if (ev === CombatEvent.DODGED) return 'kosu';
  if (ev === CombatEvent.BLOCKED) return 'kalkan';
  if (ev === CombatEvent.DEFEAT) return 'olum';
  if (ev === CombatEvent.DRAW) return 'el-sikisma';
  return 'kilic-yarasi';
}

/** Rakibin silah türü (düz metin) için simge. */
function silahGorseli(tur) {
  const t = String(tur || '').toLocaleLowerCase('tr-TR');
  if (t.includes('arbalet')) return 'arbalet';
  if (t.includes('yay')) return 'yay';
  if (t.includes('mızrak') || t.includes('kargı') || t.includes('cirit')) return 'mizrak';
  if (t.includes('hançer') || t.includes('kama')) return 'hancer';
  if (t.includes('balta')) return 'balta';
  if (t.includes('gürz') || t.includes('topuz')) return 'gurz';
  if (t.includes('tokmak') || t.includes('çekiç')) return 'cekic';
  if (t.includes('asa')) return 'asa';
  if (t.includes('kırbaç')) return 'kirbac';
  if (t.includes('olta') || t.includes('yaba')) return 'yaba';
  if (t.includes('tırpan')) return 'tirpan';
  if (t.includes('orak')) return 'orak';
  if (t.includes('yumruk') || t.includes('boynuz') || t.includes('pençe')) return 'yumruk';
  return 'kilic';
}

/** 2v2 meydan zemini (BattlefieldCondition.id) simgesi. */
const ZEMIN_GORSELI = { loose_sand: 'ayak-izi', narrow_pass: 'dag', wind_tempest: 'kar-tanesi', blood_pit: 'damla' };
function zeminGorseli(kosul) {
  return (kosul && ZEMIN_GORSELI[kosul.id]) || 'arena';
}

/** Labirent kat tuzağı (LabyrinthTrapCondition.id) simgesi. */
const TUZAK_GORSELI = { poison_darts: 'zehir', rising_water: 'bogulma', falling_rubble: 'tas-tablet' };
function tuzakGorseli(tuzak) {
  return (tuzak && TUZAK_GORSELI[tuzak.id]) || 'kurt-kapani';
}

/** Silahsız gösteri rakibinin simgesi: hayvan adı ya da gösteri türü. */
function gosteriRakibiGorseli(opp) {
  if (!opp) return 'yumruk';
  return canavarGorseli(opp.name) || canavarGorseli(opp.title) || gosteriGorseli(opp.showType);
}

/** Gladyatör (Enemy) simgesi: mizacına göre. */
function gladyatorGorseli(enemy) {
  const a = enemy && enemy.personality && enemy.personality.archetype;
  return a ? mizacGorseli(a) : 'sparta-migferi';
}

/** Sonuç kartı rozetinin simgesi. */
function sonucGorseli(berabere, kazandi) {
  return berabere ? 'el-sikisma' : kazandi ? 'kupa' : 'olum';
}

/** Bir hamlenin VoiceOver metni (Kotlin contentDescription: "Hamle N: anlatım"). */
export function combatLogLabel(log) {
  let s = `Hamle ${log.round}: ${log.narrativeText}`;
  // Anlatım metni hasarı zaten yazıyorsa ikinci kez eklenmez
  if (log.damage > 0 && !String(log.narrativeText).includes(`(-${log.damage} Can)`)) s += ` (-${log.damage} Can)`;
  return s;
}

/** Yeni hamle duyurusu: hamle metni ve hasar aldıysa savunanın kalan canı. */
function combatLogAnnouncement(log) {
  let s = combatLogLabel(log);
  if (log.damage > 0 && log.defenderMaxHp > 0 && log.defenderName) {
    s += `. ${log.defenderName}: ${log.defenderHpLeft} / ${log.defenderMaxHp} can.`;
  }
  return s;
}

/**
 * Canlı savaş anlatımına yeni eklenen hamleleri sırayla VoiceOver'a okutur.
 * Liste boşalınca ya da kısalınca (yeni dövüş) sayaç sıfırlanır. LabyrinthScreen de kullanabilir.
 */
export function useCombatLogAnnouncer(logs, enabled = true) {
  const sonSayi = useRef(null);
  useEffect(() => {
    const liste = logs || [];
    if (sonSayi.current === null) {
      // İlk görüntüleme: ekran yeniden açıldıysa eski hamleleri tekrar okuma; ama dövüş tam başlıyorsa (az hamle) oku.
      sonSayi.current = enabled && liste.length <= 2 ? 0 : liste.length;
    }
    if (liste.length < sonSayi.current) sonSayi.current = 0;
    if (enabled) {
      for (let i = sonSayi.current; i < liste.length; i++) announce(combatLogAnnouncement(liste[i]));
    }
    sonSayi.current = liste.length;
  }, [logs, enabled]);
}

/** Liste uzadıkça en alta kaydırır (Kotlin animateScrollToItem karşılığı). */
function useSonaKaydir(ref, uzunluk) {
  useEffect(() => {
    if (uzunluk > 0 && ref.current && ref.current.scrollToEnd) {
      const t = setTimeout(() => {
        try {
          ref.current && ref.current.scrollToEnd({ animated: true });
        } catch (e) {}
      }, 60);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [uzunluk]);
}

function useAcilisDuyurusu(metin) {
  useEffect(() => {
    announce(metin);
  }, []);
}

// ---------------------------------------------------------------------------
// ArenaScreen
// ---------------------------------------------------------------------------
export function ArenaScreen({ viewModel, style }) {
  const player = useFlow(viewModel.player);
  const enemies = useFlow(viewModel.enemies);
  const tashisarEnemies = useFlow(viewModel.tashisarEnemies);
  const selectedEnemy = useFlow(viewModel.selectedEnemy);
  const selectedBet = useFlow(viewModel.selectedBet);
  const isFighting = useFlow(viewModel.isFighting);
  const logs = useFlow(viewModel.liveCombatLogs);
  const livePlayerHp = useFlow(viewModel.livePlayerHp);
  const liveEnemyHp = useFlow(viewModel.liveEnemyHp);
  const combatResult = useFlow(viewModel.combatResult);
  const isSpectating = useFlow(viewModel.isSpectating);
  const spectatorFighter1 = useFlow(viewModel.spectatorFighter1);
  const spectatorFighter2 = useFlow(viewModel.spectatorFighter2);
  const liveFighter1Hp = useFlow(viewModel.liveFighter1Hp);
  const liveFighter2Hp = useFlow(viewModel.liveFighter2Hp);
  const spectatorLogs = useFlow(viewModel.liveSpectatorLogs);
  const spectatorResult = useFlow(viewModel.spectatorResult);
  const leagueState = useFlow(viewModel.leagueState);
  const arenaSubTab = useFlow(viewModel.arenaSubTab);
  const dayState = useFlow(viewModel.dayState);
  const duoMatchState = useFlow(viewModel.duoMatchState);
  const isDuoFighting = useFlow(viewModel.isDuoFighting);
  const duoCombatResult = useFlow(viewModel.duoCombatResult);
  const liveDuoHp = useFlow(viewModel.liveDuoHp);
  const unarmedMatchState = useFlow(viewModel.unarmedMatchState);
  const isUnarmedFighting = useFlow(viewModel.isUnarmedFighting);
  const unarmedCombatResult = useFlow(viewModel.unarmedCombatResult);
  const liveUnarmedHp = useFlow(viewModel.liveUnarmedHp);
  const labyrinthMatchState = useFlow(viewModel.labyrinthMatchState); // eslint-disable-line no-unused-vars
  const isRegion2Unlocked = viewModel.canTravelToRegion2;

  const logListState = useRef(null);
  const spectatorLogListState = useRef(null);

  const logList = logs || [];
  const spectatorLogList = spectatorLogs || [];

  useSonaKaydir(logListState, logList.length);
  useSonaKaydir(spectatorLogListState, spectatorLogList.length);

  const anaSavasGorunumu = isDuoFighting || duoCombatResult != null || isUnarmedFighting || unarmedCombatResult != null || isFighting || combatResult != null;
  const seyirciGorunumu = isSpectating || spectatorResult != null;
  useCombatLogAnnouncer(logList, anaSavasGorunumu && !seyirciGorunumu);
  useCombatLogAnnouncer(spectatorLogList, seyirciGorunumu);

  const liste = { pad: undefined, gap: 12, contentStyle: { paddingHorizontal: 16, paddingVertical: 8 } };
  const baslik = (metin, stil = Typography.titleMedium, gorsel) =>
    gorsel ? (
      <Row gap={8} style={{ alignSelf: 'stretch' }}>
        <Gorsel ad={gorsel} boyut={22} renk={AmberGold} />
        <T heading style={[stil, { flexShrink: 1 }]} color={TextGold} weight="bold">
          {metin}
        </T>
      </Row>
    ) : (
      <T heading style={stil} color={TextGold} weight="bold">
        {metin}
      </T>
    );

  let govde;
  if (seyirciGorunumu) {
    // Seyirci tribününden canlı izleme
    const f1 = spectatorFighter1 ?? spectatorResult?.fighter1;
    const f2 = spectatorFighter2 ?? spectatorResult?.fighter2;
    govde = (
      <Scroll ref={spectatorLogListState} gap={liste.gap} contentStyle={liste.contentStyle}>
        {f1 != null && f2 != null ? (
          <SpectatorLiveStatusCard
            fighter1={f1}
            fighter1Hp={liveFighter1Hp}
            fighter2={f2}
            fighter2Hp={liveFighter2Hp}
            selectedFighterName={spectatorResult?.selectedFighterName ?? dayState.activeSpectatorBet?.selectedFighterName ?? ''}
          />
        ) : null}
        {baslik('Tribün Canlı Anlatımı (Kıyasıya Çarpışma)', undefined, 'arena')}
        {spectatorLogList.map((log, i) => (
          <CombatLogBubble key={i} log={log} />
        ))}
        {spectatorResult != null ? <SpectatorResultCard result={spectatorResult} onDismiss={() => viewModel.dismissSpectatorModal()} /> : null}
        <Spacer h={70} />
      </Scroll>
    );
  } else if (isDuoFighting || duoCombatResult != null) {
    const duoState = duoMatchState;
    const ally = duoState.ally;
    const enemy1 = duoState.enemy1;
    const enemy2 = duoState.enemy2;
    const currentHp = liveDuoHp;
    govde = (
      <Scroll ref={logListState} gap={liste.gap} contentStyle={liste.contentStyle}>
        {ally != null && enemy1 != null && enemy2 != null && currentHp != null ? (
          <DuoCombatLiveStatusCard
            playerName={player.name}
            playerHp={currentHp.playerHp}
            playerMaxHp={currentHp.playerMaxHp}
            ally={ally}
            allyHp={currentHp.allyHp}
            enemy1={enemy1}
            enemy1Hp={currentHp.enemy1Hp}
            enemy2={enemy2}
            enemy2Hp={currentHp.enemy2Hp}
            condition={duoState.condition}
          />
        ) : null}
        {baslik('2v2 İttifak Meydanı (Canlı Çarpışma)', undefined, 'capraz-kilic')}
        {logList.map((log, i) => (
          <CombatLogBubble key={i} log={log} />
        ))}
        {duoCombatResult != null ? <DuoCombatResultCard result={duoCombatResult} onDismiss={() => viewModel.dismissDuoCombatModal()} /> : null}
        <Spacer h={70} />
      </Scroll>
    );
  } else if (isUnarmedFighting || unarmedCombatResult != null) {
    const unarmedOpponent = unarmedMatchState.currentOpponent;
    const currentHp = liveUnarmedHp;
    govde = (
      <Scroll ref={logListState} gap={liste.gap} contentStyle={liste.contentStyle}>
        {unarmedOpponent != null && currentHp != null ? (
          <Card
            color={DarkSurface}
            radius={12}
            borderColor={AmberGoldDark}
            style={{ alignSelf: 'stretch' }}
            label={ozet(
              `${unarmedMatchState.selectedShowType.title}, Kansız & Estetik`,
              `${player.name}: ${currentHp[0]} Can`,
              `${unarmedOpponent.name}: ${currentHp[1]} / ${unarmedOpponent.health} Can`
            )}
          >
            <Column pad={14} gap={10}>
              <Row justify="between">
                <IkonluMetin gorsel={gosteriGorseli(unarmedMatchState.selectedShowType)} gorselRenk={AmberGold} boyut={18} style={{ flexShrink: 1 }}>
                  <T size={12} weight="bold" color={AmberGold} style={{ flexShrink: 1 }}>{`${unarmedMatchState.selectedShowType.title}`}</T>
                </IkonluMetin>
                <Surface color={DarkBg} radius={4} borderColor={AmberGoldDark} borderWidth={1}>
                  <T size={10} color={TextGold} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                    Kansız & Estetik
                  </T>
                </Surface>
              </Row>

              {/* Oyuncu Canı */}
              <Column gap={4}>
                <Row justify="between">
                  <IkonluMetin gorsel="yumruk" gorselRenk={HealthGreen}>
                    <T size={12} weight="bold" color={TextLight}>{`${player.name}`}</T>
                  </IkonluMetin>
                  <T size={11} color={HealthGreen} weight="bold">{`${currentHp[0]} Can`}</T>
                </Row>
                <Progress value={kt.coerceIn(currentHp[0] / 250, 0, 1)} height={6} color={HealthGreen} track={DarkBg} />
              </Column>

              {/* Rakip Canı */}
              <Column gap={4}>
                <Row justify="between">
                  <IkonluMetin gorsel={gosteriRakibiGorseli(unarmedOpponent)} gorselRenk={AmberGold}>
                    <T size={12} weight="bold" color={TextGold}>{`${unarmedOpponent.name}`}</T>
                  </IkonluMetin>
                  <T size={11} color={AmberGold} weight="bold">{`${currentHp[1]} Can`}</T>
                </Row>
                <Progress value={oran(currentHp[1], unarmedOpponent.health)} height={6} color={AmberGold} track={DarkBg} />
              </Column>
            </Column>
          </Card>
        ) : null}
        {baslik('Canlı Gösteri Anlatımı', Typography.titleSmall, 'tomar')}
        {logList.map((log, i) => (
          <CombatLogBubble key={i} log={log} />
        ))}
        {unarmedCombatResult != null ? <UnarmedCombatResultCard result={unarmedCombatResult} onDismiss={() => viewModel.dismissUnarmedCombatModal()} /> : null}
        <Spacer h={70} />
      </Scroll>
    );
  } else if (isFighting || combatResult != null) {
    govde = (
      <Scroll ref={logListState} gap={liste.gap} contentStyle={liste.contentStyle}>
        {selectedEnemy != null ? (
          <CombatLiveStatusCard
            playerName={player.name}
            playerHp={livePlayerHp}
            playerMaxHp={player.totalStats.maxHealth}
            enemyName={selectedEnemy.name}
            enemyHp={liveEnemyHp}
            enemyMaxHp={selectedEnemy.stats.maxHealth}
          />
        ) : null}
        {baslik('Savaş Anlatımı (Son Nefese Kadar)', undefined, 'tomar')}
        {logList.map((log, i) => (
          <CombatLogBubble key={i} log={log} />
        ))}
        {combatResult != null ? <CombatResultCard result={combatResult} onDismiss={() => viewModel.dismissCombatModal()} /> : null}
        <Spacer h={70} />
      </Scroll>
    );
  } else {
    // 7 Arena Disiplinleri ve Bilgi Sekmeleri (Yatay Kaydırılabilir)
    const disiplinler = ArenaDiscipline.entries;
    // Sekme başlıkları { baslik, gorsel }: VoiceOver yalnız başlık metnini okur (önceki dizeyle aynı).
    const sekmeAdlari = disiplinler.map((discipline) => {
      const isLocked = discipline.tabIndex >= 1 && discipline.tabIndex <= 3 && !isRegion2Unlocked;
      return {
        baslik: isLocked ? `${discipline.shortTitle} (Kilitli)` : discipline.shortTitle,
        gorsel: isLocked ? 'kilit' : arenaGorseli(discipline),
      };
    });
    const sekmeSec = (i) => {
      const discipline = disiplinler[i];
      const isLocked = discipline.tabIndex >= 1 && discipline.tabIndex <= 3 && !isRegion2Unlocked;
      if (isLocked) {
        viewModel.showMessage(`${discipline.title} 2. Bölüm'de (Taş Hisar Garnizonu) açılacaktır!`);
      } else {
        viewModel.setArenaSubTab(discipline.tabIndex);
      }
    };

    const otherMatches = leagueState.currentFixture.filter((it) => !it.isPlayerMatch);
    let sekmeIcerigi = null;

    if (arenaSubTab === 0) {
      // Combat Tab (Kura Sistemi)
      const playerMatch = kt.firstOrNull(leagueState.currentFixture, (it) => it.isPlayerMatch);
      const drawnEnemy =
        (playerMatch != null ? kt.firstOrNull(enemies, (it) => it.id === playerMatch.fighter2Id || it.name === playerMatch.fighter2Name) : null) ??
        selectedEnemy ??
        kt.firstOrNull(enemies);

      const allDone = otherMatches.every((it) => it.isCompleted) || !dayState.canFightArenaToday;

      sekmeIcerigi = (
        <>
          <ArenaDailyObligationStatusCard dayState={dayState} />
          <ArenaIntroCard roundNumber={leagueState.roundNumber} />

          {drawnEnemy != null ? (
            <>
              {baslik(`Tellalın Kura Eşleşmesi (${dayState.currentDay}. Gün Karşılaşması)`, undefined, 'zar')}
              <DrawnOpponentCard enemy={drawnEnemy} playerName={player.name} roundNumber={leagueState.roundNumber} />
              {dayState.canFightArenaToday ? (
                <Btn onPress={() => viewModel.startCombat()} style={{ alignSelf: 'stretch', minHeight: 54 }} color={AmberGold} contentColor={DarkBg} radius={10} textSize={15} gorsel="capraz-kilic">
                  {`KURADAKİ RAKİPLE DÖVÜŞE GİR (${drawnEnemy.name})`}
                </Btn>
              ) : (
                <Card color={DarkSurfaceCard} radius={10} borderColor={AmberGoldDark} style={{ alignSelf: 'stretch' }}>
                  <Column pad={14} align="center">
                    <GorselRozet ad="kontrol-listesi" boyut={48} renk={TextGold} />
                    <Spacer h={6} />
                    <T weight="bold" color={TextGold} size={15} heading>
                      Günün Arena Karşılaşması Tamamlandı!
                    </T>
                    <Spacer h={6} />
                    <T size={12} color={TextLight} align="center" lineHeight={17}>
                      Tellal Aldus kumlardaki kanın süpürülmesi için kapıları kapattı. Seyirciler dağıldı. Yeni kura çekilişi ve sıradaki maç için meskenine (Ev) dönüp istirahat etmeli ve yeni günü başlatmalısın.
                    </T>
                    <Spacer h={10} />
                    <Btn onPress={() => viewModel.advanceDay(0)} color={HealthGreen} radius={8} textSize={13} gorsel="yatak">
                      İstirahat Et & Yeni Günü Başlat
                    </Btn>
                  </Column>
                </Card>
              )}
            </>
          ) : null}

          {otherMatches.length > 0 ? (
            <>
              <IkonluMetin gorsel={allDone ? 'tomar' : 'capraz-kilic'} gorselRenk={allDone ? AmberGold : TextLight} boyut={22} gap={8} style={{ alignSelf: 'stretch' }}>
                <T heading style={[Typography.titleMedium, { flexShrink: 1 }]} color={allDone ? AmberGold : TextLight} weight="bold">
                  {allDone ? 'Günün Tamamlanan Karşılaşmaları (Sonuçlar)' : 'Günün Diğer Kura Karşılaşmaları (5 Eşleşme)'}
                </T>
              </IkonluMetin>
              <Card color={DarkSurface} radius={10} borderColor={allDone ? AmberGoldDark : DarkBorder} style={{ alignSelf: 'stretch' }}>
                <Column pad={12} gap={8}>
                  <T size={12} color={TextMuted}>
                    {allDone
                      ? 'Sen dövüşürken diğer 10 gladyatör de kumda kozlarını paylaştı ve bugünün eşleşmeleri tamamlandı:'
                      : 'Sen arenadayken bu 10 gladyatör de kumlar üzerinde çarpışacak:'}
                  </T>
                  {otherMatches.map((match, idx) => (
                    <Row
                      key={idx}
                      justify="between"
                      color={DarkSurfaceCard}
                      radius={6}
                      style={{ paddingHorizontal: 10, paddingVertical: 8, alignSelf: 'stretch' }}
                      label={ozet(
                        `${idx + 1}. ${match.fighter1Name} karşı ${match.fighter2Name}`,
                        match.isCompleted ? 'TAMAMLANDI' : 'BEKLEMEDE',
                        match.isCompleted && match.resultSummary != null ? match.resultSummary : null
                      )}
                    >
                      <Gorsel ad="duello" boyut={20} renk={match.isCompleted ? HealthGreen : TextMuted} style={{ marginRight: 8 }} />
                      <Column style={{ flex: 1 }}>
                        <Row gap={6} wrap>
                          <T size={11} color={AmberGold} weight="bold">{`${idx + 1}.`}</T>
                          <T size={13} color={TextLight} weight="semibold">{`${match.fighter1Name}  VS  ${match.fighter2Name}`}</T>
                        </Row>
                        {match.isCompleted && match.resultSummary != null ? (
                          <IkonluMetin gorsel="kupa" gorselRenk={HealthGreen} boyut={14} gap={4}>
                            <T size={11} color={HealthGreen} weight="bold" style={{ flexShrink: 1 }}>{`${match.resultSummary}`}</T>
                          </IkonluMetin>
                        ) : null}
                      </Column>
                      <Surface radius={4} color={match.isCompleted ? alpha(HealthGreen, 0.2) : DarkBg} borderColor={match.isCompleted ? HealthGreen : DarkBorder} borderWidth={1}>
                        <T size={10} weight="bold" color={match.isCompleted ? HealthGreen : TextMuted} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                          {match.isCompleted ? 'TAMAMLANDI' : 'BEKLEMEDE'}
                        </T>
                      </Surface>
                    </Row>
                  ))}
                </Column>
              </Card>
            </>
          ) : null}
        </>
      );
    } else if (arenaSubTab === 1) {
      // 2v2 İttifak Kur'ası (Çark & Eşleşme)
      sekmeIcerigi = !isRegion2Unlocked ? (
        <ArenaDisciplineLockedCard
          title="2v2 İttifak Kur'ası"
          description="2v2 İttifak maçları Taş Hisar Garnizonu fermanı (2. Bölüm) açıldığında oynanabilir. 1. Bölümde (Kırlangıç Kasabası) yalnızca geleneksel 1v1 kum çukuru lig maçları geçerlidir."
          onBackToSolo={() => viewModel.setArenaSubTab(0)}
        />
      ) : (
        <DuoLotteryContent player={player} duoState={duoMatchState} onSpinLottery={() => viewModel.spinDuoLottery()} onStartFight={() => viewModel.startDuoCombat()} />
      );
    } else if (arenaSubTab === 2) {
      // Silahsız Gösteri (Pankration & Er Meydanı)
      sekmeIcerigi = !isRegion2Unlocked ? (
        <ArenaDisciplineLockedCard
          title="Silahsız Gösteri (Pankration)"
          description="Silahsız gösteri ve pehlivan boğuşmaları Taş Hisar Garnizonu fermanı (2. Bölüm) açıldığında oynanabilir. 1. Bölümde yalnızca geleneksel 1v1 kum çukuru lig maçları geçerlidir."
          onBackToSolo={() => viewModel.setArenaSubTab(0)}
        />
      ) : (
        <UnarmedShowContent
          player={player}
          unarmedState={unarmedMatchState}
          currentDay={dayState.currentDay}
          onSelectType={(it) => viewModel.selectUnarmedShowType(it)}
          onReroll={() => viewModel.drawUnarmedOpponent()}
          onStartFight={() => viewModel.startUnarmedCombat()}
        />
      );
    } else if (arenaSubTab === 3) {
      // Labirent (3v3 Katakomp Mücadelesi)
      sekmeIcerigi = !isRegion2Unlocked ? (
        <ArenaDisciplineLockedCard
          title="Labirent (3v3 Katakomp)"
          description="Katakomp ve labirent takım mücadeleleri Taş Hisar Garnizonu fermanı (2. Bölüm) açıldığında oynanabilir. 1. Bölümde yalnızca geleneksel 1v1 kum çukuru lig maçları geçerlidir."
          onBackToSolo={() => viewModel.setArenaSubTab(0)}
        />
      ) : (
        <LabyrinthScreen viewModel={viewModel} />
      );
    } else if (arenaSubTab === 4) {
      // Betting Tab
      sekmeIcerigi = (
        <BettingTabContent
          dayState={dayState}
          otherMatches={otherMatches}
          playerGold={player.gold}
          isHandicapOpen={viewModel.isBettingOpen}
          playerFame={player.globalFame}
          selectedBet={selectedBet}
          onSelectBet={(it) => viewModel.selectBet(it)}
          onPlaceSpectatorBet={(match, fName, amt) => viewModel.placeSpectatorBet(match, fName, amt)}
        />
      );
    } else if (arenaSubTab === 5) {
      // League Tab
      sekmeIcerigi = <LeagueTabContent leagueState={leagueState} />;
    } else if (arenaSubTab === 6) {
      // Fighter Diaries Tab
      const unlockedRegions = player.getUnlockedRegionIds();
      const visibleEnemies = [...enemies, ...tashisarEnemies].filter((it) => kumeIcerir(unlockedRegions, it.regionId));
      sekmeIcerigi = <FighterDiariesTabContent enemies={visibleEnemies} unlockedRegions={unlockedRegions} />;
    }

    govde = (
      <>
        <Tabs titles={sekmeAdlari} selected={kt.coerceIn(arenaSubTab, 0, 6)} onSelect={sekmeSec} scrollable color={DarkSurface} />
        <Scroll gap={14} contentStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}>
          {sekmeIcerigi}
          <Spacer h={70} />
        </Scroll>
      </>
    );
  }

  return <Column style={[{ flex: 1, backgroundColor: DarkBg }, style]}>{govde}</Column>;
}

// ---------------------------------------------------------------------------
function ArenaIntroCard({ roundNumber }) {
  return (
    <Card color={DarkSurface} radius={12} borderColor={AmberGoldDark} style={{ alignSelf: 'stretch' }}>
      <Column pad={14}>
        <IkonluMetin gorsel="arena" gorselRenk={AmberGold} boyut={18} gap={6}>
          <T style={Typography.labelSmall} color={AmberGold}>
            KIRLANGIÇ KASABASI ÇUKUR ARENASI
          </T>
        </IkonluMetin>
        <Spacer h={2} />
        <T heading style={Typography.titleLarge} color={TextGold} weight="bold">
          {`12 Gladyatörlü Kura Ligi • Hafta ${roundNumber}`}
        </T>
        <Spacer h={6} />
        <T style={Typography.bodyMedium} color={alpha(TextLight, 0.85)}>
          Tellal kura torbasını çalkaladı ve bu haftanın 6 eşleşmesini ilan etti. Dövüşler rauntla değil; biri tamamen bilincini yitirip kumlara serilene dek sürer.
        </T>
      </Column>
    </Card>
  );
}

function DrawnOpponentCard({ enemy, playerName, roundNumber }) {
  const taslar = enemy.socketedGems.length > 0 ? 'Mıhlanmış Taşlar: ' + kt.joinToString(enemy.socketedGems, ' • ', (it) => it.displayName) : null;
  const etiket = ozet(
    `Haftanın kura rakibi: ${enemy.name}, ${enemy.title}, Seviye ${enemy.level}`,
    `Ödül: ${enemy.rewardGold} Altın, +${enemy.rewardFame} Şöhret`,
    `Sağlık ${enemy.stats.maxHealth} HP, Hasar ${enemy.stats.damage}, Zırh ${enemy.stats.armor}, Hız ${enemy.stats.speed}`,
    `Kuşandığı Silah: ${enemy.weaponName} (${enemy.weaponType})`,
    taslar ? `Mıhlanmış Taşlar: ${kt.joinToString(enemy.socketedGems, ', ', (it) => it.displayName)}` : null,
    enemy.description
  );
  const stat = (ad, deger, renk, gorsel) => (
    <Column align="center">
      <Gorsel ad={gorsel} boyut={20} renk={renk} />
      <T size={11} color={TextMuted}>
        {ad}
      </T>
      <T size={13} weight="bold" color={renk}>
        {deger}
      </T>
    </Column>
  );
  return (
    <Card color={DarkSurfaceCard} radius={10} borderColor={AmberGold} borderWidth={2} style={{ alignSelf: 'stretch' }} label={etiket}>
      <Column pad={14}>
        <Row justify="between" wrap>
          <Row>
            <Surface radius={6} color={AmberGold}>
              <T size={11} weight="bold" color={DarkBg} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                KURA EŞLEŞMESİ
              </T>
            </Surface>
            <Spacer w={8} />
            <T size={12} color={TextMuted} weight="semibold">{`Seviye ${enemy.level}`}</T>
          </Row>
          <Surface radius={6} color={DarkSurface}>
            <IkonluMetin gorsel="sikkeler" gorselRenk={AmberGold} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
              <T size={12} color={AmberGold}>
                {`${enemy.rewardGold} Altın • +${enemy.rewardFame} Şöhret`}
              </T>
            </IkonluMetin>
          </Surface>
        </Row>

        <Spacer h={10} />
        <Row gap={10} style={{ alignSelf: 'stretch' }}>
          <GorselRozet ad={gladyatorGorseli(enemy)} boyut={48} renk={TextGold} kenar={AmberGold} />
          <T style={[Typography.titleMedium, { flex: 1 }]} weight="bold" color={TextGold}>
            {`${playerName}  VS  ${enemy.name} "${enemy.title}"`}
          </T>
        </Row>
        <Spacer h={6} />

        <Row justify="around" color={DarkSurface} radius={6} pad={8} style={{ alignSelf: 'stretch' }}>
          {stat('Sağlık', `${enemy.stats.maxHealth} HP`, HealthGreen, 'can')}
          {stat('Hasar', `${enemy.stats.damage}`, HealthRed, 'kilic')}
          {stat('Zırh', `${enemy.stats.armor}`, ExpBlue, 'kalkan')}
          {stat('Hız', `${enemy.stats.speed}`, TextGold, 'hiz')}
        </Row>

        <Spacer h={8} />
        <IkonluMetin gorsel={silahGorseli(enemy.weaponType)} gorselRenk={AmberGoldDark} boyut={18}>
          <T size={12} weight="semibold" color={AmberGoldDark} style={{ flexShrink: 1 }}>{`Kuşandığı Silah: ${enemy.weaponName} (${enemy.weaponType})`}</T>
        </IkonluMetin>

        {taslar ? (
          <>
            <Spacer h={4} />
            <IkonluMetin gorsel="elmas" gorselRenk={tasRengi(enemy.socketedGems[0] && enemy.socketedGems[0].type)} boyut={16}>
              <T size={11} color={AmberGold} weight="semibold" style={{ flexShrink: 1 }}>
                {taslar}
              </T>
            </IkonluMetin>
          </>
        ) : null}

        <Spacer h={6} />
        <T size={12} color={alpha(TextLight, 0.85)} lineHeight={17}>
          {enemy.description}
        </T>
      </Column>
    </Card>
  );
}

// Kotlin'de tanımlı ama ekranda kullanılmıyor; aynen taşındı.
// eslint-disable-next-line no-unused-vars
function EnemySelectionCard({ enemy, isSelected, onClick }) {
  return (
    <Card
      onPress={onClick}
      selected={isSelected}
      color={isSelected ? DarkSurfaceCard : DarkSurface}
      radius={8}
      borderColor={isSelected ? AmberGold : DarkBorder}
      borderWidth={isSelected ? 2 : 1}
      style={{ alignSelf: 'stretch' }}
      label={`${enemy.name}, ${enemy.title}, Seviye ${enemy.level}`}
    >
      <Column pad={12}>
        <Row justify="between">
          <Column style={{ flex: 1 }}>
            <T weight="bold" color={isSelected ? AmberGold : TextLight} size={15}>{`${enemy.name} "${enemy.title}"`}</T>
            <T size={12} color={TextMuted}>{`Seviye ${enemy.level} • Silah: ${enemy.weaponName} • Can: ${enemy.stats.maxHealth}`}</T>
          </Column>
          <Surface radius={6} color={DarkSurfaceCard}>
            <T size={12} color={AmberGold} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>{`${enemy.rewardGold} Altın`}</T>
          </Surface>
        </Row>
        <Spacer h={4} />
        <T size={12} color={alpha(TextLight, 0.8)}>
          {enemy.description}
        </T>
      </Column>
    </Card>
  );
}

function ArenaDailyObligationStatusCard({ dayState }) {
  const etiket = dayState.isArenaMatchDoneToday
    ? 'Günlük arena durumu: Dövüş tamamlandı.'
    : dayState.isDailySpectatorBetPlaced
      ? 'Günlük arena durumu: Seyirci bahsi yatırıldı. Gün şartı tamamlandı.'
      : 'Günlük arena durumu: Arenaya katılım bekleniyor. Maça çıkmalı veya seyirci bahsi yatırmalısın.';
  const zemin = dayState.isArenaMatchDoneToday ? alpha(HealthGreen, 0.15) : dayState.isDailySpectatorBetPlaced ? alpha(AmberGoldDark, 0.2) : alpha(HealthRed, 0.15);
  const kenar = dayState.isArenaMatchDoneToday ? HealthGreen : dayState.isDailySpectatorBetPlaced ? AmberGold : alpha(HealthRed, 0.6);
  const ikon = dayState.isArenaMatchDoneToday ? 'kontrol-listesi' : dayState.isDailySpectatorBetPlaced ? 'sikkeler' : 'kum-saati';
  const baslikMetni = dayState.isArenaMatchDoneToday
    ? 'Günün Arena Dövüşü Tamamlandı'
    : dayState.isDailySpectatorBetPlaced
      ? 'Günün Seyirci Bahsi Yatırıldı'
      : 'Günün Arenasına Katılım Bekleniyor';
  const baslikRengi = dayState.isArenaMatchDoneToday ? HealthGreen : dayState.isDailySpectatorBetPlaced ? TextGold : HealthRed;
  const aciklama = dayState.isArenaMatchDoneToday
    ? 'Kırlangıç kanunu gereği bugünkü müsabakanı verdin. Yeni gün için istirahat edebilirsin.'
    : dayState.isDailySpectatorBetPlaced
      ? `${dayState.activeSpectatorBet?.selectedFighterName} galibiyetine ${dayState.activeSpectatorBet?.betAmount} Altın yatırdın. Dilersen yine de dövüşe çıkabilir veya günü tamamlayabilirsin.`
      : 'Günü bitirebilmek için kuradaki dövüşüne çıkmalı VEYA Bahis sekmesinden bir maça seyirci bahsi yatırmalısın.';
  return (
    <Card color={zemin} radius={10} borderColor={kenar} style={{ alignSelf: 'stretch' }} label={ozet(etiket, aciklama)}>
      <Row pad={12}>
        <GorselRozet ad={ikon} boyut={42} renk={baslikRengi} zemin={alpha(DarkBg, 0.4)} />
        <Spacer w={10} />
        <Column style={{ flex: 1 }}>
          <T weight="bold" size={13} color={baslikRengi}>
            {baslikMetni}
          </T>
          <T size={11} color={TextLight} lineHeight={15}>
            {aciklama}
          </T>
        </Column>
      </Row>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Bahis sekmesi
// ---------------------------------------------------------------------------
function BettingTabContent({ dayState, otherMatches, playerGold, isHandicapOpen, playerFame, selectedBet, onSelectBet, onPlaceSpectatorBet }) {
  const [selectedMatchForBet, setSelectedMatchForBet] = useState(null);
  const [chosenFighterName, setChosenFighterName] = useState(null);
  const [chosenAmount, setChosenAmount] = useState(10);

  const options = [
    [null, 'Bahis Yok'],
    [new HandicapBet({ id: 'fast_win', title: 'Hızlı Zafer', description: '15 hamleden önce nakavt et', multiplier: 2.2, betAmount: 15 }), 'Hızlı Zafer (15 Altın -> x2.2)'],
    [new HandicapBet({ id: 'flawless_win', title: 'Kusursuz Zafer', description: '%60 canın üstünde bitir', multiplier: 3.0, betAmount: 25 }), 'Kusursuz Zafer (25 Altın -> x3.0)'],
  ];

  let seyirciIcerik;
  if (dayState.isDailySpectatorBetPlaced) {
    const bet = dayState.activeSpectatorBet;
    seyirciIcerik = (
      <Surface color={DarkSurfaceCard} radius={8} borderColor={HealthGreen} borderWidth={1} style={{ alignSelf: 'stretch' }}>
        <Column pad={12}>
          <IkonluMetin gorsel="kontrol-listesi" gorselRenk={HealthGreen} boyut={18}>
            <T color={HealthGreen} weight="bold" size={13}>
              Bugünkü Seyirci Bahsin Yatırıldı!
            </T>
          </IkonluMetin>
          <Spacer h={4} />
          <T size={12} color={TextMuted}>{`Karşılaşma: ${bet?.fighter1Name} vs ${bet?.fighter2Name}`}</T>
          <T size={12} weight="semibold" color={TextGold}>
            {`Tahminin: ${bet?.selectedFighterName} Galibiyeti (${bet?.betAmount} Altın -> Olası Kazanç: +${bet?.potentialReturn} Altın)`}
          </T>
          <Spacer h={4} />
          <T size={11} color={TextLight}>
            {bet?.isResolved === true
              ? 'Müsabaka tribünden canlı izlendi ve sonuçlandı. Günlük arena katılım şartın yerine getirildi!'
              : 'Maç sonucu gece bittiğinde ve yeni gün başladığında belirlenecektir. Günlük arena katılım şartın yerine getirildi!'}
          </T>
        </Column>
      </Surface>
    );
  } else if (kt.none(otherMatches, (it) => !it.isCompleted)) {
    seyirciIcerik = (
      <T color={TextMuted} size={12}>
        Günün bahis oynanabilecek başka maçı kalmadı.
      </T>
    );
  } else {
    seyirciIcerik = (
      <>
        <T size={12} weight="semibold" color={AmberGold}>
          Bahis Oynamak İstediğin Eşleşmeyi Seç (Canlı İzlenir):
        </T>
        <Spacer h={6} />
        {otherMatches
          .filter((it) => !it.isCompleted)
          .map((match, i) => {
            const isMatchSelected = selectedMatchForBet?.fighter1Name === match.fighter1Name && selectedMatchForBet?.fighter2Name === match.fighter2Name;
            const fighterBtn = (ad) => {
              const secili = chosenFighterName === ad;
              return (
                <Btn
                  onPress={() => setChosenFighterName(ad)}
                  color={secili ? AmberGold : DarkSurfaceCard}
                  contentColor={secili ? DarkBg : TextLight}
                  selected={secili}
                  textSize={11}
                  style={{ flex: 1, minHeight: 36 }}
                  gorsel="sparta-migferi"
                >
                  {ad}
                </Btn>
              );
            };
            return (
              <Card
                key={i}
                color={isMatchSelected ? DarkSurfaceCard : DarkSurface}
                radius={8}
                borderColor={isMatchSelected ? AmberGold : DarkBorder}
                borderWidth={isMatchSelected ? 1.5 : 1}
                style={{ alignSelf: 'stretch', marginVertical: 4 }}
              >
                <Column pad={10}>
                  <Box
                    onPress={() => {
                      setSelectedMatchForBet(match);
                      setChosenFighterName(match.fighter1Name);
                    }}
                    selected={isMatchSelected}
                    label={`${match.fighter1Name} karşı ${match.fighter2Name}`}
                    style={{ minHeight: 32, justifyContent: 'center' }}
                  >
                    <IkonluMetin gorsel="duello" gorselRenk={isMatchSelected ? AmberGold : TextMuted} boyut={20} gap={8}>
                      <T weight="bold" size={13} color={isMatchSelected ? TextGold : TextLight} style={{ flexShrink: 1 }}>{`${match.fighter1Name}  VS  ${match.fighter2Name}`}</T>
                    </IkonluMetin>
                  </Box>

                  {isMatchSelected ? (
                    <>
                      <Spacer h={8} />
                      <T size={11} color={TextMuted}>
                        Kimin Kazanacağına Oynuyorsun?
                      </T>
                      <Spacer h={4} />
                      <Row gap={8} style={{ alignSelf: 'stretch' }}>
                        {fighterBtn(match.fighter1Name)}
                        {fighterBtn(match.fighter2Name)}
                      </Row>

                      <Spacer h={8} />
                      <T size={11} color={TextMuted}>
                        Bahis Tutarı:
                      </T>
                      <Row gap={6} style={{ alignSelf: 'stretch' }}>
                        {[5, 10, 20].map((amt) => (
                          <OutlinedBtn
                            key={amt}
                            onPress={() => setChosenAmount(amt)}
                            containerColor={chosenAmount === amt ? alpha(AmberGoldDark, 0.3) : Color.Transparent}
                            borderColor={chosenAmount === amt ? AmberGold : DarkBorder}
                            contentColor={TextGold}
                            selected={chosenAmount === amt}
                            label={`${amt} Altın`}
                            textSize={11}
                            style={{ flex: 1, minHeight: 34, paddingHorizontal: 6 }}
                            gorsel="sikke"
                          >
                            {`${amt} Altın`}
                          </OutlinedBtn>
                        ))}
                      </Row>

                      <Spacer h={10} />
                      <Btn
                        onPress={() => {
                          if (chosenFighterName != null) {
                            onPlaceSpectatorBet(match, chosenFighterName, chosenAmount);
                          }
                        }}
                        disabled={!(playerGold >= chosenAmount && chosenFighterName != null)}
                        color={HealthGreen}
                        textSize={12}
                        style={{ alignSelf: 'stretch', minHeight: 42 }}
                        gorsel="sikkeler"
                      >
                        {`${chosenFighterName ?? ''} İçin Canlı İzle & ${chosenAmount} Altın Yatır (x2.0)`}
                      </Btn>
                    </>
                  ) : null}
                </Column>
              </Card>
            );
          })}
      </>
    );
  }

  return (
    <Column gap={14}>
      {/* 1. SEYİRCİ BAHİSLERİ (GÜNÜ TAMAMLAMA ŞARTI) */}
      <Card color={DarkSurface} radius={12} borderColor={AmberGoldDark} style={{ alignSelf: 'stretch' }}>
        <Column pad={14}>
          <Row gap={8}>
            <Gorsel ad="sikkeler" boyut={22} renk={AmberGold} />
            <T heading style={[Typography.titleMedium, { flexShrink: 1 }]} color={TextGold} weight="bold">
              Günün Karşılaşmalarına Seyirci Bahsi
            </T>
          </Row>
          <Spacer h={6} />
          <T size={12} color={TextLight} lineHeight={16}>
            Kurandaki dövüşe çıkamayacak kadar yaralıysan veya dövüşmek istemiyorsan, kumdaki diğer gladyatörlerin maçına bahis oynayarak gün şartını tamamlayabilir ve altın kazanabilirsin.
          </T>
          <Spacer h={10} />
          {seyirciIcerik}
        </Column>
      </Card>

      {/* 2. KENDİ DÖVÜŞÜN İÇİN HANDİKAP BAHİSLERİ */}
      <Card color={DarkSurface} radius={12} borderColor={DarkBorder} style={{ alignSelf: 'stretch' }}>
        <Column pad={14}>
          <IkonluMetin gorsel="zar" gorselRenk={AmberGold} boyut={22} gap={8}>
            <T heading style={[Typography.titleMedium, { flexShrink: 1 }]} color={TextGold} weight="bold">
              Kendi Dövüşün İçin Handikap Bahisleri
            </T>
          </IkonluMetin>
          <Spacer h={6} />
          {!isHandicapOpen ? (
            <Surface color={DarkSurfaceCard} radius={8} style={{ alignSelf: 'stretch' }}>
              <Column pad={12}>
                <IkonluMetin gorsel="kilit" gorselRenk={HealthRed} boyut={18}>
                  <T color={HealthRed} weight="bold" size={13}>
                    HANDİKAP MASASI HENÜZ KAPALI
                  </T>
                </IkonluMetin>
                <Spacer h={4} />
                <T size={12} color={TextLight}>{`Kendi dövüşlerine handikap koyabilmek için şöhretin en az 10 puana ulaşmalıdır. (Mevcut: ${playerFame} / 10)`}</T>
              </Column>
            </Surface>
          ) : (
            <>
              <T size={12} color={TextLight}>
                Arenaya çıkmadan önce kendi dövüşüne handikap belirle. Risk al, altını katla!
              </T>
              <Spacer h={10} />
              {options.map(([bet, label], i) => {
                const isChosen = (selectedBet?.id ?? null) === (bet?.id ?? null);
                return (
                  <Row key={i} onPress={() => onSelectBet(bet)} role="radio" selected={isChosen} label={label} style={{ paddingVertical: 4, alignSelf: 'stretch', minHeight: 44 }}>
                    <RadioDaire selected={isChosen} />
                    <Gorsel ad={bet == null ? 'kapi' : bet.id === 'fast_win' ? 'hiz' : 'can'} boyut={20} renk={isChosen ? AmberGold : TextMuted} style={{ marginRight: 8 }} />
                    <T size={13} color={isChosen ? TextGold : TextLight} style={{ flexShrink: 1 }}>
                      {label}
                    </T>
                  </Row>
                );
              })}
            </>
          )}
        </Column>
      </Card>
    </Column>
  );
}

/** RadioButton görseli (dekoratif; durum satırın erişilebilirlik bilgisinde). */
function RadioDaire({ selected }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: selected ? AmberGold : TextMuted, alignItems: 'center', justifyContent: 'center', margin: 12 }}
    >
      {selected ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: AmberGold }} /> : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Gladyatör günlükleri sekmesi
// ---------------------------------------------------------------------------
function FighterDiariesTabContent({ enemies, unlockedRegions = [] }) {
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('all');

  const displayedEnemies = useMemo(
    () => (selectedRegionFilter === 'all' ? enemies : enemies.filter((it) => it.regionId === selectedRegionFilter)),
    [enemies, selectedRegionFilter]
  );

  return (
    <Column gap={12}>
      <Card color={DarkSurface} radius={10} borderColor={AmberGoldDark} style={{ alignSelf: 'stretch' }}>
        <Column pad={14}>
          <IkonluMetin gorsel="acik-kitap" gorselRenk={AmberGold} boyut={22} gap={8}>
            <T heading style={[Typography.titleMedium, { flexShrink: 1 }]} color={TextGold} weight="bold">
              Gladyatör Günlükleri & Yapay Zeka Bilinci
            </T>
          </IkonluMetin>
          <Spacer h={4} />
          <T size={12} color={TextLight} lineHeight={16}>
            Arenadaki rakiplerin sadece kumda dövüşmez; her gün kendi kişilik arketiplerine göre karar alır, para harcar ve gelişirler. Hırslılar demirciye koşar, tembeller handa sabahlar, kurnazlar bahis ve zehir depolar.
          </T>
        </Column>
      </Card>

      {/* Eğer birden fazla bölge açılmışsa bölge filtreleme butonları göster */}
      {kumeBoyu(unlockedRegions) > 1 ? (
        <Row gap={8} wrap style={{ alignSelf: 'stretch' }}>
          <Chip selected={selectedRegionFilter === 'all'} onPress={() => setSelectedRegionFilter('all')} selectedColor={AmberGoldDark} gorsel="dunya">
            {`Tüm Bölgeler (${enemies.length})`}
          </Chip>
          {kumeIcerir(unlockedRegions, 'kirlangic') ? (
            <Chip selected={selectedRegionFilter === 'kirlangic'} onPress={() => setSelectedRegionFilter('kirlangic')} selectedColor={AmberGoldDark} gorsel={bolgeGorseli('kirlangic')}>
              {`Kırlangıç (${kt.count(enemies, (it) => it.regionId === 'kirlangic')})`}
            </Chip>
          ) : null}
          {kumeIcerir(unlockedRegions, 'tashisar') ? (
            <Chip selected={selectedRegionFilter === 'tashisar'} onPress={() => setSelectedRegionFilter('tashisar')} selectedColor={AmberGoldDark} gorsel={bolgeGorseli('tashisar')}>
              {`Taş Hisar (${kt.count(enemies, (it) => it.regionId === 'tashisar')})`}
            </Chip>
          ) : null}
        </Row>
      ) : null}

      {displayedEnemies.map((enemy, i) => {
        const p = enemy.personality;
        const cond = p.currentCondition;
        const eksi = cond != null && cond.includes('-');
        const statlar = [
          `${enemy.stats.maxHealth} Can`,
          `${enemy.stats.damage} Hasar`,
          `${enemy.stats.armor} Zırh`,
          `${enemy.stats.speed} Hız`,
          enemy.stats.blockChancePercent > 0 ? `yüzde ${enemy.stats.blockChancePercent} Blok` : null,
          enemy.stats.critChancePercent > 0 ? `yüzde ${enemy.stats.critChancePercent} Kritik` : null,
        ]
          .filter(Boolean)
          .join(', ');
        const etiket = ozet(
          `${enemy.name}, ${enemy.title}, Kişiliği: ${p.archetype.title}. Cüzdanında ${p.gold} altın var. Durumu: ${p.currentCondition ?? 'Normal'}. Dünkü olay: ${p.latestDiary}`,
          `Seviye ${enemy.level}, Silah: ${enemy.weaponName}`,
          statlar
        );
        return (
          <Card key={enemy.id ?? i} color={DarkSurfaceCard} radius={10} borderColor={DarkBorder} style={{ alignSelf: 'stretch' }} label={etiket}>
            <Column pad={12}>
              <Row justify="between">
                <GorselRozet ad={gladyatorGorseli(enemy)} boyut={44} renk={TextGold} kenar={alpha(AmberGold, 0.6)} style={{ marginRight: 10 }} />
                <Column style={{ flex: 1 }}>
                  <T weight="bold" color={TextGold} size={15}>{`${enemy.name} "${enemy.title}"`}</T>
                  <T size={11} color={TextMuted}>{`Seviye ${enemy.level} • Silah: ${enemy.weaponName}`}</T>
                </Column>
                <Surface radius={6} color={alpha(AmberGoldDark, 0.3)} borderColor={AmberGold} borderWidth={1}>
                  <Row gap={4} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Gorsel ad={mizacGorseli(p.archetype)} boyut={14} renk={TextGold} />
                    <T size={11} weight="bold" color={TextGold}>
                      {p.archetype.title}
                    </T>
                  </Row>
                </Surface>
              </Row>

              <Spacer h={8} />

              {/* Cüzdan & Durum */}
              <Row justify="between">
                <IkonluMetin gorsel="para-kesesi" gorselRenk={AmberGold}>
                  <T size={12} weight="semibold" color={AmberGold}>{`Cüzdan: ${p.gold} Altın`}</T>
                </IkonluMetin>
                {cond != null ? (
                  <Surface radius={4} color={eksi ? alpha(HealthRed, 0.2) : alpha(HealthGreen, 0.2)} borderColor={eksi ? HealthRed : HealthGreen} borderWidth={1}>
                    <T size={10} weight="bold" color={eksi ? HealthRed : HealthGreen} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                      {cond}
                    </T>
                  </Surface>
                ) : null}
              </Row>

              <Spacer h={6} />

              {/* Dünkü Günlük */}
              <Surface radius={6} color={DarkSurface} style={{ alignSelf: 'stretch' }}>
                <IkonluMetin gorsel="tuy-kalem" gorselRenk={alpha(AmberGold, 0.8)} align="start" gap={8} style={{ padding: 8 }}>
                  <T size={12} color={alpha(TextLight, 0.9)} lineHeight={16} style={{ flex: 1 }}>{`${p.latestDiary}`}</T>
                </IkonluMetin>
              </Surface>

              <Spacer h={6} />

              {/* Canlı Nitelikler */}
              <Row justify="between" wrap gap={6}>
                <IkonluMetin gorsel="can" gorselRenk={HealthGreen} boyut={14} gap={3}><T size={11} color={HealthGreen}>{`${enemy.stats.maxHealth} Can`}</T></IkonluMetin>
                <IkonluMetin gorsel="kilic" gorselRenk={HealthRed} boyut={14} gap={3}><T size={11} color={HealthRed}>{`${enemy.stats.damage} Hasar`}</T></IkonluMetin>
                <IkonluMetin gorsel="kalkan" gorselRenk={ExpBlue} boyut={14} gap={3}><T size={11} color={ExpBlue}>{`${enemy.stats.armor} Zırh`}</T></IkonluMetin>
                <IkonluMetin gorsel="hiz" gorselRenk={TextGold} boyut={14} gap={3}><T size={11} color={TextGold}>{`${enemy.stats.speed} Hız`}</T></IkonluMetin>
                {enemy.stats.blockChancePercent > 0 ? (
                  <IkonluMetin gorsel="kalkan-darbe" gorselRenk={TextMuted} boyut={14} gap={3}><T size={11} color={TextMuted}>{`%${enemy.stats.blockChancePercent} Blok`}</T></IkonluMetin>
                ) : null}
                {enemy.stats.critChancePercent > 0 ? (
                  <IkonluMetin gorsel="simsek" gorselRenk={AmberGold} boyut={14} gap={3}><T size={11} color={AmberGold}>{`%${enemy.stats.critChancePercent} Kritik`}</T></IkonluMetin>
                ) : null}
              </Row>
            </Column>
          </Card>
        );
      })}
    </Column>
  );
}

// ---------------------------------------------------------------------------
// Lig sekmesi
// ---------------------------------------------------------------------------
function LeagueTabContent({ leagueState }) {
  const hucre = (metin, renk, gen, ekstra) => (
    <T size={11} weight="bold" color={renk} style={[{ width: gen }, ekstra]}>
      {metin}
    </T>
  );
  return (
    <Column gap={14}>
      <Card color={DarkSurface} radius={10} borderColor={AmberGoldDark} style={{ alignSelf: 'stretch' }}>
        <Column pad={14}>
          <Row justify="between" wrap>
            <IkonluMetin gorsel="kursu" gorselRenk={AmberGold} boyut={22} gap={8} style={{ flexShrink: 1 }}>
              <T heading weight="bold" color={TextGold} size={15} style={{ flexShrink: 1 }}>
                {leagueState.seasonName}
              </T>
            </IkonluMetin>
            <IkonluMetin gorsel="gunes-saati" gorselRenk={TextMuted} boyut={14} gap={4}>
              <T size={12} color={TextMuted}>{`Hafta / Tur: ${leagueState.roundNumber}`}</T>
            </IkonluMetin>
          </Row>
          <Spacer h={4} />
          <IkonluMetin gorsel="bilgi" gorselRenk={AmberGoldDark} align="start" gap={6}>
          <T size={11} color={AmberGoldDark} lineHeight={15} style={{ flex: 1 }}>
            {'Kural: Galibiyet 3P • Beraberlik 1P • Mağlubiyet 0P\nDikkat: Üst üste kayıplarda lig cezası (2. ve 3. kayıpta -1P, 4. ve üzeri kayıplarda sabit -2P) uygulanır.'}
          </T>
          </IkonluMetin>

          <Spacer h={10} />

          {/* League Table Header (VoiceOver'da her satır kendi etiketiyle okunduğu için gizli) */}
          <Row justify="between" color={DarkSurfaceCard} radius={4} hidden style={{ paddingHorizontal: 6, paddingVertical: 6, alignSelf: 'stretch' }}>
            {hucre('#', TextMuted, 20)}
            <View style={{ width: 24 }} />
            <T size={11} weight="bold" color={TextLight} style={{ flex: 1 }}>
              Dövüşçü
            </T>
            {hucre('O', TextMuted, 22)}
            {hucre('G', HealthGreen, 22)}
            {hucre('B', ExpBlue, 22)}
            {hucre('M', HealthRed, 22)}
            {hucre('Puan', AmberGold, 36)}
          </Row>

          <Spacer h={4} />

          {/* Table Rows */}
          {leagueState.standings.map((standing, index) => {
            const isPlayer = standing.isPlayer;
            const rowBg = isPlayer ? alpha(AmberGoldDark, 0.2) : Color.Transparent;
            const ceza = standing.consecutiveLosses >= 2 ? `${standing.consecutiveLosses} üst üste kayıp (-${standing.calculateLossPenalty()} Puan ceza)` : null;
            const etiket = ozet(
              `${index + 1}. sıra: ${standing.name}${isPlayer ? ' (SEN)' : ''}`,
              `${standing.matchesPlayed} maç, ${standing.wins} galibiyet, ${standing.draws} beraberlik, ${standing.losses} mağlubiyet, ${standing.points} puan`,
              standing.consecutiveLosses >= 2 ? `${standing.consecutiveLosses} üst üste kayıp (-${standing.calculateLossPenalty()} Puan ceza)` : null
            );
            return (
              <Row key={index} justify="between" color={rowBg} radius={4} style={{ paddingHorizontal: 6, paddingVertical: 6, alignSelf: 'stretch' }} label={etiket}>
                <T size={12} weight="bold" color={index === 0 ? AmberGold : TextMuted} style={{ width: 20 }}>{`${index + 1}`}</T>
                <Gorsel
                  ad={index < 3 ? 'madalya' : isPlayer ? 'kilicli-adam' : 'sparta-migferi'}
                  boyut={18}
                  renk={index === 0 ? '#F2C14E' : index === 1 ? '#C9CED6' : index === 2 ? '#C77D45' : isPlayer ? AmberGold : alpha(TextMuted, 0.7)}
                  style={{ marginRight: 6 }}
                />
                <Column style={{ flex: 1 }}>
                  <T size={13} weight={isPlayer ? 'bold' : 'normal'} color={isPlayer ? TextGold : TextLight}>{`${standing.name} ${isPlayer ? '(SEN)' : ''}`}</T>
                  {ceza ? (
                    <IkonluMetin gorsel="alev" gorselRenk={HealthRed} boyut={12} gap={3}>
                      <T size={10} color={HealthRed} style={{ flexShrink: 1 }}>
                        {ceza}
                      </T>
                    </IkonluMetin>
                  ) : null}
                </Column>
                <T size={12} color={TextLight} style={{ width: 22 }}>{`${standing.matchesPlayed}`}</T>
                <T size={12} color={HealthGreen} style={{ width: 22 }}>{`${standing.wins}`}</T>
                <T size={12} color={ExpBlue} style={{ width: 22 }}>{`${standing.draws}`}</T>
                <T size={12} color={HealthRed} style={{ width: 22 }}>{`${standing.losses}`}</T>
                <T size={13} weight="bold" color={AmberGold} style={{ width: 36 }}>{`${standing.points}`}</T>
              </Row>
            );
          })}
        </Column>
      </Card>

      {/* Recent Matches Section */}
      {leagueState.recentMatches.length > 0 ? (
        <>
          <IkonluMetin gorsel="tomar" gorselRenk={AmberGold} boyut={22} gap={8} style={{ alignSelf: 'stretch' }}>
            <T heading style={[Typography.titleMedium, { flexShrink: 1 }]} color={TextLight} weight="bold">
              Son Lig Karşılaşmaları (Yaşayan Simülasyon)
            </T>
          </IkonluMetin>
          {leagueState.recentMatches.map((match, i) => (
            <Card key={i} color={DarkSurface} radius={8} borderColor={DarkBorder} style={{ alignSelf: 'stretch' }}>
              <Column pad={10}>
                <Row justify="between" wrap>
                  <IkonluMetin gorsel="duello" gorselRenk={AmberGold} boyut={18} style={{ flexShrink: 1 }}>
                    <T weight="bold" color={TextGold} size={13} style={{ flexShrink: 1 }}>{`${match.fighter1Name} vs ${match.fighter2Name}`}</T>
                  </IkonluMetin>
                  <T size={11} color={AmberGoldDark}>
                    {match.scoreSummary}
                  </T>
                </Row>
                <Spacer h={4} />
                <T size={12} color={alpha(TextLight, 0.85)}>
                  {match.narrativeSnippet}
                </T>
              </Column>
            </Card>
          ))}
        </>
      ) : null}
    </Column>
  );
}

// ---------------------------------------------------------------------------
// Canlı savaş kartları (LabyrinthScreen de kullanır)
// ---------------------------------------------------------------------------
export function CombatLiveStatusCard({ playerName, playerHp, playerMaxHp, enemyName, enemyHp, enemyMaxHp }) {
  const playerFrac = oran(playerHp, playerMaxHp);
  const enemyFrac = oran(enemyHp, enemyMaxHp);
  return (
    <Card
      color={DarkSurface}
      radius={10}
      borderColor={AmberGoldDark}
      style={{ alignSelf: 'stretch' }}
      label={`Can durumu. ${playerName}: ${playerHp} / ${playerMaxHp} HP. ${enemyName}: ${enemyHp} / ${enemyMaxHp} HP.`}
    >
      <Column pad={12}>
        <Row justify="between">
          <IkonluMetin gorsel="kilicli-adam" gorselRenk={TextGold} boyut={20} gap={6} style={{ flexShrink: 1 }}>
            <T weight="bold" color={TextGold} size={13} style={{ flexShrink: 1 }}>
              {playerName}
            </T>
          </IkonluMetin>
          <IkonluMetin gorsel="can" gorselRenk={HealthGreen} boyut={14} gap={4}>
            <T color={HealthGreen} size={13} weight="bold">{`${playerHp} / ${playerMaxHp} HP`}</T>
          </IkonluMetin>
        </Row>
        <Spacer h={4} />
        <Progress value={playerFrac} height={8} radius={4} color={HealthGreen} track={DarkSurfaceCard} />

        <Spacer h={12} />

        <Row justify="between">
          <IkonluMetin gorsel="sparta-migferi" gorselRenk={HealthRed} boyut={20} gap={6} style={{ flexShrink: 1 }}>
            <T weight="bold" color={HealthRed} size={13} style={{ flexShrink: 1 }}>
              {enemyName}
            </T>
          </IkonluMetin>
          <IkonluMetin gorsel="can" gorselRenk={HealthRed} boyut={14} gap={4}>
            <T color={HealthRed} size={13} weight="bold">{`${enemyHp} / ${enemyMaxHp} HP`}</T>
          </IkonluMetin>
        </Row>
        <Spacer h={4} />
        <Progress value={enemyFrac} height={8} radius={4} color={HealthRed} track={DarkSurfaceCard} />
      </Column>
    </Card>
  );
}

export function CombatLogBubble({ log }) {
  const ev = log.event;
  const borderColor =
    ev === CombatEvent.CRITICAL
      ? HealthRed
      : ev === CombatEvent.DODGED
        ? ExpBlue
        : ev === CombatEvent.BLOCKED
          ? AmberGold
          : ev === CombatEvent.DEFEAT
            ? TextGold
            : ev === CombatEvent.DRAW
              ? AmberGold
              : DarkBorder;

  const badgeText =
    ev === CombatEvent.CRITICAL
      ? 'KRİTİK DARBE'
      : ev === CombatEvent.DODGED
        ? 'SIYRILDI'
        : ev === CombatEvent.BLOCKED
          ? 'BLOKLANDI'
          : ev === CombatEvent.DEFEAT
            ? 'NAKAVT'
            : ev === CombatEvent.DRAW
              ? 'ÇİFTE NAKAVT'
              : 'VURUŞ';
  // Sıradan vuruşta kenar rengi koyu; simge yine de seçilsin diye açık renk.
  const simgeRengi = borderColor === DarkBorder ? TextLight : borderColor;

  // Kotlin: liveRegion Polite + contentDescription "Hamle N: anlatım". Yeni hamle duyurusu
  // ekran düzeyindeki useCombatLogAnnouncer ile yapılır (aynı metin iki kez okunmasın diye burada live yok).
  return (
    <Card color={DarkSurface} radius={8} borderColor={borderColor} style={{ alignSelf: 'stretch' }} label={combatLogLabel(log)}>
      <Row pad={10} gap={10} align="start">
        <GorselRozet ad={hamleGorseli(ev)} boyut={34} renk={simgeRengi} zemin={alpha(simgeRengi, 0.14)} />
        <Column style={{ flex: 1 }}>
          <Row justify="between">
            <T size={11} weight="bold" color={borderColor} style={{ flexShrink: 1 }}>{`Hamle ${log.round} • ${badgeText}`}</T>
            {log.damage > 0 ? (
              <IkonluMetin gorsel="damla" gorselRenk={HealthRed} boyut={12} gap={3}>
                <T size={11} weight="bold" color={HealthRed}>{`-${log.damage} Can`}</T>
              </IkonluMetin>
            ) : null}
          </Row>
          <Spacer h={4} />
          <T size={13} lineHeight={18} color={TextLight}>
            {log.narrativeText}
          </T>
        </Column>
      </Row>
    </Card>
  );
}

function CombatResultCard({ result, onDismiss }) {
  const containerBg = result.isDraw ? color(0xff332a18) : result.isPlayerWinner ? color(0xff1e3a24) : color(0xff3a1e1e);
  const borderColor = result.isDraw ? AmberGold : result.isPlayerWinner ? HealthGreen : HealthRed;
  const titleText = result.isDraw ? 'ÇİFTE NAKAVT! (BERABERLİK)' : result.isPlayerWinner ? 'ZAFER SENİN OLDU!' : 'YENİLGİYE UĞRADIN...';
  const subtitleText = result.isDraw
    ? "İki gladyatör de aynı anda kumlara serildi! İki tarafa da 1'er lig puanı yazıldı."
    : result.isPlayerWinner
      ? 'Kumların efendisi ayakta kaldı! Ligde 3 puan hanene yazıldı.'
      : 'Kumların üzerine yığıldın. Lig sıralamasında puan kayıpları yaşamamak için toparlanmalısın!';
  const betText = result.betWon ? `Bahis Tutkusu: Handikapı kazandın! (+${result.betEarnings} Altın)` : null;
  const dropText = result.droppedItem != null ? `Ganimet Düştü: ${result.droppedItem.name}!` : null;

  useAcilisDuyurusu(
    ozet(
      titleText,
      subtitleText,
      `+${result.earnedGold} Altın, +${result.earnedExp} EXP, +${result.earnedFame} Şöhret`,
      result.betWon ? `Bahis Tutkusu: Handikapı kazandın! (+${result.betEarnings} Altın)` : null,
      result.droppedItem != null ? `Ganimet Düştü: ${result.droppedItem.name}!` : null
    )
  );

  return (
    <Card color={containerBg} radius={12} borderColor={borderColor} borderWidth={2} style={{ alignSelf: 'stretch' }}>
      <Column pad={16} align="center">
        <GorselRozet ad={sonucGorseli(result.isDraw, result.isPlayerWinner)} boyut={60} renk={borderColor} kenar={borderColor} zemin={alpha(DarkBg, 0.45)} />
        <Spacer h={8} />
        <T heading size={20} weight="bold" color={borderColor} label={titleText} align="center">
          {titleText}
        </T>
        <Spacer h={8} />
        <T size={13} color={TextLight} style={{ alignSelf: 'stretch' }}>
          {subtitleText}
        </T>

        <Spacer h={10} />
        <Row justify="around" wrap style={{ alignSelf: 'stretch' }} label={`+${result.earnedGold} Altın, +${result.earnedExp} EXP, +${result.earnedFame} Şöhret`}>
          <IkonluMetin gorsel="sikke" gorselRenk={AmberGold} boyut={18}><T color={AmberGold} weight="bold">{`+${result.earnedGold} Altın`}</T></IkonluMetin>
          <IkonluMetin gorsel="yildiz-madalya" gorselRenk={ExpBlue} boyut={18}><T color={ExpBlue} weight="bold">{`+${result.earnedExp} EXP`}</T></IkonluMetin>
          <IkonluMetin gorsel="defne" gorselRenk={FamePurple} boyut={18}><T color={FamePurple} weight="bold">{`+${result.earnedFame} Şöhret`}</T></IkonluMetin>
        </Row>

        {betText ? (
          <>
            <Spacer h={6} />
            <IkonluMetin gorsel="zar" gorselRenk={AmberGold} boyut={18} style={{ alignSelf: 'stretch' }}>
              <T color={AmberGold} weight="bold" size={13} style={{ flexShrink: 1 }}>
                {betText}
              </T>
            </IkonluMetin>
          </>
        ) : null}

        {dropText ? (
          <>
            <Spacer h={8} />
            <IkonluMetin gorsel={esyaGorseli(result.droppedItem)} gorselRenk={nadirlikRengi(result.droppedItem.rarity)} boyut={22} gap={6} style={{ alignSelf: 'stretch' }}>
              <T color={TextGold} weight="bold" style={{ flexShrink: 1 }}>
                {dropText}
              </T>
            </IkonluMetin>
          </>
        ) : null}

        <Spacer h={14} />
        <Btn onPress={onDismiss} color={AmberGold} contentColor={DarkBg} radius={8} gorsel="kapi">
          Arenadan Ayrıl & Lige Dön
        </Btn>
      </Column>
    </Card>
  );
}

function SpectatorLiveStatusCard({ fighter1, fighter1Hp, fighter2, fighter2Hp, selectedFighterName }) {
  const f1Frac = oran(fighter1Hp, fighter1.stats.maxHealth);
  const f2Frac = oran(fighter2Hp, fighter2.stats.maxHealth);
  const satir = (f, hp, frac) => (
    <>
      <Row justify="between">
        <IkonluMetin gorsel={gladyatorGorseli(f)} gorselRenk={f.name === selectedFighterName ? AmberGold : TextMuted} boyut={20} gap={6} style={{ flexShrink: 1 }}>
          <T weight="bold" color={f.name === selectedFighterName ? TextGold : TextLight} size={13} style={{ flexShrink: 1 }}>{`${f.name} "${f.title}"`}</T>
        </IkonluMetin>
        <T color={HealthRed} size={13} weight="bold">{`${hp} / ${f.stats.maxHealth} HP`}</T>
      </Row>
      <Spacer h={4} />
      <Progress value={frac} height={8} radius={4} color={f.name === selectedFighterName ? AmberGold : HealthRed} track={DarkSurfaceCard} />
    </>
  );
  return (
    <Card
      color={DarkSurface}
      radius={12}
      borderColor={AmberGold}
      borderWidth={1.5}
      style={{ alignSelf: 'stretch' }}
      label={`Seyirci maçı: ${fighter1.name} ${fighter1Hp} can, ${fighter2.name} ${fighter2Hp} can. Oynadığın dövüşçü: ${selectedFighterName}`}
    >
      <Column pad={14}>
        <Row justify="between" wrap>
          <IkonluMetin gorsel="gozlemci" gorselRenk={AmberGold} boyut={18}>
            <T size={11} weight="bold" color={AmberGold}>
              SEYİRCİ TRİBÜNÜ CANLI İZLEME
            </T>
          </IkonluMetin>
          {selectedFighterName.length > 0 ? (
            <Surface radius={4} color={alpha(AmberGoldDark, 0.3)} borderColor={AmberGold} borderWidth={1}>
              <IkonluMetin gorsel="sikkeler" gorselRenk={TextGold} boyut={14} gap={4} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                <T size={11} weight="bold" color={TextGold}>{`Bahsin: ${selectedFighterName}`}</T>
              </IkonluMetin>
            </Surface>
          ) : null}
        </Row>

        <Spacer h={10} />
        {/* Fighter 1 */}
        {satir(fighter1, fighter1Hp, f1Frac)}
        <Spacer h={12} />
        {/* Fighter 2 */}
        {satir(fighter2, fighter2Hp, f2Frac)}
      </Column>
    </Card>
  );
}

function SpectatorResultCard({ result, onDismiss }) {
  const containerBg = result.isDraw ? color(0xff332a18) : result.betWon ? color(0xff1e3a24) : color(0xff3a1e1e);
  const borderColor = result.isDraw ? AmberGold : result.betWon ? HealthGreen : HealthRed;
  const titleText = result.isDraw ? 'ÇİFTE NAKAVT (BERABERLİK)' : result.betWon ? 'BAHİS KAZANDI!' : 'BAHİS KAYBETTİ';
  const matchOutcomeText = result.isDraw
    ? "Her iki gladyatör de aynı anda bilincini kaybederek kumlara serildi! İki dövüşçüye de 1'er lig puanı verildi."
    : `${result.winnerName} son nefeste ayakta kaldı ve maçı kazandı! (+3 Lig Puanı)`;
  const paraMetni = result.betWon
    ? `+${result.betWinnings} Altın Kazandın!`
    : result.isDraw
      ? 'Beraberlik sonucu bahsin iade edilmedi.'
      : `Yatırdığın ${result.betAmount} Altın kasanın kasasına geçti.`;
  const katilim = 'Günlük arena katılım şartın tamamlandı. Artık yeni günü başlatabilirsin!';

  useAcilisDuyurusu(ozet(`${titleText}: ${matchOutcomeText}`, result.betWon ? `+${result.betWinnings} Altın Kazandın!` : paraMetni, 'Günlük arena katılım şartın tamamlandı. Artık yeni günü başlatabilirsin!'));

  return (
    <Card color={containerBg} radius={12} borderColor={borderColor} borderWidth={2} style={{ alignSelf: 'stretch' }}>
      <Column pad={16} align="center">
        <GorselRozet ad={result.isDraw ? 'el-sikisma' : result.betWon ? 'kupa' : 'zar-tek'} boyut={60} renk={borderColor} kenar={borderColor} zemin={alpha(DarkBg, 0.45)} />
        <Spacer h={8} />
        <Column style={{ alignSelf: 'stretch' }} align="center" label={`${titleText}: ${matchOutcomeText}`} heading>
          <T size={20} weight="bold" color={borderColor} align="center">
            {titleText}
          </T>
          <Spacer h={8} />
          <T size={13} color={TextLight} align="center" style={{ alignSelf: 'stretch' }}>
            {matchOutcomeText}
          </T>
        </Column>

        <Spacer h={10} />
        {result.betWon ? (
          <IkonluMetin gorsel="sikkeler" gorselRenk={AmberGold} boyut={22} gap={6}>
            <T color={AmberGold} weight="bold" size={16}>
              {paraMetni}
            </T>
          </IkonluMetin>
        ) : result.isDraw ? (
          <T color={TextMuted} size={12}>
            {paraMetni}
          </T>
        ) : (
          <IkonluMetin gorsel="para-kesesi" gorselRenk={HealthRed} boyut={18} style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
            <T color={HealthRed} size={13} style={{ flexShrink: 1 }}>
              {paraMetni}
            </T>
          </IkonluMetin>
        )}

        <Spacer h={6} />
        <Column align="center" gap={4} style={{ alignSelf: 'stretch' }}>
          <Gorsel ad="kontrol-listesi" boyut={20} renk={HealthGreen} />
          <T size={11} color={HealthGreen} weight="semibold" align="center">
            {katilim}
          </T>
        </Column>

        <Spacer h={14} />
        <Btn onPress={onDismiss} color={AmberGold} contentColor={DarkBg} radius={8} gorsel="kapi">
          Tribünden Ayrıl & Arenaya Dön
        </Btn>
      </Column>
    </Card>
  );
}

// =========================================================================
// YENİ ARENA DİSİPLİNLERİ: 2v2 İTTİFAK, SİLAHSIZ GÖSTERİ & LABİRENT (3v3)
// =========================================================================

/** Ödül şeridi (Giriş / Ödül / EXP / Şöhret) — tek parça okunur. */
function OdulSeridi({ entryFee, rewardGold, rewardExp, rewardFame, odulAdi = 'Ödül' }) {
  return (
    <Card color={DarkSurfaceCard} radius={8} borderWidth={0} borderColor={null} style={{ alignSelf: 'stretch' }} label={`Giriş: ${entryFee} Altın. ${odulAdi}: ${rewardGold} Altın. +${rewardExp} EXP. +${rewardFame} Şöhret.`}>
      <Row justify="around" wrap pad={10} gap={6}>
        <IkonluMetin gorsel="sikke" gorselRenk={TextLight} boyut={15} gap={4}><T size={11} color={TextLight}>{`Giriş: ${entryFee} Altın`}</T></IkonluMetin>
        <IkonluMetin gorsel="sikkeler" gorselRenk={AmberGold} boyut={15} gap={4}><T size={11} color={AmberGold} weight="bold">{`${odulAdi}: ${rewardGold} Altın`}</T></IkonluMetin>
        <IkonluMetin gorsel="yildiz-madalya" gorselRenk={TextGold} boyut={15} gap={4}><T size={11} color={TextGold}>{`+${rewardExp} EXP`}</T></IkonluMetin>
        <IkonluMetin gorsel="defne" gorselRenk={HealthGreen} boyut={15} gap={4}><T size={11} color={HealthGreen} weight="bold">{`+${rewardFame} Şöhret`}</T></IkonluMetin>
      </Row>
    </Card>
  );
}

function TanitimKarti({ ust, rozet, rozetRenk, rozetZemin, rozetKenar, baslikMetni, aciklama, gorsel, rozetGorsel }) {
  return (
    <Card color={DarkSurface} radius={12} borderColor={AmberGoldDark} style={{ alignSelf: 'stretch' }}>
      <Column pad={14}>
        <Row justify="between" wrap>
          <T style={Typography.labelSmall} color={AmberGold} weight="bold" heading>
            {ust}
          </T>
          <Surface color={rozetZemin} radius={4} borderColor={rozetKenar} borderWidth={1}>
            <Row gap={4} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
              {rozetGorsel ? <Gorsel ad={rozetGorsel} boyut={13} renk={rozetRenk} /> : null}
              <T size={10} weight="bold" color={rozetRenk}>
                {rozet}
              </T>
            </Row>
          </Surface>
        </Row>
        <Spacer h={8} />
        <Row gap={10} style={{ alignSelf: 'stretch' }}>
          {gorsel ? <GorselRozet ad={gorsel} boyut={48} renk={TextGold} kenar={AmberGoldDark} /> : null}
          <T style={[Typography.titleMedium, { flex: 1 }]} color={TextGold} weight="bold">
            {baslikMetni}
          </T>
        </Row>
        <Spacer h={6} />
        <T style={Typography.bodySmall} color={alpha(TextLight, 0.85)} lineHeight={17}>
          {aciklama}
        </T>
      </Column>
    </Card>
  );
}

/** Yuvarlak zeminli simge (eskiden emoji taşıyordu). ikon = gorseller.js adı. Gizlidir. */
function YuvarlakIkon({ ikon, zemin, boyut = 46, renk = AmberGold }) {
  return <GorselRozet ad={ikon} boyut={boyut} zemin={zemin} renk={renk} />;
}

export function DuoLotteryContent({ player, duoState, onSpinLottery, onStartFight }) {
  const ally = duoState.ally;
  const enemy1 = duoState.enemy1;
  const enemy2 = duoState.enemy2;
  const kart = (renk, satirlar, etiket, ek) => (
    <Card color={DarkSurfaceCard} radius={8} borderColor={alpha(renk, 0.5)} style={{ flex: 1 }} label={etiket}>
      <Column pad={8}>
        {satirlar}
        {ek}
      </Column>
    </Card>
  );
  return (
    <Column gap={14} style={{ alignSelf: 'stretch' }}>
      {/* Tanıtım Kartı */}
      <TanitimKarti
        ust="2'YE 2 İTTİFAK ARENASI"
        rozet="KURA ÇARKI"
        gorsel="capraz-kilic"
        rozetGorsel="zar"
        rozetRenk={AmberGold}
        rozetZemin={alpha(AmberGold, 0.15)}
        rozetKenar={AmberGold}
        baslikMetni="Rastgele Gladyatör İttifakı & Değişken Zemin"
        aciklama="Tek bir niteliğin zirvede olması yetmez! Çark döndüğünde kum çukuruna rastgele bir yoldaş ve iki rakip gladyatör iner. Meydanın zemin kuralına göre çeviklik, kalkan direnci ya da yetenek hızı üstün gelir."
      />

      {/* Zemin / Meydan Koşulu Kartı */}
      <Card
        color={DarkSurfaceCard}
        radius={10}
        borderColor={Mavi}
        style={{ alignSelf: 'stretch' }}
        label={ozet(`Meydan zemini: ${duoState.condition.name}`, `Odak: ${duoState.condition.focusStatName}`, duoState.condition.description, `İpucu: ${duoState.condition.tacticalHint}`)}
      >
        <Row pad={12} gap={10}>
          <YuvarlakIkon ikon={zeminGorseli(duoState.condition)} zemin={alpha(Mavi, 0.2)} renk={MaviAcik} />
          <Column style={{ flex: 1 }}>
            <Row gap={6} wrap>
              <T weight="bold" color={MaviAcik} size={14}>
                {duoState.condition.name}
              </T>
              <Surface color={DarkBg} radius={4}>
                <T size={10} color={AmberGold} weight="semibold" style={{ paddingHorizontal: 4, paddingVertical: 1 }}>{`Odak: ${duoState.condition.focusStatName}`}</T>
              </Surface>
            </Row>
            <Spacer h={3} />
            <T size={11} color={TextLight} lineHeight={15}>
              {duoState.condition.description}
            </T>
            <Spacer h={2} />
            <IkonluMetin gorsel="bilgi" gorselRenk={HealthGreen} boyut={14} gap={4} align="start">
              <T size={10} color={HealthGreen} weight="medium" style={{ flex: 1 }}>{`İpucu: ${duoState.condition.tacticalHint}`}</T>
            </IkonluMetin>
          </Column>
        </Row>
      </Card>

      {/* Çarkı Çevir & Kura Çek Butonu */}
      <OutlinedBtn onPress={onSpinLottery} containerColor={DarkSurfaceCard} contentColor={AmberGold} borderColor={AmberGold} radius={10} textSize={13} style={{ alignSelf: 'stretch', minHeight: 48 }} gorsel="zar">
        Çarkı Çevir & İttifak Kur'asını Çek
      </OutlinedBtn>

      {/* Karşılaşma Eşleşmesi (Mavi Köşe vs Kırmızı Köşe) */}
      <Card color={DarkSurface} radius={10} borderColor={DarkBorder} style={{ alignSelf: 'stretch' }}>
        <Column pad={12} gap={10}>
          {/* Mavi Köşe (Siz + Yoldaş) */}
          <IkonluMetin gorsel="kalkan" gorselRenk={MaviAcik} boyut={18}>
            <T size={12} weight="bold" color={MaviAcik} heading>
              MAVİ KÖŞE (SİZİN İTTİFAKINIZ)
            </T>
          </IkonluMetin>
          <Row gap={8} align="stretch" style={{ alignSelf: 'stretch' }}>
            {/* Oyuncu Kartı */}
            {kart(
              MaviAcik,
              <>
                <IkonluMetin gorsel="kilicli-adam" gorselRenk={TextGold} boyut={16} gap={4}>
                  <T weight="bold" color={TextGold} size={12} lines={1} style={{ flexShrink: 1 }}>{`${player.name}`}</T>
                </IkonluMetin>
                <T size={10} color={TextLight} lines={1}>{`Seviye ${player.level} • ${player.title}`}</T>
                <T size={10} color={TextMuted}>{`${player.totalStats.maxHealth} Can • ${player.totalStats.damage} Hasar`}</T>
              </>,
              `${player.name}, Seviye ${player.level}, ${player.title}. ${player.totalStats.maxHealth} Can, ${player.totalStats.damage} Hasar`
            )}

            {/* Kura Yoldaşı Kartı */}
            {kart(
              MaviAcik,
              <>
                <IkonluMetin gorsel={ally != null ? gladyatorGorseli(ally) : 'kum-saati'} gorselRenk={MaviAcik} boyut={16} gap={4}>
                  <T weight="bold" color={MaviAcik} size={12} lines={1} style={{ flexShrink: 1 }}>{`${ally?.name ?? 'Yoldaş Bekleniyor'}`}</T>
                </IkonluMetin>
                <T size={10} color={TextLight} lines={1}>{`Seviye ${ally?.level ?? 1} • ${ally?.title ?? 'Gladyatör'}`}</T>
                <T size={10} color={TextMuted}>{`${ally?.stats?.maxHealth ?? 0} Can • ${ally?.stats?.damage ?? 0} Hasar`}</T>
              </>,
              ozet(
                `Yoldaş: ${ally?.name ?? 'Yoldaş Bekleniyor'}, Seviye ${ally?.level ?? 1}, ${ally?.title ?? 'Gladyatör'}. ${ally?.stats?.maxHealth ?? 0} Can, ${ally?.stats?.damage ?? 0} Hasar`,
                ally != null && ally.skills.length > 0 ? `Yetenekler: ${kt.take(ally.skills, 4).map((s) => s.name ?? s.icon).join(', ')}` : null
              ),
              ally != null && ally.skills.length > 0 ? (
                <>
                  <Spacer h={4} />
                  <Row gap={3}>
                    {kt.take(ally.skills, 4).map((skill, i) => (
                      <YuvarlakIkon key={i} ikon={yetenekGorseli(skill.type)} zemin={alpha(AmberGold, 0.2)} boyut={24} />
                    ))}
                  </Row>
                </>
              ) : null
            )}
          </Row>

          {/* VS Ayırıcı */}
          <Box align="center" style={{ alignSelf: 'stretch' }}>
            <Surface color={alpha(HealthRed, 0.2)} radius={6} borderColor={HealthRed} borderWidth={1}>
              <IkonluMetin gorsel="capraz-kilic" gorselRenk={HealthRed} boyut={14} gap={4} style={{ paddingHorizontal: 8, paddingVertical: 2 }}>
                <T size={11} weight="bold" color={HealthRed}>
                  2v2 MEYDAN ÇARPIŞMASI
                </T>
              </IkonluMetin>
            </Surface>
          </Box>

          {/* Kırmızı Köşe (Rakipler) */}
          <IkonluMetin gorsel="capraz-kilic" gorselRenk={HealthRed} boyut={18}>
            <T size={12} weight="bold" color={HealthRed} heading>
              KIRMIZI KÖŞE (RAKİP İTTİFAK)
            </T>
          </IkonluMetin>
          <Row gap={8} align="stretch" style={{ alignSelf: 'stretch' }}>
            {[
              [enemy1, 'Rakip 1'],
              [enemy2, 'Rakip 2'],
            ].map(([e, yedek], i) => (
              <React.Fragment key={i}>
                {kart(
                  HealthRed,
                  <>
                    <IkonluMetin gorsel={e != null ? gladyatorGorseli(e) : 'sparta-migferi'} gorselRenk={HealthRed} boyut={16} gap={4}>
                      <T weight="bold" color={HealthRed} size={12} lines={1} style={{ flexShrink: 1 }}>{`${e?.name ?? yedek}`}</T>
                    </IkonluMetin>
                    <T size={10} color={TextLight} lines={1}>{`Seviye ${e?.level ?? 1} • ${e?.title ?? 'Gladyatör'}`}</T>
                    <T size={10} color={TextMuted}>{`${e?.stats?.maxHealth ?? 0} Can • ${e?.stats?.armor ?? 0} Zırh`}</T>
                  </>,
                  `${e?.name ?? yedek}, Seviye ${e?.level ?? 1}, ${e?.title ?? 'Gladyatör'}. ${e?.stats?.maxHealth ?? 0} Can, ${e?.stats?.armor ?? 0} Zırh`
                )}
              </React.Fragment>
            ))}
          </Row>
        </Column>
      </Card>

      {/* Ödüller & Giriş */}
      <OdulSeridi entryFee={duoState.entryFee} rewardGold={duoState.rewardGold} rewardExp={duoState.rewardExp} rewardFame={duoState.rewardFame} />

      {/* Başla Butonu */}
      <Btn onPress={onStartFight} color={AmberGold} contentColor={DarkBg} radius={10} textSize={13} style={{ alignSelf: 'stretch', minHeight: 52 }} gorsel="capraz-kilic">
        2v2 İTTİFAK ÇARPIŞMASINA BAŞLA (HAZIRLIK)
      </Btn>
    </Column>
  );
}

export function UnarmedShowContent({ player, unarmedState, currentDay = 1, onSelectType, onReroll, onStartFight }) {
  const forecast = UnarmedScheduleManager.getScheduleForecast(currentDay, 4);
  const opp = unarmedState.currentOpponent;
  return (
    <Column gap={14} style={{ alignSelf: 'stretch' }}>
      {/* Tanıtım Kartı */}
      <TanitimKarti
        ust="SİLAHSIZ GÖSTERİ (PANKRATION)"
        rozet="ER MEYDANI"
        gorsel="yumruk"
        rozetGorsel="arena"
        rozetRenk={HealthGreen}
        rozetZemin={alpha(HealthGreen, 0.15)}
        rozetKenar={HealthGreen}
        baslikMetni="Demir Zırhlar ve Silahlar Kapıda Bırakıldı!"
        aciklama="Burada kılıçların keskinliği değil; saf kas, dayanıklılık, güreş teknikleri (kilit, fırlatma, yorma) ve çeviklik konuşur. Seyirciler vahşi bir canavara, yaratık sürüsüne veya pehlivanlara karşı yalın bilek mücadelesi izlemek için altın döker."
      />

      {/* Arena Takvim Takibatı (Tarihli İlerleme) */}
      <Card color={DarkSurfaceCard} radius={10} borderColor={AmberGoldDark} style={{ alignSelf: 'stretch' }}>
        <Column pad={12} gap={8}>
          <Row justify="between" wrap>
            <IkonluMetin gorsel="gunes-saati" gorselRenk={AmberGold} boyut={18}>
              <T size={12} weight="bold" color={AmberGold} heading>
                SİLAHSIZ ARENA TAKVİMİ
              </T>
            </IkonluMetin>
            <T size={11} color={TextMuted}>{`Bugün: ${currentDay}. Gün`}</T>
          </Row>
          <Row gap={6} align="stretch" style={{ alignSelf: 'stretch' }}>
            {forecast.map((scheduleDay, i) => {
              const isCurrentSelected = unarmedState.selectedShowType === scheduleDay.showType;
              return (
                <Surface
                  key={i}
                  onPress={() => onSelectType(scheduleDay.showType)}
                  selected={isCurrentSelected}
                  label={`${scheduleDay.isToday ? 'Bugün' : `${scheduleDay.dayNumber}. Gün`}: ${scheduleDay.title}, ${scheduleDay.showType.categoryName}`}
                  radius={6}
                  color={scheduleDay.isToday ? alpha(AmberGoldDark, 0.35) : DarkBg}
                  borderColor={scheduleDay.isToday ? AmberGold : isCurrentSelected ? TextGold : DarkBorder}
                  borderWidth={1}
                  style={{ flex: 1 }}
                >
                  <Column align="center" style={{ paddingVertical: 8, paddingHorizontal: 4 }}>
                    <T size={9} weight="bold" color={scheduleDay.isToday ? AmberGold : TextMuted}>
                      {scheduleDay.isToday ? 'BUGÜN' : `${scheduleDay.dayNumber}. Gün`}
                    </T>
                    <Spacer h={2} />
                    <Gorsel ad={gosteriGorseli(scheduleDay.showType)} boyut={24} renk={scheduleDay.isToday ? AmberGold : isCurrentSelected ? TextGold : TextLight} />
                    <Spacer h={2} />
                    <T size={9} color={TextLight} lines={1}>
                      {scheduleDay.showType.categoryName}
                    </T>
                  </Column>
                </Surface>
              );
            })}
          </Row>
        </Column>
      </Card>

      {/* Gösteri Türü Seçici Chips */}
      <Row gap={8} align="stretch" style={{ alignSelf: 'stretch' }}>
        {UnarmedShowType.entries.map((type, i) => {
          const isSelected = unarmedState.selectedShowType === type;
          return (
            <Surface
              key={i}
              onPress={() => onSelectType(type)}
              selected={isSelected}
              label={`${type.categoryName}: ${type.title}`}
              radius={8}
              color={isSelected ? AmberGold : DarkSurfaceCard}
              borderColor={isSelected ? AmberGold : DarkBorder}
              borderWidth={1}
              style={{ flex: 1 }}
            >
              <Column align="center" style={{ paddingVertical: 10, paddingHorizontal: 4 }}>
                <Gorsel ad={gosteriGorseli(type)} boyut={26} renk={isSelected ? DarkBg : AmberGold} />
                <Spacer h={2} />
                <T size={11} weight={isSelected ? 'bold' : 'medium'} color={isSelected ? DarkBg : TextLight} lines={1}>
                  {type.categoryName}
                </T>
              </Column>
            </Surface>
          );
        })}
      </Row>

      {/* Seçilen Rakip Kartı */}
      {opp != null ? (
        <Card
          color={DarkSurfaceCard}
          radius={10}
          borderColor={AmberGoldDark}
          style={{ alignSelf: 'stretch' }}
          label={ozet(
            `Gösteri rakibi: ${opp.name}, ${opp.title}`,
            opp.description,
            `Can: ${opp.health}, Güç: ${opp.rawStrength}, Çeviklik: ${opp.agility}, Dayanıklılık: ${opp.endurance}`,
            `Dövüş Stili: ${opp.combatStyle}`
          )}
        >
          <Column pad={14} gap={8}>
            <Row gap={10}>
              <YuvarlakIkon ikon={gosteriRakibiGorseli(opp)} zemin={DarkBg} boyut={52} renk={TextGold} />
              <Column style={{ flex: 1 }}>
                <T weight="bold" color={TextGold} size={15}>
                  {opp.name}
                </T>
                <T size={11} color={TextMuted}>
                  {opp.title}
                </T>
              </Column>
            </Row>

            <T size={12} color={TextLight} lineHeight={16}>
              {opp.description}
            </T>

            {/* Yalın Statlar */}
            <Row justify="around" wrap color={DarkBg} radius={6} pad={8} gap={6} style={{ alignSelf: 'stretch' }}>
              <IkonluMetin gorsel="can" gorselRenk={HealthGreen} boyut={14} gap={3}><T size={11} color={HealthGreen} weight="bold">{`Can: ${opp.health}`}</T></IkonluMetin>
              <IkonluMetin gorsel="kas" gorselRenk={TextGold} boyut={14} gap={3}><T size={11} color={TextGold}>{`Güç: ${opp.rawStrength}`}</T></IkonluMetin>
              <IkonluMetin gorsel="kosu" gorselRenk={MaviAcik} boyut={14} gap={3}><T size={11} color={MaviAcik}>{`Çeviklik: ${opp.agility}`}</T></IkonluMetin>
              <IkonluMetin gorsel="kalkan" gorselRenk={TextLight} boyut={14} gap={3}><T size={11} color={TextLight}>{`Dayanıklılık: ${opp.endurance}`}</T></IkonluMetin>
            </Row>

            <IkonluMetin gorsel="yumruk" gorselRenk={AmberGold} boyut={16}>
              <T size={11} color={AmberGold} weight="medium" style={{ flexShrink: 1 }}>{`Dövüş Stili: ${opp.combatStyle}`}</T>
            </IkonluMetin>
          </Column>
        </Card>
      ) : null}

      {/* Yenile Butonu */}
      <OutlinedBtn onPress={onReroll} contentColor={AmberGold} borderColor={AmberGold} radius={8} style={{ alignSelf: 'stretch' }} gorsel="zar">
        Başka Bir Gösteri Karşılaşması Belirle
      </OutlinedBtn>

      {/* Ödüller & Giriş */}
      <OdulSeridi entryFee={unarmedState.entryFee} rewardGold={unarmedState.rewardGold} rewardExp={unarmedState.rewardExp} rewardFame={unarmedState.rewardFame} odulAdi="Bahşiş" />

      {/* Er Meydanına Çık Butonu */}
      <Btn onPress={onStartFight} color={AmberGold} contentColor={DarkBg} radius={10} textSize={13} style={{ alignSelf: 'stretch', minHeight: 52 }} gorsel="yumruk">
        ER MEYDANINA ÇIK & BOĞUŞMAYA BAŞLA (HAZIRLIK)
      </Btn>
    </Column>
  );
}

export function LabyrinthContent({ player, labyrinthState, onSelectTactic, onReroll, onStartFight }) {
  const trap = labyrinthState.activeTrap;
  const maviTakim =
    `1. ${player.name} (Siz - Seviye ${player.level})\n` + labyrinthState.allies.map((ally, idx) => `${idx + 2}. ${ally.name} (Seviye ${ally.level} • ${ally.title})`).join('\n');
  const kirmiziTakim = labyrinthState.opponents.map((opp, idx) => `${idx + 1}. ${opp.name} (Seviye ${opp.level} • ${opp.title})`).join('\n');
  return (
    <Column gap={14} style={{ alignSelf: 'stretch' }}>
      {/* Tanıtım Kartı */}
      <TanitimKarti
        ust="KATAKOMP LABİRENTİ (3v3)"
        gorsel="labirent"
        rozetGorsel="merdiven"
        rozet={`KAT ${labyrinthState.floorNumber} • SARNIÇ`}
        rozetRenk={color(0xffce93d8)}
        rozetZemin={alpha(color(0xff9c27b0), 0.2)}
        rozetKenar={color(0xffce93d8)}
        baslikMetni="Dinamik Tuzaklar ve 3 Kişilik Takım Mücadelesi"
        aciklama="Surların altındaki karanlık dehlizlerde 3 kişilik rastgele oluşturulan takımlar çarpışır. Koridorlarda aktif tuzaklar bulunur; doğru taktiği seçip takımıyla uyum sağlayan ekip labirentin ödülünü alır."
      />

      {/* Kat Tuzağı Kartı */}
      <Card
        color={DarkSurfaceCard}
        radius={10}
        borderColor={HealthRed}
        style={{ alignSelf: 'stretch' }}
        label={ozet(`Kat tuzağı: ${trap.name}`, `Sınanan: ${trap.testStat}`, trap.description, `Kat Etkisi: ${trap.floorEffect}`)}
      >
        <Row pad={12} gap={10}>
          <YuvarlakIkon ikon={tuzakGorseli(trap)} zemin={alpha(HealthRed, 0.2)} renk={HealthRed} />
          <Column style={{ flex: 1 }}>
            <Row gap={6} wrap>
              <T weight="bold" color={HealthRed} size={13}>
                {trap.name}
              </T>
              <Surface color={DarkBg} radius={4}>
                <T size={10} color={AmberGold} style={{ paddingHorizontal: 4, paddingVertical: 1 }}>{`Sınanan: ${trap.testStat}`}</T>
              </Surface>
            </Row>
            <Spacer h={3} />
            <T size={11} color={TextLight} lineHeight={15}>
              {trap.description}
            </T>
            <Spacer h={2} />
            <IkonluMetin gorsel="kurt-kapani" gorselRenk={color(0xffffb74d)} boyut={14} gap={4} align="start">
              <T size={10} color={color(0xffffb74d)} weight="semibold" style={{ flex: 1 }}>{`Kat Etkisi: ${trap.floorEffect}`}</T>
            </IkonluMetin>
          </Column>
        </Row>
      </Card>

      {/* 3v3 Takımlar Görünümü */}
      <Card color={DarkSurface} radius={10} borderColor={DarkBorder} style={{ alignSelf: 'stretch' }}>
        <Column pad={12} gap={8}>
          <IkonluMetin gorsel="kalkan" gorselRenk={MaviAcik} boyut={18}>
            <T size={12} weight="bold" color={MaviAcik} heading>
              MAVİ TAKIM (SİZ + 2 YOLDAŞ):
            </T>
          </IkonluMetin>
          <T size={12} color={TextLight} lineHeight={18}>
            {maviTakim}
          </T>
          <Spacer h={4} />
          <IkonluMetin gorsel="capraz-kilic" gorselRenk={HealthRed} boyut={18}>
            <T size={12} weight="bold" color={HealthRed} heading>
              KIRMIZI TAKIM (3 RAKİP):
            </T>
          </IkonluMetin>
          <T size={12} color={TextLight} lineHeight={18}>
            {kirmiziTakim}
          </T>
        </Column>
      </Card>

      {/* Takım Taktiği Seçici */}
      <IkonluMetin gorsel="pusula" gorselRenk={AmberGold} boyut={20} gap={6}>
        <T size={13} weight="bold" color={TextGold} heading>
          Takım Dehliz Taktiğini Belirle:
        </T>
      </IkonluMetin>
      <Row gap={6} align="stretch" style={{ alignSelf: 'stretch' }}>
        {LabyrinthTactic.entries.map((tactic, i) => {
          const isSelected = labyrinthState.selectedTactic === tactic;
          return (
            <Surface
              key={i}
              onPress={() => onSelectTactic(tactic)}
              selected={isSelected}
              label={tactic.title}
              radius={8}
              color={isSelected ? AmberGold : DarkSurfaceCard}
              borderColor={isSelected ? AmberGold : DarkBorder}
              borderWidth={1}
              style={{ flex: 1 }}
            >
              <Column align="center" style={{ paddingVertical: 8, paddingHorizontal: 2 }}>
                <Gorsel ad={taktikGorseli(tactic)} boyut={22} renk={isSelected ? DarkBg : AmberGold} />
                <T size={10} weight={isSelected ? 'bold' : 'medium'} color={isSelected ? DarkBg : TextLight} lines={1}>
                  {tactic.title}
                </T>
              </Column>
            </Surface>
          );
        })}
      </Row>
      <IkonluMetin gorsel="bilgi" gorselRenk={HealthGreen} boyut={14} gap={4} align="start" style={{ paddingHorizontal: 4 }}>
        <T size={11} color={HealthGreen} style={{ flex: 1 }}>{`${labyrinthState.selectedTactic.bonusDesc}`}</T>
      </IkonluMetin>

      {/* Dehlizi Yenile Butonu */}
      <OutlinedBtn onPress={onReroll} contentColor={AmberGold} borderColor={AmberGold} radius={8} style={{ alignSelf: 'stretch' }} gorsel="zar">
        Dehliz Tuzağını & Takımları Yeniden Çek
      </OutlinedBtn>

      {/* Ödüller */}
      <OdulSeridi entryFee={labyrinthState.entryFee} rewardGold={labyrinthState.rewardGold} rewardExp={labyrinthState.rewardExp} rewardFame={labyrinthState.rewardFame} />

      {/* Başla Butonu */}
      <Btn onPress={onStartFight} color={AmberGold} contentColor={DarkBg} radius={10} textSize={13} style={{ alignSelf: 'stretch', minHeight: 52 }} gorsel="zindan-kapisi">
        LABİRENT DEHLİZİNE İN (HAZIRLIK)
      </Btn>
    </Column>
  );
}

function ArenaDisciplineLockedCard({ title, description, onBackToSolo }) {
  return (
    <Card color={DarkSurfaceCard} radius={12} borderColor={AmberGoldDark} style={{ alignSelf: 'stretch', marginVertical: 16 }}>
      <Column pad={20} align="center">
        <GorselRozet ad="kilit" boyut={56} renk={AmberGold} kenar={AmberGoldDark} />
        <Spacer h={10} />
        <T heading weight="bold" color={AmberGold} size={16} align="center">{`${title} Kilitli`}</T>
        <Spacer h={8} />
        <T color={TextLight} size={13} align="center" lineHeight={18}>
          {description}
        </T>
        <Spacer h={14} />
        <Btn onPress={onBackToSolo} color={AmberGold} contentColor={DarkBg} radius={8} gorsel="duello">
          1v1 Arena Ligine Dön
        </Btn>
      </Column>
    </Card>
  );
}

function DuoCombatLiveStatusCard({ playerName, playerHp, playerMaxHp, ally, allyHp, enemy1, enemy1Hp, enemy2, enemy2Hp, condition }) {
  const pFrac = playerMaxHp > 0 ? oran(playerHp, playerMaxHp) : 0;
  const aFrac = ally.stats.maxHealth > 0 ? oran(allyHp, ally.stats.maxHealth) : 0;
  const e1Frac = enemy1.stats.maxHealth > 0 ? oran(enemy1Hp, enemy1.stats.maxHealth) : 0;
  const e2Frac = enemy2.stats.maxHealth > 0 ? oran(enemy2Hp, enemy2.stats.maxHealth) : 0;
  const etiket = ozet(
    `2v2 İttifak canlı meydanı, ${condition.name}`,
    `Mavi köşe: ${playerName} ${playerHp} / ${playerMaxHp} HP, ${ally.name} ${allyHp} / ${ally.stats.maxHealth} HP`,
    `Kırmızı köşe: ${enemy1.name} ${enemy1Hp} / ${enemy1.stats.maxHealth} HP, ${enemy2.name} ${enemy2Hp} / ${enemy2.stats.maxHealth} HP`
  );
  const satir = (sol, solRenk, solAgirlik, sag, sagRenk, gorsel) => (
    <Row justify="between">
      <IkonluMetin gorsel={gorsel} gorselRenk={solRenk} boyut={16} style={{ flexShrink: 1 }}>
        <T size={12} color={solRenk} weight={solAgirlik} style={{ flexShrink: 1 }}>
          {sol}
        </T>
      </IkonluMetin>
      <T size={11} color={sagRenk} weight="bold">
        {sag}
      </T>
    </Row>
  );
  return (
    <Card color={DarkSurface} radius={12} borderColor={AmberGold} borderWidth={1.5} style={{ alignSelf: 'stretch' }} label={etiket}>
      <Column pad={14}>
        {/* Header: Title & Condition */}
        <Row justify="between" wrap>
          <IkonluMetin gorsel="capraz-kilic" gorselRenk={AmberGold} boyut={16}>
            <T size={11} weight="bold" color={AmberGold}>
              2v2 İTTİFAK CANLI MEYDANI
            </T>
          </IkonluMetin>
          <Surface radius={4} color={alpha(Mavi, 0.2)} borderColor={Mavi} borderWidth={1}>
            <IkonluMetin gorsel={zeminGorseli(condition)} gorselRenk={MaviAcik} boyut={13} gap={4} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
              <T size={10} weight="bold" color={MaviAcik}>{`${condition.name}`}</T>
            </IkonluMetin>
          </Surface>
        </Row>

        <Spacer h={10} />

        {/* Mavi Köşe (Takımınız) */}
        <IkonluMetin gorsel="kalkan" gorselRenk={MaviAcik} boyut={15}>
          <T size={11} weight="bold" color={MaviAcik}>
            MAVİ KÖŞE (TAKIMINIZ)
          </T>
        </IkonluMetin>
        <Spacer h={4} />

        {/* Player HP Bar */}
        {satir(`${playerName}`, TextGold, 'bold', `${playerHp} / ${playerMaxHp} HP`, HealthGreen, 'kilicli-adam')}
        <Progress value={pFrac} height={6} radius={3} color={playerHp > 0 ? HealthGreen : HealthRed} track={DarkSurfaceCard} />

        <Spacer h={6} />

        {/* Ally HP Bar */}
        {satir(`${ally.name} (${ally.title})`, MaviAcik, 'bold', `${allyHp} / ${ally.stats.maxHealth} HP`, HealthGreen, gladyatorGorseli(ally))}
        <Progress value={aFrac} height={6} radius={3} color={allyHp > 0 ? Mavi : HealthRed} track={DarkSurfaceCard} />

        <Spacer h={12} />

        {/* Kırmızı Köşe (Rakipler) */}
        <IkonluMetin gorsel="capraz-kilic" gorselRenk={HealthRed} boyut={15}>
          <T size={11} weight="bold" color={HealthRed}>
            KIRMIZI KÖŞE (RAKİP İTTİFAK)
          </T>
        </IkonluMetin>
        <Spacer h={4} />

        {/* Enemy 1 HP Bar */}
        {satir(`${enemy1.name} (${enemy1.title})`, HealthRed, 'bold', `${enemy1Hp} / ${enemy1.stats.maxHealth} HP`, HealthRed, gladyatorGorseli(enemy1))}
        <Progress value={e1Frac} height={6} radius={3} color={HealthRed} track={DarkSurfaceCard} />

        <Spacer h={6} />

        {/* Enemy 2 HP Bar */}
        {satir(`${enemy2.name} (${enemy2.title})`, HealthRed, 'bold', `${enemy2Hp} / ${enemy2.stats.maxHealth} HP`, HealthRed, gladyatorGorseli(enemy2))}
        <Progress value={e2Frac} height={6} radius={3} color={HealthRed} track={DarkSurfaceCard} />
      </Column>
    </Card>
  );
}

function DuoCombatResultCard({ result, onDismiss }) {
  const baslikMetni = result.isPlayerWinner ? '2v2 İTTİFAK ZAFERİ!' : 'İTTİFAK MAĞLUBİYETİ';
  const aciklama = result.isPlayerWinner
    ? `Mavi Köşe (${result.player.name} & ${result.ally.name}) Taş Hisar kura arenasını fethetti!`
    : `Kırmızı Köşe (${result.enemy1.name} & ${result.enemy2.name}) karşısında ittifakınız düştü.`;
  const kazanc = `+${result.earnedGold} Altın, +${result.earnedExp} EXP${result.earnedFame > 0 ? `, +${result.earnedFame} Şöhret` : ''}`;
  const istatistik = `Süre: ${result.totalRounds} Tur. Takım Hasarı: ${result.totalTeamDamage}. Rakip Hasarı: ${result.totalOpponentDamage}`;

  useAcilisDuyurusu(ozet(baslikMetni, aciklama, istatistik, kazanc));

  const sutun = (ad, deger, renk, gorsel) => (
    <Column align="center">
      <Gorsel ad={gorsel} boyut={18} renk={renk} />
      <T size={10} color={TextMuted}>
        {ad}
      </T>
      <T size={12} weight="bold" color={renk}>
        {deger}
      </T>
    </Column>
  );

  return (
    <Card color={DarkSurfaceCard} radius={12} borderColor={result.isPlayerWinner ? AmberGold : HealthRed} borderWidth={1.5} style={{ alignSelf: 'stretch' }}>
      <Column pad={16} align="center">
        <GorselRozet ad={sonucGorseli(false, result.isPlayerWinner)} boyut={60} renk={result.isPlayerWinner ? TextGold : HealthRed} kenar={result.isPlayerWinner ? AmberGold : HealthRed} zemin={alpha(DarkBg, 0.45)} />
        <Spacer h={8} />
        <T heading weight="bold" color={result.isPlayerWinner ? TextGold : HealthRed} size={18} align="center">
          {baslikMetni}
        </T>
        <Spacer h={4} />
        <T size={12} color={TextLight} align="center">
          {aciklama}
        </T>

        <Spacer h={12} />

        {/* İstatistikler */}
        <Surface color={DarkBg} radius={8} style={{ alignSelf: 'stretch' }} label={istatistik}>
          <Row justify="around" pad={10}>
            {sutun('Süre', `${result.totalRounds} Tur`, TextGold, 'kum-saati')}
            {sutun('Takım Hasarı', `${result.totalTeamDamage}`, HealthGreen, 'kilic')}
            {sutun('Rakip Hasarı', `${result.totalOpponentDamage}`, HealthRed, 'kilic-yarasi')}
          </Row>
        </Surface>

        <Spacer h={10} />

        {/* Kazançlar */}
        <Row justify="evenly" wrap style={{ alignSelf: 'stretch' }} label={kazanc}>
          <IkonluMetin gorsel="sikke" gorselRenk={AmberGold}><T color={AmberGold} weight="bold" size={12}>{`+${result.earnedGold} Altın`}</T></IkonluMetin>
          <IkonluMetin gorsel="yildiz-madalya" gorselRenk={TextGold}><T color={TextGold} weight="bold" size={12}>{`+${result.earnedExp} EXP`}</T></IkonluMetin>
          {result.earnedFame > 0 ? (
            <IkonluMetin gorsel="defne" gorselRenk={HealthGreen}><T color={HealthGreen} weight="bold" size={12}>{`+${result.earnedFame} Şöhret`}</T></IkonluMetin>
          ) : null}
        </Row>

        {result.synergyHighlights.length > 0 ? (
          <>
            <Spacer h={10} />
            <Surface color={DarkBg} radius={6} style={{ alignSelf: 'stretch' }}>
              <Column pad={8}>
                <IkonluMetin gorsel="el-sikisma" gorselRenk={AmberGold} boyut={16}>
                  <T size={11} weight="bold" color={AmberGold}>
                    Takım Uyum Analizi:
                  </T>
                </IkonluMetin>
                {result.synergyHighlights.map((highlight, i) => (
                  <T key={i} size={10} color={alpha(TextLight, 0.9)}>{`• ${highlight}`}</T>
                ))}
              </Column>
            </Surface>
          </>
        ) : null}

        <Spacer h={16} />

        <Btn onPress={onDismiss} color={AmberGold} contentColor={DarkBg} radius={8} style={{ alignSelf: 'stretch', minHeight: 42 }} gorsel="arena">
          Arenaya Dön (Yeni Kura Çevir)
        </Btn>
      </Column>
    </Card>
  );
}

function UnarmedCombatResultCard({ result, onDismiss }) {
  const baslikMetni = result.playerWon ? 'ZARAFET VE BEDEN ZAFERİ!' : 'SAYGIYLA DİZ ÇÖKÜŞ';
  const otherName = result.playerWon ? result.loserName : result.winnerName;
  const kazanc = result.playerWon ? `+${result.goldEarned} Altın, +${result.expEarned} EXP, +${result.fameEarned} Şöhret` : null;

  useAcilisDuyurusu(
    ozet(
      baslikMetni,
      result.victoryReason,
      `Senin Durumun: ${result.playerClothingCondition.label}`,
      `${otherName} Durumu: ${result.opponentClothingCondition.label}`,
      kazanc
    )
  );

  return (
    <Card color={DarkSurfaceCard} radius={12} borderColor={result.playerWon ? AmberGold : MaviAcik} borderWidth={1.5} style={{ alignSelf: 'stretch' }}>
      <Column pad={16} align="center" gap={10}>
        <GorselRozet ad={result.playerWon ? 'defne' : 'el-sikisma'} boyut={60} renk={result.playerWon ? TextGold : color(0xff90caf9)} kenar={result.playerWon ? AmberGold : MaviAcik} zemin={alpha(DarkBg, 0.45)} />
        <T heading weight="bold" color={result.playerWon ? TextGold : color(0xff90caf9)} size={17} align="center">
          {baslikMetni}
        </T>

        <T size={12} color={TextLight} align="center">
          {result.victoryReason}
        </T>

        {/* Kıyafet Deformasyon / Durum Kartı */}
        <Surface color={DarkBg} radius={8} style={{ alignSelf: 'stretch' }}>
          <Column pad={10} gap={6}>
            <IkonluMetin gorsel="roma-togasi" gorselRenk={AmberGold} boyut={16}>
              <T size={11} weight="bold" color={AmberGold}>
                Kuşam & Ten Durumu:
              </T>
            </IkonluMetin>
            <Row justify="between" label={`Senin Durumun: ${result.playerClothingCondition.label}`}>
              <T size={11} color={TextMuted}>
                Senin Durumun:
              </T>
              <T size={11} color={TextGold} weight="medium" style={{ flexShrink: 1 }}>
                {result.playerClothingCondition.label}
              </T>
            </Row>
            <Row justify="between" label={`${otherName} Durumu: ${result.opponentClothingCondition.label}`}>
              <T size={11} color={TextMuted}>{`${otherName} Durumu:`}</T>
              <T size={11} color={TextLight} weight="medium" style={{ flexShrink: 1 }}>
                {result.opponentClothingCondition.label}
              </T>
            </Row>
          </Column>
        </Surface>

        {/* Ödüller */}
        {result.playerWon ? (
          <Surface color={alpha(AmberGoldDark, 0.2)} radius={8} borderColor={AmberGoldDark} borderWidth={1} style={{ alignSelf: 'stretch' }} label={kazanc}>
            <Row justify="around" wrap pad={10}>
              <IkonluMetin gorsel="sikke" gorselRenk={AmberGold}><T size={12} weight="bold" color={AmberGold}>{`+${result.goldEarned} Altın`}</T></IkonluMetin>
              <IkonluMetin gorsel="yildiz-madalya" gorselRenk={TextGold}><T size={12} weight="bold" color={TextGold}>{`+${result.expEarned} EXP`}</T></IkonluMetin>
              <IkonluMetin gorsel="defne" gorselRenk={HealthGreen}><T size={12} weight="bold" color={HealthGreen}>{`+${result.fameEarned} Şöhret`}</T></IkonluMetin>
            </Row>
          </Surface>
        ) : null}

        <Btn onPress={onDismiss} color={AmberGold} contentColor={DarkBg} radius={8} style={{ alignSelf: 'stretch', minHeight: 42 }} gorsel="kapi">
          Meydandan Ayrıl
        </Btn>
      </Column>
    </Card>
  );
}
