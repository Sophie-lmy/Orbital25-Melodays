const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/authorize', authenticateToken, spotifyController.spotifyAuthorize);
router.get('/callback', spotifyController.spotifyCallback);

module.exports = router;