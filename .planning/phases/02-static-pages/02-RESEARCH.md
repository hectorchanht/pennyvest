# Phase 2: Static Pages - Research

**Researched:** 2026-03-26
**Domain:** Next.js 16 App Router static pages, bilingual UI (next-intl 4.x), Tailwind v4, shadcn/ui component composition, CSS scroll transitions, mobile swipe gestures
**Confidence:** HIGH — all findings verified against in-repo Next.js 16 docs, installed package versions, and existing Phase 1 code

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Landing Page Layout**
- D-01: Full-screen hero section with CTA ("Explore Strategies" or similar), filling the viewport
- D-02: Profile selector tabs (Conservative / Balanced / Aggressive) integrated into the hero area
- D-03: Selecting a profile highlights and reorders the 4 strategy cards below by weight, showing weight % badges on each card
- D-04: 4 strategy cards in a 2×2 grid below hero — fund name, risk badge, tagline. Single column stack on mobile
- D-05: Hero transitions to transparent header on landing page, solid dark background on scroll

**Strategy Page Structure**
- D-06: Two-column layout on desktop — left column: rationale + holdings table + placeholder sections; right column (sticky): risk badge + allocation summary
- D-07: Collapses to single column on mobile
- D-08: Phase 3 placeholder sections (charts, prices, news) rendered as visible skeleton cards with "Coming Soon" labels
- D-09: Risk level displayed as a gauge/meter visual (semi-circle) rather than a simple pill badge
- D-10: Sticky sidebar shows: risk gauge, mini allocation breakdown (ticker + weight list), link to profiles page

**Navigation & Language Switcher**
- D-11: Desktop header: Left = Pennyvest logo, Center = fund links + Profiles link, Right = language dropdown
- D-12: Mobile: 5-tab bottom bar — 4 fund tabs + center Profiles icon
- D-13: Language switcher as globe icon + dropdown in top header bar on both desktop and mobile
- D-14: Header transparent over hero section, transitions to solid dark background on scroll past hero
- D-15: Swipeable left/right between fund pages on mobile (decided in Phase 1)

**Content & Copy**
- D-16: Fund rationale: short paragraph (3-5 sentences) — thesis, who it's for, key idea
- D-17: Static holdings table: 3 columns — Ticker, Name, Weight %. Price/value columns added in Phase 3
- D-18: Subtle animations: fade-in on scroll, card hover effects, gentle transitions. No heavy motion design
- D-19: Claude writes both EN and zh-HK content (rationale, copy). User reviews after
- D-20: Chinese content tone: formal financial terms for fund names, mix of standard written Chinese + Cantonese flavor for casual UI elements

### Claude's Discretion
- Exact hero CTA text and visual composition
- Profile tab visual design within the hero
- Card hover effect specifics
- Gauge/meter component design details
- Scroll animation timing and easing
- Mobile swipe gesture implementation approach
- Profiles page layout (3 profiles presentation, how they link back to funds)
- Footer content and structure
- Exact rationale copy for each fund (both languages)
- shadcn/ui component selection for tables, cards, navigation

### Deferred Ideas (OUT OF SCOPE)
- Risk questionnaire (interactive user questionnaire) — v2 feature, after user accounts
- Dark/light theme toggle — v1 ships dark only
- About page — evaluate after core pages are live
- Social OG cards — v2 requirement (SOCL-01)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LAND-01 | User can view a landing page that explains Pennyvest's value proposition | Hero section + profile selector + strategy cards render from static config |
| LAND-02 | User can navigate from landing page to any of the 4 strategy pages | next-intl Link from navigation.ts; strategy slugs from getAllStrategies() |
| LAND-03 | User can see risk level summary for each strategy on landing page | riskLevel field on each Strategy config; risk badge on strategy card |
| LAND-04 | Landing page renders responsively on mobile and desktop | Tailwind v4 responsive prefixes; 2x2 grid → single column |
| STRT-01 | User can view a dedicated page for each of the 4 strategies | Dynamic route fund/[slug]/page.tsx; generateStaticParams over getAllStrategies() |
| STRT-03 | User can see strategy rationale explaining why allocation is structured this way | rationaleKey → getTranslations(); Phase 2 fills placeholder strings in en.json/zh-HK.json |
| STRT-07 | User can see a risk level indicator (High / Medium / Low) for each strategy | Semi-circle gauge component; riskLevel field; riskLevel i18n keys already in message files |
| I18N-01 | User can switch between English and Traditional Chinese for all UI elements | next-intl language switcher using useRouter/usePathname from navigation.ts |
| I18N-02 | Strategy rationale content is available in both languages | Fill rationale values in both en.json and zh-HK.json |
</phase_requirements>

