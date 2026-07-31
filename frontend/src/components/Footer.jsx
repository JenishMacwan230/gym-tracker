import React from 'react';

export default function Footer({ activeTab, setActiveTab }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content-container">
        
        {/* Brand & Subtitle */}
        <div className="footer-brand-col">
          <div className="footer-logo" onClick={() => setActiveTab && setActiveTab('home')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 6V18M17.5 6V18M3 9V15M21 9V15M6.5 12H17.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-text">Fitness</span>
          </div>
          <p className="footer-tagline">
            Empower your fitness journey with world-class facilities, personalized coaching, and elite equipment.
          </p>
        </div>

        {/* Quick Navigation Links */}
        <div className="footer-nav-links">
          <button className={`footer-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab && setActiveTab('home')}>
            Home
          </button>
          <span className="footer-dot">•</span>
          <button className={`footer-link ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab && setActiveTab('about')}>
            About Us
          </button>
          <span className="footer-dot">•</span>
          <button className={`footer-link ${activeTab === 'equipment' ? 'active' : ''}`} onClick={() => setActiveTab && setActiveTab('equipment')}>
            Equipment
          </button>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <span>© {currentYear} Fitness. All rights reserved.</span>
          <span className="footer-motto">Built for Champions • Operating 24/7</span>
        </div>
      </div>
    </footer>
  );
}
