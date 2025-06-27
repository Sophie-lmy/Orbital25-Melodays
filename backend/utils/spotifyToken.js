const axios = require('axios');
require('dotenv').config();

let accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_ME_URL = 'https://api.spotify.com/v1/me';

async function refreshAccessToken() {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    const response = await axios.post(SPOTIFY_TOKEN_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
    });

    accessToken = response.data.access_token;
    console.log('Access Token refreshed');
    return accessToken;
  } catch (err) {
    console.error('Failed to refresh token:', err.response?.data || err.message);
    throw new Error('Failed to refresh token');
  }
}

async function isTokenValid(token) {
  try {
    await axios.get(SPOTIFY_ME_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    if (err.response?.status === 401) {
      return false;
    }
    throw err;
  }
}

async function getValidAccessToken() {
  const valid = await isTokenValid(accessToken);
  if (valid) {
    return accessToken;
  }
  return await refreshAccessToken();
}

module.exports = { getValidAccessToken };