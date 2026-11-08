// GameRepository.js — KT/data/GameRepository.kt birebir taşıması (oyunun durum merkezi).
import * as kt from '../kt.js';
import { Data } from '../kt.js';
import {
  AccessoryCategory,
  ChestType,
  DayState,
  DiceGameResult,
  DuoMatchState,
  Equipment,
  EquipmentSlot,
  FighterDossier,
  FighterStanding,
  Gem,
  GemCraftingRules,
  GemType,
  HarvestResult,
  ItemRarity,
  ItemType,
  LabyrinthMatchState,
  LeagueFixtureMatch,
  LeagueMatchResult,
  LeagueState,
  LevelUpEvent,
  LiveCharacterProfile,
  PersonalityArchetype,
  Player,
  QuestType,
  RoomType,
  RumorCategory,
  SpectatorBet,
  StarterSkills,
  Stats,
  StorageChest,
  TrainingType,
  UnarmedMatchState,
  WeaponCategory,
  calculatePlayerTitleForRegion,
} from '../domain/model.js';
import { CombatEngine } from '../domain/engine/CombatEngine.js';
import { DuoCombatEngine } from '../domain/engine/DuoCombatEngine.js';
import { AestheticCombatEngine } from '../domain/engine/AestheticCombatEngine.js';
import { UnarmedScheduleManager } from '../domain/engine/UnarmedScheduleManager.js';
import { LabyrinthGenerator } from '../domain/engine/LabyrinthGenerator.js';
import { StarterContent } from './StarterContent.js';
import { TashisarGladiatorsData } from './TashisarGladiatorsData.js';
import { TashisarBlacksmithWeaponsData } from './TashisarBlacksmithWeaponsData.js';
import { TashisarWandMakerStavesData } from './TashisarWandMakerStavesData.js';
import { TashisarBowyerEquipmentData } from './TashisarBowyerEquipmentData.js';
import { TashisarLeatherworkerEquipmentData } from './TashisarLeatherworkerEquipmentData.js';
import { LabyrinthEcosystemLibrary } from './LabyrinthEcosystemLibrary.js';
import { CharacterRegistryData } from './CharacterRegistryData.js';
import { CompanionPavilionData } from './CompanionPavilionData.js';
import { SaveManager, SaveGameData } from './SaveManager.js';

/** Kotlin Float (32 bit) aritmetiğini taklit eder: (x * 0.35f).toInt() gibi ifadelerde sonuç aynı çıksın. */
const f32 = Math.fround;

/** Kotlin String.contains(other, ignoreCase = true) */
function containsIgnoreCase(metin, aranan) {
  return String(metin).toLowerCase().includes(String(aranan).toLowerCase());
}

export class HouseRequirementStatus extends Data {
  static T = 'GameRepository.HouseRequirementStatus';
  static defaults() {
    return { title: undefined, isMet: undefined, currentText: undefined, requiredText: undefined };
  }
}
Data.register(HouseRequirementStatus);

export class HouseTransformationStatus extends Data {
  static T = 'GameRepository.HouseTransformationStatus';
  static defaults() {
    return { canTransform: undefined, requirements: undefined, costGold: 500 };
  }
}
Data.register(HouseTransformationStatus);

// Yerel yardımcılar (Kotlin MutableList.remove(eleman) / removeAll / removeAt)
function removeFirst(arr, x) {
  const i = kt.indexOf(arr, x);
  if (i >= 0) {
    arr.splice(i, 1);
    return true;
  }
  return false;
}
function removeAllWhere(arr, fn) {
  let degisti = false;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (fn(arr[i])) {
      arr.splice(i, 1);
      degisti = true;
    }
  }
  return degisti;
}
function roomLevel(rooms, type, varsayilan = 1) {
  const r = kt.firstOrNull(rooms, (it) => it.type === type);
  return r != null ? r.level : varsayilan;
}

export class QuestClaimResult extends Data {
  static T = 'QuestClaimResult';
  static defaults() {
    return {
      questId: undefined,
      questTitle: undefined,
      narrative: undefined,
      goldEarned: undefined,
      expEarned: undefined,
      fameEarned: undefined,
      droppedScroll: null,
      droppedEquipment: null,
      intelUnlockedText: null,
    };
  }
}
Data.register(QuestClaimResult);

let _chapter2ExoticPoolCache = null;

export class GameRepository {
  constructor() {
    this._lastQuestClaimResult = new kt.MutableStateFlow(null);
    this.lastQuestClaimResult = this._lastQuestClaimResult.asStateFlow();

    this._player = new kt.MutableStateFlow(this.createInitialPlayer());
    this.player = this._player.asStateFlow();

    this._rooms = new kt.MutableStateFlow(StarterContent.createInitialRooms());
    this.rooms = this._rooms.asStateFlow();

    this._region = new kt.MutableStateFlow(StarterContent.createInitialRegion());
    this.region = this._region.asStateFlow();

    this._enemies = new kt.MutableStateFlow(StarterContent.createInitialEnemies());
    this.enemies = this._enemies.asStateFlow();

    this._tashisarEnemies = new kt.MutableStateFlow(TashisarGladiatorsData.createTashisarEnemies());
    this.tashisarEnemies = this._tashisarEnemies.asStateFlow();

    this._quests = new kt.MutableStateFlow(StarterContent.createInitialQuests());
    this.quests = this._quests.asStateFlow();

    this._adventures = new kt.MutableStateFlow(StarterContent.createInitialAdventures());
    this.adventures = this._adventures.asStateFlow();

    this._craftingRecipes = new kt.MutableStateFlow(StarterContent.createCraftingRecipes());
    this.craftingRecipes = this._craftingRecipes.asStateFlow();

    this._leagueState = new kt.MutableStateFlow(this.createInitialLeague());
    this.leagueState = this._leagueState.asStateFlow();

    this._tavernTales = new kt.MutableStateFlow(StarterContent.createTavernTales());
    this.tavernTales = this._tavernTales.asStateFlow();

    this._currentTale = new kt.MutableStateFlow(kt.firstOrNull(StarterContent.createTavernTales()));
    this.currentTale = this._currentTale.asStateFlow();

    this._lastDiceResult = new kt.MutableStateFlow(null);
    this.lastDiceResult = this._lastDiceResult.asStateFlow();

    this._currentBardSong = new kt.MutableStateFlow(null);
    this.currentBardSong = this._currentBardSong.asStateFlow();

    this._dayState = new kt.MutableStateFlow(new DayState());
    this.dayState = this._dayState.asStateFlow();

    this._levelUpEvent = new kt.MutableStateFlow(null);
    this.levelUpEvent = this._levelUpEvent.asStateFlow();

    this._invitationLetterEvent = new kt.MutableStateFlow(false);
    this.invitationLetterEvent = this._invitationLetterEvent.asStateFlow();

    // === YENİ ARENA DİSİPLİNLERİ (2v2 İttifak, Silahsız Gösteri, Labirent 3v3) ===
    this._duoMatchState = new kt.MutableStateFlow(new DuoMatchState());
    this.duoMatchState = this._duoMatchState.asStateFlow();

    this._unarmedMatchState = new kt.MutableStateFlow(
      new UnarmedMatchState({
        currentOpponent: kt.firstOrNull(UnarmedMatchState.sampleOpponents),
        showDrawn: true,
      }),
    );
    this.unarmedMatchState = this._unarmedMatchState.asStateFlow();
    this._unarmedCombatResult = new kt.MutableStateFlow(null);
    this.unarmedCombatResult = this._unarmedCombatResult.asStateFlow();

    this._labyrinthMatchState = new kt.MutableStateFlow(new LabyrinthMatchState());
    this.labyrinthMatchState = this._labyrinthMatchState.asStateFlow();

    this._activeLabyrinthRun = new kt.MutableStateFlow(null);
    this.activeLabyrinthRun = this._activeLabyrinthRun.asStateFlow();

    this._labyrinthMessage = new kt.MutableStateFlow(null);
    this.labyrinthMessage = this._labyrinthMessage.asStateFlow();


    // init
    this.spinDuoLottery();
    this.drawLabyrinthMatch();

    this._otomatikKayitKur();
  }

  // ---------------------------------------------------------------------------
  // Otomatik kayıt (8 Kasım, Murat: her ilerleme kaydedilsin). Kotlin sürümü yalnız belli anlarda
  // kaydediyordu; burada kayıtlı her durum değiştiğinde 1,5 sn sonra kaydedilir (bu süre içindeki
  // değişiklikler tek kayıtta birleşir). Oyun başlamadan (yeni oyun / devam seçilmeden) hiçbir şey yazılmaz, böylece
  // açılıştaki varsayılan durum eski kaydın üzerine yazılamaz.
  // ---------------------------------------------------------------------------
  _otomatikKayitKur() {
    this._kayitEtkin = false;
    this._kayitZamanlayici = null;
    const akislar = [this._player, this._dayState, this._leagueState, this._rooms, this._enemies];
    for (const a of akislar) a.subscribe(() => this._kayitPlanla());
    // Görev ve macera listeleri saniyede bir (geçen süre için) yenilenir; yalnız durumları değişince
    // (başladı, bitti, ödül alındı, liste değişti) kaydedilir. Geçen süre arka plana geçerken yazılır.
    const imza = (liste) => (liste || []).map((x) => `${x.id}:${x.isRunning ? 1 : 0}${x.isFinished ? 1 : 0}${x.isClaimed ? 1 : 0}`).join('|');
    for (const a of [this._quests, this._adventures]) {
      let son = imza(a.value);
      a.subscribe((v) => {
        const yeni = imza(v);
        if (yeni === son) return;
        son = yeni;
        this._kayitPlanla();
      });
    }
  }

  _kayitPlanla() {
    if (!this._kayitEtkin) return;
    // Zamanlayıcı zaten kuruluysa yeniden kurulmaz: görev sayacı gibi saniyede bir değişen durumlar
    // kaydı sonsuza dek ertelemesin (en geç 1,5 sn içinde yazılır).
    if (this._kayitZamanlayici) return;
    this._kayitZamanlayici = setTimeout(() => {
      this._kayitZamanlayici = null;
      this.autoSave();
    }, 1500);
    if (this._kayitZamanlayici && typeof this._kayitZamanlayici.unref === 'function') this._kayitZamanlayici.unref();
  }

  /** Bekleyen kaydı hemen yazar (uygulama arka plana geçerken). */
  kaydiHemenYaz() {
    if (!this._kayitEtkin) return Promise.resolve();
    if (this._kayitZamanlayici) {
      clearTimeout(this._kayitZamanlayici);
      this._kayitZamanlayici = null;
    }
    this.autoSave();
    return SaveManager.flush ? SaveManager.flush() : Promise.resolve();
  }

  get _chapter2ExoticPool() {
    if (_chapter2ExoticPoolCache == null) {
      _chapter2ExoticPoolCache = [
        ...TashisarBlacksmithWeaponsData.createExoticWeapons(),
        ...TashisarWandMakerStavesData.createAllWandEquipment(),
        ...TashisarBowyerEquipmentData.createAllBowyerEquipment(),
        ...TashisarLeatherworkerEquipmentData.createAllLeatherworkerEquipment(),
      ];
    }
    return _chapter2ExoticPoolCache;
  }

  clearQuestClaimResult() {
    this._lastQuestClaimResult.value = null;
  }

  clearLabyrinthMessage() {
    this._labyrinthMessage.value = null;
  }

  getFullGladiatorPool() {
    return [...this._enemies.value, ...this._tashisarEnemies.value];
  }

  spinDuoLottery() {
    const pool = kt.shuffled(this.getFullGladiatorPool());
    if (pool.length >= 3) {
      const ally = pool[0];
      const enemy1 = pool[1];
      const enemy2 = pool[2];
      const randomCondition = kt.random(DuoMatchState.defaultConditions);
      this._duoMatchState.value = new DuoMatchState({
        ally: ally,
        enemy1: enemy1,
        enemy2: enemy2,
        condition: randomCondition,
        isLotterySpinning: false,
        lotteryDrawn: true,
      });
    }
  }

  selectUnarmedShowType(type) {
    const candidates = UnarmedMatchState.sampleOpponents.filter((it) => it.showType === type);
    const opponent = kt.randomOrNull(candidates) ?? kt.first(UnarmedMatchState.sampleOpponents);
    this._unarmedMatchState.value = this._unarmedMatchState.value.copy({
      selectedShowType: type,
      currentOpponent: opponent,
      showDrawn: true,
    });
  }

  drawUnarmedOpponent() {
    const randomOpponent = kt.random(UnarmedMatchState.sampleOpponents);
    this._unarmedMatchState.value = this._unarmedMatchState.value.copy({
      selectedShowType: randomOpponent.showType,
      currentOpponent: randomOpponent,
      showDrawn: true,
    });
  }

  simulateUnarmedMatch(opponentOverride = null) {
    const playerCurrent = this._player.value;
    const opp = opponentOverride ?? this._unarmedMatchState.value.currentOpponent ?? kt.first(UnarmedMatchState.sampleOpponents);
    const entryFee = this._unarmedMatchState.value.entryFee;
    const goldAfterFee = Math.max(0, playerCurrent.gold - entryFee);

    const result = AestheticCombatEngine.simulateDuel(playerCurrent.copy({ gold: goldAfterFee }), opp);

    // Room bonuses for rewards
    const trophyRoomLevel = roomLevel(this._rooms.value, RoomType.TROPHY_HALL);
    const trainingRoomLevel = roomLevel(this._rooms.value, RoomType.TRAINING_GROUND);
    const treasuryLevel = roomLevel(this._rooms.value, RoomType.TREASURY);

    const finalExp = result.playerWon ? kt.toInt(result.expEarned * (1.0 + (trainingRoomLevel - 1) * 0.1)) : 20;

    const finalFame = result.playerWon ? kt.toInt(result.fameEarned * (1.0 + (trophyRoomLevel - 1) * 0.1)) : 0;

    const extraGold = result.playerWon ? (treasuryLevel - 1) * 4 : 0;
    const finalGold = result.playerWon ? result.goldEarned + extraGold : 0;

    const [expUpdatedPlayer, levelEvent] = this.processExpGain(playerCurrent, finalExp);
    if (levelEvent != null) {
      this._levelUpEvent.value = levelEvent;
    }

    const regionId = expUpdatedPlayer.currentRegionId;
    const fameMap = { ...expUpdatedPlayer.regionFame };
    const currentFame = fameMap[regionId] ?? 0;
    const updatedFame = kt.coerceIn(currentFame + finalFame, 0, 100);
    fameMap[regionId] = updatedFame;

    const newGlobalFame = kt.coerceAtLeast(expUpdatedPlayer.globalFame + finalFame, 0);
    const newTitle = calculatePlayerTitleForRegion(regionId, updatedFame, expUpdatedPlayer.hasGarrisonPass);

    this._player.value = expUpdatedPlayer.copy({
      gold: goldAfterFee + finalGold,
      regionFame: fameMap,
      globalFame: newGlobalFame,
      title: newTitle,
      currentHealth: result.playerFinalHp > 0 ? result.playerFinalHp : 25,
      encounteredEnemyIds: kt.setPlus(expUpdatedPlayer.encounteredEnemyIds, opp.id),
    });

    this._dayState.value = this._dayState.value.copy({ isArenaMatchDoneToday: true });
    this._unarmedCombatResult.value = result;
    return result;
  }

  dismissUnarmedCombatModal() {
    this._unarmedCombatResult.value = null;
  }

  selectLabyrinthTactic(tactic) {
    this._labyrinthMatchState.value = this._labyrinthMatchState.value.copy({ selectedTactic: tactic });
  }

  drawLabyrinthMatch() {
    const pool = kt.shuffled(this.getFullGladiatorPool());
    if (pool.length >= 5) {
      const allies = [pool[0], pool[1]];
      const opponents = [pool[2], pool[3], pool[4]];
      const randomTrap = kt.random(LabyrinthMatchState.defaultTraps);
      this._labyrinthMatchState.value = this._labyrinthMatchState.value.copy({
        allies: allies,
        opponents: opponents,
        activeTrap: randomTrap,
        matchDrawn: true,
      });
    }
  }

  startLabyrinthRun(requestedBiome = null) {
    const current = this._player.value;
    const entryCost = 35;
    if (current.gold < entryCost) {
      this._labyrinthMessage.value = `Labirente girmek için en az ${entryCost} altına ihtiyacın var!`;
      return false;
    }

    this._player.value = current.copy({ gold: current.gold - entryCost });
    const gladiators = this.getFullGladiatorPool();
    const run = LabyrinthGenerator.generateRun(requestedBiome, current.level, gladiators);
    this._activeLabyrinthRun.value = run;
    this._labyrinthMessage.value = `Labirent kapıları kilitlendi! ${run.themeTitle} başladı.`;
    return true;
  }

  resolveCurrentHazard(actionType) {
    const run = this._activeLabyrinthRun.value;
    if (run == null) return [false, 'Aktif bir labirent oturumu yok.'];
    const chamber = kt.getOrNull(run.chambers, run.currentChamberIndex);
    if (chamber == null) return [false, 'Geçersiz oda.'];
    const hazard = chamber.hazard;
    if (hazard == null) return [true, 'Bu geçitte herhangi bir aktif tuzak bulunmuyor.'];

    const player = this._player.value;
    const randomRoll = kt.Random.nextInt(1, 10);

    let isSuccess;
    switch (actionType) {
      case 'AGILITY':
        isSuccess = player.totalStats.speed + randomRoll >= hazard.agilityThreshold;
        break;
      case 'SHIELD': {
        const hasShield = player.equipped[EquipmentSlot.SHIELD] != null;
        const shieldBonus = hasShield ? 6 : 0;
        isSuccess = kt.idiv(player.totalStats.armor, 3) + shieldBonus + randomRoll >= hazard.strengthThreshold;
        break;
      }
      case 'STRENGTH':
        isSuccess = kt.idiv(player.totalStats.damage, 3) + randomRoll >= hazard.strengthThreshold;
        break;
      default:
        isSuccess = false;
    }

    // Yeni yankı üretme şansı (%45)
    if (run.participatingGladiatorIds.length >= 2 && kt.Random.nextInt(100) < 45) {
      const fA = kt.firstOrNull(this.getFullGladiatorPool(), (it) => it.id === run.participatingGladiatorIds[0]);
      const fB = kt.firstOrNull(this.getFullGladiatorPool(), (it) => it.id === run.participatingGladiatorIds[1]);
      if (fA != null) {
        const echo = LabyrinthEcosystemLibrary.generateDistantEcho(fA.name, fB?.name ?? null, fA.personality.psychology, run.biome);
        run.recentDistantEchoes.unshift(echo);
      }
    }

    if (isSuccess) {
      const narrative = `${hazard.avoidNarrative}`;
      this._labyrinthMessage.value = narrative;
      return [true, narrative];
    } else {
      const mitigation = f32(hazard.armorMitigationPercent / 100);
      const baseDmg = kt.coerceAtLeast(kt.toInt(f32(hazard.damageAmount * f32(1 - mitigation))), 6);
      const newHp = kt.coerceAtLeast(player.currentHealth - baseDmg, 1);
      this._player.value = player.copy({ currentHealth: newHp });
      const narrative = `${hazard.failureNarrative} (-${baseDmg} Can)`;
      this._labyrinthMessage.value = narrative;
      return [false, narrative];
    }
  }

  solveCurrentPuzzle(choiceIndex) {
    const run = this._activeLabyrinthRun.value;
    if (run == null) return [false, 'Aktif bir labirent oturumu yok.'];
    const chamber = kt.getOrNull(run.chambers, run.currentChamberIndex);
    if (chamber == null) return [false, 'Geçersiz oda.'];
    const puzzle = chamber.puzzle;
    if (puzzle == null) return [false, 'Bu odada çözülecek bir bulmaca yok.'];

    const isCorrect = choiceIndex === 0 || kt.Random.nextInt(100) < 60;
    const player = this._player.value;

    if (isCorrect) {
      const newGold = player.gold + puzzle.rewardGold;
      const currentFame = player.regionFame[player.currentRegionId] ?? 0;
      const updatedRegionFame = { ...player.regionFame };
      updatedRegionFame[player.currentRegionId] = kt.coerceAtMost(currentFame + puzzle.rewardFame, 100);
      this._player.value = player.copy({ gold: newGold, regionFame: updatedRegionFame });
      const narrative = `${puzzle.solvedNarrative} (+${puzzle.rewardGold} Altın, +${puzzle.rewardFame} Şöhret)`;
      this._labyrinthMessage.value = narrative;
      return [true, narrative];
    } else {
      const narrative = `${puzzle.failNarrative}`;
      this._labyrinthMessage.value = narrative;
      return [false, narrative];
    }
  }

  interactChamberGladiator(action) {
    const run = this._activeLabyrinthRun.value;
    if (run == null) return ['', 'Aktif bir labirent oturumu yok.'];
    const chamber = kt.getOrNull(run.chambers, run.currentChamberIndex);
    if (chamber == null) return ['', 'Geçersiz oda.'];
    const enemyId = chamber.enemyId;
    if (enemyId == null) return ['', 'Odada başka bir dövüşçü bulunmuyor.'];
    const enemy = kt.firstOrNull(this.getFullGladiatorPool(), (it) => it.id === enemyId);
    if (enemy == null) return ['', 'Dövüşçü bulunamadı.'];
    const psychology = enemy.personality.psychology;

    switch (action) {
      case 'ALLIANCE': {
        const decision = psychology.evaluateAllianceOffer();
        const narrative = `${enemy.name} ile göz göze geldin. ${decision.narrative}`;
        this._labyrinthMessage.value = narrative;
        return [decision.title, narrative];
      }
      case 'BETRAY': {
        const narrative = `${enemy.name}'a arkası dönükken pusu hamlesi yaptın! Kanlı bir çatışma başladı!`;
        this._labyrinthMessage.value = narrative;
        return ['Pusu', narrative];
      }
      default: {
        const narrative = `Kılıcını kınında tutarak ${enemy.name}'ın yanından temkinli mesafeyle geçip ilerledin.`;
        this._labyrinthMessage.value = narrative;
        return ['Temkinli Geçiş', narrative];
      }
    }
  }

