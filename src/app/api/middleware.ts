import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Bỏ qua route đăng nhập và đăng ký
  if (
    request.nextUrl.pathname === '/api/auth/login' ||
    request.nextUrl.pathname === '/api/auth/register'
  ) {
    return NextResponse.next();
  }

  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Không có quyền truy cập' },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const requestWithUser = request as any;
    requestWithUser.user = decoded;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Token không hợp lệ' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ['/api/:path*']
}; 