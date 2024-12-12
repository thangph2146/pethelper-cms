import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { UserServiceError } from '@/services/user.service';
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

    return NextResponse.json(response);
  } catch (error: any) {
    if (error instanceof UserServiceError) {
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