# Phase 5: Navbar Redesign — Pattern Map

**Mapped:** 2026-06-26
**Files analyzed:** 9 (new/modified)
**Analogs found:** 9 / 9

## Correction to RESEARCH.md (Pitfall 2 / Assumption A2)

RESEARCH.md assumed the megamenu hover-open/close is "pure CSS `:hover`" because no JS was found in `theme.liquid`. This is **incorrect** — the JS lives in `src/main.tsx` (compiled into `pitwall-interactive.js`, loaded at the bottom of `theme.liquid`). Confirmed via direct read:

`src/main.tsx` lines 236-298 — `showDropdown()` / `hideDropdown()` bind `mouseenter`/`mouseleave` on `.nav-menu-item[data-dropdown]`, toggle `.is-active` on `.megamenu-panel[data-panel="..."]`, and toggle `.is-visible` on `#nav-megamenu-container` + `.nav-header-expanded` on the header, with a 200ms close debounce via `setTimeout`. This means: **any new team/driver markup must preserve `data-dropdown` on the trigger `.nav-menu-item` and `data-panel` on the corresponding `.megamenu-panel`** — these are real JS hooks, not decorative classes. Converting the megamenu panel content to a `{% for block in section.blocks %}` loop is safe as long as the outer `.megamenu-panel[data-panel="teams"]` / `[data-panel="drivers"]` wrapper and the trigger `.nav-menu-item[data-dropdown="teams"]` / `[data-dropdown="drivers"]` element are preserved untouched.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `sections/header-nav.liquid` (extracted from `layout/theme.liquid`) | Liquid section + theme blocks | request-response (server-render on every page) | `sections/page-about.liquid` (`credit_item` block) | exact (repeatable blocks already used in this repo) |
| `layout/theme.liquid` (modify — replace hardcoded `<header>` megamenu HTML with `{% section 'header-nav' %}`) | layout / Liquid | request-response | itself (existing file) | exact |
| `sections/collection-team.liquid` | Liquid section (collection-scoped) | CRUD (reads `collection.products`, `collection.metafields`) | `sections/collection-all.liquid` | exact (same JSON data-island pattern, same React-mount-point pattern) |
| `sections/collection-driver.liquid` | Liquid section (collection-scoped) | CRUD | `sections/collection-all.liquid` | exact |
| `templates/collection.team.json` | JSON alternate template | config / routing | `templates/collection.json` | exact (identical 1-section JSON shape, different `type`) |
| `templates/collection.driver.json` | JSON alternate template | config / routing | `templates/collection.json` | exact |
| `src/components/TeamLandingPage.tsx` | React component (hero + filter bar + grid) | request-response (hydrates from JSON data island + data-attrs) | `src/components/CollectionGrid.tsx` | exact (filter/sort logic + CollectionCard reused directly) |
| `src/components/DriverLandingPage.tsx` | React component (hero + filter bar + grid) | request-response | `src/components/CollectionGrid.tsx` | exact |
| `src/components/CollectionGrid.tsx` (extend — export shared filter-bar/grid subcomponents) | React component (refactor: extract reusable pieces) | request-response | itself (existing file) | exact |
| `src/main.tsx` (modify — add new mount blocks for team/driver landing pages, no change to existing megamenu hover JS) | bootstrap / mount glue | event-driven (DOM mount on page load) | itself, existing mount blocks at lines 213-233 (`collection-grid-root` mount) | exact |
| `src/components/Navbar.tsx` | dead code | — | N/A — do not use as analog, do not extend (per RESEARCH.md, confirmed unmounted: no `ReactDOM.createRoot` reference exists in `main.tsx`) | N/A |

## Pattern Assignments

### `sections/header-nav.liquid` (Liquid section, theme blocks)

**Analog:** `sections/page-about.liquid` (blocks schema) + existing inline megamenu markup in `layout/theme.liquid` (lines 140-280)

