// kt.js — Kotlin'den JavaScript'e taşınan Diyarın Kaderi kodu için küçük çalışma zamanı.
// Kotlin'deki data class, enum, StateFlow, koleksiyon ve rastgele sayı alışkanlıklarını karşılar.
// React'a bağımlı DEĞİLDİR (bun testleri doğrudan çalıştırabilsin diye).

// ---------------------------------------------------------------------------
// data class
// ---------------------------------------------------------------------------
const VERI_KAYDI = {};
const ENUM_KAYDI = {};

/**
 * Kotlin data class karşılığı. Kullanım:
 *   export class Stats extends Data {
 *     static T = 'Stats';
 *     static defaults() { return { maxHealth: 0, damage: 0 }; }
 *     plus(o) { ... }
 *     get toplam() { ... }
 *   }
 *   Data.register(Stats);
 * - Alanlar defaults() içindeki anahtarlardır (zorunlu alan: değer undefined).
 * - new Stats({ damage: 5 }) -> eksik alanlar varsayılanla dolar.
 * - copy({ damage: 7 }) -> yeni nesne (Kotlin copy).
 * - Sınıf alanı (class field) TANIMLANMAZ; hesaplanan özellikler getter olur.
 */
export class Data {
  constructor(args) {
    const d = this.constructor.defaults ? this.constructor.defaults() : {};
    for (const k in d) this[k] = d[k];
    if (args) {
      for (const k in args) {
        if (k === '$t') continue;
        const v = args[k];
        if (v !== undefined) this[k] = v;
      }
    }
  }
  static defaults() {
    return {};
  }
  copy(changes) {
    return new this.constructor({ ...this, ...(changes || {}) });
  }
  equals(o) {
    return eq(this, o);
  }
  toJSON() {
    return { $t: this.constructor.T, ...this };
  }
  toString() {
    const ad = this.constructor.T || 'Data';
    return ad + '(' + Object.keys(this).map((k) => k + '=' + String(this[k])).join(', ') + ')';
  }
  static register(...siniflar) {
    for (const s of siniflar) {
      if (!s.T) throw new Error('Data sınıfında static T adı yok: ' + s.name);
      VERI_KAYDI[s.T] = s;
    }
  }
}

// ---------------------------------------------------------------------------
// enum class
// ---------------------------------------------------------------------------
/**
 * Kotlin enum class karşılığı.
 *   export const EquipmentSlot = defineEnum('EquipmentSlot', {
 *     HEAD: { displayName: 'Başlık', icon: '' },
 *     CHEST: { displayName: 'Gövdelik', icon: '' },
 *   }, {
 *     get isArmor() { return this === EquipmentSlot.HEAD; },   // getter
 *     describe(x) { return this.displayName + x; },              // yöntem
 *   });
 * - EquipmentSlot.HEAD.name === 'HEAD', .ordinal === 0, .displayName ...
 * - EquipmentSlot.values() / EquipmentSlot.entries / EquipmentSlot.valueOf('HEAD')
 * - Nesne anahtarı olarak kullanılabilir: obj[EquipmentSlot.HEAD] -> obj['HEAD'] (toString = name).
 * - Karşılaştırma ===, sıralama .ordinal ile.
 */
export function defineEnum(typeName, entries, methods) {
  const proto = {
    toString() {
      return this.name;
    },
    toJSON() {
      return { $e: typeName, n: this.name };
    },
    compareTo(o) {
      return this.ordinal - o.ordinal;
    },
  };
  if (methods) Object.defineProperties(proto, Object.getOwnPropertyDescriptors(methods));
  const hepsi = Object.keys(entries).map((ad, i) => {
    const e = Object.create(proto);
    e.name = ad;
    e.ordinal = i;
    Object.assign(e, entries[ad] || {});
    return e;
  });
  const E = {
    $type: typeName,
    entries: hepsi,
    values() {
      return hepsi.slice();
    },
    valueOf(ad) {
      const e = E.valueOfOrNull(ad);
      if (!e) throw new Error(`${typeName}.${ad} yok`);
      return e;
    },
    valueOfOrNull(ad) {
      if (ad && typeof ad === 'object' && ad.name) ad = ad.name;
      return hepsi.find((e) => e.name === ad) || null;
    },
  };
  for (const e of hepsi) E[e.name] = e;
  ENUM_KAYDI[typeName] = E;
  return E;
}

