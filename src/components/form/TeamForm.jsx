import React, { useState } from 'react';
import DuplicateWarningModal from '../common/DuplicateWarningModal';
import { User, Phone, Mail, MapPin, Building2, Globe, FileText, Upload, CheckCircle, AlertCircle, Rocket, Loader2 } from 'lucide-react';
import { checkDuplicateAPI } from '../../config/api';

const SECTOR_OPTIONS = [
  'AI / Machine Learning',
  'FinTech & Blockchain',
  'HealthTech & BioTech',
  'SaaS & Enterprise',
  'EdTech & E-Learning',
  'CleanTech & Energy',
  'E-Commerce & D2C',
  'DeepTech & Hardware'
];

const STAGE_OPTIONS = [
  'Idea Stage',
  'Prototype / MVP',
  'Early Traction',
  'Seed / Revenue Stage'
];

export default function TeamForm({ initialData, onSubmitForm }) {
  const [formData, setFormData] = useState(initialData || {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    startupName: '',
    sector: 'AI / Machine Learning',
    stage: 'Prototype / MVP',
    website: '',
    pitchDeckName: '',
    pitchDeckFile: null
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  // Duplicate Warning Modal state
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Handle Pitch Deck Upload
  const handleFileUpload = (file) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        pitchDeckName: file.name,
        pitchDeckFile: file
      }));
      if (errors.pitchDeckName) {
        setErrors(prev => ({ ...prev, pitchDeckName: null }));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.city.trim()) newErrors.city = 'City location is required';

    if (!formData.startupName.trim()) newErrors.startupName = 'Startup Name is required';
    if (!formData.pitchDeckName) newErrors.pitchDeckName = 'Please upload your Pitch Deck (PDF/PPTX)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsCheckingDuplicate(true);

    // Check duplicate in MongoDB Atlas
    const dupCheck = await checkDuplicateAPI(formData.email, formData.phone);
    setIsCheckingDuplicate(false);

    if (dupCheck && dupCheck.isDuplicate) {
      setDuplicateMessage(dupCheck.message);
      setShowDuplicateModal(true);
      return;
    }

    onSubmitForm(formData);
  };

  return (
    <>
      <div className="google-form-wrapper">
        <div className="gf-header-banner" />
        
        {/* Form Header Card */}
        <div className="gf-card top-header-card">
          <div>
            <h1 className="gf-title">CampusShark Individual Member & Startup Registration</h1>
            <p className="gf-subtitle">
              Register for the official CampusShark E-Cell Summit. Fill in your member details, startup profile, and pitch deck.
            </p>
          </div>

          <div className="gf-required-note">* Indicates required field</div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Member Details */}
          <div className="gf-card">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gf-purple-light)' }}>
              <User size={20} />
              <span>Section 1 of 2: Member Details</span>
            </h2>

            <div className="form-grid-2">
              <div className="gf-field-group">
                <label className="gf-label">
                  Full Name <span className="req">*</span>
                </label>
                <div className="gf-input-wrapper">
                  <User className="gf-input-icon" size={18} />
                  <input
                    type="text"
                    className={`gf-input ${errors.fullName ? 'gf-input-error' : ''}`}
                    placeholder="e.g. Jordan Taylor"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                  />
                </div>
                {errors.fullName && (
                  <div className="gf-error-msg"><AlertCircle size={14} /> {errors.fullName}</div>
                )}
              </div>

              <div className="gf-field-group">
                <label className="gf-label">
                  Phone Number <span className="req">*</span>
                </label>
                <div className="gf-input-wrapper">
                  <Phone className="gf-input-icon" size={18} />
                  <input
                    type="tel"
                    className={`gf-input ${errors.phone ? 'gf-input-error' : ''}`}
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
                {errors.phone && (
                  <div className="gf-error-msg"><AlertCircle size={14} /> {errors.phone}</div>
                )}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="gf-field-group">
                <label className="gf-label">
                  Email Address <span className="req">*</span>
                </label>
                <div className="gf-input-wrapper">
                  <Mail className="gf-input-icon" size={18} />
                  <input
                    type="email"
                    className={`gf-input ${errors.email ? 'gf-input-error' : ''}`}
                    placeholder="e.g. jordan.member@startup.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                {errors.email && (
                  <div className="gf-error-msg"><AlertCircle size={14} /> {errors.email}</div>
                )}
              </div>

              <div className="gf-field-group">
                <label className="gf-label">
                  City / Location <span className="req">*</span>
                </label>
                <div className="gf-input-wrapper">
                  <MapPin className="gf-input-icon" size={18} />
                  <input
                    type="text"
                    className={`gf-input ${errors.city ? 'gf-input-error' : ''}`}
                    placeholder="e.g. Mumbai, MH"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                </div>
                {errors.city && (
                  <div className="gf-error-msg"><AlertCircle size={14} /> {errors.city}</div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Startup & Pitch Deck Details */}
          <div className="gf-card">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)' }}>
              <Rocket size={20} />
              <span>Section 2 of 2: Startup Details & Pitch Deck</span>
            </h2>

            <div className="form-grid-2">
              <div className="gf-field-group">
                <label className="gf-label">
                  Startup Name <span className="req">*</span>
                </label>
                <div className="gf-input-wrapper">
                  <Building2 className="gf-input-icon" size={18} />
                  <input
                    type="text"
                    className={`gf-input ${errors.startupName ? 'gf-input-error' : ''}`}
                    placeholder="e.g. Apex AI Labs"
                    value={formData.startupName}
                    onChange={(e) => handleChange('startupName', e.target.value)}
                  />
                </div>
                {errors.startupName && (
                  <div className="gf-error-msg"><AlertCircle size={14} /> {errors.startupName}</div>
                )}
              </div>

              <div className="gf-field-group">
                <label className="gf-label">
                  Sector / Industry <span className="req">*</span>
                </label>
                <select
                  className="gf-input"
                  style={{ paddingLeft: '16px' }}
                  value={formData.sector}
                  onChange={(e) => handleChange('sector', e.target.value)}
                >
                  {SECTOR_OPTIONS.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="gf-field-group" style={{ marginBottom: '20px' }}>
              <label className="gf-label">
                Stage of Startup <span className="req">*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                {STAGE_OPTIONS.map((stg) => (
                  <button
                    key={stg}
                    type="button"
                    onClick={() => handleChange('stage', stg)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: formData.stage === stg ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-input)',
                      border: `1px solid ${formData.stage === stg ? 'var(--accent-amber)' : 'var(--border-light)'}`,
                      color: formData.stage === stg ? '#fff' : 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}
                  >
                    {stg}
                  </button>
                ))}
              </div>
            </div>

            <div className="gf-field-group" style={{ marginBottom: '24px' }}>
              <label className="gf-label">
                Startup Website <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '400' }}>(Optional)</span>
              </label>
              <div className="gf-input-wrapper">
                <Globe className="gf-input-icon" size={18} />
                <input
                  type="url"
                  className="gf-input"
                  placeholder="https://my-startup.com"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                />
              </div>
            </div>

            {/* Pitch Deck Upload Component */}
            <div className="gf-field-group">
              <label className="gf-label">
                Pitch Deck Upload (PDF / PPTX) <span className="req">*</span>
              </label>
              
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragActive ? 'var(--primary)' : errors.pitchDeckName ? 'var(--accent-rose)' : 'rgba(139, 92, 246, 0.4)'}`,
                  background: dragActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(13, 18, 30, 0.8)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                onClick={() => document.getElementById('pitchDeckFileInput').click()}
              >
                <input
                  id="pitchDeckFileInput"
                  type="file"
                  accept=".pdf,.pptx,.ppt"
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                />

                {formData.pitchDeckName ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--accent-emerald)' }}>
                    <CheckCircle size={24} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff' }}>{formData.pitchDeckName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)' }}>✓ Pitch deck attached successfully</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload size={32} color="var(--accent)" style={{ marginBottom: '8px' }} />
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff', marginBottom: '4px' }}>
                      Drag & Drop your Pitch Deck here, or <span style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>Browse Files</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      Supported formats: PDF, PPTX (Max 25MB)
                    </div>
                  </div>
                )}
              </div>

              {errors.pitchDeckName && (
                <div className="gf-error-msg" style={{ marginTop: '8px' }}><AlertCircle size={14} /> {errors.pitchDeckName}</div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: '32px' }}>
            <button type="submit" className="btn-primary" disabled={isCheckingDuplicate} style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
              {isCheckingDuplicate ? (
                <>
                  <Loader2 size={20} className="spin-icon" />
                  <span>Checking Email & Phone...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Event Tracks & Coupons</span>
                  <Rocket size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* User Already Exists Warning Popup Modal */}
      <DuplicateWarningModal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        duplicateMessage={duplicateMessage}
        email={formData.email}
        phone={formData.phone}
      />
    </>
  );
}
