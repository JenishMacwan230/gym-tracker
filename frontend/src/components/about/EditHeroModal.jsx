import React, { useState } from 'react';
import { TrophyIcon, TagIcon, ZapIcon, MessageIcon, SaveIcon } from '../Icons';

export default function EditHeroModal({ isOpen, onClose, heroData, onSave }) {
  const [formData, setFormData] = useState({
    badge: heroData?.badge || '',
    title: heroData?.title || '',
    subtitle: heroData?.subtitle || ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content theme-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-top-accent-bar" />

        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="modal-header-icon">
              <TrophyIcon size={20} color="#ff6b72" />
            </div>
            <div>
              <h2 className="modal-title-text">Edit Hero Section</h2>
              <p className="modal-subtitle-text">Customize the main hero title, badge, and intro text</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div className="premium-field-group">
              <label className="field-label">Hero Badge Text</label>
              <div className="field-input-wrapper">
                <span className="input-icon">
                  <TagIcon size={16} color="var(--text-muted)" />
                </span>
                <input 
                  type="text" 
                  className="premium-input"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. EST. 2018 • METRO CITY"
                  required
                />
              </div>
            </div>

            <div className="premium-field-group">
              <label className="field-label">Main Heading / Title</label>
              <div className="field-input-wrapper">
                <span className="input-icon">
                  <ZapIcon size={16} color="var(--text-muted)" />
                </span>
                <input 
                  type="text" 
                  className="premium-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. About Titan Fitness & Gym"
                  required
                />
              </div>
            </div>

            <div className="premium-field-group">
              <label className="field-label">Hero Subtitle</label>
              <div className="field-input-wrapper">
                <span className="input-icon textarea-icon">
                  <MessageIcon size={16} color="var(--text-muted)" />
                </span>
                <textarea 
                  className="premium-input premium-textarea"
                  rows="3"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Brief tagline or welcome description..."
                  required
                />
              </div>
            </div>

          </div>

          <div className="modal-footer" style={{ marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-save-modal" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SaveIcon size={15} color="#ffffff" />
              <span>Save Hero Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
