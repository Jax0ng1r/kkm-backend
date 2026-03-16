const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  icon: { type: String, default: '📚' },
  title: { type: String, required: true },
  desc: { type: String },
  duration: { type: String },
  level: { type: String },
  color: { type: String, default: '#7C6AF7' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);