import api from './api'

export const reviewService = {
  create: (data) => api.post('/reviews', data),
  list: (params) => api.get('/reviews', { params }),
  respond: (id, data) => api.put(`/reviews/${id}/respond`, data),
  markHelpful: (id) => api.put(`/reviews/${id}/helpful`),
}