export function isEnumValue(x) {
  return !!(x && typeof x === 'object' && typeof x.ordinal === 'number' && typeof x.toJSON === 'function' && typeof x.name === 'string' && !(x instanceof Data));
}

// ---------------------------------------------------------------------------
// JSON kayıt / yükleme (Gson karşılığı)
// ---------------------------------------------------------------------------
function canlandir(_k, v) {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    if (typeof v.$e === 'string') {
      const E = ENUM_KAYDI[v.$e];
      return E ? E.valueOfOrNull(v.n) : null;
    }
    if (typeof v.$t === 'string') {
      const S = VERI_KAYDI[v.$t];
      if (S) return new S(v);
    }
  }
  return v;
}
export function toJson(x) {
  return JSON.stringify(x);
}
export function fromJson(metin) {
  return JSON.parse(metin, canlandir);
}

// ---------------------------------------------------------------------------
// Eşitlik (Kotlin == data class için yapısal eşitlik)
// ---------------------------------------------------------------------------
export function eq(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (isEnumValue(a) || isEnumValue(b)) return false;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!eq(a[i], b[i])) return false;
    return true;
  }
  if (Array.isArray(b)) return false;
  if (a.constructor !== b.constructor) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (!eq(a[k], b[k])) return false;
  return true;
}

// ---------------------------------------------------------------------------
// StateFlow
// ---------------------------------------------------------------------------
export class MutableStateFlow {
  constructor(v) {
    this._v = v;
    this._d = new Set();
  }
  get value() {
    return this._v;
  }
  set value(v) {
    if (v === this._v) return;
    this._v = v;
    for (const f of Array.from(this._d)) f(v);
  }
  update(fn) {
    this.value = fn(this._v);
  }
  getAndUpdate(fn) {
    const eski = this._v;
    this.value = fn(eski);
    return eski;
  }
  updateAndGet(fn) {
    this.value = fn(this._v);
    return this._v;
  }
  subscribe(f) {
    this._d.add(f);
    return () => this._d.delete(f);
  }
  asStateFlow() {
    return this;
  }
}
/** Birden çok akıştan türetilmiş salt okunur akış (Kotlin combine/map + stateIn karşılığı). */
export class DerivedFlow {
  constructor(kaynaklar, hesap) {
    this._k = kaynaklar;
    this._h = hesap;
    this._d = new Set();
    this._v = hesap(...kaynaklar.map((k) => k.value));
    this._iptal = null;
  }
  get value() {
    if (!this._iptal) this._v = this._h(...this._k.map((k) => k.value));
    return this._v;
  }
  subscribe(f) {
    if (!this._iptal) {
      const yenile = () => {
        const v = this._h(...this._k.map((k) => k.value));
        if (v === this._v) return;
        this._v = v;
        for (const g of Array.from(this._d)) g(v);
      };
      const iptaller = this._k.map((k) => k.subscribe(yenile));
      this._iptal = () => iptaller.forEach((i) => i());
      this._v = this._h(...this._k.map((k) => k.value));
    }
    this._d.add(f);
    return () => {
      this._d.delete(f);
      if (this._d.size === 0 && this._iptal) {
        this._iptal();
        this._iptal = null;
      }
    };
  }
  asStateFlow() {
    return this;
  }
}
export function combineFlows(kaynaklar, hesap) {
  return new DerivedFlow(kaynaklar, hesap);
}
export function mapFlow(kaynak, hesap) {
  return new DerivedFlow([kaynak], hesap);
}

