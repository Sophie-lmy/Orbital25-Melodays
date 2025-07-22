import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import MoodPage from './pages/MoodPage/MoodPage';
import ActivityPage from './pages/ActivityPage/ActivityPage';
import MoodPlayer from './pages/MusicPlayer/MoodPlayer';
import ActivityPlayer from './pages/MusicPlayer/ActivityPlayer';
import DailyPlayer from './pages/MusicPlayer/DailyPlayer';
import SetupAccount from './pages/SetupAccount/SetupAccount';
import SpotifyCallback from './pages/SpotifyCallback';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/" element={<SetupAccount />} />
        <Route path="/spotify-callback" element={<SpotifyCallback />} /> 
        <Route path="/home" element={<HomePage />} />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/player" element={<MoodPlayer />} />
        <Route path="/player/activity" element={<ActivityPlayer />} />
        <Route path="/daily" element={<DailyPlayer />} />
      </Routes>
    </Router>
  );
}

export default App;