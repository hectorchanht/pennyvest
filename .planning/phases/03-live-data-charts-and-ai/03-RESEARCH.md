# Phase 03: Live Data, Charts, and AI - Research

**Researched:** 2026-03-26
**Domain:** Financial data APIs, charting (Recharts), Vercel AI SDK 6, Upstash Redis caching, Next.js 16 Route Handlers
**Confidence:** HIGH (versions verified from npm; API patterns from official Next.js 16 docs; AI SDK from ai-sdk.dev; known blockers resolved)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Allocation breakdown as a donut chart (circular with center hole)
- **D-02:** Equity curve as a line chart showing simulated historical performance — labeled "Simulated back-test"
- **D-03:** Chart library at Claude's discretion (see recommendation below)
- **D-04:** Each news item as a card: headline, AI summary (2-3 sentences), colored impact badge
- **D-05:** Impact badge color-coded: green=Bullish, gray=Neutral, red=Bearish
- **D-06:** News section replaces "News — Coming Soon" ComingSoonCard placeholder
- **D-07:** Start with free/cheapest LLM option, provider-agnostic via Vercel AI SDK abstraction
- **D-08:** AI-generated content matches current UI language — single call per language, cached
- **D-09:** AI output cached in Upstash Redis, 1hr TTL for AI analysis
- **D-10:** Yahoo Finance (via yahoo-finance2) for stock/ETF/commodity prices — server-side only
- **D-11:** CoinGecko free API for crypto prices — server-side only
- **D-12:** Upstash Redis for all caching — prices: 5 min, news: 30 min, AI analysis: 1 hr
- **D-13:** All API calls through Next.js Route Handlers — never expose keys to client
- **D-14:** "Last updated" timestamp visible on every data section
- **D-15:** Loading skeletons matching Phase 2 ComingSoonCard skeleton pattern
- **D-16:** Graceful error state with retry button when API fails
- **D-17:** Stale data indicator if cache is older than 2× normal TTL

### Claude's Discretion

- Chart library selection (Recharts, Chart.js, lightweight alternatives)
- Number of news articles per fund (balance API limits vs content)
- Equity curve data generation approach (static historical backtest vs computed)
- News API selection (NewsAPI, GNews, or alternative)
- Exact cache TTL tuning
- Error state visual design
- Stale data indicator design
- Whether to run Zod 4 + AI SDK compatibility POC as a separate spike or inline

### Deferred Ideas (OUT OF SCOPE)

- Real-time WebSocket price streaming
- User-configurable backtester
- Push notifications for major news
- Combined profile equity curve
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| STRT-02 | User can see asset allocation breakdown as a visual chart (pie or bar) | Recharts 3.8.1 PieChart + innerRadius for donut; requires `"use client"` + dynamic import |
| STRT-04 | User can see constituent list (ticker, name, weight, asset class) for each strategy | HoldingsTable.tsx already exists; needs price column added via prices Route Handler |
| STRT-05 | User can see current market prices for each constituent with "last updated" timestamp | yahoo-finance2 v3 `quote()` + CoinGecko `/coins/markets`; Route Handler + Upstash cache |
| STRT-06 | User can see simulated performance chart (equity curve) for each strategy | yahoo-finance2 v3 `historical()` for stock data; CoinGecko OHLC for crypto; Recharts AreaChart |
| NEWS-01 | User can see aggregated relevant news headlines per strategy | marketaux free API (100 req/day, production-allowed); GNews or newsapi as fallback |
| NEWS-02 | User can read AI-generated summaries of each news article | Vercel AI SDK 6 `generateText({ output: Output.object({schema}) })` + Zod 4 schema |
| NEWS-03 | User can read AI-generated impact analysis for how news affects strategy | LLM prompt includes strategy allocations + article text; extractive only |
| NEWS-04 | News content refreshes at least every 30 minutes | Upstash Redis TTL 1800s on news Route Handler |
| I18N-03 | AI news analysis output supports both languages | Two separate LLM calls per article (en + zh-HK), each result cached independently |
| DATA-01 | Asset prices fetched from yahoo-finance2 (stocks) + CoinGecko (crypto) | Both confirmed available; method signatures verified |
| DATA-02 | Price data cached server-side to stay within free-tier API limits | `unstable_cache` wrapping non-fetch calls; Upstash Redis as shared cache |
| DATA-03 | News articles fetched from free news APIs | marketaux recommended; production use allowed on free tier |
| COMP-04 | "Last updated" timestamps visible wherever live data is displayed | `updatedAt: number` included in every Route Handler response; client renders relative time |
</phase_requirements>

---

## Summary

Phase 3 wires all external data sources into the static strategy pages built in Phase 2. The main work is: (1) three new Route Handlers (`/api/prices/[slug]`, `/api/news/[slug]`, `/api/equity/[slug]`), (2) new `src/lib/data/` adapters for yahoo-finance2, CoinGecko, and a news API, (3) an AI analysis service in `src/lib/ai/`, (4) two new chart client components (donut allocation, line equity curve), and (5) a news feed component with AI impact cards.

