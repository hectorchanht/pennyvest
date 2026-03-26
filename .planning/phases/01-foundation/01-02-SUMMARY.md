---
phase: 01-foundation
plan: "02"
subsystem: data-layer
tags: [typescript, strategy, allocation, server-only, env-hygiene, nextjs]

# Dependency graph
requires:
  - phase: 01-01
    provides: "Next.js scaffold with bilingual i18n (en.json and zh-HK.json with strategies/profiles/riskLevel keys)"
provides:
  - "4 typed fund configs (future-tech, traditional, commodities, crypto) with ~6 holdings each"
  - "3 allocation profiles (conservative, balanced, aggressive) distributing weights across funds"
  - "Strategy registry with getStrategyConfig and getAllStrategies"
  - "Profile registry with getProfile and getAllProfiles"
  - "server-only boundary established in src/lib/data/"
  - ".env.local.example template committed for all Phase 3 env vars"
affects:
  - "02-static-pages — consumes getAllStrategies() and getAllProfiles() for fund/profile pages"
  - "03-live-data — uses server-only pattern in lib/data/ for all API data-fetchers"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Strategy registry pattern: Record<slug, Strategy> with typed get/getAll helpers"
    - "server-only import as a build-time firewall for lib/data/ files"
    - "Committed .env.local.example as env var documentation (no secrets)"

key-files:
  created:
    - src/lib/strategies/types.ts
    - src/lib/strategies/future-tech.ts
    - src/lib/strategies/traditional.ts
    - src/lib/strategies/commodities.ts
    - src/lib/strategies/crypto.ts
    - src/lib/strategies/index.ts
    - src/lib/strategies/profiles.ts
    - src/lib/data/server-guard.ts
    - .env.local.example
  modified:
    - .gitignore

key-decisions:
  - "Claude's discretion on tickers: NVDA, TSLA, ARKK, AMD, PLTR, MSTR for future-tech; JNJ, KO, JPM, PG, VNQ, O for traditional; GLD, USO, DBA, BHP, NEM, WEAT for commodities; BTC, ETH, SOL, LINK, AVAX, DOT (CoinGecko ids) for crypto"
  - "Crypto tickers use CoinGecko-compatible ids (e.g. bitcoin, ethereum) not exchange symbols"
  - ".gitignore updated to ignore .env* but explicitly allow .env.local.example via negation rule"
  - "Profile weights: conservative (traditional 40%, commodities 30%, future-tech 20%, crypto 10%), balanced (future-tech 30%, traditional 25%, commodities 25%, crypto 20%), aggressive (future-tech 35%, crypto 35%, commodities 15%, traditional 15%)"

patterns-established:
  - "Strategy fund config: each file exports a single const of type Strategy, imported and registered in index.ts"
  - "server-only guard: src/lib/data/server-guard.ts is the pattern anchor — all future lib/data/ files import 'server-only' at the top"
  - "Env var classification: API credentials = server-only (no prefix), analytics = NEXT_PUBLIC_ prefix"

requirements-completed:
  - DATA-04

# Metrics
duration: 3min
completed: 2026-03-26
---

# Phase 1 Plan 02: Strategy Configuration and Server-Only Pattern Summary

**Typed TypeScript strategy configs for 4 investment funds plus 3 allocation profiles, with server-only import boundary in lib/data/ and committed env var template for Phase 3 credentials**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-26T10:29:01Z
- **Completed:** 2026-03-26T10:32:01Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Created 4 typed Strategy fund configs (future-tech, traditional, commodities, crypto) each with ~6 holdings, risk levels, i18n keys, and weights summing to 1.0
- Created 3 AllocationProfile objects (conservative/balanced/aggressive) with weights across all 4 fund slugs summing to 1.0
- Established server-only import boundary in src/lib/data/ as pattern anchor for Phase 3 API data-fetchers
- Added .env.local.example with all Phase 3 env vars correctly classified (no API key uses NEXT_PUBLIC_ prefix)
- Full pnpm build passes with TypeScript strict mode

## Task Commits

Each task was committed atomically:

1. **Task 1: Create strategy types, fund configs, and allocation profiles** - `06a34c4` (feat)
2. **Task 2: Establish server-only pattern and env var hygiene** - `7a3c3f9` (feat)

## Files Created/Modified

- `src/lib/strategies/types.ts` - RiskLevel, AssetClass, Allocation, Strategy, AllocationProfile type definitions
- `src/lib/strategies/future-tech.ts` - High-risk tech fund: NVDA, TSLA, ARKK, AMD, PLTR, MSTR
- `src/lib/strategies/traditional.ts` - Low-risk stability fund: JNJ, KO, JPM, PG, VNQ, O
- `src/lib/strategies/commodities.ts` - Medium-risk commodities fund: GLD, USO, DBA, BHP, NEM, WEAT
- `src/lib/strategies/crypto.ts` - High-risk crypto fund: bitcoin, ethereum, solana, chainlink, avalanche-2, polkadot
- `src/lib/strategies/index.ts` - Registry: strategies Record, getStrategyConfig(), getAllStrategies()
- `src/lib/strategies/profiles.ts` - 3 profiles: conservative/balanced/aggressive, getProfile(), getAllProfiles()
- `src/lib/data/server-guard.ts` - server-only boundary anchor for lib/data/ directory
- `.env.local.example` - Committed template for Upstash, OpenAI, NewsAPI, GA env vars
- `.gitignore` - Updated to ignore .env* but allow .env.local.example

## Decisions Made

- Crypto tickers use CoinGecko-compatible ids (lowercase: bitcoin, ethereum, solana, chainlink, avalanche-2, polkadot) since Phase 3 will query CoinGecko
- .gitignore negation pattern `!.env.local.example` added after `.env*` glob to allow committing the template
- The comment line in .env.local.example contains "NEXT_PUBLIC_ prefix" text (harmless — only the actual env var `NEXT_PUBLIC_GA_MEASUREMENT_ID=` is a client-safe var)

## Deviations from Plan

None - plan executed exactly as written. One minor note: the .gitignore already had `.env*` (catching all env files), so we added the negation `!.env.local.example` rather than replacing the rule.

## Issues Encountered

None.

## User Setup Required

None at this stage. The .env.local file exists but all values are empty. Phase 3 will require signing up for Upstash Redis, OpenAI, and NewsAPI and filling in values.

## Next Phase Readiness

- Strategy configs are ready for Phase 2 static pages to consume via getAllStrategies() and getAllProfiles()
- server-only pattern is established and ready for Phase 3 data-fetchers to follow
- All i18n keys in strategy/profile configs match existing en.json and zh-HK.json keys

---
*Phase: 01-foundation*
*Completed: 2026-03-26*
