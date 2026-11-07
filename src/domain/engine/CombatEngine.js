package com.silahsor.diyarinkaderi.domain.engine

import com.silahsor.diyarinkaderi.domain.model.*
import kotlin.math.max
import kotlin.math.roundToInt
import kotlin.random.Random

object CombatEngine {

    function simulateBattle(player, enemy, handicapBet = null, knownWeakness = null) {
        const pStats = player.totalStats
        const eStats = enemy.totalStats

        let pCurrentHp = player.currentHealth
        let eCurrentHp = eStats.maxHealth

        const logs = []
        let round = 1
        let totalPlayerDamage = 0
        let totalEnemyDamage = 0
        let critCount = 0

        const playerWeaponName = player.equipped[EquipmentSlot.WEAPON]?.name ?? 'Çıplak Yumrukları'
        const enemyWeaponName = enemy.weaponName

        const bodyParts = TargetBodyPart.values()

        // Battle continues until health drops to 0 or below (true knockout / death)
        const equippedItems = player.equipped.values.filterNotNull()
        const playerSpecialTraits = kt.mapNotNull(equippedItems, (it) => it.specialTrait)
        const playerLifesteal = kt.sumOf(equippedItems, (it) => it.lifestealPercent)
        const playerArmorPen = kt.sumOf(equippedItems, (it) => it.armorPenetrationPercent)
        const playerStunChance = kt.sumOf(equippedItems, (it) => it.stunChancePercent)
        const playerBuffs = player.activeBuffs

        const enemySpecialTraits = enemy.specialTraits
        const enemyLifesteal = enemy.lifestealPercent
        const enemyArmorPen = enemy.armorPenPercent
        const enemyStunChance = enemy.stunChancePercent

        const hasIronWill = player.unlockedSkillIds.includes('skill_iron_will')
        const hasCrushingImpact = player.unlockedSkillIds.includes('skill_crushing_impact')
        const hasCounterFlurry = player.unlockedSkillIds.includes('skill_counter_flurry')

        let playerBleedTurns = 0
        let enemyBleedTurns = 0
        let playerHasRevived = false
        let enemyHasRevived = false

        let enemyIsStunned = false
        let playerIsStunned = false
        const enemyCooldowns = {}
        const playerCooldowns = {}

        const playerSkills = kt.mapNotNull(player.equippedSkillIds.slice(0, 4), (skillId) => {
when (skillId) {
                'skill_crushing_impact' -> GladiatorSkill('skill_player_crushing', 'Ezici Balyoz', '💥', SkillType.ATTACK, 1, 3, 'Tüm vücut ağırlığını tek noktaya odaklayarak savrulan ezici çekiç.', '+%35 Hasar ve Sersemletme')
                'skill_iron_will' -> GladiatorSkill('skill_player_iron_will', 'Çelik İrade', '🛡️', SkillType.DEFENSE, 1, 4, 'Acıyı zırha çevirip darbeleri soğuran kadim silahşör iradesi.', '+6 Geçici Zırh ve Hasar Kırma')
                'skill_counter_flurry' -> GladiatorSkill('skill_player_counter', 'Akrobatik Karşı Hamle', '⚡', SkillType.TACTICAL, 1, 3, 'Düşman silahından sıyrılıp açılan boşluğa saplanan yıldırım darbesi.', '+%40 Hasarlı Karşı Hamle')
                'skill_east_dragon' -> GladiatorSkill('skill_east_dragon', 'Ejder Nefesi Hamlesi', '🐉', SkillType.ATTACK, 1, 3, 'Doğu mabetlerinden kalma kadim odaklanma; silahın ucunu kor gibi ısıtıp savunmayı eritir.', '+%40 Hasar ve Gard Kırma')
                'skill_east_crane' -> GladiatorSkill('skill_east_crane', 'Turna Zarafeti', '🕊️', SkillType.TACTICAL, 1, 3, 'Rüzgarın akışına uyarak rakibin vuruş çizgisinden tüy gibi süzülme tekniği.', '+%20 Kaçınma ve Anında Karşı Açık')
                'skill_east_storm' -> GladiatorSkill('skill_east_storm', 'Fırtına Kesisi', '🌪️', SkillType.ATTACK, 1, 2, 'Göz açıp kapayıncaya dek art arda indirilen seri ve kesici rüzgar darbeleri.', '+%30 Seri Hasar ve Kan Kaybı')
                'skill_east_night' -> GladiatorSkill('skill_east_night', 'Gölge Adımı', '🌑', SkillType.TACTICAL, 1, 4, 'Rakibin göz kırpma anında gölgelere karışarak kör noktasına sızma sanatı.', '+%50 Kritik Vuruş ve Sersemletme')
                'skill_east_tiger' -> GladiatorSkill('skill_east_tiger', 'Kaplan Pençesi', '🐅', SkillType.ATTACK, 1, 3, 'Vahşi bir içgüdüyle düşmanın etini parçalayan amansız pençe savuruşu.', '+%35 Hasar ve Ağır Kanama')
                'skill_east_mountain' -> GladiatorSkill('skill_east_mountain', 'Kadim Dağ Duruşu', '🏔️', SkillType.DEFENSE, 1, 4, 'Köklerini toprağın derinliklerine salmış bir dağ gibi sarsılmaz direnç.', '+8 Geçici Zırh ve Hasar Kırma')
                else -> null
            }
})

        while (pCurrentHp > 0 && eCurrentHp > 0) {
            decrementCooldowns(enemyCooldowns)
            decrementCooldowns(playerCooldowns)

            // 1. Tur Başı Can Yenilenmesi (Regeneration)
            if (hasRegenerationTrait(playerSpecialTraits) && pCurrentHp > 0 && pCurrentHp < pStats.maxHealth) {
                const pRegen = Math.max(3, Math.round((pStats.maxHealth * 0.05)))
                pCurrentHp = kt.coerceAtMost((pCurrentHp + pRegen), pStats.maxHealth)
                logs.push(
                    new CombatLog({
                        round: round,
                        narrativeText: `🌿 [YAŞAM CANLILIĞI!] Büyülü zırh ve mühürler ${player.name}'in yaralarını tazeledi (+${pRegen} Can)!`,
                        attackerName: player.name,
                        defenderName: enemy.name,
                        event: CombatEvent.HIT,
                        damage: 0,
                        defenderHpLeft: pCurrentHp,
                        defenderMaxHp: pStats.maxHealth,
                        isPlayerAttacker: true
                    })
                )
            }
            if (hasRegenerationTrait(enemySpecialTraits) && eCurrentHp > 0 && eCurrentHp < eStats.maxHealth) {
                const eRegen = Math.max(3, Math.round((eStats.maxHealth * 0.05)))
                eCurrentHp = kt.coerceAtMost((eCurrentHp + eRegen), eStats.maxHealth)
                logs.push(
                    new CombatLog({
                        round: round,
                        narrativeText: `🌿 [YAŞAM CANLILIĞI!] Büyülü zırh ve rünler ${enemy.name}'in yaralarını tazeledi (+${eRegen} Can)!`,
                        attackerName: enemy.name,
                        defenderName: player.name,
                        event: CombatEvent.HIT,
                        damage: 0,
                        defenderHpLeft: eCurrentHp,
                        defenderMaxHp: eStats.maxHealth,
                        isPlayerAttacker: false
                    })
                )
            }

            // 2. Tur Başı Ağır Kanama Hasarları (Bleed DoT)
            if (playerBleedTurns > 0 && pCurrentHp > 0) {
                const bleedDmg = 8
                pCurrentHp = Math.max(1, pCurrentHp - bleedDmg)
                playerBleedTurns--
                logs.push(
                    new CombatLog({
                        round: round,
                        narrativeText: `🩸 [KAN KAYBI!] ${player.name} derin yarasından sızan kan yüzünden ${bleedDmg} can kaybetti!`,
                        attackerName: enemy.name,
                        defenderName: player.name,
                        event: CombatEvent.HIT,
                        damage: bleedDmg,
                        defenderHpLeft: pCurrentHp,
                        defenderMaxHp: pStats.maxHealth,
                        isPlayerAttacker: false
                    })
                )
            }
            if (enemyBleedTurns > 0 && eCurrentHp > 0) {
                const bleedDmg = 8
                eCurrentHp = Math.max(1, eCurrentHp - bleedDmg)
                enemyBleedTurns--
                logs.push(
                    new CombatLog({
                        round: round,
                        narrativeText: `🩸 [KAN KAYBI!] ${enemy.name} derin yarasından sızan kan yüzünden ${bleedDmg} can kaybetti!`,
                        attackerName: player.name,
                        defenderName: enemy.name,
                        event: CombatEvent.HIT,
                        damage: bleedDmg,
                        defenderHpLeft: eCurrentHp,
                        defenderMaxHp: eStats.maxHealth,
                        isPlayerAttacker: true
                    })
                )
            }

            const enemySkill = selectAiSkill(enemy.skills, enemyCooldowns, eCurrentHp, eStats.maxHealth)
            const playerSkill = selectAiSkill(playerSkills, playerCooldowns, pCurrentHp, pStats.maxHealth)

            // Intelligent AI Stance Decisions
            const enemyStance = decideAiStance(eCurrentHp, eStats.maxHealth, pCurrentHp, pStats.maxHealth)
            const playerStance = (pCurrentHp < pStats.maxHealth * 0.3) ? CombatStance.DEFENSIVE : CombatStance.BALANCED

            const playerFirst = if (pStats.speed === eStats.speed) {
                kt.Random.nextBoolean()
            } else {
                pStats.speed > eStats.speed
            }

            const isIronWillActive = hasIronWill && (pCurrentHp <= pStats.maxHealth * 0.40)
            const isCrushingRound = hasCrushingImpact && (round % 4 === 0)

            if (playerFirst) {
                // Player attacks (unless stunned)
                if (playerIsStunned) {
                    playerIsStunned = false
                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: `💫 ${player.name} sersemliğin etkisiyle afalladı, bu tur karşı hamle yapamadı!`,
                            attackerName: player.name,
                            defenderName: enemy.name,
                            event: CombatEvent.HIT,
                            damage: 0,
                            defenderHpLeft: eCurrentHp,
                            defenderMaxHp: eStats.maxHealth,
                            isPlayerAttacker: true
                        })
                    )
                } else {
                    const hitOutcome = executeStrike({
                        attackerName: player.name,
                        defenderName: enemy.name,
                        weapon: playerWeaponName,
                        attackerStats: pStats,
                        defenderStats: eStats,
                        defenderHp: eCurrentHp,
                        defenderMaxHp: eStats.maxHealth,
                        round: round,
                        isPlayer: true,
                        bodyPart: bodyParts[kt.Random.nextInt(bodyParts.length)],
                        stance: playerStance,
                        knownWeakness: knownWeakness,
                        specialTraits: playerSpecialTraits,
                        defenderSpecialTraits: enemySpecialTraits,
                        attackerHp: pCurrentHp,
                        attackerMaxHp: pStats.maxHealth,
                        gemLifestealPercent: playerLifesteal,
                        gemArmorPenPercent: playerArmorPen,
                        gemStunPercent: playerStunChance,
                        isCrushingImpact: isCrushingRound,
                        triggeredSkill: playerSkill,
                        playerBuffs: playerBuffs
                    })
                    logs.push(hitOutcome.log)
                    eCurrentHp = hitOutcome.remainingHp
                    totalPlayerDamage += hitOutcome.damageDealt
                    if (hitOutcome.lifestealHp > 0) {
                        pCurrentHp = kt.coerceAtMost((pCurrentHp + hitOutcome.lifestealHp), pStats.maxHealth)
                    }
                    if (hitOutcome.appliedStun) {
                        enemyIsStunned = true
                    }
                    if (hitOutcome.appliedBleed) {
                        enemyBleedTurns = 3
                    }
                    if (hitOutcome.reflectedDamage > 0) {
                        pCurrentHp = Math.max(0, pCurrentHp - hitOutcome.reflectedDamage)
                    }
                    // Düşman Diriliş Kontrolü
                    if (eCurrentHp <= 0 && !enemyHasRevived && hasResurrectionTrait(enemySpecialTraits)) {
                        enemyHasRevived = true
                        const reviveHp = Math.max(15, Math.round((eStats.maxHealth * 0.35)))
                        eCurrentHp = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${enemy.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                attackerName: enemy.name,
                                defenderName: player.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: eCurrentHp,
                                defenderMaxHp: eStats.maxHealth,
                                isPlayerAttacker: false
                            })
                        )
                    }
                    // Oyuncu Yansıtma Hasarıyla Düştüyse Diriliş Kontrolü
                    if (pCurrentHp <= 0 && !playerHasRevived && hasResurrectionTrait(playerSpecialTraits)) {
                        playerHasRevived = true
                        const reviveHp = Math.max(15, Math.round((pStats.maxHealth * 0.35)))
                        pCurrentHp = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${player.name} kaderin anka alevleriyle ölümün eşiğinden döndü ve ayağa fırladı! (+${reviveHp} Can)`,
                                attackerName: player.name,
                                defenderName: enemy.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: pCurrentHp,
                                defenderMaxHp: pStats.maxHealth,
                                isPlayerAttacker: true
                            })
                        )
                    }
                    if (hitOutcome.log.event === CombatEvent.CRITICAL) critCount++
                }

                // Düşmanın canı 0'a indiyse; can havliyle son bir karşı hamle yapma şansı (çifte nakavt potansiyeli)
                const allowDesperationCounter = eCurrentHp <= 0 && (pCurrentHp <= 16 || kt.Random.nextInt(100) < 22)
                if (eCurrentHp <= 0 && !allowDesperationCounter) break

                // Enemy counter-attacks (unless stunned)
                if (enemyIsStunned) {
                    enemyIsStunned = false
                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: `💫 ${enemy.name} aldığı ezici darbenin sersemliğiyle sarsıldı, karşı hamle yapamadı!`,
                            attackerName: enemy.name,
                            defenderName: player.name,
                            event: CombatEvent.HIT,
                            damage: 0,
                            defenderHpLeft: pCurrentHp,
                            defenderMaxHp: pStats.maxHealth,
                            isPlayerAttacker: false
                        })
                    )
                } else {
                    const counterOutcome = executeStrike({
                        attackerName: enemy.name,
                        defenderName: player.name,
                        weapon: enemyWeaponName,
                        attackerStats: eStats,
                        defenderStats: pStats,
                        defenderHp: pCurrentHp,
                        defenderMaxHp: pStats.maxHealth,
                        round: round,
                        isPlayer: false,
                        bodyPart: bodyParts[kt.Random.nextInt(bodyParts.length)],
                        stance: (eCurrentHp <= 0) ? CombatStance.AGGRESSIVE : enemyStance,
                        tacticalPosition: (eCurrentHp <= 0) ? CombatTacticalPosition.DESPERATION : CombatTacticalPosition.NEUTRAL,
                        isIronWillActive: isIronWillActive,
                        specialTraits: enemySpecialTraits,
                        defenderSpecialTraits: playerSpecialTraits,
                        attackerHp: eCurrentHp,
                        attackerMaxHp: eStats.maxHealth,
                        gemLifestealPercent: enemyLifesteal,
                        gemArmorPenPercent: enemyArmorPen,
                        gemStunPercent: enemyStunChance,
                        triggeredSkill: enemySkill,
                        playerBuffs: playerBuffs
                    })
                    logs.push(counterOutcome.log)
                    pCurrentHp = counterOutcome.remainingHp
                    totalEnemyDamage += counterOutcome.damageDealt
                    if (counterOutcome.lifestealHp > 0) {
                        eCurrentHp = kt.coerceAtMost((eCurrentHp + counterOutcome.lifestealHp), eStats.maxHealth)
                    }
                    if (counterOutcome.appliedStun) {
                        playerIsStunned = true
                    }
                    if (counterOutcome.appliedBleed) {
                        playerBleedTurns = 3
                    }
                    if (counterOutcome.reflectedDamage > 0) {
                        eCurrentHp = Math.max(0, eCurrentHp - counterOutcome.reflectedDamage)
                    }
                    // Oyuncu Diriliş Kontrolü
                    if (pCurrentHp <= 0 && !playerHasRevived && hasResurrectionTrait(playerSpecialTraits)) {
                        playerHasRevived = true
                        const reviveHp = Math.max(15, Math.round((pStats.maxHealth * 0.35)))
                        pCurrentHp = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${player.name} kaderin anka alevleriyle ölümün eşiğinden döndü ve ayağa fırladı! (+${reviveHp} Can)`,
                                attackerName: player.name,
                                defenderName: enemy.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: pCurrentHp,
                                defenderMaxHp: pStats.maxHealth,
                                isPlayerAttacker: true
                            })
                        )
                    }
                    // Düşman Yansıtma Hasarıyla Düştüyse Diriliş Kontrolü
                    if (eCurrentHp <= 0 && !enemyHasRevived && hasResurrectionTrait(enemySpecialTraits)) {
                        enemyHasRevived = true
                        const reviveHp = Math.max(15, Math.round((eStats.maxHealth * 0.35)))
                        eCurrentHp = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${enemy.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                attackerName: enemy.name,
                                defenderName: player.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: eCurrentHp,
                                defenderMaxHp: eStats.maxHealth,
                                isPlayerAttacker: false
                            })
                        )
                    }
                    if (counterOutcome.log.event === CombatEvent.CRITICAL) critCount++

                    // Akrobatik Karşı Vuruş tetiklenmesi
                    if (counterOutcome.wasDodged && hasCounterFlurry && pCurrentHp > 0 && eCurrentHp > 0) {
                        const flurryOutcome = executeStrike({
                            attackerName: player.name,
                            defenderName: enemy.name,
                            weapon: playerWeaponName,
                            attackerStats: pStats.copy({damage: kt.toInt((pStats.damage * 1.4)) }),
                            defenderStats: eStats,
                            defenderHp: eCurrentHp,
                            defenderMaxHp: eStats.maxHealth,
                            round: round,
                            isPlayer: true,
                            bodyPart: TargetBodyPart.CHEST,
                            stance: CombatStance.AGGRESSIVE,
                            specialTraits: playerSpecialTraits,
                            defenderSpecialTraits: enemySpecialTraits,
                            playerBuffs: playerBuffs
                        })
                        logs.push(flurryOutcome.log.copy({narrativeText: `⚡ [AKROBATİK KARŞI VURUŞ!] Sıyrılmanın yarattığı boşluğu affetmedin ve anında yıldırım gibi karşı hücuma geçtin!\n${flurryOutcome.log.narrativeText}` }))
                        eCurrentHp = flurryOutcome.remainingHp
                        totalPlayerDamage += flurryOutcome.damageDealt
                        if (flurryOutcome.appliedBleed) enemyBleedTurns = 3
                        if (flurryOutcome.reflectedDamage > 0) pCurrentHp = Math.max(0, pCurrentHp - flurryOutcome.reflectedDamage)
                        if (eCurrentHp <= 0 && !enemyHasRevived && hasResurrectionTrait(enemySpecialTraits)) {
                            enemyHasRevived = true
                            const reviveHp = Math.max(15, Math.round((eStats.maxHealth * 0.35)))
                            eCurrentHp = reviveHp
                            logs.push(
                                new CombatLog({
                                    round: round,
                                    narrativeText: `🔥 [KADİM DİRİLİŞ!] ${enemy.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                    attackerName: enemy.name,
                                    defenderName: player.name,
                                    event: CombatEvent.HIT,
                                    damage: 0,
                                    defenderHpLeft: eCurrentHp,
                                    defenderMaxHp: eStats.maxHealth,
                                    isPlayerAttacker: false
                                })
                            )
                        }
                    }
                }

                if (eCurrentHp <= 0 || pCurrentHp <= 0) break
            } else {
                // Enemy attacks first (unless stunned)
                if (enemyIsStunned) {
                    enemyIsStunned = false
                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: `💫 ${enemy.name} sersemliğin etkisiyle gardını toparlayamadı, bu hamleyi pas geçti!`,
                            attackerName: enemy.name,
                            defenderName: player.name,
                            event: CombatEvent.HIT,
                            damage: 0,
                            defenderHpLeft: pCurrentHp,
                            defenderMaxHp: pStats.maxHealth,
                            isPlayerAttacker: false
                        })
                    )
                } else {
                    const hitOutcome = executeStrike({
                        attackerName: enemy.name,
                        defenderName: player.name,
                        weapon: enemyWeaponName,
                        attackerStats: eStats,
                        defenderStats: pStats,
                        defenderHp: pCurrentHp,
                        defenderMaxHp: pStats.maxHealth,
                        round: round,
                        isPlayer: false,
                        bodyPart: bodyParts[kt.Random.nextInt(bodyParts.length)],
                        stance: enemyStance,
                        isIronWillActive: isIronWillActive,
                        specialTraits: enemySpecialTraits,
                        defenderSpecialTraits: playerSpecialTraits,
                        attackerHp: eCurrentHp,
                        attackerMaxHp: eStats.maxHealth,
                        gemLifestealPercent: enemyLifesteal,
                        gemArmorPenPercent: enemyArmorPen,
                        gemStunPercent: enemyStunChance,
                        triggeredSkill: enemySkill,
                        playerBuffs: playerBuffs
                    })
                    logs.push(hitOutcome.log)
                    pCurrentHp = hitOutcome.remainingHp
                    totalEnemyDamage += hitOutcome.damageDealt
                    if (hitOutcome.lifestealHp > 0) {
                        eCurrentHp = kt.coerceAtMost((eCurrentHp + hitOutcome.lifestealHp), eStats.maxHealth)
                    }
                    if (hitOutcome.appliedStun) {
                        playerIsStunned = true
                    }
                    if (hitOutcome.appliedBleed) {
                        playerBleedTurns = 3
                    }
                    if (hitOutcome.reflectedDamage > 0) {
                        eCurrentHp = Math.max(0, eCurrentHp - hitOutcome.reflectedDamage)
                    }
                    // Oyuncu Diriliş Kontrolü
                    if (pCurrentHp <= 0 && !playerHasRevived && hasResurrectionTrait(playerSpecialTraits)) {
                        playerHasRevived = true
                        const reviveHp = Math.max(15, Math.round((pStats.maxHealth * 0.35)))
                        pCurrentHp = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${player.name} kaderin anka alevleriyle ölümün eşiğinden döndü ve ayağa fırladı! (+${reviveHp} Can)`,
                                attackerName: player.name,
                                defenderName: enemy.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: pCurrentHp,
                                defenderMaxHp: pStats.maxHealth,
                                isPlayerAttacker: true
                            })
                        )
                    }
                    // Düşman Yansıtma Hasarıyla Düştüyse Diriliş Kontrolü
                    if (eCurrentHp <= 0 && !enemyHasRevived && hasResurrectionTrait(enemySpecialTraits)) {
                        enemyHasRevived = true
                        const reviveHp = Math.max(15, Math.round((eStats.maxHealth * 0.35)))
                        eCurrentHp = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${enemy.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                attackerName: enemy.name,
                                defenderName: player.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: eCurrentHp,
                                defenderMaxHp: eStats.maxHealth,
                                isPlayerAttacker: false
                            })
                        )
                    }
                    if (hitOutcome.log.event === CombatEvent.CRITICAL) critCount++

                    // Akrobatik Karşı Vuruş tetiklenmesi
                    if (hitOutcome.wasDodged && hasCounterFlurry && pCurrentHp > 0 && eCurrentHp > 0) {
                        const flurryOutcome = executeStrike({
                            attackerName: player.name,
                            defenderName: enemy.name,
                            weapon: playerWeaponName,
                            attackerStats: pStats.copy({damage: kt.toInt((pStats.damage * 1.4)) }),
                            defenderStats: eStats,
                            defenderHp: eCurrentHp,
                            defenderMaxHp: eStats.maxHealth,
                            round: round,
                            isPlayer: true,
                            bodyPart: TargetBodyPart.CHEST,
                            stance: CombatStance.AGGRESSIVE,
                            specialTraits: playerSpecialTraits,
                            defenderSpecialTraits: enemySpecialTraits,
                            playerBuffs: playerBuffs
                        })
                        logs.push(flurryOutcome.log.copy({narrativeText: `⚡ [AKROBATİK KARŞI VURUŞ!] Sıyrılmanın yarattığı boşluğu affetmedin ve anında yıldırım gibi karşı hücuma geçtin!\n${flurryOutcome.log.narrativeText}` }))
                        eCurrentHp = flurryOutcome.remainingHp
                        totalPlayerDamage += flurryOutcome.damageDealt
                        if (flurryOutcome.appliedBleed) enemyBleedTurns = 3
                        if (flurryOutcome.reflectedDamage > 0) pCurrentHp = Math.max(0, pCurrentHp - flurryOutcome.reflectedDamage)
                        if (eCurrentHp <= 0 && !enemyHasRevived && hasResurrectionTrait(enemySpecialTraits)) {
                            enemyHasRevived = true
                            const reviveHp = Math.max(15, Math.round((eStats.maxHealth * 0.35)))
                            eCurrentHp = reviveHp
                            logs.push(
                                new CombatLog({
                                    round: round,
                                    narrativeText: `🔥 [KADİM DİRİLİŞ!] ${enemy.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                    attackerName: enemy.name,
                                    defenderName: player.name,
                                    event: CombatEvent.HIT,
                                    damage: 0,
                                    defenderHpLeft: eCurrentHp,
                                    defenderMaxHp: eStats.maxHealth,
                                    isPlayerAttacker: false
                                })
                            )
                        }
                    }
                }

                // Oyuncunun canı 0'a indiyse; can havliyle son bir karşı hamle yapma şansı (çifte nakavt potansiyeli)
                const allowDesperationCounter = pCurrentHp <= 0 && (eCurrentHp <= 16 || kt.Random.nextInt(100) < 22)
                if (pCurrentHp <= 0 && !allowDesperationCounter) break

                // Player counter-attacks (unless stunned)
                if (playerIsStunned) {
                    playerIsStunned = false
                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: `💫 ${player.name} sersemliğin etkisiyle gardını toparlayamadı, hamle yapamadı!`,
                            attackerName: player.name,
                            defenderName: enemy.name,
                            event: CombatEvent.HIT,
                            damage: 0,
                            defenderHpLeft: eCurrentHp,
                            defenderMaxHp: eStats.maxHealth,
                            isPlayerAttacker: true
                        })
                    )
                } else {
                    const counterOutcome = executeStrike({
                        attackerName: player.name,
                        defenderName: enemy.name,
                        weapon: playerWeaponName,
                        attackerStats: pStats,
                        defenderStats: eStats,
                        defenderHp: eCurrentHp,
                        defenderMaxHp: eStats.maxHealth,
                        round: round,
                        isPlayer: true,
                        bodyPart: bodyParts[kt.Random.nextInt(bodyParts.length)],
                        stance: (pCurrentHp <= 0) ? CombatStance.AGGRESSIVE : playerStance,
                        tacticalPosition: (pCurrentHp <= 0) ? CombatTacticalPosition.DESPERATION : CombatTacticalPosition.NEUTRAL,
                        knownWeakness: knownWeakness,
                        specialTraits: playerSpecialTraits,
                        defenderSpecialTraits: enemySpecialTraits,
                        attackerHp: pCurrentHp,
                        attackerMaxHp: pStats.maxHealth,
                        gemLifestealPercent: playerLifesteal,
                        gemArmorPenPercent: playerArmorPen,
                        gemStunPercent: playerStunChance,
                        isCrushingImpact: isCrushingRound,
                        triggeredSkill: playerSkill,
                        playerBuffs: playerBuffs
                    })
                    logs.push(counterOutcome.log)
                    eCurrentHp = counterOutcome.remainingHp
                    totalPlayerDamage += counterOutcome.damageDealt
                    if (counterOutcome.lifestealHp > 0) {
                        pCurrentHp = kt.coerceAtMost((pCurrentHp + counterOutcome.lifestealHp), pStats.maxHealth)
                    }
                    if (counterOutcome.appliedStun) {
                        enemyIsStunned = true
                    }
                    if (counterOutcome.appliedBleed) {
                        enemyBleedTurns = 3
                    }
                    if (counterOutcome.reflectedDamage > 0) {
                        pCurrentHp = Math.max(0, pCurrentHp - counterOutcome.reflectedDamage)
                    }
                    // Düşman Diriliş Kontrolü
                    if (eCurrentHp <= 0 && !enemyHasRevived && hasResurrectionTrait(enemySpecialTraits)) {
                        enemyHasRevived = true
                        const reviveHp = Math.max(15, Math.round((eStats.maxHealth * 0.35)))
                        eCurrentHp = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${enemy.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                attackerName: enemy.name,
                                defenderName: player.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: eCurrentHp,
                                defenderMaxHp: eStats.maxHealth,
                                isPlayerAttacker: false
                            })
                        )
                    }
                    // Oyuncu Yansıtma Hasarıyla Düştüyse Diriliş Kontrolü
                    if (pCurrentHp <= 0 && !playerHasRevived && hasResurrectionTrait(playerSpecialTraits)) {
                        playerHasRevived = true
                        const reviveHp = Math.max(15, Math.round((pStats.maxHealth * 0.35)))
                        pCurrentHp = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${player.name} kaderin anka alevleriyle ölümün eşiğinden döndü ve ayağa fırladı! (+${reviveHp} Can)`,
                                attackerName: player.name,
                                defenderName: enemy.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: pCurrentHp,
                                defenderMaxHp: pStats.maxHealth,
                                isPlayerAttacker: true
                            })
                        )
                    }
                    if (counterOutcome.log.event === CombatEvent.CRITICAL) critCount++
                }

                if (pCurrentHp <= 0 || eCurrentHp <= 0) break
            }

            round++
            // Aşırı uzayan dövüşlerde karşılıklı tükeniş ve kilitlenme (Circuit breaker / Draw)
            if (round > 50) {
                logs.push(
                    new CombatLog({
                        round: round,
                        narrativeText: TextTemplateEngine.generateDrawNarrative(player.name, playerWeaponName, enemy.name, enemyWeaponName, DrawSituation.MUTUAL_EXHAUSTION),
                        attackerName: player.name,
                        defenderName: enemy.name,
                        event: CombatEvent.DRAW,
                        damage: 0,
                        defenderHpLeft: pCurrentHp,
                        defenderMaxHp: pStats.maxHealth,
                        isPlayerAttacker: true
                    })
                )
                break
            }
        }

        const isDraw = pCurrentHp <= 0 && eCurrentHp <= 0 || round > 50
        const isPlayerWinner = pCurrentHp > 0 && eCurrentHp <= 0

        // Final victory / defeat / draw log
        if (isDraw) {
            logs.push(
                new CombatLog({
                    round: round,
                    narrativeText: TextTemplateEngine.generateDrawNarrative(player.name, playerWeaponName, enemy.name, enemyWeaponName, DrawSituation.DOUBLE_KNOCKOUT),
                    attackerName: player.name,
                    defenderName: enemy.name,
                    event: CombatEvent.DRAW,
                    damage: 0,
                    defenderHpLeft: 0,
                    defenderMaxHp: eStats.maxHealth,
                    isPlayerAttacker: true
                })
            )
        } else if (isPlayerWinner) {
            logs.push(
                new CombatLog({
                    round: round,
                    narrativeText: TextTemplateEngine.generateLog(player.name, enemy.name, playerWeaponName, CombatEvent.DEFEAT, TargetBodyPart.HEAD, 0, 0),
                    attackerName: player.name,
                    defenderName: enemy.name,
                    event: CombatEvent.DEFEAT,
                    damage: 0,
                    defenderHpLeft: 0,
                    defenderMaxHp: eStats.maxHealth,
                    isPlayerAttacker: true
                })
            )
        } else {
            logs.push(
                new CombatLog({
                    round: round,
                    narrativeText: TextTemplateEngine.generateLog(enemy.name, player.name, enemyWeaponName, CombatEvent.DEFEAT, TargetBodyPart.CHEST, 0, 0),
                    attackerName: enemy.name,
                    defenderName: player.name,
                    event: CombatEvent.DEFEAT,
                    damage: 0,
                    defenderHpLeft: 0,
                    defenderMaxHp: pStats.maxHealth,
                    isPlayerAttacker: false
                })
            )
        }

        // Dynamic Fame calculation:
        // Not guaranteed 1 every fight!
        // If player won an exciting fight (close call or multiple crits) -> +2 fame.
        // If standard win -> +1 fame.
        // If loss or mundane fight -> 0 fame.
        const earnedGold = when {
            isPlayerWinner -> enemy.rewardGold
            isDraw -> Math.max(6, kt.toInt((enemy.rewardGold * 0.6)))
            else -> 4
        }
        const earnedExp = when {
            isPlayerWinner -> enemy.rewardExp
            isDraw -> Math.max(10, kt.toInt((enemy.rewardExp * 0.75)))
            else -> 8
        }
        const earnedFame = when {
            isPlayerWinner -> {
                const baseFame = Math.max(1, enemy.rewardFame)
                const dramaticBonus = (pCurrentHp < (pStats.maxHealth * 0.25) || critCount >= 3) ? 1 : 0
                baseFame + dramaticBonus
            }
            isDraw -> 1 // Kasaba halkı böylesi efsanevi çifte nakavtı ayakta alkışlar!
            else -> 0
        }

        // Bet resolution
        let betWon = false
        let betEarnings = 0
        if (handicapBet != null && handicapBet.betAmount > 0) {
            betWon = when (handicapBet.id) {
                'fast_win' -> isPlayerWinner && round <= 15
                'flawless_win' -> isPlayerWinner && pCurrentHp >= kt.toInt((pStats.maxHealth * 0.6))
                'comeback_win' -> isPlayerWinner && pCurrentHp <= kt.toInt((pStats.maxHealth * 0.25))
                else -> false
            }
            betEarnings = (betWon) ? kt.toInt((handicapBet.betAmount * handicapBet.multiplier)) : 0
        }

        return new CombatResult({
            isPlayerWinner: isPlayerWinner,
            isDraw: isDraw,
            totalRounds: round,
            totalPlayerDamage: totalPlayerDamage,
            totalEnemyDamage: totalEnemyDamage,
            finalPlayerHp: Math.max(0, pCurrentHp),
            logs: logs,
            earnedGold: earnedGold,
            earnedExp: earnedExp,
            earnedFame: earnedFame,
            droppedItem: (isPlayerWinner && enemy.lootDrop != null && kt.Random.nextInt(100) < 40) ? enemy.lootDrop : null,
            betWon: betWon,
            betEarnings: betEarnings
        })
    }

    function decideAiStance(myHp, myMaxHp, oppHp, oppMaxHp) {
        const myRatio = myHp / myMaxHp
        const oppRatio = oppHp / oppMaxHp

        return when {
            myRatio < 0.30 -> CombatStance.DEFENSIVE
            oppRatio < 0.30 || myRatio > 0.75 -> CombatStance.AGGRESSIVE
            kt.Random.nextInt(100) < 40 -> CombatStance.OPPORTUNISTIC
            else -> CombatStance.BALANCED
        }
    }

    function selectAiSkill(skills, cooldowns, attackerHp, attackerMaxHp) {
        if (skills.length === 0) return null
        const readySkills = skills.filter((it) => (cooldowns[it.id] ?? 0) <= 0)
        if (readySkills.length === 0) return null

        // 38% chance to trigger a signature skill when available
        if (kt.Random.nextInt(100) >= 38) return null

        const isLowHp = attackerHp <= attackerMaxHp * 0.4
        const chosenSkill = if (isLowHp) {
            kt.firstOrNull(readySkills, (it) => it.type === SkillType.ULTIMATE || it.type === SkillType.DEFENSE)
                ?? kt.random(readySkills)
        } else {
            kt.random(readySkills)
        }

        cooldowns[chosenSkill.id] = chosenSkill.cooldownTurns
        return chosenSkill
    }

    function decrementCooldowns(cooldowns) {
        for (key in cooldowns.keys.toList()) {
            const cd = cooldowns[key] ?? 0
            if (cd > 0) {
                cooldowns[key] = cd - 1
            }
        }
    }

    function hasRegenerationTrait(traits) {
        return traits.some((trait) => {
[
                'trait_robe_sea_wind', 'trait_tash_ha_50', 'trait_tash_bt_50',
                'trait_tash_pants_50', 'trait_seal_emerald_life', 'trait_ring_emerald_regrowth'
            ].includes(trait.id) || trait.name.toLowerCase().includes('yenilen') ||
                trait.name.toLowerCase().includes('hayat çiçeği') ||
                trait.description.toLowerCase().includes('can yeniler') ||
                trait.description.toLowerCase().includes('sağlık yeniler') ||
                trait.description.toLowerCase().includes('hayat aurası') ||
                trait.description.toLowerCase().includes('yenilenme') ||
                trait.description.toLowerCase().includes('taze polenler')
})
    }

    function hasResurrectionTrait(traits) {
        return traits.some((trait) => {
['trait_tash_ha_50', 'trait_tash_bt_50'].includes(trait.id) ||
                trait.name.toLowerCase().includes('anka') ||
                trait.name.toLowerCase().includes('diriliş') ||
                trait.description.toLowerCase().includes('dirilir') ||
                trait.description.toLowerCase().includes('ölümden döner') ||
                trait.description.toLowerCase().includes('ölümden kurtarır') ||
                trait.description.toLowerCase().includes('küllerinden')
})
    }

    function findReflectionTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
