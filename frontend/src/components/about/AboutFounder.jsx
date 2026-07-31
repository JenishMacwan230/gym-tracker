import React from 'react';
import { EditIcon, CheckIcon, MailIcon, PhoneIcon } from '../Icons';

export default function AboutFounder({ founderData, adminUser, onEditFounder }) {
  return (
    <section className="owner-section" style={{ position: 'relative' }}>
      <div className="section-header-tag">MEET THE FOUNDER</div>
      
      <div className="owner-card" style={{ position: 'relative' }}>
        {adminUser && (
          <button 
            className="pill-action-btn section-edit-floating-btn"
            onClick={onEditFounder}
            title="Edit Founder Profile"
          >
            <EditIcon size={14} />
            <span>Edit Founder</span>
          </button>
        )}

        <div className="owner-image-wrapper">
          <img 
            src={founderData?.imageUrl || '/about/owner.png'} 
            alt={founderData?.name || 'Gym Owner'} 
            className="owner-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop';
            }}
          />
          <div className="owner-experience-badge">
            <span className="exp-num">{founderData?.experienceYears || '15+'}</span>
            <span className="exp-lbl">Years Experience</span>
          </div>
        </div>

        <div className="owner-info">
          <div className="owner-role">{founderData?.role || 'FOUNDER & HEAD COACH'}</div>
          <h2 className="owner-name">{founderData?.name || 'Marcus Sterling'}</h2>
          
          <p className="owner-bio">{founderData?.bio}</p>

          <div className="owner-credentials">
            <h3>Certifications & Credentials</h3>
            <ul className="credentials-grid">
              {(founderData?.credentials || []).map((cred, i) => (
                <li key={i}>
                  <CheckIcon size={14} color="#4ade80" />
                  <span>{cred}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="owner-contact-row">
            {founderData?.email && (
              <div className="contact-item">
                <MailIcon size={16} color="var(--text-muted)" />
                <div>
                  <span className="contact-lbl">Direct Email</span>
                  <a href={`mailto:${founderData?.email}`} className="contact-val">{founderData?.email}</a>
                </div>
              </div>
            )}
            {founderData?.phone && (
              <div className="contact-item">
                <PhoneIcon size={16} color="var(--text-muted)" />
                <div>
                  <span className="contact-lbl">Direct Phone</span>
                  <span className="contact-val">{founderData?.phone}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
