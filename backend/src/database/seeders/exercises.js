// backend/src/database/seeders/exercises.js

module.exports = [
  {
    name: "Running",
    description: "Running at a moderate pace.",
    category: "Cardio",
    default_calories_per_unit: 100, // example value per mile or 10 minutes
    unit: "minutes" // or "distance" with a unit like "miles" or "km"
  },
  {
    name: "Push-ups",
    description: "Bodyweight exercise for chest, shoulders, and triceps.",
    category: "Strength",
    default_calories_per_unit: 0.5, // example value per rep
    unit: "reps"
  },
  {
    name: "Squats",
    description: "Bodyweight exercise for lower body.",
    category: "Strength",
    default_calories_per_unit: 0.7, // example value per rep
    unit: "reps"
  },
  {
    name: "Weightlifting (General)",
    description: "General weightlifting session.",
    category: "Strength",
    default_calories_per_unit: 150, // example value per 30 minutes
    unit: "minutes"
  }
  // Add many more exercises here
];