---
phase: 01-foundation
plan: 01
subsystem: infra
tags: [next.js, next-intl, tailwind, i18n, typescript, pnpm]

# Dependency graph
requires: []
provides:
  - "Next.js 16.2.1 project scaffold with TypeScript strict mode, ESLint flat config, Tailwind v4"
  - "next-intl 4.8.3 bilingual routing — /en/ and /zh/ paths operational via src/proxy.ts"
  - "src/i18n/routing.ts with en/zh-HK locales and /zh path prefix mapping"
  - "src/messages/en.json and zh-HK.json with all 4 strategy translation keys"
  - "Tailwind v4 dark theme with green/teal brand tokens in globals.css @theme block"
  - "Inter + Noto Sans TC fonts loaded via next/font/google in [locale]/layout.tsx"
affects:
  - 01-foundation (all subsequent plans)
  - 02-static-pages
  - 03-live-data
  - 04-compliance

# Tech tracking
tech-stack:
  added:
    - "next 16.2.1"
    - "next-intl 4.8.3"
    - "server-only 0.0.1"
    - "tailwindcss 4.2.2"
    - "eslint 9.39.4 (flat config)"
    - "eslint-config-next 16.2.1"
    - "eslint-config-prettier 10.1.8"
    - "prettier 3.8.1"
    - "typescript 5.9.3"
    - "@tailwindcss/postcss 4.2.2"
  patterns:
    - "src/proxy.ts for next-intl middleware (NOT src/middleware.ts — Next.js 16)"
    - "Async params in [locale]/layout.tsx — const { locale } = await params"
    - "Static switch-case message loading for Turbopack compatibility (not dynamic template literals)"
    - "Tailwind v4 CSS-first @theme blocks (no tailwind.config.js)"
    - "Locale-specific fonts via next/font/google CSS variables applied to <html>"

key-files:
  created:
    - "src/proxy.ts — next-intl middleware, locale routing entry point"
    - "src/i18n/routing.ts — defineRouting with en/zh-HK locales, /zh prefix for zh-HK"
    - "src/i18n/request.ts — getRequestConfig with static switch-case message loading"
    - "src/i18n/navigation.ts — createNavigation exports (Link, redirect, usePathname, useRouter)"
    - "src/messages/en.json — English translations: navigation, strategies (4), profiles, riskLevel"
    - "src/messages/zh-HK.json — Traditional Chinese translations with formal financial terms"
    - "src/app/[locale]/layout.tsx — locale layout with NextIntlClientProvider, Inter+Noto Sans TC fonts"
    - "src/app/[locale]/page.tsx — placeholder page demonstrating getTranslations"
    - "src/app/globals.css — Tailwind v4 @theme with dark background and green/teal brand tokens"
    - ".prettierrc — semi/singleQuote/trailingComma config"
  modified:
    - "next.config.ts — withNextIntl plugin"
    - "tsconfig.json — added noUncheckedIndexedAccess"
    - "package.json — name, lint/format scripts"
    - "eslint.config.mjs — eslint-config-prettier, single-quote style"
    - "src/app/layout.tsx — minimal pass-through wrapper, imports globals.css"

key-decisions:
  - "Used src/proxy.ts (not middleware.ts) — Next.js 16 proxy pattern"
  - "Static switch-case message loading in request.ts — Turbopack cannot resolve dynamic template literal import paths"
  - "locale prefix mapping: zh-HK locale → /zh/ URL path via localePrefix.prefixes"
  - "Fonts loaded in [locale]/layout.tsx (not root layout) to apply lang-aware font variables to <html>"
  - "Root layout renders only children — locale layout owns html/body/lang"

patterns-established:
  - "Pattern: next-intl async params — always await params in layout/page"
  - "Pattern: server-only package for API key enforcement (to be applied in Phase 3)"
  - "Pattern: @theme CSS blocks for all Tailwind customization (no config file)"

requirements-completed: [I18N-04]

