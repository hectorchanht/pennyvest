# Pitfalls Research

**Domain:** Investment information / portfolio suggestion platform (bilingual, AI-powered, free-tier APIs)
**Researched:** 2026-03-26
**Confidence:** MEDIUM — web tools unavailable; based on training data (cutoff August 2025) with explicit confidence flags per section

---

## Critical Pitfalls

### Pitfall 1: Yahoo Finance Unofficial API Breakage

**What goes wrong:**
`yfinance` and other Yahoo Finance scrapers are built against undocumented, unofficial endpoints. Yahoo regularly changes cookie requirements, crumb tokens, and response formats without notice. The library breaks silently — returning stale data, empty responses, or throwing HTTP 401/429 errors — and users see incorrect prices or blank charts with no visible error state.

**Why it happens:**
Yahoo Finance has no official public API. Community libraries reverse-engineer the web interface. Every time Yahoo updates its JS bundle or authentication flow, the libraries break. The `yfinance` Python library in particular has had multiple major breakage events in 2023–2025 from cookie auth changes.

**How to avoid:**
- Treat Yahoo Finance data as inherently unreliable; build defensive fallback behavior from day one
- Pin the `yfinance` version (or equivalent) and test on deploy, not just locally
- Wrap every Yahoo Finance call in try/catch with a last-known-good cache fallback
- Add a staleness indicator in the UI: "Last updated: X minutes ago" so users can see if data is stale
- Consider Yahoo Finance as primary with Alpha Vantage free tier or Financial Modeling Prep free tier as manual fallback, not an automated secondary

**Warning signs:**
- HTTP 401 or "Too Many Requests" errors in server logs with no corresponding traffic spike
- Price data returns `None` or `NaN` across multiple tickers simultaneously
- Chart data shows flat line at last known price rather than current value

**Phase to address:**
Data integration phase (when API routes are first built). Defensive patterns must be established before charting is built on top; retrofitting is painful.

---

### Pitfall 2: Free-Tier API Rate Limits Causing Cascade Failures on Page Load

**What goes wrong:**
Each strategy page loads multiple assets (e.g., 8–12 tickers for Future Tech). On a cold start with no cache, the page triggers N simultaneous API calls. Free-tier limits — CoinGecko demo: ~30 calls/minute; Yahoo Finance: undocumented but empirically ~100/minute — are blown instantly when more than one user visits simultaneously. All users see failed charts or blank allocation data.

**Why it happens:**
Developers test with one browser tab and never simulate concurrent visitors. Free-tier limits are per-IP (server IP), not per-user, so a shared deployment server exhausts the quota for all users simultaneously.

