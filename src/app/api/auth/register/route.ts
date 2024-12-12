import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';
import { ValidationError } from '@/types/error';
import { errorHandler } from '@/middleware/error-handler';
import { validateRegisterData } from '@/utils/validation';
import type { RegisterData } from '@/types/auth';

const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const registerData: RegisterData = {
      email: body.email,
      password: body.password,
      name: body.name,
      phone: body.phone
    };

    // Validate dữ liệu đầu vào
    validateRegisterData.email(registerData.email);
    validateRegisterData.password(registerData.password);
    validateRegisterData.name(registerData.name);
    if (registerData.phone) {
      validateRegisterData.phone(registerData.phone);
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { email: registerData.email }
    });

    if (existingUser) {
      throw new ValidationError('Email đã được sử dụng', 409, 'email');
    }

    // Hash password
    const hashedPassword = await hash(registerData.password, SALT_ROUNDS);

    // Tạo user mới
    const user = await prisma.user.create({
      data: {
        email: registerData.email,
        password: hashedPassword,
        name: registerData.name,
        phone: registerData.phone,
        status: 'active',
        role: 'user',
        loginAttempts: 0
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công',
      user
    });

  } catch (error) {
    return errorHandler(error);
  }
} 