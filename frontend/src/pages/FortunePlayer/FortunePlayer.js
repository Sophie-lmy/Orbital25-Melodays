import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './FortunePlayer.css';

const cardImages = {
  'love': '/lovecard.jpg',
  'career': '/careercard.jpg',
  'choice': '/choicecard.jpg',
  'self-discovery': '/selfcard.jpg',
};

const FortunePlayer = () => {
  const { state } = useLocation();
  //const { card, question, song } = state || {};

  const devFallback = {
  card: 'love',
  question: 'Will I find true love soon?',
  song: {
    track_name: 'Mock Song Title',
    artist_name: 'Mock Artist',
    album_image_url: '/player.gif',
    spotify_url: 'https://open.spotify.com/',
    preview_url: '',
  }
};

const { card, question, song } = state || devFallback;

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);

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
    } catch (err) {
      console.error('Playback error:', err);
    }
  };

  /*if (!song) {
    return <div className="music-player">No song found.</div>;
  } */

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
          <img src={song.album_image_url || '/player.gif'} alt="album" className="album-art" />
          <h2 className="song-title">{song.track_name}</h2>
          <p className="artist-name">{song.artist_name}</p>

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
      </div>
    </div>
  );
};

export default FortunePlayer;
