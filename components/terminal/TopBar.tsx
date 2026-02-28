'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useSessionStore } from '@/store/sessionStore';
import type { Timeframe, Ticker } from '@/types';

interface TopBarProps {
  tickers: Ticker[];
  currentIndex: number;
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
}

const TF_LABELS: Record<Timeframe, string> = { D: 'Daily', W: 'Weekly', M: 'Monthly' };

export function TopBar({ tickers, currentIndex, timeframe, onTimeframeChange }: TopBarProps) {
  const { reviewedIds } = useSessionStore();
  const total = tickers.length;
  const reviewed = reviewedIds.size;
  const pct = total > 0 ? Math.round((reviewed / total) * 100) : 0;

  const STREAK_THRESHOLD = 80; // matching the 80% default from brief
  const isOnStreak = pct >= STREAK_THRESHOLD;

  return (
    <header className="flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg-panel)] px-4 py-2 shrink-0">
      {/* Left: app name + current position */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs font-semibold text-[var(--text-accent)] tracking-wider">
          CHART TERMINAL
        </span>
        <span className="text-[var(--text-secondary)] text-xs">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* Center: timeframe switcher */}
      <div className="flex gap-1">
        {(['D', 'W', 'M'] as Timeframe[]).map((tf) => (
          <button
            key={tf}
            onClick={() => onTimeframeChange(tf)}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
              timeframe === tf
                ? 'bg-[var(--text-accent)] text-[var(--bg-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            {TF_LABELS[tf]}
          </button>
        ))}
      </div>

      {/* Right: progress + streak + theme */}
      <div className="flex items-center gap-3">
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                backgroundColor: isOnStreak ? 'var(--green)' : 'var(--text-accent)',
              }}
            />
          </div>
          <span className="text-xs font-mono text-[var(--text-secondary)]">{pct}%</span>
        </div>

        {/* Keyboard hint */}
        <span className="hidden lg:inline text-[10px] text-[var(--text-secondary)] font-mono">
          ← → navigate · ↑ ↓ timeframe · 1–9 rate · / search
        </span>

        <ThemeToggle />
      </div>
    </header>
  );
}
