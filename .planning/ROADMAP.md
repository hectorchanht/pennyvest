# Roadmap: Pennyvest

## Overview

Pennyvest ships as a view-only, bilingual investment information platform across four phases. Phase 1 establishes the structural foundation that every page depends on — bilingual routing and strategy config. Phase 2 builds the full static page surface so the product is navigable and readable before any live data. Phase 3 wires in all external data (prices, news, AI analysis) and charts, completing the core value proposition. Phase 4 audits compliance, performance, and quality to a shippable bar.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Next.js scaffold with bilingual routing, strategy config, and server-only API key hygiene (completed 2026-03-26)
- [x] **Phase 2: Static Pages** - Landing page and all four strategy page layouts, fully bilingual, with static content (completed 2026-03-26)
- [ ] **Phase 3: Live Data, Charts, and AI** - Price feeds, caching, allocation charts, equity curves, news feed, and AI impact analysis
- [ ] **Phase 4: Compliance, Polish, and Performance** - Bilingual disclaimers, performance audit, and shippable quality bar

## Phase Details

### Phase 1: Foundation
**Goal**: The project scaffold exists with bilingual routing operational, strategy config authoritative, and no API credentials exposed to the client
**Depends on**: Nothing (first phase)
**Requirements**: I18N-04, DATA-04
**Success Criteria** (what must be TRUE):
  1. Navigating to `/en/` and `/zh/` renders the correct locale without errors
  2. All four strategy configurations (Future Tech, Traditional Industries, Commodities, Crypto) exist as TypeScript files with tickers, risk levels, and allocation weights
  3. No API key or credential is accessible in the browser's network tab or JS bundle
  4. The project builds and deploys with TypeScript strict mode passing and no ESLint errors
**Plans:** 2/2 plans complete
Plans:
- [x] 01-01-PLAN.md — Bootstrap Next.js 16 with next-intl bilingual routing and Tailwind v4 dark theme
- [x] 01-02-PLAN.md — Strategy config system (4 funds, 3 profiles) and server-only API key hygiene

### Phase 2: Static Pages
**Goal**: Users can navigate the full product — landing page to any strategy — read all static content bilingually, and see the correct risk level and rationale before any live data exists
**Depends on**: Phase 1
**Requirements**: LAND-01, LAND-02, LAND-03, LAND-04, STRT-01, STRT-03, STRT-07, I18N-01, I18N-02
**Success Criteria** (what must be TRUE):
  1. User can visit the landing page, read the value proposition, and navigate to any of the four strategy pages in both English and Traditional Chinese
  2. Each strategy page displays its risk level badge (High / Medium / Low) and written rationale above the fold
  3. The language switcher on any page changes all visible text — navigation, headings, rationale, labels — to the selected language
  4. Every page renders correctly on a 375px mobile viewport and a 1280px desktop viewport
  5. Strategy rationale content is present and readable in both English and Traditional Chinese
**Plans:** 3/3 plans complete
Plans:
- [x] 02-01-PLAN.md — Install shadcn/ui + deps, fill bilingual content, build shared layout shell (Header, MobileTabBar, Footer, LanguageSwitcher)
- [x] 02-02-PLAN.md — Landing page with hero section, profile selector tabs, and strategy card grid
- [x] 02-03-PLAN.md — Strategy fund pages (4), risk gauge, holdings table, placeholders, swipe nav, and profiles page

### Phase 02.1: Align landing page to prototype — reactive layout, mixed strategy center, prototype styling (INSERTED)

**Goal:** Landing page transformed from minimal hero splash into a content-dense, dashboard-style layout with enhanced strategy cards showing mock daily P&L data, a news digest section with impact analysis, and full bilingual support
**Requirements**: N/A (inserted phase — visual alignment, no formal requirement IDs)
**Depends on:** Phase 2
**Plans:** 2/2 plans complete

Plans:
- [x] 02.1-01-PLAN.md — Mock data layer, bilingual i18n keys, NewsCard component, and enhanced StrategyCard with data density
- [x] 02.1-02-PLAN.md — Restructure landing page layout (compact hero, NewsDigest section) and wire mock data + components

### Phase 3: Live Data, Charts, and AI
**Goal**: Users can see real allocation breakdowns, current prices, simulated performance, and AI-analyzed news for each strategy — and all data refreshes on schedule
**Depends on**: Phase 2
**Requirements**: STRT-02, STRT-04, STRT-05, STRT-06, NEWS-01, NEWS-02, NEWS-03, NEWS-04, I18N-03, DATA-01, DATA-02, DATA-03, COMP-04
**Success Criteria** (what must be TRUE):
  1. Each strategy page shows an allocation chart (pie or bar) with the correct asset weights and a constituent list with current market prices and a "last updated" timestamp
  2. Each strategy page shows a simulated equity curve chart labeled as "Simulated back-test" in the chart title
  3. Each strategy page shows aggregated news headlines with AI-generated summaries and an impact analysis explaining how each news item affects the strategy — available in both English and Traditional Chinese
  4. News content has refreshed within the last 30 minutes (verified by the "last updated" timestamp)
  5. Chart and news components display a loading skeleton while data fetches and a graceful error state if the fetch fails
**Plans:** 5 plans
Plans:
- [ ] 03-01-PLAN.md — Install Phase 3 deps, shared types (prices/news), Upstash Redis cache wrapper, env config
- [ ] 03-02-PLAN.md — Data adapters (Yahoo Finance, CoinGecko, Marketaux news) and AI analysis service
- [ ] 03-03-PLAN.md — Chart components (allocation donut, equity curve) and Phase 3 i18n keys
- [ ] 03-04-PLAN.md — Route Handlers for prices, equity curve, and news with AI analysis
- [ ] 03-05-PLAN.md — Wire into fund page: replace ComingSoonCard placeholders with live data components

### Phase 4: Compliance, Polish, and Performance
**Goal**: Every page meets the compliance bar required to operate as an educational platform, performance meets the target thresholds, and the product is ready to ship
**Depends on**: Phase 3
**Requirements**: COMP-01, COMP-02, COMP-03, PERF-01, PERF-02, PERF-03
**Success Criteria** (what must be TRUE):
  1. Every strategy page displays a "not financial advice" disclaimer above the fold in both English and Traditional Chinese with legally equivalent text
  2. Every simulated performance chart is labeled "Simulated / Hypothetical" within the chart title (not only in a footnote)
  3. Strategy pages load in under 3 seconds on a simulated 4G connection and charts lazy-load without blocking initial page render
  4. The site scores 90 or above on a Lighthouse performance audit
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 2.1 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete   | 2026-03-26 |
| 2. Static Pages | 3/3 | Complete   | 2026-03-26 |
| 2.1 Align Landing Page | 0/2 | Planned | - |
| 3. Live Data, Charts, and AI | 0/5 | Planned | - |
| 4. Compliance, Polish, and Performance | 0/TBD | Not started | - |
