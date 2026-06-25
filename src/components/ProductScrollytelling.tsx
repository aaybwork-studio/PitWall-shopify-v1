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
  productType?: string;
  productImage?: string;
  productDescription?: string;
}

export interface ProductItem {
  handle: string;
  title: string;
  price: string;
  image: string;
  type: string;
  description: string;
}

const ALL_PRODUCTS_DB: ProductItem[] = [
  // WLED Light Boxes
  { handle: "monaco-wled", title: "Monaco GP WLED Light Box", price: "₹5,499.00", image: "/assets/wled_light_boxes.png", type: "WLED Light Boxes", description: "WLED LIGHT BOX / NEON GLOW CHASSIS. Monaco GP edition." },
  { handle: "silverstone-wled", title: "Silverstone WLED Light Box", price: "₹5,499.00", image: "/assets/wled_light_boxes.png", type: "WLED Light Boxes", description: "WLED LIGHT BOX / NEON GLOW CHASSIS. Silverstone GP edition." },
  { handle: "redbull-wled", title: "Red Bull Racing WLED Box", price: "₹5,999.00", image: "/assets/wled_light_boxes.png", type: "WLED Light Boxes", description: "WLED LIGHT BOX / TEAM EDITION. Red Bull Racing emblem." },
  
  // Car Models
  { handle: "mclaren-mcl39", title: "McLaren MCL39 1:18 Scale", price: "₹12,499.00", image: "/assets/mclaren.png", type: "Car Models", description: "1:18 SCALE / CHASSIS BRUTALIST DISPLAY. McLaren MCL39 replica model." },
  { handle: "red-bull-rb19", title: "Red Bull RB19 1:8 Scale", price: "₹48,999.00", image: "/assets/redbull.png", type: "Car Models", description: "1:8 SCALE / EXPERT DISPLAY PIECE. Red Bull Racing RB19 replica model." },
  { handle: "ferrari-sf-23", title: "Ferrari SF-23 1:24 Scale", price: "₹7,999.00", image: "/assets/ferrari.png", type: "Car Models", description: "1:24 SCALE / Scuderia Crimson. Ferrari SF-23 replica model." },
  { handle: "mercedes-w14", title: "Mercedes-AMG W14 1:64 Scale", price: "₹2,499.00", image: "/assets/mercedes.png", type: "Car Models", description: "1:64 SCALE / Stealth Chassis. Mercedes-AMG W14 replica model." },
  { handle: "vertical-stand", title: "Vertical Display Stand", price: "₹1,499.00", image: "/assets/car_models.png", type: "Car Models", description: "STAND ADD-ON / VERTICAL ACRYLIC MOUNT. Vertical display stand for model cars." },
  { handle: "desk-stand", title: "Desk Display Stand", price: "₹999.00", image: "/assets/car_models.png", type: "Car Models", description: "STAND ADD-ON / DESK MOUNT. Desktop mount stand for model cars." },
  { handle: "wall-holder", title: "Wall Display Holder", price: "₹1,199.00", image: "/assets/car_models.png", type: "Car Models", description: "STAND ADD-ON / WALL SURFACE MOUNT. Wall surface mount display holder for model cars." },
  
  // 2D Wall Art
  { handle: "monaco-track-art", title: "Monaco GP Track Wall Art", price: "₹2,999.00", image: "/assets/wall_art.png", type: "2D Wall Art", description: "2D WALL ART / STAINLESS CIRCUIT. Stainless circuit map layout of Monaco GP." },
  { handle: "silverstone-art", title: "Silverstone Steel Silhouette", price: "₹2,999.00", image: "/assets/wall_art.png", type: "2D Wall Art", description: "2D WALL ART / BRUTALIST METALWORK. Steel circuit silhouette layout of Silverstone GP." },
  { handle: "mcl38-silhouette", title: "Car Silhouette Wall Art", price: "₹3,499.00", image: "/assets/wall_art.png", type: "2D Wall Art", description: "2D WALL ART / STEEL CAR SHAPE. Steel wall art of F1 car silhouette." },
  { handle: "keyholder-track", title: "Keyholder Rack — Carbon", price: "₹1,899.00", image: "/assets/wall_art.png", type: "2D Wall Art", description: "2D WALL ART / KEY RACK STAGED. Carbon-weave track keyholder rack." },
  
  // Keychains
  { handle: "mclaren-keychain", title: "McLaren Carbon Weave Keychain", price: "₹799.00", image: "/assets/keychains.png", type: "Keychains", description: "KEYCHAINS / ZINC ALLOY CLASP. Carbon weave McLaren keychain." },
  { handle: "ferrari-keychain", title: "Ferrari Crimson Leather Key", price: "₹799.00", image: "/assets/keychains.png", type: "Keychains", description: "KEYCHAINS / EMBOSSED BADGE. Ferrari crimson leather keychain." },
  
  // Desk Accessories
  { handle: "front-wing-stand", title: "1:8 Front Wing Desk Stand", price: "₹3,499.00", image: "/assets/desk_accessories.png", type: "Desk Accessories", description: "DESK ACCESSORIES / FRONT WING EXHIBIT. 1:8 scale front wing desk stand." },
  { handle: "desk-map", title: "Desk Stand Track Map", price: "₹2,499.00", image: "/assets/desk_accessories.png", type: "Desk Accessories", description: "DESK ACCESSORIES / GRID START MAP. Desktop start grid track map stand." },
  { handle: "caliper-stand", title: "Brake Caliper Pen Stand", price: "₹2,199.00", image: "/assets/desk_accessories.png", type: "Desk Accessories", description: "DESK ACCESSORIES / MONOBLOC CALIPER. Monobloc caliper design pen stand." },
  { handle: "controller-dock", title: "F1 Controller Dock (Alloy)", price: "₹2,899.00", image: "/assets/desk_accessories.png", type: "Desk Accessories", description: "DESK ACCESSORIES / CONTROLLER DOCK. Alloy F1 themed game controller dock." },
  { handle: "piston-holder", title: "Pen Holder (Piston Cup)", price: "₹1,999.00", image: "/assets/desk_accessories.png", type: "Desk Accessories", description: "DESK ACCESSORIES / PISTON SHELL. Racing engine piston shell pen holder." },
  { handle: "keycaps-set", title: "Racing Keycaps Set (PBT)", price: "₹3,999.00", image: "/assets/desk_accessories.png", type: "Desk Accessories", description: "DESK ACCESSORIES / F1 SPEED COLORWAY. PBT mechanical keyboard speed keycaps set." },
  { handle: "coaster-team", title: "Carbon Team Coaster Set", price: "₹1,299.00", image: "/assets/desk_accessories.png", type: "Desk Accessories", description: "DESK ACCESSORIES / GLOSS FINISH. Carbon fiber glossy team coaster set." },
  { handle: "coaster-track-pack", title: "Circuit Coaster Set", price: "₹1,299.00", image: "/assets/desk_accessories.png", type: "Desk Accessories", description: "DESK ACCESSORIES / ANODIZED METALS. Anodized metal circuit layouts coaster set." },
  
  // Layered Art
  { handle: "suzuka-layered", title: "Suzuka 5-Layer Wooden Art", price: "₹5,999.00", image: "/assets/layered_art.png", type: "Layered Art", description: "LAYERED ART / 5 DEPTH PLYWOOD. 5-layer plywood circuit layout of Suzuka GP." },
  { handle: "monaco-layered", title: "Monaco Grand Prix Layered", price: "₹5,999.00", image: "/assets/layered_art.png", type: "Layered Art", description: "LAYERED ART / WOOD DEPTH CHART. Multi-depth wood circuit layout of Monaco GP." },
  
  // Driver Figurines
  { handle: "senna-figurine", title: "Ayrton Senna 1:24 Figure", price: "₹8,499.00", image: "/assets/driver_figurine.png", type: "Driver Figurines", description: "DRIVER FIGURINES / POLYRESIN. Hand-painted 1:24 scale Senna collectible figurine." },
  { handle: "hamilton-figurine", title: "Lewis Hamilton 1:24 Figure", price: "₹8,499.00", image: "/assets/driver_figurine.png", type: "Driver Figurines", description: "DRIVER FIGURINES / CHAMPION HELMET. Hand-painted 1:24 scale Hamilton collectible figurine." },
  { handle: "verstappen-figurine", title: "Max Verstappen 1:24 Figure", price: "₹8,499.00", image: "/assets/driver_figurine.png", type: "Driver Figurines", description: "DRIVER FIGURINES / WORLD CHAMPION. Hand-painted 1:24 scale Verstappen collectible figurine." },
  
  // Replica Helmets
  { handle: "max-verstappen-1-2-scale-helmet", title: "Max Verstappen 1:2 Scale Replica Helmet", price: "₹14,999.00", image: "/assets/lando-norris-helmet.png", type: "Replica Helmets", description: "Official 1:2 scale replica helmet of Max Verstappen. Monocoque acrylic structure." },
  { handle: "lewis-hamilton-1-2-scale-helmet", title: "Lewis Hamilton 1:2 Scale Replica Helmet", price: "₹14,999.00", image: "/assets/lando-norris-helmet.png", type: "Replica Helmets", description: "Official 1:2 scale replica helmet of Lewis Hamilton. Mercedes-AMG Petronas colors." },
  { handle: "lando-norris-1-2-scale-helmet", title: "Lando Norris 1:2 Scale Replica Helmet", price: "₹14,999.00", image: "/assets/lando-norris-helmet.png", type: "Replica Helmets", description: "Official 1:2 scale replica helmet of Lando Norris. McLaren F1 Team colors." },
  { handle: "charles-leclerc-1-2-scale-helmet", title: "Charles Leclerc 1:2 Scale Replica Helmet", price: "₹14,999.00", image: "/assets/lando-norris-helmet.png", type: "Replica Helmets", description: "Official 1:2 scale replica helmet of Charles Leclerc. Scuderia Ferrari colors." },
  
  // Driver Specific Extras
  { handle: "max-verstappen-1-18-scale-car", title: "Max Verstappen 1:18 Scale Model Car", price: "₹12,499.00", image: "/assets/redbull.png", type: "Car Models", description: "Official Oracle Red Bull Racing 1:18 scale model car of Max Verstappen." },
  { handle: "max-verstappen-collectible-figurine", title: "Max Verstappen Collectible Figurine", price: "₹8,499.00", image: "/assets/driver_figurine.png", type: "Driver Figurines", description: "Max Verstappen world champion edition collectible figurine." },
  { handle: "max-verstappen-signature-tshirt", title: "Max Verstappen Signature Graphic T-Shirt", price: "₹2,999.00", image: "/assets/apparel_placeholder.png", type: "Apparel", description: "Premium cotton graphic racing T-Shirt for Max Verstappen." },
  { handle: "max-verstappen-oracle-red-bull-cap", title: "Max Verstappen Signature Team Cap", price: "₹1,999.00", image: "/assets/cap_placeholder.png", type: "Caps", description: "Oracle Red Bull Racing team signature cap of Max Verstappen." },
  
  { handle: "lewis-hamilton-1-18-scale-car", title: "Lewis Hamilton 1:18 Scale Model Car", price: "₹12,499.00", image: "/assets/mercedes.png", type: "Car Models", description: "Official Mercedes-AMG Petronas F1 1:18 scale model car of Lewis Hamilton." },
  { handle: "lewis-hamilton-collectible-figurine", title: "Lewis Hamilton Collectible Figurine", price: "₹8,499.00", image: "/assets/driver_figurine.png", type: "Driver Figurines", description: "Lewis Hamilton champion helmet edition collectible figurine." },
  { handle: "lewis-hamilton-44-graphic-tshirt", title: "Lewis Hamilton Signature Graphic T-Shirt", price: "₹2,999.00", image: "/assets/apparel_placeholder.png", type: "Apparel", description: "Premium cotton graphic racing T-Shirt for Lewis Hamilton." },
  { handle: "lewis-hamilton-team-cap", title: "Lewis Hamilton Signature Team Cap", price: "₹1,999.00", image: "/assets/cap_placeholder.png", type: "Caps", description: "Mercedes-AMG Petronas team signature cap of Lewis Hamilton." },
  
  { handle: "lando-norris-1-18-scale-car", title: "Lando Norris 1:18 Scale Model Car", price: "₹12,499.00", image: "/assets/mclaren.png", type: "Car Models", description: "Official McLaren F1 Team 1:18 scale model car of Lando Norris." },
  { handle: "lando-norris-collectible-figurine", title: "Lando Norris Collectible Figurine", price: "₹8,499.00", image: "/assets/driver_figurine.png", type: "Driver Figurines", description: "Lando Norris signature edition collectible figurine." },
  { handle: "lando-norris-ln4-graphic-tshirt", title: "Lando Norris Signature Graphic T-Shirt", price: "₹2,999.00", image: "/assets/apparel_placeholder.png", type: "Apparel", description: "Premium cotton graphic racing T-Shirt for Lando Norris." },
  { handle: "lando-norris-mclaren-cap", title: "Lando Norris Signature Team Cap", price: "₹1,999.00", image: "/assets/cap_placeholder.png", type: "Caps", description: "McLaren F1 Team signature cap of Lando Norris." },
  
  { handle: "charles-leclerc-1-18-scale-car", title: "Charles Leclerc 1:18 Scale Model Car", price: "₹12,499.00", image: "/assets/ferrari.png", type: "Car Models", description: "Official Scuderia Ferrari 1:18 scale model car of Charles Leclerc." },
  { handle: "charles-leclerc-collectible-figurine", title: "Charles Leclerc Collectible Figurine", price: "₹8,499.00", image: "/assets/driver_figurine.png", type: "Driver Figurines", description: "Charles Leclerc signature edition collectible figurine." },
  { handle: "charles-leclerc-16-graphic-tshirt", title: "Charles Leclerc Signature Graphic T-Shirt", price: "₹2,999.00", image: "/assets/apparel_placeholder.png", type: "Apparel", description: "Premium cotton graphic racing T-Shirt for Charles Leclerc." },
  { handle: "charles-leclerc-scuderia-ferrari-cap", title: "Charles Leclerc Signature Team Cap", price: "₹1,999.00", image: "/assets/cap_placeholder.png", type: "Caps", description: "Scuderia Ferrari team signature cap of Charles Leclerc." },
  
  { handle: "pitwall-gift-card", title: "Pitwall Gift Card", price: "₹5,000.00", image: "/assets/giftcard_placeholder.png", type: "Gift Cards", description: "Pitwall Gift Card & Vouchers. Pick your amount to gift pitwall merchandise." }
];

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
    multiplier: 5.75,
    dimensions: '260mm x 330mm x 250mm',
    weight: '1,600g',
    partsOffset: 45,
  },
};



