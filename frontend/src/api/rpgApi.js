// frontend/src/api/rpgApi.js

import axios from 'axios';

const API_URL_CHARACTERS = '/api/characters';

// Function to get user's character
const getCharacter = async (token, userId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL_CHARACTERS}/user/${userId}`, config);
    return response.data;
};

// Function to create a new character
const createCharacter = async (characterData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL_CHARACTERS, characterData, config);
    return response.data;
};

const getAiOpponents = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get('/api/combat/aiOpponents', config);
    return response.data;
};

const startCombat = async (combatData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post('/api/combat', combatData, config);
    return response.data;
};

const rpgApi = {
    getCharacter,
    createCharacter,
    getAiOpponents,
    startCombat
};

export default rpgApi;