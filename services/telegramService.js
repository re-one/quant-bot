//# 推送消息到 Telegram
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const proxy = process.env.HTTP_PROXY; // 如果你用代理

async function sendTelegramMessage(message) {
  if (!token || !chatId) {
    console.error('❌ 缺少 Telegram token 或 chat_id');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: message,
    };
    const config = proxy ? { httpsAgent: new HttpsProxyAgent(proxy) } : {};
    const res = await axios.post(url, payload, config);
    console.log('📬 Telegram 推送成功:', res.data);
  } catch (err) {
    console.error('❌ Telegram 推送失败:', err.message);
  }
}

module.exports = { sendTelegramMessage };
