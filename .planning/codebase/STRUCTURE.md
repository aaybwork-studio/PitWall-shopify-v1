# Codebase Structure

**Analysis Date:** 2026-05-30

## Directory Layout

```
pitwall-shopify-theme/
├── assets/                  # Shopify theme asset serving root — static + compiled files
│   ├── pitwall-interactive.js   # Vite output: bundled React + Three.js
│   ├── main.css                 # Vite output: compiled Tailwind CSS
│   ├── pitwall-style.css.liquid # Manually maintained brutalist design system CSS
│   ├── *.glb                    # 3D car models (ferrari, mclaren, mercedes, redbull)
│   ├── *.mp4                    # F1 video assets for hero playlist
│   ├── *.ttf                    # Custom fonts (PetitFormalScript, btseps2)
│   ├── logo_new.png             # Brand logo
│   └── *.mp3                    # Sound effects
├── config/
│   └── settings_schema.json     # Shopify theme editor global settings schema
├── layout/
│   └── theme.liquid             # THE single HTML frame: head, nav, footer, asset tags
├── locales/                     # i18n translation JSON files (Shopify standard)
├── sections/                    # Liquid section files — one per content block type
│   ├── hero-canvas.liquid       # Home page: video hero, product grid, manifesto, about strip
│   └── product-detail.liquid    # Product page: React PDP mount point with data-* bridge
├── src/                         # TypeScript/React source — compiled by Vite, NOT served directly
│   ├── main.tsx                 # JS entry point: mounts all React islands + nav JS
│   ├── index.css                # CSS entry point: Tailwind directives + CSS custom properties
│   └── components/
│       ├── CarCanvas.tsx            # Three.js GLB model viewer
│       ├── FeaturedCarousel.tsx     # Product carousel (unused mount point as of 2026-05-30)
│       ├── Footer.tsx               # React footer component (unused mount as of 2026-05-30)
│       ├── Navbar.tsx               # React navbar component (unused mount as of 2026-05-30)
│       ├── ProductScrollytelling.tsx # Full immersive PDP: 3D, variants, add-to-cart
│       ├── TechSpecTable.tsx        # Spec table sub-component
│       ├── Typography.tsx           # Shared text style component
│       └── VideoBackground.tsx      # Autoplay video playlist with mute event listener
├── templates/                   # JSON page templates — declare section order per URL type
│   ├── index.json               # Home page → hero-canvas section
│   └── product.json             # Product page → product-detail section
├── vite.config.ts               # Build config: input src/main.tsx → assets/pitwall-interactive.js
├── tailwind.config.js           # Tailwind content glob + theme extension
├── postcss.config.js            # PostCSS config for Tailwind pipeline
├── tsconfig.json                # TypeScript config; path alias @ → src/
└── package.json                 # npm scripts: dev / build / preview
```

## Directory Purposes

**`assets/`:**
- Purpose: Everything Shopify serves as a CDN asset
- Contains: Vite build output, hand-maintained CSS, 3D models, videos, fonts, images
- Key files: `pitwall-interactive.js` (React bundle), `main.css` (Tailwind), `pitwall-style.css.liquid` (design system)
- Note: Do NOT place Liquid logic in this directory except in `.liquid` suffixed files (e.g. `pitwall-style.css.liquid`)

**`layout/`:**
- Purpose: Persistent HTML shell wrapping every page
- Contains: Only `theme.liquid` — do not add more layout files unless building an alternate layout (e.g. `layout/password.liquid`)

**`sections/`:**
- Purpose: Modular, independently-configurable page content blocks
- Contains: One `.liquid` file per section type; each ends with `{% schema %}` JSON
- Key files: `hero-canvas.liquid`, `product-detail.liquid`

**`templates/`:**
- Purpose: Route URL template types to ordered section lists
- Contains: JSON files — naming convention: `<template-type>.json` or `<template-type>.<alternate>.json`
- Key files: `index.json`, `product.json`

**`src/`:**
- Purpose: TypeScript/React source — compiled by Vite, never served directly by Shopify
- Contains: `main.tsx` entry, `index.css` CSS entry, `components/` directory
- Key files: `src/main.tsx` (registers all React mount points), `src/index.css` (Tailwind + CSS vars)

