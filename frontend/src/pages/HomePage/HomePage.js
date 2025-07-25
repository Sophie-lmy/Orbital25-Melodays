import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    navigate('/');
  };


  return (
    <div className="homepage-wrapper">
      {/* Left Panel */}
      <div className="sidebar">
        <h2>Welcome to</h2>
        <img src="/logoblack.jpg" alt="Melodays Logo" className="home-logo" />
        <p className="subtitle">A personalized, emotional music discovery platform.</p>

        <div className="sidebar-links">
          <a href="/playlist">My Playlist</a>
          <button onClick={handleLogout} className="logout-link">Log out</button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="main-content">
        <a href="/mood" className="feature-card">💞 Feel the Vibe</a>
        <a href="/activity" className="feature-card">🏃 Activity Beats</a>
        <a href="/daily" className="feature-card">🌅 Song of the Day</a>
        <a href="/fortune" className="feature-card">🔮 Let Music Answer</a>
        <a href="/music-history" className="feature-card">📔 Music Log</a>
      </div>
    </div>
  );
}

export default HomePage;


