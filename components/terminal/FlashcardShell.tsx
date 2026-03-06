'use client';

import { useRef, useState, useEffect } from 'react';
import { useTerminalStore } from '@/store/terminalStore';
import { useOHLCV, prefetchOHLCV } from '@/hooks/useOHLCV';
import { useQuote } from '@/hooks/useQuote';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { useSession } from '@/hooks/useSession';
import { useTheme } from '@/hooks/useTheme';
import { TopBar } from './TopBar';
import { ChartPane } from './ChartPane';
import { InfoPanel } from './InfoPanel';
import { SkeletonCard } from './SkeletonCard';
import { TickerSearch } from './TickerSearch';
import type { Ticker } from '@/types';

interface FlashcardShellProps {
  tickers: Ticker[];
}

export function FlashcardShell({ tickers }: FlashcardShellProps) {
  const { currentIndex, timeframe, searchOpen, setCurrentIndex, setTimeframe, setSearchOpen } =
    useTerminalStore();
  const { theme } = useTheme();
  const [noteFocusTrigger, setNoteFocusTrigger] = useState(0);

  const ticker = tickers[currentIndex] ?? tickers[0];

  useSession(tickers.length);

  useKeyboardNav({
    total: tickers.length,
    tickerId: ticker?.id,
    onSearch: () => setSearchOpen(true),
    onNoteFocus: () => setNoteFocusTrigger((n) => n + 1),
  });

  // Prefetch adjacent tickers
  useEffect(() => {
    const prev = tickers[currentIndex - 1];
    const next = tickers[currentIndex + 1];
    if (prev) prefetchOHLCV(prev.symbol, timeframe);
    if (next) prefetchOHLCV(next.symbol, timeframe);
  }, [currentIndex, tickers, timeframe]);

  const { data: bars, isLoading } = useOHLCV(ticker?.symbol ?? null, timeframe);
  // Always fetch daily bars regardless of display timeframe — used for indicators & % changes
  const { data: dailyBars } = useOHLCV(ticker?.symbol ?? null, 'D');
  const { data: quote } = useQuote(ticker?.symbol ?? null);

  if (!ticker) {
    return (
      <div className="flex h-screen items-center justify-center text-[var(--text-secondary)]">
        No tickers in universe. Run the seed script.
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--bg-primary)] overflow-hidden">
      <TopBar
        tickers={tickers}
        currentIndex={currentIndex}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
      />

      <div className="flex flex-1 min-h-0">
        {/* Main chart area */}
        <main className="flex-1 min-w-0 relative">
          {isLoading || !bars ? (
            <SkeletonCard />
          ) : (
            <ChartPane bars={bars} dailyBars={dailyBars} isDark={theme === 'dark'} />
          )}
        </main>

        {/* Right info panel */}
        <aside className="w-[432px] shrink-0 border-l border-[var(--border)] bg-[var(--bg-panel)]">
          <InfoPanel
            ticker={ticker}
            quote={quote}
            dailyBars={dailyBars}
            noteFocusTrigger={noteFocusTrigger}
          />
        </aside>
      </div>

      <TickerSearch
        tickers={tickers}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(i) => {
          setCurrentIndex(i);
          setSearchOpen(false);
        }}
      />
    </div>
  );
}
