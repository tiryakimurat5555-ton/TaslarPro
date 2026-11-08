// KT/ui/screens/QuestScreen.kt karşılığı: Sözleşmeler (görevler), Efsanevi Av seferleri ve Demirci zanaat ocağı.
import React, { useEffect, useMemo, useState } from 'react';
import * as kt from '../../kt.js';
import { StarterContent } from '../../data/StarterContent.js';
import { QuestType } from '../../domain/model.js';
import { Column, Row, Box, Surface, Card, Spacer, T, Btn, OutlinedBtn, Divider, Scroll, Tabs, Progress, AlertDialog, Dialog, useFlow, announce, Gorsel, GorselRozet } from '../kit.js';
import { esyaGorseli, gorevGorseli, hammaddeGorseli, maceraGorseli, nadirlikRengi, nitelikGorseli } from '../gorsel-esleme.js';
import {
  AmberGold,
  AmberGoldDark,
  DarkBg,
  DarkBorder,
  DarkSurface,
  DarkSurfaceCard,
  TextGold,
  TextLight,
  TextMuted,
  HealthGreen,
  HealthRed,
  FamePurple,
  Color,
  Typography,
  alpha,
  color,
} from '../theme.js';

const ExpMavisi = color(0xff90caf9);

/** Simge + yanındaki öğe (yalnız görsel; simge VoiceOver'dan gizli, metin olduğu gibi okunur). */
function Ikonlu({ gorsel, renk = AmberGold, boyut = 18, gap = 6, children, style }) {
  return (
    <Row gap={gap} style={style}>
      <Gorsel ad={gorsel} boyut={boyut} renk={renk} />
      {children}
    </Row>
  );
}

