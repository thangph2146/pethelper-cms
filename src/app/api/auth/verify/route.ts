import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { User } from '@backend/models/User';
import connectDB from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập để tiếp tục' }, 
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Phiên đăng nhập đã hết hạn' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'Tài khoản không tồn tại hoặc đã bị khóa' },
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      valid: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    );
  }
} 