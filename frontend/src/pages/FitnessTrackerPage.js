// frontend/src/pages/FitnessTrackerPage.js
import React, { useState } from 'react';
import WorkoutLog from '../components/WorkoutLog';
import DietLog from '../components/DietLog';
import DailySummary from '../components/DailySummary';
import CustomExerciseForm from '../components/CustomExerciseForm';
import CustomFoodForm from '../components/CustomFoodForm';
import ProgressGraphs from '../components/ProgressGraphs'; // Import the new component
import './FitnessTrackerPage.css';

function FitnessTrackerPage() {
  const [showCustomExerciseForm, setShowCustomExerciseForm] = useState(false);
  const [showCustomFoodForm, setShowCustomFoodForm] = useState(false);

  return (
    <div className="fitness-tracker-page">
      <h2>Fitness Tracker</h2>
      <p>Track your workouts and diet to enhance your character!</p>
      
      <div className="custom-forms-section">
        <button 
          onClick={() => setShowCustomExerciseForm(!showCustomExerciseForm)}
          aria-expanded={showCustomExerciseForm}
          aria-controls="custom-exercise-form-area"
          className="toggle-form-button"
        >
          {showCustomExerciseForm ? 'Hide' : 'Show'} Create Custom Exercise Form
        </button>
        {showCustomExerciseForm && (
          <div id="custom-exercise-form-area" className="form-area">
            <CustomExerciseForm />
          </div>
        )}

        <button 
          onClick={() => setShowCustomFoodForm(!showCustomFoodForm)}
          aria-expanded={showCustomFoodForm}
          aria-controls="custom-food-form-area"
          className="toggle-form-button"
        >
          {showCustomFoodForm ? 'Hide' : 'Show'} Create Custom Food Form
        </button>
        {showCustomFoodForm && (
          <div id="custom-food-form-area" className="form-area">
            <CustomFoodForm />
          </div>
        )}
      </div>

      <div className="log-section">
        <WorkoutLog />
      </div>
      <div className="log-section">
        <DietLog />
      </div>
      <div className="summary-section">
        <DailySummary />
      </div>
      
      <div className="graphs-section"> {/* New section for graphs */}
        <h3>Your Progress Overview</h3>
        <ProgressGraphs />
      </div>
      
    </div>
  );
}

export default FitnessTrackerPage;
