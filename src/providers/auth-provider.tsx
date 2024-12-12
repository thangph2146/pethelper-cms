'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Kiểm tra session khi component mount
    checkUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          user: session?.user || null,
          loading: false
        }));

        if (event === 'SIGNED_OUT') {
          router.push('/auth/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setState(prev => ({
        ...prev,
        user,
        loading: false
      }));
    } catch (error: unknown) {
      const authError = error as AuthError;
      setState(prev => ({
        ...prev,
        error: authError.message,
        loading: false
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        user,
        error: null
      }));

      router.push('/');
    } catch (error: unknown) {
      const authError = error as AuthError;
      setState(prev => ({
        ...prev,
        error: authError.message
      }));
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setState(prev => ({
        ...prev,
        user: null,
        error: null
      }));
    } catch (error: unknown) {
      const authError = error as AuthError;
      setState(prev => ({
        ...prev,
        error: authError.message
      }));
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 