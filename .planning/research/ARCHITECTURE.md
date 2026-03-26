# Architecture Research

**Domain:** AI-powered investment information platform (Next.js fullstack, bilingual, view-only)
**Researched:** 2026-03-26
**Confidence:** HIGH (Next.js App Router patterns are stable and well-documented; AI integration patterns are established)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ Strategy Page│  │  Landing Page│  │  Chart Components       │ │
│  │ (RSC + Client│  │  (RSC)       │  │  (Client Components)    │ │
│  │  components) │  │              │  │                         │ │
│  └──────┬───────┘  └──────────────┘  └────────────────────────┘ │
│         │ (fetch /api/*)                                         │
├─────────┴───────────────────────────────────────────────────────┤
│                    NEXT.JS APP LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Route Handlers (/api/*)                   │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐   │   │
│  │  │/api/strategy│  │ /api/news    │  │ /api/prices    │   │   │
│  │  │  [slug]     │  │  [strategy]  │  │  [strategy]    │   │   │
│  │  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘   │   │
│  └─────────┴────────────────┴──────────────────┴────────────┘   │
│                              │                                    │
│  ┌───────────────────────────┴──────────────────────────────┐   │
│  │                    Service Layer                           │   │
│  │  ┌────────────┐  ┌───────────────┐  ┌─────────────────┐  │   │
│  │  │  Data      │  │  AI Analysis  │  │  Content        │  │   │
│  │  │  Pipeline  │  │  Service      │  │  Service        │  │   │
│  │  │  Service   │  │  (LLM calls)  │  │  (strategies    │  │   │
│  │  │            │  │               │  │   + i18n)       │  │   │
│  │  └─────┬──────┘  └───────┬───────┘  └────────────────┘  │   │
│  └────────┴────────────────┴──────────────────────────────┘   │
├────────────────────────────────────────────────────────────────┤
│                    EXTERNAL DEPENDENCIES                         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Yahoo       │  │  CoinGecko   │  │  News APIs         │   │
│  │  Finance API │  │  API         │  │  (NewsAPI / GNews) │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
│                                                                  │
│  ┌──────────────┐  ┌──────────────────────────────────────┐   │
│  │  LLM API     │  │  KV Cache / In-memory cache          │   │
│  │  (OpenAI /   │  │  (Vercel KV, Upstash Redis, or       │   │
│  │   Gemini)    │  │   Next.js unstable_cache)            │   │
│  └──────────────┘  └──────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Strategy Pages | Render allocation breakdowns, charts, news feed for one strategy | Next.js RSC page with async data fetch + client chart components |
| Landing Page | Value proposition, navigation to 4 strategies | Static RSC, no data fetching |
| Route Handlers (`/api/*`) | Serve JSON to client components; apply cache headers | Next.js App Router Route Handlers |
| Data Pipeline Service | Fetch price/market data from external APIs, normalize to internal schema | `src/lib/data/` modules called from Route Handlers |
| AI Analysis Service | Send news + strategy context to LLM, return structured summaries | `src/lib/ai/` module with prompt templates |
| Content Service | Static strategy definitions (allocations, rationale, risk level) + i18n lookups | JSON/TS config files + next-intl |
| Cache Layer | Store API responses to avoid repeated external calls; TTL-based invalidation | `next/cache` unstable_cache OR Upstash Redis |
| Chart Components | Render equity curves and allocation pie/bar charts | Client components using Recharts or Lightweight Charts |

## Recommended Project Structure

```
src/
├── app/                        # Next.js App Router pages + layouts
│   ├── [locale]/               # i18n root — wraps all pages
│   │   ├── layout.tsx          # Locale provider, shared nav/footer
│   │   ├── page.tsx            # Landing page
│   │   └── strategy/
│   │       └── [slug]/
│   │           └── page.tsx    # Strategy detail page (RSC)
│   └── api/                    # Route Handlers (no locale prefix)
│       ├── strategy/
│       │   └── [slug]/
│       │       └── route.ts    # GET allocation + rationale
│       ├── news/
│       │   └── [strategy]/
│       │       └── route.ts    # GET news + AI analysis
│       └── prices/
│           └── [strategy]/
│               └── route.ts    # GET current prices + performance
│
├── lib/                        # Business logic, pure functions
│   ├── data/                   # External API adapters
│   │   ├── yahoo-finance.ts    # Price fetching + normalization
│   │   ├── coingecko.ts        # Crypto price fetching
│   │   └── news.ts             # News fetching (NewsAPI / GNews)
│   ├── ai/                     # LLM integration
│   │   ├── client.ts           # LLM provider setup
│   │   ├── prompts.ts          # Prompt templates per strategy
│   │   └── analyzer.ts        # news → structured analysis
│   ├── cache/                  # Cache helpers
│   │   └── index.ts            # unstable_cache wrappers with TTLs
│   └── strategies/             # Static strategy definitions
│       ├── index.ts            # Registry of all 4 strategies
│       ├── future-tech.ts      # Allocations, tickers, rationale
│       ├── traditional.ts
│       ├── commodities.ts
│       └── crypto.ts
│
├── components/                 # UI components
│   ├── charts/                 # Client-side chart components
│   │   ├── AllocationChart.tsx # Pie/bar for asset allocation
│   │   └── EquityCurve.tsx     # Simulated performance line chart
│   ├── news/                   # News feed + AI analysis display
│   │   ├── NewsFeed.tsx
│   │   └── ImpactBadge.tsx
│   ├── strategy/               # Strategy page sections
│   │   ├── AllocationTable.tsx
│   │   ├── RiskBadge.tsx
│   │   └── StrategyHeader.tsx
│   └── ui/                     # Generic design system components
│       ├── Button.tsx
│       └── Card.tsx
│
├── messages/                   # i18n message files
│   ├── en.json
│   └── zh-HK.json
│
└── types/                      # Shared TypeScript types
    ├── strategy.ts
    ├── news.ts
    └── prices.ts
```

### Structure Rationale

- **`app/[locale]/`:** next-intl dynamic locale segment is the standard pattern for App Router i18n — keeps all locale-aware pages under one prefix without duplicating route files.
- **`app/api/` (no locale):** API routes don't need locale prefixes; language is determined by the Accept-Language header or query param if needed at all.
- **`lib/data/`:** Each external API gets its own adapter file. This isolates rate-limiting logic, error handling, and response normalization per vendor. Swap out easily without touching route handlers.
- **`lib/ai/`:** Separates LLM concerns from data fetching. Prompts are co-located with the analyzer so they evolve together.
- **`lib/strategies/`:** Strategy definitions are static TypeScript config — not a database. Avoids unnecessary persistence for data that changes rarely. Edit a `.ts` file to update allocations.
- **`components/charts/`:** Chart libraries (Recharts, Lightweight Charts) require `"use client"` — isolating them prevents accidentally server-rendering canvas-dependent code.

## Architectural Patterns

### Pattern 1: Cache-Aside with TTL at the Route Handler

**What:** Each Route Handler wraps its external API calls in `unstable_cache` (or equivalent) with a suitable TTL. The cache is populated on first request, served from cache on subsequent requests until TTL expires.

**When to use:** All external API calls — prices (short TTL), news (medium TTL), AI analysis (long TTL). This is the primary cost-control mechanism for free-tier APIs and LLM credits.

**Trade-offs:**
- Pro: Simple to implement, built into Next.js, no extra infrastructure for v1
- Pro: Reduces latency after first request
- Con: `unstable_cache` is in-memory per server instance — if scaling to multiple instances, use Redis (Upstash) instead
- Con: TTL granularity only; no cache invalidation triggers

**Example:**
```typescript
// src/lib/cache/index.ts
import { unstable_cache } from 'next/cache'

export const cachedFetch = <T>(
  fn: () => Promise<T>,
  keys: string[],
  ttlSeconds: number
) =>
  unstable_cache(fn, keys, { revalidate: ttlSeconds })()

// src/lib/data/yahoo-finance.ts
export const getPrices = (tickers: string[]) =>
  cachedFetch(
    () => fetchFromYahoo(tickers),
    ['prices', ...tickers],
    300 // 5-minute TTL for prices
  )
```

**Recommended TTLs:**
| Data Type | TTL | Rationale |
|-----------|-----|-----------|
| Crypto prices (CoinGecko) | 60s | Markets move fast; free tier allows ~50 calls/min |
| Stock prices (Yahoo Finance) | 300s | Pseudo-real-time is sufficient for educational context |
| News headlines | 1800s | 30 min; news doesn't change that fast for display |
| AI analysis summaries | 3600s | LLM calls are expensive; 1hr before regenerating |
| Strategy allocations | Static | Config files; no TTL needed |

### Pattern 2: Server Component for Initial Data, Client Component for Interactivity

**What:** Strategy pages are React Server Components (RSC) that fetch and render the layout + static content server-side. Chart components and potentially news feeds are `"use client"` components that receive data as props or fetch from `/api/*` on the client.

**When to use:** Always in Next.js App Router. RSC for content, Client Components only for browser APIs (canvas for charts), user interactions, or streaming updates.

**Trade-offs:**
- Pro: RSC data is server-rendered, fast initial paint, SEO-friendly
- Pro: No client-side fetch waterfall for static content
- Con: Charts must be client-side (canvas dependency) — requires `dynamic()` with `ssr: false`

**Example:**
```typescript
// src/app/[locale]/strategy/[slug]/page.tsx (Server Component)
export default async function StrategyPage({ params }) {
  const strategy = getStrategyConfig(params.slug) // static, no fetch
  const prices = await getPrices(strategy.tickers) // cached fetch
  return (
    <div>
      <StrategyHeader strategy={strategy} prices={prices} />
      <AllocationChart data={strategy.allocations} /> {/* client */}
      <NewsFeed strategySlug={params.slug} /> {/* client, fetches /api/news */}
    </div>
  )
}
```

### Pattern 3: Strategy Registry as Static Config

**What:** The 4 strategies (future-tech, traditional, commodities, crypto) are defined as TypeScript objects — tickers, weights, rationale text keys (for i18n), risk level, and display metadata. No database.

**When to use:** When data changes only via code deployment (not user input). Appropriate for v1 where strategies are editorial decisions.

**Trade-offs:**
- Pro: Zero infrastructure — no DB, no migrations, no CRUD API
- Pro: Type-safe; wrong ticker is a compile error
- Con: Adding/editing strategies requires a redeploy
- Con: Doesn't scale if strategies become user-configurable (future scope)

**Example:**
```typescript
// src/lib/strategies/future-tech.ts
export const futureTechStrategy: Strategy = {
  slug: 'future-tech',
  riskLevel: 'high',
  allocations: [
    { ticker: 'NVDA', weight: 0.20, assetClass: 'equity' },
    { ticker: 'TSLA', weight: 0.15, assetClass: 'equity' },
    { ticker: 'ARKK', weight: 0.25, assetClass: 'etf' },
    // ...
  ],
  nameKey: 'strategies.futureTech.name',       // i18n key
  rationaleKey: 'strategies.futureTech.rationale',
}
```

## Data Flow

### Request Flow: Strategy Page Load

```
Browser requests /en/strategy/future-tech
        ↓
