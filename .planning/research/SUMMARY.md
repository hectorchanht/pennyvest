# Project Research Summary

**Project:** Pennyvest — Bilingual AI-powered investment information platform
**Domain:** Fintech education / investment information (view-only, no accounts)
**Researched:** 2026-03-26
**Confidence:** MEDIUM

## Executive Summary

Pennyvest is a view-only, bilingual (English / Traditional Chinese) investment information platform that presents 4 themed portfolio strategies with AI-powered news impact analysis. Unlike Wealthfront or Betterment, it has no user accounts, no real-money transactions, and no user-configurable backtesting — its competitive differentiation is the combination of curated beginner-friendly strategy narratives, real-time news analysis tied directly to strategy allocations, and native bilingual support for the HK retail audience. Experts building this class of product use Next.js App Router with server components for fast SSR, aggressive server-side caching to stay within free-tier API limits, and a strict separation between server-only API routes (which hold credentials) and client components (which only render).

The recommended approach is a Next.js 16 fullstack app with next-intl for bilingual routing from day one, Recharts for equity and allocation charts, Vercel AI SDK with GPT-4o-mini for news analysis, and Upstash Redis as the shared cache backend. Strategy definitions live as static TypeScript config — no database — keeping infrastructure minimal. External data flows through three server-side API routes (/api/prices, /api/news, /api/strategy) each with independent TTLs, preventing a monolithic cache invalidation problem. The AI analysis pipeline is downstream of news fetching and caches at a 1-hour TTL to control LLM costs.

The three highest risks are: (1) Yahoo Finance unofficial API breakage causing silent data staleness — mitigated by mandatory try/catch with last-known-good cache fallbacks and a "last updated" timestamp in every price display; (2) AI hallucination in financial news summaries creating trust or legal damage — mitigated by extractive-only prompts that prohibit fabricating figures not present in the source article; and (3) inadequate disclaimer placement triggering HK SFC scrutiny — mitigated by placing the disclaimer above the fold on every strategy page and making it bilingual with legally equivalent text. These three pitfalls have HIGH recovery cost if addressed post-launch and LOW cost if built in from the start.

---

## Key Findings

### Recommended Stack

The stack centers on Next.js 16 (App Router) with React 19 and TypeScript 6. Tailwind CSS v4 and shadcn/ui provide the component layer without fighting bilingual layouts. The AI layer uses Vercel AI SDK (ai@6) over the OpenAI provider — the abstraction is worth it because it allows swapping to Claude Haiku 3.5 or Gemini Flash without refactoring application code. Recharts 3 handles all v1 chart needs (equity curves, allocation pies) and is SSR-safe, unlike TradingView's canvas-based lightweight-charts. Key version compatibility flag: Zod 4.x has breaking changes from v3; verify generateObject schema syntax works with AI SDK 6.x before building the AI pipeline.

**Core technologies:**
- Next.js 16 / React 19: Full-stack framework — App Router RSC + API routes in one codebase
- TypeScript 6: Type safety for nullable financial data fields (high-stakes transforms)
- next-intl 4: Bilingual App Router i18n — must be set up before any user-facing page
- Vercel AI SDK 6 + OpenAI: Structured LLM output for news impact analysis via generateObject
- yahoo-finance2 + coingecko-api-v3: Price data — server-side only, never client-exposed
- Recharts 3: SVG-based charts, SSR-safe, no canvas complexity for v1
- Upstash Redis: Shared serverless cache for multi-instance deployments
- Zod 4: Schema validation for AI structured outputs and incoming API data

See `.planning/research/STACK.md` for full version table and installation commands.

### Expected Features

Users arrive at a fintech information platform expecting visual allocation breakdowns, performance history, and clear risk signals. The product earns trust through freshness (live prices with timestamps), transparency (simulated labels on charts), and legal clarity (prominent disclaimers). The AI news analysis and bilingual support are the two features that justify building Pennyvest rather than pointing users to Morningstar — no competitor ties real-time news directly to per-strategy allocation impact in Traditional Chinese.

