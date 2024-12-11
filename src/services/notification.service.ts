import axios from 'axios';
import type { INotification } from '@backend/models/Notification';

interface NotificationInput {
  type: 'new_post' | 'comment' | 'status_change';
  userId: string;
  postId?: string;
  commentId?: string;
  message: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const NotificationService = {
  async getNotifications(): Promise<INotification[]> {
    const response = await axios.get<ApiResponse<INotification[]>>('/api/notifications');
    return response.data.data;
  },

  async createNotification(data: NotificationInput): Promise<INotification> {
    const response = await axios.post<ApiResponse<INotification>>('/api/notifications', data);
    return response.data.data;
  },

  async markAsRead(id: string): Promise<void> {
    await axios.patch(`/api/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await axios.patch('/api/notifications/read-all');
  },

  async deleteNotification(id: string): Promise<void> {
    await axios.delete(`/api/notifications/${id}`);
  }
}; 