[
                'trait_staff_mirror', 'trait_tash_ha_09', 'trait_tash_ha_41',
                'trait_seal_volcano_heart', 'trait_tash_ha_21'
            ].includes(trait.id) || trait.name.toLowerCase().includes('yansıt') ||
                trait.name.toLowerCase().includes('diken') ||
                trait.name.toLowerCase().includes('ayna') ||
                trait.name.toLowerCase().includes('magma damarı') ||
                trait.name.toLowerCase().includes('magma nefesi') ||
                trait.description.toLowerCase().includes('yansıt') ||
                trait.description.toLowerCase().includes('diken') ||
                trait.description.toLowerCase().includes('geri teper') ||
                trait.description.toLowerCase().includes('dağlayıp hasar') ||
                trait.description.toLowerCase().includes('akkor sıcaklıkla')
})
    }

    function findBarrierTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
[
                'trait_staff_tsunami', 'trait_staff_sacred_pillar', 'trait_staff_aethelgard_light',
                'trait_tash_pants_42', 'trait_tash_pants_09', 'trait_robe_archmage_vestment'
            ].includes(trait.id) || trait.name.toLowerCase().includes('bariyer') ||
                trait.name.toLowerCase().includes('sönüm') ||
                trait.name.toLowerCase().includes('barikat') ||
                trait.name.toLowerCase().includes('yıkılmaz kemik') ||
                trait.description.toLowerCase().includes('bariyer') ||
                trait.description.toLowerCase().includes('sönüm') ||
                trait.description.toLowerCase().includes('hasar emilimi') ||
                trait.description.toLowerCase().includes('hasarları %10 oranında azalt') ||
                trait.description.toLowerCase().includes('darbelerin etkisini') ||
                trait.description.toLowerCase().includes('sarsıntısını tamamen yutar') ||
                trait.description.toLowerCase().includes('darbeyi emer') ||
                trait.description.toLowerCase().includes('hasarı keser') ||
                trait.description.toLowerCase().includes('hasarı yumuşatır')
})
    }

    function findLastStandDefenseTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