**Must have (table stakes):**
- Asset allocation breakdown chart — every portfolio product shows this; text-only feels untrustworthy
- Simulated performance chart (equity curve) — users need "how has this done?" before engaging
- Risk level indicator (Low/Medium/High badge) — beginner-essential before reading further
- Strategy rationale copy (bilingual) — differentiates from a plain ticker list
- Constituent list with current prices — freshness signal; builds trust
- Legal disclaimer ("not financial advice") above the fold — mandatory for HK SFC compliance
- Mobile-responsive layout — non-negotiable; >60% of finance browsing is mobile
- Landing page with 4 strategy entry points

**Should have (competitive differentiators):**
- Real-time news with AI impact analysis per strategy — no competitor does this for beginners
- Bilingual EN / zh-HK UI from day one — underserved HK audience; retrofitting i18n is expensive
- Thematic strategy framing (not risk-score buckets) — "Future Tech" is more approachable than "Moderate Portfolio"

**Defer to v1.x:**
- Email newsletter / digest
- Shareable OG social cards
- Expanded 7-day news history

**Defer to v2+:**
- User accounts and saved portfolios
- Paper trading simulator
- Push notifications / alerts
- Portfolio comparison screener

See `.planning/research/FEATURES.md` for full prioritization matrix and competitor analysis.

### Architecture Approach

The architecture separates concerns across three clear layers: static config (strategy definitions as TypeScript), server-side service modules (data adapters, AI analyzer, cache wrappers in `src/lib/`), and client components (charts, news feed) that consume data via `/api/*` route handlers. Strategy pages are React Server Components that render all layout and static content server-side, passing data as props to client-side chart components. No database is needed for v1 — strategies are TypeScript config files, edited via code deployment. The cache-aside pattern with TTL tiers (prices 5 min, news 30 min, AI analysis 1 hr, strategy config static) is the primary cost-control and reliability mechanism.

**Major components:**
1. Strategy Pages (RSC) — fetch static config + cached prices server-side; pass to client chart components
2. Route Handlers (/api/prices, /api/news, /api/strategy) — own all external API credentials and caching; each has independent TTL
3. Data Pipeline Services (src/lib/data/) — per-vendor adapters (Yahoo Finance, CoinGecko, NewsAPI) with error handling
4. AI Analysis Service (src/lib/ai/) — prompt templates + structured LLM output; downstream of news fetch
5. Content Service (src/lib/strategies/) — static TypeScript strategy registry; source of truth for allocations, tickers, risk levels
6. Cache Layer (src/lib/cache/) — unstable_cache wrappers for v1; swap to Upstash Redis when scaling past single instance
7. Chart Components (components/charts/) — "use client" Recharts components; must use dynamic() with ssr:false

The architecture research defines a concrete build order (i18n → strategy config → static pages → data pipeline → charts → news → AI analysis → polish) driven by component dependencies. See `.planning/research/ARCHITECTURE.md` for full data flow diagrams, anti-patterns, and code examples.

### Critical Pitfalls

1. **Yahoo Finance unofficial API breakage** — wrap every call in try/catch with last-cached fallback; add "last updated" timestamp to all price displays; treat the library as best-effort from day one, not day two
2. **AI hallucination in financial news analysis** — use extractive-only prompts ("summarize what this article says, do not add information not present"); pass full article text and actual allocation weights in context; prohibit fabricated numbers explicitly in system prompt; link every AI summary to source article
3. **Simulated performance charts misrepresented as real returns** — "Simulated back-test" label must be in the chart title, not just footnote; methodology note inline; green/red gain framing must always include simulated qualifier; this is both a trust and HK SFC compliance issue
4. **Missing/inadequate financial disclaimer placement** — disclaimer above fold on every strategy page in both languages; bilingual disclaimer must be legally equivalent (not shortened); assertive language in copy or AI-generated rationale is a regulatory red flag
5. **Traditional Chinese locale errors (zh-CN instead of zh-HK)** — set locale to zh-HK explicitly in i18n config from first commit; establish financial terminology glossary before translation begins; native HK reader must review ALL pages before launch — AI translation tools default to Simplified Chinese

