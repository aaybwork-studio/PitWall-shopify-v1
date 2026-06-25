import { useEffect, useState } from 'react';

const SESSION_KEY = 'pw-intro-seen';
const COLUMN_COUNT = 5;
const ROWS_PER_COLUMN = 4;
const COLUMN_STEP_MS = 160;
const HOLD_MS = 500;
const FADE_MS = 450;

type Phase = 'lighting' | 'holding' | 'out' | 'fading' | 'done';

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

export function IntroSequence() {
  const [skip] = useState(hasSeenIntro);
  const [phase, setPhase] = useState<Phase>('lighting');
  const [litColumns, setLitColumns] = useState(0);

  useEffect(() => {
    if (skip) return;

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
  }, [skip]);

  const handleSkip = () => {
    markIntroSeen();
    setPhase('fading');
    setTimeout(() => setPhase('done'), FADE_MS);
  };

  if (skip || phase === 'done') return null;

  return (
    <div
      className="pw-intro-overlay"
      style={{ opacity: phase === 'fading' ? 0 : 1 }}
      aria-hidden="true"
    >
      <div className="pw-intro-rig">
        {Array.from({ length: COLUMN_COUNT }).map((_, colIdx) => (
          <div className="pw-intro-column" key={colIdx}>
            {Array.from({ length: ROWS_PER_COLUMN }).map((_, rowIdx) => (
              <span
                key={rowIdx}
                className={`pw-intro-dot${colIdx < litColumns ? ' pw-intro-dot-lit' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
      <button type="button" className="pw-intro-skip" onClick={handleSkip}>
        SKIP
      </button>
    </div>
  );
}