**Repeatable block schema pattern** (`sections/page-about.liquid` lines 402-421):
```json
"blocks": [
  {
    "type": "credit_item",
    "name": "Credit Entry",
    "settings": [
      { "type": "text", "id": "role", "label": "Role / Category", "default": "CREATIVE DIRECTION" },
      { "type": "text", "id": "name", "label": "Contributor Name", "default": "PITWALL STUDIO" }
    ]
  }
]
```
Apply the same shape for `team_item` / `driver_item` / `nav_group` blocks, swapping `text` settings for `image_picker` + `text` + `url` per RESEARCH.md Pattern 1 (already validated against shopify.dev docs there — reuse that exact schema verbatim, it is correct).

**Section-level settings header pattern** (`sections/page-about.liquid` lines 333-352):
```json
{
  "type": "header",
  "content": "Visual Assets"
},
{
  "type": "image_picker",
  "id": "feature_image",
  "label": "Left Column Feature Image",
  "info": "Should be a 3:4 portrait aspect ratio for best visual alignment."
}
```
Use `"header"` pseudo-settings to group `nav_group` labels in the editor sidebar ("F1 Teams" / "Legacy F1 Teams" / "F1 Drivers" / "F1 Alumni"), matching this repo's existing convention of labeled stacks.

**Markup to preserve exactly (JS hook contract — DO NOT rename or restructure)** (`layout/theme.liquid` lines 70-75, 141-224; `src/main.tsx` lines 236-298):
```liquid
<div class="nav-menu-item" data-dropdown="teams">
  <span class="nav-menu-link">TEAMS</span>
</div>
...
<div class="megamenu-panel" data-panel="teams">
  <div class="megamenu-grid-teams">
    {% for block in section.blocks %}
      {% if block.type == 'team_item' %}
        <a href="{{ block.settings.link }}" class="team-card" {{ block.shopify_attributes }}>
          <div class="team-car-img-wrap">
            {{ block.settings.team_image | image_url: width: 400 | image_tag }}
          </div>
          <span class="team-card-name">{{ block.settings.team_name }}</span>
        </a>
      {% endif %}
    {% endfor %}
  </div>
</div>
```
`data-dropdown="teams"` and `data-panel="teams"` are the live JS hooks (`src/main.tsx` `showDropdown`/`hideDropdown` keyed by these exact string values: `"drivers"`, `"teams"`, `"f1-gifts"`, `"categories"`, `"new-arrivals"`). Keep the class names `team-card`, `team-car-img-wrap`, `team-card-name`, `megamenu-panel`, `megamenu-grid-teams` identical (these are styled in compiled `assets/main.css` / Tailwind layer, not re-derived here — changing names breaks visual styling silently).

**Mobile accordion markup to mirror** (`layout/theme.liquid` lines 296-353): the mobile takeover duplicates the same team/driver data in `.mobile-accordion-content` / `.mobile-sublinks`. When converting to blocks, loop `section.blocks` a second time inside the mobile accordion markup (same blocks, different wrapper), exactly as the current hardcoded HTML duplicates team/driver lists for desktop megamenu vs. mobile accordion.

---

### `layout/theme.liquid` (modify)

**Analog:** itself — minimal-diff refactor

Replace lines 140-280 (`<div id="nav-megamenu-container">...</div>`) and lines 283-391 (`<div id="full-menu-overlay">...</div>`) with:
```liquid
{% section 'header-nav' %}
```
Keep everything else in `theme.liquid` untouched (cart drawer JS at lines 463-630, theme toggle, grain overlay) — none of it depends on megamenu markup structure, only on element IDs (`pw-cart-*`, `theme-toggle-btn`) that are unrelated and unaffected.

---

### `sections/collection-team.liquid` / `sections/collection-driver.liquid`

**Analog:** `sections/collection-all.liquid` (full file, 43 lines — read in full, reproduced below)

