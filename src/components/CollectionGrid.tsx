import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Logger } from '../utils/logger';

export interface Product {
  title: string;
  url: string;
  price: string;
  image: string;
  specs?: string;
  category?: string;
}

// ─── Collection Card (identical hover UX to homepage cards) ───────────────────
interface CollectionCardProps {
  product: Product;
  style?: React.CSSProperties;
  /** Accepted for backwards-compat with HomepageScrollytelling usage */
  className?: string;
  /** Accepted for backwards-compat — not used in this layout engine */
  isTall?: boolean;
  ctaLabel?: 'CALIBRATE' | 'VIEW';
}

export function CollectionCard({ product, style }: CollectionCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <a
      href={product.url}
      className="group relative flex flex-col justify-end overflow-hidden bg-white text-[#0C0C0C] border border-[#0C0C0C]/10 transition-all duration-300 w-full h-full"
      style={style}
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#1a1a1a]">
        <img
          src={product.image}
          alt={product.title}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transition: 'opacity 400ms ease, transform 500ms ease' }}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            Logger.warn(`Failed to load product image: ${product.image}`);
            setIsLoaded(true);
          }}
        />
      </div>

      {/* Baseline footer — visible at rest */}
      <div className="relative z-10 p-3 border-t border-[#0C0C0C]/10 flex justify-between items-center bg-white/90 backdrop-blur-sm w-full transition-transform duration-300 group-hover:translate-y-full">
        <span className="font-mono text-[10px] uppercase tracking-wider truncate max-w-[70%] text-[#0C0C0C] font-semibold">
          {product.title}
        </span>
        <span className="font-mono text-[10px] font-bold text-[#0C0C0C]">{product.price}</span>
      </div>

      {/* Slide-up hover overlay with VIEW button (1/3 of the card) */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-white p-3 flex flex-col justify-between translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 border-t border-[#0C0C0C]/10">
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#F6C917] font-bold">
              SPECIFICATIONS
            </span>
            <span className="font-mono text-[10px] font-bold text-[#0C0C0C]">{product.price}</span>
          </div>
          <h4 className="font-display-strict text-sm uppercase tracking-tighter text-[#0C0C0C] font-extrabold leading-none truncate">
            {product.title}
          </h4>
        </div>
        <div className="w-full h-8 border border-[#0C0C0C] bg-[#0C0C0C] text-[#EDEBE5] hover:bg-[#F6C917] hover:text-[#0C0C0C] hover:border-[#F6C917] font-mono text-[9px] uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer">
          VIEW
        </div>
      </div>
    </a>
  );
}

// ─── Layout Block Renderer ────────────────────────────────────────────────────
// Four repeating block patterns that match the reference wireframe:
//   A: [S][S][S]       — 3 equal small    (3 products)
//   B: [WIDE  ][M]     — wide + medium     (2 products)
//   C: [T ][WIDE  ]    — tall | wide top   (4 products)
//      [T ][S ][S ]      tall | 2 small btm
//   D: [S ][LARGE   ]  — 2 small stacked | large right (3 products)
//      [S ][LARGE   ]

const CELL = 280; // base cell height in px
const GAP  = 2;   // gap between cards in px

interface BlockProps {
  products: Product[];
}

function BlockAAA({ products }: BlockProps) {
  // 3 equal-size cards in a row
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: GAP,
        height: CELL,
      }}
    >
      {products.slice(0, 3).map((p, i) => (
        <CollectionCard key={`${p.url}-${i}`} product={p} />
      ))}
    </div>
  );
}

function BlockBA({ products }: BlockProps) {
  // Wide (2/3) + Medium (1/3)
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: GAP,
        height: CELL,
      }}
    >
      <div style={{ gridColumn: 'span 2' }}>
        <CollectionCard product={products[0]} />
      </div>
      <div style={{ gridColumn: 'span 1' }}>
        <CollectionCard product={products[1]} />
      </div>
    </div>
  );
}

