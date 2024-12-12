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
  async getNotifications(): Promise<ApiResponse<INotification[]>> {
    const response = await axios.get<ApiResponse<INotification[]>>('/api/notifications');
    return response.data;
  },

  async createNotification(data: NotificationInput): Promise<ApiResponse<INotification>> {
    const response = await axios.post<ApiResponse<INotification>>('/api/notifications', data);
    return response.data;
  },

  async markAsRead(id: string): Promise<ApiResponse<void>> {
    const response = await axios.patch<ApiResponse<void>>(`/api/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead(): Promise<ApiResponse<void>> {
    const response = await axios.patch<ApiResponse<void>>('/api/notifications/read-all');
    return response.data;
  },

  async deleteNotification(id: string): Promise<ApiResponse<void> | void> {
    const response = await axios.delete<ApiResponse<void>>(`/api/notifications/${id}`);
    return response.data;
  }
}; 