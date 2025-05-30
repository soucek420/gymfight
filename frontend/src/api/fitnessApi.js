// frontend/src/api/fitnessApi.js
import axios from 'axios';
import { handleApiError } from './apiErrorUtils';

// Set the base URL for API requests
axios.defaults.baseURL = 'http://localhost:5001';

const API_URL_EXERCISES = '/api/exercises';
const API_URL_WORKOUT_LOGS = '/api/workoutlogs';
const API_URL_DIET_LOGS = '/api/dietlogs';
const API_URL_FOODS = '/api/foods';
const API_URL_DAILY_SUMMARY = '/api/dailysummary';

// Function to get all GLOBAL exercises
const getExercises = async () => {
    try {
        const response = await axios.get(API_URL_EXERCISES);
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
};

// Function to create a new workout log
const createWorkoutLog = async (workoutData, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(API_URL_WORKOUT_LOGS, workoutData, config);
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
};

// Function to create a new diet log
const createDietLog = async (dietData, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(API_URL_DIET_LOGS, dietData, config);
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
};

// Function to get all GLOBAL food items
const getFoods = async () => {
    try {
        const response = await axios.get(API_URL_FOODS);
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
  };

// Function to get daily summary
const getDailySummary = async (date, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL_DAILY_SUMMARY}/${date}`, config);
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
  };

// --- Custom Exercise Functions ---
const createCustomExercise = async (exerciseData, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(`${API_URL_EXERCISES}/custom`, exerciseData, config);
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
};

const getCustomExercises = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL_EXERCISES}/custom`, config);
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
};

// --- Custom Food Functions ---
const createCustomFood = async (foodData, token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(`${API_URL_FOODS}/custom`, foodData, config);
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
};

const getCustomFoods = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL_FOODS}/custom`, config);
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
};

// Function to get workout logs for a user
const getWorkoutLogs = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL_WORKOUT_LOGS}/user`, config);
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
};

// Function to get diet logs for a user
const getDietLogs = async (token) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${API_URL_DIET_LOGS}/user`, config);
        return response.data;
    } catch (err) {
        handleApiError(err);
    }
};

const fitnessApi = {
    getExercises,
    createWorkoutLog,
    createDietLog,
    getFoods,
    getDailySummary,
    createCustomExercise,
    getCustomExercises,
    createCustomFood,
    getCustomFoods,
    getWorkoutLogs,
    getDietLogs
};

export default fitnessApi;
