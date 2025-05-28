const axios = require('axios');
const crypto = require('crypto');
const { HttpsProxyAgent } = require('https-proxy-agent');

const proxy = process.env.HTTP_PROXY;
const agent = proxy ? new HttpsProxyAgent(proxy) : null;

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_SECRET;

function sign(query) {
  return crypto.createHmac('sha256', API_SECRET)
    .update(query)
    .digest('hex');
}

async function fetchAccountInfo() {
  const baseURL = 'https://api.binance.com';
  const endpoint = '/api/v3/account';
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = sign(query);
  const finalQuery = `${query}&signature=${signature}`;

  try {
    const res = await axios.get(`${baseURL}${endpoint}?${finalQuery}`, {
      headers: { 'X-MBX-APIKEY': API_KEY },
      httpsAgent: agent,
    });

    const result = res.data.balances.filter(b =>
      ['USDT', 'BTC', 'ETH', 'BNB'].includes(b.asset) &&
      (parseFloat(b.free) > 0 || parseFloat(b.locked) > 0)
    );

    return result;
  } catch (err) {
    console.error("获取账户失败：", err.message);
    throw err;
  }
}

module.exports = { fetchAccountInfo };
