// backend/src/routes/exerciseRoutes.js

const express = require('express');
const router = express.Router();
const { 
    getExercises, 
    createExercise, 
    createCustomExercise, 
    getCustomExercises 
} = require('../controllers/exerciseController');
const { protect } = require('../middleware/authMiddleware');

// Route for global exercises
// GET /api/exercises - Publicly get all global exercises
router.get('/', getExercises); 
// POST /api/exercises - Protected: Create a new global exercise (consider admin only in a real app)
router.post('/', protect, createExercise); 

// Routes for custom exercises for the logged-in user
// POST /api/exercises/custom - Protected: Create a new custom exercise
router.post('/custom', protect, createCustomExercise);
// GET /api/exercises/custom - Protected: Get user's custom exercises
router.get('/custom', protect, getCustomExercises);   

module.exports = router;
