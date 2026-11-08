// GameViewModel.js — KT/ui/viewmodel/GameViewModel.kt taşıması.
// Android ViewModel yerine düz sınıf. Bütün akış (StateFlow), özellik ve işlev adları Kotlin'dekiyle aynı.
import * as kt from '../../kt.js';
import { Data } from '../../kt.js';
import { R } from '../../R.js';
import { SoundManager } from '../../audio/SoundManager.js';
import { GameRepository } from '../../data/GameRepository.js';
import { StarterContent } from '../../data/StarterContent.js';
import { ActiveCompanionSession, CombatEvent, CombatLog, DuoFighterLiveHp, StarterSkills } from '../../domain/model.js';

export class DecipherModalData extends Data {
  static T = 'GameViewModel.DecipherModalData';
  static defaults() {
    return { skill: undefined, lore: undefined, autoEquippedSlot: undefined };
  }
}
Data.register(DecipherModalData);

// Silahsız gösteride kritik () sayılan atış anlatımlarının ayırt edici parçaları (WrestlingCombatNarratives)
const KRITIK_ATIS_IPUCLARI = ['tek hamlede omuzlayarak havaya dikti', 'yay gibi geriye büküldü'];

export class GameViewModel {
  constructor(repository = new GameRepository()) {
    this.repository = repository;
    /** viewModelScope karşılığı: onCleared'da iptal edilecek abonelikler ve zamanlayıcılar */
    this._iptaller = [];
    this._temizlendi = false;

    this.player = repository.player;
    this.rooms = repository.rooms;
    this.region = repository.region;
    this.enemies = repository.enemies;
    this.tashisarEnemies = repository.tashisarEnemies;
    this.quests = repository.quests;
    this.adventures = repository.adventures;
    this.craftingRecipes = repository.craftingRecipes;
    this.leagueState = repository.leagueState;

    // Arena sub-tab (0: 1v1, 1: 2v2, 2: Silahsız, 3: Labirent, 4: Bahis, 5: Lig, 6: Günlük)
    this._arenaSubTab = new kt.MutableStateFlow(0);
    this.arenaSubTab = this._arenaSubTab.asStateFlow();

    // Yeni Arena Disiplinleri State'leri
    this.duoMatchState = repository.duoMatchState;
    this.unarmedMatchState = repository.unarmedMatchState;
    this.labyrinthMatchState = repository.labyrinthMatchState;
    this.activeLabyrinthRun = repository.activeLabyrinthRun;
    this.labyrinthMessage = repository.labyrinthMessage;

    // Combat state
    this._selectedEnemy = new kt.MutableStateFlow(null);
    this.selectedEnemy = this._selectedEnemy.asStateFlow();

    this._selectedBet = new kt.MutableStateFlow(null);
    this.selectedBet = this._selectedBet.asStateFlow();

    this._combatResult = new kt.MutableStateFlow(null);
    this.combatResult = this._combatResult.asStateFlow();

    this._isFighting = new kt.MutableStateFlow(false);
    this.isFighting = this._isFighting.asStateFlow();

    this._liveCombatLogs = new kt.MutableStateFlow([]);
    this.liveCombatLogs = this._liveCombatLogs.asStateFlow();

    this._liveEnemyHp = new kt.MutableStateFlow(0);
    this.liveEnemyHp = this._liveEnemyHp.asStateFlow();

    this._livePlayerHp = new kt.MutableStateFlow(0);
    this.livePlayerHp = this._livePlayerHp.asStateFlow();

    // Spectator Combat state
    this._isSpectating = new kt.MutableStateFlow(false);
    this.isSpectating = this._isSpectating.asStateFlow();

    this._spectatorFighter1 = new kt.MutableStateFlow(null);
    this.spectatorFighter1 = this._spectatorFighter1.asStateFlow();

    this._spectatorFighter2 = new kt.MutableStateFlow(null);
    this.spectatorFighter2 = this._spectatorFighter2.asStateFlow();

    this._liveFighter1Hp = new kt.MutableStateFlow(0);
    this.liveFighter1Hp = this._liveFighter1Hp.asStateFlow();

    this._liveFighter2Hp = new kt.MutableStateFlow(0);
    this.liveFighter2Hp = this._liveFighter2Hp.asStateFlow();

    this._liveSpectatorLogs = new kt.MutableStateFlow([]);
    this.liveSpectatorLogs = this._liveSpectatorLogs.asStateFlow();

    this._spectatorResult = new kt.MutableStateFlow(null);
    this.spectatorResult = this._spectatorResult.asStateFlow();

    // 2v2 İttifak Maçı Durumları
    this._isDuoFighting = new kt.MutableStateFlow(false);
    this.isDuoFighting = this._isDuoFighting.asStateFlow();

    this._duoCombatResult = new kt.MutableStateFlow(null);
    this.duoCombatResult = this._duoCombatResult.asStateFlow();

    this._liveDuoHp = new kt.MutableStateFlow(null);
    this.liveDuoHp = this._liveDuoHp.asStateFlow();

    // Silahsız & Estetik Düello Durumları
    this._isUnarmedFighting = new kt.MutableStateFlow(false);
    this.isUnarmedFighting = this._isUnarmedFighting.asStateFlow();
    this.unarmedCombatResult = repository.unarmedCombatResult;
    /** Pair<Int, Int>? → [oyuncuCan, rakipCan] ya da null */
    this._liveUnarmedHp = new kt.MutableStateFlow(null);
    this.liveUnarmedHp = this._liveUnarmedHp.asStateFlow();

    // Labirent Otomatik Canlı Savaş Durumları
    this._isLabyrinthFighting = new kt.MutableStateFlow(false);
    this.isLabyrinthFighting = this._isLabyrinthFighting.asStateFlow();

    this._labyrinthCombatResult = new kt.MutableStateFlow(null);
    this.labyrinthCombatResult = this._labyrinthCombatResult.asStateFlow();

    this._labyrinthLiveEnemy = new kt.MutableStateFlow(null);
    this.labyrinthLiveEnemy = this._labyrinthLiveEnemy.asStateFlow();

    this._labyrinthLiveEnemyHp = new kt.MutableStateFlow(0);
    this.labyrinthLiveEnemyHp = this._labyrinthLiveEnemyHp.asStateFlow();

    this._labyrinthLivePlayerHp = new kt.MutableStateFlow(0);
    this.labyrinthLivePlayerHp = this._labyrinthLivePlayerHp.asStateFlow();

    this._labyrinthCombatLogs = new kt.MutableStateFlow([]);
    this.labyrinthCombatLogs = this._labyrinthCombatLogs.asStateFlow();

    // Notification toast / message
    this._uiMessage = new kt.MutableStateFlow(null);
    this.uiMessage = this._uiMessage.asStateFlow();

    // Tavern State
    this.currentTale = repository.currentTale;
    this.lastDiceResult = repository.lastDiceResult;
    this.currentBardSong = repository.currentBardSong;
    this._lastInformantWhisper = new kt.MutableStateFlow(null);
    this.lastInformantWhisper = this._lastInformantWhisper.asStateFlow();

    // Day Cycle State
    this.dayState = repository.dayState;

    // Level Up & Transition State
    this.levelUpEvent = repository.levelUpEvent;

    this.invitationLetterEvent = repository.invitationLetterEvent;

    this.lastQuestClaimResult = repository.lastQuestClaimResult;

    this._decipherModalData = new kt.MutableStateFlow(null);
    this.decipherModalData = this._decipherModalData.asStateFlow();

    this._isDayTransitioning = new kt.MutableStateFlow(false);
    this.isDayTransitioning = this._isDayTransitioning.asStateFlow();

    this.isAnyTaskRunning = kt.combineFlows(
      [this.quests, this.adventures],
      (qList, aList) => qList.some((it) => it.isRunning && !it.isFinished) || aList.some((it) => it.isRunning && !it.isFinished),
    );

    // --- KIZIL KADİFE KÖŞKÜ (COMPANION PAVILION) ---
    this._activeCompanionSession = new kt.MutableStateFlow(null);
    this.activeCompanionSession = this._activeCompanionSession.asStateFlow();

    this.questTimerJob = null;

    // init
    this.startQuestTicker();
    this._selectedEnemy.value = repository.getCurrentDrawnOpponent() ?? kt.firstOrNull(repository.enemies.value);
    // repository.leagueState.collect { ... } — StateFlow toplayıcısı mevcut değerle hemen başlar
    const ligDegisti = () => {
      const drawn = repository.getCurrentDrawnOpponent();
      if (drawn != null) {
        this._selectedEnemy.value = drawn;
      }
    };
    ligDegisti();
    this._iptaller.push(repository.leagueState.subscribe(ligDegisti));
    // repository.invitationLetterEvent.collect { triggered -> ... }
    const davetiye = (triggered) => {
      if (triggered) {
        SoundManager.playLetterSound();
      }
    };
    davetiye(repository.invitationLetterEvent.value);
    this._iptaller.push(repository.invitationLetterEvent.subscribe(davetiye));
  }

