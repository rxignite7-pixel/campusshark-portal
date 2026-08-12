import React, { useState } from 'react';
import { Key, Mail, Lock, X, ShieldAlert, Sparkles } from 'lucide-react';
import { adminLoginAPI } from '../../config/api';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('admin@campusshark.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFillCredentials = () => {
    setEmail('admin@campusshark.in');
    setPassword('admin123');
    setError('');
  };

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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

        {/* Quick Credentials Auto-Fill Button */}
        <div style={{ marginBottom: '18px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', fontWeight: '700' }}>Demo Credentials Ready</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>admin@campusshark.in / admin123</div>
          </div>
          <button
            type="button"
            onClick={handleFillCredentials}
            style={{ background: 'var(--accent-amber)', color: '#000', border: 'none', padding: '4px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Sparkles size={12} /> Auto-Fill
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
                placeholder="admin@campusshark.in"
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
                placeholder="••••••••"
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
