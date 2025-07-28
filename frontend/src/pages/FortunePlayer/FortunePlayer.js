import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './FortunePlayer.css';

const cardImages = {
  'love': '/lovecard.jpg',
  'career': '/careercard.jpg',
  'choice': '/choicecard.jpg',
  'self-discovery': '/selfcard.jpg',
};


function FortunePlayer() {
  const location = useLocation();
  const { song, card, question } = location.state || {};
  const [liked, setLiked] = useState(false);
  const audioRef = useRef(null);

  console.log("FortunePlayer song object:", song);

  if (!song) return <div className="music-player">Loading...</div>;


  const handleLikeToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to like/unlike songs.");
      return;
    }
    
    const newLikedState = !liked;
    setLiked(newLikedState);

    try {
      if (newLikedState) {
      // LIKE request
        const res = await fetch("https://orbital25-melodays.onrender.com/songs/like", {
          method: "POST", 
          headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            spotify_track_id: song.id,
            track_name: song.title,
            artist_name: song.artist,
            album_name: song.album,
            album_image_url: song.cover,
            spotify_url: song.external_urls?.spotify, 
            spotify_uri: song.uri        
          })
        });

        const data = await res.json();  // get backend message

        if (res.status === 201) {
          console.log("Backend says:", data.message); // "Song liked successfully."
        } else if (res.status === 409) {
          console.log("Backend says:", data.message); // "Song already liked."
        } else {
          console.error("Unexpected response:", data.message);
        }
      } else {
        // UNLIKE request
        const res = await fetch(`https://orbital25-melodays.onrender.com/songs/unlike/${song.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok) {
          console.log("Backend says:", data.message);
        } else {
          console.warn("Backend responded with:", data.message);
        }
      }

    } catch (err) {
      console.error("Error toggling like:", err);
      setLiked(!newLikedState); // rollback visual state
      alert("Something went wrong.");
    }
  };


  return (
    <div className="music-player">
      <div className="fortune-header">
        <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
        <span className="tagline">Let Music Answer</span>
      
        <a href="/home" className="home-link">Home</a>
      </div>

      <div className="player-content">
        <div className="fortune-left-panel">
          <img src={cardImages[card]} alt={card} className="tarot-img" />
          <p className="user-question">{question}</p>
        </div>

        <div className="fortune-right-panel">
          <img src={song.album_image_url || '/player.gif'} alt="album" className="album-art" />
          <h2 className="song-title">{song.track_name}</h2>
          <p className="artist-name">{song.artist_name}</p>

          <audio ref={audioRef} src={song.preview_url} />

          <div className="controls">
            <button className="control-button" onClick={handleLikeToggle}>
              <img
                src={liked ? "/redheart.png" : "/heart.png"}
                alt={liked ? "Liked" : "Like"}
                className="control-icon"
              />
            </button>
          </div>

          <div className="spotify-wrapper">
            <a
              href={song.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="spotify-link"
            >
              Listen on Spotify
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FortunePlayer;