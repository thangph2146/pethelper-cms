import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Notification from '@backend/models/Notification';

export async function POST() {
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
      { userId: session.user.id, isRead: false },
      { isRead: true }
    );

    return NextResponse.json({ message: 'Đã đánh dấu tất cả là đã đọc' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Read all notifications error:', message);
    return NextResponse.json(
      { error: { message, code: 'READ_ALL_NOTIFICATIONS_ERROR' } },
      { status: 500 }
    );
  }
} 