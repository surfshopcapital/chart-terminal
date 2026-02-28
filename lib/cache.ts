import { LRUCache } from 'lru-cache';
import type { OHLCVBar } from '@/types';

// Key: `${symbol}:${timeframe}`
export const ohlcvCache = new LRUCache<string, OHLCVBar[]>({
  max: 500,
  ttl: 1000 * 60 * 60, // 1 hour
});

// Key: symbol
export const quoteCache = new LRUCache<string, object>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export function ohlcvCacheKey(symbol: string, timeframe: string) {
  return `${symbol}:${timeframe}`;
}
