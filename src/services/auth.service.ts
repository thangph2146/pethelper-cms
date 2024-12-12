import axiosInstance from '@/utils/axiosInstance';
import type { IUser } from '@/backend/models/User';
import { UserService } from '@/services/user.service';

interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthResponse {
  user: IUser;
  token: string;
}

export const AuthService = {
  // Đăng nhập
   login: async (data: LoginData) => {
    const response = await axiosInstance.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  // Đăng ký - phiên bản client
  register: async (data: RegisterData) => {
    const response = await axiosInstance.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  // Đăng ký - phiên bản server
  registerServer: async (data: RegisterData) => {
    const user = await UserService.createUser(data);
    
    return {
      success: true,
      message: 'Đăng ký thành công',
      user
    };
  },

  // Đăng xuất
  logout: async () => {
    const response = await axiosInstance.post('/api/auth/logout');
    return response.data;
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    const response = await axiosInstance.get<IUser>('/api/auth/me');
    return response.data;
  },

  // Cập nhật thông tin user
  updateProfile: async (data: FormData) => {
    const response = await axiosInstance.put<IUser>('/api/auth/me', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Đổi mật khẩu
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await axiosInstance.put('/api/auth/password', data);
    return response.data;
  },

  // Quên mật khẩu
  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  // Reset mật khẩu
  resetPassword: async (token: string, password: string) => {
    const response = await axiosInstance.post(`/api/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  },
}
