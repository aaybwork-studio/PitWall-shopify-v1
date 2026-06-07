import React, { useEffect, useRef, useState } from 'react';
import { VideoBackground } from './VideoBackground';
import { CollectionCard, Product } from './CollectionGrid';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';

function getImmersivePDPUrl(product: Product): string {
  const title = product.title.toLowerCase();
  if (title.includes('mclaren')) return '/products/mclaren-mcl39';
  if (title.includes('red bull') || title.includes('redbull') || title.includes('rb19')) return '/products/red-bull-rb19';
  if (title.includes('ferrari') || title.includes('sf-23')) return '/products/ferrari-sf-23';
  if (title.includes('mercedes') || title.includes('w14')) return '/products/mercedes-w14';
  if (title.includes('norris') && title.includes('helmet')) return '/products/lando-norris-helmet';
  if (title.includes('schumacher') && title.includes('helmet')) return '/products/schumacher-helmet';
  if (title.includes('verstappen') && title.includes('helmet')) return '/products/verstappen-helmet';
  return product.url || '/collections/all';
}

// ─── Palette ──────────────────────────────────────────────────────────────────
const WM = {
  bg:   '#0F0C09',
  bg2:  '#140F0B',
  gold: '#E8B93B',
  text: '#EDE8E0',
};

// ─── Animated Price ───────────────────────────────────────────────────────────
function AnimatedPrice({ priceString }: { priceString: string }) {
  const numeric = parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
  const displayVal = priceString.includes('.00') ? numeric / 100 : numeric;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = displayVal;
    if (start === end) { setCurrent(end); return; }
    const stepTime = 16;
    const steps = 1000 / stepTime;
    const increment = end / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCurrent(end); clearInterval(timer); }
      else setCurrent(Math.floor(start));
    }, stepTime);
    return () => clearInterval(timer);
  }, [displayVal]);

  return <span>₹{current.toLocaleString('en-IN')}.00</span>;
}

// ─── Hero Ticker ──────────────────────────────────────────────────────────────
interface TickerProps { offset: number; itemRef: React.RefObject<any>; }
function HeroTicker({ offset, itemRef }: TickerProps) {
  const text = "PITWALL ENGINEERING / SPEED CALIBRATION / ";
  const repeats = Array(6).fill(text);
  return (
    <div
      className="ticker-bar absolute bottom-0 left-0 w-full z-20 overflow-hidden py-3"
      style={{ backgroundColor: WM.gold, borderTop: '1px solid rgba(0,0,0,0.12)', borderBottom: '1px solid rgba(0,0,0,0.12)' }}
    >
      <div
        className="flex whitespace-nowrap font-mono text-xs uppercase tracking-widest text-[#0C0C0C] font-bold"
        style={{ transform: `translate3d(${offset}px, 0, 0)` }}
      >
        <div ref={itemRef} className="inline-flex">
          {repeats.map((t, i) => <span key={i} className="inline-block px-4">{t}</span>)}
        </div>
        <div className="inline-flex">
          {repeats.map((t, i) => <span key={i} className="inline-block px-4">{t}</span>)}
        </div>
      </div>
    </div>
  );
}

// ─── F1 Car Silhouette ────────────────────────────────────────────────────────
export function F1CarSilhouette({ color = '#EDE8E0' }: { color?: string }) {
  return (
    <svg
      viewBox="0 0 800 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
      fill={color}
      aria-hidden="true"
    >
      {/* Main chassis body */}
      <rect x="80" y="110" width="580" height="45" rx="8" />
      {/* Cockpit bump */}
      <rect x="310" y="80" width="160" height="35" rx="12" />
      {/* Halo (thin arc above cockpit) */}
      <path d="M320 80 Q390 55 470 80" stroke={color} strokeWidth="6" fill="none" />
      {/* Sidepods */}
      <rect x="240" y="108" width="120" height="25" rx="4" />
      <rect x="440" y="108" width="120" height="25" rx="4" />
      {/* Front wing */}
      <rect x="30" y="148" width="100" height="8" rx="2" />
      <rect x="30" y="140" width="6" height="16" rx="1" />
      <rect x="124" y="140" width="6" height="16" rx="1" />
      {/* Front wing strut */}
      <rect x="70" y="130" width="30" height="20" rx="2" />
      {/* Rear wing */}
      <rect x="640" y="85" width="110" height="8" rx="2" />
      <rect x="680" y="93" width="6" height="25" rx="1" />
      <rect x="704" y="93" width="6" height="25" rx="1" />
      {/* Front wheel */}
      <ellipse cx="150" cy="168" rx="32" ry="32" />
      <ellipse cx="150" cy="168" rx="14" ry="14" fill={WM.bg} />
      {/* Rear wheel */}
      <ellipse cx="620" cy="168" rx="36" ry="36" />
      <ellipse cx="620" cy="168" rx="16" ry="16" fill={WM.bg} />
      {/* Nose cone */}
      <path d="M80 125 L20 148 L80 155 Z" />
    </svg>
  );
}

// ─── Title Card ───────────────────────────────────────────────────────────────
interface TitleCardProps { title: string; unit: string; isYellow?: boolean; subtitle?: string; }
function DesignedTitleCard({ title, unit, isYellow = false, subtitle }: TitleCardProps) {
  return (
    <div
      className="w-full h-full flex flex-col justify-between p-5 select-none rounded-[5px]"
      style={{
        backgroundColor: isYellow ? WM.gold : WM.bg,
        color: isYellow ? '#0C0C0C' : WM.text,
        border: isYellow ? '2px solid #0C0C0C' : `1px solid rgba(232,185,59,0.2)`,
      }}
    >
      <div className="flex justify-between items-start">
        <span className="font-mono text-[9px] tracking-widest uppercase opacity-50">PITWALL / {unit}</span>
        <div className="flex items-center gap-1.5">
          <span className="pulsing-indicator" />
          <span className="font-mono text-[8px] uppercase tracking-wider opacity-50">ACTIVE</span>
        </div>
      </div>
      <div>
        <h2 className="font-display-strict text-4xl lowercase tracking-tighter font-extrabold leading-none mt-2">{title}</h2>
        {subtitle && <p className="font-mono text-[8px] opacity-40 mt-2 uppercase tracking-widest">{subtitle}</p>}
        <div className="border-t border-current/10 pt-2 mt-4 flex justify-between font-mono text-[8px] opacity-40">
          <span>FULL COLLECTION</span>
          <span>→ VIEW ALL</span>
        </div>
      </div>
    </div>
  );
}

