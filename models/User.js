const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String },
  phone: { type: String },
  contactName: { type: String },
  contactPhone: { type: String },
  enrolledCourses: [{ type: String }],
  contacted: { type: Boolean, default: false },
  contactedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);