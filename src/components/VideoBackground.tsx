import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  playlist: string[];
}

export function VideoBackground({ playlist }: VideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    queue: string[];
    vidA: HTMLVideoElement | null;
    vidB: HTMLVideoElement | null;
    activeVid: HTMLVideoElement | null;
  }>({
    queue: [],
    vidA: null,
    vidB: null,
    activeVid: null,
  });

  function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !playlist.length) return;

    // Helper to create and configure a video element
    const createVideoElement = (): HTMLVideoElement => {
      const vid = document.createElement('video');
      vid.autoplay = false;
      vid.muted = true;
      vid.playsInline = true;
      vid.setAttribute('playsinline', '');
      vid.style.cssText = [
        'position:absolute',
        'top:0',
        'left:0',
        'width:100%',
        'height:100%',
        'object-fit:cover',
        'z-index:2',
        'opacity:0',
        'transition:opacity 800ms cubic-bezier(0.16, 1, 0.3, 1)',
        'background:transparent',
      ].join(';');
      return vid;
    };

    const vidA = createVideoElement();
    const vidB = createVideoElement();
    
    stateRef.current.vidA = vidA;
    stateRef.current.vidB = vidB;
    stateRef.current.queue = shuffleArray(playlist);

    container.appendChild(vidA);
    container.appendChild(vidB);

    // Initial setup: start on vidA
    const startPlaylist = () => {
      if (stateRef.current.queue.length === 0) {
        stateRef.current.queue = shuffleArray(playlist);
      }
      const first = stateRef.current.queue.shift()!;
      vidA.src = first;
      vidA.playbackRate = 0.75;
      vidA.style.opacity = '1';
      stateRef.current.activeVid = vidA;

      vidA.play().catch(() => {
        vidA.muted = true;
        vidA.play().catch(() => {});
      });

      // Preload the next one on vidB
      preloadNext(vidB);
    };

    const preloadNext = (inactiveVid: HTMLVideoElement) => {
      if (stateRef.current.queue.length === 0) {
        stateRef.current.queue = shuffleArray(playlist);
      }
      const next = stateRef.current.queue.shift()!;
      inactiveVid.src = next;
      inactiveVid.playbackRate = 0.75;
      inactiveVid.style.opacity = '0';
      inactiveVid.load();
    };

    const handleEnded = (endedVid: HTMLVideoElement) => {
      const active = stateRef.current.activeVid;
      if (active !== endedVid) return; // Ignore if not active

      const nextActive = endedVid === vidA ? vidB : vidA;
      const nextPreload = endedVid === vidA ? vidA : vidB;

      // Transition
      nextActive.style.zIndex = '3';
      endedVid.style.zIndex = '2';

      nextActive.playbackRate = 0.75;
      nextActive.play().then(() => {
        nextActive.style.opacity = '1';
        endedVid.style.opacity = '0';

        setTimeout(() => {
          endedVid.pause();
          preloadNext(nextPreload);
        }, 800);

        stateRef.current.activeVid = nextActive;
      }).catch(() => {
        // Fallback if play fails
        nextActive.muted = true;
        nextActive.play().then(() => {
          nextActive.style.opacity = '1';
          endedVid.style.opacity = '0';
          setTimeout(() => {
            endedVid.pause();
            preloadNext(nextPreload);
          }, 800);
          stateRef.current.activeVid = nextActive;
        }).catch(() => {});
      });
    };

    const onEndedA = () => handleEnded(vidA);
    const onEndedB = () => handleEnded(vidB);

    vidA.addEventListener('ended', onEndedA);
    vidB.addEventListener('ended', onEndedB);

    // Initial load
    startPlaylist();

    // Listen to universal mute state updates
    const handleMuteToggle = (e: CustomEvent<{ muted: boolean }>) => {
      if (vidA) vidA.muted = e.detail.muted;
      if (vidB) vidB.muted = e.detail.muted;
      const active = stateRef.current.activeVid;
      if (active && !e.detail.muted) {
        active.play().catch(() => {
          active.muted = true;
        });
      }
    };

    window.addEventListener('pitwall:mute', handleMuteToggle as EventListener);

    return () => {
      vidA.removeEventListener('ended', onEndedA);
      vidB.removeEventListener('ended', onEndedB);
      window.removeEventListener('pitwall:mute', handleMuteToggle as EventListener);
      
      vidA.pause();
      vidB.pause();
      vidA.src = '';
      vidB.src = '';
      
      if (container.contains(vidA)) container.removeChild(vidA);
      if (container.contains(vidB)) container.removeChild(vidB);

      stateRef.current.vidA = null;
      stateRef.current.vidB = null;
      stateRef.current.activeVid = null;
    };
  }, [playlist]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <div className="hero-video-fallback"></div>
    </div>
  );
}
