// frontend/src/components/OpponentSelect.js

import React, { useState, useEffect } from 'react';
import rpgApi from '../api/rpgApi'; // Need to create this API calls
import { useAuth } from '../authContext';

function OpponentSelect({ onOpponentSelect }) {
    const [opponents, setOpponents] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOpponents = async () => {
            if (!user || !user.token) {
                setError('Not authenticated');
                return;
            }

            try {
                const fetchedOpponents = await rpgApi.getAiOpponents(user.token);
                setOpponents(fetchedOpponents);
            } catch (error) {
                console.error('Error fetching opponents:', error);
                setError('Failed to fetch opponents.');
            }
        };

        fetchOpponents();
    }, [user]);

    const handleOpponentSelect = (opponentId) => {
        // Call the onOpponentSelect function passed from the parent component
        onOpponentSelect(opponentId);
    };

    return (
        <div>
            <h3>Select Opponent</h3>
            {error && <p>Error: {error}</p>}
            <ul>
                {opponents.map((opponent) => (
                    <li key={opponent._id}>
                        <button onClick={() => handleOpponentSelect(opponent._id)}>{opponent.name} (Level {opponent.level})</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default OpponentSelect;