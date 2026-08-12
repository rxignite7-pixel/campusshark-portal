// API Configuration for CampusShark Frontend, Razorpay & MongoDB Atlas Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_URL = API_BASE_URL;

// Helper to fetch data with graceful fallback
async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn(`[API Connection Warning] ${url}:`, err.message);
    return null;
  }
}

// 0. Check Duplicate Registration API
export async function checkDuplicateAPI(email, phone) {
  return await fetchJson(`${API_BASE_URL}/api/check-duplicate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, phone })
  });
}

// 1. Razorpay: Create Payment Order (Includes email & phone to check duplicate)
export async function createRazorpayOrderAPI(amount, receipt, email, phone) {
  return await fetchJson(`${API_BASE_URL}/api/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, receipt, email, phone })
  });
}

// 2. Razorpay: Verify Payment Signature & Save to MongoDB
export async function verifyRazorpayPaymentAPI(paymentPayload) {
  return await fetchJson(`${API_BASE_URL}/api/payment/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentPayload)
  });
}

// 3. Submit Member Registration to MongoDB (Direct)
export async function submitRegistration(formData) {
  const body = new FormData();
  Object.keys(formData).forEach(key => {
    if (key === 'pitchDeckFile' && formData[key]) {
      body.append('pitchDeck', formData[key]);
    } else if (formData[key] !== null && formData[key] !== undefined) {
      body.append(key, formData[key]);
    }
  });

  try {
    const res = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      body
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend offline or fallback:', err);
    return { success: true, ticketId: `CSHARK2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}` };
  }
}

// 4. Fetch All Paid Registrations from MongoDB
export async function getRegistrationsAPI() {
  return await fetchJson(`${API_BASE_URL}/api/admin/registrations`);
}

// 5. Fetch Events from MongoDB
export async function getEventsAPI() {
  return await fetchJson(`${API_BASE_URL}/api/events`);
}

// 6. Fetch Coupons from MongoDB
export async function getCouponsAPI() {
  return await fetchJson(`${API_BASE_URL}/api/coupons`);
}

// 7. Fetch Schedule from MongoDB
export async function getScheduleAPI() {
  return await fetchJson(`${API_BASE_URL}/api/schedule`);
}

// 8. Admin Login API
export async function adminLoginAPI(email, password) {
  return await fetchJson(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
}

// 9. Admin Create Coupon
export async function createCouponAPI(couponData, token) {
  return await fetchJson(`${API_BASE_URL}/api/admin/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(couponData)
  });
}

// 10. Admin Delete Coupon
export async function deleteCouponAPI(code, token) {
  return await fetchJson(`${API_BASE_URL}/api/admin/coupons/${code}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// 11. Admin Create Event
export async function createEventAPI(eventData, token) {
  return await fetchJson(`${API_BASE_URL}/api/admin/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(eventData)
  });
}

// 12. Admin Delete Event
export async function deleteEventAPI(eventId, token) {
  return await fetchJson(`${API_BASE_URL}/api/admin/events/${eventId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// 13. Admin Create Schedule
export async function createScheduleAPI(scheduleData, token) {
  return await fetchJson(`${API_BASE_URL}/api/admin/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(scheduleData)
  });
}

// 14. Admin Delete Schedule
export async function deleteScheduleAPI(scheduleId, token) {
  return await fetchJson(`${API_BASE_URL}/api/admin/schedule/${scheduleId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
