'use client';

import { useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { User, AuthError } from '@supabase/supabase-js';

interface SignUpData {
  email: string;
  password: string;
  metadata?: {
    name: string;
    avatar_url?: string;
  };
}

interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export function useSupabase() {
  const supabaseRef = useRef<SupabaseClient>(supabase);

  const signUp = useCallback(
    async (data: SignUpData): Promise<AuthResponse> => {
      const { data: { user, session }, error } = await supabaseRef.current.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: data.metadata
        }
      });
      return { user, session, error };
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      const { data: { user, session }, error } = await supabaseRef.current.auth.signInWithPassword({
        email,
        password
      });
      return { user, session, error };
    },
    []
  );

  const signOut = useCallback(
    async (): Promise<{ error: AuthError | null }> => {
      const { error } = await supabaseRef.current.auth.signOut();
      return { error };
    },
    []
  );

  const resetPassword = useCallback(
    async (email: string): Promise<{ error: AuthError | null }> => {
      const { error } = await supabaseRef.current.auth.resetPasswordForEmail(email);
      return { error };
    },
    []
  );

  const updatePassword = useCallback(
    async (newPassword: string): Promise<{ error: AuthError | null }> => {
      const { error } = await supabaseRef.current.auth.updateUser({
        password: newPassword
      });
      return { error };
    },
    []
  );

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };
} 