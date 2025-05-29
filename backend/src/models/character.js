const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to the User model
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  stats: {
    strength: { type: Number, default: 1 },
    stamina: { type: Number, default: 1 },
    speed: { type: Number, default: 1 },
    health_points: { type: Number, default: 100 }
  },
  abilities: [
    { type: String } // Array of strings for now, can be references later
  ]
}, {
  timestamps: true
});

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;