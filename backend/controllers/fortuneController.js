const { searchSongs } = require('../models/songModel');
const userModel = require('../models/userModel');
const diaryModel = require('../models/diaryModel');

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

    if (!result || !result.id) {
      return res.status(500).json({ error: 'No track found for this fortune.' });
    }

    await diaryModel.createDiaryEntry({
    userId,
    type: `Fortune-${type[0].toUpperCase()}${type.slice(1).replace(/-/g, '')}`,
    song: result,
    recommend_context: { theme: type, question },
    note: `I was wondering about: "${question}"`
    });


    res.json({
      id: result.id, 
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