  executeLabyrinthCombat(enemy) {
    const playerCurrent = this._player.value;
    const knownWeakness = playerCurrent.knownWeaknessIds.includes(enemy.id)
      ? kt.firstOrNull(StarterContent.getAllEnemyWeaknesses(), (it) => it.enemyId === enemy.id)
      : null;

    const result = CombatEngine.simulateBattle(playerCurrent, enemy, null, knownWeakness);

    const run = this._activeLabyrinthRun.value;
    if (result.isPlayerWinner) {
      const [updatedPlayer, levelEvent] = this.processExpGain(playerCurrent, result.earnedExp);
      if (levelEvent != null) {
        this._levelUpEvent.value = levelEvent;
      }
      const newInventory = updatedPlayer.inventory.slice();
      if (result.droppedItem != null) {
        newInventory.push(result.droppedItem);
      }
      this._player.value = updatedPlayer.copy({
        gold: updatedPlayer.gold + result.earnedGold,
        currentHealth: Math.max(1, result.finalPlayerHp),
        inventory: newInventory,
        encounteredEnemyIds: kt.setPlus(updatedPlayer.encounteredEnemyIds, enemy.id),
      });

      // Odadaki gladyatörü temizle
      if (run != null) {
        const chambers = run.chambers.slice();
        const currentChamber = kt.getOrNull(chambers, run.currentChamberIndex);
        if (currentChamber != null) {
          chambers[run.currentChamberIndex] = currentChamber.copy({ enemyId: null });
          this._activeLabyrinthRun.value = run.copy({ chambers: chambers });
        }
      }
      this._labyrinthMessage.value = `${enemy.name} kılıcının altında yere serildi! (+${result.earnedGold} Altın, +${result.earnedExp} EXP)`;
    } else {
      // Labirentte yenilgi: canı 15'e iner, labirent sona erer
      this._player.value = playerCurrent.copy({
        currentHealth: 15,
      });
      this._activeLabyrinthRun.value = null;
      this._labyrinthMessage.value = `${enemy.name} karşısında ağır yara alarak labirentten güçlükle geri çekildin...`;
    }
    return result;
  }

  openChamberChest() {
    const run = this._activeLabyrinthRun.value;
    if (run == null) return [0, 'Aktif bir labirent oturumu yok.'];
    const chamber = kt.getOrNull(run.chambers, run.currentChamberIndex);
    if (chamber == null) return [0, 'Geçersiz oda.'];
    const chest = chamber.chestReward;
    if (chest == null) return [0, 'Bu odada henüz açılmamış bir sandık yok.'];

    const goldFound = kt.Random.nextInt(chest.minGold, chest.maxGold + 1);
    const player = this._player.value;
    this._player.value = player.copy({ gold: player.gold + goldFound });

    const updatedChambers = run.chambers.slice();
    updatedChambers[run.currentChamberIndex] = chamber.copy({ chestReward: null });
    this._activeLabyrinthRun.value = run.copy({ chambers: updatedChambers });

    const narrative = `${chest.title} açıldı! İçinden ${goldFound} Altın ve değerli kalıntılar çıktı.`;
    this._labyrinthMessage.value = narrative;
    return [goldFound, narrative];
  }

  advanceLabyrinthChamber() {
    const run = this._activeLabyrinthRun.value;
    if (run == null) return false;
    const currentIndex = run.currentChamberIndex;

    if (currentIndex < run.chambers.length - 1) {
      const updatedChambers = run.chambers.slice();
      updatedChambers[currentIndex] = updatedChambers[currentIndex].copy({ isCleared: true });
      run.currentChamberIndex = currentIndex + 1;

      const nextChamber = run.chambers[run.currentChamberIndex];
      const atmEvent = kt.random(LabyrinthEcosystemLibrary.getAtmosphericEvents(run.biome));
      this._activeLabyrinthRun.value = run.copy({
        chambers: updatedChambers,
        currentChamberIndex: run.currentChamberIndex,
      });
      this._labyrinthMessage.value = `${nextChamber.title} odasına geçtin. ${atmEvent.soundText}`;
      return true;
    } else {
      const player = this._player.value;
      const rewardGold = kt.Random.nextInt(90, 160);
      const rewardExp = 150;
      const rewardFame = 6;
      const [updatedPlayer] = this.processExpGain(player.copy({ gold: player.gold + rewardGold }), rewardExp);
      const currentFame = updatedPlayer.regionFame[updatedPlayer.currentRegionId] ?? 0;
      const updatedRegionFame = { ...updatedPlayer.regionFame };
      updatedRegionFame[updatedPlayer.currentRegionId] = kt.coerceAtMost(currentFame + rewardFame, 100);
      const finalPlayer = updatedPlayer.copy({
        regionFame: updatedRegionFame,
        globalFame: updatedPlayer.globalFame + rewardFame,
      });
      this._player.value = finalPlayer;
      this._activeLabyrinthRun.value = null;
      this._labyrinthMessage.value = `TEBRİKLER! ${run.themeTitle} başarıyla tamamlandı ve gün ışığına çıktın! (+${rewardGold} Altın, +${rewardExp} Tecrübe, +${rewardFame} Şöhret)`;
      return false;
    }
  }

  abandonLabyrinthRun() {
    const run = this._activeLabyrinthRun.value;
    if (run == null) return;
    this._activeLabyrinthRun.value = null;
    this._labyrinthMessage.value = `${run.themeTitle} dehlizlerinden ayrılarak sağ salim arenaya döndün.`;
  }

  dismissLevelUpDialog() {
    this._levelUpEvent.value = null;
  }

  dismissInvitationLetter() {
    this._invitationLetterEvent.value = false;
  }

  get canTravelToRegion2() {
    return this._player.value.hasGarrisonPass || this._player.value.globalFame >= 100;
  }

  processExpGain(player, expGained) {
    let newExp = player.currentExp + expGained;
    let newLevel = player.level;
    let maxExp = player.maxExp;
    let leveledUp = false;

    while (newExp >= maxExp && newLevel < 100) {
      newExp -= maxExp;
      newLevel++;
      leveledUp = true;
      maxExp = player.copy({ level: newLevel }).maxExp;
    }

    const updatedPlayer = player.copy({
      level: newLevel,
      currentExp: newExp,
    });

    const event = leveledUp
      ? new LevelUpEvent({
          oldLevel: player.level,
          newLevel: newLevel,
          healthGained: (newLevel - player.level) * 15,
          damageGained: (newLevel - player.level) * 3,
          armorGained: (newLevel - player.level) * 1,
          speedGained: (newLevel - player.level) * 1,
          newMaxHealth: updatedPlayer.totalStats.maxHealth,
          nextLevelExp: updatedPlayer.maxExp,
        })
      : null;

    return [updatedPlayer, event];
  }

  createInitialPlayer() {
    const equippedMap = {
      [EquipmentSlot.HEAD]: StarterContent.clothWrap,
      [EquipmentSlot.CHEST]: StarterContent.rottenVest,
      [EquipmentSlot.GLOVES]: StarterContent.frayedGloves,
      [EquipmentSlot.PANTS]: StarterContent.raggedPants,
      [EquipmentSlot.BOOTS]: StarterContent.wornSandals,
      [EquipmentSlot.WEAPON]: StarterContent.crackedClub,
      [EquipmentSlot.SHIELD]: StarterContent.woodenBuckler,
      [EquipmentSlot.TALISMAN]: null,
      [EquipmentSlot.RING]: null,
    };

    const inventoryList = [StarterContent.boneAmulet, StarterContent.brassRing];

    const consumablesList = [StarterContent.healingSalve, StarterContent.mountainHerb, StarterContent.ancientScroll];

    const baseStats = new Stats({
      maxHealth: 100,
      damage: 1, // With cracked club (+2) it hits 1-3
      armor: 0, // With equipment wraps (+1 each) total armor = 3
      speed: 8,
      dodgeChancePercent: 3,
      critChancePercent: 3,
      blockChancePercent: 3,
    });

    return new Player({
      name: 'Sürgün Silahşör',
      title: 'Bilinmeyen Sürgün',
      level: 1,
      currentExp: 0,
      gold: 25,
      globalFame: 0, // Starts at 0
      baseStats: baseStats,
      currentHealth: 100, // Exactly 100 HP
      equipped: equippedMap,
      inventory: inventoryList,
      consumables: consumablesList,
      residenceTitle: 'Rutubetli Gladyatör Hücresi',
    });
  }

  createInitialLeague() {
    const initialStandings = [
      new FighterStanding({ id: 'morvath', name: 'Morvath', title: 'Isırgan Otu', matchesPlayed: 5, wins: 4, draws: 1, losses: 0, points: 13 }),
      new FighterStanding({ id: 'thyra', name: 'Thyra', title: 'Kemik Yaran', matchesPlayed: 5, wins: 4, draws: 0, losses: 1, points: 12 }),
      new FighterStanding({ id: 'vaelen', name: 'Vaelen', title: 'Kör Akbaba', matchesPlayed: 5, wins: 3, draws: 1, losses: 1, points: 10 }),
      new FighterStanding({ id: 'ghorak', name: 'Ghorak', title: 'Zincirli Hortlak', matchesPlayed: 5, wins: 3, draws: 0, losses: 2, points: 9 }),
      new FighterStanding({ id: 'xylar', name: 'Xylar', title: 'Demir Diş', matchesPlayed: 5, wins: 2, draws: 1, losses: 2, points: 7 }),
      new FighterStanding({ id: 'bregash', name: 'Bregash', title: 'Ters Pala', matchesPlayed: 5, wins: 2, draws: 0, losses: 3, points: 6 }),
      new FighterStanding({ id: 'orn', name: 'Orn', title: 'Balçık Yılanı', matchesPlayed: 5, wins: 1, draws: 2, losses: 2, points: 5 }),
      new FighterStanding({ id: 'kaelen', name: 'Kaelen', title: 'Kör Arbaletçi', matchesPlayed: 5, wins: 1, draws: 2, losses: 2, points: 5 }),
      new FighterStanding({ id: 'sarkoth', name: 'Sarkoth', title: 'Kum Akrebi', matchesPlayed: 5, wins: 1, draws: 1, losses: 3, points: 4 }),
      new FighterStanding({ id: 'zalmora', name: "Zal'Mora", title: 'Kül Kemiren', matchesPlayed: 5, wins: 1, draws: 1, losses: 3, points: 4 }),
      new FighterStanding({ id: 'khorvash', name: 'Khorvash', title: 'Tuz Gözlü', matchesPlayed: 5, wins: 0, draws: 2, losses: 3, points: 2 }),
      new FighterStanding({ id: 'player', name: 'Sürgün Silahşör', title: 'Bilinmeyen Sürgün', matchesPlayed: 0, wins: 0, draws: 0, losses: 0, points: 0, isPlayer: true }),
    ];
    const initialEnemies = StarterContent.createInitialEnemies();
    const initialFixture = this.generateWeeklyFixture(initialEnemies, 'Sürgün Silahşör');
    return new LeagueState({
      seasonName: 'Kırlangıç Kasabası Gladyatör Ligi',
      roundNumber: 6,
      standings: kt.sortedByDescending(initialStandings, (it) => it.points),
      currentFixture: initialFixture,
    });
  }

  generateWeeklyFixture(allEnemies, playerName = 'Sürgün Silahşör') {
    const shuffledEnemies = kt.shuffled(allEnemies);
    if (shuffledEnemies.length === 0) return [];

    const playerOpponent = kt.first(shuffledEnemies);
    const fixture = [];

    // 1. Oyuncunun kura eşleşmesi
    fixture.push(
      new LeagueFixtureMatch({
        fighter1Id: 'player',
        fighter1Name: playerName,
        fighter2Id: playerOpponent.id,
        fighter2Name: playerOpponent.name,
        isPlayerMatch: true,
        isCompleted: false,
      }),
    );

    // 2. Geriye kalan 10 dövüşçünün kendi aralarındaki 5 eşleşmesi (Toplam 6 maç)
    const remaining = kt.drop(shuffledEnemies, 1);
    for (let i = 0; i < remaining.length; i += 2) {
      if (i + 1 < remaining.length) {
        const npc1 = remaining[i];
        const npc2 = remaining[i + 1];
        fixture.push(
          new LeagueFixtureMatch({
            fighter1Id: npc1.id,
            fighter1Name: npc1.name,
            fighter2Id: npc2.id,
            fighter2Name: npc2.name,
            isPlayerMatch: false,
            isCompleted: false,
          }),
        );
      }
    }
    return fixture;
  }

  setPlayerName(newName) {
    const cleanName = newName.trim() || 'Sürgün Silahşör';
    const oldPlayer = this._player.value;
    const oldName = oldPlayer.name;

    this._player.value = oldPlayer.copy({ name: cleanName });

    const currentLeague = this._leagueState.value;
    const updatedStandings = currentLeague.standings.map((standing) => {
      if (standing.isPlayer || standing.name === oldName || standing.id === 'player') {
        return standing.copy({ name: cleanName });
      } else {
        return standing;
      }
    });
    const updatedFixture = currentLeague.currentFixture.map((fixture) => {
      const newF1 = fixture.fighter1Name === oldName || fixture.fighter1Name === 'Sürgün Silahşör' ? cleanName : fixture.fighter1Name;
      const newF2 = fixture.fighter2Name === oldName || fixture.fighter2Name === 'Sürgün Silahşör' ? cleanName : fixture.fighter2Name;
      return fixture.copy({ fighter1Name: newF1, fighter2Name: newF2 });
    });
    this._leagueState.value = currentLeague.copy({
      standings: updatedStandings,
      currentFixture: updatedFixture,
    });
    this.autoSave();
  }

  equipItem(item) {
    const current = this._player.value;
    const currentInSlot = current.equipped[item.slot] ?? null;

    const newInventory = current.inventory.slice();
    removeFirst(newInventory, item);
    if (currentInSlot != null) {
      newInventory.push(currentInSlot);
    }

    const newEquipped = { ...current.equipped };
    newEquipped[item.slot] = item;

    // Çift El & Menzilli Silah & Büyü Odağı Uyumu:
    if (item.weaponCategory === WeaponCategory.BOW || item.weaponType === 'yay') {
      // Yay takıldıysa: Kalkan veya Büyü Kitabı elinde tutulamaz (ok gereklidir).
      const currentOffhand = newEquipped[EquipmentSlot.SHIELD] ?? null;
      const isCurrentArrow = currentOffhand?.isArrow === true;
      if (!isCurrentArrow) {
        // Eğer ikincil elde kalkan veya büyü kitabı varsa çıkarıp çantaya koy
        if (currentOffhand != null) {
          newInventory.push(currentOffhand);
          newEquipped[EquipmentSlot.SHIELD] = null;
        }
        // Çantada ok veya cephane varsa en iyisini otomatik kuşan
        const bestArrow = kt.maxByOrNull(
          newInventory.filter((it) => it.isArrow),
          (it) => it.valueInGold,
        );
        if (bestArrow != null) {
          removeFirst(newInventory, bestArrow);
          newEquipped[EquipmentSlot.SHIELD] = bestArrow;
        }
      }
    } else if (item.weaponCategory === WeaponCategory.STAFF || item.weaponType === 'asa') {
      // Asa takıldıysa: Büyücüler ikincil elde büyü kitabı veya tomar taşımayı tercih eder.
      const currentOffhand = newEquipped[EquipmentSlot.SHIELD] ?? null;
      const isCurrentTome = currentOffhand?.isTome === true;
      if (!isCurrentTome) {
        // Çantada büyü kitabı veya tomar varsa en iyisini otomatik kuşan
        const bestTome = kt.maxByOrNull(
          newInventory.filter((it) => it.isTome),
          (it) => it.valueInGold,
        );
        if (bestTome != null) {
          if (currentOffhand != null) {
            newInventory.push(currentOffhand);
          }
          removeFirst(newInventory, bestTome);
          newEquipped[EquipmentSlot.SHIELD] = bestTome;
        }
      }
    } else if (item.slot === EquipmentSlot.WEAPON) {
      // Yakın dövüş silahı takıldıysa ve ikincil elde ok veya büyü kitabı takılıysa:
      // Çantada kalkan varsa kalkanı kuşanıp ok/kitabı çantaya al
      const currentOffhand = newEquipped[EquipmentSlot.SHIELD] ?? null;
      const isCurrentArrowOrTome = currentOffhand?.isArrow === true || currentOffhand?.isTome === true;
      if (isCurrentArrowOrTome) {
        const bestShield = kt.maxByOrNull(
          newInventory.filter((it) => it.isShield),
          (it) => it.valueInGold,
        );
        if (bestShield != null) {
          newInventory.push(currentOffhand);
          removeFirst(newInventory, bestShield);
          newEquipped[EquipmentSlot.SHIELD] = bestShield;
        }
      }
    } else if (item.isShield) {
      // Oyuncu eline Kalkan taktıysa ve ana elinde Yay varsa:
      // Yay çift elle kullanıldığı için yay çantaya alınır ve varsa en iyi yakın dövüş silahı takılır
      const currentWeapon = newEquipped[EquipmentSlot.WEAPON] ?? null;
      if (currentWeapon != null && (currentWeapon.weaponCategory === WeaponCategory.BOW || currentWeapon.weaponType === 'yay')) {
        newInventory.push(currentWeapon);
        newEquipped[EquipmentSlot.WEAPON] = null;
        const bestMelee = kt.maxByOrNull(
          newInventory.filter((it) => it.slot === EquipmentSlot.WEAPON && it.weaponCategory !== WeaponCategory.BOW && it.weaponType !== 'yay'),
          (it) => it.valueInGold,
        );
        if (bestMelee != null) {
          removeFirst(newInventory, bestMelee);
          newEquipped[EquipmentSlot.WEAPON] = bestMelee;
        }
      }
    } else if (item.isTome) {
      // Oyuncu eline Büyü Kitabı / Tomar taktıysa ve ana elinde Yay varsa:
      const currentWeapon = newEquipped[EquipmentSlot.WEAPON] ?? null;
      if (currentWeapon != null && (currentWeapon.weaponCategory === WeaponCategory.BOW || currentWeapon.weaponType === 'yay')) {
        newInventory.push(currentWeapon);
        newEquipped[EquipmentSlot.WEAPON] = null;
        const bestStaffOrMelee =
          kt.maxByOrNull(
            newInventory.filter((it) => it.slot === EquipmentSlot.WEAPON && (it.weaponCategory === WeaponCategory.STAFF || it.weaponType === 'asa')),
            (it) => it.valueInGold,
          ) ??
          kt.maxByOrNull(
            newInventory.filter((it) => it.slot === EquipmentSlot.WEAPON && it.weaponCategory !== WeaponCategory.BOW && it.weaponType !== 'yay'),
            (it) => it.valueInGold,
          );
        if (bestStaffOrMelee != null) {
          removeFirst(newInventory, bestStaffOrMelee);
          newEquipped[EquipmentSlot.WEAPON] = bestStaffOrMelee;
        }
      }
    }

    const updated = current.copy({
      equipped: newEquipped,
      inventory: newInventory,
    });
    this._player.value = updated.copy({
      currentHealth: Math.min(updated.currentHealth, updated.totalStats.maxHealth),
    });
    return true;
  }

  unequipItem(slot) {
    const current = this._player.value;
    const item = current.equipped[slot] ?? null;
    if (item == null) return false;

    const newInventory = [...current.inventory, item];
    const newEquipped = { ...current.equipped, [slot]: null };

    const updated = current.copy({
      equipped: newEquipped,
      inventory: newInventory,
    });
    this._player.value = updated.copy({
      currentHealth: Math.min(updated.currentHealth, updated.totalStats.maxHealth),
    });
    return true;
  }

  addGold(amount) {
    const current = this._player.value;
    this._player.value = current.copy({ gold: Math.max(0, current.gold + amount) });
    this.autoSave();
  }

  addItemToInventory(item) {
    const current = this._player.value;
    this._player.value = current.copy({ inventory: [...current.inventory, item] });
    this.autoSave();
  }

  useConsumable(item) {
    const current = this._player.value;
    if (current.level < item.requiredLevel) return false;
    if (item.buffEffect == null && current.currentHealth >= current.totalStats.maxHealth) return false;

    const index = current.consumables.findIndex((it) => it.id === item.id);
    if (index === -1) return false;

    const currentItem = current.consumables[index];
    const updatedConsumables = current.consumables.slice();
    if (currentItem.count > 1) {
      updatedConsumables[index] = currentItem.copy({ count: currentItem.count - 1 });
    } else {
      updatedConsumables.splice(index, 1);
    }

    const infirmaryLevel = roomLevel(this._rooms.value, RoomType.INFIRMARY);
    const bonusMult = 1.0 + (infirmaryLevel - 1) * 0.1;
    const finalHeal = item.healAmount > 0 ? kt.toInt(item.healAmount * bonusMult) : 0;

    const newHp = Math.min(current.totalStats.maxHealth, current.currentHealth + finalHeal);

    let updatedBuffs;
    if (item.buffEffect != null) {
      const existing = current.activeBuffs.slice();
      removeAllWhere(existing, (it) => it.id === item.buffEffect.id);
      existing.push(item.buffEffect);
      updatedBuffs = existing;
    } else {
      updatedBuffs = current.activeBuffs;
    }

    this._player.value = current.copy({
      currentHealth: newHp,
      consumables: updatedConsumables,
      activeBuffs: updatedBuffs,
    });
    return true;
  }

  startSpectatorBattle(fixtureMatch, selectedFighterName, amount) {
    const playerCurrent = this._player.value;
    const dayState = this._dayState.value;

    if (playerCurrent.gold < amount) {
      return [`Seyirci bahsi için yeterli altının yok! (${amount} Altın gerekli)`, null];
    }
    if (dayState.isDailySpectatorBetPlaced) {
      return ['Bugün zaten bir karşılaşmaya seyirci bahsi yatırdın!', null];
    }

    const allEnemies = this._enemies.value;
    const npc1 = kt.firstOrNull(allEnemies, (it) => it.id === fixtureMatch.fighter1Id || it.name === fixtureMatch.fighter1Name);
    const npc2 = kt.firstOrNull(allEnemies, (it) => it.id === fixtureMatch.fighter2Id || it.name === fixtureMatch.fighter2Name);

    if (npc1 == null || npc2 == null) {
      return ['Karşılaşmadaki dövüşçüler bulunamadı!', null];
    }

    // Bahis bedeli peşin düşülür
    this._player.value = playerCurrent.copy({ gold: playerCurrent.gold - amount });

    const bet = new SpectatorBet({
      matchId: `${npc1.name}_vs_${npc2.name}`,
      fighter1Name: npc1.name,
      fighter2Name: npc2.name,
      selectedFighterName: selectedFighterName,
      betAmount: amount,
      potentialMultiplier: 2.0,
      isResolved: false,
    });

    this._dayState.value = dayState.copy({
      isDailySpectatorBetPlaced: true,
      activeSpectatorBet: bet,
    });

    const result = CombatEngine.simulateDetailedNpcBattle(npc1, npc2, selectedFighterName, amount);

    return [null, result];
  }

