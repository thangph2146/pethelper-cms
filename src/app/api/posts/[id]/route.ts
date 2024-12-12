import { connectDB } from '@/lib/mongodb';
import { Post } from '@backend/models/Post';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const post = await Post.findById(params.id)
      .populate('author', 'name image')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name image' },
      });

    if (!post) {
      return NextResponse.json(
        { message: 'Không tìm thấy bài đăng' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Post error:', message);
    return NextResponse.json(
      { error: { message, code: 'POST_ERROR' } },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    await connectDB();
    
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json(
        { message: 'Không tìm thấy bài đăng' },
        { status: 404 }
      );
    }

    if (post.author.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'Không có quyền chỉnh sửa bài đăng này' },
        { status: 403 }
      );
    }

    const updatedPost = await Post.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    ).populate('author', 'name image');

    return NextResponse.json({
      data: updatedPost,
      message: 'Cập nhật bài đăng thành công',
    });
  } catch (error) {
    console.error('Error in PUT /api/posts/[id]:', error);
    return NextResponse.json(
      { message: 'Lỗi khi cập nhật bài đăng' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
        { status: 401 }
      );
    }

    await connectDB();
    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json(
        { error: { message: 'Không tìm thấy bài đăng', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }

    if (post.authorId.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: { message: 'Không có quyền xóa', code: 'FORBIDDEN' } },
        { status: 403 }
      );
    }

    await post.deleteOne();
    return NextResponse.json({ message: 'Xóa bài đăng thành công' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Delete post error:', message);
    return NextResponse.json(
      { error: { message, code: 'DELETE_POST_ERROR' } },
      { status: 500 }
    );
  }
} 