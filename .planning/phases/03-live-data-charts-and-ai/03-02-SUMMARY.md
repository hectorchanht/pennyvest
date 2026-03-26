---
phase: 03-live-data-charts-and-ai
plan: "02"
subsystem: api
tags: [yahoo-finance2, coingecko, marketaux, openai, ai-sdk, zod, caching, server-only]

# Dependency graph
requires:
  - phase: 03-live-data-charts-and-ai
    provides: withCache wrapper, TTL constants, PriceData/EquityPoint/RawNewsItem/NewsAnalysis types from plan 01

provides:
  - Yahoo Finance adapter with getPricesForStrategy and getHistoricalForStrategy
  - CoinGecko adapter with getCryptoPrices and getCryptoHistorical
  - Marketaux news adapter with getNewsForStrategy
  - AI analysis service (client, prompts, analyzer) with analyzeNewsItem producing bilingual NewsAnalysis
  - All adapters server-only guarded and Redis-cached with correct TTLs

affects:
  - 03-04 (Route Handlers will call these adapters directly)
  - 03-05 (equity curve data feeds charts)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - yahoo-finance2 v3 instance pattern — const yf = new YahooFinance() (NOT static call)
    - AI SDK v6 generateText + Output.object pattern (NOT generateObject which is deprecated)
    - maxOutputTokens parameter (NOT maxTokens) in AI SDK v6 generateText
    - CoinGecko optional API key via x-cg-demo-api-key header — works without key at lower rate limit
    - Cache keys include entity discriminators: prices:yahoo:{slug}, prices:coingecko:{slug}, ai:{uuid}:{locale}

key-files:
  created:
    - src/lib/data/yahoo-finance.ts
    - src/lib/data/coingecko.ts
    - src/lib/data/news.ts
    - src/lib/ai/client.ts
    - src/lib/ai/prompts.ts
    - src/lib/ai/analyzer.ts

key-decisions:
  - "yahoo-finance2 v3 is instance-based: const yf = new YahooFinance() — static methods are deprecated and throw"
  - "AI SDK v6 uses generateText + Output.object({ schema }) — generateObject is deprecated per research"
  - "maxOutputTokens (not maxTokens) is the correct parameter name in AI SDK v6 CallSettings"
  - "analyzeNewsItem returns null on AI failure (graceful degradation) — avoids cascading failures when OpenAI is unavailable"
  - "Cache keys include locale (ai:{uuid}:{locale}) — en and zh-HK analyses stored separately per D-08"
  - "CoinGecko historical uses /coins/{id}/ohlc with days=730, downsampled to weekly via 7-day bucket"
  - "Historical equity computation uses Map<string,Map<string,number>> to avoid TypeScript strict null issues with Record indexing"

patterns-established:
  - "AI analysis: generateText + Output.object({ schema: ZodSchema }) — do NOT use generateObject"
  - "All lib/ai/ files must begin with import 'server-only' (extends lib/data/ boundary to lib/ai/)"

requirements-completed: [DATA-01, DATA-03, NEWS-01, NEWS-02, NEWS-03, I18N-03]

# Metrics
duration: 8min
completed: 2026-03-27
---

# Phase 03 Plan 02: Data Adapters and AI Analysis Service Summary

**Yahoo Finance, CoinGecko, and Marketaux adapters + GPT-4o-mini AI news analysis pipeline with bilingual output (en/zh-HK) using AI SDK v6 generateText + Output.object**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-26T17:11:26Z
- **Completed:** 2026-03-27T00:00:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Built 3 data adapters (Yahoo Finance, CoinGecko, Marketaux) with correct TTLs and Redis caching via withCache
- Implemented CoinGecko OHLC-based equity curve with weekly downsampling and weighted portfolio returns
- Built AI analysis pipeline using AI SDK v6 generateText + Output.object with Zod schema, producing bilingual (en/zh-HK) structured NewsAnalysis
- All 6 modules follow server-only import boundary established in Plan 01

## Task Commits

Each task was committed atomically:

