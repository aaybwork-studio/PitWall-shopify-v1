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
    const manifestoImage1 = homepageRoot.getAttribute('data-manifesto-image-1') || '';
    const manifestoTagline1 = homepageRoot.getAttribute('data-manifesto-tagline-1') || 'THE RACE.';
    const manifestoImage2 = homepageRoot.getAttribute('data-manifesto-image-2') || '';
    const manifestoTagline2 = homepageRoot.getAttribute('data-manifesto-tagline-2') || 'THE MOMENT.';
    const manifestoImage3 = homepageRoot.getAttribute('data-manifesto-image-3') || '';
    const manifestoTagline3 = homepageRoot.getAttribute('data-manifesto-tagline-3') || 'YOURS.';

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
            manifestoImage1={manifestoImage1}
            manifestoTagline1={manifestoTagline1}
            manifestoImage2={manifestoImage2}
            manifestoTagline2={manifestoTagline2}
            manifestoImage3={manifestoImage3}
            manifestoTagline3={manifestoTagline3}
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
    const productType = pdpRoot.getAttribute('data-product-type') || '';
    const productImage = pdpRoot.getAttribute('data-product-image') || '';
    const productDescription = pdpRoot.getAttribute('data-product-description') || '';
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
          productType={productType}
          productImage={productImage}
          productDescription={productDescription}
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
      const title = collectionRoot.getAttribute('data-title') || 'Our Products';
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
          <CollectionGrid products={products} videoUrl={videoUrl} title={title} />
        </React.StrictMode>
      );
    }
  }

  // 4. Bind Redesigned Navigation Interactions
  const header = document.querySelector('.nav-header');
  const desktopItems = document.querySelectorAll('.nav-menu-item');
  const megamenuContainer = document.getElementById('nav-megamenu-container');
  const megamenuPanels = document.querySelectorAll('.megamenu-panel');

  let activeDropdown: string | null = null;
  let menuCloseTimeout: ReturnType<typeof setTimeout> | null = null;

  function showDropdown(dropdownName: string) {
    if (menuCloseTimeout) {
      clearTimeout(menuCloseTimeout);
      menuCloseTimeout = null;
    }
    
    // Deactivate old active panel
    megamenuPanels.forEach(panel => {
      if (panel.getAttribute('data-panel') === dropdownName) {
        panel.classList.add('is-active');
      } else {
        panel.classList.remove('is-active');
      }
    });

    activeDropdown = dropdownName;
    megamenuContainer?.classList.add('is-visible');
    header?.classList.add('nav-header-expanded');
  }

  function hideDropdown() {
    if (menuCloseTimeout) clearTimeout(menuCloseTimeout);
    menuCloseTimeout = setTimeout(() => {
      megamenuContainer?.classList.remove('is-visible');
      header?.classList.remove('nav-header-expanded');
      megamenuPanels.forEach(panel => panel.classList.remove('is-active'));
      activeDropdown = null;
    }, 200);
  }

  // Bind desktop hovers
  desktopItems.forEach(item => {
    const dropdownName = item.getAttribute('data-dropdown');
    if (!dropdownName || dropdownName === 'new-arrivals') {
      // New arrivals is a direct link, should close dropdowns if hovered
      item.addEventListener('mouseenter', hideDropdown);
      return;
    }

    item.addEventListener('mouseenter', () => {
      showDropdown(dropdownName);
    });

    item.addEventListener('mouseleave', hideDropdown);
  });

  if (megamenuContainer) {
    megamenuContainer.addEventListener('mouseenter', () => {
      if (activeDropdown) {
        showDropdown(activeDropdown);
      }
    });
    megamenuContainer.addEventListener('mouseleave', hideDropdown);
  }

  // Bind Mobile Takeover Menu
  const mobileTrigger = document.getElementById('menu-trigger-btn-mobile');
  const mobileClose = document.getElementById('menu-close-btn-mobile');
  const mobileOverlay = document.getElementById('full-menu-overlay');

  function openMobileMenu() {
    mobileOverlay?.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileOverlay?.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (mobileTrigger) {
    mobileTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openMobileMenu();
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
    });
  }

  // Accordion bindings inside mobile overlay
  if (mobileOverlay) {
    const accordionTriggers = mobileOverlay.querySelectorAll('.mobile-accordion-trigger');
    accordionTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const item = trigger.closest('.mobile-menu-item');
        if (item) {
          const isOpen = item.classList.contains('is-open');
          // Close other accordions first
          mobileOverlay.querySelectorAll('.mobile-menu-item.mobile-accordion').forEach(other => {
            if (other !== item) other.classList.remove('is-open');
          });
          
          if (isOpen) {
            item.classList.remove('is-open');
          } else {
            item.classList.add('is-open');
          }
        }
      });
    });
  }

  // Add scroll headers intersection handlers for color adaptive dynamic header
  const nav = document.querySelector('.nav-header') as HTMLElement | null;
  if (nav) {
    // Keep the navbar always visible on all pages (including the hero)
    nav.classList.add('nav-visible');

    const getScrollY = () => {
      const homepageScroller = document.querySelector('.homepage-scroll-container') as HTMLElement | null;
      return homepageScroller ? homepageScroller.scrollTop : window.scrollY;
    };

    const updateNavbarTheme = () => {
      const currentScrollY = getScrollY();
      const homepageScroller = document.querySelector('.homepage-scroll-container') as HTMLElement | null;
      const isPDP = document.querySelector('#product-scrollytelling-root') !== null;
      const isDarkMode = document.documentElement.classList.contains('dark-mode');

      if (homepageScroller) {
        // Homepage dynamic behavior: dark over hero video, light everywhere else only in light mode
        if (currentScrollY >= window.innerHeight - 64 && !isDarkMode) {
          nav.classList.add('nav-light-bg');
        } else {
          nav.classList.remove('nav-light-bg');
        }
      } else if (isPDP) {
        nav.classList.remove('nav-light-bg');
      } else {
        if (isDarkMode) {
          nav.classList.remove('nav-light-bg');
        } else {
          nav.classList.add('nav-light-bg');
        }
      }
    };

    let lastScrollY = getScrollY();
    const handleScroll = () => {
      const currentScrollY = getScrollY();

      updateNavbarTheme();

      // Navbar auto-hide on scroll down, show on scroll up
      if (currentScrollY <= 100) {
        nav.classList.remove('nav-hidden');
        nav.classList.add('nav-visible');
      } else if (Math.abs(currentScrollY - lastScrollY) > 5) {
        if (currentScrollY > lastScrollY) {
          nav.classList.add('nav-hidden');
          nav.classList.remove('nav-visible');
        } else {
          nav.classList.remove('nav-hidden');
          nav.classList.add('nav-visible');
        }
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('pitwall:theme-change' as any, updateNavbarTheme);
    handleScroll();
  }

}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