trait.name.toLowerCase().includes('azam sur') ||
                trait.name.toLowerCase().includes('kebir hükmü') ||
                (trait.description.toLowerCase().includes('can %30') &&
                    (trait.description.toLowerCase().includes('hasarı') && trait.description.toLowerCase().includes('keser') ||
                     trait.description.toLowerCase().includes('savunmayı')))
})
    }

    function findBleedTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
[
                'trait_tash_ax_5', 'trait_tash_arrow_bleed_01', 'trait_tash_glove_05', 'trait_tash_dg_04'
            ].includes(trait.id) || trait.id.startsWith('trait_tash_arrow_bleed_') ||
                trait.name.toLowerCase().includes('kanama') ||
                trait.name.toLowerCase().includes('yırtık') ||
                trait.name.toLowerCase().includes('fafnir pençesi') ||
                trait.name.toLowerCase().includes('ipek kesiği') ||
                trait.description.toLowerCase().includes('kanama') ||
                trait.description.toLowerCase().includes('kan kaybet') ||
                trait.description.toLowerCase().includes('kan sızdır') ||
                trait.description.toLowerCase().includes('kan fışkırt') ||
                trait.description.toLowerCase().includes('derin yarık') ||
                trait.description.toLowerCase().includes('eti yarar')
})
    }

    function findExecutionTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
