'use client';

import useSWR, { mutate } from 'swr';
import type { OHLCVBar, Timeframe } from '@/types';

const fetcher = (url: string): Promise<OHLCVBar[]> =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('OHLCV fetch failed');
    return r.json();
  });

function ohlcvKey(symbol: string, timeframe: Timeframe) {
  return `/api/ohlcv?symbol=${encodeURIComponent(symbol)}&timeframe=${timeframe}`;
}

export function useOHLCV(symbol: string | null, timeframe: Timeframe) {
  return useSWR<OHLCVBar[]>(symbol ? ohlcvKey(symbol, timeframe) : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60 * 60 * 1000, // 1 hour
  });
}

export function prefetchOHLCV(symbol: string, timeframe: Timeframe) {
  const key = ohlcvKey(symbol, timeframe);
  mutate(key, fetcher(key), { revalidate: false });
}
