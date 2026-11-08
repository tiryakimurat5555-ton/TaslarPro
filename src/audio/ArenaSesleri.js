// 1v1 arena dövüşü için ElevenLabs ile üretilmiş ses efektleri (8 Kasım, Murat istedi).
// Ham dosyalar: .sesler/ham/*.mp3; oyun dosyaları araclar/arena-sesleri-isle.sh ile assets/ses/arena/*.m4a'ya
// hazırlanır (baştaki sessizlik kırpılır, yükseklik eşitlenir: vuruşlar ~-14/-18 LUFS, seyirci tepkileri -15, döngü -20).
import { CombatEvent, EquipmentSlot } from '../domain/model.js';

function yukle() {
  try {
    return {
      seyirci: require('../../assets/ses/arena/seyirci.m4a'),
      seyirci_cos: require('../../assets/ses/arena/seyirci_cos.m4a'),
      seyirci_zafer: require('../../assets/ses/arena/seyirci_zafer.m4a'),
      seyirci_yenilgi: require('../../assets/ses/arena/seyirci_yenilgi.m4a'),
      vurus_kilic: require('../../assets/ses/arena/vurus_kilic.m4a'),
      vurus_gurz: require('../../assets/ses/arena/vurus_gurz.m4a'),
      vurus_balta: require('../../assets/ses/arena/vurus_balta.m4a'),
      vurus_hancer: require('../../assets/ses/arena/vurus_hancer.m4a'),
      vurus_ok: require('../../assets/ses/arena/vurus_ok.m4a'),
      vurus_asa: require('../../assets/ses/arena/vurus_asa.m4a'),
      kritik: require('../../assets/ses/arena/kritik.m4a'),
      blok: require('../../assets/ses/arena/blok.m4a'),
      siyrilma: require('../../assets/ses/arena/siyrilma.m4a'),
      kanama: require('../../assets/ses/arena/kanama.m4a'),
      nakavt: require('../../assets/ses/arena/nakavt.m4a'),
      beraberlik: require('../../assets/ses/arena/beraberlik.m4a'),
    };
  } catch (e) {
    // bun testlerinde ses dosyası yüklenemez: adlar döner (SoundManager bunları sessizce atlar)
    const o = {};
    for (const ad of ['seyirci', 'seyirci_cos', 'seyirci_zafer', 'seyirci_yenilgi', 'vurus_kilic', 'vurus_gurz', 'vurus_balta', 'vurus_hancer', 'vurus_ok', 'vurus_asa', 'kritik', 'blok', 'siyrilma', 'kanama', 'nakavt', 'beraberlik'])
      o[ad] = ad;
    return o;
  }
}
export const ARENA_SESLERI = yukle();

/** Efektlerin yaklaşık süreleri (ms): metin aralığı hesabında ve üst üste binmeyi önlemede kullanılır. */
export const ARENA_SES_SURESI = {
  vurus_kilic: 1000,
  vurus_gurz: 1000,
  vurus_balta: 1000,
  vurus_hancer: 550,
  vurus_ok: 900,
  vurus_asa: 1000,
  kritik: 1000,
  blok: 1200,
  siyrilma: 900,
  kanama: 1000,
  nakavt: 1700,
  beraberlik: 1500,
  seyirci_cos: 3000,
  seyirci_zafer: 5000,
  seyirci_yenilgi: 4000,
};

function kucuk(s) {
  return String(s || '').toLocaleLowerCase('tr-TR');
}

/** Silah türünden vuruş sesi: oyuncu için kuşanılan silahın kategorisi, rakip için silah adı/türü. */
export function silahVurusSesi(silahEsyasi, silahMetni) {
  const kat = silahEsyasi && silahEsyasi.weaponCategory ? silahEsyasi.weaponCategory.name : null;
  switch (kat) {
    case 'SWORD':
      return 'vurus_kilic';
    case 'MACE':
      return 'vurus_gurz';
    case 'AXE':
      return 'vurus_balta';
    case 'DAGGER':
    case 'SPEAR':
      return 'vurus_hancer';
    case 'BOW':
      return 'vurus_ok';
    case 'STAFF':
      return 'vurus_asa';
    default:
      break;
  }
  const s = kucuk(silahMetni || (silahEsyasi && (silahEsyasi.weaponType + ' ' + silahEsyasi.name)));
  if (/(balta|nacak|teber)/.test(s)) return 'vurus_balta';
  if (/(gürz|topuz|tokmak|çekiç|zincir|pranga|gülle|sopa)/.test(s)) return 'vurus_gurz';
  if (/(yay|arbalet|\bok\b|cirit)/.test(s)) return 'vurus_ok';
  if (/(asa|değnek|büyü|tomar)/.test(s)) return 'vurus_asa';
  if (/(hançer|kama|mızrak|kargı|şiş|iğne|olta|kanca)/.test(s)) return 'vurus_hancer';
  if (/(kılıç|pala|kesik|bıçak|satır)/.test(s)) return 'vurus_kilic';
  return 'vurus_gurz'; // silahsız: tok darbe
}

/**
 * Bir hamle kaydı için çalınacak ses(ler). Dönüş: { sesler: [ad...], seyirci: ad|null }
 * oyuncuSilahi: oyuncunun kuşandığı silah eşyası; rakip: Enemy.
 */
export function hamleSesleri(log, oyuncuSilahi, rakip, oyuncuKazandi) {
  const metin = String(log.narrativeText || '');
  if (metin.includes('KAN KAYBI')) return { sesler: ['kanama'], seyirci: null };
  const vurus = log.isPlayerAttacker
    ? silahVurusSesi(oyuncuSilahi, null)
    : silahVurusSesi(rakip && rakip.equippedWeaponItem, rakip ? `${rakip.weaponType || ''} ${rakip.weaponName || ''}` : '');
  switch (log.event) {
    case CombatEvent.CRITICAL:
      return { sesler: ['kritik'], seyirci: 'seyirci_cos' };
    case CombatEvent.BLOCKED:
      return { sesler: ['blok'], seyirci: null };
    case CombatEvent.DODGED:
      return { sesler: ['siyrilma'], seyirci: null };
    case CombatEvent.DEFEAT:
      return { sesler: ['nakavt'], seyirci: oyuncuKazandi ? 'seyirci_zafer' : 'seyirci_yenilgi' };
    case CombatEvent.DRAW:
      return { sesler: ['beraberlik'], seyirci: 'seyirci_yenilgi' };
    default:
      return { sesler: [vurus], seyirci: null };
  }
}

/** Kuşanılan silah eşyası (Player.equipped). */
export function oyuncuSilahi(player) {
  const eq = player && player.equipped;
  return eq ? eq[EquipmentSlot.WEAPON] || null : null;
}
