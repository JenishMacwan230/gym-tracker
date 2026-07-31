import React, { useState } from 'react';
import { MapPinIcon, DumbbellIcon, PhoneIcon, MessageIcon, MailIcon, MapIcon, ClockIcon, KeyIcon, SaveIcon } from '../Icons';
import { validateEmail, validatePhone } from '../../utils/validation';

export default function EditLocationModal({ isOpen, onClose, locationData, onSave }) {
  const [formData, setFormData] = useState({
    gymName: locationData?.gymName || '',
    streetAddress: locationData?.streetAddress || '',
    suiteCity: locationData?.suiteCity || '',
    landmark: locationData?.landmark || '',
    phoneFrontDesk: locationData?.phoneFrontDesk || '',
    phoneWhatsapp: locationData?.phoneWhatsapp || '',
    email: locationData?.email || '',
    googleMapsUrl: locationData?.googleMapsUrl || '',
    hours: {
      weekday: locationData?.hours?.weekday || '',
      saturday: locationData?.hours?.saturday || '',
      sunday: locationData?.hours?.sunday || '',
      vipNote: locationData?.hours?.vipNote || ''
    }
  });
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.email && !validateEmail(formData.email)) {
      setErrorMsg('Invalid email format! Please enter a valid email address.');
      return;
    }
    if (formData.phoneFrontDesk && !validatePhone(formData.phoneFrontDesk)) {
      setErrorMsg('Invalid Front Desk phone number format!');
      return;
    }
    if (formData.phoneWhatsapp && !validatePhone(formData.phoneWhatsapp)) {
      setErrorMsg('Invalid WhatsApp phone number format!');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content theme-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-top-accent-bar" />

        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="modal-header-icon">
              <MapPinIcon size={20} color="#ff6b72" />
            </div>
            <div>
              <h2 className="modal-title-text">Edit Location & Operating Hours</h2>
              <p className="modal-subtitle-text">Update gym address, contact phone numbers, and working hours</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body scrollable-modal-body" style={{ maxHeight: '62vh', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div className="premium-field-group">
              <label className="field-label">Gym Name</label>
              <div className="field-input-wrapper">
                <span className="input-icon">
                  <DumbbellIcon size={16} color="var(--text-muted)" />
                </span>
                <input 
                  type="text" 
                  className="premium-input"
                  value={formData.gymName}
                  onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="premium-field-group">
                <label className="field-label">Street Address</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <MapPinIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="premium-field-group">
                <label className="field-label">Suite & City / Zip</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <MapPinIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    value={formData.suiteCity}
                    onChange={(e) => setFormData({ ...formData, suiteCity: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="premium-field-group">
              <label className="field-label">Landmark Note</label>
              <div className="field-input-wrapper">
                <span className="input-icon">
                  <MapPinIcon size={16} color="var(--text-muted)" />
                </span>
                <input 
                  type="text" 
                  className="premium-input"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="premium-field-group">
                <label className="field-label">Front Desk Phone</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <PhoneIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    value={formData.phoneFrontDesk}
                    onChange={(e) => setFormData({ ...formData, phoneFrontDesk: e.target.value })}
                  />
                </div>
              </div>

              <div className="premium-field-group">
                <label className="field-label">WhatsApp / SMS Phone</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <MessageIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    value={formData.phoneWhatsapp}
                    onChange={(e) => setFormData({ ...formData, phoneWhatsapp: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-row-2">
              <div className="premium-field-group">
                <label className="field-label">General Contact Email</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <MailIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="email" 
                    className="premium-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="premium-field-group">
                <label className="field-label">Google Maps Link</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <MapIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    value={formData.googleMapsUrl}
                    onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <h4 style={{ color: '#ffffff', margin: '8px 0 0 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ClockIcon size={15} color="#ff6b72" />
              <span>Operating Hours</span>
            </h4>
            
            <div className="form-row-2">
              <div className="premium-field-group">
                <label className="field-label">Mon – Fri Hours</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <ClockIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    value={formData.hours.weekday}
                    onChange={(e) => setFormData({
                      ...formData,
                      hours: { ...formData.hours, weekday: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="premium-field-group">
                <label className="field-label">Saturday Hours</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <ClockIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    value={formData.hours.saturday}
                    onChange={(e) => setFormData({
                      ...formData,
                      hours: { ...formData.hours, saturday: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="form-row-2">
              <div className="premium-field-group">
                <label className="field-label">Sunday Hours</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <ClockIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    value={formData.hours.sunday}
                    onChange={(e) => setFormData({
                      ...formData,
                      hours: { ...formData.hours, sunday: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="premium-field-group">
                <label className="field-label">VIP Badge Note</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <KeyIcon size={16} color="var(--text-muted)" />
                  </span>
                  <input 
                    type="text" 
                    className="premium-input"
                    value={formData.hours.vipNote}
                    onChange={(e) => setFormData({
                      ...formData,
                      hours: { ...formData.hours, vipNote: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="modal-footer" style={{ marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-save-modal" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SaveIcon size={15} color="#ffffff" />
              <span>Save Location Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
