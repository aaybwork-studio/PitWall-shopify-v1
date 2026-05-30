# Codebase Concerns

**Analysis Date:** 2026-05-30

---

## Theme Completeness Assessment

**This is a heavily customised, early-stage bespoke theme — not a stock/Dawn-derived starter.**

It has been built from scratch with a React + Three.js + Vite front-end compiled into a single bundle
(`assets/pitwall-interactive.js`), then served inside a minimal Liquid shell. As a result it has:

- Only **2 templates**: `templates/index.json` and `templates/product.json`
- Only **2 sections**: `sections/hero-canvas.liquid` and `sections/product-detail.liquid`
- Only **1 layout**: `layout/theme.liquid`
- No `templates/page.json`, `templates/collection.json`, `templates/404.liquid`, `templates/cart.liquid`,
  `templates/search.liquid`, `templates/customers/*.liquid`, or any other standard Shopify template
- No Shopify `snippets/` directory at all
- A skeletal `locales/en.default.json` (2 keys — `general.page` and `general.search`)
- A near-empty `config/settings_schema.json` (theme_info only, no merchant-facing settings)

This means **almost every standard Shopify page type will render with Shopify's default fallback
rendering or a blank white page** until templates are created.

---

## Tech Debt

**Hardcoded prices and product data in section fallbacks:**
- Issue: `sections/hero-canvas.liquid` lines 99–176 contain static mock product cards with hardcoded
  Indian Rupee prices (`₹12,499`, `₹7,999`, etc.), hardcoded titles, and broken `/products/mclaren-mcl39`
  hrefs. These display when `collections.all` is empty (the `{% else %}` branch of `{% for product in
  collections.all.products %}`). Any real store launch will silently show this dev-only placeholder data
  unless real products exist.
- Files: `sections/hero-canvas.liquid` lines 97–176
- Impact: Merchants/testers will see fake data; prices are hardcoded in a non-store currency symbol not
  tied to `shop.currency`.
- Fix approach: Remove the `{% else %}` fallback block or replace it with a "no products yet" empty
  state message. Do not ship placeholder hrefs.

**Hardcoded contact information in layout:**
- Issue: `layout/theme.liquid` lines 75–77 contain literal `INFO@PITWALL.STUDIO` and `@PITWALL.STUDIO`
  strings with no Liquid variable or theme setting backing them. Same for the footer copyright
  `© 2026 PITWALL.` on line 120.
- Files: `layout/theme.liquid`
- Impact: Cannot be changed from the Shopify admin without editing theme code.
- Fix approach: Promote these to `config/settings_schema.json` theme settings and reference via
  `{{ settings.contact_email }}` etc.

**`is-active` hardcoded on HOME nav link:**
- Issue: `layout/theme.liquid` line 62 applies `is-active` permanently to the HOME `<li>`, regardless
  of the current page. No dynamic active-page detection.
- Files: `layout/theme.liquid`
- Impact: HOME is always highlighted even when on the product or about page.
- Fix approach: Use `{% if request.page_type == 'index' %}is-active{% endif %}` and equivalents per
  link.

**`pitwall-style.css` vs `pitwall-style.css.liquid` asset mismatch:**
- Issue: `layout/theme.liquid` line 24 loads `pitwall-style.css` (no `.liquid` extension) via
  `asset_url | stylesheet_tag`, but the file on disk is `assets/pitwall-style.css.liquid`.
- Files: `layout/theme.liquid` line 24; `assets/pitwall-style.css.liquid`
- Impact: The stylesheet **will 404 in production** unless Shopify processes the `.liquid` extension
  automatically (it does — Shopify strips `.liquid` from asset filenames). Confirm this works before
  deploying; any Liquid variables inside the CSS file will be rendered, but the filename reference in
  `theme.liquid` must remain `pitwall-style.css` (without `.liquid`). This is technically correct for
  Shopify but is non-obvious and could confuse future editors.
- Fix approach: Add a comment in `theme.liquid` explaining the Shopify `.liquid` asset convention.

**No `shopify.theme.toml` or CLI config file present:**
- Issue: There is no `shopify.theme.toml` (Shopify CLI 3.x config) in the repo root. The Shopify CLI
  needs this file to know which store and theme to push to.
- Files: repo root (absent)
- Impact: First-time `shopify theme push` will require interactive prompts; CI/CD pipelines cannot be
  scripted without it.
- Fix approach: Run `shopify theme init` or manually create `shopify.theme.toml` with the correct
  store URL and theme ID.

**`src/` directory and build artefacts both committed (or expected to be):**
- Issue: `.shopifyignore` correctly excludes `src/`, `node_modules/`, and build tooling from Shopify
  CLI pushes. However `assets/pitwall-interactive.js` (the compiled bundle, ~83 000 tokens / large)
  must be committed and pushed since Shopify has no build step. This means the compiled JS must always
  be kept in sync with `src/` manually via `npm run build` before every push.