See `.planning/research/PITFALLS.md` for full pitfall list, security mistakes, and "looks done but isn't" checklist.

---

## Implications for Roadmap

Research identifies clear dependency chains that dictate phase ordering. i18n routing must exist before any page is built. Strategy config must exist before any data fetching is built. Caching must be built alongside the first API route, not bolted on later. AI analysis is the last backend component because it depends on news fetching and is the most expensive to run iteratively.

### Phase 1: Foundation — i18n, Routing, and Strategy Config

**Rationale:** The `[locale]` App Router segment is a prerequisite for every page. Strategy TypeScript config is the "data model" everything else reads from. Both must exist before any other work is possible. This phase also establishes correct locale codes (zh-HK), project structure, and API key secret hygiene — pitfalls that are impossible to retrofit cheaply.
**Delivers:** Next.js project scaffold with bilingual routing, 4 strategy config files, placeholder message files in EN and zh-HK, environment variable setup (no NEXT_PUBLIC_ API keys), ESLint/TypeScript/Tailwind configured.
**Addresses:** Mobile-responsive layout foundation, bilingual UI requirement, legal disclaimer component (static)
**Avoids:** zh-CN locale error (set zh-HK from first commit), API key exposure (enforce server-only env vars from day one), i18n retrofit cost

### Phase 2: Static Pages — Landing and Strategy Layout

**Rationale:** Build the visual skeleton with only static data before adding any external API complexity. This proves routing, i18n, and layout work correctly and produces a deployable artifact early.
**Delivers:** Landing page with 4 strategy links, strategy page layout with all sections (allocation table, risk badge, rationale text, performance chart placeholder, news feed placeholder), all in both languages.
**Uses:** next-intl, shadcn/ui components, Tailwind CSS, Recharts with static mock data
**Implements:** Content Service (strategy registry), RSC page pattern, i18n data flow
**Avoids:** Wrapping every page in "use client" (keep pages as RSC), one monolithic endpoint (separate route structure established here)

### Phase 3: Data Pipeline — Prices and Caching

**Rationale:** External API integrations with caching must be established before charts render real data. Cache-aside pattern must be in place before UI is built on top — retrofitting is painful and the most common cause of rate-limit failures.
**Delivers:** /api/prices/[strategy] route handler with Yahoo Finance and CoinGecko adapters, TTL caching (stock 5 min, crypto 2 min), try/catch with last-known-good fallback, "last updated" timestamp, batch CoinGecko calls.
**Uses:** yahoo-finance2, coingecko-api-v3, Upstash Redis (or unstable_cache for v1), @tanstack/react-query for client polling
**Implements:** Data Pipeline Service, Cache Layer, Route Handler pattern
**Avoids:** N+1 API calls (batch tickers), rate limit cascade failures (server cache before any UI renders), Yahoo Finance silent breakage (fallback + staleness indicator)

### Phase 4: Charts and Visual Components

**Rationale:** Chart components depend on real price data from Phase 3. Building charts with real data immediately surfaces normalization issues and chart scaling decisions (downsampling historical data, Y-axis baseline).
**Delivers:** AllocationChart (pie/bar), EquityCurve (line chart with "Simulated back-test" label mandatory in title), RiskBadge, skeleton loading states for all data-dependent components, error fallback states.
**Uses:** Recharts 3, shadcn/ui Card + Badge + Skeleton, dynamic() with ssr:false for chart components
**Implements:** Chart Components layer, loading/error state pattern
**Avoids:** Simulated chart misrepresentation (label in title, not footnote), no loading/error states (skeleton + fallback required for sign-off)

