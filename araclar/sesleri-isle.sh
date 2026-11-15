#!/bin/bash
# ElevenLabs'ten indirilen ham sesleri (.sesler/ham/*.mp3) oyuna hazırlar ve oyun/sesler.js'i yazar.
#  - Baştaki sessizliği kırpar, her sesi hedef yüksekliğe (LUFS) getirir, tepe sınırlayıcı uygular.
#  - Hayvan sesleri konumlu olur: ad_L / ad_R (tek kulak) ve ad_La / ad_Ra (arkadan ya da engelin ardından boğuk);
#    yönü ve uzaklığı efekt.js çalarken gerçek zamanlı hesaplar.
#  - Ortam sesleri döngüye uygun olsun diye sonu başına yumuşak geçişle bağlanır.
# Kullanım: bash araclar/sesleri-isle.sh <ham klasörü>
set -e
GIRDI=${1:-.sesler/ham}
CIKTI=assets/efekt
GECICI=$(mktemp -d)
mkdir -p "$CIKTI"
UC_B="kurt tilki domuz ayi yilan akrep sirtlan timsah leopar kartal aslan gergedan dustu fil zebra suaygiri manda ceylan zurafa gnu cita impala yabankopegi babun yangin_citirti kutupayisi fok mors beluga rengeyigi miskokuzu kutupkurdu kutuptilkisi kutuptavsani imparatorpengueni adelipengueni weddellfoku leoparfoku orka filfoku kanguru koala emu vombat dingo kaplan hintfili cital sambar gaur langur takhi karleopari saiga mogolkurdu dzeren argali kizilgeyik karaca yabandomuzu vasak kiziltilki porsuk dagkecisi kulan hintleopari tembelayi dhole cizgilisirtlan altincakal barasingha nilgay muntjak dortboynuzlu rhesus deve perentie kuol bilbi"
hedef() {
  case "$1" in
    ortam_*) echo -26 ;;
    k_*) echo -17 ;;
    h_*) echo -16 ;;
    menu_*) echo -24 ;;
    bildirim_*|deklansor|durbun_odak|kayit_*|fener_tik|fermuar|numune_sise|video_kamera) echo -20 ;;
    gok_uzak) echo -22 ;;
    yagmur_baslangic|tasma|tel_sok|tuzak_kur|telsiz|dron_*) echo -19 ;;
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
  UC=0
  if echo " $UC_B " | grep -q " $ad "; then UC=1; KIS="atrim=0:2.6,afade=t=out:st=2.2:d=0.4,"; fi
  # Küçük canlı çağrıları (k_): 3B, en çok 3,6 sn (Aşama 17)
  case "$ad" in k_*) UC=1; KIS="atrim=0:3.6,afade=t=out:st=3.1:d=0.5," ;; esac
  # Hayvanların gündelik sesleri (h_): 3B, en çok 4 sn (Ses efektleri genişlemesi)
  # Hayvanların zemine göre koşu sesleri (kosu_<tür>_<zemin>): 3B, 2 sn; arka sürümde yankı yok (yankı metalik çınlatıyordu)
  case "$ad" in kosu_*) UC=1; KIS="atrim=0:2.2,afade=t=out:st=1.9:d=0.3," ;; esac
  case "$ad" in h_*) UC=1; KIS="atrim=0:4,afade=t=out:st=3.4:d=0.6," ;; esac
  ffmpeg -loglevel error -y -i "$f" -af "silenceremove=start_periods=1:start_threshold=-45dB,${KIS}volume=${KAZANC}dB,alimiter=limit=0.79:level=false,areverse,silenceremove=start_periods=1:start_threshold=-55dB,afade=t=in:d=0.08,areverse" -ac 1 -ar 44100 "$GECICI/m.wav"
  if [ "$UC" = 1 ]; then
    # Konumlu ses (15 Kasım 2026): ses başına 4 dosya. ad_L / ad_R önden gelen ses yalnız sol / yalnız sağ kulakta;
    # ad_La / ad_Ra arkadan ya da engelin ardından gelen boğuk sürüm. Yön ve uzaklığı efekt.js çalarken gerçek zamanlı hesaplar.
    YANKI=",aecho=0.8:0.6:35:0.25"; case "$ad" in kosu_*) YANKI="" ;; esac
    for yan in L R; do
      if [ "$yan" = L ]; then PAN="c0=1.25*c0|c1=0*c0"; else PAN="c0=0*c0|c1=1.25*c0"; fi
      ffmpeg -loglevel error -y -i "$GECICI/m.wav" -af "pan=stereo|${PAN},alimiter=limit=0.95:level=false" -c:a aac -b:a 96k "$CIKTI/${ad}_${yan}.m4a"
      ffmpeg -loglevel error -y -i "$GECICI/m.wav" -af "lowpass=f=1300,lowpass=f=1800,volume=-2dB${YANKI},pan=stereo|${PAN},alimiter=limit=0.95:level=false" -c:a aac -b:a 96k "$CIKTI/${ad}_${yan}a.m4a"
    done
    echo "$ad: konumlu (4 dosya), $I -> $H LUFS"
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
