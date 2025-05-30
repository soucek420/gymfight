// frontend/src/components/DietLog.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../authContext';
import fitnessApi from '../api/fitnessApi';

function DietLog() {
  const [formData, setFormData] = useState({
    food_id: '',
    date: '',
    quantity: '', // in grams
  });

  const [foods, setFoods] = useState([]);
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoadingFoods, setIsLoadingFoods] = useState(false);

  const { food_id, date, quantity } = formData;

  useEffect(() => {
    const fetchFoods = async () => {
      if (!user || !user.token) {
        return;
      }
      setIsLoadingFoods(true);
      setMessage('');
      try {
        const globalFoodsPromise = fitnessApi.getFoods();
        const customFoodsPromise = fitnessApi.getCustomFoods(user.token);

        const [globalFoods, customFoods] = await Promise.all([
            globalFoodsPromise,
            customFoodsPromise
        ]);
        
        const formattedCustomFoods = customFoods.map(food => ({
            ...food,
            name: `[Custom] ${food.name}`
        }));

        setFoods([...globalFoods, ...formattedCustomFoods]);

      } catch (error) {
        console.error('Error fetching foods:', error);
        setMessage(error.message || 'Error fetching food items. Please try again later.');
        setFoods([]);
      } finally {
        setIsLoadingFoods(false);
      }
    };

    fetchFoods();
  }, [user]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!user || !user.token) {
      console.error('User not authenticated');
      setMessage('User not authenticated. Please log in.');
      return;
    }
    if (!food_id) {
        setMessage('Please select a food item.');
        return;
    }
    if (!date) {
        setMessage('Please select a date.');
        return;
    }
    if (!quantity || parseFloat(quantity) <=0) {
        setMessage('Please enter a valid quantity.');
        return;
    }


    const dietData = {
      food_id,
      date,
      quantity: parseFloat(quantity), // Ensure quantity is a number
    };
    
    // Filter out undefined fields to send cleaner data to backend
     const cleanDietData = Object.fromEntries(
        Object.entries(dietData).filter(([_, v]) => v !== undefined && v !== '')
    );


    try {
      await fitnessApi.createDietLog(cleanDietData, user.token);
      setMessage('Diet log created successfully!');
      setFormData({ // Clear form
        food_id: '',
        date: '',
        quantity: '',
      });
    } catch (error) {
      console.error('Error creating diet log:', error);
      setMessage(error.message || 'Error creating diet log. Please check your input and try again.');
    }
  };

  return (
    <div className="log-form-container">
      <h3>Log Diet</h3>
      {message && <p className={message.startsWith('Error') ? "error-message" : "success-message"}>{message}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="food_id">Food Item:</label>
          <select
            name="food_id"
            id="food_id"
            value={food_id}
            onChange={onChange}
            required
            disabled={isLoadingFoods}
          >
            <option value="">{isLoadingFoods ? "Loading food items..." : "Select Food Item"}</option>
            {foods.map(food => (
                <option key={food._id} value={food._id}>
                    {food.name}
                </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity (grams):</label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            value={quantity}
            min="0.1"
            step="0.1"
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Log Diet</button>
      </form>
    </div>
  );
}

export default DietLog;
