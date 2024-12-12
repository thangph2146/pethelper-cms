import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Notification from '@backend/models/Notification';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const notification = await Notification.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { error: { message: 'Không tìm thấy thông báo', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }

    return NextResponse.json(notification);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Read notification error:', message);
    return NextResponse.json(
      { error: { message, code: 'READ_NOTIFICATION_ERROR' } },
      { status: 500 }
    );
  }
} 