# Phase 2: Static Pages - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Landing page and all four strategy page layouts, fully bilingual (EN / zh-HK), with static content — rationale, risk levels, holdings table, and placeholder sections for Phase 3 features (charts, prices, news). Also includes the profiles page, navigation system, and language switcher. No live data, no API calls, no charts, no AI.

</domain>

<decisions>
## Implementation Decisions

### Landing Page Layout
- **D-01:** Full-screen hero section with CTA ("Explore Strategies" or similar), filling the viewport
- **D-02:** Profile selector tabs (Conservative / Balanced / Aggressive) integrated into the hero area
- **D-03:** Selecting a profile highlights and reorders the 4 strategy cards below by weight, showing weight % badges on each card
- **D-04:** 4 strategy cards in a 2×2 grid below hero — fund name, risk badge, tagline. Single column stack on mobile
- **D-05:** Hero transitions to transparent header on landing page, solid dark background on scroll

### Strategy Page Structure
- **D-06:** Two-column layout on desktop — left column: rationale + holdings table + placeholder sections; right column (sticky): risk badge + allocation summary
- **D-07:** Collapses to single column on mobile
- **D-08:** Phase 3 placeholder sections (charts, prices, news) rendered as visible skeleton cards with "Coming Soon" labels — shows full page structure
- **D-09:** Risk level displayed as a gauge/meter visual (semi-circle) rather than a simple pill badge
- **D-10:** Sticky sidebar shows: risk gauge, mini allocation breakdown (ticker + weight list), link to profiles page

### Navigation & Language Switcher
- **D-11:** Desktop header: Left = Pennyvest logo, Center = fund links (Future Tech, Traditional, Commodities, Crypto) + Profiles link, Right = language dropdown
- **D-12:** Mobile: 5-tab bottom bar — 4 fund tabs + center Profiles icon. Direct access to every page
- **D-13:** Language switcher as globe icon + dropdown in the top header bar on both desktop and mobile — always accessible
- **D-14:** Header transparent over hero section, transitions to solid dark background on scroll past hero
- **D-15:** Swipeable left/right between fund pages on mobile (decided in Phase 1 — carried forward)

### Content & Copy
- **D-16:** Fund rationale: short paragraph (3-5 sentences) — thesis, who it's for, key idea. Quick to read
- **D-17:** Static holdings table: 3 columns — Ticker, Name, Weight %. Price/value columns added in Phase 3
- **D-18:** Subtle animations: fade-in on scroll, card hover effects, gentle transitions. No heavy motion design
- **D-19:** Claude writes both EN and zh-HK content (rationale, copy). User reviews after
- **D-20:** Chinese content tone: formal financial terms for fund names (未來科技, 傳統行業, 大宗商品, 加密貨幣), mix of standard written Chinese + Cantonese flavor for casual UI elements (carried from Phase 1)

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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 1 Foundation Code
- `src/app/[locale]/layout.tsx` — Root locale layout with Inter + Noto Sans TC fonts, async params pattern
- `src/app/[locale]/page.tsx` — Current placeholder home page (replace with landing page)
- `src/app/globals.css` — Tailwind v4 @theme with dark theme tokens and brand colors
- `src/i18n/routing.ts` — Locale routing config (en default, zh-HK → /zh prefix)
- `src/i18n/navigation.ts` — Link/redirect helpers for locale-aware navigation
- `src/lib/strategies/types.ts` — Strategy/AllocationProfile type definitions
- `src/lib/strategies/index.ts` — Strategy registry with getStrategyConfig() and getAllStrategies()
- `src/lib/strategies/profiles.ts` — 3 allocation profiles with getProfile() and getAllProfiles()
- `src/messages/en.json` — English message file with placeholder rationale keys
- `src/messages/zh-HK.json` — Traditional Chinese message file with placeholder rationale keys
- `src/proxy.ts` — next-intl middleware (NOT middleware.ts — Next.js 16 proxy pattern)

### Research
- `.planning/research/FEATURES.md` — Feature landscape, table stakes, differentiators
- `.planning/research/ARCHITECTURE.md` — System architecture and component boundaries
- `.planning/research/STACK.md` — Technology stack with versions

### Project Context
- `.planning/PROJECT.md` — Vision, constraints, key decisions
- `.planning/REQUIREMENTS.md` — Full requirement IDs mapped to phases

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Strategy config registry (`src/lib/strategies/index.ts`) — `getAllStrategies()` returns all 4 fund configs with slugs, risk levels, allocations, i18n keys
- Allocation profiles (`src/lib/strategies/profiles.ts`) — `getAllProfiles()` returns 3 profiles with fund weights
- Message files (`src/messages/en.json`, `zh-HK.json`) — strategy names, taglines, risk labels already keyed. Rationale values are placeholders ("Placeholder — Phase 2 content")
- Tailwind v4 theme tokens — `--color-brand-*`, `--color-bg-*` custom properties already defined in globals.css

### Established Patterns
- Async params: `const { locale } = await params;` + `setRequestLocale(locale)` in every page component
- Server components by default — `getTranslations()` from `next-intl/server`
- i18n key structure: `strategies.{slug}.name`, `strategies.{slug}.rationale`, `profiles.{slug}.name`
- next-intl `Link` from `src/i18n/navigation.ts` for locale-aware links

### Integration Points
- New pages go under `src/app/[locale]/` — need `fund/[slug]/page.tsx` and `profiles/page.tsx`
- Message files need rationale content filled in (currently placeholder strings)
- `src/app/[locale]/page.tsx` currently a stub — becomes the landing page
- No components directory exists yet — all UI components will be new

</code_context>

<specifics>
## Specific Ideas

- Profile selector in hero is interactive — tabs that update the card grid below (highlight + reorder by weight)
- Risk gauge is a visual semi-circle meter, not just a colored pill
- Bottom tab bar on mobile should feel native/app-like with 5 tabs (4 funds + profiles center)
- Transparent-to-solid header transition on landing page hero scroll
- "Coming Soon" skeleton cards maintain full page structure as preview of Phase 3 features
- Swipe between fund pages on mobile (Phase 1 decision carried forward)

</specifics>

<deferred>
## Deferred Ideas

- Risk questionnaire (interactive user 問卷) — v2 feature, after user accounts
- Dark/light theme toggle — v1 ships dark only
- About page — evaluate after core pages are live
- Social OG cards — v2 requirement (SOCL-01)

</deferred>

---

*Phase: 02-static-pages*
*Context gathered: 2026-03-26*
