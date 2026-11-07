// Diyarın Kaderi arayüz kiti: Jetpack Compose bileşenlerinin React Native karşılıkları, VoiceOver öncelikli.
//
// KULLANIM ÖZETİ (Compose → kit):
//   Column/Row/Box ......... <Column gap={8} align="center" justify="between" style={...}>  (gap = Arrangement.spacedBy)
//                            align: 'start'|'center'|'end'|'stretch'  justify: 'start'|'center'|'end'|'between'|'around'|'evenly'
//                            Modifier.weight(1f) → style={{ flex: 1 }}; fillMaxWidth → style={{ alignSelf: 'stretch' }} ya da width:'100%'
//                            padding(12.dp) → pad={12} ya da style={{ padding: 12 }}; background+clip+border → style
//   Surface/Card ........... <Surface color={DarkSurface} radius={12} borderColor={DarkBorder} borderWidth={1} pad={12}>
//                            <Card> = Surface, varsayılan DarkSurfaceCard zemin, 12 köşe, DarkBorder kenar
//   Spacer ................. <Spacer h={6} /> <Spacer w={8} /> <Spacer flex /> (weight)
//   Text ................... <T size={12} weight="bold" color={HealthGreen} align="center" italic serif lines={2}>metin</T>
//                            weight: 'normal'|'medium'|'semibold'|'bold'|'black'. Varsayılan 14, TextLight.
//                            Typography: <T style={Typography.titleLarge}>
//   Button ................. <Btn onPress={...} disabled color={AmberGold} contentColor={DarkBg}>Satın Al</Btn>
//   OutlinedButton ......... <OutlinedBtn ...>   TextButton → <TextBtn ...>   IconButton → <IconBtn label="Kapat" onPress>{<Ikon name="Close"/>}</IconBtn>
//   Divider ................ <Divider color={DarkBorder} thickness={1} />
//   Column+verticalScroll .. <Scroll style contentStyle>   LazyColumn çok elemanlı → <LazyList data={liste} keyOf={x=>x.id} renderItem={(x,i)=>...} />
//   LazyVerticalGrid ....... <Grid columns={3} gap={8} data={liste} renderItem={(x,i)=>...} />
//   AlertDialog ............ <AlertDialog onDismiss title="Başlık" text={<T>..</T> ya da 'metin'} confirm={<TextBtn ..>Tamam</TextBtn>} dismiss={...} />
//   Dialog ................. <Dialog onDismiss>{içerik}</Dialog>   (her ikisi de VoiceOver için modal)
//   LinearProgressIndicator  <Progress value={0.4} color={HealthRed} track={DarkBorder} height={8} label="Can yüzde 40" />
//   CircularProgress ....... <Spinner color={AmberGold} size={48} />
//   FilterChip ............. <Chip selected={x} onPress={...}>Kılıçlar</Chip>
//   TabRow/Tab ............. <Tabs titles={['A','B']} selected={i} onSelect={setI} scrollable />
//   Switch ................. <Toggle value={v} onChange={setV} label="Müzik" />
//   Slider ................. <Slider value={v} onChange={setV} min={0} max={1} step={0.05} label="Müzik sesi" valueText={`%${Math.round(v*100)}`} />
//   TextField .............. <Field value={s} onChange={setS} label="Adın" placeholder="..." maxLength={20} />
//   Icon ................... <Ikon name="Home" size={20} color={AmberGold} />  (dekoratif; VoiceOver okumaz)
//   Image .................. <Img source={R.drawable.main_menu_bg} style={{ width: '100%', height: 200 }} resizeMode="cover" />
//   Brush gradient zemin ... <Gradient colors={[a, b]} horizontal style>...</Gradient>
//   Kök ekran .............. <Screen>...</Screen> (güvenli alan + DarkBg)
//   Snackbar/Toast ......... showSnack('mesaj')  (kökte <SnackHost/> var; VoiceOver da okur)
//   collectAsState ......... const player = useFlow(viewModel.player)
//
// ERİŞİLEBİLİRLİK PROPLARI (Column/Row/Box/Surface/Card ve T için):
//   label="..."      contentDescription / clearAndSetSemantics: öğe tek parça olur, VoiceOver bu metni okur.
//   onPress={fn}     clickable: düğme olur. label verilmezse VoiceOver içindeki metinleri birleştirip okur.
//   heading          semantics { heading() }
//   live             liveRegion: label (ya da T'nin metni) değişince VoiceOver duyurur.
//   selected, disabled, hint="..."  durum bilgisi.
//   hidden           VoiceOver'dan gizle (dekoratif öğe).
//   modal            Dialog dışı tam ekran örtüler için: altındakiler VoiceOver'dan gizlenir.
//   announce('metin') doğrudan duyuru.
import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  FlatList,
  Modal,
  Switch,
  TextInput,
  Image,
  ActivityIndicator,
  AccessibilityInfo,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AmberGold, AmberGoldDark, DarkBg, DarkBorder, DarkSurface, DarkSurfaceCard, TextGold, TextLight, TextMuted, SerifFont } from './theme.js';

