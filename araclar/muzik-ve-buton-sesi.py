import numpy as np, wave, sys, os

SR = 44100
out = sys.argv[1]

def yaz(ad, x):
    x = np.clip(x, -1, 1)
    with wave.open(os.path.join(out, ad), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

# Buton: kisa yumusak "pop"
t = np.arange(int(SR * 0.09)) / SR
f = 900 * np.exp(-t * 25) + 300
buton = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 45) * 0.8
yaz("buton.wav", buton)

# Arka plan muzigi: sakin muzik kutusu dongusu (16 olcu, 72 BPM civari)
bpm = 76
beat = 60 / bpm
olcu = 4 * beat
uzunluk = 8 * olcu
n = int(SR * uzunluk)
muz = np.zeros(n)

def nota(frek, bas, sure, guc):
    i0 = int(bas * SR)
    m = int(sure * SR)
    tt = np.arange(m) / SR
    zarf = np.exp(-tt * 3.2) * (1 - np.exp(-tt * 400))
    ses = (np.sin(2*np.pi*frek*tt) + 0.35*np.sin(2*np.pi*frek*2*tt) + 0.12*np.sin(2*np.pi*frek*3.01*tt)) * zarf * guc
    son = min(n, i0 + m)
    muz[i0:son] += ses[:son - i0]
    # dongu: tasan kismi basa ekle
    if i0 + m > n:
        kalan = i0 + m - n
        muz[:kalan] += ses[m - kalan:]

def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)

# Akorlar: C - Am - F - G (iki tur)
akorlar = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]] * 2
melodi = [
    [76, 79, 76, 72], [72, 76, 74, 72], [69, 72, 74, 72], [71, 74, 71, 67],
    [76, 79, 81, 79], [76, 72, 74, 76], [72, 69, 72, 74], [71, 67, 71, 72],
]
for o in range(8):
    b = o * olcu
    a = akorlar[o]
    nota(hz(a[0] - 12), b, olcu * 1.2, 0.18)
    for k in range(4):
        for j, m in enumerate(a):
            nota(hz(m), b + k * beat + j * beat / 3, beat * 2, 0.07)
    for k, m in enumerate(melodi[o]):
        nota(hz(m), b + k * beat, beat * 2.5, 0.16)

# Yumusak pad
tt = np.arange(n) / SR
pad = np.zeros(n)
for o in range(8):
    i0, i1 = int(o * olcu * SR), int((o + 1) * olcu * SR)
    for m in akorlar[o]:
        pad[i0:i1] += np.sin(2 * np.pi * hz(m - 12) * tt[i0:i1]) * 0.03
# pad gecislerini yumusat
k = int(0.05 * SR)
for o in range(1, 8):
    i = int(o * olcu * SR)
    pad[i - k:i + k] *= np.linspace(1, 0.3, k).tolist() + np.linspace(0.3, 1, k).tolist()
muz += pad
muz = muz / np.max(np.abs(muz)) * 0.6
yaz("muzik.wav", muz)
print("tamam", len(muz) / SR, "sn")