  /** viewModelScope.launch karşılığı: ViewModel temizlendikten sonra başlamaz. */
  _launch(fn) {
    if (this._temizlendi) return Promise.resolve();
    return kt.launch(fn);
  }

  dismissInformantWhisper() {
    this._lastInformantWhisper.value = null;
  }
  getEncounteredEnemyDossiers() {
    return this.repository.getEncounteredEnemyDossiers();
  }
  getAllCharacterProfilesWithLiveState() {
    return this.repository.getAllCharacterProfilesWithLiveState();
  }
  markCharacterEncountered(id) {
    return this.repository.markCharacterEncountered(id);
  }

  dismissLevelUpDialog() {
    return this.repository.dismissLevelUpDialog();
  }

  dismissInvitationLetter() {
    return this.repository.dismissInvitationLetter();
  }

  clearQuestClaimResult() {
    return this.repository.clearQuestClaimResult();
  }

  clearDecipherModal() {
    this._decipherModalData.value = null;
  }

  get canTravelToRegion2() {
    return this.repository.canTravelToRegion2;
  }

  get isBettingOpen() {
    return this.player.value.globalFame >= 10;
  }

  startQuestTicker() {
    // while (true) { delay(1000); repository.advanceQuestTime(1) } — iptal edilebilir 1 sn'lik zamanlayıcı
    let iptal = false;
    let zamanlayici = null;
    const tik = () => {
      if (iptal) return;
      this.repository.advanceQuestTime(1);
      zamanlayici = setTimeout(tik, 1000);
      if (zamanlayici && typeof zamanlayici.unref === 'function') zamanlayici.unref();
    };
    zamanlayici = setTimeout(tik, 1000);
    if (zamanlayici && typeof zamanlayici.unref === 'function') zamanlayici.unref();
    this.questTimerJob = {
      cancel: () => {
        iptal = true;
        if (zamanlayici) clearTimeout(zamanlayici);
      },
    };
  }

  setArenaSubTab(index) {
    if (index >= 1 && index <= 3 && !this.canTravelToRegion2) {
      this.showMessage('2v2 İttifakı, Silahsız Gösteri ve Labirent karşılaşmaları 2. Bölüm (Taş Hisar Garnizonu) fermanı açıldığında kullanılabilir!');
      return;
    }
    this._arenaSubTab.value = index;
  }

  spinDuoLottery() {
    this.repository.spinDuoLottery();
    this.showMessage("İttifak Kur'ası Çekildi! Yeni yoldaş ve rakipler belirlendi.");
  }

