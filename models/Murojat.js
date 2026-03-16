const mongoose = require('mongoose');

const murojatSchema = new mongoose.Schema({
  telegramId: { type: String },
  name: { type: String },
  phone: { type: String },
  contacted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Murojat', murojatSchema);