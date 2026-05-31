import apiClient from '../lib/axios'

export const authApi = {
  getMe: () => apiClient.get('/api/auth/me/'),
  updateMe: (data) => apiClient.patch('/api/auth/me/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  logout: (refresh) => apiClient.post('/api/auth/logout/', { refresh }),
  register: (data) => apiClient.post('/api/auth/register/', data),
}

export const sessionApi = {
  getSessions: (params) => apiClient.get('/api/sessions/', { params }),
  getSession: (id) => apiClient.get(`/api/sessions/${id}/`),
  createSession: (data) => apiClient.post('/api/sessions/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateSession: (id, data) => apiClient.patch(`/api/sessions/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteSession: (id) => apiClient.delete(`/api/sessions/${id}/`),
  getMySessions: () => apiClient.get('/api/sessions/my_sessions/'),
  getCategories: () => apiClient.get('/api/sessions/categories/'),
}

export const bookingApi = {
  createBooking: (data) => apiClient.post('/api/bookings/', data),
  getMyBookings: () => apiClient.get('/api/bookings/mine/'),
  getCreatorBookings: () => apiClient.get('/api/bookings/creator/'),
  updateBookingStatus: (id, status) => apiClient.patch(`/api/bookings/${id}/status/`, { status }),
  createCheckoutSession: (id) => apiClient.post(`/api/bookings/${id}/checkout/`),
  createRazorpayOrder: (bookingId) => apiClient.post(`/api/bookings/razorpay/create/${bookingId}/`),
  confirmRazorpayPayment: (paymentData) => apiClient.post('/api/bookings/razorpay/confirm/', paymentData),
}

