const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const recommendRoutes = require("./routes/recommend");
const dailyRoutes = require("./routes/daily");
const spotifyProxy = require('./routes/spotifyProxy');
app.use('/proxy', spotifyProxy); 

app.use("/auth", authRoutes);
app.use("/recommend", recommendRoutes);
app.use("/daily", dailyRoutes);

db.query("SELECT NOW()")
  .then(res => console.log("Database connected at", res.rows[0].now))
  .catch(err => console.error("Database connection error:", err));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});