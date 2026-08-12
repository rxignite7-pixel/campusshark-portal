import React from 'react';
import { Clock, Calendar, Sparkles, Award } from 'lucide-react';

export default function ScheduleSection({ scheduleCards = [] }) {
  if (!scheduleCards || scheduleCards.length === 0) return null;

  return (
    <section style={{ marginTop: '70px', marginBottom: '60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="hero-pill" style={{ marginBottom: '12px' }}>
          <Sparkles size={14} color="var(--accent-amber)" />
          <span>OFFICIAL EVENT TIMELINE</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: '800', color: '#fff' }}>
          Live Event Schedule & Sessions
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '650px', margin: '8px auto 0 auto' }}>
          Explore the official summit timetable managed in real-time by the CampusShark Admin Dashboard.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {scheduleCards.map((card, idx) => (
          <div
            key={card.id || idx}
            className="stat-card"
            style={{
              padding: '28px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(20, 26, 44, 0.8)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animation: `fadeInUp 0.6s ease ${idx * 0.1}s both`
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>
                  {card.tag || 'Summit Track'}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '0.82rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                  <Clock size={14} />
                  <span>{card.time}</span>
                </div>
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '700', color: '#fff', marginBottom: '10px', lineHeight: '1.3' }}>
                {card.title}
              </h3>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {card.description}
              </p>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              <span>Session #{idx + 1}</span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: '600' }}>✓ Confirmed Schedule</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