export function ProductScrollytelling({
  productTitle,
  productHandle,
  productPrice,
  variantsJson,
  mclarenUrl,
  redbullUrl,
  ferrariUrl,
  mercedesUrl,
  norrisHelmetUrl,
  schumacherHelmetUrl,
  verstappenHelmetUrl,
  productType = '',
  productImage = '',
  productDescription = '',
}: ProductScrollytellingProps) {
  // Local reactive product state
  const [currentProduct, setCurrentProduct] = useState({
    title: productTitle,
    handle: productHandle,
    price: productPrice,
    image: productImage,
    type: productType,
    description: productDescription,
    variantsJson: variantsJson,
  });

  // Parse dynamic shopify variants
  let parsedVariants: ShopifyVariant[] = [];
  try {
    parsedVariants = JSON.parse(currentProduct.variantsJson);
  } catch {
    parsedVariants = [];
  }

  // Detect product handle context (helmet vs car) — also checks URL ?model= param
  const urlModelParam = new URLSearchParams(window.location.search).get('model') || '';
  
  const isCarOrHelmet = 
    currentProduct.handle.includes('mclaren-mcl39') ||
    currentProduct.handle.includes('red-bull-rb19') ||
    currentProduct.handle.includes('redbull-rb19') ||
    currentProduct.handle.includes('ferrari-sf-23') ||
    currentProduct.handle.includes('ferrari-sf23') ||
    currentProduct.handle.includes('mercedes-w14') ||
    currentProduct.handle.includes('lando-norris-helmet') ||
    currentProduct.handle.includes('schumacher-helmet') ||
    currentProduct.handle.includes('verstappen-helmet') ||
    currentProduct.handle.includes('1-2-scale-helmet') ||
    ['mclaren', 'redbull', 'ferrari', 'mercedes', 'lando-norris-helmet', 'schumacher-helmet', 'verstappen-helmet'].includes(urlModelParam);

  const isHelmet = currentProduct.handle.toLowerCase().includes('helmet') || 
                   currentProduct.handle.toLowerCase().includes('schumacher') || 
                   currentProduct.handle.toLowerCase().includes('norris') ||
                   currentProduct.handle.toLowerCase().includes('verstappen') ||
                   urlModelParam.includes('helmet') ||
                   urlModelParam.includes('schumacher') ||
                   urlModelParam.includes('norris') ||
                   urlModelParam.includes('verstappen');

  // Determine initial active team based on URL ?model= param (priority) or product handle keyword
  const getInitialTeam = (): keyof typeof TEAMS_DATA => {
    const urlModel = new URLSearchParams(window.location.search).get('model');
    if (urlModel && urlModel in TEAMS_DATA) {
      return urlModel as keyof typeof TEAMS_DATA;
    }
    const handle = currentProduct.handle.toLowerCase();
    if (handle.includes('norris')) return 'lando-norris-helmet';
    if (handle.includes('schumacher')) return 'schumacher-helmet';
    if (handle.includes('verstappen')) return 'verstappen-helmet';
    if (handle.includes('redbull') || handle.includes('red-bull')) return 'redbull';
    if (handle.includes('ferrari')) return 'ferrari';
    if (handle.includes('mercedes')) return 'mercedes';
    return 'mclaren';
  };

  const [activeTeam, setActiveTeam] = useState<keyof typeof TEAMS_DATA>(getInitialTeam);
  
  const updateModelContext = (handle: string) => {
    const lower = handle.toLowerCase();
    if (lower.includes('norris')) setActiveTeam('lando-norris-helmet');
    else if (lower.includes('schumacher')) setActiveTeam('schumacher-helmet');
    else if (lower.includes('verstappen')) setActiveTeam('verstappen-helmet');
    else if (lower.includes('redbull') || lower.includes('red-bull')) setActiveTeam('redbull');
    else if (lower.includes('ferrari')) setActiveTeam('ferrari');
    else if (lower.includes('mercedes')) setActiveTeam('mercedes');
    else if (lower.includes('mclaren')) setActiveTeam('mclaren');
  };

  const loadProduct = async (targetHandle: string) => {
    // 1. Update URL
    window.history.pushState(null, '', '/products/' + targetHandle);

    // 2. Fetch from Shopify
    try {
      const response = await fetch(`/products/${targetHandle}.js`);
      if (response.ok) {
        const data = await response.json();
        const priceStr = (data.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
        
        setCurrentProduct({
          title: data.title,
          handle: data.handle,
          price: priceStr,
          image: data.featured_image || (data.images && data.images[0]) || '',
          type: data.type || '',
          description: data.description ? data.description.replace(/<[^>]*>/g, '') : '',
          variantsJson: JSON.stringify(data.variants),
        });
        updateModelContext(data.handle);
        return;
      }
    } catch (err) {
      console.warn("Could not fetch product details from Shopify API, using local fallback", err);
    }

    // 3. Fallback to Local DB
    const localMatch = ALL_PRODUCTS_DB.find(p => p.handle === targetHandle);
    if (localMatch) {
      setCurrentProduct({
        title: localMatch.title,
        handle: localMatch.handle,
        price: localMatch.price,
        image: localMatch.image,
        type: localMatch.type,
        description: localMatch.description,
        variantsJson: '[]',
      });
      updateModelContext(localMatch.handle);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const handle = path.split('/').pop() || '';
      loadProduct(handle);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [activeScale, setActiveScale] = useState<keyof typeof SCALES_DATA>('L');
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  // Animation Threshold States
  const [scrolledPast, setScrolledPast] = useState<boolean>(false);
  const [showStickyCta, setShowStickyCta] = useState<boolean>(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const configuratorRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const ctaBlockRef = useRef<HTMLDivElement>(null);
  const fallbackFrameRef = useRef<HTMLDivElement>(null);
  const showButtonsRef = useRef<boolean>(true);

  const teamInfo = TEAMS_DATA[activeTeam] || {
    name: currentProduct.title,
    basePrice: 5499,
    referenceCode: 'PW-' + currentProduct.handle.toUpperCase(),
    accentColor: '#7A7A7A',
    specs: {
      parts: 'N/A',
      material: 'Brutalist Premium Composite',
    },
    subtitle: currentProduct.description || 'Brutalist racing collection.',
  };
  
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

  const baseParts = teamInfo.specs.parts ? parseInt(teamInfo.specs.parts.split(' ')[0]) : 0;
  const totalParts = teamInfo.specs.parts && scaleInfo ? `${baseParts + scaleInfo.partsOffset} pieces` : 'N/A';

  // Get active Shopify variant ID
  const getActiveVariantId = (): number | null => {
    if (parsedVariants.length === 0) return null;
    if (!isCarOrHelmet) return parsedVariants[0].id;
    const activeVariant = parsedVariants.find(v => {
      const title = v.title.toLowerCase();
      if (activeScale === 'S') return title.includes('43') || title.includes('1:2') || title.includes('half');
      if (activeScale === 'M') return title.includes('24') || title.includes('collector');
      return title.includes('18') || title.includes('1:1') || title.includes('full');
    });
    return activeVariant ? activeVariant.id : parsedVariants[0].id;
  };

  // Scroll effect animations handler
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = rect.height;
      const scrolled = -rect.top;
      const maxScroll = trackHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.max(0, Math.min(1, scrolled / maxScroll)) : 0;

      // Threshold updates (De-duplicated state updates)
      const isPast = progress >= 0.25;
      setScrolledPast(prev => (prev !== isPast ? isPast : prev));

      const isSticky = progress > 0.2 && showButtonsRef.current;
      setShowStickyCta(prev => (prev !== isSticky ? isSticky : prev));

      // Wordmark fade
      if (wordmarkRef.current) {
        const opacity = progress < 0.25 ? (1 - (progress / 0.25)) * 0.85 : 0;
        wordmarkRef.current.style.opacity = `${opacity}`;
        wordmarkRef.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
      }

      // Parallax Scale & Rotate on static fallback image
      if (fallbackFrameRef.current) {
        fallbackFrameRef.current.style.transform = `scale(${1 + progress * 0.12}) rotate(${progress * 8}deg) translateY(${progress * -30}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    handleScroll();

    (window as any).__pwHandleProductScroll = handleScroll;

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true } as any);
      delete (window as any).__pwHandleProductScroll;
    };
  }, [currentProduct, activeScale]);

  // IntersectionObserver to hide persistent CTAs when footer comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = !entry.isIntersecting;
        showButtonsRef.current = visible;
        
        if (trackRef.current) {
          const rect = trackRef.current.getBoundingClientRect();
          const scrolled = -rect.top;
          const maxScroll = rect.height - window.innerHeight;
          const progress = maxScroll > 0 ? Math.max(0, Math.min(1, scrolled / maxScroll)) : 0;
          setShowStickyCta(progress > 0.2 && visible);
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

  const handleOptionSwitch = (targetHandle: string) => {
    loadProduct(targetHandle);
  };

  // Dynamic switcher choices based on category type
  const getSwitcherOptions = () => {
    if (isCarOrHelmet) {
      return isHelmet 
        ? [
            { handle: 'lando-norris-1-2-scale-helmet', label: 'Norris-Helmet' },
            { handle: 'max-verstappen-1-2-scale-helmet', label: 'Verstappen-Helmet' },
            { handle: 'lewis-hamilton-1-2-scale-helmet', label: 'Hamilton-Helmet' },
            { handle: 'charles-leclerc-1-2-scale-helmet', label: 'Leclerc-Helmet' }
          ]
        : [
            { handle: 'mclaren-mcl39', label: 'Mclaren-MCL39' },
            { handle: 'red-bull-rb19', label: 'Redbull-RB19' },
            { handle: 'ferrari-sf-23', label: 'Ferrari-SF23' },
            { handle: 'mercedes-w14', label: 'Mercedes-W14' }
          ];
    } else {
      const type = currentProduct.type || 'WLED Light Boxes';
      const sameType = ALL_PRODUCTS_DB.filter(p => p.type === type);
      const list = sameType.length > 0 ? sameType : ALL_PRODUCTS_DB.slice(0, 4);
      return list.map(p => ({
        handle: p.handle,
        label: p.title.replace(' WLED Light Box', '').replace(' WLED Box', '').replace(' Scale', '').replace(' Figure', '').replace(' 1:24', '').replace(' 1:18', '')
      }));
    }
  };

  const getSpecs = () => {
    if (isCarOrHelmet) {
      return [
        { label: 'CHASSIS CODE:', value: teamInfo.referenceCode },
        { label: 'CATALOG SCALE:', value: scaleInfo.label, highlighted: true },
        { label: 'DIMENSIONS:', value: scaleInfo.dimensions },
        { label: 'UNITS PARTS:', value: totalParts },
        { label: 'NET WEIGHT:', value: scaleInfo.weight },
        { label: 'MATERIALS:', value: teamInfo.specs.material },
      ];
    } else {
      return [
        { label: 'PRODUCT TITLE:', value: currentProduct.title },
        { label: 'CATEGORY/TYPE:', value: currentProduct.type || 'Pitwall Gear', highlighted: true },
        { label: 'EST. DELIVERY:', value: '3-5 Business Days' },
        { label: 'SHIPPING:', value: 'Free Shipping India' },
        { label: 'STOCK STATUS:', value: 'In Stock' },
        { label: 'WARRANTY:', value: '1 Year Manufacturer' },
      ];
    }
  };

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
          
          {/* Full Screen WebGL Canvas / Dynamic fallbacks */}
          {isCarOrHelmet ? (
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
          ) : (
            <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center pointer-events-none p-6">
              <div 
                ref={fallbackFrameRef}
                className="relative w-full max-w-[420px] aspect-square border border-brand-black/15 bg-white/60 backdrop-blur-md overflow-hidden flex items-center justify-center p-6 shadow-2xl transition-all duration-300 ease-out"
                style={{
                  transform: 'scale(1) rotate(0deg) translateY(0px)'
                }}
              >
                <img 
                  src={currentProduct.image || "/assets/placeholder.png"} 
                  alt={currentProduct.title}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
            </div>
          )}
 
          {/* Model Switcher Configurator Wrapper */}
          <div 
            ref={configuratorRef}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 pointer-events-auto transition-all duration-500"
            style={{ 
              opacity: scrolledPast ? 0 : 1,
              transform: `translate(-50%, ${scrolledPast ? '24px' : '0'})`,
              pointerEvents: scrolledPast ? 'none' : 'auto'
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
            <div className="flex gap-3 flex-wrap justify-center">
              {getSwitcherOptions().map((opt) => (
                <button
                  key={opt.handle}
                  onClick={() => handleOptionSwitch(opt.handle)}
                  className={`px-5 py-2.5 border font-mono text-[11px] uppercase transition-all flex items-center justify-between gap-3 backdrop-blur-md whitespace-nowrap ${
                    currentProduct.handle === opt.handle || (opt.handle.includes('mclaren') && currentProduct.handle.includes('mclaren')) || (opt.handle.includes('red-bull') && currentProduct.handle.includes('red-bull'))
                      ? 'border-brand-black bg-[#0C0C0C]/85 text-[#EDEBE5] font-semibold'
                      : 'border-brand-black/20 hover:border-brand-black/45 text-brand-black/75 bg-[#EDEBE5]/45'
                  }`}
                >
                  <span>{opt.label}</span>
                  {(currentProduct.handle === opt.handle || (opt.handle.includes('mclaren') && currentProduct.handle.includes('mclaren')) || (opt.handle.includes('red-bull') && currentProduct.handle.includes('red-bull'))) && (
                    <div 
                      className="w-1.5 h-1.5 rounded-none" 
                      style={{ backgroundColor: teamInfo.accentColor || '#7A7A7A' }}
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
              transform: `translateY(-50%) ${scrolledPast ? 'translateX(0)' : 'translateX(-150%)'}`,
              opacity: scrolledPast ? 1 : 0,
              pointerEvents: scrolledPast ? 'auto' : 'none'
            }}
          >
            <div className="flex flex-col gap-3">
              <a href="/" className="inline-flex items-center gap-2 text-xs font-mono text-brand-black/55 hover:text-brand-red mb-1 transition-colors">
                <ArrowLeft size={14} /> BACK TO PITWALL
              </a>
              <TechSpecTable 
                title="Telemetry & Dimension Specs" 
                specs={getSpecs()}
              />
            </div>
          </div>

          {/* RIGHT PRICING & CALIBRATION CARD */}
          <div 
            ref={rightCardRef}
            className="absolute right-6 md:right-[60px] top-1/2 -translate-y-1/2 w-full max-w-[340px] z-20 pointer-events-auto transition-all duration-700 ease-out"
            style={{
              transform: `translateY(-50%) ${scrolledPast ? 'translateX(0)' : 'translateX(150%)'}`,
              opacity: scrolledPast ? 1 : 0,
              pointerEvents: scrolledPast ? 'auto' : 'none'
            }}
          >
            <div className="border border-brand-black/10 bg-[#EDEBE5] p-6 flex flex-col gap-6">
              <span className="font-mono text-xs uppercase font-semibold text-brand-red block border-b border-brand-black/10 pb-2">
                {isCarOrHelmet ? 'Chassis Calibration' : 'Product Calibration'}
              </span>
              
              <div className="space-y-4">
                {isCarOrHelmet && (
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
                )}

                <div className={isCarOrHelmet ? "border-t border-brand-black/10 pt-4" : ""}>
                  <span className="font-mono text-[10px] text-brand-black/40 uppercase block mb-1">
                    PRICE UNIT
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl text-brand-black font-bold">
                      {isCarOrHelmet ? getDisplayPrice() : currentProduct.price}
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
          transform: showStickyCta ? 'translate(-50%, 0) scale(1)' : 'translate(-50%, 96px) scale(0.95)',
          opacity: showStickyCta ? 1 : 0,
          pointerEvents: showStickyCta ? 'auto' : 'none'
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
