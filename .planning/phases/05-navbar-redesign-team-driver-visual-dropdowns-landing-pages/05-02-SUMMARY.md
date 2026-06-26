---
phase: 05-navbar-redesign-team-driver-visual-dropdowns-landing-pages
plan: 02
subsystem: liquid-templates
tags: [shopify, liquid, collections, landing-pages]
dependency-graph:
  requires: []
  provides:
    - sections/collection-team.liquid
    - sections/collection-driver.liquid
    - templates/collection.team.json
    - templates/collection.driver.json
  affects:
    - src/components/TeamLandingPage.tsx (Plan 03, future mount target)
    - src/components/DriverLandingPage.tsx (Plan 03, future mount target)
tech-stack:
  added: []
  patterns:
    - Reused collection-all.liquid's JSON product data island pattern verbatim for both new sections
    - Alternate Shopify JSON templates routing to dedicated sections without touching the default collection.json
key-files:
  created:
    - sections/collection-team.liquid
    - sections/collection-driver.liquid
    - templates/collection.team.json
    - templates/collection.driver.json
  modified: []
decisions:
  - Hero/bio/logo content sourced from collection metafields (Dynamic Sources-compatible) rather than section settings, since the data is per-Collection, not per-section-instance
  - Driver section adds team-name/team-link data attributes to support the "driver's current team" bio highlight per CONTEXT decision
metrics:
  duration: 10m
  tasks_completed: 2
  files_changed: 4
  completed: 2026-06-26
---

# Phase 05 Plan 02: Liquid Landing Page Infrastructure Summary

Created the Shopify Liquid infrastructure (two sections, two alternate JSON templates) that lets any Collection render as a team or driver landing page with a hero/bio mount point and a reused product data island, without touching the existing All Products template.

## What Was Built

**Task 1 — `sections/collection-team.liquid` and `sections/collection-driver.liquid`:**
Each section renders a root `<div>` (`#team-landing-root` / `#driver-landing-root`) carrying data attributes sourced from collection metafields:
- `data-title` (collection.title)
- `data-hero-image` (collection.metafields.custom.hero_image)
- `data-bio` (collection.metafields.custom.bio, escaped)
- `data-logo` (team only, collection.metafields.custom.logo)
- `data-team-name` / `data-team-link` (driver only, links back to the driver's current team)

Both sections include the exact `#collection-products-data` JSON script island copied verbatim from `collection-all.liquid`, so the existing React product grid pattern continues to work unmodified — `collection` is auto-scoped to the in-context Collection object on these alternate templates.

**Task 2 — `templates/collection.team.json` and `templates/collection.driver.json`:**
Alternate JSON templates that route to `collection-team` and `collection-driver` sections respectively, structurally identical to `templates/collection.json` except for the section `type`. `templates/collection.json` was never read-and-rewritten and remains byte-identical (verified via `git diff --quiet`).

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. These are pure Liquid mount points with no UI rendering logic; the React components that consume the data attributes (`TeamLandingPage.tsx`, `DriverLandingPage.tsx`) are explicitly deferred to Plan 03 per the plan's interfaces/key_links section.

## Threat Flags

None — both threats identified in the plan's threat model (`T-05-03` bio attribute escaping, `T-05-04` reused JSON data island) were addressed exactly as specified: the `bio` metafield is piped through `| escape` before landing in the `data-bio` attribute, and the product data island pattern is the existing, already-reviewed verbatim copy from `collection-all.liquid`. No new security-relevant surface was introduced beyond what the plan anticipated.

## Self-Check: PASSED

- FOUND: sections/collection-team.liquid
- FOUND: sections/collection-driver.liquid
- FOUND: templates/collection.team.json
- FOUND: templates/collection.driver.json
- FOUND commit: ce4ca7e
- FOUND commit: 70bdf66
- templates/collection.json: zero diff confirmed
