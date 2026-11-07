// AestheticCombatEngine.kt'den taşındı (birebir). Silahsız estetik düello, pehlivan güreşi ve canavar boğuşması.
import * as kt from '../../kt.js';
import { UnarmedShowType } from '../model.js';
import { AestheticCombatNarratives } from './AestheticCombatNarratives.js';
import { AestheticOutfitGenerator, AestheticStyle } from './AestheticOutfitGenerator.js';
import { ArenaTrapType, BeastCombatNarratives } from './BeastCombatNarratives.js';
import { WrestlingCombatNarratives } from './WrestlingCombatNarratives.js';

export const ClothingCondition = kt.defineEnum('ClothingCondition', {
    INTACT: { stage: 0, label: 'Kusursuz & Zarif', description: 'İpek kumaşlar lekesiz, tüm düğmeler ve dikişler yerli yerinde.' },
    SLIGHTLY_TORN: { stage: 1, label: 'Zorlanan Dikişler', description: 'Kopan düğmeler ve etek uçlarında sökülen kumaş şeritleri.' },
    TORN_EXPOSED: { stage: 2, label: 'Çözülen Kuşak & Açılan Göğüs', description: 'Kuşak çözülmüş, yelek parçalanarak terden parıldayan gövde açığa çıkmış.' },
    RUINED_AESTHETIC: { stage: 3, label: 'Parçalanmış Zarafet', description: 'Kıyafetler neredeyse tamamen parçalanmış, heykelsi kaslar ve ter damlaları kumların üstünde parıldıyor.' },
});

export class AestheticFighter extends kt.Data {
    static T = 'AestheticFighter';
    static defaults() {
        return {
            id: undefined,
            name: undefined,
            title: undefined,
            isPlayer: undefined,
            maxHp: undefined,
            currentHp: undefined,
            strength: undefined,
            speed: undefined,
            endurance: undefined,
            cunning: undefined,
            dodgeChance: undefined,
            critChance: undefined,
            outfit: undefined,
            clothingCondition: ClothingCondition.INTACT,
        };
    }
    get isAlive() {
        return this.currentHp > 0
    }
}

export class AestheticCombatResult extends kt.Data {
    static T = 'AestheticCombatResult';
    static defaults() {
        return {
            playerWon: undefined,
            winnerName: undefined,
            loserName: undefined,
            victoryReason: undefined,
            roundsPlayed: undefined,
            playerFinalHp: undefined,
            playerMaxHp: undefined,
            opponentFinalHp: undefined,
            opponentMaxHp: undefined,
            playerClothingCondition: undefined,
            opponentClothingCondition: undefined,
            combatLogs: undefined,
            goldEarned: undefined,
            expEarned: undefined,
            fameEarned: undefined,
        };
    }
}
kt.Data.register(AestheticFighter, AestheticCombatResult);

