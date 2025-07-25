const pool = require('./index');

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS daily_recommendation JSONB,
      ADD COLUMN IF NOT EXISTS daily_recommendation_date DATE,
      ADD COLUMN IF NOT EXISTS spotify_access_token TEXT,
      ADD COLUMN IF NOT EXISTS spotify_refresh_token TEXT,
      ADD COLUMN IF NOT EXISTS spotify_token_updated_at TIMESTAMP;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS liked_songs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        spotify_track_id VARCHAR(100) NOT NULL,
        track_name TEXT NOT NULL,
        artist_name TEXT NOT NULL,
        album_name TEXT,
        album_image_url TEXT,
        liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes
          WHERE indexname = 'unique_user_song'
        ) THEN
          CREATE UNIQUE INDEX unique_user_song 
          ON liked_songs(user_id, spotify_track_id);
        END IF;
      END
      $$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS diary_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        question TEXT,
        spotify_track_id VARCHAR(100),
        track_name TEXT,
        artist_name TEXT,
        album_name TEXT,
        album_image_url TEXT,
        recommend_context JSONB,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'diary_entries_type_check'
        ) THEN
          ALTER TABLE diary_entries DROP CONSTRAINT diary_entries_type_check;
        END IF;
      END
      $$;
    `);

    await pool.query(`
      ALTER TABLE diary_entries
      ADD CONSTRAINT diary_entries_type_check
      CHECK (type IN ('recommend', 'like', 'fortune', 'mood', 'activity', 'daily'));
    `);

    console.log('Database initialized.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

module.exports = initDatabase;