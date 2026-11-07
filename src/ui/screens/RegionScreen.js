// KT/ui/screens/RegionScreen.kt
// Bölge / kasaba merkezi: çarşı (zanaatkarlar, dükkanlar, eğitmenler, köşk), İsli Kandil Hanı, kaynak sahaları,
// diyar haritası ve ilgili pencereler.
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import {
  AlertDialog,
  Btn,
  Card,
  Chip,
  Column,
  Dialog,
  Divider,
  Gradient,
  IconBtn,
  LazyList,
  OutlinedBtn,
  Progress,
  Row,
  Scroll,
  Spacer,
  Surface,
  T,
  Tabs,
  TextBtn,
  announce,
  useFlow,
} from '../kit.js';
import {
  AmberGold,
  AmberGoldDark,
  Color,
  DarkBg,
  DarkBorder,
  DarkSurface,
  DarkSurfaceCard,
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
import { R } from '../../R.js';
import { SoundManager } from '../../audio/SoundManager.js';
import { StarterContent } from '../../data/StarterContent.js';
import {
  AccessoryCategory,
  ArmorCategory,
  EquipmentSlot,
  GemCraftingRules,
  GemType,
  ItemType,
  NpcRole,
  TrainingType,
  UsableCategory,
  WeaponCategory,
} from '../../domain/model.js';

export const RegionSection = kt.defineEnum('RegionSection', {
  MARKET: {},
  MAP: {},
});

// ---------------------------------------------------------------------------
// Yardımcılar
// ---------------------------------------------------------------------------

/** Küçük rozet (Surface + Text). */
function Badge({ text, textColor, bg, borderColor, size = 10, padH = 6, padV = 2, radius = 4, weight = 'bold', label }) {
  return (
    <Surface color={bg} radius={radius} borderColor={borderColor} style={{ paddingHorizontal: padH, paddingVertical: padV }}>
      <T size={size} weight={weight} color={textColor} label={label}>
        {text}
      </T>
    </Surface>
  );
}

/** LazyColumn item listesi: [{ k, r: () => öğe }] → LazyList. */
function ItemColumn({ items, gap = 14, contentStyle }) {
  return (
    <LazyList
      data={items}
      keyOf={(x) => x.k}
      renderItem={(x) => x.r()}
      gap={gap}
      contentStyle={contentStyle}
    />
  );
}

const FERMAN_RENK = color(0xff2a1f0d);

/** Anahtar değişince (ilk açılış hariç) metni VoiceOver'a okutur: zar sonucu, dedikodu, fısıltı, şarkı, yanıt. */
function useAnnounceOnChange(key, text) {
  const onceki = useRef(key);
  useEffect(() => {
    if (onceki.current !== key) {
      onceki.current = key;
      if (key != null && text) announce(text);
    }
  }, [key, text]);
}

function inList(liste, x) {
  return liste.includes(x);
}

// Dükkan filtreleri (sayım ve süzme aynı yüklemleri kullanır)
const blacksmithFilters = [
  (it) => it.weaponCategory === WeaponCategory.SWORD || it.weaponType === 'kılıç',
  (it) => it.weaponCategory === WeaponCategory.AXE || inList(['balta', 'teber'], it.weaponType),
  (it) => it.weaponCategory === WeaponCategory.MACE || inList(['gürz', 'topuz'], it.weaponType),
  (it) =>
    inList([WeaponCategory.DAGGER, WeaponCategory.SPEAR, WeaponCategory.BOW], it.weaponCategory) ||
    inList(['hançer', 'mızrak', 'kargı', 'yay'], it.weaponType),
  (it) => it.slot === EquipmentSlot.SHIELD || it.accessoryCategory === AccessoryCategory.SHIELD,
  (it) =>
    inList([EquipmentSlot.HEAD, EquipmentSlot.CHEST], it.slot) ||
    inList([ArmorCategory.HEAVY_ARMOR, ArmorCategory.LIGHT_ARMOR, ArmorCategory.HELMET], it.armorCategory),
  (it) => inList([EquipmentSlot.GLOVES, EquipmentSlot.PANTS, EquipmentSlot.BOOTS], it.slot),
];
const aestheticFilters = [
  (it) => it.slot === EquipmentSlot.HEAD,
  (it) => it.slot === EquipmentSlot.CHEST,
  (it) => it.slot === EquipmentSlot.PANTS,
  (it) => it.slot === EquipmentSlot.BOOTS,
  (it) => it.slot === EquipmentSlot.GLOVES,
];
const wandFilters = [(it) => it.weaponCategory === WeaponCategory.STAFF || it.weaponType === 'asa', (it) => it.isTome];
const leatherFilters = [(it) => it.slot === EquipmentSlot.GLOVES, (it) => it.slot === EquipmentSlot.PANTS];
const bowyerFilters = [
  (it) => it.weaponCategory === WeaponCategory.BOW || it.weaponType === 'yay',
  (it) => it.accessoryCategory === AccessoryCategory.ARROW || it.weaponType === 'ok',
];
const armorerFilters = [
  (it) => it.armorCategory === ArmorCategory.HEAVY_ARMOR,
  (it) => it.armorCategory === ArmorCategory.BOOTS || it.slot === EquipmentSlot.BOOTS,
];
const spearFilters = [(it) => inList(['mızrak', 'zıpkın', 'üç dişli'], it.weaponType), (it) => inList(['kargı', 'teber'], it.weaponType)];
const daggerFilters = [
  (it) => inList(['hançer', 'çift bıçak', 'sustalı'], it.weaponType),
  (it) => inList(['kama', 'stiletto', 'pala bıçak'], it.weaponType),
];
const tailorFilters = [
  (it) => it.armorCategory === ArmorCategory.LIGHT_ARMOR,
  (it) => it.armorCategory === ArmorCategory.ROBE,
  (it) => it.armorCategory === ArmorCategory.ASSASSIN_HOOD || it.slot === EquipmentSlot.HEAD,
];
const ringSealFilters = [(it) => it.slot === EquipmentSlot.RING, (it) => it.slot === EquipmentSlot.TALISMAN];

function filtrele(liste, filtreler, i) {
  const f = filtreler[i];
  return f ? liste.filter(f) : liste;
}

/** gemsInventory.groupBy { it.type to it.level } — ekleme sırası korunur. */
function groupGemsByTypeAndLevel(gems) {
  const m = new Map();
  for (const g of gems) {
    const k = `${g.type.name}|${g.level}`;
    if (!m.has(k)) m.set(k, { type: g.type, level: g.level, gems: [] });
    m.get(k).gems.push(g);
  }
  return Array.from(m.values());
}

// ---------------------------------------------------------------------------
// Ana ekran
// ---------------------------------------------------------------------------
export function RegionScreen({ viewModel, style }) {
  const player = useFlow(viewModel.player);
  const region = useFlow(viewModel.region);
  const dayState = useFlow(viewModel.dayState);
  const currentTale = useFlow(viewModel.currentTale);
  const lastDiceResult = useFlow(viewModel.lastDiceResult);
  const currentBardSong = useFlow(viewModel.currentBardSong);
  const lastInformantWhisper = useFlow(viewModel.lastInformantWhisper);
  const decipherModalData = useFlow(viewModel.decipherModalData);
  const activeCompanionSession = useFlow(viewModel.activeCompanionSession);

  const [currentSection, setCurrentSection] = useState(RegionSection.MARKET);
  const [isTavernOpen, setIsTavernOpen] = useState(false);
  const [activeNpcDialog, setActiveNpcDialog] = useState(null);
  const [selectedDiceBet, setSelectedDiceBet] = useState(5);
  const [inspectedShopEquipment, setInspectedShopEquipment] = useState(null);
  const [inspectedShopConsumable, setInspectedShopConsumable] = useState(null);
  const [gemSelectionTargetEquipment, setGemSelectionTargetEquipment] = useState(null);
  const [isHarvestRegionActive, setIsHarvestRegionActive] = useState(false);
  const [activeHarvestSpot, setActiveHarvestSpot] = useState(null);

  // BGM ve Dükkan SFX Yönetimi
  useEffect(() => {
    const defaultRegionBgm = region.id === 'tashisar' ? R.raw.tashisar : R.raw.bolge;
    if (currentSection === RegionSection.MARKET) {
      const npc = activeNpcDialog;
      if (npc != null) {
        viewModel.markCharacterEncountered(npc.id);
        const dukkanlar = [
          NpcRole.BLACKSMITH,
          NpcRole.ARMORER,
          NpcRole.BOWYER,
          NpcRole.WAND_MAKER,
          NpcRole.TAILOR,
          NpcRole.JEWELER,
          NpcRole.RING_MAKER,
          NpcRole.LEATHERWORKER,
          NpcRole.SPEAR_MASTER,
          NpcRole.DAGGER_MASTER,
          NpcRole.AESTHETIC_ATELIER,
        ];
        if (dukkanlar.includes(npc.role)) {
          SoundManager.playSfx(R.raw.dukkangiris);
          SoundManager.playBgm(R.raw.demirci, true);
        } else if (npc.role === NpcRole.ALCHEMIST) {
          SoundManager.playSfx(R.raw.dukkangiris);
          SoundManager.playBgm(R.raw.simyaci, true);
        } else if (npc.role === NpcRole.TRAINING_GROUNDS || npc.role === NpcRole.TRAINER) {
          SoundManager.playSfx(R.raw.arenabasla);
          SoundManager.playBgm(defaultRegionBgm, true);
        } else {
          SoundManager.playBgm(defaultRegionBgm, true);
        }
      } else {
        SoundManager.playBgm(defaultRegionBgm, true);
      }
    } else {
      SoundManager.playBgm(defaultRegionBgm, true);
    }
  }, [currentSection, activeNpcDialog, region.id]);

  // --- Çarşı / Han liste öğeleri ---
  const marketItems = [];
  if (!isTavernOpen) {
    // REGION TAB: Town Market & NPCs
    marketItems.push({ k: 'header', r: () => <RegionHeaderCard region={region} /> });

    if (viewModel.canTravelToRegion2) {
      marketItems.push({
        k: 'travel',
        r: () => {
          const isCurrentlyInTashisar = player.currentRegionId === 'tashisar';
          const targetRegionId = isCurrentlyInTashisar ? 'kirlangic' : 'tashisar';
          const buttonLabel = isCurrentlyInTashisar ? "Kırlangıç Kasabası'na Dön" : "Taş Hisar Garnizonu'na Git";
          return (
            <Card color={FERMAN_RENK} radius={10} borderColor={AmberGold} borderWidth={1.5}>
              <Column pad={14}>
                <Row justify="between" style={{ alignSelf: 'stretch' }} gap={8}>
                  <T weight="bold" size={16} color={TextGold} style={{ flexShrink: 1 }}>
                    🏰 Hisartaşı Garnizonu Kervanı
                  </T>
                  <Badge text="FERMAN ONAYLANDI" textColor={HealthGreen} bg={alpha(HealthGreen, 0.2)} borderColor={HealthGreen} />
                </Row>
                <Spacer h={6} />
                <T size={12} color={TextLight} lineHeight={17}>
                  Kırlangıç Kasabası'nın kumlarını fethettin ve özgürlük fermanını aldın! Dağların ardındaki orta ölçekli Hisartaşı Garnizonu kervanı seni bekliyor. Orada daha çetin paralı askerler, 2. kademe kasaba evleri ve yeni bir lig yer alıyor.
                </T>
                <Spacer h={10} />
                <Btn
                  onPress={() => viewModel.travelToRegion(targetRegionId)}
                  color={AmberGold}
                  contentColor={DarkBg}
                  radius={8}
                  style={{ alignSelf: 'stretch' }}
                  label={`${buttonLabel}. Bölgeler arası seyahat et.`}
                  textSize={12}
                >
                  {buttonLabel}
                </Btn>
              </Column>
            </Card>
          );
        },
      });
    }

    marketItems.push({
      k: 'npcs_title',
      r: () => (
        <T style={Typography.titleMedium} color={TextLight} weight="bold" heading>
          Bölgedeki Zanaatkarlar ve Mekanlar
        </T>
      ),
    });

    (region.npcs || []).forEach((npc, i) => {
      marketItems.push({ k: `npc_${i}_${npc.id}`, r: () => <NpcListItemCard npc={npc} onClick={() => setActiveNpcDialog(npc)} /> });
    });

    marketItems.push({ k: 'tavern', r: () => <TavernLocationCard onClick={() => setIsTavernOpen(true)} /> });
  } else {
    // TAVERN VIEW: İsli Kandil Hanı
    marketItems.push({
      k: 'tavern_back',
      r: () => (
        <Card onPress={() => setIsTavernOpen(false)} label="Kasaba çarşısına geri dön" color={DarkSurfaceCard} radius={8} borderColor={AmberGoldDark}>
          <Row gap={8} style={{ paddingHorizontal: 14, paddingVertical: 10 }}>
            <T size={18} weight="bold" color={AmberGold}>
              ←
            </T>
            <T size={14} weight="bold" color={TextGold}>
              Kasaba Çarşısına Dön
            </T>
          </Row>
        </Card>
      ),
    });

    marketItems.push({ k: 'tavern_intro', r: () => <TavernIntroCard /> });

    // 1. Eavesdrop Section (Masalara Kulak Kabart - Rastgele)
    marketItems.push({
      k: 'tavern_eavesdrop',
      r: () => (
        <TavernEavesdropCard
          currentTale={currentTale}
          canEavesdrop={dayState.canEavesdropToday}
          remainingCount={dayState.remainingEavesdrops}
          maxCount={dayState.maxEavesdropsPerDay}
          onListenNext={() => {
            viewModel.markCharacterEncountered('npc_informant');
            viewModel.listenTavernTale(null);
          }}
        />
      ),
    });

    // 2. Informant Section (Gölgeli Muhbir - Gladyatör Açıkları)
    marketItems.push({
      k: 'tavern_informant',
      r: () => (
        <TavernInformantCard
          weaknesses={viewModel.getAllEnemyWeaknesses()}
          knownWeaknessIds={player.knownWeaknessIds}
          playerGold={player.gold}
          lastWhisper={lastInformantWhisper}
          onBuyRandomIntel={() => {
            viewModel.markCharacterEncountered('npc_informant');
            viewModel.buyRandomEnemyIntel();
          }}
          onDismissWhisper={() => viewModel.dismissInformantWhisper()}
        />
      ),
    });

    // 3. Tavern Food & Lodging (Hancı Kazanı & Geceleme)
    marketItems.push({
      k: 'tavern_meals',
      r: () => (
        <TavernMealsCard
          playerGold={player.gold}
          dayState={dayState}
          onOrderSoup={() => viewModel.orderTavernMeal(5, 15, 'İsli Arpa Çorbası')}
          onOrderRabbit={() => viewModel.orderTavernMeal(12, 35, 'Baharatlı Dağ Tavşanı & Şarap')}
          onRestAtInn={() => viewModel.advanceDay(5)}
        />
      ),
    });

    // 3. Dice Gambling Game (Çukur Barbutu)
    marketItems.push({
      k: 'tavern_dice',
      r: () => (
        <TavernDiceGameCard
          playerGold={player.gold}
          dayState={dayState}
          selectedBet={selectedDiceBet}
          lastResult={lastDiceResult}
          onSelectBet={setSelectedDiceBet}
          onRollDice={() => viewModel.playDice(selectedDiceBet)}
        />
      ),
    });

    // 4. Bard Section (Ozan Köşesi)
    marketItems.push({
      k: 'tavern_bard',
      r: () => (
        <TavernBardCard
          currentSong={currentBardSong}
          playerGold={player.gold}
          onTipBard={(isEpic) => {
            viewModel.markCharacterEncountered('npc_miras');
            viewModel.listenBardSong(isEpic);
          }}
        />
      ),
    });
  }
  marketItems.push({ k: 'bottom_space', r: () => <Spacer h={70} /> });

  // --- Üst pencereler (NPC penceresi açıkken onun içinde, değilse kökte açılır; iOS üst üste modal için) ---
  const overlays = (
    <>
      {decipherModalData != null ? <DecipherDialog data={decipherModalData} onDismiss={() => viewModel.clearDecipherModal()} /> : null}

      {/* Kızıl Kadife Köşkü & Gizli Divan Buluşma Modalı */}
      {activeCompanionSession != null ? <CompanionDialogueModal session={activeCompanionSession} player={player} viewModel={viewModel} /> : null}

      {/* Shop Inspection Dialogs (Detay ve Karşılaştırma Üst Pencereleri) */}
      {inspectedShopEquipment != null ? (
        <ShopEquipmentDetailDialog
          item={inspectedShopEquipment}
          player={player}
          onDismiss={() => setInspectedShopEquipment(null)}
          onBuy={() => {
            viewModel.buyEquipment(inspectedShopEquipment);
            setInspectedShopEquipment(null);
          }}
        />
      ) : null}

      {inspectedShopConsumable != null ? (
        <ShopConsumableDetailDialog
          item={inspectedShopConsumable}
          player={player}
          onDismiss={() => setInspectedShopConsumable(null)}
          onBuy={() => {
            viewModel.buyConsumable(inspectedShopConsumable);
            setInspectedShopConsumable(null);
          }}
        />
      ) : null}

      {activeHarvestSpot != null ? <HarvestSpotDialog spotType={activeHarvestSpot} viewModel={viewModel} onDismiss={() => setActiveHarvestSpot(null)} /> : null}

      {gemSelectionTargetEquipment != null ? (
        <GemSelectionDialog
          equipment={gemSelectionTargetEquipment}
          player={player}
          onDismiss={() => setGemSelectionTargetEquipment(null)}
          onSelectGem={(gem) => {
            viewModel.insertGem(gemSelectionTargetEquipment.id, gem.id);
            setGemSelectionTargetEquipment(null);
          }}
        />
      ) : null}
    </>
  );

  return (
    <View style={[{ flex: 1, backgroundColor: DarkBg }, style]}>
      {/* ÜST SEKMELER: 🏛️ Kasaba Çarşısı | 🗺️ Diyar Haritası */}
      <Row gap={8} style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <Chip
          selected={currentSection === RegionSection.MARKET}
          onPress={() => setCurrentSection(RegionSection.MARKET)}
          selectedColor={AmberGoldDark}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <T weight="bold" size={13} color={currentSection === RegionSection.MARKET ? Color.White : TextLight}>
            🏛️ Kasaba Çarşısı
          </T>
        </Chip>
        <Chip
          selected={currentSection === RegionSection.MAP}
          onPress={() => setCurrentSection(RegionSection.MAP)}
          selectedColor={AmberGoldDark}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <T weight="bold" size={13} color={currentSection === RegionSection.MAP ? Color.White : TextLight}>
            🗺️ Diyar Haritası
          </T>
        </Chip>
      </Row>

      {currentSection === RegionSection.MARKET ? (
        isHarvestRegionActive ? (
          <HarvestRegionView viewModel={viewModel} onReturn={() => setIsHarvestRegionActive(false)} onOpenSpot={(s) => setActiveHarvestSpot(s)} />
        ) : (
          <ItemColumn items={marketItems} gap={14} contentStyle={{ paddingHorizontal: 16, paddingVertical: 6 }} />
        )
      ) : (
        <WorldMapSection
          viewModel={viewModel}
          onReturnToMarket={() => {
            setCurrentSection(RegionSection.MARKET);
            setIsHarvestRegionActive(false);
          }}
          onEnterHarvestRegion={() => {
            setCurrentSection(RegionSection.MARKET);
            setIsHarvestRegionActive(true);
          }}
        />
      )}

      {/* NPC Dialog Modal */}
      {activeNpcDialog != null ? (
        <NpcDialog
          key={activeNpcDialog.id}
          npc={activeNpcDialog}
          player={player}
          viewModel={viewModel}
          onDismiss={() => setActiveNpcDialog(null)}
          onInspectEquipment={setInspectedShopEquipment}
          onInspectConsumable={setInspectedShopConsumable}
          onSelectGemTarget={setGemSelectionTargetEquipment}
        >
          {overlays}
        </NpcDialog>
      ) : (
        overlays
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Kadim Doğu Tomarı Deşifre Etme Modalı (Bilge Jin-Zhen)
// ---------------------------------------------------------------------------
function DecipherDialog({ data, onDismiss }) {
  const skill = data.skill;
  const lore = data.lore;
  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      confirm={
        <Btn onPress={onDismiss} color={AmberGold} contentColor={DarkBg} radius={8}>
          Öğretiyi Zihnine Kazı & Ayrıl
        </Btn>
      }
      title={
        <Row gap={10}>
          <T size={28} hidden>
            {skill.icon}
          </T>
          <Column style={{ flex: 1 }}>
            <T size={15} weight="bold" color={AmberGold} heading>
              📜 KADİM DOĞU SIRRI ÇÖZÜLDÜ!
            </T>
            <T size={13} weight="bold" color={Color.White}>
              {skill.name}
            </T>
          </Column>
        </Row>
      }
      text={
        <Column gap={10} style={{ alignSelf: 'stretch' }}>
          <Surface radius={8} color={alpha(DarkBg, 0.85)} borderColor={alpha(AmberGoldDark, 0.5)} borderWidth={1}>
            <Column pad={10}>
              <T size={12} weight="bold" color={TextGold}>
                {`🪔 ${lore.ritualTitle}`}
              </T>
              <Spacer h={4} />
              <T size={12} color={TextLight} lineHeight={17} italic>
                {lore.ritualNarrative}
              </T>
            </Column>
          </Surface>

          <Column>
            <T size={12} weight="bold" color={AmberGold}>
              🥋 Savaş Felsefesi & İdeogram Öğretisi:
            </T>
            <Spacer h={2} />
            <T size={12} color={alpha(TextLight, 0.95)} lineHeight={17}>
              {lore.techniqueLore}
            </T>
            <Spacer h={4} />
            <T size={11} weight="semibold" color={AmberGoldDark} lineHeight={15}>
              {lore.battlePhilosophy}
            </T>
          </Column>

          <Surface radius={8} color={DarkSurfaceCard} borderColor={alpha(HealthGreen, 0.7)} borderWidth={1}>
            <Column pad={10}>
              <T size={11} color={TextGold}>
                {`⚡ Tetiklenme Şartı: ${skill.triggerConditionText}`}
              </T>
              <Spacer h={3} />
              <T size={11} weight="bold" color={HealthGreen}>
                {`✨ Muharebe Etkisi: ${skill.effectSummary}`}
              </T>
              <Spacer h={4} />
              {data.autoEquippedSlot != null ? (
                <T size={11} weight="bold" color={AmberGold}>
                  {`⚔️ Otomatik olarak ${data.autoEquippedSlot}. Savaş Yuvasına yerleştirildi!`}
                </T>
              ) : (
                <T size={11} color={TextMuted}>
                  🎒 4 yuvan da dolu olduğundan yedek kulübeye alındı. Envanter {'>'} Yetenekler menüsünden kuşanabilirsin!
                </T>
              )}
            </Column>
          </Surface>
        </Column>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// NPC penceresi (dükkanlar, mücevherci, eğitmen, köşk, talim meydanı, bilge)
// ---------------------------------------------------------------------------
function FilterChipRow({ chips, selected, onSelect, scrollable, gap = 6, size = 11 }) {
  const ogeler = chips
    .filter((c) => c.visible !== false)
    .map((c) => (
      <Chip
        key={c.index}
        selected={selected === c.index}
        onPress={() => onSelect(c.index)}
        selectedColor={AmberGoldDark}
        style={scrollable ? null : { flex: 1, justifyContent: 'center', paddingHorizontal: 6 }}
      >
        <T size={size} weight={selected === c.index ? 'bold' : 'normal'} color={selected === c.index ? Color.White : TextLight} lines={1}>
          {c.text}
        </T>
      </Chip>
    ));
  if (scrollable) {
    return (
      <Scroll horizontal gap={gap} contentStyle={{ paddingVertical: 4 }}>
        {ogeler}
      </Scroll>
    );
  }
  return (
    <Row gap={gap} style={{ alignSelf: 'stretch', paddingVertical: 4 }}>
      {ogeler}
    </Row>
  );
}

function ShopEquipmentRow({ eq, label, line2, buttonText, buttonLabel, onInspect, onAction, enabled = true, showInspect }) {
  return (
    <Card color={DarkSurfaceCard} radius={6}>
      <Row pad={8} justify="between" gap={6}>
        <Column style={{ flex: 1 }} onPress={onInspect} label={label}>
          <T weight="bold" color={color(eq.rarity.colorHex)} size={13}>
            {eq.name}
          </T>
          <T size={11} color={AmberGold}>
            {line2}
          </T>
          <T size={10} color={TextMuted}>
            {eq.stats.toStatSummary()}
          </T>
        </Column>
        <Row gap={4}>
          {showInspect ? (
            <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <IconBtn onPress={onInspect} label="İncele">
                <T size={14}>🔍</T>
              </IconBtn>
            </View>
          ) : null}
          <Btn onPress={onAction} disabled={!enabled} color={AmberGold} contentColor={DarkBg} pad={8} textSize={11} label={buttonLabel}>
            {buttonText}
          </Btn>
        </Row>
      </Row>
    </Card>
  );
}

function NpcDialog({ npc, player, viewModel, onDismiss, onInspectEquipment, onInspectConsumable, onSelectGemTarget, children }) {
  const [blacksmithTab, setBlacksmithTab] = useState(0);
  const [jewelerTab, setJewelerTab] = useState(0);
  const [alchemistTab, setAlchemistTab] = useState(0);
  const [shopCategoryFilter, setShopCategoryFilter] = useState(0);
  const forSale = npc.equipmentForSale || [];
  const consumablesForSale = npc.consumablesForSale || [];
  const isTailorShop = npc.role === NpcRole.TAILOR;
  const isBlacksmithShop = npc.role === NpcRole.BLACKSMITH;
  const isArmorerShop = npc.role === NpcRole.ARMORER;
  const isBowyerShop = npc.role === NpcRole.BOWYER;
  const isLeatherworkerShop = npc.role === NpcRole.LEATHERWORKER;
  const isWandShop = npc.role === NpcRole.WAND_MAKER;
  const isSpearMasterShop = npc.role === NpcRole.SPEAR_MASTER;
  const isDaggerMasterShop = npc.role === NpcRole.DAGGER_MASTER;
  const hasRings = (npc.role === NpcRole.RING_MAKER || forSale.some((it) => it.slot === EquipmentSlot.RING)) && npc.role !== NpcRole.BLACKSMITH;
  const hasTalismans = (npc.role === NpcRole.JEWELER || forSale.some((it) => it.slot === EquipmentSlot.TALISMAN)) && npc.role !== NpcRole.BLACKSMITH;
  const isAestheticAtelier = npc.role === NpcRole.AESTHETIC_ATELIER;

  const items = [];
  const add = (k, r) => items.push({ k, r });
  const say = (filtreler, i) => kt.count(forSale, filtreler[i]);

  add('lore', () => (
    <Column>
      <T size={13} color={TextLight} lineHeight={18}>
        {npc.loreSnippet}
      </T>
      <Spacer h={8} />
      <Divider color={DarkBorder} />
    </Column>
  ));

  // Blacksmith Equipment for Sale & Sell from Inventory
  if (forSale.length > 0) {
    add('shop_tabs', () => (
      <Column>
        <Tabs
          titles={[`🛒 Satın Al (${forSale.length})`, `💰 Teçhizat Sat (${player.inventory.length})`]}
          selected={blacksmithTab}
          onSelect={setBlacksmithTab}
          color={DarkSurfaceCard}
        />
        <Spacer h={4} />
      </Column>
    ));

    if (blacksmithTab === 0) {
      let chips = null;
      let scrollable = false;
      let gap = 6;
      let size = 11;
      if (isTailorShop) {
        chips = [
          { index: 0, text: `🥋 Hafif (${say(tailorFilters, 0)})` },
          { index: 1, text: `👘 Cübbe (${say(tailorFilters, 1)})` },
          { index: 2, text: `🥷 Başlık (${say(tailorFilters, 2)})` },
        ];
        gap = 4;
        size = 10;
      } else if (hasRings && hasTalismans) {
        chips = [
          { index: 0, text: `💍 Yüzükler (${say(ringSealFilters, 0)})` },
          { index: 1, text: `🧿 Mühürler (${say(ringSealFilters, 1)})` },
        ];
      } else if (isBlacksmithShop) {
        const otherWeaponCount = say(blacksmithFilters, 3);
        const clothesCount = say(blacksmithFilters, 6);
        chips = [
          { index: 0, text: `🗡️ Kılıç (${say(blacksmithFilters, 0)})` },
          { index: 1, text: `🪓 Balta & Teber (${say(blacksmithFilters, 1)})` },
          { index: 2, text: `🔨 Gürz (${say(blacksmithFilters, 2)})` },
          { index: 3, text: `🔪 Diğer Silahlar (${otherWeaponCount})`, visible: otherWeaponCount > 0 },
          { index: 4, text: `🛡️ Kalkan (${say(blacksmithFilters, 4)})` },
          { index: 5, text: `🪖 Zırh & Miğfer (${say(blacksmithFilters, 5)})` },
          { index: 6, text: `🧤 Kolçak, Tozluk & Çizme (${clothesCount})`, visible: clothesCount > 0 },
        ];
        scrollable = true;
      } else if (isSpearMasterShop) {
        chips = [
          { index: 0, text: `🔱 Mızrak & Zıpkın (${say(spearFilters, 0)})` },
          { index: 1, text: `🚩 Kargı & Teber (${say(spearFilters, 1)})` },
        ];
      } else if (isDaggerMasterShop) {
        chips = [
          { index: 0, text: `🔪 Hançer & Bıçak (${say(daggerFilters, 0)})` },
          { index: 1, text: `🗡️ Kama & Stiletto (${say(daggerFilters, 1)})` },
        ];
      } else if (isArmorerShop) {
        chips = [
          { index: 0, text: `🛡️ Ağır Zırh (${say(armorerFilters, 0)})` },
          { index: 1, text: `👢 Çizme & Ayakkabı (${say(armorerFilters, 1)})` },
        ];
      } else if (isBowyerShop) {
        chips = [
          { index: 0, text: `🏹 Yay & Arbalet (${say(bowyerFilters, 0)})` },
          { index: 1, text: `🎯 Ok & Cephane (${say(bowyerFilters, 1)})` },
        ];
      } else if (isLeatherworkerShop) {
        chips = [
          { index: 0, text: `🧤 Bileklik & Kolluk (${say(leatherFilters, 0)})` },
          { index: 1, text: `👖 Bacak Zırhı & Tozluk (${say(leatherFilters, 1)})` },
        ];
      } else if (isWandShop) {
        chips = [
          { index: 0, text: `🦯 Asalar (${say(wandFilters, 0)})` },
          { index: 1, text: `📖 Büyü Kitabı & Tomar (${say(wandFilters, 1)})` },
        ];
      } else if (isAestheticAtelier) {
        chips = [
          { index: 0, text: `🎩 Başlık (${say(aestheticFilters, 0)})` },
          { index: 1, text: `🥋 Üstlük (${say(aestheticFilters, 1)})` },
          { index: 2, text: `👖 Pantolon & Etek (${say(aestheticFilters, 2)})` },
          { index: 3, text: `👢 Ayakkabı (${say(aestheticFilters, 3)})` },
          { index: 4, text: `🧤 Eldiven & Sargı (${say(aestheticFilters, 4)})` },
        ];
        scrollable = true;
      }
      if (chips) {
        add('shop_filters', () => (
          <FilterChipRow chips={chips} selected={shopCategoryFilter} onSelect={setShopCategoryFilter} scrollable={scrollable} gap={gap} size={size} />
        ));
      }

      const displayedEquipment = isBlacksmithShop
        ? filtrele(forSale, blacksmithFilters, shopCategoryFilter)
        : isAestheticAtelier
          ? filtrele(forSale, aestheticFilters, shopCategoryFilter)
          : isWandShop
            ? filtrele(forSale, wandFilters, shopCategoryFilter)
            : isLeatherworkerShop
              ? filtrele(forSale, leatherFilters, shopCategoryFilter)
              : isBowyerShop
                ? filtrele(forSale, bowyerFilters, shopCategoryFilter)
                : isArmorerShop
                  ? filtrele(forSale, armorerFilters, shopCategoryFilter)
                  : isSpearMasterShop
                    ? filtrele(forSale, spearFilters, shopCategoryFilter)
                    : isDaggerMasterShop
                      ? filtrele(forSale, daggerFilters, shopCategoryFilter)
                      : isTailorShop
                        ? filtrele(forSale, tailorFilters, shopCategoryFilter)
                        : hasRings && hasTalismans
                          ? filtrele(forSale, ringSealFilters, shopCategoryFilter)
                          : forSale;

      displayedEquipment.forEach((eq, i) => {
        add(`buy_${shopCategoryFilter}_${i}_${eq.id}`, () => {
          const canBuy = player.gold >= eq.valueInGold;
          return (
            <ShopEquipmentRow
              eq={eq}
              label={`${eq.name}, ${eq.slot.displayName}, ${eq.valueInGold} altın. ${eq.stats.toStatSummary()}. Detayları ve karşılaştırmayı görmek için tıklayın.`}
              line2={`${eq.slot.displayName} • ${eq.valueInGold} Altın`}
              buttonText="Satın Al"
              buttonLabel={`Satın Al: ${eq.name}`}
              onInspect={() => onInspectEquipment(eq)}
              onAction={() => viewModel.buyEquipment(eq)}
              enabled={canBuy}
              showInspect
            />
          );
        });
      });
    } else {
      if (player.inventory.length === 0) {
        add('sell_empty', () => (
          <T size={12} color={TextMuted} style={{ paddingVertical: 12 }}>
            Çantanızda satılabilecek boşta teçhizat bulunmuyor.
          </T>
        ));
      } else {
        player.inventory.forEach((eq, i) => {
          add(`sell_${i}_${eq.id}`, () => (
            <ShopEquipmentRow
              eq={eq}
              label={`${eq.name}, ${eq.slot.displayName}. Satış değeri ${eq.sellPrice} altın. ${eq.stats.toStatSummary()}.`}
              line2={`${eq.slot.displayName} • Satış: ${eq.sellPrice} Altın`}
              buttonText={`Sat (+${eq.sellPrice} 🪙)`}
              buttonLabel={`Sat: ${eq.name}, artı ${eq.sellPrice} altın`}
              onInspect={() => onInspectEquipment(eq)}
              onAction={() => viewModel.sellEquipment(eq)}
            />
          ));
        });
      }
    }
  }

  // Alchemist Consumables for Sale
  if (consumablesForSale.length > 0) {
    const hasOintments = consumablesForSale.some((it) => it.usableCategory === UsableCategory.OINTMENT);
    const hasHerbs = consumablesForSale.some((it) => it.usableCategory === UsableCategory.HERB);
    const hasPehlivanOils = consumablesForSale.some((it) => it.usableCategory === UsableCategory.PEHLIVAN_OIL);
    const hasMultiTabs = hasOintments || hasHerbs || hasPehlivanOils;

    if (hasMultiTabs) {
      const maxTabIdx = hasPehlivanOils ? 3 : 2;
      const basliklar = ['🧪 İksir', '🍯 Merhem', '🌿 Otlar'];
      if (hasPehlivanOils) basliklar.push('🏺 Er Meydanı');
      add('alch_tabs', () => (
        <Column>
          <Tabs titles={basliklar} selected={kt.coerceIn(alchemistTab, 0, maxTabIdx)} onSelect={setAlchemistTab} color={DarkSurfaceCard} />
          <Spacer h={4} />
        </Column>
      ));
    } else {
      add('alch_title', () => (
        <T weight="bold" color={HealthGreen} size={14} heading>
          Şifa İksirleri ve Özler:
        </T>
      ));
    }

    const displayedConsumables = hasMultiTabs
      ? alchemistTab === 0
        ? consumablesForSale.filter((it) => it.usableCategory === UsableCategory.POTION)
        : alchemistTab === 1
          ? consumablesForSale.filter((it) => it.usableCategory === UsableCategory.OINTMENT)
          : alchemistTab === 2
            ? consumablesForSale.filter((it) => it.usableCategory === UsableCategory.HERB)
            : consumablesForSale.filter((it) => it.usableCategory === UsableCategory.PEHLIVAN_OIL)
      : consumablesForSale;

    displayedConsumables.forEach((con, i) => {
      add(`con_${alchemistTab}_${i}_${con.id}`, () => {
        const isLevelMet = player.level >= con.requiredLevel;
        const canBuy = player.gold >= con.valueInGold && isLevelMet;
        let statSummary = '';
        if (con.healAmount > 0) statSummary += `+${con.healAmount} Can • `;
        if (con.buffEffect != null) statSummary += `${con.buffEffect.icon} ${con.buffEffect.name} • `;
        statSummary += `${con.valueInGold} Altın`;
        return (
          <Card color={DarkSurfaceCard} radius={6}>
            <Row pad={8} justify="between" gap={6}>
              <Column style={{ flex: 1 }} onPress={() => onInspectConsumable(con)} label={`${con.name}, ${con.valueInGold} altın. İncelemek için tıklayın.`}>
                <Row wrap>
                  <T size={13}>{con.categoryIcon + ' '}</T>
                  <T weight="bold" color={HealthGreen} size={13}>
                    {con.name}
                  </T>
                  {con.requiredLevel > 1 ? (
                    <>
                      <Spacer w={4} />
                      <T size={10} color={isLevelMet ? TextMuted : color(0xffff6b6b)} weight={!isLevelMet ? 'bold' : 'normal'}>
                        {`Sev.${con.requiredLevel}`}
                      </T>
                    </>
                  ) : null}
                </Row>
                <T size={11} color={AmberGold}>
                  {statSummary}
                </T>
                <T size={10} color={TextMuted} lines={1}>
                  {con.description}
                </T>
              </Column>
              <Row gap={4}>
                <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                  <IconBtn onPress={() => onInspectConsumable(con)} label="İncele">
                    <T size={14}>🔍</T>
                  </IconBtn>
                </View>
                <Btn
                  onPress={() => viewModel.buyConsumable(con)}
                  disabled={!canBuy}
                  color={HealthGreen}
                  contentColor={Color.White}
                  pad={8}
                  textSize={11}
                  label={`Satın Al: ${con.name}`}
                >
                  Satın Al
                </Btn>
              </Row>
            </Row>
          </Card>
        );
      });
    });
  }

  // --- BİLGE MÜTERCİM JİN-ZHEN: KADİM TOMARLARI DEŞİFRE ETME ---
  if (npc.role === NpcRole.SCHOLAR) {
    const sealedScrolls = (player.consumables || []).filter((it) => it.type === ItemType.SCROLL && it.id.startsWith('item_sealed_scroll_'));
    add('scholar_intro', () => (
      <Surface radius={10} color={DarkSurfaceCard} borderColor={AmberGold} borderWidth={1.5}>
        <Column pad={12}>
          <Row gap={8}>
            <T size={24} hidden>
              📜
            </T>
            <Column style={{ flex: 1 }}>
              <T size={14} weight="bold" color={AmberGold} heading>
                Kadim Doğu Yazıtları & Tomar Tercümesi
              </T>
              <T size={11} color={TextMuted}>
                Bataklıkta bulduğun mühürlü tomarları burada deşifre ettir.
              </T>
            </Column>
          </Row>
          <Spacer h={8} />
          <T size={11} color={alpha(TextLight, 0.85)} lineHeight={16}>
            Jin-Zhen'in Doğu mürekkebi ve tütsü dumanı, kilitli balmumu mühürleri eriterek antik dövüş tekniklerini Yetenek Küresi haline getirir. Açılan yetenekler doğrudan zihnine ve çantana işlenir.
          </T>
        </Column>
      </Surface>
    ));

    if (sealedScrolls.length > 0) {
      add('scholar_count', () => (
        <T size={12} weight="bold" color={AmberGoldDark}>
          {`Çantandaki Mühürlü Tomarlar (${sealedScrolls.length}):`}
        </T>
      ));
      sealedScrolls.forEach((scroll, idx) => {
        add(`scroll_${idx}_${scroll.id}`, () => {
          const mappedSkillId = StarterContent.getScrollSkillMapping(scroll.id);
          const alreadyLearned = mappedSkillId != null && (player.unlockedSkillIds || []).includes(mappedSkillId);
          return (
            <Surface radius={8} color={DarkSurface} borderColor={alreadyLearned ? TextMuted : AmberGold} borderWidth={1}>
              <Column pad={10}>
                <Row justify="between" style={{ alignSelf: 'stretch' }}>
                  <T size={13} weight="bold" color={Color.White} style={{ flexShrink: 1 }}>
                    {scroll.name}
                  </T>
                  {scroll.count > 1 ? (
                    <T size={12} color={AmberGold}>
                      {`x${scroll.count}`}
                    </T>
                  ) : null}
                </Row>
                <Spacer h={4} />
                <T size={11} color={alpha(TextLight, 0.85)}>
                  {scroll.description}
                </T>
                <Spacer h={8} />
                <Btn
                  onPress={() => viewModel.decipherSealedScroll(scroll.id)}
                  disabled={alreadyLearned}
                  color={AmberGold}
                  contentColor={DarkBg}
                  radius={6}
                  textSize={12}
                  style={{ alignSelf: 'stretch' }}
                  label={alreadyLearned ? `${scroll.name}: Bu Sır Zaten Çözüldü` : `${scroll.name}: Mührü Erit & Deşifre Et (Yetenek Aç)`}
                >
                  {alreadyLearned ? '✓ Bu Sır Zaten Çözüldü' : '📜 Mührü Erit & Deşifre Et (Yetenek Aç)'}
                </Btn>
              </Column>
            </Surface>
          );
        });
      });
    } else {
      add('scholar_none', () => (
        <Surface radius={8} color={alpha(DarkBg, 0.7)} borderColor={DarkBorder} borderWidth={1}>
          <Column pad={12}>
            <T weight="bold" color={AmberGoldDark} size={12}>
              ⚠️ Üzerinde Mühürlü Tomar Yok
            </T>
            <Spacer h={4} />
            <T size={11} color={alpha(TextLight, 0.8)} lineHeight={15}>
              Bilge Jin-Zhen: 'Şu anda üzerinde mühürlü bir Doğu yazıtı bulunmuyor evlat. Kasaba panosundaki bataklık keşiflerini (Sazlık Mabedi, Kervan Enkazı, Münzevi İni vb.) tamamlayarak antik mühürlü tomarlar bulabilirsin.'
            </T>
          </Column>
        </Surface>
      ));
    }
  }

  // 3. Mücevheratçı & Taş Ustası Kael (JEWELER)
  if (npc.role === NpcRole.JEWELER) {
    const isRegion2Unlocked = viewModel.canTravelToRegion2;
    add('jew_tabs', () => (
      <Column>
        <Tabs titles={['💎 Yuvalar & Kakma', '✨ Kırık Sentezi', '⚡ Taş Yükselt']} selected={jewelerTab} onSelect={setJewelerTab} color={DarkSurfaceCard} />
        <Spacer h={4} />
      </Column>
    ));

    if (jewelerTab === 0) {
      add('jew_sockets_intro', () => (
        <Surface radius={8} color={DarkSurfaceCard} borderColor={alpha(AmberGold, 0.5)} borderWidth={1}>
          <Column pad={10}>
            <T weight="bold" color={AmberGold} size={14} heading>
              💎 Mücevherat & Yuva Tezgahı
            </T>
            <Spacer h={4} />
            <T size={12} color={alpha(TextLight, 0.85)}>
              Teçhizatlarındaki kilitli yuvaları altınla açtırabilir (Common: 1, Rare: 2, Epic/Leg: 3 yuva) veya yuvalara mücevher kakıp söktürebilirsin.
            </T>
            <Spacer h={6} />
            <T size={12} weight="semibold" color={TextGold}>
              {`Mevcut Mücevherlerin: ${player.gemsInventory.length} Adet`}
            </T>
            {!isRegion2Unlocked ? (
              <>
                <Spacer h={8} />
                <Surface radius={6} color={DarkBg} borderColor={alpha(HealthRed, 0.7)} borderWidth={1}>
                  <Row pad={8} gap={6}>
                    <T size={16} hidden>
                      🔒
                    </T>
                    <T size={11} color={HealthRed} weight="semibold" style={{ flex: 1 }}>
                      Taş Yuvaları Kilitli! Bu kadim zanaat 2. Bölüm (Taş Hisar) fermanı açıldığında kullanılabilir.
                    </T>
                  </Row>
                </Surface>
              </>
            ) : null}
          </Column>
        </Surface>
      ));

      if (player.inventory.length === 0) {
        add('jew_inv_empty', () => (
          <T size={12} color={TextMuted} style={{ paddingVertical: 12 }}>
            Çantanızda teçhizat bulunmuyor.
          </T>
        ));
      } else {
        player.inventory.forEach((eq, i) => {
          add(`jew_inv_${i}_${eq.id}`, () => {
            const drillCost = eq.canUnlockMoreSockets ? GemCraftingRules.getSocketDrillCost(eq.unlockedSockets) : 0;
            return (
              <Card color={DarkSurfaceCard} radius={8}>
                <Column pad={10}>
                  <Row justify="between" style={{ alignSelf: 'stretch' }} gap={6} label={`${eq.name}. Yuva: ${eq.sockets.length}/${eq.unlockedSockets} (Maks: ${eq.effectiveMaxSockets})`}>
                    <T weight="bold" size={13} color={color(eq.rarity.colorHex)} style={{ flexShrink: 1 }}>
                      {eq.name}
                    </T>
                    <T size={12} weight="bold" color={AmberGold}>
                      {`Yuva: ${eq.sockets.length}/${eq.unlockedSockets} (Maks: ${eq.effectiveMaxSockets})`}
                    </T>
                  </Row>

                  <Spacer h={4} />
                  {eq.sockets.length > 0
                    ? eq.sockets.map((gem, sIdx) => (
                        <Row key={sIdx} justify="between" style={{ alignSelf: 'stretch' }}>
                          <T size={11} color={TextLight} style={{ flex: 1 }}>
                            {`${gem.type.icon} ${gem.displayName} (${gem.effectSummary})`}
                          </T>
                          <TextBtn
                            onPress={() => viewModel.removeGem(eq.id, sIdx)}
                            contentColor={HealthRed}
                            textSize={10}
                            label={`Sök: ${gem.displayName}, ${GemCraftingRules.GEM_REMOVE_COST_GOLD} altın`}
                          >
                            {`Sök (${GemCraftingRules.GEM_REMOVE_COST_GOLD}🪙)`}
                          </TextBtn>
                        </Row>
                      ))
                    : null}

                  <Row gap={6} style={{ alignSelf: 'stretch' }}>
                    {eq.canUnlockMoreSockets ? (
                      <>
                        <OutlinedBtn
                          onPress={() => viewModel.addSocketToEquipment(eq.id)}
                          disabled={!(isRegion2Unlocked && player.gold >= drillCost)}
                          style={{ flex: 1 }}
                          pad={4}
                          textSize={10}
                        >
                          {isRegion2Unlocked ? `+ Yuva Del (${drillCost}🪙)` : '🔒 Yuva (Kilitli)'}
                        </OutlinedBtn>
                        {eq.lockedSockets >= 2 ? (
                          <OutlinedBtn
                            onPress={() => viewModel.unlockAllSocketsForEquipment(eq.id)}
                            disabled={!(isRegion2Unlocked && player.gold >= drillCost)}
                            style={{ flex: 1 }}
                            pad={4}
                            textSize={10}
                          >
                            {isRegion2Unlocked ? 'Tümünü Del ⚡' : '🔒 Kilitli'}
                          </OutlinedBtn>
                        ) : null}
                      </>
                    ) : null}

                    {eq.freeSockets > 0 ? (
                      <Btn
                        onPress={() => onSelectGemTarget(eq)}
                        disabled={!(isRegion2Unlocked && player.gemsInventory.length > 0 && player.gold >= GemCraftingRules.GEM_SOCKET_COST_GOLD)}
                        color={AmberGold}
                        contentColor={DarkBg}
                        style={{ flex: 1 }}
                        pad={4}
                        textSize={10}
                      >
                        {isRegion2Unlocked ? `Taş Seç & Mıhla (${GemCraftingRules.GEM_SOCKET_COST_GOLD}🪙)` : '🔒 Kakma (Kilitli)'}
                      </Btn>
                    ) : null}
                  </Row>
                </Column>
              </Card>
            );
          });
        });
      }
    } else if (jewelerTab === 1) {
      // Kırık Parça Sentezi
      add('jew_shard_intro', () => {
        const hasAnySynthesizable = GemType.values().some((g) => player.getShardCount(g) >= 3);
        return (
          <Surface radius={8} color={DarkSurfaceCard} borderColor={alpha(AmberGold, 0.5)} borderWidth={1}>
            <Column pad={10}>
              <T weight="bold" color={AmberGold} size={14} heading>
                ✨ Kırık Parça Sentez Tezgahı
              </T>
              <Spacer h={4} />
              <T size={12} color={alpha(TextLight, 0.85)} lineHeight={16}>
                {`Maden ocaklarından kazıp topladığın mücevher kırıklarını burada 3'er adet ve ${GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD} altın zanaat bedeliyle saf Seviye 1 tam mücevhere dönüştürebilirsin.`}
              </T>
              <Spacer h={8} />
              <Btn
                onPress={() => viewModel.combineAllGemShards()}
                disabled={!(isRegion2Unlocked && hasAnySynthesizable && player.gold >= GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD)}
                color={AmberGold}
                contentColor={DarkBg}
                style={{ alignSelf: 'stretch' }}
                pad={8}
                textSize={11}
              >
                {isRegion2Unlocked ? `✨ Tüm Kırıkları Sentezle (${GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD}🪙/Adet)` : '🔒 2. Bölümde Açılır'}
              </Btn>
            </Column>
          </Surface>
        );
      });

      GemType.values().forEach((gType) => {
        add(`shard_${gType.name}`, () => {
          const count = player.getShardCount(gType);
          return (
            <Card color={DarkSurfaceCard} radius={8}>
              <Row pad={10} justify="between" gap={6}>
                <Column style={{ flex: 1 }} label={`${gType.displayName} Kırığı. Kırık Parça: ${count} / 3`}>
                  <T weight="bold" size={13} color={TextGold}>
                    {`${gType.icon} ${gType.displayName} Kırığı`}
                  </T>
                  <T size={11} color={count >= 3 ? HealthGreen : TextMuted} weight={count >= 3 ? 'bold' : 'normal'}>
                    {`Kırık Parça: ${count} / 3`}
                  </T>
                </Column>
                <Btn
                  onPress={() => viewModel.combineGemShards(gType)}
                  disabled={!(isRegion2Unlocked && count >= 3 && player.gold >= GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD)}
                  color={AmberGold}
                  contentColor={DarkBg}
                  pad={8}
                  textSize={11}
                  label={
                    isRegion2Unlocked
                      ? `Sentezle: ${gType.displayName}, ${GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD} altın`
                      : `${gType.displayName}: Kilitli`
                  }
                >
                  {isRegion2Unlocked ? `Sentezle (${GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD}🪙)` : '🔒 Kilitli'}
                </Btn>
              </Row>
            </Card>
          );
        });
      });
    } else {
      // Taş Seviye Yükseltme (1-10)
      const grouped = groupGemsByTypeAndLevel(player.gemsInventory);
      add('jew_upgrade_intro', () => {
        const hasAnyUpgradable = grouped.some(
          (g) => g.gems.length >= 3 && g.level < GemCraftingRules.MAX_GEM_LEVEL && player.gold >= GemCraftingRules.getUpgradeCostGold(g.level)
        );
        return (
          <Surface radius={8} color={DarkSurfaceCard} borderColor={alpha(AmberGold, 0.5)} borderWidth={1}>
            <Column pad={10}>
              <T weight="bold" color={AmberGold} size={14} heading>
                ⚡ Taş Seviye Yükseltme (Sv. 1 - 10)
              </T>
              <Spacer h={4} />
              <T size={12} color={alpha(TextLight, 0.85)} lineHeight={16}>
                Aynı türden ve aynı seviyeden 3 adet taşı tezgahta birleştirerek bir üst seviyeye yükseltebilirsin. Her seviyede cevherin istatistik gücü yaklaşık +%90 katlanarak artar. Başarısızlık durumunda telafi (pity) sistemi devreye girer; bir sonraki deneme şansına +%7 bonus eklenir ve teselli kırıkları kazanırsın!
              </T>
              <Spacer h={8} />
              <Btn
                onPress={() => viewModel.upgradeAllEligibleGems()}
                disabled={!(isRegion2Unlocked && hasAnyUpgradable)}
                color={AmberGold}
                contentColor={DarkBg}
                style={{ alignSelf: 'stretch' }}
                pad={8}
                textSize={11}
              >
                {isRegion2Unlocked ? '⚡ Tümünü Yükselt (Toplu Sentez)' : '🔒 2. Bölümde Açılır'}
              </Btn>
            </Column>
          </Surface>
        );
      });

      if (grouped.length === 0) {
        add('jew_upgrade_empty', () => (
          <T size={12} color={TextMuted} style={{ paddingVertical: 12 }}>
            Çantanızda yükseltilebilecek mücevher bulunmuyor.
          </T>
        ));
      } else {
        grouped.forEach((entry) => {
          add(`upg_${entry.type.name}_${entry.level}`, () => {
            const { type, level, gems } = entry;
            const count = gems.length;
            const cost = GemCraftingRules.getUpgradeCostGold(level);
            const sampleGem = gems[0];
            const targetLevel = level + 1;
            const currentPity = player.getPityForLevel(targetLevel);
            const baseRate = GemCraftingRules.getBaseSuccessRate(targetLevel);
            const effectiveRate = GemCraftingRules.getEffectiveSuccessRate(targetLevel, currentPity);
            return (
              <Card color={DarkSurfaceCard} radius={8}>
                <Column pad={10}>
                  <Row justify="between" style={{ alignSelf: 'stretch' }} gap={6}>
                    <T weight="bold" size={13} color={TextGold} style={{ flexShrink: 1 }}>
                      {sampleGem.displayName}
                    </T>
                    <T size={11} weight="bold" color={count >= 3 ? HealthGreen : AmberGold}>
                      {`Mevcut: ${count} Adet`}
                    </T>
                  </Row>
                  <Spacer h={2} />
                  <T size={11} color={alpha(TextLight, 0.8)}>
                    {sampleGem.effectSummary}
                  </T>
                  <Spacer h={4} />

                  {level < GemCraftingRules.MAX_GEM_LEVEL ? (
                    <>
                      <Row justify="between" style={{ alignSelf: 'stretch' }} wrap gap={4}>
                        <T size={11} color={effectiveRate >= 70 ? HealthGreen : effectiveRate >= 40 ? AmberGold : HealthRed} weight="bold">
                          {`Başarı Şansı: %${effectiveRate}` + (currentPity > 0 ? ` (%${baseRate} + %${currentPity} 🛡️ Telafi)` : '')}
                        </T>
                        {currentPity > 0 ? (
                          <T size={10} color={AmberGold} weight="bold">
                            {`+%${currentPity} Telafi Bonusu`}
                          </T>
                        ) : null}
                      </Row>
                      <Spacer h={6} />
                      <Btn
                        onPress={() => viewModel.upgradeGemLevel(type, level)}
                        disabled={!(isRegion2Unlocked && count >= 3 && player.gold >= cost)}
                        color={AmberGold}
                        contentColor={DarkBg}
                        style={{ alignSelf: 'stretch' }}
                        pad={6}
                        textSize={11}
                      >
                        {isRegion2Unlocked ? `3 Taşı Birleştir -> Sv. ${targetLevel} (${cost} 🪙) [Şans: %${effectiveRate}]` : '🔒 2. Bölümde Açılır'}
                      </Btn>
                    </>
                  ) : (
                    <T size={11} color={AmberGold} weight="bold">
                      {`✨ Azami Seviyeye Ulaşıldı (Sv. ${GemCraftingRules.MAX_GEM_LEVEL})`}
                    </T>
                  )}
                </Column>
              </Card>
            );
          });
        });
      }
    }
  }

  // 4. Özel Dövüş Eğitmeni Althea (TRAINER)
  if (npc.role === NpcRole.TRAINER) {
    const trainer = player.trainerStatus;
    add('trainer_intro', () => (
      <Surface radius={8} color={DarkSurfaceCard} borderColor={alpha(AmberGold, 0.5)} borderWidth={1}>
        <Column pad={10}>
          <T weight="bold" color={AmberGold} size={14} heading>
            🥋 Althea'nın Talim Salonu
          </T>
          <Spacer h={4} />
          <T size={12} weight="bold" color={TextLight}>
            {`Toplam Seans: ${trainer.totalSessions} / Sonraki Yetenek Eşiği: ${trainer.nextMilestone} Seans`}
          </T>
          <T size={11} color={TextMuted}>
            {`Dayanıklılık: ${trainer.enduranceCount} • Kuvvet: ${trainer.strengthCount} • Çeviklik: ${trainer.agilityCount}`}
          </T>
        </Column>
      </Surface>
    ));

    TrainingType.values().forEach((tType) => {
      add(`train_${tType.name}`, () => (
        <Card color={DarkSurfaceCard} radius={8}>
          <Column pad={10}>
            <Row justify="between" style={{ alignSelf: 'stretch' }} gap={6}>
              <T weight="bold" size={13} color={TextGold} style={{ flexShrink: 1 }}>
                {`${tType.icon} ${tType.title}`}
              </T>
              <T size={11} color={HealthRed} label={`${tType.costGold} altın, eksi ${tType.costHp} can`}>
                {`🪙 ${tType.costGold} | ❤️ -${tType.costHp} HP`}
              </T>
            </Row>
            <Spacer h={4} />
            <T size={11} color={alpha(TextLight, 0.85)}>
              {tType.description}
            </T>
            <Spacer h={8} />
            <Btn
              onPress={() => viewModel.trainWithAlthea(tType)}
              disabled={!(player.gold >= tType.costGold && player.currentHealth > tType.costHp + 5)}
              color={AmberGold}
              contentColor={DarkBg}
              style={{ alignSelf: 'stretch' }}
              textSize={12}
              label={`Talime Başla: ${tType.title}`}
            >
              Talime Başla
            </Btn>
          </Column>
        </Card>
      ));
    });
  }

  // 5. Kızıl Kadife Köşkü & Gizli Divan (COURTESAN)
  if (npc.role === NpcRole.COURTESAN) {
    add('court_intro', () => (
      <Surface radius={10} color={color(0xff241220)} borderColor={FamePurple} borderWidth={1}>
        <Column pad={14}>
          <Row>
            <T size={24} hidden>
              🏛️
            </T>
            <Spacer w={8} />
            <Column style={{ flex: 1 }}>
              <T weight="bold" color={AmberGold} size={15} heading>
                Kızıl Kadife Köşkü & Gizli Divan
              </T>
              <T size={11} color={alpha(TextLight, 0.7)}>
                Madam Lysandra'nın Yönetiminde
              </T>
            </Column>
          </Row>
          <Spacer h={8} />
          <T size={12} color={alpha(TextLight, 0.9)} lineHeight={16}>
            Hisarın en kudretli savaşçılarının dinlenip moral bulduğu, sırlar paylaştığı ve kadife perdelerin ardında diyarın en seçkin kadınlarıyla unutulmaz vuslatlar yaşadığı gizli sığınak.
          </T>
          {player.activeMoraleBuff != null ? (
            <>
              <Spacer h={8} />
              <Badge
                text={`✨ Aktif Tesir: ${player.activeMoraleBuff}`}
                textColor={AmberGold}
                bg={color(0xff1e101a)}
                borderColor={alpha(AmberGold, 0.5)}
                size={11}
                padH={8}
                padV={4}
                radius={6}
              />
            </>
          ) : null}
        </Column>
      </Surface>
    ));

    // HIZLI DİNLENME: SICAK LAVANTA HAMAMI
    add('court_bath', () => (
      <Surface radius={8} color={DarkSurfaceCard} borderColor={alpha(FamePurple, 0.5)} borderWidth={1}>
        <Column pad={12}>
          <T weight="bold" color={FamePurple} size={13} heading>
            🛁 Sıcak Lavanta Hamamı & Masaj
          </T>
          <Spacer h={3} />
          <T size={11} color={alpha(TextLight, 0.85)}>
            Sıcak sular ve buhar odaları yaralarını sarar (%35 Can tazeler), +5 Hasar & +5 Zırh moral kazandırır.
          </T>
          <Spacer h={8} />
          <Btn onPress={() => viewModel.visitCourtesan()} disabled={!(player.gold >= 30)} color={FamePurple} contentColor={Color.White} style={{ alignSelf: 'stretch' }} textSize={12}>
            Sıcak Banyoya Gir (30 Altın)
          </Btn>
        </Column>
      </Surface>
    ));

    // 1. SALON: KEHRİBAR & BAHARAT MECLİSİ (2.500 Altın)
    add('court_salon1', () => {
      const aresulaBond = kt.mapGet(player.companionBondLevels, 'fighter_aresula', null) ?? 0;
      return (
        <Surface radius={8} color={color(0xff2b1917)} borderColor={color(0xffd47a37)} borderWidth={1}>
          <Column pad={12}>
            <Row>
              <T size={18} hidden>
                🍸
              </T>
              <Spacer w={6} />
              <Column style={{ flex: 1 }}>
                <T weight="bold" color={color(0xfff5a362)} size={13} heading>
                  Kehribar & Baharat Meclisi (1. Salon)
                </T>
                <T size={10} color={alpha(TextLight, 0.7)}>
                  Şömine Alevleri, Nar Şarabı & Bozkır Ateşi
                </T>
              </Column>
            </Row>
            <Spacer h={6} />
            <T size={11} color={alpha(TextLight, 0.9)} lineHeight={15}>
              {'Sınır boylarının ve arenanın vahşi ruhlu kadınlarıyla her ziyarette bir kademe derinleşen sohbet, yakınlaşma ve vuslat.\n🌪️ Bu geceki konuk: Aresula (Fırtına Dansçısı)'}
            </T>
            <Spacer h={6} />
            <View style={{ alignSelf: 'flex-start' }}>
              <Badge
                text={aresulaBond >= 5 ? '💖 BAĞ: ZİRVE (5/5) — Dilediğin an vuslat yaşanabilir' : `İlişki İlerlemesi: Kademe ${aresulaBond} / 5`}
                textColor={aresulaBond >= 5 ? color(0xffffaec9) : color(0xfff5a362)}
                bg={aresulaBond >= 5 ? color(0xff4a1e29) : color(0xff1e1410)}
                borderColor={aresulaBond >= 5 ? color(0xffd47a8c) : alpha(color(0xffd47a37), 0.5)}
              />
            </View>
            <Spacer h={10} />
            <Btn
              onPress={() => viewModel.enterCompanionSalon(1)}
              disabled={!(player.gold >= 2500)}
              color={color(0xffbf6423)}
              contentColor={Color.White}
              disabledColor={DarkSurfaceCard}
              disabledContentColor={TextMuted}
              style={{ alignSelf: 'stretch' }}
              textSize={12}
            >
              {player.gold >= 2500 ? '🍸 Kehribar Meclisine Gir (2.500 Altın)' : '🔒 Yetersiz Altın (2.500 Altın)'}
            </Btn>
          </Column>
        </Surface>
      );
    });

    // 2. SALON: YEŞİM & İPEK MABEDİ (5.000 Altın)
    add('court_salon2', () => {
      const altheaBond = kt.mapGet(player.companionBondLevels, 'npc_althea', null) ?? 0;
      return (
        <Surface radius={8} color={color(0xff16251e)} borderColor={color(0xff389b72)} borderWidth={1}>
          <Column pad={12}>
            <Row>
              <T size={18} hidden>
                👑
              </T>
              <Spacer w={6} />
              <Column style={{ flex: 1 }}>
                <T weight="bold" color={color(0xff67d8a7)} size={13} heading>
                  Yeşim & İpek Mabedi (2. Salon • Elit)
                </T>
                <T size={10} color={alpha(TextLight, 0.7)}>
                  Misk Tütsüleri, Lavanta Jakuzisi & Asil Vuslat
                </T>
              </Column>
            </Row>
            <Spacer h={6} />
            <T size={11} color={alpha(TextLight, 0.9)} lineHeight={15}>
              {"Taş Hisar'ın en mağrur, ulaşılamaz kumandanlarıyla her ziyarette bir kademe açılan sırlar, tensel yakınlaşma ve asil vuslat.\n👠 Bu geceki konuk: Kızıl Muhafız Althea (Sürgün Kumandan)"}
            </T>
            <Spacer h={6} />
            <View style={{ alignSelf: 'flex-start' }}>
              <Badge
                text={altheaBond >= 5 ? '💖 BAĞ: ZİRVE (5/5) — Dilediğin an vuslat yaşanabilir' : `İlişki İlerlemesi: Kademe ${altheaBond} / 5`}
                textColor={altheaBond >= 5 ? color(0xffffaec9) : color(0xff67d8a7)}
                bg={altheaBond >= 5 ? color(0xff4a1e29) : color(0xff101e17)}
                borderColor={altheaBond >= 5 ? color(0xffd47a8c) : alpha(color(0xff389b72), 0.5)}
              />
            </View>
            <Spacer h={10} />
            <Btn
              onPress={() => viewModel.enterCompanionSalon(2)}
              disabled={!(player.gold >= 5000)}
              color={color(0xff287955)}
              contentColor={Color.White}
              disabledColor={DarkSurfaceCard}
              disabledContentColor={TextMuted}
              style={{ alignSelf: 'stretch' }}
              textSize={12}
            >
              {player.gold >= 5000 ? '👑 Yeşim Mabedine Gir (5.000 Altın)' : '🔒 Yetersiz Altın (5.000 Altın)'}
            </Btn>
          </Column>
        </Surface>
      );
    });
  }

  // 6. Büyük Talim Meydanı (TRAINING_GROUNDS)
  if (npc.role === NpcRole.TRAINING_GROUNDS) {
    add('tg_intro', () => (
      <Surface radius={8} color={DarkSurfaceCard} borderColor={alpha(AmberGold, 0.5)} borderWidth={1}>
        <Column pad={12}>
          <T weight="bold" color={AmberGold} size={14} heading>
            🎯 Büyük Talim ve Odaklanma Meydanı
          </T>
          <Spacer h={4} />
          <T size={12} color={alpha(TextLight, 0.85)} lineHeight={16}>
            Hisar muhafızlarının ve kadim savaş büyücülerinin talim yaptığı bu açık meydanda kendini geliştirebilir, savaşa hazırlanabilirsin. Her talim seansı 30 Altındır ve sana 25 Deneyim (EXP) ile geçici moral/odaklanma takviyesi sağlar.
          </T>
          {player.activeMoraleBuff != null ? (
            <>
              <Spacer h={6} />
              <T size={11} weight="bold" color={AmberGold}>
                {`✨ Aktif Tesir: ${player.activeMoraleBuff}`}
              </T>
            </>
          ) : null}
        </Column>
      </Surface>
    ));

    add('tg_melee', () => (
      <Card color={DarkSurfaceCard} radius={8}>
        <Column pad={12}>
          <T weight="bold" size={14} color={TextGold} heading>
            ⚔️ Kılıç ve Yakın Dövüş Talimi
          </T>
          <Spacer h={4} />
          <T size={12} color={alpha(TextLight, 0.8)}>
            Kuklalar ve garnizon muhafızlarıyla kılıç çarpıştırma. +25 EXP ve Savaşçı Keskinliği (+5 Can, +%3 Sıyrılma) kazandırır.
          </T>
          <Spacer h={8} />
          <Btn onPress={() => viewModel.trainAtTrainingGrounds('melee')} disabled={!(player.gold >= 30)} color={AmberGold} contentColor={DarkBg} style={{ alignSelf: 'stretch' }} textSize={12}>
            Kılıç Talimi Yap (30 🪙)
          </Btn>
        </Column>
      </Card>
    ));

    add('tg_magic', () => (
      <Card color={DarkSurfaceCard} radius={8}>
        <Column pad={12}>
          <T weight="bold" size={14} color={TextGold} heading>
            🔮 Kadim Büyü ve Rün Odaklanması
          </T>
          <Spacer h={4} />
          <T size={12} color={alpha(TextLight, 0.8)}>
            Deniz rüzgarına karşı mistik rün taşlarıyla zihinsel odaklanma. +25 EXP ve Mistik Rün Odaklanması (+5 Can, +%3 Kritik) kazandırır.
          </T>
          <Spacer h={8} />
          <Btn
            onPress={() => viewModel.trainAtTrainingGrounds('magic')}
            disabled={!(player.gold >= 30)}
            color={color(0xff6b4c82)}
            contentColor={Color.White}
            style={{ alignSelf: 'stretch' }}
            textSize={12}
          >
            Büyü Odaklanması Yap (30 🪙)
          </Btn>
        </Column>
      </Card>
    ));
  }

  return (
    <Dialog onDismiss={onDismiss} full label={npc.name}>
      <Column style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: DarkBorder, backgroundColor: DarkSurface }}>
        <T color={TextGold} weight="bold" size={18} heading>
          {npc.name}
        </T>
        <T color={TextMuted} size={12}>
          {`${npc.role.title} • ${npc.title}`}
        </T>
      </Column>
      <ItemColumn items={items} gap={10} contentStyle={{ padding: 16 }} />
      <Row justify="end" style={{ paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: DarkBorder, backgroundColor: DarkSurface }}>
        <TextBtn onPress={onDismiss} contentColor={AmberGold}>
          Ayrıl
        </TextBtn>
      </Row>
      {children}
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Bölge kartları
// ---------------------------------------------------------------------------
function RegionHeaderCard({ region }) {
  // Local Fame Meter
  const fameFrac = kt.coerceIn(region.localFame / region.maxLocalFame, 0, 1);
  const fameRank = fameFrac >= 0.8 ? 'Kasaba Efsanesi' : fameFrac >= 0.5 ? 'Tanınan Silahşör' : fameFrac >= 0.2 ? 'Cesur Yabancı' : 'Bilinmeyen Sürgün';
  return (
    <Card color={DarkSurface} radius={12} borderColor={AmberGoldDark}>
      <Column pad={16}>
        <Row justify="between" style={{ alignSelf: 'stretch' }}>
          <T style={Typography.labelSmall} color={AmberGold}>
            🗺️ BÖLGE HARİTASI
          </T>
          <T size={12} color={TextMuted}>
            {`Tavsiye Seviye: ${region.recommendedLevel}+`}
          </T>
        </Row>
        <Spacer h={4} />
        <T style={Typography.titleLarge} color={TextGold} weight="bold" heading>
          {region.name}
        </T>
        <Spacer h={6} />
        <T style={Typography.bodyMedium} color={alpha(TextLight, 0.85)}>
          {region.description}
        </T>

        <Spacer h={14} />

        <Column>
          <Row justify="between" style={{ alignSelf: 'stretch' }}>
            <T size={12} color={TextGold}>
              {`Yerel Şöhret İbresi (${fameRank})`}
            </T>
            <T size={12} color={FamePurple}>
              {`${region.localFame} / ${region.maxLocalFame}`}
            </T>
          </Row>
          <Spacer h={4} />
          <Progress value={fameFrac} color={FamePurple} track={DarkSurfaceCard} height={8} radius={4} />
        </Column>
      </Column>
    </Card>
  );
}

function NpcListItemCard({ npc, onClick }) {
  return (
    <Card onPress={onClick} label={`${npc.name}, ${npc.title}. Etkileşim için dokunun.`} color={DarkSurface} radius={10} borderColor={DarkBorder}>
      <Row pad={14} justify="between" gap={8}>
        <Column style={{ flex: 1 }}>
          <T weight="bold" color={TextGold} size={16}>
            {npc.name}
          </T>
          <T size={12} color={AmberGoldDark}>
            {`${npc.role.title} • ${npc.title}`}
          </T>
          <Spacer h={4} />
          <T size={12} color={alpha(TextLight, 0.8)}>
            {`"${npc.greeting}"`}
          </T>
        </Column>
        <Surface color={AmberGold} radius={8} style={{ paddingHorizontal: 14, minHeight: 36, justifyContent: 'center' }}>
          <T size={12} weight="bold" color={DarkBg}>
            Konuş
          </T>
        </Surface>
      </Row>
    </Card>
  );
}

function TavernLocationCard({ onClick }) {
  return (
    <Card
      onPress={onClick}
      label="İsli Kandil Hanı, Mekan. Odun ateşi çıtırdar, kervancılar zar atar, kuytudaki masalarda diyarın sırları fısıldanır. Hana girmek için dokunun."
      color={DarkSurface}
      radius={10}
      borderColor={alpha(AmberGoldDark, 0.8)}
    >
      <Row pad={14} justify="between">
        <Column style={{ flex: 1 }}>
          <Row gap={6} wrap>
            <T weight="bold" color={TextGold} size={16}>
              🍺 İsli Kandil Hanı
            </T>
            <Badge text="MEKAN" textColor={AmberGold} bg={color(0xff2e2211)} />
          </Row>
          <Spacer h={4} />
          <T size={12} color={alpha(TextLight, 0.85)}>
            "Odun ateşi çıtırdar, kervancılar zar atar, kuytudaki masalarda diyarın sırları fısıldanır..."
          </T>
        </Column>
        <Spacer w={8} />
        <Surface color={AmberGold} radius={8} style={{ paddingHorizontal: 14, minHeight: 36, justifyContent: 'center' }}>
          <T size={12} weight="bold" color={DarkBg}>
            Hana Gir
          </T>
        </Surface>
      </Row>
    </Card>
  );
}

// Kotlin'de tanımlı ama kullanılmıyor; birebirlik için taşındı.
// eslint-disable-next-line no-unused-vars
function HarvestLocationCard({ isUnlocked = true, onClick }) {
  return (
    <Card
      onPress={onClick}
      label={
        isUnlocked
          ? 'Diyar Kaynak Sahaları, Mekan. Maden Ocakları, Şifa Çayırları, Keten Vadisi ve Kadim Meşe Koruluğu. Toplanan madenler ve mücevher kırıkları evindeki sandıklara akar. Kaynak toplamak için dokunun.'
          : 'Diyar Kaynak Sahaları, Kilitli Mekan. 2. Bölüm Taş Hisar Garnizonu fermanı açıldığında kullanılabilir.'
      }
      color={DarkSurface}
      radius={10}
      borderColor={isUnlocked ? alpha(AmberGoldDark, 0.8) : alpha(HealthRed, 0.5)}
    >
      <Row pad={14} justify="between">
        <Column style={{ flex: 1 }}>
          <Row gap={6} wrap>
            <T weight="bold" color={isUnlocked ? TextGold : TextMuted} size={16}>
              ⛏️ Diyar Kaynak Sahaları
            </T>
            <Badge text={isUnlocked ? 'MEKAN' : '🔒 KİLİTLİ'} textColor={isUnlocked ? HealthGreen : HealthRed} bg={isUnlocked ? color(0xff1b2e22) : color(0xff2e1b1b)} />
          </Row>
          <Spacer h={4} />
          <T size={12} color={isUnlocked ? alpha(TextLight, 0.85) : TextMuted}>
            {isUnlocked
              ? '"Maden Ocakları, Şifa Çayırları, Keten Vadisi ve Kadim Koruluk... Toplanan madenler ve mücevher kırıkları evindeki sandıklara akar."'
              : '🔒 2. Bölüm (Taş Hisar Garnizonu) fermanı açılmadan kaynak sahalarına erişilemez.'}
          </T>
        </Column>
        <Spacer w={8} />
        <Surface color={isUnlocked ? AmberGold : DarkSurfaceCard} radius={8} style={{ paddingHorizontal: 14, minHeight: 36, justifyContent: 'center' }}>
          <T size={12} weight="bold" color={isUnlocked ? DarkBg : TextMuted}>
            {isUnlocked ? 'Sahaya Gir' : 'Kilitli'}
          </T>
        </Surface>
      </Row>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Kaynak sahaları
// ---------------------------------------------------------------------------
export function HarvestRegionView({ viewModel, onReturn, onOpenSpot }) {
  useFlow(viewModel.player);
  const isRegion2Unlocked = viewModel.canTravelToRegion2;

  // 4 Mekan Kartı:
  const spots = [
    ['mines', '⛏️ Çorak Maden Ocağı', 'Demir Filizi, Ham İnşaat Taşı & Mücevher Kırıkları (%20 şansla 18 çeşit taştan biri)'],
    ['herbs', '🌿 Ayaz Şifa Çayırı', 'Şifalı Yabani Otlar (İksir ve sağlık hazırlıkları için)'],
    ['cloth', '🧵 Keten Vadisi', 'Keten ve Sağlam Halat Lifleri (Kumaş zırh ve donanım için)'],
    ['wood', '🪵 Kadim Meşe Koruluğu', 'Sert Meşe Kerestesi ve Odun (Yapı ve yay yapımı için)'],
  ];

  return (
    <Scroll gap={14} contentStyle={{ paddingHorizontal: 16, paddingVertical: 6 }}>
      <Card color={DarkSurface} radius={12} borderColor={AmberGoldDark} borderWidth={1.5}>
        <Column pad={16}>
          <Row justify="between" style={{ alignSelf: 'stretch' }} gap={6}>
            <T style={Typography.titleMedium} weight="black" color={AmberGold} letterSpacing={1} heading>
              ⛏️ DİYAR KAYNAK SAHALARI
            </T>
            <Badge
              text={isRegion2Unlocked ? 'ERİŞİLEBİLİR' : '🔒 KİLİTLİ'}
              textColor={isRegion2Unlocked ? HealthGreen : HealthRed}
              bg={isRegion2Unlocked ? alpha(HealthGreen, 0.2) : alpha(HealthRed, 0.2)}
              borderColor={isRegion2Unlocked ? HealthGreen : HealthRed}
            />
          </Row>
          <Spacer h={6} />
          <T size={12} color={TextLight} lineHeight={17}>
            Kadim toprakların zengin maden damarları, şifalı yabani ot çayırları ve ulu korulukları. Burada toplanan her kaynak evindeki sandıklara akar. Çalışmak istediğin mekana tıkla.
          </T>
          <Spacer h={10} />
          <OutlinedBtn onPress={onReturn} contentColor={TextGold} borderColor={AmberGoldDark} radius={8} style={{ alignSelf: 'stretch' }} textSize={12}>
            ← Çarşıya / Haritaya Dön
          </OutlinedBtn>
        </Column>
      </Card>

      {spots.map(([spotId, name, desc]) => (
        <Card
          key={spotId}
          onPress={() => onOpenSpot(spotId)}
          disabled={!isRegion2Unlocked}
          dimDisabled={false}
          label={`${name}, Mekan. ${desc}. ${isRegion2Unlocked ? 'Mekana girmek için dokunun.' : 'Kilitli. 2. Bölüm Taş Hisar açılmalıdır.'}`}
          color={DarkSurface}
          radius={10}
          borderColor={isRegion2Unlocked ? alpha(AmberGoldDark, 0.8) : alpha(HealthRed, 0.4)}
        >
          <Row pad={14} justify="between">
            <Column style={{ flex: 1 }}>
              <Row gap={6} wrap>
                <T weight="bold" color={isRegion2Unlocked ? TextGold : TextMuted} size={15}>
                  {name}
                </T>
                <Badge
                  text={isRegion2Unlocked ? 'MEKAN' : '🔒 KİLİTLİ'}
                  textColor={isRegion2Unlocked ? HealthGreen : HealthRed}
                  bg={isRegion2Unlocked ? color(0xff1b2e22) : color(0xff2e1b1b)}
                />
              </Row>
              <Spacer h={4} />
              <T size={12} color={isRegion2Unlocked ? alpha(TextLight, 0.85) : TextMuted}>
                {desc}
              </T>
            </Column>
            <Spacer w={8} />
            <Surface color={isRegion2Unlocked ? AmberGold : DarkSurfaceCard} radius={8} style={{ paddingHorizontal: 14, minHeight: 36, justifyContent: 'center' }}>
              <T size={12} weight="bold" color={isRegion2Unlocked ? DarkBg : TextMuted}>
                {isRegion2Unlocked ? 'Mekana Gir' : 'Kilitli'}
              </T>
            </Surface>
          </Row>
        </Card>
      ))}

      <Spacer h={70} />
    </Scroll>
  );
}

function GemSelectionDialog({ equipment, player, onDismiss, onSelectGem }) {
  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      dismiss={
        <TextBtn onPress={onDismiss} contentColor={TextLight}>
          Vazgeç
        </TextBtn>
      }
      title={
        <Column>
          <T color={TextGold} weight="bold" size={17} heading>
            💎 Yuva İçin Mücevher Seç
          </T>
          <T color={TextMuted} size={12}>
            {`${equipment.name} • Boş Yuva: ${equipment.freeSockets} • Mıhlama: ${GemCraftingRules.GEM_SOCKET_COST_GOLD} 🪙`}
          </T>
        </Column>
      }
      text={
        player.gemsInventory.length === 0 ? (
          <Column style={{ alignSelf: 'stretch', paddingVertical: 12 }}>
            <T size={12} color={TextLight} lineHeight={17}>
              {'Çantanızda veya sandığınızda takılabilecek işlenmiş mücevher bulunmuyor.\n\nKırık Sentezi sekmesinden veya sandığından kırık parçaları birleştirerek taş üretebilirsin.'}
            </T>
          </Column>
        ) : (
          <Column gap={8} style={{ alignSelf: 'stretch' }}>
            {player.gemsInventory.map((gem, i) => (
              <Card key={`${i}_${gem.id}`} color={DarkSurfaceCard} radius={8}>
                <Row pad={10} justify="between" gap={6}>
                  <Column style={{ flex: 1 }}>
                    <T weight="bold" size={13} color={TextGold}>
                      {`${gem.type.icon} ${gem.displayName}`}
                    </T>
                    <T size={11} color={HealthGreen}>
                      {gem.effectSummary}
                    </T>
                  </Column>
                  <Btn
                    onPress={() => onSelectGem(gem)}
                    disabled={!(player.gold >= GemCraftingRules.GEM_SOCKET_COST_GOLD)}
                    color={AmberGold}
                    contentColor={DarkBg}
                    pad={8}
                    textSize={10}
                    label={`Mıhla: ${gem.displayName}, ${GemCraftingRules.GEM_SOCKET_COST_GOLD} altın`}
                  >
                    {`Mıhla (${GemCraftingRules.GEM_SOCKET_COST_GOLD}🪙)`}
                  </Btn>
                </Row>
              </Card>
            ))}
          </Column>
        )
      }
    />
  );
}

export function HarvestSpotDialog({ spotType, viewModel, onDismiss }) {
  const player = useFlow(viewModel.player);
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [logs, setLogs] = useState([]);

  // İleride mekana özel arka plan ambiyans sesi eklenecek kanca
  useEffect(() => {
    // TODO: Her mekan için özel ambiyans sesi tetiklenebilir (örneğin maden kazma, rüzgar, orman vb.)
  }, [spotType]);

  useEffect(() => {
    if (!isHarvesting) return undefined;
    let iptal = false;
    (async () => {
      while (!iptal) {
        await kt.delay(2500);
        if (iptal) break;
        const result = viewModel.performHarvestTick(spotType);
        const narrative = result && result.narrative;
        setLogs((onceki) => kt.take([narrative, ...onceki], 12));
        if (narrative) announce(narrative);
      }
    })();
    return () => {
      iptal = true;
    };
  }, [isHarvesting, spotType]);

  const [title, icon, desc] =
    spotType === 'mines'
      ? ['Çorak Maden Ocağı', '⛏️', 'Demir Filizi, Ham İnşaat Taşı & Mücevher Kırıkları']
      : spotType === 'herbs'
        ? ['Ayaz Şifa Çayırı', '🌿', 'Şifalı Yabani Otlar ve Kökler']
        : spotType === 'cloth'
          ? ['Keten Vadisi', '🧵', 'Keten Lifleri ve Sağlam İplikler']
          : spotType === 'wood'
            ? ['Kadim Meşe Koruluğu', '🪵', 'Sert Meşe Kerestesi ve Kadim Odun']
            : ['Diyar Kaynak Sahası', '⛏️', 'Kaynak Toplama Sahası'];

  const kapat = () => {
    setIsHarvesting(false);
    onDismiss();
  };
  const builtChests = player.builtChests || [];

  return (
    <AlertDialog
      onDismiss={kapat}
      containerColor={DarkSurface}
      confirm={
        <TextBtn onPress={kapat} contentColor={AmberGold}>
          Mekandan Ayrıl
        </TextBtn>
      }
      title={
        <Column>
          <Row gap={8} wrap>
            <T color={TextGold} weight="bold" size={18} heading>
              {`${icon} ${title}`}
            </T>
            {isHarvesting ? <Badge text="ÇALIŞILIYOR..." textColor={HealthGreen} bg={alpha(HealthGreen, 0.2)} borderColor={HealthGreen} /> : null}
          </Row>
          <T color={TextMuted} size={12}>
            {desc}
          </T>
        </Column>
      }
      text={
        <Column gap={10} style={{ alignSelf: 'stretch' }}>
          <Surface radius={6} color={DarkSurfaceCard} borderColor={alpha(AmberGold, 0.3)} borderWidth={1}>
            <Column pad={8}>
              <T size={11} weight="bold" color={TextGold}>
                {`📦 Ev Depo Durumu: ${builtChests.length}/${player.unlockedChestSlots} Sandık İnşa Edildi`}
              </T>
              <T size={10} color={alpha(TextLight, 0.8)}>
                Evinde ilgili kaynak için bir sandık varsa, toplanan malzemeler otomatik olarak sandığa yerleştirilir.
              </T>
            </Column>
          </Surface>

          <Btn
            onPress={() => setIsHarvesting(!isHarvesting)}
            color={isHarvesting ? HealthRed : AmberGold}
            contentColor={isHarvesting ? Color.White : DarkBg}
            radius={8}
            style={{ alignSelf: 'stretch' }}
            textSize={13}
            label={isHarvesting ? 'Toplamayı Durdur' : 'Otomatik Toplamayı Başlat'}
          >
            {isHarvesting ? '⏹️ Toplamayı Durdur' : '▶️ Otomatik Toplamayı Başlat (2.5 sn)'}
          </Btn>

          {logs.length > 0 ? (
            <>
              <T weight="bold" size={12} color={TextGold} heading>
                Canlı Saha Günlüğü:
              </T>
              <Column gap={4} pad={8} radius={6} color={color(0xff14110e)} style={{ alignSelf: 'stretch' }}>
                {logs.map((log, i) => (
                  <T key={`${logs.length}_${i}`} size={11} color={TextLight} lineHeight={15}>
                    {log}
                  </T>
                ))}
              </Column>
            </>
          ) : null}
        </Column>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// İsli Kandil Hanı kartları
// ---------------------------------------------------------------------------
function TavernIntroCard() {
  return (
    <Card color={DarkSurface} radius={12} borderColor={AmberGoldDark}>
      <Column pad={14}>
        <T style={Typography.labelSmall} color={AmberGold}>
          🍺 KASABANIN KALBİ
        </T>
        <Spacer h={2} />
        <T style={Typography.titleLarge} color={TextGold} weight="bold" heading>
          İsli Kandil Hanı
        </T>
        <Spacer h={6} />
        <T style={Typography.bodyMedium} color={alpha(TextLight, 0.85)} lineHeight={18}>
          Bataklık ve arena tozunun yıkandığı loş, sıcak bir sığınak. Odun ateşinin çıtırtısı, arpa şarabının kokusu ve tahta masalardan yükselen dertli fısıltılar hanın havasını dolduruyor.
        </T>
      </Column>
    </Card>
  );
}

function TavernEavesdropCard({ currentTale, canEavesdrop, remainingCount, maxCount, onListenNext }) {
  const clueText =
    currentTale != null && currentTale.questClueId != null
      ? currentTale.clueDiscoveryText ?? 'Önemli bir ipucu yakaladın! Yeni bir sözleşme sözleşmeler panosuna eklendi.'
      : null;
  const taleLabel =
    currentTale != null
      ? `${currentTale.speakerName}, ${currentTale.speakerTitle}. ${currentTale.category.displayName}. ${currentTale.title}. "${currentTale.narrative}"` +
        (clueText ? ` ${clueText}` : '')
      : null;
  useAnnounceOnChange(currentTale, taleLabel);
  return (
    <Card color={DarkSurfaceCard} radius={12} borderColor={DarkBorder}>
      <Column pad={14}>
        <Row justify="between" style={{ alignSelf: 'stretch' }}>
          <Column style={{ flex: 1 }}>
            <Row gap={6} wrap>
              <T style={Typography.titleMedium} weight="bold" color={TextGold} heading>
                👂 Masalara Kulak Kabart
              </T>
              <Badge
                text={`${remainingCount}/${maxCount} Hak`}
                textColor={canEavesdrop ? AmberGold : HealthRed}
                bg={canEavesdrop ? alpha(AmberGoldDark, 0.25) : color(0xff3e1e1e)}
                label={`${remainingCount} / ${maxCount} hak`}
              />
            </Row>
            <T size={11} color={TextMuted}>
              Kuytudaki masaların dedikodularına ve fısıltılarına gizlice kulak ver.
            </T>
          </Column>
          <Spacer w={8} />
          <Btn
            onPress={onListenNext}
            disabled={!canEavesdrop}
            color={AmberGold}
            contentColor={DarkBg}
            disabledColor={DarkSurface}
            disabledContentColor={TextMuted}
            radius={8}
            pad={8}
            textSize={11}
          >
            {!canEavesdrop ? '🔒 Masalar Sustu' : currentTale == null ? '🎧 Masaları Dinle' : '🎧 Başka Masayı Dinle'}
          </Btn>
        </Row>

        <Spacer h={10} />

        {!canEavesdrop ? (
          <Surface radius={8} color={color(0xff2a1b1b)} borderColor={color(0xff8b2525)} borderWidth={1} style={{ marginBottom: 8 }}>
            <Row pad={10} gap={8}>
              <T size={16} hidden>
                🤫
              </T>
              <T size={11} color={color(0xffffb4ab)} lineHeight={15} style={{ flex: 1 }}>
                Gözlerin üzerinizde olduğunu fark ettin. Masadakiler fısıldaşmayı kesip kuşkulu bakışlar atıyor. Yeni dedikodular için yarın şafağı beklemelisin.
              </T>
            </Row>
          </Surface>
        ) : null}

        {/* Tale Content Card */}
        {currentTale != null ? (
          <Surface radius={8} color={DarkSurface} borderColor={alpha(AmberGoldDark, 0.5)} borderWidth={1} label={taleLabel}>
            <Column pad={12}>
              <Row justify="between" style={{ alignSelf: 'stretch' }} gap={6}>
                <Column style={{ flexShrink: 1 }}>
                  <T weight="bold" color={TextGold} size={14}>
                    {currentTale.speakerName}
                  </T>
                  <T size={11} color={TextMuted}>
                    {currentTale.speakerTitle}
                  </T>
                </Column>
                <Badge text={`${currentTale.category.badgeIcon} ${currentTale.category.displayName}`} textColor={AmberGold} bg={DarkSurfaceCard} weight="normal" />
              </Row>

              <Spacer h={6} />
              <T size={13} weight="semibold" color={AmberGoldDark}>
                {`📌 ${currentTale.title}`}
              </T>

              <Spacer h={6} />
              <T size={12} color={TextLight} lineHeight={17}>
                {`"${currentTale.narrative}"`}
              </T>

              {currentTale.questClueId != null ? (
                <>
                  <Spacer h={8} />
                  <Surface radius={6} color={color(0xff1e3a24)} borderColor={HealthGreen} borderWidth={1}>
                    <Row gap={6} style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
                      <T size={14} hidden>
                        📜
                      </T>
                      <T size={11} weight="semibold" color={HealthGreen} style={{ flex: 1 }}>
                        {clueText}
                      </T>
                    </Row>
                  </Surface>
                </>
              ) : null}
            </Column>
          </Surface>
        ) : (
          <Surface radius={8} color={DarkSurface}>
            <T size={12} color={TextMuted} style={{ padding: 12 }}>
              Henüz hiçbir masaya kulak kabartmadın. Masalardan birine yanaşmak için yukarıdaki butona dokun.
            </T>
          </Surface>
        )}
      </Column>
    </Card>
  );
}

function TavernMealsCard({ playerGold, dayState, onOrderSoup, onOrderRabbit, onRestAtInn }) {
  return (
    <Card color={DarkSurface} radius={10} borderColor={DarkBorder}>
      <Column pad={14}>
        <Row justify="between" style={{ alignSelf: 'stretch' }} gap={6}>
          <T style={Typography.titleMedium} weight="bold" color={TextGold} heading>
            🍲 Hancı Kazanı & Geceleme
          </T>
          <T size={11} color={AmberGold}>
            {`Öğün: ${dayState.dailyMealsEaten}/${dayState.maxMealsPerDay}`}
          </T>
        </Row>
        <Spacer h={4} />
        <T size={12} color={TextMuted}>
          Kumların üzerinde dökülen kanı ve yorgunluğu sıcak bir tasla sağalt veya han odasında sabahla:
        </T>

        <Spacer h={10} />

        <Row gap={10} style={{ alignSelf: 'stretch' }} align="stretch">
          {/* Soup */}
          <Btn
            onPress={onOrderSoup}
            disabled={!dayState.canEatMealToday}
            color={DarkSurfaceCard}
            contentColor={TextLight}
            disabledColor={DarkSurfaceCard}
            radius={8}
            style={{ flex: 1, borderWidth: 1, borderColor: HealthGreen }}
          >
            <Column align="center" style={{ paddingVertical: 4 }}>
              <T weight="bold" size={12} color={HealthGreen} align="center">
                🥣 İsli Arpa Çorbası
              </T>
              <T size={11} color={AmberGold} align="center">
                +15 Can • 5 Altın
              </T>
            </Column>
          </Btn>

          {/* Rabbit Stew */}
          <Btn
            onPress={onOrderRabbit}
            disabled={!dayState.canEatMealToday}
            color={DarkSurfaceCard}
            contentColor={TextLight}
            disabledColor={DarkSurfaceCard}
            radius={8}
            style={{ flex: 1, borderWidth: 1, borderColor: AmberGold }}
          >
            <Column align="center" style={{ paddingVertical: 4 }}>
              <T weight="bold" size={12} color={AmberGold} align="center">
                🍗 Dağ Tavşanı & Şarap
              </T>
              <T size={11} color={AmberGold} align="center">
                +35 Can • 12 Altın
              </T>
            </Column>
          </Btn>
        </Row>

        <Spacer h={10} />

        <Btn
          onPress={onRestAtInn}
          disabled={!(playerGold >= 5 && dayState.isDailyArenaObligationMet)}
          color={dayState.isDailyArenaObligationMet ? alpha(HealthGreen, 0.85) : AmberGoldDark}
          contentColor={Color.White}
          radius={8}
          style={{ alignSelf: 'stretch' }}
          textSize={11}
        >
          {dayState.isDailyArenaObligationMet ? '🛏️ Han Odasında Sabahla (5 Altın & Yeni Gün)' : '🛏️ Han Odasında Sabahla (Arena Katılımı Gerekli)'}
        </Btn>
      </Column>
    </Card>
  );
}

function TavernDiceGameCard({ playerGold, dayState, selectedBet, lastResult, onSelectBet, onRollDice }) {
  const sonucBaslik = lastResult != null ? (lastResult.playerWon ? '🏆 KAZANDIN!' : lastResult.isTie ? '🤝 BERABERE!' : '💀 KAYBETTİN...') : null;
  useAnnounceOnChange(lastResult, lastResult != null ? `${sonucBaslik} ${lastResult.narrativeOutcome}` : null);
  return (
    <Card color={DarkSurface} radius={10} borderColor={DarkBorder}>
      <Column pad={14}>
        <Row justify="between" style={{ alignSelf: 'stretch' }} gap={6}>
          <T style={Typography.titleMedium} weight="bold" color={TextGold} heading>
            🎲 Çukur Zarı (Gladyatör Kumarı)
          </T>
          <T size={11} weight="semibold" color={AmberGold}>
            {`Zar: ${dayState.dailyDiceGamesPlayed}/${dayState.maxDiceGamesPerDay} El`}
          </T>
        </Row>
        <Spacer h={4} />
        <T size={12} color={TextMuted}>
          Hanın kuytusundaki kervancılarla 2'şer zar at. Yüksek atan bahsi toplar!
        </T>

        <Spacer h={10} />

        {/* Bet options */}
        <Row gap={8} wrap style={{ alignSelf: 'stretch' }}>
          {[5, 10, 25].map((bet) => (
            <Chip key={bet} selected={selectedBet === bet} onPress={() => onSelectBet(bet)}>
              {`${bet} Altın`}
            </Chip>
          ))}
          <Spacer flex />
          <Btn
            onPress={onRollDice}
            disabled={!(dayState.canPlayDiceToday && playerGold >= selectedBet)}
            color={AmberGold}
            contentColor={DarkBg}
            disabledColor={DarkSurfaceCard}
            disabledContentColor={TextMuted}
            radius={8}
            textSize={11}
            label={dayState.canPlayDiceToday ? `Zar at, ${selectedBet} altın` : 'Masa Kapandı'}
          >
            {dayState.canPlayDiceToday ? `🎲 ZAR AT (${selectedBet} 🪙)` : 'Masa Kapandı'}
          </Btn>
        </Row>

        {/* Outcome box */}
        {lastResult != null ? (
          <>
            <Spacer h={10} />
            <Surface
              radius={6}
              color={lastResult.playerWon ? color(0xff1e3a24) : lastResult.isTie ? color(0xff332a18) : color(0xff3a1e1e)}
              borderColor={lastResult.playerWon ? HealthGreen : lastResult.isTie ? AmberGold : HealthRed}
              borderWidth={1}
              label={`${sonucBaslik} ${lastResult.narrativeOutcome}`}
            >
              <Column pad={10}>
                <T weight="bold" size={12} color={lastResult.playerWon ? HealthGreen : lastResult.isTie ? AmberGold : HealthRed}>
                  {sonucBaslik}
                </T>
                <Spacer h={2} />
                <T size={12} color={TextLight} lineHeight={16}>
                  {lastResult.narrativeOutcome}
                </T>
              </Column>
            </Surface>
          </>
        ) : null}
      </Column>
    </Card>
  );
}

function TavernBardCard({ currentSong, playerGold, onTipBard }) {
  const isEpicSong = currentSong != null ? kt.count(kt.lines(currentSong), (it) => kt.isNotBlank(it)) >= 6 : false;
  const sarkiBaslik = isEpicSong ? "👑 Destansı 8'lik Kahramanlık Şarkısı" : '🪕 Ozanın Dörtlüğü';
  useAnnounceOnChange(currentSong, currentSong != null ? `${sarkiBaslik}. ${currentSong}` : null);
  return (
    <Card color={DarkSurfaceCard} radius={10} borderColor={DarkBorder}>
      <Column pad={14}>
        <Row justify="between" style={{ alignSelf: 'stretch' }}>
          <Column style={{ flex: 1 }}>
            <T weight="bold" color={TextGold} size={14} heading>
              🪕 Kör Ozan Miras'ın Köşesi
            </T>
            <T size={11} color={TextMuted}>
              Kırık sazıyla diyarın unutulmuş destanlarını fısıldar.
            </T>
          </Column>
        </Row>

        <Spacer h={10} />

        <Row gap={8} style={{ alignSelf: 'stretch' }} align="stretch">
          <Btn onPress={() => onTipBard(false)} disabled={!(playerGold >= 1)} color={FamePurple} contentColor={Color.White} radius={8} pad={8} textSize={11} style={{ flex: 1 }}>
            🪙 1 Altın: Dörtlük
          </Btn>
          <Btn onPress={() => onTipBard(true)} disabled={!(playerGold >= 5)} color={AmberGold} contentColor={Color.Black} radius={8} pad={8} textSize={11} style={{ flex: 1 }}>
            👑 5 Altın: 8'lik Destan
          </Btn>
        </Row>

        {currentSong != null ? (
          <>
            <Spacer h={12} />
            <Surface radius={8} color={DarkSurface} borderColor={isEpicSong ? alpha(AmberGold, 0.5) : DarkBorder} borderWidth={1} label={`${sarkiBaslik}. ${currentSong}`}>
              <Column pad={12}>
                <Row gap={6}>
                  <T size={11} weight="bold" color={isEpicSong ? AmberGold : FamePurple}>
                    {sarkiBaslik}
                  </T>
                </Row>
                <Spacer h={6} />
                <T size={12} color={TextGold} lineHeight={20}>
                  {currentSong}
                </T>
              </Column>
            </Surface>
          </>
        ) : null}
      </Column>
    </Card>
  );
}

function TavernInformantCard({ weaknesses, knownWeaknessIds, playerGold, lastWhisper, onBuyRandomIntel, onDismissWhisper }) {
  const known = knownWeaknessIds || [];
  const canAffordBribe = playerGold >= 30;
  const allKnown = known.length >= weaknesses.length;
  useAnnounceOnChange(lastWhisper, lastWhisper);

  return (
    <Card color={DarkSurface} radius={12} borderColor={DarkBorder}>
      <Column pad={14}>
        <Row justify="between" style={{ alignSelf: 'stretch' }} gap={6}>
          <Row gap={8} style={{ flexShrink: 1 }}>
            <T size={20} hidden>
              🕵️
            </T>
            <Column style={{ flexShrink: 1 }}>
              <T style={Typography.titleMedium} weight="bold" color={TextGold} heading>
                Gölgeli Muhbir
              </T>
              <T size={11} color={TextMuted}>
                Kuytudaki Fısıltılar & Zaafiyet Tüccarı
              </T>
            </Column>
          </Row>

          <Badge
            text={`${known.length}/${weaknesses.length} Sır Çözüldü`}
            textColor={known.length > 0 ? HealthGreen : AmberGold}
            bg={known.length > 0 ? color(0xff1e3a24) : DarkSurfaceCard}
            borderColor={known.length > 0 ? alpha(HealthGreen, 0.5) : DarkBorder}
            padH={8}
            padV={4}
            radius={6}
            label={`${known.length} / ${weaknesses.length} sır çözüldü`}
          />
        </Row>

        <Spacer h={10} />

        <Surface radius={8} color={DarkBg}>
          <T size={12} color={alpha(TextLight, 0.9)} italic lineHeight={16} style={{ padding: 10 }}>
            "Bu kasabadaki arenada kan döken her dövüşçünün kalkanında bir gedik vardır... Bana biraz altın bayıl, birinin sırrını kulağına fısıldayayım."
          </T>
        </Surface>

        <Spacer h={10} />

        <Btn
          onPress={onBuyRandomIntel}
          disabled={!(canAffordBribe && !allKnown)}
          color={AmberGold}
          contentColor={DarkBg}
          disabledColor={DarkSurfaceCard}
          disabledContentColor={TextMuted}
          radius={8}
          style={{ alignSelf: 'stretch' }}
          textSize={12}
          label={
            allKnown
              ? 'Tüm gladyatörlerin açığı zaten öğrenildi.'
              : `Muhbire 30 altın rüşvet vererek rastgele bir gladyatörün açığını öğren. Mevcut altın: ${playerGold}.`
          }
        >
          {allKnown ? '✨ Tüm Gladyatör Açıkları Çözüldü' : !canAffordBribe ? '🕵️ Rüşvet Ver (30 🪙 - Yetersiz Altın)' : '🕵️ Muhbire Rüşvet Ver (30 🪙 - Sır Satın Al)'}
        </Btn>

        {lastWhisper != null ? (
          <>
            <Spacer h={10} />
            <Surface radius={8} color={color(0xff1e3a24)} borderColor={HealthGreen} borderWidth={1}>
              <Column pad={10}>
                <Row justify="between" style={{ alignSelf: 'stretch' }}>
                  <T size={11} weight="bold" color={HealthGreen}>
                    🤫 Muhbirin Fısıltısı
                  </T>
                  <TextBtn onPress={onDismissWhisper} contentColor={TextMuted} textSize={10} pad={2} label="Fısıltıyı kapat">
                    Kapat ✕
                  </TextBtn>
                </Row>
                <Spacer h={4} />
                <T size={11} color={TextLight} lineHeight={15}>
                  {lastWhisper}
                </T>
              </Column>
            </Surface>
          </>
        ) : null}

        <Spacer h={8} />

        <Row gap={6} style={{ alignSelf: 'stretch' }}>
          <T size={12} hidden>
            📚
          </T>
          <T size={11} color={TextMuted} lineHeight={15} style={{ flex: 1 }}>
            Keşfedilen tüm dövüşçü dosyaları, geçmiş hikayeleri ve zaafiyetler evindeki Gladyatör Kütüğü'ne kaydedilir.
          </T>
        </Row>
      </Column>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Dükkan inceleme pencereleri
// ---------------------------------------------------------------------------
/**
 * Dükkandaki Teçhizat İnceleme ve Kuşanılan ile Karşılaştırma Üst Penceresi (Modal).
 * TalkBack odaklıdır ve oyuncunun mevcut teçhizatından daha mı güçlü/zayıf olduğunu analiz eder.
 */
function ShopEquipmentDetailDialog({ item, player, onDismiss, onBuy }) {
  const rarityColor = color(item.rarity.colorHex);
  const canAfford = player.gold >= item.valueInGold;
  const canEquip = player.level >= item.requiredLevel;
  const equippedItem = (player.equipped && player.equipped[item.slot]) ?? null;

  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      title={
        <Column>
          <Row gap={6} wrap>
            <T size={20} hidden>
              {item.categoryIcon}
            </T>
            <T size={18} weight="bold" color={rarityColor} heading style={{ flexShrink: 1 }}>
              {item.name}
            </T>
          </Row>
          <Spacer h={4} />
          <T size={12} color={TextMuted}>
            {`${item.categoryDisplayName} • ${item.rarity.displayName} • Gereken: Sv. ${item.requiredLevel}`}
          </T>
        </Column>
      }
      text={
        <Column gap={10} style={{ alignSelf: 'stretch' }}>
          {/* Eşya Hikayesi / Açıklaması */}
          <T size={13} color={alpha(TextLight, 0.9)} lineHeight={17}>
            {item.description}
          </T>

          <Divider color={DarkBorder} />

          {/* Eşyanın Nitelikleri */}
          <T size={12} weight="bold" color={TextGold}>
            Teçhizat Nitelikleri:
          </T>
          <T size={13} weight="semibold" color={AmberGold}>
            {item.stats.toStatSummary()}
          </T>

          {item.specialTrait != null ? (
            <Surface radius={6} color={color(0xff2b1b36)} borderColor={FamePurple} borderWidth={1}>
              <Column pad={8}>
                <T size={12} weight="bold" color={FamePurple}>
                  {`${item.specialTrait.icon} 2. Özel Nitelik: ${item.specialTrait.name}`}
                </T>
                <Spacer h={2} />
                <T size={11} color={alpha(TextLight, 0.95)}>
                  {item.specialTrait.description}
                </T>
              </Column>
            </Surface>
          ) : null}

          <Divider color={DarkBorder} />

          {/* Kuşanılan Eşya ile Karşılaştırma */}
          <T size={12} weight="bold" color={TextGold}>
            {`⚖️ Kuşanılan ile Karşılaştırma (${item.slot.displayName}):`}
          </T>

          {equippedItem == null ? (
            <Surface radius={6} color={alpha(HealthGreen, 0.15)} borderColor={alpha(HealthGreen, 0.4)} borderWidth={1}>
              <Column pad={8}>
                <T weight="bold" size={12} color={HealthGreen}>
                  Mevcut Yuva: Boş (Kuşanılan Eşya Yok)
                </T>
                <Spacer h={2} />
                <T size={11} color={TextLight} lineHeight={15}>
                  Bu yuvada kuşanılmış bir eşya yok. Satın alıp kuşandığınızda tüm nitelikler doğrudan karakterinize güç katacaktır!
                </T>
              </Column>
            </Surface>
          ) : (
            <Card color={DarkSurfaceCard} radius={6}>
              <Column pad={8}>
                <T weight="bold" size={12} color={color(equippedItem.rarity.colorHex)}>
                  {`Şu Anda Kuşandığınız: ${equippedItem.name}`}
                </T>
                <T size={11} color={TextMuted}>
                  {equippedItem.stats.toStatSummary()}
                </T>
                <Spacer h={6} />
                <T weight="semibold" size={11} color={TextGold}>
                  Güç & Nitelik Farkı:
                </T>

                {/* Stat diffs */}
                {compareEquipmentStats(item, equippedItem).map((diff, i) => {
                  const isPositive = diff.startsWith('▲');
                  const isSame = diff.startsWith('•');
                  return (
                    <T key={i} size={11} weight="semibold" color={isPositive ? HealthGreen : isSame ? TextMuted : HealthRed}>
                      {diff}
                    </T>
                  );
                })}
              </Column>
            </Card>
          )}

          {/* Seviye uyarısı */}
          {!canEquip ? (
            <T size={12} color={HealthRed} weight="semibold">
              {`⚠️ Seviyeniz: ${player.level}. Bu eşyayı kuşanabilmek için Seviye ${item.requiredLevel} olmalısınız!`}
            </T>
          ) : null}

          {/* Fiyat & Cüzdan */}
          <Row justify="between" style={{ alignSelf: 'stretch' }}>
            <T size={12} weight="bold" color={AmberGold}>
              {`Fiyat: 🪙 ${item.valueInGold} Altın`}
            </T>
            <T size={12} color={canAfford ? TextLight : HealthRed}>
              {`Cüzdan: 🪙 ${player.gold}`}
            </T>
          </Row>
        </Column>
      }
      confirm={
        <Btn onPress={onBuy} disabled={!canAfford} color={AmberGold} contentColor={DarkBg} disabledColor={DarkSurfaceCard} disabledContentColor={TextMuted}>
          {canAfford ? `Satın Al (${item.valueInGold} 🪙)` : 'Yetersiz Altın'}
        </Btn>
      }
      dismiss={
        <TextBtn onPress={onDismiss} contentColor={TextLight}>
          Kapat
        </TextBtn>
      }
    />
  );
}

/**
 * İki eşya arasındaki nitelik farkını hesaplar ve edebi güç göstergesi üretir.
 */
function compareEquipmentStats(newItem, currentItem) {
  const diffs = [];
  const dDmg = newItem.stats.damage - currentItem.stats.damage;
  const dArmor = newItem.stats.armor - currentItem.stats.armor;
  const dHp = newItem.stats.maxHealth - currentItem.stats.maxHealth;
  const dSpd = newItem.stats.speed - currentItem.stats.speed;
  const dCrit = newItem.stats.critChancePercent - currentItem.stats.critChancePercent;
  const dDodge = newItem.stats.dodgeChancePercent - currentItem.stats.dodgeChancePercent;
  const dBlock = newItem.stats.blockChancePercent - currentItem.stats.blockChancePercent;

  if (dDmg !== 0) diffs.push(dDmg > 0 ? `▲ Hasar: +${dDmg} daha güçlü` : `▼ Hasar: ${dDmg} daha zayıf`);
  if (dArmor !== 0) diffs.push(dArmor > 0 ? `▲ Zırh: +${dArmor} daha dayanıklı` : `▼ Zırh: ${dArmor} daha zayıf`);
  if (dHp !== 0) diffs.push(dHp > 0 ? `▲ Can: +${dHp} daha fazla` : `▼ Can: ${dHp} daha az`);
  if (dSpd !== 0) diffs.push(dSpd > 0 ? `▲ Hız: +${dSpd} daha hızlı` : `▼ Hız: ${dSpd} daha yavaş`);
  if (dCrit !== 0) diffs.push(dCrit > 0 ? `▲ Kritik: +%${dCrit} daha yüksek` : `▼ Kritik: %${dCrit} daha düşük`);
  if (dDodge !== 0) diffs.push(dDodge > 0 ? `▲ Sıyrılma: +%${dDodge} daha çevik` : `▼ Sıyrılma: %${dDodge} daha hantal`);
  if (dBlock !== 0) diffs.push(dBlock > 0 ? `▲ Blok: +%${dBlock} daha yüksek` : `▼ Blok: %${dBlock} daha düşük`);

  if (diffs.length === 0) {
    diffs.push('• Mevcut eşyanızla nitelikleri birebir aynı.');
  }
  return diffs;
}

/**
 * Simyacı İksir ve Şifa Malzemesi İnceleme Üst Penceresi (Modal).
 */
function ShopConsumableDetailDialog({ item, player, onDismiss, onBuy }) {
  const isLevelMet = player.level >= item.requiredLevel;
  const canAfford = player.gold >= item.valueInGold && isLevelMet;
  const buttonText = !isLevelMet ? `Seviye Yetersiz (${item.requiredLevel})` : player.gold < item.valueInGold ? 'Yetersiz Altın' : `Satın Al (${item.valueInGold} 🪙)`;

  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      title={
        <Row wrap>
          <T size={20} hidden>
            {`${item.categoryIcon} `}
          </T>
          <T size={17} weight="bold" color={HealthGreen} heading style={{ flexShrink: 1 }}>
            {item.name}
          </T>
        </Row>
      }
      text={
        <Column gap={10} style={{ alignSelf: 'stretch' }}>
          <T size={12} color={TextMuted}>
            {`${item.categoryDisplayName} • Şifa & Takviye`}
          </T>
          <T size={13} color={alpha(TextLight, 0.9)} lineHeight={17}>
            {item.description}
          </T>

          {item.requiredLevel > 1 ? (
            <Row justify="between" style={{ alignSelf: 'stretch' }}>
              <T size={12} color={TextMuted}>
                Gereken Seviye:
              </T>
              <T size={12} weight="bold" color={isLevelMet ? HealthGreen : color(0xffff6b6b)}>
                {`Seviye ${item.requiredLevel}`}
              </T>
            </Row>
          ) : null}

          {item.healAmount > 0 ? (
            <View style={{ alignSelf: 'flex-start' }}>
              <Badge text={`❤️ +${item.healAmount} Can Sağaltır`} textColor={HealthGreen} bg={alpha(HealthGreen, 0.2)} borderColor={HealthGreen} size={13} padH={8} padV={6} />
            </View>
          ) : null}

          {item.buffEffect != null ? (
            <Surface radius={6} color={alpha(AmberGold, 0.15)} borderColor={AmberGold} borderWidth={1}>
              <Column pad={8}>
                <T size={12} weight="bold" color={AmberGold}>
                  {`${item.buffEffect.icon} ${item.buffEffect.name} (Süre: ${item.buffEffect.remainingBattles} Dövüş)`}
                </T>
                <Spacer h={2} />
                <T size={11} color={alpha(TextLight, 0.9)}>
                  {item.buffEffect.description}
                </T>
              </Column>
            </Surface>
          ) : null}

          <Divider color={DarkBorder} />

          {/* Mevcut Can Durumu */}
          <Row justify="between" style={{ alignSelf: 'stretch' }}>
            <T size={12} color={TextMuted}>
              Şu Anki Canınız:
            </T>
            <T size={12} weight="bold" color={player.currentHealth < player.totalStats.maxHealth ? AmberGold : HealthGreen}>
              {`${player.currentHealth} / ${player.totalStats.maxHealth} HP`}
            </T>
          </Row>

          {/* Fiyat & Cüzdan */}
          <Row justify="between" style={{ alignSelf: 'stretch' }}>
            <T size={12} weight="bold" color={AmberGold}>
              {`Fiyat: 🪙 ${item.valueInGold} Altın`}
            </T>
            <T size={12} color={player.gold >= item.valueInGold ? TextLight : HealthRed}>
              {`Cüzdan: 🪙 ${player.gold}`}
            </T>
          </Row>
        </Column>
      }
      confirm={
        <Btn onPress={onBuy} disabled={!canAfford} color={HealthGreen} contentColor={Color.White} disabledColor={DarkSurfaceCard} disabledContentColor={TextMuted}>
          {buttonText}
        </Btn>
      }
      dismiss={
        <TextBtn onPress={onDismiss} contentColor={TextLight}>
          Kapat
        </TextBtn>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Diyar haritası
// ---------------------------------------------------------------------------
export class MapNodeInfo extends kt.Data {
  static T = 'MapNodeInfo';
  static defaults() {
    return {
      id: undefined,
      icon: undefined,
      name: undefined,
      subtitle: undefined,
      description: undefined,
      isUnlocked: undefined,
      isCurrentLocation: undefined,
      lockReason: null,
    };
  }
}
kt.Data.register(MapNodeInfo);

function nodeDurumRenkleri(node) {
  return {
    rozetZemin: node.isCurrentLocation ? alpha(HealthGreen, 0.2) : node.isUnlocked ? alpha(AmberGold, 0.2) : alpha(HealthRed, 0.2),
    rozetMetin: node.isCurrentLocation ? 'MEVCUT' : node.isUnlocked ? 'AÇIK' : '🔒 KİLİTLİ',
    rozetRenk: node.isCurrentLocation ? HealthGreen : node.isUnlocked ? TextGold : HealthRed,
  };
}

export function WorldMapSection({ viewModel, onReturnToMarket, onEnterHarvestRegion, style }) {
  const canTravel = viewModel.canTravelToRegion2;
  const player = useFlow(viewModel.player);
  const isCurrentlyInTashisar = player.currentRegionId === 'tashisar';
  const [selectedNodeForDetail, setSelectedNodeForDetail] = useState(null);

  const nodes = [
    new MapNodeInfo({
      id: 'kirlangic',
      icon: '🌾',
      name: 'Kırlangıç Kasabası',
      subtitle: 'Bataklık & Çukur Arenası (Bölge 1)',
      description:
        "Sürgün edilip bir köle arabasında getirildiğin, nemli taş zindanında zincirlendiğin ve kumlarında adını duyurduğun sınır kasabası. Zaven'in demirci ocağı, Elora'nın şifa dükkanı ve İsli Kandil Hanı buradadır.",
      isUnlocked: true,
      isCurrentLocation: !isCurrentlyInTashisar,
    }),
    new MapNodeInfo({
      id: 'tashisar',
      icon: '🏰',
      name: 'Taş Hisar Garnizonu',
      subtitle: 'Fırtınalı Kıyı Surları & Lejyoner Arenası (Bölge 2)',
      description:
        'Sarp kayalıklara kurulu, durmaksızın hırçın fırtına ve yağmurun dövdüğü devasa askeri hisar. Deniz boyunca uzanan sağlam bağlantıları olan bu hisarda pek çok dükkan, kıdemli lejyonerler ve lordların turnuvaları yer alır.',
      isUnlocked: canTravel,
      isCurrentLocation: isCurrentlyInTashisar,
      lockReason: "Giriş Şartı: Çukur şampiyonu Morvath'ı yen veya 85 Şöhret puanına ulaşarak Başkent Kumandanlığı Geçiş Fermanı'nı kazan.",
    }),
    new MapNodeInfo({
      id: 'harvest',
      icon: '⛏️',
      name: 'Diyar Kaynak Sahaları',
      subtitle: 'Maden Ocakları, Şifa Çayırları & Kadim Koruluk',
      description:
        'Kadim toprakların zengin maden damarları, şifalı yabani ot vadileri, keten tarlaları ve meşe korulukları. Burada toplanan her kaynak evindeki sandıklara akar.',
      isUnlocked: canTravel,
      isCurrentLocation: false,
      lockReason: 'Giriş Şartı: 2. Bölüm Taş Hisar Garnizonu fermanı açılmadan kaynak sahalarına erişilemez.',
    }),
  ];

  const kirlangicFame = player.getFameForRegion('kirlangic');
  const kirlangicTitle = player.getTitleForRegion('kirlangic');
  const tashisarFame = player.getFameForRegion('tashisar');
  const tashisarTitle = player.getTitleForRegion('tashisar');

  return (
    <View style={[{ flex: 1 }, style]}>
      <Scroll gap={14} contentStyle={{ paddingHorizontal: 16, paddingVertical: 6 }}>
        {/* GENEL HARİTA BAKIŞI */}
        <Card color={DarkSurface} radius={12} borderColor={AmberGoldDark} borderWidth={1.5}>
          <Column pad={16}>
            <T style={Typography.titleMedium} weight="black" color={AmberGold} letterSpacing={1} heading>
              🗺️ DİYAR HARİTASI & KADİM YOLLAR
            </T>
            <Spacer h={4} />
            <T size={12} color={TextLight} lineHeight={17}>
              Diyarın sarp kayalıklarından verimli hasat vadilerine uzanan antik yollar. Yuvarlak bölge düğümlerine dokunarak detayları inceleyebilir, ferman durumunu görebilir ve yolculuk yapabilirsin.
            </T>
          </Column>
        </Card>

        {/* DİNAMİK BÖLGESEL ŞÖHRET KARTI */}
        <Card color={color(0xff1e170e)} radius={12} borderColor={AmberGold} borderWidth={1.5}>
          <Column pad={14}>
            <Row justify="between" style={{ alignSelf: 'stretch' }} gap={6}>
              <T size={13} weight="black" color={AmberGold} letterSpacing={1} heading>
                👑 DİNAMİK BÖLGESEL ŞÖHRET
              </T>
              <Badge
                text={isCurrentlyInTashisar ? '🏰 MEVCUT: TAŞ HİSAR' : '🌾 MEVCUT: KIRLANGIÇ'}
                textColor={HealthGreen}
                bg={alpha(HealthGreen, 0.2)}
                borderColor={HealthGreen}
                size={9}
              />
            </Row>

            <Spacer h={10} />

            {/* 1. Bölge: Kırlangıç Kasabası Şöhreti (0 - 100) */}
            <Column pad={10} radius={8} color={color(0xff120e08)} style={{ alignSelf: 'stretch' }}>
              <Row justify="between" style={{ alignSelf: 'stretch' }}>
                <T size={12} weight="bold" color={TextLight}>
                  🌾 Kırlangıç Kasabası
                </T>
                <T size={12} weight="black" color={FamePurple}>
                  {`${kirlangicFame} / 100 Şöhret`}
                </T>
              </Row>
              <Spacer h={4} />
              <Progress value={kt.coerceIn(kirlangicFame / 100, 0, 1)} color={AmberGold} track={DarkSurfaceCard} height={6} radius={3} />
              <Spacer h={4} />
              <T size={11} color={TextGold} weight="semibold">
                {`Unvan: ${kirlangicTitle} ${kirlangicFame >= 100 || player.hasGarrisonPass ? '🏆 [TAMAMLANDI]' : ''}`}
              </T>
            </Column>

            <Spacer h={8} />

            {/* 2. Bölge: Taş Hisar Garnizonu Şöhreti (0 - 100, Kırlangıç bitince 10'dan başlar) */}
            <Column pad={10} radius={8} color={color(0xff120e08)} style={{ alignSelf: 'stretch' }}>
              <Row justify="between" style={{ alignSelf: 'stretch' }}>
                <T size={12} weight="bold" color={TextLight}>
                  🏰 Taş Hisar Garnizonu
                </T>
                <T size={12} weight="black" color={canTravel ? FamePurple : TextMuted}>
                  {canTravel ? `${tashisarFame} / 100 Şöhret` : '🔒 Kilitli (0 / 100)'}
                </T>
              </Row>
              <Spacer h={4} />
              <Progress value={kt.coerceIn(tashisarFame / 100, 0, 1)} color={canTravel ? HealthGreen : DarkBorder} track={DarkSurfaceCard} height={6} radius={3} />
              <Spacer h={4} />
              <T size={11} color={canTravel ? TextGold : TextMuted} weight="semibold">
                {canTravel
                  ? `Garnizon Unvanı: ${tashisarTitle} (Kasaba başarıların biliniyor, rüştünü kanıtla!)`
                  : 'Garnizon Unvanı: Bilinmiyor (1. Bölge bitince 10 Şöhretle başlar)'}
              </T>
            </Column>
          </Column>
        </Card>

        {/* Dairesel Top-Top Düğümler ve Yol Bağlantıları */}
        {nodes.map((node, index) => {
          const d = nodeDurumRenkleri(node);
          const topRenkleri = node.isCurrentLocation
            ? [color(0xff2e4424), color(0xff142410)]
            : node.isUnlocked
              ? [color(0xff3e2d13), color(0xff1f1608)]
              : [color(0xff2a1c1c), color(0xff140d0d)];
          return (
            <React.Fragment key={node.id}>
              {index > 0 ? (
                <View style={{ alignSelf: 'stretch', paddingLeft: 38, marginVertical: -7 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                  <Gradient colors={[AmberGoldDark, alpha(AmberGold, 0.4)]} style={{ width: 4, height: 28, borderRadius: 2 }} />
                </View>
              ) : null}

              <Row
                gap={14}
                onPress={() => setSelectedNodeForDetail(node)}
                label={`${node.name}. ${node.subtitle}. ${node.isUnlocked ? 'Açık bölge.' : `Kilitli bölge. ${node.lockReason}`} Detayları görmek ve yolculuk yapmak için dokunun.`}
                style={{ alignSelf: 'stretch', paddingVertical: 2 }}
              >
                {/* Dairesel Düğüm (Top) */}
                <View
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: 39,
                    overflow: 'hidden',
                    borderWidth: node.isCurrentLocation ? 2.5 : 1.5,
                    borderColor: node.isCurrentLocation ? HealthGreen : node.isUnlocked ? AmberGold : alpha(HealthRed, 0.6),
                  }}
                >
                  <Gradient colors={topRenkleri} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <T size={26}>{node.isUnlocked ? node.icon : '🔒'}</T>
                    {node.isCurrentLocation ? (
                      <Surface radius={3} color={HealthGreen} style={{ marginTop: 2, paddingHorizontal: 4, paddingVertical: 1 }}>
                        <T size={7} weight="black" color={Color.Black}>
                          BURADASIN
                        </T>
                      </Surface>
                    ) : !node.isUnlocked ? (
                      <Surface radius={3} color={HealthRed} style={{ marginTop: 2, paddingHorizontal: 4, paddingVertical: 1 }}>
                        <T size={7} weight="black" color={Color.White}>
                          KİLİTLİ
                        </T>
                      </Surface>
                    ) : null}
                  </Gradient>
                </View>

                {/* Yan Kart */}
                <Card
                  style={{ flex: 1 }}
                  color={node.isUnlocked ? DarkSurfaceCard : DarkSurface}
                  radius={10}
                  borderColor={node.isCurrentLocation ? alpha(HealthGreen, 0.7) : node.isUnlocked ? alpha(AmberGoldDark, 0.6) : DarkBorder}
                >
                  <Column pad={12}>
                    <Row justify="between" style={{ alignSelf: 'stretch' }} gap={4}>
                      <T weight="bold" size={15} color={node.isUnlocked ? TextGold : TextMuted} style={{ flexShrink: 1 }}>
                        {node.name}
                      </T>
                      <Badge text={d.rozetMetin} textColor={d.rozetRenk} bg={d.rozetZemin} size={9} padH={5} />
                    </Row>
                    <Spacer h={2} />
                    <T size={11} color={TextMuted} weight="medium">
                      {node.subtitle}
                    </T>
                    <Spacer h={6} />
                    <T size={11} color={node.isUnlocked ? AmberGold : TextMuted} weight="semibold">
                      İncelemek & Yolculuk için dokun →
                    </T>
                  </Column>
                </Card>
              </Row>
            </React.Fragment>
          );
        })}

        <Spacer h={70} />
      </Scroll>

      {/* Topa Tıklandığında Açılan Bölge Detay & Yolculuk Penceresi */}
      {selectedNodeForDetail != null ? (
        <RegionNodeDetailDialog
          node={selectedNodeForDetail}
          viewModel={viewModel}
          onReturnToMarket={onReturnToMarket}
          onEnterHarvestRegion={onEnterHarvestRegion}
          onDismiss={() => setSelectedNodeForDetail(null)}
        />
      ) : null}
    </View>
  );
}

export function RegionNodeDetailDialog({ node, viewModel, onReturnToMarket, onEnterHarvestRegion, onDismiss }) {
  const p = useFlow(viewModel.player);
  const d = nodeDurumRenkleri(node);

  let confirm = null;
  if (node.id === 'kirlangic') {
    confirm = (
      <Btn
        onPress={() => {
          onReturnToMarket();
          onDismiss();
        }}
        color={AmberGold}
        contentColor={DarkBg}
        radius={8}
      >
        🏛️ Kasaba Çarşısına Git
      </Btn>
    );
  } else if (node.id === 'tashisar') {
    confirm = (
      <Btn
        onPress={() => {
          viewModel.travelToRegion('tashisar');
          onDismiss();
        }}
        disabled={!node.isUnlocked}
        color={AmberGold}
        contentColor={DarkBg}
        disabledColor={DarkSurfaceCard}
        disabledContentColor={TextMuted}
        radius={8}
      >
        {node.isUnlocked ? '🏰 Yolculuk Yap (Bölge 2)' : '🔒 Yolculuk Kilitli'}
      </Btn>
    );
  } else if (node.id === 'harvest') {
    confirm = (
      <Btn
        onPress={() => {
          onEnterHarvestRegion();
          onDismiss();
        }}
        disabled={!node.isUnlocked}
        color={AmberGold}
        contentColor={DarkBg}
        disabledColor={DarkSurfaceCard}
        disabledContentColor={TextMuted}
        radius={8}
      >
        {node.isUnlocked ? '⛏️ Kaynak Sahalarına Git' : '🔒 Sahalar Kilitli'}
      </Btn>
    );
  }

  const fameVar = node.id === 'kirlangic' || node.id === 'tashisar';
  const fame = fameVar ? p.getFameForRegion(node.id) : 0;
  const title = fameVar ? p.getTitleForRegion(node.id) : '';

  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      confirm={confirm}
      dismiss={
        <TextBtn onPress={onDismiss} contentColor={TextLight}>
          Kapat
        </TextBtn>
      }
      title={
        <Column>
          <Row gap={8} wrap>
            <T color={TextGold} weight="bold" size={18} heading>
              {`${node.icon} ${node.name}`}
            </T>
            <Badge text={d.rozetMetin} textColor={d.rozetRenk} bg={d.rozetZemin} />
          </Row>
          <T color={TextMuted} size={12}>
            {node.subtitle}
          </T>
        </Column>
      }
      text={
        <Column gap={10} style={{ alignSelf: 'stretch' }}>
          <T size={13} color={TextLight} lineHeight={18}>
            {node.description}
          </T>

          {fameVar ? (
            <Surface radius={8} color={color(0xff16120b)} borderColor={AmberGoldDark} borderWidth={1}>
              <Column pad={10}>
                <Row justify="between" style={{ alignSelf: 'stretch' }}>
                  <T size={12} color={TextGold} weight="bold">
                    Bölgesel Şöhret
                  </T>
                  <T size={12} color={FamePurple} weight="bold">
                    {node.isUnlocked ? `${fame} / 100 Şöhret` : '0 / 100 (Kilitli)'}
                  </T>
                </Row>
                <Spacer h={4} />
                <Progress value={node.isUnlocked ? kt.coerceIn(fame / 100, 0, 1) : 0} color={node.isUnlocked ? AmberGold : DarkBorder} track={DarkSurfaceCard} height={5} radius={2} />
                <Spacer h={4} />
                <T size={11} color={TextLight} weight="semibold">
                  {node.isUnlocked ? `Bölge Unvanı: ${title}` : 'Bölge Unvanı: Henüz Açılmadı (10 Şöhretle Başlar)'}
                </T>
              </Column>
            </Surface>
          ) : null}

          {!node.isUnlocked && node.lockReason != null ? (
            <Surface radius={6} color={color(0xff2a1414)} borderColor={alpha(HealthRed, 0.6)} borderWidth={1}>
              <T size={11} color={HealthRed} lineHeight={15} weight="medium" style={{ padding: 8 }}>
                {`⚠️ ${node.lockReason}`}
              </T>
            </Surface>
          ) : null}
        </Column>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Kızıl Kadife Köşkü buluşma penceresi
// ---------------------------------------------------------------------------
export function CompanionDialogueModal({ session, player, viewModel }) {
  const companion = session.companion;
  const kademe = kt.firstOrNull(companion.kademeler, (it) => it.kademeLevel === session.kademeLevel) ?? companion.kademeler[0];
  const roundIndex = session.currentRoundIndex;
  const currentRound = kt.getOrNull(kademe.rounds, roundIndex);
  const secilen = session.isShowingChoiceResponse ? session.selectedChoice : null;
  useAnnounceOnChange(secilen, secilen != null ? `${companion.name}'in Karşılığı: ${secilen.narrativeResponse}` : null);

  let confirm = null;
  if (session.isCulminationReached) {
    confirm = (
      <Btn onPress={() => viewModel.closeCompanionSession()} color={AmberGold} contentColor={DarkBg} radius={8}>
        🌅 Şafak Sökerken Köşkten Ayrıl
      </Btn>
    );
  } else if (session.isKademeCompleted) {
    confirm = (
      <Btn onPress={() => viewModel.closeCompanionSession()} color={FamePurple} contentColor={Color.White} radius={8}>
        🌙 Geceyi Noktala & Köşkten Ayrıl
      </Btn>
    );
  } else if (session.isShowingChoiceResponse) {
    confirm = (
      <Btn
        onPress={() => viewModel.nextCompanionRound()}
        color={roundIndex === 4 && session.kademeLevel === 5 ? color(0xff8c1d40) : FamePurple}
        contentColor={Color.White}
        radius={8}
      >
        {roundIndex < 4
          ? `Sonraki Konuşmaya Geç (${roundIndex + 2} / 5) ➔`
          : session.kademeLevel < 5
            ? `🌙 Geceyi Tamamla & Vedalaş (Kademe ${session.kademeLevel}) ➔`
            : '🔥 Büyük Vuslatı Başlat ➔'}
      </Btn>
    );
  }

  const dismiss =
    !session.isCulminationReached && !session.isKademeCompleted ? (
      <TextBtn onPress={() => viewModel.closeCompanionSession()} contentColor={TextMuted}>
        Odadan Ayrıl
      </TextBtn>
    ) : null;

  const durumMetni =
    session.isCulminationReached || session.isRepeatCulmination
      ? '💖 BAĞ: ZİRVE (5/5)'
      : session.isKademeCompleted
        ? `✅ KADEME ${session.kademeLevel} BİTTİ`
        : `Kademe ${session.kademeLevel}/5 • Tur ${roundIndex + 1}/5`;

  let govde = null;
  if (!session.isCulminationReached && !session.isKademeCompleted && currentRound != null) {
    const choice = session.selectedChoice;
    govde = (
      <>
        <Column>
          <T size={13} weight="bold" color={TextGold} heading>
            {kademe.kademeTitle}
          </T>
          <Spacer h={4} />
          <Surface radius={8} color={color(0xff241420)} borderColor={alpha(FamePurple, 0.5)} borderWidth={1}>
            <T size={12} color={TextLight} lineHeight={17} italic style={{ padding: 10 }}>
              {currentRound.roundPrompt}
            </T>
          </Surface>
        </Column>

        {session.isShowingChoiceResponse && choice != null ? (
          <>
            <Surface radius={8} color={color(0xff2e1c2b)} borderColor={alpha(AmberGold, 0.6)} borderWidth={1}>
              <Column pad={10}>
                <T size={11} weight="bold" color={AmberGold}>
                  {choice.attitudeBadge}
                </T>
                <Spacer h={4} />
                <T size={12} weight="semibold" color={Color.White} lineHeight={16}>
                  {choice.playerSpeechText}
                </T>
              </Column>
            </Surface>

            <Surface radius={8} color={color(0xff1e101a)} borderColor={alpha(color(0xff8c1d40), 0.7)} borderWidth={1} label={`${companion.name}'in Karşılığı: ${choice.narrativeResponse}`}>
              <Column pad={10}>
                <T size={11} weight="bold" color={color(0xffd47a8c)}>
                  {`${companion.name}'in Karşılığı:`}
                </T>
                <Spacer h={4} />
                <T size={12} color={TextLight} lineHeight={18}>
                  {choice.narrativeResponse}
                </T>
              </Column>
            </Surface>
          </>
        ) : (
          <>
            <T size={12} weight="bold" color={AmberGold}>
              {`💬 Nasıl bir karşılık vereceksin? (Tur ${roundIndex + 1} / 5)`}
            </T>
            {currentRound.choices.map((c, choiceIdx) => (
              <Surface
                key={choiceIdx}
                radius={8}
                color={color(0xff2a1626)}
                borderColor={alpha(AmberGold, 0.5)}
                borderWidth={1}
                onPress={() => viewModel.selectCompanionChoice(c)}
                label={`${c.attitudeBadge}. ${c.choiceSummary}`}
                style={{ alignSelf: 'stretch' }}
              >
                <Column pad={10}>
                  <T size={10} weight="bold" color={AmberGold}>
                    {c.attitudeBadge}
                  </T>
                  <Spacer h={3} />
                  <T size={12} weight="semibold" color={Color.White}>
                    {c.choiceSummary}
                  </T>
                </Column>
              </Surface>
            ))}
          </>
        )}
      </>
    );
  } else if (session.isKademeCompleted) {
    govde = (
      <>
        <Column>
          <T size={14} weight="bold" color={AmberGold} heading>
            🌙 Gecenin Sonu & Vedalaşma
          </T>
          <Spacer h={4} />
          <Surface radius={8} color={color(0xff241420)} borderColor={FamePurple} borderWidth={1}>
            <T size={12} color={TextLight} lineHeight={17} style={{ padding: 10 }}>
              {kademe.conclusionFarewell}
            </T>
          </Surface>
        </Column>

        <Surface radius={8} color={color(0xff1e2818)} borderColor={alpha(HealthGreen, 0.8)} borderWidth={1}>
          <Column pad={10}>
            <T size={12} weight="bold" color={HealthGreen}>
              {`✨ Kademe ${session.kademeLevel} Tamamlandı!`}
            </T>
            <Spacer h={2} />
            <T size={11} color={TextLight} lineHeight={15}>
              {`${companion.name} ile arandaki bağ Kademe ${session.kademeLevel}/5 seviyesine yükseldi. %50 Canın tazelendi ve bir sonraki savaş için Moral Bonusu kazandın.`}
            </T>
          </Column>
        </Surface>
      </>
    );
  } else if (session.isCulminationReached) {
    const culm = companion.culmination;
    govde = (
      <>
        <Column>
          <T size={15} weight="bold" color={AmberGold} heading>
            {`🔥 ${culm.title}`}
          </T>
          <Spacer h={4} />
          <T size={12} color={alpha(TextLight, 0.9)} italic lineHeight={17}>
            {culm.prelude}
          </T>
        </Column>

        {culm.passionNarrative.map((paragraph, pIdx) => (
          <Surface key={pIdx} radius={8} color={color(0xff261222)} borderColor={alpha(color(0xff8c1d40), 0.5)} borderWidth={1}>
            <T size={12} color={TextLight} lineHeight={18} style={{ padding: 10 }}>
              {paragraph}
            </T>
          </Surface>
        ))}

        <Surface radius={8} color={color(0xff1e101a)} borderColor={alpha(AmberGold, 0.6)} borderWidth={1}>
          <Column pad={10}>
            <T size={11} weight="bold" color={AmberGold}>
              🌅 Şafak Vakti:
            </T>
            <Spacer h={4} />
            <T size={12} color={TextLight} lineHeight={17}>
              {culm.morningAfterNarrative}
            </T>
          </Column>
        </Surface>

        <Surface radius={8} color={color(0xff2d1e0f)} borderColor={alpha(HealthGreen, 0.8)} borderWidth={1}>
          <Column pad={10}>
            <T size={12} weight="bold" color={HealthGreen}>
              {`✨ ${culm.buffRewardTitle}`}
            </T>
            <Spacer h={3} />
            <T size={11} color={TextLight} lineHeight={15}>
              {culm.buffRewardDescription}
            </T>
            <Spacer h={6} />
            <T size={11} weight="bold" color={AmberGold}>
              🏰 Geleceğin Üs Yemini & Yoldaşlık Sözü:
            </T>
            <Spacer h={2} />
            <T size={11} color={TextLight} lineHeight={15} italic>
              {culm.futureBasePledge}
            </T>
          </Column>
        </Surface>
      </>
    );
  }

  return (
    <AlertDialog
      onDismiss={() => {
        if (session.isCulminationReached || session.isKademeCompleted) {
          viewModel.closeCompanionSession();
        }
      }}
      containerColor={color(0xff180e16)}
      confirm={confirm}
      dismiss={dismiss}
      title={
        <Row gap={10}>
          <T size={32} hidden>
            {companion.avatarIcon}
          </T>
          <Column style={{ flex: 1 }}>
            <T size={17} weight="bold" color={AmberGold} heading>
              {companion.name}
            </T>
            <T size={11} color={alpha(TextLight, 0.8)}>
              {`${companion.title} • ${companion.geographicOrigin}`}
            </T>
          </Column>
          <Badge text={durumMetni} textColor={AmberGold} bg={alpha(FamePurple, 0.3)} borderColor={FamePurple} radius={12} padH={8} padV={4} />
        </Row>
      }
      text={
        <Column gap={12} style={{ alignSelf: 'stretch' }}>
          {govde}
        </Column>
      }
    />
  );
}
