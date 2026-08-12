import React, { useState, useEffect } from 'react';
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
import { 
  submitRegistration, 
  getEventsAPI, 
  getCouponsAPI, 
  getScheduleAPI,
  createCouponAPI,
  deleteCouponAPI,
  createEventAPI,
  deleteEventAPI,
  createScheduleAPI,
  deleteScheduleAPI,
  adminLoginAPI
} from './config/api';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); // 0: Hero, 1: Form, 2: Event & Coupon, 3: Ticket Pass
  
  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);

  // Dynamic MongoDB Collections State
  const [eventsList, setEventsList] = useState(EVENTS_DATA);
  const [adminCoupons, setAdminCoupons] = useState(INITIAL_ADMIN_COUPONS);
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

  // Selected event
  const [selectedEvent, setSelectedEvent] = useState(EVENTS_DATA[0]);
  const [appliedCoupon, setAppliedCoupon] = useState(INITIAL_ADMIN_COUPONS[0]);

  // Fetch initial collections from MongoDB API on mount
  useEffect(() => {
    async function loadData() {
      const dbEvents = await getEventsAPI();
      if (dbEvents && dbEvents.length > 0) {
        setEventsList(dbEvents);
        setSelectedEvent(dbEvents[0]);
      }

      const dbCoupons = await getCouponsAPI();
      if (dbCoupons && dbCoupons.length > 0) {
        setAdminCoupons(dbCoupons);
        setAppliedCoupon(dbCoupons[0]);
      }

      const dbSchedule = await getScheduleAPI();
      if (dbSchedule && dbSchedule.length > 0) {
        setScheduleCards(dbSchedule);
      }
    }
    loadData();
  }, []);

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

  // Submit Registration to MongoDB Atlas
  const handleCompleteRegistration = async () => {
    const payload = {
      ...teamData,
      eventId: selectedEvent.id || selectedEvent._id,
      eventTitle: selectedEvent.title,
      appliedCoupon: appliedCoupon ? appliedCoupon.code : 'NONE',
      amountPaid: 150
    };

    // Post to MongoDB backend
    await submitRegistration(payload);
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

  const handleLoginSuccess = async (user, token) => {
    setIsAdminLoggedIn(true);
    setAdminUser(user);
    setAdminToken(token);
    setIsLoginModalOpen(false);
    setIsDashboardModalOpen(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    setAdminToken(null);
    setIsDashboardModalOpen(false);
  };

  // Dynamic Event Track Handlers
  const handleAddEvent = async (newEvent) => {
    setEventsList(prev => [newEvent, ...prev]);
    if (adminToken) {
      await createEventAPI(newEvent, adminToken);
    }
  };

  const handleDeleteEvent = async (eventIdToDelete) => {
    if (eventsList.length <= 1) return;
    const updatedEvents = eventsList.filter(e => (e.id || e._id) !== eventIdToDelete);
    setEventsList(updatedEvents);
    
    if (selectedEvent && (selectedEvent.id || selectedEvent._id) === eventIdToDelete) {
      setSelectedEvent(updatedEvents[0]);
    }

    if (adminToken) {
      await deleteEventAPI(eventIdToDelete, adminToken);
    }
  };

  // Coupon Handlers
  const handleAddAdminCoupon = async (newCoupon) => {
    setAdminCoupons(prev => [newCoupon, ...prev]);
    if (adminToken) {
      await createCouponAPI(newCoupon, adminToken);
    }
  };

  const handleDeleteAdminCoupon = async (codeToDelete) => {
    setAdminCoupons(prev => prev.filter(c => c.code !== codeToDelete));
    if (appliedCoupon && appliedCoupon.code === codeToDelete) {
      setAppliedCoupon(null);
    }

    if (adminToken) {
      await deleteCouponAPI(codeToDelete, adminToken);
    }
  };

  // Schedule Card Handlers
  const handleAddScheduleCard = async (newCard) => {
    setScheduleCards(prev => [newCard, ...prev]);
    if (adminToken) {
      await createScheduleAPI(newCard, adminToken);
    }
  };

  const handleDeleteScheduleCard = async (cardId) => {
    setScheduleCards(prev => prev.filter(c => (c.id || c._id) !== cardId));
    if (adminToken) {
      await deleteScheduleAPI(cardId, adminToken);
    }
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
              
              {/* Dynamic Animated Schedule Section (MongoDB & Admin Managed) */}
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