# Metrics
duration: 6min
completed: 2026-03-26
---

# Phase 01 Plan 01: Bootstrap Next.js 16 + Bilingual Routing Summary

**Next.js 16.2.1 scaffold with next-intl 4.8.3 bilingual routing at /en/ and /zh/, Tailwind v4 dark theme with oklch green/teal brand tokens, and Inter+Noto Sans TC fonts**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-26T10:19:06Z
- **Completed:** 2026-03-26T10:26:02Z
- **Tasks:** 2 of 2
- **Files modified:** 24

## Accomplishments
- Next.js 16.2.1 project fully scaffolded with TypeScript strict mode, ESLint flat config, Tailwind v4, pnpm
- next-intl 4.8.3 bilingual routing operational — /en/ and /zh/ paths with zh-HK locale code
- Tailwind v4 dark theme with oklch green/teal brand color tokens and Inter+Noto Sans TC fonts
- pnpm build passes with zero TypeScript errors and zero ESLint errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Bootstrap Next.js 16 with next-intl bilingual routing** - `54e17ba` (feat)
2. **Task 2: Configure Tailwind v4 dark theme with Pennyvest brand tokens** - `39a80ad` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `src/proxy.ts` — next-intl middleware (Next.js 16: proxy.ts, not middleware.ts)
- `src/i18n/routing.ts` — defineRouting with en/zh-HK locales and /zh path prefix
- `src/i18n/request.ts` — getRequestConfig with static switch-case message loading
- `src/i18n/navigation.ts` — createNavigation exports
- `src/messages/en.json` — English translations for all 4 strategies
- `src/messages/zh-HK.json` — Traditional Chinese translations (未來科技, 傳統行業, 大宗商品, 加密貨幣)
- `src/app/[locale]/layout.tsx` — locale layout with NextIntlClientProvider, Inter+Noto Sans TC
- `src/app/[locale]/page.tsx` — placeholder page with getTranslations
- `src/app/globals.css` — Tailwind v4 @theme with dark background and green/teal brand tokens
- `src/app/layout.tsx` — minimal root layout pass-through
- `next.config.ts` — withNextIntl plugin
- `tsconfig.json` — noUncheckedIndexedAccess added
- `.prettierrc` — formatting config

## Decisions Made
- Used static switch-case message loading instead of dynamic template literals in request.ts — Turbopack cannot resolve `import(\`../../messages/${locale}.json\`)` dynamic paths
- Mapped zh-HK locale to /zh/ URL path via `localePrefix.prefixes` in routing.ts — plan requires /zh/ URL
- Loaded fonts in [locale]/layout.tsx rather than root layout — locale layout owns html/body/lang, root is pass-through
- Used `subsets: ['latin']` for Noto Sans TC next/font config — TypeScript types don't include 'chinese-traditional' subset for this font

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Static switch-case message loading instead of dynamic template import**
- **Found during:** Task 1 (Bootstrap)
- **Issue:** Turbopack (Next.js 16 default bundler) cannot resolve dynamic import paths with template literals — `import(\`../../messages/${locale}.json\`)` fails at build
- **Fix:** Replaced with static switch-case block that imports each locale file explicitly
- **Files modified:** src/i18n/request.ts
- **Verification:** pnpm build passes after fix
- **Committed in:** 54e17ba (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking — Turbopack incompatibility)
**Impact on plan:** Functionally equivalent — both load the correct messages per locale. The static switch-case is actually more type-safe.

## Issues Encountered
- create-next-app refuses to scaffold into a directory with any existing files (.planning/ was present) — worked around by scaffolding into /tmp, then rsync to project directory

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Next.js 16 scaffold ready for Phase 1 Plan 02 (strategy TypeScript config files)
- All i18n infrastructure operational — subsequent plans can use getTranslations/useTranslations
- Tailwind brand tokens established — ready for shadcn/ui integration in Phase 2
- No blockers

---
*Phase: 01-foundation*
*Completed: 2026-03-26*
