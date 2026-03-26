# Phase 3: Live Data, Charts, and AI - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire all external data sources into the static pages built in Phase 2. This includes: live asset prices (Yahoo Finance + CoinGecko), allocation charts (donut), simulated equity curves, news feed, and AI-powered impact analysis. Replaces ComingSoonCard placeholders with real data components. All data cached server-side via Upstash Redis. No user accounts, no real trading, no new pages — only data integration into existing pages.

</domain>

<decisions>
## Implementation Decisions

### Chart Types & Visuals
- **D-01:** Allocation breakdown displayed as a donut chart (circular with center hole showing total)
- **D-02:** Equity curve as a line chart showing simulated historical performance — labeled "Simulated back-test" in chart title (COMP-03 requirement from Phase 4, but label built in now)
- **D-03:** Chart library: Claude's discretion — must work with dark theme and be lightweight

### News & AI Analysis Display
- **D-04:** Each news item displayed as a card: headline, AI summary (2-3 sentences), colored impact badge (Bullish / Neutral / Bearish)
- **D-05:** Impact badge is color-coded: green=Bullish, gray=Neutral, red=Bearish
- **D-06:** News section replaces the "News — Coming Soon" ComingSoonCard placeholder on fund pages

### LLM Provider & Cost Control
- **D-07:** Start with free/cheapest option available, but keep provider-agnostic using Vercel AI SDK abstraction layer — must be easy to switch between providers (OpenAI, Anthropic, Groq, etc.)
- **D-08:** AI-generated content matches current UI language (decided in Phase 1) — single call per language, cached
- **D-09:** AI output cached in Upstash Redis — don't re-analyze the same article until cache expires (1hr TTL for AI analysis)

### Data Sources & Caching
- **D-10:** Yahoo Finance (via yahoo-finance2) for stock/ETF/commodity prices — server-side only
- **D-11:** CoinGecko free API for crypto prices — server-side only, crypto tickers already use CoinGecko-compatible IDs
- **D-12:** Upstash Redis for all caching (decided in Phase 1) — price cache TTL: 5 min, news cache: 30 min, AI analysis cache: 1 hr
- **D-13:** All API calls through Next.js Route Handlers (server-side) — never expose keys to client

### Data Freshness & Error States
- **D-14:** "Last updated" timestamp visible on every data section (prices, news)
- **D-15:** Loading skeletons (matching Phase 2 ComingSoonCard skeleton pattern) while data fetches
- **D-16:** Graceful error state with retry button when API fails — never show raw errors to users
- **D-17:** Stale data indicator if cache is older than 2× the normal TTL

### Claude's Discretion
- Chart library selection (Recharts, Chart.js, lightweight alternatives)
- Number of news articles per fund (balance API limits vs content)
- Equity curve data generation approach (static historical backtest vs computed)
- News API selection (NewsAPI, GNews, or alternative)
- Exact cache TTL tuning
- Error state visual design
- Stale data indicator design
- Whether to run Zod 4 + AI SDK compatibility POC as a separate spike or inline

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Data Layer
- `src/lib/data/server-guard.ts` — server-only import boundary (all new data fetchers MUST include `import 'server-only'`)
- `src/lib/strategies/types.ts` — Strategy, Allocation, AllocationProfile types
- `src/lib/strategies/index.ts` — getStrategyConfig(), getAllStrategies()
- `src/lib/strategies/profiles.ts` — getProfile(), getAllProfiles()
- `.env.local.example` — env var template (UPSTASH, OPENAI, NEWS_API placeholders)

### Components to Replace/Enhance
- `src/components/strategy/ComingSoonCard.tsx` — placeholder to replace with real chart/news components
- `src/components/strategy/HoldingsTable.tsx` — needs price column added
- `src/components/strategy/AllocationSidebar.tsx` — allocation data already rendered statically
- `src/app/[locale]/fund/[slug]/page.tsx` — fund page that renders all strategy components

### Research
- `.planning/research/ARCHITECTURE.md` — Route Handler patterns, cache layer design
- `.planning/research/STACK.md` — Package versions, API recommendations
- `.planning/research/PITFALLS.md` — Yahoo Finance breakage, AI hallucination, rate limits
- `.planning/research/FEATURES.md` — Feature priorities, anti-features

### Known Blockers (from STATE.md)
- yahoo-finance2 3.x historical price API — method signatures need confirmation
- Zod 4.x + AI SDK 6 generateObject — compatibility POC needed

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Strategy configs with real tickers (Yahoo Finance symbols) and CoinGecko IDs — ready for API lookups
- ComingSoonCard skeleton pattern — reusable for loading states
- server-guard.ts pattern — all new data modules follow same `import 'server-only'` convention
- shadcn/ui components (Card, Table, Skeleton, Badge, Tabs) — available for chart/news UI

### Established Patterns
- Server components by default — data fetching in RSC, client components only for interactivity
- Pre-translated strings passed as props from server to client components
- Async params pattern: `const { locale } = await params;`
- Tailwind v4 dark theme with brand color tokens

### Integration Points
- `fund/[slug]/page.tsx` — main integration point, currently renders ComingSoonCard placeholders
- New Route Handlers needed: `/api/prices/`, `/api/news/`, `/api/analysis/`
- `src/lib/data/` — new modules for price fetching, news fetching, AI analysis
- Message files need new keys for chart labels, error states, loading text

</code_context>

<specifics>
## Specific Ideas

- Provider-agnostic LLM setup via Vercel AI SDK — easy to switch between free/paid providers
- Start with cheapest available option, upgrade later as needed
- Impact badges (Bullish/Neutral/Bearish) are the visual hook for AI analysis — must be prominent
- Donut chart center could show fund name or risk level
- Equity curve should feel like a real trading platform chart (clean, minimal, dark theme)

</specifics>

<deferred>
## Deferred Ideas

- Real-time WebSocket price streaming — polling every 5 min is sufficient for v1
- User-configurable backtester — extremely high complexity, v2+
- Push notifications for major news — requires accounts (v2)
- Combined profile equity curve — nice-to-have, not in Phase 3 requirements

</deferred>

---

*Phase: 03-live-data-charts-and-ai*
*Context gathered: 2026-03-26*
