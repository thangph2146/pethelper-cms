import { supabase } from '@/lib/supabase';
import type { AuthError } from '@supabase/supabase-js';

export class TokenService {
  static async getAccessToken(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error('Failed to get access token:', authError.message);
      return null;
    }
  }

  static async refreshToken(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.refreshSession();
      return session?.access_token || null;
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error('Failed to refresh token:', authError.message);
      return null;
    }
  }
} 