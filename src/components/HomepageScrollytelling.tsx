import React, { useEffect, useRef, useState } from 'react';
import { VideoBackground } from './VideoBackground';
import { CollectionCard, Product } from './CollectionGrid';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

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
interface TickerProps { offset: number; }
function HeroTicker({ offset }: TickerProps) {
  const text = "PITWALL ENGINEERING / SPEED CALIBRATION / ";
  const repeats = Array(12).fill(text);
  return (
    <div
      className="ticker-bar absolute bottom-0 left-0 w-full z-20 overflow-hidden py-3"
      style={{ backgroundColor: WM.gold, borderTop: '1px solid rgba(0,0,0,0.12)', borderBottom: '1px solid rgba(0,0,0,0.12)' }}
    >
      <div
        className="flex whitespace-nowrap font-mono text-xs uppercase tracking-widest text-[#0C0C0C] font-bold"
        style={{ transform: `translate3d(${offset}px, 0, 0)` }}
      >
        {repeats.map((t, i) => <span key={i} className="inline-block px-4">{t}</span>)}
      </div>
    </div>
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
}

export function HomepageScrollytelling({ productsJson, videoPlaylist, fallbackImages = {} }: HomepageScrollytellingProps) {
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

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeIndex1, setActiveIndex1] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [tickerOffset, setTickerOffset] = useState(0);
  const tickerVelocity = useRef(1.0);
  const tickerDirection = useRef(1);
  const [featProduct1, setFeatProduct1] = useState<Product>(products[0] || mockProducts[0]);
  const [featProduct2, setFeatProduct2] = useState<Product>(products[4] || mockProducts[4]);
  const [manifestoVisible, setManifestoVisible] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      setFeatProduct1(products[0]);
      setFeatProduct2(products[Math.min(4, products.length - 1)]);
    }
  }, [products]);

  // ── Responsive ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Lock body scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.add('homepage-scrollytelling-active');
    return () => document.documentElement.classList.remove('homepage-scrollytelling-active');
  }, []);

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
        return next < -320 ? 0 : next;
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

  // ── Main wheel handler — single scrollLeft system ────────────────────────────
  useEffect(() => {
    if (isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const vh = container.clientHeight;

      // ── Group 1 ─────────────────────────────────────────────────────────
      if (scrollTop < vh / 2) {
        const g1 = group1Ref.current;
        if (!g1) return;
        const maxScroll = g1.scrollWidth - g1.clientWidth;
        const curScroll = g1.scrollLeft;

        // Scroll forward within Group 1
        if (e.deltaY > 0 && curScroll < maxScroll - 2) {
          g1.scrollLeft = Math.min(maxScroll, curScroll + e.deltaY * 0.85);
          setActiveIndex1(getSlideIndex(g1, g1.scrollLeft));
          return;
        }
        // Scroll backward within Group 1
        if (e.deltaY < 0 && curScroll > 2) {
          g1.scrollLeft = Math.max(0, curScroll + e.deltaY * 0.85);
          setActiveIndex1(getSlideIndex(g1, g1.scrollLeft));
          return;
        }
        // End of Group 1 → snap down to Group 2
        if (e.deltaY > 0 && curScroll >= maxScroll - 2) {
          container.scrollTo({ top: vh, behavior: 'smooth' });
          return;
        }
        return;
      }

      // ── Group 2 ─────────────────────────────────────────────────────────
      if (scrollTop >= vh / 2) {
        const g2 = group2Ref.current;
        if (!g2) return;
        const maxScroll = g2.scrollWidth - g2.clientWidth;
        const curScroll = g2.scrollLeft;

        // Scroll forward within Group 2
        if (e.deltaY > 0 && curScroll < maxScroll - 2) {
          g2.scrollLeft = Math.min(maxScroll, curScroll + e.deltaY * 0.85);
          setActiveIndex2(getSlideIndex(g2, g2.scrollLeft));
          return;
        }
        // Scroll backward within Group 2
        if (e.deltaY < 0 && curScroll > 2) {
          g2.scrollLeft = Math.max(0, curScroll + e.deltaY * 0.85);
          setActiveIndex2(getSlideIndex(g2, g2.scrollLeft));
          return;
        }
        // Start of Group 2 scrolling left → snap back to Group 1
        if (e.deltaY < 0 && curScroll <= 2) {
          container.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        // End of Group 2 → scroll container down to footer
        if (e.deltaY > 0 && curScroll >= maxScroll - 2) {
          container.scrollBy({ top: 80, behavior: 'smooth' });
          return;
        }
      }
    };

    const el = containerRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', handleWheel); };
  }, [isMobile]);

  // ── Slide visibility triggers ────────────────────────────────────────────────
  useEffect(() => {
    if (isMobile) return;
    // Manifesto (slide index 1 in group 1)
    setManifestoVisible(activeIndex1 >= 1);
  }, [activeIndex1, isMobile]);

  // ── Product swap on featured slide entry ─────────────────────────────────────
  const getRandomProduct = (exclude: Product | null): Product => {
    const pool = products.filter(p => !exclude || p.url !== exclude.url);
    return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : products[0] || mockProducts[0];
  };

  useEffect(() => {
    if (activeIndex1 === 2) setFeatProduct1(prev => getRandomProduct(prev));
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
          <div className="relative z-20 text-center px-4">
            <p className="hero-tagline uppercase tracking-widest text-[11px] font-mono mt-4" style={{ color: WM.gold }}>
              Because cars are not objects
            </p>
          </div>
          <HeroTicker offset={tickerOffset} />
        </section>

        {/* Manifesto */}
        <section className="min-h-[70vh] w-full relative flex flex-col justify-center px-6 py-16 border-b border-white/10">
          <div className="absolute inset-0 z-0"><VideoBackground playlist={playlist} /></div>
          <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(15,12,9,0.52)' }} />
          <div className="relative z-20 max-w-lg mx-auto w-full text-center">
            <p
              className="text-3xl italic leading-relaxed"
              style={{ fontFamily: 'var(--font-manifesto)', color: WM.text }}
            >
              "Where every object we make is held to the same standards as the machines we obsess over."
            </p>
            <div className="border-t border-white/10 pt-3 mt-8 font-mono text-[8px] opacity-40 flex justify-between uppercase tracking-widest">
              <span>PITWALL ENGINEERING</span><span>BECAUSE CARS ARE NOT OBJECTS</span>
            </div>
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

        {/* Featured Product 1 */}
        <section className="min-h-screen w-full flex flex-col justify-center px-6 py-16 border-b border-white/10" style={{ backgroundColor: WM.bg }}>
          <div className="max-w-md mx-auto flex flex-col gap-6 w-full">
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: WM.gold }}>// SEASON SPECIMEN</span>
            <div className="aspect-square overflow-hidden rounded-[5px] bg-white">
              <img src={featProduct1.image} alt={featProduct1.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-display-strict text-xl uppercase tracking-tighter font-extrabold" style={{ color: WM.text }}>{featProduct1.title}</h3>
              <span className="font-mono text-sm font-bold" style={{ color: WM.gold }}>{featProduct1.price}</span>
              <p className="font-body-strict text-xs opacity-70 italic mt-2 leading-relaxed">{featProduct1.specs || "1:18 Scale / Precision Collectible"}</p>
              <button
                onClick={() => window.location.href = featProduct1.url}
                className="w-full h-10 border bg-transparent font-mono text-[10px] uppercase tracking-wider font-bold transition-all mt-4 flex items-center justify-center gap-1 cursor-pointer hover:opacity-70"
                style={{ borderColor: WM.text, color: WM.text }}
              >
                ADD TO COLLECTION
              </button>
            </div>
          </div>
        </section>

        {/* Collection Grid (mobile: simple 2-col) */}
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
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  DESKTOP LAYOUT
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div ref={containerRef} className="homepage-scroll-container">

      {/* ── GROUP 1: Hero → Manifesto → Featured → Grid 1 ─────────────────── */}
      <div ref={group1Ref} id="scroll-group-1" className="horizontal-scroll-group">

        {/* ── Slide 1: Hero ────────────────────────────────────────────────── */}
        <div className="horizontal-slide">
          <div className="absolute inset-0 z-0"><VideoBackground playlist={playlist} /></div>
          <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(15,12,9,0.58)' }} />
          <div className="relative z-20 text-center">
            <p className="hero-tagline uppercase tracking-widest text-sm font-mono mt-3" style={{ color: WM.gold }}>
              Because cars are not objects
            </p>
          </div>
          <HeroTicker offset={tickerOffset} />
        </div>

        {/* ── Slide 2: Manifesto ───────────────────────────────────────────── */}
        <div className="horizontal-slide" style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
          {/* Video background (continues from hero) */}
          <div className="absolute inset-0 z-0"><VideoBackground playlist={playlist} /></div>
          <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(15,12,9,0.55)' }} />

          {/* Manifesto text — takes top 2/3 */}
          <div
            className="relative z-20 flex-1 flex items-center justify-center px-16 w-full"
            style={{ minHeight: '66.666vh' }}
          >
            <div
              className="max-w-2xl text-center"
              style={{
                opacity: manifestoVisible ? 1 : 0,
                transform: manifestoVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <p
                className="text-4xl italic leading-relaxed"
                style={{ fontFamily: 'var(--font-manifesto)', color: WM.text }}
              >
                "Where every object we make is held to the same standards as the machines we obsess over."
              </p>
              <div className="border-t border-white/10 pt-4 mt-8 font-mono text-[9px] opacity-40 flex justify-between uppercase tracking-widest">
                <span>PITWALL ENGINEERING</span>
                <span>BECAUSE CARS ARE NOT OBJECTS</span>
              </div>
            </div>
          </div>

          {/* Video strip element — bottom 1/3 */}
          <div className="manifesto-video-strip">
            <video
              autoPlay muted loop playsInline
              src={playlist[1] || playlist[0]}
            />
          </div>
        </div>

        {/* ── Slide 3: Featured Product ────────────────────────────────────── */}
        <div className="horizontal-slide" style={{ backgroundColor: WM.bg }}>
          <div className="absolute inset-0 z-0"><div className="ambient-gradient-bg" /></div>
          <div className="relative z-10 w-full h-full flex items-center justify-center px-24">
            <div className="flex gap-12 max-w-6xl w-full h-[70vh] items-center">
              {/* Image */}
              <div className={`flex-[4] h-full rounded-[5px] overflow-hidden bg-white shadow-2xl transition-all duration-700 ${activeIndex1 >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <img src={featProduct1.image} alt={featProduct1.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              {/* Info */}
              <div className={`flex-[3] flex flex-col justify-between h-full py-6 transition-all duration-700 delay-150 ${activeIndex1 >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ color: WM.text }}>
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
                      {activeIndex1 >= 2 ? <AnimatedPrice priceString={featProduct1.price} /> : featProduct1.price}
                    </span>
                  </div>
                  <p className="font-body-strict text-sm opacity-60 italic leading-relaxed">
                    {featProduct1.specs || '1:18 Scale / Precision Collectible'}
                  </p>
                </div>
                <button
                  onClick={() => window.location.href = featProduct1.url}
                  className="w-full max-w-[240px] h-12 border bg-transparent font-mono text-[11px] uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-70"
                  style={{ borderColor: WM.text, color: WM.text }}
                >
                  ADD TO COLLECTION <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Slide 4: Collection Grid 1 (wider than viewport) ────────────── */}
        <div className="horizontal-slide grid-slide-wide" style={{ backgroundColor: WM.bg }}>
          <div className="absolute inset-0 z-0"><div className="ambient-gradient-bg" /></div>
          <div className="relative z-10 h-full flex items-center px-12">
            <div className="grid-cols-custom-1">
              {/* Col 1: two stacked */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <CollectionCard product={products[0]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 3 ? 'reveal-active' : ''}`} />
                <CollectionCard product={products[1]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 3 ? 'reveal-active' : ''}`} style={{ transitionDelay: '100ms' } as React.CSSProperties} />
              </div>
              {/* Col 2: two stacked */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <CollectionCard product={products[2]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 3 ? 'reveal-active' : ''}`} style={{ transitionDelay: '150ms' } as React.CSSProperties} />
                <CollectionCard product={products[3]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 3 ? 'reveal-active' : ''}`} style={{ transitionDelay: '200ms' } as React.CSSProperties} />
              </div>
              {/* Col 3: tall + title card */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <div className={`flex-[7] min-h-0 reveal-dashboard-item ${activeIndex1 >= 3 ? 'reveal-active' : ''}`} style={{ transitionDelay: '250ms' } as React.CSSProperties}>
                  <CollectionCard product={products[4]} className="w-full h-full" isTall={true} />
                </div>
                <div className={`flex-[3] min-h-0 reveal-dashboard-item ${activeIndex1 >= 3 ? 'reveal-active' : ''}`} style={{ transitionDelay: '300ms' } as React.CSSProperties}>
                  <DesignedTitleCard title="chassis" unit="01" isYellow={true} subtitle="PITWALL 1:18 SCALE" />
                </div>
              </div>
              {/* Col 4: large + two small */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <CollectionCard product={products[5]} className={`w-full flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 3 ? 'reveal-active' : ''}`} style={{ transitionDelay: '350ms' } as React.CSSProperties} />
                <div className="flex-[1] flex gap-4 min-h-0">
                  <CollectionCard product={products[6]} className={`flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 3 ? 'reveal-active' : ''}`} style={{ transitionDelay: '400ms' } as React.CSSProperties} />
                  <CollectionCard product={products[7]} className={`flex-1 min-h-0 reveal-dashboard-item ${activeIndex1 >= 3 ? 'reveal-active' : ''}`} style={{ transitionDelay: '450ms' } as React.CSSProperties} />
                </div>
              </div>
              {/* Col 5: tall product */}
              <div className={`h-full reveal-dashboard-item ${activeIndex1 >= 3 ? 'reveal-active' : ''}`} style={{ transitionDelay: '500ms' } as React.CSSProperties}>
                <CollectionCard product={products[8]} className="w-full h-full" isTall={true} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── GROUP 2: Flipped Featured → Flipped Grid 2 ─────────────────────── */}
      <div ref={group2Ref} id="scroll-group-2" className="horizontal-scroll-group">

        {/* ── Slide 5: Flipped Featured Product ────────────────────────────── */}
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
                  onClick={() => window.location.href = featProduct2.url}
                  className="w-full max-w-[240px] h-12 border bg-transparent font-mono text-[11px] uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-70"
                  style={{ borderColor: WM.text, color: WM.text }}
                >
                  ADD TO COLLECTION <ArrowUpRight size={14} />
                </button>
              </div>
              {/* Image (right — flipped) */}
              <div className={`flex-[4] h-full rounded-[5px] overflow-hidden bg-white shadow-2xl transition-all duration-700 delay-150 ${activeIndex2 === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <img src={featProduct2.image} alt={featProduct2.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Slide 6: Flipped Collection Grid 2 (wider than viewport) ────── */}
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
    </div>
  );
}
