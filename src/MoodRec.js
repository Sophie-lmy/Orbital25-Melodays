import React, { useState } from 'react';

function MoodRec() {
  const [mood, setMood] = useState('happy');
  const [songs, setSongs] = useState([]);

  const getSongs = async () => {
    try {
      const response = await fetch('http://localhost:3000/emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotion: mood }) // <-- use selected mood from state
      });
      const data = await response.json();
      setSongs([data.song]); // backend returns a single song
    } catch (error) {
      console.error('Error fetching mood song:', error);
    }
  };
  

  return (
    <section className="feature-box">
      <h2>Mood-based Recommendation</h2>
      <select value={mood} onChange={(e) => setMood(e.target.value)}>
        <option value="happy">Happy</option>
        <option value="sad">Sad</option>
        <option value="angry">Angry</option>
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

export default MoodRec;
