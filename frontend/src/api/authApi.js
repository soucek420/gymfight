// frontend/src/api/authApi.js

import axios from 'axios';
import { handleApiError } from './apiErrorUtils';

const API_URL = '/api/users'; // Your backend API base URL for user routes

// Register user
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/`, userData);

    // Assuming the backend sends back user data upon successful registration
    if (response.data) {
      // Depending on your authentication flow, you might store the token here
      // localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

// Login user
const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);

    if (response.data) {
        // Store the user data and token in local storage upon successful login
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

// Logout user
const logout = () => {
    localStorage.removeItem('user');
};

const authApi = {
  register,
  login,
  logout,
};

export default authApi;