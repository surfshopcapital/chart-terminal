import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const tickers = await db.ticker.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { symbol: 'asc' }],
    select: {
      id: true, symbol: true, name: true,
      type: true, category: true, description: true, isActive: true,
    },
  });
  return NextResponse.json(tickers, {
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { symbol, name, type, category, description } = body as Record<string, string>;

    if (!symbol?.trim() || !name?.trim() || !type?.trim() || !category?.trim()) {
      return NextResponse.json({ error: 'symbol, name, type and category are required' }, { status: 400 });
    }

    const ticker = await db.ticker.create({
      data: {
        symbol: symbol.trim().toUpperCase(),
        name: name.trim(),
        type: type.trim(),
        category: category.trim(),
        description: description?.trim() || null,
        isActive: true,
      },
    });
    return NextResponse.json(ticker, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    // Unique constraint violation → duplicate symbol
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Symbol already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
