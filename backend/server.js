// GYMFIGHT/backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/database/connection'); // Adjusted path

// Import routes
const characterRoutes = require('./src/routes/characterRoutes');
const combatRoutes = require('./src/routes/combatRoutes');
const dailySummaryRoutes = require('./src/routes/dailySummaryRoutes');
const dietLogRoutes = require('./src/routes/dietLogRoutes');
const exerciseRoutes = require('./src/routes/exerciseRoutes');
const foodRoutes = require('./src/routes/foodRoutes');
const userRoutes = require('./src/routes/userRoutes');
const workoutLogRoutes = require('./src/routes/workoutLogRoutes');

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies

// Basic Route to check if server is running
app.get('/', (req, res) => {
  res.send('Gym Fight Backend API is running...');
});

// Use Routes
// Make sure the base paths here match what your frontend API calls expect
app.use('/api/characters', characterRoutes);
app.use('/api/combat', combatRoutes);
app.use('/api/dailysummary', dailySummaryRoutes);
app.use('/api/dietlog', dietLogRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workoutlog', workoutLogRoutes);


// Define Port
const PORT = process.env.PORT || 5001;

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