---

## Summary

Phase 2 builds all static UI of the product. No external API calls, no charts, no live data. The Phase 1 foundation provides the complete structural scaffolding: locale routing, font loading, Tailwind v4 tokens, next-intl message files, and strategy/profile config registries. Phase 2's work is pure UI composition on top of that foundation.

The primary technical challenge is the interactive landing page (profile selector tabs that reorder strategy cards by weight). This requires a single Client Component island in an otherwise fully server-rendered page. Everything else — strategy pages, navigation, language switcher, bilingual content — is server-side rendering with next-intl.

shadcn/ui is not yet installed. It must be added in Wave 0 before any component work. The component library provides the unstyled primitives (Tabs, Card, Table, Skeleton, DropdownMenu) that Phase 2 relies on. The semi-circle risk gauge is custom SVG — no library needed.

**Primary recommendation:** Install shadcn/ui in Wave 0, write bilingual content strings, then build UI in waves: (1) shared layout/nav, (2) landing page with interactive profile selector, (3) strategy pages with sticky sidebar, (4) profiles page.

---

## Project Constraints (from CLAUDE.md)

CLAUDE.md delegates entirely to AGENTS.md, which contains one critical directive:

> **"This is NOT the Next.js you know. Read `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices."**

Verified breaking changes in Next.js 16 relevant to this phase:

1. **`middleware.ts` is deprecated, renamed to `proxy.ts`** — Phase 1 already uses `src/proxy.ts`. All references to "middleware" in tutorials are outdated. The function export is named `proxy` not `middleware` (though default export is also acceptable per the docs).

2. **`params` is now a Promise** — Every page component must `await params`: `const { locale, slug } = await params`. This pattern is established in Phase 1 and must continue for all new pages.

3. **Tailwind v4 uses CSS-first config** — No `tailwind.config.js`. All theme customization in `globals.css` `@theme` block. Already established in Phase 1.

---

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| Next.js | 16.2.1 | App Router, RSC, locale routing | Installed |
| React | 19.2.4 | UI rendering | Installed |
| TypeScript | 5.x | Type safety | Installed |
| Tailwind CSS | 4.x | Styling with CSS-first config | Installed |
| next-intl | 4.8.3 | Bilingual routing + translations | Installed |

### Must Install in Wave 0

| Library | Latest Version | Purpose | Why Needed |
|---------|---------------|---------|------------|
| shadcn/ui (CLI) | 0.9.x | Component primitives | Tabs, Card, Table, Skeleton, DropdownMenu for this phase |
| lucide-react | ~0.469+ | Icons | Globe icon for language switcher, chevrons, etc. |
| clsx | 2.1.x | Conditional class merging | Required for cn() utility in shadcn components |
| tailwind-merge | 3.x | Tailwind conflict resolution | Required for cn() utility |

```bash
# Using pnpm (project package manager)
pnpm add lucide-react clsx tailwind-merge
npx shadcn@latest init
# Then add individual components as needed:
npx shadcn@latest add tabs card table skeleton dropdown-menu button badge
```

**Version verification note:** `package.json` uses `pnpm@8.15.5`. Always use `pnpm add` not `npm install` for this project.

### shadcn/ui Components Needed This Phase

| Component | Used For |
|-----------|---------|
| `Tabs` | Profile selector (Conservative/Balanced/Aggressive) in hero |
| `Card` | Strategy cards on landing page; skeleton placeholders on strategy pages |
| `Table` | Static holdings table on strategy pages |
| `Skeleton` | "Coming Soon" placeholder sections (Phase 3 preview) |
| `DropdownMenu` | Language switcher dropdown |
| `Badge` | Risk level labels; weight % badges on strategy cards |
| `Button` | CTA in hero; general use |

