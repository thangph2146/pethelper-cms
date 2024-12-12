import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Gửi lại email xác thực
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.'
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: { message, code: 'RESEND_VERIFICATION_ERROR' } },
      { status: 500 }
    );
  }
} 