import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import { Post } from '@backend/models/Post';
import { ApiError, handleApiError } from '@/lib/api';

// POST /api/posts/[id]/save - Lưu bài đăng
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new ApiError('Unauthorized', 401);
    }

    await dbConnect();

    const post = await Post.findById(params.id);
    if (!post) {
      throw new ApiError('Không tìm thấy bài đăng', 404);
    }

    // Thêm user vào danh sách đã lưu
    if (!post.savedBy.includes(session.user.id)) {
      await Post.findByIdAndUpdate(params.id, {
        $push: { savedBy: session.user.id }
      });
    }

    return NextResponse.json({
      message: 'Đã lưu bài đăng'
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/posts/[id]/save - Bỏ lưu bài đăng
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new ApiError('Unauthorized', 401);
    }

    await dbConnect();

    const post = await Post.findById(params.id);
    if (!post) {
      throw new ApiError('Không tìm thấy bài đăng', 404);
    }

    // Xóa user khỏi danh sách đã lưu
    await Post.findByIdAndUpdate(params.id, {
      $pull: { savedBy: session.user.id }
    });

    return NextResponse.json({
      message: 'Đã bỏ lưu bài đăng'
    });
  } catch (error) {
    return handleApiError(error);
  }
} 