---

## Architecture Patterns

### Recommended Directory Structure for Phase 2

```
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx              # EXISTING — add Header + Footer here
│       ├── page.tsx                # REPLACE — becomes landing page
│       ├── fund/
│       │   └── [slug]/
│       │       └── page.tsx        # NEW — strategy detail page
│       └── profiles/
│           └── page.tsx            # NEW — profiles page
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # NEW — transparent/solid, desktop + mobile
│   │   ├── MobileTabBar.tsx        # NEW — 5-tab bottom nav
│   │   └── Footer.tsx              # NEW
│   ├── landing/
│   │   ├── HeroSection.tsx         # NEW — full-screen hero with profile selector
│   │   ├── ProfileSelector.tsx     # NEW — "use client" tabs that reorder cards
│   │   └── StrategyCard.tsx        # NEW — card with risk badge, tagline, weight badge
│   ├── strategy/
│   │   ├── RiskGauge.tsx           # NEW — custom SVG semi-circle meter
│   │   ├── HoldingsTable.tsx       # NEW — static 3-column table
│   │   ├── AllocationSidebar.tsx   # NEW — sticky right column
│   │   └── ComingSoonCard.tsx      # NEW — Skeleton placeholder for Phase 3
│   └── ui/                         # shadcn/ui components copied here by CLI
│       └── (shadcn files)
├── messages/
│   ├── en.json                     # Fill rationale + new UI keys
│   └── zh-HK.json                  # Fill rationale + new UI keys
└── lib/
    └── strategies/                 # EXISTING — no changes needed
```

### Pattern 1: Server Component Pages with Client Island for Interactivity

**What:** All pages are RSC (server components) by default in Next.js 16 App Router. The only Client Component in Phase 2 is `ProfileSelector` on the landing page, because it needs `useState` to track the selected profile and reorder cards.

**When to use:** Push `"use client"` as deep as possible. The entire landing page layout stays server-rendered; only the interactive profile tabs + card grid become client components.

**Example:**
```typescript
// src/app/[locale]/page.tsx — Server Component
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllStrategies } from '@/lib/strategies';
import { getAllProfiles } from '@/lib/strategies/profiles';
import HeroSection from '@/components/landing/HeroSection';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const strategies = getAllStrategies();
  const profiles = getAllProfiles();

  return (
    <main>
      <HeroSection strategies={strategies} profiles={profiles} t={t} />
    </main>
  );
}
```

```typescript
// src/components/landing/HeroSection.tsx — Client Component (needs useState)
'use client';
import { useState } from 'react';
// ... profile selector + card reordering logic
```

### Pattern 2: Dynamic Strategy Routes with generateStaticParams

**What:** `fund/[slug]/page.tsx` generates static pages for all 4 strategies at build time.

**When to use:** All dynamic routes where the parameter set is known at build time and content is static.

**Example:**
```typescript
// src/app/[locale]/fund/[slug]/page.tsx
import { getAllStrategies, getStrategyConfig } from '@/lib/strategies';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getAllStrategies().map((s) => ({ slug: s.slug }));
}

export default async function FundPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const strategy = getStrategyConfig(slug);
  if (!strategy) notFound();
  const t = await getTranslations();
  // ...
}
```

### Pattern 3: Scroll-Driven Header Transparency

**What:** The header starts transparent over the hero section and transitions to solid dark on scroll. This requires a Client Component wrapper for the header that listens to `window.scrollY`.

**When to use:** Landing page and strategy pages per D-14.

