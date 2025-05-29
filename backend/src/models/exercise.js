const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true, // Removed for custom exercises, uniqueness managed by combination of name and user_id if needed, or allow duplicates for custom.
    trim: true
  },
  user_id: { // Added field
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for global exercises, user's ID for custom ones
  },
  isCustom: { // Added field
    type: Boolean,
    default: false // true for user-created exercises
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  default_calories_per_unit: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;