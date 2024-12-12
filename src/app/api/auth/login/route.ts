import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Đăng nhập với Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Lưu/cập nhật thông tin user vào bảng users
    if (authData.user) {
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: authData.user.id,
          email: authData.user.email,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (upsertError) {
        console.error('Lỗi khi cập nhật thông tin user:', upsertError);
      }
    }

    return NextResponse.json(authData);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Đã có lỗi xảy ra' },
      { status: 500 }
    );
  }
} 