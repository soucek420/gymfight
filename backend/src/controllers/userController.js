// backend/src/controllers/userController.js

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic input validation
    if (!username) { return res.status(400).json({ message: 'Username is required.' }); }
    if (!email) { return res.status(400).json({ message: 'Email is required.' }); }
    if (!password) { return res.status(400).json({ message: 'Password is required.' }); }
    if (password.length < 8) { return res.status(400).json({ message: 'Password must be at least 8 characters long.' }); } // Updated length
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) { return res.status(400).json({ message: 'Password must contain at least one uppercase letter.' }); } // New check
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) { return res.status(400).json({ message: 'Please enter a valid email address.' }); }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user and get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email) { return res.status(400).json({ message: 'Email is required.' }); }
    if (!password) { return res.status(400).json({ message: 'Password is required.' }); }

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id) // Generate JWT
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

module.exports = { registerUser, loginUser };