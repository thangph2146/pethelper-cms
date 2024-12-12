import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { AuthError } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Gửi email reset password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.'
    });

  } catch (error: unknown) {
    const authError: AuthError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'FORGOT_PASSWORD_ERROR'
    };
    return NextResponse.json(
      { error: authError },
      { status: 500 }
    );
  }
} 