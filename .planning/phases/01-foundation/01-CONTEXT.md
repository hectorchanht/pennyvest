# Phase 1: Foundation - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Next.js scaffold with bilingual routing operational, strategy/fund config as TypeScript source of truth, server-only API key hygiene, and project infrastructure (cache, analytics, SEO, PWA). This phase delivers the skeleton that every subsequent phase builds on — no live data, no charts, no AI yet.

</domain>

<decisions>
## Implementation Decisions

### Fund/Strategy Data Model
- **4 fixed fund products**: Future Tech, Traditional Industries, Commodities, Crypto
- **3 preset allocation profiles**: Conservative, Balanced, Aggressive — each allocates different percentages across the 4 funds
- Total: 4 fund pages + 1 profiles page (with 3 allocation variants)
- Each fund has its own internal composition (tickers, weights) and its own risk rating
- Global mix of assets (US, HK, global markets) — not region-locked
- Mix of individual stocks + ETFs for holdings
- Claude decides: number of holdings per fund, specific tickers and weights, tier compositions (same assets different weights vs different assets), allocation percentages for Conservative/Balanced/Aggressive profiles
- Fund pages show their fund content; profile page shows how funds combine
- Both individual fund performance charts AND combined profile performance charts
- Profile preview on landing page + dedicated /en/profiles page

### Bilingual (i18n)
- Browser language detection, fallback to English
- Formal Chinese financial terms for strategy names: 未來科技, 傳統行業, 大宗商品, 加密貨幣
- Dropdown language switcher (not toggle) — extensible for future languages
- AI-generated content matches the current UI language (not always bilingual)
- Same English slugs for both languages: /zh/fund/future-tech (not /zh/fund/未來科技)
- hreflang tags for bilingual SEO — both EN and zh-HK indexed separately

### Project Structure
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

### SEO & Metadata
- SEO is critical — primary acquisition channel
- Dynamic OG social cards per fund page (fund name, allocation chart preview)
- hreflang tags linking EN ↔ zh-HK versions
- Full meta tags, structured data, sitemap

### Page Routing / URL Design
- Fund pages: `/en/fund/future-tech`, `/en/fund/traditional`, `/en/fund/commodities`, `/en/fund/crypto`
- Profiles page: `/en/profiles`
- Landing: `/en/` and `/zh/`
- Chinese uses same English slugs: `/zh/fund/future-tech`

### Visual Identity
- **Vibe**: Friendly-approachable (Robinhood/Stash feel, not Bloomberg)
- **Colors**: Green/teal tones — growth, money, trust
- **Theme**: Dark theme default
- **Typography**: Claude decides — must work well for EN + Traditional Chinese bilingual
- **Logo**: Generate a simple logo/icon as part of v1

### Content Tone
- **English**: Conversational — "Think of this fund as your bet on the future..."
- **Chinese**: Mix — Standard written Chinese for formal content (fund rationale), Cantonese flavor for casual UI elements
- **AI news tone**: Claude decides (balance between conversational and credibility)

### Mobile Experience
- **Navigation**: Bottom tab bar (app-like) on mobile
- **Fund pages**: Swipeable left/right between the 4 funds
- **Charts**: Tap to expand full-screen on mobile
- **PWA**: Full PWA — service worker, manifest, installable from browser
- **Push notifications**: Yes, for major news events that impact allocations
- **Splash screen**: Branded Pennyvest logo + loading animation on PWA open

### Claude's Discretion
- Specific tickers, weights, and compositions for each fund
- Allocation percentages for Conservative/Balanced/Aggressive profiles
- Whether fund pages cross-reference their weight in each profile
- Typography choices (must support EN + zh-HK well)
- AI news analysis tone (conversational vs neutral)
- Exact folder structure within src/
- Error handling patterns
- Loading skeleton designs

</decisions>

<specifics>
## Specific Ideas

- "4 funds are investment products — user's risk score determines the % allocation across them"
- "每隻fund其實都有佢哋本身嘅風險評分, spread risk by allocation"
- Risk questionnaire is v2 — v1 shows 3 preset profiles instead
- Landing page previews the 3 profiles + links to dedicated profiles page
- Bottom tab bar should feel app-like on mobile
- Swipe between funds feels native

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- None yet — this phase establishes all patterns

### Integration Points
- Vercel deployment (auto-deploy from git)
- Upstash Redis (cache backend)
- Google Analytics (tracking)

</code_context>

<deferred>
## Deferred Ideas

- Risk questionnaire (interactive, user fills 問卷) — v2 feature, after user accounts
- Offline support for PWA — evaluate after core content is live
- Dark/light theme toggle — v1 ships dark only

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-26*
