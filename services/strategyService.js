// 文件：services/strategyService.js

const { fetchIndicators } = require('./futuresService');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../data/strategy.log');

function logData(symbol, data) {
  const logLine = `[${new Date().toISOString()}] ${symbol} 数据打印 -> ${JSON.stringify(data)}\n`;
  fs.appendFileSync(LOG_FILE, logLine, 'utf-8');
  console.log(logLine.trim());
}

async function runStrategyFor(symbol) {
  try {
    const data = await fetchIndicators(symbol);
if (!data || !data.indicators) {
  console.error(`❌ 自动运行 ${symbol} 策略失败: 指标数据为空`);
  return { error: '数据缺失' };
}

    
    logData(symbol, data.indicators);
    return { success: true, indicators: data.indicators };
  } catch (err) {
    console.error(`[ERROR] 获取指标失败：`, err);
    return { error: '指标获取失败', details: err.message };
  }
}

module.exports = { runStrategyFor };
