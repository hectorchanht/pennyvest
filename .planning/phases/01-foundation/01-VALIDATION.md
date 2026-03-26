---
phase: 01
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — minimal/manual testing for v1 (locked decision) |
| **Config file** | None — no test framework setup |
| **Quick run command** | `pnpm build` |
| **Full suite command** | `pnpm build && pnpm lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run `pnpm build && pnpm lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | I18N-04 | smoke (manual) | `pnpm dev` → navigate /en/ and /zh/ | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | I18N-04 | smoke (manual) | `pnpm dev` → navigate / → redirect | ❌ W0 | ⬜ pending |
| 01-01-03 | 01 | 1 | DATA-04 | lint rule | `grep -r "NEXT_PUBLIC_" src/lib/` — should be empty | ❌ W0 | ⬜ pending |
| 01-01-04 | 01 | 1 | DATA-04 | build gate | `pnpm build` — server-only import prevents client usage | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] No test framework — `pnpm build` is the proxy for correctness
- [ ] Manual browser smoke test for i18n routing (/en/ and /zh/)
- [ ] `grep -r "NEXT_PUBLIC_" src/lib/` — manual audit for DATA-04
- [ ] `server-only` pattern established but lib/data/ doesn't exist yet in Phase 1

*Existing infrastructure covers remaining phase requirements via TypeScript strict mode + ESLint.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| /en/ and /zh/ render correct locale | I18N-04 | No test framework in v1 | Run `pnpm dev`, navigate to /en/ and /zh/, verify correct language renders |
| Root / redirects to default locale | I18N-04 | Browser redirect behavior | Navigate to /, verify redirect to /en/ or /zh/ based on browser language |
| No API keys in client bundle | DATA-04 | Runtime network inspection | Open browser DevTools → Network tab, verify no credentials in requests |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