// ─── Mock Products ────────────────────────────────────────────────────────────
const mockProducts: Product[] = [
  { title: 'MCLAREN MCL39 CHASSIS', url: '/products/mclaren-mcl39', price: '₹12,499.00', image: '/assets/mclaren.png', specs: '1:18 SCALE / WOKING WIND TUNNEL SPEC' },
  { title: 'ORACLE RED BULL RB19', url: '/products/red-bull-rb19', price: '₹12,499.00', image: '/assets/redbull.png', specs: '1:18 SCALE / MILTON KEYNES LEGACY' },
  { title: 'SCUDERIA FERRARI SF-23', url: '/products/ferrari-sf-23', price: '₹12,499.00', image: '/assets/ferrari.png', specs: '1:18 SCALE / MARANELLO CRIMSON TRIBUTE' },
  { title: 'MERCEDES-AMG W14', url: '/products/mercedes-w14', price: '₹12,499.00', image: '/assets/mercedes.png', specs: '1:18 SCALE / BRACKLEY STEALTH' },
  { title: 'LANDO NORRIS HELMET', url: '/products/lando-norris-helmet', price: '₹7,999.00', image: '/assets/norris.png', specs: '1:2 SCALE / VACUUM VISOR TECH' },
  { title: 'SCHUMACHER 2002 HELMET', url: '/products/schumacher-helmet', price: '₹7,999.00', image: '/assets/schumacher.png', specs: '1:2 SCALE / MARANELLO TRIBUTE' },
  { title: 'VERSTAPPEN 2023 HELMET', url: '/products/verstappen-helmet', price: '₹7,999.00', image: '/assets/verstappen.png', specs: '1:2 SCALE / CHAMPIONSHIP GOLD' },
];

