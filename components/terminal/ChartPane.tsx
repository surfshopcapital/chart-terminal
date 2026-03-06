'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
} from 'lightweight-charts';
import type { IChartApi } from 'lightweight-charts';
import { computeIndicators } from '@/lib/indicators/compute';
import type { OHLCVBar } from '@/types';

interface ChartPaneProps {
  bars: OHLCVBar[];
  dailyBars?: OHLCVBar[];
  isDark: boolean;
}

type SeriesRef = ReturnType<IChartApi['addSeries']>;

// ── Palette ────────────────────────────────────────────────────────────────────
const MA = {
  ema8:   '#88ff44',
  ema21:  '#44ffdd',
  sma21:  '#4488ff',
  sma50:  '#ffaa00',
  sma200: '#ff4488',
  rsi:    '#aa88ff',
  macdL:  '#4488ff',
  macdS:  '#ff8844',
} as const;

// ── Theme helpers ──────────────────────────────────────────────────────────────
const darkLayout  = () => ({ background: { color: '#0a0a0a' }, textColor: '#555555' });
const lightLayout = () => ({ background: { color: '#f5f5f5' }, textColor: '#999999' });

const gridColors = (dark: boolean) => {
  const c = dark ? '#111111' : '#e8e8e8';
  return { vertLines: { color: c }, horzLines: { color: c } };
};
const borderColor    = (dark: boolean) => (dark ? '#262626' : '#d8d8d8');
const subBorderColor = (dark: boolean) => (dark ? '#1e1e1e' : '#e0e0e0');
const midlineColor   = (dark: boolean) => (dark ? '#333333' : '#bbbbbb');

// ── Helpers ────────────────────────────────────────────────────────────────────
function lastNonNull(arr: (number | null)[]): number | null {
  for (let i = arr.length - 1; i >= 0; i--) if (arr[i] !== null) return arr[i];
  return null;
}
const fmt = (v: number | null, d = 2) => (v === null ? '—' : v.toFixed(d));

interface Legend {
  ema8: number | null; ema21: number | null;
  sma21: number | null; sma50: number | null; sma200: number | null;
  rsi14: number | null;
}

/**
 * Given a sorted array of date strings and a target date string,
 * returns the index of the last date that is <= target.
 */
