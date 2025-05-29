// frontend/src/components/DailySummary.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../authContext';
import fitnessApi from '../api/fitnessApi';

function DailySummary() {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  // TODO: Implement date selection. For now, defaulting to today.
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD format

  useEffect(() => {
    const fetchDailySummary = async () => {
      if (!user || !user.token) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fitnessApi.getDailySummary(selectedDate, user.token);
        setSummaryData(data);
      } catch (err) {
        console.error('Error fetching daily summary:', err);
        setError('Failed to fetch daily summary. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDailySummary();
    // Refetch when selectedDate or user.token changes
  }, [selectedDate, user ? user.token : null]); // Depend on selectedDate and user token

  // TODO: Add date picker functionality to change selectedDate state

  if (loading) {
    return <div>Loading daily summary...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!summaryData) {
      return <div>No summary data available for {selectedDate}.</div>
  }

  return (
    <div>
      <h3>Daily Summary for {selectedDate}</h3>
      <p>Calories Burned: {summaryData.totalCaloriesBurned.toFixed(2)}</p>
      <p>Calories Consumed: {summaryData.totalCaloriesConsumed.toFixed(2)}</p>
      <h4>Macronutrient Breakdown:</h4>
      <ul>
        <li>Proteins: {summaryData.totalProteinsConsumed.toFixed(2)} g</li>
        <li>Carbohydrates: {summaryData.totalCarbohydratesConsumed.toFixed(2)} g</li>
        <li>Fats: {summaryData.totalFatsConsumed.toFixed(2)} g</li>
      </ul>
      <p>Net Daily Calories: {summaryData.netDailyCalories.toFixed(2)}</p>
      {/* TODO: Optionally display lists of workout and diet logs for the day */}
    </div>
  );
}

export default DailySummary;