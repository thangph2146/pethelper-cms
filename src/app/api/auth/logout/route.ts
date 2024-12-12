import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { AuthError } from '@/types/auth';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const authError: AuthError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'LOGOUT_ERROR'
    };
    return NextResponse.json(
      { error: authError },
      { status: 500 }
    );
  }
} 