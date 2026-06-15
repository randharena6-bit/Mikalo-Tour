import api from './api'

export const messageService = {
  createConversation: (data) => api.post('/messages/conversations', data),
  getConversations: () => api.get('/messages/conversations'),
  getConversationMessages: (id, params) => api.get(`/messages/conversations/${id}`, { params }),
  sendMessage: (id, data) => api.post(`/messages/conversations/${id}/messages`, data),
  markAsRead: (id) => api.put(`/messages/conversations/${id}/read`),
}
