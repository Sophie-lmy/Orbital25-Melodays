const { searchSongs } = require('../models/songModel');
const userModel = require('../models/userModel');
const db = require('../db');

const moodKeywords = {
  happy: ['joyful', 'cheerful', 'sunshine', 'celebration'],
  sad: ['melancholy', 'tears', 'lonely', 'farewell'],
  angry: ['rage', 'storm', 'shout', 'fire'],
  loved: ['romantic', 'heartbeat', 'together', 'forever'],
  nostalgic: ['memory', 'childhood', 'old days', 'past']
};

const activityKeywords = {
  focusing: ['concentration', 'instrumental', 'study', 'brain'],
  exercising: ['workout', 'intense', 'training', 'power'],
  sleeping: ['sleep', 'calm', 'night', 'dream'],
  relaxing: ['chill', 'breeze', 'easy', 'slow'],
  commuting: ['drive', 'travel', 'on the road', 'city']
};

function buildQuery(keywords) {
  const selected = keywords
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.ceil(Math.random() * 3));
  return selected.join(' ');
}

async function getValidSong(keywords, token, maxAttempts = 5) {
  if (!token) return null;

  let attempt = 0;
  while (attempt < maxAttempts) {
    const query = buildQuery(keywords);
    const result = await searchSongs(query, token);
    if (result && result.id && result.title) {
      return result;
    }
    attempt++;
  }
  return null;
}

/*exports.recommendByMood = async (req, res) => {
  const userId = req.user.id;
  const mood = req.body.mood;
  const keywords = moodKeywords[mood];

  if (!keywords) {
    return res.status(400).json({ error: 'Invalid or missing mood.' });
  }

  try {
    const token = await userModel.getValidAccessToken(userId);
    if (!token) {
      return res.status(401).json({ error: 'Spotify not linked or token expired.' });
    }

    const track = await getValidSong(keywords, token);
    if (!track) {
      return res.status(500).json({ error: 'Failed to get valid recommendation after retries.' });
    }

    await db.query(
      `INSERT INTO diary_entries 
        (user_id, type, spotify_track_id, track_name, artist_name, album_name, album_image_url, recommend_context)
       VALUES ($1, 'mood', $2, $3, $4, $5, $6, $7)`,
      [
        userId,
        track.id,
        track.title,
        track.artist,
        track.album,
        track.cover,
        { mood }
      ]
    );

    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch mood-based recommendation.' });
  }
}; */


exports.recommendByMood = async (req, res) => {
  const userId = req.user.id;
  const mood = req.body.mood;

  if (!mood || !moodKeywords[mood]) {
    return res.status(400).json({ error: 'Invalid or missing mood.' });
  }

  try {
    // ⛔ Skip Spotify logic
    const track = {
      id: 'hardcoded123',
      title: 'Imagine',
      artist: 'John Lennon',
      album: 'Imagine',
      cover: 'https://i.scdn.co/image/ab67616d0000b273d4f5f2d1a4b244b5a9ff6b35',
      preview_url: 'https://p.scdn.co/mp3-preview/3d1f602cd740e8488b0110ce37017fc0cf994f3d?cid=774b29d4f13844c495f206cafdad9c86'
    };

    await db.query(
      `INSERT INTO diary_entries 
        (user_id, type, spotify_track_id, track_name, artist_name, album_name, album_image_url, recommend_context)
       VALUES ($1, 'mood', $2, $3, $4, $5, $6, $7)`,
      [
        userId,
        track.id,
        track.title,
        track.artist,
        track.album,
        track.cover,
        { {mood} }
      ]
    );

    res.json(track);
  } catch (err) {
    console.error("HARD CODE FAIL", err); 
    res.status(500).json({ error: 'Temporary recommendation fallback failed.' });
  }
};


exports.recommendByActivity = async (req, res) => {
  const userId = req.user.id;
  const activity = req.body.activity;
  const keywords = activityKeywords[activity];

  if (!keywords) {
    return res.status(400).json({ error: 'Invalid or missing activity.' });
  }

  try {
    const token = await userModel.getValidAccessToken(userId);
    if (!token) {
      return res.status(401).json({ error: 'Spotify not linked or token expired.' });
    }

    const track = await getValidSong(keywords, token);
    if (!track) {
      return res.status(500).json({ error: 'Failed to get valid recommendation after retries.' });
    }

    await db.query(
      `INSERT INTO diary_entries 
        (user_id, type, spotify_track_id, track_name, artist_name, album_name, album_image_url, recommend_context)
       VALUES ($1, 'activity', $2, $3, $4, $5, $6, $7)`,
      [
        userId,
        track.id,
        track.title,
        track.artist,
        track.album,
        track.cover,
        { activity }
      ]
    );

    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch activity-based recommendation.' });
  }
};