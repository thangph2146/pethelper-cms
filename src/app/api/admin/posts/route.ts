import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import { Post } from '@backend/models/Post';
import { ApiError } from '@/lib/api';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      throw new ApiError('Unauthorized', 401);
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    
    const query: Record<string, any> = {};
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'name email image')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Post.countDocuments(query)
    ]);

    return NextResponse.json({
      data: {
        posts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách bài đăng' },
      { status: 500 }
    );
  }
}

// Thêm bài đăng mới
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      throw new ApiError('Unauthorized', 401);
    }

    await dbConnect();
    const body = await req.json();

    const post = await Post.create({
      ...body,
      author: session.user.id,
      savedBy: [],
      comments: []
    });

    await post.populate('author', 'name email image');

    return NextResponse.json({
      data: post
    }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Lỗi khi tạo bài đăng' },
      { status: 500 }
    );
  }
}

// Xóa nhiều bài đăng
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'admin') {
      throw new ApiError('Unauthorized', 401);
    }

    await dbConnect();
    const { ids } = await req.json();

    await Post.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      message: 'Đã xóa các bài đăng thành công'
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Lỗi khi xóa bài đăng' },
      { status: 500 }
    );
  }
} 