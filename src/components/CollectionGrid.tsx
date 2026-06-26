import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  className?: string;
  isTall?: boolean;
  ctaLabel?: 'CALIBRATE' | 'VIEW';
}

export function CollectionCard({ product, style, className }: CollectionCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <a
      href={product.url}
      className={`group relative flex flex-col justify-end overflow-hidden border transition-all duration-300 w-full h-full ${className || ''}`}
      style={{ backgroundColor: 'var(--surface)', color: 'var(--fg)', borderColor: 'var(--border)', ...style }}
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
      <div
        className="relative z-10 p-3 border-t flex justify-between items-center backdrop-blur-sm w-full transition-transform duration-300 group-hover:translate-y-full"
        style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--surface) 90%, transparent)' }}
      >
        <span className="font-mono text-[10px] uppercase tracking-wider truncate max-w-[70%] font-semibold" style={{ color: 'var(--fg)' }}>
          {product.title}
        </span>
        <span className="font-mono text-[10px] font-bold" style={{ color: 'var(--fg)' }}>{product.price}</span>
      </div>

      {/* Slide-up hover overlay with VIEW button (1/3 of the card) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%] p-3 flex flex-col justify-between translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 border-t"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#7A7A7A] font-bold">
              SPECIFICATIONS
            </span>
            <span className="font-mono text-[10px] font-bold" style={{ color: 'var(--fg)' }}>{product.price}</span>
          </div>
          <h4 className="font-display-strict text-sm uppercase tracking-tighter font-extrabold leading-none truncate" style={{ color: 'var(--fg)' }}>
            {product.title}
          </h4>
        </div>
        <div
          className="w-full h-8 border hover:bg-[#7A7A7A] hover:text-[#0C0C0C] hover:border-[#7A7A7A] font-mono text-[9px] uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer"
          style={{ backgroundColor: 'var(--fg)', color: 'var(--bg)', borderColor: 'var(--fg)' }}
        >
          VIEW
        </div>
      </div>
    </a>
  );
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

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'WLED Light Boxes': 'High-intensity backlit team emblems. Engineered for the pitwall.',
  'Car Models': 'Precision-detailed scale replicas. Formula 1 design heritage.',
  '2D Wall Art': 'Steel circuit maps and silhouettes. Minimalist metalwork.',
  'Keychains': 'Carbon weave and leather racing keychains. Built for speed.',
  'Desk Accessories': 'Monobloc caliper stands and track maps. Optimised for focus.',
  'Layered Art': 'Multi-depth plywood circuit artwork. Structured design.',
  'Driver Figurines': 'Hand-painted champion driver collectibles. Polyresin replicas.',
};

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

// ─── Reusable URL-Synced Filter/Sort Hook (ASVS V5 allow-list pattern) ────────
export function useUrlSyncedFilter(
  paramName: string,
  allowList: string[],
  defaultValue: string
): [string, React.Dispatch<React.SetStateAction<string>>, (value: string) => void] {
  const [value, setValue] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const rawParam = params.get(paramName);
      if (rawParam) {
        const matched = allowList.find(v => v.toLowerCase() === rawParam.toLowerCase());
        if (matched) return matched;
      }
    }
    return defaultValue;
  });

  // ── Sync URL Params on PopState ──
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const rawParam = params.get(paramName);

      if (rawParam) {
        const matched = allowList.find(v => v.toLowerCase() === rawParam.toLowerCase());
        if (matched) {
          setValue(matched);
          return;
        }
      }
      setValue(defaultValue);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [paramName, allowList, defaultValue]);

  const handleSelect = useCallback((selected: string) => {
    setValue(selected);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (selected === defaultValue) {
        params.delete(paramName);
      } else {
        params.set(paramName, selected);
      }
      const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.pushState(null, '', newUrl);
      window.dispatchEvent(new Event('popstate'));
    }
  }, [paramName, defaultValue]);

  return [value, setValue, handleSelect];
}

// ─── Reusable Sort Dropdown UI ─────────────────────────────────────────────────
interface SortDropdownProps {
  options: string[];
  selected: string;
  onSelect: (s: string) => void;
  open: boolean;
  onToggle: () => void;
}

export function SortDropdown({ options, selected, onSelect, open, onToggle }: SortDropdownProps) {
  const stopPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  return (
    <div style={{ position: 'relative' }}>
      <button
        id="collection-sort-btn"
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
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
          {selected.toUpperCase()}
        </span>{' '}
        <span style={{ fontSize: 8 }}>▾</span>
      </button>

      {open && (
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
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: selected === opt ? '#7A7A7A' : 'transparent',
                color:      selected === opt ? '#0C0C0C' : '#EDEBE5',
                border: 'none',
                padding: '8px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 120ms',
              }}
              onMouseEnter={e => {
                if (selected !== opt) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#7A7A7A';
                  (e.currentTarget as HTMLButtonElement).style.color = '#0C0C0C';
                }
              }}
              onMouseLeave={e => {
                if (selected !== opt) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = '#EDEBE5';
                }
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Category Card Component ──────────────────────────────────────────────────
interface CategoryCardProps {
  category: string;
  description: string;
  onClick: () => void;
}

export function CategoryCard({ category, description, onClick }: CategoryCardProps) {
  const fontSize = useMemo(() => {
    if (category.length > 12) return 'text-[20px]';
    if (category.length > 8) return 'text-[24px]';
    return 'text-[30px]';
  }, [category]);

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-[320px] h-[380px] p-6 border flex flex-col justify-between cursor-pointer hover:bg-[#7A7A7A] hover:text-[#0C0C0C] hover:border-[#7A7A7A] transition-all duration-300"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--fg)', color: 'var(--fg)' }}
    >
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A7A7A] hover:text-[#0C0C0C] font-bold">
          → VIEW ALL
        </span>
      </div>
      <h3 className={`font-display-strict uppercase tracking-tighter leading-none my-auto break-normal ${fontSize}`}>
        {category}
      </h3>
      <p className="font-mono text-[10px] leading-relaxed opacity-60 uppercase tracking-wide">
        {description}
      </p>
    </div>
  );
}

// ─── Scrolling Category Row Component ──────────────────────────────────────────
interface CollectionRowProps {
  category: string;
  products: Product[];
  rowIdx: number;
  onCategoryClick: (cat: string) => void;
}

export function CollectionRow({ category, products, rowIdx, onCategoryClick }: CollectionRowProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollContainer.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  useEffect(() => {
    const el = scrollContainer.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  useEffect(() => {
    checkScroll();
  }, [products, checkScroll]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const cardWidth = 320;
      const gap = 16; // gap-4 (16px)
      const scrollAmount = (cardWidth + gap) * 2;
      scrollContainer.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Alternating index pattern: Row 1 -> 1, Row 2 -> 3, Row 3 -> 0, Row 4 -> 2, repeat
  const categoryCardIndexPattern = useMemo(() => {
    const pattern = [1, 3, 0, 2];
    return pattern[rowIdx % 4];
  }, [rowIdx]);

  // Cap Category Card index at product list length
  const categoryCardIndex = useMemo(() => {
    return Math.min(categoryCardIndexPattern, products.length);
  }, [categoryCardIndexPattern, products.length]);

  const cardsList = useMemo(() => {
    const list: ({ type: 'category' } | { type: 'product'; product: Product })[] = products.map(p => ({
      type: 'product',
      product: p,
    }));
    list.splice(categoryCardIndex, 0, { type: 'category' });
    return list;
  }, [products, categoryCardIndex]);

  const description = CATEGORY_DESCRIPTIONS[category] || 'Racing apparel and gear. Designed for performance.';

  return (
    <div
      className="relative w-full py-8 border-b"
      style={{ borderColor: 'var(--border)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category Header */}
      <div className="px-5 md:px-[100px] mb-4 flex justify-between items-end">
        <span className="font-mono text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--muted)' }}>
          {category}
        </span>
      </div>

      {/* Row Scrolling Viewport */}
      <div className="relative w-full">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 border flex items-center justify-center font-mono text-lg font-bold hover:bg-[#7A7A7A] hover:text-[#0C0C0C] hover:border-[#7A7A7A] transition-all duration-200 shadow-md ${
              isHovered ? 'opacity-100' : 'opacity-0 md:opacity-0'
            }`}
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--fg)', color: 'var(--fg)', transition: 'opacity 200ms ease, background 200ms, color 200ms' }}
          >
            ←
          </button>
        )}

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 border flex items-center justify-center font-mono text-lg font-bold hover:bg-[#7A7A7A] hover:text-[#0C0C0C] hover:border-[#7A7A7A] transition-all duration-200 shadow-md ${
              isHovered ? 'opacity-100' : 'opacity-0 md:opacity-0'
            }`}
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--fg)', color: 'var(--fg)', transition: 'opacity 200ms ease, background 200ms, color 200ms' }}
          >
            →
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainer}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-none px-5 md:px-[100px] py-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {cardsList.map((card, idx) => {
            if (card.type === 'category') {
              return (
                <CategoryCard
                  key={`cat-card-${category}`}
                  category={category}
                  description={description}
                  onClick={() => onCategoryClick(category)}
                />
              );
            } else {
              return (
                <div 
                  key={`prod-card-${card.product.url}-${idx}`} 
                  className="flex-shrink-0 w-[320px] h-[380px]"
                >
                  <CollectionCard product={card.product} className="w-full h-full" />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface CollectionGridProps {
  products?: Product[];
  videoUrl?: string;
  title?: string;
}

export function CollectionGrid({ products = [], title = 'Our Products' }: CollectionGridProps) {
  const [selectedCategory, , handleCategorySelectRaw] = useUrlSyncedFilter('category', CATEGORIES, 'All');
  const [selectedSort, , handleSortSelectRaw] = useUrlSyncedFilter('sort', SORTS, 'Default');

  const [sortOpen, setSortOpen] = useState<boolean>(false);

  const handleCategorySelect = (cat: string) => {
    handleCategorySelectRaw(cat);
  };

  const handleSortSelect = (sort: string) => {
    handleSortSelectRaw(sort);
    setSortOpen(false);
  };

  // ── Ensure page can scroll (remove homepage scroll locks) ──
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

  // ── Close sort dropdown when clicking outside ────────────────────────
  useEffect(() => {
    const close = () => { setSortOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  // ── Group and filter categories/products dynamically ────────────────
  const categoriesWithProducts = useMemo(() => {
    const dataSource = products && products.length > 0 ? products : F1_PRODUCTS;

    const activeCategories = selectedCategory === 'All'
      ? CATEGORIES.filter(cat => cat !== 'All')
      : [selectedCategory];

    return activeCategories.map(cat => {
      let catProds = dataSource.filter(
        p => p.category?.toLowerCase() === cat.toLowerCase()
      );

      // Sort products within each row
      if (selectedSort === 'Price: Low to High') {
        catProds.sort((a, b) => getCleanPrice(a.price) - getCleanPrice(b.price));
      } else if (selectedSort === 'Price: High to Low') {
        catProds.sort((a, b) => getCleanPrice(b.price) - getCleanPrice(a.price));
      } else if (selectedSort === 'Alphabetical') {
        catProds.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        // Default (random order)
        catProds = shuffle(catProds);
      }

      return {
        category: cat,
        products: catProds,
      };
    }).filter(group => group.products.length > 0);
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
      {/* ── Page Header Area (Replaces Video Hero Banner) ────────────────── */}
      <div className="px-5 md:px-[100px] pt-24 pb-8 flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
        <h1 className="font-display-strict text-5xl md:text-7xl uppercase tracking-tighter leading-none m-0" style={{ color: 'var(--fg)' }}>
          {title}
        </h1>
      </div>

      {/* ── Sticky Filter / Sort Bar ───────────────────────────────────── */}
      <div
        className="px-5 md:px-[100px]"
        style={{
          backgroundColor: '#7A7A7A',
          color: '#0C0C0C',
          borderBottom: '1px solid #0C0C0C',
          paddingTop: '6px',
          paddingBottom: '6px',
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
        {/* Category Tabs (Left) */}
        <div className="flex gap-6 overflow-x-auto whitespace-nowrap scrollbar-none py-2 max-w-[70%] md:max-w-[80%]">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`font-mono text-[10px] font-bold uppercase tracking-wider bg-transparent cursor-pointer transition-colors duration-150 p-0 border-b-2 pb-0.5 ${
                selectedCategory === cat 
                  ? 'text-[#0C0C0C] border-[#0C0C0C]' 
                  : 'text-[#0C0C0C]/60 border-transparent hover:text-[#0C0C0C]'
              }`}
            >
              {cat === 'All' ? 'All Products' : cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown (Right) */}
        <SortDropdown
          options={SORTS}
          selected={selectedSort}
          onSelect={handleSortSelect}
          open={sortOpen}
          onToggle={() => setSortOpen(o => !o)}
        />
      </div>

      {/* ── Category Scrolling Rows ───────────────────────────────────── */}
      <div className="w-full py-8 flex flex-col box-sizing-border" style={{ backgroundColor: 'var(--bg)' }}>
        {categoriesWithProducts.length === 0 ? (
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
            No products found matching your selection.
          </div>
        ) : (
          <div className="flex flex-col">
            {categoriesWithProducts.map((group, idx) => {
              const catIndex = CATEGORIES.indexOf(group.category) - 1;
              return (
                <CollectionRow
                  key={group.category}
                  category={group.category}
                  products={group.products}
                  rowIdx={catIndex >= 0 ? catIndex : idx}
                  onCategoryClick={handleCategorySelect}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
