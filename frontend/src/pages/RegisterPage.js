// frontend/src/pages/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import authApi from '../api/authApi';
import './RegisterPage.css'; // For basic styling

function RegisterPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '', // For password confirmation
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { username, email, password, password2 } = formData;

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(''); // Clear message on input change
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(''); // Clear previous messages

    if (!username || !email || !password || !password2) {
        setMessage('Please fill in all fields.');
        setIsLoading(false);
        return;
    }

    if (password !== password2) {
      setMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      // Call the backend registration API
      console.log('Attempting registration with data:', formData);
      const response = await authApi.register({ username, email, password });
      console.log('Registration successful:', response);

      setMessage('Registration successful! Logging you in...');
      
      // Automatically log in the user after successful registration
      await login(email, password); 
      // Navigation is handled by useEffect after user state is updated by login
      // No explicit success message needed here as redirection implies success
      // If login itself fails after successful registration, the error will be caught below

    } catch (error) {
      console.error('Registration or auto-login failed:', error);
      // Check if error object and its properties exist
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Registration or login failed. Please try again.';
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Register Page</h2>
      {message && (
        <p className={`form-message ${message.includes('failed') || message.includes('Passwords do not match') || message.includes('Please fill') ? 'error-message' : 'success-message'}`}>
          {message}
        </p>
      )}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            placeholder="Username"
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            placeholder="Email"
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder="Password"
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password2">Confirm Password:</label>
          <input
            type="password"
            name="password2"
            id="password2"
            value={password2}
            placeholder="Confirm Password"
            onChange={onChange}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
