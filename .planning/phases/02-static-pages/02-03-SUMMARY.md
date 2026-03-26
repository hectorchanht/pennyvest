---
phase: 02-static-pages
plan: "03"
subsystem: ui
tags: [next-intl, next.js, react, tailwind, shadcn, svg, strategy-pages]

# Dependency graph
requires:
  - phase: 02-static-pages
    provides: shadcn/ui components (Table, Card, Skeleton), i18n navigation helpers, strategy configs and profiles data
  - phase: 01-foundation
    provides: Next.js 16 app router structure, locale routing, getTranslations, setRequestLocale
provides:
  - 4 static fund pages at /[locale]/fund/[slug] with generateStaticParams
  - Profiles page at /[locale]/profiles with 3 investor profiles
  - RiskGauge SVG component (semi-circle, 3-segment, needle indicator)
  - HoldingsTable component (3-column shadcn Table)
  - AllocationSidebar component (sticky desktop sidebar)
  - ComingSoonCard component (dashed Card with Skeleton placeholders)
  - SwipeNavigator client component (touchstart/touchend mobile swipe)
affects: [03-live-data, 04-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - All i18n translated at page level (Server Component), pre-translated strings passed as props to all child components
    - SVG semi-circle gauge via polar coordinate math (180-degree arc, 3 segments, needle rotation)
    - generateStaticParams returns only slug array — locale params inherited from [locale] layout
    - Sticky sidebar pattern: `sticky top-20` to account for fixed header height

key-files:
  created:
    - src/components/strategy/RiskGauge.tsx
    - src/components/strategy/HoldingsTable.tsx
    - src/components/strategy/AllocationSidebar.tsx
    - src/components/strategy/ComingSoonCard.tsx
    - src/components/strategy/SwipeNavigator.tsx
    - src/app/[locale]/fund/[slug]/page.tsx
    - src/app/[locale]/profiles/page.tsx
  modified: []

key-decisions:
  - "generateStaticParams on fund/[slug]/page.tsx returns only {slug} entries — locale params come from parent [locale] layout generateStaticParams"
  - "SVG gauge uses polar-to-cartesian transform at 180° arc; needle angles: low=30°, medium=90°, high=150°"
  - "SwipeNavigator is 'use client' wrapping children — touch events are harmless no-ops on desktop"
  - "AllocationSidebar uses sticky top-20 (accounting for 64px/pt-16 header height)"

patterns-established:
  - "Strategy component pattern: server components receive pre-translated strings from page.tsx — no useTranslations() in components"
  - "Coming Soon placeholder: ComingSoonCard with border-dashed, 3 Skeletons, label text"

requirements-completed: [STRT-01, STRT-03, STRT-07]

# Metrics
duration: 18min
completed: 2026-03-26
---

# Phase 2 Plan 03: Strategy Fund Pages Summary

**4 bilingual fund pages with SVG risk gauge, holdings table, sticky sidebar, swipe navigation, and profiles page — all statically prerendered via generateStaticParams**

## Performance

- **Duration:** 18 min
- **Started:** 2026-03-26T11:55Z
- **Completed:** 2026-03-26T12:13Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Built 5 strategy UI components: RiskGauge (SVG semi-circle), HoldingsTable (shadcn Table), AllocationSidebar (sticky), ComingSoonCard (dashed Skeleton), SwipeNavigator (touch client component)
- Wired /[locale]/fund/[slug] page with two-column layout, generateStaticParams for 4 funds, bilingual rationale, holdings, Coming Soon placeholders
- Created /[locale]/profiles page with 3 investor profiles, fund weight progress bars, and links to fund pages
- All 15 static pages (4 funds × 2 locales + 2 profiles + existing pages) generate successfully

## Task Commits

Each task was committed atomically:

1. **Task 1: Build strategy page components** - `7da88cc` (feat)
2. **Task 2: Wire fund/[slug] page and create profiles page** - `2f978e5` (feat)

## Files Created/Modified
- `src/components/strategy/RiskGauge.tsx` - SVG semi-circle gauge with colored segments and needle; server component
- `src/components/strategy/HoldingsTable.tsx` - 3-column shadcn Table sorted by weight descending; server component
- `src/components/strategy/AllocationSidebar.tsx` - Sticky sidebar with RiskGauge, mini allocation list, profiles link; server component
- `src/components/strategy/ComingSoonCard.tsx` - Dashed Card with Skeleton placeholders for Phase 3 features; server component
- `src/components/strategy/SwipeNavigator.tsx` - Client component handling touchstart/touchend for mobile fund swipe
- `src/app/[locale]/fund/[slug]/page.tsx` - Dynamic fund page with generateStaticParams, two-column layout, all strategy content
- `src/app/[locale]/profiles/page.tsx` - Profiles page showing 3 investor profiles with weight breakdowns

## Decisions Made
- `generateStaticParams` on the fund page returns only `{slug}` (not `{locale, slug}`) — locale is already covered by the parent `[locale]` layout's own `generateStaticParams`
- SVG gauge uses polar-to-cartesian math with 180° arc, split into 3×60° segments; inactive segments rendered at 0.4 opacity to indicate the gauge structure
- `SwipeNavigator` wraps the entire page content so swipe works anywhere on mobile, not just in a designated region
- Sticky sidebar uses `top-20` (80px) to clear the `pt-16` (64px) fixed header with a small margin

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TouchEvent optional array access in SwipeNavigator**
- **Found during:** Task 1 (SwipeNavigator component)
- **Issue:** TypeScript strict mode flagged `e.touches[0]` as `Touch | undefined` — Object is possibly undefined
- **Fix:** Added null guards: `const touch = e.touches[0]; if (touch) touchStartX.current = touch.clientX`
- **Files modified:** src/components/strategy/SwipeNavigator.tsx
- **Verification:** Build passed TypeScript check
- **Committed in:** 7da88cc (Task 1 commit)

**2. [Rule 1 - Bug] Fixed array access in fund page prev/next slug calculation**
- **Found during:** Task 2 (fund/[slug]/page.tsx)
- **Issue:** TypeScript strict mode flagged `allStrategies[currentIndex - 1]` as `Strategy | undefined`
- **Fix:** Used intermediate variables with optional chaining: `prevStrategy?.slug ?? null`
- **Files modified:** src/app/[locale]/fund/[slug]/page.tsx
- **Verification:** Build passed TypeScript check, 15 static pages generated
- **Committed in:** 2f978e5 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 Rule 1 bugs — TypeScript strict array access)
**Impact on plan:** Both fixes required for TypeScript correctness in strict mode. No scope creep. Logic is functionally equivalent to plan code.

## Issues Encountered
None beyond the TypeScript strict mode fixes above.

## Known Stubs
None. All content is wired to real data:
- Fund rationale: live from `strategies.*.rationale` i18n keys
- Holdings: live from strategy config allocations arrays
- Risk level: live from strategy config riskLevel
- Profiles: live from getAllProfiles() returning 3 profiles with real weights

Phase 3 Coming Soon cards are explicitly labeled placeholders (by design per plan), not stubs that block the plan's goals.

## Next Phase Readiness
- All 4 fund pages and profiles page are statically prerendered and fully bilingual
- Component library is ready for Phase 3: RiskGauge, HoldingsTable, AllocationSidebar can be upgraded to use live data without breaking interfaces
- SwipeNavigator pattern established for mobile navigation between funds
- Phase 3 placeholders (ComingSoonCard) mark exactly what needs to be built next

---
*Phase: 02-static-pages*
*Completed: 2026-03-26*
