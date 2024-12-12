import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { AuthError } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Đăng ký user mới với Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: {
          name // Lưu tên vào metadata của auth user
        }
      }
    });

    if (authError) {
      throw authError;
    }

    if (authData.user) {
      // Tạo profile trong bảng users
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        // Nếu tạo profile lỗi, xóa auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.'
    });

  } catch (error: unknown) {
    const authError: AuthError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'REGISTER_ERROR'
    };
    return NextResponse.json(
      { error: authError },
      { status: 500 }
    );
  }
} 