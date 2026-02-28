import { db } from '@/lib/db';
import { SessionList } from '@/components/history/SessionList';
import { SessionCalendar } from '@/components/history/SessionCalendar';
import { StreakBadge } from '@/components/history/StreakBadge';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const STREAK_THRESHOLD = 80;

function calcStreak(sessions: { date: string; completionPct: number }[]): number {
  const dateSet = new Set(
    sessions.filter((s) => s.completionPct >= STREAK_THRESHOLD).map((s) => s.date),
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    if (dateSet.has(dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

export default async function HistoryPage() {
  const sessions = await db.session.findMany({
    where: { userId: null },
    orderBy: { date: 'desc' },
    take: 90,
    select: { id: true, date: true, durationSecs: true, completionPct: true },
  });

  const streak = calcStreak(sessions);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-panel)] px-6 py-3 flex items-center justify-between">
        <Link
          href="/terminal"
          className="font-mono text-xs text-[var(--text-accent)] hover:underline"
        >
          ← Back to Terminal
        </Link>
        <span className="font-mono text-xs font-semibold text-[var(--text-accent)] tracking-wider">
          CHART TERMINAL · HISTORY
        </span>
        <div className="w-32" />
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 flex flex-col gap-8">
        {/* Streak */}
        <div className="flex items-center gap-4">
          <StreakBadge streak={streak} />
          {streak === 0 && (
            <p className="text-sm text-[var(--text-secondary)]">
              Complete ≥ 80% of your universe daily to build a streak.
            </p>
          )}
        </div>

        {/* Calendar heatmap */}
        <section>
          <h2 className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-4">
            Activity
          </h2>
          <SessionCalendar sessions={sessions} />
        </section>

        {/* Session table */}
        <section>
          <h2 className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-4">
            Sessions
          </h2>
          <SessionList sessions={sessions} />
        </section>
      </main>
    </div>
  );
}
