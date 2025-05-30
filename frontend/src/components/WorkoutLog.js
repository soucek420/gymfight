// frontend/src/components/WorkoutLog.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../authContext';
import fitnessApi from '../api/fitnessApi';

function WorkoutLog() {
  const [formData, setFormData] = useState({
    exercise_id: '',
    date: '',
    duration: '',
    sets: '',
    reps: '',
    weight: '',
  });

  const [exercises, setExercises] = useState([]);
  const { user } = useAuth(); 
  const [message, setMessage] = useState('');
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);

  const { exercise_id, date, duration, sets, reps, weight } = formData;

  useEffect(() => {
    const fetchExercises = async () => {
      if (!user || !user.token) {
        // Don't fetch if user is not available yet
        return;
      }
      setIsLoadingExercises(true);
      setMessage('');
      try {
        const globalExercisesPromise = fitnessApi.getExercises();
        const customExercisesPromise = fitnessApi.getCustomExercises(user.token);

        const [globalExercises, customExercises] = await Promise.all([
            globalExercisesPromise,
            customExercisesPromise
        ]);

        const formattedCustomExercises = customExercises.map(ex => ({
            ...ex,
            name: `[Custom] ${ex.name}` 
        }));
        
        setExercises([...globalExercises, ...formattedCustomExercises]);

      } catch (error) {
        console.error('Error fetching exercises:', error);
        setMessage(error.message || 'Error fetching exercises. Please try again later.');
        setExercises([]); // Clear exercises on error
      } finally {
        setIsLoadingExercises(false);
      }
    };

    fetchExercises();
  }, [user]); // Depend on user to re-fetch if user logs in/out

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!user || !user.token) {
      console.error('User not authenticated');
      setMessage('User not authenticated. Please log in.');
      return;
    }
     if (!exercise_id) {
      setMessage('Please select an exercise.');
      return;
    }
    if (!date) {
        setMessage('Please select a date.');
        return;
    }


    const workoutData = {
      exercise_id,
      date,
      duration: duration ? parseInt(duration) : undefined,
      sets: sets ? parseInt(sets) : undefined,
      reps: reps ? parseInt(reps) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
    };

    // Filter out undefined fields to send cleaner data to backend
    const cleanWorkoutData = Object.fromEntries(
        Object.entries(workoutData).filter(([_, v]) => v !== undefined && v !== '')
    );


    try {
      await fitnessApi.createWorkoutLog(cleanWorkoutData, user.token);
      setMessage('Workout log created successfully!');
      setFormData({
        exercise_id: '',
        date: '',
        duration: '',
        sets: '',
        reps: '',
        weight: '',
      });
    } catch (error) {
      console.error('Error creating workout log:', error);
      setMessage(error.message || 'Error creating workout log. Please check your input and try again.');
    }
  };

  return (
    <div className="log-form-container">
      <h3>Log Workout</h3>
      {message && <p className={message.startsWith('Error') ? "error-message" : "success-message"}>{message}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="exercise_id">Exercise:</label>
          <select
            name="exercise_id"
            id="exercise_id"
            value={exercise_id}
            onChange={onChange}
            required
            disabled={isLoadingExercises}
          >
            <option value="">{isLoadingExercises ? "Loading exercises..." : "Select Exercise"}</option>
            {exercises.map(exercise => (
                <option key={exercise._id} value={exercise._id}>
                    {exercise.name} 
                </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="duration">Duration (minutes):</label>
          <input
            type="number"
            name="duration"
            id="duration"
            value={duration}
            min="0"
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="sets">Sets:</label>
          <input
            type="number"
            name="sets"
            id="sets"
            value={sets}
            min="0"
            onChange={onChange}
          />
        </div>
         <div>
          <label htmlFor="reps">Reps:</label>
          <input
            type="number"
            name="reps"
            id="reps"
            value={reps}
            min="0"
            onChange={onChange}
          />
        </div>
         <div>
          <label htmlFor="weight">Weight (kg/lbs):</label>
          <input
            type="number"
            name="weight"
            id="weight"
            value={weight}
            min="0"
            step="0.01"
            onChange={onChange}
          />
        </div>
        <button type="submit">Log Workout</button>
      </form>
    </div>
  );
}

export default WorkoutLog;
