# Phase 01: Foundation - Research

**Researched:** 2026-03-26
**Domain:** Next.js 16 scaffold + next-intl bilingual routing + TypeScript strategy config + server-only API key hygiene
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Package manager**: pnpm
- **Architecture**: Single Next.js app (no monorepo)
- **Components**: shadcn/ui + Tailwind CSS
- **Deployment**: Vercel
- **Linting**: ESLint + Prettier
- **Folder structure**: Layer-based (src/components/, src/lib/, src/hooks/)
- **Cache**: Upstash Redis from day 1 (not Next.js built-in cache)
- **Testing**: Minimal / manual for v1 — no test framework setup
- **Analytics**: Google Analytics
- **API keys**: None obtained yet — will sign up as we build each integration
- **Environment variables**: .env.local for secrets, never committed
- **i18n library**: next-intl
- **Locale detection**: Browser language detection, fallback to English
- **Language switcher**: Dropdown (not toggle) — extensible for future languages
- **Locale codes**: zh-HK (not zh-CN) — Traditional Chinese Hong Kong
- **URL slugs**: Same English slugs for both languages (/zh/fund/future-tech, not /zh/fund/未來科技)
- **Fund names (Chinese)**: 未來科技, 傳統行業, 大宗商品, 加密貨幣
- **Fund count**: 4 fixed fund products (Future Tech, Traditional Industries, Commodities, Crypto)
- **Allocation profiles**: 3 preset profiles (Conservative, Balanced, Aggressive)
- **SEO**: hreflang tags for bilingual SEO — both EN and zh-HK indexed separately
- **Theme**: Dark theme default (v1 ships dark only)
- **Colors**: Green/teal tones

### Claude's Discretion
- Specific tickers, weights, and compositions for each fund
- Allocation percentages for Conservative/Balanced/Aggressive profiles
- Whether fund pages cross-reference their weight in each profile
- Typography choices (must support EN + zh-HK well)
- AI news analysis tone (conversational vs neutral)
- Exact folder structure within src/
- Error handling patterns
- Loading skeleton designs

### Deferred Ideas (OUT OF SCOPE)
- Risk questionnaire (interactive user 問卷) — v2 feature, after user accounts
- Offline support for PWA — evaluate after core content is live
- Dark/light theme toggle — v1 ships dark only
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| I18N-04 | URL routing reflects selected language (e.g., /en/strategy/... and /zh/strategy/...) | next-intl defineRouting with [locale] App Router segment; proxy.ts middleware handles locale detection and URL rewriting |
| DATA-04 | All API keys and credentials are server-side only, never exposed to client | server-only package enforces build-time error if lib/data modules are imported in client components; NEXT_PUBLIC_ prefix convention; .env.local gitignored |
</phase_requirements>

---

## Summary

Phase 1 establishes the skeleton that every other phase builds on. The three concrete deliverables are: (1) a working Next.js 16 project scaffold with Turbopack, TypeScript strict mode, ESLint flat config, and Tailwind v4; (2) next-intl bilingual routing operational — `/en/` and `/zh/` render without errors, locale detection works, message files exist for both locales; (3) four strategy TypeScript config files as the authoritative source of truth for tickers, weights, and risk levels, with zero API keys exposed in any client-accessible context.

The primary complexity in this phase is the Next.js 16 API surface, which introduced several breaking changes from 15: `middleware.ts` is now `proxy.ts` (export renamed to `proxy`), the `next lint` command is removed in favour of direct ESLint CLI, `params` in pages/layouts are now async Promises, `unstable_cache` is renamed to `cache` (stable), and the edge runtime is NOT supported in `proxy.ts`. All of these affect the standard next-intl setup patterns from older tutorials, which must be updated. The Tailwind v4 CSS-first configuration (no `tailwind.config.js`) also diverges significantly from all v3 tutorials.

The key risk is following stale tutorials (Next.js 15 or earlier) when setting up next-intl or the proxy file. All four next-intl setup files must use the Next.js 16-specific patterns documented below. The `server-only` package is the authoritative mechanism for DATA-04 — it produces a build error if any `lib/data/` or `lib/ai/` module is accidentally imported by a client component.

