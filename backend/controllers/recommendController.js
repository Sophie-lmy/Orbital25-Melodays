const { searchSongs } = require('../models/songModel');
const userModel = require('../models/userModel');
const diaryModel = require('../models/diaryModel');

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

exports.recommendByMood = async (req, res) => {
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

    const moodType = `Mood-${mood[0].toUpperCase()}${mood.slice(1)}`;

    await diaryModel.createDiaryEntry({
      userId,
      type: moodType,
      song: track,
      recommend_context: mood,
      note: null
    });

    res.json(track);
  } catch (err) {
    console.error("recommendByMood error:", err);
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
    if (!token) {
      return res.status(401).json({ error: 'Spotify not linked or token expired.' });
    }

    const track = await getValidSong(keywords, token);
    if (!track) {
      return res.status(500).json({ error: 'Failed to get valid recommendation after retries.' });
    }

    const activityType = `Activity-${activity[0].toUpperCase()}${activity.slice(1)}`;

    await diaryModel.createDiaryEntry({
      userId,
      type: activityType,
      song: track,
      recommend_context: activity,
      note: null
    });

    res.json(track);
  } catch (err) {
    console.error("recommendByActivity error:", err);
    res.status(500).json({ error: 'Failed to fetch activity-based recommendation.' });
  }
};