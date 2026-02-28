'use client';

export function SkeletonCard() {
  return (
    <div className="w-full h-full flex flex-col gap-3 p-4 animate-pulse">
      <div className="h-4 w-32 rounded bg-[var(--bg-elevated)]" />
      <div className="flex-1 rounded bg-[var(--bg-elevated)]" />
      <div className="h-16 rounded bg-[var(--bg-elevated)]" />
    </div>
  );
}
