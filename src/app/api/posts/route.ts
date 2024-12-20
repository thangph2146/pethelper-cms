import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { errorHandler } from '@/middleware/error-handler';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(posts);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Post error:', message);
    return NextResponse.json(
      { error: { message, code: 'POST_ERROR' } },
      { status: 500 }
    );
  }
} 