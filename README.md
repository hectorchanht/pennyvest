<p align="center">
  <img src="public/logo.svg" width="80" alt="Pennyvest logo" />
</p>

<h1 align="center">Pennyvest</h1>

<p align="center">
  <strong>Start with a penny. Build a snowball.</strong><br/>
  AI-powered strategies across every risk level.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss" alt="Tailwind v4" />
  <img src="https://img.shields.io/badge/i18n-EN%20%7C%20%E4%B8%AD%E6%96%87-green" alt="Bilingual" />
</p>

---

Pennyvest is a bilingual investment education platform that provides asset allocation suggestions across risk levels. Browse four thematic strategies, read AI-analyzed news with impact scoring, and understand how global events affect your portfolio — all in English and Traditional Chinese (more to come).

## Strategies

| Fund | Risk | Focus |
|------|------|-------|
| **Future Tech** | High | AI chips, EVs, robotics, disruptive ETFs |
| **Traditional Industries** | Low | Blue-chip dividends — food, finance, REITs |
| **Commodities** | Medium | Gold, oil, agriculture — inflation hedges |
| **Crypto** | High | BTC, ETH, SOL — digital asset exposure |

Each fund page includes a simulated $1M model portfolio with daily P&L, ranked news with impact analysis, AI-identified investment opportunities, and portfolio change notes.

## Features

- **Three investor profiles** — Conservative, Balanced, Aggressive — with interactive allocation donut
- **Fund detail pages** — Holdings table, daily performance, market values
- **News impact analysis** — Category badges, impact scores (X/10), short & mid-term outlook
- **Investment opportunities** — Confidence scoring, catalysts, risk factors, action recommendations
- **Portfolio notes** — Per-holding adjustment reasoning, risk management, cash strategy
- **Bilingual** — Full EN / zh-HK support with next-intl, locale-aware routing (`/en`, `/zh`)
- **Dark-first design** — Green/teal brand palette on dark background

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui (Base style)
- **i18n:** next-intl 4.x with `[locale]` routing
- **Fonts:** Inter + Noto Sans TC

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/en` by default.

### Environment Variables

Copy the example file and fill in your keys (required for Phase 3 — live data):

```bash
cp .env.local.example .env.local
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (dark mode, fonts)
│   └── [locale]/
│       ├── layout.tsx          # Locale layout (Header, Footer, MobileTabBar)
│       ├── page.tsx            # Landing page (hero, donut, strategy cards, news)
│       ├── fund/[slug]/page.tsx # Fund detail page (report-style)
│       └── profiles/page.tsx   # Investor profiles comparison
├── components/
│   ├── landing/                # Hero, ProfileSelector, AllocationDonut, NewsCard, etc.
│   ├── strategy/               # FundHeader, EnhancedHoldingsTable, OpportunityCard, etc.
│   ├── layout/                 # Header, Footer, MobileTabBar, LanguageSwitcher
│   └── ui/                     # shadcn/ui primitives
├── lib/
│   ├── strategies/             # Fund configs, types, profiles (TypeScript, no DB)
│   ├── mock-data.ts            # Static mock data for all funds
│   └── data/                   # Server-only data boundary (Phase 3)
├── i18n/                       # Routing, request config, navigation helpers
└── messages/                   # en.json, zh-HK.json
```

## Roadmap

- [x] **Phase 1:** Foundation — Next.js scaffold, bilingual routing, strategy configs
- [x] **Phase 2:** Static Pages — Landing page, fund pages, profiles page
- [x] **Phase 2.1:** Prototype Alignment — Donut chart, glowing buttons, report-style fund pages
- [ ] **Phase 3:** Live Data — Price feeds, caching, charts, news API, AI analysis
- [ ] **Phase 4:** Compliance & Polish — Disclaimers, performance audit, shippable quality

## License

Private — all rights reserved.