**Primary recommendation:** Bootstrap with `pnpm create next-app@latest`, manually install next-intl after, create `src/proxy.ts` (not middleware.ts), set up four strategy config files as TypeScript, and add `import 'server-only'` to every file under `src/lib/data/` and `src/lib/ai/` from the start.

---

## Standard Stack

### Core (Phase 1 installs)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.1 | Full-stack framework | Mandated; App Router RSC + Route Handlers |
| react | 19.2.4 | UI rendering | Required by Next.js 16 |
| typescript | 6.x (via Next.js) | Type safety | Financial data has many nullable fields; strict mode required |
| tailwindcss | 4.2.2 | Utility CSS | v4 CSS-first, no config file, faster builds |
| @tailwindcss/postcss | 4.x | Tailwind v4 PostCSS plugin | Required for v4 (replaces old tailwindcss PostCSS plugin) |
| next-intl | 4.8.3 | Bilingual routing + translations | Native App Router i18n; proxy.ts integration |
| server-only | latest | Enforce server-only module boundary | Build error if imported in client — enforces DATA-04 |
| eslint | 10.1.0 | Linting | Next.js 16 requires flat config format |
| prettier | 3.8.1 | Formatting | Standard |

### Supporting (Phase 1 does not yet install)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @upstash/redis | 1.37.0 | Shared serverless cache | Install in Phase 3 when first API route is built |
| shadcn/ui (CLI) | 0.9.5 | Component primitives | Run `pnpm dlx shadcn@latest init -t next` in Phase 2 when first components are needed |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| next-intl | next-i18next | next-i18next is Pages Router only — never use with App Router |
| server-only package | Manual checks | Manual checks are not enforced at build time; server-only fails at build |
| Tailwind v4 CSS-first | tailwind.config.js (v3) | v3 config is deprecated; v4 ships with Next.js 16 create-next-app |

### Installation

```bash
# Create Next.js app (interactive — answer yes to TypeScript, Tailwind, App Router, src/, @/* alias)
pnpm create next-app@latest pennyvest --typescript --tailwind --app --src-dir --import-alias "@/*"

# i18n
pnpm add next-intl

# Server-only enforcement
pnpm add server-only

# Prettier + ESLint config
pnpm add -D prettier eslint-config-prettier
```

Note: shadcn/ui is NOT installed in Phase 1. Install it in Phase 2 when the first component is needed:
```bash
pnpm dlx shadcn@latest init -t next
```

---

## Architecture Patterns

### Recommended Project Structure (Phase 1 deliverables)

```
src/
├── app/
│   └── [locale]/               # next-intl locale segment (Phase 1)
│       ├── layout.tsx           # NextIntlClientProvider + lang attr
│       └── page.tsx             # Placeholder landing (Phase 1)
│
├── i18n/
│   ├── routing.ts               # defineRouting({ locales, defaultLocale })
│   ├── request.ts               # getRequestConfig — loads messages per locale
│   └── navigation.ts            # createNavigation wrappers (Link, redirect, etc.)
│
├── lib/
│   └── strategies/              # Strategy TypeScript config (Phase 1)
│       ├── types.ts             # Strategy, Allocation, RiskLevel types
│       ├── index.ts             # Registry — all 4 strategies
│       ├── future-tech.ts
│       ├── traditional.ts
│       ├── commodities.ts
│       └── crypto.ts
│
├── messages/
│   ├── en.json                  # EN translations (Phase 1 — placeholder keys)
│   └── zh-HK.json               # zh-HK translations (Phase 1 — placeholder keys)
│
└── proxy.ts                     # next-intl middleware (Next.js 16: proxy.ts not middleware.ts)
```

Directories added in later phases: `src/components/`, `src/hooks/`, `src/app/api/`, `src/lib/data/`, `src/lib/ai/`, `src/lib/cache/`.

### Pattern 1: next-intl Bilingual Routing (Next.js 16)

