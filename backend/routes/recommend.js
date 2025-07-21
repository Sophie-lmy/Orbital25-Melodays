const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');
const authenticate = require('../middleware/authMiddleware');

router.post('/mood', authenticate, recommendController.recommendByMood);
router.post('/activity', authenticate, recommendController.recommendByActivity);

module.exports = router;