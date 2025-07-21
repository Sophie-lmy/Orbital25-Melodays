const axios = require('axios');

const searchSongs = async (query, token) => {
  try {
    const playlistRes = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'playlist', limit: 5 }
    });

    const playlists = playlistRes.data.playlists.items;
    if (!playlists.length) {
      throw new Error('No playlist found for this query.');
    }

    const chosenPlaylist = playlists[Math.floor(Math.random() * playlists.length)];

    const tracksRes = await axios.get(
      `https://api.spotify.com/v1/playlists/${chosenPlaylist.id}/tracks`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 20 }
      }
    );

    const tracks = tracksRes.data.items.filter(item => item.track);
    if (!tracks.length) {
      throw new Error('No tracks found in selected playlist.');
    }

    const track = tracks[Math.floor(Math.random() * tracks.length)].track;

    return {
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      cover: track.album.images[0]?.url,
      preview_url: track.preview_url,
      spotify_url: track.external_urls.spotify,
      spotify_uri: track.uri,
      id: track.id
    };
  } catch (err) {
    console.error('Failed to search playlist-based songs:', err.response?.data || err.message);
    throw new Error('Spotify playlist-based search failed.');
  }
};

module.exports = { searchSongs };