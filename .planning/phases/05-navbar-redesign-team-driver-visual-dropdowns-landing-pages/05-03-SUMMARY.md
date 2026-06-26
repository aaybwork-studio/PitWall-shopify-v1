---
phase: 05-navbar-redesign-team-driver-visual-dropdowns-landing-pages
plan: 03
subsystem: react-components
tags: [react, landing-pages, collections, filter-sort, refactor]
dependency-graph:
  requires:
    - sections/collection-team.liquid (Plan 02)
    - sections/collection-driver.liquid (Plan 02)
    - templates/collection.team.json (Plan 02)
    - templates/collection.driver.json (Plan 02)
  provides:
    - src/components/TeamLandingPage.tsx
    - src/components/DriverLandingPage.tsx
    - useUrlSyncedFilter (exported hook, CollectionGrid.tsx)
    - SortDropdown (exported component, CollectionGrid.tsx)
  affects:
    - src/main.tsx (additive mount blocks)
tech-stack:
  added: []
  patterns:
    - Generalized URL-param allow-list filter/sort state into a reusable useUrlSyncedFilter(paramName, allowList, defaultValue) hook
    - Extracted SortDropdown UI markup into a standalone exported component, reused verbatim by CollectionGrid/TeamLandingPage/DriverLandingPage
key-files:
  created:
    - src/components/TeamLandingPage.tsx
    - src/components/DriverLandingPage.tsx
  modified:
    - src/components/CollectionGrid.tsx
    - src/main.tsx
decisions:
  - Local SORTS array literal duplicated in TeamLandingPage.tsx/DriverLandingPage.tsx rather than exported from CollectionGrid.tsx, per plan's explicit instruction (only the hook/component are exported, not the data constants)
  - getCleanPrice price-parsing helper re-implemented locally in both landing pages (3-line duplicate) instead of importing a non-exported helper from CollectionGrid.tsx
metrics:
  duration: 25m
  tasks_completed: 3
  files_changed: 4
  completed: 2026-06-26
---

# Phase 05 Plan 03: React Landing Page Components Summary

Extracted CollectionGrid.tsx's filter/sort state logic and UI into reusable exports, then built TeamLandingPage.tsx and DriverLandingPage.tsx that compose hero/breadcrumb/bio headers with the existing CollectionCard grid and SortDropdown — without forking any of the ~250 lines of filter/sort logic.

## What Was Built

**Task 1 — Extracted `useUrlSyncedFilter` hook and `SortDropdown` component from CollectionGrid.tsx:**
Generalized the previously inline, duplicated category/sort URL-param state (init-from-URL + `Array.find()` allow-list guard + popstate listener + pushState handler) into one exported hook: `useUrlSyncedFilter(paramName, allowList, defaultValue)` returning `[value, setValue, handleSelect]`. The exact `Array.find(v => v.toLowerCase() === param.toLowerCase())` allow-list guard is preserved verbatim — no raw URL param value is ever trusted directly. Also extracted the sort button + dropdown markup into an exported `SortDropdown` component with identical inline styles. `CollectionGrid` itself now calls `useUrlSyncedFilter` twice (category, sort) and renders `<SortDropdown>` instead of inline JSX; its own rendered output, exports (`F1_PRODUCTS`, `CATEGORIES`, `SORTS`, `CATEGORY_DESCRIPTIONS`, `CollectionRow`, `CategoryCard`), and DOM structure are unchanged.

**Task 2 — Built `TeamLandingPage.tsx` and `DriverLandingPage.tsx`:**
Both components render hero image, breadcrumb (`Home / Teams|Drivers / {title}`), `<h1>` title, bio `<p>`, a sticky sort-only filter bar (reusing `SortDropdown`), and a CSS grid of `CollectionCard` for each product — sorted client-side via `useUrlSyncedFilter('sort', SORTS, 'Default')` with a locally re-implemented price-parse comparator (since `getCleanPrice` is not exported from CollectionGrid.tsx). Both render "No products found." for empty product arrays, matching CollectionGrid's existing empty-state pattern. `DriverLandingPage` additionally renders `teamName` as an inline `<a href={teamLink}>` appended to the bio paragraph when both props are present (`{bio} <a>{teamName} →</a>`), satisfying the "driver's current team linked/highlighted in the bio" requirement.

**Task 3 — Wired mounts into `main.tsx`:**
Added two additive mount blocks immediately after the existing `collection-grid-root` block, each following the identical JSON-parse-with-fallback pattern: `#team-landing-root` reads `data-title`/`data-hero-image`/`data-bio`/`data-logo`; `#driver-landing-root` reads the same plus `data-team-name`/`data-team-link`. Both parse `#collection-products-data` with the same try/catch + `Logger.error` fallback to `[]` used elsewhere in main.tsx. The megamenu `showDropdown`/`hideDropdown` hover-binding block was left byte-identical (verified via grep).

## Deviations from Plan

None — plan executed exactly as written. The two design decisions called out above (local `SORTS` constant duplication, local `getCleanPrice` re-implementation) were both explicitly directed by the plan's `<action>` text, not deviations.

## Known Stubs

None. Both landing pages are fully wired to live product data passed through props from main.tsx's mount blocks (sourced from the `#collection-products-data` JSON island, same data source CollectionGrid.tsx already uses on `/collections/all`). No hardcoded empty arrays, no placeholder text.

## Threat Flags

None. The plan's `<threat_model>` anticipated both threats present in this plan's surface:
- T-05-05 (Tampering via sort/category URL params) — mitigated by reusing the exact `Array.find()` allow-list guard inside the now-shared `useUrlSyncedFilter` hook; both TeamLandingPage and DriverLandingPage inherit this guard automatically since they call the same hook.
- T-05-06 (bio/team-name rendered into JSX) — accepted per plan; React's default JSX text escaping applies identically in both new components (no `dangerouslySetInnerHTML` used anywhere in this plan's files).

No new security-relevant surface (network endpoints, auth paths, schema changes) was introduced beyond what the plan's threat model already covered.

## Verification

- `npm run build` (`tsc && vite build`) compiles with zero TypeScript errors across all three tasks.
- `CollectionGrid.tsx` still exports `Product`, `CollectionCard`, `CategoryCard`, `CollectionRow`, `CollectionGrid` unchanged, plus the two new exports `useUrlSyncedFilter` and `SortDropdown`.
- `main.tsx`'s existing `collection-grid-root` mount block and megamenu binding code (`showDropdown`/`hideDropdown`) are untouched (grep-verified, no diff in that code region beyond the two new additive blocks).

## Self-Check: PASSED

- FOUND: src/components/TeamLandingPage.tsx
- FOUND: src/components/DriverLandingPage.tsx
- FOUND: src/components/CollectionGrid.tsx (modified)
- FOUND: src/main.tsx (modified)
- FOUND commit: 1216bc3 (Task 1 — useUrlSyncedFilter/SortDropdown extraction)
- FOUND commit: af48af0 (Task 2 — TeamLandingPage/DriverLandingPage)
- FOUND commit: 71d3f5d (Task 3 — main.tsx mounts)
- `npm run build` succeeds with zero TS errors after all three commits
