# External Integrations

**Analysis Date:** 2026-05-30

## Shopify Platform Integration

**Theme Structure:**
- Theme name: "Pitwall Storefront Theme" v1.0.0 (author: Antigravity)
- Defined in `config/settings_schema.json`
- Theme info block only — no custom theme settings beyond metadata

**Liquid Template System:**
- Layout: `layout/theme.liquid` — root HTML shell, loads all assets, renders `{{ content_for_layout }}`
- Sections: `sections/hero-canvas.liquid`, `sections/product-detail.liquid`
- Templates: `templates/index.json`, `templates/product.json` — JSON templates referencing sections
- Locales: `locales/en.default.json`

**Shopify Liquid Objects Used:**
- `request.locale.iso_code` — locale-aware HTML lang attribute
- `canonical_url` — SEO canonical link
- `page_title`, `page_description`, `current_tags`, `current_page`, `shop.name` — page metadata
- `content_for_header` — Shopify head injection hook
- `content_for_layout` — section rendering mount point
- `collections.all.products limit: 4` — product grid in hero section
- `product.url`, `product.featured_image`, `product.title`, `product.type`, `product.price` — product card data
- `product.price | money` — Shopify money filter
- `product.featured_image | image_url: width: 800` — Shopify image CDN transform

**Section Schema Settings (hero-canvas.liquid):**
- `title_text` — Hero headline text
- `video_1`, `video_2`, `video_3` — Custom video playlist URLs (mp4), fall back to `asset_url` defaults

**Asset Loading Pattern:**
- CSS: `{{ 'filename.css' | asset_url | stylesheet_tag }}`
- JS: `{{ 'filename.js' | asset_url | script_tag }}`
- All assets served from Shopify CDN via `asset_url` filter

## React Island Bridge (Shopify ↔ React)

**Pattern:** Liquid renders DOM mount points with `data-*` attributes; React bootstraps into them on `DOMContentLoaded`.

**Mount points in `src/main.tsx`:**

| DOM ID | React Component | Data passed via attributes |
|---|---|---|
| `#car-canvas-root` | `CarCanvas` | `data-model-name`, `data-model-url` |
| `#product-scrollytelling-root` | `ProductScrollytelling` | `data-product-title`, `data-product-handle`, `data-product-price`, `data-product-variants-json`, `data-mclaren-url`, `data-redbull-url`, `data-ferrari-url`, `data-mercedes-url` |
| `#hero-video-root` | `VideoBackground` | `data-video-playlist` (JSON array string) |
| `#mute-button-root` | `UniversalMuteButton` | none |

**Custom Events (Liquid → React → DOM):**
- `pitwall:mute` — custom event dispatched on `window` from mute button; VideoBackground listens for it

## 3D Model Assets (Local CDN via Shopify)

**Format:** GLTF Binary (`.glb`)

**Files in `assets/`:**
- `assets/mclaren.glb`
- `assets/redbull.glb`
- `assets/ferrari.glb`
- `assets/mercedes.glb`

**Loader:** `GLTFLoader` from `three/examples/jsm/loaders/GLTFLoader.js`
**Loading:** URLs passed from Liquid via `asset_url` → `data-*` attributes → React props → `GLTFLoader.load(url)`

## Video Assets (Local CDN via Shopify)

**Format:** MP4, served from `assets/` via Shopify CDN

**Files:**
- `assets/F1_helmet_orbiting_white_void_202605251628.mp4`
- `assets/F1_helmet_orbiting_white_void_202605251636.mp4`
- `assets/Formula_1_car_accelerates_white_202605251629.mp4`
- `assets/Formula_1_car_passing_camera_202605251628.mp4`
- `assets/Orange_F1_car_drifts_white_202605251629.mp4`
- `assets/Red_F1_car_burnout_on_202605251629.mp4`

**Audio:**
- `assets/loading.mp3`
- `assets/Formula One F1 - Sound Effect  ProSounds.mp3`

## Fonts

**Self-hosted (Shopify asset CDN):**
- `assets/btseps2.ttf` — Custom display font (likely the "PITWALL" logotype)
- `assets/PetitFormalScript-Regular.ttf` — Script accent font

**Google Fonts (implied by Tailwind config):**
- Syne — mapped to `font-display` / `var(--font-display)`
- Barlow — mapped to `font-body` / `var(--font-body)`
- IBM Plex Mono — mapped to `font-mono` / `var(--font-mono)`
- Not detected as explicit `<link>` imports in `layout/theme.liquid` — likely loaded via CSS `@import` in `assets/pitwall-style.css.liquid`

## Shopify CLI / Deploy Flow

**Not detected in package.json** — Shopify CLI is assumed to be globally installed.

**Standard Shopify theme deploy commands (not in scripts):**
```bash
shopify theme push          # Upload assets/ + Liquid files to Shopify
shopify theme dev           # Live preview with hot asset sync
```

**Expected workflow:**
1. `npm run build` — compiles `src/` → `assets/pitwall-interactive.js` + `assets/main.css`
2. `shopify theme push` — uploads entire theme including compiled assets to Shopify store

**`.shopifyignore`:** Present at root — controls which files are excluded from theme push.

## Authentication & Identity

- No custom auth detected
- Relies entirely on Shopify's native customer accounts system

## External APIs

- None detected — no third-party API calls in source files
- Cart operations use native Shopify URL routing (`/cart`, `/collections/all`)

## Monitoring & Observability

**Error Tracking:** Not detected
**Logs:** Browser console only — no logging service integrated

## Environment Configuration

**Required env vars:** None detected — no `.env` files, no `import.meta.env` usage
**Shopify store credentials:** Managed by Shopify CLI config (outside repo)

---

*Integration audit: 2026-05-30*
