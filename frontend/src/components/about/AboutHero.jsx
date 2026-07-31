import React from 'react';
import { EditIcon, TrophyIcon } from '../Icons';

export default function AboutHero({ heroData, adminUser, onEdit }) {
  return (
    <section className="about-hero" style={{ position: 'relative' }}>
      {adminUser && (
        <button 
          className="pill-action-btn section-edit-floating-btn"
          onClick={onEdit}
          title="Edit Hero Section Details"
        >
          <EditIcon size={14} />
          <span>Edit Hero</span>
        </button>
      )}

      <div className="about-hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <TrophyIcon size={14} color="#ff6b72" />
        <span>{heroData?.badge || 'EST. 2018 • METRO CITY'}</span>
      </div>
      <h1 className="about-title">{heroData?.title || 'About Titan Fitness & Gym'}</h1>
      <p className="about-subtitle">{heroData?.subtitle || 'Built for champions, dedicated to progress.'}</p>
    </section>
  );
}