['trait_tash_tome_35', 'trait_tash_dg_47', 'trait_tash_dg_50', 'trait_tash_spn_45', 'trait_tash_sw_ext_31'].includes(trait.id) ||
                trait.name.toLowerCase().includes('infaz') ||
                trait.name.toLowerCase().includes('ecel') ||
                trait.name.toLowerCase().includes('kurt pençesi') ||
                trait.name.toLowerCase().includes('kan arzusu') ||
                trait.name.toLowerCase().includes('hüküm kesisi') ||
                trait.name.toLowerCase().includes('kader aynasının hükmü') ||
                trait.description.toLowerCase().includes('infaz') ||
                trait.description.toLowerCase().includes('son nefes') ||
                trait.description.toLowerCase().includes('%30 altı') ||
                trait.description.toLowerCase().includes('%35 altı') ||
                trait.description.toLowerCase().includes('%40 altı') ||
                trait.description.toLowerCase().includes('yarıdan az') ||
                trait.description.toLowerCase().includes('yaralı düşmana')
})
    }

    function findArmorPenTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
['trait_tash_mc_20', 'trait_tash_mc_35', 'trait_tash_sw_ext_26', 'trait_tash_spn_13', 'trait_tash_spn_47', 'trait_tash_sp_8'].includes(trait.id) ||
                trait.name.toLowerCase().includes('zırh del') ||
                trait.name.toLowerCase().includes('zırh parçala') ||
                trait.name.toLowerCase().includes('sur yarıcı') ||
                trait.name.toLowerCase().includes('hiçlik bıçağı') ||
                trait.name.toLowerCase().includes('kırılgan zırh') ||
                trait.description.toLowerCase().includes('zırh del') ||
                trait.description.toLowerCase().includes('zırhı del') ||
                trait.description.toLowerCase().includes('zırhı yar') ||
                trait.description.toLowerCase().includes('zırhını yok say') ||
                trait.description.toLowerCase().includes('zırhını hiçe say') ||
                trait.description.toLowerCase().includes('yok sayar') ||
                trait.description.toLowerCase().includes('hiçe say') ||
                trait.description.toLowerCase().includes('zırh boşluk') ||
                trait.description.toLowerCase().includes('zırhları un ufak') ||
                trait.description.toLowerCase().includes('zırh direncini erit') ||
                trait.description.toLowerCase().includes('zırh parçala') ||
                trait.description.toLowerCase().includes('zırhı parçala') ||
                trait.description.toLowerCase().includes('zırhı kır') ||
                trait.description.toLowerCase().includes('zırhını aş') ||
                trait.description.toLowerCase().includes('zırh tanımaz') ||
                trait.description.toLowerCase().includes('bodkin') ||
                trait.description.toLowerCase().includes('elmas sivri')
})
    }

    function findLifestealTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
[
                'trait_tash_sw_7', 'trait_tash_ax_9', 'trait_tash_ax_10', 'trait_staff_lotus',
                'trait_staff_soul_drain', 'trait_staff_shroud', 'trait_staff_thanatos_reap',
                'trait_tash_tome_20', 'trait_tash_tome_46'
            ].includes(trait.id) || trait.name.toLowerCase().includes('can çal') ||
                trait.name.toLowerCase().includes('can sömür') ||
                trait.name.toLowerCase().includes('kuzgun hırsı') ||
                trait.name.toLowerCase().includes('kanlı hilal') ||
                trait.name.toLowerCase().includes('kefen gölgesi') ||
                trait.name.toLowerCase().includes('hiçlik çekimi') ||
                trait.name.toLowerCase().includes('vampir') ||
                trait.name.toLowerCase().includes('ruh hasadı') ||
                trait.description.toLowerCase().includes('can çal') ||
                trait.description.toLowerCase().includes('can çeker') ||
                trait.description.toLowerCase().includes('cana çevir') ||
                trait.description.toLowerCase().includes('sağalt') ||
                trait.description.toLowerCase().includes('can sömür') ||
                trait.description.toLowerCase().includes('kül sömür') ||
                trait.description.toLowerCase().includes('kanından beslen') ||
                trait.description.toLowerCase().includes('özümse')
})
    }

    function findStunTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
['trait_tash_ax_1', 'trait_tash_ax_3', 'trait_tash_sp_12', 'trait_staff_earth_tremor', 'trait_staff_titan_earth'].includes(trait.id) ||
                trait.id.startsWith('trait_tash_mc_') ||
                trait.name.toLowerCase().includes('sersem') ||
                trait.name.toLowerCase().includes('afallat') ||
                trait.name.toLowerCase().includes('sarsıntı') ||
                trait.name.toLowerCase().includes('tokmak') ||
                trait.description.toLowerCase().includes('sersemlet') ||
                trait.description.toLowerCase().includes('afallat') ||
                trait.description.toLowerCase().includes('sendelet') ||
                trait.description.toLowerCase().includes('yere serer') ||
                trait.description.toLowerCase().includes('dengesini bozar') ||
                trait.description.toLowerCase().includes('sarsıcı güç') ||
                trait.description.toLowerCase().includes('kemikleri sarsar') ||
                trait.description.toLowerCase().includes('şok dalgası')
})
    }

    function findCritAmpTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
['trait_tash_sp_2', 'trait_tash_axe_03', 'trait_tailor_red_viper'].includes(trait.id) ||
                trait.name.toLowerCase().includes('kritik') ||
                trait.description.toLowerCase().includes('kritik vuruş hasarını artır') ||
                trait.description.toLowerCase().includes('kritik hasar potansiyelini katlar') ||
                trait.description.toLowerCase().includes('ölümcül kritik hasar') ||
                trait.description.toLowerCase().includes('kritik hasar')
})
    }

    function findSlowDebuffTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
['trait_tash_ax_11', 'trait_tash_sp_7', 'trait_tash_axe_15', 'trait_tash_axe_23'].includes(trait.id) ||
                trait.name.toLowerCase().includes('yavaşlat') ||
                trait.description.toLowerCase().includes('yavaşlat') ||
                trait.description.toLowerCase().includes('hızını düşür')
})
    }

    function findFireTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
[
                'trait_tash_sp_6', 'trait_tash_ax_6', 'trait_staff_ember', 'trait_staff_magma_eruption',
                'trait_staff_brimstone', 'trait_staff_primeval_fire', 'trait_tash_tome_02', 'trait_tash_tome_10',
                'trait_tash_tome_13', 'trait_tash_tome_24', 'trait_tash_tome_29', 'trait_tash_tome_34',
                'trait_tash_tome_43', 'trait_tash_tome_49'
            ].includes(trait.id) || trait.name.toLowerCase().includes('ateş') ||
                trait.name.toLowerCase().includes('alev') ||
                trait.name.toLowerCase().includes('magma') ||
                trait.name.toLowerCase().includes('lav ') ||
                trait.name.toLowerCase().includes('kükürt') ||
                trait.description.toLowerCase().includes('ateş hasarı') ||
                trait.description.toLowerCase().includes('alev') ||
                trait.description.toLowerCase().includes('kor alev') ||
                trait.description.toLowerCase().includes('lav hasarı') ||
                trait.description.toLowerCase().includes('erimiş lav') ||
                trait.description.toLowerCase().includes('kavurucu')
})
    }

    function findLightningTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
[
                'trait_tash_sw_12', 'trait_tash_sp_11', 'trait_staff_static', 'trait_staff_thunderbolt',
                'trait_staff_overload', 'trait_tash_tome_06', 'trait_tash_tome_15', 'trait_tash_tome_22',
                'trait_tash_tome_32', 'trait_tash_tome_45'
            ].includes(trait.id) || trait.name.toLowerCase().includes('yıldırım') ||
                trait.name.toLowerCase().includes('şimşek') ||
                trait.name.toLowerCase().includes('statik') ||
                trait.name.toLowerCase().includes('fırtına') ||
                trait.description.toLowerCase().includes('yıldırım hasarı') ||
                trait.description.toLowerCase().includes('şimşek hasarı') ||
                trait.description.toLowerCase().includes('elektrik') ||
                trait.description.toLowerCase().includes('şok')
})
    }

    function findPoisonTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
[
                'trait_tash_sw_8', 'trait_staff_viper_venom', 'trait_staff_spore', 'trait_tash_tome_16'
            ].includes(trait.id) || trait.name.toLowerCase().includes('zehir') ||
                trait.name.toLowerCase().includes('engerek') ||
                trait.name.toLowerCase().includes('toksin') ||
                trait.description.toLowerCase().includes('zehir hasarı') ||
                trait.description.toLowerCase().includes('zehir') ||
                trait.description.toLowerCase().includes('toksin') ||
                trait.description.toLowerCase().includes('sporlar')
})
    }

    function findFrostTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
[
                'trait_staff_frost_bite', 'trait_staff_frost_vortex', 'trait_staff_absolute_frost',
                'trait_staff_blizzard', 'trait_staff_absolute_zero', 'trait_tash_tome_03', 'trait_tash_tome_14',
                'trait_tash_tome_28', 'trait_tash_tome_36', 'trait_tash_tome_44'
            ].includes(trait.id) || trait.name.toLowerCase().includes('buz') ||
                trait.name.toLowerCase().includes('ayaz') ||
                trait.name.toLowerCase().includes('donuk') ||
                trait.name.toLowerCase().includes('kutup') ||
                trait.description.toLowerCase().includes('buzul hasarı') ||
                trait.description.toLowerCase().includes('buz hasarı') ||
                trait.description.toLowerCase().includes('dondur') ||
                trait.description.toLowerCase().includes('buzul rünleri')
})
    }

    function findDestinyTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
[
                'trait_tash_sw_13', 'trait_tash_ax_12', 'trait_staff_supernova', 'trait_staff_singularity',
                'trait_staff_mirror_destiny', 'trait_tash_tome_26', 'trait_tash_tome_41', 'trait_tash_tome_42',
                'trait_tash_tome_47', 'trait_tash_tome_48', 'trait_tash_tome_50'
            ].includes(trait.id) || trait.name.toLowerCase().includes('kozmik') ||
                trait.name.toLowerCase().includes('kader') ||
                trait.name.toLowerCase().includes('tekillik') ||
                trait.name.toLowerCase().includes('mahşer') ||
                trait.name.toLowerCase().includes('titan kudreti') ||
                trait.description.toLowerCase().includes('kozmik') ||
                trait.description.toLowerCase().includes('yıkıcı hasar') ||
                trait.description.toLowerCase().includes('kara delik') ||
                trait.description.toLowerCase().includes('tekillik')
})
    }

    function findDualShotTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
trait.id.startsWith('trait_tash_bow_dual_') ||
                trait.id.startsWith('trait_tash_arrow_dual_') ||
                trait.name.toLowerCase().includes('çift ok') ||
                trait.name.toLowerCase().includes('çifte atış') ||
                trait.name.toLowerCase().includes('ikiz diş') ||
                trait.name.toLowerCase().includes('çelik boğum') ||
                trait.name.toLowerCase().includes('kasırga çiftleme') ||
                trait.description.toLowerCase().includes('çift atış') ||
                trait.description.toLowerCase().includes('ikinci ok') ||
                trait.description.toLowerCase().includes('iki darbe vurarak') ||
                trait.description.toLowerCase().includes('iki ölümcül temren')
})
    }

    function findTripleShotTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
trait.id.startsWith('trait_tash_bow_triple_') ||
                trait.id.startsWith('trait_tash_arrow_triple_') ||
                trait.name.toLowerCase().includes('üçlü ok') ||
                trait.name.toLowerCase().includes('üç kiriş') ||
                trait.name.toLowerCase().includes('tayfun üçleme') ||
                trait.name.toLowerCase().includes('fırtına üçleme') ||
                trait.description.toLowerCase().includes('üç temren') ||
                trait.description.toLowerCase().includes('3 tayfun oku') ||
                trait.description.toLowerCase().includes('üç ok parçası')
})
    }

    function findEvasionBonusTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
trait.name.toLowerCase().includes('rüzgar adımı') ||
                trait.name.toLowerCase().includes('çevik keçi') ||
                trait.name.toLowerCase().includes('yılan çevikliği') ||
                trait.name.toLowerCase().includes('kanatlı süzülüş') ||
                trait.name.toLowerCase().includes('izsiz adım') ||
                trait.name.toLowerCase().includes('sessiz adım') ||
                trait.description.toLowerCase().includes('sıyrılmayı') ||
                trait.description.toLowerCase().includes('çevik dönüş') ||
                trait.description.toLowerCase().includes('ani kaçış')
})
    }

    function findDeflectionBonusTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
