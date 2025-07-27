import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './MoodSummary.css';
Chart.register(BarElement, CategoryScale, LinearScale);

const MoodSummary = () => {
  const [moodData, setMoodData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [fortuneData, setFortuneData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('https://orbital25-melodays.onrender.com/diary/summary', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid summary response');
        }
        //categorize
        const mood = data.filter(item => item.type.startsWith('Mood'));
        const activity = data.filter(item => item.type.startsWith('Activity'));
        const fortune = data.filter(item => item.type.startsWith('Fortune'));

        setMoodData(mood);
        setActivityData(activity);
        setFortuneData(fortune);
      })
      .catch(err => console.error('Fetch summary error:', err));
  }, []);

  const buildChartData = (data) => ({
    labels: data.map(item => item.type),
    datasets: [
      {
        label: 'Frequency',
        data: data.map(item => item.frequency),
        backgroundColor: 'rgba(102, 0, 204, 0.6)',
        borderColor: 'purple',
        borderWidth: 1,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="mood-summary-container">
      <div className="chart-wrapper">
        <h2>Mood Frequency</h2>
        <Bar data={buildChartData(moodData)} options={chartOptions} />
      </div>

      <div className="chart-wrapper">
        <h2>Activity Frequency</h2>
        <Bar data={buildChartData(activityData)} options={chartOptions} />
      </div>

      <div className="chart-wrapper">
        <h2>Fortune Frequency</h2>
        <Bar data={buildChartData(fortuneData)} options={chartOptions} />
      </div>
    </div>

  );
};

export default MoodSummary;
