import api from './api'

export const paymentService = {
  create: (data) => api.post('/payments', data),
  getStatus: (id) => api.get(`/payments/${id}`),
  refund: (id) => api.post(`/payments/${id}/refund`),
}
