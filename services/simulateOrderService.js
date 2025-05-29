// # 返回模拟订单结果
function simulateOrder({ symbol, side, type, quantity }) {
  const filledPrice = parseFloat((Math.random() * (70000 - 60000) + 60000).toFixed(2)); // ✅ 强制数字
  return {
    success: true,
    simulated: true,
    message: `模拟${side} ${symbol} ${quantity}张 ${type}单`,
    time: new Date().toISOString(),
    order: {
      id: Math.floor(Math.random() * 1000000),
      symbol,
      side,
      type,
      quantity,
      status: 'FILLED',
      filledPrice, // ✅ 保证一定有值
    }
  };
}

module.exports = { simulateOrder };
