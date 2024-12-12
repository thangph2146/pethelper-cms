'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { toast } from 'react-hot-toast';
import { useLoading } from '@/providers/loading-provider';
import { Spinner } from '@/components/ui/spinner';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  email_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setLoading: setGlobalLoading } = useLoading();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { session, user } = await AuthService.getSession();
      if (session && user) {
        setUser(user);
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra session:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setGlobalLoading(true);
    try {
      const { session, user } = await AuthService.login({ email, password });
      if (session && user) {
        setUser(user);
        toast.success('Đăng nhập thành công');
      }
    } catch (error: any) {
      toast.error(error.message || 'Đăng nhập thất bại');
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const logout = async () => {
    setGlobalLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      router.push('/auth/login');
      router.refresh();
      toast.success('Đăng xuất thành công');
    } catch (error: any) {
      toast.error('Đã có lỗi xảy ra khi đăng xuất');
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const { session, user } = await AuthService.getSession();
      if (session && user) {
        setUser(user);
      }
    } catch (error) {
      console.error('Lỗi khi refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="md" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 