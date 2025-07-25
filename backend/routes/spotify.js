const express = require("express");
const router = express.Router();
const spotifyController = require("../controllers/spotifyController");

router.get("/authorize", spotifyController.spotifyAuthorize);
router.get("/callback", spotifyController.spotifyCallback);

module.exports = router;