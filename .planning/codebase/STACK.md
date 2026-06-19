# Technology Stack

**Analysis Date:** 2026-06-19

## Languages

**Primary:**
- TypeScript 5.4.5 - All React/Three.js source code under `src/`
- Liquid - Shopify theme templates in `layout/`, `sections/`, `templates/`

**Secondary:**
- CSS / PostCSS - `src/index.css`, `assets/main.css`, `assets/pitwall-style.css.liquid`
- JavaScript (compiled) - `assets/pitwall-interactive.js` (Vite build output)
- JSON - Shopify section schemas, `config/settings_schema.json`, `locales/*.json`, `templates/*.json`

## Runtime

**Environment:**
- Browser (client-side SPA islands mounted into Shopify Liquid pages)
- Node.js (build-time only — Vite, TypeScript compiler)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 18.3.1 - UI components compiled to islands mounted into Liquid DOM nodes
- Three.js 0.184.0 - WebGL 3D rendering for F1 car and helmet model viewers

**Animation:**
- motion 12.40.0 - Animation library (Framer Motion successor) used in React components

**Icons:**
- lucide-react 0.378.0 - Icon components (VolumeX, Volume2, ShoppingBag, Trash, etc.)

**Build/Dev:**
- Vite 5.2.11 - Bundler and dev server; config at `vite.config.ts`
- TypeScript 5.4.5 - Type checking; config at `tsconfig.json`
- @vitejs/plugin-react 4.2.1 - React JSX transform plugin for Vite

**Styling:**
- Tailwind CSS 3.4.3 - Utility classes; config at `tailwind.config.js`
- PostCSS 8.5.15 - CSS processing pipeline; config at `postcss.config.js`
- autoprefixer 10.5.0 - Vendor prefix injection via PostCSS

## Key Dependencies

**Critical:**
- `three` 0.184.0 - Core 3D engine; `GLTFLoader` loads `.glb` car and helmet models from `assets/`
- `react` + `react-dom` 18.3.1 - Component runtime; mounted via `ReactDOM.createRoot` on DOM-ready
- `motion` 12.40.0 - Scroll-driven and entrance animations in homepage and product scrollytelling

**Infrastructure:**
- `@types/three` 0.184.1 - TypeScript definitions for Three.js
- `@types/react` + `@types/react-dom` 18.3.x - TypeScript definitions for React

## Configuration

**TypeScript (`tsconfig.json`):**
- Target: ES2020
- Module resolution: `bundler` (Vite-native)
- JSX: `react-jsx` (automatic runtime)
- Strict mode fully enabled: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`
- Path alias: `@/*` → `./src/*`
- `noEmit: true` — Vite handles emit; `tsc` only type-checks

**Vite (`vite.config.ts`):**
- Single entry: `src/main.tsx`
- Output directory: `assets/` (Shopify theme assets folder)
- `emptyOutDir: false` — preserves manually committed assets (fonts, videos, CSS, GLB models)
- Fixed output filename: `pitwall-interactive.js` (no content hash)
- Asset filenames: `[name].[ext]` (no hashing)
- Path alias `@` → `./src`

**Tailwind (`tailwind.config.js`):**
- Content scan: `src/**/*.{js,ts,jsx,tsx}`, `sections/**/*.liquid`, `layout/**/*.liquid`, `templates/**/*.json`
- Custom color tokens: `background`, `foreground`, `brand.red` (Racing Yellow `#F6C917`), `brand.black`, `brand.white`, `surface`
- Custom font families: `display` (Syne), `body` (Barlow/Inter), `mono` (IBM Plex Mono) — resolved via CSS custom properties `var(--font-display)` etc.

**PostCSS (`postcss.config.js`):**
- Plugins: `tailwindcss`, `autoprefixer`

## Build Pipeline

```
src/main.tsx  (TypeScript + React + Three.js)
      │
      ▼
tsc  (type-check only, noEmit)
      │
      ▼
vite build
      │
      ├── assets/pitwall-interactive.js  (single JS bundle)
      └── assets/main.css               (compiled Tailwind output)

Shopify theme layout/theme.liquid loads:
  {{ 'pitwall-style.css' | asset_url | stylesheet_tag }}   ← manual brutalist CSS
  {{ 'main.css' | asset_url | stylesheet_tag }}            ← Tailwind build output
  {{ 'pitwall-interactive.js' | asset_url | script_tag }}  ← Vite bundle
```

**Build commands:**
```bash
npm run dev      # vite dev server (watches for changes)
npm run build    # tsc && vite build → outputs to assets/
npm run preview  # vite preview
```

## Platform Requirements

**Development:**
- Node.js with npm
- Shopify CLI for theme push/serve (assumed global install)

**Production:**
- Shopify Online Store platform (assets served from Shopify CDN)

---

*Stack analysis: 2026-06-19*
