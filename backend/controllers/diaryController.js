const db = require('../db');

exports.getAllDiaryEntries = async (req, res) => {
  const userId = req.user.id;
  const { types, month } = req.query;

  let query = `
    SELECT id, type, spotify_track_id, track_name, artist_name, album_name, album_image_url, 
           recommend_context, note, created_at
    FROM diary_entries
    WHERE user_id = $1
  `;
  const params = [userId];
  let idx = 2;

  if (types) {
    const typeList = Array.isArray(types) ? types : [types];
    const placeholders = typeList.map((_, i) => `$${idx + i}`).join(', ');
    query += ` AND type IN (${placeholders})`;
    params.push(...typeList);
    idx += typeList.length;
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