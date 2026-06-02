# Phase 3: Helmets PDP & Dynamic Routing - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Integrate two newly added F1 Helmet WebGL models (`f1_helmet_lando_norris.glb` and `michael_schumacher_2002_helmet.glb`) into a dedicated Helmet Product Page matching the features and scrollytelling capabilities of the Car Models page. Enhance navigation so that clicking model switcher buttons updates the WebGL canvas instantly without reload, while updating the browser's URL handle using the HTML5 History API. Update the All Products page to list all products separately.

In addition, implement global visual and UI improvements to the storefront: adjust background video playback speed to 0.75x, implement double-buffered video transitions with smooth cross-fading, reduce hero section overlay opacity, resolve font import ordering in CSS, integrate logo assets in the header and footer, and restructure the takeover menu layout to match the Good Fella reference design.

</domain>

<decisions>
## Implementation Decisions

### Video Playback & Transition Optimization
- **D-01 (Play Rate Slowdown):** Set cinematic background video playback rate to `0.75x` (`vid.playbackRate = 0.75`) in `VideoBackground.tsx` to enhance immersion.
- **D-02 (Double-Buffered Cross-Fade):** Refactor `VideoBackground.tsx` to mount two `<video>` elements acting as a double buffer. Transitioning between playlist videos will fade out the current active video (opacity 1 -> 0) while fading in the next ready video (opacity 0 -> 1) over a `800ms` transition window, removing jagged loading jumps.

### Visual Styling & Visibility
- **D-03 (Hero Overlay Shading):** Reduce the dark screen overlay opacity on the hero section from `0.45` to `0.15` (`rgba(12, 12, 12, 0.15)`) in `assets/pitwall-style.css.liquid` to improve visibility of the background video.
- **D-04 (CSS Font Import Rule):** Move the Google Fonts `@import` declaration to the absolute top of `assets/pitwall-style.css.liquid`, preceding `@font-face` blocks. This ensures the browser parses and loads all brand font families (Syne, Barlow, IBM Plex Mono, Space Grotesk) correctly.

### Logo & Brand Assets
- **D-05 (Navbar Emblem):** Copy the `Emblem.jpg` logo file from the `/Logos` directory into the theme's assets. Display the Emblem image centered in the Navbar at `28px` height, replacing the simple text span.
- **D-06 (Footer Wordmark):** Copy the `Wordmark-footer.jpg` logo file into the theme's assets. Display this Wordmark centered in the footer section, replacing the ghost text "PITWALL" to match the reference layout.

### Takeover Menu Layout (Image 2)
- **D-07 (Navigation Menu Stack):** Add the missing COLLECTIONS (`/collections`) and CONTACT (`#footer` or `/pages/contact`) links to the menu overlay navigation.
- **D-08 (Active Item Bullets):** Implement a solid square bullet indicator (`pw-menu-bullet-svg`) in Racing Yellow (`#F6C917`) next to the active menu link.
- **D-09 (Dual Image Panels):** Update the right-side images column to show two stacked panels ("ABOUT THE BRAND" and "LATEST DROP") with structured caption lines.
- **D-10 (Status Telemetry):** Display technical monospace status lines at the bottom-center of the takeover overlay: `[ STATUS: ONLINE ] · [ NEXT DROP: UPCOMING ] · [ EDITION: 01/100 ]`.

### Navigation & Dynamic URL Routing
- **D-11 (Zero-Lag History API):** Swapping between models in the switcher row uses the HTML5 History API (`window.history.pushState`) to update the active model, details, specs, and price instantly without reloading the page.
- **D-12 (Browser URL Sync):** As the user switches, the browser address bar syncs cleanly to the new product route (e.g. `/products/redbull-rb19` when active). Direct URL hits will serve the corresponding template.
- **D-13 (Contextual Switcher Scopes):** 
  - Cars PDP: Swaps between `MCLAREN-MCL39`, `REDBULL-RB19`, `FERRARI-SF23`, `MERCEDES-W14`.
  - Helmets PDP: Swaps between `LANDO-NORRIS-HELMET`, `SCHUMACHER-HELMET`.

