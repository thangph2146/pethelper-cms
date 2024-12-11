import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { User, IUser } from '@backend/models/User';
import { connectToMongoDB } from '@/lib/mongodb';

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
    
    await connectToMongoDB();
    
    const user = await User.findOne({
      _id: decoded.userId,
      status: 'active'
    }).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'Tài khoản không tồn tại hoặc đã bị khóa' },
        { status: 401 }
      );
    }

    if (user.lastActive) {
      const inactiveTime = Date.now() - user.lastActive.getTime();
      const maxInactiveTime = 30 * 24 * 60 * 60 * 1000; // 30 ngày
      
      if (inactiveTime > maxInactiveTime) {
        return NextResponse.json(
          { error: 'Tài khoản không hoạt động quá lâu, vui lòng đăng nhập lại' },
          { status: 401 }
        );
      }
    }

    await User.findByIdAndUpdate(user._id, {
      lastActive: new Date()
    });

    return NextResponse.json({ 
      valid: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
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