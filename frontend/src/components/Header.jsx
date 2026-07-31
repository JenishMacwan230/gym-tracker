import React, { useState } from 'react';
import { ShieldIcon, SettingsIcon, LogoutIcon, KeyIcon, MenuIcon, CloseIcon } from './Icons';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenAddMember, 
  adminUser, 
  onOpenLoginModal, 
  onOpenSettings, 
  onLogout 
}) {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="header-container">
      {/* 1. Mobile Hamburger Button (On Left on Mobile) */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        title="Toggle Navigation Menu"
        aria-label="Toggle Navigation Menu"
      >
        {mobileMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
      </button>

      {/* 2. Brand Logo (Left on Desktop, Middle Title on Mobile) */}
      <div className="logo-brand" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
        <div className="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 6V18M17.5 6V18M3 9V15M21 9V15M6.5 12H17.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="logo-text">Fitness</span>
      </div>

      {/* 3. Desktop Floating Pill Nav Bar (Hidden on Mobile) */}
      <nav className="pill-nav">
        <button 
          className={`pill-item ${activeTab === 'home' ? 'active' : ''}`} 
          onClick={() => handleNavClick('home')}
        >
          Home
        </button>
        <span className="pill-dot">•</span>

        <button 
          className={`pill-item ${activeTab === 'about' ? 'active' : ''}`} 
          onClick={() => handleNavClick('about')}
        >
          About Us
        </button>

        {adminUser && (
          <>
            <span className="pill-dot">•</span>
            <button 
              className={`pill-item ${activeTab === 'members' ? 'active' : ''}`} 
              onClick={() => handleNavClick('members')}
            >
              Members
            </button>
          </>
        )}

        <span className="pill-dot">•</span>

        <button 
          className={`pill-item ${activeTab === 'equipment' ? 'active' : ''}`} 
          onClick={() => handleNavClick('equipment')}
        >
          Equipment
        </button>
      </nav>

      {/* 4. Right Side Actions / Login Button (Right on Desktop & Mobile) */}
      <div className="header-actions">
        {adminUser ? (
          <div style={{ position: 'relative' }}>
            <button
              className="btn-signup"
              onClick={() => setShowAdminMenu(!showAdminMenu)}
              style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                border: '1px solid rgba(255, 42, 61, 0.4)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <ShieldIcon size={16} color="#ff6b72" />
              <span className="header-admin-text">Admin</span>
              <span style={{ fontSize: '10px', opacity: 0.6 }}>▼</span>
            </button>

            {showAdminMenu && (
              <div 
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  background: '#16171d',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                  padding: '8px',
                  minWidth: '170px',
                  zIndex: 9999,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >

                <button
                  onClick={() => { setShowAdminMenu(false); onOpenSettings(); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.06)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <SettingsIcon size={15} />
                  <span>Admin Settings</span>
                </button>

                <button
                  onClick={() => { setShowAdminMenu(false); onLogout(); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f87171',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.15)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <LogoutIcon size={15} color="#f87171" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="btn-signup" 
            onClick={onOpenLoginModal}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <KeyIcon size={15} />
            <span>Admin Login</span>
          </button>
        )}
      </div>

      {/* 5. Mobile Slide-Down Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-dropdown">
          <button 
            className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button 
            className={`mobile-nav-item ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => handleNavClick('about')}
          >
            About Us
          </button>

          {adminUser && (
            <button 
              className={`mobile-nav-item ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => handleNavClick('members')}
            >
              Members
            </button>
          )}

          <button 
            className={`mobile-nav-item ${activeTab === 'equipment' ? 'active' : ''}`}
            onClick={() => handleNavClick('equipment')}
          >
            Equipment
          </button>
        </div>
      )}
    </header>
  );
}
