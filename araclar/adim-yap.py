# Oyuncunun adım sesleri: ElevenLabs'in "altı adım" kayıtlarından (ham/adim_<zemin>.mp3) dörder adım çıkarır.
# Her adımın vuruşu dosyanın 5. ms'sine hizalanır (geç başlayan adım ritmi bozuyordu), sonu 40 ms'de yumuşakça kapanır
# (sert kesik çıt sesi yapıyordu), en çok 0,45 sn (mağarada yankı için 0,7). Ot ve yaprakta ses neredeyse yalnız hışırtıydı:
# altına aynı sıradaki toprak adımının alçak geçiren gövdesi eklenir (ayağın yere basışı). Dördü aynı vuruş yüksekliğine
# eşitlenir. Çıktı WAV (sıkıştırma gecikmesi ve dolgu sessizliği yok): assets/efekt/adim_<zemin>_0..3.wav
# Kullanım: python3 araclar/adim-yap.py <ham klasörü>
import subprocess, sys, os, numpy as np
from scipy.signal import butter, sosfilt
SR = 44100
HAM = sys.argv[1]
CIKTI = 'assets/efekt'
def oku(ad):
    r = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', os.path.join(HAM, f'adim_{ad}.mp3'), '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(r, dtype=np.int16).astype(np.float64) / 32768
def zarf(x, w=220):
    n = len(x) // w
    return np.sqrt((x[: n * w].reshape(n, w) ** 2).mean(1)) + 1e-9
def adimlar(x, enUzun):
    e = 20 * np.log10(zarf(x))
    esik = e.max() - 18
    bas = []
    i = 0
    while i < len(e):
        if e[i] > esik and (i == 0 or e[i - 1] <= esik):
            bas.append(i * 220)
            i += int(0.22 * SR / 220)  # aynı adımın içindeki ikinci tepe yeni adım sayılmasın
        else:
            i += 1
    parcalar = []
    for k, b in enumerate(bas):
        son = min(bas[k + 1] - int(0.01 * SR) if k + 1 < len(bas) else len(x), b + int(enUzun * SR))
        s = max(0, b - int(0.005 * SR))
        p = x[s:son].copy()
        # Asıl vuruş: adımın en yüksek yerinin 10 dB yakınına ilk çıkılan yer; ondan 5 ms önce başlar
        ez = 20 * np.log10(zarf(p))
        ilk = int(np.argmax(ez > ez.max() - 10))
        p = p[max(0, ilk * 220 - int(0.005 * SR)):]
        if len(p) < int(0.08 * SR):
            continue
        p[: int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))
        f = min(int(0.04 * SR), len(p) // 3)
        p[-f:] *= np.linspace(1, 0, f) ** 2
        parcalar.append(p)
    return parcalar
def vurus(p):
    return 20 * np.log10(zarf(p, int(0.08 * SR)).max() if len(p) >= int(0.08 * SR) else np.sqrt((p ** 2).mean()))
govdeler = None
toprak = adimlar(oku('toprak'), 0.45)
lp = butter(4, 260, btype='low', fs=SR, output='sos')
for zemin in ['ot', 'toprak', 'camur', 'su', 'kaya', 'yaprak', 'magara']:
    pl = adimlar(oku(zemin), 0.7 if zemin == 'magara' else 0.45)
    # Uzunluğu ve yüksekliği ortalamaya en yakın dört adım (kesik ve aşırı farklıları ele)
    sure = np.median([len(p) for p in pl])
    pl = [p for p in pl if len(p) >= 0.55 * sure] or pl
    vm = np.median([vurus(p) for p in pl])
    # Tek vuruşlu adımlar yeğlenir: 120 ms'den sonra tepeye 6 dB yaklaşan ikinci bir vuruş (iki adım birden) cezalı
    def cift(p):
        ez = 20 * np.log10(zarf(p))
        k = int(0.12 * SR / 220)
        return len(ez) > k and ez[k:].max() > ez.max() - 6
    pl = sorted(pl, key=lambda p: abs(vurus(p) - vm) + (100 if cift(p) else 0))[:4]
    # Yine de çift vuruşlu kalan (suda sıçrama) adım, iki vuruş arasındaki en sessiz yerden kesilir
    def kes(p):
        if not cift(p): return p
        ez = 20 * np.log10(zarf(p))
        k = int(0.12 * SR / 220)
        ikinci = k + int(np.argmax(ez[k:] > ez.max() - 6))
        ilk = int(np.argmax(ez))
        a1 = min(ilk + int(0.05 * SR / 220), ikinci - 1)
        dip = a1 + int(np.argmin(ez[a1:ikinci])) if ikinci > a1 else ikinci
        q = p[: max(int(0.1 * SR), dip * 220)].copy()
        f = min(int(0.03 * SR), len(q) // 3)
        q[-f:] *= np.linspace(1, 0, f) ** 2
        return q
    pl = [kes(p) for p in pl]
    print(zemin, 'çift vuruşlu:', sum(cift(p) for p in pl), end='; ')
    while len(pl) < 4:  # yetmezse birinin perdesi biraz değiştirilmiş kopyası
        q = pl[len(pl) % len(pl)]
        pl.append(np.interp(np.arange(0, len(q), 0.95), np.arange(len(q)), q))
    for i, p in enumerate(pl):
        if zemin in ('ot', 'yaprak'):
            g = sosfilt(lp, toprak[i % len(toprak)])
            g = g[: len(p)] if len(g) >= len(p) else np.pad(g, (0, len(p) - len(g)))
            g *= np.sqrt((p ** 2).mean()) / (np.sqrt((g ** 2).mean()) + 1e-9) * (0.7 if zemin == 'ot' else 0.55)
            p = p + g
        p = p * 10 ** ((-14 - vurus(p)) / 20)
        p = np.clip(p, -0.98, 0.98)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s16le', f'{CIKTI}/adim_{zemin}_{i}.wav'], input=(p * 32767).astype(np.int16).tobytes(), check=True)
    print(zemin, [round(len(p) / SR, 2) for p in pl])
