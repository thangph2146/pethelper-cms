import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  // Nếu đã đăng nhập và vào trang auth -> redirect về home
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Nếu chưa đăng nhập và vào trang admin -> redirect về login
  if (!token && isAdminRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Nếu không phải admin mà vào trang admin -> redirect về home
  if (token && isAdminRoute && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Nếu chưa đăng nhập và gọi API cần auth -> trả về lỗi
  if (!token && isApiRoute && !request.nextUrl.pathname.startsWith('/api/auth')) {
    return new NextResponse(
      JSON.stringify({ message: 'Authentication required' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*', '/api/:path*']
}; 