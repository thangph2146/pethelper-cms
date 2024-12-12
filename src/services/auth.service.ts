import { LoginFormState, RegisterFormState } from '@/types/form';

export class AuthService {
  static async login({ email, password }: Pick<LoginFormState, 'email' | 'password'>) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          field: 'form',
          message: data.error || 'Đã có lỗi xảy ra khi đăng nhập'
        };
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  static async validateSession() {
    try {
      const response = await fetch('/api/auth/validate-session');
      const data = await response.json();
      return data.valid;
    } catch (error) {
      return false;
    }
  }

  static async logout() {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Đã có lỗi xảy ra khi đăng xuất');
      }

      // Xóa thông tin ghi nhớ đăng nhập
      try {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('rememberMe');
      } catch (error) {
        console.error('Lỗi khi xóa thông tin ghi nhớ đăng nhập:', error);
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  static async verifyEmail(token: string) {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          field: 'form',
          message: data.error || 'Đã có lỗi xảy ra khi xác thực email'
        };
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  static async resendVerification(email: string) {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.error || 'Đã có lỗi xảy ra khi gửi lại email xác thực'
        };
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  static async getSession() {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!response.ok) {
        throw {
          field: 'form',
          message: data.error || 'Đã có lỗi xảy ra khi lấy thông tin session'
        };
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  static async register({ email, password, name }: Omit<RegisterFormState, 'confirmPassword'>) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          field: 'form',
          message: data.error || 'Đã có lỗi xảy ra khi đăng ký'
        };
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  static async forgotPassword(email: string) {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.error || 'Đã có lỗi xảy ra khi gửi email khôi phục mật khẩu'
        };
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  static async resetPassword(password: string) {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.error || 'Đã có lỗi xảy ra khi đặt lại mật khẩu'
        };
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  }
}