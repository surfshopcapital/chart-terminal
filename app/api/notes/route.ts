import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tickerId = searchParams.get('tickerId');

  if (!tickerId) {
    return NextResponse.json({ error: 'Missing tickerId' }, { status: 400 });
  }

  const note = await db.note.findFirst({
    where: { tickerId, userId: null },
  });

  return NextResponse.json(
    note ?? { id: null, tickerId, content: '', updatedAt: null },
  );
}

export async function PUT(req: NextRequest) {
  const { tickerId, content } = await req.json();

  if (!tickerId) {
    return NextResponse.json({ error: 'Missing tickerId' }, { status: 400 });
  }

  const existing = await db.note.findFirst({ where: { tickerId, userId: null } });

  const note = existing
    ? await db.note.update({
        where: { id: existing.id },
        data: { content: content ?? '' },
      })
    : await db.note.create({
        data: { tickerId, userId: null, content: content ?? '' },
      });

  return NextResponse.json(note);
}