**Example:**
```typescript
'use client';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
      }`}
    >
      {/* ... */}
    </header>
  );
}
```

### Pattern 4: Language Switcher with next-intl useRouter

**What:** The language switcher changes the locale while preserving the current pathname.

**When to use:** Globe icon + dropdown in the header (D-13). Must be a Client Component because it uses `useRouter` and `usePathname`.

**Example:**
```typescript
'use client';
import { useRouter, usePathname } from '@/i18n/navigation'; // locale-aware helpers from Phase 1
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    // DropdownMenu with EN / 中文 options
  );
}
```

### Pattern 5: Custom SVG Semi-Circle Risk Gauge (D-09)

**What:** A semi-circle meter showing Low/Medium/High risk. Built as an inline SVG — no library needed.

**When to use:** Strategy page sticky sidebar (D-10). Server Component since it only receives static props.

**Implementation approach:**
- SVG viewBox with a half-donut arc
- Three colored segments: Low (green), Medium (amber), High (red)
- Needle/indicator pointing to the active risk level
- Tailwind brand colors via CSS custom properties

```typescript
// src/components/strategy/RiskGauge.tsx — Server Component (pure display, no state)
import type { RiskLevel } from '@/lib/strategies/types';

const RISK_ANGLES: Record<RiskLevel, number> = {
  low: 210,    // leftmost third (degrees)
  medium: 270, // center
  high: 330,   // rightmost third
};

export default function RiskGauge({ level }: { level: RiskLevel }) {
  const angle = RISK_ANGLES[level];
  // SVG arc math: compute needle transform from angle
  return (
    <svg viewBox="0 0 200 110" className="w-full max-w-[200px]">
      {/* arc background segments */}
      {/* colored needle */}
    </svg>
  );
}
```

### Pattern 6: Mobile Swipe Between Fund Pages (D-15)

**What:** Horizontal swipe gesture to navigate between the 4 fund pages on mobile. This is Claude's discretion per CONTEXT.md, but the approach must be decided here.

**Recommended approach:** Use the native browser `touchstart` / `touchend` events in a Client Component wrapper. No library needed for a simple left/right swipe. The gesture should call `router.push()` to navigate to prev/next fund in the strategy order.

**Implementation:**
```typescript
'use client';
import { useRouter } from '@/i18n/navigation';
import { useRef } from 'react';

