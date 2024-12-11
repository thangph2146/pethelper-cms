import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Comment from '@backend/models/Comment';
import { ApiError } from '@/lib/api';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new ApiError('Unauthorized', 401);
    }

    await dbConnect();
    const { content } = await req.json();

    const comment = await Comment.findById(params.commentId);
    if (!comment) {
      throw new ApiError('Không tìm thấy bình luận', 404);
    }

    if (comment.author.toString() !== session.user.id && session.user.role !== 'admin') {
      throw new ApiError('Không có quyền chỉnh sửa', 403);
    }

    comment.content = content;
    await comment.save();
    await comment.populate('author', 'name image');

    return NextResponse.json({ data: comment });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật bình luận' },
      { status: 500 }
    );
  }
} 