// ---------------------------------------------------------------------------
// Akış kancası
// ---------------------------------------------------------------------------
/** StateFlow.collectAsState() karşılığı. */
export function useFlow(flow) {
  return useSyncExternalStore(
    (f) => (flow ? flow.subscribe(f) : () => {}),
    () => (flow ? flow.value : undefined),
    () => (flow ? flow.value : undefined)
  );
}

// ---------------------------------------------------------------------------
// Duyurular
// ---------------------------------------------------------------------------
let sonDuyuru = { metin: '', zaman: 0 };
/** VoiceOver'a metin okut (kuyruğa ekler, konuşmayı kesmez). */
export function announce(metin) {
  if (!metin) return;
  const simdi = Date.now();
  if (sonDuyuru.metin === metin && simdi - sonDuyuru.zaman < 700) return;
  sonDuyuru = { metin, zaman: simdi };
  try {
    if (Platform.OS === 'ios' && AccessibilityInfo.announceForAccessibilityWithOptions) {
      AccessibilityInfo.announceForAccessibilityWithOptions(metin, { queue: true });
    } else {
      AccessibilityInfo.announceForAccessibility(metin);
    }
  } catch (e) {}
}

/** React çocuklarındaki düz metinleri birleştirir (düğme etiketi için). */
export function metinTopla(c) {
  if (c == null || c === false || c === true) return '';
  if (typeof c === 'string' || typeof c === 'number') return String(c);
  if (Array.isArray(c)) return c.map(metinTopla).filter(Boolean).join(' ');
  if (c.props) {
    if (c.props.hidden) return '';
    if (c.props.label) return c.props.label;
    return metinTopla(c.props.children);
  }
  return '';
}

function useCanliDuyuru(acik, metin) {
  const ilk = useRef(true);
  useEffect(() => {
    if (!acik) return;
    if (ilk.current) {
      ilk.current = false;
      return;
    }
    if (metin) announce(metin);
  }, [acik, metin]);
}

// ---------------------------------------------------------------------------
// Yerleşim
// ---------------------------------------------------------------------------
const HIZA = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline' };
const YASLA = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  spaceEvenly: 'space-evenly',
};

function erisimProplari(p, varsayilanEtiket) {
  const o = {};
  const etiket = p.label != null ? String(p.label) : null;
  if (p.hidden) {
    o.accessibilityElementsHidden = true;
    o.importantForAccessibility = 'no-hide-descendants';
    return o;
  }
  if (etiket || p.onPress || p.heading) {
    o.accessible = true;
    if (etiket) o.accessibilityLabel = etiket;
    else if (varsayilanEtiket) o.accessibilityLabel = varsayilanEtiket;
  }
  if (p.onPress) o.accessibilityRole = p.role || 'button';
  else if (p.heading) o.accessibilityRole = 'header';
  else if (p.role) o.accessibilityRole = p.role;
  if (p.hint) o.accessibilityHint = p.hint;
  const durum = {};
  if (p.selected != null) durum.selected = !!p.selected;
  if (p.disabled) durum.disabled = true;
  if (p.checked != null) durum.checked = !!p.checked;
  if (Object.keys(durum).length) o.accessibilityState = durum;
  if (p.modal) o.accessibilityViewIsModal = true;
  if (p.actions) {
    o.accessibilityActions = p.actions.map((a) => ({ name: a.name, label: a.label }));
    o.onAccessibilityAction = (e) => {
      const a = p.actions.find((x) => x.name === e.nativeEvent.actionName);
      if (a && a.run) a.run();
    };
  }
  return o;
}

