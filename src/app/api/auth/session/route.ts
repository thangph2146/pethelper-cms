import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { tokenUtils } from '@/utils/token';
import { errorHandler } from '@/middleware/error-handler';
import { ValidationError } from '@/types/error';

export async function POST(request: Request) {
  try {
    const { token, deviceInfo, expiresAt } = await request.json();
    
    // Verify token để lấy userId
    const decoded = tokenUtils.verifyToken(token);
    
    // Tạo session mới
    await prisma.session.create({
      data: {
        userId: decoded.id,
        token,
        deviceInfo,
        expiresAt: new Date(expiresAt)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorHandler(error);
  }
}

export async function GET(request: Request) {
  try {
    const token = tokenUtils.getTokenFromHeader(request.headers.get('Authorization'));
    if (!token) {
      return NextResponse.json({ status: false });
    }

    // Kiểm tra session trong database
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date() || session.user.status !== 'active') {
      return NextResponse.json({ status: false });
    }

    // Cập nhật lastActivity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivity: new Date() }
    });

    return NextResponse.json({ 
      status: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        status: session.user.status
      }
    });
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const token = tokenUtils.getTokenFromHeader(request.headers.get('Authorization'));
    if (!token) {
      throw new ValidationError('Token không hợp lệ', 401);
    }

    // Xóa session từ database
    await prisma.session.deleteMany({
      where: { token }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorHandler(error);
  }
} 