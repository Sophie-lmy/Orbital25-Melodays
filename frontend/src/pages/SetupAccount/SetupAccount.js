import React, { useState } from 'react';
import './SetupAccount.css';

function SetupAccount({ userId }) {
  const [username, setUsername] = useState('');

  const handleSave = async () => {
    const res = await fetch('/api/save-profile', {
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
    const clientId = 'YOUR_SPOTIFY_CLIENT_ID';
    const redirectUri = encodeURIComponent('http://localhost:3000/spotify-callback');
    const scopes = encodeURIComponent('user-read-email user-read-private');
    const state = userId;

    window.location.href = '/api/spotify-authorize';
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
