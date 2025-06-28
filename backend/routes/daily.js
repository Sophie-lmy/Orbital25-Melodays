const express = require("express");
const router = express.Router();
const dailyController = require("../controllers/dailyController");

router.get("/", dailyController.getDailyRecommendation);

module.exports = router;