export function QuestScreen({ viewModel, onNavigateToArena, modifier }) {
  const player = useFlow(viewModel.player);
  const quests = useFlow(viewModel.quests);
  const adventures = useFlow(viewModel.adventures);
  const craftingRecipes = useFlow(viewModel.craftingRecipes);
  const isAnyTaskRunning = useFlow(viewModel.isAnyTaskRunning);
  const lastQuestClaimResult = useFlow(viewModel.lastQuestClaimResult);

  const [selectedSubTab, setSelectedSubTab] = useState(0); // 0: Sözleşmeler, 1: Efsanevi Av & Zanaat
  const [inspectedCraftItem, setInspectedCraftItem] = useState(null);

  const activeQuests = useMemo(() => quests.filter((it) => !it.isClaimed && !player.completedQuestIds.includes(it.id)), [quests, player.completedQuestIds]);
  const activeAdventures = useMemo(() => adventures.filter((it) => !it.isClaimed), [adventures]);

  const sekmeBasliklari = [
    <Column align="center" gap={3}>
      <Gorsel ad="tomar" boyut={22} renk={selectedSubTab === 0 ? AmberGold : TextMuted} />
      <T
      label={`Sözleşmeler sekmesi, ${activeQuests.length} adet aktif görev mevcut`}
      size={13}
      lines={1}
      weight={selectedSubTab === 0 ? 'bold' : 'medium'}
      color={selectedSubTab === 0 ? TextGold : TextMuted}
      align="center"
    >
      {`Sözleşmeler (${activeQuests.length})`}
      </T>
    </Column>,
    <Column align="center" gap={3}>
      <Gorsel ad="arbalet" boyut={22} renk={selectedSubTab === 1 ? AmberGold : TextMuted} />
      <T
      label={`Efsanevi Av ve Zanaat sekmesi, ${activeAdventures.length} aktif macera ve dövülebilir efsanevi ekipmanlar`}
      size={13}
      lines={1}
      weight={selectedSubTab === 1 ? 'bold' : 'medium'}
      color={selectedSubTab === 1 ? TextGold : TextMuted}
      align="center"
    >
      {`Efsanevi Av & Zanaat (${activeAdventures.length})`}
      </T>
    </Column>,
  ];

  let liste;
  if (selectedSubTab === 0) {
    // --- TAB 0: KASABA SÖZLEŞMELERİ ---
    liste = (
      <>
        <Card color={DarkSurface} radius={12} borderColor={AmberGoldDark} style={{ alignSelf: 'stretch' }}>
          <Column pad={16}>
            <Row gap={12} style={{ alignSelf: 'stretch' }}>
              <GorselRozet ad="tomar" boyut={48} />
              <Column style={{ flex: 1 }}>
                <T style={Typography.labelSmall} color={AmberGold}>
                  SÖZLEŞMELER & GÖREVLER
                </T>
                <Spacer h={4} />
                <T heading style={Typography.titleLarge} color={TextGold} weight="bold">
                  Muhafızlık ve Canavar Avları
                </T>
              </Column>
            </Row>
            <Spacer h={6} />
            <T style={Typography.bodyMedium} color={alpha(TextLight, 0.85)}>
              Savaşçılar sadece arenada kılıç sallamaz; kasaba esnafının ve tüccarların güvenliğini sağlayarak altın ve deneyim temin ederler. Boşta beklemektense karakterini bir sefere gönderebilirsin.
            </T>
          </Column>
        </Card>

        <Ikonlu gorsel="bagli-tomar" boyut={22}>
          <T heading style={Typography.titleMedium} color={TextLight} weight="bold">
            {`Mevcut Sözleşmeler (${activeQuests.length})`}
          </T>
        </Ikonlu>

        {activeQuests.length === 0 ? (
          <Card color={DarkSurface} radius={12} borderColor={alpha(HealthGreen, 0.6)} style={{ alignSelf: 'stretch' }}>
            <Column align="center" pad={24} style={{ alignSelf: 'stretch' }}>
              <GorselRozet ad="kupa" boyut={60} renk={HealthGreen} zemin={alpha(HealthGreen, 0.14)} />
              <Spacer h={10} />
              <T style={Typography.titleMedium} color={AmberGold} weight="bold" align="center">
                Günün Tüm Sözleşmeleri Tamamlandı!
              </T>
              <Spacer h={6} />
              <T style={Typography.bodyMedium} color={alpha(TextLight, 0.85)} align="center" lineHeight={18}>
                {'Kasaba tellalı ve lonca panosundaki tüm sözleşmeler başarıyla yerine getirildi ve ödülleri alındı. Pano bugünlük boş bırakıldı.\n\nYeni muhafızlık sözleşmeleri ve canavar avları yarın şafak söktüğünde panoya asılacaktır.'}
              </T>
            </Column>
          </Card>
        ) : (
          activeQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              player={player}
              isAnyTaskRunning={isAnyTaskRunning}
              onStart={() => viewModel.startQuest(quest.id)}
              onClaim={() => viewModel.claimQuest(quest.id)}
              onHunt={() => {
                if (quest.huntEnemy != null) {
                  viewModel.selectEnemy(quest.huntEnemy);
                  onNavigateToArena();
                }
              }}
            />
          ))
        )}
      </>
    );
  } else {
    // --- TAB 1: EFSANEVİ AVLAR & ZANAAT OCAĞI ---
    const wolfPeltCount = player.getMaterialCount(StarterContent.MAT_WHITE_WOLF_PELT);
    const oreCount = player.getMaterialCount(StarterContent.MAT_METEORITE_ORE);
    liste = (
      <>
        <Card color={DarkSurface} radius={12} borderColor={AmberGoldDark} style={{ alignSelf: 'stretch' }}>
          <Column pad={16}>
            <Row gap={12} style={{ alignSelf: 'stretch' }}>
              <GorselRozet ad="arbalet" boyut={48} />
              <Column style={{ flex: 1 }}>
                <T style={Typography.labelSmall} color={AmberGold}>
                  EFSANEVİ AVLAR & DEMİRCİ ZANAAT OCAĞI
                </T>
                <Spacer h={4} />
                <T heading style={Typography.titleLarge} color={TextGold} weight="bold">
                  Vahşi Doğa Seferleri ve Koşullu Başyapıtlar
                </T>
              </Column>
            </Row>
            <Spacer h={6} />
            <T style={Typography.bodyMedium} color={alpha(TextLight, 0.85)}>
              Karakterini tehlikeli canavar inlerine ve gizemli kraterlere göndererek nadide zanaat malzemeleri topla. Bu seferlerdeki başarı şansın, donandığın zırhın, silahının gücüne ve seviyene göre dinamik olarak hesaplanır! Topladığın parçalarla 2. özel yeteneğe sahip efsanevi ekipmanlar dövebilirsin.
            </T>
          </Column>
        </Card>

        {/* Malzeme Kesesi Durumu */}
        <Card color={DarkSurfaceCard} radius={10} borderColor={DarkBorder} style={{ alignSelf: 'stretch' }}>
          <Column pad={12}>
            <Ikonlu gorsel="heybe" boyut={20}>
              <T heading style={Typography.titleSmall} weight="bold" color={TextGold}>
                Malzeme Kesesi
              </T>
            </Ikonlu>
            <Spacer h={8} />
            <Row gap={10} align="stretch" style={{ alignSelf: 'stretch' }}>
              <Surface
                label={`Ak Kurt Postu: ${wolfPeltCount} Adet`}
                radius={8}
                color={DarkBg}
                borderColor={wolfPeltCount > 0 ? HealthGreen : DarkBorder}
                borderWidth={1}
                pad={8}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <GorselRozet ad="kurt" boyut={34} renk={wolfPeltCount > 0 ? HealthGreen : TextMuted} zemin={alpha(wolfPeltCount > 0 ? HealthGreen : TextMuted, 0.14)} />
                <Column style={{ flexShrink: 1 }}>
                  <T size={11} color={TextMuted}>
                    Ak Kurt Postu
                  </T>
                  <T size={14} weight="bold" color={wolfPeltCount > 0 ? HealthGreen : TextLight}>
                    {`${wolfPeltCount} Adet`}
                  </T>
                </Column>
              </Surface>
              <Surface
                label={`Göktaşı Filizi: ${oreCount} Adet`}
                radius={8}
                color={DarkBg}
                borderColor={oreCount > 0 ? AmberGold : DarkBorder}
                borderWidth={1}
                pad={8}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <GorselRozet ad="kristal" boyut={34} renk={oreCount > 0 ? AmberGold : TextMuted} zemin={alpha(oreCount > 0 ? AmberGold : TextMuted, 0.14)} />
                <Column style={{ flexShrink: 1 }}>
                  <T size={11} color={TextMuted}>
                    Göktaşı Filizi
                  </T>
                  <T size={14} weight="bold" color={oreCount > 0 ? AmberGold : TextLight}>
                    {`${oreCount} Adet`}
                  </T>
                </Column>
              </Surface>
            </Row>
          </Column>
        </Card>

        {/* Efsanevi Seferler Başlığı */}
        <Ikonlu gorsel="kurt" boyut={22}>
          <T heading color={TextLight} weight="bold" style={[Typography.titleMedium, { flexShrink: 1 }]}>
            {`Vahşi Doğa & Canavar Seferleri (${activeAdventures.length})`}
          </T>
        </Ikonlu>

        {activeAdventures.length === 0 ? (
          <Card color={DarkSurface} radius={12} borderColor={alpha(HealthGreen, 0.6)} style={{ alignSelf: 'stretch' }}>
            <Column align="center" pad={20} style={{ alignSelf: 'stretch' }}>
              <GorselRozet ad="kamp-atesi" boyut={56} renk={HealthGreen} zemin={alpha(HealthGreen, 0.14)} />
              <Spacer h={8} />
              <T style={Typography.titleSmall} color={AmberGold} weight="bold" align="center">
                Bugünkü Tüm Seferler Tamamlandı!
              </T>
              <Spacer h={4} />
              <T style={Typography.bodySmall} color={alpha(TextLight, 0.85)} align="center" lineHeight={16}>
                Vahşi doğadaki tüm keşif hedefleri başarıyla yerine getirildi ve ganimetler toplandı. Yeni sefer rotaları yarın şafak söktüğünde açılacaktır.
              </T>
            </Column>
          </Card>
        ) : (
          activeAdventures.map((adventure) => (
            <AdventureCard
              key={adventure.id}
              adventure={adventure}
              player={player}
              isAnyTaskRunning={isAnyTaskRunning}
              onStart={() => viewModel.startAdventure(adventure.id)}
              onClaim={() => viewModel.claimAdventure(adventure.id)}
            />
          ))
        )}

        {/* Demirci Zanaat Ocağı Başlığı */}
        <Spacer h={10} />
        <Ikonlu gorsel="ors" boyut={22}>
          <T heading color={TextGold} weight="bold" style={[Typography.titleMedium, { flexShrink: 1 }]}>
            Demirci Başyapıtları (Koşullu Ekipmanlar)
          </T>
        </Ikonlu>

        {craftingRecipes.map((recipe) => (
          <CraftingRecipeCard
            key={recipe.id}
            recipe={recipe}
            player={player}
            onInspect={() => setInspectedCraftItem(recipe.resultItem)}
            onCraft={() => viewModel.craftEquipment(recipe.id)}
          />
        ))}
      </>
    );
  }

  return (
    <Column fill color={DarkBg} style={modifier}>
      {/* Üst Sekmeler */}
      <Tabs titles={sekmeBasliklari} selected={selectedSubTab} onSelect={setSelectedSubTab} color={DarkSurface} />

      <Scroll gap={14} contentStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        {liste}
        <Spacer h={60} />
      </Scroll>

      {/* Ekipman İnceleme Modalı (Demirci Koşullu Ekipmanı) */}
      {inspectedCraftItem != null ? <CraftedItemDetailDialog item={inspectedCraftItem} onDismiss={() => setInspectedCraftItem(null)} /> : null}

      {/* Görev Tamamlandı & Rapor Modalı */}
      {lastQuestClaimResult != null ? <QuestCompletionDialog result={lastQuestClaimResult} onDismiss={() => viewModel.clearQuestClaimResult()} /> : null}
    </Column>
  );
}

