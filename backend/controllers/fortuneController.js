const axios = require('axios');
const db = require('../db');
const { getValidAccessToken } = require('../utils/spotifyToken');

const validThemes = ["love", "career", "choice", "self-discovery"];

exports.getMusicFortune = async (req, res) => {
  const userId = req.user.id;
  const { type, question } = req.body;

  if (!validThemes.includes(type)) {
    return res.status(400).json({ error: 'Invalid type.' });
  }

  try {
    const token = await getValidAccessToken();
    const query = `${type} ${question}`;

    const playlistRes = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'playlist', limit: 5 }
    });

    const playlists = playlistRes.data.playlists.items;
    if (!playlists.length) {
      return res.status(404).json({ error: 'No playlist found for this question.' });
    }

    const chosenPlaylist = playlists[Math.floor(Math.random() * playlists.length)];
    const tracksRes = await axios.get(
      `https://api.spotify.com/v1/playlists/${chosenPlaylist.id}/tracks`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 20 }
      }
    );

    const tracks = tracksRes.data.items.filter(item => item.track);
    if (!tracks.length) {
      return res.status(404).json({ error: 'No tracks found in selected playlist.' });
    }

    const track = tracks[Math.floor(Math.random() * tracks.length)].track;

    await db.query(
      `INSERT INTO diary_entries (
        user_id, type, question, 
        spotify_track_id, track_name, artist_name, album_name, album_image_url
      ) VALUES ($1, 'fortune', $2, $3, $4, $5, $6, $7)`,
      [
        userId,
        question,
        track.id,
        track.name,
        track.artists.map(a => a.name).join(', '),
        track.album.name,
        track.album.images[0]?.url
      ]
    );

    res.json({
      track_name: track.name,
      artist_name: track.artists.map(a => a.name).join(', '),
      album_name: track.album.name,
      album_image_url: track.album.images[0]?.url,
      spotify_track_id: track.id,
      preview_url: track.preview_url,
      external_url: track.external_urls.spotify
    });
  } catch (err) {
    console.error('Fortune error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch fortune track.' });
  }
};