The two known blockers are now resolved: (1) **Zod 4 + AI SDK 6 compatibility is confirmed** — `ai@6.0.138` peer dep is `zod: '^3.25.76 || ^4.1.8'` so `zod@4.3.6` (already listed in STACK.md) is compatible. (2) **yahoo-finance2 v3 API is confirmed** — the library changed to an instance-based pattern (`const yf = new YahooFinance()`) and the `historical()` and `quote()` method signatures are stable. (3) **AI SDK 6 `generateObject` is deprecated** — the correct pattern is `generateText({ output: Output.object({schema}) })`.

**Primary recommendation:** Use Recharts 3.8.1 for charts (SVG, React-native, dark-theme compatible, React 19 peer dep satisfied). Use marketaux for news (free, production-allowed, 100 req/day which is sufficient with 30min caching). Use `unstable_cache` for server-side caching (already the Next.js standard; Upstash Redis via `@upstash/redis` as the shared cache backend per D-12).

---

## Standard Stack

### Core (to install)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| recharts | 3.8.1 | Donut + line charts | React-native SVG, React 19 peer dep satisfied, dark-theme via CSS variables, simpler than Chart.js for Next.js |
| yahoo-finance2 | 3.14.0 | Stock/ETF/commodity current prices + historical OHLCV | Only production-quality unofficial Yahoo Finance Node.js client; v3 confirmed latest |
| @upstash/redis | 1.37.0 | Serverless Redis cache backend for all TTL-based caching | Upstash free tier, REST-based (no connection pool issues on Vercel serverless) |
| ai | 6.0.138 | Vercel AI SDK — provider-agnostic LLM interface | Already in STACK.md; `generateText + Output.object()` for structured analysis |
| @ai-sdk/openai | 3.0.48 | OpenAI provider for AI SDK | GPT-4o-mini cheapest capable model; swap to Groq/Gemini by changing one import |
| zod | 4.3.6 | Schema for AI structured output + API response validation | Confirmed compatible with `ai@6.0.138` (peer dep: `^3.25.76 || ^4.1.8`) |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-is | 19.2.4 | Required peer dep for Recharts | Automatically resolved; no explicit install needed if react@19.2.4 present |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| recharts | Chart.js / react-chartjs-2 | Chart.js is canvas-based: better performance at 10k+ data points, but requires dynamic import + SSR guard; Recharts is simpler for Next.js App Router |
| recharts | lightweight-charts (TradingView) | Overkill for v1 allocation/equity charts; lacks React binding; must wrap manually |
| @ai-sdk/openai | @ai-sdk/google (Gemini Flash) | Gemini Flash 2.0 is cheaper; use if OpenAI costs become a problem |
| marketaux | newsapi (newsapi npm package) | newsapi.org free tier is **development-only**, cannot be used in production |

**Installation:**
```bash
pnpm add recharts yahoo-finance2 @upstash/redis ai @ai-sdk/openai zod
```

**Version verification (confirmed 2026-03-26):**
- recharts: 3.8.1 (npm registry)
- yahoo-finance2: 3.14.0 (npm registry, latest tag)
- @upstash/redis: 1.37.0 (npm registry)
- ai: 6.0.138 (npm registry)
- @ai-sdk/openai: 3.0.48 (npm registry)
- zod: 4.3.6 (npm registry)

---

## Architecture Patterns

### Recommended Project Structure (additions to existing src/)

```
src/
├── app/
│   └── api/                          # NEW — Route Handlers (no locale prefix)
│       ├── prices/
│       │   └── [slug]/route.ts       # GET current prices for all strategy tickers
│       ├── news/
│       │   └── [slug]/route.ts       # GET news + AI analysis for strategy
│       └── equity/
│           └── [slug]/route.ts       # GET historical equity curve data
├── lib/
│   ├── data/                         # EXISTING — add new adapters
│   │   ├── server-guard.ts           # EXISTING — import 'server-only' pattern
│   │   ├── yahoo-finance.ts          # NEW — quote() + historical() wrappers
│   │   ├── coingecko.ts              # NEW — /coins/markets batch endpoint
│   │   ├── news.ts                   # NEW — marketaux news fetcher
│   │   └── cache.ts                  # NEW — Upstash Redis wrapper with TTLs
│   ├── ai/                           # NEW
│   │   ├── client.ts                 # NEW — AI SDK provider setup (openai)
│   │   ├── prompts.ts                # NEW — extractive analysis prompt templates
│   │   └── analyzer.ts              # NEW — news → NewsAnalysis struct
│   └── strategies/                   # EXISTING
├── components/
│   ├── charts/                       # NEW — client components
│   │   ├── AllocationDonut.tsx       # NEW — donut chart, "use client"
│   │   └── EquityCurve.tsx           # NEW — area/line chart, "use client"
│   └── news/                         # NEW
│       ├── NewsFeed.tsx              # NEW — news section replacing ComingSoonCard
│       └── ImpactBadge.tsx           # NEW — Bullish/Neutral/Bearish badge
├── messages/
│   ├── en.json                       # ADD keys: chart labels, error states, loading
│   └── zh-HK.json
└── types/
    ├── prices.ts                     # NEW — PriceData, EquityPoint types
    └── news.ts                       # NEW — NewsItem, NewsAnalysis types
```

