import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MusicHistory.css';

const MusicHistory = () => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  // Replace with mock data temporarily
  const mockEntries = [
    {
      id: 1,
      type: 'fortune',
      question: 'Will I find love soon?',
      track_name: 'Imagine',
      artist_name: 'John Lennon',
      comment: 'It really spoke to me.',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      type: 'mood',
      track_name: 'Good Vibes',
      artist_name: 'Flow',
      comment: '',
      created_at: new Date().toISOString()
      
    },
    {
      id: 3,
      type: 'mood',
      track_name: 'Good Vibes',
      artist_name: 'Flow',
      comment: '',
      created_at: new Date().toISOString()
      
    }

  ];
  setEntries(mockEntries);
}, []);


  /*useEffect(() => {
    fetch('/api/diary') 
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error('Diary fetch error:', err));
  }, []); */

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
                {entry.question && <p><strong>❓ Question:</strong> {entry.question}</p>}
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
