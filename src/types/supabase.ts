import type { SupabaseClient, User } from '@supabase/supabase-js';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          address: string | null
          avatar_url: string | null
          status: 'active' | 'inactive' | 'banned'
          role: 'admin' | 'user'
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          status?: 'active' | 'inactive' | 'banned'
          role?: 'admin' | 'user'
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          status?: 'active' | 'inactive' | 'banned'
          role?: 'admin' | 'user'
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          content: string
          user_id: string
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          user_id: string
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          user_id?: string
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_status: 'active' | 'inactive' | 'banned'
      user_role: 'admin' | 'user'
      post_status: 'draft' | 'published' | 'archived'
    }
  }
}

export interface SupabaseResource {
  id: string;
  created_at: string;
  user_id: string;
}

export interface SupabaseUser {
  id: string;
  email: string;
  email_verified: boolean;
  app_metadata: {
    role?: 'admin' | 'user';
    provider?: string;
  };
  user_metadata: {
    name?: string;
    phone?: string;
    address?: string;
  };
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: SupabaseUser;
}

export type Tables = Database['public']['Tables']
export type UserRow = Tables['users']['Row']
export type PostRow = Tables['posts']['Row']

export interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

export interface AuthResponse {
  user: User | null;
  error: SupabaseError | null;
}

export interface SupabaseContext {
  supabase: SupabaseClient;
  user: User | null;
} 