### Phase 5: News Fetching

**Rationale:** News integration must be validated independently before AI analysis is added on top. Validating news API quota, caching (30 min TTL), and error handling in isolation makes the AI phase faster and cheaper.
**Delivers:** /api/news/[strategy] route handler, news feed client component, NewsAPI integration with caching, keyword-scoped news per strategy, error fallback state.
**Uses:** newsapi, Upstash Redis cache
**Implements:** News data adapter, NewsFeed component
**Avoids:** LLM call blocking page render (news loads independently before AI layer is added), rate limit exhaustion (30 min cache before any LLM costs)

### Phase 6: AI Analysis Integration

**Rationale:** AI analysis is last in the backend sequence because it depends on news data (Phase 5), is the most expensive component to run iteratively, and requires the most prompt engineering discipline. Building it last means the rest of the product is already working when prompts are tuned.
**Delivers:** AI Analysis Service (src/lib/ai/), extractive prompts with hallucination guardrails, structured output via generateObject + Zod schema, 1-hour cache for analysis results, ImpactBadge component, source article link on every AI summary, system prompt constraining financial figures to source-only.
**Uses:** Vercel AI SDK 6, @ai-sdk/openai, Zod 4, Upstash Redis
**Implements:** AI Analysis Service, prompt templates per strategy
**Avoids:** AI hallucination (extractive prompts, no fabricated numbers), LLM prompt injection (sanitize news input), AI output rendered as HTML/XSS (plain text only), unbounded LLM tokens (150–250 token max on completions)

### Phase 7: Polish, Compliance, and Performance

**Rationale:** Final phase addresses legal compliance, SEO, performance audit, and the "looks done but isn't" checklist from pitfalls research. These are easier to audit systematically once all features are built.
**Delivers:** Prominent bilingual disclaimers above fold on every strategy page (HK SFC language), meta tags and Open Graph images, Lighthouse performance audit, native HK Traditional Chinese reader review pass, financial terminology glossary finalized, rate limiting on own API routes, "looks done but isn't" checklist sign-off.
**Avoids:** Missing disclaimer (above fold, bilingual, legally equivalent), zh-CN vs zh-HK content errors (native speaker QA), Simulated chart labeling (final audit), API key exposure audit (no NEXT_PUBLIC_ API keys)

---

### Phase Ordering Rationale

- **i18n first** because next-intl's [locale] segment wraps all pages; adding it after pages are built is a significant structural change
- **Strategy config before data fetching** because the price and news routes need the strategy's ticker list and keywords to know what to fetch
- **Cache layer co-built with first API route** because the most common failure mode is building the API integration, then adding cache "later" — later never happens before launch
- **Charts after data pipeline** to avoid building with mock data that masks normalization problems
- **News before AI** because the AI route depends on news data and building them together makes debugging harder
- **AI last** because prompt engineering is iterative and expensive; all other features work independently of it

---

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Data Pipeline):** Yahoo Finance unofficial API — verify yahoo-finance2 3.x historical price method signatures before writing adapters; consider current library status given breakage history
- **Phase 6 (AI Analysis):** Verify Zod 4.x compatibility with Vercel AI SDK 6.x generateObject before building schema definitions — breaking changes documented but exact impact unconfirmed
- **Phase 7 (Compliance):** HK SFC digital investment platform guidance — verify current SFC circulars on educational platforms; training data knowledge may be outdated for regulatory specifics
- **Phase 1 (Foundation):** next-intl 4.x peer dependency on Next.js 16 — verify changelog before installing; App Router integration patterns may have changed

