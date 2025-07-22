import React, { useState } from 'react';
import './SetupAccount.css';

function SetupAccount({ userId }) {
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [savedProfileUrl, setSavedProfileUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('username', username);
    if (profilePic) formData.append('profilePic', profilePic);

    const res = await fetch('/api/save-profile', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json(); 
      setSavedProfileUrl(data.profilePicUrl); 
      /*set pfp, backend needs to return e.g. "profilePicUrl": "smth.jpg"*/
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

    window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;
  };

  return (
    <div className="setup-page">
      <div className="header">
        <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
      </div>

      <div className="setup-form">
        {savedProfileUrl ? (
          <img src={savedProfileUrl} alt="Profile" className="profile-pic-placeholder" />
        ) : (
          <div className="profile-pic-placeholder">Profile picture</div>
        )}

      <div className="file-upload-wrapper">
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
        
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <button className="save-btn" onClick={handleSave}>Save</button>
      <button className="spotify-btn" onClick={handleSpotifyLogin}>
        Log in with Spotify
      </button>
      </div>
    </div>
  );
}

export default SetupAccount;
