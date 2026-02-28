'use client';

import { useRef, useEffect, useCallback } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface NotesEditorProps {
  tickerId: string;
  focusTrigger: number; // bump to focus textarea
}

export function NotesEditor({ tickerId, focusTrigger }: NotesEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, mutate } = useSWR(
    tickerId ? `/api/notes?tickerId=${tickerId}` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (focusTrigger > 0) {
      textareaRef.current?.focus();
    }
  }, [focusTrigger]);

  const save = useCallback(
    (content: string) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        await fetch('/api/notes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tickerId, content }),
        });
        mutate();
      }, 800);
    },
    [tickerId, mutate],
  );

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
        Notes
      </span>
      <textarea
        ref={textareaRef}
        key={tickerId}
        defaultValue={data?.content ?? ''}
        onChange={(e) => save(e.target.value)}
        rows={6}
        placeholder="Press N to focus…"
        className="w-full resize-none rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--text-accent)] font-mono"
      />
    </div>
  );
}
