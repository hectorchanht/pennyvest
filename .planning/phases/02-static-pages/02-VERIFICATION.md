---
phase: 02-static-pages
verified: 2026-03-26T14:00:00Z
status: passed
score: 18/18 must-haves verified
re_verification: false
---

# Phase 2: Static Pages Verification Report

**Phase Goal:** Users can navigate the full product — landing page to any strategy — read all static content bilingually, and see the correct risk level and rationale before any live data exists
**Verified:** 2026-03-26T14:00:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #  | Truth                                                                                                    | Status     | Evidence                                                                                                    |
|----|----------------------------------------------------------------------------------------------------------|------------|-------------------------------------------------------------------------------------------------------------|
| 1  | shadcn/ui components (Tabs, Card, Table, Skeleton, DropdownMenu, Badge, Button) are installed            | VERIFIED   | All 7 files exist in `src/components/ui/`                                                                   |
| 2  | cn() utility exists at src/lib/utils.ts and merges Tailwind classes correctly                            | VERIFIED   | File exports `cn()` using `clsx` + `twMerge` at line 4                                                     |
| 3  | All 4 strategy rationale values are filled with real bilingual content in both en.json and zh-HK.json    | VERIFIED   | "Concentrated bet on companies..." in en.json line 26; "集中押注..." in zh-HK.json line 26                   |
| 4  | Language switcher dropdown toggles between EN and zh-HK, preserving the current pathname                 | VERIFIED   | `router.replace(pathname, { locale: newLocale })` in LanguageSwitcher.tsx line 21                          |
| 5  | Desktop header shows Pennyvest logo left, fund links center, language switcher right                     | VERIFIED   | Header.tsx: logo Link, `hidden md:flex` nav with all 4 fund links + profiles, LanguageSwitcher in right div |
| 6  | Mobile bottom tab bar shows 5 tabs (future-tech, traditional, profiles center, commodities, crypto)      | VERIFIED   | MobileTabBar.tsx defines 5 tabs in correct order with `md:hidden` class                                     |
| 7  | Footer renders with basic site info in both languages                                                    | VERIFIED   | Footer.tsx is a Server Component using `getTranslations('footer')`, renders tagline + copyright             |
| 8  | User sees a full-screen hero section with a value proposition tagline and CTA button                     | VERIFIED   | HeroSection.tsx: `min-h-screen flex flex-col items-center justify-center`, Button with brand-green styling  |
| 9  | User can select Conservative / Balanced / Aggressive profile tabs and see strategy cards reorder         | VERIFIED   | ProfileSelector.tsx: `useState('balanced')`, `.sort()` by weight, shadcn Tabs with onValueChange           |
| 10 | Each strategy card shows fund name, risk badge (Low/Medium/High), tagline, and weight % badge            | VERIFIED   | StrategyCard.tsx: Card with riskColors mapping, conditional weight Badge, CardTitle + CardDescription       |
| 11 | Strategy cards are in a 2x2 grid on desktop and single-column stack on mobile                            | VERIFIED   | ProfileSelector.tsx: `grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6`                                       |
| 12 | Clicking a strategy card navigates to /fund/{slug} in the current locale                                 | VERIFIED   | StrategyCard.tsx wraps in `<Link href={/fund/${slug}}>` from `@/i18n/navigation`                            |
| 13 | User can visit /fund/future-tech, /fund/traditional, /fund/commodities, /fund/crypto                     | VERIFIED   | Build generates all 8 fund pages (4 slugs × 2 locales) via `generateStaticParams`                          |
| 14 | Each strategy page shows the fund rationale in the user's selected language                              | VERIFIED   | fund/[slug]/page.tsx: `t(strategy.rationaleKey)` rendered as `<p>` in rationale section                    |
| 15 | Each strategy page shows a semi-circle risk gauge indicating Low/Medium/High                             | VERIFIED   | RiskGauge.tsx: SVG with `viewBox="0 0 200 120"`, 3 arc segments, needle using needleAngles record           |
| 16 | Each strategy page shows a static holdings table with Ticker, Name, and Weight % columns                 | VERIFIED   | HoldingsTable.tsx: shadcn Table with 3 columns, sorted by weight descending, Math.round formatting          |
| 17 | A sticky sidebar on desktop shows the risk gauge, mini allocation list, and link to profiles page        | VERIFIED   | AllocationSidebar.tsx: `sticky top-20`, RiskGauge, allocation list, Link to `/profiles`                    |
| 18 | Phase 3 placeholder sections render as skeleton cards with 'Coming Soon' labels                          | VERIFIED   | ComingSoonCard.tsx: `border-dashed`, 3 Skeleton elements, label text — 3 instances in fund page             |
| 19 | User can swipe left/right between fund pages on mobile                                                   | VERIFIED   | SwipeNavigator.tsx: `onTouchStart`/`onTouchEnd`, delta logic with `router.push(/fund/${nextSlug})`          |
| 20 | User can visit /profiles and see 3 investor profiles with their fund weight breakdowns                   | VERIFIED   | profiles/page.tsx: maps `getAllProfiles()`, shows name, description, weight progress bars with fund links   |
| 21 | All visible text changes language when locale is switched                                                | VERIFIED   | All page-level text pre-translated via `getTranslations()` in Server Components; both locales statically built |

