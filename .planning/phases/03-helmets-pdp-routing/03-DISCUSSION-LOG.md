# Phase 3: Helmets PDP & Dynamic Routing - Discussion Log

> **Date:** 2026-05-31
> **Phase:** 3-Helmets PDP & Dynamic Routing
> **Areas discussed:** Navigation Switching, Switcher Button Scope

---

## Switcher Button Navigation Style

| Option | Description | Selected |
|--------|-------------|----------|
| **Option A (Recommended)** | Zero-lag HTML5 History API (updates WebGL model and details instantly without page reload, changes browser URL) | ✓ |
| **Option B** | Standard Shopify page reload redirection (window.location.href to the product URL) | |

**User's choice:** Option A (Recommended): Zero-lag HTML5 History API
**Notes:** User preferred the zero-lag interaction where clicking buttons instantly shifts the WebGL view and specs without tab reloads, updating URLs silently using `history.pushState`.

---

## Switcher Button Scope

| Option | Description | Selected |
|--------|-------------|----------|
| **Option A (Recommended)** | Contextual Switcher (cars show cars, helmets show helmets) | ✓ |
| **Option B** | Universal Switcher (unified row showing all cars and helmets together) | |

**User's choice:** Option A (Recommended): Contextual Switcher (cars show cars, helmets show helmets)
**Notes:** User chose the contextual selector so that F1 cars let users switch between car teams, and F1 Helmet pages switch between helmets.

---

## the agent's Discretion

- Three.js camera offsets and zoom scaling specific to helmets.
- Staggered loop distribution for separating cars and helmets.
