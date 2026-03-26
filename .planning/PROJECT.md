# Pennyvest

## What This Is

Pennyvest is a bilingual (English / Traditional Chinese) web app that provides AI-powered asset allocation suggestions across different risk levels. It curates 4 themed investment strategies — future tech, traditional industries, commodities, and crypto — each with allocation breakdowns, rationale, simulated performance charts, and real-time news analysis explaining how current events impact the portfolio. Built for both beginner and retail investors who want to learn investing starting from a penny.

## Core Value

Users can browse clearly explained investment strategies with real-time news context, so they understand not just *what* to invest in, but *why* the allocation makes sense right now.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Landing page with value proposition and navigation to strategies
- [ ] 4 strategy pages: Future Tech, Traditional Industries, Commodities, Crypto
- [ ] Each strategy shows asset allocation breakdown with rationale
- [ ] Model/paper portfolio with simulated performance (equity curve)
- [ ] Real-time news summaries with AI-generated impact analysis per strategy
- [ ] Risk level indicators (high / medium / low) per strategy
- [ ] Bilingual UI (English and Traditional Chinese)
- [ ] Free API data integration (Yahoo Finance, CoinGecko, news APIs)
- [ ] AI-powered news summarization and allocation impact analysis

### Out of Scope

- User accounts / authentication — v1 is view-only, no personalization
- Paper trading interactivity — users cannot simulate their own trades yet
- Tokenized assets / Web3 integration — long-term direction, not v1
- SFC licensing / fund operations — business development, not software
- Mobile native app — web-first, responsive design sufficient for v1
- Real money transactions — Pennyvest is educational/informational only in v1
- OAuth / social login — no accounts means no login

## Context

- The name "Pennyvest" reflects the ethos: start from a penny, learn investing
- Target audience spans Hong Kong / Cantonese-speaking investors AND English-speaking global audience
- Long-term vision includes becoming a licensed fund, but v1 is purely informational/educational
- A Manus-built prototype exists but the design starts fresh — only the concept carries forward
- The 4 strategy categories are the starting point; more may be added later
- Future Tech covers: robotics, rockets/space, AI companies
- Traditional Industries covers: F&B, financials, real estate
- Commodities: gold, oil, agricultural, etc.
- Crypto: major coins and emerging tokens

## Constraints

- **Tech stack**: Next.js fullstack (single codebase, API routes for backend logic)
- **Data sources**: Free-tier APIs only for v1 (Yahoo Finance, CoinGecko, free news APIs)
- **AI provider**: No hard preference — use whichever LLM API works best for news analysis
- **Budget**: Minimize API costs — use caching, batch processing where possible
- **Compliance**: Must include disclaimers — not financial advice, educational/informational only
- **Language**: All user-facing content must support English and Traditional Chinese

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js fullstack | Single codebase simplicity, API routes for data fetching/AI calls | — Pending |
| View-only for v1 | Reduce scope, validate content value before adding interactivity | — Pending |
| Free APIs for data | Minimize costs while validating the concept | — Pending |
| Bilingual from day 1 | Core audience is HK/Cantonese + global English speakers | — Pending |
| Start fresh from prototype | Prototype was conceptual; v1 needs proper architecture | — Pending |

---
*Last updated: 2026-03-26 after initialization*
