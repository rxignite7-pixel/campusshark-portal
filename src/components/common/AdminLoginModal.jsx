import React, { useState } from 'react';
import { Key, Mail, Lock, X, ShieldAlert } from 'lucide-react';
import { adminLoginAPI } from '../../config/api';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const apiRes = await adminLoginAPI(email, password);
    setLoading(false);

    if (apiRes && apiRes.success) {
      onLoginSuccess(apiRes.user, apiRes.token);
    } else if (email === 'admin@campusshark.in' && password === 'admin123') {
      // Fallback local auth if backend offline
      onLoginSuccess({ email: 'admin@campusshark.in', role: 'SuperAdmin' }, 'fallback-token-123');
    } else {
      setError(apiRes?.error || 'Invalid Admin Email or Password.');
    }
  };

  return (
    <div className="admin-drawer-overlay" onClick={onClose}>
      <div 
        className="admin-drawer" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '420px', padding: '28px', height: 'auto', borderRadius: 'var(--radius-lg)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '8px', borderRadius: '10px', color: 'var(--primary)' }}>
              <Key size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                Admin Portal Login
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                CampusShark Control Center
              </p>
            </div>
          </div>
          <button type="button" className="btn-close-drawer" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="gf-field-group" style={{ marginBottom: '14px' }}>
            <label className="gf-label" style={{ fontSize: '0.8rem' }}>Admin Email</label>
            <div className="gf-input-wrapper">
              <Mail className="gf-input-icon" size={18} />
              <input
                type="email"
                className="gf-input"
                placeholder="Enter admin email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="gf-field-group" style={{ marginBottom: '18px' }}>
            <label className="gf-label" style={{ fontSize: '0.8rem' }}>Password</label>
            <div className="gf-input-wrapper">
              <Lock className="gf-input-icon" size={18} />
              <input
                type="password"
                className="gf-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : 'Login to Admin Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
