import { useState } from 'react';

let maskIdCounter = 0;

/**
 * "PITWALL" hero wordmark with a true camera-negative fill: a masked SVG
 * <rect> with backdrop-filter: invert(1), revealing a live inverted view
 * of the video only inside the glyph shapes.
 *
 * Two earlier approaches failed:
 * 1. mix-blend-mode: difference directly on the text — does not reliably
 *    composite against <video> elements in practice.
 * 2. An HTML <div> masked via the CSS `mask-image` property, referencing
 *    an SVG <mask> defined in a separate sibling <svg>. This specific
 *    combination (HTML element + CSS mask-image + cross-context SVG
 *    fragment reference) has a confirmed Firefox bug (bugzilla 1535822)
 *    and is widely reported as unreliable across browsers.
 *
 * This version follows the pattern used by working production references
 * (CSS-Tricks' "Responsive Knockout Text with Video", Dudley Storey's SVG
 * text-mask-over-video demo): the masked element and the mask definition
 * both live inside the *same* <svg>, and the mask is applied via the
 * native SVG `mask="url(#id)"` attribute rather than the CSS `mask-image`
 * property — same-document, SVG-native masking is the well-supported case;
 * masking an arbitrary HTML element from CSS is the flaky one.
 */
export function HeroWordmark({ className = '' }: { className?: string }) {
  const [maskId] = useState(() => `pw-hero-mask-${maskIdCounter++}`);

  return (
    <div className={`hero-title-wrapper relative ${className}`}>
      <h1 className="hero-title-text select-none">PITWALL</h1>
      <svg className="hero-title-invert-svg" preserveAspectRatio="none">
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
        <rect x="0" y="0" width="100%" height="100%" mask={`url(#${maskId})`} className="hero-title-invert-rect" />
      </svg>
    </div>
  );
}