function kutuStili(p, yon) {
  const st = { flexDirection: yon };
  if (p.gap != null) st.gap = p.gap;
  if (p.align) st.alignItems = HIZA[p.align] || p.align;
  if (p.justify) st.justifyContent = YASLA[p.justify] || p.justify;
  if (p.pad != null) st.padding = p.pad;
  if (p.color) st.backgroundColor = p.color;
  if (p.radius != null) {
    st.borderRadius = p.radius;
    st.overflow = 'hidden';
  }
  if (p.borderColor) {
    st.borderColor = p.borderColor;
    st.borderWidth = p.borderWidth != null ? p.borderWidth : 1;
  } else if (p.borderWidth) st.borderWidth = p.borderWidth;
  if (p.fill) st.flex = 1;
  if (p.wrap) st.flexWrap = 'wrap';
  if (p.disabled && p.onPress && p.dimDisabled !== false) st.opacity = 0.5;
  return st;
}

function Kutu(p, yon) {
  const { children, style, onPress, onLongPress, disabled, live, label } = p;
  useCanliDuyuru(!!live, live ? label || metinTopla(children) : null);
  const st = [kutuStili(p, yon), style];
  const er = erisimProplari(p);
  if (onPress || onLongPress) {
    return (
      <Pressable
        {...er}
        onPress={disabled ? undefined : onPress}
        onLongPress={disabled ? undefined : onLongPress}
        disabled={!!disabled}
        style={({ pressed }) => [st, pressed && !disabled ? { opacity: 0.75 } : null]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View {...er} style={st} pointerEvents={p.pointerEvents}>
      {children}
    </View>
  );
}

export function Column(p) {
  return Kutu(p, 'column');
}
export function Row(p) {
  return Kutu({ align: 'center', ...p }, 'row');
}
export function Box(p) {
  return Kutu(p, 'column');
}
export function Surface(p) {
  return Kutu(p, 'column');
}
export function Card(p) {
  return Kutu({ color: DarkSurfaceCard, radius: 12, borderColor: DarkBorder, borderWidth: 1, ...p }, 'column');
}

export function Spacer({ h, w, flex }) {
  const st = {};
  if (h != null) st.height = h;
  if (w != null) st.width = w;
  if (flex) st.flex = typeof flex === 'number' ? flex : 1;
  return <View style={st} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />;
}

export function Divider({ color = DarkBorder, thickness = 1, vertical, style }) {
  const st = vertical ? { width: thickness, alignSelf: 'stretch', backgroundColor: color } : { height: thickness, alignSelf: 'stretch', backgroundColor: color };
  return <View style={[st, style]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />;
}

// ---------------------------------------------------------------------------
// Metin
// ---------------------------------------------------------------------------
const AGIRLIK = { thin: '100', light: '300', normal: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800', black: '900' };
export function T(p) {
  const { children, size, weight, color, align, italic, serif, lines, lineHeight, letterSpacing, style, label, live, hidden, heading, onPress, mono, underline } = p;
  useCanliDuyuru(!!live, live ? label || metinTopla(children) : null);
  const st = { color: color || TextLight, fontSize: size || 14 };
  if (weight) st.fontWeight = AGIRLIK[String(weight).toLowerCase()] || String(weight);
  if (align) st.textAlign = align;
  if (italic) st.fontStyle = 'italic';
  if (serif) st.fontFamily = SerifFont;
  if (mono) st.fontFamily = Platform.OS === 'ios' ? 'Menlo' : 'monospace';
  if (lineHeight) st.lineHeight = lineHeight;
  if (letterSpacing != null) st.letterSpacing = letterSpacing;
  if (underline) st.textDecorationLine = 'underline';
  const er = {};
  if (hidden) {
    er.accessibilityElementsHidden = true;
    er.importantForAccessibility = 'no-hide-descendants';
  } else {
    if (label) {
      er.accessible = true;
      er.accessibilityLabel = String(label);
    }
    if (heading) er.accessibilityRole = 'header';
    if (onPress) er.accessibilityRole = 'button';
  }
  return (
    <Text {...er} style={[st, style]} numberOfLines={lines} onPress={onPress}>
      {children}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// Düğmeler
// ---------------------------------------------------------------------------
function dugmeIcerik(children, renk, boyut) {
  const tekMetin = typeof children === 'string' || typeof children === 'number' || (Array.isArray(children) && children.every((c) => typeof c === 'string' || typeof c === 'number'));
  if (tekMetin) {
    return (
      <Text style={{ color: renk, fontSize: boyut || 14, fontWeight: '600', textAlign: 'center' }}>
        {Array.isArray(children) ? children.join('') : children}
      </Text>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
      {React.Children.map(children, (c) =>
        typeof c === 'string' || typeof c === 'number' ? <Text style={{ color: renk, fontSize: boyut || 14, fontWeight: '600', textAlign: 'center' }}>{c}</Text> : c
      )}
    </View>
  );
}

function TemelDugme(p, tur) {
  const { onPress, onLongPress, disabled, children, style, label, hint, selected, textSize, pad } = p;
  let zemin = 'transparent';
  let yazi = AmberGold;
  let kenar = null;
  if (tur === 'dolu') {
    zemin = p.color || AmberGold;
    yazi = p.contentColor || DarkBg;
  } else if (tur === 'cizgili') {
    kenar = p.borderColor || p.color || AmberGold;
    yazi = p.contentColor || p.color || AmberGold;
    if (p.containerColor) zemin = p.containerColor;
  } else {
    yazi = p.contentColor || p.color || AmberGold;
  }
  if (disabled) {
    if (tur === 'dolu') {
      zemin = p.disabledColor || '#3A342C';
      yazi = p.disabledContentColor || TextMuted;
    } else yazi = TextMuted;
  }
  const st = {
    backgroundColor: zemin,
    borderRadius: p.radius != null ? p.radius : tur === 'ikon' ? 22 : 10,
    paddingVertical: pad != null ? pad : tur === 'ikon' ? 6 : 10,
    paddingHorizontal: pad != null ? pad : tur === 'ikon' ? 6 : 14,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  };
  if (kenar) {
    st.borderWidth = p.borderWidth || 1;
    st.borderColor = disabled ? DarkBorder : kenar;
  }
  const etiket = label || metinTopla(children) || undefined;
  const durum = { disabled: !!disabled };
  if (selected != null) durum.selected = !!selected;
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={etiket}
      accessibilityHint={hint}
      accessibilityState={durum}
      onPress={disabled ? undefined : onPress}
      onLongPress={disabled ? undefined : onLongPress}
      disabled={!!disabled}
      style={({ pressed }) => [st, style, pressed && !disabled ? { opacity: 0.7 } : null]}
    >
      {dugmeIcerik(children, yazi, textSize)}
    </Pressable>
  );
}
export function Btn(p) {
  return TemelDugme(p, 'dolu');
}
export function OutlinedBtn(p) {
  return TemelDugme(p, 'cizgili');
}
export function TextBtn(p) {
  return TemelDugme(p, 'yazi');
}
export function IconBtn(p) {
  return TemelDugme(p, 'ikon');
}

// ---------------------------------------------------------------------------
// Kaydırma ve listeler
// ---------------------------------------------------------------------------
export const Scroll = React.forwardRef(function Scroll({ children, style, contentStyle, horizontal, gap, pad, onScroll }, ref) {
  const ic = [];
  if (gap != null) ic.push({ gap });
  if (pad != null) ic.push({ padding: pad });
  if (contentStyle) ic.push(contentStyle);
  return (
    <ScrollView
      ref={ref}
      horizontal={!!horizontal}
      style={[horizontal ? null : { flex: 1 }, style]}
      contentContainerStyle={ic}
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={onScroll ? 32 : undefined}
    >
      {children}
    </ScrollView>
  );
});

export function LazyList({ data, renderItem, keyOf, style, contentStyle, header, footer, gap, horizontal, empty }) {
  return (
    <FlatList
      data={data}
      horizontal={!!horizontal}
      keyExtractor={(x, i) => (keyOf ? String(keyOf(x, i)) : String(i))}
      renderItem={({ item, index }) => renderItem(item, index)}
      ItemSeparatorComponent={gap ? () => <View style={horizontal ? { width: gap } : { height: gap }} /> : undefined}
      ListHeaderComponent={header || null}
      ListFooterComponent={footer || null}
      ListEmptyComponent={empty || null}
      style={[horizontal ? null : { flex: 1 }, style]}
      contentContainerStyle={contentStyle}
      initialNumToRender={20}
      windowSize={15}
      keyboardShouldPersistTaps="handled"
    />
  );
}

/** LazyVerticalGrid(GridCells.Fixed(n)) karşılığı (kaydırmasız; dış Scroll içinde kullanılır). */
export function Grid({ columns = 2, data, renderItem, gap = 8, style }) {
  const satirlar = [];
  for (let i = 0; i < data.length; i += columns) satirlar.push(data.slice(i, i + columns));
  return (
    <View style={[{ gap }, style]}>
      {satirlar.map((s, si) => (
        <View key={si} style={{ flexDirection: 'row', gap }}>
          {s.map((x, j) => (
            <View key={j} style={{ flex: 1 }}>
              {renderItem(x, si * columns + j)}
            </View>
          ))}
          {s.length < columns ? Array.from({ length: columns - s.length }).map((_, k) => <View key={'b' + k} style={{ flex: 1 }} />) : null}
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Pencereler
// ---------------------------------------------------------------------------
export function Dialog({ visible = true, onDismiss, children, style, full, dismissOnBackdrop = true, label }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'center', alignItems: 'center', padding: full ? 0 : 16 }}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissOnBackdrop && onDismiss ? onDismiss : undefined}
          accessible={false}
          importantForAccessibility="no"
          accessibilityElementsHidden
        />
        <SafeAreaView style={full ? { flex: 1, alignSelf: 'stretch' } : { maxHeight: '100%', width: '100%', maxWidth: 560 }} edges={full ? undefined : []}>
          <View
            accessibilityViewIsModal
            accessibilityLabel={label}
            onAccessibilityEscape={onDismiss}
            style={[
              full
                ? { flex: 1, backgroundColor: DarkBg }
                : { backgroundColor: DarkSurface, borderRadius: 18, borderWidth: 1, borderColor: DarkBorder, padding: 18, maxHeight: '100%' },
              style,
            ]}
          >
            {children}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export function AlertDialog({ visible = true, onDismiss, title, text, confirm, dismiss, icon, style, containerColor, scroll = true }) {
  const govde = typeof text === 'string' ? <T color={TextLight} size={14} lineHeight={20}>{text}</T> : text;
  return (
    <Dialog visible={visible} onDismiss={onDismiss} style={[containerColor ? { backgroundColor: containerColor } : null, style]}>
      {icon ? <View style={{ alignItems: 'center', marginBottom: 8 }}>{typeof icon === 'string' ? <T size={30} hidden>{icon}</T> : icon}</View> : null}
      {title ? (typeof title === 'string' ? <T heading size={19} weight="bold" color={TextGold} serif style={{ marginBottom: 10 }}>{title}</T> : <View style={{ marginBottom: 10 }}>{title}</View>) : null}
      {govde ? scroll ? <ScrollView style={{ flexGrow: 0, flexShrink: 1 }}>{govde}</ScrollView> : govde : null}
      {confirm || dismiss ? (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {dismiss}
          {confirm}
        </View>
      ) : null}
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Göstergeler
// ---------------------------------------------------------------------------
export function Progress({ value, color = AmberGold, track = DarkBorder, height = 6, label, style, radius }) {
  const v = Math.max(0, Math.min(1, Number(value) || 0));
  const er = label
    ? { accessible: true, accessibilityLabel: label, accessibilityRole: 'progressbar' }
    : { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' };
  return (
    <View {...er} style={[{ height, backgroundColor: track, borderRadius: radius != null ? radius : height / 2, overflow: 'hidden', alignSelf: 'stretch' }, style]}>
      <View style={{ width: `${v * 100}%`, height: '100%', backgroundColor: color, borderRadius: radius != null ? radius : height / 2 }} />
    </View>
  );
}

export function Spinner({ color = AmberGold, size = 36 }) {
  return <ActivityIndicator color={color} size={size >= 36 ? 'large' : 'small'} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />;
}

// ---------------------------------------------------------------------------
// Seçim öğeleri
// ---------------------------------------------------------------------------
export function Chip({ selected, onPress, children, label, disabled, leading, style, selectedColor = AmberGoldDark, color = DarkSurfaceCard }) {
  const yazi = selected ? TextGold : TextLight;
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={label || metinTopla(children) || undefined}
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      onPress={disabled ? undefined : onPress}
      disabled={!!disabled}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          minHeight: 36,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: selected ? AmberGold : DarkBorder,
          backgroundColor: selected ? selectedColor : color,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {leading || null}
      {typeof children === 'string' || typeof children === 'number' ? <Text style={{ color: yazi, fontSize: 13, fontWeight: selected ? '700' : '500' }}>{children}</Text> : children}
    </Pressable>
  );
}

/** TabRow / ScrollableTabRow. VoiceOver: "Envanter, seçili, sekme 1 / 5". */
export function Tabs({ titles, selected, onSelect, scrollable, style, color = DarkSurface }) {
  const n = titles.length;
  const ogeler = titles.map((t, i) => {
    const secili = i === selected;
    const metin = typeof t === 'string' ? t : metinTopla(t);
    return (
      <Pressable
        key={i}
        accessible
        accessibilityRole="tab"
        accessibilityLabel={`${metin}${secili ? ', seçili' : ''}, sekme ${i + 1} / ${n}`}
        accessibilityState={{ selected: secili }}
        onPress={() => onSelect && onSelect(i)}
        style={{
          flex: scrollable ? undefined : 1,
          minHeight: 44,
          paddingHorizontal: 12,
          paddingVertical: 10,
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomWidth: 2,
          borderBottomColor: secili ? AmberGold : 'transparent',
        }}
      >
        {typeof t === 'string' ? <Text style={{ color: secili ? TextGold : TextMuted, fontSize: 13, fontWeight: secili ? '700' : '500', textAlign: 'center' }}>{t}</Text> : t}
      </Pressable>
    );
  });
  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[{ backgroundColor: color, flexGrow: 0 }, style]} accessibilityRole="tablist">
        {ogeler}
      </ScrollView>
    );
  }
  return (
    <View accessibilityRole="tablist" style={[{ flexDirection: 'row', backgroundColor: color }, style]}>
      {ogeler}
    </View>
  );
}

export function Toggle({ value, onChange, label, disabled }) {
  return (
    <Switch
      accessibilityLabel={label}
      value={!!value}
      onValueChange={onChange}
      disabled={!!disabled}
      trackColor={{ false: DarkBorder, true: AmberGoldDark }}
      thumbColor={value ? AmberGold : TextMuted}
    />
  );
}

/** Slider: VoiceOver'da ayarlanabilir öğe (yukarı/aşağı kaydırarak). Görselde − / + düğmeli çubuk. */
export function Slider({ value, onChange, min = 0, max = 1, step, label, valueText, disabled, color = AmberGold, style }) {
  const adim = step || (max - min) / 20;
  const yuvarla = (x) => Math.max(min, Math.min(max, Math.round((x - min) / adim) * adim + min));
  const ayarla = (x) => !disabled && onChange && onChange(Number(yuvarla(x).toFixed(4)));
  const oran = max > min ? (value - min) / (max - min) : 0;
  const deger = valueText != null ? valueText : `%${Math.round(oran * 100)}`;
  const [gen, setGen] = useState(0);
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: deger }}
      accessibilityState={{ disabled: !!disabled }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'increment') ayarla(value + adim);
        else if (e.nativeEvent.actionName === 'decrement') ayarla(value - adim);
      }}
      style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, opacity: disabled ? 0.5 : 1 }, style]}
    >
      <Pressable onPress={() => ayarla(value - adim)} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18, borderWidth: 1, borderColor: DarkBorder }}>
        <Text style={{ color: TextLight, fontSize: 18 }}>−</Text>
      </Pressable>
      <Pressable
        style={{ flex: 1, height: 36, justifyContent: 'center' }}
        onLayout={(e) => setGen(e.nativeEvent.layout.width)}
        onPress={(e) => gen > 0 && ayarla(min + (e.nativeEvent.locationX / gen) * (max - min))}
      >
        <View style={{ height: 6, borderRadius: 3, backgroundColor: DarkBorder, overflow: 'hidden' }}>
          <View style={{ width: `${Math.max(0, Math.min(1, oran)) * 100}%`, height: '100%', backgroundColor: color }} />
        </View>
      </Pressable>
      <Pressable onPress={() => ayarla(value + adim)} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18, borderWidth: 1, borderColor: DarkBorder }}>
        <Text style={{ color: TextLight, fontSize: 18 }}>+</Text>
      </Pressable>
    </View>
  );
}

