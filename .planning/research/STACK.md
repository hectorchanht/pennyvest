# Stack Research

**Domain:** Bilingual fintech/investment information platform (Next.js fullstack, AI-powered news analysis, financial charting)
**Researched:** 2026-03-26
**Confidence:** MEDIUM — versions verified from npm registry; Next.js 16 is confirmed latest stable but changelog details sourced from training data; API-specific notes from training knowledge flagged where unverified.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 16.2.1 | Full-stack React framework, API routes, SSR/SSG | Mandated by project constraints. App Router is the current standard — stable since v13, now the primary paradigm. API routes handle AI calls and data proxying in the same codebase, avoiding a separate backend. |
| React | 19.2.4 | UI component rendering | Latest stable; required by Next.js 16. React 19 Server Components and Actions are stable and the recommended approach for data-fetching in Next.js App Router. |
| TypeScript | 6.0.2 | Type safety across frontend and API routes | Financial data has many nullable fields (missing prices, stale quotes); TypeScript catches these at build time. For a fintech product, type errors in data transforms are high-stakes. |
| Tailwind CSS | 4.2.2 | Utility-first styling | v4 removes the config file in favor of CSS-first configuration; faster build. No component library forces opinionated CSS structure that fights i18n layout. Tailwind v4 pairs well with shadcn/ui. |

### Financial Data Layer

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| yahoo-finance2 | 3.13.2 | Unofficial Yahoo Finance client (stocks, ETFs, historical prices) | Best-maintained unofficial Yahoo Finance Node.js wrapper. Supports historical price data (needed for equity curves), quote fetching, and search. Unofficial — Yahoo has no public API key requirement, but rate limits exist. Use server-side only in Next.js API routes, never client-side. |
| coingecko-api-v3 | 0.0.31 | CoinGecko free-tier API client for crypto prices | CoinGecko's free tier supports price, market cap, and 365-day OHLC history — sufficient for v1 crypto strategy charts. The `coingecko-api-v3` package wraps the v3 REST API cleanly. |
| newsapi | 2.4.1 | NewsAPI.org client for financial news headlines | Free tier: 100 requests/day, developer plan. Sufficient for batch-fetching headlines per strategy keyword. Server-side only — API key must stay in environment variables. |

### AI / LLM Layer

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| Vercel AI SDK (`ai`) | 6.0.138 | Unified LLM interface with streaming, structured output, and Next.js integration | The AI SDK abstracts over OpenAI, Anthropic, and Google models behind a single interface. Critical for this project: if the LLM provider changes, only the provider config changes, not the application code. Includes `streamText`, `generateText`, and `generateObject` (structured JSON output) — `generateObject` with Zod schemas is the recommended pattern for news impact analysis. |
| openai | 6.33.0 | OpenAI provider for Vercel AI SDK | GPT-4o-mini is the best cost-to-quality ratio for news summarization tasks. ~$0.15/1M input tokens as of early 2026 — cheap enough for batch processing on free-tier budgets. Used via the AI SDK `@ai-sdk/openai` provider, not directly. |
| @anthropic-ai/sdk | 0.80.0 | Anthropic provider (fallback/alternative) | Claude Haiku 3.5 is a viable alternative if OpenAI costs become an issue. Keep as a documented alternative; primary recommendation is OpenAI via AI SDK for cost. |
| zod | 4.3.6 | Schema validation for AI structured outputs | Required by Vercel AI SDK's `generateObject`. Also validates incoming financial API data before it reaches rendering. Zod 4 has breaking changes from v3 — verify AI SDK 6.x compatibility. |

### Charting

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| Recharts | 3.8.1 | Equity curves, allocation pie charts, performance bar charts | React-native (renders to SVG via React components). Area charts for equity curves, pie/donut charts for allocation breakdowns — both are primary Pennyvest chart types. No canvas complexity, SSR-safe, Tailwind-compatible. Lightweight-charts (TradingView) is overkill for static portfolio charts that don't need candlestick interactivity. |
| lightweight-charts | 5.1.0 | (Optional) Candlestick/OHLC if individual asset detail pages added later | TradingView's library. Excellent for candlestick charts with zoom/pan. Not needed for v1 (equity curves and allocation charts only), but documented for future phases. Requires canvas; needs dynamic imports in Next.js. |

