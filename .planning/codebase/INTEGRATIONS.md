# External Integrations

**Analysis Date:** 2026-06-19

## Shopify Platform Integration

**Theme Structure:**
- Theme name: "Pitwall Storefront Theme" v1.0.0 (author: Antigravity)
- Defined in `config/settings_schema.json`
- Supports custom merchant settings in theme schema editors (e.g. for homepage scrollytelling properties, manifesto images, video playlists).

**Liquid Template System:**
- Layout: `layout/theme.liquid` — root HTML shell, loads all assets, renders `{{ content_for_layout }}`, registers navigation header & mobile accordions, and manages global scripts
- Sections: `sections/hero-canvas.liquid`, `sections/product-detail.liquid`, `sections/collection-all.liquid`, `sections/page-about.liquid`, `sections/page-contact.liquid`, `sections/main-404.liquid`
- Templates: JSON templates (e.g. `templates/index.json`, `templates/product.json`, `templates/collection.json`, `templates/page.about.json`, `templates/page.contact.json`, `templates/404.json`)
- Locales: `locales/en.default.json` and others

**Shopify Liquid Objects Used:**
- `request.locale.iso_code` — locale-aware HTML lang attribute
- `canonical_url` — SEO canonical link
- `page_title`, `page_description`, `current_tags`, `current_page`, `shop.name` — page metadata
- `content_for_header` — Shopify head injection hook
- `content_for_layout` — section rendering mount point
- `collections.all.products` — product loop lists
- `product.url`, `product.featured_image`, `product.title`, `product.type`, `product.price`, `product.variants` — product and variant card data
- `product.price | money` — Shopify money filter
- `product.featured_image | image_url` — Shopify image CDN transforms
- `section.settings.*` — Custom schema settings for title text, description paragraphs, taglines, layout variables, and image selections.

**React Island Bridge (Shopify ↔ React)**

**Pattern:** Liquid renders DOM mount points with `data-*` attributes; React bootstraps into them on page load.

**Mount points in `src/main.tsx`:**

| DOM ID | React Component | Data passed via attributes |
|---|---|---|
| `#homepage-interactive-root` | `HomepageScrollytelling` | `data-products-json`, `data-video-playlist`, `data-about-heading`, `data-cta-label`, `data-cta-url`, `data-stat-1-value`, `data-stat-1-label`, `data-stat-2-value`, `data-stat-2-label`, `data-stat-3-value`, `data-stat-3-label`, `data-explore-cta`, `data-manifesto-image-1/2/3`, `data-manifesto-tagline-1/2/3`, and inline JSON script blocks (`#collection-products-data`, `#fallback-images-data`, `#about-content-data`) |
| `#car-canvas-root` | `CarCanvas` | `data-model-name`, `data-model-url` |
| `#product-scrollytelling-root` | `ProductScrollytelling` | `data-product-title`, `data-product-handle`, `data-product-price`, `data-product-variants-json`, `data-mclaren-url`, `data-redbull-url`, `data-ferrari-url`, `data-mercedes-url`, `data-norris-helmet-url`, `data-schumacher-helmet-url`, `data-verstappen-helmet-url` |
| `#hero-video-root` | `VideoBackground` | `data-video-playlist` (JSON array string) |
| `#separator-video-root` | `VideoBackground` | `data-video-playlist` (JSON array string) |
| `#collection-grid-root` | `CollectionGrid` | `data-video-url` and inline JSON script block (`#collection-products-data`) |

**Custom Events & Event Bus:**
- `pitwall:mute` — custom event dispatched on `window` from the mute button; `VideoBackground` and other players listen for it.
- **AJAX Cart Actions:** Header includes a dynamic quick-view cart dropdown on desktop hover that synchronizes with Shopify's Ajax Cart API (`/cart/add.js`, `/cart/change.js`, `/cart.js`) for real-time additions, removals, and subtotal refreshes.

## 3D Model Assets (Local CDN via Shopify)

**Format:** GLTF Binary (`.glb`)

**Files in `assets/`:**
- `assets/mclaren.glb`
- `assets/redbull.glb`
- `assets/ferrari.glb`
- `assets/mercedes.glb`
- `assets/f1_helmet_lando_norris.glb`
- `assets/michael_schumacher_2002_helmet.glb`
- `assets/helmet_redbull_max_verstappen.glb`

**Loader:** `GLTFLoader` from `three/examples/jsm/loaders/GLTFLoader.js`
**Loading:** URLs passed from Liquid via `asset_url` → `data-*` attributes → React props → `GLTFLoader.load(url)`

## Video Assets (Local CDN via Shopify)

**Format:** MP4, served from `assets/` via Shopify CDN

**Files:**
- `assets/F1_car_idling_on_background_202606011707.mp4`
- `assets/F1_car_overtakes_camera_overhead_202606011707.mp4`
- `assets/F1_car_slides_on_surface_202606011707.mp4`
- `assets/Formula_1_car_approaches_camera_202606011705.mp4`
- `assets/Formula_1_car_braking_and_202606011705.mp4`
- `assets/Formula_1_cars_braking_fast_202605301840.mp4`
- `assets/Formula_1_cars_racing_wheel-to-wheel_202606011705.mp4`

**Audio:**
- `assets/loading.mp3`
- `assets/f1-sound-effect.mp3`

## Fonts

**Self-hosted (Shopify asset CDN):**
- `assets/btseps2.ttf` — Custom display font (Branding: BTSE PS2 logotype)
- `assets/PetitFormalScript-Regular.ttf` — Script accent font

**Google Fonts (loaded via CSS import):**
- Syne — mapped to `font-display` / `var(--font-display)`
- Inter — mapped to `font-body` / `var(--font-body)` (replaces Barlow)
- IBM Plex Mono — mapped to `font-mono` / `var(--font-mono)`
- Space Grotesk, Cormorant Garamond, Alex Brush, Dancing Script

## Shopify CLI / Deploy Flow

**Standard Shopify theme deploy commands:**
```bash
npm run build                    # Compiles TSX/CSS → assets/
npx shopify theme dev            # Starts local dev server linking to Shopify sandbox
npx shopify theme push           # Pushes local changes to live Shopify theme
```

---

*Integration audit: 2026-06-19*
