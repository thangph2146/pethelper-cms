import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { NotificationService } from '@/services/notification.service';
import type { INotification } from '@backend/models/Notification';

export const useRealtimeNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Kết nối socket
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
      query: { userId }
    });

    setSocket(newSocket);

    // Lấy thông báo ban đầu
    const fetchNotifications = async () => {
      const data = await NotificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    };

    fetchNotifications();

    // Lắng nghe thông báo mới
    newSocket.on('notification', (notification: INotification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      newSocket.close();
    };
  }, [userId]);

  const markAsRead = async (id: string) => {
    await NotificationService.markAsRead(id);
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => prev - 1);
  };

  const markAllAsRead = async () => {
    await NotificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
}; 