function RequirementBadge({ text, isMet, gorsel }) {
  return (
    <Surface
      label={(isMet ? 'Karşılandı: ' : 'Eksik: ') + text}
      radius={4}
      color={isMet ? color(0xff162b1a) : color(0xff2e1919)}
      borderColor={isMet ? alpha(HealthGreen, 0.8) : alpha(HealthRed, 0.8)}
      borderWidth={1}
      style={{ paddingHorizontal: 6, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 4 }}
    >
      {gorsel ? <Gorsel ad={gorsel} boyut={14} renk={isMet ? HealthGreen : HealthRed} /> : null}
      <T size={11} weight="semibold" color={isMet ? HealthGreen : HealthRed}>
        {(isMet ? '✓ ' : '✗ ') + text}
      </T>
    </Surface>
  );
}

/** Süreli görev/sefer ilerleme çubuğu (Kotlin'de iki kartta aynı kalıp). */
function SureIlerleme({ baslik, bittiMetni, elapsedSeconds, durationSeconds, isFinished }) {
  const frac = kt.coerceIn(elapsedSeconds / durationSeconds, 0, 1);
  const remaining = durationSeconds - elapsedSeconds;
  return (
    <Column style={{ alignSelf: 'stretch' }}>
      <Row justify="between" style={{ alignSelf: 'stretch' }}>
        <Ikonlu gorsel="kum-saati" boyut={14} gap={4} renk={TextMuted}>
          <T size={11} color={TextMuted}>
            {baslik}
          </T>
        </Ikonlu>
        <T size={11} color={isFinished ? HealthGreen : AmberGold}>
          {isFinished ? bittiMetni : `Kalan: ${remaining}s`}
        </T>
      </Row>
      <Spacer h={4} />
      <Progress value={frac} color={isFinished ? HealthGreen : AmberGold} track={DarkSurfaceCard} height={6} radius={3} />
    </Column>
  );
}

