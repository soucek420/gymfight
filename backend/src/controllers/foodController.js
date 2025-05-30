// backend/src/controllers/foodController.js

const fs = require('fs');
const path = require('path');
const Food = require('../models/food'); // This line should be kept

// @desc    Get all GLOBAL food items
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res) => {
  try {
    const foodsPath = path.join(__dirname, '..', 'data', 'hardcodedFoods.json');
    const fileContent = fs.readFileSync(foodsPath, 'utf8');
    const foods = JSON.parse(fileContent);
    res.status(200).json(foods);
  } catch (error) {
    console.error('Error reading or parsing hardcodedFoods.json:', error);
    if (error.code === 'ENOENT') {
      res.status(500).json({ message: 'Error: Global foods data file not found.', error: error.message });
    } else if (error instanceof SyntaxError) {
      res.status(500).json({ message: 'Error: Failed to parse global foods data.', error: error.message });
    } else {
      res.status(500).json({ message: 'Server Error fetching foods', error: error.message });
    }
  }
};

// @desc    Create a new GLOBAL food item (for admin/seeding purposes)
// @route   POST /api/foods (This route might need to be admin-protected)
// @access  Private (potentially admin-only)
const createFood = async (req, res) => {
    try {
        const { name, calories_per_100g, proteins_per_100g, carbohydrates_per_100g, fats_per_100g } = req.body;

        // Basic validation for global food items
        if (!name || calories_per_100g === undefined || proteins_per_100g === undefined || carbohydrates_per_100g === undefined || fats_per_100g === undefined) {
            return res.status(400).json({ message: 'Please include all required fields for global food item' });
        }

        // For global food items, names should be unique among global items
        const foodExists = await Food.findOne({ name, isCustom: false, user_id: null });
        if (foodExists) {
            return res.status(400).json({ message: 'Global food item with that name already exists' });
        }

        const food = await Food.create({
            name,
            calories_per_100g,
            proteins_per_100g,
            carbohydrates_per_100g,
            fats_per_100g,
            isCustom: false, // Explicitly global
            user_id: null    // Explicitly global
        });

        res.status(201).json(food);
    } catch (error) {
        console.error('Error creating global food item:', error);
        res.status(500).json({ message: 'Server Error creating global food item', error: error.message });
    }
};

// @desc    Create a new CUSTOM food item for the logged-in user
// @route   POST /api/foods/custom (To be defined in routes)
// @access  Private (requires authentication via 'protect' middleware)
const createCustomFood = async (req, res) => {
    try {
        const { name, calories_per_100g, proteins_per_100g, carbohydrates_per_100g, fats_per_100g } = req.body;

        // Basic validation for custom food items
        if (!name || calories_per_100g === undefined || proteins_per_100g === undefined || carbohydrates_per_100g === undefined || fats_per_100g === undefined) {
            return res.status(400).json({ message: 'Please include all required fields for custom food item' });
        }
        
        const customFood = await Food.create({
            name,
            calories_per_100g,
            proteins_per_100g,
            carbohydrates_per_100g,
            fats_per_100g,
            isCustom: true,
            user_id: req.user.id // req.user.id is populated by the 'protect' auth middleware
        });

        res.status(201).json(customFood);
    } catch (error) {
        console.error('Error creating custom food item:', error);
        res.status(500).json({ message: 'Server Error creating custom food item', error: error.message });
    }
};

// @desc    Get all CUSTOM food items for the logged-in user
// @route   GET /api/foods/custom (To be defined in routes)
// @access  Private (requires authentication via 'protect' middleware)
const getCustomFoods = async (req, res) => {
    try {
        const customFoods = await Food.find({ user_id: req.user.id, isCustom: true });
        res.status(200).json(customFoods);
    } catch (error) {
        console.error('Error fetching custom food items:', error);
        res.status(500).json({ message: 'Server Error fetching custom food items', error: error.message });
    }
};

module.exports = { getFoods, createFood, createCustomFood, getCustomFoods };
