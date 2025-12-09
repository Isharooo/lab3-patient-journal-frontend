import { describe, it, expect, vi, beforeEach } from 'vitest';
import { messageService } from '../../services/messageService';
import { messageApi } from '../../services/api';

vi.mock('../../services/api', () => ({
  messageApi: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe('messageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('sends a new message', async () => {
      const messageData = {
        senderId: 'user-1',
        recipientId: 'user-2',
        subject: 'Test',
        content: 'Hello',
      };
      const createdMessage = { id: 1, ...messageData };
      messageApi.post.mockResolvedValue({ data: createdMessage });

      const result = await messageService.sendMessage(messageData);

      expect(messageApi.post).toHaveBeenCalledWith('/messages', messageData);
      expect(result).toEqual(createdMessage);
    });
  });

  describe('getReceivedMessages', () => {
    it('fetches received messages for a user', async () => {
      const mockMessages = [
        { id: 1, subject: 'Message 1' },
        { id: 2, subject: 'Message 2' },
      ];
      messageApi.get.mockResolvedValue({ data: mockMessages });

      const result = await messageService.getReceivedMessages('user-123');

      expect(messageApi.get).toHaveBeenCalledWith('/messages/received/user-123');
      expect(result).toEqual(mockMessages);
    });
  });

  describe('getSentMessages', () => {
    it('fetches sent messages for a user', async () => {
      const mockMessages = [{ id: 1, subject: 'Sent Message' }];
      messageApi.get.mockResolvedValue({ data: mockMessages });

      const result = await messageService.getSentMessages('user-123');

      expect(messageApi.get).toHaveBeenCalledWith('/messages/sent/user-123');
      expect(result).toEqual(mockMessages);
    });
  });

  describe('markAsRead', () => {
    it('marks a message as read', async () => {
      const updatedMessage = { id: 1, read: true };
      messageApi.put.mockResolvedValue({ data: updatedMessage });

      const result = await messageService.markAsRead(1);

      expect(messageApi.put).toHaveBeenCalledWith('/messages/1/read');
      expect(result).toEqual(updatedMessage);
    });
  });

  describe('getUnreadCount', () => {
    it('fetches unread message count', async () => {
      messageApi.get.mockResolvedValue({ data: 5 });

      const result = await messageService.getUnreadCount('user-123');

      expect(messageApi.get).toHaveBeenCalledWith('/messages/unread/count/user-123');
      expect(result).toBe(5);
    });
  });
});
