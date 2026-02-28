export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { marketDataProvider } from '@/lib/market-data';
import { quoteCache } from '@/lib/cache';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Missing symbol' }, { status: 400 });
  }

  const cached = quoteCache.get(symbol);
  if (cached) {
    return NextResponse.json(cached, { headers: { 'X-Cache': 'HIT' } });
  }

  try {
    const quote = await marketDataProvider.getQuote(symbol);
    quoteCache.set(symbol, quote);
    return NextResponse.json(quote, {
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  } catch (err) {
    console.error('[quote]', symbol, err);
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 502 });
  }
}