/** Kotlin delay(ms) karşılığı: await delay(500) */
export function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
/** viewModelScope.launch { ... } karşılığı: launch(async () => { ... }) */
export function launch(fn) {
  const p = Promise.resolve().then(fn);
  p.catch((e) => console.warn('launch hatası', e));
  return p;
}

// ---------------------------------------------------------------------------
// Rastgele sayılar (kotlin.random.Random)
// ---------------------------------------------------------------------------
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function makeRandom(seed) {
  const r = seed === undefined || seed === null ? Math.random : mulberry32(Number(seed) | 0);
  const R = {
    /** nextInt() / nextInt(until) / nextInt(from, until) — until hariç */
    nextInt(a, b) {
      if (a === undefined) return Math.floor(r() * 4294967296) - 2147483648;
      if (b === undefined) {
        b = a;
        a = 0;
      }
      if (b <= a) throw new Error('nextInt aralığı boş: ' + a + '..' + b);
      return a + Math.floor(r() * (b - a));
    },
    nextLong(a, b) {
      return R.nextInt(a, b);
    },
    /** nextDouble() 0..1 / nextDouble(until) / nextDouble(from, until) */
    nextDouble(a, b) {
      if (a === undefined) return r();
      if (b === undefined) return r() * a;
      return a + r() * (b - a);
    },
    nextFloat() {
      return r();
    },
    nextBoolean() {
      return r() < 0.5;
    },
    /** (a..b).random() — iki uç dahil */
    inRange(a, b) {
      return a + Math.floor(r() * (b - a + 1));
    },
    pick(arr) {
      if (!arr || arr.length === 0) throw new Error('Boş listeden random()');
      return arr[Math.floor(r() * arr.length)];
    },
    pickOrNull(arr) {
      return !arr || arr.length === 0 ? null : arr[Math.floor(r() * arr.length)];
    },
    shuffled(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
  };
  return R;
}
/** Kotlin'in varsayılan Random nesnesi. Testte Random.__tohum(42) ile sabitlenebilir. */
export const Random = makeRandom();
let _varsayilanUretici = null;
Random.__tohum = (seed) => {
  const yeni = makeRandom(seed);
  for (const k of Object.keys(yeni)) Random[k] = yeni[k];
  _varsayilanUretici = seed;
};
/** list.random() */
export const random = (arr, rnd) => (rnd || Random).pick(arr);
export const randomOrNull = (arr, rnd) => (rnd || Random).pickOrNull(arr);
export const shuffled = (arr, rnd) => (rnd || Random).shuffled(arr);
/** (a..b).random() */
export const randomIn = (a, b, rnd) => (rnd || Random).inRange(a, b);

// ---------------------------------------------------------------------------
// Sayılar
// ---------------------------------------------------------------------------
/** Kotlin Int / Int (tamsayı bölme, sıfıra doğru keser) */
export function idiv(a, b) {
  if (b === 0) throw new Error('Sıfıra bölme');
  return Math.trunc(a / b);
}
/** x.toInt() (Double -> Int, sıfıra doğru keser) */
export function toInt(x) {
  if (typeof x === 'string') {
    const n = parseInt(x, 10);
    if (Number.isNaN(n)) throw new Error('Sayı değil: ' + x);
    return n;
  }
  if (Number.isNaN(x)) return 0;
  return Math.trunc(x);
}
export function toIntOrNull(s) {
  if (s == null) return null;
  const t = String(s).trim();
  if (!/^[-+]?\d+$/.test(t)) return null;
  return parseInt(t, 10);
}
/** x.roundToInt() */
export function roundToInt(x) {
  return Math.round(x);
}
export function coerceIn(v, min, max) {
  return v < min ? min : v > max ? max : v;
}
export function coerceAtLeast(v, min) {
  return v < min ? min : v;
}
export function coerceAtMost(v, max) {
  return v > max ? max : v;
}

// ---------------------------------------------------------------------------
// Aralıklar
// ---------------------------------------------------------------------------
/** a..b (dahil) */
export function rangeTo(a, b, step = 1) {
  const o = [];
  for (let i = a; i <= b; i += step) o.push(i);
  return o;
}
/** a until b (b hariç) */
export function until(a, b, step = 1) {
  const o = [];
  for (let i = a; i < b; i += step) o.push(i);
  return o;
}
/** a downTo b */
export function downTo(a, b, step = 1) {
  const o = [];
  for (let i = a; i >= b; i -= step) o.push(i);
  return o;
}
/** repeat(n) { i -> } */
export function repeat(n, fn) {
  for (let i = 0; i < n; i++) fn(i);
}
/** List(n) { i -> } */
export function listOfSize(n, fn) {
  const o = [];
  for (let i = 0; i < n; i++) o.push(fn(i));
  return o;
}

// ---------------------------------------------------------------------------
// Koleksiyonlar (diziler). Hepsi yeni dizi döndürür, girdiyi değiştirmez.
// ---------------------------------------------------------------------------
const id = (x) => x;
export const sumOf = (arr, fn = id) => {
  let t = 0;
  for (const x of arr) t += fn(x);
  return t;
};
export const sum = (arr) => sumOf(arr);
export const average = (arr) => (arr.length ? sum(arr) / arr.length : NaN);
export const count = (arr, fn) => (fn ? arr.filter(fn).length : arr.length);
export const none = (arr, fn) => (fn ? !arr.some(fn) : arr.length === 0);
export const isEmpty = (x) => (Array.isArray(x) || typeof x === 'string' ? x.length === 0 : Object.keys(x).length === 0);
export const isNotEmpty = (x) => !isEmpty(x);
export function maxByOrNull(arr, fn) {
  let en = null;
  let ed = -Infinity;
  for (const x of arr) {
    const d = fn(x);
    if (en === null || d > ed) {
      en = x;
      ed = d;
    }
  }
  return en;
}
export function minByOrNull(arr, fn) {
  let en = null;
  let ed = Infinity;
  for (const x of arr) {
    const d = fn(x);
    if (en === null || d < ed) {
      en = x;
      ed = d;
    }
  }
  return en;
}
export function maxBy(arr, fn) {
  if (!arr.length) throw new Error('maxBy: boş liste');
  return maxByOrNull(arr, fn);
}
export function minBy(arr, fn) {
  if (!arr.length) throw new Error('minBy: boş liste');
  return minByOrNull(arr, fn);
}
export function maxOf(arr, fn = id) {
  if (!arr.length) throw new Error('maxOf: boş liste');
  return Math.max(...arr.map(fn));
}
export function minOf(arr, fn = id) {
  if (!arr.length) throw new Error('minOf: boş liste');
  return Math.min(...arr.map(fn));
}
export const maxOfOrNull = (arr, fn = id) => (arr.length ? maxOf(arr, fn) : null);
export const minOfOrNull = (arr, fn = id) => (arr.length ? minOf(arr, fn) : null);
export const maxOrNull = (arr) => (arr.length ? Math.max(...arr) : null);
export const minOrNull = (arr) => (arr.length ? Math.min(...arr) : null);

function karsilastir(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (isEnumValue(a)) return a.ordinal - b.ordinal;
  if (typeof a === 'string') return a < b ? -1 : a > b ? 1 : 0;
  if (typeof a === 'boolean') return (a ? 1 : 0) - (b ? 1 : 0);
  return a - b;
}
export const compareValues = karsilastir;
/** sortedBy (kararlı) */
export const sortedBy = (arr, fn) => arr.slice().sort((a, b) => karsilastir(fn(a), fn(b)));
export const sortedByDescending = (arr, fn) => arr.slice().sort((a, b) => karsilastir(fn(b), fn(a)));
export const sorted = (arr) => arr.slice().sort(karsilastir);
export const sortedDescending = (arr) => arr.slice().sort((a, b) => karsilastir(b, a));
export const sortedWith = (arr, cmp) => arr.slice().sort(cmp);
/** compareBy({it.a}, {it.b}) */
export const compareBy =
  (...fns) =>
  (a, b) => {
    for (const f of fns) {
      const c = karsilastir(f(a), f(b));
      if (c) return c;
    }
    return 0;
  };
export const compareByDescending =
  (...fns) =>
  (a, b) =>
    compareBy(...fns)(b, a);
/** comparator.thenBy */
export const thenBy = (cmp, fn) => (a, b) => cmp(a, b) || karsilastir(fn(a), fn(b));
export const thenByDescending = (cmp, fn) => (a, b) => cmp(a, b) || karsilastir(fn(b), fn(a));

/** groupBy -> düz nesne { anahtar: [..] } (anahtar sırası ilk görülme sırası) */
export function groupBy(arr, keyFn, valFn = id) {
  const o = {};
  for (const x of arr) {
    const k = keyFn(x);
    (o[k] || (o[k] = [])).push(valFn(x));
  }
  return o;
}
export function associateBy(arr, keyFn, valFn = id) {
  const o = {};
  for (const x of arr) o[keyFn(x)] = valFn(x);
  return o;
}
export function associateWith(arr, valFn) {
  const o = {};
  for (const x of arr) o[x] = valFn(x);
  return o;
}
/** associate { k to v } -> fn [k, v] döndürür */
export function associate(arr, fn) {
  const o = {};
  for (const x of arr) {
    const [k, v] = fn(x);
    o[k] = v;
  }
  return o;
}
export function distinct(arr) {
  const o = [];
  for (const x of arr) if (!o.some((y) => eq(x, y))) o.push(x);
  return o;
}
export function distinctBy(arr, fn) {
  const o = [];
  const gor = [];
  for (const x of arr) {
    const k = fn(x);
    if (!gor.some((y) => eq(k, y))) {
      gor.push(k);
      o.push(x);
    }
  }
  return o;
}
export function partition(arr, fn) {
  const a = [];
  const b = [];
  for (const x of arr) (fn(x) ? a : b).push(x);
  return [a, b];
}
export function chunked(arr, n) {
  const o = [];
  for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n));
  return o;
}
export function windowed(arr, n, step = 1, partial = false) {
  const o = [];
  for (let i = 0; i < arr.length; i += step) {
    const p = arr.slice(i, i + n);
    if (p.length < n && !partial) break;
    o.push(p);
  }
  return o;
}
export function zip(a, b, fn) {
  const n = Math.min(a.length, b.length);
  const o = [];
  for (let i = 0; i < n; i++) o.push(fn ? fn(a[i], b[i]) : [a[i], b[i]]);
  return o;
}
export const take = (arr, n) => arr.slice(0, Math.max(0, n));
export const takeLast = (arr, n) => (n <= 0 ? [] : arr.slice(-n));
export const drop = (arr, n) => arr.slice(Math.max(0, n));
export const dropLast = (arr, n) => arr.slice(0, Math.max(0, arr.length - n));
export function takeWhile(arr, fn) {
  const o = [];
  for (const x of arr) {
    if (!fn(x)) break;
    o.push(x);
  }
  return o;
}
export function first(arr, fn) {
  const x = fn ? arr.find(fn) : arr[0];
  if (fn ? x === undefined : arr.length === 0) throw new Error('first: eleman yok');
  return x;
}
export function firstOrNull(arr, fn) {
  if (!arr) return null;
  const x = fn ? arr.find(fn) : arr[0];
  return x === undefined ? null : x;
}
export function last(arr, fn) {
  const x = lastOrNull(arr, fn);
  if (x === null) throw new Error('last: eleman yok');
  return x;
}
export function lastOrNull(arr, fn) {
  if (!arr) return null;
  for (let i = arr.length - 1; i >= 0; i--) if (!fn || fn(arr[i])) return arr[i];
  return null;
}
export const getOrNull = (arr, i) => (i >= 0 && i < arr.length ? arr[i] : null);
export const getOrElse = (arr, i, fn) => (i >= 0 && i < arr.length ? arr[i] : fn(i));
export function singleOrNull(arr, fn) {
  const s = fn ? arr.filter(fn) : arr;
  return s.length === 1 ? s[0] : null;
}
export const filterNotNull = (arr) => arr.filter((x) => x != null);
export const mapNotNull = (arr, fn) => arr.map(fn).filter((x) => x != null);
export const flatten = (arr) => [].concat(...arr);
export const indexOfFirst = (arr, fn) => arr.findIndex(fn);
export function indexOfLast(arr, fn) {
  for (let i = arr.length - 1; i >= 0; i--) if (fn(arr[i])) return i;
  return -1;
}
export const mapIndexed = (arr, fn) => arr.map((x, i) => fn(i, x));
export const filterIndexed = (arr, fn) => arr.filter((x, i) => fn(i, x));
export const forEachIndexed = (arr, fn) => arr.forEach((x, i) => fn(i, x));
export function joinToString(arr, sep = ', ', transform, prefix = '', postfix = '') {
  return prefix + arr.map((x) => (transform ? transform(x) : String(x))).join(sep) + postfix;
}
/** Yapısal eşitlikle içerir mi (data class listeleri için). Dize/enum için arr.includes yeterli. */
export const contains = (arr, x) => arr.some((y) => eq(x, y));
export const indexOf = (arr, x) => arr.findIndex((y) => eq(x, y));
/** list - eleman (ilk eşleşen çıkar) */
export function minus(arr, x) {
  const i = indexOf(arr, x);
  if (i < 0) return arr.slice();
  return arr.slice(0, i).concat(arr.slice(i + 1));
}
/** list - liste (eşleşenlerin hepsi çıkar) */
export const minusAll = (arr, liste) => arr.filter((x) => !contains(liste, x));
/** set + eleman (yinelenmez) */
export const setPlus = (arr, x) => (contains(arr, x) ? arr.slice() : arr.concat([x]));
export const setPlusAll = (arr, liste) => {
  let o = arr.slice();
  for (const x of liste) o = setPlus(o, x);
  return o;
};
/** set - eleman (hepsi çıkar) */
export const setMinus = (arr, x) => arr.filter((y) => !eq(x, y));
export const intersect = (a, b) => distinct(a.filter((x) => contains(b, x)));
export const union = (a, b) => distinct(a.concat(b));
/** list.subtract(other) */
export const subtract = (a, b) => distinct(a.filter((x) => !contains(b, x)));

