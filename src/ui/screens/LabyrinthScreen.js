// KT/ui/screens/LabyrinthScreen.kt karşılığı: Katakomp Labirenti (biyom seçimi, oda keşfi, tuzak/bulmaca/gladyatör/sandık, otomatik savaş).
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import * as kt from '../../kt.js';
import { LabyrinthBiomeType, AllianceDecision } from '../../domain/model.js';
import { GladiatorPsychologyCard } from '../components/GladiatorPsychologyView.js';
import { CombatLiveStatusCard, CombatLogBubble } from './ArenaScreen.js';
import { Column, Row, Surface, Card, Spacer, T, Btn, TextBtn, AlertDialog, useFlow, announce } from '../kit.js';
import { AmberGold, AmberGoldDark, AmberGoldLight, DarkBg, DarkBorder, DarkSurface, DarkSurfaceCard, TextGold, TextLight, TextMuted, HealthGreen, HealthRed, Color, Typography, alpha, color } from '../theme.js';

/** Düz renkli küçük eylem düğmesi (Kotlin'de Button(colors = containerColor) + 10.sp kalın yazı). */
function EylemDugmesi({ onPress, zemin, children, style, yazi = 10 }) {
  return (
    <Btn onPress={onPress} color={zemin} contentColor={Color.White} radius={6} pad={6} style={[{ flex: 1 }, style]}>
      <T size={yazi} weight="bold" color={Color.White} align="center">
        {children}
      </T>
    </Btn>
  );
}

