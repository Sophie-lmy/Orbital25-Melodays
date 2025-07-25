import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SetupAccount.css';

function SetupAccount() {
  const [username, setUsername] = useState('');
  const routerLocation = useLocation();
  const userId = routerLocation.state?.userId;
  const [isLoading, setIsLoading] = useState(true);

  //fetch existing username
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`https://orbital25-melodays.onrender.com/auth/get-profile?userId=${userId}`);
        const data = await res.json();
        if (res.ok && data.username) {
          setUsername(data.username);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

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
      
        <label classname ='setup-label'>Username</label>
        <input classname='setup-input'
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