Phases with standard patterns (research-phase likely not needed):
- **Phase 2 (Static Pages):** Next.js App Router RSC + Tailwind + shadcn/ui is extremely well-documented; no novel patterns
- **Phase 4 (Charts):** Recharts 3 + dynamic() SSR pattern is well-established
- **Phase 5 (News Fetching):** NewsAPI integration + Redis caching is a standard pattern; no novel integration challenges

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Package versions verified via npm registry; API capabilities and compatibility notes from training data (Aug 2025 cutoff). Three explicit flags need verification before implementation: Zod 4/AI SDK 6 compatibility, next-intl 4/Next.js 16 peer deps, yahoo-finance2 3.x API surface. |
| Features | MEDIUM | Competitor feature analysis from training knowledge (mid-2025); core table stakes are stable and well-established but live competitor UIs should be spot-checked. MVP scope is well-reasoned from project constraints. |
| Architecture | HIGH | Next.js App Router patterns are stable and extensively documented. RSC/client boundary, cache-aside, and static config patterns are established. Specific unstable_cache behavior in Next.js 16 should be verified against official docs. |
| Pitfalls | MEDIUM-HIGH | Yahoo Finance breakage pattern is HIGH confidence (well-documented community history). LLM hallucination in financial contexts is HIGH confidence. HK SFC regulatory specifics are MEDIUM (verify current circulars). CoinGecko rate limits are MEDIUM (verify current free tier limits). |

**Overall confidence:** MEDIUM — sufficient for roadmap creation; verification flags should be resolved during Phase 1 and 3 planning before implementation begins.

### Gaps to Address

- **Zod 4 + AI SDK 6 compatibility:** Run a proof-of-concept generateObject call with a Zod 4 schema before committing to the AI pipeline design in Phase 6. If incompatible, downgrade to Zod 3 (AI SDK supports both).
- **HK SFC disclaimer language:** Engage a HK legal reviewer or research current SFC guidance on "educational" platform disclaimers before Phase 7 content is finalized. The consequence of getting this wrong is VERY HIGH recovery cost.
- **yahoo-finance2 3.x historical price methods:** Confirm the method signature for fetching historical OHLCV data before Phase 3 architecture is finalized. Library has had major breaking changes between versions.
- **next-intl 4.x / Next.js 16 compatibility:** Check next-intl changelog for peer dependency requirements against Next.js 16 before Phase 1 scaffold is built.
- **Traditional Chinese financial terminology glossary:** Must be created before Phase 2 content is written. Every HK-Chinese term (allocation, risk level, back-test, etc.) needs a canonical translation. This is an editorial dependency, not a technical one.

---

## Sources

### Primary (HIGH confidence)
- npm registry (`npm show [package] dist-tags`) — package versions for all libraries listed in STACK.md
- Next.js App Router documentation — RSC patterns, Route Handlers, unstable_cache (knowledge through Aug 2025)
- yahoo-finance2 / yfinance community issues — unofficial API breakage history (well-documented pattern)
- LLM hallucination in financial contexts — industry-wide documented pattern (multiple cases)
- i18n Traditional vs. Simplified Chinese locale conventions — established standard

### Secondary (MEDIUM confidence)
- CoinGecko API documentation — free tier rate limits and batch endpoint behavior (training knowledge; verify at docs.coingecko.com)
- NewsAPI.org — free tier limits (training knowledge; verify current plan limits)
- next-intl documentation — App Router i18n patterns (training knowledge; verify at next-intl.dev)
- Vercel AI SDK documentation — generateObject with Zod structured output (verify at sdk.vercel.ai/docs)
- Competitor feature analysis (Wealthfront, Betterment, Portfolio Visualizer, Morningstar) — training knowledge, mid-2025

### Tertiary (LOW confidence — verify before implementation)
- HK SFC guidance on unlicensed online investment advice — training knowledge; MUST verify current circulars at sfc.hk
- yahoo-finance2 3.x specific API method signatures — verify against current library README
- Zod 4.x breaking changes impact on AI SDK 6 generateObject — verify with a proof-of-concept before Phase 6 design

---
*Research completed: 2026-03-26*
*Ready for roadmap: yes*
