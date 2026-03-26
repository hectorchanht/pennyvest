# Phase 3: Live Data, Charts, and AI - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 03-live-data-charts-and-ai
**Areas discussed:** Chart types, News UX, LLM provider, News count

---

## Chart Types & Visuals

| Option | Description | Selected |
|--------|-------------|----------|
| Donut chart | Circular with center hole, modern fintech style | ✓ |
| Horizontal bar chart | Colored bars sorted by weight | |
| You decide | Claude picks best for dark theme | |

**User's choice:** Donut chart
**Notes:** Clean, modern, widely used in fintech apps.

---

## News & AI Analysis Display

| Option | Description | Selected |
|--------|-------------|----------|
| Card per article with impact badge | Headline + AI summary + Bullish/Neutral/Bearish badge | ✓ |
| Compact list with expandable details | Headlines list, expand for details | |
| You decide | Claude picks layout | |

**User's choice:** Card per article with impact badge
**Notes:** Scannable, clear impact communication.

---

## LLM Provider

| Option | Description | Selected |
|--------|-------------|----------|
| OpenAI (GPT-4o-mini) | Cheapest, well-tested with AI SDK | |
| Anthropic (Claude Haiku) | Good at bilingual, slightly more expensive | |
| You decide based on cost | Claude picks cheapest/most reliable | |

**User's choice:** Free-text: "use free options at the beginning while having flexibility to switch to claude or grok or openai"
**Notes:** Provider-agnostic via Vercel AI SDK abstraction. Start free/cheap, easy swap later.

---

## News Article Count

| Option | Description | Selected |
|--------|-------------|----------|
| 3-5 most recent | Compact, lower API costs | |
| 5-10 articles | More comprehensive coverage | |
| You decide | Claude balances API limits vs content | ✓ |

**User's choice:** You decide
**Notes:** Claude discretion — balance free-tier limits with user engagement.

---

## Claude's Discretion

- Chart library selection
- Exact news article count per fund
- Equity curve data generation approach
- News API selection
- Cache TTL tuning
- Error state visual design

## Deferred Ideas

- WebSocket streaming — v1 uses polling
- User-configurable backtester — v2+
- Push notifications — requires accounts
- Combined profile equity curve — nice-to-have
