// backend/src/routes/dietLogRoutes.js

const express = require('express');
const router = express.Router();
const { createDietLog, getDietLogs } = require('../controllers/dietLogController');
const { protect } = require('../middleware/authMiddleware');

// These routes will be protected
router.post('/', protect, createDietLog);
router.get('/user/:userId', protect, getDietLogs);
router.get('/user', protect, getDietLogs); // Add route for current user's logs

module.exports = router;