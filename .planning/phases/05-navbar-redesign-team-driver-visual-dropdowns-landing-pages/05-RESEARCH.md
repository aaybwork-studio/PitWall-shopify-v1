# Phase 5: Navbar Redesign — Team/Driver Visual Dropdowns & Landing Pages - Research

**Researched:** 2026-06-26
**Domain:** Shopify Online Store 2.0 theme architecture — editor-configurable navigation megamenus, Collections/Metaobjects for entity landing pages
**Confidence:** MEDIUM (stack/pattern choices verified against official Shopify docs; exact visual/asset decisions are LOW until user confirms scope)

## Summary

The current navbar in this theme is **100% hardcoded Liquid/HTML with zero merchant editability**. There is no `link_list` setting, no theme blocks, no schema of any kind controlling the megamenu — every team, driver, product link, and even the team livery image filename (`{{ 'ferrari.png' | asset_url }}`) is hand-written directly into `layout/theme.liquid` (~lines 60–290, duplicated again for the mobile accordion at ~lines 283–390). This means the user's "everything editable in Shopify" constraint is not a small tweak — it requires extracting the entire megamenu into a proper **section with repeatable blocks** (theme blocks with `image_picker`, `text`, and `url` schema fields) so merchants can add/edit/remove/reorder teams and drivers from the theme editor with no code changes.

There is also a previously-built, fully separate React component (`src/components/Navbar.tsx`) that implements a *different*, also-hardcoded menu overlay. It is dead code — `src/main.tsx` never mounts it (no `ReactDOM.createRoot` call references it, no `navbar-root` div exists anywhere). The STATE.md claim of "dynamic Liquid megamenu overlay grids" refers to the `theme.liquid` implementation, not `Navbar.tsx`. Treat `Navbar.tsx` as either dead code to delete or, at most, a rough reference for menu-link data shape — do not build on top of it.

For the landing pages, **Shopify Collections (one collection per team) is the right-fit, lowest-risk pattern** — it reuses all Phase 2/4 infrastructure (collection-scoped product grids, `templates/collection.json`, the existing `/collections/{team-handle}` links already hardcoded in the megamenu), and collection **metafields** (image, rich text) cleanly supply the hero banner image, logo, and bio blurb per team, fully editable via Dynamic Sources in the theme editor — no new infrastructure required. Drivers have no native Shopify resource type; the same Collection-per-entity pattern (one collection per driver, products tagged/associated to that driver) is the most consistent, lowest-risk choice given this repo has zero metaobject definitions today. Metaobjects-as-pages (`templates/metaobject/{type}.liquid`) is technically possible and more "correct" for non-product entities, but it is net-new infrastructure (new metaobject definitions, new template type, no precedent in this repo) and should only be chosen if the user explicitly wants structured driver/team profiles decoupled from purchasable collections.