  selectUnarmedShowType(type) {
    this.repository.selectUnarmedShowType(type);
  }

  drawUnarmedOpponent() {
    this.repository.drawUnarmedOpponent();
    this.showMessage('Yeni Gösteri Karşılaşması Belirlendi!');
  }

  selectLabyrinthTactic(tactic) {
    this.repository.selectLabyrinthTactic(tactic);
    this.showMessage(`Labirent Taktiği Seçildi: ${tactic.title}`);
  }

  drawLabyrinthMatch() {
    this.repository.drawLabyrinthMatch();
    this.showMessage('Katakomp Dehlizi Yenilendi! Yeni tuzaklar ve 3v3 takımlar belirlendi.');
  }

  startLabyrinthRun(biome = null) {
    const success = this.repository.startLabyrinthRun(biome);
    if (!success) {
      const m = this.repository.labyrinthMessage.value;
      if (m != null) this.showMessage(m);
    }
  }

  resolveCurrentHazard(actionType) {
    const [, narrative] = this.repository.resolveCurrentHazard(actionType);
    this.showMessage(narrative);
  }

  solveCurrentPuzzle(choiceIndex) {
    const [, narrative] = this.repository.solveCurrentPuzzle(choiceIndex);
    this.showMessage(narrative);
  }

  interactChamberGladiator(action) {
    const [, narrative] = this.repository.interactChamberGladiator(action);
    this.showMessage(narrative);
  }

  openChamberChest() {
    const [, narrative] = this.repository.openChamberChest();
    this.showMessage(narrative);
  }

  advanceLabyrinthChamber() {
    this.repository.advanceLabyrinthChamber();
  }

  abandonLabyrinthRun() {
    this.repository.abandonLabyrinthRun();
    this.showMessage('Labirentten geri çekildin.');
  }

  startLabyrinthCombat(enemy) {
    if (this.player.value.currentHealth <= 5) {
      this.showMessage('Canın tükendi! Labirentte dövüşe girmeden önce dinlenmeli veya iksir içmelisin.');
      return;
    }

    if (this._isLabyrinthFighting.value) return;

    this._launch(async () => {
      this._isLabyrinthFighting.value = true;
      this._labyrinthCombatLogs.value = [];
      this._labyrinthCombatResult.value = null;
      this._labyrinthLiveEnemy.value = enemy;
      this._labyrinthLivePlayerHp.value = this.player.value.currentHealth;
      this._labyrinthLiveEnemyHp.value = enemy.stats.maxHealth;

      // Dövüş başlangıç sesleri ve atmosfer
      SoundManager.playSfx(R.raw.dovusbasla, 3500);
      await kt.delay(800);
      SoundManager.playRandomBattleMusic();

      const fullResult = this.repository.executeLabyrinthCombat(enemy);

      // Otomatik Savaş İlerlemesi: Tur tur hamleler akar ve can barları canlı güncellenir
      const accumulatedLogs = [];
      for (const log of fullResult.logs) {
        accumulatedLogs.push(log);
        this._labyrinthCombatLogs.value = accumulatedLogs.slice();
        if (log.isPlayerAttacker) {
          this._labyrinthLiveEnemyHp.value = log.defenderHpLeft;
        } else {
          this._labyrinthLivePlayerHp.value = log.defenderHpLeft;
        }
        await kt.delay(2200);
      }

      await kt.delay(400);
      this._labyrinthCombatResult.value = fullResult;
      this._isLabyrinthFighting.value = false;
      if (fullResult.isPlayerWinner) {
        SoundManager.playSfx(R.raw.gorevodul, 3000);
      }
    });
  }

  dismissLabyrinthCombatModal() {
    this._labyrinthCombatResult.value = null;
    this._labyrinthCombatLogs.value = [];
    this._isLabyrinthFighting.value = false;
    this._labyrinthLiveEnemy.value = null;
    SoundManager.playBgm(R.raw.arena, true);
  }

  getFullGladiatorPool() {
    return this.repository.getFullGladiatorPool();
  }

  clearLabyrinthMessage() {
    this.repository.clearLabyrinthMessage();
  }

  showMessage(msg) {
    this._uiMessage.value = msg;
    this._launch(async () => {
      await kt.delay(2500);
      if (this._uiMessage.value === msg) {
        this._uiMessage.value = null;
      }
    });
  }

  equip(item) {
    if (this.player.value.level < item.requiredLevel) {
      this.showMessage(`Bu eşyayı kuşanmak için Seviye ${item.requiredLevel} olmalısın!`);
      return;
    }
    this.repository.equipItem(item);
    this.showMessage(`${item.name} kuşanıldı.`);
  }

  unequip(slot) {
    this.repository.unequipItem(slot);
    this.showMessage(`${slot.displayName} yuvasındaki eşya çıkarıldı.`);
  }

  setPlayerName(newName) {
    this.repository.setPlayerName(newName);
  }

  useConsumable(item) {
    const success = this.repository.useConsumable(item);
    if (success) {
      this.showMessage(`${item.name} kullanıldı. Yaraların sağaltıldı.`);
    } else {
      this.showMessage('Zaten sağlığın dolu!');
    }
  }

  advanceDay(costGold = 0) {
    if (this._isDayTransitioning.value) return;
    const currentDayState = this.repository.dayState.value;
    if (!currentDayState.isDailyArenaObligationMet) {
      this.showMessage('Arenaya uğramadan günü geçiremezsin! Ya kuradaki kendi maçına çıkmalı ya da bir dövüşçüye seyirci bahsi yatırmalısın!');
      return;
    }
    this._launch(async () => {
      this._isDayTransitioning.value = true;
      // Gün geçiş efekti sesi çalınır
      SoundManager.playSfx(R.raw.gungecir, 5000);
      // Ses bitene kadar gün geçişi geciktirilir (~4600 ms)
      await kt.delay(4600);
      const narrative = this.repository.advanceDay(costGold);
      this._isDayTransitioning.value = false;
      this.showMessage(narrative);
    });
  }

