const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Murojat = require('../models/Murojat');

// Foydalanuvchini saqlash yoki yangilash
router.post('/save', (req, res) => {
  const { telegramId, firstName, lastName, username, phone } = req.body;
  User.findOne({ telegramId })
    .then(user => {
      if (user) {
        user.firstName = firstName;
        user.lastName = lastName;
        user.username = username;
        if (phone) user.phone = phone;
        return user.save();
      }
      return User.create({ telegramId, firstName, lastName, username, phone });
    })
    .then(user => res.json({ success: true, user }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Barcha foydalanuvchilar
router.get('/all', (req, res) => {
  User.find().sort({ createdAt: -1 })
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Foydalanuvchini tekshirish
router.get('/check/:telegramId', (req, res) => {
  User.findOne({ telegramId: req.params.telegramId })
    .then(user => {
      if (user) return res.json({ exists: true, user });
      return res.json({ exists: false });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Kursga yozilish
router.post('/enroll', (req, res) => {
  const { telegramId, courseTitle } = req.body;
  User.findOne({ telegramId })
    .then(user => {
      if (!user) throw new Error('Foydalanuvchi topilmadi');
      if (!user.enrolledCourses.includes(courseTitle)) {
        user.enrolledCourses.push(courseTitle);
      }
      return user.save();
    })
    .then(user => res.json({ success: true, user }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Murojaat qo'shish — Murojatlar collectionga alohida saqlash
router.post('/contact', (req, res) => {
  const { telegramId, name, phone } = req.body;

  User.findOne({ telegramId })
    .then(user => {
      if (user) {
        user.contactName = name;
        user.contactPhone = phone;
        user.contactedAt = new Date();
        user.contacted = false;
        return user.save();
      }
    })
    .catch(() => {});

  Murojat.create({ telegramId, name, phone })
    .then(murojat => res.json({ success: true, murojat }))
    .catch(err => res.status(500).json({ error: err.message }));
});
// Barcha murojatlarni olish
router.get('/murojatlar', (req, res) => {
  Murojat.find().sort({ createdAt: -1 })
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Murojat holatini o'zgartirish
router.post('/murojat-contacted', (req, res) => {
  const { murojatId, contacted } = req.body;
  Murojat.findByIdAndUpdate(murojatId, { contacted }, { new: true })
    .then(data => res.json({ success: true, data }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Gaplashilgan holatini o'zgartirish (User uchun — eski)
router.post('/contacted', (req, res) => {
  const { userId, contacted } = req.body;
  User.findByIdAndUpdate(userId, { contacted }, { new: true })
    .then(user => res.json({ success: true, user }))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;