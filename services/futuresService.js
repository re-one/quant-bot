const axios = require('axios');
const { computeMACD } = require('../indicators/macd');
const { computeKDJ } = require('../indicators/kdj');
const { computeRSI } = require('../indicators/rsi');
const { computeEMA } = require('../indicators/ema');
const { computeBOLL } = require('../indicators/boll');
const { HttpsProxyAgent } = require('https-proxy-agent');

const proxy = process.env.HTTP_PROXY;
const agent = proxy ? new HttpsProxyAgent(proxy) : null;
const BINANCE_FUTURES = 'https://fapi.binance.com/fapi/v1/klines';

async function fetchIndicators(symbol = 'BTCUSDT', interval = '5m', limit = 100) {
  const res = await axios.get(BINANCE_FUTURES, {
    params: { symbol, interval, limit },
    httpsAgent: agent,
  });

  const klines = res.data.map(k => ({
    time: k[0],
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
  }));

  const closes = klines.map(k => k.close);
  const macd = computeMACD(closes);
  const kdj = computeKDJ(klines);
  const rsi = computeRSI(closes);
  const ema7 = computeEMA(closes, 7);
  const ema30 = computeEMA(closes, 30);
  const boll = computeBOLL(closes);

  return {
    symbol,
    times: klines.map(k => k.time),
    closes,
    macd,
    kdj,
    rsi,
    ema: { ema7, ema30 },
    boll,
    signal: {
      macdCross:
        macd.macd.at(-2) < macd.signal.at(-2) && macd.macd.at(-1) > macd.signal.at(-1) ? "Buy" :
        macd.macd.at(-2) > macd.signal.at(-2) && macd.macd.at(-1) < macd.signal.at(-1) ? "Sell" : "",
      kdjJ: kdj.J.at(-1),
      rsi: rsi.at(-1)
    }
  };
}

module.exports = { fetchIndicators };
