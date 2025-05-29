const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());


const moodToSong = {
  happy: [
    "Happy - Pharrell Williams",
    "Can't Stop the Feeling! - Justin Timberlake",
    "Walking on Sunshine - Katrina and the Waves"
  ],
  sad: [
    "Someone Like You - Adele",
    "Let Her Go - Passenger",
    "Fix You - Coldplay"
  ],
  angry: [
    "Breaking the Habit - Linkin Park",
    "Killing In the Name - Rage Against The Machine",
    "Stronger - Kanye West"
  ]
};


const activityToSong = {
  sleep: [
    "Clair de Lune - Debussy",
    "Nocturne Op.9 No.2 - Chopin",
    "Weightless - Marconi Union"
  ],
  exercise: [
    "Eye of the Tiger - Survivor",
    "Lose Yourself - Eminem",
    "Stronger - Kanye West"
  ],
  study: [
    "Rain Sounds - Relaxing White Noise",
    "Canon in D - Pachelbel",
    "Lofi Beats - Chillhop Music"
  ]
};

app.post('/emotion', (req, res) => {
  const emotion = req.body.emotion;

  if (!emotion) {
    return res.status(400).json({ error: 'Missing required field: emotion' });
  }

  const songs = moodToSong[emotion.toLowerCase()];
  if (songs && songs.length > 0) {
    const randomIndex = Math.floor(Math.random() * songs.length);
    res.json({ song: songs[randomIndex] });
  } else {
    res.json({ song: 'Songs not available' });
  }
});

app.post('/activity', (req, res) => {
  const activity = req.body.activity;

  if (!activity) {
    return res.status(400).json({ error: 'Missing required field: activity' });
  }

  const songs = activityToSong[activity.toLowerCase()];
  if (songs && songs.length > 0) {
    const randomIndex = Math.floor(Math.random() * songs.length);
    res.json({ song: songs[randomIndex] });
  } else {
    res.json({ song: 'No songs available' });
  }
});

// test
app.listen(port, () => {
  console.log('Server is running');
});
