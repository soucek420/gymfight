// frontend/src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import './LoginPage.css'; // For basic styling

function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;

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

    if (!email || !password) {
        setMessage('Please fill in all fields.');
        setIsLoading(false);
        return;
    }

    try {
      await login(email, password);
      // Navigation is handled by useEffect
      // No explicit success message needed here as redirection implies success
    } catch (error) {
      console.error('Login failed in LoginPage:', error);
      setMessage(error.response?.data?.message || error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Login Page</h2>
      {message && (
        <p className={`form-message ${message.includes('failed') || message.includes('Please fill') ? 'error-message' : 'success-message'}`}>
          {message}
        </p>
      )}
      <form onSubmit={onSubmit}>
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
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
