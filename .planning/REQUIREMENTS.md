# Requirements: Pennyvest

**Defined:** 2026-03-26
**Core Value:** Users can browse clearly explained investment strategies with real-time news context, so they understand not just what to invest in, but why the allocation makes sense right now.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Landing & Navigation

- [ ] **LAND-01**: User can view a landing page that explains Pennyvest's value proposition
- [ ] **LAND-02**: User can navigate from landing page to any of the 4 strategy pages
- [ ] **LAND-03**: User can see risk level summary for each strategy on landing page
- [ ] **LAND-04**: Landing page renders responsively on mobile and desktop

### Strategy Pages

- [ ] **STRT-01**: User can view a dedicated page for each of the 4 strategies (Future Tech, Traditional Industries, Commodities, Crypto)
- [ ] **STRT-02**: User can see asset allocation breakdown as a visual chart (pie or bar)
- [ ] **STRT-03**: User can see strategy rationale explaining why the allocation is structured this way
- [ ] **STRT-04**: User can see the constituent list (ticker, name, weight, asset class) for each strategy
- [ ] **STRT-05**: User can see current market prices for each constituent with "last updated" timestamp
- [ ] **STRT-06**: User can see a simulated performance chart (equity curve) for each strategy
- [ ] **STRT-07**: User can see a risk level indicator (High / Medium / Low) for each strategy

### News & AI Analysis

- [ ] **NEWS-01**: User can see aggregated relevant news headlines per strategy
- [ ] **NEWS-02**: User can read AI-generated summaries of each news article relevant to a strategy
- [ ] **NEWS-03**: User can read AI-generated impact analysis explaining how each news item affects the strategy's allocation and risk
- [ ] **NEWS-04**: News content refreshes at least every 30 minutes

### Bilingual (i18n)

- [x] **I18N-01**: User can switch between English and Traditional Chinese for all UI elements
- [x] **I18N-02**: Strategy rationale content is available in both languages
- [ ] **I18N-03**: AI news analysis output supports both languages
- [x] **I18N-04**: URL routing reflects selected language (e.g., /en/strategy/... and /zh/strategy/...)

### Data Integration

- [ ] **DATA-01**: Asset prices are fetched from free APIs (Yahoo Finance for stocks/commodities, CoinGecko for crypto)
- [ ] **DATA-02**: Price data is cached server-side to stay within free-tier API limits
- [ ] **DATA-03**: News articles are fetched from free news APIs (NewsAPI or equivalent)
- [x] **DATA-04**: All API keys and credentials are server-side only, never exposed to client

### Compliance & Trust

- [ ] **COMP-01**: Every strategy page displays a "not financial advice" disclaimer above the fold
- [ ] **COMP-02**: Disclaimers are bilingual with legally equivalent text in both languages
- [ ] **COMP-03**: Performance charts are clearly labeled as "simulated" / "hypothetical"
- [ ] **COMP-04**: "Last updated" timestamps visible wherever live data is displayed

### Performance & Quality

- [ ] **PERF-01**: Strategy pages load in under 3 seconds on 4G connection
- [ ] **PERF-02**: Charts lazy-load without blocking initial page render
- [ ] **PERF-03**: Site scores 90+ on Lighthouse performance audit

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### User Accounts

- **ACCT-01**: User can create an account with email
- **ACCT-02**: User can bookmark/save strategies
- **ACCT-03**: User can track simulated portfolio performance over time

### Paper Trading

- **TRADE-01**: User can allocate simulated funds to a strategy
- **TRADE-02**: User can track simulated returns over time

### Notifications

- **NOTF-01**: User can subscribe to email newsletter for strategy updates
- **NOTF-02**: User can receive alerts when strategy allocation changes

### Social

- **SOCL-01**: Strategy pages have shareable OG social cards
- **SOCL-02**: User can share strategies via link

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time WebSocket price streaming | Free APIs rate-limit aggressively; polling every 60-300s is indistinguishable to users |
| User-configurable backtester | Requires survivorship-bias-free data, corporate actions handling — extremely high complexity |
| Social/community features (comments) | Moderation burden; financial misinformation risk; regulatory gray area |
| Dark mode | Not high-value for v1; adds CSS complexity and testing surface |
| Mobile native app | Web-first; responsive design is sufficient |
| Tokenized assets / Web3 | Long-term direction, not v1 software scope |
| SFC licensing | Business development, not software |
| Real money transactions | Pennyvest is educational/informational only |
| OAuth / social login | No accounts in v1 |
| Push notifications / alerts | Requires accounts and notification infra |
| Fund comparison screener | Conflicts with "curated answers for beginners" positioning |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| I18N-04 | Phase 1 | Complete |
| DATA-04 | Phase 1 | Complete |
| LAND-01 | Phase 2 | Pending |
| LAND-02 | Phase 2 | Pending |
| LAND-03 | Phase 2 | Pending |
| LAND-04 | Phase 2 | Pending |
| STRT-01 | Phase 2 | Pending |
| STRT-03 | Phase 2 | Pending |
| STRT-07 | Phase 2 | Pending |
| I18N-01 | Phase 2 | Complete |
| I18N-02 | Phase 2 | Complete |
| STRT-02 | Phase 3 | Pending |
| STRT-04 | Phase 3 | Pending |
| STRT-05 | Phase 3 | Pending |
| STRT-06 | Phase 3 | Pending |
| NEWS-01 | Phase 3 | Pending |
| NEWS-02 | Phase 3 | Pending |
| NEWS-03 | Phase 3 | Pending |
| NEWS-04 | Phase 3 | Pending |
| I18N-03 | Phase 3 | Pending |
| DATA-01 | Phase 3 | Pending |
| DATA-02 | Phase 3 | Pending |
| DATA-03 | Phase 3 | Pending |
| COMP-04 | Phase 3 | Pending |
| COMP-01 | Phase 4 | Pending |
| COMP-02 | Phase 4 | Pending |
| COMP-03 | Phase 4 | Pending |
| PERF-01 | Phase 4 | Pending |
| PERF-02 | Phase 4 | Pending |
| PERF-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0

---
*Requirements defined: 2026-03-26*
*Last updated: 2026-03-26 after roadmap creation*
