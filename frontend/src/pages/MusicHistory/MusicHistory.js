import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MusicHistory.css';

const MusicHistory = () => {
  const [entries, setEntries] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const navigate = useNavigate();

  const fetchEntries = () => {
    const params = new URLSearchParams();
    if (typeFilter) params.append('type', typeFilter);
    if (monthFilter) params.append('month', monthFilter);

    fetch(`https://orbital25-melodays.onrender.com/diary?${params.toString()}`)
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error('Diary fetch error:', err));
  };

  const toggleLike = async (id, currentLiked) => {
  try {
    const res = await fetch(`/diary/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liked: !currentLiked }),
    });

    if (res.ok) {
      setEntries(prev =>
        prev.map(entry =>
          entry.id === id ? { ...entry, liked: !currentLiked } : entry
        )
      );
    } else {
      console.error('Failed to update like status');
    }
  } catch (err) {
    console.error('Like toggle error:', err);
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
        
        {/* filter controls */}
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
                  onClick={() => toggleLike(entry.id, entry.liked)}
                >
                  <img
                    src={entry.liked ? '/redheart.png' : '/emptyheart.png'}
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
