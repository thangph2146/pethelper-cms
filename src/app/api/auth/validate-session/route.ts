import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Kiểm tra session hiện tại
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    // Nếu có session, kiểm tra thông tin user trong database
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
        valid: true,
        user: userData
      });
    }

    return NextResponse.json({ valid: false });
  } catch (error) {
    return NextResponse.json({ valid: false });
  }
} 