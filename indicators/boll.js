function computeBOLL(closes, period = 20) {
  const middle = [];
  const upper = [];
  const lower = [];

  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      middle.push(null);
      upper.push(null);
      lower.push(null);
      continue;
    }

    const window = closes.slice(i - period + 1, i + 1);
    const avg = window.reduce((a, b) => a + b, 0) / period;
    const std = Math.sqrt(window.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / period);

    middle.push(avg);
    upper.push(avg + 2 * std);
    lower.push(avg - 2 * std);
  }

  return { middle, upper, lower };
}

module.exports = { computeBOLL };
