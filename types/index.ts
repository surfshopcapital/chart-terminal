export type Timeframe = 'D' | 'W' | 'M';

export type TickerType = 'equity' | 'etf' | 'index' | 'fx' | 'commodity' | 'rate';

export type TickerCategory =
  | 'fx'
  | 'global_index'
  | 'rate'
  | 'commodity'
  | 'us_sector'
  | 'sector_leader'
  | 'thematic';

export interface Ticker {
  id: string;
  symbol: string;
  name: string;
  type: string;
  category: string;
  description?: string | null;
  isActive: boolean;
}

export interface OHLCVBar {
  time: string; // 'YYYY-MM-DD'
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  relVolume?: number | null;
}

export interface NoteData {
  id: string;
  tickerId: string;
  content: string;
  updatedAt: string;
}

export interface RatingData {
  id: string;
  tickerId: string;
  date: string;
  rating: number;
}

export interface SessionData {
  id: string;
  date: string;
  startedAt: string;
  endedAt?: string | null;
  durationSecs: number;
  completionPct: number;
}

export interface IndicatorSeries {
  sma21: (number | null)[];
  sma50: (number | null)[];
  sma200: (number | null)[];
  ema8: (number | null)[];
  ema21: (number | null)[];
  rsi14: (number | null)[];
  macd: { macd: number | null; signal: number | null; histogram: number | null }[];
}
