
// api/run-strategy/:symbol → 执行策略
const express = require('express');
const { runStrategyFor } = require('../services/strategyService');
const router = express.Router();

router.get('/run-strategy/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  try {
    const result = await runStrategyFor(symbol);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: '策略运行失败', details: err.message });
  }
});

module.exports = router;
