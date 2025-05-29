// api/account → 读取账户余额

const express = require('express');
const { fetchAccountInfo } = require('../services/accountService');
const router = express.Router();

router.get('/account', async (req, res) => {
  try {
    const data = await fetchAccountInfo();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '无法获取账户信息' });
  }
});

module.exports = router;
