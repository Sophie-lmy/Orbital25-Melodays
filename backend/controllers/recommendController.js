const axios = require('axios');
const { getValidAccessToken } = require('../utils/spotifyToken');
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
  const selected = keywords.sort(() => 0.5 - Math.random()).slice(0, Math.ceil(Math.random() * 3));
  return selected.join(' ');
}

async function searchSongs(query, token) {
  const res = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      q: query,
      type: 'track',
      limit: 10
    }
  });

  const tracks = res.data.tracks.items;

  if (tracks.length === 0) {
    throw new Error('No tracks found.');
  }

  const selected = tracks[Math.floor(Math.random() * tracks.length)];

  return {
    title: selected.name,
    artist: selected.artists[0]?.name,
    preview_url: selected.preview_url,
    spotify_url: selected.external_urls.spotify,
    cover: selected.album.images[0]?.url
  };
}

exports.recommendByMood = async (req, res) => {
  const userId = req.user.id;
  const mood = req.body.mood;
  const keywords = moodKeywords[mood];
  if (!keywords) {
    return res.status(400).json({ error: 'Invalid or missing mood.' });
  }

  try {
    const token = await getValidAccessToken();
    const query = buildQuery(keywords);
    const result = await searchSongs(query, token);

    await db.query(
      `INSERT INTO diary_entries (user_id, type, recommend_context)
       VALUES ($1, 'recommend', $2)`,
      [userId, { mood }]
    );

    res.json(result);
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
    const token = await getValidAccessToken();
    const query = buildQuery(keywords);
    const result = await searchSongs(query, token);

    await db.query(
      `INSERT INTO diary_entries (user_id, type, recommend_context)
       VALUES ($1, 'recommend', $2)`,
      [userId, { activity }]
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch activity-based recommendation.' });
  }
};