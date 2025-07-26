import React, { useEffect, useState } from 'react';
import './Playlist.css';

function Playlist() {
  const [username, setUsername] = useState('');
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("JWT token from localStorage:", token); // for testing

    fetch('https://orbital25-melodays.onrender.com/auth/get-profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log("Profile data:", data);  
        setUsername(data.username);
      })
      .catch(err => console.error('Error fetching profile:', err));

    fetch('https://orbital25-melodays.onrender.com/songs/liked', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setLikedSongs(data))
      .catch(err => console.error('Error fetching liked songs:', err));
  }, []);


  return (
    <div className="profile-container">
      <div className="left-panel">
        <img src="/logoblack.jpg" alt="Melodays Logo" className="playlist-logo" />
        <p>{username}'s Music Shelf</p>
      </div>

      <div className="right-panel">
        {likedSongs.length === 0 ? (
          <p>No liked songs yet.</p>
        ) : (
          <ul>
            {likedSongs.map((song, index) => (
              <li key={index}>
                <strong>{song.track_name}</strong> — {song.artist_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Playlist;
