import { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  logoUrl?: string;
  cartCount?: number;
}

export function Navbar({ logoUrl = '', cartCount = 0 }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [liveCartCount, setLiveCartCount] = useState(cartCount);
  const [isHoveringCollections, setIsHoveringCollections] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/collections/all' },
    { label: 'Collections', href: '/collections' },
    { label: 'About', href: '/pages/about' },
    { label: 'Contact', href: '/pages/contact' },
  ];

  // Sync with dynamic prop updates
  useEffect(() => {
    if (cartCount !== undefined) {
      setLiveCartCount(cartCount);
    }
  }, [cartCount]);

  // Fetch initial live Shopify cart count on mount
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch('/cart.js');
        if (response.ok) {
          const cart = await response.json();
          if (cart && typeof cart.item_count === 'number') {
            setLiveCartCount(cart.item_count);
          }
        }
      } catch (err) {
        console.warn('Could not fetch Shopify live cart count', err);
      }
    };
    fetchCartCount();

    // Listen to custom local AJAX cart update events
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener('pitwall:cart-updated', handleCartUpdate);
    return () => {
      window.removeEventListener('pitwall:cart-updated', handleCartUpdate);
    };
  }, []);

  const openMenu = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsHoveringCollections(false);
    document.body.style.overflow = '';
  };

  const delayClose = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(closeMenu, 150);
  };

  const keepOpen = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  return (
    <>
      {/* STICKY NAVIGATION HEADER */}
      <header className="pw-nav-header pw-nav-visible">
        <div className="pw-nav-grid">
          {/* Left: MENU trigger */}
          <button 
            className="pw-nav-menu-btn" 
            onClick={(e) => {
              e.preventDefault();
              isOpen ? closeMenu() : openMenu();
            }}
            onMouseEnter={openMenu}
            onMouseLeave={delayClose}
          >
            {isOpen ? 'CLOSE' : 'MENU'}
          </button>

          {/* Center: PITWALL logo combination mark */}
          <a href="/" className="pw-nav-logo-link">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="PITWALL" 
                style={{ height: '31px', width: 'auto', display: 'block' }} 
              />
            ) : (
              <span style={{ fontFamily: 'var(--font-branding, "BTSE PS2")', fontWeight: '600', color: 'var(--bg)', fontSize: '14px', letterSpacing: '0.15em' }}>
                PITWALL
              </span>
            )}
          </a>

          {/* Right: CART button with superscript item badge */}
          <button className="pw-nav-cart-btn" onClick={() => window.location.href = '/cart'}>
            CART <span className="pw-nav-cart-badge">[ <span id="cart-counter-display">{liveCartCount}</span> ]</span>
          </button>
        </div>
      </header>

      {/* Expanded Menu Takeover Overlay */}
      <div 
        className={`pw-menu-overlay ${isOpen ? 'is-active' : ''}`}
        onMouseEnter={keepOpen}
        onMouseLeave={delayClose}
      >
        <div className="pw-menu-content" onMouseEnter={keepOpen} onMouseLeave={delayClose}>
          {/* Column 1 (40%): navigation links stacked */}
          <div>
            <ul className="pw-menu-links-list">
              {menuItems.map((item, idx) => {
                return (
                  <li 
                    key={idx}
                    className={`pw-menu-link-item ${activeItem === idx ? 'is-active' : ''}`}
                    onMouseEnter={() => {
                      setActiveItem(idx);
                      keepOpen();
                      if (item.label === 'Collections') {
                        setIsHoveringCollections(true);
                      } else {
                        setIsHoveringCollections(false);
                      }
                    }}
                    onMouseLeave={() => {
                      if (item.label === 'Collections') {
                        setIsHoveringCollections(false);
                      }
                    }}
                    style={{ alignItems: 'center' }}
                  >
                    <svg className="pw-menu-bullet-svg" viewBox="0 0 10 10">
                      <rect x="0" y="0" width="10" height="10" />
                    </svg>
                    <div className="pw-menu-link-col-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <a 
                        href={item.href} 
                        className="pw-menu-link" 
                        onClick={() => closeMenu()}
                      >
                        {item.label}
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 2 (30%): Mid-shifted subcategories */}
          <div className="menu-submenu-col" style={{ opacity: isHoveringCollections ? 1 : 0, pointerEvents: isHoveringCollections ? 'auto' : 'none', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', transform: isHoveringCollections ? 'translateX(0)' : 'translateX(-10px)' }}>
            <span className="pw-menu-contact-label">COLLECTIONS</span>
            <ul className="menu-submenu-middle" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none', padding: 0 }}>
              <li><a href="/collections/chassis" className="menu-submenu-middle-link" onClick={closeMenu}>CHASSIS</a></li>
              <li><a href="/collections/helmets" className="menu-submenu-middle-link" onClick={closeMenu}>HELMETS</a></li>
              <li><a href="/collections/desk-accessories" className="menu-submenu-middle-link" onClick={closeMenu}>DESK ACCESSORIES</a></li>
            </ul>
          </div>

          {/* Column 3 (30%): Stacking image panels */}
          <div className="pw-menu-images-col">
            <div className="pw-menu-image-panel">
              <div className="pw-menu-img-placeholder"></div>
              <span className="pw-menu-img-caption">ABOUT THE BRAND</span>
            </div>
            <div className="pw-menu-image-panel">
              <div className="pw-menu-img-placeholder" style={{ backgroundColor: '#E5E3DD' }}></div>
              <span className="pw-menu-img-caption">LATEST DROP</span>
            </div>
          </div>
        </div>
        {/* Bottom wordmark logo */}
        <div className="menu-bottom-bar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '16px 0' }}>
          <img src="/assets/wordmark-footer.png" alt="PITWALL" className="menu-wordmark-img" />
        </div>
      </div>
    </>
  );
}
