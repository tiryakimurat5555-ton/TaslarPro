# Konumlu sesleri tek dosyaya indirir (15 Kasım 2026, gerçek zamanlı 3B ses motoru: oyun/uzamsal.js).
# Eski biçim ses başına 4 dosyaydı: ad_L / ad_R (yalnız sol / sağ kulak, kaynağın 1,25 katı) ve boğuk ad_La / ad_Ra.
# Yeni biçim: ad.m4a (tek kanal, özgün düzey). Yön, boğukluk ve yankı artık çalarken hesaplanır.
# Kullanım: python3 araclar/konumlu-tekle.py [assets/efekt]
import os, subprocess, sys

klasor = sys.argv[1] if len(sys.argv) > 1 else 'assets/efekt'
n = 0
for f in sorted(os.listdir(klasor)):
    if not f.endswith('_L.m4a'):
        continue
    ad = f[:-len('_L.m4a')]
    giris = os.path.join(klasor, f)
    cikis = os.path.join(klasor, ad + '.m4a')
    # Sol kulak dosyasının sol kanalı = kaynak × 1,25 → 0,8 ile özgün düzeye döner
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', giris, '-af', 'pan=mono|c0=0.8*c0', '-c:a', 'aac', '-b:a', '96k', cikis], check=True)
    for ek in ('_L', '_R', '_La', '_Ra'):
        y = os.path.join(klasor, ad + ek + '.m4a')
        if os.path.exists(y):
            os.remove(y)
    n += 1
print(f'{n} konumlu ses tek dosyaya indirildi.')
