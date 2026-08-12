import React, { useState } from 'react';
import { Lock, Mail, Key, X, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('admin@campusshark.in');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verify admin credentials
    if (email.trim().toLowerCase() === 'admin@campusshark.in' && password === 'admin123') {
      setErrorMsg('');
      onLoginSuccess({
        email: email,
        role: 'SuperAdmin',
        name: 'CampusShark Admin'
      });
    } else {
      setErrorMsg('Invalid email or password! Demo Credentials: admin@campusshark.in / admin123');
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@campusshark.in');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="admin-drawer-overlay" onClick={onClose}>
      <div 
        className="admin-drawer" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '440px', padding: '36px' }}
      >
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '10px', borderRadius: '12px', color: 'var(--accent)' }}>
              <Lock size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '800', color: '#fff' }}>
                Admin Portal Login
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Authenticate to manage coupons & event schedules
              </div>
            </div>
          </div>
          <button type="button" className="btn-close-drawer" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Credentials Quick Banner */}
        <div style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '0.82rem' }}>
          <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🔑 Demo Admin Credentials</span>
            <button 
              type="button"
              onClick={handleQuickFill}
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Fill Credentials
            </button>
          </div>
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Email: admin@campusshark.in <br />
            Password: admin123
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="gf-field-group" style={{ marginBottom: '18px' }}>
            <label className="gf-label">Admin Email Address</label>
            <div className="gf-input-wrapper">
              <Mail className="gf-input-icon" size={18} />
              <input
                type="email"
                className="gf-input"
                placeholder="admin@campusshark.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="gf-field-group" style={{ marginBottom: '24px' }}>
            <label className="gf-label">Admin Password</label>
            <div className="gf-input-wrapper">
              <Lock className="gf-input-icon" size={18} />
              <input
                type="password"
                className="gf-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div style={{ color: 'var(--accent-rose)', fontSize: '0.82rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
          >
            <Key size={18} />
            <span>Login to Admin Dashboard</span>
          </button>
        </form>
      </div>
    </div>
  );
}
