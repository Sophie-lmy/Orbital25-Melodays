import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AskPage.css';

const AskPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCard = location.state?.card || 'love'; 

  const [question, setQuestion] = useState('');
  

  const cardImages = {
    love: '/lovecard.jpg',
    career: '/careercard.jpg',
    choice: '/choicecard.jpg',
    'self-discovery': '/selfcard.jpg',
  };

  const handleSubmit = async () => {
  if (!question.trim()) return;

  try {
    const res = await fetch('https://orbital25-melodays.onrender.com/fortune', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // only if using cookies/session auth
      body: JSON.stringify({
        type: selectedCard,   
        question: question,
      }),
    });

    if (!res.ok) throw new Error('Failed to fetch fortune music.');

    const data = await res.json();

    navigate('/fortune-player', {
      state: {
        card: selectedCard,
        question,
        song: data, 
      },
    });
  } catch (err) {
    console.error(err);
    alert('Something went wrong. Please try again.');
  }
};


  return (
    <div className="ask-container">
      <div className="ask-header">
        <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
        <div className="tagline">Let Music Answer</div>
      </div>

      <div className="ask-content">
        <img
          src={cardImages[selectedCard]}
          alt={selectedCard}
          className="ask-card-img"
        />

        <div className="ask-form">
          <h2>Focus your thoughts<br />and ask your question.</h2>
          <textarea
            placeholder="What’s on your mind?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={handleSubmit}>The universe responds...</button>
        </div>
      </div>
    </div>
  );
};

export default AskPage;