  dailyTraining() {
    const [, msg] = this.repository.dailyTraining();
    this.showMessage(msg);
  }

  rest() {
    this.advanceDay(0);
  }

  upgradeRoom(roomId) {
    const [success, msg] = this.repository.upgradeRoom(roomId);
    if (success) {
      SoundManager.playSfx(R.raw.gelistir);
    }
    this.showMessage(msg);
  }

  checkRoomUpgradeRequirements(room) {
    return this.repository.checkRoomUpgradeRequirements(room);
  }

  getHouseTransformationStatus() {
    return this.repository.getHouseTransformationStatus();
  }

  transformToHouse() {
    const [success, msg] = this.repository.transformToHouse();
    if (success) {
      SoundManager.playSfx(R.raw.gorevodul);
    }
    this.showMessage(msg);
  }

  selectEnemy(enemy) {
    this._selectedEnemy.value = enemy;
  }

  selectBet(bet) {
    this._selectedBet.value = bet;
  }

  dismissDawnNarrative() {
    this.repository.dismissDawnNarrative();
  }

  placeSpectatorBet(match, selectedFighterName, amount) {
    const [error, fullResult] = this.repository.startSpectatorBattle(match, selectedFighterName, amount);
    if (error != null) {
      this.showMessage(error);
      return;
    }
    if (fullResult == null) {
      this.showMessage('Müsabaka başlatılamadı!');
      return;
    }

    this._launch(async () => {
      this._isSpectating.value = true;
      this._spectatorFighter1.value = fullResult.fighter1;
      this._spectatorFighter2.value = fullResult.fighter2;
      this._liveFighter1Hp.value = fullResult.fighter1.stats.maxHealth;
      this._liveFighter2Hp.value = fullResult.fighter2.stats.maxHealth;
      this._liveSpectatorLogs.value = [];
      this._spectatorResult.value = null;

      // 1. Tuşa basıldığında dövüş başlangıç sesi
      SoundManager.playSfx(R.raw.dovusbasla, 6500);
      await kt.delay(800);

      // 2. Ardından arenabasla borazan sesi
      SoundManager.playSfx(R.raw.arenabasla, 5500);
      await kt.delay(5200);

      // 3. Savaş müziği başlar
      SoundManager.playRandomBattleMusic();

      // 4. Hamleleri 3 saniye aralıklarla canlı akıt
      const accumulatedLogs = [];
      for (const log of fullResult.logs) {
        accumulatedLogs.push(log);
        this._liveSpectatorLogs.value = accumulatedLogs.slice();
        if (log.isPlayerAttacker) {
          this._liveFighter2Hp.value = log.defenderHpLeft;
        } else {
          this._liveFighter1Hp.value = log.defenderHpLeft;
        }
        await kt.delay(3000);
      }

      await kt.delay(500);
      // Lig durumunu güncelle ve bahsi sonlandır
      this.repository.recordSpectatorMatchResult(fullResult);
      if (fullResult.betWon) {
        SoundManager.playSfx(R.raw.digeraltin);
      }
      this._spectatorResult.value = fullResult;
      this._isSpectating.value = false;
    });
  }

  dismissSpectatorModal() {
    this._spectatorResult.value = null;
    this._liveSpectatorLogs.value = [];
    this._isSpectating.value = false;
    this._spectatorFighter1.value = null;
    this._spectatorFighter2.value = null;
    SoundManager.playBgm(R.raw.arena, true);
  }

  startCombat() {
    const enemy = this.repository.getCurrentDrawnOpponent() ?? this._selectedEnemy.value;
    if (enemy == null) return;
    if (!this.dayState.value.canFightArenaToday) {
      this.showMessage(
        'Bugünkü resmi arena müsabakanı zaten tamamladın! Tellalın yeni kurası için meskende (Ev) istirahat etmeli ve yeni günü başlatmalısın.',
      );
      return;
    }
    if (this.player.value.currentHealth <= 5) {
      this.showMessage('Canın tükendi! Arenaya çıkmadan önce dinlen veya iksir iç.');
      return;
    }

    const bet = this._selectedBet.value;
    if (bet != null && bet.betAmount > this.player.value.gold) {
      this.showMessage('Bahis için yeterli altının yok!');
      return;
    }

    this._launch(async () => {
      this._isFighting.value = true;
      this._liveCombatLogs.value = [];
      this._livePlayerHp.value = this.player.value.currentHealth;
      this._liveEnemyHp.value = enemy.stats.maxHealth;
      this._combatResult.value = null;

      // 1. Tuşa basıldığında dövüş başlangıç sesi
      SoundManager.playSfx(R.raw.dovusbasla, 6500);
      await kt.delay(800);

      // 2. Ardından arenabasla borazan ve arena kapı sesi devreye girer
      SoundManager.playSfx(R.raw.arenabasla, 5500);
      // 3. Arenabasla sesinin bitimi beklenir
      await kt.delay(5200);

      // 4. Sesin bitiminin ardından savaş müziği başlar ve çatışma hamleleri akar
      SoundManager.playRandomBattleMusic();

      const fullResult = this.repository.executeCombat(enemy, bet);

      // Stream logs tick-by-tick (hamle başına 3 saniye)
      const accumulatedLogs = [];
      for (const log of fullResult.logs) {
        accumulatedLogs.push(log);
        this._liveCombatLogs.value = accumulatedLogs.slice();
        if (log.isPlayerAttacker) {
          this._liveEnemyHp.value = log.defenderHpLeft;
        } else {
          this._livePlayerHp.value = log.defenderHpLeft;
        }
        await kt.delay(3000);
      }

      await kt.delay(500);
      this._combatResult.value = fullResult;
      this._isFighting.value = false;
    });
  }