  recordSpectatorMatchResult(result) {
    const currentLeague = this._leagueState.value;
    const standingsMap = { ...kt.associateBy(currentLeague.standings, (it) => it.id) };
    const playerCurrent = this._player.value;

    // 1. Dövüşçülerin lig puan durumlarını güncelle
    this.updateNpcStandingFromMatch(standingsMap, result.fighter1, result.fighter2, result.winnerName);

    // 2. Fikstürdeki bu maçı tamamlandı olarak işaretle
    const matchSummary = result.isDraw ? 'Berabere (+1 Puan)' : `${result.winnerName} Galip (+3 Puan)`;
    const updatedFixture = currentLeague.currentFixture.map((fixtureMatch) => {
      if (fixtureMatch.fighter1Name === result.fighter1.name && fixtureMatch.fighter2Name === result.fighter2.name) {
        return fixtureMatch.copy({ isCompleted: true, resultSummary: matchSummary });
      } else {
        return fixtureMatch;
      }
    });

    const recentMatchList = currentLeague.recentMatches.slice();
    recentMatchList.push(
      new LeagueMatchResult({
        fighter1Name: result.fighter1.name,
        fighter2Name: result.fighter2.name,
        winnerName: result.winnerName,
        scoreSummary: matchSummary,
        narrativeSnippet: result.isDraw ? 'Çifte nakavt ile berabere bitti.' : `${result.winnerName} kumlarda üstün geldi.`,
      }),
    );

    this._leagueState.value = currentLeague.copy({
      standings: kt.sortedByDescending(Object.values(standingsMap), (it) => it.points),
      currentFixture: updatedFixture,
      recentMatches: recentMatchList,
    });

    // 3. Bahsi çözümlendi ve günlük şart yerine getirildi olarak kaydet
    const bet = new SpectatorBet({
      matchId: `${result.fighter1.name}_vs_${result.fighter2.name}`,
      fighter1Name: result.fighter1.name,
      fighter2Name: result.fighter2.name,
      selectedFighterName: result.selectedFighterName,
      betAmount: result.betAmount,
      potentialMultiplier: 2.0,
      isResolved: true,
    });

    this._dayState.value = this._dayState.value.copy({
      isDailySpectatorBetPlaced: true,
      activeSpectatorBet: bet,
    });

    // 4. Bahis kazanıldıysa kazancı oyuncunun kesesine aktar
    if (result.betWon) {
      this._player.value = playerCurrent.copy({ gold: playerCurrent.gold + result.betWinnings });
    }
  }

  placeSpectatorBet(fixtureMatch, selectedFighterName, amount) {
    const [error] = this.startSpectatorBattle(fixtureMatch, selectedFighterName, amount);
    if (error != null) {
      return [false, error];
    }
    return [true, `${selectedFighterName} galibiyetine ${amount} Altın yatırıldı! Arenaya günlük katılım şartını yerine getirdin.`];
  }

  evolveNpcFightersDaily() {
    const currentEnemies = this._enemies.value.slice();
    const diaries = [];

    const currentLeague = this._leagueState.value;
    const leaderStanding = kt.firstOrNull(currentLeague.standings);
    const leaderName = leaderStanding?.name ?? null;

    currentEnemies.forEach((enemy, index) => {
      const personality = enemy.personality;
      let stats = enemy.stats;
      let gold = personality.gold + kt.Random.nextInt(15, 26);
      let condition = personality.currentCondition;
      const isLeader = enemy.name === leaderName;

      // Dynamic stat soft caps to keep combat challenging against upgraded player equipment
      const maxAllowedDamage = enemy.level * 3 + 14;
      const maxAllowedArmor = enemy.level * 2 + 8;
      const maxAllowedHealth = enemy.level * 25 + 90;

      const roll = kt.Random.nextInt(100);

      let diary;
      // Şampiyon / Lig Lideri Durumu
      if (isLeader) {
        if (roll < 55 && gold >= 24) {
          gold -= 22;
          const newDmg = kt.coerceAtMost(stats.damage + 1, maxAllowedDamage);
          const newArm = kt.coerceAtMost(stats.armor + 1, maxAllowedArmor);
          stats = stats.copy({
            damage: newDmg,
            armor: newArm,
            maxHealth: kt.coerceAtMost(stats.maxHealth + 6, maxAllowedHealth),
            blockChancePercent: kt.coerceAtMost(stats.blockChancePercent + 1, 30),
          });
          condition = 'Şampiyon Teçhizatı (Demirci Bakımı)';
          diary = `${enemy.name} unvanını kaptırmamak için Vorn'un demirci ocağına altın yağdırdı; silahının çeliğini dövdürüp göğüslük plakalarını perçinletti (+1 Hasar, +1 Zırh, +6 Can).`;
        } else {
          condition = 'Kasabanın Hedef Tahtası (Lider)';
          diary = `${enemy.name} lig zirvesinde kadeh kaldırırken diğer gladyatörlerin onun dövüş tarzını ezberlediğini fark etti.`;
        }
      }
      // HIRSLI: Demirci, Ağır Ağırlık Talimi ve Kondisyon
      else if (personality.archetype === PersonalityArchetype.HIRSLI) {
        if (roll < 45 && gold >= 22 && (stats.damage < maxAllowedDamage || stats.armor < maxAllowedArmor)) {
          gold -= 20;
          const newDmg = stats.damage < maxAllowedDamage ? stats.damage + 1 : stats.damage;
          const newArm = stats.armor < maxAllowedArmor ? stats.armor + 1 : stats.armor;
          stats = stats.copy({
            damage: newDmg,
            armor: newArm,
            maxHealth: kt.coerceAtMost(stats.maxHealth + 5, maxAllowedHealth),
          });
          condition = 'Bilenmiş Çelik (Demirci Bakımı)';
          diary = `${enemy.name} kazandığı altınla demirci ocağına uğradı; silahının ağzını kumtaşıyla biletip zırh perçinlerini sıktırdı (+1 Hasar, +1 Zırh).`;
        } else if (roll < 75) {
          stats = stats.copy({
            maxHealth: kt.coerceAtMost(stats.maxHealth + 6, maxAllowedHealth),
            critChancePercent: kt.coerceAtMost(stats.critChancePercent + 1, 25),
          });
          condition = 'Ağır Kütük İdmanı (+6 Can, +%1 Kritik)';
          diary = `${enemy.name} arenanın talim alanında kütük kaldırıp kum torbası dövdü; vuruş hassasiyetini ve kondisyonunu artırdı.`;
        } else if (gold >= 16) {
          gold -= 14;
          stats = stats.copy({ damage: kt.coerceAtMost(stats.damage + 1, maxAllowedDamage) });
          condition = 'Boğa Gücü İksiri (Simyacı)';
          diary = `${enemy.name} kasaba simyacısından boğa kanı ve pelin karışımı güç iksiri içip kaslarını şişirdi (+1 Hasar).`;
        } else {
          stats = stats.copy({ maxHealth: kt.coerceAtMost(stats.maxHealth + 3, maxAllowedHealth) });
          condition = 'Kum Torbası Talimi (+3 Can)';
          diary = `${enemy.name} gece boyunca kum torbası döverek kondisyonunu taze tuttu.`;
        }
      }
      // VAHSI: Yıkıcı Hasar, Testere Dişleri ve Simya Merhemleri
      else if (personality.archetype === PersonalityArchetype.VAHSI) {
        if (roll < 45 && stats.damage < maxAllowedDamage) {
          stats = stats.copy({
            damage: stats.damage + 1,
            critChancePercent: kt.coerceAtMost(stats.critChancePercent + 1, 25),
          });
          condition = 'Testere Dişli Ağız (+1 Hasar, +%1 Kritik)';
          diary = `${enemy.name} silahının kenarlarına testere dişleri açarak vahşi kanatıcı vuruşlar talim etti.`;
        } else if (roll < 75 && gold >= 18) {
          gold -= 15;
          stats = stats.copy({
            damage: kt.coerceAtMost(stats.damage + 1, maxAllowedDamage),
            maxHealth: kt.coerceAtMost(stats.maxHealth + 5, maxAllowedHealth),
          });
          condition = 'Dağ Kurdu Özü (Simyacı)';
          diary = `${enemy.name} simyacı tezgahından acı dağ kurdu yağı alıp yaralarını dağladı ve hiddetini biledi (+1 Hasar, +5 Can).`;
        } else {
          stats = stats.copy({
            armor: kt.coerceAtMost(stats.armor + 1, maxAllowedArmor),
            maxHealth: kt.coerceAtMost(stats.maxHealth + 4, maxAllowedHealth),
          });
          condition = 'Kül ve Kabuk Tabakası (+1 Zırh)';
          diary = `${enemy.name} arenanın kumlarına oturup yaralarını külle kapladı; sertleşen kabuk tenine zırh oldu.`;
        }
      }
      // KURNAZ: Simyacı Zehirleri, Çevik Sıyrılma ve Fırsatçılık
      else if (personality.archetype === PersonalityArchetype.KURNAZ) {
        if (roll < 40 && gold >= 18) {
          gold -= 16;
          stats = stats.copy({
            damage: kt.coerceAtMost(stats.damage + 1, maxAllowedDamage),
            dodgeChancePercent: kt.coerceAtMost(stats.dodgeChancePercent + 1, 25),
          });
          condition = 'Engerek Zehri & Hızlı Adım (Simyacı)';
          diary = `${enemy.name} simyacıdan aldığı sazlık engereği zehrini kınına emdirdi; hamlelerini ölümcül kıldı (+1 Hasar, +%1 Sıyrılma).`;
        } else if (roll < 75) {
          stats = stats.copy({
            dodgeChancePercent: kt.coerceAtMost(stats.dodgeChancePercent + 1, 25),
            speed: kt.coerceAtMost(stats.speed + (roll < 30 ? 1 : 0), 15),
          });
          condition = 'Gölge Adımları Talimi';
          diary = `${enemy.name} arenanın sütunları arasında gölge gibi kayarak hız ve sıyrılma adımları çalıştı.`;
        } else {
          condition = 'Bahis & Gözlem';
          diary = `${enemy.name} kasaba tellallarından rakiplerin sakatlık dedikodularını dinleyip zayıf noktalarını ezberledi.`;
        }
      }
      // GURURLU: Zırhçı Perçinleri, Kalkan Savunması ve Çelik Disiplini
      else if (personality.archetype === PersonalityArchetype.GURURLU) {
        if (roll < 50 && gold >= 20 && stats.armor < maxAllowedArmor) {
          gold -= 18;
          stats = stats.copy({
            armor: stats.armor + 1,
            blockChancePercent: kt.coerceAtMost(stats.blockChancePercent + 2, 30),
            maxHealth: kt.coerceAtMost(stats.maxHealth + 5, maxAllowedHealth),
          });
          condition = 'Takviyeli Kalkan Siperi (+1 Zırh, +%2 Blok)';
          diary = `${enemy.name} kalkan siperliğini usta demirciye perçinletip plaka kenarlarını kalınlaştırdı.`;
        } else if (roll < 80) {
          stats = stats.copy({
            damage: kt.coerceAtMost(stats.damage + 1, maxAllowedDamage),
            maxHealth: kt.coerceAtMost(stats.maxHealth + 4, maxAllowedHealth),
          });
          condition = 'Ağır Darbe Talimi (+1 Hasar)';
          diary = `${enemy.name} meşe kütüklerine kalkan vurup gard düşürme ve karşı darbe talimi yaptı.`;
        } else {
          condition = 'Şövalye Disiplini';
          diary = `${enemy.name} şafak vaktinde kılıç selamlama ritüelini tamamlayıp zırhını parlattı.`;
        }
      }
      // TEMBEL: Handa Kumar / İçki, Ancak Arada Bir Sürpriz Demirci veya Şans
      else if (personality.archetype === PersonalityArchetype.TEMBEL) {
        if (roll < 30) {
          stats = stats.copy({ speed: Math.max(5, stats.speed - 1) });
          condition = 'Mahmur & Baş Ağrısı (-1 Hız)';
          gold = Math.max(0, gold - 12);
          diary = `${enemy.name} Kırlangıç Hanı'nda fıçı dibini gördü. Arenaya esneyerek ve zonklayan bir başla çıkıyor (-1 Hız).`;
        } else if (roll < 60) {
          const winGold = 22;
          gold += winGold;
          condition = 'Keyfi Yerinde (Kumar Kazancı)';
          diary = `${enemy.name} handa barbut masasında zarları denk getirip +${winGold} Altın kazandı!`;
        } else if (roll < 80 && gold >= 20) {
          gold -= 18;
          stats = stats.copy({
            damage: kt.coerceAtMost(stats.damage + 1, maxAllowedDamage),
            armor: kt.coerceAtMost(stats.armor + 1, maxAllowedArmor),
          });
          condition = 'Rastgele Demirci Bakımı (+1 Hasar, +1 Zırh)';
          diary = `${enemy.name} han çıkışı rastladığı çırağa silahını ve zırhını temizletip sivriltti.`;
        } else {
          stats = stats.copy({ critChancePercent: kt.coerceAtMost(stats.critChancePercent + 1, 25) });
          condition = 'Uğurlu Muska (+%1 Kritik)';
          diary = `${enemy.name} handaki bir gezginden uğurlu çakıl taşı satın alıp kemerine taktı.`;
        }
      }
      // GIZEMLI: Mistik Meditasyon, Zehirli Koku Keseleri ve Can Artışı
      else {
        if (roll < 45 && gold >= 16) {
          gold -= 14;
          stats = stats.copy({
            damage: kt.coerceAtMost(stats.damage + 1, maxAllowedDamage),
            dodgeChancePercent: kt.coerceAtMost(stats.dodgeChancePercent + 1, 25),
          });
          condition = 'Mistik Çöl Merhemi (Simyacı)';
          diary = `${enemy.name} çöl kumu ve simya otlarını karıştırıp vücuduna sürdü; duyuları keskinleşti (+1 Hasar, +%1 Sıyrılma).`;
        } else if (roll < 75) {
          stats = stats.copy({
            dodgeChancePercent: kt.coerceAtMost(stats.dodgeChancePercent + 1, 25),
            maxHealth: kt.coerceAtMost(stats.maxHealth + 6, maxAllowedHealth),
          });
          condition = 'Tuz Kehaneti (+6 Can, +%1 Sıyrılma)';
          diary = `${enemy.name} tuz kadehinde rüzgarın sesini dinleyip darbelerden sıyrılma adımlarını prova etti.`;
        } else {
          condition = 'Mistik Meditasyon';
          diary = `${enemy.name} arenanın kızgın kumlarında bağdaş kurup rüzgarın fısıltılarını dinledi.`;
        }
      }

      const updatedPersonality = personality.copy({
        gold: gold,
        currentCondition: condition,
        latestDiary: diary,
        diaryHistory: kt.take([diary, ...personality.diaryHistory], 5),
      });

      currentEnemies[index] = enemy.copy({
        stats: stats,
        personality: updatedPersonality,
      });
      diaries.push(`${enemy.name}: ${diary}`);
    });

    this._enemies.value = currentEnemies;

    // --- TAŞ HİSAR GARNİZONU GLADYATÖRLERİNİN GÜNLÜK EVRİMİ & CEVHER SİSTEMİ ---
    // Bu sistem 1. Bölüm için geçerli DEĞİLDİR. Sadece 2. Bölüm (Taş Hisar Garnizonu) fermanı açıldığında başlar.
    // Yalnızca bu 40 Taş Hisar karakteri ve oyuncu (toplam 41 karakter) taş toplayıp cevher zanaatı yapabilir.
    // 1. Bölümdeki 11 Kırlangıç gladyatörü normal yapay zekadır ve taş sistemini kullanmaz.
    if (this.canTravelToRegion2) {
      const currentTashisar = this._tashisarEnemies.value.slice();
      currentTashisar.forEach((enemy, index) => {
        const personality = enemy.personality;
        let currentEnemy = enemy;
        let stats = enemy.stats;
        let gold = personality.gold + kt.Random.nextInt(35, 75);
        let condition = personality.currentCondition;
        const roll = kt.Random.nextInt(100);
        const currentGems = enemy.socketedGems.slice();
        const currentShards = { ...enemy.shards };
        let diary = personality.latestDiary;

        // Gladyatörün dövüş tarzına ve arketipine uygun taş türü
        let preferredGemType;
        switch (personality.archetype) {
          case PersonalityArchetype.HIRSLI:
            preferredGemType = roll < 55 ? GemType.YAKUT : GemType.AMETIST;
            break;
          case PersonalityArchetype.GURURLU:
            preferredGemType = roll < 55 ? GemType.SAFIR : GemType.ZUMRUT;
            break;
          case PersonalityArchetype.KURNAZ:
            preferredGemType = roll < 55 ? GemType.TOPAZ : GemType.KUVARS;
            break;
          case PersonalityArchetype.VAHSI:
            preferredGemType = roll < 55 ? GemType.OPAL : GemType.AKIK;
            break;
          case PersonalityArchetype.GIZEMLI:
            preferredGemType = roll < 55 ? GemType.OBSIDYEN : GemType.TURMALIN;
            break;
          case PersonalityArchetype.TEMBEL:
            preferredGemType = GemType.PIRIT;
            break;
        }

        const shardCount = currentShards[preferredGemType] ?? 0;

        // 0. Egzotik Teçhizat Satın Alma & Kuşanma (Demirci Torvald & Asacı Elidor - 100 Yeni Egzotik Ekipman)
        const candidateItems = this._chapter2ExoticPool.filter((it) => it.valueInGold <= gold && enemy.level >= it.requiredLevel - 5);
        const preferredCandidates = candidateItems.filter((candidate) => {
          if (personality.archetype === PersonalityArchetype.GIZEMLI || ['Morgana', 'Selene', 'Ignis', 'Zephyros', 'Maeve', 'Sorsha', 'Morwenna'].includes(enemy.name)) {
            return candidate.slot === EquipmentSlot.WEAPON && (candidate.weaponCategory === WeaponCategory.STAFF || candidate.weaponType === 'asa');
          } else if (personality.archetype === PersonalityArchetype.KURNAZ || ['Aresula', 'Katerina', 'Soren', 'Elaria', 'Lyra'].includes(enemy.name)) {
            return candidate.weaponCategory === WeaponCategory.BOW || candidate.accessoryCategory === AccessoryCategory.ARROW || ['yay', 'ok'].includes(candidate.weaponType);
          } else if (
            [PersonalityArchetype.VAHSI, PersonalityArchetype.HIRSLI].includes(personality.archetype) ||
            ['Baelor', 'Thyra', 'Ghorak', 'Bregash', 'Thorgar', 'Balthazar', 'Gideon', 'Rorik'].includes(enemy.name)
          ) {
            return [WeaponCategory.AXE, WeaponCategory.SPEAR].includes(candidate.weaponCategory);
          } else {
            return candidate.weaponCategory === WeaponCategory.SWORD || candidate.slot === EquipmentSlot.SHIELD;
          }
        });
        const bestCandidate =
          kt.maxByOrNull(preferredCandidates, (it) => it.valueInGold) ?? kt.maxByOrNull(candidateItems, (it) => it.valueInGold);
        const isWeaponUpgrade =
          bestCandidate != null &&
          bestCandidate.slot === EquipmentSlot.WEAPON &&
          (currentEnemy.equippedWeaponItem == null || bestCandidate.valueInGold > currentEnemy.equippedWeaponItem.valueInGold);
        const isShieldUpgrade =
          bestCandidate != null &&
          bestCandidate.slot === EquipmentSlot.SHIELD &&
          (currentEnemy.equippedShieldItem == null || bestCandidate.valueInGold > currentEnemy.equippedShieldItem.valueInGold);

        if (bestCandidate != null && (isWeaponUpgrade || isShieldUpgrade) && roll < 35) {
          gold -= bestCandidate.valueInGold;
          currentEnemy = currentEnemy.equip(bestCandidate);
          condition = `Egzotik: ${bestCandidate.name}`;
          switch (enemy.name) {
            case 'Voladmir':
              diary = `Voladmir, asilzade kibrini taçlandırmak için ${bestCandidate.valueInGold} Altın sayarak ${bestCandidate.name} kuşandı: 'Taş Hisar kumları bu çeliğin asaletine boyun eğecek!'`;
              break;
            case 'Thyra':
              diary = `Thyra, vahşi bir dağ narasıyla tezgaha ${bestCandidate.valueInGold} Altın fırlatıp ${bestCandidate.name} kaptı: 'Dağ fırtınası bu silahın namlusunda kükrüyor!'`;
              break;
            case 'Baelor':
              diary = `Baelor, demir maskesinin ardından tek kelime etmeden ${bestCandidate.valueInGold} Altın bıraktı ve ${bestCandidate.name} silahını sırtına astı; celladın adımları arenayı titretiyor.`;
              break;
            case 'Morgana':
            case 'Selene':
              diary = `${enemy.name}, Usta Elidor'un vitrinindeki ${bestCandidate.name} asasına el uzattı (${bestCandidate.valueInGold} Altın); asanın kadim rünleri aurasıyla bütünleşti.`;
              break;
            case 'Aresula':
              diary = `Aresula, rüzgar gibi adımlarla tezgaha yanaşıp ${bestCandidate.valueInGold} Altına ${bestCandidate.name} satın aldı: 'Bu hızla hiçbir göz beni takip edemez!'`;
              break;
            case 'Katerina':
              diary = `Katerina, buz mavisi zırhına yakışır ${bestCandidate.name} teçhizatını ${bestCandidate.valueInGold} Altın ödeyerek kuşandı ve savunmasını perçinledi.`;
              break;
            case 'Morvath':
              diary = `Morvath, şampiyon unvanına yaraşır ${bestCandidate.name} silahını ${bestCandidate.valueInGold} Altına alarak arenanın efendisi olduğunu kanıtladı.`;
              break;
            case 'Ghorak':
              diary = `Ghorak, eski kürek mahkumu nasırlı elleriyle ${bestCandidate.name} silahını kavradı (${bestCandidate.valueInGold} Altın); zincirleri kıracak kudreti hissetti.`;
              break;
            default:
              switch (personality.archetype) {
                case PersonalityArchetype.GURURLU:
                  diary = `${enemy.name}, şanına ve soyuna yaraşır ${bestCandidate.name} teçhizatını ${bestCandidate.valueInGold} Altın karşılığında satın aldı.`;
                  break;
                case PersonalityArchetype.VAHSI:
                  diary = `${enemy.name}, kemik parçalayan bir açlıkla ${bestCandidate.valueInGold} Altın ödeyerek ${bestCandidate.name} silahını kuşandı.`;
                  break;
                case PersonalityArchetype.GIZEMLI:
                  diary = `${enemy.name}, mistik aurasını derinleştiren ${bestCandidate.name} asasını ${bestCandidate.valueInGold} Altına temin etti.`;
                  break;
                case PersonalityArchetype.KURNAZ:
                  diary = `${enemy.name}, rakiplerin en zayıf eklemini deşecek olan ${bestCandidate.name} silahını ${bestCandidate.valueInGold} Altına donandı.`;
                  break;
                case PersonalityArchetype.HIRSLI:
                  diary = `${enemy.name}, şampiyonluk basamaklarını tırmanmak için kesenin ağzını açtı ve ${bestCandidate.valueInGold} Altına ${bestCandidate.name} kuşandı.`;
                  break;
                case PersonalityArchetype.TEMBEL:
                  diary = `${enemy.name}, zahmetsizce zafer kazanabilmek için ${bestCandidate.valueInGold} Altına ${bestCandidate.name} satın aldı.`;
                  break;
              }
          }
        }
        // 1. Durum: Elinde 3 kırık var ve sentez ücreti (15 Altın) + soketleme ücreti (25 Altın) varsa
        else if (
          shardCount >= GemCraftingRules.SHARDS_PER_GEM &&
          gold >= GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD + GemCraftingRules.GEM_SOCKET_COST_GOLD &&
          currentGems.length < 3
        ) {
          gold -= GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD + GemCraftingRules.GEM_SOCKET_COST_GOLD;
          currentShards[preferredGemType] = shardCount - GemCraftingRules.SHARDS_PER_GEM;
          const newGem = Gem.create(preferredGemType, 1);
          currentGems.push(newGem);
          stats = stats.plus(
            new Stats({
              maxHealth: newGem.stats.maxHealth,
              damage: kt.coerceAtLeast(newGem.stats.damage, 1),
              armor: kt.coerceAtLeast(newGem.stats.armor, 1),
            }),
          );
          condition = `${newGem.displayName} Kakıldı`;
          diary = `${enemy.name} topladığı 3 adet ${preferredGemType.displayName} Kırığı ile Usta Kael'e ${GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD + GemCraftingRules.GEM_SOCKET_COST_GOLD} Altın ödeyerek ${currentEnemy.weaponName} üzerine ${newGem.displayName} mıhlattı.`;
        }
        // 2. Durum: Var olan taşı yükseltme
        else if (currentGems.length > 0 && roll < 40) {
          const upgradeableGem = kt.firstOrNull(currentGems, (it) => it.level < 5);
          if (upgradeableGem != null) {
            const upgradeCost = GemCraftingRules.getUpgradeCostGold(upgradeableGem.level);
            if (gold >= upgradeCost) {
              gold -= upgradeCost;
              const targetLvl = upgradeableGem.level + 1;
              const rate = GemCraftingRules.getBaseSuccessRate(targetLvl);
              if (roll <= rate) {
                const upgraded = Gem.create(upgradeableGem.type, targetLvl);
                const idx = kt.indexOf(currentGems, upgradeableGem);
                currentGems[idx] = upgraded;
                stats = stats.plus(
                  new Stats({
                    maxHealth: kt.coerceAtLeast(kt.idiv(upgraded.stats.maxHealth, 2), 0),
                    damage: kt.coerceAtLeast(kt.idiv(upgraded.stats.damage, 2), 1),
                    armor: kt.coerceAtLeast(kt.idiv(upgraded.stats.armor, 2), 1),
                  }),
                );
                condition = `${upgraded.displayName} Yükseltildi`;
                diary = `${enemy.name} ${upgradeCost} Altın tezgah harcı ödeyerek ${upgradeableGem.displayName} cevherini ${upgraded.displayName} seviyesine yükseltti (${upgraded.effectSummary}).`;
              } else {
                condition = 'Çekiç Kazası';
                diary = `${enemy.name} tezgahta ${upgradeCost} Altın harcadı ancak taş aşırı baskıda çatlayıp kırıldı; teselli kırığı topladı.`;
              }
            } else {
              stats = stats.copy({ maxHealth: stats.maxHealth + 4 });
              condition = 'Kütük İdmanı';
              diary = `${enemy.name} cevher yükseltmeye altını yetmediği için gününü arenanın talim alanında kütük kaldırarak geçirdi.`;
            }
          }
        }
        // 3. Durum: Diyar hasat kaynaklarına gidip kırık parça toplama (havadan gelmez!)
        else if (shardCount < 3 && roll < 65) {
          const gathered = kt.Random.nextInt(1, 3);
          currentShards[preferredGemType] = shardCount + gathered;
          condition = 'Hasat & Madencilik';
          diary = `${enemy.name} garnizon dışındaki maden ocaklarına ve kayalıklara çıkarak +${gathered} adet ${preferredGemType.displayName} Kırığı topladı (Mevcut: ${currentShards[preferredGemType]}/3).`;
        }
        // 4. Durum: Kondisyon & Dinlenme
        else {
          stats = stats.copy({ maxHealth: stats.maxHealth + 3 });
          condition = 'Formunu Koruyor';
          diary = `${enemy.name} gününü dinlenerek, rakiplerin dövüş kayıtlarını inceleyerek geçirdi.`;
        }

        const updatedPers = personality.copy({
          gold: gold,
          currentCondition: condition,
          latestDiary: diary,
          diaryHistory: kt.take([diary, ...personality.diaryHistory], 5),
        });
        currentTashisar[index] = currentEnemy.copy({
          stats: stats,
          socketedGems: currentGems,
          shards: currentShards,
          personality: updatedPers,
        });
        diaries.push(`[Taş Hisar] ${enemy.name}: ${diary}`);
      });
      this._tashisarEnemies.value = currentTashisar;
    }

    return diaries;
  }

