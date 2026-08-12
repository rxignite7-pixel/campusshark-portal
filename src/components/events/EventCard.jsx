import React from 'react';
import { Calendar, MapPin, CheckCircle, Award } from 'lucide-react';

export default function EventCard({ evt, isSelected, onSelect }) {
  return (
    <div
      className={`event-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{
        borderColor: evt.isFlagship && !isSelected ? 'rgba(245, 158, 11, 0.4)' : undefined,
        background: evt.isFlagship && !isSelected ? 'rgba(30, 24, 40, 0.85)' : undefined
      }}
    >
      <div className="event-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="event-tag" style={{ background: evt.isFlagship ? 'rgba(245, 158, 11, 0.2)' : undefined, color: evt.isFlagship ? 'var(--accent-amber)' : undefined }}>
            {evt.tag}
          </span>
          {evt.isFlagship && (
            <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={12} /> FLAGSHIP
            </span>
          )}
        </div>
        <div className="event-price">
          ₹{evt.pricePerMember.toLocaleString('en-IN')} <span>/ member</span>
        </div>
      </div>

      <h3 className="event-name" style={{ fontSize: evt.isFlagship ? '1.35rem' : undefined }}>{evt.title}</h3>
      <p className="event-desc">{evt.description}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {evt.highlights.map((h, i) => (
          <span key={i} style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-main)', fontSize: '0.78rem', padding: '4px 10px', borderRadius: '4px' }}>
            ✓ {h}
          </span>
        ))}
      </div>

      <div className="event-meta">
        <div className="meta-item">
          <Calendar size={14} color="var(--primary)" />
          <span>{evt.date}</span>
        </div>
        <div className="meta-item">
          <MapPin size={14} color="var(--accent-cyan)" />
          <span>{evt.location}</span>
        </div>
      </div>

      {isSelected && (
        <div style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--primary)' }}>
          <CheckCircle size={24} />
        </div>
      )}
    </div>
  );
}
