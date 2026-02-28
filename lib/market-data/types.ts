import type { OHLCVBar, Quote, Timeframe } from '@/types';

export interface IMarketDataProvider {
  getOHLCV(symbol: string, timeframe: Timeframe): Promise<OHLCVBar[]>;
  getQuote(symbol: string): Promise<Quote>;
}