function BlockTAA({ products }: BlockProps) {
  // Left: tall card spanning 2 rows
  // Right top: wide card (2/3)
  // Right bottom: 2 small cards
  const totalH = CELL * 2 + GAP;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: `${CELL}px ${CELL}px`,
        gap: GAP,
        height: totalH,
      }}
    >
      {/* Tall left */}
      <div style={{ gridColumn: '1 / 2', gridRow: '1 / 3' }}>
        <CollectionCard product={products[0]} />
      </div>
      {/* Wide right top */}
      <div style={{ gridColumn: '2 / 4', gridRow: '1 / 2' }}>
        <CollectionCard product={products[1]} />
      </div>
      {/* Small right bottom × 2 */}
      <div style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }}>
        <CollectionCard product={products[2]} />
      </div>
      <div style={{ gridColumn: '3 / 4', gridRow: '2 / 3' }}>
        <CollectionCard product={products[3]} />
      </div>
    </div>
  );
}

function BlockAAL({ products }: BlockProps) {
  // Left: 2 small cards stacked
  // Right: 1 large card (2/3 wide, 2 rows tall)
  const totalH = CELL * 2 + GAP;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: `${CELL}px ${CELL}px`,
        gap: GAP,
        height: totalH,
      }}
    >
      {/* Small left top */}
      <div style={{ gridColumn: '1 / 2', gridRow: '1 / 2' }}>
        <CollectionCard product={products[0]} />
      </div>
      {/* Small left bottom */}
      <div style={{ gridColumn: '1 / 2', gridRow: '2 / 3' }}>
        <CollectionCard product={products[1]} />
      </div>
      {/* Large right spanning 2 rows */}
      <div style={{ gridColumn: '2 / 4', gridRow: '1 / 3' }}>
        <CollectionCard product={products[2]} />
      </div>
    </div>
  );
}

// Cycle order: AAA (3) → BA (2) → TAA (4) → AAL (3)
// Total per cycle: 12 products
const BLOCK_SEQUENCE = [
  { type: 'AAA', count: 3 },
  { type: 'BA',  count: 2 },
  { type: 'TAA', count: 4 },
  { type: 'AAL', count: 3 },
] as const;

function LayoutBlock({ type, products }: { type: string; products: Product[] }) {
  if (products.length === 0) return null;
  switch (type) {
    case 'AAA': return <BlockAAA products={products} />;
    case 'BA':  return <BlockBA  products={products} />;
    case 'TAA': return <BlockTAA products={products} />;
    case 'AAL': return <BlockAAL products={products} />;
    default:    return null;
  }
}

