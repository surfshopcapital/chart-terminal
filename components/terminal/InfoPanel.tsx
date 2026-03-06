'use client';

import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { RatingInput } from './RatingInput';
import { NotesEditor } from './NotesEditor';
import { useSessionStore } from '@/store/sessionStore';
import type { Ticker, Quote, OHLCVBar } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface InfoPanelProps {
  ticker: Ticker;
  quote: Quote | undefined;
  dailyBars?: OHLCVBar[];
  noteFocusTrigger: number;
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Return the close price of the bar closest to `daysAgo` calendar days back. */
function closeDaysAgo(bars: OHLCVBar[], daysAgo: number): number | null {
  if (bars.length === 0) return null;
  const target = new Date();
  target.setDate(target.getDate() - daysAgo);
  const targetStr = target.toISOString().slice(0, 10);

  // Find last bar on or before target date
  let lo = 0, hi = bars.length - 1, result = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (bars[mid].time <= targetStr) { result = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return result >= 0 ? bars[result].close : null;
}

interface PeriodChange {
  label: string;
  pct: number | null;
}

function computePeriodChanges(bars: OHLCVBar[]): PeriodChange[] {
  if (bars.length === 0) return [];
  const current = bars[bars.length - 1].close;

  const periods: { label: string; daysAgo: number }[] = [
    { label: '1D',  daysAgo: 1   },
    { label: '1W',  daysAgo: 7   },
    { label: '1M',  daysAgo: 30  },
    { label: '1Y',  daysAgo: 365 },
    { label: '5Y',  daysAgo: 365 * 5 },
  ];

  return periods.map(({ label, daysAgo }) => {
    const past = closeDaysAgo(bars, daysAgo);
    const pct = past && past !== 0 ? ((current - past) / past) * 100 : null;
    return { label, pct };
  });
}

export function InfoPanel({ ticker, quote, dailyBars, noteFocusTrigger }: InfoPanelProps) {
  const { getPendingRating, setPendingRating, clearPendingRating } = useSessionStore();

  const today = new Date().toISOString().slice(0, 10);
  const { data: ratingData, mutate: mutateRating } = useSWR(
    ticker ? `/api/ratings?tickerId=${ticker.id}&date=${today}` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const pendingRating = getPendingRating(ticker.id);
  const displayRating = pendingRating ?? ratingData?.rating ?? null;

  // Flush pending rating to server
  const flushRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (pendingRating == null) return;
    if (flushRef.current) clearTimeout(flushRef.current);
    flushRef.current = setTimeout(async () => {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickerId: ticker.id, rating: pendingRating }),
      });
      clearPendingRating(ticker.id);
      mutateRating();
    }, 500);
  }, [pendingRating, ticker.id, clearPendingRating, mutateRating]);

  const priceColor =
    quote && quote.change >= 0
      ? 'text-[var(--green)]'
      : 'text-[var(--red)]';

  const periodChanges = dailyBars ? computePeriodChanges(dailyBars) : [];

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 text-sm">
      {/* Symbol + Name */}
      <div>
        <div className="font-mono text-xl font-semibold text-[var(--text-primary)]">
          {ticker.symbol.replace('=X', '').replace('^', '')}
        </div>
        <div className="text-xs text-[var(--text-secondary)] truncate">{ticker.name}</div>
      </div>

      {/* Quote */}
      {quote ? (
        <div className="flex flex-col gap-0.5">
          <div className={`font-mono text-2xl font-semibold ${priceColor}`}>
            {fmt(quote.price)}
          </div>
          <div className={`font-mono text-sm ${priceColor}`}>
            {quote.change >= 0 ? '+' : ''}
            {fmt(quote.change)} ({quote.change >= 0 ? '+' : ''}
            {fmt(quote.changePercent)}%)
          </div>
          {quote.relVolume != null && (
            <div className="text-xs text-[var(--text-secondary)]">
              Rel Vol:{' '}
              <span className="font-mono text-[var(--text-primary)]">
                {fmt(quote.relVolume, 2)}x
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-14 rounded bg-[var(--bg-elevated)] animate-pulse" />
      )}

      {/* Period % Changes */}
      {periodChanges.length > 0 && (
        <div className="border-t border-[var(--border)] pt-3">
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mb-2">
            Performance
          </div>
          <div className="grid grid-cols-5 gap-1">
            {periodChanges.map(({ label, pct }) => {
              const color =
                pct === null ? 'text-[var(--text-secondary)]'
                : pct >= 0   ? 'text-[var(--green)]'
                :              'text-[var(--red)]';
              return (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <span className="text-[9px] text-[var(--text-secondary)] font-mono">{label}</span>
                  <span className={`text-[11px] font-mono font-medium ${color}`}>
                    {pct === null
                      ? '—'
                      : `${pct >= 0 ? '+' : ''}${fmt(pct, 1)}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Description */}
      {ticker.description && (
        <div className="text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-3">
          {ticker.description}
        </div>
      )}

      {/* Rating */}
      <div className="border-t border-[var(--border)] pt-3 flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
          Rating (1–9)
        </span>
        <RatingInput
          value={displayRating}
          onChange={(r) => setPendingRating(ticker.id, r)}
        />
      </div>

      {/* Notes */}
      <div className="flex-1 border-t border-[var(--border)] pt-3">
        <NotesEditor tickerId={ticker.id} focusTrigger={noteFocusTrigger} />
      </div>
    </div>
  );
}
