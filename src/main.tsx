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

  if (!homepageRoot) {
    document.documentElement.classList.remove('homepage-scrollytelling-active');
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.overflowY = 'auto';
    document.documentElement.style.height   = 'auto';
    document.body.style.overflow            = 'auto';
    document.body.style.overflowY           = 'auto';
    document.body.style.height              = 'auto';
  }

  if (homepageRoot) {
    let productsJson = '[]';
    const productsScript = document.getElementById('collection-products-data');
    if (productsScript) {
      productsJson = productsScript.textContent || '[]';
    } else {
      productsJson = homepageRoot.getAttribute('data-products-json') || '[]';
    }

    const fallbackImagesScript = document.getElementById('fallback-images-data');
    let fallbackImages = {};
    if (fallbackImagesScript) {
      try {
        fallbackImages = JSON.parse(fallbackImagesScript.textContent || '{}');
      } catch (err) {
        Logger.error('Failed to parse fallback images JSON', err);
      }
    }

    let foundingStory = 'Pitwall was born from obsession. We build objects that earn their place alongside the machines we worship.';
    let brandParagraph = 'Where every object we make is held to the same standards as the machines we obsess over.';
    const aboutContentScript = document.getElementById('about-content-data');
    if (aboutContentScript) {
      try {
        const aboutData = JSON.parse(aboutContentScript.textContent || '{}');
        foundingStory = aboutData.foundingStory || foundingStory;
        brandParagraph = aboutData.brandParagraph || brandParagraph;
      } catch (err) {
        Logger.error('Failed to parse about-content-data JSON', err);
      }
    }

    const aboutHeading = homepageRoot.getAttribute('data-about-heading') || 'ABOUT US';
    const ctaLabel = homepageRoot.getAttribute('data-cta-label') || 'OUR STORY';
    const ctaUrl = homepageRoot.getAttribute('data-cta-url') || '/pages/about';
    const stat1Value = homepageRoot.getAttribute('data-stat-1-value') || 'ZERO';
    const stat1Label = homepageRoot.getAttribute('data-stat-1-label') || 'COMPROMISE';
    const stat2Value = homepageRoot.getAttribute('data-stat-2-value') || 'ONE';
    const stat2Label = homepageRoot.getAttribute('data-stat-2-label') || 'PURSUIT';
    const stat3Value = homepageRoot.getAttribute('data-stat-3-value') || 'INFINITE';
    const stat3Label = homepageRoot.getAttribute('data-stat-3-label') || 'PRECISION';
    const exploreCta = homepageRoot.getAttribute('data-explore-cta') || 'EXPLORE OUR STORY';

    const videoPlaylist = homepageRoot.getAttribute('data-video-playlist') || '[]';

    try {
      const root = ReactDOM.createRoot(homepageRoot);
      root.render(
        <React.StrictMode>
          <HomepageScrollytelling
            productsJson={productsJson}
            videoPlaylist={videoPlaylist}
            fallbackImages={fallbackImages}
            aboutHeading={aboutHeading}
            foundingStory={foundingStory}
            ctaLabel={ctaLabel}
            ctaUrl={ctaUrl}
            stat1Value={stat1Value}
            stat1Label={stat1Label}
            stat2Value={stat2Value}
            stat2Label={stat2Label}
            stat3Value={stat3Value}
            stat3Label={stat3Label}
            brandParagraph={brandParagraph}
            exploreCta={exploreCta}
          />
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
      const videoUrl = collectionRoot.getAttribute('data-video-url') || '';
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
          <CollectionGrid products={products} videoUrl={videoUrl} />
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

    // Sync category sub-menu links: highlight active and intercept clicks for dynamic navigation
    const updateMenuCategoryHighlight = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const catParam = params.get('category') || 'All';
        const submenuLinks = menuOverlay.querySelectorAll('.menu-submenu-middle-link');
        submenuLinks.forEach(link => {
          const href = link.getAttribute('href') || '';
          const linkParams = new URLSearchParams(href.split('?')[1] || '');
          const linkCat = linkParams.get('category') || 'All';
          if (linkCat.toLowerCase() === catParam.toLowerCase()) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });
      } catch (err) {
        Logger.error('Failed to update menu category highlight', err);
      }
    };

    // Initial highlight sync
    updateMenuCategoryHighlight();
    window.addEventListener('popstate', updateMenuCategoryHighlight);

    // Bind sub-menu link clicks
    const submenuLinks = menuOverlay.querySelectorAll('.menu-submenu-middle-link');
    submenuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        try {
          const href = link.getAttribute('href') || '';
          const isCollectionsPage = document.getElementById('collection-grid-root') !== null;
          if (isCollectionsPage) {
            e.preventDefault();
            // Client-side transition (triggers popstate inside React)
            window.history.pushState(null, '', href);
            window.dispatchEvent(new Event('popstate'));
            closeMenu();
          } else {
            // Not on collections page: close menu and allow full navigation
            closeMenu();
          }
        } catch (err) {
          Logger.error('Failed handling submenu link click', err);
        }
      });
    });
  }

  // Add scroll headers intersection handlers for color adaptive dynamic header
  const nav = document.querySelector('.nav-header') as HTMLElement | null;
  if (nav) {
    // Keep the navbar always visible on all pages (including the hero)
    nav.classList.add('nav-visible');

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Find the hero section on the homepage
      const hero = document.querySelector('.hero-section') as HTMLElement | null;
      if (hero) {
        // Homepage dynamic behavior: dark over hero video, light everywhere else
        const heroHeight = hero.offsetHeight || window.innerHeight;
        if (currentScrollY >= heroHeight - 64) {
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

      // Navbar auto-hide on scroll down, show on scroll up
      if (currentScrollY <= 100) {
        nav.classList.remove('nav-hidden');
      } else {
        if (currentScrollY > lastScrollY) {
          nav.classList.add('nav-hidden');
        } else if (currentScrollY < lastScrollY) {
          nav.classList.remove('nav-hidden');
        }
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
