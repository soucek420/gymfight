// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // Import DashboardPage
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import Navbar from './components/Navbar'; // Import Navbar
import FitnessTrackerPage from './pages/FitnessTrackerPage'; // Import FitnessTrackerPage
import RPGPage from './pages/RPGPage'; // Import RPGPage
import CombatPage from './pages/CombatPage'; // Import CombatPage
import CharacterCreationPage from './pages/CharacterCreationPage'; // Import CharacterCreationPage

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Add Navbar here */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} /> {/* Protect DashboardPage */}
          <Route path="/fitness" element={<PrivateRoute element={<FitnessTrackerPage />} />} /> {/* Protect FitnessTrackerPage */}
          <Route path="/rpg" element={<PrivateRoute element={<RPGPage />} />} /> {/* Protect RPGPage */}
          <Route path="/combat" element={<PrivateRoute element={<CombatPage />} />} /> {/* Protect CombatPage */}
          {/* Example: <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} /> */}
          <Route path="/character-creation" element={<PrivateRoute element={<CharacterCreationPage />} />} /> {/* Protect CharacterCreationPage */}

          {/* Default Route */}
          <Route path="/" element={<PrivateRoute element={<DashboardPage />} />} /> {/* Default to dashboard if authenticated, otherwise redirect to login via PrivateRoute */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;