**Score:** 21/21 truths verified (18/18 from plan must_haves — all confirmed)

---

### Required Artifacts

| Artifact                                           | Expected                                         | Status     | Details                                              |
|----------------------------------------------------|--------------------------------------------------|------------|------------------------------------------------------|
| `src/lib/utils.ts`                                 | cn() utility combining clsx + tailwind-merge     | VERIFIED   | Exports `cn()` at line 4                             |
| `src/messages/en.json`                             | Complete English i18n strings with real rationale| VERIFIED   | 86 lines, contains "Concentrated bet on companies"   |
| `src/messages/zh-HK.json`                          | Complete Traditional Chinese i18n strings        | VERIFIED   | 86 lines, contains "集中押注"                          |
| `src/components/layout/Header.tsx`                 | Responsive header with scroll transition         | VERIFIED   | 'use client', scrolled state, window.scrollY > 80    |
| `src/components/layout/MobileTabBar.tsx`           | 5-tab bottom navigation for mobile               | VERIFIED   | 'use client', md:hidden, 5 tabs, usePathname         |
| `src/components/layout/LanguageSwitcher.tsx`       | Globe icon dropdown switching locale             | VERIFIED   | 'use client', useRouter, usePathname, Globe icon     |
| `src/components/layout/Footer.tsx`                 | Site footer with bilingual content               | VERIFIED   | Server Component, getTranslations, tagline+copyright |
| `src/components/landing/HeroSection.tsx`           | Full-screen hero with CTA and profile selector   | VERIFIED   | 'use client', min-h-screen, Button, ProfileSelector  |
| `src/components/landing/ProfileSelector.tsx`       | Tab component for 3 profiles                     | VERIFIED   | 'use client', useState('balanced'), Tabs, .sort()    |
| `src/components/landing/StrategyCard.tsx`          | Strategy card with risk badge, tagline, weight   | VERIFIED   | Link to /fund/, Badge, Card, riskColors mapping      |
| `src/app/[locale]/page.tsx`                        | Landing page server component                    | VERIFIED   | getAllStrategies, getAllProfiles, HeroSection         |
| `src/components/strategy/RiskGauge.tsx`            | SVG semi-circle risk meter                       | VERIFIED   | svg, viewBox, 3 arc segments, needle angles          |
| `src/components/strategy/HoldingsTable.tsx`        | 3-column static holdings table                   | VERIFIED   | Table, TableHeader, TableBody, TableCell, Math.round |
| `src/components/strategy/AllocationSidebar.tsx`    | Sticky sidebar with risk gauge and allocation    | VERIFIED   | sticky, RiskGauge, Link to /profiles                 |
| `src/components/strategy/ComingSoonCard.tsx`       | Skeleton placeholder for Phase 3 features        | VERIFIED   | Skeleton, Card, border-dashed                        |
| `src/components/strategy/SwipeNavigator.tsx`       | Touch swipe navigation between fund pages        | VERIFIED   | 'use client', touchstart, touchend, router.push      |
| `src/app/[locale]/fund/[slug]/page.tsx`            | Dynamic fund page with generateStaticParams      | VERIFIED   | generateStaticParams, await params, all imports      |
| `src/app/[locale]/profiles/page.tsx`               | Profiles page showing 3 investor profiles        | VERIFIED   | getAllProfiles, getAllStrategies, Link to fund pages  |

---

### Key Link Verification

