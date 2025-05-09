const express = require('express');
const router = express.Router();
const multer = require('multer');
const Profile = require('./models/Profile'); // 👈 Import Profile model
const { authenticateToken } = require('../middleware/authMiddleware'); // 👈 Protect route

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Images stored in uploads/
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST endpoint to save a profile with an image and userId
router.post('/profiles', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    const { name, email, contact, skill, experience, category } = req.body;
    const photoPath = req.file ? req.file.path : null;
    console.log("Request ",req)
    console.log("Logged In local storage: ",userId)
    const userId = req.user.id; // 👈 Get user ID from authenticated token

    const profile = new Profile({
      _id: userId,  // 👈 FORCE profile._id to be same as User ID
      name,
      email,
      contact,
      skill,
      experience,
      category,
      photo: photoPath,
    });

    await profile.save(); // 👈 Save into MongoDB

    console.log('Profile created for user:', userId);
    res.status(201).json({ message: 'Profile created successfully', profile });

  } catch (error) {
    console.error('Error creating profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

    

module.exports = router;
