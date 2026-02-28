import type { IndicatorSeries } from '@/types';

function sma(values: number[], period: number): (number | null)[] {
  return values.map((_, i) => {
    if (i < period - 1) return null;
    const slice = values.slice(i - period + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
}

function ema(values: number[], period: number): (number | null)[] {
  const k = 2 / (period + 1);
  const result: (number | null)[] = new Array(values.length).fill(null);
  if (values.length < period) return result;

  const startIdx = period - 1;
  result[startIdx] = values.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = startIdx + 1; i < values.length; i++) {
    result[i] = values[i] * k + (result[i - 1] as number) * (1 - k);
  }

  return result;
}

function rsi(values: number[], period = 14): (number | null)[] {
  const result: (number | null)[] = new Array(values.length).fill(null);
  if (values.length < period + 1) return result;

  const deltas = values.slice(1).map((v, i) => v - values[i]);

  let avgGain =
    deltas.slice(0, period).filter((d) => d > 0).reduce((a, b) => a + b, 0) / period;
  let avgLoss =
    deltas.slice(0, period).filter((d) => d < 0).reduce((a, b) => a + Math.abs(b), 0) /
    period;

  result[period] = 100 - 100 / (1 + avgGain / (avgLoss || 0.0001));

  for (let i = period; i < deltas.length; i++) {
    const gain = Math.max(deltas[i], 0);
    const loss = Math.abs(Math.min(deltas[i], 0));
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    result[i + 1] = 100 - 100 / (1 + avgGain / (avgLoss || 0.0001));
  }

  return result;
}

function macd(
  values: number[],
): { macd: number | null; signal: number | null; histogram: number | null }[] {
  const ema12 = ema(values, 12);
  const ema26 = ema(values, 26);

  const macdLine: (number | null)[] = values.map((_, i) => {
    if (ema12[i] === null || ema26[i] === null) return null;
    return (ema12[i] as number) - (ema26[i] as number);
  });

  // Signal = 9-period EMA of MACD line
  const firstValidIdx = macdLine.findIndex((v) => v !== null);
  const signal: (number | null)[] = new Array(values.length).fill(null);

  if (firstValidIdx !== -1) {
    const validMacdValues = macdLine.slice(firstValidIdx) as number[];
    // Replace nulls with 0 won't work — we need actual values
    // Just take the non-null trailing slice
    const signalEma = ema(validMacdValues, 9);
    signalEma.forEach((v, i) => {
      signal[firstValidIdx + i] = v;
    });
  }

  return values.map((_, i) => ({
    macd: macdLine[i],
    signal: signal[i],
    histogram:
      macdLine[i] !== null && signal[i] !== null
        ? (macdLine[i] as number) - (signal[i] as number)
        : null,
  }));
}

export function computeIndicators(closes: number[]): IndicatorSeries {
  return {
    sma21: sma(closes, 21),
    sma50: sma(closes, 50),
    sma200: sma(closes, 200),
    ema8: ema(closes, 8),
    ema21: ema(closes, 21),
    rsi14: rsi(closes, 14),
    macd: macd(closes),
  };
}
