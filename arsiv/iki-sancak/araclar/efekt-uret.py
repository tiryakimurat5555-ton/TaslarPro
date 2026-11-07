# İki Sancak ses efektlerini sıfırdan (sentezle) üretir. ElevenLabs kullanılmaz.
# Kullanım: python3 araclar/efekt-uret.py   →  assets/efekt/*.mp3 ve oyun/sesler.js
# Yönlü sesler 5 konumda (sol, sol-orta, orta, sağ-orta, sağ) ve önde / arkada (arkada boğuk) üretilir.
import os
import subprocess
import tempfile
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CIKIS = os.path.join(KOK, 'assets', 'efekt')
rng = np.random.default_rng(42)


def t(sure):
    return np.arange(int(SR * sure)) / SR


def zarf(n, a=0.005, r=None, egri=4.0):
    """a: atak (sn), kalan kısım üstel söner."""
    x = np.ones(n)
    na = max(1, int(a * SR))
    x[:na] = np.linspace(0, 1, na)
    kalan = n - na
    if kalan > 0:
        x[na:] = np.exp(-egri * np.linspace(0, 1, kalan))
    return x


def gurultu(sure):
    return rng.uniform(-1, 1, int(SR * sure))


def filtre(x, tur, f, derece=4):
    if isinstance(f, (list, tuple)):
        f = [min(max(20, v), SR / 2 - 100) for v in f]
    else:
        f = min(max(20, f), SR / 2 - 100)
    sos = butter(derece, f, btype=tur, fs=SR, output='sos')
    return sosfilt(sos, x)


def sinus(f, sure, faz=0):
    tt = t(sure)
    if callable(f):
        frek = f(tt)
        return np.sin(2 * np.pi * np.cumsum(frek) / SR + faz)
    return np.sin(2 * np.pi * f * tt + faz)


def testere(f, sure):
    tt = t(sure)
    frek = f(tt) if callable(f) else np.full_like(tt, f)
    faz = np.cumsum(frek) / SR
    return 2 * (faz - np.floor(faz + 0.5))


def kaydir(x, sn):
    return np.concatenate([np.zeros(int(sn * SR)), x])


def topla(*parcalar):
    n = max(len(p) for p in parcalar)
    s = np.zeros(n)
    for p in parcalar:
        s[: len(p)] += p
    return s


def normal(x, tepe=0.9):
    m = np.max(np.abs(x)) or 1
    return x / m * tepe


# ---------------- Efektler ----------------
def kilic():
    s = filtre(gurultu(0.16), 'bandpass', [1500, 6000]) * zarf(int(0.16 * SR), 0.03, egri=6)
    halka = sum(sinus(f, 0.35) * zarf(int(0.35 * SR), 0.002, egri=7) * g for f, g in [(1250, 1), (1870, 0.7), (2710, 0.5), (3900, 0.3)])
    return normal(topla(s * 0.6, kaydir(halka * 0.5, 0.08)))


def topuz():
    vur = sinus(lambda x: 120 - 60 * x / 0.25, 0.25) * zarf(int(0.25 * SR), 0.002, egri=8)
    g = filtre(gurultu(0.12), 'lowpass', 900) * zarf(int(0.12 * SR), 0.001, egri=10)
    return normal(topla(vur, g * 0.6))


def ok():
    hav = filtre(gurultu(0.2), 'bandpass', [2500, 7000]) * np.hanning(int(0.2 * SR)) * 0.6
    tak = filtre(gurultu(0.05), 'bandpass', [300, 1200]) * zarf(int(0.05 * SR), 0.001, egri=12)
    return normal(topla(hav, kaydir(tak, 0.2)))


def ates():
    n = int(0.45 * SR)
    cat = filtre(gurultu(0.45), 'lowpass', 2500) * np.linspace(0.3, 1, n) * zarf(n, 0.15, egri=3)
    ton = sinus(lambda x: 250 + 900 * x / 0.45, 0.45) * zarf(n, 0.05, egri=3) * 0.4
    return normal(topla(cat, ton))


