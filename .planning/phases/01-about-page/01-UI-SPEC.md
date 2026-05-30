# Phase 1: About Page — UI Design Contract

**Status:** Approved
**Design Theme:** Brutalist F1 Technical Editorial

## 1. Visual Aesthetics & Design System
All implemented components MUST strictly conform to the Pitwall design system:
- **Background Color:** `#EDEBE5` (`var(--bg)` / `bg-background`).
- **Foreground/Border Color:** `#0C0C0C` (`var(--fg)` / `text-foreground` / `border-[#0C0C0C]`).
- **Accent Color (Racing Yellow):** `#F6C917` (`var(--accent)` / `bg-brand-red` / `text-brand-red`).
- **Typography:**
  - Display / Headlines: **Syne** (700/800 bold, all uppercase, tight line-height).
  - Body Copy: **Barlow** (300/400 light-regular, sentence case).
  - Technical / Mono / Labels: **IBM Plex Mono** (400/600, all uppercase, letter-spaced, prefixed with `// `).
- **Border Radius:** `0px !important` for all buttons, containers, and images.
- **Grain Overlay:** Must remain fully intact and visible globally.

---

## 2. Desktop Layout (Grid & Composition)
Desktop viewport utilizes a asymmetric split grid layout matching the editorial reference:
- **Columns:** `grid grid-cols-12 gap-10` desktop layout (40% / 60% relative split).
  - **Left Column (Image Box):** Spans 5 columns (`col-span-5` / ~40% width).
  - **Right Column (Editorial Stack):** Spans 7 columns (`col-span-7` / ~60% width).
- **Left Column (Featured Image):**
  - Standard **3:4 portrait aspect ratio** (`aspect-[3/4]`).
  - Wrapped in a crisp solid border: `border border-[#0C0C0C]`.
  - Image behaves responsively, scaling dynamically using `object-cover w-full h-full`.
- **Right Column (Vertical Editorial Content):**
  - Top padding offsets the fixed navigation header (`pt-16` / `64px` height).
  - Stacked vertically with clean, bold spacing (`flex flex-col gap-12` or similar).
  - Contains three content sections:
    1. **// 01 ABOUT**
    2. **// 02 CREDITS**
    3. **// 03 CONTACT**
  - **Dividers:** Each section starts with a crisp top border (`border-t border-[#0C0C0C]`) and dynamic padding (`pt-6`).
  - **Labels:** Technical index tags in `font-mono text-xs uppercase tracking-wider text-[#0C0C0C]/60 mb-4`.
  - **Content Copy:** Highly readable Barlow body paragraphs, styled using `text-[#0C0C0C]/80 leading-relaxed font-light`.

---

## 3. Dynamic Watermark Background
A premium display wordmark adds depth to the editorial layout:
- **Text:** "PITWALL".
- **Styling:**
  - Massive display size (`text-[10vw]` or similar, all uppercase).
  - Font: **Syne** (`font-display-strict` / `font-bold`).
  - Color: Carbon Black `var(--fg)`.
  - Opacity: Extremely faint `0.03` (`opacity-[0.03]`).
- **Positioning:** Absolutely positioned inside the right-hand text column (`absolute bottom-0 right-0 -z-10`), overflowing slightly off-canvas to act as a watermark.
- **Behavior:** Scrolls naturally with the container text.

---

## 4. Interaction States & Transitions
- **CTAs & Outbound Links:** Email and social links inside the **CONTACT** section render as technical list rows or clear text links.
- **Hover Transition:** On mouseenter, transition from `var(--fg)` to Racing Yellow `var(--accent)` (`#F6C917`).
- **CSS Transition:** `transition-colors duration-200 ease-in-out` on all interactive links.

---

## 5. Mobile Responsiveness
- **Breakpoint:** Under `767px` viewport width, the grid collapses to a single column (`grid-cols-1`).
- **Layout Order:** Feature image scales to full-width at the top, followed by the content columns stacked vertically beneath it.
- **Padding Adjustments:** Horizontal page padding scales down from `100px` (desktop) to `20px` (mobile).

---

## 6. Section Schema Controls (Merchant Customizer)
To satisfy requirements for editable fields (`ABT-04`), the section `{% schema %}` must expose:
- `image_picker` for the feature image.
- `text` setting for the main title / header.
- `richtext` setting for the about narrative.
- Custom list/text block settings for credits items and contact details.

---

*Phase 1: About Page UI Spec*
*Generated: 2026-05-31*
