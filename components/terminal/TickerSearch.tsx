'use client';

import { useEffect, useRef, useState } from 'react';
import type { Ticker } from '@/types';

interface TickerSearchProps {
  tickers: Ticker[];
  open: boolean;
  onClose: () => void;
  onSelect: (index: number) => void;
}

export function TickerSearch({ tickers, open, onClose, onSelect }: TickerSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const filtered = query.trim()
    ? tickers.filter(
        (t) =>
          t.symbol.toLowerCase().includes(query.toLowerCase()) ||
          t.name.toLowerCase().includes(query.toLowerCase()),
      )
    : tickers;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-[var(--border)] bg-[var(--bg-panel)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ticker or name…"
          className="w-full border-b border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none font-mono"
        />
        <ul className="max-h-72 overflow-y-auto">
          {filtered.slice(0, 50).map((ticker, i) => {
            const idx = tickers.indexOf(ticker);
            return (
              <li key={ticker.id}>
                <button
                  onClick={() => {
                    onSelect(idx);
                    onClose();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  <span className="w-24 font-mono text-xs text-[var(--text-accent)]">
                    {ticker.symbol}
                  </span>
                  <span className="flex-1 truncate text-xs text-[var(--text-primary)]">
                    {ticker.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase">
                    {ticker.category.replace('_', ' ')}
                  </span>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-xs text-[var(--text-secondary)]">
              No results
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
