import { connectDB } from '@/lib/mongodb';
import { Post } from '@backend/models/Post';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    const status = searchParams.get('status');
    const animalType = searchParams.get('animalType');
    const search = searchParams.get('search');

    const query: any = {};
    if (status) query.status = status;
    if (animalType) query.animalType = animalType;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    await connectDB();
    
    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name image')
        .populate({
          path: 'comments',
          options: { sort: { createdAt: -1 }, limit: 3 },
          populate: { path: 'author', select: 'name image' },
        }),
      Post.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;

    return NextResponse.json({
      data: {
        posts,
        hasNextPage,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json(
      { message: 'Lỗi khi lấy danh sách bài đăng' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content, images, status, location, animalType, contactInfo } = body;

    if (!title || !content || !location || !animalType || !contactInfo) {
      return NextResponse.json(
        { message: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    await connectDB();
    const post = await Post.create({
      title,
      content,
      images: images || [],
      author: session.user.id,
      status,
      location,
      animalType,
      contactInfo,
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name image');

    return NextResponse.json({
      data: populatedPost,
      message: 'Tạo bài đăng thành công',
    });
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json(
      { message: 'Lỗi khi tạo bài đăng' },
      { status: 500 }
    );
  }
} 