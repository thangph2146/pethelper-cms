import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (!token || type !== 'email') {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Xác thực email với Supabase
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });

    if (error) {
      throw error;
    }

    // Cập nhật trạng thái xác thực trong bảng users
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          email_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Lỗi khi cập nhật trạng thái xác thực:', updateError);
      }
    }

    // Redirect về trang login với thông báo thành công
    return NextResponse.redirect(
      new URL('/auth/login?verified=true', request.url)
    );

  } catch (error: any) {
    // Redirect về trang error với thông báo lỗi
    const errorUrl = new URL('/auth/error', request.url);
    errorUrl.searchParams.set('error', error.message || 'Xác thực email thất bại');
    return NextResponse.redirect(errorUrl);
  }
} 