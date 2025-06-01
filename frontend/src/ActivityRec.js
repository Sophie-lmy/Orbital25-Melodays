import React, { useState } from 'react';

function ActivityRec() {
  const [activity, setActivity] = useState('study');
  const [songs, setSongs] = useState([]);

  const getSongs = async () => {
    try {
      const response = await fetch('http://localhost:3000/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity }) // <-- use selected activity from state
      });
      const data = await response.json();
      setSongs([data.song]); // backend returns one song
    } catch (error) {
      console.error('Error fetching activity song:', error);
    }
  };
  

  return (
    <section className="feature-box">
      <h2>Activity-based Recommendation</h2>
      <select value={activity} onChange={(e) => setActivity(e.target.value)}>
        <option value="study">Studying</option>
        <option value="sleep">Sleeping</option>
        <option value="exercise">Exercising</option>
    
      </select>
      <button onClick={getSongs}>Get Songs</button>

      <ul>
        {songs.map((song, i) => (
          <li key={i}>{song}</li>
        ))}
      </ul>
    </section>
  );
}

export default ActivityRec;
