<!-- refreshed: 2026-06-19 -->
# Architecture

**Analysis Date:** 2026-06-19

## System Overview

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                             layout/theme.liquid                            │
│  <head> assets · grain overlay · dynamic <header> nav + cart · <footer>   │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │  {{ content_for_layout }}
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                        templates/*.json  (page router)                     │
│  index.json · product.json · collection.json · page.about.json · 404.json  │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │  section type → sections/*.liquid
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                        sections/*.liquid  (content blocks)                 │
│  hero-canvas.liquid · product-detail.liquid · collection-all.liquid        │
│  page-about.liquid · page-contact.liquid · main-404.liquid                 │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │  DOM ids: #homepage-interactive-root, etc.
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                 assets/pitwall-interactive.js  (React bundle)              │
│  Built from src/main.tsx via Vite → mounts React/Three.js islands          │
└────────────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Theme layout | Global HTML shell, dynamic navigation bar with hover megamenus, cart count, mobile accordion overlay, footer, asset tags | `layout/theme.liquid` |
| Page router | Maps URL template → section list + settings | `templates/*.json` |
| Hero section | Liquid content settings + mount point for homepage takeover scrollytelling | `sections/hero-canvas.liquid` |
| Product section | Immersive product detail page mount point + settings | `sections/product-detail.liquid` |
| Collection section | Collection product grid React mount point + schema settings | `sections/collection-all.liquid` |
| About section | Editorial layout for `/pages/about` (Liquid-only brutalist structure) | `sections/page-about.liquid` |
| React/Three.js bundle | Front-end components (Three.js 3D renderer, Framer Motion, Collection grid, Ajax cart dropdown, wheel scroll state machine) | `assets/pitwall-interactive.js` (built from `src/`) |
| Vite build | Compiles `src/main.tsx` + Tailwind CSS into `assets/` | `vite.config.ts` |
| Brutalist CSS | Custom CSS variables, layout, animation primitives | `assets/pitwall-style.css.liquid` |
| Tailwind output | Compiled utility classes from `src/index.css` | `assets/main.css` |

## Pattern Overview

**Overall:** Shopify Liquid shell + React island architecture.

**Key Characteristics:**
- `layout/theme.liquid` is the master layout. Navigation menu structure and footer are written here. The header is color-adaptive (dark over hero, light on editorial content) and auto-hides on scroll down.
- Desktop navigation features a dynamic blur-backed megamenu container (`#nav-megamenu-container`) showing grids for DRIVERS, TEAMS, F1 GIFTS, and CATEGORIES on menu item hover.
- Mobile navigation is a slide-in takeover overlay (`#full-menu-overlay`) with interactive accordions.
- The cart icon displays real-time item counts and reveals a hover dropdown overlay showing line items, prices, subtotals, and remove buttons synchronized with the Shopify AJAX Cart API.
- Highly interactive zones (snapping scrollytelling homepage, Three.js car model renderer, WebGL helmet PDP configurators, masonry dynamic collections grid) are React islands mounted onto Liquid-rendered containers with `data-*` attributes.
- Non-interactive pages (e.g. About, Contact, 404) are built using brutalist Liquid-only markup to preserve faster load times.

## Layers

**Layout Layer (`layout/theme.liquid`):**
- Purpose: Outer document container and persistent navigation.
- Contains: Global noise SVG grain overlay, adaptive header navigation, mobile accordion drawer, footer, dynamic cart dropdown container.
- Depends on: `assets/pitwall-style.css.liquid`, `assets/main.css`, `assets/pitwall-interactive.js`.

**Template Layer (`templates/*.json`):**
- Purpose: Configures which Liquid sections render on each route.
- Contains: Configuration JSON pointing to sections.

**Section Layer (`sections/*.liquid`):**
- Purpose: Visual layout blocks with custom schema configurations for store customization.
- Contains: Liquid code, CSS class overrides, and schema definitions.

**Asset/Build Layer (`src/`):**
- Purpose: Client-side logic, WebGL rendering, scroll state machines, and Ajax cart operations.
- Contains: React components, Three.js scenes, motion definitions, and entry points.

## Data Flow

### Homepage Takeover Scrollytelling
1. Shopify serves `layout/theme.liquid` wrapping `templates/index.json` which calls `sections/hero-canvas.liquid`.
2. `hero-canvas.liquid` outputs config variables and JSON scripts containing products and about copy.
3. React mounts `HomepageScrollytelling` at `#homepage-interactive-root`.
4. A **programmatic wheel state machine** listens for wheel scroll and transitions slides smoothly, locking the body scroll on desktop (resolving trackpad inertia issues) while allowing natural scroll on mobile.
5. Manifesto panel images (staggered scale-up reveal) animate in.

### Collections Page Request
1. Navigating to `/collections/all` resolves via `templates/collection.json` to `sections/collection-all.liquid`.
2. Liquid inputs collections products into `#collection-grid-root`.
3. `CollectionGrid.tsx` mounts: parses products, performs category filtering and sorting dynamically, and displays them in a masonry grid.
4. Hovering product cards displays specification overlays and detail buttons.

### Product Page WebGL Configurator
1. Request for product page resolves to `sections/product-detail.liquid`.
2. Liquid passes name, price, and variant JSON to `#product-scrollytelling-root`.
3. `ProductScrollytelling.tsx` initializes a Three.js WebGL scene loading `.glb` car and helmet models from the Shopify CDN.
4. Clicking color/variant controls updates the Three.js model and configures the add-to-cart form parameters dynamically.

**State Management:**
- Component-level `useState` for UI state.
- Custom event `pitwall:mute` for global mute sync.
- Shopify AJAX Cart API (`/cart.js`, `/cart/add.js`, `/cart/change.js`) updates the global cart state, updating the header badge count and the cart dropdown items.

## Entry Points

**Theme Layout (`layout/theme.liquid`):**
- Shell loaded on every request. Initializes dark mode from `localStorage`.

**JS Entry (`src/main.tsx`):**
- Runs on `DOMContentLoaded`. Bootstraps React roots (`HomepageScrollytelling`, `CarCanvas`, `ProductScrollytelling`, `CollectionGrid`, `VideoBackground`) and binds header interactions (megamenu transitions, mobile takeover trigger, scroll-hide window listeners).

---

*Architecture analysis: 2026-06-19*
