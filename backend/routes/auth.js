const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/save-profile", authController.saveProfile);
router.get("/get-profile", authController.getProfile);

module.exports = router;