# Kısa (1 sn) ElevenLabs ortam seslerinden 24 sn'lik döngü yapar: süzülmüş gürültüden rüzgâr zemini
# + kısa sesin rastgele zamanlarda, rastgele yön ve yükseklikte tekrarları. Kullanım: python3 araclar/ortam-yap.py <ham klasörü> <çıkış klasörü>
import sys, subprocess, numpy as np
from scipy.signal import butter, sosfilt
ham, cik = sys.argv[1], sys.argv[2]
SR = 44100; SURE = 24
ZEMIN = {  # (alçak geçiren Hz, yükseklik) — haritanın rüzgârı
  'ortam_orman': (700, 0.05), 'ortam_col': (900, 0.09), 'ortam_bataklik': (500, 0.04),
  'ortam_dag': (1100, 0.12), 'ortam_savan': (800, 0.05),
}
def oku(yol):
  b = subprocess.run(['ffmpeg', '-v', 'error', '-i', yol, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
  return np.frombuffer(b, dtype=np.float32).copy()
rng = np.random.default_rng(5)
for ad, (fc, sev) in ZEMIN.items():
  n = SR * SURE
  out = np.zeros((n, 2), np.float32)
  # Rüzgâr: beyaz gürültü, alçak geçiren, yavaş dalgalanan genlik
  gur = rng.standard_normal(n).astype(np.float32)
  gur = sosfilt(butter(2, fc, 'low', fs=SR, output='sos'), gur)
  gur /= np.abs(gur).max() + 1e-9
  t = np.arange(n) / SR
  zarf = 0.6 + 0.4 * np.sin(2 * np.pi * t / SURE * 2 + 1.3) * np.sin(2 * np.pi * t / SURE * 3)
  for k in (0, 1):
    out[:, k] += gur * zarf * sev * (1 + 0.15 * k)
  # Kısa ortam sesinin tekrarları
  parca = oku(f'{ham}/{ad}.mp3')
  if len(parca):
    parca /= np.abs(parca).max() + 1e-9
    L = len(parca)
    sol = np.minimum(1, np.arange(L) / (SR * 0.15)); sag = np.minimum(1, (L - np.arange(L)) / (SR * 0.25))
    parca = parca * sol * sag
    zaman = 0.0
    while zaman < SURE:
      bas = int(zaman * SR)
      oran = rng.uniform(0.94, 1.06)
      idx = np.arange(0, L - 1, oran)
      p = np.interp(idx, np.arange(L), parca).astype(np.float32) * rng.uniform(0.25, 0.6)
      pan = rng.uniform(-0.9, 0.9); a = (pan + 1) * np.pi / 4
      for k, g in ((0, np.cos(a)), (1, np.sin(a))):
        uc = min(n, bas + len(p))
        out[bas:uc, k] += p[: uc - bas] * g
        # Döngü sınırını aşan kısım başa sarılır (kesintisiz döngü)
        if bas + len(p) > n:
          out[: bas + len(p) - n, k] += p[n - bas :] * g
      zaman += rng.uniform(0.5, 1.6)
  out /= np.abs(out).max() + 1e-9
  out *= 0.7
  subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'loudnorm=I=-26:TP=-3:LRA=7', '-ar', str(SR), '-c:a', 'aac', '-b:a', '96k', f'{cik}/{ad}.m4a'], input=out.astype(np.float32).tobytes(), check=True)
  print(ad, 'yapıldı')
