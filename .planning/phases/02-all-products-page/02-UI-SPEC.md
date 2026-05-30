# Phase 2: All Products Page — UI Design Contract

**Status:** Approved
**Design Theme:** Brutalist F1 Technical Editorial

## 1. Visual Aesthetics & Design System
All catalog layout components MUST strictly adhere to the Pitwall design system:
- **Background Color:** `#EDEBE5` (`var(--bg)` / `bg-background`).
- **Foreground/Border Color:** `#0C0C0C` (`var(--fg)` / `text-foreground` / `border-[#0C0C0C]`).
- **Accent Color (Racing Yellow):** `#F6C917` (`var(--accent)` / `bg-brand-red` / `text-brand-red`).
- **Typography:**
  - Display / Headlines: **Syne** (700/800 bold, all uppercase, tight line-height).
  - Body Copy: **Barlow** (300/400 light-regular, sentence case).
  - Technical / Mono / Labels: **IBM Plex Mono** (400/600, all uppercase, letter-spaced).
- **Border Radius:** `0px !important` for all components, blocks, and image overlays.
- **Grain Overlay:** Active globally.

---

## 2. Layout Structure & Staggered Grid
The All Products page implements an asymmetric, staggered repeating grid:
- **Page Container:** Spans full viewport width with a solid top border separating the navigation header (`pt-24 px-5 md:px-[100px] pb-24 bg-background`).
- **Top Label Row:**
  - Renders a clean Technical Label row (`border-b border-[#0C0C0C] pb-6 mb-16 flex flex-col md:flex-row justify-between items-start md:items-center`).
  - **Left element:** Massive Syne title "ALL PRODUCTS" (`font-display-strict text-[5vw] font-extrabold uppercase`).
  - **Right element:** Technical annotation displaying the active collection season in IBM Plex Mono (e.g. `[ SEASON-01 / CALIBRATION ]`).
- **Catalog Grid (`.product-grid`):**
  - Desktop layout utilizes a `grid grid-cols-12 gap-y-24 gap-x-10`.
  - Grid repeating logic handles product card alignment in cycles of 4:
    - **Card A (Product 1):** Spans columns 1 to 8 (`col-span-7`). Aspects-ratio 4:5portrait.
    - **Card B (Product 2):** Spans columns 8 to 13 (`col-span-5`). Aspect-ratio 3:4 portrait. Offset top margin (`mt-[120px]`).
    - **Card C (Product 3):** Spans columns 1 to 6 (`col-span-5`). Aspect-ratio 3:4 portrait. Offset top margin (`mt-[80px]`).
    - **Card D (Product 4):** Spans columns 6 to 13 (`col-span-7`). Aspect-ratio 4:5 portrait.

---

## 3. Product Hover Cards
Each product card features an immersive brutalist hover experience:
- **Image Container:** Absolute sizing with relative overflow-hidden. Uses custom fallback SVG sketch vectors if no product media exists.
- **Hover State:**
  - Card hover triggers the image scale (`scale-103 duration-300`).
  - Slide-up bottom information panel (`pw-product-hover-info`) absolute overlay with carbon-black background (`bg-[#0C0C0C]`), containing:
    - Product Title: display Syne font, uppercase, off-white text (`text-[#EDEBE5]`).
    - Product Specs/Type: monospace technical label (`text-[9px] uppercase tracking-widest text-[#EDEBE5]/50`).
    - Product Price: monospace price colored in Racing Yellow (`text-brand-red` / `#F6C917`).
    - Pre-Order Status: If active, renders next to or directly below the price tag.

---

## 4. PRE-ORDER Badge Visual Treatment
Pre-order items display clean technical annotations rather than intrusive badges:
- **Mono Label:** `[ PRE-ORDER ]` rendered in bold **IBM Plex Mono** (`font-mono tracking-wider font-semibold`).
- **Color Accent:** Colored in Racing Yellow `#F6C917` (`var(--accent)`).
- **Position:** Placed cleanly inside the card metadata/price info row, aligning with the technical catalog parameters.

---

## 5. Mobile Responsiveness
- Grid collapses to `grid-cols-1` below the `767px` viewport width.
- Alternating margins (`mt-120px`, `mt-80px`) are completely disabled on mobile.
- All product cards span full screen width, stacked sequentially with vertical spacing (`flex flex-col gap-12`).
- Horizontal page padding scales down from `100px` to `20px` mobile padding.

---

## 6. Section Schema Settings
The collection section customizer `{% schema %}` exposes:
- **Collection Header:** text settings to customize "ALL PRODUCTS".
- **Technical/Season Label:** text settings for "SEASON-01 / CALIBRATION".
- **Product Listing Size:** limit loops or catalog items.

---

*Phase 2: All Products Page UI Spec*
*Generated: 2026-05-31*
