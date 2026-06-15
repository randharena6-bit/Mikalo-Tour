import api from './api'

export const searchService = {
  all: (params) => api.get('/search', { params }),
  filters: (params) => api.get('/search/filters', { params }),
}
