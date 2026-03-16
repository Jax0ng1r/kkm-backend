const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Railway-da BOT_TOKEN variables bo'limidan olinadi
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// MUHIM: Localhost emas, Railway-dagi backend manzilingizni yozing
const API = 'https://kkm-backend-production.up.railway.app/api';

bot.onText(/\/start/, (msg) => {
  const user = msg.from;
  
  // Foydalanuvchini saqlash
  axios.post(`${API}/users/save`, {
    telegramId: String(user.id),
    firstName: user.first_name,
    lastName: user.last_name || '',
    username: user.username || ''
  })
  .then(() => console.log(`👤 Foydalanuvchi saqlandi: ${user.first_name}`))
  .catch(err => console.error('API Error (save):', err.message));

  bot.sendMessage(msg.chat.id, 
    `Salom ${user.first_name}! 👋\n\nKasbiy Ko'nikmalar Markaziga xush kelibsiz!\n\nTelefon raqamingizni ulang:`,
    {
      reply_markup: {
        keyboard: [[
          { text: '📱 Telefon raqamni ulash', request_contact: true }
        ]],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    }
  );
});

// Telefon raqam kelganda
bot.on('contact', (msg) => {
  const phone = msg.contact.phone_number;
  const telegramId = String(msg.from.id);

  axios.post(`${API}/users/save`, {
    telegramId,
    firstName: msg.from.first_name,
    lastName: msg.from.last_name || '',
    username: msg.from.username || '',
    phone
  }).then(() => {
    bot.sendMessage(msg.chat.id, '✅ Rahmat! Telefon raqamingiz muvaffaqiyatli saqlandi.', {
      reply_markup: {
        remove_keyboard: true
      }
    });
  }).catch(err => console.error('API Error (contact):', err.message));
});

console.log('🤖 Bot Railway-da ishga tushdi...');