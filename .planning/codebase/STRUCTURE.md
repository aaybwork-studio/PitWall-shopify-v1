# Codebase Structure

**Analysis Date:** 2026-06-19

## Directory Layout

```
pitwall-shopify-theme/
├── assets/                    # Shopify theme asset serving root — static + compiled files
│   ├── pitwall-interactive.js # Vite output: bundled React + Three.js + state managers
│   ├── main.css               # Vite output: compiled Tailwind CSS
│   ├── pitwall-style.css.liquid # Manually maintained brutalist design system CSS
│   ├── *.glb                  # 3D models (mclaren, redbull, ferrari, mercedes, helmets)
│   ├── *.mp4                  # Loop video assets for hero/manifesto screens
│   ├── *.ttf                  # Custom self-hosted fonts (PetitFormalScript, btseps2)
│   ├── *.png                  # Brand logo emblems and fallbacks
│   └── *.mp3                  # Loader/sound assets
├── config/
│   └── settings_schema.json   # Theme editor settings declarations
├── layout/
│   └── theme.liquid           # Master layout: head, dynamic navigation, cart count/dropdown, footer
├── locales/                   # Shopify language files
├── sections/                  # Liquid sections (visual page blocks)
│   ├── collection-all.liquid  # Mounts CollectionGrid React island
│   ├── hero-canvas.liquid     # Mounts HomepageScrollytelling React island
│   ├── main-404.liquid        # Brutalist 404 page layout
│   ├── page-about.liquid      # Brutalist Editorial About page layout
│   ├── page-contact.liquid    # Brutalist Contact page layout
│   └── product-detail.liquid  # Mounts ProductScrollytelling React island
├── src/                       # TypeScript/React source code (Vite-compiled)
│   ├── main.tsx               # JS Entry: bootstraps React roots & binds megamenus/nav events
│   ├── index.css              # CSS Entry: imports Tailwind & declares variables
│   ├── components/            # React islands and UI widgets
│   │   ├── CarCanvas.tsx              # Three.js 3D car scene
│   │   ├── CollectionGrid.tsx         # Masonry product catalog with category filter & sorting
│   │   ├── FeaturedCarousel.tsx       # Carousel (unused template)
│   │   ├── Footer.tsx                 # Footer component (unused template)
│   │   ├── HomepageScrollytelling.tsx # Homepage takeover: wheel state machine + manifesto panels
│   │   ├── Navbar.tsx                 # Navbar component (unused template)
│   │   ├── ProductScrollytelling.tsx  # Product PDP WebGL configurator + cart forms
│   │   ├── TechSpecTable.tsx          # PDP spec specs
│   │   ├── Typography.tsx             # Strict brand text components
│   │   └── VideoBackground.tsx        # Playlist loop video background
│   └── utils/
│       └── logger.ts                  # Production-ready custom Logger wrapper
├── templates/                 # JSON page templates directing Shopify routes to sections
│   ├── 404.json
│   ├── collection.json
│   ├── index.json
│   ├── list-collections.json
│   ├── page.about.json
│   ├── page.collection.json
│   ├── page.collections.json
│   ├── page.contact.json
│   └── product.json
├── vite.config.ts             # Vite compiler config
├── tailwind.config.js         # Tailwind scanning configuration & colors/fonts config
├── postcss.config.js          # PostCSS pipe for Tailwind
├── tsconfig.json              # TypeScript compilation rules
├── package-lock.json
└── package.json               # npm scripts
```

## Directory Purposes

**`assets/`:**
Shopify's CDN target. Compiled Vite outputs (`pitwall-interactive.js`, `main.css`) land here. 3D GLTF models, video media, and branding image assets are hosted here.

**`sections/`:**
Shopify Liquid sections. Each section defines its custom Liquid rendering and a bottom merchant settings `{% schema %}` declaration.

**`templates/`:**
Shopify JSON templates matching routing rules (e.g., `templates/product.json` is selected on product pages, templates call respective sections in order).

**`src/`:**
React and Three.js application files. Compiled by Vite into the assets folder. Never served directly.

**`layout/`:**
Contains `theme.liquid`, the single HTML frame that handles document headers, dark mode detection, global layout noise, scroll-hide navbar, megamenu containers, and the footer.

## Where to Add New Code

**Creating a new page:**
1. Write layout section: `sections/page-example.liquid`
2. Create mapping template: `templates/page.example.json` calling `page-example`
3. Map routes in Shopify admin.

**Adding interactive components:**
1. Create React component under `src/components/MyWidget.tsx`.
2. Add mount target `<div id="my-widget-root" data-var="...">` inside section Liquid.
3. Bind the root in `src/main.tsx` inside the `bootstrap()` function.
4. Run `npm run build` to update compiled assets.

---

*Structure analysis: 2026-06-19*