| From                                    | To                                    | Via                                             | Status   | Details                                                                        |
|-----------------------------------------|---------------------------------------|-------------------------------------------------|----------|--------------------------------------------------------------------------------|
| `src/app/[locale]/layout.tsx`           | `src/components/layout/Header.tsx`    | import and render in layout body                | WIRED    | `import Header from '@/components/layout/Header'` + `<Header />` in JSX       |
| `src/components/layout/LanguageSwitcher.tsx` | `src/i18n/navigation.ts`         | useRouter and usePathname for locale switching   | WIRED    | `import { useRouter, usePathname } from '@/i18n/navigation'`                  |
| `src/app/[locale]/page.tsx`             | `src/components/landing/HeroSection.tsx` | import and render, passing strategies + profiles | WIRED  | `import HeroSection` + `<HeroSection {...heroProps} />`                        |
| `src/components/landing/HeroSection.tsx` | `src/components/landing/ProfileSelector.tsx` | renders ProfileSelector with profiles data | WIRED | `import ProfileSelector` + `<ProfileSelector ... />`                           |
| `src/components/landing/StrategyCard.tsx` | `/fund/{slug}`                      | Link component wrapping the card                | WIRED    | `<Link href={/fund/${slug}}>` from `@/i18n/navigation`                        |
| `src/app/[locale]/fund/[slug]/page.tsx` | `src/lib/strategies/index.ts`         | getStrategyConfig(slug) and getAllStrategies()   | WIRED    | Both functions imported and called, `notFound()` on invalid slug               |
| `src/app/[locale]/fund/[slug]/page.tsx` | `src/components/strategy/*`           | imports all 4 strategy components               | WIRED    | HoldingsTable, AllocationSidebar, ComingSoonCard, SwipeNavigator all imported  |
| `src/components/strategy/SwipeNavigator.tsx` | `src/i18n/navigation.ts`         | useRouter for swipe navigation                  | WIRED    | `import { useRouter } from '@/i18n/navigation'` + `router.push(/fund/${nextSlug})` |

---

### Data-Flow Trace (Level 4)

Static content phase — all data originates from local config files and i18n message files, not external APIs. Data flows are deterministic at build time.

| Artifact                              | Data Variable      | Source                            | Produces Real Data | Status   |
|---------------------------------------|--------------------|-----------------------------------|--------------------|----------|
| `src/app/[locale]/page.tsx`           | strategies, profiles | `getAllStrategies()`, `getAllProfiles()` | Yes — strategy configs + profiles.ts | FLOWING |
| `src/app/[locale]/fund/[slug]/page.tsx` | strategy, rationale | `getStrategyConfig(slug)`, `t(rationaleKey)` | Yes — strategy config + en/zh-HK.json | FLOWING |
| `src/app/[locale]/profiles/page.tsx`  | profiles, strategies | `getAllProfiles()`, `getAllStrategies()` | Yes — profiles.ts with real weights | FLOWING |
| `src/components/landing/ProfileSelector.tsx` | sortedStrategies | props from page.tsx + `.sort()` by weight | Yes — real weight data from profiles | FLOWING |
| `src/components/strategy/RiskGauge.tsx` | level, label      | props from AllocationSidebar via fund page | Yes — `strategy.riskLevel` from config | FLOWING |
| `src/components/strategy/HoldingsTable.tsx` | allocations    | props from fund page, `strategy.allocations` | Yes — real tickers, names, weights | FLOWING |

No hollow props, no hardcoded empty arrays, no disconnected data sources detected.

---

### Behavioral Spot-Checks

Build output confirms static generation of all expected routes:

| Behavior                                     | Check                                                   | Result                                        | Status |
|----------------------------------------------|---------------------------------------------------------|-----------------------------------------------|--------|
| All 4 fund pages exist for both locales      | Build output route listing                              | /en/fund/{4 slugs} + /zh-HK/fund/{4 slugs}   | PASS   |
| Profiles pages exist for both locales        | Build output route listing                              | /en/profiles + /zh-HK/profiles               | PASS   |
| Landing page exists for both locales         | Build output route listing                              | /en + /zh-HK                                 | PASS   |
| Build compiles with no TypeScript errors     | `pnpm build` exit 0                                     | Clean build, 0 errors                         | PASS   |
| generateStaticParams produces 4 slugs        | fund/[slug]/page.tsx maps getAllStrategies()             | future-tech, traditional, commodities, crypto | PASS   |

---

### Requirements Coverage

