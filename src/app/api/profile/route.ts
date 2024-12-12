import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Lấy thông tin profile
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Lấy thông tin chi tiết từ bảng users
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(profile);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Profile error:', message);
    return NextResponse.json(
      { error: { message, code: 'PROFILE_ERROR' } },
      { status: 500 }
    );
  }
}

// Cập nhật thông tin profile
export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const data = await request.json();
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Cập nhật thông tin trong bảng users
    const { data: profile, error } = await supabase
      .from('users')
      .update({
        name: data.name,
        phone: data.phone,
        address: data.address,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(profile);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Profile error:', message);
    return NextResponse.json(
      { error: { message, code: 'PROFILE_ERROR' } },
      { status: 500 }
    );
  }
} 