/** Kotlin data class / List / Map toString() karşılığı ("$fighter" gibi nesne yerleştirmeleri için) */
function kotlinToString(x) {
    if (x === null || x === undefined) return 'null'
    if (Array.isArray(x)) return '[' + x.map(kotlinToString).join(', ') + ']'
    if (kt.isEnumValue(x)) return x.name
    if (x instanceof kt.Data) {
        return (x.constructor.T || 'Data') + '(' + Object.keys(x).map((k) => k + '=' + kotlinToString(x[k])).join(', ') + ')'
    }
    if (typeof x === 'object') return '{' + Object.keys(x).map((k) => k + '=' + kotlinToString(x[k])).join(', ') + '}'
    return String(x)
}

    function simulateDuel(player, opponent, playerOutfitOverride = null, opponentOutfitOverride = null) {
        const playerOutfit = playerOutfitOverride ?? AestheticOutfitGenerator.generateOutfit(AestheticStyle.SOUTHERN_OASIS)
        const opponentOutfit = opponentOutfitOverride ?? AestheticOutfitGenerator.generateOutfit(AestheticStyle.ROYAL)

        const playerOutfitStats = playerOutfit.calculateSanitizedStats()
        const opponentOutfitStats = opponentOutfit.calculateSanitizedStats()

        // Oyuncu parametreleri (Silah ve kalkan hasarı eklenmez, saf karakter seviyesi ve estetik kıyafet)
        const playerStrength = (player.level * 3) + playerOutfitStats.damage + 12
        const playerSpeed = (player.level * 2) + playerOutfitStats.speed + 14
        const playerEndurance = (player.level * 2) + playerOutfitStats.armor + 15
        const playerCunning = (player.level * 2) + playerOutfitStats.critChancePercent + 10
        const playerMaxHp = 180 + (playerEndurance * 4) + (player.level * 15)

        // Rakip parametreleri
        const oppStrength = opponent.rawStrength + opponentOutfitStats.damage
        const oppSpeed = opponent.agility + opponentOutfitStats.speed
        const oppEndurance = opponent.endurance + opponentOutfitStats.armor
        const oppCunning = 12 + opponentOutfitStats.critChancePercent
        const oppMaxHp = opponent.health + (oppEndurance * 3)

        const fighterPlayer = new AestheticFighter({
            id: 'player',
            name: player.name,
            title: player.title,
            isPlayer: true,
            maxHp: playerMaxHp,
            currentHp: playerMaxHp,
            strength: playerStrength,
            speed: playerSpeed,
            endurance: playerEndurance,
            cunning: playerCunning,
            dodgeChance: kt.coerceIn(Math.round((playerSpeed * 0.7)), 5, 35),
            critChance: kt.coerceIn(Math.round((playerCunning * 0.8)), 5, 40),
            outfit: playerOutfit
        })

        const fighterOpponent = new AestheticFighter({
            id: opponent.id,
            name: opponent.name,
            title: opponent.title,
            isPlayer: false,
            maxHp: oppMaxHp,
            currentHp: oppMaxHp,
            strength: oppStrength,
            speed: oppSpeed,
            endurance: oppEndurance,
            cunning: oppCunning,
            dodgeChance: kt.coerceIn(Math.round((oppSpeed * 0.65)), 5, 30),
            critChance: kt.coerceIn(Math.round((oppCunning * 0.7)), 5, 35),
            outfit: opponentOutfit
        })

        const isWrestling = opponent.showType === UnarmedShowType.GLADIATOR_BRAWL
        const isSingleBeast = opponent.showType === UnarmedShowType.SINGLE_BEAST
        const isBeastPack = opponent.showType === UnarmedShowType.BEAST_PACK
        const isBeastFight = isSingleBeast || isBeastPack
        const logs = []

        // Giriş Anlatımı
        if (isWrestling) {
            logs.push(WrestlingCombatNarratives.generateIntro(fighterPlayer.name, fighterOpponent.name))
        } else if (isSingleBeast) {
            logs.push(BeastCombatNarratives.generateSingleBeastIntro(fighterPlayer.name, fighterOpponent.name, fighterPlayer.outfit.chest.name))
        } else if (isBeastPack) {
            logs.push(BeastCombatNarratives.generateBeastPackIntro(fighterPlayer.name, fighterOpponent.name, fighterPlayer.outfit.chest.name))
        } else {
            logs.push(
                AestheticCombatNarratives.generateIntro(
                    fighterPlayer.name,
                    fighterOpponent.name,
                    fighterPlayer.outfit.chest.name,
                    fighterOpponent.outfit.chest.name
                )
            )
        }

        let round = 1
        let isSubmissionEnd = false

        while (fighterPlayer.isAlive && fighterOpponent.isAlive && round <= 25) {
            const roundTitle = isWrestling
                ? `--- [Er Meydanı Raundu ${round}] ---`
                : isSingleBeast
                  ? `--- [Matador & Canavar Boğuşması Raundu ${round}] ---`
                  : isBeastPack
                    ? `--- [Aç Yaratık Kuşatması Raundu ${round}] ---`
                    : `--- [Zarafet Raundu ${round}] ---`
            logs.push(roundTitle)

            // Hız / Çevikliğe göre inisiyatif sırası
            const playerFirst = (fighterPlayer.speed + kt.Random.nextInt(1, 10)) >= (fighterOpponent.speed + kt.Random.nextInt(1, 10))
            const first = (playerFirst) ? fighterPlayer : fighterOpponent
            const second = (playerFirst) ? fighterOpponent : fighterPlayer

            // 1. Dövüşçü Hamlesi
            if (isWrestling) {
                executeWrestlingAction(first, second, logs)
            } else if (isBeastFight) {
                executeBeastAction(first, second, logs, isSingleBeast)
            } else {
                executeAestheticAction(first, second, logs)
            }

            // 2. Dövüşçü (Hala ayaktaysa) Hamlesi
            if (second.isAlive) {
                if (isWrestling) {
                    executeWrestlingAction(second, first, logs)
                } else if (isBeastFight) {
                    executeBeastAction(second, first, logs, isSingleBeast)
                } else {
                    executeAestheticAction(second, first, logs)
                }
            } else {
                isSubmissionEnd = kt.Random.nextBoolean()
            }

            round++
        }

        // Eğer raundlar bitti ve ikisi de hala ayaktaysa HP'si yüksek olan kazanır
        const playerWon = (fighterPlayer.isAlive && fighterOpponent.isAlive)
            ? fighterPlayer.currentHp >= fighterOpponent.currentHp
            : fighterPlayer.isAlive

        const winner = (playerWon) ? fighterPlayer : fighterOpponent
        const loser = (playerWon) ? fighterOpponent : fighterPlayer

        const [victoryLog, reason] = isWrestling
            ? WrestlingCombatNarratives.generateVictory(winner.name, loser.name, isSubmissionEnd)
            : isBeastFight
              ? BeastCombatNarratives.generateVictory(winner.name, loser.name, isSingleBeast)
              : AestheticCombatNarratives.generateVictory(winner.name, loser.name, isSubmissionEnd)
        logs.push(victoryLog)

        const rewardGold = (playerWon) ? 45 + (player.level * 6) : 10
        const rewardExp = (playerWon) ? 75 + (player.level * 10) : 25
        const rewardFame = (playerWon) ? 3 : 0

        return new AestheticCombatResult({
            playerWon: playerWon,
            winnerName: winner.name,
            loserName: loser.name,
            victoryReason: reason,
            roundsPlayed: round - 1,
            playerFinalHp: Math.max(0, fighterPlayer.currentHp),
            playerMaxHp: fighterPlayer.maxHp,
            opponentFinalHp: Math.max(0, fighterOpponent.currentHp),
            opponentMaxHp: fighterOpponent.maxHp,
            playerClothingCondition: fighterPlayer.clothingCondition,
            opponentClothingCondition: fighterOpponent.clothingCondition,
            combatLogs: logs,
            goldEarned: rewardGold,
            expEarned: rewardExp,
            fameEarned: rewardFame
        })
    }

    function executeAestheticAction(attacker, defender, logs) {
        // 1. Kaçınma / Akrobasi Kontrolü
        const dodgeRoll = kt.Random.nextInt(100)
        if (dodgeRoll < defender.dodgeChance) {
            logs.push(AestheticCombatNarratives.generateDodge(defender.name, attacker.name))
            return
        }

        // 2. Hamle Türü: Vuruş, Klinç, Takedown veya Eklem Kilidi
        const actionRoll = kt.Random.nextInt(100)
        const isCrit = kt.Random.nextInt(100) < attacker.critChance

        if (isCrit) {
            // Kritik Takedown / Çelme / Yere Çalma
            const baseDmg = Math.round((attacker.strength * 1.6))
            const finalDmg = Math.max(10, baseDmg - kt.idiv(defender.endurance, 3))
            defender.currentHp -= finalDmg
            logs.push(AestheticCombatNarratives.generateCriticalTakedown(attacker.name, defender.name, finalDmg))
            checkClothingDegradation(defender, attacker.name, logs, true, 0)
        } else if (actionRoll < 25) {
            // Klinç / Yakaya Yapışma
            logs.push(AestheticCombatNarratives.generateClinch(attacker.name, defender.name))
            const baseDmg = Math.round((attacker.strength * 0.8))
            const finalDmg = Math.max(5, baseDmg - kt.idiv(defender.endurance, 4))
            defender.currentHp -= finalDmg
            logs.push(AestheticCombatNarratives.generateStrike(attacker.name, defender.name, finalDmg))
            checkClothingDegradation(defender, attacker.name, logs, false, 0)
        } else if (actionRoll < 45) {
            // Eklem Kilidi / Submission Baskısı
            logs.push(AestheticCombatNarratives.generateSubmissionAttempt(attacker.name, defender.name))
            const baseDmg = Math.round((attacker.strength * 1.1))
            const finalDmg = Math.max(8, baseDmg - kt.idiv(defender.endurance, 4))
            defender.currentHp -= finalDmg
            checkClothingDegradation(defender, attacker.name, logs, false, 0)
        } else {
            // Açık El / Dirsek / Döner Tekme Darbesi
            const baseDmg = Math.round((attacker.strength * 1.0))
            const finalDmg = Math.max(7, baseDmg - kt.idiv(defender.endurance, 3))
            defender.currentHp -= finalDmg
            logs.push(AestheticCombatNarratives.generateStrike(attacker.name, defender.name, finalDmg))
            checkClothingDegradation(defender, attacker.name, logs, false, 0)
        }
    }

    function executeWrestlingAction(attacker, defender, logs) {
        // 1. Duruş / Tartma / Denge Kontrolü
        const dodgeRoll = kt.Random.nextInt(100)
        if (dodgeRoll < defender.dodgeChance) {
            logs.push(WrestlingCombatNarratives.generateStance(defender.name, attacker.name))
            return
        }

        // 2. Hamle Türü: Dalış, Kapışma/Kenetlenme, Tuş/Kilit, Fırlatma/Künde
        const actionRoll = kt.Random.nextInt(100)
        const isCrit = kt.Random.nextInt(100) < attacker.critChance

        if (isCrit) {
            // Kritik Fırlatma / Künde / Bel Kündesi / Suplex
            const baseDmg = Math.round((attacker.strength * 1.6))
            const finalDmg = Math.max(12, baseDmg - kt.idiv(defender.endurance, 3))
            defender.currentHp -= finalDmg
            logs.push(WrestlingCombatNarratives.generateThrowOrKunde(attacker.name, defender.name, finalDmg))
            checkClothingDegradation(defender, attacker.name, logs, true, 1)
        } else if (actionRoll < 30) {
            // Dalışlar & Ayak Oyunları: Çift Paça, Tek Paça, Tırpan, İç Kazık
            logs.push(WrestlingCombatNarratives.generateShootOrSweep(attacker.name, defender.name))
            const baseDmg = Math.round((attacker.strength * 0.9))
            const finalDmg = Math.max(6, baseDmg - kt.idiv(defender.endurance, 4))
            defender.currentHp -= finalDmg
            logs.push(WrestlingCombatNarratives.generateThrowOrKunde(attacker.name, defender.name, finalDmg))
            checkClothingDegradation(defender, attacker.name, logs, false, 1)
        } else if (actionRoll < 60) {
            // Kapışlar & Kenetlenmeler: Çift Boyunduruk, Kravat Kilidi, Göğüs Göğüse Sürtünme
            logs.push(WrestlingCombatNarratives.generateClinch(attacker.name, defender.name))
            const baseDmg = Math.round((attacker.strength * 0.8))
            const finalDmg = Math.max(5, baseDmg - kt.idiv(defender.endurance, 4))
            defender.currentHp -= finalDmg
            checkClothingDegradation(defender, attacker.name, logs, false, 1)
        } else {
            // Tuş / Kilit / Kaburga Mengenesi
            const baseDmg = Math.round((attacker.strength * 1.1))
            const finalDmg = Math.max(8, baseDmg - kt.idiv(defender.endurance, 4))
            defender.currentHp -= finalDmg
            logs.push(WrestlingCombatNarratives.generatePinOrSubmission(attacker.name, defender.name, finalDmg))
            checkClothingDegradation(defender, attacker.name, logs, false, 1)
        }
    }

    function executeBeastAction(attacker, defender, logs, isSingleBeast) {
        const attackerIsHuman = attacker.isPlayer

        if (attackerIsHuman) {
            // İnsan Gladyatör Canavara Karşı Hamle Yapıyor
            const actionRoll = kt.Random.nextInt(100)
            const isCrit = kt.Random.nextInt(100) < attacker.critChance

            if (isCrit) {
                // Kritik: Sırta Binme & Boğaz Kilidi / Boyun Kırma
                const baseDmg = Math.round((attacker.strength * 1.6))
                const finalDmg = Math.max(14, baseDmg - kt.idiv(defender.endurance, 3))
                defender.currentHp -= finalDmg
                logs.push(BeastCombatNarratives.generateBeastVaultAndChoke(attacker.name, defender.name, finalDmg))
                checkClothingDegradation(defender, attacker.name, logs, true, 2)
            } else if (actionRoll < 35) {
                // 1v1 ise Matador Sıyrılışı & Kumaş Manevrası; Sürü ise Çift Yaratık Çarpıştırma (Kuyruktan / Boğazdan Tutup Çarpıştırma)
                if (isSingleBeast) {
                    const speedSuccess = (attacker.speed + kt.Random.nextInt(1, 10)) >= (defender.speed + 4)
                    const baseDmg = (speedSuccess) ? Math.round((attacker.speed * 1.1 + attacker.strength * 0.4)) : Math.round((attacker.speed * 0.6))
                    const finalDmg = Math.max(8, baseDmg - kt.idiv(defender.endurance, 4))
                    defender.currentHp -= finalDmg
                    logs.push(BeastCombatNarratives.generateMatadorManeuver(attacker.name, defender.name, speedSuccess, attacker.speed))
                    if (speedSuccess) {
                        logs.push(BeastCombatNarratives.generateBeastPowerClash(attacker.name, defender.name, true, attacker.strength, finalDmg))
                    }
                    checkClothingDegradation(defender, attacker.name, logs, false, 2)
                } else {
                    // Sürü Çarpıştırma (Kuyruktan veya Boğazdan Tutup diğerine vurma)
                    const strengthSuccess = (attacker.strength + kt.Random.nextInt(1, 10)) >= (defender.strength + 2)
                    const baseDmg = (strengthSuccess) ? Math.round((attacker.strength * 1.2)) : Math.round((attacker.strength * 0.7))
                    const finalDmg = Math.max(8, baseDmg - kt.idiv(defender.endurance, 4))
                    defender.currentHp -= finalDmg
                    logs.push(BeastCombatNarratives.generatePackCollision(attacker.name, defender.name, strengthSuccess, attacker.strength, finalDmg))
                    checkClothingDegradation(defender, attacker.name, logs, false, 2)
                }
            } else if (actionRoll < 65) {
                // Arena Tuzakları Kullanımı (Kazık, Asılı Kafes, Köz Çanağı vb.)
                const trap = kt.random(ArenaTrapType.entries)
                const cunningSuccess = (attacker.cunning + kt.Random.nextInt(1, 10)) >= 15
                const baseDmg = (cunningSuccess) ? Math.round((attacker.cunning * 1.3 + attacker.strength * 0.5)) : Math.round((attacker.strength * 0.5))
                const finalDmg = Math.max(10, baseDmg - kt.idiv(defender.endurance, 4))
                defender.currentHp -= finalDmg
                logs.push(BeastCombatNarratives.generateArenaTrapTrigger(attacker.name, defender.name, trap, cunningSuccess, attacker.cunning, finalDmg))
                checkClothingDegradation(defender, attacker.name, logs, false, 2)
            } else {
                // Bilek ve Boynuz / Çene Yakalama Güç Çarpışması veya Canlı Kalkan
                if (isSingleBeast) {
                    const strengthSuccess = (attacker.strength + kt.Random.nextInt(1, 10)) >= defender.strength
                    const baseDmg = Math.round((attacker.strength * 1.0))
                    const finalDmg = Math.max(7, baseDmg - kt.idiv(defender.endurance, 4))
                    defender.currentHp -= finalDmg
                    logs.push(BeastCombatNarratives.generateBeastPowerClash(attacker.name, defender.name, strengthSuccess, attacker.strength, finalDmg))
                    checkClothingDegradation(defender, attacker.name, logs, false, 2)
                } else {
                    const baseDmg = Math.round((attacker.strength * 0.95))
                    const finalDmg = Math.max(7, baseDmg - kt.idiv(defender.endurance, 4))
                    defender.currentHp -= finalDmg
                    logs.push(BeastCombatNarratives.generateBeastMeatShield(attacker.name, defender.name, finalDmg))
                    checkClothingDegradation(defender, attacker.name, logs, false, 2)
                }
            }
        } else {
            // Canavar İnsana Saldırıyor
            const dodgeRoll = kt.Random.nextInt(100)
            if (dodgeRoll < defender.dodgeChance) {
                if (isSingleBeast) {
                    logs.push(BeastCombatNarratives.generateMatadorManeuver(defender.name, attacker.name, true, defender.speed))
                } else {
                    logs.push(`💨 ${kotlinToString(defender)} çevik bir sıçrayışla ${kotlinToString(attacker)}'ın hücumunun üstünden aştı; dişler boş havayı kapattı!`)
                }
                return
            }

            const isCrit = kt.Random.nextInt(100) < attacker.critChance
            const baseDmg = (isCrit) ? Math.round((attacker.strength * 1.4)) : Math.round((attacker.strength * 0.9))
            const finalDmg = Math.max(6, baseDmg - kt.idiv(defender.endurance, 3))
            defender.currentHp -= finalDmg
            logs.push(BeastCombatNarratives.generateBeastStrike(attacker.name, defender.name, finalDmg))
            checkClothingDegradation(defender, attacker.name, logs, isCrit, 2)
        }
    }

    function checkClothingDegradation(fighter, opponentName, logs, forcedTear, combatMode /* 0: AESTHETIC, 1: WRESTLING, 2: BEAST */) {
        // Kotlin Float aritmetiği (toFloat() / toFloat() * 100f): Math.fround ile tek duyarlıklı
        const hpPercent = Math.fround(Math.fround(fighter.currentHp / fighter.maxHp) * 100)
        const newCondition = hpPercent <= 20
            ? ClothingCondition.RUINED_AESTHETIC
            : hpPercent <= 50
              ? ClothingCondition.TORN_EXPOSED
              : (hpPercent <= 80 || forcedTear)
                ? ClothingCondition.SLIGHTLY_TORN
                : fighter.clothingCondition

        if (newCondition.stage > fighter.clothingCondition.stage) {
            fighter.clothingCondition = newCondition

            switch (combatMode) {
                case 1: {
                    // Er Meydanı / Pehlivan
                    logs.push(WrestlingCombatNarratives.generateGearInteraction(fighter.name, newCondition.stage))
                    logs.push(WrestlingCombatNarratives.generateSpectatorReaction(newCondition.stage))

                    if (newCondition.stage >= 2) {
                        logs.push(WrestlingCombatNarratives.generateCazgirCommentary(fighter.name, opponentName))
                    }
                    break
                }
                case 2: {
                    // Canavar & Vahşet
                    // Not: Kotlin kaynağı burada "$fighter" ile nesnenin kendisini (data class toString) yerleştiriyor; aynen korundu.
                    const tearLog = newCondition.stage === 1
                        ? `🩸 ${opponentName}'nin pençeleri ${kotlinToString(fighter)}'ın kuşamını boydan boya yırttı; deri ve kumaş parçaları kumlara savruldu!`
                        : newCondition.stage === 2
                          ? `🩸 Şiddetli pençe darbesiyle ${kotlinToString(fighter)}'ın göğüs koruması parçalandı; kan ve ter kızıl kum zeminine damlıyor!`
                          : `🩸 ${kotlinToString(fighter)}'ın kıyafetleri neredeyse tamamen parçalandı; çıplak göğsü ve adeleleri pençe sıyrıklarıyla kaplanmış halde hayatta kalmak için kükrüyor!`
                    logs.push(tearLog)
                    logs.push(BeastCombatNarratives.generateBloodlustCrowd())

                    if (newCondition.stage >= 2) {
                        logs.push(BeastCombatNarratives.generateBloodlustAnnouncer(fighter.name, opponentName))
                    }
                    break
                }
                default: {
                    // Zarafet Düellosu
                    const pieceName = newCondition === ClothingCondition.SLIGHTLY_TORN
                        ? fighter.outfit.chest.name
                        : newCondition === ClothingCondition.TORN_EXPOSED
                          ? `${fighter.outfit.chest.name} ve kuşağı`
                          : newCondition === ClothingCondition.RUINED_AESTHETIC
                            ? `${fighter.outfit.chest.name}, ${fighter.outfit.pants.name}`
                            : fighter.outfit.chest.name
                    logs.push(AestheticCombatNarratives.generateClothingTear(fighter.name, newCondition.stage, pieceName))
                    logs.push(AestheticCombatNarratives.generateSpectatorReaction(newCondition.stage))

                    if (newCondition.stage >= 2) {
                        logs.push(AestheticCombatNarratives.generateAnnouncerCommentary(fighter.name, opponentName, newCondition.stage))
                    }
                }
            }
        }
    }

export const AestheticCombatEngine = {
    simulateDuel,
}
