// backend/src/routes/combatRoutes.js

const express = require('express');
const router = express.Router();
const { startCombat, getAiOpponents } = require('../controllers/combatController');
const { protect } = require('../middleware/authMiddleware');

// This route will be protected
router.post('/', protect, startCombat);
router.get('/aiOpponents',protect, getAiOpponents);

module.exports = router;