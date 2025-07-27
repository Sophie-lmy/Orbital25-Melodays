const userModel = require("../models/userModel");
const diaryModel = require("../models/diaryModel");
const { searchSongs } = require("../models/songModel");

const keywordPool = {
  season: {
    spring: ["bloom", "rain", "fresh", "garden", "green"],
    summer: ["sun", "beach", "freedom", "heat", "blue sky"],
    autumn: ["leaves", "wind", "nostalgia", "amber", "quiet"],
    winter: ["snow", "fireplace", "cozy", "chill", "blanket"]
  },
  general: [
    "love", "lonely", "happy", "sad", "dance", "sleep", "hope",
    "city", "drive", "sky", "cry", "memory", "light", "storm",
    "home", "midnight", "story", "heartbeat", "fade", "time"
  ]
};

function getCurrentSeason(date = new Date()) {
  const month = date.getMonth() + 1;
  if ([12, 1, 2].includes(month)) return "winter";
  if ([3, 4, 5].includes(month)) return "spring";
  if ([6, 7, 8].includes(month)) return "summer";
  return "autumn";
}

function buildSmartQuery() {
  const now = new Date();
  const season = getCurrentSeason(now);

  const combinedPool = [
    ...keywordPool.general,
    ...keywordPool.season[season]
  ];

  const selected = sampleRandomWords(combinedPool, 2 + Math.floor(Math.random() * 2));
  return selected.join(" ");
}

function sampleRandomWords(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

exports.getDailyRecommendation = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(400).json({ error: "Missing user ID." });

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found." });
    }

    const today = new Date().toISOString().split("T")[0];

    if (
      user.daily_recommendation &&
      user.daily_recommendation_date &&
      user.daily_recommendation_date.toISOString().split("T")[0] === today
    ) {
      console.log("Returning cached daily song.");
      return res.json(user.daily_recommendation);
    }

    const token = await userModel.getValidAccessToken(userId);
    console.log("Spotify access token:", token);

    const query = buildSmartQuery();
    console.log("Built query:", query);

    const song = await searchSongs(query, token);
    console.log("Song from Spotify:", song);

    if (!song) {
      return res.status(500).json({ error: "No song found from Spotify." });
    }

    await userModel.updateDailyRecommendation(userId, today, song);

    await diaryModel.createDiaryEntry({
      userId,
      type: "daily",
      song,
      recommend_context: null,
      note: null
    });

    res.json(song);
  } catch (err) {
    console.error("Daily recommendation failed:", err.message);
    res.status(500).json({ error: "Daily recommendation failed." });
  }
};