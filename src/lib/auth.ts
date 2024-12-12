import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { supabase } from './supabase';
import type { AuthError } from '@supabase/supabase-js';

export async function getSession() {
  const token = cookies().get('token')?.value;

  if (!token) return null;

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return verified.payload;
  } catch {
    return null;
  }
}

export async function updateSession(token: string) {
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  });
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error: unknown) {
    const authError = error as AuthError;
    throw new Error(authError.message || 'Đăng nhập thất bại');
  }
} 