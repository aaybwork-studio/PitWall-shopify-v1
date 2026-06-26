---
phase: 05-navbar-redesign-team-driver-visual-dropdowns-landing-pages
reviewed: 2026-06-26T00:00:00Z
depth: standard
files_reviewed: 11
files_reviewed_list:
  - layout/theme.liquid
  - sections/collection-driver.liquid
  - sections/collection-team.liquid
  - sections/header-nav.liquid
  - src/components/CollectionGrid.tsx
  - src/components/DriverLandingPage.tsx
  - src/components/TeamLandingPage.tsx
  - src/index.css
  - src/main.tsx
  - templates/collection.driver.json
  - templates/collection.team.json
findings:
  critical: 1
  warning: 6
  info: 5
  total: 12
status: issues_found
---

# Phase 05: Code Review Report

**Reviewed:** 2026-06-26T00:00:00Z
**Depth:** standard
**Files Reviewed:** 11
**Status:** issues_found

## Summary

This phase adds a redesigned navbar with visual mega-menu dropdowns for drivers/teams, plus dedicated driver/team landing page templates and React components. The overall architecture (Liquid sections feeding `data-*` attributes into React mount points, shared `CollectionCard`/`SortDropdown`/`useUrlSyncedFilter` primitives reused across `CollectionGrid`, `DriverLandingPage`, `TeamLandingPage`) is sound and DRY where it matters.

The main defect found is an unescaped Liquid output that writes a merchant-controlled metafield (`team_link`) directly into an HTML attribute without `| escape`, in contrast to the adjacent `bio` and `team_name` outputs on the same element which are correctly escaped — this is an inconsistency that opens a stored-XSS vector if that metafield is ever editable by a non-trusted role or scraped from an external feed. Beyond that, there are several maintainability issues: dead CSS classes left over from a prior driver-dropdown layout, unused component props, a duplicated `getCleanPrice`/`SORTS` definition across three files, and a `try { JSON.parse(...) } catch {}` pattern in `main.tsx` that silently swallows malformed playlist data without logging (inconsistent with the rest of the file, which logs every other parse failure).

## Critical Issues

### CR-01: Unescaped metafield value injected into HTML attribute (stored XSS vector)

**File:** `sections/collection-driver.liquid:8`
**Issue:** `data-team-link` outputs `collection.metafields.custom.team_link.value` raw, with no `| escape` filter, directly inside a double-quoted HTML attribute:
```liquid
data-team-link="{{ collection.metafields.custom.team_link.value }}"
```
Every other dynamic value on the same root element (`data-bio`, `data-team-name`) is escaped (lines 6–7). If the `team_link` metafield value ever contains a `"` followed by attacker-controlled markup (e.g. via a compromised/staff-error metafield edit, a URL-type metafield misconfigured as text and populated from an external/import source, or a future merchant workflow that allows freer input), it can break out of the attribute and inject arbitrary HTML/JS into the page, since this section is rendered unauthenticated and globally for any visitor to the driver collection page. Even though `url`-type metafields are normally constrained client-side in the admin UI, Liquid template code should not rely on upstream input validation for output safety — defense in depth requires escaping at render time, exactly as the sibling fields already do.
**Fix:**
```liquid
data-team-link="{{ collection.metafields.custom.team_link.value | escape }}"
```
Note: `DriverLandingPage.tsx` consumes this value via `<a href={teamLink}>` (line 80), so after escaping at the Liquid layer, React will correctly decode entities on read — no further change needed downstream.

## Warnings

### WR-01: Unused/dead CSS classes for driver dropdown (leftover from prior layout)

**File:** `src/index.css:592-611`
**Issue:** `.megamenu-driver-col` and `.driver-name-header` are defined but never referenced by any Liquid markup. `header-nav.liquid` (lines 92-131) uses `.megamenu-driver-col-active` / `.megamenu-driver-col-alumni` and `.megamenu-group-label` instead — these are different, correctly-wired classes defined elsewhere (lines 721-738). The `.megamenu-driver-col` / `.driver-name-header` rules are pure dead code from an earlier iteration of the dropdown design.
**Fix:** Remove the dead rules:
```css
/* delete lines 592-611 (.megamenu-driver-col, .driver-name-header, .nav-light-bg .driver-name-header) */
```

### WR-02: `isTall` and `ctaLabel` props declared but never used in `CollectionCard`

