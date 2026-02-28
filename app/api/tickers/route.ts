import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const tickers = await db.ticker.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { symbol: 'asc' }],
    select: {
      id: true,
      symbol: true,
      name: true,
      type: true,
      category: true,
      description: true,
      isActive: true,
    },
  });

  return NextResponse.json(tickers, {
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}
