import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './MusicPlayer.css';

function MoodPlayer() {
  const location = useLocation();
  const song = location.state?.song;
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (song && audioRef.current) {
      audioRef.current.load();
      setIsPlaying(false);
    }
  }, [song]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Playback error:", error);
    }
  };

  if (!song) {
    return <div className="music-player">No song found. Please go back and select a mood.</div>;
  }

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
      
      {/* <audio ref={audioRef} src="/TaylorSwift-BlankSpace.mp3" /> */}
      <audio
        ref={audioRef}
        src={`https://orbital25-melodays.onrender.com/proxy/preview?url=${encodeURIComponent(song.preview_url)}`}
        onError={() => console.error("Failed to load preview")}
        onCanPlay={() => console.log("Preview is ready to play")}
        onPlay={() => console.log("Playing preview")}
        onPause={() => console.log("⏸Paused")}
        controls={false}
      />

      <div className="controls">
        <button className="control-button">
          <img src="/heart.png" alt="Like" className="control-icon" />
        </button>

        <button className="control-button" onClick={togglePlay}>
          <img
            src="/playbutton.png"
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