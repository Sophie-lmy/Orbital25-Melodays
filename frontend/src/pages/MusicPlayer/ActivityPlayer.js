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