function findDailyIndex(sortedDates: string[], target: string): number {
  let lo = 0, hi = sortedDates.length - 1, result = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (sortedDates[mid] <= target) { result = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return result;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function ChartPane({ bars, dailyBars, isDark }: ChartPaneProps) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const chartRef        = useRef<IChartApi | null>(null);
  const candleRef       = useRef<SeriesRef | null>(null);
  const volRef          = useRef<SeriesRef | null>(null);
  const sma21Ref        = useRef<SeriesRef | null>(null);
  const sma50Ref        = useRef<SeriesRef | null>(null);
  const sma200Ref       = useRef<SeriesRef | null>(null);
  const ema8Ref         = useRef<SeriesRef | null>(null);
  const ema21Ref        = useRef<SeriesRef | null>(null);
  const rsiRef          = useRef<SeriesRef | null>(null);
  const rsi50Ref        = useRef<SeriesRef | null>(null);
  const macdLineRef     = useRef<SeriesRef | null>(null);
  const macdSignalRef   = useRef<SeriesRef | null>(null);
  const macdHistRef     = useRef<SeriesRef | null>(null);

  const [legend, setLegend] = useState<Legend>({
    ema8: null, ema21: null, sma21: null, sma50: null, sma200: null, rsi14: null,
  });

  // ── Layout constants (70% main / 15% RSI / 15% MACD) ─────────────────────
  // Each pane defined by scaleMargins: { top, bottom }
  // Data occupies (1 - top - bottom) of the full chart height.
  //   Main: top=0.02, bottom=0.30  → ~68% of chart
  //   RSI:  top=0.72, bottom=0.14  → ~14%
  //   MACD: top=0.88, bottom=0.02  → ~10%
  const MAIN_TOP    = 0.02;
  const MAIN_BOTTOM = 0.30;
  const RSI_TOP     = 0.72;
  const RSI_BOTTOM  = 0.14;
  const MACD_TOP    = 0.88;
  const MACD_BOTTOM = 0.02;
  // Volume at bottom ~12% of main area
  const VOL_TOP     = 0.62;
  const VOL_BOTTOM  = MAIN_BOTTOM;

  // ── Init chart (once on mount) ────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width:  containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: isDark ? darkLayout() : lightLayout(),
      grid:   gridColors(isDark),
      crosshair: { mode: 1 },
      rightPriceScale: {
        borderColor: borderColor(isDark),
        scaleMargins: { top: MAIN_TOP, bottom: MAIN_BOTTOM },
      },
      timeScale: {
        borderColor: borderColor(isDark),
        rightOffset: 20,
        timeVisible: false,
      },
    });
    chartRef.current = chart;

    // ── Candlesticks ─────────────────────────────────────────────────────────
    candleRef.current = chart.addSeries(CandlestickSeries, {
      upColor: '#00d4aa', downColor: '#ff4d4d',
      borderVisible: false,
      wickUpColor: '#00d4aa', wickDownColor: '#ff4d4d',
    });

    // ── Volume overlay (bottom portion of main area, hidden axis) ────────────
    volRef.current = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });
    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: VOL_TOP, bottom: VOL_BOTTOM },
      visible: false,
    });

    // ── Moving averages (share main / right scale) ────────────────────────────
    const maLine = (color: string) =>
      chart.addSeries(LineSeries, {
        color, lineWidth: 1, priceLineVisible: false, lastValueVisible: false,
      });
    sma21Ref.current  = maLine(MA.sma21);
    sma50Ref.current  = maLine(MA.sma50);
    sma200Ref.current = maLine(MA.sma200);
    ema8Ref.current   = maLine(MA.ema8);
    ema21Ref.current  = maLine(MA.ema21);

    // ── RSI sub-pane ─────────────────────────────────────────────────────────
    rsiRef.current = chart.addSeries(LineSeries, {
      color: MA.rsi, lineWidth: 1,
      priceLineVisible: false, lastValueVisible: false,
      priceScaleId: 'rsi',
    });
    chart.priceScale('rsi').applyOptions({
      scaleMargins: { top: RSI_TOP, bottom: RSI_BOTTOM },
      visible: true,
      borderColor: subBorderColor(isDark),
    });

    // RSI midline at 50 (dashed)
    rsi50Ref.current = chart.addSeries(LineSeries, {
      color: midlineColor(isDark), lineWidth: 1,
      lineStyle: 2,
      priceLineVisible: false, lastValueVisible: false,
      priceScaleId: 'rsi',
    });

    // ── MACD sub-pane ─────────────────────────────────────────────────────────
    macdHistRef.current = chart.addSeries(HistogramSeries, {
      priceScaleId: 'macd',
      priceLineVisible: false, lastValueVisible: false,
    });
    macdLineRef.current = chart.addSeries(LineSeries, {
      color: MA.macdL, lineWidth: 1,
      priceScaleId: 'macd',
      priceLineVisible: false, lastValueVisible: false,
    });
    macdSignalRef.current = chart.addSeries(LineSeries, {
      color: MA.macdS, lineWidth: 1,
      priceScaleId: 'macd',
      priceLineVisible: false, lastValueVisible: false,
    });
    chart.priceScale('macd').applyOptions({
      scaleMargins: { top: MACD_TOP, bottom: MACD_BOTTOM },
      visible: true,
      borderColor: subBorderColor(isDark),
    });

    // ── ResizeObserver ────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width:  containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Update data when bars / ticker changes ────────────────────────────────
  useEffect(() => {
    if (!candleRef.current || !volRef.current || bars.length === 0) return;

    // Indicators are always computed from daily bars.
    // Fall back to displayed bars only if daily bars aren't loaded yet.
    const srcBars = (dailyBars && dailyBars.length > 0) ? dailyBars : bars;
    const closes  = srcBars.map((b) => b.close);
    const ind     = computeIndicators(closes);

    // Build date→index lookup for daily bars so we can map indicator values
    // onto whichever timeframe is currently displayed.
    const dailyDates = srcBars.map((b) => b.time);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = (b: OHLCVBar) => b.time as any;

    candleRef.current.setData(
      bars.map((b) => ({ time: t(b), open: b.open, high: b.high, low: b.low, close: b.close })),
    );
    volRef.current.setData(
      bars.map((b) => ({
        time: t(b), value: b.volume,
        color: b.close >= b.open ? 'rgba(0,212,170,0.35)' : 'rgba(255,77,77,0.35)',
      })),
    );

    // Map each display bar to the nearest daily indicator value (on or before that date).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toLine = (vals: (number | null)[]): any[] =>
      bars.map((b) => {
        const di = findDailyIndex(dailyDates, b.time);
        if (di < 0) return null;
        const v = vals[di];
        return v !== null ? { time: t(b), value: v } : null;
      }).filter(Boolean);

    sma21Ref.current?.setData(toLine(ind.sma21));
    sma50Ref.current?.setData(toLine(ind.sma50));
    sma200Ref.current?.setData(toLine(ind.sma200));
    ema8Ref.current?.setData(toLine(ind.ema8));
    ema21Ref.current?.setData(toLine(ind.ema21));

    // RSI
    rsiRef.current?.setData(toLine(ind.rsi14));
    rsi50Ref.current?.setData(bars.map((b) => ({ time: t(b), value: 50 })));

    // MACD — map each MACD component through the same daily→display lookup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const macdKey = (key: 'macd' | 'signal'): any[] =>
      bars.map((b) => {
        const di = findDailyIndex(dailyDates, b.time);
        if (di < 0) return null;
        const m = ind.macd[di];
        return m[key] !== null ? { time: t(b), value: m[key] } : null;
      }).filter(Boolean);

    macdLineRef.current?.setData(macdKey('macd'));
    macdSignalRef.current?.setData(macdKey('signal'));
    macdHistRef.current?.setData(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bars.map((b) => {
        const di = findDailyIndex(dailyDates, b.time);
        if (di < 0) return null;
        const m = ind.macd[di];
        return m.histogram !== null
          ? {
              time: t(b),
              value: m.histogram,
              color: m.histogram >= 0 ? 'rgba(0,212,170,0.65)' : 'rgba(255,77,77,0.65)',
            }
          : null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }).filter(Boolean) as any[],
    );

    // Legend: last non-null daily indicator values
    setLegend({
      ema8:  lastNonNull(ind.ema8),
      ema21: lastNonNull(ind.ema21),
      sma21: lastNonNull(ind.sma21),
      sma50: lastNonNull(ind.sma50),
      sma200:lastNonNull(ind.sma200),
      rsi14: lastNonNull(ind.rsi14),
    });

    chartRef.current?.timeScale().fitContent();
  }, [bars, dailyBars]);

  // ── Update theme when isDark changes ──────────────────────────────────────
  useEffect(() => {
    const c = chartRef.current;
    if (!c) return;
    c.applyOptions({
      layout: isDark ? darkLayout() : lightLayout(),
      grid:   gridColors(isDark),
      rightPriceScale: { borderColor: borderColor(isDark) },
      timeScale:        { borderColor: borderColor(isDark) },
    });
    try { c.priceScale('rsi').applyOptions({ borderColor: subBorderColor(isDark) }); }  catch { /* */ }
    try { c.priceScale('macd').applyOptions({ borderColor: subBorderColor(isDark) }); } catch { /* */ }
    rsi50Ref.current?.applyOptions({ color: midlineColor(isDark) });
  }, [isDark]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {/* MA / RSI legend — top-left overlay */}
      <div className="absolute top-2 left-2 flex flex-col gap-[3px] pointer-events-none z-10 select-none">
        {(
          [
            { key: 'ema8'  as const, label: 'EMA 8',   color: MA.ema8   },
            { key: 'ema21' as const, label: 'EMA 21',  color: MA.ema21  },
            { key: 'sma21' as const, label: 'SMA 21',  color: MA.sma21  },
            { key: 'sma50' as const, label: 'SMA 50',  color: MA.sma50  },
            { key: 'sma200'as const, label: 'SMA 200', color: MA.sma200 },
          ]
        ).map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-3.5 shrink-0" style={{ height: 1, backgroundColor: color }} />
            <span className="font-mono text-[10px] leading-none" style={{ color }}>
              {label} <span className="opacity-75">{fmt(legend[key])}</span>
            </span>
          </div>
        ))}
        {legend.rsi14 !== null && (
          <div className="flex items-center gap-1.5 mt-px">
            <div className="w-3.5 shrink-0" style={{ height: 1, backgroundColor: MA.rsi }} />
            <span className="font-mono text-[10px] leading-none" style={{ color: MA.rsi }}>
              RSI 14 <span className="opacity-75">{fmt(legend.rsi14, 1)}</span>
            </span>
          </div>
        )}
      </div>

      {/* Sub-pane labels — positioned at the top of each sub-pane */}
      <div
        className="absolute left-1.5 font-mono text-[9px] pointer-events-none z-10 select-none"
        style={{ top: `${RSI_TOP * 100}%`, color: MA.rsi, opacity: 0.45 }}
      >
        RSI 14
      </div>
      <div
        className="absolute left-1.5 font-mono text-[9px] pointer-events-none z-10 select-none"
        style={{ top: `${MACD_TOP * 100}%`, color: MA.macdL, opacity: 0.45 }}
      >
        MACD
      </div>
    </div>
  );
}
