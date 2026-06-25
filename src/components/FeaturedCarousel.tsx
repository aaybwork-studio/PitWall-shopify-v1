'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

interface CarouselItem {
  id: number;
  title: string;
  subtitle: string;
  type: string;
  fallbackColor: string;
  accentColor: string;
  specs: { label: string; value: string }[];
  description: string;
  accentText: string;
  // Beautiful interactive grid details
  telemetry: {
    speed: string;
    gForce: string;
    bpm: string;
    lapTime: string;
  };
}

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 1,
    title: 'VERSTAPPEN REPLICA HELMET',
    subtitle: 'Milton Keynes Championship Spec',
    type: 'HELMET REPLICAS',
    fallbackColor: '#E5E3DD',
    accentColor: '#FCD500',
    accentText: '#000000',
    specs: [
      { label: 'SCALE:', value: '1:1 Full Scale' },
      { label: 'CHASSIS WEIGHT:', value: '1,240 Grams' },
      { label: 'SHELL MATERIAL:', value: 'Carbon Kevlar Composite' },
      { label: 'VISOR TECH:', value: 'Anti-fog Hydrophobic Coated' },
    ],
    description: 'The exact helmet layout worn by Max Verstappen during his dominant championship campaign. Realized in true 1:1 scale with hand-laid graphic decals, premium inner lining padding, and working visors.',
    telemetry: {
      speed: '342 KM/H',
      gForce: '5.2 G',
      bpm: '168 BPM',
      lapTime: '1:14.654',
    }
  },
  {
    id: 2,
    title: 'LECLERC REPLICA HELMET',
    subtitle: 'Maranello Crimson Tribute',
    type: 'HELMET REPLICAS',
    fallbackColor: '#F5F4F0',
    accentColor: '#E10600',
    accentText: '#FFFFFF',
    specs: [
      { label: 'SCALE:', value: '1:1 Full Scale' },
      { label: 'CHASSIS WEIGHT:', value: '1,220 Grams' },
      { label: 'SHELL MATERIAL:', value: 'Pre-preg Carbon Fiber' },
      { label: 'VISOR TECH:', value: 'Gold Iridium Reflective' },
    ],
    description: 'Crafted with authentic racing scarlet matte-finish paint, this 1:1 scale tribute captures the exact contours and graphic arrays worn by Charles Leclerc at his home race in Monaco.',
    telemetry: {
      speed: '338 KM/H',
      gForce: '4.8 G',
      bpm: '172 BPM',
      lapTime: '1:15.012',
    }
  },
  {
    id: 3,
    title: 'HAMILTON STEALTH HELMET',
    subtitle: 'Brackley Midnight Edition',
    type: 'HELMET REPLICAS',
    fallbackColor: '#DCDAD3',
    accentColor: '#00A19B',
    accentText: '#FFFFFF',
    specs: [
      { label: 'SCALE:', value: '1:1 Full Scale' },
      { label: 'CHASSIS WEIGHT:', value: '1,250 Grams' },
      { label: 'SHELL MATERIAL:', value: 'Exposed Weave Carbon Kevlar' },
      { label: 'VISOR TECH:', value: 'Neon Purple Chrome Reflector' },
    ],
    description: 'An aggressive, stealth midnight-black design accented by high-contrast neon purple graphics. Featuring exposed high-gloss carbon weave patterns and professional-grade interior fittings.',
    telemetry: {
      speed: '340 KM/H',
      gForce: '5.0 G',
      bpm: '165 BPM',
      lapTime: '1:14.891',
    }
  },
];

