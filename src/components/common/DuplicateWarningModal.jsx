import React from 'react';
import { UserCheck, X, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export default function DuplicateWarningModal({ isOpen, onClose, duplicateMessage, email, phone }) {
  if (!isOpen) return null;

  return (
    <div className="admin-drawer-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="admin-drawer" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '460px', 
          padding: '28px', 
          height: 'auto', 
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          boxShadow: '0 20px 50px rgba(244, 63, 94, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '10px', borderRadius: '12px', color: 'var(--accent-rose)' }}>
              <ShieldAlert size={26} />
            </div>
            <div>
              <span style={{ background: 'rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                DUPLICATE REGISTRATION BLOCKED
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
                User Already Exists!
              </h3>
            </div>
          </div>
          <button type="button" className="btn-close-drawer" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'rgba(13, 18, 30, 0.9)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px' }}>
          <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '12px' }}>
            {duplicateMessage || `A registration with email "${email}" or phone number "${phone}" has already been submitted and paid for CampusShark Summit.`}
          </p>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {email && (
              <div>• Email Registered: <strong style={{ color: '#fff' }}>{email}</strong></div>
            )}
            {phone && (
              <div>• Phone Registered: <strong style={{ color: '#fff' }}>{phone}</strong></div>
            )}
          </div>
        </div>

        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="var(--accent-amber)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-amber)' }}>
            Each member can only register once per summit track to ensure fair seat allocation.
          </span>
        </div>

        <button 
          type="button" 
          className="btn-primary" 
          onClick={onClose}
          style={{ width: '100%', justifyContent: 'center', background: 'var(--accent-rose)', borderColor: 'var(--accent-rose)', padding: '12px', fontSize: '0.92rem' }}
        >
          <span>Understood, Modify Details</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
