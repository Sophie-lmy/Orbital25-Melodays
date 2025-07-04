import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MusicPlayer.css'; 

function DailyPlayer() {
  const [song, setSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch(`https://orbital25-melodays.onrender.com/daily`)
      .then(res => res.json())
      .then(data => {
        console.log('Daily song:', data);
        setSong(data);
      })
      .catch(err => {
        console.error('Error loading daily song:', err);
        setSong(null);
      });
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const getNextSong = () => {
    fetch('/api/songs/daily?next=true')
      .then(res => res.json())
      .then(data => {
        setSong(data);
        setIsPlaying(false);
        setTimeout(() => {
          audioRef.current?.play();
          setIsPlaying(true);
        }, 100);
      });
  };

  if (!song) return <div className="music-player">Loading...</div>;

  return (
    <div className="music-player">
      <div className="header">
        <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
        <div className="tagline">Feel the Vibe</div>
      </div>

      <div className="cd-wrapper">
        <img src="/player.gif" alt="cd" className="cd" />
        <p className="songinfo">{song.title}</p>
        <p className="songinfo">{song.artist || "Unknown Artist"}</p>
      </div>

      <audio ref={audioRef} src={song.preview_url} />

      <div className="controls">
        <button className="control-button">
          <img src="/heart.png" alt="Like" className="control-icon" />
        </button>

        <button className="control-button" onClick={togglePlay}>
          <img
            src= "/playbutton.png" alt="Play" className="control-icon"
          />
        </button>

        <button className="control-button" onClick={getNextSong}>
          <img src="/nextbutton.png" alt="Next" className="control-icon" />
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

export default DailyPlayer;
