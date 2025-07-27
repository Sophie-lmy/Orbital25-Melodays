import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale);

const MoodSummary = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('https://orbital25-melodays.onrender.com/diary/summary', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Fetch summary error:', err));
  }, []);

  const chartData = {
    labels: data.map(item => item.type),
    datasets: [
      {
        label: 'Number of Entries',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(102, 0, 204, 0.6)',
        borderColor: 'purple',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ width: '90%', margin: '0 auto' }}>
      <h2>📝 Your Mood & Activity Frequency</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MoodSummary;
