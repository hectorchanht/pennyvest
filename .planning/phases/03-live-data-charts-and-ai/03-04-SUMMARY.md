---
phase: 03-live-data-charts-and-ai
plan: "04"
subsystem: api
tags: [next.js, route-handlers, yahoo-finance, coingecko, marketaux, ai-sdk, i18n]

# Dependency graph
requires:
  - phase: 03-02
    provides: Yahoo Finance, CoinGecko, news, and AI analyzer adapters with withCache

provides:
  - GET /api/prices/[slug] — merged Yahoo Finance + CoinGecko prices with cachedAt
  - GET /api/equity/[slug] — merged stock + crypto historical equity curves with cachedAt
  - GET /api/news/[slug] — news articles with AI analysis for en and zh-HK locales

affects: [03-05, comp-04, client-components]

# Tech tracking
tech-stack:
  added: []
  patterns: [Route Handler GET with awaited params, Promise.allSettled for resilience]

key-files:
  created:
    - src/app/api/prices/[slug]/route.ts
    - src/app/api/equity/[slug]/route.ts
    - src/app/api/news/[slug]/route.ts
  modified: []

key-decisions:
  - "analyzeNewsItem returns { data, cachedAt } wrapper — news route extracts .data for analysis merge"
  - "equity mergeEquityCurves uses date superset with carry-forward for misaligned stock/crypto dates"
  - "Promise.allSettled for AI analysis ensures individual failures don't break news response"

patterns-established:
  - "Route Handler params: always { params }: { params: Promise<{ slug: string }> } with await"
  - "Error handling: try/catch with console.error and Response.json({ error }, { status: 503 })"
  - "Strategy validation: getStrategyConfig(slug) with 404 on missing strategy"

requirements-completed: [STRT-04, STRT-05, DATA-02]

# Metrics
duration: 1min
completed: 2026-03-26
---

# Phase 03 Plan 04: Route Handlers Summary

**Three Next.js 16 Route Handlers bridging server-side adapters to client components — prices, equity curves, and AI-analyzed news with bilingual locale support**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-26T17:22:24Z
- **Completed:** 2026-03-26T17:24:12Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- GET /api/prices/[slug] merges Yahoo Finance stock prices + CoinGecko crypto prices into a single keyed map with the earliest cachedAt timestamp
- GET /api/equity/[slug] merges stock and crypto historical equity curves by taking the superset of dates and carrying forward last known values for each source
- GET /api/news/[slug] fetches marketaux articles, runs parallel AI analysis via Promise.allSettled (individual failures degrade to null analysis), and accepts locale query param for bilingual output

## Task Commits

Each task was committed atomically:

1. **Task 1: Create prices and equity Route Handlers** - `4ec8b0a` (feat)
2. **Task 2: Create news Route Handler with AI analysis** - `0ff3be7` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/app/api/prices/[slug]/route.ts` — Merges getPricesForStrategy + getCryptoPrices, returns { prices, cachedAt }, 404/503 handling
- `src/app/api/equity/[slug]/route.ts` — Merges getHistoricalForStrategy + getCryptoHistorical via date superset, returns { curve, cachedAt }
- `src/app/api/news/[slug]/route.ts` — Fetches news, runs analyzeNewsItem in parallel, accepts locale param, returns { articles, cachedAt }

## Decisions Made

- `analyzeNewsItem` returns `{ data: NewsAnalysis | null; cachedAt: number }` (withCache wrapper) — news route must extract `.data` when merging into NewsItem objects
- Equity merge uses date superset with carry-forward (`lastStock`, `lastCrypto`) rather than only dates where both sources have data — avoids gaps in the chart
- `Promise.allSettled` chosen over `Promise.all` for AI analysis so a single article failure never breaks the entire news response (D-16 graceful degradation)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All three Route Handlers are ready for client components to fetch from
- cachedAt timestamps are present in all responses as required by COMP-04
- Locale-aware news analysis ready for bilingual UI integration (I18N-03)
- Route Handlers are ready for 03-05 (client components wiring)

---
*Phase: 03-live-data-charts-and-ai*
*Completed: 2026-03-26*
