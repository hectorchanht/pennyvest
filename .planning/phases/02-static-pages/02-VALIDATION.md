---
phase: 02
slug: static-pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual + pnpm build (no test framework in v1) |
| **Config file** | none — v1 uses manual testing per CONTEXT.md |
| **Quick run command** | `pnpm build` |
| **Full suite command** | `pnpm build && pnpm lint` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run `pnpm build && pnpm lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | LAND-01, LAND-04 | build | `pnpm build` | ✅ | ⬜ pending |
| 02-01-02 | 01 | 1 | STRT-01, STRT-03, STRT-07 | build | `pnpm build` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 2 | I18N-01, I18N-02 | build | `pnpm build` | ✅ | ⬜ pending |
| 02-02-02 | 02 | 2 | LAND-02, LAND-03 | build | `pnpm build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements (pnpm build + lint).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Landing page renders value proposition | LAND-01 | Visual layout verification | Navigate to /en/ and /zh/ — hero section visible |
| Risk badge gauge displays correctly | STRT-07 | Visual component | Check each strategy page shows gauge meter |
| Language switcher changes all text | I18N-01 | Full page visual check | Toggle language, verify all text changes |
| Responsive layout at 375px and 1280px | LAND-04 | Viewport testing | Resize browser, check layout at both widths |
| Profile selector reorders cards | LAND-03 | Interactive behavior | Click each profile tab, verify card reorder |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
