import React, { useState } from 'react';
import './SetupAccount.css';

function SetupAccount() {
  const [username, setUsername] = useState('');

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      return;
    }

    try {
      const res = await fetch('https://orbital25-melodays.onrender.com/auth/save-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Profile saved!');
      } else {
        alert(data.message || 'Error saving profile');
      }
    } catch (err) {
      console.error('Save profile error:', err);
      alert('Error saving profile');
    }
  };

  const handleSpotifyLogin = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      return;
    }

    try {
      const res = await fetch('https://orbital25-melodays.onrender.com/spotify/authorize', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      alert('Failed to connect to Spotify');
      console.error(err);
    }
  };

  return (
    <div className="setup-container">
      <form className="setup-form" onSubmit={(e) => e.preventDefault()}>
        <img src="/logopurple.jpg" alt="Logo" className="setup-logo" />

        <label className='setup-label'>Username</label>
        <input className='setup-input'
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