**How to avoid:**
- Implement server-side caching (Redis or in-memory with Next.js API routes) for all external data, with TTL tuned to data volatility:
  - Stock prices: 5-minute TTL
  - Crypto prices: 2-minute TTL (CoinGecko updates ~every 60s on free tier)
  - News summaries: 30-minute TTL (AI calls are expensive; news doesn't need sub-minute freshness)
  - Historical performance data: 24-hour TTL
- Use a background refresh pattern: serve stale cache while refreshing, never block on API call during page render
- Batch ticker requests where the API supports it (CoinGecko `/simple/price` accepts comma-separated IDs; use this instead of one call per coin)

**Warning signs:**
- 429 errors appearing in logs during normal usage
- Page load times spiking above 3s
- Multiple users reporting "data not loading" at the same time

**Phase to address:**
Data integration phase, before any UI is built. Cache layer must be a first-class architectural component, not bolted on later.

---

### Pitfall 3: AI Hallucination in Financial News Analysis

**What goes wrong:**
The LLM generates plausible-sounding analysis like "Apple's Q3 earnings beat forecasts by 12%, boosting the Future Tech portfolio" — but the number is fabricated, or the quarter is wrong, or the company wasn't mentioned in the source news at all. Users in a financial context treat this as factual data and make decisions on it.

**Why it happens:**
LLMs are trained to be helpful and fluent. When given a news article that mentions a company tangentially, the model will often "complete the story" with confident-sounding specifics it doesn't actually know. This is especially pronounced when:
- The prompt asks for numerical analysis without providing the numbers
- The model is asked to assess portfolio impact without knowing current allocation weights
- The news is about a sector but the model attributes it to a specific ticker

**How to avoid:**
- Design prompts to be strictly extractive, not generative: "Summarize what this article says about X. Do not add information not in the article."
- Pass the full article text in context, not just a headline — models hallucinate more with less source material
- Explicitly prohibit numerical claims in the prompt unless sourcing them from provided data: "Do not state price targets, percentages, or figures unless they appear verbatim in the provided text."
- Display analysis under a clear "AI-generated summary based on the following source" label with a link to the original article
- For portfolio impact analysis, provide the actual allocation weights in the prompt so the model is reasoning about known quantities

**Warning signs:**
- AI responses reference specific price targets, earnings figures, or analyst ratings that differ from the source article
- Model outputs cite companies not mentioned in the news input
- Summaries are longer than the source content and contain elaborated details

**Phase to address:**
AI integration phase. Prompt engineering discipline must be established before news analysis ships, not post-launch when trust has already been damaged.

---

### Pitfall 4: Simulated Performance Charts Misrepresented as Real Historical Returns

**What goes wrong:**
The equity curve chart shows a model portfolio's back-tested or simulated performance. Users interpret this as "what this portfolio actually returned" — not as a paper simulation. This is both a legal/compliance risk and a user trust risk: when the real market diverges from the simulated curve, users feel deceived.

**Why it happens:**
Developers label charts "Performance" without qualifying "Simulated" or "Back-tested." The chart looks identical to real brokerage performance charts. Users in many markets (including HK) are accustomed to seeing historical return charts as factual.

**How to avoid:**
- Every performance chart must be labeled "Simulated back-test" or "Paper portfolio — not real returns" in the chart title, not just in fine print
- Include a methodology note inline: "Based on equal-weight monthly rebalancing, no transaction costs assumed"
- Show a disclaimer directly below or on the chart: "Past simulated performance does not predict future results"
- Avoid date ranges that look like live portfolio tracking — label the x-axis "Back-test period" not just the dates
- Do not use green/red gain/loss framing without the "simulated" qualifier — it implies real money was at stake

**Warning signs:**
- User feedback asking "how do I see my actual returns?" (they believe it's live)
- Users citing specific percentage gains from the chart in community discussions as real results
- Press or reviewers describing the charts as "historical performance"

**Phase to address:**
Charting/visualization phase. Compliance labeling must be part of the chart component spec, not added as an afterthought.

---

### Pitfall 5: Missing or Inadequate Financial Disclaimer Placement

**What goes wrong:**
The disclaimer "not financial advice" is buried in the footer or an About page, and the main content uses assertive language like "This portfolio will outperform" or "Invest in X now." In Hong Kong, this creates exposure under the Securities and Futures Ordinance (SFO); in other jurisdictions, similar securities law applies. Even for educational platforms, assertive language without prominent disclaimer can attract regulatory attention.

**Why it happens:**
Developers focus on product copy, not legal framing. The instinct is to write compelling, confident copy to engage users. Disclaimers feel like they undermine the product.

**How to avoid:**
- Disclaimer must appear on every strategy page, above the fold — not just the footer
- Avoid first-person assertive language: "We suggest considering X" vs. "Invest in X"
- Use conditional/educational framing: "This strategy is designed to show how a diversified tech portfolio might be constructed" vs. "Buy these stocks"
- The disclaimer should name the jurisdiction explicitly: "This content is for informational and educational purposes only and does not constitute investment advice under the Securities and Futures Ordinance (Cap. 571)."
- HK SFC guidance specifically addresses unlicensed online investment advice — review SFC Circular on digital investment platforms
- Disclaimers must be bilingual — Traditional Chinese disclaimer must be legally equivalent to the English version, not a shortened translation

**Warning signs:**
- Copy writers or LLMs generating "should invest" or "will return" language in strategy rationale
- Disclaimer only appears on one language's version
- Users asking "can I trust this to tell me what to buy?" positively — indicates copy is too assertive

**Phase to address:**
Foundation phase (content strategy and copy templates). Every content template must embed disclaimer placement. Also revisit during AI integration phase since AI-generated copy may use assertive language.

---

### Pitfall 6: Bilingual i18n Breakage — Traditional Chinese vs. Simplified Chinese

**What goes wrong:**
The UI ships with Simplified Chinese (`zh-CN`) character set by accident instead of Traditional Chinese (`zh-TW`/`zh-HK`). Hong Kong users immediately recognize this and perceive the product as not built for them. Alternatively, financial terminology is translated using Mainland Chinese financial jargon (e.g., 股票 is acceptable in both, but 基金 vs. 基金 is the same — but subtler terms like 债券 vs. 債券, or regulatory body names differ significantly).

**Why it happens:**
- Default i18n library locale codes default to `zh-CN`
- LLMs asked to "translate to Chinese" default to Simplified
- Google Translate and DeepL default to Simplified
- Developers unfamiliar with the distinction ship without review by a native Traditional Chinese reader

**How to avoid:**
- Explicitly set locale to `zh-HK` (not `zh-TW`) in the i18n config — HK users expect HK conventions (e.g., 港元 not 台幣)
- All AI-generated translations must be reviewed by a native Traditional Chinese / HK-context reader before shipping
- Use a locale code review checklist: every `zh` locale string in the codebase must be `zh-HK`
- Financial terminology glossary: establish canonical HK-Chinese translations for key terms (allocation = 資產配置, risk level = 風險等級, back-test = 回測, etc.) before translation begins — inconsistency across pages destroys credibility
- Text expansion: Chinese text is typically 30–40% shorter than English for the same content; some UI components designed around English character counts will look wrong with Chinese (too much whitespace, or overflow if the opposite happens)

**Warning signs:**
- Any `zh-CN` locale code in the i18n config or component props
- Financial terms translated inconsistently across pages
- Native HK speakers reporting the language "feels Mainland"

**Phase to address:**
Foundation phase — i18n architecture must be established with correct locale codes before any content is added. Also: dedicated Traditional Chinese QA pass during content phase.

---

### Pitfall 7: CoinGecko Free Tier Data Freshness Misrepresented

**What goes wrong:**
CoinGecko's free/demo API updates prices approximately every 60 seconds, but with rate limiting and caching layers, the price displayed to users may be 5–15 minutes stale. Crypto users have high expectations for real-time data and will distrust the platform if they notice price discrepancies against exchanges.

**Why it happens:**
Developers cache aggressively (correctly, to stay within rate limits) but don't communicate data age to users. The UI shows a price without indicating when it was last refreshed.

**How to avoid:**
- Always display a "Last updated: X minutes ago" timestamp alongside crypto prices
- For demo/free tier CoinGecko: document in the UI that prices refresh every 2–5 minutes
- Make TTL values explicit and documented: cache TTL = 2min for crypto (balance between freshness and rate limits)
- Include a note that crypto prices are indicative, not exchange-level real-time

**Warning signs:**
- Users reporting prices that don't match what they see on Binance/Coinbase
- No "last updated" timestamp visible in the UI
- Cache TTL set to values above 10 minutes without a visible staleness indicator

**Phase to address:**
Data integration phase (when CoinGecko integration is built). Staleness UX is a data design decision, not a display afterthought.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| No server-side cache, call APIs directly on each request | Simpler code, no cache infrastructure | Rate limit exhaustion under any real load; slow pages | Never — cache must exist from first API call |
| Hardcode ticker symbols in strategy config | Fast to ship | Updating a strategy requires a code deploy; can't adapt to market changes | Only in v1 with clear TODO to externalize |
| Single LLM prompt for all news analysis | Simpler prompt management | No per-strategy tuning; hallucination rate harder to reduce for specific domains (crypto vs. equities) | Acceptable in v1 — refactor when prompt quality becomes a problem |
| Use `dangerouslySetInnerHTML` for AI-generated summaries | Saves sanitization work | XSS vector if AI output ever contains HTML (prompt injection attack) | Never |
| Skip error boundaries on chart components | Faster development | One bad API response breaks the whole page | Never — charts must fail gracefully |
| Footer-only disclaimer | Cleaner above-fold UX | Legal exposure; user confusion about advice vs. education | Never |
| `zh-CN` locale as placeholder | Faster MVP | HK audience immediately notices; erodes trust permanently | Never |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Yahoo Finance (`yfinance`) | Call without error handling assuming it always returns data | Wrap in try/catch, return last-cached value on failure, log error for monitoring |
| Yahoo Finance | Use for real-time equity prices without acknowledging it's unofficial | Treat as best-effort; display staleness indicator; have fallback data source identified |
| CoinGecko free tier | One API call per coin on page load | Use `/simple/price?ids=bitcoin,ethereum,...` batch endpoint; single call for all coins |
| CoinGecko free tier | Set cache TTL below 60s | Free tier updates ~every 60s; anything below 60s TTL just hits rate limits without fresher data |
| CoinGecko free tier | Forget `x-cg-demo-api-key` header | Without key, rate limit is ~10–30 calls/min (shared IP pool); with free API key it's ~30/min on dedicated quota |
| News APIs (NewsAPI, GNews, etc.) | Fetch news on every page request | Cache news results for 30 minutes minimum; news latency matters less than API cost |
| LLM API (OpenAI/Anthropic/etc.) | Generate AI summaries synchronously on page load | Pre-generate on news fetch, store result; never block page render on LLM call |
| LLM API | No max_tokens limit on financial analysis prompts | Unbounded completions cost money; financial summaries should be 150–250 tokens max |
| Next.js API routes | Store API keys in client-side code or environment variables exposed to browser | All external API keys must be server-side only; never in `NEXT_PUBLIC_` variables |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| No ISR/SSG for strategy pages | Every page visit hits all external APIs | Use Next.js ISR with revalidate interval matching cache TTL | At 5+ concurrent visitors |
| LLM call on every news fetch | Page load > 10s; LLM costs spike | Cache AI-generated summaries; regenerate only when source news changes | At 10+ daily visitors (cost); at 2+ concurrent (latency) |
| N+1 API calls: one call per ticker | Rate limit exhaustion; slow parallel waterfalls | Batch calls where API supports it; fan-out only when batching not available | At 8+ tickers per page load |
| Rendering full historical dataset client-side | Chart library renders 5 years of daily data = 1,800 points per asset | Downsample to weekly for longer time ranges; use server-side aggregation | With any time range > 6 months and 3+ assets |
| No request deduplication in API routes | Thundering herd: 10 users load the page simultaneously = 10 × N API calls | Use in-flight request deduplication (cache the pending promise, not just the result) | At 5+ concurrent users |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| API keys in `NEXT_PUBLIC_` env vars | Keys exposed in browser bundle; scraped by bots and abused | All third-party API keys must be in server-side env vars, called from API routes only |
| LLM prompt injection via news content | Malicious news article content manipulates AI output; could generate harmful financial advice | Sanitize/truncate news input before LLM prompt; use system prompt to assert role and constrain output format |
| No rate limiting on own API routes | Bot scrapes all 4 strategy pages in a loop, exhausting all upstream API quotas | Add rate limiting middleware on Next.js API routes (e.g., `upstash/ratelimit` or simple in-memory limiter) |
| Trusting LLM output as HTML | AI summary rendered as HTML enables XSS | Always render AI output as plain text; strip/escape before display |
| Exposing internal error messages to client | Stack traces reveal infrastructure details | Return generic error responses to client; log full error server-side only |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No loading state during data fetch | Blank charts and empty allocation tables look broken, not loading | Skeleton loaders for every chart and allocation table; show immediately on page mount |
| Error state shows raw error message | "HTTP 429 Too Many Requests" confuses users | User-friendly fallback: "Market data is temporarily unavailable. Showing last known prices." |
| Disclaimer text identical size/style as body copy | Users miss it; legal exposure | Disclaimer must be visually distinct — boxed, italic, or smaller but clearly present — not invisible but not distracting |
| Language toggle hidden in settings | HK bilingual users expect prominent EN/中文 toggle | Language switch in top nav, persistent, immediate (no page reload) |
| Performance chart with no zero-line or % baseline | Users misread Y-axis scale as absolute return | Always show percentage return from start date; label baseline clearly |
| Strategy rationale written at expert level | Beginner audience (the core user) is lost immediately | Plain language standard: 8th-grade reading level equivalent for all rationale copy |
| Chinese UI with English financial terms untranslated | Breaks immersion; feels unfinished | Glossary-driven translation: every financial term must have a canonical HK-Chinese equivalent |

---

## "Looks Done But Isn't" Checklist

- [ ] **Performance charts:** Does the chart show "Simulated" or "Back-test" label in the title — not just in the caption or footer?
- [ ] **Strategy pages:** Does the disclaimer appear above the fold on mobile — not just on desktop?
- [ ] **Traditional Chinese content:** Has a native HK Traditional Chinese reader reviewed ALL pages — not just checked for character set?
- [ ] **Financial terminology:** Is there a glossary document where every HK-Chinese term is standardized — not translated ad-hoc per page?
- [ ] **API error handling:** Does each chart and data component degrade gracefully with a "last known data" fallback — not a blank or broken state?
- [ ] **Cache layer:** Is there server-side caching with explicit TTLs documented — not just browser caching?
- [ ] **LLM output:** Is AI-generated content rendered as plain text (not HTML) — and linked to its source article?
- [ ] **Locale codes:** Is every `zh` locale string in the codebase `zh-HK` — not `zh-CN` or `zh-TW`?
- [ ] **API keys:** Are all third-party API keys verified server-side-only — not appearing in any `NEXT_PUBLIC_` variable?
- [ ] **Rate limiting:** Are own API routes rate-limited — not just relying on upstream limits to protect cost?

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Yahoo Finance breaks silently | MEDIUM | Pin library version; add monitoring alert on data staleness; identify backup data source; implement in 1–2 days |
| Rate limits exhausted, all data stale | LOW–MEDIUM | Extend cache TTL immediately (config change); identify which calls are most frequent and batch them; no rewrite needed |
| AI hallucination found post-launch | HIGH | Audit all AI outputs in production; add extraction-only prompt guardrails; potentially disable AI summaries temporarily; user trust damage is hard to recover |
| Simulated charts mistaken for real returns | HIGH | Add disclaimers retroactively; issue public correction; may require redesign of chart components — prevention is far cheaper than recovery |
| `zh-CN` shipped instead of `zh-HK` | MEDIUM | Character substitution is code-level but content review is the cost; HK audience trust takes time to rebuild after first impression |
| Regulatory inquiry over disclaimer adequacy | VERY HIGH | Legal review cost; potential content takedown; add prominent disclaimers immediately; engage HK SFC guidance proactively |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Yahoo Finance unofficial API breakage | Data integration phase | All API calls wrapped in try/catch with cache fallback; staleness indicator in UI |
| Rate limit cascade failures | Data integration phase | Load test with 5 concurrent users; all pages serve from cache on second hit |
| AI hallucination in financial analysis | AI integration phase | Prompt review checklist; manual audit of 20 AI outputs against source articles |
| Simulated performance misrepresented | Charting/visualization phase | Chart component spec requires "Simulated" label; design review sign-off |
| Missing/inadequate disclaimer placement | Foundation phase + AI integration phase | Disclaimer visible above fold on mobile; bilingual disclaimer legally equivalent |
| Traditional Chinese locale errors | Foundation phase (i18n setup) | `zh-HK` locale audit; native speaker review before any content ships |
| CoinGecko data freshness misrepresented | Data integration phase | "Last updated" timestamp visible on every price display |
| API keys exposed client-side | Foundation phase (project setup) | Automated secret scanning; no `NEXT_PUBLIC_` API keys in env |
| LLM prompt injection | AI integration phase | Input sanitization in place; output rendered as plain text |
| No loading/error states | UI component phase | Every data-dependent component has loading skeleton and error fallback tested |

---

## Sources

- CoinGecko API documentation — rate limits and free tier constraints (training knowledge, August 2025; confidence: MEDIUM — verify current limits at docs.coingecko.com)
- Yahoo Finance / `yfinance` library community issues — cookie auth breakage history (training knowledge; confidence: HIGH — well-documented community pattern)
- Hong Kong SFC — Securities and Futures Ordinance (Cap. 571) on unlicensed investment advice (training knowledge; confidence: MEDIUM — verify current SFC circular guidance at sfc.hk)
- Next.js ISR / API route patterns — official Next.js documentation (training knowledge, HIGH confidence for stable patterns)
- LLM prompt injection and hallucination in financial contexts — industry-wide known pattern (HIGH confidence — multiple documented cases)
- i18n Traditional vs. Simplified Chinese — locale code conventions (HIGH confidence — well-established standard)
- General fintech platform post-mortems — training knowledge synthesis (MEDIUM confidence)

**Note:** WebSearch and WebFetch tools were unavailable during this research session. All findings are from training data (cutoff August 2025). High-risk items — particularly SFC regulatory requirements, current Yahoo Finance library status, and CoinGecko free tier limits — should be verified against official sources before roadmap finalization.

---
*Pitfalls research for: Pennyvest — investment information / portfolio suggestion platform*
*Researched: 2026-03-26*
