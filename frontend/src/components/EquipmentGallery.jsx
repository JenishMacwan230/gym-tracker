import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ServiceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const CategoryIcon = ({ category }) => {
  switch ((category || '').toLowerCase()) {
    case 'cardio':
      return <span style={{ fontSize: '32px' }}>🏃</span>;
    case 'strength':
    case 'free weights':
      return <span style={{ fontSize: '32px' }}>🏋️</span>;
    case 'functional':
      return <span style={{ fontSize: '32px' }}>⚡</span>;
    case 'recovery':
      return <span style={{ fontSize: '32px' }}>🧘</span>;
    default:
      return <span style={{ fontSize: '32px' }}>⚙️</span>;
  }
};

export const BentoCard = ({ item, isSpanTwo, onEdit, onServiceDone, onDelete, adminUser }) => {
  const [imgError, setImgError] = useState(false);

  const hasValidImage = item.imageUrl && !imgError;

  return (
    <motion.div
      className={`bento-card-item ${isSpanTwo ? 'bento-card-span-2' : ''}`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      {/* Background Image or Stylish Category Gradient Placeholder */}
      {hasValidImage ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="bento-card-bg-img"
          onError={() => setImgError(true)}
        />
      ) : (
        <div 
          className="bento-card-bg-img"
          style={{
            background: 'linear-gradient(135deg, #1f222e 0%, #111218 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.85
          }}
        >
          <div style={{ textAlign: 'center', opacity: 0.35, transform: 'scale(1.4)' }}>
            <CategoryIcon category={item.category} />
          </div>
        </div>
      )}

      {/* Gradient Dark Overlay */}
      <div className="bento-card-overlay-gradient" />

      {/* Top Action Header Bar */}
      <div className="bento-card-header-bar">
        <span className={`badge ${item.needsService ? 'badge-warning' : 'badge-success'}`}>
          <span className="badge-dot" />
          {item.needsService ? 'Service Due' : 'Operational'}
        </span>

        {adminUser && (
          <div className="bento-actions-group">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onServiceDone(item._id, item.name, item.needsService); }}
              className={`bento-icon-btn service ${item.needsService ? 'due' : ''}`}
              title={item.needsService ? "Click to mark as Operational" : "Click to mark as Service Due"}
            >
              <ServiceIcon />
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit(item); }}
              className="bento-icon-btn"
              title="Edit Equipment Details"
            >
              <EditIcon />
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(item._id, item.name); }}
              className="bento-icon-btn delete"
              title="Delete Equipment Machine"
            >
              <DeleteIcon />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Information Content */}
      <div className="bento-card-body-content">
        <div className="bento-tag-row">
          <span className="bento-category-tag">
            {item.category || 'Strength'}
          </span>
          <span className="bento-location-text">📍 {item.location || 'Main Floor'}</span>
        </div>

        <h3 className="bento-card-title">
          {item.name}
        </h3>

        <div className="bento-meta-footer">
          <div className="bento-meta-col">
            <span className="bento-meta-label">LAST SERVICED</span>
            <span className="bento-meta-value">
              {item.lastServiced ? new Date(item.lastServiced).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          <div className="bento-meta-col text-right">
            <span className="bento-meta-label">SERVICE INTERVAL</span>
            <span className="bento-meta-value highlight">
              Every {item.serviceIntervalDays || 90}d
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function EquipmentGallery({ items = [], onEdit, onServiceDone, onDelete, adminUser }) {
  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🏋️</div>
        <h3>No equipment found</h3>
        <p>Log a new equipment machine to get started.</p>
      </div>
    );
  }

  return (
    <div className="bento-container">
      <div className="bento-grid-wrapper">
        {items.map((item, idx) => {
          const isSpanTwo = idx % 5 === 0 || idx % 5 === 3;
          return (
            <BentoCard
              key={item._id || item.id || idx}
              item={item}
              isSpanTwo={isSpanTwo}
              onEdit={onEdit}
              onServiceDone={onServiceDone}
              onDelete={onDelete}
              adminUser={adminUser}
            />
          );
        })}
      </div>
    </div>
  );
}