export default function SwipeNavigator({
  children,
  prevSlug,
  nextSlug,
  locale,
}: {
  children: React.ReactNode;
  prevSlug: string | null;
  nextSlug: string | null;
  locale: string;
}) {
  const router = useRouter();
  const touchStartX = useRef<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -50 && nextSlug) router.push(`/fund/${nextSlug}`);
    if (delta > 50 && prevSlug) router.push(`/fund/${prevSlug}`);
  };

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {children}
    </div>
  );
}
```

**Strategy order for swipe:** future-tech → traditional → commodities → crypto (alphabetical by slug; verified from `getAllStrategies()` which returns `Object.values(strategies)` — insertion order in the registry).

### Anti-Patterns to Avoid

- **Marking page.tsx files as `'use client'`** — Never add `"use client"` to any `page.tsx` or `layout.tsx`. Keep pages as RSC and push interactivity into leaf components.
- **Using `useTranslations()` in Server Components** — Server components must use `getTranslations()` from `next-intl/server`. `useTranslations()` is for Client Components only.
- **Forgetting `await params`** — Next.js 16 breaking change: params is a Promise. `const { slug } = params` (without await) will be undefined at runtime.
- **Using `middleware.ts` filename** — Next.js 16 deprecates this. The file must be named `proxy.ts`. Phase 1 already handles this correctly.
- **Hardcoding strategy slugs** — Always derive navigation order and slugs from `getAllStrategies()` to stay in sync with the registry.
- **Putting i18n strings in JSX** — Every visible string must be a translation key. No hardcoded English text in components.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible dropdown menu | Custom `<div>` click handler | shadcn `DropdownMenu` (Radix UI) | Focus trapping, keyboard nav, ARIA attributes are non-trivial |
| Tab component | Custom tab state + CSS | shadcn `Tabs` (Radix UI) | ARIA `tablist`/`tabpanel` roles, keyboard navigation |
| Table with responsive overflow | Custom HTML table | shadcn `Table` | Accessible, scrollable on mobile, consistent styling |
| Loading skeleton | Pulsing div with custom animation | shadcn `Skeleton` | `animate-pulse` baked in, accessible, matches shadcn component system |
| CSS class merging | String concatenation | `cn()` utility (clsx + tailwind-merge) | Tailwind class conflicts (e.g., two bg- classes) are silent bugs without tailwind-merge |
| Icon set | Custom SVGs | lucide-react | Consistent stroke weight, tree-shakeable, shadcn's native companion |

**Key insight:** shadcn/ui copies components into the codebase — it's not a runtime dependency. Full control over styling is retained while getting accessible primitives for free.

---

## Common Pitfalls

### Pitfall 1: `params` Not Awaited

**What goes wrong:** `const { slug } = params` returns `undefined` in Next.js 16 because `params` is a `Promise<{slug: string}>`.

**Why it happens:** Next.js 16 changed params to return a Promise (breaking change). Training data and most tutorials show the synchronous pattern.

**How to avoid:** Always `const { locale, slug } = await params;` in every `page.tsx` and `layout.tsx`. Established pattern from Phase 1 — continue it.

**Warning signs:** Build-time TypeScript error `Type 'Promise<{slug: string}>' has no property 'slug'` or runtime `undefined` slug.

### Pitfall 2: Translation Keys Undefined at Runtime

**What goes wrong:** `t('strategies.futureTech.rationale')` returns the key string or throws because the value was never filled in.

**Why it happens:** Phase 1 set all `rationale` values to placeholder strings. Phase 2 must fill them with real content before any strategy page renders.

**How to avoid:** Fill `src/messages/en.json` and `src/messages/zh-HK.json` rationale values in Wave 0 before building any page components. Verify with `pnpm build` — next-intl will warn on missing keys.

**Warning signs:** Pages showing key strings like `"strategies.futureTech.rationale"` instead of actual text.

### Pitfall 3: Server Component Importing Client-Only Hook

**What goes wrong:** `useTranslations()` called in a file without `"use client"` — React throws an error.

**Why it happens:** next-intl has two translation APIs: `getTranslations()` for Server Components and `useTranslations()` for Client Components. They are not interchangeable.

**How to avoid:** Server Components (page.tsx, layout.tsx, any async component): `import { getTranslations } from 'next-intl/server'`. Client Components with `"use client"`: `import { useTranslations } from 'next-intl'`.

### Pitfall 4: shadcn/ui Components Importing from Wrong Path

**What goes wrong:** After `npx shadcn@latest init`, the CLI configures path aliases. If the `components.json` path aliases don't match `tsconfig.json`, imports break.

**Why it happens:** shadcn/ui init creates `components.json` with component paths; it must match the `@/` alias already in `tsconfig.json` (`src/` base).

**How to avoid:** During `npx shadcn@latest init`, set the components directory to `src/components/ui` and confirm the `@/` alias matches existing tsconfig. Run `pnpm build` after init to verify.

### Pitfall 5: CSS Custom Properties Not Available in Tailwind v4 Classes

**What goes wrong:** Writing `text-[var(--color-brand-green)]` or referring to custom properties in Tailwind utilities that weren't declared in the `@theme` block.

**Why it happens:** Tailwind v4 generates utility classes from `@theme` tokens. Tokens defined in `@theme` as `--color-brand-green` become available as `text-brand-green`, `bg-brand-green`, etc. (Tailwind auto-maps `--color-*` tokens to color utilities).

**How to avoid:** Use the mapped utility names: `text-brand-green`, `bg-background`, `border-border`, `text-text-primary` etc. These are already defined in `globals.css`. Don't use arbitrary `[]` syntax for tokens that have mapped names.

### Pitfall 6: Profile Selector Hydration Mismatch

**What goes wrong:** If the profile selector default state differs between server and client renders, React throws a hydration error.

**Why it happens:** The server renders with no profile selected (or default "balanced"), and if the client somehow initializes differently, the DOM mismatches.

**How to avoid:** Initialize `useState('balanced')` on the client component. Pass the strategy data from the server as props so the initial render is deterministic. Avoid reading `localStorage` or URL params to set default profile (that would differ between server and client).

---

## Code Examples

Verified patterns from Next.js 16 docs and Phase 1 code:

### Async Params Pattern (established in Phase 1)
```typescript
// Source: node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md
// and existing src/app/[locale]/layout.tsx
export default async function FundPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params; // MUST be awaited
  setRequestLocale(locale);
  // ...
}
```

### next-intl Server vs Client Translation
```typescript
// Server Component (page.tsx, layout.tsx, any async component)
import { getTranslations, setRequestLocale } from 'next-intl/server';
const t = await getTranslations('strategies');
t('futureTech.name') // => "Future Tech" | "未來科技"

