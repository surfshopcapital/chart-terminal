'use client';

import { create } from 'zustand';
import type { Timeframe } from '@/types';

interface TerminalState {
  currentIndex: number;
  timeframe: Timeframe;
  searchOpen: boolean;
  setCurrentIndex: (index: number) => void;
  setTimeframe: (tf: Timeframe) => void;
  setSearchOpen: (open: boolean) => void;
}

export const useTerminalStore = create<TerminalState>()((set) => ({
  currentIndex: 0,
  timeframe: 'D',
  searchOpen: false,

  setCurrentIndex: (index) => set({ currentIndex: index }),
  setTimeframe: (timeframe) => set({ timeframe }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}));
