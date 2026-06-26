---
phase: 05-navbar-redesign-team-driver-visual-dropdowns-landing-pages
verified: 2026-06-26T00:00:00Z
status: human_needed
score: 8/9 must-haves verified (code-side); 1 requires live-store confirmation
overrides_applied: 0
human_verification:
  - test: "Visit the live/preview storefront, hover TEAMS and DRIVERS in the desktop nav, and click through all 12 navbar entries (red-bull-racing, scuderia-ferrari, mclaren-f1-team, mercedes-amg-f1-team, aston-martin-f1-team, williams-racing, max-verstappen, lewis-hamilton, charles-leclerc, lando-norris, oscar-piastri, george-russell)."
    expected: "Every link returns 200 (no 404), each page renders hero/bio/breadcrumb/sort-bar/grid via collection.team.json or collection.driver.json, and /collections/all is unaffected."
    why_human: "These are live Shopify Admin Collections + metafield definitions + template assignments that exist outside this git repo. The 05-04-SUMMARY.md claims a user confirmed creation in Admin, but there is no artifact in the codebase (no API access, no theme dev preview run in this session) that proves the 12 Collections actually exist, have the correct handles, have the alternate template assigned, or have non-empty metafields. The plan's own automated verify step degraded to 'MANUAL_CHECK_REQUIRED' and was never actually executed against a live URL in this session."
---

# Phase 5: Navbar Redesign — Team/Driver Visual Dropdowns & Landing Pages Verification Report

