import { db } from '@/lib/db';
import { FlashcardShell } from '@/components/terminal/FlashcardShell';

export const dynamic = 'force-dynamic';

/**
 * Seeded random number generator using date-based seed.
 * Returns consistent (but "random") order throughout the day.
 */
function seedRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Fisher-Yates shuffle with date-based seed.
 * Same date → same order. Different date → different order.
 */
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
  const allTickers = await db.ticker.findMany({
    where: { isActive: true },
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

  // Randomize daily but consistent throughout the day
  const today = new Date().toISOString().slice(0, 10);
  const tickers = shuffleWithDate(allTickers, today);

  return <FlashcardShell tickers={tickers} />;
}
