// backend/src/routes/dailySummaryRoutes.js

const express = require('express');
const router = express.Router();
const { getDailySummary } = require('../controllers/dailySummaryController');
const { protect } = require('../middleware/authMiddleware');

// This route will be protected
router.get('/:date', protect, getDailySummary);

module.exports = router;