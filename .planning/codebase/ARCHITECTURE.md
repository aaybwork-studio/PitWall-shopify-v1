<!-- refreshed: 2026-05-30 -->
# Architecture

**Analysis Date:** 2026-05-30

## System Overview

```text
┌──────────────────────────────────────────────────────────────────────┐
│                     layout/theme.liquid                              │
│  <head> assets · grain overlay · <header> nav · <main> · <footer>   │
└────────────────────────────┬─────────────────────────────────────────┘
                             │  {{ content_for_layout }}
                             ▼
┌──────────────────────────────────────────────────────────────────────┐
│              templates/*.json  (page router)                         │
│   index.json · product.json  — declare section order + settings      │
└────────────────────────────┬─────────────────────────────────────────┘
                             │  section type → sections/*.liquid
                             ▼
┌──────────────────────────────────────────────────────────────────────┐
│              sections/*.liquid  (content blocks)                     │
│   hero-canvas.liquid · product-detail.liquid                         │
│   Embed data-* attributes from Liquid → React mount points           │
└────────────────────────────┬─────────────────────────────────────────┘
                             │  DOM ids: #hero-video-root, etc.
                             ▼
┌──────────────────────────────────────────────────────────────────────┐
│              assets/pitwall-interactive.js  (React bundle)           │
│   Built from src/main.tsx via Vite → mounts React/Three.js widgets  │
└──────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Theme layout | Global HTML shell, nav, footer, asset tags | `layout/theme.liquid` |
| Page router | Maps URL template → section list + settings | `templates/index.json`, `templates/product.json` |
| Hero section | Video playlist, product grid, manifesto, about strip | `sections/hero-canvas.liquid` |
| Product section | Passes Liquid product data to React via data-* attrs | `sections/product-detail.liquid` |
| React/Three.js bundle | CarCanvas, VideoBackground, ProductScrollytelling, mute, nav logic | `assets/pitwall-interactive.js` (built from `src/`) |
| Vite build | Compiles `src/main.tsx` + Tailwind CSS into `assets/` | `vite.config.ts` |
| Brutalist CSS | Custom CSS variables, layout, animation primitives | `assets/pitwall-style.css.liquid` |
| Tailwind output | Utility classes compiled from `src/index.css` | `assets/main.css` |

## Pattern Overview

**Overall:** Shopify Liquid shell + React island architecture

**Key Characteristics:**
- `layout/theme.liquid` is the single HTML document frame — nav and footer live here as static Liquid, not in sections
- Templates are JSON files that declare which sections render inside `{{ content_for_layout }}`
- Sections are self-contained Liquid files with an inline `{% schema %}` block defining Shopify theme editor settings
- React components are mounted as islands by `src/main.tsx` on `DOMContentLoaded`; Liquid passes data to React via `data-*` HTML attributes on mount-point `<div>` elements
- No snippets directory exists yet — all reusable markup is inlined in sections or `theme.liquid`

## Layers

**Layout Layer:**
- Purpose: Single persistent HTML document frame
- Location: `layout/theme.liquid`
- Contains: `<head>`, asset tags, global grain overlay, `<header>` nav, `{{ content_for_layout }}`, `<footer>`, global JS bundle tag
- Depends on: `assets/pitwall-style.css.liquid`, `assets/main.css`, `assets/pitwall-interactive.js`
- Used by: Every page in the store

**Template Layer:**
- Purpose: Route each URL template type to an ordered list of sections
- Location: `templates/*.json`
- Contains: JSON `{ "sections": { ... }, "order": [...] }` — no Liquid logic
- Depends on: Section names referenced by `"type"` key matching `sections/<type>.liquid`
- Used by: Shopify routing engine

**Section Layer:**
- Purpose: Page content blocks; each file is an independently configurable unit
- Location: `sections/*.liquid`
- Contains: HTML/Liquid markup + inline `{% schema %}` JSON
- Depends on: Shopify object model (`product`, `collections`, `section.settings`), React mount point IDs, asset URLs
- Used by: Template JSON files

**Asset/Build Layer:**
- Purpose: Interactive UI components (Three.js 3D, React state, video, nav JS)
- Location: `src/` (source) → `assets/` (output)
- Contains: TypeScript React components in `src/components/`, CSS entry in `src/index.css`, entry point `src/main.tsx`
- Depends on: React 18, Three.js, Motion, Lucide React, Tailwind CSS
- Used by: `layout/theme.liquid` via `{{ 'pitwall-interactive.js' | asset_url | script_tag }}`

## Data Flow

### Homepage Request

1. Shopify serves `layout/theme.liquid` as outer frame (`layout/theme.liquid`)
2. `templates/index.json` resolves to section `"hero-canvas"` (`templates/index.json`)
3. `sections/hero-canvas.liquid` renders; `section.settings.title_text`, `collections.all.products` are evaluated server-side (`sections/hero-canvas.liquid`)
4. Browser parses HTML; `DOMContentLoaded` fires in `pitwall-interactive.js`
5. `src/main.tsx` mounts `VideoBackground` on `#hero-video-root`, `UniversalMuteButton` on `#mute-button-root`, and wires nav hover/scroll logic (`src/main.tsx`)

### Product Page Request

1. `layout/theme.liquid` wraps the response
2. `templates/product.json` resolves to section `"product-detail"` (`templates/product.json`)
3. `sections/product-detail.liquid` serializes Liquid `product` object into `data-*` attributes on `#product-scrollytelling-root` (`sections/product-detail.liquid`)
4. `ProductScrollytelling` React component reads those attributes and mounts full immersive PDP (`src/components/ProductScrollytelling.tsx`)

**State Management:**
- React component-local `useState` only; no shared store
- Cross-component communication via `window.dispatchEvent(new CustomEvent('pitwall:mute', ...))` for mute state
- Cart count displayed via `#cart-counter-display` span in `theme.liquid` header — currently initialized to `0`, no live Shopify Ajax Cart API wiring yet

## Key Abstractions

**React Mount Points:**
- Purpose: DOM nodes placed by Liquid sections that act as React roots
- IDs: `#car-canvas-root`, `#hero-video-root`, `#mute-button-root`, `#product-scrollytelling-root`
- Pattern: Liquid writes asset URLs and product data into `data-*` attributes; `src/main.tsx` reads them with `getAttribute()`

**Section Schema:**
- Purpose: Defines Shopify theme editor controls for each section
- Pattern: Inline `{% schema %}` JSON block at bottom of every `.liquid` file in `sections/`
- Examples: `sections/hero-canvas.liquid` exposes `title_text`, `video_1–3`; `sections/product-detail.liquid` has empty settings array

## Entry Points

**Theme layout:**
- Location: `layout/theme.liquid`
- Triggers: Every page request
- Responsibilities: Renders `<head>` with asset links, global nav header (MENU button, PITWALL logo, CART button), grain overlay, `{{ content_for_layout }}` slot, footer, loads `pitwall-interactive.js`

**JS bundle:**
- Location: `src/main.tsx` → `assets/pitwall-interactive.js`
- Triggers: `DOMContentLoaded`
- Responsibilities: Mounts all React islands, wires nav menu open/close hover logic, scroll-show nav, mute toggle event bus

## Header Navigation — How It Is Wired

The nav is **fully hardcoded in `layout/theme.liquid`**, not a section or snippet.

```
layout/theme.liquid lines 46–86
```

**Structure:**
- `.nav-header > .nav-grid` — CSS grid row with 3 cells
  - `#menu-trigger-btn` (MENU button) — hover/click triggers overlay via JS in `src/main.tsx` (lines 110–146)
  - `.nav-logo-link` — `<a href="/">` with inline PITWALL text
  - `.nav-cart-btn` — `onclick="location.href='/cart'"` (inline handler, not Ajax)
- `#full-menu-overlay` — full-screen takeover div with class `menu-overlay`; activated by `.is-active` CSS class
  - Links hardcoded: `/` HOME, `/collections/all` SHOP, `/pages/about` ABOUT
  - Contact info and image panel hardcoded as static HTML

**JS interaction** (`src/main.tsx` lines 110–160):
- `mouseenter` on `#menu-trigger-btn` → calls `openMenu()` (adds `.is-active`)
- `mouseleave` → `delayClose()` (150ms debounce)
- `mouseenter` on `.menu-content` → `keepOpen()` cancels close timer
- `click` on trigger → toggles open/close
- Scroll > 40% viewport height → adds `.nav-visible` to `.nav-header`

**Cart counter** (`#cart-counter-display`) is a static `0` span — no live cart API call is currently wired.

## Architectural Constraints

- **No snippets directory:** No `snippets/` folder exists. Reusable Liquid partials would need to be created if shared markup is required.
- **Static nav links:** Menu links in `layout/theme.liquid` are hardcoded HTML. Adding a nav item requires editing `theme.liquid` directly, not the Shopify admin menus.
- **Single JS bundle:** All React components compile into one `assets/pitwall-interactive.js`. Any new interactive component must be registered in `src/main.tsx`.
- **`emptyOutDir: false`:** Vite does not clean `assets/` on build. Manual assets (fonts, videos, GLB models, `pitwall-style.css.liquid`) are preserved but stale build artefacts accumulate.
- **CSS split:** Brutalist design tokens live in `assets/pitwall-style.css.liquid` (Liquid file, served as CSS); Tailwind utilities live in `assets/main.css` (Vite output). Both are loaded unconditionally on every page.

## Anti-Patterns

### Inline onclick handlers on nav/footer buttons

**What happens:** `layout/theme.liquid` uses `onclick="location.href='/cart'"` and `onclick="location.href='/collections/all'"` directly on buttons.
**Why it's wrong:** Mixes behaviour into markup; cannot be tested or overridden without editing `theme.liquid`; blocks CSP if ever enforced.
**Do this instead:** Add `id` attributes to those buttons and bind click handlers in `src/main.tsx` alongside the nav wiring.

### Hardcoded nav links

**What happens:** `HOME`, `SHOP`, `ABOUT` links in the overlay are static HTML in `layout/theme.liquid` lines 62–71.
**Why it's wrong:** Adding or reordering nav items requires a code deploy instead of a Shopify admin menu edit.
**Do this instead:** Render a Shopify linklist: `{% for link in linklists.main-menu.links %}`.

## Error Handling

**Strategy:** No explicit error boundaries. React components render or don't — no `ErrorBoundary` wrappers present in `src/`.

**Patterns:**
- `try/catch` around video playlist JSON parse in `src/main.tsx` (lines 86–96) — falls back to hardcoded video paths
- Liquid `{% else %}` blocks in `hero-canvas.liquid` provide static mock product cards when `collections.all` is empty

## Cross-Cutting Concerns

**Logging:** `console.*` only — no structured logging library
**Validation:** None — product data passed via `data-*` attributes is trusted as Liquid output
**Authentication:** Delegated entirely to Shopify platform; no custom auth logic in theme

---

*Architecture analysis: 2026-05-30*
