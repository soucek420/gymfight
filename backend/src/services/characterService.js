// backend/src/services/characterService.js
const Character = require('../models/character');
const Exercise = require('../models/exercise'); 

// Predefined abilities for each character type (remains the same)
const characterAbilities = {
    Warrior: [
        { name: "Power Attack", level: 3 },
        { name: "Defensive Stance", level: 5 },
        { name: "Whirlwind", level: 10 }
    ],
    Mage: [
        { name: "Fireball", level: 3 },
        { name: "Heal", level: 5 },
        { name: "Teleport", level: 10 }
    ],
    Zombie: [
        { name: "Strong Bite", level: 3 },
        { name: "Regeneration Boost", level: 5 },
        { name: "Infect", level: 10 }
    ]
};

// Internal helper function to handle experience gain, leveling up, and ability unlocking
const _applyExperienceAndLevelUp = (character, experienceToAdd) => {
    if (!character) return; // Should not happen if called correctly

    // Ensure fields are initialized (important if character object is ever incomplete)
    character.experience = typeof character.experience === 'number' && !isNaN(character.experience) ? character.experience : 0;
    character.level = typeof character.level === 'number' && !isNaN(character.level) && character.level >= 1 ? character.level : 1;
    if (typeof character.stats !== 'object' || character.stats === null) {
        character.stats = { strength: 1, stamina: 1, speed: 1, health_points: 100 };
    }
    if (!Array.isArray(character.abilities)) {
        character.abilities = [];
    }

    if (experienceToAdd > 0) {
        const roundedExperienceGained = parseFloat(experienceToAdd.toFixed(2));
        character.experience += roundedExperienceGained;
        character.experience = parseFloat(character.experience.toFixed(2));
        console.log(`Gained ${roundedExperienceGained} XP. Total XP for ${character.name}: ${character.experience}`);
    }
    
    let experienceToNextLevel = character.level * 100 * (1 + (character.level - 1) * 0.1);
    experienceToNextLevel = parseFloat(experienceToNextLevel.toFixed(2));
    
    console.log(`${character.name} (Level ${character.level}) XP: ${character.experience}/${experienceToNextLevel}`);

    while (character.experience >= experienceToNextLevel && experienceToNextLevel > 0) { 
      const oldLevel = character.level;
      character.level += 1;
      const xpDeducted = experienceToNextLevel; 
      character.experience -= xpDeducted;
      character.experience = parseFloat(character.experience.toFixed(2)); 

      console.log(`Character ${character.name} leveled up from ${oldLevel} to level ${character.level}! XP deducted: ${xpDeducted}. Excess XP: ${character.experience}`);

      const levelUpBonuses = { strength: 2, stamina: 2, speed: 1, health_points: 10 }; 
      for (const stat in levelUpBonuses) {
        character.stats[stat] = (character.stats[stat] || 0) + levelUpBonuses[stat];
        character.stats[stat] = parseFloat(character.stats[stat].toFixed(2));
        console.log(`Level Up Bonus for ${character.name}: +${levelUpBonuses[stat]} ${stat}. New ${stat}: ${character.stats[stat]}`);
      }

      const abilitiesForType = characterAbilities[character.type] || [];
      abilitiesForType.forEach(ability => {
        if (character.level >= ability.level && !character.abilities.includes(ability.name)) {
          character.abilities.push(ability.name);
          console.log(`Character ${character.name} unlocked ability: "${ability.name}" at level ${character.level}`);
        }
      });

      experienceToNextLevel = character.level * 100 * (1 + (character.level - 1) * 0.1);
      experienceToNextLevel = parseFloat(experienceToNextLevel.toFixed(2));
      console.log(`XP needed for ${character.name} for next level (${character.level + 1}): ${experienceToNextLevel}`);
       if (experienceToNextLevel <= 0) { 
          console.warn(`Experience to next level for ${character.name} is ${experienceToNextLevel}, breaking leveling loop.`);
          break;
      }
    }
};


