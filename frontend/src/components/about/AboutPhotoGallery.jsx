import React, { useState } from 'react';
import { CircleEditBtn, CircleDeleteBtn, SearchIcon, PlusIcon } from '../Icons';

export default function AboutPhotoGallery({ photos = [], adminUser, onAddPhoto, onEditPhoto, onDeletePhoto }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  const filteredPhotos = photos.filter(p => 
    selectedCategory === 'all' ? true : p.category === selectedCategory
  );

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredPhotos.length);
    }
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  return (
    <section className="gallery-section">
      <div className="gallery-header-row">
        <div>
          <div className="section-header-tag">EXPLORE OUR FACILITY</div>
          <h2 className="section-title">All Gym Photos & Training Zones</h2>
          <p className="section-desc">Take a tour of our high-end facility equipped for strength, cardio, and recovery.</p>
        </div>

        <div className="gallery-filters" style={{ alignItems: 'center' }}>
          <button 
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Photos ({photos.length})
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'weights' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('weights')}
          >
            Weight Floor
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'cardio' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('cardio')}
          >
            Cardio Deck
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'turf' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('turf')}
          >
            Functional Turf
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'amenities' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('amenities')}
          >
            Amenities & Sauna
          </button>

          {adminUser && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={onAddPhoto}
              style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <PlusIcon size={14} />
              <span>Add New Photo</span>
            </button>
          )}
        </div>
      </div>

      <div className="photo-grid">
        {filteredPhotos.map((photo, idx) => (
          <div 
            key={photo.id || idx} 
            className="photo-card"
            onClick={() => setActiveLightboxIndex(idx)}
          >
            <div className="photo-image-container">
              <img 
                src={photo.src} 
                alt={photo.title} 
                className="gallery-img"
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <div className="photo-overlay">
                <span className="zoom-icon" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <SearchIcon size={14} />
                  <span>View Photo</span>
                </span>
              </div>

              {/* Admin Overlay Action Buttons */}
              {adminUser && (
                <div 
                  className="photo-admin-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CircleEditBtn 
                    size={36} 
                    iconSize={16} 
                    onClick={() => onEditPhoto(photo)} 
                    title="Edit Photo"
                  />
                  <CircleDeleteBtn 
                    size={36} 
                    iconSize={16} 
                    onClick={() => onDeletePhoto(photo.id)} 
                    title="Delete Photo"
                  />
                </div>
              )}
            </div>

            <div className="photo-caption">
              <span className="photo-cat-badge">{(photo.category || 'ZONE').toUpperCase()}</span>
              <h3 className="photo-title">{photo.title}</h3>
              <p className="photo-desc">{photo.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Preview Modal */}
      {activeLightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setActiveLightboxIndex(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setActiveLightboxIndex(null)}>✕</button>
            <button className="lightbox-nav lightbox-prev" onClick={handlePrevPhoto}>❮</button>
            
            <div className="lightbox-main">
              <img 
                src={filteredPhotos[activeLightboxIndex].src} 
                alt={filteredPhotos[activeLightboxIndex].title} 
                className="lightbox-img"
              />
              <div className="lightbox-details">
                <span className="lightbox-counter">
                  Photo {activeLightboxIndex + 1} of {filteredPhotos.length}
                </span>
                <h3 className="lightbox-title">{filteredPhotos[activeLightboxIndex].title}</h3>
                <p className="lightbox-desc">{filteredPhotos[activeLightboxIndex].desc}</p>
              </div>
            </div>

            <button className="lightbox-nav lightbox-next" onClick={handleNextPhoto}>❯</button>
          </div>
        </div>
      )}
    </section>
  );
}
