import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { CheckCircle2, Printer, RefreshCw, Calendar, Tag, Award, Rocket, FileText } from 'lucide-react';

export default function TicketPass({ teamData, selectedEvent, appliedCoupon, onReset }) {
  const qrCanvasRef = useRef(null);
  const ticketId = useRef(`CSHARK2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`).current;

  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti error:', e);
    }

    // Render Canvas QR Code
    if (qrCanvasRef.current) {
      const qrPayload = JSON.stringify({
        ticketId: ticketId,
        memberName: teamData.fullName,
        startupName: teamData.startupName,
        sector: teamData.sector,
        stage: teamData.stage,
        event: selectedEvent.title,
        couponApplied: appliedCoupon ? appliedCoupon.code : 'NONE',
        pitchDeckAttached: !!teamData.pitchDeckName,
        currency: 'INR'
      });

      QRCode.toCanvas(qrCanvasRef.current, qrPayload, {
        width: 140,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      }, (err) => {
        if (err) console.error('QR code generation error:', err);
      });
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ticket-container">
      <div className="celebration-header">
        <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', color: 'var(--accent-emerald)', marginBottom: '16px' }}>
          <CheckCircle2 size={42} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
          Member Registration Confirmed!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Your individual holographic entry pass for <strong>{selectedEvent.title}</strong> is active.
        </p>
      </div>

      {/* Digital Holographic Pass Card */}
      <div className="ticket-pass-card">
        <div className="ticket-header">
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={14} color="var(--accent-amber)" /> CAMPUSSHARK MEMBER PASS
            </div>
            <div className="ticket-event-title">{selectedEvent.title}</div>
          </div>
          <span className="ticket-pass-type">
            {appliedCoupon ? `${appliedCoupon.code} VIP PASS` : 'MEMBER PASS'}
          </span>
        </div>

        <div className="ticket-body">
          <div className="ticket-details">
            <div className="detail-block">
              <label>Member Name & Contact</label>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
                {teamData.fullName}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {teamData.email} • {teamData.phone} • {teamData.city}
              </div>
            </div>

            <div className="detail-block">
              <label>Startup Profile</label>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Rocket size={16} /> {teamData.startupName}
              </div>
              <div className="members-pill-list" style={{ marginTop: '6px' }}>
                <span className="member-chip" style={{ borderColor: 'var(--primary)', color: '#fff', fontWeight: '700' }}>
                  Sector: {teamData.sector}
                </span>
                <span className="member-chip">
                  Stage: {teamData.stage}
                </span>
                {teamData.website && (
                  <span className="member-chip" style={{ color: 'var(--accent-cyan)' }}>
                    🌐 {teamData.website}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginTop: '8px', flexWrap: 'wrap' }}>
              <div className="detail-block">
                <label>Pitch Deck Status</label>
                <div style={{ fontSize: '0.88rem', color: 'var(--accent-emerald)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={14} />
                  <span>{teamData.pitchDeckName || 'Uploaded & Verified'}</span>
                </div>
              </div>

              <div className="detail-block">
                <label>Date & Venue</label>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="var(--primary)" />
                  <span>{selectedEvent.date}</span>
                </div>
              </div>

              {appliedCoupon && (
                <div className="detail-block">
                  <label>Applied Admin Promo</label>
                  <div style={{ fontSize: '0.88rem', color: 'var(--accent-emerald)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={14} />
                    <span>{appliedCoupon.code} ({appliedCoupon.badge})</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Section */}
          <div className="ticket-qr-section">
            <canvas ref={qrCanvasRef} className="qr-canvas" />
            <div className="ticket-id">{ticketId}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Scan at Venue Gate
            </div>
          </div>
        </div>
      </div>

      <div className="ticket-actions">
        <button type="button" className="btn-primary" onClick={handlePrint}>
          <Printer size={18} />
          <span>Print / Save Pass (PDF)</span>
        </button>

        <button type="button" className="btn-secondary" onClick={onReset}>
          <RefreshCw size={16} />
          <span>Register Another Member</span>
        </button>
      </div>
    </div>
  );
}
