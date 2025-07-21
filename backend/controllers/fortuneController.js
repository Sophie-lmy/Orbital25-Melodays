const db = require('../db');
const { searchSongs } = require('../models/songModel');
const userModel = require('../models/userModel');

const validThemes = ["love", "career", "choice", "self-discovery"];

exports.getMusicFortune = async (req, res) => {
  const userId = req.user.id;
  const { type, question } = req.body;

  if (!validThemes.includes(type)) {
    return res.status(400).json({ error: 'Invalid type.' });
  }

  try {
    const token = await userModel.getValidAccessToken(userId);
    const query = `${type} ${question}`;
    const result = await searchSongs(query, token);

    await db.query(
      `INSERT INTO diary_entries (
        user_id, type, question, 
        spotify_track_id, track_name, artist_name, album_name, album_image_url
      ) VALUES ($1, 'fortune', $2, $3, $4, $5, $6, $7)`,
      [
        userId,
        question,
        result.id,
        result.title,
        result.artist,
        result.album,
        result.cover
      ]
    );

    res.json({
      track_name: result.title,
      artist_name: result.artist,
      album_name: result.album,
      album_image_url: result.cover,
      spotify_track_id: result.id,
      preview_url: result.preview_url,
      external_url: result.spotify_url,
      spotify_uri: result.spotify_uri
    });
  } catch (err) {
    console.error('Fortune error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch fortune track.' });
  }
};