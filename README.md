# Pitwall Studio — Shopify Storefront Theme

This is a standalone, performance-optimized, **Shopify-ready theme** repository for **Pitwall Studio**. It houses your high-end brutalist design system, immersive responsive layouts, and the interactive **React & Three.js 3D WebGL chassis viewer**.

---

## Architecture Design

* **`theme/`**: The standard, production-ready Shopify theme structure. This is the directory that Shopify loads and syncs with your online store.
* **`src/`**: The separate React, TypeScript, and Three.js source code. It builds into a single compressed bundle inside `theme/assets/pitwall-interactive.js` to run inside Shopify Liquid seamlessly.

---

## Getting Started

### 1. Development and Local Compilations
To edit the 3D viewer or mute components, perform edits inside the `src/` directory and compile the bundle:

```bash
# Install dependencies
npm install

# Run build compilation (outputs updated JS directly to theme/assets/)
npm run build
```

### 2. Uploading 3D Models (.glb files) to Shopify
Because Shopify uses its global CDN to host assets, you must upload your `.glb` model files so Three.js can load them:

1. In your Shopify Admin, go to **Content > Files** or **Online Store > Themes > Edit Code > Assets**.
2. Upload your F1 car chassis models: `mclaren.glb`, `redbull.glb`, `ferrari.glb`, `mercedes.glb`.
3. The Liquid template (`product-detail.liquid`) dynamically resolves the CDN URL of these files automatically using the product handle:
   ```liquid
   {% capture model_filename %}{{ product.handle }}.glb{% endcapture %}
   ```
   *Note: Ensure your Shopify Product's URL handle matches the name of your model file (e.g., product handle `mclaren` resolves `mclaren.glb`).*

---

## Connecting to Shopify via GitHub

1. Create a fresh GitHub repository (e.g., `pitwall-shopify-theme`).
2. Initialize and push this local folder:
   ```bash
   git init
   git add .
   git commit -m "Initialize Pitwall Shopify theme"
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```
3. In Shopify, navigate to **Online Store > Themes**.
4. Click **Add Theme > Connect from GitHub**.
5. Select your repository. If Shopify asks for a root directory, specify `./theme` (or Shopify will automatically find the standard Liquid theme structure).
6. **Done!** Every time you run `npm run build` and push changes to GitHub, your Shopify theme updates in real-time.
