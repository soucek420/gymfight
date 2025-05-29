const mongoose = require('mongoose');

const dietLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to the User model
  },
  food_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Food' // Reference to the Food model
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  quantity: {
    type: Number,
    required: true
  },
  calories_consumed: {
    type: Number,
    required: true
  },
  proteins_consumed: {
    type: Number,
    required: true
  },
  carbohydrates_consumed: {
    type: Number,
    required: true
  },
  fats_consumed: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const DietLog = mongoose.model('DietLog', dietLogSchema);

module.exports = DietLog;