# Tonlu sürekli sesler (motor, dron pervanesi) için döngü: kaydın düzgün (sabit devirli) bir bölümünden kesilir.
# Döngü sonu, başlangıçla en iyi örtüşen (ilinti en yüksek) noktadan seçilir; kısa doğrusal çapraz geçişle bağlanır
# (aynı perdeli iki parça eşit güçlü geçişte birbirini söndürüyordu). Uzunluk AAC çerçevesinin (1024) tam katıdır.
# Gövde, oynatıcının döngü başına dönüşü seyrek olsun diye ~hedef saniyeye kadar art arda eklenir.
# Kullanım (ham klasöründe): python3 dongu-kes.py <ad> <başlangıç sn> <bitiş sn> <çıktı adı> [hedef sn=16] [LUFS=-22]
import subprocess, sys, json, numpy as np
SR = 44100
ad, bas, bit, cikti = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
hedef = float(sys.argv[5]) if len(sys.argv) > 5 else 16
lufs = float(sys.argv[6]) if len(sys.argv) > 6 else -22
r = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f'{ad}.mp3', '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
a = np.frombuffer(r, dtype=np.int16).reshape(-1, 2).astype(np.float64) / 32768
rms = np.sqrt((a ** 2).mean(axis=0)); a = a * (rms.mean() / np.maximum(rms, 1e-6))
m = a.mean(axis=1)
S = int(bas * SR); E = int(bit * SR)
n = int(0.12 * SR)
bas_parca = m[S:S + n]
en, enE = -2, None
for k in range(1, (E - S) // 1024 + 1):
    e = S + k * 1024
    if e - S < 0.6 * (E - S) or e + n > len(m): continue
    p = m[e:e + n]
    c = (p * bas_parca).sum() / (np.sqrt((p ** 2).sum() * (bas_parca ** 2).sum()) + 1e-12)
    if c > en: en, enE = c, e
L = enE - S
t = np.linspace(0, 1, n)[:, None]
govde = a[S:enE].copy()
# Perdeli (ilintili) seste doğrusal, gürültü gibi (ilintisiz) seste eşit güçlü geçiş
if en >= 0.5: govde[:n] = a[S:S + n] * t + a[enE:enE + n] * (1 - t)
else: govde[:n] = a[S:S + n] * np.sin(t * np.pi / 2) + a[enE:enE + n] * np.cos(t * np.pi / 2)
tur = max(1, int(round(hedef * SR / L)))
dongu = np.tile(govde, (tur, 1))
raw = f'/tmp/{cikti}_d.raw'
open(raw, 'wb').write((np.clip(dongu, -1, 1) * 32767).astype(np.int16).tobytes())
o = subprocess.run(['ffmpeg', '-hide_banner', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', raw, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(json.loads(o[o.rindex('{'):])['input_i'])
dongu = np.tanh(dongu * 10 ** ((lufs - I) / 20) * 1.1) / 1.1
open(raw, 'wb').write((dongu * 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', raw, '-c:a', 'aac', '-b:a', '128k', f'/home/claude/taslarpro/assets/efekt/{cikti}.m4a'], check=True)
print(cikti, 'gövde', round(L / SR, 3), 'sn, ilinti', round(en, 3), 'tur', tur, 'toplam', round(len(dongu) / SR, 2), 'sn')
