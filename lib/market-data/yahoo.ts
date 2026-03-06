import YahooFinance from 'yahoo-finance2';
import type { IMarketDataProvider } from './types';
import type { OHLCVBar, Quote, Timeframe } from '@/types';

const yf = new YahooFinance();

const INTERVAL_MAP: Record<Timeframe, '1d' | '1wk' | '1mo'> = {
  D: '1d',
  W: '1wk',
  M: '1mo',
};

const LOOKBACK_DAYS: Record<Timeframe, number> = {
  D: 365 * 5 + 90,
  W: 365 * 3,
  M: 365 * 10,
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export const yahooProvider: IMarketDataProvider = {
  async getOHLCV(symbol: string, timeframe: Timeframe): Promise<OHLCVBar[]> {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - LOOKBACK_DAYS[timeframe]);

    const result = await yf.chart(symbol, {
      period1: start,
      period2: end,
      interval: INTERVAL_MAP[timeframe],
      return: 'array',
    });

    if (!result?.quotes) return [];

    return result.quotes
      .filter(
        (q) =>
          q.open != null &&
          q.high != null &&
          q.low != null &&
          q.close != null &&
          q.volume != null,
      )
      .map((q) => ({
        time: toDateString(q.date),
        open: q.open!,
        high: q.high!,
        low: q.low!,
        close: q.close!,
        volume: q.volume!,
      }));
  },

  async getQuote(symbol: string): Promise<Quote> {
    const result = await yf.quote(symbol);

    const price = result.regularMarketPrice ?? 0;
    const change = result.regularMarketChange ?? 0;
    const changePercent = result.regularMarketChangePercent ?? 0;
    const vol = result.regularMarketVolume ?? null;
    const avgVol = result.averageDailyVolume3Month ?? null;
    const relVolume = vol && avgVol && avgVol > 0 ? vol / avgVol : null;

    return { symbol, price, change, changePercent, relVolume };
  },
};
