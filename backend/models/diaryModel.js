const db = require("../db");

exports.createDiaryEntry = async ({
  userId,
  type,
  song,
  recommend_context = null,
  note = null
}) => {
  try {
    await db.query(
      `INSERT INTO diary_entries (
        user_id,
        type,
        spotify_track_id,
        track_name,
        artist_name,
        album_name,
        album_image_url,
        recommend_context,
        note
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userId,
        type,
        song.id,
        song.title,
        song.artist,
        song.album,
        song.cover,
        recommend_context,
        note
      ]
    );
  } catch (err) {
    console.error("Error inserting diary entry:", err);
    throw err;
  }
};