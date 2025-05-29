// backend/src/controllers/combatController.js

const Character = require('../models/character');
const AiOpponent = require('../models/aiOpponent');
const combatService = require('../services/combatService');
const characterService = require('../services/characterService'); // Import characterService

// @desc    Start a combat simulation
// @route   POST /api/combat
// @access  Private (requires authentication)
const startCombat = async (req, res) => {
  try {
    const user_id = req.user.id; 
    const { aiOpponentId } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: 'User ID not found in request. Ensure you are logged in.' });
    }
    if (!aiOpponentId) {
        return res.status(400).json({ message: 'aiOpponentId is required.' });
    }

    const character = await Character.findOne({ user_id });
    if (!character) {
      return res.status(404).json({ message: 'Character not found for this user' });
    }

    const aiOpponent = await AiOpponent.findById(aiOpponentId);
    if (!aiOpponent) {
      return res.status(404).json({ message: 'AI Opponent not found' });
    }

    // Pass full character and opponent objects to simulateCombat
    const combatResult = await combatService.simulateCombat(character, aiOpponent);

    if (combatResult.error) { // Handle potential errors from simulateCombat itself
        return res.status(500).json({ message: combatResult.error });
    }

    // If character wins, apply combat outcome using characterService
    if (combatResult.winner === 'character') {
      // Pass character.user_id as applyCombatOutcome expects userId
      const finalCharacterState = await characterService.applyCombatOutcome(character.user_id, combatResult);
      if (finalCharacterState && !finalCharacterState.error) {
        combatResult.updatedCharacter = finalCharacterState;
      } else if (finalCharacterState && finalCharacterState.error) {
        // Log the error from characterService but proceed with sending combatResult
        console.error(`Error applying combat outcome for user ${character.user_id}: ${finalCharacterState.error}`);
        // Optionally, you might want to reflect this error to the client more directly
        // For now, the combatResult is sent, and updatedCharacter might be missing or indicate an issue
      }
    }
    
    // Attach opponent details to the combat result for frontend display (if not already there)
    // This was in the previous version, ensuring it's still useful.
    if (!combatResult.opponentDetails) {
        combatResult.opponentDetails = {
            name: aiOpponent.name,
            level: aiOpponent.level,
            type: aiOpponent.type || "AI Monster", 
            stats: aiOpponent.stats
        };
    }

    res.status(200).json(combatResult);

  } catch (error) {
    console.error('Error in startCombat controller:', error.message, error.stack);
    res.status(500).json({ message: 'Server Error starting combat' });
  }
};

// @desc    Get AI opponents, optionally filtered by player level
// @route   GET /api/combat/aiopponents (or /api/aiopponents depending on actual route file)
// @access  Public (or Private if auth needed)
const getAiOpponents = async (req, res) => {
    try {
        let query = {};
        const playerLevelStr = req.query.playerLevel;

        if (playerLevelStr) {
            const playerLevel = parseInt(playerLevelStr, 10);
            if (!isNaN(playerLevel) && playerLevel > 0) {
                const minLevel = Math.max(1, playerLevel - 2); 
                const maxLevel = playerLevel + 3;
                query = { level: { $gte: minLevel, $lte: maxLevel } };
                console.log(`Fetching AI opponents for player level ${playerLevel} (range: ${minLevel}-${maxLevel})`);
            } else {
                console.log('Invalid playerLevel query parameter. Fetching all AI opponents.');
            }
        } else {
            console.log('No playerLevel query parameter. Fetching all AI opponents.');
        }

        const aiOpponents = await AiOpponent.find(query);
        res.status(200).json(aiOpponents);
    } catch (error) {
        console.error('Error fetching AI opponents:', error.message);
        res.status(500).json({ message: 'Server Error fetching AI opponents' });
    }
};

module.exports = { startCombat, getAiOpponents };
