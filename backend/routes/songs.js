const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const authenticate = require('../middleware/authMiddleware');

router.post('/like', authenticate, songController.likeSong);

router.get('/liked', authenticate, songController.getLikedSongs);

router.delete('/unlike/:spotify_track_id', authenticate, songController.unlikeSong);

module.exports = router;