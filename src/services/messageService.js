import { messageApi } from './api';

export const messageService = {
  sendMessage: async (messageData) => {
    const response = await messageApi.post('/messages', messageData);
    return response.data;
  },

  getMessageById: async (id) => {
    const response = await messageApi.get(`/messages/${id}`);
    return response.data;
  },

  getSentMessages: async (userId) => {
    const response = await messageApi.get(`/messages/sent/${userId}`);
    return response.data;
  },

  getReceivedMessages: async (userId) => {
    const response = await messageApi.get(`/messages/received/${userId}`);
    return response.data;
  },

  getUnreadCount: async (userId) => {
    const response = await messageApi.get(`/messages/unread/count/${userId}`);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await messageApi.put(`/messages/${id}/read`);
    return response.data;
  },
};
