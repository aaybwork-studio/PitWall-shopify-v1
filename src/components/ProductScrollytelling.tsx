import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ArrowLeft, Check } from 'lucide-react';
import { CarCanvas } from './CarCanvas';
import { TechSpecTable } from './TechSpecTable';
import { FeaturedCarousel } from './FeaturedCarousel';

interface ShopifyVariant {
  id: number;
  title: string;
  price: number;
  available: boolean;
  sku: string;
}

interface ProductScrollytellingProps {
  productTitle: string;
  productHandle: string;
  productPrice: string;
  variantsJson: string;
  mclarenUrl: string;
  redbullUrl: string;
  ferrariUrl: string;
  mercedesUrl: string;
  norrisHelmetUrl?: string;
  schumacherHelmetUrl?: string;
  verstappenHelmetUrl?: string;
}

const TEAMS_DATA = {
  mclaren: {
    name: 'McLaren MCL39 — Woking Special',
    basePrice: 12499,
    referenceCode: 'PW-2025-MCL39',
    accentColor: '#FF8000',
    specs: {
      parts: '214 pieces',
      material: 'Pre-preg Carbon & Zinc Alloy',
    },
    subtitle: "Obsessive engineering from Woking's wind tunnel.",
  },
  redbull: {
    name: 'Oracle Red Bull RB19 — Milton Keynes Legacy',
    basePrice: 12499,
    referenceCode: 'PW-2023-RB19',
    accentColor: '#FCD500',
    specs: {
      parts: '230 pieces',
      material: 'Anodized Alloys & Composite Fiber',
    },
    subtitle: 'The most statistically dominant car ever built.',
  },
  ferrari: {
    name: 'Scuderia Ferrari SF-23 — Maranello Crimson',
    basePrice: 12499,
    referenceCode: 'PW-2023-SF23',
    accentColor: '#E10600',
    specs: {
      parts: '220 pieces',
      material: 'Precision Die-Cast & Pre-preg Carbon',
    },
    subtitle: "The pressure of carrying an entire nation's racing soul.",
  },
  mercedes: {
    name: 'Mercedes-AMG W14 — Brackley Stealth',
    basePrice: 12499,
    referenceCode: 'PW-2023-W14',
    accentColor: '#00A19B',
    specs: {
      parts: '245 pieces',
      material: 'Exposed Carbon Fiber & Matte Black Composite',
    },
    subtitle: "Brackley's aggressive, uncompromising structural thesis.",
  },
  'lando-norris-helmet': {
    name: 'McLaren F1 Helmet — Lando Norris Replica',
    basePrice: 7999,
    referenceCode: 'PW-LN-2025',
    accentColor: '#FF8000',
    specs: {
      parts: '110 pieces',
      material: 'Autoclaved Carbon & Vacuum Visor',
    },
    subtitle: "Autocalibrated 1:2 scale replica of McLaren's top technical talent.",
  },
  'schumacher-helmet': {
    name: 'Ferrari F1 Helmet — Schumacher 2002 Edition',
    basePrice: 7999,
    referenceCode: 'PW-MS-2002',
    accentColor: '#E10600',
    specs: {
      parts: '118 pieces',
      material: 'Composite Carbon & Autographed Visor',
    },
    subtitle: "Legendary championship replica commemorating the Maranello era.",
  },
  'verstappen-helmet': {
    name: 'Red Bull F1 Helmet — Max Verstappen 2023',
    basePrice: 7999,
    referenceCode: 'PW-MV1-2023',
    accentColor: '#FCD500',
    specs: {
      parts: '112 pieces',
      material: 'Matte Carbon Fiber & Anti-Scratch Visor',
    },
    subtitle: 'The most dominant driver of a generation, in collector-grade carbon.',
  },
};

