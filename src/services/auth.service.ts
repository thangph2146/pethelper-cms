import { LoginData, LoginResponse, RegisterData, ValidateSessionResponse } from '@/types/auth';
import { validateLoginData, validateRegisterData } from '@/utils/validation';
import axios from '@/utils/axios';
import { ValidationError } from '@/types/error';
import { RegisterResponse } from '@/types/auth';
export class AuthService {
  static async login(loginData: LoginData): Promise<LoginResponse> {
    try {
      // Validate dữ liệu đầu vào
      validateLoginData.email(loginData.email);
      validateLoginData.password(loginData.password);

      const { data } = await axios.post<LoginResponse>('/api/auth/login', loginData);

      if (!data.success) {
        throw new ValidationError(data.message);
      }

      // Lưu token và user info vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Cập nhật token cho axios instance
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      // Tạo session sau khi login thành công
      await this.createSession(data.token);

      return data;
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new ValidationError(error.response.data.message, 401, 'form');
          case 403:
            throw new ValidationError('Tài khoản bị khóa', 403, 'form');
          case 429:
            throw new ValidationError(error.response.data.message, 429, 'form');
          default:
            throw new ValidationError(error.response.data.message || 'Có lỗi xảy ra khi đăng nhập', 500, 'form');
        }
      }
      throw error;
    }
  }

  static async createSession(token: string): Promise<void> {
    try {
      const deviceInfo = this.getDeviceInfo();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Token hết hạn sau 7 ngày

      await axios.post('/api/auth/session', {
        token,
        deviceInfo,
        expiresAt
      });
    } catch (error) {
      console.error('Create session error:', error);
    }
  }

  static async validateSession(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const { data } = await axios.get<ValidateSessionResponse>('/api/auth/session');
      return data.status;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await axios.delete('/api/auth/session');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  static getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

  static getDeviceInfo(): string {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    return `${platform} - ${userAgent}`;
  }

  static async register(registerData: RegisterData): Promise<void> {
    try {
      // Validate dữ liệu đầu vào
      validateRegisterData.name(registerData.name);
      validateRegisterData.email(registerData.email);
      validateRegisterData.password(registerData.password);
      if (registerData.phone) {
        validateRegisterData.phone(registerData.phone);
      }

      const { data } = await axios.post<RegisterResponse>('/api/auth/register', registerData);

      if (!data.success) {
        throw new ValidationError(data.message);
      }
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 409:
            throw new ValidationError('Email đã được sử dụng', 409, 'email');
          default:
            throw new ValidationError(
              error.response.data.message || 'Có lỗi xảy ra khi đăng ký',
              error.response.status,
              'form'
            );
        }
      }
      throw error;
    }
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  static hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  static isActive(): boolean {
    const user = this.getCurrentUser();
    return user?.status === 'active';
  }

  static async verifyEmail(token: string): Promise<void> {
    try {
      const { data } = await axios.post<RegisterResponse>('/api/auth/verify', { token });
      
      if (!data.success) {
        throw new ValidationError(data.message);
      }
    } catch (error: any) {
      if (error.response) {
        throw new ValidationError(
          error.response.data.message || 'Có lỗi xảy ra khi xác thực email',
          error.response.status,
          'form'
        );
      }
      throw error;
    }
  }

  static async resendVerification(email: string): Promise<void> {
    try {
      const { data } = await axios.post<RegisterResponse>('/api/auth/verify/resend', { email });
      
      if (!data.success) {
        throw new ValidationError(data.message);
      }
    } catch (error: any) {
      if (error.response) {
        throw new ValidationError(
          error.response.data.message || 'Có lỗi xảy ra khi gửi lại email xác thực',
          error.response.status,
          'form'
        );
      }
      throw error;
    }
  }
}