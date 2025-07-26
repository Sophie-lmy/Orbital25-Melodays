const express = require("express");
const cors = require("cors");
const db = require("./db");
const initDatabase = require("./db/init");

const authRoutes = require("./routes/auth");
const recommendRoutes = require("./routes/recommend");
const dailyRoutes = require("./routes/daily");
const diaryRoutes = require("./routes/diary");
const songRoutes = require("./routes/songs");
const fortuneRoutes = require("./routes/fortune");
const spotifyRoutes = require("./routes/spotify");

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  'https://melodays-frontend.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/recommend", recommendRoutes);
app.use("/daily", dailyRoutes);
app.use("/diary", diaryRoutes);
app.use("/songs", songRoutes);
app.use("/fortune", fortuneRoutes);
app.use("/spotify", spotifyRoutes);

initDatabase();

db.query("SELECT NOW()")
  .then(res => console.log("Database connected at", res.rows[0].now))
  .catch(err => console.error("Database connection error:", err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});