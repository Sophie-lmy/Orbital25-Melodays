import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './MusicPlayer.css';

function MoodPlayer() {
  const location = useLocation();
  const [song, setSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to get recommendation for mood.");
      return;
    }

    fetch(`https://orbital25-melodays.onrender.com/recommend/mood`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch song for mood.");
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched song:', data);
        setSong(data);
      })
      .catch(err => {
        console.error('Error loading song:', err);
        setSong(null);
      });
  }, []);

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


  if (!song) return <div className="music-player">Loading...</div>;

  return (
    <div className="music-player">
      <div className="header">
        <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
        <div className="tagline">Feel the Vibe</div>
      </div>

      <div className="cd-wrapper">
        <img src={song.cover || "/player.gif"} alt="Album Cover" className="cd" />
        <p className="songinfo">{song.title}</p>
        <p className="songinfo">{song.artist || "Unknown Artist"}</p>
      </div>

      <audio ref={audioRef} src={song.preview_url} />

      <div className="controls">
        <button className="control-button" onClick={() => setLiked(!liked)}>
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
  );
}

export default MoodPlayer;
