# Coding Conventions

**Analysis Date:** 2026-06-19

---

## Brand / Design Tokens

All UI pages and components must follow these tokens exactly.

### Color Palette

Tokens are declared in `src/index.css` and mapped to Tailwind colors. They switch dynamically based on the `html.dark-mode` class selector.

| Token | Light Value | Dark Value | CSS Var | Role |
|-------|-------------|------------|---------|------|
| Background | `#EDEBE5` | `#0C0C0C` | `var(--background)` / `var(--bg)` | Page background |
| Foreground | `#0C0C0C` | `#EDEBE5` | `var(--foreground)` / `var(--fg)` | Primary text, header links |
| Racing Yellow | `#F6C917` | `#F6C917` | `var(--accent)` | Interaction highlight, CTA buttons, active badges, scrollbars |
| Surface 1 | `#F5F4F0` | `#1A1A1A` | `var(--surface)` | Card/dropdown container backgrounds |
| Surface 2 | `#E5E3DD` | `#242424` | `var(--surface-2)` | Borders, scrollbar thumbs |
| Border | `rgba(12,12,12,0.1)` | `rgba(237,235,229,0.1)` | `var(--border)` | Subtle line dividers |
| Muted | `rgba(12,12,12,0.5)` | `rgba(237,235,229,0.5)` | `var(--muted)` | Sublabels, secondary paragraph text |

**Custom Homepage Variables:**
- `--pw-bg` (`#EDEBE5` / `#0F0C09` in dark mode)
- `--pw-bg2` (`#E5E3DD` / `#140F0B` in dark mode)
- `--pw-gold` (`#E8B93B`)
- `--pw-text` (`#0C0C0C` / `#EDE8E0` in dark mode)
- `--pw-border` (rgba border overlays)

**Rule:** Never write raw Hex/RGB colors in component files. Always access through Tailwind variables (`bg-background`, `text-brand-red` etc.) or CSS variables (`var(--accent)`).

### Typography

Google Fonts are loaded dynamically in `src/index.css`.

| Role | Family | Weights | CSS Var | Tailwind Class |
|------|--------|---------|---------|----------------|
| Display / Titles | Syne | 700, 800 | `var(--font-display)` | `font-display` |
| Body Prose | Inter | 300, 400, 500, 600 | `var(--font-body)` | `font-body` |
| Technical / Labels | IBM Plex Mono | 400, 600 | `var(--font-mono)` | `font-mono` |
| Secondary Logotypes | BTSE PS2 (Local) | normal | `var(--font-branding)` | - |
| Calligraphic accents | Alex Brush, Dancing Script, Cormorant Garamond | normal | `var(--font-manifesto)` | - |

**Common Text CSS Classes:**
```css
/* Brutalist display title */
.font-display-strict {
  font-family: var(--font-display), sans-serif;
  font-weight: 800;
  letter-spacing: 0.06em;
  line-height: 0.88;
}

/* Light readability body */
.font-body-strict {
  font-family: var(--font-body), sans-serif;
  font-weight: 300;
  letter-spacing: 0;
  line-height: 1.65;
}

/* Mono Technical text */
.font-technical-strict {
  font-family: var(--font-mono), monospace;
  font-weight: 400;
  letter-spacing: 0.08em;
}
```

**React Typography Components (`src/components/Typography.tsx`):**
Use `<Display>`, `<Body>`, and `<Technical>` wrappers to render structured text with correct styling properties.

---

## Coding Patterns

### JavaScript & React
1. **No direct console logs:** Use `Logger.info()`, `Logger.warn()`, `Logger.error()` from `src/utils/logger.ts` for clean output tracing.
2. **Explicit Typings:** Do not use `any`. Always specify strict interfaces for React component props (e.g. `HomepageScrollytellingProps`).
3. **TypeScript Strict Rules:** The compiler operates under `noUnusedLocals` and `noUnusedParameters`. Any parameters declared but unused (like leftover schema properties) must be void-referenced (`void stat1Value;`) to satisfy linter checks rather than triggering build failures.
4. **Motion-React Animations:** Use Framer Motion/Motion for smooth scroll transformations, panel scales, and viewport fades. Ease values: `cubic-bezier(0.16, 1, 0.3, 1)` or standard springs.

### Shopify templates
1. **React Island parameters:** Pass JSON objects securely using:
   `data-my-json='{{ product.variants | json | escape }}'` (always escape JSON to prevent quoting syntax issues).
2. **Theme schema:** Define theme schema settings block at the bottom of Liquid sections in title-case for merchant editing.
3. **No Tailwind utilities in Liquid:** Keep classes inside `.liquid` files to standard BEM conventions. Let Tailwind compile only from React files or specific section selectors.

---

*Convention analysis: 2026-06-19*