**What:** The `[locale]` dynamic segment in App Router wraps all user-facing pages. next-intl's `proxy.ts` (renamed from `middleware.ts` in Next.js 16) handles locale negotiation, cookie setting, and URL rewriting.

**Critical Next.js 16 changes:**
- File is `src/proxy.ts` NOT `src/middleware.ts`
- Export function is named `proxy` NOT `middleware`
- Edge runtime is NOT supported in proxy — runtime is nodejs

```typescript
// Source: https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh-HK'],
  defaultLocale: 'en',
  // localeDetection defaults to true — reads Accept-Language header + cookie
});
```

```typescript
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

```typescript
// src/proxy.ts  ← CRITICAL: Next.js 16 name is proxy.ts, NOT middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all paths except API routes, Next.js internals, and static files
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
```

```typescript
// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

```typescript
// src/app/[locale]/layout.tsx
// CRITICAL: params is a Promise in Next.js 16 (async params)
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;  // Promise in Next.js 16
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;  // Must await params in Next.js 16

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Pattern 2: next-intl Plugin in next.config.ts

next-intl requires a plugin in `next.config.ts` to enable server-side message loading:

```typescript
// Source: https://next-intl.dev/docs/usage/plugin
// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // No reactStrictMode needed explicitly — enabled by default in Next.js 16
};

export default withNextIntl(nextConfig);
```

### Pattern 3: Strategy Config as Static TypeScript

**What:** All 4 strategies are TypeScript config files — no database. The type system validates allocations, tickers, and risk levels at build time.

**When to use:** Source-of-truth data that only changes via code deployment (not user input).

```typescript
// Source: Architecture research ARCHITECTURE.md
// src/lib/strategies/types.ts
export type RiskLevel = 'low' | 'medium' | 'high';
export type AssetClass = 'equity' | 'etf' | 'commodity' | 'crypto';

export interface Allocation {
  ticker: string;       // e.g. 'NVDA'
  name: string;         // Display name e.g. 'NVIDIA Corp.'
  weight: number;       // 0–1 decimal e.g. 0.20 for 20%
  assetClass: AssetClass;
}

export interface Strategy {
  slug: string;         // URL slug e.g. 'future-tech'
  riskLevel: RiskLevel;
  allocations: Allocation[];
  nameKey: string;      // i18n key e.g. 'strategies.futureTech.name'
  rationaleKey: string; // i18n key e.g. 'strategies.futureTech.rationale'
}

export interface AllocationProfile {
  slug: string;         // 'conservative' | 'balanced' | 'aggressive'
  nameKey: string;
  // fundSlug → weight in this profile
  weights: Record<string, number>;
}
```

```typescript
// src/lib/strategies/future-tech.ts
import type { Strategy } from './types';

export const futureTechStrategy: Strategy = {
  slug: 'future-tech',
  riskLevel: 'high',
  nameKey: 'strategies.futureTech.name',
  rationaleKey: 'strategies.futureTech.rationale',
  allocations: [
    { ticker: 'NVDA', name: 'NVIDIA Corp.', weight: 0.20, assetClass: 'equity' },
    { ticker: 'TSLA', name: 'Tesla Inc.', weight: 0.15, assetClass: 'equity' },
    { ticker: 'ARKK', name: 'ARK Innovation ETF', weight: 0.25, assetClass: 'etf' },
    { ticker: 'AMD',  name: 'Advanced Micro Devices', weight: 0.15, assetClass: 'equity' },
    { ticker: 'PLTR', name: 'Palantir Technologies', weight: 0.10, assetClass: 'equity' },
    { ticker: 'MSTR', name: 'MicroStrategy Inc.', weight: 0.15, assetClass: 'equity' },
  ],
};
```

```typescript
// src/lib/strategies/index.ts
import { futureTechStrategy } from './future-tech';
import { traditionalStrategy } from './traditional';
import { commoditiesStrategy } from './commodities';
import { cryptoStrategy } from './crypto';
import type { Strategy } from './types';

