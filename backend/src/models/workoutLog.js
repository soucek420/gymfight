const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to the User model
  },
  exercise_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Exercise' // Reference to the Exercise model
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  duration: {
    type: Number
  },
  sets: {
    type: Number
  },
  reps: {
    type: Number
  },
  weight: {
    type: Number
  },
  calories_burned: {
    type: Number
  }
}, {
  timestamps: true
});

const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);

module.exports = WorkoutLog;