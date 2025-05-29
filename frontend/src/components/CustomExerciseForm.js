// frontend/src/components/CustomExerciseForm.js
import React, { useState } from 'react';
import fitnessApi from '../api/fitnessApi';
import { useAuth } from '../authContext';

function CustomExerciseForm() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        default_calories_per_unit: '',
        unit: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        if (!user || !user.token) {
            setError("You must be logged in to create a custom exercise.");
            setIsLoading(false);
            return;
        }

        try {
            const exerciseData = {
                ...formData,
                default_calories_per_unit: Number(formData.default_calories_per_unit)
            };
            await fitnessApi.createCustomExercise(exerciseData, user.token);
            setMessage('Custom exercise created successfully!');
            setFormData({
                name: '',
                description: '',
                category: '',
                default_calories_per_unit: '',
                unit: ''
            }); // Clear form
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create custom exercise. Please try again.');
            console.error("Error creating custom exercise:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="custom-item-form">
            <h4>Create Custom Exercise</h4>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="ex-name">Name:</label>
                    <input type="text" id="ex-name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="ex-description">Description:</label>
                    <textarea id="ex-description" name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="ex-category">Category:</label>
                    <input type="text" id="ex-category" name="category" value={formData.category} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="ex-calories">Default Calories per Unit:</label>
                    <input type="number" id="ex-calories" name="default_calories_per_unit" value={formData.default_calories_per_unit} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="ex-unit">Unit (e.g., reps, minutes, kg):</label>
                    <input type="text" id="ex-unit" name="unit" value={formData.unit} onChange={handleChange} required />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Exercise'}
                </button>
            </form>
        </div>
    );
}

export default CustomExerciseForm;
