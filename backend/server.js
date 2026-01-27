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
connectDB().catch(err => {
  console.error("Failed to connect to database:", err);
  process.exit(1); // Exit the process if database connection fails
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic Route to check if server is running
app.get('/', (req, res) => {
  res.send('Gym Fight Backend API is running...');
});

// Use Routes
// Make sure the base paths here match what your frontend API calls expect
app.use('/api/characters', characterRoutes);
app.use('/api/combat', combatRoutes);
app.use('/api/dailysummary', dailySummaryRoutes);
app.use('/api/dietlogs', dietLogRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workoutlogs', workoutLogRoutes);

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Define Port
const PORT = process.env.PORT || 5001;

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
