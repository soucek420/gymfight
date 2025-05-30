// frontend/src/components/ProgressGraphs.js
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../authContext';
import fitnessApi from '../api/fitnessApi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, // Import TimeScale for date axes
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import adapter

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale 
);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-CA'); // YYYY-MM-DD format for consistency
};

function ProgressGraphs() {
  const { user } = useAuth();
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [dietLogs, setDietLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState(7); // Default to last 7 days

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.token) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        // Ensure fitnessApi has these methods and they accept a token
        const workoutPromise = fitnessApi.getWorkoutLogs ? fitnessApi.getWorkoutLogs(user.token) : Promise.resolve([]);
        const dietPromise = fitnessApi.getDietLogs ? fitnessApi.getDietLogs(user.token) : Promise.resolve([]);
        
        const [fetchedWorkoutLogs, fetchedDietLogs] = await Promise.all([
          workoutPromise,
          dietPromise,
        ]);
        
        setWorkoutLogs(fetchedWorkoutLogs || []);
        setDietLogs(fetchedDietLogs || []);

      } catch (err) {
        console.error('Error fetching fitness data:', err);
        setError(err.response?.data?.message || 'Failed to fetch fitness data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, dateRange]); // Re-fetch if user or dateRange changes

  const processedData = useMemo(() => {
    const today = new Date();
    const labels = [];
    const dailyData = {}; // Store aggregated data per day

    for (let i = dateRange - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const formattedDate = formatDate(d);
      labels.push(formattedDate);
      dailyData[formattedDate] = {
        caloriesBurned: 0,
        caloriesConsumed: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
      };
    }

    workoutLogs.forEach(log => {
      const logDate = formatDate(log.date);
      if (dailyData[logDate]) {
        dailyData[logDate].caloriesBurned += log.calories_burned || 0;
      }
    });

    dietLogs.forEach(log => {
      const logDate = formatDate(log.date);
      if (dailyData[logDate]) {
        dailyData[logDate].caloriesConsumed += log.calories_consumed || 0;
        dailyData[logDate].proteins += log.proteins_consumed || 0;
        dailyData[logDate].carbs += log.carbohydrates_consumed || 0;
        dailyData[logDate].fats += log.fats_consumed || 0;
      }
    });
    
    return { labels, dailyData };
  }, [workoutLogs, dietLogs, dateRange]);


  const caloriesChartData = {
    labels: processedData.labels,
    datasets: [
      {
        label: 'Calories Consumed',
        data: processedData.labels.map(date => processedData.dailyData[date]?.caloriesConsumed || 0),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Calories Burned',
        data: processedData.labels.map(date => processedData.dailyData[date]?.caloriesBurned || 0),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const macronutrientsChartData = {
    labels: processedData.labels,
    datasets: [
      {
        label: 'Protein (g)',
        data: processedData.labels.map(date => processedData.dailyData[date]?.proteins || 0),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Carbohydrates (g)',
        data: processedData.labels.map(date => processedData.dailyData[date]?.carbs || 0),
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Fats (g)',
        data: processedData.labels.map(date => processedData.dailyData[date]?.fats || 0),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        tension: 0.1,
      },
    ],
  };
  
  const commonChartOptions = (titleText) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: titleText,
      },
    },
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'day',
                tooltipFormat: 'MMM dd, yyyy', // Format for tooltips
                displayFormats: {
                    day: 'MMM dd' // Format for x-axis labels
                }
            },
            title: {
                display: true,
                text: 'Date'
            }
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Value'
            }
        }
    }
  });


  if (loading) return <p>Loading graph data...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!user) return <p>Please log in to view your progress graphs.</p>;


  return (
    <div className="progress-graphs-container">
      <h3>Fitness Progress Graphs</h3>
      <div className="date-range-selector">
        <label htmlFor="dateRange">Select Range: </label>
        <select id="dateRange" value={dateRange} onChange={(e) => setDateRange(Number(e.target.value))}>
          <option value={7}>Last 7 Days</option>
          <option value={14}>Last 14 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>
      </div>

      <div className="chart-container" style={{ height: '400px', marginBottom: '30px' }}>
        <Line options={commonChartOptions('Daily Caloric Balance')} data={caloriesChartData} />
      </div>
      <div className="chart-container" style={{ height: '400px' }}>
         {/* Using Line chart for macros as stacked bar can be complex without more direct data prep for it */}
        <Line options={commonChartOptions('Daily Macronutrient Intake (grams)')} data={macronutrientsChartData} />
      </div>
    </div>
  );
}

export default ProgressGraphs;
