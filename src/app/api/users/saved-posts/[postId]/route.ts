import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import { User } from '@backend/models/User';

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
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
    const { id: userId } = session.user;
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedPosts: params.postId } }
    );

    return NextResponse.json({ message: 'Đã lưu bài đăng' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Saved post error:', message);
    return NextResponse.json(
      { error: { message, code: 'SAVE_POST_ERROR' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
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
    const { id: userId } = session.user;
    await User.findByIdAndUpdate(
      userId,
      { $pull: { savedPosts: params.postId } }
    );

    return NextResponse.json({ message: 'Đã bỏ lưu bài đăng' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Delete file error:', message);
    return NextResponse.json(
      { error: { message, code: 'DELETE_FILE_ERROR' } },
      { status: 500 }
    );
  }
} 