**Phase Goal:** Editable-in-Shopify navbar (theme blocks, repeatable team/driver items with images), clicking any team/driver leads to a real working landing page (hero + filters + product grid), zero dead links, 6 teams + 6 drivers launch roster.
**Verified:** 2026-06-26
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Merchant can add/edit/remove/reorder team/driver entries from theme editor | VERIFIED | `sections/header-nav.liquid` defines `team_item`/`driver_item`/`nav_group` block types in `{% schema %}` (lines 344-435), looped via `{% for block in section.blocks %}` at 5 render sites (desktop teams, desktop drivers, mobile teams, mobile drivers) |
| 2 | Teams dropdown shows livery image + name, grouped current(2-col)+Legacy | VERIFIED | Preset seeds `current_1`/`current_2`/`legacy` groups (6 team_item + 2 nav_group blocks); markup renders `team-car-img-wrap`/`team-card-name` per group routing logic |
| 3 | Drivers dropdown shows circular headshot + name, grouped Active(2-col)+Alumni | VERIFIED | `.driver-headshot-wrap` CSS confirmed in `src/index.css` (border-radius:50%, documented exception); preset seeds 6 driver_item blocks all `group: active` (no alumni in launch roster — schema supports it, just unused by default seed, consistent with plan) |
| 4 | Desktop hover/mouseleave panel behavior preserved (JS untouched) | VERIFIED | `data-dropdown="teams"`/`"drivers"` and `data-panel="teams"`/`"drivers"` present exactly once each in `header-nav.liquid`; `layout/theme.liquid` has zero `data-dropdown` occurrences (fully delegated); `src/main.tsx` `showDropdown`/`hideDropdown` block unmodified per grep |
| 5 | Mobile accordion expands/collapses, lists same entries as desktop | VERIFIED | `mobile-accordion`/`mobile-accordion-content`/`mobile-driver-header`/`mobile-sublinks` classes present, looped from same `section.blocks` source as desktop |
| 6 | Team collection page renders hero/bio/data-island scoped to collection | VERIFIED | `sections/collection-team.liquid`: `#team-landing-root` with `data-title`/`data-hero-image`/`data-bio`/`data-logo`, plus verbatim `collection-products-data` JSON island scoped via `collection \| default: collections.all` |
| 7 | Driver collection page renders same pattern | VERIFIED | `sections/collection-driver.liquid`: identical structure + `data-team-name`/`data-team-link` |
| 8 | `templates/collection.json` (All Products) never modified | VERIFIED | File content confirmed unchanged (`"type": "collection-all"`); `collection.team.json`/`collection.driver.json` are separate new files routing to `collection-team`/`collection-driver` |
| 9 | Every navbar team/driver link resolves to a real, working page (zero dead links) | **UNCERTAIN — human verification required** | Code-side: all 12 handles in `header-nav.liquid` preset match the 12 expected handles exactly (grep-confirmed). Live-store side: the actual existence of 12 Shopify Collections with correct templates/metafields lives entirely in Shopify Admin, outside this repo, and cannot be confirmed by any file or build check. 05-04-SUMMARY.md reports a user confirmation but provides no independently-checkable evidence (no curl/200 check was actually run — plan's own verify script fell back to `MANUAL_CHECK_REQUIRED`). |

**Score:** 8/9 truths verified programmatically; 1 requires human/live confirmation.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `sections/header-nav.liquid` | Editor-configurable header, team_item/driver_item/nav_group blocks, 6+6 preset | VERIFIED | Exists; schema confirmed; preset has exactly 6 team_item, 6 driver_item, 2 nav_group |
| `layout/theme.liquid` | Delegates to `{% section 'header-nav' %}`, zero hardcoded megamenu | VERIFIED | `section 'header-nav'` present; zero `data-dropdown="teams"` occurrences |
| `src/index.css` | New driver-card/headshot/group-label CSS | VERIFIED | `.driver-card`, `.driver-headshot-wrap`, `.driver-card-name`, `.megamenu-group-label` all present and non-trivial |
| `sections/collection-team.liquid` | team-landing-root mount + data island | VERIFIED | Exists, contains `team-landing-root` and `collection-products-data` |
| `sections/collection-driver.liquid` | driver-landing-root mount + data island | VERIFIED | Exists, contains `driver-landing-root` and `collection-products-data` |
| `templates/collection.team.json` | Routes to collection-team | VERIFIED | `"type": "collection-team"` |
| `templates/collection.driver.json` | Routes to collection-driver | VERIFIED | `"type": "collection-driver"` |
| `src/components/TeamLandingPage.tsx` | Hero/breadcrumb/bio/filter/grid | VERIFIED | Exports `TeamLandingPage`, imports `Product`/`CollectionCard`/`SortDropdown`/`useUrlSyncedFilter` from `./CollectionGrid`, renders all required sections + empty state |
| `src/components/DriverLandingPage.tsx` | Same + team-name link in bio | VERIFIED | Exports `DriverLandingPage`, conditionally renders `<a href={teamLink}>{teamName} →</a>` appended to bio when both props present |
| `src/main.tsx` | Mounts both landing pages additively | VERIFIED | `team-landing-root`/`driver-landing-root` mount blocks present; `showDropdown` block untouched |
| 12 live Shopify Collections (handles, templates, metafields) | Real working pages, zero dead links | **UNVERIFIABLE FROM REPO** | Lives in Shopify Admin; no repo artifact proves existence |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `header-nav.liquid` | `src/main.tsx` | `data-dropdown`/`data-panel` attrs | WIRED | Values `"teams"`/`"drivers"` present exactly once each, matches `showDropdown` keying |
| `templates/collection.team.json` | `sections/collection-team.liquid` | `sections.main.type` | WIRED | `"type": "collection-team"` matches section filename |
| `sections/collection-team.liquid` | `src/components/TeamLandingPage.tsx` | `#team-landing-root` data-* attrs | WIRED | main.tsx reads `getAttribute` for title/heroImage/bio/logo, passes as props |
| `src/main.tsx` | `TeamLandingPage`/`DriverLandingPage` | `ReactDOM.createRoot(...).render` | WIRED | Confirmed at main.tsx lines ~238-281 |
| `TeamLandingPage.tsx`/`DriverLandingPage.tsx` | `CollectionGrid.tsx` | named imports | WIRED | Both import `Product, CollectionCard, SortDropdown, useUrlSyncedFilter` |
| `header-nav.liquid` preset links | Live Shopify Collections | matching handles | **UNVERIFIED (live store)** | Code-side handle strings match; live-store existence not independently checkable |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build compiles | `npm run build` | `tsc && vite build` succeeded, 0 errors | PASS |
| No debt markers in modified files | grep TBD/FIXME/XXX/TODO/PLACEHOLDER | no matches | PASS |
| Preset seeds exact roster | Python JSON parse of schema preset | `team_item: 6, driver_item: 6, nav_group: 2` | PASS |
| Live nav link HTTP 200 (12 handles) | curl against preview/live store | not run (no running theme dev server / store URL in this session) | SKIP — escalated to human verification |

### Requirements Coverage

No REQ-IDs mapped to this phase (confirmed: ROADMAP/REQUIREMENTS.md has no Phase 5 entries). N/A.

### Anti-Patterns Found

None. Scanned all phase-touched files (`header-nav.liquid`, `collection-team.liquid`, `collection-driver.liquid`, `TeamLandingPage.tsx`, `DriverLandingPage.tsx`, `main.tsx`) for TBD/FIXME/XXX/TODO/PLACEHOLDER/stub patterns — zero hits.

### Human Verification Required

### 1. Live navbar link resolution (12 Collections)

**Test:** On the live/preview Shopify store, hover TEAMS and DRIVERS in the desktop nav and click through all 12 entries; also check the mobile accordion equivalents.
**Expected:** All 12 URLs resolve (HTTP 200, no theme error page), each renders a hero image (or graceful blank if hero_image unset), the collection title, bio text, sort dropdown, and product grid (or "No products found." empty state). `/collections/all` is unaffected.
**Why human:** The 12 Collections, their alternate-template assignment, and metafield values are Shopify-Admin-only state with no representation in this git repository. 05-04-SUMMARY.md's claim that this was done rests solely on an unverifiable user chat confirmation — the plan's own automated check (`curl` against a live preview URL) was never actually executed in this session and fell back to a manual-check placeholder.

### Gaps Summary

All code-side artifacts for Phase 5 are present, substantive, and correctly wired: the navbar is fully editor-configurable via theme blocks (6 teams + 6 drivers + 2 group labels seeded), the JS hover/mouseleave and mobile-accordion bindings are untouched, the Liquid landing-page infrastructure (sections + alternate templates) correctly scopes hero/bio/data-island per collection without touching the All Products template, and the React landing pages reuse CollectionGrid's filter/sort logic with zero forking, mount cleanly in main.tsx, and the project builds with zero TypeScript errors.

The one gap is structural, not a code defect: the phase's final success criterion — "zero dead links" across 12 real Shopify Collections — depends on Shopify Admin state (Collections, metafield definitions, template assignments) that this repository cannot observe or verify. The SUMMARY's claim of completion is plausible and the code-side handle strings are internally consistent, but per the adversarial verification mandate, an unverified human claim about external system state is not evidence. This must be confirmed by a human checking the live/preview store directly.

---

_Verified: 2026-06-26_
_Verifier: Claude (gsd-verifier)_
