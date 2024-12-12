import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { UserServiceError } from '@/services/user.service';
import { ValidationError } from '@/utils/validation';
import type { RegisterData, AuthResponse } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const registerData: RegisterData = {
      name: body.name,
      email: body.email,
      password: body.password
    };

    if (body.phone) {
      registerData.phone = body.phone;
    }

    const response = await AuthService.registerServer(registerData);

    return NextResponse.json<AuthResponse>({
      success: true,
      message: 'Đăng ký thành công',
      user: response.user
    });

  } catch (error) {
    if (error instanceof UserServiceError || error instanceof ValidationError) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.message 
        },
        { status: error.status }
      );
    }

    console.error('Register error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Có lỗi xảy ra khi đăng ký' 
      },
      { status: 500 }
    );
  }
} 