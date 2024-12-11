import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Notification from '@backend/models/Notification';

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    await Notification.updateMany(
      { 
        userId: session.user.id,
        isRead: false 
      },
      { isRead: true }
    );

    return NextResponse.json({ message: 'Đã đánh dấu tất cả là đã đọc' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật thông báo' },
      { status: 500 }
    );
  }
} 