- Files: `assets/pitwall-interactive.js`, `src/`
- Impact: Risk of pushing stale compiled JS if a developer edits `src/` and forgets to rebuild. No CI
  enforces a build-before-push step.
- Fix approach: Add a `pre-push` git hook or GitHub Actions workflow that runs `npm run build` and
  fails if `assets/pitwall-interactive.js` has uncommitted changes afterward.

---

## Missing Critical Features (Blocks Adding New Pages)

**No `templates/page.json` exists:**
- Problem: The About page (`/pages/about`) is already linked in the nav (`layout/theme.liquid` line 69)
  and footer (line 114), and in the hero section CTA (`sections/hero-canvas.liquid` line 200). But
  there is no `templates/page.json` template. Shopify will serve a blank/unstyled page for any
  `/pages/*` URL until this template exists.
- Blocks: Adding the About page.
- Files: `templates/` (absent)
- Fix approach: Create `templates/page.json` referencing a new `sections/page-content.liquid` section.

**No `templates/collection.json` exists:**
- Problem: The "All Products" page at `/collections/all` is linked in nav (`layout/theme.liquid`
  line 66) and footer (line 112), but there is no `templates/collection.json`. Shopify will render a
  default unstyled collection page.
- Blocks: Adding a styled All Products page.
- Files: `templates/` (absent)
- Fix approach: Create `templates/collection.json` referencing a new
  `sections/collection-products.liquid` section.

**No `templates/cart.liquid` or `templates/cart.json`:**
- Problem: The cart button in the nav (`layout/theme.liquid` line 52) uses
  `onclick="location.href='/cart'"` but no cart template exists. Shopify will show an unstyled default.
- Blocks: A complete shopping experience.

**No `templates/404.liquid`:**
- Problem: Broken URLs will show Shopify's generic 404.

---

## Fragile Areas

**React bundle is a single monolithic file with no code splitting:**
- Files: `assets/pitwall-interactive.js` (compiled from `src/`)
- Why fragile: The entire React + Three.js + Motion + Lucide bundle loads on every page — including
  pages that use none of it (e.g., a future About page). `vite.config.ts` explicitly disables chunk
  splitting via `chunkFileNames` and forces a single `pitwall-interactive.js` output.
- Impact: Three.js GLB model loading code and all scrollytelling JS runs on the About page even though
  it will never be used there. Page weight is significant (Three.js alone is ~600 KB minified).
- Safe modification: Adding new React mounts (for new pages) requires editing `src/main.tsx` and
  rebuilding; new DOM element IDs must be unique across all pages.

**`product-detail.liquid` is entirely a React mount point with no SSR/fallback:**
- Files: `sections/product-detail.liquid`
- Why fragile: The entire product page is a single `<div id="product-scrollytelling-root">` that
  renders only when React hydrates. If JS fails or is slow, users see only the "CALIBRATING IMMERSIVE
  CHASSIS..." loader indefinitely. There is no `<noscript>` fallback, no server-rendered product
  content, no add-to-cart form outside React.
- Impact: Product pages are entirely non-functional without JavaScript. SEO crawlers that don't
  execute JS will see no product content.

**`product-detail.liquid` hardcodes 4 specific GLB model URLs:**
- Files: `sections/product-detail.liquid` lines 7–10
- Why fragile: `data-mclaren-url`, `data-redbull-url`, `data-ferrari-url`, `data-mercedes-url` are
  always injected regardless of which product is being viewed. The React component
  (`src/components/ProductScrollytelling.tsx`) presumably picks which model to show based on product
  handle or title — this logic is inside the black-box compiled bundle. Adding a 5th team/model
  requires editing both the section Liquid and the React component + rebuilding.

**Navigation menu `is-active` state is static HTML:**
- Files: `layout/theme.liquid` lines 61–73
- Why fragile: Adding new pages requires manually editing the nav list in `layout/theme.liquid`. There
  is no dynamic menu driven by a Shopify navigation link list (which could be managed in the admin).

**Video playlist parsing uses a brittle single-quote-to-double-quote replace:**
- Files: `src/main.tsx` lines 87–88
- Why fragile: `JSON.parse(dataPlaylist.replace(/'/g, '"'))` will break if any URL contains an
  apostrophe or single quote. The Liquid template (`sections/hero-canvas.liquid` lines 9–12) already
  uses single-quoted strings inside the `data-video-playlist` attribute — a URL with a `'` character
  would silently fall back to hardcoded `/video/` paths that do not exist in the Shopify CDN.

---

## Security Considerations

**`onclick="location.href=..."` inline JS on interactive elements:**
- Risk: Cart button and "SHOP NOW" footer button use inline `onclick` handlers in `layout/theme.liquid`
  lines 52 and 99. This is a minor CSP (Content Security Policy) concern; Shopify's default CSP
  headers may flag or block inline handlers in future.
