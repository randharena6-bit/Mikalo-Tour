import api from './api'

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings/my', { params }),
  getGuideBookings: (params) => api.get('/bookings/guide', { params }),
  getAgencyBookings: (params) => api.get('/bookings/agency', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
}
