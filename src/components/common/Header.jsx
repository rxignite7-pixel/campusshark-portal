import React from 'react';
import { Key, Lock, UserCheck } from 'lucide-react';

export default function Header({ currentStep, onStepClick, onOpenAdminDrawer, isAdminLoggedIn, adminUser }) {
  return (
    <header className="navbar">
      <div className="brand-logo" onClick={() => onStepClick(0)} title="CampusShark Home">
        <img 
          src="/logo.jpg" 
          alt="Rx Ignite Logo" 
          style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '50%', 
            objectFit: 'cover', 
            border: '2px solid rgba(245, 158, 11, 0.7)',
            boxShadow: '0 0 14px rgba(245, 158, 11, 0.4)',
            transition: 'transform 0.3s ease'
          }} 
          className="brand-logo-img"
        />
        <div className="logo-text">
          Campus<span>Shark</span>
        </div>
      </div>

      <div className="stepper">
        <div 
          className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
          onClick={() => currentStep > 1 && onStepClick(1)}
          style={{ cursor: currentStep > 1 ? 'pointer' : 'default' }}
        >
          <div className="step-num">1</div>
          <span>Member Form</span>
        </div>

        <div className="step-divider" />

        <div 
          className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
          onClick={() => currentStep > 2 && onStepClick(2)}
          style={{ cursor: currentStep > 2 ? 'pointer' : 'default' }}
        >
          <div className="step-num">2</div>
          <span>Event & Coupons</span>
        </div>

        <div className="step-divider" />

        <div className={`step-item ${currentStep === 3 ? 'active' : ''}`}>
          <div className="step-num">3</div>
          <span>Pass & Ticket</span>
        </div>
      </div>

      <button 
        type="button" 
        className="btn-admin-coupon" 
        onClick={onOpenAdminDrawer}
        style={{
          borderColor: isAdminLoggedIn ? 'var(--accent-emerald)' : undefined,
          background: isAdminLoggedIn ? 'rgba(16, 185, 129, 0.2)' : undefined,
          color: isAdminLoggedIn ? 'var(--accent-emerald)' : undefined
        }}
      >
        {isAdminLoggedIn ? <UserCheck size={16} /> : <Lock size={16} />}
        <span>{isAdminLoggedIn ? 'Admin Control Dashboard' : 'Admin Login'}</span>
      </button>
    </header>
  );
}
