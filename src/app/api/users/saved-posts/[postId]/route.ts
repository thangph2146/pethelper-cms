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
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $addToSet: { savedPosts: params.postId } },
      { new: true }
    );

    return NextResponse.json({ message: 'Đã lưu bài đăng' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi lưu bài đăng' },
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
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $pull: { savedPosts: params.postId } },
      { new: true }
    );

    return NextResponse.json({ message: 'Đã bỏ lưu bài đăng' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi khi bỏ lưu bài đăng' },
      { status: 500 }
    );
  }
} 