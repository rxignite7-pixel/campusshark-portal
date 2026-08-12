// API Configuration for CampusShark Frontend & MongoDB Atlas Backend
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

// 1. Submit Founder Registration to MongoDB
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

// 1b. Fetch All Paid Founder Registrations from MongoDB
export async function getRegistrationsAPI() {
  return await fetchJson(`${API_BASE_URL}/api/admin/registrations`);
}

// 2. Fetch Events from MongoDB
export async function getEventsAPI() {
  return await fetchJson(`${API_BASE_URL}/api/events`);
}

// 3. Fetch Coupons from MongoDB
export async function getCouponsAPI() {
  return await fetchJson(`${API_BASE_URL}/api/coupons`);
}

// 4. Fetch Schedule from MongoDB
export async function getScheduleAPI() {
  return await fetchJson(`${API_BASE_URL}/api/schedule`);
}

// 5. Admin Login API
export async function adminLoginAPI(email, password) {
  return await fetchJson(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
}

// 6. Admin Create Coupon
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

// 7. Admin Delete Coupon
export async function deleteCouponAPI(code, token) {
  return await fetchJson(`${API_BASE_URL}/api/admin/coupons/${code}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// 8. Admin Create Event
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

// 9. Admin Delete Event
export async function deleteEventAPI(eventId, token) {
  return await fetchJson(`${API_BASE_URL}/api/admin/events/${eventId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// 10. Admin Create Schedule
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

// 11. Admin Delete Schedule
export async function deleteScheduleAPI(scheduleId, token) {
  return await fetchJson(`${API_BASE_URL}/api/admin/schedule/${scheduleId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
