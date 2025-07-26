const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/hash");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "This email is already registered." });
    }
    const hashed = await hashPassword(password);
    const newUser = await userModel.createUser(username, email, hashed);
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        spotifyConnected: !!newUser.spotify_access_token
      },
      token
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        spotifyConnected: !!user.spotify_access_token
      },
      token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed." });
  }
};

exports.saveProfile = async (req, res) => {
  const userId = req.user.id;
  const { username } = req.body;
  try {
    await userModel.updateUsername(userId, username);
    res.status(200).json({ message: "Profile updated successfully." });
  } catch (err) {
    console.error("Save profile error:", err);
    res.status(500).json({ message: "Failed to update profile." });
  }
};

exports.getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      spotifyConnected: !!user.spotify_access_token
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
};