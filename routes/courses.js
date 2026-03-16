const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Barcha kurslar
router.get('/all', (req, res) => {
  Course.find({ isActive: true }).sort({ createdAt: -1 })
    .then(courses => res.json(courses))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Kurs qo'shish
router.post('/', (req, res) => {
  Course.create(req.body)
    .then(course => res.json({ success: true, course }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Kurs o'chirish
router.delete('/:id', (req, res) => {
  Course.findByIdAndDelete(req.params.id)
    .then(() => res.json({ success: true }))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;