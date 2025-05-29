// backend/src/services/combatService.js
// Note: Character and AiOpponent models are not directly needed here anymore for simulateCombat
// but might be for other functions if this service expands.

// --- Global Ability Registry ---
const ALL_ABILITIES = {
    // Character Abilities (matching names from characterService)
    "Power Attack": { name: "Power Attack", type: "attack", damageMultiplier: 1.5, baseDamage: 10, accuracy: 0.9, energyCost: 0, info: "A strong attack with increased power." },
    "Defensive Stance": { name: "Defensive Stance", type: "buff", statModified: "defense", modifierValue: 10, duration: 3, info: "Increases defense for 3 turns." },
    "Whirlwind": { name: "Whirlwind", type: "attack", damageMultiplier: 1.2, baseDamage: 5, accuracy: 0.8, areaEffect: true, info: "Attacks multiple targets (conceptual)."},
    "Fireball": { name: "Fireball", type: "attack", damageMultiplier: 1.3, baseDamage: 20, accuracy: 0.85, elementType: "fire", info: "Hurls a fiery projectile." },
    "Heal": { name: "Heal", type: "heal", baseHeal: 40, info: "Restores a moderate amount of HP." },
    "Teleport": { name: "Teleport", type: "buff", statModified: "speed", modifierValue: 20, duration: 1, info: "Greatly increases speed for the next turn (conceptual for turn order)." },
    "Strong Bite": { name: "Strong Bite", type: "attack", damageMultiplier: 1.2, baseDamage: 15, accuracy: 0.95, info: "A powerful bite attack." },
    "Regeneration Boost": { name: "Regeneration Boost", type: "buff", effectType: "hot", healPerTurn: 10, duration: 3, info: "Heals HP over 3 turns." },
    "Infect": { name: "Infect", type: "debuff", effectType: "dot", damagePerTurn: 8, duration: 3, statModified: "health", info: "Poisons the target, dealing damage over 3 turns." },

    // Generic/AI Abilities
    "Strike": { name: "Strike", type: "attack", damageMultiplier: 1.0, baseDamage: 8, accuracy: 0.95, info: "A basic, accurate strike." },
    "Guard Up": { name: "Guard Up", type: "buff", statModified: "defense", modifierValue: 8, duration: 3, info: "Bolsters defense." },
    "Weaken": { name: "Weaken", type: "debuff", statModified: "attack", modifierValue: -5, duration: 3, info: "Reduces target's attack." },
    "Quick Heal": { name: "Quick Heal", type: "heal", baseHeal: 25, info: "A fast but small heal." },
    "Poison Sting": { name: "Poison Sting", type: "debuff", effectType: "dot", damagePerTurn: 10, duration: 3, statModified: "health", info: "Poisons the target, dealing damage over time." },
    "Adrenaline Rush": { name: "Adrenaline Rush", type: "buff", statModified: "strength", modifierValue: 7, duration: 2, info: "Boosts strength for a short duration." },
    "Shield Bash": { name: "Shield Bash", type: "attack", damageMultiplier: 0.8, baseDamage: 5, accuracy: 0.9, chanceToStun: 0.2, info: "Lower damage, but chance to stun (conceptual)." },
    "Minor Heal": { name: "Minor Heal", type: "heal", baseHeal: 15, info: "Restores a small amount of HP." },
    "Berserk": { name: "Berserk", type: "attack", damageMultiplier: 2.0, baseDamage: 5, accuracy: 0.7, selfDebuff: { statModified: "defense", modifierValue: -10, duration: 1}, info: "Powerful attack, lowers own defense." }
};

// --- Helper Function: Apply Effects to Stats ---
const applyEffectsToStats = (baseStats, activeEffectsArray, isCharacter) => {
    const tempStats = JSON.parse(JSON.stringify(baseStats)); 

    if (isCharacter) {
        tempStats.attack = tempStats.strength || 0; 
        tempStats.defense = (tempStats.stamina || 0) * 0.5; 
    } else {
        tempStats.attack = tempStats.attack || 0;
        tempStats.defense = tempStats.defense || 0;
    }
    
    activeEffectsArray.forEach(effect => {
        if (effect.statModified && typeof tempStats[effect.statModified] === 'number') {
            if (effect.modifierValue) { 
                tempStats[effect.statModified] += effect.modifierValue;
            } else if (effect.modifierMultiplier) { 
                tempStats[effect.statModified] *= effect.modifierMultiplier;
            }
        }
    });

    tempStats.strength = Math.max(0, tempStats.strength || 0);
    tempStats.stamina = Math.max(0, tempStats.stamina || 0);
    tempStats.speed = Math.max(0, tempStats.speed || 0);
    tempStats.attack = Math.max(0, tempStats.attack || 0);
    tempStats.defense = Math.max(0, tempStats.defense || 0);
    return tempStats;
};

