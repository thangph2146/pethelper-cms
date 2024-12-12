import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { ApiError } from '@/types/error';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      // Exchange code for session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        throw error;
      }

      // Redirect to success URL
      return NextResponse.redirect(new URL(next, request.url));
      
    } catch (error: unknown) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'AUTH_CALLBACK_ERROR'
      };
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/error?error=${encodeURIComponent(
          apiError.message
        )}`
      );
    }
  }

  // Return 400 if code is missing
  return NextResponse.json(
    { error: 'Code không hợp lệ hoặc đã hết hạn' },
    { status: 400 }
  );
} 