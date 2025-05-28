const axios = require('axios');
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(message) {
  if (!token || !chatId) return;

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message
    });
  } catch (err) {
    console.error("发送 Telegram 消息失败：", err.message);
  }
}

module.exports = { sendTelegramMessage };
