import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { tokenUtils } from '@/utils/token';
import prisma from '@/lib/prisma';
import { AuthenticationError, AuthorizationError } from '@/types/error';

export async function authMiddleware(request: NextRequest) {
  try {
    // Lấy token từ header
    const token = tokenUtils.getTokenFromHeader(request.headers.get('Authorization'));
    
    if (!token) {
      throw new AuthenticationError('Không tìm thấy token xác thực');
    }

    // Verify token
    const decoded = tokenUtils.verifyToken(token);

    // Kiểm tra session trong database
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      throw new AuthenticationError('Session không hợp lệ hoặc đã hết hạn');
    }

    // Kiểm tra trạng thái user
    if (session.user.status !== 'active') {
      throw new AuthorizationError('Tài khoản không hoạt động');
    }

    // Thêm user info vào headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', session.user.id);
    requestHeaders.set('x-user-role', session.user.role);
    requestHeaders.set('x-session-id', session.id);

    // Cập nhật lastActivity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivity: new Date() }
    });

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Lỗi xác thực' },
      { status: 401 }
    );
  }
}

export function adminMiddleware(request: NextRequest) {
  const userRole = request.headers.get('x-user-role');
  
  if (userRole !== 'admin') {
    throw new AuthorizationError('Không có quyền truy cập');
  }

  return NextResponse.next();
}

// Helper function để lấy user info từ request
export function getUserFromRequest(request: NextRequest) {
  return {
    id: request.headers.get('x-user-id'),
    role: request.headers.get('x-user-role'),
    sessionId: request.headers.get('x-session-id')
  };
} 