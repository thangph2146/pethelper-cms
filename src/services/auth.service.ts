import { supabase } from '@/lib/supabase';
import type { User, AuthError, AuthResponse } from '@supabase/supabase-js';

interface SignUpData {
  email: string;
  password: string;
  metadata?: {
    name: string;
    avatar_url?: string;
  };
}

interface AuthResult {
  user: User | null;
  session: AuthResponse['data']['session'];
}

export class AuthService {
  static async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: data.metadata
        }
      });

      if (error) throw error;

      return {
        user: authData.user,
        session: authData.session
      };
    } catch (error: unknown) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Đăng ký thất bại');
    }
  }

  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return {
        user: authData.user,
        session: authData.session
      };
    } catch (error: unknown) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Đăng nhập thất bại');
    }
  }

  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: unknown) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Đăng xuất thất bại');
    }
  }

  static async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    } catch (error: unknown) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Cập nhật mật khẩu thất bại');
    }
  }

  static async getSession(): Promise<AuthResult> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (!session) {
        throw new Error('Không tìm thấy session');
      }

      return {
        user: session.user,
        session
      };
    } catch (error: unknown) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Lấy thông tin session thất bại');
    }
  }

  static async forgotPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error: unknown) {
      const authError = error as AuthError;
      throw new Error(authError.message || 'Gửi email khôi phục mật khẩu thất bại');
    }
  }

  static async resetPassword(password: string, token: string): Promise<void> {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi đặt lại mật khẩu");
      }

      return response.json();
    } catch (error) {
      throw new Error("Có lỗi xảy ra khi đặt lại mật khẩu");
    }
  }
}