  advanceDay(costGold = 0, force = false) {
    const currentDayState = this._dayState.value;
    const playerCurrent = this._player.value;

    // Günlük Arena Katılım Kontrolü (Maç veya Seyirci Bahsi Zorunluluğu)
    if (!force && !currentDayState.isDailyArenaObligationMet) {
      return 'Arenaya uğramadan günü geçiremezsin! Kırlangıç Kasabası kurallarına göre ya kendi kurandaki maça çıkmalı, ya da kumdaki diğer bir dövüşçüye seyirci bahsi yatırmalısın!';
    }

    if (costGold > 0 && playerCurrent.gold < costGold) {
      return 'Gecelemek için yeterli altının yok!';
    }

    const nextDay = currentDayState.currentDay + 1;

    // Eğer oyuncu bugün kendi maçına çıkmadıysa (seyirci bahsiyle günü geçirdiyse),
    // kuradaki maçı hükmen mağlubiyet olarak lig tablosuna işlenir ve NPC maçları simüle edilir.
    let forfeitNote = '';
    if (!currentDayState.isArenaMatchDoneToday) {
      const drawnEnemy = this.getCurrentDrawnOpponent() ?? kt.first(this._enemies.value);
      this.updateLeagueAfterBattle(drawnEnemy, false, false);
      forfeitNote = `Kendi kurana çıkmadığın için ${drawnEnemy.name} karşısında hükmen yenik sayıldın. `;
    }

    // Seyirci bahsi çözümlenmesi
    let betOutcomeNote = '';
    let betWinnings = 0;
    const bet = currentDayState.activeSpectatorBet;
    if (bet != null) {
      if (!bet.isResolved) {
        const recent = this._leagueState.value.recentMatches;
        const targetMatch = kt.firstOrNull(recent, (it) => it.fighter1Name === bet.selectedFighterName || it.fighter2Name === bet.selectedFighterName);
        if (targetMatch != null && targetMatch.winnerName === bet.selectedFighterName) {
          betWinnings = bet.potentialReturn;
          betOutcomeNote = `Seyirci Bahsi Tuttu! ${bet.selectedFighterName} zafer kazandı (+${betWinnings} Altın)! `;
        } else {
          betOutcomeNote = `Seyirci Bahsi Yattı: ${bet.selectedFighterName} maçı kazanamadı. `;
        }
      } else {
        betOutcomeNote = 'Günlük seyirci bahsi tamamlandı. ';
      }
    }

    // 1. İstirahatgah seviyesine göre can yenileme
    const restLevel = roomLevel(this._rooms.value, RoomType.REST_ROOM);
    const healPercent = 0.4 + restLevel * 0.1;
    const healAmount = kt.toInt(playerCurrent.totalStats.maxHealth * healPercent);
    const newHp = Math.min(playerCurrent.totalStats.maxHealth, playerCurrent.currentHealth + healAmount);
    const recoveredHp = newHp - playerCurrent.currentHealth;

    // 2. Kasa / Hazine Odası pasif gelir
    const treasuryLevel = roomLevel(this._rooms.value, RoomType.TREASURY);
    const dailyIncome = treasuryLevel > 1 ? treasuryLevel * 8 : 0;

    // 3. Altın ve can güncellemesi
    const newGold = kt.coerceAtLeast(playerCurrent.gold - costGold + dailyIncome + betWinnings, 0);
    this._player.value = playerCurrent.copy({
      currentHealth: newHp,
      gold: newGold,
    });

    // 4. Yapay Zekalı Dövüşçülerin Günlük Evrimi & Günlükleri
    const evolvedDiaries = this.evolveNpcFightersDaily();
    const sampleEvolution = evolvedDiaries.length > 0 ? 'Diyar Haberleri: ' + kt.take(kt.shuffled(evolvedDiaries), 2).join(' | ') : '';

    let narrative = '';
    narrative += `${nextDay}. Gün Doğdu! `;
    narrative += 'Kırlangıç Kasabası sisler arasından uyandı. ';
    if (forfeitNote.length > 0) narrative += forfeitNote;
    if (betOutcomeNote.length > 0) narrative += betOutcomeNote;
    if (recoveredHp > 0) narrative += `Yatakta yaraların sarıldı (+${recoveredHp} Can). `;
    if (dailyIncome > 0) narrative += `Hazine kasasından +${dailyIncome} Altın toplandı. `;
    if (sampleEvolution.length > 0) narrative += `\n${sampleEvolution}`;

    // 5. Günlük Sözleşmeleri Havuzdan 2-3 Tane Olarak Yenile (Rastgele Standart + Açılmış Söylenti Görevleri)
    this.refreshDailyQuests();
    this._adventures.value = this._adventures.value.map((it) => it.copy({ isRunning: false, elapsedSeconds: 0, isClaimed: false, isFinished: false }));

    // 5b. Yeni Gün İçin Yeni Kura Eşleşmeleri (Tüm dövüşçüler için taze fikstür)
    if (this._leagueState.value.currentFixture.some((it) => it.isCompleted)) {
      const allEnemies = this._enemies.value;
      const newFixture = this.generateWeeklyFixture(allEnemies, this._player.value.name);
      this._leagueState.value = this._leagueState.value.copy({
        currentFixture: newFixture,
      });
    }

    this._dayState.value = currentDayState.copy({
      currentDay: nextDay,
      isArenaMatchDoneToday: false,
      isDailySpectatorBetPlaced: false,
      activeSpectatorBet: null,
      dailyDiceGamesPlayed: 0,
      isDailyTrainingDone: false,
      dailyMealsEaten: 0,
      dailyEavesdropsDone: 0,
      lastDawnNarrative: narrative,
    });

    // 5c. Silahsız Arena Takvim İlerlemesi
    const nextScheduledType = UnarmedScheduleManager.getScheduledShowType(nextDay);
    const nextOpponent =
      kt.firstOrNull(UnarmedMatchState.sampleOpponents, (it) => it.showType === nextScheduledType) ?? kt.first(UnarmedMatchState.sampleOpponents);
    this._unarmedMatchState.value = this._unarmedMatchState.value.copy({
      selectedShowType: nextScheduledType,
      currentOpponent: nextOpponent,
      showDrawn: true,
    });

    // 6. Gün Sonu Otomatik Kayıt (Auto-Save)
    this.autoSave();

    return narrative;
  }

  dismissDawnNarrative() {
    this._dayState.value = this._dayState.value.copy({ lastDawnNarrative: null });
  }

  dailyTraining() {
    const currentDayState = this._dayState.value;
    if (currentDayState.isDailyTrainingDone) {
      return [false, 'Bugünkü idmanını zaten tamamladın! Kasların dinlenmeli, yarınki gün tekrar ter dökebilirsin.'];
    }
    const trainingLevel = roomLevel(this._rooms.value, RoomType.TRAINING_GROUND);
    const gainedExp = 25 + trainingLevel * 15;

    const playerCurrent = this._player.value;
    const [updatedPlayer, levelEvent] = this.processExpGain(playerCurrent, gainedExp);

    this._player.value = updatedPlayer;
    if (levelEvent != null) {
      this._levelUpEvent.value = levelEvent;
    }
    this._dayState.value = currentDayState.copy({ isDailyTrainingDone: true });

    const msg = `Talimgah'ta kum torbaları ve tahta kılıçlarla ter döktün. +${gainedExp} Tecrübe (EXP) kazandın!`;
    return [true, msg];
  }

  restAndHeal() {
    const beforeHp = this._player.value.currentHealth;
    this.advanceDay(0);
    return this._player.value.currentHealth - beforeHp;
  }

  checkRoomUpgradeRequirements(room) {
    const currentP = this._player.value;
    if (room.level >= room.maxLevel) {
      return [false, `Bu bölme zaten azami kademeye (${room.maxLevel}) ulaştı!`];
    }

    // Hücre kısıtı: Hücredeyken odalar en fazla Kademe 2 olabilir. Kademe 3+ için müstakil ev gerekir!
    if (!currentP.isHouseUnlocked && room.level >= 2) {
      return [false, `Hücrenin sınırlarına ulaştın! Kademe ${room.level + 1} için önce 'Kırlangıç Avlulu Taş Evi'ne taşınmalısın.`];
    }

    const nextLevel = room.level + 1;
    const requiredLevel = nextLevel === 2 ? kt.coerceAtLeast(room.requiredPlayerLevel, 2) : nextLevel === 3 ? 3 : nextLevel === 4 ? 5 : 6;
    if (currentP.level < requiredLevel) {
      return [false, `Gereksinim eksik: Karakter Seviyen en az ${requiredLevel} olmalı (Şu an: ${currentP.level})!`];
    }

    const requiredFame = nextLevel === 2 ? room.requiredFame : nextLevel === 3 ? kt.coerceAtLeast(room.requiredFame, 20) : nextLevel === 4 ? 40 : 60;
    if (currentP.globalFame < requiredFame) {
      return [false, `Gereksinim eksik: En az ${requiredFame} Şöhret gerekli (Şu an: ${currentP.globalFame})!`];
    }

    if (room.requiredOtherRoomId != null) {
      const otherRoom = kt.firstOrNull(this._rooms.value, (it) => it.id === room.requiredOtherRoomId);
      const reqOtherLevel = kt.coerceAtLeast(room.requiredOtherRoomLevel, 1);
      if (otherRoom == null || otherRoom.level < reqOtherLevel) {
        const otherName = room.requiredOtherRoomName ?? otherRoom?.name ?? 'Gerekli Bölme';
        return [false, `Önkoşul eksik: Önce ${otherName} Kademe ${reqOtherLevel} yapılmalı!`];
      }
    }

    if (currentP.gold < room.upgradeCostGold) {
      return [false, `Yetersiz altın! ${room.upgradeCostGold} Altın gerekli (Mevcut: ${currentP.gold} Altın).`];
    }

    return [true, null];
  }

  calculateHomeBonusStats(rooms) {
    const armory = kt.firstOrNull(rooms, (it) => it.type === RoomType.ARMORY_WORKSHOP);
    const garden = kt.firstOrNull(rooms, (it) => it.type === RoomType.GARDEN_CELLAR);
    let stats = new Stats();
    if (armory != null) {
      switch (armory.level) {
        case 1:
          stats = stats.plus(new Stats({ damage: 3, armor: 1 }));
          break;
        case 2:
          stats = stats.plus(new Stats({ damage: 6, armor: 3, critChancePercent: 2 }));
          break;
        default:
          stats = stats.plus(new Stats({ damage: 10, armor: 5, critChancePercent: 5 }));
      }
    }
    if (garden != null) {
      switch (garden.level) {
        case 3:
          stats = stats.plus(new Stats({ maxHealth: 20 }));
          break;
        default:
      }
    }
    return stats;
  }

  upgradeRoom(roomId) {
    const currentRooms = this._rooms.value.slice();
    const index = currentRooms.findIndex((it) => it.id === roomId);
    if (index === -1) return [false, 'Oda bulunamadı!'];

    const room = currentRooms[index];
    const [canUpgrade, reqError] = this.checkRoomUpgradeRequirements(room);
    if (!canUpgrade) {
      return [false, reqError ?? 'Gereksinimler karşılanamadı!'];
    }

    const currentP = this._player.value;
    const newLevel = room.level + 1;
    const newUpgradeCost = kt.toInt(room.upgradeCostGold * 1.6);
    const newTierInfo = StarterContent.getRoomTierInfo(room.type, newLevel, currentP.isHouseUnlocked);

    const updatedRoom = room.copy({
      level: newLevel,
      upgradeCostGold: newUpgradeCost,
      name: newTierInfo.name,
      currentDescription: newTierInfo.description,
      nextUpgradeDescription: newTierInfo.nextUpgradeDescription,
      bonusSummary: newTierInfo.bonusSummary,
    });

    currentRooms[index] = updatedRoom;
    this._rooms.value = currentRooms;

    const homeStats = this.calculateHomeBonusStats(currentRooms);
    this._player.value = currentP.copy({
      gold: currentP.gold - room.upgradeCostGold,
      homeBonusStats: homeStats,
    });
    return [true, `[GELİŞİM!] ${room.type.title} Kademe ${newLevel} oldu: '${newTierInfo.name}'!`];
  }

  getHouseTransformationStatus() {
    const p = this._player.value;
    const baseRooms = this._rooms.value.filter((it) => !it.isHouseOnly);
    const allBaseRoomsLevel2 = baseRooms.length > 0 && baseRooms.every((it) => it.level >= 2);
    const baseRoomsCount = kt.count(baseRooms, (it) => it.level >= 2);

    const reqs = [
      new HouseRequirementStatus({
        title: 'Şöhret Seviyesi',
        isMet: p.globalFame >= 30,
        currentText: `${p.globalFame} Şöhret`,
        requiredText: '30 Şöhret (Kasaba Dövüşçüsü)',
      }),
      new HouseRequirementStatus({
        title: 'Karakter Tecrübesi',
        isMet: p.level >= 4,
        currentText: `Seviye ${p.level}`,
        requiredText: 'En az 4. Seviye',
      }),
      new HouseRequirementStatus({
        title: 'Hücrenin Tam Tahkimi',
        isMet: allBaseRoomsLevel2,
        currentText: `${baseRoomsCount} / ${baseRooms.length} Oda Kademe 2+`,
        requiredText: '5 Başlangıç Bölmesi Kademe 2+',
      }),
      new HouseRequirementStatus({
        title: 'Mülk ve İntikal Harcı',
        isMet: p.gold >= 500,
        currentText: `${p.gold} Altın`,
        requiredText: '500 Altın',
      }),
    ];

    const canTransform = reqs.every((it) => it.isMet) && !p.isHouseUnlocked;
    return new HouseTransformationStatus({ canTransform: canTransform, requirements: reqs, costGold: 500 });
  }

  transformToHouse() {
    const status = this.getHouseTransformationStatus();
    const p = this._player.value;
    if (p.isHouseUnlocked) {
      return [false, "Zaten müstakil Kırlangıç Avlulu Taş Evi'ne taşındın!"];
    }
    if (!status.canTransform) {
      const unmet = status.requirements
        .filter((it) => !it.isMet)
        .map((it) => `${it.title} (${it.requiredText})`)
        .join(', ');
      return [false, `Eve geçiş şartları henüz tamamlanmadı: ${unmet}`];
    }

    const newGold = p.gold - status.costGold;
    const houseTitle = 'Kırlangıç Kasabası Avlulu Taş Evi';

    // Mevcut odaları ev mimarisine uyarla
    const updatedRooms = this._rooms.value.map((room) => {
      const tierInfo = StarterContent.getRoomTierInfo(room.type, room.level, true);
      return room.copy({
        name: tierInfo.name,
        currentDescription: tierInfo.description,
        nextUpgradeDescription: tierInfo.nextUpgradeDescription,
        bonusSummary: tierInfo.bonusSummary,
      });
    });

    // 3 Yeni ev odasını ekle
    const houseRooms = StarterContent.createHouseExclusiveRooms();
    houseRooms.forEach((hRoom) => {
      if (kt.none(updatedRooms, (it) => it.type === hRoom.type)) {
        updatedRooms.push(hRoom);
      }
    });

    this._rooms.value = updatedRooms;
    const homeStats = this.calculateHomeBonusStats(updatedRooms);

    this._player.value = p.copy({
      gold: newGold,
      isHouseUnlocked: true,
      residenceTitle: houseTitle,
      homeBonusStats: homeStats,
    });

    const narrative =
      '[BÜYÜK DÖNÜŞÜM & ÖZGÜRLÜK!]\n' +
      'Rutubetli gladyatör hücresinin demir parmaklıklarını sonsuza dek arkanda bıraktın!\n' +
      'Kasabanın taş döşeli ara sokağında; etrafı yüksek taş duvarlarla çevrili, güneş alan geniş bir avluya ve şömineli taş odaya sahip yeni evine taşındın.\n' +
      'Artık evinde Kadim Harita Kütüphanesi, Biley Taşı Silahhanesi ve Şifalı Ot Mahzeni inşa edebilirsin!';

    this._dayState.value = this._dayState.value.copy({ lastDawnNarrative: narrative });
    this.autoSave();

    return [true, narrative];
  }

  executeCombat(enemy, bet = null) {
    const playerCurrent = this._player.value;
    const knownWeakness = playerCurrent.knownWeaknessIds.includes(enemy.id)
      ? kt.firstOrNull(StarterContent.getAllEnemyWeaknesses(), (it) => it.enemyId === enemy.id)
      : null;

    const result = CombatEngine.simulateBattle(playerCurrent, enemy, bet, knownWeakness);

    // Room bonuses
    const trophyRoomLevel = roomLevel(this._rooms.value, RoomType.TROPHY_HALL);
    const trainingRoomLevel = roomLevel(this._rooms.value, RoomType.TRAINING_GROUND);
    const treasuryLevel = roomLevel(this._rooms.value, RoomType.TREASURY);

    const finalExp = kt.toInt(result.earnedExp * (1.0 + (trainingRoomLevel - 1) * 0.1));
    const finalFame = kt.toInt(result.earnedFame * (1.0 + (trophyRoomLevel - 1) * 0.1));
    const extraGold = result.isPlayerWinner ? (treasuryLevel - 1) * 5 : 0;
    const finalGold = result.earnedGold + extraGold + (result.betWon ? result.betEarnings : 0);

    // Handle leveling up
    const [expUpdatedPlayer, levelEvent] = this.processExpGain(playerCurrent, finalExp);
    if (levelEvent != null) {
      this._levelUpEvent.value = levelEvent;
    }

    const newInventory = playerCurrent.inventory.slice();
    if (result.droppedItem != null) {
      newInventory.push(result.droppedItem);
    }

    const betCost = bet != null && !result.betWon ? bet.betAmount : 0;

    const regionId = playerCurrent.currentRegionId;
    const fameMap = { ...playerCurrent.regionFame };
    const currentFame = fameMap[regionId] ?? (regionId === 'tashisar' && expUpdatedPlayer.hasGarrisonPass ? 10 : 0);
    let updatedFame = kt.coerceIn(currentFame + finalFame, 0, 100);

    // Şampiyonluk Karşılaşması & Bölge 2 (Hisartaşı Garnizonu) Fermanı
    let hasGarrisonPass = expUpdatedPlayer.hasGarrisonPass;
    if (result.isPlayerWinner && (enemy.id === 'morvath' || enemy.name === 'Morvath' || updatedFame >= 85) && !hasGarrisonPass) {
      const topStandings = kt.take(this._leagueState.value.standings, 3).map((it) => it.id);
      if (enemy.id === 'morvath' || enemy.name === 'Morvath' || topStandings.includes(enemy.id) || updatedFame >= 90) {
        hasGarrisonPass = true;
        updatedFame = 100;
        const passItem = new Equipment({
          id: 'garrison_pass',
          name: 'Hisartaşı Garnizonu Geçiş Fermanı',
          slot: EquipmentSlot.TALISMAN,
          accessoryCategory: AccessoryCategory.TALISMAN,
          rarity: ItemRarity.KADIM,
          stats: new Stats({ damage: 3, armor: 2, speed: 2 }),
          description:
            "Başkent Garnizon Kumandanlığı'nın balmumu mühürlü fermanı. Kırlangıç Kasabası'ndaki sürgünlüğünün bittiğini ve orta ölçekli Hisartaşı Garnizonu'na (Bölge 2) geçiş yetkisi verildiğini belgeler.",
          valueInGold: 250,
        });
        newInventory.push(passItem);
        this._invitationLetterEvent.value = true;
      }
    }

    fameMap[regionId] = updatedFame;
    // Kırlangıç tamamlandığında Taş Hisar şöhreti en az 10 düzeyinden başlar
    if ((hasGarrisonPass || (fameMap['kirlangic'] ?? 0) >= 100) && (fameMap['tashisar'] ?? 0) < 10) {
      fameMap['tashisar'] = 10;
    }

    // Calculate fame title for player
    const newTitle = calculatePlayerTitleForRegion(regionId, updatedFame, hasGarrisonPass);

    const updatedBuffs = playerCurrent.activeBuffs.map((it) => it.copy({ remainingBattles: it.remainingBattles - 1 })).filter((it) => it.remainingBattles > 0);

    this._player.value = expUpdatedPlayer.copy({
      gold: kt.coerceAtLeast(playerCurrent.gold + finalGold - betCost, 0),
      regionFame: fameMap,
      globalFame: updatedFame,
      title: newTitle,
      currentHealth: result.finalPlayerHp,
      inventory: newInventory,
      hasGarrisonPass: hasGarrisonPass,
      encounteredEnemyIds: kt.setPlus(expUpdatedPlayer.encounteredEnemyIds, enemy.id),
      activeBuffs: updatedBuffs,
    });

    // Update local region fame
    const currentRegion = this._region.value;
    this._region.value = currentRegion.copy({ localFame: updatedFame });

    // UPDATE LEAGUE SYSTEM & SIMULATE OTHER NPC MATCHES
    this.updateLeagueAfterBattle(enemy, result.isPlayerWinner, result.isDraw);

    // Günün arena maçını tamamlandı olarak işaretle
    this._dayState.value = this._dayState.value.copy({ isArenaMatchDoneToday: true });

    return result;
  }

