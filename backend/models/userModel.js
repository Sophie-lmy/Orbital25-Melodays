const db = require("../db");

exports.createUser = async (username, email, hashedPassword) => {
  return db.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
    [username, email, hashedPassword]
  );
};

exports.findByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

exports.findById = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

exports.updateDailyRecommendation = async (userId, date, songJson) => {
  return db.query(
    "UPDATE users SET daily_recommendation = $1, daily_recommendation_date = $2 WHERE id = $3",
    [songJson, date, userId]
  );
};

exports.updateSpotifyTokens = async (userId, accessToken, refreshToken) => {
  return db.query(
    `UPDATE users 
     SET spotify_access_token = $1, spotify_refresh_token = $2 
     WHERE id = $3`,
    [accessToken, refreshToken, userId]
  );
};

exports.updateSpotifyAccessToken = async (userId, accessToken) => {
  return db.query(
    `UPDATE users 
     SET spotify_access_token = $1 
     WHERE id = $2`,
    [accessToken, userId]
  );
};