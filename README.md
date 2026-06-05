# PITWALL — Shopify Theme

A premium F1-inspired Shopify storefront theme with immersive 3D WebGL car/helmet viewers, video backgrounds, and a brutalist design system.

---

## Stack

| Layer | Technology |
|---|---|
| Storefront | Shopify Liquid |
| Interactivity | React 18 + Three.js (compiled to `assets/pitwall-interactive.js`) |
| Styling | Tailwind CSS (compiled to `assets/main.css`) |
| 3D Models | GLTF/GLB via Three.js GLTFLoader |

---

## Dev Workflow

### 1. Install dependencies
```bash
npm install
```

### 2. Preview live on Shopify store
```bash
npm run shopify:dev
# Opens browser login — no API token needed
# Live-reloads Liquid changes on your store
```

### 3. Edit React/Three.js components
```bash
# After editing anything in src/:
npm run build
# Compiles → assets/pitwall-interactive.js + assets/main.css
```

### 4. Push changes to Shopify
```bash
git add -A
git commit -m "feat: your change"
git push origin main
# Shopify GitHub integration auto-syncs the theme
```

---

## Repository Structure

```
├── assets/           ← Compiled JS/CSS, images, fonts, videos, small .glb models
├── config/           ← Theme settings schema
├── layout/           ← theme.liquid (global HTML shell)
├── locales/          ← Translation strings
├── sections/         ← Liquid section files
├── templates/        ← JSON page templates
├── src/              ← React + Three.js source (build only, Shopify ignores this)
├── .shopifyignore    ← Tells Shopify CLI which files to skip
└── package.json
```

---

## Large 3D Car Models (> 20MB)

These files exceed Shopify's 20MB theme asset limit and must be uploaded manually:

| File | Size | Where |
|---|---|---|
| `mclaren.glb` | 43 MB | Shopify Admin → Content → Files |
| `ferrari.glb` | 29 MB | Shopify Admin → Content → Files |
| `mercedes.glb` | 26 MB | Shopify Admin → Content → Files |
| `redbull.glb` | 24 MB | Shopify Admin → Content → Files |

Liquid templates already reference them via `{{ 'mclaren.glb' | file_url }}` — once uploaded, they work automatically.

The 3 helmet models are under 20MB and live in `assets/` normally.

---

## Connecting to Shopify via GitHub

1. Shopify Admin → **Online Store → Themes**
2. **Add theme → Connect from GitHub**
3. Select repo: `aaybwork-studio/PitWall-shopify-v1`
4. Select branch: `main`
5. Done — every push to `main` auto-syncs
