function computeEMA(data, period) {
  const k = 2 / (period + 1);
  return data.reduce((acc, val, i) => {
    if (i === 0) acc.push(val);
    else acc.push(val * k + acc[i - 1] * (1 - k));
    return acc;
  }, []);
}

module.exports = { computeEMA };
