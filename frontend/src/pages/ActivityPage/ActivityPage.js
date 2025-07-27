import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActivityPage.css'; 

function ActivityPage() {
  const navigate = useNavigate();

  const handleActivityClick = async (activityLabel) => {
    const activity = activityLabel.toLowerCase();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in first.');
      return;
    }

    try {
      const res = await fetch(`https://orbital25-melodays.onrender.com/recommend/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ activity })
      });

      if (!res.ok) throw new Error('Failed to fetch activity recommendation');

      const data = await res.json();
      console.log('Received activity song:', data);

      navigate('/player', { state: { song: data } });
    } catch (err) {
      console.error('Error fetching activity recommendation:', err);
      alert('Failed to get activity-based recommendation. Please try again.');
    }
  };

  const activities = [
    { emoji: "🧠", label: "Focusing" },
    { emoji: "🚴", label: "Exercising" },
    { emoji: "🛌", label: "Sleeping" },
    { emoji: "😌", label: "Relaxing" },
    { emoji: "🚗", label: "Commuting" },
  ];

  return (
    <div className="activitypage-wrapper">
      <div className="activity-header">
        <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
        <div className="tagline"> Activity Beats</div>
        <a href="/home" className="home-link">Home</a>
      </div>

      <div className="activity-content">
        <h1>What are you up to?</h1>
        <div className="activities">
          {activities.map((activity) => (
            <button
              key={activity.label}
              className="activity-button"
              onClick={() => handleActivityClick(activity.label)}
            >
              <span role="img" aria-label={activity.label.toLowerCase()}>{activity.emoji}</span>
              {activity.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityPage;