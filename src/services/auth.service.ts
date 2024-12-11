import axios from '@/lib/axios';
import type { IUser } from '@backend/models/User';


interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: IUser;
  token: string;
}

class AuthService {
  // Đăng nhập
  async login(data: LoginData) {
    const response = await axios.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  }

  // Đăng ký
  async register(data: RegisterData) {
    const response = await axios.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  }

  // Đăng xuất
  async logout() {
    const response = await axios.post('/api/auth/logout');
    return response.data;
  }

  // Lấy thông tin user hiện tại
  async getCurrentUser() {
    const response = await axios.get<IUser>('/api/auth/me');
    return response.data;
  }

  // Cập nhật thông tin user
  async updateProfile(data: FormData) {
    const response = await axios.put<IUser>('/api/auth/me', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Đổi mật khẩu
  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await axios.put('/api/auth/password', data);
    return response.data;
  }

  // Quên mật khẩu
  async forgotPassword(email: string) {
    const response = await axios.post('/api/auth/forgot-password', { email });
    return response.data;
  }

  // Reset mật khẩu
  async resetPassword(token: string, password: string) {
    const response = await axios.post(`/api/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  }
}

export const authService = new AuthService(); 