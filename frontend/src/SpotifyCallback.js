import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function SpotifyCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get('code');
    const state = params.get('state'); 

    //sends code and userId to backend
    const exchangeSpotifyCode = async () => {
      const res = await fetch('/api/spotify/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, userId: state }),
      });

      if (res.ok) {
        const data = await res.json();
        alert('Spotify linked successfully!');
        navigate('/HomePage'); 
      } else {
        alert('Failed to link Spotify');
        navigate('/SetupAccount');
      }
    };

    if (code && state) exchangeSpotifyCode();
  }, [params, navigate]);

  return <div>Linking Spotify...</div>;
}

export default SpotifyCallback;
