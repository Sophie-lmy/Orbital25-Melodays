const pool = require('./index');

async function initDatabase() {
  try {
    const versionCheck = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='meta' AND column_name='schema_version';
    `);

    let shouldReset = false;

    if (versionCheck.rowCount === 0) {
      shouldReset = true;
    } else {
      const versionQuery = await pool.query(`SELECT schema_version FROM meta LIMIT 1`);
      const version = versionQuery.rows[0]?.schema_version || 0;
      shouldReset = version < 3;
    }

    if (shouldReset) {
      console.log("Schema outdated or missing, resetting database...");

      await pool.query(`DROP TABLE IF EXISTS diary_entries, liked_songs, users, meta CASCADE;`);

      await pool.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100),
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
          spotify_url TEXT,
          spotify_uri TEXT,
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
          spotify_track_id VARCHAR(100),
          track_name TEXT,
          artist_name TEXT,
          album_name TEXT,
          album_image_url TEXT,
          spotify_url TEXT,
          spotify_uri TEXT,
          recommend_context JSONB,
          note TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT diary_entries_type_check
            CHECK (type IN (
              'Mood-Happy', 'Mood-Sad', 'Mood-Angry', 'Mood-Loved', 'Mood-Nostalgic',
              'Activity-Focusing', 'Activity-Exercising', 'Activity-Sleeping', 'Activity-Relaxing', 'Activity-Commuting',
              'Fortune-Love', 'Fortune-Career', 'Fortune-Choice', 'Fortune-SelfDiscovery',
              'Daily'
            ))
        );
      `);

      await pool.query(`
        CREATE TABLE meta (
          initialized_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          schema_version INT
        );
      `);

      await pool.query(`
        INSERT INTO meta (schema_version) VALUES (3);
      `);

      console.log("Database reset and initialized to version 3.");
    } else {
      console.log("Checking schema version.");

      const versionQuery = await pool.query(`SELECT schema_version FROM meta LIMIT 1`);
      const version = versionQuery.rows[0]?.schema_version || 0;

      if (version >= 3) {
        console.log("Schema version is already 3. Skipping migrations.");
        return;
      }

      console.log("Applying migrations to bring schema up to version 3.");

      await pool.query(`
        ALTER TABLE users
        ALTER COLUMN username DROP NOT NULL,
        ADD COLUMN IF NOT EXISTS daily_recommendation JSONB,
        ADD COLUMN IF NOT EXISTS daily_recommendation_date DATE,
        ADD COLUMN IF NOT EXISTS spotify_access_token TEXT,
        ADD COLUMN IF NOT EXISTS spotify_refresh_token TEXT,
        ADD COLUMN IF NOT EXISTS spotify_token_updated_at TIMESTAMP;
      `);

      await pool.query(`
        ALTER TABLE liked_songs
        ADD COLUMN IF NOT EXISTS spotify_url TEXT,
        ADD COLUMN IF NOT EXISTS spotify_uri TEXT;
      `);

      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS unique_user_song 
        ON liked_songs(user_id, spotify_track_id);
      `);

      await pool.query(`
        DELETE FROM diary_entries
        WHERE type NOT IN (
          'Mood-Happy', 'Mood-Sad', 'Mood-Angry', 'Mood-Loved', 'Mood-Nostalgic',
          'Activity-Focusing', 'Activity-Exercising', 'Activity-Sleeping', 'Activity-Relaxing', 'Activity-Commuting',
          'Fortune-Love', 'Fortune-Career', 'Fortune-Choice', 'Fortune-SelfDiscovery',
          'Daily'
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
        CHECK (type IN (
          'Mood-Happy', 'Mood-Sad', 'Mood-Angry', 'Mood-Loved', 'Mood-Nostalgic',
          'Activity-Focusing', 'Activity-Exercising', 'Activity-Sleeping', 'Activity-Relaxing', 'Activity-Commuting',
          'Fortune-Love', 'Fortune-Career', 'Fortune-Choice', 'Fortune-SelfDiscovery',
          'Daily'
        ));
      `);

      await pool.query(`
        ALTER TABLE diary_entries
        ADD COLUMN IF NOT EXISTS spotify_url TEXT,
        ADD COLUMN IF NOT EXISTS spotify_uri TEXT,
        DROP COLUMN IF EXISTS question;
      `);

      await pool.query(`
        UPDATE meta SET schema_version = 3;
      `);

      console.log("Schema migration to version 3 completed.");
    }
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}

module.exports = initDatabase;