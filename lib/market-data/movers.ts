/**
 * Fetches the top 100 daily movers (by absolute % change) in the
 * $500 M – $20 B market-cap band.  Results are cached for 16 hours so
 * repeated page loads within a session hit the in-process LRU cache, not
 * Yahoo Finance.  On any error we return [] so the terminal still works.
 */
import YahooFinance from 'yahoo-finance2';
import { LRUCache } from 'lru-cache';
import type { Ticker } from '@/types';

const yf = new YahooFinance();

const cache = new LRUCache<string, Ticker[]>({
  max: 2,
  ttl: 1_000 * 60 * 60 * 16, // 16 hours
});

const MIN_CAP = 500_000_000;   // $500 M
const MAX_CAP = 20_000_000_000; // $20 B

export async function fetchDailyMovers(): Promise<Ticker[]> {
  const today = new Date().toISOString().slice(0, 10);
  const hit = cache.get(today);
  if (hit) return hit;

  try {
    // Pull gainers + losers in parallel; use allSettled so one failure
    // doesn't kill the other.
    const [gainersRes, losersRes] = await Promise.allSettled([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (yf as any).screener({ scrIds: 'day_gainers', count: 100, region: 'US' }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (yf as any).screener({ scrIds: 'day_losers',  count: 100, region: 'US' }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extract = (res: PromiseSettledResult<any>): any[] =>
      res.status === 'fulfilled' ? (res.value?.quotes ?? []) : [];

    const all = [...extract(gainersRes), ...extract(losersRes)];

    // Filter by market cap and valid change %
    const filtered = all.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (q: any) =>
        q?.symbol != null &&
        q?.marketCap != null &&
        q.marketCap >= MIN_CAP &&
        q.marketCap <= MAX_CAP &&
        q?.regularMarketChangePercent != null,
    );

    // Deduplicate symbols
    const seen = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deduped = filtered.filter((q: any) => {
      if (seen.has(q.symbol)) return false;
      seen.add(q.symbol);
      return true;
    });

    // Sort by absolute % move descending, take top 100
    deduped.sort(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (a: any, b: any) =>
        Math.abs(b.regularMarketChangePercent) - Math.abs(a.regularMarketChangePercent),
    );
    const top = deduped.slice(0, 100);

    // Map to our Ticker shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const movers: Ticker[] = top.map((q: any) => ({
      id: `mover_${q.symbol}`,
      symbol: q.symbol as string,
      name: (q.shortName ?? q.longName ?? q.symbol) as string,
      type: 'equity',
      category: 'daily_mover',
      description: null,
      isActive: true,
    }));

    if (movers.length > 0) cache.set(today, movers);
    console.log(`[movers] fetched ${movers.length} daily movers`);
    return movers;
  } catch (err) {
    console.error('[movers] fetch failed — continuing without movers:', err);
    return [];
  }
}
