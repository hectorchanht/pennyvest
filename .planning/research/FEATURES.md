# Feature Research

**Domain:** Investment portfolio information / robo-advisor / fintech education platform
**Researched:** 2026-03-26
**Confidence:** MEDIUM (training data — WebSearch and WebFetch unavailable; knowledge from Wealthfront, Betterment, Portfolio Visualizer, Morningstar as of mid-2025)

---

## Competitor Landscape (Research Basis)

Platforms analyzed from training knowledge:

- **Wealthfront** — automated investing, tax-loss harvesting, direct indexing, Path financial planner
- **Betterment** — goal-based buckets, auto-rebalancing, socially responsible portfolios, investor education
- **Portfolio Visualizer** — backtesting engine, Monte Carlo simulation, factor analysis, portfolio comparison
- **Morningstar** — fund screener, star ratings, analyst reports, portfolio X-ray, sustainability scores
- **Stash / Acorns** — thematic micro-investing, educational framing for beginners
- **Yahoo Finance** — real-time quotes, news, basic portfolio tracker, watchlists

Pennyvest's positioning: **informational/educational**, view-only, no accounts, no real-money transactions. This substantially narrows what's table stakes vs. out-of-scope.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist in any investment information platform. Missing these = product feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Asset allocation breakdown (pie/bar chart) | Every portfolio product shows allocation visually; text-only feels incomplete | LOW | Chart.js or Recharts; static data per strategy |
| Performance chart (equity curve / growth of $10K) | Users need to evaluate "how has this done?" before trusting a strategy | MEDIUM | Simulated/backtested data; needs historical prices |
| Risk level indicator | Beginner investors need immediate signal before reading details | LOW | Visual badge (Low/Medium/High); per strategy |
| Strategy rationale / "why this allocation" | Without explanation, it's just a list of tickers — not educational | LOW | Static editorial copy per strategy |
| Constituent list (what's in the portfolio) | Users need to know what assets they're being pointed toward | LOW | Ticker, name, weight, asset class |
| Current market data (prices / % change) | Seeing live prices creates trust and shows the content is maintained | MEDIUM | Yahoo Finance / CoinGecko free tier; cache aggressively |
| Legal disclaimer ("not financial advice") | Regulatory and trust expectation — absence is a red flag | LOW | Static footer + inline on strategy pages |
| Mobile-responsive layout | >60% of retail finance browsing is mobile; non-responsive = immediate bounce | LOW | Next.js + Tailwind handles this naturally |
| Page load performance | Financial data + charts must load fast; slow = untrustworthy feel | MEDIUM | SSG/ISR for static content; lazy-load charts |

### Differentiators (Competitive Advantage)

Features that set Pennyvest apart. These are where the product competes, aligned with the "understand not just what, but why" core value.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Real-time news with AI impact analysis per strategy | No competitor ties live news directly to strategy-level allocation impact for beginners; Morningstar does analyst reports but not real-time | HIGH | LLM call per news item per strategy; requires caching to control costs |
| Bilingual English / Traditional Chinese UI | Serves HK/Cantonese retail investors who are underserved by English-only platforms; Wealthfront/Betterment are US-only | MEDIUM | i18n from day 1 is harder than adding later; use next-intl or next-i18next |
| Thematic strategy framing (Future Tech, Commodities, etc.) | Beginner-friendly narrative vs. abstract "moderate risk portfolio"; makes investing approachable | LOW | Editorial/content decision, not technical complexity |
| News-to-allocation causality explanation | "Gold is up 3% because of Fed uncertainty — this helps our Commodities strategy" — bridges news literacy and investing | HIGH | Requires LLM prompt engineering; quality depends on model choice |
| "Start from a penny" beginner framing | Reduces intimidation; competitors speak to people who already invest | LOW | Tone, copy, and UX decisions |
| Curated strategy pages (not a generic screener) | Portfolio Visualizer gives you tools; Pennyvest gives you answers — lower cognitive load for beginners | LOW | Opinionated product design, not a technical feature |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good for a fintech platform but create disproportionate complexity or risk for Pennyvest v1.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| User accounts / authentication | Personalization, saved portfolios, tracking | Auth adds security surface area, GDPR/PDPO compliance burden, backend complexity — none of which validates the core content value | View-only v1; add accounts only after content is proven valuable |
| Real-time WebSocket price streaming | "Live" feel; competitors do it | Free API tiers (Yahoo Finance, CoinGecko) rate-limit aggressively; WebSocket infra adds cost; polling every 60s is indistinguishable to users | Cache + ISR revalidation every 60–300s; show "last updated" timestamp |
| Portfolio backtester (user-configurable) | Portfolio Visualizer does this; users ask for it | Building a proper backtester requires survivorship-bias-free data, corporate actions handling, dividend reinvestment — extremely high complexity | Show a single simulated equity curve per strategy (editorial, not user-configurable) |
| Social/community features (comments, likes) | Community creates retention | Moderation burden; financial misinformation risk; regulatory gray area in HK | Link to Discord/Reddit communities externally |
| Push notifications / alerts | "Notify me when gold drops" | Requires accounts, notification infra, and personalisation engine — massive scope increase | RSS feed or newsletter for major strategy updates |
| Fractional share calculator / "how much do I need" | Users naturally ask "how do I actually buy this?" | This edges toward financial advice territory; requires knowing user's broker, capital, and risk tolerance | Link to educational content about brokerages; keep Pennyvest at the strategy level |
| Fund comparison screener (like Morningstar) | Power users want it | Conflicts with "curated answers for beginners" positioning; adds data complexity | Stick to 4 opinionated strategies; add more strategies over time instead |
| Dark mode | Common feature request | Not high-value for v1; adds CSS complexity and testing surface | Ship with a clean light theme; defer dark mode to v1.x |

---

## Feature Dependencies

```
[Strategy Page]
    └──requires──> [Asset Allocation Data] (static or CMS)
    └──requires──> [Performance Chart]
                       └──requires──> [Historical Price Data]
    └──requires──> [Current Market Prices]
                       └──requires──> [Yahoo Finance / CoinGecko API Integration]
    └──requires──> [Risk Level Indicator] (static data)
    └──requires──> [Legal Disclaimer Component]

[News + AI Analysis]
    └──requires──> [News API Integration] (NewsAPI, etc.)
    └──requires──> [LLM API Integration]
    └──requires──> [Strategy Context] (to scope news relevance per strategy)
    └──requires──> [Caching Layer] (to control LLM API costs)

[Bilingual UI]
    └──requires──> [i18n Framework] (next-intl)
    └──requires──> [All User-Facing Copy in Both Languages]
    └──enhances──> [Strategy Rationale] (rationale must exist in both languages)
    └──enhances──> [News AI Analysis] (LLM must output in both languages or be run twice)

[Landing Page]
    └──requires──> [Strategy Pages] (links to them; strategy content must exist)
```

### Dependency Notes

- **Strategy Page requires Historical Price Data:** Simulated performance charts need historical prices for at least the assets in each portfolio. Yahoo Finance provides this free but rate-limited. Must be pre-fetched and cached at build time or via ISR, not on every request.
- **News AI Analysis requires Caching Layer:** Each LLM call costs money. Without caching, a spike in traffic destroys the budget. Cache news summaries for at minimum 30–60 minutes.
- **Bilingual UI requires all copy in both languages from day 1:** Retrofitting i18n is painful. All content — including AI-generated summaries — must be bilingual from launch.
- **LLM news analysis requires Strategy Context:** The LLM prompt must include portfolio composition to generate meaningful "impact analysis." This makes the News component a downstream consumer of Strategy data.

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate that users find the content valuable.

- [ ] Landing page with value proposition and links to 4 strategies — first impression and navigation
- [ ] 4 strategy pages (Future Tech, Traditional Industries, Commodities, Crypto) — the core product
- [ ] Asset allocation breakdown chart per strategy — visual clarity on what's in each portfolio
- [ ] Strategy rationale copy (English + Traditional Chinese) — the "why" that differentiates from a ticker list
- [ ] Simulated performance chart (equity curve) per strategy — proof of concept for historical returns
- [ ] Risk level indicator per strategy — beginner-essential signal
- [ ] Current price/% change for major constituents — freshness and trust signal
- [ ] Real-time news summaries with AI impact analysis per strategy — core differentiator, validates the AI angle
- [ ] Legal disclaimer ("not financial advice, educational only") — mandatory for launch
- [ ] Mobile-responsive layout — non-negotiable for any web product in 2026
- [ ] Bilingual UI (English / Traditional Chinese) — core audience requirement from day 1

### Add After Validation (v1.x)

Features to add once the core content loop is working and users are engaging.

- [ ] Email newsletter / digest of weekly strategy updates — trigger: users asking "how do I follow this?"
- [ ] Shareable strategy cards (OG image generation) — trigger: social referral traffic appearing
- [ ] Dark mode — trigger: user requests accumulate
- [ ] More strategy categories — trigger: users asking for specific asset classes not covered
- [ ] Expanded news history (last 7 days of news impact) — trigger: users wanting to track news over time

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] User accounts + saved/custom portfolios — defer: requires auth infra, adds compliance scope
- [ ] Paper trading simulator — defer: high complexity; validate content first
- [ ] Push notifications / alerts — defer: requires accounts + notification infra
- [ ] Portfolio comparison tool — defer: adds complexity; stay opinionated in v1
- [ ] Tokenized assets / Web3 integration — defer: explicitly out of scope per PROJECT.md
- [ ] Licensed fund operations — defer: business/regulatory development, not software

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Strategy pages (4 themes) | HIGH | LOW | P1 |
| Asset allocation charts | HIGH | LOW | P1 |
| Strategy rationale copy | HIGH | LOW | P1 |
| Risk level indicators | HIGH | LOW | P1 |
| Legal disclaimer | HIGH | LOW | P1 |
| Mobile-responsive layout | HIGH | LOW | P1 |
| Bilingual UI (EN + ZH-TW) | HIGH | MEDIUM | P1 |
| Simulated performance chart | HIGH | MEDIUM | P1 |
| Current market prices (constituents) | MEDIUM | MEDIUM | P1 |
| News + AI impact analysis | HIGH | HIGH | P1 — core differentiator |
| Caching layer for API + LLM calls | LOW (user-facing) | MEDIUM | P1 — cost control |
| Landing page | HIGH | LOW | P1 |
| Email newsletter | MEDIUM | MEDIUM | P2 |
| Shareable social cards | MEDIUM | LOW | P2 |
| Dark mode | LOW | LOW | P3 |
| User accounts | HIGH (future) | HIGH | P3 |
| Paper trading simulator | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

