// test-tg.js
require('dotenv').config();
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const proxy = 'http://127.0.0.1:7890';
const agent = new HttpsProxyAgent(proxy);

// ✅ 从 .env 中读取 token 和 chat_id
const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.error('❌ 请确认 TELEGRAM_TOKEN 和 TELEGRAM_CHAT_ID 已配置在 .env 文件中');
  process.exit(1);
}

(async () => {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        chat_id: chatId,
        text: '✅ Telegram 推送测试成功 - 来自 Node.js'
      },
      {
        httpsAgent: agent,
        timeout: 10000
      }
    );

    console.log('✅ 推送成功:', response.data);
  } catch (err) {
    console.error('❌ 推送失败:', err.response ? err.response.data : err.message);
  }
})();
