# Roadmap: Pitwall Shopify Theme — About & All Products Pages

**Milestone:** About & All Products pages
**Granularity:** Coarse
**Mode:** MVP (each phase delivers a complete, shippable page)
**Generated:** 2026-05-30

---

## Phases

- [x] **Phase 1: About Page** — Deliver a complete, shippable `/pages/about` page in Pitwall brand identity, wired to the existing ABOUT nav link, including all shared foundation constraints (tokens, responsiveness, grain overlay)
- [x] **Phase 2: All Products Page** — Deliver a complete, shippable `/collections/all` page in Pitwall brand identity, wired to the existing SHOP nav links, with a placeholder product grid
- [x] **Phase 02.1: Redesign Hero Page (INSERTED)** — Redesign the homepage (hero page) with a 4-section snapping layout, rotating collections grid, and cinematic video player separators
- [ ] **Phase 02.2: Homepage Interaction Overhaul (INSERTED)** — Deliver an advanced scrollytelling experience on the homepage featuring scroll-locking, mirrored featured products, continuous video backgrounds, interactive ticker, and custom columns collections grids
- [ ] **Phase 02.3: About Us Car Scrollytelling (INSERTED)** — Add a Group 3 horizontal scrollytelling section with an animated F1 car traveling across 3 panels, followed by a vertical About Us content section, inserted between Group 2 and Footer
- [ ] **Phase 3: Helmets PDP & Dynamic Routing** — Deliver a complete, shippable helmets product page with autocalibrated WebGL helmet models, zero-lag browser URL state switches via HTML5 History API, and separate catalog listings in `/collections/all`

---

## Phase Details

### Phase 1: About Page
**Goal**: Users visiting `/pages/about` see a fully-designed About page that looks unmistakably Pitwall and delivers the editorial reference composition
**Mode:** mvp
**Depends on**: Nothing (first phase; FND requirements are embedded here as constraints on implementation)
**Requirements**: FND-01, FND-02, FND-03, ABT-01, ABT-02, ABT-03, ABT-04, ABT-05, NAV-02
**Success Criteria** (what must be TRUE):
  1. Visiting `/pages/about` renders the About page using the new `sections/page-about.liquid` section and `templates/page.about.json` template — no 404, no blank page
  2. The page shows a large feature image on the left and labelled text columns (About / Credits / Contact) on the right, with a large faded background brand wordmark, matching the editorial reference composition
  3. The layout uses only Pitwall design tokens (no raw hex, no new colors, zero border-radius, grain overlay preserved, correct Syne/Barlow/IBM Plex Mono fonts)
  4. Contact links (email, social) render with accent-yellow hover states consistent with the rest of the brand
  5. The page is single-column on mobile (below 767px), with 100px desktop / 20px mobile horizontal padding; text and image content is editable via section schema settings
**Plans**: 2 plans (Plan 01 & Plan 02) completed.
**UI hint**: yes

---

### Phase 2: All Products Page
**Goal**: Users visiting `/collections/all` see a fully-designed All Products page in Pitwall style with a working placeholder product grid, wired to the existing SHOP and SHOP NOW buttons
**Mode:** mvp
**Depends on**: Phase 1 (FND constraints already validated; brand conventions established)
**Requirements**: APL-01, APL-02, APL-03, APL-04, APL-05, NAV-01
**Success Criteria** (what must be TRUE):
  1. Visiting `/collections/all` renders the All Products page using the new `sections/collection-all.liquid` section and `templates/collection.json` (or alternate collection template) — no 404, no blank page
  2. The page shows a top label row ("ALL PRODUCTS" + season/collection label) above a multi-column responsive product grid, matching the shop-all reference composition in Pitwall style
  3. Each product card shows a product image, product name, and price beneath it; cards with a PRE-ORDER tag render the badge in Pitwall style (accent yellow, technical-label font)
  4. The grid renders correctly without a live catalog using the `collections.all.products`-with-static-fallback pattern (at least 4 placeholder cards visible)
  5. Clicking the SHOP button in the nav overlay and the SHOP NOW button in the footer both land on this page at `/collections/all`
**Plans**: TBD
**UI hint**: yes

---

### Phase 02.1: Redesign Hero Page (INSERTED)
**Goal**: Redesign the homepage (hero page) of the dev server to include 4 full-screen snapping sections (Hero, Manifesto, Collection, About Us) with dynamic product rotation grids and separator video players.
**Mode**: mvp
**Depends on**: Phase 2
**Requirements**: FND-01, FND-02, FND-03
**Success Criteria** (what must be TRUE):
  1. Desktop snaps to 100vh height boundaries, falling back to a stacked natural vertical scroll on mobile below 767px.
  2. The Collection section rotates products every 6 seconds, pausing on hover to display detail slide-ups with yellow highlights and checkout CTA.
  3. About Us section hides the photo cards on mobile, displaying only the Title and Quote cards.
  4. Separator video player plays autoplaying, looping cinematic wide videos.
