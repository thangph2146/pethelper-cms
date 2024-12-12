import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!session?.user) {
      return NextResponse.json(
        { error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
        { status: 401 }
      );
    }

    const { data: savedPosts, error: postsError } = await supabase
      .from('saved_posts')
      .select('post_id, post:posts(*)')
      .eq('user_id', session.user.id);

    if (postsError) {
      throw postsError;
    }

    return NextResponse.json(savedPosts);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Saved posts error:', message);
    return NextResponse.json(
      { error: { message, code: 'SAVED_POSTS_ERROR' } },
      { status: 500 }
    );
  }
} 