**File:** `src/components/CollectionGrid.tsx:18-22`
**Issue:** `CollectionCardProps` declares `isTall?: boolean` and `ctaLabel?: 'CALIBRATE' | 'VIEW'`, but the destructuring on line 22 only pulls `{ product, style, className }` — these two props are silently ignored if passed by a caller, which is misleading (callers may believe setting `ctaLabel="CALIBRATE"` changes the button text on line 77, but it never does; the button is hardcoded to `VIEW`).
**Fix:** Either wire the props through:
```tsx
export function CollectionCard({ product, style, className, ctaLabel = 'VIEW' }: CollectionCardProps) {
  ...
  <div ...>{ctaLabel}</div>
```
or remove the unused props from the interface if they are vestigial.

### WR-03: `getCleanPrice` and `SORTS` duplicated across three files

**File:** `src/components/DriverLandingPage.tsx:4-8`, `src/components/TeamLandingPage.tsx:4-8`, `src/components/CollectionGrid.tsx:124-149`
**Issue:** The `SORTS` array and `getCleanPrice` helper are defined identically in all three files instead of being imported once from `CollectionGrid.tsx` (which already exports `useUrlSyncedFilter`, `CollectionCard`, and `SortDropdown` for reuse). Any future change to price-parsing logic (e.g. handling different currency formats) requires updating three places in lockstep, and they will silently drift if only one is updated.
**Fix:** Export `getCleanPrice` and `SORTS` from `CollectionGrid.tsx` and import them in the two landing page components:
```tsx
// CollectionGrid.tsx
export function getCleanPrice(p: string): number { ... }
export const SORTS = ['Default', 'Price: Low to High', 'Price: High to Low', 'Alphabetical'];

// DriverLandingPage.tsx / TeamLandingPage.tsx
import { Product, CollectionCard, SortDropdown, useUrlSyncedFilter, getCleanPrice, SORTS } from './CollectionGrid';
```

### WR-04: Silent catch swallows malformed video playlist JSON without logging

**File:** `src/main.tsx:181-187, 203-209`
**Issue:** Both video-playlist parse blocks use a bare `catch { ... }` that falls back to a hardcoded playlist with no logging, unlike every other JSON.parse in this file (`collection-products-data`, `fallback-images-data`, `about-content-data`), which call `Logger.error(...)` on failure. If a theme editor misconfigures `data-video-playlist`, this failure is invisible — there's no signal in logs/console that the fallback path was taken, making the bug hard to diagnose in production.
**Fix:**
```tsx
} catch (err) {
  Logger.warn('Failed to parse hero video playlist, using fallback', err);
  playlist = [ ... ];
}
```
(Apply the same change to the separator video playlist block.)

### WR-05: `rowIdx` mismatch can desync `categoryCardIndexPattern` from intended row sequence when categories list changes

**File:** `src/components/CollectionGrid.tsx:392-395, 646-654`
**Issue:** `rowIdx` is computed as `CATEGORIES.indexOf(group.category) - 1`, falling back to `idx` only if that's negative (line 653). Since `categoriesWithProducts` is filtered to remove empty groups (line 561), `idx` (the array position after filtering) and `CATEGORIES.indexOf(...) - 1` (the position in the unfiltered master list) diverge whenever any earlier category in `CATEGORIES` has zero matching products. This means the alternating category-card placement pattern (`[1, 3, 0, 2]`) is keyed to the *unfiltered* category ordering rather than the *rendered* row sequence, which can produce an inconsistent or jarring placement pattern as soon as one category is empty for a given product set — a correctness issue in the intended alternating visual rhythm, not just a cosmetic preference.
**Fix:** Use the post-filter index consistently, e.g. compute `rowIdx` from the row's position in `categoriesWithProducts` rather than mixing two different indexing schemes:
```tsx
{categoriesWithProducts.map((group, idx) => (
  <CollectionRow key={group.category} category={group.category} products={group.products} rowIdx={idx} onCategoryClick={handleCategorySelect} />
))}
```

### WR-06: `nav.classList.add('nav-visible')` runs unconditionally even when `nav` element is absent on some pages, but subsequent listeners assume header always exists without checking section render order