**Mount point + data attributes pattern** (`sections/collection-all.liquid` lines 1-6):
```liquid
<div 
  id="collection-grid-root" 
  class="w-full bg-[#EDEBE5] text-[#0C0C0C] dark:bg-[#0C0C0C] dark:text-[#EDEBE5]"
  data-video-url="{{ 'F1_car_idling_on_background_202606011707.mp4' | asset_url }}"
  data-title="{{ section.settings.title | default: 'Our Products' }}"
></div>
```
For team/driver pages, use a distinct root id (`team-landing-root` / `driver-landing-root`) and add data attributes for hero/bio content sourced from collection metafields:
```liquid
<div
  id="team-landing-root"
  data-title="{{ collection.title }}"
  data-hero-image="{{ collection.metafields.custom.hero_image.value | image_url: width: 1600 }}"
  data-bio="{{ collection.metafields.custom.bio.value | escape }}"
  data-logo="{{ collection.metafields.custom.logo.value | image_url: width: 400 }}"
></div>
```

**JSON product data-island pattern (reuse verbatim)** (`sections/collection-all.liquid` lines 8-24):
```liquid
<script id="collection-products-data" type="application/json">
  [
    {%- assign target_collection = collection | default: collections.all -%}
    {%- paginate target_collection.products by 1000 -%}
      {%- for product in target_collection.products -%}
        {
          "title": {{ product.title | json }},
          "url": {{ product.url | json }},
          "price": {{ product.price | money | json }},
          "image": {{ product.featured_image | img_url: '600x' | json }},
          "specs": {{ product.metafields.custom.specs | default: "1:18 SCALE / PRECISION DETAIL" | json }},
          "category": {{ product.type | default: "WLED Light Boxes" | json }}
        }{% unless forloop.last %},{% endunless %}
      {%- endfor -%}
    {%- endpaginate -%}
  ]
</script>
```
Works unmodified on the team/driver alternate template — `collection` is automatically scoped to the in-context Collection object. Add new fields per new filter facets (e.g. `"season"`, `"driver"`, `"gender"`, `"size"`) sourced from product tags/metafields once that data exists (RESEARCH.md Pitfall 4 — confirm data exists before adding fields, otherwise omit and let the React filter bar show "coming soon" for unbacked facets).

**Section schema pattern (minimal settings, matches collection-all.liquid lines 26-43)**:
```json
{% schema %}
{
  "name": "Team Landing Page",
  "settings": [
    { "type": "text", "id": "title", "label": "Page Title Override" }
  ],
  "presets": [{ "name": "Team Landing Page" }]
}
{% endschema %}
```

---

### `templates/collection.team.json` / `templates/collection.driver.json`

**Analog:** `templates/collection.json` (full file, reproduced — exact shape to copy)
```json
{
  "sections": {
    "main": {
      "type": "collection-all",
      "settings": {}
    }
  },
  "order": [
    "main"
  ]
}
```
New alternate templates are byte-identical in shape, only `"type"` changes:
```json
{
  "sections": {
    "main": {
      "type": "collection-team",
      "settings": {}
    }
  },
  "order": [
    "main"
  ]
}
```
**Critical constraint (RESEARCH.md Pitfall 1, confirmed):** Never edit `templates/collection.json` itself — it is the default template for every collection including `/collections/all` (the Phase 2/4 All Products page). Always create new sibling files (`collection.team.json`, `collection.driver.json`) and assign them per-collection via Admin > Collection > Theme template dropdown.

---

### `src/components/TeamLandingPage.tsx` / `src/components/DriverLandingPage.tsx`

**Analog:** `src/components/CollectionGrid.tsx` (full file, 30877 bytes — read in targeted sections: lines 1-160, 341-600)

