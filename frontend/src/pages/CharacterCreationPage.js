// frontend/src/pages/CharacterCreationPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import rpgApi from '../api/rpgApi'; // Uncommented and imported
import './CharacterCreationPage.css'; // For basic styling

function CharacterCreationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
  });
  const [message, setMessage] = useState(''); // State for user feedback
  const [isLoading, setIsLoading] = useState(false);

  const { name, type } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(''); // Clear message on form change
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(''); // Clear previous messages

    // Basic form validation
    if (!name.trim()) {
      setMessage('Character name cannot be empty.');
      setIsLoading(false);
      return;
    }
    if (name.length < 3 || name.length > 20) {
      setMessage('Character name must be between 3 and 20 characters.');
      setIsLoading(false);
      return;
    }
    if (!type) {
      setMessage('Please select a character type.');
      setIsLoading(false);
      return;
    }

    if (!user || !user.token) {
      setMessage('You must be logged in to create a character.');
      setIsLoading(false);
      // console.error('User not authenticated'); // Already handled by message
      return;
    }

    const characterData = {
      name,
      type,
      // user_id will be added in the backend controller from the authenticated user
    };

    console.log('Submitting character creation:', characterData);

    try {
      const response = await rpgApi.createCharacter(characterData, user.token);
      console.log('Character created:', response);
      setMessage('Character created successfully! Redirecting to your profile...');
      // Optionally, reset form data
      setFormData({ name: '', type: '' });
      setTimeout(() => {
        navigate('/rpg'); // Redirect after a short delay to show message
      }, 2000); 
    } catch (error) {
      console.error('Error creating character:', error);
      setMessage(error.response?.data?.message || 'Error creating character. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }; // Corrected structure: onSubmit function scope ends here

  return (
    <div className="character-creation-page">
      <h2>Create Your Character</h2>
      {message && (
        <p className={`form-message ${message.startsWith('Error') || message.startsWith('Character name') || message.startsWith('Please select') || message.startsWith('You must be') ? 'error-message' : 'success-message'}`}>
          {message}
        </p>
      )}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Character Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={onChange}
            required
            minLength="3"
            maxLength="20"
          />
        </div>
        <div>
          <label htmlFor="type">Character Type:</label>
          <select
            name="type"
            id="type"
            value={type}
            onChange={onChange}
            required
          >
            <option value="">Select Type</option>
            <option value="Warrior">Warrior</option>
            <option value="Mage">Mage</option>
            <option value="Zombie">Zombie</option>
            {/* Add other character types here if they become available */}
          </select>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Character'}
        </button>
      </form>
    </div>
  );
}

export default CharacterCreationPage;