def buz():
    s = np.zeros(int(0.5 * SR))
    for i in range(14):
        f = rng.uniform(2200, 4500)
        k = kaydir(sinus(f, 0.12) * zarf(int(0.12 * SR), 0.002, egri=8), rng.uniform(0, 0.35))
        s = topla(s, k * rng.uniform(0.3, 0.8))
    return normal(s)


def nota(f, sure, egri=5, harm=(1, 0.4, 0.2)):
    return sum(sinus(f * (i + 1), sure) * h for i, h in enumerate(harm)) * zarf(int(sure * SR), 0.004, egri=egri)


def arpej(frekler, ara, sure=0.5, egri=5):
    return normal(topla(*[kaydir(nota(f, sure, egri), i * ara) for i, f in enumerate(frekler)]))


def iska():
    n = int(0.22 * SR)
    return normal(filtre(gurultu(0.22), 'bandpass', [800, 3000]) * np.hanning(n)) * 0.6


def kritik():
    return normal(topla(kilic(), kaydir(sinus(3200, 0.4) * zarf(int(0.4 * SR), 0.002, egri=5) * 0.6, 0.05)))


def aldin():
    vur = sinus(lambda x: 160 - 90 * x / 0.2, 0.2) * zarf(int(0.2 * SR), 0.001, egri=9)
    inilti = filtre(testere(lambda x: 140 - 30 * x, 0.25), 'bandpass', [350, 900]) * zarf(int(0.25 * SR), 0.02, egri=4) * 0.6
    return normal(topla(vur, kaydir(inilti, 0.03)))


def oldur():
    n = int(0.55 * SR)
    ton = sinus(lambda x: 420 * np.exp(-x * 3), 0.55) * zarf(n, 0.005, egri=3)
    g = filtre(gurultu(0.55), 'lowpass', 1200) * zarf(n, 0.01, egri=5) * 0.3
    return normal(topla(ton, g))


def altin():
    c = lambda: (sinus(2400, 0.25) + 0.6 * sinus(3600, 0.25)) * zarf(int(0.25 * SR), 0.001, egri=7)
    return normal(topla(c(), kaydir(c() * 0.8, 0.09)))


def iksir():
    s = np.zeros(int(0.6 * SR))
    for i in range(9):
        f0 = rng.uniform(300, 600) + i * 40
        b = sinus(lambda x: f0 + 900 * x, 0.05) * zarf(int(0.05 * SR), 0.003, egri=5)
        s = topla(s, kaydir(b, i * 0.06 + rng.uniform(0, 0.02)))
    return normal(s) * 0.8


def adim(parlak):
    n = int(0.07 * SR)
    x = filtre(gurultu(0.07), 'lowpass', 700 if not parlak else 1100) * zarf(n, 0.003, egri=9)
    return normal(x) * 0.7


def carpma():
    return normal(topla(sinus(lambda x: 190 - 80 * x / 0.15, 0.15) * zarf(int(0.15 * SR), 0.001, egri=8), filtre(gurultu(0.06), 'lowpass', 500) * zarf(int(0.06 * SR), 0.001, egri=10) * 0.5))


def hata():
    n = int(0.18 * SR)
    sq = np.sign(sinus(150, 0.18)) * zarf(n, 0.005, egri=2)
    return normal(filtre(sq, 'lowpass', 1200)) * 0.6


def olum():
    n = int(1.4 * SR)
    ton = sum(sinus(lambda x, f=f: f * np.exp(-x * 0.6), 1.4) for f in (220, 261, 330)) * zarf(n, 0.05, egri=2.5)
    return normal(ton) * 0.8


def dogus():
    n = int(0.9 * SR)
    s = sum(sinus(lambda x, f=f: f * (1 + x), 0.9) for f in (330, 440, 554)) * np.hanning(n)
    return normal(s) * 0.7


def odak():
    n = int(0.012 * SR)
    return normal(sinus(2000, 0.012) * zarf(n, 0.0005, egri=6)) * 0.35


def sinir():
    return normal(sinus(120, 0.12) * zarf(int(0.12 * SR), 0.002, egri=6)) * 0.6


