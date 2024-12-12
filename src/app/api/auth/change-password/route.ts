import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/common';

export async function POST(request: Request): Promise<Response> {
  try {
    const { newPassword } = await request.json();
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

    return NextResponse.json<ApiResponse<{ message: string }>>({ 
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error: unknown) {
    return NextResponse.json<ApiResponse<{ message: string }>>({
      success: false,
      error: {
        code: 'CHANGE_PASSWORD_ERROR',
        details: {
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }, { status: 500 });
  }
} 