| Requirement | Source Plan | Description                                                                       | Status    | Evidence                                                                                  |
|-------------|------------|-----------------------------------------------------------------------------------|-----------|-------------------------------------------------------------------------------------------|
| LAND-01     | 02-02      | User can view a landing page that explains Pennyvest's value proposition          | SATISFIED | HeroSection with tagline + subtagline + CTA rendered in `src/app/[locale]/page.tsx`       |
| LAND-02     | 02-02      | User can navigate from landing page to any of the 4 strategy pages                | SATISFIED | StrategyCard wraps each in `<Link href={/fund/${slug}}>` — 4 fund links present           |
| LAND-03     | 02-02      | User can see risk level summary for each strategy on landing page                 | SATISFIED | StrategyCard renders riskLabel in a color-coded Badge for each card                       |
| LAND-04     | 02-02      | Landing page renders responsively on mobile and desktop                           | SATISFIED | ProfileSelector: `grid-cols-1 md:grid-cols-2`; HeroSection: responsive text classes       |
| STRT-01     | 02-03      | User can view a dedicated page for each of the 4 strategies                       | SATISFIED | `generateStaticParams` produces 4 routes; `notFound()` for invalid slugs                  |
| STRT-03     | 02-03      | User can see strategy rationale explaining why the allocation is structured       | SATISFIED | `t(strategy.rationaleKey)` rendered as `<p>` in fund page rationale section               |
| STRT-07     | 02-03      | User can see a risk level indicator (High / Medium / Low) for each strategy       | SATISFIED | RiskGauge SVG in AllocationSidebar shows colored segment + needle for each risk level     |
| I18N-01     | 02-01      | User can switch between English and Traditional Chinese for all UI elements       | SATISFIED | LanguageSwitcher: `router.replace(pathname, { locale })` — all text via i18n keys         |
| I18N-02     | 02-01      | Strategy rationale content is available in both languages                         | SATISFIED | `rationaleKey` resolves in both en.json and zh-HK.json; both locales statically built     |

**Orphaned requirements check:** REQUIREMENTS.md assigns exactly LAND-01 through LAND-04, STRT-01, STRT-03, STRT-07, I18N-01, I18N-02 to Phase 2. No orphaned requirements.

---

### Anti-Patterns Found

Anti-pattern scan across all 18 component and page files:

| File                                          | Pattern                                   | Severity | Impact                                      |
|-----------------------------------------------|-------------------------------------------|----------|---------------------------------------------|
| `src/app/[locale]/fund/[slug]/page.tsx` L69   | Comment: "Phase 3 placeholder sections"   | INFO     | Comment describes ComingSoonCard by design  |

No stub implementations, no empty return values, no hardcoded empty arrays, no `TODO`/`FIXME` markers blocking goal achievement. The ComingSoonCard comment is a design-intent annotation, not a code stub — the cards render labeled skeleton placeholders as specified.

---

### Human Verification Required

The following items are confirmed by code analysis but require visual inspection to fully validate the goal:

**1. Language switcher UI behavior**
- **Test:** Visit `/en/`, click Globe icon, select "中文 (繁體)", verify all text on screen switches to Traditional Chinese and URL changes to `/zh-HK/`
- **Expected:** Every navigation label, hero text, card text, and page text changes. URL prefix changes from `/en/` to `/zh/` (per routing config prefix `zh-HK -> /zh`).
- **Why human:** Locale switching involves router state + server-side rendering — grep cannot trace full end-to-end behavior.

**2. Profile tab card reordering**
- **Test:** On landing page, click "Conservative" tab, observe card order. Click "Aggressive" tab, observe card order changes.
- **Expected:** Conservative: Traditional (40%) first, then Commodities (30%), Future Tech (20%), Crypto (10%). Aggressive: Future Tech (35%) and Crypto (35%) tied at top.
- **Why human:** Sort logic involves runtime state — code is correct but visual order requires browser inspection.

**3. Risk gauge needle direction**
- **Test:** Visit `/en/fund/future-tech` (high risk) and `/en/fund/traditional` (medium risk) — confirm gauge needle points into the correct arc segment.
- **Expected:** future-tech needle points to red/right zone; traditional needle points to amber/center.
- **Why human:** SVG polar math is correct in code but visual rendering of `needleAngles` record requires browser confirmation.

**4. Mobile swipe navigation**
- **Test:** On mobile viewport, visit any fund page, swipe left and right to verify navigation moves to adjacent fund.
- **Expected:** Left swipe on future-tech navigates to traditional; right swipe on traditional navigates back to future-tech.
- **Why human:** TouchEvent behavior requires a real touch device or browser touch simulation.

---

### Gaps Summary

No gaps found. All 18 must-have artifacts exist, are substantive (not stubs), are wired into the component tree, and data flows from real configuration sources (strategy configs, profiles.ts, i18n message files) through to rendered output. The build produces all 15 expected static pages (4 funds × 2 locales + 2 profiles + 2 landing + 1 not-found) with no TypeScript errors.

---

_Verified: 2026-03-26T14:00:00Z_
_Verifier: Claude (gsd-verifier)_
