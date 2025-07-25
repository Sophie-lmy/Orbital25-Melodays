const express = require('express');
const router = express.Router();
const { getDailyRecommendation } = require('../controllers/dailyController');
const authenticate = require('../middleware/authMiddleware');

router.get('/', authenticate, getDailyRecommendation);

module.exports = router;