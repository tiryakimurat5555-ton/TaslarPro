# Diyarın Kaderi — Kotlin'den Expo (React Native) JavaScript'e taşıma kuralları

Kaynak (salt okunur): `/tmp/claude-0/-home-claude/a1047865-8496-523a-b929-eece18d41a70/scratchpad/dk/Proje2/app/src/main/java/com/silahsor/diyarinkaderi/`
(aşağıda `KT/` diye anılır). Testler: `.../Proje2/app/src/test/java/com/silahsor/diyarinkaderi/`.
Hedef depo: `/home/claude/taslarpro`. Düz JavaScript (TypeScript YOK), ES modülleri, JSX yalnız ekranlarda.

**Amaç birebir taşıma.** Oyun metinleri, sayılar, formüller, olasılıklar, isimler AYNEN kalır. Hiçbir metni
kısaltma, özetleme, "..." ile geçme, sansürleme. Her `listOf(...)` girdisi, her diyalog satırı taşınır.
Kotlin'deki sınıf, işlev, alan adları AYNEN korunur (başkaları aynı adlarla çağıracak).

## Dosya eşlemesi
| Kotlin | JavaScript |
|---|---|
| `KT/domain/model/*.kt` (hepsi) | `src/domain/model.js` (tek dosya, hepsini dışa aktarır) |
| `KT/domain/engine/X.kt` | `src/domain/engine/X.js` |
| `KT/data/X.kt` | `src/data/X.js` |
| `KT/ui/viewmodel/GameViewModel.kt` | `src/ui/viewmodel/GameViewModel.js` |
| `KT/ui/screens/X.kt` | `src/ui/screens/X.js` |
| `KT/ui/components/X.kt` | `src/ui/components/X.js` |
| `KT/ui/theme/*` | `src/ui/theme.js` (hazır) |
| `KT/audio/SoundManager.kt` | `src/audio/SoundManager.js` (hazır, aynı API) |
| `R.raw.x`, `R.drawable.x` | `import { R } from '<göreli>/R.js'` → `R.raw.x` aynen (hazır) |
| test `X.kt` | `test/X.test.js` (`import { test, expect } from 'bun:test'`) |

