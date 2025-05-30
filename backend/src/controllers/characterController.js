// backend/src/controllers/characterController.js

const Character = require('../models/character');
const User = require('../models/user'); // Import User model if needed for validation

// @desc    Create new character
// @route   POST /api/characters
// @access  Private (requires authentication)
const createCharacter = async (req, res) => {
  try {
    // Assuming user ID is available from authenticated request (e.g., req.user.id)
    const user_id = req.user.id; // This assumes authentication middleware is in place
    const { name, type } = req.body;

    // Basic validation
    if (!name || !type) {
      return res.status(400).json({ message: 'Please include character name and type' });
    }

    // Check if user already has a character
    const existingCharacter = await Character.findOne({ user_id });

    if (existingCharacter) {
      return res.status(400).json({ message: 'User already has a character' });
    }

    // Define base stats and abilities based on character type
    let baseStats = {};
    let baseAbilities = [];

    switch (type) {
      case 'Warrior':
        baseStats = { strength: 15, stamina: 10, speed: 5, health_points: 120 };
        baseAbilities = ['Basic Attack', 'Warrior Stance'];
        break;
      case 'Mage':
        baseStats = { strength: 5, stamina: 8, speed: 7, health_points: 80 };
        baseAbilities = ['Basic Spell', 'Arcane Shield'];
        break;
      case 'Zombie':
        baseStats = { strength: 12, stamina: 15, speed: 3, health_points: 150 };
        baseAbilities = ['Lunge Attack', 'Regenerate'];
        break;
      default:
        baseStats = { strength: 8, stamina: 8, speed: 8, health_points: 100 };
        baseAbilities = ['Basic Attack'];
        break;
    }

    const character = await Character.create({
      user_id,
      name,
      type,
      stats: baseStats,
      abilities: baseAbilities
    });

    res.status(201).json(character);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's character
// @route   GET /api/characters/:userId
// @access  Private (requires authentication)
const getCharacter = async (req, res) => {
    try {
        const user_id = req.params.userId; // Or req.user.id from middleware

        const character = await Character.findOne({ user_id });

        if (!character) {
            return res.status(404).json({ message: 'Character not found for this user' });
        }

        res.status(200).json(character);

    } catch (error) {
        console.error('Error fetching character data:', error);
        res.status(500).json({ message: 'Server Error fetching character data', error: error.message }); // Include error message in response
    }
};

module.exports = { createCharacter, getCharacter };