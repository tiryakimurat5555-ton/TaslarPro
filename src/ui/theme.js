// Diyarın Kaderi renkleri ve yazı biçimleri (KT/ui/theme/Color.kt, Type.kt). Adlar Kotlin ile aynı.

/** Compose Color(0xAARRGGBB) karşılığı: color(0xFFC9933E) -> 'rgba(201,147,62,1)' */
export function color(argb) {
  const n = Number(argb);
  const a = Math.floor(n / 0x1000000) & 0xff;
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `rgba(${r},${g},${b},${+(a / 255).toFixed(3)})`;
}

/** renk.copy(alpha = x) karşılığı: alpha(AmberGold, 0.3) */
export function alpha(renk, a) {
  const m = String(renk).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return `rgba(${m[1]},${m[2]},${m[3]},${a})`;
  const h = String(renk).replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export const AmberGold = '#C9933E';
export const AmberGoldLight = '#DFB36A';
export const AmberGoldDark = '#8C5F1C';
export const BronzeDark = '#382C1E';

export const DarkBg = '#141210';
export const DarkSurface = '#1E1B17';
export const DarkSurfaceCard = '#26231E';
export const DarkBorder = '#4A4237';

export const TextGold = '#F3D59B';
export const TextLight = '#EBE6DD';
export const TextMuted = '#A69E92';

export const HealthRed = '#C0392B';
export const HealthGreen = '#27AE60';
export const ExpBlue = '#2980B9';
export const FamePurple = '#8E44AD';

// Compose Color sabitleri
export const Color = {
  White: '#FFFFFF',
  Black: '#000000',
  Transparent: 'rgba(0,0,0,0)',
  Red: '#FF0000',
  Green: '#00FF00',
  Blue: '#0000FF',
  Yellow: '#FFFF00',
  Gray: '#888888',
  LightGray: '#CCCCCC',
  DarkGray: '#444444',
  Cyan: '#00FFFF',
  Magenta: '#FF00FF',
};

// MaterialTheme.colorScheme karşılığı
export const colorScheme = {
  primary: AmberGold,
  secondary: AmberGoldDark,
  background: DarkBg,
  surface: DarkSurface,
  surfaceVariant: DarkSurfaceCard,
  onPrimary: DarkBg,
  onSecondary: TextLight,
  onBackground: TextLight,
  onSurface: TextLight,
  outline: DarkBorder,
  error: HealthRed,
};

const SERIF = 'Georgia';
// MaterialTheme.typography karşılığı (T bileşenine style={Typography.titleLarge} verilebilir)
export const Typography = {
  headlineLarge: { fontFamily: SERIF, fontWeight: '700', fontSize: 24, lineHeight: 30 },
  headlineMedium: { fontFamily: SERIF, fontWeight: '700', fontSize: 20, lineHeight: 26 },
  headlineSmall: { fontFamily: SERIF, fontWeight: '700', fontSize: 18, lineHeight: 24 },
  titleLarge: { fontFamily: SERIF, fontWeight: '600', fontSize: 18, lineHeight: 24 },
  titleMedium: { fontWeight: '600', fontSize: 16, lineHeight: 22 },
  titleSmall: { fontWeight: '600', fontSize: 14, lineHeight: 20 },
  bodyLarge: { fontWeight: '400', fontSize: 16, lineHeight: 24, letterSpacing: 0.5 },
  bodyMedium: { fontWeight: '400', fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
  bodySmall: { fontWeight: '400', fontSize: 12, lineHeight: 16 },
  labelLarge: { fontWeight: '500', fontSize: 14, lineHeight: 20 },
  labelMedium: { fontWeight: '500', fontSize: 12, lineHeight: 16 },
  labelSmall: { fontWeight: '500', fontSize: 11, lineHeight: 16, letterSpacing: 0.5 },
};
export const SerifFont = SERIF;