// Function to update character progression based on fitness data
const updateCharacterProgression = async (userId, fitnessData) => {
  try {
    const character = await Character.findOne({ user_id: userId });

    if (!character) {
      console.log(`Character not found for user ${userId} in updateCharacterProgression.`);
      return; // Or throw new Error('Character not found');
    }

    // Initialize fields (already done in _applyExperienceAndLevelUp but good for standalone use too)
    if (typeof character.level !== 'number' || isNaN(character.level) || character.level < 1) character.level = 1;
    if (typeof character.experience !== 'number' || isNaN(character.experience)) character.experience = 0;
    if (typeof character.stats !== 'object' || character.stats === null) {
        character.stats = { strength: 1, stamina: 1, speed: 1, health_points: 100 };
    } else {
        character.stats.strength = typeof character.stats.strength === 'number' && !isNaN(character.stats.strength) ? character.stats.strength : 1;
        character.stats.stamina = typeof character.stats.stamina === 'number' && !isNaN(character.stats.stamina) ? character.stats.stamina : 1;
        character.stats.speed = typeof character.stats.speed === 'number' && !isNaN(character.stats.speed) ? character.stats.speed : 1;
        character.stats.health_points = typeof character.stats.health_points === 'number' && !isNaN(character.stats.health_points) ? character.stats.health_points : 100;
    }
    if (!Array.isArray(character.abilities)) character.abilities = [];


    console.log(`Starting fitness progression for ${character.name} (Level ${character.level}). Initial XP: ${character.experience}`);

    let experienceGainedFromActivity = 0;
    let statIncreases = { strength: 0, stamina: 0, speed: 0, health_points: 0 };

    if (fitnessData.exercise_id) { 
      console.log(`Processing workout log for ${character.name}: ${JSON.stringify(fitnessData)}`);
      let exercise = null;
      if (fitnessData.exercise_id) {
          try { exercise = await Exercise.findById(fitnessData.exercise_id); } 
          catch (err) { console.warn(`Could not fetch exercise details for ${character.name}, ID ${fitnessData.exercise_id}: ${err.message}`);}
      }
      
      experienceGainedFromActivity = (fitnessData.calories_burned || 0) * 0.2; 

      if (fitnessData.weight && fitnessData.reps) {
        let strengthBonus = (fitnessData.weight * fitnessData.reps * (fitnessData.sets || 1)) * 0.005; 
        if (exercise && exercise.category && exercise.category.toLowerCase().includes("weightlifting")) strengthBonus *= 1.2; 
        statIncreases.strength += strengthBonus;
      }
      if (fitnessData.duration) {
        let staminaBonus = fitnessData.duration * 0.1; 
        if (exercise && exercise.category && exercise.category.toLowerCase().includes("cardio")) staminaBonus *= 1.3; 
        statIncreases.stamina += staminaBonus;
      }
      let speedBonus = (fitnessData.duration || 0) * 0.02; 
      if (exercise && exercise.name) {
        const exerciseNameLower = exercise.name.toLowerCase();
        if (exerciseNameLower.includes("run") || exerciseNameLower.includes("cycle") || exerciseNameLower.includes("sprint")) speedBonus += fitnessData.duration * 0.05; 
      }
      statIncreases.speed += speedBonus;
      statIncreases.health_points += (fitnessData.calories_burned || 0) * 0.02; 

    } else if (fitnessData.food_id) { 
      console.log(`Processing diet log for ${character.name}: ${JSON.stringify(fitnessData)}`);
      experienceGainedFromActivity = (fitnessData.proteins_consumed || 0) * 0.75 + (fitnessData.carbohydrates_consumed || 0) * 0.25;
      statIncreases.health_points += (fitnessData.calories_consumed || 0) * 0.05; 
      statIncreases.strength += (fitnessData.proteins_consumed || 0) * 0.03; 
      statIncreases.stamina += (fitnessData.carbohydrates_consumed || 0) * 0.04; 
    }

    // Apply direct stat increases from activity
    for (const stat in statIncreases) {
      if (statIncreases[stat] > 0) { 
        const increase = parseFloat(statIncreases[stat].toFixed(2));
        character.stats[stat] = (character.stats[stat] || 0) + increase; 
        character.stats[stat] = parseFloat(character.stats[stat].toFixed(2)); 
        console.log(`Stat ${stat} for ${character.name} increased by ${increase} to ${character.stats[stat]}`);
      }
    }
    // Ensure stats don't go below 0 after direct increases
    Object.keys(character.stats).forEach(statKey => {
        if (typeof character.stats[statKey] === 'number') {
            character.stats[statKey] = Math.max(0, character.stats[statKey]);
        }
    });

    // Apply experience gained and handle leveling
    _applyExperienceAndLevelUp(character, experienceGainedFromActivity);

    await character.save();
    console.log(`Fitness progression update complete for ${character.name}. Final XP: ${character.experience}, Level: ${character.level}`);

  } catch (error) {
    console.error(`Error updating character progression for user ${userId}:`, error.message, error.stack);
  }
};


// New function to apply combat outcome
const applyCombatOutcome = async (userId, combatResult) => {
    try {
        const character = await Character.findOne({ user_id: userId });
        if (!character) {
            console.error(`Character not found for user ${userId} in applyCombatOutcome.`);
            // Depending on desired error handling, you might throw or return an error object
            return { error: 'Character not found' }; 
        }

        console.log(`Applying combat outcome for ${character.name}. Initial XP: ${character.experience}, Level: ${character.level}`);

        if (combatResult && combatResult.rewards && combatResult.rewards.experience > 0) {
            _applyExperienceAndLevelUp(character, combatResult.rewards.experience);
        }

        // TODO: Handle currency rewards: character.currency += combatResult.rewards.currency;
        if (combatResult && combatResult.rewards && combatResult.rewards.currency > 0) {
            character.currency = (character.currency || 0) + combatResult.rewards.currency;
            console.log(`${character.name} gained ${combatResult.rewards.currency} currency. Total: ${character.currency}`);
        }
        
        // TODO: Handle item rewards: character.inventory.push(...combatResult.rewards.items);
        if (combatResult && combatResult.rewards && combatResult.rewards.items && combatResult.rewards.items.length > 0) {
            // Assuming character.inventory is an array of strings or objects
            // For simplicity, let's assume it's an array of strings for item names
            if (!Array.isArray(character.inventory)) character.inventory = [];
            character.inventory.push(...combatResult.rewards.items);
            console.log(`${character.name} received items: ${combatResult.rewards.items.join(', ')}`);
        }


        await character.save();
        console.log(`Combat outcome applied for ${character.name}. Final XP: ${character.experience}, Level: ${character.level}`);

        return {
            experience: character.experience,
            level: character.level,
            stats: character.stats,
            abilities: character.abilities,
            currency: character.currency,
            inventory: character.inventory
        };

    } catch (error) {
        console.error(`Error applying combat outcome for user ${userId}:`, error.message, error.stack);
        // Return an error object or throw, depending on how controller wants to handle it
        return { error: `Failed to apply combat outcome: ${error.message}` };
    }
};

module.exports = { updateCharacterProgression, applyCombatOutcome, characterAbilities }; // Export characterAbilities if needed by other services like combatService (though it might have its own copy)
