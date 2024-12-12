import { useState, useEffect } from 'react';
import { NotificationService } from '@/services/notification.service';
import type { INotification } from '@backend/models/Notification';

interface NotificationResponse {
  notifications: INotification[];
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await NotificationService.getNotifications() as unknown as NotificationResponse;
      setNotifications(response.notifications);
      setUnreadCount(response.notifications.filter(n => !n.isRead).length);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setUnreadCount(prev => 
        notifications.find(n => n._id === notificationId)?.isRead ? prev : prev - 1
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications
  };
}; 