// backend/src/routes/foodRoutes.js

const express = require('express');
const router = express.Router();
const { 
    getFoods, 
    createFood, 
    createCustomFood, 
    getCustomFoods 
} = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

// Route for global food items
// GET /api/foods - Publicly get all global food items
router.get('/', getFoods); 
// POST /api/foods - Protected: Create a new global food item (consider admin only in a real app)
router.post('/', protect, createFood); 

// Routes for custom food items for the logged-in user
// POST /api/foods/custom - Protected: Create a new custom food item
router.post('/custom', protect, createCustomFood);
// GET /api/foods/custom - Protected: Get user's custom food items
router.get('/custom', protect, getCustomFoods);   

module.exports = router;
