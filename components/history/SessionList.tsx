'use client';

interface SessionRow {
  id: string;
  date: string;
  durationSecs: number;
  completionPct: number;
}

interface SessionListProps {
  sessions: SessionRow[];
}

function fmtDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

export function SessionList({ sessions }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">No sessions yet. Start reviewing!</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-mono border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="py-2 text-left text-[10px] uppercase tracking-wider text-[var(--text-secondary)] pr-6">Date</th>
            <th className="py-2 text-right text-[10px] uppercase tracking-wider text-[var(--text-secondary)] pr-6">Completion</th>
            <th className="py-2 text-right text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Duration</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors">
              <td className="py-2 pr-6 text-[var(--text-primary)]">{s.date}</td>
              <td className="py-2 pr-6 text-right">
                <span
                  className={
                    s.completionPct >= 80
                      ? 'text-[var(--green)]'
                      : s.completionPct >= 50
                      ? 'text-[var(--text-accent)]'
                      : 'text-[var(--red)]'
                  }
                >
                  {Math.round(s.completionPct)}%
                </span>
              </td>
              <td className="py-2 text-right text-[var(--text-secondary)]">
                {fmtDuration(s.durationSecs)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
