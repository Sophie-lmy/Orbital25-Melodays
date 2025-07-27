import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FortunePage.css'; 

const cards = [
  { id: 'love', title: 'LOVE', img: '/lovecard.jpg' },
  { id: 'career', title: 'CAREER', img: '/careercard.jpg' },
  { id: 'choice', title: 'CHOICE', img: '/choicecard.jpg' },
  { id: 'self-discovery', title: 'SELF-DISCOVERY', img: '/selfcard.jpg' },
];

function FortunePage() {
  const navigate = useNavigate();

  const handleCardClick = (cardId) => {
    navigate('/ask', { state: { card: cardId } });
  };

  return (
    <div className="fortune-container">
      <div className="fortune-header">
        <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
        <div className="tagline">Let Music Answer</div>
        <a href="/home" className="home-link">Home</a>
      </div>

      <h2 className="fortune-title">What truth are you seeking today?</h2>

      <div className="card-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className="tarot-card"
            onClick={() => handleCardClick(card.id)}
          >
            <img src={card.img} alt={card.title} className="card-image" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FortunePage;
