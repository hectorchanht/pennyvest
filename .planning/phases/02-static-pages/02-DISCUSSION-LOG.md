# Phase 2: Static Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 02-static-pages
**Areas discussed:** Landing page layout, Strategy page structure, Navigation & language switcher, Content & copy depth

---

## Landing Page Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Full-screen hero with CTA | Big headline + tagline + 'Explore Strategies' button filling the viewport | ✓ |
| Split hero + strategy cards | Left side: headline + tagline. Right side: preview of strategy cards | |
| Minimal header into cards | Short headline/tagline, then immediately shows 4 strategy cards | |

**User's choice:** Full-screen hero with CTA
**Notes:** Bold first impression, scrolls to content below.

| Option | Description | Selected |
|--------|-------------|----------|
| 2×2 card grid | 4 equal cards in a grid showing fund name, risk badge, tagline | ✓ |
| Horizontal scroll strip | 4 cards in a horizontally scrollable row | |
| Vertical list with details | Each fund gets more vertical space with top holdings preview | |

**User's choice:** 2×2 card grid
**Notes:** Clean and symmetric. Single column on mobile.

| Option | Description | Selected |
|--------|-------------|----------|
| Below strategy cards | Separate section after the 4 fund cards | |
| Integrated into hero area | Profile selector tabs inside the hero section | ✓ |
| Footer CTA only | Mention profiles at the bottom | |

**User's choice:** Integrated into hero area
**Notes:** Picking a profile highlights which funds it emphasizes.

| Option | Description | Selected |
|--------|-------------|----------|
| Highlight + reorder cards | Selecting a profile highlights emphasized cards and shows weight %, reorders by weight | ✓ |
| Highlight only | Adds glow/border to emphasized funds, shows weight % badges, no reordering | |
| Static text only | Profile tabs update text description only, cards unchanged | |

**User's choice:** Highlight + reorder cards
**Notes:** Most interactive option — cards physically reorder by profile weight.

---

## Strategy Page Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Single-column scroll | Full-width sections stacked vertically | |
| Two-column on desktop | Left: rationale + holdings. Right (sticky): risk badge, stats | ✓ |
| Tab-based sections | Tabs for Overview, Holdings, Performance, News | |

**User's choice:** Two-column on desktop
**Notes:** Collapses to single column on mobile.

| Option | Description | Selected |
|--------|-------------|----------|
| Risk badge + allocation summary | Risk level badge, mini allocation breakdown, 'View profile' link | ✓ |
| Risk + quick nav + CTA | Risk badge, jump-links, profile CTA button | |
| You decide | Claude picks optimal sidebar contents | |

**User's choice:** Risk badge + allocation summary
**Notes:** Compact, always visible in sticky sidebar.

| Option | Description | Selected |
|--------|-------------|----------|
| Visible skeleton cards | Labeled placeholder cards with 'Coming Soon' labels | ✓ |
| Hidden until Phase 3 | Don't render Phase 3 sections at all | |
| Teaser with blur | Blurred preview with 'Coming soon' overlay | |

**User's choice:** Visible skeleton cards
**Notes:** Shows full page structure, good for testing layout.

| Option | Description | Selected |
|--------|-------------|----------|
| Colored pill badge | Small colored pill with text label | |
| Gauge/meter visual | Semi-circle gauge showing risk level | ✓ |
| You decide | Claude picks best visual | |

**User's choice:** Gauge/meter visual
**Notes:** More engaging than a simple pill badge.

---

## Navigation & Language Switcher

| Option | Description | Selected |
|--------|-------------|----------|
| Logo + fund links + profiles + lang | Full nav with all links visible | ✓ |
| Logo + hamburger menu + lang | Minimal with hamburger | |
| Logo + minimal + lang | Compact with dropdown | |

**User's choice:** Logo + fund links + profiles + lang
**Notes:** All navigation visible on desktop.

| Option | Description | Selected |
|--------|-------------|----------|
| 4 fund tabs + center profile | 5 tabs with direct access to every page | ✓ |
| Home, Funds, Profiles | 3 tabs, Funds opens sub-page | |
| Home, Explore, Profile | 3 tabs, most minimal | |

**User's choice:** 4 fund tabs + center profile
**Notes:** Direct access to every page despite being cramped on small screens.

| Option | Description | Selected |
|--------|-------------|----------|
| In the top header bar | Globe icon + dropdown, always accessible | ✓ |
| Inside a slide-out menu | Hidden in hamburger/settings | |
| You decide | Claude picks best placement | |

**User's choice:** In the top header bar
**Notes:** Always accessible, standard pattern.

| Option | Description | Selected |
|--------|-------------|----------|
| Transparent → solid on scroll | Hero feels immersive, header transitions on scroll | ✓ |
| Always solid dark | Consistent dark header on every page | |
| You decide | Claude picks best approach | |

**User's choice:** Transparent → solid on scroll
**Notes:** Immersive hero experience.

---

## Content & Copy Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Short paragraph (3-5 sentences) | Brief thesis, who it's for, key idea | ✓ |
| Multi-section writeup | Several paragraphs with market context, risks | |
| You decide | Claude determines appropriate depth | |

**User's choice:** Short paragraph (3-5 sentences)
**Notes:** Quick to read, easy to translate.

| Option | Description | Selected |
|--------|-------------|----------|
| Ticker + Name + Weight % | Simple 3-column table | ✓ |
| Ticker + Name + Weight + Asset Class | 4 columns with asset class tag | |
| You decide | Claude picks columns | |

**User's choice:** Ticker + Name + Weight %
**Notes:** Price and value columns added in Phase 3.

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle animations | Fade-in on scroll, card hover effects | ✓ |
| Full motion design | Animated background, entrance animations | |
| Static only | No animations | |

**User's choice:** Subtle animations
**Notes:** Polished without being distracting.

| Option | Description | Selected |
|--------|-------------|----------|
| Claude writes both | Claude generates EN and zh-HK content | ✓ |
| Claude writes EN, I review zh-HK | Claude drafts both, user refines Chinese | |
| I'll provide zh-HK separately | Claude writes EN only | |

**User's choice:** Claude writes both
**Notes:** User reviews after. Faster iteration.

---

## Claude's Discretion

- Exact hero CTA text and visual composition
- Profile tab visual design within hero
- Card hover effect specifics
- Gauge/meter component implementation
- Profiles page layout
- Footer content
- shadcn/ui component selection

## Deferred Ideas

- Risk questionnaire — v2
- Dark/light toggle — v1 dark only
- About page — post-launch evaluation
- Social OG cards — v2
