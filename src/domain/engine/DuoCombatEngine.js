// DuoCombatEngine.kt'den taşındı (birebir). 2v2 İttifak muharebesi.
import * as kt from '../../kt.js';
import {
  BattlefieldCondition,
  CombatEvent,
  CombatLog,
  DuoCombatResult,
  DuoDiscordType,
  DuoMatchState,
  DuoSynergyType,
  DuoTeam,
  Equipment,
  EquipmentSlot,
  EquipmentSpecialTrait,
  Gem,
  GemType,
  GladiatorSkill,
  PersonalityArchetype,
  SkillType,
  Stats,
} from '../model.js';
import { CombatEngine } from './CombatEngine.js';
import { DuoCombatNarratives } from './DuoCombatNarratives.js';

/** DuoCombatEngine.DuoFighterState (iç data class; var alanlar doğrudan değiştirilir) */
export class DuoFighterState extends kt.Data {
    static T = 'DuoCombatEngine.DuoFighterState';
    static defaults() {
        return {
            id: undefined,
            name: undefined,
            title: undefined,
            isPlayer: undefined,
            team: undefined,
            maxHp: undefined,
            currentHp: undefined,
            stats: undefined,
            weaponName: undefined,
            weaponType: undefined,
            archetype: undefined,
            skills: undefined,
            specialTraits: [],
            lifestealPercent: 0,
            armorPenPercent: 0,
            stunChancePercent: 0,
            isStunned: false,
            bleedTurns: 0,
            cooldowns: {},
            guardBrokenTurns: 0,
            temporaryArmor: 0,
        };
    }
    get isAlive() {
        return this.currentHp > 0
    }
}
kt.Data.register(DuoFighterState);

