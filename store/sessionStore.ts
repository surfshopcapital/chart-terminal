'use client';

import { create } from 'zustand';

interface SessionState {
  sessionId: string | null;
  reviewedIds: Set<string>;
  pendingRatings: Map<string, number>;
  startTime: number | null;

  setSessionId: (id: string) => void;
  markReviewed: (tickerId: string) => void;
  setPendingRating: (tickerId: string, rating: number) => void;
  clearPendingRating: (tickerId: string) => void;
  setStartTime: (t: number) => void;

  isReviewed: (tickerId: string) => boolean;
  getPendingRating: (tickerId: string) => number | undefined;
  getElapsedSecs: () => number;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  sessionId: null,
  reviewedIds: new Set(),
  pendingRatings: new Map(),
  startTime: null,

  setSessionId: (id) => set({ sessionId: id }),

  markReviewed: (tickerId) =>
    set((state) => {
      const next = new Set(state.reviewedIds);
      next.add(tickerId);
      return { reviewedIds: next };
    }),

  setPendingRating: (tickerId, rating) =>
    set((state) => {
      const next = new Map(state.pendingRatings);
      next.set(tickerId, rating);
      return { pendingRatings: next };
    }),

  clearPendingRating: (tickerId) =>
    set((state) => {
      const next = new Map(state.pendingRatings);
      next.delete(tickerId);
      return { pendingRatings: next };
    }),

  setStartTime: (t) => set({ startTime: t }),

  isReviewed: (tickerId) => get().reviewedIds.has(tickerId),
  getPendingRating: (tickerId) => get().pendingRatings.get(tickerId),
  getElapsedSecs: () => {
    const start = get().startTime;
    if (!start) return 0;
    return Math.floor((Date.now() - start) / 1000);
  },
}));
