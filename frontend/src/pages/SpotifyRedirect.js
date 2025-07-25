import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SpotifyRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');

    if (accessToken) {
      localStorage.setItem('spotify_access_token', accessToken);
      localStorage.setItem('spotify_token_expiry', Date.now() + parseInt(expiresIn) * 1000);
      navigate('/home');
    } else {
      alert('Spotify login failed.');
      navigate('/');
    }
  }, [navigate]);

  return <div>Authenticating Spotify...</div>;
}

export default SpotifyRedirect;
