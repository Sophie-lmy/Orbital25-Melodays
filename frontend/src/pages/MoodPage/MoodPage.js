import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './MoodPage.css';

function MoodPage() {
  const navigate = useNavigate();

  const handleMoodClick = async (moodLabel) => {
    const mood = moodLabel.toLowerCase();
    console.log("Selected mood:", mood);

    try {
      const res = await fetch('http://localhost:3000/recommend/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood })
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      console.log('Received song:', data);

      navigate('/player', { state: { song: data } });
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to get recommendation. Please try again.');
    }
  };

  const moods = [
    { emoji: "😀", label: "Happy" },
    { emoji: "☹️", label: "Sad" },
    { emoji: "😡", label: "Angry" },
    { emoji: "🥰", label: "Loved" },
    { emoji: "😇", label: "Nostalgic" },
  ];

  return (
    <div className="moodpage-wrapper">
      <div className="mood-header">
        <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
        <div className="tagline">Feel the Vibe</div>
      </div>

      <div className="mood-content">
        <h1>How are you feeling?</h1>
        <div className="emotions">
          {moods.map((mood) => (
            <button
              key={mood.label}
              className="emotion-button"
              onClick={() => handleMoodClick(mood.label)}
            >
              <span role="img" aria-label={mood.label.toLowerCase()}>{mood.emoji}</span>
              {mood.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoodPage;