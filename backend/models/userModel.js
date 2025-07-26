const db = require("../db");
const axios = require("axios");

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

exports.updateSpotifyTokens = async (userId, accessToken, refreshToken) => {
  if (refreshToken) {
    return db.query(
      `UPDATE users 
       SET spotify_access_token = $1,
           spotify_refresh_token = $2,
           spotify_token_updated_at = NOW()
       WHERE id = $3`,
      [accessToken, refreshToken, userId]
    );
  } else {
    return db.query(
      `UPDATE users 
       SET spotify_access_token = $1,
           spotify_token_updated_at = NOW()
       WHERE id = $2`,
      [accessToken, userId]
    );
  }
};

exports.updateSpotifyAccessToken = async (userId, accessToken) => {
  return db.query(
    `UPDATE users 
     SET spotify_access_token = $1,
         spotify_token_updated_at = NOW()
     WHERE id = $2`,
    [accessToken, userId]
  );
};

exports.getValidAccessToken = async (userId) => {
  const result = await db.query(
    `SELECT spotify_access_token, spotify_refresh_token FROM users WHERE id = $1`,
    [userId]
  );
  const user = result.rows[0];
  if (!user) throw new Error("User not found.");
  if (!user.spotify_access_token) throw new Error("No access token found.");

  try {
    await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${user.spotify_access_token}` }
    });
    return user.spotify_access_token;
  } catch (err) {
    if (err.response?.status === 401 && user.spotify_refresh_token) {
      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", user.spotify_refresh_token);
      params.append("client_id", SPOTIFY_CLIENT_ID);
      params.append("client_secret", SPOTIFY_CLIENT_SECRET);

      const response = await axios.post("https://accounts.spotify.com/api/token", params);
      const data = response.data;

      if (!data.access_token) {
        console.error('Spotify token refresh failed:', data);
        throw new Error("Spotify access token is invalid and cannot be refreshed.");
      }

      await exports.updateSpotifyAccessToken(userId, data.access_token);
      return data.access_token;
    }
    throw new Error("Spotify access token is invalid and cannot be refreshed.");
  }
};