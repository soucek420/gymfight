// backend/src/routes/workoutLogRoutes.js

const express = require('express');
const router = express.Router();
const { createWorkoutLog, getWorkoutLogs } = require('../controllers/workoutLogController');
const { protect } = require('../middleware/authMiddleware');

// These routes will be protected
router.post('/', protect, createWorkoutLog);
router.get('/user/:userId', protect, getWorkoutLogs);
router.get('/user', protect, getWorkoutLogs); // Add route for current user's logs

module.exports = router;