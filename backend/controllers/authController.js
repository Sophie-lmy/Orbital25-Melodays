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
    await userModel.createUser(username, email, hashed);
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
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
    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed." });
  }
};