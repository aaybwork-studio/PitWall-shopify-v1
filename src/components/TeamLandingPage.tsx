import { useMemo, useState } from 'react';
import { Product, CollectionCard, SortDropdown, useUrlSyncedFilter } from './CollectionGrid';

const SORTS = ['Default', 'Price: Low to High', 'Price: High to Low', 'Alphabetical'];

function getCleanPrice(p: string): number {
  return parseFloat(p.replace(/[^0-9.]/g, '')) || 0;
}

interface TeamLandingPageProps {
  products: Product[];
  title: string;
  heroImage: string;
  bio: string;
  logo?: string;
}

export function TeamLandingPage({ products, title, heroImage, bio, logo }: TeamLandingPageProps) {
  const [selectedSort, , handleSortSelect] = useUrlSyncedFilter('sort', SORTS, 'Default');
  const [sortOpen, setSortOpen] = useState<boolean>(false);

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (selectedSort === 'Price: Low to High') {
      list.sort((a, b) => getCleanPrice(a.price) - getCleanPrice(b.price));
    } else if (selectedSort === 'Price: High to Low') {
      list.sort((a, b) => getCleanPrice(b.price) - getCleanPrice(a.price));
    } else if (selectedSort === 'Alphabetical') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [products, selectedSort]);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--bg, #EDEBE5)',
        color: 'var(--fg, #0C0C0C)',
      }}
    >
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <div
        className="relative w-full flex items-end overflow-hidden"
        style={{ height: '50vh', minHeight: 320, backgroundColor: '#1a1a1a' }}
      >
        {heroImage && (
          <img
            src={heroImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(12,12,12,0) 0%, rgba(12,12,12,0.7) 100%)' }} />
        {logo && (
          <img
            src={logo}
            alt={`${title} logo`}
            className="absolute top-6 right-6 z-10 object-contain"
            style={{ width: 72, height: 72 }}
          />
        )}
        <div className="relative z-10 px-5 md:px-[100px] pb-6 w-full">
          {/* Breadcrumb */}
          <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: '#EDEBE5', opacity: 0.8 }}>
            <a href="/" style={{ color: '#EDEBE5' }}>Home</a>
            {' / '}
            <a href="/collections" style={{ color: '#EDEBE5' }}>Teams</a>
            {' / '}
            <span>{title}</span>
          </div>
          <h1 className="font-display-strict text-5xl md:text-7xl uppercase tracking-tighter leading-none m-0" style={{ color: '#EDEBE5' }}>
            {title}
          </h1>
        </div>
      </div>

      {/* ── Bio Blurb ──────────────────────────────────────────────────── */}
      <div className="px-5 md:px-[100px] pt-8 pb-4" style={{ backgroundColor: 'var(--bg)' }}>
        <p className="font-mono text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--fg)', opacity: 0.85 }}>
          {bio}
        </p>
      </div>

      {/* ── Sticky Filter / Sort Bar ──────────────────────────────────── */}
      <div
        className="px-5 md:px-[100px]"
        style={{
          backgroundColor: '#7A7A7A',
          color: '#0C0C0C',
          borderBottom: '1px solid #0C0C0C',
          paddingTop: '6px',
          paddingBottom: '6px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          position: 'sticky',
          top: 64,
          zIndex: 40,
          userSelect: 'none',
        }}
      >
        <SortDropdown
          options={SORTS}
          selected={selectedSort}
          onSelect={handleSortSelect}
          open={sortOpen}
          onToggle={() => setSortOpen(o => !o)}
        />
      </div>

      {/* ── Product Grid ──────────────────────────────────────────────── */}
      <div className="w-full py-8 px-5 md:px-[100px]" style={{ backgroundColor: 'var(--bg)' }}>
        {sortedProducts.length === 0 ? (
          <div
            style={{
              padding: '80px 0',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.4,
            }}
          >
            No products found.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {sortedProducts.map(p => (
              <div key={p.url} style={{ height: 380 }}>
                <CollectionCard product={p} className="w-full h-full" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
