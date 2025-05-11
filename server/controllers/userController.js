const bcrypt = require('bcrypt');
const User = require('../models/user');
// POST /register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "Username already taken." });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    const authToken = Math.random().toString(36).substring(2);

    const user = new User({ username, email, password: hash, authToken });
    await user.save();
    res.json({ username: user.username, authToken: user.authToken });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

// POST /login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    // Send safe user data
    res.json({
      username: user.username,
      authToken: user.authToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error." });
  }
};
