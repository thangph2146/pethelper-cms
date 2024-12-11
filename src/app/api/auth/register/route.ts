import  connectDB from '@/lib/mongodb';
import { User } from '@backend/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    
    await connectDB();

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    return NextResponse.json(
      { message: 'Đăng ký thành công', user: { id: user._id, email, name } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Đã có lỗi xảy ra' },
      { status: 500 }
    );
  }
} 