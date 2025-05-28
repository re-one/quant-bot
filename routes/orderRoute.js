const express = require('express');
const { simulateOrder } = require('../services/simulateOrderService');
const router = express.Router();

router.post('/simulate-order', express.json(), (req, res) => {
  const { symbol, side, type, quantity } = req.body;

  if (!symbol || !side || !type || !quantity) {
    return res.status(400).json({ error: '参数不完整' });
  }

  try {
    const result = simulateOrder({ symbol, side, type, quantity });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: '模拟下单失败', details: err.message });
  }
});

module.exports = router;
