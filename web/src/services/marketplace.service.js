import api from './api'

export const marketplaceService = {
  createCircuit: (data) => api.post('/marketplace/circuits', data),
  listCircuits: (params) => api.get('/marketplace/circuits', { params }),
  getCircuit: (id) => api.get(`/marketplace/circuits/${id}`),
  createActivity: (data) => api.post('/marketplace/activities', data),
  listActivities: (params) => api.get('/marketplace/activities', { params }),
  getActivity: (id) => api.get(`/marketplace/activities/${id}`),
}
