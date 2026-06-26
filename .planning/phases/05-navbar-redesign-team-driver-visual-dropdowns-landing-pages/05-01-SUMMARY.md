---
phase: 05-navbar-redesign-team-driver-visual-dropdowns-landing-pages
plan: 01
subsystem: navigation
tags: [shopify-liquid, theme-sections, megamenu, editor-blocks]
dependency_graph:
  requires: []
  provides:
    - "sections/header-nav.liquid (editor-configurable header section)"
    - "team_item / driver_item / nav_group block schema"
  affects:
    - "layout/theme.liquid (header/mobile-overlay now delegated to section)"
    - "src/index.css (new driver-card/headshot/group-label classes)"
tech_stack:
  added:
    - "Shopify theme blocks (team_item, driver_item, nav_group) with image_picker/select settings"
  patterns:
    - "Section-with-blocks pattern (mirrors sections/page-about.liquid credit_item) applied to global nav"
key_files:
  created:
    - sections/header-nav.liquid
  modified:
    - layout/theme.liquid
    - src/index.css
decisions:
  - "Circular driver headshot (.driver-headshot-wrap border-radius: 50%) kept as documented exception to zero-border-radius convention, per CONTEXT decision #6"
  - "No default team_image/headshot in presets — all images must be merchant-uploaded via image_picker, per CONTEXT decision #8"
metrics:
  duration: "~25 min"
  completed: "2026-06-26"
---

# Phase 5 Plan 1: Extract Megamenu into header-nav.liquid Section Summary

Extracted the hardcoded TEAMS/DRIVERS megamenu and mobile accordion markup out of `layout/theme.liquid` into a new `sections/header-nav.liquid` Shopify section using repeatable `team_item`/`driver_item`/`nav_group` theme blocks, so merchants can manage the team/driver roster from the Shopify theme editor without touching code.

## What Was Built

**Task 1 — `sections/header-nav.liquid`:** New section containing the full desktop header (logo, nav links, cart dropdown), the megamenu panel container, and the mobile full-menu overlay — all copied verbatim from `theme.liquid` except the TEAMS and DRIVERS panel content, which now renders from `section.blocks` via Liquid `{% for %}`/`{% case %}` loops:
- TEAMS panel: 3 sub-columns (`current_1`, `current_2`, `legacy`) rendering `team-card`/`team-car-img-wrap`/`team-card-name` markup unchanged, sourced from `team_item` block settings (`team_image`, `team_name`, `link`, `group`).
- DRIVERS panel: 2 sub-containers (`active` 2-col grid, `alumni` 1-col grid) rendering new `driver-card`/`driver-headshot-wrap`/`driver-card-name` markup from `driver_item` block settings (`headshot`, `driver_name`, `link`, `group`).
- Mobile accordion TEAMS/DRIVERS sections mirror the same block loops, rendering `<li><a>` entries and `nav_group` labels.
- F1 GIFTS and CATEGORIES panels/accordions kept as hardcoded HTML (explicitly out of scope per plan).
- Schema defines `nav_group`, `team_item`, `driver_item` block types and a preset seeding the launch roster: 6 teams (Red Bull, Ferrari, McLaren, Mercedes, Aston Martin, Williams) + 6 drivers (Verstappen, Hamilton, Leclerc, Norris, Piastri, Russell) + 2 group labels, with all images left unset for merchant upload.

**Task 2 — Wire `theme.liquid` + CSS:** Replaced the entire hardcoded header/megamenu/mobile-overlay block (previously lines 53-391) in `layout/theme.liquid` with a single `{% section 'header-nav' %}` call. Added new sibling CSS rules in `src/index.css` immediately after the existing team-card block: `.megamenu-group-label`, `.driver-card` (+hover/light-mode variants), `.driver-headshot-wrap` (circular, documented border-radius exception), `.driver-headshot-img`, `.driver-card-name`, `.megamenu-grid-drivers-active` (2-col grid), `.megamenu-grid-drivers-alumni` (1-col grid).

## Verification

- `data-dropdown="teams"`/`"drivers"` and `data-panel="teams"`/`"drivers"` attribute values preserved exactly — `src/main.tsx`'s `showDropdown`/`hideDropdown` bindings untouched.
- `layout/theme.liquid` no longer contains any hardcoded team/driver markup.
- `npm run build` (tsc + vite build) succeeds with no errors.
- Automated grep checks for both tasks passed (`PASS` on each task's verify command).

## Deviations from Plan

None — plan executed as written. The interfaces contract (data-dropdown/data-panel values, team-card/driver-card class names) was followed verbatim.

## Known Stubs

- All `team_image` and `headshot` image_picker settings are unset in the preset (intentional per CONTEXT decision #8 — merchant must upload images via theme editor before TEAMS/DRIVERS dropdowns show visuals). Until images are uploaded, `image_url: width: 400 | image_tag` on an unset `team_image` renders an empty `<img>` tag (no broken-image icon, per Shopify Liquid behavior with blank image references) and the driver `<img src="{{ block.settings.headshot | image_url: width: 200 }}">` will have an empty `src`. This is expected first-run state, not a bug — resolves once a merchant configures the section in the theme editor.

## Self-Check: PASSED

- FOUND: sections/header-nav.liquid
- FOUND: layout/theme.liquid (modified, contains `{% section 'header-nav' %}`)
- FOUND: src/index.css (modified, contains `.driver-card`)
- FOUND commit 1dc5a9a (Task 1)
- FOUND commit 9aab7f8 (Task 2)
