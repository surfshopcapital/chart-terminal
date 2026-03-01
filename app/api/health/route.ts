import { NextResponse } from 'next/server';

/**
 * Lightweight healthcheck — no DB call.
 * Railway uses this to confirm the server is up before marking the deploy live.
 */
export async function GET() {
  return NextResponse.json({ ok: true });
}
