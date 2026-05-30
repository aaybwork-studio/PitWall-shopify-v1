# Phase 1: About Page - Context

**Gathered:** 2026-05-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Visiting `/pages/about` renders a custom, shippable About page that is unmistakably Pitwall. The page must deliver the editorial reference composition using the existing brutalist design system and tokens (colors, fonts, zero-radius, grain overlay).

</domain>

<decisions>
## Implementation Decisions

### Desktop Layout & Grid Details
- **D-01 (Grid Split):** Desktop layout features a clean **40% left / 60% right** two-column split.
- **D-02 (Left Feature Image):** The left column displays a prominent **3:4 portrait feature image** wrapped in a solid brutalist border (`1px solid var(--fg)`).
- **D-03 (Right Stacks):** The right column organizes content into vertical stacks: **ABOUT**, **CREDITS**, and **CONTACT**.
- **D-04 (Technical Indexes):** Each vertical stack starts with an IBM Plex Mono technical index label (e.g. `// 01 ABOUT`, `// 02 CREDITS`, `// 03 CONTACT`) and a bold divider line (`border-top: 1px solid var(--fg)`), matching Pitwall's technical editorial visual language.
- **D-05 (Mobile Responsiveness):** Swaps to a single-column layout on viewports below `767px` breakpoint, with mobile padding adjusted from `100px` to `20px` and the image scaling dynamically.

### Faded Background Wordmark Styling
- **D-06 (Display Font):** A massive uppercase wordmark **"PITWALL"** is rendered behind the text container using the Syne display font (`font-family: var(--font-display)`).
- **D-07 (Styling & Opacity):** Set to an extremely faint **0.03 opacity** using the `var(--fg)` carbon-black color to act as a watermark that doesn't compromise body text readability.
- **D-08 (Scroll Behavior):** The watermark is absolutely positioned relative to the right-hand text container, allowing it to scroll naturally with the page rather than being fixed.

### Shopify Schema Settings
- **D-09 (Editable Customizer Fields):** The `sections/page-about.liquid` section includes customizer schema controls to let merchants edit the following content dynamically:
  - **Feature Image:** (`image_picker`) for the left column.
  - **About Section:** Text/RichText fields for the main story headline and paragraphs.
  - **Credits Section:** Structured customizer settings or block structures to manage contributors.
  - **Contact Section:** Form fields for Email address, Instagram handle, and other social profiles (rendered with an accent-yellow `#F6C917` hover state).
  - **Background Wordmark:** Text field to customize the watermark string.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Brand & Design Rules
- [.planning/PROJECT.md](file:///.planning/PROJECT.md) — Base project constraints, design tokens, color palette, and font systems.
- [.planning/codebase/CONVENTIONS.md](file:///.planning/codebase/CONVENTIONS.md) — Layout tokens, spacing (100px desktop / 20px mobile padding), and BEM class patterns.
- [.planning/REQUIREMENTS.md](file:///.planning/REQUIREMENTS.md) §v1 — Core milestone requirements (FND-01 through NAV-02).

### Codebase Structure
- [.planning/codebase/STRUCTURE.md](file:///.planning/codebase/STRUCTURE.md) — Information on how custom templates and sections map to routes and the Shopify Online Store layout.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `assets/pitwall-style.css.liquid` — Loaded globally, contains core CSS variables (`--bg`, `--fg`, `--accent`, `--surface`, etc.), typography class mappings (`.font-display-strict`, `.font-body-strict`, `.font-technical-strict`), and BEM layout styles.
- `layout/theme.liquid` — Global template document frame that loads the style bundles and renders the header nav overlay where the `ABOUT` link points to `/pages/about`.

### Established Patterns
- **Brutalist reset:** Global border-radius set to `0px !important`, no shadows.
- **Persistent grain overlay:** An SVG noise overlay positioned fixed over all contents.
- **Accent yellow hover signal:** All text link hovers resolve to `var(--accent)` (`#F6C917`).

### Integration Points
- Create new section at `sections/page-about.liquid` which holds the HTML structure, local BEM styling, and schema.
- Create JSON template at `templates/page.about.json` declaring `sections` with a single block pointing to our `page-about` section.

</code_context>

<specifics>
## Specific Ideas
- Styling for links: Use `transition: color 200ms ease` with hover class setting color to `var(--accent)`.

</specifics>

<deferred>
## Deferred Ideas
- **Phase 2: All Products Page** — Shop-all layout at `/collections/all` with dynamic collections-based grid, deferred to the next phase.

</deferred>

---

*Phase: 1-About Page*
*Context gathered: 2026-05-31*
