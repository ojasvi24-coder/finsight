/**
 * Real math utilities. These are actual implementations, not placeholders.
 * Everything runs in the browser — no server required.
 */

/* ============================================================
   Box-Muller transform — generates a standard normal random variable.
   ============================================================ */
export function randn(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/* ============================================================
   Simple Exponential Smoothing + linear drift — a "poor man's ARIMA(0,1,1)".
   Good enough for cash-flow forecasting on a handful of historical months.
   Returns an array of {month, value, lower95, upper95} projections.
   ============================================================ */
export interface ForecastPoint {
  index: number;
  value: number;
  lower95: number;
  upper95: number;
}

export function forecastSeries(
  history: number[],
  horizon: number,
  alpha = 0.4
): ForecastPoint[] {
  if (history.length < 2) return [];

  // Exponential smoothing
  let level = history[0];
  const residuals: number[] = [];
  for (let i = 1; i < history.length; i++) {
    const predicted = level;
    const actual = history[i];
    residuals.push(actual - predicted);
    level = alpha * actual + (1 - alpha) * level;
  }

  // Linear trend = average step
  let trendSum = 0;
  for (let i = 1; i < history.length; i++) {
    trendSum += history[i] - history[i - 1];
  }
  const trend = trendSum / (history.length - 1);

  // Variance of residuals for confidence interval
  const meanRes =
    residuals.reduce((a, b) => a + b, 0) / Math.max(1, residuals.length);
  const varRes =
    residuals.reduce((a, b) => a + Math.pow(b - meanRes, 2), 0) /
    Math.max(1, residuals.length);
  const sigma = Math.sqrt(Math.max(varRes, 1));

  const out: ForecastPoint[] = [];
  for (let h = 1; h <= horizon; h++) {
    const value = level + trend * h;
    // 95% CI widens with sqrt(horizon) — classic forecast uncertainty
    const bandwidth = 1.96 * sigma * Math.sqrt(h);
    out.push({
      index: history.length + h - 1,
      value,
      lower95: value - bandwidth,
      upper95: value + bandwidth,
    });
  }
  return out;
}

/* ============================================================
   Monte Carlo retirement simulation.
   Runs N trials of geometric Brownian motion on the portfolio.
   Returns percentile paths + probability the ending balance >= goal.
   ============================================================ */
export interface MonteCarloResult {
  paths: {
    year: number;
    p10: number;
    p50: number;
    p90: number;
  }[];
  successProbability: number; // 0..1
  medianEnding: number;
  trials: number;
}

export function monteCarloRetirement({
  initial,
  monthlyContribution,
  annualReturn,
  annualVolatility,
  years,
  goal,
  trials = 10000,
}: {
  initial: number;
  monthlyContribution: number;
  annualReturn: number; // e.g. 0.08
  annualVolatility: number; // e.g. 0.15
  years: number;
  goal: number;
  trials?: number;
}): MonteCarloResult {
  const months = years * 12;
  // Convert annual → monthly
  const muM = annualReturn / 12;
  const sigmaM = annualVolatility / Math.sqrt(12);

  // Store only end-of-year snapshots to keep memory tame
  const yearSnapshots: number[][] = Array.from({ length: years + 1 }, () => []);

  let successes = 0;
  const endingBalances: number[] = new Array(trials);

  for (let t = 0; t < trials; t++) {
    let balance = initial;
    yearSnapshots[0].push(balance);
    for (let m = 1; m <= months; m++) {
      // Geometric Brownian Motion step on monthly basis
      const z = randn();
      balance = balance * (1 + muM + sigmaM * z) + monthlyContribution;
      if (m % 12 === 0) {
        yearSnapshots[m / 12].push(balance);
      }
    }
    endingBalances[t] = balance;
    if (balance >= goal) successes++;
  }

  // Compute percentile paths
  const paths = yearSnapshots.map((snap, year) => {
    const sorted = [...snap].sort((a, b) => a - b);
    return {
      year,
      p10: sorted[Math.floor(sorted.length * 0.1)] || 0,
      p50: sorted[Math.floor(sorted.length * 0.5)] || 0,
      p90: sorted[Math.floor(sorted.length * 0.9)] || 0,
    };
  });

  const sortedEndings = [...endingBalances].sort((a, b) => a - b);
  const medianEnding = sortedEndings[Math.floor(sortedEndings.length / 2)];

  return {
    paths,
    successProbability: successes / trials,
    medianEnding,
    trials,
  };
}

/* ============================================================
   Standard deviation helpers for anomaly detection on spending categories.
   Used by the Webhook Guardrails feature.
   ============================================================ */
export function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function stdDev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  const sq = xs.reduce((a, b) => a + Math.pow(b - m, 2), 0);
  return Math.sqrt(sq / (xs.length - 1));
}
