import Link from 'next/link';
import { db } from '@/lib/db';
import { TickerManager } from '@/components/tickers/TickerManager';

export const dynamic = 'force-dynamic';

export default async function TickersPage() {
  // Load ALL tickers (including inactive) for management
  const tickers = await db.ticker.findMany({
    orderBy: [{ category: 'asc' }, { symbol: 'asc' }],
    select: {
      id: true, symbol: true, name: true,
      type: true, category: true, description: true, isActive: true,
    },
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="flex items-center gap-4 border-b border-[var(--border)] bg-[var(--bg-panel)] px-6 py-3 sticky top-0 z-20">
        <Link
          href="/terminal"
          className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          ← Terminal
        </Link>
        <span className="font-mono text-xs font-semibold text-[var(--text-accent)] tracking-wider">
          TICKER UNIVERSE
        </span>
        <span className="text-xs text-[var(--text-secondary)]">{tickers.length} tickers</span>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <TickerManager tickers={tickers} />
      </main>
    </div>
  );
}
