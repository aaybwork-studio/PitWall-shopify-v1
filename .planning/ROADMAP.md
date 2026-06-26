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
- [x] **Phase 02.2: Homepage Interaction Overhaul (INSERTED)** — Deliver an advanced scrollytelling experience on the homepage featuring scroll-locking, mirrored featured products, continuous video backgrounds, interactive ticker, and custom columns collections grids
- [x] **Phase 02.3: About Us Car Scrollytelling (INSERTED)** — Add a Group 3 horizontal scrollytelling section with an animated F1 car traveling across 3 panels, followed by a vertical About Us content section, inserted between Group 2 and Footer (completed 2026-06-07)
- [x] **Phase 02.4: Redesign Collections Page (INSERTED)** — Redesign the collections page with a top video hero, difference-blended title overlay, yellow filter/sort bar, and a masonry dynamic product grid with landing page style cards
- [x] **Phase 02.5: Redesign Manifesto Section (INSERTED)** — Replace the text-only Manifesto section with a 3-equal-panel image reveal, each panel difference-blended with a tagline, animated in via smooth scroll-triggered reveals, no hero video background (completed 2026-06-18)
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
- [x] 02.3-01-PLAN.md — Fix Group 2 exit + add Group 3 wheel zone handler + props interface expansion
- [x] 02.3-02-PLAN.md — F1CarSilhouette inline SVG component + .car-silhouette CSS + carX formula
- [x] 02.3-03-PLAN.md — Group 3 desktop JSX (3 panels) + mobile stacked sections
- [x] 02.3-04-PLAN.md — Shopify schema fields + JSON script tag + data-* attributes + main.tsx wiring
- [x] 02.3-05-PLAN.md — Mobile CSS audit + human verification checkpoint
- [x] 02.3-06-PLAN.md — End-to-end scroll chain verification + final production build

---

---
 
### Phase 02.4: Redesign Collections Page (INSERTED)
**Goal**: Redesign the collections page (`/collections/all`) to match the new specifications: 1/3 video on top with a difference blended header, a yellow filter/sort bar with functional categories and sorting dropdowns, and a dynamic masonry product grid with randomized positions and landing page card styles.
**Mode**: mvp
**Depends on**: Phase 2
**Requirements**: (inline — decisions D-01 through D-13 from 02.4-CONTEXT.md)
**Success Criteria** (what must be TRUE):
  1. The collections page mounts the React-driven collections interface at `collection-grid-root`.
  2. The page loads with all products in the category visible, shuffled in a random order.
  3. The yellow bar is functional: clicking a category dropdown filters products; clicking a sort dropdown sorts them, updating the label next to the button.
  4. Cards render with specification labels and show the details overlay + "VIEW" button on hover.
  5. The video hero occupies 1/3 screen height and the text blends correctly.

---

### Phase 02.5: Redesign Manifesto Section (INSERTED)
**Goal**: Replace the current text-only Manifesto section with a 3-equal-panel image reveal (THE RACE / THE MOMENT / YOURS style reference), each panel difference-blended with a tagline in matching placement, animated in via smooth scroll-triggered reveals, with no hero video background on this section.
**Mode**: standard
**Depends on**: Phase 02.2
**Requirements**: (inline — decisions D-01 through D-15 from 02.5-CONTEXT.md)
**Plans**: 2 plans

Plans:
- [x] 02.5-01-PLAN.md — Manifesto image_picker + tagline schema settings in hero-canvas.liquid, wired through main.tsx as new props
- [x] 02.5-02-PLAN.md — Desktop 3-panel staggered scale-up reveal + mobile stacked panels in HomepageScrollytelling.tsx, plus lowered VideoBackground gate threshold

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

### Phase 04: Redesign Collections Page (Horizontal Scroll)
**Goal**: Redesign the collections page to group products into horizontal scrolling rows, with alternating Category Cards, custom card sizes, hover navigation, and customizable page title.
**Mode**: standard
**Success Criteria**:
  1. Products are grouped into horizontal scrolling rows by category.
  2. Each row has a Category Card containing the category name and a simple description.
  3. Category Cards alternate positions dynamically in each row.
  4. Cards are fixed to 320px x 380px.
  5. Hovering over a row shows left/right navigation arrows that scroll when clicked.
  6. The header title defaults to "Our Products" and is customizable.
 
---
 
## Progress Table
 
| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. About Page | 1/1 | Completed | 2026-05-31 |
| 2. All Products Page | 1/1 | Completed | 2026-05-31 |
| 02.1. Redesign Hero Page | 2/2 | Completed | 2026-06-06 |
| 02.2. Homepage Interaction Overhaul | - | Completed | 2026-06-07 |
| 02.3. About Us Car Scrollytelling | 6/6 | Complete    | 2026-06-07 |
| 02.4. Redesign Collections Page | - | Completed | 2026-06-18 |
| 02.5. Redesign Manifesto Section | 2/2 | Complete    | 2026-06-18 |
| 3. Helmets PDP & Dynamic Routing | 0/? | Not started | - |
| 4. Redesign Collections (Horizontal Scroll) | 1/1 | Complete | 2026-06-23 |

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

### Phase 5: Navbar Redesign — Team/Driver Visual Dropdowns & Landing Pages

**Goal:** Replace the hardcoded, non-editable navbar megamenu with a Shopify-editable Teams/Drivers visual dropdown system (livery images, driver headshots, grouped columns), and ship 6 team + 6 driver landing pages (hero, bio, filter bar, product grid) backed by real Collections — so merchants can manage the roster without code changes and no navbar entry is a dead link.
**Requirements**: (none mapped — no REQ-IDs assigned to this phase; locked decisions sourced from session CONTEXT)
**Depends on:** Phase 4
**Plans:** 4 plans

Plans:
**Wave 1**
- [ ] 05-01-PLAN.md — header-nav.liquid section with team_item/driver_item/nav_group theme blocks + theme.liquid wiring + new driver-card/headshot CSS
- [ ] 05-02-PLAN.md — collection-team.liquid / collection-driver.liquid sections + collection.team.json / collection.driver.json alternate templates

**Wave 2** *(blocked on Wave 1 completion)*
- [ ] 05-03-PLAN.md — Extract shared filter/sort hooks from CollectionGrid.tsx; build TeamLandingPage.tsx + DriverLandingPage.tsx; mount in main.tsx

**Wave 3** *(blocked on Wave 2 completion)*
- [ ] 05-04-PLAN.md — (checkpoint) Create 12 Collections in Shopify Admin with metafields + alternate templates assigned; verify zero dead navbar links

---

*Roadmap generated: 2026-05-30 | Updated: 2026-06-07 (Phase 02.3 added)*
