# Phase 3: Helmets PDP & Dynamic Routing — UI Design Contract

**Status:** Approved
**Design Theme:** Brutalist F1 Technical Editorial

## 1. Visual Aesthetics & Design System
All visual assets, typography, and controls MUST strictly adhere to the Pitwall design tokens:
- **Background Color:** `#EDEBE5` (`var(--bg)` / `bg-background`).
- **Foreground/Border Color:** `#0C0C0C` (`var(--fg)` / `text-foreground` / `border-[#0C0C0C]`).
- **Accent Color (Racing Yellow):** `#F6C917` (`var(--accent)` / `bg-brand-red` / `text-brand-red`).
- **Typography:**
  - Display / Headlines: **Syne** (700/800 bold, all uppercase, tight line-height).
  - Body Copy: **Barlow** (300/400 light-regular, sentence case).
  - Technical / Mono / Labels: **IBM Plex Mono** (400/600, all uppercase, letter-spaced).
- **Border Radius:** `0px !important`.

---

## 2. Product Detail Page (PDP) Layout & Switcher
The scrollytelling flagship PDP supports both Cars and Helmets:
- **Header Navigation Buttons (Chassis Configurator):**
  - Displays as a row of technical, border-separated buttons at the bottom of the sticky WebGL viewport (`absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-3 pointer-events-auto`).
  - **Interaction Style (HTML5 History API):**
    - Clicking a switcher button instantly loads the corresponding WebGL model and updates specifications / pricing without page refreshes.
    - Synchronously calls `window.history.pushState(null, '', '/products/' + targetHandle)` to update the browser address bar.
  - **Contextual Switcher Button Rows:**
    - **Cars PDP:** Shows 4 buttons: `MCLAREN-MCL39`, `REDBULL-RB19`, `FERRARI-SF23`, `MERCEDES-W14`.
    - **Helmets PDP:** Shows 2 buttons: `LANDO-NORRIS-HELMET`, `SCHUMACHER-HELMET`.

---

## 3. Three.js Helmet Canvas Rendering
The `CarCanvas.tsx` (Three.js chassis renderer) is extended to render F1 Helmet `.glb` models:
- **Helmets Assets:**
  - Lando Norris Helmet: `f1_helmet_lando_norris.glb` ( McLaren Orange accent ).
  - Michael Schumacher 2002 Helmet: `michael_schumacher_2002_helmet.glb` ( Scuderia Crimson accent ).
- **WebGL Geometry Fit:**
  - Detects if the loaded asset is a helmet based on the file name.
  - Adjusts camera field-of-view (FOV), focal length, position offsets, and spherical auto-rotations so the round vertical volume of helmets displays beautifully without stretching or rendering off-center.
  - Sets custom spot/ambient lighting highlighting carbon fibers.

---

## 4. Technical Specs Sheets
The slide-in telemetry spec panel organizes helmet data using BEM columns:
- **Telemetry Specs:**
  - autographed details, autocalibrated pieces, and composite carbon weights.
- **Sizes & Scales Selector:**
  - Autocalibrates between two premium scales:
    - **1:2 Scale (Half Scale):** `130mm x 165mm x 125mm`, Weight: `480g`, Price: `₹7,999`.
    - **1:1 Scale (Full Scale):** `260mm x 330mm x 250mm`, Weight: `1,600g`, Price: `₹45,999`.

---

## 5. Staggered Catalog updates (All Products)
The collections staggered showcase at `/collections/all` is updated:
- Grouped products are separated into individual cards:
  - **Cars cards:** McLaren MCL39, Red Bull RB19, Ferrari SF-23, Mercedes W14.
  - **Helmets cards:** Lando Norris Helmet, Schumacher 2002 Helmet.
- Loops through products in repeating staggered cycles of 4 (Staggered A, B, C, D shapes) as specified in `02-UI-SPEC.md`, linking directly to each unique product route.

---

*Phase 3: Helmets PDP & Dynamic Routing UI Spec*
*Generated: 2026-05-31*
