import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { sessionId, tickerId, timeframe } = await req.json();

  if (!sessionId || !tickerId || !timeframe) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const review = await db.review.create({
    data: { sessionId, tickerId, timeframe },
  });

  return NextResponse.json(review);
}
