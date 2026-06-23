# Phase 04 Context — Redesign Collections Page (Horizontal Scroll & Category Rows)
**Date:** 2026-06-23
**Status:** Ready for planning

---

<domain>
## Phase Boundary

Redesign the Collections page (`/collections/all`) to support category-grouped product rows. Each category will be displayed as a single horizontal scrolling row containing a distinct Category Card and all products belonging to that category. The main title will be customizable (defaulting to "Our Products") and the filter and sort bar will remain fully integrated with the global navigation.

**Full layout sequence of the collections page:**
1. Global Navigation Header (from `layout/theme.liquid`)
2. Customizable Header Title ("Our Products") with sub-navigation links for each category (acting as filter tabs) and a sorting dropdown.
3. Category-based horizontal scrolling rows. Each row is scrollable horizontally on desktop (with hover navigation arrows) and mobile (via swipe gestures).
4. Global Footer (from `layout/theme.liquid`)
</domain>

---

<decisions>
## Layout & Scroll Behavior
- **D-01 (Horizontal Category Rows):** Group products by category. Each category is displayed on the page as its own horizontal scroll row.
- **D-02 (Alternating Category Card Placements):** Each row contains exactly one Category Card. The position of this card within the horizontal scrolling list alternates dynamically per row to match the brutalist editorial feel:
  - Row 1: Index 1 (2nd card)
  - Row 2: Index 3 (4th card)
  - Row 3: Index 0 (1st card)
  - Row 4: Index 2 (3rd card)
  - (Repeat pattern if there are more categories)
- **D-03 (Card Dimensions):** Fixed card dimensions for horizontal scrolling layout: **320px width** by **380px height** (Option B).
- **D-04 (Desktop Navigation Arrows):** Add left/right scrolling arrow overlays that appear on hover on the sides of each row (desktop only) to allow click-to-scroll, with native touch scrolling on mobile.

## Header & Filter/Sort Controls
- **D-05 (Customizable Title):** Change the main page header to "Our Products". Make this header text customizable in the Shopify theme customizer settings schema under `sections/collection-all.liquid`.
- **D-06 (Filter Sub-navigation Links):** Display the category sub-navigation as text link tabs directly below the page title (similar to the reference design).
- **D-07 (Sub-navigation Filter Click Behavior):** If a specific category link is clicked, filter the page to display **only that category's horizontal row** (including its alternating Category Card and products), rather than a flat grid.
- **D-08 (Categorized Sorting):** When a sorting option (e.g., Price: Low to High) is chosen, keep the category-grouped horizontal rows, but sort the products *within* each row.

## Card Content & Copy
- **D-09 (Category Descriptions):** Category Cards display the category title in Syne font, a link path (e.g., "→ VIEW ALL / WLED LIGHT BOXES"), and a brief description. Copy should be simple and to the point:
  - *WLED Light Boxes:* High-intensity backlit team emblems. Engineered for the pitwall.
  - *Car Models:* Precision-detailed scale replicas. Formula 1 design heritage.
  - *2D Wall Art:* Steel circuit maps and silhouettes. Minimalist metalwork.
  - *Keychains:* Carbon weave and leather racing keychains. Built for speed.
  - *Desk Accessories:* Monobloc caliper stands and track maps. Optimised for focus.
  - *Layered Art:* Multi-depth plywood circuit artwork. Structured design.
  - *Driver Figurines:* Hand-painted champion driver collectibles. Polyresin replicas.
- **D-10 (Card Hover & UX):** Retain the existing hover overlays (with specifications and "VIEW" buttons sliding up over the card image) to maintain brand consistency.
- **D-11 (Navbar Integration):** Coordinate styling and spacing so that the sticky filter/sort bar (`top: 64px`) coordinates perfectly with the global navigation header when scrolling.
</decisions>

---

<canonical_refs>
## Canonical References

- [sections/collection-all.liquid](file:///Users/kura/Antigravity%20Projects/F1%20Project/sections/collection-all.liquid) — Mounts the React CollectionGrid island and defines customizer schemas.
- [src/components/CollectionGrid.tsx](file:///Users/kura/Antigravity%20Projects/F1%20Project/src/components/CollectionGrid.tsx) — Main React component rendering the collections layout.
- [src/main.tsx](file:///Users/kura/Antigravity%20Projects/F1%20Project/src/main.tsx) — Entry point for React bootstrapping.
- [layout/theme.liquid](file:///Users/kura/Antigravity%20Projects/F1%20Project/layout/theme.liquid) — Global layout framework.
</canonical_refs>

---

<code_context>
## Code Context & Reusable Assets
- **Vite compilation:** Use `npm run build` or `npm run dev` to compile typescript changes.
- **Tailwind class access:** Ensure classes map correctly to existing BEM conventions and variables from `src/index.css`.
</code_context>
