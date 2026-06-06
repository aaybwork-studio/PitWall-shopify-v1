import React, { useEffect, useRef, useState } from 'react';
import { VideoBackground } from './VideoBackground';
import { CollectionCard, Product } from './CollectionGrid';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

function AnimatedPrice({ priceString }: { priceString: string }) {
  const numeric = parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
  const displayVal = priceString.includes('.00') ? numeric / 100 : numeric;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = displayVal;
    if (start === end) {
      setCurrent(end);
      return;
    }
    const duration = 1000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCurrent(end);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [displayVal]);

  return <span>₹{current.toLocaleString('en-IN')}.00</span>;
}

// ─── Ticker Item Component ───────────────────────────────────────────────────
interface TickerProps {
  offset: number;
}
function HeroTicker({ offset }: TickerProps) {
  const text = "PITWALL ENGINEERING / SPEED CALIBRATION / ";
  const repeats = Array(12).fill(text);

  return (
    <div className="ticker-bar absolute bottom-0 left-0 w-full z-20 overflow-hidden bg-[#F6C917] border-t border-b border-[#0C0C0C]/15 py-3">
      <div 
        className="flex whitespace-nowrap font-mono text-xs uppercase tracking-widest text-[#0C0C0C] font-bold"
        style={{ transform: `translate3d(${offset}px, 0, 0)` }}
      >
        {repeats.map((t, i) => (
          <span key={i} className="inline-block px-4">{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Title Cards Redesign ────────────────────────────────────────────────────
interface TitleCardProps {
  title: string;
  unit: string;
  isYellow?: boolean;
}
function DesignedTitleCard({ title, unit, isYellow = false }: TitleCardProps) {
  return (
    <div className={`f1-title-card w-full h-full flex flex-col justify-between p-5 select-none ${isYellow ? 'f1-title-card-yellow' : ''}`}>
      <div className="flex justify-between items-start">
        <span className="font-mono text-[9px] tracking-widest uppercase opacity-60">
          [ UNIT // {unit} ]
        </span>
        <div className="flex items-center gap-1.5">
          <span className="pulsing-indicator" />
          <span className="font-mono text-[8px] uppercase tracking-wider opacity-60">ONLINE</span>
        </div>
      </div>
      <div>
        <h2 className="font-display-strict text-3xl lowercase tracking-tighter font-extrabold leading-none mt-2">
          {title}
        </h2>
        <div className="border-t border-current/15 pt-2 mt-3 flex justify-between font-mono text-[8px] opacity-45">
          <span>PW.CALIBRATION: ACTIVE</span>
          <span>GRIDREF: 45.928.A1</span>
        </div>
      </div>
    </div>
  );
}

// Mock Products Fallback
const mockProducts: Product[] = [
  {
    title: 'MCLAREN MCL39 CHASSIS',
    url: '/products/mclaren-mcl39',
    price: '₹12,499.00',
    image: '/assets/mclaren.png',
    specs: '1:18 SCALE / WOKING WIND TUNNEL SPEC'
  },
  {
    title: 'ORACLE RED BULL RB19',
    url: '/products/red-bull-rb19',
    price: '₹12,499.00',
    image: '/assets/redbull.png',
    specs: '1:18 SCALE / MILTON KEYNES LEGACY'
  },
  {
    title: 'SCUDERIA FERRARI SF-23',
    url: '/products/ferrari-sf-23',
    price: '₹12,499.00',
    image: '/assets/ferrari.png',
    specs: '1:18 SCALE / MARANELLO CRIMSON TRIBUTE'
  },
  {
    title: 'MERCEDES-AMG W14',
    url: '/products/mercedes-w14',
    price: '₹12,499.00',
    image: '/assets/mercedes.png',
    specs: '1:18 SCALE / BRACKLEY STEALTH'
  },
  {
    title: 'LANDO NORRIS HELMET',
    url: '/products/lando-norris-helmet',
    price: '₹7,999.00',
    image: '/assets/norris.png',
    specs: '1:2 SCALE / VACUUM VISOR TECH'
  },
  {
    title: 'SCHUMACHER 2002 HELMET',
    url: '/products/schumacher-helmet',
    price: '₹7,999.00',
    image: '/assets/schumacher.png',
    specs: '1:2 SCALE / MARANELLO TRIBUTE'
  },
  {
    title: 'VERSTAPPEN 2023 HELMET',
    url: '/products/verstappen-helmet',
    price: '₹7,999.00',
    image: '/assets/verstappen.png',
    specs: '1:2 SCALE / CHAMPIONSHIP GOLD'
  }
];

interface HomepageScrollytellingProps {
  productsJson: string;
  videoPlaylist: string;
}

export function HomepageScrollytelling({ productsJson, videoPlaylist }: HomepageScrollytellingProps) {
  // Parse products & video playlists
  const products: Product[] = React.useMemo(() => {
    try {
      const parsed = JSON.parse(productsJson);
      return parsed.length > 0 ? parsed : mockProducts;
    } catch {
      return mockProducts;
    }
  }, [productsJson]);

  const playlist: string[] = React.useMemo(() => {
    try {
      return JSON.parse(videoPlaylist.replace(/'/g, '"'));
    } catch {
      return [
        "/video/F1_helmet_orbiting_white_void_202605251628.mp4",
        "/video/Formula_1_car_accelerates_white_202605251629.mp4"
      ];
    }
  }, [videoPlaylist]);

  // Layout refs
  const group1Ref = useRef<HTMLDivElement>(null);
  const group2Ref = useRef<HTMLDivElement>(null);

  // States
  const [scrollLeft1, setScrollLeft1] = useState(0);
  const [activeIndex1, setActiveIndex1] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Ticker responsive states
  const [tickerOffset, setTickerOffset] = useState(0);
  const tickerVelocity = useRef(1.0);
  const tickerDirection = useRef(1);

  // Randomized Featured Products
  const [featProduct1, setFeatProduct1] = useState<Product>(products[0] || mockProducts[0]);
  const [featProduct2, setFeatProduct2] = useState<Product>(products[4] || mockProducts[4]);

  // Viewport entered state for micro-animations
  const [inViewSlides, setInViewSlides] = useState<Record<number, boolean>>({});

  // ─── Responsive Check ──────────────────────────────────────────────────────
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ─── Ticker Velocity Animation Loop ─────────────────────────────────────────
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const updateTicker = (time: number) => {
      const dt = (time - lastTime) / 16.666;
      lastTime = time;

      // Velocity slowly decays back to base speed of 1.0
      tickerVelocity.current += (1.0 - tickerVelocity.current) * 0.035;

      const increment = 1.5 * tickerVelocity.current * tickerDirection.current * dt;
      setTickerOffset((prev) => {
        const next = prev - increment;
        return next < -320 ? 0 : next;
      });

      frameId = requestAnimationFrame(updateTicker);
    };

    frameId = requestAnimationFrame(updateTicker);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // ─── Track Wheel Event for Ticker Velocity ──────────────────────────────────
  useEffect(() => {
    const handleTickerWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaY);
      const dir = e.deltaY > 0 ? 1 : -1;
      tickerVelocity.current = Math.min(12.0, tickerVelocity.current + delta * 0.035);
      tickerDirection.current = dir;
    };
    window.addEventListener('wheel', handleTickerWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleTickerWheel);
  }, []);

  // ─── Scroll Translation & Locking logic (Desktop) ───────────────────────────
  useEffect(() => {
    if (isMobile) return;

    const handleGlobalWheel = (e: WheelEvent) => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Group 1 horizontal translation (Slides 1-4)
      if (scrollY < vh / 2) {
        const container = group1Ref.current;
        if (container) {
          const maxScroll = container.scrollWidth - container.clientWidth;
          const currentScroll = container.scrollLeft;

          // Scroll horizontally
          if (e.deltaY > 0 && currentScroll < maxScroll - 5) {
            e.preventDefault();
            container.scrollLeft = Math.min(maxScroll, currentScroll + e.deltaY * 0.85);
            setScrollLeft1(container.scrollLeft);
            setActiveIndex1(Math.round(container.scrollLeft / window.innerWidth));
            return;
          }
          if (e.deltaY < 0 && currentScroll > 5) {
            e.preventDefault();
            container.scrollLeft = Math.max(0, currentScroll + e.deltaY * 0.85);
            setScrollLeft1(container.scrollLeft);
            setActiveIndex1(Math.round(container.scrollLeft / window.innerWidth));
            return;
          }

          // Reach end of Group 1 -> Snap vertically down to Group 2
          if (e.deltaY > 0 && currentScroll >= maxScroll - 5) {
            e.preventDefault();
            window.scrollTo({ top: vh, behavior: 'smooth' });
            return;
          }
        }
      }

      // Group 2 horizontal translation (Slides 5-6)
      if (scrollY >= vh / 2 && scrollY < vh * 1.5) {
        const container = group2Ref.current;
        if (container) {
          const maxScroll = container.scrollWidth - container.clientWidth;
          const currentScroll = container.scrollLeft;

          // Horizontal scroll within Group 2
          if (e.deltaY > 0 && currentScroll < maxScroll - 5) {
            e.preventDefault();
            container.scrollLeft = Math.min(maxScroll, currentScroll + e.deltaY * 0.85);
            setActiveIndex2(Math.round(container.scrollLeft / window.innerWidth));
            return;
          }
          if (e.deltaY < 0 && currentScroll > 5) {
            e.preventDefault();
            container.scrollLeft = Math.max(0, currentScroll + e.deltaY * 0.85);
            setActiveIndex2(Math.round(container.scrollLeft / window.innerWidth));
            return;
          }

          // Reached left of Group 2 -> Snap back up to Group 1
          if (e.deltaY < 0 && currentScroll <= 5) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }

          // Reached end of Group 2 -> Let natural scroll move to footer
          if (e.deltaY > 0 && currentScroll >= maxScroll - 5) {
            return; // Natural vertical scroll down
          }
        }
      }

      // Footer area scroll up -> snap back up to Group 2
      if (scrollY >= vh * 1.5 && e.deltaY < 0) {
        const footer = document.getElementById('footer');
        if (footer) {
          const rect = footer.getBoundingClientRect();
          if (rect.top >= window.innerHeight - 50) {
            e.preventDefault();
            window.scrollTo({ top: vh, behavior: 'smooth' });
          }
        }
      }
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleGlobalWheel);
  }, [isMobile]);

  // ─── Swap Randomized Products on Viewport Enter ─────────────────────────────
  const getRandomProduct = (exclude: Product | null): Product => {
    const pool = products.filter(p => !exclude || p.url !== exclude.url);
    if (pool.length === 0) return products[0] || mockProducts[0];
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // Track slide intersections for entry animations & product swaps
  useEffect(() => {
    if (isMobile) return;

    // Detect Slide 3 (Featured Product 1) active
    if (activeIndex1 === 2 && !inViewSlides[3]) {
      setInViewSlides(prev => ({ ...prev, 3: true }));
      setFeatProduct1(getRandomProduct(featProduct2));
    } else if (activeIndex1 !== 2 && inViewSlides[3]) {
      // Clear or swap when scrolling away
      setInViewSlides(prev => ({ ...prev, 3: false }));
    }

    // Slide 4 (Grid 1) active
    if (activeIndex1 === 3 && !inViewSlides[4]) {
      setInViewSlides(prev => ({ ...prev, 4: true }));
    } else if (activeIndex1 !== 3 && inViewSlides[4]) {
      setInViewSlides(prev => ({ ...prev, 4: false }));
    }

    // Slide 5 (Featured Product 2) active
    if (activeIndex2 === 0 && !inViewSlides[5]) {
      setInViewSlides(prev => ({ ...prev, 5: true }));
      setFeatProduct2(getRandomProduct(featProduct1));
    } else if (activeIndex2 !== 0 && inViewSlides[5]) {
      setInViewSlides(prev => ({ ...prev, 5: false }));
    }

    // Slide 6 (Grid 2) active
    if (activeIndex2 === 1 && !inViewSlides[6]) {
      setInViewSlides(prev => ({ ...prev, 6: true }));
    } else if (activeIndex2 !== 1 && inViewSlides[6]) {
      setInViewSlides(prev => ({ ...prev, 6: false }));
    }
  }, [activeIndex1, activeIndex2, isMobile]);

  // ─── Slow Timer Cycling for Randomized Products ────────────────────────────
  useEffect(() => {
    const cycleTimer = setInterval(() => {
      setFeatProduct1(prev => getRandomProduct(prev));
      setFeatProduct2(prev => getRandomProduct(prev));
    }, 12000); // cycle every 12 seconds in case user stays idle on the slide

    return () => clearInterval(cycleTimer);
  }, []);

  // Compute slide-in transition variables for Manifesto cards
  const manifestoProgress = Math.max(0, Math.min(1, scrollLeft1 / (window.innerWidth || 1)));
  const leftCardTranslate = -150 + manifestoProgress * 150; 
  const rightCardTranslate = 150 - manifestoProgress * 150; 
  const cardOpacity = manifestoProgress;

  // Render Mobile Stack
  if (isMobile) {
    return (
      <div className="w-full flex flex-col bg-[#0C0C0C] text-[#EDEBE5] overflow-x-hidden">
        {/* Slide 1: Home */}
        <section className="h-screen w-full relative flex items-center justify-center border-b border-[#EDEBE5]/10">
          <div className="absolute inset-0 z-0">
            <VideoBackground playlist={playlist} />
          </div>
          <div className="absolute inset-0 bg-[#0C0C0C]/50 z-10" />
          <div className="relative z-20 text-center px-4">
            <h1 className="hero-title-text select-none">PITWALL</h1>
            <p className="hero-tagline uppercase tracking-widest text-[11px] font-mono text-[#F6C917] mt-4">
              Because cars are not objects
            </p>
          </div>
          <HeroTicker offset={tickerOffset} />
        </section>

        {/* Slide 2: Manifesto */}
        <section className="min-h-[60vh] w-full flex flex-col justify-center px-6 py-16 bg-[#0C0C0C] border-b border-[#EDEBE5]/10 relative">
          <div className="max-w-xl mx-auto flex flex-col gap-6">
            <span className="font-mono text-[#F6C917] text-xs uppercase tracking-widest">
              // THE MANIFESTO
            </span>
            <p className="font-display-strict text-2xl lowercase text-left italic leading-relaxed text-[#EDEBE5]">
              "Where every object we make is held to the same standards as the machines we obsess over."
            </p>
          </div>
        </section>

        {/* Slide 3: Featured Product */}
        <section className="min-h-screen w-full flex flex-col justify-center px-6 py-16 bg-[#0c0c0c] border-b border-[#EDEBE5]/10">
          <div className="max-w-md mx-auto flex flex-col gap-6 w-full">
            <span className="font-mono text-[#F6C917] text-xs uppercase tracking-widest">
              // FEATURED CHASSIS
            </span>
            <div className="pw-white-card !p-0 aspect-square overflow-hidden rounded-[5px]">
              <img src={featProduct1.image} alt={featProduct1.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-display-strict text-xl uppercase tracking-tighter text-[#EDEBE5] font-extrabold">
                {featProduct1.title}
              </h3>
              <span className="font-mono text-sm font-bold text-[#F6C917]">{featProduct1.price}</span>
              <p className="font-body-strict text-xs text-[#EDEBE5]/70 italic mt-2 leading-relaxed">
                {featProduct1.specs || "1:18 Scale / Precision Collectible Specs."}
              </p>
              <button 
                onClick={() => window.location.href = featProduct1.url}
                className="w-full h-10 border border-[#EDEBE5] bg-transparent text-[#EDEBE5] hover:bg-[#F6C917] hover:text-[#0C0C0C] hover:border-[#F6C917] font-mono text-[10px] uppercase tracking-wider font-bold transition-all mt-4 flex items-center justify-center gap-1 cursor-pointer"
              >
                CALIBRATE NOW
              </button>
            </div>
          </div>
        </section>

        {/* Slide 4: Collections Grid */}
        <section className="min-h-screen w-full px-4 py-16 bg-[#0c0c0c] flex flex-col gap-8">
          <div className="max-w-md mx-auto w-full flex flex-col gap-6">
            <span className="font-mono text-[#F6C917] text-xs uppercase tracking-widest">
              // PRODUCTS GRID
            </span>
            <div className="grid grid-cols-2 gap-3 w-full">
              {products.slice(0, 6).map((product, idx) => (
                <a key={idx} href={product.url} className="pw-card relative flex flex-col justify-end overflow-hidden bg-white text-[#0C0C0C] rounded-[5px] aspect-square shadow-sm">
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
              className="w-full h-10 border border-[#F6C917] bg-[#F6C917] text-[#0C0C0C] font-mono text-[10px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              VIEW ALL PRODUCTS <ChevronRight size={14} />
            </button>
          </div>
        </section>
      </div>
    );
  }

  // Render Desktop Snapping scrollytelling Layout
  return (
    <div className="homepage-scroll-container">
      {/* ─── SCROLL GROUP 1: Slides 1-4 ──────────────────────────────────────── */}
      <div 
        ref={group1Ref}
        id="scroll-group-1" 
        className="horizontal-scroll-group"
      >
        {/* Slide 1: Home (Transparent overlay) */}
        <div className="horizontal-slide">
          <div className="absolute inset-0 z-0">
            <VideoBackground playlist={playlist} />
          </div>
          <div className="absolute inset-0 bg-[#0C0C0C]/60 z-10" />
          
          <div className="relative z-20 text-center">
            <h1 className="hero-title-text select-none">PITWALL</h1>
            <p className="hero-tagline uppercase tracking-widest text-sm font-mono text-[#F6C917] mt-3">
              Because cars are not objects
            </p>
          </div>

          <HeroTicker offset={tickerOffset} />
        </div>

        {/* Slide 2: Manifesto (Transparent overlay over same video background) */}
        <div className="horizontal-slide">
          <div className="absolute inset-0 bg-[#0C0C0C]/75 z-10" />

          <div className="relative z-20 flex gap-6 max-w-5xl px-12 items-center justify-between w-full h-full">
            {/* Left Card animates in from left */}
            <div 
              className="pw-white-card flex-[2] max-w-sm h-[200px] flex flex-col justify-between"
              style={{ 
                transform: `translate3d(${leftCardTranslate}px, 0, 0)`,
                opacity: cardOpacity,
                transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
              }}
            >
              <div className="flex justify-between font-mono text-[9px] opacity-45">
                <span>[ CORE PHILOSOPHY ]</span>
                <span>UNIT // 01</span>
              </div>
              <p className="font-body-strict text-sm text-[#0C0C0C] font-semibold uppercase tracking-wider leading-relaxed">
                Where every object we make
              </p>
              <div className="border-t border-[#0C0C0C]/10 pt-2 font-mono text-[8px] opacity-45 text-right">
                PITWALL ENGINEERING
              </div>
            </div>

            {/* Right Card animates in from right */}
            <div 
              className="pw-white-card flex-[3] max-w-lg h-[240px] flex flex-col justify-between"
              style={{ 
                transform: `translate3d(${rightCardTranslate}px, 0, 0)`,
                opacity: cardOpacity,
                transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
              }}
            >
              <div className="flex justify-between font-mono text-[9px] opacity-45">
                <span>[ STANDARD METRIC ]</span>
                <span>STATUS // ENGAGED</span>
              </div>
              <p className="font-display-strict text-2xl lowercase leading-relaxed text-[#0C0C0C] italic">
                "is held to the same standards as the machines we obsess over."
              </p>
              <div className="border-t border-[#0C0C0C]/10 pt-2 font-mono text-[8px] opacity-45">
                PW-SYS.LOG: ACTIVE
              </div>
            </div>
          </div>
        </div>

        {/* Slide 3: Featured Product (Ambient Gradient Drift) */}
        <div className="horizontal-slide bg-[#0C0C0C]">
          <div className="absolute inset-0 z-0">
            <div className="ambient-gradient-bg" />
          </div>
          
          <div className="relative z-10 w-full h-full flex items-center justify-center px-24">
            <div className="flex gap-12 max-w-6xl w-full h-[70vh] items-center">
              
              {/* Left Side: Product Image (micro-animation draw border) */}
              <div className={`flex-[4] h-full tech-border-draw tech-border-draw-h tech-border-draw-v rounded-[5px] overflow-hidden bg-white shadow-2xl transition-all duration-700 ${inViewSlides[3] ? 'in-view' : ''}`}>
                <img src={featProduct1.image} alt={featProduct1.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>

              {/* Right Side: Product Details */}
              <div className="flex-[3] flex flex-col justify-between h-full py-6 text-[#EDEBE5]">
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-[#F6C917] text-xs uppercase tracking-widest animate-pulse">
                    // DYNAMIC SHOWCASE
                  </span>
                  <h3 className="font-display-strict text-4xl uppercase tracking-tighter font-extrabold leading-none">
                    {featProduct1.title}
                  </h3>
                  <div className="border-t border-b border-[#EDEBE5]/10 py-3 my-2 flex items-baseline justify-between font-mono">
                    <span className="text-[10px] opacity-45 uppercase">PRICE UNIT:</span>
                    <span className="text-2xl font-bold text-[#F6C917]">
                      {inViewSlides[3] ? <AnimatedPrice priceString={featProduct1.price} /> : featProduct1.price}
                    </span>
                  </div>
                  <div className="border border-[#EDEBE5]/10 bg-[#EDEBE5]/5 p-4 font-mono text-[10px] space-y-2 uppercase tracking-wide">
                    <div className="flex justify-between border-b border-[#EDEBE5]/5 pb-1">
                      <span className="opacity-45">Scale:</span>
                      <span className="font-bold">{featProduct1.specs ? featProduct1.specs.split('/')[0].trim() : '1:18'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-45">Specs:</span>
                      <span className="font-bold truncate max-w-[200px]">{featProduct1.specs && featProduct1.specs.split('/').length > 1 ? featProduct1.specs.split('/').slice(1).join('/') : 'PRECISION DETAIL'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button 
                    onClick={() => window.location.href = featProduct1.url}
                    className="w-full max-w-[240px] h-12 border border-[#EDEBE5] bg-transparent text-[#EDEBE5] hover:bg-[#F6C917] hover:text-[#0C0C0C] hover:border-[#F6C917] font-mono text-[11px] uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    CALIBRATE NOW <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Slide 4: Collections Grid 1 (Ambient Gradient Drift) */}
        <div className="horizontal-slide bg-[#0C0C0C]">
          <div className="absolute inset-0 z-0">
            <div className="ambient-gradient-bg" />
          </div>

          <div className="relative z-10 w-full h-full flex items-center justify-center px-12">
            <div className="grid-cols-custom-1 items-center">
              
              {/* Col 1: Stacked Card 0 & Card 1 */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <CollectionCard 
                  product={products[0] || mockProducts[0]} 
                  className={`w-full flex-1 min-h-0 reveal-dashboard-item ${inViewSlides[4] ? 'reveal-active' : ''}`} 
                />
                <CollectionCard 
                  product={products[1] || mockProducts[1]} 
                  className={`w-full flex-1 min-h-0 reveal-dashboard-item ${inViewSlides[4] ? 'reveal-active' : ''}`} 
                  style={{ transitionDelay: '100ms' } as React.CSSProperties}
                />
              </div>

              {/* Col 2: Stacked Card 2 & Card 3 */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <CollectionCard 
                  product={products[2] || mockProducts[2]} 
                  className={`w-full flex-1 min-h-0 reveal-dashboard-item ${inViewSlides[4] ? 'reveal-active' : ''}`} 
                  style={{ transitionDelay: '150ms' } as React.CSSProperties}
                />
                <CollectionCard 
                  product={products[3] || mockProducts[3]} 
                  className={`w-full flex-1 min-h-0 reveal-dashboard-item ${inViewSlides[4] ? 'reveal-active' : ''}`} 
                  style={{ transitionDelay: '200ms' } as React.CSSProperties}
                />
              </div>

              {/* Col 3: Tall Card 4 (top, 70% height) + Title Card (bottom, 30% height) */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <div className={`flex-[7] min-h-0 reveal-dashboard-item ${inViewSlides[4] ? 'reveal-active' : ''}`} style={{ transitionDelay: '250ms' } as React.CSSProperties}>
                  <CollectionCard product={products[4] || mockProducts[4]} className="w-full h-full" isTall={true} />
                </div>
                <div className={`flex-[3] min-h-0 reveal-dashboard-item ${inViewSlides[4] ? 'reveal-active' : ''}`} style={{ transitionDelay: '300ms' } as React.CSSProperties}>
                  <DesignedTitleCard title="the collection" unit="01" isYellow={true} />
                </div>
              </div>

              {/* Col 4: Wide Card 5 (top, 50% height) + two small cards side-by-side (Card 6 & Card 7, 50% height) */}
              <div className="flex flex-col gap-4 h-full justify-between">
                {/* Top Wide Product */}
                <a 
                  href={(products[5] || mockProducts[5]).url} 
                  className={`flex-[1] min-h-0 pw-card group relative flex flex-col justify-end overflow-hidden bg-white text-[#0C0C0C] rounded-[5px] shadow-sm transition-all duration-300 reveal-dashboard-item ${inViewSlides[4] ? 'reveal-active' : ''}`}
                  style={{ transitionDelay: '350ms' } as React.CSSProperties}
                >
                  <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-50">
                    <img src={(products[5] || mockProducts[5]).image} alt={(products[5] || mockProducts[5]).title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="relative z-10 p-3.5 bg-white/90 backdrop-blur-sm border-t border-[#0C0C0C]/5 flex justify-between items-center w-full">
                    <span className="font-mono text-[10px] uppercase tracking-wider truncate font-semibold">{(products[5] || mockProducts[5]).title}</span>
                    <span className="font-mono text-[10px] font-bold">{(products[5] || mockProducts[5]).price}</span>
                  </div>
                </a>
                
                {/* Bottom Two side-by-side */}
                <div className="flex-[1] flex gap-4 min-h-0">
                  <CollectionCard 
                    product={products[6] || mockProducts[6]} 
                    className={`flex-1 min-h-0 reveal-dashboard-item ${inViewSlides[4] ? 'reveal-active' : ''}`} 
                    style={{ transitionDelay: '400ms' } as React.CSSProperties}
                  />
                  <CollectionCard 
                    product={products[7] || mockProducts[1]} 
                    className={`flex-1 min-h-0 reveal-dashboard-item ${inViewSlides[4] ? 'reveal-active' : ''}`} 
                    style={{ transitionDelay: '450ms' } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Col 5: Tall Card 8 (full height, 100% height) */}
              <div className={`h-full reveal-dashboard-item ${inViewSlides[4] ? 'reveal-active' : ''}`} style={{ transitionDelay: '500ms' } as React.CSSProperties}>
                <CollectionCard product={products[8] || mockProducts[2]} className="w-full h-full" isTall={true} />
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ─── SCROLL GROUP 2: Slides 5-6 (Snaps snap to y = 100vh) ─────────────── */}
      <div 
        ref={group2Ref}
        id="scroll-group-2" 
        className="horizontal-scroll-group"
      >
        {/* Slide 5: Flipped Featured Product (Ambient Gradient Drift) */}
        <div className="horizontal-slide bg-[#0C0C0C]">
          <div className="absolute inset-0 z-0">
            <div className="ambient-gradient-bg" />
          </div>

          <div className="relative z-10 w-full h-full flex items-center justify-center px-24">
            <div className="flex gap-12 max-w-6xl w-full h-[70vh] items-center">
              
              {/* Left Side: Product Details */}
              <div className="flex-[3] flex flex-col justify-between h-full py-6 text-[#EDEBE5]">
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-[#F6C917] text-xs uppercase tracking-widest animate-pulse">
                    // DYNAMIC SHOWCASE
                  </span>
                  <h3 className="font-display-strict text-4xl uppercase tracking-tighter font-extrabold leading-none">
                    {featProduct2.title}
                  </h3>
                  <div className="border-t border-b border-[#EDEBE5]/10 py-3 my-2 flex items-baseline justify-between font-mono">
                    <span className="text-[10px] opacity-45 uppercase">PRICE UNIT:</span>
                    <span className="text-2xl font-bold text-[#F6C917]">
                      {inViewSlides[5] ? <AnimatedPrice priceString={featProduct2.price} /> : featProduct2.price}
                    </span>
                  </div>
                  <div className="border border-[#EDEBE5]/10 bg-[#EDEBE5]/5 p-4 font-mono text-[10px] space-y-2 uppercase tracking-wide">
                    <div className="flex justify-between border-b border-[#EDEBE5]/5 pb-1">
                      <span className="opacity-45">Scale:</span>
                      <span className="font-bold">{featProduct2.specs ? featProduct2.specs.split('/')[0].trim() : '1:2'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-45">Specs:</span>
                      <span className="font-bold truncate max-w-[200px]">{featProduct2.specs && featProduct2.specs.split('/').length > 1 ? featProduct2.specs.split('/').slice(1).join('/') : 'PRECISION HELMET DETAIL'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button 
                    onClick={() => window.location.href = featProduct2.url}
                    className="w-full max-w-[240px] h-12 border border-[#EDEBE5] bg-transparent text-[#EDEBE5] hover:bg-[#F6C917] hover:text-[#0C0C0C] hover:border-[#F6C917] font-mono text-[11px] uppercase tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    CALIBRATE NOW <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>

              {/* Right Side: Product Image (micro-animation draw border) */}
              <div className={`flex-[4] h-full tech-border-draw tech-border-draw-h tech-border-draw-v rounded-[5px] overflow-hidden bg-white shadow-2xl transition-all duration-700 ${inViewSlides[5] ? 'in-view' : ''}`}>
                <img src={featProduct2.image} alt={featProduct2.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>

            </div>
          </div>
        </div>

        {/* Slide 6: Flipped Collections Grid 2 (Ambient Gradient Drift) */}
        <div className="horizontal-slide bg-[#0C0C0C]">
          <div className="absolute inset-0 z-0">
            <div className="ambient-gradient-bg" />
          </div>

          <div className="relative z-10 w-full h-full flex items-center justify-center px-12">
            <div className="grid-cols-custom-2 items-center">
              
              {/* Col 1: Tall Card 9 (top, 70% height) + Spec text card (bottom, 30% height, un-flipped text) */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <div className={`flex-[7] min-h-0 reveal-dashboard-item ${inViewSlides[6] ? 'reveal-active' : ''}`}>
                  <CollectionCard product={products[1] || mockProducts[1]} className="w-full h-full" isTall={true} />
                </div>
                <div className={`flex-[3] min-h-0 reveal-dashboard-item ${inViewSlides[6] ? 'reveal-active' : ''}`} style={{ transitionDelay: '100ms' } as React.CSSProperties}>
                  <DesignedTitleCard title="specifications" unit="02" />
                </div>
              </div>

              {/* Col 2: Stacked Card 10 & Card 11 */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <CollectionCard 
                  product={products[2] || mockProducts[2]} 
                  className={`w-full flex-1 min-h-0 reveal-dashboard-item ${inViewSlides[6] ? 'reveal-active' : ''}`} 
                  style={{ transitionDelay: '150ms' } as React.CSSProperties}
                />
                <CollectionCard 
                  product={products[3] || mockProducts[3]} 
                  className={`w-full flex-1 min-h-0 reveal-dashboard-item ${inViewSlides[6] ? 'reveal-active' : ''}`} 
                  style={{ transitionDelay: '200ms' } as React.CSSProperties}
                />
              </div>

              {/* Col 3: Stacked Card 12 & Card 13 */}
              <div className="flex flex-col gap-4 h-full justify-between">
                <CollectionCard 
                  product={products[4] || mockProducts[4]} 
                  className={`w-full flex-1 min-h-0 reveal-dashboard-item ${inViewSlides[6] ? 'reveal-active' : ''}`} 
                  style={{ transitionDelay: '250ms' } as React.CSSProperties}
                />
                <CollectionCard 
                  product={products[5] || mockProducts[5]} 
                  className={`w-full flex-1 min-h-0 reveal-dashboard-item ${inViewSlides[6] ? 'reveal-active' : ''}`} 
                  style={{ transitionDelay: '300ms' } as React.CSSProperties}
                />
              </div>

              {/* Col 4: Tall Card 14 (full height, 100% height) */}
              <div className={`h-full reveal-dashboard-item ${inViewSlides[6] ? 'reveal-active' : ''}`} style={{ transitionDelay: '350ms' } as React.CSSProperties}>
                <CollectionCard product={products[6] || mockProducts[6]} className="w-full h-full" isTall={true} />
              </div>

              {/* Col 5: Wide Card 15 (top, 50% height) + two small cards side-by-side (Card 16 & Card 17, 50% height) */}
              <div className="flex flex-col gap-4 h-full justify-between">
                {/* Top Wide Product */}
                <a 
                  href={(products[7] || mockProducts[7]).url} 
                  className={`flex-[1] min-h-0 pw-card group relative flex flex-col justify-end overflow-hidden bg-white text-[#0C0C0C] rounded-[5px] shadow-sm transition-all duration-300 reveal-dashboard-item ${inViewSlides[6] ? 'reveal-active' : ''}`}
                  style={{ transitionDelay: '400ms' } as React.CSSProperties}
                >
                  <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-50">
                    <img src={(products[7] || mockProducts[7]).image} alt={(products[7] || mockProducts[7]).title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="relative z-10 p-3.5 bg-white/90 backdrop-blur-sm border-t border-[#0C0C0C]/5 flex justify-between items-center w-full">
                    <span className="font-mono text-[10px] uppercase tracking-wider truncate font-semibold">{(products[7] || mockProducts[7]).title}</span>
                    <span className="font-mono text-[10px] font-bold">{(products[7] || mockProducts[7]).price}</span>
                  </div>
                </a>
                
                {/* Bottom Two side-by-side */}
                <div className="flex-[1] flex gap-4 min-h-0">
                  <CollectionCard 
                    product={products[8] || mockProducts[2]} 
                    className={`flex-1 min-h-0 reveal-dashboard-item ${inViewSlides[6] ? 'reveal-active' : ''}`} 
                    style={{ transitionDelay: '450ms' } as React.CSSProperties}
                  />
                  <CollectionCard 
                    product={products[0] || mockProducts[0]} 
                    className={`flex-1 min-h-0 reveal-dashboard-item ${inViewSlides[6] ? 'reveal-active' : ''}`} 
                    style={{ transitionDelay: '500ms' } as React.CSSProperties}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
