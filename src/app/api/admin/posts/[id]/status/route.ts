import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import { Post } from '@backend/models/Post';
import { ApiError } from '@/lib/api';
import { isAdmin } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session)) {
      throw new ApiError('Unauthorized', 401);
    }

    await dbConnect();
    const { status } = await req.json();

    // Validate status
    if (!['cần_giúp_đỡ', 'đang_hỗ_trợ', 'đã_giải_quyết'].includes(status)) {
      throw new ApiError('Trạng thái không hợp lệ', 400);
    }

    const post = await Post.findByIdAndUpdate(
      params.id,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('author', 'name email image');

    if (!post) {
      throw new ApiError('Không tìm thấy bài đăng', 404);
    }

    return NextResponse.json({
      data: post
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật trạng thái' },
      { status: 500 }
    );
  }
} 