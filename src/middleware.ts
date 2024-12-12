import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { tokenUtils } from '@/utils/token';
import {  prisma } from '@/lib/prisma';

// Các route không cần auth
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/session'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cho phép truy cập public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Kiểm tra token trong header
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    // Nếu là API route thì trả về lỗi
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    // Nếu là page route thì redirect về login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    // Verify token
    const decoded = tokenUtils.verifyToken(token);

    // Kiểm tra session trong database
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      throw new Error('Session không hợp lệ hoặc đã hết hạn');
    }

    // Kiểm tra trạng thái user
    if (session.user.status !== 'active') {
      throw new Error('Tài khoản không hoạt động');
    }

    // Kiểm tra quyền truy cập các route admin
    if (pathname.startsWith('/admin') && session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Cập nhật lastActivity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivity: new Date() }
    });

    // Thêm user info vào headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', session.user.id);
    requestHeaders.set('x-user-role', session.user.role);
    requestHeaders.set('x-session-id', session.id);

    // Tiếp tục với request đã được xác thực
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error) {
    // Token không hợp lệ hoặc session hết hạn
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Invalid token or session expired' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// Chỉ áp dụng middleware cho các route cần thiết
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 