'use client';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-1.5 rounded border border-[var(--green)] px-2.5 py-1">
      <span className="text-[var(--green)] text-sm">🔥</span>
      <span className="font-mono text-sm font-semibold text-[var(--green)]">
        {streak}d streak
      </span>
    </div>
  );
}
