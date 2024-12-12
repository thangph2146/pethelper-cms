import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Danh sách các route không cần xác thực
const publicRoutes = ['/api/posts',
   '/api/auth/login', 
   '/api/auth/register', 
   '/api/auth/verify', 
   '/api/auth/session'
];

// Thêm interceptor để xử lý token
axiosInstance.interceptors.request.use((config) => {
  // Kiểm tra nếu là public route thì không thêm token
  if (publicRoutes.some(route => config.url?.startsWith(route))) {
    return config;
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance; 