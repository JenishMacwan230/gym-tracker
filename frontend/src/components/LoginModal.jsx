import React, { useState } from 'react';
import axios from 'axios';
import { KeyIcon, UserIcon, ShieldIcon } from './Icons';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, API_BASE }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        usernameOrEmail: usernameOrEmail.trim(),
        password: password.trim()
      });

      if (res.data && res.data.token) {
        onLoginSuccess(res.data.token, res.data.user);
        onClose();
        setUsernameOrEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error('Login failed:', err);
      const msg = err.response?.data?.error || 'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content theme-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-top-accent-bar" />

        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="modal-header-icon">
              <KeyIcon size={20} color="#ff6b72" />
            </div>
            <div>
              <h2 className="modal-title-text">Admin Authentication</h2>
              <p className="modal-subtitle-text">Sign in to manage members & facility equipment</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.15)', 
            border: '1px solid rgba(239, 68, 68, 0.4)', 
            color: '#f87171', 
            padding: '10px 14px', 
            borderRadius: '10px', 
            fontSize: '13px', 
            marginBottom: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <ShieldIcon size={16} color="#f87171" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div className="premium-field-group">
              <label className="field-label">Username or Admin Email</label>
              <div className="field-input-wrapper">
                <span className="input-icon">
                  <UserIcon size={16} color="var(--text-muted)" />
                </span>
                <input
                  type="text"
                  className="premium-input"
                  required
                  autoFocus
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="Enter username or email"
                />
              </div>
            </div>

            <div className="premium-field-group">
              <label className="field-label">Admin Password</label>
              <div className="field-input-wrapper">
                <span className="input-icon">
                  <KeyIcon size={16} color="var(--text-muted)" />
                </span>
                <input
                  type="password"
                  className="premium-input"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            </div>

          </div>

          <div className="modal-footer" style={{ marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-save-modal" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <KeyIcon size={15} color="#ffffff" />
              <span>{loading ? 'Authenticating...' : 'Sign In as Admin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
