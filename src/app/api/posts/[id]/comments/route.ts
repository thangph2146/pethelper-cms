import { connectDB } from '@/lib/mongodb';
import { Post } from '@backend/models/Post';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { Types } from 'mongoose';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { content } = await req.json();
    if (!content) {
      return NextResponse.json(
        { message: 'Nội dung bình luận là bắt buộc' },
        { status: 400 }
      );
    }

    await connectDB();
    const post = await Post.findById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { message: 'Không tìm thấy bài đăng' },
        { status: 404 }
      );
    }

    post.comments.push({
      user: new Types.ObjectId(session.user.id),
      content,
      createdAt: new Date(),
    });

    await post.save();

    const populatedPost = await Post.findById(params.id)
      .populate('comments.user', 'name image');

    if (!populatedPost) {
      return NextResponse.json(
        { message: 'Lỗi khi lấy thông tin bình luận' },
        { status: 500 }
      );
    }

    return NextResponse.json(populatedPost.comments[populatedPost.comments.length - 1]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Comment error:', message);
    return NextResponse.json(
      { error: { message, code: 'COMMENT_ERROR' } },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const post = await Post.findById(params.id)
      .populate('comments.userId', 'name image');

    if (!post) {
      return NextResponse.json(
        { error: { message: 'Không tìm thấy bài đăng', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }

    return NextResponse.json(post.comments);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Get comments error:', message);
    return NextResponse.json(
      { error: { message, code: 'GET_COMMENTS_ERROR' } },
      { status: 500 }
    );
  }
} 