**Primary recommendation:** Model teams and drivers as **repeatable theme blocks in the header section schema** (image_picker + text + url per item, grouped under parent "group label" settings for "F1 Teams" / "Legacy F1 Teams" / "F1 Drivers" / "F1 Alumni") for the dropdown content, and back the landing pages with **one Shopify Collection per team/driver** (using collection metafields for hero image, logo, and bio blurb) routed through a new `templates/collection.team.json` / `templates/collection.driver.json` alternate template — not metaobjects, not the existing generic `collection.json` (which is already claimed by the all-products grid from Phase 2/4 and must not be touched).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Megamenu dropdown content (team/driver list, images, links) | Frontend Server (Liquid/theme editor) | — | Must be merchant-editable; Liquid schema blocks are the only tier with theme-editor binding |
| Megamenu hover/open interaction | Browser / Client | — | Pure CSS `:hover` or small inline JS already used for the existing cart dropdown and megamenu panels; no React needed |
| Team/driver landing page hero, bio, logo | Frontend Server (Liquid, Collection metafields) | — | Collection objects + metafields render server-side via Liquid; editable via Dynamic Sources in theme editor |
| Team/driver landing page filter bar (Season, Type, Gender, Size, Price, etc.) | Browser / Client (React) | API/Backend (Shopify Storefront — `collection.products`) | Phase 4 precedent: React (`CollectionGrid.tsx`) consumes a JSON data island rendered by Liquid, filters/sorts client-side. New filter facets (Driver, Season, Gender, Size, Rating) need product metafields/tags to filter on |
| Product-to-team / product-to-driver association | Database / Storage (Shopify Admin: Collections + tags/metafields) | — | Native Shopify primitive (collection membership + tags); no custom DB needed |
| Routing `/collections/{team-handle}` and `/collections/{driver-handle}` | API / Backend (Shopify native collection routing) | — | Reuses Shopify's built-in collection URL resolution; no custom routing/proxy needed |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Shopify Liquid theme blocks (`{% schema %}` in sections) | OS 2.0 (current) | Editor-configurable repeatable navbar items | Native Shopify primitive; only mechanism that gives merchants add/remove/reorder/image-pick in the theme editor `[CITED: shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema]` |
| Shopify Collections + Collection metafields | OS 2.0 (current) | Team/driver landing page hero, logo, bio data source | Reuses existing Phase 2/4 collection infrastructure; metafields render via Dynamic Sources with zero new template types `[CITED: Shopify Help Center — Collection metafields / Dynamic Sources]` |
| React 18 (already in repo) | 18.3.1 (installed) `[VERIFIED: package.json]` | Filter bar + product grid on landing pages | Matches the exact pattern already shipped in `CollectionGrid.tsx` for Phase 4; reuse, do not reinvent |
| Alternate JSON collection templates (`templates/collection.{suffix}.json`) | OS 2.0 (current) | Route team/driver collections to a different section than the generic all-products grid | Native Shopify "alternate template" mechanism — assign per-collection in Admin without touching the existing `collection.json` (All Products page, Phase 2/4) `[CITED: shopify.dev/docs/storefronts/themes/architecture/templates]` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Shopify product tags or a `custom.driver` / `custom.team` product metafield | OS 2.0 | Cross-reference: let a driver page show products from multiple teams (e.g. driver moved teams) or let a single product appear under multiple driver filters | Use tags if simple multi-value membership is enough (cheap, no schema); use metafields if you need structured single-value reference fields |
| `metaobject` (Shopify Custom Data) | OS 2.0 | Only if the user wants driver/team **profile data** (bio, stats, headshot) fully decoupled from a sellable Collection, with its own admin-managed entries | Not recommended for this phase — net new infra, no precedent in repo; revisit only if Collections-per-driver proves too rigid later |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Collection-per-team/driver | Metaobjects + `templates/metaobject/{type}.json` pages | More "correct" data modeling (driver isn't really a sellable collection), but adds a second content system merchants must learn, requires defining metaobject types via Admin or `shopify app generate metaobject` / GraphQL Admin API, and a new template file type this repo has never used. Defer unless roster grows large or driver pages need fields collections can't hold |
| Repeatable theme blocks for megamenu items | Shopify native `link_list` (Navigation menu in Admin) | `link_list` gives merchants menu editing without ANY code, but a stock Online Store navigation link is just label+URL — it cannot carry a livery image or headshot per item. Blocks-with-image_picker are required because the visual requirement (Image 1/2 references) needs an image per entry, which `link_list` does not support natively |
| Building a brand-new filter bar from scratch | Extend the existing `CollectionGrid.tsx` / Phase 4 filter bar component | New facets (Season, F1 Drivers, Type, Gender, Size, Price, In Stock, Rating) are additive to the existing `CATEGORIES`/`SORTS` filter pattern already in `CollectionGrid.tsx` — extend, don't replace |

**Installation:**
No new packages required — React, Vite, and Tailwind are already installed and configured in this repo `[VERIFIED: package.json]`. No Shopify CLI version change needed; `npx shopify theme dev` / `theme push` already configured in `package.json` scripts.

**Version verification:**
```
react: 18.3.1 (installed, package.json)
shopify CLI: invoked via npx, not pinned in package.json — confirm with `npx shopify version` before starting work
```
Theme block schema support (`{% schema %}` inside `blocks/*.liquid`) and metaobject Online Store rendering are both current Online Store 2.0 features as of Shopify's 2024–2025 changelog entries; both remain current per official docs reviewed in this session `[CITED: shopify.dev/changelog/renderable-and-online-store-capabilities-for-metaobjects]`.

## Architecture Patterns

### System Architecture Diagram

```
Merchant (Shopify Theme Editor)
        │  edits header section blocks (team_item / driver_item)
        ▼
config/settings_data.json (theme editor persists block settings)
        │  read at request time
        ▼
layout/theme.liquid
  ├─ renders <header> nav bar links (Drivers / Teams / dropdown triggers)
  └─ renders megamenu panel HTML from {% for block in section.blocks %}
        │  team_item blocks → image_picker image + text name + url link
        │  driver_item blocks → image_picker headshot + text name + url link
        ▼
Browser: CSS :hover (or small inline JS, same pattern as #nav-cart-dropdown)
  reveals megamenu panel on nav-menu-item hover
        │  user clicks a team/driver card
        ▼
GET /collections/{team-handle}  or  /collections/{driver-handle}
        │  Shopify resolves to Collection object
        ▼
templates/collection.team.json (alternate template, NEW)
  └─ sections/collection-team.liquid (NEW)
        ├─ renders hero banner from collection.metafields.custom.hero_image
        ├─ renders bio blurb from collection.metafields.custom.bio
        ├─ outputs JSON data island: collection.products (same pattern as
        │  collection-all.liquid's #collection-products-data script)
        ▼
src/components/TeamLandingPage.tsx (NEW, mounted via main.tsx)
  ├─ renders hero, breadcrumb, title, bio (from data attributes)
  ├─ renders extended filter bar (Season / Driver / Type / Gender / Size / Price / Sort)
  └─ renders product grid (reuses CollectionRow/CollectionCard from CollectionGrid.tsx)
```

A reader can trace: editor block edit -> Liquid render -> hover reveal -> click -> Shopify collection routing -> alternate template -> React-rendered hero+filter+grid.

### Recommended Project Structure
```
layout/
└── theme.liquid               # Strip hardcoded megamenu HTML; replace with {% section 'header-nav' %} include or convert header into its own section
sections/
├── header-nav.liquid          # NEW — extracted header section with blocks: team_item, driver_item, nav_group
├── collection-team.liquid     # NEW — team landing page hero+filter+grid mount point
└── collection-driver.liquid   # NEW — driver landing page hero+filter+grid mount point
templates/
├── collection.team.json       # NEW — alternate template referencing collection-team section
└── collection.driver.json     # NEW — alternate template referencing collection-driver section
src/components/
├── TeamLandingPage.tsx        # NEW — hero/breadcrumb/bio/filter bar/grid for teams
├── DriverLandingPage.tsx      # NEW — hero/breadcrumb/bio/filter bar/grid for drivers
└── CollectionGrid.tsx         # EXTEND — factor out filter bar + grid into shared subcomponents reused by both new pages
```

### Pattern 1: Repeatable theme blocks for visual nav items
**What:** A header section schema defines block types (`team_item`, `driver_item`, and optionally a `nav_group` block to render group headers like "F1 Teams" / "Legacy F1 Teams") each with `image_picker`, `text`, and `url` settings.
**When to use:** Any time a merchant needs to add/remove/reorder visual list items without code changes — exactly this phase's core constraint.
**Example:**
```liquid
{% comment %} sources/header-nav.liquid {% endcomment %}
{% for block in section.blocks %}
  {% case block.type %}
    {% when 'nav_group' %}
      <span class="megamenu-group-label">{{ block.settings.label }}</span>
    {% when 'team_item' %}
      <a href="{{ block.settings.link }}" class="team-card" {{ block.shopify_attributes }}>
        <div class="team-car-img-wrap">
          {{ block.settings.team_image | image_url: width: 400 | image_tag }}
        </div>
        <span class="team-card-name">{{ block.settings.team_name }}</span>
      </a>
  {% endcase %}
{% endfor %}
```
```json
// {% schema %} for header-nav.liquid
{
  "name": "Header Navigation",
  "blocks": [
    {
      "type": "nav_group",
      "name": "Group Label",
      "settings": [{ "type": "text", "id": "label", "label": "Group label" }]
    },
    {
      "type": "team_item",
      "name": "Team",
      "settings": [
        { "type": "image_picker", "id": "team_image", "label": "Team livery image" },
        { "type": "text", "id": "team_name", "label": "Team name" },
        { "type": "url", "id": "link", "label": "Link (collection or page)" }
      ]
    },
    {
      "type": "driver_item",
      "name": "Driver",
      "settings": [
        { "type": "image_picker", "id": "headshot", "label": "Driver headshot" },
        { "type": "text", "id": "driver_name", "label": "Driver name" },
        { "type": "url", "id": "link", "label": "Link (collection or page)" }
      ]
    }
  ]
}
```
*(Liquid syntax pattern confirmed against current Shopify theme block schema documentation `[CITED: shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema]`. Exact field availability for `url` type vs `link_list` should be spot-checked against the Shopify CLI theme check/lint during implementation — Shopify periodically renames setting types.)*

### Pattern 2: Collection metafields for hero/bio content (Dynamic Sources)
**What:** Define collection-scoped metafields (e.g. `custom.hero_image`, `custom.bio`, `custom.logo`) in Admin > Settings > Custom data > Collections, then connect them via "Connect dynamic source" in the theme editor on the new `collection-team.liquid` section's hero image/text settings.
**When to use:** Per-team/per-driver hero banner, logo, and bio blurb that a merchant edits per-collection without touching code — exactly the Image 3/Image 4 requirement.
**Example (Liquid read side):**
```liquid
{% comment %} sections/collection-team.liquid {% endcomment %}
<img src="{{ collection.metafields.custom.hero_image.value | image_url: width: 1600 }}" alt="{{ collection.title }}">
<p class="team-bio">{{ collection.metafields.custom.bio.value }}</p>
```
*(Pattern confirmed against Shopify's documented collection metafields + Dynamic Sources workflow `[CITED: Shopify Help Center — Collection metafields for hero banners]`. Exact metafield namespace/key names are illustrative — must be created by the user/developer in Admin before the dynamic source connection is available.)*

### Anti-Patterns to Avoid
- **Hardcoding new team/driver entries directly in Liquid (continuing current pattern):** Directly violates the user's "all items editable in Shopify" constraint. Every team/driver name, image, and link must originate from a block setting or collection metafield, never a literal string in the `.liquid` file.
- **Reusing the generic `templates/collection.json` for team/driver pages:** That template is already claimed by the All Products / Collections grid (Phase 2/4, `collection-all.liquid`). Overwriting it would break the existing all-products page. Use Shopify's alternate template mechanism (`collection.team.json`, assigned per-collection in Admin) instead.
- **Building on `src/components/Navbar.tsx`:** It is unmounted dead code with hardcoded menu items and no relationship to the live `theme.liquid` megamenu. Do not extend it; either delete it or leave it untouched and build entirely within the `theme.liquid`/new-section path.
- **Storing team livery / driver headshot images only as theme code assets (`assets/ferrari.png`):** Current repo does this for 4 teams and 2 drivers. This breaks "editable in Shopify" — code assets require a developer to add files and redeploy. All new team/driver images must be merchant-uploadable via `image_picker` block settings (which store the image on Shopify's CDN, editable without a deploy).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Per-entity landing page with unique URL/slug | Custom Liquid routing logic, custom page-per-team Liquid templates managed by hand | Shopify Collections (URL auto-resolved at `/collections/{handle}`) + alternate JSON templates | Shopify already solves slug-to-page resolution server-side; reinventing it duplicates what collection routing gives for free |
| Reorderable, addable/removable list of visual items in the editor | A custom JSON settings field requiring manual JSON editing, or a fixed-count set of settings (`team_1_image`, `team_2_image`, ...) | Theme blocks (`"blocks": [...]` in section schema) | Blocks natively support add/remove/reorder in the theme editor; fixed numbered settings do not scale and are exactly the inflexibility the user is trying to escape |
| Hero image + bio text that varies per team/driver but uses the same template | Per-team `.liquid` section files (one file per team, hardcoded image/text) | Collection metafields + Dynamic Sources, OR block settings, on a single shared section | One shared section reads metafields per collection context — adding team #7 requires zero new template code, just a new Collection + filled-in metafields |

**Key insight:** Every piece of this phase that risks violating "editable in Shopify" has a documented, official Shopify primitive that solves it (blocks for repeatable visual items, metafields/dynamic sources for per-entity content, alternate templates for per-entity-type layouts). The only reason to hand-roll is unfamiliarity with these primitives — none of the requirements in the todo spec require custom data infrastructure.

## Common Pitfalls

### Pitfall 1: Editing the generic `collection.json` template by accident
**What goes wrong:** Developer edits `templates/collection.json` to add the new hero/filter layout, not realizing it's the default template applied to every collection including `/collections/all` (Phase 2/4's All Products page).
**Why it happens:** `collection.json` looks like "the" collection template; its role as the *default fallback* for ALL collections isn't obvious without checking Admin > collection > Theme template dropdown.
**How to avoid:** Always create a new alternate template (`collection.team.json`, `collection.driver.json`) and explicitly assign it per-collection in Shopify Admin. Never touch `templates/collection.json`.
**Warning signs:** All Products page suddenly shows a hero banner / different filter bar after this phase ships.

### Pitfall 2: Megamenu hover panel breaks because `nav-megamenu-container` markup structure changes
**What goes wrong:** The existing CSS (in compiled `assets/main.css`, source likely Tailwind utilities + custom CSS in `src/index.css`) targets specific class names (`megamenu-panel[data-panel="teams"]`, `.team-card`, etc.) for hover-reveal. If the new block-based markup emits different class names or nesting, the hover-show/hide breaks silently (panel never appears, or appears stuck open).
**Why it happens:** Converting hardcoded HTML to a Liquid `{% for block in section.blocks %}` loop changes DOM structure unless markup/classes are preserved exactly.
**How to avoid:** Audit the current hover CSS (search compiled `assets/main.css` for `.megamenu-panel`, `.nav-menu-item`, `data-dropdown`, `data-panel`) before refactoring, and preserve the same class names/data attributes in the new block-rendered markup, or update the CSS in lockstep.
**Warning signs:** Dropdown panels don't open on hover, or open and never close, after the block conversion.

### Pitfall 3: Driver pages have no native Shopify resource — easy to under-scope routing
**What goes wrong:** Team routing (`/collections/{team-handle}`) is straightforward since Shopify Collections already exist for teams; drivers have no equivalent native object, so it's tempting to skip creating real Collections for drivers and instead build a fake client-side-only "driver page" that isn't a real route (breaks on direct link/share, no SEO, no Admin-side content management).
**Why it happens:** Drivers feel like "people," not "groups of products," so Collections feel like the wrong model — but Shopify has no better native alternative without metaobjects.
**How to avoid:** Create one real Shopify Collection per launched driver (smart or manual collection, e.g. tag-based: `driver:max-verstappen`), exactly mirroring the team pattern, so driver pages get the same robust URL/template/metafield infrastructure for free.
**Warning signs:** Driver "pages" implemented as query-string filters on `/collections/all` instead of dedicated, bookmarkable, SEO-indexable URLs.

### Pitfall 4: Scope creep on filter bar facets without underlying data
**What goes wrong:** Spec calls for Season, Collection, F1 Drivers, Type, Gender, Size, Price, In Stock, Rating, Sort filters — but most products in this catalog likely have no `Season`, `Gender`, `Size`, or `Rating` data attached today (only `product.type`/`category` is used in the current Phase 4 filter bar).
**Why it happens:** The reference images show a full-featured filter bar; the underlying product metafield/tag/variant data to power those facets may not exist yet in the actual product catalog.
**How to avoid:** Before building filter UI, audit what metafields/tags/options actually exist on real products (check `shopify_products_import.csv` and live Admin product data). Plan a data-population task (tags or metafields) alongside the UI task, or descope facets with no backing data to "coming soon" placeholders.
**Warning signs:** Filter dropdowns render but every option returns zero results because no products carry the matching tag/metafield value.

## Code Examples

### Existing Phase 4 JSON data-island pattern to replicate for team/driver pages
```liquid
{% comment %} Source: sections/collection-all.liquid (existing, verified on disk) {% endcomment %}
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
This exact pattern works unmodified for a team/driver collection page — `collection` is automatically the in-context collection object when an alternate collection template renders, so no new Liquid logic is needed to scope products to the team/driver; only new fields (e.g. `"driver"`, `"season"`) need adding to the JSON per new filter facets.

## State of the Art

| Old Approach (seen in this repo today) | Current Approach (Shopify OS 2.0 standard) | When Changed | Impact |
|--------------------------------------|---------------------------------------------|---------------|--------|
| Hardcoded `<div class="megamenu-panel">` HTML with literal team/driver names and `{{ 'ferrari.png' \| asset_url }}` | Theme blocks with `image_picker`/`text`/`url` schema settings | Online Store 2.0 (2021+), still current | Merchants edit nav content without a developer; matches the explicit phase constraint |
| Single generic `templates/collection.json` for every collection | Alternate JSON templates per collection type, assigned in Admin | Online Store 2.0 (2021+), still current | Lets team/driver collections render a completely different layout (hero+filter+grid) without breaking the existing All Products page |
| No metafields on collections in this repo today | Collection metafields + Dynamic Sources for per-collection hero/bio content | Dynamic Sources GA'd 2022, still current | Enables hero image/bio text editing per team/driver without per-entity code |

**Deprecated/outdated:** None identified specific to this stack — Online Store 2.0 architecture (sections, blocks, JSON templates, metafields, Dynamic Sources) is the current standard and is what this repo already uses elsewhere (Phase 1–4); this phase simply needs to extend the same standard to the navbar, which currently predates/ignores it.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Collections-per-driver (rather than metaobjects or tag-filtered `/collections/all` views) is the right fit for driver landing pages | Summary, Pattern 2, Pitfall 3 | If the user strongly prefers metaobjects (e.g., to decouple driver profile data from a sellable product grouping, or anticipates drivers without dedicated merchandise), the planner should pivot to metaobject-backed pages instead — re-confirm with user before locking this in discuss-phase |
| A2 | The megamenu's open/close interaction is pure CSS `:hover` (no JS state machine) based on absence of any JS event listener targeting `data-dropdown`/`megamenu-panel` in theme.liquid or any standalone JS file | Pitfall 2 | If hidden JS logic exists inside the compiled `assets/pitwall-interactive.js` bundle (built from `src/`) that I did not inspect line-by-line, refactoring could silently break more interaction than expected — verify by grep'ing the compiled bundle or `src/main.tsx` for `data-dropdown` before refactor |
| A3 | "5-6 best-selling/profitable" teams and drivers to launch with first is still an open business decision per the todo file, not yet resolved | Summary (implicit), Pitfall 4 | If planning proceeds without explicit user confirmation of the final roster, the phase may ship the wrong teams/drivers or need rework — todo file explicitly flags this as needing discussion before building |
| A4 | Filter bar facets (Season, Gender, Size, Rating, etc.) referenced in the todo's Image 3/4 description do not yet have backing product data in this catalog | Pitfall 4 | If product data already has these attributes via metafields/options not surfaced in the files reviewed (only `shopify_products_import.csv` headers were not inspected), the data-population concern may be unfounded — verify by inspecting the CSV/Admin product data before locking task scope |

**If this table is empty:** N/A — see entries above; all four should be confirmed or resolved during discuss-phase before final planning.

## Open Questions

1. **Final roster of teams/drivers to ship first**
   - What we know: Todo file suggests F1, McLaren, Ferrari, Red Bull, Mercedes, Aston Martin (teams) and Verstappen, Hamilton, Leclerc, Norris, Piastri, Russell (drivers) as "obvious high-commercial picks," but explicitly flags this needs user confirmation.
   - What's unclear: Whether the user wants exactly these or a different cut, and whether "legacy/alumni" teams/drivers (Sauber, Alfa Romeo, AlphaTauri / Senna, Magnussen, Doohan, Ricciardo, Vettel, Tsunoda, Zhou) ship in this phase or a later one.
   - Recommendation: Surface as a locked decision in `/gsd-discuss-phase` before planning tasks — this determines how many Collections, metafield entries, and image assets need creating.

2. **Whether driver pages need their own Collections or can filter `/collections/all` by a driver tag**
   - What we know: Teams map cleanly onto existing/creatable Collections (`/collections/scuderia-ferrari` already exists as a link target). Drivers have no precedent collection in this repo today.
   - What's unclear: Whether the user wants a "real" dedicated driver collection (clean URL, own metafields) vs. a lighter-weight filtered view.
   - Recommendation: Default to dedicated Collections per driver (Pattern 2) for parity with teams and for SEO/bookmarkability; revisit only if the user explicitly wants a lighter-weight implementation.

3. **Exact mechanism currently driving megamenu hover-open/close** (CSS-only vs. hidden JS in the compiled bundle)
   - What we know: No JS file or inline `<script>` in `theme.liquid` was found wiring `mouseenter`/`mouseleave`/`addEventListener` to `data-dropdown`/`megamenu-panel`. The cart dropdown likely uses CSS hover.
   - What's unclear: Whether `src/main.tsx` or another bundled source file (not fully read line-by-line beyond the homepage bootstrap section) attaches any megamenu-specific JS.
   - Recommendation: Before refactoring the header into a section with blocks, grep the full `src/` tree and compiled `assets/pitwall-interactive.js` for `data-dropdown`/`megamenu` to confirm there is no hidden JS dependency on the current markup structure.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Shopify CLI (`npx shopify`) | Theme dev/push workflow | ✓ (invoked via npx in package.json scripts) | not pinned — verify with `npx shopify version` | — |
| Shopify store / Admin access (pitwall-c4hglmgu.myshopify.com) | Creating Collections, metafield definitions, populating block settings | Not verifiable from filesystem | — | Confirm with user/store owner that Admin access is available during planning/execution, since metafield definitions and Collection creation happen in Admin, not in the codebase |
| Team livery / driver headshot image assets (final roster) | Megamenu visuals + landing page heroes | Partial — only 4 team PNGs (Ferrari, Red Bull, McLaren, Mercedes) and 2 driver PNGs (Norris, Verstappen) exist in `assets/` `[VERIFIED: ls assets/]` | — | New teams/drivers in the confirmed roster need new image assets sourced and uploaded via `image_picker` (merchant-uploadable, not committed to `assets/`) |

**Missing dependencies with no fallback:**
- None — all gaps (missing images, unconfirmed roster) have a clear path (source/upload via Admin) once the roster is locked.

**Missing dependencies with fallback:**
- Team/driver image assets beyond the 6 already in `assets/` — fallback is sourcing new images and uploading via the theme editor's `image_picker`, not adding more files to the `assets/` folder (which would reintroduce the "not editable in Shopify" problem).

## Security Domain

This phase is UI/content-architecture only (navigation, static landing pages, product filtering) — no new authentication, session, or payment surfaces are introduced.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A — no auth surface touched |
| V3 Session Management | No | N/A |
| V4 Access Control | No | N/A — all new pages are public storefront content |
| V5 Input Validation | Yes (minor) | Filter bar query params (e.g., `?sort=`, `?price_min=`) should be validated/whitelisted client-side against known enum values before use, matching the existing pattern in `CollectionGrid.tsx` (`SORTS.find(...)`) rather than trusting raw query string values directly in rendering logic |
| V6 Cryptography | No | N/A |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Reflected content from unvalidated URL query params (filter/sort state) rendered into the DOM | Tampering / Information Disclosure (minor XSS risk if param values are ever rendered as raw HTML) | Continue the existing pattern of matching query params against a fixed allow-list of known values (`SORTS`, `CATEGORIES` arrays) before using them, never `innerHTML`-injecting raw param values |

## Sources

### Primary (HIGH confidence)
- [Block schema — shopify.dev](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema) — theme block schema mechanics for repeatable, editor-managed items
- [Templates — shopify.dev](https://shopify.dev/docs/storefronts/themes/architecture/templates) — alternate JSON template mechanism per resource type
- [Metaobject theme templates — shopify.dev](https://shopify.dev/docs/storefronts/themes/architecture/templates/metaobject) — `metaobject/{type}` template requirement and URL handle behavior
- [Renderable and Online Store capabilities for metaobjects — shopify.dev changelog](https://shopify.dev/changelog/renderable-and-online-store-capabilities-for-metaobjects)
- Direct filesystem inspection: `layout/theme.liquid`, `src/components/Navbar.tsx`, `src/main.tsx`, `sections/collection-all.liquid`, `src/components/CollectionGrid.tsx`, `templates/collection.json`, `templates/page.collection.json`, `config/settings_schema.json`, `package.json`, `README.md`, `assets/` directory listing — all `[VERIFIED]` via direct Read/Bash inspection in this session

### Secondary (MEDIUM confidence)
- [Shopify Help Center — Building web pages with metaobjects](https://help.shopify.com/en/manual/custom-data/metaobjects/connecting-to-your-online-store/webpages)
- [Add navigation to your theme — shopify.dev](https://shopify.dev/docs/storefronts/themes/navigation-search/navigation) — `link_list` setting pattern and its limitations for image-bearing menu items
- WebSearch-sourced summaries on collection metafields + Dynamic Sources for hero banners, cross-referenced against the existing collection-metafield usage pattern already present in `sections/collection-all.liquid` (`product.metafields.custom.specs`)

### Tertiary (LOW confidence)
- General WebSearch summaries on "Shopify theme megamenu best practices 2026" — directionally useful (confirms blocks-over-hardcoding as the consensus pattern) but not independently verified against a single authoritative source beyond shopify.dev's own block/section docs already cited above

## Metadata

**Confidence breakdown:**
- Standard stack (blocks, metafields, alternate templates): HIGH — all three mechanisms are documented, current Shopify OS 2.0 primitives directly cited from shopify.dev
- Architecture (Collection-per-team/driver vs metaobjects): MEDIUM — recommendation is well-reasoned from official docs and repo precedent, but the metaobjects-vs-collections tradeoff for drivers specifically was not found pre-compared in any single authoritative source; treat as a recommendation to validate with the user, not a locked fact
- Pitfalls: HIGH for Pitfalls 1, 3, 4 (directly observed from repo structure); MEDIUM for Pitfall 2 (CSS-hover assumption not 100% confirmed against full compiled JS bundle contents)

**Research date:** 2026-06-26
**Valid until:** 30 days (Shopify theme architecture is stable; re-verify if Shopify ships major navigation/metaobject changes before planning resumes)