// ---------------------------------------------------------------------------
// Map (düz nesne) yardımcıları. Kotlin Map<K,V> -> { [k]: v }. Enum anahtar otomatik ada dönüşür.
// ---------------------------------------------------------------------------
export const mapGet = (m, k, varsayilan = null) => (m && Object.prototype.hasOwnProperty.call(m, String(k)) ? m[k] : varsayilan);
export const mapPlus = (m, k, v) => ({ ...(m || {}), [k]: v });
export const mapPlusAll = (m, o) => ({ ...(m || {}), ...(o || {}) });
export function mapMinus(m, k) {
  const o = { ...(m || {}) };
  delete o[k];
  return o;
}
export const containsKey = (m, k) => !!m && Object.prototype.hasOwnProperty.call(m, String(k));
/** Enum anahtarlı nesnenin girdilerini enum değerleriyle verir: entriesOf(m, EquipmentSlot) -> [[EquipmentSlot.HEAD, v], ...] */
export function entriesOf(m, Enum) {
  return Object.entries(m || {}).map(([k, v]) => [Enum ? Enum.valueOfOrNull(k) : k, v]);
}
export function mapValues(m, fn) {
  const o = {};
  for (const [k, v] of Object.entries(m || {})) o[k] = fn(v, k);
  return o;
}
export function filterValues(m, fn) {
  const o = {};
  for (const [k, v] of Object.entries(m || {})) if (fn(v, k)) o[k] = v;
  return o;
}
export function filterKeys(m, fn) {
  const o = {};
  for (const [k, v] of Object.entries(m || {})) if (fn(k, v)) o[k] = v;
  return o;
}
/** mapOf(a to b, c to d) için: mapOf([a, b], [c, d]) */
export function mapOf(...ciftler) {
  const o = {};
  for (const [k, v] of ciftler) o[k] = v;
  return o;
}

