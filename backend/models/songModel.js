const axios = require('axios');

const searchSongs = async (query, token) => {
  try {
    const res = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: query,
        type: 'track',
        limit: 10
      }
    });

    const tracks = res.data.tracks.items;

    if (tracks.length === 0) {
      throw new Error('No tracks found.');
    }

    const selected = tracks[Math.floor(Math.random() * tracks.length)];

    return {
      title: selected.name,
      artist: selected.artists[0]?.name,
      preview_url: selected.preview_url,
      spotify_url: selected.external_urls.spotify,
      cover: selected.album.images[0]?.url
    };
  } catch (err) {
    console.error('Failed to search songs:', err.response?.data || err.message);
    throw new Error('Spotify track search failed.');
  }
};

module.exports = { searchSongs };