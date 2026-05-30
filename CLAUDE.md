<!-- GSD:project-start source:PROJECT.md -->
## Project

**Pitwall Shopify Theme — About & All Products Pages**

A custom Shopify Liquid theme ("PitWall-shopify-v1") for the Pitwall F1/racing apparel brand, built with a Vite + Tailwind + TypeScript pipeline and a brutalist design system. This milestone adds two new customer-facing pages — an **About page** (`/pages/about`) and an **All Products page** (`/collections/all`) — rendered through new Liquid templates/sections so the theme's already-wired navigation buttons finally lead to designed pages.

**Core Value:** The two new pages must look unmistakably **Pitwall** — its brutalist F1 aesthetic and existing design tokens — while delivering the editorial structure of the reference designs. If the layouts are right but the brand identity is generic, the work has failed.

### Constraints

- **Tech stack**: Shopify Liquid + Vite/Tailwind/TypeScript — must stay within the existing theme pipeline for seamless import. No new frameworks.
- **Design system**: Never introduce raw hex or new colors without a CSS var/token; reuse existing BEM classes in Liquid (no Tailwind utilities inside `.liquid` files per convention); preserve grain overlay and zero-radius rules.
- **Routing**: Pages must render at the routes the existing buttons already point to (`/pages/about`, `/collections/all`).
- **Data**: Hardcoded/placeholder products only this milestone.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.4.5 - All React/Three.js source code under `src/`
- Liquid - Shopify theme templates in `layout/`, `sections/`, `templates/`
- CSS / PostCSS - `src/index.css`, `assets/main.css`, `assets/pitwall-style.css.liquid`
- JavaScript (compiled) - `assets/pitwall-interactive.js` (Vite build output)
- JSON - Shopify section schemas, `config/settings_schema.json`, `locales/en.default.json`, `templates/*.json`
## Runtime
- Browser (client-side SPA islands mounted into Shopify Liquid pages)
- Node.js (build-time only — Vite, TypeScript compiler)
- npm
- Lockfile: `package-lock.json` present
## Frameworks
- React 18.3.1 - UI components compiled to islands mounted into Liquid DOM nodes
- Three.js 0.184.0 - WebGL 3D rendering for F1 car model viewer
- motion 12.40.0 - Animation library (Framer Motion successor) used in React components
- lucide-react 0.378.0 - Icon components (VolumeX, Volume2 in mute button)
- Vite 5.2.11 - Bundler and dev server; config at `vite.config.ts`
- TypeScript 5.4.5 - Type checking; config at `tsconfig.json`
- @vitejs/plugin-react 4.2.1 - React JSX transform plugin for Vite
- Tailwind CSS 3.4.3 - Utility classes; config at `tailwind.config.js`
- PostCSS 8.5.15 - CSS processing pipeline; config at `postcss.config.js`
- autoprefixer 10.5.0 - Vendor prefix injection via PostCSS
## Key Dependencies
- `three` 0.184.0 - Core 3D engine; `GLTFLoader` loads `.glb` car models from `assets/`
- `react` + `react-dom` 18.3.1 - Component runtime; mounted via `ReactDOM.createRoot` on DOM-ready
- `motion` 12.40.0 - Scroll-driven and entrance animations in product scrollytelling
- `@types/three` 0.184.1 - TypeScript definitions for Three.js
- `@types/react` + `@types/react-dom` 18.3.x - TypeScript definitions for React
## Configuration
- Target: ES2020
- Module resolution: `bundler` (Vite-native)
- JSX: `react-jsx` (automatic runtime)
- Strict mode fully enabled: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`
- Path alias: `@/*` → `./src/*`
- `noEmit: true` — Vite handles emit; `tsc` only type-checks
- Single entry: `src/main.tsx`
- Output directory: `assets/` (Shopify theme assets folder)
- `emptyOutDir: false` — preserves manually committed assets (fonts, videos, CSS)
- Fixed output filename: `pitwall-interactive.js` (no content hash)
- Asset filenames: `[name].[ext]` (no hashing)
- Path alias `@` → `./src`
- Content scan: `src/**/*.{js,ts,jsx,tsx}`, `sections/**/*.liquid`, `layout/**/*.liquid`, `templates/**/*.json`
- Custom color tokens: `background`, `foreground`, `brand.red` (Racing Yellow `#F6C917`), `brand.black`, `brand.white`, `surface`
- Custom font families: `display` (Syne), `body` (Barlow), `mono` (IBM Plex Mono) — resolved via CSS custom properties `var(--font-display)` etc.
- Plugins: `tailwindcss`, `autoprefixer`
## Build Pipeline
## Platform Requirements
- Node.js with npm
- Shopify CLI for theme push/serve (not in package.json — assumed global install)
- Shopify Online Store platform
- Assets served from Shopify CDN
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Brand / Design Tokens
### Color Palette
| Token | Hex | CSS Var | Tailwind Class | Role |
|-------|-----|---------|----------------|------|
| Background | `#EDEBE5` | `var(--bg)` / `var(--background)` | `bg-background` / `bg-brand-white` | Main canvas, page background |
| Foreground | `#0C0C0C` | `var(--fg)` / `var(--foreground)` | `text-foreground` / `text-brand-black` | Primary text, nav bar bg |
| Accent / Racing Yellow | `#F6C917` | `var(--accent)` / `var(--brand-red)` | `text-brand-red` / `bg-brand-red` | CTA hover, bullet accents, footer bg, scrollbar hover |
| Footer Yellow (dark) | `#D5A706` | — | `bg-brand-darkRed` | Footer brand mark yellow |
| Surface 1 | `#F5F4F0` | `var(--surface)` | `bg-surface` / `bg-brand-surface` | Menu overlay background, card backgrounds |
| Surface 2 | `#E5E3DD` | `var(--surface-2)` | — (CSS var only) | Image placeholders, scrollbar thumb |
| Border | `rgba(12, 12, 12, 0.10)` | `var(--border)` | — (CSS var only) | Subtle dividers, image borders |
| Muted text | `rgba(12, 12, 12, 0.50)` | `var(--muted)` | `text-brand-black/50` | Secondary/caption text |
### Typography
#### Font Families
| Role | Family | Weight(s) | CSS Var | Tailwind Class |
|------|--------|-----------|---------|----------------|
| Display / Headings | Syne | 700, 800 | `var(--font-display)` | `font-display` |
| Body / Prose | Barlow | 300, 400, 600 | `var(--font-body)` | `font-body` |
| Technical / Mono / Labels | IBM Plex Mono | 400, 600 | `var(--font-mono)` | `font-mono` |
| Secondary / Decorative | Petit Formal Script / btseps2 | normal | `var(--font-secondary)` | (CSS var only) |
| Supplementary | Space Grotesk | 700 | — | (loaded via Google Fonts, not in Tailwind) |
#### Type Utility Classes (use these, do not rebuild)
#### Tailwind Typography Extensions (`tailwind.config.js`)
#### React Typography Components (`src/components/Typography.tsx`)
- `<Display as="h1|h2|h3|h4" indented?>` → `font-display-strict uppercase text-brand-black`
- `<Body as="p|span|div" weight="light|regular|semibold">` → `font-body-strict text-brand-black/70`
- `<Technical as="span|div|p" highlight?>` → `font-technical-strict uppercase` (highlight adds `text-[color:var(--team-accent,var(--brand-red,#F6C917))]`)
### Spacing
| Use | Value |
|-----|-------|
| Desktop horizontal page padding | `100px` |
| Mobile horizontal page padding | `20px` |
| Nav bar height | `64px` |
| Footer top padding (desktop) | `72px` |
| Footer top padding (mobile) | `48px` |
| Section column gap (footer) | `64px` |
| Menu overlay padding-top | `80–100px` |
### Breakpoints
- Mobile breakpoint: `max-width: 767px` — switches layouts to single-column, adjusts padding from `100px` to `20px`
### Design Language
- **Brutalist aesthetic**: zero border-radius (`border-radius: 0px !important` in global reset), no box-shadows, no text-shadows.
- **Grain overlay**: an SVG `feTurbulence` filter at `opacity: 0.04` fixed-positioned over the entire page (`z-index: 9999`, pointer-events none). Always present — do not remove.
- **Full-bleed sections**: all Shopify wrappers forced to `width: 100%; max-width: 100%; padding: 0; margin: 0` via `!important` in `src/index.css`.
- **Text selection color**: accent yellow (`#F6C917`) background with `var(--fg)` text.
- **Scrollbar**: styled with `--bg` track, `--surface-2` thumb, accent yellow on hover.
- **All UI text is uppercase** for display and technical contexts. Body copy is sentence case.
- **Accent yellow as interaction signal**: hover states on links, nav buttons, and menu items all resolve to `var(--accent)` / `#F6C917`.
- **Animation easing**: `cubic-bezier(0.16, 1, 0.3, 1)` for slide-in transitions (nav, menu overlay). Hover transitions at `150–200ms ease`.
## Liquid / Section Authoring Style
### File Naming
- Sections: `kebab-case.liquid` in `sections/` — e.g., `hero-canvas.liquid`, `product-detail.liquid`
- Layout: `theme.liquid` in `layout/`
- Assets: `kebab-case` with descriptive suffix — e.g., `pitwall-style.css.liquid`, `pitwall-interactive.js`
- CSS assets use `.css.liquid` extension when Liquid output tags (`{{ ... }}`) are needed (e.g., for `asset_url` filters)
### Section Schema Conventions
- `"name"` and preset `"name"` should match (title-case, descriptive).
- Setting IDs use `snake_case`.
- Sections with no merchant-configurable settings use `"settings": []` (see `product-detail.liquid`).
- No blocks used yet — all content is settings-only.
- Schema is always the last thing in the file.
### Liquid Coding Patterns
- JSON payloads use single-quoted attribute values with `| json` filter.
- Strings use double-quoted attribute values with `| escape` filter.
- Asset URLs use `| asset_url` filter.
### Class Naming Conventions
### Tailwind Content Scanning
- `./src/**/*.{js,ts,jsx,tsx}` — React components
- `./sections/**/*.liquid` — Section files
- `./layout/**/*.liquid` — Layout files
- `./templates/**/*.json` — Template JSON
## Naming Patterns
- Liquid sections: `kebab-case.liquid`
- React components: `PascalCase.tsx` in `src/components/`
- CSS assets: `kebab-case.css` or `kebab-case.css.liquid`
- JS assets: `kebab-case.js`
- React components: PascalCase exports (`Display`, `Body`, `Technical`, `Navbar`, `Footer`)
- Props interfaces: PascalCase + `Props` suffix (`DisplayProps`, `BodyProps`)
- Liquid: `snake_case` for assign variables and schema IDs
- TypeScript: camelCase
- Global Liquid styles: `kebab-case` with BEM structure
- React component styles: `pw-kebab-case` prefix
- Tailwind utilities: standard Tailwind naming
## Import Organization (TSX)
## Module Design
- Each React component is a named export (not default) from its file: `export function Display(...)`
- `src/main.tsx` is the Vite entry point that mounts all React islands
- Compiled output: `assets/pitwall-interactive.js` (JS) and `assets/main.css` (Tailwind CSS)
- Global styles: `assets/pitwall-style.css.liquid` loaded first, then `assets/main.css`
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## System Overview
```text
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
- `layout/theme.liquid` is the single HTML document frame — nav and footer live here as static Liquid, not in sections
- Templates are JSON files that declare which sections render inside `{{ content_for_layout }}`
- Sections are self-contained Liquid files with an inline `{% schema %}` block defining Shopify theme editor settings
- React components are mounted as islands by `src/main.tsx` on `DOMContentLoaded`; Liquid passes data to React via `data-*` HTML attributes on mount-point `<div>` elements
- No snippets directory exists yet — all reusable markup is inlined in sections or `theme.liquid`
## Layers
- Purpose: Single persistent HTML document frame
- Location: `layout/theme.liquid`
- Contains: `<head>`, asset tags, global grain overlay, `<header>` nav, `{{ content_for_layout }}`, `<footer>`, global JS bundle tag
- Depends on: `assets/pitwall-style.css.liquid`, `assets/main.css`, `assets/pitwall-interactive.js`
- Used by: Every page in the store
- Purpose: Route each URL template type to an ordered list of sections
- Location: `templates/*.json`
- Contains: JSON `{ "sections": { ... }, "order": [...] }` — no Liquid logic
- Depends on: Section names referenced by `"type"` key matching `sections/<type>.liquid`
- Used by: Shopify routing engine
- Purpose: Page content blocks; each file is an independently configurable unit
- Location: `sections/*.liquid`
- Contains: HTML/Liquid markup + inline `{% schema %}` JSON
- Depends on: Shopify object model (`product`, `collections`, `section.settings`), React mount point IDs, asset URLs
- Used by: Template JSON files
- Purpose: Interactive UI components (Three.js 3D, React state, video, nav JS)
- Location: `src/` (source) → `assets/` (output)
- Contains: TypeScript React components in `src/components/`, CSS entry in `src/index.css`, entry point `src/main.tsx`
- Depends on: React 18, Three.js, Motion, Lucide React, Tailwind CSS
- Used by: `layout/theme.liquid` via `{{ 'pitwall-interactive.js' | asset_url | script_tag }}`
## Data Flow
### Homepage Request
### Product Page Request
- React component-local `useState` only; no shared store
- Cross-component communication via `window.dispatchEvent(new CustomEvent('pitwall:mute', ...))` for mute state
- Cart count displayed via `#cart-counter-display` span in `theme.liquid` header — currently initialized to `0`, no live Shopify Ajax Cart API wiring yet
## Key Abstractions
- Purpose: DOM nodes placed by Liquid sections that act as React roots
- IDs: `#car-canvas-root`, `#hero-video-root`, `#mute-button-root`, `#product-scrollytelling-root`
- Pattern: Liquid writes asset URLs and product data into `data-*` attributes; `src/main.tsx` reads them with `getAttribute()`
- Purpose: Defines Shopify theme editor controls for each section
- Pattern: Inline `{% schema %}` JSON block at bottom of every `.liquid` file in `sections/`
- Examples: `sections/hero-canvas.liquid` exposes `title_text`, `video_1–3`; `sections/product-detail.liquid` has empty settings array
## Entry Points
- Location: `layout/theme.liquid`
- Triggers: Every page request
- Responsibilities: Renders `<head>` with asset links, global nav header (MENU button, PITWALL logo, CART button), grain overlay, `{{ content_for_layout }}` slot, footer, loads `pitwall-interactive.js`
- Location: `src/main.tsx` → `assets/pitwall-interactive.js`
- Triggers: `DOMContentLoaded`
- Responsibilities: Mounts all React islands, wires nav menu open/close hover logic, scroll-show nav, mute toggle event bus
## Header Navigation — How It Is Wired
```
```
- `.nav-header > .nav-grid` — CSS grid row with 3 cells
- `#full-menu-overlay` — full-screen takeover div with class `menu-overlay`; activated by `.is-active` CSS class
- `mouseenter` on `#menu-trigger-btn` → calls `openMenu()` (adds `.is-active`)
- `mouseleave` → `delayClose()` (150ms debounce)
- `mouseenter` on `.menu-content` → `keepOpen()` cancels close timer
- `click` on trigger → toggles open/close
- Scroll > 40% viewport height → adds `.nav-visible` to `.nav-header`
## Architectural Constraints
- **No snippets directory:** No `snippets/` folder exists. Reusable Liquid partials would need to be created if shared markup is required.
- **Static nav links:** Menu links in `layout/theme.liquid` are hardcoded HTML. Adding a nav item requires editing `theme.liquid` directly, not the Shopify admin menus.
- **Single JS bundle:** All React components compile into one `assets/pitwall-interactive.js`. Any new interactive component must be registered in `src/main.tsx`.
- **`emptyOutDir: false`:** Vite does not clean `assets/` on build. Manual assets (fonts, videos, GLB models, `pitwall-style.css.liquid`) are preserved but stale build artefacts accumulate.
- **CSS split:** Brutalist design tokens live in `assets/pitwall-style.css.liquid` (Liquid file, served as CSS); Tailwind utilities live in `assets/main.css` (Vite output). Both are loaded unconditionally on every page.
## Anti-Patterns
### Inline onclick handlers on nav/footer buttons
### Hardcoded nav links
## Error Handling
- `try/catch` around video playlist JSON parse in `src/main.tsx` (lines 86–96) — falls back to hardcoded video paths
- Liquid `{% else %}` blocks in `hero-canvas.liquid` provide static mock product cards when `collections.all` is empty
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
