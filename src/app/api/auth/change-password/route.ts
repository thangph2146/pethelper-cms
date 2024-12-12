import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Lấy session hiện tại
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Đổi mật khẩu
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Đã có lỗi xảy ra khi đổi mật khẩu' },
      { status: 500 }
    );
  }
} 