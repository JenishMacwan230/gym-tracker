import React from 'react';
import heroImg from '../assets/hero_athlete.png';

export default function HeroSection({ onExploreServices, onStartScheduling }) {
  return (
    <section className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">
          Start Training <br />
          Today
        </h1>
        
        <p className="hero-description">
          Empower your fitness journey with personalized training programs, world-class equipment, and a seamless gym experience built for your goals.
        </p>

        <div className="hero-cta-group">
          <button className="btn-primary-red" onClick={onExploreServices}>
            <span>Our Services</span>
            <div className="cta-arrow-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </button>

          <a href="#services" className="link-secondary" onClick={(e) => { e.preventDefault(); onStartScheduling(); }}>
            Start Scheduling
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="athlete-card">
          <img 
            src={heroImg} 
            alt="Fitness Trainer" 
            className="athlete-img" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/hero_athlete.png";
            }}
          />
        </div>
      </div>
    </section>
  );
}
