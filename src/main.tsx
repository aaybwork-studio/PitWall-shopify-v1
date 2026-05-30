import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Volume2, VolumeX } from 'lucide-react';
import { CarCanvas } from './components/CarCanvas';
import { VideoBackground } from './components/VideoBackground';

// ─── Universal Mute Button Module ──────────────────────────────────────────
function UniversalMuteButton() {
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const nextState = !muted;
    setMuted(nextState);
    
    // Broadcast state to custom video listener context
    const event = new CustomEvent('pitwall:mute', { detail: { muted: nextState } });
    window.dispatchEvent(event);
  };

  return (
    <button onClick={toggleMute} className="universal-mute-btn" aria-label="Toggle sound">
      <span className="mute-text-box">
        {muted ? 'ACTIVATE SOUND' : 'MUTE STUDIO'}
      </span>
      <div className="mute-icon-box">
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </div>
    </button>
  );
}

// ─── Bootstrap Integration on DOM Load ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 1. Mount Three.js Product Chassis Canvas
  const canvasRoot = document.getElementById('car-canvas-root');
  if (canvasRoot) {
    const modelName = canvasRoot.getAttribute('data-model-name') || 'mclaren';
    const modelUrl = canvasRoot.getAttribute('data-model-url') || '';
    
    const root = ReactDOM.createRoot(canvasRoot);
    root.render(
      <React.StrictMode>
        <CarCanvas modelName={modelName} modelUrl={modelUrl} />
      </React.StrictMode>
    );
  }

  // 2. Mount Video Playlist Background
  const videoRoot = document.getElementById('hero-video-root');
  if (videoRoot) {
    let playlist: string[] = [];
    try {
      const dataPlaylist = videoRoot.getAttribute('data-video-playlist');
      if (dataPlaylist) {
        // Parse liquid-formatted single quoted string array safely
        playlist = JSON.parse(dataPlaylist.replace(/'/g, '"'));
      }
    } catch {
      playlist = [
        "/video/F1_helmet_orbiting_white_void_202605251628.mp4",
        "/video/F1_helmet_orbiting_white_void_202605251636.mp4",
        "/video/Formula_1_car_accelerates_white_202605251629.mp4"
      ];
    }

    const root = ReactDOM.createRoot(videoRoot);
    root.render(<VideoBackground playlist={playlist} />);
  }

  // 3. Mount Universal Mute Toggle
  const muteRoot = document.getElementById('mute-button-root');
  if (muteRoot) {
    const root = ReactDOM.createRoot(muteRoot);
    root.render(<UniversalMuteButton />);
  }

  // 4. Bind Brutalist Navigation Interactions
  const menuTrigger = document.getElementById('menu-trigger-btn');
  const menuOverlay = document.getElementById('full-menu-overlay');
  const menuContent = menuOverlay?.querySelector('.menu-content') ?? null;
  let isMenuOpen = false;
  let closeTimeout: ReturnType<typeof setTimeout> | null = null;

  function openMenu() {
    if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }
    isMenuOpen = true;
    menuOverlay?.classList.add('is-active');
    if (menuTrigger) menuTrigger.innerText = 'CLOSE';
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    isMenuOpen = false;
    menuOverlay?.classList.remove('is-active');
    if (menuTrigger) menuTrigger.innerText = 'MENU';
    document.body.style.overflow = '';
  }
  function delayClose() {
    if (closeTimeout) clearTimeout(closeTimeout);
    closeTimeout = setTimeout(closeMenu, 150);
  }
  function keepOpen() {
    if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }
  }

  if (menuTrigger && menuOverlay && menuContent) {
    menuTrigger.addEventListener('mouseenter', openMenu);
    menuTrigger.addEventListener('mouseleave', delayClose);
    menuContent.addEventListener('mouseenter', keepOpen);
    menuContent.addEventListener('mouseleave', delayClose);
    menuTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      isMenuOpen ? closeMenu() : openMenu();
    });
  }

  // Add scroll headers intersection handlers
  const nav = document.querySelector('.nav-header') as HTMLElement | null;
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.4) {
        nav.classList.add('nav-visible');
      } else {
        nav.classList.remove('nav-visible');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
});
