import { signIn, signOut, useSession } from 'next-auth/react';
import type { LoginData } from '@/types/auth';

export class UserService {
  static async login(data: LoginData) {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Có lỗi xảy ra khi đăng nhập');
    }
  }

  static async logout() {
    await signOut({ redirect: true, callbackUrl: '/auth/login' });
  }

  static useUser() {
    const { data: session, status } = useSession();
    return {
      user: session?.user,
      isLoading: status === 'loading',
      isAuthenticated: status === 'authenticated'
    };
  }
} 