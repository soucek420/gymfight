// backend/src/routes/characterRoutes.js

const express = require('express');
const router = express.Router();
const { createCharacter, getCharacter } = require('../controllers/characterController');
const { protect } = require('../middleware/authMiddleware');

// These routes will be protected
router.post('/', protect, createCharacter);
router.get('/user/:userId', protect, getCharacter);

module.exports = router;