Next.js App Router — matches app/[locale]/strategy/[slug]/page.tsx (RSC)
        ↓
page.tsx (server) calls:
  ├── getStrategyConfig('future-tech')  → static TS config (no network)
  └── getPrices(['NVDA', 'TSLA', ...])  → cache hit? serve | miss? fetch Yahoo
        ↓
HTML rendered server-side, sent to browser
        ↓
Browser hydrates — chart components mount
        ↓
AllocationChart renders from props (data already in HTML)
NewsFeed component mounts → fetches /api/news/future-tech (client fetch)
        ↓
/api/news/future-tech Route Handler:
  ├── Fetch headlines from News API  → cache hit? serve | miss? fetch + cache
  └── Run AI analysis (if cache miss) → LLM API call → cache result
        ↓
NewsFeed renders with news + impact analysis
```

### Request Flow: Price Refresh (Client-Side Polling)

```
Client timer fires (every 5 min for crypto, less often for equities)
        ↓
Client fetches /api/prices/future-tech
        ↓
Route Handler checks cache:
  - Hit: return cached prices (304 or fresh JSON)
  - Miss: fetch from Yahoo Finance / CoinGecko → normalize → cache → return
        ↓
Client updates price display (no page reload)
```

### i18n Data Flow

```
User visits /en/* or /zh-HK/*
        ↓
next-intl middleware detects locale from URL segment
        ↓
Layout wraps app with NextIntlClientProvider + locale messages
        ↓
RSC: use getTranslations() (server-side)
Client components: use useTranslations() hook
        ↓
t('strategies.futureTech.name') → "Future Tech" | "未來科技"
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | `unstable_cache` in-memory is fine; single Vercel instance; no Redis needed |
| 1k-10k users | Add Upstash Redis as shared cache (replace unstable_cache); cache AI analysis aggressively |
| 10k+ users | Edge caching on CDN for static strategy content; consider ISR (Incremental Static Regen) for strategy pages |

### Scaling Priorities

1. **First bottleneck — LLM API costs:** AI analysis per news item gets expensive fast. Fix: longer TTLs, batch analysis per strategy not per article, cache aggressively.
2. **Second bottleneck — external API rate limits:** Yahoo Finance and free news APIs have strict limits. Fix: Redis shared cache, request coalescing, wider TTLs.

## Anti-Patterns

### Anti-Pattern 1: Calling External APIs Directly from Client Components

**What people do:** Fetch Yahoo Finance or NewsAPI from a browser `useEffect` to avoid the server layer complexity.

**Why it's wrong:** Exposes API keys in the browser bundle (critical security issue), burns free-tier rate limits with every page load per user, no server-side caching is possible.

**Do this instead:** All external API calls live in Route Handlers or RSC. Client components fetch from `/api/*` endpoints that own the external API credentials and caching.

### Anti-Pattern 2: Storing Strategy Config in a Database for v1

**What people do:** Create a strategies table in Postgres/Supabase because "that's how apps work."

**Why it's wrong:** Adds infrastructure cost and complexity (migrations, CRUD API, seeding) for data that editorial staff will change via code anyway. No user generates strategy data in v1.

**Do this instead:** TypeScript config files in `src/lib/strategies/`. The type system validates structure at build time. Add a DB only when strategies become user-configurable.

### Anti-Pattern 3: One Monolithic `/api/dashboard` Endpoint

**What people do:** Return all data (prices + news + analysis) from a single API route to "reduce requests."

**Why it's wrong:** Defeats cache granularity — one stale piece forces the whole response to be refreshed. AI analysis (1hr TTL) is invalidated by price refresh (5min TTL).

**Do this instead:** Separate endpoints per data domain (`/api/prices/`, `/api/news/`, `/api/strategy/`). Each gets its own TTL. Client fetches in parallel.

### Anti-Pattern 4: Wrapping Every Page in `"use client"` for Convenience

**What people do:** Add `"use client"` to page components because a child component needed state or the developer is unfamiliar with RSC boundaries.

**Why it's wrong:** Sends all server-side data fetching logic to the browser bundle; loses streaming; loses server caching benefits; bloats JS bundle sent to users.

**Do this instead:** Keep pages as RSC. Push `"use client"` as deep as possible — only on components that actually need browser APIs, event handlers, or hooks. Chart components need it; strategy text does not.

### Anti-Pattern 5: Skipping i18n in the Initial Build

**What people do:** Build the product in English first, plan to "add Chinese later."

**Why it's wrong:** Retrofitting i18n into an existing codebase is disproportionately expensive. All string literals must be found and extracted. Layouts that assumed LTR/fixed-length strings may break. This is a known rewrite trigger.

**Do this instead:** next-intl from day one. All user-facing strings use translation keys. Bilingual is a core constraint in PROJECT.md, not an optional feature.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Yahoo Finance (unofficial) | Server-side fetch via `yahoo-finance2` npm package | Free, unofficial — may break; no auth key needed but rate-limit exists; always cache aggressively |
| CoinGecko (free tier) | REST fetch with API key header | 50 calls/min free; cache prices at 60s minimum |
| News API (NewsAPI.org or GNews) | REST fetch with API key | Free tier: 100 req/day (NewsAPI) or 100/day (GNews); use long TTL (30min) and query by strategy keyword |
| LLM Provider (OpenAI / Gemini) | SDK call server-side only | API key in env var; never exposed to client; cache results at 1hr+ |
| Vercel KV / Upstash Redis | Optional cache backend | Only needed when scaling past single instance; not required for v1 |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| RSC page ↔ Route Handler | HTTP fetch from client component | Page server-renders static content; client components hit /api/* |
| Route Handler ↔ lib/data/* | Direct function call (same process) | No HTTP between them — just module imports |
| Route Handler ↔ lib/ai/* | Direct function call | AI calls are async; implement timeout + fallback (show news without analysis if LLM fails) |
| lib/data/* ↔ External APIs | HTTP (fetch) | Always via cache wrapper; never raw fetch |
| Components ↔ i18n | next-intl hooks/functions | RSC uses `getTranslations()`; Client uses `useTranslations()` |
| Strategy pages ↔ lib/strategies/* | Static import | No network; strategies are build-time config |

## Build Order Implications

Based on dependencies between components, the suggested build order is:

1. **i18n scaffold + routing** — The `[locale]` segment in the App Router must exist before any page can be built. next-intl setup is a prerequisite for all user-facing work. Set up message files with placeholder keys for all 4 strategies immediately.

2. **Strategy config + Content Service** — Define the TypeScript strategy types and create the 4 strategy config files. This is the "data model" that all other components depend on. No external APIs required.

3. **Static pages** — Landing page and strategy page layout using only static config data. No API calls. Proves routing and i18n work correctly before adding complexity.

4. **Data Pipeline Service + price Route Handlers** — Add external API adapters with caching. Validates that Yahoo Finance and CoinGecko integrations work and that caching reduces rate-limit exposure.

5. **Chart components** — Build AllocationChart and EquityCurve with real price data now available. Client components can now render with actual numbers.

6. **News fetching** — Add news Route Handler with caching. Validate news API quota consumption.

7. **AI Analysis Service** — Last because it depends on news data (step 6) and is the most expensive component to run. Build prompts, test with a single strategy before wiring all four.

8. **Polish: performance, disclaimers, SEO** — Meta tags, disclaimer banners, Open Graph images, Lighthouse audit.

## Sources

- Next.js App Router documentation (nextjs.org/docs) — Route Handlers, RSC, caching (MEDIUM confidence — WebFetch unavailable; based on knowledge through Aug 2025)
- next-intl documentation (next-intl.org) — App Router i18n patterns (MEDIUM confidence)
- CoinGecko API docs (coingecko.com/api) — free tier rate limits (MEDIUM confidence)
- NewsAPI.org — free tier limits (MEDIUM confidence)
- General Next.js fullstack fintech patterns — derived from training data knowledge of similar platforms (LOW confidence for specific implementation details, HIGH confidence for structural patterns)

---
*Architecture research for: AI-powered investment information platform (Pennyvest)*
*Researched: 2026-03-26*
