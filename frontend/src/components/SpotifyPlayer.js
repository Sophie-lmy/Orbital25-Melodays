import React, { useEffect } from 'react';

function SpotifyPlayer() {
  useEffect(() => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
      console.warn("No Spotify access token found.");
      return;
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Melodays Web Player',
        getOAuthToken: cb => cb(accessToken),
        volume: 0.5
      });

      player.addListener('initialization_error', ({ message }) => {
        console.error('Initialization Error:', message);
      });
      player.addListener('authentication_error', ({ message }) => {
        console.error('Auth Error:', message);
      });
      player.addListener('account_error', ({ message }) => {
        console.error('Account Error:', message);
      });
      player.addListener('playback_error', ({ message }) => {
        console.error('Playback Error:', message);
      });

      //store the device_id for later use
      player.addListener('ready', ({ device_id }) => {
        console.log('Spotify Web Player ready with device ID:', device_id);
        localStorage.setItem('spotify_device_id', device_id);
      });

      player.connect();
    };
  }, []);

  return null;
}

export default SpotifyPlayer;