trait.name.toLowerCase().includes('perçinli siper') ||
                trait.name.toLowerCase().includes('halkalı örgü') ||
                trait.name.toLowerCase().includes('çift kat plaka') ||
                trait.name.toLowerCase().includes('safir kalkan') ||
                trait.name.toLowerCase().includes('titanyum kalkan') ||
                trait.description.toLowerCase().includes('sektirir') ||
                trait.description.toLowerCase().includes('enerji kalkanı') ||
                trait.description.toLowerCase().includes('ok uçlarını dağıtır') ||
                trait.description.toLowerCase().includes('sekerek geri iter')
})
    }

    function findBlindingTrait(traits) {
        return kt.firstOrNull(traits, (trait) => {
trait.name.toLowerCase().includes('güneş halo') ||
                trait.name.toLowerCase().includes('karanlık biçim') ||
                trait.name.toLowerCase().includes('gölge vizör') ||
                trait.name.toLowerCase().includes('sonsuz gece') ||
                trait.name.toLowerCase().includes('sonsuz karanlık') ||
                trait.description.toLowerCase().includes('gözünü alarak') ||
                trait.description.toLowerCase().includes('gözünü kör eder') ||
                trait.description.toLowerCase().includes('hedef almayı imkansız') ||
                trait.description.toLowerCase().includes('isabetini düşürür') ||
                trait.description.toLowerCase().includes('görüşünü köreltir')
})
    }

    private data class StrikeOutcome(
        const damageDealt: Int,
        const remainingHp: Int,
        const log: CombatLog,
        const lifestealHp = 0,
        const wasDodged = false,
        const appliedStun = false,
        const reflectedDamage = 0,
        const appliedBleed = false
    )

    function executeStrike(attackerName, defenderName, weapon, attackerStats, defenderStats, defenderHp, defenderMaxHp, round, isPlayer, bodyPart, stance, tacticalPosition = null, knownWeakness = null, specialTraits = [], defenderSpecialTraits = [], attackerHp = 100, attackerMaxHp = 100, gemLifestealPercent = 0, gemArmorPenPercent = 0, gemStunPercent = 0, isCrushingImpact = false, isIronWillActive = false, triggeredSkill = null, playerBuffs = []) {
        // Rakip Açığı / Zayıf Nokta İstismarı Kontrolü
        const isWeaknessExploited = isPlayer && knownWeakness != null && (kt.Random.nextInt(100) < knownWeakness.exploitChancePercent)

        // Apply stance modifiers
        let dodgeBonus = 0
        let blockBonus = 0
        let damageMult = 1.0
        let critBonus = 0

        when (stance) {
            CombatStance.AGGRESSIVE -> {
                damageMult = 1.25
                critBonus = 8
                dodgeBonus = -5
            }
            CombatStance.DEFENSIVE -> {
                damageMult = 0.8
                blockBonus = 15
                dodgeBonus = 10
            }
            CombatStance.OPPORTUNISTIC -> {
                critBonus = 12
                damageMult = 1.05
            }
            CombatStance.BALANCED -> {}
        }

        // Defansif Nitelikler: Kaçınma, Göz Kamaştırma ve Blok Bonusları
        const evasionTrait = findEvasionBonusTrait(defenderSpecialTraits)
        const blindingTrait = findBlindingTrait(defenderSpecialTraits)
        const deflectionTrait = findDeflectionBonusTrait(defenderSpecialTraits)

        if (evasionTrait != null) {
            dodgeBonus += 6
        }
        if (blindingTrait != null) {
            dodgeBonus += 8
        }
        if (deflectionTrait != null) {
            blockBonus += 8
        }

        // Dodge check (Açık istismar edildiyse veya Ezici Balyoz devredeyse rakip kaçamaz)
        const effectiveDodge = kt.coerceIn((defenderStats.dodgeChancePercent + dodgeBonus), 2, 65)
        if (!isWeaknessExploited && !isCrushingImpact && kt.Random.nextInt(100) < effectiveDodge) {
            const narrative = if (triggeredSkill != null) {
                TextTemplateEngine.generateSkillDodgeNarrative(attackerName, defenderName, triggeredSkill, weapon)
            } else {
                TextTemplateEngine.generateLog(attackerName, defenderName, weapon, CombatEvent.DODGED, bodyPart, 0, defenderHp, stance)
            }
            const log = new CombatLog({
                round: round,
                narrativeText: narrative,
                attackerName: attackerName,
                defenderName: defenderName,
                event: CombatEvent.DODGED,
                damage: 0,
                defenderHpLeft: defenderHp,
                defenderMaxHp: defenderMaxHp,
                isPlayerAttacker: isPlayer
            })
            return new StrikeOutcome({damageDealt: 0, remainingHp: defenderHp, log: log, wasDodged: true })
        }

        // Skill damage and crit bonuses & signature skill mechanics
        let skillAppliedBleed = false
        let skillAppliedStun = false
        if (triggeredSkill != null) {
            when (triggeredSkill.type) {
                SkillType.ULTIMATE -> {
                    damageMult *= 1.45
                    critBonus += 15
                }
                SkillType.ATTACK -> {
                    damageMult *= 1.25
                    critBonus += 5
                }
                SkillType.TACTICAL -> {
                    damageMult *= 1.15
                    critBonus += 10
                }
                SkillType.DEFENSE -> {
                    damageMult *= 1.10
                }
            }

            const skillDesc = (triggeredSkill.name + ' ' + triggeredSkill.description + ' ' + triggeredSkill.combatEffect).toLowerCase()
            if (skillDesc.includes('kanama') || skillDesc.includes('kan kaybet')) {
                skillAppliedBleed = true
            }
            if (skillDesc.includes('afallat') || skillDesc.includes('sersem')) {
                skillAppliedStun = true
            }
            if (skillDesc.includes('hasar kırma') || skillDesc.includes('gard kırma') || skillDesc.includes('savunma kır')) {
                damageMult *= 1.20
            }
        }

        // Crit check (Açık yakalandığında kritik şansı da artar)
        const effectiveCrit = kt.coerceIn((attackerStats.critChancePercent + critBonus + (if (isWeaknessExploited) 15 else 0)), 2, 85)
        const isCrit = kt.Random.nextInt(100) < effectiveCrit

        // Block check (Açık istismar edildiyse bloklanamaz)
        const effectiveBlock = kt.coerceIn((defenderStats.blockChancePercent + blockBonus), 2, 65)
        const isBlock = !isWeaknessExploited && !isCrit && kt.Random.nextInt(100) < effectiveBlock

        // Base damage calculation: variance +/- 15%
        const variance = 0.85 + (kt.Random.nextDouble() * 0.3)
        let rawDamage = (attackerStats.damage * variance * damageMult)
        if (isWeaknessExploited && knownWeakness != null) {
            rawDamage *= (1.0 + (knownWeakness.bonusDamagePercent / 100.0))
        }

        // Koşullu / Çift Nitelikli Ekipman Tetiklemeleri (2. Nitelik Sistemi)
        let traitTriggerNote = ''
        let lifestealAmount = 0
        let isWolfRageActive = false
        let isMeteorProc = false
        const bonusFireDmg = 5
        let exoticLifestealAmount = 0
        let hasExoticStun = false

        if (specialTraits.length > 0) {
            const hasWolfRage = specialTraits.some((it) => it.id === 'kurt_ofkesi')
            const hasMeteorHar = specialTraits.some((it) => it.id === 'yakici_darbe')
            const fireTrait = findFireTrait(specialTraits)
            const lightningTrait = findLightningTrait(specialTraits)
            const poisonTrait = findPoisonTrait(specialTraits)
            const frostTrait = findFrostTrait(specialTraits)
            const destinyTrait = findDestinyTrait(specialTraits)

            // 1. Ak Ayaz Öfkesi: Can %40'ın altına indiğinde +%20 saldırı hasarı ve %12 can çalma
            if (hasWolfRage && attackerHp <= (attackerMaxHp * 0.40)) {
                rawDamage *= 1.20
                isWolfRageActive = true
            }

            // 2. Göktaşı Harı: %28 şansla zırhı aşan +5 ek alev hasarı
            if (hasMeteorHar && kt.Random.nextInt(100) < 28) {
                rawDamage += bonusFireDmg
                isMeteorProc = true
            }

            // 3. Egzotik Silah / Asa Ateş ve Kor Etkisi
            if (fireTrait != null && kt.Random.nextInt(100) < 32) {
                rawDamage += 8
                traitTriggerNote += if (isPlayer) {
                    `🔥 [${fireTrait.name.toUpperCase()}!] Asadan fışkıran kor alevler hasmın zırhını eritti (+8 Alev Hasarı)!\n`
                } else {
                    `🔥 [${fireTrait.name.toUpperCase()}!] ${attackerName}'in silahından fışkıran kor alevler ${defenderName}'in zırhını eritti (+8 Alev Hasarı)!\n`
                }
            }

            // 4. Yıldırım / Şimşek Etkisi
            if (lightningTrait != null && kt.Random.nextInt(100) < 30) {
                rawDamage += 11
                traitTriggerNote += if (isPlayer) {
                    `⚡ [${lightningTrait.name.toUpperCase()}!] Göksel şimşekler hasmın üzerinde çaktı (+11 Yıldırım Hasarı)!\n`
                } else {
                    `⚡ [${lightningTrait.name.toUpperCase()}!] ${attackerName}'in göksel şimşekleri ${defenderName}'in üzerinde çaktı (+11 Yıldırım Hasarı)!\n`
                }
            }

            // 5. Zehir & Spor Etkisi
            if (poisonTrait != null && kt.Random.nextInt(100) < 35) {
                rawDamage += 7
                traitTriggerNote += if (isPlayer) {
                    `🐍 [${poisonTrait.name.toUpperCase()}!] Büyülü zehir ve sporlar rakibin yaralarına işledi (+7 Zehir Hasarı)!\n`
                } else {
                    `🐍 [${poisonTrait.name.toUpperCase()}!] ${attackerName}'in silahından sızan zehir ve sporlar ${defenderName}'in yaralarına işledi (+7 Zehir Hasarı)!\n`
                }
            }

            // 6. Ayaz / Dondurucu Soğuk Etkisi
            if (frostTrait != null && kt.Random.nextInt(100) < 30) {
                rawDamage += 8
                traitTriggerNote += if (isPlayer) {
                    `❄️ [${frostTrait.name.toUpperCase()}!] Buzul rünleri hasmı dondurarak uzuvlarını sızlattı (+8 Buzul Hasarı)!\n`
                } else {
                    `❄️ [${frostTrait.name.toUpperCase()}!] ${attackerName}'in buzul rünleri ${defenderName}'i dondurarak uzuvlarını sızlattı (+8 Buzul Hasarı)!\n`
                }
            }

            // 7. Nihai Kader / Titan / Kozmik Etkisi
            if (destinyTrait != null && (attackerHp <= (attackerMaxHp * 0.35) || kt.Random.nextInt(100) < 25)) {
                rawDamage += 15
                traitTriggerNote += if (isPlayer) {
                    `⚜️ [${destinyTrait.name.toUpperCase()}!] Kozmik kudret arenayı titreterek zırhları paramparça etti (+15 Yıkıcı Hasar)!\n`
                } else {
                    `⚜️ [${destinyTrait.name.toUpperCase()}!] ${attackerName}'in kozmik kudreti arenayı titreterek zırhları paramparça etti (+15 Yıkıcı Hasar)!\n`
                }
            }

            // 8. Egzotik Sersemletme
            const stunTrait = findStunTrait(specialTraits)
            if (stunTrait != null && kt.Random.nextInt(100) < 20) {
                hasExoticStun = true
                traitTriggerNote += if (isPlayer) {
                    `🔨 [${stunTrait.name.toUpperCase()}!] Masif şok dalgası hasmı sersemletti!\n`
                } else {
                    `🔨 [${stunTrait.name.toUpperCase()}!] ${attackerName}'in masif şok dalgası ${defenderName}'i sersemletti!\n`
                }
            }

            // 9. Çift Ok Salvosu (İkili Atan Yaylar)
            const dualShotTrait = findDualShotTrait(specialTraits)
            if (dualShotTrait != null && kt.Random.nextInt(100) < 35) {
                rawDamage += 9
                traitTriggerNote += if (isPlayer) {
                    `🏹 [${dualShotTrait.name.toUpperCase()}!] Kiriş ardışık iki kez gerildi; fırlayan ikinci ok hedefin böğrüne saplandı (+9 Ek Hasar)!\n`
                } else {
                    `🏹 [${dualShotTrait.name.toUpperCase()}!] ${attackerName} kirişi seri bir hamleyle tekrar çekip ikinci oku ${defenderName}'in böğrüne sapladı (+9 Ek Hasar)!\n`
                }
            }

            // 10. Üçlü Ok Yağmuru (Üçlü Atan Salvo Yayları & Arbaletler)
            const tripleShotTrait = findTripleShotTrait(specialTraits)
            if (tripleShotTrait != null && kt.Random.nextInt(100) < 30) {
                rawDamage += 16
                traitTriggerNote += if (isPlayer) {
                    `🎯 [${tripleShotTrait.name.toUpperCase()}!] Yaydan aynı anda fırlayan üç temren havayı yırtarak hedefin savunmasını delip geçti (+16 Yayılım Hasarı)!\n`
                } else {
                    `🎯 [${tripleShotTrait.name.toUpperCase()}!] ${attackerName}'in yayından aynı anda fırlayan üç temren ${defenderName}'in savunmasını delip geçti (+16 Yayılım Hasarı)!\n`
                }
            }

            // 11. Ok & Temren Özel Elemental ve Kuşatma Etkileri
            const arrowFireTrait = kt.firstOrNull(specialTraits, (it) => it.id.startsWith('trait_tash_arrow_fire_'))
            if (arrowFireTrait != null && kt.Random.nextInt(100) < 30) {
                rawDamage += 7
                traitTriggerNote += if (isPlayer) {
                    `🔥 [${arrowFireTrait.name.toUpperCase()}!] Okun ucundaki kor katran alev alarak hedefin zırhını dağladı (+7 Alev Hasarı)!\n`
                } else {
                    `🔥 [${arrowFireTrait.name.toUpperCase()}!] ${attackerName}'in alevli oku ${defenderName}'in zırhını dağladı (+7 Alev Hasarı)!\n`
                }
            }

            const arrowPoisonTrait = kt.firstOrNull(specialTraits, (it) => it.id.startsWith('trait_tash_arrow_poison_'))
            if (arrowPoisonTrait != null && kt.Random.nextInt(100) < 32) {
                rawDamage += 6
                traitTriggerNote += if (isPlayer) {
                    `🐍 [${arrowPoisonTrait.name.toUpperCase()}!] Temrenden sızan yılan zehri hedefin yaralarına işledi (+6 Zehir Hasarı)!\n`
                } else {
                    `🐍 [${arrowPoisonTrait.name.toUpperCase()}!] ${attackerName}'in zehirli temreni ${defenderName}'in damarlarına işledi (+6 Zehir Hasarı)!\n`
                }
            }

            const arrowSiegeTrait = kt.firstOrNull(specialTraits, (it) => it.id.startsWith('trait_tash_arrow_siege_'))
            if (arrowSiegeTrait != null && kt.Random.nextInt(100) < 25) {
                rawDamage += 10
                traitTriggerNote += if (isPlayer) {
                    `💣 [${arrowSiegeTrait.name.toUpperCase()}!] Ağır kuşatma cıvası kalkanı darmadağın ederek kemikleri sarstı (+10 Kuşatma Hasarı)!\n`
                } else {
                    `💣 [${arrowSiegeTrait.name.toUpperCase()}!] ${attackerName}'in ağır kuşatma cıvası ${defenderName}'in kalkanını sarsarak kemiklerini çatlattı (+10 Kuşatma Hasarı)!\n`
                }
            }
        }

        // Yetenek Topu: Ezici Balyoz
        if (isCrushingImpact) {
            rawDamage += 10.0
            traitTriggerNote += '💥 [EZİCİ BALYOZ!] Balyoz darbesi zırhı ezip hasmı sersemletti!\n'
        }

        // Aktif İksir / Merhem / Yağ Etkileri (Ofansif: Zehir, Ateş, Ayaz)
        if (isPlayer && playerBuffs.length > 0) {
            const maxPoisonChance = kt.maxOfOrNull(playerBuffs, (it) => it.poisonChancePercent) ?? 0
            const poisonDmg = kt.sumOf(playerBuffs.filter((it) => it.poisonChancePercent > 0), (it) => it.poisonDamagePerHit)
            if (maxPoisonChance > 0 && poisonDmg > 0 && kt.Random.nextInt(100) < maxPoisonChance) {
                rawDamage += poisonDmg
                const buffName = kt.firstOrNull(playerBuffs, (it) => it.poisonChancePercent > 0)?.name ?? 'Zehir Yağı'
                traitTriggerNote += `🧪 [${buffName.toUpperCase()}!] Silahındaki zehir hedefin yaralarına işledi (+${poisonDmg} Zehir Hasarı)!\n`
            }

            const maxFireChance = kt.maxOfOrNull(playerBuffs, (it) => it.fireChancePercent) ?? 0
            const fireDmg = kt.sumOf(playerBuffs.filter((it) => it.fireChancePercent > 0), (it) => it.fireDamagePerHit)
            if (maxFireChance > 0 && fireDmg > 0 && kt.Random.nextInt(100) < maxFireChance) {
                rawDamage += fireDmg
                const buffName = kt.firstOrNull(playerBuffs, (it) => it.fireChancePercent > 0)?.name ?? 'Alev Yağı'
                traitTriggerNote += `🔥 [${buffName.toUpperCase()}!] Silahından saçılan alevler rakibi dağladı (+${fireDmg} Ateş Hasarı)!\n`
            }

            const maxFrostChance = kt.maxOfOrNull(playerBuffs, (it) => it.frostChancePercent) ?? 0
            const frostDmg = kt.sumOf(playerBuffs.filter((it) => it.frostChancePercent > 0), (it) => it.frostDamagePerHit)
            if (maxFrostChance > 0 && frostDmg > 0 && kt.Random.nextInt(100) < maxFrostChance) {
                rawDamage += frostDmg
                const buffName = kt.firstOrNull(playerBuffs, (it) => it.frostChancePercent > 0)?.name ?? 'Ayaz Merhemi'
                traitTriggerNote += `❄️ [${buffName.toUpperCase()}!] Keskin ayaz hedefin uzuvlarını dondurdu (+${frostDmg} Buz Hasarı)!\n`
            }
        }

        // Zırh indirimi (Açık istismarında zırhın %85'i; Göktaşı harında zırhın %50'si delinir; Opal taşları ve Zırh Delen silahlar ekstra zırh deler)
        const armorPenTrait = findArmorPenTrait(specialTraits)
        const traitPenBonus = (armorPenTrait != null) ? 0.25 : 0.0
        if (armorPenTrait != null) {
            traitTriggerNote += `⚙️ [${armorPenTrait.name.toUpperCase()}!] Silahın delici ucu hasmın zırhını yararak geçti (+%25 Zırh Delme)!\n`
        }
        const penFactor = (1.0 - kt.coerceIn(((gemArmorPenPercent / 100.0) + traitPenBonus), 0.0, 0.88))
        const armorMitigation = when {
            isWeaknessExploited -> defenderStats.armor * 0.1
            isCrushingImpact -> 0.0
            isMeteorProc -> defenderStats.armor * 0.2
            else -> defenderStats.armor * 0.4
        } * penFactor
        let finalDamage = Math.max(if (isWeaknessExploited || isCrushingImpact) 4.0 else 1.0, rawDamage - armorMitigation)

        // Yetenek Topu: Demir İrade (Alınan hasarı %30 kırar)
        if (isIronWillActive) {
            finalDamage *= 0.70
            traitTriggerNote += '🛡️ [DEMİR İRADE!] Çelik iraden sayesinde darbenin şiddeti emildi!\n'
        }

        // Aktif Merhem / İksir Hasar İndirimi (Defansif)
        if (!isPlayer && playerBuffs.length > 0) {
            const totalMitigation = kt.coerceIn(kt.sumOf(playerBuffs, (it) => it.damageMitigationPercent), 0, 50)
            if (totalMitigation > 0) {
                finalDamage *= (1.0 - (totalMitigation / 100.0))
                const buffName = kt.firstOrNull(playerBuffs, (it) => it.damageMitigationPercent > 0)?.name ?? 'Koruyucu Merhem'
                traitTriggerNote += `🛡️ [${buffName.toUpperCase()}!] Bedenine sürdüğün merhem darbenin şiddetini hafifletti (-%${totalMitigation} Hasar)!\n`
            }
        }

        // Savunanın Koruyucu Bariyer / Hasar Sönümleme Nitelikleri
        const barrierTrait = findBarrierTrait(defenderSpecialTraits)
        if (barrierTrait != null) {
            finalDamage *= 0.78
            traitTriggerNote += if (isPlayer) {
                `🛡️ [${barrierTrait.name.toUpperCase()}!] Hasmın koruyucu aurası darbenin şiddetini emerek hafifletti (-%22 Hasar)!\n`
            } else {
                `🛡️ [${barrierTrait.name.toUpperCase()}!] Bedenini saran koruyucu bariyer darbenin şiddetini emerek hafifletti (-%22 Hasar)!\n`
            }
        }

        // Savunanın Son Direniş Nitelikleri (Azam Surları, Kebir Hükmü vb.)
        if (defenderHp <= (defenderMaxHp * 0.35)) {
            const lastStandTrait = findLastStandDefenseTrait(defenderSpecialTraits)
            if (lastStandTrait != null) {
                finalDamage *= 0.65
                traitTriggerNote += if (isPlayer) {
                    `🛡️ [${lastStandTrait.name.toUpperCase()}!] Hasmın sur gibi iradesi kritik anda darbenin hasarını kırdı (-%35 Hasar)!\n`
                } else {
                    `🛡️ [${lastStandTrait.name.toUpperCase()}!] Çelik sur iraden kritik anda gelen darbenin hasarını kırdı (-%35 Hasar)!\n`
                }
            }
        }

        // İnfaz / Bitirici Vuruş (Düşmanın canı %30 ve altına indiğinde ölümcül darbe)
        if (defenderHp <= (defenderMaxHp * 0.30)) {
            const execTrait = findExecutionTrait(specialTraits)
            if (execTrait != null) {
                finalDamage *= 1.25
                traitTriggerNote += if (isPlayer) {
                    `☠️ [${execTrait.name.toUpperCase()}!] Hasmın tükenen canını gören darben ölümcül bir infaza dönüştü (+%25 İnfaz Hasarı)!\n`
                } else {
                    `☠️ [${execTrait.name.toUpperCase()}!] ${attackerName} tükenen canını fırsat bilip ölümcül bir infaz darbesi vurdu (+%25 İnfaz Hasarı)!\n`
                }
            }
        }

        const critAmpTrait = findCritAmpTrait(specialTraits)
        const event = when {
            isCrit -> {
                const critMultiplier = (critAmpTrait != null) ? 2.2 : 1.8
                finalDamage *= critMultiplier
                if (critAmpTrait != null) {
                    traitTriggerNote += `💥 [${critAmpTrait.name.toUpperCase()}!] Kritik darbenin yıkıcı şiddeti katlandı!\n`
                }
                CombatEvent.CRITICAL
            }
            isBlock -> {
                finalDamage *= 0.4
                CombatEvent.BLOCKED
            }
            else -> CombatEvent.HIT
        }

        const damageInt = Math.round(finalDamage)
        const remainingHp = Math.max(0, defenderHp - damageInt)

        if (isWolfRageActive) {
            lifestealAmount += Math.max(1, Math.round((damageInt * 0.12)))
            traitTriggerNote += `${TextTemplateEngine.generateWolfRageNarrative(lifestealAmount)}\n`
        }

        // Egzotik Silah / Asa Can Çalma (Lifesteal)
        if (damageInt > 0) {
            const lifestealTrait = findLifestealTrait(specialTraits)
            if (lifestealTrait != null) {
                const traitHeal = Math.max(2, Math.round((damageInt * 0.14)))
                lifestealAmount += traitHeal
                traitTriggerNote += if (isPlayer) {
                    `🩸 [${lifestealTrait.name.toUpperCase()}!] Hasmın kanından ve ruhundan güç çektin (+${traitHeal} Can)!\n`
                } else {
                    `🩸 [${lifestealTrait.name.toUpperCase()}!] ${attackerName}, ${defenderName}'in kanından güç emerek yaralarını tazeledi (+${traitHeal} Can)!\n`
                }
            }
        }

        // Aktif Merhem Can Çalma (Lifesteal)
        const buffLifestealPercent = (isPlayer) ? kt.sumOf(playerBuffs, (it) => it.lifestealPercent) : 0
        if (buffLifestealPercent > 0 && damageInt > 0) {
            const buffHeal = Math.max(1, Math.round((damageInt * (buffLifestealPercent / 100.0))))
            lifestealAmount += buffHeal
            const buffName = kt.firstOrNull(playerBuffs, (it) => it.lifestealPercent > 0)?.name ?? 'Vampirik Merhem'
            traitTriggerNote += `🩸 [${buffName.toUpperCase()}!] Darbenin akıttığı kanla canını tazeledin (+${buffHeal} Can)!\n`
        }

        if (gemLifestealPercent > 0 && damageInt > 0) {
            const gemHeal = Math.max(1, Math.round((damageInt * (gemLifestealPercent / 100.0))))
            lifestealAmount += gemHeal
            traitTriggerNote += `🟣 [AMETİST CAN ÇALMA!] Darbenin enerjisi yaralarını sağalttı (+${gemHeal} Can)!\n`
        }

        if (isMeteorProc) {
            traitTriggerNote += `${TextTemplateEngine.generateMeteorBurnNarrative(bonusFireDmg)}\n`
        }

        // Savunanın Diken / Hasar Yansıtma Nitelikleri
        let reflectedAmount = 0
        if (damageInt > 0) {
            const reflectionTrait = findReflectionTrait(defenderSpecialTraits)
            if (reflectionTrait != null) {
                const baseReflect = Math.max(3, Math.round((damageInt * 0.25)))
                const staticBonus = (reflectionTrait.id === 'trait_tash_ha_21' || reflectionTrait.name.toLowerCase().includes('statik')) ? 3 : 0
                reflectedAmount = baseReflect + staticBonus
                const reflectNarrative = TextTemplateEngine.generateReflectionNarrative(attackerName, defenderName, reflectionTrait, reflectedAmount, weapon, isPlayer)
                traitTriggerNote += `${reflectNarrative}\n`
            }
        }

        // Saldıranın Ağır Kanama Nitelikleri veya Yetenekleri
        let appliedBleed = false
        if (damageInt > 0) {
            const bleedTrait = findBleedTrait(specialTraits)
            if ((bleedTrait != null && kt.Random.nextInt(100) < 40) || skillAppliedBleed) {
                appliedBleed = true
                const bleedLabel = bleedTrait?.name?.toUpperCase() ?? (triggeredSkill?.name?.toUpperCase() ?? 'AĞIR KANAMA')
                traitTriggerNote += if (isPlayer) {
                    `🩸 [${bleedLabel}!] Açılan derin yara hedefin oluk oluk kan kaybetmesine yol açtı!\n`
                } else {
                    `🩸 [${bleedLabel}!] ${attackerName}'in darbesi ${defenderName}'de derin bir kanama başlattı!\n`
                }
            }
        }

        const appliedStun = (isPlayer && isCrushingImpact) || hasExoticStun || skillAppliedStun || (gemStunPercent > 0 && kt.Random.nextInt(100) < gemStunPercent)
        if (skillAppliedStun) {
            traitTriggerNote += `💫 [${triggeredSkill?.name?.toUpperCase() ?? 'AFALLATMA'}!] Hedef darbenin şiddetiyle sarsılarak sersemledi!\n`
        } else if (appliedStun && !isCrushingImpact && !hasExoticStun) {
            traitTriggerNote += if (isPlayer) {
                '⚫ [OBSİDYEN SARSINTISI!] Rakip darbenin şokuyla sersemledi!\n'
            } else {
                `⚫ [OBSİDYEN SARSINTISI!] ${defenderName} darbenin şokuyla sersemledi!\n`
            }
        }

        const slowTrait = findSlowDebuffTrait(specialTraits)
        if (slowTrait != null && damageInt > 0) {
            traitTriggerNote += if (isPlayer) {
                `❄️ [${slowTrait.name.toUpperCase()}!] Çengelli ve dondurucu darbe hasmın adımlarını ve reflekslerini yavaşlattı!\n`
            } else {
                `❄️ [${slowTrait.name.toUpperCase()}!] ${attackerName}'in dondurucu darbesi ${defenderName}'in adımlarını ve reflekslerini yavaşlattı!\n`
            }
        }

        const resolvedPosition = if (tacticalPosition != null && tacticalPosition !== CombatTacticalPosition.NEUTRAL) {
            tacticalPosition
        } else when {
            isWeaknessExploited -> CombatTacticalPosition.ADVANTAGE
            defenderHp < (defenderMaxHp * 0.25) -> CombatTacticalPosition.ADVANTAGE
            attackerHp < (attackerMaxHp * 0.25) -> CombatTacticalPosition.DESPERATION
            else -> CombatTacticalPosition.NEUTRAL
        }

        const baseNarrative = if (triggeredSkill != null) {
            when (event) {
                CombatEvent.CRITICAL, CombatEvent.HIT -> TextTemplateEngine.generateSkillHitNarrative(attackerName, defenderName, triggeredSkill, event, damageInt, bodyPart, stance, resolvedPosition, weapon)
                CombatEvent.BLOCKED -> TextTemplateEngine.generateSkillBlockNarrative(attackerName, defenderName, triggeredSkill, weapon) + ` (-${damageInt} Can)`
                CombatEvent.DODGED -> TextTemplateEngine.generateSkillDodgeNarrative(attackerName, defenderName, triggeredSkill, weapon)
                else -> TextTemplateEngine.generateDetailedLog(attackerName, defenderName, weapon, event, bodyPart, damageInt, remainingHp, stance, resolvedPosition)
            }
        } else {
            TextTemplateEngine.generateDetailedLog(attackerName, defenderName, weapon, event, bodyPart, damageInt, remainingHp, stance, resolvedPosition)
        }

        let narrative = if (isWeaknessExploited && knownWeakness != null) {
            `💡 [AÇIK İSTİSMARI!] ${knownWeakness.combatExploitPhrase}\n${baseNarrative}`
        } else {
            baseNarrative
        }

        if (traitTriggerNote.length > 0) {
            narrative = `${traitTriggerNote}${narrative}`
        }

        const log = new CombatLog({
            round: round,
            narrativeText: narrative,
            attackerName: attackerName,
            defenderName: defenderName,
            event: event,
            damage: damageInt,
            defenderHpLeft: remainingHp,
            defenderMaxHp: defenderMaxHp,
            isPlayerAttacker: isPlayer
        })

        return new StrikeOutcome({
            damageDealt: damageInt,
            remainingHp: remainingHp,
            log: log,
            lifestealHp: lifestealAmount,
            appliedStun: appliedStun,
            reflectedDamage: reflectedAmount,
            appliedBleed: appliedBleed
        })
    }

    // Fast simulation for background NPC vs NPC matches in the league
    function simulateNpcVsNpcMatch(fighter1, fighter2) {
        const f1Stats = fighter1.totalStats
        const f2Stats = fighter2.totalStats
        let hp1 = f1Stats.maxHealth
        let hp2 = f2Stats.maxHealth
        let rounds = 0

        while (hp1 > 0 && hp2 > 0 && rounds < 35) {
            const dmg1 = Math.max(1, f1Stats.damage - (f2Stats.armor / 2))
            hp2 -= dmg1

            const dmg2 = Math.max(1, f2Stats.damage - (f1Stats.armor / 2))
            hp1 -= dmg2
            rounds++

            if (hp1 <= 0 || hp2 <= 0) break
        }

        // Çifte nakavt veya kilitlenme beraberlik kontrolü
        const isDraw = (hp1 <= 0 && hp2 <= 0) || (rounds >= 35 && Math.abs(hp1 - hp2) <= 15) || (kt.Random.nextInt(100) < 14)

        const winner = if (isDraw) {
            null
        } else {
            when {
                hp2 <= 0 && hp1 > 0 -> fighter1.name
                hp1 <= 0 && hp2 > 0 -> fighter2.name
                hp1 > hp2 -> fighter1.name
                else -> fighter2.name
            }
        }

        const summary = if (winner != null) {
            `${winner} nakavt ile kazandı (${rounds} raunt) (+3 Puan)`
        } else {
            `Mücadele Çifte Nakavt ile Berabere Bitti (${rounds} raunt) (+1'er Puan)`
        }

        const narrative = if (winner == null) {
            const situation = (rounds >= 30) ? DrawSituation.MUTUAL_EXHAUSTION : DrawSituation.DOUBLE_KNOCKOUT
            TextTemplateEngine.generateDrawNarrative(fighter1.name, fighter1.weaponName, fighter2.name, fighter2.weaponName, situation)
        } else if (winner === fighter1.name) {
            `${fighter1.name}, ${fighter1.weaponName} ile ${fighter2.name}'i dize getirip lig puanını kopardı!`
        } else {
            `${fighter2.name}, ${fighter2.weaponName} ile ${fighter1.name}'in gardını düşürerek zaferi aldı!`
        }

        return new LeagueMatchResult({
            fighter1Name: fighter1.name,
            fighter2Name: fighter2.name,
            winnerName: winner,
            scoreSummary: summary,
            narrativeSnippet: narrative
        })
    }

    function simulateDetailedNpcBattle(fighter1, fighter2, selectedFighterName, betAmount) {
        const f1Stats = fighter1.totalStats
        const f2Stats = fighter2.totalStats

        let hp1 = f1Stats.maxHealth
        let hp2 = f2Stats.maxHealth

        const f1Traits = fighter1.specialTraits
        const f2Traits = fighter2.specialTraits
        const f1Lifesteal = fighter1.lifestealPercent
        const f2Lifesteal = fighter2.lifestealPercent
        const f1ArmorPen = fighter1.armorPenPercent
        const f2ArmorPen = fighter2.armorPenPercent
        const f1Stun = fighter1.stunChancePercent
        const f2Stun = fighter2.stunChancePercent

        let f1IsStunned = false
        let f2IsStunned = false
        let f1BleedTurns = 0
        let f2BleedTurns = 0
        let f1HasRevived = false
        let f2HasRevived = false

        const logs = []
        let round = 1
        const bodyParts = TargetBodyPart.values()

        const cooldowns1 = {}
        const cooldowns2 = {}

        while (hp1 > 0 && hp2 > 0) {
            decrementCooldowns(cooldowns1)
            decrementCooldowns(cooldowns2)

            // Tur Başı Can Yenilenmesi (Regeneration)
            if (hasRegenerationTrait(f1Traits) && hp1 > 0 && hp1 < f1Stats.maxHealth) {
                const r1 = Math.max(3, Math.round((f1Stats.maxHealth * 0.05)))
                hp1 = kt.coerceAtMost((hp1 + r1), f1Stats.maxHealth)
                logs.push(
                    new CombatLog({
                        round: round,
                        narrativeText: `🌿 [YAŞAM CANLILIĞI!] Büyülü zırh ${fighter1.name}'in yaralarını tazeledi (+${r1} Can)!`,
                        attackerName: fighter1.name,
                        defenderName: fighter2.name,
                        event: CombatEvent.HIT,
                        damage: 0,
                        defenderHpLeft: hp1,
                        defenderMaxHp: f1Stats.maxHealth,
                        isPlayerAttacker: false
                    })
                )
            }
            if (hasRegenerationTrait(f2Traits) && hp2 > 0 && hp2 < f2Stats.maxHealth) {
                const r2 = Math.max(3, Math.round((f2Stats.maxHealth * 0.05)))
                hp2 = kt.coerceAtMost((hp2 + r2), f2Stats.maxHealth)
                logs.push(
                    new CombatLog({
                        round: round,
                        narrativeText: `🌿 [YAŞAM CANLILIĞI!] Büyülü zırh ${fighter2.name}'in yaralarını tazeledi (+${r2} Can)!`,
                        attackerName: fighter2.name,
                        defenderName: fighter1.name,
                        event: CombatEvent.HIT,
                        damage: 0,
                        defenderHpLeft: hp2,
                        defenderMaxHp: f2Stats.maxHealth,
                        isPlayerAttacker: false
                    })
                )
            }

            // Tur Başı Ağır Kanama Hasarları (Bleed DoT)
            if (f1BleedTurns > 0 && hp1 > 0) {
                const bDmg = 8
                hp1 = Math.max(1, hp1 - bDmg)
                f1BleedTurns--
                logs.push(
                    new CombatLog({
                        round: round,
                        narrativeText: `🩸 [KAN KAYBI!] ${fighter1.name} derin yarasından sızan kan yüzünden ${bDmg} can kaybetti!`,
                        attackerName: fighter2.name,
                        defenderName: fighter1.name,
                        event: CombatEvent.HIT,
                        damage: bDmg,
                        defenderHpLeft: hp1,
                        defenderMaxHp: f1Stats.maxHealth,
                        isPlayerAttacker: false
                    })
                )
            }
            if (f2BleedTurns > 0 && hp2 > 0) {
                const bDmg = 8
                hp2 = Math.max(1, hp2 - bDmg)
                f2BleedTurns--
                logs.push(
                    new CombatLog({
                        round: round,
                        narrativeText: `🩸 [KAN KAYBI!] ${fighter2.name} derin yarasından sızan kan yüzünden ${bDmg} can kaybetti!`,
                        attackerName: fighter1.name,
                        defenderName: fighter2.name,
                        event: CombatEvent.HIT,
                        damage: bDmg,
                        defenderHpLeft: hp2,
                        defenderMaxHp: f2Stats.maxHealth,
                        isPlayerAttacker: false
                    })
                )
            }

            const stance1 = decideAiStance(hp1, f1Stats.maxHealth, hp2, f2Stats.maxHealth)
            const stance2 = decideAiStance(hp2, f2Stats.maxHealth, hp1, f1Stats.maxHealth)

            const f1First = (f1Stats.speed === f2Stats.speed) ? kt.Random.nextBoolean() : f1Stats.speed > f2Stats.speed

            const skill1 = selectAiSkill(fighter1.skills, cooldowns1, hp1, f1Stats.maxHealth)
            const skill2 = selectAiSkill(fighter2.skills, cooldowns2, hp2, f2Stats.maxHealth)

            if (f1First) {
                if (f1IsStunned) {
                    f1IsStunned = false
                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: `💫 ${fighter1.name} sersemliğin etkisiyle toparlanamadı, hamle yapamadı!`,
                            attackerName: fighter1.name,
                            defenderName: fighter2.name,
                            event: CombatEvent.HIT,
                            damage: 0,
                            defenderHpLeft: hp2,
                            defenderMaxHp: f2Stats.maxHealth,
                            isPlayerAttacker: false
                        })
                    )
                } else {
                    const hitOutcome = executeStrike({
                        attackerName: fighter1.name,
                        defenderName: fighter2.name,
                        weapon: fighter1.weaponName,
                        attackerStats: f1Stats,
                        defenderStats: f2Stats,
                        defenderHp: hp2,
                        defenderMaxHp: f2Stats.maxHealth,
                        round: round,
                        isPlayer: false,
                        bodyPart: bodyParts[kt.Random.nextInt(bodyParts.length)],
                        stance: stance1,
                        specialTraits: f1Traits,
                        defenderSpecialTraits: f2Traits,
                        attackerHp: hp1,
                        attackerMaxHp: f1Stats.maxHealth,
                        gemLifestealPercent: f1Lifesteal,
                        gemArmorPenPercent: f1ArmorPen,
                        gemStunPercent: f1Stun,
                        triggeredSkill: skill1
                    })
                    logs.push(hitOutcome.log)
                    hp2 = hitOutcome.remainingHp
                    if (hitOutcome.lifestealHp > 0) {
                        hp1 = kt.coerceAtMost((hp1 + hitOutcome.lifestealHp), f1Stats.maxHealth)
                    }
                    if (hitOutcome.appliedStun) {
                        f2IsStunned = true
                    }
                    if (hitOutcome.appliedBleed) {
                        f2BleedTurns = 3
                    }
                    if (hitOutcome.reflectedDamage > 0) {
                        hp1 = Math.max(0, hp1 - hitOutcome.reflectedDamage)
                    }
                    if (hp2 <= 0 && !f2HasRevived && hasResurrectionTrait(f2Traits)) {
                        f2HasRevived = true
                        const reviveHp = Math.max(15, Math.round((f2Stats.maxHealth * 0.35)))
                        hp2 = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${fighter2.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                attackerName: fighter2.name,
                                defenderName: fighter1.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: hp2,
                                defenderMaxHp: f2Stats.maxHealth,
                                isPlayerAttacker: false
                            })
                        )
                    }
                    if (hp1 <= 0 && !f1HasRevived && hasResurrectionTrait(f1Traits)) {
                        f1HasRevived = true
                        const reviveHp = Math.max(15, Math.round((f1Stats.maxHealth * 0.35)))
                        hp1 = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${fighter1.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                attackerName: fighter1.name,
                                defenderName: fighter2.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: hp1,
                                defenderMaxHp: f1Stats.maxHealth,
                                isPlayerAttacker: false
                            })
                        )
                    }
                }

                const allowDesperationCounter = hp2 <= 0 && (hp1 <= 16 || kt.Random.nextInt(100) < 22)
                if (hp2 <= 0 && !allowDesperationCounter) break

                if (f2IsStunned) {
                    f2IsStunned = false
                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: `💫 ${fighter2.name} aldığı darbenin sersemliğiyle sarsıldı, karşı hamle yapamadı!`,
                            attackerName: fighter2.name,
                            defenderName: fighter1.name,
                            event: CombatEvent.HIT,
                            damage: 0,
                            defenderHpLeft: hp1,
                            defenderMaxHp: f1Stats.maxHealth,
                            isPlayerAttacker: false
                        })
                    )
                } else {
                    const counterOutcome = executeStrike({
                        attackerName: fighter2.name,
                        defenderName: fighter1.name,
                        weapon: fighter2.weaponName,
                        attackerStats: f2Stats,
                        defenderStats: f1Stats,
                        defenderHp: hp1,
                        defenderMaxHp: f1Stats.maxHealth,
                        round: round,
                        isPlayer: false,
                        bodyPart: bodyParts[kt.Random.nextInt(bodyParts.length)],
                        stance: (hp2 <= 0) ? CombatStance.AGGRESSIVE : stance2,
                        tacticalPosition: (hp2 <= 0) ? CombatTacticalPosition.DESPERATION : CombatTacticalPosition.NEUTRAL,
                        specialTraits: f2Traits,
                        defenderSpecialTraits: f1Traits,
                        attackerHp: hp2,
                        attackerMaxHp: f2Stats.maxHealth,
                        gemLifestealPercent: f2Lifesteal,
                        gemArmorPenPercent: f2ArmorPen,
                        gemStunPercent: f2Stun,
                        triggeredSkill: skill2
                    })
                    logs.push(counterOutcome.log)
                    hp1 = counterOutcome.remainingHp
                    if (counterOutcome.lifestealHp > 0) {
                        hp2 = kt.coerceAtMost((hp2 + counterOutcome.lifestealHp), f2Stats.maxHealth)
                    }
                    if (counterOutcome.appliedStun) {
                        f1IsStunned = true
                    }
                    if (counterOutcome.appliedBleed) {
                        f1BleedTurns = 3
                    }
                    if (counterOutcome.reflectedDamage > 0) {
                        hp2 = Math.max(0, hp2 - counterOutcome.reflectedDamage)
                    }
                    if (hp1 <= 0 && !f1HasRevived && hasResurrectionTrait(f1Traits)) {
                        f1HasRevived = true
                        const reviveHp = Math.max(15, Math.round((f1Stats.maxHealth * 0.35)))
                        hp1 = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${fighter1.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                attackerName: fighter1.name,
                                defenderName: fighter2.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: hp1,
                                defenderMaxHp: f1Stats.maxHealth,
                                isPlayerAttacker: false
                            })
                        )
                    }
                    if (hp2 <= 0 && !f2HasRevived && hasResurrectionTrait(f2Traits)) {
                        f2HasRevived = true
                        const reviveHp = Math.max(15, Math.round((f2Stats.maxHealth * 0.35)))
                        hp2 = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${fighter2.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                attackerName: fighter2.name,
                                defenderName: fighter1.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: hp2,
                                defenderMaxHp: f2Stats.maxHealth,
                                isPlayerAttacker: false
                            })
                        )
                    }
                }

                if (hp2 <= 0 || hp1 <= 0) break
            } else {
                if (f2IsStunned) {
                    f2IsStunned = false
                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: `💫 ${fighter2.name} sersemliğin etkisiyle gardını toparlayamadı, hamle yapamadı!`,
                            attackerName: fighter2.name,
                            defenderName: fighter1.name,
                            event: CombatEvent.HIT,
                            damage: 0,
                            defenderHpLeft: hp1,
                            defenderMaxHp: f1Stats.maxHealth,
                            isPlayerAttacker: false
                        })
                    )
                } else {
                    const hitOutcome = executeStrike({
                        attackerName: fighter2.name,
                        defenderName: fighter1.name,
                        weapon: fighter2.weaponName,
                        attackerStats: f2Stats,
                        defenderStats: f1Stats,
                        defenderHp: hp1,
                        defenderMaxHp: f1Stats.maxHealth,
                        round: round,
                        isPlayer: false,
                        bodyPart: bodyParts[kt.Random.nextInt(bodyParts.length)],
                        stance: stance2,
                        specialTraits: f2Traits,
                        defenderSpecialTraits: f1Traits,
                        attackerHp: hp2,
                        attackerMaxHp: f2Stats.maxHealth,
                        gemLifestealPercent: f2Lifesteal,
                        gemArmorPenPercent: f2ArmorPen,
                        gemStunPercent: f2Stun,
                        triggeredSkill: skill2
                    })
                    logs.push(hitOutcome.log)
                    hp1 = hitOutcome.remainingHp
                    if (hitOutcome.lifestealHp > 0) {
                        hp2 = kt.coerceAtMost((hp2 + hitOutcome.lifestealHp), f2Stats.maxHealth)
                    }
                    if (hitOutcome.appliedStun) {
                        f1IsStunned = true
                    }
                    if (hitOutcome.appliedBleed) {
                        f1BleedTurns = 3
                    }
                    if (hitOutcome.reflectedDamage > 0) {
                        hp2 = Math.max(0, hp2 - hitOutcome.reflectedDamage)
                    }
                    if (hp1 <= 0 && !f1HasRevived && hasResurrectionTrait(f1Traits)) {
                        f1HasRevived = true
                        const reviveHp = Math.max(15, Math.round((f1Stats.maxHealth * 0.35)))
                        hp1 = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${fighter1.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                attackerName: fighter1.name,
                                defenderName: fighter2.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: hp1,
                                defenderMaxHp: f1Stats.maxHealth,
                                isPlayerAttacker: false
                            })
                        )
                    }
                    if (hp2 <= 0 && !f2HasRevived && hasResurrectionTrait(f2Traits)) {
                        f2HasRevived = true
                        const reviveHp = Math.max(15, Math.round((f2Stats.maxHealth * 0.35)))
                        hp2 = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${fighter2.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                attackerName: fighter2.name,
                                defenderName: fighter1.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: hp2,
                                defenderMaxHp: f2Stats.maxHealth,
                                isPlayerAttacker: false
                            })
                        )
                    }
                }

                const allowDesperationCounter = hp1 <= 0 && (hp2 <= 16 || kt.Random.nextInt(100) < 22)
                if (hp1 <= 0 && !allowDesperationCounter) break

                if (f1IsStunned) {
                    f1IsStunned = false
                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: `💫 ${fighter1.name} sersemliğin etkisiyle toparlanamadı, karşı hamle yapamadı!`,
                            attackerName: fighter1.name,
                            defenderName: fighter2.name,
                            event: CombatEvent.HIT,
                            damage: 0,
                            defenderHpLeft: hp2,
                            defenderMaxHp: f2Stats.maxHealth,
                            isPlayerAttacker: false
                        })
                    )
                } else {
                    const counterOutcome = executeStrike({
                        attackerName: fighter1.name,
                        defenderName: fighter2.name,
                        weapon: fighter1.weaponName,
                        attackerStats: f1Stats,
                        defenderStats: f2Stats,
                        defenderHp: hp2,
                        defenderMaxHp: f2Stats.maxHealth,
                        round: round,
                        isPlayer: false,
                        bodyPart: bodyParts[kt.Random.nextInt(bodyParts.length)],
                        stance: (hp1 <= 0) ? CombatStance.AGGRESSIVE : stance1,
                        tacticalPosition: (hp1 <= 0) ? CombatTacticalPosition.DESPERATION : CombatTacticalPosition.NEUTRAL,
                        specialTraits: f1Traits,
                        defenderSpecialTraits: f2Traits,
                        attackerHp: hp1,
                        attackerMaxHp: f1Stats.maxHealth,
                        gemLifestealPercent: f1Lifesteal,
                        gemArmorPenPercent: f1ArmorPen,
                        gemStunPercent: f1Stun,
                        triggeredSkill: skill1
                    })
                    logs.push(counterOutcome.log)
                    hp2 = counterOutcome.remainingHp
                    if (counterOutcome.lifestealHp > 0) {
                        hp1 = kt.coerceAtMost((hp1 + counterOutcome.lifestealHp), f1Stats.maxHealth)
                    }
                    if (counterOutcome.appliedStun) {
                        f2IsStunned = true
                    }
                    if (counterOutcome.appliedBleed) {
                        f2BleedTurns = 3
                    }
                    if (counterOutcome.reflectedDamage > 0) {
                        hp1 = Math.max(0, hp1 - counterOutcome.reflectedDamage)
                    }
                    if (hp2 <= 0 && !f2HasRevived && hasResurrectionTrait(f2Traits)) {
                        f2HasRevived = true
                        const reviveHp = Math.max(15, Math.round((f2Stats.maxHealth * 0.35)))
                        hp2 = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${fighter2.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                attackerName: fighter2.name,
                                defenderName: fighter1.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: hp2,
                                defenderMaxHp: f2Stats.maxHealth,
                                isPlayerAttacker: false
                            })
                        )
                    }
                    if (hp1 <= 0 && !f1HasRevived && hasResurrectionTrait(f1Traits)) {
                        f1HasRevived = true
                        const reviveHp = Math.max(15, Math.round((f1Stats.maxHealth * 0.35)))
                        hp1 = reviveHp
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: `🔥 [KADİM DİRİLİŞ!] ${fighter1.name} kadim zırhının anka alevleriyle ölümden uyandı! (+${reviveHp} Can)`,
                                attackerName: fighter1.name,
                                defenderName: fighter2.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: hp1,
                                defenderMaxHp: f1Stats.maxHealth,
                                isPlayerAttacker: false
                            })
                        )
                    }
                }

                if (hp1 <= 0 || hp2 <= 0) break
            }

            round++
            if (round > 45) {
                logs.push(
                    new CombatLog({
                        round: round,
                        narrativeText: TextTemplateEngine.generateDrawNarrative(fighter1.name, fighter1.weaponName, fighter2.name, fighter2.weaponName, DrawSituation.MUTUAL_EXHAUSTION),
                        attackerName: fighter1.name,
                        defenderName: fighter2.name,
                        event: CombatEvent.DRAW,
                        damage: 0,
                        defenderHpLeft: Math.max(0, hp2),
                        defenderMaxHp: f2Stats.maxHealth,
                        isPlayerAttacker: false
                    })
                )
                break
            }
        }

        const isDraw = (hp1 <= 0 && hp2 <= 0) || round > 45
        const winnerName = (isDraw) ? null : (hp1 > 0) ? fighter1.name : fighter2.name

        // Final result log
        if (isDraw) {
            logs.push(
                new CombatLog({
                    round: round,
                    narrativeText: TextTemplateEngine.generateDrawNarrative(fighter1.name, fighter1.weaponName, fighter2.name, fighter2.weaponName, DrawSituation.DOUBLE_KNOCKOUT),
                    attackerName: fighter1.name,
                    defenderName: fighter2.name,
                    event: CombatEvent.DRAW,
                    damage: 0,
                    defenderHpLeft: 0,
                    defenderMaxHp: f2Stats.maxHealth,
                    isPlayerAttacker: false
                })
            )
        } else if (winnerName === fighter1.name) {
            logs.push(
                new CombatLog({
                    round: round,
                    narrativeText: `${fighter1.name} son ölümcül vuruşuyla ${fighter2.name}'i kumlara serdi ve tribünleri ayağa kaldırdı!`,
                    attackerName: fighter1.name,
                    defenderName: fighter2.name,
                    event: CombatEvent.DEFEAT,
                    damage: 0,
                    defenderHpLeft: 0,
                    defenderMaxHp: f2Stats.maxHealth,
                    isPlayerAttacker: false
                })
            )
        } else {
            logs.push(
                new CombatLog({
                    round: round,
                    narrativeText: `${fighter2.name} son ölümcül vuruşuyla ${fighter1.name}'in gardını düşürüp kumlara serdi!`,
                    attackerName: fighter2.name,
                    defenderName: fighter1.name,
                    event: CombatEvent.DEFEAT,
                    damage: 0,
                    defenderHpLeft: 0,
                    defenderMaxHp: f1Stats.maxHealth,
                    isPlayerAttacker: false
                })
            )
        }

        const betWon = (winnerName != null && winnerName === selectedFighterName)
        const betWinnings = (betWon) ? kt.toInt((betAmount * 2.0)) : 0

        return new SpectatorCombatResult({
            fighter1: fighter1,
            fighter2: fighter2,
            selectedFighterName: selectedFighterName,
            betAmount: betAmount,
            winnerName: winnerName,
            isDraw: isDraw,
            logs: logs,
            betWon: betWon,
            betWinnings: betWinnings
        })
    }
}