/** GladiatorSkill(id, name, icon, type, tier, cooldownTurns, description, combatEffect) konumsal yapıcı */
function gs(id, name, icon, type, tier, cooldownTurns, description, combatEffect) {
    return new GladiatorSkill({ id, name, icon, type, tier, cooldownTurns, description, combatEffect })
}

    /**
     * İki yoldaş arasındaki nitelik, silah ve mizaç uyumunu ve sürtüşme potansiyelini hesaplar.
     */
    function evaluateTeamDynamics(f1, f2, condition) {
        // 1. Harmoni / Sinerji Tespiti
        const isF1Tank = f1.stats.armor >= 18 || f1.stats.blockChancePercent >= 20 || f1.skills.some((it) => it.type === SkillType.DEFENSE)
        const isF2Tank = f2.stats.armor >= 18 || f2.stats.blockChancePercent >= 20 || f2.skills.some((it) => it.type === SkillType.DEFENSE)
        const isF1Striker = f1.stats.damage >= 30 || f1.stats.critChancePercent >= 14 || ['hançer', 'bıçak', 'kılıç', 'yay'].includes(f1.weaponType)
        const isF2Striker = f2.stats.damage >= 30 || f2.stats.critChancePercent >= 14 || ['hançer', 'bıçak', 'kılıç', 'yay'].includes(f2.weaponType)
        const isF1Speedster = f1.stats.speed >= 16 || f1.stats.dodgeChancePercent >= 16
        const isF2Speedster = f2.stats.speed >= 16 || f2.stats.dodgeChancePercent >= 16

        let synergyType
        if ((isF1Tank && isF2Striker) || (isF2Tank && isF1Striker)) synergyType = DuoSynergyType.TANK_AND_STRIKER
        else if (isF1Speedster && isF2Speedster) synergyType = DuoSynergyType.TWIN_SHADOWS
        else if (isF1Tank && isF2Tank) synergyType = DuoSynergyType.IRON_PHALANX
        else if (['asa', 'büyü', 'tome'].includes(f1.weaponType) || ['asa', 'büyü', 'tome'].includes(f2.weaponType)) synergyType = DuoSynergyType.SPELL_AND_STEEL
        else if (f1.stunChancePercent > 0 || f2.stunChancePercent > 0 || f1.archetype === PersonalityArchetype.KURNAZ || f2.archetype === PersonalityArchetype.KURNAZ) synergyType = DuoSynergyType.TACTICAL_DISRUPTOR
        else synergyType = DuoSynergyType.BALANCED_COHESION

        // 2. Sürtüşme / Uyumsuzluk Tespiti
        const isBothBerserk = f1.archetype === PersonalityArchetype.VAHSI && f2.archetype === PersonalityArchetype.VAHSI
        const speedDiff = Math.abs(f1.stats.speed - f2.stats.speed)
        const isBothGreedy = (f1.archetype === PersonalityArchetype.HIRSLI || f1.archetype === PersonalityArchetype.GURURLU) &&
                (f2.archetype === PersonalityArchetype.HIRSLI || f2.archetype === PersonalityArchetype.GURURLU)

        let discordType
        if (isBothBerserk) discordType = DuoDiscordType.RECKLESS_BERSERK
        else if (speedDiff >= 7) discordType = DuoDiscordType.SPEED_GAP
        else if (condition.id === 'narrow_pass' && (f1.stats.damage >= 35 && f2.stats.damage >= 35)) discordType = DuoDiscordType.CROWDED_CHAOS
        else if (isBothGreedy) discordType = DuoDiscordType.GREEDY_RIVALRY
        else discordType = DuoDiscordType.NONE

        return [synergyType, discordType]
    }

    /**
     * Dövüşçüye ileride dükkanlardan (Demirci, Zırhçı, Terzi, Sarraf vb.) alabileceği
     * potansiyel ekipmanları giydirerek gelişmiş güç simülasyonu yapar.
     */
    function simulateGladiatorWithUpgradedGear(baseEnemy, gearTier = 2) {
        const bonusHp = gearTier * 35
        const bonusDamage = gearTier * 7
        const bonusArmor = gearTier * 5
        const bonusSpeed = gearTier * 2
        const bonusCrit = gearTier * 3
        const bonusBlock = (baseEnemy.stats.blockChancePercent > 0) ? gearTier * 4 : 0

        const upgradedStats = baseEnemy.stats.copy({
            maxHealth: baseEnemy.stats.maxHealth + bonusHp,
            damage: baseEnemy.stats.damage + bonusDamage,
            armor: baseEnemy.stats.armor + bonusArmor,
            speed: baseEnemy.stats.speed + bonusSpeed,
            critChancePercent: kt.coerceAtMost((baseEnemy.stats.critChancePercent + bonusCrit), 45),
            blockChancePercent: kt.coerceAtMost((baseEnemy.stats.blockChancePercent + bonusBlock), 50)
        })

        const trait = (gearTier >= 2)
            ? new EquipmentSpecialTrait({
                id: `trait_tashisar_gear_${gearTier}`,
                name: 'Garnizon Takviye Çeliği',
                description: 'Usta demircilerce dövülen yüksek kaliteli garnizon alaşımı.'
            })
            : null

        const socketedGems = (gearTier >= 2) ? [Gem.create(GemType.AKIK, gearTier)] : []

        const simulatedWeapon = new Equipment({
            id: `sim_weapon_${baseEnemy.id}_${gearTier}`,
            name: `${baseEnemy.weaponName} (Takviyeli)`,
            slot: EquipmentSlot.WEAPON,
            stats: new Stats({damage: bonusDamage }),
            description: 'Simüle edilen yüksek kademe garnizon silahı.',
            weaponType: baseEnemy.weaponType,
            specialTrait: trait,
            unlockedSockets: socketedGems.length,
            sockets: socketedGems
        })

        return baseEnemy.copy({
            stats: upgradedStats,
            equippedWeaponItem: simulatedWeapon,
            title: `${baseEnemy.title} [Kuvanmış Sv.${gearTier}]`
        })
    }

    /**
     * Ana 2v2 İttifak Muharebesi Simülatörü.
     * Oyuncu + Müttefik vs Rakip 1 + Rakip 2 karşılaşmasını tam detaylı literary narrative logları ile simüle eder.
     */
    function simulateDuoBattle(player, ally, enemy1, enemy2, condition = kt.first(DuoMatchState.defaultConditions), simulateUpgradedEnemies = false, enemyGearTier = 1) {
        const finalAlly = (simulateUpgradedEnemies) ? simulateGladiatorWithUpgradedGear(ally, enemyGearTier) : ally
        const finalEnemy1 = (simulateUpgradedEnemies) ? simulateGladiatorWithUpgradedGear(enemy1, enemyGearTier) : enemy1
        const finalEnemy2 = (simulateUpgradedEnemies) ? simulateGladiatorWithUpgradedGear(enemy2, enemyGearTier) : enemy2

        // Player Fighter State
        const pStats = player.totalStats
        const pEquipped = kt.filterNotNull(Object.values(player.equipped))
        const pTraits = kt.mapNotNull(pEquipped, (it) => it.specialTrait)
        const pLifesteal = kt.sumOf(pEquipped, (it) => it.lifestealPercent)
        const pArmorPen = kt.sumOf(pEquipped, (it) => it.armorPenetrationPercent)
        const pStunChance = kt.sumOf(pEquipped, (it) => it.stunChancePercent)

        const playerSkills = kt.mapNotNull(player.equippedSkillIds.slice(0, 4), (id) => {
            switch (id) {
                case 'skill_crushing_impact': return gs('p_crush', 'Ezici Balyoz', '💥', SkillType.ATTACK, 1, 3, 'Ezici vuruş', '+%35 Hasar & Sersemletme')
                case 'skill_iron_will': return gs('p_iron', 'Çelik İrade', '🛡️', SkillType.DEFENSE, 1, 4, 'Sarsılmaz direnç', '+6 Zırh & Hasar Kırma')
                case 'skill_counter_flurry': return gs('p_counter', 'Akrobatik Karşı Hamle', '⚡', SkillType.TACTICAL, 1, 3, 'Karşı hamle', '+%40 Karşı Hamle')
                case 'skill_east_dragon': return gs('p_dragon', 'Ejder Nefesi Hamlesi', '🐉', SkillType.ATTACK, 1, 3, 'Gard kırma', '+%40 Hasar & Gard Kırma')
                case 'skill_east_crane': return gs('p_crane', 'Turna Zarafeti', '🕊️', SkillType.TACTICAL, 1, 3, 'Çevik süzülüş', '+%20 Kaçınma')
                case 'skill_east_mountain': return gs('p_mount', 'Kadim Dağ Duruşu', '🏔️', SkillType.DEFENSE, 1, 4, 'Dağ gibi direnç', '+8 Geçici Zırh')
                case 'skill_east_storm': return gs('p_storm', 'Fırtına Kesisi', '🌪️', SkillType.ATTACK, 1, 2, 'Seri kılıç darbeleri', '+%30 Hasar')
                case 'skill_east_night': return gs('p_night', 'Gölge Adımı', '🌑', SkillType.TACTICAL, 1, 4, 'Gölgeye sızma', '+%50 Kritik & Sersemletme')
                case 'skill_east_tiger': return gs('p_tiger', 'Kaplan Pençesi', '🐅', SkillType.ATTACK, 1, 3, 'Vahşi pençe', '+%35 Hasar & Kanama')
                default: return null
            }
        })

        const fighterPlayer = new DuoFighterState({
            id: 'player',
            name: player.name,
            title: player.title,
            isPlayer: true,
            team: DuoTeam.TEAM_BLUE,
            maxHp: pStats.maxHealth,
            currentHp: player.currentHealth,
            stats: pStats,
            weaponName: player.equipped[EquipmentSlot.WEAPON]?.name ?? 'Silahşör Kılıcı',
            weaponType: player.equipped[EquipmentSlot.WEAPON]?.weaponType ?? 'kılıç',
            archetype: PersonalityArchetype.GURURLU,
            skills: playerSkills,
            specialTraits: pTraits,
            lifestealPercent: pLifesteal,
            armorPenPercent: pArmorPen,
            stunChancePercent: pStunChance
        })

        const fighterAlly = new DuoFighterState({
            id: finalAlly.id,
            name: finalAlly.name,
            title: finalAlly.title,
            isPlayer: false,
            team: DuoTeam.TEAM_BLUE,
            maxHp: finalAlly.stats.maxHealth,
            currentHp: finalAlly.stats.maxHealth,
            stats: finalAlly.stats,
            weaponName: finalAlly.weaponName,
            weaponType: finalAlly.weaponType,
            archetype: finalAlly.personality.archetype,
            skills: finalAlly.skills,
            specialTraits: finalAlly.specialTraits,
            lifestealPercent: finalAlly.lifestealPercent,
            armorPenPercent: finalAlly.armorPenPercent,
            stunChancePercent: finalAlly.stunChancePercent
        })

        const fighterEnemy1 = new DuoFighterState({
            id: finalEnemy1.id,
            name: finalEnemy1.name,
            title: finalEnemy1.title,
            isPlayer: false,
            team: DuoTeam.TEAM_RED,
            maxHp: finalEnemy1.stats.maxHealth,
            currentHp: finalEnemy1.stats.maxHealth,
            stats: finalEnemy1.stats,
            weaponName: finalEnemy1.weaponName,
            weaponType: finalEnemy1.weaponType,
            archetype: finalEnemy1.personality.archetype,
            skills: finalEnemy1.skills,
            specialTraits: finalEnemy1.specialTraits,
            lifestealPercent: finalEnemy1.lifestealPercent,
            armorPenPercent: finalEnemy1.armorPenPercent,
            stunChancePercent: finalEnemy1.stunChancePercent
        })

        const fighterEnemy2 = new DuoFighterState({
            id: finalEnemy2.id,
            name: finalEnemy2.name,
            title: finalEnemy2.title,
            isPlayer: false,
            team: DuoTeam.TEAM_RED,
            maxHp: finalEnemy2.stats.maxHealth,
            currentHp: finalEnemy2.stats.maxHealth,
            stats: finalEnemy2.stats,
            weaponName: finalEnemy2.weaponName,
            weaponType: finalEnemy2.weaponType,
            archetype: finalEnemy2.personality.archetype,
            skills: finalEnemy2.skills,
            specialTraits: finalEnemy2.specialTraits,
            lifestealPercent: finalEnemy2.lifestealPercent,
            armorPenPercent: finalEnemy2.armorPenPercent,
            stunChancePercent: finalEnemy2.stunChancePercent
        })

        const allFighters = [fighterPlayer, fighterAlly, fighterEnemy1, fighterEnemy2]
        const teamBlue = [fighterPlayer, fighterAlly]
        const teamRed = [fighterEnemy1, fighterEnemy2]

        const [blueSynergy, blueDiscord] = evaluateTeamDynamics(fighterPlayer, fighterAlly, condition)
        const [redSynergy, redDiscord] = evaluateTeamDynamics(fighterEnemy1, fighterEnemy2, condition)

        const logs = []
        const synergyHighlights = []
        const discordIncidents = []

        let totalTeamDamage = 0
        let totalOpponentDamage = 0
        let round = 1

        // 1. Açılış Bildirimi
        logs.push(
            new CombatLog({
                round: round,
                narrativeText: DuoCombatNarratives.generateOpening(player, finalAlly, finalEnemy1, finalEnemy2, condition),
                attackerName: player.name,
                defenderName: `${finalEnemy1.name} & ${finalEnemy2.name}`,
                event: CombatEvent.HIT,
                damage: 0,
                defenderHpLeft: finalEnemy1.stats.maxHealth + finalEnemy2.stats.maxHealth,
                defenderMaxHp: finalEnemy1.stats.maxHealth + finalEnemy2.stats.maxHealth,
                isPlayerAttacker: true
            })
        )

        synergyHighlights.push(`Mavi Köşe Uyumu: ${blueSynergy.title} (${blueSynergy.description})`)
        synergyHighlights.push(`Kırmızı Köşe Uyumu: ${redSynergy.title} (${redSynergy.description})`)

        const targetHistory = {} // son saldırılan hedef
        const skillTriggerCounts = {} // dövüş içi yetenek kullanım sayıları
        const synergyTriggerCounts = {} // dövüş içi sinerji tetiklenme sayıları
        const pincerTriggerCounts = {} // dövüş içi kıskaç sayıları
        const interceptTriggerCounts = {} // siper olma sayıları

        while (teamBlue.some((it) => it.isAlive) && teamRed.some((it) => it.isAlive) && round <= 35) {
            round++

            // Tur başı durum güncellemeleri
            allFighters.filter((it) => it.isAlive).forEach((f) => {
                // Cooldown azalt
                Object.keys(f.cooldowns).forEach((k) => {
                    const cd = f.cooldowns[k] ?? 0
                    if (cd > 1) f.cooldowns[k] = cd - 1
                    else delete f.cooldowns[k]
                })

                // Bleed hasarı
                if (f.bleedTurns > 0) {
                    const bleedDmg = Math.max(3, Math.round((f.maxHp * 0.04)))
                    f.currentHp = Math.max(0, f.currentHp - bleedDmg)
                    f.bleedTurns--
                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: `🩸 [KANAMA!] ${f.name} önceki yaralarının kanamasıyla kan kaybetti (-${bleedDmg} Can, Kalan: ${f.currentHp}/${f.maxHp})!`,
                            attackerName: 'Kanama',
                            defenderName: f.name,
                            event: CombatEvent.HIT,
                            damage: bleedDmg,
                            defenderHpLeft: f.currentHp,
                            defenderMaxHp: f.maxHp,
                            isPlayerAttacker: f.team === DuoTeam.TEAM_RED
                        })
                    )
                }

                // Can yenilenmesi (Regen)
                if (CombatEngine.hasRegenerationTrait(f.specialTraits) && f.currentHp > 0 && f.currentHp < f.maxHp) {
                    const regen = Math.max(3, Math.round((f.maxHp * 0.05)))
                    f.currentHp = kt.coerceAtMost((f.currentHp + regen), f.maxHp)
                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: `🌿 [YAŞAM YENİLENMESİ] ${f.name}'in mühürleri yaralarını onardı (+${regen} Can)!`,
                            attackerName: f.name,
                            defenderName: f.name,
                            event: CombatEvent.HIT,
                            damage: 0,
                            defenderHpLeft: f.currentHp,
                            defenderMaxHp: f.maxHp,
                            isPlayerAttacker: f.team === DuoTeam.TEAM_BLUE
                        })
                    )
                }
            })

            // Zemin Koşulu Periyodik Etkisi
            if (round % 3 === 0) {
                let beneficiary
                switch (condition.id) {
                    case 'loose_sand': beneficiary = kt.maxByOrNull(allFighters.filter((it) => it.isAlive), (it) => it.stats.speed); break
                    case 'narrow_pass': beneficiary = kt.maxByOrNull(allFighters.filter((it) => it.isAlive), (it) => it.stats.armor); break
                    case 'wind_tempest': beneficiary = kt.randomOrNull(allFighters.filter((it) => it.isAlive)); break
                    case 'blood_pit': beneficiary = kt.maxByOrNull(allFighters.filter((it) => it.isAlive), (it) => it.stats.damage); break
                    default: beneficiary = null
                }
                if (beneficiary != null) {
                    const condText = DuoCombatNarratives.generateConditionEffect(condition, beneficiary.name, null)
                    if (condText.length > 0) {
                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: condText,
                                attackerName: condition.name,
                                defenderName: beneficiary.name,
                                event: CombatEvent.HIT,
                                damage: 0,
                                defenderHpLeft: beneficiary.currentHp,
                                defenderMaxHp: beneficiary.maxHp,
                                isPlayerAttacker: beneficiary.team === DuoTeam.TEAM_BLUE
                            })
                        )
                    }
                }
            }

            // Sürtüşme / Uyumsuzluk Olayı Kontrolü (Discord Event)
            for (const team of [teamBlue, teamRed]) {
                const livingTeam = team.filter((it) => it.isAlive)
                if (livingTeam.length === 2) {
                    const discordType = (team === teamBlue) ? blueDiscord : redDiscord
                    const discordChance = (discordType !== DuoDiscordType.NONE) ? 22 : 6
                    if (kt.Random.nextInt(100) < discordChance) {
                        const f1 = livingTeam[0]
                        const f2 = livingTeam[1]
                        const discordMsg = DuoCombatNarratives.generateDiscordIncident(discordType, f1.name, f2.name, f1.name)
                        if (discordMsg.length > 0) {
                            discordIncidents.push(`${f1.name} & ${f2.name}: ${discordMsg}`)
                            logs.push(
                                new CombatLog({
                                    round: round,
                                    narrativeText: discordMsg,
                                    attackerName: f1.name,
                                    defenderName: f2.name,
                                    event: CombatEvent.BLOCKED,
                                    damage: 0,
                                    defenderHpLeft: f2.currentHp,
                                    defenderMaxHp: f2.maxHp,
                                    isPlayerAttacker: team === teamBlue
                                })
                            )
                        }
                    }
                }
            }

            // Girişim Sırası (Initiative Order)
            const activeCombatants = kt.sortedByDescending(
                allFighters.filter((it) => it.isAlive),
                (it) => it.stats.speed + kt.Random.nextInt(-2, 3))

            for (const attacker of activeCombatants) {
                if (!attacker.isAlive) continue

                if (attacker.isStunned) {
                    attacker.isStunned = false
                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: `💫 [SERSEMLEDİ!] ${attacker.name} başını toparlayamadı ve bu tur hamle yapamadı!`,
                            attackerName: attacker.name,
                            defenderName: attacker.name,
                            event: CombatEvent.BLOCKED,
                            damage: 0,
                            defenderHpLeft: attacker.currentHp,
                            defenderMaxHp: attacker.maxHp,
                            isPlayerAttacker: attacker.team === DuoTeam.TEAM_BLUE
                        })
                    )
                    continue
                }

                const opposingTeam = (attacker.team === DuoTeam.TEAM_BLUE) ? teamRed : teamBlue
                const livingOpponents = opposingTeam.filter((it) => it.isAlive)
                if (livingOpponents.length === 0) break

                // Hedef Seçimi Taktik Algoritması
                let target
                switch (attacker.archetype) {
                    case PersonalityArchetype.KURNAZ: target = kt.minByOrNull(livingOpponents, (it) => it.currentHp) ?? kt.first(livingOpponents); break
                    case PersonalityArchetype.VAHSI: target = kt.maxByOrNull(livingOpponents, (it) => it.stats.damage) ?? kt.first(livingOpponents); break
                    case PersonalityArchetype.GURURLU: target = kt.maxByOrNull(livingOpponents, (it) => it.stats.armor) ?? kt.first(livingOpponents); break
                    default: target = kt.random(livingOpponents)
                }

                const lastTargetId = targetHistory[attacker.team]
                const isPincerAttack = lastTargetId === target.id && kt.count(opposingTeam, (it) => it.isAlive) > 1
                targetHistory[attacker.team] = target.id

                const allyOfAttacker = kt.firstOrNull((attacker.team === DuoTeam.TEAM_BLUE ? teamBlue : teamRed), (it) => it.id !== attacker.id && it.isAlive)
                const allyOfDefender = kt.firstOrNull(opposingTeam, (it) => it.id !== target.id && it.isAlive)

                // Müttefik Siper Olma (Ally Intercept) Kontrolü
                if (allyOfDefender != null && allyOfDefender.currentHp > (allyOfDefender.maxHp * 0.25)) {
                    const interceptChance = allyOfDefender.archetype === PersonalityArchetype.GURURLU
                        ? 45
                        : allyOfDefender.archetype === PersonalityArchetype.HIRSLI
                          ? 30
                          : allyOfDefender.stats.armor >= 20
                            ? 30
                            : 15

                    if (kt.Random.nextInt(100) < interceptChance) {
                        const isShield = allyOfDefender.stats.blockChancePercent > 0 || ['kalkan', 'mızrak'].includes(allyOfDefender.weaponType)
                        const absorbedPercent = (isShield) ? 0.55 : 0.35
                        const potentialDmg = Math.max(10, Math.round((attacker.stats.damage * 0.8)))
                        const absorbedDmg = Math.round((potentialDmg * absorbedPercent))
                        const actualDmgToAlly = Math.max(4, potentialDmg - absorbedDmg)

                        allyOfDefender.currentHp = Math.max(0, allyOfDefender.currentHp - actualDmgToAlly)

                        const interceptCount = (interceptTriggerCounts[allyOfDefender.name] ?? 0) + 1
                        interceptTriggerCounts[allyOfDefender.name] = interceptCount

                        const interceptText = DuoCombatNarratives.generateAllyIntercept(allyOfDefender.name, target.name, attacker.name, absorbedDmg, isShield, interceptCount)

                        logs.push(
                            new CombatLog({
                                round: round,
                                narrativeText: interceptText,
                                attackerName: attacker.name,
                                defenderName: allyOfDefender.name,
                                event: CombatEvent.BLOCKED,
                                damage: actualDmgToAlly,
                                defenderHpLeft: allyOfDefender.currentHp,
                                defenderMaxHp: allyOfDefender.maxHp,
                                isPlayerAttacker: attacker.team === DuoTeam.TEAM_BLUE
                            })
                        )

                        if (!allyOfDefender.isAlive) {
                            handleFallenCombatant(allyOfDefender, target, kt.count(opposingTeam, (it) => it.isAlive), logs, round)
                        }
                        continue
                    }
                }

                // Çapraz Kıskaca Alma (Pincer Double Team) Bonusu
                let pincerBonusDamage = 0
                if (isPincerAttack && allyOfAttacker != null) {
                    pincerBonusDamage = Math.max(5, Math.round((attacker.stats.damage * 0.30)))
                    const pincerKey = `${allyOfAttacker.name}_${attacker.name}`
                    const pincerCount = (pincerTriggerCounts[pincerKey] ?? 0) + 1
                    pincerTriggerCounts[pincerKey] = pincerCount

                    const pincerText = DuoCombatNarratives.generatePincerDoubleTeam(allyOfAttacker.name, attacker.name, target.name, pincerBonusDamage, pincerCount)
                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: pincerText,
                            attackerName: attacker.name,
                            defenderName: target.name,
                            event: CombatEvent.CRITICAL,
                            damage: pincerBonusDamage,
                            defenderHpLeft: target.currentHp,
                            defenderMaxHp: target.maxHp,
                            isPlayerAttacker: attacker.team === DuoTeam.TEAM_BLUE
                        })
                    )
                    target.currentHp = Math.max(0, target.currentHp - pincerBonusDamage)
                    if (attacker.team === DuoTeam.TEAM_BLUE) { totalTeamDamage += pincerBonusDamage } else { totalOpponentDamage += pincerBonusDamage }
                    if (!target.isAlive) {
                        handleFallenCombatant(target, allyOfDefender, kt.count(opposingTeam, (it) => it.isAlive), logs, round)
                        continue
                    }
                }

                // Yetenek Kullanımı (Skill Execution)
                const availableSkill = kt.firstOrNull(attacker.skills, (it) => (attacker.cooldowns[it.id] ?? 0) === 0)
                if (availableSkill != null) {
                    attacker.cooldowns[availableSkill.id] = availableSkill.cooldownTurns

                    const isCrit = kt.Random.nextInt(100) < (attacker.stats.critChancePercent + 15)
                    let skillMultiplier
                    switch (availableSkill.type) {
                        case SkillType.ATTACK: skillMultiplier = 1.45; break
                        case SkillType.ULTIMATE: skillMultiplier = 1.85; break
                        case SkillType.TACTICAL: skillMultiplier = 1.25; break
                        case SkillType.DEFENSE: skillMultiplier = 0.85; break
                    }

                    let rawDamage = Math.round((attacker.stats.damage * skillMultiplier))
                    if (isCrit) rawDamage = Math.round((rawDamage * 1.5))

                    // Zırh indirimi
                    const effectiveTargetArmor = Math.max(0, target.stats.armor - kt.idiv(target.stats.armor * attacker.armorPenPercent, 100))
                    const damageDealt = Math.max(8, rawDamage - Math.round((effectiveTargetArmor * 0.5)))

                    target.currentHp = Math.max(0, target.currentHp - damageDealt)
                    if (attacker.team === DuoTeam.TEAM_BLUE) { totalTeamDamage += damageDealt } else { totalOpponentDamage += damageDealt }

                    // Lifesteal
                    if (attacker.lifestealPercent > 0) {
                        const heal = kt.coerceAtLeast(kt.idiv(damageDealt * attacker.lifestealPercent, 100), 1)
                        attacker.currentHp = kt.coerceAtMost((attacker.currentHp + heal), attacker.maxHp)
                    }

                    // Yetenek ve Sinerji Tekrar Sayısı Takibi
                    const skillKey = `${attacker.name}_${availableSkill.id}`
                    const skillCount = (skillTriggerCounts[skillKey] ?? 0) + 1
                    skillTriggerCounts[skillKey] = skillCount

                    // Yetenek Sinerjisi (Synergy Combo) Metni
                    const teamSynergy = (attacker.team === DuoTeam.TEAM_BLUE) ? blueSynergy : redSynergy
                    let comboNarrative
                    if (allyOfAttacker != null && kt.Random.nextInt(100) < 50) {
                        const synKey = `${attacker.team}_${teamSynergy.name}`
                        const synCount = (synergyTriggerCounts[synKey] ?? 0) + 1
                        synergyTriggerCounts[synKey] = synCount

                        comboNarrative = DuoCombatNarratives.generateSynergyCombo(teamSynergy, allyOfAttacker.name, attacker.name, target.name, Math.round((damageDealt * 0.2)), synCount, availableSkill)
                    } else {
                        comboNarrative = DuoCombatNarratives.generateSkillExecutionNarrative(attacker.name, target.name, attacker.weaponName, availableSkill, damageDealt, isCrit, target.currentHp, target.maxHp, skillCount)
                    }

                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: comboNarrative,
                            attackerName: attacker.name,
                            defenderName: target.name,
                            event: (isCrit) ? CombatEvent.CRITICAL : CombatEvent.HIT,
                            damage: damageDealt,
                            defenderHpLeft: target.currentHp,
                            defenderMaxHp: target.maxHp,
                            isPlayerAttacker: attacker.team === DuoTeam.TEAM_BLUE
                        })
                    )

                    if (!target.isAlive) {
                        handleFallenCombatant(target, allyOfDefender, kt.count(opposingTeam, (it) => it.isAlive), logs, round)
                    }
                    continue
                }

                // Normal Saldırı
                const dodgeRoll = kt.Random.nextInt(100)
                if (dodgeRoll < target.stats.dodgeChancePercent) {
                    logs.push(
                        new CombatLog({
                            round: round,
                            narrativeText: `💨 [ÇEVİK SIYRILIŞ!] ${target.name}, ${attacker.name}'in savurduğu ${attacker.weaponName} darbesinden akrobatik bir hamleyle sıyrıldı!`,
                            attackerName: attacker.name,
                            defenderName: target.name,
                            event: CombatEvent.DODGED,
                            damage: 0,
                            defenderHpLeft: target.currentHp,
                            defenderMaxHp: target.maxHp,
                            isPlayerAttacker: attacker.team === DuoTeam.TEAM_BLUE
                        })
                    )
                    continue
                }

                const blockRoll = kt.Random.nextInt(100)
                const isBlocked = blockRoll < target.stats.blockChancePercent
                const isCrit = kt.Random.nextInt(100) < attacker.stats.critChancePercent

                let rawDamage = attacker.stats.damage
                if (isCrit) rawDamage *= 1.6
                if (isBlocked) rawDamage *= 0.45

                const effectiveTargetArmor = Math.max(0, target.stats.armor - kt.idiv(target.stats.armor * attacker.armorPenPercent, 100))
                const damageDealt = Math.max(5, Math.round((rawDamage - (effectiveTargetArmor * 0.6))))

                target.currentHp = Math.max(0, target.currentHp - damageDealt)
                if (attacker.team === DuoTeam.TEAM_BLUE) { totalTeamDamage += damageDealt } else { totalOpponentDamage += damageDealt }

                const hitNarrative = isBlocked
                    ? kt.random([
                        `🧱 [BLOK!] ${target.name}, ${attacker.name}'in darbesini kalkanıyla karşıladı! Zırh çınladı ancak hasar hafifletildi (${damageDealt} Hasar, Kalan: ${target.currentHp}/${target.maxHp}).`,
                        `🧱 [AĞIR SİPER BLOKAJI!] ${target.name} dengesini bozmadan kalkanını öne sürdü; ${attacker.weaponName} kalkanın perçinlerine çarpıp sekti (${damageDealt} Hasar, Kalan: ${target.currentHp}/${target.maxHp}).`,
                        `🧱 [GARD SAVUNMASI!] ${attacker.name}'in savuruşu ${target.name}'ın sağlam gardında sönümlendi, kumlar ayaklarının altında dağıldı (${damageDealt} Hasar, Kalan: ${target.currentHp}/${target.maxHp}).`
                    ])

                    : isCrit
                    ? kt.random([
                        `💥 [KRİTİK DARBE!] ${attacker.name}'in ${attacker.weaponName} vuruşu ${target.name}'ın en zayıf noktasına indi! Kemik çatırtısı tribünlerden duyuldu (${damageDealt} Hasar, Kalan: ${target.currentHp}/${target.maxHp})!`,
                        `💥 [ZIRH DELEN KRİTİK!] ${attacker.name} kusursuz bir kavisle ${target.name}'ın zırh eklemini yardı; fışkıran kan kumlara saçıldı (${damageDealt} Hasar, Kalan: ${target.currentHp}/${target.maxHp})!`,
                        `💥 [YIKICI İSABET!] ${target.name}'ın dengesini yitirdiği o anda inen ${attacker.weaponName} darbesi tüm arenayı inletti (${damageDealt} Hasar, Kalan: ${target.currentHp}/${target.maxHp})!`
                    ])

                    : kt.random([
                        `⚔️ [İSABETLİ VURUŞ] ${attacker.name}, ${target.name}'a ${attacker.weaponName} ile sert bir kesi attı (${damageDealt} Hasar, Kalan: ${target.currentHp}/${target.maxHp}).`,
                        `⚔️ [HÜCUM TEMASI] ${attacker.name} kumun akışını adımlarına uydurarak ${target.name}'ın böğrüne keskin bir darbe indirdi (${damageDealt} Hasar, Kalan: ${target.currentHp}/${target.maxHp}).`,
                        `⚔️ [ÇELİK ÇARPIŞMASI] ${attacker.name}'in ${attacker.weaponName} hamlesi ${target.name}'ın zırhını sıyırıp derin bir bere bıraktı (${damageDealt} Hasar, Kalan: ${target.currentHp}/${target.maxHp}).`
                    ])

                logs.push(
                    new CombatLog({
                        round: round,
                        narrativeText: hitNarrative,
                        attackerName: attacker.name,
                        defenderName: target.name,
                        event: (isCrit) ? CombatEvent.CRITICAL : (isBlocked) ? CombatEvent.BLOCKED : CombatEvent.HIT,
                        damage: damageDealt,
                        defenderHpLeft: target.currentHp,
                        defenderMaxHp: target.maxHp,
                        isPlayerAttacker: attacker.team === DuoTeam.TEAM_BLUE
                    })
                )

                if (!target.isAlive) {
                    handleFallenCombatant(target, allyOfDefender, kt.count(opposingTeam, (it) => it.isAlive), logs, round)
                }
            }
        }

        const isBlueWinner = teamBlue.some((it) => it.isAlive) && kt.none(teamRed, (it) => it.isAlive)
        const isDraw = (kt.none(teamBlue, (it) => it.isAlive) && kt.none(teamRed, (it) => it.isAlive)) || round > 35

        // Bitiş Metni
        if (isBlueWinner) {
            logs.push(
                new CombatLog({
                    round: round,
                    narrativeText: DuoCombatNarratives.generateVictory(player, finalAlly, condition),
                    attackerName: player.name,
                    defenderName: `${finalEnemy1.name} & ${finalEnemy2.name}`,
                    event: CombatEvent.DEFEAT,
                    damage: 0,
                    defenderHpLeft: 0,
                    defenderMaxHp: finalEnemy1.stats.maxHealth + finalEnemy2.stats.maxHealth,
                    isPlayerAttacker: true
                })
            )
        } else {
            logs.push(
                new CombatLog({
                    round: round,
                    narrativeText: DuoCombatNarratives.generateDefeat(player, finalAlly, finalEnemy1, finalEnemy2),
                    attackerName: `${finalEnemy1.name} & ${finalEnemy2.name}`,
                    defenderName: player.name,
                    event: CombatEvent.DEFEAT,
                    damage: 0,
                    defenderHpLeft: 0,
                    defenderMaxHp: player.totalStats.maxHealth,
                    isPlayerAttacker: false
                })
            )
        }

        return new DuoCombatResult({
            isPlayerWinner: isBlueWinner,
            isDraw: isDraw,
            totalRounds: round,
            player: player,
            ally: finalAlly,
            enemy1: finalEnemy1,
            enemy2: finalEnemy2,
            condition: condition,
            finalPlayerHp: Math.max(0, fighterPlayer.currentHp),
            finalAllyHp: Math.max(0, fighterAlly.currentHp),
            finalEnemy1Hp: Math.max(0, fighterEnemy1.currentHp),
            finalEnemy2Hp: Math.max(0, fighterEnemy2.currentHp),
            totalTeamDamage: totalTeamDamage,
            totalOpponentDamage: totalOpponentDamage,
            logs: logs,
            earnedGold: (isBlueWinner) ? 60 : 10,
            earnedExp: (isBlueWinner) ? 90 : 25,
            earnedFame: (isBlueWinner) ? 3 : 0,
            synergyHighlights: synergyHighlights,
            discordIncidents: discordIncidents
        })
    }

    // private
    function handleFallenCombatant(fallen, survivor, remainingOpponents, logs, round) {
        if (survivor != null && survivor.isAlive) {
            const fallenText = DuoCombatNarratives.generateTeammateFallen(fallen.name, survivor.name, remainingOpponents)
            logs.push(
                new CombatLog({
                    round: round,
                    narrativeText: fallenText,
                    attackerName: fallen.name,
                    defenderName: survivor.name,
                    event: CombatEvent.DEFEAT,
                    damage: 0,
                    defenderHpLeft: survivor.currentHp,
                    defenderMaxHp: survivor.maxHp,
                    isPlayerAttacker: survivor.team === DuoTeam.TEAM_BLUE
                })
            )
        }
    }

export const DuoCombatEngine = {
    DuoFighterState,
    evaluateTeamDynamics,
    simulateGladiatorWithUpgradedGear,
    simulateDuoBattle,
}
