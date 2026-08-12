import React, { useState } from 'react';
import EventCard from './EventCard';
import { Tag, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, XCircle, Key, CheckCircle, Rocket, FileText } from 'lucide-react';

export default function EventCouponSelection({ 
  teamData, 
  selectedEvent, 
  eventsList = [],
  appliedCoupon, 
  adminCoupons = [], 
  onSelectEvent, 
  onApplyCoupon, 
  onBack, 
  onCompleteRegistration, 
  onOpenAdminDrawer 
}) {
  const [couponInput, setCouponInput] = useState(appliedCoupon ? appliedCoupon.code : '');
  const [couponError, setCouponError] = useState('');

  const activeEvent = selectedEvent || eventsList[0] || {};
  const founderName = teamData?.fullName || 'Jordan Taylor';
  const startupName = teamData?.startupName || 'CampusShark Startup';

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter an admin coupon code.');
      return;
    }

    // Check against coupons issued from Admin Dashboard
    const foundCoupon = adminCoupons.find(c => {
      if (c.code !== code) return false;
      return c.eventId === 'ALL' || c.eventId === activeEvent.id;
    });

    if (foundCoupon) {
      setCouponError('');
      onApplyCoupon(foundCoupon);
    } else {
      setCouponError(`Code "${code}" is invalid or not applicable for this event.`);
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  // Calculation Math for Individual Founder in INR (₹)
  const basePricePerPerson = activeEvent.pricePerMember || 250;
  const subtotal = basePricePerPerson; // 1 Founder
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discount) / 100;
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = Math.min(subtotal, appliedCoupon.discount);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Available coupons applicable for this specific selected event
  const applicableAdminCoupons = adminCoupons.filter(
    c => c.eventId === 'ALL' || c.eventId === activeEvent.id
  );

  return (
    <div className="selection-layout">
      {/* Left Column: Events Grid */}
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h2 className="section-heading">Select Event Track</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Select the official summit track for <strong>"{startupName}"</strong> (Founder: {founderName}).
          </p>
        </div>

        <div className="events-grid">
          {eventsList.map((evt) => (
            <EventCard
              key={evt.id}
              evt={evt}
              isSelected={activeEvent.id === evt.id}
              onSelect={() => onSelectEvent(evt)}
            />
          ))}
        </div>
      </div>

      {/* Right Column: Clean, Structured Registration Summary & Admin Coupon Box */}
      <div className="summary-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--primary)" />
            <span>Registration Summary</span>
          </h3>
          <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Rocket size={12} /> Individual Founder
          </span>
        </div>

        {/* Startup Overview Pill */}
        <div className="summary-team-pill" style={{ marginBottom: '20px' }}>
          <div className="team-pill-name">{startupName}</div>
          <div className="team-pill-sub">
            Founder: {founderName} ({teamData?.city || 'India'})
          </div>
          <div className="team-pill-sub" style={{ marginTop: '2px' }}>
            Sector: <strong style={{ color: '#fff' }}>{teamData?.sector || 'AI/SaaS'}</strong> • Stage: {teamData?.stage || 'Prototype'}
          </div>
          {teamData?.pitchDeckName && (
            <div className="team-pill-sub" style={{ marginTop: '4px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
              <FileText size={12} /> Pitch Deck: {teamData.pitchDeckName}
            </div>
          )}
        </div>

        {/* Structured Admin Promo Coupon Box */}
        <div className="coupon-box" style={{ background: 'rgba(13, 18, 30, 0.85)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>
              <Tag size={16} color="var(--accent)" />
              <span>Admin Promo Coupon</span>
            </div>
            <button 
              type="button" 
              onClick={onOpenAdminDrawer} 
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
            >
              <Key size={12} /> Admin Dashboard
            </button>
          </div>

          {!appliedCoupon ? (
            <div>
              <div className="coupon-input-group">
                <input
                  type="text"
                  className="coupon-input"
                  placeholder="Enter Code (e.g. ECELL100)"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                />
                <button type="button" className="btn-apply-coupon" onClick={() => handleApplyCoupon()}>
                  Apply
                </button>
              </div>

              {/* Active Admin Coupons Badges */}
              {applicableAdminCoupons.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                    Available Admin Codes:
                  </div>
                  <div className="admin-coupons-badge-list">
                    {applicableAdminCoupons.map((c) => (
                      <button
                        key={c.id || c.code}
                        type="button"
                        className="coupon-chip"
                        onClick={() => {
                          setCouponInput(c.code);
                          handleApplyCoupon(c.code);
                        }}
                      >
                        <Sparkles size={12} />
                        {c.code} ({c.badge})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {couponError && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', marginTop: '8px' }}>
                  {couponError}
                </div>
              )}
            </div>
          ) : (
            <div className="applied-coupon-banner">
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} color="var(--accent-emerald)" />
                  <span>{appliedCoupon.code} APPLIED</span>
                </div>
                <div style={{ fontSize: '0.76rem', opacity: 0.9, marginTop: '2px' }}>
                  {appliedCoupon.description}
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleRemoveCoupon} 
                title="Remove Coupon"
                style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '4px' }}
              >
                <XCircle size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Pricing Breakdown Table in INR (₹) */}
        <div className="price-table" style={{ marginBottom: '24px' }}>
          <div className="price-row">
            <span>Individual Registration Fee</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>

          {appliedCoupon && (
            <div className="price-row discount">
              <span>Admin Coupon Discount ({appliedCoupon.badge})</span>
              <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="price-row total" style={{ paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
            <span>Total Payable</span>
            <span style={{ color: 'var(--accent-emerald)', fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
              ₹{finalTotal.toLocaleString('en-IN')} INR
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            type="button" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={onCompleteRegistration}
          >
            <span>Confirm & Claim Ticket Pass</span>
            <ArrowRight size={18} />
          </button>

          <button 
            type="button" 
            className="btn-secondary" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            <span>Back to Registration Form</span>
          </button>
        </div>
      </div>
    </div>
  );
}
