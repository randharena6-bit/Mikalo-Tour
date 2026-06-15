import api from './api'

export const dashboardService = {
  guide: () => api.get('/dashboard/guide'),
  agency: () => api.get('/dashboard/agency'),
  admin: () => api.get('/dashboard/admin'),
}
