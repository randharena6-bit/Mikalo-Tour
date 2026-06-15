import api from './api'

export const guideService = {
  createProfile: (data) => api.post('/guides/profile', data),
  getMyProfile: () => api.get('/guides/profile/me'),
  updateProfile: (data) => api.put('/guides/profile', data),
  uploadCertification: (data) => api.post('/guides/certifications', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getQRCode: () => api.get('/guides/qr-code'),
  list: (params) => api.get('/guides', { params }),
  getById: (id) => api.get(`/guides/${id}`),
}
