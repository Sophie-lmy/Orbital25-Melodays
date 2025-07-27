import React, { useEffect } from 'react';

function SpotifyPlayer({ accessToken }) {
  useEffect(() => {
    if (!accessToken) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Melodays Web Player',
        getOAuthToken: cb => { cb(accessToken); },
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

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        // You can store device_id to transfer playback
      });

      player.connect();
    };
  }, [accessToken]);

  return null; 
}

export default SpotifyPlayer;
