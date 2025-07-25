import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DiaryDetails.css';

const DiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Mock entry for preview
    const mock = {
      id,
      type: 'fortune',
      question: 'Will I find love soon?',
      track_name: 'Imagine',
      artist_name: 'John Lennon',
      album_name: 'Imagine',
      external_url: 'https://open.spotify.com/track/mock-id',
      created_at: new Date().toISOString(),
      comment: 'It really spoke to me.'
    };
    setEntry(mock);
    setComment(mock.comment);
  }, [id]);

  const handleCommentSave = () => {
    alert('Comment saved!');
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
          <a href={entry.external_url} target="_blank" rel="noreferrer">
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