### i18n (Bilingual Support)

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| next-intl | 4.8.3 | English / Traditional Chinese routing, translations, and formatting | Native Next.js App Router integration with server components. Supports locale-based routing (`/en/strategies`, `/zh-TW/strategies`), server-side message loading (no client bundle bloat), and number/date formatting per locale (critical: financial numbers format differently for HK audience vs global). next-i18next is the Pages Router alternative — do not use it with App Router. |

### Data Fetching and Caching

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| @tanstack/react-query | 5.95.2 | Client-side caching and stale-while-revalidate for API data | For any client-interactive data (e.g., refreshing live prices without full page reload). Next.js `fetch` with `revalidate` handles most SSR caching; React Query handles client-side scenarios. Don't use both for the same data — establish a rule: SSR paths use Next.js cache, interactive client refreshes use React Query. |
| @upstash/redis | 1.37.0 | Serverless Redis for API response caching | Yahoo Finance and NewsAPI have rate limits and latency. Cache responses in Redis (TTL: prices 15 min, news 30 min, AI summaries 2 hours). Upstash provides a free-tier serverless Redis that works in Vercel Edge/Node.js environments without managing connection pools. |

### UI Components

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| shadcn/ui (CLI tool) | 0.9.5 | Accessible, unstyled component primitives | shadcn/ui copies components into your codebase (not a runtime dependency). Components are built on Radix UI + Tailwind. For Pennyvest: Card, Badge (risk level), Tabs (strategy navigation), Skeleton (loading states). Full control over styling needed for bilingual layouts. |
| lucide-react | 1.7.0 | Icon set | Standard icon companion for shadcn/ui. Consistent design language. |
| clsx | 2.1.1 | Conditional class merging | Required utility for shadcn/ui component patterns. |
| tailwind-merge | 3.5.0 | Tailwind class conflict resolution | Prevents Tailwind class conflicts when composing components. Used inside `cn()` utility (standard shadcn/ui pattern). |

### Development Tools

| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| Vitest | 4.1.1 | Unit testing | Fast, Vite-based, compatible with TypeScript out of the box. Test data transform logic for financial calculations and AI response parsing. |
| ESLint | 10.1.0 | Linting | Use Next.js's built-in ESLint config (`eslint-config-next`). |
| Prettier | 3.8.1 | Code formatting | Standard. |

---

## Installation