export const strategies: Record<string, Strategy> = {
  'future-tech': futureTechStrategy,
  'traditional': traditionalStrategy,
  'commodities': commoditiesStrategy,
  'crypto': cryptoStrategy,
};

export function getStrategyConfig(slug: string): Strategy | undefined {
  return strategies[slug];
}

export function getAllStrategies(): Strategy[] {
  return Object.values(strategies);
}
```

### Pattern 4: server-only Enforcement for DATA-04

**What:** The `server-only` package causes a **build error** if a file importing it is bundled into the client. Add it to every file under `src/lib/data/`, `src/lib/ai/`, and `src/lib/cache/`.

```typescript
// src/lib/data/yahoo-finance.ts  (Phase 3 — but establish the pattern in Phase 1)
import 'server-only';  // ← Build error if accidentally imported by client component

// API keys read here — never accessible to client
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
```

In Phase 1, create `.env.local.example` (committed) and `.env.local` (gitignored) with all planned env var names as placeholders:

```bash
# .env.local.example  (commit this — safe, no values)
# Upstash Redis (server-only)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# OpenAI (server-only — Phase 6)
OPENAI_API_KEY=

# NewsAPI (server-only — Phase 5)
NEWS_API_KEY=

# Google Analytics (client-safe — NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

### Pattern 5: Tailwind v4 CSS-First Configuration

**What:** Tailwind v4 removes `tailwind.config.js`. Configuration happens in CSS using `@theme` blocks. `create-next-app` with `--tailwind` sets this up automatically for Next.js 16 projects.

```css
/* src/app/globals.css */
@import "tailwindcss";

/* Custom theme tokens — green/teal dark theme for Pennyvest */
@theme {
  --color-brand-green: oklch(0.72 0.17 155);
  --color-brand-teal: oklch(0.70 0.14 190);
  --color-background: oklch(0.13 0.01 240);
  --color-surface: oklch(0.18 0.01 240);
  --font-family-sans: 'Inter', 'Noto Sans TC', system-ui, sans-serif;
}
```

### Pattern 6: next-intl Message File Structure

The message JSON files must exist for Phase 1 to pass. Establish namespace structure from day one — retrofitting namespaces is painful.

```json
// src/messages/en.json  (Phase 1 — placeholder keys for all 4 strategies)
{
  "navigation": {
    "funds": "Funds",
    "profiles": "Profiles",
    "switchLanguage": "中文"
  },
  "strategies": {
    "futureTech": {
      "name": "Future Tech",
      "tagline": "Bet on tomorrow's technology leaders",
      "rationale": "Placeholder — Phase 2 content"
    },
    "traditional": {
      "name": "Traditional Industries",
      "tagline": "Time-tested sectors with steady dividends",
      "rationale": "Placeholder — Phase 2 content"
    },
    "commodities": {
      "name": "Commodities",
      "tagline": "Real assets as a hedge against inflation",
      "rationale": "Placeholder — Phase 2 content"
    },
    "crypto": {
      "name": "Crypto",
      "tagline": "High-risk, high-reward digital assets",
      "rationale": "Placeholder — Phase 2 content"
    }
  },
  "profiles": {
    "conservative": { "name": "Conservative" },
    "balanced": { "name": "Balanced" },
    "aggressive": { "name": "Aggressive" }
  },
  "riskLevel": {
    "low": "Low Risk",
    "medium": "Medium Risk",
    "high": "High Risk"
  }
}
```

```json
// src/messages/zh-HK.json  (Phase 1 — formal Traditional Chinese financial terms)
{
  "navigation": {
    "funds": "基金",
    "profiles": "投資組合",
    "switchLanguage": "English"
  },
  "strategies": {
    "futureTech": {
      "name": "未來科技",
      "tagline": "投資明日科技巨頭",
      "rationale": "佔位符 — 第二階段內容"
    },
    "traditional": {
      "name": "傳統行業",
      "tagline": "歷久不衰的穩健板塊",
      "rationale": "佔位符 — 第二階段內容"
    },
    "commodities": {
      "name": "大宗商品",
      "tagline": "實物資產對抗通脹",
      "rationale": "佔位符 — 第二階段內容"
    },
    "crypto": {
      "name": "加密貨幣",
      "tagline": "高風險高回報數字資產",
      "rationale": "佔位符 — 第二階段內容"
    }
  },
  "profiles": {
    "conservative": { "name": "保守型" },
    "balanced": { "name": "平衡型" },
    "aggressive": { "name": "進取型" }
  },
  "riskLevel": {
    "low": "低風險",
    "medium": "中等風險",
    "high": "高風險"
  }
}
```

