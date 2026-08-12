import React, { useState } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AdminLoginModal from './components/common/AdminLoginModal';
import AdminDashboardModal from './components/common/AdminDashboardModal';
import LandingHero from './components/hero/LandingHero';
import ScheduleSection from './components/schedule/ScheduleSection';
import TeamForm from './components/form/TeamForm';
import EventCouponSelection from './components/events/EventCouponSelection';
import TicketPass from './components/pass/TicketPass';
import { EVENTS_DATA, INITIAL_ADMIN_COUPONS, INITIAL_SCHEDULE_DATA } from './data/eventsAndCoupons';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); // 0: Hero, 1: Form, 2: Event & Coupon, 3: Ticket Pass
  
  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);

  // Dynamic Events List (Managed by Admin Dashboard)
  const [eventsList, setEventsList] = useState(EVENTS_DATA);

  // Admin Managed Coupons List (Tied to events or global)
  const [adminCoupons, setAdminCoupons] = useState(INITIAL_ADMIN_COUPONS);

  // Admin Managed Live Website Schedule Cards
  const [scheduleCards, setScheduleCards] = useState(INITIAL_SCHEDULE_DATA);

  // Individual Founder & Startup Registration State
  const [teamData, setTeamData] = useState({
    fullName: 'Jordan Taylor',
    email: 'jordan.taylor@stanford.edu',
    phone: '+91 98765 43210',
    city: 'Mumbai, MH',
    startupName: 'Apex AI Labs',
    sector: 'AI / Machine Learning',
    stage: 'Prototype / MVP',
    website: 'https://apex-ai.tech',
    pitchDeckName: 'Apex_AI_Pitch_Deck_v2.pdf',
    pitchDeckFile: null
  });

  // Selected event (default to CampusShark E-Cell Flagship Event)
  const [selectedEvent, setSelectedEvent] = useState(EVENTS_DATA[0]);
  const [appliedCoupon, setAppliedCoupon] = useState(INITIAL_ADMIN_COUPONS[0]);

  const navigateToStep = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartRegistration = () => {
    navigateToStep(1);
  };

  const handleFormSubmit = (data) => {
    setTeamData(data);
    navigateToStep(2);
  };

  const handleCompleteRegistration = () => {
    navigateToStep(3);
  };

  const handleReset = () => {
    navigateToStep(1);
  };

  // Open Admin Access
  const handleOpenAdminAccess = () => {
    if (isAdminLoggedIn) {
      setIsDashboardModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (user) => {
    setIsAdminLoggedIn(true);
    setAdminUser(user);
    setIsLoginModalOpen(false);
    setIsDashboardModalOpen(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    setIsDashboardModalOpen(false);
  };

  // Dynamic Event Track Handlers
  const handleAddEvent = (newEvent) => {
    setEventsList(prev => [newEvent, ...prev]);
  };

  const handleDeleteEvent = (eventIdToDelete) => {
    if (eventsList.length <= 1) return; // Retain at least 1 event
    const updatedEvents = eventsList.filter(e => e.id !== eventIdToDelete);
    setEventsList(updatedEvents);
    
    // If selected event was deleted, select first remaining event
    if (selectedEvent && selectedEvent.id === eventIdToDelete) {
      setSelectedEvent(updatedEvents[0]);
    }
  };

  // Coupon Handlers
  const handleAddAdminCoupon = (newCoupon) => {
    setAdminCoupons(prev => [newCoupon, ...prev]);
  };

  const handleDeleteAdminCoupon = (codeToDelete) => {
    setAdminCoupons(prev => prev.filter(c => c.code !== codeToDelete));
    if (appliedCoupon && appliedCoupon.code === codeToDelete) {
      setAppliedCoupon(null);
    }
  };

  // Schedule Card Handlers
  const handleAddScheduleCard = (newCard) => {
    setScheduleCards(prev => [newCard, ...prev]);
  };

  const handleDeleteScheduleCard = (cardId) => {
    setScheduleCards(prev => prev.filter(c => c.id !== cardId));
  };

  return (
    <>
      {/* Dynamic Animated Mesh Ambient Background */}
      <div className="bg-ambient">
        <div className="ambient-blob blob-1" />
        <div className="ambient-blob blob-2" />
        <div className="ambient-blob blob-3" />
      </div>
      <div className="grid-overlay" />

      <div className="app-container">
        <Header 
          currentStep={currentStep} 
          onStepClick={(step) => navigateToStep(step)}
          onOpenAdminDrawer={handleOpenAdminAccess}
          isAdminLoggedIn={isAdminLoggedIn}
          adminUser={adminUser}
        />

        <main style={{ flex: 1 }}>
          {currentStep === 0 && (
            <>
              <LandingHero onStartRegistration={handleStartRegistration} />
              
              {/* Dynamic Animated Schedule Section (Admin Managed) */}
              <ScheduleSection scheduleCards={scheduleCards} />
            </>
          )}

          {currentStep === 1 && (
            <TeamForm 
              initialData={teamData} 
              onSubmitForm={handleFormSubmit} 
            />
          )}

          {currentStep === 2 && (
            <EventCouponSelection
              teamData={teamData}
              selectedEvent={selectedEvent}
              eventsList={eventsList}
              appliedCoupon={appliedCoupon}
              adminCoupons={adminCoupons}
              onSelectEvent={(evt) => setSelectedEvent(evt)}
              onApplyCoupon={(c) => setAppliedCoupon(c)}
              onBack={() => navigateToStep(1)}
              onCompleteRegistration={handleCompleteRegistration}
              onOpenAdminDrawer={handleOpenAdminAccess}
            />
          )}

          {currentStep === 3 && (
            <TicketPass
              teamData={teamData}
              selectedEvent={selectedEvent}
              appliedCoupon={appliedCoupon}
              onReset={handleReset}
            />
          )}
        </main>

        <Footer />
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Dashboard Modal / Control Center */}
      <AdminDashboardModal
        isOpen={isDashboardModalOpen}
        onClose={() => setIsDashboardModalOpen(false)}
        adminUser={adminUser}
        onLogout={handleAdminLogout}
        eventsList={eventsList}
        onAddEvent={handleAddEvent}
        onDeleteEvent={handleDeleteEvent}
        adminCoupons={adminCoupons}
        onAddCoupon={handleAddAdminCoupon}
        onDeleteCoupon={handleDeleteAdminCoupon}
        scheduleCards={scheduleCards}
        onAddScheduleCard={handleAddScheduleCard}
        onDeleteScheduleCard={handleDeleteScheduleCard}
        onSelectCouponForCheckout={(coupon) => {
          setAppliedCoupon(coupon);
          if (currentStep < 2) navigateToStep(2);
        }}
      />
    </>
  );
}
