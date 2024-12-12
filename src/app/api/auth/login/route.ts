import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';
import { ValidationError } from '@/types/error';
import { errorHandler } from '@/middleware/error-handler';
import { tokenUtils } from '@/utils/token';
import type { LoginData } from '@/types/auth';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 phút

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const loginData: LoginData = {
      email: body.email,
      password: body.password
    };

    // Kiểm tra user có tồn tại
    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        status: true,
        loginAttempts: true,
        lockUntil: true
      }
    });

    if (!user) {
      throw new ValidationError('Email hoặc mật khẩu không chính xác', 401, 'form');
    }

    // Kiểm tra trạng thái tài khoản
    if (user.status === 'banned') {
      throw new ValidationError('Tài khoản đã bị khóa', 403, 'form');
    }

    // Kiểm tra khóa tạm thời
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 1000 / 60);
      throw new ValidationError(
        `Tài khoản tạm thời bị khóa, vui lòng thử lại sau ${remainingTime} phút`,
        429,
        'form'
      );
    }

    // Kiểm tra password
    const isValidPassword = await compare(loginData.password, user.password);
    if (!isValidPassword) {
      // Tăng số lần đăng nhập thất bại
      const loginAttempts = (user.loginAttempts || 0) + 1;
      
      // Khóa tài khoản nếu vượt quá số lần cho phép
      const lockUntil = loginAttempts >= MAX_LOGIN_ATTEMPTS 
        ? new Date(Date.now() + LOCK_TIME)
        : null;

      await prisma.user.update({
        where: { id: user.id },
        data: { 
          loginAttempts,
          lockUntil
        }
      });

      if (lockUntil) {
        throw new ValidationError('Đăng nhập sai quá nhiều lần, tài khoản bị khóa 15 phút', 429, 'form');
      }

      throw new ValidationError(
        `Email hoặc mật khẩu không đúng (còn ${MAX_LOGIN_ATTEMPTS - loginAttempts} lần thử)`,
        401,
        'form'
      );
    }

    // Reset login attempts sau khi đăng nhập thành công
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockUntil: null,
        lastLoginAt: new Date()
      }
    });

    // Tạo token
    const token = tokenUtils.generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Loại bỏ các thông tin nhạy cảm
    const { password: _, loginAttempts: __, lockUntil: ___, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: safeUser,
      token
    });

  } catch (error) {
    return errorHandler(error);
  }
} 