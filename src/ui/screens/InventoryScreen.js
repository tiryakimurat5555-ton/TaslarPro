// KT/ui/screens/InventoryScreen.kt — karakter sayfası, donanım yuvaları, çanta, iksirler, taş yuvaları, yetenek yuvaları.
import React, { useState } from 'react';
import { AlertDialog, Box, Btn, Card, Column, Divider, Grid, IconBtn, OutlinedBtn, Progress, Row, Scroll, Spacer, Surface, T, Tabs, TextBtn, useFlow } from '../kit.js';
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
import { EquipmentSlot, StarterSkills, UsableCategory } from '../../domain/model.js';
import * as kt from '../../kt.js';

// Kotlin Set<String> model.js'te dizi ya da Set olabilir: ikisini de karşıla.
function kumeBoyu(s) {
  if (s == null) return 0;
  return Array.isArray(s) ? s.length : s.size ?? 0;
}
function kumedeMi(s, x) {
  if (s == null) return false;
  return Array.isArray(s) ? s.includes(x) : s.has(x);
}

function rarityColor(item) {
  return color(item.rarity.colorHex);
}

export function InventoryScreen({ viewModel, modifier }) {
  const player = useFlow(viewModel.player);
  const [selectedTab, setSelectedTab] = useState(0); // 0: Karakter & Donanım, 1: Çanta Izgarası, 2: Tüketim & İksir, 3: Yetenekler

  // Modallar için State'ler
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);
  const [isDetailItemEquipped, setIsDetailItemEquipped] = useState(false);
  const [selectedConsumableForDetail, setSelectedConsumableForDetail] = useState(null);
  const [slotForQuickEquip, setSlotForQuickEquip] = useState(null);

  const sekmeBasligi = (metin, etiket, i) => (
    <T label={etiket} size={13} weight={selectedTab === i ? 'bold' : 'medium'} color={selectedTab === i ? TextGold : TextMuted} align="center" lines={2}>
      {metin}
    </T>
  );

  // 1. Eşya Detay Modalı
  const detayPenceresi =
    selectedItemForDetail != null ? (
      <ItemDetailDialog
        item={selectedItemForDetail}
        isEquipped={isDetailItemEquipped}
        playerLevel={player.level}
        onDismiss={() => setSelectedItemForDetail(null)}
        onEquip={() => {
          viewModel.equip(selectedItemForDetail);
          setSelectedItemForDetail(null);
        }}
        onUnequip={() => {
          viewModel.unequip(selectedItemForDetail.slot);
          setSelectedItemForDetail(null);
        }}
        onChangeEquip={() => {
          const targetSlot = selectedItemForDetail.slot;
          setSelectedItemForDetail(null);
          setSlotForQuickEquip(targetSlot);
        }}
        onSell={() => {
          viewModel.sellEquipment(selectedItemForDetail);
          setSelectedItemForDetail(null);
        }}
      />
    ) : null;

  return (
    <Column style={[{ flex: 1, backgroundColor: DarkBg }, modifier]}>
      {/* Üst Sekmeler */}
      <Tabs
        color={DarkSurface}
        selected={selectedTab}
        onSelect={setSelectedTab}
        titles={[
          sekmeBasligi('Karakter & Donanım', 'Karakter ve Donanım sekmesi', 0),
          sekmeBasligi(`Çanta (${player.inventory.length})`, `Çanta sekmesi, ${player.inventory.length} eşya`, 1),
          sekmeBasligi(`İksirler (${player.consumables.length})`, `İksirler sekmesi, ${player.consumables.length} iksir`, 2),
          sekmeBasligi(
            `Yetenekler (${kumeBoyu(player.unlockedSkillIds)})`,
            `Yetenekler ve dövüş teknikleri sekmesi, ${kumeBoyu(player.unlockedSkillIds)} açık teknik`,
            3
          ),
        ]}
      />

      <Box style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 8 }}>
        {selectedTab === 0 ? (
          // Karakter Kağıt Bebek (Paperdoll) & Yuvalar & İstatistikler
          <PaperdollCharacterView
            player={player}
            onSlotClick={(slot) => {
              const equipped = player.equipped[slot] ?? null;
              if (equipped != null) {
                setSelectedItemForDetail(equipped);
                setIsDetailItemEquipped(true);
              } else {
                setSlotForQuickEquip(slot);
              }
            }}
            onUnequipSlot={(slot) => viewModel.unequip(slot)}
            onChangeSlot={(slot) => setSlotForQuickEquip(slot)}
          />
        ) : selectedTab === 1 ? (
          // Izgaralı Çanta Görünümü (4 sütunlu kare kutucuklar)
          <InventoryGridView
            inventory={player.inventory}
            playerLevel={player.level}
            onItemClick={(item) => {
              setSelectedItemForDetail(item);
              setIsDetailItemEquipped(false);
            }}
            onEquip={(item) => viewModel.equip(item)}
            onSell={(item) => viewModel.sellEquipment(item)}
          />
        ) : selectedTab === 2 ? (
          // İksir & Tüketim Listesi / Izgarası
          <ConsumablesGridView
            consumables={player.consumables}
            player={player}
            onConsumableClick={(consumable) => setSelectedConsumableForDetail(consumable)}
            onUse={(consumable) => viewModel.useConsumable(consumable)}
          />
        ) : (
          // Yetenek Topları & Althea Talim Sistemi Görünümü
          <SkillOrbsView player={player} viewModel={viewModel} />
        )}
      </Box>

      {/* --- MODALLAR (ÜST PENCERELER - VOICEOVER ODAKLI) --- */}

      {/* 2. Yuvaya Özel Hızlı Kuşanma Seçici Modalı (incelenen eşya bu pencerenin üstünde açılır) */}
      {slotForQuickEquip != null ? (
        <SlotQuickEquipDialog
          slot={slotForQuickEquip}
          matchingItems={player.inventory.filter((it) => it.slot === slotForQuickEquip)}
          playerLevel={player.level}
          onDismiss={() => setSlotForQuickEquip(null)}
          onEquip={(item) => {
            viewModel.equip(item);
            setSlotForQuickEquip(null);
          }}
          onInspect={(item) => {
            setSelectedItemForDetail(item);
            setIsDetailItemEquipped(false);
          }}
        >
          {detayPenceresi}
        </SlotQuickEquipDialog>
      ) : (
        detayPenceresi
      )}

      {/* 3. İksir & Tüketim Detay Modalı */}
      {selectedConsumableForDetail != null ? (
        <ConsumableDetailDialog
          item={selectedConsumableForDetail}
          player={player}
          onDismiss={() => setSelectedConsumableForDetail(null)}
          onUse={() => {
            viewModel.useConsumable(selectedConsumableForDetail);
            setSelectedConsumableForDetail(null);
          }}
        />
      ) : null}
    </Column>
  );
}