// ---------------------------------------------------------------------------
// Dizeler
// ---------------------------------------------------------------------------
export const isBlank = (s) => s == null || String(s).trim() === '';
export const isNotBlank = (s) => !isBlank(s);
export const ifBlank = (s, fn) => (isBlank(s) ? fn() : s);
export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
export function substringBefore(s, sep, yoksa) {
  const i = s.indexOf(sep);
  return i < 0 ? (yoksa === undefined ? s : yoksa) : s.slice(0, i);
}
export function substringAfter(s, sep, yoksa) {
  const i = s.indexOf(sep);
  return i < 0 ? (yoksa === undefined ? s : yoksa) : s.slice(i + sep.length);
}
export function substringAfterLast(s, sep, yoksa) {
  const i = s.lastIndexOf(sep);
  return i < 0 ? (yoksa === undefined ? s : yoksa) : s.slice(i + sep.length);
}
export function substringBeforeLast(s, sep, yoksa) {
  const i = s.lastIndexOf(sep);
  return i < 0 ? (yoksa === undefined ? s : yoksa) : s.slice(0, i);
}
export const removePrefix = (s, p) => (s.startsWith(p) ? s.slice(p.length) : s);
export const removeSuffix = (s, p) => (p && s.endsWith(p) ? s.slice(0, -p.length) : s);
export const lines = (s) => s.split(/\r?\n/);
export const trimIndent = (s) => {
  const l = s.replace(/^\n/, '').replace(/\n[ \t]*$/, '').split('\n');
  const girinti = Math.min(...l.filter((x) => x.trim()).map((x) => x.match(/^[ \t]*/)[0].length));
  return l.map((x) => x.slice(Number.isFinite(girinti) ? girinti : 0)).join('\n');
};
export const trimMargin = (s, m = '|') =>
  s
    .replace(/^\n/, '')
    .replace(/\n[ \t]*$/, '')
    .split('\n')
    .map((x) => x.replace(new RegExp('^[ \\t]*' + m.replace(/[|\\^$*+?.()[\]{}]/g, '\\$&')), ''))
    .join('\n');

