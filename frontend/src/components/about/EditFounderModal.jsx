import React, { useState } from 'react';
import axios from 'axios';
import { ShieldIcon, UserIcon, TagIcon, StarIcon, CameraIcon, MessageIcon, MailIcon, PhoneIcon, FolderIcon, SaveIcon } from '../Icons';
import { validateName, validateEmail, validatePhone } from '../../utils/validation';

const API_BASE = 'http://localhost:5000/api';

export default function EditFounderModal({ isOpen, onClose, founderData, onSave }) {
  const [formData, setFormData] = useState({
    name: founderData?.name || '',
    role: founderData?.role || '',
    experienceYears: founderData?.experienceYears || '',
    imageUrl: founderData?.imageUrl || '',
    bio: founderData?.bio || '',
    email: founderData?.email || '',
    phone: founderData?.phone || '',
    credentials: founderData?.credentials ? [...founderData.credentials] : []
  });

  const [newCred, setNewCred] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
        setFormData({ ...formData, imageUrl: res.data.url });
      }
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddCred = () => {
    if (newCred.trim()) {
      setFormData({
        ...formData,
        credentials: [...formData.credentials, newCred.trim()]
      });
      setNewCred('');
    }
  };

  const handleRemoveCred = (index) => {
    setFormData({
      ...formData,
      credentials: formData.credentials.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.name && !validateName(formData.name)) {
      setErrorMsg('Invalid founder name format! (Must be 2-50 characters, letters only)');
      return;
    }
    if (formData.email && !validateEmail(formData.email)) {
      setErrorMsg('Invalid founder email address format!');
      return;
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      setErrorMsg('Invalid founder phone number format! (e.g. +1 555-019-2831)');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content theme-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        
        {/* Top Accent Line */}
        <div className="modal-top-accent-bar" />

        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="modal-header-icon">
              <ShieldIcon size={20} color="#ff6b72" />
            </div>
            <div>
              <h2 className="modal-title-text">Edit Founder & Owner Profile</h2>
              <p className="modal-subtitle-text">Update founder details, image, biography, and credentials</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body scrollable-modal-body" style={{ maxHeight: '62vh', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Row 1: Name & Role */}
            <div className="form-row-2">
              <div className="premium-field-group">
                <label className="field-label">Founder Name</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <UserIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    placeholder="e.g. Marcus Sterling"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="premium-field-group">
                <label className="field-label">Role / Title</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <TagIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    placeholder="e.g. FOUNDER & HEAD COACH"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Experience Badge & Image Upload */}
            <div className="form-row-2">
              <div className="premium-field-group">
                <label className="field-label">Experience Badge</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <StarIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    placeholder="e.g. 15+ Years"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  />
                </div>
              </div>

              <div className="premium-field-group">
                <label className="field-label">Founder Photo (URL / Upload)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div className="field-input-wrapper" style={{ flex: 1 }}>
                    <span className="input-icon">
                      <CameraIcon size={16} color="var(--text-muted)" />
                    </span>
                    <input 
                      type="text" 
                      className="premium-input"
                      placeholder="/about/owner.png"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>
                  <label className="btn btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FolderIcon size={14} />
                    <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
            </div>

            {/* Image Preview Box */}
            {formData.imageUrl && (
              <div className="modal-img-preview-box">
                <img 
                  src={formData.imageUrl} 
                  alt="Founder Preview" 
                  className="preview-thumb-img"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'; }}
                />
                <div className="preview-info-text">
                  <span>Photo Live Preview</span>
                  <small>Selected photo will display on the Founder Card</small>
                </div>
              </div>
            )}

            {/* Row 3: Bio Quote Statement */}
            <div className="premium-field-group">
              <label className="field-label">Bio / Founder Quote Statement</label>
              <div className="field-input-wrapper">
                <span className="input-icon textarea-icon">
                  <MessageIcon size={16} color="var(--text-muted)" />
                </span>
                <textarea 
                  className="premium-input premium-textarea"
                  rows="3"
                  placeholder="Founder quote or inspirational bio statement..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Row 4: Direct Email & Direct Phone */}
            <div className="form-row-2">
              <div className="premium-field-group">
                <label className="field-label">Direct Email</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <MailIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="email" 
                    className="premium-input"
                    placeholder="marcus@titanfitness.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="premium-field-group">
                <label className="field-label">Direct Phone</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <PhoneIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    placeholder="+1 (555) 892-4410"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Certifications & Credentials */}
            <div className="premium-field-group">
              <label className="field-label">Certifications & Credentials</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div className="field-input-wrapper" style={{ flex: 1 }}>
                  <span className="input-icon">
                    <TagIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    placeholder="Add certification (e.g. CSCS® Certified Specialist)"
                    value={newCred}
                    onChange={(e) => setNewCred(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCred(); } }}
                  />
                </div>
                <button type="button" className="btn btn-secondary" onClick={handleAddCred}>
                  + Add
                </button>
              </div>

              <div className="credentials-pills-grid">
                {formData.credentials.map((cred, idx) => (
                  <div key={idx} className="cred-pill-item">
                    <span>✓ {cred}</span>
                    <button 
                      type="button" 
                      className="cred-remove-btn" 
                      onClick={() => handleRemoveCred(idx)}
                      title="Remove Credential"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="modal-footer" style={{ marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-save-modal" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SaveIcon size={15} color="#ffffff" />
              <span>Save Founder Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
