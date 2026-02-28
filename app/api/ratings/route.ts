import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tickerId = searchParams.get('tickerId');
  const date = searchParams.get('date') ?? todayStr();

  if (!tickerId) {
    return NextResponse.json({ error: 'Missing tickerId' }, { status: 400 });
  }

  const rating = await db.rating.findFirst({
    where: { tickerId, userId: null, date },
  });

  return NextResponse.json(rating ?? { id: null, tickerId, date, rating: null });
}

export async function POST(req: NextRequest) {
  const { tickerId, rating, date } = await req.json();

  if (!tickerId || rating == null) {
    return NextResponse.json({ error: 'Missing tickerId or rating' }, { status: 400 });
  }
  if (rating < 1 || rating > 9) {
    return NextResponse.json({ error: 'Rating must be 1–9' }, { status: 400 });
  }

  const dateStr = date ?? todayStr();

  const existing = await db.rating.findFirst({
    where: { tickerId, userId: null, date: dateStr },
  });

  const record = existing
    ? await db.rating.update({
        where: { id: existing.id },
        data: { rating },
      })
    : await db.rating.create({
        data: { tickerId, userId: null, date: dateStr, rating },
      });

  return NextResponse.json(record);
}