// --- Refined Calculate Damage ---
const calculateDamage = (attackerEffectiveStats, defenderEffectiveStats, abilityObject) => {
    if (Math.random() > (abilityObject.accuracy || 1.0)) {
        return { damage: 0, missed: true };
    }
    let baseAttackPower = attackerEffectiveStats.attack;
    let damage = abilityObject.baseDamage || 0;
    if (abilityObject.damageMultiplier) {
        damage += baseAttackPower * abilityObject.damageMultiplier;
    } else { 
        damage += baseAttackPower;
    }
    const defenseReduction = defenderEffectiveStats.defense || 0;
    damage -= defenseReduction;
    const variance = (Math.random() * 0.2) - 0.1; 
    damage *= (1 + variance);
    return { damage: Math.max(0, Math.floor(damage)), missed: false };
};

// --- Refined Choose Attack ---
const chooseAttack = (attackerEntity, attackerCurrentHp, attackerActiveEffects, isCharacter) => {
    const availableAbilityNames = attackerEntity.abilities || [];
    const usableAbilities = availableAbilityNames
        .map(name => ALL_ABILITIES[name])
        .filter(ability => ability); 

    if (usableAbilities.length === 0) {
        return ALL_ABILITIES["Strike"]; 
    }

    if (isCharacter) { 
        return usableAbilities[Math.floor(Math.random() * usableAbilities.length)];
    } else { 
        const maxHp = attackerEntity.stats.health_points;
        if (attackerCurrentHp < maxHp * 0.3) {
            const healAbilities = usableAbilities.filter(ab => ab.type === 'heal');
            if (healAbilities.length > 0 && Math.random() < 0.5) {
                return healAbilities.sort((a,b) => b.baseHeal - a.baseHeal)[0];
            }
        }
        const buffAbilities = usableAbilities.filter(ab => ab.type === 'buff');
        if (buffAbilities.length > 0 && Math.random() < 0.25) {
            const activeBuffNames = attackerActiveEffects.map(eff => eff.name);
            const nonActiveBuffs = buffAbilities.filter(buff => !activeBuffNames.includes(buff.name));
            if (nonActiveBuffs.length > 0) {
                 return nonActiveBuffs[Math.floor(Math.random() * nonActiveBuffs.length)];
            }
        }
        let attackAbilities = usableAbilities.filter(ab => ab.type === 'attack');
        if (attackAbilities.length > 0) {
            attackAbilities.sort((a, b) => {
                const scoreA = (a.baseDamage || 0) + ((a.damageMultiplier || 0) * 20); 
                const scoreB = (b.baseDamage || 0) + ((b.damageMultiplier || 0) * 20);
                return scoreB - scoreA;
            });
            return attackAbilities[0]; 
        }
        return usableAbilities[Math.floor(Math.random() * usableAbilities.length)];
    }
};

// --- Refined Apply Ability ---
const applyAbility = (attackerEntity, defenderEntity, abilityObject, attackerCurrentHp, defenderCurrentHp, attackerEffectiveStats, defenderEffectiveStats) => {
    let damageDealt = 0;
    let healAmount = 0;
    let effectApplied = null; 
    const maxAttackerHp = attackerEntity.stats.health_points;

    const combatLogEntry = {
        attacker: attackerEntity.name,
        defender: defenderEntity.name,
        abilityName: abilityObject.name,
        damage: 0,
        heal: 0,
        effect: null,
        missed: false,
    };

    if (abilityObject.type === 'attack') {
        const { damage, missed } = calculateDamage(attackerEffectiveStats, defenderEffectiveStats, abilityObject);
        if (missed) {
            combatLogEntry.missed = true;
            combatLogEntry.effect = `${attackerEntity.name}'s ${abilityObject.name} missed!`;
        } else {
            damageDealt = damage;
            defenderCurrentHp = Math.max(0, defenderCurrentHp - damageDealt);
            combatLogEntry.damage = damageDealt;
            combatLogEntry.effect = `${attackerEntity.name} hits ${defenderEntity.name} with ${abilityObject.name} for ${damageDealt} damage.`;
            if (abilityObject.selfDebuff) {
                 effectApplied = { 
                    name: `${abilityObject.name} Sideffect`, 
                    target: 'self', 
                    ...abilityObject.selfDebuff,
                    source: attackerEntity.name,
                };
                combatLogEntry.effect += ` ${attackerEntity.name} is affected by ${effectApplied.name}!`;
            }
        }
    } else if (abilityObject.type === 'heal') {
        healAmount = abilityObject.baseHeal || 0;
        attackerCurrentHp = Math.min(maxAttackerHp, attackerCurrentHp + healAmount);
        combatLogEntry.heal = healAmount;
        combatLogEntry.effect = `${attackerEntity.name} uses ${abilityObject.name}, healing for ${healAmount} HP.`;
    } else if (abilityObject.type === 'buff') {
        effectApplied = {
            name: abilityObject.name, target: 'self', 
            ...abilityObject, // Spread all relevant properties like statModified, modifierValue, duration etc.
            source: attackerEntity.name,
        };
        combatLogEntry.effect = `${attackerEntity.name} uses ${abilityObject.name}. ${abilityObject.info}.`;
    } else if (abilityObject.type === 'debuff') {
        effectApplied = {
            name: abilityObject.name, target: 'opponent',
            ...abilityObject, // Spread all relevant properties
            source: attackerEntity.name,
        };
        combatLogEntry.effect = `${attackerEntity.name} uses ${abilityObject.name} on ${defenderEntity.name}. ${abilityObject.info}.`;
    }

    // console.log(combatLogEntry.effect); // Keep console logs for debugging if needed
    return { attackerCurrentHp, defenderCurrentHp, damageDealt, healAmount, effectApplied, combatLogEntry };
};


