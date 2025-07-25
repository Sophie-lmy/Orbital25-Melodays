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
  let attempt = 0;
  while (attempt < maxAttempts) {
    const query = buildQuery(keywords);
    const result = await searchSongs(query, token);
    if (result && result.id && result.name) {
      return result;
    }
    attempt++;
  }
  return null;
}

exports.recommendByMood = async (req, res) => {
  const userId = req.user.id;
  const mood = req.body.mood;
  const keywords = moodKeywords[mood];

  if (!keywords) {
    return res.status(400).json({ error: 'Invalid or missing mood.' });
  }

  try {
    const token = await userModel.getValidAccessToken(userId);
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
        track.name,
        track.artists?.[0]?.name || '',
        track.album?.name || '',
        track.album?.images?.[0]?.url || '',
        { mood }
      ]
    );

    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch mood-based recommendation.' });
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
        track.name,
        track.artists?.[0]?.name || '',
        track.album?.name || '',
        track.album?.images?.[0]?.url || '',
        { activity }
      ]
    );

    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch activity-based recommendation.' });
  }
};