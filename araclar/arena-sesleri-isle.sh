#!/bin/bash
# ElevenLabs'ten indirilen ham arena seslerini (.sesler/ham/*.mp3) oyuna hazırlar: baştaki sessizliği kırpar,
# her sesi hedef yüksekliğe (LUFS) getirir, tepe sınırlayıcıyla -1 dBTP'yi aşmasını önler, AAC m4a yazar.
# Kullanım: bash araclar/arena-sesleri-isle.sh
set -e
GIRDI=.sesler/ham
CIKTI=assets/ses/arena
mkdir -p "$CIKTI"
hedef() {
  case "$1" in
    seyirci) echo -20 ;;                      # döngü: zemin sesi, oyunda ayrıca kısılır
    seyirci_*) echo -15 ;;                    # tepkiler
    kritik|nakavt) echo -12 ;;
    siyrilma) echo -17 ;;
    kanama) echo -18 ;;
    *) echo -14 ;;                            # vuruşlar, blok, beraberlik
  esac
}
for f in "$GIRDI"/*.mp3; do
  ad=$(basename "$f" .mp3)
  I=$(ffmpeg -hide_banner -i "$f" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
  H=$(hedef "$ad")
  KAZANC=$(python3 -c "print(round($H - ($I), 2))")
  if [ "$ad" = "seyirci" ]; then
    FILTRE="volume=${KAZANC}dB,alimiter=limit=0.79:level=false"
  else
    FILTRE="silenceremove=start_periods=1:start_threshold=-45dB,volume=${KAZANC}dB,alimiter=limit=0.79:level=false,areverse,afade=t=in:d=0.06,areverse"
  fi
  ffmpeg -loglevel error -y -i "$f" -af "$FILTRE" -ac 1 -ar 44100 -c:a pcm_s16le "/tmp/arena-$ad.wav"
  # Sınırlayıcı yüksekliği düşürmüş olabilir: ikinci geçişte kalan farkı kapat (en çok 3 tur)
  for tur in 1 2 3; do
    I2=$(ffmpeg -hide_banner -i "/tmp/arena-$ad.wav" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
    FARK=$(python3 -c "d=$H-($I2); print(round(d,2) if abs(d)>0.7 else 0)")
    [ "$FARK" = "0" ] && break
    ffmpeg -loglevel error -y -i "/tmp/arena-$ad.wav" -af "volume=${FARK}dB,alimiter=limit=0.79:level=false" "/tmp/arena-$ad-2.wav"
    mv "/tmp/arena-$ad-2.wav" "/tmp/arena-$ad.wav"
  done
  ffmpeg -loglevel error -y -i "/tmp/arena-$ad.wav" -c:a aac -b:a 128k "$CIKTI/$ad.m4a"
  rm -f "/tmp/arena-$ad.wav"
  echo "$ad: $I LUFS -> hedef $H"
done
