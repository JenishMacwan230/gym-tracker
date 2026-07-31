import React, { useState } from 'react';
import { 
  EditIcon, MailIcon, UserIcon, TagIcon, MessageIcon, SendIcon, 
  MapPinIcon, ClockIcon, KeyIcon, PhoneIcon, MapIcon, CheckIcon 
} from '../Icons';

export default function AboutContactLocation({ locationData, contactData, adminUser, onEditLocation }) {
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    subject: 'Membership Inquiry',
    message: ''
  });
  const [messageSubmitted, setMessageSubmitted] = useState(false);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (inquiryForm.name && inquiryForm.email) {
      setMessageSubmitted(true);
      setTimeout(() => {
        setMessageSubmitted(false);
        setInquiryForm({ name: '', email: '', subject: 'Membership Inquiry', message: '' });
      }, 5000);
    }
  };

  return (
    <section className="top-contact-location-section">
      <div className="top-grid-container">
        
        {/* Visually Premium Contact Form */}
        <div className="contact-card-premium">
          <div className="contact-card-header">
            <div className="contact-header-icon">
              <MailIcon size={22} color="#ff6b72" />
            </div>
            <div>
              <h2 className="contact-card-title">{contactData?.heading || 'Contact Owner & Schedule a Tour'}</h2>
              <p className="contact-card-subtitle">{contactData?.subheading || 'Send a message directly to Marcus Sterling.'}</p>
            </div>
          </div>

          {messageSubmitted ? (
            <div className="inquiry-success-banner">
              <div className="success-icon-circle">
                <CheckIcon size={20} color="#4ade80" />
              </div>
              <div>
                <h4>Message Sent Successfully!</h4>
                <p>Thank you for reaching out. Marcus Sterling will respond to your inquiry within 24 hours.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="premium-contact-form">
              <div className="form-row-2">
                <div className="premium-field-group">
                  <label className="field-label">Full Name</label>
                  <div className="field-input-wrapper">
                    <span className="input-icon">
                      <UserIcon size={16} color="var(--text-muted)" />
                    </span>
                    <input 
                      type="text" 
                      placeholder="e.g. Alex Morgan" 
                      className="premium-input"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="premium-field-group">
                  <label className="field-label">Email Address</label>
                  <div className="field-input-wrapper">
                    <span className="input-icon">
                      <MailIcon size={16} color="var(--text-muted)" />
                    </span>
                    <input 
                      type="email" 
                      placeholder="name@example.com" 
                      className="premium-input"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="premium-field-group">
                <label className="field-label">Inquiry Topic</label>
                <div className="field-input-wrapper">
                  <span className="input-icon">
                    <TagIcon size={16} color="var(--text-muted)" />
                  </span>
                  <select 
                    className="premium-input premium-select"
                    value={inquiryForm.subject}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                  >
                    <option value="Membership Inquiry">Membership & Pricing Inquiry</option>
                    <option value="Personal Coaching">1-on-1 Personal Training</option>
                    <option value="Facility Tour">Schedule a Facility Tour</option>
                    <option value="General Question">General Question for Owner</option>
                  </select>
                </div>
              </div>

              <div className="premium-field-group">
                <label className="field-label">Your Message</label>
                <div className="field-input-wrapper">
                  <span className="input-icon textarea-icon">
                    <MessageIcon size={16} color="var(--text-muted)" />
                  </span>
                  <textarea 
                    placeholder="Tell us about your fitness goals or questions..." 
                    className="premium-input premium-textarea"
                    rows="4"
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-contact-submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <SendIcon size={16} color="#ffffff" />
                <span>Send Message to Owner</span>
              </button>
            </form>
          )}
        </div>

        {/* Gym Address & Operating Hours Card */}
        <div className="location-card" style={{ position: 'relative' }}>
          {adminUser && (
            <button 
              className="pill-action-btn section-edit-floating-btn"
              onClick={onEditLocation}
              title="Edit Location & Operating Hours"
            >
              <EditIcon size={14} />
              <span>Edit Location</span>
            </button>
          )}

          <div className="loc-card-header">
            <div className="loc-icon">
              <MapPinIcon size={22} color="#ff6b72" />
            </div>
            <div>
              <h3 className="loc-card-title">{locationData?.gymName || 'Titan Fitness Headquarters'}</h3>
              <p className="loc-card-sub">Conveniently located in Metro City Central district</p>
            </div>
          </div>

          <div className="address-box">
            <div className="address-line-main">{locationData?.gymName}</div>
            <div className="address-line-sub">{locationData?.streetAddress}</div>
            <div className="address-line-sub">{locationData?.suiteCity}</div>
            {locationData?.landmark && (
              <div className="address-landmark">Landmark: {locationData?.landmark}</div>
            )}
          </div>

          <div className="hours-container">
            <h4 className="hours-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ClockIcon size={15} color="#ff6b72" />
              <span>Operating Hours</span>
            </h4>
            <div className="hours-list">
              <div className="hours-row">
                <span>Monday – Friday</span>
                <span className="hours-val">{locationData?.hours?.weekday}</span>
              </div>
              <div className="hours-row">
                <span>Saturday</span>
                <span className="hours-val">{locationData?.hours?.saturday}</span>
              </div>
              <div className="hours-row">
                <span>Sunday</span>
                <span className="hours-val">{locationData?.hours?.sunday}</span>
              </div>
              <div className="hours-vip-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <KeyIcon size={14} color="#4ade80" />
                  <span>VIP Keycard Members</span>
                </span>
                <span className="vip-badge">{locationData?.hours?.vipNote}</span>
              </div>
            </div>
          </div>

          <div className="contact-quick-list">
            {locationData?.phoneFrontDesk && (
              <div className="quick-item">
                <PhoneIcon size={14} color="var(--text-muted)" />
                <span>Front Desk:</span>
                <strong>{locationData?.phoneFrontDesk}</strong>
              </div>
            )}
            {locationData?.phoneWhatsapp && (
              <div className="quick-item">
                <MessageIcon size={14} color="var(--text-muted)" />
                <span>WhatsApp:</span>
                <strong>{locationData?.phoneWhatsapp}</strong>
              </div>
            )}
            {locationData?.email && (
              <div className="quick-item">
                <MailIcon size={14} color="var(--text-muted)" />
                <span>Email:</span>
                <strong>{locationData?.email}</strong>
              </div>
            )}
          </div>

          <a 
            href={locationData?.googleMapsUrl || 'https://maps.google.com'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary btn-directions"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <MapIcon size={16} color="#ffffff" />
            <span>Open in Google Maps & Get Directions</span>
          </a>
        </div>

      </div>
    </section>
  );
}