export function LabyrinthScreen({ viewModel, modifier }) {
  const player = useFlow(viewModel.player);
  const activeRun = useFlow(viewModel.activeLabyrinthRun);
  const labMessage = useFlow(viewModel.labyrinthMessage);

  const isLabyrinthFighting = useFlow(viewModel.isLabyrinthFighting);
  const labyrinthCombatResult = useFlow(viewModel.labyrinthCombatResult);
  const labyrinthLiveEnemy = useFlow(viewModel.labyrinthLiveEnemy);
  const labyrinthLivePlayerHp = useFlow(viewModel.labyrinthLivePlayerHp);
  const labyrinthLiveEnemyHp = useFlow(viewModel.labyrinthLiveEnemyHp);
  const labyrinthCombatLogs = useFlow(viewModel.labyrinthCombatLogs);

  const [selectedBiomeForRun, setSelectedBiomeForRun] = useState(null);
  const [inspectedGladiator, setInspectedGladiator] = useState(null);

  const allEnemies = useMemo(() => viewModel.getFullGladiatorPool(), [viewModel]);

  const run = activeRun;
  const currentChamber = run != null ? kt.getOrNull(run.chambers, run.currentChamberIndex) : null;
  const chamberEnemyId = currentChamber != null ? currentChamber.enemyId : null;
  const chamberEnemy = useMemo(() => (chamberEnemyId != null ? kt.firstOrNull(allEnemies, (it) => it.id === chamberEnemyId) : null), [allEnemies, chamberEnemyId]);

  // ---- VoiceOver duyuruları ----
  // Labirent mesajı (oda sonucu, tuzak, bulmaca vb.)
  useEffect(() => {
    if (labMessage != null) announce(labMessage);
  }, [labMessage]);

  // Yeni odaya geçince oda başlığı
  const odaAnahtari = run != null && currentChamber != null ? `${run.currentChamberIndex}|${currentChamber.title}` : null;
  useEffect(() => {
    if (run != null && currentChamber != null) {
      announce(`Oda ${run.currentChamberIndex + 1} / ${run.chambers.length}: ${currentChamber.title}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [odaAnahtari]);

  // Canlı savaş akışı: yeni hamleler okunur (CombatLogBubble etiketiyle aynı metin; kit aynı metni iki kez okumaz)
  const okunanHamle = useRef(0);
  useEffect(() => {
    const logs = labyrinthCombatLogs || [];
    if (logs.length < okunanHamle.current) okunanHamle.current = 0;
    for (let i = okunanHamle.current; i < logs.length; i++) {
      const log = logs[i];
      announce(`Hamle ${log.round}: ${log.narrativeText}`);
    }
    okunanHamle.current = logs.length;
  }, [labyrinthCombatLogs]);

  let govde;
  if (isLabyrinthFighting || labyrinthCombatResult != null) {
    // =================================================================
    // ⚔️ LABİRENT OTOMATİK CANLI SAVAŞ GÖRÜNÜMÜ (ARENA İLE AYNI MANTIK)
    // =================================================================
    const combatEnemy = labyrinthLiveEnemy;
    govde = (
      <>
        {combatEnemy != null ? (
          <CombatLiveStatusCard
            playerName={player.name}
            playerHp={labyrinthLivePlayerHp}
            playerMaxHp={player.totalStats.maxHealth}
            enemyName={combatEnemy.name}
            enemyHp={labyrinthLiveEnemyHp}
            enemyMaxHp={combatEnemy.stats.maxHealth}
          />
        ) : null}

        <Surface radius={8} color={DarkSurfaceCard} borderColor={AmberGold} borderWidth={1} style={{ alignSelf: 'stretch' }}>
          <Row pad={10} gap={8}>
            <T size={18} hidden>
              ⚔️
            </T>
            <T heading weight="bold" color={TextGold} size={13} style={{ flexShrink: 1 }}>
              Labirent Dehliz Çatışması (Otomatik Savaş Akışı)
            </T>
          </Row>
        </Surface>

        <Column gap={8} style={{ alignSelf: 'stretch' }}>
          {(labyrinthCombatLogs || []).map((log, i) => (
            <CombatLogBubble key={i} log={log} />
          ))}
        </Column>

        {labyrinthCombatResult != null ? (
          <LabyrinthCombatResultCard
            result={labyrinthCombatResult}
            enemyName={combatEnemy?.name ?? 'Rakip Gladyatör'}
            onDismiss={() => viewModel.dismissLabyrinthCombatModal()}
          />
        ) : null}
      </>
    );
  } else if (activeRun == null) {
    // =================================================================
    // 🌀 1. LABİRENT GİRİŞ & BİYOM SEÇİM MERKEZİ (HUB VIEW)
    // =================================================================
    const isRandomSelected = selectedBiomeForRun == null;
    govde = (
      <>
        <Card color={DarkSurfaceCard} radius={12} borderColor={AmberGold} borderWidth={1} style={{ alignSelf: 'stretch' }}>
          <Column pad={14}>
            <Row justify="between" gap={8} style={{ alignSelf: 'stretch' }}>
              <T heading style={Typography.titleMedium} color={TextGold} weight="bold">
                🌀 KATAKOMP LABİRENTİ
              </T>
              <Surface radius={6} color={DarkBg} borderColor={color(0xffce93d8)} borderWidth={1} label="Giriş: 35 altın" style={{ paddingHorizontal: 8, paddingVertical: 3 }}>
                <T size={11} weight="bold" color={color(0xffce93d8)}>
                  GİRİŞ: 35 🪙
                </T>
              </Surface>
            </Row>

            <Spacer h={6} />

            <T size={12} color={alpha(TextLight, 0.9)} lineHeight={17}>
              Taş Hisar surlarının altındaki yüzlerce yıllık kadim dehlizler! Her seferinde farklı bir biyom, ölümcül tuzaklar, zeka bulmacaları ve yaşayan gladyatörlerin kurduğu ya da bozduğu ittifaklarla dolu dinamik bir sınav sahası.
            </T>
          </Column>
        </Card>

        {/* Biyom Seçim Kartları */}
        <T heading size={12} weight="bold" color={AmberGoldLight}>
          🌍 Keşfedilecek Biyom & Ekosistem Seçimi:
        </T>

        <Column gap={8} style={{ alignSelf: 'stretch' }}>
          {/* Rastgele Biyom */}
          <Surface
            onPress={() => setSelectedBiomeForRun(null)}
            selected={isRandomSelected}
            label="Rastgele Biyom (Zindan Muhafızlarının Tercihi). 6 kadim ekosistemden biri rastgele seçilir; kader seni nereye sürüklerse!"
            radius={8}
            color={isRandomSelected ? color(0xff2a241c) : DarkSurface}
            borderColor={isRandomSelected ? AmberGold : DarkBorder}
            borderWidth={1}
            style={{ alignSelf: 'stretch' }}
          >
            <Row pad={12} gap={10}>
              <T size={24}>🎲</T>
              <Column style={{ flex: 1 }}>
                <T size={12} weight="bold" color={isRandomSelected ? TextGold : TextLight}>
                  Rastgele Biyom (Zindan Muhafızlarının Tercihi)
                </T>
                <T size={10} color={TextMuted}>
                  6 kadim ekosistemden biri rastgele seçilir; kader seni nereye sürüklerse!
                </T>
              </Column>
            </Row>
          </Surface>

          {/* Belirli Biyomlar */}
          {LabyrinthBiomeType.values().map((biome) => {
            const isSelected = selectedBiomeForRun === biome;
            return (
              <Surface
                key={biome.name}
                onPress={() => setSelectedBiomeForRun(biome)}
                selected={isSelected}
                label={`${biome.title}. ${biome.shortDescription} • Başlıca Tehdit: ${biome.dominantHazardType}`}
                radius={8}
                color={isSelected ? color(0xff2a241c) : DarkSurface}
                borderColor={isSelected ? AmberGold : alpha(DarkBorder, 0.6)}
                borderWidth={1}
                style={{ alignSelf: 'stretch' }}
              >
                <Row pad={10} gap={10}>
                  <T size={22}>{biome.icon}</T>
                  <Column style={{ flex: 1 }}>
                    <T size={12} weight="bold" color={isSelected ? TextGold : TextLight}>
                      {biome.title}
                    </T>
                    <T size={10} color={TextMuted} lineHeight={13}>
                      {`${biome.shortDescription} • Başlıca Tehdit: ${biome.dominantHazardType}`}
                    </T>
                  </Column>
                </Row>
              </Surface>
            );
          })}
        </Column>

        {/* Başlatma Butonu */}
        <Btn onPress={() => viewModel.startLabyrinthRun(selectedBiomeForRun)} color={AmberGoldDark} contentColor={TextLight} radius={8} style={{ alignSelf: 'stretch', minHeight: 50 }}>
          <T weight="bold" size={14} color={TextLight} align="center">
            🌀 LABİRENTE GİRİŞ YAP (35 Altın)
          </T>
        </Btn>
      </>
    );
  } else {
    // =================================================================
    // 🏰 2. AKTİF LABİRENT KOŞUSU & ODA KEŞFİ (ACTIVE RUN EXPLORATION)
    // =================================================================
    const echo = run.recentDistantEchoes.length > 0 ? run.recentDistantEchoes[0] : null;
    const hz = currentChamber?.hazard ?? null;
    const pz = currentChamber?.puzzle ?? null;
    const chest = currentChamber?.chestReward ?? null;
    const enemy = currentChamber?.enemyId != null ? chamberEnemy : null;

    govde = (
      <>
        {/* Üst Başlık & Biyom Rozeti */}
        <Surface radius={10} color={color(0xff1c1814)} borderColor={AmberGold} borderWidth={1} style={{ alignSelf: 'stretch' }}>
          <Column pad={12}>
            <Row justify="between" gap={8} style={{ alignSelf: 'stretch' }}>
              <Row gap={8} heading label={`${run.themeTitle}, Oda ${run.currentChamberIndex + 1} / ${run.chambers.length}`} style={{ flexShrink: 1 }}>
                <T size={24}>{run.biome.icon}</T>
                <Column style={{ flexShrink: 1 }}>
                  <T size={14} weight="bold" color={TextGold}>
                    {run.themeTitle}
                  </T>
                  <T size={11} weight="semibold" color={AmberGoldLight}>
                    {`Oda ${run.currentChamberIndex + 1} / ${run.chambers.length}`}
                  </T>
                </Column>
              </Row>

              <Btn onPress={() => viewModel.abandonLabyrinthRun()} color={color(0xff4a1a1a)} contentColor={HealthRed} radius={6} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                <T size={11} color={HealthRed}>
                  🚪 Kaçış
                </T>
              </Btn>
            </Row>

            <Spacer h={8} />

            {/* Oda İlerleme Adım Çubuğu (dekoratif; oda sayısı yukarıda okunur) */}
            <Row hidden justify="between" style={{ alignSelf: 'stretch' }}>
              {run.chambers.map((_, idx) => {
                const isCurrent = idx === run.currentChamberIndex;
                const isPassed = idx < run.currentChamberIndex;
                const boxColor = isCurrent ? AmberGold : isPassed ? HealthGreen : DarkBorder;
                return (
                  <View key={idx} style={{ flex: 1, height: 6, paddingHorizontal: 2 }}>
                    <View style={{ flex: 1, borderRadius: 3, backgroundColor: boxColor }} />
                  </View>
                );
              })}
            </Row>
          </Column>
        </Surface>

        {/* Canlı Bildirim / Sonuç Mesajı */}
        {labMessage != null ? (
          <Surface radius={8} color={color(0xff1e281f)} borderColor={alpha(HealthGreen, 0.7)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
            <T size={11} weight="semibold" color={TextLight} style={{ padding: 10 }}>
              {labMessage}
            </T>
          </Surface>
        ) : null}

        {/* Arka Plan Gladyatör Yankıları (Canlı Dehliz Fısıltıları) */}
        {echo != null ? (
          <Surface radius={8} color={color(0xff1a1320)} borderColor={alpha(color(0xff9c27b0), 0.5)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
            <Row pad={10} gap={8} label={`Uzak Dehliz Yankısı (${echo.echoType.title}): ${echo.narrative}`}>
              <T size={18}>{echo.echoType.icon}</T>
              <Column style={{ flexShrink: 1 }}>
                <T size={10} weight="bold" color={color(0xffce93d8)}>
                  {`📢 Uzak Dehliz Yankısı (${echo.echoType.title}):`}
                </T>
                <T size={10} color={alpha(TextLight, 0.9)} lineHeight={14}>
                  {echo.narrative}
                </T>
              </Column>
            </Row>
          </Surface>
        ) : null}

        {/* Mevcut Oda Kartı */}
        {currentChamber != null ? (
          <>
            <Surface radius={10} color={DarkSurfaceCard} borderColor={DarkBorder} borderWidth={1} style={{ alignSelf: 'stretch' }}>
              <Column pad={12}>
                <T heading size={14} weight="bold" color={TextGold}>
                  {currentChamber.title}
                </T>
                <Spacer h={4} />
                <T size={11} color={TextLight} lineHeight={16}>
                  {currentChamber.description}
                </T>
              </Column>
            </Surface>

            {/* ⚠️ TEHLİKE / TUZAK OLAYI */}
            {hz != null ? (
              <Surface radius={10} color={color(0xff261818)} borderColor={HealthRed} borderWidth={1} style={{ alignSelf: 'stretch' }}>
                <Column pad={12}>
                  <Row gap={6} heading label={`TEHLİKE: ${hz.name}`}>
                    <T size={16}>{hz.category.icon}</T>
                    <T size={12} weight="bold" color={HealthRed} style={{ flexShrink: 1 }}>
                      {`TEHLİKE: ${hz.name}`}
                    </T>
                  </Row>
                  <Spacer h={4} />
                  <T size={11} color={TextLight} lineHeight={15}>
                    {hz.triggerNarrative}
                  </T>
                  <Spacer h={10} />

                  {/* Savuşturma Seçenekleri */}
                  <Row gap={6} align="stretch" style={{ alignSelf: 'stretch' }}>
                    <EylemDugmesi onPress={() => viewModel.resolveCurrentHazard('AGILITY')} zemin={color(0xff1e3a2f)}>
                      💨 Çevik Sıyrılış
                    </EylemDugmesi>
                    <EylemDugmesi onPress={() => viewModel.resolveCurrentHazard('SHIELD')} zemin={color(0xff233142)}>
                      🛡️ Kalkan Siperi
                    </EylemDugmesi>
                    <EylemDugmesi onPress={() => viewModel.resolveCurrentHazard('STRENGTH')} zemin={color(0xff422b1e)}>
                      🔨 Yarıp Geç
                    </EylemDugmesi>
                  </Row>
                </Column>
              </Surface>
            ) : null}

            {/* 🧩 BULMACA / MEKANİZMA OLAYI */}
            {pz != null ? (
              <Surface radius={10} color={color(0xff1e242b)} borderColor={color(0xff64b5f6)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
                <Column pad={12}>
                  <Row gap={6} heading label={`BULMACA: ${pz.title}`}>
                    <T size={16}>{pz.type.icon}</T>
                    <T size={12} weight="bold" color={color(0xff64b5f6)} style={{ flexShrink: 1 }}>
                      {`BULMACA: ${pz.title}`}
                    </T>
                  </Row>
                  <Spacer h={4} />
                  <T size={11} color={TextLight} lineHeight={15}>
                    {pz.description}
                  </T>
                  <Spacer h={4} />
                  <T size={10} color={AmberGoldLight} italic>
                    {`💡 İpucu: ${pz.clueText}`}
                  </T>
                  <Spacer h={10} />

                  <Row gap={8} align="stretch" style={{ alignSelf: 'stretch' }}>
                    <EylemDugmesi onPress={() => viewModel.solveCurrentPuzzle(0)} zemin={AmberGoldDark}>
                      ✨ Mantıkla Çöz
                    </EylemDugmesi>
                    <EylemDugmesi onPress={() => viewModel.solveCurrentPuzzle(1)} zemin={color(0xff37474f)}>
                      🎲 Şansına Kolu Çek
                    </EylemDugmesi>
                  </Row>
                </Column>
              </Surface>
            ) : null}

            {/* ⚔️ GLADYATÖR KARŞILAŞMASI (YAŞAYAN PSİKOLOJİ İLE ETKİLEŞİM) */}
            {enemy != null ? (
              <Surface radius={10} color={color(0xff241c16)} borderColor={AmberGoldLight} borderWidth={1} style={{ alignSelf: 'stretch' }}>
                <Column pad={12}>
                  <Row justify="between" gap={8} style={{ alignSelf: 'stretch' }}>
                    <Row gap={8} heading label={`Karşılaşma: ${enemy.name} (${enemy.title}). Mizaç: ${enemy.personality.psychology.behavioralBadge}`} style={{ flexShrink: 1 }}>
                      <T size={20}>⚔️</T>
                      <Column style={{ flexShrink: 1 }}>
                        <T size={12} weight="bold" color={TextGold}>
                          {`Karşılaşma: ${enemy.name} (${enemy.title})`}
                        </T>
                        <T size={10} weight="semibold" color={AmberGoldLight}>
                          {`Mizaç: ${enemy.personality.psychology.behavioralBadge}`}
                        </T>
                      </Column>
                    </Row>

                    <TextBtn onPress={() => setInspectedGladiator(enemy)} label={`Zihin, ${enemy.name}`}>
                      <T size={11} color={AmberGold}>
                        🧠 Zihin
                      </T>
                    </TextBtn>
                  </Row>

                  <Spacer h={8} />

                  {/* Etkileşim Butonları */}
                  <Row gap={6} align="stretch" style={{ alignSelf: 'stretch' }}>
                    <EylemDugmesi
                      onPress={() => {
                        const decision = enemy.personality.psychology.evaluateAllianceOffer();
                        if (decision === AllianceDecision.HOSTILE_REFUSAL) {
                          viewModel.showMessage(`⚔️ ${enemy.name} hırlayarak kılıcını çekti: 'Bu dehlizde dostluk yok!' Saldırıya geçti!`);
                          viewModel.startLabyrinthCombat(enemy);
                        } else {
                          viewModel.interactChamberGladiator('ALLIANCE');
                        }
                      }}
                      zemin={color(0xff1e3a2f)}
                    >
                      🤝 İttifak Kur
                    </EylemDugmesi>
                    <EylemDugmesi onPress={() => viewModel.startLabyrinthCombat(enemy)} zemin={color(0xff5a1e1e)}>
                      ⚔️ Dövüşe Tutuş
                    </EylemDugmesi>
                    <EylemDugmesi onPress={() => viewModel.interactChamberGladiator('IGNORE')} zemin={color(0xff2a2a2a)}>
                      🚶 Temkinli Geç
                    </EylemDugmesi>
                  </Row>
                </Column>
              </Surface>
            ) : null}

            {/* 📦 HAZİNE SANDIĞI OLAYI */}
            {chest != null ? (
              <Surface radius={10} color={color(0xff2c2413)} borderColor={AmberGold} borderWidth={1} style={{ alignSelf: 'stretch' }}>
                <Row pad={12} justify="between" gap={8}>
                  <Row gap={8} label={`${chest.title}. Ganimet Değeri: ${chest.minGold}-${chest.maxGold} altın`} style={{ flexShrink: 1 }}>
                    <T size={24}>{chest.icon}</T>
                    <Column style={{ flexShrink: 1 }}>
                      <T size={12} weight="bold" color={TextGold}>
                        {chest.title}
                      </T>
                      <T size={10} color={AmberGoldLight}>
                        {`Ganimet Değeri: ${chest.minGold}-${chest.maxGold} 🪙`}
                      </T>
                    </Column>
                  </Row>

                  <Btn onPress={() => viewModel.openChamberChest()} color={AmberGoldDark} contentColor={Color.White} radius={6} label={`Aç, ${chest.title}`}>
                    <T size={11} weight="bold" color={Color.White}>
                      Aç 🔓
                    </T>
                  </Btn>
                </Row>
              </Surface>
            ) : null}

            {/* İlerleme Butonu */}
            <Spacer h={6} />
            <Btn
              onPress={() => viewModel.advanceLabyrinthChamber()}
              color={currentChamber.isExitChamber ? HealthGreen : AmberGoldDark}
              contentColor={TextLight}
              radius={8}
              style={{ alignSelf: 'stretch', minHeight: 48 }}
            >
              <T weight="bold" size={13} color={TextLight} align="center">
                {currentChamber.isExitChamber ? '🏆 BÜYÜK ÇIKIŞ KEMERİNDEN ÇIK (ZAFER)' : '➡️ Sonraki Odaya İlerle'}
              </T>
            </Btn>
          </>
        ) : null}
      </>
    );
  }

  return (
    <>
      <Column gap={14} style={[{ alignSelf: 'stretch', paddingVertical: 4 }, modifier]}>
        {govde}
      </Column>

      {/* Gladyatör Zihin İnceleme Modalı */}
      {inspectedGladiator != null ? (
        <AlertDialog
          onDismiss={() => setInspectedGladiator(null)}
          containerColor={DarkSurface}
          style={{ borderRadius: 12 }}
          title={
            <T heading size={14} weight="bold" color={TextGold}>
              {`🧠 ${inspectedGladiator.name} - Zihin Çizelgesi`}
            </T>
          }
          text={<GladiatorPsychologyCard psychology={inspectedGladiator.personality.psychology} />}
          confirm={
            <Btn onPress={() => setInspectedGladiator(null)}>
              Kapat
            </Btn>
          }
        />
      ) : null}
    </>
  );
}

function LabyrinthCombatResultCard({ result, enemyName, onDismiss }) {
  const isWin = result.isPlayerWinner;
  const cardBg = isWin ? color(0xff1e3a24) : color(0xff3a1e1e);
  const borderColor = isWin ? HealthGreen : HealthRed;
  const title = isWin ? '🏆 DEHLİZ ZAFERİ!' : '💀 YENİLGİ VE GERİ ÇEKİLİŞ...';
  const subtitle = isWin ? `${enemyName} mağlup oldu ve dehlizden çekildi! Yolun temizlendi.` : `${enemyName} karşısında ağır yaralandın! Canını kurtarmak için labirentten geri çekildin.`;

  // Sonuç kartı belirince VoiceOver'a duyur
  useEffect(() => {
    let metin = `${title} ${subtitle}`;
    if (isWin) {
      metin += ` +${result.earnedGold} Altın, +${result.earnedExp} EXP`;
      if (result.droppedItem != null) metin += `, ${result.droppedItem.name}`;
    }
    announce(metin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <Card color={cardBg} radius={12} borderColor={borderColor} borderWidth={1.5} style={{ alignSelf: 'stretch' }}>
      <Column pad={14} align="center" gap={8}>
        <T heading size={15} weight="bold" color={isWin ? AmberGold : color(0xffff8a80)} align="center">
          {title}
        </T>
        <T size={11} color={TextLight} align="center">
          {subtitle}
        </T>

        {isWin ? (
          <Surface radius={8} color={DarkSurface} style={{ alignSelf: 'stretch' }}>
            <Row pad={10} justify="around" wrap gap={6}>
              <T size={12} weight="bold" color={AmberGold}>{`🪙 +${result.earnedGold} Altın`}</T>
              <T size={12} weight="bold" color={TextGold}>{`⭐ +${result.earnedExp} EXP`}</T>
              {result.droppedItem != null ? <T size={12} weight="bold" color={HealthGreen}>{`🎁 ${result.droppedItem.name}`}</T> : null}
            </Row>
          </Surface>
        ) : null}

        <Btn onPress={onDismiss} color={isWin ? AmberGold : HealthRed} contentColor={isWin ? DarkBg : Color.White} radius={8} style={{ alignSelf: 'stretch', minHeight: 42 }}>
          <T weight="bold" size={12} color={isWin ? DarkBg : Color.White} align="center">
            {isWin ? '🏛️ Dehliz Keşfine Devam Et' : '🚪 Arenaya Geri Dön'}
          </T>
        </Btn>
      </Column>
    </Card>
  );
}
