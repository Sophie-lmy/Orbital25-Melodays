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
import SpotifyRedirect from './pages/SpotifyRedirect';
import FortunePage from './pages/FortunePage/FortunePage';
import AskPage from './pages/AskPage/AskPage';
import FortunePlayer from './pages/FortunePlayer/FortunePlayer';
import MusicHistory from './pages/MusicHistory/MusicHistory';
import DiaryDetails from './pages/DiaryDetails/DiaryDetails';
import Playlist from './pages/Playlist/Playlist';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/setupaccount" element={<SetupAccount />} />
        <Route path="/spotify-redirect" element={<SpotifyRedirect />} /> 
        <Route path="/home" element={<HomePage />} />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/player" element={<MoodPlayer />} />
        <Route path="/player/activity" element={<ActivityPlayer />} />
        <Route path="/daily" element={<DailyPlayer />} />
        <Route path="/fortune" element={<FortunePage />} />
        <Route path="/ask" element={<AskPage />} />
        <Route path="/fortune-player" element={<FortunePlayer />} />
        <Route path="/music-history" element={<MusicHistory />} />
        <Route path="/diary" element={<DiaryDetails />} /> 
        <Route path="/playlist" element={<Playlist />} /> 

      </Routes>
    </Router>
  );
}

export default App;