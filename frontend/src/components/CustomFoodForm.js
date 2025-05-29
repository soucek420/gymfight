// frontend/src/components/CustomFoodForm.js
import React, { useState } from 'react';
import fitnessApi from '../api/fitnessApi';
import { useAuth } from '../authContext';

function CustomFoodForm() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        calories_per_100g: '',
        proteins_per_100g: '',
        carbohydrates_per_100g: '',
        fats_per_100g: ''
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
            setError("You must be logged in to create a custom food item.");
            setIsLoading(false);
            return;
        }

        try {
            const foodData = {
                name: formData.name,
                calories_per_100g: Number(formData.calories_per_100g),
                proteins_per_100g: Number(formData.proteins_per_100g),
                carbohydrates_per_100g: Number(formData.carbohydrates_per_100g),
                fats_per_100g: Number(formData.fats_per_100g),
            };
            await fitnessApi.createCustomFood(foodData, user.token);
            setMessage('Custom food item created successfully!');
            setFormData({ // Clear form
                name: '',
                calories_per_100g: '',
                proteins_per_100g: '',
                carbohydrates_per_100g: '',
                fats_per_100g: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create custom food item. Please try again.');
            console.error("Error creating custom food item:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="custom-item-form">
            <h4>Create Custom Food Item</h4>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="food-name">Name:</label>
                    <input type="text" id="food-name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="food-calories">Calories per 100g:</label>
                    <input type="number" id="food-calories" name="calories_per_100g" value={formData.calories_per_100g} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="food-proteins">Proteins per 100g:</label>
                    <input type="number" id="food-proteins" name="proteins_per_100g" value={formData.proteins_per_100g} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="food-carbs">Carbohydrates per 100g:</label>
                    <input type="number" id="food-carbs" name="carbohydrates_per_100g" value={formData.carbohydrates_per_100g} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="food-fats">Fats per 100g:</label>
                    <input type="number" id="food-fats" name="fats_per_100g" value={formData.fats_per_100g} onChange={handleChange} required />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Food Item'}
                </button>
            </form>
        </div>
    );
}

export default CustomFoodForm;