İçe aktarmalar göreli yol ve `.js` uzantısıyla, açık adlarla: `import { Equipment, EquipmentSlot, Stats } from '../domain/model.js';`
Kotlin `import ...model.*` gördüğünde gerçekten kullandığın adları içe aktar. Bir adın hangi dosyada tanımlı olduğunu
bulmak için KT kaynağında `grep -rn "class Ad\b\|object Ad\b\|fun Ad\b\|val Ad\b"` yap: model klasöründeyse `model.js`ten,
`data/` ise `src/data/<Dosya>.js`ten, `engine/` ise `src/domain/engine/<Dosya>.js`ten gelir.
Çalışma zamanı yardımcıları: `import * as kt from '<göreli>/kt.js';` (`src/kt.js`, okuyun; değiştirmeyin).
Eksik bir yardımcı gerekirse KENDİ dosyanda yerel işlev olarak tanımla (kt.js'e ekleme; başkaları da düzenliyor).

## Dil eşlemeleri
- `data class X(val a: Int = 0, val b: Y)` →
  ```js
  export class X extends Data {
    static T = 'X';
    static defaults() { return { a: 0, b: undefined }; }   // Kotlin sırası korunur; zorunlu alan undefined
    get hesap() { ... }                                    // gövdedeki val x get() = ... ve val x = ... → getter
    fonk(p) { ... }                                        // gövdedeki fun
  }
  Data.register(X);
  ```
  Sınıf alanı (`foo = 1;` class field) YAZMA. Varsayılan liste/nesne her çağrıda yeni olsun (`defaults()` zaten işlev).
  Oluşturma: `X(a = 1, b = y)` → `new X({ a: 1, b: y })`. Konumsal argüman → adlandırılmış nesne (Kotlin parametre sırasına bak).
  `x.copy(a = 2)` → `x.copy({ a: 2 })`. Yapısal `==` → `kt.eq(a, b)`; `!=` → `!kt.eq(a, b)`.
  Data nesneleri listede: `list.contains(x)` → `kt.contains(list, x)`, `list - x` → `kt.minus(list, x)`, `indexOf` → `kt.indexOf`.
  Dize/sayı/enum karşılaştırması düz `===` ile.
  Yıkım: `val (a, b) = dataObj` → `const { a, b } = dataObj` (alan adlarıyla, bileşen sırasına dikkat).
  Düz `class` (data olmayan) → normal JS sınıfı; durum tutuyorsa `this.` alanlarını constructor'da ata.
- `object Ad { fun f() }` → `export const Ad = { f() { ... } };` (içerdeki `private val` durum → modül değişkeni ya da nesne alanı).
  `companion object` → `static` üyeler. `const val` → `export const`.
- `enum class E(val p: String) { A("x"), B("y"); fun f() = ... }` →
  `export const E = kt.defineEnum('E', { A: { p: 'x' }, B: { p: 'y' } }, { f() { ... }, get g() { ... } });`
  `E.A.name`, `E.A.ordinal`, `E.values()`, `E.entries`, `E.valueOf('A')`, `E.valueOfOrNull`. `when(e) { E.A -> }` → `switch` ya da if.
  Enum sıralama/karşılaştırma `.ordinal` ile. Enum, nesne anahtarı olabilir: `m[E.A]` (anahtar 'A' olur).
  Companion alias (`val HELMET get() = HEAD`) → tanımdan sonra `E.HELMET = E.HEAD;`.
- `sealed class` / `interface` → düz sınıflar + `instanceof`; ya da `type` alanlı nesneler. Hangisi daha sade ise.
- Operatör aşırı yükleme (`operator fun plus`) → yöntem: `a + b` → `a.plus(b)`, `a += b` → `a = a.plus(b)`, `times` → `.times()`.
- Uzantı işlevi `fun Model.f()`: model.js'te tanımlıysa o sınıfa YÖNTEM olarak ekle (çağrılar `x.f()` aynen kalsın).
  Başka dosyada tanımlıysa `export function f(alici, ...)` yaz ve çağrıları `f(x, ...)` yap. String/List uzantıları → işlev.
- Nullable: `?.` aynı, `?:` → `??`, `!!` → sil, `x?.let { }` → `if (x != null) { }`, `also/apply/run/with` → açık kod.
  Kotlin `null` → JS `null` (undefined değil). Varsayılan değeri `null` olan alanlarda `null` kullan.
- Dize şablonu `"$a ${b.c}"` → `` `${a} ${b.c}` ``. `"""..."""` → şablon dize; `.trimIndent()` → `kt.trimIndent(...)`.
  Kotlin dizesindeki `\$` → `$`. Emojiler ve Türkçe karakterler AYNEN.
- **Tamsayı bölmesi**: İki Int arasındaki `/` → `kt.idiv(a, b)`. Bu en sık hata kaynağı; her `/`'yi kontrol et.
  `x.toInt()` → `kt.toInt(x)`; `roundToInt()` → `Math.round`; `toDouble()/toFloat()` → sil; `Int % Int` aynı.
  `coerceIn/AtLeast/AtMost` → `kt.coerceIn(...)` vb. `kotlin.math.max/min/abs/pow/sqrt` → `Math.*`.
  `x.toString()` → `String(x)`. `"%.1f".format(v)` / `String.format` → `kt.format('%.1f', v)`.
- Koleksiyonlar: `listOf/mutableListOf/arrayListOf` → `[]`; `setOf/mutableSetOf` → dizi (yinelenmesiz tut: `kt.setPlus`).
  `mapOf(a to b)` / `mutableMapOf` → düz nesne `{ [a]: b }`; `Pair(a,b)`/`a to b` → `[a, b]`, `.first/.second` → `[0]/[1]`;
  `Triple` → `[a, b, c]`. `map[k]` aynı, `map[k] ?: 0` → `(map[k] ?? 0)`, `getOrDefault(k, d)` → `kt.mapGet(m, k, d)`,
  `map + (k to v)` → `kt.mapPlus(m, k, v)`, `map.keys/values/entries` → `Object.keys/values/entries` (enum anahtarı
  gerekiyorsa `kt.entriesOf(m, E)`), `containsKey` → `kt.containsKey`. `toMutableMap()` → `{ ...m }`.
  `toMutableList()/toList()` → `.slice()`. `list + x` → `[...list, x]`, `list + list2` → `[...list, ...list2]`.
  `any{}`→`.some`, `all{}`→`.every`, `none{}`→`kt.none`, `count{}`→`kt.count`, `sumOf`→`kt.sumOf`,
  `firstOrNull{}`→`kt.firstOrNull`, `first{}`→`kt.first`, `find{}`→`kt.firstOrNull`, `lastOrNull`, `maxByOrNull`,
  `sortedBy`, `sortedByDescending`, `groupBy`, `associateBy`, `distinct`, `distinctBy`, `partition`, `chunked`,
  `take`, `takeLast`, `drop`, `filterNotNull`, `mapNotNull`, `joinToString(sep)` → `kt.<ad>(dizi, ...)`.
  `isEmpty()/isNotEmpty()` → `.length === 0` / `> 0`. `size` → `.length`. `getOrNull(i)` → `kt.getOrNull`.
  `x in list` → `list.includes(x)` (dize/enum) ya da `kt.contains` (data). `x in 1..5` → `x >= 1 && x <= 5`.
  `for (i in 0 until n)` → `for (let i = 0; i < n; i++)`; `(1..n)` liste olarak → `kt.rangeTo(1, n)`; `repeat(n)` → `kt.repeat`.
  `forEachIndexed { i, x -> }` → `.forEach((x, i) => )`; `mapIndexed { i, x -> }` → `.map((x, i) => )` (SIRA TERS!).
- Rastgele: `Random.nextInt(a, b)` → `kt.Random.nextInt(a, b)`, `nextDouble()`, `nextFloat()`, `nextBoolean()` aynı adlarla;
  `list.random()` → `kt.random(list)`, `randomOrNull`, `shuffled()` → `kt.shuffled(list)`, `(a..b).random()` → `kt.randomIn(a, b)`.
  Tohumlu `Random(seed)` → `kt.makeRandom(seed)` (aynı arayüz; `kt.random(list, rnd)` ikinci argümanla).
  Bir işlev `random: Random = Random` parametresi alıyorsa koru: varsayılan `kt.Random`.
- `StateFlow/MutableStateFlow` → `new kt.MutableStateFlow(v)`; `.value`, `.update(fn)`, `.asStateFlow()` aynı.
  `combine(...).stateIn(...)` → `kt.combineFlows([a, b], (va, vb) => ...)`; `flow.map{}.stateIn` → `kt.mapFlow`.
- Coroutine: `viewModelScope.launch { ... }` → `kt.launch(async () => { ... })`; `delay(ms)` → `await kt.delay(ms)`;
  `suspend fun` → `async` işlev. `withContext(Dispatchers.IO) { x }` → doğrudan x.
- `System.currentTimeMillis()` → `Date.now()`. `Log.d/println` → `console.log` ya da sil. `try/catch` aynı.
- `when { koşul -> a; else -> b }` ifade olarak → üçlü zincir ya da kendini çağıran işlev / ara değişken.
- `lateinit var` / `by lazy` → modül düzeyinde `let` ile tembel başlatma.
- Kayıt: Gson yerine `kt.toJson(x)` / `kt.fromJson(s)` (Data ve enum'ları otomatik canlandırır; Data.register şart).

## Ekranlar (Compose → React Native)
Bileşen kiti `src/ui/kit.js` ve renkler `src/ui/theme.js` (Kotlin'deki adlar aynen: `AmberGold`, `DarkBg`, ...). Kiti oku.
- `@Composable fun X(viewModel: GameViewModel, ...)` → `export function X({ viewModel, ... }) { ... }` (prop adları Kotlin parametreleriyle aynı).
- `viewModel.player.collectAsState()` → `useFlow(viewModel.player)`. `remember { mutableStateOf(x) }` → `useState(x)`.
  `LaunchedEffect(k) { }` → `useEffect(() => { ... }, [k])` (içinde delay varsa async + iptal bayrağı).
  `derivedStateOf/remember(k){}` → `useMemo`. `rememberScrollState` → gereksiz.
- Kit eşlemeleri: `Column`/`Row`/`Box`/`Spacer`/`Text`→`T`/`Card`/`Button`/`OutlinedButton`/`TextButton`/`IconButton`/
  `LazyColumn`→`Scroll` (çok uzun listeler `LazyList`)/`AlertDialog`/`Dialog`/`LinearProgressIndicator`→`Progress`/
  `CircularProgressIndicator`→`Spinner`/`Divider`/`FilterChip`→`Chip`/`TabRow`→`Tabs`/`Switch`→`Toggle`/`Slider`/
  `TextField`→`Field`/`Icon`→`Ikon`/`Image`→`Img`/`Brush.*Gradient` arka plan→`Gradient`. Ayrıntılar kit.js başındaki açıklamada.
- Erişilebilirlik (VoiceOver, en önemli kısım): Kotlin'deki her `contentDescription`, `semantics`, `clearAndSetSemantics`
  metnini aynen `label` olarak taşı. `heading()` → `heading`. `liveRegion` → `live` (metin değişince VoiceOver okur).
  `Modifier.clickable{}` → kapsayıcıya `onPress`. Etiketi olmayan tıklanabilir kapsayıcıda kit, içindeki metinleri birleştirip
  okur; yine de anlamlı bir etiket kur (ana durum başta: "Kılıç, kuşanılı, Seviye 20" gibi). Dekoratif emoji/ikonlar `Ikon`.
  Düğmeler devre dışıyken `disabled` ver (VoiceOver "devre dışı" der). Pencereler (`Dialog`) kiti zaten modal yapar.
- Görsel: renk, boşluk, yazı boyu yaklaşık aynı olsun; `dp`/`sp` → sayı. Animasyonları (titreşim, nabız, kaydırma)
  sade bırakabilir ya da atlayabilirsin; oyun mantığını etkilemesin. `Color(0xFF123456)` → `color(0xFF123456)` (theme.js),
  `renk.copy(alpha = 0.3f)` → `alpha(renk, 0.3)`.
- Snackbar/Toast → `showSnack(mesaj)` (kit). Ses → `SoundManager.playSfx(R.raw.x)` aynen.

## Denetim
- Sözdizimi/paketleme: `bun build <dosya> --outdir /tmp/claude-0/denetim-<adın> --target=browser -e react -e react-native -e 'expo-*' -e '@react-native-async-storage/*' -e 'react-native-safe-area-context' -e react-native-svg -e '*.m4a' -e '*.jpg' -e '*.png'`
  hatasız geçmeli (çözülemeyen göreli içe aktarma = henüz yazılmamış dosya olabilir; o zaman adın doğru olduğunu KT'den teyit et).
- Testler: `cd /home/claude/taslarpro && bun test test/<ad>.test.js`. JUnit `assertEquals(beklenen, gercek)` → `expect(gercek).toBe(beklenen)`
  (data için `toEqual` ya da `expect(kt.eq(a,b)).toBe(true)`), `assertTrue(x)` → `expect(x).toBe(true)`. Test başarısızsa önce
  taşımadaki hatayı ara (tamsayı bölmesi, sıra, varsayılan değer); testi gevşetme. Rastgeleliğe bağlı testlerde Kotlin testi de
  rastgeleyse aynı tolerans geçerlidir.
- Git commit/push YAPMA; yalnız dosya yaz. Başkalarının dosyalarına dokunma.
