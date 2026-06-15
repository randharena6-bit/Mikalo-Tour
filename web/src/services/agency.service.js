import api from './api'

export const agencyService = {
  create: (data) => api.post('/agencies', data),
  getMyAgency: () => api.get('/agencies/me'),
  update: (data) => api.put('/agencies', data),
  recruitGuide: (guideId) => api.post(`/agencies/recruit/${guideId}`),
  getQRCode: () => api.get('/agencies/qr-code'),
  list: (params) => api.get('/agencies', { params }),
  getById: (id) => api.get(`/agencies/${id}`),
}
