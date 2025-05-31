import React from 'react';
import MoodRec from './MoodRec';
import ActivityRec from './ActivityRec';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Melodays</h1>
        <p>Music for every version of you.</p>
      </header>

      <main>
        <MoodRec />
        <ActivityRec />
      </main>

      <footer>
        <p>Built by Yuyu Synergy</p>
      </footer>
    </div>
  );
}

export default App;
