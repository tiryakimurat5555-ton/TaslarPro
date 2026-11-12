#!/bin/bash
# ElevenLabs'ten indirilen ham sesleri (.sesler/ham/*.mp3) oyuna hazırlar ve oyun/sesler.js'i yazar.
#  - Baştaki sessizliği kırpar, her sesi hedef yüksekliğe (LUFS) getirir, tepe sınırlayıcı uygular.
#  - Hayvan sesleri ve "dustu" 3B olur: 5 konum (0 sol ... 4 sağ, eşit güçlü pan + kulaklar arası gecikme)
#    ve her konumun arkadan gelen boğuk sürümü (alçak geçiren süzgeç): ad_0 .. ad_4, ad_0a .. ad_4a.
#  - Ortam sesleri döngüye uygun olsun diye sonu başına yumuşak geçişle bağlanır.
# Kullanım: bash araclar/sesleri-isle.sh <ham klasörü>
set -e
GIRDI=${1:-.sesler/ham}
CIKTI=assets/efekt
GECICI=$(mktemp -d)
mkdir -p "$CIKTI"
UC_B="kurt tilki domuz ayi yilan akrep sirtlan timsah leopar kartal aslan gergedan dustu fil zebra suaygiri manda ceylan zurafa gnu cita impala yabankopegi babun kosu_toynak kosu_hafif kosu_agir kosu_pati"
hedef() {
  case "$1" in
    ortam_*) echo -26 ;;
    yarali) echo -17 ;;
    iska) echo -19 ;;
    altin) echo -20 ;;
    seviye) echo -16 ;;
    sopa|bicak|kilic|balta|mizrak|yay) echo -15 ;;
    *) echo -15 ;;
  esac
}
yukseklik() { ffmpeg -hide_banner -i "$1" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}'; }

for f in "$GIRDI"/*.mp3; do
  ad=$(basename "$f" .mp3)
  H=$(hedef "$ad")
  I=$(yukseklik "$f")
  KAZANC=$(python3 -c "print(round($H - ($I), 2))")
  case "$ad" in
    ortam_DEVRE_DISI)
      # Döngü: 1,5 sn'lik sonu başına bindir
      ffmpeg -loglevel error -y -i "$f" -ac 1 -ar 44100 "$GECICI/a.wav"
      SURE=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$GECICI/a.wav")
      X=$(python3 -c "print(min(1.5, $SURE/4))")
      ffmpeg -loglevel error -y -i "$GECICI/a.wav" -i "$GECICI/a.wav" -filter_complex \
        "[0]atrim=start=$X,asetpts=N/SR/TB[g];[1]atrim=0:$X,asetpts=N/SR/TB[b];[g][b]acrossfade=d=$X:c1=tri:c2=tri,volume=${KAZANC}dB,alimiter=limit=0.79:level=false" \
        -ac 2 -c:a aac -b:a 96k "$CIKTI/$ad.m4a"
      echo "$ad: döngü, $I -> $H LUFS"
      continue
      ;;
  esac
  KIS=""
  if echo " $UC_B " | grep -q " $ad "; then KIS="atrim=0:2.6,afade=t=out:st=2.2:d=0.4,"; fi
  ffmpeg -loglevel error -y -i "$f" -af "silenceremove=start_periods=1:start_threshold=-45dB,${KIS}volume=${KAZANC}dB,alimiter=limit=0.79:level=false,areverse,silenceremove=start_periods=1:start_threshold=-55dB,afade=t=in:d=0.08,areverse" -ac 1 -ar 44100 "$GECICI/m.wav"
  if echo " $UC_B " | grep -q " $ad "; then
    for i in 0 1 2 3 4; do
      read SOL SAG GS GD <<< $(python3 -c "
import math
p=($i-2)/2
a=(p+1)*math.pi/4
# kulaklar arası gecikme: uzak kulak en çok 0,6 ms geç duyar
gs=round(max(0,p)*0.6,2); gd=round(max(0,-p)*0.6,2)
print(round(math.cos(a)*1.25,3), round(math.sin(a)*1.25,3), gs, gd)")
      ffmpeg -loglevel error -y -i "$GECICI/m.wav" -af "pan=stereo|c0=${SOL}*c0|c1=${SAG}*c0,adelay=${GS}|${GD},alimiter=limit=0.89:level=false" -c:a aac -b:a 96k "$CIKTI/${ad}_${i}.m4a"
      ffmpeg -loglevel error -y -i "$GECICI/m.wav" -af "lowpass=f=1300,lowpass=f=1800,volume=-2dB,pan=stereo|c0=${SOL}*c0|c1=${SAG}*c0,adelay=${GS}|${GD},aecho=0.8:0.6:35:0.25,alimiter=limit=0.89:level=false" -c:a aac -b:a 96k "$CIKTI/${ad}_${i}a.m4a"
    done
    echo "$ad: 3B (10 dosya), $I -> $H LUFS"
  else
    ffmpeg -loglevel error -y -i "$GECICI/m.wav" -c:a aac -b:a 96k "$CIKTI/$ad.m4a"
    echo "$ad: $I -> $H LUFS"
  fi
done
rm -rf "$GECICI"

# oyun/sesler.js: require tablosu (elle düzenlenmez)
{
  echo "// Bu dosya araclar/sesleri-isle.sh ile üretildi; elle düzenleme."
  echo "export const SESLER = {"
  for f in $(ls "$CIKTI" | sort); do
    ad="${f%.*}"
    echo "  '$ad': require('../assets/efekt/$f'),"
  done
  echo "};"
} > oyun/sesler.js
echo "oyun/sesler.js yazıldı ($(ls "$CIKTI" | wc -l) ses)."
