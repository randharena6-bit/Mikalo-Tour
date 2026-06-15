import api from './api'

export const postService = {
  create: (data) => api.post('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getFeed: (params) => api.get('/posts/feed', { params }),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  like: (id) => api.put(`/posts/${id}/like`),
  delete: (id) => api.delete(`/posts/${id}`),
}