  dismissCombatModal() {
    this._combatResult.value = null;
    this._liveCombatLogs.value = [];
    this._isFighting.value = false;
    SoundManager.playBgm(R.raw.arena, true);
  }

  startDuoCombat() {
    const duoState = this.duoMatchState.value;
    const ally = duoState.ally;
    const enemy1 = duoState.enemy1;
    const enemy2 = duoState.enemy2;

    if (ally == null || enemy1 == null || enemy2 == null) {
      this.showMessage('Önce kura çarkını çevirerek takımları belirlemelisin!');
      return;
    }

    if (this.player.value.gold < duoState.entryFee) {
      this.showMessage(`2v2 müsabakasına katılmak için en az ${duoState.entryFee} altın giriş ücreti gerekir!`);
      return;
    }

    if (this._isDuoFighting.value) return;

    this._launch(async () => {
      this._isDuoFighting.value = true;
      this._liveCombatLogs.value = [];
      this._duoCombatResult.value = null;

      this._liveDuoHp.value = new DuoFighterLiveHp({
        playerHp: this.player.value.currentHealth,
        playerMaxHp: this.player.value.totalStats.maxHealth,
        allyHp: ally.stats.maxHealth,
        allyMaxHp: ally.stats.maxHealth,
        enemy1Hp: enemy1.stats.maxHealth,
        enemy1MaxHp: enemy1.stats.maxHealth,
        enemy2Hp: enemy2.stats.maxHealth,
        enemy2MaxHp: enemy2.stats.maxHealth,
      });

      // Dövüş ses efektleri
      SoundManager.playSfx(R.raw.dovusbasla, 3500);
      await kt.delay(800);
      SoundManager.playRandomBattleMusic();

      const fullResult = this.repository.executeDuoCombat(ally, enemy1, enemy2, duoState.condition);

      // Stream logs tick-by-tick
      const accumulatedLogs = [];
      let currentLiveHp = this._liveDuoHp.value;

      for (const log of fullResult.logs) {
        accumulatedLogs.push(log);
        this._liveCombatLogs.value = accumulatedLogs.slice();

        // Update defender live hp
        if (log.defenderName === this.player.value.name) currentLiveHp = currentLiveHp.copy({ playerHp: log.defenderHpLeft });
        else if (log.defenderName === ally.name) currentLiveHp = currentLiveHp.copy({ allyHp: log.defenderHpLeft });
        else if (log.defenderName === enemy1.name) currentLiveHp = currentLiveHp.copy({ enemy1Hp: log.defenderHpLeft });
        else if (log.defenderName === enemy2.name) currentLiveHp = currentLiveHp.copy({ enemy2Hp: log.defenderHpLeft });
        this._liveDuoHp.value = currentLiveHp;

        await kt.delay(2200);
      }

      await kt.delay(400);
      this._duoCombatResult.value = fullResult;
      this._isDuoFighting.value = false;
    });
  }

  dismissDuoCombatModal() {
    this._duoCombatResult.value = null;
    this._liveCombatLogs.value = [];
    this._isDuoFighting.value = false;
    this._liveDuoHp.value = null;
    this.repository.spinDuoLottery();
    SoundManager.playBgm(R.raw.arena, true);
  }

  startUnarmedCombat() {
    const unarmedState = this.unarmedMatchState.value;
    const opp = unarmedState.currentOpponent;
    if (opp == null) {
      this.showMessage('Önce bir gösteri rakibi seçmelisin!');
      return;
    }

    if (this.player.value.gold < unarmedState.entryFee) {
      this.showMessage(`Gösteriye giriş için en az ${unarmedState.entryFee} altının olmalı!`);
      return;
    }

    if (this._isUnarmedFighting.value) return;

    this._launch(async () => {
      this._isUnarmedFighting.value = true;
      this._liveCombatLogs.value = [];
      this.repository.dismissUnarmedCombatModal();

      const fullResult = this.repository.simulateUnarmedMatch(opp);

      this._liveUnarmedHp.value = [fullResult.playerMaxHp, fullResult.opponentMaxHp];

      let currentPlayerHp = fullResult.playerMaxHp;
      let currentOpponentHp = fullResult.opponentMaxHp;
      const accumulatedLogs = [];
      let roundIdx = 1;

      for (const logStr of fullResult.combatLogs) {
        if (logStr.includes('Can') && logStr.includes(opp.name)) {
          currentOpponentHp = Math.max(0, currentOpponentHp - 25);
        } else if (logStr.includes('Can') && logStr.includes(this.player.value.name)) {
          currentPlayerHp = Math.max(0, currentPlayerHp - 25);
        }

        const cLog = new CombatLog({
          round: roundIdx++,
          narrativeText: logStr,
          attackerName: this.player.value.name,
          defenderName: opp.name,
          // Kotlin'de '' ile işaretli kritik atış anlatımları; emojiler kaldırıldığı için anlatımın kendisinden tanınır
          event: KRITIK_ATIS_IPUCLARI.some((ip) => logStr.includes(ip)) ? CombatEvent.CRITICAL : CombatEvent.HIT,
          damage: 0,
          defenderHpLeft: currentOpponentHp,
          defenderMaxHp: fullResult.opponentMaxHp,
          isPlayerAttacker: true,
        });
        accumulatedLogs.push(cLog);
        this._liveCombatLogs.value = accumulatedLogs.slice();
        this._liveUnarmedHp.value = [currentPlayerHp, currentOpponentHp];
        await kt.delay(1000);
      }

      await kt.delay(400);
      this._liveUnarmedHp.value = [fullResult.playerFinalHp, fullResult.opponentFinalHp];
      this._isUnarmedFighting.value = false;
    });
  }

