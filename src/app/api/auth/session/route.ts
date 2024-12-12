import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { SessionResponse } from '@/types/auth';

export async function GET(): Promise<Response> {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Lấy session hiện tại
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    // Nếu có session, lấy thêm thông tin user từ database
    if (session?.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error('Lỗi khi lấy thông tin user:', userError);
      }

      return NextResponse.json<SessionResponse>({
        session,
        user: userData,
        error: null
      });
    }

    return NextResponse.json<SessionResponse>({
      session: null,
      error: null
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi lấy thông tin session';
    return NextResponse.json<SessionResponse>(
      {
        error: {
          message,
          code: 'SESSION_ERROR'
        },
        session: null
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Đăng xuất và xóa session
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng xuất thành công'
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi đăng xuất';
    return NextResponse.json(
      { error: { message, code: 'LOGOUT_ERROR' } },
      { status: 500 }
    );
  }
} 