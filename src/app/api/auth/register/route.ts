import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateRegisterData } from '@/utils/validation';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate dữ liệu
    validateRegisterData.name(data.name);
    validateRegisterData.email(data.email);
    validateRegisterData.password(data.password);
    if (data.phone) {
      validateRegisterData.phone(data.phone);
    }

    // Đăng ký với Supabase
    const { data: supabaseData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          phone: data.phone
        }
      }
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
      user: {
        id: supabaseData.user?.id,
        email: data.email,
        name: data.name,
        phone: data.phone
      }
    });

  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi đăng ký' },
      { status: 500 }
    );
  }
} 