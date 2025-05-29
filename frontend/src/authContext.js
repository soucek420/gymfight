// frontend/src/authContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import authApi from './api/authApi'; // Import our auth API functions

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Get user from localStorage (if they were logged in before)
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  // Log the user object whenever it changes (for debugging)
  useEffect(() => {
    console.log('Auth user state changed:', user);
  }, [user]);

  // Login function
  const login = async (email, password) => {
    try {
      const userData = await authApi.login({ email, password });
      setUser(userData);
      return userData; // Return user data on success
    } catch (error) {
      console.error('Login failed in AuthContext:', error);
      throw error; // Re-throw the error for the component to handle
    }
  };

  // Logout function
  const logout = () => {
    authApi.logout(); // Remove from localStorage
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
