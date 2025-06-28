import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './MoodPage.css';

function MoodPage() {
  const navigate = useNavigate();

  const handleMoodClick = (mood) => {
    console.log("Selected mood:", mood);
    navigate(`/player/${mood.toLowerCase()}`); 
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

