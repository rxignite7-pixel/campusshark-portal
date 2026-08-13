import React from 'react';
import { Users, Award, Sparkles, ShieldCheck } from 'lucide-react';

export default function TeamGallerySection() {
  return (
    <section className="schedule-section" style={{ paddingTop: 0, paddingBottom: '48px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '6px 16px', borderRadius: '20px', color: 'var(--accent-amber)', fontSize: '0.82rem', fontWeight: '800', marginBottom: '12px' }}>
          <Sparkles size={14} /> E-CELL LEADERSHIP & MENTORS
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
          Meet the CampusShark Organizing Team
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
          The visionary student leaders, innovation mentors, and summit organizers empowering the next generation of college founders.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        {/* Team Photo Card 1 */}
        <div 
          style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.3s ease, border-color 0.3s ease'
          }}
          className="team-photo-card"
        >
          <div style={{ overflow: 'hidden', height: '260px', position: 'relative' }}>
            <img 
              src="/bg-slide1.png" 
              alt="CampusShark Core E-Cell Team" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'transform 0.5s ease' }}
              className="gallery-img"
            />
            <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(13, 18, 30, 0.85)', backdropFilter: 'blur(8px)', color: 'var(--accent-emerald)', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', fontWeight: '800', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} /> Executive Board
            </span>
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Users size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                Core E-Cell Executive Team
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              Leading operations, venture partnerships, track curation, and summit logistics across national campus chapters.
            </p>
          </div>
        </div>

        {/* Team Photo Card 2 */}
        <div 
          style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)', 
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.3s ease, border-color 0.3s ease'
          }}
          className="team-photo-card"
        >
          <div style={{ overflow: 'hidden', height: '260px', position: 'relative' }}>
            <img 
              src="/bg-slide2.jpg" 
              alt="CampusShark Summit Advisory & Mentors" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'transform 0.5s ease' }}
              className="gallery-img"
            />
            <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(13, 18, 30, 0.85)', backdropFilter: 'blur(8px)', color: 'var(--accent-amber)', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', fontWeight: '800', border: '1px solid rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={12} /> Advisory Council
            </span>
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Users size={18} color="var(--accent-amber)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                Organizing Panel & Faculty Mentors
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              Incubation directors, faculty coordinators, and student mentor leads overseeing ₹10 Lakhs pitch evaluation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
