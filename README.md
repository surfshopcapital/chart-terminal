# Chart Terminal

A fast, keyboard-driven chart flashcard terminal for macro + equity review (Druckenmiller-style). Flip through a curated universe of ~200 tickers, rate them 1–9, take persistent notes, and track daily progress with streaks.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind 4
- **TradingView Lightweight Charts v5** — candlesticks, volume, SMA/EMA overlays
- **Yahoo Finance** via `yahoo-finance2` — free OHLCV + quotes
- **Prisma 7** + **PostgreSQL** (Railway)
- **Zustand** — client state (ticker index, timeframe, session)
- **SWR** — data fetching with aggressive caching + prefetch

---

## Local Development

### 1. Prerequisites

- Node 20+
- A PostgreSQL database (local or Railway)

### 2. Environment

```bash
cp .env.example .env
# Fill in DATABASE_URL
```

### 3. Database

```bash
# Create tables
npm run db:push

# Seed the ~200 ticker universe
npm run db:seed
```

### 4. Run

```bash
npm run dev
# → http://localhost:3000  (redirects to /terminal)
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `← →` | Previous / Next ticker |
| `↑ ↓` | Switch timeframe (D → W → M) |
| `1–9` | Set interest rating |
| `N` | Focus notes |
| `Enter` | Mark reviewed |
| `/` | Open ticker search |
| `Esc` | Close modal |

---

## Chart Indicators

All computed client-side from raw OHLCV arrays (no extra API calls):

- **SMA**: 21 (blue), 50 (amber), 200 (pink)
- **EMA**: 8 (lime), 21 (cyan)
- **Volume** histogram (green/red, 18% of chart height)

RSI and MACD values are computed via `lib/indicators/compute.ts` and available to extend.

---

## Project Structure

```
app/
  terminal/page.tsx     # Main flashcard view (server fetches ticker list)
  history/page.tsx      # Session history + calendar + streak
  api/                  # Route handlers: ohlcv, quote, tickers, notes, ratings, sessions
components/
  terminal/             # FlashcardShell, ChartPane, InfoPanel, TopBar, …
  history/              # SessionCalendar, SessionList, StreakBadge
lib/
  db.ts                 # Prisma singleton
  cache.ts              # LRU cache for OHLCV (1h TTL) + quotes (5m TTL)
  indicators/           # SMA, EMA, RSI, MACD — pure functions
  market-data/          # IMarketDataProvider interface + Yahoo adapter
store/                  # Zustand: terminalStore, sessionStore
hooks/                  # useOHLCV, useQuote, useKeyboardNav, useSession, useTheme
prisma/
  schema.prisma
  seed/                 # ~200 tickers across FX, indexes, rates, commodities, sectors
```

---

## Railway Deployment

1. Create a new Railway project
2. Add a **PostgreSQL** plugin — Railway injects `DATABASE_URL` automatically
3. Connect your GitHub repo
4. Railway uses `railway.toml` — build runs `prisma generate && next build`, start runs `next start`
5. After first deploy, run the seed once via Railway shell:
   ```bash
   npm run db:seed
   ```

---

## Swapping Market Data Provider

All market data goes through `lib/market-data/types.ts → IMarketDataProvider`. To swap Yahoo for Polygon, Tiingo, etc.:

1. Implement the interface in `lib/market-data/polygon.ts`
2. Change the export in `lib/market-data/index.ts`
3. Done — no other files change.

---

## Future Phases

- Options chains tab (IV, greeks, OI)
- Kalshi markets tab
- Polymarket tab
- Multi-user auth
