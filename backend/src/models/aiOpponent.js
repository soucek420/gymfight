const mongoose = require('mongoose');

const aiOpponentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  level: {
    type: Number,
    required: true,
    default: 1,
  },
  stats: {
    attack: { type: Number, required: true, default: 10 },
    defense: { type: Number, required: true, default: 5 },
    health_points: { type: Number, required: true, default: 50 },
    speed: { type: Number, required: true, default: 10 },
  },
  abilities: [
    { type: String } // Array of strings for now, can be references later
  ],
  rewards: {
    experience: { type: Number, default: 0 },
    currency: { type: Number, default: 0 },
    items: [ { type: String } ] // Array of strings or references to an Item model later
  }
}, {
  timestamps: true,
});

const AiOpponent = mongoose.model('AiOpponent', aiOpponentSchema);

module.exports = AiOpponent;