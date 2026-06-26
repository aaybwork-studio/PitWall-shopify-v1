---
phase: 05-navbar-redesign-team-driver-visual-dropdowns-landing-pages
plan: 04
subsystem: navigation-and-collections
tags: [shopify-admin, collections, metafields, navbar, verification]
dependency-graph:
  requires: ["05-01", "05-02", "05-03"]
  provides: ["12 live Shopify Collections matching navbar links", "verified zero dead navbar links"]
  affects: ["sections/header-nav.liquid", "templates/collection.team.json", "templates/collection.driver.json"]
tech-stack:
  added: []
  patterns: ["Shopify Admin-only setup task (Collections + metafield definitions) reconciled against theme code preset links"]
key-files:
  created: []
  modified: []
decisions:
  - "No reconciliation edits needed in sections/header-nav.liquid — all 12 collection handles created in Shopify Admin matched the seed data in the preset block exactly."
metrics:
  duration: "10m"
  completed: 2026-06-26
---

# Phase 5 Plan 4: Collection Creation & Navbar Link Verification Summary

12 Shopify Collections (6 teams, 6 drivers) created in Admin with metafields and alternate templates assigned; all handles matched the navbar preset exactly, so zero theme-code changes were required to close out CONTEXT decision #8 (no dead navbar links).

## What Was Done

**Task 1 (checkpoint:human-action, completed by user):**
- User created 12 Collections in Shopify Admin:
  - Teams: `red-bull-racing`, `scuderia-ferrari`, `mclaren-f1-team`, `mercedes-amg-f1-team`, `aston-martin-f1-team`, `williams-racing`
  - Drivers: `max-verstappen`, `lewis-hamilton`, `charles-leclerc`, `lando-norris`, `oscar-piastri`, `george-russell`
- Defined 5 collection metafields (`custom.hero_image`, `custom.bio`, `custom.logo`, `custom.team_name`, `custom.team_link`)
- Assigned `collection.team` theme template to the 6 team Collections and `collection.driver` to the 6 driver Collections
- Populated hero/bio/logo/team_name/team_link metafield values for all 12 Collections
- User confirmation: "done — all 12 Shopify Collections created with metafields, templates assigned, all handles match the seed list exactly (no deviations reported)."

**Task 2 (auto, this session):**
- Read `sections/header-nav.liquid`'s `{% schema %}` preset block (lines 440-451) and cross-checked all 12 `team_item`/`driver_item` link values against the handles reported in Task 1's resume-signal.
- Result: every one of the 12 `/collections/{handle}` link values in the preset matches the handle the user created in Admin exactly — `red-bull-racing`, `scuderia-ferrari`, `mclaren-f1-team`, `mercedes-amg-f1-team`, `aston-martin-f1-team`, `williams-racing`, `max-verstappen`, `lewis-hamilton`, `charles-leclerc`, `lando-norris`, `oscar-piastri`, `george-russell`.
- No mismatches found. No edits to `sections/header-nav.liquid` were necessary, and no merchant-side `config/settings_data.json` correction is needed since the preset was never out of sync.

## Verification Limitation

This execution environment has no running `npx shopify theme dev` preview server and no access to the live published store, so the automated `curl` HTTP-status check specified in the plan's `<verify>` block (`MANUAL_CHECK_REQUIRED` fallback) could not be executed from this sandbox. Verification of "all 12 URLs return 200" therefore rests on:
1. Handle-string equality between the navbar preset and the Collections the user reported creating (confirmed, exact match).
2. The user's explicit checkpoint confirmation that all 12 Collections were created with templates and metafields assigned (Admin-side completeness, confirmed by user report).

No further action is needed unless a future visual QA pass on the live store surfaces a 404 — in which case the cause would be an Admin-side handle typo, not a theme-code defect, since the preset values are correct as authored in Plan 01.

## Deviations from Plan

None - plan executed exactly as written. No handle mismatches were found, so the conditional reconciliation logic in Task 2's `<action>` (editing the preset's `link` setting, or flagging a `settings_data.json` follow-up for the merchant) was not triggered.

## Known Stubs

None introduced by this plan. Per Task 1 step 4, any of the 12 Collections left without products will render the React grid's existing graceful empty-state message (built in Plan 03) rather than a stub — this is expected behavior, not a gap.

## Threat Flags

None. This plan introduced no new code surface; all changes were Admin-side data entry (Collections, metafields) already covered by Plan 02/03's threat model (T-05-07, accepted).

## Self-Check: PASSED

- sections/header-nav.liquid preset block at lines 440-451: FOUND, contains all 12 expected handle strings, unmodified.
- No new files were created or modified by this plan (verification-only task, zero deviation).
- No new commit hash to verify for Task 2 (no code changes); Task 1 was a human-action checkpoint completed in Shopify Admin, outside repo state.
