# Pitwall Shopify Theme — About & All Products Pages

## What This Is

A custom Shopify Liquid theme ("PitWall-shopify-v1") for the Pitwall F1/racing apparel brand, built with a Vite + Tailwind + TypeScript pipeline and a brutalist design system. This milestone adds two new customer-facing pages — an **About page** (`/pages/about`) and an **All Products page** (`/collections/all`) — rendered through new Liquid templates/sections so the theme's already-wired navigation buttons finally lead to designed pages.

## Core Value

The two new pages must look unmistakably **Pitwall** — its brutalist F1 aesthetic and existing design tokens — while delivering the editorial structure of the reference designs. If the layouts are right but the brand identity is generic, the work has failed.

## Requirements

### Validated

<!-- Inferred from the existing mapped codebase. -->

- ✓ Shopify Liquid theme with Vite/Tailwind/TS build pipeline — existing
- ✓ Brutalist design system (tokens, fonts, grain overlay, full-bleed sections) in `tailwind.config.js`, `assets/pitwall-style.css.liquid`, `src/index.css` — existing
- ✓ Persistent header nav (MENU / logo / CART) + slide-in menu overlay + footer, with links already pointing to `/collections/all`, `/pages/about`, `/cart` — existing in `layout/theme.liquid`
- ✓ Home page (`templates/index.json` → `sections/hero-canvas.liquid`) and Product page (`templates/product.json` → `sections/product-detail.liquid`) — existing

### Active

<!-- This milestone. Building toward these. -->

- [ ] About page rendered at `/pages/about` via a new section + page template, in Pitwall brand identity, structured after the editorial reference (image-left, labelled text columns: About / Credits / Contact, large faded background wordmark)
- [ ] All Products page rendered at `/collections/all`, in Pitwall brand identity, structured after the shop-all reference (top label row, clean product grid with name + price + pre-order tags beneath each card)
- [ ] Product grid populated with hardcoded/placeholder products (reusing the existing `collections.all.products`-with-static-fallback pattern), so the page renders correctly before real catalog data is wired
- [ ] Existing nav/footer buttons (ABOUT, SHOP/SHOP NOW) confirmed to land on the new designed pages
- [ ] Page text content editable via section schema settings where practical

### Out of Scope

- Real product data / live catalog integration — deferred; placeholder products for now per user decision
- Cart and checkout functionality — handled by Shopify core, not part of this build
- Editing the live oddritualgolf.com store — odd ritual is a **design reference only**, not the target
- A standalone (non-Shopify) web app — explicitly rejected; build is native Liquid theme files
- Rebranding or redesigning existing pages (home, product) — only the two new pages are in scope

## Context

- **Target repo:** `github.com/aaybwork-studio/PitWall-shopify-v1` (local: `/Users/kura/Antigravity Projects/pitwall-shopify-theme`). New pages are committed/pushed here and deployed via Shopify CLI so they appear on the live site.
- **Design references (inspiration only):** "odd ritual" / oddritualgolf.com — image 1 = shop-all grid layout; image 2 = about-page editorial layout. Borrow structure/composition, NOT visual style. Visual style comes from Pitwall's own tokens.
- **Brand tokens (must reuse exactly):** bg `#EDEBE5`, fg `#0C0C0C`, accent racing-yellow `#F6C917`; fonts Syne (display), Barlow (body), IBM Plex Mono (technical labels); zero border-radius, persistent grain overlay, full-bleed sections, uppercase display/labels. Full detail in `.planning/codebase/CONVENTIONS.md`.
- **How pages are added (mapped):** create `sections/page-<name>.liquid` (+ `{% schema %}`) and `templates/page.<name>.json` (or `collection.json` for the all-products route), then assign the template in Shopify admin. See `.planning/codebase/STRUCTURE.md`.
- **User:** non-deeply-technical; defers tech/implementation choices to Claude. Products are placeholder for this milestone.

## Constraints

- **Tech stack**: Shopify Liquid + Vite/Tailwind/TypeScript — must stay within the existing theme pipeline for seamless import. No new frameworks.
- **Design system**: Never introduce raw hex or new colors without a CSS var/token; reuse existing BEM classes in Liquid (no Tailwind utilities inside `.liquid` files per convention); preserve grain overlay and zero-radius rules.
- **Routing**: Pages must render at the routes the existing buttons already point to (`/pages/about`, `/collections/all`).
- **Data**: Hardcoded/placeholder products only this milestone.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build as native Shopify Liquid theme files (not standalone app) | Must import seamlessly into existing live theme | — Pending |
| odd ritual is design reference only; Pitwall brand identity governs visuals | User clarified the real store is Pitwall | — Pending |
| Hardcoded/placeholder products for the grid | Real catalog integration deferred | — Pending |
| All Products page targets `/collections/all` (existing SHOP button route) | Reuse existing nav wiring; collection template route | — Pending |
| Skip project research; reuse codebase map | Domain well-understood, theme already mapped | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-30 after initialization*
