'use client';

interface RatingInputProps {
  value: number | null;
  onChange: (rating: number) => void;
}

const COLORS: Record<number, string> = {
  1: '#ef4444',
  2: '#f97316',
  3: '#f59e0b',
  4: '#eab308',
  5: '#84cc16',
  6: '#22c55e',
  7: '#10b981',
  8: '#06b6d4',
  9: '#6366f1',
};

export function RatingInput({ value, onChange }: RatingInputProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            backgroundColor: value === n ? COLORS[n] : undefined,
            color: value === n ? '#fff' : undefined,
            borderColor: COLORS[n],
          }}
          className="w-7 h-7 text-xs font-mono rounded border transition-all hover:opacity-80"
          title={`Rate ${n}`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