export function FeaturedCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const activeItem = CAROUSEL_ITEMS[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    setHoveredCard(null);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
    setHoveredCard(null);
  };

  return (
    <section className="w-full h-screen bg-brand-white border-t border-brand-black/15 select-none relative z-30 flex flex-col overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        /* ─── Carousel Ticker Styles ─────────────────────────────────────── */
        .pw-carousel-ticker {
          background-color: #7A7A7A; /* brand color grey/red */
          border-top: 1px solid rgba(12, 12, 12, 0.15);
          border-bottom: 1px solid rgba(12, 12, 12, 0.15);
          padding: 14px 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          width: 100%;
          position: relative;
          z-index: 10;
          flex-shrink: 0;
        }

        .pw-carousel-ticker-track {
          display: flex;
          white-space: nowrap;
          animation: marquee-left 26s linear infinite;
        }

        .pw-carousel-ticker:hover .pw-carousel-ticker-track {
          animation-play-state: paused;
        }

        .pw-carousel-ticker-item {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 12px;
          color: #0C0C0C;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          white-space: nowrap;
          padding-right: 32px;
        }

        .pw-carousel-ticker-sep {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: #0C0C0C;
          font-weight: 400;
          margin-left: 32px;
          letter-spacing: normal;
        }

        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ─── Brutalist Blueprint Grid & Tech Layouts ──────────────────────── */
        .blueprint-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-image: 
            radial-gradient(rgba(12, 12, 12, 0.15) 1px, transparent 1px),
            linear-gradient(to right, rgba(12, 12, 12, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(12, 12, 12, 0.05) 1px, transparent 1px);
          background-size: 24px 24px, 48px 48px, 48px 48px;
          background-position: center;
        }

        .telemetry-overlay {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: rgba(12, 12, 12, 0.6);
          position: absolute;
          padding: 24px;
          display: grid;
          gap: 16px;
          pointer-events: none;
        }

        .telemetry-row {
          display: flex;
          flex-direction: column;
          border-left: 2px solid var(--accent-col);
          padding-left: 12px;
        }

        .telemetry-value {
          font-size: 20px;
          font-weight: bold;
          color: #0C0C0C;
          line-height: 1.2;
        }
      ` }} />

      {/* 1. SECTION TICKER MARQUEE HEADER */}
      <section className="pw-carousel-ticker">
        <div className="pw-carousel-ticker-track">
          <div className="pw-carousel-ticker-item">FEATURED COLLECTIBLES <span className="pw-carousel-ticker-sep">/</span></div>
          <div className="pw-carousel-ticker-item">FEATURED COLLECTIBLES <span className="pw-carousel-ticker-sep">/</span></div>
          <div className="pw-carousel-ticker-item">FEATURED COLLECTIBLES <span className="pw-carousel-ticker-sep">/</span></div>
          <div className="pw-carousel-ticker-item">FEATURED COLLECTIBLES <span className="pw-carousel-ticker-sep">/</span></div>
          <div className="pw-carousel-ticker-item">FEATURED COLLECTIBLES <span className="pw-carousel-ticker-sep">/</span></div>
          <div className="pw-carousel-ticker-item">FEATURED COLLECTIBLES <span className="pw-carousel-ticker-sep">/</span></div>
          <div className="pw-carousel-ticker-item">FEATURED COLLECTIBLES <span className="pw-carousel-ticker-sep">/</span></div>
          <div className="pw-carousel-ticker-item">FEATURED COLLECTIBLES <span className="pw-carousel-ticker-sep">/</span></div>
        </div>
      </section>

      {/* 2. Carousel Viewport Container */}
      <div className="relative flex-1 w-full h-full">
        
        {/* Main Slider Card */}
        <div 
          className="relative w-full h-full border-b border-brand-black/20 overflow-hidden cursor-pointer"
          style={{ backgroundColor: activeItem.fallbackColor }}
          onMouseEnter={() => setHoveredCard(activeIndex)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          
          {/* Product Visual Container (Brutalist Tech Blueprint) */}
          <div 
            className={`absolute inset-0 h-full transition-all duration-500 ease-out flex items-center justify-center ${
              hoveredCard === activeIndex 
                ? 'w-full md:w-1/2 translate-x-[-100%] md:translate-x-0' 
                : 'w-full translate-x-0'
            }`}
          >
            <div className="blueprint-container flex items-center justify-center">
              
              {/* Telemetry data side-panel */}
              <div 
                className="telemetry-overlay left-6 top-6"
                style={{ '--accent-col': activeItem.accentColor } as React.CSSProperties}
              >
                <div className="telemetry-row">
                  <span>VELOCITY TRACK:</span>
                  <span className="telemetry-value">{activeItem.telemetry.speed}</span>
                </div>
                <div className="telemetry-row">
                  <span>G-FORCE METRIC:</span>
                  <span className="telemetry-value">{activeItem.telemetry.gForce}</span>
                </div>
                <div className="telemetry-row">
                  <span>BIOMETRIC BPM:</span>
                  <span className="telemetry-value">{activeItem.telemetry.bpm}</span>
                </div>
                <div className="telemetry-row">
                  <span>BEST LAPTIME:</span>
                  <span className="telemetry-value">{activeItem.telemetry.lapTime}</span>
                </div>
              </div>

              {/* Graphic Title & Technical Circle */}
              <div className="relative flex flex-col items-center justify-center text-center">
                
                {/* Tech target circle overlay */}
                <div className="absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] border border-dashed border-brand-black/20 rounded-full animate-[spin_60s_linear_infinite]" />
                <div className="absolute w-[220px] h-[220px] md:w-[300px] md:h-[300px] border border-brand-black/10 rounded-full" />
                
                <h2 className="font-display-strict text-[8vw] leading-none uppercase font-extrabold text-brand-black/10 select-none tracking-tighter">
                  {activeItem.title.split(' ')[0]}
                </h2>
                
                {/* Simulated product placeholder box with dimensions */}
                <div 
                  className="w-[180px] h-[180px] md:w-[240px] md:h-[240px] border-2 border-brand-black bg-brand-white/85 flex flex-col items-center justify-center p-4 relative z-10"
                  style={{ borderLeft: `6px solid ${activeItem.accentColor}` }}
                >
                  {/* Crosshair corners */}
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-brand-black" />
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-brand-black" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-brand-black" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-brand-black" />
                  
                  {/* Vector grid graphic */}
                  <svg className="w-16 h-16 opacity-45 mb-2" viewBox="0 0 100 100" style={{ stroke: activeItem.accentColor, fill: 'none', strokeWidth: '1.5' }}>
                    <path d="M10,50 L90,50 M50,10 L50,90" strokeDasharray="3,3" />
                    <circle cx="50" cy="50" r="25" />
                    <path d="M30,30 L70,70 M30,70 L70,30" />
                  </svg>
                  
                  <span className="font-technical-strict text-[10px] font-bold text-brand-black uppercase block tracking-wider">
                    {activeItem.title}
                  </span>
                  <span className="font-technical-strict text-[8px] text-brand-black/45 block mt-1">
                    REFERENCE: PW-{activeItem.id}00
                  </span>
                </div>
              </div>

              {/* Blueprint coordinate markers */}
              <div className="absolute bottom-6 right-6 font-mono text-[9px] text-brand-black/30 text-right">
                GRID COMP: 45.928.A1<br />
                CALIBRATION STATUS: ACTIVE
              </div>

            </div>
            
            {/* Product Visual Text Label Overlay */}
            <div className={`absolute bottom-6 left-6 font-technical-strict text-[10px] text-brand-black/40 uppercase transition-opacity duration-300 ${
              hoveredCard === activeIndex ? 'opacity-0' : 'opacity-100'
            }`}>
              [ HOVER FOR CATALOG SPECIFICATIONS ]
            </div>
          </div>

          {/* Brand Slide-Over Details Card */}
          <div 
            className={`absolute top-0 right-0 h-full bg-brand-white border-l border-brand-black/20 flex flex-col justify-between p-8 md:p-12 transition-all duration-500 ease-out z-10 ${
              hoveredCard === activeIndex 
                ? 'w-full md:w-1/2 translate-x-0 opacity-100' 
                : 'w-full md:w-1/2 translate-x-full opacity-0 pointer-events-none'
            }`}
            style={{ backgroundColor: activeItem.fallbackColor }}
          >
            {/* Top Section: Info Header */}
            <div className="flex justify-between items-start border-b border-brand-black/15 pb-4">
              <div>
                <span className="font-technical-strict text-[9px] tracking-widest font-bold block mb-1" style={{ color: activeItem.accentColor }}>
                  {activeItem.type}
                </span>
                <h3 className="font-display-strict text-xl md:text-2xl uppercase tracking-tighter text-brand-black font-extrabold leading-none">
                  {activeItem.title}
                </h3>
                <span className="font-technical-strict text-[9px] text-brand-black/55 uppercase font-medium mt-1 block">
                  {activeItem.subtitle}
                </span>
              </div>
            </div>

            {/* Center Section: Specs Outline Box */}
            <div className="my-6">
              <div className="border border-brand-black/20 bg-brand-white/40 p-4 font-technical-strict text-[11px] space-y-2 uppercase">
                {activeItem.specs.map((spec, idx) => (
                  <div key={idx} className="flex justify-between border-b border-brand-black/10 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-brand-black/45">{spec.label}</span>
                    <span className="text-brand-black font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
              <p className="font-body-strict text-[12px] text-brand-black/80 leading-relaxed mt-4 italic">
                {activeItem.description}
              </p>
            </div>

            {/* Bottom Section: View Product Action */}
            <div className="flex justify-center border-t border-brand-black/15 pt-4">
              <button 
                onClick={() => {
                  window.location.href = `/product?model=${activeItem.id === 1 ? 'verstappen' : activeItem.id === 2 ? 'norris' : 'schumacher'}`;
                }}
                className="w-full max-w-[220px] h-11 border border-brand-black bg-brand-white hover:bg-brand-black hover:text-brand-white text-brand-black font-technical-strict text-xs uppercase tracking-widest font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                style={{ borderLeft: `4px solid ${activeItem.accentColor}` }}
              >
                CALIBRATE NOW <ArrowUpRight size={14} />
              </button>
            </div>

          </div>

        </div>

        {/* Left Arrow Trigger */}
        <button 
          onClick={handlePrev}
          className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand-white hover:bg-brand-black hover:text-brand-white border border-brand-black flex items-center justify-center text-brand-black transition-colors duration-200 cursor-pointer z-20"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Arrow Trigger */}
        <button 
          onClick={handleNext}
          className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand-white hover:bg-brand-black hover:text-brand-white border border-brand-black flex items-center justify-center text-brand-black transition-colors duration-200 cursor-pointer z-20"
        >
          <ChevronRight size={20} />
        </button>

      </div>

    </section>
  );
}
