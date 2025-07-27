import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './MusicPlayer.css';

function MoodPlayer() {
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
            spotify_url: song.spotify_url,
            spotify_uri: song.spotify_uri
          })
        });

        const data = await res.json();

        if (res.status !== 201 && res.status !== 409) {
          console.error("Unexpected response:", data.message);
        }
      } else {
        const res = await fetch(`https://orbital25-melodays.onrender.com/songs/unlike/${song.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) {
          console.warn("Backend responded with:", data.message);
        }
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      setLiked(!newLikedState);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="music-player">
      <div className="player-header">
        <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
        <a href="/home" className="home-link">Home</a>
      </div>

      <div className="cd-wrapper">
        <img src={song.cover || "/player.gif"} alt="Album Cover" className="cd" />
        <p className="songtitle">{song.title}</p>
        <p className="songartist">{song.artist || "Unknown Artist"}</p>
      </div>

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
  );
}

export default MoodPlayer;