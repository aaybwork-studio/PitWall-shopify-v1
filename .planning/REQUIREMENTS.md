# Requirements: Pitwall Shopify Theme — About & All Products Pages

**Defined:** 2026-05-30
**Core Value:** The two new pages must look unmistakably Pitwall (its brutalist F1 aesthetic + existing tokens) while delivering the editorial structure of the reference designs.

## v1 Requirements

### Foundation

- [ ] **FND-01**: New page sections reuse existing Pitwall design tokens (colors, fonts, spacing) via CSS vars / BEM classes — no raw hex, no new colors
- [ ] **FND-02**: New sections preserve the global design language (zero border-radius, grain overlay intact, full-bleed layout) and render correctly inside `layout/theme.liquid`
- [ ] **FND-03**: New pages are responsive — single-column below the 767px mobile breakpoint, desktop padding at 100px, mobile at 20px

### About Page

- [ ] **ABT-01**: Visiting `/pages/about` renders a custom About page via a new section + `templates/page.about.json`
- [ ] **ABT-02**: About page presents a large feature image on the left and labelled text columns on the right (About / Credits / Contact), matching the editorial reference composition
- [ ] **ABT-03**: About page shows a large faded background brand wordmark behind the content, in Pitwall style
- [ ] **ABT-04**: About page text content (paragraphs, credits, contact links, image) is editable via the section's `{% schema %}` settings, with placeholder defaults
- [ ] **ABT-05**: Contact links (email, social) render as styled outbound links consistent with brand interaction states (accent-yellow hover)

### All Products Page

- [ ] **APL-01**: Visiting `/collections/all` renders the new All Products page via a new section + collection/page template wired to the existing SHOP button route
- [ ] **APL-02**: Page shows a top label row (e.g. "ALL PRODUCTS" + collection/season label) above a clean product grid, matching the shop-all reference composition
- [ ] **APL-03**: Product grid is a multi-column responsive grid; each card shows product image, product name, and price beneath it
- [ ] **APL-04**: Cards support an optional tag/badge (e.g. "PRE-ORDER") rendered in Pitwall style
- [ ] **APL-05**: Grid is populated with hardcoded/placeholder products using the existing `collections.all.products`-with-static-fallback pattern, so it renders without a live catalog

### Navigation Wiring

- [ ] **NAV-01**: Existing header MENU→SHOP and footer SHOP NOW buttons confirmed to land on the new All Products page at `/collections/all`
- [ ] **NAV-02**: Existing header/footer ABOUT links confirmed to land on the new About page at `/pages/about`

## v2 Requirements

### Catalog

- **CAT-01**: All Products grid populated from real Shopify product/collection data
- **CAT-02**: Per-product detail links from grid cards into product pages

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real product/catalog data | Deferred to v2; placeholder products this milestone |
| Cart / checkout behavior | Handled by Shopify core, not part of this build |
| Editing oddritualgolf.com | odd ritual is a design reference only |
| Standalone (non-Shopify) web app | Rejected; must be native Liquid theme files |
| Redesign of existing home/product pages | Only the two new pages are in scope |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01 | Phase 1 | Pending |
| FND-02 | Phase 1 | Pending |
| FND-03 | Phase 1 | Pending |
| ABT-01 | Phase 1 | Pending |
| ABT-02 | Phase 1 | Pending |
| ABT-03 | Phase 1 | Pending |
| ABT-04 | Phase 1 | Pending |
| ABT-05 | Phase 1 | Pending |
| NAV-02 | Phase 1 | Pending |
| APL-01 | Phase 2 | Pending |
| APL-02 | Phase 2 | Pending |
| APL-03 | Phase 2 | Pending |
| APL-04 | Phase 2 | Pending |
| APL-05 | Phase 2 | Pending |
| NAV-01 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 15 total (FND x3, ABT x5, APL x5, NAV x2)
- Mapped to phases: 15/15
- Unmapped: 0

---
*Requirements defined: 2026-05-30*
*Last updated: 2026-05-30 — traceability populated by roadmapper*