**File:** `src/main.tsx:405-464`
**Issue:** This whole block is correctly guarded by `if (nav) { ... }`, but inside it, `window.addEventListener('pitwall:theme-change' as any, updateNavbarTheme)` is added without ever being removed — there is no corresponding `removeEventListener` and `bootstrap()` itself is idempotency-unsafe (if invoked twice, e.g. by a future Shopify section "reload on save" hot-reload in the theme editor, listeners stack and `showDropdown`/`hideDropdown` closures get bound multiple times to the same DOM nodes). This is a minor robustness gap but is also true of the dropdown hover bindings (lines 327-349) and accordion bindings (lines 383-401) — none of these are guarded against double-invocation.
**Fix:** Not blocking for production storefront use today (Shopify doesn't hot-reload section JS), but worth a guard if theme-editor "design mode" live preview is ever supported:
```tsx
if ((window as any).__pitwallNavBound) return;
(window as any).__pitwallNavBound = true;
```

## Info

### IN-01: `CollectionGrid` `videoUrl` prop accepted but never used

**File:** `src/components/CollectionGrid.tsx:489-495`
**Issue:** `CollectionGridProps.videoUrl` is declared and destructured implicitly via props spread expectations from `main.tsx:218,232` (`data-video-url` is read and passed), but `CollectionGrid` never reads `videoUrl` anywhere in its body — it's accepted and silently dropped.
**Fix:** Remove the prop and the corresponding `data-video-url` plumbing in `main.tsx` if the video hero banner for collection pages was intentionally replaced by the plain header (per the comment on line 575 of `CollectionGrid.tsx`), or wire it in if removal was accidental.

### IN-02: Magic number `64` (header height) duplicated across CSS and TSX without a shared constant

**File:** `src/index.css:345` (`.nav-header { height: 64px; }`), `src/components/CollectionGrid.tsx:595` (`top: 64`), `DriverLandingPage.tsx:107`, `TeamLandingPage.tsx:99`, `src/main.tsx:423`
**Issue:** The fixed navbar height (`64px`) is hardcoded in five separate places. If the navbar height is ever changed, all five must be updated in lockstep or sticky bars will misalign / the homepage light-bg threshold (`window.innerHeight - 64`) will be wrong.
**Fix:** Define a CSS custom property (e.g. `--nav-height: 64px`) in `:root` and reference `var(--nav-height)` everywhere; for the TS comparison in `main.tsx`, read it via `getComputedStyle` once, or duplicate the constant in a single shared TS module.

### IN-03: Driver headshot/team image have no `alt`/fallback for missing metafield image

**File:** `sections/header-nav.liquid:104, 123, 148, 167, 186`
**Issue:** `{{ block.settings.headshot | image_url: width: 200 }}` and `{{ block.settings.team_image | image_url: width: 400 | image_tag }}` render with no `| default:` fallback. If a merchant adds a `driver_item`/`team_item` block without picking an image, `headshot` resolves to blank/nil and the `<img src="">` either 404s or (in some browsers) re-requests the current page. Not exploitable, but a visible breakage for an easy-to-make content-editor mistake.
**Fix:** Add a fallback image or conditionally render:
```liquid
{% if block.settings.headshot %}
  <img src="{{ block.settings.headshot | image_url: width: 200 }}" ... />
{% else %}
  <div class="driver-headshot-placeholder"></div>
{% endif %}
```

### IN-04: Duplicate `category` data hardcoded in two places (`F1_PRODUCTS` array + `CATEGORIES` list) with no shared validation

**File:** `src/components/CollectionGrid.tsx:85-125`
**Issue:** Category strings used in the `category:` field of each `F1_PRODUCTS` entry (e.g. `'WLED Light Boxes'`) must exactly string-match an entry in the `CATEGORIES` array (line 124) for filtering/grouping to work (`p.category?.toLowerCase() === cat.toLowerCase()` on line 542). There's no compile-time guarantee of this — a typo in either list silently drops products from all rows with no error.
**Fix:** Derive `CATEGORIES` from `F1_PRODUCTS` at build time, or type `category` as a union of the `CATEGORIES` literal values so TypeScript catches mismatches:
```tsx
const CATEGORIES = ['All', 'WLED Light Boxes', ...] as const;
type Category = typeof CATEGORIES[number];
```

### IN-05: `collection-driver.liquid` / `collection-team.liquid` product JSON block duplicated verbatim

**File:** `sections/collection-driver.liquid:11-27`, `sections/collection-team.liquid:10-26`
**Issue:** The `<script id="collection-products-data">` Liquid block that serializes `target_collection.products` into JSON is byte-for-byte identical in both sections. Liquid doesn't support true includes-with-output-capture the same way, but this could be extracted into a `{% render 'collection-products-json' %}` snippet to avoid drift if the product schema changes later.
**Fix:**
```liquid
{% render 'collection-products-json', collection: collection %}
```
with the shared logic moved into `snippets/collection-products-json.liquid`.

---

_Reviewed: 2026-06-26T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