1. **Task 1: Yahoo Finance and CoinGecko data adapters** - `4c08213` (feat)
2. **Task 2: News adapter and AI analysis service** - `3ce9fdf` (feat)

**Plan metadata:** (docs commit — see final commit)

## Files Created/Modified

- `src/lib/data/yahoo-finance.ts` — getPricesForStrategy (stock/ETF quotes) and getHistoricalForStrategy (2yr weekly equity curve)
- `src/lib/data/coingecko.ts` — getCryptoPrices (coins/markets) and getCryptoHistorical (OHLC 730d downsampled weekly)
- `src/lib/data/news.ts` — getNewsForStrategy using top 3 non-crypto tickers from strategy, 30m cache
- `src/lib/ai/client.ts` — AI SDK provider config exporting gpt-4o-mini model (provider-swappable in one line)
- `src/lib/ai/prompts.ts` — buildSystemPrompt (locale-aware) and buildAnalysisPrompt template builders
- `src/lib/ai/analyzer.ts` — analyzeNewsItem with generateText + Output.object, 1h cache keyed by article UUID + locale, null on failure

## Decisions Made

- Used AI SDK v6 `generateText` with `output: Output.object({ schema })` instead of `generateObject` (deprecated per research/D-07)
- `maxOutputTokens` (not `maxTokens`) is the correct parameter name in AI SDK v6 — discovered via TypeScript error
- `analyzeNewsItem` returns `null` on error rather than throwing — graceful degradation per D-16 to prevent page crashes
- Cache key for AI analysis includes both article UUID and locale: `ai:{uuid}:{locale}` — ensures en and zh-HK analyses are cached separately per D-08

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Switched from `maxTokens` to `maxOutputTokens` in generateText**
- **Found during:** Task 2 (AI analyzer implementation)
- **Issue:** Plan specified `maxTokens: 280` but AI SDK v6 renamed the parameter to `maxOutputTokens`
- **Fix:** Changed `maxTokens` to `maxOutputTokens` — correct API per SDK type definitions
- **Files modified:** src/lib/ai/analyzer.ts
- **Verification:** TypeScript compiles cleanly after fix
- **Committed in:** 3ce9fdf (Task 2 commit)

**2. [Rule 1 - Bug] Used Map instead of Record for historical date lookups to satisfy strict null checks**
- **Found during:** Task 1 (yahoo-finance.ts and coingecko.ts)
- **Issue:** TypeScript strict mode flags `Record<string, V>[key]` as `V | undefined` — caused assignment type errors
- **Fix:** Used `Map<string, Map<string, number>>` with `.get()`/`.has()` for all date/bucket lookups
- **Files modified:** src/lib/data/yahoo-finance.ts, src/lib/data/coingecko.ts
- **Verification:** TypeScript compiles cleanly after fix
- **Committed in:** 4c08213 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 — type/API correctness)
**Impact on plan:** Both fixes required for TypeScript compilation. No functional scope change.

## Issues Encountered

TypeScript strict null checks with Record indexing — resolved by using Map instead of Record for date/bucket lookup tables. Pattern established for future adapters.

## User Setup Required

**External services require manual configuration:**

- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` — Upstash Console -> Create Database
- `OPENAI_API_KEY` — OpenAI Platform -> API Keys
- `MARKETAUX_API_KEY` — marketaux.com -> Sign up -> Dashboard -> API Token
- `COINGECKO_API_KEY` — coingecko.com -> Developer Dashboard (optional, works without at lower rate)

All vars documented in `.env.local.example`.

## Next Phase Readiness

- All 6 data/AI modules ready for Route Handlers (Plan 04)
- Yahoo Finance and CoinGecko adapters produce `{ data, cachedAt }` compatible with PriceResponse/EquityResponse types
- News adapter produces `{ data: RawNewsItem[], cachedAt }` ready for Plan 04 to merge with AI analysis
- AI analyzer produces `{ data: NewsAnalysis | null, cachedAt }` — null handled gracefully in Route Handler
- No blockers for Plan 03-03 (charts) or 03-04 (Route Handlers)

---
*Phase: 03-live-data-charts-and-ai*
*Completed: 2026-03-27*
