import { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  logoUrl?: string;
  cartCount?: number;
}

export function Navbar({ logoUrl = '', cartCount = 0 }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [liveCartCount, setLiveCartCount] = useState(cartCount);
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
              <span style={{ fontFamily: 'var(--font-branding, btseps2)', fontWeight: '600', color: 'var(--bg)', fontSize: '14px', letterSpacing: '0.15em' }}>
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
              {menuItems.map((item, idx) => (
                <li 
                  key={idx}
                  className={`pw-menu-link-item ${activeItem === idx ? 'is-active' : ''}`}
                  onMouseEnter={() => {
                    setActiveItem(idx);
                    keepOpen();
                  }}
                >
                  <svg className="pw-menu-bullet-svg" viewBox="0 0 10 10">
                    <rect x="0" y="0" width="10" height="10" />
                  </svg>
                  <a href={item.href} className="pw-menu-link" onClick={closeMenu}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 (30%): Contact and social info */}
          <div className="pw-menu-contact-col">
            <div>
              <span className="pw-menu-contact-label">CONTACT</span>
              <p className="pw-menu-contact-details" style={{ marginTop: '8px' }}>
                TELEMETRY@PITWALL.IN<br />
                INSTAGRAM: @PITWALL.IN<br />
                NEW DELHI, INDIA
              </p>
            </div>

            <div>
              <span className="pw-menu-contact-label">WORKING FROM</span>
              <p className="pw-menu-contact-details" style={{ marginTop: '8px' }}>
                NEW DELHI, INDIA
              </p>
            </div>
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
      </div>
    </>
  );
}
