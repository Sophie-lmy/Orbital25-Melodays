import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import MoodPage from './pages/MoodPage/MoodPage';
import ActivityPage from './pages/ActivityPage/ActivityPage';
import MusicPlayer from './pages/MusicPlayer/MusicPlayer'; 
import DailyRec from './pages/DailyRec/DailyRec';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/player/:emotion" element={<MusicPlayer />} />
        <Route path="/daily" element={<DailyRec />} />

      </Routes>
    </Router>
  );
}

export default App;
