import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Post } from '@backend/models/Post';
import { ApiError } from 'next/dist/server/api-utils';
import { Pagination } from '@/types/api';
import { ApiResponse } from '@/types/common';
export async function GET(req: Request) {
  try {
   

    const { searchParams } = new URL(req.url);
    
    interface PostQuery {
      status?: string;
      $or?: Array<{
        title?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
      }>;
    }
    const query: PostQuery = {};
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

    return NextResponse.json<ApiResponse<{posts: typeof Post[]; pagination: Pagination}>>({ 
      success: true, 
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
        { error: (error as ApiError).message },
        { status: (error as ApiError).statusCode }
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
   
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: (error as ApiError).message },
        { status: (error as ApiError).statusCode }
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
    const { ids } = await req.json();

    await Post.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      message: 'Đã xóa các bài đăng thành công'
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: (error as ApiError).message },
        { status: (error as ApiError).statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Lỗi khi xóa bài đăng' },
      { status: 500 }
    );
  }
} 