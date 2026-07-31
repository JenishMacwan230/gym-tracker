import React, { useState } from 'react';

export default function ProgramsSection({ onSelectProgram }) {
  const [scrollIndex, setScrollIndex] = useState(0);

  const programs = [
    {
      id: 'yoga',
      title: 'Yoga',
      description: 'Enjoy yoga Classes for all levels, body elastic, body weight workouts barre pilates, and more',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v5l3 3M9 10l3 2" />
          <path d="M5 20c3-2 6-2 9 0M2 17c4-2 9-2 13 0" />
        </svg>
      )
    },
    {
      id: 'muscles',
      title: 'Muscles',
      description: 'Your trainer will prepare and show you a workout regime designed to meet your fitness level and goals.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 10h-2V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2z"/>
          <path d="M6 9h4v6H6z"/>
        </svg>
      )
    },
    {
      id: 'fitness',
      title: 'Fitness',
      description: 'Regular strength training improves the health of your bones, muscles, and connective tissue.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
    },
    {
      id: 'strength',
      title: 'Strength',
      description: 'Custom weightlifting programs, powerlifting form coaching, and progressive resistance training.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 6V18M17.5 6V18M3 9V15M21 9V15M6.5 12H17.5" />
        </svg>
      )
    }
  ];

  const handleNext = () => {
    setScrollIndex((prev) => (prev + 1) % programs.length);
  };

  return (
    <section id="services" className="programs-container">
      <div className="programs-header">
        <h2 className="section-title">
          Training Programs <span className="serif-highlight">We Offer For You</span>
        </h2>
        <p className="section-subtitle">
          Explore our tailored fitness tracks designed to push your boundaries, build strength, and foster long-term health.
        </p>
      </div>

      <div className="carousel-wrapper">
        <div className="programs-grid">
          {programs.map((item, index) => (
            <div 
              key={item.id} 
              className={`program-card ${index === scrollIndex ? 'featured' : ''}`}
              onClick={() => onSelectProgram && onSelectProgram(item.id)}
            >
              <div className="card-icon-badge">
                {item.icon}
              </div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Floating Carousel Next Button */}
        <button className="carousel-arrow-btn" onClick={handleNext} title="Next Program">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
}