**Plans**: 2 plans (Plan 01 & Plan 02) completed.

---

### Phase 02.2: Homepage Interaction Overhaul (INSERTED)
**Goal**: Deliver an advanced scrollytelling experience on the homepage featuring scroll-locking, horizontal scroll groups, mirrored featured products, continuous video backgrounds, interactive ticker, and custom columns collections grids.
**Mode**: mvp
**Depends on**: Phase 02.1
**Requirements**: (inline with phase)
**Plans**: Completed.

---

### Phase 02.3: About Us Car Scrollytelling (INSERTED)
**Goal**: Add a Group 3 horizontal-then-vertical scrollytelling section between Group 2 and Footer. The section features a placeholder F1 car SVG animating across 3 horizontal panels driven by scrollLeft, then transitions to a vertical About Us content section. All text is editable via Shopify theme customizer schema.
**Mode**: standard
**Depends on**: Phase 02.2
**Requirements**: (inline — D-01 through D-17 from 02.3-CONTEXT.md)
**Plans**: 6 plans

Plans:
- [ ] 02.3-01-PLAN.md — Fix Group 2 exit + add Group 3 wheel zone handler + props interface expansion
- [ ] 02.3-02-PLAN.md — F1CarSilhouette inline SVG component + .car-silhouette CSS + carX formula
- [ ] 02.3-03-PLAN.md — Group 3 desktop JSX (3 panels) + mobile stacked sections
- [ ] 02.3-04-PLAN.md — Shopify schema fields + JSON script tag + data-* attributes + main.tsx wiring
- [ ] 02.3-05-PLAN.md — Mobile CSS audit + human verification checkpoint
- [ ] 02.3-06-PLAN.md — End-to-end scroll chain verification + final production build

---

### Phase 3: Helmets PDP & Dynamic Routing
**Goal**: Integrate two F1 Helmet WebGL models (`f1_helmet_lando_norris.glb` and `michael_schumacher_2002_helmet.glb`) into a dedicated Helmet Product page, with zero-lag URL switches using HTML5 History API and separated grid items in `/collections/all`
**Mode:** mvp
**Depends on**: Phase 2 (all layout and tokens validated; catalog grids set up)
**Requirements**: HEL-01, HEL-02, HEL-03, HEL-04, NAV-03
**Success Criteria** (what must be TRUE):
  1. Visiting `/products/lando-norris-helmet` or `/products/schumacher-helmet` renders a dedicated Helmet PDP using the custom scrollytelling canvas supporting helmet GLB models.
  2. Switcher configurator buttons on the Helmet PDP allow users to switch context dynamically using HTML5 History API (`window.history.pushState`) without reloading the page, instantly updating the canvas and specs.
  3. The switcher scope is contextual: Car pages only switch between cars, Helmet pages only switch between helmets.
  4. The `/collections/all` page renders every single car model and helmet model separately in the staggered editorial layout instead of grouping them.
  5. Pre-order parameters (like for the helmets or MCL39 models) are rendered as clean inline monospace annotations `[ PRE-ORDER ]` next to the price tag in high-contrast Racing Yellow.
**Plans**: TBD
**UI hint**: yes

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. About Page | 1/1 | Completed | 2026-05-31 |
| 2. All Products Page | 1/1 | Completed | 2026-05-31 |
| 02.1. Redesign Hero Page | 2/2 | Completed | 2026-06-06 |
| 02.2. Homepage Interaction Overhaul | - | Completed | 2026-06-07 |
| 02.3. About Us Car Scrollytelling | 0/6 | In planning | - |
| 3. Helmets PDP & Dynamic Routing | 0/? | Not started | - |

---

## Requirement Coverage

| Requirement | Phase |
|-------------|-------|
| FND-01 | Phase 1 |
| FND-02 | Phase 1 |
| FND-03 | Phase 1 |
| ABT-01 | Phase 1 |
| ABT-02 | Phase 1 |
| ABT-03 | Phase 1 |
| ABT-04 | Phase 1 |
| ABT-05 | Phase 1 |
| NAV-02 | Phase 1 |
| APL-01 | Phase 2 |
| APL-02 | Phase 2 |
| APL-03 | Phase 2 |
| APL-04 | Phase 2 |
| APL-05 | Phase 2 |
| NAV-01 | Phase 2 |

**Coverage: 15/16 v1 requirements mapped.**

> Note: NAV-01 and NAV-02 are confirmation/validation requirements — NAV-02 is assigned to Phase 1 (About nav lands on the new page) and NAV-01 to Phase 2 (SHOP nav lands on the new page), since each is verified as part of delivering the respective page. There are 15 distinct requirement IDs across 16 slots in the requirements list because the instructions list 16 total (FND x3, ABT x5, APL x5, NAV x2 = 15 unique IDs). All 15 IDs are mapped.

---

*Roadmap generated: 2026-05-30 | Updated: 2026-06-07 (Phase 02.3 added)*
