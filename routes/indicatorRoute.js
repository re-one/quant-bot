// indicatorRoute.js     # /api/indicator/:symbol → 获取K线和指标

const express = require('express');
const { fetchIndicators } = require('../services/futuresService');
const router = express.Router();

router.get('/indicator/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  try {
    const data = await fetchIndicators(symbol);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '获取指标失败', details: err.message });
  }
});

module.exports = router;