- Files: `layout/theme.liquid`
- Recommendation: Replace with standard `<a href="...">` elements or move handlers to
  `pitwall-interactive.js`.

**`data-product-variants-json` passes raw Shopify JSON into a DOM attribute:**
- Risk: `sections/product-detail.liquid` line 6 puts `{{ product.variants | json }}` directly into a
  `data-*` attribute without HTML-escaping the JSON. If a variant title contains `'` or `"` characters
  this could break the attribute value. The Liquid `json` filter does produce valid JSON but the
  attribute value is not HTML-attribute-escaped.
- Files: `sections/product-detail.liquid` line 6
- Recommendation: Use `| json | escape` to double-encode the JSON value safely inside the HTML
  attribute: `data-product-variants-json='{{ product.variants | json | escape }}'`.

---

## Performance Bottlenecks

**All 4 GLB 3D model files load on the product page regardless of which product is viewed:**
- Files: `sections/product-detail.liquid` lines 7–10; `assets/mclaren.glb`, `assets/ferrari.glb`,
  `assets/redbull.glb`, `assets/mercedes.glb`
- Cause: All 4 model URLs are injected into the DOM; the React component likely lazy-loads only the
  active one, but all 4 URLs are available to it from page load.
- Impact: Potential for unnecessary prefetch/preload depending on component implementation.

**Multiple large video files in `assets/`:**
- Files: `assets/*.mp4` (5 video files)
- Cause: Videos are served from the Shopify CDN asset pipeline, which is appropriate, but they are
  large binary files committed to the theme repo. `git clone` will be slow.

**Single monolithic JS bundle includes Three.js on every page:**
- See "Fragile Areas" above. ~600 KB+ JS parse cost on every page including future About and
  Collections pages that need none of it.
  
---

## Deployment Risks

**`npm run build` must be run and output committed before every `shopify theme push`:**
- No automated enforcement. A developer pushing without rebuilding will deploy stale JS.

**No `shopify.theme.toml` means first push requires interactive CLI setup:**
- Running `shopify theme push` without a config file will prompt for store and theme selection.
  In a CI environment this blocks non-interactively.

**`.shopifyignore` excludes build tooling correctly but not `postcss.config.js` or `tailwind.config.js`:**
- Files: `.shopifyignore`
- These config files will be pushed to Shopify by `shopify theme push` (they are not in
  `.shopifyignore`). They are harmless but unnecessary in the deployed theme. Recommend adding them
  to `.shopifyignore`.

**`assets/main.css` is the compiled Tailwind output — it must also be rebuilt before push:**
- Tailwind is not in the Vite build pipeline (Vite's `build` script does not invoke Tailwind via
  PostCSS based on the config). If `src/index.css` uses Tailwind directives, `main.css` needs a
  separate `npx tailwindcss` compile step. The current `package.json` has no `build:css` script.
- Files: `package.json`, `postcss.config.js`, `assets/main.css`
- Risk: Tailwind CSS changes in `src/index.css` will not be reflected in `assets/main.css` unless
  the developer runs Tailwind separately. No script automates this.

---

## Test Coverage Gaps

**No tests of any kind exist:**
- What's not tested: All React components, Liquid template logic, JS interaction handlers
- Files: entire `src/` directory; `sections/`
- Risk: Regressions in the bundle (nav, video, mute, cart counter, product scrollytelling) are caught
  only by manual review
- Priority: Medium (pre-launch acceptable; critical before scaling development team)

---

## Risks Specific to Adding About + All Products Pages

**About Page (`/pages/about`):**
1. `templates/page.json` does not exist — must be created.
2. A `sections/page-content.liquid` (or similar) section must be created and registered.
3. The page will load `pitwall-interactive.js` in full (Three.js + all product models) even though none
   of that is needed. The nav, footer grain overlay, and scroll handler will mount correctly from
   `theme.liquid`, but the `DOMContentLoaded` mounts in `src/main.tsx` will all no-op gracefully since
   their target IDs won't be present on the page.
4. The nav `is-active` class on HOME will still be lit on the About page (cosmetic bug).

**All Products Page (`/collections/all`):**
1. `templates/collection.json` does not exist — must be created.
2. A `sections/collection-products.liquid` section must be created.
3. If using hardcoded/placeholder products (as specified), the section will need a `{% for product in
   collection.products %}` loop with an `{% else %}` fallback containing the placeholder data — the
   same pattern already used in `hero-canvas.liquid`.
4. The same `is-active` nav bug applies.
5. `collections.all` is already used in `hero-canvas.liquid` — it will work as a Liquid object in
   a collection template with no extra setup.

---

*Concerns audit: 2026-05-30*
