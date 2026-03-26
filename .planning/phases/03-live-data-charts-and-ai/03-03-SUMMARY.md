---
phase: 03-live-data-charts-and-ai
plan: "03"
subsystem: ui
tags: [recharts, i18n, charts, next-intl, typescript]

# Dependency graph
requires:
  - phase: 03-01
    provides: Cache infrastructure and withCache utility used by future data adapters

provides:
  - AllocationDonut: donut chart client component with innerRadius hole, 6-color palette, center label overlay
  - EquityCurve: area chart client component with indigo gradient fill, simulatedLabel subtitle, zero baseline
  - Phase 3 i18n keys: charts, news, and common namespaces in both en.json and zh-HK.json

affects:
  - 03-04 (route handlers that feed data into these chart components)
  - 03-05 (AI news integration that uses news i18n keys)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - recharts 3.x Tooltip formatter requires ValueType | undefined guard (not raw number)
    - Client chart components receive all data as props — no internal data fetching
    - simulatedLabel prop passed explicitly so i18n is handled at parent level

key-files:
  created:
    - src/components/charts/AllocationDonut.tsx
    - src/components/charts/EquityCurve.tsx
  modified:
    - src/messages/en.json
    - src/messages/zh-HK.json

key-decisions:
  - "Tooltip formatter uses typeof guard (ValueType | undefined) not direct number cast — recharts 3.x type requirement"
  - "Chart components are pure props-driven: no data fetching, no server calls — ready to receive data from route handlers in 03-04"
  - "i18n keys placed before riskLevel section for logical grouping (charts, news, common before riskLevel)"

patterns-established:
  - "recharts Tooltip formatter: (value) => typeof value === 'number' ? ... : value"
  - "EquityCurve simulatedLabel: always rendered as visible <p> element below title, not inside chart"

requirements-completed: [STRT-02, STRT-06]

# Metrics
duration: 2min
completed: 2026-03-26
---

# Phase 03 Plan 03: Chart Components and i18n Keys Summary

**Recharts donut and area chart client components with Phase 3 bilingual i18n keys (charts, news, common namespaces)**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-26T17:15:33Z
- **Completed:** 2026-03-26T17:17:27Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- AllocationDonut renders a donut chart (PieChart with innerRadius=65, outerRadius=95 per D-01) with 6-color indigo/cyan/amber/emerald/rose/violet palette, optional center label overlay, and percentage tooltip
- EquityCurve renders an area chart with indigo gradient fill, "Simulated back-test" subtitle label (per D-02), XAxis date labels, YAxis with +/- percentage format, and zero-return baseline ReferenceLine
- All Phase 3 UI text covered with bilingual keys: charts namespace (6 keys), news namespace (9 keys + 3 impact sub-keys), common namespace (4 keys) — in both en.json and zh-HK.json

## Task Commits

Each task was committed atomically:

1. **Task 1: AllocationDonut and EquityCurve chart components** - `f7f3f8f` (feat)
2. **Task 2: Phase 3 i18n translation keys** - `66982fc` (feat)

## Files Created/Modified

- `src/components/charts/AllocationDonut.tsx` - Donut chart client component; PieChart with innerRadius hole, 6-color palette, center label overlay
- `src/components/charts/EquityCurve.tsx` - Area chart client component; indigo gradient fill, simulatedLabel subtitle, zero baseline, percentage Y-axis
- `src/messages/en.json` - Added charts, news, common top-level namespaces (Phase 3 keys)
- `src/messages/zh-HK.json` - Added charts, news, common top-level namespaces in Traditional Chinese

## Decisions Made

- **Tooltip formatter type guard:** recharts 3.x Tooltip formatter receives `ValueType | undefined`, not `number`. Used `typeof value === 'number'` guard instead of direct cast — required for TypeScript correctness.
- **Props-only chart components:** Both components receive data exclusively via props with no internal fetching, making them reusable regardless of data source (route handler, SSR, mock).
- **simulatedLabel as visible element:** Rendered as a `<p>` element in the component DOM (not as a chart annotation) so it is always visible per D-02 requirement.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Tooltip formatter type mismatch for recharts 3.x**
- **Found during:** Task 1 (chart component creation)
- **Issue:** Plan specified `(value: number) => ...` as formatter signature. recharts 3.x `Formatter<ValueType, NameType>` passes `ValueType | undefined` (not `number`), causing TypeScript TS2322 error in both components
- **Fix:** Changed formatter to use `typeof value === 'number'` guard: `(value) => typeof value === 'number' ? Math.round(value * 100) + '%' : value` in AllocationDonut; similar in EquityCurve
- **Files modified:** src/components/charts/AllocationDonut.tsx, src/components/charts/EquityCurve.tsx
- **Verification:** `npx tsc --noEmit --skipLibCheck` passes with no errors in chart files
- **Committed in:** f7f3f8f (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - type bug)
**Impact on plan:** Fix required for TypeScript correctness in recharts 3.x. No scope creep.

## Issues Encountered

- Pre-existing TypeScript errors in `src/lib/data/yahoo-finance.ts` (from plan 03-02, unrelated to this plan) — out of scope, not modified.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- AllocationDonut and EquityCurve are prop-ready: both accept typed props matching `Allocation[]` and `EquityPoint[]` from existing types
- Phase 3 i18n keys cover all chart, news, and common UI states needed for plans 03-04 and 03-05
- No blockers — route handlers in 03-04 can wire these components immediately

---
*Phase: 03-live-data-charts-and-ai*
*Completed: 2026-03-26*
