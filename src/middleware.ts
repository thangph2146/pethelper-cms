import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các route không cần auth
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/',
  '/posts'
];

// Các route cần auth
const protectedRoutes = [
  '/profile',
  '/posts/create',
  '/posts/my-posts',
  '/api/profile',
  '/api/auth/change-password',
  '/api/posts/create'
];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Kiểm tra session
  const { data: { session }, error } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Kiểm tra nếu là route được bảo vệ
  const isProtectedRoute = protectedRoutes.some(path => 
    pathname.startsWith(path)
  );

  // Kiểm tra nếu là route public
  const isPublicRoute = publicRoutes.some(path => 
    pathname.startsWith(path)
  );

  // Nếu là route được bảo vệ và không có session
  if (isProtectedRoute && (!session || error)) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Nếu đã đăng nhập và truy cập trang auth
  if (session && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Refresh session nếu cần
  if (session) {
    await supabase.auth.getUser();
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 