**Imports pattern** (`CollectionGrid.tsx` lines 1-11):
```typescript
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Logger } from '../utils/logger';

export interface Product {
  title: string;
  url: string;
  price: string;
  image: string;
  specs?: string;
  category?: string;
}
```
Extend `Product` with optional new facet fields (`driver?`, `season?`, `gender?`, `size?`) for the new filter bar — keep them optional so existing homepage/all-products JSON (which won't have these fields) still type-checks.

**URL-param-synced filter state pattern (reuse for new facets)** (`CollectionGrid.tsx` lines 342-396):
```typescript
const [selectedCategory, setSelectedCategory] = useState<string>(() => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    if (catParam) {
      const matchedCat = CATEGORIES.find(c => c.toLowerCase() === catParam.toLowerCase());
      if (matchedCat) return matchedCat;
    }
  }
  return 'All';
});
// ... popstate listener at lines 369-396 keeps state in sync with back/forward nav
```
This is the ASVS V5 allow-list pattern flagged in RESEARCH.md — every new facet (Season, Gender, Size, etc.) must follow this exact `Array.find()`-against-known-values guard before trusting a query param, never read the raw param directly into render.

**Sort dropdown UI pattern (reuse verbatim, extend SORTS array if needed)** (`CollectionGrid.tsx` lines 537-602): copy the `sortOpen` state + outside-click-close (`useEffect` at lines 445-449) + button/dropdown markup directly; only the array of options and the comparator function (`getCleanPrice`, lines 147-149) change per new sort needs.

**Category tab filter bar pattern (extend for Season/Type/Gender/Size facets)** (`CollectionGrid.tsx` lines 501-535): the sticky filter bar with horizontally-scrolling category tabs (`position: sticky, top: 64`) is the base to extend into a multi-facet bar — add additional tab groups or dropdown selects following the same sticky-bar container, not a new component shell.

**Grouped/sorted product list pattern (reuse `categoriesWithProducts`-style `useMemo`)** (`CollectionGrid.tsx` lines 452-481):
```typescript
const categoriesWithProducts = useMemo(() => {
  const dataSource = products && products.length > 0 ? products : F1_PRODUCTS;
  const activeCategories = selectedCategory === 'All'
    ? CATEGORIES.filter(cat => cat !== 'All')
    : [selectedCategory];
  return activeCategories.map(cat => {
    let catProds = dataSource.filter(p => p.category?.toLowerCase() === cat.toLowerCase());
    if (selectedSort === 'Price: Low to High') {
      catProds.sort((a, b) => getCleanPrice(a.price) - getCleanPrice(b.price));
    } /* ... */
    return { category: cat, products: catProds };
  }).filter(group => group.products.length > 0);
}, [products, selectedCategory, selectedSort]);
```
For team/driver pages there is no "category grouping" needed (products are already pre-scoped to one team/driver via the collection) — instead reuse only the **sort comparator logic** and feed a flat filtered `Product[]` directly into a single `CollectionRow`/grid, skipping the per-category row grouping.

**Card component reuse (no changes needed)** (`CollectionGrid.tsx` lines 22-82, `CollectionCard` component): import and reuse `CollectionCard` directly from `CollectionGrid.tsx` for the product grid — do not reimplement; export it if not already exported (it already has `export function CollectionCard`, so a plain import works).

**Error handling / image load pattern (reuse)** (`CollectionGrid.tsx` lines 38-42):
```typescript
onError={() => {
  Logger.warn(`Failed to load product image: ${product.image}`);
  setIsLoaded(true);
}}
```

---

### `src/components/CollectionGrid.tsx` (extend, do not fork)

**Analog:** itself

Per RESEARCH.md's recommended project structure, factor out the filter-bar JSX (lines 501-602) and the sort/category state hooks (lines 342-449) into exported subcomponents/hooks (e.g. `export function useUrlSyncedFilter(...)`, `export function SortDropdown(...)`) so `TeamLandingPage.tsx` and `DriverLandingPage.tsx` import and compose them rather than duplicating ~250 lines of filter logic. This is a refactor-then-extend, not a rewrite — preserve all existing behavior for the current `/collections/all` page (which still uses `CollectionGrid` directly via the unchanged `collection-grid-root` mount in `main.tsx`).

---

### `src/main.tsx` (modify — additive only)

**Analog:** itself, existing `collection-grid-root` mount block (lines 213-233)

```typescript
// 3. Mount Collection Grid
const collectionRoot = document.getElementById('collection-grid-root');
if (collectionRoot) {
  const videoUrl = collectionRoot.getAttribute('data-video-url') || '';
  const title = collectionRoot.getAttribute('data-title') || 'Our Products';
  let products = [];
  const productsScript = document.getElementById('collection-products-data');
  if (productsScript) {
    try {
      products = JSON.parse(productsScript.textContent || '[]');
    } catch (err) {
      Logger.error('Failed to parse collection product data JSON in main.tsx', err);
    }
  }
  const root = ReactDOM.createRoot(collectionRoot);
  root.render(
    <React.StrictMode>
      <CollectionGrid products={products} videoUrl={videoUrl} title={title} />
    </React.StrictMode>
  );
}
```
Add new sibling mount blocks (`team-landing-root`, `driver-landing-root`) immediately after this one, following the identical try/catch JSON-parse-with-`Logger.error`-fallback pattern. **Do not touch** the megamenu hover-binding block at lines 236-298 (`showDropdown`/`hideDropdown`) — it is keyed by `data-dropdown`/`data-panel` string values that must stay `"drivers"` and `"teams"` regardless of how many block-driven items render inside each panel.

## Shared Patterns

### Megamenu hover interaction (JS, not CSS — correction to RESEARCH.md)
**Source:** `src/main.tsx` lines 236-298
**Apply to:** `sections/header-nav.liquid` markup — must preserve `data-dropdown="teams"` / `data-dropdown="drivers"` on trigger elements and `data-panel="teams"` / `data-panel="drivers"` on panel wrappers verbatim.

### JSON data-island + React hydration
**Source:** `sections/collection-all.liquid` lines 8-24 + `src/main.tsx` lines 213-233
**Apply to:** `sections/collection-team.liquid`, `sections/collection-driver.liquid`, `src/main.tsx` new mount blocks, `TeamLandingPage.tsx`, `DriverLandingPage.tsx` — Liquid renders a `<script type="application/json">` data island, `main.tsx` parses it with try/catch + `Logger.error`, React component receives parsed array as a prop.

### URL-param-synced, allow-list-validated filter state (ASVS V5)
**Source:** `src/components/CollectionGrid.tsx` lines 342-396, 413-427
**Apply to:** `TeamLandingPage.tsx`, `DriverLandingPage.tsx` — every new filter facet (Season, Gender, Size, Driver, Rating) must validate query params against a fixed array via `Array.find()` before setting state, mirroring the existing `CATEGORIES.find(...)` / `SORTS.find(...)` guards. Never render raw `params.get(...)` values directly.

### Repeatable theme blocks for editor-managed visual lists
**Source:** `sections/page-about.liquid` lines 402-421 (`credit_item` block — existing precedent in this exact repo, stronger analog than any external Shopify doc example)
**Apply to:** `sections/header-nav.liquid` — `team_item`, `driver_item`, `nav_group` block types follow the same `"blocks": [{ "type": ..., "name": ..., "settings": [...] }]` schema shape already proven in this codebase.

### Section schema settings header grouping
**Source:** `sections/page-about.liquid` lines 333-340, 353-356, 369-372 (`"type": "header"` pseudo-settings)
**Apply to:** `sections/header-nav.liquid` — group block-type documentation/labels in the editor sidebar using the same `"header"` settings pattern already used to organize "Stack 1 / Stack 2 / Stack 3" in page-about.

### Alternate JSON template (collection-type-specific layout)
**Source:** `templates/collection.json` (verbatim shape)
**Apply to:** `templates/collection.team.json`, `templates/collection.driver.json` — identical `{ "sections": { "main": { "type": "<new-section>", "settings": {} } }, "order": ["main"] }` shape, swap only the `type` value. Never modify `templates/collection.json` itself (breaks `/collections/all`).

## No Analog Found

None — every file in scope has a strong, directly-quotable analog already present in this repository. No file requires inventing a pattern from external docs alone.

## Metadata

**Analog search scope:** `layout/`, `sections/`, `templates/`, `src/components/`, `src/main.tsx`
**Files scanned:** `layout/theme.liquid` (635 lines, read in full), `sections/collection-all.liquid` (43 lines, read in full), `sections/page-about.liquid` (targeted: lines 240-421), `templates/collection.json`, `templates/page.collection.json`, `src/components/CollectionGrid.tsx` (targeted: lines 1-160, 341-600), `src/main.tsx` (targeted: lines 210-423), `src/components/Navbar.tsx` (confirmed dead code per RESEARCH.md, not read further)
**Pattern extraction date:** 2026-06-26
