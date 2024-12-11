import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { User } from '@/backend/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    // Kết nối database
    await connectToMongoDB();

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }

    // Tạo user mới - password sẽ được hash tự động bởi middleware
    await User.create({
      name,
      email,
      password,
      phone,
      status: 'active',
      role: 'user'
    });

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công',
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi đăng ký' },
      { status: 500 }
    );
  }
} 