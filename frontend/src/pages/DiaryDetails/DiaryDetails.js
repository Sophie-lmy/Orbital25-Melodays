import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DiaryDetails.css';

const DiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchEntry = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch(`https://orbital25-melodays.onrender.com/diary/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch diary entry");

        const data = await res.json();
        setEntry(data);
        setComment(data.comment || '');
      } catch (err) {
        console.error(err);
        alert("Could not load diary entry.");
      }
    };

    fetchEntry();
  }, [id]);


  const handleCommentSave = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`https://orbital25-melodays.onrender.com/diary/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ note: comment }) 
    });

    if (!res.ok) {
      throw new Error('Failed to save comment');
    }

    alert('Comment saved!');
  } catch (err) {
    console.error(err);
    alert('Error saving comment');
  }
};

  if (!entry) return <div className="diary-detail-page">Loading...</div>;

  return (
    <div className="diary-detail-page">
      <div className="diary-header">
          <img src="/logoblack.jpg" alt="Melodays Logo" className="logo" />
          <div className="tagline">Music Journal</div>
      </div>

      <div className="diary-detail-container">
        <h2>🎼 Your Melody Memory</h2>
        <p className="entry-time">🕒 {new Date(entry.created_at).toLocaleString()}</p>
        <p><strong>🏷️ Type:</strong> {entry.type}</p>
        {entry.question && <p><strong>❓ Question:</strong> {entry.question}</p>}
        <p><strong>🎵 Song:</strong> {entry.track_name} by {entry.artist_name}</p>
        {entry.album_name && <p><strong>💿 Album:</strong> {entry.album_name}</p>}
        <p>
          <strong>🔗</strong>{' '}
          <a href={entry.spotify_url} target="_blank" rel="noreferrer">
            Listen on Spotify
          </a>
        </p>

        <label className="comment-label">💬 Your Journal:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Write your thoughts here..."
        />

        <div className="button-row">
          <button onClick={handleCommentSave}>Save Comment</button>
          <button onClick={() => navigate('/music-history')}>↩ Back to History</button>
        </div>
      </div>
    </div>
  );
};

export default DiaryDetail;