// ─── Product Data ─────────────────────────────────────────────────────────────
const F1_PRODUCTS: Product[] = [
  // WLED Light Boxes
  { title: 'Monaco GP WLED Light Box',     url: '/products/monaco-wled',       price: '₹5,499.00', image: '/assets/wled_light_boxes.png',  specs: 'WLED LIGHT BOX / NEON GLOW CHASSIS',    category: 'WLED Light Boxes' },
  { title: 'Silverstone WLED Light Box',   url: '/products/silverstone-wled',  price: '₹5,499.00', image: '/assets/wled_light_boxes.png',  specs: 'WLED LIGHT BOX / NEON GLOW CHASSIS',    category: 'WLED Light Boxes' },
  { title: 'Red Bull Racing WLED Box',     url: '/products/redbull-wled',      price: '₹5,999.00', image: '/assets/wled_light_boxes.png',  specs: 'WLED LIGHT BOX / TEAM EDITION',         category: 'WLED Light Boxes' },
  // Car Models
  { title: 'McLaren MCL39 1:18 Scale',     url: '/products/mclaren-mcl39',     price: '₹12,499.00', image: '/assets/mclaren.png',          specs: '1:18 SCALE / CHASSIS BRUTALIST DISPLAY', category: 'Car Models' },
  { title: 'Red Bull RB19 1:8 Scale',      url: '/products/red-bull-rb19',     price: '₹48,999.00', image: '/assets/redbull.png',          specs: '1:8 SCALE / EXPERT DISPLAY PIECE',      category: 'Car Models' },
  { title: 'Ferrari SF-23 1:24 Scale',     url: '/products/ferrari-sf-23',     price: '₹7,999.00', image: '/assets/ferrari.png',           specs: '1:24 SCALE / Scuderia Crimson',          category: 'Car Models' },
  { title: 'Mercedes-AMG W14 1:64 Scale',  url: '/products/mercedes-w14',      price: '₹2,499.00', image: '/assets/mercedes.png',          specs: '1:64 SCALE / Stealth Chassis',           category: 'Car Models' },
  { title: 'Vertical Display Stand',       url: '/products/vertical-stand',    price: '₹1,499.00', image: '/assets/car_models.png',        specs: 'STAND ADD-ON / VERTICAL ACRYLIC MOUNT', category: 'Car Models' },
  { title: 'Desk Display Stand',           url: '/products/desk-stand',        price: '₹999.00',   image: '/assets/car_models.png',        specs: 'STAND ADD-ON / DESK MOUNT',              category: 'Car Models' },
  { title: 'Wall Display Holder',          url: '/products/wall-holder',       price: '₹1,199.00', image: '/assets/car_models.png',        specs: 'STAND ADD-ON / WALL SURFACE MOUNT',      category: 'Car Models' },
  // 2D Wall Art
  { title: 'Monaco GP Track Wall Art',     url: '/products/monaco-track-art',  price: '₹2,999.00', image: '/assets/wall_art.png',          specs: '2D WALL ART / STAINLESS CIRCUIT',       category: '2D Wall Art' },
  { title: 'Silverstone Steel Silhouette', url: '/products/silverstone-art',   price: '₹2,999.00', image: '/assets/wall_art.png',          specs: '2D WALL ART / BRUTALIST METALWORK',     category: '2D Wall Art' },
  { title: 'Car Silhouette Wall Art',      url: '/products/mcl38-silhouette',  price: '₹3,499.00', image: '/assets/wall_art.png',          specs: '2D WALL ART / STEEL CAR SHAPE',         category: '2D Wall Art' },
  { title: 'Keyholder Rack — Carbon',      url: '/products/keyholder-track',   price: '₹1,899.00', image: '/assets/wall_art.png',          specs: '2D WALL ART / KEY RACK STAGED',         category: '2D Wall Art' },
  // Keychains
  { title: 'McLaren Carbon Weave Keychain', url: '/products/mclaren-keychain', price: '₹799.00',   image: '/assets/keychains.png',         specs: 'KEYCHAINS / ZINC ALLOY CLASP',          category: 'Keychains' },
  { title: 'Ferrari Crimson Leather Key',  url: '/products/ferrari-keychain',  price: '₹799.00',   image: '/assets/keychains.png',         specs: 'KEYCHAINS / EMBOSSED BADGE',            category: 'Keychains' },
  // Desk Accessories
  { title: '1:8 Front Wing Desk Stand',    url: '/products/front-wing-stand',  price: '₹3,499.00', image: '/assets/desk_accessories.png',  specs: 'DESK ACCESSORIES / FRONT WING EXHIBIT', category: 'Desk Accessories' },
  { title: 'Desk Stand Track Map',         url: '/products/desk-map',          price: '₹2,499.00', image: '/assets/desk_accessories.png',  specs: 'DESK ACCESSORIES / GRID START MAP',     category: 'Desk Accessories' },
  { title: 'Brake Caliper Pen Stand',      url: '/products/caliper-stand',     price: '₹2,199.00', image: '/assets/desk_accessories.png',  specs: 'DESK ACCESSORIES / MONOBLOC CALIPER',  category: 'Desk Accessories' },
  { title: 'F1 Controller Dock (Alloy)',   url: '/products/controller-dock',   price: '₹2,899.00', image: '/assets/desk_accessories.png',  specs: 'DESK ACCESSORIES / CONTROLLER DOCK',   category: 'Desk Accessories' },
  { title: 'Pen Holder (Piston Cup)',      url: '/products/piston-holder',     price: '₹1,999.00', image: '/assets/desk_accessories.png',  specs: 'DESK ACCESSORIES / PISTON SHELL',       category: 'Desk Accessories' },
  { title: 'Racing Keycaps Set (PBT)',     url: '/products/keycaps-set',       price: '₹3,999.00', image: '/assets/desk_accessories.png',  specs: 'DESK ACCESSORIES / F1 SPEED COLORWAY', category: 'Desk Accessories' },
  { title: 'Carbon Team Coaster Set',      url: '/products/coaster-team',      price: '₹1,299.00', image: '/assets/desk_accessories.png',  specs: 'DESK ACCESSORIES / GLOSS FINISH',       category: 'Desk Accessories' },
  { title: 'Circuit Coaster Set',          url: '/products/coaster-track-pack', price: '₹1,299.00', image: '/assets/desk_accessories.png', specs: 'DESK ACCESSORIES / ANODIZED METALS',    category: 'Desk Accessories' },
  // Layered Art
  { title: 'Suzuka 5-Layer Wooden Art',    url: '/products/suzuka-layered',    price: '₹5,999.00', image: '/assets/layered_art.png',       specs: 'LAYERED ART / 5 DEPTH PLYWOOD',         category: 'Layered Art' },
  { title: 'Monaco Grand Prix Layered',    url: '/products/monaco-layered',    price: '₹5,999.00', image: '/assets/layered_art.png',       specs: 'LAYERED ART / WOOD DEPTH CHART',        category: 'Layered Art' },
  // Driver Figurines
  { title: 'Ayrton Senna 1:24 Figure',     url: '/products/senna-figurine',    price: '₹8,499.00', image: '/assets/driver_figurine.png',   specs: 'DRIVER FIGURINES / POLYRESIN',          category: 'Driver Figurines' },
  { title: 'Lewis Hamilton 1:24 Figure',   url: '/products/hamilton-figurine', price: '₹8,499.00', image: '/assets/driver_figurine.png',   specs: 'DRIVER FIGURINES / CHAMPION HELMET',    category: 'Driver Figurines' },
  { title: 'Max Verstappen 1:24 Figure',   url: '/products/verstappen-figurine', price: '₹8,499.00', image: '/assets/driver_figurine.png', specs: 'DRIVER FIGURINES / WORLD CHAMPION',     category: 'Driver Figurines' },
];

