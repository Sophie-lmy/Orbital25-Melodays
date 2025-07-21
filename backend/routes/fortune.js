const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { getMusicFortune } = require('../controllers/fortuneController');

router.post('/', authenticate, getMusicFortune);

module.exports = router;