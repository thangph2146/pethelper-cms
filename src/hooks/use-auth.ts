import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';

interface User {
  id: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface Session {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [session, setSession] = useState<Session>({
    user: null,
    session: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const data = await AuthService.getSession();
      setSession({
        user: data.user,
        session: data.session,
        loading: false,
        error: null
      });
    } catch (error: any) {
      setSession({
        user: null,
        session: null,
        loading: false,
        error: error.message
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await AuthService.login({ email, password });
      await checkSession();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setSession({
        user: null,
        session: null,
        loading: false,
        error: null
      });
      router.push('/auth/login');
    } catch (error: any) {
      setSession(prev => ({
        ...prev,
        error: error.message
      }));
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const data = await AuthService.verifyEmail(token);
      await checkSession();
      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    user: session.user,
    session: session.session,
    loading: session.loading,
    error: session.error,
    login,
    logout,
    verifyEmail,
    checkSession
  };
} 