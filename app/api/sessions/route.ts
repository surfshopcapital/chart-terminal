import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// POST: create or return today's session
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const date = body.date ?? todayStr();

  const existing = await db.session.findFirst({ where: { userId: null, date } });

  const session = existing
    ? existing
    : await db.session.create({
        data: { userId: null, date, startedAt: new Date() },
      });

  return NextResponse.json(session);
}

// PATCH: update progress (heartbeat or final)
export async function PATCH(req: NextRequest) {
  const { sessionId, durationSecs, completionPct, end } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  const session = await db.session.update({
    where: { id: sessionId },
    data: {
      durationSecs: durationSecs ?? 0,
      completionPct: completionPct ?? 0,
      ...(end ? { endedAt: new Date() } : {}),
    },
  });

  return NextResponse.json(session);
}
