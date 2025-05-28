function simulateOrder({ symbol, side, type, quantity }) {
  const time = new Date().toISOString();
  return {
    success: true,
    simulated: true,
    message: `模拟${side} ${symbol} ${quantity}张 ${type}单`,
    time,
    order: {
      id: Math.floor(Math.random() * 1000000),
      symbol,
      side,
      type,
      quantity,
      status: 'FILLED',
      filledPrice: Math.random() * (70000 - 60000) + 60000
    }
  };
}

module.exports = { simulateOrder };
