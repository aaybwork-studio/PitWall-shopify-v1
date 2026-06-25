import { useEffect, useRef, useState } from 'react';

let maskIdCounter = 0;

/**
 * Renders the "PITWALL" hero wordmark with a true camera-negative fill in
 * light mode: a backdrop-filter: invert(1) layer, masked to the glyph shapes
 * via an SVG <mask>, inverts the live video behind the text. mix-blend-mode
 * was tried first but browsers routinely fail to blend against <video>
 * elements (GPU decode bypasses normal blend compositing) — backdrop-filter
 * does not have that limitation.
 *
 * In dark mode the invert layer is disabled via CSS and the text falls back
 * to solid white (see .hero-title-text / .hero-title-invert-layer dark-mode
 * rules in index.css).
 */
export function HeroWordmark({ className = '' }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [maskId] = useState(() => `pw-wordmark-mask-${maskIdCounter++}`);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={`hero-title-wrapper relative ${className}`}>
      <h1 className="hero-title-text select-none">PITWALL</h1>
      {size.w > 0 && size.h > 0 && (
        <div
          className="hero-title-invert-layer"
          style={{ maskImage: `url(#${maskId})`, WebkitMaskImage: `url(#${maskId})` }}
        >
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={size.w} height={size.h}>
                <rect width={size.w} height={size.h} fill="black" />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="hero-title-mask-text"
                  fill="white"
                >
                  PITWALL
                </text>
              </mask>
            </defs>
          </svg>
        </div>
      )}
    </div>
  );
}
