# Coding Conventions

**Analysis Date:** 2026-05-30

---

## Brand / Design Tokens

This section is **critical** for new pages — all UI must use these tokens exactly.

### Color Palette

Defined in `tailwind.config.js` and mirrored as CSS custom properties in `assets/pitwall-style.css.liquid` and `src/index.css`.

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

**Rule:** Never introduce new colors without a CSS var. Never use raw hex values in Liquid or component files — always reference a CSS var or Tailwind token.

### Typography

Defined in `tailwind.config.js` (font families), `src/index.css` (@layer utilities), and `assets/pitwall-style.css.liquid`.

#### Font Families

| Role | Family | Weight(s) | CSS Var | Tailwind Class |
|------|--------|-----------|---------|----------------|
| Display / Headings | Syne | 700, 800 | `var(--font-display)` | `font-display` |
| Body / Prose | Barlow | 300, 400, 600 | `var(--font-body)` | `font-body` |
| Technical / Mono / Labels | IBM Plex Mono | 400, 600 | `var(--font-mono)` | `font-mono` |
| Secondary / Decorative | Petit Formal Script / btseps2 | normal | `var(--font-secondary)` | (CSS var only) |
| Supplementary | Space Grotesk | 700 | — | (loaded via Google Fonts, not in Tailwind) |

All fonts loaded via Google Fonts CDN in `src/index.css` and `assets/pitwall-style.css.liquid`. Local font files `btseps2.ttf` and `PetitFormalScript-Regular.ttf` are in `assets/` and declared via `@font-face`.

#### Type Utility Classes (use these, do not rebuild)

Defined in `src/index.css` `@layer utilities` and `assets/pitwall-style.css.liquid`:

```css
/* Display — large headlines */
.font-display-strict {
  font-family: var(--font-display), sans-serif;
  font-weight: 800;
  letter-spacing: -0.04em;   /* tailwind: tracking-display */
  line-height: 0.88;          /* tailwind: leading-display */
}

/* Body prose */
.font-body-strict {
  font-family: var(--font-body), sans-serif;
  font-weight: 300;
  letter-spacing: 0;
  line-height: 1.65;          /* tailwind: leading-body */
}

/* Technical labels (mono, uppercase) */
.font-technical-strict {
  font-family: var(--font-mono), monospace;
  font-weight: 400;
  letter-spacing: 0.08em;    /* tailwind: tracking-technical */
}

/* Standalone utility class for labels */
.technical-label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.display-title {
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.88;
  text-transform: uppercase;
}
```

#### Tailwind Typography Extensions (`tailwind.config.js`)

```js
letterSpacing: {
  display: "-0.04em",    // class: tracking-display
  technical: "0.08em",   // class: tracking-technical
},
lineHeight: {
  display: "0.88",       // class: leading-display
  body: "1.65",          // class: leading-body
}
```

#### React Typography Components (`src/components/Typography.tsx`)

Three typed components enforce the type system — use these in all React/TSX:

- `<Display as="h1|h2|h3|h4" indented?>` → `font-display-strict uppercase text-brand-black`
- `<Body as="p|span|div" weight="light|regular|semibold">` → `font-body-strict text-brand-black/70`
- `<Technical as="span|div|p" highlight?>` → `font-technical-strict uppercase` (highlight adds `text-[color:var(--team-accent,var(--brand-red,#F6C917))]`)

### Spacing

No custom spacing scale in Tailwind — use Tailwind's default scale. Observed spacing constants in CSS:

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

Tailwind defaults (no overrides in `tailwind.config.js`). One custom media query appears in CSS:

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

---

## Liquid / Section Authoring Style

### File Naming

- Sections: `kebab-case.liquid` in `sections/` — e.g., `hero-canvas.liquid`, `product-detail.liquid`
- Layout: `theme.liquid` in `layout/`
- Assets: `kebab-case` with descriptive suffix — e.g., `pitwall-style.css.liquid`, `pitwall-interactive.js`
- CSS assets use `.css.liquid` extension when Liquid output tags (`{{ ... }}`) are needed (e.g., for `asset_url` filters)

### Section Schema Conventions

Schemas live at the bottom of each `.liquid` file, inside `{% schema %}...{% endschema %}` tags.

Pattern observed across sections:

```liquid
{% schema %}
{
  "name": "Human Readable Section Name",
  "settings": [
    {
      "type": "text",
      "id": "snake_case_id",
      "label": "Label For Merchant",
      "default": "Default Value"
    }
  ],
  "presets": [
    {
      "name": "Human Readable Section Name"
    }
  ]
}
{% endschema %}
```

- `"name"` and preset `"name"` should match (title-case, descriptive).
- Setting IDs use `snake_case`.
- Sections with no merchant-configurable settings use `"settings": []` (see `product-detail.liquid`).
- No blocks used yet — all content is settings-only.
- Schema is always the last thing in the file.