const SCALES_DATA = {
  S: {
    label: '1:43 Scale',
    multiplier: 0.35,
    dimensions: '122mm x 55mm x 28mm',
    weight: '180g',
    partsOffset: 0,
  },
  M: {
    label: '1:24 Scale',
    multiplier: 0.65,
    dimensions: '185mm x 82mm x 41mm',
    weight: '420g',
    partsOffset: 65,
  },
  L: {
    label: '1:18 Scale',
    multiplier: 1.0,
    dimensions: '261mm x 118mm x 58mm',
    weight: '890g',
    partsOffset: 120,
  },
};

const HELMET_SCALES = {
  S: {
    label: '1:2 Scale (Half Scale)',
    multiplier: 1.0,
    dimensions: '130mm x 165mm x 125mm',
    weight: '480g',
    partsOffset: 0,
  },
  M: {
    label: '1:2 Scale (Collector Ed.)',
    multiplier: 1.5,
    dimensions: '130mm x 165mm x 125mm',
    weight: '520g',
    partsOffset: 15,
  },
  L: {
    label: '1:1 Scale (Full Scale)',
    multiplier: 5.75, // 7999 * 5.75 = 45999
    dimensions: '260mm x 330mm x 250mm',
    weight: '1,600g',
    partsOffset: 45,
  },
};

const teamButtonLabels: Record<string, string> = {
  mclaren: 'Mclaren-MCL39',
  redbull: 'Redbull-RB19',
  ferrari: 'Ferrari-SF23',
  mercedes: 'Mercedes-W14',
  'lando-norris-helmet': 'Norris-Helmet',
  'schumacher-helmet': 'Schumacher-Helmet',
  'verstappen-helmet': 'Verstappen-Helmet',
};

