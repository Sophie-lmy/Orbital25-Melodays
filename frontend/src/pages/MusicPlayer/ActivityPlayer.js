import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './MusicPlayer.css';

function ActivityPlayer() {
  const location = useLocation();
  const song = location.state?.song;
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const audioRef = useRef(null);

  if (!song) return <div className="music-player">Loading...</div>;


  const playSong = async () => {
  const token = localStorage.getItem('spotify_access_token');
  const deviceId = localStorage.getItem('spotify_device_id');

  if (!token || !song.spotify_uri || !deviceId) {
    alert("Missing Spotify token, URI, or device ID.");
    return;
  }

  try {
    // Step 1: Transfer playback to the Web Playback SDK device
    await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false  // set false so it doesn't autoplay
      })
    });

    // Step 2: Then trigger playback on that device
    const res = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: [song.spotify_uri],
        device_id: deviceId
      })
    });

    if (res.ok) {
      setIsPlaying(true);
    } else {
      const data = await res.json();
      console.error("Spotify play error:", data);
      alert("Unable to play.");
    }
  } catch (err) {
    console.error("Play request failed:", err);
    alert("Something went wrong while trying to play the song.");
  }
};


  const pausePlayback = async () => {
    const token = localStorage.getItem('spotify_access_token');
    const deviceId = localStorage.getItem('spotify_device_id');

    if (!token || !deviceId) {
      console.warn("Missing token or device ID.");
      return;
    }

    try {
      const res = await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setIsPlaying(false);
      } else {
        const data = await res.json();
        console.warn("Spotify pause failed:", data);
      }
    } catch (err) {
      console.error("Pause request failed:", err);
    }
  };


  const togglePlay = async () => {
    if (isPlaying) {
      await pausePlayback();
    } else {
      await playSong();
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
        alert("Unexpected error occurred.");
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
        alert("Failed to unlike the song.");
      }
    }
  } catch (err) {
    setLiked(!newLikedState);
    alert("Something went wrong.");
  }
};

  return (
    <div className="music-player">
      <div className="player-header">
        <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
        <div className="tagline">Activity Beats</div>
        <a href="/home" className="home-link">Home</a>
      </div>

      <div className="cd-wrapper">
        <img src={song.cover || "/player.gif"} alt="Album Cover" className="cd" />
        <p className="songtitle">{song.title}</p>
        <p className="songartist">{song.artist || "Unknown Artist"}</p>
      </div>

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

export default ActivityPlayer;