### Anti-Patterns to Avoid

- **Using `src/middleware.ts`:** This is the Next.js 15 name. Next.js 16 requires `src/proxy.ts` with `export default` named `proxy`. Using the old name triggers a deprecation warning on Vercel.
- **Synchronous `params` access:** In Next.js 16, `params` in layout/page is a Promise. `const { locale } = params` (synchronous) will throw. Always `const { locale } = await params`.
- **`export const runtime = 'edge'` in proxy.ts:** Edge runtime is NOT supported in Next.js 16 proxy files. Remove any edge runtime declarations — the runtime is nodejs and cannot be configured.
- **Following Tailwind v3 tutorials:** `tailwind.config.js` does not exist in v4 projects. CSS-first `@theme` blocks replace it. All v3 `theme.extend` patterns must be rewritten as CSS custom properties.
- **Using `next lint` in scripts:** `next lint` is removed in Next.js 16. Use `eslint .` directly in package.json scripts.
- **Setting `NEXT_PUBLIC_` prefix on API keys:** Any env var with `NEXT_PUBLIC_` is bundled into the client. Never use this prefix for Yahoo Finance, NewsAPI, OpenAI, Upstash, or CoinGecko keys.
- **Installing shadcn/ui in Phase 1:** shadcn's `init` command adds components to the codebase. Do it in Phase 2 when the first UI component is actually needed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bilingual URL routing with locale detection | Custom redirect middleware | next-intl createMiddleware | Handles Accept-Language, cookies, redirects, and alternate links correctly |
| Build-time enforcement of server-only code | Lint rules or comments | `server-only` npm package | Only mechanism that actually fails the build |
| Translation key lookup with fallbacks | Custom translation function | next-intl getTranslations / useTranslations | Handles plurals, rich text, number formatting per locale |
| TypeScript type checking for message keys | Custom type generation | next-intl built-in type augmentation (AppConfig) | Provides compile-time errors for missing translation keys |
| Locale-aware navigation (Link, redirect, useRouter) | Custom locale-prefixed Link | next-intl createNavigation | Handles locale prefix automatically, preserves type safety |

---

## Common Pitfalls

### Pitfall 1: middleware.ts vs proxy.ts in Next.js 16

**What goes wrong:** Developer uses `src/middleware.ts` with `export function middleware(...)` following every tutorial written for Next.js 14/15. Vercel deployment shows a warning; eventually fails after Next.js removes the deprecated file entirely.

**Why it happens:** The rename happened in Next.js 16. Almost all tutorials (and the next-intl README for a while) used `middleware.ts`. Search results still predominantly show the old name.

**How to avoid:** Create `src/proxy.ts` from day one. Export function must be `export default createMiddleware(routing)` — default export, not named export. The old `skipMiddlewareUrlNormalize` config key is now `skipProxyUrlNormalize`.

**Warning signs:** Vercel build logs showing "middleware is deprecated" or locale routing not working in production while working locally.

### Pitfall 2: Synchronous params in Next.js 16

**What goes wrong:** `const { locale } = params` in `layout.tsx` throws a runtime error. The page renders a 500 on every request.

**Why it happens:** Next.js 16 made `params` and `searchParams` fully async. There was a temporary synchronous compatibility shim in Next.js 15 that is now removed.

**How to avoid:** Always `const { locale } = await params` in any layout or page receiving `params`. The `PageProps` and `LayoutProps` helper types (generated by `npx next typegen`) make this fail at TypeScript compile time if missed.

**Warning signs:** TypeScript errors like "params is possibly a Promise" during build.

