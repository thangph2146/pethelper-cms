import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export function useRealtimeNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    // Kết nối WebSocket
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

    ws.onopen = () => {
      // Đăng ký nhận thông báo cho user
      ws.send(JSON.stringify({
        type: 'subscribe',
        userId: user.id
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Cập nhật cache
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Hiển thị toast thông báo
      toast(data.message, {
        action: {
          label: 'Xem',
          onClick: () => {
            // Điều hướng đến bài viết/thông báo
          }
        }
      });
    };

    return () => {
      ws.close();
    };
  }, [user, queryClient]);
} 