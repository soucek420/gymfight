// backend/src/controllers/workoutLogController.js

const WorkoutLog = require('../models/workoutLog');
const Exercise = require('../models/exercise');
const { updateCharacterProgression } = require('../services/characterService'); // Assuming this path is correct

// @desc    Create new workout log
// @route   POST /api/workoutlogs
// @access  Private
const createWorkoutLog = async (req, res) => {
  try {
    const user_id = req.user.id; 
    const { exercise_id, date, duration, sets, reps, weight } = req.body;

    if (!exercise_id || !date) {
      return res.status(400).json({ message: 'Please include exercise and date' });
    }

    const exercise = await Exercise.findById(exercise_id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    let caloriesBurned = 0;
    const numDuration = Number(duration) || 0;
    const numSets = Number(sets) || 1; // Default to 1 set if not provided or 0
    const numReps = Number(reps) || 0;
    const numWeight = Number(weight) || 0;

    if (exercise.unit === 'minutes') {
      // Assumes exercise.default_calories_per_unit is defined as 'calories burned per minute'.
      caloriesBurned = exercise.default_calories_per_unit * numDuration;
    } else if (exercise.unit === 'reps') {
      // Assumes exercise.default_calories_per_unit is 'calories burned per repetition'. Total reps = reps * sets.
      caloriesBurned = exercise.default_calories_per_unit * numReps * numSets;
    } else if (exercise.unit === 'weight') {
      // Assumes default_calories_per_unit is 'calories per rep' for the base movement. 
      // Weight acts as an intensity multiplier. This is an estimation.
      caloriesBurned = exercise.default_calories_per_unit * numReps * numSets * (1 + numWeight / 100);
    }

    // Ensure caloriesBurned is non-negative and rounded
    caloriesBurned = Math.max(0, caloriesBurned);
    caloriesBurned = parseFloat(caloriesBurned.toFixed(2));

    const workoutLogData = {
      user_id,
      exercise_id,
      date,
      calories_burned: caloriesBurned,
    };

    // Add optional fields only if they have values
    if (duration) workoutLogData.duration = numDuration;
    if (sets) workoutLogData.sets = numSets; // Use numSets which defaults to 1 if original sets was 0 or undefined
    if (reps) workoutLogData.reps = numReps;
    if (weight) workoutLogData.weight = numWeight;


    const workoutLog = await WorkoutLog.create(workoutLogData);

    // Call the character progression service
    // Ensure updateCharacterProgression has its own error handling
    // so it doesn't crash this main request if it fails.
    if (updateCharacterProgression) { // Check if the function is imported correctly
        await updateCharacterProgression(user_id, workoutLog);
    } else {
        console.warn("updateCharacterProgression function not available or not imported correctly.");
    }
    

    res.status(201).json(workoutLog);

  } catch (error) {
    console.error('Error in createWorkoutLog:', error.message, error.stack);
    res.status(500).json({ message: 'Server Error creating workout log' });
  }
};

// @desc    Get workout logs for a user
// @access  Private
const getWorkoutLogs = async (req, res) => {
    try {
        // Assuming user ID comes from the protect middleware
        const user_id = req.user.id; 

        const workoutLogs = await WorkoutLog.find({ user_id }).populate('exercise_id', 'name unit'); // Populate to get exercise details

        res.status(200).json(workoutLogs);

    } catch (error) {
        console.error('Error in getWorkoutLogs:', error.message);
        res.status(500).json({ message: 'Server Error fetching workout logs' });
    }
};

module.exports = { createWorkoutLog, getWorkoutLogs };