### Helmet Collectible Models
- **D-14 (Asset Mappings):** Load the copied helmet models from theme assets:
  - Lando Norris Helmet: `f1_helmet_lando_norris.glb`
  - Michael Schumacher Helmet: `michael_schumacher_2002_helmet.glb`
- **D-15 (Chassis Engine Compatibility):** Re-use the existing Three.js GLTFLoader canvas (`CarCanvas.tsx`), modifying it dynamically to adjust model scale, position, and lighting parameters for helmets (which occupy a more vertical/spherical volume than long F1 cars).

### Technical Telemetry & Specifications
- **D-16 (Helmet Spec Sheets):** The scrollytelling specs panel for helmets displays:
  - Lando Norris Helmet: Reference `PW-LN-F1`, shell: Autoclaved Pre-preg Carbon Fiber, visor: Vacuum Metallized Dual Anti-fog Lens, accent: `#FF8000`.
  - Michael Schumacher 2002 Helmet: Reference `PW-MS-2002`, shell: Autoclaved Pre-preg Carbon Fiber, visor: Autographed Classic Red, accent: `#E10600`.
- **D-17 (Helmet Sizes & Scales):**
  - 1:2 Scale (Half Scale): Dimensions `130mm x 165mm x 125mm`, Weight `480g`, Price `₹7,999`.
  - 1:1 Scale (Full Scale): Dimensions `260mm x 330mm x 250mm`, Weight `1,600g`, Price `₹45,999`.

### Catalog Grid Updates (All Products)
- **D-18 (Individual Catalog Cards):** Update `sections/collection-all.liquid` (and standard fallbacks) to render every single car model and helmet model separately in the staggered grid rather than grouping them, linking directly to their dedicated URL endpoints.

### the agent's Discretion
- Sizing and scaling coordinates for 3D model positioning of helmets inside `CarCanvas.tsx`.
- Visual cross-fade timing (800ms) and overlay opacity levels to fit the editorial F1 vibe.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Source Code Context
- [layout/theme.liquid](file:///Users/kura/Antigravity%20Projects/pitwall-shopify-theme/layout/theme.liquid) — Global template frame containing header navbar, logo markup, takeover overlay structure, and footer.
- [assets/pitwall-style.css.liquid](file:///Users/kura/Antigravity%20Projects/pitwall-shopify-theme/assets/pitwall-style.css.liquid) — Custom brutalist style sheet for design tokens, typography, overlay classes, and animations.
- [src/components/VideoBackground.tsx](file:///Users/kura/Antigravity%20Projects/pitwall-shopify-theme/src/components/VideoBackground.tsx) — Playlist-based video background element.
- [src/components/ProductScrollytelling.tsx](file:///Users/kura/Antigravity%20Projects/pitwall-shopify-theme/src/components/ProductScrollytelling.tsx) — Collectible layout containing the variants schema, specifications, scales, and buy flows.
- [src/components/CarCanvas.tsx](file:///Users/kura/Antigravity%20Projects/pitwall-shopify-theme/src/components/CarCanvas.tsx) — Three.js engine and lighting setup that needs helmet support.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CarCanvas.tsx` — Exposes camera controls, basic loaders, and model renders. Can load both helmets and cars based on product name filters.
- `sections/product-detail.liquid` — Shopify detail page that passes dynamic variants down as mount data attributes.

### Established Patterns
- Using `data-ferrari-url` and `data-mclaren-url` properties. We should add `data-norris-helmet-url` and `data-schumacher-helmet-url` attributes to the Liquid section mount-point.

</code_context>

<specifics>
## Specific Ideas
- In `ProductScrollytelling.tsx`, detect if the current product handle represents a helmet (`productHandle.includes('helmet')`) to switch layout context.
- When switcher buttons are clicked, update state *and* run:
  `window.history.pushState(null, '', '/products/' + targetHandle);`
- Update the marquee text in `sections/hero-canvas.liquid` from `"FOR THE ONES WHO NOTICE"` to `"XYZ"` as requested by the user.

</specifics>

<deferred>
## Deferred Ideas
- SKU finalization.
- Site content copywriting and SEO optimization.
- Standard placeholder text replacement.

</deferred>

---

*Phase: 3-Helmets PDP & Dynamic Routing*
*Context gathered: 2026-06-03*
