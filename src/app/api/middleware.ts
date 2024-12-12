import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { ApiError } from 'next/dist/server/api-utils';

// Định nghĩa interface cho decoded JWT payload
interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

// Định nghĩa interface cho request với user
interface RequestWithUser extends Request {
  user: JWTPayload;
}

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as JWTPayload;
    const requestWithUser = request as unknown as RequestWithUser;
    requestWithUser.user = decoded;
    return NextResponse.next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Token không hợp lệ';
    console.error('Auth middleware error:', message);
    return NextResponse.json(
      { error: { message, code: 'AUTH_ERROR' } },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ['/api/:path*']
};

export function withErrorHandler<T>(handler: (req: Request) => Promise<T>) {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error: unknown) {
      console.error('API Error:', error);
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );  
      }
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
} 