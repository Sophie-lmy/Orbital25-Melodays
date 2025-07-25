import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SetupAccount.css';

function SetupAccount() {
  const location = useLocation();
  const userId = location.state?.userId;

  const [username, setUsername] = useState('');

  const handleSave = async () => {
    const res = await fetch('https://orbital25-melodays.onrender.com/auth/save-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, username }),
    });

    if (res.ok) {
      alert('Profile saved!');
    } else {
      alert('Error saving profile');
    }
  };

  const handleSpotifyLogin = () => {
    window.location.href = `https://orbital25-melodays.onrender.com/api/spotify/authorize?userId=${userId}`;
  };

  return (
    <div className="setup-container">
      <form className="setup-form" onSubmit={(e) => e.preventDefault()}>
        <img src="/logopurple.jpg" alt="Logo" className="setup-logo" />
      
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />

        <button type="button" className="save-button" onClick={handleSave}>
            Save Username
        </button>

        <button type="button" className="spotify-button" onClick={handleSpotifyLogin}>
          Log in with Spotify
        </button>
      </form>
    </div>
  );
}

export default SetupAccount;