### Pattern 1: yahoo-finance2 v3 Instance Pattern

**What:** In v3, yahoo-finance2 changed from a static/module import to an instance-based API. You instantiate `YahooFinance` before calling methods.

**When to use:** All yahoo-finance2 calls in `src/lib/data/yahoo-finance.ts`.

```typescript
// Source: github.com/gadicc/yahoo-finance2 README (verified 2026-03-26)
import YahooFinance from 'yahoo-finance2';

const yf = new YahooFinance();

// Current price quote — single or array
const quote = await yf.quote('NVDA');
const quotes = await yf.quote(['NVDA', 'TSLA', 'AMD', 'PLTR', 'MSTR', 'ARKK']);

// Historical OHLCV — for equity curve generation
const history = await yf.historical('NVDA', {
  period1: '2022-01-01',   // Date, ISO string, or Unix timestamp
  period2: new Date(),     // defaults to today
  interval: '1wk',        // '1d' | '1wk' | '1mo'
  events: 'history',      // 'history' | 'dividends' | 'split'
  includeAdjustedClose: true,
});
// Returns HistoricalRowHistory[] with: date, open, high, low, close, adjClose, volume
```

**Critical:** All yahoo-finance2 calls must be in files that include `import 'server-only'` per the established `lib/data/` boundary pattern.

### Pattern 2: CoinGecko Batch Fetch via /coins/markets

**What:** Use `/coins/markets` endpoint to fetch all crypto prices in one request instead of individual `/simple/price` calls.

**When to use:** All crypto price fetching in `src/lib/data/coingecko.ts`.

```typescript
// Source: CoinGecko API docs (verified via WebSearch 2026-03-26)
// Rate: Free plan = 5-15 calls/min (public), Demo API key = 30 calls/min
// Batch up to 250 coins in one request via /coins/markets

const ids = ['bitcoin', 'ethereum', 'solana', 'chainlink', 'avalanche-2', 'polkadot'];
const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(',')}&price_change_percentage=24h`;

const response = await fetch(url, {
  headers: {
    'x-cg-demo-api-key': process.env.COINGECKO_API_KEY ?? '',
    'Accept': 'application/json',
  },
  cache: 'no-store', // Upstash handles caching above this layer
});
```

**Note on CoinGecko IDs:** The crypto strategy already uses CoinGecko-compatible IDs (`bitcoin`, `ethereum`, `solana`, `chainlink`, `avalanche-2`, `polkadot`) — no mapping needed. The `avalanche-2` ID is the correct CoinGecko ID for Avalanche (not `avax`).

### Pattern 3: Upstash Redis Caching Wrapper

**What:** Every external API call is wrapped in an Upstash-backed cache with explicit TTL. Cache key = `[dataType, slug, ...extras]`. Always wrap at the data layer, not the Route Handler.

**When to use:** All external calls in `src/lib/data/` and `src/lib/ai/`.

```typescript
// Source: @upstash/redis docs (verified npm 1.37.0)
// src/lib/data/cache.ts
import 'server-only';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<{ data: T; cachedAt: number }> {
  const cached = await redis.get<{ data: T; cachedAt: number }>(key);
  if (cached) return cached;

  const data = await fn();
  const result = { data, cachedAt: Date.now() };
  await redis.setex(key, ttlSeconds, result);
  return result;
}

