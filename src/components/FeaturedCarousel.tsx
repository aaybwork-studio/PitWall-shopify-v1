import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

interface CarouselItem {
  id: number;
  title: string;
  subtitle: string;
  type: string;
  videoSrc?: string;
  fallbackColor: string;
  specs: { label: string; value: string }[];
  description: string;
}

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 1,
    title: 'VERSTAPPEN REPLICA HELMET',
    subtitle: 'Milton Keynes Championship Spec',
    type: 'HELMET REPLICAS',
    videoSrc: '/video/F1_helmet_orbiting_white_void_202605251628.mp4',
    fallbackColor: '#E5E3DD',
    specs: [
      { label: 'SCALE:', value: '1:1 Full Scale' },
      { label: 'CHASSIS WEIGHT:', value: '1,240 Grams' },
      { label: 'SHELL MATERIAL:', value: 'Carbon Kevlar Composite' },
      { label: 'VISOR TECH:', value: 'Anti-fog Hydrophobic Coated' },
    ],
    description: 'The exact helmet layout worn by Max Verstappen during his dominant championship campaign. Realized in true 1:1 scale with hand-laid graphic decals, premium inner lining padding, and working visors.',
  },
  {
    id: 2,
    title: 'LECLERC REPLICA HELMET',
    subtitle: 'Maranello Crimson Tribute',
    type: 'HELMET REPLICAS',
    videoSrc: '/video/F1_helmet_orbiting_white_void_202605251636.mp4',
    fallbackColor: '#F5F4F0',
    specs: [
      { label: 'SCALE:', value: '1:1 Full Scale' },
      { label: 'CHASSIS WEIGHT:', value: '1,220 Grams' },
      { label: 'SHELL MATERIAL:', value: 'Pre-preg Carbon Fiber' },
      { label: 'VISOR TECH:', value: 'Gold Iridium Reflective' },
    ],
    description: 'Crafted with authentic racing scarlet matte-finish paint, this 1:1 scale tribute captures the exact contours and graphic arrays worn by Charles Leclerc at his home race in Monaco.',
  },
  {
    id: 3,
    title: 'HAMILTON STEALTH HELMET',
    subtitle: 'Brackley Midnight Edition',
    type: 'HELMET REPLICAS',
    videoSrc: '/video/F1_helmet_orbiting_white_void_202605251628.mp4',
    fallbackColor: '#DCDAD3',
    specs: [
      { label: 'SCALE:', value: '1:1 Full Scale' },
      { label: 'CHASSIS WEIGHT:', value: '1,250 Grams' },
      { label: 'SHELL MATERIAL:', value: 'Exposed Weave Carbon Kevlar' },
      { label: 'VISOR TECH:', value: 'Neon Purple Chrome Reflector' },
    ],
    description: 'An aggressive, stealth midnight-black design accented by high-contrast neon purple graphics. Featuring exposed high-gloss carbon weave patterns and professional-grade interior fittings.',
  },
];

