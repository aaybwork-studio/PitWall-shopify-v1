# Phase 2: All Products Page - Context

**Gathered:** 2026-05-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Visiting `/collections/all` renders a custom, shippable All Products page that looks unmistakably Pitwall, delivering a premium staggered editorial layout matching the homepage aesthetic. It integrates navigation wiring so that SHOP buttons land correctly at `/collections/all` and displays products using a fallback mock catalog pattern if live product loops are empty.

</domain>

<decisions>
## Implementation Decisions

### Product Grid Layout & Structure
- **D-01 (Staggered Editorial Grid):** The product catalog is rendered in a premium **staggered editorial grid** matching the homepage structure, rather than a uniform/flat columns grid.
- **D-02 (Asymmetric Repeating Columns):** In a 12-column desktop grid container, cards repeat in cycles of 4 with the following classes and structures:
  - **Card 1 (A):** spans cols 1 to 8 (`col-span-7` or similar left-aligned), `aspect-ratio: 4/5`, justify-start.
  - **Card 2 (B):** spans cols 8 to 13 (`col-span-5` or similar right-aligned), `aspect-ratio: 3/4`, margin-top offset, justify-end.
  - **Card 3 (C):** spans cols 1 to 6 (`col-span-5` or similar left-aligned), `aspect-ratio: 3/4`, margin-top offset, justify-start.
  - **Card 4 (D):** spans cols 6 to 13 (`col-span-7` or similar right-aligned), `aspect-ratio: 4/5`, justify-end.
- **D-03 (Mobile Layout):** Swaps to a clean, single-column stacked layout below the `767px` breakpoint, with desktop padding scaling from `100px` down to `20px` mobile padding.

### Visual Styling & Product Cards
- **D-04 (Zero Radius & Image Hover):** All cards have zero border-radius, thin borders where appropriate, and image scaling hover triggers with custom overlays.
- **D-05 (Card Hover Information):** Exposes product details (title, type/specs, price) inside a slide-up block overlay on mouse hover, matching the homepage UX.

### PRE-ORDER Badge Visual Treatment
- **D-06 (Inline Technical Annotation):** Products with pre-order status display an inline technical label in **IBM Plex Mono** (e.g. `[ PRE-ORDER ]` or `// STATUS: PRE-ORDER`) directly adjacent to the price / info section of the hover card or details container.
- **D-07 (Accent Yellow):** The pre-order text is highlighted in high-contrast **Racing Yellow** `var(--accent)` (`#F6C917`) to signal interaction and availability status.

### Dynamic Schema Customizer
- **D-08 (Editable Schema Settings):** The section exposes customizer schema controls for:
  - Section header text (e.g. "ALL PRODUCTS").
  - Technical collection tag / season tag (e.g., "SEASON-01 / ACTIVE").
  - Customizable mock details loop or standard grid configuration settings.

### Mock Fallback Pattern
- **D-09 (Static Fallback catalog):** The section implements the standard `collections.all.products`-with-static-fallback pattern. If the Shopify collections loop is empty, it falls back to rendering at least 4 premium designed mock cards (like `CAR MODELS`, `HELMET REPLICAS`, `TRACK SILHOUETTES`, `DECOR LIGHTS`) matching original design blueprints.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Brand & Layout Guidelines
- [.planning/PROJECT.md](file:///.planning/PROJECT.md) — Base design guidelines, color variables, spacing configurations.
- [.planning/codebase/CONVENTIONS.md](file:///.planning/codebase/CONVENTIONS.md) — BEM CSS classes, font definitions, and responsive breakpoints.
- [.planning/REQUIREMENTS.md](file:///.planning/REQUIREMENTS.md) §v1 — Active collection requirements (APL-01 to APL-05, NAV-01).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `sections/hero-canvas.liquid` — Staggered grid classes and inline sketch SVG fallbacks that can be replicated and optimized for the product catalog collection page.
- `layout/theme.liquid` — Global template document frame hosting navigation links that point to `/collections/all` and `/pages/about`.

### Established Patterns
- Repeating staggered grid columns loop using split arrays and `forloop.index0` modulo checks.
- Zero border-radius (`border-radius: 0px !important`).
- Sliding hover information details on image overlay.

### Integration Points
- Create new section at `sections/collection-all.liquid` containing the responsive staggered loop, stylesheet, and schemas.
- Create JSON template at `templates/collection.json` (or matching collections route) pointing to our newly created `collection-all` section.

</code_context>

<specifics>
## Specific Ideas
- Staggered column layout should utilize a standard modulo `{% cycle 'product-a', 'product-b', 'product-c', 'product-d' %}` loop in Liquid to easily distribute staggered positions!

</specifics>

<deferred>
## Deferred Ideas
- Real catalog Shopify collection sync, product filters, sorting dropdowns (deferred to v2 catalog phases).

</deferred>

---

*Phase: 2-All Products Page*
*Context gathered: 2026-05-31*
