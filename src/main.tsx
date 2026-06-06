import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { CarCanvas } from './components/CarCanvas';
import { VideoBackground } from './components/VideoBackground';
import { ProductScrollytelling } from './components/ProductScrollytelling';
import { CollectionGrid } from './components/CollectionGrid';
import { HomepageScrollytelling } from './components/HomepageScrollytelling';
import { Logger } from './utils/logger';

// ─── Bootstrap Integration on DOM Load ──────────────────────────────────────
function bootstrap() {
  // 0. Mount Homepage Interactive Scrollytelling (Takeover)
  const homepageRoot = document.getElementById('homepage-interactive-root');
  if (homepageRoot) {
    const productsJson = homepageRoot.getAttribute('data-products-json') || '[]';
    const videoPlaylist = homepageRoot.getAttribute('data-video-playlist') || '[]';

    try {
      const root = ReactDOM.createRoot(homepageRoot);
      root.render(
        <React.StrictMode>
          <HomepageScrollytelling productsJson={productsJson} videoPlaylist={videoPlaylist} />
        </React.StrictMode>
      );
    } catch (err) {
      Logger.error('Failed to mount HomepageScrollytelling', err);
    }
  }

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

  // 1.5 Mount Product Scrollytelling Flagship Experience
  const pdpRoot = document.getElementById('product-scrollytelling-root');
  if (pdpRoot) {
    const productTitle = pdpRoot.getAttribute('data-product-title') || '';
    const productHandle = pdpRoot.getAttribute('data-product-handle') || '';
    const productPrice = pdpRoot.getAttribute('data-product-price') || '';
    const variantsJson = pdpRoot.getAttribute('data-product-variants-json') || '[]';
    const mclarenUrl = pdpRoot.getAttribute('data-mclaren-url') || '';
    const redbullUrl = pdpRoot.getAttribute('data-redbull-url') || '';
    const ferrariUrl = pdpRoot.getAttribute('data-ferrari-url') || '';
    const mercedesUrl = pdpRoot.getAttribute('data-mercedes-url') || '';
    const norrisHelmetUrl = pdpRoot.getAttribute('data-norris-helmet-url') || '';
    const schumacherHelmetUrl = pdpRoot.getAttribute('data-schumacher-helmet-url') || '';
    const verstappenHelmetUrl = pdpRoot.getAttribute('data-verstappen-helmet-url') || '';

    const root = ReactDOM.createRoot(pdpRoot);
    root.render(
      <React.StrictMode>
        <ProductScrollytelling 
          productTitle={productTitle}
          productHandle={productHandle}
          productPrice={productPrice}
          variantsJson={variantsJson}
          mclarenUrl={mclarenUrl}
          redbullUrl={redbullUrl}
          ferrariUrl={ferrariUrl}
          mercedesUrl={mercedesUrl}
          norrisHelmetUrl={norrisHelmetUrl}
          schumacherHelmetUrl={schumacherHelmetUrl}
          verstappenHelmetUrl={verstappenHelmetUrl}
        />
      </React.StrictMode>
    );
  }

  // Only run legacy mounts if we are NOT on the interactive scrollytelling homepage
  if (!homepageRoot) {
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

    // 2.5 Mount Separator Video Background
    const separatorVideoRoot = document.getElementById('separator-video-root');
    if (separatorVideoRoot) {
      let playlist: string[] = [];
      try {
        const dataPlaylist = separatorVideoRoot.getAttribute('data-video-playlist');
        if (dataPlaylist) {
          // Parse liquid-formatted single quoted string array safely
          playlist = JSON.parse(dataPlaylist.replace(/'/g, '"'));
        }
      } catch {
        playlist = [
          "/assets/F1_car_slides_on_surface_202606011707.mp4",
          "/assets/Formula_1_car_approaches_camera_202606011705.mp4",
          "/assets/Formula_1_car_braking_and_202606011705.mp4"
        ];
      }

      const root = ReactDOM.createRoot(separatorVideoRoot);
      root.render(<VideoBackground playlist={playlist} />);
    }

    // 3. Mount Collection Grid
    const collectionRoot = document.getElementById('collection-grid-root');
    if (collectionRoot) {
      let products = [];
      const productsScript = document.getElementById('collection-products-data');
      if (productsScript) {
        try {
          products = JSON.parse(productsScript.textContent || '[]');
        } catch (err) {
          Logger.error('Failed to parse collection product data JSON in main.tsx', err);
        }
      }
      const root = ReactDOM.createRoot(collectionRoot);
      root.render(
        <React.StrictMode>
          <CollectionGrid products={products} />
        </React.StrictMode>
      );
    }
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
    if (menuTrigger) menuTrigger.innerText = 'CLOSE';
  }
  function closeMenu() {
    isMenuOpen = false;
    menuOverlay?.classList.remove('is-active');
    if (menuTrigger) menuTrigger.innerText = 'MENU';
    const collectionsItem = menuOverlay?.querySelector('.menu-link-item-collections');
    if (collectionsItem) collectionsItem.classList.remove('is-expanded');
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

    const collectionsItem = menuOverlay.querySelector('.menu-link-item-collections');
    const collectionsLink = collectionsItem?.querySelector('.menu-link');
    const submenuCol = menuOverlay.querySelector('.menu-submenu-col');

    let submenuTimeout: ReturnType<typeof setTimeout> | null = null;

    const showSubmenu = () => {
      if (submenuTimeout) {
        clearTimeout(submenuTimeout);
        submenuTimeout = null;
      }
      menuOverlay.classList.add('show-collections-submenu');
    };

    const hideSubmenu = () => {
      if (submenuTimeout) clearTimeout(submenuTimeout);
      submenuTimeout = setTimeout(() => {
        menuOverlay.classList.remove('show-collections-submenu');
      }, 300); // 300ms window to cross visual column gaps
    };

    if (collectionsItem) {
      collectionsItem.addEventListener('mouseenter', showSubmenu);
      collectionsItem.addEventListener('mouseleave', hideSubmenu);
    }
    
    if (submenuCol) {
      submenuCol.addEventListener('mouseenter', showSubmenu);
      submenuCol.addEventListener('mouseleave', hideSubmenu);
    }

    if (collectionsLink && collectionsItem) {
      collectionsLink.addEventListener('click', () => {
        // Since we hover to show on desktop, click can navigate directly to collections page
        closeMenu();
      });
    }
  }

  // Add scroll headers intersection handlers for color adaptive dynamic header
  const nav = document.querySelector('.nav-header') as HTMLElement | null;
  if (nav) {
    // Keep the navbar always visible on all pages (including the hero)
    nav.classList.add('nav-visible');

    const handleScroll = () => {
      // Find the hero section on the homepage
      const hero = document.querySelector('.hero-section') as HTMLElement | null;
      if (hero) {
        // Homepage dynamic behavior: dark over hero video, light everywhere else
        const heroHeight = hero.offsetHeight || window.innerHeight;
        if (window.scrollY >= heroHeight - 64) {
          nav.classList.add('nav-light-bg');
        } else {
          nav.classList.remove('nav-light-bg');
        }
      } else {
        // Standard pages dynamic behavior: PDP is dark, collections/standard pages are light
        const isPDP = document.querySelector('#product-scrollytelling-root') !== null;
        if (isPDP) {
          nav.classList.remove('nav-light-bg');
        } else {
          nav.classList.add('nav-light-bg');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 5. Scroll-locked tagline animation ("Because cars are not objects" -> "and life has always been a race.")
  const taglineEl = document.querySelector('.hero-tagline') as HTMLElement | null;
  const heroSection = document.querySelector('.hero-section') as HTMLElement | null;
  
  if (taglineEl && heroSection) {
    const originalText = "Because cars are not objects";
    const targetText = "and life has always been a race.";
    let hasTransitioned = false;
    let isTransitioning = false;

    // Apply inline style to ensure smooth transitions
    taglineEl.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

    const transitionText = (direction: 'down' | 'up') => {
      isTransitioning = true;
      taglineEl.style.opacity = '0';
      
      setTimeout(() => {
        if (direction === 'down') {
          taglineEl.textContent = targetText;
        } else {
          taglineEl.textContent = originalText;
        }
        taglineEl.style.opacity = '1';
        
        setTimeout(() => {
          isTransitioning = false;
          if (direction === 'down') {
            hasTransitioned = true;
          } else {
            hasTransitioned = false;
          }
        }, 400);
      }, 400);
    };

    // Scroll lock handler for wheel and touchmove events
    let touchStartY = 0;
    
    const handleScrollLock = (e: WheelEvent | TouchEvent) => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      
      let isScrollingDown = false;
      if (e instanceof WheelEvent) {
        isScrollingDown = e.deltaY > 0;
      } else if (e instanceof TouchEvent && e.touches.length > 0) {
        const touch = e.touches[0];
        isScrollingDown = touchStartY - touch.pageY > 5;
      }

      if (scrollY <= 10 && isScrollingDown && !hasTransitioned && !isTransitioning) {
        e.preventDefault();
        transitionText('down');
      }
    };

    window.addEventListener('wheel', handleScrollLock, { passive: false });
    window.addEventListener('touchmove', handleScrollLock, { passive: false });

    window.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].pageY;
      }
    }, { passive: true });

    // Revert transition when scrolling back to the very top
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY <= 5 && hasTransitioned && !isTransitioning) {
        transitionText('up');
      }
    }, { passive: true });
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
