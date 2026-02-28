'use client';

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { RatingInput } from './RatingInput';
import { NotesEditor } from './NotesEditor';
import { useSessionStore } from '@/store/sessionStore';
import type { Ticker, Quote } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface InfoPanelProps {
  ticker: Ticker;
  quote: Quote | undefined;
  noteFocusTrigger: number;
}

export function InfoPanel({ ticker, quote, noteFocusTrigger }: InfoPanelProps) {
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

  function fmt(n: number, decimals = 2) {
    return n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

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
