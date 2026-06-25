import { useEffect, useState } from 'react';

const SESSION_KEY = 'pw-intro-seen';
const COLUMN_COUNT = 5;
const ROWS_PER_COLUMN = 4;
const COLUMN_STEP_MS = 160;
const HOLD_MS = 500;
const FADE_MS = 450;

type Phase = 'lighting' | 'holding' | 'out' | 'fading' | 'done';

interface IntroSequenceProps {
  /**
   * Optional real video clip of an FIA start gantry "lights out" sequence.
   * When provided, this is played full-bleed in place of the CSS light rig —
   * drop a real clip's path here later and the rig becomes the fallback for
   * browsers/contexts where the video can't play (autoplay block, load error,
   * or `prefers-reduced-motion`). No other changes are required: timing,
   * skip button, and the once-per-session gate all keep working as-is.
   */
  videoSrc?: string;
}

function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroSeen(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* sessionStorage unavailable (private mode, etc) — intro will just replay */
  }
}

export function IntroSequence({ videoSrc }: IntroSequenceProps = {}) {
  const [skip] = useState(hasSeenIntro);
  const [phase, setPhase] = useState<Phase>('lighting');
  const [litColumns, setLitColumns] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  const useVideo = Boolean(videoSrc) && !videoFailed;

  useEffect(() => {
    if (skip) return;
    // The video element drives its own `onEnded` -> markIntroSeen/fade; the
    // CSS rig timeline below only needs to run when we're using the rig.
    if (useVideo) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let col = 1; col <= COLUMN_COUNT; col++) {
      timers.push(setTimeout(() => setLitColumns(col), col * COLUMN_STEP_MS));
    }

    const allLitAt = COLUMN_COUNT * COLUMN_STEP_MS;
    timers.push(setTimeout(() => setPhase('holding'), allLitAt));
    timers.push(setTimeout(() => {
      setPhase('out');
      setLitColumns(0);
    }, allLitAt + HOLD_MS));
    timers.push(setTimeout(() => setPhase('fading'), allLitAt + HOLD_MS + 120));
    timers.push(setTimeout(() => {
      setPhase('done');
      markIntroSeen();
    }, allLitAt + HOLD_MS + 120 + FADE_MS));

    return () => timers.forEach(clearTimeout);
  }, [skip, useVideo]);

  const handleSkip = () => {
    markIntroSeen();
    setPhase('fading');
    setTimeout(() => setPhase('done'), FADE_MS);
  };

  const handleVideoEnded = () => {
    setPhase('fading');
    setTimeout(() => {
      setPhase('done');
      markIntroSeen();
    }, FADE_MS);
  };

  if (skip || phase === 'done') return null;

  return (
    <div
      className="pw-intro-overlay"
      style={{ opacity: phase === 'fading' ? 0 : 1 }}
      aria-hidden="true"
    >
      {useVideo ? (
        <video
          className="pw-intro-video"
          src={videoSrc}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          onError={() => setVideoFailed(true)}
        />
      ) : (
        <div className="pw-intro-rig">
          <div className="pw-intro-rig-housing">
            <span className="pw-intro-bolt pw-intro-bolt-tl" />
            <span className="pw-intro-bolt pw-intro-bolt-tr" />
            <span className="pw-intro-bolt pw-intro-bolt-bl" />
            <span className="pw-intro-bolt pw-intro-bolt-br" />
            <div className="pw-intro-columns">
              {Array.from({ length: COLUMN_COUNT }).map((_, colIdx) => {
                const isLit = colIdx < litColumns;
                const isFreshlyLit = isLit && colIdx === litColumns - 1 && phase === 'lighting';
                return (
                  <div className="pw-intro-column" key={colIdx}>
                    {Array.from({ length: ROWS_PER_COLUMN }).map((_, rowIdx) => (
                      <span
                        key={rowIdx}
                        className={
                          'pw-intro-dot' +
                          (isLit ? ' pw-intro-dot-lit' : '') +
                          (isFreshlyLit ? ' pw-intro-dot-pulse' : '')
                        }
                      >
                        <span className="pw-intro-dot-bloom" />
                        <span className="pw-intro-dot-bulb" />
                        <span className="pw-intro-dot-hotspot" />
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <button type="button" className="pw-intro-skip" onClick={handleSkip}>
        SKIP
      </button>
    </div>
  );
}
