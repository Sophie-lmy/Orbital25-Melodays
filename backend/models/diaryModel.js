const db = require("../db");

exports.createDiaryEntry = async ({
  userId,
  type,
  song,
  recommend_context = null,
  note = null
}) => {
  try {
    const serializedContext =
      recommend_context !== null ? JSON.stringify(recommend_context) : null;

    await db.query(
      `INSERT INTO diary_entries (
        user_id,
        type,
        spotify_track_id,
        track_name,
        artist_name,
        album_name,
        album_image_url,
        spotify_url,
        spotify_uri,
        recommend_context,
        note
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        userId,
        type,
        song.id,
        song.title,
        song.artist,
        song.album,
        song.cover,
        song.spotify_url,
        song.spotify_uri,
        serializedContext,
        note
      ]
    );
  } catch (err) {
    console.error("Error inserting diary entry:", err);
    throw err;
  }
};