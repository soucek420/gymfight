// backend/src/controllers/dailySummaryController.js

const WorkoutLog = require('../models/workoutLog');
const DietLog = require('../models/dietLog');

// @desc    Get daily fitness summary for a user
// @route   GET /api/dailysummary/:date
// @access  Private (requires authentication)
const getDailySummary = async (req, res) => {
  try {
    // Assuming user ID is available from authenticated request (e.g., req.user.id)
    const user_id = req.user.id; // This assumes authentication middleware is in place
    const { date } = req.params;

    // Parse the date parameter
    const summaryDate = new Date(date);
    if (isNaN(summaryDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
    }

    // Set time to the beginning and end of the day for the query
    const startOfDay = new Date(summaryDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(summaryDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch workout logs for the day
    const dailyWorkouts = await WorkoutLog.find({
      user_id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // Fetch diet logs for the day
    const dailyDiet = await DietLog.find({
      user_id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // Calculate total calories burned
    const totalCaloriesBurned = dailyWorkouts.reduce((sum, log) => sum + log.calories_burned, 0);

    // Calculate total consumed calories and macronutrients
    const totalCaloriesConsumed = dailyDiet.reduce((sum, log) => sum + log.calories_consumed, 0);
    const totalProteinsConsumed = dailyDiet.reduce((sum, log) => sum + log.proteins_consumed, 0);
    const totalCarbohydratesConsumed = dailyDiet.reduce((sum, log) => sum + log.carbohydrates_consumed, 0);
    const totalFatsConsumed = dailyDiet.reduce((sum, log) => sum + log.fats_consumed, 0);

    // Calculate net daily calorie intake
    const netDailyCalories = totalCaloriesConsumed - totalCaloriesBurned;

    res.status(200).json({
      date: summaryDate.toISOString().split('T')[0], // Return date in YYYY-MM-DD format
      totalCaloriesBurned,
      totalCaloriesConsumed,
      totalProteinsConsumed,
      totalCarbohydratesConsumed,
      totalFatsConsumed,
      netDailyCalories,
      workoutLogs: dailyWorkouts, // Optionally include the logs as well
      dietLogs: dailyDiet,      // Optionally include the logs as well
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getDailySummary };