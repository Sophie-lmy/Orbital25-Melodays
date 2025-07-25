const pool = require('./index');

async function initDatabase() {
  try {
    const metaCheck = await pool.query(`
      SELECT to_regclass('public.meta') AS exists;
    `);

    const isFirstTime = !metaCheck.rows[0].exists;

    if (isFirstTime) {
      console.log("First-time startup: resetting database...");

      await pool.query(`DROP TABLE IF EXISTS diary_entries, liked_songs, users CASCADE;`);

      await pool.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          daily_recommendation JSONB,
          daily_recommendation_date DATE,
          spotify_access_token TEXT,
          spotify_refresh_token TEXT,
          spotify_token_updated_at TIMESTAMP
        );
      `);

      await pool.query(`
        CREATE TABLE liked_songs (
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
        CREATE UNIQUE INDEX unique_user_song ON liked_songs(user_id, spotify_track_id);
      `);

      await pool.query(`
        CREATE TABLE diary_entries (
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
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT diary_entries_type_check
            CHECK (type IN ('recommend', 'like', 'fortune', 'mood', 'activity', 'daily'))
        );
      `);

      await pool.query(`
        CREATE TABLE meta (
          initialized_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log("Database reset and initialized successfully.");
    } else {
      console.log("Subsequent startup: ensuring schema is up-to-date...");

      await pool.query(`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS daily_recommendation JSONB,
        ADD COLUMN IF NOT EXISTS daily_recommendation_date DATE,
        ADD COLUMN IF NOT EXISTS spotify_access_token TEXT,
        ADD COLUMN IF NOT EXISTS spotify_refresh_token TEXT,
        ADD COLUMN IF NOT EXISTS spotify_token_updated_at TIMESTAMP;
      `);

      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS unique_user_song 
        ON liked_songs(user_id, spotify_track_id);
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

      console.log("Schema migration completed.");
    }
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}

module.exports = initDatabase;