  dismissUnarmedCombatModal() {
    this.repository.dismissUnarmedCombatModal();
    this._liveCombatLogs.value = [];
    this._isUnarmedFighting.value = false;
    this._liveUnarmedHp.value = null;
    SoundManager.playBgm(R.raw.arena, true);
  }

  buyEquipment(item) {
    if (this.repository.buyEquipment(item)) {
      SoundManager.playSfx(R.raw.satinal);
      this.showMessage(`${item.name} satın alındı!`);
    } else {
      this.showMessage('Yeterli altının yok!');
    }
  }

  sellEquipment(item) {
    const [success, msg] = this.repository.sellEquipment(item);
    if (success) {
      SoundManager.playSfx(R.raw.digeraltin);
    }
    this.showMessage(msg);
  }

  buyConsumable(item) {
    if (this.repository.buyConsumable(item)) {
      SoundManager.playSfx(R.raw.satinal);
      this.showMessage(`${item.name} satın alındı!`);
    } else {
      this.showMessage('Yeterli altının yok!');
    }
  }

  startQuest(questId) {
    const [success, msg] = this.repository.startQuest(questId);
    if (success) {
      SoundManager.playSfx(R.raw.gorevkabul);
    }
    this.showMessage(msg);
  }

  claimQuest(questId) {
    const [success, msg] = this.repository.claimQuestReward(questId);
    if (success) {
      SoundManager.playSfx(R.raw.gorevodul);
    }
    this.showMessage(msg);
  }

  equipSkillToSlot(skillId, slotIndex) {
    const [success, msg] = this.repository.equipSkillToSlot(skillId, slotIndex);
    if (success) {
      SoundManager.playSfx(R.raw.satinal);
    }
    this.showMessage(msg);
  }

  unequipSkillFromSlot(slotIndex) {
    const [, msg] = this.repository.unequipSkillFromSlot(slotIndex);
    this.showMessage(msg);
  }

  toggleEquipSkill(skillId) {
    const [success, msg] = this.repository.toggleEquipSkill(skillId);
    if (success) {
      SoundManager.playSfx(R.raw.satinal);
    }
    this.showMessage(msg);
  }

  decipherSealedScroll(scrollItemId) {
    const mappedSkillId = StarterContent.getScrollSkillMapping(scrollItemId);
    const skillBefore = mappedSkillId != null ? StarterSkills.getSkillById(mappedSkillId) : null;
    const equippedCountBefore = this.player.value.equippedSkillIds.length;

    const [success, msg] = this.repository.decipherSealedScroll(scrollItemId);
    if (success) {
      SoundManager.playSfx(R.raw.gorevodul);
      if (skillBefore != null) {
        const lore = StarterContent.getDecipherLore(skillBefore.id);
        const equippedNow = this.player.value.equippedSkillIds;
        const autoSlot =
          equippedCountBefore < 4 && !equippedNow.includes(skillBefore.id)
            ? equippedCountBefore + 1
            : equippedNow.includes(skillBefore.id)
              ? equippedNow.indexOf(skillBefore.id) + 1
              : null;

        this._decipherModalData.value = new DecipherModalData({
          skill: skillBefore,
          lore: lore,
          autoEquippedSlot: autoSlot,
        });
      }
    }
    this.showMessage(msg);
  }

  // ADVENTURES & CRAFTING
  startAdventure(adventureId) {
    const [success, msg] = this.repository.startAdventure(adventureId);
    if (success) {
      SoundManager.playSfx(R.raw.gorevkabul);
    }
    this.showMessage(msg);
  }

  claimAdventure(adventureId) {
    const [success, msg] = this.repository.claimAdventureReward(adventureId);
    if (success) {
      SoundManager.playSfx(R.raw.gorevodul);
    }
    this.showMessage(msg);
  }

  craftEquipment(recipeId) {
    const [success, msg] = this.repository.craftEquipment(recipeId);
    if (success) {
      SoundManager.playSfx(R.raw.satinal);
    }
    this.showMessage(msg);
  }

  // TAVERN / HAN
  getAllEnemyWeaknesses() {
    return this.repository.getAllEnemyWeaknesses();
  }

  buyEnemyIntel(enemyId) {
    const [success, msg] = this.repository.buyEnemyIntel(enemyId);
    if (success) {
      SoundManager.playSfx(R.raw.digeraltin);
    }
    this.showMessage(msg);
  }

  buyRandomEnemyIntel(bribeAmount = 30) {
    const [success, msg] = this.repository.buyRandomEnemyIntel(bribeAmount);
    if (success) {
      SoundManager.playSfx(R.raw.digeraltin);
      this._lastInformantWhisper.value = msg;
    }
    this.showMessage(msg);
  }

  listenTavernTale(category = null) {
    if (!this.dayState.value.canEavesdropToday) {
      this.showMessage(
        `Masadakiler şüphelenip fısıldaşmayı kesti! Bugünkü dinleme hakkın tükendi (${this.dayState.value.dailyEavesdropsDone}/${this.dayState.value.maxEavesdropsPerDay}).`,
      );
      return;
    }
    SoundManager.playSfx(R.raw.digeraltin);
    const [tale, clueNote] = this.repository.listenRandomTavernTale(category);
    if (tale != null) {
      const remaining = this.repository.dayState.value.remainingEavesdrops;
      const limitNote = remaining > 0 ? ` (Kalan Dinleme Hakkı: ${remaining})` : ' (Bugünkü son fısıltıydı, masalar sustu!)';
      if (clueNote != null) {
        this.showMessage(`${clueNote}${limitNote}`);
      } else {
        this.showMessage(`${tale.speakerName} masasında konuşulanları dinledin.${limitNote}`);
      }
    } else if (clueNote != null) {
      this.showMessage(clueNote);
    }
  }

