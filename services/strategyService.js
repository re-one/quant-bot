const fs = require('fs');
const path = require('path');
const { fetchIndicators } = require('./futuresService');
const { simulateOrder } = require('./simulateOrderService');
const { sendTelegramMessage } = require('./telegramService');

const LOG_PATH = path.resolve(__dirname, '../data/strategy.log');
const LOG_DIR = path.dirname(LOG_PATH);

// 确保日志目录存在
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function logSignal(symbol, message) {
  const logEntry = `[${new Date().toISOString()}] ${symbol} => ${message}`;
  console.log(logEntry);
  fs.appendFileSync(LOG_PATH, logEntry + '\n', 'utf-8');
}

async function runStrategyFor(symbol = 'BTCUSDT') {
  const indicator = await fetchIndicators(symbol);

  // 确保 KDJ 和 J 数组存在且有数据
  if (!indicator || !indicator.kdj || !Array.isArray(indicator.kdj.J)) {
    const msg = `🚫 错误：未获取到 ${symbol} 的 KDJ.J 数据`;
    logSignal(symbol, msg);
    return { symbol, error: msg };
  }

  const jRaw = indicator.kdj.J.at(-1);

  // 防止 null 或 undefined
  if (jRaw === undefined || jRaw === null) {
    const msg = `🚫 错误：KDJ J 最后一个值不存在`;
    logSignal(symbol, msg);
    return { symbol, error: msg };
  }

  const j = parseFloat(jRaw);
  if (isNaN(j)) {
    const msg = `🚫 错误：KDJ J 无法转换为数字，原始值为：${jRaw}`;
    logSignal(symbol, msg);
    return { symbol, error: msg };
  }

  const signals = [];

  if (j >= 100) {
    const order = simulateOrder({ symbol, side: 'SELL', type: 'MARKET', quantity: 0.01 });
    signals.push({ action: 'SELL', reason: 'KDJ J ≥ 100 触发卖出', order });
    logSignal(symbol, `❌ SELL 执行模拟下单 (KDJ 超买 J=${j.toFixed(2)})`);
    await sendTelegramMessage(`📉 [策略] ${symbol} - KDJ超买 (J=${j.toFixed(2)})，模拟卖出 ${order.quantity} 成交价 ~${order.filledPrice.toFixed(2)}`);
  } else if (j <= 0) {
    const order = simulateOrder({ symbol, side: 'BUY', type: 'MARKET', quantity: 0.01 });
    signals.push({ action: 'BUY', reason: 'KDJ J ≤ 0 触发买入', order });
    logSignal(symbol, `✅ BUY 执行模拟下单 (KDJ 超卖 J=${j.toFixed(2)})`);
    await sendTelegramMessage(`📈 [策略] ${symbol} - KDJ超卖 (J=${j.toFixed(2)})，模拟买入 ${order.quantity} 成交价 ~${order.filledPrice.toFixed(2)}`);
  } else {
    logSignal(symbol, `🟡 无操作 - KDJ J=${j.toFixed(2)} 不在区间`);
  }

  return { symbol, J: j, signals };
}

module.exports = { runStrategyFor };