  executeDuoCombat(ally, enemy1, enemy2, condition) {
    const playerCurrent = this._player.value;
    const entryFee = this._duoMatchState.value.entryFee;

    const goldAfterFee = Math.max(0, playerCurrent.gold - entryFee);

    const result = DuoCombatEngine.simulateDuoBattle(playerCurrent.copy({ gold: goldAfterFee }), ally, enemy1, enemy2, condition);

    // Room bonuses for rewards
    const trophyRoomLevel = roomLevel(this._rooms.value, RoomType.TROPHY_HALL);
    const trainingRoomLevel = roomLevel(this._rooms.value, RoomType.TRAINING_GROUND);
    const treasuryLevel = roomLevel(this._rooms.value, RoomType.TREASURY);

    const finalExp = result.isPlayerWinner ? kt.toInt(this._duoMatchState.value.rewardExp * (1.0 + (trainingRoomLevel - 1) * 0.1)) : 25;

    const finalFame = result.isPlayerWinner ? kt.toInt(this._duoMatchState.value.rewardFame * (1.0 + (trophyRoomLevel - 1) * 0.1)) : 0;

    const extraGold = result.isPlayerWinner ? (treasuryLevel - 1) * 6 : 0;
    const finalGold = result.isPlayerWinner ? this._duoMatchState.value.rewardGold + extraGold : 0;

    const [expUpdatedPlayer, levelEvent] = this.processExpGain(playerCurrent, finalExp);
    if (levelEvent != null) {
      this._levelUpEvent.value = levelEvent;
    }

    const regionId = expUpdatedPlayer.currentRegionId;
    const fameMap = { ...expUpdatedPlayer.regionFame };
    const currentFame = fameMap[regionId] ?? 0;
    const updatedFame = kt.coerceIn(currentFame + finalFame, 0, 100);
    fameMap[regionId] = updatedFame;

    const newGlobalFame = kt.coerceAtLeast(expUpdatedPlayer.globalFame + finalFame, 0);
    const newTitle = calculatePlayerTitleForRegion(regionId, updatedFame, expUpdatedPlayer.hasGarrisonPass);

    this._player.value = expUpdatedPlayer.copy({
      gold: goldAfterFee + finalGold,
      regionFame: fameMap,
      globalFame: newGlobalFame,
      title: newTitle,
      currentHealth: result.finalPlayerHp > 0 ? result.finalPlayerHp : 15,
      encounteredEnemyIds: kt.setPlusAll(expUpdatedPlayer.encounteredEnemyIds, [ally.id, enemy1.id, enemy2.id]),
    });

    this._dayState.value = this._dayState.value.copy({ isArenaMatchDoneToday: true });

    return result;
  }

  updateLeagueAfterBattle(enemy, playerWon, isDraw) {
    const currentLeague = this._leagueState.value;
    const standingsMap = { ...kt.associateBy(currentLeague.standings, (it) => it.id) };
    const recentMatchList = [];

    // 1. Update Player Standing
    const pStanding =
      standingsMap['player'] ?? new FighterStanding({ id: 'player', name: this._player.value.name, title: this._player.value.title, isPlayer: true });
    if (isDraw) {
      standingsMap['player'] = pStanding.copy({
        matchesPlayed: pStanding.matchesPlayed + 1,
        draws: pStanding.draws + 1,
        points: pStanding.points + 1,
        consecutiveLosses: 0,
        title: this._player.value.title,
      });
    } else {
      const newPConsecutiveLosses = playerWon ? 0 : pStanding.consecutiveLosses + 1;
      let pPoints = playerWon ? pStanding.points + 3 : pStanding.points;

      // Apply consecutive loss penalty for player
      const pPenalty = this.calculatePenalty(newPConsecutiveLosses);
      pPoints = Math.max(0, pPoints - pPenalty);

      standingsMap['player'] = pStanding.copy({
        matchesPlayed: pStanding.matchesPlayed + 1,
        wins: playerWon ? pStanding.wins + 1 : pStanding.wins,
        losses: !playerWon ? pStanding.losses + 1 : pStanding.losses,
        points: pPoints,
        consecutiveLosses: newPConsecutiveLosses,
        title: this._player.value.title,
      });
    }

    // 2. Update Enemy Standing
    const enemyStandingId = enemy.id.split('fighter_').join('');
    const eStanding = standingsMap[enemyStandingId] ?? kt.firstOrNull(Object.values(standingsMap), (it) => it.name === enemy.name);
    if (eStanding != null) {
      if (isDraw) {
        standingsMap[eStanding.id] = eStanding.copy({
          matchesPlayed: eStanding.matchesPlayed + 1,
          draws: eStanding.draws + 1,
          points: eStanding.points + 1,
          consecutiveLosses: 0,
        });
      } else {
        const enemyWon = !playerWon;
        const newEConsecutiveLosses = enemyWon ? 0 : eStanding.consecutiveLosses + 1;
        let ePoints = enemyWon ? eStanding.points + 3 : eStanding.points;

        const ePenalty = this.calculatePenalty(newEConsecutiveLosses);
        ePoints = Math.max(0, ePoints - ePenalty);

        standingsMap[eStanding.id] = eStanding.copy({
          matchesPlayed: eStanding.matchesPlayed + 1,
          wins: enemyWon ? eStanding.wins + 1 : eStanding.wins,
          losses: !enemyWon ? eStanding.losses + 1 : eStanding.losses,
          points: ePoints,
          consecutiveLosses: newEConsecutiveLosses,
        });
      }
    }

    // Record player match
    const pName = this._player.value.name;
    recentMatchList.push(
      new LeagueMatchResult({
        fighter1Name: pName,
        fighter2Name: enemy.name,
        winnerName: isDraw ? null : playerWon ? pName : enemy.name,
        scoreSummary: isDraw ? "Çifte Nakavt ile Berabere Bitti (+1'er Puan)" : playerWon ? `${pName} galip geldi (+3 Puan)` : `${enemy.name} galip geldi (+3 Puan)`,
        narrativeSnippet: isDraw
          ? `${pName} ve ${enemy.name} son nefeslerinde aynı anda kumlara serildi; iki taraf da 1'er lig puanı aldı.`
          : playerWon
            ? `${pName}, ${enemy.name}'i dize getirerek lig puanını artırdı!`
            : `${enemy.name}, ${pName}'in hamlelerini kırıp zaferi kopardı.`,
      }),
    );

    const updatedFixture = [];

    // 1. Oyuncunun karşılaşmasını tamamlandı olarak ekle
    const playerSummary = isDraw ? 'Berabere (+1 Puan)' : playerWon ? `${pName} Galip (+3 Puan)` : `${enemy.name} Galip (+3 Puan)`;
    const existingPlayerMatch = kt.firstOrNull(currentLeague.currentFixture, (it) => it.isPlayerMatch);
    if (existingPlayerMatch != null) {
      updatedFixture.push(existingPlayerMatch.copy({ isCompleted: true, resultSummary: playerSummary }));
    }

    // 2. Canlı izlenmiş (tamamlanmış) seyirci bahsi maçlarını fikstürde ve sonuçlarında koru
    const alreadyCompletedMatches = currentLeague.currentFixture.filter((it) => !it.isPlayerMatch && it.isCompleted);
    updatedFixture.push(...alreadyCompletedMatches);

    // 3. Henüz tamamlanmamış NPC karşılaşmalarını simüle et
    const uncompletedMatches = currentLeague.currentFixture.filter((it) => !it.isPlayerMatch && !it.isCompleted);
    const allEnemies = this._enemies.value;
    let fixtureToSimulate;
    if (uncompletedMatches.length > 0) {
      fixtureToSimulate = uncompletedMatches;
    } else if (alreadyCompletedMatches.length === 0) {
      // Fallback eşleşme (eğer fikstür boşsa)
      const otherEnemies = kt.shuffled(allEnemies.filter((it) => it.name !== enemy.name));
      const fallbackMatches = [];
      for (let i = 0; i < otherEnemies.length; i += 2) {
        if (i + 1 < otherEnemies.length) {
          fallbackMatches.push(
            new LeagueFixtureMatch({
              fighter1Id: otherEnemies[i].id,
              fighter1Name: otherEnemies[i].name,
              fighter2Id: otherEnemies[i + 1].id,
              fighter2Name: otherEnemies[i + 1].name,
              isPlayerMatch: false,
            }),
          );
        }
      }
      fixtureToSimulate = fallbackMatches;
    } else {
      fixtureToSimulate = [];
    }

    for (const fixtureMatch of fixtureToSimulate) {
      const npc1 = kt.firstOrNull(allEnemies, (it) => it.id === fixtureMatch.fighter1Id || it.name === fixtureMatch.fighter1Name);
      const npc2 = kt.firstOrNull(allEnemies, (it) => it.id === fixtureMatch.fighter2Id || it.name === fixtureMatch.fighter2Name);
      if (npc1 != null && npc2 != null) {
        const match = CombatEngine.simulateNpcVsNpcMatch(npc1, npc2);
        recentMatchList.push(match);
        this.updateNpcStandingFromMatch(standingsMap, npc1, npc2, match.winnerName);
        const summary = match.winnerName != null ? `${match.winnerName} Galip (+3 Puan)` : 'Berabere (+1 Puan)';
        updatedFixture.push(fixtureMatch.copy({ isCompleted: true, resultSummary: summary }));
      } else {
        updatedFixture.push(fixtureMatch.copy({ isCompleted: true, resultSummary: 'Karşılaşma Tamamlandı' }));
      }
    }

    // Günün karşılaşmaları eş güdümlü tamamlandı, puan tablosu güncellendi
    this._leagueState.value = currentLeague.copy({
      roundNumber: currentLeague.roundNumber + 1,
      standings: kt.sortedByDescending(Object.values(standingsMap), (it) => it.points),
      currentFixture: updatedFixture,
      recentMatches: recentMatchList,
    });
  }

  getCurrentDrawnOpponent() {
    const playerMatch = kt.firstOrNull(this._leagueState.value.currentFixture, (it) => it.isPlayerMatch);
    if (playerMatch == null) return null;
    return kt.firstOrNull(this._enemies.value, (it) => it.id === playerMatch.fighter2Id || it.name === playerMatch.fighter2Name);
  }

  updateNpcStandingFromMatch(standingsMap, f1, f2, winnerName) {
    const s1 = kt.firstOrNull(Object.values(standingsMap), (it) => it.name === f1.name);
    if (s1 == null) return;
    const s2 = kt.firstOrNull(Object.values(standingsMap), (it) => it.name === f2.name);
    if (s2 == null) return;

    if (winnerName === f1.name) {
      standingsMap[s1.id] = s1.copy({ matchesPlayed: s1.matchesPlayed + 1, wins: s1.wins + 1, points: s1.points + 3, consecutiveLosses: 0 });
      const newLosses = s2.consecutiveLosses + 1;
      const penalty = this.calculatePenalty(newLosses);
      standingsMap[s2.id] = s2.copy({ matchesPlayed: s2.matchesPlayed + 1, losses: s2.losses + 1, points: Math.max(0, s2.points - penalty), consecutiveLosses: newLosses });
    } else if (winnerName === f2.name) {
      standingsMap[s2.id] = s2.copy({ matchesPlayed: s2.matchesPlayed + 1, wins: s2.wins + 1, points: s2.points + 3, consecutiveLosses: 0 });
      const newLosses = s1.consecutiveLosses + 1;
      const penalty = this.calculatePenalty(newLosses);
      standingsMap[s1.id] = s1.copy({ matchesPlayed: s1.matchesPlayed + 1, losses: s1.losses + 1, points: Math.max(0, s1.points - penalty), consecutiveLosses: newLosses });
    } else {
      // Draw
      standingsMap[s1.id] = s1.copy({ matchesPlayed: s1.matchesPlayed + 1, draws: s1.draws + 1, points: s1.points + 1, consecutiveLosses: 0 });
      standingsMap[s2.id] = s2.copy({ matchesPlayed: s2.matchesPlayed + 1, draws: s2.draws + 1, points: s2.points + 1, consecutiveLosses: 0 });
    }
  }

  calculatePenalty(consecutiveLosses) {
    if (consecutiveLosses <= 1) return 0;
    if (consecutiveLosses >= 2 && consecutiveLosses <= 3) return 1;
    return 2;
  }

  buyEquipment(item) {
    const current = this._player.value;
    if (current.gold < item.valueInGold) return false;

    this._player.value = current.copy({
      gold: current.gold - item.valueInGold,
      inventory: [...current.inventory, item],
    });
    return true;
  }

  buyConsumable(item) {
    const current = this._player.value;
    if (current.gold < item.valueInGold) return false;

    const existing = kt.firstOrNull(current.consumables, (it) => it.id === item.id);
    const updatedConsumables =
      existing != null
        ? current.consumables.map((it) => (it.id === item.id ? it.copy({ count: it.count + 1 }) : it))
        : [...current.consumables, item.copy({ count: 1 })];

    this._player.value = current.copy({
      gold: current.gold - item.valueInGold,
      consumables: updatedConsumables,
    });
    return true;
  }

  refreshDailyQuests() {
    const currentP = this._player.value;
    const isRegion2 = currentP.currentRegionId === 'tashisar';
    const unlockedRumors = currentP.unlockedRumorQuestIds;
    const allQuests = StarterContent.createAllQuests();

    const selected = [];

    if (isRegion2) {
      const r2Quests = allQuests.filter(
        (it) => it.id.startsWith('quest_quarry') || it.id.startsWith('quest_frost') || it.id.startsWith('quest_trainer') || it.id.startsWith('quest_obsidian'),
      );
      selected.push(...kt.take(kt.shuffled(r2Quests), 3));
    } else {
      const baseCaravan = kt.first(allQuests, (it) => it.id === 'quest_caravan');
      const eligible = allQuests.filter(
        (quest) =>
          quest.id !== 'quest_caravan' &&
          !quest.id.startsWith('quest_quarry') &&
          !quest.id.startsWith('quest_frost') &&
          !quest.id.startsWith('quest_trainer') &&
          !quest.id.startsWith('quest_obsidian') &&
          (!quest.isRumorQuest || unlockedRumors.includes(quest.id)),
      );

      const rumorEligible = eligible.filter((it) => it.isRumorQuest);
      const standardEligible = eligible.filter((it) => !it.isRumorQuest);

      selected.push(baseCaravan);
      if (rumorEligible.length > 0) {
        selected.push(...kt.take(kt.shuffled(rumorEligible), 2));
      }
      const needed = kt.coerceAtLeast(3 - selected.length, 1);
      selected.push(...kt.take(kt.shuffled(standardEligible), needed));
    }

    const freshDaily = selected.map((it) => it.copy({ isRunning: false, elapsedSeconds: 0, isClaimed: false }));
    this._quests.value = freshDaily;
    return freshDaily;
  }

  startQuest(questId) {
    const isAnyTaskRunning = this._quests.value.some((it) => it.isRunning && !it.isFinished) || this._adventures.value.some((it) => it.isRunning && !it.isFinished);
    if (isAnyTaskRunning) {
      return [false, 'Zaten şu anda faal bir sözleşme veya sefer yürütüyorsun! Önce mevcut görevini tamamlamalısın.'];
    }

    const list = this._quests.value.slice();
    const index = list.findIndex((it) => it.id === questId);
    const quest = index !== -1 ? list[index] : kt.firstOrNull(StarterContent.createAllQuests(), (it) => it.id === questId);

    if (quest == null) return [false, 'Görev bulunamadı!'];

    const currentP = this._player.value;
    if (currentP.level < quest.requiredLevel) {
      return [false, `Bu görev için en az Seviye ${quest.requiredLevel} olmalısınız!`];
    }
    if (quest.requiredMinHpPercent > 0) {
      const minHpReq = kt.toInt(f32(currentP.totalStats.maxHealth * f32(quest.requiredMinHpPercent / 100)));
      if (currentP.currentHealth < minHpReq) {
        return [false, `Canınız çok düşük (${currentP.currentHealth}/${minHpReq} HP gerekli)! Yola çıkmadan önce dinlenmeli veya şifa bulmalısınız.`];
      }
    }
    if (quest.requiredMinArmor > 0 && currentP.totalStats.armor < quest.requiredMinArmor) {
      return [false, `Yetersiz Savunma! Bu görev için en az ${quest.requiredMinArmor} Zırh gereklidir (Mevcut: ${currentP.totalStats.armor}).`];
    }
    if (quest.requiredMinDamage > 0 && currentP.totalStats.damage < quest.requiredMinDamage) {
      return [false, `Yetersiz Saldırı Gücü! Bu görev için en az ${quest.requiredMinDamage} Hasar gereklidir (Mevcut: ${currentP.totalStats.damage}).`];
    }
    if (quest.requiredSupplyGold > 0) {
      if (currentP.gold < quest.requiredSupplyGold) {
        return [false, `Yetersiz Altın! Görev hazırlığı ve teçhizatı için ${quest.requiredSupplyGold} Altın gereklidir (Mevcut: ${currentP.gold} Altın).`];
      }
    }

    if (index === -1) {
      return [false, 'Bu görev bugün kasaba panosunda ilan edilmemiş!'];
    }

    if (quest.isClaimed) {
      return [false, 'Bu sözleşmeyi bugün zaten tamamladınız! Yeni günün doğmasını (uyumayı) beklemelisiniz.'];
    }
    if (quest.isRunning) {
      return [false, 'Bu sözleşme zaten devam ediyor!'];
    }

    if (quest.requiredSupplyGold > 0) {
      this._player.value = currentP.copy({ gold: currentP.gold - quest.requiredSupplyGold });
    }

    list[index] = list[index].copy({ isRunning: true, elapsedSeconds: 0 });
    this._quests.value = list;
    const costNote = quest.requiredSupplyGold > 0 ? ` (-${quest.requiredSupplyGold} Altın harcandı)` : '';
    return [true, `${quest.title} sözleşmesi başladı${costNote}. Karakterin yola koyuldu!`];
  }

  advanceQuestTime(seconds) {
    const list = this._quests.value.map((quest) => {
      if (quest.isRunning && !quest.isFinished) {
        const newElapsed = kt.coerceAtMost(quest.elapsedSeconds + seconds, quest.durationSeconds);
        return quest.copy({ elapsedSeconds: newElapsed });
      } else {
        return quest;
      }
    });
    this._quests.value = list;

    const advList = this._adventures.value.map((adv) => {
      if (adv.isRunning && !adv.isFinished) {
        const newElapsed = kt.coerceAtMost(adv.elapsedSeconds + seconds, adv.durationSeconds);
        const finished = newElapsed >= adv.durationSeconds;
        return adv.copy({ elapsedSeconds: newElapsed, isFinished: finished });
      } else {
        return adv;
      }
    });
    this._adventures.value = advList;
  }

  startAdventure(adventureId) {
    const isAnyTaskRunning = this._quests.value.some((it) => it.isRunning && !it.isFinished) || this._adventures.value.some((it) => it.isRunning && !it.isFinished);
    if (isAnyTaskRunning) {
      return [false, 'Zaten şu anda faal bir sözleşme veya sefer yürütüyorsun! Önce mevcut görevini tamamlamalısın.'];
    }

    const currentAdv = this._adventures.value.slice();
    const index = currentAdv.findIndex((it) => it.id === adventureId);
    if (index === -1) return [false, 'Macera bulunamadı!'];

    const adv = currentAdv[index];
    if (adv.isClaimed) {
      return [false, 'Bu efsanevi avı bugün zaten tamamladınız! Yarınki gün doğduğunda tekrar iz sürebilirsiniz.'];
    }
    if (adv.isRunning) {
      return [false, 'Bu sefer zaten devam ediyor!'];
    }

    const currentP = this._player.value;
    if (currentP.level < adv.requiredLevel) {
      return [false, `Bu tehlikeli av için en az Seviye ${adv.requiredLevel} olmalısınız!`];
    }
    const minHpReq = kt.toInt(f32(currentP.totalStats.maxHealth * f32(adv.requiredMinHpPercent / 100)));
    if (currentP.currentHealth < minHpReq) {
      return [false, `Canınız çok düşük (${currentP.currentHealth}/${minHpReq} HP gerekli)! Maceraya çıkmadan önce dinlenmeli veya şifa bulmalısınız.`];
    }
    if (adv.requiredMinArmor > 0 && currentP.totalStats.armor < adv.requiredMinArmor) {
      return [false, `Yetersiz Savunma! ${adv.targetName} karşısında hayatta kalmak için en az ${adv.requiredMinArmor} Zırh gereklidir (Mevcut: ${currentP.totalStats.armor}).`];
    }
    if (adv.requiredMinDamage > 0 && currentP.totalStats.damage < adv.requiredMinDamage) {
      return [false, `Yetersiz Saldırı Gücü! Kazı ve kaya yarmak için en az ${adv.requiredMinDamage} Hasar gereklidir (Mevcut: ${currentP.totalStats.damage}).`];
    }
    if (adv.requiredSupplyGold > 0) {
      if (currentP.gold < adv.requiredSupplyGold) {
        return [false, `Yetersiz Altın! Kazı teçhizatı ve güvenlik için ${adv.requiredSupplyGold} Altın gereklidir (Mevcut: ${currentP.gold} Altın).`];
      }
    }
    if (adv.requiredSupplyItemName != null) {
      const hasHealSupply = currentP.consumables.some((it) => it.healAmount > 0 && it.count > 0);
      if (!hasHealSupply) {
        return [false, 'Eksik Erzak! Bu dondurucu sefere çıkmak için çantanda en az 1 adet şifalı iksir veya ot (Pelin Otu Merhemi / Dağ Otu) bulunmalıdır!'];
      }
    }

    if (adv.requiredSupplyGold > 0) {
      this._player.value = currentP.copy({ gold: currentP.gold - adv.requiredSupplyGold });
    }

    currentAdv[index] = adv.copy({ isRunning: true, elapsedSeconds: 0, isFinished: false });
    this._adventures.value = currentAdv;
    const costNote = adv.requiredSupplyGold > 0 ? ` (-${adv.requiredSupplyGold} Altın kazı masrafı)` : '';
    return [true, `${adv.title} başladı${costNote}! Donanımını toparlayıp vahşi doğaya adım attın.`];
  }

