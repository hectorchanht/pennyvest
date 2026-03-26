---
phase: 02-static-pages
plan: "01"
subsystem: ui
tags: [shadcn, tailwind, next-intl, i18n, layout, react]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "next-intl routing, i18n/navigation.ts, i18n/routing.ts, locale layout shell"
provides:
  - shadcn/ui component library initialized (tabs, card, table, skeleton, dropdown-menu, badge, button)
  - cn() utility from clsx + tailwind-merge at src/lib/utils.ts
  - Complete bilingual content (en.json + zh-HK.json) with real rationale for all 4 strategies
  - Header component with transparent-to-solid scroll transition and desktop fund nav
  - MobileTabBar with 5-tab bottom navigation for mobile
  - Footer as server component with bilingual tagline and copyright
  - LanguageSwitcher dropdown component using Globe icon
  - Shared layout shell wired into [locale]/layout.tsx
affects: [02-02, 02-03, 02-04, 03-live-data, all-subsequent]

# Tech tracking
tech-stack:
  added: [shadcn/ui, @base-ui/react, lucide-react, clsx, tailwind-merge, class-variance-authority, tw-animate-css]
  patterns:
    - "shadcn uses @base-ui/react primitives (not Radix) — DropdownMenu imports from @base-ui/react/menu"
    - "LanguageSwitcher uses router.replace(pathname, { locale }) pattern from @/i18n/navigation"
    - "Header scroll behavior: passive scroll listener, window.scrollY > 80 threshold"
    - "MobileTabBar fixed bottom with env(safe-area-inset-bottom) for iPhone notch"
    - "Footer is async Server Component using getTranslations from next-intl/server"

key-files:
  created:
    - src/lib/utils.ts
    - src/components/ui/button.tsx
    - src/components/ui/tabs.tsx
    - src/components/ui/card.tsx
    - src/components/ui/table.tsx
    - src/components/ui/skeleton.tsx
    - src/components/ui/dropdown-menu.tsx
    - src/components/ui/badge.tsx
    - src/components/layout/Header.tsx
    - src/components/layout/MobileTabBar.tsx
    - src/components/layout/Footer.tsx
    - src/components/layout/LanguageSwitcher.tsx
  modified:
    - src/messages/en.json
    - src/messages/zh-HK.json
    - src/app/[locale]/layout.tsx
    - src/app/globals.css
    - components.json
    - package.json

key-decisions:
  - "shadcn init chose 'Base' style (uses @base-ui/react not Radix) — components use @base-ui/react primitives"
  - "MobileTabBar tab order: future-tech | traditional | profiles (center) | commodities | crypto"
  - "Header shows desktop fund links (hidden below md); mobile only shows logo + language switcher"

patterns-established:
  - "Layout components live in src/components/layout/"
  - "Client components requiring scroll/router use 'use client' directive"
  - "Server components (Footer) use getTranslations from next-intl/server"
  - "cn() is the standard class merge utility across all components"

requirements-completed: [I18N-01, I18N-02]

# Metrics
duration: 15min
completed: 2026-03-26
---

# Phase 2 Plan 01: shadcn/ui install, bilingual content, and shared layout shell Summary

**shadcn/ui initialized with 7 components (@base-ui style), all 4 strategy rationale texts filled in bilingual (EN + zh-HK), and Header/MobileTabBar/Footer/LanguageSwitcher shell wired into locale layout**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-26T11:33:00Z
- **Completed:** 2026-03-26T11:48:40Z
- **Tasks:** 2
- **Files modified:** 16

## Accomplishments
- Installed shadcn/ui (Base style with @base-ui/react) plus lucide-react, clsx, tailwind-merge
- Replaced all 8 placeholder rationale strings with real bilingual copy across en.json and zh-HK.json
- Added landing, strategy, profiles, footer i18n sections to both message files
- Built LanguageSwitcher with Globe icon dropdown using shadcn DropdownMenu
- Built Header with passive scroll listener, transparent-to-solid transition, desktop nav links to all 4 funds + profiles
- Built MobileTabBar with 5 tabs (future-tech, traditional, profiles center, commodities, crypto) with active state
- Built Footer as async Server Component with bilingual tagline and year-interpolated copyright
- Wired all components into [locale]/layout.tsx preserving NextIntlClientProvider and generateStaticParams

## Task Commits

Each task was committed atomically:

1. **Task 1: Install shadcn/ui, dependencies, and fill all bilingual content** - `554fbbb` (feat)
2. **Task 2: Build shared layout shell — Header, MobileTabBar, Footer, LanguageSwitcher** - `aad3c26` (feat)

## Files Created/Modified
- `src/lib/utils.ts` - cn() utility combining clsx + tailwind-merge (created by shadcn init)
- `src/components/ui/button.tsx` - shadcn Button (created by shadcn init)
- `src/components/ui/tabs.tsx` - shadcn Tabs component
- `src/components/ui/card.tsx` - shadcn Card component
- `src/components/ui/table.tsx` - shadcn Table component
- `src/components/ui/skeleton.tsx` - shadcn Skeleton component
- `src/components/ui/dropdown-menu.tsx` - shadcn DropdownMenu using @base-ui/react/menu
- `src/components/ui/badge.tsx` - shadcn Badge component
- `src/components/layout/LanguageSwitcher.tsx` - Globe icon dropdown, EN/zh-HK locale switching
- `src/components/layout/Header.tsx` - Fixed header with scroll transparency transition
- `src/components/layout/MobileTabBar.tsx` - 5-tab bottom nav, md:hidden
- `src/components/layout/Footer.tsx` - Server component with bilingual footer content
- `src/messages/en.json` - Complete English i18n strings with real strategy rationale
- `src/messages/zh-HK.json` - Complete Traditional Chinese i18n strings with real rationale
- `src/app/[locale]/layout.tsx` - Imports and renders Header, MobileTabBar, Footer
- `src/app/globals.css` - Extended with shadcn CSS variables (@theme inline block, :root, .dark)
- `components.json` - shadcn configuration

## Decisions Made
- shadcn's `init -d` (defaults) selected the "Base" style which uses `@base-ui/react` primitives instead of Radix. The `DropdownMenu` component imports from `@base-ui/react/menu`. This is working correctly and @base-ui/react 1.3.0 is installed.
- Tab order for MobileTabBar placed Profiles in center position as specified in the plan.
- Header excludes nav links on mobile (mobile uses MobileTabBar), only shows logo + LanguageSwitcher.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - shadcn init ran non-interactively with `-d` flag, all components installed cleanly, build passed first attempt.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- shadcn/ui fully available for all subsequent pages (02-02, 02-03, 02-04)
- All i18n content ready for consumption in fund and profiles pages
- Layout shell renders on all locale routes; subsequent pages just need their `page.tsx` content
- No blockers for next plans in Phase 2

---
*Phase: 02-static-pages*
*Completed: 2026-03-26*
