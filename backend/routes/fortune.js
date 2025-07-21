const express = require('express');
const router = express.Router();
const { getMusicFortune } = require('../controllers/fortuneController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, getMusicFortune);

module.exports = router;