  claimAdventureReward(adventureId) {
    const currentAdv = this._adventures.value.slice();
    const index = currentAdv.findIndex((it) => it.id === adventureId);
    if (index === -1) return [false, 'Macera bulunamadı!'];

    const adv = currentAdv[index];
    if (!adv.isFinished) return [false, 'Macera henüz sonuçlanmadı!'];

    const currentP = this._player.value;
    const successChance = adv.calculateSuccessChance(currentP);
    const roll = kt.Random.nextInt(100);
    const isSuccess = roll < successChance;

    if (!isSuccess) {
      const penaltyHp = kt.coerceAtLeast(currentP.currentHealth - adv.failureDamage, 1);
      this._player.value = currentP.copy({ currentHealth: penaltyHp });
      currentAdv[index] = adv.copy({ isRunning: false, elapsedSeconds: 0, isFinished: false });
      this._adventures.value = currentAdv;
      return [false, adv.failureNarrative];
    }

    // Başarılı av
    const currentMaterials = { ...currentP.craftingMaterials };
    const currentCount = currentMaterials[adv.rewardMaterialId] ?? 0;
    currentMaterials[adv.rewardMaterialId] = currentCount + 1;

    const regionId = currentP.currentRegionId;
    const fameMap = { ...currentP.regionFame };
    const curFame = fameMap[regionId] ?? (regionId === 'tashisar' && currentP.hasGarrisonPass ? 10 : 0);
    const fameGain = curFame < 85 ? 2 : 1;
    const updatedFame = kt.coerceAtMost(curFame + fameGain, 100);
    fameMap[regionId] = updatedFame;
    if ((currentP.hasGarrisonPass || (fameMap['kirlangic'] ?? 0) >= 100) && (fameMap['tashisar'] ?? 0) < 10) {
      fameMap['tashisar'] = 10;
    }
    const newTitle = calculatePlayerTitleForRegion(regionId, updatedFame, currentP.hasGarrisonPass);

    const [updatedPlayer, levelEvent] = this.processExpGain(
      currentP.copy({
        gold: currentP.gold + adv.rewardGold,
        regionFame: fameMap,
        globalFame: updatedFame,
        title: newTitle,
        craftingMaterials: currentMaterials,
      }),
      adv.rewardExp,
    );
    this._player.value = updatedPlayer;
    this._region.value = this._region.value.copy({ localFame: updatedFame });
    if (levelEvent != null) {
      this._levelUpEvent.value = levelEvent;
    }

    currentAdv[index] = adv.copy({ isRunning: false, elapsedSeconds: 0, isFinished: false, isClaimed: true });
    this._adventures.value = currentAdv;

    const msg = `[ZAFER!] ${adv.targetName} alt edildi!\nKazanılan: +${adv.rewardGold} Altın, +${adv.rewardExp} EXP, +${fameGain} Şöhret ve 1x ${adv.rewardMaterialName} () çantana eklendi!`;
    return [true, msg];
  }

  craftEquipment(recipeId) {
    const recipe = kt.firstOrNull(this._craftingRecipes.value, (it) => it.id === recipeId);
    if (recipe == null) return [false, 'Reçete bulunamadı!'];
    const currentP = this._player.value;
    const matCount = currentP.getMaterialCount(recipe.requiredMaterialId);

    if (matCount < recipe.requiredMaterialCount) {
      return [false, `Yetersiz malzeme! Bu eseri dövmek için ${recipe.requiredMaterialCount}x ${recipe.requiredMaterialName} gereklidir (Mevcut: ${matCount}).`];
    }
    if (currentP.gold < recipe.requiredGold) {
      return [false, `Yetersiz altın! Demirci ocak ve çekiç hakkı için ${recipe.requiredGold} Altın talep ediyor (Mevcut: ${currentP.gold} Altın).`];
    }

    const updatedMaterials = { ...currentP.craftingMaterials };
    updatedMaterials[recipe.requiredMaterialId] = matCount - recipe.requiredMaterialCount;

    const updatedInventory = [...currentP.inventory, recipe.resultItem];
    this._player.value = currentP.copy({
      gold: currentP.gold - recipe.requiredGold,
      craftingMaterials: updatedMaterials,
      inventory: updatedInventory,
    });

    const traitName = recipe.resultItem.specialTrait?.name ?? '';
    return [
      true,
      `[EFSANEVİ ESER DÖVÜLDÜ!]\nDemirci Zaven örsünde kızıl kıvılcımlar saçarak ${recipe.resultItem.name} eşyasını tamamladı!\nÖzel Nitelik: '${traitName}' başarıyla çantana eklendi.`,
    ];
  }

  claimQuestReward(questId) {
    const list = this._quests.value.slice();
    const index = list.findIndex((it) => it.id === questId);
    if (index === -1) return [false, 'Görev bulunamadı!'];

    const quest = list[index];
    if (!quest.isFinished || quest.isClaimed) return [false, 'Görev henüz tamamlanmadı veya ödülü alındı!'];

    const current = this._player.value;
    const roll = kt.Random.nextInt(100);
    const isSuccess = roll < quest.successChancePercent;

    if (!isSuccess) {
      const penaltyHp = kt.coerceAtLeast(current.currentHealth - 10, 1);
      this._player.value = current.copy({ currentHealth: penaltyHp });
      if (quest.type === QuestType.EXPEDITION) {
        list[index] = quest.copy({ isClaimed: false, isRunning: false, elapsedSeconds: 0 });
      } else {
        list[index] = quest.copy({ isClaimed: true, isRunning: false });
      }
      this._quests.value = list;
      const failMsg = quest.failureNarrative ?? 'Görev başarısız oldu ve geri çekilmek zorunda kaldın! (-10 Can)';
      return [false, failMsg];
    }

    const newInv = current.inventory.slice();
    if (quest.rewardItem != null) {
      newInv.push(quest.rewardItem);
    }

    const narrativeOutcome =
      quest.completionNarratives.length > 0
        ? kt.random(quest.completionNarratives)
        : 'Sözleşme şartlarını başarıyla tamamladın ve kasaba kethüdasından hakkın olan ödülleri aldın.';

    // Kadim Doğu Tomarı Düşme Kontrolü (Hikaye ve Dengeleme)
    let droppedScroll = null;
    const allScrolls = StarterContent.getAllSealedScrolls();
    const currentScrollIds = kt.distinct(current.consumables.filter((it) => it.type === ItemType.SCROLL).map((it) => it.id));
    const unlockedSkills = current.unlockedSkillIds;

    if (quest.rewardScrollId != null) {
      const scroll = StarterContent.getSealedScrollById(quest.rewardScrollId);
      const mappedSkill = StarterContent.getScrollSkillMapping(quest.rewardScrollId);
      if (scroll != null && !currentScrollIds.includes(scroll.id) && (mappedSkill == null || !unlockedSkills.includes(mappedSkill))) {
        droppedScroll = scroll;
      }
    } else if (quest.scrollDropChancePercent > 0 && kt.Random.nextInt(100) < quest.scrollDropChancePercent) {
      const available = allScrolls.filter((s) => {
        const mapped = StarterContent.getScrollSkillMapping(s.id);
        return !currentScrollIds.includes(s.id) && (mapped == null || !unlockedSkills.includes(mapped));
      });
      if (available.length > 0) {
        droppedScroll = kt.random(available);
      }
    }

    const newConsumables = current.consumables.slice();
    let scrollMsg = '';
    if (droppedScroll != null) {
      const existingIdx = newConsumables.findIndex((it) => it.id === droppedScroll.id);
      if (existingIdx !== -1) {
        newConsumables[existingIdx] = newConsumables[existingIdx].copy({ count: newConsumables[existingIdx].count + 1 });
      } else {
        newConsumables.push(droppedScroll);
      }
      scrollMsg = `\n\n[ÖZEL GANİMET BULUNDU!]\n${droppedScroll.name} ele geçirildi! Kasabadaki Bilge Mütercim Jin-Zhen'e götürerek deşifre ettirebilirsin!`;
    }

    let intelMsg = '';
    let updatedKnownWeaknesses = current.knownWeaknessIds;
    if (quest.id === 'quest_arena_scout') {
      const allWeaknesses = StarterContent.getAllEnemyWeaknesses();
      const unknownWeaknesses = allWeaknesses.filter((it) => !current.knownWeaknessIds.includes(it.enemyId));
      if (unknownWeaknesses.length > 0) {
        const discovered = kt.random(unknownWeaknesses);
        updatedKnownWeaknesses = kt.setPlus(updatedKnownWeaknesses, discovered.enemyId);
        intelMsg = `\n\n[İSTİHBARAT ELDE EDİLDİ!]\n${discovered.enemyName}'in açığını çözdün: '${discovered.flawTitle}'!\n(${discovered.hintDescription})`;
      }
    }

    // Görev Şöhret Dengesi:
    const regionId = current.currentRegionId;
    const fameMap = { ...current.regionFame };
    const curFame = fameMap[regionId] ?? (regionId === 'tashisar' && current.hasGarrisonPass ? 10 : 0);
    const effectiveFameGain =
      curFame < 60 ? kt.coerceAtMost(quest.rewardFame, 2) : curFame < 85 ? kt.coerceAtMost(quest.rewardFame, 1) : quest.rewardFame >= 3 ? 1 : 0;

    // EXP ve Seviye Atlama Kontrolü
    const [expUpdatedPlayer, questLevelEvent] = this.processExpGain(current, quest.rewardExp);
    if (questLevelEvent != null) {
      this._levelUpEvent.value = questLevelEvent;
    }

    const updatedFame = kt.coerceIn(curFame + effectiveFameGain, 0, 100);
    fameMap[regionId] = updatedFame;
    if ((current.hasGarrisonPass || (fameMap['kirlangic'] ?? 0) >= 100) && (fameMap['tashisar'] ?? 0) < 10) {
      fameMap['tashisar'] = 10;
    }
    const newTitle = calculatePlayerTitleForRegion(regionId, updatedFame, current.hasGarrisonPass);

    let chainMsg = '';
    let updatedRumors = current.unlockedRumorQuestIds;
    if (quest.nextStageQuestId != null) {
      updatedRumors = kt.setPlus(kt.setMinus(updatedRumors, quest.id), quest.nextStageQuestId);
      chainMsg = `\n\n[GÖREV ZİNCİRİ İLERLEDİ!]\nSonraki Aşama (${quest.chainStep + 1}/${quest.maxChainSteps}) yarınki kasaba panosuna eklendi!`;
    } else if (quest.isRumorQuest) {
      updatedRumors = kt.setMinus(updatedRumors, quest.id);
    }

    const updatedCompletedQuests = kt.setPlus(current.completedQuestIds, quest.id);

    this._player.value = expUpdatedPlayer.copy({
      gold: current.gold + quest.rewardGold,
      regionFame: fameMap,
      globalFame: updatedFame,
      title: newTitle,
      inventory: newInv,
      consumables: newConsumables,
      knownWeaknessIds: updatedKnownWeaknesses,
      unlockedRumorQuestIds: updatedRumors,
      completedQuestIds: updatedCompletedQuests,
    });
    this._region.value = this._region.value.copy({ localFame: updatedFame });

    list[index] = quest.copy({ isClaimed: true, isRunning: false, elapsedSeconds: 0 });
    this._quests.value = list;

    this._lastQuestClaimResult.value = new QuestClaimResult({
      questId: quest.id,
      questTitle: quest.title,
      narrative: narrativeOutcome,
      goldEarned: quest.rewardGold,
      expEarned: quest.rewardExp,
      fameEarned: effectiveFameGain,
      droppedScroll: droppedScroll,
      droppedEquipment: quest.rewardItem,
      intelUnlockedText: intelMsg.length > 0 ? intelMsg : null,
    });

    const fameMsg = effectiveFameGain > 0 ? `, +${effectiveFameGain} Şöhret` : '';
    const msg = `Sözleşme tamamlandı! +${quest.rewardGold} Altın, +${quest.rewardExp} EXP${fameMsg}.${scrollMsg}${intelMsg}${chainMsg}`;
    return [true, msg];
  }

  // === 4 YUVALI SAVAŞ YETENEĞİ KUŞANMA SİSTEMİ ===

  equipSkillToSlot(skillId, slotIndex) {
    const current = this._player.value;
    if (!current.unlockedSkillIds.includes(skillId)) {
      return [false, 'Bu yeteneği henüz öğrenmedin!'];
    }
    if (!(slotIndex >= 0 && slotIndex <= 3)) {
      return [false, 'Geçersiz yetenek yuvası! (Yuvalar 1 - 4 arasındadır)'];
    }
    const currentEquipped = current.equippedSkillIds.slice();
    const eskiIdx = currentEquipped.indexOf(skillId);
    if (eskiIdx >= 0) currentEquipped.splice(eskiIdx, 1);
    if (slotIndex < currentEquipped.length) {
      currentEquipped[slotIndex] = skillId;
    } else {
      currentEquipped.push(skillId);
    }
    const finalized = kt.take(currentEquipped, 4);
    this._player.value = current.copy({ equippedSkillIds: finalized });
    const skillName = StarterSkills.getSkillById(skillId)?.name ?? skillId;
    return [true, `'${skillName}' ${finalized.indexOf(skillId) + 1}. savaş yuvasına yerleştirildi!`];
  }

  unequipSkillFromSlot(slotIndex) {
    const current = this._player.value;
    const currentEquipped = current.equippedSkillIds.slice();
    if (slotIndex >= 0 && slotIndex < currentEquipped.length) {
      const removedId = currentEquipped.splice(slotIndex, 1)[0];
      this._player.value = current.copy({ equippedSkillIds: currentEquipped });
      const skillName = StarterSkills.getSkillById(removedId)?.name ?? removedId;
      return [true, `'${skillName}' ${slotIndex + 1}. yuvadan çıkarıldı.`];
    }
    return [false, 'Bu yuva zaten boş!'];
  }

  toggleEquipSkill(skillId) {
    const current = this._player.value;
    if (!current.unlockedSkillIds.includes(skillId)) {
      return [false, 'Bu yetenek henüz öğrenilmedi!'];
    }
    const currentEquipped = current.equippedSkillIds.slice();
    if (currentEquipped.includes(skillId)) {
      const idx = currentEquipped.indexOf(skillId);
      currentEquipped.splice(idx, 1);
      this._player.value = current.copy({ equippedSkillIds: currentEquipped });
      const skillName = StarterSkills.getSkillById(skillId)?.name ?? skillId;
      return [true, `'${skillName}' ${idx + 1}. yuvadan çıkarıldı.`];
    } else {
      if (currentEquipped.length >= 4) {
        return [false, 'Tüm 4 savaş yuvası dolu! Önce bir yeteneği yuvadan çıkarmalısın.'];
      }
      currentEquipped.push(skillId);
      this._player.value = current.copy({ equippedSkillIds: currentEquipped });
      const skillName = StarterSkills.getSkillById(skillId)?.name ?? skillId;
      return [true, `'${skillName}' ${currentEquipped.length}. savaş yuvasına kuşandı!`];
    }
  }

  // === BİLGE MÜTERCİM JİN-ZHEN: KADİM TOMAR DEŞİFRE ETME ===

  decipherSealedScroll(scrollItemId) {
    const current = this._player.value;
    const consumables = current.consumables.slice();
    const scrollIndex = consumables.findIndex((it) => it.id === scrollItemId);
    if (scrollIndex === -1) {
      return [false, 'Çantanda böyle bir mühürlü tomar bulunmuyor!'];
    }
    const scrollItem = consumables[scrollIndex];
    const targetSkillId = StarterContent.getScrollSkillMapping(scrollItemId);
    if (targetSkillId == null) return [false, 'Bu tomarın dili deşifre edilemiyor!'];

    const targetSkill = StarterSkills.getSkillById(targetSkillId);
    if (targetSkill == null) return [false, 'Bilinmeyen bir savaş tekniği!'];

    if (current.unlockedSkillIds.includes(targetSkillId)) {
      return [false, `Bu tekniği (${targetSkill.name}) zaten çözmüş ve öğrenmişsin!`];
    }

    if (scrollItem.count > 1) {
      consumables[scrollIndex] = scrollItem.copy({ count: scrollItem.count - 1 });
    } else {
      consumables.splice(scrollIndex, 1);
    }

    const newUnlocked = kt.setPlus(current.unlockedSkillIds, targetSkillId);
    const newEquipped = current.equippedSkillIds.slice();
    let autoEquipNote = '';
    if (newEquipped.length < 4 && !newEquipped.includes(targetSkillId)) {
      newEquipped.push(targetSkillId);
      autoEquipNote = `\nOtomatik olarak ${newEquipped.length}. Savaş Yuvasına yerleştirildi!`;
    }

    this._player.value = current.copy({
      consumables: consumables,
      unlockedSkillIds: newUnlocked,
      equippedSkillIds: newEquipped,
    });

    return [
      true,
      `[KADİM DOĞU SIRRI ÇÖZÜLDÜ!]\nBilge Jin-Zhen tütsü dumanında parşömenin kırmızı balmumu mührünü eritti ve antik ideogramları sesli tercüme etti:\n\n'${targetSkill.name}' Yetenek Küresi Açıldı!\n"${targetSkill.description}"\n\nTetiklenme: ${targetSkill.triggerConditionText}\nSavaş Etkisi: ${targetSkill.effectSummary}${autoEquipNote}\n\n(Envanterdeki 4 Yetenek Yuvasından birine yerleştirerek dövüşlerde kullanabilirsin!)`,
    ];
  }

  // TAVERN / HAN INTERACTIONS
  getAllEnemyWeaknesses() {
    return StarterContent.getAllEnemyWeaknesses();
  }

  buyEnemyIntel(enemyId) {
    const current = this._player.value;
    const weakness = kt.firstOrNull(StarterContent.getAllEnemyWeaknesses(), (it) => it.enemyId === enemyId);
    if (weakness == null) return [false, 'Bu dövüşçü hakkında henüz bir istihbarat bulunmuyor!'];

    if (current.knownWeaknessIds.includes(enemyId)) {
      return [false, `${weakness.enemyName}'in açığını zaten biliyorsun (${weakness.flawTitle})!`];
    }

    if (current.gold < weakness.intelCostGold) {
      return [false, `Muhbire ödemek için yeterli altının yok! (${weakness.intelCostGold} Altın gerekli)`];
    }

    this._player.value = current.copy({
      gold: current.gold - weakness.intelCostGold,
      knownWeaknessIds: kt.setPlus(current.knownWeaknessIds, enemyId),
      encounteredEnemyIds: kt.setPlus(current.encounteredEnemyIds, enemyId),
    });

    const narrative = `Muhbir arkasına bakarak kulağına fısıldadı:\n'${weakness.enemyName} hakkındaki sırrı istiyordun demek... ${weakness.hintDescription}'\n\n(Dövüşte %${weakness.exploitChancePercent} şansla +%${weakness.bonusDamagePercent} hasar ve zırh delme avantajı elde ettin! Notlar evindeki kütüphaneye işlendi.)`;
    return [true, narrative];
  }

  buyRandomEnemyIntel(bribeAmount = 30) {
    const current = this._player.value;
    const allWeaknesses = StarterContent.getAllEnemyWeaknesses();
    const unknown = allWeaknesses.filter((it) => !current.knownWeaknessIds.includes(it.enemyId));

    if (unknown.length === 0) {
      return [false, "Muhbir ellerini iki yana açtı: 'Kasabadaki tüm gladyatörlerin sakladığı açıklarını zaten biliyorsun! Artık sana fısıldayacak yeni bir sırrım kalmadı.'"];
    }

    if (current.gold < bribeAmount) {
      return [false, `Muhbire rüşvet vermek için yeterli altının yok! (${bribeAmount} Altın gerekli)`];
    }

    const discovered = kt.random(unknown);
    this._player.value = current.copy({
      gold: current.gold - bribeAmount,
      knownWeaknessIds: kt.setPlus(current.knownWeaknessIds, discovered.enemyId),
      encounteredEnemyIds: kt.setPlus(current.encounteredEnemyIds, discovered.enemyId),
    });

    const narrative = `Muhbir altın kesesini cebine atıp kulağına fısıldadı:\n'${discovered.enemyName}'ın kumlarda sakladığı bir kusur var... ${discovered.hintDescription}'\n\n(Dövüşte %${discovered.exploitChancePercent} şansla +%${discovered.bonusDamagePercent} hasar ve zırh delme avantajı elde ettin! Notlar evindeki kütüphaneye işlendi.)`;
    return [true, narrative];
  }

  getEncounteredEnemyDossiers() {
    const current = this._player.value;
    const encounteredIds = kt.setPlusAll(current.encounteredEnemyIds, current.knownWeaknessIds);
    const unlockedRegions = current.getUnlockedRegionIds();
    const allEnemies = [...this._enemies.value, ...this._tashisarEnemies.value].filter((it) => unlockedRegions.includes(it.regionId));
    const allWeaknesses = kt.associateBy(StarterContent.getAllEnemyWeaknesses(), (it) => it.enemyId);

    return allEnemies
      .filter((it) => encounteredIds.includes(it.id))
      .map((enemy) => {
        const weakness = allWeaknesses[enemy.id] ?? null;
        const isKnown = current.knownWeaknessIds.includes(enemy.id);
        return new FighterDossier({
          enemy: enemy,
          weakness: weakness,
          isWeaknessKnown: isKnown,
        });
      });
  }

  markCharacterEncountered(characterId) {
    const current = this._player.value;
    if (!current.encounteredCharacterIds.includes(characterId)) {
      this._player.value = current.copy({
        encounteredCharacterIds: kt.setPlus(current.encounteredCharacterIds, characterId),
      });
    }
  }