/**
 * Kağıt Bebek (Paperdoll) Düzeni:
 * - Sol Sütun: Başlık, Gövdelik, Eldiven, Pantolon, Çizme
 * - Orta Sütun: Karakter Kartı (İsim, Unvan, HP/EXP, Seviye)
 * - Sağ Sütun: Silah, Kalkan, Tılsım, Yüzük
 * - Alt Kısım: Savaş Nitelikleri Özeti (Hasar, Zırh, Hız, Sıyrılma, Kritik, Blok)
 */
function PaperdollCharacterView({ player, onSlotClick, onUnequipSlot, onChangeSlot }) {
  const leftSlots = [EquipmentSlot.HEAD, EquipmentSlot.CHEST, EquipmentSlot.GLOVES, EquipmentSlot.PANTS, EquipmentSlot.BOOTS];

  const rightSlots = [EquipmentSlot.WEAPON, EquipmentSlot.SHIELD, EquipmentSlot.TALISMAN, EquipmentSlot.RING];

  const yuva = (slot) => (
    <EquipmentSlotBox
      key={slot.name}
      slot={slot}
      equippedItem={player.equipped[slot] ?? null}
      onClick={() => onSlotClick(slot)}
      onUnequip={onUnequipSlot ? () => onUnequipSlot(slot) : undefined}
      onChange={onChangeSlot ? () => onChangeSlot(slot) : undefined}
    />
  );

  const maxHp = player.totalStats.maxHealth;
  const hpFraction = kt.coerceIn(player.currentHealth / maxHp, 0, 1);
  const expFraction = kt.coerceIn(player.currentExp / player.maxExp, 0, 1);
  const stats = player.totalStats;

  return (
    <Scroll gap={10}>
      {/* Kağıt Bebek & Yuvalar Bölümü */}
      <Card color={DarkSurface} radius={12} borderColor={alpha(AmberGoldDark, 0.5)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
        <Column pad={10} style={{ alignSelf: 'stretch' }}>
          <T heading size={14} weight="bold" color={TextGold} style={{ paddingBottom: 8 }}>
            Donanım Yuvaları & Karakter
          </T>

          <Row justify="between" style={{ alignSelf: 'stretch' }}>
            {/* Sol Yuvalar (Zırh / Koruma) */}
            <Column gap={6} align="center">
              {leftSlots.map(yuva)}
            </Column>

            {/* Orta Karakter Silueti & İlerleme Kartı */}
            <Card color={DarkSurfaceCard} radius={10} borderColor={DarkBorder} borderWidth={1} style={{ flex: 1, marginHorizontal: 8 }}>
              <Column pad={8} align="center" style={{ alignSelf: 'stretch' }}>
                <Column align="center" style={{ alignSelf: 'stretch' }} label={`Karakter: ${player.name}, ${player.title}, Seviye ${player.level}`}>
                  {/* Karakter İkonu / Silueti */}
                  <Surface radius={27} color={alpha(AmberGoldDark, 0.2)} borderColor={AmberGold} borderWidth={2} align="center" justify="center" style={{ width: 54, height: 54 }}>
                    
                  </Surface>

                  <Spacer h={6} />

                  <T size={15} weight="bold" color={TextGold} align="center" lines={1}>
                    {player.name}
                  </T>
                  <T size={11} color={TextMuted} align="center" lines={1}>
                    {player.title}
                  </T>

                  <Surface radius={4} color={alpha(AmberGoldDark, 0.35)} style={{ marginTop: 4 }}>
                    <T size={11} weight="bold" color={TextGold} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                      {`Sv. ${player.level} / 100`}
                    </T>
                  </Surface>
                </Column>

                <Spacer h={8} />

                {/* HP Bar */}
                <Column style={{ alignSelf: 'stretch' }} label={`Sağlık ${player.currentHealth} / ${maxHp}`}>
                  <Row justify="between" style={{ alignSelf: 'stretch' }}>
                    <T size={10} color={TextMuted}>
                      Sağlık
                    </T>
                    <T size={10} color={HealthGreen} weight="bold">
                      {`${player.currentHealth}/${maxHp}`}
                    </T>
                  </Row>
                  <Progress value={hpFraction} color={hpFraction > 0.3 ? HealthGreen : HealthRed} track={DarkBg} height={5} radius={3} />
                </Column>

                <Spacer h={6} />

                {/* Exp Bar */}
                <Column style={{ alignSelf: 'stretch' }} label={`Tecrübe ${player.currentExp} / ${player.maxExp}`}>
                  <Row justify="between" style={{ alignSelf: 'stretch' }}>
                    <T size={10} color={TextMuted}>
                      EXP
                    </T>
                    <T size={10} color={ExpBlue} weight="bold">
                      {`${player.currentExp}/${player.maxExp}`}
                    </T>
                  </Row>
                  <Progress value={expFraction} color={ExpBlue} track={DarkBg} height={5} radius={3} />
                </Column>

                {player.activeBuffs.length > 0 ? (
                  <>
                    <Spacer h={6} />
                    <Column radius={4} color={DarkSurfaceCard} borderColor={alpha(AmberGold, 0.5)} borderWidth={1} pad={6} style={{ alignSelf: 'stretch' }}>
                      <T size={10} weight="bold" color={AmberGold}>
                        Aktif Merhem & İksirler:
                      </T>
                      {player.activeBuffs.map((buff, i) => (
                        <T key={i} size={9} color={TextLight} lines={1} label={`${buff.name}, ${buff.remainingBattles} dövüş kaldı`}>
                          {`${buff.name} (${buff.remainingBattles} dövüş)`}
                        </T>
                      ))}
                    </Column>
                  </>
                ) : null}

                <Spacer h={8} />

                {/* Altın & Şöhret Mini Rozetler */}
                <Row justify="between" style={{ alignSelf: 'stretch' }} label={`Altın: ${player.gold}, Şöhret: ${player.globalFame}`}>
                  <T size={11} weight="bold" color={AmberGold}>
                    {`${player.gold} Altın`}
                  </T>
                  <T size={11} weight="bold" color={FamePurple}>
                    {`${player.globalFame} Şöhret`}
                  </T>
                </Row>
              </Column>
            </Card>

            {/* Sağ Yuvalar (Silah & Aksesuar) */}
            <Column gap={6} align="center">
              {rightSlots.map(yuva)}
              {/* Simetri ve estetik için boş yer tutucu kutu */}
              <Surface
                radius={8}
                color={alpha(DarkSurfaceCard, 0.3)}
                borderColor={alpha(DarkBorder, 0.4)}
                borderWidth={1}
                align="center"
                justify="center"
                style={{ width: 62, height: 62 }}
                label="Kilitli Yan Yuva"
              >
                
              </Surface>
            </Column>
          </Row>
        </Column>
      </Card>

      {/* Savaş Nitelikleri Kutusu */}
      <Card
        color={DarkSurfaceCard}
        radius={10}
        borderColor={DarkBorder}
        borderWidth={1}
        style={{ alignSelf: 'stretch' }}
        label={`Savaş Nitelikleri: Hasar ${stats.damage}, Zırh ${stats.armor}, Hız ${stats.speed}, Sıyrılma yüzde ${stats.dodgeChancePercent}, Kritik yüzde ${stats.critChancePercent}, Blok yüzde ${stats.blockChancePercent}`}
      >
        <Column pad={12}>
          <T style={Typography.titleMedium} color={TextGold} weight="bold">
            Kuşanılmış Nitelikler (Toplam)
          </T>
          <Spacer h={8} />
          <Row justify="between" style={{ alignSelf: 'stretch' }}>
            <StatLabel title="Hasar" value={`${stats.damage}`} />
            <StatLabel title="Zırh" value={`${stats.armor}`} />
            <StatLabel title="Hız" value={`${stats.speed}`} />
          </Row>
          <Spacer h={6} />
          <Row justify="between" style={{ alignSelf: 'stretch' }}>
            <StatLabel title="Sıyrılma" value={`%${stats.dodgeChancePercent}`} />
            <StatLabel title="Kritik" value={`%${stats.critChancePercent}`} />
            <StatLabel title="Blok" value={`%${stats.blockChancePercent}`} />
          </Row>
        </Column>
      </Card>

      <Spacer h={50} />
    </Scroll>
  );
}

/**
 * Kağıt bebekteki tekil kare yuva bileşeni.
 * VoiceOver için yuva + eşya + temel nitelikleri okur; Çıkar / Değiştir özel eylemleri vardır.
 */
function EquipmentSlotBox({ slot, equippedItem, onClick, onUnequip, onChange, style }) {
  const isEquipped = equippedItem != null;
  const borderColor = isEquipped ? rarityColor(equippedItem) : DarkBorder;

  const a11yDesc = isEquipped
    ? `${slot.displayName} Yuvası: ${equippedItem.name}, ${equippedItem.rarity.displayName}, Seviye ${equippedItem.requiredLevel}, ${formatStats(equippedItem.stats)}. İncelemek veya çıkarmak için dokunun.`
    : `Kuşanılmadı: ${slot.displayName}. Çantadan kuşanmak için dokunun.`;

  const actions = [];
  if (isEquipped && onUnequip) actions.push({ name: 'cikar', label: 'Çıkar', run: onUnequip });
  if (isEquipped && onChange) actions.push({ name: 'degistir', label: 'Değiştir', run: onChange });

  return (
    <Surface
      radius={8}
      color={isEquipped ? DarkSurfaceCard : alpha(DarkBg, 0.7)}
      borderColor={borderColor}
      borderWidth={isEquipped ? 1.5 : 1}
      pad={3}
      align="center"
      justify="between"
      style={[{ width: 62, height: 62 }, style]}
      onPress={onClick}
      label={a11yDesc}
      actions={actions.length > 0 ? actions : undefined}
    >
      {/* Yuva veya eşya ikonu */}
      <T size={20} align="center">
        {equippedItem?.categoryIcon ?? slot.icon}
      </T>

      {/* İsim veya durum */}
      <T size={9} weight={isEquipped ? 'semibold' : 'normal'} color={isEquipped ? rarityColor(equippedItem) : TextMuted} lines={1} align="center">
        {isEquipped ? equippedItem.name : 'Boş'}
      </T>
    </Surface>
  );
}

/**
 * Çanta Izgarası Görünümü:
 * 4 sütunlu kare kutucuklar ile akıcı ve kasmayan slot düzeni.
 */
function InventoryGridView({ inventory, playerLevel, onItemClick, onEquip, onSell }) {
  if (inventory.length === 0) {
    return (
      <Box style={{ flex: 1 }} align="center" justify="center">
        <T color={TextMuted} align="center" size={14}>
          {'Çantanızda boşta duran ekipman yok.\nDemirci veya haritada yeni ganimetler bulun!'}
        </T>
      </Box>
    );
  }
  // En az 24 slotluk klasik RPG ızgara görünümü
  const minSlots = Math.max(24, inventory.length + ((4 - (inventory.length % 4)) % 4));
  const emptySlotsCount = Math.max(0, minSlots - inventory.length);

  const hucreler = [...inventory.map((item) => ({ item })), ...kt.listOfSize(emptySlotsCount, (index) => ({ bos: inventory.length + index + 1 }))];

  return (
    <Scroll>
      <Grid
        columns={4}
        gap={8}
        data={hucreler}
        renderItem={(h) =>
          h.item ? (
            <InventoryGridSlotItem
              item={h.item}
              playerLevel={playerLevel}
              onClick={() => onItemClick(h.item)}
              onEquip={onEquip ? () => onEquip(h.item) : undefined}
              onSell={onSell ? () => onSell(h.item) : undefined}
            />
          ) : (
            <EmptyInventorySlotBox index={h.bos} />
          )
        }
      />
      <Spacer h={50} />
    </Scroll>
  );
}

/**
 * Çanta ızgarasındaki dolu kare eşya kutusu.
 * VoiceOver: dokununca inceleme penceresi; yukarı/aşağı kaydırınca Kuşan ve Sat eylemleri.
 */
function InventoryGridSlotItem({ item, playerLevel, onClick, onEquip, onSell }) {
  const rc = rarityColor(item);
  const canEquip = playerLevel == null || playerLevel >= item.requiredLevel;
  const actions = [];
  if (onEquip && canEquip) actions.push({ name: 'kusan', label: 'Kuşan', run: onEquip });
  if (onSell) actions.push({ name: 'sat', label: `Sat, artı ${item.sellPrice} Altın`, run: onSell });

  return (
    <Surface
      radius={8}
      color={DarkSurfaceCard}
      borderColor={alpha(rc, 0.8)}
      borderWidth={1.2}
      pad={4}
      align="center"
      justify="between"
      style={{ aspectRatio: 1 }}
      onPress={onClick}
      label={`${item.name}, ${item.rarity.displayName}, ${item.categoryDisplayName}, Seviye ${item.requiredLevel}${canEquip ? '' : ', seviyen yetersiz'}, ${formatStats(item.stats)}. İncelemek için dokunun.`}
      actions={actions.length > 0 ? actions : undefined}
    >
      <Row justify="between" style={{ alignSelf: 'stretch' }}>
        <T size={14}>{item.categoryIcon}</T>
        <T size={9} color={TextMuted}>
          {`Sv.${item.requiredLevel}`}
        </T>
      </Row>

      <T size={11} weight="semibold" color={rc} lines={2} align="center">
        {item.name}
      </T>

      <T size={8} color={TextMuted} lines={1}>
        {item.slot.displayName.split(' ')[0]}
      </T>
    </Surface>
  );
}

/**
 * Çanta ızgarasındaki boş kare yuva.
 */
function EmptyInventorySlotBox({ index }) {
  return (
    <Surface
      radius={8}
      color={alpha(DarkBg, 0.5)}
      borderColor={alpha(DarkBorder, 0.4)}
      borderWidth={1}
      align="center"
      justify="center"
      style={{ aspectRatio: 1 }}
      hidden
    >
      <T color={DarkBorder} size={14}>
        —
      </T>
    </Surface>
  );
}

/** İksir kullanılabilir mi (ConsumableDetailDialog ile aynı kural). */
function iksirDurumu(item, player) {
  const isLevelMet = player.level >= item.requiredLevel;
  const canHeal = player.currentHealth < player.totalStats.maxHealth && item.healAmount > 0;
  const canApplyBuff = item.buffEffect != null;
  const canUse = isLevelMet && (canHeal || canApplyBuff);
  let actionText;
  switch (item.usableCategory) {
    case UsableCategory.OINTMENT:
      actionText = 'Silaha / Zırha Sür';
      break;
    case UsableCategory.PEHLIVAN_OIL:
      actionText = 'Adeleye Sür / Yağlan';
      break;
    default:
      actionText = 'İç / Tüket';
  }
  return { isLevelMet, canHeal, canApplyBuff, canUse, actionText };
}

/**
 * İksir & Tüketim Eşyaları Izgarası.
 */
function ConsumablesGridView({ consumables, player, onConsumableClick, onUse }) {
  if (consumables.length === 0) {
    return (
      <Box style={{ flex: 1 }} align="center" justify="center">
        <T color={TextMuted} align="center" size={14}>
          {'Hiç şifa merhemi veya iksiriniz kalmadı.\nAktardan veya hekimden temin edebilirsiniz.'}
        </T>
      </Box>
    );
  }
  return (
    <Scroll>
      <Grid
        columns={3}
        gap={8}
        data={consumables}
        renderItem={(conItem) => {
          const d = player ? iksirDurumu(conItem, player) : null;
          const actions = onUse && d && d.canUse ? [{ name: 'kullan', label: d.actionText, run: () => onUse(conItem) }] : undefined;
          return (
            <Surface
              radius={8}
              color={DarkSurfaceCard}
              borderColor={alpha(HealthGreen, 0.5)}
              borderWidth={1}
              pad={6}
              align="center"
              justify="between"
              style={{ aspectRatio: 0.9 }}
              onPress={() => onConsumableClick(conItem)}
              label={`${conItem.name}, ${conItem.count} adet. İncelemek veya kullanmak için dokunun.`}
              actions={actions}
            >
              <T size={24}>{conItem.categoryIcon}</T>
              <T size={11} weight="bold" color={HealthGreen} lines={2} align="center">
                {conItem.name}
              </T>
              <Surface radius={4} color={DarkBg}>
                <T size={11} weight="bold" color={TextGold} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                  {`x${conItem.count}`}
                </T>
              </Surface>
            </Surface>
          );
        }}
      />
      <Spacer h={50} />
    </Scroll>
  );
}

/**
 * Eşya Detay Modalı (Üst Pencere):
 * VoiceOver bu pencereye odaklanır ve içeriği sırayla okur.
 */
function ItemDetailDialog({ item, isEquipped, playerLevel, onDismiss, onEquip, onUnequip, onChangeEquip, onSell = null }) {
  const rc = rarityColor(item);
  const canEquip = playerLevel >= item.requiredLevel;

  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      title={
        <Column heading label={`${item.name}, ${item.categoryDisplayName}, ${item.rarity.displayName}, Seviye ${item.requiredLevel}`}>
          <Row gap={6}>
            <T size={20}>{item.categoryIcon}</T>
            <T size={18} weight="bold" color={rc} style={{ flexShrink: 1 }}>
              {item.name}
            </T>
          </Row>
          <Spacer h={4} />
          <T size={12} color={TextMuted}>
            {`${item.categoryDisplayName} • ${item.rarity.displayName} • Sv. ${item.requiredLevel}`}
          </T>
        </Column>
      }
      text={
        <Column gap={8} style={{ alignSelf: 'stretch' }}>
          {/* Hikaye / Lore */}
          <T size={13} color={alpha(TextLight, 0.9)}>
            {item.description}
          </T>

          <Divider color={DarkBorder} />

          {/* Nitelikler */}
          <Column label={`Nitelik Bonusları: ${formatStats(item.stats)}`}>
            <T size={12} weight="bold" color={TextGold}>
              Nitelik Bonusları:
            </T>
            <T size={13} weight="semibold" color={AmberGold}>
              {formatStats(item.stats)}
            </T>
          </Column>

          {item.specialTrait != null ? (
            <Surface radius={6} color={color(0xff2b1b36)} borderColor={FamePurple} borderWidth={1} style={{ alignSelf: 'stretch' }}>
              <Column pad={8}>
                <T size={12} weight="bold" color={FamePurple}>
                  {`2. Özel Nitelik: ${item.specialTrait.name}`}
                </T>
                <Spacer h={2} />
                <T size={11} color={alpha(TextLight, 0.95)}>
                  {item.specialTrait.description}
                </T>
              </Column>
            </Surface>
          ) : null}

          {/* Yuva ve Taş Bilgisi */}
          {item.hasSockets ? (
            <Surface radius={6} color={DarkSurfaceCard} borderColor={alpha(AmberGold, 0.5)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
              <Column pad={8}>
                <T size={12} weight="bold" color={AmberGold} label={`Mücevher Yuvaları, ${item.sockets.length} / ${item.maxSockets} dolu`}>
                  {`Mücevher Yuvaları (${item.sockets.length}/${item.maxSockets}):`}
                </T>
                <Spacer h={4} />
                {item.sockets.length === 0 ? (
                  <T size={11} color={TextMuted}>
                    {`Bu eşyada ${item.maxSockets} boş yuva var. Taş Ustası Kael'de taş takabilirsiniz.`}
                  </T>
                ) : (
                  <>
                    {item.sockets.map((gem, idx) => (
                      <T key={idx} size={11} color={TextLight} label={`${idx + 1}. yuva: ${gem.type.displayName} Seviye ${gem.level}, ${gem.effectSummary}`}>
                        {`${idx + 1}. ${gem.displayName} -> ${gem.effectSummary}`}
                      </T>
                    ))}
                    {item.freeSockets > 0 ? (
                      <T size={11} color={TextMuted}>
                        {`+ ${item.freeSockets} Boş Yuva`}
                      </T>
                    ) : null}
                  </>
                )}
              </Column>
            </Surface>
          ) : null}

          {/* Yuva ve Değer */}
          <Row justify="between" wrap gap={4} style={{ alignSelf: 'stretch' }}>
            <T size={11} color={TextMuted}>
              {`Yuva: ${item.slot.displayName}`}
            </T>
            <T size={11} color={AmberGold} label={`Değer: ${item.valueInGold} Altın, Satış: ${item.sellPrice} Altın`}>
              {`Değer: ${item.valueInGold} Altın (Satış: ${item.sellPrice} Altın)`}
            </T>
          </Row>

          {!canEquip && !isEquipped ? (
            <T size={12} color={HealthRed} weight="semibold">
              {`Bu eşyayı kuşanabilmek için Seviye ${item.requiredLevel} olmalısınız!`}
            </T>
          ) : null}
        </Column>
      }
      confirm={
        isEquipped ? (
          <Row gap={6}>
            <OutlinedBtn onPress={onUnequip} color={HealthRed} label={`${item.name} Çıkar`}>
              Çıkar
            </OutlinedBtn>
            <Btn onPress={onChangeEquip} color={AmberGold} contentColor={DarkBg} label={`${item.slot.displayName} Değiştir`}>
              Değiştir
            </Btn>
          </Row>
        ) : (
          <Row gap={6} wrap>
            {onSell != null ? (
              <OutlinedBtn onPress={onSell} color={AmberGold} label={`Sat, artı ${item.sellPrice} Altın`}>
                {`Sat (+${item.sellPrice} Altın)`}
              </OutlinedBtn>
            ) : null}
            <Btn onPress={onEquip} disabled={!canEquip} color={AmberGold} contentColor={DarkBg} label={canEquip ? `${item.name} Kuşan` : `Kuşan, Seviye ${item.requiredLevel} gerekli`}>
              Kuşan
            </Btn>
          </Row>
        )
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
 * Yuvaya Özel Hızlı Kuşanma Modalı:
 * Karakter yuvasına dokunulduğunda yalnızca o yuvaya takılabilecek eşyaları listeler.
 * children: bu pencerenin üstünde açılacak alt pencere (incelenen eşya).
 */
function SlotQuickEquipDialog({ slot, matchingItems, playerLevel, onDismiss, onEquip, onInspect, children }) {
  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      title={
        <Row heading label={`${slot.displayName} Kuşan`}>
          <T size={20}>{``}</T>
          <T size={17} weight="bold" color={TextGold} style={{ flexShrink: 1 }}>
            {`${slot.displayName} Kuşan`}
          </T>
        </Row>
      }
      text={
        <Column style={{ alignSelf: 'stretch' }}>
          {matchingItems.length === 0 ? (
            <Column style={{ paddingVertical: 12 }}>
              <T color={TextMuted} size={13}>
                Çantanızda bu yuvaya takabileceğiniz bir eşya bulunmuyor.
              </T>
              <Spacer h={6} />
              <T color={TextLight} size={12}>
                Demirciden veya kasabadaki satıcılardan yeni donanımlar edinebilirsiniz.
              </T>
            </Column>
          ) : (
            <Column gap={8} style={{ alignSelf: 'stretch' }}>
              <T size={12} color={TextMuted}>
                {`Çantanızdaki Uygun Donanımlar (${matchingItems.length}):`}
              </T>
              {matchingItems.map((item, i) => {
                const canEquip = playerLevel >= item.requiredLevel;
                const rc = rarityColor(item);
                return (
                  <Card key={item.id ?? i} color={DarkSurfaceCard} radius={8} borderColor={alpha(rc, 0.5)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
                    <Row pad={8} justify="between" gap={4} style={{ alignSelf: 'stretch' }}>
                      <Column
                        style={{ flex: 1 }}
                        label={`${item.name}, ${item.rarity.displayName}, ${formatStats(item.stats)}, ${item.categoryDisplayName}, Seviye ${item.requiredLevel}`}
                      >
                        <T size={13} weight="bold" color={rc}>
                          {item.name}
                        </T>
                        <T size={10} color={TextMuted}>
                          {`${item.categoryDisplayName} • Sv. ${item.requiredLevel}`}
                        </T>
                        <T size={11} color={AmberGold}>
                          {formatStats(item.stats)}
                        </T>
                      </Column>
                      <Row gap={4}>
                        <IconBtn onPress={() => onInspect(item)} label={`${item.name} İncele`}>
                          
                        </IconBtn>
                        <Btn
                          onPress={() => onEquip(item)}
                          disabled={!canEquip}
                          color={AmberGold}
                          contentColor={DarkBg}
                          pad={8}
                          label={canEquip ? `${item.name} Kuşan` : `Kuşan, Seviye ${item.requiredLevel} gerekli`}
                        >
                          <T size={11} weight="bold" color={canEquip ? DarkBg : TextMuted}>
                            Kuşan
                          </T>
                        </Btn>
                      </Row>
                    </Row>
                  </Card>
                );
              })}
            </Column>
          )}
          {children}
        </Column>
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
 * Tüketim & İksir Detay Modalı:
 */
function ConsumableDetailDialog({ item, player, onDismiss, onUse }) {
  const { isLevelMet, canHeal, canApplyBuff, canUse, actionText } = iksirDurumu(item, player);
  const buttonLabel = !isLevelMet ? `Seviye Yetersiz (${item.requiredLevel})` : !canHeal && !canApplyBuff ? 'Canın Zaten Dolu' : actionText;

  return (
    <AlertDialog
      onDismiss={onDismiss}
      containerColor={DarkSurface}
      title={
        <Row heading label={`${item.name}, ${item.count} adet`}>
          <T size={20}>{``}</T>
          <T size={17} weight="bold" color={HealthGreen} style={{ flexShrink: 1 }}>
            {`${item.name} (x${item.count})`}
          </T>
        </Row>
      }
      text={
        <Column gap={8} style={{ alignSelf: 'stretch' }}>
          <T size={12} color={TextMuted}>
            {`${item.categoryDisplayName} • Adet: ${item.count}`}
          </T>
          <T size={13} color={alpha(TextLight, 0.9)}>
            {item.description}
          </T>

          {item.requiredLevel > 1 ? (
            <Row justify="between" style={{ alignSelf: 'stretch' }} label={`Gereken Seviye: Seviye ${item.requiredLevel}${isLevelMet ? '' : ', yetersiz'}`}>
              <T size={12} color={TextMuted}>
                Gereken Seviye:
              </T>
              <T size={12} weight="bold" color={isLevelMet ? HealthGreen : color(0xffff6b6b)}>
                {`Seviye ${item.requiredLevel}`}
              </T>
            </Row>
          ) : null}

          {item.healAmount > 0 ? (
            <Surface radius={4} color={alpha(HealthGreen, 0.2)} borderColor={HealthGreen} borderWidth={1} style={{ alignSelf: 'flex-start' }}>
              <T size={12} weight="bold" color={HealthGreen} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                {`+${item.healAmount} Can Sağaltır`}
              </T>
            </Surface>
          ) : null}

          {item.buffEffect != null ? (
            <Surface radius={6} color={alpha(AmberGold, 0.15)} borderColor={AmberGold} borderWidth={1} style={{ alignSelf: 'stretch' }}>
              <Column pad={8}>
                <T size={12} weight="bold" color={AmberGold}>
                  {`${item.buffEffect.name} (Süre: ${item.buffEffect.remainingBattles} Dövüş)`}
                </T>
                <Spacer h={2} />
                <T size={11} color={alpha(TextLight, 0.9)}>
                  {item.buffEffect.description}
                </T>
              </Column>
            </Surface>
          ) : null}
        </Column>
      }
      confirm={
        <Btn onPress={onUse} disabled={!canUse} color={HealthGreen} contentColor={Color.White} disabledColor={DarkSurfaceCard} disabledContentColor={TextMuted}>
          <T weight="bold" color={canUse ? Color.White : TextMuted}>
            {buttonLabel}
          </T>
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

function StatLabel({ title, value }) {
  return (
    <Column>
      <T size={11} color={TextMuted}>
        {title}
      </T>
      <T size={14} weight="bold" color={TextLight}>
        {value}
      </T>
    </Column>
  );
}

function formatStats(stats) {
  const list = [];
  if (stats.damage > 0) list.push(`+${stats.damage} Hasar`);
  if (stats.armor > 0) list.push(`+${stats.armor} Zırh`);
  if (stats.maxHealth > 0) list.push(`+${stats.maxHealth} Can`);
  if (stats.speed > 0) list.push(`+${stats.speed} Hız`);
  if (stats.dodgeChancePercent > 0) list.push(`+%${stats.dodgeChancePercent} Sıyrılma`);
  if (stats.critChancePercent > 0) list.push(`+%${stats.critChancePercent} Kritik`);
  if (stats.blockChancePercent > 0) list.push(`+%${stats.blockChancePercent} Blok`);
  return list.length === 0 ? 'Temel Nitelik' : list.join(' • ');
}

export function SkillOrbsView({ player, viewModel }) {
  const allSkills = StarterSkills.ALL_SKILLS;
  const equippedIds = player.equippedSkillIds;

  const [selectedSkillDetail, setSelectedSkillDetail] = useState(null);

  const chunkedSkills = kt.chunked(allSkills, 3);

  const yuvalar = [];
  for (let slotIdx = 0; slotIdx <= 3; slotIdx++) {
    const equippedSkillId = kt.getOrNull(equippedIds, slotIdx);
    const equippedSkill = equippedSkillId != null ? StarterSkills.getSkillById(equippedSkillId) : null;
    yuvalar.push(
      <Surface
        key={slotIdx}
        radius={8}
        color={equippedSkill != null ? DarkSurface : alpha(DarkBg, 0.6)}
        borderColor={equippedSkill != null ? AmberGold : DarkBorder}
        borderWidth={equippedSkill != null ? 1.5 : 1}
        pad={4}
        align="center"
        justify="between"
        style={{ flex: 1, height: 96 }}
        onPress={equippedSkill != null ? () => viewModel.unequipSkillFromSlot(slotIdx) : undefined}
        label={equippedSkill != null ? `Yuva ${slotIdx + 1}: ${equippedSkill.name}. Yuvadan çıkarmak için dokunun.` : `Yuva ${slotIdx + 1}: Boş Yuva`}
      >
        <T size={10} weight="bold" color={equippedSkill != null ? AmberGold : TextMuted}>
          {`Yuva ${slotIdx + 1}`}
        </T>

        {equippedSkill != null ? (
          <>
            <T size={20}>{equippedSkill.icon}</T>
            <T size={9} weight="bold" color={Color.White} lines={1}>
              {equippedSkill.name}
            </T>
            <Surface radius={3} color={color(0xff6b1d1d)} style={{ marginBottom: 2 }}>
              <T size={8} weight="bold" color={Color.White} style={{ paddingHorizontal: 4, paddingVertical: 1 }}>
                Çıkar ✕
              </T>
            </Surface>
          </>
        ) : (
          <>
            
            <T size={9} color={TextMuted}>
              Boş Yuva
            </T>
            <T size={8} color={AmberGoldDark}>
              Seç
            </T>
          </>
        )}
      </Surface>
    );
  }

  // Yetenek İnceleme & Kuşanma Modalı
  let pencere = null;
  if (selectedSkillDetail != null) {
    const skill = selectedSkillDetail;
    const isEquipped = equippedIds.includes(skill.id);
    const slotNumber = isEquipped ? equippedIds.indexOf(skill.id) + 1 : null;
    pencere = (
      <AlertDialog
        onDismiss={() => setSelectedSkillDetail(null)}
        containerColor={DarkSurface}
        confirm={
          <Btn
            onPress={() => {
              viewModel.toggleEquipSkill(skill.id);
              setSelectedSkillDetail(null);
            }}
            color={isEquipped ? color(0xff6b1d1d) : AmberGold}
            contentColor={isEquipped ? Color.White : DarkBg}
            radius={8}
            label={isEquipped ? 'Yuvadan Çıkar, Yedeğe Al' : 'Savaş Yuvasına Yerleştir'}
          >
            <T weight="bold" color={isEquipped ? Color.White : DarkBg}>
              {isEquipped ? '✕ Yuvadan Çıkar (Yedeğe Al)' : 'Savaş Yuvasına Yerleştir'}
            </T>
          </Btn>
        }
        dismiss={
          <TextBtn onPress={() => setSelectedSkillDetail(null)} contentColor={TextMuted}>
            Kapat
          </TextBtn>
        }
        title={
          <Row gap={10} heading label={`${skill.name}, ${isEquipped ? `Savaş Yuvası ${slotNumber}'de Kuşanıldı` : 'Yedek Kulübesinde'}`}>
            <T size={28}>{skill.icon}</T>
            <Column style={{ flex: 1 }}>
              <T size={16} weight="bold" color={AmberGold}>
                {skill.name}
              </T>
              {isEquipped ? (
                <T size={11} weight="semibold" color={HealthGreen}>
                  {`Savaş Yuvası ${slotNumber}'de Kuşanıldı`}
                </T>
              ) : (
                <T size={11} color={TextMuted}>
                  Yedek Kulübesinde
                </T>
              )}
            </Column>
          </Row>
        }
        text={
          <Column gap={10} style={{ alignSelf: 'stretch' }}>
            <T size={13} color={TextLight} lineHeight={18}>
              {skill.description}
            </T>
            <Surface radius={8} color={DarkSurfaceCard} borderColor={alpha(AmberGoldDark, 0.5)} borderWidth={1} style={{ alignSelf: 'stretch' }}>
              <Column pad={10}>
                <T size={11} weight="bold" color={TextGold}>
                  Tetiklenme Koşulu:
                </T>
                <T size={11} color={alpha(TextLight, 0.9)}>
                  {skill.triggerConditionText}
                </T>
                <Spacer h={6} />
                <T size={11} weight="bold" color={HealthGreen}>
                  Muharebe Etkisi:
                </T>
                <T size={11} weight="semibold" color={Color.White}>
                  {skill.effectSummary}
                </T>
              </Column>
            </Surface>
          </Column>
        }
      />
    );
  }

  return (
    <>
      <Scroll gap={12}>
        {/* 1. Dövüş Yetenekleri Başlığı & 4 Savaş Yuvası Rehberi */}
        <Surface radius={12} color={DarkSurfaceCard} borderColor={alpha(AmberGold, 0.7)} borderWidth={1.5} style={{ alignSelf: 'stretch' }}>
          <Column pad={14}>
            <Row gap={10}>
              
              <Column style={{ flex: 1 }}>
                <T heading size={16} weight="bold" color={AmberGold}>
                  Dövüş Yetenekleri & 4 Savaş Yuvası
                </T>
                <T size={11} color={TextMuted}>
                  Yalnızca aktif 4 yuvaya yerleştirilen teknikler arenada kullanılır!
                </T>
              </Column>
            </Row>

            <Spacer h={10} />
            <T size={11} color={alpha(TextLight, 0.85)} lineHeight={16}>
              Kadim Doğu tomarlarını Bilge Jin-Zhen'e deşifre ettirerek veya Taş Hisar'da idman yaparak kazandığın hünerleri bu 4 yuvaya kuşanabilirsin. Yedekteki yetenekler savaşlara etki etmez.
            </T>

            <Spacer h={14} />

            {/* 4 AKTİF SAVAŞ YUVASI (1, 2, 3, 4) */}
            <T heading size={12} weight="bold" color={AmberGoldDark}>
              {`Aktif Savaş Yuvaları (${equippedIds.length} / 4 Dolu):`}
            </T>
            <Spacer h={6} />

            <Row gap={6} style={{ alignSelf: 'stretch' }}>
              {yuvalar}
            </Row>
          </Column>
        </Surface>

        {/* 2. Yetenek Izgarası (3 Kolonlu Kompakt Menü) */}
        <T heading size={13} weight="bold" color={AmberGold} style={{ paddingTop: 4 }}>
          {`Dövüş Sanatları Kitaplığı (${kumeBoyu(player.unlockedSkillIds)} / ${allSkills.length} Açık):`}
        </T>

        {chunkedSkills.map((rowSkills, chunkIdx) => (
          <Row key={chunkIdx} gap={8} align="stretch" style={{ alignSelf: 'stretch' }}>
            {rowSkills.map((skill) => {
              const isUnlocked = kumedeMi(player.unlockedSkillIds, skill.id);
              const isEquipped = equippedIds.includes(skill.id);
              const slotNumber = isEquipped ? equippedIds.indexOf(skill.id) + 1 : null;
              const actions = isUnlocked
                ? [
                    {
                      name: 'yuva',
                      label: isEquipped ? 'Yuvadan Çıkar' : 'Savaş Yuvasına Yerleştir',
                      run: () => viewModel.toggleEquipSkill(skill.id),
                    },
                  ]
                : undefined;
              return (
                <Card
                  key={skill.id}
                  color={isEquipped ? DarkSurfaceCard : isUnlocked ? alpha(DarkSurface, 0.9) : color(0xff141210)}
                  radius={10}
                  borderColor={isEquipped ? AmberGold : isUnlocked ? alpha(color(0xff388e3c), 0.8) : alpha(DarkBorder, 0.35)}
                  borderWidth={isEquipped ? 2 : 1}
                  pad={6}
                  align="center"
                  justify="between"
                  style={{ flex: 1, height: 115 }}
                  onPress={isUnlocked ? () => setSelectedSkillDetail(skill) : undefined}
                  label={
                    isUnlocked ? `${skill.name}, ${isEquipped ? `Yuva ${slotNumber}'de kuşanıldı.` : 'Yedekte.'} Detay için dokunun.` : 'Kilitli yetenek. Basılamaz.'
                  }
                  actions={actions}
                >
                  {/* Üst Rozet / Durum */}
                  {isEquipped ? (
                    <Surface radius={4} color={alpha(HealthGreen, 0.25)} borderColor={HealthGreen} borderWidth={1}>
                      <T size={8} weight="bold" color={HealthGreen} style={{ paddingHorizontal: 4, paddingVertical: 1 }}>
                        {`YUVA ${slotNumber}`}
                      </T>
                    </Surface>
                  ) : isUnlocked ? (
                    <Surface radius={4} color={alpha(DarkBg, 0.6)} borderColor={alpha(TextMuted, 0.5)} borderWidth={1}>
                      <T size={8} weight="semibold" color={TextMuted} style={{ paddingHorizontal: 4, paddingVertical: 1 }}>
                        YEDEK
                      </T>
                    </Surface>
                  ) : (
                    <Surface radius={4} color={alpha(Color.Black, 0.4)}>
                      <T size={8} weight="normal" color={Color.Gray} style={{ paddingHorizontal: 4, paddingVertical: 1 }}>
                        KİLİTLİ
                      </T>
                    </Surface>
                  )}

                  {/* İkon Dairesi */}
                  <Box
                    align="center"
                    justify="center"
                    radius={19}
                    color={isEquipped ? alpha(AmberGold, 0.25) : isUnlocked ? alpha(HealthGreen, 0.15) : alpha(Color.Black, 0.5)}
                    borderColor={isEquipped ? AmberGold : isUnlocked ? color(0xff81c784) : Color.DarkGray}
                    borderWidth={1.5}
                    style={{ width: 38, height: 38 }}
                  >
                    <T size={18}>{isUnlocked ? skill.icon : ''}</T>
                  </Box>

                  {/* İsim & İpucu */}
                  <Column align="center">
                    <T size={10} weight="bold" color={isUnlocked ? (isEquipped ? AmberGold : Color.White) : Color.Gray} lines={1}>
                      {isUnlocked ? skill.name : '???'}
                    </T>
                    <T size={7.5} color={isUnlocked ? AmberGoldDark : Color.DarkGray} lines={1}>
                      {isUnlocked ? 'Detay İçin Dokun' : skill.requiredSessions > 0 ? `${skill.requiredSessions} Seans` : 'Mühürlü Tomar'}
                    </T>
                  </Column>
                </Card>
              );
            })}
            {kt.listOfSize(3 - rowSkills.length, (i) => (
              <Spacer key={`b${i}`} flex />
            ))}
          </Row>
        ))}
      </Scroll>

      {pencere}
    </>
  );
}