// --- Refined Simulate Combat ---
// Accepts full character and opponent objects
const simulateCombat = async (character, opponent) => { 
    if (!character || !opponent) {
        // This check might be redundant if controller ensures objects are passed, but good for safety
        console.error("SimulateCombat called with null character or opponent");
        return { error: "Character or Opponent data missing for combat simulation." };
    }
    
    let charBaseStats = JSON.parse(JSON.stringify(character.stats));
    let oppBaseStats = JSON.parse(JSON.stringify(opponent.stats));

    let charCurrentHp = charBaseStats.health_points;
    let oppCurrentHp = oppBaseStats.health_points;

    let charActiveEffects = [];
    let oppActiveEffects = [];

    const combatLog = [];
    let turn = 0;
    const MAX_TURNS = 50;

    combatLog.push(`Battle starts: ${character.name} (HP: ${charCurrentHp}) vs ${opponent.name} (HP: ${oppCurrentHp})`);

    while (charCurrentHp > 0 && oppCurrentHp > 0 && turn < MAX_TURNS) {
        turn++;
        combatLog.push(`\n--- Turn ${turn} ---`);

        let charTempSpeedStats = applyEffectsToStats(charBaseStats, charActiveEffects, true);
        let oppTempSpeedStats = applyEffectsToStats(oppBaseStats, oppActiveEffects, false);

        const charSpeed = charTempSpeedStats.speed;
        const oppSpeed = oppTempSpeedStats.speed;

        let currentAttackerEntity, currentDefenderEntity;
        let currentAttackerHp, currentDefenderHp;
        let currentAttackerBaseStats, currentDefenderBaseStats;
        let currentAttackerActiveEffects, currentDefenderActiveEffects;
        let isCurrentAttackerCharacter;

        if (charSpeed >= oppSpeed) {
            [currentAttackerEntity, currentDefenderEntity] = [character, opponent];
            [currentAttackerHp, currentDefenderHp] = [charCurrentHp, oppCurrentHp];
            [currentAttackerBaseStats, currentDefenderBaseStats] = [charBaseStats, oppBaseStats];
            [currentAttackerActiveEffects, currentDefenderActiveEffects] = [charActiveEffects, oppActiveEffects];
            isCurrentAttackerCharacter = true;
        } else {
            [currentAttackerEntity, currentDefenderEntity] = [opponent, character];
            [currentAttackerHp, currentDefenderHp] = [oppCurrentHp, charCurrentHp];
            [currentAttackerBaseStats, currentDefenderBaseStats] = [oppBaseStats, charBaseStats];
            [currentAttackerActiveEffects, currentDefenderActiveEffects] = [oppActiveEffects, charActiveEffects];
            isCurrentAttackerCharacter = false;
        }
        
        combatLog.push(`${currentAttackerEntity.name} takes the turn.`);

        // Process start-of-turn effects for the current attacker
        let stillAliveAfterTurnStartEffects = true;
        const nextTurnAttackerEffects = [];
        for (const effect of currentAttackerActiveEffects) {
            let effectLogMessage = `${currentAttackerEntity.name} is affected by ${effect.name}: `;
            if (effect.effectType === 'dot' && effect.damagePerTurn) {
                currentAttackerHp -= effect.damagePerTurn;
                effectLogMessage += `takes ${effect.damagePerTurn} damage. `;
                if (currentAttackerHp <= 0) {
                    stillAliveAfterTurnStartEffects = false;
                    combatLog.push(effectLogMessage + `${currentAttackerEntity.name} succumbs to damage over time!`);
                    break;
                }
            }
            if (effect.effectType === 'hot' && effect.healPerTurn) {
                currentAttackerHp = Math.min(currentAttackerEntity.stats.health_points, currentAttackerHp + effect.healPerTurn);
                effectLogMessage += `heals ${effect.healPerTurn} HP. `;
            }
            effect.duration--;
            if (effect.duration > 0) {
                nextTurnAttackerEffects.push(effect);
                effectLogMessage += `( ${effect.duration} turns remaining).`;
            } else {
                effectLogMessage += `effect wore off.`;
            }
            combatLog.push(effectLogMessage);
        }
        
        // Update active effects for the attacker
        if (isCurrentAttackerCharacter) charActiveEffects = nextTurnAttackerEffects; else oppActiveEffects = nextTurnAttackerEffects;
        // Update global HP variables
        if (isCurrentAttackerCharacter) charCurrentHp = currentAttackerHp; else oppCurrentHp = currentAttackerHp;

        if (!stillAliveAfterTurnStartEffects) break; 

        // Attacker acts
        let attackerEffectiveStats = applyEffectsToStats(currentAttackerBaseStats, currentAttackerActiveEffects, isCurrentAttackerCharacter);
        let defenderEffectiveStats = applyEffectsToStats(currentDefenderBaseStats, currentDefenderActiveEffects, !isCurrentAttackerCharacter);

        const chosenAbility = chooseAttack(currentAttackerEntity, currentAttackerHp, currentAttackerActiveEffects, isCurrentAttackerCharacter);
        if (!chosenAbility) {
            combatLog.push(`${currentAttackerEntity.name} is confused and does nothing.`);
        } else {
            const abilityOutcome = applyAbility(
                currentAttackerEntity, currentDefenderEntity, chosenAbility,
                currentAttackerHp, currentDefenderHp,
                attackerEffectiveStats, defenderEffectiveStats
            );
            combatLog.push(abilityOutcome.combatLogEntry);

            currentAttackerHp = abilityOutcome.attackerCurrentHp;
            currentDefenderHp = abilityOutcome.defenderCurrentHp;

            if (abilityOutcome.effectApplied) {
                if (abilityOutcome.effectApplied.target === 'self') {
                    currentAttackerActiveEffects.push(abilityOutcome.effectApplied);
                } else { 
                    currentDefenderActiveEffects.push(abilityOutcome.effectApplied);
                }
            }
        }
        
        // Update global HP vars and active effects arrays after action
        if (isCurrentAttackerCharacter) {
            charCurrentHp = currentAttackerHp; oppCurrentHp = currentDefenderHp;
            charActiveEffects = currentAttackerActiveEffects; oppActiveEffects = currentDefenderActiveEffects;
        } else {
            oppCurrentHp = currentAttackerHp; charCurrentHp = currentDefenderHp;
            oppActiveEffects = currentAttackerActiveEffects; charActiveEffects = currentDefenderActiveEffects;
        }
        
        combatLog.push(`${character.name} HP: ${charCurrentHp}, ${opponent.name} HP: ${oppCurrentHp}`);
        if (charCurrentHp <= 0 || oppCurrentHp <= 0) break;

        // Swap roles for the next iteration's start-of-turn effects and action
        // This logic is slightly adjusted: each entity gets one full sequence of start-of-turn effects then action.
        // The original code structure had a double turn logic which might be confusing.
        // Simplified to one attacker per main loop iteration.
    } // End of while loop (turns)

    combatLog.push(`\n--- Battle End ---`);
    let winnerName = null;
    let calculatedRewards = null;

    if (charCurrentHp <= 0 && oppCurrentHp <= 0) {
        combatLog.push("Both combatants fell! It's a draw!"); winnerName = 'draw';
    } else if (charCurrentHp <= 0) {
        combatLog.push(`${opponent.name} wins!`); winnerName = 'opponent';
    } else if (oppCurrentHp <= 0) {
        combatLog.push(`${character.name} wins!`); winnerName = 'character';
        calculatedRewards = opponent.rewards; 
    } else if (turn >= MAX_TURNS) {
        combatLog.push("Maximum turns reached. The battle is a draw!"); winnerName = 'draw';
    }

    return {
        winner: winnerName,
        combatLog,
        finalCharHp: charCurrentHp,
        finalOppHp: oppCurrentHp,
        rewards: calculatedRewards 
    };
};

module.exports = {
    simulateCombat,
    ALL_ABILITIES // Exporting for potential use elsewhere, e.g. frontend display
};