| Feature | Wealthfront | Betterment | Portfolio Visualizer | Morningstar | Pennyvest Approach |
|---------|------------|------------|---------------------|-------------|-------------------|
| Preset portfolio strategies | Yes (risk-scored) | Yes (goal-based buckets) | No (user-builds) | No (screener tools) | Yes — 4 themed strategies with editorial rationale |
| Asset allocation visualization | Yes | Yes | Yes | Yes (X-ray) | Yes — chart per strategy page |
| Performance history | Yes (live account) | Yes (live account) | Yes (backtested) | Yes (fund history) | Simulated equity curve, clearly labeled |
| Real-time news integration | No | No | No | Yes (analyst reports, not live) | Yes — with per-strategy AI impact analysis |
| Bilingual / non-English | No | No | No | Partial (regional sites) | Yes — EN + ZH-TW from launch |
| Beginner framing | Moderate | Good | No (power user tool) | Moderate | Strong — "start from a penny" ethos |
| User accounts required | Yes | Yes | No (free tier) | Freemium | No — view-only v1 |
| Legal disclaimers | Yes | Yes | Yes | Yes | Yes — mandatory |
| Mobile experience | App + web | App + web | Web only (poor mobile) | App + web | Responsive web |
| AI-generated explanations | No | No | No | No | Yes — news impact per strategy |

---

## Sources

- Wealthfront product documentation and feature pages (training knowledge, mid-2025)
- Betterment features and investor education (training knowledge, mid-2025)
- Portfolio Visualizer backtesting and analytics tools (training knowledge, mid-2025)
- Morningstar portfolio X-ray and screener (training knowledge, mid-2025)
- Stash and Acorns thematic investing features (training knowledge, mid-2025)
- Yahoo Finance free API capabilities (training knowledge, mid-2025)
- CoinGecko free API capabilities (training knowledge, mid-2025)

**Note:** WebSearch and WebFetch were unavailable during this research session. All competitor feature claims are based on training data (knowledge cutoff mid-2025). Feature lists for live products should be spot-checked against current competitor sites before finalizing roadmap decisions. Confidence is MEDIUM — core features are stable and well-established, but specific UI details or newer features may have changed.

---

*Feature research for: Investment portfolio information / fintech education platform (Pennyvest)*
*Researched: 2026-03-26*
