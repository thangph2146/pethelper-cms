import axios from 'axios';
import { AuthService } from '@/services/auth.service';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu token hết hạn (401) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Kiểm tra session
        const isValid = await AuthService.validateSession();
        if (!isValid) {
          // Nếu session không hợp lệ, logout và redirect về login
          await AuthService.logout();
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }

        // Lấy token mới từ session
        const token = AuthService.getToken();
        if (token) {
          // Cập nhật token cho request hiện tại
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          // Thử lại request
          return axiosInstance(originalRequest);
        }
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 