  orderTavernMeal(costGold, healHp, mealName) {
    if (!this.dayState.value.canEatMealToday) {
      this.showMessage(`Karnın tıka basa dolu! Bugün daha fazla yiyemezsin (Günde ${this.dayState.value.maxMealsPerDay} öğün sınırı).`);
      return;
    }
    if (this.player.value.currentHealth >= this.player.value.totalStats.maxHealth) {
      this.showMessage('Sağlığın zaten dopdolu, paranı boşa harcama!');
      return;
    }
    if (this.player.value.gold < costGold) {
      this.showMessage(`Cebinde yeterli altın yok! (${costGold} Altın gerekli)`);
      return;
    }
    if (this.repository.orderTavernMeal(costGold, healHp, mealName)) {
      SoundManager.playSfx(R.raw.digeraltin);
      this.showMessage(`${mealName} afiyetle yenildi. +${healHp} Can yenilendi!`);
    }
  }

  playDice(betGold) {
    if (!this.dayState.value.canPlayDiceToday) {
      this.showMessage(
        `Kumarbazlar masayı topladı! Bugünlük zar limitine (${this.dayState.value.maxDiceGamesPerDay} El) ulaştın. Yarın yeni altınlarla beklerler.`,
      );
      return;
    }
    if (this.player.value.gold < betGold) {
      this.showMessage(`Zar oynamak için yeterli altının yok! (${betGold} Altın)`);
      return;
    }
    SoundManager.playSfx(R.raw.zarat);
    const result = this.repository.playDiceGame(betGold);
    if (result == null) {
      this.showMessage('Zar atılamadı.');
    } else if (result.playerWon) {
      this.showMessage(`Zar tuttu! +${result.betAmount} Altın kazandın!`);
    } else if (result.isTie) {
      this.showMessage('Zarlar eşit geldi; altınlar masada kaldı.');
    } else {
      this.showMessage(`Zar ters döndü! -${result.betAmount} Altın kaybettin.`);
    }
  }

  listenBardSong(isEpic = false) {
    const requiredGold = isEpic ? 5 : 1;
    if (this.player.value.gold < requiredGold) {
      const msg = isEpic ? 'Destansı bir sekizlik için en az 5 Altın bahşiş vermen gerek!' : 'Ozana atacak tek bir bakırın bile yok!';
      this.showMessage(msg);
      return;
    }
    this.repository.listenBardSong(isEpic);
    SoundManager.playSfx(R.raw.sarkialtin);
    if (isEpic) {
      this.showMessage('Ozana 5 Altın attın. Kör Ozan sazın tellerine sertçe vurup destana başladı (+1 Şöhret)!');
    } else {
      this.showMessage('Ozana 1 Altın bahşiş attın. Saz teline dokunuyor...');
    }
  }

  // KAYIT & YÜKLEME
  hasSaveFile() {
    return this.repository.hasSaveFile();
  }

  loadGame() {
    const success = this.repository.loadGame();
    if (success) {
      this._selectedEnemy.value = null;
      this._combatResult.value = null;
      this._isFighting.value = false;
      this._liveCombatLogs.value = [];
      this._isSpectating.value = false;
      this._spectatorResult.value = null;
      this._liveSpectatorLogs.value = [];
      this.showMessage(`${this.repository.dayState.value.currentDay}. Günlük kayıt başarıyla yüklendi.`);
    } else {
      this.showMessage('Kayıt dosyası yüklenemedi!');
    }
    return success;
  }

  startNewGame(deleteOldSave = false) {
    this.repository.startNewGame(deleteOldSave);
    this._selectedEnemy.value = null;
    this._combatResult.value = null;
    this._isFighting.value = false;
    this._liveCombatLogs.value = [];
    this._isSpectating.value = false;
    this._spectatorResult.value = null;
    this._liveSpectatorLogs.value = [];
    this.showMessage('Yeni serüven başladı!');
  }

  // --- 2. BÖLGE: SEYAHAT, TAŞLAR & TALİMHANE ---
  travelToRegion(regionId) {
    const [success, msg] = this.repository.travelToRegion(regionId);
    if (success) {
      SoundManager.playSfx(R.raw.gungecir);
    }
    this.showMessage(msg);
  }

  addSocketToEquipment(equipmentId) {
    const [success, msg] = this.repository.addSocketToEquipment(equipmentId);
    if (success) {
      SoundManager.playSfx(R.raw.satinal);
    }
    this.showMessage(msg);
  }

  insertGem(equipmentId, gemId) {
    const [success, msg] = this.repository.insertGemIntoEquipment(equipmentId, gemId);
    if (success) {
      SoundManager.playSfx(R.raw.satinal);
    }
    this.showMessage(msg);
  }

  removeGem(equipmentId, gemIndex) {
    const [success, msg] = this.repository.removeGemFromEquipment(equipmentId, gemIndex);
    if (success) {
      SoundManager.playSfx(R.raw.digeraltin);
    }
    this.showMessage(msg);
  }

  trainWithAlthea(type) {
    const [success, msg] = this.repository.trainWithAlthea(type);
    if (success) {
      SoundManager.playSfx(R.raw.arenabasla);
    }
    this.showMessage(msg);
  }

  visitCourtesan() {
    const [success, msg] = this.repository.visitCourtesanBath();
    if (success) {
      SoundManager.playSfx(R.raw.digeraltin);
    }
    this.showMessage(msg);
  }