/** Kotlin String.format / "%.1f".format(x). Türkçe yerel ayar gibi ondalık ayırıcı virgül. */
export function format(kalip, ...args) {
  let i = 0;
  return kalip.replace(/%(-)?(0)?(,)?(\d+)?(?:\.(\d+))?([dsfx%])/g, (_m, sola, sifir, grup, gen, hassas, tur) => {
    if (tur === '%') return '%';
    let v = args[i++];
    let s;
    if (tur === 'd') {
      s = String(Math.trunc(Number(v)));
      if (grup) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    } else if (tur === 'f') {
      s = Number(v).toFixed(hassas === undefined ? 6 : Number(hassas));
      const [t, o] = s.split('.');
      s = (grup ? t.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : t) + (o !== undefined ? ',' + o : '');
    } else if (tur === 'x') s = Number(v).toString(16);
    else s = String(v);
    if (gen) {
      const g = Number(gen);
      while (s.length < g) s = sola ? s + ' ' : (sifir ? '0' : ' ') + s;
    }
    return s;
  });
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
export const currentTimeMillis = () => Date.now();

/** Kotlin error("...") / require / check */
export function error(m) {
  throw new Error(m);
}
export function requireThat(k, m) {
  if (!k) throw new Error(m || 'require başarısız');
}
