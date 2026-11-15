# Eski 3B ses biçimini (her ses için 10 dosya: 5 yön × önde/arkada, ad_0..4, ad_0a..4a) yeni konumlu ses biçimine çevirir:
# ses başına 4 dosya: ad_L / ad_R (önden gelen ses yalnız sol / yalnız sağ kulakta) ve ad_La / ad_Ra (arkadan ya da engelin
# ardından gelen boğuk sürüm). Yön ve uzaklık artık önceden pişirilmiş 5 konumdan değil, çalarken gerçek zamanlı hesaplanır:
# efekt.js iki kulağın düzeyini (eşit güçlü pan) kaynağın o anki yönüne göre ayarlar, hayvan ya da oyuncu dönerken ses de kayar.
# Kaynak olarak ortadaki (ad_2 / ad_2a) dosyanın sol kanalı alınır; eski dosyalar silinir.
# Kullanım: python3 araclar/konumlu-donustur.py [ad ...]   (ad verilmezse assets/efekt'teki bütün eski 3B sesler)
import subprocess, sys, os, glob, re
E = 'assets/efekt'
def taban_listesi():
    return sorted({re.sub(r'_2a\.(m4a|mp3)$', '', os.path.basename(f)) for f in glob.glob(f'{E}/*_2a.*')})
def bul(ad):
    for u in ('m4a', 'mp3'):
        if os.path.exists(f'{E}/{ad}.{u}'):
            return f'{E}/{ad}.{u}'
    return None
adlar = sys.argv[1:] or taban_listesi()
for b in adlar:
    on, arka = bul(f'{b}_2'), bul(f'{b}_2a')
    if not on or not arka:
        print('atlandı (eski biçimde değil):', b)
        continue
    for kaynak, ek in ((on, ''), (arka, 'a')):
        # Ortadaki dosyada iki kanal da kaynağın 0,884 katıydı; tek kulak dosyası 1,25 kat olsun ki ortada (0,707 × 1,25) eskisi gibi duyulsun
        for yan, pan in (('L', 'c0=1.414*c0|c1=0*c0'), ('R', 'c0=0*c0|c1=1.414*c0')):
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', kaynak, '-af', f'pan=stereo|{pan},alimiter=limit=0.95:level=false',
                            '-ar', '44100', '-c:a', 'aac', '-b:a', '96k', f'{E}/{b}_{yan}{ek}.m4a'], check=True)
    for f in glob.glob(f'{E}/{b}_[0-4].*') + glob.glob(f'{E}/{b}_[0-4]a.*'):
        os.remove(f)
    print('çevrildi:', b)