def etkinles():
    return normal(topla(sinus(900, 0.05) * zarf(int(0.05 * SR), 0.001, egri=8), kaydir(sinus(1400, 0.06) * zarf(int(0.06 * SR), 0.001, egri=8), 0.04))) * 0.5


def kalp():
    v = lambda g: sinus(lambda x: 70 - 20 * x / 0.12, 0.12) * zarf(int(0.12 * SR), 0.003, egri=7) * g
    return normal(topla(v(1), kaydir(v(0.7), 0.2)))


def isinlan():
    n = int(1.2 * SR)
    s = filtre(gurultu(1.2), 'bandpass', [1500, 5000]) * np.hanning(n) * 0.4
    s = topla(s, sinus(lambda x: 300 + 1200 * x / 1.2, 1.2) * np.hanning(n) * 0.5)
    return normal(s) * 0.7


def kalkan():
    n = int(0.6 * SR)
    s = topla(sinus(lambda x: 90 + 60 * x, 0.6) * zarf(n, 0.02, egri=3), buz() * 0.4)
    return normal(s)


def sonar():
    n = int(0.09 * SR)
    return normal(topla(sinus(1100, 0.09), 0.3 * sinus(2200, 0.09)) * zarf(n, 0.003, egri=5)) * 0.7


def hedef():
    return arpej([880, 1320], 0.06, 0.12, egri=6) * 0.6


def su():
    n = int(2.4 * SR)
    x = filtre(gurultu(2.4), 'bandpass', [400, 2500]) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t(2.4)))
    for i in range(18):
        f0 = rng.uniform(600, 1400)
        x = topla(x, kaydir(sinus(lambda q: f0 + 500 * q / 0.04, 0.04) * zarf(int(0.04 * SR), 0.003, egri=6) * 0.25, rng.uniform(0, 2.3)))
    return normal(x * np.hanning(n)) * 0.7


# Canavar sesleri
def kurt():
    n = int(0.7 * SR)
    am = 0.6 + 0.4 * np.sin(2 * np.pi * 28 * t(0.7))
    hir = filtre(gurultu(0.7), 'bandpass', [180, 650]) * am
    alt = filtre(testere(lambda x: 85 + 15 * np.sin(6 * x), 0.7), 'lowpass', 400) * 0.5
    return normal(topla(hir, alt) * zarf(n, 0.08, egri=2.5))


def domuz():
    tek = lambda: filtre(testere(lambda x: 120 - 40 * x, 0.22), 'bandpass', [250, 700]) * (0.6 + 0.4 * np.sin(2 * np.pi * 22 * t(0.22))) * zarf(int(0.22 * SR), 0.01, egri=3)
    return normal(topla(tek(), kaydir(tek() * 0.8, 0.27)))


def goblin():
    s = np.zeros(1)
    for i in range(4):
        f0 = rng.uniform(650, 1000)
        c = sinus(lambda x: f0 + 120 * np.sin(2 * np.pi * 30 * x) + 300 * x, 0.09) * zarf(int(0.09 * SR), 0.005, egri=3)
        s = topla(s, kaydir(c, i * 0.11))
    return normal(s)


def bagiris(f0, f1=700, f2=1200, sure=0.35):
    kaynak = testere(lambda x: f0 * (1 + 0.15 * x), sure)
    sesli = filtre(kaynak, 'bandpass', [f1 * 0.7, f1 * 1.3]) + 0.6 * filtre(kaynak, 'bandpass', [f2 * 0.8, f2 * 1.2])
    return normal(sesli * zarf(int(sure * SR), 0.015, egri=3))


def orumcek():
    s = np.zeros(1)
    for i in range(7):
        c = filtre(gurultu(0.012), 'highpass', 2500) * zarf(int(0.012 * SR), 0.0005, egri=10)
        s = topla(s, kaydir(c, i * 0.035 + rng.uniform(0, 0.01)))
    return normal(s)


def golem():
    n = int(1.0 * SR)
    s = topla(sinus(lambda x: 48 + 6 * np.sin(4 * x), 1.0), filtre(gurultu(1.0), 'lowpass', 180) * 0.8)
    return normal(s * zarf(n, 0.12, egri=2))