**`config/`:**
- Purpose: Shopify theme editor global settings
- Contains: `settings_schema.json` — defines color schemes, typography, social links visible in Shopify Customizer

## Key File Locations

**Entry Points:**
- `layout/theme.liquid`: HTML document root — every page passes through here
- `src/main.tsx`: JS/React entry — mounts all interactive islands on `DOMContentLoaded`
- `src/index.css`: CSS entry — Tailwind directives + CSS custom properties

**Configuration:**
- `vite.config.ts`: Vite build config — input/output paths, React plugin
- `tailwind.config.js`: Tailwind content paths + theme tokens
- `tsconfig.json`: TypeScript — includes path alias `@` → `src/`
- `config/settings_schema.json`: Shopify theme editor global settings

**Core Sections:**
- `sections/hero-canvas.liquid`: Home page content + schema
- `sections/product-detail.liquid`: Product PDP data bridge + schema

**Templates:**
- `templates/index.json`: Home page section order
- `templates/product.json`: Product page section order

**Build Outputs (do not edit manually):**
- `assets/pitwall-interactive.js`: Compiled React/Three.js bundle
- `assets/main.css`: Compiled Tailwind CSS

## Naming Conventions

**Section files:**
- `kebab-case.liquid` — matches the `"type"` key used in template JSON
- Example: `sections/hero-canvas.liquid` ↔ `"type": "hero-canvas"` in `templates/index.json`

**Template files:**
- `<template-type>.json` for default template
- `<template-type>.<alternate-name>.json` for alternate templates
- Example: `templates/page.about.json` would be the alternate `about` template for page objects

**React components:**
- `PascalCase.tsx` in `src/components/`
- Example: `CarCanvas.tsx`, `VideoBackground.tsx`

**Assets:**
- Static assets: any filename with extension — served as-is
- Liquid assets: `name.css.liquid` or `name.js.liquid` — Shopify processes Liquid tags before serving

**CSS classes:**
- BEM-style with `pitwall-` prefix for global primitives (e.g. `pitwall-grain-container`)
- Component-scoped names for section-specific elements (e.g. `nav-header`, `hero-section`, `footer-section`)

## Where to Add New Code

**New custom page template (e.g. an About page):**

1. Create section: `sections/page-about.liquid`
   - Add HTML/Liquid content
   - Add `{% schema %}` block at the bottom with `"name"` and `"settings"` array
2. Create template: `templates/page.about.json`
   ```json
   {
     "sections": {
       "main": {
         "type": "page-about",
         "settings": {}
       }
     },
     "order": ["main"]
   }
   ```
3. In Shopify admin, assign the page object to use the `about` alternate template
4. The page will render at `/pages/about` using that template

**New React interactive component on a section:**

1. Create `src/components/MyWidget.tsx`
2. In the target section `.liquid` file, add a mount point div:
   ```html
   <div id="my-widget-root" data-some-value="{{ section.settings.some_value }}"></div>
   ```
3. In `src/main.tsx`, inside the `DOMContentLoaded` listener, add:
   ```typescript
   const widgetRoot = document.getElementById('my-widget-root');
   if (widgetRoot) {
     const root = ReactDOM.createRoot(widgetRoot);
     root.render(<MyWidget value={widgetRoot.getAttribute('data-some-value') || ''} />);
   }
   ```
4. Run `npm run build` to compile → `assets/pitwall-interactive.js`

**New utility/shared TypeScript module:**
- Location: `src/` (flat) for standalone utilities
- Import with alias: `import { fn } from '@/utils'`

**New static asset (video, font, model):**
- Drop file directly into `assets/`
- Reference in Liquid: `{{ 'filename.ext' | asset_url }}`

## Special Directories

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes
- Committed: No (gitignored)

**`.planning/`:**
- Purpose: GSD planning documents for AI-assisted development
- Generated: By GSD tooling
- Committed: Yes

**`locales/`:**
- Purpose: Shopify i18n translation strings
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-05-30*
