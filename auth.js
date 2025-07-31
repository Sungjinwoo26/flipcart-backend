const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // ✅ Corrected spelling from "bcript" to "bcryptjs"
const router = express.Router(); // ✅ Router is case-sensitive, use Router() not router()

const User = mongoose.model(
  "User",
  new mongoose.Schema({ email: String, password: String }) // ✅ Fixed spelling of 'password'
);

// ✅ SIGNUP route
router.post("/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body; // ✅ spelling fixed
    const existingUser = await User.findOne({ email }); // ✅ 'email' was spelled 'enail'

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // ✅ Correct hash usage
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" }); // ✅ "1hr" should be "1h"
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ LOGIN route
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, "secret", {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ JWT Middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, "secret", (err, user) => {
      // ✅ spelling fixed: 'verfiy' -> 'verify'
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports = { router, authenticateJWT }; // ✅ 'module.export' should be 'module.exports'
