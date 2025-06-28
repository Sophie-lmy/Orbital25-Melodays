const axios = require('axios');
const { getValidAccessToken } = require('../utils/spotifyToken');

const keywordPool = {
  season: {
    spring: ['bloom', 'rain', 'fresh', 'garden', 'green'],
    summer: ['sun', 'beach', 'freedom', 'heat', 'blue sky'],
    autumn: ['leaves', 'wind', 'nostalgia', 'amber', 'quiet'],
    winter: ['snow', 'fireplace', 'cozy', 'chill', 'blanket']
  },
  timeOfDay: {
    morning: ['sunrise', 'coffee', 'new day', 'bright', 'calm'],
    afternoon: ['energy', 'sunshine', 'movement', 'light'],
    evening: ['sunset', 'slow', 'reflection', 'orange sky', 'cool breeze'],
    night: ['stars', 'moon', 'dream', 'silence', 'melody']
  },
  general: [
    'love', 'lonely', 'happy', 'sad', 'dance', 'sleep', 'hope',
    'city', 'drive', 'sky', 'cry', 'memory', 'light', 'storm',
    'home', 'midnight', 'story', 'heartbeat', 'fade', 'time'
  ]
};

function getCurrentSeason(date = new Date()) {
  const month = date.getMonth() + 1;
  if ([12, 1, 2].includes(month)) return 'winter';
  if ([3, 4, 5].includes(month)) return 'spring';
  if ([6, 7, 8].includes(month)) return 'summer';
  return 'autumn';
}

function getTimeOfDay(hour) {
  if (hour < 11) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 20) return 'evening';
  return 'night';
}

function buildSmartQuery() {
  const now = new Date();
  const season = getCurrentSeason(now);
  const timeOfDay = getTimeOfDay(now.getHours());

  const combinedPool = [
    ...keywordPool.general,
    ...keywordPool.season[season],
    ...keywordPool.timeOfDay[timeOfDay]
  ];

  const selected = sampleRandomWords(combinedPool, 2 + Math.floor(Math.random() * 2)); // 选 2~3 个词
  return selected.join(' ');
}

function sampleRandomWords(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function getTimeBasedRecommendedTrack(token) {
  const query = buildSmartQuery();

  const res = await axios.get('https://api.spotify.com/v1/search', {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: 'track', limit: 20 }
  });

  const tracks = res.data.tracks.items;
  if (!tracks.length) throw new Error('No tracks found.');

  const track = tracks[Math.floor(Math.random() * tracks.length)];
  return {
    title: track.name,
    artist: track.artists.map(a => a.name).join(', '),
    preview_url: track.preview_url,
    spotify_url: track.external_urls.spotify,
    cover: track.album.images[0]?.url
  };
}

exports.getDailyRecommendation = async (req, res) => {
  try {
    const token = await getValidAccessToken();
    const result = await getTimeBasedRecommendedTrack(token);
    res.json(result);
  } catch (err) {
    console.error('Daily recommendation failed:', err.message);
    res.status(500).json({ error: 'Daily recommendation failed.' });
  }
};