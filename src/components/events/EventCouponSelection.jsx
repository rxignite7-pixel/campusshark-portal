import React, { useState } from 'react';
import EventCard from './EventCard';
import { Tag, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, XCircle, CheckCircle, Rocket, FileText, CreditCard, Loader2 } from 'lucide-react';
import { createRazorpayOrderAPI, verifyRazorpayPaymentAPI } from '../../config/api';

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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const activeEvent = selectedEvent || eventsList[0] || {};
  const memberName = teamData?.fullName || 'Jordan Taylor';
  const startupName = teamData?.startupName || 'CampusShark Startup';

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a promo coupon code.');
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

  // Calculation Math for Individual Member in INR (₹)
  const basePricePerPerson = activeEvent.pricePerMember || 250;
  const subtotal = basePricePerPerson; // 1 Member
  
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

  // Razorpay Integration Handler
  const handlePayAmount = async () => {
    setIsProcessingPayment(true);

    const registrationPayload = {
      ...teamData,
      eventId: activeEvent.id || activeEvent._id,
      eventTitle: activeEvent.title,
      appliedCoupon: appliedCoupon ? appliedCoupon.code : 'NONE',
      amountPaid: finalTotal
    };

    try {
      // 1. Create Razorpay Order from backend
      const orderRes = await createRazorpayOrderAPI(finalTotal, `receipt_${Date.now()}`);
      
      if (orderRes && orderRes.order && window.Razorpay) {
        const options = {
          key: orderRes.key_id || 'rzp_test_campusshark2026',
          amount: orderRes.order.amount,
          currency: orderRes.order.currency || 'INR',
          name: 'CampusShark E-Cell Summit 2026',
          description: `Registration for ${activeEvent.title}`,
          image: 'https://cdn-icons-png.flaticon.com/512/1041/1041883.png',
          order_id: orderRes.order.id,
          handler: async function (response) {
            // Verify payment signature & save to MongoDB
            await verifyRazorpayPaymentAPI({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationData: registrationPayload
            });

            setIsProcessingPayment(false);
            onCompleteRegistration();
          },
          prefill: {
            name: teamData.fullName,
            email: teamData.email,
            contact: teamData.phone
          },
          notes: {
            startupName: teamData.startupName,
            sector: teamData.sector,
            appliedCoupon: appliedCoupon ? appliedCoupon.code : 'NONE'
          },
          theme: {
            color: '#6366f1'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          console.error('Razorpay payment failed:', response.error);
          setIsProcessingPayment(false);
          alert(`Payment Failed: ${response.error.description || 'Transaction declined.'}`);
        });
        rzp.open();
      } else {
        // Fallback simulation mode if Razorpay keys are not yet configured by user
        setTimeout(() => {
          setIsProcessingPayment(false);
          onCompleteRegistration();
        }, 1200);
      }
    } catch (err) {
      console.warn('Razorpay checkout error:', err);
      setIsProcessingPayment(false);
      onCompleteRegistration();
    }
  };

  return (
    <div className="selection-layout">
      {/* Left Column: Events Grid */}
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h2 className="section-heading">Select Event Track</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Select the official summit track for <strong>"{startupName}"</strong> (Member: {memberName}).
          </p>
        </div>

        <div className="events-grid">
          {eventsList.map((evt) => (
            <EventCard
              key={evt.id || evt._id}
              evt={evt}
              isSelected={activeEvent.id === evt.id || activeEvent._id === evt._id}
              onSelect={() => onSelectEvent(evt)}
            />
          ))}
        </div>
      </div>

      {/* Right Column: Clean, Structured Registration Summary & Promo Coupon Box */}
      <div className="summary-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--primary)" />
            <span>Registration Summary</span>
          </h3>
          <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Rocket size={12} /> Individual Member
          </span>
        </div>

        {/* Startup Overview Pill */}
        <div className="summary-team-pill" style={{ marginBottom: '20px' }}>
          <div className="team-pill-name">{startupName}</div>
          <div className="team-pill-sub">
            Member: {memberName} ({teamData?.city || 'India'})
          </div>
          <div className="team-pill-sub" style={{ marginTop: '2px' }}>
            Sector: <strong style={{ color: '#fff' }}>{teamData?.sector || 'AI/SaaS'}</strong> • Stage: {teamData?.stage || 'MVP'}
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
                    Available Promo Codes:
                  </div>
                  <div className="admin-coupons-badge-list">
                    {applicableAdminCoupons.map((c) => (
                      <button
                        key={c.id || c._id || c.code}
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
          {/* Official Razorpay Pay Amount CTA Button */}
          <button 
            type="button" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={isProcessingPayment}
            onClick={handlePayAmount}
          >
            {isProcessingPayment ? (
              <>
                <Loader2 size={18} className="spin-icon" />
                <span>Launching Razorpay Payment...</span>
              </>
            ) : (
              <>
                <CreditCard size={18} />
                <span>Pay Amount (₹{finalTotal.toLocaleString('en-IN')})</span>
                <ArrowRight size={18} />
              </>
            )}
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
