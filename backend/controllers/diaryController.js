const db = require('../db');

exports.getAllDiaryEntries = async (req, res) => {
  const userId = req.user.id;
  const { type, month } = req.query;

  let query = `
    SELECT id, type, spotify_track_id, track_name, artist_name, album_name, album_image_url, 
           recommend_context, note, created_at
    FROM diary_entries
    WHERE user_id = $1
  `;
  const params = [userId];
  let idx = 2;

  if (type) {
    query += ` AND type = $${idx}`;
    params.push(type);
    idx++;
  }

  if (month) {
    query += ` AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', $${idx}::date)`;
    params.push(`${month}-01`);
  }

  query += ` ORDER BY created_at DESC`;

  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching diary entries:', err);
    res.status(500).json({ message: 'Failed to fetch diary entries.' });
  }
};

exports.getDiaryEntryById = async (req, res) => {
  const userId = req.user.id;
  const diaryId = req.params.id;

  try {
    const result = await db.query(
      `SELECT * FROM diary_entries WHERE id = $1 AND user_id = $2`,
      [diaryId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Diary entry not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching diary entry:', err);
    res.status(500).json({ message: 'Failed to fetch diary entry.' });
  }
};

exports.updateDiaryNote = async (req, res) => {
  const userId = req.user.id;
  const diaryId = req.params.id;
  const { note } = req.body;

  try {
    const check = await db.query(
      `SELECT id FROM diary_entries WHERE id = $1 AND user_id = $2`,
      [diaryId, userId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Diary entry not found.' });
    }

    await db.query(
      `UPDATE diary_entries SET note = $1 WHERE id = $2`,
      [note, diaryId]
    );

    res.json({ message: 'Note updated successfully.' });
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ message: 'Failed to update note.' });
  }
};

exports.getAllEntriesWithNote = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT * FROM diary_entries 
       WHERE user_id = $1 AND note IS NOT NULL AND TRIM(note) <> '' 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching entries with note:', err);
    res.status(500).json({ message: 'Failed to fetch notes.' });
  }
};