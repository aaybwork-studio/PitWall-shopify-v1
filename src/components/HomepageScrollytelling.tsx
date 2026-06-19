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
  bg:   'var(--pw-bg, #0F0C09)',
  bg2:  'var(--pw-bg2, #140F0B)',
  gold: 'var(--pw-gold, #E8B93B)',
  text: 'var(--pw-text, #EDE8E0)',
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

// ── About Us Marquee Ticker ──────────────────────────────────────────────────
interface AboutUsMarqueeTickerProps {
  style?: React.CSSProperties;
}
function AboutUsMarqueeTicker({ style = {} }: AboutUsMarqueeTickerProps) {
  const repeats = Array(6).fill("PITWALL ENGINEERING / ABOUT US / ");
  return (
    <div
      className="animate-marquee-container ticker-bar w-full py-3"
      style={{
        backgroundColor: 'var(--pw-gold, #E8B93B)',
        borderTop: '1px solid var(--pw-border, rgba(12,12,12,0.12))',
        borderBottom: '1px solid var(--pw-border, rgba(12,12,12,0.12))',
        ...style
      }}
    >
      <div className="animate-marquee-content flex whitespace-nowrap font-mono text-xs uppercase tracking-widest text-[#0C0C0C] font-bold">
        <div className="flex">
          {repeats.map((t, i) => <span key={i} className="inline-block px-4">{t}</span>)}
        </div>
        <div className="flex">
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
  manifestoImage1?: string;
  manifestoTagline1?: string;
  manifestoImage2?: string;
  manifestoTagline2?: string;
  manifestoImage3?: string;
  manifestoTagline3?: string;
}

export function HomepageScrollytelling({
  productsJson,
  videoPlaylist,
  fallbackImages = {},
  aboutHeading = 'ABOUT US',
  ctaLabel = 'OUR STORY',
  ctaUrl = '/pages/about',
  foundingStory = 'Pitwall was born from obsession. We build objects that earn their place alongside the machines we worship.',
  stat1Value = 'ZERO',
  stat1Label = 'COMPROMISE',
  stat2Value = 'ONE',
  stat2Label = 'PURSUIT',
  stat3Value = 'INFINITE',
  stat3Label = 'PRECISION',
  manifestoImage1 = '',
  manifestoTagline1 = 'THE RACE.',
  manifestoImage2 = '',
  manifestoTagline2 = 'THE MOMENT.',
  manifestoImage3 = '',
  manifestoTagline3 = 'YOURS.',
}: HomepageScrollytellingProps) {
  // stat1Value/stat1Label/stat2Value/stat2Label/stat3Value/stat3Label remain valid
  // schema-driven props (Plan 01's prior phase) but are no longer rendered now that
  // the Manifesto section has been redesigned into a 3-panel image reveal (Phase 02.5).
  void stat1Value; void stat1Label; void stat2Value; void stat2Label; void stat3Value; void stat3Label; void aboutHeading;
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
  const heroRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const activeSectionIdx = useRef(0);
  const isAnimating = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeIndex1, setActiveIndex1] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(0);
  // Group 3 scroll progress (0→1) as a motion value — drives the drive-scene
  // directly from the rAF loop, so scroll animation never re-renders React.
  const progressMV = useMotionValue(0);
  // Manifesto section's own arrival progress (0→1), derived from scrollTop/vh —
  // drives the staggered scale-up-from-center panel reveal via reveal-active class.
  const manifestoProgressMV = useMotionValue(0);
  // Defined per spec for potential motion-value-driven consumers; the panel reveal
  // itself uses the simpler CSS .manifesto-panel/.reveal-active class pair (see JSX below).
  const manifestoPanelOpacity = useTransform(manifestoProgressMV, [0, 0.6], [0, 1]);
  const manifestoPanelScale = useTransform(manifestoProgressMV, [0, 0.6], [0.88, 1]);
  void manifestoPanelOpacity; void manifestoPanelScale;
  const [manifestoRevealed, setManifestoRevealed] = useState(false);
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

  // ── Dynamic Section Offset calculation ─────────────────────────────────────
  const getSectionOffsets = (): number[] => {
    const container = containerRef.current;
    if (!container) return [];
    
    const offsets: number[] = [];
    const vhVal = window.innerHeight;
    
    // Section 0: Hero
    offsets.push(heroRef.current ? heroRef.current.offsetTop : 0);
    // Section 1: Manifesto
    offsets.push(manifestoRef.current ? manifestoRef.current.offsetTop : vhVal);
    // Section 2: Group 1
    offsets.push(group1Ref.current ? group1Ref.current.offsetTop : 2 * vhVal);
    // Section 3: Group 2
    offsets.push(group2Ref.current ? group2Ref.current.offsetTop : 3 * vhVal + vhVal / 3);
    // Section 4: Group 3
    offsets.push(group3StageRef.current ? group3StageRef.current.offsetTop : 4 * vhVal + vhVal / 3);
    // Section 5: CTA Section
    offsets.push(ctaRef.current ? ctaRef.current.offsetTop : 5 * vhVal + vhVal / 3);
    
    // Section 6: Footer (Max Scroll Top)
    const footer = document.getElementById('footer');
    if (footer && footer.parentElement === container) {
      offsets.push(footer.offsetTop);
    } else {
      const maxScroll = container.scrollHeight - container.clientHeight;
      offsets.push(maxScroll);
    }
    
    return offsets;
  };

  // ── Programmatic smooth transition animation ────────────────────────────────
  const transitionToSection = (targetIdx: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    const offsets = getSectionOffsets();
    if (targetIdx < 0 || targetIdx >= offsets.length) return;
    
    const targetScrollTop = offsets[targetIdx];
    const startScrollTop = container.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    
    if (Math.abs(distance) < 2) {
      container.scrollTop = targetScrollTop;
      activeSectionIdx.current = targetIdx;
      return;
    }
    
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    isAnimating.current = true;
    activeSectionIdx.current = targetIdx;
    
    const duration = 650; // duration in ms
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: easeInOutCubic
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
      container.scrollTop = startScrollTop + distance * ease;
      
      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        container.scrollTop = targetScrollTop;
        animationFrameId.current = null;
        
        // Cooldown lockout period to allow scroll momentum to decay
        setTimeout(() => {
          isAnimating.current = false;
        }, 300);
      }
    };
    
    animationFrameId.current = requestAnimationFrame(animate);
  };

  // ── Scroll Listener for scrollytelling state ───────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
      
      // Update active section index on manual scroll (scrollbar/keys) when not animating
      if (!isAnimating.current) {
        const currentScroll = container.scrollTop;
        const offsets = getSectionOffsets();
        let closestIdx = 0;
        let minDiff = Infinity;
        
        offsets.forEach((offset, idx) => {
          const diff = Math.abs(currentScroll - offset);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });
        
        activeSectionIdx.current = closestIdx;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // ── Manifesto arrival progress (drives the 3-panel staggered reveal) ───────
  useEffect(() => {
    const start = vh * 0.7;
    const end = vh * 1.3;
    const progress = Math.min(1, Math.max(0, (scrollTop - start) / (end - start)));
    manifestoProgressMV.set(progress);
    if (progress > 0.05) {
      setManifestoRevealed(true);
    }
  }, [scrollTop, vh]);

  // ── Vertical section snapping is handled entirely by native CSS
  // scroll-snap (see .homepage-scroll-container / .scroll-snap-section in
  // index.css) — the browser scrolls naturally and settles on the nearest
  // section on its own, with no custom JS, no dead zones, no yank-back.
  //
  // The only thing JS needs to do is redirect vertical wheel input into
  // horizontal scrollLeft while a product-grid group is the active
  // full-screen section, and release it back to native vertical scroll once
  // the user reaches either end of that group's horizontal scroll range.
  useEffect(() => {
    if (isMobile) return;
    const container = containerRef.current;
    if (!container) return;

    const syncProgress = (g3: HTMLDivElement) => {
      const max = Math.max(1, g3.scrollWidth - g3.clientWidth);
      progressMV.set(Math.min(1, Math.max(0, g3.scrollLeft / max)));
    };

    let g3Target = 0;
    let g3RafId: number | null = null;
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
      g3.scrollLeft = cur + diff * 0.32;
      syncProgress(g3);
      g3RafId = requestAnimationFrame(g3Lerp);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isAnimating.current) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 4) return; // filter minor trackpad jitter

      const offsets = getSectionOffsets();
      const currentIdx = activeSectionIdx.current;

      // Check if current section is horizontal
      const isHorizontal = currentIdx === 2 || currentIdx === 3 || currentIdx === 4;

      if (isHorizontal) {
        let trackEl: HTMLDivElement | null = null;
        if (currentIdx === 2) trackEl = group1Ref.current;
        else if (currentIdx === 3) trackEl = group2Ref.current;
        else if (currentIdx === 4) trackEl = group3Ref.current;

        if (trackEl) {
          const maxScroll = trackEl.scrollWidth - trackEl.clientWidth;
          const refScrollLeft = (currentIdx === 4 && g3RafId != null) ? g3Target : trackEl.scrollLeft;
          
          const atStart = refScrollLeft <= 0;
          const atEnd = refScrollLeft >= maxScroll - 1;

          if (delta > 0 && atEnd) {
            transitionToSection(currentIdx + 1);
            return;
          }
          if (delta < 0 && atStart) {
            transitionToSection(currentIdx - 1);
            return;
          }

          // Horizontal scroll
          if (currentIdx === 4) {
            g3Target = Math.max(0, Math.min(maxScroll, refScrollLeft + delta));
            if (g3RafId == null) g3RafId = requestAnimationFrame(g3Lerp);
          } else {
            trackEl.scrollLeft = Math.max(0, Math.min(maxScroll, trackEl.scrollLeft + delta));
            if (currentIdx === 2) {
              setActiveIndex1(getSlideIndex(trackEl, trackEl.scrollLeft));
            } else if (currentIdx === 3) {
              setActiveIndex2(getSlideIndex(trackEl, trackEl.scrollLeft));
            }
          }

          // Lock vertical scroll position
          const targetY = offsets[currentIdx];
          if (Math.abs(container.scrollTop - targetY) > 1) {
            container.scrollTop = targetY;
          }
          return;
        }
      }

      // Vertical section transitions
      if (delta > 0) {
        if (currentIdx < offsets.length - 1) {
          transitionToSection(currentIdx + 1);
        }
      } else {
        if (currentIdx > 0) {
          transitionToSection(currentIdx - 1);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
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
  const roadDashX = useTransform(driveProgress, [0, 1], [0, -140]);
  const roadDashTransform = useMotionTemplate`translate3d(${roadDashX}vw, 0, 0)`;

  // Progress-driven foreground reveals
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
        <section className="h-screen w-full relative flex items-center justify-center border-b border-[var(--pw-border)]">
          <div className="absolute inset-0 z-0"><VideoBackground playlist={playlist} /></div>
          <div className="relative z-20 text-center px-4 w-full h-full flex flex-col items-center justify-center">
            {/* Centered logo */}
            <h1 className="hero-title-text select-none absolute z-10 animate-pulse-subtle" style={{ mixBlendMode: 'difference', opacity: 0.4 }}>PITWALL</h1>
          </div>
          <HeroTicker offset={tickerOffset} itemRef={tickerItemRef} />
        </section>

        {/* Manifesto */}
        <section className="manifesto-panel relative w-full h-[55vh] overflow-hidden reveal-active">
          <img className="absolute inset-0 w-full h-full object-cover" src={manifestoImage1} alt="" loading="lazy" />
          <span className="font-display-strict select-none absolute uppercase top-6 left-6" style={{ mixBlendMode: 'difference', color: '#FFFFFF' }}>{manifestoTagline1}</span>
        </section>
        <section className="manifesto-panel relative w-full h-[55vh] overflow-hidden reveal-active">
          <img className="absolute inset-0 w-full h-full object-cover" src={manifestoImage2} alt="" loading="lazy" />
          <span className="font-display-strict select-none absolute uppercase top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center" style={{ mixBlendMode: 'difference', color: '#FFFFFF' }}>{manifestoTagline2}</span>
        </section>
        <section className="manifesto-panel relative w-full h-[55vh] overflow-hidden reveal-active">
          <img className="absolute inset-0 w-full h-full object-cover" src={manifestoImage3} alt="" loading="lazy" />
          <span className="font-display-strict select-none absolute uppercase bottom-6 right-6 text-right" style={{ mixBlendMode: 'difference', color: '#FFFFFF' }}>{manifestoTagline3}</span>
        </section>
        {/* Featured Product 1 */}
        <section className="min-h-screen w-full flex flex-col justify-center px-6 py-16 border-b border-[var(--pw-border)]" style={{ backgroundColor: WM.bg }}>
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
        <AboutUsMarqueeTicker style={{ position: 'relative', top: 'auto', bottom: 'auto' }} />
        <section 
          className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-16 border-b border-[var(--pw-border)] gap-8 relative overflow-hidden z-20" 
          style={{ backgroundColor: WM.bg, zIndex: 20 }}
        >
          
          <div className="relative z-10 w-full max-w-md border border-[var(--pw-border)] p-8 relative overflow-hidden backdrop-blur-md bg-black/5 flex flex-col items-center gap-6">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--pw-gold)]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[var(--pw-gold)]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[var(--pw-gold)]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[var(--pw-gold)]" />

            {/* Static car with no telemetry */}
            <div className="relative my-4" style={{ width: '80vw', maxWidth: '360px', height: 'auto' }}>
              <F1CarSilhouette color={WM.text} />
            </div>

            <p className="font-body-strict text-sm opacity-80 leading-relaxed text-center">
              {foundingStory}
            </p>
            <a
              href={ctaUrl}
              className="w-full h-12 border bg-transparent font-mono text-[11px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 hover:opacity-70"
              style={{ borderColor: WM.text, color: WM.text }}
            >
              {ctaLabel} →
            </a>
          </div>
        </section>

        {/* ── HERO VIDEO CALL TO ACTION SECTION — Mobile ─────────────────────────────────────────────── */}
        <section 
          className="w-full h-screen relative flex items-center justify-center overflow-hidden" 
        >
          {/* Video background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <VideoBackground playlist={playlist} />
          </div>

          {/* Centered logo */}
          <h1 
            className="hero-title-text select-none absolute z-10 animate-pulse-subtle" 
            style={{ mixBlendMode: 'difference', opacity: 0.4 }}
          >
            PITWALL
          </h1>
          
          {/* Bottom buttons */}
          <div className="absolute z-20 flex flex-col sm:flex-row justify-center items-center gap-4 w-full px-4 bottom-[90px]">
            <a
              href="/collections/all"
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
      {scrollTop < (vh * 1) && (
        <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-500">
          <VideoBackground playlist={playlist} />
        </div>
      )}

      {/* ── SECTION 1: HERO (Vertical, 100vh) ────────────────────────────── */}
      <div ref={heroRef} className="scroll-snap-section relative w-full h-screen flex flex-col items-center justify-center overflow-hidden z-10">
        {/* Centered logo */}
        <h1 className="hero-title-text select-none absolute z-10" style={{ mixBlendMode: 'difference', opacity: 0.4 }}>PITWALL</h1>

        <HeroTicker offset={tickerOffset} itemRef={tickerItemRef} />
      </div>

      {/* ── SECTION 2: MANIFESTO (Vertical, 100vh, 3-panel full-bleed reveal) ── */}
      <div ref={manifestoRef} className="scroll-snap-section relative w-full h-screen flex flex-row overflow-hidden z-10">
        <div className={`manifesto-panel relative w-[33.333vw] h-full overflow-hidden${manifestoRevealed ? ' reveal-active' : ''}`} style={{ transitionDelay: '0ms' }}>
          <img className="absolute inset-0 w-full h-full object-cover" src={manifestoImage1} alt="" loading="lazy" />
          <span className="font-display-strict select-none absolute uppercase text-3xl md:text-5xl top-8 left-8" style={{ mixBlendMode: 'difference', color: '#FFFFFF' }}>{manifestoTagline1}</span>
        </div>
        <div className={`manifesto-panel relative w-[33.333vw] h-full overflow-hidden${manifestoRevealed ? ' reveal-active' : ''}`} style={{ transitionDelay: '130ms' }}>
          <img className="absolute inset-0 w-full h-full object-cover" src={manifestoImage2} alt="" loading="lazy" />
          <span className="font-display-strict select-none absolute uppercase text-3xl md:text-5xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center" style={{ mixBlendMode: 'difference', color: '#FFFFFF' }}>{manifestoTagline2}</span>
        </div>
        <div className={`manifesto-panel relative w-[33.333vw] h-full overflow-hidden${manifestoRevealed ? ' reveal-active' : ''}`} style={{ transitionDelay: '260ms' }}>
          <img className="absolute inset-0 w-full h-full object-cover" src={manifestoImage3} alt="" loading="lazy" />
          <span className="font-display-strict select-none absolute uppercase text-3xl md:text-5xl bottom-8 right-8 text-right" style={{ mixBlendMode: 'difference', color: '#FFFFFF' }}>{manifestoTagline3}</span>
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
                  <div className="border-t border-b border-[var(--pw-border)] py-3 my-2 flex items-baseline justify-between font-mono">
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
          {/* pt-16 (64px) offsets centering by the fixed nav-header's height —
              without it, the header eats into the grid's top margin, leaving
              a visibly larger gap below than above. */}
          <div className="relative z-10 h-full flex items-center px-12 pt-16">
            <div className="grid-cols-custom-1">
              {/* Col 1: two stacked */}
              <div className="flex flex-col gap-[2px] h-full justify-between">
                <CollectionCard product={products[0]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} />
                <CollectionCard product={products[1]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '100ms' } as React.CSSProperties} />
              </div>
              {/* Col 2: two stacked */}
              <div className="flex flex-col gap-[2px] h-full justify-between">
                <CollectionCard product={products[2]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '150ms' } as React.CSSProperties} />
                <CollectionCard product={products[3]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '200ms' } as React.CSSProperties} />
              </div>
              {/* Col 3: tall + title card */}
              <div className="flex flex-col gap-[2px] h-full justify-between">
                <div className={`flex-[7] min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '250ms' } as React.CSSProperties}>
                  <CollectionCard product={products[4]} className="w-full h-full" isTall={true} />
                </div>
                <div className={`flex-[3] min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '300ms' } as React.CSSProperties}>
                  <DesignedTitleCard title="chassis" unit="01" isYellow={true} subtitle="PITWALL 1:18 SCALE" />
                </div>
              </div>
              {/* Col 4: large + two small */}
              <div className="flex flex-col gap-[2px] h-full justify-between">
                <CollectionCard product={products[5]} className={`w-full flex-[7] min-h-0 reveal-dashboard-item ${activeIndex1 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '350ms' } as React.CSSProperties} />
                <div className="flex-[3] flex gap-[2px] min-h-0">
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
                  <div className="border-t border-b border-[var(--pw-border)] py-3 my-2 flex items-baseline justify-between font-mono">
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
          {/* pt-16 (64px) offsets centering by the fixed nav-header's height —
              without it, the header eats into the grid's top margin, leaving
              a visibly larger gap below than above. */}
          <div className="relative z-10 h-full flex items-center px-12 pt-16">
            <div className="grid-cols-custom-2">
              {/* Col 1: tall + title card */}
              <div className="flex flex-col gap-[2px] h-full justify-between">
                <div className={`flex-[7] min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`}>
                  <CollectionCard product={products[1]} className="w-full h-full" isTall={true} />
                </div>
                <div className={`flex-[3] min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '100ms' } as React.CSSProperties}>
                  <DesignedTitleCard title="helmets" unit="02" subtitle="SCALE 1:2 REPLICA" />
                </div>
              </div>
              {/* Col 2: two stacked */}
              <div className="flex flex-col gap-[2px] h-full justify-between">
                <CollectionCard product={products[2]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '150ms' } as React.CSSProperties} />
                <CollectionCard product={products[3]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '200ms' } as React.CSSProperties} />
              </div>
              {/* Col 3: two stacked */}
              <div className="flex flex-col gap-[2px] h-full justify-between">
                <CollectionCard product={products[4]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '250ms' } as React.CSSProperties} />
                <CollectionCard product={products[5]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '300ms' } as React.CSSProperties} />
              </div>
              {/* Col 4: tall product */}
              <div className={`h-full reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '350ms' } as React.CSSProperties}>
                <CollectionCard product={products[6]} className="w-full h-full" isTall={true} />
              </div>
              {/* Col 5: one + two small */}
              <div className="flex flex-col gap-[2px] h-full justify-between">
                <CollectionCard product={products[7]} className={`w-full flex-[7] min-h-0 reveal-dashboard-item ${activeIndex2 >= 1 ? 'reveal-active' : ''}`} style={{ transitionDelay: '400ms' } as React.CSSProperties} />
                <div className="flex-[3] flex gap-[2px] min-h-0">
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
        className="group3-stage z-20"
        style={{ position: 'relative', height: '100vh', overflow: 'hidden', backgroundColor: WM.bg, zIndex: 20 }}
      >
        {/* Ticker element section divider */}
        <AboutUsMarqueeTicker style={{ top: 0, bottom: 'auto' }} />

        {/* Ambient depth gradient */}
        <div className="absolute inset-0 z-0"><div className="ambient-gradient-bg" /></div>

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

        {/* Founding story + CTA — fades/slides in as the car arrives (wrapped in tech bordered panel) */}
        <motion.div 
          className="g3-story border border-[var(--pw-border)] p-8 backdrop-blur-md bg-black/10 relative" 
          style={{ opacity: storyOpacity, transform: storyTransform, color: WM.text }}
        >
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--pw-gold)]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[var(--pw-gold)]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[var(--pw-gold)]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[var(--pw-gold)]" />

          <span className="font-mono text-xs uppercase tracking-widest block" style={{ color: WM.gold }}>
            // PITWALL / ORIGIN
          </span>
          <p className="font-body-strict text-sm opacity-80 leading-relaxed">
            {foundingStory}
          </p>
          <a href={ctaUrl} className="g3-cta font-mono w-full" style={{ borderColor: WM.text, color: WM.text }}>
            {ctaLabel} →
          </a>
        </motion.div>

        {/* The single car — travels continuously across the whole scene */}
        <motion.div className="g3-car relative" style={{ transform: carTransform }}>
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
        ref={ctaRef}
        className="scroll-snap-section w-full h-screen relative flex items-center justify-center z-10 overflow-hidden"
      >
        {/* Video background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <VideoBackground playlist={playlist} />
        </div>

        {/* Centered logo */}
        <h1
          className="hero-title-text select-none absolute z-10" 
          style={{ mixBlendMode: 'difference', opacity: 0.4 }}
        >
          PITWALL
        </h1>

        {/* Bottom buttons */}
        <div className="absolute z-20 flex flex-row flex-wrap justify-center items-center gap-6 bottom-[90px]">
          <a
            href="/collections/all"
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
