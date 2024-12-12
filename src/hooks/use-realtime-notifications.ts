import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import type { INotification } from '@/types/notification';

export function useRealtimeNotifications(userId: string) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socketClient = io(process.env.NEXT_PUBLIC_SOCKET_URL || '');

    socketClient.on('connect', () => {
      socketClient.emit('join', { userId });
      setLoading(false);
    });

    socketClient.on('notification', (notification: INotification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    socketClient.on('disconnect', () => {
      setLoading(true);
    });

    return () => {
      socketClient.disconnect();
    };
  }, [userId]);

  return {
    notifications,
    loading
  };
} 