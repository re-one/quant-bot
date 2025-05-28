function computeKDJ(klines, n = 9) {
  const K = [], D = [], J = [];
  for (let i = 0; i < klines.length; i++) {
    const slice = klines.slice(Math.max(0, i - n + 1), i + 1);
    const highs = slice.map(k => k.high);
    const lows = slice.map(k => k.low);
    const close = klines[i].close;
    const rsv = (Math.max(...highs) - Math.min(...lows)) === 0 ? 0 :
      ((close - Math.min(...lows)) / (Math.max(...highs) - Math.min(...lows))) * 100;
    if (i === 0) {
      K.push(50); D.push(50);
    } else {
      K.push(K[i - 1] * 2 / 3 + rsv / 3);
      D.push(D[i - 1] * 2 / 3 + K[i] / 3);
    }
    J.push(3 * K[i] - 2 * D[i]);
  }
  return { K, D, J };
}

module.exports = { computeKDJ };
