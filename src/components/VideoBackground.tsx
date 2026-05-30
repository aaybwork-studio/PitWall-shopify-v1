import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  playlist: string[];
}

export function VideoBackground({ playlist }: VideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vm = useRef<{
    el: HTMLVideoElement | null;
    queue: string[];
  }>({
    el: null,
    queue: [],
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

    const vid = document.createElement('video');
    vid.autoplay = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.setAttribute('playsinline', '');
    vid.style.cssText = [
      'position:absolute', 'top:0', 'left:0',
      'width:100%', 'height:100%', 'object-fit:cover',
      'z-index:2', 'background:transparent',
    ].join(';');

    const advance = () => {
      if (vm.current.queue.length === 0) {
        vm.current.queue = shuffleArray(playlist);
      }
      const next = vm.current.queue.shift()!;

      vid.oncanplay = null;
      vid.oncanplay = () => {
        vid.oncanplay = null;
        vid.play().catch(() => {
          vid.muted = true;
          vid.play().catch(() => {});
        });
      };

      vid.src = next;
      vid.load();
    };

    vid.addEventListener('ended', advance);
    vid.addEventListener('error', () => setTimeout(advance, 500));

    vm.current.queue = shuffleArray(playlist);
    vm.current.el = vid;
    container.appendChild(vid);
    advance();

    // Listen to universal mute state updates from the audio toggle component
    const handleMuteToggle = (e: CustomEvent<{ muted: boolean }>) => {
      vid.muted = e.detail.muted;
      if (!e.detail.muted) {
        vid.play().catch(() => {
          vid.muted = true;
        });
      }
    };

    window.addEventListener('pitwall:mute', handleMuteToggle as EventListener);

    return () => {
      vid.oncanplay = null;
      vid.removeEventListener('ended', advance);
      window.removeEventListener('pitwall:mute', handleMuteToggle as EventListener);
      vid.pause();
      vid.src = '';
      if (container.contains(vid)) container.removeChild(vid);
      vm.current.el = null;
    };
  }, [playlist]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <div className="hero-video-fallback"></div>
    </div>
  );
}
