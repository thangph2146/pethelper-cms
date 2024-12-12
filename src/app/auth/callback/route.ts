import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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
      
    } catch (error: any) {
      // Redirect to error page with message
      const errorUrl = new URL('/auth/error', request.url);
      errorUrl.searchParams.set('error', error.message);
      return NextResponse.redirect(errorUrl);
    }
  }

  // Return 400 if code is missing
  return NextResponse.json(
    { error: 'Code không hợp lệ hoặc đã hết hạn' },
    { status: 400 }
  );
} 