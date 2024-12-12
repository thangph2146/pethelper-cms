import type { ApiError } from '@/types/supabase';

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
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'SAVED_POSTS_ERROR'
    };
    console.error('Saved posts error:', apiError);
    return NextResponse.json({ error: apiError }, { status: 500 });
  }
} 