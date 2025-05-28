function computeEMA(data, period) {
  const k = 2 / (period + 1);
  return data.reduce((acc, val, i) => {
    if (i === 0) acc.push(val);
    else acc.push(val * k + acc[i - 1] * (1 - k));
    return acc;
  }, []);
}

function computeMACD(closes) {
  const ema12 = computeEMA(closes, 12);
  const ema26 = computeEMA(closes, 26);
  const macd = closes.map((_, i) => ema12[i] - ema26[i]);
  const signal = computeEMA(macd, 9);
  const hist = macd.map((v, i) => v - signal[i]);
  return { macd, signal, hist };
}

module.exports = { computeMACD };
