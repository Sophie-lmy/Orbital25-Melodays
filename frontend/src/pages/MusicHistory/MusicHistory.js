import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MusicHistory.css';

const MusicHistory = () => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://orbital25-melodays.onrender.com/diary') 
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error('Diary fetch error:', err));
  }, []); 

  return (
    <div className="page-background">
        <div className="diarylist-container">
        <div className="diarylist-header">
            <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
            <div className="tagline">Music Journal</div>
        </div>
        
        {entries.length === 0 ? (
            <p>No music history yet.</p>
        
        ) : (  //if, otherwise
            entries.map(entry => (
            <div className="diary-entry" key={entry.id}>
                <p>{new Date(entry.created_at).toLocaleString()}</p>
                <p><strong>🏷️ Type:</strong> {entry.type}</p>
                <p><strong>🎵 Song:</strong> {entry.track_name} by {entry.artist_name}</p>
                
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
