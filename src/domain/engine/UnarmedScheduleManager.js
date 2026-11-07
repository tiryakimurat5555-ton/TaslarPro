// UnarmedScheduleManager.kt'den taşındı (birebir).
import * as kt from '../../kt.js';
import { UnarmedShowType } from '../model.js';

/**
 * Taş Hisar ve 2. Bölge Silahsız Arena Takvim Sistemi.
 * Belirli gün aralıklarında dönüşümlü olarak İnsan İnsana Estetik Düello,
 * Vahşi Canavar, Yaratık Sürüsü ve Pehlivan Güreşi dövüşleri takvime bağlanır.
 */
export class UnarmedScheduleDay extends kt.Data {
  static T = 'UnarmedScheduleDay';
  static defaults() {
    return {
      dayNumber: undefined,
      showType: undefined,
      title: undefined,
      icon: undefined,
      description: undefined,
      isToday: undefined,
    };
  }
}
kt.Data.register(UnarmedScheduleDay);

export const UnarmedScheduleManager = {
  /**
   * Verilen gün numarasına göre o gün arenada hangi gösterinin düzenlendiğini belirler.
   * 4 günlük döngü:
   * Gün % 4 == 1: Vahşi Canavar Boğuşması
   * Gün % 4 == 2: Zarafet & Estetik Düellosu (İnsan İnsana)
   * Gün % 4 == 3: Aç Kurt/Yaratık Sürüsü
   * Gün % 4 == 0: Garnizon Pehlivan Güreşi
   */
  getScheduledShowType(day) {
    const normalizedDay = day <= 0 ? 1 : day;
    switch (normalizedDay % 4) {
      case 1:
        return UnarmedShowType.SINGLE_BEAST;
      case 2:
        return UnarmedShowType.AESTHETIC_DUEL;
      case 3:
        return UnarmedShowType.BEAST_PACK;
      case 0:
        return UnarmedShowType.GLADIATOR_BRAWL;
      default:
        return UnarmedShowType.AESTHETIC_DUEL;
    }
  },

  /**
   * Oyuncunun günleri takip edebilmesi için bugünden itibaren önümüzdeki günlerin
   * takvim programını döndürür.
   */
  getScheduleForecast(currentDay, daysAhead = 4) {
    const safeDay = currentDay <= 0 ? 1 : currentDay;
    return kt.until(0, daysAhead).map((offset) => {
      const targetDay = safeDay + offset;
      const type = this.getScheduledShowType(targetDay);
      let desc;
      switch (type) {
        case UnarmedShowType.AESTHETIC_DUEL:
          desc = 'İpek ve keten kuşamlar, yırtılan kumaşlar, eklem kilitleri ve kansız teslimiyet.';
          break;
        case UnarmedShowType.SINGLE_BEAST:
          desc = 'Arenaya salınan aç çöl sırtlanı veya vahşi mağara ayısıyla tekil boğuşma.';
          break;
        case UnarmedShowType.BEAST_PACK:
          desc = 'Birden fazla aç bozkır tazısının çevik sürü saldırısına karşı hayatta kalma.';
          break;
        case UnarmedShowType.GLADIATOR_BRAWL:
          desc = 'Ağır cüsseli garnizon pehlivanlarıyla kemik çatlatan saf kas ve bel kündesi güreşi.';
          break;
      }
      return new UnarmedScheduleDay({
        dayNumber: targetDay,
        showType: type,
        title: type.title,
        icon: type.icon,
        description: desc,
        isToday: offset === 0,
      });
    });
  },
};
