import React, { useState } from 'react';
import { Key, X, Copy, Check, Plus, Trash2, ShieldCheck, Tag } from 'lucide-react';

export default function AdminCouponDrawer({ 
  isOpen, 
  onClose, 
  adminCoupons = [], 
  onAddCoupon, 
  onDeleteCoupon, 
  onSelectCoupon 
}) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Coupon Input Form state
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState('percentage');
  const [newDiscount, setNewDiscount] = useState('');
  const [newDesc, setNewDesc] = useState('');

  if (!isOpen) return null;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCode.trim() || !newDiscount) return;

    const discountVal = parseFloat(newDiscount);
    const formattedCode = newCode.trim().toUpperCase();

    const createdCoupon = {
      code: formattedCode,
      type: newType,
      discount: discountVal,
      description: newDesc.trim() || `Admin Issued ${newType === 'percentage' ? `${discountVal}% OFF` : `₹${discountVal} Flat`} Coupon`,
      badge: newType === 'percentage' ? `${discountVal}% OFF` : `₹${discountVal} FLAT`
    };

    onAddCoupon(createdCoupon);
    setNewCode('');
    setNewDiscount('');
    setNewDesc('');
    setShowAddForm(false);
  };

  return (
    <div className="admin-drawer-overlay" onClick={onClose}>
      <div className="admin-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '8px', borderRadius: '10px', color: 'var(--accent)' }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>
                Admin Coupon Dashboard
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Issue & Manage Official Promo Codes
              </div>
            </div>
          </div>
          <button type="button" className="btn-close-drawer" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Toggle Form to Add New Coupon */}
        <div style={{ marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: showAddForm ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              border: `1px solid ${showAddForm ? 'var(--accent-rose)' : 'var(--primary)'}`,
              color: showAddForm ? 'var(--accent-rose)' : '#fff',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {showAddForm ? <X size={16} /> : <Plus size={16} />}
            <span>{showAddForm ? 'Cancel Add Coupon' : '+ Issue New Admin Coupon Code'}</span>
          </button>
        </div>

        {/* Create New Admin Coupon Form */}
        {showAddForm && (
          <form onSubmit={handleCreateCoupon} style={{ background: 'rgba(13, 18, 30, 0.9)', border: '1px solid var(--border-accent)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '10px', color: '#fff' }}>
              Create Custom Admin Promo Code
            </div>

            <div className="gf-field-group" style={{ marginBottom: '10px' }}>
              <label className="gf-label" style={{ fontSize: '0.78rem' }}>Coupon Code</label>
              <input
                type="text"
                className="coupon-input"
                placeholder="e.g. ECELLFLAGSHIP100"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="form-grid-2" style={{ marginBottom: '10px' }}>
              <div>
                <label className="gf-label" style={{ fontSize: '0.78rem' }}>Discount Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-light)', padding: '8px', color: '#fff', borderRadius: '6px', fontSize: '0.85rem' }}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="gf-label" style={{ fontSize: '0.78rem' }}>Discount Value</label>
                <input
                  type="number"
                  className="coupon-input"
                  placeholder={newType === 'percentage' ? 'e.g. 100' : 'e.g. 1000'}
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="gf-field-group" style={{ marginBottom: '12px' }}>
              <label className="gf-label" style={{ fontSize: '0.78rem' }}>Description</label>
              <input
                type="text"
                className="coupon-input"
                placeholder="e.g. E-Cell Executive 100% Waiver"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}>
              Issue Admin Coupon
            </button>
          </form>
        )}

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
            Active Dashboard Coupons ({adminCoupons.length}):
          </div>

          {adminCoupons.map((c) => (
            <div className="coupon-item-card" key={c.code}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="coupon-code-text">{c.code}</span>
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                    {c.badge}
                  </span>
                </div>
                <div className="coupon-disc-text">{c.description}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectCoupon) onSelectCoupon(c);
                    onClose();
                  }}
                  style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Apply
                </button>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => handleCopy(c.code)}
                    style={{
                      flex: 1,
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-light)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    {copiedCode === c.code ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteCoupon && onDeleteCoupon(c.code)}
                    title="Revoke / Delete Coupon"
                    style={{
                      background: 'rgba(244, 63, 94, 0.1)',
                      color: 'var(--accent-rose)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="var(--accent-cyan)" />
            <span>CampusShark Admin Authorization Protocol Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