// TTL constants — matches D-12
export const TTL = {
  prices: 300,     // 5 min
  crypto: 300,     // 5 min (same as D-12; crypto markets are educational context only)
  news: 1800,      // 30 min
  aiAnalysis: 3600,// 1 hr
  equity: 86400,   // 24 hr — historical data changes slowly
} as const;
```

### Pattern 4: AI SDK 6 Structured Output (NOT generateObject)

**What:** AI SDK 6 deprecates `generateObject`. Use `generateText({ output: Output.object({schema}) })` instead. This is the current recommended pattern.

**When to use:** All LLM calls in `src/lib/ai/analyzer.ts`.

```typescript
// Source: ai-sdk.dev/docs/reference/ai-sdk-core/generate-object (verified 2026-03-26)
import { generateText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const NewsAnalysisSchema = z.object({
  summary: z.string().describe('2-3 sentence extractive summary of the article'),
  impact: z.enum(['bullish', 'neutral', 'bearish'])
    .describe('Impact on the strategy based solely on article content'),
  reasoning: z.string().describe('1-2 sentence explanation referencing specific facts from article'),
});

export type NewsAnalysis = z.infer<typeof NewsAnalysisSchema>;

export async function analyzeNewsItem(
  articleText: string,
  strategyContext: string,
  locale: 'en' | 'zh-HK'
): Promise<NewsAnalysis> {
  const { output } = await generateText({
    model: openai('gpt-4o-mini'),
    output: Output.object({ schema: NewsAnalysisSchema }),
    system: `You analyze financial news articles. Respond in ${locale === 'zh-HK' ? 'Traditional Chinese (zh-HK)' : 'English'}.
    Do NOT add information not in the article. Do NOT state price targets or percentages unless verbatim from the article.`,
    prompt: `Strategy: ${strategyContext}\n\nArticle:\n${articleText}`,
    maxTokens: 300,
  });
  return output;
}
```

**Zod 4 compatibility confirmed:** `ai@6.0.138` peer dep is `zod: '^3.25.76 || ^4.1.8'`. The project will use Zod 4.3.6 which satisfies `^4.1.8`. No POC spike needed — this is a confirmed compatibility.

### Pattern 5: Route Handler with Upstash Cache + Stale Detection

**What:** Route Handler reads from cache, returns data with `cachedAt` timestamp. Client checks if data is older than `2 × TTL` to show stale indicator (D-17).

**When to use:** All three Route Handlers (`/api/prices/[slug]`, `/api/news/[slug]`, `/api/equity/[slug]`).

```typescript
// Source: Next.js 16 route.md (verified from node_modules/next/dist/docs/ 2026-03-26)
// app/api/prices/[slug]/route.ts
import type { NextRequest } from 'next/server';
import { getPricesForStrategy } from '@/lib/data/yahoo-finance';

export const dynamic = 'force-dynamic'; // Always fresh — caching is in Upstash

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // params is a Promise in Next.js 16

  try {
    const result = await getPricesForStrategy(slug);
    return Response.json(result); // includes { data, cachedAt }
  } catch (error) {
    console.error('[prices/route]', error);
    return Response.json(
      { error: 'Price data temporarily unavailable' },
      { status: 503 }
    );
  }
}
```

**Key:** `params` in Route Handlers is a Promise in Next.js 16 (same pattern as pages). Must `await params`.

### Pattern 6: Chart Client Components with dynamic import

**What:** Recharts requires `"use client"` and renders SVG in the browser. Use `next/dynamic` with `ssr: false` to prevent hydration errors on the RSC page.

**When to use:** `AllocationDonut` and `EquityCurve` components.

```typescript
// src/app/[locale]/fund/[slug]/page.tsx (RSC page — no change to server logic)
import dynamic from 'next/dynamic';

const AllocationDonut = dynamic(
  () => import('@/components/charts/AllocationDonut'),
  { ssr: false, loading: () => <Skeleton className="h-48 w-48 rounded-full" /> }
);

const EquityCurve = dynamic(
  () => import('@/components/charts/EquityCurve'),
  { ssr: false, loading: () => <Skeleton className="h-32 w-full" /> }
);
```

```typescript
// src/components/charts/AllocationDonut.tsx
'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface AllocationDonutProps {
  allocations: { name: string; ticker: string; weight: number; color?: string }[];
  centerLabel?: string; // e.g. strategy name or risk level
}

