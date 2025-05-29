// frontend/src/pages/RPGPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { useAuth } from '../authContext';
import rpgApi from '../api/rpgApi'; // Ensure this is uncommented and rpgApi is correctly set up
import './RPGPage.css'; // For basic styling

function RPGPage() {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!user || !user.token || !user._id) {
        // If user or essential user details are not available, don't attempt to fetch.
        // This can happen if user logs out or data is not yet loaded.
        setCharacter(null); // Clear character data if user logs out
        setLoading(false);
        // setError('User not authenticated or user ID missing.'); // Optional: set error if user is expected
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await rpgApi.getCharacter(user.token, user._id);
        setCharacter(data);
      } catch (err) {
        console.error('Error fetching character:', err);
        setError(err.response?.data?.message || 'Failed to fetch character. Please try again.');
        setCharacter(null); // Clear character on error
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [user]); // Dependency array updated to [user]

  if (loading) {
    return <div className="rpg-page-container"><p>Loading character data...</p></div>;
  }

  if (error) {
    return <div className="rpg-page-container error-message"><p>Error: {error}</p></div>;
  }

  if (!character) {
    return (
      <div className="rpg-page-container no-character-message">
        <p>You haven't created a character yet. </p>
        <p>
          Go to the <Link to="/character-creation">Character Creation page</Link> to begin your adventure!
        </p>
      </div>
    );
  }

  // Calculate experience to next level
  const currentLevel = character.level || 1; // Default to 1 if level is somehow not set
  const experienceToNextLevel = Math.floor(currentLevel * 100 * (1 + (currentLevel - 1) * 0.1));
  const currentExperience = Math.floor(character.experience || 0);
  const xpProgressPercent = experienceToNextLevel > 0 ? (currentExperience / experienceToNextLevel) * 100 : 0;

  return (
    <div className="rpg-page-container">
      <h2>RPG Character Profile</h2>
      <div className="character-info">
        <h3>Name: {character.name}</h3>
        <p><strong>Type:</strong> {character.type}</p>
        <p><strong>Level:</strong> {currentLevel}</p>
        <div className="experience-section">
          <p><strong>Experience:</strong> {currentExperience} / {experienceToNextLevel} XP</p>
          <div className="xp-bar-container">
            <div 
              className="xp-bar" 
              style={{ width: `${xpProgressPercent}%` }}
              title={`${xpProgressPercent.toFixed(1)}%`}
            >
            </div>
          </div>
        </div>
      </div>

      <div className="character-stats">
        <h4>Stats:</h4>
        <ul>
          <li>Strength: {character.stats.strength.toFixed(1)}</li>
          <li>Stamina: {character.stats.stamina.toFixed(1)}</li>
          <li>Speed: {character.stats.speed.toFixed(1)}</li>
          <li>Health Points: {character.stats.health_points.toFixed(1)}</li>
        </ul>
      </div>

      <div className="character-abilities">
        <h4>Abilities:</h4>
        {character.abilities && character.abilities.length > 0 ? (
          <ul>
            {character.abilities.map((ability, index) => (
              <li key={index}>{ability}</li>
            ))}
          </ul>
        ) : (
          <p>No abilities unlocked yet.</p>
        )}
      </div>
      {/* TODO: Display character image, equipment, etc. */}
    </div>
  );
}

export default RPGPage;
