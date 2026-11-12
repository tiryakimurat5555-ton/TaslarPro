# Vahşi Yaşam ortam döngüleri: .sesler/ham/ortam_*.mp3 (ElevenLabs 30 sn, loop) -> kanallar eşitlenir, son 1,5 sn başa
# çapraz geçişle karıştırılır (kesintisiz 28,5 sn), -22 LUFS sabit kazanç, assets/efekt/ortam_*.m4a. Ham dosyaların klasöründe çalıştır.
import subprocess, sys, json, numpy as np, wave
X = 1.5
for ad in ['ortam_gunduz', 'ortam_gece', 'ortam_nehir']:
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f'{ad}.mp3','-ac','2','-ar','44100','-f','s16le',f'{ad}.raw'],check=True)
    a = np.frombuffer(open(f'{ad}.raw','rb').read(), dtype=np.int16).reshape(-1,2).astype(np.float32)/32768
    # Sol/sağ dengesizliği: kanalların gücü eşitlenir (sağdan soldan atlama olmasın)
    rms = np.sqrt((a**2).mean(axis=0)); a = a * (rms.mean()/np.maximum(rms,1e-6))
    n = int(X*44100); t = np.linspace(0, np.pi/2, n)[:,None]
    bas = a[:n]*np.sin(t) + a[-n:]*np.cos(t)
    dongu = np.concatenate([bas, a[n:-n]])
    # Yükseklik: ölç, sabit kazanç ile -22 LUFS
    open(f'{ad}_d.raw','wb').write((np.clip(dongu,-1,1)*32767).astype(np.int16).tobytes())
    o = subprocess.run(['ffmpeg','-hide_banner','-f','s16le','-ar','44100','-ac','2','-i',f'{ad}_d.raw','-af','loudnorm=print_format=json','-f','null','-'],capture_output=True,text=True).stderr
    I = float(json.loads(o[o.rindex('{'):])['input_i'])
    k = 10**((-22 - I)/20)
    dongu = np.tanh(dongu*k*1.1)/1.1
    open(f'{ad}_d.raw','wb').write((dongu*32767).astype(np.int16).tobytes())
    subprocess.run(['ffmpeg','-loglevel','error','-y','-f','s16le','-ar','44100','-ac','2','-i',f'{ad}_d.raw','-c:a','aac','-b:a','128k',f'/home/claude/taslarpro/assets/efekt/{ad}.m4a'],check=True)
    print(ad, 'süre', round(len(dongu)/44100,2), 'giriş', I, 'LUFS, kanal rms', rms.round(3))
