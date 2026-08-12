import React from 'react';
import { User, Phone, Mail, MapPin, Trash2, AlertCircle, Code } from 'lucide-react';

const ROLE_OPTIONS = ['FullStack Dev', 'AI/ML Specialist', 'UI/UX Designer', 'DevOps & Cloud'];

export default function MemberCard({ index, member, errors, onChange, onRemove, canRemove }) {
  return (
    <div className="gf-card">
      <div className="member-card-header">
        <span className="member-badge">
          <User size={14} /> Team Member #{index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            className="btn-remove-member"
            onClick={() => onRemove(index)}
          >
            <Trash2 size={14} /> Remove Member
          </button>
        )}
      </div>

      <div className="form-grid-2">
        <div className="gf-field-group">
          <label className="gf-label">
            Member Full Name <span className="req">*</span>
          </label>
          <div className="gf-input-wrapper">
            <User className="gf-input-icon" size={18} />
            <input
              type="text"
              className={`gf-input ${errors[`member_${index}_name`] ? 'gf-input-error' : ''}`}
              placeholder="e.g. Sarah Jenkins"
              value={member.name}
              onChange={(e) => onChange(index, 'name', e.target.value)}
            />
          </div>
          {errors[`member_${index}_name`] && (
            <div className="gf-error-msg"><AlertCircle size={14} /> {errors[`member_${index}_name`]}</div>
          )}
        </div>

        <div className="gf-field-group">
          <label className="gf-label">
            Phone Number <span className="req">*</span>
          </label>
          <div className="gf-input-wrapper">
            <Phone className="gf-input-icon" size={18} />
            <input
              type="tel"
              className={`gf-input ${errors[`member_${index}_phone`] ? 'gf-input-error' : ''}`}
              placeholder="e.g. +1 (555) 987-6543"
              value={member.phone}
              onChange={(e) => onChange(index, 'phone', e.target.value)}
            />
          </div>
          {errors[`member_${index}_phone`] && (
            <div className="gf-error-msg"><AlertCircle size={14} /> {errors[`member_${index}_phone`]}</div>
          )}
        </div>
      </div>

      <div className="form-grid-2">
        <div className="gf-field-group">
          <label className="gf-label">
            Email Address <span className="req">*</span>
          </label>
          <div className="gf-input-wrapper">
            <Mail className="gf-input-icon" size={18} />
            <input
              type="email"
              className={`gf-input ${errors[`member_${index}_email`] ? 'gf-input-error' : ''}`}
              placeholder="e.g. sarah@example.com"
              value={member.email}
              onChange={(e) => onChange(index, 'email', e.target.value)}
            />
          </div>
          {errors[`member_${index}_email`] && (
            <div className="gf-error-msg"><AlertCircle size={14} /> {errors[`member_${index}_email`]}</div>
          )}
        </div>

        <div className="gf-field-group">
          <label className="gf-label">
            City / Location <span className="req">*</span>
          </label>
          <div className="gf-input-wrapper">
            <MapPin className="gf-input-icon" size={18} />
            <input
              type="text"
              className={`gf-input ${errors[`member_${index}_city`] ? 'gf-input-error' : ''}`}
              placeholder="e.g. Seattle, WA"
              value={member.city}
              onChange={(e) => onChange(index, 'city', e.target.value)}
            />
          </div>
          {errors[`member_${index}_city`] && (
            <div className="gf-error-msg"><AlertCircle size={14} /> {errors[`member_${index}_city`]}</div>
          )}
        </div>
      </div>

      {/* Member Role Chips */}
      <div style={{ marginTop: '12px' }}>
        <label className="gf-label" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Member Specialization / Role
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
          {ROLE_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onChange(index, 'role', r)}
              style={{
                background: member.role === r ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${member.role === r ? 'var(--primary)' : 'var(--border-light)'}`,
                color: member.role === r ? '#fff' : 'var(--text-muted)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