export default function AllocationDonut({ allocations, centerLabel }: AllocationDonutProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={allocations}
          dataKey="weight"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}  // donut hole
          outerRadius={90}
          strokeWidth={2}
        >
          {allocations.map((entry, index) => (
            <Cell key={entry.ticker} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${Math.round(value * 100)}%`} />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

### Pattern 7: News API — marketaux (Recommended)

**What:** Use the marketaux free tier for financial news. 100 requests/day, production use allowed, returns financial entity sentiment.

**When to use:** `src/lib/data/news.ts`.

```typescript
// marketaux.com API (verified 2026-03-26: free plan, 100 req/day, production-allowed)
// Query strategy by keyword (strategy name + constituent tickers)
const MARKETAUX_URL = 'https://api.marketaux.com/v1/news/all';

export async function fetchNewsForStrategy(
  strategyKeywords: string[],
  limit = 5   // 5 articles per strategy = 20 max per cache refresh; well within 100/day
): Promise<RawNewsItem[]> {
  const params = new URLSearchParams({
    api_token: process.env.MARKETAUX_API_KEY!,
    entities: strategyKeywords.join(','), // ticker symbols work as entity filter
    language: 'en',
    limit: String(limit),
  });
  const res = await fetch(`${MARKETAUX_URL}?${params}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`marketaux ${res.status}`);
  const json = await res.json();
  return json.data ?? [];
}
```

**Number of articles per strategy:** 5 articles × 4 strategies × 2 languages = 40 AI calls per cache cycle maximum. With 1hr AI cache TTL and 30min news cache TTL, daily LLM calls are bounded at ~320 (well within GPT-4o-mini budget).

### Pattern 8: Pre-translated Strings for Client Components (Established Pattern)

**What:** Following the Phase 2 pattern, all translation happens server-side (RSC) and pre-translated strings are passed as props to client components. Client components never call `useTranslations()` directly unless they must.

**When to use:** All new client chart and news components receive string props.

```typescript
// RSC page.tsx
const labels = {
  allocationTitle: t('strategy.allocationChart.title'),
  lastUpdated: t('common.lastUpdated', { time: '{time}' }),
  bullish: t('news.impact.bullish'),
  neutral: t('news.impact.neutral'),
  bearish: t('news.impact.bearish'),
};

<NewsFeed strategySlug={slug} labels={labels} locale={locale} />
```

### Anti-Patterns to Avoid

- **Client-side API key exposure:** Never pass API keys as props or expose them in client bundles. All `process.env.*` without `NEXT_PUBLIC_` prefix are server-only.
- **Calling external APIs from client components:** All Yahoo Finance and CoinGecko calls must go through Route Handlers.
- **`generateObject()` from AI SDK:** Deprecated in SDK 6. Use `generateText({ output: Output.object({schema}) })`.
- **`unstable_cache` for shared server state:** `unstable_cache` is in-memory per server instance and not shared across Vercel deployments. Use Upstash Redis via `@upstash/redis` for any cached data that needs to survive across function instances.
- **`newsapi` npm package in production:** The `newsapi.org` free tier is development-only. Use marketaux.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Redis cache layer | Custom in-memory Map with TTL | `@upstash/redis` + `setex` | In-memory dies on serverless cold starts; edge cases in TTL management |
| LLM provider switch | Conditional provider code | Vercel AI SDK provider abstraction | AI SDK handles model differences; swap provider by changing one import |
| Donut/line chart rendering | SVG path math | Recharts PieChart + AreaChart | D3/SVG math for financial charts is non-trivial; Recharts handles edge cases |
| News article extraction | HTML scraping | marketaux API (already extracts text) | Scraping is fragile; marketaux returns clean article content |
| Zod schema → JSON Schema | Manual conversion | `zod-to-json-schema` (used internally by AI SDK) | AI SDK handles the Zod → JSON Schema → LLM provider conversion |

**Key insight:** The LLM cost control problem is entirely solved by Upstash Redis. Don't build any custom caching mechanism.

---

## Common Pitfalls

### Pitfall 1: yahoo-finance2 v3 Is Instance-Based, Not Static

**What goes wrong:** Using v2-style `import yahooFinance from 'yahoo-finance2'; yahooFinance.quote(...)` throws because v3 exports a class, not a pre-instantiated module.

**Why it happens:** v3 changed to instance-based initialization to allow per-instance configuration. The v2 API was a singleton with global config.

**How to avoid:** Always use `const yf = new YahooFinance()`. Create one instance per module (not per request). Export it for reuse.

**Warning signs:** TypeScript error "yahooFinance.quote is not a function" or "YahooFinance is not callable".

### Pitfall 2: `params` is a Promise in Route Handlers (Next.js 15+/16)

**What goes wrong:** Destructuring `params` directly in Route Handler context argument causes a type error or undefined values.

**Why it happens:** As of Next.js 15, route params are asynchronous. Must `await params` just like in page components.

**How to avoid:**
```typescript
// WRONG (v14 style)
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params; // undefined in Next.js 16
}
// CORRECT (Next.js 15+/16 style)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
}
```
**Warning signs:** `slug` is undefined; TypeScript shows `params` as `Promise<...>` not a plain object.

### Pitfall 3: `generateObject` Is Deprecated — Throws Warning, May Be Removed

**What goes wrong:** Using `generateObject({ schema: z.object({...}), ... })` from `ai@6.x` produces deprecation warnings and will be removed in a future version.

**Why it happens:** AI SDK 6 unified structured output into `generateText({ output: Output.object({...}) })`.

**How to avoid:** Use the new pattern from day 1. Do not import `generateObject`.

**Warning signs:** Console warning "generateObject is deprecated; use generateText with output instead".

### Pitfall 4: newsapi.org Free Tier Cannot Be Used in Production

**What goes wrong:** Site deployed to Vercel/production receives 426 errors from newsapi.org because the developer plan explicitly prohibits production use.

**Why it happens:** newsapi.org's free/developer plan is for localhost only. Any deployed production domain triggers API-level rejection.

**How to avoid:** Use marketaux free tier (confirmed production-allowed, 100 req/day). `newsapi` npm package should not be installed.

**Warning signs:** 426 errors from newsapi.org in production logs; site works fine on localhost.

### Pitfall 5: Recharts Crashes on SSR (No Dynamic Import Guard)

**What goes wrong:** `next build` or page render crashes with "window is not defined" or "document is not defined" if Recharts components are imported in RSC context.

**Why it happens:** Recharts renders SVG using browser DOM APIs. These don't exist in the Node.js server render environment.

**How to avoid:** Always wrap chart components in `dynamic(() => import(...), { ssr: false })`. Never import chart components directly in RSC pages.

**Warning signs:** Build error "ReferenceError: window is not defined" from Recharts internals.

### Pitfall 6: Stale AI Analysis When News Changes

**What goes wrong:** News articles are refreshed (30 min TTL) but old AI analysis (1 hr TTL) is served for new articles because the cache key collision.

**Why it happens:** If the AI analysis cache key is just `ai-analysis-{slug}-{locale}`, it won't invalidate when the underlying news changes.

**How to avoid:** Include a hash of the article URL or article ID in the AI analysis cache key: `ai-analysis-{articleId}-{locale}`. This ensures each article gets its own analysis cache entry.

**Warning signs:** Different article text showing stale analysis that references different content.

### Pitfall 7: CoinGecko `avalanche-2` ID

**What goes wrong:** Fetching Avalanche crypto prices fails with "404 coin not found" when using `avax` or `avalanche` as the ID.

**Why it happens:** CoinGecko's canonical ID for Avalanche is `avalanche-2`. The strategy config already uses `avalanche-2` (verified in `crypto.ts`), but this must be maintained consistently.

**How to avoid:** Never manually rename or remap crypto tickers. The existing `crypto.ts` strategy config has the correct CoinGecko IDs already.

---

## Code Examples

### Route Handler: `/api/prices/[slug]`

```typescript
// Source: Next.js 16 route.md docs (from node_modules), verified 2026-03-26
// app/api/prices/[slug]/route.ts
import 'server-only';
import type { NextRequest } from 'next/server';
import { getPricesForStrategy } from '@/lib/data/yahoo-finance';
import { getCryptoPricesForStrategy } from '@/lib/data/coingecko';
import { getStrategyConfig } from '@/lib/strategies';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const strategy = getStrategyConfig(slug);
  if (!strategy) return Response.json({ error: 'Strategy not found' }, { status: 404 });

  try {
    const [equityPrices, cryptoPrices] = await Promise.all([
      getPricesForStrategy(strategy),
      getCryptoPricesForStrategy(strategy),
    ]);
    return Response.json({
      prices: { ...equityPrices, ...cryptoPrices },
      cachedAt: Math.max(
        equityPrices.cachedAt ?? 0,
        cryptoPrices.cachedAt ?? 0
      ),
    });
  } catch (error) {
    console.error('[api/prices]', error);
    return Response.json({ error: 'Price data temporarily unavailable' }, { status: 503 });
  }
}
```

### Donut Chart with Recharts

```typescript
// Source: recharts.org + training knowledge (Recharts API is stable)
'use client';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa'];

export default function AllocationDonut({ allocations, centerLabel }: AllocationDonutProps) {
  const data = allocations.map((a) => ({
    name: a.ticker,
    value: a.weight,
    fullName: a.name,
  }));

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, _name: string, props: any) =>
              [`${Math.round(value * 100)}%`, props.payload.fullName]
            }
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label overlay */}
      {centerLabel && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-medium text-text-muted text-center max-w-[80px]">
            {centerLabel}
          </span>
        </div>
      )}
    </div>
  );
}
```

### Equity Curve with Recharts AreaChart

```typescript
'use client';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, ReferenceLine
} from 'recharts';

interface EquityPoint { date: string; value: number }

export default function EquityCurve({
  data,
  simulatedLabel,
}: { data: EquityPoint[]; simulatedLabel: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted mb-1">{simulatedLabel}</p>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} />
          <YAxis
            tickFormatter={(v) => `${v > 0 ? '+' : ''}${v.toFixed(0)}%`}
            tick={{ fontSize: 10 }}
            axisLine={false}
          />
          <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`, 'Return']} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            fill="url(#equityGradient)"
            strokeWidth={1.5}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### AI Analysis with AI SDK 6

```typescript
// Source: ai-sdk.dev/docs/reference/ai-sdk-core/generate-object (verified 2026-03-26)
import { generateText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const NewsAnalysisSchema = z.object({
  summary: z.string(),
  impact: z.enum(['bullish', 'neutral', 'bearish']),
  reasoning: z.string(),
});

export async function analyzeNewsItem(
  article: { title: string; description: string; url: string },
  strategyAllocations: string,  // e.g. "NVDA 25%, TSLA 20%, ARKK 20%..."
  locale: 'en' | 'zh-HK'
): Promise<z.infer<typeof NewsAnalysisSchema>> {
  const langInstruction = locale === 'zh-HK'
    ? 'Respond entirely in Traditional Chinese (zh-HK).'
    : 'Respond in English.';

  const { output } = await generateText({
    model: openai('gpt-4o-mini'),
    output: Output.object({ schema: NewsAnalysisSchema }),
    maxTokens: 280,
    system: `You are a financial news analyst. ${langInstruction}
Summarize only what the article states. Do NOT invent figures, prices, or percentages not in the article.
Assess impact on the provided portfolio allocation.`,
    prompt: `Portfolio: ${strategyAllocations}

Article title: ${article.title}
Article content: ${article.description}`,
  });

  return output;
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `yahooFinance.quote('AAPL')` (v2 static) | `new YahooFinance(); yf.quote('AAPL')` (v3 instance) | v3.0.0 (2025) | Must instantiate before use |
| `import unstable_cache from 'next/cache'` as primary pattern | `unstable_cache` deprecated; use `use cache` directive or Upstash Redis for cross-instance | Next.js 16 | `unstable_cache` still works but is the old model |
| `generateObject({ schema })` | `generateText({ output: Output.object({schema}) })` | AI SDK 6.0 (2025) | generateObject deprecated |
| Direct `fetch` with `{ next: { revalidate } }` | Same pattern still valid for `fetch`; `unstable_cache` for non-fetch | Stable | No change needed for fetch-based caching |
| newsapi.org (developer plan) | marketaux / GNews / newsdata.io | 2024+ | newsapi.org developer plan blocks production use |

**Deprecated/outdated:**
- `generateObject` from `ai`: Deprecated in v6; use `generateText` + `Output.object()`
- `unstable_cache`: Not removed but replaced by `use cache` directive (requires `cacheComponents: true` in next.config); stick with `unstable_cache` for now since cacheComponents is experimental

---

## Open Questions

1. **Equity curve data generation: static vs. computed**
   - What we know: yahoo-finance2 `historical()` supports 1w/1m intervals going back years; CoinGecko has 365-day OHLC history on free tier
   - What's unclear: How many months of backtest data provides meaningful curve without large API payloads? The plan should decide the time range (e.g., 2 years weekly = 104 points per asset)
   - Recommendation: Use 2 years of weekly data (`interval: '1wk'`) per ticker. Cache at 24hr TTL since historical data changes only when a new week passes. Pre-compute a weighted portfolio curve server-side in the equity Route Handler — return one `EquityPoint[]` per strategy (not per ticker).

2. **CoinGecko env var**
   - What we know: `.env.local.example` has `UPSTASH_REDIS_REST_URL`, `OPENAI_API_KEY`, `NEWS_API_KEY` but no `COINGECKO_API_KEY` or `MARKETAUX_API_KEY`
   - What's unclear: Whether to use CoinGecko without a key (public, ~5-15 calls/min shared) or register for a free demo key (30 calls/min dedicated)
   - Recommendation: Add `COINGECKO_API_KEY` and `MARKETAUX_API_KEY` to `.env.local.example`. Pass the CoinGecko demo key header when present. With 5min price cache TTL and 4 strategies, max 1 CoinGecko call per 5 minutes — free tier is sufficient.

3. **i18n for AI analysis (I18N-03): two LLM calls vs. one + translate**
   - What we know: D-08 says "single call per language, cached". Two calls doubles LLM cost but avoids translation quality issues.
   - Recommendation: Two separate calls (en + zh-HK) with separate cache keys. GPT-4o-mini quality for zh-HK is adequate for short news summaries. If cost becomes an issue, generate English first and translate with a cheaper model.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js runtime | Yes | v22.22.0 | — |
| pnpm | Package manager | Yes | 8.15.5 | — |
| recharts | Chart rendering | Not installed | — | Install: `pnpm add recharts react-is` |
| yahoo-finance2 | Price data | Not installed | — | Install: `pnpm add yahoo-finance2` |
| @upstash/redis | Cache layer | Not installed | — | Install: `pnpm add @upstash/redis` |
| ai | LLM interface | Not installed | — | Install: `pnpm add ai @ai-sdk/openai` |
| zod | Schema validation | Not installed | — | Install: `pnpm add zod` |
| UPSTASH_REDIS_REST_URL | Cache | Not set (empty in .env.local.example) | — | Must configure before cache works |
| OPENAI_API_KEY | AI analysis | Not set (empty in .env.local.example) | — | Must configure; skip AI if missing |
| MARKETAUX_API_KEY | News API | Not in .env.local.example | — | Add to .env.local.example; must configure |
| COINGECKO_API_KEY | Crypto prices | Not in .env.local.example | — | Optional; works without key at lower rate limit |

**Missing dependencies with no fallback:**
- All npm packages above must be installed in Wave 0 before any implementation tasks

**Missing dependencies with fallback:**
- OPENAI_API_KEY: If not set, news section can render headlines without AI analysis (graceful degradation); AI fields show a "Analysis unavailable" placeholder

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (not yet installed — Wave 0 task) |
| Config file | `vitest.config.ts` — Wave 0 gap |
| Quick run command | `pnpm vitest run src/lib` |
| Full suite command | `pnpm vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DATA-01 | Yahoo Finance adapter returns normalized price shape | unit | `pnpm vitest run src/lib/data/yahoo-finance.test.ts` | Wave 0 |
| DATA-01 | CoinGecko adapter returns normalized price shape | unit | `pnpm vitest run src/lib/data/coingecko.test.ts` | Wave 0 |
| DATA-02 | Cache layer returns stale data on subsequent calls (no re-fetch) | unit | `pnpm vitest run src/lib/data/cache.test.ts` | Wave 0 |
| DATA-03 | News fetcher returns RawNewsItem[] with required fields | unit | `pnpm vitest run src/lib/data/news.test.ts` | Wave 0 |
| NEWS-02 / NEWS-03 | AI analyzer returns valid NewsAnalysis shape | unit | `pnpm vitest run src/lib/ai/analyzer.test.ts` | Wave 0 |
| STRT-02 | AllocationDonut renders without crashing | smoke | manual — chart requires browser | manual |
| STRT-06 | EquityCurve renders without crashing | smoke | manual — chart requires browser | manual |
| COMP-04 | Prices/news responses include `cachedAt` timestamp | unit | covered in adapter tests | Wave 0 |

### Sampling Rate

- **Per task commit:** `pnpm vitest run src/lib`
- **Per wave merge:** `pnpm vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `vitest.config.ts` — test framework config
- [ ] `src/lib/data/yahoo-finance.test.ts` — covers DATA-01 (equity prices)
- [ ] `src/lib/data/coingecko.test.ts` — covers DATA-01 (crypto prices)
- [ ] `src/lib/data/cache.test.ts` — covers DATA-02 (cache TTL behavior)
- [ ] `src/lib/data/news.test.ts` — covers DATA-03
- [ ] `src/lib/ai/analyzer.test.ts` — covers NEWS-02/NEWS-03
- [ ] Framework install: `pnpm add -D vitest @vitejs/plugin-react`

---

## Project Constraints (from CLAUDE.md / AGENTS.md)

The AGENTS.md directive states: **"This is NOT the Next.js you know — read `node_modules/next/dist/docs/` before writing any code."**

Verified findings from `node_modules/next/dist/docs/` that override training data assumptions:

1. **`unstable_cache` is the old model.** Next.js 16 introduced `use cache` directive (requires `cacheComponents: true`). Since `next.config.ts` does not have `cacheComponents: true`, use `unstable_cache` for now.
2. **`params` is a Promise** in Route Handlers (since Next.js 15). Must `await params` in all Route Handlers and pages. ✓ Already established in existing `page.tsx` (`const { locale, slug } = await params`).
3. **Route Handler `GET` defaults to `dynamic` (not static)** since Next.js 15. Explicit `export const dynamic = 'force-dynamic'` is redundant but harmless.
4. **`RouteContext<'/users/[id]'>` helper** is available globally after `next typegen` for strongly typed params — use for Route Handlers.

---

## Sources

### Primary (HIGH confidence)

- `node_modules/next/dist/docs/01-app/` — Next.js 16 caching, Route Handlers, `unstable_cache`, `use cache` directive (read directly from installed package 2026-03-26)
- npm registry — version verification for all packages listed (HIGH — queried 2026-03-26)
- `ai@6.0.138` npm peerDependencies — `zod: '^3.25.76 || ^4.1.8'` — Zod 4 compatibility confirmed
- github.com/gadicc/yahoo-finance2 README + source — v3 instance-based pattern confirmed
- ai-sdk.dev migration guide 6.0 — `generateObject` deprecated, `Output.object()` is current pattern

### Secondary (MEDIUM confidence)

- CoinGecko support article — rate limits (5-15 calls/min public, 30 calls/min demo key); `/coins/markets` for batch up to 250 coins
- marketaux.com pricing page — 100 requests/day free plan confirmed production-allowed
- newsapi.org pricing — developer plan development-only restriction confirmed (WebSearch + WebFetch 2026-03-26)
- github.com/gadicc/yahoo-finance2 issue #794 — v3 umbrella issue; ESM-only, instance-based, Deno-based development

### Tertiary (LOW confidence — flag for validation)

- Equity curve calculation approach (weighted portfolio returns from individual OHLCV) — standard financial calculation, but exact implementation should be validated against a known good value

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions queried from npm registry; compatibility verified from peer deps
- Architecture: HIGH — patterns verified from installed Next.js 16 docs
- Pitfalls: HIGH — API version changes confirmed from official sources; newsapi restriction confirmed
- AI SDK pattern: HIGH — migration guide confirmed `generateObject` deprecated in favor of `Output.object()`

**Research date:** 2026-03-26
**Valid until:** 2026-04-26 (30 days; yahoo-finance2 unofficial API may change without notice)