def golge():
    n = int(0.8 * SR)
    return normal(filtre(gurultu(0.8), 'bandpass', [1800, 4200]) * np.hanning(n) * (0.7 + 0.3 * np.sin(2 * np.pi * 5 * t(0.8))))


def ejder():
    n = int(1.4 * SR)
    kaynak = topla(testere(lambda x: 75 + 20 * np.sin(2 * x), 1.4), gurultu(1.4) * 0.5)
    s = filtre(kaynak, 'bandpass', [150, 1100]) * zarf(n, 0.15, egri=2)
    return normal(s)


# ---------------- Yazma ----------------
def stereo(x, pan=0.0, arka=False):
    if arka:
        x = filtre(x, 'lowpass', 1400) * 0.8
    a = (pan + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)], axis=1)


def yaz(ad, veri):
    if veri.ndim == 1:
        veri = np.stack([veri, veri], axis=1)
    veri = np.clip(veri, -1, 1)
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as g:
        yol = g.name
    with wave.open(yol, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((veri * 32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', yol, '-b:a', '96k', os.path.join(CIKIS, ad + '.mp3')], check=True)
    os.remove(yol)


TEK = {
    'kilic': kilic, 'topuz': topuz, 'ok': ok, 'ates': ates, 'buz': buz, 'iyiles': lambda: arpej([523, 659, 784, 1047], 0.08, 0.6),
    'iska': iska, 'kritik': kritik, 'oldur': oldur, 'altin': altin, 'seviye': lambda: arpej([392, 494, 587, 784, 988], 0.11, 0.9, egri=3),
    'gorev': lambda: arpej([659, 988], 0.15, 0.7, egri=3), 'iksir': iksir, 'ganimet': lambda: arpej([1319, 1568, 1976, 2637], 0.05, 0.35),
    'adim1': lambda: adim(False), 'adim2': lambda: adim(True), 'carpma': carpma, 'hata': hata, 'olum': olum, 'dogus': dogus,
    'su': su, 'bolge': lambda: arpej([440, 554, 659], 0.12, 0.8, egri=3) * 0.7, 'kesif': lambda: arpej([784, 988, 1175, 1568], 0.07, 0.6, egri=4),
    'odak': odak, 'sinir': sinir, 'etkinles': etkinles, 'kalp': kalp, 'isinlan': isinlan, 'kalkan': kalkan, 'hedef': hedef,
}
YONLU = {
    'aldin': aldin, 'sonar': sonar, 'kurt': kurt, 'domuz': domuz, 'goblin': goblin, 'insan': lambda: bagiris(150),
    'ork': lambda: bagiris(95, 600, 1000, 0.45), 'orumcek': orumcek, 'golem': golem, 'golge': golge, 'ejder': ejder,
}
PANLAR = [-1.0, -0.5, 0.0, 0.5, 1.0]

if __name__ == '__main__':
    os.makedirs(CIKIS, exist_ok=True)
    for f in os.listdir(CIKIS):
        os.remove(os.path.join(CIKIS, f))
    adlar = []
    for ad, f in TEK.items():
        yaz(ad, f())
        adlar.append(ad)
    for ad, f in YONLU.items():
        x = f()
        for i, p in enumerate(PANLAR):
            for arka in (False, True):
                a = f'{ad}_{i}{"a" if arka else ""}'
                yaz(a, stereo(x, p, arka))
                adlar.append(a)
    satirlar = ['// Bu dosya araclar/efekt-uret.py ile üretildi; elle düzenleme.', 'export const SESLER = {']
    satirlar += [f"  {a}: require('../assets/efekt/{a}.mp3')," for a in adlar]
    satirlar += ['};', f"export const YONLU = {list(YONLU.keys())!r};".replace("'", "'"), '']
    with open(os.path.join(KOK, 'oyun', 'sesler.js'), 'w') as g:
        g.write('\n'.join(satirlar))
    print(len(adlar), 'ses üretildi')