function QuestCard({ quest, player, isAnyTaskRunning, onStart, onClaim, onHunt }) {
  const levelOk = player.level >= quest.requiredLevel;
  const minHpReq = quest.requiredMinHpPercent > 0 ? kt.toInt(player.totalStats.maxHealth * (quest.requiredMinHpPercent / 100)) : 0;
  const hpOk = quest.requiredMinHpPercent === 0 || player.currentHealth >= minHpReq;
  const armorOk = quest.requiredMinArmor === 0 || player.totalStats.armor >= quest.requiredMinArmor;
  const damageOk = quest.requiredMinDamage === 0 || player.totalStats.damage >= quest.requiredMinDamage;
  const goldOk = quest.requiredSupplyGold === 0 || player.gold >= quest.requiredSupplyGold;
  const allRequirementsMet = levelOk && hpOk && armorOk && damageOk && goldOk;

  const hasRequirements = quest.requiredLevel > 1 || quest.requiredMinArmor > 0 || quest.requiredMinDamage > 0 || quest.requiredMinHpPercent > 0 || quest.requiredSupplyGold > 0;

  const statusText = quest.isClaimed ? ', Bugünlük tamamlandı' : !allRequirementsMet ? ', Gereksinimler eksik' : '';
  const rozetMetni = quest.chainId != null ? `, Aşama ${quest.chainStep}/${quest.maxChainSteps}` : quest.isRumorQuest ? ', Han Söylentisi' : '';
  const kartEtiketi = `${quest.title}, ${quest.type.title}${statusText}${rozetMetni}`;

  let eylem = null;
  if (quest.type === QuestType.EXPEDITION) {
    let dugme;
    if (quest.isClaimed) {
      dugme = (
        <Surface radius={6} color={color(0xff1b2e1e)} borderColor={HealthGreen} borderWidth={1} style={{ alignSelf: 'stretch', paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Gorsel ad="kupa" boyut={18} renk={HealthGreen} />
          <T size={12} color={HealthGreen} weight="semibold" style={{ flexShrink: 1 }}>
            Bugünlük Sözleşme Tamamlandı (Yarın Yenilenir)
          </T>
        </Surface>
      );
    } else if (quest.isFinished) {
      dugme = (
        <Btn onPress={onClaim} color={HealthGreen} contentColor={Color.White} radius={8} style={{ alignSelf: 'stretch' }} gorsel="hediye">
          <T weight="bold" color={Color.White} align="center">{`Ödülleri Al (+${quest.rewardGold} Altın, +${quest.rewardExp} EXP)`}</T>
        </Btn>
      );
    } else if (quest.isRunning) {
      dugme = (
        <Ikonlu gorsel="kum-saati" boyut={18} gap={8} style={{ alignSelf: 'stretch' }}>
          <T size={12} color={AmberGold} style={{ flex: 1 }}>
            {quest.progressText ?? getDefaultQuestProgressText(quest)}
          </T>
        </Ikonlu>
      );
    } else {
      const metin = isAnyTaskRunning ? 'Başka Bir Görevdesin (Tek Görev Limiti)' : !allRequirementsMet ? 'Gereksinimler Karşılanmadı' : `Sözleşmeyi Başlat (${quest.durationSeconds} sn)`;
      const etkin = allRequirementsMet && !isAnyTaskRunning;
      dugme = (
        <Btn
          onPress={onStart}
          disabled={!etkin}
          color={AmberGold}
          contentColor={DarkBg}
          disabledColor={DarkSurfaceCard}
          disabledContentColor={TextMuted}
          radius={8}
          style={{ alignSelf: 'stretch' }}
          gorsel={isAnyTaskRunning ? 'kum-saati' : !allRequirementsMet ? 'kilit' : 'patika'}
        >
          <T weight="bold" color={etkin ? DarkBg : TextMuted} align="center">
            {metin}
          </T>
        </Btn>
      );
    }
    eylem = (
      <>
        {quest.isRunning ? (
          <>
            <SureIlerleme baslik="Sözleşme İlerleyişi" bittiMetni="Tamamlandı!" elapsedSeconds={quest.elapsedSeconds} durationSeconds={quest.durationSeconds} isFinished={quest.isFinished} />
            <Spacer h={10} />
          </>
        ) : null}
        {dugme}
      </>
    );
  } else {
    // Canavar Avı Eylemi
    eylem = (
      <Btn onPress={onHunt} color={HealthRed} contentColor={Color.White} radius={8} style={{ alignSelf: 'stretch' }} gorsel="capraz-kilic">
        <T weight="bold" color={Color.White}>
          Yaratığı Arenada Avla
        </T>
      </Btn>
    );
  }

  return (
    <Card color={DarkSurface} radius={10} borderColor={DarkBorder} borderWidth={1} style={{ alignSelf: 'stretch' }}>
      <Column pad={14}>
        <Row justify="between" style={{ alignSelf: 'stretch' }} gap={8}>
          <GorselRozet ad={gorevGorseli(quest)} boyut={44} renk={quest.type === QuestType.MONSTER_HUNT ? HealthRed : AmberGold} zemin={alpha(quest.type === QuestType.MONSTER_HUNT ? HealthRed : AmberGold, 0.14)} />
          <Column label={kartEtiketi} heading style={{ flex: 1 }}>
            <T weight="bold" color={TextGold} size={16}>
              {quest.title}
            </T>
            <Row gap={6} wrap>
              <T size={12} color={AmberGoldDark}>
                {quest.type.title}
              </T>
              {quest.chainId != null ? (
                <Surface radius={4} color={alpha(FamePurple, 0.2)} borderColor={FamePurple} borderWidth={1} style={{ paddingHorizontal: 5, paddingVertical: 1, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Gorsel ad="kontrol-listesi" boyut={12} renk={FamePurple} />
                  <T size={10} weight="bold" color={FamePurple}>
                    {`Aşama ${quest.chainStep}/${quest.maxChainSteps}`}
                  </T>
                </Surface>
              ) : quest.isRumorQuest ? (
                <Surface radius={4} color={alpha(AmberGold, 0.2)} borderColor={AmberGold} borderWidth={1} style={{ paddingHorizontal: 5, paddingVertical: 1, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Gorsel ad="fisilti" boyut={12} renk={AmberGold} />
                  <T size={10} weight="bold" color={AmberGold}>
                    Han Söylentisi
                  </T>
                </Surface>
              ) : null}
            </Row>
          </Column>
          <Surface radius={6} color={DarkSurfaceCard} label={`Ödül: ${quest.rewardGold} Altın, ${quest.rewardExp} EXP`} style={{ paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Gorsel ad={nitelikGorseli('altin')} boyut={15} renk={AmberGold} />
            <T size={11} color={AmberGold}>
              {`${quest.rewardGold} Altın • ${quest.rewardExp} EXP`}
            </T>
          </Surface>
        </Row>

        <Spacer h={8} />
        <T size={13} color={alpha(TextLight, 0.9)}>
          {quest.description}
        </T>

        {quest.successChancePercent < 100 ? (
          <>
            <Spacer h={6} />
            <Surface
              label={`Riskli keşif görevi: Yüzde ${quest.successChancePercent} başarı şansı.`}
              radius={4}
              color={color(0xff38260e)}
              borderColor={AmberGold}
              borderWidth={1}
              style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Gorsel ad="zar" boyut={14} renk={AmberGold} />
              <T size={11} weight="bold" color={AmberGold}>
                {`%${quest.successChancePercent} Başarı Şansı (Riskli Keşif)`}
              </T>
            </Surface>
          </>
        ) : null}

        {quest.rewardItem != null ? (
          <>
            <Spacer h={6} />
            <Ikonlu gorsel="hediye" boyut={16} renk={FamePurple}>
              <T size={12} weight="bold" color={FamePurple} style={{ flexShrink: 1 }}>
                {`Özel Ödül: ${quest.rewardItem.name}`}
              </T>
            </Ikonlu>
          </>
        ) : null}

        {/* Gereksinimler & Hazırlık Koşulları Rozetleri */}
        {hasRequirements ? (
          <>
            <Spacer h={8} />
            <Ikonlu gorsel="kontrol-listesi" boyut={15} gap={5}>
              <T size={11} weight="bold" color={TextGold}>
                Görev Koşulları:
              </T>
            </Ikonlu>
            <Spacer h={4} />
            <Row wrap gap={6} style={{ alignSelf: 'stretch', rowGap: 4 }}>
              {quest.requiredLevel > 1 ? <RequirementBadge text={`Sv. ${quest.requiredLevel}+`} isMet={levelOk} gorsel={nitelikGorseli('seviye')} /> : null}
              {quest.requiredMinArmor > 0 ? <RequirementBadge text={`${quest.requiredMinArmor} Zırh (${player.totalStats.armor}/${quest.requiredMinArmor})`} isMet={armorOk} gorsel={nitelikGorseli('zirh')} /> : null}
              {quest.requiredMinDamage > 0 ? <RequirementBadge text={`${quest.requiredMinDamage} Hasar (${player.totalStats.damage}/${quest.requiredMinDamage})`} isMet={damageOk} gorsel={nitelikGorseli('hasar')} /> : null}
              {quest.requiredMinHpPercent > 0 ? <RequirementBadge text={`%${quest.requiredMinHpPercent}+ Can (${player.currentHealth}/${minHpReq})`} isMet={hpOk} gorsel={nitelikGorseli('can')} /> : null}
              {quest.requiredSupplyGold > 0 ? <RequirementBadge text={`${quest.requiredSupplyGold} Altın Teçhizat Masrafı (${player.gold}/${quest.requiredSupplyGold})`} isMet={goldOk} gorsel={nitelikGorseli('altin')} /> : null}
            </Row>
          </>
        ) : null}

        <Spacer h={12} />

        {eylem}
      </Column>
    </Card>
  );
}

/**
 * Efsanevi Av & Malzeme Seferi Kartı
 */
function AdventureCard({ adventure, player, isAnyTaskRunning, onStart, onClaim }) {
  const dynamicChance = adventure.calculateSuccessChance(player);
  const levelOk = player.level >= adventure.requiredLevel;
  const minHpReq = kt.toInt(player.totalStats.maxHealth * (adventure.requiredMinHpPercent / 100));
  const hpOk = player.currentHealth >= minHpReq;
  const armorOk = adventure.requiredMinArmor === 0 || player.totalStats.armor >= adventure.requiredMinArmor;
  const damageOk = adventure.requiredMinDamage === 0 || player.totalStats.damage >= adventure.requiredMinDamage;
  const goldOk = adventure.requiredSupplyGold === 0 || player.gold >= adventure.requiredSupplyGold;
  const hasHealSupply = player.consumables.some((it) => it.healAmount > 0 && it.count > 0);
  const supplyOk = adventure.requiredSupplyItemName == null || hasHealSupply;
  const allAdvRequirementsMet = levelOk && hpOk && armorOk && damageOk && goldOk && supplyOk;

  const statusText = adventure.isClaimed ? ', Bugünlük sefer tamamlandı' : !allAdvRequirementsMet ? ', Hazırlıklar eksik' : '';
  const kartEtiketi = `${adventure.title}, Hedef: ${adventure.targetName}. Başarı şansı yüzde ${dynamicChance}${statusText}.`;

  let dugme;
  if (adventure.isClaimed) {
    dugme = (
      <Surface radius={6} color={color(0xff1b2e1e)} borderColor={HealthGreen} borderWidth={1} style={{ alignSelf: 'stretch', paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Gorsel ad="kupa" boyut={18} renk={HealthGreen} />
        <T size={12} color={HealthGreen} weight="semibold" style={{ flexShrink: 1 }}>
          Bugünlük Sefer Tamamlandı (Yarın Yenilenir)
        </T>
      </Surface>
    );
  } else if (adventure.isFinished) {
    dugme = (
      <Btn onPress={onClaim} color={HealthGreen} contentColor={Color.White} radius={8} style={{ alignSelf: 'stretch' }} gorsel="hediye">
        <T weight="bold" color={Color.White} align="center">
          {`Ganimeti Topla (+${adventure.rewardMaterialCount} ${adventure.rewardMaterialName}, +${adventure.rewardGold} Altın)`}
        </T>
      </Btn>
    );
  } else if (adventure.isRunning) {
    dugme = (
      <Ikonlu gorsel="kum-saati" boyut={18} gap={8} style={{ alignSelf: 'stretch' }}>
        <T size={12} color={AmberGold} style={{ flex: 1 }}>
          Sefer devam ediyor, karakterin vahşi diyarlarda iz sürüyor...
        </T>
      </Ikonlu>
    );
  } else {
    const metin = isAnyTaskRunning ? 'Başka Bir Görevdesin (Tek Görev Limiti)' : !allAdvRequirementsMet ? 'Hazırlıklar Yetersiz' : `Av Seferini Başlat (${adventure.durationSeconds} sn)`;
    const etkin = allAdvRequirementsMet && !isAnyTaskRunning;
    dugme = (
      <Btn
        onPress={onStart}
        disabled={!etkin}
        color={AmberGold}
        contentColor={DarkBg}
        disabledColor={DarkSurfaceCard}
        disabledContentColor={TextMuted}
        radius={8}
        style={{ alignSelf: 'stretch' }}
        gorsel={isAnyTaskRunning ? 'kum-saati' : !allAdvRequirementsMet ? 'kilit' : 'patika'}
      >
        <T weight="bold" color={etkin ? DarkBg : TextMuted} align="center">
          {metin}
        </T>
      </Btn>
    );
  }

  return (
    <Card color={DarkSurface} radius={10} borderColor={alpha(AmberGoldDark, 0.6)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
      <Column pad={14}>
        <Row justify="between" gap={8} style={{ alignSelf: 'stretch' }}>
          <Row label={kartEtiketi} heading gap={8} style={{ flex: 1 }}>
            <GorselRozet ad={maceraGorseli(adventure)} boyut={44} renk={HealthRed} zemin={alpha(HealthRed, 0.14)} />
            <Column style={{ flexShrink: 1 }}>
              <T weight="bold" color={TextGold} size={16}>
                {adventure.title}
              </T>
              <T size={12} color={AmberGold}>
                {`Hedef: ${adventure.targetName}`}
              </T>
            </Column>
          </Row>

          <Surface radius={6} color={DarkSurfaceCard} label={`Ödül: ${adventure.rewardGold} Altın, ${adventure.rewardExp} EXP`} style={{ paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Gorsel ad={nitelikGorseli('altin')} boyut={15} renk={AmberGold} />
            <T size={11} color={AmberGold}>
              {`${adventure.rewardGold} Altın • ${adventure.rewardExp} EXP`}
            </T>
          </Surface>
        </Row>

        <Spacer h={8} />
        <T size={13} color={alpha(TextLight, 0.9)}>
          {adventure.description}
        </T>

        <Spacer h={8} />

        {/* Dinamik Başarı Şansı Rozeti (Donanım Gücü) */}
        <Surface radius={6} color={color(0xff1e281f)} borderColor={alpha(HealthGreen, 0.6)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
          <Row justify="between" wrap gap={6} style={{ paddingHorizontal: 10, paddingVertical: 6 }} label={`Teçhizat Gücüne Bağlı Şans: %${dynamicChance} Başarı İhtimali`}>
            <Ikonlu gorsel="hedef-tahtasi" boyut={16} gap={5} renk={HealthGreen}>
              <T size={12} color={TextLight}>
                Teçhizat Gücüne Bağlı Şans:
              </T>
            </Ikonlu>
            <T size={12} weight="bold" color={HealthGreen}>
              {`%${dynamicChance} Başarı İhtimali`}
            </T>
          </Row>
        </Surface>

        <Spacer h={6} />

        {/* Malzeme Ödülü Göstergesi */}
        <Surface radius={6} color={DarkBg} style={{ alignSelf: 'stretch' }}>
          <Row
            justify="between"
            wrap
            gap={6}
            style={{ paddingHorizontal: 10, paddingVertical: 6 }}
            label={`Garantili Zanaat Malzemesi: +${adventure.rewardMaterialCount} ${adventure.rewardMaterialName}`}
          >
            <Ikonlu gorsel={hammaddeGorseli(adventure.rewardMaterialName)} boyut={16} gap={5} renk={FamePurple}>
              <T size={11} color={TextMuted}>
                Garantili Zanaat Malzemesi:
              </T>
            </Ikonlu>
            <T size={12} weight="bold" color={FamePurple}>
              {`+${adventure.rewardMaterialCount} ${adventure.rewardMaterialName}`}
            </T>
          </Row>
        </Surface>

        <Spacer h={8} />

        {/* Sefer Koşulları & Hazırlık Gereksinimleri */}
        <Ikonlu gorsel="kontrol-listesi" boyut={15} gap={5}>
          <T size={11} weight="bold" color={TextGold}>
            Sefer Hazırlığı & Gereksinimler:
          </T>
        </Ikonlu>
        <Spacer h={4} />
        <Row wrap gap={6} style={{ alignSelf: 'stretch', rowGap: 4 }}>
          <RequirementBadge text={`Sv. ${adventure.requiredLevel}+`} isMet={levelOk} gorsel={nitelikGorseli('seviye')} />
          <RequirementBadge text={`%${adventure.requiredMinHpPercent}+ Can (${player.currentHealth}/${minHpReq})`} isMet={hpOk} gorsel={nitelikGorseli('can')} />
          {adventure.requiredMinArmor > 0 ? <RequirementBadge text={`${adventure.requiredMinArmor} Zırh (${player.totalStats.armor}/${adventure.requiredMinArmor})`} isMet={armorOk} gorsel={nitelikGorseli('zirh')} /> : null}
          {adventure.requiredMinDamage > 0 ? <RequirementBadge text={`${adventure.requiredMinDamage} Hasar (${player.totalStats.damage}/${adventure.requiredMinDamage})`} isMet={damageOk} gorsel={nitelikGorseli('hasar')} /> : null}
          {adventure.requiredSupplyGold > 0 ? <RequirementBadge text={`${adventure.requiredSupplyGold} Altın Kazı Masrafı (${player.gold}/${adventure.requiredSupplyGold})`} isMet={goldOk} gorsel={nitelikGorseli('altin')} /> : null}
          {adventure.requiredSupplyItemName != null ? <RequirementBadge text={`1x ${adventure.requiredSupplyItemName}`} isMet={supplyOk} gorsel="sifali-ot" /> : null}
        </Row>

        <Spacer h={12} />

        {/* Zaman & İlerleme Çubuğu */}
        {adventure.isRunning ? (
          <>
            <SureIlerleme baslik="Sefer İlerleyişi" bittiMetni="Av Tamamlandı!" elapsedSeconds={adventure.elapsedSeconds} durationSeconds={adventure.durationSeconds} isFinished={adventure.isFinished} />
            <Spacer h={10} />
          </>
        ) : null}

        {/* Butonlar */}
        {dugme}
      </Column>
    </Card>
  );
}

/**
 * Koşullu Ekipman Zanaat (Craft) Kartı
 */
function CraftingRecipeCard({ recipe, player, onInspect, onCraft }) {
  const eq = recipe.resultItem;
  const rarityColor = color(eq.rarity.colorHex);
  const rozetRengi = nadirlikRengi(eq.rarity);

  const hasGold = player.gold >= recipe.requiredGold;
  const curMatCount = player.getMaterialCount(recipe.requiredMaterialId);
  const materialsMet = curMatCount >= recipe.requiredMaterialCount;
  const canCraft = hasGold && materialsMet;
  const ok = curMatCount >= recipe.requiredMaterialCount;

  return (
    <Card color={DarkSurface} radius={10} borderColor={alpha(rarityColor, 0.7)} borderWidth={1.5} style={{ alignSelf: 'stretch' }}>
      <Column pad={14}>
        {/* Başlık & İkon & Detay Butonu */}
        <Row justify="between" gap={8} style={{ alignSelf: 'stretch' }}>
          <Row
            heading
            label={`${eq.name}, ${eq.rarity.displayName}. Gerekenler: ${recipe.requiredGold} altın ve malzemeler. İncelemek veya dövmek için dokunun.`}
            gap={8}
            style={{ flex: 1 }}
          >
            <GorselRozet ad={esyaGorseli(eq)} boyut={44} kare renk={rozetRengi} kenar={rozetRengi} zemin={alpha(rozetRengi, 0.14)} />
            <Column style={{ flexShrink: 1 }}>
              <T weight="bold" color={rarityColor} size={16}>
                {eq.name}
              </T>
              <T size={12} color={TextMuted}>
                {`${eq.slot.displayName} • ${eq.rarity.displayName} • Sv. ${eq.requiredLevel}`}
              </T>
            </Column>
          </Row>

          <OutlinedBtn onPress={onInspect} label={`İncele, ${eq.name}`} radius={6} style={{ paddingHorizontal: 10, paddingVertical: 4 }} gorsel="bilgi" textSize={12}>
            <T size={12} color={TextGold}>
              İncele
            </T>
          </OutlinedBtn>
        </Row>

        <Spacer h={6} />
        <T size={12} color={alpha(TextLight, 0.85)} lines={2}>
          {eq.description}
        </T>

        <Spacer h={8} />

        {/* Temel İstatistikler */}
        <Ikonlu gorsel="kas" boyut={16} style={{ alignSelf: 'stretch' }}>
          <T size={12} weight="semibold" color={AmberGold} style={{ flex: 1 }}>
            {eq.stats.toStatSummary()}
          </T>
        </Ikonlu>

        {/* 2. ÖZEL NİTELİK ROZETİ */}
        {eq.specialTrait != null ? (
          <>
            <Spacer h={8} />
            <OzelNitelik trait={eq.specialTrait} />
          </>
        ) : null}

        <Spacer h={10} />
        <Divider color={DarkBorder} />
        <Spacer h={8} />

        {/* Gereksinimler (Altın & Malzemeler) */}
        <Ikonlu gorsel="kontrol-listesi" boyut={15} gap={5}>
          <T size={11} weight="bold" color={TextGold}>
            Zanaat İçin Gerekenler:
          </T>
        </Ikonlu>
        <Spacer h={4} />

        <Row justify="between" wrap gap={6} style={{ alignSelf: 'stretch' }}>
          <Ikonlu gorsel={nitelikGorseli('altin')} boyut={16} gap={4} renk={hasGold ? HealthGreen : HealthRed}>
          <T size={12} color={hasGold ? HealthGreen : HealthRed} weight="semibold" label={`${hasGold ? 'Yeterli' : 'Yetersiz'}, Altın: ${player.gold} / ${recipe.requiredGold}`}>
            {`Altın: ${player.gold} / ${recipe.requiredGold}`}
          </T>
          </Ikonlu>
          <Ikonlu gorsel={hammaddeGorseli(recipe.requiredMaterialName)} boyut={16} gap={4} renk={ok ? HealthGreen : HealthRed}>
          <T size={12} color={ok ? HealthGreen : HealthRed} weight="semibold" label={`${ok ? 'Yeterli' : 'Yetersiz'}, ${recipe.requiredMaterialName}: ${curMatCount}/${recipe.requiredMaterialCount}`}>
            {`${recipe.requiredMaterialName}: ${curMatCount}/${recipe.requiredMaterialCount}`}
          </T>
          </Ikonlu>
        </Row>

        <Spacer h={12} />

        {/* Dövme Butonu */}
        <Btn
          onPress={onCraft}
          disabled={!canCraft}
          color={AmberGold}
          contentColor={DarkBg}
          disabledColor={DarkSurfaceCard}
          disabledContentColor={TextMuted}
          radius={8}
          style={{ alignSelf: 'stretch' }}
          gorsel={canCraft ? 'ors' : 'kilit'}
        >
          <T weight="bold" color={canCraft ? DarkBg : TextMuted} align="center">
            {canCraft ? `Ocağında Döv ve Kuşan (${recipe.requiredGold} Altın)` : 'Eksik Malzeme veya Altın'}
          </T>
        </Btn>
      </Column>
    </Card>
  );
}

/** 2. özel nitelik rozeti (zanaat kartı ve inceleme penceresinde aynı). */
function OzelNitelik({ trait }) {
  return (
    <Surface radius={6} color={color(0xff2b1b36)} borderColor={FamePurple} borderWidth={1} pad={8} style={{ alignSelf: 'stretch' }}>
      <Ikonlu gorsel="buyu-girdap" boyut={16} renk={FamePurple}>
        <T size={12} weight="bold" color={FamePurple} style={{ flexShrink: 1 }}>
          {`2. Özel Nitelik: ${trait.name}`}
        </T>
      </Ikonlu>
      <Spacer h={2} />
      <T size={11} color={alpha(TextLight, 0.95)}>
        {trait.description}
      </T>
    </Surface>
  );
}

/**
 * Koşullu Ekipman Detay İnceleme Modalı
 */
function CraftedItemDetailDialog({ item, onDismiss }) {
  const rarityColor = color(item.rarity.colorHex);
  const rozetRengi = nadirlikRengi(item.rarity);
  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      title={
        <Row gap={8} heading label={`${item.name}, ${item.slot.displayName} • ${item.rarity.displayName} • Sv. ${item.requiredLevel}`}>
          <GorselRozet ad={esyaGorseli(item)} boyut={48} kare renk={rozetRengi} kenar={rozetRengi} zemin={alpha(rozetRengi, 0.14)} />
          <Column style={{ flexShrink: 1 }}>
            <T size={18} weight="bold" color={rarityColor}>
              {item.name}
            </T>
            <T size={12} color={TextMuted}>
              {`${item.slot.displayName} • ${item.rarity.displayName} • Sv. ${item.requiredLevel}`}
            </T>
          </Column>
        </Row>
      }
      text={
        <Column gap={10}>
          <T size={13} color={alpha(TextLight, 0.9)}>
            {item.description}
          </T>
          <Divider color={DarkBorder} />
          <Ikonlu gorsel="kas" boyut={16}>
            <T size={12} weight="bold" color={TextGold}>
              Nitelik Bonusları:
            </T>
          </Ikonlu>
          <T size={13} weight="semibold" color={AmberGold}>
            {item.stats.toStatSummary()}
          </T>
          {item.specialTrait != null ? <OzelNitelik trait={item.specialTrait} /> : null}
        </Column>
      }
      confirm={
        <Btn onPress={onDismiss} color={AmberGold} contentColor={DarkBg} gorsel="kapi">
          <T weight="bold" color={DarkBg}>
            Kapat
          </T>
        </Btn>
      }
    />
  );
}

/** Kotlin String.contains(x, ignoreCase = true) karşılığı (karakter karakter, büyük/küçük harf duyarsız). */
function containsIgnoreCase(s, alt) {
  if (s == null) return false;
  const a = Array.from(String(s));
  const b = Array.from(String(alt));
  const ayni = (x, y) => x === y || x.toUpperCase() === y.toUpperCase() || x.toLowerCase() === y.toLowerCase();
  for (let i = 0; i + b.length <= a.length; i++) {
    let tamam = true;
    for (let j = 0; j < b.length; j++) {
      if (!ayni(a[i + j], b[j])) {
        tamam = false;
        break;
      }
    }
    if (tamam) return true;
  }
  return false;
}

export function getDefaultQuestProgressText(quest) {
  if (quest.progressText != null) return quest.progressText;
  const t = quest.title;
  const d = quest.description;
  if (containsIgnoreCase(t, 'Kereste') || containsIgnoreCase(d, 'kütük')) return 'Dağdan akıtılan ağır kütük ve kereste sallarına nehir boyu muhafızlık ediyorsun...';
  if (containsIgnoreCase(t, 'Körük') || containsIgnoreCase(t, 'Kömür')) return 'Demirci ocağı için maden kömürü ve ağır körükleri taşıyorsun...';
  if (containsIgnoreCase(t, 'Sığır')) return 'Sazlık balçıklarında kayıp sığırın ayak izlerini sürüyorsun...';
  if (containsIgnoreCase(t, 'İskele')) return 'İskele boyunda gece ayazında pusudaki su korsanlarını kolluyorsun...';
  if (containsIgnoreCase(t, 'Baskın') || containsIgnoreCase(t, 'Eşkıya')) return "Kargı Boğazı'nda kılıcın kınında hazır, eşkıya artıklarını dağıtıyorsun...";
  if (containsIgnoreCase(t, 'Değirmen')) return 'Su değirmeninin dev çarkına dolanan balçık ve kütükleri temizliyorsun...';
  if (containsIgnoreCase(t, 'Gözetleme') || containsIgnoreCase(t, 'Meşale')) return 'Gözetleme kulesinde rüzgara karşı nöbet tutup işaret ateşini harlıyorsun...';
  if (containsIgnoreCase(t, 'Kiremit')) return 'Kiremit ocağındaki çamur çukurlarında yaban domuzlarını kovalıyorsun...';
  if (containsIgnoreCase(t, 'Hasır')) return 'Derin sazlıklarda hasır biçen köylüleri bataklık yılanlarından koruyorsun...';
  if (containsIgnoreCase(t, 'Cevher')) return 'Tuz çölü mağaralarında kazmayla demir ve tuz filizi çıkarıyorsun...';
  if (containsIgnoreCase(t, 'Kervan')) return 'Tozlu yolda kervan arabalarının yanında kılıç elde ilerliyorsun...';
  return `[${quest.title}] Karakterin görevi icra ediyor, adımlarını dikkatle atıyor...`;
}

export function QuestCompletionDialog({ result, onDismiss }) {
  // Pencere açılınca özet duyuru (VoiceOver kullanıcısı ödülleri hemen duysun)
  useEffect(() => {
    const parcalar = [`SÖZLEŞME TAMAMLANDI. ${result.questTitle}.`, `+${result.goldEarned} Altın, +${result.expEarned} EXP`];
    if (result.fameEarned > 0) parcalar.push(`+${result.fameEarned} Şöhret`);
    announce(parcalar.join(' '));
  }, [result]);

  return (
    <Dialog onDismiss={onDismiss} style={{ backgroundColor: DarkSurfaceCard, borderColor: AmberGold, borderWidth: 2, borderRadius: 16, padding: 0 }}>
      <Scroll style={{ flexGrow: 0, flexShrink: 1 }}>
        <Column align="center" pad={18} style={{ alignSelf: 'stretch' }}>
          <GorselRozet ad="kupa" boyut={64} kenar={alpha(AmberGold, 0.6)} />
          <Spacer h={8} />
          <T heading size={17} weight="bold" color={AmberGold}>
            SÖZLEŞME TAMAMLANDI
          </T>
          <T size={13} weight="semibold" color={TextLight} style={{ paddingTop: 2 }} align="center">
            {result.questTitle}
          </T>

          <Spacer h={12} />

          {/* Rapor Metni */}
          <Surface radius={10} color={alpha(DarkBg, 0.85)} borderColor={alpha(AmberGold, 0.4)} borderWidth={1} pad={12} style={{ alignSelf: 'stretch' }}>
            <Ikonlu gorsel="acik-kitap" boyut={15} gap={5} renk={AmberGoldDark}>
              <T size={11} weight="bold" color={AmberGoldDark}>
                Sözleşme Raporu:
              </T>
            </Ikonlu>
            <Spacer h={4} />
            <T size={12} color={alpha(TextLight, 0.95)} lineHeight={17}>
              {`"${result.narrative}"`}
            </T>
          </Surface>

          <Spacer h={12} />

          {/* Kazanılan Ödüller */}
          <Ikonlu gorsel="hediye" boyut={16} style={{ alignSelf: 'flex-start' }}>
            <T size={12} weight="bold" color={AmberGold}>
              Kazanılan Ödüller:
            </T>
          </Ikonlu>
          <Spacer h={6} />

          <Row gap={8} align="stretch" style={{ alignSelf: 'stretch' }}>
            <Surface radius={8} color={DarkSurface} borderColor={alpha(AmberGold, 0.5)} borderWidth={1} align="center" pad={6} style={{ flex: 1 }} label={`+${result.goldEarned} Altın`}>
              <Gorsel ad={nitelikGorseli('altin')} boyut={22} renk={AmberGold} />
              <T size={11} weight="bold" color={AmberGold}>{`+${result.goldEarned} Altın`}</T>
            </Surface>

            <Surface radius={8} color={DarkSurface} borderColor={alpha(color(0xff64b5f6), 0.5)} borderWidth={1} align="center" pad={6} style={{ flex: 1 }} label={`+${result.expEarned} EXP`}>
              <Gorsel ad={nitelikGorseli('tecrube')} boyut={22} renk={ExpMavisi} />
              <T size={11} weight="bold" color={ExpMavisi}>{`+${result.expEarned} EXP`}</T>
            </Surface>

            {result.fameEarned > 0 ? (
              <Surface radius={8} color={DarkSurface} borderColor={alpha(HealthGreen, 0.5)} borderWidth={1} align="center" pad={6} style={{ flex: 1 }} label={`+${result.fameEarned} Şöhret`}>
                <Gorsel ad={nitelikGorseli('sohret')} boyut={22} renk={HealthGreen} />
                <T size={11} weight="bold" color={HealthGreen}>{`+${result.fameEarned} Şöhret`}</T>
              </Surface>
            ) : null}
          </Row>

          {/* Düşen Mühürlü Tomar */}
          {result.droppedScroll != null ? (
            <>
              <Spacer h={10} />
              <Surface radius={10} color={alpha(AmberGoldDark, 0.25)} borderColor={AmberGold} borderWidth={1.5} style={{ alignSelf: 'stretch' }}>
                <Row gap={10} pad={10}>
                  <GorselRozet ad="bagli-tomar" boyut={44} kenar={AmberGold} />
                  <Column style={{ flexShrink: 1 }}>
                    <T size={11} weight="bold" color={AmberGold}>
                      ÖZEL KADİM GANİMET!
                    </T>
                    <T size={12} weight="bold" color={Color.White}>
                      {result.droppedScroll.name}
                    </T>
                    <T size={10} color={alpha(TextLight, 0.8)}>
                      Kasabadaki Bilge Mütercim Jin-Zhen'e götürerek deşifre ettirebilirsin!
                    </T>
                  </Column>
                </Row>
              </Surface>
            </>
          ) : null}

          {result.droppedEquipment != null ? (
            <>
              <Spacer h={8} />
              <Surface radius={8} color={DarkSurface} borderColor={color(result.droppedEquipment.rarity.colorHex)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
                <Row gap={8} pad={8}>
                  <GorselRozet
                    ad={esyaGorseli(result.droppedEquipment)}
                    boyut={40}
                    kare
                    renk={nadirlikRengi(result.droppedEquipment.rarity)}
                    kenar={nadirlikRengi(result.droppedEquipment.rarity)}
                    zemin={alpha(nadirlikRengi(result.droppedEquipment.rarity), 0.14)}
                  />
                  <Column style={{ flexShrink: 1 }}>
                    <T size={12} weight="bold" color={color(result.droppedEquipment.rarity.colorHex)}>
                      {`Eşya: ${result.droppedEquipment.name}`}
                    </T>
                    <T size={10} color={alpha(TextLight, 0.8)}>
                      {result.droppedEquipment.description}
                    </T>
                  </Column>
                </Row>
              </Surface>
            </>
          ) : null}

          {result.intelUnlockedText != null ? (
            <>
              <Spacer h={8} />
              <Ikonlu gorsel="fisilti" boyut={16} style={{ alignSelf: 'stretch' }}>
                <T size={11} color={AmberGold} weight="semibold" style={{ flex: 1 }}>
                  {result.intelUnlockedText}
                </T>
              </Ikonlu>
            </>
          ) : null}

          <Spacer h={14} />

          <Btn onPress={onDismiss} color={AmberGold} contentColor={DarkBg} radius={10} style={{ alignSelf: 'stretch', minHeight: 42 }} gorsel="canta" textSize={13}>
            <T weight="bold" size={13} color={DarkBg}>
              Ödülleri Çantaya Al ve Ayrıl
            </T>
          </Btn>
        </Column>
      </Scroll>
    </Dialog>
  );
}
