import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message || 'Đã có lỗi xảy ra khi đặt lại mật khẩu'
      },
      { status: 500 }
    );
  }
} 