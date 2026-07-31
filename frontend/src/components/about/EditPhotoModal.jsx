import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CameraIcon, TagIcon, DumbbellIcon, MessageIcon, FolderIcon, SaveIcon } from '../Icons';

const API_BASE = 'http://localhost:5000/api';

export default function EditPhotoModal({ isOpen, onClose, photoToEdit, onSave }) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'weights',
    src: '',
    desc: ''
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (photoToEdit) {
      setFormData({
        id: photoToEdit.id || '',
        title: photoToEdit.title || '',
        category: photoToEdit.category || 'weights',
        src: photoToEdit.src || '',
        desc: photoToEdit.desc || ''
      });
    } else {
      setFormData({
        id: 'photo_' + Date.now(),
        title: '',
        category: 'weights',
        src: '',
        desc: ''
      });
    }
  }, [photoToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const body = new FormData();
    body.append('image', file);
    setUploading(true);
    try {
      const res = await axios.post(`${API_BASE}/upload`, body, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.url) {
        setFormData({ ...formData, src: res.data.url });
      }
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.src) {
      alert('Please fill in title and photo image source.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content theme-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-top-accent-bar" />

        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="modal-header-icon">
              <CameraIcon size={20} color="#ff6b72" />
            </div>
            <div>
              <h2 className="modal-title-text">{photoToEdit ? 'Edit Facility Photo' : 'Add Facility Photo'}</h2>
              <p className="modal-subtitle-text">Configure photo details, zone category, and image URL</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div className="form-row-2">
              <div className="premium-field-group">
                <label className="field-label">Photo Title</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <TagIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Rogue Power Racks"
                    required
                  />
                </div>
              </div>

              <div className="premium-field-group">
                <label className="field-label">Facility Category</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <DumbbellIcon size={16} color="var(--text-muted)" />
                  </span>
                  <select 
                    className="premium-input premium-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="weights">Weight Floor</option>
                    <option value="cardio">Cardio Deck</option>
                    <option value="turf">Functional Turf</option>
                    <option value="amenities">Amenities & Sauna</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="premium-field-group">
              <label className="field-label">Image Source (URL / Upload)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="field-input-wrapper" style={{ flex: 1 }}>
                  <span className="input-icon">
                    <CameraIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    placeholder="https://... or /about/gym_main.png"
                    value={formData.src}
                    onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                    required
                  />
                </div>
                <label className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FolderIcon size={14} />
                  <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            {formData.src && (
              <div className="modal-img-preview-box">
                <img 
                  src={formData.src} 
                  alt="Gallery Preview" 
                  className="preview-thumb-img"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'; }}
                />
                <div className="preview-info-text">
                  <span>Photo Live Preview</span>
                  <small>Selected photo will display in the Facility Gallery</small>
                </div>
              </div>
            )}

            <div className="premium-field-group">
              <label className="field-label">Photo Description</label>
              <div className="field-input-wrapper">
                <span className="input-icon textarea-icon">
                  <MessageIcon size={16} color="var(--text-muted)" />
                </span>
                <textarea 
                  className="premium-input premium-textarea"
                  rows="3"
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="Overview of equipment or zone features in this photo..."
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
              <span>{photoToEdit ? 'Save Photo Edits' : 'Add Photo to Gallery'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
