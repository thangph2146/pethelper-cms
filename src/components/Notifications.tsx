'use client';
import { useState } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  isRead: boolean;
}

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Bài đăng mới cần hỗ trợ",
      message: "Có một trường hợp khẩn cấp cần được giúp đỡ tại Quận 1",
      type: "warning",
      createdAt: "2024-03-15 14:30",
      isRead: false
    },
    {
      id: 2,
      title: "Cập nhật trạng thái",
      message: "Bài đăng của bạn đã được duyệt",
      type: "success",
      createdAt: "2024-03-15 10:15",
      isRead: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  return (
    <div className="relative">
      {/* Nút thông báo */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Danh sách thông báo */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold">Thông báo</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b dark:border-gray-700 ${
                  !notification.isRead ? 'bg-blue-50 dark:bg-gray-700' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className={`w-2 h-2 mt-2 rounded-full mr-3 ${
                    notification.type === 'warning' ? 'bg-yellow-500' :
                    notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold">{notification.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500 mt-2 block">
                      {notification.createdAt}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t dark:border-gray-700">
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))}
            >
              Đánh dấu tất cả là đã đọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 