import React, { useState } from 'react';
import { Key, X, Plus, Trash2, ShieldCheck, Tag, Calendar, Clock, LogOut, Award, Layers, Users, IndianRupee, Rocket, FileText, CheckCircle, Search } from 'lucide-react';

export default function AdminDashboardModal({ 
  isOpen, 
  onClose, 
  adminUser, 
  onLogout,
  registrationsList = [],
  eventsList = [],
  onAddEvent,
  onDeleteEvent,
  adminCoupons = [], 
  onAddCoupon, 
  onDeleteCoupon,
  scheduleCards = [],
  onAddScheduleCard,
  onDeleteScheduleCard,
  onSelectCouponForCheckout
}) {
  const [activeTab, setActiveTab] = useState('registrations'); // 'registrations', 'events', 'coupons', 'schedule'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Forms Visibility Toggles
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [showAddCouponForm, setShowAddCouponForm] = useState(false);
  const [showAddScheduleForm, setShowAddScheduleForm] = useState(false);

  // New Event Form state
  const [evtTitle, setEvtTitle] = useState('');
  const [evtTag, setEvtTag] = useState('Hackathon Track');
  const [evtPrice, setEvtPrice] = useState('250');
  const [evtDate, setEvtDate] = useState('Oct 15 - 17, 2026');
  const [evtLocation, setEvtLocation] = useState('CampusShark Tech Hub & Online');
  const [evtDesc, setEvtDesc] = useState('');
  const [evtHighlights, setEvtHighlights] = useState('Cash Prizes, VC Mentorship, Swag Kit');
  const [evtIsFlagship, setEvtIsFlagship] = useState(false);

  // New Coupon Form state
  const [newCode, setNewCode] = useState('');
  const [targetEventId, setTargetEventId] = useState('ALL');
  const [newType, setNewType] = useState('flat');
  const [newDiscount, setNewDiscount] = useState('100');
  const [newDesc, setNewDesc] = useState('');

  // New Schedule Card Form state
  const [schTitle, setSchTitle] = useState('');
  const [schTime, setSchTime] = useState('');
  const [schDesc, setSchDesc] = useState('');
  const [schTag, setSchTag] = useState('Keynote Track');

  if (!isOpen) return null;

  // Filter Registrations by Search Term
  const filteredRegistrations = registrationsList.filter(reg => {
    const q = searchTerm.toLowerCase();
    return (
      (reg.fullName && reg.fullName.toLowerCase().includes(q)) ||
      (reg.startupName && reg.startupName.toLowerCase().includes(q)) ||
      (reg.email && reg.email.toLowerCase().includes(q)) ||
      (reg.sector && reg.sector.toLowerCase().includes(q)) ||
      (reg.ticketId && reg.ticketId.toLowerCase().includes(q))
    );
  });

  // Math Metrics
  const totalPaidCount = registrationsList.length;
  const totalRevenue = registrationsList.reduce((acc, curr) => acc + (curr.amountPaid || 150), 0);
  const pitchDecksCount = registrationsList.filter(r => r.pitchDeckUrl || r.pitchDeckName).length;

  // Handle Event Creation
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!evtTitle.trim() || !evtPrice) return;

    const highlightsArr = evtHighlights
      .split(',')
      .map(h => h.trim())
      .filter(h => h.length > 0);

    const newEventObj = {
      id: `evt-${Date.now()}`,
      title: evtTitle.trim(),
      tag: evtTag.trim() || 'Tech Track',
      pricePerMember: parseFloat(evtPrice),
      originalPrice: parseFloat(evtPrice) * 2,
      date: evtDate.trim() || 'TBA 2026',
      location: evtLocation.trim() || 'Campus Hub',
      description: evtDesc.trim() || 'Official CampusShark Event Track.',
      highlights: highlightsArr.length > 0 ? highlightsArr : ['Certificate', 'Mentorship', 'Prizes'],
      availableSeats: 40,
      isFlagship: evtIsFlagship
    };

    onAddEvent(newEventObj);
    setEvtTitle('');
    setEvtDesc('');
    setShowAddEventForm(false);
  };

  // Handle Coupon Creation
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCode.trim() || !newDiscount) return;

    const discountVal = parseFloat(newDiscount);
    const formattedCode = newCode.trim().toUpperCase();
    
    let eventTitle = 'All Events (Global Code)';
    if (targetEventId !== 'ALL') {
      const targetEvt = eventsList.find(e => (e.id || e._id) === targetEventId);
      if (targetEvt) eventTitle = targetEvt.title;
    }

    const createdCoupon = {
      id: `c-${Date.now()}`,
      code: formattedCode,
      eventId: targetEventId,
      eventTitle: eventTitle,
      type: newType,
      discount: discountVal,
      description: newDesc.trim() || `Admin Issued ${newType === 'percentage' ? `${discountVal}% OFF` : `₹${discountVal} Flat`} Coupon`,
      badge: newType === 'percentage' ? `${discountVal}% OFF` : `₹${discountVal} FLAT`
    };

    onAddCoupon(createdCoupon);
    setNewCode('');
    setNewDiscount('');
    setNewDesc('');
    setShowAddCouponForm(false);
  };

  // Handle Schedule Creation
  const handleCreateScheduleCard = (e) => {
    e.preventDefault();
    if (!schTitle.trim() || !schTime.trim() || !schDesc.trim()) return;

    const newSchCard = {
      id: `sch-${Date.now()}`,
      title: schTitle.trim(),
      time: schTime.trim(),
      description: schDesc.trim(),
      tag: schTag.trim() || 'Session Track'
    };

    onAddScheduleCard(newSchCard);
    setSchTitle('');
    setSchTime('');
    setSchDesc('');
    setShowAddScheduleForm(false);
  };

  return (
    <div className="admin-drawer-overlay" onClick={onClose}>
      <div className="admin-drawer" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        {/* Dashboard Top Navigation Header */}
        <div className="drawer-header" style={{ marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: '800' }}>
                ADMIN AUTHENTICATED
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{adminUser?.email}</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
              CampusShark Control Center
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={onLogout}
              title="Logout Admin"
              style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <LogOut size={14} /> Logout
            </button>
            <button type="button" className="btn-close-drawer" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Registrations vs Events vs Coupons vs Schedule Cards */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', overflowX: 'auto' }}>
          <button
            type="button"
            onClick={() => setActiveTab('registrations')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'registrations' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <Users size={16} />
            <span>Paid Members ({registrationsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('events')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'events' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <Layers size={16} />
            <span>Events ({eventsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coupons')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'coupons' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <Tag size={16} />
            <span>Coupons ({adminCoupons.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'schedule' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <Clock size={16} />
            <span>Schedule ({scheduleCards.length})</span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: PAID FOUNDERS & REGISTRATIONS DASHBOARD */}
        {/* =================================================================== */}
        {activeTab === 'registrations' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* Key Metrics Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={14} /> Total Paid Founders
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
                  {totalPaidCount}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Verified Paid Pass Holders
                </div>
              </div>

              <div style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid var(--border-focus)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IndianRupee size={14} /> Total Revenue
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>
                  ₹{totalRevenue.toLocaleString('en-IN')} INR
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Registration Fee Collected
                </div>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FileText size={14} /> Pitch Decks Uploaded
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
                  {pitchDecksCount}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Pitch Decks Received
                </div>
              </div>
            </div>

            {/* Search Filter Bar */}
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="coupon-input"
                placeholder="Search founders by name, startup name, email, or sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '36px', width: '100%' }}
              />
            </div>

            {/* Paid Registrations Cards List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
                Showing {filteredRegistrations.length} Paid Founder Registrations:
              </div>

              {filteredRegistrations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-dim)' }}>
                  No paid registrations found matching search query.
                </div>
              ) : (
                filteredRegistrations.map((reg, idx) => (
                  <div
                    key={reg._id || reg.ticketId || idx}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{reg.fullName}</span>
                          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={12} /> PAID ₹{reg.amountPaid || 150} INR
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {reg.email} • {reg.phone} • {reg.city}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.74rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '4px', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                          {reg.ticketId || 'CSHARK-PASS'}
                        </span>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(13, 18, 30, 0.8)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Rocket size={14} /> {reg.startupName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Sector: <strong style={{ color: '#fff' }}>{reg.sector || 'AI/SaaS'}</strong> • Stage: {reg.stage || 'MVP'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {(reg.pitchDeckUrl || reg.pitchDeckName) && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                            <FileText size={14} />
                            <span>Pitch Deck Attached</span>
                          </span>
                        )}
                        
                        {reg.appliedCoupon && reg.appliedCoupon !== 'NONE' && (
                          <span style={{ fontSize: '0.74rem', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                            Coupon: {reg.appliedCoupon}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: MANAGE EVENT TRACKS (CREATE / DELETE) */}
        {/* =================================================================== */}
        {activeTab === 'events' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setShowAddEventForm(!showAddEventForm)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: showAddEventForm ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.2)',
                  border: `1px solid ${showAddEventForm ? 'var(--accent-rose)' : 'var(--primary)'}`,
                  color: showAddEventForm ? 'var(--accent-rose)' : '#fff',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {showAddEventForm ? <X size={16} /> : <Plus size={16} />}
                <span>{showAddEventForm ? 'Cancel Add Event' : '+ Create New Event Track'}</span>
              </button>
            </div>

            {/* Create Event Form */}
            {showAddEventForm && (
              <form onSubmit={handleCreateEvent} style={{ background: 'rgba(13, 18, 30, 0.95)', border: '1px solid var(--border-focus)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
                  Create New Event Track
                </h4>

                <div className="gf-field-group" style={{ marginBottom: '12px' }}>
                  <label className="gf-label" style={{ fontSize: '0.78rem' }}>Event Title</label>
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="e.g. CampusShark Web3 & DAO Hackathon"
                    value={evtTitle}
                    onChange={(e) => setEvtTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-grid-2" style={{ marginBottom: '12px' }}>
                  <div>
                    <label className="gf-label" style={{ fontSize: '0.78rem' }}>Tag / Category</label>
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="e.g. Hackathon Track"
                      value={evtTag}
                      onChange={(e) => setEvtTag(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="gf-label" style={{ fontSize: '0.78rem' }}>Price Per Member (₹ INR)</label>
                    <input
                      type="number"
                      className="coupon-input"
                      placeholder="e.g. 250"
                      value={evtPrice}
                      onChange={(e) => setEvtPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: '12px' }}>
                  <div>
                    <label className="gf-label" style={{ fontSize: '0.78rem' }}>Dates</label>
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="e.g. Oct 15 - 17, 2026"
                      value={evtDate}
                      onChange={(e) => setEvtDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="gf-label" style={{ fontSize: '0.78rem' }}>Venue / Location</label>
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="e.g. Main Auditorium & Virtual"
                      value={evtLocation}
                      onChange={(e) => setEvtLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="gf-field-group" style={{ marginBottom: '12px' }}>
                  <label className="gf-label" style={{ fontSize: '0.78rem' }}>Highlights (Comma separated)</label>
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="e.g. ₹5 Lakhs Prizes, VC Mentorship, Free Swag Kit"
                    value={evtHighlights}
                    onChange={(e) => setEvtHighlights(e.target.value)}
                  />
                </div>

                <div className="gf-field-group" style={{ marginBottom: '16px' }}>
                  <label className="gf-label" style={{ fontSize: '0.78rem' }}>Event Description</label>
                  <textarea
                    rows={2}
                    className="coupon-input"
                    placeholder="Brief description of event goals, track requirements, and benefits..."
                    value={evtDesc}
                    onChange={(e) => setEvtDesc(e.target.value)}
                    required
                    style={{ width: '100%', resize: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="isFlagshipCheck"
                    checked={evtIsFlagship}
                    onChange={(e) => setEvtIsFlagship(e.target.checked)}
                    style={{ accentColor: 'var(--accent-amber)', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isFlagshipCheck" style={{ fontSize: '0.85rem', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>
                    Mark as E-Cell Flagship Event Track ⭐
                  </label>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}>
                  Publish Event Track to Website
                </button>
              </form>
            )}

            {/* Active Events List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
                Active Website Events ({eventsList.length}):
              </div>

              {eventsList.map((evt) => (
                <div 
                  key={evt.id || evt._id}
                  style={{
                    background: 'var(--bg-card)',
                    border: `1px solid ${evt.isFlagship ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-light)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ background: evt.isFlagship ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.15)', color: evt.isFlagship ? 'var(--accent-amber)' : 'var(--primary)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        {evt.tag}
                      </span>
                      {evt.isFlagship && (
                        <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          <Award size={10} /> FLAGSHIP
                        </span>
                      )}
                    </div>

                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '1rem' }}>
                      {evt.title}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Price: <strong style={{ color: 'var(--accent-emerald)' }}>₹{evt.pricePerMember?.toLocaleString('en-IN')}</strong> / member • {evt.date}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteEvent && onDeleteEvent(evt.id || evt._id)}
                    title="Delete Event Track"
                    disabled={eventsList.length <= 1}
                    style={{
                      background: 'rgba(244, 63, 94, 0.15)',
                      color: 'var(--accent-rose)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: eventsList.length <= 1 ? 'not-allowed' : 'pointer',
                      opacity: eventsList.length <= 1 ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '700'
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: EVENT COUPON CODES MANAGEMENT */}
        {/* =================================================================== */}
        {activeTab === 'coupons' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setShowAddCouponForm(!showAddCouponForm)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: showAddCouponForm ? 'rgba(244, 63, 94, 0.15)' : 'rgba(139, 92, 246, 0.2)',
                  border: `1px solid ${showAddCouponForm ? 'var(--accent-rose)' : 'var(--accent)'}`,
                  color: showAddCouponForm ? 'var(--accent-rose)' : '#fff',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {showAddCouponForm ? <X size={16} /> : <Plus size={16} />}
                <span>{showAddCouponForm ? 'Cancel Add Coupon' : '+ Create New Event Coupon Code'}</span>
              </button>
            </div>

            {showAddCouponForm && (
              <form onSubmit={handleCreateCoupon} style={{ background: 'rgba(13, 18, 30, 0.95)', border: '1px solid var(--border-accent)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
                  Issue Event Coupon Code
                </h4>

                <div className="form-grid-2" style={{ marginBottom: '12px' }}>
                  <div className="gf-field-group" style={{ marginBottom: 0 }}>
                    <label className="gf-label" style={{ fontSize: '0.78rem' }}>Coupon Code</label>
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="e.g. ECELL100"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                      required
                    />
                  </div>

                  <div>
                    <label className="gf-label" style={{ fontSize: '0.78rem' }}>Assign to Target Event</label>
                    <select
                      value={targetEventId}
                      onChange={(e) => setTargetEventId(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-light)', padding: '10px', color: '#fff', borderRadius: '6px', fontSize: '0.85rem' }}
                    >
                      <option value="ALL">All Events (Global Code)</option>
                      {eventsList.map((evt) => (
                        <option key={evt.id || evt._id} value={evt.id || evt._id}>{evt.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: '12px' }}>
                  <div>
                    <label className="gf-label" style={{ fontSize: '0.78rem' }}>Discount Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-light)', padding: '10px', color: '#fff', borderRadius: '6px', fontSize: '0.85rem' }}
                    >
                      <option value="flat">Flat Amount (₹)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="gf-label" style={{ fontSize: '0.78rem' }}>Discount Value</label>
                    <input
                      type="number"
                      className="coupon-input"
                      placeholder={newType === 'percentage' ? 'e.g. 100' : 'e.g. 100'}
                      value={newDiscount}
                      onChange={(e) => setNewDiscount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="gf-field-group" style={{ marginBottom: '16px' }}>
                  <label className="gf-label" style={{ fontSize: '0.78rem' }}>Description</label>
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="e.g. E-Cell Leader ₹100 Flat Waiver"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}>
                  Save & Publish Coupon
                </button>
              </form>
            )}

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {adminCoupons.map((c) => (
                <div className="coupon-item-card" key={c.id || c._id || c.code}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="coupon-code-text">{c.code}</span>
                      <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        {c.badge}
                      </span>
                    </div>
                    <div className="coupon-disc-text">{c.description}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>
                      Target: {c.eventTitle || 'All Events'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectCouponForCheckout) onSelectCouponForCheckout(c);
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

                    <button
                      type="button"
                      onClick={() => onDeleteCoupon && onDeleteCoupon(c.code)}
                      title="Revoke / Delete Coupon"
                      style={{
                        background: 'rgba(244, 63, 94, 0.15)',
                        color: 'var(--accent-rose)',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: ANIMATED WEBSITE SCHEDULE CARDS MANAGEMENT */}
        {/* =================================================================== */}
        {activeTab === 'schedule' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setShowAddScheduleForm(!showAddScheduleForm)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: showAddScheduleForm ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.2)',
                  border: `1px solid ${showAddScheduleForm ? 'var(--accent-rose)' : 'var(--primary)'}`,
                  color: showAddScheduleForm ? 'var(--accent-rose)' : '#fff',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {showAddScheduleForm ? <X size={16} /> : <Plus size={16} />}
                <span>{showAddScheduleForm ? 'Cancel Add Schedule Card' : '+ Add Animated Schedule Card to Website'}</span>
              </button>
            </div>

            {showAddScheduleForm && (
              <form onSubmit={handleCreateScheduleCard} style={{ background: 'rgba(13, 18, 30, 0.95)', border: '1px solid var(--border-focus)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
                  Create Website Schedule Card
                </h4>

                <div className="gf-field-group" style={{ marginBottom: '12px' }}>
                  <label className="gf-label" style={{ fontSize: '0.78rem' }}>Session Title</label>
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="e.g. VC Pitch Deck Battle & Award Gala"
                    value={schTitle}
                    onChange={(e) => setSchTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-grid-2" style={{ marginBottom: '12px' }}>
                  <div>
                    <label className="gf-label" style={{ fontSize: '0.78rem' }}>Time Slot</label>
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="e.g. 02:30 PM - 05:00 PM"
                      value={schTime}
                      onChange={(e) => setSchTime(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="gf-label" style={{ fontSize: '0.78rem' }}>Track Tag</label>
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="e.g. Pitching Arena"
                      value={schTag}
                      onChange={(e) => setSchTag(e.target.value)}
                    />
                  </div>
                </div>

                <div className="gf-field-group" style={{ marginBottom: '16px' }}>
                  <label className="gf-label" style={{ fontSize: '0.78rem' }}>Description</label>
                  <textarea
                    rows={3}
                    className="coupon-input"
                    placeholder="Detailed session description for website visitors..."
                    value={schDesc}
                    onChange={(e) => setSchDesc(e.target.value)}
                    required
                    style={{ width: '100%', resize: 'none' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}>
                  Publish Schedule Card to Website
                </button>
              </form>
            )}

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {scheduleCards.map((card, idx) => (
                <div 
                  key={card.id || card._id || idx}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        {card.tag || 'Track'}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                        {card.time}
                      </span>
                    </div>

                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.98rem', marginBottom: '4px' }}>
                      {card.title}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {card.description}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteScheduleCard && onDeleteScheduleCard(card.id || card._id)}
                    title="Delete Schedule Card"
                    style={{
                      background: 'rgba(244, 63, 94, 0.15)',
                      color: 'var(--accent-rose)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginLeft: '12px'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="var(--accent-cyan)" />
            <span>CampusShark Admin Control Dashboard Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
