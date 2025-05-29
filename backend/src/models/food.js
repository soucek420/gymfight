const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true, // Removed for custom food items
    trim: true
  },
  user_id: { // Added field
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for global food items, user's ID for custom ones
  },
  isCustom: { // Added field
    type: Boolean,
    default: false // true for user-created food items
  },
  calories_per_100g: {
    type: Number,
    required: true
  },
  proteins_per_100g: {
    type: Number,
    required: true
  },
  carbohydrates_per_100g: {
    type: Number,
    required: true
  },
  fats_per_100g: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;