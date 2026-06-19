# Codebase Concerns

**Analysis Date:** 2026-06-19

---

## Technical Debt & Fragile Areas

**Monolithic React + WebGL Asset Delivery:**
- Issue: All React components, Three.js libraries, and custom scroll state machines compile into a single bundle `assets/pitwall-interactive.js`. This bundle is loaded unconditionally in `layout/theme.liquid`, which means every page (including lightweight Liquid-only editorial pages) pays the file size (~600KB+ minified/gzipped) and execution parse cost of Three.js.
- Impact: Increased initial load time and resource usage on pages that do not render 3D scenes.
- Fix: Implement code splitting or route-based dynamic imports, or restrict script loading in `theme.liquid` using page templates checks (`{% if template contains 'product' or template == 'index' %}`).

**Committed Build Outputs:**
- Issue: Shopify does not support a native compilation step (no Node build step in Shopify CDN). Therefore, compiled outputs `assets/pitwall-interactive.js` and `assets/main.css` must be built locally and checked into Git.
- Risk: Stale builds. If developers update `src/` but forget to run `npm run build` before pushing via Shopify CLI, production will deploy outdated assets.

**WebGL Canvas Fallbacks:**
- Issue: Immersive pages (like the Three.js Product Scrollytelling PDP) are client-side rendered inside React roots. If a browser disables JavaScript, is slow, or WebGL fails to initialize (due to driver issues), the user is permanently locked out of the page content showing only a static brutalist "CALIBRATING IMMERSIVE CHASSIS..." text.
- Impact: Poor accessibility and zero SEO indexation for WebGL-heavy areas.
- Fix: Implement fallback HTML forms and server-rendered product descriptions within `<noscript>` blocks, allowing the page to remain purchasable even without JavaScript.

**Large Binaries in Repository:**
- Issue: The repository stores multiple large video reels (`.mp4`) and complex high-poly 3D models (`.glb`) directly under `assets/` to serve them from the Shopify CDN.
- Impact: Cloned repository size is large (~150MB+), which slows down development setup and remote pushes.
- Fix: Host video media on dedicated external CDNs (like Vimeo, YouTube, or AWS CloudFront) and use setting parameters, rather than keeping huge files in Git.

---

## Deployment & Verification Risks

**No Automated Verification Evals:**
- Issue: The theme lacks automated unit, integration, or end-to-end testing (e.g. Vitest, Playwright). Nav, cart counter, scrollytelling transition, and 3D configurator bugs are only discoverable via manual browser clicks.
- Impact: High risk of regressions during code changes.

**Shopify CLI Local Bindings:**
- Issue: No `shopify.theme.toml` is committed. The CLI requires active configuration on every new device to sync with the myshopify.com store.
- Fix: Push to the correct theme branch explicitly using `--store=pitwall-c4hglmgu.myshopify.com` parameter flags.

---

*Concerns audit: 2026-06-19*
