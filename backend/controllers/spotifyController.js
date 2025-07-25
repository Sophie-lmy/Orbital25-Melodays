const axios = require("axios");
const userModel = require("../models/userModel");

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

exports.spotifyAuthorize = (req, res) => {
  const userId = req.user.id;
  const scope =
    "user-read-private user-read-email streaming user-modify-playback-state user-read-playback-state";
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    SPOTIFY_REDIRECT_URI
  )}&scope=${encodeURIComponent(scope)}&state=${userId}&show_dialog=true`;
  res.json({ url: authUrl });
};

exports.spotifyCallback = async (req, res) => {
  const code = req.query.code;
  const userId = req.query.state;
  if (!userId || userId === 'undefined') {
    return res.status(400).json({ message: 'Missing or invalid state (userId)' });
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", SPOTIFY_REDIRECT_URI);
    params.append("client_id", SPOTIFY_CLIENT_ID);
    params.append("client_secret", SPOTIFY_CLIENT_SECRET);

    const tokenRes = await axios.post("https://accounts.spotify.com/api/token", params);
    const { access_token, refresh_token, expires_in } = tokenRes.data;

    await userModel.updateSpotifyTokens(userId, access_token, refresh_token);

    res.redirect(
      `https://melodays-frontend.vercel.app/spotify-redirect?access_token=${access_token}&expires_in=${expires_in}`
    );
  } catch (err) {
    console.error("Spotify Callback Error:", err.response?.data || err);
    res.status(500).json({ message: "Spotify authentication failed." });
  }
};

exports.refreshToken = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  const refresh_token = user.spotify_refresh_token;

  if (!refresh_token) {
    return res.status(400).json({ message: "No refresh token found." });
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refresh_token);
    params.append("client_id", SPOTIFY_CLIENT_ID);
    params.append("client_secret", SPOTIFY_CLIENT_SECRET);

    const response = await axios.post("https://accounts.spotify.com/api/token", params);
    const access_token = response.data.access_token;

    await userModel.updateSpotifyAccessToken(user.id, access_token);

    res.json({ access_token });
  } catch (err) {
    console.error("Refresh token error:", err.response?.data || err);
    res.status(500).json({ message: "Failed to refresh token" });
  }
};