import React from 'react';

// Animated Shimmer Skeleton for Data Tables (Members & Equipment Table View)
export function TableSkeleton({ rows = 5, columns = 6 }) {
  return (
    <div className="content-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Header Skeleton */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="skeleton-box" style={{ height: '18px', flex: 1 }} />
          ))}
        </div>

        {/* Row Skeletons */}
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '8px 0' }}>
            <div className="skeleton-box" style={{ height: '40px', flex: 2, borderRadius: '10px' }} />
            <div className="skeleton-box" style={{ height: '24px', flex: 1, borderRadius: '9999px' }} />
            <div className="skeleton-box" style={{ height: '20px', flex: 1 }} />
            <div className="skeleton-box" style={{ height: '20px', flex: 1 }} />
            <div className="skeleton-box" style={{ height: '24px', flex: 1, borderRadius: '9999px' }} />
            <div className="skeleton-box" style={{ height: '32px', flex: 1, borderRadius: '8px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Animated Shimmer Skeleton for Equipment Photo Bento Gallery View
export function GallerySkeleton({ cards = 6 }) {
  return (
    <div className="bento-container">
      <div className="bento-grid-wrapper">
        {Array.from({ length: cards }).map((_, idx) => (
          <div 
            key={idx} 
            className="bento-card-item skeleton-box" 
            style={{ 
              minHeight: '280px', 
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div className="skeleton-box" style={{ width: '90px', height: '24px', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)' }} />
              <div className="skeleton-box" style={{ width: '60px', height: '24px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)' }} />
            </div>
            <div>
              <div className="skeleton-box" style={{ width: '40%', height: '14px', marginBottom: '8px', background: 'rgba(255,255,255,0.1)' }} />
              <div className="skeleton-box" style={{ width: '75%', height: '24px', background: 'rgba(255,255,255,0.15)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Animated Shimmer Skeleton for About Us Page
export function AboutUsSkeleton() {
  return (
    <div className="about-us-container" style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Banner Skeleton */}
      <div className="skeleton-box" style={{ height: '180px', borderRadius: '24px', width: '100%' }} />

      {/* Grid Section Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div className="skeleton-box" style={{ height: '320px', borderRadius: '20px' }} />
        <div className="skeleton-box" style={{ height: '320px', borderRadius: '20px' }} />
      </div>

      {/* Founder Section Skeleton */}
      <div className="skeleton-box" style={{ height: '260px', borderRadius: '24px', width: '100%' }} />

      {/* Photo Gallery Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-box" style={{ height: '220px', borderRadius: '16px' }} />
        ))}
      </div>
    </div>
  );
}
