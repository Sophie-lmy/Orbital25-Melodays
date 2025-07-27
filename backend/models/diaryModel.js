const db = require("../db");

exports.createDiaryEntry = async ({ userId, type, song, recommend_context = null, note = null }) => {
  try {
    await db.query(
      `INSERT INTO diary_entries 
       (user_id, type, song, recommend_context, note)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, type, song, recommend_context, note]
    );
  } catch (err) {
    console.error("Error inserting diary entry:", err);
    throw err;
  }
};