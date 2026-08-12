import React from 'react';
import { Users, Trophy, ArrowRight, Zap, Globe, Sparkles } from 'lucide-react';

export default function LandingHero({ onStartRegistration }) {
  return (
    <section className="hero-section">
      {/* Top Oval Horizontal Pill */}
      <div className="hero-pill">
        <span className="dot"></span>
        <Sparkles size={15} color="var(--accent-cyan)" />
        <span>E-CELL NATIONAL INNOVATION SUMMIT 2026 • REGISTRATION OPEN</span>
      </div>

      {/* Main Title in ONE SINGLE LINE */}
      <h1 className="hero-title single-line-title">
        CampusShark E-Cell Flagship Event 2026
      </h1>

      {/* High-Energy Startup Subtitle */}
      <p className="hero-subtitle" style={{ fontSize: '1.25rem', color: '#e2e8f0', fontWeight: '500', maxWidth: '780px' }}>
        Turn your wild ideas into venture-backed realities! Pitch live to top VCs, build game-changing tech prototypes, battle for <strong style={{ color: 'var(--accent-amber)' }}>₹10 Lakhs in equity-free cash grants</strong>, and launch your startup at India's ultimate campus battleground.
      </p>

      <div className="hero-actions">
        <button className="btn-primary" onClick={onStartRegistration} style={{ cursor: 'pointer' }}>
          <span>Launch Your Startup Team</span>
          <ArrowRight size={22} />
        </button>
      </div>

      {/* 4 Feature Stat Cards in ONE HORIZONTAL LINE */}
      <div className="hero-stats">
        <div className="stat-card">
          <div style={{ color: 'var(--primary)', marginBottom: '8px' }}>
            <Users size={24} />
          </div>
          <div className="stat-val">5,000+</div>
          <div className="stat-label">Founders & Innovators</div>
        </div>

        <div className="stat-card">
          <div style={{ color: 'var(--accent-amber)', marginBottom: '8px' }}>
            <Trophy size={24} />
          </div>
          <div className="stat-val">₹10 Lakhs+</div>
          <div className="stat-label">Equity-Free Grants</div>
        </div>

        <div className="stat-card">
          <div style={{ color: 'var(--accent-emerald)', marginBottom: '8px' }}>
            <Globe size={24} />
          </div>
          <div className="stat-val">40+</div>
          <div className="stat-label">Top VC & Angel Partners</div>
        </div>

        <div className="stat-card">
          <div style={{ color: 'var(--accent)', marginBottom: '8px' }}>
            <Zap size={24} />
          </div>
          <div className="stat-val">100%</div>
          <div className="stat-label">Admin Promo Grants</div>
        </div>
      </div>
    </section>
  );
}