// Client Component ('use client')
import { useTranslations } from 'next-intl';
const t = useTranslations('strategies');
t('futureTech.name') // same result, but hook-based
```

### Locale-Aware Navigation (from src/i18n/navigation.ts)
```typescript
// Source: src/i18n/navigation.ts — already established
import { Link, useRouter, usePathname } from '@/i18n/navigation';

// In Server Components:
<Link href="/fund/future-tech">Future Tech</Link>  // auto-prefixes /en/ or /zh/

// In Client Components:
const router = useRouter();
const pathname = usePathname();
router.replace(pathname, { locale: 'zh-HK' }); // language switch
```

### generateStaticParams for Locale + Slug
```typescript
// Both locale and slug must be generated for full static output
export function generateStaticParams() {
  const locales = ['en', 'zh-HK'];
  const strategies = getAllStrategies();
  return locales.flatMap((locale) =>
    strategies.map((s) => ({ locale, slug: s.slug }))
  );
}
// Note: locale generateStaticParams is inherited from the [locale] layout
// Only slug is needed in the [slug] page's generateStaticParams
export function generateStaticParams() {
  return getAllStrategies().map((s) => ({ slug: s.slug }));
}
```

### Tailwind v4 Theme Tokens (from globals.css)
```css
/* Source: src/app/globals.css — established in Phase 1 */
/* Existing tokens usable as Tailwind utilities: */
/* bg-background, bg-surface, bg-surface-hover */
/* text-text-primary, text-text-secondary, text-text-muted */
/* border-border */
/* text-brand-green, bg-brand-green, text-brand-teal */
/* font-family-sans (auto-applied via body rule) */
```

---

## Bilingual Content: Strategy Rationale

Phase 2 must fill in the 4 rationale placeholder values in both message files. Content spec per D-16: 3-5 sentences, thesis + audience + key idea. D-20: Chinese tone = formal financial terminology for fund names, mix of written Chinese + Cantonese flavor for casual elements.

### Rationale Draft Guidelines

**Future Tech (高風險 / high):**
- EN: Concentrated bet on companies shaping the next decade of computing — AI chips, EVs, genomics, and disruptive ETFs. Suitable for investors with 10+ year horizons who can stomach 30-50% drawdowns. The thesis: technological discontinuity creates outsized winners.
- zh-HK: 集中押注引領下一個十年計算革命的企業——人工智能芯片、電動車、基因組學及顛覆性ETF。適合能承受30-50%回撤、投資期限超過十年的進取型投資者。核心理念：技術斷層創造超額回報。

**Traditional Industries (低風險 / low):**
- EN: Blue-chip companies with decades of dividend history across consumer staples, healthcare, finance, and real estate. Designed for capital preservation with inflation-beating income. These companies have survived multiple recessions and continue to compound quietly.
- zh-HK: 涵蓋消費必需品、醫療保健、金融及房地產的藍籌企業，具備數十年派息記錄。旨在保本的同時提供跑贏通脹的收入來源。這些企業歷經多次經濟衰退，仍能持續穩健增長。

**Commodities (中等風險 / medium):**
- EN: Physical assets that tend to hold value when paper assets don't — gold, oil, agricultural commodities, and diversified commodity ETFs. Acts as a portfolio hedge against inflation and currency debasement. Best used as a stabilizing allocation rather than a growth engine.
- zh-HK: 當紙質資產失效時往往能保值的實物資產——黃金、石油、農業商品及多元化商品ETF。可對沖通脹及貨幣貶值風險，是平衡組合的穩定器，而非增長引擎。

**Crypto (高風險 / high):**
- EN: Pure-play exposure to decentralized digital assets led by Bitcoin and Ethereum, with selective allocation to high-conviction Layer 1 protocols. Extremely volatile — 80%+ drawdowns are historical precedent. Sized for investors treating this as a high-risk/high-reward satellite position.
- zh-HK: 專注於比特幣和以太坊等去中心化數字資產，並選擇性配置高確信度的Layer 1協議。波動性極高，歷史上曾出現逾80%的最大回撤。適合將其視為高風險高回報衛星倉位的投資者。

---

## Additional i18n Keys Needed

The following keys must be added to both message files for Phase 2 UI elements:

```json
{
  "navigation": {
    "funds": "Funds",
    "profiles": "Profiles",
    "switchLanguage": "中文",
    "futureTech": "Future Tech",
    "traditional": "Traditional",
    "commodities": "Commodities",
    "crypto": "Crypto"
  },
  "landing": {
    "hero": {
      "tagline": "Invest with clarity.",
      "subtagline": "Four strategies. Plain language. Both languages.",
      "cta": "Explore Strategies"
    },
    "profileSelector": {
      "label": "Pick your investor profile",
      "weightLabel": "{weight}% allocation"
    }
  },
  "strategy": {
    "holdingsTable": {
      "ticker": "Ticker",
      "name": "Name",
      "weight": "Weight"
    },
    "sidebar": {
      "allocationTitle": "Allocation",
      "profilesLink": "View Investor Profiles"
    },
    "comingSoon": {
      "charts": "Performance Chart",
      "prices": "Live Prices",
      "news": "AI News Analysis",
      "label": "Coming in Phase 3"
    }
  },
  "profiles": {
    "conservative": { "name": "Conservative", "description": "..." },
    "balanced": { "name": "Balanced", "description": "..." },
    "aggressive": { "name": "Aggressive", "description": "..." }
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` | `proxy.ts` | Next.js v16.0.0 | Must use new filename; old name deprecated |
| `params.slug` (sync) | `(await params).slug` | Next.js 15+ | Synchronous access returns undefined |
| `tailwind.config.js` | `@theme {}` in CSS | Tailwind v4 | No JS config file; CSS-first |
| `next-i18next` | `next-intl` | App Router era | next-i18next is Pages Router only |
| `useTranslations` everywhere | `getTranslations` in RSC | next-intl 3+ | Server Components use the server import |

**Deprecated/outdated:**
- `middleware.ts`: renamed to `proxy.ts` in Next.js 16. The function inside can still be `export default` but the recommended named export is `export function proxy()`.
- Synchronous `params` access: `const { slug } = params` without `await` is a runtime bug in Next.js 15+.

---

## Open Questions

1. **shadcn/ui compatibility with Tailwind v4**
   - What we know: shadcn/ui CLI injects CSS variables into `globals.css` and generates Tailwind utility classes. Tailwind v4 changed the config model significantly.
   - What's unclear: Whether `npx shadcn@latest init` correctly detects and configures for Tailwind v4 vs v3. The CLI may write a `tailwind.config.js` that conflicts with Tailwind v4's CSS-first model.
   - Recommendation: Run `npx shadcn@latest init` in Wave 0 and inspect what it writes. If it creates `tailwind.config.js`, check if it conflicts with the existing `@theme` block. The existing theme tokens may need to be mapped to shadcn/ui's expected CSS variable names (e.g., `--background`, `--foreground`, `--primary`).

2. **Strategy card reorder animation on profile switch**
   - What we know: D-03 requires cards to reorder by weight when a profile is selected. React re-render will update the order.
   - What's unclear: Whether to use CSS transitions for the reorder animation. FLIP animation (First Last Invert Play) is the standard approach but requires measuring DOM positions.
   - Recommendation: Start with instant reorder (no animation) — meets the requirement. Add CSS transition if time permits. Do not use an animation library (deferred per D-18 "subtle only").

3. **Swipe navigation threshold on mobile**
   - What we know: 50px delta threshold is proposed (see Pattern 6).
   - What's unclear: Whether this threshold feels natural on small screens. May need tuning.
   - Recommendation: Use 50px as starting point; note in implementation that threshold may need UX testing.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js dev server | ✓ | (system) | — |
| pnpm | Package management | ✓ | 8.15.5 | — |
| next-intl | i18n | ✓ | 4.8.3 | — |
| shadcn/ui CLI | Component installation | ✗ | — | Must install in Wave 0 |
| lucide-react | Icons | ✗ | — | Must install in Wave 0 |
| clsx / tailwind-merge | cn() utility | ✗ | — | Must install in Wave 0 |

**Missing dependencies with no fallback:**
- `shadcn/ui`, `lucide-react`, `clsx`, `tailwind-merge` — all must be installed in Wave 0 before component work begins. Installation command: `pnpm add lucide-react clsx tailwind-merge && npx shadcn@latest init`

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed — Wave 0 must add Vitest |
| Config file | `vitest.config.ts` — Wave 0 creates |
| Quick run command | `pnpm vitest run --reporter=dot` |
| Full suite command | `pnpm vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LAND-01 | Landing page renders value proposition | smoke (build check) | `pnpm build` | ❌ Wave 0 |
| LAND-02 | Strategy links navigate correctly | unit (Link href check) | `pnpm vitest run tests/landing.test.tsx` | ❌ Wave 0 |
| LAND-03 | Risk badge present on each strategy card | unit | `pnpm vitest run tests/strategy-card.test.tsx` | ❌ Wave 0 |
| LAND-04 | Responsive layout at 375px and 1280px | manual/visual | — | Manual |
| STRT-01 | All 4 fund pages exist at correct slugs | unit (generateStaticParams) | `pnpm vitest run tests/fund-page.test.tsx` | ❌ Wave 0 |
| STRT-03 | Rationale text renders (not placeholder) | unit | `pnpm vitest run tests/fund-page.test.tsx` | ❌ Wave 0 |
| STRT-07 | Risk gauge renders correct level | unit (RiskGauge) | `pnpm vitest run tests/risk-gauge.test.tsx` | ❌ Wave 0 |
| I18N-01 | Language switcher changes locale | unit (useRouter mock) | `pnpm vitest run tests/language-switcher.test.tsx` | ❌ Wave 0 |
| I18N-02 | zh-HK rationale is non-placeholder text | unit (message file check) | `pnpm vitest run tests/i18n-content.test.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm build` — catches RSC/Client Component boundary errors, missing translations, TypeScript errors
- **Per wave merge:** `pnpm vitest run && pnpm build`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` — configure for Next.js App Router (jsdom environment, path aliases)
- [ ] `tests/` directory with test files for each requirement above
- [ ] Install Vitest: `pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`
- [ ] Install shadcn/ui + lucide-react + cn() deps (blocks all component work)

---

## Sources

### Primary (HIGH confidence)
- `/Users/laichan/code/pennyvest/v1/node_modules/next/dist/docs/` — Next.js 16 official docs, read directly from installed package. Confirms: proxy.ts file convention, async params pattern, RSC/Client Component boundaries, Tailwind v4 setup
- `/Users/laichan/code/pennyvest/v1/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` — Confirmed `middleware.ts` → `proxy.ts` deprecation in v16.0.0
- `/Users/laichan/code/pennyvest/v1/src/` — Phase 1 code (layout.tsx, routing.ts, navigation.ts, strategies/, messages/) — all patterns verified directly from codebase

### Secondary (MEDIUM confidence)
- next-intl 4.8.3 `package.json` peerDependencies — confirms compatibility with Next.js 16 and React 19
- `.planning/research/STACK.md` and `.planning/research/ARCHITECTURE.md` — project research from Phase 1, verified against installed packages

### Tertiary (LOW confidence)
- shadcn/ui + Tailwind v4 compatibility — uncertain; flagged as Open Question #1 requiring Wave 0 verification

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified from installed node_modules and package.json
- Architecture patterns: HIGH — verified against Next.js 16 docs and Phase 1 established patterns
- Bilingual content: HIGH — keys verified from existing message files; rationale drafts are Claude's discretion
- shadcn/ui + Tailwind v4 interaction: LOW — flagged as open question requiring hands-on verification

**Research date:** 2026-03-26
**Valid until:** 2026-04-25 (30 days; Tailwind v4 and shadcn/ui are actively evolving but project is already committed to these versions)
