import React, { useState, useEffect } from 'react';
import { Logger } from '../utils/logger';

export interface Product {
  title: string;
  url: string;
  price: string;
  image: string;
  specs?: string;
}

interface CollectionCardProps {
  product: Product;
  className?: string;
  isTall?: boolean;
  style?: React.CSSProperties;
}

export function CollectionCard({ product, className = '', isTall = false, style }: CollectionCardProps) {
  const [displayedProduct, setDisplayedProduct] = useState<Product>(product);
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (product.url !== displayedProduct.url) {
      setIsFading(true);
      timer = setTimeout(() => {
        setDisplayedProduct(product);
        setIsFading(false);
      }, 300); // smooth 300ms transition
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [product, displayedProduct]);

  // Handle click calibration action
  const handleCalibrate = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    window.location.href = displayedProduct.url;
  };

  return (
    <a
      href={displayedProduct.url}
      className={`pw-card group relative flex flex-col justify-end overflow-hidden bg-white text-[#0C0C0C] rounded-[5px] shadow-sm transition-all duration-300 ${
        isTall ? 'h-full w-full' : 'aspect-square md:aspect-auto md:flex-1 md:h-full md:min-h-0 w-full'
      } ${className}`}
      style={style}
    >
      <div
        className={`w-full h-full flex flex-col justify-end min-h-0 transition-opacity duration-300 ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Full-bleed background Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-50">
          <img
            src={displayedProduct.image}
            alt={displayedProduct.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => {
              Logger.warn(`Failed to load product image: ${displayedProduct.image}`);
            }}
          />
        </div>

        {/* Pre-order/Scale badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="font-mono text-[8px] uppercase tracking-wider bg-[#0C0C0C] text-[#EDEBE5] px-1.5 py-0.5 rounded-[2px]">
            {displayedProduct.specs ? displayedProduct.specs.split('/')[0].trim() : '1:18 SCALE'}
          </span>
        </div>

        {/* Minimal baseline footer before hover */}
        <div className="relative z-10 p-3 md:p-4 border-t border-[#0C0C0C]/5 flex justify-between items-center bg-white/90 backdrop-blur-sm w-full">
          <span className="font-mono text-[10px] uppercase tracking-wider truncate max-w-[70%] text-[#0C0C0C] font-semibold">
            {displayedProduct.title}
          </span>
          <span className="font-mono text-[10px] font-bold text-[#0C0C0C]">
            {displayedProduct.price}
          </span>
        </div>

        {/* Slide-up details overlay on hover - z-20 to cover footer and badge */}
        <div className="absolute inset-0 bg-white/95 p-4 flex flex-col justify-between translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 border-t border-[#0C0C0C]/5">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#F6C917] font-bold">
              SPECIFICATIONS
            </span>
            <h4 className="font-display-strict text-sm md:text-base uppercase tracking-tighter text-[#0C0C0C] font-extrabold leading-none">
              {displayedProduct.title}
            </h4>
            <div className="border-t border-[#0C0C0C]/10 pt-2 mt-1 font-mono text-[9px] text-[#0C0C0C]/70 uppercase space-y-0.5">
              <div>Scale: {displayedProduct.specs ? displayedProduct.specs.split('/')[0].trim() : '1:18'}</div>
              <div>Detail: {displayedProduct.specs && displayedProduct.specs.split('/').length > 1 ? displayedProduct.specs.split('/').slice(1).join('/') : 'PRECISION COLLECTIBLE'}</div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="text-right font-mono text-sm font-extrabold text-[#0C0C0C]">
              {displayedProduct.price}
            </div>
            <div
              onClick={handleCalibrate}
              className="w-full h-8 border border-[#0C0C0C] bg-[#0C0C0C] text-[#EDEBE5] group-hover:bg-[#F6C917] group-hover:text-[#0C0C0C] group-hover:border-[#F6C917] font-mono text-[9px] uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer"
            >
              CALIBRATE
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export function TitleCard() {
  return (
    <div className="flex items-center justify-center p-4 bg-white text-[#0C0C0C] rounded-[5px] h-full min-h-[64px] md:min-h-0 select-none">
      <h2 className="font-display-strict text-2xl lowercase tracking-tighter text-[#0C0C0C] font-bold">
        the collection
      </h2>
    </div>
  );
}

const fallbackProducts: Product[] = [
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

interface CollectionGridProps {
  products: Product[];
}

export function CollectionGrid({ products }: CollectionGridProps) {
  const [step, setStep] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Pad or fallback to complete the list of items
  const getDisplayItems = (): Product[] => {
    try {
      const list = [...(products || [])];
      if (list.length === 0) {
        return fallbackProducts;
      }
      
      let i = 0;
      while (list.length < 5 && i < fallbackProducts.length) {
        const fb = fallbackProducts[i];
        if (!list.some((p) => p.url === fb.url)) {
          list.push(fb);
        }
        i++;
      }
      
      while (list.length < 5) {
        list.push(list[list.length % list.length]);
      }
      return list;
    } catch (err) {
      Logger.error('Error generating product list in CollectionGrid', err);
      return fallbackProducts;
    }
  };

  const displayItems = getDisplayItems();
  const N = displayItems.length;

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setStep((prev) => prev + 1);
    }, 6000); // cycle every 6000ms

    return () => clearInterval(interval);
  }, [isHovered]);

  const p0 = displayItems[(step * 5) % N];
  const p1 = displayItems[(step * 5 + 1) % N];
  const p2 = displayItems[(step * 5 + 2) % N];
  const p3 = displayItems[(step * 5 + 3) % N];
  const p4 = displayItems[(step * 5 + 4) % N];

  return (
    <div
      className="w-full h-full flex flex-col justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full h-full max-h-[85vh] md:max-h-none overflow-y-auto md:overflow-hidden p-3 md:p-4">
        {/* Column 1 */}
        <div className="flex flex-col gap-3 h-full justify-between min-h-0">
          <CollectionCard product={p0} className="w-full flex-1 min-h-0" />
          <CollectionCard product={p1} className="w-full flex-1 min-h-0" />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-3 h-full justify-between min-h-0">
          <CollectionCard product={p2} className="w-full flex-1 min-h-0" />
          <CollectionCard product={p3} className="w-full flex-1 min-h-0" />
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-3 h-full justify-between min-h-0">
          <div className="flex-[3] min-h-0">
            <CollectionCard product={p4} className="w-full h-full" isTall={true} />
          </div>
          <div className="flex-[1] min-h-0">
            <TitleCard />
          </div>
        </div>
      </div>
    </div>
  );
}
