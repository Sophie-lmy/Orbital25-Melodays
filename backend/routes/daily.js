const express = require('express');
const router = express.Router();
const { getDailyRecommendation } = require('../controllers/dailyController');

router.get('/', getDailyRecommendation);

module.exports = router;