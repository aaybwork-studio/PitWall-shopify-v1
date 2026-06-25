import { useState } from 'react';

let maskIdCounter = 0;

/**
 * "PITWALL" hero wordmark with a true camera-negative fill: a
 * backdrop-filter: invert(1) layer, masked to the glyph shapes via an SVG
 * <mask>, inverts the live video behind the text. mix-blend-mode was tried
 * first but does not reliably composite against <video> elements in
 * practice; backdrop-filter samples the rendered backdrop directly and
 * does not have that limitation.
 *
 * Deliberately has NO JS-measured sizing (no ResizeObserver / size gate) —
 * a prior version gated the entire invert layer behind a JS-measured size
 * state that likely never resolved, leaving .hero-title-text (color:
 * transparent) with nothing painted on top of it, i.e. fully invisible.
 * This version sizes purely via CSS (inset: 0) and positions the mask's
 * <text> via percentages, which resolve against the masked element's own
 * box per the CSS Masking spec — no JS required.
 */
export function HeroWordmark({ className = '' }: { className?: string }) {
  const [maskId] = useState(() => `pw-hero-mask-${maskIdCounter++}`);

  return (
    <div className={`hero-title-wrapper relative ${className}`}>
      <h1 className="hero-title-text select-none">PITWALL</h1>
      <div
        className="hero-title-invert-layer"
        style={{ maskImage: `url(#${maskId})`, WebkitMaskImage: `url(#${maskId})` }}
      />
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <mask id={maskId}>
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
  );
}
