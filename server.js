require('dotenv').config();
const express = require('express');
const indicatorRoute = require('./routes/indicatorRoute');
const accountRoute = require('./routes/accountRoute'); // ✅ 新增
const orderRoute = require('./routes/orderRoute');
const strategyRoute = require('./routes/strategyRoute');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use('/api', indicatorRoute);
app.use('/api', accountRoute); // ✅ 注册账户余额接口
app.use('/api', orderRoute); // 加在其它路由之后
app.use('/api', strategyRoute); // 注册自动策略路由

app.listen(port, () => {
  console.log(`📈 服务器运行中：http://localhost:${port}`);
});
