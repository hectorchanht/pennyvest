---
phase: 03-live-data-charts-and-ai
plan: "01"
subsystem: infra
tags: [upstash, redis, recharts, yahoo-finance2, ai-sdk, zod, typescript, caching]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: server-only import boundary pattern established in lib/data/
  - phase: 02-static-pages
    provides: existing Allocation and Strategy type definitions in lib/strategies/types.ts

provides:
  - PriceData, EquityPoint, PriceResponse, EquityResponse type definitions
  - RawNewsItem, NewsAnalysis, NewsItem, NewsResponse type definitions
  - Upstash Redis cache wrapper (withCache) with graceful degradation
  - TTL constants for prices (5m), news (30m), aiAnalysis (1h), equity (24h)
  - All Phase 3 npm packages installed (recharts, yahoo-finance2, @upstash/redis, ai, @ai-sdk/openai, zod)
  - .env.local.example updated with MARKETAUX_API_KEY and COINGECKO_API_KEY

affects:
  - 03-02 (prices and equity adapters use PriceData/EquityPoint types and withCache)
  - 03-03 (news adapter uses NewsItem/NewsResponse types and withCache)
  - 03-04 (AI analysis pipeline uses NewsAnalysis type and withCache TTL.aiAnalysis)
  - 03-05 (charts use EquityPoint from prices.ts and recharts)

# Tech tracking
tech-stack:
  added:
    - recharts 3.8.1
    - yahoo-finance2 3.14.0
    - "@upstash/redis 1.37.0"
    - ai 6.0.138
    - "@ai-sdk/openai 3.0.48"
    - zod 4.3.6
  patterns:
    - withCache generic wrapper pattern — all data adapters use (key, ttlSeconds, fn) signature
    - Graceful Redis degradation — catch/warn on read and write failures, always return fresh data
    - server-only boundary — cache.ts imports 'server-only' matching lib/data/ convention

key-files:
  created:
    - src/types/prices.ts
    - src/types/news.ts
    - src/lib/data/cache.ts
  modified:
    - package.json
    - pnpm-lock.yaml
    - .env.local.example

key-decisions:
  - "withCache returns { data, cachedAt } so consumers can display cache timestamps (per D-14, COMP-04)"
  - "Cache degrades gracefully on Redis failures — logs warning, fetches fresh data, never throws"
  - "TTL values match D-12 decisions: prices=5m, news=30m, aiAnalysis=1h, equity=24h"

patterns-established:
  - "Cache wrapper pattern: withCache<T>(key, ttlSeconds, fn) used by all data adapters"
  - "All lib/data/ files must begin with import 'server-only'"

requirements-completed: [DATA-02, NEWS-04, COMP-04]

# Metrics
duration: 1min
completed: 2026-03-26
---

# Phase 03 Plan 01: Foundation — Dependencies, Types, and Cache Summary

**Installed 6 Phase 3 npm packages, defined shared TypeScript types for prices/news/equity, and built an Upstash Redis withCache wrapper with TTL constants and graceful degradation**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-26T17:11:26Z
- **Completed:** 2026-03-26T17:12:30Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- All 6 Phase 3 npm packages installed: recharts, yahoo-finance2, @upstash/redis, ai, @ai-sdk/openai, zod
- Created `src/types/prices.ts` and `src/types/news.ts` with all required type exports
- Created `src/lib/data/cache.ts` — generic Redis cache wrapper that gracefully degrades if Redis is unavailable
- Updated `.env.local.example` with MARKETAUX_API_KEY and COINGECKO_API_KEY placeholders

## Task Commits

Each task was committed atomically:

1. **Task 1: Install npm dependencies and create shared type definitions** - `905f6c5` (feat)
2. **Task 2: Create Upstash Redis cache wrapper and update env template** - `10247d6` (feat)

**Plan metadata:** (docs commit — see final commit)

## Files Created/Modified

- `src/types/prices.ts` — PriceData, EquityPoint, PriceResponse, EquityResponse interfaces
- `src/types/news.ts` — RawNewsItem, NewsAnalysis, NewsItem, NewsResponse interfaces
- `src/lib/data/cache.ts` — withCache generic function and TTL constants with server-only boundary
- `package.json` — 6 new dependencies added
- `pnpm-lock.yaml` — lockfile updated
- `.env.local.example` — MARKETAUX_API_KEY and COINGECKO_API_KEY added

## Decisions Made

- `withCache` returns `{ data, cachedAt }` so downstream consumers can display cache timestamps as specified in D-14/COMP-04
- Cache wrapper catches both read and write Redis failures separately, logging warnings and returning fresh data — never throws
- TTL constants defined as `as const` for TypeScript literal type narrowing

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

TypeScript errors from running `tsc --noEmit` on a single file (cache.ts) in isolation — errors originated in `@upstash/redis` type definitions themselves, not in project code. Project-wide `pnpm tsc --noEmit` passes cleanly.

## User Setup Required

None - no external service configuration required. API keys and Redis credentials are already in `.env.local.example` — users will configure them in a later setup phase.

## Next Phase Readiness

- All Phase 3 npm packages installed and available
- Shared type definitions ready for data adapter plans (03-02, 03-03, 03-04)
- Cache wrapper ready for use in all data-fetching Route Handlers
- No blockers for Phase 3 continuation

---
*Phase: 03-live-data-charts-and-ai*
*Completed: 2026-03-26*

## Self-Check: PASSED

- FOUND: src/types/prices.ts
- FOUND: src/types/news.ts
- FOUND: src/lib/data/cache.ts
- FOUND: .env.local.example
- FOUND: .planning/phases/03-live-data-charts-and-ai/03-01-SUMMARY.md
- COMMIT 905f6c5 verified (Task 1)
- COMMIT 10247d6 verified (Task 2)
