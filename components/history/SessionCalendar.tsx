'use client';

interface SessionDay {
  date: string;
  completionPct: number;
}

interface SessionCalendarProps {
  sessions: SessionDay[];
}

function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function pctToColor(pct: number): string {
  if (pct === 0) return 'var(--bg-elevated)';
  if (pct < 50) return '#7f1d1d';
  if (pct < 80) return '#78350f';
  return '#14532d';
}

export function SessionCalendar({ sessions }: SessionCalendarProps) {
  const sessionMap = new Map(sessions.map((s) => [s.date, s.completionPct]));
  const days = getLastNDays(90);

  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
        Last 90 days
      </div>
      <div className="flex flex-wrap gap-1">
        {days.map((date) => {
          const pct = sessionMap.get(date) ?? 0;
          return (
            <div
              key={date}
              title={`${date}: ${Math.round(pct)}%`}
              style={{ backgroundColor: pctToColor(pct) }}
              className="w-3.5 h-3.5 rounded-sm cursor-default transition-opacity hover:opacity-70"
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-2 text-[10px] text-[var(--text-secondary)]">
        <span>None</span>
        {[0, 30, 60, 80, 100].map((p) => (
          <div
            key={p}
            style={{ backgroundColor: pctToColor(p) }}
            className="w-3.5 h-3.5 rounded-sm"
          />
        ))}
        <span>100%</span>
      </div>
    </div>
  );
}
