import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export async function middleware(request: NextRequest) {
  try {
    // Khởi tạo response
    const res = NextResponse.next()
    
    // Khởi tạo Supabase client với request và response
    const supabase = createMiddlewareClient({ req: request, res })

    // Kiểm tra session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Lấy pathname từ URL
    const { pathname } = request.nextUrl;

    // Nếu đã đăng nhập và truy cập trang auth, redirect về trang chủ
    if (session && publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Nếu chưa đăng nhập và truy cập trang yêu cầu auth, redirect về trang login
    if (!session && !publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return res;
  } catch (error) {
    // Log lỗi và redirect về trang login
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// Chỉ áp dụng middleware cho các routes cần bảo vệ
export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/posts/:path*',
    '/auth/:path*'
  ]
}; 