const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const axios = require('axios');
const API = 'http://localhost:5000/api';

bot.onText(/\/start/, (msg) => {
  const user = msg.from;
  
  // Foydalanuvchini saqlash
  axios.post(`${API}/users/save`, {
    telegramId: String(user.id),
    firstName: user.first_name,
    lastName: user.last_name || '',
    username: user.username || ''
  }).catch(err => console.log(err.message));

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
    bot.sendMessage(msg.chat.id, '✅ Telefon raqam saqlandi!', {
      reply_markup: {
        remove_keyboard: true
      }
    });
  }).catch(err => console.log(err.message));
});

console.log('🤖 Bot ishlamoqda...');
