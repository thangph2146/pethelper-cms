import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { AuthError } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Đặt lại mật khẩu mới
    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công'
    });

  } catch (error: unknown) {
    const authError: AuthError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'RESET_PASSWORD_ERROR'
    };
    return NextResponse.json(
      { error: authError },
      { status: 500 }
    );
  }
} 