export function Field({ value, onChange, label, placeholder, maxLength, singleLine = true, style, autoFocus, onSubmit, keyboardType, autoCapitalize = 'words' }) {
  return (
    <TextInput
      accessibilityLabel={label}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={TextMuted}
      maxLength={maxLength}
      multiline={!singleLine}
      autoFocus={autoFocus}
      onSubmitEditing={onSubmit}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
      returnKeyType="done"
      style={[
        { color: TextLight, fontSize: 16, borderWidth: 1, borderColor: AmberGoldDark, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: DarkSurfaceCard, minHeight: 48 },
        style,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Görseller
// ---------------------------------------------------------------------------
const IKONLAR = {
  Home: '🏠',
  Shield: '🛡️',
  Settings: '⚙️',
  Refresh: '🔄',
  PlayArrow: '▶️',
  MusicNote: '🎵',
  Menu: '☰',
  Explore: '🧭',
  Close: '✖️',
  SportsKabaddi: '🤼',
  ArrowBack: '←',
  ArrowForward: '→',
  Backpack: '🎒',
  Inventory: '🎒',
  Map: '🗺️',
  List: '📜',
  Assignment: '📜',
  Star: '⭐',
  Check: '✔️',
  Info: 'ℹ️',
  Lock: '🔒',
  VolumeUp: '🔊',
  VolumeOff: '🔇',
  Person: '👤',
  Favorite: '❤️',
  Add: '＋',
  Remove: '－',
  Delete: '🗑️',
  ExitToApp: '🚪',
  KeyboardArrowDown: '▾',
  KeyboardArrowUp: '▴',
  ExpandMore: '▾',
  ExpandLess: '▴',
};
/** Icons.Default.X / Icons.AutoMirrored.Filled.X → <Ikon name="X" />. Dekoratiftir. */
export function Ikon({ name, size = 20, color, style }) {
  return (
    <Text accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[{ fontSize: size * 0.9, color: color || TextLight, lineHeight: size * 1.15 }, style]}>
      {IKONLAR[name] || name || '•'}
    </Text>
  );
}

export function Img({ source, style, resizeMode = 'cover', label }) {
  if (source == null || typeof source === 'string') return <View style={[{ backgroundColor: BronzeOrDark() }, style]} />;
  return (
    <Image
      source={source}
      style={style}
      resizeMode={resizeMode}
      accessible={!!label}
      accessibilityLabel={label}
      accessibilityElementsHidden={!label}
      importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
    />
  );
}
function BronzeOrDark() {
  return DarkSurface;
}

export function Gradient({ colors, horizontal, style, children, label, pad, gap }) {
  const st = [];
  if (pad != null) st.push({ padding: pad });
  if (gap != null) st.push({ gap });
  st.push(style);
  return (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={horizontal ? { x: 1, y: 0 } : { x: 0, y: 1 }} style={st} accessible={!!label} accessibilityLabel={label}>
      {children}
    </LinearGradient>
  );
}

// ---------------------------------------------------------------------------
// Kök ekran ve bildirimler
// ---------------------------------------------------------------------------
export function Screen({ children, bg = DarkBg, style, edges }) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: bg }, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const snackDinleyiciler = new Set();
/** SnackbarHostState.showSnackbar / Toast karşılığı. */
export function showSnack(mesaj) {
  if (!mesaj) return;
  for (const f of snackDinleyiciler) f(String(mesaj));
  announce(String(mesaj));
}

export function SnackHost({ bottom = 84 }) {
  const [mesaj, setMesaj] = useState(null);
  useEffect(() => {
    let zaman = null;
    const f = (m) => {
      setMesaj(m);
      if (zaman) clearTimeout(zaman);
      zaman = setTimeout(() => setMesaj(null), Math.min(9000, 2800 + m.length * 35));
    };
    snackDinleyiciler.add(f);
    return () => {
      snackDinleyiciler.delete(f);
      if (zaman) clearTimeout(zaman);
    };
  }, []);
  if (!mesaj) return null;
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 12, right: 12, bottom }}>
      <Pressable
        onPress={() => setMesaj(null)}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ backgroundColor: DarkSurfaceCard, borderColor: AmberGoldDark, borderWidth: 1, borderRadius: 10, padding: 12 }}
      >
        <Text style={{ color: TextGold, fontSize: 14 }}>{mesaj}</Text>
      </Pressable>
    </View>
  );
}

export { TextMuted, TextLight, TextGold };
