import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DailyRec.css';

function MusicPlayer() {
  const { emotion } = useParams();
  const [song, setSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch(`/api/songs?emotion=${emotion}`)
      .then(res => res.json())
      .then(data => setSong(data))
      .catch(err => {
        console.error('Error loading song:', err);
        setSong(null); // set to null or keep it
      });
  }, [emotion]);


  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const getNextSong = () => {
    fetch(`/api/songs?emotion=${emotion}&next=true`)
      .then(res => res.json())
      .then(data => {
        setSong(data);
        setIsPlaying(false);
        setTimeout(() => {
          if (audioRef.current) audioRef.current.play();
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
        <p className="song-name">{song.songName}</p>
      </div>

      <audio ref={audioRef} src={song.songUrl} />

      <div className="controls">
        <button className="control-button">❤️</button>
        <button className="control-button" onClick={togglePlay}>{isPlaying ? '⏸️' : '▶️'}</button>
        <button className="control-button" onClick={getNextSong}>⏭️</button>
      </div>
    </div>
  );
}

export default MusicPlayer; 
