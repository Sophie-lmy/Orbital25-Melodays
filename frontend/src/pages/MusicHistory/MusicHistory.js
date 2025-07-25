import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MusicHistory.css';

const MusicHistory = () => {
  const [entries, setEntries] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [likedTracks, setLikedTracks] = useState([]);
  const navigate = useNavigate();

  const fetchEntries = () => {
    const params = new URLSearchParams();
    if (typeFilter) params.append('type', typeFilter);
    if (monthFilter) params.append('month', monthFilter);

    const token = localStorage.getItem('token');

    fetch(`https://orbital25-melodays.onrender.com/diary?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
      console.log("Fetched diary entries:", data);
      setEntries(data);
    })
      .catch(err => console.error('Diary fetch error:', err));
  };

  useEffect(() => {
  fetchEntries();

  //fetch liked song IDs 
  fetch('/song/liked')
    .then(res => res.json())
    .then(data => {
      const likedIds = data.map(song => song.spotify_track_id);
      setLikedTracks(likedIds);
    })
    .catch(err => console.error('Failed to load liked songs:', err));
}, [typeFilter, monthFilter]);

  const toggleLike = async (spotifyId) => {
  const isLiked = likedTracks.includes(spotifyId);

  const url = isLiked
    ? `/song/unlike/${spotifyId}`
    : `/song/like`;

  const method = isLiked ? 'DELETE' : 'POST';
  const body = isLiked
    ? null
    : JSON.stringify({ spotify_track_id: spotifyId });

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (res.ok) {
      setLikedTracks(prev =>
        isLiked
          ? prev.filter(id => id !== spotifyId)
          : [...prev, spotifyId]
      );
    } else {
      console.error('Failed to toggle like');
    }
  } catch (err) {
    console.error('Error toggling like:', err);
  }
};

  //fetch when filters change
  useEffect(() => {
    fetchEntries();
  }, [typeFilter, monthFilter]);
  

  return (
    <div className="page-background">
        <div className="diarylist-container">
        <div className="diarylist-header">
            <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
            <div className="tagline">Music Journal</div>
        </div>
        
        <div className="filters">
          <label>
            Type:
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">All</option>
              <option value="mood">Mood</option>
              <option value="activity">Activity</option>
              <option value="daily">Daily</option>
              <option value="fortune">Fortune</option>
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
        
        ) : (  //if, otherwise
            entries.map(entry => (
            <div className="diary-entry" key={entry.id}>
                <p>{new Date(entry.created_at).toLocaleString()}</p>
                <p><strong>🏷️ Type:</strong> {entry.type}</p>
                <p><strong>🎵 Song:</strong> {entry.track_name} by {entry.artist_name}</p>
                
                <button
                  className="like-button"
                  onClick={() => toggleLike(entry.spotify_track_id)}
                >
                  <img
                    src={likedTracks.includes(entry.spotify_track_id) ? '/redheart.png' : '/emptyheart.png'}
                    alt="Like"
                    className="heart-icon"
                  />
                </button>

                <p><strong>💬 Comment:</strong> {entry.comment || 'No comment yet.'}</p>
                <button onClick={() => navigate(`/diary/${entry.id}`)}>View Details</button>
            </div>
            ))
        )}
        </div>
    </div>
  );
}

export default MusicHistory;