```bash
# Create Next.js app
npx create-next-app@latest pennyvest --typescript --tailwind --app --src-dir --import-alias "@/*"

# Financial data
npm install yahoo-finance2 coingecko-api-v3 newsapi

# AI layer
npm install ai @ai-sdk/openai @anthropic-ai/sdk zod

# i18n
npm install next-intl

# Charting
npm install recharts

# Data fetching and caching
npm install @tanstack/react-query @upstash/redis

# UI utilities
npm install lucide-react clsx tailwind-merge

# shadcn/ui (interactive CLI — run separately)
npx shadcn@latest init

# Dev dependencies
npm install -D vitest @vitejs/plugin-react prettier eslint-config-prettier
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Recharts | lightweight-charts (TradingView) | Use lightweight-charts if v2 adds candlestick individual asset pages with zoom/pan interaction. Too heavy for v1 allocation charts. |
| Recharts | Chart.js / react-chartjs-2 | Chart.js (4.5.1) is canvas-based — performs better with many data points, but SSR requires dynamic import guards. Recharts SVG approach is simpler for Next.js App Router. |
| next-intl | next-i18next | next-i18next is Pages Router only. Never use it with App Router. |
| Vercel AI SDK | Direct OpenAI SDK | Direct SDK works but couples all AI code to one provider. AI SDK lets you swap models without refactoring; worth the abstraction layer given project's "no hard LLM preference" constraint. |
| @upstash/redis | Vercel KV (@vercel/kv) | Vercel KV is built on Upstash Redis under the hood. Use Upstash directly for provider-agnostic deployment. |
| OpenAI (via AI SDK) | Anthropic Claude | Claude Haiku 3.5 is slightly cheaper for high-volume; GPT-4o-mini has broader community examples for financial analysis tasks. Either works via AI SDK. |
| Yahoo Finance via yahoo-finance2 | Alpha Vantage free tier | Alpha Vantage free tier is 25 API calls/day — far too restrictive for 4 strategies refreshing on a schedule. Yahoo Finance has no official key requirement. |
| @tanstack/react-query | SWR | SWR (2.4.1) is simpler but React Query has better devtools and more control over background refetch behavior. Either is fine for v1 scale. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| next-i18next | Pages Router only; incompatible with App Router server components | next-intl (App Router native) |
| Direct financial API calls from client components | Exposes free-tier API keys in browser network traffic; violates rate limit terms | Proxy all data through Next.js API routes / Server Actions |
| Prisma + PostgreSQL | No user accounts or persistent user data in v1; adds infra cost and complexity with no v1 benefit | Skip database entirely for v1; use Redis cache only |
| redux / redux-toolkit | Significant boilerplate for a view-only app with no user state | React Query for server state; React Context (if needed) for UI state |
| getServerSideProps | Pages Router API; deprecated pattern | Next.js App Router server components with `fetch` and `revalidate` |
| lightweight-charts in SSR | TradingView chart requires DOM/canvas; crashes during SSR | Use `dynamic(() => import(...), { ssr: false })` wrapper, or use Recharts for v1 |
| Yahoo Finance API directly from the browser | CORS blocks browser direct access; terms prohibit commercial use of unofficial API | Server-side only via yahoo-finance2 in API routes |

---

## Stack Patterns by Variant

**If AI costs exceed free/cheap tier budget:**
- Downgrade from GPT-4o-mini to GPT-4o-nano (if available) or Gemini Flash 2.0 via `@ai-sdk/google`
- Increase AI response cache TTL from 2 hours to 12 hours
- Because: AI summaries are the highest-cost operation; news doesn't change minute-to-minute

**If Yahoo Finance rate limits become a problem:**
- Add a secondary fallback to Alpha Vantage for individual quote endpoints
- Cache aggressively (30 min TTL for stock prices, not 15 min)
- Because: yahoo-finance2 uses the unofficial API with no SLA — outages happen

**If CoinGecko free tier limits are hit:**
- Use CoinGecko's Demo API key (free registration, 30 calls/min)
- Because: Free tier without a key is more restrictive than the Demo plan

**If charting needs grow (candlesticks, individual asset drilldown):**
- Add lightweight-charts as a dynamic import alongside Recharts
- Keep Recharts for portfolio-level allocation and equity curve charts
- Use lightweight-charts only for individual asset OHLCV charts

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| next@16.2.1 | react@^18.2.0 or ^19.0.0 | React 19 is recommended with Next.js 16; both are stable as of Q1 2026 |
| ai@6.0.138 | zod@^3.x or ^4.x | Zod 4 (4.3.6) introduced breaking changes; verify `generateObject` schema compatibility — zod 4 schema syntax changed for some types |
| recharts@3.8.1 | react@^18 or ^19 | Recharts 3.x supports React 18+; no React 19 specific issues reported in training data (MEDIUM confidence) |
| next-intl@4.8.3 | next@^16 | next-intl 4.x targets App Router; verify peer deps against next@16 before installing |
| tailwindcss@4.2.2 | postcss (no config required) | Tailwind v4 eliminates `tailwind.config.js`; uses CSS `@import "tailwindcss"` and `@theme` blocks. This is a significant migration from v3 if following v3 tutorials. |
| lightweight-charts@5.1.0 | Any React version | Canvas library; not a React component — requires a wrapper and `dynamic({ ssr: false })` in Next.js |

---

## Sources

- npm registry (`npm show [package] dist-tags`) — version verification for all packages listed above (HIGH confidence for versions)
- Next.js 16 peer dependency inspection via `npm show next@16.2.1 peerDependencies` — confirmed React 18/19 support
- Training data (August 2025 cutoff) — API capabilities, rate limits, architectural patterns (MEDIUM confidence — flag for validation before implementation)
- next-intl documentation pattern — App Router compatibility (MEDIUM confidence; verify at https://next-intl.dev before coding)
- Vercel AI SDK documentation pattern — `generateObject` with Zod (MEDIUM confidence; verify at https://sdk.vercel.ai/docs before coding)

**Flags requiring verification before implementation:**
- Zod 4.x compatibility with Vercel AI SDK 6.x `generateObject` — breaking changes between Zod 3 and 4 may affect schema syntax
- next-intl 4.x peer dependency on Next.js 16 — confirm no breaking changes in next-intl changelog
- yahoo-finance2 3.x API surface — confirm historical price methods haven't changed in 3.x release

---

*Stack research for: Pennyvest — Bilingual AI-powered investment information platform*
*Researched: 2026-03-26*
