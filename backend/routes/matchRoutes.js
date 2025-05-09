const express = require("express");
const router = express.Router();
const Profile = require('../models/Profile');

const User = require("../models/User");

// POST /api/match
router.post("/profiles", async (req, res) => {
  const { userId, matchId } = req.body;

  try {
    const user = await User.findById(userId);
    const match = await User.findById(matchId);

    if (!user || !match) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.matches.includes(matchId)) {
      return res.status(400).json({ message: "Already matched!" });
    }

    user.matches.push(matchId);
    await user.save();

    match.matches.push(userId);
    await match.save();

    res.status(200).json({ message: "Match successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;
