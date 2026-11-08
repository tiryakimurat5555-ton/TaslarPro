// KT/ui/screens/HomeScreen.kt — Savaşçının meskeni: hücre/ev, oda geliştirme, sandık odası, idman, istirahat, gün geçişi.
import React, { useMemo, useState } from 'react';
import {
  AlertDialog,
  Box,
  Btn,
  Card,
  Chip,
  Column,
  Gorsel,
  GorselRozet,
  Grid,
  IconBtn,
  OutlinedBtn,
  Progress,
  Row,
  Scroll,
  Spacer,
  Surface,
  T,
  TextBtn,
  announce,
  useFlow,
} from '../kit.js';
import {
  AmberGold,
  AmberGoldDark,
  AmberGoldLight,
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
import { ChestType, GemType, GemCraftingRules, RoomType, CharacterCategory, FighterPsychology, PersonalityArchetype } from '../../domain/model.js';
import { GladiatorPsychologyCard } from '../components/GladiatorPsychologyView.js';
import * as kt from '../../kt.js';
import { bolgeGorseli, karakterGorseli, mizacGorseli, nitelikGorseli, odaGorseli, sandikGorseli, tasGorseli, tasRengi, yetenekGorseli } from '../gorsel-esleme.js';

// Görseller VoiceOver'dan gizlidir (kit Gorsel/GorselRozet); okunan metinler ve etiketler aynen korunur.
const ExpBlueAcik = '#64B5F6';

/** Hücreden eve geçiş şartının simgesi (şart başlığındaki anahtar sözcüğe göre). */
function sartGorseli(baslik) {
  const s = String(baslik || '').toLocaleLowerCase('tr-TR');
  if (s.includes('şöhret')) return 'defne';
  if (s.includes('tecrübe') || s.includes('seviye')) return 'seviye';
  if (s.includes('tahkim') || s.includes('hücre')) return 'kale';
  if (s.includes('harç') || s.includes('altın') || s.includes('mülk')) return 'sikkeler';
  return 'kontrol-listesi';
}

/** Hammadde sandığındaki malzemenin simgesi. */
function malzemeGorseli(matKey) {
  switch (matKey) {
    case 'mat_iron_ore':
      return 'kazma';
    case 'mat_stone':
      return 'hammadde';
    case 'mat_cloth':
      return 'igne';
    case 'mat_wood':
      return 'balta';
    case 'mat_herb':
      return 'sifali-ot';
    default:
      return 'sandik';
  }
}

/** Başlığın soluna simge koyan satır (başlığın metni ve rolü aynen kalır). */
function SimgeliSatir({ gorsel, renk = AmberGold, boyut = 18, children, style }) {
  return (
    <Row gap={6} style={style}>
      <Gorsel ad={gorsel} boyut={boyut} renk={renk} />
      {children}
    </Row>
  );
}

export function HomeScreen({ viewModel, modifier }) {
  const player = useFlow(viewModel.player);
  const rooms = useFlow(viewModel.rooms);
  const dayState = useFlow(viewModel.dayState);
  const [showCodexDialog, setShowCodexDialog] = useState(false);
  const [showVaultDialog, setShowVaultDialog] = useState(false);

  const allCharacterProfiles = viewModel.getAllCharacterProfilesWithLiveState();
  const unlockedCount = kt.count(allCharacterProfiles, (it) => it.isUnlocked);

  return (
    <Column style={[{ flex: 1, backgroundColor: DarkBg }, modifier]}>
      <Scroll gap={14} contentStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        {/* Dawn Narrative Card */}
        {dayState.lastDawnNarrative != null ? (
          <Card color={alpha(AmberGoldDark, 0.15)} radius={10} borderColor={AmberGold} borderWidth={1} style={{ alignSelf: 'stretch' }}>
            <Column pad={14}>
              <Row justify="between" gap={8} style={{ alignSelf: 'stretch' }}>
                <Gorsel ad="tomar" boyut={24} renk={AmberGold} />
                <T heading size={14} weight="bold" color={TextGold} style={{ flex: 1 }}>
                  {`Şafak Bülteni (${dayState.currentDay}. Gün)`}
                </T>
                <IconBtn label="Bülteni Kapat" onPress={() => viewModel.dismissDawnNarrative()}>
                  <Gorsel ad="kapi" boyut={22} renk={AmberGold} />
                </IconBtn>
              </Row>
              <Spacer h={6} />
              <T size={12} color={TextLight} lineHeight={18} label={`Şafak Bülteni: ${dayState.lastDawnNarrative}`}>
                {dayState.lastDawnNarrative ?? ''}
              </T>
              <Spacer h={10} />
              <Btn
                onPress={() => viewModel.dismissDawnNarrative()}
                color={AmberGoldDark}
                contentColor={TextLight}
                radius={6}
                style={{ alignSelf: 'flex-end' }}
                label="Okudum, bülteni kapat"
                gorsel="kontrol-listesi"
              >
                <T size={11} weight="bold" color={TextLight}>
                  ✓ Okudum / Kapat
                </T>
              </Btn>
            </Column>
          </Card>
        ) : null}

        {/* Estate Header */}
        <Card color={DarkSurface} radius={12} borderColor={AmberGoldDark} borderWidth={1} style={{ alignSelf: 'stretch' }}>
          <Column pad={16}>
            <Column label={`Karargah: ${player.residenceTitle}, Mevcut Altın: ${player.gold}, Gün: ${dayState.currentDay}`} heading>
              <Row justify="between" style={{ alignSelf: 'stretch' }}>
                <T style={Typography.labelSmall} color={TextMuted}>
                  Savaşçının Meskeni
                </T>
                <Surface radius={6} color={DarkBg} borderColor={AmberGold} borderWidth={1}>
                  <Row gap={4} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                    <Gorsel ad={nitelikGorseli('gun')} boyut={14} renk={AmberGold} />
                    <T size={11} weight="bold" color={AmberGold}>
                      {`${dayState.currentDay}. Gün`}
                    </T>
                  </Row>
                </Surface>
              </Row>
              <Spacer h={6} />
              <Row gap={12} style={{ alignSelf: 'stretch' }}>
                <GorselRozet ad={player.isHouseUnlocked ? 'ev' : 'zindan-kapisi'} boyut={48} renk={AmberGold} kenar={AmberGoldDark} />
                <T style={[Typography.titleLarge, { flex: 1 }]} color={TextGold} weight="bold">
                  {player.residenceTitle}
                </T>
              </Row>
            </Column>
            <Spacer h={6} />
            <T style={Typography.bodyMedium} color={alpha(TextLight, 0.85)}>
              {player.isHouseUnlocked
                ? "Güneş alan geniş avlusu, şömineli salonu ve müstakil taş duvarlarıyla Kırlangıç Kasabası'ndaki bağımsız karargahın. Odalarını geliştirerek pasif güç, şifa ve istihbarat sağlayabilirsin."
                : 'Zindanın nemli ve soğuk koridorlarında, demir parmaklıklar ardındaki hücren. Kazandığın altın ve şöhretle bölmelerini tahkim edip nihayetinde müstakil bir eve terfi edebilirsin.'}
            </T>

            <Spacer h={14} />

            <Row justify="between" gap={8} style={{ alignSelf: 'stretch' }}>
              <Row gap={5} style={{ flexShrink: 1 }}>
                <Gorsel ad={nitelikGorseli('altin')} boyut={20} renk={AmberGold} />
                <T weight="bold" color={AmberGold} style={{ flexShrink: 1 }}>
                  {`Kasa: ${player.gold} Altın`}
                </T>
              </Row>
              <Btn
                onPress={() => viewModel.advanceDay(0)}
                color={dayState.isDailyArenaObligationMet ? HealthGreen : AmberGoldDark}
                contentColor={TextLight}
                radius={8}
                style={{ flexShrink: 1 }}
                gorsel="yatak"
                label={dayState.isDailyArenaObligationMet ? 'İstirahat Et ve Yeni Güne Başla' : 'İstirahat Et, Arena Katılımı Gerekli'}
              >
                <T weight="bold" size={11} color={TextLight} align="center">
                  {dayState.isDailyArenaObligationMet ? 'İstirahat Et & Yeni Güne Başla' : 'İstirahat Et (Arena Katılımı Gerekli)'}
                </T>
              </Btn>
            </Row>
          </Column>
        </Card>

        {/* House Transformation & Evolution Card */}
        <HouseTransformationCard player={player} transformationStatus={viewModel.getHouseTransformationStatus()} onTransform={() => viewModel.transformToHouse()} />

        {/* Diyar Şahsiyetleri & Karakter Sicili */}
        <CharacterRegistryCard
          unlockedCount={unlockedCount}
          totalCount={allCharacterProfiles.length}
          isHouse={player.isHouseUnlocked}
          onOpenCodex={() => setShowCodexDialog(true)}
        />

        <SimgeliSatir gorsel={player.isHouseUnlocked ? 'ev' : 'zindan-kapisi'} boyut={22}>
          <T heading style={[Typography.titleMedium, { flexShrink: 1 }]} color={TextLight} weight="bold">
            {player.isHouseUnlocked ? `Ev Bölmeleri & Odalar (${rooms.length} Bölme)` : 'Hücre Bölmeleri & Teçhizat'}
          </T>
        </SimgeliSatir>

        {/* Room Cards */}
        {rooms.map((room) => {
          const [canUpgrade, reqError] = viewModel.checkRoomUpgradeRequirements(room);
          return (
            <RoomCard
              key={room.id}
              room={room}
              canUpgrade={canUpgrade}
              upgradeRequirementNote={reqError}
              canTrainToday={dayState.canTrainToday}
              onUpgrade={() => viewModel.upgradeRoom(room.id)}
              onDailyTraining={() => viewModel.dailyTraining()}
              onOpenVault={() => setShowVaultDialog(true)}
            />
          );
        })}

        <Spacer h={60} />
      </Scroll>

      {showCodexDialog ? <CharacterRegistryDialog profiles={allCharacterProfiles} onDismiss={() => setShowCodexDialog(false)} /> : null}

      {showVaultDialog ? <StorageVaultDialog player={player} viewModel={viewModel} onDismiss={() => setShowVaultDialog(false)} /> : null}
    </Column>
  );
}

function HouseTransformationCard({ player, transformationStatus, onTransform }) {
  if (player.isHouseUnlocked) {
    return (
      <Card
        color={alpha(AmberGoldDark, 0.15)}
        radius={12}
        borderColor={AmberGold}
        borderWidth={1}
        style={{ alignSelf: 'stretch' }}
        label={`Müstakil Karargah: ${player.residenceTitle}. Taş avlu, kütüphane ve biley silahhanesiyle donatılmış bağımsız karargahın. Tüm odalar için üst kademeler açıldı.`}
      >
        <Row pad={14} gap={12}>
          <GorselRozet ad="ev" boyut={48} renk={AmberGold} kenar={AmberGold} />
          <Column style={{ flex: 1 }}>
            <T weight="bold" size={14} color={TextGold}>
              {`Müstakil Mülk: ${player.residenceTitle}`}
            </T>
            <Spacer h={2} />
            <T size={11} color={alpha(TextLight, 0.9)} lineHeight={16}>
              Taş avlu, kütüphane ve biley silahhanesiyle donatılmış bağımsız karargahın. Tüm odalar için üst kademeler açıldı.
            </T>
          </Column>
        </Row>
      </Card>
    );
  }
  const metCount = kt.count(transformationStatus.requirements, (it) => it.isMet);
  return (
    <Card color={DarkSurfaceCard} radius={12} borderColor={transformationStatus.canTransform ? AmberGold : DarkBorder} borderWidth={1} style={{ alignSelf: 'stretch' }}>
      <Column pad={14}>
        <Row gap={8} label="Kendi Evine Geçiş ve Mülk Dönüşümü Şartları" heading>
          <GorselRozet ad="ev" boyut={40} renk={AmberGold} />
          <T weight="bold" size={15} color={TextGold} style={{ flexShrink: 1 }}>
            Kendi Evine Geçiş & Mülk Dönüşümü
          </T>
        </Row>
        <Spacer h={4} />
        <T size={12} color={alpha(TextLight, 0.85)} lineHeight={17}>
          Rutubetli gladyatör hücresini geride bırak! Kırlangıç Kasabası'nda avlulu bir taş ev edinerek yeni odaların (Kütüphane, Silahhane, Şifalı Otluk) kilidini aç.
        </T>

        <Spacer h={10} />

        {/* Şartlar Listesi */}
        {transformationStatus.requirements.map((req, i) => (
          <Row
            key={i}
            justify="between"
            gap={6}
            style={{ alignSelf: 'stretch', paddingVertical: 2 }}
            label={`${req.isMet ? 'Karşılandı' : 'Karşılanmadı'}: ${req.title}, ${req.currentText} (${req.requiredText})`}
          >
            <Row gap={6} style={{ flexShrink: 1 }}>
              <T color={req.isMet ? HealthGreen : HealthRed} weight="bold" size={12}>
                {req.isMet ? '✓' : '✕'}
              </T>
              <Gorsel ad={sartGorseli(req.title)} boyut={18} renk={req.isMet ? HealthGreen : AmberGold} />
              <T size={12} color={TextLight} style={{ flexShrink: 1 }}>
                {req.title}
              </T>
            </Row>
            <T size={11} color={req.isMet ? HealthGreen : AmberGoldDark} weight={req.isMet ? 'bold' : 'normal'} align="right" style={{ flexShrink: 1 }}>
              {`${req.currentText} (${req.requiredText})`}
            </T>
          </Row>
        ))}

        <Spacer h={12} />

        <Btn
          onPress={onTransform}
          disabled={!transformationStatus.canTransform}
          color={AmberGold}
          contentColor={DarkBg}
          disabledColor={DarkSurface}
          disabledContentColor={TextMuted}
          radius={8}
          style={{ alignSelf: 'stretch', minHeight: 42 }}
          gorsel={transformationStatus.canTransform ? 'ev' : 'kilit'}
          label={
            transformationStatus.canTransform ? 'Kendi Evine Taşın ve Karargahını Kur, 500 Altın' : `Şartlar Karşılanmadı, ${metCount} / 4`
          }
        >
          <T weight="bold" size={13} color={transformationStatus.canTransform ? DarkBg : TextMuted} align="center">
            {transformationStatus.canTransform ? 'Kendi Evine Taşın & Karargahını Kur (500 Altın)' : `Şartlar Karşılanmadı (${metCount}/4)`}
          </T>
        </Btn>
      </Column>
    </Card>
  );
}

function RoomCard({ room, canUpgrade, upgradeRequirementNote, canTrainToday, onUpgrade, onDailyTraining, onOpenVault }) {
  const azami = room.level >= room.maxLevel;
  return (
    <Card color={DarkSurface} radius={10} borderColor={DarkBorder} borderWidth={1} style={{ alignSelf: 'stretch' }}>
      <Column pad={14}>
        <Row gap={12} heading label={`${room.name}, Kademe ${room.level}, Yükseltme Bedeli: ${room.upgradeCostGold} Altın`} style={{ alignSelf: 'stretch' }}>
          <GorselRozet ad={odaGorseli(room.type)} boyut={46} renk={AmberGold} kenar={alpha(AmberGold, 0.5)} kare />
          <Column style={{ flex: 1 }}>
            <T weight="bold" color={TextGold} size={16}>
              {`${room.type.title}`}
            </T>
            <Row gap={4}>
              <Gorsel ad={nitelikGorseli('seviye')} boyut={14} renk={AmberGold} />
              <T size={13} weight="semibold" color={AmberGold} style={{ flexShrink: 1 }}>
                {`Kademe ${room.level}/${room.maxLevel} • ${room.name}`}
              </T>
            </Row>
          </Column>
        </Row>

        <Spacer h={8} />
        <T size={13} color={alpha(TextLight, 0.9)} lineHeight={18}>
          {room.currentDescription}
        </T>

        <Spacer h={6} />
        <Surface color={DarkSurfaceCard} radius={6} style={{ alignSelf: 'stretch' }}>
          <Row gap={6} style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
            <Gorsel ad="pariltilar" boyut={16} renk={FamePurple} />
            <T size={12} color={FamePurple} weight="semibold" style={{ flexShrink: 1 }}>
              {`Sağladığı Tesir: ${room.bonusSummary}`}
            </T>
          </Row>
        </Surface>

        {/* Sonraki Kademe Bilgisi */}
        {room.level < room.maxLevel ? (
          <>
            <Spacer h={6} />
            <Row gap={6} align="start" style={{ alignSelf: 'stretch' }}>
              <Gorsel ad="yukselt" boyut={14} renk={TextMuted} style={{ marginTop: 1 }} />
              <T size={11} color={TextMuted} lineHeight={15} style={{ flex: 1 }}>
                {`Sonraki: ${room.nextUpgradeDescription}`}
              </T>
            </Row>
          </>
        ) : null}

        {/* Kilit / Önkoşul Uyarısı */}
        {upgradeRequirementNote != null && room.level < room.maxLevel ? (
          <>
            <Spacer h={6} />
            <Surface color={alpha(HealthRed, 0.15)} radius={6} borderColor={alpha(HealthRed, 0.5)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
              <Row gap={6} style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                <Gorsel ad="kilit" boyut={14} renk={HealthRed} />
                <T size={11} color={HealthRed} weight="semibold" style={{ flex: 1 }} label={`Kilitli: ${upgradeRequirementNote}`}>
                  {`${upgradeRequirementNote}`}
                </T>
              </Row>
            </Surface>
          </>
        ) : null}

        {room.type === RoomType.TRAINING_GROUND ? (
          <>
            <Spacer h={10} />
            <Btn
              onPress={onDailyTraining}
              disabled={!canTrainToday}
              color={AmberGold}
              contentColor={DarkBg}
              disabledColor={DarkSurfaceCard}
              disabledContentColor={TextMuted}
              radius={8}
              style={{ alignSelf: 'stretch' }}
              gorsel="hedef-kuklasi"
              label={canTrainToday ? 'Günlük İdman Yap, artı Tecrübe' : 'Bugünkü İdman Tamamlandı, Yarın Tekrar Gel'}
            >
              <T size={12} weight="bold" color={canTrainToday ? DarkBg : TextMuted} align="center">
                {canTrainToday ? 'Günlük İdman Yap (+Tecrübe EXP)' : '✓ Bugünkü İdman Tamamlandı (Yarın Tekrar Gel)'}
              </T>
            </Btn>
          </>
        ) : null}

        {room.type === RoomType.STORAGE_VAULT ? (
          <>
            <Spacer h={10} />
            <Btn onPress={onOpenVault} color={color(0xff2c3e50)} contentColor={TextGold} radius={8} style={{ alignSelf: 'stretch' }} gorsel="sandik" label="Sandık Odasını Aç, 4'lü Kasa Izgarası">
              <T size={12} weight="bold" color={TextGold} align="center">
                Sandık Odasını Aç (4'lü Kasa Izgarası)
              </T>
            </Btn>
          </>
        ) : null}

        <Spacer h={10} />

        <Row justify="between" gap={8} style={{ alignSelf: 'stretch' }}>
          <Row gap={5} style={{ flexShrink: 1 }}>
            <Gorsel ad={azami ? 'kupa' : nitelikGorseli('altin')} boyut={18} renk={canUpgrade ? AmberGold : TextMuted} />
            <T size={13} weight="semibold" color={canUpgrade ? AmberGold : TextMuted} style={{ flexShrink: 1 }}>
              {azami ? 'Azami Kademe' : `Geliştirme: ${room.upgradeCostGold} Altın`}
            </T>
          </Row>
          <Btn
            onPress={onUpgrade}
            disabled={!canUpgrade}
            color={AmberGold}
            contentColor={DarkBg}
            disabledColor={DarkSurfaceCard}
            disabledContentColor={TextMuted}
            radius={8}
            gorsel={azami ? 'kupa' : 'yukselt'}
            label={azami ? `${room.type.title}, Azami Kademe` : `${room.type.title} Kademe Yükselt, ${room.upgradeCostGold} Altın`}
          >
            <T size={12} weight="bold" color={canUpgrade ? DarkBg : TextMuted}>
              {azami ? 'Azami Kademe' : 'Kademe Yükselt'}
            </T>
          </Btn>
        </Row>
      </Column>
    </Card>
  );
}

function CharacterRegistryCard({ unlockedCount, totalCount, isHouse, onOpenCodex }) {
  const baslik = isHouse ? 'Kadim Kütüphane: Diyar Şahsiyetleri' : 'Hücre Notları: Karakter Sicili';
  const alt = `${unlockedCount} / ${totalCount} Şahsiyet Sicili Arşivlendi (Dövüşçüler & Ahali)`;
  return (
    <Card color={DarkSurface} radius={12} borderColor={alpha(AmberGoldDark, 0.6)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
      <Row pad={14} justify="between" gap={8} style={{ alignSelf: 'stretch' }}>
        <Row gap={12} style={{ flex: 1 }} onPress={onOpenCodex} label={`${baslik}. ${alt}. Sicili açmak için dokunun.`}>
          <GorselRozet ad={isHouse ? 'kitaplik' : 'tomar'} boyut={44} renk={AmberGold} />
          <Column style={{ flex: 1 }}>
            <T style={Typography.titleMedium} weight="bold" color={TextGold}>
              {baslik}
            </T>
            <T size={11} color={TextMuted}>
              {alt}
            </T>
          </Column>
        </Row>
        <Btn onPress={onOpenCodex} color={AmberGoldDark} contentColor={TextLight} radius={8} pad={8} label="Sicili Aç" gorsel="acik-kitap">
          <T size={11} weight="bold" color={TextLight}>
            Sicili Aç
          </T>
        </Btn>
      </Row>
    </Card>
  );
}

function CharacterRegistryDialog({ profiles, onDismiss }) {
  const [selectedTab, setSelectedTab] = useState(0); // 0: Tümü, 1: Dövüşçüler, 2: Ahali & Esnaf
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [lockedAlertMessage, setLockedAlertMessage] = useState(null);

  const unlockedRegionsInProfiles = useMemo(() => kt.distinct(profiles.map((it) => it.profile.regionId)), [profiles]);

  const regionProfiles = useMemo(
    () => (selectedRegion === 'all' ? profiles : profiles.filter((it) => it.profile.regionId === selectedRegion)),
    [profiles, selectedRegion]
  );

  const filteredProfiles = useMemo(() => {
    switch (selectedTab) {
      case 1:
        return regionProfiles.filter((it) => it.profile.category === CharacterCategory.GLADIATOR);
      case 2:
        return regionProfiles.filter((it) => it.profile.category !== CharacterCategory.GLADIATOR);
      default:
        return regionProfiles;
    }
  }, [regionProfiles, selectedTab]);

  const unlockedCount = kt.count(profiles, (it) => it.isUnlocked);
  const gladCount = kt.count(regionProfiles, (it) => it.profile.category === CharacterCategory.GLADIATOR);
  const ahaliCount = kt.count(regionProfiles, (it) => it.profile.category !== CharacterCategory.GLADIATOR);

  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      confirm={
        <Btn onPress={onDismiss} color={AmberGoldDark} contentColor={TextLight} radius={6} gorsel="kapi">
          <T weight="bold" size={12} color={TextLight}>
            Kapat
          </T>
        </Btn>
      }
      title={
        <Column>
          <Row gap={10} label={`Diyar Şahsiyetleri & Karakter Sicili, ${unlockedCount} / ${profiles.length} Şahsiyet Keşfedildi`} heading>
            <GorselRozet ad="kitaplik" boyut={40} renk={AmberGold} />
            <Column style={{ flex: 1 }}>
              <T size={15} weight="bold" color={TextGold}>
                Diyar Şahsiyetleri & Karakter Sicili
              </T>
              <T size={11} color={AmberGoldLight}>
                {`${unlockedCount} / ${profiles.length} Şahsiyet Keşfedildi`}
              </T>
            </Column>
          </Row>
          <Spacer h={10} />
          {/* Kategori Filtre Sekmeleri */}
          <Row gap={6} wrap style={{ alignSelf: 'stretch' }}>
            <Chip selected={selectedTab === 0} onPress={() => setSelectedTab(0)} label={`Tümü, ${regionProfiles.length}`} gorsel="kitaplik">
              {`Tümü (${regionProfiles.length})`}
            </Chip>
            <Chip selected={selectedTab === 1} onPress={() => setSelectedTab(1)} label={`Dövüşçü, ${gladCount}`} gorsel="sparta-migferi">
              {`Dövüşçü (${gladCount})`}
            </Chip>
            <Chip selected={selectedTab === 2} onPress={() => setSelectedTab(2)} label={`Ahali, ${ahaliCount}`} gorsel="koy">
              {`Ahali (${ahaliCount})`}
            </Chip>
          </Row>

          {/* Birden fazla bölge varsa bölge filtresi */}
          {unlockedRegionsInProfiles.length > 1 ? (
            <>
              <Spacer h={6} />
              <Row gap={6} wrap style={{ alignSelf: 'stretch' }}>
                <Chip selected={selectedRegion === 'all'} onPress={() => setSelectedRegion('all')} gorsel="dunya">
                  Tüm Bölgeler
                </Chip>
                {unlockedRegionsInProfiles.includes('kirlangic') ? (
                  <Chip selected={selectedRegion === 'kirlangic'} onPress={() => setSelectedRegion('kirlangic')} gorsel={bolgeGorseli('kirlangic')}>
                    Kırlangıç
                  </Chip>
                ) : null}
                {unlockedRegionsInProfiles.includes('tashisar') ? (
                  <Chip selected={selectedRegion === 'tashisar'} onPress={() => setSelectedRegion('tashisar')} gorsel={bolgeGorseli('tashisar')}>
                    Taş Hisar
                  </Chip>
                ) : null}
              </Row>
            </>
          ) : null}
        </Column>
      }
      text={
        <Column style={{ alignSelf: 'stretch' }}>
          {lockedAlertMessage != null ? (
            <Surface
              radius={6}
              color={color(0xff2e1b1b)}
              borderColor={alpha(HealthRed, 0.6)}
              borderWidth={1}
              style={{ alignSelf: 'stretch', marginBottom: 8 }}
              onPress={() => setLockedAlertMessage(null)}
              label={`Kilitli: ${lockedAlertMessage}. Kapatmak için dokunun.`}
            >
              <Row pad={8} gap={6}>
                <Gorsel ad="kilit" boyut={16} renk={color(0xffffb4ab)} />
                <T size={11} color={color(0xffffb4ab)} lineHeight={15} style={{ flex: 1 }}>
                  {lockedAlertMessage}
                </T>
              </Row>
            </Surface>
          ) : null}

          {/* Izgara (Grid) Görünümü - 3 Kolonlu Kare Portreler */}
          <Grid
            columns={3}
            gap={8}
            data={filteredProfiles}
            renderItem={(item) => {
              const isUnlocked = item.isUnlocked;
              const profile = item.profile;
              return (
                <Card
                  color={isUnlocked ? DarkSurfaceCard : color(0xff161412)}
                  radius={10}
                  borderColor={isUnlocked ? alpha(AmberGoldDark, 0.6) : alpha(DarkBorder, 0.4)}
                  borderWidth={1}
                  label={isUnlocked ? `${profile.name}, ${profile.title}` : '??? Bilinmeyen, Keşfedilmedi'}
                  onPress={() => {
                    if (isUnlocked) {
                      setSelectedProfile(item);
                    } else {
                      const mesaj = profile.isGladiator
                        ? 'Bu dövüşçüyle henüz arenada karşılaşmadın ya da handan istihbaratını edinmedin.'
                        : 'Bu şahsiyetle henüz kasabada veya diyar mekanlarında etkileşime girmedin.';
                      setLockedAlertMessage(mesaj);
                      announce(mesaj);
                    }
                  }}
                >
                  <Column pad={8} align="center">
                    {/* Kare Portre / Fotoğraf Alanı */}
                    <GorselRozet
                      ad={isUnlocked ? karakterGorseli(profile) : 'kilit'}
                      boyut={64}
                      kare
                      oran={isUnlocked ? 0.66 : 0.4}
                      zemin={isUnlocked ? DarkBg : color(0xff0f0e0d)}
                      kenar={isUnlocked ? alpha(AmberGold, 0.5) : color(0xff2c2722)}
                      renk={isUnlocked ? (profile.isGladiator ? AmberGold : AmberGoldLight) : alpha(TextMuted, 0.45)}
                    />

                    <Spacer h={6} />

                    {/* Karakter Adı */}
                    <T size={11} weight="bold" color={isUnlocked ? TextGold : TextMuted} lines={1} align="center">
                      {isUnlocked ? profile.name : '??? Bilinmeyen'}
                    </T>

                    {/* Unvan / Rol */}
                    <T size={9} color={isUnlocked ? AmberGoldLight : alpha(TextMuted, 0.5)} lines={1} align="center">
                      {isUnlocked ? profile.title : 'Keşfedilmedi'}
                    </T>
                  </Column>
                </Card>
              );
            }}
          />

          {/* Karakter Detay Modalı (Eşya detayları gibi zengin pencere) */}
          {selectedProfile != null ? <CharacterDetailDialog liveProfile={selectedProfile} onDismiss={() => setSelectedProfile(null)} /> : null}
        </Column>
      }
    />
  );
}

function CharacterDetailDialog({ liveProfile, onDismiss }) {
  const profile = liveProfile.profile;
  const isGladiator = profile.isGladiator;
  const liveEnemy = liveProfile.liveEnemy;
  const weakness = liveProfile.weakness;
  const isWeaknessKnown = liveProfile.isWeaknessKnown;
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0); // 0: Zihin & Mizaç, 1: Hikaye & Tasvir, 2: Dövüş/Rol
  const skills = useMemo(() => {
    const list = liveEnemy?.skills ?? [];
    return list.length > 0 ? list : profile.skills;
  }, [liveProfile]);

  const sekmeler = [['Zihin', 0, 'Zihin'], ['Hikaye', 1, 'Hikaye'], isGladiator ? ['Dövüş', 2, 'Dövüş'] : ['Rol', 2, 'Rol']];
  const rozet = isGladiator ? 'Arena Gladyatörü' : `${profile.locationOrDuty ?? 'Kasaba Ahali'}`;
  const sekmeGorselleri = ['ucuncu-goz', 'acik-kitap', isGladiator ? 'capraz-kilic' : 'ors'];

  let icerik;
  if (selectedTab === 0) {
    // ZİHİN VE PSİKOLOJİK SEVİYE BARLARI
    const psychology = liveProfile.effectivePsychology ?? liveEnemy?.personality?.psychology ?? FighterPsychology.fromArchetype(PersonalityArchetype.HIRSLI);
    icerik = <GladiatorPsychologyCard psychology={psychology} />;
  } else if (selectedTab === 1) {
    icerik = (
      <>
        {/* 1. GÖRÜNÜŞ VE TASVİR BÖLÜMÜ */}
        <Surface radius={8} color={DarkSurfaceCard} borderColor={alpha(AmberGoldDark, 0.4)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
          <Column pad={10}>
            <Row gap={6}>
              <Gorsel ad="gozlemci" boyut={18} renk={AmberGold} />
              <T heading size={12} weight="bold" color={AmberGold}>
                Görünüş ve Tasvir
              </T>
            </Row>
            <Spacer h={4} />
            <T size={11} color={TextLight} lineHeight={16} italic>
              {profile.appearance}
            </T>
          </Column>
        </Surface>

        <Spacer h={8} />

        {/* 2. BİYOGRAFİ & DİYAR GEÇMİŞİ (2-3 Paragraf) */}
        <Surface radius={8} color={DarkSurfaceCard} borderColor={DarkBorder} borderWidth={1} style={{ alignSelf: 'stretch' }}>
          <Column pad={10}>
            <Row gap={6}>
              <Gorsel ad="tomar" boyut={18} renk={TextGold} />
              <T heading size={12} weight="bold" color={TextGold}>
                Biyografi ve Diyar Geçmişi
              </T>
            </Row>
            <Spacer h={6} />
            <T size={11} color={alpha(TextLight, 0.95)} lineHeight={16}>
              {profile.backgroundLore}
            </T>
          </Column>
        </Surface>
      </>
    );
  } else {
    icerik = (
      <>
        {/* 3. GLADYATÖRLER İÇİN CANLI İSTATİSTİKLER, GÜNLÜK HAREKET & CÜZDAN */}
        {isGladiator && liveEnemy != null ? (
          <>
            <Surface radius={8} color={color(0xff1e1712)} borderColor={alpha(AmberGold, 0.6)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
              <Column pad={10}>
                <Row justify="between" style={{ alignSelf: 'stretch' }}>
                  <Row gap={6} style={{ flexShrink: 1 }}>
                    <Gorsel ad="simsek" boyut={18} renk={TextGold} />
                    <T heading size={12} weight="bold" color={TextGold} style={{ flexShrink: 1 }}>
                      Canlı Savaşçı Durumu & Güç
                    </T>
                  </Row>
                  <Surface radius={4} color={DarkBg}>
                    <Row gap={3} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Gorsel ad={nitelikGorseli('seviye')} boyut={13} renk={AmberGold} />
                      <T size={10} weight="bold" color={AmberGold}>
                        {`Seviye ${liveEnemy.level}`}
                      </T>
                    </Row>
                  </Surface>
                </Row>

                <Spacer h={8} />

                {/* 4'lü Canlı Güç Göstergesi */}
                <Row
                  justify="between"
                  wrap
                  gap={4}
                  style={{ alignSelf: 'stretch' }}
                  label={`Can: ${liveEnemy.stats.maxHealth} HP, Hasar: ${liveEnemy.stats.damage}, Zırh: ${liveEnemy.stats.armor}, Hız: ${liveEnemy.stats.speed}`}
                >
                  <SimgeliSatir gorsel={nitelikGorseli('can')} renk={HealthGreen} boyut={14} style={{ gap: 3 }}>
                    <T size={11} color={HealthGreen} weight="bold">
                      {`Can: ${liveEnemy.stats.maxHealth} HP`}
                    </T>
                  </SimgeliSatir>
                  <SimgeliSatir gorsel={nitelikGorseli('hasar')} renk={HealthRed} boyut={14} style={{ gap: 3 }}>
                    <T size={11} color={HealthRed} weight="bold">
                      {`Hasar: ${liveEnemy.stats.damage}`}
                    </T>
                  </SimgeliSatir>
                  <SimgeliSatir gorsel={nitelikGorseli('zirh')} renk={AmberGoldLight} boyut={14} style={{ gap: 3 }}>
                    <T size={11} color={AmberGoldLight} weight="bold">
                      {`Zırh: ${liveEnemy.stats.armor}`}
                    </T>
                  </SimgeliSatir>
                  <SimgeliSatir gorsel={nitelikGorseli('hiz')} renk={ExpBlueAcik} boyut={14} style={{ gap: 3 }}>
                    <T size={11} color={color(0xff64b5f6)} weight="bold">
                      {`Hız: ${liveEnemy.stats.speed}`}
                    </T>
                  </SimgeliSatir>
                </Row>

                <Spacer h={6} />

                <Row justify="between" wrap gap={4} style={{ alignSelf: 'stretch' }}>
                  <SimgeliSatir gorsel="kilic-kabza" renk={TextLight} boyut={14} style={{ gap: 3, flexShrink: 1 }}>
                    <T size={11} color={TextLight} label={`Silah: ${liveEnemy.weaponName}`} style={{ flexShrink: 1 }}>
                      {`Silah: ${liveEnemy.weaponName}`}
                    </T>
                  </SimgeliSatir>
                  <SimgeliSatir gorsel="para-kesesi" renk={AmberGold} boyut={14} style={{ gap: 3 }}>
                    <T size={11} weight="bold" color={AmberGold} label={`Cüzdan: ${liveEnemy.personality.gold} Altın`}>
                      {`Cüzdan: ${liveEnemy.personality.gold} Altın`}
                    </T>
                  </SimgeliSatir>
                </Row>

                {liveEnemy.socketedGems.length > 0 ? (
                  <>
                    <Spacer h={4} />
                    <Row
                      gap={4}
                      wrap
                      style={{ alignSelf: 'stretch' }}
                      label={`Takılı Taşlar: ${liveEnemy.socketedGems.map((gem) => `${gem.type.displayName} Seviye ${gem.level}`).join(', ')}`}
                    >
                      <Gorsel ad="elmas" boyut={14} renk={AmberGold} />
                      <T size={10} color={AmberGold} weight="bold">
                        Takılı Taşlar:
                      </T>
                      {liveEnemy.socketedGems.map((gem, i) => (
                        <Surface key={i} radius={4} color={DarkBg} borderColor={alpha(tasRengi(gem.type), 0.7)} borderWidth={1}>
                          <Row gap={3} style={{ paddingHorizontal: 4, paddingVertical: 2 }}>
                            <Gorsel ad={tasGorseli(gem.type)} boyut={12} renk={tasRengi(gem.type)} />
                            <T size={9} color={TextLight}>
                              {`Sv.${gem.level}`}
                            </T>
                          </Row>
                        </Surface>
                      ))}
                    </Row>
                  </>
                ) : null}

                <Spacer h={6} />

                <Row gap={6} align="start" style={{ alignSelf: 'stretch' }}>
                  <Gorsel ad={mizacGorseli(liveEnemy.personality.archetype)} boyut={16} renk={TextMuted} />
                  <T size={10} color={TextMuted} lineHeight={14} style={{ flex: 1 }}>
                    {`Mizaç: ${liveEnemy.personality.archetype.title} - ${liveEnemy.personality.bio}`}
                  </T>
                </Row>

                {/* Canlı Günlük Hareketi */}
                {liveEnemy.personality.latestDiary.length > 0 ? (
                  <>
                    <Spacer h={8} />
                    <Surface radius={6} color={DarkBg} style={{ alignSelf: 'stretch' }}>
                      <Column pad={8}>
                        <SimgeliSatir gorsel="not-defteri" boyut={14}>
                          <T size={10} weight="bold" color={AmberGold}>
                            Son Günlük Hareketi:
                          </T>
                        </SimgeliSatir>
                        <Spacer h={2} />
                        <T size={10} color={TextLight} lineHeight={14}>
                          {liveEnemy.personality.latestDiary}
                        </T>
                      </Column>
                    </Surface>
                  </>
                ) : null}
              </Column>
            </Surface>

            {/* Zaafiyet & Kusur Paneli */}
            {weakness != null && isWeaknessKnown ? (
              <Surface radius={8} color={color(0xff1e3a24)} borderColor={HealthGreen} borderWidth={1} style={{ alignSelf: 'stretch' }}>
                <Column pad={10}>
                  <Row gap={6}>
                    <Gorsel ad="hedef-tahtasi" boyut={18} renk={HealthGreen} />
                    <T heading size={12} weight="bold" color={HealthGreen} style={{ flexShrink: 1 }}>
                      {`Keşfedilen Kusur: ${weakness.flawTitle}`}
                    </T>
                  </Row>
                  <Spacer h={4} />
                  <T size={11} color={TextLight} lineHeight={15}>
                    {weakness.hintDescription}
                  </T>
                  <Spacer h={4} />
                  <SimgeliSatir gorsel="capraz-kilic" renk={AmberGoldLight} boyut={14} style={{ alignSelf: 'stretch' }}>
                    <T size={10} weight="bold" color={AmberGoldLight} style={{ flex: 1 }}>
                      {`Taktik Üstünlük: %${weakness.exploitChancePercent} şansla +%${weakness.bonusDamagePercent} hasar & zırh kırma`}
                    </T>
                  </SimgeliSatir>
                </Column>
              </Surface>
            ) : (
              <Surface radius={8} color={DarkSurfaceCard} borderColor={DarkBorder} borderWidth={1} style={{ alignSelf: 'stretch' }}>
                <Row pad={10} gap={6}>
                  <Gorsel ad="kilit" boyut={16} renk={TextMuted} />
                  <T size={10} color={TextMuted} lineHeight={14} style={{ flex: 1 }}>
                    Zaafiyet Henüz Bilinmiyor (İsli Kandil Hanı'ndaki masalara kulak kabartarak veya muhbire danışarak keşfedebilirsin).
                  </T>
                </Row>
              </Surface>
            )}
          </>
        ) : null}

        {/* 4. KASABA HALKI / ZANAATKARLAR İÇİN GÖREV VE KONUM */}
        {!isGladiator ? (
          <Surface radius={8} color={color(0xff1b242e)} borderColor={color(0xff3e5a73)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
            <Column pad={10}>
              <Row gap={6}>
                <Gorsel ad="ors" boyut={18} renk={TextGold} />
                <T heading size={12} weight="bold" color={TextGold}>
                  Zanaat ve Diyar Rolü
                </T>
              </Row>
              <Spacer h={4} />
              <SimgeliSatir gorsel="demirci" renk={AmberGoldLight} boyut={14} style={{ alignSelf: 'stretch' }}>
                <T size={11} weight="semibold" color={AmberGoldLight} style={{ flex: 1 }}>
                  {`Meslek / Uzmanlık: ${profile.roleOrWeapon}`}
                </T>
              </SimgeliSatir>
              <Spacer h={2} />
              <SimgeliSatir gorsel="han-tabelasi" renk={TextLight} boyut={14} style={{ alignSelf: 'stretch' }}>
                <T size={11} color={TextLight} style={{ flex: 1 }}>
                  {`Konum / Dükkan: ${profile.locationOrDuty ?? 'Kırlangıç Kasabası'}`}
                </T>
              </SimgeliSatir>
            </Column>
          </Surface>
        ) : null}

        {/* 4. KADİM YETENEKLER & DÖVÜŞ SANATLARI (Top Top Yan Yana 4 Yuvarlak) */}
        {skills.length > 0 ? (
          <Surface radius={8} color={color(0xff191613)} borderColor={alpha(AmberGoldDark, 0.5)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
            <Column pad={10}>
              <Row justify="between" style={{ alignSelf: 'stretch' }}>
                <Row gap={6}>
                  <Gorsel ad="yumruk" boyut={18} renk={TextGold} />
                  <T heading size={12} weight="bold" color={TextGold}>
                    {`Dövüş Yetenekleri (${skills.length} Sanat)`}
                  </T>
                </Row>
                <T size={10} color={AmberGoldLight} hidden>
                  İncele
                </T>
              </Row>
              <Spacer h={10} />
              <Row justify="evenly" wrap style={{ alignSelf: 'stretch' }}>
                {skills.map((skill, i) => (
                  <Column
                    key={skill.id ?? i}
                    align="center"
                    radius={8}
                    pad={4}
                    style={{ maxWidth: 80 }}
                    onPress={() => setSelectedSkill(skill)}
                    label={`${skill.name}, yeteneği incele`}
                  >
                    <GorselRozet ad={yetenekGorseli(skill.type)} boyut={46} zemin={DarkBg} kenar={AmberGold} renk={AmberGold} oran={0.56} />
                    <Spacer h={4} />
                    <T size={9} weight="semibold" color={TextLight} lines={1}>
                      {skill.name}
                    </T>
                  </Column>
                ))}
              </Row>
            </Column>
          </Surface>
        ) : null}
      </>
    );
  }

  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      confirm={
        <Btn onPress={onDismiss} color={AmberGoldDark} contentColor={TextLight} radius={6} gorsel="kapi">
          <T weight="bold" size={12} color={TextLight}>
            Kapat
          </T>
        </Btn>
      }
      title={
        <Row gap={12} style={{ alignSelf: 'stretch' }} label={`${profile.name}, ${profile.title}, ${isGladiator ? 'Arena Gladyatörü' : profile.locationOrDuty ?? 'Kasaba Ahali'}`} heading>
          {/* Büyük Kare Portre Alanı */}
          <GorselRozet ad={karakterGorseli(profile)} boyut={68} kare oran={0.66} zemin={DarkBg} kenar={AmberGold} renk={isGladiator ? AmberGold : AmberGoldLight} />

          <Column style={{ flex: 1 }}>
            <T weight="bold" size={17} color={TextGold}>
              {profile.name}
            </T>
            <T size={12} color={AmberGoldLight}>
              {profile.title}
            </T>
            <Spacer h={3} />
            <Surface radius={4} color={isGladiator ? color(0xff331e1e) : color(0xff1b2e22)} style={{ alignSelf: 'flex-start' }}>
              <Row gap={4} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                <Gorsel ad={isGladiator ? 'arena' : 'koy'} boyut={13} renk={isGladiator ? HealthRed : HealthGreen} />
                <T size={10} weight="bold" color={isGladiator ? HealthRed : HealthGreen} style={{ flexShrink: 1 }}>
                  {rozet}
                </T>
              </Row>
            </Surface>
          </Column>
        </Row>
      }
      text={
        <Column gap={12} style={{ alignSelf: 'stretch' }}>
          {/* 3'LÜ KATEGORİ SEÇİCİ (Zihin & Mizaç / Hikaye & Tasvir / Dövüş & Rol) */}
          <Row gap={4} pad={3} radius={8} color={color(0xff141210)} borderColor={alpha(AmberGoldDark, 0.4)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
            {sekmeler.map(([label, index, sesli]) => {
              const isSelected = selectedTab === index;
              return (
                <Box
                  key={index}
                  align="center"
                  justify="center"
                  radius={6}
                  color={isSelected ? AmberGoldDark : Color.Transparent}
                  style={{ flex: 1, paddingVertical: 6, minHeight: 40 }}
                  onPress={() => setSelectedTab(index)}
                  selected={isSelected}
                  role="tab"
                  label={`${sesli}${isSelected ? ', seçili' : ''}, sekme ${index + 1} / 3`}
                >
                  <Gorsel ad={sekmeGorselleri[index]} boyut={20} renk={isSelected ? TextLight : TextMuted} />
                  <T size={11} weight={isSelected ? 'bold' : 'normal'} color={isSelected ? TextLight : TextMuted}>
                    {label}
                  </T>
                </Box>
              );
            })}
          </Row>

          {icerik}

          {/* Yetenek İnceleme Penceresi (Eşya detayları gibi zengin pencere) */}
          {selectedSkill != null ? <SkillDetailDialog skill={selectedSkill} onDismiss={() => setSelectedSkill(null)} /> : null}
        </Column>
      }
    />
  );
}

function SkillDetailDialog({ skill, onDismiss }) {
  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      confirm={
        <Btn onPress={onDismiss} color={AmberGoldDark} contentColor={TextLight} radius={6} gorsel="kapi">
          <T weight="bold" size={12} color={TextLight}>
            Kapat
          </T>
        </Btn>
      }
      title={
        <Row gap={10} style={{ alignSelf: 'stretch' }} heading label={`${skill.name}, ${skill.type.displayName}, Kademe ${skill.tier} / 3`}>
          <GorselRozet ad={yetenekGorseli(skill.type)} boyut={50} zemin={DarkBg} kenar={AmberGold} renk={AmberGold} oran={0.56} />
          <Column style={{ flex: 1 }}>
            <T weight="bold" size={16} color={TextGold}>
              {skill.name}
            </T>
            <Row gap={6} wrap>
              <Surface radius={4} color={DarkSurfaceCard}>
                <Row gap={3} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Gorsel ad={yetenekGorseli(skill.type)} boyut={12} renk={AmberGold} />
                  <T size={10} color={AmberGold}>
                    {`${skill.type.displayName}`}
                  </T>
                </Row>
              </Surface>
              <Row gap={3}>
                <Gorsel ad="yildiz-madalya" boyut={13} renk={TextMuted} />
                <T size={11} color={TextMuted}>
                  {`Kademe ${skill.tier} / 3`}
                </T>
              </Row>
            </Row>
          </Column>
        </Row>
      }
      text={
        <Column gap={10} style={{ alignSelf: 'stretch' }}>
          <Surface radius={6} color={DarkBg} style={{ alignSelf: 'stretch' }}>
            <Column pad={10}>
              <SimgeliSatir gorsel="tomar" renk={TextMuted} boyut={14}>
                <T size={10} weight="bold" color={TextMuted}>
                  Yetenek Tasviri:
                </T>
              </SimgeliSatir>
              <Spacer h={2} />
              <T size={12} color={TextLight} lineHeight={16} italic>
                {skill.description}
              </T>
            </Column>
          </Surface>

          <Surface radius={6} color={color(0xff1e3a24)} borderColor={alpha(HealthGreen, 0.7)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
            <Column pad={10}>
              <Row gap={6}>
                <Gorsel ad="kilic-carpisma" boyut={16} renk={HealthGreen} />
                <T size={11} weight="bold" color={HealthGreen}>
                  Savaş İçi Etki & Üstünlük:
                </T>
              </Row>
              <Spacer h={3} />
              <T size={12} weight="semibold" color={AmberGoldLight}>
                {skill.combatEffect}
              </T>
              <Spacer h={4} />
              <SimgeliSatir gorsel={nitelikGorseli('sure')} renk={TextMuted} boyut={14}>
                <T size={10} color={TextMuted}>
                  {`Bekleme Süresi: ${skill.cooldownTurns} Tur`}
                </T>
              </SimgeliSatir>
            </Column>
          </Surface>
        </Column>
      }
    />
  );
}

export function StorageVaultDialog({ player, viewModel, onDismiss }) {
  const [selectedBuildSlot, setSelectedBuildSlot] = useState(null);
  const [viewingChest, setViewingChest] = useState(null);

  // Açık sandık penceresi canlı takip etsin: aynı yuvadaki güncel sandık nesnesi kullanılır.
  const guncelSandik = viewingChest != null ? kt.firstOrNull(player.builtChests, (it) => it.slotIndex === viewingChest.slotIndex) ?? viewingChest : null;

  const slotlar = [];
  for (let slotIndex = 0; slotIndex < 4; slotIndex++) {
    const isUnlocked = slotIndex < player.unlockedChestSlots;
    const chest = kt.firstOrNull(player.builtChests, (it) => it.slotIndex === slotIndex);
    const a11y = !isUnlocked
      ? `${slotIndex + 1}. Sandık Alanı Kilitli. Altınla açılabilir.`
      : chest != null
        ? `${chest.type.displayName}, Kademe ${chest.level}, Kapasite ${chest.capacity}. İçeriğini görmek için dokunun.`
        : `${slotIndex + 1}. Sandık Alanı Boş. Yeni sandık inşa edilebilir.`;

    let govde;
    if (!isUnlocked) {
      const unlockCost = slotIndex === 2 ? 100 : 200;
      govde = (
        <Row justify="between" gap={8} style={{ alignSelf: 'stretch' }}>
          <Row gap={10} style={{ flex: 1 }} label={`${a11y} Açma Bedeli: ${unlockCost} Altın`}>
            <GorselRozet ad="kilit" boyut={40} kare renk={TextMuted} zemin={DarkSurfaceCard} kenar={DarkBorder} oran={0.5} />
            <Column style={{ flex: 1 }}>
              <T weight="bold" color={TextMuted} size={13}>
                {`${slotIndex + 1}. Sandık Alanı (Kilitli)`}
              </T>
              <Row gap={4}>
                <Gorsel ad={nitelikGorseli('altin')} boyut={14} renk={AmberGold} />
                <T size={11} color={AmberGold} style={{ flexShrink: 1 }}>
                  {`Açma Bedeli: ${unlockCost} Altın`}
                </T>
              </Row>
            </Column>
          </Row>
          <Btn
            onPress={() => viewModel.unlockChestSlot()}
            disabled={!(player.gold >= unlockCost)}
            color={AmberGold}
            contentColor={DarkBg}
            pad={8}
            gorsel="acik-kilit"
            label={`${slotIndex + 1}. Sandık Alanının Kilidini Aç, ${unlockCost} Altın`}
          >
            <T size={11} weight="bold" color={player.gold >= unlockCost ? DarkBg : TextMuted}>
              Kilidi Aç
            </T>
          </Btn>
        </Row>
      );
    } else if (chest != null) {
      let contentSummary;
      switch (chest.type) {
        case ChestType.JEWELRY_CHEST:
          contentSummary = `Taşlar: ${player.gemsInventory.length} Adet • Kırık Parçalar: ${kt.sum(Object.values(player.gemShards))} Adet`;
          break;
        case ChestType.IRON_CHEST:
          contentSummary = `Demir Filizi: ${player.getMaterialCount('mat_iron_ore')} / ${chest.capacity}`;
          break;
        case ChestType.STONE_CHEST:
          contentSummary = `Ham İnşaat Taşı: ${player.getMaterialCount('mat_stone')} / ${chest.capacity}`;
          break;
        case ChestType.CLOTH_CHEST:
          contentSummary = `Keten & Halat: ${player.getMaterialCount('mat_cloth')} / ${chest.capacity}`;
          break;
        case ChestType.WOOD_CHEST:
          contentSummary = `Sert Meşe Kerestesi: ${player.getMaterialCount('mat_wood')} / ${chest.capacity}`;
          break;
        case ChestType.HERB_CHEST:
          contentSummary = `Şifalı Yabani Ot: ${player.getMaterialCount('mat_herb')} / ${chest.capacity}`;
          break;
        default:
          contentSummary = '';
      }
      govde = (
        <>
          <Row justify="between" gap={6} style={{ alignSelf: 'stretch' }}>
            <Row gap={6} style={{ flex: 1 }} onPress={() => setViewingChest(chest)} label={`${a11y} Stok: ${contentSummary}`}>
              <GorselRozet ad={sandikGorseli(chest.type)} boyut={40} kare renk={AmberGold} kenar={alpha(AmberGold, 0.5)} />
              <Column style={{ flex: 1 }}>
                <T weight="bold" color={TextGold} size={13}>
                  {chest.type.displayName}
                </T>
                <T size={11} color={TextMuted}>
                  {`Kademe ${chest.level} • Kapasite: ${chest.capacity}`}
                </T>
              </Column>
            </Row>
            <Row gap={4}>
              <OutlinedBtn onPress={() => setViewingChest(chest)} pad={6} label={`${chest.type.displayName} Aç`} gorsel="acik-kilit">
                <T size={10} color={AmberGold} weight="bold">
                  Aç
                </T>
              </OutlinedBtn>
              <Btn
                onPress={() => viewModel.upgradeChest(slotIndex)}
                disabled={!(player.gold >= chest.upgradeCostGold)}
                color={AmberGold}
                contentColor={DarkBg}
                pad={6}
                gorsel="yukselt"
                label={`${chest.type.displayName} Geliştir, ${chest.upgradeCostGold} Altın`}
              >
                <T size={10} weight="bold" color={player.gold >= chest.upgradeCostGold ? DarkBg : TextMuted}>
                  {`(${chest.upgradeCostGold} Altın)`}
                </T>
              </Btn>
            </Row>
          </Row>

          <Spacer h={6} />
          <T size={11} color={HealthGreen} weight="medium" hidden>
            {`Stok: ${contentSummary}`}
          </T>
        </>
      );
    } else {
      const availableChestTypes = ChestType.values().filter((ct) => kt.none(player.builtChests, (it) => it.type === ct));
      govde = (
        <Column>
          <Row justify="between" gap={6} style={{ alignSelf: 'stretch' }}>
            <Row gap={10} style={{ flexShrink: 1 }}>
              <GorselRozet ad="sandik" boyut={40} kare renk={alpha(TextLight, 0.4)} zemin={DarkBg} kenar={DarkBorder} oran={0.5} />
              <T weight="bold" color={TextLight} size={13} label={a11y} style={{ flexShrink: 1 }}>
                {`${slotIndex + 1}. Sandık Alanı (Boş)`}
              </T>
            </Row>
            <TextBtn
              gorsel={selectedBuildSlot === slotIndex ? 'kapi' : 'cekic'}
              onPress={() => setSelectedBuildSlot(selectedBuildSlot === slotIndex ? null : slotIndex)}
              label={selectedBuildSlot === slotIndex ? 'İptal' : `${slotIndex + 1}. alana Sandık İnşa Et`}
            >
              <T size={11} color={AmberGold}>
                {selectedBuildSlot === slotIndex ? 'İptal' : '+ Sandık İnşa Et'}
              </T>
            </TextBtn>
          </Row>

          {selectedBuildSlot === slotIndex ? (
            <>
              <Spacer h={6} />
              <T size={11} color={TextMuted}>
                İnşa Edilecek Sandığı Seç (60 Altın):
              </T>
              <Spacer h={4} />
              <Column gap={4}>
                {availableChestTypes.map((cType) => (
                  <OutlinedBtn
                    key={cType.name}
                    onPress={() => {
                      viewModel.buildChest(slotIndex, cType);
                      setSelectedBuildSlot(null);
                    }}
                    disabled={!(player.gold >= 60)}
                    pad={8}
                    style={{ alignSelf: 'stretch' }}
                    label={`${cType.displayName} inşa et, 60 Altın`}
                  >
                    <Row justify="between" style={{ alignSelf: 'stretch', flex: 1 }}>
                      <Row gap={6} style={{ flexShrink: 1 }}>
                        <Gorsel ad={sandikGorseli(cType)} boyut={20} renk={player.gold >= 60 ? AmberGold : TextMuted} />
                        <T size={11} color={player.gold >= 60 ? AmberGold : TextMuted}>{`${cType.displayName}`}</T>
                      </Row>
                      <Row gap={4}>
                        <Gorsel ad={nitelikGorseli('altin')} boyut={14} renk={AmberGold} />
                        <T size={11} color={AmberGold}>
                          60 Altın
                        </T>
                      </Row>
                    </Row>
                  </OutlinedBtn>
                ))}
              </Column>
            </>
          ) : null}
        </Column>
      );
    }

    slotlar.push(
      <Card
        key={slotIndex}
        color={isUnlocked ? DarkSurfaceCard : DarkBg}
        radius={10}
        borderColor={isUnlocked && chest != null ? alpha(AmberGold, 0.6) : DarkBorder}
        borderWidth={1}
        style={{ alignSelf: 'stretch' }}
      >
        <Column pad={10}>{govde}</Column>
      </Card>
    );
  }

  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      title={
        <Row gap={10} heading label={`Depo Mahzeni & Kutu Odası, 4 Yuvalı Kasa Izgarası, ${player.unlockedChestSlots} / 4 Açık`}>
          <GorselRozet ad="sandik" boyut={44} renk={AmberGold} />
          <Column style={{ flex: 1 }}>
            <T weight="bold" color={TextGold} size={16}>
              Depo Mahzeni & Kutu Odası
            </T>
            <T size={12} color={TextMuted}>
              {`4 Yuvalı Kasa Izgarası (${player.unlockedChestSlots}/4 Açık)`}
            </T>
          </Column>
        </Row>
      }
      text={
        <Column gap={10} style={{ alignSelf: 'stretch' }}>
          <T size={12} color={alpha(TextLight, 0.85)} lineHeight={16}>
            Hasat alanlarından ve madenlerden toplanan hammaddeler otomatik olarak buradaki sandıklara aktarılır. Sandıkların üzerine dokunarak stoklarını canlı inceleyebilir ve işlemler yapabilirsin.
          </T>

          {slotlar}

          {guncelSandik != null ? <ChestContentsDialog chest={guncelSandik} player={player} viewModel={viewModel} onDismiss={() => setViewingChest(null)} /> : null}
        </Column>
      }
      confirm={
        <TextBtn onPress={onDismiss} gorsel="kapi">
          <T color={AmberGold} weight="bold">
            Kapat
          </T>
        </TextBtn>
      }
    />
  );
}

export function ChestContentsDialog({ chest, player, viewModel, onDismiss }) {
  let icerik;
  if (chest.type === ChestType.JEWELRY_CHEST) {
    const shardSum = kt.sum(Object.values(player.gemShards));
    const hasAnySynthesizable = GemType.values().some((it) => player.getShardCount(it) >= 3);

    // groupBy { it.type to it.level } — ilk görülme sırası korunur
    const grouped = [];
    for (const gem of player.gemsInventory) {
      let g = grouped.find((x) => x.type === gem.type && x.level === gem.level);
      if (!g) {
        g = { type: gem.type, level: gem.level, gems: [] };
        grouped.push(g);
      }
      g.gems.push(gem);
    }
    const hasAnyUpgradable = grouped.some(
      (g) => g.gems.length >= 3 && g.level < GemCraftingRules.MAX_GEM_LEVEL && player.gold >= GemCraftingRules.getUpgradeCostGold(g.level)
    );
    const sentezOlur = hasAnySynthesizable && player.gold >= GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD;

    // 4. AKTİF TELAFİ (PITY) LİSTESİ
    const activePities = kt.mapNotNull(kt.rangeTo(2, GemCraftingRules.MAX_GEM_LEVEL), (lvl) => {
      const p = player.getPityForLevel(lvl);
      return p > 0 ? [lvl, p] : null;
    });

    icerik = (
      <>
        {/* 1. ÖZET & HIZLI İŞLEM PANELİ */}
        <Surface radius={8} color={DarkSurfaceCard} borderColor={alpha(AmberGold, 0.5)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
          <Column pad={10}>
            <Row justify="between" style={{ alignSelf: 'stretch' }} label={`Taşlar: ${player.gemsInventory.length} Adet, Kırıklar: ${shardSum} Adet`}>
              <SimgeliSatir gorsel="elmas" renk={TextGold} boyut={16} style={{ gap: 4 }}>
                <T size={12} weight="bold" color={TextGold}>
                  {`Taşlar: ${player.gemsInventory.length} Adet`}
                </T>
              </SimgeliSatir>
              <SimgeliSatir gorsel="pariltilar" renk={AmberGoldLight} boyut={16} style={{ gap: 4 }}>
                <T size={12} weight="bold" color={AmberGoldLight}>
                  {`Kırıklar: ${shardSum} Adet`}
                </T>
              </SimgeliSatir>
            </Row>
            <Spacer h={8} />
            <Row gap={6} style={{ alignSelf: 'stretch' }}>
              <Btn
                onPress={() => viewModel.combineAllGemShards()}
                disabled={!sentezOlur}
                color={AmberGold}
                contentColor={DarkBg}
                pad={4}
                style={{ flex: 1 }}
                gorsel="kazan"
                label="Tüm Kırıkları Sentezle"
              >
                <T size={10} weight="bold" color={sentezOlur ? DarkBg : TextMuted} align="center">
                  Tüm Kırıkları Sentezle
                </T>
              </Btn>
              <Btn
                onPress={() => viewModel.upgradeAllEligibleGems()}
                disabled={!hasAnyUpgradable}
                color={FamePurple}
                contentColor={Color.White}
                pad={4}
                style={{ flex: 1 }}
                gorsel="yukselt"
                label="Tümünü Yükselt"
              >
                <T size={10} weight="bold" color={hasAnyUpgradable ? Color.White : TextMuted} align="center">
                  Tümünü Yükselt
                </T>
              </Btn>
            </Row>
          </Column>
        </Surface>

        {/* 2. KIRIK PARÇALAR LİSTESİ */}
        <SimgeliSatir gorsel="kazma" renk={TextLight} boyut={18} style={{ alignSelf: 'stretch' }}>
          <T heading size={12} weight="bold" color={TextLight} label="Hasat Edilen Kırık Parçalar, 3 Kırık artı 15 Altın, 1 Taş eder" style={{ flex: 1 }}>
            Hasat Edilen Kırık Parçalar (3 Kırık + 15 Altın = 1 Taş):
          </T>
        </SimgeliSatir>
        {GemType.values().map((gType) => {
          const count = player.getShardCount(gType);
          const olur = count >= 3 && player.gold >= GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD;
          return (
            <Card key={gType.name} color={DarkSurfaceCard} radius={6} style={{ alignSelf: 'stretch' }}>
              <Row pad={8} justify="between" gap={6} style={{ alignSelf: 'stretch' }}>
                <Row gap={8} style={{ flex: 1 }} label={`${gType.displayName} Kırığı, Miktar: ${count} / 3`}>
                  <GorselRozet ad={tasGorseli(gType)} boyut={36} renk={tasRengi(gType)} zemin={alpha(tasRengi(gType), 0.12)} kenar={alpha(tasRengi(gType), 0.5)} oran={0.55} />
                  <Column style={{ flex: 1 }}>
                    <T weight="bold" size={12} color={TextGold}>
                      {`${gType.displayName} Kırığı`}
                    </T>
                    <T size={11} color={count >= 3 ? HealthGreen : TextMuted}>
                      {`Miktar: ${count} / 3`}
                    </T>
                  </Column>
                </Row>
                <Btn
                  onPress={() => viewModel.combineGemShards(gType)}
                  disabled={!olur}
                  color={AmberGold}
                  contentColor={DarkBg}
                  pad={6}
                  gorsel="kazan"
                  label={`${gType.displayName} Sentezle, ${GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD} Altın`}
                >
                  <T size={10} weight="bold" color={olur ? DarkBg : TextMuted}>
                    {`Sentezle (${GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD} Altın)`}
                  </T>
                </Btn>
              </Row>
            </Card>
          );
        })}

        {/* 3. İŞLENMİŞ TAŞLAR */}
        <Spacer h={4} />
        <SimgeliSatir gorsel="elmas" renk={TextLight} boyut={18}>
          <T heading size={12} weight="bold" color={TextLight}>
            Sandıktaki Kesilmiş Taşlar:
          </T>
        </SimgeliSatir>
        {grouped.length === 0 ? (
          <T size={11} color={TextMuted}>
            Henüz işlenmiş taşınız yok. Kırıkları sentezleyerek elde edebilirsiniz.
          </T>
        ) : (
          grouped.map(({ type: gType, level, gems }) => {
            const sample = gems[0];
            const count = gems.length;
            const cost = GemCraftingRules.getUpgradeCostGold(level);
            const targetLevel = level + 1;
            const currentPity = player.getPityForLevel(targetLevel);
            const effectiveRate = GemCraftingRules.getEffectiveSuccessRate(targetLevel, currentPity);
            const olur = count >= 3 && player.gold >= cost;
            const sansMetni = `Sv. ${targetLevel} Şansı: %${effectiveRate}` + (currentPity > 0 ? ` (+%${currentPity} Telafi)` : '');
            return (
              <Card key={`${gType.name}-${level}`} color={DarkSurfaceCard} radius={6} style={{ alignSelf: 'stretch' }}>
                <Column pad={8}>
                  <Row
                    justify="between"
                    gap={6}
                    style={{ alignSelf: 'stretch' }}
                    label={`${gType.displayName} Seviye ${level}, ${sample.effectSummary}, Adet: ${count}${level < GemCraftingRules.MAX_GEM_LEVEL ? `. Seviye ${targetLevel} Şansı: yüzde ${effectiveRate}${currentPity > 0 ? `, artı yüzde ${currentPity} Telafi` : ''}` : ''}`}
                  >
                    <GorselRozet ad={tasGorseli(gType)} boyut={36} renk={tasRengi(gType)} zemin={alpha(tasRengi(gType), 0.12)} kenar={alpha(tasRengi(gType), 0.5)} oran={0.55} />
                    <T weight="bold" size={12} color={TextGold} style={{ flex: 1 }}>
                      {`${sample.displayName} (${sample.effectSummary})`}
                    </T>
                    <T size={11} weight="bold" color={count >= 3 ? HealthGreen : AmberGold}>
                      {`Adet: ${count}`}
                    </T>
                  </Row>
                  {level < GemCraftingRules.MAX_GEM_LEVEL ? (
                    <>
                      <Spacer h={4} />
                      <Row justify="between" gap={6} style={{ alignSelf: 'stretch' }}>
                        <T size={10} color={effectiveRate >= 60 ? HealthGreen : AmberGold} hidden style={{ flexShrink: 1 }}>
                          {sansMetni}
                        </T>
                        <Btn
                          onPress={() => viewModel.upgradeGemLevel(gType, level)}
                          disabled={!olur}
                          color={AmberGold}
                          contentColor={DarkBg}
                          pad={6}
                          gorsel="yukselt"
                          label={`3 ${gType.displayName} Taşını Seviye ${targetLevel}'e Yükselt, ${cost} Altın`}
                        >
                          <T size={10} weight="bold" color={olur ? DarkBg : TextMuted}>
                            {`3 Taşı Yükselt (${cost} Altın)`}
                          </T>
                        </Btn>
                      </Row>
                    </>
                  ) : null}
                </Column>
              </Card>
            );
          })
        )}

        {activePities.length > 0 ? (
          <>
            <Spacer h={4} />
            <SimgeliSatir gorsel="kalkan" boyut={18} style={{ alignSelf: 'stretch' }}>
              <T heading size={12} weight="bold" color={AmberGold} style={{ flex: 1 }}>
                Aktif Şans Koruma & Telafi (Pity) Durumları:
              </T>
            </SimgeliSatir>
            {activePities.map(([lvl, bonus]) => (
              <Surface key={lvl} radius={4} color={DarkSurfaceCard} borderColor={alpha(AmberGold, 0.3)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
                <Row justify="between" style={{ paddingHorizontal: 8, paddingVertical: 4 }} label={`Seviye ${lvl} Yükseltme Güvencesi, artı yüzde ${bonus} Başarı Bonusu`}>
                  <SimgeliSatir gorsel="kalkan" renk={TextLight} boyut={14} style={{ gap: 4 }}>
                    <T size={11} color={TextLight}>
                      {`Sv. ${lvl} Yükseltme Güvencesi`}
                    </T>
                  </SimgeliSatir>
                  <T size={11} color={AmberGold} weight="bold">
                    {`+%${bonus} Başarı Bonusu`}
                  </T>
                </Row>
              </Surface>
            ))}
          </>
        ) : null}
      </>
    );
  } else {
    // MATERYAL SANDIKLARI (Demir, Taş, Keten, Odun, Ot)
    let matKey, matName, desc;
    switch (chest.type) {
      case ChestType.IRON_CHEST:
        [matKey, matName, desc] = ['mat_iron_ore', 'Demir Filizi', 'Maden ocaklarından kazılır. Zırh ve kılıç dövmede kullanılır.'];
        break;
      case ChestType.STONE_CHEST:
        [matKey, matName, desc] = ['mat_stone', 'Ham İnşaat Taşı', 'Taş ocaklarından çıkarılır. Savunma yapıları ve binalarda kullanılır.'];
        break;
      case ChestType.CLOTH_CHEST:
        [matKey, matName, desc] = ['mat_cloth', 'Keten & Halat', 'Keten vadisinde yetişir. Hafif giysi, pelerin ve yay kirişi yapımında kullanılır.'];
        break;
      case ChestType.WOOD_CHEST:
        [matKey, matName, desc] = ['mat_wood', 'Sert Meşe Kerestesi', 'Kadim koruluktan kesilir. Kalkan, kundak ve inşaatlarda kullanılır.'];
        break;
      case ChestType.HERB_CHEST:
        [matKey, matName, desc] = ['mat_herb', 'Şifalı Yabani Ot', 'Şifa çayırlarından toplanır. Can iksirleri ve güç özlerinde kullanılır.'];
        break;
      default:
        [matKey, matName, desc] = ['', '', ''];
    }
    const count = player.getMaterialCount(matKey);
    const frac = kt.coerceIn(count / chest.capacity, 0, 1);

    icerik = (
      <Card color={DarkSurfaceCard} radius={8} style={{ alignSelf: 'stretch' }}>
        <Column pad={12}>
          <Row justify="between" gap={8} style={{ alignSelf: 'stretch' }} label={`${matName}: ${count} / ${chest.capacity}`}>
            <Row gap={8} style={{ flexShrink: 1 }}>
              <GorselRozet ad={malzemeGorseli(matKey)} boyut={40} kare renk={AmberGold} kenar={alpha(AmberGold, 0.4)} />
              <T size={14} weight="bold" color={TextGold} style={{ flexShrink: 1 }}>
                {matName}
              </T>
            </Row>
            <T size={13} weight="bold" color={HealthGreen}>
              {`${count} / ${chest.capacity}`}
            </T>
          </Row>
          <Spacer h={6} />
          <Progress value={frac} color={frac >= 0.9 ? HealthRed : AmberGold} track={DarkBg} height={6} radius={3} label={`Doluluk yüzde ${Math.round(frac * 100)}`} />
          <Spacer h={8} />
          <T size={11} color={alpha(TextLight, 0.85)} lineHeight={15}>
            {desc}
          </T>
          <Spacer h={6} />
          <Row gap={6} align="start" style={{ alignSelf: 'stretch' }}>
            <Gorsel ad="bilgi" boyut={14} renk={TextMuted} />
            <T size={10} color={TextMuted} style={{ flex: 1 }}>
              Sandık dolduğunda yeni toplanan materyaller ziyan olur. Sandığı genişleterek kapasiteyi artırabilirsin.
            </T>
          </Row>
        </Column>
      </Card>
    );
  }

  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      confirm={
        <TextBtn onPress={onDismiss} gorsel="kapi">
          <T color={AmberGold} weight="bold">
            Kapat
          </T>
        </TextBtn>
      }
      title={
        <Row gap={8} heading label={`${chest.type.displayName}, Kademe ${chest.level}, Kapasite: ${chest.capacity}, Canlı Takip`}>
          <GorselRozet ad={sandikGorseli(chest.type)} boyut={44} renk={AmberGold} />
          <Column style={{ flex: 1 }}>
            <T weight="bold" color={TextGold} size={17}>
              {chest.type.displayName}
            </T>
            <T size={11} color={TextMuted}>
              {`Kademe ${chest.level} • Kapasite: ${chest.capacity} • Canlı Takip`}
            </T>
          </Column>
        </Row>
      }
      text={
        <Column gap={10} style={{ alignSelf: 'stretch' }}>
          {icerik}
        </Column>
      }
    />
  );
}