export function FeaturedCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const activeItem = CAROUSEL_ITEMS[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    setHoveredCard(null);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
    setHoveredCard(null);
  };

  const handleMouseEnter = (idx: number) => {
    setHoveredCard(idx);
    const video = videoRefs.current[idx];
    if (video) {
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = (idx: number) => {
    setHoveredCard(null);
    const video = videoRefs.current[idx];
    if (video) {
      video.pause();
    }
  };

  return (
    <section className="w-full h-screen bg-[#EDEBE5] border-t border-brand-black/15 select-none relative z-30 flex flex-col overflow-hidden">
      
      {/* 1. Carousel Ticker */}
      <section className="ticker-bar !py-3">
        <div className="ticker-track">
          <div className="ticker-item-1">FEATURED PRODUCTS <span className="ticker-sep-1">/</span></div>
          <div className="ticker-item-1">FEATURED PRODUCTS <span className="ticker-sep-1">/</span></div>
          <div className="ticker-item-1">FEATURED PRODUCTS <span className="ticker-sep-1">/</span></div>
          <div className="ticker-item-1">FEATURED PRODUCTS <span className="ticker-sep-1">/</span></div>
          <div className="ticker-item-1">FEATURED PRODUCTS <span className="ticker-sep-1">/</span></div>
          <div className="ticker-item-1">FEATURED PRODUCTS <span className="ticker-sep-1">/</span></div>
          <div className="ticker-item-1">FEATURED PRODUCTS <span className="ticker-sep-1">/</span></div>
          <div className="ticker-item-1">FEATURED PRODUCTS <span className="ticker-sep-1">/</span></div>
        </div>
      </section>

      {/* 2. Carousel Viewport */}
      <div className="relative flex-1 w-full h-full">
        
        <div 
          className="relative w-full h-full border-b border-brand-black/20 overflow-hidden cursor-pointer"
          style={{ backgroundColor: activeItem.fallbackColor }}
          onMouseEnter={() => handleMouseEnter(activeIndex)}
          onMouseLeave={() => handleMouseLeave(activeIndex)}
        >
          
          <div 
            className={`absolute inset-0 h-full transition-all duration-500 ease-out flex items-center justify-center ${
              hoveredCard === activeIndex 
                ? 'w-full md:w-1/2 translate-x-[-100%] md:translate-x-0' 
                : 'w-full translate-x-0'
            }`}
          >
            {activeItem.videoSrc ? (
              <video
                ref={(el) => {
                  videoRefs.current[activeIndex] = el;
                }}
                className="w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
                src={activeItem.videoSrc}
                loop
                muted
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-black/15 font-display-strict text-8xl">
                {activeItem.title.split(' ')[0]}
              </div>
            )}
            
            <div className={`absolute bottom-6 left-6 font-mono text-[10px] text-brand-black/45 uppercase transition-opacity duration-300 ${
              hoveredCard === activeIndex ? 'opacity-0' : 'opacity-100'
            }`}>
              [ HOVER FOR SCHEMATICS ]
            </div>
          </div>

          <div 
            className={`absolute top-0 right-0 h-full bg-[#F6C917] border-l border-brand-black/20 flex flex-col justify-between p-8 pr-20 md:p-12 md:pr-28 transition-all duration-500 ease-out z-10 ${
              hoveredCard === activeIndex 
                ? 'w-full md:w-1/2 translate-x-0 opacity-100' 
                : 'w-full md:w-1/2 translate-x-full opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex justify-between items-start border-b border-brand-black/15 pb-4">
              <div>
                <span className="font-mono text-[9px] text-red-600 tracking-widest font-bold block mb-1">
                  {activeItem.type}
                </span>
                <h3 className="font-display-strict text-xl md:text-2xl uppercase tracking-tighter text-brand-black font-extrabold leading-none">
                  {activeItem.title}
                </h3>
                <span className="font-mono text-[9px] text-brand-black/55 uppercase font-medium mt-1 block">
                  {activeItem.subtitle}
                </span>
              </div>
            </div>

            <div className="my-6">
              <div className="border border-brand-black/20 bg-[#EDEBE5]/40 p-4 font-mono text-[11px] space-y-2 uppercase">
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

            <div className="flex justify-center border-t border-brand-black/15 pt-4">
              <button 
                onClick={() => location.href = '/collections/all'}
                className="w-full max-w-[200px] h-10 border border-brand-black bg-[#EDEBE5] hover:bg-brand-black hover:text-[#EDEBE5] text-brand-black font-mono text-xs uppercase tracking-widest font-bold transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5"
              >
                VIEW PRODUCT <ArrowUpRight size={14} />
              </button>
            </div>

          </div>

        </div>

        <button 
          onClick={handlePrev}
          className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#F6C917] hover:bg-brand-black hover:text-[#EDEBE5] border border-brand-black flex items-center justify-center text-brand-black transition-colors duration-200 cursor-pointer z-20"
        >
          <ChevronLeft size={20} />
        </button>

        <button 
          onClick={handleNext}
          className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#F6C917] hover:bg-brand-black hover:text-[#EDEBE5] border border-brand-black flex items-center justify-center text-brand-black transition-colors duration-200 cursor-pointer z-20"
        >
          <ChevronRight size={20} />
        </button>

      </div>

    </section>
  );
}