  enterCompanionSalon(salonTier) {
    const [companion, msg] = this.repository.enterCompanionSalon(salonTier);
    if (companion != null) {
      SoundManager.playSfx(R.raw.digeraltin);
      const currentBond = this.player.value.companionBondLevels[companion.id] ?? 0;
      if (currentBond >= 5) {
        // Zirve bağ seviyesine ulaşılmış: Doğrudan Vuslat & Romantik birliktelik!
        this._activeCompanionSession.value = new ActiveCompanionSession({
          companion: companion,
          kademeLevel: 5,
          currentRoundIndex: 4,
          isCulminationReached: true,
          isRepeatCulmination: true,
        });
        this.repository.completeCompanionEncounter(companion.id, 5, companion.culmination.buffRewardTitle, companion.culmination.buffRewardDescription);
      } else {
        // Mevcut bağ seviyesine göre kademe belirlenir (0 -> Kademe 1, 1 -> Kademe 2...)
        const targetKademe = kt.coerceIn(currentBond + 1, 1, 5);
        this._activeCompanionSession.value = new ActiveCompanionSession({
          companion: companion,
          kademeLevel: targetKademe,
          currentRoundIndex: 0,
          selectedChoice: null,
          isShowingChoiceResponse: false,
          isKademeCompleted: false,
          isCulminationReached: false,
          isRepeatCulmination: false,
        });
      }
    }
    this.showMessage(msg);
  }

  selectCompanionChoice(choice) {
    const session = this._activeCompanionSession.value;
    if (session == null) return;
    SoundManager.playSfx(R.raw.sayfacevir);
    this._activeCompanionSession.value = session.copy({
      selectedChoice: choice,
      isShowingChoiceResponse: true,
    });
  }

  nextCompanionRound() {
    const session = this._activeCompanionSession.value;
    if (session == null) return;
    SoundManager.playSfx(R.raw.sayfacevir);
    if (session.currentRoundIndex < 4) {
      // Sonraki tura geç (1..4)
      this._activeCompanionSession.value = session.copy({
        currentRoundIndex: session.currentRoundIndex + 1,
        selectedChoice: null,
        isShowingChoiceResponse: false,
      });
    } else {
      // 5. Tur tamamlandı!
      if (session.kademeLevel < 5) {
        // Normal Kademe tamamlandı -> Veda ekranı göster ve bağ seviyesini artır
        this._activeCompanionSession.value = session.copy({
          isKademeCompleted: true,
        });
        this.repository.advanceCompanionStage(
          session.companion.id,
          session.kademeLevel,
          `${session.companion.name} ile Yakınlaşma (Kademe ${session.kademeLevel})`,
          '+%8 Hız, Moral ve %50 Can Yenileme',
          0.5,
        );
        this.showMessage(`${session.companion.name} ile 5 turluk bu gece tamamlandı! Aranızdaki bağ Kademe ${session.kademeLevel}/5 seviyesine ulaştı.`);
      } else {
        // 5. Kademe tamamlandı -> Zirve Vuslat sahnesi!
        this._activeCompanionSession.value = session.copy({
          isCulminationReached: true,
        });
        this.repository.completeCompanionEncounter(
          session.companion.id,
          5,
          session.companion.culmination.buffRewardTitle,
          session.companion.culmination.buffRewardDescription,
        );
      }
    }
  }

  closeCompanionSession() {
    this._activeCompanionSession.value = null;
  }

  combineGemShards(type) {
    const [success, msg] = this.repository.combineGemShards(type);
    if (success) {
      SoundManager.playSfx(R.raw.gelistir);
    }
    this.showMessage(msg);
  }

  combineAllGemShards() {
    const [success, msg] = this.repository.combineAllGemShards();
    if (success) {
      SoundManager.playSfx(R.raw.gelistir);
    }
    this.showMessage(msg);
  }

  upgradeGemLevel(type, currentLevel) {
    const [success, msg] = this.repository.upgradeGemLevel(type, currentLevel);
    if (success) {
      SoundManager.playSfx(R.raw.gelistir);
    }
    this.showMessage(msg);
  }

  upgradeAllEligibleGems() {
    const [success, msg] = this.repository.upgradeAllEligibleGems();
    if (success) {
      SoundManager.playSfx(R.raw.gelistir);
    }
    this.showMessage(msg);
  }

  unlockAllSocketsForEquipment(equipmentId) {
    const [success, msg] = this.repository.unlockAllSocketsForEquipment(equipmentId);
    if (success) {
      SoundManager.playSfx(R.raw.satinal);
    }
    this.showMessage(msg);
  }

  unlockChestSlot() {
    const [success, msg] = this.repository.unlockChestSlot();
    if (success) {
      SoundManager.playSfx(R.raw.gelistir);
    }
    this.showMessage(msg);
  }

  buildChest(slotIndex, chestType) {
    const [success, msg] = this.repository.buildChest(slotIndex, chestType);
    if (success) {
      SoundManager.playSfx(R.raw.gelistir);
    }
    this.showMessage(msg);
  }

  upgradeChest(slotIndex) {
    const [success, msg] = this.repository.upgradeChest(slotIndex);
    if (success) {
      SoundManager.playSfx(R.raw.gelistir);
    }
    this.showMessage(msg);
  }

  performHarvestTick(areaType) {
    const res = this.repository.performHarvestTick(areaType);
    if (res.success) {
      SoundManager.playSfx(R.raw.satinal);
    }
    return res;
  }

  trainAtTrainingGrounds(trainingType) {
    const [success, msg] = this.repository.trainAtTrainingGrounds(trainingType);
    if (success) {
      SoundManager.playSfx(R.raw.arenabasla);
    }
    this.showMessage(msg);
  }

  /** Kotlin onCleared(): zamanlayıcıyı ve abonelikleri durdurur. */
  onCleared() {
    this._temizlendi = true;
    this.questTimerJob?.cancel();
    for (const i of this._iptaller) i();
    this._iptaller = [];
  }
}

/** İç içe data class: Kotlin'deki GameViewModel.DecipherModalData */
GameViewModel.DecipherModalData = DecipherModalData;

let _tekViewModel = null;
/** Uygulama boyunca tek GameViewModel (Android'deki viewModel() karşılığı). İlk çağrıda oluşturulur. */
export function getGameViewModel() {
  if (_tekViewModel == null) _tekViewModel = new GameViewModel();
  return _tekViewModel;
}