  getAllCharacterProfilesWithLiveState() {
    const player = this._player.value;
    const tashisarEnemies = this._tashisarEnemies.value;
    const allEnemies = kt.associateBy([...this._enemies.value, ...tashisarEnemies], (it) => it.id);
    const allWeaknesses = kt.associateBy(StarterContent.getAllEnemyWeaknesses(), (it) => it.enemyId);
    const unlockedRegions = player.getUnlockedRegionIds();
    const visibleProfiles = CharacterRegistryData.getAllProfiles().filter((it) => unlockedRegions.includes(it.regionId));

    return visibleProfiles.map((profile) => {
      const isUnlocked = player.isCharacterEncountered(profile.id);
      const liveEnemy = profile.enemyId != null ? (allEnemies[profile.enemyId] ?? null) : null;
      const weakness = profile.enemyId != null ? (allWeaknesses[profile.enemyId] ?? null) : null;
      const isWeaknessKnown = profile.enemyId != null ? player.knownWeaknessIds.includes(profile.enemyId) : false;

      return new LiveCharacterProfile({
        profile: profile,
        isUnlocked: isUnlocked,
        liveEnemy: liveEnemy,
        weakness: weakness,
        isWeaknessKnown: isWeaknessKnown,
      });
    });
  }

  sellEquipment(item) {
    const current = this._player.value;
    if (!current.inventory.some((it) => it.id === item.id)) {
      return [false, 'Bu eşya çantanızda bulunmuyor!'];
    }
    if (current.isEquipped(item)) {
      return [false, 'Üzerine kuşanılmış teçhizatı satamazsın! Önce çıkarmalı veya başka bir eşya kuşanmalısın.'];
    }

    const price = item.sellPrice;
    const newInv = current.inventory.slice();
    removeFirst(newInv, item);

    this._player.value = current.copy({
      gold: current.gold + price,
      inventory: newInv,
    });

    return [true, `${item.name} satıldı. +${price} Altın kazandın!`];
  }

  get isAnyTaskRunning() {
    return this._quests.value.some((it) => it.isRunning && !it.isFinished) || this._adventures.value.some((it) => it.isRunning && !it.isFinished);
  }

  // --- BÖLGE SEYAHATİ (REGION TRAVEL) ---
  travelToRegion(targetRegionId) {
    const currentP = this._player.value;
    if (currentP.currentRegionId === targetRegionId) {
      return [false, 'Zaten bu bölgedesin!'];
    }
    if (targetRegionId === 'tashisar' && !this.canTravelToRegion2) {
      return [false, "Taş Hisar Garnizonu'na geçmek için 1. Bölgeyi tamamlamalı (Morvath'ı yenmeli) veya Garnizon Geçiş Fermanı taşımalısın!"];
    }

    const targetRegion = targetRegionId === 'tashisar' ? StarterContent.createRegion2() : StarterContent.createInitialRegion();

    const currentRegionFameMap = { ...currentP.regionFame };
    if (targetRegionId === 'tashisar' && (currentRegionFameMap['tashisar'] ?? 0) < 10) {
      currentRegionFameMap['tashisar'] = 10;
    }
    const targetFame = currentRegionFameMap[targetRegionId] ?? 0;
    const targetTitle = calculatePlayerTitleForRegion(targetRegionId, targetFame, currentP.hasGarrisonPass);

    this._player.value = currentP.copy({
      currentRegionId: targetRegionId,
      regionFame: currentRegionFameMap,
      globalFame: targetFame,
      title: targetTitle,
    });
    this._region.value = targetRegion.copy({ localFame: targetFame });

    // Bölgeye özel maceraları güncelle
    const allAdv = StarterContent.createInitialAdventures();
    const filteredAdv =
      targetRegionId === 'tashisar'
        ? allAdv.filter((it) => it.id.startsWith('adv_mountain') || it.id.startsWith('adv_obsidian'))
        : allAdv.filter((it) => !it.id.startsWith('adv_mountain') && !it.id.startsWith('adv_obsidian'));
    this._adventures.value = filteredAdv;

    // Günlük sözleşmeleri de tazele
    this.refreshDailyQuests();

    const destName = targetRegionId === 'tashisar' ? "Taş Hisar Garnizonu'na" : "Kırlangıç Kasabası'na";
    return [true, `Sarp yolları aşarak ${destName} ulaştın. Yeni bölgenin çarşısı ve görev panosu açıldı!`];
  }

  // --- MÜCEVHERATÇI & TAŞ SİSTEMİ (GEM SOCKETING & SYNTHESIS) ---
  addSocketToEquipment(equipmentId) {
    if (!this.canTravelToRegion2) {
      return [false, 'Taş yuvası açma kilitli! Bu kadim zanaat ancak 2. Bölüm (Taş Hisar Garnizonu) fermanı açıldığında kullanılabilir.'];
    }
    const currentP = this._player.value;
    const inv = currentP.inventory.slice();
    const index = inv.findIndex((it) => it.id === equipmentId);
    if (index === -1) return [false, 'Teçhizat çantanızda bulunamadı!'];

    const item = inv[index];
    if (!item.canUnlockMoreSockets) {
      return [false, `Bu teçhizatta daha fazla yuva açılamaz (${item.unlockedSockets}/${item.effectiveMaxSockets} Yuva Açık)!`];
    }
    const costGold = GemCraftingRules.getSocketDrillCost(item.unlockedSockets);
    if (currentP.gold < costGold) {
      return [false, `Yuva deldirmek için yeterli altınınız yok! (${costGold} Altın gerekli)`];
    }

    const updatedItem = item.copy({ unlockedSockets: item.unlockedSockets + 1 });
    inv[index] = updatedItem;

    const updatedEquipped = { ...currentP.equipped };
    if (updatedEquipped[item.slot]?.id === item.id) {
      updatedEquipped[item.slot] = updatedItem;
    }

    this._player.value = currentP.copy({
      gold: currentP.gold - costGold,
      inventory: inv,
      equipped: updatedEquipped,
    });
    return [true, `${item.name} üzerine yeni bir yuva açıldı (${updatedItem.unlockedSockets}/${updatedItem.effectiveMaxSockets} Yuva) (-${costGold} Altın)!`];
  }

  unlockAllSocketsForEquipment(equipmentId) {
    if (!this.canTravelToRegion2) {
      return [false, 'Taş yuvası açma kilitli! Bu kadim zanaat ancak 2. Bölüm (Taş Hisar Garnizonu) fermanı açıldığında kullanılabilir.'];
    }
    let count = 0;
    let totalCost = 0;
    while (true) {
      const currentP = this._player.value;
      const item = kt.firstOrNull(currentP.inventory, (it) => it.id === equipmentId);
      if (item == null) break;
      if (!item.canUnlockMoreSockets) break;
      const cost = GemCraftingRules.getSocketDrillCost(item.unlockedSockets);
      if (currentP.gold < cost) break;
      const [success] = this.addSocketToEquipment(equipmentId);
      if (!success) break;
      count++;
      totalCost += cost;
    }
    if (count === 0) {
      return [false, 'Açılabilecek yuva yok veya yeterli altınınız bulunmuyor!'];
    }
    return [true, `[TÜM YUVALAR AÇILDI] Toplam ${count} adet yeni yuva delindi (-${totalCost} Altın)!`];
  }

  insertGemIntoEquipment(equipmentId, gemId, costGold = GemCraftingRules.GEM_SOCKET_COST_GOLD) {
    if (!this.canTravelToRegion2) {
      return [false, 'Mücevher kakma kilitli! Bu kadim zanaat ancak 2. Bölüm (Taş Hisar Garnizonu) fermanı açıldığında kullanılabilir.'];
    }
    const currentP = this._player.value;
    const inv = currentP.inventory.slice();
    const itemIndex = inv.findIndex((it) => it.id === equipmentId);
    if (itemIndex === -1) return [false, 'Teçhizat bulunamadı!'];

    const item = inv[itemIndex];
    if (item.freeSockets <= 0) {
      return [false, "Bu eşyada açık boş taş yuvası yok! Önce Taş Ustası Kael'e yuva deldirmelisiniz."];
    }

    const gemIndex = currentP.gemsInventory.findIndex((it) => it.id === gemId);
    if (gemIndex === -1) return [false, 'Taş çantanızda bulunamadı!'];

    if (currentP.gold < costGold) {
      return [false, `Taş kakma işçiliği için ${costGold} Altın gereklidir! (Mevcut: ${currentP.gold} Altın)`];
    }

    const gemToInsert = currentP.gemsInventory[gemIndex];
    const updatedGems = currentP.gemsInventory.slice();
    updatedGems.splice(gemIndex, 1);
    const updatedItem = item.copy({ sockets: [...item.sockets, gemToInsert] });
    inv[itemIndex] = updatedItem;

    const updatedEquipped = { ...currentP.equipped };
    if (updatedEquipped[item.slot]?.id === item.id) {
      updatedEquipped[item.slot] = updatedItem;
    }

    this._player.value = currentP.copy({
      gold: currentP.gold - costGold,
      inventory: inv,
      equipped: updatedEquipped,
      gemsInventory: updatedGems,
    });
    return [true, `${gemToInsert.displayName} başarıyla ${item.name} içine mıhlandı (-${costGold} Altın)! (${gemToInsert.effectSummary})`];
  }

  removeGemFromEquipment(equipmentId, gemIndex, costGold = GemCraftingRules.GEM_REMOVE_COST_GOLD) {
    const currentP = this._player.value;
    const inv = currentP.inventory.slice();
    const itemIndex = inv.findIndex((it) => it.id === equipmentId);
    if (itemIndex === -1) return [false, 'Teçhizat bulunamadı!'];

    const item = inv[itemIndex];
    if (!(gemIndex >= 0 && gemIndex < item.sockets.length)) {
      return [false, 'Geçersiz taş yuvası!'];
    }
    if (currentP.gold < costGold) {
      return [false, `Taş sökme hassas işçiliği için ${costGold} Altın gereklidir! (Mevcut: ${currentP.gold} Altın)`];
    }

    const removedGem = item.sockets[gemIndex];
    const updatedSockets = item.sockets.slice();
    updatedSockets.splice(gemIndex, 1);
    const updatedItem = item.copy({ sockets: updatedSockets });
    inv[itemIndex] = updatedItem;

    const updatedEquipped = { ...currentP.equipped };
    if (updatedEquipped[item.slot]?.id === item.id) {
      updatedEquipped[item.slot] = updatedItem;
    }

    this._player.value = currentP.copy({
      gold: currentP.gold - costGold,
      inventory: inv,
      equipped: updatedEquipped,
      gemsInventory: [...currentP.gemsInventory, removedGem],
    });
    return [true, `${removedGem.displayName} kırılmadan söküldü ve çantana koyuldu (-${costGold} Altın).`];
  }

  combineGemShards(type) {
    if (!this.canTravelToRegion2) {
      return [false, 'Taş zanaatı kilitli! Bu kadim zanaat ancak 2. Bölüm (Taş Hisar Garnizonu) fermanı açıldığında kullanılabilir.'];
    }
    const currentP = this._player.value;
    const count = currentP.getShardCount(type);
    if (count < GemCraftingRules.SHARDS_PER_GEM) {
      return [false, `Yetersiz kırık parça! 1 tam taş oluşturmak için 3 adet ${type.displayName} Kırığı gereklidir (Mevcut: ${count}).`];
    }
    const costGold = GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD;
    if (currentP.gold < costGold) {
      return [false, `Taş sentezleme işçiliği için ${costGold} Altın gereklidir! (Mevcut: ${currentP.gold} Altın)`];
    }

    const updatedShards = { ...currentP.gemShards };
    const newCount = count - GemCraftingRules.SHARDS_PER_GEM;
    if (newCount > 0) updatedShards[type] = newCount;
    else delete updatedShards[type];

    const newGem = Gem.create(type, 1);
    this._player.value = currentP.copy({
      gold: currentP.gold - costGold,
      gemShards: updatedShards,
      gemsInventory: [...currentP.gemsInventory, newGem],
    });
    return [true, `[SENTEZ BAŞARILI!] 3x ${type.displayName} Kırığı birleştirildi -> 1x ${newGem.displayName} elde edildi (-${costGold} Altın)!`];
  }

  combineAllGemShards() {
    if (!this.canTravelToRegion2) {
      return [false, 'Taş zanaatı kilitli! Bu kadim zanaat ancak 2. Bölüm (Taş Hisar Garnizonu) fermanı açıldığında kullanılabilir.'];
    }
    const currentP = this._player.value;
    const eligible = kt.filterValues(currentP.gemShards, (v) => v >= GemCraftingRules.SHARDS_PER_GEM);
    if (Object.keys(eligible).length === 0) {
      return [false, 'Sentezlenebilecek yeterli kırık parça bulunmuyor (En az 3 adet aynı tür kırık gerekir).'];
    }

    let totalCrafted = 0;
    let totalGoldSpent = 0;
    let playerGold = currentP.gold;
    const updatedShards = { ...currentP.gemShards };
    const newGems = [];

    for (const [type, count] of kt.entriesOf(eligible, GemType)) {
      let remainingCount = count;
      while (remainingCount >= GemCraftingRules.SHARDS_PER_GEM && playerGold >= GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD) {
        remainingCount -= GemCraftingRules.SHARDS_PER_GEM;
        playerGold -= GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD;
        totalGoldSpent += GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD;
        totalCrafted++;
        newGems.push(Gem.create(type, 1));
      }
      if (remainingCount > 0) {
        updatedShards[type] = remainingCount;
      } else {
        delete updatedShards[type];
      }
    }

    if (totalCrafted === 0) {
      return [false, `Kırıkları sentezlemek için yeterli altınınız yok! (İşlem başına ${GemCraftingRules.SHARD_SYNTHESIS_COST_GOLD} Altın)`];
    }

    this._player.value = currentP.copy({
      gold: playerGold,
      gemShards: updatedShards,
      gemsInventory: [...currentP.gemsInventory, ...newGems],
    });

    return [true, `[TOPLU SENTEZ] Toplam ${totalCrafted} adet Seviye 1 cevher dövüldü (-${totalGoldSpent} Altın)!`];
  }

  upgradeAllEligibleGems() {
    if (!this.canTravelToRegion2) {
      return [false, 'Taş yükseltme kilitli! Bu kadim zanaat ancak 2. Bölüm (Taş Hisar Garnizonu) fermanı açıldığında kullanılabilir.'];
    }
    let successCount = 0;
    let failCount = 0;
    let totalCost = 0;

    while (true) {
      const currentP = this._player.value;
      // groupBy { it.type to it.level } (ilk görülme sırası korunur)
      const groups = [];
      for (const g of currentP.gemsInventory.filter((it) => it.level < GemCraftingRules.MAX_GEM_LEVEL)) {
        let grp = groups.find((x) => x.type === g.type && x.level === g.level);
        if (!grp) {
          grp = { type: g.type, level: g.level, value: [] };
          groups.push(grp);
        }
        grp.value.push(g);
      }
      const eligibleGroup = kt.firstOrNull(
        groups,
        (it) => it.value.length >= GemCraftingRules.GEMS_PER_UPGRADE && currentP.gold >= GemCraftingRules.getUpgradeCostGold(it.level),
      );

      if (eligibleGroup == null) break;

      const { type, level } = eligibleGroup;
      const cost = GemCraftingRules.getUpgradeCostGold(level);
      const [success] = this.upgradeGemLevel(type, level);
      totalCost += cost;
      if (success) successCount++;
      else failCount++;
    }

    if (successCount === 0 && failCount === 0) {
      return [false, 'Yükseltilebilecek (en az 3 adet aynı seviye ve yeterli altın olan) taş bulunmuyor.'];
    }

    return [
      true,
      `[TOPLU YÜKSELTME] ${successCount} Başarılı, ${failCount} Başarısız işlem (-${totalCost} Altın). Kırılan taşlar için telafi (pity) ve teselli parçaları eklendi!`,
    ];
  }

  upgradeGemLevel(type, currentLevel) {
    if (!this.canTravelToRegion2) {
      return [false, 'Taş yükseltme kilitli! Bu kadim zanaat ancak 2. Bölüm (Taş Hisar Garnizonu) fermanı açıldığında kullanılabilir.'];
    }
    if (currentLevel >= GemCraftingRules.MAX_GEM_LEVEL) {
      return [false, `Bu taş zaten azami seviyeye (Sv. ${GemCraftingRules.MAX_GEM_LEVEL}) ulaşmış durumda!`];
    }
    const currentP = this._player.value;
    const matchingGems = currentP.gemsInventory.filter((it) => it.type === type && it.level === currentLevel);
    if (matchingGems.length < GemCraftingRules.GEMS_PER_UPGRADE) {
      return [
        false,
        `Seviye atlatmak için aynı seviyede ${GemCraftingRules.GEMS_PER_UPGRADE} adet ${type.displayName} (Sv. ${currentLevel}) gereklidir! (Mevcut: ${matchingGems.length})`,
      ];
    }
    const costGold = GemCraftingRules.getUpgradeCostGold(currentLevel);
    if (currentP.gold < costGold) {
      return [false, `Taş birleştirme tezgah harcı için ${costGold} Altın gereklidir! (Mevcut: ${currentP.gold} Altın)`];
    }

    const targetLevel = currentLevel + 1;
    const currentPity = currentP.getPityForLevel(targetLevel);
    const baseSuccessRate = GemCraftingRules.getBaseSuccessRate(targetLevel);
    const effectiveSuccessRate = GemCraftingRules.getEffectiveSuccessRate(targetLevel, currentPity);

    const updatedGems = [];
    let removed = 0;
    for (const g of currentP.gemsInventory) {
      if (removed < GemCraftingRules.GEMS_PER_UPGRADE && g.type === type && g.level === currentLevel) {
        removed++;
      } else {
        updatedGems.push(g);
      }
    }

    const roll = kt.Random.nextInt(1, 101);
    const isSuccess = roll <= effectiveSuccessRate;

    if (isSuccess) {
      const upgradedGem = Gem.create(type, targetLevel);
      updatedGems.push(upgradedGem);

      // Başarı durumunda ilgili seviyenin telafi (pity) şansı sıfırlanır
      const updatedPity = kt.mapMinus(currentP.gemUpgradePity, targetLevel);

      this._player.value = currentP.copy({
        gold: currentP.gold - costGold,
        gemsInventory: updatedGems,
        gemUpgradePity: updatedPity,
      });
      return [
        true,
        `[YÜKSELTME BAŞARILI! - Şans: %${effectiveSuccessRate} (Temel: %${baseSuccessRate}${currentPity > 0 ? ` + %${currentPity} Telafi` : ''})] Usta Kael'in çekici örste yankılandı! 3x Sv. ${currentLevel} ${type.displayName} birleşerek 1x ${upgradedGem.displayName} dövüldü! (${upgradedGem.effectSummary})`,
      ];
    } else {
      // Başarısızlık: Taşlar kırılır, telafi (pity) bonusu eklenir ve teselli kırığı verilir
      const newPity = kt.coerceAtMost(currentPity + GemCraftingRules.PITY_BONUS_PER_FAILURE, 100);
      const updatedPity = kt.mapPlus(currentP.gemUpgradePity, targetLevel, newPity);

      const consolationShards = 2;
      const currentShards = currentP.getShardCount(type);
      const updatedShards = kt.mapPlus(currentP.gemShards, type, currentShards + consolationShards);

      this._player.value = currentP.copy({
        gold: currentP.gold - costGold,
        gemsInventory: updatedGems,
        gemShards: updatedShards,
        gemUpgradePity: updatedPity,
      });
      return [
        false,
        `[YÜKSELTME BAŞARISIZ! - Şans: %${effectiveSuccessRate} (Zar: ${roll})] Aşırı çekiç baskısı sebebiyle taşlar çatlayıp parçalandı! Usta Kael tezgahtan toplanan +${consolationShards} adet ${type.displayName} Kırığı verdi. Telafi Sistemi Devrede: Sv. ${targetLevel} için başarı şansına +%${GemCraftingRules.PITY_BONUS_PER_FAILURE} eklendi (Toplam Telafi Bonusu: +%${newPity})!`,
      ];
    }
  }

  // --- DEPO MAHZENİ & SANDIK ODASI (STORAGE VAULT) ---
  unlockChestSlot() {
    const currentP = this._player.value;
    if (currentP.unlockedChestSlots >= 4) {
      return [false, 'Tüm sandık alanları zaten açılmış durumda (4/4)!'];
    }
    const costGold = currentP.unlockedChestSlots === 2 ? 100 : currentP.unlockedChestSlots === 3 ? 200 : 300;
    if (currentP.gold < costGold) {
      return [false, `Yeni sandık yuvası açmak için ${costGold} Altın gereklidir! (Mevcut: ${currentP.gold} Altın)`];
    }
    this._player.value = currentP.copy({
      gold: currentP.gold - costGold,
      unlockedChestSlots: currentP.unlockedChestSlots + 1,
    });
    return [true, `Yeni sandık alanı açıldı (${this._player.value.unlockedChestSlots}/4 Sandık Yuvası Açık)!`];
  }

  buildChest(slotIndex, chestType) {
    const currentP = this._player.value;
    if (!(slotIndex >= 0 && slotIndex < currentP.unlockedChestSlots)) {
      return [false, 'Bu sandık yuvası henüz açılmamış!'];
    }
    if (currentP.builtChests.some((it) => it.slotIndex === slotIndex)) {
      return [false, 'Bu alanda zaten bir sandık inşa edilmiş!'];
    }
    const costGold = 60;
    if (currentP.gold < costGold) {
      return [false, `Sandık inşası için ${costGold} Altın gereklidir! (Mevcut: ${currentP.gold} Altın)`];
    }
    const newChest = new StorageChest({ slotIndex: slotIndex, type: chestType, level: 1, capacity: 50 });
    this._player.value = currentP.copy({
      gold: currentP.gold - costGold,
      builtChests: [...currentP.builtChests, newChest],
    });
    return [true, `${chestType.displayName} başarıyla inşa edildi! (Hacim: 50)`];
  }

  upgradeChest(slotIndex) {
    const currentP = this._player.value;
    const chest = kt.firstOrNull(currentP.builtChests, (it) => it.slotIndex === slotIndex);
    if (chest == null) return [false, 'Sandık bulunamadı!'];
    const cost = chest.upgradeCostGold;
    if (currentP.gold < cost) {
      return [false, `Sandık genişletmesi için ${cost} Altın gereklidir! (Mevcut: ${currentP.gold} Altın)`];
    }
    const upgraded = chest.copy({ level: chest.level + 1, capacity: chest.capacity + 50 });
    const updatedChests = currentP.builtChests.map((it) => (it.slotIndex === slotIndex ? upgraded : it));
    this._player.value = currentP.copy({
      gold: currentP.gold - cost,
      builtChests: updatedChests,
    });
    return [true, `${chest.type.displayName} Seviye ${upgraded.level}'e yükseltildi! Yeni Kapasite: ${upgraded.capacity}`];
  }

