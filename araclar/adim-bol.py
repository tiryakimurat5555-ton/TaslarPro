# Adım seslerini hazırlar: ElevenLabs'in "altı ağır adım" kayıtlarını tek tek adımlara böler.
# Her zemin için en temiz 4 adım seçilir, ses düzeyleri eşitlenir, başa ve sona kısa yumuşatma konur.
# Kullanım: python3 araclar/adim-bol.py <ham klasörü> assets/efekt
# Girdi: <ham>/adim_<zemin>.mp3   Çıktı: assets/efekt/adim_<zemin>_0..3.mp3
import os
import subprocess
import sys

import numpy as np

HAM, CIKTI = sys.argv[1], sys.argv[2]
ORAN = 44100
ZEMINLER = ['ot', 'toprak', 'camur', 'su', 'kaya', 'yaprak', 'magara']
EN_UZUN = {'magara': 0.9, 'su': 0.75, 'camur': 0.65}  # yankı ve su sıçraması daha uzun sürer


def oku(yol):
    ham = subprocess.run(['ffmpeg', '-v', 'error', '-i', yol, '-ac', '1', '-ar', str(ORAN), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(ham, dtype=np.int16).astype(np.float32) / 32768


def yaz(yol, x):
    veri = (np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(ORAN), '-ac', '1', '-i', '-', '-b:a', '96k', yol], input=veri, check=True)


def zarf(x, pencere=0.01):
    n = int(ORAN * pencere)
    e = np.sqrt(np.convolve(x * x, np.ones(n) / n, mode='same'))
    return e


for z in ZEMINLER:
    yol = os.path.join(HAM, f'adim_{z}.mp3')
    if not os.path.exists(yol):
        print('yok:', yol)
        continue
    x = oku(yol)
    e = zarf(x)
    esik = max(np.percentile(e, 60) * 2.2, e.max() * 0.12)
    # Başlangıçlar: zarf eşiği aşınca, öncekinden en az 0,35 sn sonra
    baslar = []
    i = 0
    en_az = int(0.35 * ORAN)
    while i < len(e):
        if e[i] > esik:
            baslar.append(i)
            i += en_az
        else:
            i += 1
    uzun = EN_UZUN.get(z, 0.5)
    parcalar = []
    for b in baslar:
        bas = max(0, b - int(0.012 * ORAN))
        son = min(len(x), b + int(uzun * ORAN))
        # Bir sonraki adım başlamadan kes
        sonraki = [s for s in baslar if s > b]
        if sonraki:
            son = min(son, sonraki[0] - int(0.02 * ORAN))
        p = x[bas:son].copy()
        if len(p) < int(0.2 * ORAN):
            continue
        # Sonu sessizlikse kırp
        pe = zarf(p)
        dolu = np.where(pe > pe.max() * 0.04)[0]
        if len(dolu):
            p = p[: min(len(p), dolu[-1] + int(0.03 * ORAN))]
        tepe = float(np.abs(p).max())
        rms = float(np.sqrt(np.mean(p * p)))
        parcalar.append((tepe / (rms + 1e-9), rms, p))
    if not parcalar:
        print(z, ': adım bulunamadı')
        continue
    # En güçlü ve temiz (tepe/rms oranı yüksek: tek bir vuruş) 4 adım
    parcalar.sort(key=lambda t: -t[1])
    secilen = parcalar[:6]
    secilen.sort(key=lambda t: -t[0])
    secilen = secilen[:4]
    for n, (_, rms, p) in enumerate(secilen):
        # Düzey eşitleme: rms hedefi, tepe en çok -1 dB
        p = p * (0.12 / (rms + 1e-9))
        t = np.abs(p).max()
        if t > 0.89:
            p = p * (0.89 / t)
        g = int(0.004 * ORAN)
        p[:g] *= np.linspace(0, 1, g)
        c = min(len(p) // 3, int(0.06 * ORAN))
        p[-c:] *= np.linspace(1, 0, c)
        yaz(os.path.join(CIKTI, f'adim_{z}_{n}.mp3'), p)
    print(f'{z}: {len(baslar)} başlangıç, {len(parcalar)} parça, {len(secilen)} adım, süreler', [round(len(p) / ORAN, 2) for _, _, p in secilen])
