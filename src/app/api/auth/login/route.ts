import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { User, IUser } from '@backend/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    console.log('Đang kết nối với MongoDB...');
    await connectToMongoDB();
    console.log('Đã kết nối với MongoDB');
    
    const { email, password } = await req.json();

    // Kiểm tra user tồn tại và lấy cả password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    // Kiểm tra trạng thái tài khoản
    if (user.status === 'banned') {
      return NextResponse.json(
        { error: 'Tài khoản đã bị khóa vĩnh viễn' },
        { status: 401 }
      );
    }

    if (user.status === 'inactive') {
      return NextResponse.json(
        { error: 'Tài khoản chưa được kích hoạt' },
        { status: 401 }
      );
    }

    // Kiểm tra khóa tạm thời
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 1000 / 60);
      return NextResponse.json(
        { error: `Tài khoản tạm thời bị khóa, vui lòng thử lại sau ${remainingTime} phút` },
        { status: 429 }
      );
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Tăng số lần đăng nhập thất bại
      user.loginAttempts += 1;
      
      // Khóa tài khoản tạm thời nếu sai quá 5 lần
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // khóa 15 phút
        await user.save();
        return NextResponse.json(
          { error: 'Đăng nhập sai quá nhiều lần, tài khoản bị khóa 15 phút' },
          { status: 429 }
        );
      }
      
      await user.save();

      return NextResponse.json(
        { error: `Email hoặc mật khẩu không chính xác (còn ${5 - user.loginAttempts} lần thử)` },
        { status: 401 }
      );
    }

    // Reset số lần đăng nhập thất bại và cập nhật thời gian hoạt động
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastActive = new Date();
    await user.save();

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    return NextResponse.json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra khi đăng nhập!' },
      { status: 500 }
    );
  }
} 