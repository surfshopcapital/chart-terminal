'use client';

import { useEffect, useCallback } from 'react';
import { useTerminalStore } from '@/store/terminalStore';
import { useSessionStore } from '@/store/sessionStore';
import type { Timeframe } from '@/types';

const TIMEFRAMES: Timeframe[] = ['D', 'W', 'M'];

interface Options {
  total: number;
  tickerId: string | undefined;
  onSearch: () => void;
  onNoteFocus: () => void;
}

export function useKeyboardNav({ total, tickerId, onSearch, onNoteFocus }: Options) {
  const { currentIndex, timeframe, setCurrentIndex, setTimeframe } = useTerminalStore();
  const { markReviewed, setPendingRating } = useSessionStore();

  const handler = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const isEditing =
        tag === 'TEXTAREA' ||
        tag === 'INPUT' ||
        (e.target as HTMLElement).isContentEditable;

      switch (e.key) {
        case 'ArrowRight':
          if (!isEditing) {
            e.preventDefault();
            if (tickerId) markReviewed(tickerId);
            setCurrentIndex(Math.min(currentIndex + 1, total - 1));
          }
          break;

        case 'ArrowLeft':
          if (!isEditing) {
            e.preventDefault();
            if (tickerId) markReviewed(tickerId);
            setCurrentIndex(Math.max(currentIndex - 1, 0));
          }
          break;

        case 'ArrowUp': {
          if (!isEditing) {
            e.preventDefault();
            const idx = TIMEFRAMES.indexOf(timeframe);
            setTimeframe(TIMEFRAMES[Math.min(idx + 1, TIMEFRAMES.length - 1)]);
          }
          break;
        }

        case 'ArrowDown': {
          if (!isEditing) {
            e.preventDefault();
            const idx = TIMEFRAMES.indexOf(timeframe);
            setTimeframe(TIMEFRAMES[Math.max(idx - 1, 0)]);
          }
          break;
        }

        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          if (!isEditing && tickerId) {
            setPendingRating(tickerId, parseInt(e.key));
          }
          break;

        case 'Enter':
          if (!isEditing && tickerId) {
            markReviewed(tickerId);
          }
          break;

        case 'n':
        case 'N':
          if (!isEditing) {
            e.preventDefault();
            onNoteFocus();
          }
          break;

        case '/':
          if (!isEditing) {
            e.preventDefault();
            onSearch();
          }
          break;
      }
    },
    [
      currentIndex,
      timeframe,
      total,
      tickerId,
      setCurrentIndex,
      setTimeframe,
      markReviewed,
      setPendingRating,
      onSearch,
      onNoteFocus,
    ],
  );

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
}
