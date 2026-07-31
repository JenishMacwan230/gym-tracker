import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SettingsIcon, UserIcon, MailIcon, KeyIcon, SaveIcon } from './Icons';
import { validateUsername, validateEmail } from '../utils/validation';

export default function AdminProfileModal({ isOpen, onClose, adminUser, adminToken, onProfileUpdated, API_BASE }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    if (adminUser) {
      setUsername(adminUser.username || '');
      setEmail(adminUser.email || '');
    }
  }, [adminUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);

    // Regex Validation
    if (!validateUsername(username)) {
      setStatusMsg({ type: 'error', text: 'Invalid username format! Username must be 3-30 characters (letters, numbers, underscores).' });
      return;
    }
    if (!validateEmail(email)) {
      setStatusMsg({ type: 'error', text: 'Invalid email format! Please enter a valid email address (e.g. admin@gym.com).' });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put(
        `${API_BASE}/auth/profile`,
        {
          username: username.trim(),
          email: email.trim(),
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim() || undefined
        },
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );

      if (res.data && res.data.user) {
        setStatusMsg({ type: 'success', text: res.data.message || 'Profile credentials updated!' });
        onProfileUpdated(res.data.token || adminToken, res.data.user);
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      const msg = err.response?.data?.error || 'Failed to update credentials';
      setStatusMsg({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content theme-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-top-accent-bar" />

        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="modal-header-icon">
              <SettingsIcon size={20} color="#ff6b72" />
            </div>
            <div>
              <h2 className="modal-title-text">Admin Settings</h2>
              <p className="modal-subtitle-text">Update username, email, or master password</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {statusMsg && (
          <div style={{
            background: statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(74, 222, 128, 0.15)',
            border: statusMsg.type === 'error' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(74, 222, 128, 0.4)',
            color: statusMsg.type === 'error' ? '#f87171' : '#4ade80',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div className="premium-field-group">
              <label className="field-label">Admin Username</label>
              <div className="field-input-wrapper">
                <span className="input-icon">
                  <UserIcon size={16} color="var(--text-muted)" />
                </span>
                <input
                  type="text"
                  className="premium-input"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                />
              </div>
            </div>

            <div className="premium-field-group">
              <label className="field-label">Admin Email</label>
              <div className="field-input-wrapper">
                <span className="input-icon">
                  <MailIcon size={16} color="var(--text-muted)" />
                </span>
                <input
                  type="email"
                  className="premium-input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />

            <div className="premium-field-group">
              <label className="field-label">Current Password (required for changes)</label>
              <div className="field-input-wrapper">
                <span className="input-icon">
                  <KeyIcon size={16} color="var(--text-muted)" />
                </span>
                <input
                  type="password"
                  className="premium-input"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div className="premium-field-group">
              <label className="field-label">New Password (optional)</label>
              <div className="field-input-wrapper">
                <span className="input-icon">
                  <KeyIcon size={16} color="var(--text-muted)" />
                </span>
                <input
                  type="password"
                  className="premium-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep unchanged"
                />
              </div>
            </div>

          </div>

          <div className="modal-footer" style={{ marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-save-modal" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SaveIcon size={15} color="#ffffff" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
