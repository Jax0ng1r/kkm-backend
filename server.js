const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. CORS sozlamasini to'g'irlash
app.use(cors({
  origin: [
    'https://sizning-saytingiz.netlify.app', // BU YERGA Netlify manzilingizni yozing
    'http://localhost:5173',                  // Lokal admin panel uchun
    'http://localhost:5174'
  ],
  credentials: true
}));

app.use(express.json());

// Railway uchun asosiy yo'l (Cannot GET /api xatosi chiqmasligi uchun)
app.get('/', (req, res) => {
  res.send('KKM Backend serveri Railway-da muvaffaqiyatli ishlayapti! 🚀');
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/admin', require('./routes/admin'));

// 2. MongoDB ulanish
// Railway Variables-dagi MONGODB_URI orqali ulanadi
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB ulandi'))
  .catch(err => console.log('❌ MongoDB xato:', err));

// 3. Railway uchun PORT sozlamasi (Juda muhim!)
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server ${PORT} portda ishlamoqda`);
});