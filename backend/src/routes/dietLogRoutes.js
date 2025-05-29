// backend/src/routes/dietLogRoutes.js

const express = require('express');
const router = express.Router();
const { createDietLog, getDietLogs } = require('../controllers/dietLogController');
const { protect } = require('../middleware/authMiddleware');

// These routes will be protected
router.post('/', protect, createDietLog);
router.get('/user/:userId', protect, getDietLogs);

module.exports = router;