// ─── Helper: which slide is visible based on scrollLeft ───────────────────────
function getSlideIndex(groupEl: HTMLDivElement, scrollLeft: number): number {
  const slides = Array.from(groupEl.children) as HTMLElement[];
  let acc = 0;
  for (let i = 0; i < slides.length; i++) {
    const w = slides[i].offsetWidth;
    if (scrollLeft < acc + w * 0.6) return i;
    acc += w;
  }
  return slides.length - 1;
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface HomepageScrollytellingProps {
  productsJson: string;
  videoPlaylist: string;
  fallbackImages?: Record<string, string>;
  aboutHeading?: string;
  foundingStory?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat3Value?: string;
  stat3Label?: string;
  brandParagraph?: string;
  exploreCta?: string;
  wordmarkFooterUrl?: string;
}

export function HomepageScrollytelling({
  productsJson,
  videoPlaylist,
  fallbackImages = {},
  aboutHeading = 'ABOUT US',
  ctaLabel = 'OUR STORY',
  ctaUrl = '/pages/about',
  foundingStory = 'Pitwall was born from obsession. We build objects that earn their place alongside the machines we worship.',
  wordmarkFooterUrl = '',
}: HomepageScrollytellingProps) {
  // ── Products ────────────────────────────────────────────────────────────────
  const products: Product[] = React.useMemo(() => {
    let parsed: Product[] = [];
    try { parsed = JSON.parse(productsJson); } catch { parsed = []; }
    const rawList = parsed.length > 0 ? parsed : mockProducts;
    const resolvedList = rawList.map(item => ({
      ...item,
      image: (() => {
        const url = item.image || '';
        if (url.startsWith('http') || url.startsWith('//') || url.startsWith('data:')) return url;
        const filename = url.split('/').pop() || '';
        return (fallbackImages && fallbackImages[filename]) ? fallbackImages[filename] : url;
      })()
    }));
    const padded = [...resolvedList];
    let i = 0;
    while (padded.length < 10) {
      padded.push(resolvedList.length > 0
        ? resolvedList[i % resolvedList.length]
        : { title: 'PITWALL CHASSIS', url: '/collections/all', price: '₹12,499.00', image: '', specs: '1:18 SCALE / PRECISION DETAIL' });
      i++;
    }
    return padded;
  }, [productsJson, fallbackImages]);

  const playlist: string[] = React.useMemo(() => {
    try { return JSON.parse(videoPlaylist.replace(/'/g, '"')); }
    catch { return ["/video/F1_helmet_orbiting_white_void_202605251628.mp4", "/video/Formula_1_car_accelerates_white_202605251629.mp4"]; }
  }, [videoPlaylist]);

    // ── Refs ────────────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const group1Ref = useRef<HTMLDivElement>(null);
  const group2Ref = useRef<HTMLDivElement>(null);
  const group3Ref = useRef<HTMLDivElement>(null);
  const group3StageRef = useRef<HTMLDivElement>(null);
  const tickerItemRef = useRef<HTMLDivElement>(null);

  // Scroll snapping accumulator refs to prevent hyper-sensitive snapping
  const scrollAccumulator = useRef(0);
  const scrollDirection = useRef(0);
  const scrollTimeout = useRef<any>(null);

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeIndex1, setActiveIndex1] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(0);
  // Group 3 scroll progress (0→1) as a motion value — drives the drive-scene
  // directly from the rAF loop, so scroll animation never re-renders React.
  const progressMV = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);
  const [tickerOffset, setTickerOffset] = useState(0);
  const tickerVelocity = useRef(1.0);
  const tickerDirection = useRef(1);
  const [featProduct1, setFeatProduct1] = useState<Product>(products[0] || mockProducts[0]);
  const [featProduct2, setFeatProduct2] = useState<Product>(products[4] || mockProducts[4]);
  const [scrollTop, setScrollTop] = useState(0);
  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    if (products && products.length > 0) {
      setFeatProduct1(products[0]);
      setFeatProduct2(products[Math.min(4, products.length - 1)]);
    }
  }, [products]);

  // ── Responsive ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setVh(window.innerHeight);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Lock body scroll ─────────────────────────────────────────────────────────
  // Also strip the lock class on pagehide/bfcache-restore — without this, a
  // browser back/forward navigation away from the homepage can leave
  // `homepage-scrollytelling-active` stuck on <html> (React's cleanup never
  // runs for a bfcache-suspended page), permanently locking scroll on every
  // other page until a hard refresh.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('homepage-scrollytelling-active');
    const release = () => root.classList.remove('homepage-scrollytelling-active');
    window.addEventListener('pagehide', release);
    return () => {
      release();
      window.removeEventListener('pagehide', release);
    };
  }, []);

  // ── Move Footer inside scroll container on desktop, restore on mobile ─────────
  useEffect(() => {
    const footer = document.getElementById('footer');
    if (!footer) return;
    if (isMobile) {
      document.body.appendChild(footer);
    } else {
      const scrollContainer = containerRef.current;
      if (scrollContainer) {
        scrollContainer.appendChild(footer);
      }
    }
    return () => {
      // Restore footer to body on unmount so it's not destroyed with React
      document.body.appendChild(footer);
    };
  }, [isMobile]);

  // ── Ticker animation ─────────────────────────────────────────────────────────
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();
    const tick = (time: number) => {
      const dt = (time - lastTime) / 16.666;
      lastTime = time;
      tickerVelocity.current += (1.0 - tickerVelocity.current) * 0.035;
      const increment = 1.5 * tickerVelocity.current * tickerDirection.current * dt;
      setTickerOffset(prev => {
        const next = prev - increment;
        const limit = tickerItemRef.current ? tickerItemRef.current.offsetWidth : 450;
        if (next < -limit) {
          return next + limit;
        }
        if (next > 0) {
          return next - limit;
        }
        return next;
      });
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // ── Ticker wheel reactivity ──────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const dir = e.deltaY > 0 ? 1 : -1;
      tickerVelocity.current = Math.min(12.0, tickerVelocity.current + Math.abs(e.deltaY) * 0.035);
      tickerDirection.current = dir;
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  // ── Scroll Listener for scrollytelling state ───────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ── Main wheel handler — single scrollLeft system ────────────────────────────
  useEffect(() => {
    if (isMobile) return;

    const isSnapping = { current: false }; // lightweight snapping state
    let snapTimer: any = null;

    const snapTo = (top: number) => {
      const container = containerRef.current;
      if (!container) return;
      isSnapping.current = true;
      container.scrollTo({ top, behavior: 'smooth' });
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        isSnapping.current = false;
      }, 700);
    };

    // ── Group 3 smooth horizontal scrubber (rAF lerp for flowing motion) ──
    let g3Target = 0;
    let g3RafId: number | null = null;
    const syncProgress = (g3: HTMLDivElement) => {
      const max = Math.max(1, g3.scrollWidth - g3.clientWidth);
      progressMV.set(Math.min(1, Math.max(0, g3.scrollLeft / max)));
    };
    const g3Lerp = () => {
      const g3 = group3Ref.current;
      if (!g3) { g3RafId = null; return; }
      const cur = g3.scrollLeft;
      const diff = g3Target - cur;
      if (Math.abs(diff) < 0.4) {
        g3.scrollLeft = g3Target;
        syncProgress(g3);
        g3RafId = null;
        return;
      }
      g3.scrollLeft = cur + diff * 0.16;
      syncProgress(g3);
      g3RafId = requestAnimationFrame(g3Lerp);
    };
    const startG3Lerp = () => { if (g3RafId == null) g3RafId = requestAnimationFrame(g3Lerp); };

    const handleWheel = (e: WheelEvent) => {
      // 1. Maintain accumulator timeout to reset delta on inactivity
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        scrollAccumulator.current = 0;
        scrollDirection.current = 0;
      }, 300);

      // 2. Reset accumulator if direction changes
      const currentDir = e.deltaY > 0 ? 1 : -1;
      if (scrollDirection.current !== currentDir) {
        scrollAccumulator.current = 0;
        scrollDirection.current = currentDir;
      }

      if (isSnapping.current) {
        e.preventDefault();
        return;
      }

      const container = containerRef.current;
      const g1 = group1Ref.current;
      const g2 = group2Ref.current;
      const g3 = group3Ref.current;
      if (!container || !g1 || !g2 || !g3) return;

      const currentScrollTop = container.scrollTop;
      const vh = container.clientHeight;
      const g1Top = g1.offsetTop;
      const g2Top = g2.offsetTop;
      const g3Top = group3StageRef.current ? group3StageRef.current.offsetTop : g3.offsetTop;

      // Define target scroll heights for the 7 states
      const sections = [
        0,              // 0: Hero
        g1Top - vh,     // 1: Manifesto
        g1Top,          // 2: Group 1 (Horizontal)
        g1Top + vh,     // 3: Video Divider (starts immediately after Group 1)
        g2Top,          // 4: Group 2 (Horizontal)
        g3Top,          // 5: Group 3 (Horizontal — About Us)
        g3Top + vh      // 6: Footer (starts immediately after Group 3)
      ];

      // Identify which section index we are currently closest to
      let currentIdx = 0;
      let minDiff = Infinity;
      for (let i = 0; i < sections.length; i++) {
        const diff = Math.abs(currentScrollTop - sections[i]);
        if (diff < minDiff) {
          minDiff = diff;
          currentIdx = i;
        }
      }

      // Helper to evaluate accumulator threshold for snaps
      const threshold = 180;
      const checkAccumulatorThreshold = (delta: number) => {
        scrollAccumulator.current += delta;
        if (Math.abs(scrollAccumulator.current) >= threshold) {
          scrollAccumulator.current = 0;
          return true;
        }
        return false;
      };

      // 1. Group 1 Horizontal Lock
      if (currentIdx === 2) {
        if (Math.abs(currentScrollTop - g1Top) > 2) {
          container.scrollTop = g1Top;
        }
        const maxScroll = g1.scrollWidth - g1.clientWidth;
        const curScroll = g1.scrollLeft;

        if (e.deltaY > 0 && curScroll >= maxScroll - 5) {
          e.preventDefault();
          if (checkAccumulatorThreshold(e.deltaY)) {
            snapTo(sections[3]); // Snap to Video Divider
          }
          return;
        }
        if (e.deltaY < 0 && curScroll <= 5) {
          e.preventDefault();
          if (checkAccumulatorThreshold(e.deltaY)) {
            snapTo(sections[1]); // Snap back to Manifesto
          }
          return;
        }

        // Inside horizontal scrolling: bypass accumulator (keep instant)
        scrollAccumulator.current = 0;
        if (e.deltaY > 0 && curScroll < maxScroll - 5) {
          e.preventDefault();
          g1.scrollLeft = Math.min(maxScroll, curScroll + e.deltaY * 0.85);
          setActiveIndex1(getSlideIndex(g1, g1.scrollLeft));
          return;
        }
        if (e.deltaY < 0 && curScroll > 5) {
          e.preventDefault();
          g1.scrollLeft = Math.max(0, curScroll + e.deltaY * 0.85);
          setActiveIndex1(getSlideIndex(g1, g1.scrollLeft));
          return;
        }
        return;
      }

      // 2. Group 2 Horizontal Lock
      if (currentIdx === 4) {
        if (Math.abs(currentScrollTop - g2Top) > 2) {
          container.scrollTop = g2Top;
        }
        const maxScroll = g2.scrollWidth - g2.clientWidth;
        const curScroll = g2.scrollLeft;

        if (e.deltaY > 0 && curScroll >= maxScroll - 5) {
          e.preventDefault();
          if (checkAccumulatorThreshold(e.deltaY)) {
            snapTo(sections[5]); // Snap to Group 3
          }
          return;
        }
        if (e.deltaY < 0 && curScroll <= 5) {
          e.preventDefault();
          if (checkAccumulatorThreshold(e.deltaY)) {
            snapTo(sections[3]); // Snap back to Video Divider
          }
          return;
        }

        // Inside horizontal scrolling: bypass accumulator
        scrollAccumulator.current = 0;
        if (e.deltaY > 0 && curScroll < maxScroll - 5) {
          e.preventDefault();
          g2.scrollLeft = Math.min(maxScroll, curScroll + e.deltaY * 0.85);
          setActiveIndex2(getSlideIndex(g2, g2.scrollLeft));
          return;
        }
        if (e.deltaY < 0 && curScroll > 5) {
          e.preventDefault();
          g2.scrollLeft = Math.max(0, curScroll + e.deltaY * 0.85);
          setActiveIndex2(getSlideIndex(g2, g2.scrollLeft));
          return;
        }
        return;
      }

      // 3. Group 3 Horizontal Lock — smooth scrubber drives the continuous drive-scene
      if (Math.abs(currentScrollTop - g3Top) < 10) {
        const maxScroll = g3.scrollWidth - g3.clientWidth;
        if (g3RafId == null) g3Target = g3.scrollLeft; // resync target when idle
        const curScroll = g3.scrollLeft;

        // If we are at the end of Group 3 and scrolling down, release to vertical immediately
        if (e.deltaY > 0 && curScroll >= maxScroll - 5) {
          g3Target = maxScroll;
          scrollAccumulator.current = 0;
          return; // Release to vertical (stats/footer)
        }

        if (e.deltaY < 0 && curScroll <= 5) {
          e.preventDefault();
          if (checkAccumulatorThreshold(e.deltaY)) {
            g3Target = 0;
            snapTo(sections[4]); // Snap back to Group 2
          }
          return;
        }

        if (Math.abs(currentScrollTop - g3Top) > 2) {
          container.scrollTop = g3Top;
        }

        // Inside horizontal scrubbing: bypass accumulator
        scrollAccumulator.current = 0;
        if (e.deltaY > 0 && curScroll < maxScroll - 5) {
          e.preventDefault();
          g3Target = Math.min(maxScroll, g3Target + e.deltaY * 0.9);
          startG3Lerp();
          return;
        }
        if (e.deltaY < 0 && curScroll > 5) {
          e.preventDefault();
          g3Target = Math.max(0, g3Target + e.deltaY * 0.9);
          startG3Lerp();
          return;
        }
        return;
      }

      // 3. Video Divider Snapping
      if (currentIdx === 3) {
        e.preventDefault();
        if (checkAccumulatorThreshold(e.deltaY)) {
          if (e.deltaY > 0) {
            snapTo(sections[4]); // Snap to Group 2
          } else if (e.deltaY < 0) {
            snapTo(sections[2]); // Snap to Group 1
          }
        }
        return;
      }

      // 4. Hero Snapping
      if (currentIdx === 0) {
        if (e.deltaY > 0) {
          e.preventDefault();
          if (checkAccumulatorThreshold(e.deltaY)) {
            snapTo(sections[1]); // Snap to Manifesto
          }
        }
        return;
      }

      // 5. Manifesto Snapping
      if (currentIdx === 1) {
        e.preventDefault();
        if (checkAccumulatorThreshold(e.deltaY)) {
          if (e.deltaY > 0) {
            snapTo(sections[2]); // Snap to Group 1
          } else if (e.deltaY < 0) {
            snapTo(sections[0]); // Snap to Hero
          }
        }
        return;
      }

      // 7. Footer Snapping
      if (currentIdx === 6) {
        if (e.deltaY < 0 && currentScrollTop <= sections[6] + 10) {
          e.preventDefault();
          if (checkAccumulatorThreshold(e.deltaY)) {
            snapTo(sections[5]); // Snap to Group 3
          }
        }
        return;
      }

      // Snap-assist: approaching Group 3 from above
      if (e.deltaY > 0 && currentScrollTop > g3Top - vh * 0.6 && currentScrollTop < g3Top - 10) {
        e.preventDefault();
        if (checkAccumulatorThreshold(e.deltaY)) {
          snapTo(sections[5]);
        }
        return;
      }

      // Snap-assist: up from vertical stats back into Group 3
      if (e.deltaY < 0 && currentScrollTop > g3Top + 10 && currentScrollTop < g3Top + vh * 0.4) {
        e.preventDefault();
        if (checkAccumulatorThreshold(e.deltaY)) {
          snapTo(sections[5]);
        }
        return;
      }

      // Snap-assist: between Group 3 and Group 2 scrolling up
      if (e.deltaY < 0 && currentScrollTop > g2Top + 10 && currentScrollTop < g3Top - 10) {
        e.preventDefault();
        if (checkAccumulatorThreshold(e.deltaY)) {
          snapTo(sections[4]);
        }
        return;
      }
    };

    const el = containerRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      if (el) el.removeEventListener('wheel', handleWheel);
      if (snapTimer) clearTimeout(snapTimer);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      if (g3RafId != null) cancelAnimationFrame(g3RafId);
    };
  }, [isMobile]);

  // ── Product swap on featured slide entry ─────────────────────────────────────
  const getRandomProduct = (exclude: Product | null): Product => {
    const pool = products.filter(p => !exclude || p.url !== exclude.url);
    return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : products[0] || mockProducts[0];
  };

  useEffect(() => {
    if (activeIndex1 === 0) setFeatProduct1(prev => getRandomProduct(prev));
  }, [activeIndex1]);

  useEffect(() => {
    if (activeIndex2 === 0) setFeatProduct2(prev => getRandomProduct(prev));
  }, [activeIndex2]);

  // ── Slow idle cycling ────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setFeatProduct1(prev => getRandomProduct(prev));
      setFeatProduct2(prev => getRandomProduct(prev));
    }, 12000);
    return () => clearInterval(t);
  }, []);

  // ── Group 3 car animation ───────────────────────────────────────────────────
  // Spring-smoothed scroll progress → one continuous, flowing drive scene.
  // progressMV is set live inside the rAF scrubber (see handleWheel), and reads
  // scrollWidth/clientWidth fresh each frame, so it is resize-safe with no
  // stale-ref or first-paint glitch.
  const driveProgress = useSpring(progressMV, { stiffness: 110, damping: 30, mass: 0.7 });

  // Single car: travels off-screen-left → resting, with subtle bob + settle lean
  const carXvw = useTransform(driveProgress, [0, 1], [-30, 6]);
  const carBobVh = useTransform(driveProgress, [0, 0.45, 0.75, 1], [0.8, -0.5, 0.4, 0]);
  const carLeanDeg = useTransform(driveProgress, [0, 0.12, 0.9, 1], [-2.2, 0, 0, 0.5]);
  const carTransform = useMotionTemplate`translate3d(${carXvw}vw, ${carBobVh}vh, 0) rotate(${carLeanDeg}deg)`;

  // Parallax depth layers (background drifts slower, road dashes faster → speed)
  const wordmarkX = useTransform(driveProgress, [0, 1], [10, -22]);
  const wordmarkTransform = useMotionTemplate`translate3d(calc(-50% + ${wordmarkX}vw), -50%, 0)`;
  const telemetryX = useTransform(driveProgress, [0, 1], [6, -10]);
  const telemetryTransform = useMotionTemplate`translate3d(${telemetryX}vw, 0, 0)`;
  const roadDashX = useTransform(driveProgress, [0, 1], [0, -140]);
  const roadDashTransform = useMotionTemplate`translate3d(${roadDashX}vw, 0, 0)`;

  // Progress-driven foreground reveals
  const introOpacity = useTransform(driveProgress, [0, 0.14], [1, 0]);
  const storyOpacity = useTransform(driveProgress, [0.5, 0.82], [0, 1]);
  const storyX = useTransform(driveProgress, [0.5, 0.85], [48, 0]);
  const storyTransform = useMotionTemplate`translate3d(${storyX}px, -50%, 0)`;
  const hintOpacity = useTransform(driveProgress, [0, 0.1, 0.85, 1], [1, 0.55, 0.55, 0]);

  // ═══════════════════════════════════════════════════════════════════════════
  //  MOBILE LAYOUT
  // ═══════════════════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <div className="w-full flex flex-col overflow-x-hidden" style={{ backgroundColor: WM.bg, color: WM.text }}>
        {/* Hero */}
        <section className="h-screen w-full relative flex items-center justify-center border-b border-white/10">
          <div className="absolute inset-0 z-0"><VideoBackground playlist={playlist} /></div>
          <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(15,12,9,0.52)' }} />
          <div className="relative z-20 text-center px-4 w-full h-full flex flex-col items-center justify-center">
            {/* Centered logo */}
            <h1 className="hero-title-text select-none absolute z-10 animate-pulse-subtle">PITWALL</h1>
            {/* Tagline on Mobile */}
            <div className="absolute w-full flex justify-center px-4 bottom-[90px]">
              <p className="hero-tagline uppercase tracking-widest text-xs font-mono text-center" style={{ color: WM.gold }}>
                Because cars are not objects
              </p>
            </div>
          </div>
          <HeroTicker offset={tickerOffset} itemRef={tickerItemRef} />
        </section>

        {/* Manifesto */}
        <section className="min-h-[70vh] w-full relative flex flex-col justify-center px-6 py-16 border-b border-white/10">
          <div className="absolute inset-0 z-0"><VideoBackground playlist={playlist} /></div>
          <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(15,12,9,0.52)' }} />
          <div className="relative z-20 max-w-4xl mx-auto w-full text-center">
            <p
              className="text-3xl md:text-[54px] font-normal leading-normal text-center"
              style={{ fontFamily: 'var(--font-manifesto)', color: WM.text }}
            >
              “and life has always been a race.”
            </p>
          </div>
        </section>
        {/* Featured Product 1 */}
        <section className="min-h-screen w-full flex flex-col justify-center px-6 py-16 border-b border-white/10" style={{ backgroundColor: WM.bg }}>
          <div className="max-w-md mx-auto flex flex-col gap-6 w-full">
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: WM.gold }}>// SEASON SPECIMEN</span>
            <div 
              onClick={() => window.location.href = getImmersivePDPUrl(featProduct1)}
              className="aspect-square overflow-hidden rounded-[5px] bg-white cursor-pointer"
            >
              <img src={featProduct1.image} alt={featProduct1.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-display-strict text-xl uppercase tracking-tighter font-extrabold" style={{ color: WM.text }}>{featProduct1.title}</h3>
              <span className="font-mono text-sm font-bold" style={{ color: WM.gold }}>{featProduct1.price}</span>
              <p className="font-body-strict text-xs opacity-70 italic mt-2 leading-relaxed">{featProduct1.specs || "1:18 Scale / Precision Collectible"}</p>
              <button
                onClick={() => window.location.href = getImmersivePDPUrl(featProduct1)}
                className="w-full h-10 border bg-transparent font-mono text-[10px] uppercase tracking-wider font-bold transition-all mt-4 flex items-center justify-center gap-1 cursor-pointer hover:opacity-70"
                style={{ borderColor: WM.text, color: WM.text }}
              >
                ADD TO COLLECTION
              </button>
            </div>
          </div>
        </section>

        {/* Collection Grid */}
        <section className="min-h-screen w-full px-4 py-16 flex flex-col gap-8" style={{ backgroundColor: WM.bg }}>
          <div className="max-w-md mx-auto w-full flex flex-col gap-6">
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: WM.gold }}>// THE COLLECTION</span>
            <div className="grid grid-cols-2 gap-3 w-full">
              {products.slice(0, 6).map((product, idx) => (
                <a key={idx} href={product.url} className="relative flex flex-col justify-end overflow-hidden bg-white text-[#0C0C0C] rounded-[5px] aspect-square shadow-sm">
                  <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-50">
                    <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="relative z-10 p-2.5 bg-white/90 backdrop-blur-sm border-t border-[#0C0C0C]/5 flex justify-between items-center w-full">
                    <span className="font-mono text-[9px] uppercase tracking-wider truncate max-w-[65%] font-semibold">{product.title}</span>
                    <span className="font-mono text-[9px] font-bold">{product.price}</span>
                  </div>
                </a>
              ))}
            </div>
            <button
              onClick={() => window.location.href = '/collections/all'}
              className="w-full h-10 font-mono text-[10px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              style={{ backgroundColor: WM.gold, color: '#0C0C0C' }}
            >
              VIEW FULL COLLECTION <ChevronRight size={14} />
            </button>
          </div>
        </section>
        {/* Video Strip */}
        <div className="w-full" style={{ height: '33vh' }}>
          <video
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
            src={playlist[1] || playlist[0]}
          />
        </div>
        {/* ── GROUP 3: About Us — Mobile stacked ──────────────────────────────────── */}
        <section className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-16 border-b border-white/10 gap-8" style={{ backgroundColor: WM.bg }}>
          <span className="font-mono text-xs uppercase tracking-widest self-start" style={{ color: WM.gold }}>// ABOUT US</span>
          {/* Static car — no scroll animation on mobile (D-15) */}
          <div style={{ width: '80vw', maxWidth: '480px', height: 'auto' }}>
            <F1CarSilhouette color={WM.text} />
          </div>
          <p className="font-body-strict text-base opacity-80 leading-relaxed text-center">
            {foundingStory}
          </p>
          <a
            href={ctaUrl}
            className="h-12 px-8 border bg-transparent font-mono text-[11px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 hover:opacity-70"
            style={{ borderColor: WM.text, color: WM.text }}
          >
            {ctaLabel} →
          </a>
        </section>

        {/* ── HERO VIDEO CALL TO ACTION SECTION — Mobile ─────────────────────────────────────────────── */}
        <section 
          className="w-full relative flex flex-col items-center justify-between py-16 px-6 overflow-hidden" 
          style={{ minHeight: '80vh' }}
        >
          {/* Video background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <VideoBackground playlist={playlist} />
            <div className="absolute inset-0 bg-black/50 z-[1]" />
          </div>

          {/* Top balance label */}
          <div className="relative z-10 font-mono text-[9px] tracking-widest text-white/40 uppercase pt-4">
            // PITWALL / CALIBRATION
          </div>

          {/* Centered logo */}
          <img 
            src={wordmarkFooterUrl || '/assets/wordmark-footer.png'} 
            alt="PITWALL" 
            className="absolute pointer-events-none select-none"
            style={{ 
              width: '85vw', 
              maxWidth: '500px', 
              height: 'auto', 
              top: '45%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              mixBlendMode: 'difference',
              zIndex: 5
            }} 
          />
          
          {/* Bottom buttons */}
          <div className="relative z-20 flex flex-col sm:flex-row justify-center items-center gap-4 w-full px-4 pb-4">
            <a
              href="/pages/collections"
              className="px-6 py-3 border border-[#F6C917]/30 bg-[#F6C917]/10 backdrop-blur-md text-[#F6C917] font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:bg-[#F6C917]/25 hover:border-[#F6C917]/60 flex items-center justify-center cursor-pointer"
              style={{ width: '100%', maxWidth: '200px' }}
            >
              Collections
            </a>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 border border-white/15 bg-white/5 backdrop-blur-md text-white font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:bg-white/15 hover:border-white/30 flex items-center justify-center cursor-pointer"
              style={{ width: '100%', maxWidth: '200px' }}
            >
              Back to top
            </button>
          </div>
        </section>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  DESKTOP LAYOUT
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div ref={containerRef} className="homepage-scroll-container">

      {/* ── Fixed Video Background (For Hero & Manifesto scroll zone) ────────── */}
      {scrollTop < (vh * 2.3) && (
        <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-500">
          <VideoBackground playlist={playlist} />
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(15,12,9,0.58)' }} />
        </div>
      )}

      {/* ── SECTION 1: HERO (Vertical, 100vh) ────────────────────────────── */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden z-10">
        {/* Centered logo */}
        <h1 className="hero-title-text select-none absolute z-10">PITWALL</h1>

        {/* Tagline: "Because cars are not objects" */}
        <div className="absolute flex items-center justify-center bottom-[90px]">
          <p className="hero-tagline uppercase tracking-widest text-sm font-mono text-center px-4" style={{ color: WM.gold }}>
            Because cars are not objects
          </p>
        </div>

        <HeroTicker offset={tickerOffset} itemRef={tickerItemRef} />
      </div>

      {/* ── SECTION 2: MANIFESTO (Vertical, 100vh) ───────────────────────── */}
      <div className="relative w-full h-screen flex items-center justify-center px-16 overflow-hidden z-10">
        <div
          className="max-w-5xl text-center"
          style={{
            opacity: Math.min(1, Math.max(0, (scrollTop - vh * 0.7) / (vh * 0.4))),
            transform: `translateY(${Math.max(0, 40 - ((scrollTop - vh * 0.7) / (vh * 0.4)) * 40)}px)`,
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          <p
            className="text-3xl md:text-[54px] font-normal leading-normal text-center"
            style={{ fontFamily: 'var(--font-manifesto)', color: WM.text }}
          >
            “and life has always been a race.”
          </p>
        </div>
      </div>

      {/* ── GROUP 1: Featured Product → Collection Grid 1 (Horizontal) ─── */}
      <div ref={group1Ref} id="scroll-group-1" className="horizontal-scroll-group z-10" style={{ backgroundColor: WM.bg }}>

        {/* Featured Product */}
        <div className="horizontal-slide" style={{ backgroundColor: WM.bg }}>
          <div className="absolute inset-0 z-0"><div className="ambient-gradient-bg" /></div>
          <div className="relative z-10 w-full h-full flex items-center justify-center px-24">
            <div className="flex gap-12 max-w-6xl w-full h-[70vh] items-center">
              {/* Image */}
              <div 
                onClick={() => window.location.href = getImmersivePDPUrl(featProduct1)}
                className={`flex-[4] h-full rounded-[5px] overflow-hidden bg-white shadow-2xl cursor-pointer transition-all duration-700 ${activeIndex1 >= 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              >
                <img src={featProduct1.image} alt={featProduct1.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              {/* Info */}
              <div className={`flex-[3] flex flex-col justify-between h-full py-6 transition-all duration-700 delay-150 ${activeIndex1 >= 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ color: WM.text }}>
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest" style={{ color: WM.gold }}>
                    // SEASON SPECIMEN
                  </span>
                  <h3 className="font-display-strict text-4xl uppercase tracking-tighter font-extrabold leading-none">
                    {featProduct1.title}
                  </h3>
                  <div className="border-t border-b border-white/10 py-3 my-2 flex items-baseline justify-between font-mono">
                    <span className="text-[10px] opacity-45 uppercase">PRICE:</span>
                    <span className="text-2xl font-bold" style={{ color: WM.gold }}>
                      {activeIndex1 >= 0 ? <AnimatedPrice priceString={featProduct1.price} /> : featProduct1.price}
                    </span>
                  </div>
                  <p className="font-body-strict text-sm opacity-60 italic leading-relaxed">
                    {featProduct1.specs || '1:18 Scale / Precision Collectible'}
                  </p>
                </div>
                <button
                  onClick={() => window.location.href = getImmersivePDPUrl(featProduct1)}
                  className="w-full max-w-[240px] h-12 border bg-transparent font-mono text-[11px] uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-70"
                  style={{ borderColor: WM.text, color: WM.text }}
                >
                  ADD TO COLLECTION <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Grid 1 (wider than viewport) */}
        <div className="horizontal-slide grid-slide-wide" style={{ backgroundColor: WM.bg }}>
          <div className="absolute inset-0 z-0"><div className="ambient-gradient-bg" /></div>
          <div className="relative z-10 h-full flex items-center px-12">
            <div className="grid-cols-custom-1">
              {/* Col 1: two stacked */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <CollectionCard product={products[0]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} />
                <CollectionCard product={products[1]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '100ms' } as React.CSSProperties} />
              </div>
              {/* Col 2: two stacked */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <CollectionCard product={products[2]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '150ms' } as React.CSSProperties} />
                <CollectionCard product={products[3]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '200ms' } as React.CSSProperties} />
              </div>
              {/* Col 3: tall + title card */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <div className={`flex-[7] min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '250ms' } as React.CSSProperties}>
                  <CollectionCard product={products[4]} className="w-full h-full" isTall={true} />
                </div>
                <div className={`flex-[3] min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '300ms' } as React.CSSProperties}>
                  <DesignedTitleCard title="chassis" unit="01" isYellow={true} subtitle="PITWALL 1:18 SCALE" />
                </div>
              </div>
              {/* Col 4: large + two small */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <CollectionCard product={products[5]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '350ms' } as React.CSSProperties} />
                <div className="flex-[1] flex gap-4 min-h-0">
                  <CollectionCard product={products[6]} className={`flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '400ms' } as React.CSSProperties} />
                  <CollectionCard product={products[7]} className={`flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '450ms' } as React.CSSProperties} />
                </div>
              </div>
              {/* Col 5: tall product */}
              <div className={`h-full reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '500ms' } as React.CSSProperties}>
                <CollectionCard product={products[8]} className="w-full h-full" isTall={true} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── SECTION 3: 1/3 VIDEO DIVIDER (Vertical, 33.333vh) ───────────── */}
      <div className="relative w-full overflow-hidden z-10" style={{ height: '33.333vh' }}>
        <video
          autoPlay muted loop playsInline
          className="w-full h-full object-cover"
          src={playlist[1] || playlist[0]}
        />
      </div>

      {/* ── GROUP 2: Flipped Featured → Flipped Grid 2 (Horizontal) ─────── */}
      <div ref={group2Ref} id="scroll-group-2" className="horizontal-scroll-group z-10" style={{ backgroundColor: WM.bg2 }}>

        {/* Flipped Featured Product */}
        <div className="horizontal-slide" style={{ backgroundColor: WM.bg2 }}>
          <div className="absolute inset-0 z-0"><div className="ambient-gradient-bg" /></div>
          <div className="relative z-10 w-full h-full flex items-center justify-center px-24">
            <div className="flex gap-12 max-w-6xl w-full h-[70vh] items-center">
              {/* Info (left — flipped) */}
              <div className={`flex-[3] flex flex-col justify-between h-full py-6 transition-all duration-700 ${activeIndex2 === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ color: WM.text }}>
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest" style={{ color: WM.gold }}>
                    // COLLECTOR SERIES
                  </span>
                  <h3 className="font-display-strict text-4xl uppercase tracking-tighter font-extrabold leading-none">
                    {featProduct2.title}
                  </h3>
                  <div className="border-t border-b border-white/10 py-3 my-2 flex items-baseline justify-between font-mono">
                    <span className="text-[10px] opacity-45 uppercase">PRICE:</span>
                    <span className="text-2xl font-bold" style={{ color: WM.gold }}>
                      {activeIndex2 === 0 ? <AnimatedPrice priceString={featProduct2.price} /> : featProduct2.price}
                    </span>
                  </div>
                  <p className="font-body-strict text-sm opacity-60 italic leading-relaxed">
                    {featProduct2.specs || '1:2 Scale / Precision Helmet Detail'}
                  </p>
                </div>
                <button
                  onClick={() => window.location.href = getImmersivePDPUrl(featProduct2)}
                  className="w-full max-w-[240px] h-12 border bg-transparent font-mono text-[11px] uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-70"
                  style={{ borderColor: WM.text, color: WM.text }}
                >
                  ADD TO COLLECTION <ArrowUpRight size={14} />
                </button>
              </div>
              {/* Image (right — flipped) */}
              <div 
                onClick={() => window.location.href = getImmersivePDPUrl(featProduct2)}
                className={`flex-[4] h-full rounded-[5px] overflow-hidden bg-white shadow-2xl cursor-pointer transition-all duration-700 delay-150 ${activeIndex2 === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
              >
                <img src={featProduct2.image} alt={featProduct2.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Flipped Collection Grid 2 (wider than viewport) */}
        <div className="horizontal-slide grid-slide-wide" style={{ backgroundColor: WM.bg2 }}>
          <div className="absolute inset-0 z-0"><div className="ambient-gradient-bg" /></div>
          <div className="relative z-10 h-full flex items-center px-12">
            <div className="grid-cols-custom-2">
              {/* Col 1: tall + title card */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <div className={`flex-[7] min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`}>
                  <CollectionCard product={products[1]} className="w-full h-full" isTall={true} />
                </div>
                <div className={`flex-[3] min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '100ms' } as React.CSSProperties}>
                  <DesignedTitleCard title="helmets" unit="02" subtitle="SCALE 1:2 REPLICA" />
                </div>
              </div>
              {/* Col 2: two stacked */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <CollectionCard product={products[2]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '150ms' } as React.CSSProperties} />
                <CollectionCard product={products[3]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '200ms' } as React.CSSProperties} />
              </div>
              {/* Col 3: two stacked */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <CollectionCard product={products[4]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '250ms' } as React.CSSProperties} />
                <CollectionCard product={products[5]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '300ms' } as React.CSSProperties} />
              </div>
              {/* Col 4: tall product */}
              <div className={`h-full reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '350ms' } as React.CSSProperties}>
                <CollectionCard product={products[6]} className="w-full h-full" isTall={true} />
              </div>
              {/* Col 5: one + two small */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <CollectionCard product={products[7]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '400ms' } as React.CSSProperties} />
                <div className="flex-[1] flex gap-4 min-h-0">
                  <CollectionCard product={products[8]} className={`flex-1 min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '450ms' } as React.CSSProperties} />
                  <CollectionCard product={products[0]} className={`flex-1 min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '500ms' } as React.CSSProperties} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── GROUP 3: About Us — single continuous "drive" scene ─────────── */}
      <div
        ref={group3StageRef}
        className="group3-stage z-10"
        style={{ position: 'relative', height: '100vh', overflow: 'hidden', backgroundColor: WM.bg }}
      >
        {/* Ambient depth gradient */}
        <div className="absolute inset-0 z-0"><div className="ambient-gradient-bg" /></div>

        {/* Parallax giant wordmark — one continuous backdrop */}
        <motion.span
          className="g3-wordmark font-display-strict select-none"
          style={{ transform: wordmarkTransform, color: WM.text }}
        >
          {aboutHeading}
        </motion.span>

        {/* Parallax telemetry waveform — continuous */}
        <motion.svg
          className="g3-telemetry" viewBox="0 0 1920 1080" preserveAspectRatio="none"
          style={{ transform: telemetryTransform }}
        >
          <polyline stroke={WM.gold} strokeWidth="1.5" fill="none" opacity="0.30"
            points="0,560 240,500 420,610 640,470 880,580 1120,520 1360,540 1620,480 1920,540" />
          <polyline stroke={WM.text} strokeWidth="1" fill="none" opacity="0.10"
            points="0,620 240,560 480,640 720,520 960,600 1200,560 1440,600 1680,540 1920,600" />
          <line x1="0" y1="400" x2="1920" y2="400" stroke={WM.text} strokeWidth="0.5" opacity="0.08" />
          <line x1="0" y1="700" x2="1920" y2="700" stroke={WM.text} strokeWidth="0.5" opacity="0.08" />
        </motion.svg>

        {/* Continuous road + moving speed dashes */}
        <div className="g3-road">
          <div className="g3-road-line" style={{ backgroundColor: WM.text }} />
          <motion.div
            className="g3-road-dashes"
            style={{
              transform: roadDashTransform,
              backgroundImage: `repeating-linear-gradient(90deg, ${WM.gold} 0 40px, transparent 40px 120px)`,
            }}
          />
        </div>

        {/* Invisible horizontal scrubber — provides scroll distance only */}
        <div ref={group3Ref} id="scroll-group-3" className="horizontal-scroll-group g3-track">
          <div className="horizontal-slide" />
          <div className="horizontal-slide" />
          <div className="horizontal-slide" />
        </div>

        {/* Entry label — fades out as the journey begins */}
        <motion.div className="g3-fg-label" style={{ opacity: introOpacity, color: WM.gold }}>
          <span className="block font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">// PITWALL</span>
          <span className="block font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">ABOUT US / 01</span>
        </motion.div>

        {/* Founding story + CTA — fades/slides in as the car arrives */}
        <motion.div className="g3-story" style={{ opacity: storyOpacity, transform: storyTransform, color: WM.text }}>
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: WM.gold }}>
            // PITWALL / ORIGIN
          </span>
          <p className="font-body-strict text-base opacity-80 leading-relaxed">
            {foundingStory}
          </p>
          <a href={ctaUrl} className="g3-cta font-mono" style={{ borderColor: WM.text, color: WM.text }}>
            {ctaLabel} →
          </a>
        </motion.div>

        {/* The single car — travels continuously across the whole scene */}
        <motion.div className="g3-car" style={{ transform: carTransform }}>
          <F1CarSilhouette color={WM.text} />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="g3-hint font-mono"
          style={{ opacity: hintOpacity, color: WM.text }}
        >
          SCROLL →
        </motion.div>
      </div>

      {/* ── HERO VIDEO CALL TO ACTION SECTION (after Group 3, before Footer) ─── */}
      <div 
        className="w-full relative flex flex-col items-center justify-between py-16 px-6 z-10 overflow-hidden" 
        style={{ minHeight: '100vh' }}
      >
        {/* Video background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <VideoBackground playlist={playlist} />
          <div className="absolute inset-0 bg-black/50 z-[1]" />
        </div>

        {/* Top balance label */}
        <div className="relative z-10 font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase pt-6">
          // PITWALL / SPEED CALIBRATION
        </div>

        {/* Centered logo */}
        <img 
          src={wordmarkFooterUrl || '/assets/wordmark-footer.png'} 
          alt="PITWALL" 
          className="absolute pointer-events-none select-none"
          style={{ 
            width: '75vw', 
            maxWidth: '1000px', 
            height: 'auto', 
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'difference',
            zIndex: 5
          }} 
        />

        {/* Bottom buttons */}
        <div className="relative z-20 flex flex-row flex-wrap justify-center items-center gap-6 pb-6">
          <a
            href="/pages/collections"
            className="px-8 py-3.5 border border-[#F6C917]/30 bg-[#F6C917]/10 backdrop-blur-md text-[#F6C917] font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:bg-[#F6C917]/25 hover:border-[#F6C917]/60 flex items-center justify-center cursor-pointer"
          >
            Collections
          </a>
          <button
            onClick={() => {
              const container = containerRef.current;
              if (container) {
                container.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="px-8 py-3.5 border border-white/15 bg-white/5 backdrop-blur-md text-white font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:bg-white/15 hover:border-white/30 flex items-center justify-center cursor-pointer"
          >
            Back to top
          </button>
        </div>
      </div>
    </div>
  );
}
