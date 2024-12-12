import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ValidationError } from '@/types/error';
import { errorHandler } from '@/middleware/error-handler';
import { tokenUtils } from '@/utils/token';

// Xác thực email
export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) {
      throw new ValidationError('Token xác thực không hợp lệ', 400);
    }

    // Verify token
    const decoded = tokenUtils.verifyToken(token);

    // Tìm user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      throw new ValidationError('Người dùng không tồn tại', 404);
    }

    if (user.status === 'active') {
      throw new ValidationError('Email đã được xác thực', 400);
    }

    // Cập nhật trạng thái user
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        status: 'active',
        emailVerifiedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Xác thực email thành công'
    });

  } catch (error) {
    return errorHandler(error);
  }
}

// Gửi lại email xác thực
export async function PUT(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      throw new ValidationError('Email là bắt buộc', 400);
    }

    // Tìm user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new ValidationError('Email không tồn tại', 404);
    }

    if (user.status === 'active') {
      throw new ValidationError('Email đã được xác thực', 400);
    }

    // Tạo verification token
    const token = tokenUtils.generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // TODO: Gửi email xác thực
    // await sendVerificationEmail(user.email, token);

    return NextResponse.json({
      success: true,
      message: 'Đã gửi lại email xác thực'
    });

  } catch (error) {
    return errorHandler(error);
  }
} 