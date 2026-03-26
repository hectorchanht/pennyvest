---
phase: 02-static-pages
plan: "02"
subsystem: ui
tags: [react, next-intl, shadcn, tailwind, base-ui]

requires:
  - phase: 02-01
    provides: shadcn/ui components (Tabs, Card, Badge, Button), layout shell, bilingual content

provides:
  - Landing page at /en/ and /zh/ with full-screen hero section
  - Interactive profile selector tabs (Conservative/Balanced/Aggressive)
  - Strategy card grid with risk badges and weight badges
  - StrategyCard component with navigation to /fund/{slug}
  - ProfileSelector client component with tab-driven card sorting
  - HeroSection client component with CTA and animated entry

affects:
  - 03-live-data
  - fund pages (02-03 or later)

tech-stack:
  added: []
  patterns:
    - Server component pre-translates all strings, passes as props to client components (avoids useTranslations in nested client tree)
    - Landing page uses -mt-16 to offset layout header padding, allowing hero to extend behind transparent header

key-files:
  created:
    - src/components/landing/StrategyCard.tsx
    - src/components/landing/ProfileSelector.tsx
    - src/components/landing/HeroSection.tsx
  modified:
    - src/app/[locale]/page.tsx

key-decisions:
  - "All i18n translation done in server component (page.tsx), pre-translated strings passed as props to client components — avoids useTranslations in client subtree"
  - "-mt-16 on landing page wrapper offsets layout pt-16 header clearance, allowing hero to extend behind transparent header"
  - "ProfileSelector defaults to 'balanced' profile — deterministic initial state, no hydration mismatch risk"

patterns-established:
  - "Server-to-client translation pattern: server component translates all keys, client components receive pre-translated strings only"
  - "Risk badge color mapping: low=green-500, medium=amber-500, high=red-500 with /20 bg and /30 border opacity modifiers"

requirements-completed: [LAND-01, LAND-02, LAND-03, LAND-04]

duration: 10min
completed: 2026-03-26
---

# Phase 2 Plan 02: Landing Page Summary

**Interactive landing page with full-screen hero, profile selector tabs (Conservative/Balanced/Aggressive), and 2x2 strategy card grid with color-coded risk badges and weight percentage badges**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-26T12:00:00Z
- **Completed:** 2026-03-26T12:10:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- StrategyCard component with risk badge color coding (green/amber/red), optional weight badge, and Link to /fund/{slug}
- ProfileSelector client component with shadcn Tabs, defaulting to 'balanced', sorts strategy cards by weight descending
- HeroSection full-screen hero with tagline, subtagline, CTA button (brand-green), and embedded ProfileSelector
- Landing page (page.tsx) as server component pre-translating all strings for client components

## Task Commits

1. **Task 1: Build StrategyCard and ProfileSelector components** - `eac09f9` (feat)
2. **Task 2: Build HeroSection and wire landing page** - `c3034b9` (feat)

**Plan metadata:** (docs commit to follow)

## Files Created/Modified
- `src/components/landing/StrategyCard.tsx` - Strategy card with risk/weight badges, Link to fund page
- `src/components/landing/ProfileSelector.tsx` - Tab-driven card grid with weight-sorted ordering
- `src/components/landing/HeroSection.tsx` - Full-screen hero section with CTA and ProfileSelector
- `src/app/[locale]/page.tsx` - Server component landing page, pre-translates all strings

## Decisions Made
- All i18n translation happens in the server component (page.tsx). Client components receive pre-translated strings as props. This avoids needing `useTranslations` in deeply nested client component trees and keeps client bundles clean.
- The `-mt-16` on the landing page wrapper compensates for the layout's `pt-16` header clearance, allowing the hero section to extend behind the transparent header.
- ProfileSelector defaults to `'balanced'` profile — deterministic initial state avoids hydration mismatches.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all components built and verified on first pass. Build passed cleanly for both tasks.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Landing page complete and bilingual; ready for fund detail pages (likely 02-03)
- Strategy card links target /fund/{slug} — those pages need to be built in the next plan
- All LAND-* requirements met (LAND-01 through LAND-04)

---
*Phase: 02-static-pages*
*Completed: 2026-03-26*

## Self-Check: PASSED

- FOUND: src/components/landing/StrategyCard.tsx
- FOUND: src/components/landing/ProfileSelector.tsx
- FOUND: src/components/landing/HeroSection.tsx
- FOUND: commit eac09f9 (Task 1)
- FOUND: commit c3034b9 (Task 2)
