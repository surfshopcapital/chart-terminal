import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const ticker = await db.ticker.findUnique({ where: { id } });
  if (!ticker) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(ticker);
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { symbol, name, type, category, description, isActive } = body as {
      symbol?: string; name?: string; type?: string;
      category?: string; description?: string | null; isActive?: boolean;
    };

    const ticker = await db.ticker.update({
      where: { id },
      data: {
        ...(symbol    !== undefined && { symbol: symbol.trim().toUpperCase() }),
        ...(name      !== undefined && { name: name.trim() }),
        ...(type      !== undefined && { type: type.trim() }),
        ...(category  !== undefined && { category: category.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(isActive  !== undefined && { isActive }),
      },
    });
    return NextResponse.json(ticker);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    if (msg.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    await db.ticker.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    if (msg.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
