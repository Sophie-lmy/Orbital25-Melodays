const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const recommendRoutes = require("./routes/recommend");
const db = require("./db");

const port = 3000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/recommend", recommendRoutes);

db.query("SELECT NOW()")
  .then(res => console.log("Database connected at", res.rows[0].now))
  .catch(err => console.error("Database connection error:", err));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});