# Adım seslerinin düzeyini eşitler (Aşama 17 düzeltmesi; Murat "adımlar iki atıp duraksıyor" dedi).
# Her adımın en yüksek 80 ms'lik penceresinin gücü aynı hedefe getirilir; böylece bazı adımlar (özellikle otta) kısık kalıp
# duyulmaz hâle gelmez. Kullanım: python3 araclar/adim-esitle.py assets/efekt
import glob, os, subprocess, sys
import numpy as np
KLASOR = sys.argv[1]
ORAN = 44100
HEDEF = 0.24  # en yüksek pencerenin rms'i
for yol in sorted(glob.glob(os.path.join(KLASOR, 'adim_*_[0-3].mp3'))):
    ham = subprocess.run(['ffmpeg', '-v', 'error', '-i', yol, '-ac', '1', '-ar', str(ORAN), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(ham, dtype=np.int16).astype(np.float32) / 32768
    n = int(0.08 * ORAN)
    e = np.sqrt(np.convolve(x * x, np.ones(n) / n, mode='same'))
    k = HEDEF / (e.max() + 1e-9)
    y = x * k
    t = np.abs(y).max()
    if t > 0.97:
        y = y * (0.97 / t)
    gecici = yol + '.wav'
    with open(gecici + '.raw', 'wb') as f:
        f.write((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(ORAN), '-ac', '1', '-i', gecici + '.raw', '-b:a', '96k', yol], check=True)
    os.remove(gecici + '.raw')
    print(os.path.basename(yol), 'kazanç', round(20 * np.log10(k * (min(1, 0.97 / t) if t > 0.97 else 1)), 1), 'dB')
