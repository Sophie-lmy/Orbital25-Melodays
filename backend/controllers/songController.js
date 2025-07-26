const db = require('../db');

exports.likeSong = async (req, res) => {
  const userId = req.user.id;
  const {
    spotify_track_id,
    track_name,
    artist_name,
    album_name,
    album_image_url
  } = req.body;

  try {
    await db.query(`
      INSERT INTO liked_songs 
      (user_id, spotify_track_id, track_name, artist_name, album_name, album_image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [userId, spotify_track_id, track_name, artist_name, album_name, album_image_url]);

    res.status(201).json({ message: 'Song liked successfully.' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Song already liked.' });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getLikedSongs = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT spotify_track_id, track_name, artist_name, album_name, album_image_url, liked_at
       FROM liked_songs
       WHERE user_id = $1
       ORDER BY liked_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching liked songs' });
  }
};

exports.unlikeSong = async (req, res) => {
  const userId = req.user.id;
  const trackId = req.params.spotify_track_id;

  try {
    const result = await db.query(
      `DELETE FROM liked_songs WHERE user_id = $1 AND spotify_track_id = $2`,
      [userId, trackId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Song not found in liked list' });
    }

    res.json({ message: 'Song unliked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error unliking song' });
  }
};