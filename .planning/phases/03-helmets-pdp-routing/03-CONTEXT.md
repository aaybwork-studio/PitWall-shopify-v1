# Phase 3: Helmets PDP & Dynamic Routing - Context

**Gathered:** 2026-05-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Integrate two newly added F1 Helmet WebGL models (`f1_helmet_lando_norris.glb` and `michael_schumacher_2002_helmet.glb`) into a dedicated Helmet Product Page matching the features and scrollytelling capabilities of the Car Models page. Enhance navigation so that clicking model switcher buttons updates the WebGL canvas instantly without reload, while updating the browser's URL handle using the HTML5 History API. Update the All Products page to list all products separately.

</domain>

<decisions>
## Implementation Decisions

### Navigation & Dynamic URL Routing
- **D-01 (Zero-Lag History API):** Swapping between models in the switcher row uses the **HTML5 History API** (`window.history.pushState`) to update the active model, details, specs, and price **instantly** without reloading the page.
- **D-02 (Browser URL Sync):** As the user switches, the browser address bar syncs cleanly to the new product route (e.g. `/products/redbull-rb19` when active). If a user accesses this URL directly, the server renders that product instantly.
- **D-03 (Contextual Switcher Scopes):** 
  - Viewing a **Car Model** shows car selectors: `MCLAREN-MCL39`, `REDBULL-RB19`, `FERRARI-SF23`, `MERCEDES-W14`.
  - Viewing a **Helmet Model** shows helmet selectors: `LANDO-NORRIS-HELMET`, `SCHUMACHER-HELMET`.

### Helmet Collectible Models
- **D-04 (Asset Mappings):** Load the copied helmet models from theme assets:
  - Lando Norris Helmet: `f1_helmet_lando_norris.glb`
  - Michael Schumacher Helmet: `michael_schumacher_2002_helmet.glb`
- **D-05 (Chassis Engine Compatibility):** Re-use the existing Three.js GLTFLoader canvas (`CarCanvas.tsx`), modifying it dynamically to adjust model scale, position, and lighting parameters for helmets (which occupy a more vertical/spherical volume than long F1 cars).

### Technical Telemetry & Specifications
- **D-06 (Helmet Spec Sheets):** The scrollytelling specs panel for helmets displays:
  - **Lando Norris Helmet**:
    - Reference Code: `PW-LN-F1`
    - Shell: Autoclaved Pre-preg Carbon Fiber
    - Visor: Vacuum Metallized Dual Anti-fog Lens
    - Accent Color: `#FF8000` (McLaren Orange)
  - **Michael Schumacher 2002 Helmet**:
    - Reference Code: `PW-MS-2002`
    - Shell: Autoclaved Pre-preg Carbon Fiber
    - Visor: Autographed Classic Red
    - Accent Color: `#E10600` (Ferrari Crimson)
- **D-07 (Helmet Sizes & Scales):**
  - **1:2 Scale (Half Scale):** Dimensions: `130mm x 165mm x 125mm`, Weight: `480g`, Price: `₹7,999`.
  - **1:1 Scale (Full Scale):** Dimensions: `260mm x 330mm x 250mm`, Weight: `1,600g`, Price: `₹45,999` (autographed collectable premium).

### Catalog Grid Updates (All Products)
- **D-08 (Individual Catalog Cards):** Update `sections/collection-all.liquid` (and standard fallbacks) to render **every single car model and helmet model separately** in the staggered grid rather than grouping them, linking directly to their dedicated URL endpoints.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Source Code Context
- [src/main.tsx](file:///Users/kura/Antigravity%20Projects/pitwall-shopify-theme/src/main.tsx) — Main entry point mounting WebGL canvas and scrollytelling modules.
- [src/components/ProductScrollytelling.tsx](file:///Users/kura/Antigravity%20Projects/pitwall-shopify-theme/src/components/ProductScrollytelling.tsx) — Collectible layout containing the variants schema, specifications, scales, and buy flows.
- [src/components/CarCanvas.tsx](file:///Users/kura/Antigravity%20Projects/pitwall-shopify-theme/src/components/CarCanvas.tsx) — Three.js engine and lighting setup that needs helmet support.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CarCanvas.tsx` — Exposes camera controls, basic loaders, and model renders. Can load both helmets and cars based on product name filters.
- `sections/product-detail.liquid` — Shopify detail page that passes dynamic variants down as mount data attributes.

### established patterns
- Using `data-ferrari-url` and `data-mclaren-url` properties. We should add `data-norris-helmet-url` and `data-schumacher-helmet-url` attributes to the Liquid section mount-point.

</code_context>

<specifics>
## Specific Ideas
- In `ProductScrollytelling.tsx`, detect if the current product handle represents a helmet (`productHandle.includes('helmet')`) to switch layout context.
- When switcher buttons are clicked, update state *and* run:
  `window.history.pushState({}, '', '/products/' + targetHandle);`

</specifics>

<deferred>
## Deferred Ideas
- Dynamic live shopping cart AJAX count sync (deferred to general cart milestone).

</deferred>

---

*Phase: 3-Helmets PDP & Dynamic Routing*
*Context gathered: 2026-05-31*