const CATEGORIES = ['All', 'WLED Light Boxes', 'Car Models', '2D Wall Art', 'Keychains', 'Desk Accessories', 'Layered Art', 'Driver Figurines'];
const SORTS       = ['Default', 'Price: Low to High', 'Price: High to Low', 'Alphabetical'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCleanPrice(p: string): number {
  return parseFloat(p.replace(/[^0-9.]/g, '')) || 0;
}

/**
 * Chunk `products` into layout blocks following the repeating sequence:
 * AAA(3) → BA(2) → TAA(4) → AAL(3) → repeat
 */
function chunkIntoBlocks(products: Product[]) {
  const blocks: { type: string; products: Product[] }[] = [];
  let idx = 0;
  let seqIdx = 0;
  while (idx < products.length) {
    const { type, count } = BLOCK_SEQUENCE[seqIdx % BLOCK_SEQUENCE.length];
    const slice = products.slice(idx, idx + count);
    if (slice.length === 0) break;
    // Only render if we have at least 1 product for the block
    blocks.push({ type, products: slice });
    idx += count;
    seqIdx++;
  }
  return blocks;
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface CollectionGridProps {
  products?: Product[];
  videoUrl?: string;
}

export function CollectionGrid({ products = [], videoUrl }: CollectionGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      if (catParam) {
        const matchedCat = CATEGORIES.find(c => c.toLowerCase() === catParam.toLowerCase());
        if (matchedCat) return matchedCat;
      }
    }
    return 'All';
  });

  const [selectedSort, setSelectedSort] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sortParam = params.get('sort');
      if (sortParam) {
        const matchedSort = SORTS.find(s => s.toLowerCase() === sortParam.toLowerCase());
        if (matchedSort) return matchedSort;
      }
    }
    return 'Default';
  });

  const [categoryOpen, setCategoryOpen]         = useState<boolean>(false);
  const [sortOpen, setSortOpen]                 = useState<boolean>(false);

  // ── Sync URL Params on PopState ──
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      const sortParam = params.get('sort');
      
      if (catParam) {
        const matchedCat = CATEGORIES.find(c => c.toLowerCase() === catParam.toLowerCase());
        if (matchedCat) {
          setSelectedCategory(matchedCat);
        }
      } else {
        setSelectedCategory('All');
      }

      if (sortParam) {
        const matchedSort = SORTS.find(s => s.toLowerCase() === sortParam.toLowerCase());
        if (matchedSort) {
          setSelectedSort(matchedSort);
        }
      } else {
        setSelectedSort('Default');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCategoryOpen(false);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (cat === 'All') {
        params.delete('category');
      } else {
        params.set('category', cat);
      }
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.pushState(null, '', newUrl);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  const handleSortSelect = (sort: string) => {
    setSelectedSort(sort);
    setSortOpen(false);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (sort === 'Default') {
        params.delete('sort');
      } else {
        params.set('sort', sort);
      }
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.pushState(null, '', newUrl);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  // ── Ensure page can scroll (remove any stale homepage scroll locks) ──
  useEffect(() => {
    try {
      document.documentElement.classList.remove('homepage-scrollytelling-active');
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height   = 'auto';
      document.body.style.overflow            = 'auto';
      document.body.style.overflowY           = 'auto';
      document.body.style.height              = 'auto';
    } catch (e) {
      Logger.warn('Could not clear scroll lock', e);
    }
  }, []);

  // ── Close dropdowns when clicking outside ────────────────────────────
  useEffect(() => {
    const close = () => { setCategoryOpen(false); setSortOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  // ── Derive display products ───────────────────────────────────────────
  const displayBlocks = useMemo(() => {
    const dataSource = products && products.length > 0 ? products : F1_PRODUCTS;
    let filtered = selectedCategory === 'All'
      ? dataSource
      : dataSource.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());

    let sorted = [...filtered];
    if      (selectedSort === 'Price: Low to High')  sorted.sort((a, b) => getCleanPrice(a.price) - getCleanPrice(b.price));
    else if (selectedSort === 'Price: High to Low')  sorted.sort((a, b) => getCleanPrice(b.price) - getCleanPrice(a.price));
    else if (selectedSort === 'Alphabetical')        sorted.sort((a, b) => a.title.localeCompare(b.title));
    else                                             sorted = shuffle(sorted); // Default: random order

    return chunkIntoBlocks(sorted);
  }, [products, selectedCategory, selectedSort]);

  const stopPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--bg, #EDEBE5)',
        color: 'var(--fg, #0C0C0C)',
      }}
    >
      {/* ── 1/3 Video Banner ─────────────────────────────────────────── */}
      <div
        style={{
          height: '33vh',
          minHeight: 240,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0C0C0C',
          borderBottom: '1px solid #0C0C0C',
          isolation: 'isolate',
        }}
      >
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              opacity: 0.65,
              pointerEvents: 'none',
            }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#111', opacity: 0.5 }} />
        )}

        {/* Overlay text with difference blend — sits above the video */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '50px',
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 10,
            mixBlendMode: 'difference',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display, "Syne", sans-serif)',
              fontWeight: 800,
              fontSize: 'clamp(22px, 3.5vw, 48px)',
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
              textAlign: 'center',
              color: '#ffffff',
              mixBlendMode: 'difference',
              margin: 0,
              padding: '0 1rem',
            }}
          >
            The Collection
          </h1>
        </div>
      </div>

      {/* ── Yellow Filter / Sort Bar ──────────────────────────────────── */}
      <div
        className="px-5 md:px-[100px]"
        style={{
          backgroundColor: '#F6C917',
          color: '#0C0C0C',
          borderBottom: '1px solid #0C0C0C',
          paddingTop: '10px',
          paddingBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 64,
          zIndex: 40,
          userSelect: 'none',
        }}
        onClick={stopPropagation}
      >
        {/* Category Dropdown (left) */}
        <div style={{ position: 'relative' }}>
          <button
            id="collection-category-btn"
            onClick={(e) => { e.stopPropagation(); setCategoryOpen(o => !o); setSortOpen(false); }}
            style={{
              fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: '#0C0C0C',
              padding: '4px 0',
            }}
          >
            CATEGORY:{' '}
            <span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
              {selectedCategory.toUpperCase()}
            </span>{' '}
            <span style={{ fontSize: 8 }}>▾</span>
          </button>

          {categoryOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                minWidth: 200,
                backgroundColor: 'rgba(12, 12, 12, 0.9)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(237, 235, 229, 0.15)',
                boxShadow: 'none',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={stopPropagation}
            >
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  style={{
                    fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    background: selectedCategory === cat ? '#F6C917' : 'transparent',
                    color:      selectedCategory === cat ? '#0C0C0C' : '#EDEBE5',
                    border: 'none',
                    padding: '8px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 120ms',
                  }}
                  onMouseEnter={e => {
                    if (selectedCategory !== cat) {
                      (e.currentTarget as HTMLButtonElement).style.background = '#F6C917';
                      (e.currentTarget as HTMLButtonElement).style.color = '#0C0C0C';
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedCategory !== cat) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      (e.currentTarget as HTMLButtonElement).style.color = '#EDEBE5';
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown (right) */}
        <div style={{ position: 'relative' }}>
          <button
            id="collection-sort-btn"
            onClick={(e) => { e.stopPropagation(); setSortOpen(o => !o); setCategoryOpen(false); }}
            style={{
              fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: '#0C0C0C',
              padding: '4px 0',
            }}
          >
            SORT BY:{' '}
            <span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
              {selectedSort.toUpperCase()}
            </span>{' '}
            <span style={{ fontSize: 8 }}>▾</span>
          </button>

          {sortOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                minWidth: 180,
                backgroundColor: 'rgba(12, 12, 12, 0.9)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(237, 235, 229, 0.15)',
                boxShadow: 'none',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={stopPropagation}
            >
              {SORTS.map(srt => (
                <button
                  key={srt}
                  onClick={() => handleSortSelect(srt)}
                  style={{
                    fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    background: selectedSort === srt ? '#F6C917' : 'transparent',
                    color:      selectedSort === srt ? '#0C0C0C' : '#EDEBE5',
                    border: 'none',
                    padding: '8px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 120ms',
                  }}
                  onMouseEnter={e => {
                    if (selectedSort !== srt) {
                      (e.currentTarget as HTMLButtonElement).style.background = '#F6C917';
                      (e.currentTarget as HTMLButtonElement).style.color = '#0C0C0C';
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedSort !== srt) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      (e.currentTarget as HTMLButtonElement).style.color = '#EDEBE5';
                    }
                  }}
                >
                  {srt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Product Grid ──────────────────────────────────────────────── */}
      <div
        style={{
          width: '100%',
          maxWidth: 1440,
          margin: '0 auto',
          padding: `${GAP}px ${GAP}px 80px`,
          boxSizing: 'border-box',
        }}
      >
        {displayBlocks.length === 0 ? (
          <div
            style={{
              padding: '80px 0',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.4,
            }}
          >
            No products found in this category.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
            {displayBlocks.map((block, bi) => (
              <LayoutBlock key={bi} type={block.type} products={block.products} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
