import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { LoginData, LoginResponse, RegisterData, ValidateSessionResponse } from '@/types/auth';
import { validateLoginData, validateRegisterData } from '@/utils/validation';
import axios from '@/utils/axios';
import { ValidationError } from '@/types/error';
import { RegisterResponse } from '@/types/auth';

export class AuthService {
  private static supabase = createClientComponentClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });

  static async login(loginData: LoginData): Promise<LoginResponse> {
    try {
      // Validate dữ liệu đầu vào
      validateLoginData.email(loginData.email);
      validateLoginData.password(loginData.password);

      // Đăng nhập với Supabase
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (authError) {
        throw new ValidationError(authError.message, 'form');
      }

      if (!authData.user) {
        throw new ValidationError('Có lỗi xảy ra khi đăng nhập', 'form');
      }

      // Lấy thông tin user từ bảng users
      const { data: userData, error: userError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError || !userData) {
        throw new ValidationError('Không tìm thấy thông tin người dùng', 'form');
      }

      // Kiểm tra trạng thái tài khoản
      if (userData.status === 'blocked') {
        throw new ValidationError('Tài khoản bị khóa', 'form');
      }

      if (userData.status === 'pending') {
        throw new ValidationError('Vui lòng xác thực email trước khi đăng nhập', 'form');
      }

      const user = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
      };

      // Lưu session token và user info
      localStorage.setItem('token', authData.session?.access_token || '');
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        message: 'Đăng nhập thành công',
        user,
        token: authData.session?.access_token || '',
      };

    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        error.message || 'Có lỗi xảy ra khi đăng nhập',
        'form'
      );
    }
  }

  static async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error || !session) {
        this.logout();
        return false;
      }
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  static async logout(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return !!session;
  }

  static async getCurrentUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    // Lấy thêm thông tin từ bảng users
    const { data: userData } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return userData;
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

      // Đăng ký user với Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            name: registerData.name,
            phone: registerData.phone || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          throw new ValidationError('Email đã được sử dụng', 'email');
        }
        throw new ValidationError(authError.message, 'form');
      }

      if (!authData.user) {
        throw new ValidationError('Có lỗi xảy ra khi đăng ký', 'form');
      }

      // Tạo profile trong bảng users
      const { error: profileError } = await this.supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: registerData.email,
            name: registerData.name,
            phone: registerData.phone || null,
            status: 'pending',
            role: 'user'
          }
        ]);

      if (profileError) {
        throw new ValidationError('Có lỗi xảy ra khi tạo profile', 'form');
      }

    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        error.message || 'Có lỗi xảy ra khi đăng ký',
        'form'
      );
    }
  }

  static async hasRole(role: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === role;
  }

  static async isActive(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.status === 'active';
  }

  static async verifyEmail(token: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });

      if (error) {
        throw new ValidationError(error.message, 'form');
      }

      // Cập nhật trạng thái user trong bảng users
      const { data: { user }, error: sessionError } = await this.supabase.auth.getUser();
      
      if (sessionError || !user) {
        throw new ValidationError('Không tìm thấy thông tin người dùng', 'form');
      }

      const { error: updateError } = await this.supabase
        .from('users')
        .update({ status: 'active' })
        .eq('id', user.id);

      if (updateError) {
        throw new ValidationError('Có lỗi xảy ra khi cập nhật trạng thái', 'form');
      }

    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        error.message || 'Có lỗi xảy ra khi xác thực email',
        'form'
      );
    }
  }

  static async resendVerification(email: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw new ValidationError(error.message, 'form');
      }
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        error.message || 'Có lỗi xảy ra khi gửi lại email xác thực',
        'form'
      );
    }
  }
}