export function ProductScrollytelling({
  productTitle: _productTitle,
  productHandle,
  productPrice: _productPrice,
  variantsJson,
  mclarenUrl,
  redbullUrl,
  ferrariUrl,
  mercedesUrl,
  norrisHelmetUrl,
  schumacherHelmetUrl,
  verstappenHelmetUrl,
}: ProductScrollytellingProps) {
  // Parse dynamic shopify variants
  let parsedVariants: ShopifyVariant[] = [];
  try {
    parsedVariants = JSON.parse(variantsJson);
  } catch {
    parsedVariants = [];
  }

  // Detect product handle context (helmet vs car) — also checks URL ?model= param
  const urlModelParam = new URLSearchParams(window.location.search).get('model') || '';
  const isHelmet = productHandle.toLowerCase().includes('helmet') || 
                   productHandle.toLowerCase().includes('schumacher') || 
                   productHandle.toLowerCase().includes('norris') ||
                   productHandle.toLowerCase().includes('verstappen') ||
                   urlModelParam.includes('helmet') ||
                   urlModelParam.includes('schumacher') ||
                   urlModelParam.includes('norris') ||
                   urlModelParam.includes('verstappen');

  // Determine initial active team based on URL ?model= param (priority) or product handle keyword
  const getInitialTeam = (): keyof typeof TEAMS_DATA => {
    // 1. Check URL query param first — allows catalog cards to deep-link to any model
    const urlModel = new URLSearchParams(window.location.search).get('model');
    if (urlModel && urlModel in TEAMS_DATA) {
      return urlModel as keyof typeof TEAMS_DATA;
    }
    // 2. Fall back to product handle keyword detection
    const handle = productHandle.toLowerCase();
    if (handle.includes('norris')) return 'lando-norris-helmet';
    if (handle.includes('schumacher')) return 'schumacher-helmet';
    if (handle.includes('verstappen')) return 'verstappen-helmet';
    if (handle.includes('redbull') || handle.includes('red-bull')) return 'redbull';
    if (handle.includes('ferrari')) return 'ferrari';
    if (handle.includes('mercedes')) return 'mercedes';
    return 'mclaren';
  };

  const [activeTeam, setActiveTeam] = useState<keyof typeof TEAMS_DATA>(getInitialTeam);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const handle = path.split('/').pop() || '';
      const teamKeyMap: Record<string, keyof typeof TEAMS_DATA> = {
        'mclaren-mcl39': 'mclaren',
        'red-bull-rb19': 'redbull',
        'ferrari-sf23': 'ferrari',
        'mercedes-w14': 'mercedes',
        'lando-norris-helmet': 'lando-norris-helmet',
        'schumacher-helmet': 'schumacher-helmet',
        'verstappen-helmet': 'verstappen-helmet',
      };
      const newTeam = teamKeyMap[handle];
      if (newTeam) {
        setActiveTeam(newTeam);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [activeScale, setActiveScale] = useState<keyof typeof SCALES_DATA>('L');
  
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const configuratorRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const ctaBlockRef = useRef<HTMLDivElement>(null);
  const showButtonsRef = useRef<boolean>(true);

  const teamInfo = TEAMS_DATA[activeTeam];
  const scaleInfo = isHelmet ? HELMET_SCALES[activeScale as keyof typeof HELMET_SCALES] : SCALES_DATA[activeScale];

  // Dynamic calculations based on team and scale
  const getDisplayPrice = () => {
    if (parsedVariants.length > 0) {
      const activeVariant = parsedVariants.find(v => {
        const title = v.title.toLowerCase();
        if (activeScale === 'S') return title.includes('43') || title.includes('1:2') || title.includes('half');
        if (activeScale === 'M') return title.includes('24') || title.includes('collector');
        return title.includes('18') || title.includes('1:1') || title.includes('full');
      });
      if (activeVariant) {
        return (activeVariant.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
      }
    }
    const computedPrice = Math.floor(teamInfo.basePrice * scaleInfo.multiplier);
    return computedPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  };

  const baseParts = parseInt(teamInfo.specs.parts.split(' ')[0]);
  const totalParts = `${baseParts + scaleInfo.partsOffset} pieces`;

  // Get active Shopify variant ID
  const getActiveVariantId = (): number | null => {
    if (parsedVariants.length === 0) return null;
    const activeVariant = parsedVariants.find(v => {
      const title = v.title.toLowerCase();
      if (activeScale === 'S') return title.includes('43') || title.includes('1:2') || title.includes('half');
      if (activeScale === 'M') return title.includes('24') || title.includes('collector');
      return title.includes('18') || title.includes('1:1') || title.includes('full');
    });
    return activeVariant ? activeVariant.id : parsedVariants[0].id;
  };

  // 120fps Scroll effect animations handler
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = rect.height;
      const scrolled = -rect.top;
      const maxScroll = trackHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.max(0, Math.min(1, scrolled / maxScroll)) : 0;

      // Wordmark fade
      if (wordmarkRef.current) {
        const opacity = progress < 0.25 ? (1 - (progress / 0.25)) * 0.85 : 0;
        wordmarkRef.current.style.opacity = `${opacity}`;
        wordmarkRef.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
      }

      // Configurator fade
      if (configuratorRef.current) {
        const opacity = progress < 0.25 ? 1 - (progress / 0.25) : 0;
        const translateY = progress < 0.25 ? 0 : 24;
        configuratorRef.current.style.opacity = `${opacity}`;
        configuratorRef.current.style.transform = `translate(-50%, ${translateY}px)`;
        configuratorRef.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
      }

      // Left spec card slide
      if (leftCardRef.current) {
        const translateX = progress >= 0.25 ? '0%' : '-150%';
        const opacity = progress >= 0.25 ? 1 : 0;
        leftCardRef.current.style.transform = `translateY(-50%) translateX(${translateX})`;
        leftCardRef.current.style.opacity = `${opacity}`;
        leftCardRef.current.style.pointerEvents = progress >= 0.25 ? 'auto' : 'none';
      }

      // Right price card slide
      if (rightCardRef.current) {
        const translateX = progress >= 0.25 ? '0%' : '150%';
        const opacity = progress >= 0.25 ? 1 : 0;
        rightCardRef.current.style.transform = `translateY(-50%) translateX(${translateX})`;
        rightCardRef.current.style.opacity = `${opacity}`;
        rightCardRef.current.style.pointerEvents = progress >= 0.25 ? 'auto' : 'none';
      }

      // Sticky bottom bar
      if (ctaBlockRef.current) {
        const isVisible = progress > 0.2 && showButtonsRef.current;
        if (isVisible) {
          ctaBlockRef.current.style.transform = 'translate(-50%, 0) scale(1)';
          ctaBlockRef.current.style.opacity = '1';
          ctaBlockRef.current.style.pointerEvents = 'auto';
        } else {
          ctaBlockRef.current.style.transform = 'translate(-50%, 96px) scale(0.95)';
          ctaBlockRef.current.style.opacity = '0';
          ctaBlockRef.current.style.pointerEvents = 'none';
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    handleScroll();

    (window as any).__pwHandleProductScroll = handleScroll;

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true } as any);
      delete (window as any).__pwHandleProductScroll;
    };
  }, []);

  // IntersectionObserver to hide persistent CTAs when footer comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        showButtonsRef.current = !entry.isIntersecting;
        if (typeof (window as any).__pwHandleProductScroll === 'function') {
          (window as any).__pwHandleProductScroll();
        }
      },
      { 
        rootMargin: '0px 0px 150px 0px',
        threshold: 0 
      }
    );

    const currentFooter = document.getElementById('footer');
    if (currentFooter) {
      observer.observe(currentFooter);
    }

    return () => {
      if (currentFooter) {
        observer.unobserve(currentFooter);
      }
    };
  }, []);

  // E-commerce handlers mapped directly to Shopify Cart AJAX APIs
  const handleAddToCart = async () => {
    const variantId = getActiveVariantId();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);

    if (!variantId) {
      console.warn('No active Shopify variant ID found');
      return;
    }

    try {
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] }),
      });
      
      const badge = document.getElementById('cart-counter-display');
      if (badge) {
        const currentCount = parseInt(badge.innerText) || 0;
        badge.innerText = String(currentCount + 1);
      }
    } catch (err) {
      console.error('Failed to add item to Shopify cart via AJAX API', err);
    }
  };

  const handleBuyNow = async () => {
    const variantId = getActiveVariantId();
    setIsCheckingOut(true);

    if (!variantId) {
      window.location.href = '/collections/all';
      return;
    }

    window.location.href = `/cart/${variantId}:1`;
  };

  // Determine active model URL
  const getActiveModelUrl = () => {
    if (activeTeam === 'redbull') return redbullUrl;
    if (activeTeam === 'ferrari') return ferrariUrl;
    if (activeTeam === 'mercedes') return mercedesUrl;
    if (activeTeam === 'lando-norris-helmet') return norrisHelmetUrl || '';
    if (activeTeam === 'schumacher-helmet') return schumacherHelmetUrl || '';
    if (activeTeam === 'verstappen-helmet') return verstappenHelmetUrl || '';
    return mclarenUrl;
  };

  // Handle switcher button click taking the user to their own page URL directly
  const handleTeamSwitch = (targetTeam: keyof typeof TEAMS_DATA) => {
    const handleMap: Record<keyof typeof TEAMS_DATA, string> = {
      mclaren: 'mclaren-mcl39',
      redbull: 'red-bull-rb19',
      ferrari: 'ferrari-sf23',
      mercedes: 'mercedes-w14',
      'lando-norris-helmet': 'lando-norris-helmet',
      'schumacher-helmet': 'schumacher-helmet',
      'verstappen-helmet': 'verstappen-helmet',
    };
    const targetHandle = handleMap[targetTeam];
    window.history.pushState(null, '', '/products/' + targetHandle);
    setActiveTeam(targetTeam);
  };

  // Restrict switcher button scope to contextual context (D-03)
  const switcherTeams = isHelmet 
    ? ['lando-norris-helmet', 'schumacher-helmet', 'verstappen-helmet']
    : ['mclaren', 'redbull', 'ferrari', 'mercedes'];

  return (
    <div 
      className="relative w-full min-h-screen bg-[#EDEBE5] text-[#0C0C0C]"
      style={{
        '--team-accent': teamInfo.accentColor,
        '--team-accent-text': '#FFFFFF'
      } as React.CSSProperties}
    >
      {/* 1. Scrollytelling Product Showcase Track */}
      <div ref={trackRef} className="relative w-full product-track" style={{ height: '400vh' }}>
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          
          {/* Background Wordmark Removed */}
 
          {/* Full Screen WebGL Canvas */}
          <div className="absolute inset-0 w-full h-full z-10 select-none pointer-events-none">
            <CarCanvas 
              modelName={activeTeam} 
              modelUrl={getActiveModelUrl()}
              mclarenUrl={mclarenUrl}
              redbullUrl={redbullUrl}
              ferrariUrl={ferrariUrl}
              mercedesUrl={mercedesUrl}
              norrisHelmetUrl={norrisHelmetUrl}
              schumacherHelmetUrl={schumacherHelmetUrl}
              verstappenHelmetUrl={verstappenHelmetUrl}
            />
          </div>
 
          {/* Model Switcher Configurator Wrapper */}
          <div 
            ref={configuratorRef}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 pointer-events-auto transition-all duration-500"
            style={{ 
              opacity: 1,
              transform: 'translate(-50%, 0)',
              pointerEvents: 'auto'
            }}
          >
            {/* Model Tagline */}
            <div 
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '18px',
                color: teamInfo.accentColor,
                opacity: 0.5,
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              "{teamInfo.subtitle}"
            </div>

            {/* Configurator Buttons */}
            <div className="flex gap-3">
              {switcherTeams.map((team) => (
                <button
                  key={team}
                  onClick={() => handleTeamSwitch(team as keyof typeof TEAMS_DATA)}
                  className={`px-5 py-2.5 border font-mono text-[11px] uppercase transition-all flex items-center justify-between gap-3 backdrop-blur-md whitespace-nowrap ${
                    activeTeam === team
                      ? 'border-brand-black bg-[#0C0C0C]/85 text-[#EDEBE5] font-semibold'
                      : 'border-brand-black/20 hover:border-brand-black/45 text-brand-black/75 bg-[#EDEBE5]/45'
                  }`}
                >
                  <span>{teamButtonLabels[team]}</span>
                  {activeTeam === team && (
                    <div 
                      className="w-1.5 h-1.5 rounded-none" 
                      style={{ backgroundColor: TEAMS_DATA[team].accentColor }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* LEFT SPECIFICATIONS CARD */}
          <div 
            ref={leftCardRef}
            className="absolute left-6 md:left-[60px] top-1/2 -translate-y-1/2 w-full max-w-[340px] z-20 pointer-events-auto transition-all duration-700 ease-out flex flex-col gap-4"
            style={{
              transform: 'translateY(-50%) translateX(-150%)',
              opacity: 0,
              pointerEvents: 'none'
            }}
          >
            <div className="flex flex-col gap-3">
              <a href="/" className="inline-flex items-center gap-2 text-xs font-mono text-brand-black/55 hover:text-brand-red mb-1 transition-colors">
                <ArrowLeft size={14} /> BACK TO PITWALL
              </a>
              <TechSpecTable 
                title="Telemetry & Dimension Specs" 
                specs={[
                  { label: 'CHASSIS CODE:', value: teamInfo.referenceCode },
                  { label: 'CATALOG SCALE:', value: scaleInfo.label, highlighted: true },
                  { label: 'DIMENSIONS:', value: scaleInfo.dimensions },
                  { label: 'UNITS PARTS:', value: totalParts },
                  { label: 'NET WEIGHT:', value: scaleInfo.weight },
                  { label: 'MATERIALS:', value: teamInfo.specs.material },
                ]}
              />
            </div>
          </div>

          {/* RIGHT PRICING & CALIBRATION CARD */}
          <div 
            ref={rightCardRef}
            className="absolute right-6 md:right-[60px] top-1/2 -translate-y-1/2 w-full max-w-[340px] z-20 pointer-events-auto transition-all duration-700 ease-out"
            style={{
              transform: 'translateY(-50%) translateX(150%)',
              opacity: 0,
              pointerEvents: 'none'
            }}
          >
            <div className="border border-brand-black/10 bg-[#EDEBE5] p-6 flex flex-col gap-6">
              <span className="font-mono text-xs uppercase font-semibold text-brand-red block border-b border-brand-black/10 pb-2">
                Chassis Calibration
              </span>
              
              <div className="space-y-4">
                <div>
                  <span className="font-mono text-[10px] text-brand-black/40 block mb-2">
                    SELECT COLLECTIBLE SIZE
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                     {(isHelmet ? Object.keys(HELMET_SCALES) : Object.keys(SCALES_DATA)).map((scale) => (
                      <button
                        key={scale}
                        onClick={() => setActiveScale(scale as keyof typeof SCALES_DATA)}
                        className={`py-3 border font-mono text-xs uppercase transition-all flex flex-col items-center justify-center gap-0.5 backdrop-blur-md ${
                          activeScale === scale
                            ? 'border-brand-black bg-[#0C0C0C]/85 text-[#EDEBE5] font-semibold'
                            : 'border-brand-black/15 hover:border-brand-black/40 text-brand-black/75 bg-[#EDEBE5]/40'
                        }`}
                      >
                        <span className="text-sm font-bold">{scale}</span>
                        <span className="text-[8px] text-brand-black/45 scale-[0.9]">
                          {(isHelmet ? HELMET_SCALES : SCALES_DATA)[scale as keyof typeof SCALES_DATA].label.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-brand-black/10 pt-4">
                  <span className="font-mono text-[10px] text-brand-black/40 uppercase block mb-1">
                    PRICE UNIT
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl text-brand-black font-bold">
                      {getDisplayPrice()}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-brand-black/40 uppercase block mt-1">
                    INR (All India Delivery Included)
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Actions CTA */}
      <div 
        ref={ctaBlockRef}
        className="fixed bottom-[75px] left-1/2 -translate-x-1/2 w-full max-w-sm px-6 md:px-0 z-50 flex items-center gap-4 transition-all duration-500 ease-in-out"
        style={{
          transform: 'translate(-50%, 96px) scale(0.95)',
          opacity: 0,
          pointerEvents: 'none'
        }}
      >
        <button
          onClick={handleBuyNow}
          disabled={isCheckingOut}
          className="flex-1 h-11 hover:bg-brand-black/90 hover:text-[#EDEBE5] backdrop-blur-md border border-brand-black/30 text-brand-black font-mono text-xs uppercase tracking-widest font-semibold transition-colors duration-200 cursor-pointer focus:outline-none flex items-center justify-center disabled:opacity-60 disabled:cursor-wait"
          style={{ backgroundColor: 'var(--team-accent)', color: '#FFFFFF' }}
        >
          {isCheckingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buy now'}
        </button>
        <button
          onClick={handleAddToCart}
          className={`flex-1 h-11 border font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-200 cursor-pointer focus:outline-none flex items-center justify-center backdrop-blur-md ${
            justAdded 
              ? 'text-brand-black font-bold' 
              : 'border-brand-black/30 bg-[#EDEBE5]/50 hover:bg-brand-black/90 hover:text-[#EDEBE5] text-brand-black'
          }`}
          style={justAdded ? { backgroundColor: 'var(--team-accent)', borderColor: 'var(--team-accent)' } : {}}
        >
          {justAdded ? (
            <span className="flex items-center gap-1">
              <Check size={14} /> Added
            </span>
          ) : (
            'add to cart'
          )}
        </button>
      </div>

      {/* Featured Products Carousel */}
      <FeaturedCarousel />
    </div>
  );
}
