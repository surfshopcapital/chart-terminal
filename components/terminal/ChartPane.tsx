'use client';

import { useEffect, useRef } from 'react';
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
  isDark: boolean;
}

type LineSeriesRef = ReturnType<IChartApi['addSeries']>;

function darkLayout() {
  return {
    background: { color: '#0a0a0a' },
    textColor: '#666666',
  };
}

function lightLayout() {
  return {
    background: { color: '#f5f5f5' },
    textColor: '#888888',
  };
}

function gridColors(dark: boolean) {
  return dark
    ? { vertLines: { color: '#1a1a1a' }, horzLines: { color: '#1a1a1a' } }
    : { vertLines: { color: '#e8e8e8' }, horzLines: { color: '#e8e8e8' } };
}

function borderColor(dark: boolean) {
  return dark ? '#262626' : '#e0e0e0';
}

export function ChartPane({ bars, isDark }: ChartPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<LineSeriesRef | null>(null);
  const volRef = useRef<LineSeriesRef | null>(null);
  const sma21Ref = useRef<LineSeriesRef | null>(null);
  const sma50Ref = useRef<LineSeriesRef | null>(null);
  const sma200Ref = useRef<LineSeriesRef | null>(null);
  const ema8Ref = useRef<LineSeriesRef | null>(null);
  const ema21Ref = useRef<LineSeriesRef | null>(null);

  // Init chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: isDark ? darkLayout() : lightLayout(),
      grid: gridColors(isDark),
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: borderColor(isDark) },
      timeScale: { borderColor: borderColor(isDark), timeVisible: false },
    });

    chartRef.current = chart;

    candleRef.current = chart.addSeries(CandlestickSeries, {
      upColor: '#00d4aa',
      downColor: '#ff4d4d',
      borderVisible: false,
      wickUpColor: '#00d4aa',
      wickDownColor: '#ff4d4d',
    });

    volRef.current = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });
    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });

    sma21Ref.current = chart.addSeries(LineSeries, {
      color: '#4488ff',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    sma50Ref.current = chart.addSeries(LineSeries, {
      color: '#ffaa00',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    sma200Ref.current = chart.addSeries(LineSeries, {
      color: '#ff4488',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    ema8Ref.current = chart.addSeries(LineSeries, {
      color: '#88ff44',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    ema21Ref.current = chart.addSeries(LineSeries, {
      color: '#44ffdd',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
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

  // Update data when bars change
  useEffect(() => {
    if (!candleRef.current || !volRef.current || bars.length === 0) return;

    const closes = bars.map((b) => b.close);
    const ind = computeIndicators(closes);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = (b: OHLCVBar) => b.time as any;

    candleRef.current.setData(
      bars.map((b) => ({
        time: t(b),
        open: b.open,
        high: b.high,
        low: b.low,
        close: b.close,
      })),
    );

    volRef.current.setData(
      bars.map((b) => ({
        time: t(b),
        value: b.volume,
        color: b.close >= b.open ? 'rgba(0,212,170,0.4)' : 'rgba(255,77,77,0.4)',
      })),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toLine = (vals: (number | null)[]): any[] =>
      vals
        .map((v, i) => (v !== null ? { time: t(bars[i]), value: v } : null))
        .filter(Boolean);

    sma21Ref.current?.setData(toLine(ind.sma21));
    sma50Ref.current?.setData(toLine(ind.sma50));
    sma200Ref.current?.setData(toLine(ind.sma200));
    ema8Ref.current?.setData(toLine(ind.ema8));
    ema21Ref.current?.setData(toLine(ind.ema21));

    chartRef.current?.timeScale().fitContent();
  }, [bars]);

  // Update theme when isDark changes
  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.applyOptions({
      layout: isDark ? darkLayout() : lightLayout(),
      grid: gridColors(isDark),
      rightPriceScale: { borderColor: borderColor(isDark) },
      timeScale: { borderColor: borderColor(isDark) },
    });
  }, [isDark]);

  return <div ref={containerRef} className="w-full h-full" />;
}
