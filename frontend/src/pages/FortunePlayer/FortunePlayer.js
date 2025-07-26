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
  const song = location.state?.song;
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const audioRef = useRef(null);

  if (!song) return <div className="music-player">Loading...</div>;

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Playback error:", error);
    }
  };


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
            album_image_url: song.cover
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
      <div className="header">
        <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
        <span className="tagline">Let Music Answer</span>
      </div>

      <div className="player-content">
        <div className="left-panel">
          <img src={cardImages[card]} alt={card} className="tarot-img" />
          <p className="user-question">{question}</p>
        </div>

        <div className="right-panel">
          <img src={song.cover || '/player.gif'} alt="album" className="album-art" />
          <h2 className="song-title">{song.title}</h2>
          <p className="artist-name">{song.artist}</p>

          <audio ref={audioRef} src={song.preview_url} />

          <div className="controls">
            <button className="control-button" onClick={handleLikeToggle}>
              <img
                src={liked ? "/redheart.png" : "/heart.png"}
                alt={liked ? "Liked" : "Like"}
                className="control-icon"
              />
            </button>

            <button className="control-button" onClick={togglePlay}>
              <img
                src={isPlaying ? "/pausebutton.png" : "/playbutton.png"}
                alt={isPlaying ? "Pause" : "Play"}
                className="control-icon"
              />
            </button>
          </div>

          <div className="spotify-wrapper">
            <a
              href={song.spotify_url}
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