### Pitfall 3: zh-CN instead of zh-HK

**What goes wrong:** Locale is set to `zh` or `zh-CN` (Simplified Chinese, Mandarin). All UI renders in Simplified Chinese. HK audience gets irrelevant content and font rendering issues.

**Why it happens:** `zh-CN` is the default for most i18n tooling. AI translation tools also default to Simplified Chinese. Stack Overflow and tutorial examples almost never use `zh-HK`.

**How to avoid:** Set `locales: ['en', 'zh-HK']` in `defineRouting` from the first commit. Never use `zh` or `zh-CN` anywhere. Name the message file `zh-HK.json` not `zh.json`. Verify font includes Traditional Chinese glyphs (Noto Sans TC, not Noto Sans SC).

**Warning signs:** Characters displaying as Simplified Chinese glyphs, "語" appearing as simplified form rather than traditional, HK-specific financial terms (e.g. 大宗商品 vs 大宗商品 — same here, but other terms differ).

### Pitfall 4: API Key Exposure via NEXT_PUBLIC_ or Direct Client Import

**What goes wrong:** Developer accidentally prefixes `UPSTASH_REDIS_REST_TOKEN` with `NEXT_PUBLIC_` for convenience, or imports a lib/data file in a Client Component. API key appears in the browser's network tab or JavaScript bundle.

**Why it happens:** `NEXT_PUBLIC_` is an easy mistake when the developer is used to exposing env vars. Client Component imports of server-side code don't always produce obvious errors without `server-only`.

**How to avoid:** Add `import 'server-only'` to every file in `src/lib/data/`, `src/lib/ai/`, `src/lib/cache/` from Phase 1. This produces a hard build error. Never use `NEXT_PUBLIC_` prefix on any third-party API key, database credential, or Redis token. The only `NEXT_PUBLIC_` var in this project is `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

**Warning signs:** Build error mentioning "server-only cannot be used in client" — this is the system working correctly. The dangerous case is no error — which means `server-only` was forgotten.

### Pitfall 5: Tailwind v4 CSS-First Confusion

**What goes wrong:** Developer adds a `tailwind.config.js` file following a v3 tutorial. The file is silently ignored by v4, so no custom theme tokens apply. Dark theme and brand colors never render correctly.

**Why it happens:** Tailwind v4 ships with Next.js 16's `create-next-app`. All existing tutorials are for v3. The CSS `@theme` syntax is new and unfamiliar.

**How to avoid:** Define all design tokens in `src/app/globals.css` using `@theme { }` blocks. For the dark theme, use CSS variables and Tailwind's `dark:` variant via the `@media (prefers-color-scheme: dark)` mechanism, or set `class` strategy using `@plugin` in globals.css.

**Warning signs:** Custom colors not appearing in Tailwind IntelliSense, `theme.extend` not producing any CSS output.

### Pitfall 6: ESLint Flat Config Required in Next.js 16

**What goes wrong:** Developer creates `.eslintrc.json` (legacy format). Next.js 16 uses ESLint flat config by default (ESLint v10). The old config is silently not loaded; linting shows zero errors even for real violations.

**Why it happens:** Flat config (eslint.config.js/mjs) is new as of ESLint v9+. The legacy `.eslintrc` format is no longer the default.

**How to avoid:** Use `eslint.config.mjs` (flat config). `create-next-app` generates this correctly for Next.js 16. Do not add `.eslintrc` or `.eslintrc.json` — they will conflict. Note: `next lint` command is also removed; use `eslint .` directly.

**Warning signs:** `npx eslint .` reports no issues even when obvious errors exist, or "Cannot find module 'eslint-config-next'" in old format.

---

## Code Examples

Verified patterns from official sources:

### TypeScript Strict Mode in tsconfig.json

```json
// tsconfig.json — enable strict mode per project requirements
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Using Translations in a Server Component (Phase 1 placeholder page)

```typescript
// Source: https://next-intl.dev/docs/usage/translations
// src/app/[locale]/page.tsx
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('navigation');

  return (
    <main>
      <h1>{t('funds')}</h1>
    </main>
  );
}
```

