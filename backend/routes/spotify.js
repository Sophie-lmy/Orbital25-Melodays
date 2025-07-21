const express = require("express");
const router = express.Router();
const spotifyController = require("../controllers/spotifyController");
const authenticate = require("../middleware/authMiddleware");

router.get("/authorize", authenticate, spotifyController.spotifyAuthorize);
router.get("/callback", authenticate, spotifyController.spotifyCallback);
router.get("/refresh-token", authenticate, spotifyController.refreshToken);

module.exports = router;