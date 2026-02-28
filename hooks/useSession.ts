'use client';

import { useEffect, useRef } from 'react';
import { useSessionStore } from '@/store/sessionStore';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function useSession(totalTickers: number) {
  const { sessionId, setSessionId, reviewedIds, setStartTime, getElapsedSecs } =
    useSessionStore();
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start or resume today's session
  useEffect(() => {
    async function init() {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: todayStr() }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setSessionId(data.id);
      setStartTime(Date.now());
    }
    if (!sessionId) init();
  }, [sessionId, setSessionId, setStartTime]);

  // Heartbeat: sync progress every 30s
  useEffect(() => {
    if (!sessionId) return;

    heartbeatRef.current = setInterval(async () => {
      const completionPct =
        totalTickers > 0 ? (reviewedIds.size / totalTickers) * 100 : 0;
      await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          durationSecs: getElapsedSecs(),
          completionPct,
        }),
      });
    }, 30_000);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [sessionId, reviewedIds, totalTickers, getElapsedSecs]);

  // Final sync on unload
  useEffect(() => {
    if (!sessionId) return;
    function handleUnload() {
      const completionPct =
        totalTickers > 0 ? (reviewedIds.size / totalTickers) * 100 : 0;
      navigator.sendBeacon(
        '/api/sessions',
        JSON.stringify({
          sessionId,
          durationSecs: getElapsedSecs(),
          completionPct,
          end: true,
        }),
      );
    }
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [sessionId, reviewedIds, totalTickers, getElapsedSecs]);

  return { sessionId };
}