### pnpm workspace config (single app, not monorepo)

Since this is a single app (not monorepo), no workspace configuration is needed. The project root IS the app. pnpm is configured only for node-linker compatibility if needed:

```yaml
# .npmrc (create this if shadcn/ui has hoisting issues)
public-hoist-pattern[]=*@radix-ui/*
public-hoist-pattern[]=*@types*
```

### next.config.ts skeleton

```typescript
// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Turbopack is default in Next.js 16 — no flag needed
  // TypeScript and ESLint errors will fail the build by default
};

export default withNextIntl(nextConfig);
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `src/middleware.ts` + `export function middleware` | `src/proxy.ts` + `export default function proxy` | Next.js 16 | Must rename — old name is deprecated and will be removed |
| `unstable_cache` | `cache` (stable, no unstable_ prefix) | Next.js 16 | Import from 'next/cache'; old import still works but shows deprecation warning |
| `tailwind.config.js` | CSS-first `@theme {}` in globals.css | Tailwind v4 | Config file is ignored; all tokens must be in CSS |
| `next lint` CLI command | `eslint .` directly | Next.js 16 | `next lint` removed; update package.json scripts |
| `.eslintrc.json` | `eslint.config.mjs` (flat config) | ESLint v9+ / Next.js 16 | Old format silently not loaded |
| `params.locale` (sync) | `(await params).locale` | Next.js 16 | Hard requirement — sync access throws at runtime |
| `export const runtime = 'edge'` in middleware | Not supported in proxy.ts | Next.js 16 | Edge runtime removed from proxy; use nodejs only |

**Deprecated/outdated:**
- `next-i18next`: Pages Router only — never use with App Router
- `tailwindcss-animate`: Deprecated by shadcn/ui in favour of `tw-animate-css`
- `getServerSideProps` / `getStaticProps`: Pages Router APIs, removed in App Router

---

## Open Questions

1. **next-intl peer dependency declaration for Next.js 16**
   - What we know: next-intl 4.8.3 is ESM-only except the plugin; works with Next.js 16 in practice (official docs reference proxy.ts)
   - What's unclear: Whether pnpm peer dep resolution requires `--legacy-peer-deps` during install
   - Recommendation: Attempt clean install first; if peer dep error, add `legacy-peer-deps=true` to `.npmrc` for next-intl specifically. The practical evidence is that it works (official next-intl docs reference Next.js 16 patterns).

2. **pnpm .npmrc for shadcn/ui hoisting**
   - What we know: shadcn/ui components depend on Radix UI primitives which pnpm's strict hoisting may not auto-resolve
   - What's unclear: Whether Next.js 16 + pnpm 9+ resolved this natively
   - Recommendation: Add `public-hoist-pattern[]=*@radix-ui/*` to `.npmrc` if shadcn components fail to resolve Radix peers (Phase 2 concern, not Phase 1).

3. **Upstash Redis in Phase 1 vs Phase 3**
   - What we know: User decisions say "Upstash Redis from day 1"
   - What's unclear: "From day 1" likely means infrastructure is set up, not necessarily that caching code is written
   - Recommendation: Create Upstash account and obtain credentials in Phase 1; add env var placeholders to `.env.local.example`; but don't install `@upstash/redis` until Phase 3 when the first API route is built.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None — minimal/manual testing for v1 (locked decision) |
| Config file | None — no test framework setup |
| Quick run command | `pnpm build` (TypeScript strict mode + ESLint act as phase gate) |
| Full suite command | `pnpm build && pnpm lint` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| I18N-04 | `/en/` and `/zh/` render correct locale | smoke (manual browser check) | `pnpm dev` then navigate to /en/ and /zh/ | ❌ Wave 0: no test file |
| I18N-04 | next-intl routing redirects `/` to `/en/` | smoke (manual browser check) | `pnpm dev` then navigate to / | ❌ Wave 0: no test file |
| DATA-04 | No NEXT_PUBLIC_ prefix on any API key | lint rule (manual audit) | `grep -r "NEXT_PUBLIC_" src/lib/` — should return empty | ❌ Wave 0: no automated check |
| DATA-04 | `server-only` import in all lib/data files | build gate | `pnpm build` fails if server-only module imported in client | ❌ Wave 0: lib/data/ does not exist yet in Phase 1 |

**Phase gate:** `pnpm build` passes with zero TypeScript errors and zero ESLint errors before the phase is signed off.

### Sampling Rate

- **Per task commit:** `pnpm typecheck` (or `pnpm build --dry-run` equivalent) — TypeScript strict mode must pass
- **Per wave merge:** `pnpm build` — full build with ESLint included
- **Phase gate:** Full build green + manual browser verification of /en/ and /zh/ rendering correctly

### Wave 0 Gaps

- [ ] No test framework — `pnpm build` is the proxy for correctness. Manual browser smoke test for i18n routing.
- [ ] `grep -r "NEXT_PUBLIC_" src/lib/` — manual audit command to verify DATA-04 before phase sign-off
- [ ] `server-only` package cannot be verified in Phase 1 (lib/data/ doesn't exist yet); DATA-04 is partially addressed by establishing the pattern in `.env.local.example` and documenting the convention

---

## Sources

### Primary (HIGH confidence)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16) — async params, proxy.ts rename, unstable_cache stabilization, next lint removal, ESLint flat config (fetched 2026-03-26, version 16.2.1, lastUpdated 2026-03-25)
- [Next.js Data Security Guide](https://nextjs.org/docs/app/guides/data-security) — server-only package, NEXT_PUBLIC_ convention, taint API (fetched 2026-03-26)
- [next-intl App Router Setup with i18n routing](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing) — routing.ts, request.ts, proxy.ts, navigation.ts, layout.tsx patterns (fetched 2026-03-26)
- [next-intl Routing Configuration](https://next-intl.dev/docs/routing/configuration) — defineRouting, localeDetection, zh-HK locale support (fetched 2026-03-26)
- [Tailwind CSS v4 Next.js Installation Guide](https://tailwindcss.com/docs/guides/nextjs) — @tailwindcss/postcss, CSS @import, no config file (fetched 2026-03-26)

### Secondary (MEDIUM confidence)
- [next-intl 4.0 Release Blog](https://next-intl.dev/blog/next-intl-4-0) — ESM-only package, React 17 modern JSX transform, GDPR cookie changes, NextIntlClientProvider inherits messages by default (fetched 2026-03-26)
- [shadcn/ui Next.js Installation](https://ui.shadcn.com/docs/installation/next) — `pnpm dlx shadcn@latest init -t next` command (fetched 2026-03-26)
- buildwithmatija.com — next-intl + Next.js 16 proxy.ts rename explanation (WebSearch, verified against official docs)
- Project-level research in `.planning/research/ARCHITECTURE.md` and `.planning/research/STACK.md` — strategy config patterns, layer-based folder structure (HIGH confidence — established during project research phase)

### Tertiary (LOW confidence — verify before implementation)
- pnpm peer dep behaviour with next-intl 4.x — practical experience indicates it works; formal peer dep declaration may lag Next.js 16 (verify with clean install)
- Upstash Redis free-tier limits — verify current limits at upstash.com before Phase 3

---

## Metadata

**Confidence breakdown:**
- Next.js 16 breaking changes: HIGH — verified against official docs fetched 2026-03-26 (version 16.2.1)
- next-intl 4 setup patterns: HIGH — verified against official next-intl docs including Next.js 16-specific proxy.ts usage
- Tailwind v4 setup: HIGH — verified against official tailwindcss.com docs
- Strategy TypeScript config pattern: HIGH — established in project architecture research
- server-only / DATA-04 mechanism: HIGH — verified against official Next.js data security guide
- pnpm peer dep behavior: MEDIUM — practical evidence only, no formal verification

**Research date:** 2026-03-26
**Valid until:** 2026-06-26 (stable platform, 90 days) — verify Next.js 16 minor releases if significant time passes
