const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');

// Admin login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-token-2024' });
  } else {
    res.status(401).json({ success: false, error: 'Parol noto\'g\'ri' });
  }
});

// Statistika
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    
    res.json({ totalUsers, totalCourses, recentUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;