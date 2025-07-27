import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MusicHistory.css';

const MusicHistory = () => {
  const [entries, setEntries] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [likedTracks, setLikedTracks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchEntries = () => {
    const params = new URLSearchParams();

    // Convert grouped types to query array
    const groupMap = {
      AllMood: [
        "Mood-Happy", "Mood-Sad", "Mood-Angry", "Mood-Loved", "Mood-Nostalgic"
      ],
      AllActivity: [
        "Activity-Focusing", "Activity-Exercising", "Activity-Sleeping", "Activity-Relaxing", "Activity-Commuting"
      ],
      AllFortune: [
        "Fortune-Love", "Fortune-Career", "Fortune-Choice", "Fortune-Self-discovery"
      ]
    };

    if (typeFilter in groupMap) {
      groupMap[typeFilter].forEach(t => params.append('types', t));
    } else if (typeFilter) {
      params.append('types', typeFilter);
    }

    if (monthFilter) params.append('month', monthFilter);

    fetch(`https://orbital25-melodays.onrender.com/diary?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        console.log("Fetched diary entries:", data);
        setEntries(data);
      })
      .catch(err => console.error('Diary fetch error:', err));
  };

  const fetchLikedSongs = () => {
    fetch('https://orbital25-melodays.onrender.com/songs/liked', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        const likedIds = data.map(song => song.spotify_track_id);
        setLikedTracks(likedIds);
      })
      .catch(err => console.error('Failed to load liked songs:', err));
  };

  useEffect(() => {
    fetchEntries();
    fetchLikedSongs();
  }, [typeFilter, monthFilter]);

  const toggleLike = async (spotifyId) => {
    const isLiked = likedTracks.includes(spotifyId);
    const url = isLiked
      ? `https://orbital25-melodays.onrender.com/songs/unlike/${spotifyId}`
      : `https://orbital25-melodays.onrender.com/songs/like`;
    const method = isLiked ? 'DELETE' : 'POST';

    const entry = entries.find(entry => entry.spotify_track_id === spotifyId);
    const body = isLiked ? null : JSON.stringify({
      spotify_track_id: entry.spotify_track_id,
      track_name: entry.track_name,
      artist_name: entry.artist_name,
      album_name: entry.album_name,
      album_image_url: entry.album_image_url
    });

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (res.ok) {
        setLikedTracks(prev =>
          isLiked ? prev.filter(id => id !== spotifyId) : [...prev, spotifyId]
        );
      } else {
        console.error('Failed to toggle like');
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  return (
    <div className="page-background">
      <div className="diarylist-container">
        <div className="diarylist-header">
          <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
          <div className="tagline">Music History</div>
          <a href="/home" className="home-link">Home</a>
        </div>

        <div className="filters">
          <label>
            Type:
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">All</option>
              <option value="AllMood">All Mood</option>
              <option value="Mood-Happy">Mood-Happy</option>
              <option value="Mood-Sad">Mood-Sad</option>
              <option value="Mood-Angry">Mood-Angry</option>
              <option value="Mood-Loved">Mood-Loved</option>
              <option value="Mood-Nostalgic">Mood-Nostalgic</option>
              <option value="AllActivity">All Activity</option>
              <option value="Activity-Focusing">Activity-Focusing</option>
              <option value="Activity-Exercising">Activity-Exercising</option>
              <option value="Activity-Sleeping">Activity-Sleeping</option>
              <option value="Activity-Relaxing">Activity-Relaxing</option>
              <option value="Activity-Commuting">Activity-Commuting</option>
              <option value="AllFortune">All Fortune</option>
              <option value="Fortune-Love">Fortune-Love</option>
              <option value="Fortune-Career">Fortune-Career</option>
              <option value="Fortune-Choice">Fortune-Choice</option>
              <option value="Fortune-Self-discovery">Fortune-Self-discovery</option>
              <option value="daily">Daily</option>
            </select>
          </label>

          <label>
            Month:
            <input
              type="month"
              value={monthFilter}
              onChange={e => setMonthFilter(e.target.value)}
            />
          </label>
        </div>

        {entries.length === 0 ? (
          <p>No music history yet.</p>
        ) : (
          entries.map(entry => (
            <div className="diary-entry" key={entry.id}>
              <p>{new Date(entry.created_at).toLocaleString()}</p>
              <p><strong>🏷️ Type:</strong> {entry.type}</p>
              <p><strong>🎵 Song:</strong> {entry.track_name} by {entry.artist_name}</p>
              <p><strong>💬 Comment:</strong> {entry.note || 'No comment yet.'}</p>
              <button
                className="like-button"
                onClick={() => toggleLike(entry.spotify_track_id)}
              >
                <img
                  src={likedTracks.includes(entry.spotify_track_id) ? '/redheart-whitebg.png' : '/heart.png'}
                  alt="Like"
                  className="heart-icon"
                />
              </button>
              <button className="details-button" onClick={() => navigate(`/diary/${entry.id}`)}>View Details</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MusicHistory;