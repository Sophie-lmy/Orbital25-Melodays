import React, { useEffect, useRef, useState } from 'react';
import './DailyRec.css';

function MusicPlayer() {
  const [song, setSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSong = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found');
        return;
      }

      try {
        const res = await fetch(`https://orbital25-melodays.onrender.com/daily`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        console.log('Daily song:', data);
        setSong(data);
      } catch (err) {
        console.error('Error loading song:', err);
        setSong(null);
      }
    };

    fetchSong();
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const getNextSong = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`https://orbital25-melodays.onrender.com/daily?next=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setSong(data);
      setIsPlaying(false);
      setTimeout(() => {
        if (audioRef.current) audioRef.current.play();
        setIsPlaying(true);
      }, 100);
    } catch (err) {
      console.error('Error loading next song:', err);
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
        <img src="/player.gif" alt="cd" className="cd" />
        <p className="song-name">{song.track_name || 'No Song Title'}</p>
        <p className="artist-name">{song.artist_name || 'Unknown Artist'}</p>
      </div>

      <audio ref={audioRef} src={song.preview_url} />

      <div className="controls">
        <button className="control-button">❤️</button>
        <button className="control-button" onClick={togglePlay}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button className="control-button" onClick={getNextSong}>⏭️</button>
      </div>
    </div>
  );
}

export default MusicPlayer;