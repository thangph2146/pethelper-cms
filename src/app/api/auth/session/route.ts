import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
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

      return NextResponse.json({
        session,
        user: userData
      });
    }

    return NextResponse.json({ session: null });

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message || 'Đã có lỗi xảy ra khi lấy thông tin session',
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

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Đã có lỗi xảy ra khi đăng xuất' },
      { status: 500 }
    );
  }
} 