  // --- OTOMATİK HASAT BÖLGESİ (HARVESTING LOOP) ---
  performHarvestTick(areaType) {
    if (!this.canTravelToRegion2) {
      return new HarvestResult({ success: false, narrative: 'Diyar Kaynak Sahaları kilitli! 2. Bölüm (Taş Hisar Garnizonu) fermanını almalısın.' });
    }
    const currentP = this._player.value;
    const roll = kt.randomIn(1, 100);
    if (roll > 40) {
      const failMessages = [
        'Kazma taşa çarptı, bu seferlik bir şey çıkmadı...',
        'Rüzgar tohumları savurdu, aranmaya devam ediyorsun.',
        'Sert bir kayaya denk geldin, çatlağı yokluyorsun...',
        'Çalıların arası boş görünüyor, diğer kümeye geçtin.',
      ];
      return new HarvestResult({ success: false, narrative: kt.random(failMessages) });
    }

    const matMap = { ...currentP.craftingMaterials };
    const shardMap = { ...currentP.gemShards };
    let result;

    switch (areaType) {
      case 'mines': {
        const isShard = kt.randomIn(1, 100) <= 20;
        if (isShard) {
          const randomGemType = kt.random(GemType.values());
          const curShards = shardMap[randomGemType] ?? 0;
          shardMap[randomGemType] = curShards + 1;
          const hasChest = currentP.builtChests.some((it) => it.type === ChestType.JEWELRY_CHEST);
          const destNote = hasChest ? ' (Mücevher Sandığına aktarıldı)' : '';
          result = new HarvestResult({
            success: true,
            narrative: `Parlayan bir damardan 1x ${randomGemType.displayName} Kırığı çıkardın! (${curShards + 1}/3)${destNote}`,
            resourceName: `${randomGemType.displayName} Kırığı`,
            resourceIcon: randomGemType.icon,
            amount: 1,
            isShard: true,
            shardType: randomGemType,
          });
        } else {
          const isIron = kt.randomIn(1, 100) <= 50;
          const key = isIron ? 'mat_iron_ore' : 'mat_stone';
          const name = isIron ? 'Demir Filizi' : 'Ham İnşaat Taşı';
          const icon = isIron ? '' : '';
          const chestType = isIron ? ChestType.IRON_CHEST : ChestType.STONE_CHEST;
          const amount = kt.randomIn(1, 2);
          const cur = matMap[key] ?? 0;
          matMap[key] = cur + amount;
          const hasChest = currentP.builtChests.some((it) => it.type === chestType);
          const destNote = hasChest ? ` (${chestType.displayName}'na aktarıldı)` : '';
          result = new HarvestResult({
            success: true,
            narrative: `Kayaları kırarak +${amount} ${name} elde ettin!${destNote}`,
            resourceName: name,
            resourceIcon: icon,
            amount: amount,
          });
        }
        break;
      }
      case 'herbs': {
        const amount = kt.randomIn(1, 2);
        const cur = matMap['mat_herb'] ?? 0;
        matMap['mat_herb'] = cur + amount;
        const hasChest = currentP.builtChests.some((it) => it.type === ChestType.HERB_CHEST);
        const destNote = hasChest ? ' (Şifalı Bitki Sandığına aktarıldı)' : '';
        result = new HarvestResult({
          success: true,
          narrative: `Ayaz çayırından +${amount} Şifalı Yabani Ot topladın!${destNote}`,
          resourceName: 'Şifalı Yabani Ot',
          resourceIcon: '',
          amount: amount,
        });
        break;
      }
      case 'cloth': {
        const amount = kt.randomIn(1, 2);
        const cur = matMap['mat_cloth'] ?? 0;
        matMap['mat_cloth'] = cur + amount;
        const hasChest = currentP.builtChests.some((it) => it.type === ChestType.CLOTH_CHEST);
        const destNote = hasChest ? ' (Kumaş & İp Sandığına aktarıldı)' : '';
        result = new HarvestResult({
          success: true,
          narrative: `Keten tarlasından +${amount} Keten & Halat Lifi eğirdin!${destNote}`,
          resourceName: 'Keten Lifleri',
          resourceIcon: '',
          amount: amount,
        });
        break;
      }
      case 'wood': {
        const amount = kt.randomIn(1, 2);
        const cur = matMap['mat_wood'] ?? 0;
        matMap['mat_wood'] = cur + amount;
        const hasChest = currentP.builtChests.some((it) => it.type === ChestType.WOOD_CHEST);
        const destNote = hasChest ? ' (Odun Sandığına aktarıldı)' : '';
        result = new HarvestResult({
          success: true,
          narrative: `Kadim koruluktan +${amount} Sert Meşe Kerestesi kestin!${destNote}`,
          resourceName: 'Sert Meşe Kerestesi',
          resourceIcon: '',
          amount: amount,
        });
        break;
      }
      default: {
        result = new HarvestResult({ success: false, narrative: 'Bilinmeyen hasat bölgesi.' });
      }
    }

    this._player.value = currentP.copy({
      craftingMaterials: matMap,
      gemShards: shardMap,
    });
    return result;
  }

  // --- BÜYÜK TALİM MEYDANI (TRAINING GROUNDS) ---
  trainAtTrainingGrounds(trainingType) {
    const currentP = this._player.value;
    const costGold = 30;
    if (currentP.gold < costGold) {
      return [false, 'Talim meydanı girişi ve teçhizat kullanımı için 30 Altın gereklidir!'];
    }
    const isMagic = trainingType === 'magic';
    const expGain = 25;
    const [updatedP, lvlEvt] = this.processExpGain(
      currentP.copy({
        gold: currentP.gold - costGold,
        activeMoraleBuff: isMagic ? 'Mistik Rün Odaklanması (+5 Can, +%3 Kritik)' : 'Savaşçı Keskinliği (+5 Can, +%3 Sıyrılma)',
      }),
      expGain,
    );
    this._player.value = updatedP;
    if (lvlEvt != null) this._levelUpEvent.value = lvlEvt;

    const title = isMagic ? 'Kadim Büyü ve Rün Odaklanması' : 'Kılıç ve Yakın Dövüş Talimi';
    return [true, `[TALİM TAMAMLANDI!] ${title} ile ter döktün (+25 EXP kazandın, zihnin ve bedenin keskinleşti).`];
  }

  // --- ÖZEL EĞİTMEN ALTHEA TALİMHANESİ & YETENEK TOPLARI ---
  trainWithAlthea(trainingType) {
    const currentP = this._player.value;
    const trainer = currentP.trainerStatus;

    // Giriş sınavı kontrolü (Kızıl Muhafız Althea'nın Sınavı)
    const hasCompletedTrial = currentP.inventory.some((it) => it.id === 'quest_trainer_trial') || trainer.isUnlocked;
    if (!hasCompletedTrial && !currentP.unlockedRumorQuestIds.includes('quest_trainer_trial_done')) {
      return [false, "Althea sertçe süzdü: 'Önce Fırtına Zirvesi sınavını tamamlayıp rüştünü kanıtla! Acemileri talimhaneme sokmam.'"];
    }

    if (currentP.gold < trainingType.costGold) {
      return [false, `Althea'nın talim seansı için yeterli altının yok! (${trainingType.costGold} Altın gerekli)`];
    }
    if (currentP.currentHealth <= trainingType.costHp + 5) {
      return [false, `Çok yorgun ve yaralısın! Althea'nın sert antrenmanına dayanacak canın yok (${trainingType.costHp} Can harcar).`];
    }

    let updatedTrainer;
    switch (trainingType) {
      case TrainingType.ENDURANCE:
        updatedTrainer = trainer.copy({ isUnlocked: true, enduranceCount: trainer.enduranceCount + 1 });
        break;
      case TrainingType.STRENGTH:
        updatedTrainer = trainer.copy({ isUnlocked: true, strengthCount: trainer.strengthCount + 1 });
        break;
      case TrainingType.AGILITY:
        updatedTrainer = trainer.copy({ isUnlocked: true, agilityCount: trainer.agilityCount + 1 });
        break;
    }

    const newTotalSessions = updatedTrainer.totalSessions;
    let unlockedSkills = currentP.unlockedSkillIds.slice();
    let newSkillUnlockedText = '';

    if (newTotalSessions >= 10 && !unlockedSkills.includes(StarterSkills.IRON_WILL.id)) {
      unlockedSkills = kt.setPlus(unlockedSkills, StarterSkills.IRON_WILL.id);
      newSkillUnlockedText =
        "\n\n[YENİ YETENEK KAZANILDI: DEMİR İRADE!]\nAlthea kılıcını indirip başıyla onayladı: 'Acıyı zırha çevirmeyi nihayet öğrendin.' Can %40 altına indiğinde savaşta otomatik koruma kalkanı tetiklenecek!";
    }
    if (newTotalSessions >= 20 && !unlockedSkills.includes(StarterSkills.CRUSHING_IMPACT.id)) {
      unlockedSkills = kt.setPlus(unlockedSkills, StarterSkills.CRUSHING_IMPACT.id);
      newSkillUnlockedText =
        "\n\n[YENİ YETENEK KAZANILDI: EZİCİ BALYOZ!]\nAlthea hafifçe tebessüm etti: 'Her 4 vuruşta bir vücut ağırlığını tek noktaya patlat.' Rakibin savunmasını kıran sersemletici vuruş açıldı!";
    }
    if (newTotalSessions >= 30 && !unlockedSkills.includes(StarterSkills.COUNTER_FLURRY.id)) {
      unlockedSkills = kt.setPlus(unlockedSkills, StarterSkills.COUNTER_FLURRY.id);
      newSkillUnlockedText =
        "\n\n[YENİ YETENEK KAZANILDI: AKROBATİK KARŞI VURUŞ!]\nAlthea hayranlıkla kırmızı çizmesini yere vurdu: 'Hızıma yetiştin sürgün!' Düşman saldırısını sıyırdığın an anında karşı saldırı indireceksin!";
    }

    const gainedExp = 35 + newTotalSessions * 5;
    const [expUpdatedPlayer, levelEvent] = this.processExpGain(
      currentP.copy({
        gold: currentP.gold - trainingType.costGold,
        currentHealth: currentP.currentHealth - trainingType.costHp,
        trainerStatus: updatedTrainer,
        unlockedSkillIds: unlockedSkills,
      }),
      gainedExp,
    );

    this._player.value = expUpdatedPlayer;
    if (levelEvent != null) {
      this._levelUpEvent.value = levelEvent;
    }

    const msg = `${trainingType.title} tamamlandı! (-${trainingType.costGold} Altın, -${trainingType.costHp} Can, +${gainedExp} EXP)\nToplam Seans: ${newTotalSessions} (Sonraki Aşama: ${updatedTrainer.nextMilestone})${newSkillUnlockedText}`;
    return [true, msg];
  }

  // --- KIZIL KADİFE KÖŞKÜ & GİZLİ DİVAN ---
  visitCourtesanBath(costGold = 30) {
    const currentP = this._player.value;
    if (currentP.gold < costGold) {
      return [false, `Madam Lysandra kaşlarını çattı: 'Sıcak su ve lavanta kokulu ipekler bedava değildir yabancı! (${costGold} Altın gerekli)'`];
    }

    const healAmount = kt.toInt(f32(currentP.totalStats.maxHealth * f32(0.35)));
    const newHp = Math.min(currentP.totalStats.maxHealth, currentP.currentHealth + healAmount);

    this._player.value = currentP.copy({
      gold: currentP.gold - costGold,
      currentHealth: newHp,
      activeMoraleBuff: 'Kadife Sığınak Dinçliği (+5 Hasar & +5 Zırh)',
    });

    return [
      true,
      `Sıcak köpüklü lavanta banyosu ve ipek masaj ruhunu tazeledi! Canın sarıldı (+${healAmount} HP) ve bir sonraki savaşa dek Moral Bonusu kazandın!`,
    ];
  }

  enterCompanionSalon(salonTier) {
    const currentP = this._player.value;
    const costGold = salonTier === 1 ? 2500 : 5000;
    const salonName = salonTier === 1 ? 'Kehribar & Baharat Meclisi' : 'Yeşim & İpek Mabedi';

    if (currentP.gold < costGold) {
      return [
        null,
        `Madam Lysandra ince kaşlarını çattı: '${salonName} kapılarını yalnızca kesesi dolu cüretkar savaşçılara açar! (${costGold} Altın gerekli, sende olan: ${currentP.gold} Altın)'`,
      ];
    }

    const availableCompanions = CompanionPavilionData.getAllCompanions().filter((it) => it.salonTier === salonTier);
    if (availableCompanions.length === 0) {
      return [null, 'Şu anda bu salonda müsait bir sima bulunmuyor.'];
    }

    const chosenCompanion = kt.random(availableCompanions);

    this._player.value = currentP.copy({
      gold: currentP.gold - costGold,
    });

    const bondLevel = currentP.companionBondLevels[chosenCompanion.id] ?? 0;
    const welcomeMsg =
      bondLevel >= 5
        ? `${salonName} perdeleri aralandı (-${costGold} Altın). ${chosenCompanion.name} seni derin bir aşk ve arzuyla karşıladı!`
        : bondLevel > 0
          ? `${salonName} perdeleri aralandı (-${costGold} Altın). ${chosenCompanion.name} seni tanıdı (Mevcut Bağ: Kademe ${bondLevel}/5)!`
          : `${salonName} perdeleri aralandı (-${costGold} Altın). İçeride seni ilk kez karşılayan ${chosenCompanion.name} bekliyor (Kademe 1/5)!`;

    return [chosenCompanion, welcomeMsg];
  }

  advanceCompanionStage(companionId, newBondLevel, buffTitle, buffDescription, healPercent = 0.5) {
    const currentP = this._player.value;
    const newLevels = { ...currentP.companionBondLevels };
    newLevels[companionId] = Math.max(newLevels[companionId] ?? 0, newBondLevel);

    const maxHp = currentP.totalStats.maxHealth;
    const healedHp = Math.min(maxHp, currentP.currentHealth + kt.toInt(f32(maxHp * f32(healPercent))));

    this._player.value = currentP.copy({
      currentHealth: healedHp,
      activeMoraleBuff: `${buffTitle}: ${buffDescription}`,
      companionBondLevels: newLevels,
    });
  }

  completeCompanionEncounter(companionId, newBondLevel, buffTitle, buffDescription) {
    const currentP = this._player.value;
    const newLevels = { ...currentP.companionBondLevels };
    newLevels[companionId] = Math.max(newLevels[companionId] ?? 0, newBondLevel);

    const fullHp = currentP.totalStats.maxHealth;
    this._player.value = currentP.copy({
      currentHealth: fullHp,
      activeMoraleBuff: `${buffTitle}: ${buffDescription}`,
      companionBondLevels: newLevels,
    });
  }

  listenRandomTavernTale(category = null, fixedTale = null) {
    if (!this._dayState.value.canEavesdropToday) {
      return [
        null,
        "Masadakiler şüphelenip fısıldaşmayı kesti! Hancı sana doğru sertçe bakıyor: 'Kuru kuruya masalara kulak kabartmayı bırak evlat!' (Bugünkü dinleme hakkın doldu, yarın tekrar gel).",
      ];
    }

    this._dayState.value = this._dayState.value.copy({ dailyEavesdropsDone: this._dayState.value.dailyEavesdropsDone + 1 });

    let tale;
    if (fixedTale != null) {
      tale = fixedTale;
    } else {
      const pool = category != null ? this._tavernTales.value.filter((it) => it.category === category) : this._tavernTales.value;
      const currentId = this._currentTale.value?.id ?? null;
      const candidates = pool.filter((it) => it.id !== currentId);
      tale = candidates.length > 0 ? kt.random(candidates) : kt.random(pool);
    }
    this._currentTale.value = tale;

    let clueNote = null;

    // 1. Han söylentisinde görev ipucu var mı kontrol et
    if (tale.questClueId != null && !this._player.value.unlockedRumorQuestIds.includes(tale.questClueId)) {
      this._player.value = this._player.value.copy({
        unlockedRumorQuestIds: kt.setPlus(this._player.value.unlockedRumorQuestIds, tale.questClueId),
      });
      clueNote =
        tale.clueDiscoveryText ?? '[YENİ SÖZLEŞME İPUCU]\nMasadaki fısıltıdan önemli bir ipucu yakaladın! Kasaba görev panosuna yeni bir sözleşme işlendi.';
    }

    // 2. Arena fısıltısı dinlendiğinde, hikayede adı geçen dövüşçünün açığını bedava öğrenme şansı (%50)
    if (tale.category === RumorCategory.ARENA_GOSSIP) {
      const allWeaknesses = StarterContent.getAllEnemyWeaknesses();
      const matchingWeakness = kt.firstOrNull(allWeaknesses, (w) => containsIgnoreCase(tale.narrative, w.enemyName) || containsIgnoreCase(tale.title, w.enemyName));
      if (matchingWeakness != null) {
        this._player.value = this._player.value.copy({
          encounteredEnemyIds: kt.setPlus(this._player.value.encounteredEnemyIds, matchingWeakness.enemyId),
        });
        if (!this._player.value.knownWeaknessIds.includes(matchingWeakness.enemyId)) {
          if (kt.Random.nextInt(100) < 50) {
            this._player.value = this._player.value.copy({
              knownWeaknessIds: kt.setPlus(this._player.value.knownWeaknessIds, matchingWeakness.enemyId),
            });
            if (clueNote == null) {
              clueNote = `${matchingWeakness.enemyName}'in açığı hakkında bedava bir ipucu yakaladın! Bilgiler evindeki kütüphaneye eklendi.`;
            }
          }
        }
      }
    }

    return [tale, clueNote];
  }

  orderTavernMeal(costGold, healHp, mealName) {
    if (!this._dayState.value.canEatMealToday) return false;
    const current = this._player.value;
    if (current.gold < costGold) return false;

    const newHealth = Math.min(current.totalStats.maxHealth, current.currentHealth + healHp);
    this._player.value = current.copy({
      gold: current.gold - costGold,
      currentHealth: newHealth,
    });
    this._dayState.value = this._dayState.value.copy({ dailyMealsEaten: this._dayState.value.dailyMealsEaten + 1 });
    return true;
  }

  playDiceGame(betGold) {
    if (!this._dayState.value.canPlayDiceToday) return null;
    const current = this._player.value;
    if (current.gold < betGold) return null;

    const p1 = kt.Random.nextInt(1, 7);
    const p2 = kt.Random.nextInt(1, 7);
    const o1 = kt.Random.nextInt(1, 7);
    const o2 = kt.Random.nextInt(1, 7);

    const playerSum = p1 + p2;
    const opponentSum = o1 + o2;

    const playerWon = playerSum > opponentSum;
    const isTie = playerSum === opponentSum;

    const netEarnings = playerWon ? betGold : isTie ? 0 : -betGold;

    const outcomeNarrative = playerWon
      ? `Zarlar tahta kasede şakırdadı: Sen (${p1}, ${p2} -> ${playerSum}), Rakip (${o1}, ${o2} -> ${opponentSum}) attı! Zarları kucaklayıp masadaki +${betGold} Altını topladın!`
      : isTie
        ? `İki taraf da toplam ${playerSum} attı! Zarlar eşit geldi; altınlar masada kaldı.`
        : `Rakip zarını gülerek açtı: Sen (${playerSum}), Rakip (${opponentSum}) attı! -${betGold} Altın kaybettin.`;

    const result = new DiceGameResult({
      playerRoll1: p1,
      playerRoll2: p2,
      opponentRoll1: o1,
      opponentRoll2: o2,
      playerWon: playerWon,
      isTie: isTie,
      betAmount: betGold,
      netEarnings: netEarnings,
      narrativeOutcome: outcomeNarrative,
    });

    this._player.value = current.copy({
      gold: Math.max(0, current.gold + netEarnings),
    });
    this._lastDiceResult.value = result;
    this._dayState.value = this._dayState.value.copy({ dailyDiceGamesPlayed: this._dayState.value.dailyDiceGamesPlayed + 1 });
    return result;
  }

  listenBardSong(isEpic = false) {
    let song;
    if (isEpic) {
      const songs = StarterContent.createEpicBardSongs();
      const picked = kt.random(songs);
      const current = this._player.value;
      if (current.gold >= 5) {
        const regionId = current.currentRegionId;
        const fameMap = { ...current.regionFame };
        const curFame = fameMap[regionId] ?? (regionId === 'tashisar' && current.hasGarrisonPass ? 10 : 0);
        const updatedFame = kt.coerceAtMost(curFame + 1, 100);
        fameMap[regionId] = updatedFame;
        if ((current.hasGarrisonPass || (fameMap['kirlangic'] ?? 0) >= 100) && (fameMap['tashisar'] ?? 0) < 10) {
          fameMap['tashisar'] = 10;
        }
        const newTitle = calculatePlayerTitleForRegion(regionId, updatedFame, current.hasGarrisonPass);
        this._player.value = current.copy({
          gold: current.gold - 5,
          regionFame: fameMap,
          globalFame: updatedFame,
          title: newTitle,
        });
        this._region.value = this._region.value.copy({ localFame: updatedFame });
      }
      song = picked;
    } else {
      const songs = StarterContent.createBardSongs();
      const picked = kt.random(songs);
      const current = this._player.value;
      if (current.gold >= 1) {
        this._player.value = current.copy({ gold: current.gold - 1 });
      }
      song = picked;
    }
    this._currentBardSong.value = song;
    return song;
  }

  // KAYIT & YÜKLEME (SAVE & LOAD)
  hasSaveFile() {
    return SaveManager.hasSaveFile();
  }

  autoSave() {
    this._kayitEtkin = true;
    const data = new SaveGameData({
      player: this._player.value,
      dayState: this._dayState.value,
      leagueState: this._leagueState.value,
      quests: this._quests.value,
      adventures: this._adventures.value,
      rooms: this._rooms.value,
      enemies: this._enemies.value,
    });
    return SaveManager.saveGame(data);
  }

  loadGame() {
    const data = SaveManager.loadGame();
    if (data == null) return false;
    this._player.value = data.player;
    this._dayState.value = data.dayState;
    this._leagueState.value = data.leagueState;
    this._quests.value = data.quests;
    this._adventures.value = data.adventures;
    this._rooms.value = data.rooms;
    this._enemies.value = data.enemies;
    this._kayitEtkin = true;
    return true;
  }

  startNewGame(deleteOldSave = false) {
    if (deleteOldSave) {
      SaveManager.deleteSave();
    }
    const initialPlayer = this.createInitialPlayer();
    this._player.value = initialPlayer;
    this._rooms.value = StarterContent.createInitialRooms();
    this._enemies.value = StarterContent.createInitialEnemies();
    this._quests.value = StarterContent.createInitialQuests();
    this._adventures.value = StarterContent.createInitialAdventures();
    this._craftingRecipes.value = StarterContent.createCraftingRecipes();
    this._leagueState.value = this.createInitialLeague();
    this._dayState.value = new DayState({ currentDay: 1 });
    this._levelUpEvent.value = null;
    this._invitationLetterEvent.value = false;
    this._kayitEtkin = true;
    this.autoSave();
  }

  setPlayerForTesting(player) {
    this._player.value = player;
  }
}

/** İç içe data class'lar: Kotlin'deki GameRepository.HouseRequirementStatus / HouseTransformationStatus */
GameRepository.HouseRequirementStatus = HouseRequirementStatus;
GameRepository.HouseTransformationStatus = HouseTransformationStatus;
