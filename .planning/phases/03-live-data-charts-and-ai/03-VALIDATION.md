---
phase: 03
slug: live-data-charts-and-ai
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (not yet installed — Wave 0 task) |
| **Config file** | `vitest.config.ts` — Wave 0 gap |
| **Quick run command** | `pnpm vitest run src/lib` |
| **Full suite command** | `pnpm vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm vitest run src/lib`
- **After every plan wave:** Run `pnpm vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | DATA-02 | unit | `pnpm vitest run src/lib/data/cache.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | DATA-01 | unit | `pnpm vitest run src/lib/data/yahoo-finance.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | DATA-01 | unit | `pnpm vitest run src/lib/data/coingecko.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | DATA-03 | unit | `pnpm vitest run src/lib/data/news.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | NEWS-02, NEWS-03 | unit | `pnpm vitest run src/lib/ai/analyzer.test.ts` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 2 | STRT-02 | smoke | manual (browser) | manual | ⬜ pending |
| 03-03-01 | 03 | 2 | STRT-06 | smoke | manual (browser) | manual | ⬜ pending |
| 03-04-01 | 04 | 3 | COMP-04 | unit | covered in adapter tests | ✅ | ⬜ pending |
| 03-05-01 | 05 | 4 | ALL | build | `pnpm build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `pnpm add -D vitest @vitejs/plugin-react` — install test framework
- [ ] `vitest.config.ts` — test framework config
- [ ] `src/lib/data/yahoo-finance.test.ts` — stubs for DATA-01 (equity prices)
- [ ] `src/lib/data/coingecko.test.ts` — stubs for DATA-01 (crypto prices)
- [ ] `src/lib/data/cache.test.ts` — stubs for DATA-02 (cache TTL behavior)
- [ ] `src/lib/data/news.test.ts` — stubs for DATA-03
- [ ] `src/lib/ai/analyzer.test.ts` — stubs for NEWS-02/NEWS-03

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| AllocationDonut renders correctly | STRT-02 | SVG chart requires browser rendering | Navigate to /en/fund/future-tech, verify donut chart visible |
| EquityCurve renders correctly | STRT-06 | SVG chart requires browser rendering | Navigate to /en/fund/future-tech, verify equity curve visible |
| News cards show impact badges | NEWS-01, NEWS-03 | Requires live API data | Navigate to fund page, check news section has cards with Bullish/Neutral/Bearish badges |
| Language switcher changes AI content | I18N-03 | Requires live API + LLM | Switch language on a fund page, verify news summaries change language |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
