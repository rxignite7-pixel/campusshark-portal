import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import DuplicateWarningModal from '../common/DuplicateWarningModal';
import { Tag, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, XCircle, CheckCircle, Rocket, FileText, CreditCard, Loader2, Ticket } from 'lucide-react';
import { createRazorpayOrderAPI, verifyRazorpayPaymentAPI, checkDuplicateAPI, submitRegistration } from '../../config/api';

const RAZORPAY_KEY = 'rzp_test_TOyqd2U2Wrsk8q';

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

  // Duplicate Warning Modal state
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');

  const activeEvent = selectedEvent || eventsList[0] || {};
  const memberName = teamData?.fullName || 'Jordan Taylor';
  const startupName = teamData?.startupName || 'CampusShark Startup';

  // Ensure Razorpay SDK Script is loaded on component mount
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a promo coupon code.');
      return;
    }

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

  // Razorpay Payment Handler (PhonePe, Google Pay, Paytm, BHIM, Cards & NetBanking)
  const handlePayAmount = async () => {
    setIsProcessingPayment(true);

    // 1. Pre-flight Check for Duplicate User (Email or Phone)
    const dupCheck = await checkDuplicateAPI(teamData.email, teamData.phone);
    if (dupCheck && dupCheck.isDuplicate) {
      setIsProcessingPayment(false);
      setDuplicateMessage(dupCheck.message);
      setShowDuplicateModal(true);
      return;
    }

    const registrationPayload = {
      ...teamData,
      eventId: activeEvent.id || activeEvent._id,
      eventTitle: activeEvent.title,
      appliedCoupon: appliedCoupon ? appliedCoupon.code : 'NONE',
      amountPaid: finalTotal
    };

    // Helper to launch Razorpay Modal prioritizing PhonePe & GPay with show_default_blocks: true
    const launchRazorpayModal = (orderId = null, keyId = RAZORPAY_KEY) => {
      const options = {
        key: keyId || RAZORPAY_KEY,
        amount: Math.round(finalTotal * 100), // Amount in paise (₹150 = 15000 paise)
        currency: 'INR',
        name: 'CampusShark E-Cell Summit 2026',
        description: `Registration Fee for ${activeEvent.title}`,
        image: '/logo.jpg',
        order_id: orderId,
        prefill: {
          name: teamData.fullName || '',
          email: teamData.email || '',
          contact: teamData.phone || '',
          method: 'upi' // Prefill UPI mode
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI Apps (PhonePe, Google Pay, Paytm, BHIM)',
                instruments: [
                  {
                    method: 'upi',
                    apps: ['google_pay', 'phonepe', 'paytm', 'bhim']
                  }
                ]
              },
              other: {
                name: 'Other Gateways (Cards, NetBanking, Wallets)',
                instruments: [
                  { method: 'card' },
                  { method: 'netbanking' },
                  { method: 'wallet' }
                ]
              }
            },
            sequence: ['block.upi', 'block.other'],
            preferences: {
              show_default_blocks: true // Ensures all payment options work without error!
            }
          }
        },
        notes: {
          startupName: teamData.startupName || '',
          sector: teamData.sector || '',
          appliedCoupon: appliedCoupon ? appliedCoupon.code : 'NONE'
        },
        theme: {
          color: '#6366f1'
        },
        handler: async function (response) {
          if (response.razorpay_payment_id) {
            await verifyRazorpayPaymentAPI({
              razorpay_order_id: response.razorpay_order_id || `order_dummy_${Date.now()}`,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || 'verified',
              registrationData: registrationPayload
            });
          } else {
            await submitRegistration(registrationPayload);
          }

          setIsProcessingPayment(false);
          onCompleteRegistration();
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          }
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          console.error('Razorpay payment failed:', response.error);
          setIsProcessingPayment(false);
          alert(`Payment Failed: ${response.error.description || 'Transaction declined.'}`);
        });
        rzp.open();
      } else {
        alert('Razorpay Payment SDK failed to load. Please check your internet connection.');
        setIsProcessingPayment(false);
      }
    };

    try {
      const orderRes = await createRazorpayOrderAPI(finalTotal, `receipt_${Date.now()}`, teamData.email, teamData.phone);
      
      if (orderRes && orderRes.isDuplicate) {
        setIsProcessingPayment(false);
        setDuplicateMessage(orderRes.error);
        setShowDuplicateModal(true);
        return;
      }

      if (orderRes && orderRes.order) {
        launchRazorpayModal(orderRes.order.id, orderRes.key_id);
      } else {
        launchRazorpayModal(null, RAZORPAY_KEY);
      }
    } catch (err) {
      console.warn('Backend order creation offline, opening direct Razorpay modal:', err);
      launchRazorpayModal(null, RAZORPAY_KEY);
    }
  };

  return (
    <>
      <div className="selection-layout">
        {/* Left Column: Events Grid & Clearly Visible Available Coupons */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2 className="section-heading">Select Event Track</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Select the official summit track for <strong>"{startupName}"</strong> (Member: {memberName}).
            </p>
          </div>

          {/* Prominent & Clearly Visible Available Promo Coupons Section */}
          <div 
            style={{ 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', color: '#fff', fontSize: '0.95rem' }}>
                <Ticket size={18} color="var(--accent-amber)" />
                <span>Available Promo Coupon Codes</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click code to apply</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {applicableAdminCoupons.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No promo codes currently active.</div>
              ) : (
                applicableAdminCoupons.map((c) => {
                  const isCurrentApplied = appliedCoupon && appliedCoupon.code === c.code;
                  return (
                    <button
                      key={c.id || c._id || c.code}
                      type="button"
                      onClick={() => {
                        setCouponInput(c.code);
                        handleApplyCoupon(c.code);
                      }}
                      style={{
                        background: isCurrentApplied ? 'var(--accent-emerald)' : 'rgba(13, 18, 30, 0.9)',
                        border: `1.5px solid ${isCurrentApplied ? 'var(--accent-emerald)' : 'var(--accent)'}`,
                        color: isCurrentApplied ? '#000' : '#fff',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease',
                        boxShadow: isCurrentApplied ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none'
                      }}
                    >
                      <Sparkles size={14} color={isCurrentApplied ? '#000' : 'var(--accent-amber)'} />
                      <span>{c.code}</span>
                      <span 
                        style={{ 
                          background: isCurrentApplied ? 'rgba(0,0,0,0.2)' : 'rgba(16, 185, 129, 0.2)', 
                          color: isCurrentApplied ? '#000' : 'var(--accent-emerald)', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontSize: '0.72rem', 
                          fontWeight: '800' 
                        }}
                      >
                        {c.badge}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
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
                <span>Apply Promo Coupon</span>
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
                  <span>Opening Razorpay Payment Checkout...</span>
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

      {/* User Already Exists Warning Popup Modal */}
      <DuplicateWarningModal
        isOpen={showDuplicateModal}
        onClose={() => {
          setShowDuplicateModal(false);
          onBack();
        }}
        duplicateMessage={duplicateMessage}
        email={teamData.email}
        phone={teamData.phone}
      />
    </>
  );
}
