export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { marketDataProvider } from '@/lib/market-data';
import { ohlcvCache, ohlcvCacheKey } from '@/lib/cache';
import type { Timeframe } from '@/types';

const VALID_TIMEFRAMES: Timeframe[] = ['D', 'W', 'M'];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');
  const timeframe = (searchParams.get('timeframe') ?? 'D') as Timeframe;

  if (!symbol) {
    return NextResponse.json({ error: 'Missing symbol' }, { status: 400 });
  }
  if (!VALID_TIMEFRAMES.includes(timeframe)) {
    return NextResponse.json({ error: 'Invalid timeframe' }, { status: 400 });
  }

  const key = ohlcvCacheKey(symbol, timeframe);
  const cached = ohlcvCache.get(key);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'X-Cache': 'HIT' },
    });
  }

  try {
    const bars = await marketDataProvider.getOHLCV(symbol, timeframe);
    ohlcvCache.set(key, bars);
    return NextResponse.json(bars, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'X-Cache': 'MISS',
      },
    });
  } catch (err) {
    console.error('[ohlcv]', symbol, err);
    return NextResponse.json({ error: 'Failed to fetch OHLCV data' }, { status: 502 });
  }
}
