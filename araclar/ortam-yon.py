# Yönlü ortam katmanları: assets/efekt/<ad>.m4a stereo döngüsünden sola ve sağa yatık iki sürüm üretir
# (<ad>_sol: sol kanal tam, sağ kanal %30; <ad>_sag tersi). Oyun ikisini aynı anda başlatır, düzeylerini kaynağın
# yönüne göre ayarlar (eşit güçlü pan): önde ikisi eşit ve özgün stereo duyulur, solda kalınca sol sürüm baskın olur.
# Kullanım: python3 araclar/ortam-yon.py ortam_nehir ortam_galeri ortam_kayalik
import subprocess, sys, numpy as np
E = 'assets/efekt'
for ad in sys.argv[1:]:
    r = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f'{E}/{ad}.m4a', '-ac', '2', '-ar', '44100', '-f', 's16le', '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(r, dtype=np.int16).reshape(-1, 2).astype(np.float32)
    for yon, (kl, kr) in (('sol', (1.0, 0.3)), ('sag', (0.3, 1.0))):
        b = a * np.array([kl, kr], dtype=np.float32)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', '44100', '-ac', '2', '-i', '-', '-c:a', 'aac', '-b:a', '112k', f'{E}/{ad}_{yon}.m4a'], input=np.clip(b, -32768, 32767).astype(np.int16).tobytes(), check=True)
        print(ad, yon, round(len(b) / 44100, 2), 'sn')