### Liquid Coding Patterns

**Conditional asset fallback** (used in `sections/hero-canvas.liquid`):
```liquid
{%- if section.settings.video_1 != blank -%}
  '{{ section.settings.video_1 }}'
{%- else -%}
  '{{ 'filename.mp4' | asset_url }}'
{%- endif -%}
```

**Product loop with limit**:
```liquid
{% for product in collections.all.products limit: 4 %}
  ...
{% else %}
  <!-- Static fallback markup -->
{% endfor %}
```

**Data attributes for React mount points** — Liquid data is passed to React via `data-*` attributes on the mount div:
```liquid
<div
  id="product-scrollytelling-root"
  data-product-title="{{ product.title | escape }}"
  data-product-variants-json='{{ product.variants | json }}'
  data-logo-url="{{ 'logo_new.png' | asset_url }}"
>
```
- JSON payloads use single-quoted attribute values with `| json` filter.
- Strings use double-quoted attribute values with `| escape` filter.
- Asset URLs use `| asset_url` filter.

**React mount points** are bare `<div id="...">` elements with an inline loading state as fallback content:
```liquid
<div style="background-color: #EDEBE5; display: flex; ... height: 100vh;">
  <span class="technical-label" style="...">PITWALL // PDP ENGINE</span>
</div>
```
Inline styles are used in fallback-only content (not general practice).

**Comments** use HTML `<!-- ... -->` style within Liquid sections.

### Class Naming Conventions

Two CSS class naming systems coexist:

1. **BEM-style component classes** in `assets/pitwall-style.css.liquid` — used in `layout/theme.liquid` and `sections/hero-canvas.liquid`:
   - Block: `.nav-header`, `.menu-overlay`, `.hero-section`, `.footer-section`
   - Element: `.nav-grid`, `.nav-menu-btn`, `.menu-link`, `.footer-nav-link`
   - State modifier: `.is-active`, `.is-visible` (e.g., `.menu-overlay.is-active`, `.pw-nav-header.pw-nav-visible`)

2. **`pw-` prefixed classes** in `src/index.css` — used in React components (`src/components/Navbar.tsx`, `src/components/Footer.tsx`):
   - All React component CSS uses `pw-` prefix: `.pw-nav-header`, `.pw-footer-section`, `.pw-menu-link`
   - This prefix prevents collisions between the React island styles and the global Liquid stylesheet.

3. **Tailwind utility classes** — used exclusively inside React/TSX component files:
   - Custom tokens accessed as: `bg-background`, `text-brand-black`, `text-brand-red`, `font-display`, `font-body`, `font-mono`, `tracking-display`, `leading-display`
   - Opacity modifier: `text-brand-black/70`, `text-brand-black/80`
   - Do NOT use Tailwind utilities in `.liquid` files — use BEM classes instead.

4. **Scroll animation hooks**: `.scroll-reveal`, `.slide-from-left`, `.slide-from-right` applied to sections and elements in Liquid. These are CSS class names that JS targets for intersection-based animation.

### Tailwind Content Scanning

`tailwind.config.js` scans:
- `./src/**/*.{js,ts,jsx,tsx}` — React components
- `./sections/**/*.liquid` — Section files
- `./layout/**/*.liquid` — Layout files
- `./templates/**/*.json` — Template JSON

Tailwind classes used directly in `.liquid` files will be included in the compiled CSS.

---

## Naming Patterns

**Files:**
- Liquid sections: `kebab-case.liquid`
- React components: `PascalCase.tsx` in `src/components/`
- CSS assets: `kebab-case.css` or `kebab-case.css.liquid`
- JS assets: `kebab-case.js`

**Functions / Components:**
- React components: PascalCase exports (`Display`, `Body`, `Technical`, `Navbar`, `Footer`)
- Props interfaces: PascalCase + `Props` suffix (`DisplayProps`, `BodyProps`)

**Variables:**
- Liquid: `snake_case` for assign variables and schema IDs
- TypeScript: camelCase

**CSS Classes:**
- Global Liquid styles: `kebab-case` with BEM structure
- React component styles: `pw-kebab-case` prefix
- Tailwind utilities: standard Tailwind naming

---

## Import Organization (TSX)

```tsx
import React from "react";
// External packages
// Internal components
// Types/interfaces
```

---

## Module Design

- Each React component is a named export (not default) from its file: `export function Display(...)`
- `src/main.tsx` is the Vite entry point that mounts all React islands
- Compiled output: `assets/pitwall-interactive.js` (JS) and `assets/main.css` (Tailwind CSS)
- Global styles: `assets/pitwall-style.css.liquid` loaded first, then `assets/main.css`

---

*Convention analysis: 2026-05-30*
