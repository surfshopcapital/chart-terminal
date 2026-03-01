import { db } from '@/lib/db';
import { fetchDailyMovers } from '@/lib/market-data/movers';
import { FlashcardShell } from '@/components/terminal/FlashcardShell';
import type { Ticker } from '@/types';

export const dynamic = 'force-dynamic';

function seedRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function shuffleWithDate<T>(arr: T[], dateStr: string): T[] {
  const seed = parseInt(dateStr.replace(/-/g, ''), 10);
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seedRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function TerminalPage() {
  // Fetch DB tickers + daily movers in parallel (movers never crash the page)
  const [dbTickers, movers] = await Promise.all([
    db.ticker.findMany({
      where: { isActive: true },
      select: {
        id: true, symbol: true, name: true,
        type: true, category: true, description: true, isActive: true,
      },
    }),
    fetchDailyMovers().catch((): Ticker[] => []),
  ]);

  // Merge: only add movers whose symbol isn't already in the DB universe
  const existingSymbols = new Set(dbTickers.map((t) => t.symbol));
  const newMovers = movers.filter((m) => !existingSymbols.has(m.symbol));
  const combined: Ticker[] = [...dbTickers, ...newMovers];

  // Daily shuffle — consistent within a day, different across days
  const today = new Date().toISOString().slice(0, 10);
  const tickers = shuffleWithDate(combined, today);

  return <FlashcardShell tickers={tickers} />;
}
