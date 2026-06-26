---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Ready to plan
last_updated: "2026-06-26T09:54:44.949Z"
progress:
  total_phases: 10
  completed_phases: 3
  total_plans: 14
  completed_plans: 10
  percent: 71
---

# Project State

**Project:** Pitwall Shopify Theme — About & All Products Pages
**Last Updated:** 2026-06-23

---

## Project Reference

**Core Value:** The homepage redesign and new pages must look unmistakably Pitwall (brutalist F1 aesthetic + existing tokens) while delivering the editorial structure of the reference designs.

**Current Focus:** Phase 5 — Navbar Redesign — Team/Driver Visual Dropdowns & Landing Pages

---

## Current Position

Phase: 5 (Navbar Redesign — Team/Driver Visual Dropdowns & Landing Pages) — EXECUTING
Plan: 1 of 4
| Field | Value |
|-------|-------|
| Phase | 04 — Redesign Collections Page (Horizontal Scroll) |
| Plan | 01 — Dynamic rows & hover navigation |
| Status | Completed |
| Mode | Standard |

**Progress:**

[██████████] 89%
[ Phase 1: About Page     ] █▓▓▓▓▓▓▓▓▓ 100%
[ Phase 2: All Products   ] █▓▓▓▓▓▓▓▓▓ 100%
[ Phase 02.1: Hero Page   ] █▓▓▓▓▓▓▓▓▓ 100%
[ Phase 02.2: Scroll Over ] █▓▓▓▓▓▓▓▓▓ 100%
[ Phase 02.3: Car Scroll  ] █▓▓▓▓▓▓▓▓▓ 100%
[ Phase 02.4: Collections  ] █▓▓▓▓▓▓▓▓▓ 100%
[ Phase 02.5: Manifesto   ] █▓▓▓▓▓▓▓▓▓ 100%
[ Phase 04: Coll. Rows    ] █▓▓▓▓▓▓▓▓▓ 100%
[ Phase 3: Helmets PDP    ] ░░░░░░░░░░   0%

Overall: 8/9 phases complete

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Phases defined | 9 |
| Requirements mapped | 18/18 |
| Phases complete | 8/9 |
| Plans created | 13 |

---

## Accumulated Context

### Roadmap Evolution

- Phase 02.1 inserted: Redesign Hero Page (completed 2026-06-06).
- Phase 02.2 inserted: Homepage Interaction Overhaul (completed 2026-06-07).
- Phase 02.3 inserted: About Us Car Scrollytelling (completed 2026-06-07).
- Phase 02.4 inserted: Redesign Collections Page (completed).
- Phase 02.5 inserted: Redesign Manifesto Section (completed 2026-06-18).
- Phase 04 inserted: Redesign Collections Page (Horizontal Scroll) (completed 2026-06-23).
- Phase 05 added: Navbar Redesign — Team/Driver Visual Dropdowns & Landing Pages (not planned yet).

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| About page first | No dependency on All Products; About is simpler (pure editorial Liquid), reducing implementation risk for Phase 1. |
| Navigation Header Redesign | Replaced static header links with dynamic Liquid megamenu overlay grids for Categories, Drivers, Teams, F1 Gifts, and bound accordion triggers for mobile. |
| Programmatic scroll state machine | Swapped native CSS scroll snapping on the homepage with a custom JS wheel listener to solve trackpad inertia slide skipping on desktop. |
| AJAX Cart dropdown hover overlay | Cart button triggers a dropdown panel listing cart line items, pricing, subtotal, and remove triggers communicating with Shopify AJAX Cart API. |
| Manifesto staggered image panels | Desktop displays a 3-panel side-by-side reveal with taglines difference-blended; mobile stacks them vertically. |
| Redesign Collections horizontal rows | Group products by category in horizontal rows with scrollbars and hover navigation arrows to match reference design exactly. |

### Active TODOs

- [ ] Plan Phase 3 (run `/gsd-plan-phase 3`)
- [ ] Source and add 3D GLB model files for Helmet PDP Configurator (already available under `assets/`)
- [ ] Redesign navbar team/driver dropdowns with visual selectors (see `.planning/todos/pending/2026-06-26-redesign-navbar-team-driver-dropdowns-with-visual-selectors.md`)

### Blockers

None.

---

## Session Continuity

- Roadmap created fresh on 2026-05-30 via `/gsd-new-project` orchestrator.
- Phase 1 & 2 completed and pushed to remote on 2026-05-31.
- Phase 02.1 (Hero Redesign) completed and verified on 2026-06-06.
- Phase 02.3 (Car Scrollytelling) completed on 2026-06-07.
- Phase 02.4 (Collections Page Redesign) completed: React masonry grid at `#collection-grid-root` filters and sorts product objects dynamically.
- Phase 02.5 (Manifesto 3-Panel Image Reveal) completed on 2026-06-18. Added image settings and tagline schemas in Liquid, rendered staggered reveals in `HomepageScrollytelling.tsx`.
- Phase 04 (Redesign Collections Horizontal Scroll) completed on 2026-06-23. Replaced vertical masonry grid with horizontal rows, added alternating Category Cards, hover arrows, and customizable page title.
- Refined navigation header and quick-view cart dropdown on desktop hover built and integrated with Shopify AJAX Cart API.
- Next action: Plan Phase 3 (Helmets PDP & Dynamic Routing) via `/gsd-plan-phase 3`.

---

*State updated: 2026-06-23*
