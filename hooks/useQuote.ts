'use client';

import useSWR from 'swr';
import type { Quote } from '@/types';

const fetcher = (url: string): Promise<Quote> =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Quote fetch failed');
    return r.json();
  });

export function useQuote(symbol: string | null) {
  return useSWR<Quote>(
    symbol ? `/api/quote?symbol=${encodeURIComponent(symbol)}` : null,
    fetcher,
    {
      refreshInterval: 30_000, // refresh every 30s
      revalidateOnFocus: true,
      dedupingInterval: 15_000,
    },
  );
}
