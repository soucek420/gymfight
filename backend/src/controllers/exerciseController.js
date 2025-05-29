// backend/src/controllers/exerciseController.js

const Exercise = require('../models/exercise');

// @desc    Get all GLOBAL exercises
// @route   GET /api/exercises
// @access  Public
const getExercises = async (req, res) => {
  try {
    // Fetch exercises that are not custom (i.e., global)
    const exercises = await Exercise.find({ isCustom: false, user_id: null });
    res.status(200).json(exercises);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error fetching global exercises' });
  }
};

// @desc    Create a new GLOBAL exercise (for admin/seeding purposes)
// @route   POST /api/exercises (This route might need to be admin-protected)
// @access  Private (potentially admin-only)
const createExercise = async (req, res) => {
    try {
        const { name, description, category, default_calories_per_unit, unit } = req.body;

        // Basic validation for global exercises
        if (!name || !description || !category || default_calories_per_unit === undefined || !unit) {
            return res.status(400).json({ message: 'Please fill in all required exercise fields for global exercise' });
        }

        // For global exercises, names should be unique among global exercises
        const exerciseExists = await Exercise.findOne({ name, isCustom: false, user_id: null });
        if (exerciseExists) {
            return res.status(400).json({ message: 'Global exercise with that name already exists' });
        }

        const exercise = await Exercise.create({
            name,
            description,
            category,
            default_calories_per_unit,
            unit,
            isCustom: false, // Explicitly global
            user_id: null    // Explicitly global
        });

        res.status(201).json(exercise);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error creating global exercise' });
    }
};

// @desc    Create a new CUSTOM exercise for the logged-in user
// @route   POST /api/exercises/custom (To be defined in routes)
// @access  Private (requires authentication via 'protect' middleware)
const createCustomExercise = async (req, res) => {
    try {
        const { name, description, category, default_calories_per_unit, unit } = req.body;

        // Basic validation for custom exercises
        if (!name || !description || !category || default_calories_per_unit === undefined || !unit) {
            return res.status(400).json({ message: 'Please fill in all required fields for custom exercise' });
        }

        // Note: As per requirements, not enforcing (name, user_id) uniqueness for simplicity for now.
        // If needed later, a check like this could be added:
        // const existingCustomExerciseForUser = await Exercise.findOne({ name, user_id: req.user.id, isCustom: true });
        // if (existingCustomExerciseForUser) {
        //     return res.status(400).json({ message: 'You already have a custom exercise with this name.' });
        // }

        const customExercise = await Exercise.create({
            name,
            description,
            category,
            default_calories_per_unit,
            unit,
            isCustom: true,
            user_id: req.user.id // req.user.id is populated by the 'protect' auth middleware
        });

        res.status(201).json(customExercise);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error creating custom exercise' });
    }
};

// @desc    Get all CUSTOM exercises for the logged-in user
// @route   GET /api/exercises/custom (To be defined in routes)
// @access  Private (requires authentication via 'protect' middleware)
const getCustomExercises = async (req, res) => {
    try {
        const customExercises = await Exercise.find({ user_id: req.user.id, isCustom: true });
        res.status(200).json(customExercises);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error fetching custom exercises' });
    }
};


module.exports = { getExercises, createExercise, createCustomExercise, getCustomExercises };
