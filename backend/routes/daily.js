const express = require('express');
const router = express.Router();
const { getDailyRecommendation } = require('../controllers/dailyController');

router.post('/', getDailyRecommendation);

module.exports = router;