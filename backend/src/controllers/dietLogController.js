// backend/src/controllers/dietLogController.js

const DietLog = require('../models/dietLog');
const Food = require('../models/food');
const { updateCharacterProgression } = require('../services/characterService');

// @desc    Create new diet log
// @route   POST /api/dietlogs
// @access  Private (will add authentication middleware later)
const createDietLog = async (req, res) => {
  try {
    // Assuming user ID is available from authenticated request (e.g., req.user.id)
    const user_id = req.user.id; // This assumes authentication middleware is in place
    const { food_id, date, quantity } = req.body;

    // Basic validation
    if (!food_id || !date || !quantity) {
      return res.status(400).json({ message: 'Please include food, date, and quantity' });
    }

    // Find the food item to calculate nutritional values
    const food = await Food.findById(food_id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Calculate nutritional values based on quantity (in grams)
    const quantityIn100g = quantity / 100;
    const calories_consumed = food.calories_per_100g * quantityIn100g;
    const proteins_consumed = food.proteins_per_100g * quantityIn100g;
    const carbohydrates_consumed = food.carbohydrates_per_100g * quantityIn100g;
    const fats_consumed = food.fats_per_100g * quantityIn100g;

    const dietLog = await DietLog.create({
      user_id,
      food_id,
      date,
      quantity,
      calories_consumed,
      proteins_consumed,
      carbohydrates_consumed,
      fats_consumed,
    });


    // Call the character progression service
    // Ensure updateCharacterProgression has its own error handling
    // so it doesn't crash this main request if it fails.
    if (updateCharacterProgression) { // Check if the function is imported correctly
        await updateCharacterProgression(user_id, dietLog);
    } else {
        console.warn("updateCharacterProgression function not available or not imported correctly.");
    }

    res.status(201).json(dietLog);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get diet logs for a user
// @access  Private (will add authentication middleware later)
const getDietLogs = async (req, res) => {
    try {
        // Use userId from params if available, otherwise use authenticated user's ID
        const user_id = req.params.userId || req.user.id;

        const dietLogs = await DietLog.find({ user_id }).populate('food_id'); // Populate to get food details

        res.status(200).json(dietLogs);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createDietLog, getDietLogs };